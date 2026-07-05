import type { MentorMode } from "../../shared/aiMentor/types";
import { PROFESSIONAL_HINT_CAP } from "../../shared/aiMentor/types";
import {
  REFUSAL_DIRECT_ANSWER,
  REFUSAL_HINT_BUDGET,
  REFUSAL_UI_BYPASS,
} from "../../shared/aiMentor/refusalTemplates";

const DIRECT_ANSWER_PATTERNS = [
  /what is the (adj|quantity|answer|number)/i,
  /quelle est la (quantité|réponse|valeur)/i,
  /give me the answer/i,
  /donne[- ]moi la réponse/i,
  /how many units/i,
  /combien d'unités/i,
];

const UI_BYPASS_PATTERNS = [
  /click/i,
  /cliquer/i,
  /which button/i,
  /quel bouton/i,
  /step sequence/i,
  /séquence des étapes/i,
  /migo|me21n|lt0a/i,
];

const TRANSACTION_EXECUTION_PATTERNS = [
  /poster migo/i,
  /post gr/i,
  /click migo/i,
];

export type GuardrailResult = {
  blocked: boolean;
  message?: string;
  flags: string[];
  isHint: boolean;
};

export function classifyUserIntent(message: string): string[] {
  const flags: string[] = [];
  if (DIRECT_ANSWER_PATTERNS.some((p) => p.test(message))) flags.push("intent:answer_request");
  if (UI_BYPASS_PATTERNS.some((p) => p.test(message))) flags.push("intent:ui_bypass");
  return flags;
}

export function applyPreCallGuardrails(input: {
  message: string;
  mode: MentorMode;
  hintCount: number;
  language: "fr" | "en";
}): GuardrailResult {
  const flags = classifyUserIntent(input.message);

  if (input.mode === "professional" && input.hintCount >= PROFESSIONAL_HINT_CAP) {
    return {
      blocked: true,
      message: input.language === "fr" ? REFUSAL_HINT_BUDGET.fr : REFUSAL_HINT_BUDGET.en,
      flags: [...flags, "hint_budget_exhausted"],
      isHint: false,
    };
  }

  if (input.mode === "professional" && flags.includes("intent:answer_request")) {
    return {
      blocked: true,
      message: input.language === "fr" ? REFUSAL_DIRECT_ANSWER.fr : REFUSAL_DIRECT_ANSWER.en,
      flags,
      isHint: false,
    };
  }

  if (flags.includes("intent:ui_bypass")) {
    return {
      blocked: true,
      message: input.language === "fr" ? REFUSAL_UI_BYPASS.fr : REFUSAL_UI_BYPASS.en,
      flags,
      isHint: false,
    };
  }

  return { blocked: false, flags, isHint: false };
}

export function scanResponseForLeaks(response: string): string[] {
  const flags: string[] = [];
  if (TRANSACTION_EXECUTION_PATTERNS.some((p) => p.test(response))) {
    flags.push("leak:transaction_execution");
  }
  if (/step \d|étape \d|next you must|ensuite tu dois/i.test(response)) {
    flags.push("leak:step_sequencer");
  }
  return flags;
}
