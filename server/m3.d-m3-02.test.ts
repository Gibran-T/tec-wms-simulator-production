import { describe, expect, it } from "vitest";
import {
  formatReplenishReasonWithStudentQty,
  getCycleCountTargets,
  getReplenishmentParamsFromSeed,
  parseStudentQtyFromReplenishReason,
  validateCycleCountEntriesComplete,
  validateCycleCountListComplete,
  validateCycleCountReconComplete,
  validateM3Compliance,
  validateReplenishmentComplete,
  type M3InitialStateJson,
} from "./rulesEngine";

const SCN_009_STATE: M3InitialStateJson = {
  cycleCountTargets: [
    { sku: "SKU-001", bin: "B-01-R1-L1", systemQty: 100, physicalQty: 97 },
    { sku: "SKU-003", bin: "B-01-R1-L2", systemQty: 80, physicalQty: 80 },
  ],
};

const SCN_010_STATE: M3InitialStateJson = {
  adjustmentThreshold: 20,
  cycleCountTargets: [{ sku: "SKU-006", bin: "B-02-R1-L1", systemQty: 380, physicalQty: 352 }],
};

const SCN_011_STATE: M3InitialStateJson = {
  replenishmentParams: [
    { sku: "SKU-004", minQty: 50, maxQty: 200, safetyStock: 25, leadTimeDays: 3 },
    { sku: "SKU-005", minQty: 80, maxQty: 300, safetyStock: 30, leadTimeDays: 5 },
  ],
};

describe("D-M3-02 — SCN-009 multi-SKU cycle count", () => {
  const targets = getCycleCountTargets(SCN_009_STATE);

  it("rejects CC_LIST when only one required SKU is listed", () => {
    const result = validateCycleCountListComplete(targets, ["SKU-001"]);
    expect(result.allowed).toBe(false);
    expect(result.complete).toBe(false);
    expect(result.reasonFr).toMatch(/SKU-003/);
  });

  it("accepts CC_LIST when all required SKUs are listed", () => {
    const result = validateCycleCountListComplete(targets, ["SKU-001", "SKU-003"]);
    expect(result.allowed).toBe(true);
    expect(result.complete).toBe(true);
  });

  it("cannot complete count with only one required SKU counted", () => {
    const result = validateCycleCountEntriesComplete(targets, [
      { sku: "SKU-001", systemQty: 100, countedQty: 97 },
    ]);
    expect(result.complete).toBe(false);
    expect(result.reasonFr).toMatch(/SKU-003/);
  });

  it("completes count when all required SKUs match physical quantities", () => {
    const result = validateCycleCountEntriesComplete(targets, [
      { sku: "SKU-001", systemQty: 100, countedQty: 97, varianceQty: -3 },
      { sku: "SKU-003", systemQty: 80, countedQty: 80, varianceQty: 0 },
    ]);
    expect(result.complete).toBe(true);
  });

  it("completes reconciliation when SKU-001 variance is adjusted", () => {
    const counts = [
      { sku: "SKU-001", systemQty: 100, countedQty: 97 },
      { sku: "SKU-003", systemQty: 80, countedQty: 80 },
    ];
    const adjustments = [{ sku: "SKU-001", varianceQty: -3, adjustmentQty: -3, reason: null }];
    const transactions = [
      { docType: "ADJ", sku: "SKU-001", bin: "B-01-R1-L1", qty: -3, posted: true },
    ];
    const result = validateCycleCountReconComplete(targets, counts, adjustments, transactions);
    expect(result.complete).toBe(true);
  });
});

describe("D-M3-02 — SCN-011 multi-SKU replenishment", () => {
  const params = getReplenishmentParamsFromSeed(SCN_011_STATE);

  it("cannot complete replenishment after only one SKU", () => {
    const result = validateReplenishmentComplete(params, [
      {
        sku: "SKU-004",
        systemQty: 30,
        suggestedQty: 170,
        reason: formatReplenishReasonWithStudentQty("Below Min", 170),
      },
    ]);
    expect(result.complete).toBe(false);
    expect(result.reasonFr).toMatch(/SKU-005/);
  });

  it("completes when all required replenishment targets are satisfied", () => {
    const result = validateReplenishmentComplete(params, [
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
    ]);
    expect(result.complete).toBe(true);
  });

  it("parses studentQty embedded in replenishment reason", () => {
    const reason = formatReplenishReasonWithStudentQty("Below Min + Safety Stock", 170);
    expect(parseStudentQtyFromReplenishReason(reason)).toBe(170);
  });
});

