/**
 * M5 session evidence contract (v1).
 *
 * Canonical seed defines the initial problem.
 * Session results are derived only from run events.
 * Unsupported fields are omitted — never fabricated from M4 portfolio seed.
 *
 * LEGACY NOTE: MySQL `kpi_snapshots` (rotation/service/error/lead/stock$) is a separate
 * historical artifact used only for Gold row-existence checks. It is NOT m5-session-v1.
 * Never treat kpi_snapshots columns as session evidence.
 */

export const M5_SESSION_EVIDENCE_VERSION = "m5-session-v1" as const;

/**
 * Journey completion over the effective simulator step list (including KPI/DECISION/COMPLIANCE
 * and conditional ADJ). Not an "operational execution rate" of warehouse moves alone.
 * Student-facing label: « Taux de complétion du parcours ».
 */
export type M5SessionEvidenceV1 = {
  evidenceVersion: typeof M5_SESSION_EVIDENCE_VERSION;
  /**
   * completedSteps ∩ effectiveStepCodes / |effectiveStepCodes|
   * Denominator = getEffectiveM5Steps (ADJ included only when variance path applies).
   * Numerator = distinct completed step codes present in that list (retries do not double-count).
   */
  sessionJourneyCompletionRate?: number;
  /** @deprecated Alias of sessionJourneyCompletionRate — kept for transitional clients. */
  executionCompletionRate?: number;
  /** Simulator-session elapsed time only — not operational warehouse cycle time. */
  cycleTimeMinutes?: number;
  inventoryAccuracyBefore?: number;
  varianceInitialQty?: number;
  varianceResolved?: boolean;
  inventoryAccuracyAfter?: number;
  /** Post-adjustment system/ledger quantity — not a raw alias of countedQty. */
  correctedStockQty?: number;
  finalStockQty?: number;
  replenishmentQty?: number;
  finalComplianceStatus?: "OK" | "NOT_OK";
  unresolvedIssueCount?: number;
  /** Omitted until SCN-015 priority fulfillment exists. */
  priorityOrderCompleted?: boolean;
  /** Omitted until rework events exist. */
  firstPassYield?: number;
  /** Omitted until rework events exist. */
  reworkCount?: number;
  /** Omitted until open-order backlog exists. */
  finalBacklog?: number;
  /** Omitted until session order timestamps exist — never seeded OTIF. */
  sessionOtif?: number;
};

/** Legacy M4 portfolio markers — never treat as M5 session evidence. */
export const M5_LEGACY_PORTFOLIO_MARKERS = {
  rotationRate: 6,
  serviceLevel: 0.95,
  errorRate: 0.04,
  averageLeadTime: 3.5,
  stockImmobilizedValue: 48000,
} as const;

export type M5SessionEvidenceSourceInput = {
  completedSteps: string[];
  effectiveStepCodes: string[];
  inventoryCounts: Array<{
    sku: string;
    systemQty?: number;
    countedQty?: number;
    varianceQty?: number;
  }>;
  inventoryAdjustments: Array<{
    sku: string;
    varianceQty: number;
    adjustmentQty?: number;
  }>;
  transactions: Array<{
    docType: string;
    sku: string;
    qty?: number;
    posted: boolean;
  }>;
  inventory: Record<string, number>;
  replenishmentQty?: number | null;
  varianceResolved: boolean;
  stockQtyAtBin: number;
  contractSku?: string;
  contractToBin?: string;
  /** Optional run wall-clock bounds (simulator elapsed only). */
  runStartedAt?: Date | string | null;
  runCompletedAt?: Date | string | null;
  complianceOk?: boolean | null;
};

/**
 * Inventory accuracy:
 *   1 - abs(systemQty - physicalQty) / max(abs(systemQty), 1)
 */
export function computeInventoryAccuracy(systemQty: number, physicalQty: number): number {
  const denom = Math.max(Math.abs(systemQty), 1);
  const raw = 1 - Math.abs(systemQty - physicalQty) / denom;
  return Math.round(Math.max(0, Math.min(1, raw)) * 10000) / 10000;
}

/**
 * Post-adjustment system quantity from ledger evidence.
 * Prefer stock at bin after ADJ posting; else systemQty + posted adjustment qty.
 * Never aliases countedQty / physical as "corrected" without ledger math.
 */
