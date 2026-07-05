import type {
  MentorAvailability,
  MentorChatResponse,
  MentorEntryPoint,
  MentorPromptPreview,
} from "../../shared/aiMentor/types";
import { PROFESSIONAL_HINT_CAP } from "../../shared/aiMentor/types";
import {
  REFUSAL_CERTIFICATION,
  REFUSAL_COHORT_DISABLED,
} from "../../shared/aiMentor/refusalTemplates";
import { assembleEnterpriseContext } from "../enterpriseContext";
import { getProfileByUserId } from "../db";
import { isCohortAiMentorDisabled } from "./cohortSettings";
import { getMentorAuditTrail, logMentorInteraction } from "./auditLog";
import { applyPreCallGuardrails, scanResponseForLeaks } from "./guardrails";
import { getModeBlockReason, isMentorAvailable, resolveMentorMode } from "./modeRouter";
import { assemblePromptPreview } from "./promptAssembly";
import { selectPersona } from "./personas";
import { generateDryRunResponse } from "./providers/dryRunProvider";
import { generateLiveResponse } from "./providers/liveProvider";

const hintCounters = new Map<string, number>();

function sessionKey(runId: number, stepCode: string | null): string {
  return `${runId}:${stepCode ?? "none"}`;
}

export function isAiMentorGloballyEnabled(): boolean {
  return process.env.ENABLE_AI_MENTOR !== "false";
}

export function isAiMentorIntegrationReady(): boolean {
  return process.env.ENABLE_AI_MENTOR_LIVE === "true" && !!process.env.OPENAI_API_KEY;
}

type MentorRunContext = {
  runId: number;
  userId: number;
  isDemo: boolean;
  runStatus: "in_progress" | "completed" | "abandoned";
  moduleId: number;
  scnCode: string | null;
  language: "fr" | "en";
  reflectionRequested?: boolean;
};

export async function getMentorAvailability(ctx: MentorRunContext): Promise<MentorAvailability> {
  const profile = await getProfileByUserId(ctx.userId);
  const cohortDisabled = profile?.cohortId != null && isCohortAiMentorDisabled(profile.cohortId);
  const aiEnabled = isAiMentorGloballyEnabled() && !cohortDisabled;
  const mode = resolveMentorMode({
    isDemo: ctx.isDemo,
    runStatus: ctx.runStatus,
    reflectionRequested: ctx.reflectionRequested,
    aiMentorEnabled: aiEnabled,
  });
  const personaId = selectPersona(ctx.scnCode, ctx.moduleId);
  const available = aiEnabled && isMentorAvailable(mode);

  let stepCode: string | null = null;
  if (ctx.runId) {
    const context = await assembleEnterpriseContext({ userId: ctx.userId, runId: ctx.runId });
    stepCode = context.blocks.currentStep.data.activeStepCode;
  }
  const hintsUsed = hintCounters.get(sessionKey(ctx.runId, stepCode)) ?? 0;

  let reason: string | undefined;
  if (cohortDisabled) {
    reason = ctx.language === "fr" ? REFUSAL_COHORT_DISABLED.fr : REFUSAL_COHORT_DISABLED.en;
  } else if (!isAiMentorGloballyEnabled()) {
    reason = ctx.language === "fr" ? REFUSAL_COHORT_DISABLED.fr : REFUSAL_COHORT_DISABLED.en;
  } else if (!available) {
    reason = getModeBlockReason(mode, ctx.language)
      ?? (ctx.language === "fr" ? REFUSAL_CERTIFICATION.fr : REFUSAL_CERTIFICATION.en);
  }

  return {
    available,
    mode,
    reason,
    personaId,
    hintsRemaining: mode === "professional" ? Math.max(0, PROFESSIONAL_HINT_CAP - hintsUsed) : undefined,
    integrationReady: isAiMentorIntegrationReady(),
  };
}

export async function previewMentorPrompt(
  ctx: MentorRunContext,
  studentMessage?: string,
): Promise<MentorPromptPreview> {
  const availability = await getMentorAvailability(ctx);
  const context = await assembleEnterpriseContext({ userId: ctx.userId, runId: ctx.runId });

  const guardrail = applyPreCallGuardrails({
    message: studentMessage ?? "",
    mode: availability.mode,
    hintCount: PROFESSIONAL_HINT_CAP - (availability.hintsRemaining ?? PROFESSIONAL_HINT_CAP),
    language: ctx.language,
  });

  return assemblePromptPreview({
    context,
    mode: availability.mode,
    personaId: availability.personaId,
    language: ctx.language,
    studentMessage,
    blocked: !availability.available || guardrail.blocked,
    blockReason: guardrail.message ?? availability.reason,
  });
}

