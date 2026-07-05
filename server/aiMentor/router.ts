import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { assertTeacherOwnsCohort } from "../cohortScope";
import { getRunById, getScenarioById } from "../db";
import { resolveScenarioScnCode } from "../canonicalScenarios";
import {
  getCohortAiMentorDisabled,
  setCohortAiMentorDisabled,
} from "./cohortSettings";
import {
  getMentorAvailability,
  handleMentorChat,
  getAuditTrailForRun,
  previewMentorPrompt,
} from "./mentorService";

function teacherOnly(user: { role: string }) {
  if (user.role !== "teacher" && user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
}

function assertRunAccess(
  run: { userId: number },
  user: { id: number; role: string },
) {
  if (run.userId !== user.id && user.role !== "teacher" && user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
}

export const mentorRouter = router({
  getAvailability: protectedProcedure
    .input(z.object({
      runId: z.number(),
      language: z.enum(["fr", "en"]).default("fr"),
      reflectionRequested: z.boolean().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const run = await getRunById(input.runId);
      if (!run) throw new TRPCError({ code: "NOT_FOUND" });
      assertRunAccess(run, ctx.user);
      const scenario = await getScenarioById(run.scenarioId);
      const scnCode = scenario ? resolveScenarioScnCode(scenario) : null;

      return getMentorAvailability({
        runId: input.runId,
        userId: ctx.user.id,
        isDemo: run.isDemo,
        runStatus: run.status,
        moduleId: scenario?.moduleId ?? 1,
        scnCode,
        language: input.language,
        reflectionRequested: input.reflectionRequested,
      });
    }),

  previewPrompt: protectedProcedure
    .input(z.object({
      runId: z.number(),
      language: z.enum(["fr", "en"]).default("fr"),
      message: z.string().optional(),
      reflectionRequested: z.boolean().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const run = await getRunById(input.runId);
      if (!run) throw new TRPCError({ code: "NOT_FOUND" });
      assertRunAccess(run, ctx.user);

      if (ctx.user.role === "student" && !run.isDemo && run.status === "in_progress") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Prompt preview restricted during certification evaluation",
        });
      }

      const scenario = await getScenarioById(run.scenarioId);
      const scnCode = scenario ? resolveScenarioScnCode(scenario) : null;

      return previewMentorPrompt({
        runId: input.runId,
        userId: ctx.user.id,
        isDemo: run.isDemo,
        runStatus: run.status,
        moduleId: scenario?.moduleId ?? 1,
        scnCode,
        language: input.language,
        reflectionRequested: input.reflectionRequested,
      }, input.message);
    }),

  ask: protectedProcedure
    .input(z.object({
      runId: z.number(),
      message: z.string().min(1).max(2000),
      language: z.enum(["fr", "en"]).default("fr"),
      entryPoint: z.enum(["mission_control", "oil_panel_f", "debrief"]).default("mission_control"),
      reflectionRequested: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const run = await getRunById(input.runId);
      if (!run) throw new TRPCError({ code: "NOT_FOUND" });
      assertRunAccess(run, ctx.user);

      const scenario = await getScenarioById(run.scenarioId);
      const scnCode = scenario ? resolveScenarioScnCode(scenario) : null;

      return handleMentorChat({
        runId: input.runId,
        userId: ctx.user.id,
        isDemo: run.isDemo,
        runStatus: run.status,
        moduleId: scenario?.moduleId ?? 1,
        scnCode,
        language: input.language,
        reflectionRequested: input.reflectionRequested,
        message: input.message,
        entryPoint: input.entryPoint,
      });
    }),

  getAuditTrail: protectedProcedure
    .input(z.object({ runId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "teacher" && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const run = await getRunById(input.runId);
      if (!run) throw new TRPCError({ code: "NOT_FOUND" });
      return getAuditTrailForRun(input.runId);
    }),

  getCohortSetting: protectedProcedure
    .input(z.object({ cohortId: z.number() }))
    .query(async ({ ctx, input }) => {
      teacherOnly(ctx.user);
      await assertTeacherOwnsCohort(
        ctx.user.id,
        input.cohortId,
        ctx.user.role === "admin",
      );
      return { disabled: getCohortAiMentorDisabled(input.cohortId) };
    }),

  setCohortAiDisabled: protectedProcedure
    .input(z.object({ cohortId: z.number(), disabled: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      teacherOnly(ctx.user);
      await assertTeacherOwnsCohort(
        ctx.user.id,
        input.cohortId,
        ctx.user.role === "admin",
      );
      setCohortAiMentorDisabled(input.cohortId, input.disabled);
      return { disabled: input.disabled };
    }),
});
