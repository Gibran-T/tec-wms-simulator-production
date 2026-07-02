import { describe, expect, it } from "vitest";
import {
  canExecuteStep,
  calculateInventory,
  checkCompliance,
  detectScn003AtpShortage,
  getNextRequiredStep,
  getNextRequiredStepAllModules,
  getStockageAvailableForSku,
  isScn003CorrectiveReplenishmentRequired,
  isScn003Scenario,
  type RunState,
} from "./rulesEngine";

function makeState(
  completedSteps: string[],
  transactions: RunState["transactions"] = [],
  inventory: Record<string, number> = {},
  cycleCounts: RunState["cycleCounts"] = [],
  scenarioMeta: {
    scenarioId?: number;
    scnCode?: string | null;
    scenarioName?: string | null;
    scenarioInitialStateJson?: Record<string, unknown> | null;
  } = {}
): RunState {
  return {
    completedSteps: completedSteps as RunState["completedSteps"],
    transactions,
    inventory,
    cycleCounts,
    scenarioId: scenarioMeta.scenarioId ?? null,
    scnCode: scenarioMeta.scnCode ?? null,
    scenarioName: scenarioMeta.scenarioName ?? null,
    scenarioInitialStateJson: scenarioMeta.scenarioInitialStateJson ?? null,
  };
}

const scn003Seed = {
  preloadedTransactions: [
    { docType: "PO", sku: "SKU-003", bin: "REC-01", qty: 50, posted: true, docRef: "PO-2025-002" },
    { docType: "GR", sku: "SKU-003", bin: "REC-01", qty: 50, posted: true, docRef: "GR-2025-002" },
  ],
  context: "50 unités SKU-003 au quai REC-01 (PO/GR postées) — SO demandera 80 unités après rangement.",
};

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

