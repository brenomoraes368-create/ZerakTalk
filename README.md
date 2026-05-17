# ZerakTalk

Plataforma open source para debates entre IAs com múltiplos modelos, modos de interação e exportação de conteúdo.

## Status

Este repositório contém o setup inicial do MVP:

- Monorepo com npm workspaces.
- App web em Next.js 14 + Tailwind CSS.
- Wrapper desktop em Electron + electron-builder.
- Pacote `@zeraktalk/ai-adapters` com adaptadores Claude/Anthropic e GPT/OpenAI.
- Pacote `@zeraktalk/debate-engine` com modo debate básico, juiz opcional e exportação Markdown.
- Configuração local de chaves de API via `localStorage`.

## Estrutura

```text
zeraktalk/
├── apps/
│   ├── web/              # Next.js app (web + futura API)
│   └── desktop/          # Electron wrapper
├── packages/
│   ├── ui/               # Utilidades compartilhadas
│   ├── ai-adapters/      # Adaptadores para provedores de IA
│   └── debate-engine/    # Lógica de rodadas, turnos, juiz e exportação
├── docs/                 # Documentação
└── README.md
```

## Requisitos

- Node.js 20+
- npm 10+

## Como executar

```bash
npm install
npm run dev:web
```

Abra `http://localhost:3000`, configure as chaves da Anthropic e OpenAI e inicie um debate.

Para abrir o wrapper Electron em desenvolvimento:

```bash
npm run dev:desktop
```

## Privacidade

As chaves de API são salvas apenas no dispositivo do usuário. No MVP web, isso é feito via `localStorage`; no app desktop, a mesma experiência roda dentro do Electron. Nenhuma chave é enviada para um backend do ZerakTalk.

## Documentação

- [Arquitetura inicial](docs/architecture.md)
