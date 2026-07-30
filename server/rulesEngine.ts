import {
  getScn005PendingPutaways,
  isScn005Scenario,
  scn005PutawayBlockMessage,
  SCN_005_M1_STEPS,
  getScn005OutboundBlockMessage,
} from "./scn005";
import {
  getScn004OutboundBlockMessage,
  isScn004Scenario,
  SCN_004_M1_STEPS,
} from "./scn004";
import {
  getScn007ComplianceIssues,
  isScn007PutawayComplete,
  isScn007Scenario,
  scn007FifoNotInScenarioMessage,
  scn007IncompletePutawayMessage,
} from "./scn007";
import {
  ANALYTICAL_BLOCK_WEIGHTS,
  CG_ACTION_VOCAB,
  CG_ERRORS_ACCEPTABLE_IMPROVE,
  CG_GLOBAL_DESTOCK,
  CG_HORIZON_90_180,
  CG_MAINTAIN_POLICY,
  CG_M5_NOMINAL,
  CG_M5_Q_ZERO,
  CG_M5_VARIANCE_AWARE,
  CG_MONITOR_FOLLOWUP,
  CG_NO_ACTION,
  CG_ONE_PRIORITY,
  CG_QUALITY_ACTION,
  CG_ROTATION_NORMAL,
  CG_ROTATION_OVERSTOCK,
  CG_SERVICE_EXCELLENT,
  CG_SERVICE_WEAK,
  CG_SHORT_HORIZON,
  CG_SITUATION_STABLE,
  CG_TRADEOFF,
  STRATEGIC_BLOCK_WEIGHTS,
  assessAnalyticalCoherence,
  evaluateConceptGroups,
  hasAnyTerm,
  hasQ0VsReplenishmentContradiction,
  matchConceptGroup,
  normalizePedagogicalText,
  type ConceptEvalResult,
} from "../shared/pedagogicalConceptEval";
import {
  evalKpiDiagnosticShort,
  evalKpiRotationShort,
  evalKpiServiceShort,
  evalM5DecisionShort,
} from "../shared/m4m5ShortAnswerContract";
import {
  countM5SessionEvidenceCitations,
  deriveM5SessionEvidenceV1,
  isM4PortfolioOnlyEvidence,
  type M5SessionEvidenceV1,
} from "../shared/m5SessionEvidence";

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

/** SCN-007 capacity-only path — FIFO is taught in SCN-008. */
export const MODULE2_SCN007_STEPS = [
  { code: "GR", labelFr: "Réception marchandises", labelEn: "Goods Receipt", order: 1, prerequisite: null, moduleId: 2 },
  { code: "PUTAWAY", labelFr: "Rangement structuré", labelEn: "Structured Putaway", order: 2, prerequisite: "GR", moduleId: 2 },
  { code: "STOCK_ACCURACY", labelFr: "Précision inventaire", labelEn: "Stock Accuracy", order: 3, prerequisite: "PUTAWAY", moduleId: 2 },
  { code: "COMPLIANCE_ADV", labelFr: "Conformité avancée", labelEn: "Advanced Compliance", order: 4, prerequisite: "STOCK_ACCURACY", moduleId: 2 },
];

export function getEffectiveM2Steps(state?: { scnCode?: string | null; scenarioId?: number | null; scenarioName?: string | null; scenarioInitialStateJson?: Record<string, unknown> | null } | null) {
  if (isScn007Scenario(state)) return [...MODULE2_SCN007_STEPS];
  return [...MODULE2_STEPS];
}
export const MODULE3_STEPS = [
  { code: "CC_LIST", labelFr: "Liste de comptage", labelEn: "Count List", order: 1, prerequisite: null, moduleId: 3 },
  { code: "CC_COUNT", labelFr: "Saisie des quantités", labelEn: "Count Entry", order: 2, prerequisite: "CC_LIST", moduleId: 3 },
  { code: "CC_RECON", labelFr: "Réconciliation & ajustement", labelEn: "Reconciliation", order: 3, prerequisite: "CC_COUNT", moduleId: 3 },
  { code: "REPLENISH", labelFr: "Réapprovisionnement", labelEn: "Replenishment", order: 4, prerequisite: "CC_RECON", moduleId: 3 },
  { code: "COMPLIANCE_M3", labelFr: "Conformité Module 3", labelEn: "M3 Compliance", order: 5, prerequisite: "REPLENISH", moduleId: 3 }
];

/** SCN-011 (replenishment-only) — Min/Max planning without cycle-count steps. */
export const MODULE3_REPLENISH_ONLY_STEPS = [
  { code: "REPLENISH", labelFr: "Réapprovisionnement Min/Max", labelEn: "Min/Max Replenishment", order: 1, prerequisite: null, moduleId: 3 },
  { code: "COMPLIANCE_M3", labelFr: "Conformité Module 3", labelEn: "M3 Compliance", order: 2, prerequisite: "REPLENISH", moduleId: 3 },
];

/** Legacy M3 pipeline maxima (historical SCN-011 ROP/EOQ model + base). Kept for historical event readability. */
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

/** Transparent SCN-011 scoring — REPLENISH 90 + COMPLIANCE_M3 10 = 100. */
export const M3_011_STEP_MAX = {
  REPLENISH: 90,
  COMPLIANCE_M3: 10,
} as const;

export const M3_011_REPLENISH_AWARDS = {
  BELOW_MIN_IDENTIFIED: 20,
  PARAMS_CORRECT: 20,
  SKU004_Q: 20,
  SKU005_Q: 20,
  BOTH_RECOMMENDATIONS: 10,
} as const;

export const M3_SCALED_PERFECT_TOTAL = Object.values(M3_STEP_MAX_SCALED).reduce((sum, pts) => sum + pts, 0);

