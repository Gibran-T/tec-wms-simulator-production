/**
 * SCN-007 regression — FIFO_PICK after capacity putaway
 * Source: STOCKAGE only · Dest: EXPÉDITION only · oldest lot first
 */
import { describe, expect, it } from "vitest";
import {
  buildM2FifoLotCatalog,
  validateM2FifoPick,
  validateM2FifoPickZone,
  validatePutaway,
} from "./rulesEngine";

const SCN_007_SEED = {
  preloadedTransactions: [
    { docType: "PO", sku: "SKU-002", bin: "REC-01", qty: 600, posted: true, docRef: "PO-M2-002" },
    { docType: "GR", sku: "SKU-002", bin: "REC-01", qty: 600, posted: true, docRef: "GR-M2-002" },
    { docType: "GR", sku: "SKU-002", bin: "B-02-R1-L1", qty: 100, posted: true, docRef: "GR-M2-002-FIFO" },
  ],
  lots: [
    { lotNumber: "LOT-2025-001", receivedAt: "2025-01-15T08:00:00Z", qty: 100 },
    { lotNumber: "LOT-2025-002", receivedAt: "2025-02-01T10:00:00Z", qty: 600 },
  ],
};

/** After capacity split putaway of LOT-2025-002 */
const AFTER_CAPACITY_PUTAWAY = [
  {
    sku: "SKU-002",
    toBin: "B-01-R1-L1",
    lotNumber: "LOT-2025-002",
    receivedAt: new Date("2025-02-01T10:00:00Z"),
    qty: 500,
  },
  {
    sku: "SKU-002",
    toBin: "B-01-R1-L2",
    lotNumber: "LOT-2025-002",
    receivedAt: new Date("2025-02-01T10:00:00Z"),
    qty: 100,
  },
];

const INVENTORY_AFTER_PUTAWAY = {
  "SKU-002::REC-01": 0,
  "SKU-002::B-01-R1-L1": 500,
  "SKU-002::B-01-R1-L2": 100,
  "SKU-002::B-02-R1-L1": 100,
};

describe("SCN-007 FIFO_PICK — zone filters", () => {
  it("rejects REC-01 as source (RÉCEPTION)", () => {
    const check = validateM2FifoPickZone("REC-01", "EXP-01");
    expect(check.allowed).toBe(false);
    expect(check.reasonFr).toBe("Le prélèvement FIFO doit partir d'un emplacement de STOCKAGE.");
  });

  it("allows STOCKAGE → EXPÉDITION", () => {
    expect(validateM2FifoPickZone("B-02-R1-L1", "EXP-01").allowed).toBe(true);
    expect(validateM2FifoPickZone("B-01-R1-L1", "EXP-02").allowed).toBe(true);
  });

  it("rejects STOCKAGE as destination", () => {
    const check = validateM2FifoPickZone("B-02-R1-L1", "B-01-R1-L2");
    expect(check.allowed).toBe(false);
    expect(check.reasonFr).toBe("La destination doit être un emplacement de la zone EXPÉDITION.");
  });
});

