import { resolveScenarioScnCode } from "./canonicalScenarios";
import { enrichMissionWithEnterprise, type MissionWithEnterprise } from "../shared/enterprise/enrichMission";
import { EXTENDED_MISSIONS } from "./missionDataExtended";

export type { MissionWithEnterprise } from "../shared/enterprise/enrichMission";

export interface MissionData {
  scenarioId: number;
  scnCode: string;
  objective: string;
  context: string;
  role: string;
  module: string;
  controlPoints: string[];
  /** Student-facing step-by-step actions (shown in Fiche Mission) */
  studentActions: string[];
  expectedOutcome: string;
  supervisorNotes: string;
  technicalSpecs: {
    sku: string;
    quantity: number | string;
    sourceBin?: string;
    targetBin?: string;
    suggestedBin?: string;
    expectedTransaction?: string;
    status?: string;
    /** RC21-C.1A — operational contract datums (briefing display only) */
    lotNumber?: string;
    poRef?: string;
    grRef?: string;
    soRef?: string;
    giRef?: string;
    shipQuantity?: number | string;
    giQuantity?: number | string;
    correctivePoQuantity?: number | string;
    correctivePoRef?: string;
    expBin?: string;
    warehouse?: string;
    replenishMin?: number;
    replenishMax?: number;
    replenishSafetyStock?: number;
  };
  /** Operational Intelligence Layer — display only */
  successCriteria?: string[];
  failureConditions?: string[];
  wmsFunction?: string;
  sapEquivalent?: string;
  odooEquivalent?: string;
  industryRelevance?: string;
  demoGuidance?: string;
  evalGuidance?: string;
  recoveryPaths?: string[];
  alternativeActions?: string[];
  wrongActionConsequences?: string[];
}

