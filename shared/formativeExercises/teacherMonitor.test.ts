import { describe, expect, it } from "vitest";
import {
  completionRate,
  correctAnswerRate,
  countFeedbackAnswers,
  deriveTeacherFormativeStatus,
  participationRate,
} from "./teacherMonitor";

describe("teacher formative monitor aggregation", () => {
  it("derives only neutral statuses (no 70% threshold)", () => {
    expect(deriveTeacherFormativeStatus(null)).toBe("non_commence");
    expect(deriveTeacherFormativeStatus("not_started")).toBe("non_commence");
    expect(deriveTeacherFormativeStatus("in_progress")).toBe("en_cours");
    expect(deriveTeacherFormativeStatus("completed")).toBe("termine");
    expect(deriveTeacherFormativeStatus("completed")).not.toBe("reussi" as never);
  });

  it("counts feedback answers and avoids NaN rates", () => {
    const counts = countFeedbackAnswers({
      items: [
        { kind: "correct" },
        { kind: "incorrect" },
        { kind: "incomplete" },
        { kind: "correct" },
      ],
    });
    expect(counts).toEqual({ correct: 2, incorrect: 1, submitted: 3 });
    expect(correctAnswerRate(2, 3)).toBe(66.7);
    expect(correctAnswerRate(0, 0)).toBeNull();
    expect(participationRate(0, 0)).toBeNull();
    expect(completionRate(2, 4)).toBe(50);
  });
});
