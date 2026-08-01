import type { DemandId, M5DocMissionStateV1, M5DocScnCode } from "../../shared/m5Doc/types";
import { M5_DOC_EVIDENCE_VERSION, M5_DOC_INTERACTION_MODEL } from "../../shared/m5Doc/types";

const EMPTY_COMPETENCES = {
  PERCEVOIR: 0,
  CLASSER: 0,
  RELIER: 0,
  PRIORISER: 0,
  DELEGUER: 0,
  SUIVRE: 0,
  VERIFIER: 0,
  REAGIR: 0,
  ARBITRER: 0,
  TRANSMETTRE: 0,
} as const;

function demand(id: DemandId, status: M5DocMissionStateV1["portfolio"]["demands"][DemandId]["status"] = "Signalee") {
  return {
    id,
    document: "DEMAND" as const,
    status,
    owner: null,
    proofProvided: null,
    reassignment: null,
    escalation: null,
  };
}

export function createInitialM5DocState(runId: number, scnCode: M5DocScnCode = "SCN-015-DOC"): M5DocMissionStateV1 {
  return {
    evidenceVersion: M5_DOC_EVIDENCE_VERSION,
    interactionModel: M5_DOC_INTERACTION_MODEL,
    runId,
    scnCode,
    phase: "PRE",
    portfolio: {
      demands: {
        "D-143": demand("D-143"),
        "D-117": demand("D-117"),
        "D-144": demand("D-144"),
      },
      gaps: {},
      interventions: {},
    },
    resources: {
      chefQuai: { available: true, label: "Chef de quai" },
      equipeQuai: { available: true, label: "Équipe quai" },
      technicienFrigo: { available: true, label: "Technicien frigo" },
      tracteurCour: { available: true, label: "Tracteur de cour" },
    },
    journalView: {
      openIds: ["D-143", "D-117", "D-144"],
      inProgressIds: [],
      waitingProofIds: [],
      closedIds: [],
      watchIds: [],
      delayedIds: [],
    },
    handover: { status: "Brouillon", contradictions: [] },
    competenceScores: { ...EMPTY_COMPETENCES },
    chainCoherence: { scoreDelta: 0, flags: [] },
    officialScores: {},
    formativeLatest: {},
    timeline: [],
    currentInteractionIndex: 0,
    injectedReturns: {
      oi143Partial: true,
      e144TempOk: true,
    },
    reviewNotes: [],
  };
}

export function refreshJournal(state: M5DocMissionStateV1): void {
  const demands = Object.values(state.portfolio.demands);
  state.journalView.openIds = demands.filter((d) => d.status !== "Cloturee").map((d) => d.id);
  state.journalView.inProgressIds = demands.filter((d) => d.status === "En cours").map((d) => d.id);
  state.journalView.waitingProofIds = demands
    .filter((d) => d.status === "En attente de preuve")
    .map((d) => d.id);
  state.journalView.closedIds = demands.filter((d) => d.status === "Cloturee").map((d) => d.id);
  state.journalView.watchIds = demands.filter((d) => d.status === "Sous surveillance").map((d) => d.id);
  state.journalView.delayedIds = demands.filter((d) => d.status === "En retard").map((d) => d.id);
}
