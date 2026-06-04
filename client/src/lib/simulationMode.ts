/** Shared classroom simulation mode labels and post-start navigation. */

export type SimulationMode = "evaluation" | "demonstration";

export function modeLabels(language: "FR" | "EN") {
  const fr = language === "FR";
  return {
    demo: fr ? "Mode Démonstration / Pratique guidée" : "Demonstration / Guided Practice Mode",
    eval: fr ? "Mode Évaluation / Examen officiel" : "Evaluation / Official Exam Mode",
    demoShort: fr ? "Démonstration" : "Demonstration",
    evalShort: fr ? "Évaluation" : "Evaluation",
  };
}

export function isDemoMode(mode: SimulationMode): boolean {
  return mode === "demonstration";
}

/** Route after runs.start — Module 2 legacy putaway entry, others use Mission Control. */
export function runEntryPath(runId: number, moduleId: number): string {
  if (moduleId === 2) {
    return `/student/module2/run/${runId}/putaway`;
  }
  return `/student/run/${runId}`;
}
