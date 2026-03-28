import type { Config } from "./config";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const ANTHROPIC_VERSION = "2023-06-01";

interface AnthropicResponse {
  readonly content: ReadonlyArray<{ readonly type: string; readonly text?: string }>;
}

interface OpenRouterResponse {
  readonly choices: ReadonlyArray<{
    readonly message: { readonly content: string };
  }>;
}

async function callAnthropic(
  systemPrompt: string,
  userMessage: string,
  config: Config,
): Promise<string> {
  const response = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "x-api-key": config.apiKey,
      "anthropic-version": ANTHROPIC_VERSION,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: config.maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    process.stderr.write(`zsh-claude: anthropic error ${response.status}: ${errorBody}\n`);
    return "";
  }

  const data = (await response.json()) as AnthropicResponse;
  const textBlock = data.content.find((block) => block.type === "text");
  return textBlock?.text?.trim() ?? "";
}

async function callOpenRouter(
  systemPrompt: string,
  userMessage: string,
  config: Config,
): Promise<string> {
  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "authorization": `Bearer ${config.apiKey}`,
      "content-type": "application/json",
      "x-title": "zsh-claude",
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: config.maxTokens,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    process.stderr.write(`zsh-claude: openrouter error ${response.status}: ${errorBody}\n`);
    return "";
  }

  const data = (await response.json()) as OpenRouterResponse;
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

export async function getCompletion(
  systemPrompt: string,
  userMessage: string,
  config: Config,
): Promise<string> {
  if (!config.apiKey) {
    return "";
  }

  try {
    if (config.provider === "openrouter") {
      return await callOpenRouter(systemPrompt, userMessage, config);
    }
    return await callAnthropic(systemPrompt, userMessage, config);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`zsh-claude: request failed: ${message}\n`);
    return "";
  }
}
