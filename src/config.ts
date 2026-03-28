import { readFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";

const DEFAULT_ANTHROPIC_MODEL = "claude-haiku-4-20250414";
const DEFAULT_OPENROUTER_MODEL = "anthropic/claude-haiku-4.5";
const DEFAULT_MAX_TOKENS = 256;
const CONFIG_PATH = join(homedir(), ".config", "zsh-claude", "config.json");

type Provider = "anthropic" | "openrouter";

export interface Config {
  readonly provider: Provider;
  readonly apiKey: string;
  readonly model: string;
  readonly maxTokens: number;
}

interface ConfigFile {
  readonly apiKey?: string;
  readonly openrouterApiKey?: string;
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

  const anthropicKey = process.env.ANTHROPIC_API_KEY ?? fileConfig.apiKey ?? "";
  const openrouterKey = process.env.OPENROUTER_API_KEY ?? fileConfig.openrouterApiKey ?? "";

  const hasAnthropic = anthropicKey.length > 0;
  const hasOpenRouter = openrouterKey.length > 0;

  if (!hasAnthropic && !hasOpenRouter) {
    process.stderr.write(
      "zsh-claude: no API key found. Set ANTHROPIC_API_KEY or OPENROUTER_API_KEY\n",
    );
    return { provider: "anthropic", apiKey: "", model: DEFAULT_ANTHROPIC_MODEL, maxTokens: DEFAULT_MAX_TOKENS };
  }

  const provider: Provider = hasAnthropic ? "anthropic" : "openrouter";
  const apiKey = hasAnthropic ? anthropicKey : openrouterKey;
  const defaultModel = hasAnthropic ? DEFAULT_ANTHROPIC_MODEL : DEFAULT_OPENROUTER_MODEL;
  const model = process.env.ZSH_CLAUDE_MODEL ?? fileConfig.model ?? defaultModel;
  const maxTokens = fileConfig.maxTokens ?? DEFAULT_MAX_TOKENS;

  return { provider, apiKey, model, maxTokens };
}
