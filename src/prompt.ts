import { platform } from "os";

function getOsContext(): string {
  const os = platform();
  if (os === "darwin") return "macOS";
  if (os === "win32") return "Windows";
  return "Linux";
}

function buildPrompt(): string {
  const os = getOsContext();
  return `You are a ZSH command line completion assistant running on ${os}. Given a partial command or a comment describing what the user wants, output ONLY the completed command. Rules:
- Output ONLY the command, nothing else
- No explanations, no markdown, no code blocks
- If input is a comment (starts with #), output the command that does what the comment describes
- If input is a partial command, complete it
- Use ${os}-compatible commands and tools only
- Be concise -- prefer one-liners when possible
- Keep commands simple and robust -- avoid nested subshells, xargs tricks, or complex piping that might break
- Prefer straightforward commands over clever ones`;
}

export function buildSystemPrompt(): string {
  return buildPrompt();
}

export function buildUserMessage(buffer: string, cursor: number): string {
  const textBeforeCursor = buffer.slice(0, cursor);
  const textAfterCursor = buffer.slice(cursor);

  if (textAfterCursor.length === 0) {
    return textBeforeCursor;
  }

  return `${textBeforeCursor}[CURSOR]${textAfterCursor}`;
}
