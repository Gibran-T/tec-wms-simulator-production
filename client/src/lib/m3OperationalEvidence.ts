import type { M3OperationalBadge } from "@/data/m3OperationalControlTower";
import type { CockpitPedagogy } from "@/data/scenarioCockpitPedagogy";
import { pickLang } from "@/data/scenarioCockpitPedagogy";

type M3CycleCountTarget = {
  sku: string;
  bin?: string;
  systemQty: number;
  physicalQty: number;
};

type M3ReplenishmentParam = {
  sku: string;
  minQty: number;
  maxQty: number;
  safetyStock: number;
  leadTimeDays?: number;
};

type M3InitialStateJson = {
  adjustmentThreshold?: number;
  cycleCountTargets?: M3CycleCountTarget[];
  replenishmentParams?: M3ReplenishmentParam[];
  preloadedTransactions?: Array<{ docType: string; sku?: string; docRef?: string }>;
} | null | undefined;

export type M3InventoryCountRow = {
  sku: string;
  systemQty: number | string;
  countedQty: number | string;
  varianceQty?: number | string;
};

export type M3InventoryAdjustmentRow = {
  sku: string;
  varianceQty: number | string;
  adjustmentQty: number | string;
  reason?: string | null;
};

export type M3ReplenishmentSuggestionRow = {
  sku: string;
  systemQty: number | string;
  suggestedQty: number | string;
  reason: string;
};

export type M3RunEvidence = {
  inventoryCounts: M3InventoryCountRow[];
  inventoryAdjustments: M3InventoryAdjustmentRow[];
  replenishmentSuggestions: M3ReplenishmentSuggestionRow[];
  initialStateJson: M3InitialStateJson;
};

export type M3ResolutionChainChip = {
  id: string;
  labelFr: string;
  labelEn: string;
  tone: "green" | "amber" | "red" | "slate";
  highlight?: boolean;
};

export type M3ReplenishmentParamRow = {
  sku: string;
  bin: string;
  stock: number;
  minQty: number;
  maxQty: number;
  safetyStock: number;
  deltaMin: number;
  targetQ: number;
  belowMin: boolean;
};

export type M3PerformanceMetric = {
  labelFr: string;
  labelEn: string;
  valueFr: string;
  valueEn: string;
};

const CC_STEPS = ["CC_LIST", "CC_COUNT", "CC_RECON"] as const;

function getCycleCountTargets(initialStateJson?: M3InitialStateJson): M3CycleCountTarget[] {
  const raw = initialStateJson?.cycleCountTargets;
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (t): t is M3CycleCountTarget =>
      t != null && typeof t.sku === "string" && typeof t.systemQty === "number",
  );
}

function getReplenishmentParams(initialStateJson?: M3InitialStateJson): M3ReplenishmentParam[] {
  const raw = initialStateJson?.replenishmentParams;
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (p): p is M3ReplenishmentParam =>
      p != null && typeof p.sku === "string" && typeof p.minQty === "number",
  );
}

function getVarianceThreshold(initialStateJson?: M3InitialStateJson): number {
  const t = initialStateJson?.adjustmentThreshold;
  return typeof t === "number" && t > 0 ? t : 5;
}

