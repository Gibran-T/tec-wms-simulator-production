import { resolveScenarioScnCode } from "./canonicalScenarios";
import { EXTENDED_MISSIONS } from "./missionDataExtended";

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
    context: "Concorde Logistics a reçu une commande standard. Vous devez assurer la réception, le rangement et l'expédition sans aucune anomalie système.",
    role: "Gestionnaire de Stocks",
    module: "WMS / ERP Core",
    controlPoints: [
      "Vérifier la disponibilité du bin de réception (REC-01).",
      "Valider la correspondance entre le Bon de Commande (PO) et la Réception (GR).",
      "Confirmer le rangement (Putaway) dans la zone de stockage.",
    ],
    studentActions: [
      "Créer et poster une PO (ME21N) vers REC-01 pour SKU-001 (100 u.).",
      "Créer et poster la GR (MIGO) vers REC-01 — le stock apparaît au quai.",
      "Ranger REC-01 → emplacement STOCKAGE (LT0A / PUTAWAY).",
      "Vérifier le stock (MB52), créer la SO, prélever vers EXP-01/02, poster la GI.",
      "Effectuer le Cycle Count (MI01), puis valider la Conformité (MB52).",
    ],
    expectedOutcome: "Flux complété avec conformité système au vert.",
    supervisorNotes: "Séquence : PO → GR → Putaway → SO → Picking → GI → CC → Conformité.",
    technicalSpecs: {
      sku: "SKU-001",
      quantity: 100,
      suggestedBin: "REC-01",
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
    context: "Le système affiche un Bon de Commande validé, mais le stock n'est pas apparu dans le bin de réception. Une GR (GR-2025-001) existe mais n'a pas été postée.",
    role: "Contrôleur Qualité Logistique",
    module: "Gestion des Anomalies ERP",
    controlPoints: [
      "Analyser le moniteur de transactions pour identifier les documents non postés.",
      "Vérifier l'état du bin REC-01 dans le cockpit opérationnel.",
      "Valider la transaction GR manquante pour débloquer le flux.",
    ],
    studentActions: [
      "Ouvrir le cockpit : repérer GR-2025-001 en statut PENDING dans le moniteur.",
      "Aller à l'étape GR ou Conformité et cliquer « Poster (MIGO) » sur GR-2025-001.",
      "Ne pas créer une nouvelle GR — cela laisserait la fantôme non postée.",
      "Une fois postée, ranger (PUTAWAY), poursuivre SO → Picking → GI → CC → Conformité.",
    ],
    expectedOutcome: "GR fantôme postée, stock visible en REC-01, conformité rétablie.",
    supervisorNotes: "Réception fantôme = document créé mais non validé dans le WMS.",
    technicalSpecs: {
      sku: "SKU-001",
      quantity: 100,
      suggestedBin: "REC-01",
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
    context: "50 unités de SKU-003 sont en REC-01 (PO/GR déjà postées). Une commande client nécessitera plus de stock que disponible après rangement.",
    role: "Responsable d'Opération",
    module: "Planification des Besoins",
    controlPoints: [
      "Ranger le stock en attente (REC-01 → STOCKAGE).",
      "Identifier le déficit avant expédition.",
      "Réapprovisionner (PO + GR) avant de valider la GI.",
    ],
    studentActions: [
      "Étape PUTAWAY : déplacer 50 u. SKU-003 de REC-01 vers un bin STOCKAGE (ex. B-01-R1-L2).",
      "Créer une SO pour une quantité supérieure au stock (ex. 80 u.) — noter le blocage si stock insuffisant.",
      "Créer une PO corrective + GR pour combler le déficit (ex. +30 u.), puis ranger.",
      "Compléter Picking → GI → Cycle Count → Conformité.",
    ],
    expectedOutcome: "Commande client satisfaite après réapprovisionnement.",
    supervisorNotes: "Ne pas valider la GI tant que le stock en STOCKAGE est insuffisant.",
    technicalSpecs: {
      sku: "SKU-003",
      quantity: 50,
      suggestedBin: "REC-01",
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
    context: "200 unités SKU-006 reçues. Après expédition partielle, le comptage physique révélera un écart de −15 unités.",
    role: "Auditeur d'Inventaire",
    module: "Contrôle d'Intégrité",
    controlPoints: [
      "Ranger les 200 unités vers la zone STOCKAGE.",
      "Créer et expédier SO → PICKING → GI.",
      "Cycle Count avec quantité physique réelle, puis ADJ (MI07).",
    ],
    studentActions: [
      "PUTAWAY : REC-01 → B-02-R1-L1 (200 u. SKU-006).",
      "SO → PICKING → GI selon le flux standard.",
      "Cycle Count (MI01) : entrer la quantité physique réelle (ex. 185 si système affiche 200).",
      "Étape ADJ (MI07) : corriger l'écart de −15, puis Conformité.",
    ],
    expectedOutcome: "Écart résolu, conformité au vert.",
    supervisorNotes: "L'écart −15 est intentionnel — physicalQty = quantité comptée, pas la variance.",
    technicalSpecs: {
      sku: "SKU-006",
      quantity: 200,
      suggestedBin: "B-02-R1-L1",
    },
    successCriteria: ["Écart −15 résolu via ADJ", "Conformité verte"],
    failureConditions: ["CC sans ADJ", "Variance non résolue à compliance"],
    wmsFunction: "Cycle count & adjustment",
    sapEquivalent: "MI01 + MI07",
    odooEquivalent: "Inventory adjustment",
    industryRelevance: "Audit inventaire et cut-off comptable.",
    demoGuidance: "Saisissez la quantité physique réelle au CC.",
    evalGuidance: "ADJ obligatoire si variance ≠ 0.",
    recoveryPaths: ["CC → ADJ (−15) → COMPLIANCE"],
    wrongActionConsequences: ["UNRESOLVED_VARIANCE bloque compliance"],
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
): MissionData | null {
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
    return {
      ...extended,
      context: extended.context || scenario.descriptionFr || "",
    };
  }
  return null;
}

/** Resolve M1 mission sheet by DB scenario id or name (Scénario N). */
export function getM1Mission(
  scenario: { id: number; name?: string | null; moduleId?: number } | null | undefined
): MissionData | null {
  if (!scenario || scenario.moduleId !== 1) return null;
  const direct = M1_MISSIONS[scenario.id];
  if (direct) return direct;
  const match = scenario.name?.match(/Scénario\s*(\d+)/i);
  if (match) {
    const n = parseInt(match[1], 10);
    return M1_MISSIONS[n] ?? null;
  }
  return null;
}
