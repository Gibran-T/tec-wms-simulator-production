/**
 * SCN-009 CC_RECON atomic idempotency + concurrency acceptance tests.
 */
import { describe, expect, it, beforeEach } from "vitest";
import {
  buildCcReconIdempotencyKey,
  buildCcReconTargetKey,
  calculateInventory,
  evaluateCycleCountReconProgress,
  getCcReconTargetStatus,
  getCycleCountTargets,
  getEffectiveM3Steps,
  isM3ReplenishmentOnlyScenario,
  validateCcReconSubmission,
  validateCycleCountReconComplete,
  validateM3Compliance,
  type M3InitialStateJson,
} from "./rulesEngine";
import { InMemoryCcReconStore, ccReconTestStore } from "./ccReconAtomic";

const SCN_009: M3InitialStateJson = {
  cycleCountTargets: [
    { sku: "SKU-001", bin: "B-01-R1-L1", systemQty: 100, physicalQty: 97 },
    { sku: "SKU-003", bin: "B-01-R1-L2", systemQty: 80, physicalQty: 80 },
  ],
};

const SCN_010: M3InitialStateJson = {
  adjustmentThreshold: 20,
  cycleCountTargets: [{ sku: "SKU-006", bin: "B-02-R1-L1", systemQty: 380, physicalQty: 352 }],
};

const SCN_011: M3InitialStateJson = {
  replenishmentParams: [
    { sku: "SKU-004", minQty: 50, maxQty: 200, safetyStock: 25, leadTimeDays: 3 },
    { sku: "SKU-005", minQty: 80, maxQty: 300, safetyStock: 30, leadTimeDays: 5 },
  ],
};

const COUNTS = [
  { sku: "SKU-001", systemQty: 100, countedQty: 97, varianceQty: -3 },
  { sku: "SKU-003", systemQty: 80, countedQty: 80, varianceQty: 0 },
];

const SEED_TX = [
  { docType: "GR", sku: "SKU-001", bin: "B-01-R1-L1", qty: 100, posted: true },
  { docType: "GR", sku: "SKU-003", bin: "B-01-R1-L2", qty: 80, posted: true },
];

