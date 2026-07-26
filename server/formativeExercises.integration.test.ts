/**
 * Integration-style guards for formative exercises soft gates & isolation contract.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  FORMATIVE_ISOLATION_FLAGS,
  scoreFormativeExercise,
} from "../shared/formativeExercises";

const pageSrc = readFileSync(
  resolve(__dirname, "../client/src/pages/student/FormativeExercisePage.tsx"),
  "utf8",
);
const hubSrc = readFileSync(
  resolve(__dirname, "../client/src/components/enterprise/EnterpriseModuleHub.tsx"),
  "utf8",
);
const appSrc = readFileSync(resolve(__dirname, "../client/src/App.tsx"), "utf8");
const serviceSrc = readFileSync(resolve(__dirname, "formativeExerciseService.ts"), "utf8");
const schemaSrc = readFileSync(resolve(__dirname, "../drizzle/schema.ts"), "utf8");
const migrationSrc = readFileSync(
  resolve(__dirname, "../drizzle/0019_formative_exercise_attempts.sql"),
  "utf8",
);

describe("formative exercises integration contract", () => {
  it("registers student routes for M4 and M5 formative pages", () => {
    expect(appSrc).toContain('path="/student/module4/formative/:exerciseId"');
    expect(appSrc).toContain('path="/student/module5/formative/:exerciseId"');
    expect(appSrc).toContain("FormativeExercisePage");
  });

  it("keeps prep/cons always clickable (soft badges only)", () => {
    expect(hubSrc).toContain("recommendAfterQuiz={!quizPassed}");
    expect(hubSrc).toContain("recommendAfterMissions={completedScenarios < 3}");
    expect(hubSrc).not.toMatch(/if\s*\(\s*!quizPassed\s*\)\s*return/);
    expect(hubSrc).not.toMatch(/disabled=\{!quizPassed\}/);
    expect(hubSrc).not.toMatch(/disabled=\{completedScenarios\s*<\s*3\}/);
    expect(pageSrc).not.toContain("missionsBlocked");
    expect(pageSrc).not.toContain("canAccessLearningModule");
    expect(pageSrc).not.toContain("checkpointEngine");
  });

  it("persists isolation flags as false in schema and migration", () => {
    expect(schemaSrc).toContain("formative_exercise_attempts");
    expect(schemaSrc).toContain('countsTowardMissionCount: boolean("countsTowardMissionCount").default(false)');
    expect(schemaSrc).toContain('countsTowardScenarioAverage: boolean("countsTowardScenarioAverage").default(false)');
    expect(schemaSrc).toContain('countsTowardCertificate: boolean("countsTowardCertificate").default(false)');
    expect(schemaSrc).toContain('countsTowardAssessment: boolean("countsTowardAssessment").default(false)');
    expect(schemaSrc).toContain('countsTowardCheckpoint: boolean("countsTowardCheckpoint").default(false)');
    expect(migrationSrc).toContain("`countsTowardMissionCount` BOOLEAN NOT NULL DEFAULT FALSE");
    expect(migrationSrc).toContain("`countsTowardCheckpoint` BOOLEAN NOT NULL DEFAULT FALSE");
    expect(FORMATIVE_ISOLATION_FLAGS.countsTowardMissionCount).toBe(false);
    expect(FORMATIVE_ISOLATION_FLAGS.countsTowardCertificate).toBe(false);
  });

  it("service only touches formative_exercise_attempts table", () => {
    expect(serviceSrc).toContain("formativeExerciseAttempts");
    expect(serviceSrc).not.toContain("moduleProgress");
    expect(serviceSrc).not.toContain("scenarioRuns");
    expect(serviceSrc).not.toContain("quizAttempts");
    expect(serviceSrc).not.toContain("assessmentAttempts");
    expect(serviceSrc).not.toContain("scoringEvents");
  });

  it("scoring remains closed-item and formative-only", () => {
    const a = scoreFormativeExercise("M4-PREP-KPI-RESPONSE", {});
    const b = scoreFormativeExercise("M4-PREP-KPI-RESPONSE", {});
    expect(a.formativeScore).toBe(b.formativeScore);
    expect(a.feedback.some((f) => f.kind === "incomplete")).toBe(true);
  });

  it("enforces zero free-text across formative stack", () => {
    expect(pageSrc).not.toContain("AnalyticalResponseField");
    expect(pageSrc).not.toContain("ProfessionalResponseExercise");
    expect(pageSrc).not.toContain("Textarea");
    expect(serviceSrc).not.toMatch(/hasAny|phrase matching|heuristic/);
    const scoringSrc = readFileSync(
      resolve(__dirname, "../shared/formativeExercises/scoring.ts"),
      "utf8",
    );
    expect(scoringSrc).toContain("Closed-item formative scoring only");
    expect(scoringSrc).not.toContain("hasAny(");
  });
});
