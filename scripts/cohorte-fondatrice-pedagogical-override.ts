/**
 * Cohorte Fondatrice 2026 — pedagogical checkpoint override (M2–M5 only).
 *
 * Sets module_progress to 100 % after teacher validation. Does NOT touch:
 * profiles (silver/gold flags), certificate registries, PDFs, or verification URLs.
 *
 * Usage:
 *   MYSQL_PUBLIC_URL=... npx tsx scripts/cohorte-fondatrice-pedagogical-override.ts
 *   railway run npx tsx scripts/cohorte-fondatrice-pedagogical-override.ts --apply --confirm-cohorte-fondatrice
 *
 * Rollback (after apply — backup table name is printed in the report):
 *   npx tsx scripts/cohorte-fondatrice-pedagogical-override.ts --rollback --backup-table=<name>
 */
import "dotenv/config";
import "./bootstrap-db-env";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";
import { OFFICIAL_SCN_BY_MODULE } from "../server/canonicalScenarios";
import { goldScnKeyFromCode } from "../server/goldCertification";
import { getModuleScenarioPassThreshold } from "@shared/moduleThresholds";
import type { OfficialScnCode } from "../server/canonicalScenarios";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ENGINE_VERSION = "founder-v1";
const PEDAGOGICAL_NOTE =
  "Cohorte Fondatrice 2026 — validation pédagogique exceptionnelle par le responsable pédagogique.";

/** Cohorte Fondatrice 2026 — fixed allowlist (userId + email for preflight). */
const COHORTE_STUDENTS = [
  { userId: 184, name: "Aissata Soukeina Camara", email: "aissatasoukeinacamara@gmail.com" },
  { userId: 213, name: "Darlin Campaz Paredes", email: "dcparedes2010@gmail.com" },
  { userId: 216, name: "Fredy Tamile Lola", email: "fredlolabio@gmail.com" },
  { userId: 219, name: "Prince Agbodjan Sewa Francis Ghislain", email: "sewafrancispa@gmail.com" },
] as const;

const MODULE_IDS = [2, 3, 4, 5] as const;
const REQUIRED_SCENARIOS = 3;

type ModuleProgressRow = {
  id: number;
  userId: number;
  moduleId: number;
  passed: boolean;
  bestScore: number;
  completedAt: Date | null;
  teacherValidated: boolean;
  teacherValidatedAt: Date | null;
  progressPct: number;
  completedScenarios: number;
  requiredScenarios: number;
  averageScore: number | null;
  scenarioStatusJson: unknown;
  engineVersion: string | null;
  createdAt: Date;
};

type TargetRow = {
  userId: number;
  moduleId: number;
  rowId: number | null;
  action: "INSERT" | "UPDATE" | "SKIP";
  skipReason?: string;
  before: Partial<ModuleProgressRow> | null;
  after: Record<string, unknown>;
  changed: boolean;
};

const args = process.argv.slice(2);
const apply = args.includes("--apply");
const rollback = args.includes("--rollback");
const confirmed = args.includes("--confirm-cohorte-fondatrice");
const backupTableArg = args.find((a) => a.startsWith("--backup-table="));
const backupTableFromArg = backupTableArg?.split("=")[1];

function loadDbUrl(): string {
  for (const key of ["MYSQL_PUBLIC_URL", "MYSQL_URL", "DATABASE_URL"]) {
    if (process.env[key]) return process.env[key]!;
  }
  throw new Error("DATABASE_URL / MYSQL_URL is required");
}

function scnKeysForModule(moduleId: number): string[] {
  const codes = OFFICIAL_SCN_BY_MODULE[moduleId] ?? [];
  return codes.map((scn) => goldScnKeyFromCode(scn as OfficialScnCode));
}

function parseScenarioJson(raw: unknown): Record<string, unknown> {
  if (raw == null) return {};
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  if (typeof raw === "object") return raw as Record<string, unknown>;
  return {};
}

