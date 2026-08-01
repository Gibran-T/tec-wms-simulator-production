/**
 * Setup disposable LOCAL MySQL for M5 DOC QA only.
 * Refuses non-loopback hosts. Never touches production/Railway.
 */
import mysql from "mysql2/promise";
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const URL =
  process.env.M5DOC_DISPOSABLE_DATABASE_URL ||
  "mysql://root@127.0.0.1:3310/mysql";

function assertLocal(url) {
  if (!/@(127\.0\.0\.1|localhost)[:/]/i.test(url)) {
    console.error("REFUSED_NON_LOCAL_DATABASE", url.replace(/:[^:@/]+@/, ":****@"));
    process.exit(3);
  }
  if (/railway|proxy\.rlwy|amazonaws|azure|cloud/i.test(url)) {
    console.error("REFUSED_REMOTE_DATABASE");
    process.exit(3);
  }
}

assertLocal(URL);

const DB_NAME = "m5_doc_qa_disposable";

async function main() {
  const conn = await mysql.createConnection(URL);
  const [before] = await conn.query("SHOW DATABASES LIKE ?", [DB_NAME]);
  await conn.query(`DROP DATABASE IF EXISTS \`${DB_NAME}\``);
  await conn.query(
    `CREATE DATABASE \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  );
  await conn.query(`USE \`${DB_NAME}\``);

  // Apply numbered drizzle migrations in order (skip nested migrations/ copies)
  const drizzleDir = join(root, "drizzle");
  const files = readdirSync(drizzleDir)
    .filter((f) => /^\d{4}_.+\.sql$/i.test(f))
    .sort();

  for (const f of files) {
    const sql = readFileSync(join(drizzleDir, f), "utf8");
    // Split on statement boundaries carefully — drizzle files are usually single CREATE
    const parts = sql
      .split(/;\s*\n/)
      .map((s) => s.trim())
      .filter((s) => s && !s.startsWith("--"));
    for (const stmt of parts) {
      try {
        await conn.query(stmt);
      } catch (e) {
        // Ignore duplicate/exists for IF NOT EXISTS style
        if (!/already exists/i.test(e.message)) {
          console.error("MIGRATION_FAIL", f, e.message);
          throw e;
        }
      }
    }
    console.log("APPLIED", f);
  }

  const [tables] = await conn.query("SHOW TABLES");
  const tableNames = tables.map((r) => Object.values(r)[0]);
  const [users] = await conn.query("SELECT COUNT(*) AS c FROM users").catch(() => [[{ c: 0 }]]);
  const [runs] = await conn.query("SELECT COUNT(*) AS c FROM scenario_runs").catch(() => [[{ c: 0 }]]);
  const hasDoc = tableNames.includes("m5_doc_mission_states");

  // Confirm FK + unique on DOC table
  const [idx] = await conn.query("SHOW INDEX FROM m5_doc_mission_states");
  const uniqueRunVersion = idx.some(
    (i) => i.Key_name === "m5_doc_mission_states_run_version_uidx" && i.Non_unique === 0,
  );

  console.log(
    JSON.stringify(
      {
        ok: true,
        host: "127.0.0.1:3310",
        database: DB_NAME,
        droppedExisting: before.length > 0,
        tableCount: tableNames.length,
        hasDocTable: hasDoc,
        uniqueRunVersion,
        userCount: Number(users[0]?.c ?? 0),
        runCount: Number(runs[0]?.c ?? 0),
        studentData: false,
        connectionUrl: `mysql://root@127.0.0.1:3310/${DB_NAME}`,
      },
      null,
      2,
    ),
  );
  await conn.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
