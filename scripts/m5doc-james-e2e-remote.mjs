/**
 * Controlled QA: James Timothy full DOC path against deployed app.
 * Credentials via env only — never logged.
 */
import { buildCanonicalProgressionPayloads } from "../server/m5Doc/engine.ts";
import { buildCoherentHandoverFromState } from "../server/m5Doc/handoverGuard.ts";
import { createInitialM5DocState } from "../server/m5Doc/createInitialState.ts";
import { submitM5DocInteraction } from "../server/m5Doc/engine.ts";

const BASE = process.env.M5DOC_BASE_URL || "https://tec-wms-simulator-production-production.up.railway.app";
const JAMES_EMAIL = process.env.JAMES_EMAIL || "jamesnns3@gmail.com";
const JAMES_PASSWORD = process.env.JAMES_PASSWORD || "";
const OTHER_EMAIL = process.env.OTHER_STUDENT_EMAIL || "";
const OTHER_PASSWORD = process.env.OTHER_STUDENT_PASSWORD || "";
const TEACHER_EMAIL = process.env.TEACHER_EMAIL || "";
const TEACHER_PASSWORD = process.env.TEACHER_PASSWORD || "";

if (!JAMES_PASSWORD) {
  console.error("JAMES_PASSWORD required");
  process.exit(2);
}

const jar = new Map();
function storeCookies(res) {
  const raw = typeof res.headers.getSetCookie === "function" ? res.headers.getSetCookie() : [];
  for (const c of raw) {
    const [pair] = c.split(";");
    const eq = pair.indexOf("=");
    if (eq > 0) jar.set(pair.slice(0, eq), pair.slice(eq + 1));
  }
}
function cookieHeader() {
  return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}
function clearJar() {
  jar.clear();
}
function unwrap(result) {
  return result?.data?.result?.data?.json ?? result?.data?.result?.data ?? result?.data;
}

