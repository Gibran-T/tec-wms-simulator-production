/**
 * Apply migration 0017_cc_recon_target_claims against DATABASE_URL.
 * Safe on empty DB and on existing DB with historical duplicate ADJ rows.
 * Does not rewrite transactions or touch historical runs.
 *
 *   node scripts/apply-cc-recon-claims-migration.mjs
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const sqlPath = path.join(__dirname, "..", "drizzle", "0017_cc_recon_target_claims.sql");
const raw = fs.readFileSync(sqlPath, "utf8");
const statements = raw
  .split(/--> statement-breakpoint/)
  .map((s) => s.replace(/^--[^\n]*\n/gm, "").trim())
  .filter(Boolean);

const conn = await mysql.createConnection(DATABASE_URL);

try {
  const [tablesBefore] = await conn.query(
    "SHOW TABLES LIKE 'cc_recon_target_claims'",
  );
  console.log(`cc_recon_target_claims exists before: ${tablesBefore.length > 0}`);

  for (const statement of statements) {
    console.log(`Executing: ${statement.slice(0, 100).replace(/\s+/g, " ")}...`);
    await conn.query(statement);
  }

  const [tablesAfter] = await conn.query(
    "SHOW TABLES LIKE 'cc_recon_target_claims'",
  );
  if (tablesAfter.length === 0) {
    throw new Error("cc_recon_target_claims was not created");
  }

  const [indexes] = await conn.query(
    "SHOW INDEX FROM cc_recon_target_claims WHERE Non_unique = 0",
  );
  const indexNames = [...new Set(indexes.map((r) => r.Key_name))];
  console.log(`Unique indexes: ${indexNames.join(", ")}`);
  if (!indexNames.includes("cc_recon_target_claims_key_uidx")) {
    throw new Error("Missing unique index on idempotencyKey");
  }
  if (!indexNames.includes("cc_recon_target_claims_run_target_uidx")) {
    throw new Error("Missing unique index on (runId, stepCode, sku, bin)");
  }

  let adjDupeCount = 0;
  try {
    const [adjDupes] = await conn.query(`
      SELECT runId, sku, qty, COUNT(*) AS cnt
      FROM transactions
      WHERE docType = 'ADJ' AND posted = 1
      GROUP BY runId, sku, qty
      HAVING cnt > 1
      LIMIT 5
    `);
    adjDupeCount = adjDupes.length;
  } catch (err) {
    const msg = String(err?.message ?? err);
    if (!/doesn't exist|Unknown table/i.test(msg)) throw err;
    console.log("transactions table not present — skipping historical ADJ probe (empty DB path)");
  }
  console.log(
    `Historical duplicate ADJ groups still readable: ${adjDupeCount} (sample, not modified)`,
  );

  const [claimCount] = await conn.query(
    "SELECT COUNT(*) AS total FROM cc_recon_target_claims",
  );
  console.log(`cc_recon_target_claims rows: ${claimCount[0].total}`);
  console.log("Migration 0017 applied successfully (prospective claims only).");
} finally {
  await conn.end();
}
