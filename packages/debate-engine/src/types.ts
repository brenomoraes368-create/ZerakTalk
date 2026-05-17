import type { AiAdapter, AiProvider } from "@zeraktalk/ai-adapters";

export type DebatePosition = "defender" | "challenger";

export interface DebateParticipant {
  id: string;
  name: string;
  provider: AiProvider;
  model?: string;
  position: DebatePosition;
  adapter: AiAdapter;
  apiKey: string;
}

export interface DebateConfig {
  topic: string;
  rounds: number;
  defender: DebateParticipant;
  challenger: DebateParticipant;
  judge?: DebateParticipant;
  language?: "pt" | "en";
}

export interface DebateTurn {
  round: number;
  participantId: string;
  participantName: string;
  position: DebatePosition;
  content: string;
  createdAt: string;
}

export interface DebateVerdict {
  winnerParticipantId?: string;
  winnerName?: string;
  rationale: string;
  judgeName: string;
}

export interface DebateResult {
  id: string;
  topic: string;
  rounds: number;
  turns: DebateTurn[];
  verdict?: DebateVerdict;
  createdAt: string;
  completedAt: string;
}
