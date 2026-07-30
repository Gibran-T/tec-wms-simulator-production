import { describe, expect, it } from "vitest";
import {
  computeInventoryAccuracy,
  countM5SessionEvidenceCitations,
  deriveM5SessionEvidenceV1,
  isM4PortfolioOnlyEvidence,
  isM5SessionEvidenceV1,
  M5_LEGACY_PORTFOLIO_MARKERS,
  M5_SESSION_JOURNEY_COMPLETION_SPEC,
  resolveCorrectedSystemQty,
  type M5SessionEvidenceV1,
} from "./m5SessionEvidence";

const SCN016_BASE = {
  completedSteps: [
    "M5_RECEPTION",
    "M5_PUTAWAY",
    "M5_CYCLE_COUNT",
    "M5_ADJ",
    "M5_REPLENISH",
  ],
  effectiveStepCodes: [
    "M5_RECEPTION",
    "M5_PUTAWAY",
    "M5_CYCLE_COUNT",
    "M5_ADJ",
    "M5_REPLENISH",
    "M5_KPI",
    "M5_DECISION",
    "COMPLIANCE_M5",
  ],
  inventoryCounts: [{ sku: "SKU-001", systemQty: 50, countedQty: 45, varianceQty: -5 }],
  inventory: { "SKU-001::B-01-R1-L1": 45 },
  replenishmentQty: 0,
  contractSku: "SKU-001",
};

describe("M5SessionEvidenceV1 derivation", () => {
  it("SCN-015 nominal: 50/50/50, variance 0, accuracy 100/100, stock 50, Q 0, no adjustment", () => {
    const effective = [
      "M5_RECEPTION",
      "M5_PUTAWAY",
      "M5_CYCLE_COUNT",
      "M5_REPLENISH",
      "M5_KPI",
      "M5_DECISION",
      "COMPLIANCE_M5",
    ];
    const evidence = deriveM5SessionEvidenceV1({
      completedSteps: [...effective],
      effectiveStepCodes: effective,
      inventoryCounts: [{ sku: "SKU-001", systemQty: 50, countedQty: 50, varianceQty: 0 }],
      inventoryAdjustments: [],
      transactions: [
        { docType: "GR", sku: "SKU-001", qty: 50, posted: true },
        { docType: "PUTAWAY", sku: "SKU-001", qty: 50, posted: true },
      ],
      inventory: { "SKU-001::B-01-R1-L1": 50 },
      replenishmentQty: 0,
      varianceResolved: true,
      stockQtyAtBin: 50,
      contractSku: "SKU-001",
      contractToBin: "B-01-R1-L1",
      complianceOk: true,
    });

    expect(evidence.evidenceVersion).toBe("m5-session-v1");
    expect(evidence.varianceInitialQty).toBe(0);
    expect(evidence.correctedStockQty).toBeUndefined();
    expect(evidence.finalStockQty).toBe(50);
    expect(evidence.replenishmentQty).toBe(0);
    expect(evidence.inventoryAccuracyBefore).toBe(1);
    expect(evidence.inventoryAccuracyAfter).toBe(1);
    expect(evidence.unresolvedIssueCount).toBe(0);
    expect(evidence.finalComplianceStatus).toBe("OK");
    expect(evidence.sessionJourneyCompletionRate).toBe(1);
  });

  it("SCN-016: system 50, physical 45 → accuracy before 90%, after 100%, adj −5", () => {
    expect(computeInventoryAccuracy(50, 45)).toBe(0.9);

    const evidence = deriveM5SessionEvidenceV1({
      ...SCN016_BASE,
      inventoryAdjustments: [{ sku: "SKU-001", varianceQty: -5, adjustmentQty: -5 }],
      transactions: [{ docType: "ADJ", sku: "SKU-001", qty: -5, posted: true }],
      varianceResolved: true,
      stockQtyAtBin: 45,
    });

    expect(evidence.evidenceVersion).toBe("m5-session-v1");
    expect(evidence.varianceInitialQty).toBe(-5);
    expect(evidence.varianceResolved).toBe(true);
    expect(evidence.correctedStockQty).toBe(45);
    expect(evidence.correctedStockQty).not.toBe(50);
    expect(evidence.finalStockQty).toBe(45);
    expect(evidence.replenishmentQty).toBe(0);
    expect(evidence.inventoryAccuracyBefore).toBe(0.9);
    expect(evidence.inventoryAccuracyAfter).toBe(1);
    expect(evidence.sessionJourneyCompletionRate).toBe(0.625); // 5/8
    expect(evidence.executionCompletionRate).toBe(evidence.sessionJourneyCompletionRate);
    expect(evidence.priorityOrderCompleted).toBeUndefined();
    expect(evidence.sessionOtif).toBeUndefined();
    expect(M5_SESSION_JOURNEY_COMPLETION_SPEC.includesAnalyticalSteps).toBe(true);
  });

  it("does not force accuracyAfter=1 merely because varianceResolved=true", () => {
    // Wrong adjustment qty (−2) leaves system at 48 vs physical 45
    const evidence = deriveM5SessionEvidenceV1({
      ...SCN016_BASE,
      inventoryAdjustments: [{ sku: "SKU-001", varianceQty: -5, adjustmentQty: -2 }],
      transactions: [{ docType: "ADJ", sku: "SKU-001", qty: -2, posted: true }],
      varianceResolved: true, // incorrectly marked resolved
      stockQtyAtBin: 48,
    });
    expect(evidence.correctedStockQty).toBe(48);
    expect(evidence.correctedStockQty).not.toBe(45); // not a countedQty alias
    expect(evidence.inventoryAccuracyAfter).toBe(computeInventoryAccuracy(48, 45));
    expect(evidence.inventoryAccuracyAfter).toBeLessThan(1);
  });

  it("negative: ADJ posted but wrong quantity → accuracy after < 100%", () => {
    const evidence = deriveM5SessionEvidenceV1({
      ...SCN016_BASE,
      inventoryAdjustments: [{ sku: "SKU-001", varianceQty: -1, adjustmentQty: -1 }],
      transactions: [{ docType: "ADJ", sku: "SKU-001", qty: -1, posted: true }],
      varianceResolved: false,
      stockQtyAtBin: 49,
    });
    expect(evidence.correctedStockQty).toBe(49);
    expect(evidence.inventoryAccuracyAfter).toBe(computeInventoryAccuracy(49, 45));
    expect(evidence.inventoryAccuracyAfter).toBeLessThan(1);
  });

  it("negative: varianceResolved true but system still differs from physical", () => {
    // Claimed resolved but ledger still at 50 (no real correction applied)
    const evidence = deriveM5SessionEvidenceV1({
      ...SCN016_BASE,
      inventoryAdjustments: [],
      transactions: [],
      varianceResolved: true,
      stockQtyAtBin: 50,
    });
    expect(evidence.correctedStockQty).toBe(50);
    expect(evidence.inventoryAccuracyAfter).toBe(0.9);
    expect(evidence.inventoryAccuracyAfter).not.toBe(1);

    const stillWrong = deriveM5SessionEvidenceV1({
      ...SCN016_BASE,
      inventoryAdjustments: [{ sku: "SKU-001", varianceQty: -5, adjustmentQty: 0 }],
      transactions: [{ docType: "ADJ", sku: "SKU-001", qty: 0, posted: true }],
      varianceResolved: true,
      stockQtyAtBin: 50,
    });
    expect(stillWrong.correctedStockQty).toBe(50);
    expect(stillWrong.inventoryAccuracyAfter).toBe(0.9);
  });

  it("resolveCorrectedSystemQty never returns countedQty as a bare alias", () => {
    expect(
      resolveCorrectedSystemQty({
        systemQty: 50,
        countedQty: 45,
        stockQtyAtBin: 48,
        varianceResolved: true,
        adjustmentQty: -2,
        hasPostedAdj: true,
      }),
    ).toBe(48);
  });

  it("type guard rejects legacy kpi snapshot shapes", () => {
    expect(isM5SessionEvidenceV1({ evidenceVersion: "m5-session-v1" })).toBe(true);
    expect(
      isM5SessionEvidenceV1({
        rotationRate: 6,
        serviceLevel: 0.95,
        errorRate: 0.04,
      }),
    ).toBe(false);
  });

  it("omits unsupported fields instead of fabricating zeros or portfolio values", () => {
    const evidence = deriveM5SessionEvidenceV1({
      completedSteps: [],
      effectiveStepCodes: ["M5_RECEPTION"],
      inventoryCounts: [],
      inventoryAdjustments: [],
      transactions: [],
      inventory: {},
      varianceResolved: true,
      stockQtyAtBin: 0,
    });
    expect(evidence.sessionOtif).toBeUndefined();
    expect(evidence.priorityOrderCompleted).toBeUndefined();
    expect(Object.values(M5_LEGACY_PORTFOLIO_MARKERS)).not.toContain(evidence.finalStockQty);
  });
});

