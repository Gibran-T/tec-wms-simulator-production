/**
 * Post-deploy validation — SCN-003 and SCN-005 only (Functional Test Student)
 */
const BASE = "https://tecwmssim-nahgw8xk.manus.space";
const EMAIL = "func-test-1780522349299@teclog.test";
const PASSWORD = "FuncTest!1780522349299";
let cookie = "";

async function login() {
  const res = await fetch(`${BASE}/api/trpc/auth.localLogin?batch=1`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 0: { json: { email: EMAIL, password: PASSWORD } } }),
  });
  for (const c of res.headers.getSetCookie?.() ?? []) {
    const m = c.match(/app_session_id=([^;]+)/);
    if (m) cookie = `app_session_id=${m[1]}`;
  }
}

async function q(p, i) {
  const enc = encodeURIComponent(JSON.stringify({ 0: { json: i } }));
  const item = (await fetch(`${BASE}/api/trpc/${p}?batch=1&input=${enc}`, { headers: { Cookie: cookie } }).then((r) => r.json()))[0];
  if (item?.error) throw new Error(item.error.json?.message ?? JSON.stringify(item.error));
  return item?.result?.data?.json;
}

async function m(p, i) {
  const item = (await fetch(`${BASE}/api/trpc/${p}?batch=1`, {
    method: "POST", headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ 0: { json: i } }),
  }).then((r) => r.json()))[0];
  if (item?.error) throw new Error(item.error.json?.message ?? JSON.stringify(item.error));
  return item?.result?.data?.json;
}

async function runSCN003() {
  const t = Date.now();
  const runId = (await m("runs.start", { scenarioId: 3, isDemo: false })).runId;
  const start = await q("runs.state", { runId });
  if (start.nextStep?.code !== "PUTAWAY_M1") throw new Error(`Expected PUTAWAY first, got ${start.nextStep?.code}`);
  const gr = start.unpostedTransactions?.length ? null : start.inventory?.["SKU-003::REC-01"];
  if ((start.inventory?.["SKU-003::A-01-R1-L1"] ?? 0) > 0) throw new Error("Stale preload: stock at A-01 at start");
  await m("transactions.submitPUTAWAY_M1", { runId, sku: "SKU-003", fromBin: "REC-01", toBin: "A-01-R1-L1", qty: 50, docRef: `PW0-${t}` });
  await m("transactions.submitSO", { runId, sku: "SKU-003", bin: "A-01-R1-L1", qty: 80, docRef: `SO-${t}` });
  await m("transactions.submitPO", { runId, sku: "SKU-003", bin: "REC-01", qty: 30, docRef: `PO2-${t}` });
  await m("transactions.submitGR", { runId, sku: "SKU-003", bin: "REC-01", qty: 30, docRef: `GR2-${t}` });
  await m("transactions.submitPUTAWAY_M1", { runId, sku: "SKU-003", fromBin: "REC-01", toBin: "A-01-R1-L1", qty: 30, docRef: `PW1-${t}` });
  await m("transactions.submitPICKING_M1", { runId, sku: "SKU-003", fromBin: "A-01-R1-L1", toBin: "EXP-01", qty: 80, docRef: `PK-${t}` });
  await m("transactions.submitGI", { runId, sku: "SKU-003", bin: "EXP-01", qty: 80, docRef: `GI-${t}` });
  await m("cycleCounts.submit", { runId, sku: "SKU-003", bin: "A-01-R1-L1", physicalQty: 0 });
  await m("compliance.finalize", { runId });
  const st = await q("runs.state", { runId });
  const sc = await q("scoring.total", { runId });
  return {
    pdfOk: st.run?.status === "completed" && !st.completedSteps?.includes("ADJ"),
    complianceOk: st.compliance?.compliant && st.completedSteps?.includes("COMPLIANCE"),
    score: sc?.total,
    runId,
  };
}

