import type { M5DocErrorTag } from "../../shared/m5Doc/errorTags";
import type { DemandId, GapId, HandoverPayload, M5DocMissionStateV1, OrderId } from "../../shared/m5Doc/types";

function isDemandId(v: unknown): v is DemandId {
  return v === "D-143" || v === "D-117" || v === "D-144";
}

function isGapId(v: unknown): v is GapId {
  return v === "E-144";
}

function isOrderId(v: unknown): v is OrderId {
  return v === "OI-143";
}

export function evaluateHandover(
  state: M5DocMissionStateV1,
  payload: HandoverPayload,
): { structuralOk: boolean; consistent: boolean; tags: M5DocErrorTag[] } {
  const tags: M5DocErrorTag[] = [];

  if (
    !payload ||
    !Array.isArray(payload.closedWithProof) ||
    !Array.isArray(payload.stillOpen) ||
    !Array.isArray(payload.gaps) ||
    !Array.isArray(payload.interventions) ||
    !Array.isArray(payload.reassignments) ||
    !Array.isArray(payload.escalations) ||
    !Array.isArray(payload.underWatch) ||
    !payload.nextOwners ||
    typeof payload.nextOwners !== "object" ||
    !payload.remainingControls ||
    typeof payload.remainingControls !== "object" ||
    !isDemandId(payload.nextShiftPriority) ||
    !Array.isArray(payload.residualRisks)
  ) {
    return { structuralOk: false, consistent: false, tags: ["HANDOVER_PAYLOAD_INVALIDE"] };
  }

  // Structural ID checks
  for (const id of payload.closedWithProof) if (!isDemandId(id)) {
    return { structuralOk: false, consistent: false, tags: ["HANDOVER_PAYLOAD_INVALIDE"] };
  }
  for (const id of payload.stillOpen) if (!isDemandId(id)) {
    return { structuralOk: false, consistent: false, tags: ["HANDOVER_PAYLOAD_INVALIDE"] };
  }
  for (const id of payload.gaps) if (!isGapId(id)) {
    return { structuralOk: false, consistent: false, tags: ["HANDOVER_PAYLOAD_INVALIDE"] };
  }
  for (const id of payload.interventions) if (!isOrderId(id)) {
    return { structuralOk: false, consistent: false, tags: ["HANDOVER_PAYLOAD_INVALIDE"] };
  }

  const realClosed = Object.values(state.portfolio.demands)
    .filter((d) => d.status === "Cloturee" && d.proofProvided?.verified)
    .map((d) => d.id);
  const realOpen = Object.values(state.portfolio.demands)
    .filter((d) => d.status !== "Cloturee")
    .map((d) => d.id);
  const realGaps = Object.keys(state.portfolio.gaps).filter((k) => !!state.portfolio.gaps[k as GapId]) as GapId[];
  const realInterventions = Object.keys(state.portfolio.interventions) as OrderId[];
  const realReassign = Object.values(state.portfolio.demands)
    .filter((d) => d.reassignment)
    .map((d) => d.id);
  const realEscalations = Object.values(state.portfolio.demands)
    .filter((d) => d.escalation)
    .map((d) => d.id);
  const realWatch = [
    ...Object.values(state.portfolio.demands).filter((d) => d.status === "Sous surveillance").map((d) => d.id),
    ...Object.values(state.portfolio.gaps).filter((g) => g.status === "Sous surveillance").map((g) => g.id),
  ];

  // Invented closed without verified proof
  for (const id of payload.closedWithProof) {
    const d = state.portfolio.demands[id];
    if (!d || d.status !== "Cloturee" || !d.proofProvided?.verified) {
      tags.push("CLOTURE_SANS_PREUVE");
      tags.push("HANDOVER_CONTRADICTOIRE");
    }
  }

  // Must include all real open
  for (const id of realOpen) {
    if (!payload.stillOpen.includes(id) && !payload.closedWithProof.includes(id)) {
      tags.push("HANDOVER_CONTRADICTOIRE");
    }
  }

  // Closed listed but still open in history
  for (const id of payload.closedWithProof) {
    if (realOpen.includes(id)) tags.push("STATUT_INCOMPATIBLE");
  }

  // Gaps
  for (const g of realGaps) {
    if (!payload.gaps.includes(g)) tags.push("ECART_OMIS");
  }
  for (const g of payload.gaps) {
    if (!realGaps.includes(g)) tags.push("HANDOVER_CONTRADICTOIRE");
  }

  // Interventions invented
  for (const oi of payload.interventions) {
    if (!realInterventions.includes(oi)) tags.push("INTERVENTION_INVENTEE");
  }
  for (const oi of realInterventions) {
    if (!payload.interventions.includes(oi)) tags.push("HANDOVER_CONTRADICTOIRE");
  }

  // Reassignments / escalations must be real-only
  for (const id of payload.reassignments) {
    if (!realReassign.includes(id)) tags.push("HANDOVER_CONTRADICTOIRE");
  }
  for (const id of payload.escalations) {
    if (!realEscalations.includes(id)) tags.push("HANDOVER_CONTRADICTOIRE");
  }

  // Watch
  for (const id of payload.underWatch) {
    if (!realWatch.includes(id as never)) tags.push("HANDOVER_CONTRADICTOIRE");
  }

  // Owners for open demands
  for (const id of payload.stillOpen) {
    if (!payload.nextOwners[id]) tags.push("RESPONSABLE_ABSENT");
  }

  // Residual risks
  const knownRisks = state.arbitration?.residualRiskIds ?? [];
  if (knownRisks.length > 0) {
    const missing = knownRisks.filter((r) => r !== "aucun" && !payload.residualRisks.includes(r));
    if (missing.length || payload.residualRisks.includes("aucun")) {
      tags.push("RISQUE_RESIDUEL_IGNORE");
    }
  } else if (payload.stillOpen.length > 0 && payload.residualRisks.length === 0) {
    tags.push("RISQUE_RESIDUEL_IGNORE");
  }

  // Invented proof ids not in timeline returns
  // (closedWithProof already gates verified proof)

  // Silence unused realClosed in lint by referencing
  void realClosed;

  const uniqueTags = Array.from(new Set(tags));
  const consistent = uniqueTags.length === 0;
  if (!consistent && !uniqueTags.includes("HANDOVER_CONTRADICTOIRE")) {
    uniqueTags.push("HANDOVER_CONTRADICTOIRE");
  }
  return { structuralOk: true, consistent, tags: uniqueTags };
}

