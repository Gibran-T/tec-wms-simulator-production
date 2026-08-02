/**
 * QA — Évaluation intégrée 2 (clôture) as James Timothy.
 *
 * Modes:
 *  1) LOCAL (default): complete the canonical bank offline → report JSON
 *  2) REMOTE: login as James on deployed app, start/submit Eval2 with correct keys
 *
 * Usage:
 *   node scripts/qa-eval2-cloture-james.mjs
 *   JAMES_PASSWORD=... QA_EVAL2_REMOTE=1 node scripts/qa-eval2-cloture-james.mjs
 */
import fs from "node:fs";
import {
  EVAL_CLOTURE_ASSESSMENT_CODE,
  EVAL_CLOTURE_DOSSIER,
  EVAL_CLOTURE_DURATION_MINUTES,
  EVAL_CLOTURE_META,
  EVAL_CLOTURE_QUESTIONS,
  EVAL_CLOTURE_REPORT,
  buildClotureCompetencyBreakdown,
  interpretClotureReport,
  countCorrectPositionDistribution,
  uniqueLongestCorrectRatio,
} from "../shared/evalClotureQuestionBank.ts";
import { scoreByOptionId } from "../shared/assessmentCore.ts";

const BASE =
  process.env.SMOKE_BASE_URL ||
  process.env.M5DOC_BASE_URL ||
  "https://tec-wms-simulator-production-production.up.railway.app";
const JAMES_EMAIL = process.env.JAMES_EMAIL || "jamesnns3@gmail.com";
const JAMES_PASSWORD = process.env.JAMES_PASSWORD || "16183026";
const REMOTE = process.env.QA_EVAL2_REMOTE === "1";

const jar = new Map();
function storeCookies(res) {
  const raw =
    typeof res.headers.getSetCookie === "function" ? res.headers.getSetCookie() : [];
  for (const c of raw) {
    const [pair] = c.split(";");
    const eq = pair.indexOf("=");
    if (eq > 0) jar.set(pair.slice(0, eq), pair.slice(eq + 1));
  }
}
function cookieHeader() {
  return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}
function unwrap(result) {
  return (
    result?.data?.result?.data?.json ??
    result?.data?.result?.data ??
    result?.data
  );
}

