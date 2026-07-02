export const ZONE_RECEPTION = "RECEPTION";
export const ZONE_STOCKAGE = "STOCKAGE";
export const ZONE_PICKING = "PICKING";
export const ZONE_EXPEDITION = "EXPEDITION";
export const ZONE_RESERVE = "RESERVE";
export const RECEPTION_BINS = ["REC-01", "REC-02"];
export const STOCKAGE_BINS = ["B-01-R1-L1", "B-01-R1-L2", "B-02-R1-L1", "TRANSIT-01"];
export const PICKING_BINS = ["A-01-R1-L1", "A-01-R1-L2", "A-02-R1-L1"];
export const EXPEDITION_BINS = ["EXP-01", "EXP-02"];
export const RESERVE_BINS = ["C-01-R1-L1", "C-01-R1-L2"];
export const MODULE1_STEPS = [
  { code: "PO", labelFr: "Bon de commande (ME21N)", labelEn: "Purchase Order (ME21N)", order: 1, prerequisite: null, moduleId: 1 },
  { code: "GR", labelFr: "Réception quai (MIGO)", labelEn: "Goods Receipt — Dock (MIGO)", order: 2, prerequisite: "PO", moduleId: 1 },
  { code: "PUTAWAY_M1", labelFr: "Rangement stock (LT0A)", labelEn: "Putaway to Stock (LT0A)", order: 3, prerequisite: "GR", moduleId: 1 },
  { code: "STOCK", labelFr: "Stock disponible", labelEn: "Stock Available", order: 4, prerequisite: "PUTAWAY_M1", moduleId: 1 },
  { code: "SO", labelFr: "Commande client (VA01)", labelEn: "Sales Order (VA01)", order: 5, prerequisite: "STOCK", moduleId: 1 },
  { code: "PICKING_M1", labelFr: "Prélèvement expédition (VL01N)", labelEn: "Picking to Dispatch (VL01N)", order: 6, prerequisite: "SO", moduleId: 1 },
  { code: "GI", labelFr: "Sortie marchandises (VL02N)", labelEn: "Goods Issue (VL02N)", order: 7, prerequisite: "PICKING_M1", moduleId: 1 },
  { code: "CC", labelFr: "Comptage cyclique (MI01)", labelEn: "Cycle Count (MI01)", order: 8, prerequisite: "GI", moduleId: 1 },
  { code: "COMPLIANCE", labelFr: "Conformité système", labelEn: "System Compliance", order: 9, prerequisite: "CC", moduleId: 1 }
];
export const MODULE2_STEPS = [
  { code: "GR", labelFr: "Réception marchandises", labelEn: "Goods Receipt", order: 1, prerequisite: null, moduleId: 2 },
  { code: "PUTAWAY", labelFr: "Rangement structuré", labelEn: "Structured Putaway", order: 2, prerequisite: "GR", moduleId: 2 },
  { code: "FIFO_PICK", labelFr: "Prélèvement FIFO", labelEn: "FIFO Pick", order: 3, prerequisite: "PUTAWAY", moduleId: 2 },
  { code: "STOCK_ACCURACY", labelFr: "Précision inventaire", labelEn: "Stock Accuracy", order: 4, prerequisite: "FIFO_PICK", moduleId: 2 },
  { code: "COMPLIANCE_ADV", labelFr: "Conformité avancée", labelEn: "Advanced Compliance", order: 5, prerequisite: "STOCK_ACCURACY", moduleId: 2 }
];
export const MODULE3_STEPS = [
  { code: "CC_LIST", labelFr: "Liste de comptage", labelEn: "Count List", order: 1, prerequisite: null, moduleId: 3 },
  { code: "CC_COUNT", labelFr: "Saisie des quantités", labelEn: "Count Entry", order: 2, prerequisite: "CC_LIST", moduleId: 3 },
  { code: "CC_RECON", labelFr: "Réconciliation & ajustement", labelEn: "Reconciliation", order: 3, prerequisite: "CC_COUNT", moduleId: 3 },
  { code: "REPLENISH", labelFr: "Réapprovisionnement", labelEn: "Replenishment", order: 4, prerequisite: "CC_RECON", moduleId: 3 },
  { code: "COMPLIANCE_M3", labelFr: "Conformité Module 3", labelEn: "M3 Compliance", order: 5, prerequisite: "REPLENISH", moduleId: 3 }
];

/** M3 pipeline step maxima — SCN-011 adds ROP/EOQ planning events (+20) on top of this 80-pt base (= 100). */
export const M3_STEP_MAX = {
  CC_LIST: 10,
  CC_COUNT: 20,
  CC_RECON: 15,
  REPLENISH: 20,
  COMPLIANCE_M3: 15,
  ROP_CHECK: 10,
  EOQ_CALC: 10,
} as const;

/** Scaled awards for SCN-009/010 (no ROP/EOQ) — 80 → 100. */
export const M3_STEP_MAX_SCALED = {
  CC_LIST: 13,
  CC_COUNT: 25,
  CC_RECON: 19,
  REPLENISH: 25,
  COMPLIANCE_M3: 18,
} as const;

export const M3_SCALED_PERFECT_TOTAL = Object.values(M3_STEP_MAX_SCALED).reduce((sum, pts) => sum + pts, 0);

export const M3_REPLENISH_SCORING_EVENTS = [
  "ROP_CHECK_COMPLETED",
  "EOQ_CALC_COMPLETED",
  "REPLENISH_COMPLETED",
] as const;

export const M3_PIPELINE_PERFECT_TOTAL =
  M3_STEP_MAX.CC_LIST +
  M3_STEP_MAX.CC_COUNT +
  M3_STEP_MAX.CC_RECON +
  M3_STEP_MAX.REPLENISH +
  M3_STEP_MAX.COMPLIANCE_M3;

