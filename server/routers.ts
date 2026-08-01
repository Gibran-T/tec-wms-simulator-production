import { TRPCError } from "@trpc/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { cohortFilterInput, resolveCohortScope, assertTeacherOwnsCohort } from "./cohortScope";
import {
  addCycleCount,
  addPutawayRecord,
  addScoringEvent,
  addTransaction,
  completeRun,
  createAssignment,
  createCohort,
  createScenario,
  getAllAssignments,
  getAllBinCapacities,
  getAllModuleProgressForMonitor,
  getAllRunsForMonitor,
  getAllScenarios,
  getAllSkus,
  getAllBins,
  getAssignmentsForStudent,
  getAllCohorts,
  getCohortsByTeacher,
  getCycleCountsByRun,
  getModuleProgressByUser,
  getModuleProgressWithModules,
  getPassedModuleIds,
  getProgressByRun,
  getPutawayByRun,
  getRunById,
  getRunsByUser,
  getScenarioById,
  getScoringEventsByRun,
  getTransactionsByRun,
  markStepComplete,
  postTransaction,
  resolveCycleCount,
  resolveAllCycleCountsByRun,
  startRun,
  updateUserRole,
  upsertModuleProgress,
  getModuleProgressRow,
  setTeacherValidated,
  getAllUsers,
  getProfileByUserId,
  upsertProfile,
  resetRun,
  getPreAuthorizedEmails,
  addPreAuthorizedEmail,
  removePreAuthorizedEmail,
  getUserByEmail,
  createLocalUser,
  updateUserPassword,
  listStudents,
  setStudentActive,
  updateStudentNotes,
  assignStudentToCohort,
  getStudentStats,
  getQuizByModule,
  getQuizWithQuestions,
  getQuizAttemptsByUser,
  getBestQuizAttempt,
  saveQuizAttempt,
  checkM1QuizPassed,
  checkAllM1ScenariosCompleted,
  checkM1ComplianceValidated,
  checkNoUnresolvedBlockers,
  getSilverCertificationStatus,
  getGoldCertificationStatus,
  isGoldUnlockEnabled,
  unlockSilverCertification,
  unlockGoldCertification,
  addInventoryCount,
  addInventoryAdjustment,
  getInventoryAdjustmentsByRun,
  getInventoryCountsByRun,
  addReplenishmentSuggestion,
  getReplenishmentSuggestionsByRun,
  upsertInventoryCount,
  upsertReplenishmentSuggestion,
  addKpiSnapshot,
  addKpiInterpretation,
  getKpiInterpretationsByRun,
  pickLatestKpiInterpretationsByKey,
  getKpiSnapshotByRun,
  abandonAllInProgressRunsForUser,
} from "./db";
import {
  computeModuleCheckpointSnapshot,
  isCheckpointEngineEnabled,
  isCheckpointModule,
  isModuleReadyForTeacherValidation,
  recomputeAllModuleCheckpoints,
  recomputeModuleCheckpoint,
} from "./checkpointEngine";
import {
  calculateBinLoad,
  calculateInventory,
  calculateProgressPct,
  calculateProgressPctAllModules,
  canExecuteStep,
  canIssueStock,
  checkCompliance,
  getNextRequiredStep,
  getNextRequiredStepAllModules,
  getEffectiveM2Steps,
  isM2PutawayStepComplete,
  MODULE1_STEPS,
  MODULE2_STEPS,
  MODULE4_STEPS,
  MODULE5_STEPS,
  M4_STEP_MAX,
  M3_STEP_MAX,
  M3_STEP_MAX_SCALED,
  M3_011_STEP_MAX,
  M3_REPLENISH_SCORING_EVENTS,
  getEffectiveM3Steps,
  getM3StepsForRun,
  hasM3LegacyPipelineEvidence,
  isM3ReplenishmentOnlyScenario,
  getM3StepAwardPoints,
  getM3ReplenishStepDisplayMax,
  scoreM3ReplenishQtyFromSuggestions,
  buildM3011ReplenishScoringEvents,
  validateReplenishmentSubmission,
  validatePutaway,
  validateGRZone,
  validatePutawayM1Zone,
  validatePickingM1Zone,
  validateGIZone,
  RECEPTION_BINS,
  STOCKAGE_BINS,
  PICKING_BINS,
  EXPEDITION_BINS,
  RESERVE_BINS,
  calculateKpis,
  scoreKpiInterpretation,
  buildM2FifoLotCatalog,
  canExecuteStepM2,
  validateM2FifoPick,
  validateM2FifoPickZone,
  canExecuteStepM3,
  computeReplenishmentSuggestion,
  formatReplenishReasonWithStudentQty,
  getCycleCountTargets,
  getM3VarianceThreshold,
  getReplenishmentParamsFromSeed,
  validateAdjustment,
  validateAdjQuantity,
  validateM1AdjPosting,
  validateCycleCountEntriesComplete,
  validateCycleCountListComplete,
  validateCycleCountReconComplete,
  validateCcReconSubmission,
  evaluateCycleCountReconProgress,
  getCcReconTargetStatus,
  validateM3Compliance,
  validateM4Compliance,
  validateReplenishmentComplete,
  validateVarianceEntry,
  scoreM5Decision,
  getEffectiveM1Steps,
  detectScn003AtpShortage,
  resolveScn003CorrectiveStepCode,
  getScn003AtpShortageMessage,
  isScn003CorrectiveReplenishmentRequired,
  getEffectiveM5Steps,
  getM5ContractFromSeed,
  getM5KpiDataFromSeed,
  getM5CycleCountTargets,
  deriveM5KpiFromRunEvidence,
  buildM5SessionEvidenceFromRunState,
  validateM5KpiSubmission,
  formatM5KpiEvidenceSource,
  assertM5VarianceGate,
  validateM5Reception,
  validateM5Putaway,
  validateM5Compliance,
  hasM5VarianceContract,
  getM4KpiDataFromSeed,
  CANONICAL_M4_KPI_DATA,
  type KpiData,
  type M4InitialStateJson,
  type M5InitialStateJson,
} from "./rulesEngine";
import { resolveScenarioScnCode } from "./canonicalScenarios";
import { calculateTotalScore, getM2StockAccuracyPoints, getScoringRule, getScoreLabel } from "./scoringEngine";
import { getScn004StepMaxPoints, isScn004Scenario } from "./scn004";
import { getScn005StepMaxPoints, isScn005Scenario } from "./scn005";
import {
  getScn007NextActionHint,
  getScn007StepMaxPoints,
  getScn007StockAccuracyPoints,
  isScn007PutawayComplete,
  isScn007Scenario,
  projectInventoryAfterPutaway,
  projectTransactionsAfterPutaway,
  validateScn007PutawayContract,
} from "./scn007";
import { computeRosterKpis, mergeRosterIntoStudentRanking } from "./powerAnalyticsRoster";
import { COOKIE_NAME } from "@shared/const";
import { buildLearningFeedbackPayload } from "@shared/learningFeedbackPayload";
import { computeModulePassResult, getModuleScenarioPassThreshold } from "@shared/moduleThresholds";
import { canAccessLearningModule } from "@shared/moduleAccess";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { mentorRouter } from "./aiMentor/router";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { assessmentsRouter } from "./assessmentsRouter";
import { formativeExercisesRouter } from "./formativeExercisesRouter";
import { m5DocRouter } from "./m5DocRouter";
import { isSupervisionDocRun } from "../shared/m5Doc/dispatch";
import { M5_DOC_INTERACTION_ORDER } from "../shared/m5Doc/interactionsCatalog";
import type { ValidationResult } from "./rulesEngine";
import type { IncomingMessage } from "http";

// ─── Language Helper ────────────────────────────────────────────────────────────────────────────────
/**
 * Returns the EN message when the client sends Accept-Language: en,
 * otherwise falls back to the FR message (default).
 */
function pickReason(result: ValidationResult, req: IncomingMessage): string {
  const lang = (req.headers["accept-language"] ?? "fr").toLowerCase();
  const isEn = lang.startsWith("en");
  return (isEn ? result.reasonEn : result.reasonFr) ?? result.reason ?? "Erreur de validation";
}

function resolveM4KpiDataForScenario(
  scenario: Awaited<ReturnType<typeof getScenarioById>>,
  override?: KpiData,
): KpiData {
  if (override) return override;
  return getM4KpiDataFromSeed(scenario?.initialStateJson as M4InitialStateJson | null | undefined);
}

function buildM4KpiSnapshot(scenario: Awaited<ReturnType<typeof getScenarioById>>) {
  const kpiData = resolveM4KpiDataForScenario(scenario);
  const kpiResult = calculateKpis(kpiData);
  return {
    rotationRate: kpiResult.rotationRate,
    serviceLevel: kpiResult.serviceLevel,
    errorRate: kpiResult.errorRate,
    averageLeadTime: kpiResult.averageLeadTime,
    stockImmobilizedValue: kpiResult.stockImmobilizedValue,
    rotationStatus: kpiResult.rotationStatus,
    serviceLevelStatus: kpiResult.serviceLevelStatus,
    errorRateStatus: kpiResult.errorRateStatus,
  };
}

// ─── Role Guards ──────────────────────────────────────────────────────────────
const teacherProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "teacher" && ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Accès réservé aux enseignants" });
  }
  return next({ ctx });
});

const studentProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "student" && ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Accès réservé aux étudiants" });
  }
  return next({ ctx });
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
/**
 * Awards a scoring event only if the same eventType has NOT already been awarded
 * for this run. Prevents double-scoring in multi-step scenarios (SCN-003, SCN-005).
 */
async function addScoringEventOnce(
  params: { runId: number; eventType: string; pointsDelta: number; message: string }
) {
  const existing = await getScoringEventsByRun(params.runId);
  const alreadyAwarded = existing.some((e: any) => e.eventType === params.eventType && e.pointsDelta > 0);
  if (!alreadyAwarded) {
    await addScoringEvent(params);
  }
}

async function loadM3ComplianceArtifacts(runId: number) {
  const [inventoryCounts, inventoryAdjustments, replenishmentSuggestions, transactions] = await Promise.all([
    getInventoryCountsByRun(runId),
    getInventoryAdjustmentsByRun(runId),
    getReplenishmentSuggestionsByRun(runId),
    getTransactionsByRun(runId),
  ]);
  return {
    inventoryCounts,
    inventoryAdjustments,
    replenishmentSuggestions,
    transactions: transactions.map((t) => ({
      docType: t.docType,
      sku: t.sku,
      bin: t.bin,
      qty: Number(t.qty),
      posted: t.posted,
    })),
  };
}

async function buildRunState(runId: number) {
  const run = await getRunById(runId);
  const scenario = run ? await getScenarioById(run.scenarioId) : null;
  const [txs, ccs, prog, inventoryCounts, inventoryAdjustments] = await Promise.all([
    getTransactionsByRun(runId),
    getCycleCountsByRun(runId),
    getProgressByRun(runId),
    getInventoryCountsByRun(runId),
    getInventoryAdjustmentsByRun(runId),
  ]);

  const completedSteps = prog.filter((p) => p.completed).map((p) => p.stepCode as any);
  const scnCode = scenario ? resolveScenarioScnCode(scenario) : null;
  const scenarioInitialStateJson = (scenario?.initialStateJson as Record<string, unknown> | null) ?? null;

  const baseState = {
    completedSteps,
    scenarioId: run?.scenarioId ?? null,
    scnCode,
    scenarioName: scenario?.name ?? null,
    scenarioInitialStateJson,
    transactions: txs.map((t) => ({
      docType: t.docType,
      sku: t.sku,
      bin: t.bin,
      qty: Number(t.qty),
      posted: t.posted,
      docRef: (t as any).docRef ?? null,
    })),
    cycleCounts: ccs.map((c) => ({
      sku: c.sku,
      bin: c.bin,
      variance: Number(c.variance),
      resolved: c.resolved,
      systemQty: Number(c.systemQty),
      physicalQty: Number(c.physicalQty),
    })),
    inventoryCounts: inventoryCounts.map((c) => ({
      sku: c.sku,
      systemQty: Number(c.systemQty),
      countedQty: Number(c.countedQty),
      varianceQty: Number(c.varianceQty),
    })),
    inventoryAdjustments: inventoryAdjustments.map((a) => ({
      sku: a.sku,
      varianceQty: Number(a.varianceQty),
      adjustmentQty: Number(a.adjustmentQty),
      reason: a.reason,
    })),
    // DOC runs must never be cast into ops-ledger M5InitialStateJson.
    m5InitialStateJson:
      scenario?.moduleId === 5 && !isSupervisionDocRun(scenario.initialStateJson)
        ? (scenario.initialStateJson as M5InitialStateJson | undefined)
        : undefined,
    inventory: calculateInventory(
      txs.map((t) => ({
        docType: t.docType,
        sku: t.sku,
        bin: t.bin,
        qty: Number(t.qty),
        posted: t.posted,
      })),
    ),
  };

  const { recoverScn004RunState } = await import("./scn004");
  const { recoverScn005RunState } = await import("./scn005");
  return recoverScn005RunState(recoverScn004RunState(baseState));
}

