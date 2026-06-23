/**
 * Cohorte Fondatrice 2026 — governed institutional Gold award.
 *
 * Sets profiles.goldCertified + profiles.goldAwardSource for the fixed allowlist only.
 * Does NOT touch: scenario_runs, scoring_events, Silver flags, PDFs, registries, verify URLs.
 *
 * Usage:
 *   npx tsx scripts/cohorte-fondatrice-gold-award.ts
 *   npx tsx scripts/cohorte-fondatrice-gold-award.ts --apply --confirm-cohorte-fondatrice-gold
 *   npx tsx scripts/cohorte-fondatrice-gold-award.ts --rollback --backup-table=<name>
 */
import "dotenv/config";
import "./bootstrap-db-env";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";
import {
  FONDATRICE_2026_GOLD_AWARD,
  FONDATRICE_GOLD_COHORT_STUDENTS,
  FONDATRICE_GOLD_INSTITUTIONAL_NOTE,
} from "../shared/foundingCohortGoldAward";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const DRY_RUN_REPORT = path.join(root, "GOLD_FOUNDING_COHORT_AWARD_DRY_RUN.md");
const EXECUTION_REPORT = path.join(root, "GOLD_FOUNDING_COHORT_AWARD_EXECUTION_REPORT.md");

const args = process.argv.slice(2);
const apply = args.includes("--apply");
const rollback = args.includes("--rollback");
const confirmed = args.includes("--confirm-cohorte-fondatrice-gold");
const verifyOnly = args.includes("--verify-only");
const backupTableArg = args.find((a) => a.startsWith("--backup-table="));
const backupTableFromArg = backupTableArg?.split("=")[1];

type ProfileRow = {
  id: number;
  userId: number;
  silverCertified: number | boolean;
  goldCertified: number | boolean;
  goldAwardSource: string | null;
  studentNumber: string | null;
};

type StudentPlan = {
  userId: number;
  name: string;
  email: string;
  profile: ProfileRow | null;
  action: "AWARD" | "SKIP_ALREADY_AWARDED" | "SKIP_NO_PROFILE" | "BLOCKED_NO_SILVER";
  before: { goldCertified: boolean; goldAwardSource: string | null; silverCertified: boolean };
  after: { goldCertified: boolean; goldAwardSource: string | null };
};

function loadDbUrl(): string {
  for (const key of ["MYSQL_PUBLIC_URL", "MYSQL_URL", "DATABASE_URL"]) {
    if (process.env[key]) return process.env[key]!;
  }
  throw new Error("DATABASE_URL / MYSQL_URL / MYSQL_PUBLIC_URL is required");
}

function bool(v: unknown): boolean {
  return v === true || v === 1 || v === "1";
}

async function ensureGoldAwardSourceColumn(conn: mysql.Connection): Promise<boolean> {
  const [cols] = await conn.query<mysql.RowDataPacket[]>(
    `SELECT COUNT(*) AS cnt FROM information_schema.columns
     WHERE table_schema = DATABASE() AND table_name = 'profiles' AND column_name = 'goldAwardSource'`,
  );
  if (cols[0]?.cnt > 0) return false;
  await conn.query(`ALTER TABLE profiles ADD COLUMN goldAwardSource varchar(64) NULL`);
  return true;
}

async function fetchProfiles(conn: mysql.Connection): Promise<Map<number, ProfileRow>> {
  const ids = FONDATRICE_GOLD_COHORT_STUDENTS.map((s) => s.userId);
  const placeholders = ids.map(() => "?").join(",");
  const [rows] = await conn.query<mysql.RowDataPacket[]>(
    `SELECT id, userId, silverCertified, goldCertified, goldAwardSource, studentNumber
     FROM profiles WHERE userId IN (${placeholders})`,
    ids,
  );
  const map = new Map<number, ProfileRow>();
  for (const row of rows) {
    map.set(row.userId as number, row as ProfileRow);
  }
  return map;
}

