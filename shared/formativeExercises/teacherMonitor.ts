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
