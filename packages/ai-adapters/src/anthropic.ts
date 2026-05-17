import type { AiAdapter, GenerateTextRequest, GenerateTextResponse } from "./types";
import { assertApiKey, parseJsonResponse, splitSystemMessages } from "./utils";

type AnthropicResponse = {
  id: string;
  model: string;
  content?: Array<{
    type: "text";
    text?: string;
  }>;
};

export class AnthropicAdapter implements AiAdapter {
  id = "anthropic" as const;
  displayName = "Claude Sonnet / Opus";
  defaultModel = "claude-3-5-sonnet-latest";

  async generateText(request: GenerateTextRequest): Promise<GenerateTextResponse> {
    assertApiKey(request.apiKey, this.id);
    const model = request.model ?? this.defaultModel;
    const { system, conversation } = splitSystemMessages(request.messages);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": request.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        system: system || undefined,
        messages: conversation,
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? 700,
      }),
    });

    const payload = await parseJsonResponse<AnthropicResponse>(response, this.id);
    const content = payload.content
      ?.filter((block) => block.type === "text")
      .map((block) => block.text)
      .filter(Boolean)
      .join("\n")
      .trim();

    if (!content) {
      throw new Error("Anthropic returned an empty completion.");
    }

    return {
      content,
      model: payload.model || model,
      provider: this.id,
      raw: payload,
    };
  }
}