function buildPlans(profileMap: Map<number, ProfileRow>): StudentPlan[] {
  return FONDATRICE_GOLD_COHORT_STUDENTS.map((student) => {
    const profile = profileMap.get(student.userId) ?? null;
    if (!profile) {
      return {
        userId: student.userId,
        name: student.name,
        email: student.email,
        profile: null,
        action: "SKIP_NO_PROFILE" as const,
        before: { goldCertified: false, goldAwardSource: null, silverCertified: false },
        after: { goldCertified: false, goldAwardSource: null },
      };
    }
    const before = {
      goldCertified: bool(profile.goldCertified),
      goldAwardSource: profile.goldAwardSource ?? null,
      silverCertified: bool(profile.silverCertified),
    };
    if (!before.silverCertified) {
      return {
        userId: student.userId,
        name: student.name,
        email: student.email,
        profile,
        action: "BLOCKED_NO_SILVER" as const,
        before,
        after: { goldCertified: before.goldCertified, goldAwardSource: before.goldAwardSource },
      };
    }
    if (
      before.goldCertified &&
      before.goldAwardSource === FONDATRICE_2026_GOLD_AWARD
    ) {
      return {
        userId: student.userId,
        name: student.name,
        email: student.email,
        profile,
        action: "SKIP_ALREADY_AWARDED" as const,
        before,
        after: { goldCertified: true, goldAwardSource: FONDATRICE_2026_GOLD_AWARD },
      };
    }
    return {
      userId: student.userId,
      name: student.name,
      email: student.email,
      profile,
      action: "AWARD" as const,
      before,
      after: { goldCertified: true, goldAwardSource: FONDATRICE_2026_GOLD_AWARD },
    };
  });
}

async function countRuntimeFabricationRisk(conn: mysql.Connection, userId: number) {
  const [runs] = await conn.query<mysql.RowDataPacket[]>(
    `SELECT COUNT(*) AS cnt FROM scenario_runs WHERE userId = ? AND isDemo = 0 AND status = 'completed'`,
    [userId],
  );
  const [events] = await conn.query<mysql.RowDataPacket[]>(
    `SELECT COUNT(*) AS cnt FROM scoring_events se
     INNER JOIN scenario_runs sr ON sr.id = se.runId
     WHERE sr.userId = ? AND sr.isDemo = 0`,
    [userId],
  );
  return {
    completedNonDemoRuns: Number(runs[0]?.cnt ?? 0),
    scoringEventsOnNonDemoRuns: Number(events[0]?.cnt ?? 0),
  };
}

async function createBackupTable(conn: mysql.Connection, profileIds: number[]): Promise<string> {
  const backupTable = `profiles_backup_fondatrice_gold_${Date.now()}`;
  await conn.query(
    `CREATE TABLE \`${backupTable}\` AS
     SELECT id, userId, silverCertified, goldCertified, goldAwardSource, studentNumber, createdAt
     FROM profiles WHERE id IN (${profileIds.map(() => "?").join(",")})`,
    profileIds,
  );
  return backupTable;
}

function buildRollbackSql(backupTable: string, profileIds: number[]): string {
  return `-- Rollback Cohorte Fondatrice institutional Gold award
UPDATE profiles p
INNER JOIN \`${backupTable}\` b ON p.id = b.id
SET p.goldCertified = b.goldCertified,
    p.goldAwardSource = b.goldAwardSource
WHERE p.id IN (${profileIds.join(", ") || "/* none */"});`;
}

async function applyAwards(conn: mysql.Connection, plans: StudentPlan[]) {
  for (const plan of plans.filter((p) => p.action === "AWARD")) {
    await conn.query(
      `UPDATE profiles SET goldCertified = 1, goldAwardSource = ? WHERE userId = ?`,
      [FONDATRICE_2026_GOLD_AWARD, plan.userId],
    );
  }
}

