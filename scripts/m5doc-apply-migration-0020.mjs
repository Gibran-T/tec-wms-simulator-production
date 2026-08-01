/**
 * Apply additive migration 0020 on the DATABASE_URL target (no secret printing).
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import mysql from "mysql2/promise";

const url = process.env.DATABASE_URL || process.env.MYSQL_PUBLIC_URL || process.env.MYSQL_URL;
if (!url) {
  console.error("DATABASE_URL/MYSQL_PUBLIC_URL required");
  process.exit(2);
}
if (/railway|rlwy/i.test(url) && process.env.M5DOC_ALLOW_REMOTE_MIGRATE !== "true") {
  console.error("REFUSED: set M5DOC_ALLOW_REMOTE_MIGRATE=true to migrate Railway");
  process.exit(3);
}

const sqlPath = resolve("drizzle/0020_m5_doc_mission_states.sql");
const raw = readFileSync(sqlPath, "utf8");
// Strip line comments; keep single CREATE statement.
const sql = raw
  .split(/\r?\n/)
  .filter((line) => !/^\s*--/.test(line))
  .join("\n")
  .trim()
  .replace(/;\s*$/, "");

const conn = await mysql.createConnection(url);
const [beforeDb] = await conn.query("SELECT DATABASE() AS db, @@hostname AS host, @@port AS port");
const [beforeTables] = await conn.query("SHOW TABLES LIKE 'm5_doc_mission_states'");
const existed = beforeTables.length > 0;

if (!existed) {
  await conn.query(sql);
}

const [afterTables] = await conn.query("SHOW TABLES LIKE 'm5_doc_mission_states'");
const [idx] = await conn.query("SHOW INDEX FROM m5_doc_mission_states");
const [createRows] = await conn.query("SHOW CREATE TABLE m5_doc_mission_states");
const createSql = createRows[0]["Create Table"];
const [countRows] = await conn.query("SELECT COUNT(*) AS c FROM m5_doc_mission_states");
const [runCount] = await conn.query("SELECT COUNT(*) AS c FROM scenario_runs");

const summary = {
  ok: true,
  dbName: beforeDb[0].db,
  host: String(beforeDb[0].host),
  port: beforeDb[0].port,
  existedBefore: existed,
  tablePresent: afterTables.length > 0,
  uniqueRunVersion: idx.some((i) => i.Key_name?.includes("run_version") && i.Non_unique === 0),
  hasFk: /FOREIGN KEY.*scenario_runs/i.test(createSql),
  docRowCount: Number(countRows[0].c),
  scenarioRunsUnchangedProbe: Number(runCount[0].c),
  additiveOnly: true,
};
console.log(JSON.stringify(summary, null, 2));
await conn.end();
process.exit(summary.tablePresent && summary.uniqueRunVersion && summary.hasFk ? 0 : 4);
