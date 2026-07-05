import { describe, expect, it } from "vitest";
import {
  calculateInventory,
  canExecuteStep,
  checkCompliance,
  validateM1AdjPosting,
} from "./rulesEngine";
import {
  recoverScn004RunState,
  SCN_004_PHYSICAL_QTY,
  SCN_004_TARGET_BIN,
  SCN_004_VARIANCE,
  validateM1CycleCountForScn004,
} from "./scn004";

type Tx = { docType: string; sku: string; bin: string; qty: number; posted: boolean };

/** SCN-004 canonical happy path: 200 GR → putaway → CC −15 at B-02-R1-L1. */
const scn004HappyPathTxs: Tx[] = [
  { docType: "PO", sku: "SKU-006", bin: "REC-01", qty: 200, posted: true },
  { docType: "GR", sku: "SKU-006", bin: "REC-01", qty: 200, posted: true },
  { docType: "PUTAWAY_M1", sku: "SKU-006", bin: "REC-01", qty: -200, posted: true },
  { docType: "PUTAWAY_M1", sku: "SKU-006", bin: "B-02-R1-L1", qty: 200, posted: true },
];

/** Optional partial ship — stock at CC is still 200 if no pick/GI before count. */
const scn004WithShipTxs: Tx[] = [
  ...scn004HappyPathTxs,
  { docType: "PICKING", sku: "SKU-006", bin: "B-02-R1-L1", qty: -15, posted: true },
  { docType: "PICKING_M1", sku: "SKU-006", bin: "EXP-01", qty: 15, posted: true },
  { docType: "GI", sku: "SKU-006", bin: "EXP-01", qty: 15, posted: true },
];

const scn004CycleCount = {
  sku: "SKU-006",
  bin: "B-02-R1-L1",
  variance: SCN_004_VARIANCE,
  resolved: false,
  systemQty: 200,
  physicalQty: SCN_004_PHYSICAL_QTY,
};

function invAfter(txs: Tx[]) {
  return calculateInventory(txs);
}

describe("RC17-D — SCN-004 happy path (physicalQty 185 → ADJ −15)", () => {
  it("1. inventory after putaway: 200 at B-02-R1-L1", () => {
    const inv = invAfter(scn004HappyPathTxs);
    expect(inv["SKU-006::B-02-R1-L1"]).toBe(200);
    expect(inv["SKU-006::REC-01"] ?? 0).toBe(0);
  });

  it("2. cycle count variance −15 targets B-02-R1-L1 only", () => {
    expect(scn004CycleCount.bin).toBe(SCN_004_TARGET_BIN);
    expect(scn004CycleCount.physicalQty).toBe(185);
    expect(scn004CycleCount.systemQty + scn004CycleCount.variance).toBe(185);
  });

  it("3. rejects CC at REC-02 (wrong bin)", () => {
    const inv = invAfter(scn004HappyPathTxs);
    const result = validateM1CycleCountForScn004(
      { inventory: inv, scnCode: "SCN-004" },
      { sku: "SKU-006", bin: "REC-02" },
    );
    expect(result.allowed).toBe(false);
    expect(result.reasonFr).toMatch(/B-02-R1-L1/);
  });

  it("4. rejects ADJ at EXP-01 (−15 would create negative stock)", () => {
    const inv = invAfter(scn004HappyPathTxs);
    const result = validateM1AdjPosting(
      { inventory: inv, cycleCounts: [scn004CycleCount] },
      { sku: "SKU-006", bin: "EXP-01", qty: -15 },
    );
    expect(result.allowed).toBe(false);
    expect(result.reasonFr).toMatch(/EXP-01|EXPÉDITION|comptage/i);
  });

  it("5. correct ADJ at B-02-R1-L1 (−15) brings stock to 185", () => {
    const inv = invAfter(scn004HappyPathTxs);
    const result = validateM1AdjPosting(
      { inventory: inv, cycleCounts: [scn004CycleCount] },
      { sku: "SKU-006", bin: "B-02-R1-L1", qty: -15 },
    );
    expect(result.allowed).toBe(true);

    const afterAdj = invAfter([
      ...scn004HappyPathTxs,
      { docType: "ADJ", sku: "SKU-006", bin: "B-02-R1-L1", qty: -15, posted: true },
    ]);
    expect(afterAdj["SKU-006::B-02-R1-L1"]).toBe(185);
    expect(afterAdj["SKU-006::EXP-01"] ?? 0).toBe(0);
    for (const qty of Object.values(afterAdj)) {
      expect(qty).toBeGreaterThanOrEqual(0);
    }
  });

  it("6. after partial ship EXP-01 stays at 0", () => {
    const inv = invAfter(scn004WithShipTxs);
    expect(inv["SKU-006::EXP-01"] ?? 0).toBe(0);
    expect(inv["SKU-006::B-02-R1-L1"]).toBe(185);
  });
});

