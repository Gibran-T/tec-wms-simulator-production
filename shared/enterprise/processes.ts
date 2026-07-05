/** Enterprise Process Mapping — PROC-* canonical process library (Manifesto Part IX) */

export interface ProcessDefinition {
  processId: string;
  titleFr: string;
  titleEn: string;
  wmsAnchor: string;
  modules: number[];
  learningTransferFr: string;
  learningTransferEn: string;
}

export const PROCESS_REGISTRY: Record<string, ProcessDefinition> = {
  "PROC-PO": {
    processId: "PROC-PO",
    titleFr: "Gestion des bons de commande",
    titleEn: "Purchase order management",
    wmsAnchor: "PO / ME21N",
    modules: [1, 3, 5],
    learningTransferFr:
      "Un bon de commande est une promesse, pas du stock. Tant que la réception n'est pas postée, l'entreprise a une obligation mais aucun stock utilisable.",
    learningTransferEn:
      "A purchase order is a promise, not inventory. Until goods are received and posted, the enterprise has obligation but no usable stock.",
  },
  "PROC-GR": {
    processId: "PROC-GR",
    titleFr: "Réception marchandises / validation quai",
    titleEn: "Goods receipt / dock validation",
    wmsAnchor: "GR / MIGO",
    modules: [1, 2, 5],
    learningTransferFr:
      "Pas de GR postée, pas de stock. Un document en brouillon est invisible pour la promesse client.",
    learningTransferEn:
      "No posted GR, no stock. A draft document is invisible to the customer promise.",
  },
  "PROC-PUT": {
    processId: "PROC-PUT",
    titleFr: "Rangement / slotting",
    titleEn: "Putaway / slotting",
    wmsAnchor: "LT01 / PUTAWAY",
    modules: [1, 2],
    learningTransferFr:
      "Le rangement assigne la responsabilité physique. Un SKU au quai n'est pas encore gouverné en entrepôt.",
    learningTransferEn:
      "Putaway assigns physical accountability. A SKU at the dock is not yet governed in the warehouse.",
  },
  "PROC-SO": {
    processId: "PROC-SO",
    titleFr: "Commande client / signal de demande",
    titleEn: "Sales order / demand signal",
    wmsAnchor: "SO / VA01",
    modules: [1, 3],
    learningTransferFr:
      "Une commande client est une promesse au client, pas une expédition. La disponibilité ATP doit précéder l'engagement.",
    learningTransferEn:
      "A sales order is a promise to the customer, not a shipment. ATP visibility must precede commitment.",
  },
  "PROC-PICK": {
    processId: "PROC-PICK",
    titleFr: "Exécution du prélèvement",
    titleEn: "Pick execution",
    wmsAnchor: "Pick / VL01N",
    modules: [1, 2, 5],
    learningTransferFr:
      "Le prélèvement matérialise la promesse client. La rotation et la zone d'expédition sont des décisions de conformité.",
    learningTransferEn:
      "Picking materializes the customer promise. Rotation and staging zone are compliance decisions.",
  },
  "PROC-SHIP": {
    processId: "PROC-SHIP",
    titleFr: "Confirmation d'expédition / sortie de stock",
    titleEn: "Shipment confirmation / goods issue",
    wmsAnchor: "VL02N / GI",
    modules: [1, 5],
    learningTransferFr:
      "La sortie de stock transfère la propriété. Poster sans stock disponible crée une rupture de confiance système.",
    learningTransferEn:
      "Goods issue transfers ownership. Posting without available stock breaks system trust.",
  },
  "PROC-CC": {
    processId: "PROC-CC",
    titleFr: "Inventaire physique / cycle count",
    titleEn: "Physical inventory / cycle count",
    wmsAnchor: "MI01",
    modules: [1, 2, 3, 4],
    learningTransferFr:
      "Le comptage physique révèle la vérité. Saisir l'écart brut, pas le delta, est une règle universelle ERP.",
    learningTransferEn:
      "Physical count reveals truth. Enter the physical count, not the delta — a universal ERP rule.",
  },
  "PROC-ADJ": {
    processId: "PROC-ADJ",
    titleFr: "Ajustement d'inventaire / résolution d'écart",
    titleEn: "Inventory adjustment / variance resolution",
    wmsAnchor: "MI01 / ADJ",
    modules: [1, 3],
    learningTransferFr:
      "Un ajustement sans preuve comptable est une perte de gouvernance. Documenter la cause avant de poster.",
    learningTransferEn:
      "An adjustment without documented cause is a governance failure. Document the reason before posting.",
  },
  "PROC-STOCK": {
    processId: "PROC-STOCK",
    titleFr: "Consultation de disponibilité",
    titleEn: "Stock availability inquiry",
    wmsAnchor: "MB52",
    modules: [1, 3],
    learningTransferFr:
      "La disponibilité ATP inclut les réservations et exclut les documents non postés — source fréquente de rupture.",
    learningTransferEn:
      "ATP includes reservations and excludes unposted documents — a frequent stockout source.",
  },
  "PROC-REP": {
    processId: "PROC-REP",
    titleFr: "Déclencheur de réapprovisionnement",
    titleEn: "Replenishment trigger",
    wmsAnchor: "Min/Max · ROP",
    modules: [3],
    learningTransferFr:
      "Min/Max traduit la stratégie de service en signal d'action. Chaque unité en rack a un coût et chaque rupture a un prix.",
    learningTransferEn:
      "Min/Max translates service strategy into action signals. Every unit on the rack has a cost; every stockout has a price.",
  },
  "PROC-FIFO": {
    processId: "PROC-FIFO",
    titleFr: "Conformité rotation / lot",
    titleEn: "Rotation / batch compliance",
    wmsAnchor: "FIFO policy",
    modules: [2],
    learningTransferFr:
      "La rotation est une décision de conformité, pas une préférence de tri. Prélever le lot le plus récent est un risque de rappel.",
    learningTransferEn:
      "Rotation is a compliance decision, not a sort preference. Picking the newest lot is a recall risk.",
  },
  "PROC-KPI": {
    processId: "PROC-KPI",
    titleFr: "Diagnostic de performance",
    titleEn: "Performance diagnosis",
    wmsAnchor: "KPI Tower",
    modules: [4],
    learningTransferFr:
      "Un KPI isolé ment. Le diagnostic professionnel relie OTIF, rotation, immobilisation et taux d'erreur.",
    learningTransferEn:
      "A KPI in isolation misleads. Professional diagnosis links OTIF, rotation, carrying cost, and error rate.",
  },
  "PROC-PEAK": {
    processId: "PROC-PEAK",
    titleFr: "Opérations intégrées de crise",
    titleEn: "Integrated crisis operations",
    wmsAnchor: "M5 capstone",
    modules: [5],
    learningTransferFr:
      "En semaine de pointe, la priorité est la promesse client sous contrainte — pas l'exécution transactionnelle isolée.",
    learningTransferEn:
      "During Peak Week, priority is customer promise under constraint — not isolated transaction execution.",
  },
};

