/**
 * Module 2 — Advanced Warehouse Execution
 * Test suite: capacity rules, FIFO rules, module unlock logic
 */
import { describe, it, expect } from "vitest";
import {
  validatePutaway,
  isModuleUnlocked,
  type PutawayContext,
} from "./rulesEngine";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makePutawayCtx(overrides: Partial<PutawayContext> = {}): PutawayContext {
  return {
    sku: "SKU-001",
    fromBin: "RECEIVING",
    toBin: "BIN-A01",
    qty: 50,
    binCapacities: { "BIN-A01": 200 },
    binCurrentLoad: { "BIN-A01": 0 },
    existingLots: [],
    lotNumber: "LOT-001",
    receivedAt: new Date("2025-06-01"),
    ...overrides,
  };
}

// ─── Bin Capacity Tests ───────────────────────────────────────────────────────

describe("Module 2 — Bin Capacity Rules", () => {
  it("allows putaway when bin has sufficient capacity", () => {
    const ctx = makePutawayCtx({ qty: 50, binCurrentLoad: { "BIN-A01": 100 }, binCapacities: { "BIN-A01": 200 } });
    const result = validatePutaway(ctx);
    expect(result.allowed).toBe(true);
    expect(result.penaltyPoints).toBeUndefined();
  });

  it("rejects putaway when bin capacity would be exceeded", () => {
    const ctx = makePutawayCtx({ qty: 150, binCurrentLoad: { "BIN-A01": 100 }, binCapacities: { "BIN-A01": 200 } });
    const result = validatePutaway(ctx);
    expect(result.allowed).toBe(false);
    expect(result.penaltyEvent).toBe("CAPACITY_OVERFLOW");
    expect(result.penaltyPoints).toBe(-10);
    expect(result.reasonFr).toMatch(/capacité/i);
  });

  it("allows putaway at exact capacity limit", () => {
    const ctx = makePutawayCtx({ qty: 100, binCurrentLoad: { "BIN-A01": 100 }, binCapacities: { "BIN-A01": 200 } });
    const result = validatePutaway(ctx);
    expect(result.allowed).toBe(true);
  });

  it("rejects putaway when qty alone exceeds full capacity", () => {
    const ctx = makePutawayCtx({ qty: 501, binCurrentLoad: { "BIN-B01": 0 }, binCapacities: { "BIN-B01": 500 }, toBin: "BIN-B01" });
    const result = validatePutaway(ctx);
    expect(result.allowed).toBe(false);
    expect(result.penaltyEvent).toBe("CAPACITY_OVERFLOW");
    expect(result.penaltyPoints).toBe(-10);
  });

  it("rejects putaway when bin does not exist", () => {
    const ctx = makePutawayCtx({ toBin: "BIN-NONEXISTENT", binCapacities: { "BIN-A01": 200 } });
    const result = validatePutaway(ctx);
    expect(result.allowed).toBe(false);
    expect(result.reasonFr).toMatch(/n'existe pas/i);
  });
});

// ─── FIFO Tests ───────────────────────────────────────────────────────────────

describe("Module 2 — FIFO Rules", () => {
  it("passes FIFO when no existing lots", () => {
    const ctx = makePutawayCtx({ existingLots: [] });
    const result = validatePutaway(ctx);
    expect(result.allowed).toBe(true);
    expect(result.penaltyEvent).toBeUndefined();
  });

  it("passes FIFO when placing the oldest lot", () => {
    // LOT-001 is oldest — correct FIFO
    const ctx = makePutawayCtx({
      lotNumber: "LOT-001",
      receivedAt: new Date("2025-01-01"),
      existingLots: [
        { lotNumber: "LOT-002", receivedAt: new Date("2025-03-01"), qty: 50 },
      ],
    });
    const result = validatePutaway(ctx);
    expect(result.allowed).toBe(true);
  });

  it("detects FIFO violation when placing newer lot while older exists", () => {
    // LOT-002 is newer — FIFO violation because LOT-001 is older and still unplaced
    const ctx = makePutawayCtx({
      lotNumber: "LOT-002",
      receivedAt: new Date("2025-03-01"),
      existingLots: [
        { lotNumber: "LOT-001", receivedAt: new Date("2025-01-01"), qty: 100 },
      ],
    });
    const result = validatePutaway(ctx);
    expect(result.allowed).toBe(false);
    expect(result.penaltyEvent).toBe("FIFO_VIOLATION");
    expect(result.penaltyPoints).toBe(-15);
    expect(result.reasonFr).toMatch(/FIFO/i);
    expect(result.reasonFr).toContain("LOT-001");
  });

  it("handles single lot correctly (no FIFO violation)", () => {
    const ctx = makePutawayCtx({
      lotNumber: "LOT-001",
      receivedAt: new Date("2025-06-01"),
      existingLots: [],
    });
    const result = validatePutaway(ctx);
    expect(result.allowed).toBe(true);
  });

  it("detects FIFO violation when newest of three lots is selected", () => {
    const ctx = makePutawayCtx({
      sku: "SKU-003",
      lotNumber: "LOT-C",
      receivedAt: new Date("2025-01-01"),
      existingLots: [
        { lotNumber: "LOT-A", receivedAt: new Date("2024-06-01"), qty: 80 },
        { lotNumber: "LOT-B", receivedAt: new Date("2024-09-01"), qty: 60 },
      ],
    });
    const result = validatePutaway(ctx);
    expect(result.allowed).toBe(false);
    expect(result.penaltyEvent).toBe("FIFO_VIOLATION");
    expect(result.reasonFr).toContain("LOT-A");
  });
});

// ─── Module Unlock Logic Tests ────────────────────────────────────────────────

describe("Module 2 — Sequential Unlock Logic", () => {
  // isModuleUnlocked(unlockedByModuleId, passedModuleIds[])
  // Module 1 has unlockedByModuleId = null (always accessible)
  // Module 2 has unlockedByModuleId = 1 (requires module 1 passed)

  it("module 1 is always accessible (unlockedByModuleId = null)", () => {
    const result = isModuleUnlocked(null, []);
    expect(result).toBe(true);
  });

  it("module 2 is accessible when module 1 is in passedModuleIds", () => {
    // Module 2 unlockedByModuleId = 1, student passed module 1
    const result = isModuleUnlocked(1, [1]);
    expect(result).toBe(true);
  });

  it("module 2 is NOT accessible when module 1 is not in passedModuleIds", () => {
    const result = isModuleUnlocked(1, []);
    expect(result).toBe(false);
  });

  it("module 2 is NOT accessible with empty passed list", () => {
    const result = isModuleUnlocked(1, []);
    expect(result).toBe(false);
  });

  it("module 2 accessible when module 1 passed (multiple modules in list)", () => {
    const result = isModuleUnlocked(1, [1, 3]);
    expect(result).toBe(true);
  });

  it("module 3 is NOT accessible if only module 1 passed (requires module 2)", () => {
    // Module 3 unlockedByModuleId = 2
    const result = isModuleUnlocked(2, [1]);
    expect(result).toBe(false);
  });
});

// ─── Penalty Accumulation Tests ───────────────────────────────────────────────

describe("Module 2 — Penalty Points", () => {
  it("capacity overflow penalty is -10 points", () => {
    const ctx = makePutawayCtx({ qty: 999, binCurrentLoad: { "BIN-A01": 0 }, binCapacities: { "BIN-A01": 100 } });
    const result = validatePutaway(ctx);
    expect(result.penaltyPoints).toBe(-10);
  });

  it("FIFO violation penalty is -15 points", () => {
    const ctx = makePutawayCtx({
      lotNumber: "LOT-NEW",
      receivedAt: new Date("2025-12-01"),
      existingLots: [{ lotNumber: "LOT-OLD", receivedAt: new Date("2024-01-01"), qty: 50 }],
    });
    const result = validatePutaway(ctx);
    expect(result.penaltyPoints).toBe(-15);
  });

  it("no penalty on valid putaway", () => {
    const ctx = makePutawayCtx();
    const result = validatePutaway(ctx);
    expect(result.allowed).toBe(true);
    expect(result.penaltyPoints).toBeUndefined();
    expect(result.penaltyEvent).toBeUndefined();
  });
});
