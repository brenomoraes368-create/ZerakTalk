"use client";

export type LocalApiKeys = {
  anthropic?: string;
  openai?: string;
};

const STORAGE_KEY = "zeraktalk.apiKeys.v1";

export function loadApiKeys(): LocalApiKeys {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as LocalApiKeys;
  } catch {
    return {};
  }
}

export function saveApiKeys(keys: LocalApiKeys): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
}
