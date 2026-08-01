/**
 * M5 DOC supervision engine — server-authoritative evaluation.
 * Isolated from ops-ledger-v1 runtime.
 */

import {
  M5_DOC_INTERACTION_ORDER,
  getInteractionDef,
  getInteractionIndex,
  type M5DocInteractionId,
} from "../../shared/m5Doc/interactionsCatalog";
import type { M5DocErrorTag } from "../../shared/m5Doc/errorTags";
import type {
  DemandId,
  HandoverPayload,
  MatrixRow,
  M5DocMissionStateV1,
  ResourceId,
  SubmitMode,
  TreatmentMode,
} from "../../shared/m5Doc/types";
import { refreshJournal } from "./createInitialState";
import { evaluateHandover } from "./handoverGuard";
import { deepEqual, stableStringify } from "./utils";

export type SubmitInteractionInput = {
  state: M5DocMissionStateV1;
  interactionId: string;
  payload: unknown;
  mode: SubmitMode;
  actorRole: "student" | "teacher" | "admin";
  now?: string;
};

export type SubmitInteractionResult =
  | {
      ok: true;
      state: M5DocMissionStateV1;
      structuralOk: boolean;
      correct: boolean;
      combinationOk: boolean;
      tags: M5DocErrorTag[];
      points: number;
      maxPoints: number;
      feedbackCode: string;
      officialConsumed: boolean;
      alreadyScored?: boolean;
    }
  | {
      ok: false;
      code: M5DocErrorTag;
      message: string;
      state: M5DocMissionStateV1;
    };

function nowIso(now?: string): string {
  return now ?? new Date().toISOString();
}

function cloneState(state: M5DocMissionStateV1): M5DocMissionStateV1 {
  return JSON.parse(JSON.stringify(state)) as M5DocMissionStateV1;
}

function expectedInteractionId(state: M5DocMissionStateV1): M5DocInteractionId {
  const idx = Math.min(state.currentInteractionIndex, M5_DOC_INTERACTION_ORDER.length - 1);
  return M5_DOC_INTERACTION_ORDER[idx]!;
}

function applyCompetence(
  state: M5DocMissionStateV1,
  competences: string[],
  correct: boolean,
  maxPoints: number,
  points: number,
): void {
  const delta = correct ? 1 : points > 0 ? 0.4 : 0;
  for (const c of competences) {
    const key = c as keyof typeof state.competenceScores;
    if (key in state.competenceScores) {
      state.competenceScores[key] = Math.min(100, state.competenceScores[key] + delta * (maxPoints / 2));
    }
  }
}

function bumpCoherence(state: M5DocMissionStateV1, delta: number, tag?: M5DocErrorTag): void {
  state.chainCoherence.scoreDelta = Math.max(-10, Math.min(10, state.chainCoherence.scoreDelta + delta));
  if (tag && !state.chainCoherence.flags.includes(tag)) state.chainCoherence.flags.push(tag);
}

function advancePhase(state: M5DocMissionStateV1, nextIndex: number): void {
  state.currentInteractionIndex = nextIndex;
  if (nextIndex >= M5_DOC_INTERACTION_ORDER.length) {
    state.phase = "CLOSED";
    return;
  }
  const nextId = M5_DOC_INTERACTION_ORDER[nextIndex]!;
  if (nextId.startsWith("INT-PRE")) state.phase = "PRE";
  else if (nextId.startsWith("INT-015")) state.phase = "SCN015";
  else if (nextId.startsWith("INT-016")) state.phase = "SCN016";
  else if (nextId.startsWith("INT-017")) state.phase = "SCN017";
  else state.phase = "POST";
}

function evalSimpleCanonical(payload: unknown, canonical: unknown): boolean {
  return deepEqual(payload, canonical);
}

