"use client";

import { useMemo, useState } from "react";
import { createDefaultAdapters } from "@zeraktalk/ai-adapters";
import { DebateEngine, exportDebateToMarkdown, type DebateResult } from "@zeraktalk/debate-engine";
import { loadApiKeys } from "../lib/local-api-keys";

export function DebateStarter() {
  const adapters = useMemo(() => createDefaultAdapters(), []);
  const [topic, setTopic] = useState("A inteligência artificial deve ser usada como mediadora em decisões públicas?");
  const [rounds, setRounds] = useState(2);
  const [result, setResult] = useState<DebateResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  async function startDebate() {
    setError(null);
    setResult(null);
    const keys = loadApiKeys();

    if (!keys.anthropic || !keys.openai) {
      setError("Configure as chaves da Anthropic e da OpenAI antes de iniciar o debate.");
      return;
    }

    setIsRunning(true);

    try {
      const engine = new DebateEngine();
      const debate = await engine.run({
        topic,
        rounds,
        language: "pt",
        defender: {
          id: "claude-defender",
          name: "Claude Sonnet",
          provider: "anthropic",
          position: "defender",
          adapter: adapters.anthropic,
          apiKey: keys.anthropic,
        },
        challenger: {
          id: "gpt-challenger",
          name: "GPT-4o",
          provider: "openai",
          position: "challenger",
          adapter: adapters.openai,
          apiKey: keys.openai,
        },
        judge: {
          id: "gpt-judge",
          name: "GPT-4o Juiz",
          provider: "openai",
          position: "challenger",
          adapter: adapters.openai,
          apiKey: keys.openai,
        },
      });
      setResult(debate);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Falha ao executar debate.");
    } finally {
      setIsRunning(false);
    }
  }

  const markdown = result ? exportDebateToMarkdown(result) : "";

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">MVP</p>
        <h2 className="text-2xl font-bold text-ink">Modo Debate</h2>
        <p className="text-sm leading-6 text-muted">
          Claude defende, GPT-4o contesta e GPT-4o também pode gerar um veredito inicial.
        </p>
      </div>

      <div className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm font-medium text-ink">
          Tema
          <textarea
            className="min-h-28 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink md:max-w-xs">
          Rodadas
          <select
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand"
            value={rounds}
            onChange={(event) => setRounds(Number(event.target.value))}
          >
            {[2, 3, 4, 5, 6].map((option) => (
              <option key={option} value={option}>
                {option} rodadas
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        className="mt-6 rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isRunning}
        onClick={startDebate}
        type="button"
      >
        {isRunning ? "Debatendo..." : "Iniciar debate"}
      </button>

      {error ? <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}

      {result ? (
        <div className="mt-8 grid gap-5">
          <h3 className="text-xl font-bold text-ink">Transcrição</h3>
          {result.turns.map((turn) => (
            <article key={`${turn.round}-${turn.participantId}`} className="rounded-2xl bg-panel p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Rodada {turn.round} · {turn.participantName} · {turn.position}
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-ink">{turn.content}</p>
            </article>
          ))}

          {result.verdict ? (
            <article className="rounded-2xl border border-brand/20 bg-brand/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Veredito</p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-ink">{result.verdict.rationale}</p>
            </article>
          ) : null}

          <label className="grid gap-2 text-sm font-medium text-ink">
            Exportação Markdown
            <textarea className="min-h-72 rounded-2xl border border-slate-200 p-4 font-mono text-xs" readOnly value={markdown} />
          </label>
        </div>
      ) : null}
    </section>
  );
}
