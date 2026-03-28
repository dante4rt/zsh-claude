import { describe, it, expect } from "vitest";
import { buildSystemPrompt, buildUserMessage } from "../src/prompt";

describe("buildSystemPrompt", () => {
  it("returns a non-empty system prompt", () => {
    const prompt = buildSystemPrompt();

    expect(prompt.length).toBeGreaterThan(0);
  });

  it("includes key instructions about output format", () => {
    const prompt = buildSystemPrompt();

    expect(prompt).toContain("Output ONLY the command");
    expect(prompt).toContain("No explanations");
    expect(prompt).toContain("no markdown");
  });

  it("includes OS context", () => {
    const prompt = buildSystemPrompt();

    expect(prompt).toMatch(/macOS|Linux|Windows/);
    expect(prompt).toContain("-compatible commands");
  });

  it("includes instruction for comment handling", () => {
    const prompt = buildSystemPrompt();

    expect(prompt).toContain("starts with #");
  });
});

describe("buildUserMessage", () => {
  it("returns full buffer when cursor is at the end", () => {
    const buffer = "docker ps";
    const message = buildUserMessage(buffer, buffer.length);

    expect(message).toBe("docker ps");
  });

  it("inserts cursor marker when cursor is in the middle", () => {
    const buffer = "docker ps --format";
    const message = buildUserMessage(buffer, 9);

    expect(message).toBe("docker ps[CURSOR] --format");
  });

  it("handles cursor at the beginning", () => {
    const buffer = "docker ps";
    const message = buildUserMessage(buffer, 0);

    expect(message).toBe("[CURSOR]docker ps");
  });

  it("handles empty buffer", () => {
    const message = buildUserMessage("", 0);

    expect(message).toBe("");
  });

  it("handles comment input", () => {
    const buffer = "# list all files";
    const message = buildUserMessage(buffer, buffer.length);

    expect(message).toBe("# list all files");
  });
});
