import type { MentorMode } from "../../shared/aiMentor/types";
import { PROFESSIONAL_HINT_CAP } from "../../shared/aiMentor/types";
import {
  REFUSAL_BIN_REQUEST,
  REFUSAL_COMPLETE_FOR_ME,
  REFUSAL_DIRECT_ANSWER,
  REFUSAL_HINT_BUDGET,
  REFUSAL_LOT_REQUEST,
  REFUSAL_OPERATIONAL_COLLEAGUE,
  REFUSAL_QUANTITY_REQUEST,
  REFUSAL_TRANSACTION_SEQUENCE,
  REFUSAL_UI_BYPASS,
} from "../../shared/aiMentor/refusalTemplates";

const DIRECT_ANSWER_PATTERNS = [
  /what is the (adj|quantity|answer|number|bin|lot|kpi)/i,
  /quelle est la (quantité|réponse|valeur|lot|bin)/i,
  /give me the answer/i,
  /donne[- ]moi la réponse/i,
  /how many units/i,
  /combien d'unités/i,
  /what (quantity|bin|lot|kpi)/i,
  /which bin/i,
  /quel bin/i,
  /target kpi/i,
  /objectif kpi/i,
  /what should i enter/i,
  /que dois[- ]je (?:saisir|entrer)/i,
  /which option/i,
  /quelle option/i,
  /complete this for me/i,
  /complète(?:r)?(?:\s|-)?(?:la| cette)? mission/i,
  /choose \w+/i,
  /choisis \w+/i,
  /enter \d+/i,
  /entre \d+/i,
];

const LOT_REQUEST_PATTERNS = [
  /quel lot/i,
  /which lot/i,
  /what lot/i,
  /numéro de lot/i,
  /lot number/i,
];

const BIN_REQUEST_PATTERNS = [
  /quel(?:le)? emplacement/i,
  /which bin/i,
  /what bin/i,
  /quel bin/i,
];

const QUANTITY_REQUEST_PATTERNS = [
  /quelle quantité/i,
  /what quantity/i,
  /how many (?:units|u\.?)/i,
  /combien (?:d'unités|d unités|de pièces)/i,
];

const TRANSACTION_SEQUENCE_PATTERNS = [
  /prochaine transaction/i,
  /next transaction/i,
  /what transaction/i,
  /quelle transaction/i,
  /transaction sequence/i,
  /séquence d'exécution/i,
  /step sequence/i,
  /séquence des étapes/i,
];

const UI_BYPASS_PATTERNS = [
  /click/i,
  /cliquer/i,
  /which button/i,
  /quel bouton/i,
  /migo|me21n|lt0a/i,
];

const TRANSACTION_EXECUTION_PATTERNS = [
  /poster migo/i,
  /post gr/i,
  /click migo/i,
  /post gi/i,
  /execute migo/i,
  /you must post/i,
  /vous devez poster/i,
];

const OPERATIONAL_VALUE_LEAK_PATTERNS = [
  /\bLOT[- ]?\d{4}[- ]?[A-Z0-9-]+\b/i,
  /\b(?:PO|SO|GR|GI)-(?:M\d|\d{4})-[A-Z0-9-]+\b/i,
  /\bB-\d{2}-R\d-L\d\b/i,
  /\b(?:REC|EXP|STO|SHP)-\d{2}\b/i,
  /\b\d+(?:[.,]\d+)?\s*u\.?\b/i,
];

const KPI_TARGET_LEAK_PATTERNS = [
  /\btarget\s*(?:kpi|service level|fill rate)/i,
  /\bobjectif\s*(?:kpi|service|taux)/i,
  /\b\d+(?:[.,]\d+)?%\s*(?:error|service|fill)/i,
];

const COMPLIANCE_SOLUTION_PATTERNS = [
  /compliance answer/i,
  /pass compliance by/i,
  /réponse conformité/i,
  /pour être conforme,? (?:entre|saisis|poste)/i,
  /to pass compliance,? (?:enter|post)/i,
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
  if (LOT_REQUEST_PATTERNS.some((p) => p.test(message))) flags.push("intent:lot_request");
  if (BIN_REQUEST_PATTERNS.some((p) => p.test(message))) flags.push("intent:bin_request");
  if (QUANTITY_REQUEST_PATTERNS.some((p) => p.test(message))) flags.push("intent:quantity_request");
  if (TRANSACTION_SEQUENCE_PATTERNS.some((p) => p.test(message))) flags.push("intent:transaction_sequence");
  if (UI_BYPASS_PATTERNS.some((p) => p.test(message))) flags.push("intent:ui_bypass");
  if (/complete this for me|complète(?:r)?(?:\s|-)?(?:la| cette)? mission/i.test(message)) {
    flags.push("intent:complete_for_me");
  }
  return flags;
}

function colleagueRefusal(
  flags: string[],
  language: "fr" | "en",
): string {
  if (flags.includes("intent:lot_request")) {
    return language === "fr" ? REFUSAL_LOT_REQUEST.fr : REFUSAL_LOT_REQUEST.en;
  }
  if (flags.includes("intent:bin_request")) {
    return language === "fr" ? REFUSAL_BIN_REQUEST.fr : REFUSAL_BIN_REQUEST.en;
  }
  if (flags.includes("intent:quantity_request")) {
    return language === "fr" ? REFUSAL_QUANTITY_REQUEST.fr : REFUSAL_QUANTITY_REQUEST.en;
  }
  if (flags.includes("intent:transaction_sequence")) {
    return language === "fr" ? REFUSAL_TRANSACTION_SEQUENCE.fr : REFUSAL_TRANSACTION_SEQUENCE.en;
  }
  if (flags.includes("intent:complete_for_me")) {
    return language === "fr" ? REFUSAL_COMPLETE_FOR_ME.fr : REFUSAL_COMPLETE_FOR_ME.en;
  }
  return language === "fr" ? REFUSAL_OPERATIONAL_COLLEAGUE.fr : REFUSAL_OPERATIONAL_COLLEAGUE.en;
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

  if (input.mode === "operational_colleague") {
    const blockedIntents = [
      "intent:answer_request",
      "intent:lot_request",
      "intent:bin_request",
      "intent:quantity_request",
      "intent:transaction_sequence",
      "intent:complete_for_me",
    ];
    if (blockedIntents.some((intent) => flags.includes(intent))) {
      return {
        blocked: true,
        message: colleagueRefusal(flags, input.language),
        flags,
        isHint: false,
      };
    }
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
  if (OPERATIONAL_VALUE_LEAK_PATTERNS.some((p) => p.test(response))) {
    flags.push("leak:operational_value");
  }
  if (KPI_TARGET_LEAK_PATTERNS.some((p) => p.test(response))) {
    flags.push("leak:kpi_target");
  }
  if (COMPLIANCE_SOLUTION_PATTERNS.some((p) => p.test(response))) {
    flags.push("leak:compliance_solution");
  }
  if (/replenish(min|max)|Min\s+\d+\s*\/\s*Max\s+\d+/i.test(response)) {
    flags.push("leak:replenish_policy");
  }
  return flags;
}
