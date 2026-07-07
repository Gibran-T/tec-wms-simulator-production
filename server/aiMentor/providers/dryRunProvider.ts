import type { EnterpriseContextPayload } from "../../../shared/enterpriseContext/types";
import type { MentorMode, MentorPersonaId } from "../../../shared/aiMentor/types";
import { getEnterpriseEmployeeForLanguage } from "../../../shared/aiMentor/enterpriseEmployee";
import { applyPreCallGuardrails } from "../guardrails";

const MODE_PROMPTS: Record<
  Exclude<MentorMode, "certification">,
  { fr: (ctx: ResponseContext) => string; en: (ctx: ResponseContext) => string }
> = {
  learning: {
    fr: (ctx) =>
      `${ctx.opening} Avant de décider, dites-moi ce que vous observez dans notre moniteur ou cockpit pour « ${ctx.stepLabel} ». Quelle preuve consultez-vous dans la Fiche Mission?`,
    en: (ctx) =>
      `${ctx.opening} Before deciding, tell me what you observe in our monitor or cockpit for "${ctx.stepLabel}". What evidence are you reviewing in the Mission Sheet?`,
  },
  professional: {
    fr: (ctx) =>
      `${ctx.opening} Je ne peux pas prendre la décision à votre place. Qu'envisagez-vous pour « ${ctx.stepLabel} », et quelle preuve de notre cockpit vous oriente?`,
    en: (ctx) =>
      `${ctx.opening} I cannot make the decision for you. What are you considering for "${ctx.stepLabel}", and what evidence from our cockpit guides you?`,
  },
  operational_colleague: {
    fr: (ctx) =>
      `${ctx.opening} Voyons ensemble ce que vous observez dans notre cockpit pour « ${ctx.stepLabel} ». Avant de décider, regardons les éléments disponibles dans la Fiche Mission.`,
    en: (ctx) =>
      `${ctx.opening} Let's review what you observe in our cockpit for "${ctx.stepLabel}". Before deciding, look at what's available in the Mission Sheet.`,
  },
  reflection: {
    fr: (ctx) =>
      `${ctx.opening} Mission terminée — réfléchissons à notre résultat chez Concorde Logistics. Quels compromis avez-vous dû faire à « ${ctx.stepLabel} »?`,
    en: (ctx) =>
      `${ctx.opening} Mission complete — let's reflect on our result at Concorde Logistics. What trade-offs did you face at "${ctx.stepLabel}"?`,
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
    fr: "Dans notre entrepôt, pourquoi crois-tu qu'une marchandise ne doit pas rester au quai après réception? Pense à notre traçabilité, à la capacité du quai et à la disponibilité du stock.",
    en: "In our warehouse, why do you think goods should not stay on the dock after receipt? Consider our traceability, dock capacity, and stock availability.",
  },
  {
    conceptPattern: /\bLT01\b/i,
    questionPattern: /pourquoi|why|what is|c'est quoi|explain|explique|\?/i,
    fr: "LT01 sert à créer un mouvement de rangement en WM. Dans nos opérations, cela permet de déplacer la marchandise du quai vers un emplacement de stockage traçable.",
    en: "LT01 creates a putaway movement in WM. In our operations, it moves goods from the dock to a traceable storage location.",
  },
  {
    conceptPattern: /\bMIGO\b|\bGR\b|goods receipt|réception/i,
    questionPattern: /pourquoi|why|what is|c'est quoi|explain|explique|\?/i,
    fr: "La réception matière confirme l'arrivée physique et lance notre traçabilité stock. Quelle preuve de réception vois-tu déjà dans le cockpit?",
    en: "Goods receipt confirms physical arrival and starts our stock traceability. What receipt evidence do you already see in the cockpit?",
  },
];

type ResponseContext = {
  opening: string;
  stepLabel: string;
  scnCode: string;
};

function buildEmployeeOpening(personaId: MentorPersonaId, language: "fr" | "en"): string {
  const employee = getEnterpriseEmployeeForLanguage(personaId, language);
  return language === "fr"
    ? `Je comprends votre question. ${employee.name}, ${employee.title}.`
    : `I understand your question. ${employee.name}, ${employee.title}.`;
}

export function generateDryRunResponse(input: {
  context: EnterpriseContextPayload;
  mode: MentorMode;
  personaId: MentorPersonaId;
  language: "fr" | "en";
  studentMessage: string;
}): string {
  const { context, mode, personaId, language, studentMessage } = input;
  const employee = getEnterpriseEmployeeForLanguage(personaId, language);

  if (mode === "certification") {
    return language === "fr"
      ? `${employee.firstName} n'est pas disponible pour le moment.`
      : `${employee.firstName} is not available right now.`;
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

  const ctx: ResponseContext = {
    opening: buildEmployeeOpening(personaId, language),
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
