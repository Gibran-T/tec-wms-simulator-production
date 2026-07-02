import { describe, expect, it } from "vitest";
import {
  calculateInventory,
  canExecuteStep,
  checkCompliance,
  validateM1AdjPosting,
} from "./rulesEngine";

type Tx = { docType: string; sku: string; bin: string; qty: number; posted: boolean };

/** SCN-004 baseline: 200 GR → putaway → partial ship 15 → CC variance −15 at storage. */
const scn004BaseTxs: Tx[] = [
  { docType: "PO", sku: "SKU-006", bin: "REC-01", qty: 200, posted: true },
  { docType: "GR", sku: "SKU-006", bin: "REC-01", qty: 200, posted: true },
  { docType: "PUTAWAY_M1", sku: "SKU-006", bin: "REC-01", qty: -200, posted: true },
  { docType: "PUTAWAY_M1", sku: "SKU-006", bin: "B-02-R1-L1", qty: 200, posted: true },
  { docType: "PICKING", sku: "SKU-006", bin: "B-02-R1-L1", qty: -15, posted: true },
  { docType: "PICKING_M1", sku: "SKU-006", bin: "EXP-01", qty: 15, posted: true },
  { docType: "GI", sku: "SKU-006", bin: "EXP-01", qty: 15, posted: true },
];

const scn004CycleCount = {
  sku: "SKU-006",
  bin: "B-02-R1-L1",
  variance: -15,
  resolved: false,
  systemQty: 185,
  physicalQty: 170,
};

function invAfter(txs: Tx[]) {
  return calculateInventory(txs);
}

