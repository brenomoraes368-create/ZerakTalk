"use client";

import { useEffect, useState } from "react";
import { loadApiKeys, saveApiKeys, type LocalApiKeys } from "../lib/local-api-keys";

export function ApiKeySettings() {
  const [keys, setKeys] = useState<LocalApiKeys>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setKeys(loadApiKeys());
  }, []);

  function updateKey(provider: keyof LocalApiKeys, value: string) {
    setSaved(false);
    setKeys((current) => ({ ...current, [provider]: value }));
  }

  function persist() {
    saveApiKeys(keys);
    setSaved(true);
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Configuração local</p>
        <h2 className="text-2xl font-bold text-ink">Chaves de API</h2>
        <p className="text-sm leading-6 text-muted">
          As chaves ficam somente no navegador via localStorage. O MVP chama provedores a partir do dispositivo do usuário.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-ink">
          Claude / Anthropic
          <input
            className="rounded-2xl border border-slate-200 px-4 py-3 font-mono text-sm outline-none focus:border-brand"
            placeholder="sk-ant-..."
            type="password"
            value={keys.anthropic ?? ""}
            onChange={(event) => updateKey("anthropic", event.target.value)}
          />
          <a className="text-xs text-brand" href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer">
            Obter chave Anthropic
          </a>
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          GPT-4o / OpenAI
          <input
            className="rounded-2xl border border-slate-200 px-4 py-3 font-mono text-sm outline-none focus:border-brand"
            placeholder="sk-..."
            type="password"
            value={keys.openai ?? ""}
            onChange={(event) => updateKey("openai", event.target.value)}
          />
          <a className="text-xs text-brand" href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer">
            Obter chave OpenAI
          </a>
        </label>
      </div>

      <button className="mt-6 rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white" onClick={persist} type="button">
        Salvar neste dispositivo
      </button>
      {saved ? <span className="ml-3 text-sm text-emerald-600">Chaves salvas localmente.</span> : null}
    </section>
  );
}
