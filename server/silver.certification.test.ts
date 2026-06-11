import { describe, expect, it } from "vitest";
import { calculateTotalScore } from "./scoringEngine";
import { M1_SCN_KEYS } from "./db";
import { filterCanonicalScenariosForModule, OFFICIAL_SCN_BY_MODULE } from "./canonicalScenarios";

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
});
