/**
 * Controlled smoke: EVAL_INTEGREE_1 × Cohorte A using QA account only.
 * Leaves production in class-ready state:
 *   - Cohorte A release = visible_pending
 *   - zero attempts for Cohorte A
 *   - Cohorte B unchanged
 *
 * Usage:
 *   MYSQL_PUBLIC_URL=... node scripts/smoke-eval1-cohort-a.mjs
 */
import "dotenv/config";
import mysql from "mysql2/promise";

const BASE =
  process.env.SMOKE_BASE_URL ||
  "https://tec-wms-simulator-production-production.up.railway.app";
const TEACHER_EMAIL = process.env.BOOTSTRAP_TEACHER_EMAIL || "prof@teclog.ca";
const TEACHER_PASSWORD =
  process.env.BOOTSTRAP_TEACHER_PASSWORD || "16183026Prof$";
const QA_A = {
  email: "james.timothy.qa.groupea@teclog.ca",
  password: process.env.SMOKE_QA_A_PASSWORD || "TECWMS2026AQA",
  studentNumber: "TECWMS-2026-A-QA-JT",
};
const COHORT_A = 2;
const COHORT_B = 3;

let cookie = "";
const checks = [];

function check(id, name, ok, detail = "", critical = true) {
  checks.push({ id, name, ok: !!ok, detail, critical });
  console.log(`${ok ? "PASS" : "FAIL"} ${id}: ${name} — ${detail}`);
}

async function trpc(path, input, type = "query") {
  let url = `${BASE}/api/trpc/${path}`;
  const opts = {
    method: type === "query" ? "GET" : "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      ...(cookie ? { cookie } : {}),
    },
    redirect: "manual",
  };
  if (type === "query") {
    url += `?input=${encodeURIComponent(JSON.stringify({ json: input ?? null }))}`;
  } else {
    opts.body = JSON.stringify({ json: input });
  }
  const res = await fetch(url, opts);
  const sc = res.headers.getSetCookie?.() ?? [];
  if (sc.length) cookie = sc.map((c) => c.split(";")[0]).join("; ");
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = { raw: text.slice(0, 400) };
  }
  const err =
    body?.error?.json?.message ??
    body?.error?.message ??
    body?.[0]?.error?.json?.message;
  const data =
    body?.result?.data?.json ??
    body?.result?.data ??
    body?.[0]?.result?.data?.json ??
    body?.[0]?.result?.data ??
    body;
  return { ok: res.ok && !err, data, err, status: res.status };
}

async function login(email, password) {
  cookie = "";
  return trpc("auth.localLogin", { email, password }, "mutation");
}

function dbUrl() {
  const url =
    process.env.MYSQL_PUBLIC_URL ||
    process.env.MYSQL_URL ||
    process.env.DATABASE_URL;
  if (!url || url.includes("railway.internal")) {
    throw new Error("MYSQL_PUBLIC_URL required");
  }
  return url;
}

async function snapshot(conn) {
  const [[eval1]] = await conn.query(
    `SELECT id, durationMinutes, passingScore, questionCount FROM integrated_assessments WHERE code='EVAL_INTEGREE_1'`
  );
  const [releases] = await conn.query(
    `SELECT id, cohortId, releaseLevel FROM assessment_releases WHERE assessmentId=? ORDER BY id`,
    [eval1.id]
  );
  const [attA] = await conn.query(
    `SELECT id, userId, status, finalScore, passed FROM assessment_attempts WHERE assessmentId=? AND cohortId=?`,
    [eval1.id, COHORT_A]
  );
  const [attB] = await conn.query(
    `SELECT id, userId, status, finalScore, passed FROM assessment_attempts WHERE assessmentId=? AND cohortId=? ORDER BY id`,
    [eval1.id, COHORT_B]
  );
  return { eval1, releases, attA, attB };
}

