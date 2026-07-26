/** Isolated formative exercise types — never counted toward official metrics. */

export const FORMATIVE_EXERCISE_IDS = [
  "M4-PREP-KPI-RESPONSE",
  "M4-CONS-SAME-KPI-DIFF-DECISION",
  "M5-PREP-EVIDENCE-TO-DECISION",
  "M5-CONS-FULL-REASONING",
] as const;

export type FormativeExerciseId = (typeof FORMATIVE_EXERCISE_IDS)[number];

export type FormativeExerciseStatus = "not_started" | "in_progress" | "completed";

export type FormativeExerciseKind = "preparation" | "consolidation";

export const FORMATIVE_ISOLATION_FLAGS = {
  countsTowardMissionCount: false,
  countsTowardScenarioAverage: false,
  countsTowardCertificate: false,
  countsTowardAssessment: false,
  countsTowardCheckpoint: false,
} as const;

export type LocalizedText = { fr: string; en: string };

export type FormativeFeedbackItem = {
  id: string;
  kind: "correct" | "incorrect" | "incomplete" | "info";
  title: LocalizedText;
  body: LocalizedText;
};

export type FormativeScoreResult = {
  formativeScore: number;
  feedback: FormativeFeedbackItem[];
  partScores: Record<string, number>;
};

export type FormativeExerciseMeta = {
  id: FormativeExerciseId;
  moduleId: 4 | 5;
  kind: FormativeExerciseKind;
  version: number;
  title: LocalizedText;
  subtitle: LocalizedText;
  chain: LocalizedText;
  duration: LocalizedText;
  routeSegment: string;
};
