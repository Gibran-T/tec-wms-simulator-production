export interface MissionData {
  scenarioId: number;
  objective: string;
  context: string;
  role: string;
  module: string;
  controlPoints: string[];
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
      "Confirmer le rangement (Putaway) dans la zone de stockage."
    ],
    expectedOutcome: "Flux complété avec un inventaire final à zéro (flux tendu).",
    supervisorNotes: "Assurez-vous de respecter la séquence opérationnelle : PO → GR → Putaway → SO → Picking → GI.",
    technicalSpecs: {
      sku: "SKU-001",
      quantity: 100,
      suggestedBin: "REC-01"
    }
  },
  2: {
    scenarioId: 2,
    objective: "Détection et résolution d'une anomalie de réception (Ghost GR).",
    context: "Le système affiche un Bon de Commande validé, mais le stock n'est pas apparu dans le bin de réception. Une étape administrative a été omise.",
    role: "Contrôleur Qualité Logistique",
    module: "Gestion des Anomalies ERP",
    controlPoints: [
      "Analyser le moniteur de transactions pour identifier les documents non postés.",
      "Vérifier l'état du bin REC-01 dans le cockpit opérationnel.",
      "Valider la transaction GR manquante pour débloquer le flux."
    ],
    expectedOutcome: "Régularisation du stock en réception et reprise du flux normal.",
    supervisorNotes: "Une 'Réception Fantôme' survient souvent quand le document physique est arrivé mais n'a pas été validé dans le WMS.",
    technicalSpecs: {
      sku: "SKU-001",
      quantity: 100,
      suggestedBin: "REC-01"
    }
  },
  3: {
    scenarioId: 3,
    objective: "Gestion d'une rupture de stock et réapprovisionnement d'urgence.",
    context: "Une commande client (SO) dépasse le stock disponible. Vous devez déclencher un approvisionnement pour satisfaire la demande.",
    role: "Responsable d'Opération",
    module: "Planification des Besoins",
    controlPoints: [
      "Identifier le déficit de stock via les alertes de niveau de service.",
      "Créer un Bon de Commande (PO) correctif.",
      "Réceptionner le stock manquant avant de procéder à l'expédition."
    ],
    expectedOutcome: "Satisfaction totale de la commande client après réapprovisionnement.",
    supervisorNotes: "Le taux de service est la priorité. Ne validez pas l'expédition (GI) tant que le stock n'est pas complet.",
    technicalSpecs: {
      sku: "SKU-001",
      quantity: 150,
      suggestedBin: "REC-01"
    }
  },
  4: {
    scenarioId: 4,
    objective: "Réconciliation d'inventaire suite à un écart physique/système.",
    context: "Stock système : 200 unités SKU-006 | Stock physique : 185 unités — écart de −15 unités détecté lors du comptage cyclique. Un ajustement MI07 (ADJ) est requis pour corriger le système.",
    role: "Auditeur d'Inventaire",
    module: "Contrôle d'Intégrité",
    controlPoints: [
      "Effectuer le rangement (PUTAWAY) des 200 unités reçues vers la zone STOCKAGE.",
      "Créer et expédier la commande client (SO → PICKING → GI).",
      "Effectuer le Cycle Count (MI01) — entrez 185 comme quantité physique pour révéler l'écart de −15.",
      "Créer une transaction ADJ (MI07) pour corriger l'écart de −15 unités.",
      "Valider la conformité système."
    ],
    expectedOutcome: "Écart d'inventaire résolu et conformité système rétablie.",
    supervisorNotes: "Tout ajustement (ADJ) doit être justifié par un comptage physique certifié. L'écart de −15 unités est intentionnel — entrez la quantité physique réelle (185) lors du Cycle Count.",
    technicalSpecs: {
      sku: "SKU-006",
      quantity: 200,
      suggestedBin: "REC-01"
    }
  },
  5: {
    scenarioId: 5,
    objective: "Résolution de non-conformités multiples en environnement complexe.",
    context: "Deux anomalies simultanées : (1) GR non postée pour SKU-004 (30 unités, doc GR-2025-004) — à poster via MIGO. (2) Écart inventaire SKU-005 (−8 unités) — à corriger via ADJ (MI07). Résolvez dans l'ordre : Documents → Physique → Expédition.",
    role: "Superviseur Logistique",
    module: "Gestion de Crise / Multi-Module",
    controlPoints: [
      "Localiser et poster la GR fantôme (GR-2025-004) pour SKU-004 via le moniteur de transactions.",
      "Effectuer le PUTAWAY pour SKU-004 (REC-01 → STOCKAGE) et SKU-005 (REC-02 → STOCKAGE).",
      "Créer et expédier la commande client (SO → PICKING → GI).",
      "Effectuer le Cycle Count (MI01) — l'écart de −8 unités SKU-005 sera détecté.",
      "Créer une transaction ADJ (MI07) pour corriger l'écart SKU-005.",
      "Valider la conformité système."
    ],
    expectedOutcome: "Entrepôt 100% conforme et flux d'expédition débloqué.",
    supervisorNotes: "En cas de crises multiples, suivez l'ordre logique : Documents → Physique → Expédition. La GR fantôme doit être postée AVANT le PUTAWAY.",
    technicalSpecs: {
      sku: "SKU-004 / SKU-005",
      quantity: 90,
      suggestedBin: "REC-01 / REC-02"
    }
  }
};