const conn = await mysql.createConnection(dbUrl());
let before;
try {
  before = await snapshot(conn);
  const releaseBBefore = before.releases.find((r) => r.cohortId === COHORT_B);
  check(
    "B_BEFORE",
    "Cohorte B release snapshot",
    releaseBBefore?.id === 1 &&
      releaseBBefore?.releaseLevel === "released_cohort" &&
      before.attB.length === 5,
    `release=${releaseBBefore?.id}/${releaseBBefore?.releaseLevel} attempts=${before.attB.length}`
  );

  // Ensure A release pending via teacher API (double-call for idempotency)
  let s = await login(TEACHER_EMAIL, TEACHER_PASSWORD);
  check("TEACHER_LOGIN", "Teacher login", s.ok, s.err || "");

  const list = await trpc("assessments.professorList", null, "query");
  const eval1 = (list.data || []).find((a) => a.code === "EVAL_INTEGREE_1");
  check("PROF_LIST", "Professor sees Eval1", !!eval1, `id=${eval1?.id}`);

  const upsert1 = await trpc(
    "assessments.professorUpsertRelease",
    {
      assessmentId: eval1.id,
      cohortId: COHORT_A,
      releaseLevel: "visible_pending",
      note: "Smoke prepare Cohorte A",
    },
    "mutation"
  );
  const upsert2 = await trpc(
    "assessments.professorUpsertRelease",
    {
      assessmentId: eval1.id,
      cohortId: COHORT_A,
      releaseLevel: "visible_pending",
      note: "Smoke prepare Cohorte A",
    },
    "mutation"
  );
  check(
    "UPSERT_IDEMPOTENT",
    "Double prepare creates one release",
    upsert1.ok && upsert2.ok && upsert1.data?.id === upsert2.data?.id,
    `id1=${upsert1.data?.id} id2=${upsert2.data?.id}`
  );

  // Attempt to mutate B→A via releaseId must fail
  const bad = await trpc(
    "assessments.professorUpsertRelease",
    {
      releaseId: releaseBBefore.id,
      assessmentId: eval1.id,
      cohortId: COHORT_A,
      releaseLevel: "visible_pending",
    },
    "mutation"
  );
  check(
    "IMMUTABLE_B",
    "Cannot reassign Cohorte B release to A",
    !bad.ok && /RELEASE_COHORT_IMMUTABLE|IMMUTABLE/i.test(String(bad.err || "")),
    bad.err || `status=${bad.status}`
  );

  const rosterA = await trpc(
    "assessments.professorRoster",
    { assessmentId: eval1.id, cohortId: COHORT_A },
    "query"
  );
  check(
    "ROSTER_A",
    "Roster A has 5 students, no B attempts",
    Array.isArray(rosterA.data) &&
      rosterA.data.length === 5 &&
      rosterA.data.every((r) => (r.attempts?.length ?? 0) === 0),
    `n=${rosterA.data?.length}`
  );

  const rosterB = await trpc(
    "assessments.professorRoster",
    { assessmentId: eval1.id, cohortId: COHORT_B },
    "query"
  );
  const bSubmitted = (rosterB.data || []).filter((r) =>
    r.attempts?.some((a) => a.status === "submitted")
  ).length;
  check(
    "ROSTER_B",
    "Roster B still shows historical submissions",
    bSubmitted >= 4,
    `submittedRows=${bSubmitted}`
  );

  // Student pending — cannot start
  s = await login(QA_A.email, QA_A.password);
  check("QA_A_LOGIN", "QA A login", s.ok, s.err || "");
  let hub = await trpc("assessments.hub", null, "query");
  const cardPending = (hub.data || []).find((c) => c.code === "EVAL_INTEGREE_1");
  check(
    "PENDING_NO_START",
    "visible_pending blocks start",
    cardPending &&
      cardPending.releaseLevel === "visible_pending" &&
      cardPending.canStart === false,
    `level=${cardPending?.releaseLevel} canStart=${cardPending?.canStart}`
  );

  // Liberate
  s = await login(TEACHER_EMAIL, TEACHER_PASSWORD);
  const liberate1 = await trpc(
    "assessments.professorUpsertRelease",
    {
      assessmentId: eval1.id,
      cohortId: COHORT_A,
      releaseLevel: "released_cohort",
      note: "Smoke liberate Cohorte A",
    },
    "mutation"
  );
  const liberate2 = await trpc(
    "assessments.professorUpsertRelease",
    {
      assessmentId: eval1.id,
      cohortId: COHORT_A,
      releaseLevel: "released_cohort",
      note: "Smoke liberate Cohorte A",
    },
    "mutation"
  );
  check(
    "LIBERATE",
    "Liberate idempotent",
    liberate1.ok &&
      liberate2.ok &&
      liberate1.data?.id === liberate2.data?.id &&
      liberate1.data?.releaseLevel === "released_cohort",
    `id=${liberate1.data?.id}`
  );

  // QA start + submit
  s = await login(QA_A.email, QA_A.password);
  hub = await trpc("assessments.hub", null, "query");
  const cardOpen = (hub.data || []).find((c) => c.code === "EVAL_INTEGREE_1");
  check(
    "OPEN_CAN_START",
    "QA A can start after liberate",
    cardOpen?.canStart === true,
    `canStart=${cardOpen?.canStart} duration=${cardOpen?.durationMinutes}`
  );
  check(
    "UNTIMED_LABEL",
    "System duration untimed",
    cardOpen?.durationMinutes == null || cardOpen?.durationMinutes <= 0,
    `durationMinutes=${cardOpen?.durationMinutes}`
  );

  const start1 = await trpc(
    "assessments.start",
    { assessmentId: eval1.id },
    "mutation"
  );
  const start2 = await trpc(
    "assessments.start",
    { assessmentId: eval1.id },
    "mutation"
  );
  const attemptId = start1.data?.attemptId ?? start1.data?.attempt?.id;
  const attemptId2 = start2.data?.attemptId ?? start2.data?.attempt?.id;
  check(
    "START_ONCE",
    "Double start returns same attempt",
    start1.ok && attemptId && attemptId === attemptId2,
    `attempt=${attemptId} resumed2=${start2.data?.resumed}`
  );

  const detail = await trpc(
    "assessments.getAttempt",
    { attemptId },
    "query"
  );
  const questions = detail.data?.questions || [];
  check("Q20", "20 questions loaded", questions.length === 20, `q=${questions.length}`);

  // Answer with first option (smoke scoring only — not a real student attempt)
  for (const q of questions) {
    const optionId = q.options?.[0]?.id || null;
    if (!optionId) continue;
    await trpc(
      "assessments.autosave",
      { attemptId, questionId: q.id, selectedOptionId: optionId },
      "mutation"
    );
  }

  // Try alternate answer path if saveAnswer missing
  const submit = await trpc(
    "assessments.submit",
    { attemptId },
    "mutation"
  );
  check("SUBMIT", "QA submit", submit.ok, submit.err || `score=${submit.data?.finalScore ?? submit.data?.autoScore}`);

  // Isolation: B attempts unchanged count
  const mid = await snapshot(conn);
  check(
    "B_ISOLATION_MID",
    "Cohorte B attempt count unchanged mid-smoke",
    mid.attB.length === before.attB.length &&
      mid.attB.every(
        (a, i) =>
          a.id === before.attB[i].id &&
          a.finalScore === before.attB[i].finalScore &&
          a.status === before.attB[i].status
      ),
    `b=${mid.attB.length}`
  );

  // Cleanup QA attempt + related rows
  const qaUserId = mid.attA.find(() => true)?.userId;
  // Cleanup all QA A attempts for this assessment (smoke only)
  const [qaAttempts] = await conn.query(
    `SELECT id FROM assessment_attempts WHERE assessmentId = ? AND userId IN (
       SELECT userId FROM profiles WHERE cohortId = ? AND studentNumber = ?
     )`,
    [eval1.id, COHORT_A, QA_A.studentNumber]
  );
  const qaIds = qaAttempts.map((r) => r.id);
  if (qaIds.length) {
    await conn.query(
      `DELETE FROM assessment_attempt_responses WHERE attemptId IN (${qaIds
        .map(() => "?")
        .join(",")})`,
      qaIds
    );
    await conn.query(
      `DELETE FROM assessment_grade_audits WHERE attemptId IN (${qaIds
        .map(() => "?")
        .join(",")})`,
      qaIds
    );
    await conn.query(
      `DELETE FROM assessment_attempts WHERE id IN (${qaIds.map(() => "?").join(",")})`,
      qaIds
    );
  }
  const [[qaProfile]] = await conn.query(
    `SELECT userId FROM profiles WHERE cohortId = ? AND studentNumber = ? LIMIT 1`,
    [COHORT_A, QA_A.studentNumber]
  );
  const cleanUserId = qaProfile?.userId ?? qaUserId;
  if (cleanUserId) {
    await conn.query(
      `DELETE FROM student_assessment_progress WHERE assessmentId = ? AND userId = ?`,
      [eval1.id, cleanUserId]
    );
    await conn.query(
      `DELETE FROM assessment_retake_authorizations WHERE assessmentId = ? AND userId = ?`,
      [eval1.id, cleanUserId]
    );
  }

  // Restore A to visible_pending
  s = await login(TEACHER_EMAIL, TEACHER_PASSWORD);
  const restore = await trpc(
    "assessments.professorUpsertRelease",
    {
      assessmentId: eval1.id,
      cohortId: COHORT_A,
      releaseLevel: "visible_pending",
      note: "Cohorte Été 2026 — Groupe A · préparée pour Classe 7 (libération professeur)",
    },
    "mutation"
  );
  check(
    "RESTORE_PENDING",
    "Restore Cohorte A to visible_pending",
    restore.ok && restore.data?.releaseLevel === "visible_pending",
    restore.data?.releaseLevel
  );

  const after = await snapshot(conn);
  const releaseA = after.releases.find((r) => r.cohortId === COHORT_A);
  const releaseB = after.releases.find((r) => r.cohortId === COHORT_B);
  check(
    "FINAL_A",
    "Final A: pending, zero attempts",
    releaseA?.releaseLevel === "visible_pending" && after.attA.length === 0,
    `level=${releaseA?.releaseLevel} attempts=${after.attA.length}`
  );
  check(
    "FINAL_B",
    "Final B unchanged",
    releaseB?.id === releaseBBefore.id &&
      releaseB?.releaseLevel === "released_cohort" &&
      after.attB.length === before.attB.length,
    `id=${releaseB?.id} attempts=${after.attB.length}`
  );

  // Unique release per cohort
  const aCount = after.releases.filter((r) => r.cohortId === COHORT_A).length;
  const bCount = after.releases.filter((r) => r.cohortId === COHORT_B).length;
  check(
    "UNIQUE_SCOPE",
    "One release per cohort",
    aCount === 1 && bCount === 1,
    `A=${aCount} B=${bCount}`
  );
} catch (e) {
  check("FATAL", e.message || String(e), false, e.stack?.split("\n")[0] || "");
} finally {
  await conn.end();
}

const failed = checks.filter((c) => !c.ok && c.critical);
const report = {
  base: BASE,
  at: new Date().toISOString(),
  ok: failed.length === 0,
  failed: failed.map((c) => c.id),
  checks,
};
console.log("\n=== SUMMARY ===");
console.log(JSON.stringify({ ok: report.ok, failed: report.failed }, null, 2));
process.exit(report.ok ? 0 : 1);