export function validateGRZone(bin) {
  if (!RECEPTION_BINS.includes(bin)) {
    return {
      allowed: false,
      reason: `GR must use a RECEPTION bin (${RECEPTION_BINS.join(", ")}). Got: "${bin}"`,
      reasonFr: `La réception (GR) doit utiliser un emplacement de la zone RÉCEPTION (${RECEPTION_BINS.join(", ")}). Emplacement saisi : "${bin}" — les marchandises reçues ne peuvent pas aller directement au stock.`,
      reasonEn: `Goods Receipt must use a RECEPTION bin (${RECEPTION_BINS.join(", ")}). Entered bin: "${bin}" — received goods cannot go directly to stock.`,
      fieldError: { field: "bin", expected: RECEPTION_BINS.join(" ou "), actual: bin }
    };
  }
  return { allowed: true };
}
export function validatePutawayM1Zone(fromBin, toBin) {
  if (!RECEPTION_BINS.includes(fromBin)) {
    return {
      allowed: false,
      reason: `Putaway fromBin must be a RECEPTION bin. Got: "${fromBin}"`,
      reasonFr: `Le rangement doit partir d'un emplacement RÉCEPTION (${RECEPTION_BINS.join(", ")}). Emplacement source : "${fromBin}"`,
      reasonEn: `Putaway source bin must be a RECEPTION bin (${RECEPTION_BINS.join(", ")}). Source bin entered: "${fromBin}"`,
      fieldError: { field: "fromBin", expected: RECEPTION_BINS.join(" ou "), actual: fromBin }
    };
  }
  const validToBins = [...STOCKAGE_BINS, ...PICKING_BINS, ...RESERVE_BINS];
  if (!validToBins.includes(toBin)) {
    return {
      allowed: false,
      reason: `Putaway toBin must be a STOCKAGE, PICKING, or RESERVE bin. Got: "${toBin}"`,
      reasonFr: `Le rangement doit aller vers un emplacement STOCKAGE, PICKING ou RÉSERVE. Emplacement destination : "${toBin}" — les marchandises ne peuvent pas rester en zone RÉCEPTION ni aller directement en EXPÉDITION.`,
      reasonEn: `Putaway destination must be a STOCKAGE, PICKING, or RESERVE bin. Destination "${toBin}" is invalid — goods cannot remain in RECEPTION or go directly to DISPATCH.`,
      fieldError: { field: "toBin", expected: "STOCKAGE / PICKING / RESERVE", actual: toBin }
    };
  }
  return { allowed: true };
}
export function validatePickingM1Zone(fromBin, toBin) {
  const validFromBins = [...STOCKAGE_BINS, ...PICKING_BINS, ...RESERVE_BINS];
  if (!validFromBins.includes(fromBin)) {
    return {
      allowed: false,
      reason: `Picking fromBin must be a STOCKAGE/PICKING/RESERVE bin. Got: "${fromBin}"`,
      reasonFr: `Le prélèvement doit partir d'un emplacement STOCKAGE, PICKING ou RÉSERVE. Emplacement source : "${fromBin}"`,
      reasonEn: `Picking source bin must be a STOCKAGE, PICKING, or RESERVE bin. Source bin "${fromBin}" is invalid.`,
      fieldError: { field: "fromBin", expected: "STOCKAGE / PICKING / RESERVE", actual: fromBin }
    };
  }
  if (!EXPEDITION_BINS.includes(toBin)) {
    return {
      allowed: false,
      reason: `Picking toBin must be an EXPEDITION bin (${EXPEDITION_BINS.join(", ")}). Got: "${toBin}"`,
      reasonFr: `Le prélèvement doit aller vers un emplacement EXPÉDITION (${EXPEDITION_BINS.join(", ")}). Emplacement destination : "${toBin}" — les marchandises prélevées doivent être déposées au quai d'expédition.`,
      reasonEn: `Picking destination must be a DISPATCH bin (${EXPEDITION_BINS.join(", ")}). Destination "${toBin}" is invalid — picked goods must be staged at the dispatch dock.`,
      fieldError: { field: "toBin", expected: EXPEDITION_BINS.join(" ou "), actual: toBin }
    };
  }
  return { allowed: true };
}
export function validateGIZone(bin) {
  if (!EXPEDITION_BINS.includes(bin)) {
    return {
      allowed: false,
      reason: `GI must use an EXPEDITION bin (${EXPEDITION_BINS.join(", ")}). Got: "${bin}"`,
      reasonFr: `La sortie marchandises (GI) doit utiliser un emplacement EXPÉDITION (${EXPEDITION_BINS.join(", ")}). Emplacement saisi : "${bin}" — les marchandises doivent être au quai d'expédition avant la sortie.`,
      reasonEn: `Goods Issue must use a DISPATCH bin (${EXPEDITION_BINS.join(", ")}). Bin "${bin}" is invalid — goods must be at the dispatch dock before issuing.`,
      fieldError: { field: "bin", expected: EXPEDITION_BINS.join(" ou "), actual: bin }
    };
  }
  return { allowed: true };
}
export function canExecuteStep(step, state) {
  const effectiveSteps = getEffectiveM1Steps(state);
  const stepDef = effectiveSteps.find((s) => s.code === step) ?? MODULE1_STEPS.find((s) => s.code === step);
  const isKnownCorrective = SCN003_CORRECTIVE_STEPS.some((s) => s.code === step);
  if (!stepDef && step !== "ADJ" && !isKnownCorrective) {
    return { allowed: false, reason: "Unknown step", reasonFr: "Étape inconnue", reasonEn: "Unknown step" };
  }
  if (stepDef?.prerequisite && !state.completedSteps.includes(stepDef.prerequisite)) {
    const prereqDef = MODULE1_STEPS.find((s) => s.code === stepDef.prerequisite);
    return {
      allowed: false,
      reason: `Step ${stepDef.prerequisite} must be completed first`,
      reasonFr: `L'étape "${prereqDef?.labelFr}" doit être complétée en premier`,
      reasonEn: `Step "${prereqDef?.labelEn}" must be completed first`
    };
  }
  if (step === "GR") {
    const hasPO = state.transactions.some((t) => t.docType === "PO" && t.posted);
    if (!hasPO) {
      return {
        allowed: false,
        reason: "No posted Purchase Order found in this run",
        reasonFr: "Aucun Bon de commande (PO) posté trouvé dans cette session",
        reasonEn: "No posted Purchase Order (PO) found in this run — create a PO first."
      };
    }
  }
  if (step === "PUTAWAY_M1") {
    const hasGR = state.transactions.some((t) => t.docType === "GR" && t.posted);
    if (!hasGR) {
      return {
        allowed: false,
        reason: "No posted Goods Receipt found — receive goods first",
        reasonFr: "Aucune GR postée — réceptionnez les marchandises au quai avant le rangement",
        reasonEn: "No posted Goods Receipt (GR) found — receive goods at the dock before putaway."
      };
    }
    const grInReception = state.transactions.some(
      (t) => t.docType === "GR" && t.posted && RECEPTION_BINS.includes(t.bin)
    );
    if (!grInReception) {
      return {
        allowed: false,
        reason: `GR must have been posted to a RECEPTION bin (${RECEPTION_BINS.join(", ")}) before putaway`,
        reasonFr: `La GR doit avoir été postée vers un emplacement RÉCEPTION (${RECEPTION_BINS.join(", ")}) avant le rangement`,
        reasonEn: `GR must have been posted to a RECEPTION bin (${RECEPTION_BINS.join(", ")}) before putaway.`
      };
    }
  }
  if (step === "STOCK") {
    const hasPutaway = state.completedSteps.includes("PUTAWAY_M1");
    if (!hasPutaway) {
      return {
        allowed: false,
        reason: "Putaway must be completed before checking stock availability",
        reasonFr: "Le rangement (PUTAWAY) doit être complété avant de vérifier le stock disponible",
        reasonEn: "Putaway must be completed before verifying stock availability."
      };
    }
    const validBins = [...STOCKAGE_BINS, ...PICKING_BINS, ...RESERVE_BINS];
    const stockInWarehouse = Object.entries(state.inventory).filter(([key]) => validBins.some((b) => key.endsWith(`::${b}`))).reduce((sum, [, qty]) => sum + qty, 0);
    if (stockInWarehouse <= 0) {
      return {
        allowed: false,
        reason: "No stock available in warehouse bins after putaway",
        reasonFr: "Aucun stock disponible dans les emplacements entrepôt après rangement",
        reasonEn: "No stock available in warehouse bins after putaway."
      };
    }
  }
  if (step === "PICKING_M1") {
    const hasSO = state.transactions.some((t) => t.docType === "SO" && t.posted);
    if (!hasSO) {
      return {
        allowed: false,
        reason: "No posted Sales Order found — create SO before picking",
        reasonFr: "Aucune Commande client (SO) postée — créez la SO avant le prélèvement",
        reasonEn: "No posted Sales Order (SO) found — create a SO before picking."
      };
    }
    const scn003Shortage = detectScn003AtpShortage(state);
    if (scn003Shortage?.active) {
      return scn003ShortageBlockResult(scn003Shortage);
    }
  }
  if (step === "GI") {
    const hasPicking = state.completedSteps.includes("PICKING_M1");
    if (!hasPicking) {
      return {
        allowed: false,
        reason: "PICKING must be completed before Goods Issue",
        reasonFr: "Le prélèvement (PICKING) doit être complété avant la sortie marchandises (GI)",
        reasonEn: "Picking must be completed before Goods Issue (GI)."
      };
    }
    const pickingInExpedition = state.transactions.some(
      (t) => (t.docType === "PICKING" || t.docType === "PICKING_M1") && t.posted && EXPEDITION_BINS.includes(t.bin)
    );
    if (!pickingInExpedition) {
      return {
        allowed: false,
        reason: `Picking must have been posted to an EXPEDITION bin (${EXPEDITION_BINS.join(", ")}) before GI`,
        reasonFr: `Le prélèvement doit avoir été posté vers un emplacement EXPÉDITION (${EXPEDITION_BINS.join(", ")}) avant la GI`,
        reasonEn: `Picking must have been posted to a DISPATCH bin (${EXPEDITION_BINS.join(", ")}) before Goods Issue.`
      };
    }
    const scn003ShortageGi = detectScn003AtpShortage(state);
    if (scn003ShortageGi?.active) {
      return scn003ShortageBlockResult(scn003ShortageGi);
    }
  }
  if (step === "PO" && isScn003Scenario(state) && state.completedSteps.includes("SO")) {
    const shortage = detectScn003AtpShortage(state);
    if (shortage?.active && !state.completedSteps.includes("PO_CORRECTIVE")) {
      return {
        allowed: false,
        reason: "Corrective PO required — use PO_CORRECTIVE step",
        reasonFr: "PO corrective requise — utilisez l'étape PO corrective (ME21N) depuis Mission Control",
        reasonEn: "Corrective PO required — use the corrective PO (ME21N) step from Mission Control."
      };
    }
  }
  if (step === "GR" && isScn003Scenario(state) && state.completedSteps.includes("SO")) {
    const shortage = detectScn003AtpShortage(state);
    if (shortage?.active && !state.completedSteps.includes("GR_CORRECTIVE")) {
      return {
        allowed: false,
        reason: "Corrective GR required — use GR_CORRECTIVE step",
        reasonFr: "GR corrective requise — utilisez l'étape GR corrective (MIGO) depuis Mission Control",
        reasonEn: "Corrective GR required — use the corrective GR (MIGO) step from Mission Control."
      };
    }
  }
  if (step === "PUTAWAY_M1" && isScn003Scenario(state) && state.completedSteps.includes("SO")) {
    const shortage = detectScn003AtpShortage(state);
    if (shortage?.active && !state.completedSteps.includes("PUTAWAY_CORRECTIVE")) {
      return {
        allowed: false,
        reason: "Corrective putaway required — use PUTAWAY_CORRECTIVE step",
        reasonFr: "Rangement corrective requis — utilisez l'étape PUTAWAY corrective (LT0A) depuis Mission Control",
        reasonEn: "Corrective putaway required — use the corrective PUTAWAY (LT0A) step from Mission Control."
      };
    }
  }
  if (step === "PO_CORRECTIVE") {
    if (!state.completedSteps.includes("SO")) {
      return {
        allowed: false,
        reason: "SO must be completed before corrective PO",
        reasonFr: "La SO doit être complétée avant la PO corrective",
        reasonEn: "SO must be completed before the corrective PO."
      };
    }
    const shortage = detectScn003AtpShortage(state);
    if (!shortage?.active) {
      return {
        allowed: false,
        reason: "No ATP shortage — corrective PO not required",
        reasonFr: "Pas de pénurie ATP — PO corrective non requise",
        reasonEn: "No ATP shortage — corrective PO not required."
      };
    }
    if (state.completedSteps.includes("PO_CORRECTIVE")) {
      return {
        allowed: false,
        reason: "Corrective PO already completed",
        reasonFr: "PO corrective déjà complétée",
        reasonEn: "Corrective PO already completed."
      };
    }
    return { allowed: true };
  }
  if (step === "GR_CORRECTIVE") {
    if (!state.completedSteps.includes("PO_CORRECTIVE")) {
      return {
        allowed: false,
        reason: "Corrective PO must be completed first",
        reasonFr: "La PO corrective doit être complétée en premier",
        reasonEn: "Corrective PO must be completed first."
      };
    }
    const shortage = detectScn003AtpShortage(state);
    if (!shortage?.active) {
      return {
        allowed: false,
        reason: "No ATP shortage — corrective GR not required",
        reasonFr: "Pas de pénurie ATP — GR corrective non requise",
        reasonEn: "No ATP shortage — corrective GR not required."
      };
    }
    if (state.completedSteps.includes("GR_CORRECTIVE")) {
      return {
        allowed: false,
        reason: "Corrective GR already completed",
        reasonFr: "GR corrective déjà complétée",
        reasonEn: "Corrective GR already completed."
      };
    }
    return { allowed: true };
  }
  if (step === "PUTAWAY_CORRECTIVE") {
    if (!state.completedSteps.includes("GR_CORRECTIVE")) {
      return {
        allowed: false,
        reason: "Corrective GR must be completed first",
        reasonFr: "La GR corrective doit être complétée en premier",
        reasonEn: "Corrective GR must be completed first."
      };
    }
    const shortage = detectScn003AtpShortage(state);
    if (!shortage?.active) {
      return {
        allowed: false,
        reason: "No ATP shortage — corrective putaway not required",
        reasonFr: "Pas de pénurie ATP — rangement corrective non requis",
        reasonEn: "No ATP shortage — corrective putaway not required."
      };
    }
    if (state.completedSteps.includes("PUTAWAY_CORRECTIVE")) {
      return {
        allowed: false,
        reason: "Corrective putaway already completed",
        reasonFr: "Rangement corrective déjà complété",
        reasonEn: "Corrective putaway already completed."
      };
    }
    return { allowed: true };
  }
  if (step === "COMPLIANCE") {
    // SCN-004/005: ADJ required before opening compliance when variance is unresolved.
    // Other blockers (unposted GR, negative stock) are resolved ON this step — do not block access.
    const hasUnresolvedVariance = state.cycleCounts.some((c) => c.variance !== 0 && !c.resolved);
    if (hasUnresolvedVariance && !state.completedSteps.includes("ADJ")) {
      return {
        allowed: false,
        reason: "Unresolved inventory variance — complete ADJ (MI07) before compliance check",
        reasonFr: "Écart d'inventaire non résolu — complétez l'ajustement ADJ (MI07) avant la conformité",
        reasonEn: "Unresolved inventory variance — complete ADJ (MI07) before the compliance check.",
      };
    }
  }
  return { allowed: true };
}
export function validatePutaway(ctx) {
  if (!(ctx.toBin in ctx.binCapacities)) {
    return {
      allowed: false,
      reason: `Bin "${ctx.toBin}" does not exist in the warehouse master`,
      reasonFr: `L'emplacement "${ctx.toBin}" n'existe pas dans le référentiel entrepôt`,
      reasonEn: `Bin "${ctx.toBin}" does not exist in the warehouse master data.`
    };
  }
  const maxCap = ctx.binCapacities[ctx.toBin];
  const currentLoad = ctx.binCurrentLoad[ctx.toBin] ?? 0;
  if (currentLoad + ctx.qty > maxCap) {
    return {
      allowed: false,
      reason: `Bin "${ctx.toBin}" capacity exceeded: ${currentLoad + ctx.qty} > ${maxCap}`,
      reasonFr: `Capacité de l'emplacement "${ctx.toBin}" dépassée : ${currentLoad + ctx.qty} / ${maxCap} unités — débordement de ${currentLoad + ctx.qty - maxCap} unités`,
      reasonEn: `Bin "${ctx.toBin}" capacity exceeded: ${currentLoad + ctx.qty} / ${maxCap} units — overflow of ${currentLoad + ctx.qty - maxCap} units.`,
      penaltyEvent: "CAPACITY_OVERFLOW",
      penaltyPoints: -10
    };
  }
  const olderLots = ctx.existingLots.filter(
    (lot) => lot.receivedAt < ctx.receivedAt && lot.lotNumber !== ctx.lotNumber
  );
  if (olderLots.length > 0) {
    const oldest = olderLots[0];
    return {
      allowed: false,
      reason: `FIFO violation: lot ${oldest.lotNumber} (received ${oldest.receivedAt.toISOString()}) must be placed before ${ctx.lotNumber}`,
      reasonFr: `Violation FIFO : le lot ${oldest.lotNumber} (reçu le ${oldest.receivedAt.toLocaleDateString("fr-CA")}) doit être rangé avant le lot ${ctx.lotNumber}`,
      reasonEn: `FIFO violation: lot ${oldest.lotNumber} (received ${oldest.receivedAt.toLocaleDateString("en-CA")}) must be placed before lot ${ctx.lotNumber}.`,
      penaltyEvent: "FIFO_VIOLATION",
      penaltyPoints: -15
    };
  }
  return { allowed: true };
}
export function canExecuteStepM2(step, state) {
  const stepDef = MODULE2_STEPS.find((s) => s.code === step);
  if (!stepDef) return { allowed: false, reason: "Unknown M2 step", reasonFr: "Étape M2 inconnue", reasonEn: "Unknown M2 step" };
  if (stepDef.prerequisite && !state.completedSteps.includes(stepDef.prerequisite)) {
    const prereqDef = MODULE2_STEPS.find((s) => s.code === stepDef.prerequisite);
    return {
      allowed: false,
      reason: `Step ${stepDef.prerequisite} must be completed first`,
      reasonFr: `L'étape "${prereqDef?.labelFr}" doit être complétée en premier`,
      reasonEn: `Step "${prereqDef?.labelEn}" must be completed first`
    };
  }
  if (step === "PUTAWAY") {
    const hasGR = state.transactions.some((t) => t.docType === "GR" && t.posted);
    if (!hasGR) {
      return {
        allowed: false,
        reason: "No posted Goods Receipt — receive goods before putaway",
        reasonFr: "Aucune GR postée — réceptionnez les marchandises avant le rangement",
        reasonEn: "No posted Goods Receipt — receive goods before putaway."
      };
    }
  }
  if (step === "FIFO_PICK") {
    const hasPutaway = state.completedSteps.includes("PUTAWAY");
    if (!hasPutaway) {
      return {
        allowed: false,
        reason: "Putaway must be completed before FIFO pick",
        reasonFr: "Le rangement doit être complété avant le prélèvement FIFO",
        reasonEn: "Putaway must be completed before FIFO picking."
      };
    }
  }
  if (step === "COMPLIANCE_ADV") {
    const result = checkCompliance(state);
    if (!result.compliant) {
      return {
        allowed: false,
        reason: result.issues.join("; "),
        reasonFr: result.issuesFr.join("; ")
      };
    }
  }
  return { allowed: true };
}
export const M3_VARIANCE_THRESHOLD_DEFAULT = 5;
/** Default M3 variance threshold when scenario seed has no `adjustmentThreshold`. */
export const M3_VARIANCE_THRESHOLD = M3_VARIANCE_THRESHOLD_DEFAULT;

