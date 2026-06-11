/**
 * M2 Gold Standard — SCN-006 / SCN-007 / SCN-008 vs Fiches de Mission Étudiant
 */
import { describe, expect, it } from "vitest";
import {
  buildM2FifoLotCatalog,
  canExecuteStepM2,
  checkCompliance,
  validateM2FifoPick,
  validatePutaway,
  validatePutawayM1Zone,
} from "./rulesEngine";

const SCN_008_SEED = {
  preloadedTransactions: [
    { docType: "PO", sku: "SKU-003", bin: "REC-01", qty: 300, posted: true, docRef: "PO-M2-003" },
    { docType: "GR", sku: "SKU-003", bin: "B-01-R1-L1", qty: 100, posted: true, docRef: "GR-M2-003A" },
    { docType: "GR", sku: "SKU-003", bin: "B-01-R1-L2", qty: 100, posted: true, docRef: "GR-M2-003B" },
    { docType: "GR", sku: "SKU-003", bin: "B-02-R1-L1", qty: 100, posted: true, docRef: "GR-M2-003C" },
  ],
  lots: [
    { lotNumber: "LOT-A-2025", receivedAt: "2025-01-10T08:00:00Z", qty: 100 },
    { lotNumber: "LOT-B-2025", receivedAt: "2025-02-10T08:00:00Z", qty: 100 },
    { lotNumber: "LOT-C-2025", receivedAt: "2025-03-10T08:00:00Z", qty: 100 },
  ],
};

describe("M2 Gold Standard — SCN-006 structured putaway", () => {
  it("accepts PUTAWAY from REC-01 to STOCKAGE bin B-01-R1-L1", () => {
    const zone = validatePutawayM1Zone("REC-01", "B-01-R1-L1");
    expect(zone.allowed).toBe(true);
  });

  it("rejects PUTAWAY to EXPEDITION bin EXP-01", () => {
    const zone = validatePutawayM1Zone("REC-01", "EXP-01");
    expect(zone.allowed).toBe(false);
    expect(zone.reasonFr).toMatch(/EXPÉDITION|STOCKAGE/i);
  });

  it("rejects incompatible zone (PICKING from reception without STOCKAGE path is blocked via toBin)", () => {
    const zone = validatePutawayM1Zone("REC-01", "REC-02");
    expect(zone.allowed).toBe(false);
  });

  it("compliance passes after valid putaway state (no negative stock, all posted)", () => {
    const state = {
      completedSteps: ["GR", "PUTAWAY", "FIFO_PICK", "STOCK_ACCURACY"],
      transactions: [
        { docType: "GR", sku: "SKU-001", bin: "REC-01", qty: 150, posted: true },
        { docType: "PUTAWAY", sku: "SKU-001", bin: "REC-01", qty: -150, posted: true },
        { docType: "PUTAWAY", sku: "SKU-001", bin: "B-01-R1-L1", qty: 150, posted: true },
      ],
      inventory: { "SKU-001::B-01-R1-L1": 150 },
      cycleCounts: [],
    };
    expect(canExecuteStepM2("COMPLIANCE_ADV", state as any).allowed).toBe(true);
    expect(checkCompliance(state as any).compliant).toBe(true);
  });
});

