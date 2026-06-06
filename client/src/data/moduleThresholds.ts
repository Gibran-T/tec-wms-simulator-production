/** Display-only evaluation score thresholds per module (not certification logic). */
export function getEvalScoreThreshold(moduleId: number): number {
  return moduleId >= 3 ? 70 : 60;
}

export function getModuleCertContext(moduleId: number): { fr: string; en: string } | null {
  switch (moduleId) {
    case 1:
      return {
        fr: "Module 1 — Quiz M1 (60 %) + scénarios ≥ 60/100 pour certification Silver TEC.LOG.",
        en: "Module 1 — M1 quiz (60%) + scenarios ≥ 60/100 for TEC.LOG Silver certification.",
      };
    case 2:
      return {
        fr: "Module 2 — Scénarios ≥ 60/100 en évaluation. Compte pour progression certification entrepôt.",
        en: "Module 2 — Scenarios ≥ 60/100 in evaluation. Counts toward warehouse certification progress.",
      };
    case 3:
      return {
        fr: "Module 3 — Seuil scénario 70/100. Validation M3 requise avant Module 4.",
        en: "Module 3 — Scenario threshold 70/100. M3 validation required before Module 4.",
      };
    case 4:
      return {
        fr: "Module 4 — Seuil scénario 70/100. Analyse KPI évaluée (interprétation + diagnostic).",
        en: "Module 4 — Scenario threshold 70/100. KPI analysis assessed (interpretation + diagnosis).",
      };
    case 5:
      return {
        fr: "Module 5 — Seuil scénario 70/100. Capstone intégré — progression vers certification Gold.",
        en: "Module 5 — Scenario threshold 70/100. Integrated capstone — progress toward Gold certification.",
      };
    default:
      return null;
  }
}
