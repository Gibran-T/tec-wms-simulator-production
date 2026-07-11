/**
 * SCN-008 regression — FIFO_PICK lot nomenclature + zones
 * Canonical lots: LOT-A / LOT-B / LOT-C (never LOT-A-2025)
 * Source: STOCKAGE only · Dest: EXPÉDITION only · oldest lot first
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  buildM2FifoLotCatalog,
  validateM2FifoPick,
  validateM2FifoPickZone,
} from "./rulesEngine";

const SCN_008_SEED = {
  preloadedTransactions: [
    { docType: "PO", sku: "SKU-003", bin: "REC-01", qty: 300, posted: true, docRef: "PO-M2-003" },
    { docType: "GR", sku: "SKU-003", bin: "B-01-R1-L1", qty: 100, posted: true, docRef: "GR-M2-003A" },
    { docType: "GR", sku: "SKU-003", bin: "B-01-R1-L2", qty: 100, posted: true, docRef: "GR-M2-003B" },
    { docType: "GR", sku: "SKU-003", bin: "B-02-R1-L1", qty: 100, posted: true, docRef: "GR-M2-003C" },
  ],
  lots: [
    { lotNumber: "LOT-A", receivedAt: "2025-01-10T08:00:00Z", qty: 100 },
    { lotNumber: "LOT-B", receivedAt: "2025-02-10T08:00:00Z", qty: 100 },
    { lotNumber: "LOT-C", receivedAt: "2025-03-10T08:00:00Z", qty: 100 },
  ],
};

const INVENTORY_FULL = {
  "SKU-003::B-01-R1-L1": 100,
  "SKU-003::B-01-R1-L2": 100,
  "SKU-003::B-02-R1-L1": 100,
};

describe("SCN-008 FIFO_PICK — correct selection (Cas 1)", () => {
  it("accepts LOT-A from B-01-R1-L1 → EXP-01 qty 100", () => {
    const catalog = buildM2FifoLotCatalog([], SCN_008_SEED);
    const zone = validateM2FifoPickZone("B-01-R1-L1", "EXP-01");
    expect(zone.allowed).toBe(true);

    const check = validateM2FifoPick({
      sku: "SKU-003",
      lotNumber: "LOT-A",
      fromBin: "B-01-R1-L1",
      catalog,
      inventory: INVENTORY_FULL,
    });
    expect(check.allowed).toBe(true);
  });
});

describe("SCN-008 FIFO_PICK — newer lot blocked (Cas 2)", () => {
  it("blocks LOT-B while LOT-A still has stock", () => {
    const catalog = buildM2FifoLotCatalog([], SCN_008_SEED);
    const check = validateM2FifoPick({
      sku: "SKU-003",
      lotNumber: "LOT-B",
      fromBin: "B-01-R1-L2",
      catalog,
      inventory: INVENTORY_FULL,
    });
    expect(check.allowed).toBe(false);
    expect(check.requiredLot).toBe("LOT-A");
    expect(check.reasonFr).toBe(
      "La règle FIFO exige de prélever en priorité le lot LOT-A, entré en stock le plus ancien."
    );
    expect(check.reasonFr).not.toContain("2025");
    expect(check.reasonFr).toContain("LOT-A");
  });
});

describe("SCN-008 FIFO_PICK — third lot blocked (Cas 3)", () => {
  it("blocks LOT-C while LOT-A or LOT-B remain eligible", () => {
    const catalog = buildM2FifoLotCatalog([], SCN_008_SEED);

    const whileA = validateM2FifoPick({
      sku: "SKU-003",
      lotNumber: "LOT-C",
      fromBin: "B-02-R1-L1",
      catalog,
      inventory: INVENTORY_FULL,
    });
    expect(whileA.allowed).toBe(false);
    expect(whileA.requiredLot).toBe("LOT-A");

    const whileB = validateM2FifoPick({
      sku: "SKU-003",
      lotNumber: "LOT-C",
      fromBin: "B-02-R1-L1",
      catalog,
      inventory: {
        "SKU-003::B-01-R1-L1": 0,
        "SKU-003::B-01-R1-L2": 100,
        "SKU-003::B-02-R1-L1": 100,
      },
    });
    expect(whileB.allowed).toBe(false);
    expect(whileB.requiredLot).toBe("LOT-B");
    expect(whileB.reasonFr).toBe(
      "La règle FIFO exige de prélever en priorité le lot LOT-B, entré en stock le plus ancien."
    );
  });
});

describe("SCN-008 FIFO_PICK — invalid source (Cas 4)", () => {
  it("rejects REC-01 as source", () => {
    const check = validateM2FifoPickZone("REC-01", "EXP-01");
    expect(check.allowed).toBe(false);
    expect(check.reasonFr).toBe(
      "Le prélèvement FIFO doit partir d'un emplacement de STOCKAGE."
    );
  });
});

describe("SCN-008 FIFO_PICK — invalid destination (Cas 5)", () => {
  it("rejects STOCKAGE bin as destination", () => {
    const check = validateM2FifoPickZone("B-01-R1-L1", "B-01-R1-L2");
    expect(check.allowed).toBe(false);
    expect(check.reasonFr).toBe(
      "La destination doit être un emplacement de la zone EXPÉDITION."
    );
  });
});

describe("SCN-008 FIFO_PICK — nomenclature consistency (Cas 6)", () => {
  it("seed catalog uses LOT-A / LOT-B / LOT-C only", () => {
    const catalog = buildM2FifoLotCatalog([], SCN_008_SEED);
    expect(catalog.map((e) => e.lotNumber)).toEqual(["LOT-A", "LOT-B", "LOT-C"]);
  });

  it("SCN-008 canonical sources do not expose LOT-*-2025", () => {
    const root = join(dirname(fileURLToPath(import.meta.url)), "..");
    const files = [
      "server/seed.ts",
      "server/missionDataExtended.ts",
      "server/m2.gold-standard.test.ts",
    ];
    for (const rel of files) {
      const content = readFileSync(join(root, rel), "utf8");
      // Scope: only SCN-008 / LOT-A-2025 pattern — ignore SCN-007 LOT-2025-00x
      expect(content, rel).not.toMatch(/LOT-[ABC]-2025/);
    }
  });
});

describe("SCN-008 FIFO_PICK — progression after LOT-A depleted (Cas 7)", () => {
  it("accepts LOT-B and still blocks LOT-C after LOT-A is exhausted", () => {
    const catalog = buildM2FifoLotCatalog([], SCN_008_SEED);
    const inventoryAfterA = {
      "SKU-003::B-01-R1-L1": 0,
      "SKU-003::B-01-R1-L2": 100,
      "SKU-003::B-02-R1-L1": 100,
    };

    const okB = validateM2FifoPick({
      sku: "SKU-003",
      lotNumber: "LOT-B",
      fromBin: "B-01-R1-L2",
      catalog,
      inventory: inventoryAfterA,
    });
    expect(okB.allowed).toBe(true);

    const blockedC = validateM2FifoPick({
      sku: "SKU-003",
      lotNumber: "LOT-C",
      fromBin: "B-02-R1-L1",
      catalog,
      inventory: inventoryAfterA,
    });
    expect(blockedC.allowed).toBe(false);
    expect(blockedC.requiredLot).toBe("LOT-B");
  });
});

describe("SCN-008 FIFO_PICK — non-regression zones", () => {
  it("allows EXP-01 and EXP-02 as destinations", () => {
    expect(validateM2FifoPickZone("B-01-R1-L1", "EXP-01").allowed).toBe(true);
    expect(validateM2FifoPickZone("B-01-R1-L1", "EXP-02").allowed).toBe(true);
  });

  it("rejects LOT-A-2025 as if it were a student-facing code (not in catalog)", () => {
    const catalog = buildM2FifoLotCatalog([], SCN_008_SEED);
    const check = validateM2FifoPick({
      sku: "SKU-003",
      lotNumber: "LOT-A-2025",
      fromBin: "B-01-R1-L1",
      catalog,
      inventory: INVENTORY_FULL,
    });
    expect(check.allowed).toBe(false);
    expect(check.reasonFr).toBe(
      "Le lot sélectionné n'est pas disponible dans l'emplacement source indiqué."
    );
  });
});
