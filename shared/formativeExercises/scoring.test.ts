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
} from "./content";
import { scoreFormativeExercise } from "./scoring";
import { M1_PREP_MCQ, M1_CONS_MCQ, M2_PREP_MCQ, M2_CONS_MCQ, M3_PREP_MCQ, M3_CONS_MCQ } from "./m1m3Content";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("formative scoring — closed items only", () => {
  it("scores perfect M4 prep answers at 100", () => {
    const result = scoreFormativeExercise("M4-PREP-KPI-RESPONSE", {
      classification: Object.fromEntries(M4_PREP_FRAGMENTS.map((f) => [f.id, f.layer])),
      ordering: [...M4_LAYERS],
      missing: {
        m1: ["decision", "suivi"],
        m2: ["donnee", "classification", "risque", "suivi"],
      },
      kpiQuestions: Object.fromEntries(
        M4_PREP_KPI_QUESTIONS.map((k) => [k.id, k.questionId]),
      ),
    });
    expect(result.formativeScore).toBe(100);
  });

  it("scores perfect M4 consolidation without any free text", () => {
    const result = scoreFormativeExercise("M4-CONS-SAME-KPI-DIFF-DECISION", {
      kpiColors: Object.fromEntries(M4_CONS_KPI_COLORS.map((k) => [k.id, k.color])),
      priorityRisk: M4_CONS_PRIORITY_RISK.correctId,
      trueFalse: Object.fromEntries(M4_CONS_TRUE_FALSE.map((x) => [x.id, x.answer])),
      actionBuckets: Object.fromEntries(M4_CONS_ACTIONS.map((a) => [a.id, a.bucket])),
      decisionPairs: Object.fromEntries(
        M4_CONS_DECISION_PAIRS.map((d) => [d.id, d.justificationId]),
      ),
    });
    expect(result.formativeScore).toBe(100);
  });

  it("scores perfect M5 prep", () => {
    const result = scoreFormativeExercise("M5-PREP-EVIDENCE-TO-DECISION", {
      traffic: Object.fromEntries(M5_PREP_TRAFFIC.map((x) => [x.id, x.color])),
      stockBase: M5_PREP_STOCK_BASE.correctId,
      associations: Object.fromEntries(M5_PREP_ASSOC.map((a) => [a.id, a.consequenceId])),
      trueFalse: Object.fromEntries(M5_PREP_TRUE_FALSE.map((x) => [x.id, x.answer])),
    });
    expect(result.formativeScore).toBe(100);
  });

  it("scores perfect M5 consolidation", () => {
    const result = scoreFormativeExercise("M5-CONS-FULL-REASONING", {
      evidenceColors: Object.fromEntries(M5_CONS_EVIDENCE_COLORS.map((e) => [e.id, e.color])),
      ordering: [...M5_CONS_PATH],
      associations: Object.fromEntries(M5_CONS_ASSOC.map((a) => [a.id, a.decisionId])),
      trueFalse: Object.fromEntries(M5_CONS_TRUE_FALSE.map((x) => [x.id, x.answer])),
      actionBuckets: Object.fromEntries(M5_CONS_ACTIONS.map((a) => [a.id, a.bucket])),
    });
    expect(result.formativeScore).toBe(100);
  });

  it("scores perfect M1–M3 pre/post MCQ banks at 100", () => {
    const banks = [
      ["M1-PREP-RECEIVING-SEQUENCE", M1_PREP_MCQ],
      ["M1-CONS-OPERATIONAL-DECISION", M1_CONS_MCQ],
      ["M2-PREP-PUTAWAY-FIFO", M2_PREP_MCQ],
      ["M2-CONS-EXECUTION-DECISION", M2_CONS_MCQ],
      ["M3-PREP-INVENTORY-CONTROL", M3_PREP_MCQ],
      ["M3-CONS-VARIANCE-REPLENISH", M3_CONS_MCQ],
    ] as const;
    for (const [id, items] of banks) {
      const result = scoreFormativeExercise(id, {
        mcq: Object.fromEntries(items.map((q) => [q.id, q.correctId])),
      });
      expect(result.formativeScore).toBe(100);
      expect(result.feedback.every((f) => f.kind === "correct")).toBe(true);
    }
  });

  it("applies pedagogical whyWrong on an M1 pre incorrect choice", () => {
    const result = scoreFormativeExercise("M1-PREP-RECEIVING-SEQUENCE", {
      mcq: { m1p1: "a" },
    });
    expect(result.formativeScore).toBeLessThan(100);
    const item = result.feedback.find((f) => f.id.startsWith("m1p1:"));
    expect(item?.kind).toBe("incorrect");
    expect(item?.body.fr).toContain("séquence opérationnelle");
  });

  it("rejects free-text style payloads (no credit without closed keys)", () => {
    const result = scoreFormativeExercise("M4-CONS-SAME-KPI-DIFF-DECISION", {
      fields: { decision: "Je recommande une formation qualité..." },
      guided: { stock: "long free text" },
      tactical: "Q = 0 because ...",
    });
    expect(result.formativeScore).toBe(0);
    expect(result.feedback.some((f) => f.kind === "incomplete")).toBe(true);
  });
});

describe("zero free-text contract source guards", () => {
  it("scoring has no heuristic short-answer helpers", () => {
    const src = readFileSync(resolve(__dirname, "scoring.ts"), "utf8");
    const code = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
    expect(code).not.toContain("hasAny(");
    expect(code).not.toContain("norm(");
    expect(code).not.toMatch(/needles/);
    expect(src).toContain("Closed-item formative scoring only");
  });
});
