import { describe, expect, it } from "vitest";
import { canExecuteStep, calculateInventory, checkCompliance, getNextRequiredStep, getNextRequiredStepAllModules, type RunState } from "./rulesEngine";

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
  const scn002Txs = [
    { id: 1, runId: 1, docType: "PO", sku: "SKU-001", bin: "REC-01", qty: "100", posted: true, docRef: "PO-2025-001", moveType: null, comment: null, createdAt: new Date() },
    { id: 2, runId: 1, docType: "GR", sku: "SKU-001", bin: "REC-01", qty: "100", posted: false, docRef: "GR-2025-001", moveType: null, comment: null, createdAt: new Date() },
  ] as RunState["transactions"];

  it("REC-01 stock is zero until ghost GR is posted (smoke)", () => {
    const invBefore = calculateInventory(scn002Txs.map((t) => ({ docType: t.docType, sku: t.sku, bin: t.bin, qty: Number(t.qty), posted: t.posted })));
    expect(invBefore["SKU-001::REC-01"] ?? 0).toBe(0);

    const invAfter = calculateInventory(
      scn002Txs.map((t) => ({ docType: t.docType, sku: t.sku, bin: t.bin, qty: Number(t.qty), posted: t.docType === "GR" ? true : t.posted }))
    );
    expect(invAfter["SKU-001::REC-01"]).toBe(100);
  });

  it("next required step is GR when unposted GR exists", () => {
    const state = makeState(["PO"], scn002Txs.filter((t) => t.docType === "GR"));
    const next = getNextRequiredStep(state.completedSteps, 1, state);
    expect(next?.code).toBe("GR");
  });

  it("advances to PUTAWAY_M1 after ghost GR is posted (smoke)", () => {
    const state = makeState(
      ["PO", "GR"],
      scn002Txs.map((t) => ({ ...t, posted: true }))
    );
    const next = getNextRequiredStep(state.completedSteps, 1, state);
    expect(next?.code).toBe("PUTAWAY_M1");
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

  it("normalizes unposted ghost GR bin to REC-01", async () => {
    const { normalizePreloadedTransaction } = await import("./m1Preload");
    expect(
      normalizePreloadedTransaction({
        docType: "GR",
        sku: "SKU-001",
        bin: "B-01-R1-L1",
        qty: 100,
        posted: false,
        docRef: "GR-2025-001",
      })
    ).toMatchObject({ bin: "REC-01", posted: false });
  });

  it("auto-completes M2 GR when preloaded GR is posted", async () => {
    const { getM2StepsToAutoComplete } = await import("./m1Preload");
    expect(
      getM2StepsToAutoComplete([
        { docType: "GR", posted: true },
      ])
    ).toEqual(["GR"]);
  });

  it("SCN-006 preloaded PO+GR at REC-01 auto-completes GR only", async () => {
    const { getM2StepsToAutoComplete } = await import("./m1Preload");
    expect(
      getM2StepsToAutoComplete([
        { docType: "PO", sku: "SKU-001", bin: "REC-01", qty: 150, posted: true, docRef: "PO-M2-001" },
        { docType: "GR", sku: "SKU-001", bin: "REC-01", qty: 150, posted: true, docRef: "GR-M2-001" },
      ])
    ).toEqual(["GR"]);
  });

  it("SCN-008 preloaded GR in STOCKAGE auto-completes GR and PUTAWAY", async () => {
    const { getM2StepsToAutoComplete } = await import("./m1Preload");
    expect(
      getM2StepsToAutoComplete([
        { docType: "PO", sku: "SKU-003", bin: "REC-01", qty: 300, posted: true, docRef: "PO-M2-003" },
        { docType: "GR", sku: "SKU-003", bin: "B-01-R1-L1", qty: 100, posted: true, docRef: "GR-M2-003A" },
        { docType: "GR", sku: "SKU-003", bin: "B-01-R1-L2", qty: 100, posted: true, docRef: "GR-M2-003B" },
        { docType: "GR", sku: "SKU-003", bin: "B-02-R1-L1", qty: 100, posted: true, docRef: "GR-M2-003C" },
      ])
    ).toEqual(["GR", "PUTAWAY"]);
  });
});

describe("M1 SCN-003 initial stock at REC-01", () => {
  const scn003Txs = [
    { docType: "PO", sku: "SKU-003", bin: "REC-01", qty: 50, posted: true },
    { docType: "GR", sku: "SKU-003", bin: "REC-01", qty: 50, posted: true },
  ];

  it("stock starts at REC-01, not in picking/storage bins", () => {
    const inv = calculateInventory(scn003Txs);
    expect(inv["SKU-003::REC-01"]).toBe(50);
    expect(inv["SKU-003::A-01-R1-L1"] ?? 0).toBe(0);
    expect(inv["SKU-003::B-01-R1-L2"] ?? 0).toBe(0);
  });

  it("next step after auto-completed PO/GR is PUTAWAY_M1", () => {
    const state = makeState(
      ["PO", "GR"],
      scn003Txs.map((t, i) => ({
        id: i + 1,
        runId: 1,
        docType: t.docType,
        sku: t.sku,
        bin: t.bin,
        qty: String(t.qty),
        posted: t.posted,
        docRef: t.docType === "PO" ? "PO-2025-002" : "GR-2025-002",
        moveType: null,
        comment: null,
        createdAt: new Date(),
      })) as RunState["transactions"]
    );
    expect(getNextRequiredStep(state.completedSteps, 1, state)?.code).toBe("PUTAWAY_M1");
  });
});

describe("M1 SCN-004 initial stock at REC-01", () => {
  const scn004Txs = [
    { docType: "PO", sku: "SKU-006", bin: "REC-01", qty: 200, posted: true },
    { docType: "GR", sku: "SKU-006", bin: "REC-01", qty: 200, posted: true },
  ];

  it("200 units start at REC-01, not pre-seeded in B-02-R1-L1", () => {
    const inv = calculateInventory(scn004Txs);
    expect(inv["SKU-006::REC-01"]).toBe(200);
    expect(inv["SKU-006::B-02-R1-L1"] ?? 0).toBe(0);
  });

  it("next step after auto-completed PO/GR is PUTAWAY_M1", () => {
    const state = makeState(
      ["PO", "GR"],
      scn004Txs.map((t, i) => ({
        id: i + 1,
        runId: 1,
        docType: t.docType,
        sku: t.sku,
        bin: t.bin,
        qty: String(t.qty),
        posted: t.posted,
        docRef: t.docType === "PO" ? "PO-2025-003" : "GR-2025-003",
        moveType: null,
        comment: null,
        createdAt: new Date(),
      })) as RunState["transactions"]
    );
    expect(getNextRequiredStep(state.completedSteps, 1, state)?.code).toBe("PUTAWAY_M1");
  });
});