function eval01606(payload: unknown): { correct: boolean; tags: M5DocErrorTag[] } {
  if (!payload || typeof payload !== "object") {
    return { correct: false, tags: ["PAYLOAD_INVALIDE"] };
  }
  const p = payload as Record<string, unknown>;
  const tags: M5DocErrorTag[] = [];
  const ok =
    p.posture === "SOUS_SURVEILLANCE" &&
    p.keepOwner === "technicienFrigo" &&
    Number(p.nextControlMinutes) === 15 &&
    p.requireProofBeforeClose === true &&
    Array.isArray(p.proofBand) &&
    Number((p.proofBand as number[])[0]) === 2 &&
    Number((p.proofBand as number[])[1]) === 4;

  if (p.posture === "REAFFECTER") tags.push("REAFFECTATION_SANS_MOTIF");
  if (p.posture === "ESCALADER") tags.push("ESCALADE_INJUSTIFIEE");
  if (p.posture === "SOUS_SURVEILLANCE" && (!p.keepOwner || !p.nextControlMinutes)) {
    tags.push("SURVEILLANCE_INVALIDE");
  }
  if (!ok && tags.length === 0) tags.push("COMBINAISON_INCORRECTE");
  return { correct: ok, tags };
}

function parseMatrix(payload: unknown): { rows?: MatrixRow[]; error?: M5DocErrorTag } {
  if (!Array.isArray(payload) || payload.length !== 3) {
    return { error: "MATRIX_PAYLOAD_INVALIDE" };
  }
  const demandIds = new Set<string>();
  const rows: MatrixRow[] = [];
  const validModes: TreatmentMode[] = ["TRAITER", "SURVEILLER", "REAFFECTER", "ESCALADER"];
  const validResources: ResourceId[] = [
    "chefQuai",
    "equipeQuai",
    "technicienFrigo",
    "superviseur",
    "directeurSite",
    "chefQuai+equipeQuai",
  ];
  const validDemands: DemandId[] = ["D-117", "D-143", "D-144"];

  for (const row of payload) {
    if (!row || typeof row !== "object") return { error: "MATRIX_PAYLOAD_INVALIDE" };
    const r = row as Record<string, unknown>;
    const demandId = r.demandId as DemandId;
    const resource = r.resource as ResourceId;
    const mode = r.mode as TreatmentMode;
    if (!validDemands.includes(demandId) || demandIds.has(demandId)) {
      return { error: "MATRIX_PAYLOAD_INVALIDE" };
    }
    if (!validResources.includes(resource) || !validModes.includes(mode)) {
      return { error: "MATRIX_PAYLOAD_INVALIDE" };
    }
    demandIds.add(demandId);
    rows.push({ demandId, resource, mode });
  }
  if (demandIds.size !== 3) return { error: "MATRIX_PAYLOAD_INVALIDE" };
  return { rows };
}

function evalMatrix(rows: MatrixRow[]): { correct: boolean; tags: M5DocErrorTag[] } {
  const byId = Object.fromEntries(rows.map((r) => [r.demandId, r])) as Record<DemandId, MatrixRow>;
  const canonicalOk =
    byId["D-117"]?.resource === "chefQuai" &&
    byId["D-117"]?.mode === "TRAITER" &&
    byId["D-143"]?.resource === "chefQuai+equipeQuai" &&
    byId["D-143"]?.mode === "REAFFECTER" &&
    byId["D-144"]?.resource === "technicienFrigo" &&
    byId["D-144"]?.mode === "SURVEILLER";

  const tags: M5DocErrorTag[] = [];
  if (!canonicalOk) tags.push("MATRIX_INCOHERENTE");
  if (byId["D-117"]?.mode === "SURVEILLER" || byId["D-143"]?.mode === "SURVEILLER") {
    tags.push("SURVEILLANCE_INVALIDE");
  }
  if (rows.some((r) => r.mode === "ESCALADER")) tags.push("ESCALADE_INJUSTIFIEE");
  return { correct: canonicalOk, tags: canonicalOk ? [] : tags };
}

