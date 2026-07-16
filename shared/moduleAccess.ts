/**
 * Canonical learning-module access policy (M1–M5).
 *
 * Pedagogical rule (2026-07): students may open any learning module M1–M5
 * when authenticated and authorized for the course/cohort. Access is NOT
 * based on previous-module completion, quiz result, score, or scenario pass.
 *
 * Scenario-internal sequencing, WMS validators, scoring, analytics,
 * surveillance, and certification engines remain separate concerns.
 */

export const LEARNING_MODULE_IDS = [1, 2, 3, 4, 5] as const;

export type LearningModuleId = (typeof LEARNING_MODULE_IDS)[number];

export interface CanAccessLearningModuleArgs {
  authenticated: boolean;
  /** Cohort / course authorization — false when the student is not enrolled. */
  enrolledInCohort: boolean;
  moduleId: number;
}

/**
 * Returns true for M1–M5 when the user is authenticated and enrolled.
 * Does not consult prior-module completion, quiz, or checkpoint state.
 */
export function canAccessLearningModule({
  authenticated,
  enrolledInCohort,
  moduleId,
}: CanAccessLearningModuleArgs): boolean {
  if (!authenticated || !enrolledInCohort) return false;
  return LEARNING_MODULE_IDS.includes(moduleId as LearningModuleId);
}

/** Convenience: open-access flag for student module hubs (M1–M5). */
export function isLearningModuleOpenAccess(moduleId: number): boolean {
  return LEARNING_MODULE_IDS.includes(moduleId as LearningModuleId);
}
