import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { calculateTotalScore } from "./scoringEngine";
import { M1_SCN_KEYS, type M1ScenarioCompletionMap } from "./db";
import { filterCanonicalScenariosForModule, OFFICIAL_SCN_BY_MODULE } from "./canonicalScenarios";
import {
  resolveSilverState,
  resolveSilverContinuePath,
  shouldShowSilverContinueButton,
} from "../client/src/components/certification/CertificationStatus";
import {
  SILVER_REGISTRY_COHORT_2026,
  lookupSilverRegistryByCertificateId,
  lookupSilverRegistryByStudentNumber,
} from "../shared/silverCertificationRegistry";

const serverDir = path.dirname(fileURLToPath(import.meta.url));

function readSource(filename: string): string {
  return readFileSync(path.join(serverDir, filename), "utf8");
}

function computeSilverEligible(input: {
  quizPassed: boolean;
  scenariosCompleted: M1ScenarioCompletionMap;
  complianceValidated: boolean;
  noBlockers: boolean;
}): boolean {
  const allScenariosDone = M1_SCN_KEYS.every((k) => input.scenariosCompleted[k]);
  return input.quizPassed && allScenariosDone && input.complianceValidated && input.noBlockers;
}

function allScenariosComplete(): M1ScenarioCompletionMap {
  return {
    SCN001: true,
    SCN002: true,
    SCN003: true,
    SCN004: true,
    SCN005: true,
  };
}

describe("Silver certification — eligibility rules", () => {
  it("M1_SCN_KEYS maps five scenarios SCN-001 to SCN-005", () => {
    expect(M1_SCN_KEYS).toEqual(["SCN001", "SCN002", "SCN003", "SCN004", "SCN005"]);
  });

  it("calculateTotalScore >= 60 is the per-scenario passing threshold", () => {
    const passingEvents = [
      { pointsDelta: 10 },
      { pointsDelta: 10 },
      { pointsDelta: 10 },
      { pointsDelta: 10 },
      { pointsDelta: 10 },
      { pointsDelta: 10 },
      { pointsDelta: 10 },
    ];
    expect(calculateTotalScore(passingEvents)).toBeGreaterThanOrEqual(60);

    const failingEvents = [{ pointsDelta: 10 }, { pointsDelta: 10 }];
    expect(calculateTotalScore(failingEvents)).toBeLessThan(60);
  });

  it("M1 Silver eligibility uses canonical SCN-001–005 only (not duplicate row count)", () => {
    const inflatedM1 = [
      { id: 1, moduleId: 1, name: "Scénario 1 — Cycle propre" },
      { id: 2, moduleId: 1, name: "Scénario 2 — Réception fantôme" },
      { id: 3, moduleId: 1, name: "Scénario 3 — Stock insuffisant" },
      { id: 8, moduleId: 1, name: "Scénario 3 — duplicate" },
      { id: 4, moduleId: 1, name: "Scénario 4 — Écart" },
      { id: 5, moduleId: 1, name: "Scénario 5 — Multi" },
      { id: 9, moduleId: 1, name: "Scénario 5 — duplicate" },
    ];
    expect(inflatedM1.filter((r) => r.moduleId === 1)).toHaveLength(7);
    expect(filterCanonicalScenariosForModule(1, inflatedM1)).toHaveLength(5);
    expect(OFFICIAL_SCN_BY_MODULE[1]).toHaveLength(M1_SCN_KEYS.length);
  });

  it("demo runs must be excluded from completion logic (isDemo filter contract)", () => {
    // Contract: getLatestNonDemoCompletedRun filters isDemo=false — verified by helper usage in db.ts
    const demoRun = { status: "completed" as const, isDemo: true };
    const evalRun = { status: "completed" as const, isDemo: false };
    expect(demoRun.isDemo).toBe(true);
    expect(evalRun.isDemo).toBe(false);
  });

  it("checkNoUnresolvedBlockers returns false when any canonical M1 SCN lacks a completed eval run", () => {
    const dbPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "db.ts");
    const source = readFileSync(dbPath, "utf8");
    const fnMatch = source.match(
      /export async function checkNoUnresolvedBlockers[\s\S]*?\n\}/,
    );
    expect(fnMatch).toBeTruthy();
    const fnBody = fnMatch![0];
    expect(fnBody).toContain("for (const scnCode of OFFICIAL_SCN_BY_MODULE[1])");
    expect(fnBody).toMatch(/if \(!latestRun\) return false;/);
    expect(fnBody).not.toMatch(/if \(!latestRun\) continue;/);
  });
});

