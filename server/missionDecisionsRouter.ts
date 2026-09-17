import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "./_core/trpc";
import { resolveCohortScope } from "./cohortScope";

const teacherProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "teacher" && ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Accès réservé aux enseignants" });
  }
  return next({ ctx });
});

export const missionDecisionsRouter = router({
  submit: protectedProcedure
    .input(
      z.object({
        runId: z.number().int(),
        step: z.string().min(1),
        optionId: z.string().min(1),
        responseMs: z.number().int().nonnegative().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { submitMissionDecision } = await import("./missionDecisionService");
      const lang = (ctx.req.headers["accept-language"] ?? "fr").toLowerCase();
      return submitMissionDecision({
        userId: ctx.user.id,
        role: ctx.user.role,
        runId: input.runId,
        step: input.step,
        optionId: input.optionId,
        responseMs: input.responseMs,
        isEn: lang.startsWith("en"),
      });
    }),

  state: protectedProcedure
    .input(z.object({ runId: z.number().int(), step: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const runMod = await import("./db");
      const run = await runMod.getRunById(input.runId);
      if (!run) throw new TRPCError({ code: "NOT_FOUND" });
      if (run.userId !== ctx.user.id && ctx.user.role !== "teacher" && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const { getMissionDecisionState } = await import("./missionDecisionService");
      return getMissionDecisionState(input.runId, input.step);
    }),

  professorRoster: teacherProcedure
    .input(
      z.object({
        cohortId: z.number().int(),
        moduleId: z.number().int().min(1).max(3).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const scope = await resolveCohortScope(
        ctx.user.id,
        input.cohortId,
        ctx.user.role === "admin",
      );
      const { listProfessorMissionDecisions } = await import("./missionDecisionService");
      return listProfessorMissionDecisions({
        cohortId: input.cohortId,
        studentUserIds: scope.studentUserIds ?? [],
        moduleId: input.moduleId,
      });
    }),
});
