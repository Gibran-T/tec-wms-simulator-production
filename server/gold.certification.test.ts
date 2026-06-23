import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  GOLD_CAPSTONE_THRESHOLD,
  getModuleScenarioPassThreshold,
} from "@shared/moduleThresholds";
import {
  GOLD_SCN_KEYS,
  GOLD_REQUIREMENTS_TOTAL,
  getGoldScenarioPassThreshold,
  goldScnKeyFromCode,
  isGoldUnlockEnabled,
  resolveGoldState,
} from "./goldCertification";
import { OFFICIAL_SCN_BY_MODULE } from "./canonicalScenarios";

describe("Gold certification — eligibility rules", () => {
  it("GOLD_SCN_KEYS maps twelve scenarios SCN-006 to SCN-017", () => {
    expect(GOLD_SCN_KEYS).toHaveLength(12);
    expect(GOLD_SCN_KEYS[0]).toBe("SCN006");
    expect(GOLD_SCN_KEYS[11]).toBe("SCN017");
  });

  it("goldScnKeyFromCode converts official SCN codes", () => {
    expect(goldScnKeyFromCode("SCN-006")).toBe("SCN006");
    expect(goldScnKeyFromCode("SCN-017")).toBe("SCN017");
  });

  it("GOLD_REQUIREMENTS_TOTAL is 18 checklist rows", () => {
    expect(GOLD_REQUIREMENTS_TOTAL).toBe(18);
  });

  it("GOLD_CAPSTONE_THRESHOLD is 70 per GOV-T02", () => {
    expect(GOLD_CAPSTONE_THRESHOLD).toBe(70);
  });

  it("GT-M2-01: SCN-006/007/008 require score >= 60", () => {
    for (const scn of OFFICIAL_SCN_BY_MODULE[2]) {
      expect(getGoldScenarioPassThreshold(scn)).toBe(60);
    }
  });

  it("GT-M3-01: SCN-009/010/011 require score >= 70", () => {
    for (const scn of OFFICIAL_SCN_BY_MODULE[3]) {
      expect(getGoldScenarioPassThreshold(scn)).toBe(70);
    }
  });

  it("GT-M4-01: SCN-012/013/014 require score >= 70", () => {
    for (const scn of OFFICIAL_SCN_BY_MODULE[4]) {
      expect(getGoldScenarioPassThreshold(scn)).toBe(70);
    }
  });

  it("GT-M5-01: SCN-015/016 require score >= 70", () => {
    expect(getGoldScenarioPassThreshold("SCN-015")).toBe(70);
    expect(getGoldScenarioPassThreshold("SCN-016")).toBe(70);
  });

  it("GT-M5-02/03: SCN-017 Gold capstone gate is 70", () => {
    expect(getGoldScenarioPassThreshold("SCN-017")).toBe(70);
    expect(getGoldScenarioPassThreshold("SCN-017")).toBe(GOLD_CAPSTONE_THRESHOLD);
  });

  it("GT-TH-01: thresholds sourced from moduleThresholds SSOT", () => {
    expect(getGoldScenarioPassThreshold("SCN-009")).toBe(getModuleScenarioPassThreshold(3));
    expect(getGoldScenarioPassThreshold("SCN-006")).toBe(getModuleScenarioPassThreshold(2));
  });

  describe("resolveGoldState", () => {
    it("returns LOCKED without Silver", () => {
      expect(resolveGoldState({ silverCertified: false, goldCertified: false, goldEligible: false })).toBe("LOCKED");
    });

    it("returns AWARDED when goldCertified", () => {
      expect(resolveGoldState({ silverCertified: true, goldCertified: true, goldEligible: true })).toBe("AWARDED");
    });

    it("returns ELIGIBLE when goldEligible and not yet certified", () => {
      expect(resolveGoldState({ silverCertified: true, goldCertified: false, goldEligible: true })).toBe("ELIGIBLE");
    });

    it("returns IN_PROGRESS when Silver earned but requirements incomplete", () => {
      expect(resolveGoldState({ silverCertified: true, goldCertified: false, goldEligible: false })).toBe("IN_PROGRESS");
    });
  });

  describe("institutional founding cohort award display", () => {
    it("buildInstitutionalGoldAwardStatus reports 18/18 AWARDED with audit source", async () => {
      const { buildInstitutionalGoldAwardStatus } = await import("./goldCertification");
      const { FONDATRICE_2026_GOLD_AWARD, FONDATRICE_GOLD_INSTITUTIONAL_NOTE } = await import(
        "@shared/foundingCohortGoldAward"
      );
      const status = buildInstitutionalGoldAwardStatus(FONDATRICE_2026_GOLD_AWARD);
      expect(status.state).toBe("AWARDED");
      expect(status.goldCertified).toBe(true);
      expect(status.goldEligible).toBe(true);
      expect(status.requirementsMetCount).toBe(GOLD_REQUIREMENTS_TOTAL);
      expect(status.requirementsTotalCount).toBe(18);
      expect(status.goldAwardSource).toBe(FONDATRICE_2026_GOLD_AWARD);
      expect(status.institutionalNote).toBe(FONDATRICE_GOLD_INSTITUTIONAL_NOTE);
      expect(status.quizM5Passed).toBe(true);
      expect(GOLD_SCN_KEYS.every((k) => status.scenariosCompleted[k])).toBe(true);
      expect(status.blockerSummary).toBeUndefined();
    });
  });

  it("GT-FLAG-01: ENABLE_GOLD_UNLOCK defaults to false", () => {
    const prev = process.env.ENABLE_GOLD_UNLOCK;
    delete process.env.ENABLE_GOLD_UNLOCK;
    expect(isGoldUnlockEnabled()).toBe(false);
    process.env.ENABLE_GOLD_UNLOCK = "true";
    expect(isGoldUnlockEnabled()).toBe(true);
    if (prev === undefined) delete process.env.ENABLE_GOLD_UNLOCK;
    else process.env.ENABLE_GOLD_UNLOCK = prev;
  });

  it("demo runs excluded via isDemo filter in gold helpers", () => {
    const goldPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "goldCertification.ts");
    const source = readFileSync(goldPath, "utf8");
    expect(source).toContain('eq(scenarioRuns.isDemo, false)');
  });

  it("GT-TV-02: teacherValidated not referenced in Gold predicate", () => {
    const goldPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "goldCertification.ts");
    const source = readFileSync(goldPath, "utf8");
    expect(source).not.toContain("teacherValidated");
  });

  it("getGoldCertificationStatus consumes validateM3/4/5Compliance", () => {
    const goldPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "goldCertification.ts");
    const source = readFileSync(goldPath, "utf8");
    expect(source).toContain("validateM3Compliance");
    expect(source).toContain("validateM4Compliance");
    expect(source).toContain("validateM5Compliance");
    expect(source).toContain("assertM5VarianceGate");
  });

  it("checkGoldNoUnresolvedBlockers returns false when any SCN lacks a run", () => {
    const goldPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "goldCertification.ts");
    const source = readFileSync(goldPath, "utf8");
    const fnMatch = source.match(/export async function checkGoldNoUnresolvedBlockers[\s\S]*?\n\}/);
    expect(fnMatch).toBeTruthy();
    expect(fnMatch![0]).toMatch(/if \(!latestRun\) return false;/);
  });

  it("Gold eligibility requires silverCertified prerequisite", () => {
    const goldPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "goldCertification.ts");
    const source = readFileSync(goldPath, "utf8");
    expect(source).toContain("silverPrerequisite");
    expect(source).toMatch(/goldEligible[\s\S]*silverPrerequisite/);
  });

  it("profiles.goldStatus lazy unlock gated by ENABLE_GOLD_UNLOCK", () => {
    const routersPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "routers.ts");
    const source = readFileSync(routersPath, "utf8");
    expect(source).toContain("goldStatus:");
    expect(source).toMatch(/isGoldUnlockEnabled\(\)/);
    expect(source).toContain("unlockGoldCertification");
  });
});
