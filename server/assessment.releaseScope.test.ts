import { describe, expect, it } from "vitest";
import {
  assertReleaseCohortImmutable,
  findDuplicateReleaseScopes,
  findReleaseForCohort,
} from "../shared/assessmentReleaseScope";
import { COHORTE_A_ID, COHORTE_B_ID } from "../shared/assessmentCore";

describe("assessment release scope", () => {
  const releases = [
    {
      id: 1,
      assessmentId: 1,
      cohortId: COHORTE_B_ID,
      releaseLevel: "released_cohort",
    },
    {
      id: 2,
      assessmentId: 1,
      cohortId: COHORTE_A_ID,
      releaseLevel: "visible_pending",
    },
  ];

  it("finds Cohort A release without returning Cohort B", () => {
    const a = findReleaseForCohort(releases, 1, COHORTE_A_ID);
    expect(a?.id).toBe(2);
    expect(a?.cohortId).toBe(COHORTE_A_ID);
    expect(a?.releaseLevel).toBe("visible_pending");
  });

  it("finds Cohort B release independently", () => {
    const b = findReleaseForCohort(releases, 1, COHORTE_B_ID);
    expect(b?.id).toBe(1);
    expect(b?.cohortId).toBe(COHORTE_B_ID);
  });

  it("returns null when cohort has no release", () => {
    expect(findReleaseForCohort(releases, 1, 99)).toBeNull();
  });

  it("rejects reassigning Cohort B release to Cohort A", () => {
    expect(() =>
      assertReleaseCohortImmutable({
        existingCohortId: COHORTE_B_ID,
        requestedCohortId: COHORTE_A_ID,
        releaseId: 1,
      })
    ).toThrow(/RELEASE_COHORT_IMMUTABLE/);
  });

  it("allows update when cohort stays the same", () => {
    expect(() =>
      assertReleaseCohortImmutable({
        existingCohortId: COHORTE_A_ID,
        requestedCohortId: COHORTE_A_ID,
        releaseId: 2,
      })
    ).not.toThrow();
  });

  it("detects duplicate assessment+cohort scopes", () => {
    const dups = findDuplicateReleaseScopes([
      ...releases,
      {
        id: 99,
        assessmentId: 1,
        cohortId: COHORTE_A_ID,
        releaseLevel: "closed",
      },
    ]);
    expect(dups).toEqual([
      {
        assessmentId: 1,
        cohortId: COHORTE_A_ID,
        ids: [2, 99],
      },
    ]);
  });

  it("keeps constants aligned with Été 2026 cohorts", () => {
    expect(COHORTE_A_ID).toBe(2);
    expect(COHORTE_B_ID).toBe(3);
  });
});