function buildScenarioStatusJson(
  moduleId: number,
  existingJson: unknown,
  teacherValidatedScore: number,
): Record<string, unknown> {
  const existing = parseScenarioJson(existingJson);
  const keys = scnKeysForModule(moduleId);
  const out: Record<string, unknown> = {
    _pedagogicalOverride: {
      cohort: "Cohorte Fondatrice 2026",
      note: PEDAGOGICAL_NOTE,
      source: "teacher-validated",
      engineVersion: ENGINE_VERSION,
    },
  };

  for (const key of keys) {
    const prev = existing[key] as { runId?: number | null; score?: number | null } | undefined;
    const score = Math.max(prev?.score ?? 0, teacherValidatedScore) || teacherValidatedScore;
    out[key] = {
      passed: true,
      score,
      runId: prev?.runId ?? null,
      source: "teacher-validated",
    };
  }

  return out;
}

function buildTarget(existing: ModuleProgressRow | null, userId: number, moduleId: number): TargetRow {
  const teacherValidatedScore = getModuleScenarioPassThreshold(moduleId);
  const scenarioStatusJson = buildScenarioStatusJson(
    moduleId,
    existing?.scenarioStatusJson,
    teacherValidatedScore,
  );

  const preserveTeacherValidated = existing?.teacherValidated ?? false;
  const preserveTeacherValidatedAt = existing?.teacherValidatedAt ?? null;
  const averageScore = Math.max(existing?.averageScore ?? 0, teacherValidatedScore) || teacherValidatedScore;

  const after = {
    passed: true,
    bestScore: Math.max(existing?.bestScore ?? 0, teacherValidatedScore),
    completedAt: existing?.completedAt ?? new Date("2026-06-01T12:00:00.000Z"),
    teacherValidated: preserveTeacherValidated,
    teacherValidatedAt: preserveTeacherValidatedAt,
    progressPct: 100,
    completedScenarios: REQUIRED_SCENARIOS,
    requiredScenarios: REQUIRED_SCENARIOS,
    averageScore,
    scenarioStatusJson,
    engineVersion: ENGINE_VERSION,
  };

  if (existing == null) {
    return {
      userId,
      moduleId,
      rowId: null,
      action: "INSERT",
      before: null,
      after,
      changed: true,
    };
  }

  const beforeSnapshot = {
    id: existing.id,
    passed: existing.passed,
    bestScore: existing.bestScore,
    completedAt: existing.completedAt,
    teacherValidated: existing.teacherValidated,
    teacherValidatedAt: existing.teacherValidatedAt,
    progressPct: existing.progressPct,
    completedScenarios: existing.completedScenarios,
    requiredScenarios: existing.requiredScenarios,
    averageScore: existing.averageScore,
    scenarioStatusJson: existing.scenarioStatusJson,
    engineVersion: existing.engineVersion,
  };

  const changed =
    existing.passed !== after.passed ||
    existing.progressPct !== after.progressPct ||
    existing.completedScenarios !== after.completedScenarios ||
    existing.engineVersion !== after.engineVersion ||
    JSON.stringify(existing.scenarioStatusJson) !== JSON.stringify(after.scenarioStatusJson);

  return {
    userId,
    moduleId,
    rowId: existing.id,
    action: changed ? "UPDATE" : "SKIP",
    skipReason: changed ? undefined : "already_at_target",
    before: beforeSnapshot,
    after,
    changed,
  };
}

async function fetchExistingRows(conn: mysql.Connection): Promise<Map<string, ModuleProgressRow>> {
  const userIds = COHORTE_STUDENTS.map((s) => s.userId);
  const [rows] = await conn.query<mysql.RowDataPacket[]>(
    `SELECT id, userId, moduleId, passed, bestScore, completedAt,
            teacherValidated, teacherValidatedAt, progressPct, completedScenarios,
            requiredScenarios, averageScore, scenarioStatusJson, engineVersion, createdAt
     FROM module_progress
     WHERE userId IN (?) AND moduleId IN (?)`,
    [userIds, MODULE_IDS],
  );

  const map = new Map<string, ModuleProgressRow>();
  for (const row of rows) {
    map.set(`${row.userId}:${row.moduleId}`, row as ModuleProgressRow);
  }
  return map;
}

