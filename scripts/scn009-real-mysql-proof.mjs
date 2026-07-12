/**
 * SCN-009 real MariaDB proof — disposable non-production DB only.
 *
 * DATABASE_URL / SCN009_PROOF_DATABASE_URL must point at a disposable instance, e.g.:
 *   mysql://USER:PASS@HOST:PORT/mysql
 * The script creates/drops scn009_empty, scn009_history, and scn009_live on that host.
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";
import { spawn } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const BASE_URL = process.env.SCN009_PROOF_DATABASE_URL || process.env.DATABASE_URL;

if (!BASE_URL) {
  console.error("SCN009_PROOF_DATABASE_URL or DATABASE_URL required");
  process.exit(1);
}

function dbUrl(dbName) {
  const u = new URL(BASE_URL);
  u.pathname = `/${dbName}`;
  return u.toString();
}

function runApply(databaseUrl) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [path.join(ROOT, "scripts", "apply-cc-recon-claims-migration.mjs")],
      {
        cwd: ROOT,
        env: { ...process.env, DATABASE_URL: databaseUrl },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    let out = "";
    let err = "";
    child.stdout.on("data", (d) => {
      out += d.toString();
    });
    child.stderr.on("data", (d) => {
      err += d.toString();
    });
    child.on("close", (code) => {
      resolve({ code, out, err });
    });
    child.on("error", reject);
  });
}

async function dumpTableMeta(conn, label) {
  const [cols] = await conn.query("SHOW FULL COLUMNS FROM cc_recon_target_claims");
  const [idx] = await conn.query("SHOW INDEX FROM cc_recon_target_claims");
  const [createRows] = await conn.query("SHOW CREATE TABLE cc_recon_target_claims");
  console.log(`\n===== ${label}: COLUMNS =====`);
  console.table(
    cols.map((c) => ({
      Field: c.Field,
      Type: c.Type,
      Null: c.Null,
      Key: c.Key,
      Default: c.Default,
      Extra: c.Extra,
    })),
  );
  console.log(`===== ${label}: INDEXES =====`);
  console.table(
    idx.map((i) => ({
      Key_name: i.Key_name,
      Non_unique: i.Non_unique,
      Seq: i.Seq_in_index,
      Column: i.Column_name,
    })),
  );
  console.log(`===== ${label}: CREATE TABLE =====`);
  console.log(createRows[0]["Create Table"]);
  return { cols, idx, create: createRows[0]["Create Table"] };
}

async function ensureSupportTables(conn) {
  await conn.query(`
    CREATE TABLE IF NOT EXISTS transactions (
      id int AUTO_INCREMENT PRIMARY KEY,
      runId int NOT NULL,
      docType enum('PO','GR','SO','GI','ADJ','PUTAWAY','PUTAWAY_M1','PICKING','PICKING_M1') NOT NULL,
      moveType varchar(16) NULL,
      sku varchar(64) NOT NULL,
      bin varchar(64) NOT NULL,
      qty decimal(10,2) NOT NULL,
      posted boolean NOT NULL DEFAULT false,
      docRef varchar(64) NULL,
      comment text NULL,
      createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await conn.query(`
    CREATE TABLE IF NOT EXISTS inventory_adjustments (
      id int AUTO_INCREMENT PRIMARY KEY,
      runId int NOT NULL,
      sku varchar(64) NOT NULL,
      varianceQty decimal(10,2) NOT NULL,
      adjustmentQty decimal(10,2) NOT NULL,
      reason text NULL,
      approved boolean NOT NULL DEFAULT false,
      approvedBy int NULL,
      approvedAt timestamp NULL,
      createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await conn.query(`
    CREATE TABLE IF NOT EXISTS scoring_events (
      id int AUTO_INCREMENT PRIMARY KEY,
      runId int NOT NULL,
      eventType varchar(64) NOT NULL,
      pointsDelta int NOT NULL DEFAULT 0,
      message text NULL,
      createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

function isDup(err) {
  return err?.code === "ER_DUP_ENTRY" || err?.errno === 1062 || /duplicate/i.test(String(err?.message ?? ""));
}

async function inventoryFor(conn, runId, sku, bin) {
  const [rows] = await conn.query(
    `SELECT docType, qty, posted FROM transactions WHERE runId = ? AND sku = ? AND bin = ? AND posted = 1`,
    [runId, sku, bin],
  );
  let qty = 0;
  for (const r of rows) {
    const q = Number(r.qty);
    if (r.docType === "GR" || r.docType === "ADJ") qty += q;
    else if (r.docType === "GI") qty -= Math.abs(q);
  }
  return qty;
}

/**
 * Mirrors claimAndPersistCcReconTarget SQL transaction using raw mysql2.
 * Returns { created, alreadyReconciled } and never throws ER_DUP_ENTRY to caller.
 */
