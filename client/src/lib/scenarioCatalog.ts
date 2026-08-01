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

function runId(row: RunRow): number {
  return row.run.id ?? 0;
}

/** Active in-progress eval run for the canonical scenario row shown on the mission card. */
export function findActiveRunForScenario<T extends ScenarioRef>(
  canonical: T,
  _allModuleRows: T[],
  runs: RunRow[] | undefined
): RunRow | undefined {
  const active =
    runs?.filter(
      (r) =>
        r.run.scenarioId === canonical.id &&
        r.run.status === "in_progress" &&
        !r.run.isDemo
    ) ?? [];
  if (active.length === 0) return undefined;
  return active.reduce((latest, row) => (runId(row) > runId(latest) ? row : latest));
}

/** Most recent completed eval run for a canonical scenario (by run id). */
export function findLatestCompletedRunForScenario<T extends ScenarioRef>(
  canonical: T,
  allModuleRows: T[],
  runs: RunRow[] | undefined
): RunRow | undefined {
  const scn = resolveScenarioScnCode(canonical);
  const ids = scn
    ? new Set(scenarioIdsForScn(scn, allModuleRows))
    : new Set([canonical.id]);
  const completed =
    runs?.filter(
      (r) => ids.has(r.run.scenarioId) && r.run.status === "completed" && !r.run.isDemo
    ) ?? [];
  if (completed.length === 0) return undefined;
  return completed.reduce((latest, row) => (runId(row) > runId(latest) ? row : latest));
}

/**
 * In-progress run shown in mission UI — ignores stale attempts left behind after a newer completion.
 * A replay attempt counts as active only when its run id is newer than the latest completed run.
 */
export function resolveDisplayActiveRunForScenario<T extends ScenarioRef>(
  canonical: T,
  allModuleRows: T[],
  runs: RunRow[] | undefined
): RunRow | undefined {
  const candidate = findActiveRunForScenario(canonical, allModuleRows, runs);
  if (!candidate) return undefined;
  const latestCompleted = findLatestCompletedRunForScenario(canonical, allModuleRows, runs);
  if (!latestCompleted) return candidate;
  return runId(candidate) > runId(latestCompleted) ? candidate : undefined;
}

export type MissionPrimaryAction = "start" | "continue" | "replay";

export function resolveMissionPrimaryAction(
  activeRun: RunRow | undefined,
  completedRun: RunRow | undefined,
): MissionPrimaryAction {
  if (activeRun) return "continue";
  if (completedRun) return "replay";
  return "start";
}

/** Latest completed eval run for a canonical scenario (includes duplicate row ids). */
export function findCompletedRunForScenario<T extends ScenarioRef>(
  canonical: T,
  allModuleRows: T[],
  runs: RunRow[] | undefined
): RunRow | undefined {
  const scn = resolveScenarioScnCode(canonical);
  const ids = scn
    ? new Set(scenarioIdsForScn(scn, allModuleRows))
    : new Set([canonical.id]);
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
