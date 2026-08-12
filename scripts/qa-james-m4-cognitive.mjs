/**
 * James Timothy — M4 cognitive selector E2E (remote).
 * Requires deployed build with optionId support + JAMES_PASSWORD.
 *
 * Usage:
 *   JAMES_PASSWORD=*** node scripts/qa-james-m4-cognitive.mjs
 */
const BASE =
  process.env.BASE_URL ||
  process.env.M5DOC_BASE_URL ||
  "https://tec-wms-simulator-production-production.up.railway.app";
const JAMES_EMAIL = process.env.JAMES_EMAIL || "jamesnns3@gmail.com";
const JAMES_PASSWORD = process.env.JAMES_PASSWORD || "";
const ADMIN_EMAIL = process.env.TEC_ADMIN_EMAIL || process.env.ADMIN_EMAIL || "";
const ADMIN_PASSWORD = process.env.TEC_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || "";

if (!JAMES_PASSWORD) {
  console.error("JAMES_PASSWORD required");
  process.exit(2);
}

/** Stable option IDs from shared/m4CognitiveSelectors.ts (SCN-012). */
const OPT = {
  rotWrong: "scn012-rot-a",
  rotOk: "scn012-rot-b",
  svcOk: "scn012-svc-d",
  diagOk: "scn012-diag-c",
};

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
function errMsg(res) {
  return (
    res?.error?.json?.message ||
    res?.data?.error?.json?.message ||
    res?.data?.[0]?.error?.json?.message ||
    null
  );
}

async function trpcMutation(path, input) {
  const res = await fetch(`${BASE}/api/trpc/${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: cookieHeader(), "accept-language": "fr" },
    body: JSON.stringify({ json: input }),
  });
  storeCookies(res);
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  return { status: res.status, data, body: unwrap({ data }), error: data?.error };
}
async function trpcQuery(path, input) {
  const q = encodeURIComponent(JSON.stringify({ json: input ?? null }));
  const res = await fetch(`${BASE}/api/trpc/${path}?input=${q}`, {
    headers: { cookie: cookieHeader(), "accept-language": "fr" },
  });
  storeCookies(res);
  const data = JSON.parse(await res.text());
  return { status: res.status, data, body: unwrap({ data }), error: data?.error };
}

const report = {
  base: BASE,
  jamesLogin: null,
  scenarioId: null,
  runId: null,
  wrongAttempt: null,
  correctRotation: null,
  correctService: null,
  correctDiagnostic: null,
  compliance: null,
  score: null,
  cleanup: null,
  verdict: "FAIL",
  errors: [],
};

try {
  const login = await trpcMutation("auth.localLogin", { email: JAMES_EMAIL, password: JAMES_PASSWORD });
  report.jamesLogin = { status: login.status, ok: login.status < 400 };
  if (login.status >= 400) throw new Error(`James login failed: ${errMsg(login) || login.status}`);

  const scenarios = await trpcQuery("scenarios.list", {});
  const list = Array.isArray(scenarios.body) ? scenarios.body : scenarios.body?.scenarios ?? [];
  const scn012 =
    list.find((s) => String(s?.code || s?.scnCode || "").toUpperCase().includes("SCN-012")) ||
    list.find((s) => /012|rotation|KPI/i.test(String(s?.name || s?.nameFr || "")));
  if (!scn012?.id) throw new Error("SCN-012 not found for James");
  report.scenarioId = scn012.id;

  const start = await trpcMutation("runs.start", { scenarioId: scn012.id, isDemo: false });
  const runId = start.body?.runId ?? start.body?.id ?? start.body?.run?.id;
  if (!runId) throw new Error(`Failed to start run: ${JSON.stringify(start.data)?.slice(0, 400)}`);
  report.runId = runId;

  const dataStep = await trpcMutation("m4.submitKpiData", { runId });
  if (dataStep.status >= 400) throw new Error(`KPI_DATA failed: ${errMsg(dataStep)}`);

  const wrongRes = await trpcMutation("m4.submitKpiRotation", { runId, optionId: OPT.rotWrong });
  const wrongMessage = errMsg(wrongRes);
  report.wrongAttempt = {
    status: wrongRes.status,
    message: wrongMessage,
    rejected: wrongRes.status >= 400,
    hasSpecificWhy: typeof wrongMessage === "string" && /bande normale|liquidation/i.test(wrongMessage),
  };
  if (!report.wrongAttempt.rejected) {
    report.errors.push("Wrong cognitive option was accepted (expected BAD_REQUEST)");
  }
  if (!report.wrongAttempt.hasSpecificWhy) {
    report.errors.push("Wrong attempt missing option-specific red why");
  }

  const rotRes = await trpcMutation("m4.submitKpiRotation", { runId, optionId: OPT.rotOk });
  report.correctRotation = { status: rotRes.status, ok: rotRes.status < 400, message: errMsg(rotRes) };
  if (!report.correctRotation.ok) report.errors.push(`Rotation correct failed: ${report.correctRotation.message}`);

  const svcRes = await trpcMutation("m4.submitKpiService", { runId, optionId: OPT.svcOk });
  report.correctService = { status: svcRes.status, ok: svcRes.status < 400, message: errMsg(svcRes) };
  if (!report.correctService.ok) report.errors.push(`Service correct failed: ${report.correctService.message}`);

  const diagRes = await trpcMutation("m4.submitKpiDiagnostic", { runId, optionId: OPT.diagOk });
  report.correctDiagnostic = { status: diagRes.status, ok: diagRes.status < 400, message: errMsg(diagRes) };
  if (!report.correctDiagnostic.ok) report.errors.push(`Diagnostic correct failed: ${report.correctDiagnostic.message}`);

  const comp = await trpcMutation("m4.submitComplianceM4", { runId });
  report.compliance = { status: comp.status, ok: comp.status < 400, message: errMsg(comp) };
  if (!report.compliance.ok) report.errors.push(`Compliance failed: ${report.compliance.message}`);

  const detail = await trpcQuery("runs.get", { runId });
  report.score = detail.body?.score ?? detail.body?.run?.score ?? detail.body?.totalScore ?? null;

  if (ADMIN_EMAIL && ADMIN_PASSWORD) {
    clearJar();
    const adminLogin = await trpcMutation("auth.localLogin", {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    if (adminLogin.status < 400) {
      const prep = await trpcMutation("admin.prepareDemoReadiness", {
        email: JAMES_EMAIL,
        dryRun: false,
      });
      report.cleanup = { status: prep.status, body: prep.body };
    } else {
      report.cleanup = { skipped: true, reason: "admin login failed" };
    }
  } else {
    report.cleanup = {
      skipped: true,
      reason: "no admin credentials — abandon James in_progress manually if needed",
    };
  }

  const pathOk =
    report.wrongAttempt?.rejected &&
    report.wrongAttempt?.hasSpecificWhy &&
    report.correctRotation?.ok &&
    report.correctService?.ok &&
    report.correctDiagnostic?.ok &&
    report.compliance?.ok &&
    report.errors.length === 0;

  report.verdict = pathOk ? "PASS" : "FAIL";
} catch (e) {
  report.errors.push(String(e?.message || e));
  report.verdict = "FAIL";
}

console.log(JSON.stringify(report, null, 2));
process.exit(report.verdict === "PASS" ? 0 : 1);
