import { describe, expect, it } from "vitest";
import { orderQuizQuestionsForAttempt } from "./quizDisplayOrder";

describe("quizDisplayOrder", () => {
  const questions = [1, 2, 3, 4].map((id) => ({
    id,
    optionsFr: ["Fa", "Fb", "Fc", "Fd"],
    optionsEn: ["Ea", "Eb", "Ec", "Ed"],
    optionsPayload: [
      { id: "a", fr: "Fa", en: "Ea" },
      { id: "b", fr: "Fb", en: "Eb" },
      { id: "c", fr: "Fc", en: "Ec" },
      { id: "d", fr: "Fd", en: "Ed" },
    ],
    correctOptionId: "b",
    correctIndex: 1,
  }));

  it("is stable for the same attempt and scores by option id", () => {
    const a = orderQuizQuestionsForAttempt({ quizId: 3, userId: 8, attemptNumber: 1, questions });
    const b = orderQuizQuestionsForAttempt({ quizId: 3, userId: 8, attemptNumber: 1, questions });
    expect(a.map((r) => r.orderedIds)).toEqual(b.map((r) => r.orderedIds));
    for (const row of a) {
      expect(row.orderedIds.filter((id) => id === row.correctId)).toHaveLength(1);
    }
  });

  it("can change order on a new attempt number", () => {
    const a = orderQuizQuestionsForAttempt({ quizId: 3, userId: 8, attemptNumber: 1, questions });
    const c = orderQuizQuestionsForAttempt({ quizId: 3, userId: 8, attemptNumber: 2, questions });
    expect(a.map((r) => r.orderedIds.join(","))).not.toEqual(c.map((r) => r.orderedIds.join(",")));
  });
});
