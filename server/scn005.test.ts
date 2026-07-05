import { describe, expect, it } from "vitest";
import {
  canExecuteStep,
  calculateInventory,
  checkCompliance,
  getNextRequiredStep,
  type RunState,
} from "./rulesEngine";
import {
  countScn005PutawayMovements,
  getScn005PendingPutaways,
  isScn005DualPutawayComplete,
  recoverScn005RunState,
  SCN_005_CC_BIN,
  SCN_005_SKU_A,
  SCN_005_SKU_B,
  validateM1CycleCountForScn005,
  validateScn005PutawayInput,
} from "./scn005";

const scn005Meta = {
  scenarioId: 5,
  scnCode: "SCN-005" as const,
  scenarioInitialStateJson: {
    preloadedTransactions: [
      { docType: "PO", sku: "SKU-004", bin: "REC-01", qty: 30, posted: true, docRef: "PO-2025-004" },
      { docType: "GR", sku: "SKU-004", bin: "REC-01", qty: 30, posted: false, docRef: "GR-2025-004" },
      { docType: "PO", sku: "SKU-005", bin: "REC-02", qty: 60, posted: true, docRef: "PO-2025-005" },
      { docType: "GR", sku: "SKU-005", bin: "REC-02", qty: 60, posted: true, docRef: "GR-2025-005" },
    ],
    putawayTargets: [
      { sku: "SKU-004", fromBin: "REC-01", toBin: "B-01-R1-L1", qty: 30 },
      { sku: "SKU-005", fromBin: "REC-02", toBin: "B-01-R1-L2", qty: 60 },
    ],
    cycleCountTarget: { sku: "SKU-005", bin: "B-01-R1-L2", variance: -8 },
  },
};

function makeState(
  completedSteps: string[],
  transactions: RunState["transactions"] = [],
  inventory: Record<string, number> = {},
  cycleCounts: RunState["cycleCounts"] = [],
): RunState {
  return {
    completedSteps: completedSteps as RunState["completedSteps"],
    transactions,
    inventory,
    cycleCounts,
    scenarioId: scn005Meta.scenarioId,
    scnCode: scn005Meta.scnCode,
    scenarioName: "Scénario 5 — Non-conformités multiples",
    scenarioInitialStateJson: scn005Meta.scenarioInitialStateJson,
  };
}

function tx(
  docType: string,
  sku: string,
  bin: string,
  qty: number,
  posted = true,
  docRef?: string,
): RunState["transactions"][number] {
  return {
    id: Math.random(),
    runId: 154,
    docType,
    sku,
    bin,
    qty: String(qty),
    posted,
    docRef: docRef ?? null,
    moveType: null,
    comment: null,
    createdAt: new Date(),
  };
}