export function resolveCorrectedSystemQty(input: {
  systemQty?: number | null;
  countedQty?: number | null;
  stockQtyAtBin: number;
  varianceResolved: boolean;
  adjustmentQty?: number | null;
  varianceQty?: number | null;
  hasPostedAdj?: boolean;
}): number | undefined {
  const { systemQty, stockQtyAtBin, varianceResolved, adjustmentQty, varianceQty, hasPostedAdj } =
    input;
  // Authoritative: ledger quantity after an ADJ was posted (even if ADJ qty was wrong).
  if (hasPostedAdj || (varianceResolved && (adjustmentQty != null || varianceQty != null))) {
    if (stockQtyAtBin > 0 || hasPostedAdj) {
      return stockQtyAtBin;
    }
  }
  if (systemQty != null && adjustmentQty != null) {
    return systemQty + adjustmentQty;
  }
  // Do not treat varianceQty alone as applied correction unless resolution claimed.
  if (varianceResolved && systemQty != null && varianceQty != null) {
    return systemQty + varianceQty;
  }
  return undefined;
}

/** Type guard: versioned session evidence only — never a legacy kpi_snapshots row. */
export function isM5SessionEvidenceV1(value: unknown): value is M5SessionEvidenceV1 {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as M5SessionEvidenceV1).evidenceVersion === M5_SESSION_EVIDENCE_VERSION
  );
}

/**
 * Derive versioned session evidence from run state.
 * Omits fields without event support. Never fabricates portfolio KPI.
 */
export function deriveM5SessionEvidenceV1(input: M5SessionEvidenceSourceInput): M5SessionEvidenceV1 {
  const evidence: M5SessionEvidenceV1 = {
    evidenceVersion: M5_SESSION_EVIDENCE_VERSION,
  };

  const totalSteps = input.effectiveStepCodes.length;
  if (totalSteps > 0) {
    const done = input.effectiveStepCodes.filter((c) => input.completedSteps.includes(c)).length;
    const rate = Math.round((done / totalSteps) * 10000) / 10000;
    evidence.sessionJourneyCompletionRate = rate;
    evidence.executionCompletionRate = rate; // transitional alias
  }

  if (input.runStartedAt) {
    const start = new Date(input.runStartedAt).getTime();
    const end = input.runCompletedAt
      ? new Date(input.runCompletedAt).getTime()
      : Date.now();
    if (!Number.isNaN(start) && !Number.isNaN(end) && end >= start) {
      evidence.cycleTimeMinutes = Math.round(((end - start) / 60000) * 10) / 10;
    }
  }

  const count =
    input.inventoryCounts.find((c) => !input.contractSku || c.sku === input.contractSku) ??
    input.inventoryCounts[0];

  const adj =
    input.inventoryAdjustments.find((a) => !input.contractSku || a.sku === input.contractSku) ??
    input.inventoryAdjustments[0];
  const adjTx = input.transactions.find(
    (t) =>
      t.docType === "ADJ" &&
      t.posted &&
      (!input.contractSku || t.sku === input.contractSku),
  );
  const hasPostedAdj = Boolean(adjTx);
  const adjustmentQty =
    adj?.adjustmentQty ??
    (adjTx?.qty != null ? Number(adjTx.qty) : null) ??
    adj?.varianceQty ??
    null;

  if (count && count.systemQty != null && count.countedQty != null) {
    evidence.inventoryAccuracyBefore = computeInventoryAccuracy(count.systemQty, count.countedQty);
    evidence.varianceInitialQty = count.varianceQty ?? count.countedQty - count.systemQty;
  }

  evidence.varianceResolved = input.varianceResolved;

  const validatedPhysicalQty = count?.countedQty;
  const correctedSystemQty = resolveCorrectedSystemQty({
    systemQty: count?.systemQty,
    countedQty: count?.countedQty,
    stockQtyAtBin: input.stockQtyAtBin,
    varianceResolved: input.varianceResolved,
    adjustmentQty,
    varianceQty: count?.varianceQty ?? adj?.varianceQty,
    hasPostedAdj,
  });

  // correctedStockQty = post-adjustment system/ledger state (not a raw countedQty alias)
  if (correctedSystemQty != null) {
    evidence.correctedStockQty = correctedSystemQty;
  }

  if (correctedSystemQty != null && validatedPhysicalQty != null) {
    // Must NOT force 1 from the boolean alone — use actual quantities.
    evidence.inventoryAccuracyAfter = computeInventoryAccuracy(
      correctedSystemQty,
      validatedPhysicalQty,
    );
  } else if (
    count &&
    count.systemQty != null &&
    count.countedQty != null &&
    (count.varianceQty ?? 0) === 0
  ) {
    evidence.inventoryAccuracyAfter = computeInventoryAccuracy(count.systemQty, count.countedQty);
  }

  if (input.stockQtyAtBin > 0 || input.completedSteps.includes("M5_PUTAWAY")) {
    evidence.finalStockQty = input.stockQtyAtBin;
  }

  if (input.replenishmentQty != null) {
    evidence.replenishmentQty = input.replenishmentQty;
  }

  if (input.complianceOk === true) {
    evidence.finalComplianceStatus = "OK";
  } else if (input.complianceOk === false) {
    evidence.finalComplianceStatus = "NOT_OK";
  }

  let unresolved = 0;
  if (!input.varianceResolved && (evidence.varianceInitialQty ?? 0) !== 0) unresolved += 1;
  const missingSteps = input.effectiveStepCodes.filter((c) => !input.completedSteps.includes(c));
  unresolved += missingSteps.length;
  if (input.completedSteps.length > 0 || input.inventoryCounts.length > 0) {
    evidence.unresolvedIssueCount = unresolved;
  }

  // Explicitly do NOT set priorityOrderCompleted, firstPassYield, reworkCount,
  // finalBacklog, sessionOtif — no event support in this slice.

  return evidence;
}