function applyStateEffects(
  state: M5DocMissionStateV1,
  interactionId: M5DocInteractionId,
  payload: unknown,
  correct: boolean,
  at: string,
): void {
  const d143 = state.portfolio.demands["D-143"];
  const d117 = state.portfolio.demands["D-117"];
  const d144 = state.portfolio.demands["D-144"];

  switch (interactionId) {
    case "INT-015-01":
      if (payload === "D-143") d143.status = "Ouverte";
      break;
    case "INT-015-02":
      if (typeof payload === "string") d143.priority = payload as typeof d143.priority;
      break;
    case "INT-015-03":
      if (payload === "equipeQuai") {
        d143.owner = "equipeQuai";
        d143.status = "Assignee";
      } else if (payload === "superviseur") {
        bumpCoherence(state, -1, "AUTO_EXECUTION");
      }
      break;
    case "INT-015-04":
      if (payload === "completer_8") d143.expectedAction = "completer_8";
      break;
    case "INT-015-05":
      if (payload === "c_0525") {
        d143.control = { id: "c_0525", label: "05:25 palettes + chef quai", dueLabel: "05:25" };
      }
      break;
    case "INT-015-06":
      if (payload === "emit_oi143") {
        state.portfolio.interventions["OI-143"] = {
          id: "OI-143",
          demandId: "D-143",
          status: "Emis",
        };
        d143.status = "En cours";
      }
      break;
    case "INT-015-07":
      if (payload === "partial_6_8") {
        const oi = state.portfolio.interventions["OI-143"];
        if (oi) {
          oi.reportedResult = "PARTIAL_6_8";
          oi.status = "Verifie KO";
        }
        d143.status = "En attente de preuve";
        d143.proofProvided = { id: "partial_6_8", verified: false, at };
      }
      break;
    case "INT-015-08":
      if (payload === "close") {
        bumpCoherence(state, -4, "CLOTURE_PREMATUREE");
        // refuse status change to Cloturee
      } else if (payload === "keep_open") {
        d143.status = "En attente de preuve";
        bumpCoherence(state, 1);
      }
      break;
    case "INT-015-09":
      if (payload === "proof_8_8") {
        d143.proofRequired = { id: "proof_8_8", label: "8/8 + confirmation chef horodatee" };
      }
      break;
    case "INT-016-01":
      if (payload === "ecart_temp") {
        state.portfolio.gaps["E-144"] = {
          id: "E-144",
          linkedDemandId: "D-144",
          status: "Constate",
          owner: null,
        };
        d144.status = "Ouverte";
      } else if (payload === "ignore") {
        bumpCoherence(state, -3, "REACTION_TROP_FAIBLE");
      }
      break;
    case "INT-016-02":
      if (payload === "FICHE_ECART" && state.portfolio.gaps["E-144"]) {
        // documented
      } else if (payload !== "FICHE_ECART") {
        bumpCoherence(state, -1, "DOC_INADEQUAT");
      }
      break;
    case "INT-016-03":
      if (state.portfolio.gaps["E-144"] && payload === "integrite_froid") {
        state.portfolio.gaps["E-144"].risk = "integrite_froid";
        d144.priority = "P1";
      }
      break;
    case "INT-016-04":
      if (state.portfolio.gaps["E-144"] && payload === "stabiliser") {
        state.portfolio.gaps["E-144"].controlAction = "stabiliser";
        state.portfolio.gaps["E-144"].status = "En traitement";
      }
      break;
    case "INT-016-05":
      if (payload === "technicienFrigo" && state.portfolio.gaps["E-144"]) {
        state.portfolio.gaps["E-144"].owner = "technicienFrigo";
        d144.owner = "technicienFrigo";
      } else if (payload === "none") {
        bumpCoherence(state, -2, "RESPONSABLE_ABSENT");
      }
      break;
    case "INT-016-06":
      if (correct && state.portfolio.gaps["E-144"]) {
        const g = state.portfolio.gaps["E-144"];
        g.posture = "SOUS_SURVEILLANCE";
        g.status = "Sous surveillance";
        g.owner = "technicienFrigo";
        g.nextControlMinutes = 15;
        g.proofRequired = { id: "band_2_4", label: "Re-lecture 2-4 C + confirmation" };
        d144.status = "Sous surveillance";
        d144.mode = "SURVEILLER";
        d144.owner = "technicienFrigo";
        bumpCoherence(state, 2);
      }
      break;
    case "INT-016-07":
      if (state.portfolio.gaps["E-144"] && payload === "band_ok") {
        state.portfolio.gaps["E-144"].expectedResult = "band_ok";
      }
      break;
    case "INT-016-08":
      if (state.portfolio.gaps["E-144"] && payload === "reread_ok") {
        state.portfolio.gaps["E-144"].proofRequired = {
          id: "reread_ok",
          label: "Re-lecture bande + confirmation technicien",
        };
      }
      break;
    case "INT-016-09":
      if (payload === "conforme" && state.portfolio.gaps["E-144"]) {
        state.portfolio.gaps["E-144"].status = "Resolu";
        state.portfolio.gaps["E-144"].proofProvided = {
          id: "temp_3_1",
          verified: true,
          at,
        };
        // Keep D-144 under watch until departure — do not close demand
        d144.status = "Sous surveillance";
        bumpCoherence(state, 2);
      }
      break;
    case "INT-016-10":
      // Discriminative only — never retroactively mutate 016-09 nominal status
      if (payload === "close_alarm_off") {
        bumpCoherence(state, -2, "CLOTURE_SANS_PREUVE");
      } else if (payload === "keep_open_insufficient") {
        bumpCoherence(state, 1);
      }
      break;
    case "INT-017-01":
      if (Array.isArray(payload)) {
        state.arbitration = { ...(state.arbitration ?? {}), ranking: payload as DemandId[] };
      }
      break;
    case "INT-017-02":
      if (Array.isArray(payload) && correct) {
        const rows = payload as MatrixRow[];
        state.arbitration = {
          ...(state.arbitration ?? {}),
          matrix: rows,
          matrixResolved: true,
        };
        for (const row of rows) {
          const d = state.portfolio.demands[row.demandId];
          d.mode = row.mode;
          d.owner = row.resource;
          if (row.mode === "REAFFECTER") {
            d.status = "Reaffectee";
            d.reassignment = { to: row.resource, at };
          } else if (row.mode === "TRAITER") {
            d.status = "En cours";
          } else if (row.mode === "SURVEILLER") {
            d.status = "Sous surveillance";
          } else if (row.mode === "ESCALADER") {
            d.status = "Escaladee";
            d.escalation = { level: "site", at };
          }
        }
        bumpCoherence(state, 2);
      } else if (Array.isArray(payload) && !correct) {
        state.arbitration = {
          ...(state.arbitration ?? {}),
          matrix: payload as MatrixRow[],
          matrixResolved: false,
        };
        bumpCoherence(state, -2, "MATRIX_INCOHERENTE");
      }
      break;
    case "INT-017-03":
      if (typeof payload === "string") {
        state.arbitration = { ...(state.arbitration ?? {}), compromiseId: payload };
      }
      break;
    case "INT-017-04":
      if (payload && typeof payload === "object") {
        state.arbitration = {
          ...(state.arbitration ?? {}),
          controls: payload as Partial<Record<DemandId, string>>,
        };
      }
      break;
    case "INT-017-05":
      if (Array.isArray(payload)) {
        const risks = payload as string[];
        state.arbitration = { ...(state.arbitration ?? {}), residualRiskIds: risks };
        if (risks.includes("aucun") || risks.length === 0) {
          bumpCoherence(state, -2, "RISQUE_RESIDUEL_IGNORE");
        } else if (correct) {
          bumpCoherence(state, 1);
        }
      }
      break;
    case "INT-POST-01":
      // handled in handover path
      break;
    default:
      break;
  }
  refreshJournal(state);
}

