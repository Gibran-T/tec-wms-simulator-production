/**
 * Live validation — SCN-002, SCN-003, SCN-005 PDF-aligned student execution
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

async function finalize(runId) {
  await m("compliance.finalize", { runId });
  const st = await q("runs.state", { runId });
  const sc = await q("scoring.total", { runId });
  return { st, sc };
}

async function runSCN002() {
  const t = Date.now();
  const runId = (await m("runs.start", { scenarioId: 2, isDemo: false })).runId;
  let s = await q("runs.state", { runId });
  const ghost = s.unpostedTransactions?.find((x) => x.docRef === "GR-2025-001");
  if (!ghost || ghost.bin !== "REC-01") throw new Error(`Ghost GR bin expected REC-01, got ${ghost?.bin}`);
  await m("transactions.postExistingTransaction", { runId, txDocRef: "GR-2025-001" });
  await m("transactions.submitPUTAWAY_M1", { runId, sku: "SKU-001", fromBin: "REC-01", toBin: "B-01-R1-L1", qty: 100, docRef: `PW-${t}` });
  await m("transactions.submitSO", { runId, sku: "SKU-001", bin: "B-01-R1-L1", qty: 100, docRef: `SO-${t}` });
  await m("transactions.submitPICKING_M1", { runId, sku: "SKU-001", fromBin: "B-01-R1-L1", toBin: "EXP-01", qty: 100, docRef: `PK-${t}` });
  await m("transactions.submitGI", { runId, sku: "SKU-001", bin: "EXP-01", qty: 100, docRef: `GI-${t}` });
  await m("cycleCounts.submit", { runId, sku: "SKU-001", bin: "B-01-R1-L1", physicalQty: 0 });
  const { st, sc } = await finalize(runId);
  const ok = st.run?.status === "completed" && st.completedSteps?.includes("COMPLIANCE") && (sc?.total ?? 0) >= 60;
  return { ok, runId, score: sc?.total, steps: st.completedSteps };
}

async function runSCN003() {
  const t = Date.now();
  const runId = (await m("runs.start", { scenarioId: 3, isDemo: false })).runId;
  let s = await q("runs.state", { runId });
  if (s.nextStep?.code !== "PUTAWAY_M1") throw new Error(`Expected PUTAWAY first, got ${s.nextStep?.code}`);
  await m("transactions.submitPUTAWAY_M1", { runId, sku: "SKU-003", fromBin: "REC-01", toBin: "A-01-R1-L1", qty: 50, docRef: `PW0-${t}` });
  await m("transactions.submitSO", { runId, sku: "SKU-003", bin: "A-01-R1-L1", qty: 80, docRef: `SO-${t}` });
  await m("transactions.submitPO", { runId, sku: "SKU-003", bin: "REC-01", qty: 30, docRef: `PO2-${t}` });
  await m("transactions.submitGR", { runId, sku: "SKU-003", bin: "REC-01", qty: 30, docRef: `GR2-${t}` });
  await m("transactions.submitPUTAWAY_M1", { runId, sku: "SKU-003", fromBin: "REC-01", toBin: "A-01-R1-L1", qty: 30, docRef: `PW1-${t}` });
  await m("transactions.submitPICKING_M1", { runId, sku: "SKU-003", fromBin: "A-01-R1-L1", toBin: "EXP-01", qty: 80, docRef: `PK-${t}` });
  await m("transactions.submitGI", { runId, sku: "SKU-003", bin: "EXP-01", qty: 80, docRef: `GI-${t}` });
  await m("cycleCounts.submit", { runId, sku: "SKU-003", bin: "A-01-R1-L1", physicalQty: 0 });
  const { st, sc } = await finalize(runId);
  const ok = st.run?.status === "completed" && st.compliance?.compliant && !st.completedSteps?.includes("ADJ");
  return { ok, runId, score: sc?.total, steps: st.completedSteps };
}

async function runSCN005() {
  const t = Date.now();
  const runId = (await m("runs.start", { scenarioId: 5, isDemo: false })).runId;
  const ghost = (await q("runs.state", { runId })).unpostedTransactions?.find((x) => x.docRef === "GR-2025-004");
  if (!ghost || ghost.bin !== "REC-01") throw new Error(`Ghost GR-2025-004 expected REC-01, got ${ghost?.bin}`);
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
  const { st, sc } = await finalize(runId);
  const ok = st.run?.status === "completed" && st.completedSteps?.includes("CC") && st.completedSteps?.includes("ADJ") && st.completedSteps?.includes("COMPLIANCE");
  return { ok, runId, score: sc?.total, steps: st.completedSteps };
}

(async () => {
  await login();
  const results = { SCN002: false, SCN003: false, SCN005: false };
  try { results.SCN002 = (await runSCN002()).ok; } catch (e) { results.SCN002_ERR = e.message; }
  try { results.SCN003 = (await runSCN003()).ok; } catch (e) { results.SCN003_ERR = e.message; }
  try { results.SCN005 = (await runSCN005()).ok; } catch (e) { results.SCN005_ERR = e.message; }
  console.log(JSON.stringify({
    SCN002_PDF_ALIGNED: results.SCN002 ? "YES" : "NO",
    SCN003_PDF_ALIGNED: results.SCN003 ? "YES" : "NO",
    SCN005_PDF_ALIGNED: results.SCN005 ? "YES" : "NO",
    M1_PEDAGOGICALLY_READY: results.SCN002 && results.SCN003 && results.SCN005 ? "YES" : "NO",
    details: results,
  }, null, 2));
})();
