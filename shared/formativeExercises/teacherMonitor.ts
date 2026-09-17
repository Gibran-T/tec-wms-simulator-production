/**
 * Pure aggregation helpers for professor formative monitoring.
 * Neutral statuses only — no unauthorized success/failure thresholds.
 */
import type { FormativeExerciseStatus } from "./types";

export type TeacherFormativeStatus = "non_commence" | "en_cours" | "termine";

export function deriveTeacherFormativeStatus(
  status: FormativeExerciseStatus | null | undefined,
): TeacherFormativeStatus {
  if (!status || status === "not_started") return "non_commence";
  if (status === "in_progress") return "en_cours";
  return "termine";
}

export function countFeedbackAnswers(feedbackJson: unknown): {
  correct: number;
  incorrect: number;
  submitted: number;
} {
  const items = (feedbackJson as { items?: Array<{ kind?: string }> } | null)?.items;
  if (!Array.isArray(items)) return { correct: 0, incorrect: 0, submitted: 0 };
  let correct = 0;
  let incorrect = 0;
  for (const item of items) {
    if (item.kind === "correct") correct += 1;
    else if (item.kind === "incorrect") incorrect += 1;
  }
  return { correct, incorrect, submitted: correct + incorrect };
}

/** Bonnes réponses ÷ réponses soumises. Null when denominator is 0. */
export function correctAnswerRate(correct: number, submitted: number): number | null {
  if (submitted <= 0) return null;
  return Math.round((correct / submitted) * 1000) / 10;
}

/** @deprecated Prefer correctAnswerRate — same math, clearer name. */
export const successRate = correctAnswerRate;

export function participationRate(started: number, enrolled: number): number | null {
  if (enrolled <= 0) return null;
  return Math.round((started / enrolled) * 1000) / 10;
}

export function completionRate(completed: number, enrolled: number): number | null {
  if (enrolled <= 0) return null;
  return Math.round((completed / enrolled) * 1000) / 10;
}

export const TEACHER_STATUS_LABELS: Record<
  TeacherFormativeStatus,
  { fr: string; en: string }
> = {
  non_commence: { fr: "Non commencé", en: "Not started" },
  en_cours: { fr: "En cours", en: "In progress" },
  termine: { fr: "Terminé", en: "Completed" },
};

/** Post minus pre. Null when either score is missing. */
export function computePrePostEvolution(
  prepScore: number | null | undefined,
  consScore: number | null | undefined,
): number | null {
  if (prepScore == null || consScore == null) return null;
  if (!Number.isFinite(prepScore) || !Number.isFinite(consScore)) return null;
  return Math.round((consScore - prepScore) * 10) / 10;
}

/**
 * Instructor accompaniment signal — not a pass/fail label.
 * Triggers when consolidation is completed and either regresses or stays very low.
 */
export function needsInstructorIntervention(args: {
  prepScore: number | null | undefined;
  consScore: number | null | undefined;
  consCompleted: boolean;
}): boolean {
  if (!args.consCompleted || args.consScore == null) return false;
  if (args.consScore < 50) return true;
  if (args.prepScore != null && args.consScore < args.prepScore) return true;
  return false;
}

export type FeedbackHotspot = {
  itemId: string;
  incorrect: number;
  submitted: number;
  errorRate: number;
  mostChosenWrong: string | null;
};

/** Aggregate incorrect closed items from formative feedback JSON payloads. */
export function aggregateFeedbackHotspots(
  feedbackPayloads: unknown[],
): FeedbackHotspot[] {
  const stats = new Map<
    string,
    { incorrect: number; submitted: number; wrongCounts: Map<string, number> }
  >();
  for (const payload of feedbackPayloads) {
    const items = (payload as { items?: Array<{ id?: string; kind?: string }> } | null)?.items;
    if (!Array.isArray(items)) continue;
    for (const item of items) {
      if (!item.id || (item.kind !== "correct" && item.kind !== "incorrect")) continue;
      const [itemId, chosen] = item.id.split(":");
      const key = itemId || item.id;
      const row = stats.get(key) ?? {
        incorrect: 0,
        submitted: 0,
        wrongCounts: new Map<string, number>(),
      };
      row.submitted += 1;
      if (item.kind === "incorrect") {
        row.incorrect += 1;
        if (chosen) row.wrongCounts.set(chosen, (row.wrongCounts.get(chosen) ?? 0) + 1);
      }
      stats.set(key, row);
    }
  }
  return Array.from(stats.entries())
    .map(([itemId, row]) => {
      let mostChosenWrong: string | null = null;
      let max = 0;
      for (const [opt, n] of row.wrongCounts) {
        if (n > max) {
          max = n;
          mostChosenWrong = opt;
        }
      }
      return {
        itemId,
        incorrect: row.incorrect,
        submitted: row.submitted,
        errorRate: row.submitted ? Math.round((row.incorrect / row.submitted) * 1000) / 10 : 0,
        mostChosenWrong,
      };
    })
    .sort((a, b) => b.errorRate - a.errorRate || b.incorrect - a.incorrect);
}
