/**
 * Unit tests — integrated assessments + quiz integrity
 */
import { describe, expect, it } from "vitest";
import {
  computeM4UnlockStatus,
  isDemoAccount,
  scoreByOptionId,
  seededShuffle,
  shouldIncludeInOfficialAssessmentStats,
  studentAttemptStatusLabel,
} from "../shared/assessmentCore";
import {
  EVAL1_QUESTIONS,
  EVAL1_PASSING_SCORE,
  countCorrectPositionDistribution,
} from "../shared/eval1QuestionBank";
import {
  QUIZ_INTEGRITY_BANK,
  materializeQuizOptions,
  quizCorrectIndexDistribution,
  scoreQuizByOptionIds,
} from "../shared/quizIntegrity";

describe("assessmentCore scoring", () => {
  const questions = [
    { id: 1, correctOptionId: "o2", points: 5, competency: "FIFO et gestion des lots" },
    { id: 2, correctOptionId: "o1", points: 5, competency: "Réapprovisionnement" },
  ];

  it("scores by option ID independent of display position", () => {
    const r = scoreByOptionId({
      questions,
      responses: [
        { questionId: 1, selectedOptionId: "o2" },
        { questionId: 2, selectedOptionId: "o1" },
      ],
    });
    expect(r.autoScore).toBe(100);
    expect(r.passed).toBe(true);
  });

  it("passes at exactly 70", () => {
    const qs = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      correctOptionId: "ok",
      points: 5,
      competency: "Conformité du processus",
    }));
    const responses = qs.map((q, i) => ({
      questionId: q.id,
      selectedOptionId: i < 14 ? "ok" : "wrong", // 14*5=70
    }));
    const r = scoreByOptionId({ questions: qs, responses });
    expect(r.autoScore).toBe(70);
    expect(r.passed).toBe(true);
  });

  it("fails at 69", () => {
    const qs = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      correctOptionId: "ok",
      points: 1,
      competency: "Exactitude des stocks",
    }));
    const responses = qs.map((q, i) => ({
      questionId: q.id,
      selectedOptionId: i < 69 ? "ok" : "no",
    }));
    const r = scoreByOptionId({ questions: qs, responses });
    expect(r.autoScore).toBe(69);
    expect(r.passed).toBe(false);
  });

  it("builds competency breakdown", () => {
    const r = scoreByOptionId({
      questions,
      responses: [
        { questionId: 1, selectedOptionId: "o2" },
        { questionId: 2, selectedOptionId: "wrong" },
      ],
    });
    expect(r.competencyBreakdown.length).toBe(2);
    const fifo = r.competencyBreakdown.find((c) => c.competency.includes("FIFO"));
    expect(fifo?.earned).toBe(5);
  });
});

describe("M4 unlock + Cohorte B transitional policy", () => {
  it("locks when assessment failed (standard / incomplete)", () => {
    expect(
      computeM4UnlockStatus({
        assessmentPassed: false,
        practicalEvidenceSatisfied: true,
        priorPracticalProgressComplete: false,
        policy: "standard",
      }).m4UnlockStatus
    ).toBe("locked");
  });

  it("pending_practical when passed without practical (incomplete)", () => {
    expect(
      computeM4UnlockStatus({
        assessmentPassed: true,
        practicalEvidenceSatisfied: false,
        priorPracticalProgressComplete: false,
        policy: "cohorte_b_transition",
      })
    ).toMatchObject({
      m4UnlockStatus: "pending_practical",
      practicalValidationStatus: "pending",
      assessmentRole: "competency_validation",
    });
  });

  it("unlocked when passed with practical evidence", () => {
    expect(
      computeM4UnlockStatus({
        assessmentPassed: true,
        practicalEvidenceSatisfied: true,
        priorPracticalProgressComplete: false,
        policy: "cohorte_b_transition",
      }).m4UnlockStatus
    ).toBe("unlocked");
  });

  it("Cohorte B consolidative: never revokes earned M1–M3 progression", () => {
    const fail = computeM4UnlockStatus({
      assessmentPassed: false,
      practicalEvidenceSatisfied: false,
      priorPracticalProgressComplete: true,
      policy: "cohorte_b_transition",
    });
    expect(fail.assessmentRole).toBe("consolidative");
    expect(fail.m4UnlockStatus).toBe("unlocked");
    expect(fail.practicalValidationStatus).toBe("satisfied");

    const pass = computeM4UnlockStatus({
      assessmentPassed: true,
      practicalEvidenceSatisfied: false,
      priorPracticalProgressComplete: true,
      policy: "cohorte_b_transition",
    });
    expect(pass.m4UnlockStatus).toBe("unlocked");
  });

  it("Cohorte B: does not downgrade previous unlocked on fail", () => {
    expect(
      computeM4UnlockStatus({
        assessmentPassed: false,
        practicalEvidenceSatisfied: false,
        priorPracticalProgressComplete: false,
        policy: "cohorte_b_transition",
        previousM4UnlockStatus: "unlocked",
      }).m4UnlockStatus
    ).toBe("unlocked");
  });
});

describe("James / demo exclusion", () => {
  it("excludes James Timothy by userId 222", () => {
    expect(isDemoAccount({ id: 222, email: "jamesnns3@gmail.com" })).toBe(true);
    expect(
      shouldIncludeInOfficialAssessmentStats({
        id: 222,
        email: "jamesnns3@gmail.com",
      })
    ).toBe(false);
  });

  it("includes real cohort students", () => {
    expect(
      shouldIncludeInOfficialAssessmentStats({
        id: 1001,
        email: "camarasvetagnouma@gmail.com",
      })
    ).toBe(true);
  });
});

