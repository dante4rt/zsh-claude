import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getCompletion } from "../src/client";
import type { Config } from "../src/config";

const mockConfig: Config = {
  apiKey: "sk-ant-test-key",
  model: "claude-haiku-4-20250414",
  maxTokens: 256,
};

describe("getCompletion", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("returns completion text on successful response", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [{ type: "text", text: "docker ps --format '{{.Names}}'" }],
      }),
    });

    const result = await getCompletion("system", "docker ps", mockConfig);

    expect(result).toBe("docker ps --format '{{.Names}}'");
    expect(globalThis.fetch).toHaveBeenCalledOnce();
  });

  it("sends correct headers and body", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [{ type: "text", text: "ls -la" }],
      }),
    });

    await getCompletion("test-system", "ls", mockConfig);

    const [url, options] = (globalThis.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0] as [string, RequestInit];

    expect(url).toBe("https://api.anthropic.com/v1/messages");
    expect((options.headers as Record<string, string>)["x-api-key"]).toBe(
      "sk-ant-test-key",
    );
    expect(
      (options.headers as Record<string, string>)["anthropic-version"],
    ).toBe("2023-06-01");

    const body = JSON.parse(options.body as string);
    expect(body.model).toBe("claude-haiku-4-20250414");
    expect(body.max_tokens).toBe(256);
    expect(body.system).toBe("test-system");
    expect(body.messages[0].content).toBe("ls");
  });

  it("returns empty string when api key is missing", async () => {
    const noKeyConfig: Config = { ...mockConfig, apiKey: "" };

    const result = await getCompletion("system", "test", noKeyConfig);

    expect(result).toBe("");
  });

  it("returns empty string on API error", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => "Unauthorized",
    });

    const stderrSpy = vi
      .spyOn(process.stderr, "write")
      .mockImplementation(() => true);

    const result = await getCompletion("system", "test", mockConfig);

    expect(result).toBe("");
    expect(stderrSpy).toHaveBeenCalled();
  });

  it("returns empty string on network error", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const stderrSpy = vi
      .spyOn(process.stderr, "write")
      .mockImplementation(() => true);

    const result = await getCompletion("system", "test", mockConfig);

    expect(result).toBe("");
    expect(stderrSpy).toHaveBeenCalled();
  });

  it("handles response with no text blocks", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [],
      }),
    });

    const result = await getCompletion("system", "test", mockConfig);

    expect(result).toBe("");
  });

  it("trims whitespace from completion text", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [{ type: "text", text: "  ls -la  \n" }],
      }),
    });

    const result = await getCompletion("system", "test", mockConfig);

    expect(result).toBe("ls -la");
  });
});