describe("RC17-D — compliance after ADJ", () => {
  const completed = ["PO", "GR", "PUTAWAY_M1", "STOCK", "SO", "PICKING_M1", "GI", "CC"];

  it("COMPLIANCE blocked before ADJ (unresolved variance)", () => {
    const inv = invAfter(scn004HappyPathTxs);
    const state = {
      completedSteps: completed,
      transactions: scn004HappyPathTxs.map((t) => ({ ...t, posted: t.posted })),
      inventory: inv,
      cycleCounts: [scn004CycleCount],
    };
    expect(canExecuteStep("COMPLIANCE", state).allowed).toBe(false);
    expect(checkCompliance(state).compliant).toBe(false);
  });

  it("COMPLIANCE GREEN after correct ADJ resolves variance to 185", () => {
    const txs = [
      ...scn004HappyPathTxs,
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
    expect(inv["SKU-006::B-02-R1-L1"]).toBe(185);
  });

  it("COMPLIANCE RED when ADJ posted at wrong bin creates negative EXP-01", () => {
    const txs = [
      ...scn004HappyPathTxs,
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

  it("COMPLIANCE uses configured target bin only (not REC-02)", () => {
    const inv = invAfter(scn004HappyPathTxs);
    const state = {
      completedSteps: [...completed, "ADJ"],
      transactions: scn004HappyPathTxs.map((t) => ({ ...t, posted: t.posted })),
      inventory: inv,
      cycleCounts: [{
        sku: "SKU-006",
        bin: "REC-02",
        variance: -15,
        resolved: true,
        systemQty: 200,
        physicalQty: 185,
      }],
    };
    const result = checkCompliance(state);
    expect(result.compliant).toBe(false);
    expect(result.issuesFr.some((i) => i.includes("REC-02"))).toBe(true);
  });
});

describe("RC17-D — recoverScn004RunState (broken run 132 pattern)", () => {
  const brokenTxs: Tx[] = [
    ...scn004HappyPathTxs,
    { docType: "ADJ", sku: "SKU-006", bin: "EXP-01", qty: -15, posted: true },
  ];

  it("recovers when storage bin stock was never posted (inventory 0)", () => {
    const recovered = recoverScn004RunState({
      scnCode: "SCN-004",
      transactions: [
        { docType: "ADJ", sku: "SKU-006", bin: "EXP-01", qty: -15, posted: true },
      ],
      cycleCounts: [{
        sku: "SKU-006",
        bin: "REC-02",
        variance: -15,
        resolved: true,
        systemQty: 200,
        physicalQty: 185,
      }],
      inventory: { "SKU-006::EXP-01": -15 },
    });
    expect(recovered.inventory["SKU-006::B-02-R1-L1"]).toBe(185);
    expect(recovered.inventory["SKU-006::EXP-01"] ?? 0).toBe(0);
  });

  it("recovers from ADJ-AUTO at EXP-01 and wrong CC bin REC-02", () => {
    const rawInv = invAfter(brokenTxs);
    expect(rawInv["SKU-006::EXP-01"]).toBe(-15);

    const recovered = recoverScn004RunState({
      scnCode: "SCN-004",
      transactions: brokenTxs,
      cycleCounts: [{
        sku: "SKU-006",
        bin: "REC-02",
        variance: -15,
        resolved: true,
        systemQty: 200,
        physicalQty: 185,
      }],
      inventory: rawInv,
    });

    expect(recovered.inventory["SKU-006::EXP-01"] ?? 0).toBe(0);
    expect(recovered.inventory["SKU-006::B-02-R1-L1"]).toBe(185);
    expect(recovered.cycleCounts[0].bin).toBe("B-02-R1-L1");

    const compliance = checkCompliance({
      completedSteps: ["PO", "GR", "PUTAWAY_M1", "STOCK", "SO", "PICKING_M1", "GI", "CC", "ADJ"],
      transactions: recovered.transactions as any,
      inventory: recovered.inventory,
      cycleCounts: recovered.cycleCounts,
    });
    expect(compliance.compliant).toBe(true);
  });

  it("ignores bad expedition ADJ in recovered transaction list", () => {
    const recovered = recoverScn004RunState({
      scnCode: "SCN-004",
      transactions: brokenTxs,
      cycleCounts: [{ ...scn004CycleCount, resolved: true }],
      inventory: invAfter(brokenTxs),
    });
    const badAdj = recovered.transactions.filter(
      (t) => t.docType === "ADJ" && t.bin === "EXP-01",
    );
    expect(badAdj).toHaveLength(0);
  });
});

describe("RC17-D — validateM1AdjPosting guards", () => {
  const inv = invAfter(scn004HappyPathTxs);

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
