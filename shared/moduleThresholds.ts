/**
 * GOV-T01 canonical module thresholds — single source for server + client.
 * M1–M2 scenario pass: 60 · M3–M5 scenario pass: 70 · Quiz M1/M5: 60 %
 */

export const QUIZ_PASS_THRESHOLD = 60;

/** Official scenario evaluation pass threshold per module (GOV-T01). */
export function getModuleScenarioPassThreshold(moduleId: number): number {
  return moduleId >= 3 ? 70 : 60;
}

/** @deprecated Use getModuleScenarioPassThreshold — kept for OIL / slides hub imports. */
export function getEvalScoreThreshold(moduleId: number): number {
  return getModuleScenarioPassThreshold(moduleId);
}

/**
 * Prospective pass with conditional grandfather (T-01 §6.3).
 * Legacy M3–M5 rows already marked passed retain unlock; new sub-threshold scores do not pass.
 */
export function computeModulePassResult(
  moduleId: number,
  score: number,
  existingPassed?: boolean,
): { passed: boolean; threshold: number } {
  const threshold = getModuleScenarioPassThreshold(moduleId);
  if (score >= threshold) {
    return { passed: true, threshold };
  }
  if (moduleId >= 3 && existingPassed) {
    return { passed: true, threshold };
  }
  return { passed: false, threshold };
}