describe("SCN-005 dual putaway gating", () => {
  const afterGrPosted = [
    tx("PO", "SKU-004", "REC-01", 30),
    tx("GR", "SKU-004", "REC-01", 30, true, "GR-2025-004"),
    tx("PO", "SKU-005", "REC-02", 60),
    tx("GR", "SKU-005", "REC-02", 60, true, "GR-2025-005"),
  ] as RunState["transactions"];

  const receptionInventory = {
    "SKU-004::REC-01": 30,
    "SKU-005::REC-02": 60,
  };

  it("detects both SKUs pending putaway after GR posted", () => {
    const state = makeState(["PO", "GR"], afterGrPosted, receptionInventory);
    expect(getScn005PendingPutaways(state)).toHaveLength(2);
    expect(isScn005DualPutawayComplete(state)).toBe(false);
  });

  it("cannot advance to SO/PICKING before both putaways", () => {
    const afterOnePutaway = [
      ...afterGrPosted,
      tx("PUTAWAY_M1", "SKU-004", "REC-01", -30),
      tx("PUTAWAY_M1", "SKU-004", "B-01-R1-L1", 30),
    ] as RunState["transactions"];
    const inv = {
      "SKU-004::B-01-R1-L1": 30,
      "SKU-005::REC-02": 60,
    };
    const state = makeState(["PO", "GR", "PUTAWAY_M1", "STOCK"], afterOnePutaway, inv);

    expect(getScn005PendingPutaways(state)).toHaveLength(1);
    expect(getNextRequiredStep(state.completedSteps, 1, state)?.code).toBe("PUTAWAY_M1");
    expect(canExecuteStep("SO", state).allowed).toBe(false);
    expect(canExecuteStep("PICKING_M1", state).allowed).toBe(false);
    expect(canExecuteStep("GI", state).allowed).toBe(false);
  });

  it("blocks putaway SKU-004 while ghost GR-2025-004 is pending", () => {
    const ghostPending = [
      tx("GR", "SKU-004", "REC-01", 30, false, "GR-2025-004"),
      tx("GR", "SKU-005", "REC-02", 60, true, "GR-2025-005"),
    ] as RunState["transactions"];
    const state = makeState(["PO"], ghostPending, { "SKU-005::REC-02": 60 });
    const check = validateScn005PutawayInput(state, {
      sku: "SKU-004",
      fromBin: "REC-01",
      toBin: "B-01-R1-L1",
      qty: 30,
    });
    expect(check.allowed).toBe(false);
  });

  it("posts two putaway movements for both SKUs on happy path", () => {
    const bothPutaway = [
      ...afterGrPosted,
      tx("PUTAWAY_M1", "SKU-004", "REC-01", -30),
      tx("PUTAWAY_M1", "SKU-004", "B-01-R1-L1", 30),
      tx("PUTAWAY_M1", "SKU-005", "REC-02", -60),
      tx("PUTAWAY_M1", "SKU-005", "B-01-R1-L2", 60),
    ] as RunState["transactions"];
    expect(countScn005PutawayMovements(bothPutaway)).toBe(2);
    const inv = calculateInventory(
      bothPutaway.map((t) => ({
        docType: t.docType,
        sku: t.sku,
        bin: t.bin,
        qty: Number(t.qty),
        posted: t.posted,
      })),
    );
    const state = makeState(["PO", "GR", "PUTAWAY_M1", "STOCK"], bothPutaway, inv);
    expect(isScn005DualPutawayComplete(state)).toBe(true);
    expect(getNextRequiredStep(state.completedSteps, 1, state)?.code).toBe("SO");
    expect(canExecuteStep("SO", state).allowed).toBe(true);
  });

  it("rejects CC for SKU-005 at REC-02", () => {
    const state = makeState([], [], { "SKU-005::REC-02": 60, "SKU-005::B-01-R1-L2": 52 });
    const check = validateM1CycleCountForScn005(state, { sku: "SKU-005", bin: "REC-02" });
    expect(check.allowed).toBe(false);
    expect(validateM1CycleCountForScn005(state, { sku: "SKU-005", bin: SCN_005_CC_BIN }).allowed).toBe(true);
  });

  it("happy path: GR → dual putaway → ship → CC −8 → ADJ → compliance", () => {
    const txs = [
      ...afterGrPosted,
      tx("PUTAWAY_M1", SCN_005_SKU_A, "REC-01", -30),
      tx("PUTAWAY_M1", SCN_005_SKU_A, "B-01-R1-L1", 30),
      tx("PUTAWAY_M1", SCN_005_SKU_B, "REC-02", -60),
      tx("PUTAWAY_M1", SCN_005_SKU_B, SCN_005_CC_BIN, 60),
      tx("SO", SCN_005_SKU_A, "B-01-R1-L1", 30),
      tx("SO", SCN_005_SKU_B, SCN_005_CC_BIN, 30),
      tx("PICKING", SCN_005_SKU_A, "B-01-R1-L1", -30),
      tx("PICKING_M1", SCN_005_SKU_A, "EXP-01", 30),
      tx("PICKING", SCN_005_SKU_B, SCN_005_CC_BIN, -30),
      tx("PICKING_M1", SCN_005_SKU_B, "EXP-01", 30),
      tx("GI", SCN_005_SKU_A, "EXP-01", 30),
      tx("GI", SCN_005_SKU_B, "EXP-01", 30),
      tx("ADJ", SCN_005_SKU_B, SCN_005_CC_BIN, -8),
    ] as RunState["transactions"];

    const inv = calculateInventory(
      txs.map((t) => ({
        docType: t.docType,
        sku: t.sku,
        bin: t.bin,
        qty: Number(t.qty),
        posted: t.posted,
      })),
    );

    const cycleCounts = [
      {
        id: 1,
        runId: 154,
        sku: SCN_005_SKU_B,
        bin: SCN_005_CC_BIN,
        systemQty: "30",
        physicalQty: "22",
        variance: "-8",
        resolved: true,
        createdAt: new Date(),
      },
    ] as RunState["cycleCounts"];

    const state = makeState(
      ["PO", "GR", "PUTAWAY_M1", "STOCK", "SO", "PICKING_M1", "GI", "CC", "ADJ"],
      txs,
      inv,
      cycleCounts,
    );

    expect(isScn005DualPutawayComplete(state)).toBe(true);
    expect(checkCompliance(state).compliant).toBe(true);
  });

  it("recovers broken run 154 pattern — SKU-005 at REC-02 routes back to PUTAWAY_M1", () => {
    const brokenTxs = [
      ...afterGrPosted,
      tx("PUTAWAY_M1", "SKU-004", "REC-01", -30),
      tx("PUTAWAY_M1", "SKU-004", "B-01-R1-L1", 30),
      tx("SO", "SKU-004", "B-01-R1-L1", 30),
    ] as RunState["transactions"];
    const inv = {
      "SKU-004::B-01-R1-L1": 30,
      "SKU-005::REC-02": 60,
    };
    const rawState = makeState(["PO", "GR", "PUTAWAY_M1", "STOCK", "SO"], brokenTxs, inv);
    const recovered = recoverScn005RunState(rawState);

    expect(getScn005PendingPutaways(recovered)).toHaveLength(1);
    expect(getScn005PendingPutaways(recovered)[0]?.sku).toBe("SKU-005");
    expect(getNextRequiredStep(recovered.completedSteps, 1, recovered)?.code).toBe("PUTAWAY_M1");
    expect(canExecuteStep("PICKING_M1", recovered).allowed).toBe(false);
    expect(checkCompliance(recovered).compliant).toBe(false);
  });

  it("remaps CC wrongly recorded at REC-02 to storage bin on recovery", () => {
    const state = makeState(
      [],
      [],
      {},
      [
        {
          id: 1,
          runId: 154,
          sku: SCN_005_SKU_B,
          bin: "REC-02",
          systemQty: "60",
          physicalQty: "52",
          variance: "-8",
          resolved: false,
          createdAt: new Date(),
        },
      ],
    );
    const recovered = recoverScn005RunState(state);
    expect(recovered.cycleCounts[0]?.bin).toBe(SCN_005_CC_BIN);
  });
});