function evaluatePayload(
  state: M5DocMissionStateV1,
  interactionId: M5DocInteractionId,
  payload: unknown,
): {
  structuralOk: boolean;
  correct: boolean;
  combinationOk: boolean;
  tags: M5DocErrorTag[];
  rejectCode?: M5DocErrorTag;
  handoverResult?: ReturnType<typeof evaluateHandover>;
} {
  const def = getInteractionDef(interactionId)!;

  if (interactionId === "INT-016-06") {
    if (!payload || typeof payload !== "object") {
      return {
        structuralOk: false,
        correct: false,
        combinationOk: false,
        tags: ["PAYLOAD_INVALIDE"],
        rejectCode: "PAYLOAD_INVALIDE",
      };
    }
    const { correct, tags } = eval01606(payload);
    return { structuralOk: true, correct, combinationOk: correct, tags };
  }

  if (interactionId === "INT-017-02") {
    const parsed = parseMatrix(payload);
    if (parsed.error || !parsed.rows) {
      return {
        structuralOk: false,
        correct: false,
        combinationOk: false,
        tags: [parsed.error ?? "MATRIX_PAYLOAD_INVALIDE"],
        rejectCode: parsed.error ?? "MATRIX_PAYLOAD_INVALIDE",
      };
    }
    const { correct, tags } = evalMatrix(parsed.rows);
    return { structuralOk: true, correct, combinationOk: correct, tags };
  }

  if (interactionId === "INT-POST-01") {
    if (!payload || typeof payload !== "object") {
      return {
        structuralOk: false,
        correct: false,
        combinationOk: false,
        tags: ["HANDOVER_PAYLOAD_INVALIDE"],
        rejectCode: "HANDOVER_PAYLOAD_INVALIDE",
      };
    }
    const hr = evaluateHandover(state, payload as HandoverPayload);
    if (!hr.structuralOk) {
      return {
        structuralOk: false,
        correct: false,
        combinationOk: false,
        tags: hr.tags,
        rejectCode: "HANDOVER_PAYLOAD_INVALIDE",
      };
    }
    return {
      structuralOk: true,
      correct: hr.consistent,
      combinationOk: hr.consistent,
      tags: hr.tags,
      handoverResult: hr,
    };
  }

  if (interactionId === "INT-017-05") {
    if (!Array.isArray(payload)) {
      return {
        structuralOk: false,
        correct: false,
        combinationOk: false,
        tags: ["PAYLOAD_INVALIDE"],
        rejectCode: "PAYLOAD_INVALIDE",
      };
    }
    const set = new Set(payload as string[]);
    const need = ["retard_143", "conformite_117", "derive_144"];
    const correct = need.every((k) => set.has(k)) && !set.has("aucun");
    return {
      structuralOk: true,
      correct,
      combinationOk: correct,
      tags: correct ? [] : set.has("aucun") ? ["RISQUE_RESIDUEL_IGNORE"] : ["COMBINAISON_INCORRECTE"],
    };
  }

  if (interactionId === "INT-017-01") {
    if (!Array.isArray(payload) || payload.length !== 3) {
      return {
        structuralOk: false,
        correct: false,
        combinationOk: false,
        tags: ["PAYLOAD_INVALIDE"],
        rejectCode: "PAYLOAD_INVALIDE",
      };
    }
    const correct = deepEqual(payload, def.canonical);
    return { structuralOk: true, correct, combinationOk: correct, tags: correct ? [] : ["COMBINAISON_INCORRECTE"] };
  }

  if (interactionId === "INT-015-08" && payload === "close") {
    return {
      structuralOk: true,
      correct: false,
      combinationOk: false,
      tags: ["CLOTURE_PREMATUREE", "CLOTURE_SANS_PREUVE"],
    };
  }

  // Generic option / association
  if (payload === undefined || payload === null) {
    return {
      structuralOk: false,
      correct: false,
      combinationOk: false,
      tags: ["PAYLOAD_INVALIDE"],
      rejectCode: "PAYLOAD_INVALIDE",
    };
  }

  const correct = evalSimpleCanonical(payload, def.canonical);
  return {
    structuralOk: true,
    correct,
    combinationOk: correct,
    tags: correct ? [] : ["COMBINAISON_INCORRECTE"],
  };
}

