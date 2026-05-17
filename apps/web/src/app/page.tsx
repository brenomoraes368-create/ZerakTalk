import { ApiKeySettings } from "../components/ApiKeySettings";
import { DebateStarter } from "../components/DebateStarter";

const features = [
  "Debate estruturado em 2–6 rodadas",
  "Claude via Anthropic e GPT-4o/GPT-4 via OpenAI",
  "Chaves salvas somente no dispositivo",
  "Exportação inicial em Markdown",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-panel px-6 py-8 text-ink md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="rounded-[2rem] bg-ink p-8 text-white md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">ZerakTalk</p>
          <div className="mt-6 grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tight md:text-6xl">Debates entre IAs, abertos e privados.</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/70">
                MVP inicial com Next.js, Electron, adaptadores de IA e engine de debate para comparar modelos em rodadas
                configuráveis.
              </p>
            </div>
            <ul className="grid gap-3 text-sm text-white/80">
              {features.map((feature) => (
                <li key={feature} className="rounded-2xl bg-white/10 px-4 py-3">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </header>

        <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <ApiKeySettings />
          <DebateStarter />
        </div>
      </div>
    </main>
  );
}
