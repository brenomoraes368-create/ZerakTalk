export type AiProvider = "anthropic" | "openai";

export type AiRole = "system" | "user" | "assistant";

export interface AiMessage {
  role: AiRole;
  content: string;
}

export interface GenerateTextRequest {
  messages: AiMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  apiKey: string;
}

export interface GenerateTextResponse {
  content: string;
  model: string;
  provider: AiProvider;
  raw?: unknown;
}

export interface AiAdapter {
  id: AiProvider;
  displayName: string;
  defaultModel: string;
  generateText(request: GenerateTextRequest): Promise<GenerateTextResponse>;
}
