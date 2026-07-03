export {
  QUIZ_PASS_THRESHOLD,
  getEvalScoreThreshold,
  getModuleScenarioPassThreshold,
  computeModulePassResult,
} from "@shared/moduleThresholds";

export function getModuleCertContext(moduleId: number): { fr: string; en: string } | null {
  switch (moduleId) {
    case 1:
      return {
        fr: "Module 1 — Quiz M1 (60 %) + scénarios ≥ 60/100 avec conformité.",
        en: "Module 1 — M1 quiz (60%) + scenarios ≥ 60/100 with compliance.",
      };
    case 2:
      return {
        fr: "Module 2 — Scénarios ≥ 60/100 en évaluation. Quiz M2 pour valider les acquis.",
        en: "Module 2 — Scenarios ≥ 60/100 in evaluation. M2 quiz to validate learning.",
      };
    case 3:
      return {
        fr: "Module 3 — Seuil scénario 70/100. Validation enseignant requise avant Module 4.",
        en: "Module 3 — Scenario threshold 70/100. Instructor validation required before Module 4.",
      };
    case 4:
      return {
        fr: "Module 4 — Seuil scénario 70/100. Analyse KPI évaluée (interprétation + diagnostic).",
        en: "Module 4 — Scenario threshold 70/100. KPI analysis assessed (interpretation + diagnosis).",
      };
    case 5:
      return {
        fr: "Module 5 — Seuil scénario 70/100. Capstone intégré — clôture du parcours M1–M5.",
        en: "Module 5 — Scenario threshold 70/100. Integrated capstone — M1–M5 pathway closure.",
      };
    default:
      return null;
  }
}