describe("D-M3-02 — COMPLIANCE_M3 validateM3Compliance", () => {
  it("rejects SCN-009 when only one SKU was counted", () => {
    const result = validateM3Compliance({
      initialStateJson: SCN_009_STATE,
      inventoryCounts: [{ sku: "SKU-001", systemQty: 100, countedQty: 97 }],
      inventoryAdjustments: [{ sku: "SKU-001", varianceQty: -3, adjustmentQty: -3, reason: "" }],
      replenishmentSuggestions: [],
      transactions: [{ docType: "ADJ", sku: "SKU-001", bin: "B-01-R1-L1", qty: -3, posted: true }],
    });
    expect(result.allowed).toBe(false);
    expect(result.reasonFr).toMatch(/SKU-003/);
  });

  it("accepts SCN-009 when all SKUs counted and reconciled", () => {
    const result = validateM3Compliance({
      initialStateJson: SCN_009_STATE,
      inventoryCounts: [
        { sku: "SKU-001", systemQty: 100, countedQty: 97 },
        { sku: "SKU-003", systemQty: 80, countedQty: 80 },
      ],
      inventoryAdjustments: [{ sku: "SKU-001", varianceQty: -3, adjustmentQty: -3, reason: "" }],
      replenishmentSuggestions: [],
      transactions: [{ docType: "ADJ", sku: "SKU-001", bin: "B-01-R1-L1", qty: -3, posted: true }],
    });
    expect(result.allowed).toBe(true);
  });

  it("rejects SCN-010 when variance justification is missing", () => {
    const result = validateM3Compliance({
      initialStateJson: SCN_010_STATE,
      inventoryCounts: [{ sku: "SKU-006", systemQty: 380, countedQty: 352 }],
      inventoryAdjustments: [{ sku: "SKU-006", varianceQty: -28, adjustmentQty: -28, reason: "" }],
      replenishmentSuggestions: [],
      transactions: [{ docType: "ADJ", sku: "SKU-006", bin: "B-02-R1-L1", qty: -28, posted: true }],
    });
    expect(result.allowed).toBe(false);
    expect(result.reasonFr).toMatch(/justification/i);
  });

  it("accepts SCN-010 with justified −28 adjustment", () => {
    const result = validateM3Compliance({
      initialStateJson: SCN_010_STATE,
      inventoryCounts: [{ sku: "SKU-006", systemQty: 380, countedQty: 352 }],
      inventoryAdjustments: [{
        sku: "SKU-006",
        varianceQty: -28,
        adjustmentQty: -28,
        reason: "Expédition partielle non enregistrée",
      }],
      replenishmentSuggestions: [],
      transactions: [{ docType: "ADJ", sku: "SKU-006", bin: "B-02-R1-L1", qty: -28, posted: true }],
    });
    expect(result.allowed).toBe(true);
  });

  it("rejects SCN-011 when only one replenishment target is satisfied", () => {
    const result = validateM3Compliance({
      initialStateJson: SCN_011_STATE,
      inventoryCounts: [],
      inventoryAdjustments: [],
      replenishmentSuggestions: [{
        sku: "SKU-004",
        systemQty: 30,
        suggestedQty: 170,
        reason: formatReplenishReasonWithStudentQty("Below Min", 170),
      }],
      transactions: [],
    });
    expect(result.allowed).toBe(false);
    expect(result.reasonFr).toMatch(/SKU-005/);
  });

  it("accepts SCN-011 when both replenishment targets are satisfied", () => {
    const result = validateM3Compliance({
      initialStateJson: SCN_011_STATE,
      inventoryCounts: [],
      inventoryAdjustments: [],
      replenishmentSuggestions: [
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
      ],
      transactions: [],
    });
    expect(result.allowed).toBe(true);
  });
});