async function verifyStudentAllowlist(conn: mysql.Connection): Promise<{ ok: boolean; errors: string[] }> {
  const userIds = COHORTE_STUDENTS.map((s) => s.userId);
  const [rows] = await conn.query<mysql.RowDataPacket[]>(
    "SELECT id, email, name FROM users WHERE id IN (?)",
    [userIds],
  );
  const byId = new Map(rows.map((r) => [r.id, r]));
  const errors: string[] = [];

  for (const student of COHORTE_STUDENTS) {
    const user = byId.get(student.userId);
    if (!user) {
      errors.push(`userId ${student.userId} (${student.name}) not found`);
      continue;
    }
    if (String(user.email).toLowerCase() !== student.email.toLowerCase()) {
      errors.push(
        `userId ${student.userId} email mismatch: expected ${student.email}, got ${user.email}`,
      );
    }
  }

  return { ok: errors.length === 0, errors };
}

async function createBackupTable(
  conn: mysql.Connection,
  targets: TargetRow[],
): Promise<string> {
  const rowIds = targets.filter((t) => t.rowId != null).map((t) => t.rowId!);
  const stamp = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
  const backupTable = `module_progress_backup_founder_override_${stamp}`;

  await conn.query(`CREATE TABLE \`${backupTable}\` LIKE module_progress`);

  if (rowIds.length > 0) {
    await conn.query(
      `INSERT INTO \`${backupTable}\` SELECT * FROM module_progress WHERE id IN (?)`,
      [rowIds],
    );
  }

  const [count] = await conn.query<mysql.RowDataPacket[]>(
    `SELECT COUNT(*) AS cnt FROM \`${backupTable}\``,
  );

  if (Number(count[0]?.cnt) !== rowIds.length) {
    throw new Error(
      `Backup row count mismatch: expected ${rowIds.length}, got ${count[0]?.cnt}`,
    );
  }

  return backupTable;
}