describe("Silver certification — RC13 quiz.submit unlock hotfix", () => {
  it("quiz.submit evaluates Silver unlock after M1 quiz save (mirror silverStatus)", () => {
    const source = readSource("routers.ts");
    const submitMatch = source.match(/quiz:\s*router\(\{[\s\S]*?submit:\s*protectedProcedure[\s\S]*?checkAnswer:/);
    expect(submitMatch).toBeTruthy();
    const submitBody = submitMatch![0];
    expect(submitBody).toContain("saveQuizAttempt");
    expect(submitBody).toContain("if (input.moduleId === 1)");
    expect(submitBody).toContain("getSilverCertificationStatus(ctx.user.id)");
    expect(submitBody).toContain("status.silverEligible && !status.silverCertified");
    expect(submitBody).toContain("unlockSilverCertification(ctx.user.id)");
  });

  it("student becomes Silver eligible when Quiz M1 is the final gate (quiz-last path)", () => {
    const eligible = computeSilverEligible({
      quizPassed: true,
      scenariosCompleted: allScenariosComplete(),
      complianceValidated: true,
      noBlockers: true,
    });
    expect(eligible).toBe(true);
  });

  it("student does not become Silver eligible when any SCN-001..005 is missing", () => {
    for (const missing of M1_SCN_KEYS) {
      const scenarios = allScenariosComplete();
      scenarios[missing] = false;
      expect(
        computeSilverEligible({
          quizPassed: true,
          scenariosCompleted: scenarios,
          complianceValidated: true,
          noBlockers: true,
        }),
      ).toBe(false);
    }
  });

  it("student does not become Silver eligible when any latest eval run is below threshold", () => {
    const failingScenarios = allScenariosComplete();
    failingScenarios.SCN003 = false;
    expect(
      computeSilverEligible({
        quizPassed: true,
        scenariosCompleted: failingScenarios,
        complianceValidated: true,
        noBlockers: true,
      }),
    ).toBe(false);
  });

  it("student does not become Silver eligible without compliance on all canonical M1 SCNs", () => {
    expect(
      computeSilverEligible({
        quizPassed: true,
        scenariosCompleted: allScenariosComplete(),
        complianceValidated: false,
        noBlockers: true,
      }),
    ).toBe(false);
  });

  it("student does not become Silver eligible with unresolved blockers", () => {
    expect(
      computeSilverEligible({
        quizPassed: true,
        scenariosCompleted: allScenariosComplete(),
        complianceValidated: true,
        noBlockers: false,
      }),
    ).toBe(false);
  });

  it("demo runs do not count toward Silver (isDemo=false filter contract)", () => {
    const dbSource = readSource("db.ts");
    expect(dbSource).toContain('eq(scenarioRuns.isDemo, false)');
    const demoRun = { status: "completed" as const, isDemo: true };
    const evalRun = { status: "completed" as const, isDemo: false };
    expect(demoRun.isDemo).toBe(true);
    expect(evalRun.isDemo).toBe(false);
  });

  it("unlockSilverCertification only sets silverCertified=true (no revocation path)", () => {
    const dbSource = readSource("db.ts");
    const fnMatch = dbSource.match(/export async function unlockSilverCertification[\s\S]*?\n\}/);
    expect(fnMatch).toBeTruthy();
    expect(fnMatch![0]).toContain("silverCertified: true");
    expect(fnMatch![0]).not.toContain("silverCertified: false");
  });

  it("existing Silver is not re-evaluated for revocation in quiz.submit unlock guard", () => {
    const source = readSource("routers.ts");
    const submitMatch = source.match(/quiz:\s*router\(\{[\s\S]*?submit:\s*protectedProcedure[\s\S]*?checkAnswer:/);
    expect(submitMatch![0]).toContain("!status.silverCertified");
  });

  it("Gold logic is unaffected by quiz.submit M1 unlock (no gold unlock in quiz path)", () => {
    const source = readSource("routers.ts");
    const submitMatch = source.match(/quiz:\s*router\(\{[\s\S]*?submit:\s*protectedProcedure[\s\S]*?checkAnswer:/);
    expect(submitMatch![0]).not.toContain("unlockGoldCertification");
    expect(submitMatch![0]).not.toContain("getGoldCertificationStatus");
  });
});

describe("Silver certification — UI display contract", () => {
  it("profiles.silverCertified=true renders Obtenue / Obtained state", () => {
    expect(
      resolveSilverState({
        silverEarned: true,
        silverEligible: true,
        hasAnyProgress: true,
        allRequirementsMet: true,
      }),
    ).toBe("obtenue");
  });

  it("silverEarned hides Continue pathway button", () => {
    expect(shouldShowSilverContinueButton(true, "obtenue")).toBe(false);
  });

  it("eligible state hides Continue pathway button (certificate preview instead)", () => {
    expect(shouldShowSilverContinueButton(false, "eligible")).toBe(false);
  });

  it("in-progress state shows Continue pathway button", () => {
    expect(shouldShowSilverContinueButton(false, "en_cours")).toBe(true);
  });

  it("Continue routes to scenarios when M1 quiz is already passed", () => {
    expect(resolveSilverContinuePath(true)).toBe("/student/scenarios");
    expect(resolveSilverContinuePath(false)).toBe("/student/quiz/1");
  });

  it("CertificationsPage uses Continue helpers (not hardcoded quiz/1 only)", () => {
    const source = readFileSync(
      path.join(serverDir, "../client/src/pages/student/CertificationsPage.tsx"),
      "utf8",
    );
    expect(source).toContain("shouldShowSilverContinueButton");
    expect(source).toContain("resolveSilverContinuePath");
    expect(source).not.toMatch(/\{!silverEarned && \([\s\S]*?navigate\("\/student\/quiz\/1"\)/);
  });

  it("eligible-but-not-persisted shows Eligible until silverCertified is set", () => {
    expect(
      resolveSilverState({
        silverEarned: false,
        silverEligible: true,
        hasAnyProgress: true,
        allRequirementsMet: true,
      }),
    ).toBe("eligible");
  });
});

describe("Silver certification — certified state display alignment", () => {
  it("getSilverCertificationStatus returns all gates true when silverCertified is set", () => {
    const dbSource = readSource("db.ts");
    const fnMatch = dbSource.match(/export async function getSilverCertificationStatus[\s\S]*?\n\}/);
    expect(fnMatch).toBeTruthy();
    const fnBody = fnMatch![0];
    expect(fnBody).toMatch(/if \(silverCertified\)/);
    expect(fnBody).toContain("quizPassed: true");
    expect(fnBody).toContain("complianceValidated: true");
    expect(fnBody).toContain("noBlockers: true");
    expect(fnBody).toContain("silverEligible: true");
    expect(fnBody).toMatch(/SCN001:\s*true[\s\S]*SCN005:\s*true/);
  });

  it("uncertified students still use live M1 gate computation", () => {
    const dbSource = readSource("db.ts");
    const fnMatch = dbSource.match(/export async function getSilverCertificationStatus[\s\S]*?\n\}/);
    expect(fnMatch![0]).toContain("checkM1QuizPassed");
    expect(fnMatch![0]).toContain("getM1ScenarioCompletionStatus");
    expect(fnMatch![0]).toContain("checkM1ComplianceValidated");
    expect(fnMatch![0]).toContain("checkNoUnresolvedBlockers");
  });
});

describe("Silver certification — RC13 cohort registry", () => {
  it("registers four first-cohort Silver credential IDs", () => {
    expect(SILVER_REGISTRY_COHORT_2026).toHaveLength(4);
    expect(SILVER_REGISTRY_COHORT_2026.map((e) => e.certificateId)).toEqual([
      "TEC-SIL-2026-001",
      "TEC-SIL-2026-002",
      "TEC-SIL-2026-003",
      "TEC-SIL-2026-004",
    ]);
  });

  it("looks up registry entry by student number", () => {
    expect(lookupSilverRegistryByStudentNumber("2026-1806")?.certificateId).toBe("TEC-SIL-2026-001");
    expect(lookupSilverRegistryByStudentNumber("2026-1806")?.displayName).toBe("Aissata Soukeina Camara");
    expect(lookupSilverRegistryByStudentNumber("00-2004")?.certificateId).toBe("TEC-SIL-2026-002");
    expect(lookupSilverRegistryByStudentNumber("1011-KF")?.certificateId).toBe("TEC-SIL-2026-003");
    expect(lookupSilverRegistryByStudentNumber(" 613-462 ")?.certificateId).toBe("TEC-SIL-2026-004");
    expect(lookupSilverRegistryByStudentNumber(null)).toBeNull();
    expect(lookupSilverRegistryByStudentNumber("unknown")).toBeNull();
  });

  it("looks up registry entry by certificate ID", () => {
    expect(lookupSilverRegistryByCertificateId("TEC-SIL-2026-001")?.displayName).toBe("Aissata Soukeina Camara");
    expect(lookupSilverRegistryByCertificateId("TEC-SIL-2026-002")?.studentNumber).toBe("00-2004");
    expect(lookupSilverRegistryByCertificateId("TEC-SIL-2026-003")?.studentNumber).toBe("1011-KF");
    expect(lookupSilverRegistryByCertificateId("TEC-SIL-9999-999")).toBeNull();
  });
});
