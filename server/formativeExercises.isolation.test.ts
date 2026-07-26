import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { OFFICIAL_SCN_BY_MODULE } from "./canonicalScenarios";

const FORMATIVE_FORBIDDEN_SIDE_EFFECTS = [
  "upsertModuleProgress",
  "completeRun",
  "addScoringEvent",
  "submitAssessmentAttempt",
  "evaluateCheckpoint",
  "checkSilver",
  "checkGold",
  "canAccessLearningModule",
  "missionsBlocked",
  "checkpointEngine",
] as const;

const serviceSrc = readFileSync(resolve(__dirname, "formativeExerciseService.ts"), "utf8");
const routerSrc = readFileSync(resolve(__dirname, "formativeExercisesRouter.ts"), "utf8");
const hubSrc = readFileSync(
  resolve(__dirname, "../client/src/components/enterprise/EnterpriseModuleHub.tsx"),
  "utf8",
);
const canonicalSrc = readFileSync(resolve(__dirname, "canonicalScenarios.ts"), "utf8");

describe("formative isolation guards", () => {
  it("does not call official progression / scoring side effects", () => {
    const stripComments = (src: string) =>
      src
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/.*$/gm, "");
    const serviceCode = stripComments(serviceSrc);
    const routerCode = stripComments(routerSrc);
    for (const symbol of FORMATIVE_FORBIDDEN_SIDE_EFFECTS) {
      expect(serviceCode).not.toContain(symbol);
      expect(routerCode).not.toContain(symbol);
    }
  });

  it("keeps OFFICIAL_SCN_BY_MODULE[4]/[5] unchanged", () => {
    expect(OFFICIAL_SCN_BY_MODULE[4]).toEqual(["SCN-012", "SCN-013", "SCN-014"]);
    expect(OFFICIAL_SCN_BY_MODULE[5]).toEqual(["SCN-015", "SCN-016", "SCN-017"]);
    expect(canonicalSrc).toContain('4: ["SCN-012", "SCN-013", "SCN-014"]');
    expect(canonicalSrc).toContain('5: ["SCN-015", "SCN-016", "SCN-017"]');
  });

  it("wires formative cards only for moduleId 4 or 5 with soft badges", () => {
    expect(hubSrc).toContain("moduleId === 4 || moduleId === 5");
    expect(hubSrc).toContain("recommendAfterQuiz={!quizPassed}");
    expect(hubSrc).toContain("recommendAfterMissions={completedScenarios < 3}");
    expect(hubSrc).toContain('data-formative-slot="preparation"');
    expect(hubSrc).toContain('data-formative-slot="consolidation"');
    // Soft gates: cards are not gated by missionsBlocked
    const prepIdx = hubSrc.indexOf("formative-prep-slot");
    const blockedIdx = hubSrc.indexOf("missionsBlocked ?");
    expect(prepIdx).toBeGreaterThan(-1);
    expect(blockedIdx).toBeGreaterThan(prepIdx);
  });

  it("preserves hub DOM order markers: objectifs → prep → missions → cons → glossaire", () => {
    const objectives = hubSrc.indexOf('data-testid="module-objectives-slot"');
    const prep = hubSrc.indexOf('data-testid="formative-prep-slot"');
    const missions = hubSrc.indexOf("missionsBlocked ?");
    const cons = hubSrc.indexOf('data-testid="formative-cons-slot"');
    const glossary = hubSrc.indexOf('data-testid="module-glossary-slot"');
    expect(objectives).toBeGreaterThan(-1);
    expect(prep).toBeGreaterThan(objectives);
    expect(missions).toBeGreaterThan(prep);
    expect(cons).toBeGreaterThan(missions);
    expect(glossary).toBeGreaterThan(cons);
  });
});
