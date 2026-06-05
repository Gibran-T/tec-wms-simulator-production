export interface MissionData {
  scenarioId: number;
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
    quantity: number;
    suggestedBin?: string;
  };
}

export const M1_MISSIONS: Record<number, MissionData> = {
  1: {
    scenarioId: 1,
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
  },
  2: {
    scenarioId: 2,
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
  },
  3: {
    scenarioId: 3,
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
  },
  4: {
    scenarioId: 4,
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
  },
  5: {
    scenarioId: 5,
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
  },
};

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