export async function handleMentorChat(
  ctx: MentorRunContext & { message: string; entryPoint: MentorEntryPoint },
): Promise<MentorChatResponse> {
  const availability = await getMentorAvailability(ctx);

  if (!availability.available) {
    const response: MentorChatResponse = {
      message: availability.reason ?? REFUSAL_CERTIFICATION.en,
      blocked: true,
      blockReason: availability.reason,
    };
    logMentorInteraction({
      userId: ctx.userId,
      runId: ctx.runId,
      scnCode: ctx.scnCode ?? "unknown",
      mode: availability.mode,
      personaId: availability.personaId,
      entryPoint: ctx.entryPoint,
      requestMessage: ctx.message,
      responseMessage: response.message,
      guardrailFlags: ["mode_blocked"],
    });
    return response;
  }

  const context = await assembleEnterpriseContext({ userId: ctx.userId, runId: ctx.runId });
  const stepCode = context.blocks.currentStep.data.activeStepCode;
  const key = sessionKey(ctx.runId, stepCode);
  const hintCount = hintCounters.get(key) ?? 0;

  const guardrail = applyPreCallGuardrails({
    message: ctx.message,
    mode: availability.mode,
    hintCount,
    language: ctx.language,
  });

  if (guardrail.blocked && guardrail.message) {
    logMentorInteraction({
      userId: ctx.userId,
      runId: ctx.runId,
      scnCode: ctx.scnCode ?? "unknown",
      mode: availability.mode,
      personaId: availability.personaId,
      entryPoint: ctx.entryPoint,
      requestMessage: ctx.message,
      responseMessage: guardrail.message,
      guardrailFlags: guardrail.flags,
    });
    return {
      message: guardrail.message,
      blocked: true,
      blockReason: guardrail.flags.join(", "),
      hintsRemaining: availability.hintsRemaining,
    };
  }

  const preview = assemblePromptPreview({
    context,
    mode: availability.mode,
    personaId: availability.personaId,
    language: ctx.language,
    studentMessage: ctx.message,
  });

  let responseMessage: string;
  let guardrailFlags: string[] = [];

  if (isAiMentorIntegrationReady()) {
    try {
      responseMessage = await generateLiveResponse({ preview, studentMessage: ctx.message });
      guardrailFlags = scanResponseForLeaks(responseMessage);
      if (guardrailFlags.length > 0) {
        responseMessage =
          ctx.language === "fr"
            ? "Je ne peux pas partager cette information directement. Consultez le moniteur, le cockpit et la Fiche Mission pour formuler votre propre analyse."
            : "I cannot share that information directly. Consult the monitor, cockpit, and Mission Sheet to form your own analysis.";
      }
    } catch {
      responseMessage = generateDryRunResponse({
        context,
        mode: availability.mode,
        personaId: availability.personaId,
        language: ctx.language,
        studentMessage: ctx.message,
      });
      guardrailFlags = ["live_fallback_dry_run"];
    }
  } else {
    responseMessage = generateDryRunResponse({
      context,
      mode: availability.mode,
      personaId: availability.personaId,
      language: ctx.language,
      studentMessage: ctx.message,
    });
    guardrailFlags = ["dry_run"];
  }

  const postLeakFlags = scanResponseForLeaks(responseMessage);
  if (postLeakFlags.length > 0) {
    guardrailFlags = [...guardrailFlags, ...postLeakFlags];
  }

  let hintsRemaining = availability.hintsRemaining;
  const isHintResponse =
    availability.mode === "professional" && !guardrail.blocked && postLeakFlags.length === 0;
  if (isHintResponse) {
    const nextCount = hintCount + 1;
    hintCounters.set(key, nextCount);
    hintsRemaining = Math.max(0, PROFESSIONAL_HINT_CAP - nextCount);
  }

  logMentorInteraction({
    userId: ctx.userId,
    runId: ctx.runId,
    scnCode: ctx.scnCode ?? "unknown",
    mode: availability.mode,
    personaId: availability.personaId,
    entryPoint: ctx.entryPoint,
    requestMessage: ctx.message,
    responseMessage,
    hintNumber: isHintResponse ? hintCount + 1 : undefined,
    guardrailFlags,
  });

  return {
    message: responseMessage,
    hintsRemaining,
    suggestedSurfaces: ["fiche", "oil"],
  };
}

export function getAuditTrailForRun(runId: number) {
  return getMentorAuditTrail(runId);
}

/** Test helper */
export function resetMentorSessionState(): void {
  hintCounters.clear();
}
