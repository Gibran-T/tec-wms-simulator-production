/**
 * Re-execution contract: complete → leave → return → clean redo → resubmit.
 * No multi-attempt history; restart overwrites the active row.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  M4_CONS_ACTIONS,
  M4_CONS_DECISION_PAIRS,
  M4_CONS_KPI_COLORS,
  M4_CONS_PRIORITY_RISK,
  M4_CONS_TRUE_FALSE,
  M4_LAYERS,
  M4_PREP_FRAGMENTS,
  M4_PREP_KPI_QUESTIONS,
  M5_CONS_ACTIONS,
  M5_CONS_ASSOC,
  M5_CONS_EVIDENCE_COLORS,
  M5_CONS_PATH,
  M5_CONS_TRUE_FALSE,
  M5_PREP_ASSOC,
  M5_PREP_STOCK_BASE,
  M5_PREP_TRAFFIC,
  M5_PREP_TRUE_FALSE,
  scoreFormativeExercise,
} from "../shared/formativeExercises";

const pageSrc = readFileSync(
  resolve(__dirname, "../client/src/pages/student/FormativeExercisePage.tsx"),
  "utf8",
);
const cardSrc = readFileSync(
  resolve(__dirname, "../client/src/components/formative/FormativeExerciseCard.tsx"),
  "utf8",
);
const serviceSrc = readFileSync(resolve(__dirname, "formativeExerciseService.ts"), "utf8");
const migrationSrc = readFileSync(
  resolve(__dirname, "../drizzle/0019_formative_exercise_attempts.sql"),
  "utf8",
);

const m4Perfect = {
  classification: Object.fromEntries(M4_PREP_FRAGMENTS.map((f) => [f.id, f.layer])),
  ordering: [...M4_LAYERS],
  missing: {
    m1: ["decision", "suivi"],
    m2: ["donnee", "classification", "risque", "suivi"],
  },
  kpiQuestions: Object.fromEntries(M4_PREP_KPI_QUESTIONS.map((k) => [k.id, k.questionId])),
};

const m5Perfect = {
  traffic: Object.fromEntries(M5_PREP_TRAFFIC.map((x) => [x.id, x.color])),
  stockBase: M5_PREP_STOCK_BASE.correctId,
  associations: Object.fromEntries(M5_PREP_ASSOC.map((a) => [a.id, a.consequenceId])),
  trueFalse: Object.fromEntries(M5_PREP_TRUE_FALSE.map((x) => [x.id, x.answer])),
};

describe("formative re-execution (leave / return / redo)", () => {
  it("auto-restarts completed attempt on re-entry unless view=result", () => {
    expect(pageSrc).toContain('get("view") === "result"');
    expect(pageSrc).toContain("justSubmittedRef");
    expect(pageSrc).toContain("autoRedoStartedRef");
    expect(pageSrc).toContain("restartMut.mutate");
    expect(pageSrc).toMatch(/isCompleted &&\s*\n?\s*!viewResult/);
  });

  it("hub exposes view-result vs redo entry points", () => {
    expect(cardSrc).toContain('?view=result');
    expect(cardSrc).toContain("Refaire l’exercice");
    expect(cardSrc).toContain("formative-redo-");
  });

  it("service restart clears answers and unlocks executable state", () => {
    expect(serviceSrc).toContain("restartFormativeExercise");
    expect(serviceSrc).toContain("answers: {}");
    expect(serviceSrc).toContain('status: "in_progress"');
    expect(serviceSrc).toContain("completedAt: null");
    expect(serviceSrc).toContain("formativeScore: null");
    expect(serviceSrc).toContain("feedbackJson: null");
  });

  it("unique key stays one active row (overwrite model, not history)", () => {
    expect(migrationSrc).toContain("uq_formative_user_exercise_version");
    expect(migrationSrc).toContain("(`userId`, `exerciseId`, `version`)");
    expect(serviceSrc).toMatch(/CURRENT_VERSION\s*=\s*1/);
  });

  it("M4: 100% then empty slate then new submission accepted", () => {
    const first = scoreFormativeExercise("M4-PREP-KPI-RESPONSE", m4Perfect);
    expect(first.formativeScore).toBe(100);
    const cleared = scoreFormativeExercise("M4-PREP-KPI-RESPONSE", {});
    expect(cleared.formativeScore).toBeLessThan(100);
    expect(cleared.feedback.some((f) => f.kind === "incomplete")).toBe(true);
    const second = scoreFormativeExercise("M4-PREP-KPI-RESPONSE", {
      ...m4Perfect,
      ordering: [...M4_LAYERS].reverse(),
    });
    expect(second.formativeScore).toBeLessThan(100);
    const third = scoreFormativeExercise("M4-PREP-KPI-RESPONSE", m4Perfect);
    expect(third.formativeScore).toBe(100);
  });

  it("M5: 100% then empty slate then new submission accepted", () => {
    const first = scoreFormativeExercise("M5-PREP-EVIDENCE-TO-DECISION", m5Perfect);
    expect(first.formativeScore).toBe(100);
    const cleared = scoreFormativeExercise("M5-PREP-EVIDENCE-TO-DECISION", {});
    expect(cleared.feedback.some((f) => f.kind === "incomplete")).toBe(true);
    const second = scoreFormativeExercise("M5-PREP-EVIDENCE-TO-DECISION", m5Perfect);
    expect(second.formativeScore).toBe(100);
  });

  it("M4 consolidation redo path remains scorable after wipe", () => {
    const perfect = scoreFormativeExercise("M4-CONS-SAME-KPI-DIFF-DECISION", {
      kpiColors: Object.fromEntries(M4_CONS_KPI_COLORS.map((k) => [k.id, k.color])),
      priorityRisk: M4_CONS_PRIORITY_RISK.correctId,
      trueFalse: Object.fromEntries(M4_CONS_TRUE_FALSE.map((x) => [x.id, x.answer])),
      actionBuckets: Object.fromEntries(M4_CONS_ACTIONS.map((a) => [a.id, a.bucket])),
      decisionPairs: Object.fromEntries(
        M4_CONS_DECISION_PAIRS.map((d) => [d.id, d.justificationId]),
      ),
    });
    expect(perfect.formativeScore).toBe(100);
    const wipe = scoreFormativeExercise("M4-CONS-SAME-KPI-DIFF-DECISION", {});
    expect(wipe.formativeScore).not.toBe(100);
  });

  it("M5 consolidation redo path remains scorable after wipe", () => {
    const perfect = scoreFormativeExercise("M5-CONS-FULL-REASONING", {
      evidenceColors: Object.fromEntries(M5_CONS_EVIDENCE_COLORS.map((e) => [e.id, e.color])),
      ordering: [...M5_CONS_PATH],
      associations: Object.fromEntries(M5_CONS_ASSOC.map((a) => [a.id, a.decisionId])),
      trueFalse: Object.fromEntries(M5_CONS_TRUE_FALSE.map((x) => [x.id, x.answer])),
      actionBuckets: Object.fromEntries(M5_CONS_ACTIONS.map((a) => [a.id, a.bucket])),
    });
    expect(perfect.formativeScore).toBe(100);
    const wipe = scoreFormativeExercise("M5-CONS-FULL-REASONING", {});
    expect(wipe.formativeScore).not.toBe(100);
  });

  it("does not require professor reset or attempt-history table", () => {
    expect(serviceSrc).not.toContain("formative_exercise_attempt_history");
    expect(pageSrc).not.toContain("adminReset");
    expect(pageSrc).toContain("Refaire l’exercice");
  });
});
