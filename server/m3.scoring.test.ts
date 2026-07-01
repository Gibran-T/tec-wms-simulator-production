/**
 * M3 scoring audit — SCN-009, SCN-010, SCN-011 perfect-run ceilings (100/100).
 */
import { describe, expect, it } from "vitest";
import { calculateTotalScore } from "./scoringEngine";
import {
  M3_PIPELINE_PERFECT_TOTAL,
  M3_SCALED_PERFECT_TOTAL,
  M3_STEP_MAX,
  M3_STEP_MAX_SCALED,
  formatReplenishReasonWithStudentQty,
  getM3StepAwardPoints,
  getReplenishmentParamsFromSeed,
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
  const events = [
    { pointsDelta: getM3StepAwardPoints("CC_LIST", initialStateJson) },
    { pointsDelta: getM3StepAwardPoints("CC_COUNT", initialStateJson) },
    { pointsDelta: getM3StepAwardPoints("CC_RECON", initialStateJson) },
    { pointsDelta: getM3StepAwardPoints("COMPLIANCE_M3", initialStateJson) },
  ];

  const replenishParams = getReplenishmentParamsFromSeed(initialStateJson);
  if (replenishParams.length > 0) {
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
    events.splice(3, 0,
      { pointsDelta: M3_STEP_MAX.ROP_CHECK },
      { pointsDelta: M3_STEP_MAX.EOQ_CALC },
      { pointsDelta: scoreM3ReplenishQtyFromSuggestions(replenishParams, suggestions) },
    );
  } else {
    events.splice(3, 0, { pointsDelta: getM3StepAwardPoints("REPLENISH", initialStateJson) });
  }

  return events;
}

describe("M3 scoring model — budgets", () => {
  it("SCN-009/010 pipeline base sums to 80 before scaling", () => {
    expect(M3_PIPELINE_PERFECT_TOTAL).toBe(80);
  });

  it("SCN-009/010 scaled step awards sum to 100", () => {
    expect(M3_SCALED_PERFECT_TOTAL).toBe(100);
  });

  it("SCN-011 planning events add ROP+EOQ on top of 80-pt pipeline", () => {
    expect(M3_STEP_MAX.ROP_CHECK + M3_STEP_MAX.EOQ_CALC).toBe(20);
    expect(M3_PIPELINE_PERFECT_TOTAL + M3_STEP_MAX.ROP_CHECK + M3_STEP_MAX.EOQ_CALC).toBe(100);
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

  it("SCN-011: imperfect replenishment on one SKU still passes threshold 70", () => {
    const params = getReplenishmentParamsFromSeed(SCN_011);
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
        reason: formatReplenishReasonWithStudentQty("Below Min", 240),
      },
    ];
    const events = [
      { pointsDelta: getM3StepAwardPoints("CC_LIST", SCN_011) },
      { pointsDelta: getM3StepAwardPoints("CC_COUNT", SCN_011) },
      { pointsDelta: getM3StepAwardPoints("CC_RECON", SCN_011) },
      { pointsDelta: M3_STEP_MAX.ROP_CHECK },
      { pointsDelta: M3_STEP_MAX.EOQ_CALC },
      { pointsDelta: scoreM3ReplenishQtyFromSuggestions(params, suggestions) },
      { pointsDelta: getM3StepAwardPoints("COMPLIANCE_M3", SCN_011) },
    ];
    const total = calculateTotalScore(events);
    expect(total).toBeLessThan(100);
    expect(total).toBeGreaterThanOrEqual(getModuleScenarioPassThreshold(3));
  });

  it("CC_COUNT awards full points when variance is detected (pedagogically correct count)", () => {
    expect(getM3StepAwardPoints("CC_COUNT", SCN_009)).toBe(M3_STEP_MAX_SCALED.CC_COUNT);
    expect(getM3StepAwardPoints("CC_COUNT", SCN_010)).toBe(M3_STEP_MAX_SCALED.CC_COUNT);
    expect(getM3StepAwardPoints("CC_COUNT", SCN_011)).toBe(M3_STEP_MAX.CC_COUNT);
  });
});