describe("M2 Gold Standard — SCN-007 capacity", () => {
  it("rejects 600 u. into B-01-R1-L1 (max 500) — student must not force overflow", () => {
    const result = validatePutaway({
      sku: "SKU-002",
      fromBin: "REC-01",
      toBin: "B-01-R1-L1",
      qty: 600,
      binCapacities: { "B-01-R1-L1": 500 },
      binCurrentLoad: { "B-01-R1-L1": 0 },
      existingLots: [],
      lotNumber: "LOT-2025-002",
      receivedAt: new Date("2025-02-01"),
    });
    expect(result.allowed).toBe(false);
    expect(result.penaltyEvent).toBe("CAPACITY_OVERFLOW");
  });

  it("allows split putaway: 500 u. in B-01-R1-L1 at capacity limit", () => {
    const result = validatePutaway({
      sku: "SKU-002",
      fromBin: "REC-01",
      toBin: "B-01-R1-L1",
      qty: 500,
      binCapacities: { "B-01-R1-L1": 500, "B-01-R1-L2": 500 },
      binCurrentLoad: { "B-01-R1-L1": 0 },
      existingLots: [],
      lotNumber: "LOT-2025-002",
      receivedAt: new Date("2025-02-01"),
    });
    expect(result.allowed).toBe(true);
  });

  it("allows remainder 100 u. in second STOCKAGE bin B-01-R1-L2", () => {
    const result = validatePutaway({
      sku: "SKU-002",
      fromBin: "REC-01",
      toBin: "B-01-R1-L2",
      qty: 100,
      binCapacities: { "B-01-R1-L1": 500, "B-01-R1-L2": 500 },
      binCurrentLoad: { "B-01-R1-L1": 500 },
      existingLots: [],
      lotNumber: "LOT-2025-002",
      receivedAt: new Date("2025-02-01"),
    });
    expect(result.allowed).toBe(true);
  });
});

describe("M2 Gold Standard — SCN-008 FIFO multi-lot", () => {
  it("builds FIFO catalog from scenario seed when no putaway records (preloaded GR)", () => {
    const catalog = buildM2FifoLotCatalog([], SCN_008_SEED);
    expect(catalog).toHaveLength(3);
    expect(catalog[0].lotNumber).toBe("LOT-A-2025");
    expect(catalog[0].toBin).toBe("B-01-R1-L1");
    expect(catalog[1].lotNumber).toBe("LOT-B-2025");
    expect(catalog[2].lotNumber).toBe("LOT-C-2025");
  });

  it("FIFO wrong lot (LOT-B) fails while LOT-A has stock", () => {
    const catalog = buildM2FifoLotCatalog([], SCN_008_SEED);
    const inventory = {
      "SKU-003::B-01-R1-L1": 100,
      "SKU-003::B-01-R1-L2": 100,
      "SKU-003::B-02-R1-L1": 100,
    };
    const check = validateM2FifoPick({
      sku: "SKU-003",
      lotNumber: "LOT-B-2025",
      catalog,
      inventory,
    });
    expect(check.allowed).toBe(false);
    expect(check.requiredLot).toBe("LOT-A-2025");
  });

  it("FIFO oldest lot (LOT-A) succeeds", () => {
    const catalog = buildM2FifoLotCatalog([], SCN_008_SEED);
    const inventory = {
      "SKU-003::B-01-R1-L1": 100,
      "SKU-003::B-01-R1-L2": 100,
      "SKU-003::B-02-R1-L1": 100,
    };
    const check = validateM2FifoPick({
      sku: "SKU-003",
      lotNumber: "LOT-A-2025",
      catalog,
      inventory,
    });
    expect(check.allowed).toBe(true);
  });

  it("after LOT-A depleted, LOT-B becomes required (no unauthorized lot mixing)", () => {
    const catalog = buildM2FifoLotCatalog([], SCN_008_SEED);
    const inventoryAfterA = {
      "SKU-003::B-01-R1-L1": 0,
      "SKU-003::B-01-R1-L2": 100,
      "SKU-003::B-02-R1-L1": 100,
    };
    const wrong = validateM2FifoPick({
      sku: "SKU-003",
      lotNumber: "LOT-C-2025",
      catalog,
      inventory: inventoryAfterA,
    });
    expect(wrong.allowed).toBe(false);
    expect(wrong.requiredLot).toBe("LOT-B-2025");

    const ok = validateM2FifoPick({
      sku: "SKU-003",
      lotNumber: "LOT-B-2025",
      catalog,
      inventory: inventoryAfterA,
    });
    expect(ok.allowed).toBe(true);
  });
});
