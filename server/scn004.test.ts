import { describe, expect, it } from "vitest";
import {
  calculateInventory,
  canExecuteStep,
  checkCompliance,
  getEffectiveM1Steps,
  validateM1AdjPosting,
} from "./rulesEngine";
import {
  getScn004CycleCountTarget,
  getScn004StepMaxPoints,
  isScn004Scenario,
  recoverScn004RunState,
  resolveScn004CycleCount,
  SCN_004_M1_STEPS,
  SCN_004_PHYSICAL_QTY,
  SCN_004_TARGET_BIN,
  SCN_004_VARIANCE,
  validateM1CycleCountForScn004,
} from "./scn004";

const scn004Seed = {
  cycleCountTarget: { sku: "SKU-006", bin: "B-02-R1-L1", physicalQty: 185, variance: -15 },
};

const scn004Meta = { scnCode: "SCN-004", scenarioId: 4 };

type Tx = { docType: string; sku: string; bin: string; qty: number; posted: boolean };

/** SCN-004 audit path: PO/GR → putaway → CC at B-02-R1-L1 (no outbound). */
const auditPathTxs: Tx[] = [
  { docType: "PO", sku: "SKU-006", bin: "REC-01", qty: 200, posted: true },
  { docType: "GR", sku: "SKU-006", bin: "REC-01", qty: 200, posted: true },
  { docType: "PUTAWAY_M1", sku: "SKU-006", bin: "REC-01", qty: -200, posted: true },
  { docType: "PUTAWAY_M1", sku: "SKU-006", bin: "B-02-R1-L1", qty: 200, posted: true },
];

function invAfter(txs: Tx[]) {
  return calculateInventory(txs);
}

describe("SCN-004 inventory-audit step pipeline", () => {
  it("uses 7-step audit flow without outbound steps", () => {
    const steps = getEffectiveM1Steps({ ...scn004Meta, completedSteps: [], transactions: [], inventory: {}, cycleCounts: [] });
    expect(steps.map((s) => s.code)).toEqual(SCN_004_M1_STEPS.map((s) => s.code));
    expect(steps.some((s) => s.code === "SO")).toBe(false);
    expect(steps.some((s) => s.code === "GI")).toBe(false);
    expect(steps.find((s) => s.code === "CC")?.prerequisite).toBe("STOCK");
    expect(steps.find((s) => s.code === "COMPLIANCE")?.prerequisite).toBe("ADJ");
  });

  it("blocks SO/PICKING/GI for SCN-004", () => {
    const state = {
      ...scn004Meta,
      completedSteps: ["PO", "GR", "PUTAWAY_M1", "STOCK"],
      transactions: auditPathTxs,
      inventory: invAfter(auditPathTxs),
      cycleCounts: [],
    };
    expect(canExecuteStep("SO", state).allowed).toBe(false);
    expect(canExecuteStep("PICKING_M1", state).allowed).toBe(false);
    expect(canExecuteStep("GI", state).allowed).toBe(false);
  });

  it("scoring budget redistributes outbound points to audit steps (100 total)", () => {
    const total = SCN_004_M1_STEPS.reduce((sum, s) => sum + getScn004StepMaxPoints(s.code), 0);
    expect(total).toBe(100);
  });
});

describe("SCN-004 cycle count target injection", () => {
  it("seed contract resolves system 200 / physical 185 / variance −15", () => {
    const target = getScn004CycleCountTarget(scn004Seed);
    expect(target.bin).toBe(SCN_004_TARGET_BIN);
    expect(target.physicalQty).toBe(SCN_004_PHYSICAL_QTY);
    expect(target.variance).toBe(SCN_004_VARIANCE);
    expect(target.systemQty).toBe(200);
  });

  it("injects pedagogical systemQty when live inventory is 200 after putaway", () => {
    const inv = invAfter(auditPathTxs);
    expect(inv["SKU-006::B-02-R1-L1"]).toBe(200);

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

  it("rejects CC at wrong bin REC-02", () => {
    const inv = invAfter(auditPathTxs);
    const check = validateM1CycleCountForScn004(
      { inventory: inv, scnCode: "SCN-004", scenarioInitialStateJson: scn004Seed },
      { sku: "SKU-006", bin: "REC-02" },
    );
    expect(check.allowed).toBe(false);
  });

  it("rejects ADJ at EXP-01", () => {
    const inv = invAfter(auditPathTxs);
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
    const inv = invAfter(auditPathTxs);
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
      ...auditPathTxs,
      { docType: "ADJ", sku: "SKU-006", bin: "B-02-R1-L1", qty: -15, posted: true },
    ];
    const afterAdj = invAfter(txs);
    const completed = ["PO", "GR", "PUTAWAY_M1", "STOCK", "CC", "ADJ"];
    const recovered = recoverScn004RunState({
      scnCode: "SCN-004",
      transactions: txs,
      cycleCounts: [{ ...cycleCount, resolved: true }],
      inventory: afterAdj,
    });
    expect(recovered.inventory["SKU-006::B-02-R1-L1"]).toBe(185);
    expect(recovered.inventory["SKU-006::REC-01"] ?? 0).toBe(0);
    expect(recovered.inventory["SKU-006::EXP-01"] ?? 0).toBe(0);

    const state = {
      ...scn004Meta,
      completedSteps: completed,
      transactions: recovered.transactions,
      inventory: recovered.inventory,
      cycleCounts: recovered.cycleCounts,
    };
    expect(checkCompliance(state).compliant).toBe(true);
    expect(canExecuteStep("COMPLIANCE", state).allowed).toBe(true);
  });

  it("isScn004Scenario resolves by scnCode or scenarioId", () => {
    expect(isScn004Scenario({ scnCode: "SCN-004" })).toBe(true);
    expect(isScn004Scenario({ scenarioId: 4 })).toBe(true);
    expect(isScn004Scenario({ scnCode: "SCN-005" })).toBe(false);
  });
});
