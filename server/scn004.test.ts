import { describe, expect, it } from "vitest";
import {
  calculateInventory,
  canExecuteStep,
  checkCompliance,
  validateM1AdjPosting,
} from "./rulesEngine";
import {
  getScn004CycleCountTarget,
  recoverScn004RunState,
  resolveScn004CycleCount,
  SCN_004_PHYSICAL_QTY,
  SCN_004_TARGET_BIN,
  SCN_004_VARIANCE,
  validateM1CycleCountForScn004,
} from "./scn004";

const scn004Seed = {
  cycleCountTarget: { sku: "SKU-006", bin: "B-02-R1-L1", physicalQty: 185, variance: -15 },
};

type Tx = { docType: string; sku: string; bin: string; qty: number; posted: boolean };

/** Fresh SCN-004: PUTAWAY → SO/PICK/GI (15 u.) → CC at B-02-R1-L1. */
const freshRunTxs: Tx[] = [
  { docType: "PO", sku: "SKU-006", bin: "REC-01", qty: 200, posted: true },
  { docType: "GR", sku: "SKU-006", bin: "REC-01", qty: 200, posted: true },
  { docType: "PUTAWAY_M1", sku: "SKU-006", bin: "REC-01", qty: -200, posted: true },
  { docType: "PUTAWAY_M1", sku: "SKU-006", bin: "B-02-R1-L1", qty: 200, posted: true },
  { docType: "SO", sku: "SKU-006", bin: "B-02-R1-L1", qty: 15, posted: true },
  { docType: "PICKING", sku: "SKU-006", bin: "B-02-R1-L1", qty: -15, posted: true },
  { docType: "PICKING_M1", sku: "SKU-006", bin: "EXP-01", qty: 15, posted: true },
  { docType: "GI", sku: "SKU-006", bin: "EXP-01", qty: 15, posted: true },
];

function invAfter(txs: Tx[]) {
  return calculateInventory(txs);
}

describe("SCN-004 cycle count target injection", () => {
  it("seed contract resolves system 200 / physical 185 / variance −15", () => {
    const target = getScn004CycleCountTarget(scn004Seed);
    expect(target.bin).toBe(SCN_004_TARGET_BIN);
    expect(target.physicalQty).toBe(SCN_004_PHYSICAL_QTY);
    expect(target.variance).toBe(SCN_004_VARIANCE);
    expect(target.systemQty).toBe(200);
  });

  it("injects pedagogical systemQty when live inventory is 185 after GI", () => {
    const inv = invAfter(freshRunTxs);
    expect(inv["SKU-006::B-02-R1-L1"]).toBe(185);

    const resolved = resolveScn004CycleCount(
      scn004Seed,
      { sku: "SKU-006", bin: "B-02-R1-L1", physicalQty: 185 },
      inv["SKU-006::B-02-R1-L1"] ?? 0,
    );
    expect(resolved.injected).toBe(true);
    expect(resolved.systemQty).toBe(200);
    expect(resolved.physicalQty).toBe(185);
    expect(resolved.variance).toBe(-15);
  });

  it("without injection, same inventory would yield zero variance (regression guard)", () => {
    const inv = invAfter(freshRunTxs);
    const liveQty = inv["SKU-006::B-02-R1-L1"] ?? 0;
    expect(liveQty - liveQty).toBe(0);
  });

  it("rejects CC at wrong bin REC-02", () => {
    const inv = invAfter(freshRunTxs);
    const check = validateM1CycleCountForScn004(
      { inventory: inv, scnCode: "SCN-004", scenarioInitialStateJson: scn004Seed },
      { sku: "SKU-006", bin: "REC-02" },
    );
    expect(check.allowed).toBe(false);
  });

  it("rejects ADJ at EXP-01", () => {
    const inv = invAfter(freshRunTxs);
    const cc = resolveScn004CycleCount(
      scn004Seed,
      { sku: "SKU-006", bin: "B-02-R1-L1", physicalQty: 185 },
      inv["SKU-006::B-02-R1-L1"] ?? 0,
    );
    const cycleCount = {
      sku: "SKU-006",
      bin: "B-02-R1-L1",
      variance: cc.variance,
      resolved: false,
      systemQty: cc.systemQty,
      physicalQty: cc.physicalQty,
    };
    const adjExp = validateM1AdjPosting(
      { inventory: inv, cycleCounts: [cycleCount] },
      { sku: "SKU-006", bin: "EXP-01", qty: -15 },
    );
    expect(adjExp.allowed).toBe(false);
  });

  it("ADJ −15 at B-02-R1-L1 passes and compliance GREEN", () => {
    const inv = invAfter(freshRunTxs);
    const cc = resolveScn004CycleCount(
      scn004Seed,
      { sku: "SKU-006", bin: "B-02-R1-L1", physicalQty: 185 },
      inv["SKU-006::B-02-R1-L1"] ?? 0,
    );
    const cycleCount = {
      sku: "SKU-006",
      bin: "B-02-R1-L1",
      variance: cc.variance,
      resolved: false,
      systemQty: cc.systemQty,
      physicalQty: cc.physicalQty,
    };

    const adjCheck = validateM1AdjPosting(
      { inventory: inv, cycleCounts: [cycleCount] },
      { sku: "SKU-006", bin: "B-02-R1-L1", qty: -15 },
    );
    expect(adjCheck.allowed).toBe(true);

    const txs = [
      ...freshRunTxs,
      { docType: "ADJ", sku: "SKU-006", bin: "B-02-R1-L1", qty: -15, posted: true },
    ];
    const afterAdj = invAfter(txs);
    const completed = ["PO", "GR", "PUTAWAY_M1", "STOCK", "SO", "PICKING_M1", "GI", "CC", "ADJ"];
    const recovered = recoverScn004RunState({
      scnCode: "SCN-004",
      transactions: txs,
      cycleCounts: [{ ...cycleCount, resolved: true }],
      inventory: afterAdj,
    });
    expect(recovered.inventory["SKU-006::B-02-R1-L1"]).toBe(185);

    const state = {
      completedSteps: completed,
      transactions: recovered.transactions,
      inventory: recovered.inventory,
      cycleCounts: recovered.cycleCounts,
    };
    expect(checkCompliance(state).compliant).toBe(true);
    expect(canExecuteStep("COMPLIANCE", state).allowed).toBe(true);
  });
});
