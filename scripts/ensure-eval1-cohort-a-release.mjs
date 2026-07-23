/**
 * Idempotent production helper: EVAL_INTEGREE_1 × Cohorte A (id=2) → visible_pending.
 * Never opens the release. Never mutates Cohorte B.
 *
 * Usage (public MySQL URL required):
 *   MYSQL_PUBLIC_URL=... node scripts/ensure-eval1-cohort-a-release.mjs
 */
import "dotenv/config";
import mysql from "mysql2/promise";

const ASSESSMENT_CODE = "EVAL_INTEGREE_1";
const COHORT_A = 2;
const COHORT_B = 3;

function loadUrl() {
  const url =
    process.env.MYSQL_PUBLIC_URL ||
    process.env.MYSQL_URL ||
    process.env.DATABASE_URL;
  if (!url) throw new Error("MYSQL_PUBLIC_URL / DATABASE_URL required");
  if (url.includes("railway.internal")) {
    throw new Error("Refuse internal DATABASE_URL — use MYSQL_PUBLIC_URL");
  }
  return url;
}

const conn = await mysql.createConnection(loadUrl());
try {
  const [[eval1]] = await conn.query(
    `SELECT id, code, status, durationMinutes, passingScore, questionCount
     FROM integrated_assessments WHERE code = ? LIMIT 1`,
    [ASSESSMENT_CODE]
  );
  if (!eval1) throw new Error("EVAL1_NOT_FOUND");

  const [beforeReleases] = await conn.query(
    `SELECT id, cohortId, releaseLevel, note FROM assessment_releases
     WHERE assessmentId = ? ORDER BY id`,
    [eval1.id]
  );
  const [beforeAttemptsB] = await conn.query(
    `SELECT COUNT(*) AS n, SUM(status='submitted') AS submitted
     FROM assessment_attempts WHERE assessmentId = ? AND cohortId = ?`,
    [eval1.id, COHORT_B]
  );

  const existingA = beforeReleases.filter((r) => r.cohortId === COHORT_A);
  let created = false;
  let releaseAId = existingA[0]?.id ?? null;

  if (existingA.length === 0) {
    const [ins] = await conn.query(
      `INSERT INTO assessment_releases
        (assessmentId, cohortId, releaseLevel, opensAt, closesAt, note, configJson, createdAt, updatedAt)
       VALUES (?, ?, 'visible_pending', NULL, NULL, ?, CAST(? AS JSON), NOW(), NOW())`,
      [
        eval1.id,
        COHORT_A,
        "Cohorte Été 2026 — Groupe A · préparée pour Classe 7 (libération professeur)",
        JSON.stringify({ excludeDemoAccounts: true }),
      ]
    );
    releaseAId = ins.insertId;
    created = true;
  } else if (existingA.length > 1) {
    console.warn(
      "WARN_DUPLICATE_A_RELEASES",
      existingA.map((r) => r.id)
    );
  }

  const [afterReleases] = await conn.query(
    `SELECT id, cohortId, releaseLevel, note FROM assessment_releases
     WHERE assessmentId = ? ORDER BY id`,
    [eval1.id]
  );
  const [afterAttemptsB] = await conn.query(
    `SELECT COUNT(*) AS n, SUM(status='submitted') AS submitted
     FROM assessment_attempts WHERE assessmentId = ? AND cohortId = ?`,
    [eval1.id, COHORT_B]
  );
  const [attemptsA] = await conn.query(
    `SELECT COUNT(*) AS n FROM assessment_attempts
     WHERE assessmentId = ? AND cohortId = ?`,
    [eval1.id, COHORT_A]
  );

  const releaseB = afterReleases.find((r) => r.cohortId === COHORT_B);
  const releaseA = afterReleases.find((r) => r.id === releaseAId);

  const report = {
    ok: true,
    created,
    assessmentId: eval1.id,
    durationMinutes: eval1.durationMinutes,
    passingScore: eval1.passingScore,
    questionCount: eval1.questionCount,
    releaseA: releaseA
      ? { id: releaseA.id, level: releaseA.releaseLevel }
      : null,
    releaseB: releaseB
      ? { id: releaseB.id, level: releaseB.releaseLevel }
      : null,
    attemptsA: Number(attemptsA[0]?.n ?? 0),
    attemptsBBefore: beforeAttemptsB[0],
    attemptsBAfter: afterAttemptsB[0],
    cohortBUnchanged:
      String(beforeAttemptsB[0]?.n) === String(afterAttemptsB[0]?.n) &&
      String(beforeAttemptsB[0]?.submitted) ===
        String(afterAttemptsB[0]?.submitted) &&
      releaseB?.releaseLevel === "released_cohort",
  };
  console.log(JSON.stringify(report, null, 2));
  if (!report.cohortBUnchanged) process.exitCode = 2;
} finally {
  await conn.end();
}
