/**
 * Shared ordering answer-state contract for formative exercises.
 * Display order, persisted answers, and scoring input must use the same IDs.
 */
import { M4_LAYERS, M5_CONS_PATH } from "./content";
import type { FormativeExerciseId } from "./types";

/** Stable intentional non-canonical initial order (never the correct path). */
export function initialNonCanonicalOrdering(
  canonical: readonly string[],
): string[] {
  if (canonical.length < 2) return [...canonical];
  // Reverse is deterministic and differs from the canonical path for length >= 2.
  const reversed = [...canonical].reverse();
  if (reversed.every((id, i) => id === canonical[i])) {
    return [...canonical.slice(1), canonical[0]!];
  }
  return reversed;
}

export function isCompleteOrdering(
  expected: readonly string[],
  order: unknown,
): order is string[] {
  if (!Array.isArray(order)) return false;
  if (order.length !== expected.length) return false;
  if (!order.every((id) => typeof id === "string")) return false;
  if (new Set(order).size !== order.length) return false;
  const expectedSet = new Set(expected);
  if (order.some((id) => !expectedSet.has(id))) return false;
  return expected.every((id) => (order as string[]).includes(id));
}

export function getOrderingIdsForExercise(
  exerciseId: FormativeExerciseId,
): readonly string[] | null {
  if (exerciseId === "M4-PREP-KPI-RESPONSE") return M4_LAYERS;
  if (exerciseId === "M5-CONS-FULL-REASONING") return M5_CONS_PATH;
  return null;
}

/**
 * Ensure ordering answers contain every expected ID exactly once.
 * Seeds a non-canonical order when missing or malformed.
 * Does not overwrite a complete existing order.
 */
export function withSeededOrdering(
  exerciseId: FormativeExerciseId,
  answers: Record<string, unknown>,
): Record<string, unknown> {
  const expected = getOrderingIdsForExercise(exerciseId);
  if (!expected) return answers;
  if (isCompleteOrdering(expected, answers.ordering)) return answers;
  return {
    ...answers,
    ordering: initialNonCanonicalOrdering(expected),
  };
}