export function submitM5DocInteraction(input: SubmitInteractionInput): SubmitInteractionResult {
  const state = cloneState(input.state);
  const at = nowIso(input.now);
  const def = getInteractionDef(input.interactionId);

  if (!def) {
    return { ok: false, code: "PAYLOAD_INVALIDE", message: "Unknown interaction", state: input.state };
  }

  if (input.mode === "REVIEW") {
    if (input.actorRole !== "teacher" && input.actorRole !== "admin") {
      return { ok: false, code: "REVIEW_ONLY", message: "Review reserved to teacher/QA", state: input.state };
    }
    state.reviewNotes.push({
      at,
      interactionId: input.interactionId,
      note: stableStringify(input.payload),
      byRole: input.actorRole,
    });
    return {
      ok: true,
      state,
      structuralOk: true,
      correct: false,
      combinationOk: false,
      tags: [],
      points: 0,
      maxPoints: def.maxPoints,
      feedbackCode: "REVIEW_NOOP",
      officialConsumed: false,
    };
  }

  if (def.scoringZone === "PRE") {
    if (input.mode !== "FORMATIVE" && input.mode !== "OFFICIAL") {
      return { ok: false, code: "PAYLOAD_INVALIDE", message: "Invalid mode for PRE", state: input.state };
    }
  } else if (input.mode === "FORMATIVE") {
    return {
      ok: false,
      code: "PAYLOAD_INVALIDE",
      message: "FORMATIVE only allowed in Pré-M5",
      state: input.state,
    };
  }

  // Score-once before order guard so a second official never rewrites history.
  if (def.scoringZone !== "PRE" && input.mode === "OFFICIAL" && state.officialScores[input.interactionId]) {
    return {
      ok: false,
      code: "SCORE_ONCE_LOCKED",
      message: "Official attempt already consumed",
      state: input.state,
    };
  }

  const expected = expectedInteractionId(state);
  if (input.interactionId !== expected) {
    // Allow formative retry on already-passed PRE only
    const idx = getInteractionIndex(input.interactionId);
    if (!(input.mode === "FORMATIVE" && def.scoringZone === "PRE" && idx >= 0 && idx < state.currentInteractionIndex)) {
      return {
        ok: false,
        code: "ORDRE_INTERACTION",
        message: `Expected ${expected}`,
        state: input.state,
      };
    }
  }

  const evaluation = evaluatePayload(state, def.id, input.payload);
  if (!evaluation.structuralOk) {
    return {
      ok: false,
      code: evaluation.rejectCode ?? "PAYLOAD_INVALIDE",
      message: "Structural rejection — no score, no state change",
      state: input.state,
    };
  }

  const points = evaluation.correct ? def.maxPoints : 0;
  const feedbackCode = evaluation.correct ? `${def.id}_OK` : `${def.id}_KO`;

  // Append-only timeline
  const officialConsumed = def.scoringZone === "PRE" ? input.mode === "OFFICIAL" : true;
  // PRE: formative attempts don't write officialScores; they update formativeLatest
  if (def.scoringZone === "PRE" && input.mode === "FORMATIVE") {
    state.formativeLatest[def.id] = input.payload;
    state.timeline.push({
      at,
      interactionId: def.id,
      mode: "FORMATIVE",
      payload: input.payload,
      correct: evaluation.correct,
      combinationOk: evaluation.combinationOk,
      tags: evaluation.tags,
      points: 0,
      feedbackCode,
      structuralOk: true,
      officialConsumed: false,
    });
    // Structurally valid formative advances when on the expected interaction and correct enough to progress?
    // Design: last structurally valid formative feeds state; progression on PRE requires a successful formative/official.
    if (input.interactionId === expected && evaluation.correct) {
      applyStateEffects(state, def.id, input.payload, true, at);
      applyCompetence(state, def.competences, true, def.maxPoints, points);
      // Also record as official score from last valid formative success for zone PRE weighting
      state.officialScores[def.id] = {
        interactionId: def.id,
        points: def.maxPoints,
        maxPoints: def.maxPoints,
        correct: true,
        combinationOk: true,
        tags: [],
        submittedAt: at,
        payload: input.payload,
      };
      advancePhase(state, state.currentInteractionIndex + 1);
    }
    refreshJournal(state);
    return {
      ok: true,
      state,
      structuralOk: true,
      correct: evaluation.correct,
      combinationOk: evaluation.combinationOk,
      tags: evaluation.tags,
      points: evaluation.correct ? def.maxPoints : 0,
      maxPoints: def.maxPoints,
      feedbackCode,
      officialConsumed: false,
    };
  }

  // OFFICIAL path (and PRE official if used)
  state.timeline.push({
    at,
    interactionId: def.id,
    mode: "OFFICIAL",
    payload: input.payload,
    correct: evaluation.correct,
    combinationOk: evaluation.combinationOk,
    tags: evaluation.tags,
    points,
    feedbackCode,
    structuralOk: true,
    officialConsumed: true,
  });

  state.officialScores[def.id] = {
    interactionId: def.id,
    points,
    maxPoints: def.maxPoints,
    correct: evaluation.correct,
    combinationOk: evaluation.combinationOk,
    tags: evaluation.tags,
    submittedAt: at,
    payload: input.payload,
  };

  if (def.id === "INT-POST-01" && evaluation.handoverResult) {
    if (evaluation.handoverResult.consistent) {
      state.handover = {
        status: "Transmis",
        payload: input.payload as HandoverPayload,
        contradictions: [],
      };
      bumpCoherence(state, 2);
    } else {
      state.handover = {
        status: "Brouillon",
        payload: input.payload as HandoverPayload,
        contradictions: evaluation.handoverResult.tags,
      };
      bumpCoherence(state, -3, "HANDOVER_CONTRADICTOIRE");
    }
  } else {
    applyStateEffects(state, def.id, input.payload, evaluation.correct, at);
  }

  applyCompetence(state, def.competences, evaluation.correct, def.maxPoints, points);

  if (input.interactionId === expected) {
    advancePhase(state, state.currentInteractionIndex + 1);
  }

  refreshJournal(state);

  return {
    ok: true,
    state,
    structuralOk: true,
    correct: evaluation.correct,
    combinationOk: evaluation.combinationOk,
    tags: evaluation.tags,
    points,
    maxPoints: def.maxPoints,
    feedbackCode,
    officialConsumed,
  };
}