function parseStudentQtyFromReason(reason: string): number | null {
  const match = reason.match(/studentQty=(-?\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
}

function stockForSku(inventory: Record<string, number>, sku: string): number {
  let total = 0;
  for (const [key, qty] of Object.entries(inventory)) {
    if (key.startsWith(`${sku}::`)) total += qty;
  }
  return total;
}

function binForSku(inventory: Record<string, number>, sku: string): string {
  for (const key of Object.keys(inventory)) {
    if (key.startsWith(`${sku}::`)) return key.split("::")[1] ?? "—";
  }
  return "—";
}

export function isAdjPostedForSku(
  sku: string,
  adjustmentQty: number,
  inventoryAdjustments: M3InventoryAdjustmentRow[],
  transactions: Array<{ docType: string; sku: string; qty: number; posted?: boolean }>,
): boolean {
  const adjMatch = inventoryAdjustments.some(
    (a) => a.sku === sku && Number(a.adjustmentQty) === adjustmentQty,
  );
  const txMatch = transactions.some(
    (t) => t.docType === "ADJ" && t.sku === sku && t.posted !== false && Number(t.qty) === adjustmentQty,
  );
  return adjMatch || txMatch;
}

export function hasZeroVarianceConfirmation(
  sku: string,
  inventoryAdjustments: M3InventoryAdjustmentRow[],
): boolean {
  return inventoryAdjustments.some((a) => a.sku === sku && Number(a.adjustmentQty) === 0);
}

export type M3ReconTargetStatus =
  | "PENDING"
  | "RECONCILED_WITH_ADJUSTMENT"
  | "RECONCILED_NO_ADJUSTMENT";

export function getCountVarianceQty(count: M3InventoryCountRow): number {
  if (count.varianceQty != null && count.varianceQty !== "") {
    return Number(count.varianceQty);
  }
  return Number(count.countedQty) - Number(count.systemQty);
}

export function getCcReconTargetUiStatus(
  sku: string,
  inventoryCounts: M3InventoryCountRow[],
  inventoryAdjustments: M3InventoryAdjustmentRow[],
  transactions: Array<{ docType: string; sku: string; bin?: string; qty: number; posted?: boolean }>,
): { status: M3ReconTargetStatus; varianceQty: number | null } {
  const count = inventoryCounts.find((c) => c.sku === sku);
  if (!count) return { status: "PENDING", varianceQty: null };
  const varianceQty = getCountVarianceQty(count);
  if (varianceQty === 0) {
    return {
      status: hasZeroVarianceConfirmation(sku, inventoryAdjustments)
        ? "RECONCILED_NO_ADJUSTMENT"
        : "PENDING",
      varianceQty,
    };
  }
  const adjOk = inventoryAdjustments.some((a) => a.sku === sku && Number(a.adjustmentQty) === varianceQty);
  const txOk = transactions.some(
    (t) => t.docType === "ADJ" && t.sku === sku && t.posted !== false && Number(t.qty) === varianceQty,
  );
  return {
    status: adjOk && txOk ? "RECONCILED_WITH_ADJUSTMENT" : "PENDING",
    varianceQty,
  };
}

export function computeCcReconProgress(
  targets: M3CycleCountTarget[],
  inventoryCounts: M3InventoryCountRow[],
  inventoryAdjustments: M3InventoryAdjustmentRow[],
  transactions: Array<{ docType: string; sku: string; bin?: string; qty: number; posted?: boolean }>,
): {
  reconciledCount: number;
  requiredCount: number;
  pendingSkus: string[];
  completedSkus: string[];
  statuses: Array<{
    sku: string;
    bin?: string;
    status: M3ReconTargetStatus;
    varianceQty: number | null;
    systemQty?: number;
    physicalQty?: number;
  }>;
} {
  const statuses = targets.map((t) => {
    const { status, varianceQty } = getCcReconTargetUiStatus(
      t.sku,
      inventoryCounts,
      inventoryAdjustments,
      transactions,
    );
    return {
      sku: t.sku,
      bin: t.bin,
      status,
      varianceQty,
      systemQty: t.systemQty,
      physicalQty: t.physicalQty,
    };
  });
  const completedSkus = statuses.filter((s) => s.status !== "PENDING").map((s) => s.sku);
  const pendingSkus = statuses.filter((s) => s.status === "PENDING").map((s) => s.sku);
  return {
    reconciledCount: completedSkus.length,
    requiredCount: targets.length,
    pendingSkus,
    completedSkus,
    statuses,
  };
}

export function hasOpenVariance(
  sku: string,
  inventoryCounts: M3InventoryCountRow[],
  inventoryAdjustments: M3InventoryAdjustmentRow[],
  transactions: Array<{ docType: string; sku: string; qty: number; posted?: boolean }>,
): boolean {
  const count = inventoryCounts.find((c) => c.sku === sku);
  if (!count) return false;
  const varianceQty = getCountVarianceQty(count);
  if (varianceQty === 0) return false;
  return !isAdjPostedForSku(sku, varianceQty, inventoryAdjustments, transactions);
}

export function computeInventoryAccuracy(
  targets: M3CycleCountTarget[],
  inventoryCounts: M3InventoryCountRow[],
): { pct: number; counted: number; total: number } {
  if (targets.length === 0) return { pct: 0, counted: 0, total: 0 };
  const counted = targets.filter((t) => inventoryCounts.some((c) => c.sku === t.sku)).length;
  return {
    pct: Math.round(100 * (counted / targets.length)),
    counted,
    total: targets.length,
  };
}

export function countOpenVariances(
  targets: M3CycleCountTarget[],
  inventoryCounts: M3InventoryCountRow[],
  inventoryAdjustments: M3InventoryAdjustmentRow[],
  transactions: Array<{ docType: string; sku: string; qty: number; posted?: boolean }>,
): number {
  let open = 0;
  for (const target of targets) {
    const count = inventoryCounts.find((c) => c.sku === target.sku);
    if (!count) continue;
    const varianceQty = count.varianceQty != null
      ? Number(count.varianceQty)
      : Number(count.countedQty) - Number(count.systemQty);
    if (varianceQty !== 0 && !isAdjPostedForSku(target.sku, varianceQty, inventoryAdjustments, transactions)) {
      open += 1;
    }
  }
  return open;
}

type ReplenishmentDisplayStatus = "NOT_APPLICABLE" | "PENDING" | "PARTIAL" | "COMPLETE";

export function computeReplenishmentDisplayStatus(
  params: M3ReplenishmentParam[],
  suggestions: M3ReplenishmentSuggestionRow[],
): { status: ReplenishmentDisplayStatus; submitted: number; required: number } {
  if (params.length === 0) {
    return { status: "NOT_APPLICABLE", submitted: 0, required: 0 };
  }
  let validCount = 0;
  for (const param of params) {
    const row = suggestions.find((s) => s.sku === param.sku);
    if (!row) continue;
    const expectedQty = param.maxQty - Number(row.systemQty);
    const studentQty = parseStudentQtyFromReason(row.reason);
    if (studentQty !== null && studentQty === expectedQty) validCount += 1;
  }
  const required = params.length;
  if (validCount >= required) return { status: "COMPLETE", submitted: validCount, required };
  if (validCount > 0) return { status: "PARTIAL", submitted: validCount, required };
  return { status: "PENDING", submitted: 0, required };
}

export function buildReplenishmentParamRows(
  params: M3ReplenishmentParam[],
  inventory: Record<string, number>,
): M3ReplenishmentParamRow[] {
  return params.map((p) => {
    const stock = stockForSku(inventory, p.sku);
    const deltaMin = stock - p.minQty;
    return {
      sku: p.sku,
      bin: binForSku(inventory, p.sku),
      stock,
      minQty: p.minQty,
      maxQty: p.maxQty,
      safetyStock: p.safetyStock,
      deltaMin,
      targetQ: p.maxQty - stock,
      belowMin: stock < p.minQty,
    };
  });
}

export function buildM3ResolutionChain(input: {
  completedSteps: string[];
  nextStepCode?: string;
  inventoryCounts: M3InventoryCountRow[];
  inventoryAdjustments: M3InventoryAdjustmentRow[];
  initialStateJson: M3InitialStateJson;
  transactions: Array<{ docType: string; sku: string; qty: number; posted?: boolean }>;
}): M3ResolutionChainChip[] {
  const targets = getCycleCountTargets(input.initialStateJson);
  const hasReplenishParams = getReplenishmentParams(input.initialStateJson).length > 0;
  const adjPosted = isAdjPostedForSku("SKU-001", -3, input.inventoryAdjustments, input.transactions);
  const varianceOpen = hasOpenVariance("SKU-001", input.inventoryCounts, input.inventoryAdjustments, input.transactions);
  const countComplete = targets.length > 0 && input.inventoryCounts.length >= targets.length;
  const highlightRecon = input.nextStepCode === "CC_RECON";

  const chips: M3ResolutionChainChip[] = [
    {
      id: "CC_LIST",
      labelFr: `CC_LIST${input.completedSteps.includes("CC_LIST") ? " ✓" : ""}`,
      labelEn: `CC_LIST${input.completedSteps.includes("CC_LIST") ? " ✓" : ""}`,
      tone: input.completedSteps.includes("CC_LIST") ? "green" : "slate",
    },
    {
      id: "CC_COUNT",
      labelFr: `CC_COUNT${input.completedSteps.includes("CC_COUNT") || countComplete ? " ✓" : ""}`,
      labelEn: `CC_COUNT${input.completedSteps.includes("CC_COUNT") || countComplete ? " ✓" : ""}`,
      tone: input.completedSteps.includes("CC_COUNT") || countComplete ? "green" : "slate",
    },
    {
      id: "CC_RECON",
      labelFr: adjPosted ? "CC_RECON ✓ [ADJ MI07]" : varianceOpen ? "CC_RECON [ADJ MI07]" : "CC_RECON [ADJ MI07]",
      labelEn: adjPosted ? "CC_RECON ✓ [ADJ MI07]" : varianceOpen ? "CC_RECON [ADJ MI07]" : "CC_RECON [ADJ MI07]",
      tone: adjPosted ? "green" : varianceOpen ? "amber" : highlightRecon ? "amber" : "slate",
      highlight: highlightRecon && !adjPosted,
    },
    {
      id: "COMPLIANCE",
      labelFr: "COMPLIANCE_M3",
      labelEn: "COMPLIANCE_M3",
      tone: input.completedSteps.includes("COMPLIANCE_M3") ? "green" : "slate",
    },
  ];

  if (!hasReplenishParams) {
    chips.splice(3, 0, {
      id: "REPLENISH",
      labelFr: "REPLENISH — Auto, non requis",
      labelEn: "REPLENISH — Auto, not required",
      tone: "slate",
    });
  }

  if (varianceOpen && !adjPosted) {
    chips.push({
      id: "VARIANCE_OPEN",
      labelFr: "Écart ouvert −3",
      labelEn: "Open variance −3",
      tone: "amber",
    });
  }
  if (adjPosted) {
    chips.push({
      id: "ADJ_POSTED",
      labelFr: "ADJ MI07 posté",
      labelEn: "ADJ MI07 posted",
      tone: "green",
    });
  }

  return chips;
}

export function computeM3OperationalBadges(input: {
  scnCode: string;
  initialStateJson: M3InitialStateJson;
  inventory: Record<string, number>;
  inventoryCounts: M3InventoryCountRow[];
  inventoryAdjustments: M3InventoryAdjustmentRow[];
  replenishmentSuggestions: M3ReplenishmentSuggestionRow[];
  completedSteps: string[];
  nextStepCode?: string;
  transactions: Array<{ docType: string; sku: string; qty: number; posted?: boolean }>;
}): M3OperationalBadge[] {
  const badges: M3OperationalBadge[] = [];
  const targets = getCycleCountTargets(input.initialStateJson);
  const replenishParams = getReplenishmentParams(input.initialStateJson);
  const threshold = getVarianceThreshold(input.initialStateJson);
  const showAccuracy = input.inventoryCounts.length >= 1
    || input.completedSteps.some((s) => CC_STEPS.includes(s as typeof CC_STEPS[number]))
    || (input.nextStepCode != null && CC_STEPS.includes(input.nextStepCode as typeof CC_STEPS[number]));

  if (input.scnCode === "SCN-009") {
    const adjPosted = isAdjPostedForSku("SKU-001", -3, input.inventoryAdjustments, input.transactions);
    badges.push({
      id: "variance",
      labelFr: "Écart",
      labelEn: "Variance",
      tone: adjPosted ? "green" : "amber",
      valueFr: adjPosted ? "Variance résolue : −3" : "Écart attendu : −3 u. (SKU-001)",
      valueEn: adjPosted ? "Variance resolved: −3" : "Expected variance: −3 u. (SKU-001)",
    });
  }

  if (input.scnCode === "SCN-010" && targets.length > 0) {
    const target = targets[0];
    const variance = target.physicalQty - target.systemQty;
    const absVar = Math.abs(variance);
    badges.push({
      id: "threshold",
      labelFr: "Seuil ajustement",
      labelEn: "Adjustment threshold",
      tone: "slate",
      valueFr: `Seuil ajustement : ${threshold} u.`,
      valueEn: `Adjustment threshold: ${threshold} u.`,
    });
    badges.push({
      id: "variance",
      labelFr: "Écart",
      labelEn: "Variance",
      tone: absVar >= threshold ? "red" : "amber",
      valueFr: `Écart : ${variance}`,
      valueEn: `Variance: ${variance}`,
    });
  }

  if ((input.scnCode === "SCN-009" || input.scnCode === "SCN-010") && showAccuracy && targets.length > 0) {
    const { pct, counted, total } = computeInventoryAccuracy(targets, input.inventoryCounts);
    badges.push({
      id: "accuracy",
      labelFr: "Précision inventaire",
      labelEn: "Inventory accuracy",
      tone: pct >= 100 ? "green" : "amber",
      valueFr: `${pct}% — SKUs comptés : ${counted}/${total}`,
      valueEn: `${pct}% — SKUs counted: ${counted}/${total}`,
    });
  }

  if (input.scnCode === "SCN-011") {
    const confirmed = CC_STEPS.filter((s) => input.completedSteps.includes(s)).length;
    const total = replenishParams.length || 2;
    badges.push({
      id: "confirmed",
      labelFr: "Niveaux confirmés",
      labelEn: "Levels confirmed",
      tone: confirmed >= 3 ? "green" : "amber",
      valueFr: `Niveaux confirmés : ${confirmed}/${total} SKUs`,
      valueEn: `Levels confirmed: ${confirmed}/${total} SKUs`,
    });

    const belowMinRows = buildReplenishmentParamRows(replenishParams, input.inventory).filter((r) => r.belowMin);
    if (belowMinRows.length > 0) {
      const detail = belowMinRows.map((r) => `${r.sku} : ${r.deltaMin} vs Min`).join(" · ");
      badges.push({
        id: "below_min",
        labelFr: "Sous Min",
        labelEn: "Below Min",
        tone: "red",
        valueFr: belowMinRows.length > 1 ? `${belowMinRows.length} SKUs sous Min` : detail,
        valueEn: belowMinRows.length > 1 ? `${belowMinRows.length} SKUs below Min` : detail.replace(" vs Min", " vs Min"),
      });
    }
  } else if (replenishParams.length > 0) {
    const belowMinRows = buildReplenishmentParamRows(replenishParams, input.inventory).filter((r) => r.belowMin);
    if (belowMinRows.length > 0) {
      badges.push({
        id: "below_min",
        labelFr: "Sous Min",
        labelEn: "Below Min",
        tone: "red",
        valueFr: `${belowMinRows.length} SKU(s) sous Min`,
        valueEn: `${belowMinRows.length} SKU(s) below Min`,
      });
    }
  }

  const replenishStatus = computeReplenishmentDisplayStatus(replenishParams, input.replenishmentSuggestions);
  if (replenishStatus.status === "NOT_APPLICABLE") {
    badges.push({
      id: "replenish",
      labelFr: "Réapprovisionnement",
      labelEn: "Replenishment",
      tone: "slate",
      valueFr: "Réappro : non requis (auto-validé)",
      valueEn: "Replenish: not required (auto-validated)",
    });
  } else {
    const tone = replenishStatus.status === "COMPLETE" ? "green" : "amber";
    const valueFr = replenishStatus.status === "COMPLETE"
      ? "Réappro : complet"
      : `Réappro : ${replenishStatus.submitted}/${replenishStatus.required} SKUs`;
    const valueEn = replenishStatus.status === "COMPLETE"
      ? "Replenish: complete"
      : `Replenish: ${replenishStatus.submitted}/${replenishStatus.required} SKUs`;
    badges.push({
      id: "replenish",
      labelFr: "Réapprovisionnement",
      labelEn: "Replenishment",
      tone,
      valueFr,
      valueEn,
    });
  }

  return badges;
}

export function getM3StepAwareHint(
  scnCode: string | undefined,
  nextStepCode: string | undefined,
  pedagogy: CockpitPedagogy | null,
  language: string,
): string | null {
  if (!scnCode || !pedagogy) return null;

  const hints: Record<string, Record<string, { fr: string; en: string }>> = {
    "SCN-009": {
      CC_RECON: {
        fr: "Analysez l'écart −3 et postez l'ajustement ADJ (MI07) dans cette étape.",
        en: "Analyze the −3 variance and post the ADJ (MI07) adjustment in this step.",
      },
      COMPLIANCE_M3: {
        fr: "Vérifiez que l'ADJ −3 est posté avant clôture M3.",
        en: "Verify the −3 ADJ is posted before M3 closing.",
      },
    },
    "SCN-010": {
      CC_RECON: {
        fr: "Saisissez 352 au comptage, justifiez l'écart −28, puis ajustez. Justification obligatoire (≥20 u.).",
        en: "Enter 352 at count, justify the −28 variance, then adjust. Justification required (≥20 u.).",
      },
    },
    "SCN-011": {
      CC_LIST: {
        fr: "Étape confirmatoire — vérifiez les niveaux affichés, validez rapidement, puis REPLENISH.",
        en: "Confirmatory step — verify displayed levels, validate quickly, then REPLENISH.",
      },
      CC_COUNT: {
        fr: "Étape confirmatoire — vérifiez les niveaux affichés, validez rapidement, puis REPLENISH.",
        en: "Confirmatory step — verify displayed levels, validate quickly, then REPLENISH.",
      },
      CC_RECON: {
        fr: "Étape confirmatoire — vérifiez les niveaux affichés, validez rapidement, puis REPLENISH.",
        en: "Confirmatory step — verify displayed levels, validate quickly, then REPLENISH.",
      },
      REPLENISH: {
        fr: pickLang(pedagogy.expectedActionHint, language),
        en: pickLang(pedagogy.expectedActionHint, language),
      },
    },
  };

  const scnHints = hints[scnCode];
  if (scnHints && nextStepCode && scnHints[nextStepCode]) {
    return language === "FR" ? scnHints[nextStepCode].fr : scnHints[nextStepCode].en;
  }
  return pickLang(pedagogy.expectedActionHint, language);
}

export type M3GridStatus = "BELOW_MIN" | "VARIANCE_OPEN" | "RECONCILED" | "AVAILABLE" | "EMPTY";

export function getM3GridStatus(
  scnCode: string | undefined,
  sku: string,
  qty: number,
  inventoryCounts: M3InventoryCountRow[],
  inventoryAdjustments: M3InventoryAdjustmentRow[],
  transactions: Array<{ docType: string; sku: string; qty: number; posted?: boolean }>,
  replenishParams: M3ReplenishmentParam[],
): M3GridStatus {
  if (scnCode === "SCN-011") {
    const param = replenishParams.find((p) => p.sku === sku);
    if (param && qty < param.minQty) return "BELOW_MIN";
  }
  if (scnCode === "SCN-009" || scnCode === "SCN-010") {
    if (hasOpenVariance(sku, inventoryCounts, inventoryAdjustments, transactions)) return "VARIANCE_OPEN";
    const count = inventoryCounts.find((c) => c.sku === sku);
    if (count) {
      const varianceQty = count.varianceQty != null
        ? Number(count.varianceQty)
        : Number(count.countedQty) - Number(count.systemQty);
      if (varianceQty !== 0 && isAdjPostedForSku(sku, varianceQty, inventoryAdjustments, transactions)) {
        return "RECONCILED";
      }
    }
  }
  return qty > 0 ? "AVAILABLE" : "EMPTY";
}

export function computeM3PerformanceMetrics(input: {
  scnCode: string | undefined;
  initialStateJson: M3InitialStateJson;
  inventory: Record<string, number>;
  inventoryCounts: M3InventoryCountRow[];
  inventoryAdjustments: M3InventoryAdjustmentRow[];
  replenishmentSuggestions: M3ReplenishmentSuggestionRow[];
  transactions: Array<{ docType: string; sku: string; qty: number; posted?: boolean }>;
}): M3PerformanceMetric[] {
  const metrics: M3PerformanceMetric[] = [];
  const targets = getCycleCountTargets(input.initialStateJson);
  const replenishParams = getReplenishmentParams(input.initialStateJson);

  if (input.scnCode === "SCN-009" || input.scnCode === "SCN-010") {
    const { pct } = computeInventoryAccuracy(targets, input.inventoryCounts);
    const open = countOpenVariances(targets, input.inventoryCounts, input.inventoryAdjustments, input.transactions);
    metrics.push({
      labelFr: "Précision inventaire",
      labelEn: "Inventory accuracy",
      valueFr: `${pct}%`,
      valueEn: `${pct}%`,
    });
    metrics.push({
      labelFr: "Écarts ouverts",
      labelEn: "Open variances",
      valueFr: String(open),
      valueEn: String(open),
    });
  }

  if (input.scnCode === "SCN-011") {
    const belowMin = buildReplenishmentParamRows(replenishParams, input.inventory).filter((r) => r.belowMin).length;
    const replenishStatus = computeReplenishmentDisplayStatus(replenishParams, input.replenishmentSuggestions);
    metrics.push({
      labelFr: "SKUs sous Min",
      labelEn: "SKUs below Min",
      valueFr: String(belowMin),
      valueEn: String(belowMin),
    });
    metrics.push({
      labelFr: "Réappro progression",
      labelEn: "Replenish progress",
      valueFr: `${replenishStatus.submitted}/${replenishStatus.required}`,
      valueEn: `${replenishStatus.submitted}/${replenishStatus.required}`,
    });
  }

  return metrics;
}

export function isStudentAdjTransaction(
  tx: { docType: string; docRef?: string | null },
  initialStateJson: M3InitialStateJson,
): boolean {
  if (tx.docType !== "ADJ") return false;
  const preloaded = initialStateJson?.preloadedTransactions ?? [];
  const preloadedRefs = new Set(preloaded.filter((p) => p.docType === "ADJ").map((p) => p.docRef).filter(Boolean));
  return !preloadedRefs.has(tx.docRef ?? undefined);
}

export function isScn011ConfirmatoryStep(nextStepCode?: string): boolean {
  return nextStepCode != null && (CC_STEPS as readonly string[]).includes(nextStepCode);
}

export {
  getCycleCountTargets,
  getReplenishmentParams,
  CC_STEPS,
};