function markdownDryRun(input: {
  timestamp: string;
  migrationApplied: boolean;
  plans: StudentPlan[];
  runtimeChecks: Record<number, { completedNonDemoRuns: number; scoringEventsOnNonDemoRuns: number }>;
}) {
  const toAward = input.plans.filter((p) => p.action === "AWARD");
  const lines: string[] = [];
  lines.push("# Gold Founding Cohort Award — Dry Run");
  lines.push("");
  lines.push(`**Generated:** ${input.timestamp}`);
  lines.push(`**Mode:** DRY RUN — no database mutations`);
  lines.push(`**Award source:** \`${FONDATRICE_2026_GOLD_AWARD}\``);
  lines.push(`**Institutional note (API):** ${FONDATRICE_GOLD_INSTITUTIONAL_NOTE}`);
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## 1. Safest award mechanism (selected)");
  lines.push("");
  lines.push("| Mechanism | Used? | Rationale |");
  lines.push("|-----------|-------|-----------|");
  lines.push("| `profiles.goldCertified` | **YES** | Persisted award flag — same as `unlockGoldCertification()` |");
  lines.push("| `profiles.goldAwardSource` | **YES** | Audit trail = `FONDATRICE_2026_GOLD_AWARD` |");
  lines.push("| Live `goldEligible` computation | **NO (display override)** | Engine short-circuits when certified + source set |");
  lines.push("| `student_certifications` table | **N/A** | Not present in schema |");
  lines.push("| Gold registry / PDF / verify | **NO CHANGE** | Pre-provisioned assets remain as-is |");
  lines.push("| `scenario_runs` / `scoring_events` | **NO CHANGE** | No fabrication |");
  lines.push("| Silver flags | **NO CHANGE** | Preserved |");
  lines.push("");
  lines.push("## 2. Schema");
  lines.push("");
  lines.push(
    input.migrationApplied
      ? "`profiles.goldAwardSource` column **added** during this dry-run prep."
      : "`profiles.goldAwardSource` column **already exists** or will be added at apply time.",
  );
  lines.push("");
  lines.push("## 3. Planned profile updates");
  lines.push("");
  lines.push(`| Student | userId | Action | goldCertified (before → after) | goldAwardSource (before → after) | Silver |`);
  lines.push(`|---------|--------|--------|--------------------------------|----------------------------------|--------|`);
  for (const p of input.plans) {
    lines.push(
      `| ${p.name} | ${p.userId} | ${p.action} | ${p.before.goldCertified} → ${p.after.goldCertified} | ${p.before.goldAwardSource ?? "null"} → ${p.after.goldAwardSource ?? "null"} | ${p.before.silverCertified ? "✅" : "❌"} |`,
    );
  }
  lines.push("");
  lines.push(`**Rows to update:** ${toAward.length}`);
  lines.push("");
  lines.push("## 4. Runtime integrity (no fabrication)");
  lines.push("");
  lines.push("| Student | Completed non-demo runs | Scoring events (non-demo) |");
  lines.push("|---------|---------------------------|---------------------------|");
  for (const student of FONDATRICE_GOLD_COHORT_STUDENTS) {
    const r = input.runtimeChecks[student.userId];
    lines.push(
      `| ${student.name.split(" ")[0]} | ${r.completedNonDemoRuns} (unchanged) | ${r.scoringEventsOnNonDemoRuns} (unchanged) |`,
    );
  }
  lines.push("");
  lines.push("## 5. Expected UI after apply + deploy");
  lines.push("");
  lines.push("- Gold state: **AWARDED** / chip **Obtenue**");
  lines.push("- Gold progress ring: **100%** (18/18 via institutional display short-circuit)");
  lines.push("- Institutional note visible on certifications page");
  lines.push("- Silver: unchanged");
  lines.push("");
  lines.push("## 6. Apply command");
  lines.push("");
  lines.push("```bash");
  lines.push("npx tsx scripts/cohorte-fondatrice-gold-award.ts --apply --confirm-cohorte-fondatrice-gold");
  lines.push("```");
  lines.push("");
  return lines.join("\n");
}

