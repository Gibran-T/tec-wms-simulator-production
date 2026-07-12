/**
 * SCN-007 — FIFO_PICK must NOT belong to this scenario (capacity-only).
 * Shared FIFO helpers remain available for SCN-008.
 */
import { describe, expect, it } from "vitest";
import {
  canExecuteStepM2,
  getEffectiveM2Steps,
  getNextRequiredStepAllModules,
  validateM2FifoPickZone,
} from "./rulesEngine";
import { scn007FifoNotInScenarioMessage } from "./scn007";

const SCN_007_STATE = {
  scnCode: "SCN-007",
  scenarioId: 7,
  scenarioName: "M2 — Scénario 2 : Validation de la capacité d'emplacement",
  completedSteps: ["GR", "PUTAWAY"] as string[],
  transactions: [
    { docType: "PO", sku: "SKU-002", bin: "REC-01", qty: 600, posted: true, docRef: "PO-M2-002" },
    { docType: "GR", sku: "SKU-002", bin: "REC-01", qty: 600, posted: true, docRef: "GR-M2-002" },
    { docType: "PUTAWAY", sku: "SKU-002", bin: "REC-01", qty: -500, posted: true, docRef: "PUT-L1" },
    { docType: "PUTAWAY", sku: "SKU-002", bin: "B-01-R1-L1", qty: 500, posted: true, docRef: "PUT-L1" },
    { docType: "PUTAWAY", sku: "SKU-002", bin: "REC-01", qty: -100, posted: true, docRef: "PUT-L2" },
    { docType: "PUTAWAY", sku: "SKU-002", bin: "B-01-R1-L2", qty: 100, posted: true, docRef: "PUT-L2" },
  ],
  inventory: {
    "SKU-002::REC-01": 0,
    "SKU-002::B-01-R1-L1": 500,
    "SKU-002::B-01-R1-L2": 100,
  },
  cycleCounts: [],
  scenarioInitialStateJson: {
    preloadedTransactions: [
      { docType: "PO", sku: "SKU-002", bin: "REC-01", qty: 600, posted: true, docRef: "PO-M2-002" },
      { docType: "GR", sku: "SKU-002", bin: "REC-01", qty: 600, posted: true, docRef: "GR-M2-002" },
    ],
    lots: [{ lotNumber: "LOT-2025-002", receivedAt: "2025-02-01T10:00:00Z", qty: 600 }],
  },
};

describe("SCN-007 — FIFO_PICK not in scenario", () => {
  it("effective steps exclude FIFO_PICK", () => {
    expect(getEffectiveM2Steps(SCN_007_STATE).map((s) => s.code)).toEqual([
      "GR",
      "PUTAWAY",
      "STOCK_ACCURACY",
      "COMPLIANCE_ADV",
    ]);
  });

  it("canExecuteStepM2 blocks FIFO_PICK with capacity-only message", () => {
    const check = canExecuteStepM2("FIFO_PICK", SCN_007_STATE as any);
    expect(check.allowed).toBe(false);
    expect(check.reasonFr).toBe(scn007FifoNotInScenarioMessage().reasonFr);
  });

  it("next step after complete PUTAWAY is STOCK_ACCURACY, not FIFO_PICK", () => {
    const next = getNextRequiredStepAllModules(
      SCN_007_STATE.completedSteps,
      2,
      SCN_007_STATE as any,
    );
    expect(next?.code).toBe("STOCK_ACCURACY");
  });

  it("shared FIFO zone helper still works for SCN-008 destinations", () => {
    expect(validateM2FifoPickZone("B-02-R1-L1", "EXP-01").allowed).toBe(true);
    expect(validateM2FifoPickZone("REC-01", "EXP-01").allowed).toBe(false);
  });
});