describe("M1 SCN-005 multi-error mission flow", () => {
  const scn005Preload = [
    { docType: "PO", sku: "SKU-004", bin: "REC-01", qty: 30, posted: true, docRef: "PO-2025-004" },
    { docType: "GR", sku: "SKU-004", bin: "REC-01", qty: 30, posted: false, docRef: "GR-2025-004" },
    { docType: "PO", sku: "SKU-005", bin: "REC-02", qty: 60, posted: true, docRef: "PO-2025-005" },
    { docType: "GR", sku: "SKU-005", bin: "REC-02", qty: 60, posted: true, docRef: "GR-2025-005" },
  ];

  it("initial inventory: SKU-004 absent at REC-01, SKU-005 at REC-02, not in B-01-R1-L2", () => {
    const inv = calculateInventory(scn005Preload);
    expect(inv["SKU-004::REC-01"] ?? 0).toBe(0);
    expect(inv["SKU-005::REC-02"]).toBe(60);
    expect(inv["SKU-005::B-01-R1-L2"] ?? 0).toBe(0);
  });

  it("next required step is GR when GR-2025-004 is still pending", () => {
    const state = makeState(
      ["PO"],
      scn005Preload.map((t, i) => ({
        id: i + 1,
        runId: 1,
        docType: t.docType,
        sku: t.sku,
        bin: t.bin,
        qty: String(t.qty),
        posted: t.posted,
        docRef: t.docRef,
        moveType: null,
        comment: null,
        createdAt: new Date(),
      })) as RunState["transactions"]
    );
    expect(getNextRequiredStep(state.completedSteps, 1, state)?.code).toBe("GR");
    expect(getNextRequiredStepAllModules(state.completedSteps, 1, state)?.code).toBe("GR");
  });

  it("advances to PUTAWAY_M1 once all GRs are posted", () => {
    const state = makeState(
      ["PO", "GR"],
      scn005Preload.map((t, i) => ({
        id: i + 1,
        runId: 1,
        docType: t.docType,
        sku: t.sku,
        bin: t.bin,
        qty: String(t.qty),
        posted: true,
        docRef: t.docRef,
        moveType: null,
        comment: null,
        createdAt: new Date(),
      })) as RunState["transactions"]
    );
    expect(getNextRequiredStep(state.completedSteps, 1, state)?.code).toBe("PUTAWAY_M1");
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

  it("SCN-005 does not auto-complete GR while GR-2025-004 is pending", async () => {
    const { getM1StepsToAutoComplete } = await import("./m1Preload");
    expect(
      getM1StepsToAutoComplete([
        { docType: "PO", sku: "SKU-004", posted: true, docRef: "PO-2025-004" },
        { docType: "GR", sku: "SKU-004", posted: false, docRef: "GR-2025-004" },
        { docType: "PO", sku: "SKU-005", posted: true, docRef: "PO-2025-005" },
        { docType: "GR", sku: "SKU-005", bin: "REC-02", posted: true, docRef: "GR-2025-005" },
      ])
    ).toEqual(["PO"]);
  });

  it("SCN-005 auto-completes GR when every GR is posted", async () => {
    const { getM1StepsToAutoComplete } = await import("./m1Preload");
    expect(
      getM1StepsToAutoComplete([
        { docType: "PO", sku: "SKU-004", posted: true },
        { docType: "GR", sku: "SKU-004", posted: true, docRef: "GR-2025-004" },
        { docType: "PO", sku: "SKU-005", posted: true },
        { docType: "GR", sku: "SKU-005", bin: "REC-02", posted: true, docRef: "GR-2025-005" },
      ])
    ).toEqual(["PO", "GR"]);
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

describe("M1 SCN-003 ATP shortage / corrective replenishment flow", () => {
  const scn003Meta = { scenarioId: 3, scnCode: "SCN-003" };
  const scn003MetaDuplicateId = {
    scenarioId: 8,
    scnCode: null,
    scenarioName: "Scénario 3 — Stock insuffisant",
    scenarioInitialStateJson: scn003Seed,
  };

  const afterPutawayInventory = { "SKU-003::B-01-R1-L2": 50 };

  const afterSoTxs = [
    { id: 1, runId: 1, docType: "PO", sku: "SKU-003", bin: "REC-01", qty: "50", posted: true, docRef: "PO-2025-002", moveType: null, comment: null, createdAt: new Date() },
    { id: 2, runId: 1, docType: "GR", sku: "SKU-003", bin: "REC-01", qty: "50", posted: true, docRef: "GR-2025-002", moveType: null, comment: null, createdAt: new Date() },
    { id: 3, runId: 1, docType: "PUTAWAY_M1", sku: "SKU-003", bin: "B-01-R1-L2", qty: "50", posted: true, docRef: "PA-001", moveType: null, comment: null, createdAt: new Date() },
    { id: 4, runId: 1, docType: "SO", sku: "SKU-003", bin: "B-01-R1-L2", qty: "80", posted: true, docRef: "SO-001", moveType: null, comment: null, createdAt: new Date() },
  ] as RunState["transactions"];

  it("detects ATP shortage when SO 80 > STOCKAGE 50", () => {
    const state = makeState(["PO", "GR", "PUTAWAY_M1", "STOCK", "SO"], afterSoTxs, afterPutawayInventory, [], scn003Meta);
    const shortage = detectScn003AtpShortage(state);
    expect(shortage).not.toBeNull();
    expect(shortage!.stockAvailable).toBe(50);
    expect(shortage!.soDemand).toBe(80);
    expect(shortage!.deficit).toBe(30);
    expect(shortage!.active).toBe(true);
  });

  it("after PUTAWAY_M1 + SO 80 does NOT advance to PICKING_M1 — next is PO_CORRECTIVE", () => {
    const state = makeState(["PO", "GR", "PUTAWAY_M1", "STOCK", "SO"], afterSoTxs, afterPutawayInventory, [], scn003Meta);
    expect(getNextRequiredStep(state.completedSteps, 1, state)?.code).toBe("PO_CORRECTIVE");
    expect(getNextRequiredStepAllModules(state.completedSteps, 1, state)?.code).toBe("PO_CORRECTIVE");
  });

  it("blocks PICKING_M1 when ATP shortage unresolved", () => {
    const state = makeState(["PO", "GR", "PUTAWAY_M1", "STOCK", "SO"], afterSoTxs, afterPutawayInventory, [], scn003Meta);
    const pick = canExecuteStep("PICKING_M1", state);
    expect(pick.allowed).toBe(false);
    expect(pick.reasonFr).toContain("Stock insuffisant");
    expect(pick.reasonFr).toContain("30");
  });

  it("blocks GI when ATP shortage unresolved", () => {
    const state = makeState(
      ["PO", "GR", "PUTAWAY_M1", "STOCK", "SO", "PICKING_M1"],
      [
        ...afterSoTxs,
        { id: 5, runId: 1, docType: "PICKING_M1", sku: "SKU-003", bin: "EXP-01", qty: "80", posted: true, docRef: "PK-001", moveType: null, comment: null, createdAt: new Date() },
      ] as RunState["transactions"],
      { "SKU-003::EXP-01": 80 },
      [],
      scn003Meta
    );
    const gi = canExecuteStep("GI", state);
    expect(gi.allowed).toBe(false);
    expect(gi.reasonFr).toContain("Stock insuffisant");
  });

  it("corrective flow sequence: PO_CORRECTIVE → GR_CORRECTIVE → PUTAWAY_CORRECTIVE", () => {
    let completed = ["PO", "GR", "PUTAWAY_M1", "STOCK", "SO"];
    let state = makeState(completed, afterSoTxs, afterPutawayInventory, [], scn003Meta);
    expect(getNextRequiredStep(completed, 1, state)?.code).toBe("PO_CORRECTIVE");

    completed = [...completed, "PO_CORRECTIVE"];
    state = makeState(completed, afterSoTxs, afterPutawayInventory, [], scn003Meta);
    expect(getNextRequiredStep(completed, 1, state)?.code).toBe("GR_CORRECTIVE");

    completed = [...completed, "GR_CORRECTIVE"];
    state = makeState(completed, afterSoTxs, afterPutawayInventory, [], scn003Meta);
    expect(getNextRequiredStep(completed, 1, state)?.code).toBe("PUTAWAY_CORRECTIVE");
  });

  it("detects SCN-003 from seed signature when scnCode is absent (duplicate DB id)", () => {
    const state = makeState([], [], {}, [], scn003MetaDuplicateId);
    expect(isScn003Scenario(state)).toBe(true);
  });

  it("after PUTAWAY_M1 + SO 80 with duplicate scenario id routes to PO_CORRECTIVE", () => {
    const state = makeState(["PO", "GR", "PUTAWAY_M1", "STOCK", "SO"], afterSoTxs, afterPutawayInventory, [], scn003MetaDuplicateId);
    expect(getNextRequiredStep(state.completedSteps, 1, state)?.code).toBe("PO_CORRECTIVE");
  });

  it("blocks PICKING_M1 even when pick qty fits bin but SO demand exceeds STOCKAGE total", () => {
    const state = makeState(["PO", "GR", "PUTAWAY_M1", "STOCK", "SO"], afterSoTxs, afterPutawayInventory, [], scn003Meta);
    expect(isScn003CorrectiveReplenishmentRequired(state)).toBe(true);
    expect(canExecuteStep("PICKING_M1", state).allowed).toBe(false);
  });

  it("STOCKAGE remains 50 and shortage persists until corrective replenishment", () => {
    const state = makeState(["PO", "GR", "PUTAWAY_M1", "STOCK", "SO"], afterSoTxs, afterPutawayInventory, [], scn003Meta);
    expect(getStockageAvailableForSku(afterPutawayInventory, "SKU-003")).toBe(50);
    expect(detectScn003AtpShortage(state)?.deficit).toBe(30);
  });

  it("after partial pick to EXPEDITION, GI remains blocked and STOCKAGE shortage message reflects 0", () => {
    const pickedInventory = { "SKU-003::B-01-R1-L2": 0, "SKU-003::EXP-01": 50 };
    const state = makeState(
      ["PO", "GR", "PUTAWAY_M1", "STOCK", "SO", "PICKING_M1"],
      [
        ...afterSoTxs,
        { id: 5, runId: 1, docType: "PICKING", sku: "SKU-003", bin: "B-01-R1-L2", qty: "-50", posted: true, docRef: "PK-001", moveType: null, comment: null, createdAt: new Date() },
        { id: 6, runId: 1, docType: "PICKING_M1", sku: "SKU-003", bin: "EXP-01", qty: "50", posted: true, docRef: "PK-001", moveType: null, comment: null, createdAt: new Date() },
      ] as RunState["transactions"],
      pickedInventory,
      [],
      scn003Meta
    );
    expect(getStockageAvailableForSku(pickedInventory, "SKU-003")).toBe(0);
    expect(canExecuteStep("GI", state).allowed).toBe(false);
    expect(canExecuteStep("GI", state).reasonFr).toContain("0");
    expect(getNextRequiredStep(state.completedSteps, 1, state)?.code).toBe("PO_CORRECTIVE");
  });

  it("after corrective +30 and picking 80, GI is allowed", () => {
    const replenishedInventory = { "SKU-003::B-01-R1-L2": 80 };
    const replenishedTxs = [
      ...afterSoTxs,
      { id: 5, runId: 1, docType: "PO", sku: "SKU-003", bin: "REC-01", qty: "30", posted: true, docRef: "PO-CORR", moveType: null, comment: null, createdAt: new Date() },
      { id: 6, runId: 1, docType: "GR", sku: "SKU-003", bin: "REC-01", qty: "30", posted: true, docRef: "GR-CORR", moveType: null, comment: null, createdAt: new Date() },
      { id: 7, runId: 1, docType: "PUTAWAY_M1", sku: "SKU-003", bin: "B-01-R1-L2", qty: "30", posted: true, docRef: "PA-CORR", moveType: null, comment: null, createdAt: new Date() },
    ] as RunState["transactions"];
    const completed = ["PO", "GR", "PUTAWAY_M1", "STOCK", "SO", "PO_CORRECTIVE", "GR_CORRECTIVE", "PUTAWAY_CORRECTIVE"];
    const state = makeState(completed, replenishedTxs, replenishedInventory, [], scn003Meta);

    expect(detectScn003AtpShortage(state)).toBeNull();
    expect(getStockageAvailableForSku(replenishedInventory, "SKU-003")).toBe(80);
    expect(getNextRequiredStep(completed, 1, state)?.code).toBe("PICKING_M1");
    expect(canExecuteStep("PICKING_M1", state).allowed).toBe(true);
  });

  it("after corrective +30 and picking 80 to EXPEDITION, GI is allowed", () => {
    const replenishedInventory = { "SKU-003::B-01-R1-L2": 0, "SKU-003::EXP-01": 80 };
    const replenishedTxs = [
      ...afterSoTxs,
      { id: 5, runId: 1, docType: "PO", sku: "SKU-003", bin: "REC-01", qty: "30", posted: true, docRef: "PO-CORR", moveType: null, comment: null, createdAt: new Date() },
      { id: 6, runId: 1, docType: "GR", sku: "SKU-003", bin: "REC-01", qty: "30", posted: true, docRef: "GR-CORR", moveType: null, comment: null, createdAt: new Date() },
      { id: 7, runId: 1, docType: "PUTAWAY_M1", sku: "SKU-003", bin: "B-01-R1-L2", qty: "30", posted: true, docRef: "PA-CORR", moveType: null, comment: null, createdAt: new Date() },
      { id: 8, runId: 1, docType: "PICKING", sku: "SKU-003", bin: "B-01-R1-L2", qty: "-80", posted: true, docRef: "PK-FINAL", moveType: null, comment: null, createdAt: new Date() },
      { id: 9, runId: 1, docType: "PICKING_M1", sku: "SKU-003", bin: "EXP-01", qty: "80", posted: true, docRef: "PK-FINAL", moveType: null, comment: null, createdAt: new Date() },
    ] as RunState["transactions"];
    const completed = ["PO", "GR", "PUTAWAY_M1", "STOCK", "SO", "PO_CORRECTIVE", "GR_CORRECTIVE", "PUTAWAY_CORRECTIVE", "PICKING_M1"];
    const state = makeState(completed, replenishedTxs, replenishedInventory, [], scn003Meta);
    expect(isScn003CorrectiveReplenishmentRequired(state)).toBe(false);
    expect(canExecuteStep("GI", state).allowed).toBe(true);
  });

  it("does not affect other scenarios (SCN-001)", () => {
    const state = makeState(
      ["PO", "GR", "PUTAWAY_M1", "STOCK", "SO"],
      [{ id: 1, runId: 1, docType: "SO", sku: "SKU-001", bin: "B-01-R1-L1", qty: "80", posted: true, docRef: "SO-001", moveType: null, comment: null, createdAt: new Date() }] as RunState["transactions"],
      { "SKU-001::B-01-R1-L1": 50 },
      [],
      { scenarioId: 1, scnCode: "SCN-001" }
    );
    expect(detectScn003AtpShortage(state)).toBeNull();
    expect(getNextRequiredStep(state.completedSteps, 1, state)?.code).toBe("PICKING_M1");
  });

  it("no negative stock in inventory after putaway with shortage", () => {
    const inv = calculateInventory(afterSoTxs.map((t) => ({ docType: t.docType, sku: t.sku, bin: t.bin, qty: Number(t.qty), posted: t.posted })));
    expect(inv["SKU-003::B-01-R1-L2"]).toBe(50);
    for (const qty of Object.values(inv)) {
      expect(qty).toBeGreaterThanOrEqual(0);
    }
    const state = makeState(["PO", "GR", "PUTAWAY_M1", "STOCK", "SO"], afterSoTxs, inv, [], scn003Meta);
    expect(checkCompliance(state).compliant).toBe(true);
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
