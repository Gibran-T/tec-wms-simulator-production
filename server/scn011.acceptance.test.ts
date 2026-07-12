/**
 * SCN-011 acceptance — Min/Max replenishment-only pipeline hotfix.
 */
import { describe, expect, it } from "vitest";
import { calculateTotalScore } from "./scoringEngine";
import {
  buildM3011ReplenishScoringEvents,
  canExecuteStepM3,
  formatReplenishReasonWithStudentQty,
  getEffectiveM3Steps,
  getM3StepAwardPoints,
  getNextRequiredStepAllModules,
  getReplenishmentParamsFromSeed,
  isM3ReplenishmentOnlyScenario,
  validateReplenishmentComplete,
  validateReplenishmentSubmission,
  validateM3Compliance,
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
  cycleCountTargets: [{ sku: "SKU-006", bin: "B-02-R1-L1", systemQty: 380, physicalQty: 352 }],
};

const SCN_011: M3InitialStateJson = {
  replenishmentParams: [
    { sku: "SKU-004", minQty: 50, maxQty: 200, safetyStock: 25, leadTimeDays: 3 },
    { sku: "SKU-005", minQty: 80, maxQty: 300, safetyStock: 30, leadTimeDays: 5 },
  ],
};

const INVENTORY = {
  "SKU-004::B-01-R1-L1": 30,
  "SKU-005::B-01-R1-L2": 40,
};

const params = getReplenishmentParamsFromSeed(SCN_011);

describe("SCN-011 acceptance — effective pipeline", () => {
  it("1. new run starts directly at REPLENISH", () => {
    const next = getNextRequiredStepAllModules([], 3, { scenarioInitialStateJson: SCN_011 as Record<string, unknown> });
    expect(next?.code).toBe("REPLENISH");
  });

  it("2–4. CC_LIST / CC_COUNT / CC_RECON are not required", () => {
    const steps = getEffectiveM3Steps(SCN_011).map((s) => s.code);
    expect(steps).toEqual(["REPLENISH", "COMPLIANCE_M3"]);
    expect(steps).not.toContain("CC_LIST");
    expect(steps).not.toContain("CC_COUNT");
    expect(steps).not.toContain("CC_RECON");
  });

  it("5. REPLENISH has no prerequisite", () => {
    expect(canExecuteStepM3("REPLENISH" as any, [] as any, SCN_011).allowed).toBe(true);
    expect(getEffectiveM3Steps(SCN_011)[0].prerequisite).toBeNull();
  });

  it("CC steps are rejected on SCN-011", () => {
    expect(canExecuteStepM3("CC_LIST" as any, [] as any, SCN_011).allowed).toBe(false);
    expect(canExecuteStepM3("CC_COUNT" as any, [] as any, SCN_011).allowed).toBe(false);
    expect(canExecuteStepM3("CC_RECON" as any, [] as any, SCN_011).allowed).toBe(false);
  });
});

