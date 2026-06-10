import { describe, expect, it } from "vitest";
import { canExecuteStepM2, getNextRequiredStepAllModules, MODULE2_STEPS, validatePutaway } from "./rulesEngine";

describe("M2 stabilization — step sequence", () => {
  it("MODULE2_STEPS order is GR → PUTAWAY → FIFO_PICK → STOCK_ACCURACY → COMPLIANCE_ADV", () => {
    expect(MODULE2_STEPS.map((s) => s.code)).toEqual([
      "GR", "PUTAWAY", "FIFO_PICK", "STOCK_ACCURACY", "COMPLIANCE_ADV",
    ]);
  });

  it("SCN-006 bootstrap: GR auto-completed → next step PUTAWAY", () => {
    const state = {
      completedSteps: ["GR"] as string[],
      transactions: [
        { docType: "PO", sku: "SKU-001", bin: "REC-01", qty: 150, posted: true },
        { docType: "GR", sku: "SKU-001", bin: "REC-01", qty: 150, posted: true },
      ],
      inventory: { "SKU-001::REC-01": 150 },
      cycleCounts: [],
    };
    const next = getNextRequiredStepAllModules(state.completedSteps, 2, state as any);
    expect(next?.code).toBe("PUTAWAY");
    expect(canExecuteStepM2("PUTAWAY", state as any).allowed).toBe(true);
  });

  it("SCN-007 capacity: 600 u. in B-01-R1-L1 (max 500) is rejected", () => {
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

  it("SCN-008: stock already in STOCKAGE → next step FIFO_PICK (PUTAWAY bypassed)", () => {
    const state = {
      completedSteps: ["GR"] as string[],
      transactions: [
        { docType: "PO", sku: "SKU-003", bin: "REC-01", qty: 300, posted: true, docRef: "PO-M2-003" },
        { docType: "GR", sku: "SKU-003", bin: "B-01-R1-L1", qty: 100, posted: true, docRef: "GR-M2-003A" },
        { docType: "GR", sku: "SKU-003", bin: "B-01-R1-L2", qty: 100, posted: true, docRef: "GR-M2-003B" },
        { docType: "GR", sku: "SKU-003", bin: "B-02-R1-L1", qty: 100, posted: true, docRef: "GR-M2-003C" },
      ],
      inventory: {
        "SKU-003::B-01-R1-L1": 100,
        "SKU-003::B-01-R1-L2": 100,
        "SKU-003::B-02-R1-L1": 100,
      },
      cycleCounts: [],
    };
    const next = getNextRequiredStepAllModules(state.completedSteps, 2, state as any);
    expect(next?.code).toBe("FIFO_PICK");
  });

  it("after PUTAWAY completes, next step is FIFO_PICK", () => {
    const state = {
      completedSteps: ["GR", "PUTAWAY"] as string[],
      transactions: [
        { docType: "GR", sku: "SKU-001", bin: "REC-01", qty: 150, posted: true },
        { docType: "PUTAWAY", sku: "SKU-001", bin: "B-01-R1-L1", qty: 150, posted: true },
      ],
      inventory: { "SKU-001::B-01-R1-L1": 150 },
      cycleCounts: [],
    };
    const next = getNextRequiredStepAllModules(state.completedSteps, 2, state as any);
    expect(next?.code).toBe("FIFO_PICK");
  });
});
