import { describe, expect, it } from "vitest";
import { getM1M3McqBank } from "./m1m3Content";
import { scoreFormativeExercise } from "./scoring";
import { FORMATIVE_EXERCISE_IDS } from "./types";

describe("M1–M3 formative MCQ banks", () => {
  const ids = FORMATIVE_EXERCISE_IDS.filter((id) => id.startsWith("M1-") || id.startsWith("M2-") || id.startsWith("M3-"));

  it("has four single-correct A–D items per Pré/Pós", () => {
    for (const id of ids) {
      const bank = getM1M3McqBank(id);
      expect(bank, id).toHaveLength(4);
      for (const item of bank!) {
        expect(item.options.length).toBeGreaterThanOrEqual(4);
        expect(item.options.filter((o) => o.id === item.correctId)).toHaveLength(1);
        expect(new Set(item.options.map((o) => o.id)).size).toBe(item.options.length);
      }
    }
  });

  it("scores by option id and isolates from official average flags", () => {
    const allB: Record<string, string> = {};
    const bank = getM1M3McqBank("M1-PREP-RECEIVING-SEQUENCE")!;
    for (const item of bank) allB[item.id] = item.correctId;
    const perfect = scoreFormativeExercise("M1-PREP-RECEIVING-SEQUENCE", { mcq: allB });
    expect(perfect.formativeScore).toBe(100);
    expect(perfect.feedback.every((f) => f.kind === "correct")).toBe(true);

    const wrong = scoreFormativeExercise("M1-PREP-RECEIVING-SEQUENCE", {
      mcq: Object.fromEntries(bank.map((item) => [item.id, item.options.find((o) => o.id !== item.correctId)!.id])),
    });
    expect(wrong.formativeScore).toBe(0);
    expect(wrong.feedback.every((f) => f.kind === "incorrect")).toBe(true);
    expect(wrong.feedback[0]?.body.fr).toMatch(/Conséquence opérationnelle/);
    expect(wrong.feedback[0]?.body.fr).toMatch(/Règle violée/);
  });
});