export type ValidationResult = {
  allowed: boolean;
  complete?: boolean;
  reason?: string;
  reasonFr?: string;
  reasonEn?: string;
};

export type M3CycleCountTarget = {
  sku: string;
  bin?: string;
  systemQty: number;
  physicalQty: number;
};

export type M3ReplenishmentParam = {
  sku: string;
  minQty: number;
  maxQty: number;
  safetyStock: number;
  leadTimeDays?: number;
};

export type M3InitialStateJson = {
  adjustmentThreshold?: number;
  cycleCountTargets?: M3CycleCountTarget[];
  replenishmentParams?: M3ReplenishmentParam[];
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

export type M3TransactionRow = {
  docType: string;
  sku: string;
  bin: string;
  qty: number | string;
  posted: boolean;
};

export function getM3VarianceThreshold(initialStateJson?: M3InitialStateJson): number {
  const t = initialStateJson?.adjustmentThreshold;
  return typeof t === "number" && t > 0 ? t : M3_VARIANCE_THRESHOLD_DEFAULT;
}

export function computeVariance(systemQty, countedQty, threshold = M3_VARIANCE_THRESHOLD_DEFAULT) {
  const varianceQty = countedQty - systemQty;
  return {
    varianceQty,
    requiresJustification: Math.abs(varianceQty) >= threshold,
  };
}
export function validateVarianceEntry(systemQty, countedQty, reason, threshold = M3_VARIANCE_THRESHOLD_DEFAULT) {
  const { varianceQty, requiresJustification } = computeVariance(systemQty, countedQty, threshold);
  if (requiresJustification && (!reason || reason.trim().length < 5)) {
    return {
      allowed: false,
      reason: `Variance of ${varianceQty} exceeds threshold (${threshold}); justification required`,
      reasonFr: `L'écart de ${varianceQty} dépasse le seuil (${threshold}) — une justification est obligatoire`,
      reasonEn: `Variance of ${varianceQty} exceeds the threshold (${threshold}) — a justification is required.`
    };
  }
  return { allowed: true };
}
export function validateAdjustment(varianceQty, adjustmentQty) {
  if (Math.abs(adjustmentQty - varianceQty) > 0.01) {
    return {
      allowed: false,
      reason: `Adjustment qty (${adjustmentQty}) must equal variance qty (${varianceQty})`,
      reasonFr: `La quantité d'ajustement (${adjustmentQty}) doit correspondre à l'écart (${varianceQty})`,
      reasonEn: `Adjustment quantity (${adjustmentQty}) must match the variance quantity (${varianceQty}).`
    };
  }
  return { allowed: true };
}

/** ADJ / MI07 — inventory variance qty may be positive (surplus) or negative (write-off); zero is invalid. */
export function validateAdjQuantity(adjustmentQty: number) {
  if (typeof adjustmentQty !== "number" || Number.isNaN(adjustmentQty) || adjustmentQty === 0) {
    return {
      allowed: false,
      reason: "Inventory adjustment qty must be non-zero (positive or negative)",
      reasonFr: "Saisissez un écart d'inventaire positif ou négatif. La valeur 0 n'est pas acceptée.",
      reasonEn: "Enter a positive or negative inventory variance. Zero is not accepted.",
    };
  }
  return { allowed: true };
}
export function computeReplenishmentSuggestion(input) {
  const { sku, systemQty, minQty, maxQty, safetyStock } = input;
  const isCritical = systemQty < safetyStock;
  const needsReplenishment = systemQty < minQty;
  if (!needsReplenishment) {
    return { sku, systemQty, suggestedQty: 0, reason: "Stock suffisant", isCritical, needsReplenishment };
  }
  const suggestedQty = maxQty - systemQty;
  const reasons = ["Below Min"];
  if (isCritical) reasons.push("Safety Stock");
  return { sku, systemQty, suggestedQty, reason: reasons.join(" + "), isCritical, needsReplenishment };
}

export function getCycleCountTargets(initialStateJson?: M3InitialStateJson): M3CycleCountTarget[] {
  const raw = initialStateJson?.cycleCountTargets;
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (t): t is M3CycleCountTarget =>
        t != null &&
        typeof t.sku === "string" &&
        typeof t.systemQty === "number" &&
        typeof t.physicalQty === "number",
    )
    .map((t) => ({ ...t }));
}

export function getReplenishmentParamsFromSeed(initialStateJson?: M3InitialStateJson): M3ReplenishmentParam[] {
  const raw = initialStateJson?.replenishmentParams;
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (p): p is M3ReplenishmentParam =>
        p != null &&
        typeof p.sku === "string" &&
        typeof p.minQty === "number" &&
        typeof p.maxQty === "number" &&
        typeof p.safetyStock === "number",
    )
    .map((p) => ({ ...p }));
}

