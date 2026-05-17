import type { DebateResult } from "./types";

export function exportDebateToMarkdown(result: DebateResult): string {
  const lines = [
    `# ZerakTalk Debate: ${result.topic}`,
    "",
    `- **Created:** ${result.createdAt}`,
    `- **Completed:** ${result.completedAt}`,
    `- **Rounds:** ${result.rounds}`,
  ];

  if (result.verdict) {
    lines.push(`- **Winner:** ${result.verdict.winnerName ?? "Undetermined"}`);
    lines.push(`- **Judge:** ${result.verdict.judgeName}`);
  }

  lines.push("", "## Transcript", "");

  for (const turn of result.turns) {
    lines.push(`### Round ${turn.round} — ${turn.participantName} (${turn.position})`);
    lines.push("", turn.content, "");
  }

  if (result.verdict) {
    lines.push("## Verdict", "", result.verdict.rationale, "");
  }

  return lines.join("\n");
}