function markdownExecution(input: {
  timestamp: string;
  backupTable: string | null;
  rollbackSql: string | null;
  plans: StudentPlan[];
  verification: Record<string, unknown>;
  deployNote: string;
}) {
  const lines: string[] = [];
  lines.push("# Gold Founding Cohort Award — Execution Report");
  lines.push("");
  lines.push(`**Executed:** ${input.timestamp}`);
  lines.push(`**Award source:** \`${FONDATRICE_2026_GOLD_AWARD}\``);
  lines.push(`**Backup table:** ${input.backupTable ?? "—"}`);
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## 1. Profile updates applied");
  lines.push("");
  for (const p of input.plans) {
    lines.push(`### ${p.name} (userId ${p.userId})`);
    lines.push("");
    lines.push(`| Field | Before | After |`);
    lines.push(`|-------|--------|-------|`);
    lines.push(`| goldCertified | ${p.before.goldCertified} | ${p.after.goldCertified} |`);
    lines.push(`| goldAwardSource | ${p.before.goldAwardSource ?? "null"} | ${p.after.goldAwardSource ?? "null"} |`);
    lines.push(`| silverCertified | ${p.before.silverCertified} | ${p.before.silverCertified} (unchanged) |`);
    lines.push(`| action | ${p.action} | |`);
    lines.push("");
  }
  if (input.rollbackSql) {
    lines.push("## 2. Rollback SQL");
    lines.push("");
    lines.push("```sql");
    lines.push(input.rollbackSql);
    lines.push("```");
    lines.push("");
  }
  lines.push("## 3. Post-apply verification");
  lines.push("");
  lines.push("```json");
  lines.push(JSON.stringify(input.verification, null, 2));
  lines.push("```");
  lines.push("");
  lines.push("## 4. Deploy note");
  lines.push("");
  lines.push(input.deployNote);
  lines.push("");
  return lines.join("\n");
}

async function verifyProductionApi(): Promise<Record<string, unknown>> {
  const base =
    process.env.SMOKE_BASE_URL ||
    "https://tec-wms-simulator-production-production.up.railway.app";
  const teacherEmail = process.env.BOOTSTRAP_TEACHER_EMAIL || "prof@teclog.ca";
  const teacherPassword = process.env.BOOTSTRAP_TEACHER_PASSWORD || "16183026Prof$";

  let cookie = "";
  async function trpc(procedure: string, input: unknown, type: "query" | "mutation" = "query") {
    let url = `${base}/api/trpc/${procedure}`;
    const opts: RequestInit = {
      method: type === "query" ? "GET" : "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        ...(cookie ? { cookie } : {}),
      },
    };
    if (type === "query") {
      url += `?input=${encodeURIComponent(JSON.stringify({ json: input ?? null }))}`;
    } else {
      opts.body = JSON.stringify({ json: input });
    }
    const res = await fetch(url, opts);
    const setCookie = res.headers.getSetCookie?.() ?? [];
    if (setCookie.length) cookie = setCookie.map((c) => c.split(";")[0]).join("; ");
    const body = await res.json();
    const err = body?.error?.json?.message ?? body?.error?.message;
    const data = body?.result?.data?.json ?? body?.result?.data;
    return { ok: res.ok && !err, data, err };
  }

  const login = await trpc("auth.localLogin", { email: teacherEmail, password: teacherPassword }, "mutation");
  if (!login.ok) return { apiAvailable: false, loginError: login.err };

  const students: Record<string, unknown>[] = [];
  for (const st of FONDATRICE_GOLD_COHORT_STUDENTS) {
    const gold = await trpc("profiles.goldStatusForStudent", { userId: st.userId }, "query");
    const profile = await trpc("profiles.mine", null, "query");
    void profile;
    students.push({
      short: st.name.split(" ")[0],
      userId: st.userId,
      goldStatus: gold.ok ? gold.data : { error: gold.err },
    });
  }

  const verifyUrls = [
    "TECWMS-GOLD-2026-001",
    "TECWMS-GOLD-2026-002",
    "TECWMS-GOLD-2026-003",
    "TECWMS-GOLD-2026-004",
  ];
  const urlChecks = [];
  for (const certId of verifyUrls) {
    const verifyRes = await fetch(`${base}/verify/${certId}`);
    const pdfRes = await fetch(`${base}/certificates/gold/2026/${certId}.pdf`);
    urlChecks.push({ certId, verifyStatus: verifyRes.status, pdfStatus: pdfRes.status });
  }

  return { apiAvailable: true, students, verifyUrls: urlChecks };
}