/** Build a coherent handover from current state (for tests / canonical path). */
export function buildCoherentHandoverFromState(state: M5DocMissionStateV1): HandoverPayload {
  const stillOpen = Object.values(state.portfolio.demands)
    .filter((d) => d.status !== "Cloturee")
    .map((d) => d.id);
  const closedWithProof = Object.values(state.portfolio.demands)
    .filter((d) => d.status === "Cloturee" && d.proofProvided?.verified)
    .map((d) => d.id);
  const nextOwners: HandoverPayload["nextOwners"] = {};
  const remainingControls: HandoverPayload["remainingControls"] = {};
  for (const id of stillOpen) {
    nextOwners[id] = state.portfolio.demands[id].owner ?? "chefQuai";
    remainingControls[id] = state.arbitration?.controls?.[id] ?? "controle_suivi";
  }
  return {
    closedWithProof,
    stillOpen,
    gaps: Object.keys(state.portfolio.gaps).filter((k) => !!state.portfolio.gaps[k as GapId]) as GapId[],
    interventions: Object.keys(state.portfolio.interventions) as OrderId[],
    reassignments: Object.values(state.portfolio.demands)
      .filter((d) => d.reassignment)
      .map((d) => d.id),
    escalations: Object.values(state.portfolio.demands)
      .filter((d) => d.escalation)
      .map((d) => d.id),
    underWatch: [
      ...Object.values(state.portfolio.demands)
        .filter((d) => d.status === "Sous surveillance")
        .map((d) => d.id),
      ...Object.values(state.portfolio.gaps)
        .filter((g) => g.status === "Sous surveillance")
        .map((g) => g.id),
    ],
    nextOwners,
    remainingControls,
    nextShiftPriority: stillOpen.includes("D-117") ? "D-117" : stillOpen[0] ?? "D-143",
    residualRisks: (state.arbitration?.residualRiskIds ?? ["retard_143", "conformite_117", "derive_144"]).filter(
      (r) => r !== "aucun",
    ),
  };
}
