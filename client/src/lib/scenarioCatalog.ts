import {
  filterCanonicalScenariosForModule,
  resolveScenarioScnCode,
  scenarioIdsForScn,
  type OfficialScnCode,
  type ScenarioRef,
} from "../../../server/canonicalScenarios";

export { filterCanonicalScenariosForModule, resolveScenarioScnCode };

type RunRow = {
  run: { scenarioId: number; status: string; isDemo: boolean; score?: number | null };
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
  return runs?.find(
    (r) => ids.has(r.run.scenarioId) && r.run.status === "completed" && !r.run.isDemo
  );
}

export function scnBadgeLabel(scn: OfficialScnCode | null): string | null {
  return scn;
}
