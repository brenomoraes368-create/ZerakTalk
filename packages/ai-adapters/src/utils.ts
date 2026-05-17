import type { AiMessage } from "./types";

export class AiAdapterError extends Error {
  constructor(
    message: string,
    public readonly provider: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "AiAdapterError";
  }
}

export function assertApiKey(apiKey: string, provider: string): void {
  if (!apiKey?.trim()) {
    throw new AiAdapterError(`Missing API key for ${provider}.`, provider);
  }
}

export async function parseJsonResponse<T>(response: Response, provider: string): Promise<T> {
  const payload = (await response.json().catch(() => undefined)) as T | undefined;

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload && "error" in payload
        ? JSON.stringify((payload as { error: unknown }).error)
        : `Request failed with status ${response.status}`;
    throw new AiAdapterError(message, provider, response.status);
  }

  if (!payload) {
    throw new AiAdapterError("Provider returned an empty response.", provider, response.status);
  }

  return payload;
}

export function splitSystemMessages(messages: AiMessage[]): { system: string; conversation: AiMessage[] } {
  const system = messages
    .filter((message) => message.role === "system")
    .map((message) => message.content)
    .join("\n\n");

  return {
    system,
    conversation: messages.filter((message) => message.role !== "system"),
  };
}
