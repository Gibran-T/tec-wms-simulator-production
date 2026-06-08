import { describe, expect, it } from "vitest";
import { canExecuteStep, checkCompliance, getNextRequiredStep, getNextRequiredStepAllModules, type RunState } from "./rulesEngine";

function makeState(
  completedSteps: string[],
  transactions: RunState["transactions"] = [],
  inventory: Record<string, number> = {},
  cycleCounts: RunState["cycleCounts"] = []
): RunState {
  return {
    completedSteps: completedSteps as RunState["completedSteps"],
    transactions,
    inventory,
    cycleCounts,
  };
}

describe("M1 SCN-002 ghost GR resolution", () => {
  it("next required step is GR when unposted GR exists", () => {
    const state = makeState(
      ["PO"],
      [{ id: 1, runId: 1, docType: "GR", sku: "SKU-001", bin: "REC-01", qty: "100", posted: false, docRef: "GR-2025-001", moveType: null, comment: null, createdAt: new Date() }]
    );
    const next = getNextRequiredStep(state.completedSteps, 1, state);
    expect(next?.code).toBe("GR");
  });

  it("COMPLIANCE step is accessible with unposted GR (finalize still blocked via checkCompliance)", () => {
    const state = makeState(
      ["PO", "GR", "PUTAWAY_M1", "STOCK", "SO", "PICKING_M1", "GI", "CC"],
      [{ id: 1, runId: 1, docType: "GR", sku: "SKU-001", bin: "REC-01", qty: "100", posted: false, docRef: "GR-2025-001", moveType: null, comment: null, createdAt: new Date() }]
    );
    expect(canExecuteStep("COMPLIANCE", state).allowed).toBe(true);
    expect(checkCompliance(state).compliant).toBe(false);
  });

  it("COMPLIANCE blocked when variance unresolved and ADJ not done", () => {
    const state = makeState(
      ["PO", "GR", "PUTAWAY_M1", "STOCK", "SO", "PICKING_M1", "GI", "CC"],
      [],
      {},
      [{ id: 1, runId: 1, sku: "SKU-006", bin: "B-02-R1-L1", systemQty: "200", physicalQty: "185", variance: "-15", resolved: false, createdAt: new Date() }]
    );
    expect(canExecuteStep("COMPLIANCE", state).allowed).toBe(false);
  });
});

describe("M1 SCN-005 ghost GR with auto-completed GR step", () => {
  it("next required step is GR when unposted GR remains despite GR in completedSteps", () => {
    const state = makeState(
      ["PO", "GR"],
      [
        { id: 1, runId: 1, docType: "GR", sku: "SKU-004", bin: "REC-01", qty: "30", posted: false, docRef: "GR-2025-004", moveType: null, comment: null, createdAt: new Date() },
        { id: 2, runId: 1, docType: "GR", sku: "SKU-005", bin: "REC-02", qty: "60", posted: true, docRef: "GR-2025-005", moveType: null, comment: null, createdAt: new Date() },
      ]
    );
    const next = getNextRequiredStep(state.completedSteps, 1, state);
    expect(next?.code).toBe("GR");
  });

  it("getNextRequiredStepAllModules delegates M1 ghost GR guard to runs.state path", () => {
    const state = makeState(
      ["PO", "GR"],
      [
        { id: 1, runId: 1, docType: "GR", sku: "SKU-004", bin: "REC-01", qty: "30", posted: false, docRef: "GR-2025-004", moveType: null, comment: null, createdAt: new Date() },
        { id: 2, runId: 1, docType: "GR", sku: "SKU-005", bin: "REC-02", qty: "60", posted: true, docRef: "GR-2025-005", moveType: null, comment: null, createdAt: new Date() },
      ]
    );
    const next = getNextRequiredStepAllModules(state.completedSteps, 1, state);
    expect(next?.code).toBe("GR");
  });

  it("advances to PUTAWAY_M1 once all GRs are posted", () => {
    const state = makeState(
      ["PO", "GR"],
      [
        { id: 1, runId: 1, docType: "GR", sku: "SKU-004", bin: "REC-01", qty: "30", posted: true, docRef: "GR-2025-004", moveType: null, comment: null, createdAt: new Date() },
        { id: 2, runId: 1, docType: "GR", sku: "SKU-005", bin: "REC-02", qty: "60", posted: true, docRef: "GR-2025-005", moveType: null, comment: null, createdAt: new Date() },
      ]
    );
    const next = getNextRequiredStep(state.completedSteps, 1, state);
    expect(next?.code).toBe("PUTAWAY_M1");
  });
});

describe("M1 preload step sync", () => {
  it("auto-completes PO when preloaded PO is posted", async () => {
    const { getM1StepsToAutoComplete } = await import("./m1Preload");
    expect(
      getM1StepsToAutoComplete([
        { docType: "PO", posted: true },
        { docType: "GR", posted: false },
      ])
    ).toEqual(["PO"]);
  });
});
