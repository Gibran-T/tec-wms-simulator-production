/** RC22-T09 — in-memory cohort AI mentor disable (no DB; env seed until RC23). */

const disabledCohorts = new Set<number>();

function loadEnvDisabled(): void {
  const raw = process.env.AI_MENTOR_DISABLED_COHORT_IDS;
  if (!raw) return;
  for (const part of raw.split(",")) {
    const id = Number.parseInt(part.trim(), 10);
    if (!Number.isNaN(id)) disabledCohorts.add(id);
  }
}

loadEnvDisabled();

export function isCohortAiMentorDisabled(cohortId: number): boolean {
  return disabledCohorts.has(cohortId);
}

export function getCohortAiMentorDisabled(cohortId: number): boolean {
  return disabledCohorts.has(cohortId);
}

export function setCohortAiMentorDisabled(cohortId: number, disabled: boolean): void {
  if (disabled) disabledCohorts.add(cohortId);
  else disabledCohorts.delete(cohortId);
}

/** Test helper */
export function resetCohortMentorSettings(): void {
  disabledCohorts.clear();
  loadEnvDisabled();
}
