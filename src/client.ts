import type { Config } from "./config";

const API_URL = "https://api.anthropic.com/v1/messages";
const API_VERSION = "2023-06-01";

interface MessageResponse {
  readonly content: ReadonlyArray<{ readonly type: string; readonly text?: string }>;
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
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "x-api-key": config.apiKey,
        "anthropic-version": API_VERSION,
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
      process.stderr.write(
        `zsh-claude: API error ${response.status}: ${errorBody}\n`,
      );
      return "";
    }

    const data = (await response.json()) as MessageResponse;
    const textBlock = data.content.find((block) => block.type === "text");

    return textBlock?.text?.trim() ?? "";
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`zsh-claude: request failed: ${message}\n`);
    return "";
  }
}