async function trpcMutation(path, input) {
  const res = await fetch(`${BASE}/api/trpc/${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: cookieHeader() },
    body: JSON.stringify({ json: input }),
  });
  storeCookies(res);
  const data = JSON.parse(await res.text());
  return { status: res.status, data, body: unwrap({ data }) };
}
async function trpcQuery(path, input) {
  const q = encodeURIComponent(JSON.stringify({ json: input }));
  const res = await fetch(`${BASE}/api/trpc/${path}?input=${q}`, {
    headers: { cookie: cookieHeader() },
  });
  storeCookies(res);
  const data = JSON.parse(await res.text());
  return { status: res.status, data, body: unwrap({ data }), error: data?.error };
}

const report = {
  base: BASE,
  jamesLogin: null,
  runId: null,
  progression: [],
  finalScore: null,
  evidenceVersion: null,
  interactionModel: null,
  handover: null,
  unauthorizedDenied: null,
  professorView: null,
  jamesProfessorDenied: null,
  legacyControl: null,
  errors: [],
};

try {
  const login = await trpcMutation("auth.localLogin", { email: JAMES_EMAIL, password: JAMES_PASSWORD });
  report.jamesLogin = { status: login.status, userId: login.body?.user?.id ?? login.body?.id };
  if (login.status >= 400) throw new Error("James login failed");

  const me = await trpcQuery("auth.me", {});
  const jamesId = me.body?.id ?? report.jamesLogin.userId;
  report.jamesLogin.userId = jamesId;

  const scenarios = await trpcQuery("scenarios.listByModule", { moduleCode: "M5" });
  const docScenarios = (scenarios.body ?? []).filter((s) =>
    String(s?.initialStateJson?.interactionModel || "").includes("supervision-doc"),
  );
  const scn015 = docScenarios.find((s) => s?.initialStateJson?.scnCode === "SCN-015-DOC") || docScenarios[0];
  if (!scn015) throw new Error("SCN-015-DOC not visible to James");

  const start = await trpcMutation("runs.start", { scenarioId: scn015.id, isDemo: false });
  const runId = start.body?.runId ?? start.body?.id ?? start.body?.run?.id;
  if (!runId) throw new Error("Failed to start DOC run");
  report.runId = runId;

  // Canonical helper covers PRE→017 (30). POST is submitted separately with coherent handover.
  let mirror = createInitialM5DocState(runId, "SCN-015-DOC");
  const steps = [
    ...buildCanonicalProgressionPayloads(),
    { id: "INT-POST-01", payload: null },
  ];
  for (const step of steps) {
    const mode = step.id.startsWith("INT-PRE") ? "FORMATIVE" : "OFFICIAL";
    const payload =
      step.id === "INT-POST-01" ? buildCoherentHandoverFromState(mirror) : step.payload;
    const res = await trpcMutation("m5Doc.submitInteraction", {
      runId,
      interactionId: step.id,
      payload,
      mode,
      idempotencyKey: `james-${runId}-${step.id}`,
    });
    const ok = res.status < 400 && res.body?.accepted !== false;
    report.progression.push({
      id: step.id,
      status: res.status,
      correct: res.body?.correct,
      finalScore: res.body?.finalScore,
      handover: res.body?.handoverStatus,
    });
    if (!ok) {
      report.errors.push({ step: step.id, error: res.data?.error ?? res.body });
      throw new Error(`submit failed ${step.id}`);
    }
    const local = submitM5DocInteraction({
      state: mirror,
      interactionId: step.id,
      payload,
      mode,
      actorRole: "student",
    });
    if (local.ok) mirror = local.state;
  }

  const state = await trpcQuery("m5Doc.getState", { runId });
  const evidence = await trpcQuery("m5Doc.getEvidence", { runId });
  report.finalScore = state.body?.finalScore;
  report.evidenceVersion = evidence.body?.evidenceVersion ?? evidence.body?.version;
  report.interactionModel = state.body?.state?.interactionModel;
  report.handover = state.body?.state?.handover?.status;
  report.completedOfficial = Object.keys(state.body?.state?.officialScores ?? {}).length;

  // James cannot open professor view
  const jamesProf = await trpcQuery("m5Doc.getProfessorView", { runId });
  report.jamesProfessorDenied = jamesProf.status >= 400 || !!jamesProf.data?.error;

  // Unauthorized student (optional)
  if (OTHER_EMAIL && OTHER_PASSWORD) {
    clearJar();
    await trpcMutation("auth.localLogin", { email: OTHER_EMAIL, password: OTHER_PASSWORD });
    const denied = await trpcMutation("m5Doc.submitInteraction", {
      runId,
      interactionId: "INT-PRE-01",
      payload: { s1: "DEMANDE", s2: "ECART", s3: "INTERVENTION", s4: "DECISION" },
      mode: "FORMATIVE",
    });
    const list = await trpcQuery("scenarios.listByModule", { moduleCode: "M5" });
    const otherSeesDoc = (list.body ?? []).some((s) =>
      String(s?.initialStateJson?.interactionModel || "").includes("supervision-doc"),
    );
    report.unauthorizedDenied = {
      apiForbidden: denied.status >= 400,
      scenariosHidden: !otherSeesDoc,
    };
  }

  // Professor view
  if (TEACHER_EMAIL && TEACHER_PASSWORD) {
    clearJar();
    await trpcMutation("auth.localLogin", { email: TEACHER_EMAIL, password: TEACHER_PASSWORD });
    const prof = await trpcQuery("m5Doc.getProfessorView", { runId });
    report.professorView = {
      status: prof.status,
      interactions: prof.body?.byInteraction?.length,
      score: prof.body?.finalScore ?? prof.body?.score,
      handover: prof.body?.handoverQuality?.status,
      evidenceVersion: prof.body?.evidenceVersion,
    };
  }

  // Legacy control — read-only open of James legacy M5 run if any (or any completed M5 ops-ledger)
  clearJar();
  await trpcMutation("auth.localLogin", { email: JAMES_EMAIL, password: JAMES_PASSWORD });
  const monitor = await trpcQuery("monitor.allRuns", {});
  const legacy = (monitor.body?.runs ?? monitor.body ?? []).find?.(
    (r) =>
      r?.interactionModel === "ops-ledger-v1" ||
      (r?.moduleId === 5 && r?.interactionModel !== "supervision-doc-v1"),
  );
  if (legacy?.runId || legacy?.id) {
    const lid = legacy.runId ?? legacy.id;
    const ls = await trpcQuery("runs.state", { runId: lid });
    report.legacyControl = {
      runId: lid,
      interactionModel: ls.body?.interactionModel,
      hasDocReport: !!ls.body?.m5DocReport,
      status: ls.status,
    };
  } else {
    report.legacyControl = { skipped: true, reason: "no legacy run visible in monitor payload" };
  }
} catch (e) {
  report.errors.push(String(e?.message || e));
}

const pass =
  report.runId &&
  report.completedOfficial === 31 &&
  report.finalScore === 100 &&
  (report.evidenceVersion === "m5-session-v2" || report.interactionModel === "supervision-doc-v1") &&
  report.handover === "Transmis" &&
  report.jamesProfessorDenied &&
  report.errors.length === 0;

console.log(JSON.stringify({ ok: pass, ...report }, null, 2));
process.exit(pass ? 0 : 4);
