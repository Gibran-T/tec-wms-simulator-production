/** Display-only ERP/WMS learning hints keyed by step code (from StepForm pedagogy). */
export interface StepErpHint {
  erpModule: { fr: string; en: string };
  wmsFunction: { fr: string; en: string };
  sapTCode: string;
  odooEquivalent: { fr: string; en: string };
  whyShort: { fr: string; en: string };
}

const DEFAULT_HINT: StepErpHint = {
  erpModule: { fr: "Module ERP logistique", en: "Logistics ERP module" },
  wmsFunction: { fr: "Exécution entrepôt", en: "Warehouse execution" },
  sapTCode: "—",
  odooEquivalent: { fr: "Opération entrepôt", en: "Warehouse operation" },
  whyShort: { fr: "Cette étape fait partie du flux opérationnel standard.", en: "This step is part of the standard operational flow." },
};

export const STEP_ERP_MAP: Record<string, StepErpHint> = {
  PO: { erpModule: { fr: "MM — Achats", en: "MM — Procurement" }, wmsFunction: { fr: "Déclenchement approvisionnement", en: "Procurement trigger" }, sapTCode: "ME21N", odooEquivalent: { fr: "Bon de commande", en: "Purchase Order" }, whyShort: { fr: "Le PO engage l'entreprise envers le fournisseur.", en: "The PO commits the company to the supplier." } },
  GR: { erpModule: { fr: "MM — Réception", en: "MM — Receiving" }, wmsFunction: { fr: "Réception quai", en: "Dock receiving" }, sapTCode: "MIGO", odooEquivalent: { fr: "Réception / Transfert stock", en: "Receipt / Stock transfer" }, whyShort: { fr: "Le stock n'augmente qu'après posting GR.", en: "Stock only increases after GR posting." } },
  PUTAWAY_M1: { erpModule: { fr: "WM — Transfert", en: "WM — Transfer" }, wmsFunction: { fr: "Rangement", en: "Putaway" }, sapTCode: "LT0A", odooEquivalent: { fr: "Transfert interne", en: "Internal transfer" }, whyShort: { fr: "Déplace le stock REC → STOCKAGE.", en: "Moves stock REC → STOCKAGE." } },
  PUTAWAY: { erpModule: { fr: "WM — Rangement", en: "WM — Putaway" }, wmsFunction: { fr: "Affectation emplacement", en: "Bin assignment" }, sapTCode: "LT01", odooEquivalent: { fr: "Règles de rangement", en: "Putaway rules" }, whyShort: { fr: "Slotting conforme capacité et zone.", en: "Slotting per capacity and zone rules." } },
  STOCK: { erpModule: { fr: "MM — Stocks", en: "MM — Inventory" }, wmsFunction: { fr: "Disponibilité", en: "Availability check" }, sapTCode: "MB52", odooEquivalent: { fr: "Stock disponible", en: "On-hand stock" }, whyShort: { fr: "Confirme stock prêt pour expédition.", en: "Confirms stock ready to ship." } },
  SO: { erpModule: { fr: "SD — Ventes", en: "SD — Sales" }, wmsFunction: { fr: "Commande client", en: "Customer order" }, sapTCode: "VA01", odooEquivalent: { fr: "Commande client", en: "Sales Order" }, whyShort: { fr: "Déclenche réservation et expédition.", en: "Triggers reservation and shipping." } },
  PICKING_M1: { erpModule: { fr: "WM — Prélèvement", en: "WM — Picking" }, wmsFunction: { fr: "Préparation commande", en: "Order picking" }, sapTCode: "VL01N", odooEquivalent: { fr: "Bon de livraison / Picking", en: "Delivery / Picking" }, whyShort: { fr: "Déplace STOCKAGE → EXPÉDITION.", en: "Moves STOCKAGE → SHIPPING." } },
  PICKING: { erpModule: { fr: "WM — Prélèvement", en: "WM — Picking" }, wmsFunction: { fr: "Préparation", en: "Picking" }, sapTCode: "VL01N", odooEquivalent: { fr: "Picking", en: "Picking" }, whyShort: { fr: "Prépare la marchandise au quai.", en: "Prepares goods at dock." } },
  GI: { erpModule: { fr: "SD — Expédition", en: "SD — Shipping" }, wmsFunction: { fr: "Sortie marchandises", en: "Goods issue" }, sapTCode: "VL02N", odooEquivalent: { fr: "Livraison validée", en: "Validated delivery" }, whyShort: { fr: "Réduit stock et clôture livraison.", en: "Reduces stock and closes shipment." } },
  CC: { erpModule: { fr: "IM — Inventaire", en: "IM — Inventory" }, wmsFunction: { fr: "Comptage cyclique", en: "Cycle count" }, sapTCode: "MI01", odooEquivalent: { fr: "Inventaire cyclique", en: "Cycle count" }, whyShort: { fr: "Compare physique vs système.", en: "Compares physical vs system." } },
  ADJ: { erpModule: { fr: "IM — Ajustement", en: "IM — Adjustment" }, wmsFunction: { fr: "Correction écart", en: "Variance correction" }, sapTCode: "MI07", odooEquivalent: { fr: "Ajustement inventaire", en: "Inventory adjustment" }, whyShort: { fr: "Aligne stock système sur physique.", en: "Aligns system stock to physical." } },
  COMPLIANCE: { erpModule: { fr: "Cross-module", en: "Cross-module" }, wmsFunction: { fr: "Clôture conformité", en: "Compliance closing" }, sapTCode: "MB52", odooEquivalent: { fr: "Contrôle cohérence", en: "Consistency check" }, whyShort: { fr: "Valide absence de bloqueurs.", en: "Validates no blockers remain." } },
  FIFO_PICK: { erpModule: { fr: "WM — Lots", en: "WM — Batches" }, wmsFunction: { fr: "Prélèvement FIFO", en: "FIFO picking" }, sapTCode: "FIFO", odooEquivalent: { fr: "Stratégie FIFO", en: "FIFO strategy" }, whyShort: { fr: "Lot le plus ancien en premier.", en: "Oldest lot first." } },
  STOCK_ACCURACY: { erpModule: { fr: "IM — Précision", en: "IM — Accuracy" }, wmsFunction: { fr: "Contrôle précision", en: "Accuracy control" }, sapTCode: "MI01", odooEquivalent: { fr: "Précision inventaire", en: "Inventory accuracy" }, whyShort: { fr: "Mesure fiabilité stock.", en: "Measures stock reliability." } },
  COMPLIANCE_ADV: { erpModule: { fr: "WM — Conformité", en: "WM — Compliance" }, wmsFunction: { fr: "Conformité M2", en: "M2 compliance" }, sapTCode: "—", odooEquivalent: { fr: "Validation M2", en: "M2 validation" }, whyShort: { fr: "Clôture scénario M2.", en: "Closes M2 scenario." } },
  CC_LIST: { erpModule: { fr: "IM — Inventaire", en: "IM — Inventory" }, wmsFunction: { fr: "Liste comptage", en: "Count list" }, sapTCode: "MI01", odooEquivalent: { fr: "Liste inventaire", en: "Count list" }, whyShort: { fr: "Définit quoi compter.", en: "Defines what to count." } },
  CC_COUNT: { erpModule: { fr: "IM — Inventaire", en: "IM — Inventory" }, wmsFunction: { fr: "Saisie comptage", en: "Count entry" }, sapTCode: "MI04", odooEquivalent: { fr: "Saisie quantités", en: "Quantity entry" }, whyShort: { fr: "Capture quantité physique.", en: "Captures physical quantity." } },
  CC_RECON: { erpModule: { fr: "IM — Réconciliation", en: "IM — Reconciliation" }, wmsFunction: { fr: "Analyse écart", en: "Variance analysis" }, sapTCode: "MI07", odooEquivalent: { fr: "Réconciliation", en: "Reconciliation" }, whyShort: { fr: "Justifie et ajuste écarts.", en: "Justifies and adjusts variances." } },
  REPLENISH: { erpModule: { fr: "MRP — Réappro", en: "MRP — Replenishment" }, wmsFunction: { fr: "Suggestion réappro", en: "Replenishment suggestion" }, sapTCode: "MD04", odooEquivalent: { fr: "Règles réappro", en: "Reorder rules" }, whyShort: { fr: "Maintient niveau Min/Max.", en: "Maintains Min/Max levels." } },
  COMPLIANCE_M3: { erpModule: { fr: "IM — Conformité", en: "IM — Compliance" }, wmsFunction: { fr: "Clôture M3", en: "M3 closing" }, sapTCode: "—", odooEquivalent: { fr: "Validation M3", en: "M3 validation" }, whyShort: { fr: "Valide inventaire et réappro.", en: "Validates inventory and replenishment." } },
  KPI_DATA: { erpModule: { fr: "CO — Contrôle", en: "CO — Controlling" }, wmsFunction: { fr: "Collecte KPI", en: "KPI collection" }, sapTCode: "MC$4", odooEquivalent: { fr: "Rapports stock", en: "Stock reports" }, whyShort: { fr: "Alimente analyse performance.", en: "Feeds performance analysis." } },
  KPI_ROTATION: { erpModule: { fr: "CO — KPI", en: "CO — KPI" }, wmsFunction: { fr: "Rotation stocks", en: "Inventory turnover" }, sapTCode: "MC$4", odooEquivalent: { fr: "Rotation inventaire", en: "Inventory turnover" }, whyShort: { fr: "Détecte surstock/sous-stock.", en: "Detects over/under stock." } },
  KPI_SERVICE: { erpModule: { fr: "SD — Service", en: "SD — Service" }, wmsFunction: { fr: "Taux de service", en: "Service level" }, sapTCode: "VL06O", odooEquivalent: { fr: "Performance livraison", en: "Delivery performance" }, whyShort: { fr: "Mesure OTIF / fill rate.", en: "Measures OTIF / fill rate." } },
  KPI_DIAGNOSTIC: { erpModule: { fr: "Analytics", en: "Analytics" }, wmsFunction: { fr: "Diagnostic KPI", en: "KPI diagnosis" }, sapTCode: "SAC", odooEquivalent: { fr: "Tableau de bord", en: "Dashboard" }, whyShort: { fr: "Synthèse et décision.", en: "Synthesis and decision." } },
  COMPLIANCE_M4: { erpModule: { fr: "CO — Conformité", en: "CO — Compliance" }, wmsFunction: { fr: "Clôture M4", en: "M4 closing" }, sapTCode: "—", odooEquivalent: { fr: "Validation M4", en: "M4 validation" }, whyShort: { fr: "Valide analyse KPI.", en: "Validates KPI analysis." } },
  M5_RECEPTION: { erpModule: { fr: "MM — Réception", en: "MM — Receiving" }, wmsFunction: { fr: "Réception intégrée", en: "Integrated receiving" }, sapTCode: "MIGO", odooEquivalent: { fr: "Réception", en: "Receipt" }, whyShort: { fr: "Début cycle M5.", en: "Start of M5 cycle." } },
  M5_PUTAWAY: { erpModule: { fr: "WM — Rangement", en: "WM — Putaway" }, wmsFunction: { fr: "Rangement FIFO M5", en: "M5 FIFO putaway" }, sapTCode: "LT01", odooEquivalent: { fr: "Transfert + FIFO", en: "Transfer + FIFO" }, whyShort: { fr: "Slotting avec traçabilité.", en: "Slotting with traceability." } },
  M5_CYCLE_COUNT: { erpModule: { fr: "IM — Inventaire", en: "IM — Inventory" }, wmsFunction: { fr: "CC intégré", en: "Integrated CC" }, sapTCode: "MI01", odooEquivalent: { fr: "Inventaire", en: "Inventory count" }, whyShort: { fr: "Vérifie cohérence ops.", en: "Verifies ops consistency." } },
  M5_REPLENISH: { erpModule: { fr: "MRP", en: "MRP" }, wmsFunction: { fr: "Réappro M5", en: "M5 replenishment" }, sapTCode: "MD04", odooEquivalent: { fr: "Réappro", en: "Replenishment" }, whyShort: { fr: "Maintient niveaux cibles.", en: "Maintains target levels." } },
  M5_KPI: { erpModule: { fr: "CO — KPI", en: "CO — KPI" }, wmsFunction: { fr: "KPI intégré", en: "Integrated KPI" }, sapTCode: "MC$4", odooEquivalent: { fr: "Indicateurs", en: "Indicators" }, whyShort: { fr: "Mesure performance globale.", en: "Measures overall performance." } },
  M5_DECISION: { erpModule: { fr: "Stratégie", en: "Strategy" }, wmsFunction: { fr: "Décision ops", en: "Ops decision" }, sapTCode: "IBP", odooEquivalent: { fr: "Décision direction", en: "Executive decision" }, whyShort: { fr: "Choix stratégique final.", en: "Final strategic choice." } },
  COMPLIANCE_M5: { erpModule: { fr: "Cross-module", en: "Cross-module" }, wmsFunction: { fr: "Clôture M5", en: "M5 closing" }, sapTCode: "—", odooEquivalent: { fr: "Validation M5", en: "M5 validation" }, whyShort: { fr: "Capstone simulation.", en: "Simulation capstone." } },
};

export function getStepErpHint(stepCode: string | undefined): StepErpHint {
  if (!stepCode) return DEFAULT_HINT;
  return STEP_ERP_MAP[stepCode] ?? DEFAULT_HINT;
}