describe("randomization persistence", () => {
  it("seeded shuffle is stable for same seed", () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8];
    expect(seededShuffle(items, "attempt-1")).toEqual(
      seededShuffle(items, "attempt-1")
    );
  });

  it("different seeds produce different orders", () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(seededShuffle(items, "a")).not.toEqual(seededShuffle(items, "b"));
  });
});

describe("student status labels", () => {
  it("shows pending professor release", () => {
    expect(
      studentAttemptStatusLabel({
        releaseLevel: "visible_pending",
        canStart: false,
        inProgress: false,
        submitted: false,
        passed: null,
        retakeBlocked: false,
        m4UnlockStatus: "locked",
        practicalValidationStatus: "pending",
      })
    ).toContain("libération");
  });

  it("shows retake blocked after fail", () => {
    expect(
      studentAttemptStatusLabel({
        releaseLevel: "released_cohort",
        canStart: false,
        inProgress: false,
        submitted: true,
        passed: false,
        retakeBlocked: true,
        m4UnlockStatus: "locked",
        practicalValidationStatus: "pending",
      })
    ).toContain("non autorisée");
  });

  it("shows practical pending after pass", () => {
    expect(
      studentAttemptStatusLabel({
        releaseLevel: "released_cohort",
        canStart: false,
        inProgress: false,
        submitted: true,
        passed: true,
        retakeBlocked: false,
        m4UnlockStatus: "pending_practical",
        practicalValidationStatus: "pending",
      })
    ).toContain("validation pratique");
  });
});

describe("Eval1 question bank", () => {
  it("has 20 questions totaling 100 points", () => {
    expect(EVAL1_QUESTIONS).toHaveLength(20);
    expect(EVAL1_QUESTIONS.reduce((s, q) => s + q.points, 0)).toBe(100);
    expect(EVAL1_PASSING_SCORE).toBe(70);
  });

  it("distributes correct options across o1–o4", () => {
    const dist = countCorrectPositionDistribution(EVAL1_QUESTIONS);
    const values = Object.values(dist);
    expect(values.every((n) => n >= 3 && n <= 7)).toBe(true);
    expect(Math.max(...values) - Math.min(...values)).toBeLessThanOrEqual(3);
  });

  it("covers required question types", () => {
    const types = EVAL1_QUESTIONS.reduce(
      (acc, q) => {
        acc[q.questionType] = (acc[q.questionType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    expect(types.conceptual).toBe(5);
    expect(types.scenario).toBe(7);
    expect(types.sequencing).toBe(3);
    expect(types.data_interpretation).toBe(3);
    expect(types.diagnosis).toBe(2);
  });
});

describe("Eval2 clôture question bank (programme closing)", () => {
  it("is wired as EVAL_INTEGREE_2 with 50 min / 100 pts / pass 70", async () => {
    const {
      EVAL_CLOTURE_ASSESSMENT_CODE,
      EVAL_CLOTURE_DURATION_MINUTES,
      EVAL_CLOTURE_PASSING_SCORE,
      EVAL_CLOTURE_QUESTIONS,
      EVAL_CLOTURE_TOTAL_POINTS,
      EVAL_CLOTURE_META,
      countCorrectPositionDistribution: clotureDist,
      uniqueLongestCorrectRatio,
    } = await import("../shared/evalClotureQuestionBank");
    const { ASSESSMENT_CODES } = await import("../shared/assessmentCore");

    expect(EVAL_CLOTURE_ASSESSMENT_CODE).toBe(ASSESSMENT_CODES.EVAL2);
    expect(EVAL_CLOTURE_META.activationStatus).toBe("ready");
    expect(EVAL_CLOTURE_QUESTIONS).toHaveLength(20);
    expect(EVAL_CLOTURE_TOTAL_POINTS).toBe(100);
    expect(EVAL_CLOTURE_PASSING_SCORE).toBe(70);
    expect(EVAL_CLOTURE_DURATION_MINUTES).toBe(50);
    expect(EVAL_CLOTURE_QUESTIONS.reduce((s, q) => s + q.points, 0)).toBe(100);

    const dist = clotureDist(EVAL_CLOTURE_QUESTIONS);
    expect(dist).toEqual({ o1: 5, o2: 5, o3: 5, o4: 5 });
    expect(uniqueLongestCorrectRatio(EVAL_CLOTURE_QUESTIONS)).toBeLessThanOrEqual(
      0.35,
    );
  });
});

describe("quiz integrity redistribution", () => {
  it("eliminates systematic B pattern", () => {
    const dist = quizCorrectIndexDistribution();
    let totalB = 0;
    let total = 0;
    for (const m of Object.values(dist)) {
      totalB += m.B;
      total += m.total;
    }
    expect(total).toBe(21);
    expect(totalB / total).toBeLessThan(0.4);
    expect(dist[2].B).toBeLessThan(4); // M2 was all B
    expect(dist[3].B).toBeLessThan(4);
    expect(dist[5].B).toBeLessThan(4);
  });

  it("scores by stable option id regardless of array order", () => {
    const q = QUIZ_INTEGRITY_BANK[0];
    const mat = materializeQuizOptions(q.options, q.correctOptionId);
    const reversed = [...q.options].reverse();
    const mat2 = materializeQuizOptions(reversed, q.correctOptionId);
    expect(mat.correctOptionId).toBe(mat2.correctOptionId);
    expect(mat.correctIndex).not.toBe(mat2.correctIndex);

    const scored = scoreQuizByOptionIds(
      [{ id: 1, correctOptionId: q.correctOptionId }],
      [{ questionId: 1, selectedOptionId: q.correctOptionId }]
    );
    expect(scored.score).toBe(100);
  });
});
