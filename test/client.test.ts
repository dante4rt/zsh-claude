import { describe, it, expect, vi, afterEach } from "vitest";
import { getCompletion } from "../src/client";
import type { Config } from "../src/config";

const anthropicConfig: Config = {
  provider: "anthropic",
  apiKey: "sk-ant-test",
  model: "claude-haiku-4-20250414",
  maxTokens: 256,
};

const openrouterConfig: Config = {
  provider: "openrouter",
  apiKey: "sk-or-test",
  model: "anthropic/claude-haiku-4.5",
  maxTokens: 256,
};

describe("getCompletion", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("returns completion text from anthropic on success", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        content: [{ type: "text", text: "ls -la" }],
      }),
    });

    const result = await getCompletion("system", "# list files", anthropicConfig);
    expect(result).toBe("ls -la");
  });

  it("sends correct headers to anthropic", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ content: [{ type: "text", text: "ok" }] }),
    });

    await getCompletion("system", "test", anthropicConfig);

    const [url, options] = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe("https://api.anthropic.com/v1/messages");
    expect(options.headers["x-api-key"]).toBe("sk-ant-test");
    expect(options.headers["anthropic-version"]).toBe("2023-06-01");
  });

  it("returns completion text from openrouter on success", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        choices: [{ message: { content: "docker ps -a" } }],
      }),
    });

    const result = await getCompletion("system", "# list containers", openrouterConfig);
    expect(result).toBe("docker ps -a");
  });

  it("sends correct headers to openrouter", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ choices: [{ message: { content: "ok" } }] }),
    });

    await getCompletion("system", "test", openrouterConfig);

    const [url, options] = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe("https://openrouter.ai/api/v1/chat/completions");
    expect(options.headers["authorization"]).toBe("Bearer sk-or-test");
  });

  it("returns empty string when api key is missing", async () => {
    const noKeyConfig: Config = { ...anthropicConfig, apiKey: "" };
    const result = await getCompletion("system", "test", noKeyConfig);
    expect(result).toBe("");
  });

  it("returns empty string on API error", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: () => Promise.resolve("Unauthorized"),
    });

    const result = await getCompletion("system", "test", anthropicConfig);
    expect(result).toBe("");
  });

  it("returns empty string on network error", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("network down"));

    const result = await getCompletion("system", "test", anthropicConfig);
    expect(result).toBe("");
  });

  it("handles empty choices from openrouter", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ choices: [] }),
    });

    const result = await getCompletion("system", "test", openrouterConfig);
    expect(result).toBe("");
  });

  it("trims whitespace from completion text", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        content: [{ type: "text", text: "  ls -la  \n" }],
      }),
    });

    const result = await getCompletion("system", "test", anthropicConfig);
    expect(result).toBe("ls -la");
  });
});