describe("SCN-011 acceptance — multi-SKU replenishment", () => {
  it("6. SKU-004 30/50/200/25/170 is accepted", () => {
    const r = validateReplenishmentSubmission(
      params,
      { sku: "SKU-004", systemQty: 30, minQty: 50, maxQty: 200, safetyStock: 25, studentQty: 170 },
      INVENTORY,
    );
    expect(r.allowed).toBe(true);
  });

  it("7. SKU-005 40/80/300/30/260 is accepted", () => {
    const r = validateReplenishmentSubmission(
      params,
      { sku: "SKU-005", systemQty: 40, minQty: 80, maxQty: 300, safetyStock: 30, studentQty: 260 },
      INVENTORY,
    );
    expect(r.allowed).toBe(true);
  });

  it("8. completing only one SKU keeps REPLENISH in progress", () => {
    const partial = validateReplenishmentComplete(
      params,
      [{ sku: "SKU-004", systemQty: 30, suggestedQty: 170, reason: formatReplenishReasonWithStudentQty("Below Min", 170) }],
      INVENTORY,
    );
    expect(partial.complete).toBe(false);
    expect(partial.remainingSkus).toContain("SKU-005");
  });

  it("9. Q=20 for SKU-004 is rejected", () => {
    expect(
      validateReplenishmentSubmission(
        params,
        { sku: "SKU-004", systemQty: 30, minQty: 50, maxQty: 200, safetyStock: 25, studentQty: 20 },
        INVENTORY,
      ).allowed,
    ).toBe(false);
  });

  it("10. Q=40 for SKU-005 is rejected", () => {
    expect(
      validateReplenishmentSubmission(
        params,
        { sku: "SKU-005", systemQty: 40, minQty: 80, maxQty: 300, safetyStock: 30, studentQty: 40 },
        INVENTORY,
      ).allowed,
    ).toBe(false);
  });

  it("11. Q=200 for SKU-004 is rejected", () => {
    expect(
      validateReplenishmentSubmission(
        params,
        { sku: "SKU-004", systemQty: 30, minQty: 50, maxQty: 200, safetyStock: 25, studentQty: 200 },
        INVENTORY,
      ).allowed,
    ).toBe(false);
  });

  it("12. Q=300 for SKU-005 is rejected", () => {
    expect(
      validateReplenishmentSubmission(
        params,
        { sku: "SKU-005", systemQty: 40, minQty: 80, maxQty: 300, safetyStock: 30, studentQty: 300 },
        INVENTORY,
      ).allowed,
    ).toBe(false);
  });

  it("13. incorrect current stock is rejected", () => {
    expect(
      validateReplenishmentSubmission(
        params,
        { sku: "SKU-004", systemQty: 50, minQty: 50, maxQty: 200, safetyStock: 25, studentQty: 150 },
        INVENTORY,
      ).allowed,
    ).toBe(false);
  });

  it("14. incorrect Min or Max is rejected", () => {
    expect(
      validateReplenishmentSubmission(
        params,
        { sku: "SKU-004", systemQty: 30, minQty: 40, maxQty: 200, safetyStock: 25, studentQty: 170 },
        INVENTORY,
      ).allowed,
    ).toBe(false);
    expect(
      validateReplenishmentSubmission(
        params,
        { sku: "SKU-004", systemQty: 30, minQty: 50, maxQty: 180, safetyStock: 25, studentQty: 150 },
        INVENTORY,
      ).allowed,
    ).toBe(false);
  });

  it("15. incorrect SS is rejected", () => {
    expect(
      validateReplenishmentSubmission(
        params,
        { sku: "SKU-004", systemQty: 30, minQty: 50, maxQty: 200, safetyStock: 99, studentQty: 170 },
        INVENTORY,
      ).allowed,
    ).toBe(false);
  });

  it("16. duplicate SKU-004 does not complete SKU-005", () => {
    const suggestions = [
      { sku: "SKU-004", systemQty: 30, suggestedQty: 170, reason: formatReplenishReasonWithStudentQty("Below Min", 170) },
      { sku: "SKU-004", systemQty: 30, suggestedQty: 170, reason: formatReplenishReasonWithStudentQty("Below Min", 170) },
    ];
    // validate uses find() — one SKU-004 row still leaves SKU-005 missing
    const result = validateReplenishmentComplete(params, [suggestions[0]], INVENTORY);
    expect(result.complete).toBe(false);
    expect(result.remainingSkus).toEqual(["SKU-005"]);
  });

  it("17. either SKU may be submitted first", () => {
    const only005 = validateReplenishmentComplete(
      params,
      [{ sku: "SKU-005", systemQty: 40, suggestedQty: 260, reason: formatReplenishReasonWithStudentQty("Below Min", 260) }],
      INVENTORY,
    );
    expect(only005.complete).toBe(false);
    expect(only005.completedSkus).toContain("SKU-005");
    expect(only005.remainingSkus).toContain("SKU-004");
  });

  it("18. both valid recommendations complete REPLENISH", () => {
    const result = validateReplenishmentComplete(
      params,
      [
        { sku: "SKU-004", systemQty: 30, suggestedQty: 170, reason: formatReplenishReasonWithStudentQty("Below Min", 170) },
        { sku: "SKU-005", systemQty: 40, suggestedQty: 260, reason: formatReplenishReasonWithStudentQty("Below Min", 260) },
      ],
      INVENTORY,
    );
    expect(result.complete).toBe(true);
  });

  it("19. COMPLIANCE_M3 completes after REPLENISH", () => {
    expect(canExecuteStepM3("COMPLIANCE_M3" as any, ["REPLENISH"] as any, SCN_011).allowed).toBe(true);
    const compliance = validateM3Compliance({
      initialStateJson: SCN_011,
      inventoryCounts: [],
      inventoryAdjustments: [],
      replenishmentSuggestions: [
        { sku: "SKU-004", systemQty: 30, suggestedQty: 170, reason: formatReplenishReasonWithStudentQty("Below Min", 170) },
        { sku: "SKU-005", systemQty: 40, suggestedQty: 260, reason: formatReplenishReasonWithStudentQty("Below Min", 260) },
      ],
      transactions: [],
    });
    expect(compliance.allowed).toBe(true);
  });

  it("20. perfect new run reaches exactly 100/100", () => {
    const suggestions = [
      { sku: "SKU-004", systemQty: 30, suggestedQty: 170, reason: formatReplenishReasonWithStudentQty("Below Min", 170) },
      { sku: "SKU-005", systemQty: 40, suggestedQty: 260, reason: formatReplenishReasonWithStudentQty("Below Min", 260) },
    ];
    const events = [
      ...buildM3011ReplenishScoringEvents(params, suggestions).map((e) => ({ pointsDelta: e.pointsDelta })),
      { pointsDelta: getM3StepAwardPoints("COMPLIANCE_M3", SCN_011) },
    ];
    expect(calculateTotalScore(events)).toBe(100);
  });

  it("21. threshold is 70/100", () => {
    expect(getModuleScenarioPassThreshold(3)).toBe(70);
  });

  it("22. final report shows only 2 effective steps", () => {
    expect(getEffectiveM3Steps(SCN_011)).toHaveLength(2);
  });
});

describe("SCN-011 acceptance — isolation & identity", () => {
  it("26–27. SCN-009 and SCN-010 remain on full 5-step pipeline", () => {
    expect(getEffectiveM3Steps(SCN_009).map((s) => s.code)).toEqual([
      "CC_LIST", "CC_COUNT", "CC_RECON", "REPLENISH", "COMPLIANCE_M3",
    ]);
    expect(getEffectiveM3Steps(SCN_010).map((s) => s.code)).toEqual([
      "CC_LIST", "CC_COUNT", "CC_RECON", "REPLENISH", "COMPLIANCE_M3",
    ]);
    expect(canExecuteStepM3("REPLENISH" as any, [] as any, SCN_009).allowed).toBe(false);
    expect(canExecuteStepM3("CC_LIST" as any, [] as any, SCN_009).allowed).toBe(true);
  });

  it("identity uses replenishmentParams + empty cycleCountTargets", () => {
    expect(isM3ReplenishmentOnlyScenario(SCN_011)).toBe(true);
    expect(isM3ReplenishmentOnlyScenario(SCN_009)).toBe(false);
    expect(isM3ReplenishmentOnlyScenario(SCN_010)).toBe(false);
  });
});