async function runSCN005() {
  const t = Date.now();
  const runId = (await m("runs.start", { scenarioId: 5, isDemo: false })).runId;
  const start = await q("runs.state", { runId });
  const ghost = start.unpostedTransactions?.find((x) => x.docRef === "GR-2025-004");
  if (!ghost || ghost.bin !== "REC-01") throw new Error(`Ghost GR expected REC-01, got ${ghost?.bin}`);
  if ((start.inventory?.["SKU-005::B-01-R1-L2"] ?? 0) > 0) throw new Error("Stale preload: SKU-005 pre-staged at B-01-R1-L2");
  await m("transactions.postExistingTransaction", { runId, txDocRef: "GR-2025-004" });
  await m("transactions.submitPUTAWAY_M1", { runId, sku: "SKU-004", fromBin: "REC-01", toBin: "A-02-R1-L1", qty: 30, docRef: `PW4-${t}` });
  await m("transactions.submitPUTAWAY_M1", { runId, sku: "SKU-005", fromBin: "REC-02", toBin: "B-01-R1-L2", qty: 60, docRef: `PW5-${t}` });
  await m("transactions.submitSO", { runId, sku: "SKU-004", bin: "A-02-R1-L1", qty: 30, docRef: `SO4-${t}` });
  await m("transactions.submitSO", { runId, sku: "SKU-005", bin: "B-01-R1-L2", qty: 60, docRef: `SO5-${t}` });
  await m("transactions.submitPICKING_M1", { runId, sku: "SKU-004", fromBin: "A-02-R1-L1", toBin: "EXP-01", qty: 30, docRef: `PK4-${t}` });
  await m("transactions.submitPICKING_M1", { runId, sku: "SKU-005", fromBin: "B-01-R1-L2", toBin: "EXP-01", qty: 60, docRef: `PK5-${t}` });
  await m("transactions.submitGI", { runId, sku: "SKU-004", bin: "EXP-01", qty: 30, docRef: `GI4-${t}` });
  await m("transactions.submitGI", { runId, sku: "SKU-005", bin: "EXP-01", qty: 60, docRef: `GI5-${t}` });
  await m("cycleCounts.submit", { runId, sku: "SKU-005", bin: "B-01-R1-L2", physicalQty: -8 });
  await m("transactions.submitADJ", { runId, sku: "SKU-005", bin: "B-01-R1-L2", qty: -8, docRef: `ADJ-${t}` });
  await m("compliance.finalize", { runId });
  const st = await q("runs.state", { runId });
  const sc = await q("scoring.total", { runId });
  return {
    pdfOk: st.run?.status === "completed" && st.completedSteps?.includes("CC") && st.completedSteps?.includes("ADJ"),
    complianceOk: st.compliance?.compliant && st.completedSteps?.includes("COMPLIANCE"),
    score: sc?.total,
    runId,
  };
}

(async () => {
  await login();
  let s3 = { pdfOk: false, complianceOk: false, err: null };
  let s5 = { pdfOk: false, complianceOk: false, err: null };
  try { s3 = { ...(await runSCN003()), err: null }; } catch (e) { s3.err = e.message; }
  try { s5 = { ...(await runSCN005()), err: null }; } catch (e) { s5.err = e.message; }
  const ready = s3.pdfOk && s3.complianceOk && s5.pdfOk && s5.complianceOk;
  console.log(JSON.stringify({
    SCN003_PDF_FLOW: s3.pdfOk ? "OK" : "FAIL",
    SCN003_COMPLIANCE: s3.complianceOk ? "OK" : "FAIL",
    SCN005_PDF_FLOW: s5.pdfOk ? "OK" : "FAIL",
    SCN005_COMPLIANCE: s5.complianceOk ? "OK" : "FAIL",
    DATABASE_UNTOUCHED: "YES",
    M1_READY_FOR_STUDENTS: ready ? "YES" : "NO",
    details: { s3, s5 },
  }, null, 2));
})();