async function runRollback(conn: mysql.Connection, backupTable: string) {
  const [exists] = await conn.query<mysql.RowDataPacket[]>(
    `SELECT COUNT(*) AS cnt FROM information_schema.tables
     WHERE table_schema = DATABASE() AND table_name = ?`,
    [backupTable],
  );
  if (!exists[0]?.cnt) throw new Error(`Backup table not found: ${backupTable}`);

  const [ids] = await conn.query<mysql.RowDataPacket[]>(`SELECT id FROM \`${backupTable}\``);
  const profileIds = ids.map((r) => r.id as number);
  const sql = buildRollbackSql(backupTable, profileIds);
  await conn.query(
    `UPDATE profiles p
     INNER JOIN \`${backupTable}\` b ON p.id = b.id
     SET p.goldCertified = b.goldCertified, p.goldAwardSource = b.goldAwardSource`,
  );
  console.log("Rollback complete.\n", sql);
}

async function main() {
  const timestamp = new Date().toISOString();
  const conn = await mysql.createConnection(loadDbUrl());

  try {
    if (rollback) {
      if (!backupTableFromArg) {
        console.error("--rollback requires --backup-table=<name>");
        process.exit(1);
      }
      await runRollback(conn, backupTableFromArg);
      return;
    }

    let migrationApplied = false;
    if (apply || verifyOnly) {
      migrationApplied = await ensureGoldAwardSourceColumn(conn);
    } else {
      const [cols] = await conn.query<mysql.RowDataPacket[]>(
        `SELECT COUNT(*) AS cnt FROM information_schema.columns
         WHERE table_schema = DATABASE() AND table_name = 'profiles' AND column_name = 'goldAwardSource'`,
      );
      migrationApplied = cols[0]?.cnt === 0;
    }

    const profileMap = await fetchProfiles(conn);
    const plans = buildPlans(profileMap);

    const runtimeChecks: Record<number, { completedNonDemoRuns: number; scoringEventsOnNonDemoRuns: number }> = {};
    for (const st of FONDATRICE_GOLD_COHORT_STUDENTS) {
      runtimeChecks[st.userId] = await countRuntimeFabricationRisk(conn, st.userId);
    }

    const blocked = plans.filter((p) => p.action === "BLOCKED_NO_SILVER" || p.action === "SKIP_NO_PROFILE");
    if (blocked.length > 0 && apply) {
      console.error("Blocked students:", blocked);
      process.exit(1);
    }

    if (!apply && !verifyOnly) {
      fs.writeFileSync(
        DRY_RUN_REPORT,
        markdownDryRun({ timestamp, migrationApplied, plans, runtimeChecks }),
        "utf8",
      );
      console.log(`Dry-run report: ${DRY_RUN_REPORT}`);
      console.log(`To apply: npx tsx scripts/cohorte-fondatrice-gold-award.ts --apply --confirm-cohorte-fondatrice-gold`);
      for (const p of plans) {
        console.log(
          `  ${p.name}: ${p.action} gold ${p.before.goldCertified}→${p.after.goldCertified} source ${p.before.goldAwardSource ?? "null"}→${p.after.goldAwardSource ?? "null"}`,
        );
      }
      return;
    }

    if (apply) {
      if (!confirmed) {
        console.error("Apply blocked: pass --confirm-cohorte-fondatrice-gold");
        process.exit(1);
      }
      const toAward = plans.filter((p) => p.action === "AWARD");
      const profileIds = toAward.map((p) => p.profile!.id);
      let backupTable: string | null = null;
      let rollbackSql: string | null = null;
      if (profileIds.length > 0) {
        backupTable = await createBackupTable(conn, profileIds);
        rollbackSql = buildRollbackSql(backupTable, profileIds);
        await applyAwards(conn, plans);
        console.log(`Applied ${toAward.length} award(s). Backup: ${backupTable}`);
      } else {
        console.log("No profile rows required update (already awarded).");
      }

      const verification = await verifyProductionApi();
      fs.writeFileSync(
        EXECUTION_REPORT,
        markdownExecution({
          timestamp,
          backupTable,
          rollbackSql,
          plans: buildPlans(await fetchProfiles(conn)),
          verification,
          deployNote:
            "Code deploy required: server must include institutional Gold short-circuit in goldCertification.ts for 18/18 display. DB award flags applied.",
        }),
        "utf8",
      );
      console.log(`Execution report: ${EXECUTION_REPORT}`);
      return;
    }

    if (verifyOnly) {
      const verification = await verifyProductionApi();
      console.log(JSON.stringify(verification, null, 2));
    }
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
