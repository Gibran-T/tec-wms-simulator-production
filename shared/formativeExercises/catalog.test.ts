import { describe, expect, it } from "vitest";
import { OFFICIAL_SCN_BY_MODULE } from "../../server/canonicalScenarios";
import {
  FORMATIVE_EXERCISE_CATALOG,
  FORMATIVE_EXERCISE_IDS,
  FORMATIVE_ISOLATION_FLAGS,
  getFormativeExercisesForModule,
} from "./index";

describe("formative catalog isolation", () => {
  it("exposes exactly four stable exercise IDs", () => {
    expect(FORMATIVE_EXERCISE_IDS).toEqual([
      "M4-PREP-KPI-RESPONSE",
      "M4-CONS-SAME-KPI-DIFF-DECISION",
      "M5-PREP-EVIDENCE-TO-DECISION",
      "M5-CONS-FULL-REASONING",
    ]);
    expect(Object.keys(FORMATIVE_EXERCISE_CATALOG)).toHaveLength(4);
  });

  it("keeps M4/M5 official mission counts at 3", () => {
    expect(OFFICIAL_SCN_BY_MODULE[4]).toEqual(["SCN-012", "SCN-013", "SCN-014"]);
    expect(OFFICIAL_SCN_BY_MODULE[5]).toEqual(["SCN-015", "SCN-016", "SCN-017"]);
    expect(OFFICIAL_SCN_BY_MODULE[4]).toHaveLength(3);
    expect(OFFICIAL_SCN_BY_MODULE[5]).toHaveLength(3);
  });

  it("returns one prep and one consolidation per module", () => {
    for (const moduleId of [4, 5] as const) {
      const list = getFormativeExercisesForModule(moduleId);
      expect(list).toHaveLength(2);
      expect(list.filter((e) => e.kind === "preparation")).toHaveLength(1);
      expect(list.filter((e) => e.kind === "consolidation")).toHaveLength(1);
    }
  });

  it("hard-codes isolation flags to false", () => {
    expect(FORMATIVE_ISOLATION_FLAGS).toEqual({
      countsTowardMissionCount: false,
      countsTowardScenarioAverage: false,
      countsTowardCertificate: false,
      countsTowardAssessment: false,
      countsTowardCheckpoint: false,
    });
  });
});
