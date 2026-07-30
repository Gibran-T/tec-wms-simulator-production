/**
 * M5 closing-shift capstone — canonical contracts and sealed mission summaries.
 * No multi-SKU / OTIF / GI / mission-parent schema. Priority is a scenario constraint
 * enforced through stock, min, Q and "no artificial adjustment" rules.
 */

export const M5_CAPSTONE_ROLE = {
  fr: "Superviseur d'exploitation — quart de clôture",
  en: "Operations supervisor — closing shift",
} as const;

export const M5_LEARNING_CHAIN = {
  fr: "EXÉCUTER → MESURER → RÉCONCILIER → ARBITRER → DÉFENDRE",
  en: "EXECUTE → MEASURE → RECONCILE → ARBITRATE → DEFEND",
} as const;

export const M5_OFFICIAL_ORDER = {
  fr: "Slides → Quiz M5 → Pré-M5 → SCN-015 → SCN-016 → SCN-017 → Post-M5 → Conclusion",
  en: "Slides → Quiz M5 → Pré-M5 → SCN-015 → SCN-016 → SCN-017 → Post-M5 → Conclusion",
} as const;

/** Shared operational base (single SKU) used by SCN-015 / 016 / 017. */
export const M5_CANONICAL_OPS = {
  sku: "SKU-001",
  inboundQty: 50,
  initialStockQty: 0,
  poRef: "PO-M5-001",
  lotNumber: "LOT-M5-A",
  fromBin: "REC-01",
  toBin: "B-01-R1-L1",
  storageCapacity: 100,
  minQty: 10,
  maxQty: 100,
  safetyStock: 5,
  operationalWindow: {
    fr: "Quart de clôture Peak Week — fenêtre ops continue (réception → rangement → décision)",
    en: "Peak Week closing shift — continuous ops window (receipt → putaway → decision)",
  },
  priorityRequirement: {
    customerCode: "CLI-PRIORITAIRE-A",
    reservedQty: 10,
    noteFr:
      "Protéger la disponibilité minimale (10 u.) pour la commande prioritaire CLI-PRIORITAIRE-A sans désorganiser le flux inbound.",
    noteEn:
      "Protect minimum availability (10 u.) for priority order CLI-PRIORITAIRE-A without disrupting the inbound flow.",
  },
} as const;

export const M5_SCN015_TITLE = {
  fr: "Protéger une commande prioritaire sans désorganiser le flux",
  en: "Protect a priority order without disrupting the flow",
} as const;

export const M5_SCN016_TITLE = {
  fr: "Réconcilier avant de décider",
  en: "Reconcile before deciding",
} as const;

export const M5_SCN017_TITLE = {
  fr: "Présenter le bilan du quart et défendre le prochain plan d'action",
  en: "Present the shift review and defend the next action plan",
} as const;

export const M5_SCN015_MESSAGE = {
  fr: "Une opération conforme ne nécessite pas une correction artificielle.",
  en: "A compliant operation does not require an artificial correction.",
} as const;

export const M5_SCN016_MESSAGE = {
  fr: "Réconcilier d'abord, décider ensuite.",
  en: "Reconcile first, decide next.",
} as const;

export const M5_SCN016_CONTRACT = {
  systemQty: 50,
  physicalQty: 45,
  varianceQty: -5,
  adjustmentQty: -5,
  correctedStockQty: 45,
  minQty: 10,
  expectedQ: 0,
  accuracyBefore: 0.9,
  accuracyAfter: 1,
} as const;

/**
 * Sealed pedagogical summaries for SCN-017 briefing continuity.
 * These are the validated expected outcomes of the M5 contracts — not invented OTIF/backlog.
 */
