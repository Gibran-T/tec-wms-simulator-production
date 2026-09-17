/**
 * Hub/monitor run selection — avoid enriching hundreds of historical attempts.
 * Keeps every in-progress run plus the latest completed run per user+scenario.
 */

export type HubRunRef = {
  id: number;
  scenarioId: number;
  status: string;
  userId?: number;
  completedAt?: Date | string | null;
};

export function selectRunsForHub<T extends { run: HubRunRef }>(runs: T[]): T[] {
  const inProgress = runs.filter((r) => r.run.status === "in_progress");
  const latestCompleted = new Map<string, T>();
  for (const row of runs) {
    if (row.run.status !== "completed") continue;
    const key = `${row.run.userId ?? 0}:${row.run.scenarioId}`;
    const prev = latestCompleted.get(key);
    if (!prev) {
      latestCompleted.set(key, row);
      continue;
    }
    const prevAt = prev.run.completedAt ? new Date(prev.run.completedAt).getTime() : 0;
    const nextAt = row.run.completedAt ? new Date(row.run.completedAt).getTime() : 0;
    if (nextAt > prevAt || (nextAt === prevAt && row.run.id > prev.run.id)) {
      latestCompleted.set(key, row);
    }
  }
  const seen = new Set<number>();
  const out: T[] = [];
  for (const row of inProgress.concat(Array.from(latestCompleted.values()))) {
    if (seen.has(row.run.id)) continue;
    seen.add(row.run.id);
    out.push(row);
  }
  return out;
}
