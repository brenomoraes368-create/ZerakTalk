export * from "./types";
export * from "./utils";
export * from "./anthropic";
export * from "./openai";

import type { AiAdapter, AiProvider } from "./types";
import { AnthropicAdapter } from "./anthropic";
import { OpenAiAdapter } from "./openai";

export function createDefaultAdapters(): Record<AiProvider, AiAdapter> {
  return {
    anthropic: new AnthropicAdapter(),
    openai: new OpenAiAdapter(),
  };
}
