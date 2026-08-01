/**
 * Deterministic m5-session-v2 evidence derivation — no legacy ops fields.
 */

import type { M5DocMissionStateV1, M5DocSessionEvidenceV2 } from "./types";
import { M5_DOC_EVIDENCE_VERSION, M5_DOC_INTERACTION_MODEL } from "./types";
import { computeFinalScore } from "./scoringPure";

export function deriveM5DocSessionEvidenceV2(state: M5DocMissionStateV1): M5DocSessionEvidenceV2 {
  const completedInteractionIds = Object.keys(state.officialScores).sort();
  const openDemandIds = (Object.values(state.portfolio.demands) as Array<{ id: M5DocMissionStateV1["portfolio"]["demands"][keyof M5DocMissionStateV1["portfolio"]["demands"]] extends infer D ? D extends { id: infer I } ? I : never : never; status: string }>)
    .filter((d) => d.status !== "Cloturee")
    .map((d) => d.id);

  const closedDemandIds = Object.values(state.portfolio.demands)
    .filter((d) => d.status === "Cloturee")
    .map((d) => d.id);

  const { finalScore } = computeFinalScore(state);

  return {
    evidenceVersion: M5_DOC_EVIDENCE_VERSION,
    interactionModel: M5_DOC_INTERACTION_MODEL,
    runId: state.runId,
    scnCode: state.scnCode,
    phase: state.phase,
    completedInteractionIds,
    openDemandIds: openDemandIds as M5DocSessionEvidenceV2["openDemandIds"],
    closedDemandIds: closedDemandIds as M5DocSessionEvidenceV2["closedDemandIds"],
    gapIds: Object.keys(state.portfolio.gaps).filter(
    (k) => !!state.portfolio.gaps[k as keyof typeof state.portfolio.gaps],
  ) as M5DocSessionEvidenceV2["gapIds"],
    interventionIds: Object.keys(state.portfolio.interventions).sort(),
    watchIds: state.journalView.watchIds.slice().sort(),
    residualRiskIds: (state.arbitration?.residualRiskIds ?? []).slice().sort(),
    handoverStatus: state.handover.status,
    finalScore,
    chainCoherenceDelta: state.chainCoherence.scoreDelta,
    competenceScores: { ...state.competenceScores },
  };
}

export function isM5DocSessionEvidenceV2(value: unknown): value is M5DocSessionEvidenceV2 {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return v.evidenceVersion === M5_DOC_EVIDENCE_VERSION && v.interactionModel === M5_DOC_INTERACTION_MODEL;
}
