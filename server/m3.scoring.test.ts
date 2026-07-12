/**
 * M3 scoring audit — SCN-009, SCN-010, SCN-011 perfect-run ceilings (100/100).
 */
import { describe, expect, it } from "vitest";
import { calculateTotalScore } from "./scoringEngine";
import {
  M3_011_STEP_MAX,
  M3_PIPELINE_PERFECT_TOTAL,
  M3_SCALED_PERFECT_TOTAL,
  M3_STEP_MAX,
  M3_STEP_MAX_SCALED,
  buildM3011ReplenishScoringEvents,
  formatReplenishReasonWithStudentQty,
  getEffectiveM3Steps,
  getM3ReplenishStepDisplayMax,
  getM3StepAwardPoints,
  getReplenishmentParamsFromSeed,
  isM3ReplenishmentOnlyScenario,
  scoreM3ReplenishQtyFromSuggestions,
  type M3InitialStateJson,
} from "./rulesEngine";
import { getModuleScenarioPassThreshold } from "@shared/moduleThresholds";

const SCN_009: M3InitialStateJson = {
  cycleCountTargets: [
    { sku: "SKU-001", bin: "B-01-R1-L1", systemQty: 100, physicalQty: 97 },
    { sku: "SKU-003", bin: "B-01-R1-L2", systemQty: 80, physicalQty: 80 },
  ],
};

const SCN_010: M3InitialStateJson = {
  adjustmentThreshold: 20,
  cycleCountTargets: [
    { sku: "SKU-006", bin: "B-02-R1-L1", systemQty: 380, physicalQty: 352 },
  ],
};

const SCN_011: M3InitialStateJson = {
  replenishmentParams: [
    { sku: "SKU-004", minQty: 50, maxQty: 200, safetyStock: 25, leadTimeDays: 3 },
    { sku: "SKU-005", minQty: 80, maxQty: 300, safetyStock: 30, leadTimeDays: 5 },
  ],
};

function perfectM3EventsForState(initialStateJson: M3InitialStateJson) {
  if (isM3ReplenishmentOnlyScenario(initialStateJson)) {
    const params = getReplenishmentParamsFromSeed(initialStateJson);
    const suggestions = [
      {
        sku: "SKU-004",
        systemQty: 30,
        suggestedQty: 170,
        reason: formatReplenishReasonWithStudentQty("Below Min", 170),
      },
      {
        sku: "SKU-005",
        systemQty: 40,
        suggestedQty: 260,
        reason: formatReplenishReasonWithStudentQty("Below Min", 260),
      },
    ];
    return [
      ...buildM3011ReplenishScoringEvents(params, suggestions).map((e) => ({ pointsDelta: e.pointsDelta })),
      { pointsDelta: getM3StepAwardPoints("COMPLIANCE_M3", initialStateJson) },
    ];
  }

  const events = [
    { pointsDelta: getM3StepAwardPoints("CC_LIST", initialStateJson) },
    { pointsDelta: getM3StepAwardPoints("CC_COUNT", initialStateJson) },
    { pointsDelta: getM3StepAwardPoints("CC_RECON", initialStateJson) },
    { pointsDelta: getM3StepAwardPoints("REPLENISH", initialStateJson) },
    { pointsDelta: getM3StepAwardPoints("COMPLIANCE_M3", initialStateJson) },
  ];
  return events;
}

describe("M3 scoring model — budgets", () => {
  it("SCN-009/010 pipeline base sums to 80 before scaling", () => {
    expect(M3_PIPELINE_PERFECT_TOTAL).toBe(80);
  });

  it("SCN-009/010 scaled step awards sum to 100", () => {
    expect(M3_SCALED_PERFECT_TOTAL).toBe(100);
  });

  it("SCN-011 transparent model is REPLENISH 90 + COMPLIANCE 10", () => {
    expect(M3_011_STEP_MAX.REPLENISH + M3_011_STEP_MAX.COMPLIANCE_M3).toBe(100);
  });

  it("M3 pass threshold is 70/100", () => {
    expect(getModuleScenarioPassThreshold(3)).toBe(70);
  });
});

describe("M3 perfect execution — 100/100 achievable", () => {
  it("SCN-009: correct cycle count with −3 variance reaches 100/100", () => {
    const total = calculateTotalScore(perfectM3EventsForState(SCN_009));
    expect(total).toBe(100);
  });

  it("SCN-010: justified −28 variance reaches 100/100", () => {
    const total = calculateTotalScore(perfectM3EventsForState(SCN_010));
    expect(total).toBe(100);
  });

  it("SCN-011: dual-SKU Min/Max replenishment reaches 100/100", () => {
    const total = calculateTotalScore(perfectM3EventsForState(SCN_011));
    expect(total).toBe(100);
  });

  it("SCN-011: no CC / ROP / EOQ awards on new runs", () => {
    expect(getM3StepAwardPoints("CC_LIST", SCN_011)).toBe(0);
    expect(getM3StepAwardPoints("CC_COUNT", SCN_011)).toBe(0);
    expect(getM3StepAwardPoints("CC_RECON", SCN_011)).toBe(0);
    expect(getM3StepAwardPoints("ROP_CHECK", SCN_011)).toBe(0);
    expect(getM3StepAwardPoints("EOQ_CALC", SCN_011)).toBe(0);
    expect(getM3StepAwardPoints("COMPLIANCE_M3", SCN_011)).toBe(10);
    expect(getM3ReplenishStepDisplayMax(SCN_011)).toBe(90);
  });

  it("historical SCN-011 ROP/EOQ events remain readable for display max", () => {
    expect(
      getM3ReplenishStepDisplayMax(SCN_011, [
        { eventType: "ROP_CHECK_COMPLETED" },
        { eventType: "EOQ_CALC_COMPLETED" },
        { eventType: "REPLENISH_COMPLETED" },
      ]),
    ).toBe(40);
  });

  it("CC_COUNT awards full points for SCN-009/010", () => {
    expect(getM3StepAwardPoints("CC_COUNT", SCN_009)).toBe(M3_STEP_MAX_SCALED.CC_COUNT);
    expect(getM3StepAwardPoints("CC_COUNT", SCN_010)).toBe(M3_STEP_MAX_SCALED.CC_COUNT);
  });

  it("getEffectiveM3Steps isolates SCN-011", () => {
    expect(getEffectiveM3Steps(SCN_011).map((s) => s.code)).toEqual(["REPLENISH", "COMPLIANCE_M3"]);
    expect(getEffectiveM3Steps(SCN_009)).toHaveLength(5);
    expect(getEffectiveM3Steps(SCN_010)).toHaveLength(5);
  });
});