export const M1_MISSIONS: Record<number, MissionData> = {
  1: {
    scenarioId: 1,
    scnCode: "SCN-001",
    objective: "Exécution d'un flux logistique nominal complet (End-to-End).",
    context:
      "Concorde Logistics a reçu une commande standard au CDC Montréal. Documents supervisés : PO-2025-101 · GR-2025-101 · SO-2025-101. Réception 100 u. SKU-001 au quai REC-01 ; rangement vers B-01-R1-L1 ; expédition 80 u. vers EXP-01.",
    role: "Gestionnaire de Stocks",
    module: "WMS / ERP Core",
    controlPoints: [
      "Documents contractuels : PO-2025-101 · GR-2025-101 · SO-2025-101 (ne pas inventer d'autres références).",
      "Réception : SKU-001 · 100 u. · quai REC-01 · entrepôt CDC Montréal.",
      "Rangement PUTAWAY : REC-01 → B-01-R1-L1 (zone STOCKAGE).",
      "Expédition : SO-2025-101 · 80 u. · prélèvement EXP-01 · GI 80 u.",
    ],
    studentActions: [
      "Créer et poster PO-2025-101 (ME21N) : SKU-001 · 100 u. · bin REC-01.",
      "Créer et poster GR-2025-101 (MIGO) : SKU-001 · 100 u. · bin REC-01.",
      "PUTAWAY (LT01) : REC-01 → B-01-R1-L1 · 100 u. SKU-001.",
      "Créer SO-2025-101 : 80 u. SKU-001 — prélèvement depuis B-01-R1-L1 vers EXP-01.",
      "Poster GI : 80 u. SKU-001 depuis EXP-01.",
      "Cycle Count (MI01) sur B-01-R1-L1, puis Conformité (MB52).",
    ],
    expectedOutcome: "Flux complété avec conformité système au vert.",
    supervisorNotes:
      "Séquence contractuelle : PO-2025-101 → GR-2025-101 → Putaway B-01-R1-L1 → SO-2025-101 (80 u.) → Picking EXP-01 → GI (80 u.) → CC → Conformité.",
    technicalSpecs: {
      sku: "SKU-001",
      quantity: 100,
      suggestedBin: "REC-01",
      sourceBin: "REC-01",
      targetBin: "B-01-R1-L1",
      expBin: "EXP-01",
      poRef: "PO-2025-101",
      grRef: "GR-2025-101",
      soRef: "SO-2025-101",
      shipQuantity: 80,
      giQuantity: 80,
      warehouse: "CDC Montréal",
    },
    successCriteria: ["Conformité système au vert", "Score ≥ 60 en évaluation", "Toutes étapes complétées"],
    failureConditions: ["Transactions non postées", "Stock négatif", "Séquence hors ordre"],
    wmsFunction: "End-to-end logistics execution",
    sapEquivalent: "ME21N → MIGO → LT0A → VA01 → VL01N → VL02N → MI01",
    odooEquivalent: "Purchase → Receipt → Internal Transfer → Delivery",
    industryRelevance: "Flux standard distribution B2B/B2C.",
    demoGuidance: "Explorez chaque étape librement — erreurs pédagogiques sans impact certification.",
    evalGuidance: "Séquence stricte — chaque erreur est pénalisée et compte pour le score officiel.",
    recoveryPaths: ["Flux nominal sans branche de récupération"],
    wrongActionConsequences: ["GI sans stock → pénalité", "Étape sautée → OUT_OF_SEQUENCE"],
  },
  2: {
    scenarioId: 2,
    scnCode: "SCN-002",
    objective: "Détection et résolution d'une anomalie de réception (Ghost GR).",
    context:
      "PO-2025-001 (POSTED) et GR-2025-001 (PENDING) pour SKU-001 · 100 u. au quai REC-01. Après résolution de la GR fantôme : rangement B-01-R1-L1, puis expédition SO-2025-101 · 80 u. vers EXP-01.",
    role: "Contrôleur Qualité Logistique",
    module: "Gestion des Anomalies ERP",
    controlPoints: [
      "Documents préchargés : PO-2025-001 (POSTED) · GR-2025-001 (PENDING) · SKU-001 · 100 u. · REC-01.",
      "Analyser le moniteur pour identifier GR-2025-001 non postée.",
      "Poster GR-2025-001 avant tout rangement ou expédition.",
      "Post-résolution : PUTAWAY REC-01 → B-01-R1-L1 · SO-2025-101 · 80 u. · GI depuis EXP-01.",
    ],
    studentActions: [
      "Repérer GR-2025-001 en statut PENDING dans le moniteur (PO-2025-001 déjà POSTED).",
      "Poster GR-2025-001 (MIGO) : SKU-001 · 100 u. · REC-01 — ne pas créer une nouvelle GR.",
      "PUTAWAY : REC-01 → B-01-R1-L1 · 100 u. SKU-001.",
      "Créer SO-2025-101 : 80 u. SKU-001 — prélèvement B-01-R1-L1 → EXP-01.",
      "Poster GI : 80 u. depuis EXP-01, puis CC → Conformité.",
    ],
    expectedOutcome: "GR fantôme postée, stock visible en REC-01, expédition 80 u. complétée, conformité rétablie.",
    supervisorNotes:
      "Réception fantôme = GR-2025-001 créée mais non validée. Après post : SO-2025-101 · 80 u. · EXP-01.",
    technicalSpecs: {
      sku: "SKU-001",
      quantity: 100,
      suggestedBin: "REC-01",
      sourceBin: "REC-01",
      targetBin: "B-01-R1-L1",
      expBin: "EXP-01",
      poRef: "PO-2025-001",
      grRef: "GR-2025-001",
      soRef: "SO-2025-101",
      shipQuantity: 80,
      giQuantity: 80,
      warehouse: "CDC Montréal",
    },
    successCriteria: ["GR-2025-001 postée", "Stock visible REC-01", "Conformité rétablie"],
    failureConditions: ["Nouvelle GR créée sans poster fantôme", "REC-01 vide après réception"],
    wmsFunction: "Goods receipt posting / validation",
    sapEquivalent: "MIGO — Post goods receipt",
    odooEquivalent: "Validate receipt (stock move)",
    industryRelevance: "Réconciliation dock WMS vs ERP.",
    demoGuidance: "Utilisez Poster (MIGO) sur la transaction PENDING.",
    evalGuidance: "Poster la GR existante est obligatoire avant toute autre étape.",
    recoveryPaths: ["Poster GR-2025-001 → flux standard"],
    alternativeActions: ["Créer nouvelle GR (incorrect — laisse fantôme)"],
    wrongActionConsequences: ["Double GR → conformité bloquée", "UNPOSTED_TX penalty"],
  },
  3: {
    scenarioId: 3,
    scnCode: "SCN-003",
    objective: "Gestion d'une rupture de stock et réapprovisionnement d'urgence.",
    context:
      "PO-2025-002 · GR-2025-002 postées : 50 u. SKU-003 au quai REC-01. Contrat opérationnel : rangement vers B-01-R1-L2 · SO-2025-101 pour 80 u. · déficit 30 u. · PO corrective PO-2025-003 (+30 u.) + GR avant GI.",
    role: "Responsable d'Opération",
    module: "Planification des Besoins",
    controlPoints: [
      "Documents préchargés : PO-2025-002 · GR-2025-002 · SKU-003 · 50 u. · REC-01.",
      "PUTAWAY contractuel : REC-01 → B-01-R1-L2 · 50 u.",
      "SO contractuelle : SO-2025-101 · 80 u. (stock insuffisant après rangement — déficit 30 u.).",
      "Réappro d'urgence : PO-2025-003 · +30 u. · GR corrective · rangement STOCKAGE avant GI.",
    ],
    studentActions: [
      "PUTAWAY : REC-01 → B-01-R1-L2 · 50 u. SKU-003.",
      "Créer SO-2025-101 : 80 u. SKU-003 — constater le déficit de 30 u. (80 − 50).",
      "Créer PO-2025-003 corrective : +30 u. SKU-003 · GR associée · ranger en STOCKAGE.",
      "Picking depuis B-01-R1-L2 → EXP-01 · GI 80 u. · Cycle Count → Conformité.",
    ],
    expectedOutcome: "Commande SO-2025-101 (80 u.) satisfaite après réapprovisionnement de 30 u.",
    supervisorNotes:
      "Quantités contractuelles : 50 u. en stock après putaway · SO 80 u. · PO corrective +30 u. Ne pas valider la GI tant que 80 u. ne sont pas disponibles en STOCKAGE.",
    technicalSpecs: {
      sku: "SKU-003",
      quantity: 50,
      sourceBin: "REC-01",
      targetBin: "B-01-R1-L2",
      poRef: "PO-2025-002",
      grRef: "GR-2025-002",
      soRef: "SO-2025-101",
      shipQuantity: 80,
      giQuantity: 80,
      correctivePoQuantity: 30,
      correctivePoRef: "PO-2025-003",
      expBin: "EXP-01",
      warehouse: "CDC Montréal",
    },
    successCriteria: ["SO satisfaite après réappro", "Pas de stock négatif", "GI validée"],
    failureConditions: ["GI avec stock insuffisant", "Pas de réapprovisionnement"],
    wmsFunction: "ATP / backorder management",
    sapEquivalent: "ME21N corrective + MIGO",
    odooEquivalent: "Reorder rule / emergency PO",
    industryRelevance: "Gestion ruptures e-commerce.",
    demoGuidance: "Testez SO > stock pour voir le blocage.",
    evalGuidance: "Réappro obligatoire avant GI.",
    recoveryPaths: ["PO corrective + GR + putaway → GI"],
    wrongActionConsequences: ["NEGATIVE_STOCK_ATTEMPT", "Commande non honorée"],
  },
  4: {
    scenarioId: 4,
    scnCode: "SCN-004",
    objective: "Réconciliation d'inventaire suite à un écart physique/système.",
    context: "200 unités SKU-006 reçues au quai REC-01 et rangées vers B-02-R1-L1. Le comptage cyclique (MI01) révélera un écart de −15 (quantité physique 185 vs système 200).",
    role: "Auditeur d'Inventaire",
    module: "Contrôle d'Intégrité",
    controlPoints: [
      "Ranger les 200 unités vers la zone STOCKAGE (B-02-R1-L1).",
      "Cycle Count (MI01) : saisir la quantité physique réelle comptée.",
      "Ajustement inventaire (MI07) pour corriger l'écart, puis Conformité.",
    ],
    studentActions: [
      "PUTAWAY : REC-01 → B-02-R1-L1 (200 u. SKU-006).",
      "Cycle Count (MI01) : entrer la quantité physique réelle (185 si système affiche 200).",
      "Étape ADJ (MI07) : corriger l'écart de −15 à B-02-R1-L1, puis Conformité.",
    ],
    expectedOutcome: "Stock réconcilié à 185 u. à B-02-R1-L1, conformité au vert.",
    supervisorNotes: "Scénario audit inventaire uniquement — pas de commande client ni d'expédition. L'écart −15 est intentionnel : physicalQty = quantité comptée, pas la variance.",
    technicalSpecs: {
      sku: "SKU-006",
      quantity: 200,
      suggestedBin: "B-02-R1-L1",
      targetBin: "B-02-R1-L1",
    },
    successCriteria: ["Écart −15 résolu via ADJ à B-02-R1-L1", "Conformité verte", "Intégrité inventaire rétablie"],
    failureConditions: ["CC sans ADJ", "Variance non résolue à compliance", "ADJ posté en zone expédition"],
    wmsFunction: "Cycle count & adjustment",
    sapEquivalent: "MI01 + MI07",
    odooEquivalent: "Inventory adjustment",
    industryRelevance: "Audit inventaire et cut-off comptable.",
    demoGuidance: "Saisissez la quantité physique réelle au CC — pas le delta de variance.",
    evalGuidance: "ADJ obligatoire si variance ≠ 0. Aucune étape expédition requise.",
    recoveryPaths: ["CC → ADJ (−15) à B-02-R1-L1 → COMPLIANCE"],
    wrongActionConsequences: ["UNRESOLVED_VARIANCE bloque compliance", "ADJ en zone EXPÉDITION rejeté"],
  },
  5: {
    scenarioId: 5,
    scnCode: "SCN-005",
    objective: "Résolution de non-conformités multiples en environnement complexe.",
    context: "Deux anomalies : (1) GR-2025-004 non postée pour SKU-004 (30 u.). (2) Écart inventaire SKU-005 (−8 u.) après le cycle. Ordre : Documents → Physique → Expédition.",
    role: "Superviseur Logistique",
    module: "Gestion de Crise / Multi-Module",
    controlPoints: [
      "Poster la GR fantôme GR-2025-004 avant tout rangement SKU-004.",
      "PUTAWAY SKU-004 et SKU-005, puis flux expédition.",
      "Cycle Count + ADJ pour SKU-005, puis Conformité.",
    ],
    studentActions: [
      "1) Poster GR-2025-004 (MIGO) — SKU-004, 30 u., REC-01.",
      "2) PUTAWAY SKU-004 (REC-01 → STOCKAGE) et SKU-005 (REC-02 → STOCKAGE).",
      "3) SO → PICKING → GI pour les deux SKU.",
      "4) Cycle Count SKU-005 : saisir la quantité physique réelle (système − 8).",
      "5) ADJ (MI07) pour l'écart, puis Conformité.",
    ],
    expectedOutcome: "Entrepôt 100 % conforme, scénario clôturable.",
    supervisorNotes: "Ordre obligatoire : poster GR fantôme avant PUTAWAY SKU-004.",
    technicalSpecs: {
      sku: "SKU-004 / SKU-005",
      quantity: 90,
      suggestedBin: "REC-01 / REC-02",
    },
    successCriteria: ["GR-2025-004 postée", "SKU-005 écart −8 résolu", "Conformité 100%"],
    failureConditions: ["Putaway avant post GR-004", "ADJ manquant SKU-005"],
    wmsFunction: "Multi-exception resolution",
    sapEquivalent: "MIGO + LT0A + MI01 + MI07",
    odooEquivalent: "Full exception workflow",
    industryRelevance: "Gestion crise entrepôt multi-anomalies.",
    demoGuidance: "Ordre : Documents → Physique → Expédition.",
    evalGuidance: "Ordre strict — ghost GR avant putaway SKU-004.",
    recoveryPaths: ["Post GR-004 → putaway both → ship → CC SKU-005 → ADJ"],
    alternativeActions: ["Nouvelle GR SKU-004 (incorrect)"],
    wrongActionConsequences: ["Non-conformité persistante", "Score bloqué ~60% sans COMPLIANCE_OK"],
  },
};