/** Step code → primary PROC-* for active-step context */
export const STEP_TO_PROCESS: Record<string, string> = {
  PO: "PROC-PO",
  GR: "PROC-GR",
  PUTAWAY: "PROC-PUT",
  PUTAWAY_M1: "PROC-PUT",
  LT0A: "PROC-PUT",
  SO: "PROC-SO",
  PICKING: "PROC-PICK",
  PICKING_M1: "PROC-PICK",
  GI: "PROC-SHIP",
  CC: "PROC-CC",
  CC_LIST: "PROC-CC",
  CC_COUNT: "PROC-CC",
  CC_RECON: "PROC-CC",
  ADJ: "PROC-ADJ",
  STOCK: "PROC-STOCK",
  REPLENISH: "PROC-REP",
  COMPLIANCE: "PROC-CC",
  COMPLIANCE_M3: "PROC-REP",
  COMPLIANCE_M4: "PROC-KPI",
  COMPLIANCE_M5: "PROC-PEAK",
  KPI_INTERPRET: "PROC-KPI",
  M5_DECISION: "PROC-PEAK",
  M5_STRATEGIC: "PROC-PEAK",
};

/** Default process families per SCN (Universe Part XII + Process Mapping module alignment) */
export const SCN_PROCESS_FAMILY: Record<string, string[]> = {
  "SCN-001": ["PROC-PO", "PROC-GR", "PROC-PUT", "PROC-SO", "PROC-PICK", "PROC-SHIP", "PROC-CC"],
  "SCN-002": ["PROC-GR", "PROC-STOCK", "PROC-PO", "PROC-PUT", "PROC-SHIP"],
  "SCN-003": ["PROC-SO", "PROC-STOCK", "PROC-PO", "PROC-GR"],
  "SCN-004": ["PROC-CC", "PROC-ADJ", "PROC-STOCK"],
  "SCN-005": ["PROC-GR", "PROC-PUT", "PROC-CC", "PROC-ADJ", "PROC-SHIP"],
  "SCN-006": ["PROC-GR", "PROC-PUT", "PROC-STOCK"],
  "SCN-007": ["PROC-PUT", "PROC-STOCK"],
  "SCN-008": ["PROC-PUT", "PROC-FIFO", "PROC-PICK"],
  "SCN-009": ["PROC-CC", "PROC-ADJ", "PROC-REP", "PROC-STOCK"],
  "SCN-010": ["PROC-CC", "PROC-ADJ", "PROC-REP"],
  "SCN-011": ["PROC-REP", "PROC-STOCK", "PROC-CC"],
  "SCN-012": ["PROC-KPI", "PROC-STOCK"],
  "SCN-013": ["PROC-KPI", "PROC-SO"],
  "SCN-014": ["PROC-KPI"],
  "SCN-015": ["PROC-PEAK", "PROC-GR", "PROC-PUT"],
  "SCN-016": ["PROC-PEAK", "PROC-PICK", "PROC-SHIP", "PROC-CC"],
  "SCN-017": ["PROC-PEAK", "PROC-KPI"],
};

export function getProcessById(id: string): ProcessDefinition | undefined {
  return PROCESS_REGISTRY[id];
}

export function getProcessFamilyForScn(scnCode: string): string[] {
  return SCN_PROCESS_FAMILY[scnCode] ?? [];
}

export function getProcessForStep(stepCode: string | null | undefined): string | null {
  if (!stepCode) return null;
  return STEP_TO_PROCESS[stepCode] ?? null;
}
