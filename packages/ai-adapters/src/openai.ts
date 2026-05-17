import type { AiAdapter, GenerateTextRequest, GenerateTextResponse } from "./types";
import { assertApiKey, parseJsonResponse } from "./utils";

type OpenAiChatResponse = {
  id: string;
  model: string;
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
};

export class OpenAiAdapter implements AiAdapter {
  id = "openai" as const;
  displayName = "GPT-4o / GPT-4";
  defaultModel = "gpt-4o";

  async generateText(request: GenerateTextRequest): Promise<GenerateTextResponse> {
    assertApiKey(request.apiKey, this.id);
    const model = request.model ?? this.defaultModel;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${request.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: request.messages,
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? 700,
      }),
    });

    const payload = await parseJsonResponse<OpenAiChatResponse>(response, this.id);
    const content = payload.choices?.[0]?.message?.content?.trim();

    if (!content) {
      throw new Error("OpenAI returned an empty completion.");
    }

    return {
      content,
      model: payload.model || model,
      provider: this.id,
      raw: payload,
    };
  }
}
