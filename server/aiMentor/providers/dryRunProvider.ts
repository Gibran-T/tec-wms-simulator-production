import type { EnterpriseContextPayload } from "../../../shared/enterpriseContext/types";
import type { MentorMode, MentorPersonaId } from "../../../shared/aiMentor/types";
import { applyPreCallGuardrails } from "../guardrails";

const PERSONA_GREETING: Record<MentorPersonaId, { fr: string; en: string }> = {
  FLOOR_MENTOR: {
    fr: "Marc-André Tremblay ici.",
    en: "Marc-André Tremblay here.",
  },
  INVENTORY_ADVISOR: {
    fr: "Sophie Lachance, planificatrice.",
    en: "Sophie Lachance, demand planner.",
  },
  PERFORMANCE_COACH: {
    fr: "Élise Beaumont, directrice des opérations.",
    en: "Élise Beaumont, operations director.",
  },
  CRISIS_ADVISOR: {
    fr: "Élise Beaumont — contexte de crise.",
    en: "Élise Beaumont — crisis context.",
  },
  ERP_COACH: {
    fr: "Collègue opérationnel Concorde Logistics.",
    en: "Concorde Logistics operational colleague.",
  },
  QUALITY_GUIDE: {
    fr: "David Okonkwo, spécialiste qualité.",
    en: "David Okonkwo, quality specialist.",
  },
  PROCUREMENT_GUIDE: {
    fr: "Jean-Philippe Morin, acheteur senior.",
    en: "Jean-Philippe Morin, senior buyer.",
  },
};

const MODE_PROMPTS: Record<
  Exclude<MentorMode, "certification">,
  { fr: (ctx: ResponseContext) => string; en: (ctx: ResponseContext) => string }
> = {
  learning: {
    fr: (ctx) =>
      `${ctx.greeting} Avant de conseiller, dites-moi ce que vous observez dans le moniteur ou le cockpit pour l'étape « ${ctx.stepLabel} ». Quelle preuve documentaire consultez-vous dans la Fiche Mission?`,
    en: (ctx) =>
      `${ctx.greeting} Before I advise, tell me what you observe in the monitor or cockpit for step "${ctx.stepLabel}". What documentary evidence are you consulting in the Mission Sheet?`,
  },
  professional: {
    fr: (ctx) =>
      `${ctx.greeting} En mode professionnel, je ne donne pas la réponse directe. Quelle décision envisagez-vous pour « ${ctx.stepLabel} », et sur quelle preuve du moniteur ou du cockpit vous appuyez-vous?`,
    en: (ctx) =>
      `${ctx.greeting} In professional mode, I won't give the direct answer. What decision are you considering for "${ctx.stepLabel}", and what monitor or cockpit evidence supports it?`,
  },
  operational_colleague: {
    fr: (ctx) =>
      `${ctx.greeting} Je peux t'aider à raisonner, pas exécuter la mission. Pour « ${ctx.stepLabel} », qu'observes-tu dans le cockpit et la Fiche Mission?`,
    en: (ctx) =>
      `${ctx.greeting} I can help you reason, not execute the mission. For "${ctx.stepLabel}", what do you observe in the cockpit and Mission Sheet?`,
  },
  reflection: {
    fr: (ctx) =>
      `${ctx.greeting} Mission terminée — réfléchissons. Quel résultat métier avez-vous obtenu pour Concorde Logistics? Quels compromis avez-vous dû faire à l'étape « ${ctx.stepLabel} »?`,
    en: (ctx) =>
      `${ctx.greeting} Mission complete — let's reflect. What business result did you achieve for Concorde Logistics? What trade-offs did you face at step "${ctx.stepLabel}"?`,
  },
};

const CONCEPTUAL_RESPONSES: Array<{
  conceptPattern: RegExp;
  questionPattern: RegExp;
  fr: string;
  en: string;
}> = [
  {
    conceptPattern: /putaway|rangement/i,
    questionPattern: /pourquoi|why|what is|c'est quoi|explain|explique|\?/i,
    fr: "Dans un entrepôt réel, pourquoi crois-tu qu'une marchandise ne doit pas rester au quai après réception? Pense à la traçabilité, à la capacité du quai et à la disponibilité du stock.",
    en: "In a real warehouse, why do you think goods should not stay on the dock after receipt? Consider traceability, dock capacity, and stock availability.",
  },
  {
    conceptPattern: /\bLT01\b/i,
    questionPattern: /pourquoi|why|what is|c'est quoi|explain|explique|\?/i,
    fr: "LT01 sert à créer un mouvement de rangement en WM. Dans une opération réelle, cela permet de déplacer la marchandise du quai vers un emplacement de stockage traçable.",
    en: "LT01 creates a putaway movement in WM. In real operations, it moves goods from the dock to a traceable storage location.",
  },
  {
    conceptPattern: /\bMIGO\b|\bGR\b|goods receipt|réception/i,
    questionPattern: /pourquoi|why|what is|c'est quoi|explain|explique|\?/i,
    fr: "La réception matière confirme l'arrivée physique et lance la traçabilité stock. Quelle preuve de réception vois-tu déjà dans le cockpit?",
    en: "Goods receipt confirms physical arrival and starts stock traceability. What receipt evidence do you already see in the cockpit?",
  },
];

type ResponseContext = {
  greeting: string;
  stepLabel: string;
  scnCode: string;
};

export function generateDryRunResponse(input: {
  context: EnterpriseContextPayload;
  mode: MentorMode;
  personaId: MentorPersonaId;
  language: "fr" | "en";
  studentMessage: string;
}): string {
  const { context, mode, personaId, language, studentMessage } = input;
  if (mode === "certification") {
    return language === "fr"
      ? "Le collègue opérationnel est indisponible pour cette session."
      : "The operational colleague is unavailable for this session.";
  }

  const guardrail = applyPreCallGuardrails({
    message: studentMessage,
    mode,
    hintCount: 0,
    language,
  });
  if (guardrail.blocked && guardrail.message) {
    return guardrail.message;
  }

  for (const entry of CONCEPTUAL_RESPONSES) {
    if (entry.conceptPattern.test(studentMessage) && entry.questionPattern.test(studentMessage)) {
      return language === "fr" ? entry.fr : entry.en;
    }
  }

  const stepData = context.blocks.currentStep.data;
  const stepLabel =
    language === "fr"
      ? stepData.activeStepLabel?.fr ?? stepData.activeStepCode ?? "cette étape"
      : stepData.activeStepLabel?.en ?? stepData.activeStepCode ?? "this step";

  const greeting = PERSONA_GREETING[personaId][language];
  const ctx: ResponseContext = {
    greeting,
    stepLabel,
    scnCode: context.scnCode ?? "SCN",
  };

  const template = MODE_PROMPTS[mode][language](ctx);

  if (studentMessage.trim().length < 10) {
    const nudge =
      language === "fr"
        ? " Pouvez-vous préciser votre observation ou votre question?"
        : " Can you clarify your observation or question?";
    return template + nudge;
  }

  return template;
}
