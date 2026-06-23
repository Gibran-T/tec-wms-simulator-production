/**
 * Apply migration 0015_checkpoint_engine against DATABASE_URL.
 *   node scripts/apply-checkpoint-engine-migration.mjs
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

const sqlPath = path.join(__dirname, "..", "drizzle", "0015_checkpoint_engine.sql");
const raw = fs.readFileSync(sqlPath, "utf8");
const statements = raw
  .split(";")
  .map((s) => s.replace(/^--[^\n]*\n/gm, "").trim())
  .filter(Boolean);

const conn = await mysql.createConnection(DATABASE_URL);

try {
  for (const stmt of statements) {
    console.log("Executing:", stmt.slice(0, 80).replace(/\s+/g, " "), "...");
    await conn.query(stmt);
  }
  console.log("Migration 0015_checkpoint_engine applied.");
} catch (err) {
  const msg = String(err);
  if (msg.includes("Duplicate column")) {
    console.log("Columns already exist — migration skipped.");
  } else {
    throw err;
  }
} finally {
  await conn.end();
}