describe("SCN-007 FIFO_PICK — dual-lot catalog after capacity putaway", () => {
  it("merges seed older lot with putaway newer lot (two distinct lots)", () => {
    const catalog = buildM2FifoLotCatalog(AFTER_CAPACITY_PUTAWAY, SCN_007_SEED);
    const lotNumbers = [...new Set(catalog.map((e) => e.lotNumber))];
    expect(lotNumbers).toContain("LOT-2025-001");
    expect(lotNumbers).toContain("LOT-2025-002");
    expect(lotNumbers.length).toBeGreaterThanOrEqual(2);
    const oldest = catalog.sort((a, b) => a.receivedAt.getTime() - b.receivedAt.getTime())[0];
    expect(oldest?.lotNumber).toBe("LOT-2025-001");
    expect(oldest?.toBin).toBe("B-02-R1-L1");
  });

  it("blocks newer lot LOT-2025-002 while older has stock", () => {
    const catalog = buildM2FifoLotCatalog(AFTER_CAPACITY_PUTAWAY, SCN_007_SEED);
    const check = validateM2FifoPick({
      sku: "SKU-002",
      lotNumber: "LOT-2025-002",
      fromBin: "B-01-R1-L1",
      catalog,
      inventory: INVENTORY_AFTER_PUTAWAY,
    });
    expect(check.allowed).toBe(false);
    expect(check.requiredLot).toBe("LOT-2025-001");
    expect(check.reasonFr).toBe(
      "La règle FIFO exige de prélever en priorité le lot LOT-2025-001, entré en stock le plus ancien."
    );
  });

  it("allows oldest lot LOT-2025-001 from B-02-R1-L1", () => {
    const catalog = buildM2FifoLotCatalog(AFTER_CAPACITY_PUTAWAY, SCN_007_SEED);
    const check = validateM2FifoPick({
      sku: "SKU-002",
      lotNumber: "LOT-2025-001",
      fromBin: "B-02-R1-L1",
      catalog,
      inventory: INVENTORY_AFTER_PUTAWAY,
    });
    expect(check.allowed).toBe(true);
  });

  it("rejects lot not present in source bin", () => {
    const catalog = buildM2FifoLotCatalog(AFTER_CAPACITY_PUTAWAY, SCN_007_SEED);
    const check = validateM2FifoPick({
      sku: "SKU-002",
      lotNumber: "LOT-2025-001",
      fromBin: "B-01-R1-L1",
      catalog,
      inventory: INVENTORY_AFTER_PUTAWAY,
    });
    expect(check.allowed).toBe(false);
    expect(check.reasonFr).toBe(
      "Le lot sélectionné n'est pas disponible dans l'emplacement source indiqué."
    );
  });

  it("after fully consuming LOT-2025-001, LOT-2025-002 becomes eligible", () => {
    const catalog = buildM2FifoLotCatalog(AFTER_CAPACITY_PUTAWAY, SCN_007_SEED);
    const inventoryAfterOldestConsumed = {
      ...INVENTORY_AFTER_PUTAWAY,
      "SKU-002::B-02-R1-L1": 0,
    };
    const stillBlockedIfWrongBin = validateM2FifoPick({
      sku: "SKU-002",
      lotNumber: "LOT-2025-002",
      fromBin: "B-02-R1-L1",
      catalog,
      inventory: inventoryAfterOldestConsumed,
    });
    expect(stillBlockedIfWrongBin.allowed).toBe(false);

    const ok = validateM2FifoPick({
      sku: "SKU-002",
      lotNumber: "LOT-2025-002",
      fromBin: "B-01-R1-L1",
      catalog,
      inventory: inventoryAfterOldestConsumed,
    });
    expect(ok.allowed).toBe(true);
    expect(ok.requiredLot).toBeUndefined();
  });
});

describe("SCN-007 capacity step — no regression", () => {
  it("still rejects 600 u. into empty B-01-R1-L1 (max 500)", () => {
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

  it("still allows capacity split 500 + 100", () => {
    const first = validatePutaway({
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
    expect(first.allowed).toBe(true);

    const second = validatePutaway({
      sku: "SKU-002",
      fromBin: "REC-01",
      toBin: "B-01-R1-L2",
      qty: 100,
      binCapacities: { "B-01-R1-L1": 500, "B-01-R1-L2": 500 },
      binCurrentLoad: { "B-01-R1-L1": 500, "B-01-R1-L2": 0 },
      existingLots: [
        { lotNumber: "LOT-2025-002", receivedAt: new Date("2025-02-01"), qty: 500 },
      ],
      lotNumber: "LOT-2025-002",
      receivedAt: new Date("2025-02-01"),
    });
    expect(second.allowed).toBe(true);
  });
});
