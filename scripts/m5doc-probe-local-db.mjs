import mysql from "mysql2/promise";
import { readFileSync } from "fs";

function loadEnvUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const env = readFileSync(new URL("../.env", import.meta.url), "utf8");
  const m = env.match(/^DATABASE_URL=(.+)$/m);
  return m?.[1]?.trim();
}

const url = loadEnvUrl();
if (!url) {
  console.error("NO_DATABASE_URL");
  process.exit(2);
}
if (!/@(127\.0\.0\.1|localhost)[:/]/i.test(url)) {
  console.error("REFUSED_NON_LOCAL_DATABASE");
  process.exit(3);
}

const c = await mysql.createConnection(url);
const [r] = await c.query("SELECT DATABASE() AS db");
const [t] = await c.query("SHOW TABLES LIKE 'm5_doc_mission_states'");
const [u] = await c.query("SELECT COUNT(*) AS c FROM users");
const [s] = await c.query("SELECT COUNT(*) AS c FROM scenario_runs");
console.log(
  JSON.stringify({
    ok: true,
    db: r[0]?.db,
    tableExists: t.length > 0,
    userCount: Number(u[0]?.c ?? 0),
    runCount: Number(s[0]?.c ?? 0),
    local: true,
  }),
);
await c.end();
