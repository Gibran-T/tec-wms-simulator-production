import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const SRC = readFileSync(resolve(__dirname, "FormativeExerciseCard.tsx"), "utf8");
const pageSrc = readFileSync(
  resolve(__dirname, "../../pages/student/FormativeExercisePage.tsx"),
  "utf8",
);
const indexSrc = readFileSync(resolve(__dirname, "index.ts"), "utf8");
const hubSrc = readFileSync(
  resolve(__dirname, "../enterprise/EnterpriseModuleHub.tsx"),
  "utf8",
);

describe("FormativeExerciseCard", () => {
  it("renders required fields, badge and CTAs", () => {
    expect(SRC).toContain("Exercice formatif — hors moyenne officielle");
    expect(SRC).toContain("Commencer l’exercice");
    expect(SRC).toContain("Continuer l’exercice");
    expect(SRC).toContain("Refaire l’exercice");
    expect(SRC).toContain("Voir le résultat");
    expect(SRC).toContain("?view=result");
  });

  it("is only mounted for M4/M5 in the hub", () => {
    expect(hubSrc).toContain("moduleId === 4 || moduleId === 5");
  });
});

describe("zero free-text formative UI contract", () => {
  it("page uses only closed interaction components", () => {
    expect(pageSrc).toContain("LayerClassificationExercise");
    expect(pageSrc).toContain("OrderingExercise");
    expect(pageSrc).toContain("MissingLayerExercise");
    expect(pageSrc).toContain("AssociationExercise");
    expect(pageSrc).toContain("TrueFalseExercise");
    expect(pageSrc).toContain("SingleSelectExercise");
    expect(pageSrc).toContain("no-free-text-notice");
    expect(pageSrc).not.toContain("ProfessionalResponseExercise");
    expect(pageSrc).not.toContain("AnalyticalResponseField");
    expect(pageSrc).not.toContain("Textarea");
    expect(pageSrc).not.toContain("<textarea");
    expect(pageSrc).not.toContain("guided");
    expect(pageSrc).not.toContain("tactical");
  });

  it("does not export free-text professional response component", () => {
    expect(indexSrc).not.toContain("ProfessionalResponseExercise");
  });
});