export function parseStudentQtyFromReplenishReason(reason: string): number | null {
  const match = reason.match(/studentQty=(-?\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
}

export function formatReplenishReasonWithStudentQty(baseReason: string, studentQty: number): string {
  const stripped = baseReason.replace(/;studentQty=-?\d+(?:\.\d+)?/g, "").trim();
  return `${stripped};studentQty=${studentQty}`;
}

export function hasM3ReplenishmentPlanning(initialStateJson?: M3InitialStateJson): boolean {
  return getReplenishmentParamsFromSeed(initialStateJson).length > 0;
}

type M3PipelineStepKey = keyof typeof M3_STEP_MAX;
type M3ScaledStepKey = keyof typeof M3_STEP_MAX_SCALED;
type M3StepAwardKey = M3PipelineStepKey | M3ScaledStepKey;

export function getM3StepAwardPoints(
  step: M3StepAwardKey,
  initialStateJson?: M3InitialStateJson,
): number {
  if (hasM3ReplenishmentPlanning(initialStateJson)) {
    const pipelineStep = step as M3PipelineStepKey;
    if (pipelineStep === "ROP_CHECK") return M3_STEP_MAX.ROP_CHECK;
    if (pipelineStep === "EOQ_CALC") return M3_STEP_MAX.EOQ_CALC;
    if (pipelineStep in M3_STEP_MAX) {
      return M3_STEP_MAX[pipelineStep];
    }
  }
  const scaledKey = step as M3ScaledStepKey;
  if (scaledKey in M3_STEP_MAX_SCALED) return M3_STEP_MAX_SCALED[scaledKey];
  return 0;
}

export function getM3ReplenishStepDisplayMax(initialStateJson?: M3InitialStateJson): number {
  if (hasM3ReplenishmentPlanning(initialStateJson)) {
    return M3_STEP_MAX.ROP_CHECK + M3_STEP_MAX.EOQ_CALC + M3_STEP_MAX.REPLENISH;
  }
  return M3_STEP_MAX_SCALED.REPLENISH;
}

export function scoreM3ReplenishQtyPoints(diff: number): number {
  if (diff === 0) return M3_STEP_MAX.REPLENISH;
  if (diff <= 10) return 15;
  if (diff <= 25) return 10;
  return 5;
}

export function scoreM3ReplenishQtyFromSuggestions(
  params: M3ReplenishmentParam[],
  suggestions: M3ReplenishmentSuggestionRow[],
): number {
  if (params.length === 0) return M3_STEP_MAX.REPLENISH;
  let worst: number = M3_STEP_MAX.REPLENISH;
  for (const param of params) {
    const row = suggestions.find((s) => s.sku === param.sku);
    if (!row) return 5;
    const expected = computeReplenishmentSuggestion({
      sku: param.sku,
      systemQty: Number(row.systemQty),
      minQty: param.minQty,
      maxQty: param.maxQty,
      safetyStock: param.safetyStock,
    });
    const studentQty = parseStudentQtyFromReplenishReason(row.reason);
    const diff = studentQty === null ? Number.POSITIVE_INFINITY : Math.abs(studentQty - expected.suggestedQty);
    worst = Math.min(worst, scoreM3ReplenishQtyPoints(diff));
  }
  return worst;
}

function findCountRow(counts: M3InventoryCountRow[], sku: string): M3InventoryCountRow | undefined {
  return counts.find((c) => c.sku === sku);
}

export function validateCycleCountListComplete(
  targets: M3CycleCountTarget[],
  listedSkus: string[],
): ValidationResult & { complete: boolean } {
  if (targets.length === 0) return { allowed: true, complete: true };
  const missing = targets.filter((t) => !listedSkus.includes(t.sku)).map((t) => t.sku);
  if (missing.length > 0) {
    return {
      allowed: false,
      complete: false,
      reason: `Count list must include all target SKUs: missing ${missing.join(", ")}`,
      reasonFr: `La liste de comptage doit inclure tous les SKU requis : manquant ${missing.join(", ")}`,
      reasonEn: `Count list must include all required SKUs: missing ${missing.join(", ")}`,
    };
  }
  return { allowed: true, complete: true };
}

export function validateCycleCountEntriesComplete(
  targets: M3CycleCountTarget[],
  counts: M3InventoryCountRow[],
): ValidationResult & { complete: boolean } {
  // hotfix(rc13): CC_COUNT completes when all target SKUs have been counted (any qty).
  // Exact physicalQty match is NOT required here — the student enters their observed count
  // and the variance is computed and reconciled in CC_RECON. Requiring an exact match
  // caused the step to loop indefinitely because the student had no way to know the
  // expected physical quantity.
  if (targets.length === 0) return { allowed: true, complete: true };
  const issues: string[] = [];
  const issuesFr: string[] = [];
  for (const target of targets) {
    const row = findCountRow(counts, target.sku);
    if (!row) {
      issues.push(`Missing count for ${target.sku}`);
      issuesFr.push(`Comptage manquant pour ${target.sku}`);
    }
  }
  if (issues.length > 0) {
    return {
      allowed: false,
      complete: false,
      reason: issues.join("; "),
      reasonFr: issuesFr.join(" ; "),
      reasonEn: issues.join("; "),
    };
  }
  return { allowed: true, complete: true };
}

export function validateCycleCountReconComplete(
  targets: M3CycleCountTarget[],
  counts: M3InventoryCountRow[],
  adjustments: M3InventoryAdjustmentRow[],
  transactions: M3TransactionRow[],
): ValidationResult & { complete: boolean } {
  const entriesCheck = validateCycleCountEntriesComplete(targets, counts);
  if (!entriesCheck.complete) return entriesCheck;

  const issues: string[] = [];
  const issuesFr: string[] = [];
  for (const target of targets) {
    const row = findCountRow(counts, target.sku)!;
    const varianceQty = Number(row.countedQty) - Number(row.systemQty);
    if (varianceQty === 0) continue;

    const adj = adjustments.find((a) => a.sku === target.sku);
    if (!adj || Number(adj.adjustmentQty) !== varianceQty) {
      issues.push(`${target.sku}: variance ${varianceQty} not reconciled with matching ADJ`);
      issuesFr.push(`${target.sku} : écart ${varianceQty} non réconcilié par un ADJ correspondant`);
      continue;
    }

    const postedAdj = transactions.some(
      (t) => t.docType === "ADJ" && t.sku === target.sku && t.posted && Number(t.qty) === varianceQty,
    );
    if (!postedAdj) {
      issues.push(`${target.sku}: missing posted ADJ transaction for variance ${varianceQty}`);
      issuesFr.push(`${target.sku} : transaction ADJ postée manquante pour l'écart ${varianceQty}`);
    }
  }

  if (issues.length > 0) {
    return {
      allowed: false,
      complete: false,
      reason: issues.join("; "),
      reasonFr: issuesFr.join(" ; "),
      reasonEn: issues.join("; "),
    };
  }
  return { allowed: true, complete: true };
}

export function validateReplenishmentComplete(
  params: M3ReplenishmentParam[],
  suggestions: M3ReplenishmentSuggestionRow[],
): ValidationResult & { complete: boolean } {
  if (params.length === 0) return { allowed: true, complete: true };

  const issues: string[] = [];
  const issuesFr: string[] = [];
  for (const param of params) {
    const row = suggestions.find((s) => s.sku === param.sku);
    if (!row) {
      issues.push(`Missing replenishment for ${param.sku}`);
      issuesFr.push(`Réapprovisionnement manquant pour ${param.sku}`);
      continue;
    }

    const expected = computeReplenishmentSuggestion({
      sku: param.sku,
      systemQty: Number(row.systemQty),
      minQty: param.minQty,
      maxQty: param.maxQty,
      safetyStock: param.safetyStock,
    });
    const suggestedQty = Number(row.suggestedQty);
    const studentQty = parseStudentQtyFromReplenishReason(row.reason);

    if (suggestedQty !== expected.suggestedQty) {
      issues.push(`${param.sku}: invalid system suggestion ${suggestedQty}`);
      issuesFr.push(`${param.sku} : suggestion système invalide ${suggestedQty}`);
    }
    if (studentQty === null || studentQty !== expected.suggestedQty) {
      issues.push(`${param.sku}: student qty must equal ${expected.suggestedQty}`);
      issuesFr.push(`${param.sku} : quantité étudiant doit être ${expected.suggestedQty}`);
    }
  }

  if (issues.length > 0) {
    return {
      allowed: false,
      complete: false,
      reason: issues.join("; "),
      reasonFr: issuesFr.join(" ; "),
      reasonEn: issues.join("; "),
    };
  }
  return { allowed: true, complete: true };
}

export function validateM3Compliance(input: {
  initialStateJson?: M3InitialStateJson;
  inventoryCounts: M3InventoryCountRow[];
  inventoryAdjustments: M3InventoryAdjustmentRow[];
  replenishmentSuggestions: M3ReplenishmentSuggestionRow[];
  transactions: M3TransactionRow[];
}): ValidationResult {
  const issues: string[] = [];
  const issuesFr: string[] = [];

  const targets = getCycleCountTargets(input.initialStateJson);
  const replenishParams = getReplenishmentParamsFromSeed(input.initialStateJson);
  const varianceThreshold = getM3VarianceThreshold(input.initialStateJson);

  const countCheck = validateCycleCountEntriesComplete(targets, input.inventoryCounts);
  if (!countCheck.complete) {
    issues.push(...(countCheck.reason?.split("; ") ?? []));
    issuesFr.push(...(countCheck.reasonFr?.split(" ; ") ?? []));
  }

  const reconCheck = validateCycleCountReconComplete(
    targets,
    input.inventoryCounts,
    input.inventoryAdjustments,
    input.transactions,
  );
  if (!reconCheck.complete && reconCheck.reason) {
    for (const part of reconCheck.reason.split("; ")) {
      if (part && !issues.includes(part)) issues.push(part);
    }
    for (const part of (reconCheck.reasonFr ?? "").split(" ; ")) {
      if (part && !issuesFr.includes(part)) issuesFr.push(part);
    }
  }

  for (const adj of input.inventoryAdjustments) {
    if (Number(adj.adjustmentQty) === 0) continue;
    const countRow = findCountRow(input.inventoryCounts, adj.sku);
    const systemQty = countRow ? Number(countRow.systemQty) : 0;
    const countedQty = countRow ? Number(countRow.countedQty) : systemQty + Number(adj.varianceQty);
    const justificationCheck = validateVarianceEntry(
      systemQty,
      countedQty,
      adj.reason ?? "",
      varianceThreshold,
    );
    if (!justificationCheck.allowed) {
      issues.push(justificationCheck.reason ?? `Missing justification for ${adj.sku}`);
      issuesFr.push(justificationCheck.reasonFr ?? `Justification manquante pour ${adj.sku}`);
    }
  }

  const replenishCheck = validateReplenishmentComplete(replenishParams, input.replenishmentSuggestions);
  if (!replenishCheck.complete && replenishCheck.reason) {
    for (const part of replenishCheck.reason.split("; ")) {
      if (part && !issues.includes(part)) issues.push(part);
    }
    for (const part of (replenishCheck.reasonFr ?? "").split(" ; ")) {
      if (part && !issuesFr.includes(part)) issuesFr.push(part);
    }
  }

  const unposted = input.transactions.filter((t) => !t.posted);
  if (unposted.length > 0) {
    issues.push(`${unposted.length} unposted transaction(s) detected`);
    issuesFr.push(`${unposted.length} transaction(s) non postée(s) détectée(s)`);
  }

  return {
    allowed: issues.length === 0,
    reason: issues.join("; "),
    reasonFr: issuesFr.join(" ; "),
    reasonEn: issues.join("; "),
  };
}

export type M4InitialStateJson = {
  kpiData?: KpiData;
  context?: string;
  module?: number;
};

export type M4KpiInterpretationRow = {
  kpiKey: string;
  studentAnswer: string;
  isCorrect: boolean;
};

export type KpiData = {
  annualConsumption: number;
  averageStock: number;
  ordersFulfilled: number;
  totalOrders: number;
  operationalErrors: number;
  totalOperations: number;
  avgLeadTimeDays: number;
  stockValue: number;
};

/** Annexe A canonical KPI bundle (6× rotation, 95% service, 4% errors, 3.5j lead time, 48k$). */
export const CANONICAL_M4_KPI_DATA: KpiData = {
  annualConsumption: 2400,
  averageStock: 400,
  ordersFulfilled: 285,
  totalOrders: 300,
  operationalErrors: 12,
  totalOperations: 300,
  avgLeadTimeDays: 3.5,
  stockValue: 48000,
};

export function getM4KpiDataFromSeed(initialStateJson?: M4InitialStateJson | null): KpiData {
  return initialStateJson?.kpiData ?? CANONICAL_M4_KPI_DATA;
}

function normM4Text(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
}

function m4HasTerm(text: string, terms: string[]): boolean {
  const n = normM4Text(text);
  return terms.some((t) => n.includes(normM4Text(t)));
}

function countM4KpiDomains(text: string): number {
  let count = 0;
  if (m4HasTerm(text, ["rotation"])) count++;
  if (m4HasTerm(text, ["service"])) count++;
  if (m4HasTerm(text, ["erreur", "error"])) count++;
  if (m4HasTerm(text, ["lead time", "delai", "3,5", "3.5"])) count++;
  return count;
}

export function validateM4Compliance(input: {
  scnCode: string | null;
  completedSteps: string[];
  kpiInterpretations: M4KpiInterpretationRow[];
  kpiResult: ReturnType<typeof calculateKpis>;
}): ValidationResult {
  const issues: string[] = [];
  const issuesFr: string[] = [];

  for (const step of ["KPI_DATA", "KPI_ROTATION", "KPI_SERVICE", "KPI_DIAGNOSTIC"]) {
    if (!input.completedSteps.includes(step)) {
      issues.push(`Missing step ${step}`);
      issuesFr.push(`Étape manquante : ${step}`);
    }
  }

  const rotationRow = input.kpiInterpretations.find((r) => r.kpiKey === "rotationRate");
  const serviceRow = input.kpiInterpretations.find((r) => r.kpiKey === "serviceLevel");
  const diagnosticRow = input.kpiInterpretations.find((r) => r.kpiKey === "diagnostic");

  if (!rotationRow) {
    issues.push("Missing rotation interpretation");
    issuesFr.push("Interprétation rotation manquante");
  } else if (!rotationRow.isCorrect) {
    issues.push("Incorrect rotation interpretation");
    issuesFr.push("Interprétation rotation incorrecte");
  } else if (input.kpiResult.rotationStatus === "normal") {
    const ans = normM4Text(rotationRow.studentAnswer);
    if (ans.includes("surstock") || ans.includes("sur-stock") || ans.includes("exces")) {
      issues.push("Rotation classified as overstock when engine says normal (6×)");
      issuesFr.push("Rotation classée surstock alors que la bande est normale (6×)");
    }
  }

  if (!serviceRow) {
    issues.push("Missing service interpretation");
    issuesFr.push("Interprétation service manquante");
  } else if (!serviceRow.isCorrect) {
    issues.push("Incorrect service interpretation");
    issuesFr.push("Interprétation service incorrecte");
  }

  const diagnosticTemplateTerms = ["recommand", "action", "strategie", "decision"];
  if (!diagnosticRow) {
    issues.push("Missing diagnostic");
    issuesFr.push("Diagnostic manquant");
  } else {
    const diag = diagnosticRow.studentAnswer.trim();
    if (diag.length < 50) {
      issues.push("Diagnostic too short (< 50 chars)");
      issuesFr.push("Diagnostic trop court (< 50 caractères)");
    }
    if (!m4HasTerm(diag, diagnosticTemplateTerms)) {
      issues.push("Diagnostic missing recommendation/action vocabulary");
      issuesFr.push("Diagnostic sans vocabulaire recommandation/action/stratégie/décision");
    }

    const scn = input.scnCode?.toUpperCase() ?? "";

    if (scn === "SCN-012") {
      if (input.kpiResult.rotationStatus === "normal") {
        if (!m4HasTerm(diag, ["mainten", "surveill", "monitor", "sku", "politique"])) {
          issues.push("SCN-012: missing maintain/monitor policy stance");
          issuesFr.push("SCN-012 : politique de maintien/surveillance SKU attendue");
        }
        const blanketDestock =
          m4HasTerm(diag, ["destock", "surstock", "reduction massive"]) &&
          !m4HasTerm(diag, ["sku", "reference", "article"]);
        if (blanketDestock) {
          issues.push("SCN-012: blanket destock without SKU caveat");
          issuesFr.push("SCN-012 : destock global sans nuance SKU");
        }
      }
      if (
        m4HasTerm(diag, ["rien a faire", "aucune action"]) ||
        (m4HasTerm(diag, ["excellent"]) &&
          !m4HasTerm(diag, ["surveill", "monitor", "mainten", "action", "recommand"]))
      ) {
        issues.push("SCN-012: complacency without actionable next step");
        issuesFr.push("SCN-012 : complaisance sans prochaine action");
      }
    }

    if (scn === "SCN-013") {
      if (input.kpiResult.serviceLevelStatus === "excellent") {
        if (!m4HasTerm(serviceRow?.studentAnswer ?? "", ["excellent", "tres bon", "optimal"])) {
          issues.push("SCN-013: service answer must acknowledge excellent status");
          issuesFr.push("SCN-013 : reconnaissance du service excellent requise");
        }
      }
      const hasErrorLink =
        m4HasTerm(diag, ["erreur", "error"]) &&
        m4HasTerm(diag, ["picking", "prélèvement", "prelevement", "reception", "receiving", "otif"]);
      if (!hasErrorLink) {
        issues.push("SCN-013: diagnostic must correlate errors with picking/receiving/OTIF");
        issuesFr.push("SCN-013 : corrélation erreurs picking/réception/OTIF requise");
      }
      const hasPercent = /\d+\s*%/.test(diag);
      const hasNumeric = hasPercent || countM4KpiDomains(diag) >= 3;
      const hasHorizon = m4HasTerm(diag, ["90", "hebdo", "semaine"]);
      if (!hasNumeric || !hasHorizon) {
        issues.push("SCN-013: measurable plan with % or 90/hebdo horizon required");
        issuesFr.push("SCN-013 : plan chiffré (% ou horizon 90 jours/hebdo) requis");
      }
      const destockPrimary =
        m4HasTerm(diag, ["destock", "surstock"]) &&
        !m4HasTerm(diag, ["picking", "prelevement", "reception", "execution", "qualite", "formation"]);
      if (destockPrimary) {
        issues.push("SCN-013: destock as primary lever without execution framing");
        issuesFr.push("SCN-013 : destock comme levier principal sans cadrage exécution");
      }
    }

    if (scn === "SCN-014") {
      const domainCount = countM4KpiDomains(diag);
      if (domainCount < 3) {
        issues.push("SCN-014: diagnostic must cite at least 3 KPI domains");
        issuesFr.push("SCN-014 : au moins 3 domaines KPI requis");
      }
      if (!m4HasTerm(diag, ["report", "differ", "maintien", "sacrifi", "priori", "trade-off", "tradeoff", "arbitrage"])) {
        issues.push("SCN-014: trade-off language required");
        issuesFr.push("SCN-014 : vocabulaire arbitrage/trade-off requis");
      }
      if (diag.length < 150) {
        issues.push("SCN-014: diagnostic must be >= 150 chars");
        issuesFr.push("SCN-014 : diagnostic ≥ 150 caractères requis");
      }
      if (domainCount >= 3 && !m4HasTerm(diag, ["lead time", "delai", "3,5", "3.5"])) {
        issues.push("SCN-014: lead time mention required");
        issuesFr.push("SCN-014 : mention du délai / lead time requise");
      }
    }
  }

  return {
    allowed: issues.length === 0,
    reason: issues.join("; "),
    reasonFr: issuesFr.join(" ; "),
    reasonEn: issues.join("; "),
  };
}

export function canExecuteStepM3(step, completedSteps) {
  const stepDef = MODULE3_STEPS.find((s) => s.code === step);
  if (!stepDef) return { allowed: false, reason: "Unknown M3 step", reasonFr: "Étape M3 inconnue", reasonEn: "Unknown M3 step" };
  if (stepDef.prerequisite && !completedSteps.includes(stepDef.prerequisite)) {
    const prereqDef = MODULE3_STEPS.find((s) => s.code === stepDef.prerequisite);
    return {
      allowed: false,
      reason: `Step ${stepDef.prerequisite} must be completed first`,
      reasonFr: `L'étape "${prereqDef?.labelFr}" doit être complétée en premier`,
      reasonEn: `Step "${prereqDef?.labelEn}" must be completed first`
    };
  }
  return { allowed: true };
}
export function isModuleUnlocked(moduleUnlockedByModuleId, passedModuleIds) {
  if (moduleUnlockedByModuleId === null) return true;
  return passedModuleIds.includes(moduleUnlockedByModuleId);
}
export function isModule3Unlocked(module2Progress) {
  if (!module2Progress) return false;
  return module2Progress.passed && module2Progress.teacherValidated;
}
export function calculateInventory(transactions) {
  const inventory = {};
  for (const tx of transactions) {
    if (!tx.posted) continue;
    const key = `${tx.sku}::${tx.bin}`;
    if (!(key in inventory)) inventory[key] = 0;
    if (tx.docType === "GR" || tx.docType === "ADJ" || tx.docType === "PUTAWAY" || tx.docType === "PUTAWAY_M1" || tx.docType === "PICKING" || tx.docType === "PICKING_M1") {
      inventory[key] += Number(tx.qty);
    } else if (tx.docType === "GI") {
      inventory[key] -= Number(tx.qty);
    }
  }
  return inventory;
}
export function calculateBinLoad(transactions) {
  const load = {};
  for (const tx of transactions) {
    if (!tx.posted) continue;
    if (tx.docType === "PUTAWAY" || tx.docType === "PUTAWAY_M1" || tx.docType === "GR" || tx.docType === "PICKING" || tx.docType === "PICKING_M1") {
      load[tx.bin] = (load[tx.bin] ?? 0) + Number(tx.qty);
    } else if (tx.docType === "GI") {
      load[tx.bin] = (load[tx.bin] ?? 0) - Number(tx.qty);
    }
  }
  return load;
}
export function canIssueStock(sku, bin, qty, inventory) {
  const key = `${sku}::${bin}`;
  const available = inventory[key] ?? 0;
  if (available < qty) {
    return {
      allowed: false,
      reason: `Insufficient stock: ${available} available, ${qty} requested`,
      reasonFr: `Stock insuffisant : ${available} disponible, ${qty} demandé — approvisionnement requis`,
      reasonEn: `Insufficient stock: ${available} available, ${qty} requested — replenishment required.`
    };
  }
  return { allowed: true };
}
export function checkCompliance(state) {
  const issues = [];
  const issuesFr = [];
  const unposted = state.transactions.filter((t) => !t.posted);
  if (unposted.length > 0) {
    issues.push(`${unposted.length} unposted transaction(s) detected`);
    issuesFr.push(`${unposted.length} transaction(s) non postée(s) détectée(s)`);
  }
  for (const [key, qty] of Object.entries(state.inventory)) {
    if (qty < 0) {
      const [sku, bin] = key.split("::");
      issues.push(`Negative stock: ${sku} in ${bin} (${qty})`);
      issuesFr.push(`Stock négatif : ${sku} dans ${bin} (${qty})`);
    }
  }
  const unresolved = state.cycleCounts.filter((c) => c.variance !== 0 && !c.resolved);
  if (unresolved.length > 0) {
    issues.push(`${unresolved.length} unresolved inventory variance(s)`);
    issuesFr.push(`${unresolved.length} écart(s) d'inventaire non résolu(s) — ADJ requis`);
  }
  return { compliant: issues.length === 0, issues, issuesFr };
}
export function getNextRequiredStep(completedSteps, moduleId = 1, state) {
  let steps;
  if (moduleId === 1) {
    steps = getEffectiveM1Steps(state);
  } else {
    steps = moduleId === 3 ? MODULE3_STEPS : moduleId === 2 ? MODULE2_STEPS : MODULE1_STEPS;
  }

  // SCN-002/005: any unposted GR blocks later steps until posted
  if (moduleId === 1 && state?.transactions) {
    const ghostGrPending = state.transactions.some((t) => t.docType === "GR" && !t.posted);
    if (ghostGrPending) {
      return steps.find((s) => s.code === "GR") ?? null;
    }
  }

  for (const step of steps) {
    if (!completedSteps.includes(step.code)) {
      return step;
    }
  }
  return null;
}
export function calculateProgressPct(completedSteps, moduleId = 1) {
  const steps = moduleId === 3 ? MODULE3_STEPS : moduleId === 2 ? MODULE2_STEPS : MODULE1_STEPS;
  return Math.round(completedSteps.length / steps.length * 100);
}
export const MODULE4_STEPS = [
  { code: "KPI_DATA", labelFr: "Briefing tour de contrôle KPI", labelEn: "KPI Control Tower Briefing", order: 1, prerequisite: null, moduleId: 4 },
  { code: "KPI_ROTATION", labelFr: "Interprétation rotation — décision politique stock", labelEn: "Turnover Interpretation — Stock Policy Decision", order: 2, prerequisite: "KPI_DATA", moduleId: 4 },
  { code: "KPI_SERVICE", labelFr: "Service et erreurs — risque OTIF", labelEn: "Service & Errors — OTIF Risk", order: 3, prerequisite: "KPI_ROTATION", moduleId: 4 },
  { code: "KPI_DIAGNOSTIC", labelFr: "Synthèse décisionnelle multi-KPI", labelEn: "Multi-KPI Decision Synthesis", order: 4, prerequisite: "KPI_SERVICE", moduleId: 4 },
  { code: "COMPLIANCE_M4", labelFr: "Validation conformité interprétations M4", labelEn: "M4 Interpretation Compliance Validation", order: 5, prerequisite: "KPI_DIAGNOSTIC", moduleId: 4 }
];

/** M4 step maxima — authoritative for runtime awards and report display (10+20+20+25+25 = 100). */
export const M4_STEP_MAX: Record<string, number> = {
  KPI_DATA: 10,
  KPI_ROTATION: 20,
  KPI_SERVICE: 20,
  KPI_DIAGNOSTIC: 25,
  COMPLIANCE_M4: 25,
};

export const M4_PERFECT_RUN_TOTAL = Object.values(M4_STEP_MAX).reduce((sum, pts) => sum + pts, 0);
export function calculateKpis(data) {
  const rotationRate = data.averageStock > 0 ? data.annualConsumption / data.averageStock : 0;
  const serviceLevel = data.totalOrders > 0 ? data.ordersFulfilled / data.totalOrders : 0;
  const errorRate = data.totalOperations > 0 ? data.operationalErrors / data.totalOperations : 0;
  const rotationStatus = rotationRate > 12 ? "sous-performance" : rotationRate < 4 ? "surstock" : "normal";
  const serviceLevelStatus = serviceLevel >= 0.95 ? "excellent" : serviceLevel >= 0.85 ? "acceptable" : "insuffisant";
  const errorRateStatus = errorRate <= 0.01 ? "excellent" : errorRate <= 0.05 ? "acceptable" : "critique";
  return {
    rotationRate: Math.round(rotationRate * 100) / 100,
    serviceLevel: Math.round(serviceLevel * 1e4) / 1e4,
    errorRate: Math.round(errorRate * 1e4) / 1e4,
    averageLeadTime: data.avgLeadTimeDays,
    stockImmobilizedValue: data.stockValue,
    rotationStatus,
    serviceLevelStatus,
    errorRateStatus
  };
}
export function scoreKpiInterpretation(kpiKey, studentAnswer, kpiResult) {
  const answer = studentAnswer.toLowerCase().trim();
  if (kpiKey === "rotationRate") {
    const correct = kpiResult.rotationStatus;
    const isCorrect = correct === "surstock" && (answer.includes("surstock") || answer.includes("sur-stock") || answer.includes("excès")) || correct === "normal" && (answer.includes("normal") || answer.includes("optimal") || answer.includes("équilibr")) || correct === "sous-performance" && (answer.includes("sous") || answer.includes("rupture") || answer.includes("insuffisant"));
    return {
      isCorrect,
      pointsDelta: isCorrect ? M4_STEP_MAX.KPI_ROTATION : -5,
      feedback: isCorrect ? `Correct — taux de rotation ${kpiResult.rotationRate}x → situation ${correct}` : `Incorrect — taux ${kpiResult.rotationRate}x indique une situation de ${correct}`
    };
  }
  if (kpiKey === "serviceLevel") {
    const correct = kpiResult.serviceLevelStatus;
    const isCorrect = correct === "excellent" && (answer.includes("excellent") || answer.includes("très bon") || answer.includes("optimal")) || correct === "acceptable" && (answer.includes("acceptable") || answer.includes("moyen") || answer.includes("correct")) || correct === "insuffisant" && (answer.includes("insuffisant") || answer.includes("faible") || answer.includes("problème") || answer.includes("améliorer"));
    return {
      isCorrect,
      pointsDelta: isCorrect ? M4_STEP_MAX.KPI_SERVICE : -5,
      feedback: isCorrect ? `Correct — taux de service ${(kpiResult.serviceLevel * 100).toFixed(1)}% → ${correct}` : `Incorrect — ${(kpiResult.serviceLevel * 100).toFixed(1)}% indique un niveau ${correct}`
    };
  }
  if (kpiKey === "errorRate") {
    const correct = kpiResult.errorRateStatus;
    const isCorrect = correct === "excellent" && (answer.includes("excellent") || answer.includes("faible") || answer.includes("bien")) || correct === "acceptable" && (answer.includes("acceptable") || answer.includes("modéré") || answer.includes("correct")) || correct === "critique" && (answer.includes("critique") || answer.includes("élevé") || answer.includes("problème") || answer.includes("action"));
    return {
      isCorrect,
      pointsDelta: isCorrect ? 15 : -5,
      feedback: isCorrect ? `Correct — taux d'erreur ${(kpiResult.errorRate * 100).toFixed(2)}% → ${correct}` : `Incorrect — ${(kpiResult.errorRate * 100).toFixed(2)}% est un niveau ${correct}`
    };
  }
  const hasRecommendation = answer.length > 50 && (answer.includes("recommand") || answer.includes("action") || answer.includes("améliorer") || answer.includes("stratégie") || answer.includes("décision"));
  return {
    isCorrect: hasRecommendation,
    pointsDelta: hasRecommendation ? M4_STEP_MAX.KPI_DIAGNOSTIC : 0,
    feedback: hasRecommendation ? "Bonne analyse stratégique — recommandation pertinente identifiée" : "Analyse incomplète — une recommandation stratégique justifiée est attendue"
  };
}
export const MODULE5_STEPS = [
  { code: "M5_RECEPTION", labelFr: "Réception fournisseur", labelEn: "Supplier Reception", order: 1, prerequisite: null, moduleId: 5 },
  { code: "M5_PUTAWAY", labelFr: "Rangement et FIFO", labelEn: "Putaway & FIFO", order: 2, prerequisite: "M5_RECEPTION", moduleId: 5 },
  { code: "M5_CYCLE_COUNT", labelFr: "Inventaire cyclique", labelEn: "Cycle Count", order: 3, prerequisite: "M5_PUTAWAY", moduleId: 5 },
  { code: "M5_REPLENISH", labelFr: "Réapprovisionnement", labelEn: "Replenishment", order: 4, prerequisite: "M5_CYCLE_COUNT", moduleId: 5 },
  { code: "M5_KPI", labelFr: "Calcul des KPI", labelEn: "KPI Calculation", order: 5, prerequisite: "M5_REPLENISH", moduleId: 5 },
  { code: "M5_DECISION", labelFr: "Décision stratégique", labelEn: "Strategic Decision", order: 6, prerequisite: "M5_KPI", moduleId: 5 },
  { code: "COMPLIANCE_M5", labelFr: "Validation finale M5", labelEn: "M5 Final Validation", order: 7, prerequisite: "M5_DECISION", moduleId: 5 }
];

export type M5CycleCountTarget = {
  sku: string;
  bin: string;
  systemQty: number;
  physicalQty: number;
};

export type M5Contract = {
  sku: string;
  qty: number;
  poRef: string;
  lotNumber?: string;
  fromBin?: string;
  toBin?: string;
  decisionLevel?: "TACTICAL" | "STRATEGIC";
  varianceInjection?: number | null;
  cycleCountTargets?: M5CycleCountTarget[];
  kpiData?: KpiData;
  replenishmentParams?: { minQty: number; maxQty: number; safetyStock: number };
  profile?: "NOMINAL_INTEGRATED" | "EXCEPTION_VARIANCE" | "STRATEGIC_CAPSTONE";
};

export type M5InitialStateJson = {
  m5Contract?: M5Contract;
  context?: string;
  module?: number;
};

export type M5KpiSnapshotValues = {
  rotationRate: number;
  serviceLevel: number;
  errorRate: number;
  averageLeadTime: number;
  stockImmobilizedValue: number;
};

export type M5InventoryCountRow = {
  sku: string;
  systemQty?: number;
  countedQty?: number;
  varianceQty?: number;
};

export type M5InventoryAdjustmentRow = {
  sku: string;
  varianceQty: number;
  adjustmentQty?: number;
  reason?: string | null;
};

export type M5TransactionRow = {
  docType: string;
  sku: string;
  bin?: string;
  qty?: number;
  posted: boolean;
};

const M5_ADJ_STEP = {
  code: "M5_ADJ",
  labelFr: "Ajustement inventaire (MI07)",
  labelEn: "Inventory Adjustment (MI07)",
  order: 4,
  prerequisite: "M5_CYCLE_COUNT",
  moduleId: 5,
};

export function getM5ContractFromSeed(initialStateJson?: M5InitialStateJson | null): M5Contract | undefined {
  return initialStateJson?.m5Contract;
}

export function getM5KpiDataFromSeed(initialStateJson?: M5InitialStateJson | null): KpiData {
  return initialStateJson?.m5Contract?.kpiData ?? CANONICAL_M4_KPI_DATA;
}

export type M5KpiLedgerEvidence = {
  receivedQty: number;
  putawayQty: number;
  cycleCountQty: number | null;
  varianceQty: number;
  varianceResolved: boolean;
  replenishmentQty: number | null;
  stockQtyAtBin: number;
  evidenceSource: "run_ledger";
};

function sumPostedM5Qty(transactions: M5TransactionRow[], docType: string, sku: string): number {
  return transactions
    .filter((t) => t.posted && t.docType === docType && t.sku === sku)
    .reduce((sum, t) => sum + Math.abs(Number(t.qty ?? 0)), 0);
}

/** Derive M5 KPI inputs from run transactions, inventory counts, and contract bundle. */
export function deriveM5KpiFromRunEvidence(
  initialStateJson: M5InitialStateJson | null | undefined,
  state: {
    transactions: M5TransactionRow[];
    inventoryCounts: M5InventoryCountRow[];
    inventoryAdjustments: M5InventoryAdjustmentRow[];
    inventory: Record<string, number>;
    replenishmentQty?: number | null;
  },
): { kpiData: KpiData; evidence: M5KpiLedgerEvidence } {
  const contract = getM5ContractFromSeed(initialStateJson);
  const contractKpi = contract?.kpiData ?? CANONICAL_M4_KPI_DATA;
  const sku = contract?.sku ?? "SKU-001";
  const toBin = contract?.toBin ?? "B-01-R1-L1";

  const receivedQty = sumPostedM5Qty(state.transactions, "GR", sku);
  const putawayQty = sumPostedM5Qty(state.transactions, "PUTAWAY", sku);
  const countRow = state.inventoryCounts.find((c) => c.sku === sku);
  const cycleCountQty = countRow?.countedQty ?? null;
  const varianceQty = countRow?.varianceQty ?? 0;
  const varianceResolved = isM5VarianceResolved(
    initialStateJson,
    state.inventoryCounts,
    state.inventoryAdjustments,
    state.transactions,
  );

  const stockKey = `${sku}::${toBin}`;
  let stockQtyAtBin = state.inventory[stockKey] ?? 0;
  if (stockQtyAtBin <= 0) {
    stockQtyAtBin = cycleCountQty ?? putawayQty ?? receivedQty ?? contract?.qty ?? 0;
    if (!varianceResolved && varianceQty !== 0 && countRow?.countedQty != null) {
      stockQtyAtBin = countRow.countedQty;
    }
  }
  if (stockQtyAtBin < 0) stockQtyAtBin = 0;

  const unitValue = contractKpi.averageStock > 0
    ? contractKpi.stockValue / contractKpi.averageStock
    : 120;
  const rotationTarget = contractKpi.averageStock > 0
    ? contractKpi.annualConsumption / contractKpi.averageStock
    : 6;

  const averageStock = stockQtyAtBin > 0 ? stockQtyAtBin : contractKpi.averageStock;
  const annualConsumption = Math.round(averageStock * rotationTarget);
  const stockValue = Math.round(averageStock * unitValue);

  const kpiData: KpiData = {
    annualConsumption,
    averageStock,
    ordersFulfilled: contractKpi.ordersFulfilled,
    totalOrders: contractKpi.totalOrders,
    operationalErrors: contractKpi.operationalErrors,
    totalOperations: contractKpi.totalOperations,
    avgLeadTimeDays: contractKpi.avgLeadTimeDays,
    stockValue,
  };

  return {
    kpiData,
    evidence: {
      receivedQty,
      putawayQty,
      cycleCountQty,
      varianceQty,
      varianceResolved,
      replenishmentQty: state.replenishmentQty ?? null,
      stockQtyAtBin,
      evidenceSource: "run_ledger",
    },
  };
}

export function isCanonicalM5KpiPaste(kpiData: KpiData): boolean {
  const fields: (keyof KpiData)[] = [
    "annualConsumption", "averageStock", "ordersFulfilled", "totalOrders",
    "operationalErrors", "totalOperations", "avgLeadTimeDays", "stockValue",
  ];
  return fields.every((key) => Math.abs(kpiData[key] - CANONICAL_M4_KPI_DATA[key]) < 0.001);
}

function kpiDataMatchesWithinTolerance(a: KpiData, b: KpiData, pct = 0.05): boolean {
  const fields: (keyof KpiData)[] = [
    "annualConsumption", "averageStock", "ordersFulfilled", "totalOrders",
    "operationalErrors", "totalOperations", "avgLeadTimeDays", "stockValue",
  ];
  for (const key of fields) {
    const tol = Math.max(Math.abs(b[key]) * pct, 0.01);
    if (Math.abs(a[key] - b[key]) > tol) return false;
  }
  return true;
}

export function validateM5KpiSubmission(
  submitted: KpiData,
  derived: KpiData,
  options: { isDemo: boolean; confirmedFromLedger: boolean },
): ValidationResult {
  if (options.isDemo) {
    return { allowed: true };
  }
  if (!options.confirmedFromLedger) {
    return {
      allowed: false,
      reason: "Confirm KPI values are anchored to run ledger",
      reasonFr: "Confirmez que les KPI sont ancrés au moniteur d'exécution (coche requise)",
      reasonEn: "Confirm KPI values are anchored to run ledger (checkbox required)",
    };
  }
  if (isCanonicalM5KpiPaste(submitted)) {
    return {
      allowed: false,
      reason: "Canonical KPI paste rejected — derive from run ledger",
      reasonFr: "Coller les valeurs canoniques Annexe A est refusé — calculez depuis le moniteur",
      reasonEn: "Canonical KPI paste rejected — derive values from run ledger",
    };
  }
  if (!kpiDataMatchesWithinTolerance(submitted, derived, 0.05)) {
    return {
      allowed: false,
      reason: "KPI values must match run-derived ledger within tolerance",
      reasonFr: "Les KPI doivent correspondre aux valeurs dérivées du moniteur (±5 %)",
      reasonEn: "KPI values must match run-derived ledger within tolerance (±5%)",
    };
  }
  return { allowed: true };
}

export function formatM5KpiEvidenceSource(evidence: M5KpiLedgerEvidence): string {
  return [
    `source=${evidence.evidenceSource}`,
    `received=${evidence.receivedQty}`,
    `putaway=${evidence.putawayQty}`,
    `cycleCount=${evidence.cycleCountQty ?? "n/a"}`,
    `variance=${evidence.varianceQty}`,
    `varianceResolved=${evidence.varianceResolved}`,
    `replenish=${evidence.replenishmentQty ?? "n/a"}`,
    `stockAtBin=${evidence.stockQtyAtBin}`,
  ].join("|");
}

export function getM5CycleCountTargets(initialStateJson?: M5InitialStateJson | null): M5CycleCountTarget[] {
  const raw = initialStateJson?.m5Contract?.cycleCountTargets;
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (t) => t && typeof t.sku === "string" && typeof t.bin === "string"
      && typeof t.systemQty === "number" && typeof t.physicalQty === "number",
  );
}

export function hasM5VarianceContract(initialStateJson?: M5InitialStateJson | null): boolean {
  const contract = getM5ContractFromSeed(initialStateJson);
  if (contract?.varianceInjection != null && contract.varianceInjection !== 0) return true;
  return getM5CycleCountTargets(initialStateJson).some((t) => t.systemQty !== t.physicalQty);
}

export function getEffectiveM5Steps(
  initialStateJson?: M5InitialStateJson | null,
  state?: {
    inventoryCounts?: M5InventoryCountRow[];
    inventoryAdjustments?: M5InventoryAdjustmentRow[];
  },
): typeof MODULE5_STEPS {
  const runtimeVariance = (state?.inventoryCounts ?? []).some((c) => {
    const v = c.varianceQty ?? 0;
    if (v === 0) return false;
    const adj = (state?.inventoryAdjustments ?? []).some(
      (a) => a.sku === c.sku && Number(a.varianceQty) === v,
    );
    return !adj;
  });
  if (!hasM5VarianceContract(initialStateJson) && !runtimeVariance) {
    return MODULE5_STEPS;
  }
  const steps = [...MODULE5_STEPS];
  const ccIdx = steps.findIndex((s) => s.code === "M5_CYCLE_COUNT");
  steps.splice(ccIdx + 1, 0, { ...M5_ADJ_STEP });
  const replenishIdx = steps.findIndex((s) => s.code === "M5_REPLENISH");
  if (replenishIdx >= 0) {
    steps[replenishIdx] = { ...steps[replenishIdx], prerequisite: "M5_ADJ" };
  }
  return steps.map((s, i) => ({ ...s, order: i + 1 }));
}

export function isM5VarianceResolved(
  initialStateJson: M5InitialStateJson | null | undefined,
  inventoryCounts: M5InventoryCountRow[],
  inventoryAdjustments: M5InventoryAdjustmentRow[],
  transactions: M5TransactionRow[],
): boolean {
  const targets = getM5CycleCountTargets(initialStateJson);
  if (targets.length > 0) {
    for (const target of targets) {
      const expectedVariance = target.physicalQty - target.systemQty;
      if (expectedVariance === 0) continue;
      const hasAdj = inventoryAdjustments.some(
        (a) => a.sku === target.sku && Number(a.varianceQty) === expectedVariance,
      ) || transactions.some(
        (t) => t.docType === "ADJ" && t.sku === target.sku && t.posted
          && Number(t.qty ?? 0) === expectedVariance,
      );
      if (!hasAdj) return false;
    }
    return true;
  }
  for (const count of inventoryCounts) {
    const v = count.varianceQty ?? 0;
    if (v === 0) continue;
    const hasAdj = inventoryAdjustments.some(
      (a) => a.sku === count.sku && Number(a.varianceQty) === v,
    ) || transactions.some(
      (t) => t.docType === "ADJ" && t.sku === count.sku && t.posted,
    );
    if (!hasAdj) return false;
  }
  return true;
}

export function assertM5VarianceGate(
  initialStateJson: M5InitialStateJson | null | undefined,
  inventoryCounts: M5InventoryCountRow[],
  inventoryAdjustments: M5InventoryAdjustmentRow[],
  transactions: M5TransactionRow[],
): ValidationResult {
  if (!hasM5VarianceContract(initialStateJson) && inventoryCounts.every((c) => (c.varianceQty ?? 0) === 0)) {
    return { allowed: true };
  }
  if (isM5VarianceResolved(initialStateJson, inventoryCounts, inventoryAdjustments, transactions)) {
    return { allowed: true };
  }
  return {
    allowed: false,
    reason: "Unresolved inventory variance — post M5_ADJ (MI07) before continuing",
    reasonFr: "Écart d'inventaire non résolu — postez M5_ADJ (MI07) avant de continuer",
    reasonEn: "Unresolved inventory variance — post M5_ADJ (MI07) before continuing",
  };
}

export function validateM5Reception(
  input: { sku: string; qty: number; docRef: string },
  contract?: M5Contract,
): ValidationResult {
  if (!contract) return { allowed: true };
  const issues: string[] = [];
  const issuesFr: string[] = [];
  if (input.sku !== contract.sku) {
    issues.push(`Expected SKU ${contract.sku}, got ${input.sku}`);
    issuesFr.push(`SKU attendu : ${contract.sku}, saisi : ${input.sku}`);
  }
  if (input.qty !== contract.qty) {
    issues.push(`Expected qty ${contract.qty}, got ${input.qty}`);
    issuesFr.push(`Quantité attendue : ${contract.qty}, saisie : ${input.qty}`);
  }
  if (contract.poRef && input.docRef !== contract.poRef) {
    issues.push(`Expected PO ref ${contract.poRef}, got ${input.docRef}`);
    issuesFr.push(`Référence PO attendue : ${contract.poRef}, saisie : ${input.docRef}`);
  }
  return issues.length
    ? { allowed: false, reason: issues.join("; "), reasonFr: issuesFr.join(" ; "), reasonEn: issues.join("; ") }
    : { allowed: true };
}

export function validateM5Putaway(
  input: { sku: string; fromBin: string; toBin: string; qty: number; lotNumber?: string },
  contract?: M5Contract,
): ValidationResult {
  if (!contract) return { allowed: true };
  const issues: string[] = [];
  const issuesFr: string[] = [];
  if (input.sku !== contract.sku) {
    issues.push(`Expected SKU ${contract.sku}`);
    issuesFr.push(`SKU attendu : ${contract.sku}`);
  }
  if (contract.fromBin && input.fromBin !== contract.fromBin) {
    issues.push(`Expected fromBin ${contract.fromBin}`);
    issuesFr.push(`Bin source attendu : ${contract.fromBin}`);
  }
  if (contract.toBin && input.toBin !== contract.toBin) {
    issues.push(`Expected toBin ${contract.toBin}`);
    issuesFr.push(`Bin destination attendu : ${contract.toBin}`);
  }
  if (input.qty !== contract.qty) {
    issues.push(`Expected qty ${contract.qty}`);
    issuesFr.push(`Quantité attendue : ${contract.qty}`);
  }
  return issues.length
    ? { allowed: false, reason: issues.join("; "), reasonFr: issuesFr.join(" ; "), reasonEn: issues.join("; ") }
    : { allowed: true };
}

function extractNumericTokens(text: string): number[] {
  const matches = text.match(/\d+[.,]?\d*/g) ?? [];
  return matches.map((m) => Number(m.replace(",", "."))).filter((n) => !Number.isNaN(n));
}

function kpiValueMatches(cited: number, expected: number, tolerancePct = 0.08): boolean {
  if (Math.abs(cited - expected) <= Math.max(0.5, Math.abs(expected) * tolerancePct)) return true;
  if (expected >= 1000 && Math.abs(cited - expected / 1000) <= 1) return true;
  return false;
}

export function countM5KpiNumericCitations(text: string, snapshot: M5KpiSnapshotValues): number {
  const nums = extractNumericTokens(text);
  const kpiChecks = [
    snapshot.rotationRate,
    snapshot.serviceLevel <= 1 ? snapshot.serviceLevel * 100 : snapshot.serviceLevel,
    snapshot.errorRate <= 1 ? snapshot.errorRate * 100 : snapshot.errorRate,
    snapshot.averageLeadTime,
    snapshot.stockImmobilizedValue,
    snapshot.stockImmobilizedValue / 1000,
  ];
  let hits = 0;
  for (const expected of kpiChecks) {
    if (nums.some((n) => kpiValueMatches(n, expected))) hits++;
  }
  return hits;
}

export function scoreM5StrategicDecision(
  studentDecision: string,
  snapshot: M5KpiSnapshotValues,
): { score: number; feedback: string; rejected: boolean; rejectionReason?: string } {
  const text = studentDecision.trim();
  const lower = text.toLowerCase();

  const operationalPatterns = [
    /poster la réception/,
    /continuer le rangement/,
    /m5_reception/,
    /migo.*réception/,
    /valider la réception/,
    /faire le putaway/,
  ];
  if (operationalPatterns.some((p) => p.test(lower))) {
    return {
      score: 0,
      feedback: "Décision rejetée — niveau opérationnel (R1). Orientation stratégique requise.",
      rejected: true,
      rejectionReason: "OPERATIONAL_LEVEL",
    };
  }

  const kpiCitations = countM5KpiNumericCitations(text, snapshot);
  const hasTradeOff = /arbitr|trade.?off|compromis|au d[ée]triment|entre.*et|sacrif|vs\b/i.test(text);
  const hasHorizon = /90\s*(j|jours|days)|180\s*(j|jours|days)|3\s*mois|6\s*mois|trimestre|semestre/i.test(text);
  const hasRecommendation = /recommand|d[ée]cid|orient|invest|politique|plan|initiative|objectif/i.test(text);
  const genericOnly = kpiCitations < 2 && !hasTradeOff && text.length < 80;

  if (genericOnly || kpiCitations < 2) {
    return {
      score: 0,
      feedback: "Décision rejetée — citez au moins 2 KPI chiffrés du snapshot (rotation, service, erreurs, délai, stock).",
      rejected: true,
      rejectionReason: "INSUFFICIENT_KPI_CITATIONS",
    };
  }

  if (!hasTradeOff) {
    return {
      score: Math.min(40, kpiCitations * 15),
      feedback: "KPI cités — ajoutez un arbitrage explicite (trade-off stock/service/coût).",
      rejected: true,
      rejectionReason: "MISSING_TRADE_OFF",
    };
  }

  if (!hasRecommendation) {
    return {
      score: Math.min(50, kpiCitations * 15),
      feedback: "Arbitrage partiel — formulez une recommandation stratégique opérationnelle.",
      rejected: true,
      rejectionReason: "MISSING_RECOMMENDATION",
    };
  }

  if (!hasHorizon) {
    return {
      score: Math.min(60, kpiCitations * 15),
      feedback: "Recommandation partielle — précisez un horizon 90–180 jours ou une action de suivi.",
      rejected: true,
      rejectionReason: "MISSING_HORIZON",
    };
  }

  let score = 30 + kpiCitations * 10;
  if (hasTradeOff) score += 15;
  if (hasHorizon) score += 15;
  if (text.length >= 150) score += 10;

  const feedbackParts = [
    `✓ ${kpiCitations} KPI chiffrés cités`,
    "✓ Arbitrage / trade-off identifié",
    "✓ Recommandation stratégique",
    "✓ Horizon 90–180 j",
  ];

  return {
    score: Math.min(score, 80),
    feedback: feedbackParts.join(" | "),
    rejected: false,
  };
}

export function scoreM5Decision(
  studentDecision: string,
  kpiResult: { rotationRate?: number; serviceLevel?: number; errorRate?: number },
  options?: { decisionLevel?: "TACTICAL" | "STRATEGIC"; kpiSnapshot?: M5KpiSnapshotValues },
) {
  if (options?.decisionLevel === "STRATEGIC" && options.kpiSnapshot) {
    return scoreM5StrategicDecision(studentDecision, options.kpiSnapshot);
  }
  const text = studentDecision.toLowerCase();
  let score = 0;
  const feedbackParts: string[] = [];
  if (text.includes("rotation") || text.includes("turnover")) {
    score += 10;
    feedbackParts.push("✓ Rotation des stocks mentionnée");
  }
  if (text.includes("service") || text.includes("taux de service")) {
    score += 10;
    feedbackParts.push("✓ Taux de service mentionné");
  }
  if (text.includes("erreur") || text.includes("error")) {
    score += 10;
    feedbackParts.push("✓ Taux d'erreur mentionné");
  }
  if (text.includes("réapprovisionnement") || text.includes("commander") || text.includes("stock")) {
    score += 15;
    feedbackParts.push("✓ Action de réapprovisionnement proposée");
  }
  if (text.includes("formation") || text.includes("procédure") || text.includes("améliorer")) {
    score += 15;
    feedbackParts.push("✓ Action corrective identifiée");
  }
  if (text.length > 150 && feedbackParts.length >= 4) {
    score += 20;
    feedbackParts.push("✓ Analyse complète et justifiée");
  }
  return {
    score: Math.min(score, 80),
    feedback: feedbackParts.length > 0 ? feedbackParts.join(" | ") : "Décision insuffisamment justifiée — référencez les KPI observés",
    rejected: false,
  };
}

export function validateM5Compliance(input: {
  scnCode?: string | null;
  initialStateJson?: M5InitialStateJson | null;
  completedSteps: string[];
  inventoryCounts: M5InventoryCountRow[];
  inventoryAdjustments: M5InventoryAdjustmentRow[];
  transactions: M5TransactionRow[];
  inventory: Record<string, number>;
  kpiSnapshot?: M5KpiSnapshotValues | null;
  decisionRejected?: boolean;
  effectiveSteps?: Array<{ code: string }>;
}): ValidationResult {
  const issues: string[] = [];
  const issuesFr: string[] = [];
  const steps = input.effectiveSteps ?? getEffectiveM5Steps(input.initialStateJson, {
    inventoryCounts: input.inventoryCounts,
    inventoryAdjustments: input.inventoryAdjustments,
  });

  for (const step of steps) {
    if (step.code === "COMPLIANCE_M5") continue;
    if (!input.completedSteps.includes(step.code)) {
      issues.push(`Step ${step.code} not completed`);
      issuesFr.push(`Étape ${step.code} non complétée`);
    }
  }

  if (!isM5VarianceResolved(
    input.initialStateJson,
    input.inventoryCounts,
    input.inventoryAdjustments,
    input.transactions,
  )) {
    issues.push("Unresolved inventory variance");
    issuesFr.push("Écart d'inventaire non résolu — M5_ADJ requis");
  }

  if (hasM5VarianceContract(input.initialStateJson)
    && steps.some((s) => s.code === "M5_ADJ")
    && !input.completedSteps.includes("M5_ADJ")) {
    issues.push("M5_ADJ required but not completed");
    issuesFr.push("M5_ADJ requis mais non complété");
  }

  if (!input.kpiSnapshot) {
    issues.push("KPI snapshot missing");
    issuesFr.push("Snapshot KPI manquant — complétez M5_KPI");
  }

  if (input.scnCode === "SCN-017" && input.decisionRejected) {
    issues.push("SCN-017 decision missing KPI-linked justification");
    issuesFr.push("Décision SCN-017 sans justification KPI liée");
  }

  const negativeStock = Object.entries(input.inventory).some(([, qty]) => Number(qty) < 0);
  if (negativeStock) {
    issues.push("Negative stock detected");
    issuesFr.push("Stock négatif détecté");
  }

  const unposted = input.transactions.filter((t) => !t.posted && ["GR", "PUTAWAY", "ADJ", "GI"].includes(t.docType));
  if (unposted.length > 0) {
    issues.push(`${unposted.length} unposted critical transaction(s)`);
    issuesFr.push(`${unposted.length} transaction(s) critique(s) non postée(s)`);
  }

  return {
    allowed: issues.length === 0,
    reason: issues.join("; "),
    reasonFr: issuesFr.join(" ; "),
    reasonEn: issues.join("; "),
  };
}
// ─── ADJ step definition (inserted dynamically when variance exists) ──────────
const ADJ_STEP = {
  code: "ADJ",
  labelFr: "Ajustement inventaire (MI07)",
  labelEn: "Inventory Adjustment (MI07)",
  order: 8.5,
  prerequisite: "CC",
  moduleId: 1
};

/** SCN-003 corrective replenishment steps — inserted after SO when ATP shortage detected. */
export const SCN003_CORRECTIVE_STEPS = [
  { code: "PO_CORRECTIVE", labelFr: "PO corrective (ME21N)", labelEn: "Corrective PO (ME21N)", order: 5.1, prerequisite: "SO", moduleId: 1 },
  { code: "GR_CORRECTIVE", labelFr: "GR corrective (MIGO)", labelEn: "Corrective GR (MIGO)", order: 5.2, prerequisite: "PO_CORRECTIVE", moduleId: 1 },
  { code: "PUTAWAY_CORRECTIVE", labelFr: "Rangement corrective (LT0A)", labelEn: "Corrective Putaway (LT0A)", order: 5.3, prerequisite: "GR_CORRECTIVE", moduleId: 1 },
];

export type Scn003AtpShortage = {
  active: boolean;
  sku: string;
  stockAvailable: number;
  soDemand: number;
  deficit: number;
};

export function isScn003Scenario(state) {
  return state?.scnCode === "SCN-003" || state?.scenarioId === 3;
}

export function getStockageAvailableForSku(inventory, sku) {
  let total = 0;
  for (const bin of STOCKAGE_BINS) {
    total += inventory[`${sku}::${bin}`] ?? 0;
  }
  return total;
}

export function getPostedSoDemand(state) {
  const soTxs = (state.transactions ?? []).filter((t) => t.docType === "SO" && t.posted);
  if (soTxs.length === 0) return null;
  const so = soTxs[soTxs.length - 1];
  return { sku: so.sku, qty: Number(so.qty) };
}

export function detectScn003AtpShortage(state) {
  if (!isScn003Scenario(state)) return null;
  const soDemand = getPostedSoDemand(state);
  if (!soDemand) return null;
  const stockAvailable = getStockageAvailableForSku(state.inventory ?? {}, soDemand.sku);
  if (stockAvailable >= soDemand.qty) return null;
  return {
    active: true,
    sku: soDemand.sku,
    stockAvailable,
    soDemand: soDemand.qty,
    deficit: soDemand.qty - stockAvailable,
  };
}

export function getScn003AtpShortageMessage(shortage, lang = "fr") {
  if (lang === "en") {
    return `Insufficient stock detected: ${shortage.stockAvailable} units available in STOCKAGE for an order of ${shortage.soDemand} units. Create a corrective PO for ${shortage.deficit} units, post the GR, then put away stock before Picking/GI.`;
  }
  return `Stock insuffisant détecté: ${shortage.stockAvailable} unités disponibles en STOCKAGE pour une commande de ${shortage.soDemand} unités. Créez une PO corrective de ${shortage.deficit} unités, postez la GR, puis rangez le stock avant le Picking/GI.`;
}

function scn003ShortageBlockResult(shortage) {
  const msgFr = getScn003AtpShortageMessage(shortage, "fr");
  const msgEn = getScn003AtpShortageMessage(shortage, "en");
  return {
    allowed: false,
    reason: msgEn,
    reasonFr: msgFr,
    reasonEn: msgEn,
  };
}

/** Resolve which step code to mark complete when a base M1 mutation is submitted during SCN-003 corrective flow. */
export function resolveScn003CorrectiveStepCode(state, baseStepCode) {
  const next = getNextRequiredStep(state.completedSteps, 1, state);
  if (!next) return baseStepCode;
  if (baseStepCode === "PO" && next.code === "PO_CORRECTIVE") return "PO_CORRECTIVE";
  if (baseStepCode === "GR" && next.code === "GR_CORRECTIVE") return "GR_CORRECTIVE";
  if (baseStepCode === "PUTAWAY_M1" && next.code === "PUTAWAY_CORRECTIVE") return "PUTAWAY_CORRECTIVE";
  return baseStepCode;
}

// ─── Helper: build the effective M1 step list based on run state ──────────────
export function getEffectiveM1Steps(state) {
  let steps = [...MODULE1_STEPS];

  const shortage = detectScn003AtpShortage(state);
  if (shortage?.active) {
    const soIdx = steps.findIndex((s) => s.code === "SO");
    if (soIdx >= 0) {
      steps.splice(soIdx + 1, 0, ...SCN003_CORRECTIVE_STEPS);
    }
  }

  const hasUnresolvedVariance =
    state &&
    Array.isArray(state.cycleCounts) &&
    state.cycleCounts.some((c) => c.variance !== 0 && !c.resolved);
  if (hasUnresolvedVariance) {
    const complianceIdx = steps.findIndex((s) => s.code === "COMPLIANCE");
    steps.splice(complianceIdx, 0, ADJ_STEP);
  }
  return steps;
}

export type M2FifoLotEntry = {
  lotNumber: string;
  receivedAt: Date;
  toBin: string;
  sku: string;
};

/** Build FIFO lot catalog from putaway records, or from scenario seed when preloaded (SCN-008). */
export function buildM2FifoLotCatalog(
  putawayRecords: Array<{ sku: string; toBin: string; lotNumber: string | null; receivedAt: Date; qty: number }>,
  scenarioSeed?: {
    lots?: Array<{ lotNumber: string; receivedAt: string; qty?: number }>;
    preloadedTransactions?: Array<{ docType: string; sku?: string; bin?: string; qty?: number; posted?: boolean }>;
  }
): M2FifoLotEntry[] {
  if (putawayRecords.length > 0) {
    return putawayRecords
      .filter((p) => p.lotNumber)
      .map((p) => ({
        lotNumber: p.lotNumber!,
        receivedAt: new Date(p.receivedAt),
        toBin: p.toBin,
        sku: p.sku,
      }));
  }
  const lots = scenarioSeed?.lots ?? [];
  const storageBinsList = [...STOCKAGE_BINS, ...PICKING_BINS, ...RESERVE_BINS];
  const storageGrs = (scenarioSeed?.preloadedTransactions ?? [])
    .filter((t) => t.docType === "GR" && t.posted && t.bin && t.sku && storageBinsList.includes(t.bin))
    .sort((a, b) => String(a.docRef ?? a.bin).localeCompare(String(b.docRef ?? b.bin)));
  const sortedLots = [...lots].sort(
    (a, b) => new Date(a.receivedAt).getTime() - new Date(b.receivedAt).getTime()
  );
  return sortedLots
    .map((lot, i) => ({
      lotNumber: lot.lotNumber,
      receivedAt: new Date(lot.receivedAt),
      toBin: storageGrs[i]?.bin ?? "",
      sku: storageGrs[i]?.sku ?? "",
    }))
    .filter((e) => e.toBin && e.sku);
}

/** Global FIFO: oldest lot with remaining stock must be picked first (SCN-008 Gold Standard). */
export function validateM2FifoPick(input: {
  sku: string;
  lotNumber: string;
  catalog: M2FifoLotEntry[];
  inventory: Record<string, number>;
}) {
  const skuLots = input.catalog
    .filter((e) => e.sku === input.sku)
    .sort((a, b) => a.receivedAt.getTime() - b.receivedAt.getTime());
  let oldestWithStock: M2FifoLotEntry | undefined;
  for (const lot of skuLots) {
    const key = `${input.sku}::${lot.toBin}`;
    if ((input.inventory[key] ?? 0) > 0) {
      oldestWithStock = lot;
      break;
    }
  }
  if (!oldestWithStock) return { allowed: true as const };
  if (oldestWithStock.lotNumber !== input.lotNumber) {
    return {
      allowed: false as const,
      requiredLot: oldestWithStock.lotNumber,
      reasonFr: `Violation FIFO : le lot ${oldestWithStock.lotNumber} doit être prélevé en premier (plus ancien)`,
      reasonEn: `FIFO violation: lot ${oldestWithStock.lotNumber} must be picked first (oldest)`,
      penaltyEvent: "FIFO_VIOLATION" as const,
      penaltyPoints: -10,
    };
  }
  return { allowed: true as const };
}

/** Runtime: stock already in STOCKAGE with empty reception — PUTAWAY not required (SCN-008). */
export function isM2PutawaySatisfiedByInventory(state) {
  if (!state?.inventory || !state?.transactions) return false;
  const hasPostedGR = state.transactions.some((t) => t.docType === "GR" && t.posted);
  if (!hasPostedGR) return false;
  let receptionQty = 0;
  let storageQty = 0;
  const storageBins = [...STOCKAGE_BINS, ...PICKING_BINS, ...RESERVE_BINS];
  for (const [key, qty] of Object.entries(state.inventory)) {
    const amount = Number(qty);
    if (amount <= 0) continue;
    const [, bin] = key.split("::");
    if (!bin) continue;
    if (RECEPTION_BINS.includes(bin)) receptionQty += amount;
    else if (storageBins.includes(bin)) storageQty += amount;
  }
  return receptionQty === 0 && storageQty > 0;
}

function effectiveM2CompletedSteps(completedSteps, state) {
  const effective = [...completedSteps];
  if (!effective.includes("PUTAWAY") && isM2PutawaySatisfiedByInventory(state)) {
    effective.push("PUTAWAY");
  }
  return effective;
}

export function getNextRequiredStepAllModules(completedSteps, moduleId, state) {
  if (moduleId === 1) {
    return getNextRequiredStep(completedSteps, 1, state);
  }
  let steps;
  if (moduleId === 5) {
    steps = getEffectiveM5Steps(state?.m5InitialStateJson, state);
  } else {
    const stepsMap = {
      2: MODULE2_STEPS,
      3: MODULE3_STEPS,
      4: MODULE4_STEPS,
      5: MODULE5_STEPS
    };
    steps = stepsMap[moduleId] ?? MODULE1_STEPS;
  }
  const effectiveCompleted = moduleId === 2 ? effectiveM2CompletedSteps(completedSteps, state) : completedSteps;
  for (const step of steps) {
    if (!effectiveCompleted.includes(step.code)) {
      return step;
    }
  }
  return null;
}

export function calculateProgressPctAllModules(completedSteps, moduleId, state) {
  let steps;
  if (moduleId === 1) {
    steps = getEffectiveM1Steps(state);
  } else if (moduleId === 5) {
    steps = getEffectiveM5Steps(state?.m5InitialStateJson, state);
  } else {
    const stepsMap = {
      2: MODULE2_STEPS,
      3: MODULE3_STEPS,
      4: MODULE4_STEPS,
      5: MODULE5_STEPS
    };
    steps = stepsMap[moduleId] ?? MODULE1_STEPS;
  }
  if (steps.length === 0) return 0;
  const stepCodes = new Set(steps.map((s) => s.code));
  const completedInList = completedSteps.filter((code) => stepCodes.has(code)).length;
  return Math.min(100, Math.round((completedInList / steps.length) * 100));
}
