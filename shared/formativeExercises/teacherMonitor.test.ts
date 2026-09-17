import { describe, expect, it } from "vitest";
import {
  aggregateFeedbackHotspots,
  completionRate,
  computePrePostEvolution,
  correctAnswerRate,
  countFeedbackAnswers,
  deriveTeacherFormativeStatus,
  needsInstructorIntervention,
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

  it("computes pre/post evolution and accompaniment signal", () => {
    expect(computePrePostEvolution(40, 70)).toBe(30);
    expect(computePrePostEvolution(null, 70)).toBeNull();
    expect(needsInstructorIntervention({ prepScore: 80, consScore: 40, consCompleted: true })).toBe(true);
    expect(needsInstructorIntervention({ prepScore: 40, consScore: 70, consCompleted: true })).toBe(false);
    expect(needsInstructorIntervention({ prepScore: 40, consScore: 70, consCompleted: false })).toBe(false);
  });

  it("aggregates incorrect alternatives as hotspots", () => {
    const hotspots = aggregateFeedbackHotspots([
      { items: [{ id: "m1p1:a", kind: "incorrect" }, { id: "m1p2:c", kind: "correct" }] },
      { items: [{ id: "m1p1:a", kind: "incorrect" }, { id: "m1p1:b", kind: "correct" }] },
    ]);
    expect(hotspots[0]?.itemId).toBe("m1p1");
    expect(hotspots[0]?.mostChosenWrong).toBe("a");
    expect(hotspots[0]?.incorrect).toBe(2);
  });
});