/** Report display: sum historical + new SCN-011 replenish events for a run. */
export const M3_REPLENISH_SCORING_EVENTS = [
  "ROP_CHECK_COMPLETED",
  "EOQ_CALC_COMPLETED",
  "REPLENISH_COMPLETED",
  "M3_BELOW_MIN_IDENTIFIED",
  "M3_PARAMS_CORRECT",
  "M3_SKU004_Q_CORRECT",
  "M3_SKU005_Q_CORRECT",
  "M3_BOTH_RECOMMENDATIONS",
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
  if (
    isScn004Scenario(state) &&
    (step === "SO" || step === "PICKING_M1" || step === "GI" || step === "PICKING")
  ) {
    const msg = getScn004OutboundBlockMessage("en");
    return { allowed: false, ...msg };
  }
  if (
    isScn005Scenario(state) &&
    (step === "SO" || step === "PICKING_M1" || step === "GI" || step === "PICKING")
  ) {
    const msg = getScn005OutboundBlockMessage("en");
    return { allowed: false, ...msg };
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
  if (step === "STOCK" || step === "SO" || step === "PICKING_M1" || step === "GI") {
    if (isScn005Scenario(state)) {
      const pendingPutaway = getScn005PendingPutaways(state);
      if (pendingPutaway.length > 0) {
        const msg = scn005PutawayBlockMessage(pendingPutaway);
        return { allowed: false, reason: msg.reasonEn, reasonFr: msg.reasonFr, reasonEn: msg.reasonEn };
      }
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
    if (isScn003CorrectiveReplenishmentRequired(state)) {
      const shortage = detectScn003AtpShortage(state);
      if (shortage) return scn003ShortageBlockResult(shortage);
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
    if (isScn003CorrectiveReplenishmentRequired(state)) {
      const shortage = detectScn003AtpShortage(state);
      if (shortage) return scn003ShortageBlockResult(shortage);
    }
  }
  if (step === "PO" && isScn003Scenario(state) && state.completedSteps.includes("SO")) {
    if (isScn003CorrectiveReplenishmentRequired(state) && !state.completedSteps.includes("PO_CORRECTIVE")) {
      return {
        allowed: false,
        reason: "Corrective PO required — use PO_CORRECTIVE step",
        reasonFr: "PO corrective requise — utilisez l'étape PO corrective (ME21N) depuis Mission Control",
        reasonEn: "Corrective PO required — use the corrective PO (ME21N) step from Mission Control."
      };
    }
  }
  if (step === "GR" && isScn003Scenario(state) && state.completedSteps.includes("SO")) {
    if (isScn003CorrectiveReplenishmentRequired(state) && !state.completedSteps.includes("GR_CORRECTIVE")) {
      return {
        allowed: false,
        reason: "Corrective GR required — use GR_CORRECTIVE step",
        reasonFr: "GR corrective requise — utilisez l'étape GR corrective (MIGO) depuis Mission Control",
        reasonEn: "Corrective GR required — use the corrective GR (MIGO) step from Mission Control."
      };
    }
  }
  if (step === "PUTAWAY_M1" && isScn003Scenario(state) && state.completedSteps.includes("SO")) {
    if (isScn003CorrectiveReplenishmentRequired(state) && !state.completedSteps.includes("PUTAWAY_CORRECTIVE")) {
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
    if (!isScn003CorrectiveReplenishmentRequired(state)) {
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
    if (!isScn003CorrectiveReplenishmentRequired(state)) {
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
    if (!isScn003CorrectiveReplenishmentRequired(state)) {
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
  const steps = getEffectiveM2Steps(state);
  const stepDef = steps.find((s) => s.code === step);
  if (!stepDef) {
    if (step === "FIFO_PICK" && isScn007Scenario(state)) {
      const msg = scn007FifoNotInScenarioMessage();
      return { allowed: false, reason: msg.reasonEn, reasonFr: msg.reasonFr, reasonEn: msg.reasonEn };
    }
    return { allowed: false, reason: "Unknown M2 step", reasonFr: "Étape M2 inconnue", reasonEn: "Unknown M2 step" };
  }
  if (stepDef.prerequisite) {
    const putawaySatisfied =
      stepDef.prerequisite === "PUTAWAY" &&
      ((isScn007Scenario(state) && isScn007PutawayComplete(state)) ||
        isM2PutawaySatisfiedByInventory(state));
    const prereqMet =
      state.completedSteps.includes(stepDef.prerequisite) || putawaySatisfied;
    if (!prereqMet) {
      if (stepDef.prerequisite === "PUTAWAY" && isScn007Scenario(state)) {
        const msg = scn007IncompletePutawayMessage();
        return {
          allowed: false,
          reason: msg.reasonEn,
          reasonFr: msg.reasonFr,
          reasonEn: msg.reasonEn,
        };
      }
      const prereqDef = steps.find((s) => s.code === stepDef.prerequisite);
      return {
        allowed: false,
        reason: `Step ${stepDef.prerequisite} must be completed first`,
        reasonFr: `L'étape "${prereqDef?.labelFr}" doit être complétée en premier`,
        reasonEn: `Step "${prereqDef?.labelEn}" must be completed first`
      };
    }
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
    if (isScn007Scenario(state)) {
      const msg = scn007FifoNotInScenarioMessage();
      return { allowed: false, reason: msg.reasonEn, reasonFr: msg.reasonFr, reasonEn: msg.reasonEn };
    }
    const hasPutaway =
      state.completedSteps.includes("PUTAWAY") ||
      isM2PutawaySatisfiedByInventory(state);
    if (!hasPutaway) {
      return {
        allowed: false,
        reason: "Putaway must be completed before FIFO pick",
        reasonFr: "Le rangement doit être complété avant le prélèvement FIFO",
        reasonEn: "Putaway must be completed before FIFO picking."
      };
    }
  }
  if (step === "STOCK_ACCURACY" && isScn007Scenario(state) && !isScn007PutawayComplete(state)) {
    const msg = scn007IncompletePutawayMessage();
    return { allowed: false, reason: msg.reasonEn, reasonFr: msg.reasonFr, reasonEn: msg.reasonEn };
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

/** M1 ADJ / MI07 — must reconcile an unresolved Cycle Count variance without creating negative stock. */
export function validateM1AdjPosting(
  state: {
    inventory: Record<string, number>;
    cycleCounts: Array<{
      sku: string;
      bin: string;
      variance: number;
      resolved: boolean;
      systemQty?: number;
      physicalQty?: number;
    }>;
  },
  input: { sku: string; bin: string; qty: number },
) {
  const qtyCheck = validateAdjQuantity(input.qty);
  if (!qtyCheck.allowed) return qtyCheck;

  const pending = state.cycleCounts.filter(
    (c) => c.sku === input.sku && c.variance !== 0 && !c.resolved,
  );

  if (EXPEDITION_BINS.includes(input.bin)) {
    const ccBin = pending.find((c) => c.sku === input.sku)?.bin ?? pending[0]?.bin;
    return {
      allowed: false,
      reason: `Adjustment cannot be posted at expedition bin ${input.bin}`,
      reasonFr: `L'ajustement MI07 ne peut pas être posté en zone EXPÉDITION (${input.bin}). Postez sur ${ccBin ?? "l'emplacement du comptage"}.`,
      reasonEn: `MI07 adjustment cannot be posted at expedition bin (${input.bin}). Post at the cycle count bin.`,
    };
  }

  if (RECEPTION_BINS.includes(input.bin) && !pending.some((c) => c.bin === input.bin)) {
    const ccBin = pending[0]?.bin;
    return {
      allowed: false,
      reason: `Adjustment cannot be posted at reception bin ${input.bin}`,
      reasonFr: `L'ajustement MI07 ne peut pas être posté en zone RÉCEPTION (${input.bin}). Postez sur ${ccBin ?? "l'emplacement du comptage"}.`,
      reasonEn: `MI07 adjustment cannot be posted at reception bin (${input.bin}). Post at the cycle count bin.`,
    };
  }

  if (pending.length === 0) {
    return {
      allowed: false,
      reason: "No unresolved cycle count variance for this SKU",
      reasonFr: "Aucun écart de comptage non résolu pour ce SKU — effectuez d'abord un Cycle Count (MI01).",
      reasonEn: "No unresolved cycle count variance for this SKU — perform a Cycle Count (MI01) first.",
    };
  }

  const cc = pending.find((c) => c.bin === input.bin) ?? pending[0];
  if (cc.bin !== input.bin) {
    return {
      allowed: false,
      reason: `ADJ must be posted at cycle count bin ${cc.bin}, not ${input.bin}`,
      reasonFr: `L'ajustement MI07 doit être posté sur l'emplacement du comptage (${cc.bin}), pas ${input.bin}.`,
      reasonEn: `MI07 adjustment must be posted at the cycle count bin (${cc.bin}), not ${input.bin}.`,
    };
  }

  const matchCheck = validateAdjustment(cc.variance, input.qty);
  if (!matchCheck.allowed) return matchCheck;

  const key = `${input.sku}::${input.bin}`;
  const currentStock = state.inventory[key] ?? 0;
  const ledgerProjected = currentStock + input.qty;
  const bookStock = cc.systemQty ?? currentStock;
  const projectedStock = bookStock + input.qty;
  const physicalQty =
    cc.physicalQty != null
      ? cc.physicalQty
      : cc.systemQty != null
        ? cc.systemQty + cc.variance
        : projectedStock;

  if (Math.abs(projectedStock - physicalQty) > 0.01) {
    return {
      allowed: false,
      reason: `Adjustment must bring stock to physical count (${physicalQty}), not ${projectedStock}`,
      reasonFr: `L'ajustement doit ramener le stock à la quantité physique comptée (${physicalQty}), pas ${projectedStock}.`,
      reasonEn: `Adjustment must bring stock to the counted physical quantity (${physicalQty}), not ${projectedStock}.`,
    };
  }

  // When CC recorded a book systemQty (e.g. SCN-004 pedagogical injection), reconcile
  // against book stock — not the live ledger, which may already reflect picks/GI.
  if (projectedStock < 0) {
    return {
      allowed: false,
      reason: `Adjustment would create negative stock (${projectedStock}) at ${input.bin}`,
      reasonFr: `Cet ajustement créerait un stock négatif (${projectedStock}) à ${input.bin}. Postez l'ajustement sur l'emplacement compté (${cc.bin}).`,
      reasonEn: `This adjustment would create negative stock (${projectedStock}) at ${input.bin}. Post the adjustment at the counted bin (${cc.bin}).`,
    };
  }

  if (ledgerProjected < 0 && cc.systemQty == null) {
    return {
      allowed: false,
      reason: `Adjustment would create negative stock (${ledgerProjected}) at ${input.bin}`,
      reasonFr: `Cet ajustement créerait un stock négatif (${ledgerProjected}) à ${input.bin}. Postez l'ajustement sur l'emplacement compté (${cc.bin}).`,
      reasonEn: `This adjustment would create negative stock (${ledgerProjected}) at ${input.bin}. Post the adjustment at the counted bin (${cc.bin}).`,
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

export function hasM3ReplenishmentPlanning(initialStateJson?: M3InitialStateJson | Record<string, unknown> | null): boolean {
  return getReplenishmentParamsFromSeed(initialStateJson as M3InitialStateJson | undefined).length > 0;
}

/** Structural identity for SCN-011: replenishment params present and no cycle-count targets. */
export function isM3ReplenishmentOnlyScenario(
  initialStateJson?: M3InitialStateJson | Record<string, unknown> | null,
): boolean {
  return (
    hasM3ReplenishmentPlanning(initialStateJson) &&
    getCycleCountTargets(initialStateJson as M3InitialStateJson | undefined).length === 0
  );
}

/** Canonical M3 step resolver — SCN-009/010 full pipeline; SCN-011 REPLENISH → COMPLIANCE_M3 only. */
export function getEffectiveM3Steps(
  initialStateJson?: M3InitialStateJson | Record<string, unknown> | null,
) {
  if (isM3ReplenishmentOnlyScenario(initialStateJson)) {
    return [...MODULE3_REPLENISH_ONLY_STEPS];
  }
  return [...MODULE3_STEPS];
}

/** True when a run carries legacy CC / ROP / EOQ evidence (historical SCN-011 format). */
export function hasM3LegacyPipelineEvidence(
  completedSteps?: string[] | null,
  events?: Array<{ eventType: string }> | null,
): boolean {
  const legacySteps = ["CC_LIST", "CC_COUNT", "CC_RECON"];
  if ((completedSteps ?? []).some((s) => legacySteps.includes(s))) return true;
  const legacyEvents = [
    "CC_LIST_COMPLETED",
    "CC_COUNT_COMPLETED",
    "CC_RECON_COMPLETED",
    "ROP_CHECK_COMPLETED",
    "EOQ_CALC_COMPLETED",
  ];
  return (events ?? []).some((e) => legacyEvents.includes(e.eventType));
}

/**
 * Display/report steps for a run.
 * New SCN-011 runs → 2-step pipeline.
 * Historical SCN-011 runs with CC/ROP/EOQ evidence → full 5-step labels (readable, not reinterpreted).
 */
export function getM3StepsForRun(
  initialStateJson?: M3InitialStateJson | Record<string, unknown> | null,
  completedSteps?: string[] | null,
  events?: Array<{ eventType: string }> | null,
) {
  if (!isM3ReplenishmentOnlyScenario(initialStateJson)) {
    return [...MODULE3_STEPS];
  }
  if (hasM3LegacyPipelineEvidence(completedSteps, events)) {
    return [...MODULE3_STEPS];
  }
  return [...MODULE3_REPLENISH_ONLY_STEPS];
}

export function resolveM3InitialStateJson(
  state?: {
    scenarioInitialStateJson?: Record<string, unknown> | null;
    m3InitialStateJson?: M3InitialStateJson | null;
  } | null,
  fallback?: M3InitialStateJson | Record<string, unknown> | null,
): M3InitialStateJson | undefined {
  const raw =
    fallback ??
    state?.m3InitialStateJson ??
    state?.scenarioInitialStateJson ??
    null;
  return (raw as M3InitialStateJson | null | undefined) ?? undefined;
}

export function stockQtyForSku(inventory: Record<string, number>, sku: string): number {
  let total = 0;
  for (const [key, qty] of Object.entries(inventory)) {
    if (key.startsWith(`${sku}::`)) total += Number(qty);
  }
  return total;
}

type M3PipelineStepKey = keyof typeof M3_STEP_MAX;
type M3ScaledStepKey = keyof typeof M3_STEP_MAX_SCALED;
type M3StepAwardKey = M3PipelineStepKey | M3ScaledStepKey;

export function getM3StepAwardPoints(
  step: M3StepAwardKey,
  initialStateJson?: M3InitialStateJson,
): number {
  if (isM3ReplenishmentOnlyScenario(initialStateJson)) {
    if (step === "COMPLIANCE_M3") return M3_011_STEP_MAX.COMPLIANCE_M3;
    if (step === "REPLENISH") return M3_011_STEP_MAX.REPLENISH;
    // CC / ROP / EOQ are not awarded on new SCN-011 runs
    return 0;
  }
  if (hasM3ReplenishmentPlanning(initialStateJson)) {
    // Defensive: replenishment with CC targets (not current catalog) — legacy path
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

export function getM3ReplenishStepDisplayMax(
  initialStateJson?: M3InitialStateJson,
  events?: Array<{ eventType: string }>,
): number {
  if (isM3ReplenishmentOnlyScenario(initialStateJson)) {
    const hasLegacyPlanningEvents = (events ?? []).some(
      (e) => e.eventType === "ROP_CHECK_COMPLETED" || e.eventType === "EOQ_CALC_COMPLETED" || e.eventType === "REPLENISH_COMPLETED",
    );
    const hasNewPlanningEvents = (events ?? []).some(
      (e) => e.eventType === "M3_BELOW_MIN_IDENTIFIED" || e.eventType === "M3_BOTH_RECOMMENDATIONS",
    );
    // Historical SCN-011 runs used ROP/EOQ/REPLENISH (40). New runs use transparent 90.
    if (hasLegacyPlanningEvents && !hasNewPlanningEvents) {
      return M3_STEP_MAX.ROP_CHECK + M3_STEP_MAX.EOQ_CALC + M3_STEP_MAX.REPLENISH;
    }
    return M3_011_STEP_MAX.REPLENISH;
  }
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

/** Build transparent SCN-011 replenish awards once both SKUs are correctly completed. */
export function buildM3011ReplenishScoringEvents(
  params: M3ReplenishmentParam[],
  suggestions: M3ReplenishmentSuggestionRow[],
): Array<{ eventType: string; pointsDelta: number; message: string }> {
  const bySku = (sku: string) => suggestions.find((s) => s.sku === sku);
  const sku004Ok = (() => {
    const p = params.find((x) => x.sku === "SKU-004");
    const row = bySku("SKU-004");
    if (!p || !row) return false;
    const studentQty = parseStudentQtyFromReplenishReason(row.reason);
    return studentQty === p.maxQty - Number(row.systemQty) && Number(row.suggestedQty) === studentQty;
  })();
  const sku005Ok = (() => {
    const p = params.find((x) => x.sku === "SKU-005");
    const row = bySku("SKU-005");
    if (!p || !row) return false;
    const studentQty = parseStudentQtyFromReplenishReason(row.reason);
    return studentQty === p.maxQty - Number(row.systemQty) && Number(row.suggestedQty) === studentQty;
  })();

  return [
    {
      eventType: "M3_BELOW_MIN_IDENTIFIED",
      pointsDelta: M3_011_REPLENISH_AWARDS.BELOW_MIN_IDENTIFIED,
      message: "SKU sous Min identifiés (SKU-004 et SKU-005)",
    },
    {
      eventType: "M3_PARAMS_CORRECT",
      pointsDelta: M3_011_REPLENISH_AWARDS.PARAMS_CORRECT,
      message: "Paramètres Min/Max/SS corrects pour les deux SKU",
    },
    {
      eventType: "M3_SKU004_Q_CORRECT",
      pointsDelta: sku004Ok ? M3_011_REPLENISH_AWARDS.SKU004_Q : 0,
      message: "Calcul Q SKU-004 (Max − stock) validé",
    },
    {
      eventType: "M3_SKU005_Q_CORRECT",
      pointsDelta: sku005Ok ? M3_011_REPLENISH_AWARDS.SKU005_Q : 0,
      message: "Calcul Q SKU-005 (Max − stock) validé",
    },
    {
      eventType: "M3_BOTH_RECOMMENDATIONS",
      pointsDelta: sku004Ok && sku005Ok ? M3_011_REPLENISH_AWARDS.BOTH_RECOMMENDATIONS : 0,
      message: "Deux recommandations de réapprovisionnement validées",
    },
  ].filter((e) => e.pointsDelta > 0);
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

/** Canonical CC_RECON idempotency key: CC_RECON:{runId}:{sku}:{bin} */
export function buildCcReconIdempotencyKey(runId: number, sku: string, bin: string): string {
  return `CC_RECON:${runId}:${sku}:${bin}`;
}

/** @deprecated Prefer buildCcReconIdempotencyKey — kept for readable diagnostics. */
export function buildCcReconTargetKey(runId: number, sku: string, bin: string): string {
  return buildCcReconIdempotencyKey(runId, sku, bin);
}

export function buildCcReconAdjDocRef(sku: string, bin: string): string {
  return `CC_RECON:${sku}:${bin}`;
}

export type M3ReconTargetStatus =
  | "PENDING"
  | "RECONCILED_WITH_ADJUSTMENT"
  | "RECONCILED_NO_ADJUSTMENT";

export type M3CcReconClaimRow = {
  sku: string;
  bin: string;
  varianceQty?: number | string;
};

export function getInventoryCountVarianceQty(row: M3InventoryCountRow): number {
  if (row.varianceQty != null && row.varianceQty !== "") {
    return Number(row.varianceQty);
  }
  return Number(row.countedQty) - Number(row.systemQty);
}

export function hasPostedCcReconAdj(
  sku: string,
  bin: string | undefined,
  varianceQty: number,
  transactions: M3TransactionRow[],
): boolean {
  return transactions.some(
    (t) =>
      t.docType === "ADJ" &&
      t.sku === sku &&
      t.posted &&
      Number(t.qty) === varianceQty &&
      (bin == null || !t.bin || t.bin === bin),
  );
}

export function hasMatchingInventoryAdjustment(
  sku: string,
  varianceQty: number,
  adjustments: M3InventoryAdjustmentRow[],
): boolean {
  return adjustments.some((a) => a.sku === sku && Number(a.adjustmentQty) === varianceQty);
}

/** Zero-variance confirmation is persisted as an inventory_adjustments row with qty 0 (no ADJ tx). */
export function hasZeroVarianceConfirmation(
  sku: string,
  adjustments: M3InventoryAdjustmentRow[],
): boolean {
  return adjustments.some((a) => a.sku === sku && Number(a.adjustmentQty) === 0);
}

export function hasCcReconClaim(
  target: M3CycleCountTarget,
  claims: M3CcReconClaimRow[] | undefined,
): boolean {
  if (!claims || claims.length === 0) return false;
  return claims.some(
    (c) => c.sku === target.sku && (!target.bin || !c.bin || c.bin === target.bin),
  );
}

export function getCcReconTargetStatus(
  target: M3CycleCountTarget,
  counts: M3InventoryCountRow[],
  adjustments: M3InventoryAdjustmentRow[],
  transactions: M3TransactionRow[],
  claims?: M3CcReconClaimRow[],
): { status: M3ReconTargetStatus; varianceQty: number | null } {
  const row = findCountRow(counts, target.sku);
  if (!row) return { status: "PENDING", varianceQty: null };
  const varianceQty = getInventoryCountVarianceQty(row);

  if (hasCcReconClaim(target, claims)) {
    return {
      status: varianceQty === 0 ? "RECONCILED_NO_ADJUSTMENT" : "RECONCILED_WITH_ADJUSTMENT",
      varianceQty,
    };
  }

  if (varianceQty === 0) {
    if (hasZeroVarianceConfirmation(target.sku, adjustments)) {
      return { status: "RECONCILED_NO_ADJUSTMENT", varianceQty };
    }
    return { status: "PENDING", varianceQty };
  }
  const adjOk = hasMatchingInventoryAdjustment(target.sku, varianceQty, adjustments);
  const txOk = hasPostedCcReconAdj(target.sku, target.bin, varianceQty, transactions);
  if (adjOk && txOk) {
    return { status: "RECONCILED_WITH_ADJUSTMENT", varianceQty };
  }
  return { status: "PENDING", varianceQty };
}

export function evaluateCycleCountReconProgress(
  targets: M3CycleCountTarget[],
  counts: M3InventoryCountRow[],
  adjustments: M3InventoryAdjustmentRow[],
  transactions: M3TransactionRow[],
  claims?: M3CcReconClaimRow[],
): ValidationResult & {
  complete: boolean;
  completedSkus: string[];
  remainingSkus: string[];
  reconciledCount: number;
  requiredCount: number;
  statuses: Array<{ sku: string; bin?: string; status: M3ReconTargetStatus; varianceQty: number | null }>;
} {
  const entriesCheck = validateCycleCountEntriesComplete(targets, counts);
  if (!entriesCheck.complete) {
    return {
      ...entriesCheck,
      completedSkus: [],
      remainingSkus: targets.map((t) => t.sku),
      reconciledCount: 0,
      requiredCount: targets.length,
      statuses: targets.map((t) => ({ sku: t.sku, bin: t.bin, status: "PENDING" as const, varianceQty: null })),
    };
  }

  const issues: string[] = [];
  const issuesFr: string[] = [];
  const completedSkus: string[] = [];
  const remainingSkus: string[] = [];
  const statuses: Array<{ sku: string; bin?: string; status: M3ReconTargetStatus; varianceQty: number | null }> = [];

  for (const target of targets) {
    const { status, varianceQty } = getCcReconTargetStatus(
      target,
      counts,
      adjustments,
      transactions,
      claims,
    );
    statuses.push({ sku: target.sku, bin: target.bin, status, varianceQty });
    if (status === "PENDING") {
      remainingSkus.push(target.sku);
      if (varianceQty === 0) {
        issues.push(`${target.sku}: zero variance not confirmed`);
        issuesFr.push(`${target.sku} : écart nul non confirmé`);
      } else if (varianceQty == null) {
        issues.push(`${target.sku}: missing count`);
        issuesFr.push(`${target.sku} : comptage manquant`);
      } else {
        issues.push(`${target.sku}: variance ${varianceQty} not reconciled with matching ADJ`);
        issuesFr.push(`${target.sku} : écart ${varianceQty} non réconcilié par un ADJ correspondant`);
      }
    } else {
      completedSkus.push(target.sku);
    }
  }

  if (issues.length > 0) {
    return {
      allowed: false,
      complete: false,
      reason: issues.join("; "),
      reasonFr: issuesFr.join(" ; "),
      reasonEn: issues.join("; "),
      completedSkus,
      remainingSkus,
      reconciledCount: completedSkus.length,
      requiredCount: targets.length,
      statuses,
    };
  }
  return {
    allowed: true,
    complete: true,
    completedSkus,
    remainingSkus: [],
    reconciledCount: completedSkus.length,
    requiredCount: targets.length,
    statuses,
  };
}

export function validateCycleCountReconComplete(
  targets: M3CycleCountTarget[],
  counts: M3InventoryCountRow[],
  adjustments: M3InventoryAdjustmentRow[],
  transactions: M3TransactionRow[],
  claims?: M3CcReconClaimRow[],
): ValidationResult & {
  complete: boolean;
  completedSkus?: string[];
  remainingSkus?: string[];
  reconciledCount?: number;
  requiredCount?: number;
} {
  const progress = evaluateCycleCountReconProgress(targets, counts, adjustments, transactions, claims);
  return {
    allowed: progress.allowed,
    complete: progress.complete,
    reason: progress.reason,
    reasonFr: progress.reasonFr,
    reasonEn: progress.reasonEn,
    completedSkus: progress.completedSkus,
    remainingSkus: progress.remainingSkus,
    reconciledCount: progress.reconciledCount,
    requiredCount: progress.requiredCount,
  };
}

/** Validate one CC_RECON submission against the canonical target + counted variance. */
export function validateCcReconSubmission(
  targets: M3CycleCountTarget[],
  counts: M3InventoryCountRow[],
  input: {
    sku: string;
    bin: string;
    varianceQty: number;
    justification: string;
    systemQty?: number;
    physicalQty?: number;
  },
  threshold: number = M3_VARIANCE_THRESHOLD_DEFAULT,
): ValidationResult & { expectedVarianceQty?: number } {
  const target = targets.find((t) => t.sku === input.sku);
  if (!target) {
    return {
      allowed: false,
      reason: `SKU ${input.sku} is not a required reconciliation target`,
      reasonFr: `Le SKU ${input.sku} n'est pas une cible de réconciliation requise`,
      reasonEn: `SKU ${input.sku} is not a required reconciliation target`,
    };
  }
  if (target.bin && input.bin && target.bin !== input.bin) {
    return {
      allowed: false,
      reason: `Bin ${input.bin} does not match required bin ${target.bin} for ${input.sku}`,
      reasonFr: `L'emplacement ${input.bin} ne correspond pas au bin requis ${target.bin} pour ${input.sku}`,
      reasonEn: `Bin ${input.bin} does not match required bin ${target.bin} for ${input.sku}`,
    };
  }
  const countRow = findCountRow(counts, input.sku);
  if (!countRow) {
    return {
      allowed: false,
      reason: `Missing cycle count for ${input.sku}`,
      reasonFr: `Comptage manquant pour ${input.sku}`,
      reasonEn: `Missing cycle count for ${input.sku}`,
    };
  }
  if (Math.abs(Number(countRow.systemQty) - Number(target.systemQty)) > 0.01) {
    return {
      allowed: false,
      reason: `System quantity ${countRow.systemQty} does not match required ${target.systemQty} for ${input.sku}`,
      reasonFr: `La quantité système (${countRow.systemQty}) ne correspond pas à la quantité requise (${target.systemQty}) pour ${input.sku}`,
      reasonEn: `System quantity ${countRow.systemQty} does not match required ${target.systemQty} for ${input.sku}`,
    };
  }
  const expectedVarianceQty = getInventoryCountVarianceQty(countRow);
  const expectedPhysicalQty = Number(countRow.systemQty) + expectedVarianceQty;
  if (
    input.physicalQty != null &&
    Math.abs(Number(input.physicalQty) - expectedPhysicalQty) > 0.01
  ) {
    return {
      allowed: false,
      expectedVarianceQty,
      reason: `Physical quantity ${input.physicalQty} does not match counted physical ${expectedPhysicalQty} for ${input.sku}`,
      reasonFr: `La quantité physique (${input.physicalQty}) ne correspond pas au comptage (${expectedPhysicalQty}) pour ${input.sku}`,
      reasonEn: `Physical quantity ${input.physicalQty} does not match counted physical ${expectedPhysicalQty} for ${input.sku}`,
    };
  }
  if (
    input.systemQty != null &&
    Math.abs(Number(input.systemQty) - Number(countRow.systemQty)) > 0.01
  ) {
    return {
      allowed: false,
      expectedVarianceQty,
      reason: `Submitted system quantity ${input.systemQty} does not match counted system ${countRow.systemQty} for ${input.sku}`,
      reasonFr: `La quantité système saisie (${input.systemQty}) ne correspond pas au comptage (${countRow.systemQty}) pour ${input.sku}`,
      reasonEn: `Submitted system quantity ${input.systemQty} does not match counted system ${countRow.systemQty} for ${input.sku}`,
    };
  }
  if (Math.abs(input.varianceQty - expectedVarianceQty) > 0.01) {
    return {
      allowed: false,
      expectedVarianceQty,
      reason: `Submitted variance ${input.varianceQty} does not match counted variance ${expectedVarianceQty}`,
      reasonFr: `La variance saisie (${input.varianceQty}) ne correspond pas à l'écart compté (${expectedVarianceQty})`,
      reasonEn: `Submitted variance ${input.varianceQty} does not match counted variance ${expectedVarianceQty}`,
    };
  }
  if (expectedVarianceQty !== 0) {
    const qtyCheck = validateAdjustment(expectedVarianceQty, input.varianceQty);
    if (!qtyCheck.allowed) return { ...qtyCheck, expectedVarianceQty };
    const justificationCheck = validateVarianceEntry(
      Number(countRow.systemQty),
      Number(countRow.countedQty),
      input.justification,
      threshold,
    );
    if (!justificationCheck.allowed) return { ...justificationCheck, expectedVarianceQty };
  }
  return { allowed: true, expectedVarianceQty };
}

export function validateReplenishmentSubmission(
  params: M3ReplenishmentParam[],
  input: {
    sku: string;
    systemQty: number;
    minQty: number;
    maxQty: number;
    safetyStock: number;
    studentQty: number;
  },
  inventory?: Record<string, number>,
): ValidationResult {
  const param = params.find((p) => p.sku === input.sku);
  if (!param) {
    return {
      allowed: false,
      reason: `SKU ${input.sku} is not a required replenishment target`,
      reasonFr: `Le SKU ${input.sku} n'est pas une cible de réapprovisionnement requise`,
      reasonEn: `SKU ${input.sku} is not a required replenishment target`,
    };
  }

  const expectedSystemQty =
    inventory && Object.keys(inventory).length > 0
      ? stockQtyForSku(inventory, input.sku)
      : input.systemQty;

  if (inventory && Object.keys(inventory).length > 0 && input.systemQty !== expectedSystemQty) {
    return {
      allowed: false,
      reason: `${input.sku}: current stock must be ${expectedSystemQty}`,
      reasonFr: `${input.sku} : le stock actuel doit être ${expectedSystemQty}`,
      reasonEn: `${input.sku}: current stock must be ${expectedSystemQty}`,
    };
  }

  if (input.minQty !== param.minQty) {
    return {
      allowed: false,
      reason: `${input.sku}: Min must be ${param.minQty}`,
      reasonFr: `${input.sku} : le Min doit être ${param.minQty}`,
      reasonEn: `${input.sku}: Min must be ${param.minQty}`,
    };
  }
  if (input.maxQty !== param.maxQty) {
    return {
      allowed: false,
      reason: `${input.sku}: Max must be ${param.maxQty}`,
      reasonFr: `${input.sku} : le Max doit être ${param.maxQty}`,
      reasonEn: `${input.sku}: Max must be ${param.maxQty}`,
    };
  }
  if (input.safetyStock !== param.safetyStock) {
    return {
      allowed: false,
      reason: `${input.sku}: safety stock must be ${param.safetyStock}`,
      reasonFr: `${input.sku} : le stock de sécurité doit être ${param.safetyStock}`,
      reasonEn: `${input.sku}: safety stock must be ${param.safetyStock}`,
    };
  }

  const expected = computeReplenishmentSuggestion({
    sku: param.sku,
    systemQty: expectedSystemQty,
    minQty: param.minQty,
    maxQty: param.maxQty,
    safetyStock: param.safetyStock,
  });

  if (!expected.needsReplenishment) {
    return {
      allowed: false,
      reason: `${input.sku}: stock is not below Min`,
      reasonFr: `${input.sku} : le stock n'est pas sous le seuil Min`,
      reasonEn: `${input.sku}: stock is not below Min`,
    };
  }

  if (input.studentQty !== expected.suggestedQty) {
    return {
      allowed: false,
      reason: `${input.sku}: Q must equal Max − current stock (${expected.suggestedQty})`,
      reasonFr: `${input.sku} : Q doit être égal à Max − stock actuel (${expected.suggestedQty})`,
      reasonEn: `${input.sku}: Q must equal Max − current stock (${expected.suggestedQty})`,
    };
  }

  return { allowed: true };
}

export function validateReplenishmentComplete(
  params: M3ReplenishmentParam[],
  suggestions: M3ReplenishmentSuggestionRow[],
  inventory?: Record<string, number>,
): ValidationResult & { complete: boolean; completedSkus?: string[]; remainingSkus?: string[] } {
  if (params.length === 0) return { allowed: true, complete: true, completedSkus: [], remainingSkus: [] };

  const issues: string[] = [];
  const issuesFr: string[] = [];
  const completedSkus: string[] = [];
  const remainingSkus: string[] = [];

  for (const param of params) {
    const row = suggestions.find((s) => s.sku === param.sku);
    if (!row) {
      remainingSkus.push(param.sku);
      issues.push(`Missing replenishment for ${param.sku}`);
      issuesFr.push(`Réapprovisionnement manquant pour ${param.sku}`);
      continue;
    }

    const expectedSystemQty =
      inventory && Object.keys(inventory).length > 0
        ? stockQtyForSku(inventory, param.sku)
        : Number(row.systemQty);

    const expected = computeReplenishmentSuggestion({
      sku: param.sku,
      systemQty: expectedSystemQty,
      minQty: param.minQty,
      maxQty: param.maxQty,
      safetyStock: param.safetyStock,
    });
    const suggestedQty = Number(row.suggestedQty);
    const studentQty = parseStudentQtyFromReplenishReason(row.reason);
    const systemOk = Number(row.systemQty) === expectedSystemQty;

    if (!systemOk) {
      remainingSkus.push(param.sku);
      issues.push(`${param.sku}: incorrect current stock ${row.systemQty}`);
      issuesFr.push(`${param.sku} : stock actuel incorrect ${row.systemQty}`);
      continue;
    }
    if (suggestedQty !== expected.suggestedQty) {
      remainingSkus.push(param.sku);
      issues.push(`${param.sku}: invalid system suggestion ${suggestedQty}`);
      issuesFr.push(`${param.sku} : suggestion système invalide ${suggestedQty}`);
      continue;
    }
    if (studentQty === null || studentQty !== expected.suggestedQty) {
      remainingSkus.push(param.sku);
      issues.push(`${param.sku}: student qty must equal ${expected.suggestedQty}`);
      issuesFr.push(`${param.sku} : quantité étudiant doit être ${expected.suggestedQty}`);
      continue;
    }
    completedSkus.push(param.sku);
  }

  if (issues.length > 0) {
    return {
      allowed: false,
      complete: false,
      reason: issues.join("; "),
      reasonFr: issuesFr.join(" ; "),
      reasonEn: issues.join("; "),
      completedSkus,
      remainingSkus,
    };
  }
  return { allowed: true, complete: true, completedSkus, remainingSkus: [] };
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
  return normalizePedagogicalText(text);
}

function m4HasTerm(text: string, terms: string[]): boolean {
  return hasAnyTerm(normalizePedagogicalText(text), terms);
}

function countM4KpiDomains(text: string): number {
  const n = normalizePedagogicalText(text);
  let count = 0;
  if (hasAnyTerm(n, ["rotation"])) count++;
  if (hasAnyTerm(n, ["service", "otif"])) count++;
  if (hasAnyTerm(n, ["erreur", "error"])) count++;
  if (hasAnyTerm(n, ["lead time", "delai", "3,5", "3.5"])) count++;
  return count;
}

/** Concept-based diagnostic evaluation (authoritative for compliance). */
export function evaluateM4DiagnosticConcepts(
  scnCode: string | null | undefined,
  diagnosticText: string,
  kpiResult: ReturnType<typeof calculateKpis>,
): ConceptEvalResult & { competenceComplete: boolean; issuesFr: string[]; issuesEn: string[] } {
  const scn = (scnCode ?? "").toUpperCase();
  const issuesFr: string[] = [];
  const issuesEn: string[] = [];
  const n = normalizePedagogicalText(diagnosticText);

  if (scn === "SCN-012") {
    const required =
      kpiResult.rotationStatus === "normal"
        ? [CG_MAINTAIN_POLICY, CG_MONITOR_FOLLOWUP]
        : [CG_ACTION_VOCAB];
    const contradictions = [CG_GLOBAL_DESTOCK, CG_NO_ACTION];
    if (kpiResult.rotationStatus === "normal") contradictions.push(CG_ROTATION_OVERSTOCK);
    const evalResult = evaluateConceptGroups(diagnosticText, required, contradictions);
    if (evalResult.missing.includes("maintain_policy")) {
      issuesEn.push("SCN-012: missing maintain/global policy stance");
      issuesFr.push("SCN-012 : maintien ou absence de réduction globale attendu");
    }
    if (evalResult.missing.includes("monitor_followup")) {
      issuesEn.push("SCN-012: missing monitoring / periodic review");
      issuesFr.push("SCN-012 : suivi, surveillance ou revue périodique attendu");
    }
    if (evalResult.contradictions.includes("global_destock") || evalResult.contradictions.includes("rotation_overstock")) {
      issuesEn.push("SCN-012: contradictory destock/overstock stance at normal rotation");
      issuesFr.push("SCN-012 : contradiction (surstock/destock) avec rotation normale");
    }
    if (evalResult.contradictions.includes("no_action")) {
      issuesEn.push("SCN-012: complacency without follow-up");
      issuesFr.push("SCN-012 : absence de suivi ou d'action");
    }
    if (evalResult.stuffingSuspected && evalResult.coherenceHint < 0.5) {
      issuesEn.push("SCN-012: keyword stuffing without coherent stance");
      issuesFr.push("SCN-012 : empilement de mots-clés sans raisonnement cohérent");
    }
    // July guide: maintain + monitor stance IS the professional recommendation.
    // Do not require literal « recommandation / action / stratégie / décision ».
    const hasActionableStance =
      matchConceptGroup(n, CG_ACTION_VOCAB) ||
      (evalResult.matched.includes("maintain_policy") &&
        evalResult.matched.includes("monitor_followup")) ||
      evalResult.matched.length >= 2;
    if (!hasActionableStance) {
      issuesEn.push("SCN-012: missing actionable recommendation");
      issuesFr.push("SCN-012 : recommandation actionnable manquante");
    }
    return {
      ...evalResult,
      competenceComplete: issuesEn.length === 0,
      issuesFr,
      issuesEn,
    };
  }

  if (scn === "SCN-013") {
    const required = [CG_QUALITY_ACTION, CG_SHORT_HORIZON];
    const contradictions = [CG_GLOBAL_DESTOCK, CG_NO_ACTION, CG_SERVICE_WEAK];
    const evalResult = evaluateConceptGroups(diagnosticText, required, contradictions);
    const hasErrorContext = hasAnyTerm(n, ["erreur", "error", "4%", "4 %", "picking", "reception", "otif"]);
    const hasImprove = matchConceptGroup(n, CG_ERRORS_ACCEPTABLE_IMPROVE) || hasErrorContext;
    if (!hasImprove) {
      issuesEn.push("SCN-013: must acknowledge errors as risk or improvable");
      issuesFr.push("SCN-013 : reconnaître les erreurs comme risque ou levier d'amélioration");
    }
    if (evalResult.missing.includes("quality_action")) {
      issuesEn.push("SCN-013: quality action required (training/checklist/audit/process)");
      issuesFr.push("SCN-013 : action qualité requise (formation, checklist, audit, processus)");
    }
    if (evalResult.missing.includes("short_horizon")) {
      issuesEn.push("SCN-013: short-term monitoring or SLA/horizon required");
      issuesFr.push("SCN-013 : suivi court terme, SLA ou horizon de revue requis");
    }
    if (evalResult.contradictions.includes("service_weak")) {
      issuesEn.push("SCN-013: OTIF/service must not be classified as weak");
      issuesFr.push("SCN-013 : ne pas classer le service/OTIF comme faible");
    }
    if (evalResult.contradictions.includes("global_destock") && !matchConceptGroup(n, CG_QUALITY_ACTION)) {
      issuesEn.push("SCN-013: destock as primary lever without quality framing");
      issuesFr.push("SCN-013 : destock comme levier principal sans cadrage qualité");
    }
    if (evalResult.contradictions.includes("no_action")) {
      issuesEn.push("SCN-013: complacency rejected");
      issuesFr.push("SCN-013 : « rien à faire » rejeté");
    }
    const coherence = assessAnalyticalCoherence(diagnosticText);
    if (!coherence.coherent) {
      issuesEn.push("SCN-013: keyword list / incoherent text without professional reasoning");
      issuesFr.push("SCN-013 : liste de mots-clés ou texte incohérent sans raisonnement professionnel");
    }
    if (evalResult.stuffingSuspected && evalResult.coherenceHint < 0.5) {
      issuesEn.push("SCN-013: keyword stuffing without coherent plan");
      issuesFr.push("SCN-013 : empilement de mots-clés sans plan cohérent");
    }
    return {
      ...evalResult,
      competenceComplete: issuesEn.length === 0,
      issuesFr,
      issuesEn,
    };
  }

  if (scn === "SCN-014") {
    const required = [CG_ONE_PRIORITY, CG_TRADEOFF, CG_HORIZON_90_180];
    const contradictions = [CG_NO_ACTION];
    const evalResult = evaluateConceptGroups(diagnosticText, required, contradictions);
    const domainCount = countM4KpiDomains(diagnosticText);
    const stableOrEvidence =
      matchConceptGroup(n, CG_SITUATION_STABLE) || domainCount >= 2 || matchConceptGroup(n, CG_ROTATION_NORMAL);
    if (!stableOrEvidence) {
      issuesEn.push("SCN-014: recognize stable/controlled situation or cite KPI evidence");
      issuesFr.push("SCN-014 : reconnaître une situation stable/contrôlée ou citer des preuves KPI");
    }
    if (evalResult.missing.includes("one_priority")) {
      issuesEn.push("SCN-014: one clear priority required");
      issuesFr.push("SCN-014 : une priorité claire requise");
    }
    if (evalResult.missing.includes("tradeoff")) {
      issuesEn.push("SCN-014: explicit trade-off required");
      issuesFr.push("SCN-014 : arbitrage / trade-off explicite requis");
    }
    if (evalResult.missing.includes("horizon_90_180")) {
      issuesEn.push("SCN-014: review horizon required");
      issuesFr.push("SCN-014 : horizon de revue requis");
    }
    if (evalResult.contradictions.includes("no_action")) {
      issuesEn.push("SCN-014: complacency rejected");
      issuesFr.push("SCN-014 : absence d'action rejetée");
    }
    if (evalResult.stuffingSuspected && evalResult.coherenceHint < 0.45) {
      issuesEn.push("SCN-014: keyword stuffing without coherent arbitration");
      issuesFr.push("SCN-014 : empilement de mots-clés sans arbitrage cohérent");
    }
    // Stronger evidence still preferred but not a hard gate when competence is complete.
    void ANALYTICAL_BLOCK_WEIGHTS;
    return {
      ...evalResult,
      competenceComplete: issuesEn.length === 0,
      issuesFr,
      issuesEn,
    };
  }

  // Generic diagnostic gate (non SCN-specific)
  const evalResult = evaluateConceptGroups(diagnosticText, [CG_ACTION_VOCAB], [CG_NO_ACTION]);
  if (evalResult.missing.includes("action_vocab")) {
    issuesEn.push("Diagnostic missing recommendation/action vocabulary");
    issuesFr.push("Diagnostic sans vocabulaire recommandation/action/stratégie/décision");
  }
  return {
    ...evalResult,
    competenceComplete: issuesEn.length === 0,
    issuesFr,
    issuesEn,
  };
}

/**
 * Legacy keyword-path diagnostic check — for tests/shadow comparison only.
 * Not used by student-facing compliance.
 */
export function evaluateM4DiagnosticLegacyShadow(
  scnCode: string | null | undefined,
  diagnosticText: string,
  kpiResult: ReturnType<typeof calculateKpis>,
): { allowed: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const diag = diagnosticText.trim();
  const scn = (scnCode ?? "").toUpperCase();
  if (diag.length < 50) reasons.push("legacy: length < 50");
  if (!m4HasTerm(diag, ["recommand", "action", "strategie", "decision"])) {
    reasons.push("legacy: missing action stems");
  }
  if (scn === "SCN-012" && kpiResult.rotationStatus === "normal") {
    if (!m4HasTerm(diag, ["mainten", "surveill", "monitor", "sku", "politique"])) {
      reasons.push("legacy: SCN-012 maintain/monitor stems");
    }
  }
  if (scn === "SCN-014") {
    if (diag.length < 150) reasons.push("legacy: SCN-014 length < 150");
    if (countM4KpiDomains(diag) < 3) reasons.push("legacy: SCN-014 < 3 domains");
    if (!m4HasTerm(diag, ["trade-off", "tradeoff", "arbitrage", "report", "priori"])) {
      reasons.push("legacy: SCN-014 trade-off stems");
    }
  }
  return { allowed: reasons.length === 0, reasons };
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
  const scn = input.scnCode?.toUpperCase() ?? "";

  // Same canonical scorer as step mutations (re-score latest answers — do not trust stale isCorrect).
  if (!rotationRow) {
    issues.push("Missing rotation interpretation");
    issuesFr.push("Interprétation rotation manquante");
  } else {
    const rotScore = scoreKpiInterpretation(
      "rotationRate",
      rotationRow.studentAnswer,
      input.kpiResult,
      scn,
    );
    if (!rotScore.isCorrect) {
      issues.push("Incorrect rotation interpretation");
      issuesFr.push(rotScore.feedback || "Interprétation rotation incorrecte");
    }
  }

  if (!serviceRow) {
    issues.push("Missing service interpretation");
    issuesFr.push("Interprétation service manquante");
  } else {
    const svcScore = scoreKpiInterpretation(
      "serviceLevel",
      serviceRow.studentAnswer,
      input.kpiResult,
      scn,
    );
    if (!svcScore.isCorrect) {
      issues.push("Incorrect service interpretation");
      issuesFr.push(svcScore.feedback || "Interprétation service incorrecte");
    }
  }

  if (!diagnosticRow) {
    issues.push("Missing diagnostic");
    issuesFr.push("Diagnostic manquant");
  } else {
    const diag = diagnosticRow.studentAnswer.trim();
    if (diag.length < 12) {
      issues.push("Diagnostic too short");
      issuesFr.push("Diagnostic trop court — 1 à 3 phrases professionnelles");
    }

    const short = evalKpiDiagnosticShort(scn, diag);
    const diagScore = scoreKpiInterpretation("diagnostic", diag, input.kpiResult, scn);
    const concept = evaluateM4DiagnosticConcepts(scn, diag, input.kpiResult);
    const coherence = assessAnalyticalCoherence(diag);

    // Canonical gate: scenario concept competence (authoritative) + coherence + no short-contract contradictions.
    // Short professional answers must also satisfy concept groups (maintain/monitor/quality/etc.).
    const allowed =
      concept.competenceComplete &&
      coherence.coherent &&
      short.contradictions.length === 0 &&
      diagScore.isCorrect;

    if (!allowed) {
      if (short.contradictions.length > 0 || !short.ok) {
        issues.push(short.feedbackEn || short.feedbackFr);
        issuesFr.push(short.feedbackFr);
      }
      if (!concept.competenceComplete) {
        for (const r of concept.issuesEn) {
          if (!issues.includes(r)) issues.push(r);
        }
        for (const r of concept.issuesFr) {
          if (!issuesFr.includes(r)) issuesFr.push(r);
        }
      }
      if (!coherence.coherent) {
        issues.push("Diagnostic not analytically coherent");
        issuesFr.push("Diagnostic non cohérent — phrases professionnelles requises (pas une liste de mots-clés)");
      }
      if (!diagScore.isCorrect && issuesFr.length === 0) {
        issues.push(diagScore.feedback);
        issuesFr.push(diagScore.feedback);
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

export function canExecuteStepM3(step, completedSteps, initialStateJson?) {
  const steps = getEffectiveM3Steps(initialStateJson);
  const stepDef = steps.find((s) => s.code === step);
  if (!stepDef) return { allowed: false, reason: "Unknown M3 step", reasonFr: "Étape M3 inconnue", reasonEn: "Unknown M3 step" };
  if (stepDef.prerequisite && !completedSteps.includes(stepDef.prerequisite)) {
    const prereqDef = steps.find((s) => s.code === stepDef.prerequisite);
    return {
      allowed: false,
      reason: `Step ${stepDef.prerequisite} must be completed first`,
      reasonFr: `L'étape "${prereqDef?.labelFr}" doit être complétée en premier`,
      reasonEn: `Step "${prereqDef?.labelEn}" must be completed first`
    };
  }
  return { allowed: true };
}
/**
 * Legacy helper: whether a prior-module id appears in passedModuleIds.
 * NOT used for student learning-module navigation (see canAccessLearningModule).
 * Kept for progress/status bookkeeping and historical tests.
 */
export function isModuleUnlocked(moduleUnlockedByModuleId, passedModuleIds) {
  if (moduleUnlockedByModuleId === null) return true;
  return passedModuleIds.includes(moduleUnlockedByModuleId);
}

/**
 * Legacy status helper: M3 passed + teacherValidated (historical M4 unlock signal).
 * NOT used for student learning-module navigation (see canAccessLearningModule).
 * Teacher validation and checkpoint records remain intact for analytics/cert paths.
 */
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
  for (const cc of state.cycleCounts) {
    if (cc.variance === 0 || !cc.resolved || cc.physicalQty == null) continue;
    const key = `${cc.sku}::${cc.bin}`;
    const actual = state.inventory[key] ?? 0;
    if (Math.abs(actual - cc.physicalQty) > 0.01) {
      issues.push(`${cc.sku} at ${cc.bin}: inventory (${actual}) does not match corrected physical count (${cc.physicalQty})`);
      issuesFr.push(`${cc.sku} à ${cc.bin} : le stock (${actual}) ne correspond pas à la quantité physique corrigée (${cc.physicalQty})`);
    }
  }
  if (isScn005Scenario(state)) {
    const pendingPutaway = getScn005PendingPutaways(state);
    if (pendingPutaway.length > 0) {
      const skus = pendingPutaway.map((p) => p.sku).join(", ");
      issues.push(`Reception stock not put away: ${skus}`);
      issuesFr.push(`Stock encore au quai — rangement PUTAWAY requis pour : ${skus}`);
    }
  }
  if (isScn007Scenario(state)) {
    const scn007Issues = getScn007ComplianceIssues(state);
    issues.push(...scn007Issues.issues);
    issuesFr.push(...scn007Issues.issuesFr);
  }
  return { compliant: issues.length === 0, issues, issuesFr };
}
export function getNextRequiredStep(completedSteps, moduleId = 1, state) {
  let steps;
  if (moduleId === 1) {
    steps = getEffectiveM1Steps(state);
  } else if (moduleId === 3) {
    steps = getEffectiveM3Steps(resolveM3InitialStateJson(state));
  } else {
    steps = moduleId === 2 ? MODULE2_STEPS : MODULE1_STEPS;
  }

  // SCN-002/005: any unposted GR blocks later steps until posted
  if (moduleId === 1 && state?.transactions) {
    const ghostGrPending = state.transactions.some((t) => t.docType === "GR" && !t.posted);
    if (ghostGrPending) {
      return steps.find((s) => s.code === "GR") ?? null;
    }
  }

  // SCN-005: dual putaway — block later steps until both SKUs leave reception
  if (moduleId === 1 && state && isScn005Scenario(state)) {
    const pendingPutaway = getScn005PendingPutaways(state);
    if (pendingPutaway.length > 0) {
      return steps.find((s) => s.code === "PUTAWAY_M1") ?? null;
    }
  }

  for (const step of steps) {
    if (!completedSteps.includes(step.code)) {
      if (
        moduleId === 1 &&
        (step.code === "PICKING_M1" || step.code === "GI") &&
        isScn003CorrectiveReplenishmentRequired(state)
      ) {
        const corrective = firstIncompleteScn003CorrectiveStep(state);
        if (corrective) return corrective;
      }
      return step;
    }
  }
  return null;
}
export function calculateProgressPct(completedSteps, moduleId = 1, state?) {
  const steps =
    moduleId === 3
      ? getEffectiveM3Steps(resolveM3InitialStateJson(state))
      : moduleId === 2
        ? MODULE2_STEPS
        : MODULE1_STEPS;
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
export function scoreKpiInterpretation(
  kpiKey: string,
  studentAnswer: string,
  kpiResult: ReturnType<typeof calculateKpis>,
  scnCode?: string | null,
) {
  const answer = normalizePedagogicalText(studentAnswer);
  if (kpiKey === "rotationRate") {
    const correct = kpiResult.rotationStatus;
    if (correct === "normal") {
      const short = evalKpiRotationShort(studentAnswer);
      if (short.ok) {
        return {
          isCorrect: true,
          pointsDelta: M4_STEP_MAX.KPI_ROTATION,
          feedback: short.feedbackFr,
        };
      }
      // Step contract: lecture (normal / bande) is enough; reject contradictions.
      const claimsNormal =
        matchConceptGroup(answer, CG_ROTATION_NORMAL) ||
        ((/\b6\s*x\b/.test(answer) || /\b6\s*fois\b/.test(answer)) &&
          hasAnyTerm(answer, ["bande", "zone", "normal", "normale", "equilibr"]));
      const lectureOk =
        claimsNormal &&
        !matchConceptGroup(answer, CG_ROTATION_OVERSTOCK) &&
        !matchConceptGroup(answer, CG_GLOBAL_DESTOCK) &&
        !matchConceptGroup(answer, CG_NO_ACTION) &&
        !hasAnyTerm(answer, ["mauvais", "insuffisant", "critique", "liquider", "liquidation"]);
      if (lectureOk) {
        return {
          isCorrect: true,
          pointsDelta: M4_STEP_MAX.KPI_ROTATION,
          feedback: `Correct — taux de rotation ${kpiResult.rotationRate}x → situation ${correct}`,
        };
      }
      return {
        isCorrect: false,
        pointsDelta: -5,
        feedback:
          short.contradictions.length > 0
            ? short.feedbackFr
            : short.missing.includes("lecture")
              ? `Incorrect — taux ${kpiResult.rotationRate}x indique une situation de ${correct}`
              : short.feedbackFr,
      };
    }
    const isCorrect =
      (correct === "surstock" && matchConceptGroup(answer, CG_ROTATION_OVERSTOCK)) ||
      (correct === "sous-performance" &&
        hasAnyTerm(answer, ["sous", "rupture", "insuffisant", "trop rapide", "sous-performance"]));
    return {
      isCorrect,
      pointsDelta: isCorrect ? M4_STEP_MAX.KPI_ROTATION : -5,
      feedback: isCorrect
        ? `Correct — taux de rotation ${kpiResult.rotationRate}x → situation ${correct}`
        : `Incorrect — taux ${kpiResult.rotationRate}x indique une situation de ${correct}`,
    };
  }
  if (kpiKey === "serviceLevel") {
    const correct = kpiResult.serviceLevelStatus;
    if (correct === "excellent") {
      const short = evalKpiServiceShort(studentAnswer);
      if (short.ok) {
        return {
          isCorrect: true,
          pointsDelta: M4_STEP_MAX.KPI_SERVICE,
          feedback: short.feedbackFr,
        };
      }
      // Step contract: classify as excellent; never accept weak false-positives (ex. « faible rotation »).
      const lectureOk =
        matchConceptGroup(answer, CG_SERVICE_EXCELLENT) &&
        !matchConceptGroup(answer, CG_SERVICE_WEAK);
      if (lectureOk) {
        return {
          isCorrect: true,
          pointsDelta: M4_STEP_MAX.KPI_SERVICE,
          feedback: `Correct — taux de service ${(kpiResult.serviceLevel * 100).toFixed(1)}% → ${correct}`,
        };
      }
      return {
        isCorrect: false,
        pointsDelta: -5,
        feedback: matchConceptGroup(answer, CG_SERVICE_WEAK)
          ? "95 % doit être classé excellent — pas faible/insuffisant."
          : short.feedbackFr ||
            `Incorrect — ${(kpiResult.serviceLevel * 100).toFixed(1)}% indique un niveau ${correct}`,
      };
    }
    const isCorrect =
      (correct === "acceptable" && hasAnyTerm(answer, ["acceptable", "moyen", "correct"])) ||
      (correct === "insuffisant" && matchConceptGroup(answer, CG_SERVICE_WEAK));
    return {
      isCorrect,
      pointsDelta: isCorrect ? M4_STEP_MAX.KPI_SERVICE : -5,
      feedback: isCorrect
        ? `Correct — taux de service ${(kpiResult.serviceLevel * 100).toFixed(1)}% → ${correct}`
        : `Incorrect — ${(kpiResult.serviceLevel * 100).toFixed(1)}% indique un niveau ${correct}`,
    };
  }
  if (kpiKey === "errorRate") {
    const correct = kpiResult.errorRateStatus;
    const isCorrect =
      (correct === "excellent" && hasAnyTerm(answer, ["excellent", "faible", "bien"])) ||
      (correct === "acceptable" && hasAnyTerm(answer, ["acceptable", "modere", "modéré", "correct", "amelior"])) ||
      (correct === "critique" && hasAnyTerm(answer, ["critique", "eleve", "élevé", "probleme", "action"]));
    return {
      isCorrect,
      pointsDelta: isCorrect ? 15 : -5,
      feedback: isCorrect
        ? `Correct — taux d'erreur ${(kpiResult.errorRate * 100).toFixed(2)}% → ${correct}`
        : `Incorrect — ${(kpiResult.errorRate * 100).toFixed(2)}% est un niveau ${correct}`,
    };
  }
  // Diagnostic: same gates as COMPLIANCE_M4 (short contradictions + concept competence + coherence)
  const scn = (scnCode ?? "SCN-012").toUpperCase();
  const short = evalKpiDiagnosticShort(scn, studentAnswer);
  if (short.contradictions.length > 0) {
    return {
      isCorrect: false,
      pointsDelta: 0,
      feedback: short.feedbackFr,
    };
  }
  const coherence = assessAnalyticalCoherence(studentAnswer);
  if (!coherence.coherent) {
    return {
      isCorrect: false,
      pointsDelta: 0,
      feedback:
        coherence.reason === "too_short"
          ? "Réponse trop courte — 1 à 3 phrases professionnelles."
          : "Réponse non professionnelle — évitez la liste de mots-clés ; formulez lecture, décision et suivi.",
    };
  }
  const concept = evaluateM4DiagnosticConcepts(scn, studentAnswer, kpiResult);
  if (short.ok && concept.competenceComplete) {
    return {
      isCorrect: true,
      pointsDelta: M4_STEP_MAX.KPI_DIAGNOSTIC,
      feedback: short.feedbackFr,
    };
  }
  if (concept.competenceComplete) {
    return {
      isCorrect: true,
      pointsDelta: M4_STEP_MAX.KPI_DIAGNOSTIC,
      feedback: "Bonne analyse stratégique — recommandation pertinente identifiée",
    };
  }
  if (matchConceptGroup(answer, CG_NO_ACTION) || matchConceptGroup(answer, CG_GLOBAL_DESTOCK)) {
    return {
      isCorrect: false,
      pointsDelta: 0,
      feedback: short.feedbackFr || "Contradiction ou absence d'action rejetée.",
    };
  }
  return {
    isCorrect: false,
    pointsDelta: 0,
    feedback:
      concept.issuesFr[0] ||
      short.feedbackFr ||
      "Analyse incomplète — lecture, décision et suivi attendus (1 à 3 phrases).",
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
  // Phase 3A: only stock-anchored fields must match the run. Seeded service/errors/lead
  // are legacy snapshot columns — not session-truth validation targets.
  const stockOk =
    Math.abs(submitted.averageStock - derived.averageStock) <= Math.max(1, derived.averageStock * 0.05) &&
    Math.abs(submitted.annualConsumption - derived.annualConsumption) <= Math.max(1, derived.annualConsumption * 0.05) &&
    Math.abs(submitted.stockValue - derived.stockValue) <= Math.max(1, derived.stockValue * 0.05);
  if (!stockOk) {
    return {
      allowed: false,
      reason: "Stock-anchored KPI values must match run-derived ledger within tolerance",
      reasonFr: "Les valeurs de stock du moniteur doivent correspondre au registre (±5 %)",
      reasonEn: "Stock-anchored KPI values must match run-derived ledger within tolerance (±5%)",
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

/** Build versioned session evidence from a run ledger snapshot (API / scoring). */
export function buildM5SessionEvidenceFromRunState(input: {
  initialStateJson?: M5InitialStateJson | null;
  completedSteps: string[];
  transactions: M5TransactionRow[];
  inventoryCounts: M5InventoryCountRow[];
  inventoryAdjustments: M5InventoryAdjustmentRow[];
  inventory: Record<string, number>;
  replenishmentQty?: number | null;
  runStartedAt?: Date | string | null;
  runCompletedAt?: Date | string | null;
  complianceOk?: boolean | null;
}): { ledger: M5KpiLedgerEvidence; sessionEvidence: M5SessionEvidenceV1; kpiData: KpiData } {
  const { kpiData, evidence: ledger } = deriveM5KpiFromRunEvidence(input.initialStateJson, {
    transactions: input.transactions,
    inventoryCounts: input.inventoryCounts,
    inventoryAdjustments: input.inventoryAdjustments,
    inventory: input.inventory,
    replenishmentQty: input.replenishmentQty,
  });
  const effective = getEffectiveM5Steps(input.initialStateJson, {
    inventoryCounts: input.inventoryCounts,
    inventoryAdjustments: input.inventoryAdjustments,
  });
  const contract = getM5ContractFromSeed(input.initialStateJson);
  const sessionEvidence = deriveM5SessionEvidenceV1({
    completedSteps: input.completedSteps,
    effectiveStepCodes: effective.map((s) => s.code),
    inventoryCounts: input.inventoryCounts,
    inventoryAdjustments: input.inventoryAdjustments,
    transactions: input.transactions,
    inventory: input.inventory,
    replenishmentQty: input.replenishmentQty,
    varianceResolved: ledger.varianceResolved,
    stockQtyAtBin: ledger.stockQtyAtBin,
    contractSku: contract?.sku,
    contractToBin: contract?.toBin,
    runStartedAt: input.runStartedAt,
    runCompletedAt: input.runCompletedAt,
    complianceOk: input.complianceOk,
  });
  return { ledger, sessionEvidence, kpiData };
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

/**
 * SCN-017 strategic point table (session evidence — m5-session-v1 only).
 *
 * Base (when all mandatory gates pass):
 *   15 base + (8 × evidence citations) + diagnostic 10 + priority 10
 *   + trade-off 12 + horizon 10 + recommendation 10 → capped at 80
 *
 * Mandatory gates (any miss → rejected; short-answer boost MUST NOT apply):
 *   ≥3 session evidence refs, diagnostic, priority, trade-off, recommendation, horizon
 *
 * Rejected ceilings (cannot reach 70):
 *   missing diagnostic ≤35, priority ≤40, trade-off ≤45, recommendation ≤50, horizon ≤60
 *
 * Generic short-answer boost (scoreM5Decision): Math.max(score, 70) only when !rejected.
 *
 * Legacy kpi_snapshots: Gold row-existence only — never citation sources.
 */
export const M5_SCN017_SCORE_TABLE = {
  base: 15,
  perEvidenceCitation: 8,
  diagnostic: 10,
  priority: 10,
  tradeOff: 12,
  horizon: 10,
  recommendation: 10,
  maxScore: 80,
  minPassingWithGates: 70,
  passThreshold: 70,
  minEvidenceCitations: 3,
  rejectedCeilings: {
    MISSING_DIAGNOSTIC: 35,
    MISSING_PRIORITY: 40,
    MISSING_TRADE_OFF: 45,
    MISSING_RECOMMENDATION: 50,
    MISSING_HORIZON: 60,
  },
  shortAnswerBoost: {
    floor: 70,
    appliesOnlyWhenNotRejected: true,
  },
} as const;

/**
 * SCN-017 strategic scoring — session evidence citations (m5-session-v1).
 * Legacy kpi_snapshots remain persisted for Gold existence checks but are not citation sources.
 * @param _legacySnapshot unused for citations (kept for call-site compatibility)
 */
export function scoreM5StrategicDecision(
  studentDecision: string,
  sessionEvidenceOrLegacySnapshot: M5SessionEvidenceV1 | M5KpiSnapshotValues,
  maybeLegacySnapshot?: M5KpiSnapshotValues | null,
): { score: number; feedback: string; rejected: boolean; rejectionReason?: string } {
  const text = studentDecision.trim();
  const lower = normalizePedagogicalText(text);

  // Version guard: never treat a legacy kpi_snapshots-shaped object as m5-session-v1.
  const sessionEvidence: M5SessionEvidenceV1 =
    sessionEvidenceOrLegacySnapshot &&
    "evidenceVersion" in sessionEvidenceOrLegacySnapshot &&
    sessionEvidenceOrLegacySnapshot.evidenceVersion === "m5-session-v1"
      ? sessionEvidenceOrLegacySnapshot
      : {
          evidenceVersion: "m5-session-v1",
          // Transitional: if only a legacy snapshot was passed, do not invent session fields.
        };

  void maybeLegacySnapshot;
  void STRATEGIC_BLOCK_WEIGHTS;

  const operationalPatterns = [
    /poster la reception/,
    /continuer le rangement/,
    /m5_reception/,
    /migo.*reception/,
    /valider la reception/,
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

  const { count: evidenceCitations } = countM5SessionEvidenceCitations(text, sessionEvidence);
  const hasTradeOff = matchConceptGroup(lower, CG_TRADEOFF);
  // Do NOT use bare CG_HORIZON_* terms like "90" — they false-match "exactitude 90%".
  const hasHorizon =
    hasAnyTerm(lower, [
      "prochain quart",
      "next shift",
      "7 jours",
      "7 days",
      "30 jours",
      "30 days",
      "90 jours",
      "90 days",
      "180 jours",
      "180 days",
      "3 mois",
      "6 mois",
      "prochain trimestre",
      "j-90",
      "court terme",
      "suivi mensuel",
      "revue a 90",
      "revue à 90",
    ]) ||
    (/\bhorizon\b/.test(lower) &&
      (/\b(7|30|90|180)\b/.test(lower) ||
        /prochain|trimestre|semestre|jours|days|quart|shift|semaine/.test(lower)));
  // Recommendation must be distinct from priority (CG_ONE_PRIORITY must not satisfy this gate).
  const hasRecommendation =
    /recommand/.test(lower) ||
    hasAnyTerm(lower, [
      "je propose",
      "nous proposons",
      "action:",
      "strategie:",
      "stratégie:",
      "investir dans",
      "politique de",
      "plan d",
      "initiative:",
      "objectif:",
    ]);
  const hasPriority =
    matchConceptGroup(lower, CG_ONE_PRIORITY) ||
    hasAnyTerm(lower, ["priorite", "priorité", "priority"]);
  const hasDiagnostic =
    matchConceptGroup(lower, CG_SITUATION_STABLE) ||
    hasAnyTerm(lower, ["diagnostic", "controle", "contrôl", "echec", "échec", "retabl", "rétabl", "risque"]);
  const stuffing = evaluateConceptGroups(
    text,
    [CG_TRADEOFF, CG_HORIZON_90_180],
    [CG_NO_ACTION],
  ).stuffingSuspected;

  if (isM4PortfolioOnlyEvidence(text, evidenceCitations)) {
    return {
      score: 0,
      feedback:
        "Décision rejetée — le portfolio M4 (6× / 95 % / 4 %) n'est pas une preuve de session M5. Citez au moins 3 preuves de votre run.",
      rejected: true,
      rejectionReason: "M4_PORTFOLIO_ONLY",
    };
  }

  if (stuffing && evidenceCitations < 3) {
    return {
      score: 0,
      feedback: "Décision rejetée — empilement de mots-clés sans preuves de session.",
      rejected: true,
      rejectionReason: "KEYWORD_STUFFING",
    };
  }

  if (evidenceCitations < 3) {
    return {
      score: 0,
      feedback:
        "Décision rejetée — citez au moins 3 preuves de session (ex. variance, stock corrigé, Q, exactitude, conformité, completion).",
      rejected: true,
      rejectionReason: "INSUFFICIENT_SESSION_EVIDENCE",
    };
  }

  if (!hasDiagnostic) {
    return {
      score: Math.min(M5_SCN017_SCORE_TABLE.rejectedCeilings.MISSING_DIAGNOSTIC, evidenceCitations * 10),
      feedback: "Preuves citées — ajoutez un diagnostic (contrôlé / écart / rétabli / risque restant).",
      rejected: true,
      rejectionReason: "MISSING_DIAGNOSTIC",
    };
  }

  if (!hasPriority) {
    return {
      score: Math.min(M5_SCN017_SCORE_TABLE.rejectedCeilings.MISSING_PRIORITY, evidenceCitations * 10),
      feedback: "Diagnostic partiel — nommez une priorité de gestion.",
      rejected: true,
      rejectionReason: "MISSING_PRIORITY",
    };
  }

  if (!hasTradeOff) {
    return {
      score: Math.min(M5_SCN017_SCORE_TABLE.rejectedCeilings.MISSING_TRADE_OFF, evidenceCitations * 10),
      feedback: "Priorité citée — ajoutez un arbitrage explicite (compromis).",
      rejected: true,
      rejectionReason: "MISSING_TRADE_OFF",
    };
  }

  if (!hasRecommendation) {
    return {
      score: Math.min(M5_SCN017_SCORE_TABLE.rejectedCeilings.MISSING_RECOMMENDATION, evidenceCitations * 10),
      feedback: "Arbitrage partiel — formulez une recommandation professionnelle.",
      rejected: true,
      rejectionReason: "MISSING_RECOMMENDATION",
    };
  }

  if (!hasHorizon) {
    return {
      score: Math.min(M5_SCN017_SCORE_TABLE.rejectedCeilings.MISSING_HORIZON, evidenceCitations * 10),
      feedback: "Recommandation partielle — précisez un horizon (prochain quart, 7 j, 30 j, ou 90–180 j).",
      rejected: true,
      rejectionReason: "MISSING_HORIZON",
    };
  }

  let score =
    M5_SCN017_SCORE_TABLE.base + evidenceCitations * M5_SCN017_SCORE_TABLE.perEvidenceCitation;
  if (hasDiagnostic) score += M5_SCN017_SCORE_TABLE.diagnostic;
  if (hasPriority) score += M5_SCN017_SCORE_TABLE.priority;
  if (hasTradeOff) score += M5_SCN017_SCORE_TABLE.tradeOff;
  if (hasHorizon) score += M5_SCN017_SCORE_TABLE.horizon;
  if (hasRecommendation) score += M5_SCN017_SCORE_TABLE.recommendation;

  return {
    score: Math.min(score, M5_SCN017_SCORE_TABLE.maxScore),
    feedback: [
      `✓ ${evidenceCitations} preuves de session citées`,
      "✓ Diagnostic",
      "✓ Priorité",
      "✓ Compromis",
      "✓ Horizon",
      "✓ Recommandation",
    ].join(" | "),
    rejected: false,
  };
}

export function scoreM5Decision(
  studentDecision: string,
  kpiResult: { rotationRate?: number; serviceLevel?: number; errorRate?: number },
  options?: {
    decisionLevel?: "TACTICAL" | "STRATEGIC";
    kpiSnapshot?: M5KpiSnapshotValues;
    sessionEvidence?: M5SessionEvidenceV1;
  },
) {
  // Always reject Q=0 vs positive replenishment contradictions first.
  if (hasQ0VsReplenishmentContradiction(studentDecision)) {
    return {
      score: 10,
      feedback:
        "Contradiction — stock suffisant / Q=0 ne peut pas coexister avec une recommandation de commander une quantité positive.",
      rejected: true,
      rejectionReason: "CONTRADICTORY_REPLENISHMENT",
    };
  }

  const level = options?.decisionLevel === "STRATEGIC" ? "STRATEGIC" : "TACTICAL";
  const short = evalM5DecisionShort(level, studentDecision);
  if (options?.decisionLevel === "STRATEGIC") {
    const evidence =
      options.sessionEvidence ??
      ({ evidenceVersion: "m5-session-v1" } as M5SessionEvidenceV1);
    const strategic = scoreM5StrategicDecision(studentDecision, evidence, options.kpiSnapshot);
    // Short-answer boost never bypasses mandatory dimension gates.
    if (short.ok && !strategic.rejected) {
      return {
        ...strategic,
        score: Math.max(strategic.score, M5_SCN017_SCORE_TABLE.shortAnswerBoost.floor),
        feedback: strategic.feedback,
      };
    }
    return strategic;
  }
  void kpiResult; // legacy M4-shaped display fields — not tactical session truth
  const text = normalizePedagogicalText(studentDecision);
  let score = 0;
  const feedbackParts: string[] = [];

  const nominal =
    matchConceptGroup(text, CG_M5_NOMINAL) || matchConceptGroup(text, CG_M5_Q_ZERO);
  const varianceAware = matchConceptGroup(text, CG_M5_VARIANCE_AWARE);

  if (hasAnyTerm(text, ["preuve", "evidence", "stock", "variance", "ecart", "écart"])) {
    score += 10;
    feedbackParts.push("✓ Preuves de session mentionnées");
  }
  if (hasAnyTerm(text, ["exactitude", "accuracy", "conformit", "completion"])) {
    score += 10;
    feedbackParts.push("✓ Indicateur de session cité");
  }
  if (hasAnyTerm(text, ["minimum", "q = 0", "q=0", "reappro", "réappro"])) {
    score += 10;
    feedbackParts.push("✓ Décision Q / stock référencée");
  }

  // Nominal / Q=0 is a complete professional stance — do not force invented problems.
  if (nominal) {
    score += 35;
    feedbackParts.push("✓ Décision nominale / Q=0 reconnue");
  } else if (hasAnyTerm(text, ["reapprovisionnement", "réapprovisionnement", "commander", "stock"])) {
    score += 15;
    feedbackParts.push("✓ Action de stock / réapprovisionnement proposée");
  }

  if (varianceAware) {
    score += 15;
    feedbackParts.push("✓ Écart / stock réconcilié pris en compte");
  } else if (hasAnyTerm(text, ["formation", "procedure", "procédure", "amelior", "amélior"])) {
    score += 10;
    feedbackParts.push("✓ Action corrective identifiée");
  }

  if (text.length > 80 && feedbackParts.length >= 2) {
    score += 10;
    feedbackParts.push(
      text.length > 150 && feedbackParts.length >= 4
        ? "✓ Analyse complète et justifiée"
        : "✓ Analyse justifiée",
    );
  }

  // Keyword lists without sentence punctuation are treated as stuffing.
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const hasSentencePunctuation = /[.!?;:]/.test(studentDecision);
  const stuffing =
    evaluateConceptGroups(studentDecision, [CG_M5_Q_ZERO], [CG_NO_ACTION]).stuffingSuspected ||
    (!hasSentencePunctuation && wordCount >= 8 && feedbackParts.length >= 3);
  if (stuffing) score = Math.min(score, 25);

  // Professional short answers: boost to pass threshold without erasing detailed feedback.
  if (short.ok) {
    score = Math.max(score, 70);
    if (feedbackParts.length === 0) feedbackParts.push(short.feedbackFr);
  }

  return {
    score: Math.min(score, 80),
    feedback:
      feedbackParts.length > 0
        ? feedbackParts.join(" | ")
        : short.feedbackFr ||
          "Décision insuffisamment justifiée — référencez les KPI observés ou le statut nominal du run",
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
  if (!state) return false;
  if (state.scnCode === "SCN-003") return true;
  if (state.scenarioId === 3) return true;

  const name = String(state.scenarioName ?? "");
  if (/stock\s+insuffisant/i.test(name)) return true;
  if (/sc[eé]nario\s*3\b/i.test(name) && /stock|insuffisant|backorder|r[eé]appro/i.test(name)) return true;

  const seed = state.scenarioInitialStateJson;
  const preload = seed?.preloadedTransactions;
  if (Array.isArray(preload)) {
    const hasPo50 = preload.some(
      (t) => t.docType === "PO" && t.sku === "SKU-003" && Number(t.qty) === 50 && t.bin === "REC-01" && t.posted
    );
    const hasGr50 = preload.some(
      (t) => t.docType === "GR" && t.sku === "SKU-003" && Number(t.qty) === 50 && t.bin === "REC-01" && t.posted
    );
    if (hasPo50 && hasGr50) return true;
  }
  const ctx = seed?.context;
  if (typeof ctx === "string" && /SO demandera 80|80\s*unit[eé]s/i.test(ctx)) return true;

  return false;
}

/** True when SCN-003 SO is posted and total STOCKAGE for the SO SKU is below SO quantity. */
export function isScn003CorrectiveReplenishmentRequired(state) {
  if (!isScn003Scenario(state)) return false;
  if (!state.completedSteps?.includes("SO")) return false;
  const soDemand = getPostedSoDemand(state);
  if (!soDemand) return false;

  const stockInStockage = getStockageAvailableForSku(state.inventory ?? {}, soDemand.sku);
  if (stockInStockage >= soDemand.qty) return false;

  const correctiveComplete =
    state.completedSteps.includes("PO_CORRECTIVE") &&
    state.completedSteps.includes("GR_CORRECTIVE") &&
    state.completedSteps.includes("PUTAWAY_CORRECTIVE");

  // After lawful corrective replenishment + picking, stock leaves STOCKAGE for EXPEDITION — do not re-gate GI.
  if (correctiveComplete && state.completedSteps.includes("PICKING_M1")) {
    return false;
  }

  return true;
}

function firstIncompleteScn003CorrectiveStep(state) {
  const completed = state?.completedSteps ?? [];
  for (const step of SCN003_CORRECTIVE_STEPS) {
    if (!completed.includes(step.code)) return step;
  }
  return null;
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
  if (!isScn003CorrectiveReplenishmentRequired(state)) return null;
  const soDemand = getPostedSoDemand(state)!;
  const stockAvailable = getStockageAvailableForSku(state.inventory ?? {}, soDemand.sku);
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
  if (isScn004Scenario(state)) {
    return [...SCN_004_M1_STEPS];
  }
  if (isScn005Scenario(state)) {
    return [...SCN_005_M1_STEPS];
  }

  let steps = [...MODULE1_STEPS];

  if (isScn003CorrectiveReplenishmentRequired(state)) {
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

/** Build FIFO lot catalog from putaway records merged with scenario seed (SCN-007/008). */
export function buildM2FifoLotCatalog(
  putawayRecords: Array<{ sku: string; toBin: string; lotNumber: string | null; receivedAt: Date; qty: number }>,
  scenarioSeed?: {
    lots?: Array<{ lotNumber: string; receivedAt: string; qty?: number }>;
    preloadedTransactions?: Array<{ docType: string; sku?: string; bin?: string; qty?: number; posted?: boolean; docRef?: string }>;
  }
): M2FifoLotEntry[] {
  const lots = scenarioSeed?.lots ?? [];
  const lotDateByNumber = new Map(
    lots.map((l) => [l.lotNumber, new Date(l.receivedAt)] as const)
  );
  const storageBinsList = [...STOCKAGE_BINS, ...PICKING_BINS, ...RESERVE_BINS];
  const storageGrs = (scenarioSeed?.preloadedTransactions ?? [])
    .filter((t) => t.docType === "GR" && t.posted && t.bin && t.sku && storageBinsList.includes(t.bin))
    .sort((a, b) => String(a.docRef ?? a.bin).localeCompare(String(b.docRef ?? b.bin)));

  const byKey = new Map<string, M2FifoLotEntry>();

  // Pair seed STOCKAGE GRs with lots in chronological order (oldest → first storage GR)
  const sortedLots = [...lots].sort(
    (a, b) => new Date(a.receivedAt).getTime() - new Date(b.receivedAt).getTime()
  );
  for (let i = 0; i < storageGrs.length; i++) {
    const gr = storageGrs[i]!;
    const lot = sortedLots[i];
    if (!lot || !gr.bin || !gr.sku) continue;
    byKey.set(`${lot.lotNumber}::${gr.bin}`, {
      lotNumber: lot.lotNumber,
      receivedAt: new Date(lot.receivedAt),
      toBin: gr.bin,
      sku: gr.sku,
    });
  }

  // Putaway records — preserve seed receivedAt when lot is known
  for (const p of putawayRecords) {
    if (!p.lotNumber) continue;
    const key = `${p.lotNumber}::${p.toBin}`;
    const seedDate = lotDateByNumber.get(p.lotNumber);
    byKey.set(key, {
      lotNumber: p.lotNumber,
      receivedAt: seedDate ?? new Date(p.receivedAt),
      toBin: p.toBin,
      sku: p.sku,
    });
  }

  return Array.from(byKey.values()).sort(
    (a, b) => a.receivedAt.getTime() - b.receivedAt.getTime()
  );
}

/** FIFO pick zones: STOCKAGE → EXPÉDITION only (never RÉCEPTION source / STOCKAGE dest). */
export function validateM2FifoPickZone(fromBin: string, toBin: string) {
  if (!STOCKAGE_BINS.includes(fromBin)) {
    return {
      allowed: false as const,
      reason: `FIFO pick fromBin must be STOCKAGE. Got: "${fromBin}"`,
      reasonFr: "Le prélèvement FIFO doit partir d'un emplacement de STOCKAGE.",
      reasonEn: "FIFO picking must start from a STOCKAGE location.",
      fieldError: { field: "fromBin", expected: "STOCKAGE", actual: fromBin },
    };
  }
  if (!EXPEDITION_BINS.includes(toBin)) {
    return {
      allowed: false as const,
      reason: `FIFO pick toBin must be EXPEDITION. Got: "${toBin}"`,
      reasonFr: "La destination doit être un emplacement de la zone EXPÉDITION.",
      reasonEn: "Destination must be an EXPÉDITION zone location.",
      fieldError: { field: "toBin", expected: EXPEDITION_BINS.join(" ou "), actual: toBin },
    };
  }
  return { allowed: true as const };
}

/** Global FIFO: oldest lot with remaining stock must be picked first (SCN-007/008). */
export function validateM2FifoPick(input: {
  sku: string;
  lotNumber: string;
  fromBin?: string;
  catalog: M2FifoLotEntry[];
  inventory: Record<string, number>;
}) {
  const skuLots = input.catalog
    .filter((e) => e.sku === input.sku)
    .sort((a, b) => a.receivedAt.getTime() - b.receivedAt.getTime());

  if (input.fromBin) {
    const lotAtBin = skuLots.find((e) => e.lotNumber === input.lotNumber && e.toBin === input.fromBin);
    const qtyAtBin = input.inventory[`${input.sku}::${input.fromBin}`] ?? 0;
    if (!lotAtBin || qtyAtBin <= 0) {
      return {
        allowed: false as const,
        requiredLot: undefined as string | undefined,
        reasonFr: "Le lot sélectionné n'est pas disponible dans l'emplacement source indiqué.",
        reasonEn: "The selected lot is not available in the indicated source location.",
        penaltyEvent: "FIFO_VIOLATION" as const,
        penaltyPoints: -10,
      };
    }
  }

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
      reasonFr: `La règle FIFO exige de prélever en priorité le lot ${oldestWithStock.lotNumber}, entré en stock le plus ancien.`,
      reasonEn: `FIFO requires picking lot ${oldestWithStock.lotNumber} first — it is the oldest lot entered into stock.`,
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

/**
 * Whether M2 PUTAWAY step is actually satisfied for progression.
 * SCN-007 requires exact 500+100 split; SCN-008 uses empty-reception heuristic;
 * other M2 scenarios complete only when reception is empty.
 */
export function isM2PutawayStepComplete(state) {
  if (isScn007Scenario(state)) {
    return isScn007PutawayComplete(state);
  }
  return isM2PutawaySatisfiedByInventory(state);
}

function effectiveM2CompletedSteps(completedSteps, state) {
  let effective = [...completedSteps];
  if (isScn007Scenario(state)) {
    // FIFO is out of path — strip if present from older runs
    effective = effective.filter((code) => code !== "FIFO_PICK");
    if (!isScn007PutawayComplete(state)) {
      effective = effective.filter((code) => code !== "PUTAWAY");
    } else if (!effective.includes("PUTAWAY")) {
      effective.push("PUTAWAY");
    }
    return effective;
  }
  if (!effective.includes("PUTAWAY") && isM2PutawaySatisfiedByInventory(state)) {
    effective.push("PUTAWAY");
  }
  return effective;
}

/** Exported for SCN-007 regression tests. */
export function getEffectiveM2CompletedSteps(completedSteps, state) {
  return effectiveM2CompletedSteps(completedSteps, state);
}

export function getNextRequiredStepAllModules(completedSteps, moduleId, state) {
  if (moduleId === 1) {
    return getNextRequiredStep(completedSteps, 1, state);
  }
  let steps;
  if (moduleId === 5) {
    steps = getEffectiveM5Steps(state?.m5InitialStateJson, state);
  } else if (moduleId === 2) {
    steps = getEffectiveM2Steps(state);
  } else if (moduleId === 3) {
    steps = getEffectiveM3Steps(resolveM3InitialStateJson(state));
  } else {
    const stepsMap = {
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
  } else if (moduleId === 2) {
    steps = getEffectiveM2Steps(state);
  } else if (moduleId === 3) {
    steps = getEffectiveM3Steps(resolveM3InitialStateJson(state));
  } else {
    const stepsMap = {
      4: MODULE4_STEPS,
      5: MODULE5_STEPS
    };
    steps = stepsMap[moduleId] ?? MODULE1_STEPS;
  }
  if (steps.length === 0) return 0;
  const stepCodes = new Set(steps.map((s) => s.code));
  const effective =
    moduleId === 2 ? effectiveM2CompletedSteps(completedSteps, state) : completedSteps;
  const completedInList = effective.filter((code) => stepCodes.has(code)).length;
  return Math.min(100, Math.round((completedInList / steps.length) * 100));
}
