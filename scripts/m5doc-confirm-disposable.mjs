import mysql from "mysql2/promise";

const url = process.env.DATABASE_URL || "mysql://root@127.0.0.1:3310/m5_doc_qa_disposable";
if (!/@(127\.0\.0\.1|localhost)[:/]/i.test(url) || /railway|rlwy/i.test(url)) {
  console.error("REFUSED_NON_LOCAL");
  process.exit(3);
}

const c = await mysql.createConnection(url);
const [db] = await c.query("SELECT DATABASE() AS db, @@hostname AS host, @@port AS port");
const [tables] = await c.query("SHOW TABLES");
const names = tables.map((r) => Object.values(r)[0]);
const counts = {};
for (const t of ["users", "scenario_runs", "scenarios", "m5_doc_mission_states", "modules"]) {
  if (!names.includes(t)) {
    counts[t] = null;
    continue;
  }
  const [r] = await c.query(`SELECT COUNT(*) AS c FROM \`${t}\``);
  counts[t] = Number(r[0].c);
}
const [idx] = names.includes("m5_doc_mission_states")
  ? await c.query("SHOW INDEX FROM m5_doc_mission_states")
  : [[]];
const [create] = names.includes("m5_doc_mission_states")
  ? await c.query("SHOW CREATE TABLE m5_doc_mission_states")
  : [[{}]];

console.log(
  JSON.stringify(
    {
      ok: true,
      db: db[0],
      local: true,
      tableCount: names.length,
      hasDocTable: names.includes("m5_doc_mission_states"),
      counts,
      uniqueRunVersion: idx.some((i) => i.Key_name?.includes("run_version") && i.Non_unique === 0),
      createSql: create[0]?.["Create Table"]?.slice(0, 500) ?? null,
      emptyOfStudentData: Object.values(counts).every((v) => v === 0 || v === null),
    },
    null,
    2,
  ),
);
await c.end();