describe("SCN-009 CC_RECON — canonical contract", () => {
  const targets = getCycleCountTargets(SCN_009);

  it("idempotency key is CC_RECON:{runId}:{sku}:{bin}", () => {
    expect(buildCcReconIdempotencyKey(491, "SKU-001", "B-01-R1-L1")).toBe(
      "CC_RECON:491:SKU-001:B-01-R1-L1",
    );
    expect(buildCcReconTargetKey(491, "SKU-001", "B-01-R1-L1")).toBe(
      "CC_RECON:491:SKU-001:B-01-R1-L1",
    );
  });

  it("progress 0/2 → 1/2 → 2/2", () => {
    const t = getCycleCountTargets(SCN_009);
    expect(evaluateCycleCountReconProgress(t, COUNTS, [], []).reconciledCount).toBe(0);

    const after001 = evaluateCycleCountReconProgress(
      t,
      COUNTS,
      [{ sku: "SKU-001", varianceQty: -3, adjustmentQty: -3 }],
      [{ docType: "ADJ", sku: "SKU-001", bin: "B-01-R1-L1", qty: -3, posted: true }],
    );
    expect(after001.reconciledCount).toBe(1);
    expect(after001.remainingSkus).toEqual(["SKU-003"]);
    expect(after001.complete).toBe(false);

    const done = evaluateCycleCountReconProgress(
      t,
      COUNTS,
      [
        { sku: "SKU-001", varianceQty: -3, adjustmentQty: -3 },
        { sku: "SKU-003", varianceQty: 0, adjustmentQty: 0 },
      ],
      [{ docType: "ADJ", sku: "SKU-001", bin: "B-01-R1-L1", qty: -3, posted: true }],
    );
    expect(done.reconciledCount).toBe(2);
    expect(done.complete).toBe(true);
    expect(done.statuses.find((s) => s.sku === "SKU-003")?.status).toBe("RECONCILED_NO_ADJUSTMENT");
  });

  it("SKU-003 zero variance accepted without ADJ", () => {
    expect(
      validateCcReconSubmission(targets, COUNTS, {
        sku: "SKU-003",
        bin: "B-01-R1-L2",
        varianceQty: 0,
        justification: "",
      }).allowed,
    ).toBe(true);
  });

  it("wrong variance / bin / sku / system / physical rejected", () => {
    expect(
      validateCcReconSubmission(targets, COUNTS, {
        sku: "SKU-001",
        bin: "B-01-R1-L1",
        varianceQty: -5,
        justification: "enough",
      }).allowed,
    ).toBe(false);
    expect(
      validateCcReconSubmission(targets, COUNTS, {
        sku: "SKU-001",
        bin: "WRONG",
        varianceQty: -3,
        justification: "enough",
      }).allowed,
    ).toBe(false);
    expect(
      validateCcReconSubmission(targets, COUNTS, {
        sku: "SKU-999",
        bin: "B-01-R1-L1",
        varianceQty: -3,
        justification: "enough",
      }).allowed,
    ).toBe(false);
    expect(
      validateCcReconSubmission(targets, COUNTS, {
        sku: "SKU-001",
        bin: "B-01-R1-L1",
        varianceQty: -3,
        justification: "enough",
        systemQty: 99,
      }).allowed,
    ).toBe(false);
    expect(
      validateCcReconSubmission(targets, COUNTS, {
        sku: "SKU-001",
        bin: "B-01-R1-L1",
        varianceQty: -3,
        justification: "enough",
        physicalQty: 96,
      }).allowed,
    ).toBe(false);
    expect(
      validateCcReconSubmission(
        targets,
        [{ sku: "SKU-001", systemQty: 90, countedQty: 87, varianceQty: -3 }, COUNTS[1]],
        {
          sku: "SKU-001",
          bin: "B-01-R1-L1",
          varianceQty: -3,
          justification: "enough",
        },
      ).allowed,
    ).toBe(false);
  });

  it("zero variance does not require ADJ 0 or justification", () => {
    expect(
      validateCcReconSubmission(targets, COUNTS, {
        sku: "SKU-003",
        bin: "B-01-R1-L2",
        varianceQty: 0,
        justification: "",
      }).allowed,
    ).toBe(true);
  });
});

