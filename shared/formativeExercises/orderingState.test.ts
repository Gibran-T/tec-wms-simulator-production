import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  M4_LAYERS,
  M4_LAYER_LABELS,
  M4_PREP_FRAGMENTS,
  M4_PREP_KPI_QUESTIONS,
  M5_CONS_PATH,
  M5_CONS_PATH_LABELS,
  M5_CONS_ACTIONS,
  M5_CONS_ASSOC,
  M5_CONS_EVIDENCE_COLORS,
  M5_CONS_TRUE_FALSE,
  initialNonCanonicalOrdering,
  isCompleteOrdering,
  withSeededOrdering,
  scoreFormativeExercise,
} from "./index";

const pageSrc = readFileSync(
  resolve(__dirname, "../../client/src/pages/student/FormativeExercisePage.tsx"),
  "utf8",
);
const orderingSrc = readFileSync(
  resolve(__dirname, "../../client/src/components/formative/OrderingExercise.tsx"),
  "utf8",
);

const m4OtherPerfect = {
  classification: Object.fromEntries(M4_PREP_FRAGMENTS.map((f) => [f.id, f.layer])),
  missing: {
    m1: ["decision", "suivi"],
    m2: ["donnee", "classification", "risque", "suivi"],
  },
  kpiQuestions: Object.fromEntries(M4_PREP_KPI_QUESTIONS.map((k) => [k.id, k.questionId])),
};

const m5ConsOtherPerfect = {
  evidenceColors: Object.fromEntries(M5_CONS_EVIDENCE_COLORS.map((e) => [e.id, e.color])),
  associations: Object.fromEntries(M5_CONS_ASSOC.map((a) => [a.id, a.decisionId])),
  trueFalse: Object.fromEntries(M5_CONS_TRUE_FALSE.map((x) => [x.id, x.answer])),
  actionBuckets: Object.fromEntries(M5_CONS_ACTIONS.map((a) => [a.id, a.bucket])),
};

describe("ordering state contract — helpers", () => {
  it("initial visual/internal order contain all six M4 IDs and are identical", () => {
    const initial = initialNonCanonicalOrdering(M4_LAYERS);
    expect(initial).toHaveLength(6);
    expect(isCompleteOrdering(M4_LAYERS, initial)).toBe(true);
    expect(withSeededOrdering("M4-PREP-KPI-RESPONSE", {}).ordering).toEqual(initial);
  });

  it("M4 initial order is not canonical", () => {
    const initial = initialNonCanonicalOrdering(M4_LAYERS);
    expect(initial).not.toEqual([...M4_LAYERS]);
    expect(initial).toEqual([...M4_LAYERS].reverse());
  });

  it("M5-CONS initial order contains all six IDs and is not canonical", () => {
    const initial = initialNonCanonicalOrdering(M5_CONS_PATH);
    expect(initial).toHaveLength(6);
    expect(isCompleteOrdering(M5_CONS_PATH, initial)).toBe(true);
    expect(initial).not.toEqual([...M5_CONS_PATH]);
    expect(withSeededOrdering("M5-CONS-FULL-REASONING", {}).ordering).toEqual(initial);
  });

  it("seed is deterministic across calls (stable, not render-random)", () => {
    expect(initialNonCanonicalOrdering(M4_LAYERS)).toEqual(
      initialNonCanonicalOrdering(M4_LAYERS),
    );
    expect(initialNonCanonicalOrdering(M5_CONS_PATH)).toEqual(
      initialNonCanonicalOrdering(M5_CONS_PATH),
    );
  });

  it("does not overwrite a complete existing order", () => {
    const kept = [...M4_LAYERS];
    expect(withSeededOrdering("M4-PREP-KPI-RESPONSE", { ordering: kept }).ordering).toEqual(
      kept,
    );
  });

  it("reseeds malformed ordering (missing / duplicate / unexpected)", () => {
    const seeded = initialNonCanonicalOrdering(M4_LAYERS);
    expect(
      withSeededOrdering("M4-PREP-KPI-RESPONSE", { ordering: ["donnee"] }).ordering,
    ).toEqual(seeded);
    expect(
      withSeededOrdering("M4-PREP-KPI-RESPONSE", {
        ordering: [...M4_LAYERS, "donnee"],
      }).ordering,
    ).toEqual(seeded);
    expect(
      withSeededOrdering("M4-PREP-KPI-RESPONSE", {
        ordering: ["x", ...M4_LAYERS.slice(1)],
      }).ordering,
    ).toEqual(seeded);
  });
});

