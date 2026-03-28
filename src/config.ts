import { readFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";

const DEFAULT_MODEL = "claude-haiku-4-20250414";
const DEFAULT_MAX_TOKENS = 256;
const CONFIG_PATH = join(homedir(), ".config", "zsh-claude", "config.json");

export interface Config {
  readonly apiKey: string;
  readonly model: string;
  readonly maxTokens: number;
}

interface ConfigFile {
  readonly apiKey?: string;
  readonly model?: string;
  readonly maxTokens?: number;
}

function loadConfigFile(path: string): ConfigFile {
  try {
    const raw = readFileSync(path, "utf-8");
    return JSON.parse(raw) as ConfigFile;
  } catch {
    return {};
  }
}

export function loadConfig(configPath: string = CONFIG_PATH): Config {
  const fileConfig = loadConfigFile(configPath);

  const apiKey = process.env.ANTHROPIC_API_KEY ?? fileConfig.apiKey ?? "";
  const model = process.env.ZSH_CLAUDE_MODEL ?? fileConfig.model ?? DEFAULT_MODEL;
  const maxTokens = fileConfig.maxTokens ?? DEFAULT_MAX_TOKENS;

  if (!apiKey) {
    process.stderr.write("zsh-claude: ANTHROPIC_API_KEY not set\n");
  }

  return { apiKey, model, maxTokens };
}
