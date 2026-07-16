import { describe, expect, it } from "vitest";
import {
  canAccessLearningModule,
  isLearningModuleOpenAccess,
  LEARNING_MODULE_IDS,
} from "./moduleAccess";

describe("canAccessLearningModule — open M1–M5 (no progression checkpoints)", () => {
  it("A: new student with no completions can open M1–M5", () => {
    for (const moduleId of LEARNING_MODULE_IDS) {
      expect(
        canAccessLearningModule({
          authenticated: true,
          enrolledInCohort: true,
          moduleId,
        }),
      ).toBe(true);
    }
  });

  it("B: incomplete M1 does not block M2", () => {
    expect(
      canAccessLearningModule({
        authenticated: true,
        enrolledInCohort: true,
        moduleId: 2,
      }),
    ).toBe(true);
  });

  it("C: failed/incomplete M2 does not block M3", () => {
    expect(
      canAccessLearningModule({
        authenticated: true,
        enrolledInCohort: true,
        moduleId: 3,
      }),
    ).toBe(true);
  });

  it("D: M4 and M5 open without preceding module completion", () => {
    expect(
      canAccessLearningModule({
        authenticated: true,
        enrolledInCohort: true,
        moduleId: 4,
      }),
    ).toBe(true);
    expect(
      canAccessLearningModule({
        authenticated: true,
        enrolledInCohort: true,
        moduleId: 5,
      }),
    ).toBe(true);
  });

  it("H: authentication remains enforced", () => {
    expect(
      canAccessLearningModule({
        authenticated: false,
        enrolledInCohort: true,
        moduleId: 1,
      }),
    ).toBe(false);
  });

  it("H: cohort enrollment remains enforced", () => {
    expect(
      canAccessLearningModule({
        authenticated: true,
        enrolledInCohort: false,
        moduleId: 3,
      }),
    ).toBe(false);
  });

  it("rejects unknown module ids outside M1–M5", () => {
    expect(
      canAccessLearningModule({
        authenticated: true,
        enrolledInCohort: true,
        moduleId: 99,
      }),
    ).toBe(false);
  });

  it("isLearningModuleOpenAccess covers M1–M5 only", () => {
    expect(LEARNING_MODULE_IDS.every(isLearningModuleOpenAccess)).toBe(true);
    expect(isLearningModuleOpenAccess(0)).toBe(false);
    expect(isLearningModuleOpenAccess(6)).toBe(false);
  });
});
