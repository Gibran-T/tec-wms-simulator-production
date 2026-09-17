import { getM1M3McqBank } from "./m1m3Content";
import { M4_CONS_PRIORITY_RISK, M5_PREP_STOCK_BASE } from "./content";
import { withSeededOrdering } from "./orderingState";
import type { FormativeExerciseId } from "./types";
import {
  buildMcqDisplayOrder,
  isCompleteOptionOrder,
  type McqOrderQuestion,
} from "../mcqOptionOrder";

export function getFormativeMcqGroups(exerciseId: FormativeExerciseId): McqOrderQuestion[] {
  const bank = getM1M3McqBank(exerciseId);
  if (bank) {
    return bank.map((item) => ({
      id: item.id,
      optionIds: item.options.map((o) => o.id),
      correctId: item.correctId,
    }));
  }
  if (exerciseId === "M4-CONS-SAME-KPI-DIFF-DECISION") {
    return [
      {
        id: "priorityRisk",
        optionIds: M4_CONS_PRIORITY_RISK.options.map((o) => o.id),
        correctId: M4_CONS_PRIORITY_RISK.correctId,
      },
    ];
  }
  if (exerciseId === "M5-PREP-EVIDENCE-TO-DECISION") {
    return [
      {
        id: "stockBase",
        optionIds: M5_PREP_STOCK_BASE.options.map((o) => o.id),
        correctId: M5_PREP_STOCK_BASE.correctId,
      },
    ];
  }
  return [];
}

export function withSeededMcqOrder(
  exerciseId: FormativeExerciseId,
  answers: Record<string, unknown>,
  seed: string,
): Record<string, unknown> {
  const groups = getFormativeMcqGroups(exerciseId);
  if (!groups.length) return answers;
  const existing = (answers.optionOrder as Record<string, string[]> | undefined) ?? {};
  const complete = groups.every((g) => isCompleteOptionOrder(g.optionIds, existing[g.id]));
  if (complete) return answers;
  return {
    ...answers,
    optionOrder: buildMcqDisplayOrder({ questions: groups, seed }),
  };
}

export function withSeededFormativeDisplay(
  exerciseId: FormativeExerciseId,
  answers: Record<string, unknown>,
  seed: string,
): Record<string, unknown> {
  return withSeededMcqOrder(exerciseId, withSeededOrdering(exerciseId, answers), seed);
}
