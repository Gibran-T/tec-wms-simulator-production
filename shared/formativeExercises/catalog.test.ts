import { describe, expect, it } from "vitest";
import { OFFICIAL_SCN_BY_MODULE } from "../../server/canonicalScenarios";
import {
  FORMATIVE_EXERCISE_CATALOG,
  FORMATIVE_EXERCISE_IDS,
  FORMATIVE_ISOLATION_FLAGS,
  getFormativeExercisesForModule,
} from "./index";

describe("formative catalog isolation", () => {
  it("exposes ten stable exercise IDs including M1–M3 pre/post", () => {
    expect(FORMATIVE_EXERCISE_IDS).toEqual([
      "M1-PREP-RECEIVING-SEQUENCE",
      "M1-CONS-OPERATIONAL-DECISION",
      "M2-PREP-PUTAWAY-FIFO",
      "M2-CONS-EXECUTION-DECISION",
      "M3-PREP-INVENTORY-CONTROL",
      "M3-CONS-VARIANCE-REPLENISH",
      "M4-PREP-KPI-RESPONSE",
      "M4-CONS-SAME-KPI-DIFF-DECISION",
      "M5-PREP-EVIDENCE-TO-DECISION",
      "M5-CONS-FULL-REASONING",
    ]);
    expect(Object.keys(FORMATIVE_EXERCISE_CATALOG)).toHaveLength(10);
  });

  it("keeps M4/M5 official mission counts at 3", () => {
    expect(OFFICIAL_SCN_BY_MODULE[4]).toEqual(["SCN-012", "SCN-013", "SCN-014"]);
    expect(OFFICIAL_SCN_BY_MODULE[5]).toEqual(["SCN-015", "SCN-016", "SCN-017"]);
    expect(OFFICIAL_SCN_BY_MODULE[4]).toHaveLength(3);
    expect(OFFICIAL_SCN_BY_MODULE[5]).toHaveLength(3);
  });

  it("returns one prep and one consolidation per module", () => {
    for (const moduleId of [1, 2, 3, 4, 5] as const) {
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