async function applyTargets(conn: mysql.Connection, targets: TargetRow[]): Promise<void> {
  for (const target of targets) {
    if (!target.changed || target.action === "SKIP") continue;

    const a = target.after;
    const scenarioJson = JSON.stringify(a.scenarioStatusJson);

    if (target.action === "INSERT") {
      await conn.query(
        `INSERT INTO module_progress
           (userId, moduleId, passed, bestScore, completedAt, teacherValidated, teacherValidatedAt,
            progressPct, completedScenarios, requiredScenarios, averageScore, scenarioStatusJson,
            engineVersion, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          target.userId,
          target.moduleId,
          a.passed ? 1 : 0,
          a.bestScore,
          a.completedAt,
          a.teacherValidated ? 1 : 0,
          a.teacherValidatedAt,
          a.progressPct,
          a.completedScenarios,
          a.requiredScenarios,
          a.averageScore,
          scenarioJson,
          a.engineVersion,
        ],
      );
      continue;
    }

    await conn.query(
      `UPDATE module_progress SET
         passed = ?, bestScore = ?, completedAt = ?,
         progressPct = ?, completedScenarios = ?, requiredScenarios = ?,
         averageScore = ?, scenarioStatusJson = ?, engineVersion = ?
       WHERE id = ? AND userId = ? AND moduleId = ?`,
      [
        a.passed ? 1 : 0,
        a.bestScore,
        a.completedAt,
        a.progressPct,
        a.completedScenarios,
        a.requiredScenarios,
        a.averageScore,
        scenarioJson,
        a.engineVersion,
        target.rowId,
        target.userId,
        target.moduleId,
      ],
    );
  }
}

function buildRollbackSql(backupTable: string, rowIds: number[]): string {
  const cols = [
    "passed",
    "bestScore",
    "completedAt",
    "teacherValidated",
    "teacherValidatedAt",
    "progressPct",
    "completedScenarios",
    "requiredScenarios",
    "averageScore",
    "scenarioStatusJson",
    "engineVersion",
  ];
  const setClause = cols.map((c) => `mp.\`${c}\` = b.\`${c}\``).join(",\n  ");
  return `-- Rollback Cohorte Fondatrice pedagogical override
UPDATE module_progress mp
INNER JOIN \`${backupTable}\` b ON mp.id = b.id
SET
  ${setClause}
WHERE mp.id IN (${rowIds.join(", ") || "/* no rows */"});

-- Optional: remove rows inserted by override (not in backup)
-- DELETE mp FROM module_progress mp
-- WHERE mp.userId IN (184, 213, 216, 219)
--   AND mp.moduleId IN (2, 3, 4, 5)
--   AND mp.engineVersion = 'founder-v1'
--   AND mp.id NOT IN (SELECT id FROM \`${backupTable}\`);`;
}

async function runRollback(conn: mysql.Connection, backupTable: string): Promise<void> {
  const [exists] = await conn.query<mysql.RowDataPacket[]>(
    `SELECT COUNT(*) AS cnt FROM information_schema.tables
     WHERE table_schema = DATABASE() AND table_name = ?`,
    [backupTable],
  );
  if (!exists[0]?.cnt) {
    throw new Error(`Backup table not found: ${backupTable}`);
  }

  const [backupRows] = await conn.query<mysql.RowDataPacket[]>(
    `SELECT id FROM \`${backupTable}\``,
  );
  const rowIds = backupRows.map((r) => r.id);

  const sql = buildRollbackSql(backupTable, rowIds);
  const cols = [
    "passed",
    "bestScore",
    "completedAt",
    "teacherValidated",
    "teacherValidatedAt",
    "progressPct",
    "completedScenarios",
    "requiredScenarios",
    "averageScore",
    "scenarioStatusJson",
    "engineVersion",
  ];
  const setClause = cols.map((c) => `mp.\`${c}\` = b.\`${c}\``).join(", ");

  await conn.query(
    `UPDATE module_progress mp
     INNER JOIN \`${backupTable}\` b ON mp.id = b.id
     SET ${setClause}`,
  );

  console.log("\nRollback complete.");
  console.log(sql);
}

async function main() {
  const databaseUrl = loadDbUrl();
  const conn = await mysql.createConnection(databaseUrl);

  try {
    if (rollback) {
      if (!backupTableFromArg) {
        console.error("--rollback requires --backup-table=<name>");
        process.exit(1);
      }
      await runRollback(conn, backupTableFromArg);
      return;
    }

    const preflight = await verifyStudentAllowlist(conn);
    if (!preflight.ok) {
      console.error("Preflight failed:", preflight.errors);
      process.exit(1);
    }

    const existingMap = await fetchExistingRows(conn);
    const targets: TargetRow[] = [];

    for (const student of COHORTE_STUDENTS) {
      for (const moduleId of MODULE_IDS) {
        const existing = existingMap.get(`${student.userId}:${moduleId}`) ?? null;
        targets.push(buildTarget(existing, student.userId, moduleId));
      }
    }

    const toChange = targets.filter((t) => t.changed);
    const m3Warnings = targets.filter(
      (t) => t.moduleId === 3 && t.after.teacherValidated !== true,
    );

    const report = {
      mode: apply ? "apply" : "dry-run",
      timestamp: new Date().toISOString(),
      scope: {
        cohort: "Cohorte Fondatrice 2026",
        table: "module_progress only",
        modules: MODULE_IDS,
        students: COHORTE_STUDENTS,
        excluded: [
          "profiles.silverCertified",
          "profiles.goldCertified",
          "silver/gold certificate registry",
          "PDFs",
          "public verification URLs",
        ],
      },
      engineVersion: ENGINE_VERSION,
      pedagogicalNote: PEDAGOGICAL_NOTE,
      averageScorePolicy:
        "Module pass threshold (60 M2, 70 M3–M5) — teacher-validated pedagogical score",
      summary: {
        totalRows: targets.length,
        toInsert: toChange.filter((t) => t.action === "INSERT").length,
        toUpdate: toChange.filter((t) => t.action === "UPDATE").length,
        unchanged: targets.filter((t) => !t.changed).length,
      },
      m3TeacherValidatedWarnings: m3Warnings.map((t) => ({
        userId: t.userId,
        teacherValidated: t.after.teacherValidated,
        note: "M3 teacherValidated preserved from existing row; override does not set it",
      })),
      rows: targets,
      backupTable: null as string | null,
      rollbackCommand: null as string | null,
      rollbackSql: null as string | null,
    };

    console.log(`\nCohorte Fondatrice — pedagogical override — ${apply ? "APPLY" : "DRY RUN"}\n`);
    console.log(`Students: ${COHORTE_STUDENTS.length} · Modules: M2–M5 · Rows: ${targets.length}`);
    console.log(`Changes: ${toChange.length} (${report.summary.toInsert} insert, ${report.summary.toUpdate} update)\n`);

    for (const target of targets) {
      const student = COHORTE_STUDENTS.find((s) => s.userId === target.userId)!;
      const label = `userId=${target.userId} M${target.moduleId}`;
      const before = target.before
        ? `passed=${target.before.passed} pct=${target.before.progressPct} scn=${target.before.completedScenarios}/${target.before.requiredScenarios} eng=${target.before.engineVersion ?? "null"}`
        : "(no row)";
      const after = target.after;
      const afterLabel = `passed=${after.passed} pct=${after.progressPct} scn=${after.completedScenarios}/${after.requiredScenarios} avg=${after.averageScore} eng=${after.engineVersion}`;
      const flag = target.changed ? " *" : "";
      console.log(`  ${student.name} ${label}: ${before} → ${afterLabel}${flag}`);
      if (target.moduleId === 3) {
        console.log(`    M3 teacherValidated preserved: ${after.teacherValidated}`);
      }
    }

    if (m3Warnings.length > 0) {
      console.log(
        `\n  ⚠ ${m3Warnings.length} M3 row(s) have teacherValidated=false (preserved, not set by this script).`,
      );
    }

    if (apply) {
      if (!confirmed) {
        console.error(
          "\nApply blocked: pass --confirm-cohorte-fondatrice to execute.",
        );
        process.exit(1);
      }

      const backupIds = toChange.filter((t) => t.rowId != null).map((t) => t.rowId!);
      const backupTable = await createBackupTable(conn, toChange);
      report.backupTable = backupTable;
      report.rollbackSql = buildRollbackSql(backupTable, backupIds);
      report.rollbackCommand = `npx tsx scripts/cohorte-fondatrice-pedagogical-override.ts --rollback --backup-table=${backupTable}`;

      await applyTargets(conn, toChange);
      console.log(`\nBackup table: ${backupTable}`);
      console.log(`Rollback: ${report.rollbackCommand}`);
    } else {
      const previewBackup = `module_progress_backup_founder_override_<timestamp>`;
      report.rollbackCommand = `npx tsx scripts/cohorte-fondatrice-pedagogical-override.ts --rollback --backup-table=${previewBackup}`;
      report.rollbackSql = buildRollbackSql(
        previewBackup,
        toChange.filter((t) => t.rowId != null).map((t) => t.rowId!),
      );
      console.log("\nDry-run only — no database changes.");
      console.log("To apply: npx tsx scripts/cohorte-fondatrice-pedagogical-override.ts --apply --confirm-cohorte-fondatrice");
    }

    const outDir = path.join(__dirname, "..", ".manus-logs");
    fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(
      outDir,
      `cohorte-fondatrice-pedagogical-override-${apply ? "apply" : "dry-run"}-${Date.now()}.json`,
    );
    fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
    console.log(`\nReport: ${outPath}\n`);
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