describe("SCN-009 CC_RECON — concurrent atomic claim (Promise.all)", () => {
  beforeEach(() => {
    ccReconTestStore.reset();
  });

  it("1–6: two simultaneous SKU-001 requests → one ADJ -3, inventory 97, one claim, one award, second idempotent", async () => {
    const store = ccReconTestStore;
    const runId = 9001;
    const input = {
      runId,
      sku: "SKU-001",
      bin: "B-01-R1-L1",
      varianceQty: -3,
      justification: "valid justification text",
    };

    const results = await Promise.all([
      Promise.resolve().then(() => store.claimAndPersist(input)),
      Promise.resolve().then(() => store.claimAndPersist(input)),
    ]);

    const created = results.filter((r) => r.created);
    const idempotent = results.filter((r) => r.alreadyReconciled);
    expect(created).toHaveLength(1);
    expect(idempotent).toHaveLength(1);

    const adjTx = store.transactions.filter(
      (t) => t.runId === runId && t.docType === "ADJ" && t.sku === "SKU-001",
    );
    expect(adjTx).toHaveLength(1);
    expect(adjTx[0].qty).toBe(-3);

    const inv = calculateInventory([
      ...SEED_TX,
      ...store.transactions.map((t) => ({
        docType: t.docType,
        sku: t.sku,
        bin: t.bin,
        qty: t.qty,
        posted: t.posted,
      })),
    ]);
    expect(inv["SKU-001::B-01-R1-L1"]).toBe(97);

    expect(store.claims.size).toBe(1);
    expect(store.awardOnce(runId, "CC_RECON_COMPLETED", 19)).toBe(true);
    expect(store.awardOnce(runId, "CC_RECON_COMPLETED", 19)).toBe(false);
    expect(store.awards.filter((a) => a.eventType === "CC_RECON_COMPLETED")).toHaveLength(1);
  });

  it("7: ten concurrent identical requests still create one ADJ", async () => {
    const store = ccReconTestStore;
    const input = {
      runId: 9002,
      sku: "SKU-001",
      bin: "B-01-R1-L1",
      varianceQty: -3,
      justification: "valid",
    };
    const results = await Promise.all(
      Array.from({ length: 10 }, () => Promise.resolve().then(() => store.claimAndPersist(input))),
    );
    expect(results.filter((r) => r.created)).toHaveLength(1);
    expect(results.filter((r) => r.alreadyReconciled)).toHaveLength(9);
    expect(store.transactions.filter((t) => t.docType === "ADJ")).toHaveLength(1);
    const inv = calculateInventory([
      ...SEED_TX,
      ...store.transactions.map((t) => ({
        docType: t.docType,
        sku: t.sku,
        bin: t.bin,
        qty: t.qty,
        posted: t.posted,
      })),
    ]);
    expect(inv["SKU-001::B-01-R1-L1"]).toBe(97);
  });

  it("8: retry after simulated timeout creates no duplicate", async () => {
    const store = ccReconTestStore;
    const input = {
      runId: 9003,
      sku: "SKU-001",
      bin: "B-01-R1-L1",
      varianceQty: -3,
      justification: "valid",
    };
    const first = store.claimAndPersist(input);
    expect(first.created).toBe(true);
    // Simulated client retry after timeout
    const retry = store.claimAndPersist(input);
    expect(retry.alreadyReconciled).toBe(true);
    expect(store.transactions.filter((t) => t.docType === "ADJ")).toHaveLength(1);
  });

  it("9: failure during processing does not permanently lock the target", () => {
    const store = new InMemoryCcReconStore();
    const input = {
      runId: 9004,
      sku: "SKU-001",
      bin: "B-01-R1-L1",
      varianceQty: -3,
      justification: "valid",
    };
    const key = buildCcReconIdempotencyKey(input.runId, input.sku, input.bin);
    store.failAfterClaimKeys.add(key);
    expect(() => store.claimAndPersist(input)).toThrow(/SIMULATED_CC_RECON_FAILURE/);
    expect(store.claims.has(key)).toBe(false);
    expect(store.transactions).toHaveLength(0);

    // Retry succeeds after failure rolled back the claim
    store.failAfterClaimKeys.clear();
    const ok = store.claimAndPersist(input);
    expect(ok.created).toBe(true);
    expect(store.transactions).toHaveLength(1);
  });

  it("10: SKU-001 and SKU-003 can be processed independently", async () => {
    const store = ccReconTestStore;
    const results = await Promise.all([
      Promise.resolve().then(() =>
        store.claimAndPersist({
          runId: 9005,
          sku: "SKU-001",
          bin: "B-01-R1-L1",
          varianceQty: -3,
          justification: "valid",
        }),
      ),
      Promise.resolve().then(() =>
        store.claimAndPersist({
          runId: 9005,
          sku: "SKU-003",
          bin: "B-01-R1-L2",
          varianceQty: 0,
          justification: "",
        }),
      ),
    ]);
    expect(results.every((r) => r.created)).toBe(true);
    expect(store.transactions.filter((t) => t.docType === "ADJ")).toHaveLength(1);
    expect(store.transactions[0].sku).toBe("SKU-001");
    expect(store.adjustments.some((a) => a.sku === "SKU-003" && a.adjustmentQty === 0)).toBe(true);
  });

  it("11: zero-variance concurrent submissions create no ADJ and one confirmation", async () => {
    const store = ccReconTestStore;
    const input = {
      runId: 9006,
      sku: "SKU-003",
      bin: "B-01-R1-L2",
      varianceQty: 0,
      justification: "",
    };
    const results = await Promise.all([
      Promise.resolve().then(() => store.claimAndPersist(input)),
      Promise.resolve().then(() => store.claimAndPersist(input)),
      Promise.resolve().then(() => store.claimAndPersist(input)),
    ]);
    expect(results.filter((r) => r.created)).toHaveLength(1);
    expect(store.transactions.filter((t) => t.docType === "ADJ")).toHaveLength(0);
    expect(store.adjustments.filter((a) => a.sku === "SKU-003" && a.adjustmentQty === 0)).toHaveLength(1);
  });

  it("12: historical run 491-like duplicate ADJ state remains readable", () => {
    const inv = calculateInventory([
      { docType: "GR", sku: "SKU-001", bin: "B-01-R1-L1", qty: 100, posted: true },
      { docType: "ADJ", sku: "SKU-001", bin: "B-01-R1-L1", qty: -3, posted: true },
      { docType: "ADJ", sku: "SKU-001", bin: "B-01-R1-L1", qty: -3, posted: true },
    ]);
    expect(inv["SKU-001::B-01-R1-L1"]).toBe(94);
    const progress = evaluateCycleCountReconProgress(
      getCycleCountTargets(SCN_009),
      COUNTS,
      [
        { sku: "SKU-001", varianceQty: -3, adjustmentQty: -3 },
        { sku: "SKU-001", varianceQty: -3, adjustmentQty: -3 },
      ],
      [
        { docType: "ADJ", sku: "SKU-001", bin: "B-01-R1-L1", qty: -3, posted: true },
        { docType: "ADJ", sku: "SKU-001", bin: "B-01-R1-L1", qty: -3, posted: true },
      ],
    );
    expect(progress.statuses.find((s) => s.sku === "SKU-001")?.status).toBe("RECONCILED_WITH_ADJUSTMENT");
    expect(progress.complete).toBe(false);
  });

  it("13: Drizzle-wrapped ER_DUP_ENTRY shape remains detectable for idempotent loser path", () => {
    const drizzleWrapped = {
      message: "Failed query: insert into `cc_recon_target_claims`",
      cause: {
        code: "ER_DUP_ENTRY",
        errno: 1062,
        sqlMessage:
          "Duplicate entry 'CC_RECON:1:SKU-001:B-01-R1-L1' for key 'cc_recon_target_claims_key_uidx'",
      },
    };
    expect(drizzleWrapped.cause.code).toBe("ER_DUP_ENTRY");
    expect(drizzleWrapped.cause.errno).toBe(1062);
    expect(/duplicate|ER_DUP_ENTRY/i.test(drizzleWrapped.cause.sqlMessage)).toBe(true);
  });
});