describe("RC17-D — SCN-004 SKU-006 inventory lifecycle trace", () => {
  it("1. initial inventory after GR: 200 at REC-01", () => {
    const inv = invAfter(scn004BaseTxs.slice(0, 2));
    expect(inv["SKU-006::REC-01"]).toBe(200);
  });

  it("2. inventory after putaway: 200 at B-02-R1-L1, REC-01 empty", () => {
    const inv = invAfter(scn004BaseTxs.slice(0, 4));
    expect(inv["SKU-006::B-02-R1-L1"]).toBe(200);
    expect(inv["SKU-006::REC-01"] ?? 0).toBe(0);
  });

  it("3. inventory after picking/GI: 185 storage, 0 expedition", () => {
    const inv = invAfter(scn004BaseTxs);
    expect(inv["SKU-006::B-02-R1-L1"]).toBe(185);
    expect(inv["SKU-006::EXP-01"] ?? 0).toBe(0);
  });

  it("4. cycle count variance −15: expected corrected stock = 170 at storage bin", () => {
    expect(scn004CycleCount.physicalQty).toBe(170);
    expect(scn004CycleCount.systemQty + scn004CycleCount.variance).toBe(170);
  });

  it("5. wrong ADJ at EXP-01 (−15) would create −15 — must be rejected", () => {
    const inv = invAfter(scn004BaseTxs);
    const result = validateM1AdjPosting(
      { inventory: inv, cycleCounts: [scn004CycleCount] },
      { sku: "SKU-006", bin: "EXP-01", qty: -15 },
    );
    expect(result.allowed).toBe(false);
    expect(result.reasonFr).toMatch(/EXP-01|négatif|comptage/i);
  });

  it("6. correct ADJ at B-02-R1-L1 (−15) brings stock to 170", () => {
    const inv = invAfter(scn004BaseTxs);
    const result = validateM1AdjPosting(
      { inventory: inv, cycleCounts: [scn004CycleCount] },
      { sku: "SKU-006", bin: "B-02-R1-L1", qty: -15 },
    );
    expect(result.allowed).toBe(true);

    const afterAdj = invAfter([
      ...scn004BaseTxs,
      { docType: "ADJ", sku: "SKU-006", bin: "B-02-R1-L1", qty: -15, posted: true },
    ]);
    expect(afterAdj["SKU-006::B-02-R1-L1"]).toBe(170);
    expect(afterAdj["SKU-006::EXP-01"] ?? 0).toBe(0);
    for (const qty of Object.values(afterAdj)) {
      expect(qty).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("RC17-D — compliance after ADJ", () => {
  const completed = ["PO", "GR", "PUTAWAY_M1", "STOCK", "SO", "PICKING_M1", "GI", "CC"];

  it("COMPLIANCE blocked before ADJ (unresolved variance)", () => {
    const inv = invAfter(scn004BaseTxs);
    const state = {
      completedSteps: completed,
      transactions: scn004BaseTxs.map((t) => ({ ...t, posted: t.posted })),
      inventory: inv,
      cycleCounts: [scn004CycleCount],
    };
    expect(canExecuteStep("COMPLIANCE", state).allowed).toBe(false);
    expect(checkCompliance(state).compliant).toBe(false);
  });

  it("COMPLIANCE GREEN after correct ADJ resolves variance", () => {
    const txs = [
      ...scn004BaseTxs,
      { docType: "ADJ", sku: "SKU-006", bin: "B-02-R1-L1", qty: -15, posted: true },
    ];
    const inv = invAfter(txs);
    const state = {
      completedSteps: [...completed, "ADJ"],
      transactions: txs.map((t) => ({ ...t, posted: t.posted })),
      inventory: inv,
      cycleCounts: [{ ...scn004CycleCount, resolved: true }],
    };
    expect(checkCompliance(state).compliant).toBe(true);
    expect(canExecuteStep("COMPLIANCE", state).allowed).toBe(true);
  });

  it("COMPLIANCE RED when ADJ posted at wrong bin creates negative stock", () => {
    const txs = [
      ...scn004BaseTxs,
      { docType: "ADJ", sku: "SKU-006", bin: "EXP-01", qty: -15, posted: true },
    ];
    const inv = invAfter(txs);
    const state = {
      completedSteps: [...completed, "ADJ"],
      transactions: txs.map((t) => ({ ...t, posted: t.posted })),
      inventory: inv,
      cycleCounts: [{ ...scn004CycleCount, resolved: true }],
    };
    expect(checkCompliance(state).compliant).toBe(false);
    expect(checkCompliance(state).issuesFr.some((i) => i.includes("Stock négatif"))).toBe(true);
  });

  it("COMPLIANCE RED when resolved variance but inventory not corrected", () => {
    const inv = invAfter(scn004BaseTxs); // still 185, no ADJ applied
    const state = {
      completedSteps: [...completed, "ADJ"],
      transactions: scn004BaseTxs.map((t) => ({ ...t, posted: t.posted })),
      inventory: inv,
      cycleCounts: [{ ...scn004CycleCount, resolved: true }],
    };
    const result = checkCompliance(state);
    expect(result.compliant).toBe(false);
    expect(result.issuesFr.some((i) => i.match(/physique corrigée|185/))).toBe(true);
  });
});

describe("RC17-D — validateM1AdjPosting guards", () => {
  const inv = invAfter(scn004BaseTxs);

  it("rejects ADJ qty that does not match variance", () => {
    const result = validateM1AdjPosting(
      { inventory: inv, cycleCounts: [scn004CycleCount] },
      { sku: "SKU-006", bin: "B-02-R1-L1", qty: -10 },
    );
    expect(result.allowed).toBe(false);
  });

  it("rejects ADJ without prior cycle count variance", () => {
    const result = validateM1AdjPosting(
      { inventory: inv, cycleCounts: [] },
      { sku: "SKU-006", bin: "B-02-R1-L1", qty: -15 },
    );
    expect(result.allowed).toBe(false);
  });

  it("accepts positive variance adjustment", () => {
    const cc = {
      sku: "SKU-001",
      bin: "B-01-R1-L1",
      variance: 5,
      resolved: false,
      systemQty: 100,
      physicalQty: 105,
    };
    const inventory = { "SKU-001::B-01-R1-L1": 100 };
    const result = validateM1AdjPosting(
      { inventory, cycleCounts: [cc] },
      { sku: "SKU-001", bin: "B-01-R1-L1", qty: 5 },
    );
    expect(result.allowed).toBe(true);
  });
});
