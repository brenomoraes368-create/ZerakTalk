import type { AiMessage } from "@zeraktalk/ai-adapters";
import { buildDebaterSystemPrompt, buildJudgePrompt, buildTurnPrompt } from "./prompts";
import type { DebateConfig, DebateResult, DebateTurn, DebateVerdict } from "./types";

export class DebateEngine {
  async run(config: DebateConfig): Promise<DebateResult> {
    this.validateConfig(config);

    const language = config.language ?? "pt";
    const turns: DebateTurn[] = [];
    const createdAt = new Date().toISOString();

    for (let round = 1; round <= config.rounds; round += 1) {
      for (const participant of [config.defender, config.challenger]) {
        const messages: AiMessage[] = [
          {
            role: "system",
            content: buildDebaterSystemPrompt(language, participant.position),
          },
          {
            role: "user",
            content: buildTurnPrompt({
              language,
              topic: config.topic,
              round,
              totalRounds: config.rounds,
              position: participant.position,
              transcript: turns,
            }),
          },
        ];

        const response = await participant.adapter.generateText({
          apiKey: participant.apiKey,
          model: participant.model,
          messages,
          temperature: 0.7,
        });

        turns.push({
          round,
          participantId: participant.id,
          participantName: participant.name,
          position: participant.position,
          content: response.content,
          createdAt: new Date().toISOString(),
        });
      }
    }

    const verdict = config.judge ? await this.createVerdict(config, turns, language) : undefined;

    return {
      id: crypto.randomUUID(),
      topic: config.topic,
      rounds: config.rounds,
      turns,
      verdict,
      createdAt,
      completedAt: new Date().toISOString(),
    };
  }

  private async createVerdict(
    config: DebateConfig,
    turns: DebateTurn[],
    language: "pt" | "en",
  ): Promise<DebateVerdict> {
    const judge = config.judge;

    if (!judge) {
      throw new Error("Judge participant is required to create a verdict.");
    }

    const response = await judge.adapter.generateText({
      apiKey: judge.apiKey,
      model: judge.model,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            language === "en"
              ? "You judge debates neutrally and explain your decision succinctly."
              : "Você julga debates com neutralidade e explica sua decisão de forma sucinta.",
        },
        {
          role: "user",
          content: buildJudgePrompt({
            language,
            topic: config.topic,
            turns,
            defenderName: config.defender.name,
            challengerName: config.challenger.name,
          }),
        },
      ],
    });

    const firstLine = response.content.split("\n")[0]?.trim();
    const winner = [config.defender, config.challenger].find((participant) =>
      firstLine?.toLowerCase().includes(participant.name.toLowerCase()),
    );

    return {
      winnerParticipantId: winner?.id,
      winnerName: winner?.name ?? firstLine,
      rationale: response.content,
      judgeName: judge.name,
    };
  }

  private validateConfig(config: DebateConfig): void {
    if (!config.topic.trim()) {
      throw new Error("Debate topic is required.");
    }

    if (config.rounds < 2 || config.rounds > 6) {
      throw new Error("Debate rounds must be between 2 and 6.");
    }

    if (config.defender.position !== "defender") {
      throw new Error("Defender participant must use the defender position.");
    }

    if (config.challenger.position !== "challenger") {
      throw new Error("Challenger participant must use the challenger position.");
    }
  }
}
