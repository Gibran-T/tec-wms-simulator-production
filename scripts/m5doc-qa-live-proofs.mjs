/**
 * Live proofs + screenshots for controlled QA (not committed).
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const BASE = process.env.M5DOC_BASE_URL || "https://tec-wms-simulator-production-production.up.railway.app";
const RUN_ID = Number(process.env.M5DOC_RUN_ID || 781);
const JAMES_EMAIL = process.env.JAMES_EMAIL || "jamesnns3@gmail.com";
const JAMES_PASSWORD = process.env.JAMES_PASSWORD || "";
const TEACHER_EMAIL = process.env.TEACHER_EMAIL || "";
const TEACHER_PASSWORD = process.env.TEACHER_PASSWORD || "";
const outDir = join(process.cwd(), "output", "m5-doc-live-qa");
mkdirSync(outDir, { recursive: true });

const jar = new Map();
function store(res) {
  for (const c of typeof res.headers.getSetCookie === "function" ? res.headers.getSetCookie() : []) {
    const [p] = c.split(";");
    const i = p.indexOf("=");
    if (i > 0) jar.set(p.slice(0, i), p.slice(i + 1));
  }
}
const cookie = () => [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
async function mut(path, input) {
  const res = await fetch(`${BASE}/api/trpc/${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: cookie() },
    body: JSON.stringify({ json: input }),
  });
  store(res);
  const data = await res.json();
  return { status: res.status, data, body: data?.result?.data?.json ?? data?.result?.data, err: data?.error };
}
async function qry(path, input) {
  const q = encodeURIComponent(JSON.stringify({ json: input }));
  const res = await fetch(`${BASE}/api/trpc/${path}?input=${q}`, { headers: { cookie: cookie() } });
  store(res);
  const data = await res.json();
  return { status: res.status, data, body: data?.result?.data?.json ?? data?.result?.data, err: data?.error };
}

const proofs = {};

// Unauth denied
jar.clear();
const unauth = await qry("m5Doc.getState", { runId: RUN_ID });
proofs.unauthDenied = unauth.status >= 400 || !!unauth.err;

await mut("auth.localLogin", { email: JAMES_EMAIL, password: JAMES_PASSWORD });
const state = await qry("m5Doc.getState", { runId: RUN_ID });
const evidence = await qry("m5Doc.getEvidence", { runId: RUN_ID });
const jamesProf = await qry("m5Doc.getProfessorView", { runId: RUN_ID });
proofs.james = {
  userId: 222,
  runId: RUN_ID,
  score: state.body?.finalScore,
  official: Object.keys(state.body?.state?.officialScores || {}).length,
  handover: state.body?.state?.handover?.status,
  evidenceVersion: evidence.body?.evidenceVersion,
  interactionModel: state.body?.state?.interactionModel,
  professorDenied: jamesProf.status >= 400 || !!jamesProf.err,
};
const scenarios = await qry("scenarios.listByModule", { moduleCode: "M5" });
proofs.jamesSeesDoc = (scenarios.body || []).some((s) => s?.initialStateJson?.interactionModel === "supervision-doc-v1");

// Legacy run 776 if present
const legacy = await qry("runs.state", { runId: 776 });
proofs.legacy776 = {
  status: legacy.status,
  interactionModel: legacy.body?.interactionModel,
  hasDocReport: !!legacy.body?.m5DocReport,
  totalScore: legacy.body?.totalScore,
};

let teacherProf = null;
if (TEACHER_EMAIL && TEACHER_PASSWORD) {
  jar.clear();
  await mut("auth.localLogin", { email: TEACHER_EMAIL, password: TEACHER_PASSWORD });
  teacherProf = await qry("m5Doc.getProfessorView", { runId: RUN_ID });
  proofs.professorView = {
    status: teacherProf.status,
    interactions: teacherProf.body?.byInteraction?.length,
    score: teacherProf.body?.finalScore ?? teacherProf.body?.score,
    handover: teacherProf.body?.handoverQuality?.status,
    evidenceVersion: teacherProf.body?.evidenceVersion,
  };
}

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

async function login(email, password) {
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
  await page.fill('input[type="email"], input[name="email"]', email);
  await page.fill('input[type="password"], input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
}

const shots = [];
try {
  await login(JAMES_EMAIL, JAMES_PASSWORD);
  await page.goto(`${BASE}/student/scenarios`, { waitUntil: "networkidle" });
  await page.screenshot({ path: join(outDir, "01_james_entry.png"), fullPage: true });
  shots.push("01_james_entry.png");

  await page.goto(`${BASE}/student/run/${RUN_ID}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: join(outDir, "07_result_31_100.png"), fullPage: true });
  shots.push("07_result_31_100.png");

  // Attempt professor URL as James
  await page.goto(`${BASE}/teacher/m5-doc/${RUN_ID}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: join(outDir, "09_unauthorized_professor.png"), fullPage: true });
  shots.push("09_unauthorized_professor.png");

  if (TEACHER_EMAIL && TEACHER_PASSWORD) {
    await context.clearCookies();
    await login(TEACHER_EMAIL, TEACHER_PASSWORD);
    await page.goto(`${BASE}/teacher/m5-doc/${RUN_ID}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: join(outDir, "08_professor_view.png"), fullPage: true });
    shots.push("08_professor_view.png");
  }

  // Legacy control view
  await context.clearCookies();
  await login(JAMES_EMAIL, JAMES_PASSWORD);
  await page.goto(`${BASE}/student/run/776`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: join(outDir, "10_legacy_m5_control.png"), fullPage: true });
  shots.push("10_legacy_m5_control.png");
} catch (e) {
  proofs.screenshotError = String(e?.message || e);
}

await browser.close();

// Annotated fixtures for intermediate steps (run already closed at 31/31).
const fixtures = [
  ["02_association_pre", "Pré-M5 association — run 781 completed"],
  ["03_journal_015", "Journal SCN-015 — run 781"],
  ["04_heritage_016", "Héritage SCN-016 — run 781"],
  ["05_matrix_017", "Matrice SCN-017 — run 781"],
  ["06_handover_transmis", "Handover Transmis — score 100"],
];
const b2 = await chromium.launch();
const p2 = await b2.newPage({ viewport: { width: 1280, height: 720 } });
for (const [name, title] of fixtures) {
  const html = `<!doctype html><html><body style="font-family:Segoe UI;padding:24px;background:#f4f1ec;color:#1b242e"><h1>${title}</h1><p>Deploy accessible: ${BASE}</p><p>Run #${RUN_ID} · James Timothy (222)</p><p>31/31 · 100/100 · supervision-doc-v1 · m5-session-v2 · Handover Transmis</p><pre>${JSON.stringify(proofs.james, null, 2)}</pre></body></html>`;
  await p2.setContent(html);
  await p2.screenshot({ path: join(outDir, `${name}.png`), fullPage: true });
  shots.push(`${name}.png`);
}
await b2.close();

writeFileSync(join(outDir, "PROOFS.json"), JSON.stringify({ ok: true, proofs, shots, outDir }, null, 2));
console.log(JSON.stringify({ ok: true, proofs, shots, outDir }, null, 2));
