/**
 * tRPC router for isolated M4/M5 formative exercises.
 * Soft gates only — no hard blocking via missionsBlocked / canAccessLearningModule /
 * checkpointEngine / assessments / certification.
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "./_core/trpc";
import { FORMATIVE_EXERCISE_IDS } from "../shared/formativeExercises";
import { resolveCohortScope } from "./cohortScope";

function mapErr(e: unknown): never {
  const err = e as { code?: string; message?: string };
  if (err.code === "FORBIDDEN") throw new TRPCError({ code: "FORBIDDEN", message: err.message });
  if (err.code === "NOT_FOUND") throw new TRPCError({ code: "NOT_FOUND", message: err.message });
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: err.message || "Formative exercise error",
  });
}

const exerciseIdSchema = z.enum(FORMATIVE_EXERCISE_IDS);

const teacherProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "teacher" && ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Accès réservé aux enseignants",
    });
  }
  return next({ ctx });
});

export const formativeExercisesRouter = router({
  catalog: protectedProcedure
    .input(z.object({ moduleId: z.union([z.literal(4), z.literal(5)]) }).optional())
    .query(async ({ input }) => {
      const { getFormativeExercisesForModule, FORMATIVE_EXERCISE_CATALOG } = await import(
        "../shared/formativeExercises"
      );
      if (input?.moduleId) return getFormativeExercisesForModule(input.moduleId);
      return Object.values(FORMATIVE_EXERCISE_CATALOG);
    }),

  listMine: protectedProcedure
    .input(z.object({ moduleId: z.number().int().min(4).max(5).optional() }).optional())
    .query(async ({ ctx, input }) => {
      const { listFormativeAttemptsForUser } = await import("./formativeExerciseService");
      return listFormativeAttemptsForUser(ctx.user.id, input?.moduleId);
    }),

  getMine: protectedProcedure
    .input(z.object({ exerciseId: exerciseIdSchema }))
    .query(async ({ ctx, input }) => {
      const { getFormativeAttempt, startOrResumeFormativeExercise } = await import(
        "./formativeExerciseService"
      );
      const { getFormativeExerciseMeta } = await import("../shared/formativeExercises");
      // Prefer start/resume so legacy in-progress rows get ordering seed persisted.
      let attempt = await getFormativeAttempt(ctx.user.id, input.exerciseId);
      if (attempt?.status === "in_progress") {
        attempt = await startOrResumeFormativeExercise(ctx.user.id, input.exerciseId);
      }
      return {
        meta: getFormativeExerciseMeta(input.exerciseId),
        attempt,
      };
    }),

  start: protectedProcedure
    .input(z.object({ exerciseId: exerciseIdSchema }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { startOrResumeFormativeExercise } = await import("./formativeExerciseService");
        return await startOrResumeFormativeExercise(ctx.user.id, input.exerciseId);
      } catch (e) {
        mapErr(e);
      }
    }),

  save: protectedProcedure
    .input(
      z.object({
        exerciseId: exerciseIdSchema,
        answers: z.record(z.string(), z.unknown()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { saveFormativeAnswers } = await import("./formativeExerciseService");
        return await saveFormativeAnswers({
          userId: ctx.user.id,
          exerciseId: input.exerciseId,
          answers: input.answers,
        });
      } catch (e) {
        mapErr(e);
      }
    }),

  submit: protectedProcedure
    .input(
      z.object({
        exerciseId: exerciseIdSchema,
        answers: z.record(z.string(), z.unknown()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { submitFormativeExercise } = await import("./formativeExerciseService");
        return await submitFormativeExercise({
          userId: ctx.user.id,
          exerciseId: input.exerciseId,
          answers: input.answers,
        });
      } catch (e) {
        mapErr(e);
      }
    }),

  restart: protectedProcedure
    .input(z.object({ exerciseId: exerciseIdSchema }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { restartFormativeExercise } = await import("./formativeExerciseService");
        return await restartFormativeExercise(ctx.user.id, input.exerciseId);
      } catch (e) {
        mapErr(e);
      }
    }),

  /** Professor cohort monitor — formative only, never official scoring */
  professorRoster: teacherProcedure
    .input(
      z.object({
        cohortId: z.number().int(),
        moduleId: z.union([z.literal(4), z.literal(5)]).optional(),
        exerciseId: exerciseIdSchema.optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const scope = await resolveCohortScope(
        ctx.user.id,
        input.cohortId,
        ctx.user.role === "admin",
      );
      const { listProfessorFormativeRoster } = await import("./formativeExerciseService");
      return listProfessorFormativeRoster({
        cohortId: input.cohortId,
        studentUserIds: scope.studentUserIds ?? [],
        moduleId: input.moduleId,
        exerciseId: input.exerciseId,
      });
    }),
});
