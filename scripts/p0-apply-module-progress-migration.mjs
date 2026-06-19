/**
 * Apply migration 0014_module_progress_unique against DATABASE_URL.
 * Run once on Railway production after deploy:
 *   node scripts/p0-apply-module-progress-migration.mjs
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

const sqlPath = path.join(__dirname, "..", "drizzle", "0014_module_progress_unique.sql");
const raw = fs.readFileSync(sqlPath, "utf8");
const statements = raw
  .split(/--> statement-breakpoint/)
  .map((s) => s.replace(/^--[^\n]*\n/gm, "").trim())
  .filter(Boolean);

const conn = await mysql.createConnection(DATABASE_URL);

try {
  const [before] = await conn.query("SELECT COUNT(*) AS total FROM module_progress");
  console.log(`module_progress rows before: ${before[0].total}`);

  for (const statement of statements) {
    console.log(`Executing: ${statement.slice(0, 80).replace(/\s+/g, " ")}...`);
    await conn.query(statement);
  }

  const [dupes] = await conn.query(`
    SELECT userId, moduleId, COUNT(*) AS cnt
    FROM module_progress
    GROUP BY userId, moduleId
    HAVING cnt > 1
  `);
  if (dupes.length > 0) {
    throw new Error(`Deduplication failed: ${dupes.length} duplicate pairs remain`);
  }

  const [after] = await conn.query("SELECT COUNT(*) AS total FROM module_progress");
  console.log(`module_progress rows after: ${after[0].total}`);
  console.log("Migration 0014 applied successfully.");
} finally {
  await conn.end();
}