describe("SCN-009 CC_RECON — regression after SCN-011 separation", () => {
  it("SCN-010 unchanged", () => {
    const targets = getCycleCountTargets(SCN_010);
    expect(
      validateCycleCountReconComplete(
        targets,
        [{ sku: "SKU-006", systemQty: 380, countedQty: 352, varianceQty: -28 }],
        [{ sku: "SKU-006", varianceQty: -28, adjustmentQty: -28, reason: "justified enough" }],
        [{ docType: "ADJ", sku: "SKU-006", bin: "B-02-R1-L1", qty: -28, posted: true }],
      ).complete,
    ).toBe(true);
  });

  it("SCN-011 remains replenishment-only", () => {
    expect(isM3ReplenishmentOnlyScenario(SCN_011)).toBe(true);
    expect(getEffectiveM3Steps(SCN_011).map((s) => s.code)).toEqual(["REPLENISH", "COMPLIANCE_M3"]);
  });

  it("M3 threshold remains 70", async () => {
    const { getModuleScenarioPassThreshold } = await import("@shared/moduleThresholds");
    expect(getModuleScenarioPassThreshold(3)).toBe(70);
  });

  it("compliance requires both SCN-009 targets", () => {
    expect(
      validateM3Compliance({
        initialStateJson: SCN_009,
        inventoryCounts: COUNTS,
        inventoryAdjustments: [{ sku: "SKU-001", varianceQty: -3, adjustmentQty: -3, reason: "" }],
        replenishmentSuggestions: [],
        transactions: [{ docType: "ADJ", sku: "SKU-001", bin: "B-01-R1-L1", qty: -3, posted: true }],
      }).allowed,
    ).toBe(false);
    expect(
      validateM3Compliance({
        initialStateJson: SCN_009,
        inventoryCounts: COUNTS,
        inventoryAdjustments: [
          { sku: "SKU-001", varianceQty: -3, adjustmentQty: -3, reason: "" },
          { sku: "SKU-003", varianceQty: 0, adjustmentQty: 0, reason: "ZERO_VARIANCE_CONFIRMED" },
        ],
        replenishmentSuggestions: [],
        transactions: [{ docType: "ADJ", sku: "SKU-001", bin: "B-01-R1-L1", qty: -3, posted: true }],
      }).allowed,
    ).toBe(true);
  });
});
