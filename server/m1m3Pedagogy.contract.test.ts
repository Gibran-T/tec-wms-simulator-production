import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const quizRouter = readFileSync(resolve(__dirname, "routers.ts"), "utf8");
const assessmentSrc = readFileSync(resolve(__dirname, "assessmentService.ts"), "utf8");
const hubSrc = readFileSync(
  resolve(__dirname, "../client/src/components/enterprise/EnterpriseModuleHub.tsx"),
  "utf8",
);
const stepSrc = readFileSync(resolve(__dirname, "../client/src/pages/student/StepForm.tsx"), "utf8");
const formativePage = readFileSync(
  resolve(__dirname, "../client/src/pages/student/FormativeExercisePage.tsx"),
  "utf8",
);
const modulesSrc = readFileSync(resolve(__dirname, "../client/src/data/modules.ts"), "utf8");

const appSrc = readFileSync(
  resolve(__dirname, "../client/src/App.tsx"),
  "utf8",
);

describe("MCQ shuffle + exam preservation contracts", () => {
  it("uses per-attempt balanced order for module quizzes", () => {
    expect(quizRouter).toContain("orderQuizQuestionsForAttempt");
    expect(quizRouter).toContain("attemptNumber: prior.length + 1");
    expect(quizRouter).not.toContain("`quiz-${quiz.id}-q${q.id}-display`");
  });

  it("keeps Exam 1/2 shuffle and teacher-only retake", () => {
    expect(assessmentSrc).toContain("RETAKE_NOT_AUTHORIZED");
    expect(assessmentSrc).toContain("assessmentRetakeAuthorizations");
    expect(assessmentSrc).toContain("seededShuffle");
    expect(assessmentSrc).not.toContain("buildMcqDisplayOrder");
    expect(assessmentSrc).not.toContain("orderQuizQuestionsForAttempt");
    expect(assessmentSrc).toContain("alreadyPassed");
  });

  it("wires Pré/Pós shuffle, journey, and in-mission A–D", () => {
    expect(formativePage).toContain("applyOptionIdOrder");
    expect(formativePage).toContain("ModuleJourneyGuide");
    expect(hubSrc).toContain("ModuleJourneyGuide");
    expect(hubSrc).toContain("student-prepost-delta");
    expect(hubSrc).toContain("Régression");
    expect(hubSrc).toContain("recommendAfterMissions={completedScenarios < 3}");
    expect(stepSrc).toContain("missionDecisions.submit");
    expect(stepSrc).toContain("layout=\"lettered\"");
  });

  it("registers M1–M3 Pré/Pós SPA routes", () => {
    expect(appSrc).toContain('path="/student/module1/formative/:exerciseId"');
    expect(appSrc).toContain('path="/student/module2/formative/:exerciseId"');
    expect(appSrc).toContain('path="/student/module3/formative/:exerciseId"');
  });
});

describe("SPA fallback keeps formative deep links from HTTP 404", () => {
  it("serves index.html for unknown GET paths in production static mode", () => {
    const viteSrc = readFileSync(resolve(__dirname, "_core/vite.ts"), "utf8");
    const indexSrc = readFileSync(resolve(__dirname, "index.ts"), "utf8");
    expect(viteSrc).toContain('res.sendFile(path.resolve(distPath, "index.html"))');
    expect(indexSrc).toContain('app.get("*", (_req, res) => {');
    expect(indexSrc).toContain('res.sendFile(path.join(staticPath, "index.html"))');
  });
});

describe("M1–M3 pedagogical slide adjustments without rebuild", () => {
  it("adds journey bullets on existing M1–M3 decks without new slide titles", () => {
    expect(modulesSrc).toContain("Parcours : Slides → Pré-teste");
    expect(modulesSrc).toContain("Parcours M2 : slides → Pré-teste");
    expect(modulesSrc).toContain("Parcours M3 : slides → Pré-teste");
    expect(modulesSrc).toContain("const module2: ModuleData = {");
  });
});