describe("SCN-017 session evidence citations", () => {
  const scn016Evidence: M5SessionEvidenceV1 = {
    evidenceVersion: "m5-session-v1",
    varianceInitialQty: -5,
    varianceResolved: true,
    correctedStockQty: 45,
    finalStockQty: 45,
    replenishmentQty: 0,
    inventoryAccuracyBefore: 0.9,
    inventoryAccuracyAfter: 1,
    sessionJourneyCompletionRate: 0.875,
    executionCompletionRate: 0.875,
  };

  it("requires at least three valid session evidence references", () => {
    const weak = countM5SessionEvidenceCitations("Je recommande un plan. Horizon 90 jours.", scn016Evidence);
    expect(weak.count).toBeLessThan(3);

    const strong = countM5SessionEvidenceCitations(
      "Variance -5 reconciliee. Stock corrige 45. Exactitude avant 90% apres 100%. Q = 0. Priorite fiabilite. Compromis: maintenir stock. Horizon prochain quart. Je recommande un suivi.",
      scn016Evidence,
    );
    expect(strong.count).toBeGreaterThanOrEqual(3);
  });

  it("detects M4 portfolio-only evidence", () => {
    expect(
      isM4PortfolioOnlyEvidence(
        "Rotation 6 service 95 erreurs 4. Trade-off. Horizon 90. Je recommande.",
        0,
      ),
    ).toBe(true);
    expect(
      isM4PortfolioOnlyEvidence(
        "Variance -5 stock corrige 45 Q=0. Trade-off. Horizon 7 jours. Je recommande.",
        3,
      ),
    ).toBe(false);
  });
});
