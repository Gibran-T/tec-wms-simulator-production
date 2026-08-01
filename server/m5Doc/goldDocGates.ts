/**
 * M5_DOC_GOLD_V1 — documentary Gold gates (DISABLED until acceptance).
 * Never reinterprets ops-ledger Gold metrics.
 */

import { isM5DocGoldEnabled } from "../../shared/m5Doc/types";
import type { M5DocMissionStateV1 } from "../../shared/m5Doc/types";
import { computeFinalScore } from "../../shared/m5Doc/scoringPure";

export type M5DocGoldChecklist = {
  gateId: "M5_DOC_GOLD_V1";
  enabled: boolean;
  eligible: boolean;
  items: Array<{ code: string; ok: boolean; detail: string }>;
};

export function evaluateM5DocGoldV1(state: M5DocMissionStateV1): M5DocGoldChecklist {
  const enabled = isM5DocGoldEnabled();
  const { finalScore } = computeFinalScore(state);
  const items = [
    {
      code: "CHAIN_COHERENCE",
      ok: state.chainCoherence.scoreDelta >= 0,
      detail: `delta=${state.chainCoherence.scoreDelta}`,
    },
    {
      code: "PROOFS",
      ok: !state.chainCoherence.flags.includes("CLOTURE_SANS_PREUVE"),
      detail: "no premature closure flags",
    },
    {
      code: "STATUSES",
      ok: state.handover.status === "Transmis" || state.phase === "CLOSED",
      detail: `handover=${state.handover.status}`,
    },
    {
      code: "OWNERS",
      ok: !state.chainCoherence.flags.includes("RESPONSABLE_ABSENT"),
      detail: "owners present",
    },
    {
      code: "CONTROLS",
      ok: Object.keys(state.arbitration?.controls ?? {}).length >= 3,
      detail: "controls set in arbitration",
    },
    {
      code: "ARBITRATION",
      ok: state.arbitration?.matrixResolved === true,
      detail: `matrixResolved=${state.arbitration?.matrixResolved === true}`,
    },
    {
      code: "RESIDUAL_RISKS",
      ok: (state.arbitration?.residualRiskIds?.length ?? 0) > 0,
      detail: "residual risks declared",
    },
    {
      code: "HANDOVER_QUALITY",
      ok: state.handover.status === "Transmis" && state.handover.contradictions.length === 0,
      detail: state.handover.status,
    },
    {
      code: "SCORE_FLOOR",
      ok: finalScore >= 70,
      detail: `finalScore=${finalScore}`,
    },
  ];

  const eligible = enabled && items.every((i) => i.ok);
  return { gateId: "M5_DOC_GOLD_V1", enabled, eligible, items };
}
