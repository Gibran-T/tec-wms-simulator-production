/**
 * Focused Guardian Condition 4 — post-run feedback must not present
 * mandatory keyword chips or a prescriptive "canonical answer" label.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getLearningFeedbackScenario } from "@shared/learningFeedbackRegistry";

const SRC = readFileSync(
  resolve(__dirname, "CanonicalAnswerBlock.tsx"),
  "utf8",
);

describe("CanonicalAnswerBlock — own-words framing", () => {
  it("does not use legacy mandatory-keyword / canonical labels", () => {
    expect(SRC).not.toMatch(/Mots-clés/);
    expect(SRC).not.toMatch(/Réponse canonique/);
    expect(SRC).not.toMatch(/canonicalAnswer\.keywords/);
  });

  it("uses example framing and explanatory note", () => {
    expect(SRC).toContain("Exemple de raisonnement");
    expect(SRC).toContain("Idées de raisonnement");
    expect(SRC).toContain("Cette formulation est un exemple");
    expect(SRC).toContain("Utilisez vos propres mots");
    expect(SRC).toContain("learning-example-disclaimer");
  });

  it("registry still supplies feedback cards for completed-run steps", () => {
    const scn = getLearningFeedbackScenario("SCN-013");
    expect(scn?.steps.length).toBeGreaterThan(0);
    const diag = scn?.steps.find((s) => s.stepCode === "KPI_DIAGNOSTIC");
    expect(diag?.canonicalAnswer.full.fr.length).toBeGreaterThan(20);
    expect(diag?.canonicalAnswer.whyCorrect.length).toBeGreaterThan(0);
  });
});
