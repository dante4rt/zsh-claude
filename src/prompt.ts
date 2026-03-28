const SYSTEM_PROMPT = `You are a ZSH command line completion assistant. Given a partial command or a comment describing what the user wants, output ONLY the completed command. Rules:
- Output ONLY the command, nothing else
- No explanations, no markdown, no code blocks
- If input is a comment (starts with #), output the command that does what the comment describes
- If input is a partial command, complete it
- Use common CLI tools and best practices
- Be concise -- prefer one-liners when possible`;

export function buildSystemPrompt(): string {
  return SYSTEM_PROMPT;
}

export function buildUserMessage(buffer: string, cursor: number): string {
  const textBeforeCursor = buffer.slice(0, cursor);
  const textAfterCursor = buffer.slice(cursor);

  if (textAfterCursor.length === 0) {
    return textBeforeCursor;
  }

  return `${textBeforeCursor}[CURSOR]${textAfterCursor}`;
}
