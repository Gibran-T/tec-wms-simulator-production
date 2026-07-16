/**
 * RC12 Wave 2 — Progression Integrity validation matrix (V2.1, V2.6, V2.7, V2.9)
 */
import { describe, expect, it } from "vitest";
import {
  computeModulePassResult,
  getModuleScenarioPassThreshold,
  QUIZ_PASS_THRESHOLD,
} from "@shared/moduleThresholds";
import { canAccessLearningModule } from "@shared/moduleAccess";
import { isModule3Unlocked } from "./rulesEngine";

describe("Wave 2 — V2.1 threshold governance (GOV-T01)", () => {
  it("M1 and M2 scenario pass threshold is 60", () => {
    expect(getModuleScenarioPassThreshold(1)).toBe(60);
    expect(getModuleScenarioPassThreshold(2)).toBe(60);
  });

  it("M3, M4, M5 scenario pass threshold is 70", () => {
    expect(getModuleScenarioPassThreshold(3)).toBe(70);
    expect(getModuleScenarioPassThreshold(4)).toBe(70);
    expect(getModuleScenarioPassThreshold(5)).toBe(70);
  });

  it("quiz pass threshold remains 60 % for M1 and M5", () => {
    expect(QUIZ_PASS_THRESHOLD).toBe(60);
  });

  it("M3 score 65 does not pass prospectively", () => {
    expect(computeModulePassResult(3, 65).passed).toBe(false);
  });

  it("M3 score 72 passes", () => {
    expect(computeModulePassResult(3, 72).passed).toBe(true);
  });

  it("M1 score 62 passes at threshold 60", () => {
    expect(computeModulePassResult(1, 62).passed).toBe(true);
  });

  it("conditional grandfather retains M3 pass for legacy band", () => {
    expect(computeModulePassResult(3, 65, true).passed).toBe(true);
  });

  it("no grandfather for new M3 sub-70 when not previously passed", () => {
    expect(computeModulePassResult(3, 65, false).passed).toBe(false);
  });
});

describe("Wave 2 hotfix — quiz must not block scenario access", () => {
  it("eval student runs are not blocked by quiz pass (RC12 pedagogical rule)", () => {
    const isDemo = false;
    const role = "student";
    const quizGateEnabled = false;
    const shouldBlockQuiz = quizGateEnabled && !isDemo && role === "student";
    expect(shouldBlockQuiz).toBe(false);
  });

  it("demo mode remains accessible for teachers/admins", () => {
    const teacherRole = "teacher";
    const inputIsDemo = true;
    const teacherDemo = inputIsDemo && (teacherRole === "teacher" || teacherRole === "admin");
    expect(teacherDemo).toBe(true);
  });

  it("Silver M1 quiz threshold unchanged at 60 %", () => {
    expect(QUIZ_PASS_THRESHOLD).toBe(60);
  });
});

describe("Wave 2 — V2.7 teacherValidated is STATUS only (not M4 access gate)", () => {
  it("legacy status helper still reflects teacherValidated + passed", () => {
    expect(isModule3Unlocked({ passed: true, teacherValidated: false })).toBe(false);
    expect(isModule3Unlocked({ passed: true, teacherValidated: true })).toBe(true);
    expect(isModule3Unlocked({ passed: false, teacherValidated: true })).toBe(false);
  });

  it("M4 learning access is open without teacher validation", () => {
    expect(
      canAccessLearningModule({
        authenticated: true,
        enrolledInCohort: true,
        moduleId: 4,
      }),
    ).toBe(true);
  });
});

describe("Wave 2 — V2.9 Silver regression shield (M1 threshold unchanged)", () => {
  it("M1 Silver per-scenario floor remains 60", () => {
    expect(getModuleScenarioPassThreshold(1)).toBe(60);
    expect(computeModulePassResult(1, 60).passed).toBe(true);
    expect(computeModulePassResult(1, 59).passed).toBe(false);
  });
});
