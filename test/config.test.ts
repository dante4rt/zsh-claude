import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { loadConfig } from "../src/config";
import { writeFileSync, mkdirSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

describe("loadConfig", () => {
  const originalEnv = { ...process.env };
  const tmpConfigDir = join(tmpdir(), "zsh-claude-test-config");
  const tmpConfigFile = join(tmpConfigDir, "config.json");

  beforeEach(() => {
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.ZSH_CLAUDE_MODEL;
    try {
      rmSync(tmpConfigDir, { recursive: true });
    } catch {
      // ignore
    }
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    try {
      rmSync(tmpConfigDir, { recursive: true });
    } catch {
      // ignore
    }
  });

  it("returns defaults when no env vars or config file exist", () => {
    const config = loadConfig("/nonexistent/path/config.json");

    expect(config.apiKey).toBe("");
    expect(config.model).toBe("claude-haiku-4-20250414");
    expect(config.maxTokens).toBe(256);
  });

  it("loads api key from environment variable", () => {
    process.env.ANTHROPIC_API_KEY = "sk-ant-test-key";

    const config = loadConfig("/nonexistent/path/config.json");

    expect(config.apiKey).toBe("sk-ant-test-key");
  });

  it("loads model from environment variable", () => {
    process.env.ZSH_CLAUDE_MODEL = "claude-sonnet-4-20250514";

    const config = loadConfig("/nonexistent/path/config.json");

    expect(config.model).toBe("claude-sonnet-4-20250514");
  });

  it("loads values from config file", () => {
    mkdirSync(tmpConfigDir, { recursive: true });
    writeFileSync(
      tmpConfigFile,
      JSON.stringify({
        apiKey: "sk-ant-file-key",
        model: "claude-sonnet-4-20250514",
        maxTokens: 512,
      }),
    );

    const config = loadConfig(tmpConfigFile);

    expect(config.apiKey).toBe("sk-ant-file-key");
    expect(config.model).toBe("claude-sonnet-4-20250514");
    expect(config.maxTokens).toBe(512);
  });

  it("prioritizes env vars over config file", () => {
    process.env.ANTHROPIC_API_KEY = "sk-ant-env-key";
    process.env.ZSH_CLAUDE_MODEL = "claude-opus-4-20250514";

    mkdirSync(tmpConfigDir, { recursive: true });
    writeFileSync(
      tmpConfigFile,
      JSON.stringify({
        apiKey: "sk-ant-file-key",
        model: "claude-sonnet-4-20250514",
        maxTokens: 1024,
      }),
    );

    const config = loadConfig(tmpConfigFile);

    expect(config.apiKey).toBe("sk-ant-env-key");
    expect(config.model).toBe("claude-opus-4-20250514");
    expect(config.maxTokens).toBe(1024);
  });

  it("handles malformed config file gracefully", () => {
    mkdirSync(tmpConfigDir, { recursive: true });
    writeFileSync(tmpConfigFile, "not valid json{{{");

    const config = loadConfig(tmpConfigFile);

    expect(config.apiKey).toBe("");
    expect(config.model).toBe("claude-haiku-4-20250414");
    expect(config.maxTokens).toBe(256);
  });
});