describe("M4-PREP ordering — score path", () => {
  it("submit without moving cards is complete but not perfect", () => {
    const ordering = initialNonCanonicalOrdering(M4_LAYERS);
    const result = scoreFormativeExercise("M4-PREP-KPI-RESPONSE", {
      ...m4OtherPerfect,
      ordering,
    });
    expect(result.partScores.ordering).toBe(0);
    expect(result.feedback.some((f) => f.id === "order-empty")).toBe(false);
    expect(result.feedback.some((f) => f.id === "order" && f.kind === "incorrect")).toBe(
      true,
    );
    expect(result.formativeScore).toBe(75);
  });

  it("moving cards into canonical order scores ordering 100 and total 100", () => {
    const result = scoreFormativeExercise("M4-PREP-KPI-RESPONSE", {
      ...m4OtherPerfect,
      ordering: [...M4_LAYERS],
    });
    expect(result.partScores.ordering).toBe(100);
    expect(result.formativeScore).toBe(100);
    expect(result.feedback.some((f) => f.id === "order" && f.kind === "correct")).toBe(true);
  });

  it("no Réponse incomplète when all six IDs exist", () => {
    const result = scoreFormativeExercise("M4-PREP-KPI-RESPONSE", {
      ordering: initialNonCanonicalOrdering(M4_LAYERS),
    });
    expect(result.feedback.some((f) => f.id === "order-empty")).toBe(false);
    expect(
      result.feedback.some(
        (f) =>
          f.id === "order-empty" ||
          (f.kind === "incomplete" && f.title.fr.includes("Réponse incomplète") && f.id.startsWith("order")),
      ),
    ).toBe(false);
  });

  it("empty / missing ordering remains incomplete", () => {
    const empty = scoreFormativeExercise("M4-PREP-KPI-RESPONSE", { ordering: [] });
    expect(empty.feedback.some((f) => f.id === "order-empty" && f.kind === "incomplete")).toBe(
      true,
    );
    const missing = scoreFormativeExercise("M4-PREP-KPI-RESPONSE", {});
    expect(missing.feedback.some((f) => f.id === "order-empty")).toBe(true);
  });

  it("partial position matches use existing partial score contract", () => {
    const almost = [...M4_LAYERS];
    [almost[4], almost[5]] = [almost[5]!, almost[4]!];
    const result = scoreFormativeExercise("M4-PREP-KPI-RESPONSE", {
      ...m4OtherPerfect,
      ordering: almost,
    });
    expect(result.partScores.ordering).toBeCloseTo((4 / 6) * 100, 5);
    expect(result.feedback.some((f) => f.id === "order" && f.kind === "incorrect")).toBe(true);
  });
});

describe("M5-CONS ordering — score path", () => {
  it("submit without moving cards is complete but not perfect", () => {
    const ordering = initialNonCanonicalOrdering(M5_CONS_PATH);
    const result = scoreFormativeExercise("M5-CONS-FULL-REASONING", {
      ...m5ConsOtherPerfect,
      ordering,
    });
    expect(result.partScores.ordering).toBe(0);
    expect(result.feedback.some((f) => f.id === "order-empty")).toBe(false);
    expect(result.feedback.some((f) => f.id === "order" && f.kind === "incorrect")).toBe(
      true,
    );
  });

  it("canonical order scores ordering 100", () => {
    const result = scoreFormativeExercise("M5-CONS-FULL-REASONING", {
      ...m5ConsOtherPerfect,
      ordering: [...M5_CONS_PATH],
    });
    expect(result.partScores.ordering).toBe(100);
    expect(result.formativeScore).toBe(100);
  });

  it("no incomplete when all six path IDs exist", () => {
    const result = scoreFormativeExercise("M5-CONS-FULL-REASONING", {
      ordering: initialNonCanonicalOrdering(M5_CONS_PATH),
    });
    expect(result.feedback.some((f) => f.id === "order-empty")).toBe(false);
  });
});

describe("ordering UI wiring — no canonical display fallback", () => {
  it("page does not fall back to M4_LAYERS / M5_CONS_PATH for display", () => {
    expect(pageSrc).not.toContain("?? [...M4_LAYERS]");
    expect(pageSrc).not.toContain("?? [...M5_CONS_PATH]");
    expect(pageSrc).toContain("withSeededOrdering");
    expect(pageSrc).toContain('value={(answers.ordering as string[]) ?? []}');
  });

  it("OrderingExercise renders only from answer-state value (no second order)", () => {
    expect(orderingSrc).not.toContain("value.length ? value : items.map");
    expect(orderingSrc).toContain("const order = value;");
    expect(orderingSrc).toContain("key={id}");
  });

  it("canonical labels remain tied to IDs (not display labels as keys)", () => {
    expect(M4_LAYER_LABELS.donnee.fr).toBe("Donnée");
    expect(M5_CONS_PATH_LABELS.ecart.fr).toBe("Écart constaté");
  });
});

describe("save / restore / redo contract for ordering seed", () => {
  it("seeded answers round-trip through withSeededOrdering unchanged", () => {
    const once = withSeededOrdering("M4-PREP-KPI-RESPONSE", {});
    const twice = withSeededOrdering("M4-PREP-KPI-RESPONSE", once);
    expect(twice.ordering).toEqual(once.ordering);
  });

  it("redo overwrite model reseeds from empty answers", () => {
    const afterRedo = withSeededOrdering("M4-PREP-KPI-RESPONSE", {});
    expect(afterRedo.ordering).toEqual(initialNonCanonicalOrdering(M4_LAYERS));
    const afterM5 = withSeededOrdering("M5-CONS-FULL-REASONING", {});
    expect(afterM5.ordering).toEqual(initialNonCanonicalOrdering(M5_CONS_PATH));
  });

  it("exercises without ordering are unchanged by seeding", () => {
    const answers = { priorityRisk: "r1" };
    expect(withSeededOrdering("M4-CONS-SAME-KPI-DIFF-DECISION", answers)).toEqual(answers);
    expect(withSeededOrdering("M5-PREP-EVIDENCE-TO-DECISION", answers)).toEqual(answers);
  });
});
