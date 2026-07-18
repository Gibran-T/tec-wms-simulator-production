import {
  boolean,
  decimal,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

// ─── Core Users ───────────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  passwordHash: varchar("passwordHash", { length: 255 }), // for local email/password auth
  role: mysqlEnum("role", ["user", "admin", "student", "teacher"]).default("student").notNull(),
  isActive: boolean("isActive").default(true).notNull(), // teacher can deactivate/exclude students
  notes: text("notes"), // teacher notes about the student
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Password Reset Tokens ───────────────────────────────────────────────────
export const passwordResetTokens = mysqlTable("password_reset_tokens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  token: varchar("token", { length: 128 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  usedAt: timestamp("usedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;

// ─── Cohorts ──────────────────────────────────────────────────────────────────
export const cohorts = mysqlTable("cohorts", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Cohort = typeof cohorts.$inferSelect;

// ─── Profiles (extended user info) ───────────────────────────────────────────
export const profiles = mysqlTable("profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  cohortId: int("cohortId"),
  studentNumber: varchar("studentNumber", { length: 64 }),
  silverCertified: boolean("silverCertified").default(false).notNull(),
  goldCertified: boolean("goldCertified").default(false).notNull(),
  /** Audit source for institutional Gold awards (e.g. FONDATRICE_2026_GOLD_AWARD). */
  goldAwardSource: varchar("goldAwardSource", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Profile = typeof profiles.$inferSelect;

// ─── Modules ──────────────────────────────────────────────────────────────────
export const modules = mysqlTable("modules", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 10 }).notNull().unique(), // M1, M2, ...
  titleFr: varchar("titleFr", { length: 255 }).notNull(),
  titleEn: varchar("titleEn", { length: 255 }).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  stepsJson: json("stepsJson"), // ordered step definitions
  order: int("order").default(1).notNull(),
  unlockedByModuleId: int("unlockedByModuleId"), // null = always unlocked
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Module = typeof modules.$inferSelect;

// ─── Master SKUs ──────────────────────────────────────────────────────────────
export const masterSkus = mysqlTable("master_skus", {
  id: int("id").autoincrement().primaryKey(),
  sku: varchar("sku", { length: 64 }).notNull().unique(),
  descriptionFr: varchar("descriptionFr", { length: 255 }).notNull(),
  descriptionEn: varchar("descriptionEn", { length: 255 }),
  unitOfMeasure: varchar("unitOfMeasure", { length: 32 }).default("UN"),
  maxCapacity: int("maxCapacity").default(1000),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MasterSku = typeof masterSkus.$inferSelect;

// ─── Master Bins ──────────────────────────────────────────────────────────────
export const masterBins = mysqlTable("master_bins", {
  id: int("id").autoincrement().primaryKey(),
  binCode: varchar("binCode", { length: 64 }).notNull().unique(),
  description: varchar("description", { length: 255 }),
  zone: mysqlEnum("zone", ["RECEPTION", "PICKING", "STOCKAGE", "RESERVE", "EXPEDITION"]).default("STOCKAGE"),
  maxCapacity: int("maxCapacity").default(500),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MasterBin = typeof masterBins.$inferSelect;

// ─── Scenarios ────────────────────────────────────────────────────────────────
export const scenarios = mysqlTable("scenarios", {
  id: int("id").autoincrement().primaryKey(),
  moduleId: int("moduleId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  descriptionFr: text("descriptionFr"),
  descriptionEn: text("descriptionEn"),
  difficulty: mysqlEnum("difficulty", ["facile", "moyen", "difficile"]).default("moyen"),
  initialStateJson: json("initialStateJson"), // pre-loaded transactions/stock
  createdBy: int("createdBy").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  nameModuleIdx: uniqueIndex("scenarios_name_module_idx").on(table.name, table.moduleId),
}));

export type Scenario = typeof scenarios.$inferSelect;

// ─── Assignments ──────────────────────────────────────────────────────────────
export const assignments = mysqlTable("assignments", {
  id: int("id").autoincrement().primaryKey(),
  scenarioId: int("scenarioId").notNull(),
  cohortId: int("cohortId"),
  userId: int("userId"),
  isActive: boolean("isActive").default(true).notNull(),
  dueDate: timestamp("dueDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Assignment = typeof assignments.$inferSelect;

// ─── Scenario Runs ────────────────────────────────────────────────────────────
export const scenarioRuns = mysqlTable("scenario_runs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  scenarioId: int("scenarioId").notNull(),
  status: mysqlEnum("status", ["in_progress", "completed", "abandoned"]).default("in_progress").notNull(),
  isDemo: boolean("isDemo").default(false).notNull(),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type ScenarioRun = typeof scenarioRuns.$inferSelect;

// ─── Transactions (PO, GR, SO, GI, ADJ) ──────────────────────────────────────
export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  runId: int("runId").notNull(),
  docType: mysqlEnum("docType", ["PO", "GR", "SO", "GI", "ADJ", "PUTAWAY", "PUTAWAY_M1", "PICKING", "PICKING_M1"]).notNull(),
  moveType: varchar("moveType", { length: 16 }), // e.g. 101, 261, 201
  sku: varchar("sku", { length: 64 }).notNull(),
  bin: varchar("bin", { length: 64 }).notNull(),
  qty: decimal("qty", { precision: 10, scale: 2 }).notNull(),
  posted: boolean("posted").default(false).notNull(),
  docRef: varchar("docRef", { length: 64 }), // PO number, SO number, etc.
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;

// ─── Cycle Counts ─────────────────────────────────────────────────────────────
export const cycleCounts = mysqlTable("cycle_counts", {
  id: int("id").autoincrement().primaryKey(),
  runId: int("runId").notNull(),
  sku: varchar("sku", { length: 64 }).notNull(),
  bin: varchar("bin", { length: 64 }).notNull(),
  systemQty: decimal("systemQty", { precision: 10, scale: 2 }).notNull(),
  physicalQty: decimal("physicalQty", { precision: 10, scale: 2 }).notNull(),
  variance: decimal("variance", { precision: 10, scale: 2 }).notNull(),
  resolved: boolean("resolved").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CycleCount = typeof cycleCounts.$inferSelect;

// ─── Progress (per step) ──────────────────────────────────────────────────────
export const progress = mysqlTable("progress", {
  id: int("id").autoincrement().primaryKey(),
  runId: int("runId").notNull(),
  stepCode: varchar("stepCode", { length: 32 }).notNull(), // PO, GR, STOCK, SO, GI, CC, COMPLIANCE
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completedAt"),
});

export type Progress = typeof progress.$inferSelect;

// ─── Scoring Events ───────────────────────────────────────────────────────────
export const scoringEvents = mysqlTable("scoring_events", {
  id: int("id").autoincrement().primaryKey(),
  runId: int("runId").notNull(),
  eventType: varchar("eventType", { length: 64 }).notNull(),
  pointsDelta: int("pointsDelta").notNull(),
  message: text("message"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ScoringEvent = typeof scoringEvents.$inferSelect;

// ─── Bin Capacity (Module 2) ──────────────────────────────────────────────────
export const binCapacity = mysqlTable("bin_capacity", {
  id: int("id").autoincrement().primaryKey(),
  binCode: varchar("binCode", { length: 64 }).notNull().unique(),
  maxCapacity: int("maxCapacity").notNull().default(500),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BinCapacity = typeof binCapacity.$inferSelect;

// ─── Putaway Records (Module 2) ───────────────────────────────────────────────
export const putawayRecords = mysqlTable("putaway_records", {
  id: int("id").autoincrement().primaryKey(),
  runId: int("runId").notNull(),
  sku: varchar("sku", { length: 64 }).notNull(),
  fromBin: varchar("fromBin", { length: 64 }).notNull(), // source (reception)
  toBin: varchar("toBin", { length: 64 }).notNull(),     // destination (storage)
  qty: int("qty").notNull(),
  lotNumber: varchar("lotNumber", { length: 64 }),       // for FIFO tracking
  receivedAt: timestamp("receivedAt").defaultNow().notNull(), // FIFO reference
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PutawayRecord = typeof putawayRecords.$inferSelect;

// ─── Module Progress ──────────────────────────────────────────────────────────
export const moduleProgress = mysqlTable("module_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  moduleId: int("moduleId").notNull(),
  passed: boolean("passed").default(false).notNull(),
  bestScore: int("bestScore").default(0).notNull(),
  completedAt: timestamp("completedAt"),
  teacherValidated: boolean("teacherValidated").default(false).notNull(),
  teacherValidatedAt: timestamp("teacherValidatedAt"),
  progressPct: int("progressPct").default(0).notNull(),
  completedScenarios: int("completedScenarios").default(0).notNull(),
  requiredScenarios: int("requiredScenarios").default(3).notNull(),
  averageScore: int("averageScore"),
  scenarioStatusJson: json("scenarioStatusJson"),
  engineVersion: varchar("engineVersion", { length: 16 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userModuleIdx: uniqueIndex("module_progress_user_module_idx").on(table.userId, table.moduleId),
}));

export type ModuleProgress = typeof moduleProgress.$inferSelect;

// ─── Inventory Counts (Module 3) ──────────────────────────────────────────────
export const inventoryCounts = mysqlTable("inventory_counts", {
  id: int("id").autoincrement().primaryKey(),
  runId: int("runId").notNull(),
  sku: varchar("sku", { length: 64 }).notNull(),
  systemQty: decimal("systemQty", { precision: 10, scale: 2 }).notNull(),
  countedQty: decimal("countedQty", { precision: 10, scale: 2 }).notNull(),
  varianceQty: decimal("varianceQty", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type InventoryCount = typeof inventoryCounts.$inferSelect;

// ─── Inventory Adjustments (Module 3) ────────────────────────────────────────
export const inventoryAdjustments = mysqlTable("inventory_adjustments", {
  id: int("id").autoincrement().primaryKey(),
  runId: int("runId").notNull(),
  sku: varchar("sku", { length: 64 }).notNull(),
  varianceQty: decimal("varianceQty", { precision: 10, scale: 2 }).notNull(),
  adjustmentQty: decimal("adjustmentQty", { precision: 10, scale: 2 }).notNull(),
  reason: text("reason"),
  approved: boolean("approved").default(false).notNull(),
  approvedBy: int("approvedBy"),
  approvedAt: timestamp("approvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type InventoryAdjustment = typeof inventoryAdjustments.$inferSelect;

// ─── CC_RECON target claims (SCN-009 atomic idempotency) ─────────────────────
export const ccReconTargetClaims = mysqlTable("cc_recon_target_claims", {
  id: int("id").autoincrement().primaryKey(),
  runId: int("runId").notNull(),
  stepCode: varchar("stepCode", { length: 32 }).notNull().default("CC_RECON"),
  sku: varchar("sku", { length: 64 }).notNull(),
  bin: varchar("bin", { length: 64 }).notNull(),
  idempotencyKey: varchar("idempotencyKey", { length: 191 }).notNull(),
  varianceQty: decimal("varianceQty", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 32 }).notNull().default("CLAIMED"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
}, (table) => ({
  keyUid: uniqueIndex("cc_recon_target_claims_key_uidx").on(table.idempotencyKey),
  runTargetUid: uniqueIndex("cc_recon_target_claims_run_target_uidx").on(
    table.runId,
    table.stepCode,
    table.sku,
    table.bin,
  ),
}));

export type CcReconTargetClaim = typeof ccReconTargetClaims.$inferSelect;

// ─── Replenishment Params (Module 3) ─────────────────────────────────────────
export const replenishmentParams = mysqlTable("replenishment_params", {
  id: int("id").autoincrement().primaryKey(),
  sku: varchar("sku", { length: 64 }).notNull().unique(),
  minQty: decimal("minQty", { precision: 10, scale: 2 }).notNull(),
  maxQty: decimal("maxQty", { precision: 10, scale: 2 }).notNull(),
  safetyStock: decimal("safetyStock", { precision: 10, scale: 2 }).notNull(),
  leadTimeDays: int("leadTimeDays"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ReplenishmentParam = typeof replenishmentParams.$inferSelect;

// ─── Replenishment Suggestions (Module 3) ────────────────────────────────────
export const replenishmentSuggestions = mysqlTable("replenishment_suggestions", {
  id: int("id").autoincrement().primaryKey(),
  runId: int("runId").notNull(),
  sku: varchar("sku", { length: 64 }).notNull(),
  systemQty: decimal("systemQty", { precision: 10, scale: 2 }).notNull(),
  suggestedQty: decimal("suggestedQty", { precision: 10, scale: 2 }).notNull(),
  reason: varchar("reason", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ReplenishmentSuggestion = typeof replenishmentSuggestions.$inferSelect;

// ─── KPI Snapshots (Module 4) ─────────────────────────────────────────────────────────────
export const kpiSnapshots = mysqlTable("kpi_snapshots", {
  id: int("id").autoincrement().primaryKey(),
  runId: int("runId").notNull(),
  rotationRate: decimal("rotationRate", { precision: 10, scale: 4 }),       // Consommation / Stock moyen
  serviceLevel: decimal("serviceLevel", { precision: 5, scale: 4 }),        // 0.0 – 1.0
  errorRate: decimal("errorRate", { precision: 5, scale: 4 }),              // 0.0 – 1.0
  averageLeadTime: decimal("averageLeadTime", { precision: 10, scale: 2 }), // days
  stockImmobilizedValue: decimal("stockImmobilizedValue", { precision: 14, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type KpiSnapshot = typeof kpiSnapshots.$inferSelect;

// ─── KPI Interpretations (Module 4 — student answers) ──────────────────────────────
export const kpiInterpretations = mysqlTable("kpi_interpretations", {
  id: int("id").autoincrement().primaryKey(),
  runId: int("runId").notNull(),
  kpiKey: varchar("kpiKey", { length: 64 }).notNull(),   // e.g. "rotationRate", "serviceLevel"
  studentAnswer: text("studentAnswer").notNull(),
  isCorrect: boolean("isCorrect"),                        // set by rules engine
  pointsDelta: int("pointsDelta").default(0).notNull(),
  feedback: text("feedback"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type KpiInterpretation = typeof kpiInterpretations.$inferSelect;

// ─── Pre-authorized Emails (auto-assign role on first login) ─────────────────
export const preAuthorizedEmails = mysqlTable("pre_authorized_emails", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  role: mysqlEnum("role", ["user", "admin", "student", "teacher"]).default("teacher").notNull(),
  note: varchar("note", { length: 255 }), // e.g. "Nadia — email secondaire"
  addedBy: int("addedBy"), // userId of admin who added this
  usedAt: timestamp("usedAt"), // when first login happened
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PreAuthorizedEmail = typeof preAuthorizedEmails.$inferSelect;
export type InsertPreAuthorizedEmail = typeof preAuthorizedEmails.$inferInsert;

// ── QUIZ SYSTEM ─────────────────────────────────────────────────────────────
// quizzes: one quiz per module (M1-M5)
export const quizzes = mysqlTable("quizzes", {
  id: int("id").autoincrement().primaryKey(),
  moduleId: int("moduleId").notNull(),
  titleFr: varchar("titleFr", { length: 255 }).notNull(),
  titleEn: varchar("titleEn", { length: 255 }).notNull(),
  passingScore: int("passingScore").default(60).notNull(), // % required to pass
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = typeof quizzes.$inferInsert;

// quizQuestions: questions for each quiz
export const quizQuestions = mysqlTable("quiz_questions", {
  id: int("id").autoincrement().primaryKey(),
  quizId: int("quizId").notNull(),
  questionFr: text("questionFr").notNull(),
  questionEn: text("questionEn").notNull(),
  optionsFr: json("optionsFr").notNull(), // string[]
  optionsEn: json("optionsEn").notNull(), // string[]
  correctIndex: int("correctIndex").notNull(), // 0-based index of correct answer (legacy + synced)
  /** Stable option objects: [{ id, fr, en }] — preferred for scoring */
  optionsPayload: json("optionsPayload"),
  correctOptionId: varchar("correctOptionId", { length: 32 }),
  explanationFr: text("explanationFr").notNull(),
  explanationEn: text("explanationEn").notNull(),
  difficulty: mysqlEnum("difficulty", ["easy", "medium", "hard"]).default("medium").notNull(),
  orderIndex: int("orderIndex").default(0).notNull(),
});

export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = typeof quizQuestions.$inferInsert;

// quizAttempts: student quiz attempts
export const quizAttempts = mysqlTable("quiz_attempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  quizId: int("quizId").notNull(),
  moduleId: int("moduleId").notNull(),
  answers: json("answers").notNull(), // number[] — index of chosen answer per question (legacy)
  score: int("score").notNull(), // 0-100 percentage
  passed: boolean("passed").notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
});

export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type InsertQuizAttempt = typeof quizAttempts.$inferInsert;

// ── INTEGRATED ASSESSMENTS ──────────────────────────────────────────────────

export const integratedAssessments = mysqlTable("integrated_assessments", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 64 }).notNull().unique(),
  titleFr: varchar("titleFr", { length: 255 }).notNull(),
  titleEn: varchar("titleEn", { length: 255 }).notNull(),
  modulesCovered: json("modulesCovered").notNull(),
  questionCount: int("questionCount").default(20).notNull(),
  durationMinutes: int("durationMinutes").default(40).notNull(),
  passingScore: int("passingScore").default(70).notNull(),
  totalPoints: int("totalPoints").default(100).notNull(),
  purposeFr: text("purposeFr").notNull(),
  purposeEn: text("purposeEn").notNull(),
  status: mysqlEnum("status", ["draft", "ready", "retired"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type IntegratedAssessment = typeof integratedAssessments.$inferSelect;

export const assessmentQuestions = mysqlTable("assessment_questions", {
  id: int("id").autoincrement().primaryKey(),
  assessmentId: int("assessmentId").notNull(),
  code: varchar("code", { length: 64 }).notNull(),
  moduleCode: varchar("moduleCode", { length: 8 }).notNull(),
  scenarioOrProcess: varchar("scenarioOrProcess", { length: 128 }).notNull(),
  competency: varchar("competency", { length: 128 }).notNull(),
  difficulty: mysqlEnum("difficulty", ["easy", "medium", "hard"]).default("medium").notNull(),
  questionType: mysqlEnum("questionType", [
    "conceptual",
    "scenario",
    "sequencing",
    "data_interpretation",
    "diagnosis",
  ]).notNull(),
  promptFr: text("promptFr").notNull(),
  promptEn: text("promptEn").notNull(),
  optionsJson: json("optionsJson").notNull(),
  correctOptionId: varchar("correctOptionId", { length: 32 }).notNull(),
  explanationFr: text("explanationFr").notNull(),
  explanationEn: text("explanationEn").notNull(),
  learningObjectiveFr: text("learningObjectiveFr"),
  learningObjectiveEn: text("learningObjectiveEn"),
  estimatedTimeSeconds: int("estimatedTimeSeconds").default(120).notNull(),
  avgSuccessRate: varchar("avgSuccessRate", { length: 16 }),
  avgResponseTimeMs: int("avgResponseTimeMs"),
  lastRevisedAt: timestamp("lastRevisedAt"),
  points: int("points").default(5).notNull(),
  orderIndex: int("orderIndex").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  annulled: boolean("annulled").default(false).notNull(),
  /** Reusable bank scope: WMS now; ERP later without redesign. */
  bankScope: varchar("bankScope", { length: 32 }).default("WMS").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AssessmentQuestion = typeof assessmentQuestions.$inferSelect;

export const assessmentReleases = mysqlTable("assessment_releases", {
  id: int("id").autoincrement().primaryKey(),
  assessmentId: int("assessmentId").notNull(),
  cohortId: int("cohortId"),
  releaseLevel: mysqlEnum("releaseLevel", [
    "unpublished",
    "visible_pending",
    "released_cohort",
    "released_students",
    "scheduled",
    "closed",
    "cancelled",
  ]).default("unpublished").notNull(),
  studentUserIds: json("studentUserIds"),
  opensAt: timestamp("opensAt"),
  closesAt: timestamp("closesAt"),
  releasedByUserId: int("releasedByUserId"),
  configJson: json("configJson"),
  note: text("note"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AssessmentRelease = typeof assessmentReleases.$inferSelect;

export const assessmentReleaseLogs = mysqlTable("assessment_release_logs", {
  id: int("id").autoincrement().primaryKey(),
  releaseId: int("releaseId").notNull(),
  assessmentId: int("assessmentId").notNull(),
  actorUserId: int("actorUserId").notNull(),
  action: varchar("action", { length: 64 }).notNull(),
  beforeJson: json("beforeJson"),
  afterJson: json("afterJson"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const assessmentAttempts = mysqlTable("assessment_attempts", {
  id: int("id").autoincrement().primaryKey(),
  assessmentId: int("assessmentId").notNull(),
  userId: int("userId").notNull(),
  cohortId: int("cohortId"),
  attemptNumber: int("attemptNumber").default(1).notNull(),
  status: mysqlEnum("status", [
    "in_progress",
    "submitted",
    "expired_submitted",
    "cancelled",
    "annulled_technical",
  ]).default("in_progress").notNull(),
  authorizedByUserId: int("authorizedByUserId"),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  submittedAt: timestamp("submittedAt"),
  durationSeconds: int("durationSeconds"),
  questionOrderJson: json("questionOrderJson").notNull(),
  optionOrderJson: json("optionOrderJson").notNull(),
  responsesJson: json("responsesJson"),
  autoScore: int("autoScore"),
  finalScore: int("finalScore"),
  passed: boolean("passed"),
  competencyBreakdownJson: json("competencyBreakdownJson"),
  warn30Sent: boolean("warn30Sent").default(false).notNull(),
  warn35Sent: boolean("warn35Sent").default(false).notNull(),
  m4UnlockStatus: mysqlEnum("m4UnlockStatus", [
    "locked",
    "pending_practical",
    "unlocked",
  ]).default("locked").notNull(),
  practicalValidationStatus: mysqlEnum("practicalValidationStatus", [
    "not_applicable",
    "pending",
    "satisfied",
    "waived",
  ]).default("pending").notNull(),
  professorReviewStatus: mysqlEnum("professorReviewStatus", [
    "none",
    "pending",
    "confirmed",
    "adjusted",
  ]).default("none").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AssessmentAttempt = typeof assessmentAttempts.$inferSelect;

export const assessmentAttemptResponses = mysqlTable("assessment_attempt_responses", {
  id: int("id").autoincrement().primaryKey(),
  attemptId: int("attemptId").notNull(),
  questionId: int("questionId").notNull(),
  selectedOptionId: varchar("selectedOptionId", { length: 32 }),
  isCorrect: boolean("isCorrect"),
  pointsAwarded: int("pointsAwarded"),
  flagged: boolean("flagged").default(false).notNull(),
  annulled: boolean("annulled").default(false).notNull(),
  professorComment: text("professorComment"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const assessmentRetakeAuthorizations = mysqlTable("assessment_retake_authorizations", {
  id: int("id").autoincrement().primaryKey(),
  assessmentId: int("assessmentId").notNull(),
  userId: int("userId").notNull(),
  authorizedByUserId: int("authorizedByUserId").notNull(),
  opensAt: timestamp("opensAt"),
  closesAt: timestamp("closesAt"),
  note: text("note"),
  consumedAttemptId: int("consumedAttemptId"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const assessmentGradeAudits = mysqlTable("assessment_grade_audits", {
  id: int("id").autoincrement().primaryKey(),
  attemptId: int("attemptId").notNull(),
  actorUserId: int("actorUserId").notNull(),
  previousScore: int("previousScore"),
  updatedScore: int("updatedScore"),
  reason: text("reason").notNull(),
  detailsJson: json("detailsJson"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const assessmentPracticalEvidence = mysqlTable("assessment_practical_evidence", {
  id: int("id").autoincrement().primaryKey(),
  assessmentId: int("assessmentId").notNull(),
  userId: int("userId").notNull(),
  cohortId: int("cohortId"),
  taskFr: varchar("taskFr", { length: 255 }).notNull(),
  resultFr: varchar("resultFr", { length: 255 }).notNull(),
  note: text("note"),
  recordedByUserId: int("recordedByUserId").notNull(),
  recordedAt: timestamp("recordedAt").defaultNow().notNull(),
});

export const studentAssessmentProgress = mysqlTable("student_assessment_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  assessmentId: int("assessmentId").notNull(),
  bestScore: int("bestScore"),
  latestScore: int("latestScore"),
  firstScore: int("firstScore"),
  attemptCount: int("attemptCount").default(0).notNull(),
  passed: boolean("passed").default(false).notNull(),
  m4UnlockStatus: mysqlEnum("m4UnlockStatus", [
    "locked",
    "pending_practical",
    "unlocked",
  ]).default("locked").notNull(),
  practicalValidationStatus: mysqlEnum("practicalValidationStatus", [
    "not_applicable",
    "pending",
    "satisfied",
    "waived",
  ]).default("pending").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
