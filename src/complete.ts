import { loadConfig } from "./config";
import { buildSystemPrompt, buildUserMessage } from "./prompt";
import { getCompletion } from "./client";

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf-8");
}

async function main(): Promise<void> {
  const cursorArg = process.argv[2];
  const cursor = cursorArg ? parseInt(cursorArg, 10) : 0;

  const buffer = await readStdin();

  if (!buffer.trim()) {
    return;
  }

  const config = loadConfig();
  const systemPrompt = buildSystemPrompt();
  const userMessage = buildUserMessage(buffer, cursor);
  const completion = await getCompletion(systemPrompt, userMessage, config);

  if (completion) {
    process.stdout.write(completion);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`zsh-claude: fatal: ${message}\n`);
  process.exit(1);
});