export const appRouter = router({
  system: systemRouter,
  mentor: mentorRouter,

  // ─── Auth ──────────────────────────────────────────────────────────────────
  auth: router({
    me: publicProcedure.query(({ ctx }) => ctx.user ?? null),
    logout: protectedProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(COOKIE_NAME, getSessionCookieOptions(ctx.req));
      return { success: true };
    }),

    // ── Local email/password login ──────────────────────────────────────────
    localLogin: publicProcedure
      .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
      .mutation(async ({ input, ctx }) => {
        const user = await getUserByEmail(input.email.toLowerCase());
        if (!user || !user.passwordHash) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Email ou mot de passe incorrect" });
        }
        const valid = await bcrypt.compare(input.password, user.passwordHash);
        if (!valid) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Email ou mot de passe incorrect" });
        }
        if (user.isActive === false) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Compte désactivé. Contactez votre enseignant." });
        }
        const { sdk } = await import("./_core/sdk");
        const { ONE_YEAR_MS } = await import("@shared/const");
        const sessionToken = await sdk.createSessionToken(user.openId, {
          name: user.name || user.email || "",
          expiresInMs: ONE_YEAR_MS,
        });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
        return { success: true, role: user.role, name: user.name };
      }),

    // ── Local register (student self-registration) ──────────────────────────
    localRegister: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(1),
        accessCode: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const existing = await getUserByEmail(input.email.toLowerCase());
        if (existing) {
          throw new TRPCError({ code: "CONFLICT", message: "Un compte existe déjà avec cet email" });
        }
        // Validate access code if provided (optional gate)
        const STUDENT_ACCESS_CODE = process.env.STUDENT_ACCESS_CODE || "TECLOG2025";
        if (input.accessCode && input.accessCode.toUpperCase() !== STUDENT_ACCESS_CODE.toUpperCase()) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Code d'accès invalide" });
        }
        const passwordHash = await bcrypt.hash(input.password, 10);
        const user = await createLocalUser({
          email: input.email.toLowerCase(),
          name: input.name,
          passwordHash,
          role: "student",
        });
        if (!user) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Erreur lors de la création du compte" });
        const { sdk } = await import("./_core/sdk");
        const { ONE_YEAR_MS } = await import("@shared/const");
        const sessionToken = await sdk.createSessionToken(user.openId, {
          name: user.name || user.email || "",
          expiresInMs: ONE_YEAR_MS,
        });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
        return { success: true, role: user.role, name: user.name };
      }),

    // ── Admin: create teacher/student account ───────────────────────────────
    createAccount: protectedProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(1),
        role: z.enum(["student", "teacher", "admin"]),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "teacher") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const existing = await getUserByEmail(input.email.toLowerCase());
        if (existing) {
          throw new TRPCError({ code: "CONFLICT", message: "Un compte existe déjà avec cet email" });
        }
        const passwordHash = await bcrypt.hash(input.password, 10);
        const user = await createLocalUser({
          email: input.email.toLowerCase(),
          name: input.name,
          passwordHash,
          role: input.role,
        });
        return { success: true, userId: user?.id };
      }),

    // ── Reset password (admin only) ─────────────────────────────────────────
    resetPassword: protectedProcedure
      .input(z.object({ userId: z.number(), newPassword: z.string().min(6) }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const passwordHash = await bcrypt.hash(input.newPassword, 10);
        await updateUserPassword(input.userId, passwordHash);
        return { success: true };
      }),
    // ── Request password reset (public) ────────────────────────────────────
    requestPasswordReset: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input, ctx }) => {
        const { getUserByEmail, createPasswordResetToken } = await import("./db");
        const { notifyOwner } = await import("./_core/notification");
        const user = await getUserByEmail(input.email.toLowerCase());
        // Always return success to prevent email enumeration
        if (!user) return { success: true, message: "Si ce compte existe, un lien de réinitialisation a été généré." };
        // Generate a secure random token
        const crypto = await import("crypto");
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await createPasswordResetToken(user.id, token, expiresAt);
        // Build the reset URL using origin from request headers
        const origin = ctx.req.headers.origin || ctx.req.headers.referer?.replace(/\/[^/]*$/, "") || "http://localhost:3000";
        const resetUrl = `${origin}/reset-password/${token}`;
        // Notify teacher/admin (since we can't email students directly)
        await notifyOwner({
          title: `🔑 Réinitialisation de mot de passe — ${user.name || user.email}`,
          content: `L'étudiant **${user.name || "Inconnu"}** (${user.email}) a demandé une réinitialisation de mot de passe.\n\nLien de réinitialisation (valide 1h) :\n${resetUrl}\n\nPartagez ce lien avec l'étudiant via le canal de communication habituel.`,
        });
        return { success: true, resetUrl, message: "Lien de réinitialisation généré. Votre enseignant a été notifié." };
      }),
    // ── Reset password with token (public) ─────────────────────────────────
    resetPasswordWithToken: publicProcedure
      .input(z.object({ token: z.string().min(1), newPassword: z.string().min(6) }))
      .mutation(async ({ input }) => {
        const { getPasswordResetToken, markPasswordResetTokenUsed, updateUserPassword } = await import("./db");
        const tokenRow = await getPasswordResetToken(input.token);
        if (!tokenRow) throw new TRPCError({ code: "NOT_FOUND", message: "Lien de réinitialisation invalide ou expiré." });
        if (tokenRow.usedAt) throw new TRPCError({ code: "BAD_REQUEST", message: "Ce lien a déjà été utilisé." });
        if (new Date() > tokenRow.expiresAt) throw new TRPCError({ code: "BAD_REQUEST", message: "Ce lien a expiré. Veuillez en demander un nouveau." });
        const passwordHash = await bcrypt.hash(input.newPassword, 10);
        await updateUserPassword(tokenRow.userId, passwordHash);
        await markPasswordResetTokenUsed(tokenRow.id);
        return { success: true, message: "Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter." };
      }),
  }),

  // ─── Master Data ───────────────────────────────────────────────────────────
  master: router({
    skus: protectedProcedure.query(() => getAllSkus()),
    bins: protectedProcedure.query(() => getAllBins()),
  }),

  // ─── Student Management (Teacher) ─────────────────────────────────────────
  students: router({
    list: teacherProcedure
      .input(z.object({ cohortId: z.number().optional(), includeAll: z.boolean().optional() }))
      .query(async ({ ctx, input }) => {
        if (input.cohortId) {
          await assertTeacherOwnsCohort(
            ctx.user.id,
            input.cohortId,
            ctx.user.role === "admin",
          );
        }
        return listStudents(input);
      }),

    create: teacherProcedure
      .input(z.object({
        email: z.string().email(),
        name: z.string().min(1),
        password: z.string().min(6),
        cohortId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const existing = await getUserByEmail(input.email.toLowerCase());
        if (existing) throw new TRPCError({ code: "CONFLICT", message: "Un compte existe déjà avec cet email" });
        const passwordHash = await bcrypt.hash(input.password, 10);
        const user = await createLocalUser({ email: input.email.toLowerCase(), name: input.name, passwordHash, role: "student" });
        if (!user) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        if (input.cohortId) {
          await assertTeacherOwnsCohort(
            ctx.user.id,
            input.cohortId,
            ctx.user.role === "admin",
          );
          await assignStudentToCohort(user.id, input.cohortId);
        }
        return { success: true, userId: user.id };
      }),

    setActive: teacherProcedure
      .input(z.object({ userId: z.number(), isActive: z.boolean() }))
      .mutation(async ({ input }) => { await setStudentActive(input.userId, input.isActive); return { success: true }; }),

    updateNotes: teacherProcedure
      .input(z.object({ userId: z.number(), notes: z.string() }))
      .mutation(async ({ input }) => { await updateStudentNotes(input.userId, input.notes); return { success: true }; }),

    resetPassword: teacherProcedure
      .input(z.object({ userId: z.number(), newPassword: z.string().min(6) }))
      .mutation(async ({ input }) => {
        const passwordHash = await bcrypt.hash(input.newPassword, 10);
        await updateUserPassword(input.userId, passwordHash);
        return { success: true };
      }),

    assignCohort: teacherProcedure
      .input(z.object({ userId: z.number(), cohortId: z.number().nullable() }))
      .mutation(async ({ ctx, input }) => {
        if (input.cohortId != null) {
          await assertTeacherOwnsCohort(
            ctx.user.id,
            input.cohortId,
            ctx.user.role === "admin",
          );
        }
        await assignStudentToCohort(input.userId, input.cohortId);
        return { success: true };
      }),

    stats: teacherProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => getStudentStats(input.userId)),
  }),

  // ─── Scenarios ─────────────────────────────────────────────────────────────
  scenarios: router({
    list: protectedProcedure.query(() => getAllScenarios()),
    listByModule: protectedProcedure
      .input(z.object({ moduleCode: z.string() }))
      .query(async ({ ctx, input }) => {
        const db = await import("./db").then((m) => m.getDb());
        if (!db) return [];
        const { modules: modulesTable, scenarios: scenariosTable } = await import("../drizzle/schema");
        const { eq, and } = await import("drizzle-orm");
        const [mod] = await db.select().from(modulesTable).where(eq(modulesTable.code, input.moduleCode));
        if (!mod) return [];
        const rows = await db
          .select()
          .from(scenariosTable)
          .where(and(eq(scenariosTable.moduleId, mod.id), eq(scenariosTable.isActive, true)));
        // Hide DOC scenarios unless feature on + actor allowlisted (staff always).
        const { isM5DocFeatureEnabled, canAccessM5DocAsActor } = await import("../shared/m5Doc/types");
        return rows.filter((row) => {
          if (!isSupervisionDocRun(row.initialStateJson)) return true;
          if (!isM5DocFeatureEnabled()) return false;
          return canAccessM5DocAsActor(ctx.user);
        });
      }),
    create: teacherProcedure
      .input(
        z.object({
          moduleId: z.number().default(1),
          name: z.string().min(1),
          descriptionFr: z.string().default(""),
          difficulty: z.enum(["facile", "moyen", "difficile"]).default("facile"),
          initialStateJson: z.any().optional(),
        })
      )
      .mutation(({ ctx, input }) =>
        createScenario({ ...input, initialStateJson: input.initialStateJson ?? null, createdBy: ctx.user.id })
      ),
  }),

  // ─── Modules progress ─────────────────────────────────────────────────────
  modules: router({
    progress: protectedProcedure.query(({ ctx }) => getModuleProgressWithModules(ctx.user.id)),
  }),

  // ─── KPI (Module 4) ────────────────────────────────────────────────────────
  kpi: router({
    submitInterpretation: protectedProcedure
      .input(z.object({
        runId: z.number(),
        kpiKey: z.enum(["rotationRate", "serviceLevel", "errorRate", "diagnostic"]),
        studentAnswer: z.string().min(1),
        kpiData: z.object({
          annualConsumption: z.number(),
          averageStock: z.number(),
          ordersFulfilled: z.number(),
          totalOrders: z.number(),
          operationalErrors: z.number(),
          totalOperations: z.number(),
          avgLeadTimeDays: z.number(),
          stockValue: z.number(),
        }).optional(),
      }))
      .mutation(async ({ input }) => {
        const kpiData: KpiData = input.kpiData ?? {
          annualConsumption: 2400, averageStock: 400,
          ordersFulfilled: 285, totalOrders: 300,
          operationalErrors: 12, totalOperations: 300,
          avgLeadTimeDays: 3.5, stockValue: 48000,
        };
        const kpiResult = calculateKpis(kpiData);
        const result = scoreKpiInterpretation(input.kpiKey as any, input.studentAnswer, kpiResult);
        // Persist interpretation
        const db = await import("./db").then((m) => m.getDb());
        if (db) {
          const { kpiInterpretations } = await import("../drizzle/schema");
          await db.insert(kpiInterpretations).values({
            runId: input.runId,
            kpiKey: input.kpiKey,
            studentAnswer: input.studentAnswer,
            isCorrect: result.isCorrect,
            pointsDelta: result.pointsDelta,
            feedback: result.feedback,
          });
        }
        return result;
      }),
    getSnapshot: protectedProcedure
      .input(z.object({ runId: z.number() }))
      .query(async ({ input }) => {
        const db = await import("./db").then((m) => m.getDb());
        if (!db) return null;
        const { kpiSnapshots } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        const rows = await db.select().from(kpiSnapshots).where(eq(kpiSnapshots.runId, input.runId)).limit(1);
        return rows[0] ?? null;
      }),
  }),

  // ─── Cohorts ───────────────────────────────────────────────────────────────
  cohorts: router({
    list: teacherProcedure.query(({ ctx }) =>
      ctx.user.role === "admin" ? getAllCohorts() : getCohortsByTeacher(ctx.user.id),
    ),
    create: teacherProcedure
      .input(z.object({ name: z.string().min(1), description: z.string().optional() }))
      .mutation(({ ctx, input }) => createCohort(input.name, input.description ?? null, ctx.user.id)),
  }),

  // ─── Assignments ────────────────────────────────────────────────────────────
  assignments: router({
    forStudent: studentProcedure.query(async ({ ctx }) => {
      const profile = await getProfileByUserId(ctx.user.id);
      return getAssignmentsForStudent(ctx.user.id, profile?.cohortId ?? null);
    }),
    all: teacherProcedure
      .input(cohortFilterInput)
      .query(async ({ ctx, input }) => {
        const { studentUserIds } = await resolveCohortScope(
          ctx.user.id,
          input.cohortId,
          ctx.user.role === "admin",
        );
        return getAllAssignments({ cohortId: input.cohortId, cohortStudentUserIds: studentUserIds });
      }),
    create: teacherProcedure
      .input(
        z.object({
          scenarioId: z.number(),
          cohortId: z.number().nullable(),
          userId: z.number().nullable(),
          dueDate: z.string().nullable(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (input.cohortId != null) {
          await assertTeacherOwnsCohort(
            ctx.user.id,
            input.cohortId,
            ctx.user.role === "admin",
          );
        }
        return createAssignment({
          ...input,
          dueDate: input.dueDate ? new Date(input.dueDate) : null,
        });
      }),
  }),

  // ─── Profiles ──────────────────────────────────────────────────────────────
  profiles: router({
    mine: protectedProcedure.query(({ ctx }) => getProfileByUserId(ctx.user.id)),
    silverStatus: protectedProcedure.query(async ({ ctx }) => {
      const status = await getSilverCertificationStatus(ctx.user.id);
      if (status.silverEligible && !status.silverCertified) {
        await unlockSilverCertification(ctx.user.id);
        return { ...status, silverCertified: true };
      }
      return status;
    }),
    goldStatus: protectedProcedure.query(async ({ ctx }) => {
      const status = await getGoldCertificationStatus(ctx.user.id);
      if (status.goldEligible && !status.goldCertified && isGoldUnlockEnabled()) {
        await unlockGoldCertification(ctx.user.id);
        return {
          ...status,
          goldCertified: true,
          state: "AWARDED" as const,
        };
      }
      return status;
    }),
    goldStatusForStudent: teacherProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return getGoldCertificationStatus(input.userId);
      }),
    goldRoster: teacherProcedure
      .input(cohortFilterInput)
      .query(async ({ ctx, input }) => {
        const { studentUserIds } = await resolveCohortScope(
          ctx.user.id,
          input.cohortId,
          ctx.user.role === "admin",
        );
        const idSet = new Set(studentUserIds);
        const all = await getAllUsers();
        const students = all.filter((u) => u.role === "student" && idSet.has(u.id));
        return Promise.all(
          students.map(async (u) => {
            const gold = await getGoldCertificationStatus(u.id);
            const profile = await getProfileByUserId(u.id);
            return {
              userId: u.id,
              name: u.name,
              email: u.email,
              silverCertified: profile?.silverCertified ?? false,
              goldState: gold.state,
              goldEligible: gold.goldEligible,
              goldCertified: gold.goldCertified,
              blockerSummary: gold.blockerSummary,
            };
          }),
        );
      }),
    upsert: protectedProcedure
      .input(z.object({
        cohortId: z.number().nullable().optional(),
        displayName: z.string().optional(),
        studentNumber: z.string().max(64).nullable().optional(),
      }))
      .mutation(({ ctx, input }) => {
        const isTeacher = ctx.user.role === "teacher" || ctx.user.role === "admin";
        const fields: Parameters<typeof upsertProfile>[1] = {};
        if (input.studentNumber !== undefined) fields.studentNumber = input.studentNumber;
        if (isTeacher && input.cohortId !== undefined) fields.cohortId = input.cohortId;
        return upsertProfile(ctx.user.id, fields);
      }),
  }),

  // ─── Admin ─────────────────────────────────────────────────────────────────
  admin: router({
    users: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return getAllUsers();
    }),
    listStudents: teacherProcedure.query(async () => {
      const all = await getAllUsers();
      const students = all.filter((u) => u.role === "student" || u.role === "admin");
      // Enrich with profile data (studentNumber, cohortId)
      const enriched = await Promise.all(
        students.map(async (u) => {
          const profile = await getProfileByUserId(u.id);
          return { ...u, studentNumber: profile?.studentNumber ?? null, cohortId: profile?.cohortId ?? null };
        })
      );
      return enriched;
    }),
    setRole: protectedProcedure
      .input(z.object({ userId: z.number(), role: z.enum(["student", "teacher", "admin"]) }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        await updateUserRole(input.userId, input.role);
        return { success: true };
      }),

    // Pre-authorized emails — auto-assign role on first login
    listPreAuthorized: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return getPreAuthorizedEmails();
    }),
    addPreAuthorized: protectedProcedure
      .input(z.object({
        email: z.string().email(),
        role: z.enum(["student", "teacher", "admin"]).default("teacher"),
        note: z.string().max(255).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        await addPreAuthorizedEmail(input.email, input.role, input.note ?? null, ctx.user.id);
        return { success: true };
      }),
    removePreAuthorized: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        await removePreAuthorizedEmail(input.id);
        return { success: true };
      }),
    
    // Reset student certification state (admin only, for validation)
    resetStudentCertification: protectedProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const user = await getUserByEmail(input.email);
        if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        await upsertProfile(user.id, { silverCertified: false, goldCertified: false });
        return { success: true, message: `Certification reset for ${input.email}` };
      }),

    /**
     * James / institutional demo readiness.
     * Abandons all in_progress runs for a demo account so class demos start clean.
     * Preserves completed history. Allowed for admin + teacher. Default target: James Timothy (222).
     */
    prepareDemoReadiness: protectedProcedure
      .input(
        z.object({
          userId: z.number().optional(),
          email: z.string().email().optional(),
          dryRun: z.boolean().optional().default(false),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "teacher") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin or teacher only" });
        }
        const { DEMO_ACCOUNT_USER_IDS } = await import("../shared/assessmentCore");
        let targetId = input.userId ?? null;
        if (!targetId && input.email) {
          const u = await getUserByEmail(input.email);
          if (!u) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
          targetId = u.id;
        }
        if (!targetId) targetId = [...DEMO_ACCOUNT_USER_IDS][0] ?? 222;
        if (!DEMO_ACCOUNT_USER_IDS.has(targetId) && ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Teachers may only prepare registered demo accounts (James). Admins required otherwise.",
          });
        }
        const before = await getRunsByUser(targetId);
        const activeBefore = before.filter((r) => r.status === "in_progress").map((r) => r.id);
        if (input.dryRun) {
          return {
            success: true,
            dryRun: true,
            userId: targetId,
            activeRunIds: activeBefore,
            abandonedRunIds: [] as number[],
            verdict: activeBefore.length === 0 ? "READY FOR CLASS" : "HOLD — active runs present",
          };
        }
        const { abandonedRunIds } = await abandonAllInProgressRunsForUser(targetId);
        const after = await getRunsByUser(targetId);
        const activeAfter = after.filter((r) => r.status === "in_progress").map((r) => r.id);
        return {
          success: true,
          dryRun: false,
          userId: targetId,
          activeRunIdsBefore: activeBefore,
          abandonedRunIds,
          activeRunIdsAfter: activeAfter,
          verdict: activeAfter.length === 0 ? "READY FOR CLASS" : "HOLD — residual active runs",
        };
      }),
    
    // Comprehensive admin cleanup: recalculate certifications and generate audit report
    cleanupAndAudit: protectedProcedure
      .input(z.object({ 
        dryRun: z.boolean().optional().default(true)
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        
        // Official real students to preserve
        const officialStudents = [
          'fredlolabio@gmail.com',
          'aissatasoukeinacamara@gmail.com',
          'nappodaniella@gmail.com',
          'dcparedes2010@gmail.com',
          'francisagbodjan10@gmail.com'
        ];
        
        // Test/demo/QA account patterns
        const testPatterns = ['test', 'demo', 'qa', 'pedagogical', 'student@concorde', 'prof@concorde', 'etudiant@concorde', 'student@manus'];
        
        const allUsers = await getAllUsers();
        const auditReport = {
          timestamp: new Date().toISOString(),
          dryRun: input.dryRun,
          accountsModified: [] as any[],
          accountsPreserved: [] as any[],
          accountsMovedToQA: [] as any[],
          certificationChanges: [] as any[]
        };
        
        // Process each user
        for (const user of allUsers) {
          if (user.role === 'admin' || user.role === 'teacher') continue; // Skip non-students
          
          const isOfficialStudent = officialStudents.includes(user.email);
          const isTestAccount = testPatterns.some(p => user.email.toLowerCase().includes(p));
          
          // Get current profile
          const profile = await getProfileByUserId(user.id);
          const currentSilver = profile?.silverCertified ?? false;
          const currentGold = profile?.goldCertified ?? false;
          
          // Recalculate eligibility
          const quizPassed = await checkM1QuizPassed(user.id);
          const scenariosCompleted = await checkAllM1ScenariosCompleted(user.id);
          const complianceValidated = await checkM1ComplianceValidated(user.id);
          const noBlockers = await checkNoUnresolvedBlockers(user.id);
          
          const shouldHaveSilver = quizPassed && scenariosCompleted && complianceValidated && noBlockers;
          const goldStatus = await getGoldCertificationStatus(user.id);
          const shouldHaveGold = goldStatus.goldEligible && isGoldUnlockEnabled();
          
          // Check if certification state is stale
          const silverIsStale = currentSilver !== shouldHaveSilver;
          const goldIsStale = currentGold !== shouldHaveGold;
          
          if (isOfficialStudent) {
            auditReport.accountsPreserved.push({
              email: user.email,
              name: user.name,
              silverCertified: currentSilver,
              shouldHaveSilver,
              goldCertified: currentGold,
              shouldHaveGold,
              reason: 'Official student - preserved'
            });
          } else if (isTestAccount) {
            auditReport.accountsMovedToQA.push({
              email: user.email,
              name: user.name,
              reason: 'Test/demo account - marked for QA cohort'
            });
          } else if (silverIsStale || goldIsStale) {
            auditReport.certificationChanges.push({
              email: user.email,
              name: user.name,
              silverBefore: currentSilver,
              silverAfter: shouldHaveSilver,
              goldBefore: currentGold,
              goldAfter: shouldHaveGold,
              goldEligible: goldStatus.goldEligible,
              goldBlockerSummary: goldStatus.blockerSummary,
              quizPassed,
              scenariosCompleted,
              complianceValidated,
              noBlockers,
              reason: 'Stale certification flag - recalculated'
            });
            
            if (!input.dryRun) {
              await upsertProfile(user.id, { 
                silverCertified: shouldHaveSilver,
                goldCertified: shouldHaveGold,
              });
              auditReport.accountsModified.push({
                email: user.email,
                name: user.name,
                action: 'Certification recalculated',
                details: auditReport.certificationChanges[auditReport.certificationChanges.length - 1]
              });
            }
          }
        }
        
        return {
          success: true,
          auditReport,
          summary: {
            totalUsersProcessed: allUsers.length,
            accountsModified: auditReport.accountsModified.length,
            accountsPreserved: auditReport.accountsPreserved.length,
            accountsMovedToQA: auditReport.accountsMovedToQA.length,
            certificationChanges: auditReport.certificationChanges.length
          }
        };
      })
  }),

  // ─── Runs ────────────────────────────────────────────────────────────────────
  runs: router({
    start: protectedProcedure
      .input(z.object({
        scenarioId: z.number(),
        isDemo: z.boolean().optional().default(false),
      }))
      .mutation(async ({ ctx, input }) => {
        // Only teachers/admins can start demo sessions
        const isDemo = input.isDemo && (ctx.user.role === "teacher" || ctx.user.role === "admin");
        const scenario = await getScenarioById(input.scenarioId);
        if (!scenario) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Scénario introuvable" });
        }

        // DOC scenarios: feature flag + server allowlist (James-only during controlled QA).
        if (isSupervisionDocRun(scenario.initialStateJson)) {
          const { isM5DocFeatureEnabled, canAccessM5DocAsActor } = await import("../shared/m5Doc/types");
          if (!isM5DocFeatureEnabled()) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "FEATURE_DISABLED: ENABLE_M5_DOC_SUPERVISION is not true",
            });
          }
          if (!canAccessM5DocAsActor(ctx.user)) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "DOC_STUDENT_NOT_ALLOWLISTED: Student not on M5_DOC_STUDENT_ALLOWLIST",
            });
          }
        }

        const moduleId = scenario.moduleId ?? 1;

        // Open M1–M5 access: no prior-module / quiz / teacher-validation checkpoint.
        // Scenario-internal sequencing and WMS validators remain enforced elsewhere.
        if (!isDemo && ctx.user.role === "student") {
          if (
            !canAccessLearningModule({
              authenticated: true,
              enrolledInCohort: true,
              moduleId,
            })
          ) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Module non accessible pour ce parcours.",
            });
          }
        }

        const runId = await startRun(ctx.user.id, input.scenarioId, isDemo);
        if (scenario?.initialStateJson) {
          const state = scenario.initialStateJson as any;
          if (state.preloadedTransactions) {
            try {
              const { normalizePreloadedTransaction, getM1StepsToAutoComplete, getM2StepsToAutoComplete } = await import("./m1Preload");
              const normalized = (state.preloadedTransactions as import("./m1Preload").PreloadedTx[]).map(normalizePreloadedTransaction);
              for (const tx of normalized) {
                await addTransaction({
                  runId,
                  docType: tx.docType,
                  moveType: null,
                  sku: tx.sku!,
                  bin: tx.bin!,
                  qty: String(tx.qty),
                  posted: tx.posted ?? false,
                  docRef: tx.docRef ?? null,
                  comment: "Initial state",
                });
              }
              const moduleId = scenario.moduleId ?? 1;
              const autoSteps =
                moduleId === 1 ? getM1StepsToAutoComplete(normalized)
                : moduleId === 2 ? getM2StepsToAutoComplete(normalized)
                : [];
              for (const stepCode of autoSteps) {
                await markStepComplete(runId, stepCode);
              }
              // M1: pre-seeded PO/GR credits step completion + scoring (SCN-003/004 preload pattern)
              if (!isDemo && moduleId === 1) {
                const m1AutoEventMap: Record<string, string> = {
                  PO: "PO_COMPLETED",
                  GR: "GR_COMPLETED",
                };
                for (const stepCode of autoSteps) {
                  const eventType = m1AutoEventMap[stepCode];
                  if (!eventType) continue;
                  const rule = getScoringRule(eventType);
                  if (rule) {
                    await addScoringEventOnce({
                      runId,
                      eventType,
                      pointsDelta: rule.points,
                      message: rule.descriptionFr,
                    });
                  }
                }
              }
              // SCN-008: pre-seeded STOCKAGE credits PUTAWAY step + scoring (MS-G9 declared bypass)
              if (!isDemo && moduleId === 2 && autoSteps.includes("PUTAWAY")) {
                const putawayRule = getScoringRule("PUTAWAY_COMPLETED");
                if (putawayRule) {
                  await addScoringEvent({
                    runId,
                    eventType: "PUTAWAY_COMPLETED",
                    pointsDelta: putawayRule.points,
                    message: putawayRule.descriptionFr,
                  });
                }
              }
            } catch (err) {
              throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: err instanceof Error ? err.message : "Failed to preload scenario transactions",
              });
            }
          }
        }
        return { runId, isDemo };
      }),

    myRuns: protectedProcedure.query(({ ctx }) => getRunsByUser(ctx.user.id)),

    /** Enriched runs for the student scenario list — includes score and completedSteps */
    myRunsEnriched: protectedProcedure.query(async ({ ctx }) => {
      const runs = await getRunsByUser(ctx.user.id);
      const enriched = await Promise.all(
        runs.map(async (r) => {
          const state = await buildRunState(r.run.id);
          const events = r.run.isDemo ? [] : await getScoringEventsByRun(r.run.id);
          return {
            ...r,
            completedSteps: state.completedSteps as string[],
            progressPct: calculateProgressPctAllModules(state.completedSteps, r.scenario.moduleId, state),
            score: r.run.isDemo ? null : calculateTotalScore(events),
          };
        })
      );
      return enriched;
    }),

    /** Student's own score evolution across multiple attempts on a scenario */
    myScoreEvolution: protectedProcedure
      .input(z.object({ scenarioId: z.number() }))
      .query(async ({ ctx, input }) => {
        const allRuns = await getRunsByUser(ctx.user.id);
        // Only eval (non-demo) runs for this scenario, sorted by date
        const filtered = allRuns
          .filter(r => r.run.scenarioId === input.scenarioId && !r.run.isDemo)
          .sort((a, b) => new Date(a.run.startedAt).getTime() - new Date(b.run.startedAt).getTime());

        const attempts = await Promise.all(
          filtered.map(async (r, idx) => {
            const events = await getScoringEventsByRun(r.run.id);
            const score = calculateTotalScore(events);
            const penalties = events.filter(e => e.pointsDelta < 0).length;
            const bonuses   = events.filter(e => e.pointsDelta > 0).length;
            const state     = await buildRunState(r.run.id);
            const progress  = calculateProgressPctAllModules(state.completedSteps, r.scenario.moduleId, state);
            return {
              attempt:     idx + 1,
              runId:       r.run.id,
              score,
              penalties,
              bonuses,
              progressPct: progress,
              status:      r.run.status,
              startedAt:   r.run.startedAt,
              completedAt: r.run.completedAt,
            };
          })
        );

        const scores = attempts.map(a => a.score);
        const bestScore = scores.length ? Math.max(...scores) : 0;
        const lastScore = scores.length ? scores[scores.length - 1] : 0;
        const trend     = scores.length >= 2 ? lastScore - scores[scores.length - 2] : 0;
        const firstScenario = filtered[0]?.scenario;
        const passThreshold = getModuleScenarioPassThreshold(firstScenario?.moduleId ?? 1);
        const passed    = bestScore >= passThreshold;

        return { attempts, bestScore, lastScore, trend, passed, totalAttempts: attempts.length, passThreshold };
      }),

    /** Detailed report: per-step scores, errors, and recommendations */
    detailedReport: protectedProcedure
      .input(z.object({ runId: z.number() }))
      .query(async ({ ctx, input }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        if (run.userId !== ctx.user.id && ctx.user.role !== "teacher" && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        // ── Determine module from scenario ──────────────────────────────────
        const scenario = await getScenarioById(run.scenarioId);
        const moduleId = scenario?.moduleId ?? 1;

        // DOC dispatch BEFORE any legacy M5 calculation (getEffectiveM5Steps / v1 / Gold legacy).
        if (isSupervisionDocRun(scenario?.initialStateJson)) {
          const { isM5DocFeatureEnabled, canAccessM5DocAsActor } = await import("../shared/m5Doc/types");
          const { loadM5DocState } = await import("./m5Doc/persistence");
          const { buildM5DocProfessorView } = await import("./m5Doc/professorView");
          const { computeFinalScore } = await import("../shared/m5Doc/scoringPure");
          const { deriveM5DocSessionEvidenceV2 } = await import("../shared/m5Doc/evidenceV2");
          if (!isM5DocFeatureEnabled()) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "FEATURE_DISABLED: ENABLE_M5_DOC_SUPERVISION is not true",
            });
          }
          if (!canAccessM5DocAsActor(ctx.user)) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "DOC_STUDENT_NOT_ALLOWLISTED: Student not on M5_DOC_STUDENT_ALLOWLIST",
            });
          }
          const docState = await loadM5DocState(input.runId, scenario.initialStateJson.scnCode);
          const { finalScore, zoneScores } = computeFinalScore(docState);
          const professor = buildM5DocProfessorView(docState);
          const evidence = deriveM5DocSessionEvidenceV2(docState);
          const completed = Object.keys(docState.officialScores).length;
          return {
            runId: input.runId,
            isDemo: run.isDemo,
            interactionModel: "supervision-doc-v1" as const,
            evidenceVersion: "m5-session-v2" as const,
            totalScore: finalScore,
            scoreLabel: "M5 DOC",
            scoreColor: finalScore >= 70 ? "green" : "amber",
            stepBreakdown: M5_DOC_INTERACTION_ORDER.map((id) => {
              const sc = docState.officialScores[id];
              return {
                step: id,
                label: id,
                completed: !!sc,
                pointsEarned: sc?.points ?? 0,
                maxPoints: sc?.maxPoints ?? 0,
                pct: sc ? Math.round((sc.points / Math.max(1, sc.maxPoints)) * 100) : 0,
                zones: {},
                zoneErrors: [] as string[],
              };
            }),
            errors: [],
            bonuses: [],
            recommendations: [],
            complianceIssues: [],
            completedSteps: Object.keys(docState.officialScores),
            progressPct: Math.round((completed / M5_DOC_INTERACTION_ORDER.length) * 100),
            zoneFlow: [],
            transactionTimeline: [],
            m5Report: undefined,
            m5DocReport: { professor, evidence, zoneScores, finalScore },
            totalTransactions: 0,
            totalErrors: 0,
            stepsCompleted: completed,
            totalSteps: M5_DOC_INTERACTION_ORDER.length,
            certificationUnlocked: false,
            silverEligible: false,
          };
        }

        const events = await getScoringEventsByRun(input.runId);
        const state = await buildRunState(input.runId);
        const compliance = checkCompliance(state);

        const silverStatus = await getSilverCertificationStatus(ctx.user.id);
        // ── Step max points map (all modules) ───────────────────────────────
        const STEP_MAX_ALL: Record<string, number> = {
          // M1
          PO: 10, GR: 10, PUTAWAY_M1: 5, STOCK: 0, SO: 10, PICKING_M1: 5, GI: 10, CC: 10, ADJ: 10, COMPLIANCE: 40,
          // M2 (GR pre-seeded; default 25×4 = 100; SCN-007 = 40+30+30 without FIFO)
          PUTAWAY: 25, FIFO_PICK: 25, STOCK_ACCURACY: 25, COMPLIANCE_ADV: 25,
          // M3 (SCN-009/010 scaled to 100; SCN-011 REPLENISH display max includes ROP/EOQ)
          ...M3_STEP_MAX_SCALED,
          // M4 (10+20+20+25+25 = 100)
          ...M4_STEP_MAX,
          // M5
          M5_RECEPTION: 10, M5_PUTAWAY: 10, M5_CYCLE_COUNT: 15, M5_ADJ: 10, M5_REPLENISH: 20, M5_KPI: 10, M5_DECISION: 30, COMPLIANCE_M5: 20,
        };
        const STEP_EVENT_MAP_ALL: Record<string, string> = {
          // M1
          PO: "PO_COMPLETED", GR: "GR_COMPLETED", PUTAWAY_M1: "PUTAWAY_M1_COMPLETED",
          SO: "SO_COMPLETED", PICKING_M1: "PICKING_M1_COMPLETED",
          GI: "GI_COMPLETED", CC: "CC_COMPLETED", ADJ: "ADJ_COMPLETED", COMPLIANCE: "COMPLIANCE_OK",
          // M2
          PUTAWAY: "PUTAWAY_COMPLETED", FIFO_PICK: "FIFO_PICK_COMPLETED",
          STOCK_ACCURACY: "STOCK_ACCURACY_COMPLETED", COMPLIANCE_ADV: "COMPLIANCE_ADV_COMPLETED",
          // M3
          CC_LIST: "CC_LIST_COMPLETED", CC_COUNT: "CC_COUNT_COMPLETED", CC_RECON: "CC_RECON_COMPLETED",
          REPLENISH: "REPLENISH_COMPLETED", COMPLIANCE_M3: "COMPLIANCE_M3_COMPLETED",
          // M4
          KPI_DATA: "KPI_DATA_COMPLETED", KPI_ROTATION: "KPI_ROTATION_COMPLETED", KPI_SERVICE: "KPI_SERVICE_COMPLETED",
          KPI_DIAGNOSTIC: "KPI_DIAGNOSTIC_COMPLETED", COMPLIANCE_M4: "COMPLIANCE_M4_COMPLETED",
          // M5
          M5_RECEPTION: "M5_RECEPTION_COMPLETED", M5_PUTAWAY: "M5_PUTAWAY_COMPLETED", M5_CYCLE_COUNT: "M5_CYCLE_COUNT_COMPLETED",
          M5_ADJ: "M5_ADJ_COMPLETED", M5_REPLENISH: "M5_REPLENISH_COMPLETED", M5_KPI: "M5_KPI_COMPLETED", M5_DECISION: "M5_DECISION_COMPLETED", COMPLIANCE_M5: "COMPLIANCE_M5_COMPLETED",
        };
        const STEP_ZONES_ALL: Record<string, { from?: string; to?: string; zone?: string }> = {
          PO: { zone: "ACHAT" }, GR: { to: "RÉCEPTION" }, PUTAWAY_M1: { from: "RÉCEPTION", to: "STOCKAGE" },
          STOCK: { zone: "STOCKAGE" }, SO: { zone: "VENTE" }, PICKING_M1: { from: "STOCKAGE", to: "EXPÉDITION" },
          GI: { from: "EXPÉDITION" }, CC: { zone: "STOCKAGE" }, COMPLIANCE: { zone: "SYSTÈME" },
          FIFO_PICK: { from: "STOCKAGE", to: "EXPÉDITION" }, STOCK_ACCURACY: { zone: "STOCKAGE" }, COMPLIANCE_ADV: { zone: "SYSTÈME" },
          CC_LIST: { zone: "STOCKAGE" }, CC_COUNT: { zone: "STOCKAGE" }, CC_RECON: { zone: "STOCKAGE" },
          REPLENISH: { zone: "ACHAT" }, COMPLIANCE_M3: { zone: "SYSTÈME" },
          KPI_DATA: { zone: "ANALYTIQUE" }, KPI_ROTATION: { zone: "ANALYTIQUE" }, KPI_SERVICE: { zone: "ANALYTIQUE" },
          KPI_DIAGNOSTIC: { zone: "ANALYTIQUE" }, COMPLIANCE_M4: { zone: "SYSTÈME" },
          M5_RECEPTION: { to: "RÉCEPTION" }, M5_PUTAWAY: { from: "RÉCEPTION", to: "STOCKAGE" },
          M5_CYCLE_COUNT: { zone: "STOCKAGE" }, M5_ADJ: { zone: "STOCKAGE" }, M5_REPLENISH: { zone: "ACHAT" },
          M5_KPI: { zone: "ANALYTIQUE" }, M5_DECISION: { zone: "STRATÉGIQUE" }, COMPLIANCE_M5: { zone: "SYSTÈME" },
        };
        // ── Select steps for this module ─────────────────────────────────────
        const m3InitialStateJson = scenario?.initialStateJson as import("./rulesEngine").M3InitialStateJson;
        const moduleSteps = moduleId === 2 ? getEffectiveM2Steps(state)
          : moduleId === 3 ? getM3StepsForRun(m3InitialStateJson, state.completedSteps as string[], events)
          : moduleId === 4 ? MODULE4_STEPS
          : moduleId === 5 ? getEffectiveM5Steps(scenario?.initialStateJson as M5InitialStateJson, state)
          : moduleId === 1 ? getEffectiveM1Steps(state)
          : MODULE1_STEPS;
        const stepCodesToReport = moduleSteps.map(s => s.code as string);
        // ── Per-step score breakdown ─────────────────────────────────────────
        const stepBreakdown = stepCodesToReport.map(step => {
          const completed = state.completedSteps.includes(step as any);
          const completionEvent = STEP_EVENT_MAP_ALL[step];
          const completionPoints =
            moduleId === 3 && step === "REPLENISH"
              ? events
                  .filter((e) => (M3_REPLENISH_SCORING_EVENTS as readonly string[]).includes(e.eventType))
                  .reduce((s, e) => s + e.pointsDelta, 0)
              : completionEvent
                ? events.filter(e => e.eventType === completionEvent).reduce((s, e) => s + e.pointsDelta, 0)
                : 0;
          const maxPoints =
            moduleId === 3 && step === "REPLENISH"
              ? getM3ReplenishStepDisplayMax(m3InitialStateJson, events)
              : moduleId === 3 && isM3ReplenishmentOnlyScenario(m3InitialStateJson) && step === "COMPLIANCE_M3"
                ? (
                    events.some((e) => e.eventType === "COMPLIANCE_M3_COMPLETED" && e.pointsDelta === M3_STEP_MAX.COMPLIANCE_M3)
                      ? M3_STEP_MAX.COMPLIANCE_M3
                      : M3_011_STEP_MAX.COMPLIANCE_M3
                  )
              : moduleId === 3 && step in M3_STEP_MAX_SCALED
                ? M3_STEP_MAX_SCALED[step as keyof typeof M3_STEP_MAX_SCALED]
                : isScn004Scenario(state)
                  ? getScn004StepMaxPoints(step)
                  : isScn005Scenario(state)
                    ? getScn005StepMaxPoints(step)
                    : isScn007Scenario(state)
                      ? getScn007StepMaxPoints(step) || (STEP_MAX_ALL[step] ?? 0)
                      : STEP_MAX_ALL[step] ?? 0;
          const pct = maxPoints > 0 ? Math.round((completionPoints / maxPoints) * 100) : (completed ? 100 : 0);
          // Collect zone errors for this step
          const zoneErrors = events
            .filter(e => e.eventType === "WRONG_ZONE" && (e.message ?? "").includes(step))
            .map(e => e.message ?? "");
          // Use labelFr from moduleSteps if available
          const stepDef = moduleSteps.find(s => (s.code as string) === step);
          const label = stepDef?.labelFr ?? step;
          return {
            step,
            label,
            completed,
            pointsEarned: completionPoints,
            maxPoints,
            pct: Math.max(0, Math.min(100, pct)),
            zones: STEP_ZONES_ALL[step] ?? {},
            zoneErrors,
          };
        });

        // ── Errors (negative events) ─────────────────────────────────────────
        const PENALTY_EXPLANATIONS: Record<string, { title: string; detail: string; recommendation: string }> = {
          OUT_OF_SEQUENCE: {
            title: "Tentative hors séquence",
            detail: "Vous avez tenté d'exécuter une étape avant que ses prérequis soient complétés. Dans SAP S/4HANA, le flux PO→GR→SO→GI est obligatoire car chaque document crée les références nécessaires à l'étape suivante.",
            recommendation: "Respectez toujours la séquence : PO → GR → Vérification stock → SO → GI → Cycle Count → Conformité.",
          },
          NEGATIVE_STOCK_ATTEMPT: {
            title: "Tentative de sortie avec stock insuffisant",
            detail: "Vous avez tenté d'émettre une Goods Issue (GI) pour une quantité supérieure au stock disponible. Cela aurait créé un stock négatif, ce qui est interdit dans un système ERP conforme.",
            recommendation: "Vérifiez toujours le stock disponible (MB52) avant de créer un SO/GI. Si le stock est insuffisant, créez d'abord une PO et postez la GR.",
          },
          UNPOSTED_TX_LEFT: {
            title: "Transaction non postée laissée en suspens",
            detail: "Une ou plusieurs transactions ont été créées mais non postées. Dans SAP, une transaction non postée n'a aucun effet sur l'inventaire et laisse le système dans un état incohérent.",
            recommendation: "Toujours poster (valider) chaque transaction immédiatement après sa création. Utilisez MB52 pour vérifier les transactions en suspens.",
          },
          UNRESOLVED_VARIANCE: {
            title: "Écart d'inventaire non résolu",
            detail: "Un écart entre le stock physique et le stock système a été détecté lors du Cycle Count mais n'a pas été résolu avec une transaction ADJ (ajustement d'inventaire).",
            recommendation: "Après chaque Cycle Count, analysez les écarts et créez une transaction MI07 (ADJ) pour réconcilier le stock physique avec le stock système.",
          },
          CAPACITY_OVERFLOW: {
            title: "Tentative de dépassement de capacité d'emplacement",
            detail: "Vous avez tenté de ranger une quantité supérieure à la capacité maximale du bin cible. La transaction a été rejetée, mais la tentative pédagogique est enregistrée (−10 pts). En SCN-007, observez l'alerte puis répartissez la marchandise sur plusieurs emplacements STOCKAGE.",
            recommendation: "Vérifiez la capacité max du bin (ex. B-01-R1-L1 = 500 u.) avant le rangement. Répartissez les quantités excédentaires sur plusieurs bins conformes.",
          },
        };

        const PENALTY_EXPLANATIONS_ZONE: Record<string, { title: string; detail: string; recommendation: string }> = {
          WRONG_ZONE_GR: {
            title: "Zone incorrecte — Réception (GR)",
            detail: "La marchandise reçue (GR/MIGO) doit obligatoirement être déposée dans un emplacement de la zone RÉCEPTION (REC-01 ou REC-02). Elle ne peut pas aller directement en zone STOCKAGE ou EXPÉDITION.",
            recommendation: "Lors du MIGO, sélectionnez toujours un emplacement REC-01 ou REC-02. Ensuite, utilisez LT0A pour ranger la marchandise en zone STOCKAGE.",
          },
          WRONG_ZONE_PUTAWAY: {
            title: "Zone incorrecte — Rangement (PUTAWAY)",
            detail: "Le rangement (LT0A) doit partir d'un emplacement RÉCEPTION (REC-01/REC-02) et aller vers un emplacement STOCKAGE, PICKING ou RÉSERVE. Les marchandises ne peuvent pas rester en zone RÉCEPTION.",
            recommendation: "Source : REC-01 ou REC-02. Destination : B-01-R1-L1, B-01-R1-L2, A-01-R1-L1, etc. Évitez EXP-01/EXP-02 comme destination de rangement.",
          },
          WRONG_ZONE_PICKING: {
            title: "Zone incorrecte — Prélèvement (PICKING)",
            detail: "Le prélèvement (VL01N) doit partir d'un emplacement STOCKAGE/PICKING/RÉSERVE et aller vers un emplacement EXPÉDITION (EXP-01 ou EXP-02). Les marchandises doivent transiter par le quai d'expédition avant la GI.",
            recommendation: "Source : B-01-R1-L1, A-01-R1-L1, etc. Destination : EXP-01 ou EXP-02. La GI ne peut être postée qu'après que les marchandises sont au quai d'expédition.",
          },
          WRONG_ZONE_GI: {
            title: "Zone incorrecte — Sortie marchandises (GI)",
            detail: "La sortie marchandises (GI/VL02N) doit être postée depuis un emplacement EXPÉDITION (EXP-01 ou EXP-02). Les marchandises doivent avoir été prélevées et déposées au quai d'expédition avant la GI.",
            recommendation: "Complétez d'abord l'étape PICKING (VL01N) pour déplacer les marchandises vers EXP-01 ou EXP-02, puis postez la GI depuis cet emplacement.",
          },
        };

        const errors = events
          .filter(e => e.pointsDelta < 0)
          .map(e => ({
            eventType: e.eventType,
            pointsDelta: e.pointsDelta,
            message: e.message ?? "",
            explanation: PENALTY_EXPLANATIONS_ZONE[e.eventType] ?? PENALTY_EXPLANATIONS[e.eventType] ?? {
              title: e.message ?? e.eventType,
              detail: "Une erreur a été détectée lors de cette étape.",
              recommendation: "Revoyez les prérequis de cette étape et recommencez la simulation.",
            },
            createdAt: e.createdAt,
          }));

        // ── Bonus events ─────────────────────────────────────────────────────
        const bonuses = events.filter(e => e.eventType === "PERFECT_RUN_BONUS");

        // ── Personalized recommendations ─────────────────────────────────────
        const errorTypes = new Set(errors.map(e => e.eventType));
        const recommendations: string[] = [];
        if (errorTypes.has("OUT_OF_SEQUENCE"))
          recommendations.push("Mémorisez le flux complet : ME21N → MIGO(→REC) → LT0A(REC→STOCK) → VA01 → VL01N(STOCK→EXP) → VL02N(→EXP) → MI01");
        if (errorTypes.has("NEGATIVE_STOCK_ATTEMPT"))
          recommendations.push("Avant chaque GI, vérifiez le stock disponible en zone STOCKAGE (MB52). Si insuffisant, créez d'abord une PO et postez la GR.");
        if (errorTypes.has("UNPOSTED_TX_LEFT"))
          recommendations.push("Adoptez le réflexe \"créer + poster\" : ne quittez jamais une étape sans poster la transaction");
        if (errorTypes.has("UNRESOLVED_VARIANCE"))
          recommendations.push("Après MI01/MI04, toujours finaliser avec MI07 (validation des écarts) avant la conformité");
        if (errorTypes.has("WRONG_ZONE_GR") || errorTypes.has("WRONG_ZONE_PUTAWAY"))
          recommendations.push("Flux de réception : MIGO → emplacement REC-01/REC-02, puis LT0A pour ranger en zone STOCKAGE (B-01, A-01, etc.)");
        if (errorTypes.has("WRONG_ZONE_PICKING") || errorTypes.has("WRONG_ZONE_GI"))
          recommendations.push("Flux d'expédition : VL01N pour prélever du STOCKAGE vers EXP-01/EXP-02, puis VL02N pour poster la GI depuis le quai d'expédition");
        if (errorTypes.has("CAPACITY_OVERFLOW"))
          recommendations.push("En cas de dépassement de capacité, répartissez la quantité sur plusieurs bins STOCKAGE plutôt que de forcer un seul emplacement");
        if (!compliance.compliant)
          recommendations.push("Relancez la simulation en Mode Démonstration pour explorer librement les étapes sans pénalité");
        if (recommendations.length === 0 && errors.length === 0 && run.status === "completed") {
          const totalScorePreview = calculateTotalScore(events);
          if (moduleId === 3 && isM3ReplenishmentOnlyScenario(m3InitialStateJson)) {
            if (totalScorePreview >= getModuleScenarioPassThreshold(3)) {
              recommendations.push(
                "Excellente maîtrise de la planification Min/Max. Votre plan de réapprovisionnement respecte les seuils définis pour les deux SKU. Après validation du Module 3 par l'enseignant, poursuivez vers le Module 4.",
              );
            }
          } else {
            recommendations.push("Excellente maîtrise du flux complet ! Passez au Module 2 pour approfondir FIFO, gestion de lots et traçabilité.");
          }
        }

        const totalScore = calculateTotalScore(events);
        const { label: scoreLabel, color: scoreColor } = getScoreLabel(totalScore);

          // ── Zone flow summary ────────────────────────────────────────────────
        const zoneFlow = [
          { zone: "RÉCEPTION",  bins: RECEPTION_BINS,  color: "#3b82f6", txCount: state.transactions.filter(t => RECEPTION_BINS.includes(t.bin) && t.posted).length },
          { zone: "STOCKAGE",   bins: STOCKAGE_BINS,   color: "#10b981", txCount: state.transactions.filter(t => STOCKAGE_BINS.includes(t.bin) && t.posted).length },
          { zone: "PICKING",    bins: PICKING_BINS,    color: "#f59e0b", txCount: state.transactions.filter(t => PICKING_BINS.includes(t.bin) && t.posted).length },
          { zone: "EXPÉDITION", bins: EXPEDITION_BINS, color: "#8b5cf6", txCount: state.transactions.filter(t => EXPEDITION_BINS.includes(t.bin) && t.posted).length },
          { zone: "RÉSERVE",    bins: RESERVE_BINS,    color: "#6b7280", txCount: state.transactions.filter(t => RESERVE_BINS.includes(t.bin) && t.posted).length },
        ];

        // ── Transaction timeline ─────────────────────────────────────────────
        const transactionTimeline = state.transactions
          .filter(t => t.posted)
          .map(t => ({
            docType: t.docType,
            sku: t.sku,
            bin: t.bin,
            qty: t.qty,
            zone: RECEPTION_BINS.includes(t.bin) ? "RÉCEPTION"
              : STOCKAGE_BINS.includes(t.bin) ? "STOCKAGE"
              : PICKING_BINS.includes(t.bin) ? "PICKING"
              : EXPEDITION_BINS.includes(t.bin) ? "EXPÉDITION"
              : RESERVE_BINS.includes(t.bin) ? "RÉSERVE" : "INCONNU",
            docRef: t.docRef,
          }));

        const kpiInterpretations = moduleId === 4 || moduleId === 5
          ? pickLatestKpiInterpretationsByKey(await getKpiInterpretationsByRun(input.runId)).map((r) => ({
              kpiKey: r.kpiKey,
              studentAnswer: r.studentAnswer,
              isCorrect: r.isCorrect,
              feedback: r.feedback ?? "",
              pointsDelta: r.pointsDelta,
            }))
          : undefined;

        const scnCode = resolveScenarioScnCode(scenario);
        const learningFeedback = run.status === "completed"
          ? buildLearningFeedbackPayload({
              scnCode,
              moduleId,
              kpiInterpretations: kpiInterpretations ?? [],
              scoringEvents: events.map((e) => ({ eventType: e.eventType, message: e.message })),
            })
          : undefined;

        const m4KpiSnapshot = moduleId === 4 ? buildM4KpiSnapshot(scenario) : undefined;

        const m5KpiSnapshot = moduleId === 5
          ? await getKpiSnapshotByRun(input.runId)
          : null;
        const m5Adjustments = moduleId === 5
          ? await getInventoryAdjustmentsByRun(input.runId)
          : [];
        const m5Counts = moduleId === 5
          ? await getInventoryCountsByRun(input.runId)
          : [];

        return {
          runId: input.runId,
          isDemo: run.isDemo,
          totalScore,
          scoreLabel,
          scoreColor,
          stepBreakdown,
          errors,
          bonuses,
          recommendations,
          complianceIssues: compliance.issuesFr,
          completedSteps: state.completedSteps,
          progressPct: calculateProgressPctAllModules(state.completedSteps, moduleId, state),
          zoneFlow,
          transactionTimeline,
          kpiInterpretations: moduleId === 4 ? kpiInterpretations : undefined,
          learningFeedback: learningFeedback ?? undefined,
          m4KpiSnapshot,
          m5Report: moduleId === 5 ? {
            kpiSnapshot: m5KpiSnapshot ? {
              rotationRate: Number(m5KpiSnapshot.rotationRate),
              serviceLevel: Number(m5KpiSnapshot.serviceLevel),
              errorRate: Number(m5KpiSnapshot.errorRate),
              averageLeadTime: Number(m5KpiSnapshot.averageLeadTime),
              stockImmobilizedValue: Number(m5KpiSnapshot.stockImmobilizedValue),
            } : null,
            varianceTrail: m5Counts.map((c) => ({
              sku: c.sku,
              systemQty: Number(c.systemQty),
              countedQty: Number(c.countedQty),
              varianceQty: Number(c.varianceQty),
            })),
            adjustments: m5Adjustments.map((a) => ({
              sku: a.sku,
              varianceQty: Number(a.varianceQty),
              adjustmentQty: Number(a.adjustmentQty),
              reason: a.reason ?? "",
            })),
            contract: getM5ContractFromSeed(scenario?.initialStateJson as M5InitialStateJson),
          } : undefined,
          totalTransactions: state.transactions.filter(t => t.posted).length,
          totalErrors: errors.length,
          stepsCompleted: state.completedSteps.length,
          totalSteps: (moduleId === 1
            ? getEffectiveM1Steps(state)
            : moduleId === 2 ? getEffectiveM2Steps(state)
            : moduleId === 3 ? getM3StepsForRun(scenario?.initialStateJson as import("./rulesEngine").M3InitialStateJson, state.completedSteps as string[], events)
            : moduleId === 4 ? MODULE4_STEPS
            : getEffectiveM5Steps(scenario?.initialStateJson as M5InitialStateJson, state)).length,
          certificationUnlocked: silverStatus.silverCertified,
          silverEligible: silverStatus.silverEligible,
        };
      }),

    /** Admin/teacher: reset a student's run so they can start fresh */
    resetRun: protectedProcedure
      .input(z.object({ runId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "teacher" && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only teachers and admins can reset runs" });
        }
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        await resetRun(input.runId);
        return { success: true, message: `Run ${input.runId} has been reset successfully.` };
      }),

    state: protectedProcedure
      .input(z.object({ runId: z.number() }))
      .query(async ({ ctx, input }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        if (run.userId !== ctx.user.id && ctx.user.role !== "teacher" && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const scenario = await getScenarioById(run.scenarioId);
        const moduleId = scenario?.moduleId ?? 1;

        // DOC dispatch BEFORE buildRunState legacy M5 steps / getEffectiveM5Steps / v1 evidence.
        if (isSupervisionDocRun(scenario?.initialStateJson)) {
          const { isM5DocFeatureEnabled, canAccessM5DocAsActor } = await import("../shared/m5Doc/types");
          const { loadM5DocState } = await import("./m5Doc/persistence");
          const { computeFinalScore } = await import("../shared/m5Doc/scoringPure");
          const featureOn = isM5DocFeatureEnabled();
          if (featureOn && !canAccessM5DocAsActor(ctx.user)) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "DOC_STUDENT_NOT_ALLOWLISTED: Student not on M5_DOC_STUDENT_ALLOWLIST",
            });
          }
          let docScore = 0;
          let completed: string[] = [];
          if (featureOn) {
            const docState = await loadM5DocState(input.runId, scenario.initialStateJson.scnCode);
            docScore = computeFinalScore(docState).finalScore;
            completed = Object.keys(docState.officialScores);
          }
          return {
            run,
            scenario,
            interactionModel: "supervision-doc-v1" as const,
            evidenceVersion: "m5-session-v2" as const,
            completedSteps: completed,
            inventory: {},
            compliance: { compliant: true, issuesFr: [] as string[], issuesEn: [] as string[] },
            nextStep: null,
            progressPct: Math.round((completed.length / M5_DOC_INTERACTION_ORDER.length) * 100),
            totalScore: docScore,
            moduleId,
            atpShortage: null,
            steps: M5_DOC_INTERACTION_ORDER.map((id) => ({
              code: id,
              labelFr: id,
              labelEn: id,
            })),
            isDemo: run.isDemo,
            kpiInterpretations: undefined,
            m4KpiSnapshot: undefined,
            transactions: [],
            demoBackendState: null,
            unpostedTransactions: [],
            nextActionHint: null,
            m3Evidence: undefined,
            m5DocFeatureEnabled: featureOn,
          };
        }

        const state = await buildRunState(input.runId);
        // In demo mode, score is always 0 (not tracked)
        // Score is now calculated for both modes; isDemo flag distinguishes official vs pedagogical
        const totalScore = calculateTotalScore(await getScoringEventsByRun(input.runId));
        const compliance = checkCompliance(state);
        const nextStep = getNextRequiredStepAllModules(state.completedSteps, moduleId, state);
        const progressPct = calculateProgressPctAllModules(state.completedSteps, moduleId, state);
        const scn007Hint = moduleId === 2 ? getScn007NextActionHint(state) : null;
        const replenishmentSuggestions = moduleId === 3
          ? await getReplenishmentSuggestionsByRun(input.runId)
          : [];
        const scoringEventsForSteps = moduleId === 3 ? await getScoringEventsByRun(input.runId) : [];
        const kpiInterpretations = moduleId === 4
          ? pickLatestKpiInterpretationsByKey(await getKpiInterpretationsByRun(input.runId)).map((r) => ({
              kpiKey: r.kpiKey,
              studentAnswer: r.studentAnswer,
              isCorrect: r.isCorrect,
              feedback: r.feedback ?? "",
              pointsDelta: r.pointsDelta,
            }))
          : undefined;
        const m4KpiSnapshot = moduleId === 4 ? buildM4KpiSnapshot(scenario) : undefined;
        const atpShortage = moduleId === 1 ? detectScn003AtpShortage(state) : null;
        return {
          run,
          scenario,
          interactionModel: moduleId === 5 ? ("ops-ledger-v1" as const) : undefined,
          completedSteps: state.completedSteps,
          inventory: state.inventory,
          compliance,
          nextStep,
          progressPct,
          totalScore,
          moduleId,
          atpShortage,
          steps: moduleId === 1 ? getEffectiveM1Steps(state)
            : moduleId === 2 ? getEffectiveM2Steps(state)
            : moduleId === 3 ? getM3StepsForRun(
                scenario?.initialStateJson as import("./rulesEngine").M3InitialStateJson,
                state.completedSteps as string[],
                scoringEventsForSteps,
              )
            : moduleId === 4 ? MODULE4_STEPS
            : getEffectiveM5Steps(state.m5InitialStateJson, state),
          isDemo: run.isDemo,
          kpiInterpretations,
          m4KpiSnapshot,
          // Full transaction ledger for monitor (M2 preloaded PO/GR must be visible)
          transactions: state.transactions,
          // Backend transparency data (visible only in demo mode on frontend)
          demoBackendState: run.isDemo ? {
            transactions: state.transactions,
            cycleCounts: state.cycleCounts,
            inventory: state.inventory,
          } : null,
          // Unposted transactions always exposed for Ghost GR recovery (SCN-002, SCN-005)
          unpostedTransactions: state.transactions.filter((t) => !t.posted),
          /** SCN-007: dynamic split guidance while REC still has LOT-2025-002 */
          nextActionHint: scn007Hint,
          m3Evidence: moduleId === 3 ? {
            inventoryCounts: state.inventoryCounts,
            inventoryAdjustments: state.inventoryAdjustments,
            replenishmentSuggestions: replenishmentSuggestions.map((s) => ({
              sku: s.sku,
              systemQty: Number(s.systemQty),
              suggestedQty: Number(s.suggestedQty),
              reason: s.reason,
            })),
            initialStateJson: scenario?.initialStateJson ?? null,
          } : undefined,
        };
      }),
  }),

  // ─── Transactions ────────────────────────────────────────────────────────────
  transactions: router({
    list: protectedProcedure
      .input(z.object({ runId: z.number() }))
      .query(({ input }) => getTransactionsByRun(input.runId)),

    // Submit PO
    submitPO: protectedProcedure
      .input(
        z.object({
          runId: z.number(),
          sku: z.string(),
          bin: z.string(),
          qty: z.number().positive(),
          docRef: z.string(),
          comment: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        const state = await buildRunState(input.runId);
        const stepCode = resolveScn003CorrectiveStepCode(state, "PO");
        const validation = canExecuteStep(stepCode, state);
        if (!validation.allowed) {
          if (!run.isDemo) {
            // Evaluation mode: penalize and block
            await addScoringEvent({ runId: input.runId, eventType: "OUT_OF_SEQUENCE", pointsDelta: -5, message: validation.reasonFr ?? "" });
            throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(validation, ctx.req) });
          }
          // Demo mode: warn but allow (return warning in response)
        }
        await addTransaction({ runId: input.runId, docType: "PO", moveType: "ME21N", sku: input.sku, bin: input.bin, qty: String(input.qty), posted: true, docRef: input.docRef, comment: input.comment ?? null });
        await markStepComplete(input.runId, stepCode);
        // Scoring applies in both eval and demo modes (demo score is non-official)
        const rulePO = getScoringRule("PO_COMPLETED");
        await addScoringEventOnce({ runId: input.runId, eventType: "PO_COMPLETED", pointsDelta: rulePO!.points, message: rulePO!.descriptionFr });
        return { success: true, demoWarning: run.isDemo && !validation.allowed ? pickReason(validation, ctx.req) : null };
      }),

    // Submit GR
    submitGR: protectedProcedure
      .input(
        z.object({
          runId: z.number(),
          sku: z.string(),
          bin: z.string(),
          qty: z.number().positive(),
          docRef: z.string(),
          comment: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        const state = await buildRunState(input.runId);
        const stepCode = resolveScn003CorrectiveStepCode(state, "GR");
        const validation = canExecuteStep(stepCode, state);
        if (!validation.allowed) {
          if (!run.isDemo) {
            await addScoringEvent({ runId: input.runId, eventType: "OUT_OF_SEQUENCE", pointsDelta: -5, message: validation.reasonFr ?? "" });
            throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(validation, ctx.req) });
          }
        }
        // Zone validation: GR must go to RECEPTION bin
        const pendingGhostGr = state.transactions.find((t) => t.docType === "GR" && !t.posted);
        if (pendingGhostGr) {
          const msgFr = `Une GR en attente existe déjà (${pendingGhostGr.docRef ?? "sans réf."}). Utilisez « Régulariser le document » depuis le moniteur — ne créez pas une nouvelle GR.`;
          const msgEn = `A pending GR already exists (${pendingGhostGr.docRef ?? "no ref"}). Use « Regularize document » from the monitor — do not create a new GR.`;
          if (!run.isDemo) {
            throw new TRPCError({ code: "BAD_REQUEST", message: pickReason({ reasonFr: msgFr, reasonEn: msgEn }, ctx.req) });
          }
        }
        const zoneCheck = validateGRZone(input.bin);
        if (!zoneCheck.allowed) {
          if (!run.isDemo) {
            await addScoringEvent({ runId: input.runId, eventType: "WRONG_ZONE_GR", pointsDelta: -3, message: `GR: ${zoneCheck.reasonFr}` });
            throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(zoneCheck, ctx.req) });
          }
        }
        await addTransaction({ runId: input.runId, docType: "GR", moveType: "101", sku: input.sku, bin: input.bin, qty: String(input.qty), posted: true, docRef: input.docRef, comment: input.comment ?? null });
        await markStepComplete(input.runId, stepCode);
        const ruleGR = getScoringRule("GR_COMPLETED");
        await addScoringEventOnce({ runId: input.runId, eventType: "GR_COMPLETED", pointsDelta: ruleGR!.points, message: ruleGR!.descriptionFr });
        const demoWarnGR = run.isDemo && (!validation.allowed || !zoneCheck.allowed)
          ? [!validation.allowed ? pickReason(validation, ctx.req) : null, !zoneCheck.allowed ? pickReason(zoneCheck, ctx.req) : null].filter(Boolean).join(" | ")
          : null;
        return { success: true, demoWarning: demoWarnGR };
      }),

    // Submit PUTAWAY_M1 (RECEPTION → STOCKAGE)
    submitPUTAWAY_M1: protectedProcedure
      .input(
        z.object({
          runId: z.number(),
          sku: z.string(),
          fromBin: z.string(),
          toBin: z.string(),
          qty: z.number().positive(),
          docRef: z.string(),
          comment: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        const state = await buildRunState(input.runId);
        const stepCode = resolveScn003CorrectiveStepCode(state, "PUTAWAY_M1");
        const validation = canExecuteStep(stepCode, state);
        if (!validation.allowed) {
          if (!run.isDemo) {
            await addScoringEvent({ runId: input.runId, eventType: "OUT_OF_SEQUENCE", pointsDelta: -5, message: validation.reasonFr ?? "" });
            throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(validation, ctx.req) });
          }
        }
        // Zone validation: fromBin must be RECEPTION, toBin must be STOCKAGE/PICKING/RESERVE
        const zoneCheck = validatePutawayM1Zone(input.fromBin, input.toBin);
        if (!zoneCheck.allowed) {
          if (!run.isDemo) {
            await addScoringEvent({ runId: input.runId, eventType: "WRONG_ZONE_PUTAWAY", pointsDelta: -3, message: `PUTAWAY_M1: ${zoneCheck.reasonFr}` });
            throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(zoneCheck, ctx.req) });
          }
        }
        const { validateScn005PutawayInput, isScn005DualPutawayComplete, isScn005Scenario, getScn005PendingPutaways } = await import("./scn005");
        const scn005PutawayCheck = validateScn005PutawayInput(state, input);
        if (!scn005PutawayCheck.allowed) {
          if (!run.isDemo) {
            await addScoringEvent({ runId: input.runId, eventType: "OUT_OF_SEQUENCE", pointsDelta: -5, message: scn005PutawayCheck.reasonFr });
            throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(scn005PutawayCheck, ctx.req) });
          }
        }
        // Record movement: debit fromBin (REC-01 → 0), credit toBin (STOCKAGE)
        await addTransaction({ runId: input.runId, docType: "PUTAWAY_M1", moveType: "LT0A", sku: input.sku, bin: input.fromBin, qty: String(-input.qty), posted: true, docRef: input.docRef, comment: `Rangement sortie ${input.fromBin}` });
        await addTransaction({ runId: input.runId, docType: "PUTAWAY_M1", moveType: "LT0A", sku: input.sku, bin: input.toBin, qty: String(input.qty), posted: true, docRef: input.docRef, comment: `Rangement ${input.fromBin} → ${input.toBin}${input.comment ? " | " + input.comment : ""}` });
        const updatedState = await buildRunState(input.runId);
        const isScn005 = isScn005Scenario(state);
        const dualPutawayDone = !isScn005 || isScn005DualPutawayComplete(updatedState);
        // SCN-005: defer PUTAWAY_M1/STOCK completion until both SKU lines are put away
        if (dualPutawayDone) {
          await markStepComplete(input.runId, stepCode);
          if (stepCode === "PUTAWAY_M1") {
            await markStepComplete(input.runId, "STOCK");
          }
          const scn004 = isScn004Scenario(state);
          const scn005 = isScn005Scenario(state);
          const putawayPoints = scn004
            ? getScn004StepMaxPoints("PUTAWAY_M1")
            : scn005
              ? getScn005StepMaxPoints("PUTAWAY_M1")
              : 5;
          await addScoringEventOnce({ runId: input.runId, eventType: "PUTAWAY_M1_COMPLETED", pointsDelta: putawayPoints, message: `Rangement correct : ${input.fromBin} → ${input.toBin}` });
          if (scn004 || scn005) {
            await addScoringEventOnce({
              runId: input.runId,
              eventType: "STOCK_AVAILABLE_COMPLETED",
              pointsDelta: scn004
                ? getScn004StepMaxPoints("STOCK")
                : getScn005StepMaxPoints("STOCK"),
              message: "Stock disponible en STOCKAGE — prêt pour comptage cyclique",
            });
          }
        }
        const remainingPutaways = isScn005 ? getScn005PendingPutaways(updatedState) : [];
        const demoWarn = run.isDemo && (!validation.allowed || !zoneCheck.allowed)
          ? [!validation.allowed ? pickReason(validation, ctx.req) : null, !zoneCheck.allowed ? pickReason(zoneCheck, ctx.req) : null].filter(Boolean).join(" | ")
          : null;
        return {
          success: true,
          demoWarning: demoWarn,
          complete: remainingPutaways.length === 0,
          remainingSkus: remainingPutaways.map((p) => p.sku),
        };
      }),

    // Submit SO
    submitSO: protectedProcedure
      .input(
        z.object({
          runId: z.number(),
          sku: z.string(),
          bin: z.string(),
          qty: z.number().positive(),
          docRef: z.string(),
          comment: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        const state = await buildRunState(input.runId);
        const validation = canExecuteStep("SO", state);
        if (!validation.allowed) {
          if (!run.isDemo) {
            await addScoringEvent({ runId: input.runId, eventType: "OUT_OF_SEQUENCE", pointsDelta: -5, message: validation.reasonFr ?? "" });
            throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(validation, ctx.req) });
          }
        }
        await addTransaction({ runId: input.runId, docType: "SO", moveType: "VA01", sku: input.sku, bin: input.bin, qty: String(input.qty), posted: true, docRef: input.docRef, comment: input.comment ?? null });
        await markStepComplete(input.runId, "SO");
        const ruleSO = getScoringRule("SO_COMPLETED");
        await addScoringEventOnce({ runId: input.runId, eventType: "SO_COMPLETED", pointsDelta: ruleSO!.points, message: ruleSO!.descriptionFr });
        const updatedState = await buildRunState(input.runId);
        const atpShortage = detectScn003AtpShortage(updatedState);
        const lang = ctx.req?.headers?.["accept-language"]?.includes("en") ? "en" : "fr";
        return {
          success: true,
          demoWarning: run.isDemo && !validation.allowed ? pickReason(validation, ctx.req) : null,
          atpShortageDetected: !!atpShortage?.active,
          atpShortage: atpShortage ?? null,
          pedagogicalMessage: atpShortage ? getScn003AtpShortageMessage(atpShortage, lang) : null,
        };
      }),

    // Submit GI
    submitGI: protectedProcedure
      .input(
        z.object({
          runId: z.number(),
          sku: z.string(),
          bin: z.string(),
          qty: z.number().positive(),
          docRef: z.string(),
          comment: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        const state = await buildRunState(input.runId);
        const validation = canExecuteStep("GI", state);
        if (!validation.allowed) {
          const scn003ShortageBlock = isScn003CorrectiveReplenishmentRequired(state);
          if (!run.isDemo || scn003ShortageBlock) {
            if (!scn003ShortageBlock) {
              await addScoringEvent({ runId: input.runId, eventType: "OUT_OF_SEQUENCE", pointsDelta: -5, message: validation.reasonFr ?? "" });
            } else {
              await addScoringEvent({ runId: input.runId, eventType: "NEGATIVE_STOCK_ATTEMPT", pointsDelta: -5, message: validation.reasonFr ?? "" });
            }
            throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(validation, ctx.req) });
          }
        }
        const stockCheck = canIssueStock(input.sku, input.bin, input.qty, state.inventory);
        if (!stockCheck.allowed) {
          if (!run.isDemo) {
            await addScoringEvent({ runId: input.runId, eventType: "NEGATIVE_STOCK_ATTEMPT", pointsDelta: -5, message: stockCheck.reasonFr ?? "" });
            throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(stockCheck, ctx.req) });
          }
          // Demo: allow negative stock with warning
        }
        // Zone validation: GI must use EXPEDITION bin
        const zoneCheckGI = validateGIZone(input.bin);
        if (!zoneCheckGI.allowed) {
          if (!run.isDemo) {
            await addScoringEvent({ runId: input.runId, eventType: "WRONG_ZONE_GI", pointsDelta: -3, message: `GI: ${zoneCheckGI.reasonFr}` });
            throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(zoneCheckGI, ctx.req) });
          }
        }
        await addTransaction({ runId: input.runId, docType: "GI", moveType: "261", sku: input.sku, bin: input.bin, qty: String(input.qty), posted: true, docRef: input.docRef, comment: input.comment ?? null });
        await markStepComplete(input.runId, "GI");
        const ruleGI = getScoringRule("GI_COMPLETED");
        await addScoringEventOnce({ runId: input.runId, eventType: "GI_COMPLETED", pointsDelta: ruleGI!.points, message: ruleGI!.descriptionFr });
        const demoWarning = run.isDemo && (!validation.allowed || !stockCheck.allowed || !zoneCheckGI.allowed)
          ? [!validation.allowed ? pickReason(validation, ctx.req) : null, !stockCheck.allowed ? pickReason(stockCheck, ctx.req) : null, !zoneCheckGI.allowed ? pickReason(zoneCheckGI, ctx.req) : null].filter(Boolean).join(" | ")
          : null;
        return { success: true, demoWarning };
      }),

    // Submit PICKING_M1 (STOCKAGE → EXPEDITION)
    submitPICKING_M1: protectedProcedure
      .input(
        z.object({
          runId: z.number(),
          sku: z.string(),
          fromBin: z.string(),
          toBin: z.string(),
          qty: z.number().positive(),
          docRef: z.string(),
          comment: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        const state = await buildRunState(input.runId);
        const validation = canExecuteStep("PICKING_M1", state);
        if (!validation.allowed) {
          const scn003ShortageBlock = isScn003CorrectiveReplenishmentRequired(state);
          if (!run.isDemo || scn003ShortageBlock) {
            if (!scn003ShortageBlock) {
              await addScoringEvent({ runId: input.runId, eventType: "OUT_OF_SEQUENCE", pointsDelta: -5, message: validation.reasonFr ?? "" });
            } else {
              await addScoringEvent({ runId: input.runId, eventType: "NEGATIVE_STOCK_ATTEMPT", pointsDelta: -5, message: validation.reasonFr ?? "" });
            }
            throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(validation, ctx.req) });
          }
        }
        // Zone validation: fromBin must be STOCKAGE/PICKING/RESERVE, toBin must be EXPEDITION
        const zoneCheck = validatePickingM1Zone(input.fromBin, input.toBin);
        if (!zoneCheck.allowed) {
          if (!run.isDemo) {
            await addScoringEvent({ runId: input.runId, eventType: "WRONG_ZONE_PICKING", pointsDelta: -3, message: `PICKING_M1: ${zoneCheck.reasonFr}` });
            throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(zoneCheck, ctx.req) });
          }
        }
        // Stock check: verify enough stock in fromBin
        const stockCheck = canIssueStock(input.sku, input.fromBin, input.qty, state.inventory);
        if (!stockCheck.allowed) {
          if (!run.isDemo) {
            await addScoringEvent({ runId: input.runId, eventType: "NEGATIVE_STOCK_ATTEMPT", pointsDelta: -5, message: stockCheck.reasonFr ?? "" });
            throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(stockCheck, ctx.req) });
          }
        }
        // Record movement: deduct from fromBin, add to toBin (EXPEDITION)
        await addTransaction({ runId: input.runId, docType: "PICKING", moveType: "VL01N", sku: input.sku, bin: input.fromBin, qty: String(-input.qty), posted: true, docRef: input.docRef, comment: `Prélèvement ${input.fromBin} → ${input.toBin}${input.comment ? " | " + input.comment : ""}` });
        await addTransaction({ runId: input.runId, docType: "PICKING_M1", moveType: "VL01N", sku: input.sku, bin: input.toBin, qty: String(input.qty), posted: true, docRef: input.docRef, comment: `Prélèvement arrivée ${input.toBin}` });
        await markStepComplete(input.runId, "PICKING_M1");
        await addScoringEventOnce({ runId: input.runId, eventType: "PICKING_M1_COMPLETED", pointsDelta: 5, message: `Prélèvement correct : ${input.fromBin} → ${input.toBin}` });
        const demoWarn = run.isDemo && (!validation.allowed || !zoneCheck.allowed || !stockCheck.allowed)
          ? [!validation.allowed ? pickReason(validation, ctx.req) : null, !zoneCheck.allowed ? pickReason(zoneCheck, ctx.req) : null, !stockCheck.allowed ? pickReason(stockCheck, ctx.req) : null].filter(Boolean).join(" | ")
          : null;
        return { success: true, demoWarning: demoWarn };
      }),

    // Submit ADJ
    submitADJ: protectedProcedure
      .input(
        z.object({
          runId: z.number(),
          sku: z.string(),
          bin: z.string(),
          qty: z.number(),
          docRef: z.string(),
          comment: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        if (run.userId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" });
        const state = await buildRunState(input.runId);

        const pendingCc = state.cycleCounts.filter(
          (c) => c.sku === input.sku && c.variance !== 0 && !c.resolved,
        );
        const ccBin = pendingCc.find((c) => c.bin === input.bin)?.bin ?? pendingCc[0]?.bin;
        const adjInput = ccBin ? { ...input, bin: ccBin } : input;

        const adjCheck = validateM1AdjPosting(state, adjInput);
        if (!adjCheck.allowed) {
          throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(adjCheck, ctx.req) });
        }
        await addTransaction({ runId: input.runId, docType: "ADJ", moveType: "701", sku: adjInput.sku, bin: adjInput.bin, qty: String(adjInput.qty), posted: true, docRef: input.docRef, comment: input.comment ?? null });
        // Auto-resolve all pending cycle count variances for this run after ADJ is posted
        await resolveAllCycleCountsByRun(input.runId);
        // Mark ADJ step complete
        await markStepComplete(input.runId, "ADJ");
        // Award ADJ_COMPLETED scoring event (once per run — covers SCN-004 and SCN-005)
        if (!run.isDemo) {
          const ruleAdj = getScoringRule("ADJ_COMPLETED");
          if (ruleAdj) {
            await addScoringEventOnce({ runId: input.runId, eventType: "ADJ_COMPLETED", pointsDelta: ruleAdj.points, message: ruleAdj.descriptionFr });
          }
        }
        return { success: true };
      }),

    // ── SCN-002 Ghost GR Recovery: Post an existing unposted transaction ──────
    // Pedagogical intent: student "locates" the phantom GR and posts it via MB01/MIGO
    postExistingTransaction: protectedProcedure
      .input(
        z.object({
          runId: z.number(),
          txDocRef: z.string(), // docRef of the unposted transaction to post
        })
      )
      .mutation(async ({ input, ctx }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        if (run.userId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" });
        const txs = await getTransactionsByRun(input.runId);
        const target = txs.find((t: any) => t.docRef === input.txDocRef && !t.posted);
        if (!target) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Transaction non postée introuvable ou déjà postée. Vérifiez la référence du document.",
          });
        }
        const { ghostGrReceptionBin } = await import("./m1Preload");
        const receptionBin = ghostGrReceptionBin((target as any).docRef);
        if (receptionBin && (target as any).docType === "GR") {
          const db = await import("./db").then((m) => m.getDb());
          if (db) {
            const { transactions: txTable } = await import("../drizzle/schema");
            const { eq } = await import("drizzle-orm");
            await db.update(txTable).set({ posted: true, bin: receptionBin }).where(eq(txTable.id, (target as any).id));
          } else {
            await postTransaction((target as any).id);
          }
        } else {
          await postTransaction((target as any).id);
        }
        // Mark GR step complete if not already done and this is a GR transaction
        if ((target as any).docType === "GR") {
          const prog = await getProgressByRun(input.runId);
          const grDone = prog.some((p: any) => p.stepCode === "GR" && p.completed);
          if (!grDone) {
            await markStepComplete(input.runId, "GR");
            if (!run.isDemo) {
              const rule = getScoringRule("GR_COMPLETED");
              if (rule) {
                await addScoringEventOnce({
                  runId: input.runId,
                  eventType: "GR_COMPLETED",
                  pointsDelta: rule.points,
                  message: `GR fantôme détectée et postée : ${input.txDocRef}`,
                });
              }
            }
          }
        }
        return {
          success: true,
          message: `Transaction ${input.txDocRef} postée avec succès. Le stock a été mis à jour.`,
          docType: (target as any).docType,
        };
      }),
  }),
  // ─── Cycle Counts ─────────────────────────────────────────────────────────────
  cycleCounts: router({
    list: protectedProcedure
      .input(z.object({ runId: z.number() }))
      .query(({ input }) => getCycleCountsByRun(input.runId)),

    submit: protectedProcedure
      .input(
        z.object({
          runId: z.number(),
          sku: z.string(),
          bin: z.string(),
          physicalQty: z.number().min(0),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        if (run.userId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" });
        const state = await buildRunState(input.runId);
        const { validateM1CycleCountForScn004 } = await import("./scn004");
        const { validateM1CycleCountForScn005 } = await import("./scn005");
        const ccBinCheck = validateM1CycleCountForScn004(state, input);
        if (!ccBinCheck.allowed) {
          throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(ccBinCheck, ctx.req) });
        }
        const ccBinCheck005 = validateM1CycleCountForScn005(state, input);
        if (!ccBinCheck005.allowed) {
          throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(ccBinCheck005, ctx.req) });
        }
        const key = `${input.sku}::${input.bin}`;
        const inventorySystemQty = state.inventory[key] ?? 0;
        const { resolveScn004CycleCount } = await import("./scn004");
        const { resolveScn005CycleCount } = await import("./scn005");
        const resolved = isScn005Scenario(state)
          ? resolveScn005CycleCount(state.scenarioInitialStateJson, input, inventorySystemQty)
          : resolveScn004CycleCount(state.scenarioInitialStateJson, input, inventorySystemQty);
        const { systemQty, physicalQty, variance } = resolved;
        await addCycleCount({
          runId: input.runId,
          sku: input.sku,
          bin: input.bin,
          systemQty: String(systemQty),
          physicalQty: String(physicalQty),
          variance: String(variance),
        });
        await markStepComplete(input.runId, "CC");
        const ruleCC = getScoringRule("CC_COMPLETED");
        await addScoringEventOnce({ runId: input.runId, eventType: "CC_COMPLETED", pointsDelta: ruleCC!.points, message: ruleCC!.descriptionFr });
        return { success: true, variance, systemQty, physicalQty, injected: resolved.injected };
      }),

    resolve: protectedProcedure
      .input(z.object({ ccId: z.number(), runId: z.number() }))
      .mutation(async ({ input }) => {
        await resolveCycleCount(input.ccId);
        return { success: true };
      }),
  }),

  // ─── Compliance ──────────────────────────────────────────────────────────────
  compliance: router({
    check: protectedProcedure
      .input(z.object({ runId: z.number() }))
      .query(async ({ input }) => {
        const state = await buildRunState(input.runId);
        return checkCompliance(state);
      }),
    finalize: protectedProcedure
      .input(z.object({ runId: z.number() }))
      .mutation(async ({ input }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        // Guard: prevent double-finalization of already-completed runs
        if ((run as any).status === "completed") {
          return { success: true, isDemo: run.isDemo, demoWarning: null };
        }
        const state = await buildRunState(input.runId);
        const compliance = checkCompliance(state);
        if (!run.isDemo) {
          // Evaluation mode: hard block on non-compliance
          if (!compliance.compliant) {
            throw new TRPCError({ code: "BAD_REQUEST", message: compliance.issuesFr.join("; ") });
          }
          await markStepComplete(input.runId, "COMPLIANCE");
          const rule = getScoringRule("COMPLIANCE_OK");
          await addScoringEvent({ runId: input.runId, eventType: "COMPLIANCE_OK", pointsDelta: rule!.points, message: rule!.descriptionFr });

          // Check for perfect run bonus
          const events = await getScoringEventsByRun(input.runId);
          const hasErrors = events.some((e) => e.pointsDelta < 0);
          if (!hasErrors) {
            const bonus = getScoringRule("PERFECT_RUN_BONUS");
            await addScoringEvent({ runId: input.runId, eventType: "PERFECT_RUN_BONUS", pointsDelta: bonus!.points, message: bonus!.descriptionFr });
          }
          await completeRun(input.runId);
        } else {
          // Demo mode: allow finalization with scoring (non-official)
          await markStepComplete(input.runId, "COMPLIANCE");
          const ruleCOMPL = getScoringRule("COMPLIANCE_OK");
          await addScoringEvent({ runId: input.runId, eventType: "COMPLIANCE_OK", pointsDelta: ruleCOMPL!.points, message: ruleCOMPL!.descriptionFr });
          // Check for perfect run bonus in demo too
          const demoEvents = await getScoringEventsByRun(input.runId);
          const demoHasErrors = demoEvents.some((e) => e.pointsDelta < 0);
          if (!demoHasErrors) {
            const bonus = getScoringRule("PERFECT_RUN_BONUS");
            await addScoringEvent({ runId: input.runId, eventType: "PERFECT_RUN_BONUS", pointsDelta: bonus!.points, message: bonus!.descriptionFr });
          }
          await completeRun(input.runId);
        }
        return { success: true, isDemo: run.isDemo, demoWarning: run.isDemo && !compliance.compliant ? compliance.issuesFr.join("; ") : null };
      }),
  }),

  // ─── Scoring ─────────────────────────────────────────────────────────────────
  scoring: router({
    events: protectedProcedure
      .input(z.object({ runId: z.number() }))
      .query(({ input }) => getScoringEventsByRun(input.runId)),
    total: protectedProcedure
      .input(z.object({ runId: z.number() }))
      .query(async ({ input }) => {
        const run = await getRunById(input.runId);
        // Return score for both modes; caller uses isDemo flag to label it as non-official
        const events = await getScoringEventsByRun(input.runId);
        return { total: calculateTotalScore(events), events };
      }),
  }),

  // ─── Teacher Monitor ─────────────────────────────────────────────────────────
  // ─── Module 2: Warehouse Execution ──────────────────────────────────────────
  warehouse: router({
    /** Module access flag — M1–M5 open when authenticated (no progression checkpoints). */
    checkAccess: protectedProcedure.query(async ({ ctx }) => {
      const passedIds = await getPassedModuleIds(ctx.user.id);
      const unlocked = canAccessLearningModule({
        authenticated: true,
        enrolledInCohort: true,
        moduleId: 2,
      });
      return { unlocked, passedModuleIds: passedIds };
    }),

    /** Get all bin capacities (for UI dropdowns) */
    binCapacities: protectedProcedure.query(() => getAllBinCapacities()),

    /** Get putaway records for a run */
    putawayList: protectedProcedure
      .input(z.object({ runId: z.number() }))
      .query(({ input }) => getPutawayByRun(input.runId)),

    /** Submit a putaway operation */
    submitPutaway: protectedProcedure
      .input(
        z.object({
          runId: z.number(),
          sku: z.string(),
          fromBin: z.string(),
          toBin: z.string(),
          qty: z.number().positive(),
          lotNumber: z.string(),
          receivedAt: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        if (run.userId !== ctx.user.id && ctx.user.role !== "teacher" && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const state = await buildRunState(input.runId);
        const allBinCaps = await getAllBinCapacities();
        const allBins = await getAllBins();

        const binCapacities: Record<string, number> = {};
        for (const bc of allBinCaps) binCapacities[bc.binCode] = bc.maxCapacity;
        for (const b of allBins) {
          if (!(b.binCode in binCapacities)) binCapacities[b.binCode] = b.maxCapacity ?? 500;
        }

        const binCurrentLoad = calculateBinLoad(
          state.transactions.map((t) => ({ docType: t.docType, bin: t.bin, qty: t.qty, posted: t.posted }))
        );

        const existingPutaway = await getPutawayByRun(input.runId);
        const existingLots = existingPutaway
          .filter((p) => p.sku === input.sku)
          .map((p) => ({ lotNumber: p.lotNumber ?? "", receivedAt: new Date(p.receivedAt), qty: p.qty }))
          .sort((a, b) => a.receivedAt.getTime() - b.receivedAt.getTime());

        const receivedAt = new Date(input.receivedAt);
        const validation = validatePutaway({
          sku: input.sku,
          fromBin: input.fromBin,
          toBin: input.toBin,
          qty: input.qty,
          binCapacities,
          binCurrentLoad,
          existingLots,
          lotNumber: input.lotNumber,
          receivedAt,
        });

        if (!validation.allowed) {
          if (!run.isDemo) {
            await addScoringEvent({
              runId: input.runId,
              eventType: validation.penaltyEvent ?? "OUT_OF_SEQUENCE",
              pointsDelta: validation.penaltyPoints ?? -5,
              message: validation.reasonFr ?? "",
            });
            throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(validation, ctx.req) });
          }
          return { success: true, demoWarning: pickReason(validation, ctx.req) };
        }

        // Canonical SCN-007 contract — reject before any mutation (both endpoints).
        const scn007Check = validateScn007PutawayContract(state, {
          sku: input.sku,
          fromBin: input.fromBin,
          toBin: input.toBin,
          qty: input.qty,
          lotNumber: input.lotNumber,
        });
        if (!scn007Check.allowed) {
          if (!run.isDemo) {
            await addScoringEvent({
              runId: input.runId,
              eventType: "OUT_OF_SEQUENCE",
              pointsDelta: -5,
              message: scn007Check.reasonFr,
            });
          }
          throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(scn007Check, ctx.req) });
        }

        await addPutawayRecord({ runId: input.runId, sku: input.sku, fromBin: input.fromBin, toBin: input.toBin, qty: input.qty, lotNumber: input.lotNumber, receivedAt });
        await addTransaction({ runId: input.runId, docType: "PUTAWAY", moveType: "LT01", sku: input.sku, bin: input.toBin, qty: String(input.qty), posted: true, docRef: `PUT-${input.lotNumber}`, comment: `Rangement de ${input.fromBin} vers ${input.toBin}` });

        const scenario = await getScenarioById(run.scenarioId);
        // Legacy warehouse path only credits destination; project reception drain for completion gate.
        const projectedInventory = projectInventoryAfterPutaway(state.inventory, {
          sku: input.sku,
          fromBin: input.fromBin,
          toBin: input.toBin,
          qty: input.qty,
        });
        const putDocRef = `PUT-${input.lotNumber}`;
        const projectedTransactions = projectTransactionsAfterPutaway(state.transactions, {
          sku: input.sku,
          fromBin: input.fromBin,
          toBin: input.toBin,
          qty: input.qty,
          docRef: putDocRef,
        });
        const projectedState = {
          ...state,
          inventory: projectedInventory,
          transactions: projectedTransactions,
          scnCode: resolveScenarioScnCode(scenario),
          scenarioId: run.scenarioId,
          scenarioName: scenario?.name ?? null,
          scenarioInitialStateJson: (scenario?.initialStateJson as Record<string, unknown> | null) ?? null,
        };
        const putawayDone = isM2PutawayStepComplete(projectedState);
        const alreadyComplete = state.completedSteps.includes("PUTAWAY") && (
          isScn007Scenario(state) ? isScn007PutawayComplete(state) : true
        );
        if (putawayDone && !alreadyComplete) {
          await markStepComplete(input.runId, "PUTAWAY");
          if (!run.isDemo) {
            const putawayRule = getScoringRule("PUTAWAY_COMPLETED");
            const putawayPts = isScn007Scenario(projectedState)
              ? getScn007StepMaxPoints("PUTAWAY")
              : putawayRule!.points;
            await addScoringEvent({ runId: input.runId, eventType: "PUTAWAY_COMPLETED", pointsDelta: putawayPts, message: "Rangement structuré validé (bin + capacité)" });
          }
        }
        return { success: true, demoWarning: null, putawayComplete: putawayDone };
      }),

    /** Get module progress for current user */
    myProgress: protectedProcedure.query(async ({ ctx }) => {
      let rows = await getModuleProgressByUser(ctx.user.id);
      if (isCheckpointEngineEnabled()) {
        const stale = rows.some(
          (r) =>
            isCheckpointModule(r.moduleId) &&
            ((r.passed &&
              (r.progressPct == null ||
                r.progressPct === 0 ||
                r.completedScenarios == null ||
                r.completedScenarios === 0)) ||
              (r.progressPct != null &&
                r.progressPct > 0 &&
                (r.scenarioStatusJson == null || r.completedScenarios == null))),
        );
        if (stale) {
          await recomputeAllModuleCheckpoints(ctx.user.id);
          rows = await getModuleProgressByUser(ctx.user.id);
        }
      }
      return rows;
    }),

    /** Get all module progress (teacher view) */
    allModuleProgress: teacherProcedure
      .input(cohortFilterInput)
      .query(async ({ ctx, input }) => {
        const { studentUserIds } = await resolveCohortScope(
          ctx.user.id,
          input.cohortId,
          ctx.user.role === "admin",
        );
        return getAllModuleProgressForMonitor(studentUserIds);
      }),

    /** Record module pass/fail after scenario completion (GOV-T01 thresholds) */
    recordModulePass: protectedProcedure
      .input(z.object({ moduleId: z.number(), score: z.number() }))
      .mutation(async ({ ctx, input }) => {
        let passed: boolean;

        if (isCheckpointModule(input.moduleId) && isCheckpointEngineEnabled()) {
          const snapshot = await recomputeModuleCheckpoint(ctx.user.id, input.moduleId);
          passed = snapshot?.passed ?? false;
        } else {
          const existing = await getModuleProgressRow(ctx.user.id, input.moduleId);
          const result = computeModulePassResult(
            input.moduleId,
            input.score,
            existing?.passed ?? false,
          );
          passed = result.passed;
          const bestScore = Math.max(existing?.bestScore ?? 0, input.score);
          await upsertModuleProgress({
            userId: ctx.user.id,
            moduleId: input.moduleId,
            passed,
            bestScore,
            completedAt: passed ? (existing?.completedAt ?? new Date()) : undefined,
          });
        }

        // Check for M1 Silver Certification unlock conditions
        if (input.moduleId === 1) {
          const m1QuizPassed = await checkM1QuizPassed(ctx.user.id);
          const allM1ScenariosCompleted = await checkAllM1ScenariosCompleted(ctx.user.id);
          const m1ComplianceValidated = await checkM1ComplianceValidated(ctx.user.id);
          const noUnresolvedBlockers = await checkNoUnresolvedBlockers(ctx.user.id);

          if (m1QuizPassed && allM1ScenariosCompleted && m1ComplianceValidated && noUnresolvedBlockers) {
            await unlockSilverCertification(ctx.user.id);
          }
        }

        if (input.moduleId === 5 && isGoldUnlockEnabled()) {
          const goldStatus = await getGoldCertificationStatus(ctx.user.id);
          if (goldStatus.goldEligible && !goldStatus.goldCertified) {
            await unlockGoldCertification(ctx.user.id);
          }
        }

        return { passed };
      }),

    /** Instructor validates M3 mastery — unlocks M4 for the student (P0-07) */
    validateTeacherModule: teacherProcedure
      .input(z.object({
        userId: z.number(),
        moduleId: z.number(),
        validated: z.boolean().default(true),
      }))
      .mutation(async ({ input }) => {
        if (input.moduleId !== 3) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Seul le Module 3 supporte la validation enseignant.",
          });
        }
        const progress = await getModuleProgressRow(input.userId, input.moduleId);
        let readyForValidation = progress?.passed ?? false;
        if (!readyForValidation && isCheckpointEngineEnabled()) {
          const snapshot = await computeModuleCheckpointSnapshot(input.userId, 3);
          readyForValidation = snapshot ? isModuleReadyForTeacherValidation(snapshot) : false;
        }
        if (!readyForValidation) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "L'étudiant doit avoir réussi tous les scénarios du Module 3 avant validation enseignant.",
          });
        }
        await setTeacherValidated(input.userId, input.moduleId, input.validated);
        if (input.moduleId === 3 && isCheckpointEngineEnabled()) {
          await recomputeModuleCheckpoint(input.userId, 3);
        }
        return { success: true, teacherValidated: input.validated };
      }),
  }),

  monitor: router({
    // Evaluation-only runs (for analytics, scoring, ranking)
    allRuns: teacherProcedure
      .input(cohortFilterInput)
      .query(async ({ ctx, input }) => {
        const { studentUserIds } = await resolveCohortScope(
          ctx.user.id,
          input.cohortId,
          ctx.user.role === "admin",
        );
        const runs = await getAllRunsForMonitor(studentUserIds);
        const enriched = await Promise.all(
          runs.map(async (r) => {
            // DOC runs: never enter getEffectiveM5Steps / ops-ledger progress scoring.
            if (isSupervisionDocRun(r.scenario?.initialStateJson)) {
              const { isM5DocFeatureEnabled } = await import("../shared/m5Doc/types");
              if (!isM5DocFeatureEnabled()) {
                return {
                  ...r,
                  progressPct: 0,
                  completedSteps: [] as string[],
                  score: null,
                  compliant: true,
                  interactionModel: "supervision-doc-v1" as const,
                };
              }
              const { loadM5DocState } = await import("./m5Doc/persistence");
              const { computeFinalScore } = await import("../shared/m5Doc/scoringPure");
              const docState = await loadM5DocState(r.run.id, r.scenario.initialStateJson.scnCode);
              const completed = Object.keys(docState.officialScores);
              return {
                ...r,
                progressPct: Math.round((completed.length / M5_DOC_INTERACTION_ORDER.length) * 100),
                completedSteps: completed,
                score: r.run.isDemo ? null : computeFinalScore(docState).finalScore,
                compliant: docState.handover.contradictions.length === 0,
                interactionModel: "supervision-doc-v1" as const,
              };
            }
            const state = await buildRunState(r.run.id);
            const events = r.run.isDemo ? [] : await getScoringEventsByRun(r.run.id);
            const compliance = checkCompliance(state);
            return {
              ...r,
              progressPct: calculateProgressPctAllModules(state.completedSteps, r.scenario.moduleId, state),
              completedSteps: state.completedSteps,
              score: r.run.isDemo ? null : calculateTotalScore(events),
              compliant: compliance.compliant,
            };
          })
        );
        return enriched;
      }),

    // ─── Power BI-style analytics aggregation ─────────────────────────────
    powerAnalytics: teacherProcedure
      .input(cohortFilterInput)
      .query(async ({ ctx, input }) => {
        const { studentUserIds } = await resolveCohortScope(
          ctx.user.id,
          input.cohortId,
          ctx.user.role === "admin",
        );
        const allRuns = await getAllRunsForMonitor(studentUserIds);
      const evalRuns = allRuns.filter((r) => !r.run.isDemo);
      const demoRuns = allRuns.filter((r) => r.run.isDemo);

      // ── Per-run enrichment ──────────────────────────────────────────────
      const enriched = await Promise.all(
        allRuns.map(async (r) => {
          const state = await buildRunState(r.run.id);
          const events = await getScoringEventsByRun(r.run.id);
          const compliance = checkCompliance(state);
          const score = r.run.isDemo ? null : calculateTotalScore(events);
          const penalties = events.filter(e => e.pointsDelta < 0);
          const penaltyByType: Record<string, number> = {};
          for (const p of penalties) {
            penaltyByType[p.eventType] = (penaltyByType[p.eventType] ?? 0) + 1;
          }
          // Per-step completion for heatmap
          const stepStatus: Record<string, boolean> = {};
          for (const s of MODULE1_STEPS) {
            stepStatus[s.code] = state.completedSteps.includes(s.code);
          }
          return {
            runId: r.run.id,
            userId: r.run.userId,
            userName: r.user.name ?? `User#${r.run.userId}`,
            scenarioId: r.run.scenarioId,
            scenarioName: r.scenario.name,
            moduleId: r.scenario.moduleId,
            isDemo: r.run.isDemo,
            status: r.run.status,
            score,
            progressPct: calculateProgressPctAllModules(state.completedSteps, r.scenario.moduleId, state),
            completedSteps: state.completedSteps,
            stepStatus,
            compliant: compliance.compliant,
            penaltyCount: penalties.length,
            penaltyByType,
            startedAt: r.run.startedAt,
            completedAt: r.run.completedAt,
          };
        })
      );

      const evalEnriched = enriched.filter(r => !r.isDemo);

      const rosterStudents =
        input.cohortId != null
          ? await listStudents({ cohortId: input.cohortId })
          : [];

      // ── Global KPIs ─────────────────────────────────────────────────────
      const activeEvalStudentIds = evalEnriched.map((r) => r.userId);
      const rosterKpis =
        input.cohortId != null
          ? computeRosterKpis(rosterStudents.length, activeEvalStudentIds)
          : computeRosterKpis(
              new Set(activeEvalStudentIds).size,
              activeEvalStudentIds,
            );
      const totalStudents = rosterKpis.activeEvalStudents;
      const totalRuns = evalEnriched.length;
      const completedRuns = evalEnriched.filter(r => r.status === "completed").length;
      const completionRate = totalRuns > 0 ? Math.round((completedRuns / totalRuns) * 100) : 0;
      const scoresOnly = evalEnriched.filter(r => r.score !== null).map(r => r.score as number);
      const avgScore = scoresOnly.length > 0 ? Math.round(scoresOnly.reduce((a, b) => a + b, 0) / scoresOnly.length) : 0;
      const passRate = scoresOnly.length > 0 ? Math.round((scoresOnly.filter(s => s >= 60).length / scoresOnly.length) * 100) : 0;
      const complianceRate = evalEnriched.length > 0 ? Math.round((evalEnriched.filter(r => r.compliant).length / evalEnriched.length) * 100) : 0;
      const avgProgress = evalEnriched.length > 0 ? Math.round(evalEnriched.reduce((a, r) => a + r.progressPct, 0) / evalEnriched.length) : 0;

      // ── Student ranking ─────────────────────────────────────────────────
      const byStudent = new Map<number, { userId: number; userName: string; runs: typeof evalEnriched }>();
      for (const r of evalEnriched) {
        if (!byStudent.has(r.userId)) byStudent.set(r.userId, { userId: r.userId, userName: r.userName, runs: [] });
        byStudent.get(r.userId)!.runs.push(r);
      }
      const runBasedRanking = Array.from(byStudent.values()).map(s => {
        const scores = s.runs.filter(r => r.score !== null).map(r => r.score as number);
        const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
        const avgStudentScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        const totalCompleted = s.runs.filter(r => r.status === "completed").length;
        const totalPenalties = s.runs.reduce((a, r) => a + r.penaltyCount, 0);
        const avgProgress = s.runs.length > 0 ? Math.round(s.runs.reduce((a, r) => a + r.progressPct, 0) / s.runs.length) : 0;
        return {
          userId: s.userId,
          userName: s.userName,
          bestScore,
          avgScore: avgStudentScore,
          totalRuns: s.runs.length,
          totalCompleted,
          totalPenalties,
          avgProgress,
          hasRuns: true,
        };
      }).sort((a, b) => b.bestScore - a.bestScore);

      const studentRanking =
        input.cohortId != null
          ? mergeRosterIntoStudentRanking(
              rosterStudents.map((s) => ({ id: s.id, name: s.name })),
              runBasedRanking,
            )
          : runBasedRanking;

      // ── Step completion rates (for heatmap / bar chart) ──────────────────
      const stepCodes = MODULE1_STEPS.map(s => s.code);
      const stepCompletionRates = stepCodes.map(code => {
        const runsForStep = evalEnriched.filter(r => r.progressPct > 0);
        const completedCount = runsForStep.filter(r => r.stepStatus[code]).length;
        const rate = runsForStep.length > 0 ? Math.round((completedCount / runsForStep.length) * 100) : 0;
        const label = MODULE1_STEPS.find(s => s.code === code)?.labelFr ?? code;
        return { code, label, completionRate: rate, completedCount, totalRuns: runsForStep.length };
      });

      // ── Error frequency by type ──────────────────────────────────────────
      const errorFrequency: Record<string, number> = {};
      for (const r of evalEnriched) {
        for (const [type, count] of Object.entries(r.penaltyByType)) {
          errorFrequency[type] = (errorFrequency[type] ?? 0) + count;
        }
      }
      const errorFrequencyArr = Object.entries(errorFrequency)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count);

      // ── Score distribution buckets ───────────────────────────────────────
      const scoreBuckets = [
        { label: "0-20", min: 0, max: 20, count: 0 },
        { label: "21-40", min: 21, max: 40, count: 0 },
        { label: "41-60", min: 41, max: 60, count: 0 },
        { label: "61-80", min: 61, max: 80, count: 0 },
        { label: "81-100", min: 81, max: 100, count: 0 },
      ];
      for (const s of scoresOnly) {
        const bucket = scoreBuckets.find(b => s >= b.min && s <= b.max);
        if (bucket) bucket.count++;
      }

      // ── Timeline: avg score per day ──────────────────────────────────────
      const byDay = new Map<string, number[]>();
      for (const r of evalEnriched) {
        if (r.score === null || !r.startedAt) continue;
        const day = new Date(r.startedAt).toISOString().split("T")[0];
        if (!byDay.has(day)) byDay.set(day, []);
        byDay.get(day)!.push(r.score);
      }
      const scoreTimeline = Array.from(byDay.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, scores]) => ({
          date,
          avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
          count: scores.length,
        }));

      // ── Per-student heatmap data ─────────────────────────────────────────
      const heatmapData = studentRanking.map(s => {
        const studentRuns = evalEnriched.filter(r => r.userId === s.userId);
        const stepCompletion: Record<string, number> = {};
        for (const code of stepCodes) {
          const completedInAnyRun = studentRuns.some(r => r.stepStatus[code]);
          stepCompletion[code] = completedInAnyRun ? 1 : 0;
        }
        return { userName: s.userName, userId: s.userId, ...stepCompletion };
      });

      // ── Module distribution ──────────────────────────────────────────────
      const moduleDistribution = [1, 2, 3, 4, 5].map(moduleId => {
        const moduleRuns = enriched.filter(r => r.moduleId === moduleId);
        const evalModuleRuns = moduleRuns.filter(r => !r.isDemo);
        const demoModuleRuns = moduleRuns.filter(r => r.isDemo);
        return { moduleId, label: `M${moduleId}`, evalCount: evalModuleRuns.length, demoCount: demoModuleRuns.length };
      });

      // ── Radar: class average per step ────────────────────────────────────
      const radarData = stepCompletionRates.map(s => ({
        step: s.code,
        label: s.code,
        value: s.completionRate,
      }));

      return {
        kpis: {
          totalStudents,
          enrolledStudents: rosterKpis.enrolledStudents,
          activeEvalStudents: rosterKpis.activeEvalStudents,
          notStartedStudents: rosterKpis.notStartedStudents,
          totalRuns,
          completedRuns,
          completionRate,
          avgScore,
          passRate,
          complianceRate,
          avgProgress,
          demoCount: demoRuns.length,
        },
        studentRanking,
        stepCompletionRates,
        errorFrequency: errorFrequencyArr,
        scoreBuckets,
        scoreTimeline,
        heatmapData,
        moduleDistribution,
        radarData,
        recentRuns: enriched.slice(-10).reverse(),
      };
    }),

    // Evaluation-only analytics (excludes demo sessions)
    // ─── Student score evolution across multiple attempts ──────────────────
    studentScoreEvolution: teacherProcedure
      .input(z.object({
        cohortId: z.number(),
        userId: z.number().optional(),
        scenarioId: z.number().optional(),
      }))
      .query(async ({ ctx, input }) => {
        const { studentUserIds } = await resolveCohortScope(
          ctx.user.id,
          input.cohortId,
          ctx.user.role === "admin",
        );
        const allRuns = await getAllRunsForMonitor(studentUserIds);
        const evalRuns = allRuns.filter((r) => !r.run.isDemo);

        const rosterStudents =
          input.cohortId != null
            ? await listStudents({ cohortId: input.cohortId })
            : [];

        // Build unique student list (roster + any run-only legacy rows)
        const studentMap = new Map<number, string>();
        for (const s of rosterStudents) {
          studentMap.set(s.id, s.name ?? `User#${s.id}`);
        }
        for (const r of evalRuns) {
          if (!studentMap.has(r.run.userId)) {
            studentMap.set(r.run.userId, r.user.name ?? `User#${r.run.userId}`);
          }
        }
        const students = Array.from(studentMap.entries())
          .map(([id, name]) => ({ id, name }))
          .sort((a, b) => a.name.localeCompare(b.name));

        // Build unique scenario list
        const scenarioMap = new Map<number, string>();
        for (const r of evalRuns) {
          scenarioMap.set(r.run.scenarioId, r.scenario.name);
        }
        const scenarioList = Array.from(scenarioMap.entries())
          .map(([id, name]) => ({ id, name }))
          .sort((a, b) => a.name.localeCompare(b.name));

        // Filter runs by selected student/scenario
        let filtered = evalRuns;
        if (input.userId) filtered = filtered.filter(r => r.run.userId === input.userId);
        if (input.scenarioId) filtered = filtered.filter(r => r.run.scenarioId === input.scenarioId);

        // Sort by startedAt ascending
        filtered = [...filtered].sort((a, b) =>
          new Date(a.run.startedAt).getTime() - new Date(b.run.startedAt).getTime()
        );

        // Enrich each run with score + penalties
        const enriched = await Promise.all(
          filtered.map(async (r, idx) => {
            const events = await getScoringEventsByRun(r.run.id);
            const score = calculateTotalScore(events);
            const penalties = events.filter(e => e.pointsDelta < 0).length;
            const bonuses  = events.filter(e => e.pointsDelta > 0).length;
            return {
              attempt: idx + 1,
              runId: r.run.id,
              userId: r.run.userId,
              userName: r.user.name ?? `User#${r.run.userId}`,
              scenarioId: r.run.scenarioId,
              scenarioName: r.scenario.name,
              score,
              penalties,
              bonuses,
              status: r.run.status,
              startedAt: r.run.startedAt,
              completedAt: r.run.completedAt,
            };
          })
        );

        // If viewing all students on same scenario, group by student for multi-line chart
        const byStudent = new Map<number, typeof enriched>();
        for (const e of enriched) {
          if (!byStudent.has(e.userId)) byStudent.set(e.userId, []);
          byStudent.get(e.userId)!.push(e);
        }
        // Re-number attempts per student
        const lines = Array.from(byStudent.entries()).map(([userId, runs]) => ({
          userId,
          userName: runs[0].userName,
          attempts: runs.map((r, i) => ({ ...r, attempt: i + 1 })),
        }));

        return { students, scenarioList, lines, totalAttempts: enriched.length };
      }),

    analytics: teacherProcedure
      .input(cohortFilterInput)
      .query(async ({ ctx, input }) => {
        const { studentUserIds } = await resolveCohortScope(
          ctx.user.id,
          input.cohortId,
          ctx.user.role === "admin",
        );
        const runs = await getAllRunsForMonitor(studentUserIds);
      const evalRuns = runs.filter((r) => !r.run.isDemo);
      const enriched = await Promise.all(
        evalRuns.map(async (r) => {
          const state = await buildRunState(r.run.id);
          const events = await getScoringEventsByRun(r.run.id);
          const compliance = checkCompliance(state);
          return {
            ...r,
            progressPct: calculateProgressPctAllModules(state.completedSteps, r.scenario.moduleId, state),
            completedSteps: state.completedSteps,
            score: calculateTotalScore(events),
            compliant: compliance.compliant,
          };
        })
      );
      return enriched;
    }),
  }),

  // ─── Module 2: Advanced Warehouse Operations ───────────────────────────────
  m2: router({
    /** M2 Step 1: GR (no PO prerequisite for M2) */
    submitGR: protectedProcedure
      .input(z.object({
        runId: z.number(),
        sku: z.string(),
        bin: z.string(),
        qty: z.number().positive(),
        docRef: z.string(),
        comment: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        if (run.userId !== ctx.user.id && ctx.user.role !== "teacher" && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const state = await buildRunState(input.runId);
        const check = canExecuteStepM2("GR" as any, state);
        if (!check.allowed) {
          if (!run.isDemo) await addScoringEvent({ runId: input.runId, eventType: "OUT_OF_SEQUENCE", pointsDelta: -5, message: check.reasonFr ?? "" });
          if (!run.isDemo) throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(check, ctx.req) });
        }
        const zoneCheck = validateGRZone(input.bin);
        if (!zoneCheck.allowed) {
          if (!run.isDemo) await addScoringEvent({ runId: input.runId, eventType: "WRONG_ZONE_GR", pointsDelta: -3, message: `GR M2: ${zoneCheck.reasonFr}` });
          if (!run.isDemo) throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(zoneCheck, ctx.req) });
        }
        await addTransaction({ runId: input.runId, docType: "GR", moveType: "101", sku: input.sku, bin: input.bin, qty: String(input.qty), posted: true, docRef: input.docRef, comment: input.comment ?? null });
        await markStepComplete(input.runId, "GR");
        const rule = getScoringRule("GR_COMPLETED");
        if (!run.isDemo) await addScoringEvent({ runId: input.runId, eventType: "GR_COMPLETED", pointsDelta: rule!.points, message: rule!.descriptionFr });
        const demoWarn = run.isDemo && (!check.allowed || !zoneCheck.allowed)
          ? [!check.allowed ? pickReason(check, ctx.req) : null, !zoneCheck.allowed ? pickReason(zoneCheck, ctx.req) : null].filter(Boolean).join(" | ")
          : null;
        return { success: true, demoWarning: demoWarn };
      }),
    /** M2 Step 2: PUTAWAY (RECEPTION → STOCKAGE, no PO prerequisite) */
    submitPUTAWAY: protectedProcedure
      .input(z.object({
        runId: z.number(),
        sku: z.string(),
        fromBin: z.string(),
        toBin: z.string(),
        qty: z.number().positive(),
        docRef: z.string(),
        lotNumber: z.string().optional(),
        comment: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        if (run.userId !== ctx.user.id && ctx.user.role !== "teacher" && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const state = await buildRunState(input.runId);
        const check = canExecuteStepM2("PUTAWAY" as any, state);
        if (!check.allowed) {
          if (!run.isDemo) await addScoringEvent({ runId: input.runId, eventType: "OUT_OF_SEQUENCE", pointsDelta: -5, message: check.reasonFr ?? "" });
          if (!run.isDemo) throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(check, ctx.req) });
        }
        const zoneCheck = validatePutawayM1Zone(input.fromBin, input.toBin);
        if (!zoneCheck.allowed) {
          if (!run.isDemo) await addScoringEvent({ runId: input.runId, eventType: "WRONG_ZONE_PUTAWAY", pointsDelta: -3, message: `PUTAWAY M2: ${zoneCheck.reasonFr}` });
          if (!run.isDemo) throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(zoneCheck, ctx.req) });
        }
        const allBinCaps = await getAllBinCapacities();
        const allBins = await getAllBins();
        const binCapacities: Record<string, number> = {};
        for (const bc of allBinCaps) binCapacities[bc.binCode] = bc.maxCapacity;
        for (const b of allBins) {
          if (!(b.binCode in binCapacities)) binCapacities[b.binCode] = b.maxCapacity ?? 500;
        }
        const binCurrentLoad = calculateBinLoad(
          state.transactions.map((t) => ({ docType: t.docType, bin: t.bin, qty: t.qty, posted: t.posted }))
        );
        const existingPutaway = await getPutawayByRun(input.runId);
        const existingLots = existingPutaway
          .filter((p) => p.sku === input.sku)
          .map((p) => ({ lotNumber: p.lotNumber ?? "", receivedAt: new Date(p.receivedAt), qty: p.qty }))
          .sort((a, b) => a.receivedAt.getTime() - b.receivedAt.getTime());
        const scenarioForPutaway = await getScenarioById(run.scenarioId);
        const putawaySeed = scenarioForPutaway?.initialStateJson as {
          lots?: Array<{ lotNumber: string; receivedAt: string }>;
        } | null;
        const lotNum = input.lotNumber || `LOT-${Date.now()}`;
        const seedLotDate = putawaySeed?.lots?.find((l) => l.lotNumber === lotNum)?.receivedAt;
        const putawayReceivedAt = seedLotDate ? new Date(seedLotDate) : new Date();
        const capacityCheck = validatePutaway({
          sku: input.sku,
          fromBin: input.fromBin,
          toBin: input.toBin,
          qty: input.qty,
          binCapacities,
          binCurrentLoad,
          existingLots,
          lotNumber: lotNum,
          receivedAt: putawayReceivedAt,
        });
        if (!capacityCheck.allowed) {
          if (!run.isDemo) {
            await addScoringEvent({
              runId: input.runId,
              eventType: capacityCheck.penaltyEvent ?? "OUT_OF_SEQUENCE",
              pointsDelta: capacityCheck.penaltyPoints ?? -5,
              message: capacityCheck.reasonFr ?? "",
            });
            throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(capacityCheck, ctx.req) });
          }
        }
        // Canonical SCN-007 contract — reject before any mutation (both endpoints).
        const scn007Check = validateScn007PutawayContract(state, {
          sku: input.sku,
          fromBin: input.fromBin,
          toBin: input.toBin,
          qty: input.qty,
          lotNumber: lotNum,
        });
        if (!scn007Check.allowed) {
          if (!run.isDemo) {
            await addScoringEvent({
              runId: input.runId,
              eventType: "OUT_OF_SEQUENCE",
              pointsDelta: -5,
              message: scn007Check.reasonFr,
            });
          }
          throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(scn007Check, ctx.req) });
        }
        await addTransaction({ runId: input.runId, docType: "PUTAWAY", moveType: "LT0A", sku: input.sku, bin: input.fromBin, qty: String(-input.qty), posted: true, docRef: input.docRef, comment: input.comment ?? null });
        await addTransaction({ runId: input.runId, docType: "PUTAWAY", moveType: "LT0A", sku: input.sku, bin: input.toBin, qty: String(input.qty), posted: true, docRef: input.docRef, comment: input.comment ?? null });
        await addPutawayRecord({ runId: input.runId, sku: input.sku, fromBin: input.fromBin, toBin: input.toBin, qty: input.qty, lotNumber: lotNum, receivedAt: putawayReceivedAt });

        // Complete PUTAWAY only when reception is fully cleared (SCN-007: exact 500+100 split + canonical sequence)
        const projectedInventory = projectInventoryAfterPutaway(state.inventory, {
          sku: input.sku,
          fromBin: input.fromBin,
          toBin: input.toBin,
          qty: input.qty,
        });
        const projectedTransactions = projectTransactionsAfterPutaway(state.transactions, {
          sku: input.sku,
          fromBin: input.fromBin,
          toBin: input.toBin,
          qty: input.qty,
          docRef: input.docRef,
        });
        const projectedState = {
          ...state,
          inventory: projectedInventory,
          transactions: projectedTransactions,
          scnCode: resolveScenarioScnCode(scenarioForPutaway),
          scenarioId: run.scenarioId,
          scenarioName: scenarioForPutaway?.name ?? null,
          scenarioInitialStateJson: (scenarioForPutaway?.initialStateJson as Record<string, unknown> | null) ?? null,
        };
        const putawayDone = isM2PutawayStepComplete(projectedState);
        const alreadyComplete = state.completedSteps.includes("PUTAWAY") && (
          isScn007Scenario(state) ? isScn007PutawayComplete(state) : true
        );
        if (putawayDone && !alreadyComplete) {
          await markStepComplete(input.runId, "PUTAWAY");
          const rule = getScoringRule("PUTAWAY_COMPLETED");
          const putawayPts = isScn007Scenario(projectedState)
            ? getScn007StepMaxPoints("PUTAWAY")
            : rule!.points;
          if (!run.isDemo) await addScoringEvent({ runId: input.runId, eventType: "PUTAWAY_COMPLETED", pointsDelta: putawayPts, message: rule!.descriptionFr });
        }
        const demoWarn = run.isDemo && (!check.allowed || !zoneCheck.allowed || !capacityCheck.allowed || !scn007Check.allowed)
          ? [!check.allowed ? pickReason(check, ctx.req) : null, !zoneCheck.allowed ? pickReason(zoneCheck, ctx.req) : null, !capacityCheck.allowed ? pickReason(capacityCheck, ctx.req) : null, !scn007Check.allowed ? pickReason(scn007Check, ctx.req) : null].filter(Boolean).join(" | ")
          : null;
        return {
          success: true,
          demoWarning: demoWarn,
          putawayComplete: putawayDone,
          nextActionHint: getScn007NextActionHint(projectedState),
        };
      }),
    /** M2 Step 3: FIFO Pick */
    submitFifoPick: protectedProcedure
      .input(z.object({
        runId: z.number(),
        sku: z.string(),
        fromBin: z.string(),
        toBin: z.string(),
        qty: z.number().positive(),
        lotNumber: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        if (run.userId !== ctx.user.id && ctx.user.role !== "teacher" && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const state = await buildRunState(input.runId);
        const check = canExecuteStepM2("FIFO_PICK" as any, state);
        if (!check.allowed) {
          if (!run.isDemo) await addScoringEvent({ runId: input.runId, eventType: "OUT_OF_SEQUENCE", pointsDelta: -5, message: check.reasonFr ?? "" });
          throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(check, ctx.req) });
        }
        const zoneCheck = validateM2FifoPickZone(input.fromBin, input.toBin);
        if (!zoneCheck.allowed) {
          if (!run.isDemo) await addScoringEvent({ runId: input.runId, eventType: "WRONG_ZONE_PUTAWAY", pointsDelta: -3, message: zoneCheck.reasonFr });
          throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(zoneCheck, ctx.req) });
        }
        const stockAtSource = state.inventory[`${input.sku}::${input.fromBin}`] ?? 0;
        if (input.qty > stockAtSource) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: pickReason({
              allowed: false,
              reasonFr: "Le lot sélectionné n'est pas disponible dans l'emplacement source indiqué.",
              reasonEn: "The selected lot is not available in the indicated source location.",
            }, ctx.req),
          });
        }
        const putawayList = await getPutawayByRun(input.runId);
        const scenario = await getScenarioById(run.scenarioId);
        const seed = scenario?.initialStateJson as {
          lots?: Array<{ lotNumber: string; receivedAt: string; qty?: number }>;
          preloadedTransactions?: Array<{ docType: string; sku?: string; bin?: string; qty?: number; posted?: boolean; docRef?: string }>;
        } | null;
        const fifoCatalog = buildM2FifoLotCatalog(
          putawayList.map((p) => ({
            sku: p.sku,
            toBin: p.toBin,
            lotNumber: p.lotNumber,
            receivedAt: new Date(p.receivedAt),
            qty: p.qty,
          })),
          seed ?? undefined
        );
        const fifoCheck = validateM2FifoPick({
          sku: input.sku,
          lotNumber: input.lotNumber,
          fromBin: input.fromBin,
          catalog: fifoCatalog,
          inventory: state.inventory,
        });
        if (!fifoCheck.allowed) {
          if (!run.isDemo) {
            await addScoringEvent({
              runId: input.runId,
              eventType: "FIFO_VIOLATION",
              pointsDelta: fifoCheck.penaltyPoints ?? -10,
              message: `FIFO violation: lot ${input.lotNumber} prélevé avant lot ${fifoCheck.requiredLot}`,
            });
          }
          throw new TRPCError({ code: "BAD_REQUEST", message: fifoCheck.reasonFr ?? "Violation FIFO" });
        }
        await addTransaction({ runId: input.runId, docType: "PICKING", moveType: "LT0A", sku: input.sku, bin: input.fromBin, qty: String(-input.qty), posted: true, docRef: `FIFO-${input.lotNumber}`, comment: `Prélèvement FIFO de ${input.fromBin} vers ${input.toBin}` });
        await addTransaction({ runId: input.runId, docType: "PICKING_M1", moveType: "LT0A", sku: input.sku, bin: input.toBin, qty: String(input.qty), posted: true, docRef: `FIFO-${input.lotNumber}`, comment: `Arrivée FIFO en ${input.toBin}` });
        await markStepComplete(input.runId, "FIFO_PICK");
        const fifoRule = getScoringRule("FIFO_PICK_COMPLETED");
        if (!run.isDemo) await addScoringEvent({ runId: input.runId, eventType: "FIFO_PICK_COMPLETED", pointsDelta: fifoRule!.points, message: "Prélèvement FIFO conforme : le lot le plus ancien a été sélectionné et déplacé vers la zone d'expédition." });
        return {
          success: true,
          messageFr: "Prélèvement FIFO conforme : le lot le plus ancien a été sélectionné et déplacé vers la zone d'expédition.",
          messageEn: "FIFO pick compliant: the oldest lot was selected and moved to the expedition zone.",
        };
      }),

    /** M2 Step 4: Stock Accuracy */
    submitStockAccuracy: protectedProcedure
      .input(z.object({
        runId: z.number(),
        sku: z.string(),
        systemQty: z.number(),
        countedQty: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        if (run.userId !== ctx.user.id && ctx.user.role !== "teacher" && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const state = await buildRunState(input.runId);
        const check = canExecuteStepM2("STOCK_ACCURACY" as any, state);
        if (!check.allowed) {
          if (!run.isDemo) await addScoringEvent({ runId: input.runId, eventType: "OUT_OF_SEQUENCE", pointsDelta: -5, message: check.reasonFr ?? "" });
          throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(check, ctx.req) });
        }
        const variance = input.countedQty - input.systemQty;
        await addInventoryCount({ runId: input.runId, sku: input.sku, systemQty: input.systemQty, countedQty: input.countedQty, varianceQty: variance });
        await markStepComplete(input.runId, "STOCK_ACCURACY");
        const stockPoints = isScn007Scenario(state)
          ? getScn007StockAccuracyPoints(variance)
          : getM2StockAccuracyPoints(variance);
        if (!run.isDemo) await addScoringEvent({ runId: input.runId, eventType: "STOCK_ACCURACY_COMPLETED", pointsDelta: stockPoints, message: `Précision inventaire: variance ${variance >= 0 ? "+" : ""}${variance}` });
        return { success: true, variance };
      }),

    /** M2 Step 5: Compliance Advanced */
    submitComplianceAdv: protectedProcedure
      .input(z.object({ runId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        if (run.userId !== ctx.user.id && ctx.user.role !== "teacher" && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const state = await buildRunState(input.runId);
        const check = canExecuteStepM2("COMPLIANCE_ADV" as any, state);
        if (!check.allowed) {
          if (!run.isDemo) await addScoringEvent({ runId: input.runId, eventType: "OUT_OF_SEQUENCE", pointsDelta: -5, message: check.reasonFr ?? "" });
          throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(check, ctx.req) });
        }
        await markStepComplete(input.runId, "COMPLIANCE_ADV");
        const complianceRule = getScoringRule("COMPLIANCE_ADV_COMPLETED");
        const compliancePts = isScn007Scenario(state)
          ? getScn007StepMaxPoints("COMPLIANCE_ADV")
          : complianceRule!.points;
        if (!run.isDemo) await addScoringEvent({ runId: input.runId, eventType: "COMPLIANCE_ADV_COMPLETED", pointsDelta: compliancePts, message: "Conformité avancée M2 validée" });
        await completeRun(input.runId);
        return { success: true };
      }),
  }),

  // ─── Module 3: Cycle Count & Replenishment ─────────────────────────────────
  m3: router({
    /** M3 Step 1: CC_LIST — generate count list */
    submitCcList: protectedProcedure
      .input(z.object({ runId: z.number(), skus: z.array(z.string()).min(1) }))
      .mutation(async ({ ctx, input }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        if (run.userId !== ctx.user.id && ctx.user.role !== "teacher" && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        if (run.status === "completed") return { success: true, skus: input.skus, complete: true };
        const state = await buildRunState(input.runId);
        const scenario = await getScenarioById(run.scenarioId);
        const initialStateJson = scenario?.initialStateJson as import("./rulesEngine").M3InitialStateJson;
        const check = canExecuteStepM3("CC_LIST" as any, state.completedSteps as any, initialStateJson);
        if (!check.allowed) {
          if (!run.isDemo) await addScoringEvent({ runId: input.runId, eventType: "OUT_OF_SEQUENCE", pointsDelta: -5, message: check.reasonFr ?? "" });
          throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(check, ctx.req) });
        }
        const targets = getCycleCountTargets(initialStateJson);
        const listCheck = validateCycleCountListComplete(targets, input.skus);
        if (!listCheck.allowed) {
          throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(listCheck, ctx.req) });
        }
        if (!state.completedSteps.includes("CC_LIST")) {
          await markStepComplete(input.runId, "CC_LIST");
          if (!run.isDemo) await addScoringEvent({ runId: input.runId, eventType: "CC_LIST_COMPLETED", pointsDelta: getM3StepAwardPoints("CC_LIST", initialStateJson), message: `Liste de comptage générée pour ${input.skus.length} SKU(s)` });
        }
        return { success: true, skus: input.skus, complete: true };
      }),

    /** M3 Step 2: CC_COUNT — enter physical counts */
    submitCcCount: protectedProcedure
      .input(z.object({
        runId: z.number(),
        counts: z.array(z.object({
          sku: z.string(),
          bin: z.string(),
          systemQty: z.number(),
          countedQty: z.number(),
        })).min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        if (run.userId !== ctx.user.id && ctx.user.role !== "teacher" && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        if (run.status === "completed") return { success: true, totalVariance: 0, complete: true };
        const state = await buildRunState(input.runId);
        const scenario = await getScenarioById(run.scenarioId);
        const initialStateJson = scenario?.initialStateJson as import("./rulesEngine").M3InitialStateJson;
        const targets = getCycleCountTargets(initialStateJson);
        const existingCounts = await getInventoryCountsByRun(input.runId);
        const entriesBefore = validateCycleCountEntriesComplete(targets, existingCounts);
        const needsCatchUp = targets.length > 0 && !entriesBefore.complete;
        const check = canExecuteStepM3("CC_COUNT" as any, state.completedSteps as any, initialStateJson);
        if (!check.allowed && !needsCatchUp) {
          if (!run.isDemo) await addScoringEvent({ runId: input.runId, eventType: "OUT_OF_SEQUENCE", pointsDelta: -5, message: check.reasonFr ?? "" });
          throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(check, ctx.req) });
        }
        for (const c of input.counts) {
          const variance = c.countedQty - c.systemQty;
          await upsertInventoryCount({ runId: input.runId, sku: c.sku, systemQty: c.systemQty, countedQty: c.countedQty, varianceQty: variance });
        }
        const allCounts = await getInventoryCountsByRun(input.runId);
        const entriesCheck = validateCycleCountEntriesComplete(targets, allCounts);
        if (!entriesCheck.complete) {
          const totalVariance = input.counts.reduce((s, c) => s + Math.abs(c.countedQty - c.systemQty), 0);
          return { success: true, totalVariance, complete: false, remainingSkus: targets.filter((t) => !allCounts.some((c) => c.sku === t.sku)).map((t) => t.sku) };
        }
        if (!state.completedSteps.includes("CC_COUNT")) {
          await markStepComplete(input.runId, "CC_COUNT");
          const totalVariance = allCounts.reduce((s, c) => s + Math.abs(Number(c.varianceQty)), 0);
          if (!run.isDemo) {
            await addScoringEvent({
              runId: input.runId,
              eventType: "CC_COUNT_COMPLETED",
              pointsDelta: getM3StepAwardPoints("CC_COUNT", initialStateJson),
              message: `Comptage physique: variance totale ${totalVariance}`,
            });
          }
        }
        const totalVariance = allCounts.reduce((s, c) => s + Math.abs(Number(c.varianceQty)), 0);
        return { success: true, totalVariance, complete: true };
      }),

    /** M3 Step 3: CC_RECON — reconcile & adjust (atomic per-target claim) */
    submitCcRecon: protectedProcedure
      .input(z.object({
        runId: z.number(),
        adjustments: z.array(z.object({
          sku: z.string(),
          bin: z.string(),
          varianceQty: z.number(),
          justification: z.string(),
        })),
      }))
      .mutation(async ({ ctx, input }) => {
        const { claimAndPersistCcReconTarget, getCcReconClaimsByRun } = await import("./ccReconAtomic");
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        if (run.userId !== ctx.user.id && ctx.user.role !== "teacher" && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });

        const progressPayload = (
          progress: ReturnType<typeof evaluateCycleCountReconProgress>,
          extra: Record<string, unknown> = {},
        ) => ({
          success: true as const,
          complete: progress.complete,
          remainingSkus: progress.remainingSkus,
          completedSkus: progress.completedSkus,
          reconciledCount: progress.reconciledCount,
          requiredCount: progress.requiredCount,
          statuses: progress.statuses,
          ...extra,
        });

        if (run.status === "completed") {
          return {
            success: true,
            adjustmentsApplied: 0,
            complete: true,
            alreadyComplete: true,
            remainingSkus: [] as string[],
            completedSkus: [] as string[],
            reconciledCount: 0,
            requiredCount: 0,
          };
        }

        const state = await buildRunState(input.runId);
        const scenario = await getScenarioById(run.scenarioId);
        const initialStateJson = scenario?.initialStateJson as import("./rulesEngine").M3InitialStateJson;
        const targets = getCycleCountTargets(initialStateJson);
        const inventoryCounts = await getInventoryCountsByRun(input.runId);
        const inventoryAdjustmentsBefore = await getInventoryAdjustmentsByRun(input.runId);
        const claimsBefore = await getCcReconClaimsByRun(input.runId);
        const reconBefore = evaluateCycleCountReconProgress(
          targets,
          inventoryCounts,
          inventoryAdjustmentsBefore,
          state.transactions,
          claimsBefore,
        );

        if (reconBefore.complete) {
          if (!state.completedSteps.includes("CC_RECON")) {
            await markStepComplete(input.runId, "CC_RECON");
            if (!run.isDemo) {
              await addScoringEventOnce({
                runId: input.runId,
                eventType: "CC_RECON_COMPLETED",
                pointsDelta: getM3StepAwardPoints("CC_RECON", initialStateJson),
                message: "Réconciliation et ajustements validés",
              });
            }
            const replenishParamsForRecon = getReplenishmentParamsFromSeed(initialStateJson);
            if (replenishParamsForRecon.length === 0 && !state.completedSteps.includes("REPLENISH")) {
              await markStepComplete(input.runId, "REPLENISH");
              if (!run.isDemo) {
                await addScoringEventOnce({
                  runId: input.runId,
                  eventType: "REPLENISH_COMPLETED",
                  pointsDelta: getM3StepAwardPoints("REPLENISH", initialStateJson),
                  message: "Réapprovisionnement non requis pour ce scénario",
                });
              }
            }
          }
          return progressPayload(reconBefore, {
            adjustmentsApplied: 0,
            alreadyReconciled: true,
            alreadyComplete: true,
          });
        }

        const needsCatchUp = targets.length > 0 && !reconBefore.complete;
        const check = canExecuteStepM3("CC_RECON" as any, state.completedSteps as any, initialStateJson);
        if (!check.allowed && !needsCatchUp) {
          if (!run.isDemo) await addScoringEvent({ runId: input.runId, eventType: "OUT_OF_SEQUENCE", pointsDelta: -5, message: check.reasonFr ?? "" });
          throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(check, ctx.req) });
        }

        const varianceThreshold = getM3VarianceThreshold(initialStateJson);
        const replenishParamsForRecon = getReplenishmentParamsFromSeed(initialStateJson);
        let adjustmentsApplied = 0;
        let idempotentHits = 0;

        for (const adj of input.adjustments) {
          const submissionCheck = validateCcReconSubmission(
            targets,
            inventoryCounts,
            adj,
            varianceThreshold,
          );
          if (!submissionCheck.allowed) {
            if (
              submissionCheck.reason?.toLowerCase().includes("justification") ||
              submissionCheck.reasonFr?.toLowerCase().includes("justification")
            ) {
              if (!run.isDemo) {
                await addScoringEvent({
                  runId: input.runId,
                  eventType: "VARIANCE_JUSTIFICATION_MISSING",
                  pointsDelta: -10,
                  message: submissionCheck.reasonFr ?? "",
                });
              }
            }
            throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(submissionCheck, ctx.req) });
          }

          const expectedVarianceQty = submissionCheck.expectedVarianceQty ?? adj.varianceQty;
          const target = targets.find((t) => t.sku === adj.sku)!;
          const bin = adj.bin || target.bin || "";
          const priorStatus = getCcReconTargetStatus(
            target,
            inventoryCounts,
            inventoryAdjustmentsBefore,
            state.transactions,
            claimsBefore,
          );
          if (priorStatus.status !== "PENDING") {
            idempotentHits += 1;
            continue;
          }

          const writeResult = await claimAndPersistCcReconTarget({
            runId: input.runId,
            sku: adj.sku,
            bin,
            varianceQty: expectedVarianceQty,
            justification: adj.justification.trim() || undefined,
          });

          if (writeResult.alreadyReconciled) {
            idempotentHits += 1;
          } else if (writeResult.created && expectedVarianceQty !== 0) {
            adjustmentsApplied += 1;
          }
        }

        const updatedState = await buildRunState(input.runId);
        const allAdjustments = await getInventoryAdjustmentsByRun(input.runId);
        const allCounts = await getInventoryCountsByRun(input.runId);
        const claimsAfter = await getCcReconClaimsByRun(input.runId);
        const reconCheck = evaluateCycleCountReconProgress(
          targets,
          allCounts,
          allAdjustments,
          updatedState.transactions,
          claimsAfter,
        );

        if (!reconCheck.complete) {
          return progressPayload(reconCheck, {
            adjustmentsApplied,
            alreadyReconciled: idempotentHits > 0 && adjustmentsApplied === 0,
          });
        }

        if (!state.completedSteps.includes("CC_RECON")) {
          await markStepComplete(input.runId, "CC_RECON");
          if (!run.isDemo) {
            await addScoringEventOnce({
              runId: input.runId,
              eventType: "CC_RECON_COMPLETED",
              pointsDelta: getM3StepAwardPoints("CC_RECON", initialStateJson),
              message: "Réconciliation et ajustements validés",
            });
          }
          if (replenishParamsForRecon.length === 0 && !state.completedSteps.includes("REPLENISH")) {
            await markStepComplete(input.runId, "REPLENISH");
            if (!run.isDemo) {
              await addScoringEventOnce({
                runId: input.runId,
                eventType: "REPLENISH_COMPLETED",
                pointsDelta: getM3StepAwardPoints("REPLENISH", initialStateJson),
                message: "Réapprovisionnement non requis pour ce scénario",
              });
            }
          }
        }

        return progressPayload(reconCheck, {
          adjustmentsApplied,
          alreadyReconciled: idempotentHits > 0 && adjustmentsApplied === 0,
        });
      }),

    /** M3 Step 4: REPLENISH \u2014 replenishment suggestion */
    submitReplenish: protectedProcedure
      .input(z.object({
        runId: z.number(),
        sku: z.string(),
        systemQty: z.number(),
        minQty: z.number(),
        maxQty: z.number(),
        safetyStock: z.number(),
        studentQty: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        if (run.userId !== ctx.user.id && ctx.user.role !== "teacher" && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        if (run.status === "completed") return { success: true, complete: true, suggestion: null, diff: 0, studentQty: input.studentQty };
        const state = await buildRunState(input.runId);
        const scenario = await getScenarioById(run.scenarioId);
        const initialStateJson = scenario?.initialStateJson as import("./rulesEngine").M3InitialStateJson;
        const replenishParams = getReplenishmentParamsFromSeed(initialStateJson);
        const inventory = state.inventory as Record<string, number>;
        const existingSuggestions = await getReplenishmentSuggestionsByRun(input.runId);
        const replenishBefore = validateReplenishmentComplete(replenishParams, existingSuggestions, inventory);
        const needsCatchUp = replenishParams.length > 0 && !replenishBefore.complete;
        const check = canExecuteStepM3("REPLENISH" as any, state.completedSteps as any, initialStateJson);
        if (!check.allowed && !needsCatchUp) {
          if (!run.isDemo) await addScoringEvent({ runId: input.runId, eventType: "OUT_OF_SEQUENCE", pointsDelta: -5, message: check.reasonFr ?? "" });
          throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(check, ctx.req) });
        }

        if (isM3ReplenishmentOnlyScenario(initialStateJson) || replenishParams.length > 0) {
          const submissionCheck = validateReplenishmentSubmission(
            replenishParams,
            {
              sku: input.sku,
              systemQty: input.systemQty,
              minQty: input.minQty,
              maxQty: input.maxQty,
              safetyStock: input.safetyStock,
              studentQty: input.studentQty,
            },
            inventory,
          );
          if (!submissionCheck.allowed) {
            throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(submissionCheck, ctx.req) });
          }
        }

        const suggestion = computeReplenishmentSuggestion({
          sku: input.sku,
          systemQty: input.systemQty,
          minQty: input.minQty,
          maxQty: input.maxQty,
          safetyStock: input.safetyStock,
        });
        const diff = Math.abs(input.studentQty - suggestion.suggestedQty);
        const reasonWithStudentQty = formatReplenishReasonWithStudentQty(suggestion.reason, input.studentQty);
        await upsertReplenishmentSuggestion({
          runId: input.runId,
          sku: input.sku,
          systemQty: input.systemQty,
          suggestedQty: suggestion.suggestedQty,
          reason: reasonWithStudentQty,
        });
        const allSuggestions = await getReplenishmentSuggestionsByRun(input.runId);
        const replenishCheck = validateReplenishmentComplete(replenishParams, allSuggestions, inventory);
        if (replenishParams.length > 0 && !replenishCheck.complete) {
          return {
            success: true,
            suggestion,
            diff,
            studentQty: input.studentQty,
            complete: false,
            remainingSkus: replenishCheck.remainingSkus ?? replenishParams.filter((p) => !(replenishCheck.completedSkus ?? []).includes(p.sku)).map((p) => p.sku),
            completedSkus: replenishCheck.completedSkus ?? [],
          };
        }
        if (!state.completedSteps.includes("REPLENISH")) {
          await markStepComplete(input.runId, "REPLENISH");
          if (!run.isDemo) {
            if (isM3ReplenishmentOnlyScenario(initialStateJson)) {
              for (const evt of buildM3011ReplenishScoringEvents(replenishParams, allSuggestions)) {
                await addScoringEvent({
                  runId: input.runId,
                  eventType: evt.eventType,
                  pointsDelta: evt.pointsDelta,
                  message: evt.message,
                });
              }
            } else {
              const qtyPoints = scoreM3ReplenishQtyFromSuggestions(replenishParams, allSuggestions);
              await addScoringEvent({
                runId: input.runId,
                eventType: "ROP_CHECK_COMPLETED",
                pointsDelta: M3_STEP_MAX.ROP_CHECK,
                message: "Analyse ROP / seuil Min validée",
              });
              await addScoringEvent({
                runId: input.runId,
                eventType: "EOQ_CALC_COMPLETED",
                pointsDelta: M3_STEP_MAX.EOQ_CALC,
                message: "Calcul quantité réappro (Max − stock) validé",
              });
              await addScoringEvent({
                runId: input.runId,
                eventType: "REPLENISH_COMPLETED",
                pointsDelta: qtyPoints,
                message: `Réapprovisionnement: suggéré ${suggestion.suggestedQty}, étudiant ${input.studentQty}`,
              });
            }
          }
        }
        return { success: true, suggestion, diff, studentQty: input.studentQty, complete: true };
      }),

    /** M3 Step 5: COMPLIANCE_M3 */
    submitComplianceM3: protectedProcedure
      .input(z.object({ runId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        if (run.userId !== ctx.user.id && ctx.user.role !== "teacher" && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        if (run.status === "completed") return { success: true };
        const state = await buildRunState(input.runId);
        const scenario = await getScenarioById(run.scenarioId);
        const initialStateJson = scenario?.initialStateJson as import("./rulesEngine").M3InitialStateJson;
        const check = canExecuteStepM3("COMPLIANCE_M3" as any, state.completedSteps as any, initialStateJson);
        if (!check.allowed) {
          if (!run.isDemo) await addScoringEvent({ runId: input.runId, eventType: "OUT_OF_SEQUENCE", pointsDelta: -5, message: check.reasonFr ?? "" });
          throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(check, ctx.req) });
        }
        const artifacts = await loadM3ComplianceArtifacts(input.runId);
        const compliance = validateM3Compliance({
          initialStateJson,
          inventoryCounts: artifacts.inventoryCounts,
          inventoryAdjustments: artifacts.inventoryAdjustments,
          replenishmentSuggestions: artifacts.replenishmentSuggestions,
          transactions: artifacts.transactions,
        });
        if (!compliance.allowed) {
          if (!run.isDemo) {
            await addScoringEvent({
              runId: input.runId,
              eventType: "COMPLIANCE_M3_FAILED",
              pointsDelta: -10,
              message: compliance.reasonFr ?? compliance.reason ?? "",
            });
          }
          throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(compliance, ctx.req) });
        }
        await markStepComplete(input.runId, "COMPLIANCE_M3");
        if (!run.isDemo) await addScoringEvent({ runId: input.runId, eventType: "COMPLIANCE_M3_COMPLETED", pointsDelta: getM3StepAwardPoints("COMPLIANCE_M3", scenario?.initialStateJson as import("./rulesEngine").M3InitialStateJson), message: "Conformité Module 3 validée" });
        await completeRun(input.runId);
        return { success: true };
      }),
  }),

  // ─── Module 4: KPI Step Markers ────────────────────────────────────────────
  m4: router({
    /** M4 Step 1: KPI_DATA — acknowledge data entry */
    submitKpiData: protectedProcedure
      .input(z.object({ runId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        if (run.userId !== ctx.user.id && ctx.user.role !== "teacher" && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        await markStepComplete(input.runId, "KPI_DATA");
        if (!run.isDemo) await addScoringEvent({ runId: input.runId, eventType: "KPI_DATA_COMPLETED", pointsDelta: 10, message: "Données KPI saisies" });
        return { success: true };
      }),

    /** M4 Step 2: KPI_ROTATION — rotation rate interpretation */
    submitKpiRotation: protectedProcedure
      .input(z.object({ runId: z.number(), studentAnswer: z.string().min(1), kpiData: z.object({ annualConsumption: z.number(), averageStock: z.number(), ordersFulfilled: z.number(), totalOrders: z.number(), operationalErrors: z.number(), totalOperations: z.number(), avgLeadTimeDays: z.number(), stockValue: z.number() }).optional() }))
      .mutation(async ({ ctx, input }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        if (run.userId !== ctx.user.id && ctx.user.role !== "teacher" && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const scenario = await getScenarioById(run.scenarioId);
        const scnCode = resolveScenarioScnCode(scenario);
        const kpiData = resolveM4KpiDataForScenario(scenario, input.kpiData);
        const kpiResult = calculateKpis(kpiData);
        const result = scoreKpiInterpretation("rotationRate", input.studentAnswer, kpiResult, scnCode);
        await addKpiInterpretation({ runId: input.runId, kpiKey: "rotationRate", studentAnswer: input.studentAnswer, isCorrect: result.isCorrect, pointsDelta: result.pointsDelta, feedback: result.feedback });
        if (!result.isCorrect) {
          throw new TRPCError({ code: "BAD_REQUEST", message: result.feedback });
        }
        await markStepComplete(input.runId, "KPI_ROTATION");
        if (!run.isDemo) await addScoringEvent({ runId: input.runId, eventType: "KPI_ROTATION_COMPLETED", pointsDelta: result.pointsDelta, message: `Taux de rotation: correct` });
        return result;
      }),

    /** M4 Step 3: KPI_SERVICE — service level interpretation */
    submitKpiService: protectedProcedure
      .input(z.object({ runId: z.number(), studentAnswer: z.string().min(1), kpiData: z.object({ annualConsumption: z.number(), averageStock: z.number(), ordersFulfilled: z.number(), totalOrders: z.number(), operationalErrors: z.number(), totalOperations: z.number(), avgLeadTimeDays: z.number(), stockValue: z.number() }).optional() }))
      .mutation(async ({ ctx, input }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        if (run.userId !== ctx.user.id && ctx.user.role !== "teacher" && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const scenario = await getScenarioById(run.scenarioId);
        const scnCode = resolveScenarioScnCode(scenario);
        const kpiData = resolveM4KpiDataForScenario(scenario, input.kpiData);
        const kpiResult = calculateKpis(kpiData);
        const result = scoreKpiInterpretation("serviceLevel", input.studentAnswer, kpiResult, scnCode);
        await addKpiInterpretation({ runId: input.runId, kpiKey: "serviceLevel", studentAnswer: input.studentAnswer, isCorrect: result.isCorrect, pointsDelta: result.pointsDelta, feedback: result.feedback });
        if (!result.isCorrect) {
          throw new TRPCError({ code: "BAD_REQUEST", message: result.feedback });
        }
        await markStepComplete(input.runId, "KPI_SERVICE");
        if (!run.isDemo) await addScoringEvent({ runId: input.runId, eventType: "KPI_SERVICE_COMPLETED", pointsDelta: result.pointsDelta, message: `Taux de service: correct` });
        return result;
      }),

    /** M4 Step 4: KPI_DIAGNOSTIC — error rate interpretation */
    submitKpiDiagnostic: protectedProcedure
      .input(z.object({ runId: z.number(), studentAnswer: z.string().min(1), kpiData: z.object({ annualConsumption: z.number(), averageStock: z.number(), ordersFulfilled: z.number(), totalOrders: z.number(), operationalErrors: z.number(), totalOperations: z.number(), avgLeadTimeDays: z.number(), stockValue: z.number() }).optional() }))
      .mutation(async ({ ctx, input }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        if (run.userId !== ctx.user.id && ctx.user.role !== "teacher" && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const scenario = await getScenarioById(run.scenarioId);
        const scnCode = resolveScenarioScnCode(scenario);
        const kpiData = resolveM4KpiDataForScenario(scenario, input.kpiData);
        const kpiResult = calculateKpis(kpiData);
        const result = scoreKpiInterpretation("diagnostic", input.studentAnswer, kpiResult, scnCode);
        await addKpiInterpretation({ runId: input.runId, kpiKey: "diagnostic", studentAnswer: input.studentAnswer, isCorrect: result.isCorrect, pointsDelta: result.pointsDelta, feedback: result.feedback });
        if (!result.isCorrect) {
          throw new TRPCError({ code: "BAD_REQUEST", message: result.feedback });
        }
        await markStepComplete(input.runId, "KPI_DIAGNOSTIC");
        if (!run.isDemo) await addScoringEvent({ runId: input.runId, eventType: "KPI_DIAGNOSTIC_COMPLETED", pointsDelta: result.pointsDelta, message: `Diagnostic: correct` });
        return result;
      }),

    /** M4 Step 5: COMPLIANCE_M4 */
    submitComplianceM4: protectedProcedure
      .input(z.object({ runId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        if (run.userId !== ctx.user.id && ctx.user.role !== "teacher" && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        if (run.status === "completed") return { success: true };

        const enableValidator = process.env.ENABLE_M4_COMPLIANCE_VALIDATOR !== "false";
        if (!enableValidator) {
          await markStepComplete(input.runId, "COMPLIANCE_M4");
          if (!run.isDemo) await addScoringEvent({ runId: input.runId, eventType: "COMPLIANCE_M4_COMPLETED", pointsDelta: M4_STEP_MAX.COMPLIANCE_M4, message: "Conformité Module 4 validée" });
          await completeRun(input.runId);
          return { success: true };
        }

        const state = await buildRunState(input.runId);
        const scenario = await getScenarioById(run.scenarioId);
        const scnCode = resolveScenarioScnCode(scenario);
        const kpiData = resolveM4KpiDataForScenario(scenario);
        const kpiResult = calculateKpis(kpiData);
        const interpretations = pickLatestKpiInterpretationsByKey(
          await getKpiInterpretationsByRun(input.runId),
        );
        const compliance = validateM4Compliance({
          scnCode,
          completedSteps: state.completedSteps,
          kpiInterpretations: interpretations.map((r) => ({
            kpiKey: r.kpiKey,
            studentAnswer: r.studentAnswer,
            isCorrect: r.isCorrect,
          })),
          kpiResult,
        });
        if (!compliance.allowed) {
          if (!run.isDemo) {
            await addScoringEvent({
              runId: input.runId,
              eventType: "COMPLIANCE_M4_FAILED",
              pointsDelta: -10,
              message: compliance.reasonFr ?? compliance.reason ?? "",
            });
          }
          throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(compliance, ctx.req) });
        }
        await markStepComplete(input.runId, "COMPLIANCE_M4");
        if (!run.isDemo) await addScoringEvent({ runId: input.runId, eventType: "COMPLIANCE_M4_COMPLETED", pointsDelta: M4_STEP_MAX.COMPLIANCE_M4, message: "Conformité Module 4 validée" });
        await completeRun(input.runId);
        return { success: true };
      }),
  }),

  // ─── Module 5: Integrated Simulation ──────────────────────────────────────
  m5: router({
    /** M5 KPI ledger anchor — derive KPI inputs from run evidence */
    kpiLedger: protectedProcedure
      .input(z.object({ runId: z.number() }))
      .query(async ({ ctx, input }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        if (run.userId !== ctx.user.id && ctx.user.role !== "teacher" && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const state = await buildRunState(input.runId);
        const replenishments = await getReplenishmentSuggestionsByRun(input.runId);
        const contract = getM5ContractFromSeed(state.m5InitialStateJson);
        const replRow = contract?.sku
          ? replenishments.find((r) => r.sku === contract.sku)
          : replenishments[0];
        const completedSteps = (state.completedSteps ?? []) as string[];
        const { ledger: evidence, sessionEvidence, kpiData } = buildM5SessionEvidenceFromRunState({
          initialStateJson: state.m5InitialStateJson,
          completedSteps,
          transactions: state.transactions,
          inventoryCounts: state.inventoryCounts,
          inventoryAdjustments: state.inventoryAdjustments,
          inventory: state.inventory,
          replenishmentQty: replRow ? Number(replRow.suggestedQty) : null,
          runStartedAt: run.startedAt,
          runCompletedAt: run.completedAt,
        });
        // Legacy kpiResult retained for historical UI paths — not session truth.
        const kpiResult = calculateKpis(kpiData);
        return {
          kpiData,
          kpiResult,
          evidence,
          sessionEvidence,
          evidenceVersion: sessionEvidence.evidenceVersion,
          /** Demo-only Annexe A example — never treat as session evidence. */
          canonicalExample: run.isDemo ? CANONICAL_M4_KPI_DATA : null,
          legacyPortfolioHidden: true,
          isDemo: run.isDemo,
        };
      }),

    /** M5 Step 1: M5_RECEPTION */
    submitReception: protectedProcedure
      .input(z.object({ runId: z.number(), sku: z.string(), qty: z.number().positive(), docRef: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        if (run.userId !== ctx.user.id && ctx.user.role !== "teacher" && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const scenario = await getScenarioById(run.scenarioId);
        const m5State = scenario?.initialStateJson as M5InitialStateJson | undefined;
        const contract = getM5ContractFromSeed(m5State);
        const validation = validateM5Reception(input, contract);
        if (!validation.allowed) {
          throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(validation, ctx.req) });
        }
        await addTransaction({ runId: input.runId, docType: "GR", moveType: "MIGO", sku: input.sku, bin: "REC-01", qty: String(input.qty), posted: true, docRef: input.docRef, comment: "M5 Réception fournisseur" });
        await markStepComplete(input.runId, "M5_RECEPTION");
        if (!run.isDemo) await addScoringEvent({ runId: input.runId, eventType: "M5_RECEPTION_COMPLETED", pointsDelta: 10, message: "Réception M5 validée" });
        return { success: true };
      }),

    /** M5 Step 2: M5_PUTAWAY */
    submitPutaway: protectedProcedure
      .input(z.object({ runId: z.number(), sku: z.string(), fromBin: z.string(), toBin: z.string(), qty: z.number().positive(), lotNumber: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        if (run.userId !== ctx.user.id && ctx.user.role !== "teacher" && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const scenario = await getScenarioById(run.scenarioId);
        const m5State = scenario?.initialStateJson as M5InitialStateJson | undefined;
        const contract = getM5ContractFromSeed(m5State);
        const validation = validateM5Putaway(input, contract);
        if (!validation.allowed) {
          throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(validation, ctx.req) });
        }
        await addTransaction({ runId: input.runId, docType: "PUTAWAY", moveType: "LT01", sku: input.sku, bin: input.toBin, qty: String(input.qty), posted: true, docRef: `PUT-${input.lotNumber}`, comment: `M5 Rangement ${input.fromBin}→${input.toBin}` });
        await addPutawayRecord({ runId: input.runId, sku: input.sku, fromBin: input.fromBin, toBin: input.toBin, qty: input.qty, lotNumber: input.lotNumber, receivedAt: new Date() });
        await markStepComplete(input.runId, "M5_PUTAWAY");
        if (!run.isDemo) await addScoringEvent({ runId: input.runId, eventType: "M5_PUTAWAY_COMPLETED", pointsDelta: 10, message: "Rangement M5 validé" });
        return { success: true };
      }),

    /** M5 Step 3: M5_CYCLE_COUNT */
    submitCycleCount: protectedProcedure
      .input(z.object({ runId: z.number(), sku: z.string(), bin: z.string(), systemQty: z.number(), countedQty: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        if (run.userId !== ctx.user.id && ctx.user.role !== "teacher" && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const scenario = await getScenarioById(run.scenarioId);
        const m5State = scenario?.initialStateJson as M5InitialStateJson | undefined;
        const targets = getM5CycleCountTargets(m5State);
        const seededTarget = targets.find((t) => t.sku === input.sku && t.bin === input.bin);
        const systemQty = seededTarget ? seededTarget.systemQty : input.systemQty;
        const countedQty = seededTarget ? seededTarget.physicalQty : input.countedQty;
        const variance = countedQty - systemQty;
        await addInventoryCount({ runId: input.runId, sku: input.sku, systemQty, countedQty, varianceQty: variance });
        await markStepComplete(input.runId, "M5_CYCLE_COUNT");
        if (!run.isDemo) await addScoringEvent({ runId: input.runId, eventType: "M5_CYCLE_COUNT_COMPLETED", pointsDelta: variance === 0 ? 15 : 10, message: `M5 Inventaire: variance ${variance}` });
        return { success: true, variance, systemQty, countedQty, injected: !!seededTarget };
      }),

    /** M5 Step 3b: M5_ADJ — inventory adjustment (SCN-016 variance path) */
    submitAdj: protectedProcedure
      .input(z.object({
        runId: z.number(),
        sku: z.string(),
        bin: z.string(),
        varianceQty: z.number(),
        justification: z.string().min(10),
      }))
      .mutation(async ({ ctx, input }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        if (run.userId !== ctx.user.id && ctx.user.role !== "teacher" && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        if (input.varianceQty === 0) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Variance qty must be non-zero for M5_ADJ" });
        }
        const qtyCheck = validateAdjustment(input.varianceQty, input.varianceQty);
        if (!qtyCheck.allowed) {
          throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(qtyCheck, ctx.req) });
        }
        const scenario = await getScenarioById(run.scenarioId);
        const m5State = scenario?.initialStateJson as M5InitialStateJson | undefined;
        const inventoryCounts = await getInventoryCountsByRun(input.runId);
        const countRow = inventoryCounts.find((c) => c.sku === input.sku);
        const systemQty = countRow ? Number(countRow.systemQty) : 0;
        const countedQty = countRow ? Number(countRow.countedQty) : systemQty + input.varianceQty;
        const justificationCheck = validateVarianceEntry(
          systemQty,
          countedQty,
          input.justification,
          5,
        );
        if (!justificationCheck.allowed) {
          throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(justificationCheck, ctx.req) });
        }
        const targets = getM5CycleCountTargets(m5State);
        const expectedTarget = targets.find((t) => t.sku === input.sku);
        if (expectedTarget) {
          const expectedVariance = expectedTarget.physicalQty - expectedTarget.systemQty;
          if (input.varianceQty !== expectedVariance) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `Expected variance ${expectedVariance} for ${input.sku}, got ${input.varianceQty}`,
            });
          }
        }
        await addInventoryAdjustment({
          runId: input.runId,
          sku: input.sku,
          varianceQty: input.varianceQty,
          adjustmentQty: input.varianceQty,
          reason: input.justification.trim(),
        });
        await addTransaction({
          runId: input.runId,
          docType: "ADJ",
          moveType: "MI07",
          sku: input.sku,
          bin: input.bin,
          qty: String(input.varianceQty),
          posted: true,
          docRef: `ADJ-M5-${input.sku}`,
          comment: input.justification.trim(),
        });
        await resolveAllCycleCountsByRun(input.runId);
        await markStepComplete(input.runId, "M5_ADJ");
        if (!run.isDemo) {
          await addScoringEvent({
            runId: input.runId,
            eventType: "M5_ADJ_COMPLETED",
            pointsDelta: 10,
            message: `M5 ADJ ${input.varianceQty} u. posté pour ${input.sku}`,
          });
        }
        return { success: true };
      }),

    /** M5 Step 4: M5_REPLENISH */
    submitReplenish: protectedProcedure
      .input(z.object({ runId: z.number(), sku: z.string(), systemQty: z.number(), minQty: z.number(), maxQty: z.number(), safetyStock: z.number(), studentQty: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        if (run.userId !== ctx.user.id && ctx.user.role !== "teacher" && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const state = await buildRunState(input.runId);
        const scenario = await getScenarioById(run.scenarioId);
        const m5State = scenario?.initialStateJson as M5InitialStateJson | undefined;
        const varianceGate = assertM5VarianceGate(
          m5State,
          state.inventoryCounts ?? [],
          state.inventoryAdjustments ?? [],
          state.transactions,
        );
        if (!varianceGate.allowed) {
          throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(varianceGate, ctx.req) });
        }
        const suggestion = computeReplenishmentSuggestion({ sku: input.sku, systemQty: input.systemQty, minQty: input.minQty, maxQty: input.maxQty, safetyStock: input.safetyStock });
        const diff = Math.abs(input.studentQty - suggestion.suggestedQty);
        const points = diff === 0 ? 15 : diff <= 10 ? 10 : 5;
        await addReplenishmentSuggestion({ runId: input.runId, sku: input.sku, systemQty: input.systemQty, suggestedQty: suggestion.suggestedQty, reason: suggestion.reason });
        await markStepComplete(input.runId, "M5_REPLENISH");
        if (!run.isDemo) await addScoringEvent({ runId: input.runId, eventType: "M5_REPLENISH_COMPLETED", pointsDelta: points, message: `M5 Réappro: suggéré ${suggestion.suggestedQty}, étudiant ${input.studentQty}` });
        return { success: true, suggestion, diff, studentQty: input.studentQty };
      }),

    /** M5 Step 5: M5_KPI — confirm session evidence only (no legacy M4 portfolio inputs). */
    submitKpi: protectedProcedure
      .input(z.object({
        runId: z.number(),
        confirmedFromLedger: z.boolean().optional(),
        /** Ignored — retained only so in-flight clients do not fail Zod parse. */
        kpiData: z.object({
          annualConsumption: z.number(), averageStock: z.number(), ordersFulfilled: z.number(),
          totalOrders: z.number(), operationalErrors: z.number(), totalOperations: z.number(),
          avgLeadTimeDays: z.number(), stockValue: z.number(),
        }).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        if (run.userId !== ctx.user.id && ctx.user.role !== "teacher" && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const state = await buildRunState(input.runId);
        const scenario = await getScenarioById(run.scenarioId);
        const m5State = scenario?.initialStateJson as M5InitialStateJson | undefined;
        const varianceGate = assertM5VarianceGate(
          m5State,
          state.inventoryCounts ?? [],
          state.inventoryAdjustments ?? [],
          state.transactions,
        );
        if (!varianceGate.allowed) {
          throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(varianceGate, ctx.req) });
        }
        const replenishments = await getReplenishmentSuggestionsByRun(input.runId);
        const contract = getM5ContractFromSeed(m5State);
        const replRow = contract?.sku
          ? replenishments.find((r) => r.sku === contract.sku)
          : replenishments[0];
        const { ledger: evidence, sessionEvidence, kpiData: derivedKpi } = buildM5SessionEvidenceFromRunState({
          initialStateJson: m5State,
          completedSteps: (state.completedSteps ?? []) as string[],
          transactions: state.transactions,
          inventoryCounts: state.inventoryCounts,
          inventoryAdjustments: state.inventoryAdjustments,
          inventory: state.inventory,
          replenishmentQty: replRow ? Number(replRow.suggestedQty) : null,
          runStartedAt: run.startedAt,
          runCompletedAt: run.completedAt,
        });
        void input.kpiData; // never trust client portfolio fields
        void sessionEvidence;
        const kpiValidation = validateM5KpiSubmission({
          isDemo: run.isDemo,
          confirmedFromLedger: input.confirmedFromLedger ?? false,
        });
        if (!kpiValidation.allowed) {
          throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(kpiValidation, ctx.req) });
        }
        // Snapshot columns are server-derived for Gold row-existence only — not session truth.
        const kpiResult = calculateKpis(derivedKpi);
        const evidenceSource = formatM5KpiEvidenceSource(evidence);
        await addKpiSnapshot({
          runId: input.runId,
          rotationRate: kpiResult.rotationRate,
          serviceLevel: kpiResult.serviceLevel,
          errorRate: kpiResult.errorRate,
          averageLeadTime: kpiResult.averageLeadTime,
          stockImmobilizedValue: kpiResult.stockImmobilizedValue,
        });
        await markStepComplete(input.runId, "M5_KPI");
        if (!run.isDemo) {
          await addScoringEvent({
            runId: input.runId,
            eventType: "M5_KPI_COMPLETED",
            pointsDelta: 10,
            message: `KPI M5 session evidence confirmed — snapshot recorded | ${evidenceSource}`,
          });
        }
        return { success: true, kpiResult, evidenceSource };
      }),

    /** M5 Step 6: M5_DECISION — strategic decision */
    submitDecision: protectedProcedure
      .input(z.object({ runId: z.number(), studentDecision: z.string().min(10), kpiData: z.object({ annualConsumption: z.number(), averageStock: z.number(), ordersFulfilled: z.number(), totalOrders: z.number(), operationalErrors: z.number(), totalOperations: z.number(), avgLeadTimeDays: z.number(), stockValue: z.number() }).optional() }))
      .mutation(async ({ ctx, input }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        if (run.userId !== ctx.user.id && ctx.user.role !== "teacher" && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const state = await buildRunState(input.runId);
        const scenario = await getScenarioById(run.scenarioId);
        const m5State = scenario?.initialStateJson as M5InitialStateJson | undefined;
        const scnCode = resolveScenarioScnCode(scenario);
        const contract = getM5ContractFromSeed(m5State);
        const varianceGate = assertM5VarianceGate(
          m5State,
          state.inventoryCounts ?? [],
          state.inventoryAdjustments ?? [],
          state.transactions,
        );
        if (!varianceGate.allowed) {
          throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(varianceGate, ctx.req) });
        }
        const snapshotRow = await getKpiSnapshotByRun(input.runId);
        if (!snapshotRow) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "KPI snapshot required — complete M5_KPI before submitting decision",
          });
        }
        const kpiSnapshot = {
          rotationRate: Number(snapshotRow.rotationRate),
          serviceLevel: Number(snapshotRow.serviceLevel),
          errorRate: Number(snapshotRow.errorRate),
          averageLeadTime: Number(snapshotRow.averageLeadTime),
          stockImmobilizedValue: Number(snapshotRow.stockImmobilizedValue),
        };
        const decisionLevel = contract?.decisionLevel ?? (scnCode === "SCN-017" ? "STRATEGIC" : "TACTICAL");
        const result = scoreM5Decision(input.studentDecision, calculateKpis(getM5KpiDataFromSeed(m5State)), {
          decisionLevel,
          kpiSnapshot,
        });
        if (decisionLevel === "STRATEGIC" && result.rejected) {
          if (!run.isDemo) {
            await addScoringEvent({
              runId: input.runId,
              eventType: "M5_DECISION_REJECTED",
              pointsDelta: 0,
              message: result.feedback,
            });
          }
          throw new TRPCError({ code: "BAD_REQUEST", message: result.feedback });
        }
        await markStepComplete(input.runId, "M5_DECISION");
        await addKpiInterpretation({
          runId: input.runId,
          kpiKey: "m5Decision",
          studentAnswer: input.studentDecision,
          isCorrect: !result.rejected,
          pointsDelta: result.score,
          feedback: result.feedback,
        });
        if (!run.isDemo) await addScoringEvent({ runId: input.runId, eventType: "M5_DECISION_COMPLETED", pointsDelta: result.score, message: `Décision stratégique: ${result.score}/30 pts` });
        return { success: true, ...result };
      }),

    /** M5 Step 7: COMPLIANCE_M5 */
    submitComplianceM5: protectedProcedure
      .input(z.object({ runId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const run = await getRunById(input.runId);
        if (!run) throw new TRPCError({ code: "NOT_FOUND" });
        if (run.userId !== ctx.user.id && ctx.user.role !== "teacher" && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });

        const enableValidator = process.env.ENABLE_M5_COMPLIANCE_VALIDATOR !== "false";
        if (!enableValidator) {
          await markStepComplete(input.runId, "COMPLIANCE_M5");
          if (!run.isDemo) await addScoringEvent({ runId: input.runId, eventType: "COMPLIANCE_M5_COMPLETED", pointsDelta: 20, message: "Validation finale M5 complétée" });
          await completeRun(input.runId);
          return { success: true };
        }

        const state = await buildRunState(input.runId);
        const scenario = await getScenarioById(run.scenarioId);
        const m5State = scenario?.initialStateJson as M5InitialStateJson | undefined;
        const scnCode = resolveScenarioScnCode(scenario);
        const snapshotRow = await getKpiSnapshotByRun(input.runId);
        const kpiSnapshot = snapshotRow ? {
          rotationRate: Number(snapshotRow.rotationRate),
          serviceLevel: Number(snapshotRow.serviceLevel),
          errorRate: Number(snapshotRow.errorRate),
          averageLeadTime: Number(snapshotRow.averageLeadTime),
          stockImmobilizedValue: Number(snapshotRow.stockImmobilizedValue),
        } : null;
        const effectiveSteps = getEffectiveM5Steps(m5State, state);
        const decisionRejected = scnCode === "SCN-017" && !state.completedSteps.includes("M5_DECISION");
        const compliance = validateM5Compliance({
          scnCode,
          initialStateJson: m5State,
          completedSteps: state.completedSteps,
          inventoryCounts: state.inventoryCounts ?? [],
          inventoryAdjustments: state.inventoryAdjustments ?? [],
          transactions: state.transactions,
          inventory: state.inventory,
          kpiSnapshot,
          decisionRejected,
          effectiveSteps,
        });
        if (!compliance.allowed) {
          if (!run.isDemo) {
            await addScoringEvent({
              runId: input.runId,
              eventType: "COMPLIANCE_M5_FAILED",
              pointsDelta: -10,
              message: compliance.reasonFr ?? compliance.reason ?? "",
            });
          }
          throw new TRPCError({ code: "BAD_REQUEST", message: pickReason(compliance, ctx.req) });
        }
        await markStepComplete(input.runId, "COMPLIANCE_M5");
        if (!run.isDemo) await addScoringEvent({ runId: input.runId, eventType: "COMPLIANCE_M5_COMPLETED", pointsDelta: 20, message: "Validation finale M5 complétée" });
        await completeRun(input.runId);
        return { success: true };
      }),
  }),

  // ─── Employee Profile (RC20-A.2 — read-path derivation) ─────────────────────
  employeeProfile: router({
    assemble: protectedProcedure.query(async ({ ctx }) => {
      const { assembleEmployeeProfileForUser } = await import("./employeeProfile");
      return assembleEmployeeProfileForUser({
        userId: ctx.user.id,
        displayName: ctx.user.name?.trim() || ctx.user.email || `Practicant #${ctx.user.id}`,
      });
    }),
  }),

  // ─── Enterprise Context Engine (RC21 Wave 3) ─────────────────────────────────
  enterpriseContext: router({
    assemble: protectedProcedure
      .input(
        z.object({
          runId: z.number().optional(),
          scnCode: z.string().optional(),
          scenarioId: z.number().optional(),
        })
      )
      .query(async ({ ctx, input }) => {
        if (!input.runId && !input.scnCode && !input.scenarioId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "runId, scnCode, or scenarioId required",
          });
        }

        let targetUserId = ctx.user.id;

        if (input.runId) {
          const run = await getRunById(input.runId);
          if (!run) throw new TRPCError({ code: "NOT_FOUND", message: "Run not found" });
          if (
            run.userId !== ctx.user.id &&
            ctx.user.role !== "teacher" &&
            ctx.user.role !== "admin"
          ) {
            throw new TRPCError({ code: "FORBIDDEN" });
          }
          targetUserId = run.userId;
        }

        const { assembleEnterpriseContext } = await import("./enterpriseContext");
        return assembleEnterpriseContext({
          userId: targetUserId,
          runId: input.runId,
          scnCode: input.scnCode,
          scenarioId: input.scenarioId,
        });
      }),
  }),

  // ── INTEGRATED ASSESSMENTS ──────────────────────────────────────────────────
  assessments: assessmentsRouter,

  // ── FORMATIVE EXERCISES (M4/M5) — isolated from official scoring ─────────────
  formativeExercises: formativeExercisesRouter,
  /** M5 documentary supervision (supervision-doc-v1) — isolated from ops-ledger-v1 */
  m5Doc: m5DocRouter,

  // ── QUIZ ROUTER ─────────────────────────────────────────────────────────────
  quiz: router({
    /** Get quiz for a module (correct answers hidden from student) */
    getByModule: protectedProcedure
      .input(z.object({ moduleId: z.number() }))
      .query(async ({ input }) => {
        const quiz = await getQuizByModule(input.moduleId);
        if (!quiz) return null;
        const full = await getQuizWithQuestions(quiz.id);
        if (!full) return null;
        const { seededShuffle } = await import("../shared/assessmentCore");
        return {
          id: full.id,
          moduleId: full.moduleId,
          titleFr: full.titleFr,
          titleEn: full.titleEn,
          passingScore: full.passingScore,
          questions: full.questions.map(q => {
            let optionsFr = (typeof q.optionsFr === "string" ? JSON.parse(q.optionsFr as string) : q.optionsFr) as string[];
            let optionsEn = (typeof q.optionsEn === "string" ? JSON.parse(q.optionsEn as string) : q.optionsEn) as string[];
            let optionIds: string[] = optionsFr.map((_, i) => `legacy_${q.id}_${i}`);
            const payload = q.optionsPayload as Array<{ id: string; fr: string; en: string }> | null;
            if (payload && Array.isArray(payload) && payload.length) {
              optionsFr = payload.map(o => o.fr);
              optionsEn = payload.map(o => o.en);
              optionIds = payload.map(o => o.id);
            }
            const order = seededShuffle(
              optionIds.map((_, i) => i),
              `quiz-${quiz.id}-q${q.id}-display`
            );
            return {
              id: q.id,
              questionFr: q.questionFr,
              questionEn: q.questionEn,
              optionsFr: order.map(i => optionsFr[i]),
              optionsEn: order.map(i => optionsEn[i]),
              optionIds: order.map(i => optionIds[i]),
              difficulty: q.difficulty,
              orderIndex: q.orderIndex,
            };
          }),
        };
      }),

    /** Get best quiz attempt for current user + module */
    getBestAttempt: protectedProcedure
      .input(z.object({ moduleId: z.number() }))
      .query(async ({ ctx, input }) => {
        const attempt = await getBestQuizAttempt(ctx.user.id, input.moduleId);
        return attempt ?? null;
      }),

    /** Get all attempts for current user + module */
    getAttempts: protectedProcedure
      .input(z.object({ moduleId: z.number() }))
      .query(async ({ ctx, input }) => {
        return getQuizAttemptsByUser(ctx.user.id, input.moduleId);
      }),

    /** Submit quiz answers — prefers option IDs; falls back to display indices */
    submit: protectedProcedure
      .input(z.object({
        moduleId: z.number(),
        answers: z.array(z.number()).optional(),
        selectedOptionIds: z.array(z.string().nullable()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const quiz = await getQuizByModule(input.moduleId);
        if (!quiz) throw new TRPCError({ code: "NOT_FOUND", message: "Quiz non trouvé pour ce module" });
        const full = await getQuizWithQuestions(quiz.id);
        if (!full) throw new TRPCError({ code: "NOT_FOUND" });
        const questions = full.questions;
        const { seededShuffle } = await import("../shared/assessmentCore");

        let correct = 0;
        const feedback = questions.map((q, i) => {
          const payload = q.optionsPayload as Array<{ id: string }> | null;
          let optionIds = payload?.map(o => o.id) ?? null;
          if (!optionIds) {
            const optionsFr = (typeof q.optionsFr === "string" ? JSON.parse(q.optionsFr as string) : q.optionsFr) as string[];
            optionIds = optionsFr.map((_, idx) => `legacy_${q.id}_${idx}`);
          }
          const order = seededShuffle(
            optionIds.map((_, idx) => idx),
            `quiz-${quiz.id}-q${q.id}-display`
          );
          const displayedIds = order.map(idx => optionIds![idx]);

          let selectedId: string | null = null;
          if (input.selectedOptionIds && input.selectedOptionIds[i] != null) {
            selectedId = input.selectedOptionIds[i];
          } else if (input.answers && input.answers[i] != null) {
            selectedId = displayedIds[input.answers[i]] ?? null;
          }

          const correctId = q.correctOptionId ?? optionIds[q.correctIndex];
          const isCorrect = !!selectedId && selectedId === correctId;
          if (isCorrect) correct++;
          return {
            questionId: q.id,
            chosen: selectedId,
            correctOptionId: correctId,
            isCorrect,
            explanationFr: q.explanationFr,
            explanationEn: q.explanationEn,
          };
        });
        const score = Math.round((correct / questions.length) * 100);
        const passed = score >= quiz.passingScore;
        // Persist legacy index array when provided (historical compatibility)
        await saveQuizAttempt({
          userId: ctx.user.id,
          quizId: quiz.id,
          moduleId: input.moduleId,
          answers: input.answers ?? feedback.map(() => -1),
          score,
          passed,
        });

        if (input.moduleId === 1) {
          const status = await getSilverCertificationStatus(ctx.user.id);
          if (status.silverEligible && !status.silverCertified) {
            await unlockSilverCertification(ctx.user.id);
          }
        }

        return { score, passed, correct, total: questions.length, passingScore: quiz.passingScore, feedback };
      }),

    /** Soft check — does NOT reveal correct option or explanation (integrity) */
    checkAnswer: protectedProcedure
      .input(z.object({
        moduleId: z.number(),
        questionIndex: z.number(),
        chosenIndex: z.number().optional(),
        selectedOptionId: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const quiz = await getQuizByModule(input.moduleId);
        if (!quiz) throw new TRPCError({ code: "NOT_FOUND", message: "Quiz non trouvé" });
        const full = await getQuizWithQuestions(quiz.id);
        if (!full) throw new TRPCError({ code: "NOT_FOUND" });
        const q = full.questions[input.questionIndex];
        if (!q) throw new TRPCError({ code: "BAD_REQUEST", message: "Question introuvable" });
        const { seededShuffle } = await import("../shared/assessmentCore");
        const payload = q.optionsPayload as Array<{ id: string }> | null;
        let optionIds = payload?.map(o => o.id) ?? null;
        if (!optionIds) {
          const optionsFr = (typeof q.optionsFr === "string" ? JSON.parse(q.optionsFr as string) : q.optionsFr) as string[];
          optionIds = optionsFr.map((_, idx) => `legacy_${q.id}_${idx}`);
        }
        const order = seededShuffle(
          optionIds.map((_, idx) => idx),
          `quiz-${quiz.id}-q${q.id}-display`
        );
        const displayedIds = order.map(idx => optionIds![idx]);
        const selectedId =
          input.selectedOptionId ??
          (input.chosenIndex != null ? displayedIds[input.chosenIndex] : null);
        const correctId = q.correctOptionId ?? optionIds[q.correctIndex];
        const isCorrect = !!selectedId && selectedId === correctId;
        // No correctIndex / explanation leakage before final submit
        return { isCorrect };
      }),
  }),
});

export type AppRouter = typeof appRouter;
