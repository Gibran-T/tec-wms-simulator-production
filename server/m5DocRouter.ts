/**
 * tRPC namespace m5Doc.* — documentary supervision profile only.
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "./_core/trpc";
import { completeRun, getRunById, getScenarioById } from "./db";
import {
  canAccessM5DocAsActor,
  isM5DocFeatureEnabled,
  isM5DocInitialState,
  M5_DOC_INTERACTION_MODEL,
  type M5DocScnCode,
  type SubmitMode,
} from "../shared/m5Doc/types";
import { M5_DOC_INTERACTION_ORDER, getInteractionDef } from "../shared/m5Doc/interactionsCatalog";
import { deriveM5DocSessionEvidenceV2 } from "../shared/m5Doc/evidenceV2";
import { loadM5DocState, saveM5DocState } from "./m5Doc/persistence";
import { submitM5DocInteraction } from "./m5Doc/engine";
import { buildM5DocProfessorView } from "./m5Doc/professorView";
import { evaluateM5DocGoldV1 } from "./m5Doc/goldDocGates";
import { computeFinalScore } from "../shared/m5Doc/scoringPure";

const submitModeSchema = z.enum(["OFFICIAL", "FORMATIVE", "REVIEW"]);

function mapDocError(code: string, message: string): never {
  if (
    code === "FORBIDDEN_PROFILE" ||
    code === "FEATURE_DISABLED" ||
    code === "REVIEW_ONLY" ||
    code === "DOC_STUDENT_NOT_ALLOWLISTED"
  ) {
    throw new TRPCError({ code: "FORBIDDEN", message: `${code}: ${message}` });
  }
  if (code === "SCORE_ONCE_LOCKED" || code === "ORDRE_INTERACTION") {
    throw new TRPCError({ code: "CONFLICT", message: `${code}: ${message}` });
  }
  if (
    code === "PAYLOAD_INVALIDE" ||
    code === "MATRIX_PAYLOAD_INVALIDE" ||
    code === "HANDOVER_PAYLOAD_INVALIDE"
  ) {
    throw new TRPCError({ code: "BAD_REQUEST", message: `${code}: ${message}` });
  }
  throw new TRPCError({ code: "BAD_REQUEST", message: `${code}: ${message}` });
}

async function assertDocRunAccess(
  runId: number,
  user: { id: number; role: string; email?: string | null; openId?: string | null },
) {
  if (!isM5DocFeatureEnabled()) {
    mapDocError("FEATURE_DISABLED", "ENABLE_M5_DOC_SUPERVISION is not true");
  }

  // Allowlist before DB read for students — empty list ⇒ no student DOC access.
  if (!canAccessM5DocAsActor(user)) {
    mapDocError("DOC_STUDENT_NOT_ALLOWLISTED", "Student not on M5_DOC_STUDENT_ALLOWLIST");
  }

  const run = await getRunById(runId);
  if (!run) throw new TRPCError({ code: "NOT_FOUND", message: "Run not found" });
  if (run.userId !== user.id && user.role !== "teacher" && user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Not your run" });
  }

  const scenario = await getScenarioById(run.scenarioId);
  const initial = scenario?.initialStateJson;
  if (!isM5DocInitialState(initial)) {
    mapDocError("FORBIDDEN_PROFILE", "Run is not supervision-doc-v1");
  }

  // Immutability: model fixed at start via scenario seed — refuse if tampered
  if (initial.interactionModel !== M5_DOC_INTERACTION_MODEL) {
    mapDocError("FORBIDDEN_PROFILE", "interactionModel mismatch");
  }

  return { run, scenario, initial };
}

export const m5DocRouter = router({
  getState: protectedProcedure
    .input(z.object({ runId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const { initial } = await assertDocRunAccess(input.runId, ctx.user);
      const state = await loadM5DocState(input.runId, initial.scnCode as M5DocScnCode);
      const expectedId = M5_DOC_INTERACTION_ORDER[Math.min(state.currentInteractionIndex, M5_DOC_INTERACTION_ORDER.length - 1)];
      const { finalScore, zoneScores } = computeFinalScore(state);
      return {
        state,
        expectedInteractionId: expectedId,
        finalScore,
        zoneScores,
        featureEnabled: true,
        goldDoc: evaluateM5DocGoldV1(state),
      };
    }),

  getInteraction: protectedProcedure
    .input(
      z.object({
        runId: z.number().int().positive(),
        interactionId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { initial } = await assertDocRunAccess(input.runId, ctx.user);
      const state = await loadM5DocState(input.runId, initial.scnCode as M5DocScnCode);
      const def = getInteractionDef(input.interactionId);
      if (!def) throw new TRPCError({ code: "NOT_FOUND", message: "Unknown interaction" });

      const alreadyScored = !!state.officialScores[def.id];
      const expectedId =
        M5_DOC_INTERACTION_ORDER[Math.min(state.currentInteractionIndex, M5_DOC_INTERACTION_ORDER.length - 1)];
      const canSubmitOfficial =
        !alreadyScored &&
        (def.id === expectedId || (def.scoringZone === "PRE" && !alreadyScored));

      return {
        def: {
          id: def.id,
          stepCode: def.stepCode,
          phase: def.phase,
          format: def.format,
          titleFr: def.titleFr,
          promptFr: def.promptFr,
          options: def.options ?? [],
          competences: def.competences,
          maxPoints: def.maxPoints,
        },
        inheritance: {
          demands: state.portfolio.demands,
          gaps: state.portfolio.gaps,
          interventions: state.portfolio.interventions,
          journalView: state.journalView,
          arbitration: state.arbitration,
        },
        alreadyScored,
        canSubmitOfficial,
        reviewOnly: false,
        formativeLatest: state.formativeLatest[def.id] ?? null,
        officialScore: state.officialScores[def.id] ?? null,
      };
    }),

  submitInteraction: protectedProcedure
    .input(
      z.object({
        runId: z.number().int().positive(),
        interactionId: z.string(),
        payload: z.unknown(),
        mode: submitModeSchema,
        idempotencyKey: z.string().min(8).max(128).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { initial } = await assertDocRunAccess(input.runId, ctx.user);

      const g = globalThis as unknown as {
        __m5DocIdem?: Map<string, unknown>;
        __m5DocLocks?: Map<string, Promise<void>>;
      };
      g.__m5DocIdem ??= new Map();
      g.__m5DocLocks ??= new Map();

      // Idempotency for identical client keys (double-click).
      const idemKey = input.idempotencyKey
        ? `m5doc:${input.runId}:${input.interactionId}:${input.idempotencyKey}`
        : null;
      if (idemKey && g.__m5DocIdem.has(idemKey)) {
        return g.__m5DocIdem.get(idemKey);
      }

      // Serialize concurrent OFFICIAL submits for the same interaction.
      const lockKey = `lock:${input.runId}:${input.interactionId}:${input.mode}`;
      while (g.__m5DocLocks.has(lockKey)) {
        await g.__m5DocLocks.get(lockKey);
      }
      let release!: () => void;
      const lockPromise = new Promise<void>((resolve) => {
        release = resolve;
      });
      g.__m5DocLocks.set(lockKey, lockPromise);

      try {
        const state = await loadM5DocState(input.runId, initial.scnCode as M5DocScnCode);
        const result = submitM5DocInteraction({
          state,
          interactionId: input.interactionId,
          payload: input.payload,
          mode: input.mode as SubmitMode,
          actorRole: ctx.user.role === "teacher" || ctx.user.role === "admin" ? ctx.user.role : "student",
        });

        if (!result.ok) {
          mapDocError(result.code, result.message);
        }

        await saveM5DocState(result.state);
        const { finalScore, zoneScores } = computeFinalScore(result.state);

        // Close envelope run when documentary handover is transmitted (phase CLOSED).
        if (result.state.phase === "CLOSED" && result.state.handover.status === "Transmis") {
          const latest = await getRunById(input.runId);
          if (latest && latest.status !== "completed") {
            await completeRun(input.runId);
          }
        }

        const response = {
          accepted: true,
          structuralOk: result.structuralOk,
          correct: result.correct,
          combinationOk: result.combinationOk,
          tags: result.tags,
          points: result.points,
          maxPoints: result.maxPoints,
          feedbackCode: result.feedbackCode,
          officialConsumed: result.officialConsumed,
          finalScore,
          zoneScores,
          phase: result.state.phase,
          currentInteractionIndex: result.state.currentInteractionIndex,
          handoverStatus: result.state.handover.status,
        };

        if (idemKey) g.__m5DocIdem.set(idemKey, response);
        return response;
      } finally {
        g.__m5DocLocks.delete(lockKey);
        release();
      }
    }),

  getEvidence: protectedProcedure
    .input(z.object({ runId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const { initial } = await assertDocRunAccess(input.runId, ctx.user);
      const state = await loadM5DocState(input.runId, initial.scnCode as M5DocScnCode);
      return deriveM5DocSessionEvidenceV2(state);
    }),

  getProfessorView: protectedProcedure
    .input(z.object({ runId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "teacher" && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Teacher/admin only" });
      }
      const { initial } = await assertDocRunAccess(input.runId, ctx.user);
      const state = await loadM5DocState(input.runId, initial.scnCode as M5DocScnCode);
      return buildM5DocProfessorView(state);
    }),
});