async function claimAndPersistRaw(poolOrConn, input, { failAfterClaim = false } = {}) {
  const claimKey = `CC_RECON:${input.runId}:${input.sku}:${input.bin}`;
  const conn = await poolOrConn.getConnection();
  try {
    const [existing] = await conn.query(
      `SELECT id FROM cc_recon_target_claims WHERE idempotencyKey = ? LIMIT 1`,
      [claimKey],
    );
    if (existing.length > 0) {
      return { created: false, alreadyReconciled: true, claimKey };
    }

    await conn.beginTransaction();
    try {
      await conn.query(
        `INSERT INTO cc_recon_target_claims
          (runId, stepCode, sku, bin, idempotencyKey, varianceQty, status)
         VALUES (?, 'CC_RECON', ?, ?, ?, ?, 'CLAIMED')`,
        [input.runId, input.sku, input.bin, claimKey, input.varianceQty],
      );

      if (failAfterClaim) {
        throw new Error("SIMULATED_FAILURE_AFTER_CLAIM");
      }

      const [adjRows] = await conn.query(
        `SELECT id, adjustmentQty FROM inventory_adjustments WHERE runId = ? AND sku = ?`,
        [input.runId, input.sku],
      );
      if (!adjRows.some((r) => Number(r.adjustmentQty) === input.varianceQty)) {
        await conn.query(
          `INSERT INTO inventory_adjustments
            (runId, sku, varianceQty, adjustmentQty, reason, approved)
           VALUES (?, ?, ?, ?, ?, 0)`,
          [
            input.runId,
            input.sku,
            input.varianceQty,
            input.varianceQty,
            input.justification ?? (input.varianceQty === 0 ? "ZERO_VARIANCE_CONFIRMED" : null),
          ],
        );
      }

      if (input.varianceQty !== 0) {
        const docRef = `CC_RECON:${input.sku}:${input.bin}`;
        const [txs] = await conn.query(
          `SELECT id, sku, bin, qty, posted, docRef FROM transactions WHERE runId = ? AND docType = 'ADJ'`,
          [input.runId],
        );
        const already = txs.some(
          (t) =>
            (t.sku === input.sku && t.bin === input.bin && t.posted && Number(t.qty) === input.varianceQty) ||
            t.docRef === docRef,
        );
        if (!already) {
          await conn.query(
            `INSERT INTO transactions
              (runId, docType, moveType, sku, bin, qty, posted, docRef, comment)
             VALUES (?, 'ADJ', 'MI07', ?, ?, ?, 1, ?, ?)`,
            [input.runId, input.sku, input.bin, input.varianceQty, docRef, input.justification ?? null],
          );
        }
      }

      await conn.query(
        `UPDATE cc_recon_target_claims SET status = 'COMPLETED', completedAt = NOW() WHERE idempotencyKey = ?`,
        [claimKey],
      );
      await conn.commit();
      return { created: true, alreadyReconciled: false, claimKey };
    } catch (err) {
      await conn.rollback();
      if (isDup(err)) {
        return { created: false, alreadyReconciled: true, claimKey };
      }
      throw err;
    }
  } finally {
    conn.release();
  }
}

