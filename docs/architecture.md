# Arquitetura inicial do ZerakTalk

## Objetivo do MVP

O MVP entrega a base técnica para o modo **Debate** com Claude e GPT-4o/GPT-4, mantendo a premissa de privacidade: as chaves de API são armazenadas localmente e não há persistência obrigatória no servidor.

## Estrutura

```text
apps/
  web/          Next.js 14 com App Router, Tailwind e UI inicial
  desktop/      Wrapper Electron para executar a experiência web como app instalável
packages/
  ai-adapters/  Adaptadores Anthropic e OpenAI com interface comum
  debate-engine/Orquestra rodadas, turnos, juiz e exportação Markdown
  ui/           Utilidades compartilhadas de UI
```

## Fluxo de debate

1. O usuário salva chaves de API no navegador.
2. O usuário informa tema e número de rodadas.
3. `DebateEngine` alterna entre defesa e contestação a cada rodada.
4. O juiz opcional recebe a transcrição completa e produz um veredito.
5. O resultado pode ser exportado como Markdown.

## Próximos passos recomendados

- Adicionar autenticação com NextAuth.js para Google e GitHub.
- Criar persistência opcional de histórico com Prisma e SQLite/PostgreSQL.
- Adicionar adaptadores Gemini, Kimi, DeepSeek e Ollama.
- Implementar exportação PDF e compartilhamento público autorizado.
- Configurar i18n com detecção de idioma do navegador.