/** Pedagogical SCN code from scenario metadata (SCN-001 … SCN-017). */
export function resolveScnCode(
  scenario: { moduleId: number; name?: string | null; id?: number } | null | undefined
): string | null {
  if (!scenario?.moduleId || scenario.id == null) return null;
  return resolveScenarioScnCode({ id: scenario.id, moduleId: scenario.moduleId, name: scenario.name });
}

/** Mission briefing for any scenario SCN-001–017 (display only). */
export function getMissionForScenario(
  scenario: { id: number; name?: string | null; moduleId?: number; descriptionFr?: string | null; descriptionEn?: string | null; difficulty?: string | null } | null | undefined
): MissionWithEnterprise | null {
  if (!scenario) return null;

  const moduleId =
    scenario.moduleId ??
    (scenario.id && scenario.id >= 6 && scenario.id <= 17
      ? scenario.id <= 8
        ? 2
        : scenario.id <= 11
          ? 3
          : scenario.id <= 14
            ? 4
            : 5
      : undefined);

  if (!moduleId) return null;

  if (moduleId === 1) {
    return getM1Mission(scenario);
  }

  const scn = resolveScnCode({ ...scenario, moduleId });
  if (!scn) return null;

  const extended = EXTENDED_MISSIONS[scn];
  if (extended) {
    return enrichMissionWithEnterprise({
      ...extended,
      context: extended.context || scenario.descriptionFr || "",
    });
  }
  return null;
}

/** Resolve M1 mission sheet by DB scenario id or name (Scénario N). */
export function getM1Mission(
  scenario: { id: number; name?: string | null; moduleId?: number } | null | undefined
): MissionWithEnterprise | null {
  if (!scenario || scenario.moduleId !== 1) return null;
  const direct = M1_MISSIONS[scenario.id];
  if (direct) return enrichMissionWithEnterprise(direct);
  const match = scenario.name?.match(/Scénario\s*(\d+)/i);
  if (match) {
    const n = parseInt(match[1], 10);
    const mission = M1_MISSIONS[n];
    return mission ? enrichMissionWithEnterprise(mission) : null;
  }
  return null;
}