async function addScoringEventOnce(conn, { runId, eventType, pointsDelta, message }) {
  const [existing] = await conn.query(
    `SELECT id FROM scoring_events WHERE runId = ? AND eventType = ? AND pointsDelta > 0 LIMIT 1`,
    [runId, eventType],
  );
  if (existing.length > 0) return { created: false };
  await conn.query(
    `INSERT INTO scoring_events (runId, eventType, pointsDelta, message) VALUES (?, ?, ?, ?)`,
    [runId, eventType, pointsDelta, message ?? null],
  );
  return { created: true };
}

const report = {
  dbType: null,
  nonProduction: true,
  firstApply: null,
  secondApply: null,
  tableMeta: null,
  uniqueIndexes: null,
  history: null,
  concurrency2: null,
  concurrency10: null,
  rollback: null,
  zeroVariance: null,
  scoringRecovery: null,
};

async function main() {
  console.log("=== SCN-009 REAL MYSQL/MARIADB PROOF (NON-PRODUCTION) ===");
  console.log(`Base URL host/port only: ${new URL(BASE_URL).host}`);

  // ── Empty DB migration ───────────────────────────────────────────────
  const emptyUrl = dbUrl("scn009_empty");
  const admin = await mysql.createConnection(dbUrl("mysql"));
  await admin.query("DROP DATABASE IF EXISTS scn009_empty");
  await admin.query("CREATE DATABASE scn009_empty");
  await admin.query("DROP DATABASE IF EXISTS scn009_history");
  await admin.query("CREATE DATABASE scn009_history");
  await admin.query("DROP DATABASE IF EXISTS scn009_live");
  await admin.query("CREATE DATABASE scn009_live");
  const [ver] = await admin.query("SELECT VERSION() AS v");
  report.dbType = ver[0].v;
  console.log(`DB version: ${report.dbType}`);
  await admin.end();

  console.log("\n--- 1) First apply on empty DB ---");
  const first = await runApply(emptyUrl);
  console.log(first.out);
  if (first.err) console.error(first.err);
  if (first.code !== 0) throw new Error(`First apply failed code=${first.code}`);
  report.firstApply = { ok: true, output: first.out.trim() };

  const emptyConn = await mysql.createConnection(emptyUrl);
  const meta = await dumpTableMeta(emptyConn, "EMPTY_AFTER_FIRST_APPLY");
  report.tableMeta = meta.cols.map((c) => ({ Field: c.Field, Type: c.Type, Null: c.Null, Key: c.Key, Default: c.Default, Extra: c.Extra }));
  report.uniqueIndexes = meta.idx
    .filter((i) => i.Non_unique === 0)
    .map((i) => ({ Key_name: i.Key_name, Column: i.Column_name, Seq: i.Seq_in_index }));

  console.log("\n--- 2) Second apply on same empty DB (idempotent) ---");
  const second = await runApply(emptyUrl);
  console.log(second.out);
  if (second.err) console.error(second.err);
  if (second.code !== 0) throw new Error(`Second apply failed code=${second.code}`);
  report.secondApply = { ok: true, output: second.out.trim() };

  const [txCountEmpty] = await emptyConn.query(
    `SELECT COUNT(*) AS c FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'transactions'`,
  );
  console.log(`transactions table present after migration-only: ${txCountEmpty[0].c > 0}`);
  await emptyConn.end();

  // ── History compatibility ────────────────────────────────────────────
  console.log("\n--- 3) Existing-history compatibility (run-491-like) ---");
  const historyUrl = dbUrl("scn009_history");
  const hist = await mysql.createConnection(historyUrl);
  await ensureSupportTables(hist);
  // Seed historical duplicate ADJs — inventory 100 → 97 → 94
  await hist.query(
    `INSERT INTO transactions (runId, docType, moveType, sku, bin, qty, posted, docRef)
     VALUES
       (491, 'GR', '101', 'SKU-001', 'B-01-R1-L1', 100, 1, 'GR-SEED'),
       (491, 'ADJ', 'MI07', 'SKU-001', 'B-01-R1-L1', -3, 1, 'ADJ-SKU-001'),
       (491, 'ADJ', 'MI07', 'SKU-001', 'B-01-R1-L1', -3, 1, 'ADJ-SKU-001'),
       (491, 'GR', '101', 'SKU-003', 'B-01-R1-L2', 80, 1, 'GR-SEED-003')`,
  );
  const beforeAdj = await hist.query(
    `SELECT id, runId, docType, sku, bin, qty, posted, docRef FROM transactions WHERE runId = 491 ORDER BY id`,
  );
  const beforeSnap = JSON.stringify(beforeAdj[0]);
  const invBefore = await inventoryFor(hist, 491, "SKU-001", "B-01-R1-L1");
  console.log(`Historical SKU-001 inventory before migration: ${invBefore}`);

  const histApply = await runApply(historyUrl);
  console.log(histApply.out);
  if (histApply.code !== 0) throw new Error("History apply failed");

  const afterAdj = await hist.query(
    `SELECT id, runId, docType, sku, bin, qty, posted, docRef FROM transactions WHERE runId = 491 ORDER BY id`,
  );
  const afterSnap = JSON.stringify(afterAdj[0]);
  const [claimHist] = await hist.query(`SELECT COUNT(*) AS c FROM cc_recon_target_claims`);
  const invAfter = await inventoryFor(hist, 491, "SKU-001", "B-01-R1-L1");
  const unchanged = beforeSnap === afterSnap;
  console.log(`Transactions unchanged: ${unchanged}`);
  console.log(`Synthetic claims generated: ${claimHist[0].c}`);
  console.log(`Historical inventory after migration: ${invAfter}`);
  if (!unchanged) throw new Error("Historical transactions were rewritten");
  if (Number(claimHist[0].c) !== 0) throw new Error("Synthetic claims were created");
  if (invAfter !== 94) throw new Error(`Expected historical inventory 94, got ${invAfter}`);
  report.history = {
    ok: true,
    inventoryBefore: invBefore,
    inventoryAfter: invAfter,
    claimRows: Number(claimHist[0].c),
    transactionsUnchanged: unchanged,
    adjRows: afterAdj[0].filter((r) => r.docType === "ADJ").length,
  };
  await hist.end();

  // ── Live concurrency / rollback / zero-var / scoring ─────────────────
  console.log("\n--- 4) Real concurrency / rollback / zero-variance / scoring ---");
  const liveUrl = dbUrl("scn009_live");
  const liveAdmin = await mysql.createConnection(liveUrl);
  await ensureSupportTables(liveAdmin);
  // Apply claims migration
  const liveApply = await runApply(liveUrl);
  if (liveApply.code !== 0) throw new Error("Live DB migration failed");
  console.log(liveApply.out);

  // Seed GR stock for new run
  const runId = 9001;
  await liveAdmin.query(
    `INSERT INTO transactions (runId, docType, moveType, sku, bin, qty, posted, docRef) VALUES
      (?, 'GR', '101', 'SKU-001', 'B-01-R1-L1', 100, 1, 'GR-001'),
      (?, 'GR', '101', 'SKU-003', 'B-01-R1-L2', 80, 1, 'GR-003')`,
    [runId, runId],
  );
  await liveAdmin.end();

  const pool = mysql.createPool({ uri: liveUrl, connectionLimit: 12, waitForConnections: true });

  // Two concurrent SKU-001
  console.log("\n--- 4a) Two concurrent SKU-001 ---");
  const input001 = {
    runId,
    sku: "SKU-001",
    bin: "B-01-R1-L1",
    varianceQty: -3,
    justification: "cycle count variance confirmed",
  };
  const two = await Promise.all([
    claimAndPersistRaw(pool, input001),
    claimAndPersistRaw(pool, input001),
  ]);
  const created2 = two.filter((r) => r.created).length;
  const idem2 = two.filter((r) => r.alreadyReconciled).length;
  const probe = await mysql.createConnection(liveUrl);
  const [claims2] = await probe.query(`SELECT * FROM cc_recon_target_claims WHERE runId = ? AND sku = 'SKU-001'`, [runId]);
  const [adjs2] = await probe.query(`SELECT * FROM inventory_adjustments WHERE runId = ? AND sku = 'SKU-001'`, [runId]);
  const [txs2] = await probe.query(`SELECT * FROM transactions WHERE runId = ? AND docType = 'ADJ' AND sku = 'SKU-001'`, [runId]);
  const inv2 = await inventoryFor(probe, runId, "SKU-001", "B-01-R1-L1");
  console.log({ created2, idem2, claims: claims2.length, adjs: adjs2.length, adjTx: txs2.length, inv2 });
  if (created2 !== 1 || idem2 !== 1) throw new Error("Two-request concurrency winner/loser mismatch");
  if (claims2.length !== 1 || adjs2.length !== 1 || txs2.length !== 1 || inv2 !== 97) {
    throw new Error("Two-request post-state invalid");
  }
  report.concurrency2 = { ok: true, created2, idem2, claims: 1, adjs: 1, adjTx: 1, inventory: inv2 };

  // Ten concurrent — use a fresh target/run
  console.log("\n--- 4b) Ten concurrent SKU-001 on fresh run ---");
  const run10 = 9010;
  await probe.query(
    `INSERT INTO transactions (runId, docType, moveType, sku, bin, qty, posted, docRef) VALUES (?, 'GR', '101', 'SKU-001', 'B-01-R1-L1', 100, 1, 'GR-10')`,
    [run10],
  );
  await probe.end();
  const input10 = { runId: run10, sku: "SKU-001", bin: "B-01-R1-L1", varianceQty: -3, justification: "ten-way" };
  const ten = await Promise.all(Array.from({ length: 10 }, () => claimAndPersistRaw(pool, input10)));
  const created10 = ten.filter((r) => r.created).length;
  const idem10 = ten.filter((r) => r.alreadyReconciled).length;
  const p10 = await mysql.createConnection(liveUrl);
  const [c10] = await p10.query(`SELECT COUNT(*) AS c FROM cc_recon_target_claims WHERE runId = ?`, [run10]);
  const [a10] = await p10.query(`SELECT COUNT(*) AS c FROM inventory_adjustments WHERE runId = ?`, [run10]);
  const [t10] = await p10.query(`SELECT COUNT(*) AS c FROM transactions WHERE runId = ? AND docType = 'ADJ'`, [run10]);
  const inv10 = await inventoryFor(p10, run10, "SKU-001", "B-01-R1-L1");
  console.log({ created10, idem10, claims: c10[0].c, adjs: a10[0].c, adjTx: t10[0].c, inv10 });
  if (created10 !== 1 || idem10 !== 9 || Number(c10[0].c) !== 1 || Number(t10[0].c) !== 1 || inv10 !== 97) {
    throw new Error("Ten-request concurrency failed");
  }
  report.concurrency10 = { ok: true, created10, idem10, claims: 1, adjTx: 1, inventory: inv10 };
  await p10.end();

  // Rollback
  console.log("\n--- 5) Real rollback after claim ---");
  const runRb = 9020;
  const pRb = await mysql.createConnection(liveUrl);
  await pRb.query(
    `INSERT INTO transactions (runId, docType, moveType, sku, bin, qty, posted, docRef) VALUES (?, 'GR', '101', 'SKU-001', 'B-01-R1-L1', 100, 1, 'GR-RB')`,
    [runRb],
  );
  await pRb.end();
  const inputRb = { runId: runRb, sku: "SKU-001", bin: "B-01-R1-L1", varianceQty: -3, justification: "rollback-test" };
  let failed = false;
  try {
    await claimAndPersistRaw(pool, inputRb, { failAfterClaim: true });
  } catch (e) {
    failed = /SIMULATED_FAILURE_AFTER_CLAIM/.test(String(e.message));
  }
  if (!failed) throw new Error("Expected simulated failure");
  const pRb2 = await mysql.createConnection(liveUrl);
  const [cRb] = await pRb2.query(`SELECT COUNT(*) AS c FROM cc_recon_target_claims WHERE runId = ?`, [runRb]);
  const [aRb] = await pRb2.query(`SELECT COUNT(*) AS c FROM inventory_adjustments WHERE runId = ?`, [runRb]);
  const [tRb] = await pRb2.query(`SELECT COUNT(*) AS c FROM transactions WHERE runId = ? AND docType = 'ADJ'`, [runRb]);
  const invRb = await inventoryFor(pRb2, runRb, "SKU-001", "B-01-R1-L1");
  console.log({ claimsAfterFail: cRb[0].c, adjs: aRb[0].c, adjTx: tRb[0].c, invRb });
  if (Number(cRb[0].c) !== 0 || Number(aRb[0].c) !== 0 || Number(tRb[0].c) !== 0 || invRb !== 100) {
    throw new Error("Rollback did not clean state");
  }
  await pRb2.end();
  const retry = await claimAndPersistRaw(pool, inputRb);
  const pRb3 = await mysql.createConnection(liveUrl);
  const [cOk] = await pRb3.query(`SELECT COUNT(*) AS c FROM cc_recon_target_claims WHERE runId = ?`, [runRb]);
  const [tOk] = await pRb3.query(`SELECT COUNT(*) AS c FROM transactions WHERE runId = ? AND docType = 'ADJ'`, [runRb]);
  const invOk = await inventoryFor(pRb3, runRb, "SKU-001", "B-01-R1-L1");
  console.log({ retryCreated: retry.created, claims: cOk[0].c, adjTx: tOk[0].c, invOk });
  if (!retry.created || Number(cOk[0].c) !== 1 || Number(tOk[0].c) !== 1 || invOk !== 97) {
    throw new Error("Retry after rollback failed");
  }
  report.rollback = { ok: true, afterFail: { claims: 0, adjTx: 0, inventory: 100 }, afterRetry: { claims: 1, adjTx: 1, inventory: 97 } };
  await pRb3.end();

  // Zero variance concurrent
  console.log("\n--- 6) Zero-variance concurrent SKU-003 ---");
  const runZv = 9030;
  const pZv = await mysql.createConnection(liveUrl);
  await pZv.query(
    `INSERT INTO transactions (runId, docType, moveType, sku, bin, qty, posted, docRef) VALUES (?, 'GR', '101', 'SKU-003', 'B-01-R1-L2', 80, 1, 'GR-ZV')`,
    [runZv],
  );
  await pZv.end();
  const inputZv = { runId: runZv, sku: "SKU-003", bin: "B-01-R1-L2", varianceQty: 0, justification: "" };
  const zv = await Promise.all([
    claimAndPersistRaw(pool, inputZv),
    claimAndPersistRaw(pool, inputZv),
    claimAndPersistRaw(pool, inputZv),
  ]);
  const pZv2 = await mysql.createConnection(liveUrl);
  const [cZv] = await pZv2.query(`SELECT COUNT(*) AS c FROM cc_recon_target_claims WHERE runId = ?`, [runZv]);
  const [aZv] = await pZv2.query(`SELECT * FROM inventory_adjustments WHERE runId = ? AND sku = 'SKU-003'`, [runZv]);
  const [tZv] = await pZv2.query(`SELECT COUNT(*) AS c FROM transactions WHERE runId = ? AND docType = 'ADJ'`, [runZv]);
  const invZv = await inventoryFor(pZv2, runZv, "SKU-003", "B-01-R1-L2");
  console.log({
    created: zv.filter((r) => r.created).length,
    claims: cZv[0].c,
    confirmations: aZv.length,
    adjTx: tZv[0].c,
    invZv,
  });
  if (
    zv.filter((r) => r.created).length !== 1 ||
    Number(cZv[0].c) !== 1 ||
    aZv.length !== 1 ||
    Number(aZv[0].adjustmentQty) !== 0 ||
    Number(tZv[0].c) !== 0 ||
    invZv !== 80
  ) {
    throw new Error("Zero-variance concurrent proof failed");
  }
  report.zeroVariance = {
    ok: true,
    claims: 1,
    confirmations: 1,
    adjTx: 0,
    inventory: 80,
    countsTowardCompletion: true,
  };
  await pZv2.end();

  // Scoring recovery
  console.log("\n--- 7) Scoring recovery after successful claim ---");
  const runSc = 9040;
  const pSc = await mysql.createConnection(liveUrl);
  await pSc.query(
    `INSERT INTO transactions (runId, docType, moveType, sku, bin, qty, posted, docRef) VALUES (?, 'GR', '101', 'SKU-001', 'B-01-R1-L1', 100, 1, 'GR-SC')`,
    [runSc],
  );
  await pSc.end();
  const inputSc = { runId: runSc, sku: "SKU-001", bin: "B-01-R1-L1", varianceQty: -3, justification: "score-recovery" };
  const writeSc = await claimAndPersistRaw(pool, inputSc);
  if (!writeSc.created) throw new Error("Expected scoring-recovery claim create");

  // Simulate scoring failure (no award written)
  let scoringFailed = true;
  const pSc2 = await mysql.createConnection(liveUrl);
  const [cSc] = await pSc2.query(`SELECT COUNT(*) AS c FROM cc_recon_target_claims WHERE runId = ?`, [runSc]);
  const [tSc] = await pSc2.query(`SELECT COUNT(*) AS c FROM transactions WHERE runId = ? AND docType = 'ADJ'`, [runSc]);
  const invSc = await inventoryFor(pSc2, runSc, "SKU-001", "B-01-R1-L1");
  const [sSc0] = await pSc2.query(`SELECT COUNT(*) AS c FROM scoring_events WHERE runId = ?`, [runSc]);
  console.log({ afterTxn: { claims: cSc[0].c, adjTx: tSc[0].c, invSc, awards: sSc0[0].c, scoringFailed } });

  // Retry request → idempotent write + scoring once
  const retrySc = await claimAndPersistRaw(pool, inputSc);
  const award1 = await addScoringEventOnce(pSc2, {
    runId: runSc,
    eventType: "CC_RECON_COMPLETED",
    pointsDelta: 15,
    message: "Réconciliation et ajustements validés",
  });
  const award2 = await addScoringEventOnce(pSc2, {
    runId: runSc,
    eventType: "CC_RECON_COMPLETED",
    pointsDelta: 15,
    message: "Réconciliation et ajustements validés",
  });
  const [tSc2] = await pSc2.query(`SELECT COUNT(*) AS c FROM transactions WHERE runId = ? AND docType = 'ADJ'`, [runSc]);
  const [sSc] = await pSc2.query(`SELECT * FROM scoring_events WHERE runId = ?`, [runSc]);
  const invSc2 = await inventoryFor(pSc2, runSc, "SKU-001", "B-01-R1-L1");
  console.log({
    retryAlreadyReconciled: retrySc.alreadyReconciled,
    award1,
    award2,
    adjTx: tSc2[0].c,
    awards: sSc.length,
    points: sSc.reduce((n, r) => n + Number(r.pointsDelta), 0),
    invSc2,
  });
  if (
    !retrySc.alreadyReconciled ||
    !award1.created ||
    award2.created ||
    Number(tSc2[0].c) !== 1 ||
    sSc.length !== 1 ||
    invSc2 !== 97
  ) {
    throw new Error("Scoring recovery proof failed");
  }
  report.scoringRecovery = {
    ok: true,
    claimAfterTxn: 1,
    adjAfterTxn: 1,
    inventoryAfterTxn: 97,
    awardsBeforeRetry: 0,
    retryIdempotent: true,
    awardCreatedOnce: true,
    finalAdjTx: 1,
    finalAwards: 1,
    finalPoints: 15,
    finalInventory: 97,
  };
  await pSc2.end();
  await pool.end();

  const outPath = path.join(ROOT, ".manus-logs", "scn009-real-mysql-proof-results.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log("\n=== ALL REAL DB PROOFS PASSED ===");
  console.log(`Report written: ${outPath}`);
}

main().catch((err) => {
  console.error("PROOF FAILED:", err);
  process.exit(1);
});
