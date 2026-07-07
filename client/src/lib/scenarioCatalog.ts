import {
  filterCanonicalScenariosForModule,
  resolveScenarioScnCode,
  scenarioIdsForScn,
  type OfficialScnCode,
  type ScenarioRef,
} from "../../../server/canonicalScenarios";

export { filterCanonicalScenariosForModule, resolveScenarioScnCode };

type RunRow = {
  run: { id?: number; scenarioId: number; status: string; isDemo: boolean; score?: number | null };
  score?: number | null;
};

/** Active in-progress eval run for a canonical scenario (includes duplicate row ids). */
export function findActiveRunForScenario<T extends ScenarioRef>(
  canonical: T,
  allModuleRows: T[],
  runs: RunRow[] | undefined
): RunRow | undefined {
  const scn = resolveScenarioScnCode(canonical);
  if (!scn) return undefined;
  const ids = new Set(scenarioIdsForScn(scn, allModuleRows));
  return runs?.find(
    (r) => ids.has(r.run.scenarioId) && r.run.status === "in_progress" && !r.run.isDemo
  );
}

/** Latest completed eval run for a canonical scenario (includes duplicate row ids). */
export function findCompletedRunForScenario<T extends ScenarioRef>(
  canonical: T,
  allModuleRows: T[],
  runs: RunRow[] | undefined
): RunRow | undefined {
  const scn = resolveScenarioScnCode(canonical);
  if (!scn) return undefined;
  const ids = new Set(scenarioIdsForScn(scn, allModuleRows));
  const completed =
    runs?.filter(
      (r) => ids.has(r.run.scenarioId) && r.run.status === "completed" && !r.run.isDemo
    ) ?? [];
  if (completed.length === 0) return undefined;
  return completed.reduce((best, row) => {
    const bestScore = best.score ?? best.run.score ?? -1;
    const rowScore = row.score ?? row.run.score ?? -1;
    return rowScore > bestScore ? row : best;
  });
}

export function scnBadgeLabel(scn: OfficialScnCode | null): string | null {
  return scn;
}
