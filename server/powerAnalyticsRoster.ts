/** Roster-aware analytics helpers — merge cohort enrollment with run-based stats. */

export type StudentRankingEntry = {
  userId: number;
  userName: string;
  bestScore: number;
  avgScore: number;
  totalRuns: number;
  totalCompleted: number;
  totalPenalties: number;
  avgProgress: number;
  hasRuns: boolean;
};

export type RosterStudentRef = {
  id: number;
  name: string | null;
};

export type RosterKpis = {
  enrolledStudents: number;
  activeEvalStudents: number;
  notStartedStudents: number;
};

/** Students with eval runs first (by best score), then roster-only students alphabetically. */
export function mergeRosterIntoStudentRanking(
  roster: RosterStudentRef[],
  runBasedRanking: StudentRankingEntry[],
): StudentRankingEntry[] {
  const byUserId = new Map(runBasedRanking.map((r) => [r.userId, r]));
  const merged: StudentRankingEntry[] = [];

  for (const student of roster) {
    const existing = byUserId.get(student.id);
    if (existing) {
      merged.push({ ...existing, hasRuns: true });
      byUserId.delete(student.id);
    } else {
      merged.push({
        userId: student.id,
        userName: student.name ?? `User#${student.id}`,
        bestScore: 0,
        avgScore: 0,
        totalRuns: 0,
        totalCompleted: 0,
        totalPenalties: 0,
        avgProgress: 0,
        hasRuns: false,
      });
    }
  }

  const withRuns = merged.filter((s) => s.hasRuns).sort((a, b) => b.bestScore - a.bestScore);
  const withoutRuns = merged
    .filter((s) => !s.hasRuns)
    .sort((a, b) => a.userName.localeCompare(b.userName));
  return [...withRuns, ...withoutRuns];
}

export function computeRosterKpis(
  rosterCount: number,
  activeEvalStudentIds: Iterable<number>,
): RosterKpis {
  const activeEvalStudents = new Set(activeEvalStudentIds).size;
  return {
    enrolledStudents: rosterCount,
    activeEvalStudents,
    notStartedStudents: Math.max(0, rosterCount - activeEvalStudents),
  };
}

/** Roster students with no eval runs — for monitor visibility. */
export function studentsWithoutEvalRuns(
  roster: RosterStudentRef[],
  evalRunUserIds: Iterable<number>,
): RosterStudentRef[] {
  const activeIds = new Set(evalRunUserIds);
  return roster.filter((s) => !activeIds.has(s.id));
}