/** Journey completion documentation for reports / professors. */
export const M5_SESSION_JOURNEY_COMPLETION_SPEC = {
  field: "sessionJourneyCompletionRate",
  studentLabelFr: "Taux de complétion du parcours",
  studentLabelEn: "Pathway completion rate",
  numerator: "Count of effectiveStepCodes present in completedSteps (distinct codes)",
  denominator:
    "getEffectiveM5Steps(...): M5_RECEPTION, M5_PUTAWAY, M5_CYCLE_COUNT, [M5_ADJ if variance], M5_REPLENISH, M5_KPI, M5_DECISION, COMPLIANCE_M5",
  adjRule: "M5_ADJ is included in the denominator only when a variance contract/runtime open variance applies",
  includesAnalyticalSteps: true,
  retryRule: "Step codes are boolean completions — retries do not increase the numerator",
  optionalSteps: "No optional steps outside the effective list; incomplete effective steps reduce the rate",
} as const;

/** Fields considered valid session evidence references for SCN-017. */
export const M5_SESSION_EVIDENCE_CITABLE_FIELDS = [
  "sessionJourneyCompletionRate",
  "executionCompletionRate",
  "cycleTimeMinutes",
  "inventoryAccuracyBefore",
  "varianceInitialQty",
  "varianceResolved",
  "inventoryAccuracyAfter",
  "correctedStockQty",
  "finalStockQty",
  "replenishmentQty",
  "finalComplianceStatus",
  "unresolvedIssueCount",
] as const;

export type M5SessionEvidenceCitableField = (typeof M5_SESSION_EVIDENCE_CITABLE_FIELDS)[number];

function extractNumericTokens(text: string): number[] {
  const matches = text.match(/-?\d+[.,]?\d*/g) ?? [];
  return matches.map((m) => Number(m.replace(",", "."))).filter((n) => !Number.isNaN(n));
}

function numClose(a: number, b: number, tol = 0.08): boolean {
  return Math.abs(a - b) <= Math.max(0.5, Math.abs(b) * tol);
}

/**
 * Count distinct session-evidence fields referenced in student text.
 * A field counts if its value appears (numeric) or its concept keyword matches when the field is present.
 */
