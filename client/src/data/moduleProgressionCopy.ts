/** Enterprise career progression copy — Concorde Logistics employee journey */
export interface ProgressionCopy {
  promotionTitle: { fr: string; en: string };
  promotionBody: { fr: string; en: string };
  prerequisiteNote: { fr: string; en: string };
}

export const MODULE_PROGRESSION_COPY: Record<number, ProgressionCopy> = {
  1: {
    promotionTitle: {
      fr: "Bienvenue chez Concorde Logistics",
      en: "Welcome to Concorde Logistics",
    },
    promotionBody: {
      fr: "Vous intégrez l'équipe du CDC Montréal. Vos premières affectations couvrent le cycle PO→GR→SO→GI et la conformité opérationnelle (SCN-001 à SCN-005).",
      en: "You are joining the Montréal DC team. Your first assignments cover the PO→GR→SO→GI cycle and operational compliance (SCN-001 to SCN-005).",
    },
    prerequisiteNote: {
      fr: "Complétez votre intégration M1 avant de demander une promotion interne.",
      en: "Complete your M1 onboarding before requesting an internal promotion.",
    },
  },
  2: {
    promotionTitle: {
      fr: "Promotion interne — Équipe d'exécution",
      en: "Internal promotion — Execution team",
    },
    promotionBody: {
      fr: "Vous intégrez maintenant l'équipe d'exécution d'entrepôt. Votre affectation suivante couvre le rangement structuré, la capacité bin et le respect FIFO (SCN-006 à SCN-008).",
      en: "You are now joining the warehouse execution team. Your next assignment covers structured putaway, bin capacity, and FIFO compliance (SCN-006 to SCN-008).",
    },
    prerequisiteNote: {
      fr: "Le chapitre M1 devrait être complété avant cette affectation. Accès ouvert pour la session — suivez votre progression chez Concorde Logistics.",
      en: "Chapter M1 should be completed before this assignment. Access open for class session — track your progress at Concorde Logistics.",
    },
  },
  3: {
    promotionTitle: {
      fr: "Affectation suivante — Contrôle des stocks",
      en: "Next assignment — Inventory control",
    },
    promotionBody: {
      fr: "Vous rejoignez l'équipe de gouvernance des stocks. Vos missions portent sur l'inventaire cyclique, l'analyse d'écarts et le réapprovisionnement Min/Max (SCN-009 à SCN-011).",
      en: "You are joining the stock governance team. Your missions focus on cycle counting, variance analysis, and Min/Max replenishment (SCN-009 to SCN-011).",
    },
    prerequisiteNote: {
      fr: "Le chapitre M2 devrait être complété avant cette affectation. Accès ouvert pour la session de classe.",
      en: "Chapter M2 should be completed before this assignment. Access open for class session.",
    },
  },
  4: {
    promotionTitle: {
      fr: "Affectation — Tour de contrôle KPI",
      en: "Assignment — KPI control tower",
    },
    promotionBody: {
      fr: "Vous intégrez le tour de contrôle opérationnel. Vos missions couvrent le calcul KPI, le diagnostic de performance et les recommandations au comité (SCN-012 à SCN-014).",
      en: "You are joining the operational control tower. Your missions cover KPI calculation, performance diagnostics, and committee recommendations (SCN-012 to SCN-014).",
    },
    prerequisiteNote: {
      fr: "Cette affectation requiert la validation de votre superviseur au chapitre M3 (≥ 70/100).",
      en: "This assignment requires your supervisor's validation of chapter M3 (≥ 70/100).",
    },
  },
  5: {
    promotionTitle: {
      fr: "Leadership de crise — Semaine de pointe",
      en: "Crisis leadership — Peak Week",
    },
    promotionBody: {
      fr: "Vous assumez la responsabilité d'une semaine de pointe intégrée. Vos missions couvrent réception, rangement, inventaire, réappro et décision stratégique (SCN-015 à SCN-017).",
      en: "You are taking ownership of an integrated peak week. Your missions cover reception, putaway, inventory, replenishment, and strategic decision-making (SCN-015 to SCN-017).",
    },
    prerequisiteNote: {
      fr: "Prérequis recommandé : validation du chapitre M4. Accès ouvert pour la session — SCN-015 à SCN-017.",
      en: "Recommended prerequisite: chapter M4 validation. Access open for class session — SCN-015 to SCN-017.",
    },
  },
};
