/**
 * tRPC router for integrated assessments (student + professor).
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "./_core/trpc";

function mapErr(e: unknown): never {
  const err = e as { code?: string; message?: string };
  const code = err.code;
  if (code === "FORBIDDEN") throw new TRPCError({ code: "FORBIDDEN", message: err.message });
  if (code === "NOT_FOUND") throw new TRPCError({ code: "NOT_FOUND", message: err.message });
  if (code === "CONFLICT") throw new TRPCError({ code: "CONFLICT", message: err.message });
  if (code === "PRECONDITION_FAILED") {
    throw new TRPCError({ code: "PRECONDITION_FAILED", message: err.message });
  }
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: err.message || "Assessment error",
  });
}

const teacherProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "teacher" && ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Accès réservé aux enseignants",
    });
  }
  return next({ ctx });
});

export const assessmentsRouter = router({
  /** Student hub */
  hub: protectedProcedure.query(async ({ ctx }) => {
    const { listStudentAssessmentHub } = await import("./assessmentService");
    return listStudentAssessmentHub(ctx.user.id);
  }),

  start: protectedProcedure
    .input(z.object({ assessmentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { startAssessmentAttempt } = await import("./assessmentService");
        return await startAssessmentAttempt({
          userId: ctx.user.id,
          assessmentId: input.assessmentId,
          email: ctx.user.email,
        });
      } catch (e) {
        mapErr(e);
      }
    }),

  getAttempt: protectedProcedure
    .input(z.object({ attemptId: z.number() }))
    .query(async ({ ctx, input }) => {
      const { getAttemptForStudent } = await import("./assessmentService");
      const data = await getAttemptForStudent({
        attemptId: input.attemptId,
        userId: ctx.user.id,
      });
      if (!data) throw new TRPCError({ code: "NOT_FOUND" });
      return data;
    }),

  autosave: protectedProcedure
    .input(
      z.object({
        attemptId: z.number(),
        questionId: z.number(),
        selectedOptionId: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { autosaveAssessmentResponse } = await import("./assessmentService");
        return await autosaveAssessmentResponse({
          attemptId: input.attemptId,
          userId: ctx.user.id,
          questionId: input.questionId,
          selectedOptionId: input.selectedOptionId,
        });
      } catch (e) {
        mapErr(e);
      }
    }),

  submit: protectedProcedure
    .input(z.object({ attemptId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { submitAssessmentAttempt } = await import("./assessmentService");
        return await submitAssessmentAttempt({
          attemptId: input.attemptId,
          userId: ctx.user.id,
        });
      } catch (e) {
        mapErr(e);
      }
    }),

  // ── Professor ─────────────────────────────────────────────────────────────
  professorList: teacherProcedure.query(async () => {
    const { professorListAssessments } = await import("./assessmentService");
    return professorListAssessments();
  }),

  professorUpsertRelease: teacherProcedure
    .input(
      z.object({
        releaseId: z.number().optional(),
        assessmentId: z.number(),
        cohortId: z.number().nullable(),
        releaseLevel: z.enum([
          "unpublished",
          "visible_pending",
          "released_cohort",
          "released_students",
          "scheduled",
          "closed",
          "cancelled",
        ]),
        studentUserIds: z.array(z.number()).optional(),
        opensAt: z.date().nullable().optional(),
        closesAt: z.date().nullable().optional(),
        note: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { professorUpsertRelease } = await import("./assessmentService");
      return professorUpsertRelease({
        actorUserId: ctx.user.id,
        ...input,
      });
    }),

  professorRoster: teacherProcedure
    .input(
      z.object({
        assessmentId: z.number(),
        cohortId: z.number().nullable().optional(),
      })
    )
    .query(async ({ input }) => {
      const { professorAssessmentRoster } = await import("./assessmentService");
      return professorAssessmentRoster(input);
    }),

  professorAttemptDetail: teacherProcedure
    .input(z.object({ attemptId: z.number() }))
    .query(async ({ input }) => {
      const { professorGetAttemptDetail } = await import("./assessmentService");
      const data = await professorGetAttemptDetail(input.attemptId);
      if (!data) throw new TRPCError({ code: "NOT_FOUND" });
      return data;
    }),

  professorAuthorizeRetake: teacherProcedure
    .input(
      z.object({
        assessmentId: z.number(),
        userId: z.number(),
        opensAt: z.date().nullable().optional(),
        closesAt: z.date().nullable().optional(),
        note: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { professorAuthorizeRetake } = await import("./assessmentService");
      return professorAuthorizeRetake({
        actorUserId: ctx.user.id,
        ...input,
      });
    }),

  professorRecordPractical: teacherProcedure
    .input(
      z.object({
        assessmentId: z.number(),
        userId: z.number(),
        cohortId: z.number().nullable().optional(),
        taskFr: z.string().min(1),
        resultFr: z.string().min(1),
        note: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { professorRecordPracticalEvidence } = await import(
        "./assessmentService"
      );
      return professorRecordPracticalEvidence({
        actorUserId: ctx.user.id,
        ...input,
      });
    }),

  professorRecalculate: teacherProcedure
    .input(
      z.object({
        attemptId: z.number(),
        reason: z.string().min(3),
        annulQuestionIds: z.array(z.number()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { professorRecalculateAttempt } = await import("./assessmentService");
      return professorRecalculateAttempt({
        attemptId: input.attemptId,
        actorUserId: ctx.user.id,
        reason: input.reason,
        annulQuestionIds: input.annulQuestionIds,
      });
    }),

  professorAnalysis: teacherProcedure
    .input(z.object({ assessmentId: z.number() }))
    .query(async ({ input }) => {
      const { professorAssessmentAnalysis } = await import("./assessmentService");
      return professorAssessmentAnalysis(input.assessmentId);
    }),

  /**
   * RC13.1 — Read-only professor preview of the full assessment (no attempts created).
   */
  professorPreview: teacherProcedure
    .input(z.object({ assessmentId: z.number() }))
    .query(async ({ input }) => {
      const { professorPreviewAssessment } = await import("./assessmentService");
      const data = await professorPreviewAssessment(input.assessmentId);
      if (!data) throw new TRPCError({ code: "NOT_FOUND" });
      return data;
    }),

  /**
   * RC13.1 — Read-only question bank browser (no edits).
   */
  professorQuestionBank: teacherProcedure
    .input(
      z
        .object({
          assessmentId: z.number().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const { professorQuestionBank } = await import("./assessmentService");
      return professorQuestionBank({
        assessmentId: input?.assessmentId,
      });
    }),

  professorConfirmResult: teacherProcedure
    .input(z.object({ attemptId: z.number(), note: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const { getDb } = await import("./db");
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const { assessmentAttempts, assessmentGradeAudits } = await import(
        "../drizzle/schema"
      );
      const { eq } = await import("drizzle-orm");
      const [attempt] = await db
        .select()
        .from(assessmentAttempts)
        .where(eq(assessmentAttempts.id, input.attemptId))
        .limit(1);
      if (!attempt) throw new TRPCError({ code: "NOT_FOUND" });
      await db
        .update(assessmentAttempts)
        .set({ professorReviewStatus: "confirmed" })
        .where(eq(assessmentAttempts.id, input.attemptId));
      await db.insert(assessmentGradeAudits).values({
        attemptId: input.attemptId,
        actorUserId: ctx.user.id,
        previousScore: attempt.finalScore,
        updatedScore: attempt.finalScore,
        reason: input.note || "Confirmation du résultat automatique",
        detailsJson: { action: "confirm" },
      });
      return { ok: true };
    }),
});
