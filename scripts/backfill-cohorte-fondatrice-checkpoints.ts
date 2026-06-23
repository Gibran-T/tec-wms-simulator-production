/**
 * Cohorte Fondatrice — checkpoint backfill (M2–M5).
 * Does NOT modify profiles cert flags or certificate registry.
 *
 * Usage:
 *   npx tsx scripts/backfill-cohorte-fondatrice-checkpoints.ts --dry-run
 *   npx tsx scripts/backfill-cohorte-fondatrice-checkpoints.ts --apply
 *   npx tsx scripts/backfill-cohorte-fondatrice-checkpoints.ts --dry-run --user-email=fredlolabio@gmail.com
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { users } from "../drizzle/schema";
import {
  CHECKPOINT_MODULE_IDS,
  computeModuleCheckpointSnapshot,
  recomputeModuleCheckpoint,
} from "../server/checkpointEngine";
import { getModuleProgressRow } from "../server/db";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const COHORTE_FONDATRICE = [
  { name: "Darlin Campaz Paredes", email: "dcparedes2010@gmail.com" },
  { name: "Fredy Tamile Lola", email: "fredlolabio@gmail.com" },
  { name: "Prince Agbodjan Sewa Francis Ghislain", email: "sewafrancispa@gmail.com" },
  { name: "Aissata Soukeina Camara", email: "aissatasoukeinacamara@gmail.com" },
];

const args = process.argv.slice(2);
const dryRun = !args.includes("--apply");
const emailArg = args.find((a) => a.startsWith("--user-email="));
const filterEmail = emailArg?.split("=")[1]?.toLowerCase();

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  const db = drizzle(process.env.DATABASE_URL);
  const targets = filterEmail
    ? COHORTE_FONDATRICE.filter((s) => s.email.toLowerCase() === filterEmail)
    : COHORTE_FONDATRICE;

  if (targets.length === 0) {
    console.error("No matching students for filter:", filterEmail);
    process.exit(1);
  }

  const report: {
    mode: string;
    timestamp: string;
    students: unknown[];
  } = {
    mode: dryRun ? "dry-run" : "apply",
    timestamp: new Date().toISOString(),
    students: [],
  };

  console.log(`\nCheckpoint backfill — ${dryRun ? "DRY RUN" : "APPLY"}\n`);

  for (const student of targets) {
    const rows = await db.select().from(users).where(eq(users.email, student.email)).limit(1);
    const user = rows[0];
    if (!user) {
      console.warn(`  SKIP ${student.name}: user not found (${student.email})`);
      report.students.push({ ...student, error: "user_not_found" });
      continue;
    }

    const studentReport: {
      name: string;
      email: string;
      userId: number;
      modules: unknown[];
    } = {
      name: student.name,
      email: student.email,
      userId: user.id,
      modules: [],
    };

    for (const moduleId of CHECKPOINT_MODULE_IDS) {
      const before = await getModuleProgressRow(user.id, moduleId);
      const snapshot = await computeModuleCheckpointSnapshot(user.id, moduleId);

      const delta = {
        moduleId,
        before: before
          ? {
              passed: before.passed,
              bestScore: before.bestScore,
              progressPct: before.progressPct ?? null,
              completedScenarios: before.completedScenarios ?? null,
              teacherValidated: before.teacherValidated,
            }
          : null,
        after: snapshot
          ? {
              passed: snapshot.passed,
              bestScore: snapshot.bestScore,
              progressPct: snapshot.progressPct,
              completedScenarios: snapshot.completedScenarios,
              requiredScenarios: snapshot.requiredScenarios,
              teacherValidated: snapshot.teacherValidated,
              scenarioStatus: snapshot.scenarioStatus,
            }
          : null,
        changed:
          before?.passed !== snapshot?.passed ||
          (before?.progressPct ?? 0) !== (snapshot?.progressPct ?? 0) ||
          (before?.completedScenarios ?? 0) !== (snapshot?.completedScenarios ?? 0),
      };

      studentReport.modules.push(delta);

      const label = `M${moduleId}`;
      const beforeLabel = before ? `passed=${before.passed} pct=${before.progressPct ?? "?"} scn=${before.completedScenarios ?? "?"}` : "—";
      const afterLabel = snapshot
        ? `passed=${snapshot.passed} pct=${snapshot.progressPct} scn=${snapshot.completedScenarios}/${snapshot.requiredScenarios}`
        : "—";
      console.log(`  ${student.name} ${label}: ${beforeLabel} → ${afterLabel}${delta.changed ? " *" : ""}`);

      if (!dryRun && snapshot) {
        await recomputeModuleCheckpoint(user.id, moduleId);
      }
    }

    report.students.push(studentReport);
  }

  const outDir = path.join(__dirname, "..", ".manus-logs");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(
    outDir,
    `checkpoint-backfill-${dryRun ? "dry-run" : "apply"}-${Date.now()}.json`,
  );
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log(`\nReport written: ${outPath}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