export function buildCanonicalProgressionPayloads(): Array<{ id: M5DocInteractionId; payload: unknown }> {
  return [
    {
      id: "INT-PRE-01",
      payload: { s1: "DEMANDE", s2: "ECART", s3: "INTERVENTION", s4: "DECISION" },
    },
    {
      id: "INT-PRE-02",
      payload: {
        DEMANDE: "FICHE_DEMANDE",
        ECART: "FICHE_ECART",
        INTERVENTION: "ORDRE_INTERVENTION",
        TRANSMISSION: "HANDOVER",
      },
    },
    { id: "INT-PRE-03", payload: { froid: "P1", departClient: "P2", cour: "P3" } },
    { id: "INT-PRE-04", payload: "scelle" },
    { id: "INT-PRE-05", payload: "portes_143_144" },
    { id: "INT-PRE-06", payload: "equipeQuai" },
    { id: "INT-015-01", payload: "D-143" },
    { id: "INT-015-02", payload: "P2" },
    { id: "INT-015-03", payload: "equipeQuai" },
    { id: "INT-015-04", payload: "completer_8" },
    { id: "INT-015-05", payload: "c_0525" },
    { id: "INT-015-06", payload: "emit_oi143" },
    { id: "INT-015-07", payload: "partial_6_8" },
    { id: "INT-015-08", payload: "keep_open" },
    { id: "INT-015-09", payload: "proof_8_8" },
    { id: "INT-016-01", payload: "ecart_temp" },
    { id: "INT-016-02", payload: "FICHE_ECART" },
    { id: "INT-016-03", payload: "integrite_froid" },
    { id: "INT-016-04", payload: "stabiliser" },
    { id: "INT-016-05", payload: "technicienFrigo" },
    {
      id: "INT-016-06",
      payload: {
        posture: "SOUS_SURVEILLANCE",
        keepOwner: "technicienFrigo",
        nextControlMinutes: 15,
        requireProofBeforeClose: true,
        proofBand: [2, 4],
      },
    },
    { id: "INT-016-07", payload: "band_ok" },
    { id: "INT-016-08", payload: "reread_ok" },
    { id: "INT-016-09", payload: "conforme" },
    { id: "INT-016-10", payload: "keep_open_insufficient" },
    { id: "INT-017-01", payload: ["D-117", "D-143", "D-144"] },
    {
      id: "INT-017-02",
      payload: [
        { demandId: "D-117", resource: "chefQuai", mode: "TRAITER" },
        { demandId: "D-143", resource: "chefQuai+equipeQuai", mode: "REAFFECTER" },
        { demandId: "D-144", resource: "technicienFrigo", mode: "SURVEILLER" },
      ],
    },
    { id: "INT-017-03", payload: "micro_retard_143" },
    {
      id: "INT-017-04",
      payload: { "D-117": "preuve_scelle", "D-143": "palettes_zero", "D-144": "relecture_temp" },
    },
    { id: "INT-017-05", payload: ["retard_143", "conformite_117", "derive_144"] },
  ];
}