export function countM5SessionEvidenceCitations(
  text: string,
  evidence: M5SessionEvidenceV1,
): { count: number; cited: M5SessionEvidenceCitableField[] } {
  const lower = text.toLowerCase();
  const nums = extractNumericTokens(text);
  const cited: M5SessionEvidenceCitableField[] = [];

  const tryCite = (field: M5SessionEvidenceCitableField, hit: boolean) => {
    if (hit && evidence[field] !== undefined && !cited.includes(field)) cited.push(field);
  };

  if (evidence.varianceInitialQty !== undefined) {
    tryCite(
      "varianceInitialQty",
      nums.some((n) => numClose(n, evidence.varianceInitialQty!)) ||
        /variance|ecart|écart/.test(lower),
    );
  }
  if (evidence.correctedStockQty !== undefined) {
    tryCite(
      "correctedStockQty",
      nums.some((n) => numClose(n, evidence.correctedStockQty!)) ||
        /stock corrige|stock corrigé|corrected stock/.test(lower),
    );
  }
  if (evidence.finalStockQty !== undefined) {
    tryCite(
      "finalStockQty",
      nums.some((n) => numClose(n, evidence.finalStockQty!)) ||
        /stock final|final stock/.test(lower),
    );
  }
  if (evidence.replenishmentQty !== undefined) {
    tryCite(
      "replenishmentQty",
      nums.some((n) => numClose(n, evidence.replenishmentQty!)) ||
        /\bq\s*=\s*0\b/.test(lower) ||
        /reappro|réappro|replenish/.test(lower),
    );
  }
  if (evidence.inventoryAccuracyBefore !== undefined) {
    const pct = evidence.inventoryAccuracyBefore * 100;
    tryCite(
      "inventoryAccuracyBefore",
      nums.some((n) => numClose(n, pct) || numClose(n, evidence.inventoryAccuracyBefore!)) ||
        /exactitude.*(avant|before)|accuracy.*(avant|before)|90\s*%/.test(lower),
    );
  }
  if (evidence.inventoryAccuracyAfter !== undefined) {
    const pct = evidence.inventoryAccuracyAfter * 100;
    tryCite(
      "inventoryAccuracyAfter",
      nums.some((n) => numClose(n, pct) || numClose(n, evidence.inventoryAccuracyAfter!)) ||
        /exactitude.*(apres|après|after)|accuracy.*(after)|100\s*%/.test(lower),
    );
  }
  const journeyRate = evidence.sessionJourneyCompletionRate ?? evidence.executionCompletionRate;
  if (journeyRate !== undefined) {
    const pct = journeyRate * 100;
    const hit =
      nums.some((n) => numClose(n, pct) || numClose(n, journeyRate)) ||
      /completion|parcours|taux d'execution|taux d’exécution|execution rate|journey/.test(lower);
    if (evidence.sessionJourneyCompletionRate !== undefined) {
      tryCite("sessionJourneyCompletionRate", hit);
    } else {
      tryCite("executionCompletionRate", hit);
    }
  }
  if (evidence.varianceResolved !== undefined) {
    tryCite(
      "varianceResolved",
      /variance resolu|variance résolu|reconcili|réconcili|ajustement/.test(lower),
    );
  }
  if (evidence.finalComplianceStatus !== undefined) {
    tryCite(
      "finalComplianceStatus",
      /conformit|compliance|\bok\b|not_ok/.test(lower),
    );
  }
  if (evidence.unresolvedIssueCount !== undefined) {
    tryCite(
      "unresolvedIssueCount",
      nums.some((n) => numClose(n, evidence.unresolvedIssueCount!)) ||
        /issue|anomal|ouvert|unresolved/.test(lower),
    );
  }
  if (evidence.cycleTimeMinutes !== undefined) {
    tryCite(
      "cycleTimeMinutes",
      nums.some((n) => numClose(n, evidence.cycleTimeMinutes!)) ||
        /temps.*session|cycle time|duree|durée/.test(lower),
    );
  }

  return { count: cited.length, cited };
}

