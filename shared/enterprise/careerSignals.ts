/** Career signals — Manifesto Part VIII §8.3 (non-certification, display only) */

export interface CareerSignalPair {
  fr: string;
  en: string;
}

export interface ModuleCareerSignals {
  primary: CareerSignalPair;
  secondary: CareerSignalPair;
}

/** Module-to-profession mapping — Manifesto §8.3 */
export const MODULE_CAREER_SIGNALS: Record<number, ModuleCareerSignals> = {
  1: {
    primary: { fr: "Opérateur d'entrepôt", en: "Warehouse Operator" },
    secondary: { fr: "Sensibilisation qualité", en: "Quality awareness" },
  },
  2: {
    primary: { fr: "Opérateur d'entrepôt senior", en: "Senior Warehouse Operator" },
    secondary: { fr: "Planificateur de capacité", en: "Capacity planner" },
  },
  3: {
    primary: { fr: "Analyste inventaire", en: "Inventory Analyst" },
    secondary: { fr: "Planificateur de la demande", en: "Demand planner" },
  },
  4: {
    primary: { fr: "Analyste opérations", en: "Operations Analyst" },
    secondary: { fr: "Spécialiste performance", en: "Performance specialist" },
  },
  5: {
    primary: { fr: "Directeur des opérations", en: "Operations Director" },
    secondary: { fr: "Décideur de crise", en: "Crisis decision-maker" },
  },
};

export function getCareerSignalsForModule(moduleId: number): ModuleCareerSignals {
  return (
    MODULE_CAREER_SIGNALS[moduleId] ?? {
      primary: { fr: "Professionnel logistique", en: "Logistics professional" },
      secondary: { fr: "Amélioration continue", en: "Continuous improvement" },
    }
  );
}
