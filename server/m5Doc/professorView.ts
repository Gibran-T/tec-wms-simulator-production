import type { M5DocMissionStateV1 } from "../../shared/m5Doc/types";
import { computeFinalScore } from "../../shared/m5Doc/scoringPure";
import { M5_DOC_INTERACTION_ORDER } from "../../shared/m5Doc/interactionsCatalog";

export type M5DocProfessorView = {
  runId: number;
  scnCode: string;
  phase: string;
  interactionModel: "supervision-doc-v1";
  evidenceVersion: "m5-session-v2";
  finalScore: number;
  zoneScores: Record<string, number>;
  chainCoherence: M5DocMissionStateV1["chainCoherence"];
  competenceScores: M5DocMissionStateV1["competenceScores"];
  timeline: M5DocMissionStateV1["timeline"];
  byInteraction: Array<{
    id: string;
    submitted: boolean;
    correct?: boolean;
    combinationOk?: boolean;
    tags?: string[];
    payload?: unknown;
    points?: number;
  }>;
  portfolioSnapshot: M5DocMissionStateV1["portfolio"];
  statusHistory: Array<{ entityId: string; status: string }>;
  owners: Record<string, string | null | undefined>;
  controls: Record<string, string | undefined>;
  proofs: Record<string, unknown>;
  watchlist: string[];
  reassignments: string[];
  escalations: string[];
  residualRisks: string[];
  handoverQuality: { status: string; contradictions: string[]; scoreHint: number };
  journalView: M5DocMissionStateV1["journalView"];
};

/** Documentary professor view — never includes ops-ledger fields. */
export function buildM5DocProfessorView(state: M5DocMissionStateV1): M5DocProfessorView {
  const { finalScore, zoneScores } = computeFinalScore(state);
  const byInteraction = M5_DOC_INTERACTION_ORDER.map((id) => {
    const sc = state.officialScores[id];
    return {
      id,
      submitted: !!sc,
      correct: sc?.correct,
      combinationOk: sc?.combinationOk,
      tags: sc?.tags,
      payload: sc?.payload,
      points: sc?.points,
    };
  });

  const owners: Record<string, string | null | undefined> = {};
  const controls: Record<string, string | undefined> = {};
  const proofs: Record<string, unknown> = {};
  const statusHistory: Array<{ entityId: string; status: string }> = [];

  for (const d of Object.values(state.portfolio.demands)) {
    owners[d.id] = d.owner;
    controls[d.id] = d.control?.id ?? state.arbitration?.controls?.[d.id];
    proofs[d.id] = d.proofProvided ?? d.proofRequired ?? null;
    statusHistory.push({ entityId: d.id, status: d.status });
  }
  for (const g of Object.values(state.portfolio.gaps)) {
    if (!g) continue;
    owners[g.id] = g.owner;
    proofs[g.id] = g.proofProvided ?? g.proofRequired ?? null;
    statusHistory.push({ entityId: g.id, status: g.status });
  }

  const handoverScoreHint =
    state.handover.status === "Transmis" ? 15 : state.handover.status === "Complet" ? 8 : state.handover.contradictions.length ? 0 : 3;

  return {
    runId: state.runId,
    scnCode: state.scnCode,
    phase: state.phase,
    interactionModel: "supervision-doc-v1",
    evidenceVersion: "m5-session-v2",
    finalScore,
    zoneScores,
    chainCoherence: state.chainCoherence,
    competenceScores: state.competenceScores,
    timeline: state.timeline,
    byInteraction,
    portfolioSnapshot: state.portfolio,
    statusHistory,
    owners,
    controls,
    proofs,
    watchlist: state.journalView.watchIds,
    reassignments: Object.values(state.portfolio.demands)
      .filter((d) => d.reassignment)
      .map((d) => d.id),
    escalations: Object.values(state.portfolio.demands)
      .filter((d) => d.escalation)
      .map((d) => d.id),
    residualRisks: state.arbitration?.residualRiskIds ?? [],
    handoverQuality: {
      status: state.handover.status,
      contradictions: state.handover.contradictions,
      scoreHint: handoverScoreHint,
    },
    journalView: state.journalView,
  };
}
