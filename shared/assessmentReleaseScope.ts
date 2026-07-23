/**
 * Cohort-scoped assessment release helpers (pure — no DB).
 * One logical release per (assessmentId, cohortId); cohort ownership is immutable.
 */

export type ReleaseScopeRow = {
  id: number;
  assessmentId: number;
  cohortId: number | null;
  releaseLevel: string;
};

/** Find the release for a specific assessment + cohort (exact match). */
export function findReleaseForCohort<T extends ReleaseScopeRow>(
  releases: T[],
  assessmentId: number,
  cohortId: number | null
): T | null {
  const matches = releases.filter(
    (r) =>
      r.assessmentId === assessmentId &&
      (cohortId == null
        ? r.cohortId == null
        : r.cohortId === cohortId)
  );
  if (matches.length === 0) return null;
  // Prefer most recently listed (caller should sort by updatedAt desc if available)
  return matches[0] ?? null;
}

/**
 * Reject mutating an existing release's cohort membership.
 * Changing cohort must create/select another release, never reassign.
 */
export function assertReleaseCohortImmutable(args: {
  existingCohortId: number | null | undefined;
  requestedCohortId: number | null | undefined;
  releaseId: number;
}): void {
  const existing = args.existingCohortId ?? null;
  const requested = args.requestedCohortId ?? null;
  if (existing !== requested) {
    throw new Error(
      `RELEASE_COHORT_IMMUTABLE: release #${args.releaseId} belongs to cohort ${existing}; ` +
        `cannot reassign to cohort ${requested}. Create or select a separate release.`
    );
  }
}

/** Detect duplicate rows for the same assessment+cohort (data integrity). */
export function findDuplicateReleaseScopes(
  releases: ReleaseScopeRow[]
): Array<{ assessmentId: number; cohortId: number | null; ids: number[] }> {
  const map = new Map<string, number[]>();
  for (const r of releases) {
    const key = `${r.assessmentId}:${r.cohortId ?? "null"}`;
    const list = map.get(key) ?? [];
    list.push(r.id);
    map.set(key, list);
  }
  const dups: Array<{
    assessmentId: number;
    cohortId: number | null;
    ids: number[];
  }> = [];
  for (const [key, ids] of map) {
    if (ids.length < 2) continue;
    const [assessmentIdStr, cohortStr] = key.split(":");
    dups.push({
      assessmentId: Number(assessmentIdStr),
      cohortId: cohortStr === "null" ? null : Number(cohortStr),
      ids,
    });
  }
  return dups;
}
