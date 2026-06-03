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
  let stepDef = MODULE1_STEPS.find((s) => s.code === step);
  if (!stepDef && step === "ADJ") stepDef = ADJ_STEP;
  if (!stepDef) return { allowed: false, reason: "Unknown step", reasonFr: "Étape inconnue", reasonEn: "Unknown step" };
  if (stepDef.prerequisite && !state.completedSteps.includes(stepDef.prerequisite)) {
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
  }
  if (step === "ADJ") {
    if (!state.completedSteps.includes("CC")) {
      return {
        allowed: false,
        reason: "Cycle Count must be completed before Inventory Adjustment",
        reasonFr: "Le Cycle Count (MI01) doit être complété avant l'ajustement d'inventaire (MI07)",
        reasonEn: "Cycle Count must be completed before Inventory Adjustment."
      };
    }
    const hasVariance = state.cycleCounts.some((c) => c.variance !== 0 && !c.resolved);
    if (!hasVariance) {
      return {
        allowed: false,
        reason: "No unresolved inventory variance detected — ADJ not required",
        reasonFr: "Aucun écart d'inventaire non résolu détecté — l'ajustement ADJ n'est pas requis pour ce scénario",
        reasonEn: "No unresolved inventory variance detected — ADJ step is not required for this scenario."
      };
    }
  }
  if (step === "COMPLIANCE") {
    const hasVariance = state.cycleCounts.some((c) => c.variance !== 0);
    const hasUnresolvedVariance = state.cycleCounts.some((c) => c.variance !== 0 && !c.resolved);
    if (hasVariance && hasUnresolvedVariance) {
      return {
        allowed: false,
        reason: "Unresolved inventory variance — complete ADJ (MI07) before compliance check",
        reasonFr: "Écart d'inventaire non résolu — complétez l'ajustement ADJ (MI07) avant la conformité",
        reasonEn: "Unresolved inventory variance — complete ADJ (MI07) before the compliance check."
      };
    }
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
export const M3_VARIANCE_THRESHOLD = 5;
export function computeVariance(systemQty, countedQty) {
  const varianceQty = countedQty - systemQty;
  return {
    varianceQty,
    requiresJustification: Math.abs(varianceQty) >= M3_VARIANCE_THRESHOLD
  };
}
export function validateVarianceEntry(systemQty, countedQty, reason) {
  const { varianceQty, requiresJustification } = computeVariance(systemQty, countedQty);
  if (requiresJustification && (!reason || reason.trim().length < 5)) {
    return {
      allowed: false,
      reason: `Variance of ${varianceQty} exceeds threshold (${M3_VARIANCE_THRESHOLD}); justification required`,
      reasonFr: `L'écart de ${varianceQty} dépasse le seuil (${M3_VARIANCE_THRESHOLD}) — une justification est obligatoire`,
      reasonEn: `Variance of ${varianceQty} exceeds the threshold (${M3_VARIANCE_THRESHOLD}) — a justification is required.`
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
export function getNextRequiredStep(completedSteps, moduleId = 1) {
  const steps = moduleId === 3 ? MODULE3_STEPS : moduleId === 2 ? MODULE2_STEPS : MODULE1_STEPS;
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
  { code: "KPI_DATA", labelFr: "Collecte des données KPI", labelEn: "KPI Data Collection", order: 1, prerequisite: null, moduleId: 4 },
  { code: "KPI_ROTATION", labelFr: "Calcul rotation des stocks", labelEn: "Inventory Turnover", order: 2, prerequisite: "KPI_DATA", moduleId: 4 },
  { code: "KPI_SERVICE", labelFr: "Taux de service et erreurs", labelEn: "Service Level & Error Rate", order: 3, prerequisite: "KPI_ROTATION", moduleId: 4 },
  { code: "KPI_DIAGNOSTIC", labelFr: "Diagnostic global de performance", labelEn: "Global Performance Diagnosis", order: 4, prerequisite: "KPI_SERVICE", moduleId: 4 },
  { code: "COMPLIANCE_M4", labelFr: "Validation finale M4", labelEn: "M4 Final Validation", order: 5, prerequisite: "KPI_DIAGNOSTIC", moduleId: 4 }
];
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
      pointsDelta: isCorrect ? 15 : -5,
      feedback: isCorrect ? `Correct — taux de rotation ${kpiResult.rotationRate}x → situation ${correct}` : `Incorrect — taux ${kpiResult.rotationRate}x indique une situation de ${correct}`
    };
  }
  if (kpiKey === "serviceLevel") {
    const correct = kpiResult.serviceLevelStatus;
    const isCorrect = correct === "excellent" && (answer.includes("excellent") || answer.includes("très bon") || answer.includes("optimal")) || correct === "acceptable" && (answer.includes("acceptable") || answer.includes("moyen") || answer.includes("correct")) || correct === "insuffisant" && (answer.includes("insuffisant") || answer.includes("faible") || answer.includes("problème") || answer.includes("améliorer"));
    return {
      isCorrect,
      pointsDelta: isCorrect ? 15 : -5,
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
    pointsDelta: hasRecommendation ? 20 : 0,
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
export function scoreM5Decision(studentDecision, kpiResult) {
  const text = studentDecision.toLowerCase();
  let score = 0;
  const feedbackParts = [];
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
    // max 80 pts from decision, rest from sequence
    feedback: feedbackParts.length > 0 ? feedbackParts.join(" | ") : "Décision insuffisamment justifiée — référencez les KPI observés"
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

// ─── Helper: build the effective M1 step list based on run state ──────────────
export function getEffectiveM1Steps(state) {
  const hasUnresolvedVariance =
    state &&
    Array.isArray(state.cycleCounts) &&
    state.cycleCounts.some((c) => c.variance !== 0 && !c.resolved);
  if (!hasUnresolvedVariance) {
    // No variance: standard 9-step flow, ADJ absent
    return MODULE1_STEPS;
  }
  // Variance detected: insert ADJ between CC (order 8) and COMPLIANCE (order 9)
  const withAdj = [...MODULE1_STEPS];
  const complianceIdx = withAdj.findIndex((s) => s.code === "COMPLIANCE");
  withAdj.splice(complianceIdx, 0, ADJ_STEP);
  return withAdj;
}

export function getNextRequiredStepAllModules(completedSteps, moduleId, state) {
  let steps;
  if (moduleId === 1) {
    steps = getEffectiveM1Steps(state);
  } else {
    const stepsMap = {
      2: MODULE2_STEPS,
      3: MODULE3_STEPS,
      4: MODULE4_STEPS,
      5: MODULE5_STEPS
    };
    steps = stepsMap[moduleId] ?? MODULE1_STEPS;
  }
  for (const step of steps) {
    if (!completedSteps.includes(step.code)) {
      return step;
    }
  }
  return null;
}

export function calculateProgressPctAllModules(completedSteps, moduleId, state) {
  let steps;
  if (moduleId === 1) {
    steps = getEffectiveM1Steps(state);
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
  return Math.round(completedSteps.length / steps.length * 100);
}
