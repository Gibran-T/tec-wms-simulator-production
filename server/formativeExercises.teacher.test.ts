import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const routerSrc = readFileSync(resolve(__dirname, "formativeExercisesRouter.ts"), "utf8");
const serviceSrc = readFileSync(resolve(__dirname, "formativeExerciseService.ts"), "utf8");
const pageSrc = readFileSync(
  resolve(__dirname, "../client/src/pages/teacher/FormativeExercicesMonitorPage.tsx"),
  "utf8",
);
const appSrc = readFileSync(resolve(__dirname, "../client/src/App.tsx"), "utf8");
const configSrc = readFileSync(
  resolve(__dirname, "../client/src/components/shell/roleNavConfig.ts"),
  "utf8",
);

describe("professor formative monitoring contracts", () => {
  it("exposes teacher-only professorRoster with cohort scope", () => {
    expect(routerSrc).toContain("professorRoster");
    expect(routerSrc).toContain("teacherProcedure");
    expect(routerSrc).toContain("resolveCohortScope");
    expect(routerSrc).toContain("Accès réservé aux enseignants");
  });

  it("aggregates roster without touching official scoring tables", () => {
    expect(serviceSrc).toContain("listProfessorFormativeRoster");
    expect(serviceSrc).not.toContain("upsertModuleProgress");
    expect(serviceSrc).not.toContain("assessmentAttempts");
    expect(serviceSrc).toContain("deriveTeacherFormativeStatus");
    expect(serviceSrc).toContain("students without attempts");
  });

  it("wires teacher route and Exercices nav item", () => {
    expect(appSrc).toContain('path="/teacher/exercices"');
    expect(appSrc).toContain("FormativeExercicesMonitorPage");
    expect(configSrc).toContain('href: "/teacher/exercices"');
    expect(configSrc).toContain('labelFr: "Exercices"');
    expect(pageSrc).toContain("Suivi des exercices formatifs");
    expect(pageSrc).toContain("formative-teacher-dashboard");
    expect(pageSrc).not.toMatch(/Silver|Gold|checkpointEngine|averageScore/);
  });

  it("uses neutral statuses and objective rates without 70% threshold", () => {
    expect(pageSrc).not.toContain("FORMATIVE_DISPLAY_SUCCESS_THRESHOLD");
    expect(pageSrc).not.toContain("Réussi");
    expect(pageSrc).not.toContain("À revoir");
    expect(pageSrc).not.toContain("Taux de réussite");
    expect(pageSrc).not.toContain("Tentatives");
    expect(pageSrc).toContain("Taux de participation");
    expect(pageSrc).toContain("Taux de complétion");
    expect(pageSrc).toContain("Taux de bonnes réponses");
    expect(pageSrc).toContain("Non commencé");
    expect(pageSrc).toContain("En cours");
    expect(pageSrc).toContain("Terminé");
    expect(serviceSrc).toContain("correctAnswerRate");
    expect(serviceSrc).toContain("hasRecord");
    expect(serviceSrc).not.toContain("totalAttempts");
  });
});

