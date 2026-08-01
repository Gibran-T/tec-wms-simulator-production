import { buildCoherentHandoverFromState } from "../server/m5Doc/handoverGuard.ts";
import { createInitialM5DocState } from "../server/m5Doc/createInitialState.ts";
import { buildCanonicalProgressionPayloads, submitM5DocInteraction } from "../server/m5Doc/engine.ts";

const BASE = process.env.M5DOC_BASE_URL || "https://tec-wms-simulator-production-production.up.railway.app";
const RUN_ID = Number(process.env.M5DOC_RUN_ID || 781);
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
  return { status: res.status, data, body: data?.result?.data?.json ?? data?.result?.data };
}
async function qry(path, input) {
  const q = encodeURIComponent(JSON.stringify({ json: input }));
  const res = await fetch(`${BASE}/api/trpc/${path}?input=${q}`, { headers: { cookie: cookie() } });
  store(res);
  const data = await res.json();
  return { status: res.status, data, body: data?.result?.data?.json ?? data?.result?.data, err: data?.error };
}

const steps = buildCanonicalProgressionPayloads();
console.log(JSON.stringify({ stepsCount: steps.length, last: steps.map((s) => s.id).slice(-3) }));

await mut("auth.localLogin", {
  email: process.env.JAMES_EMAIL || "jamesnns3@gmail.com",
  password: process.env.JAMES_PASSWORD || "",
});
const before = await qry("m5Doc.getState", { runId: RUN_ID });
console.log(
  JSON.stringify({
    before: {
      score: before.body?.finalScore,
      expected: before.body?.expectedInteractionId,
      official: Object.keys(before.body?.state?.officialScores || {}).length,
      handover: before.body?.state?.handover?.status,
    },
  }),
);

let mirror = createInitialM5DocState(RUN_ID, "SCN-015-DOC");
for (const step of steps) {
  if (step.id === "INT-POST-01") break;
  const mode = step.id.startsWith("INT-PRE") ? "FORMATIVE" : "OFFICIAL";
  const local = submitM5DocInteraction({
    state: mirror,
    interactionId: step.id,
    payload: step.payload,
    mode,
    actorRole: "student",
  });
  if (local.ok) mirror = local.state;
}
const payload = buildCoherentHandoverFromState(mirror);
const res = await mut("m5Doc.submitInteraction", {
  runId: RUN_ID,
  interactionId: "INT-POST-01",
  payload,
  mode: "OFFICIAL",
  idempotencyKey: `james-${RUN_ID}-INT-POST-01-resume`,
});
const after = await qry("m5Doc.getState", { runId: RUN_ID });
const evidence = await qry("m5Doc.getEvidence", { runId: RUN_ID });
console.log(
  JSON.stringify(
    {
      postStatus: res.status,
      postBody: res.body,
      postErr: res.data?.error,
      after: {
        score: after.body?.finalScore,
        official: Object.keys(after.body?.state?.officialScores || {}).length,
        handover: after.body?.state?.handover?.status,
        evidenceVersion: evidence.body?.evidenceVersion,
        interactionModel: after.body?.state?.interactionModel,
      },
    },
    null,
    2,
  ),
);
process.exit(after.body?.finalScore === 100 && after.body?.state?.handover?.status === "Transmis" ? 0 : 4);
