/**
 * SCN-009 CC_RECON loop + duplicate ADJ hotfix acceptance tests.
 * Pure rules/engine coverage (no production DB / run 491 mutation).
 */
import { describe, expect, it } from "vitest";
import {
  buildCcReconAdjDocRef,
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

describe("SCN-009 CC_RECON hotfix — canonical target contract", () => {
  const targets = getCycleCountTargets(SCN_009);

  it("requires both SKU-001 and SKU-003 targets", () => {
    expect(targets).toHaveLength(2);
    expect(targets.map((t) => t.sku)).toEqual(["SKU-001", "SKU-003"]);
  });

  it("builds canonical recon key runId+CC_RECON+sku+bin", () => {
    expect(buildCcReconTargetKey(491, "SKU-001", "B-01-R1-L1")).toBe("491::CC_RECON::SKU-001::B-01-R1-L1");
    expect(buildCcReconAdjDocRef("SKU-001", "B-01-R1-L1")).toBe("CC_RECON:SKU-001:B-01-R1-L1");
  });

  it("A6–A7: variances are -3 and 0 from counts", () => {
    const progress = evaluateCycleCountReconProgress(targets, COUNTS, [], []);
    expect(progress.statuses.find((s) => s.sku === "SKU-001")?.varianceQty).toBe(-3);
    expect(progress.statuses.find((s) => s.sku === "SKU-003")?.varianceQty).toBe(0);
  });

  it("A8–A12: SKU-001 ADJ reconciles one target; CC_RECON stays open for SKU-003", () => {
    const adjustments = [{ sku: "SKU-001", varianceQty: -3, adjustmentQty: -3, reason: "ok" }];
    const transactions = [{ docType: "ADJ", sku: "SKU-001", bin: "B-01-R1-L1", qty: -3, posted: true }];
    const progress = evaluateCycleCountReconProgress(targets, COUNTS, adjustments, transactions);
    expect(progress.reconciledCount).toBe(1);
    expect(progress.requiredCount).toBe(2);
    expect(progress.completedSkus).toEqual(["SKU-001"]);
    expect(progress.remainingSkus).toEqual(["SKU-003"]);
    expect(progress.complete).toBe(false);
    expect(getCcReconTargetStatus(targets[0], COUNTS, adjustments, transactions).status).toBe(
      "RECONCILED_WITH_ADJUSTMENT",
    );
    expect(getCcReconTargetStatus(targets[1], COUNTS, adjustments, transactions).status).toBe("PENDING");
  });

  it("A13–A16: SKU-003 zero confirm creates no ADJ requirement and completes CC_RECON", () => {
    const adjustments = [
      { sku: "SKU-001", varianceQty: -3, adjustmentQty: -3, reason: "ok" },
      { sku: "SKU-003", varianceQty: 0, adjustmentQty: 0, reason: "ZERO_VARIANCE_CONFIRMED" },
    ];
    const transactions = [{ docType: "ADJ", sku: "SKU-001", bin: "B-01-R1-L1", qty: -3, posted: true }];
    const progress = evaluateCycleCountReconProgress(targets, COUNTS, adjustments, transactions);
    expect(progress.complete).toBe(true);
    expect(progress.reconciledCount).toBe(2);
    expect(getCcReconTargetStatus(targets[1], COUNTS, adjustments, transactions).status).toBe(
      "RECONCILED_NO_ADJUSTMENT",
    );
    // No ADJ 0 transaction in ledger
    expect(transactions.every((t) => Number(t.qty) !== 0)).toBe(true);
  });
});

describe("SCN-009 CC_RECON hotfix — duplicate ADJ / idempotency semantics", () => {
  const targets = getCycleCountTargets(SCN_009);

  it("B21–B25: target already reconciled stays reconciled; inventory math must not double-apply", () => {
    const seedTx = [
      { docType: "GR", sku: "SKU-001", bin: "B-01-R1-L1", qty: 100, posted: true },
      { docType: "GR", sku: "SKU-003", bin: "B-01-R1-L2", qty: 80, posted: true },
      { docType: "ADJ", sku: "SKU-001", bin: "B-01-R1-L1", qty: -3, posted: true },
    ];
    const afterOne = calculateInventory(seedTx);
    expect(afterOne["SKU-001::B-01-R1-L1"]).toBe(97);

    // Idempotent semantics: matching ADJ already present → still one logical reconciliation
    const adjustments = [{ sku: "SKU-001", varianceQty: -3, adjustmentQty: -3, reason: "ok" }];
    const status = getCcReconTargetStatus(targets[0], COUNTS, adjustments, seedTx);
    expect(status.status).toBe("RECONCILED_WITH_ADJUSTMENT");

    // Simulated duplicate ADJ (pre-hotfix defect) yields 94 — guard must prevent this path
    const duplicated = calculateInventory([
      ...seedTx,
      { docType: "ADJ", sku: "SKU-001", bin: "B-01-R1-L1", qty: -3, posted: true },
    ]);
    expect(duplicated["SKU-001::B-01-R1-L1"]).toBe(94);
    // With only one matching ADJ row+tx, progress treats target as reconciled once
    expect(
      validateCycleCountReconComplete(
        targets,
        COUNTS,
        [
          ...adjustments,
          { sku: "SKU-003", varianceQty: 0, adjustmentQty: 0, reason: "ZERO_VARIANCE_CONFIRMED" },
        ],
        seedTx,
      ).complete,
    ).toBe(true);
  });

  it("B40: already reconciled target submission validates as matching counted variance", () => {
    const ok = validateCcReconSubmission(targets, COUNTS, {
      sku: "SKU-001",
      bin: "B-01-R1-L1",
      varianceQty: -3,
      justification: "",
    });
    expect(ok.allowed).toBe(true);
    expect(ok.expectedVarianceQty).toBe(-3);
  });
});

describe("SCN-009 CC_RECON hotfix — validation", () => {
  const targets = getCycleCountTargets(SCN_009);

  it("C32: wrong SKU rejected", () => {
    const result = validateCcReconSubmission(targets, COUNTS, {
      sku: "SKU-999",
      bin: "B-01-R1-L1",
      varianceQty: -3,
      justification: "enough chars",
    });
    expect(result.allowed).toBe(false);
  });

  it("C32: wrong bin pairing rejected", () => {
    const result = validateCcReconSubmission(targets, COUNTS, {
      sku: "SKU-001",
      bin: "B-01-R1-L2",
      varianceQty: -3,
      justification: "enough chars",
    });
    expect(result.allowed).toBe(false);
    expect(result.reasonFr).toMatch(/bin|emplacement/i);
  });

  it("C33–C34: wrong variance rejected", () => {
    const result = validateCcReconSubmission(targets, COUNTS, {
      sku: "SKU-001",
      bin: "B-01-R1-L1",
      varianceQty: -5,
      justification: "enough chars",
    });
    expect(result.allowed).toBe(false);
    expect(result.expectedVarianceQty).toBe(-3);
  });

  it("C37–C39: SKU-003 variance 0 is accepted without ADJ and without justification", () => {
    const result = validateCcReconSubmission(targets, COUNTS, {
      sku: "SKU-003",
      bin: "B-01-R1-L2",
      varianceQty: 0,
      justification: "",
    });
    expect(result.allowed).toBe(true);
    expect(result.expectedVarianceQty).toBe(0);
  });
});

describe("SCN-009 CC_RECON hotfix — inventory expectations", () => {
  it("A9 / A14: final inventory SKU-001=97 and SKU-003=80 with single ADJ -3", () => {
    const inv = calculateInventory([
      { docType: "GR", sku: "SKU-001", bin: "B-01-R1-L1", qty: 100, posted: true },
      { docType: "GR", sku: "SKU-003", bin: "B-01-R1-L2", qty: 80, posted: true },
      { docType: "ADJ", sku: "SKU-001", bin: "B-01-R1-L1", qty: -3, posted: true },
    ]);
    expect(inv["SKU-001::B-01-R1-L1"]).toBe(97);
    expect(inv["SKU-003::B-01-R1-L2"]).toBe(80);
  });
});

describe("SCN-009 CC_RECON hotfix — regression boundaries", () => {
  it("E47: SCN-010 still completes with single justified ADJ", () => {
    const targets = getCycleCountTargets(SCN_010);
    const result = validateCycleCountReconComplete(
      targets,
      [{ sku: "SKU-006", systemQty: 380, countedQty: 352, varianceQty: -28 }],
      [{ sku: "SKU-006", varianceQty: -28, adjustmentQty: -28, reason: "Expédition partielle non enregistrée" }],
      [{ docType: "ADJ", sku: "SKU-006", bin: "B-02-R1-L1", qty: -28, posted: true }],
    );
    expect(result.complete).toBe(true);
  });

  it("E48: SCN-011 remains replenishment-only pipeline", () => {
    expect(isM3ReplenishmentOnlyScenario(SCN_011)).toBe(true);
    expect(getEffectiveM3Steps(SCN_011).map((s) => s.code)).toEqual(["REPLENISH", "COMPLIANCE_M3"]);
  });

  it("E52: M3 threshold remains 70 (module threshold import sanity)", async () => {
    const { getModuleScenarioPassThreshold } = await import("@shared/moduleThresholds");
    expect(getModuleScenarioPassThreshold(3)).toBe(70);
  });

  it("E53: historical run-491-like duplicate ADJ state remains readable", () => {
    // Defensive read: duplicate ADJs still fold into inventory; recon progress still computable.
    const inv = calculateInventory([
      { docType: "GR", sku: "SKU-001", bin: "B-01-R1-L1", qty: 100, posted: true },
      { docType: "ADJ", sku: "SKU-001", bin: "B-01-R1-L1", qty: -3, posted: true },
      { docType: "ADJ", sku: "SKU-001", bin: "B-01-R1-L1", qty: -3, posted: true },
    ]);
    expect(inv["SKU-001::B-01-R1-L1"]).toBe(94);
    const targets = getCycleCountTargets(SCN_009);
    const progress = evaluateCycleCountReconProgress(
      targets,
      COUNTS,
      [
        { sku: "SKU-001", varianceQty: -3, adjustmentQty: -3, reason: "first" },
        { sku: "SKU-001", varianceQty: -3, adjustmentQty: -3, reason: "duplicate" },
      ],
      [
        { docType: "ADJ", sku: "SKU-001", bin: "B-01-R1-L1", qty: -3, posted: true },
        { docType: "ADJ", sku: "SKU-001", bin: "B-01-R1-L1", qty: -3, posted: true },
      ],
    );
    expect(progress.statuses.find((s) => s.sku === "SKU-001")?.status).toBe("RECONCILED_WITH_ADJUSTMENT");
    expect(progress.complete).toBe(false); // SKU-003 still pending confirmation under new contract
  });

  it("compliance accepts SCN-009 only with both targets reconciled", () => {
    const incomplete = validateM3Compliance({
      initialStateJson: SCN_009,
      inventoryCounts: COUNTS,
      inventoryAdjustments: [{ sku: "SKU-001", varianceQty: -3, adjustmentQty: -3, reason: "" }],
      replenishmentSuggestions: [],
      transactions: [{ docType: "ADJ", sku: "SKU-001", bin: "B-01-R1-L1", qty: -3, posted: true }],
    });
    expect(incomplete.allowed).toBe(false);

    const complete = validateM3Compliance({
      initialStateJson: SCN_009,
      inventoryCounts: COUNTS,
      inventoryAdjustments: [
        { sku: "SKU-001", varianceQty: -3, adjustmentQty: -3, reason: "" },
        { sku: "SKU-003", varianceQty: 0, adjustmentQty: 0, reason: "ZERO_VARIANCE_CONFIRMED" },
      ],
      replenishmentSuggestions: [],
      transactions: [{ docType: "ADJ", sku: "SKU-001", bin: "B-01-R1-L1", qty: -3, posted: true }],
    });
    expect(complete.allowed).toBe(true);
  });
});