async function trpcMutation(path, input) {
  const res = await fetch(`${BASE}/api/trpc/${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: cookieHeader(),
    },
    body: JSON.stringify({ json: input }),
  });
  storeCookies(res);
  const data = JSON.parse(await res.text());
  return { status: res.status, data, body: unwrap({ data }), error: data?.error };
}

async function trpcQuery(path, input) {
  const q = encodeURIComponent(JSON.stringify({ json: input ?? null }));
  const res = await fetch(`${BASE}/api/trpc/${path}?input=${q}`, {
    headers: { cookie: cookieHeader() },
  });
  storeCookies(res);
  const data = JSON.parse(await res.text());
  return {
    status: res.status,
    data,
    body: unwrap({ data }),
    error: data?.error,
  };
}

function runLocalPerfectQa() {
  const questions = EVAL_CLOTURE_QUESTIONS.map((q, i) => ({
    id: i + 1,
    correctOptionId: q.correctOptionId,
    points: q.points,
    competency: q.competency,
    annulled: false,
    code: q.code,
  }));
  const responses = questions.map((q) => ({
    questionId: q.id,
    selectedOptionId: q.correctOptionId,
  }));
  const scored = scoreByOptionId({ responses, questions });
  const byCode = responses.map((r, i) => ({
    code: EVAL_CLOTURE_QUESTIONS[i].code,
    correct: true,
  }));
  const axes = buildClotureCompetencyBreakdown(byCode);
  const interp = interpretClotureReport(scored.autoScore);

  return {
    mode: "local_perfect",
    actor: {
      name: "James Timothy (QA simulation)",
      email: JAMES_EMAIL,
      note: "Offline bank completion — all correct answers",
    },
    assessment: {
      code: EVAL_CLOTURE_ASSESSMENT_CODE,
      titleFr: EVAL_CLOTURE_META.titleFr,
      durationMinutes: EVAL_CLOTURE_DURATION_MINUTES,
      dossier: EVAL_CLOTURE_DOSSIER.code,
    },
    integrity: {
      questionCount: EVAL_CLOTURE_QUESTIONS.length,
      correctOptionDist: countCorrectPositionDistribution(EVAL_CLOTURE_QUESTIONS),
      uniqueLongestCorrectRatio: uniqueLongestCorrectRatio(EVAL_CLOTURE_QUESTIONS),
    },
    result: {
      score: scored.autoScore,
      passed: scored.passed,
      level: interp,
      competencyBreakdown: scored.competencyBreakdown,
      axes,
      strengthsFr: axes
        .filter((a) => a.pct >= 80)
        .map((a) => a.competency),
      gapsFr: axes
        .filter((a) => a.pct < 70)
        .map((a) => ({
          competency: a.competency,
          coach: EVAL_CLOTURE_REPORT.axisCoachFr[a.axisCode],
        })),
    },
  };
}

async function runRemoteJamesQa() {
  const report = {
    mode: "remote_james",
    base: BASE,
    steps: [],
    result: null,
    errors: [],
  };

  const login = await trpcMutation("auth.localLogin", {
    email: JAMES_EMAIL,
    password: JAMES_PASSWORD,
  });
  report.steps.push({
    step: "login",
    status: login.status,
    userId: login.body?.user?.id ?? login.body?.id,
  });
  if (login.status >= 400) {
    report.errors.push("James login failed");
    return report;
  }

  const hub = await trpcQuery("assessments.hub", null);
  const cards = Array.isArray(hub.body) ? hub.body : [];
  const eval2 = cards.find((c) => c.code === EVAL_CLOTURE_ASSESSMENT_CODE);
  report.steps.push({
    step: "hub",
    status: hub.status,
    eval2: eval2
      ? {
          id: eval2.id,
          status: eval2.status,
          releaseLevel: eval2.releaseLevel,
          canStart: eval2.canStart,
          inProgressAttemptId: eval2.inProgressAttemptId,
          questionCount: eval2.questionCount,
          durationMinutes: eval2.durationMinutes,
          titleFr: eval2.titleFr,
        }
      : null,
  });

  if (!eval2) {
    report.errors.push("EVAL_INTEGREE_2 not on hub");
    return report;
  }
  if (eval2.status !== "ready") {
    report.errors.push(`Eval2 status=${eval2.status} (deploy/seed pending)`);
    return report;
  }

  let attemptId = eval2.inProgressAttemptId;
  if (!attemptId) {
    const start = await trpcMutation("assessments.start", {
      assessmentId: eval2.id,
    });
    report.steps.push({
      step: "start",
      status: start.status,
      body: start.body,
      error: start.error,
    });
    attemptId = start.body?.attemptId;
    if (!attemptId) {
      report.errors.push("start failed — no attemptId");
      return report;
    }
  }

  const attempt = await trpcQuery("assessments.getAttempt", { attemptId });
  const questions = attempt.body?.questions ?? [];
  const dossier = attempt.body?.dossier;
  report.steps.push({
    step: "getAttempt",
    status: attempt.status,
    questionCount: questions.length,
    hasDossier: !!dossier,
    isProgrammeClosing: !!attempt.body?.isProgrammeClosing,
  });

  if (!questions.length) {
    report.errors.push("no questions on attempt");
    return report;
  }

  // Answer from bank by question code (stable option ids)
  const byCode = new Map(EVAL_CLOTURE_QUESTIONS.map((q) => [q.code, q]));
  for (const q of questions) {
    const bank = byCode.get(q.code);
    const optionId = bank?.correctOptionId ?? q.options?.[0]?.id;
    const save = await trpcMutation("assessments.autosave", {
      attemptId,
      questionId: q.id,
      selectedOptionId: optionId,
    });
    if (save.status >= 400) {
      report.errors.push(`autosave failed Q ${q.code}`);
    }
  }

  const submit = await trpcMutation("assessments.submit", { attemptId });
  report.steps.push({
    step: "submit",
    status: submit.status,
    body: submit.body,
    error: submit.error,
  });

  const after = await trpcQuery("assessments.getAttempt", { attemptId });
  const a = after.body?.attempt;
  const score = a?.finalScore ?? a?.autoScore ?? submit.body?.score ?? null;
  const interp =
    score != null ? interpretClotureReport(Number(score)) : null;

  report.result = {
    attemptId,
    score,
    passed: a?.passed ?? submit.body?.passed,
    competencyLevel: submit.body?.competencyLevel,
    competencyBreakdown: a?.competencyBreakdown ?? submit.body?.competencyBreakdown,
    interpretation: interp,
    practicalValidationStatus: a?.practicalValidationStatus,
    m4UnlockStatus: a?.m4UnlockStatus,
    dossierCode: dossier?.code ?? null,
  };

  return report;
}

const local = runLocalPerfectQa();
let remote = null;
if (REMOTE) {
  remote = await runRemoteJamesQa();
}

const out = {
  generatedAt: new Date().toISOString(),
  local,
  remote,
};

fs.mkdirSync(".tmp", { recursive: true });
fs.writeFileSync(
  ".tmp/qa-eval2-cloture-james.json",
  JSON.stringify(out, null, 2),
);

console.log("=== EVAL 2 CLÔTURE — James QA ===");
console.log(`Score (local perfect): ${local.result.score}/100 · passed=${local.result.passed}`);
console.log(`Level: ${local.result.level.levelCode}`);
console.log(`FR: ${local.result.level.meaningFr}`);
console.log("Axes:");
for (const ax of local.result.axes) {
  console.log(`  - ${ax.axisCode} ${ax.pct}% (${ax.earned}/${ax.possible})`);
}
if (remote) {
  console.log("--- REMOTE ---");
  console.log(JSON.stringify(remote.result ?? remote.errors, null, 2));
}
console.log("Wrote .tmp/qa-eval2-cloture-james.json");
