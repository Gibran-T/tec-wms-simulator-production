import { describe, expect, it } from "vitest";
import {
  buildM3ResolutionChain,
  buildReplenishmentParamRows,
  computeInventoryAccuracy,
  computeM3OperationalBadges,
  computeReplenishmentDisplayStatus,
  getM3GridStatus,
  isAdjPostedForSku,
} from "./m3OperationalEvidence";

const SCN_009_STATE = {
  cycleCountTargets: [
    { sku: "SKU-001", bin: "B-01-R1-L1", systemQty: 100, physicalQty: 97 },
    { sku: "SKU-003", bin: "B-01-R1-L2", systemQty: 80, physicalQty: 80 },
  ],
};

const SCN_011_STATE = {
  replenishmentParams: [
    { sku: "SKU-004", minQty: 50, maxQty: 200, safetyStock: 25, leadTimeDays: 3 },
    { sku: "SKU-005", minQty: 80, maxQty: 300, safetyStock: 30, leadTimeDays: 5 },
  ],
};

const SCN_011_INVENTORY = {
  "SKU-004::B-01-R1-L1": 30,
  "SKU-005::B-01-R1-L2": 40,
};

describe("m3OperationalEvidence", () => {
  it("computes SCN-009 variance badge before and after ADJ", () => {
    const before = computeM3OperationalBadges({
      scnCode: "SCN-009",
      initialStateJson: SCN_009_STATE,
      inventory: { "SKU-001::B-01-R1-L1": 100 },
      inventoryCounts: [],
      inventoryAdjustments: [],
      replenishmentSuggestions: [],
      completedSteps: [],
      transactions: [],
    });
    const varianceBefore = before.find((b) => b.id === "variance");
    expect(varianceBefore?.tone).toBe("amber");
    expect(varianceBefore?.valueFr).toContain("−3");

    const after = computeM3OperationalBadges({
      scnCode: "SCN-009",
      initialStateJson: SCN_009_STATE,
      inventory: { "SKU-001::B-01-R1-L1": 97 },
      inventoryCounts: [{ sku: "SKU-001", systemQty: 100, countedQty: 97, varianceQty: -3 }],
      inventoryAdjustments: [{ sku: "SKU-001", varianceQty: -3, adjustmentQty: -3 }],
      replenishmentSuggestions: [],
      completedSteps: ["CC_RECON"],
      transactions: [{ docType: "ADJ", sku: "SKU-001", qty: -3, posted: true }],
    });
    const varianceAfter = after.find((b) => b.id === "variance");
    expect(varianceAfter?.tone).toBe("green");
    const replenish = after.find((b) => b.id === "replenish");
    expect(replenish?.valueFr).toContain("auto-validé");
  });

  it("computes inventory accuracy from count submissions only", () => {
    const acc = computeInventoryAccuracy(
      SCN_009_STATE.cycleCountTargets,
      [{ sku: "SKU-001", systemQty: 100, countedQty: 97 }],
    );
    expect(acc.pct).toBe(50);
    expect(acc.counted).toBe(1);
    expect(acc.total).toBe(2);
  });

  it("builds SCN-011 below-min replenishment rows", () => {
    const rows = buildReplenishmentParamRows(SCN_011_STATE.replenishmentParams, SCN_011_INVENTORY);
    expect(rows).toHaveLength(2);
    expect(rows[0].deltaMin).toBe(-20);
    expect(rows[0].targetQ).toBe(170);
    expect(rows.every((r) => r.belowMin)).toBe(true);
  });

  it("computes replenishment display status", () => {
    expect(computeReplenishmentDisplayStatus([], []).status).toBe("NOT_APPLICABLE");
    expect(computeReplenishmentDisplayStatus(SCN_011_STATE.replenishmentParams, []).status).toBe("PENDING");
    const partial = computeReplenishmentDisplayStatus(SCN_011_STATE.replenishmentParams, [
      { sku: "SKU-004", systemQty: 30, suggestedQty: 170, reason: "Below Min;studentQty=170" },
    ]);
    expect(partial.status).toBe("PARTIAL");
    expect(partial.submitted).toBe(1);
  });

  it("detects ADJ posted via ledger or adjustments", () => {
    expect(isAdjPostedForSku("SKU-001", -3, [], [{ docType: "ADJ", sku: "SKU-001", qty: -3, posted: true }])).toBe(true);
    expect(isAdjPostedForSku("SKU-001", -3, [{ sku: "SKU-001", varianceQty: -3, adjustmentQty: -3 }], [])).toBe(true);
  });

  it("builds resolution chain with REPLENISH auto chip for SCN-009", () => {
    const chain = buildM3ResolutionChain({
      completedSteps: ["CC_LIST", "CC_COUNT"],
      nextStepCode: "CC_RECON",
      inventoryCounts: [{ sku: "SKU-001", systemQty: 100, countedQty: 97 }],
      inventoryAdjustments: [],
      initialStateJson: SCN_009_STATE,
      transactions: [],
    });
    expect(chain.some((c) => c.id === "REPLENISH")).toBe(true);
    expect(chain.some((c) => c.id === "VARIANCE_OPEN")).toBe(true);
  });

  it("returns BELOW_MIN grid status for SCN-011", () => {
    expect(getM3GridStatus("SCN-011", "SKU-004", 30, [], [], [], SCN_011_STATE.replenishmentParams)).toBe("BELOW_MIN");
  });
});
