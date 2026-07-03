import { describe, expect, it } from "vitest";
import {
  computeRosterKpis,
  mergeRosterIntoStudentRanking,
  studentsWithoutEvalRuns,
  type StudentRankingEntry,
} from "./powerAnalyticsRoster";

function runEntry(
  userId: number,
  userName: string,
  bestScore: number,
): StudentRankingEntry {
  return {
    userId,
    userName,
    bestScore,
    avgScore: bestScore,
    totalRuns: 1,
    totalCompleted: 1,
    totalPenalties: 0,
    avgProgress: 50,
    hasRuns: true,
  };
}

describe("mergeRosterIntoStudentRanking", () => {
  it("includes roster students with zero stats when they have no runs", () => {
    const roster = [
      { id: 1, name: "Alice Active" },
      { id: 2, name: "Bob Not Started" },
    ];
    const ranking = [runEntry(1, "Alice Active", 80)];

    const merged = mergeRosterIntoStudentRanking(roster, ranking);

    expect(merged).toHaveLength(2);
    expect(merged[0]).toMatchObject({ userId: 1, bestScore: 80, hasRuns: true });
    expect(merged[1]).toMatchObject({
      userId: 2,
      userName: "Bob Not Started",
      bestScore: 0,
      avgScore: 0,
      totalRuns: 0,
      totalCompleted: 0,
      totalPenalties: 0,
      avgProgress: 0,
      hasRuns: false,
    });
  });

  it("returns all roster students when cohort has no runs", () => {
    const roster = [
      { id: 10, name: "Gnouma Camara" },
      { id: 11, name: "Willy Kouganou" },
      { id: 12, name: "Yawo Sodokin" },
      { id: 13, name: "Ghislain Djitouo" },
    ];

    const merged = mergeRosterIntoStudentRanking(roster, []);

    expect(merged).toHaveLength(4);
    expect(merged.every((s) => !s.hasRuns && s.totalRuns === 0)).toBe(true);
  });

  it("preserves mixed active + not started counts", () => {
    const roster = [
      { id: 1, name: "Anthony" },
      { id: 2, name: "Marc" },
      { id: 3, name: "Toumany" },
      { id: 4, name: "Said Mohamed Traore" },
    ];
    const ranking = [
      runEntry(1, "Anthony", 70),
      runEntry(2, "Marc", 85),
      runEntry(3, "Toumany", 60),
    ];

    const merged = mergeRosterIntoStudentRanking(roster, ranking);
    const kpis = computeRosterKpis(
      roster.length,
      merged.filter((s) => s.hasRuns).map((s) => s.userId),
    );

    expect(merged).toHaveLength(4);
    expect(kpis.enrolledStudents).toBe(4);
    expect(kpis.activeEvalStudents).toBe(3);
    expect(kpis.notStartedStudents).toBe(1);
    expect(merged.find((s) => s.userId === 4)?.hasRuns).toBe(false);
  });

  it("does not include students outside the roster", () => {
    const roster = [{ id: 1, name: "Cohort A Student" }];
    const ranking = [
      runEntry(1, "Cohort A Student", 90),
      runEntry(99, "Other Cohort Student", 95),
    ];

    const merged = mergeRosterIntoStudentRanking(roster, ranking);

    expect(merged).toHaveLength(1);
    expect(merged.some((s) => s.userId === 99)).toBe(false);
  });
});

describe("computeRosterKpis", () => {
  it("computes not started as enrolled minus active eval students", () => {
    expect(computeRosterKpis(4, [1, 2, 3])).toEqual({
      enrolledStudents: 4,
      activeEvalStudents: 3,
      notStartedStudents: 1,
    });
  });

  it("handles zero active students", () => {
    expect(computeRosterKpis(4, [])).toEqual({
      enrolledStudents: 4,
      activeEvalStudents: 0,
      notStartedStudents: 4,
    });
  });

  it("handles Groupe B classroom scenario: 5 enrolled, 0 active eval", () => {
    expect(computeRosterKpis(5, [])).toEqual({
      enrolledStudents: 5,
      activeEvalStudents: 0,
      notStartedStudents: 5,
    });
  });
});

describe("Groupe B roster-only analytics", () => {
  it("lists all 5 students as not started when cohort has no eval runs", () => {
    const roster = [
      { id: 1, name: "Gnouma Camara" },
      { id: 2, name: "Ghislain Djitouo" },
      { id: 3, name: "Yawo Sodokin" },
      { id: 4, name: "James Timothy" },
      { id: 5, name: "Willy Kouganou" },
    ];

    const merged = mergeRosterIntoStudentRanking(roster, []);

    expect(merged).toHaveLength(5);
    expect(merged.every((s) => !s.hasRuns && s.totalRuns === 0)).toBe(true);
  });
});

describe("studentsWithoutEvalRuns", () => {
  it("lists roster students missing from eval runs", () => {
    const roster = [
      { id: 1, name: "Active" },
      { id: 2, name: "Not Started" },
    ];
    expect(studentsWithoutEvalRuns(roster, [1])).toEqual([{ id: 2, name: "Not Started" }]);
  });
});