/** True when text cites only classic M4 portfolio numbers without session evidence. */
export function isM4PortfolioOnlyEvidence(text: string, sessionCitationCount: number): boolean {
  if (sessionCitationCount >= 3) return false;
  const nums = extractNumericTokens(text);
  const portfolioHits = [
    M5_LEGACY_PORTFOLIO_MARKERS.rotationRate,
    M5_LEGACY_PORTFOLIO_MARKERS.serviceLevel * 100,
    M5_LEGACY_PORTFOLIO_MARKERS.errorRate * 100,
    M5_LEGACY_PORTFOLIO_MARKERS.averageLeadTime,
    M5_LEGACY_PORTFOLIO_MARKERS.stockImmobilizedValue,
  ].filter((expected) => nums.some((n) => numClose(n, expected))).length;
  return portfolioHits >= 2 && sessionCitationCount < 3;
}

/**
 * Metric matrix documentation for Phase 3A report / professors.
 * persistence: "computed" = not a DB column in this slice (API payload only).
 * professorVisibility: API-ready unless a dedicated teacher surface is listed.
 */
export const M5_SESSION_EVIDENCE_METRIC_MATRIX = [
  {
    field: "sessionJourneyCompletionRate",
    source: "progress.completedSteps / effective M5 steps",
    formula: "completed / totalEffectiveSteps (see M5_SESSION_JOURNEY_COMPLETION_SPEC)",
    persistence: "computed",
    studentVisibility: true,
    professorVisibility: "API-ready (not yet on MonitorDashboard)",
  },
  {
    field: "cycleTimeMinutes",
    source: "scenario_runs.startedAt / completedAt",
    formula: "(end - start) / 60000 — simulator elapsed only",
    persistence: "computed",
    studentVisibility: true,
    professorVisibility: "API-ready (not yet on MonitorDashboard)",
  },
  {
    field: "inventoryAccuracyBefore",
    source: "inventory_counts.systemQty / countedQty",
    formula: "1 - abs(system - physical) / max(abs(system), 1)",
    persistence: "computed",
    studentVisibility: true,
    professorVisibility: "API-ready (not yet on MonitorDashboard)",
  },
  {
    field: "varianceInitialQty",
    source: "inventory_counts.varianceQty",
    formula: "physical - system",
    persistence: "inventory_counts",
    studentVisibility: true,
    professorVisibility: "API-ready (not yet on MonitorDashboard)",
  },
  {
    field: "varianceResolved",
    source: "inventory_adjustments + ADJ transactions",
    formula: "isM5VarianceResolved(...)",
    persistence: "computed",
    studentVisibility: true,
    professorVisibility: "API-ready (not yet on MonitorDashboard)",
  },
  {
    field: "inventoryAccuracyAfter",
    source: "post-ADJ corrected system qty vs validated physical",
    formula: "1 - abs(correctedSystemQty - validatedPhysicalQty) / max(abs(correctedSystemQty), 1)",
    persistence: "computed",
    studentVisibility: true,
    professorVisibility: "API-ready (not yet on MonitorDashboard)",
  },
  {
    field: "correctedStockQty",
    source: "ledger stock at bin after ADJ (fallback system+adj)",
    formula: "stockQtyAtBin post-ADJ OR systemQty + adjustmentQty",
    persistence: "computed from transactions/inventory",
    studentVisibility: true,
    professorVisibility: "API-ready (not yet on MonitorDashboard)",
  },
  {
    field: "finalStockQty",
    source: "calculateInventory / stock at contract bin",
    formula: "inventory[sku::bin]",
    persistence: "computed from transactions",
    studentVisibility: true,
    professorVisibility: "API-ready (not yet on MonitorDashboard)",
  },
  {
    field: "replenishmentQty",
    source: "replenishment_suggestions.suggestedQty",
    formula: "Max(0, maxQty - systemQty) from rules",
    persistence: "replenishment_suggestions",
    studentVisibility: true,
    professorVisibility: "API-ready (not yet on MonitorDashboard)",
  },
  {
    field: "finalComplianceStatus",
    source: "validateM5Compliance",
    formula: "OK | NOT_OK when evaluated",
    persistence: "computed",
    studentVisibility: true,
    professorVisibility: "API-ready (not yet on MonitorDashboard)",
  },
  {
    field: "unresolvedIssueCount",
    source: "open variance + incomplete steps",
    formula: "(openVariance ? 1 : 0) + missingSteps",
    persistence: "computed",
    studentVisibility: true,
    professorVisibility: "API-ready (not yet on MonitorDashboard)",
  },
] as const;