export const M5_SEALED_MISSION_SUMMARIES = {
  "SCN-015": {
    fr: [
      "SCN-015 (cycle nominal) : réception 50 + putaway complétés ; aucune variance ouverte ; aucun ajustement artificiel.",
      "Priorité CLI-PRIORITAIRE-A protégée via stock final ≥ minimum 10 ; Q = 0 validé (stock suffisant).",
      "Preuve de session typique : parcours complété · stock final 50 · Q = 0 · conformité OK.",
    ],
    en: [
      "SCN-015 (nominal cycle): receipt 50 + putaway completed; no open variance; no artificial adjustment.",
      "Priority CLI-PRIORITAIRE-A protected via final stock ≥ minimum 10; Q = 0 validated (sufficient stock).",
      "Typical session evidence: journey complete · final stock 50 · Q = 0 · compliance OK.",
    ],
  },
  "SCN-016": {
    fr: [
      "SCN-016 (écart) : système 50 · physique 45 · variance −5 → décision bloquée jusqu'à réconciliation.",
      "Ajustement −5 → stock corrigé 45 · exactitude 90 % → 100 % · minimum 10 → Q = 0.",
      "Leçon : réconcilier d'abord, décider ensuite — ajustement ≠ réapprovisionnement.",
    ],
    en: [
      "SCN-016 (variance): system 50 · physical 45 · variance −5 → decision blocked until reconciliation.",
      "Adjustment −5 → corrected stock 45 · accuracy 90% → 100% · minimum 10 → Q = 0.",
      "Lesson: reconcile first, decide next — adjustment ≠ replenishment.",
    ],
  },
} as const;

export const M5_SCN017_DEFENSE_STRUCTURE = {
  fr: ["preuves (≥3)", "diagnostic", "priorité", "compromis", "horizon", "recommandation"],
  en: ["evidence (≥3)", "diagnostic", "priority", "trade-off", "horizon", "recommendation"],
} as const;

export const M5_FORBIDDEN_PORTFOLIO_MARKERS = [
  "6×",
  "6x",
  "95%",
  "4%",
  "3.5",
  "3,5",
  "48000",
  "48 000",
  "48,000",
] as const;

/** Build m5Contract-shaped object for seeds / runtime defaults (no DB migration). */
export function buildCanonicalM5ContractFields(profile: "NOMINAL_INTEGRATED" | "EXCEPTION_VARIANCE" | "STRATEGIC_CAPSTONE") {
  const base = {
    sku: M5_CANONICAL_OPS.sku,
    qty: M5_CANONICAL_OPS.inboundQty,
    poRef: M5_CANONICAL_OPS.poRef,
    lotNumber: M5_CANONICAL_OPS.lotNumber,
    fromBin: M5_CANONICAL_OPS.fromBin,
    toBin: M5_CANONICAL_OPS.toBin,
    initialStockQty: M5_CANONICAL_OPS.initialStockQty,
    storageCapacity: M5_CANONICAL_OPS.storageCapacity,
    operationalWindow: M5_CANONICAL_OPS.operationalWindow.fr,
    priorityRequirement: {
      customerCode: M5_CANONICAL_OPS.priorityRequirement.customerCode,
      reservedQty: M5_CANONICAL_OPS.priorityRequirement.reservedQty,
      note: M5_CANONICAL_OPS.priorityRequirement.noteFr,
    },
    replenishmentParams: {
      minQty: M5_CANONICAL_OPS.minQty,
      maxQty: M5_CANONICAL_OPS.maxQty,
      safetyStock: M5_CANONICAL_OPS.safetyStock,
    },
    profile,
  };

  if (profile === "EXCEPTION_VARIANCE") {
    return {
      ...base,
      varianceInjection: M5_SCN016_CONTRACT.varianceQty,
      cycleCountTargets: [
        {
          sku: M5_CANONICAL_OPS.sku,
          bin: M5_CANONICAL_OPS.toBin,
          systemQty: M5_SCN016_CONTRACT.systemQty,
          physicalQty: M5_SCN016_CONTRACT.physicalQty,
        },
      ],
      decisionLevel: "TACTICAL" as const,
    };
  }
  if (profile === "STRATEGIC_CAPSTONE") {
    return {
      ...base,
      varianceInjection: null,
      decisionLevel: "STRATEGIC" as const,
    };
  }
  return {
    ...base,
    varianceInjection: null,
    decisionLevel: "TACTICAL" as const,
  };
}
