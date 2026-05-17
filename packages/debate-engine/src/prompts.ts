import type { DebatePosition, DebateTurn } from "./types";

const labels: Record<"pt" | "en", Record<DebatePosition, string>> = {
  pt: {
    defender: "defesa",
    challenger: "contestação",
  },
  en: {
    defender: "defense",
    challenger: "challenge",
  },
};

export function buildDebaterSystemPrompt(language: "pt" | "en", position: DebatePosition): string {
  if (language === "en") {
    return [
      "You are participating in a structured AI debate on ZerakTalk.",
      `Your role is ${labels.en[position]}.`,
      "Be rigorous, fair, concise, and address opposing points directly.",
      "Do not invent citations. If evidence is uncertain, say so.",
    ].join(" ");
  }

  return [
    "Você está participando de um debate estruturado entre IAs no ZerakTalk.",
    `Seu papel é ${labels.pt[position]}.`,
    "Seja rigoroso, justo, conciso e responda diretamente aos argumentos contrários.",
    "Não invente citações. Se uma evidência for incerta, deixe isso claro.",
  ].join(" ");
}

export function buildTurnPrompt(params: {
  language: "pt" | "en";
  topic: string;
  round: number;
  totalRounds: number;
  position: DebatePosition;
  transcript: DebateTurn[];
}): string {
  const transcript = params.transcript.length
    ? params.transcript
        .map((turn) => `Rodada ${turn.round} — ${turn.participantName}: ${turn.content}`)
        .join("\n\n")
    : params.language === "en"
      ? "No previous arguments. Open the debate."
      : "Nenhum argumento anterior. Abra o debate.";

  if (params.language === "en") {
    return `Topic: ${params.topic}\nRound ${params.round} of ${params.totalRounds}.\nYour position: ${labels.en[params.position]}.\n\nTranscript so far:\n${transcript}\n\nWrite your next argument in 2–4 paragraphs.`;
  }

  return `Tema: ${params.topic}\nRodada ${params.round} de ${params.totalRounds}.\nSua posição: ${labels.pt[params.position]}.\n\nTranscrição até agora:\n${transcript}\n\nEscreva seu próximo argumento em 2–4 parágrafos.`;
}

export function buildJudgePrompt(params: {
  language: "pt" | "en";
  topic: string;
  turns: DebateTurn[];
  defenderName: string;
  challengerName: string;
}): string {
  const transcript = params.turns
    .map((turn) => `Rodada ${turn.round} — ${turn.participantName} (${turn.position}): ${turn.content}`)
    .join("\n\n");

  if (params.language === "en") {
    return `You are the judge of an AI debate. Topic: ${params.topic}. Participants: defender ${params.defenderName}; challenger ${params.challengerName}.\n\nTranscript:\n${transcript}\n\nDeclare a winner and explain the decision. Return plain text with the winner name on the first line.`;
  }

  return `Você é o juiz de um debate entre IAs. Tema: ${params.topic}. Participantes: defesa ${params.defenderName}; contestação ${params.challengerName}.\n\nTranscrição:\n${transcript}\n\nDeclare um vencedor e explique a decisão. Retorne texto simples com o nome do vencedor na primeira linha.`;
}
