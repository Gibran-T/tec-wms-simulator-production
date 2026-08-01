/**
 * M5 DOC supervision — shared types (supervision-doc-v1 / m5-session-v2).
 * Isolated from ops-ledger-v1 and m5-session-v1.
 */

import type { M5DocErrorTag } from "./errorTags";

export const M5_DOC_INTERACTION_MODEL = "supervision-doc-v1" as const;
export const M5_DOC_EVIDENCE_VERSION = "m5-session-v2" as const;
export const M5_LEGACY_INTERACTION_MODEL = "ops-ledger-v1" as const;

export type M5DocInteractionModel = typeof M5_DOC_INTERACTION_MODEL;
export type M5DocEvidenceVersion = typeof M5_DOC_EVIDENCE_VERSION;

export type M5DocScnCode = "SCN-015-DOC" | "SCN-016-DOC" | "SCN-017-DOC";
export type M5DocPhase = "PRE" | "SCN015" | "SCN016" | "SCN017" | "POST" | "CLOSED";

export type CompetenceKey =
  | "PERCEVOIR"
  | "CLASSER"
  | "RELIER"
  | "PRIORISER"
  | "DELEGUER"
  | "SUIVRE"
  | "VERIFIER"
  | "REAGIR"
  | "ARBITRER"
  | "TRANSMETTRE";

export type InteractionFormat =
  | "single_select"
  | "multi_select_bounded"
  | "association"
  | "ranking"
  | "assignment"
  | "matrix_3x2"
  | "status_choice"
  | "control_choice"
  | "structured_handover"
  | "posture_combo";

export type SubmitMode = "OFFICIAL" | "FORMATIVE" | "REVIEW";

export type DemandId = "D-143" | "D-117" | "D-144";
export type GapId = "E-144";
export type OrderId = "OI-143";
export type ResourceId =
  | "chefQuai"
  | "equipeQuai"
  | "technicienFrigo"
  | "superviseur"
  | "directeurSite"
  | "chefQuai+equipeQuai";

export type DemandStatus =
  | "Signalee"
  | "Ouverte"
  | "Assignee"
  | "En cours"
  | "En attente de preuve"
  | "Sous surveillance"
  | "Reaffectee"
  | "Escaladee"
  | "En retard"
  | "Bloquee"
  | "Cloturee";

export type OrderStatus =
  | "Emis"
  | "Pris en charge"
  | "Realise"
  | "Verifie OK"
  | "Verifie KO"
  | "Clos"
  | "A reprendre";

export type GapStatus =
  | "Constate"
  | "En traitement"
  | "Sous surveillance"
  | "Reaffectee"
  | "Escaladee"
  | "Controle"
  | "Resolu"
  | "Non resolu";

export type TreatmentMode = "TRAITER" | "SURVEILLER" | "REAFFECTER" | "ESCALADER";

export type PriorityLevel = "P1" | "P2" | "P3" | "P4";

export type ControlSpec = {
  id: string;
  label: string;
  dueLabel?: string;
};

export type ProofSpec = {
  id: string;
  label: string;
};

export type ProofInstance = {
  id: string;
  verified: boolean;
  at: string;
};

export type DemandRecord = {
  id: DemandId;
  document: "DEMAND";
  priority?: PriorityLevel;
  owner?: ResourceId | null;
  expectedAction?: string;
  control?: ControlSpec;
  proofRequired?: ProofSpec;
  proofProvided?: ProofInstance | null;
  status: DemandStatus;
  mode?: TreatmentMode;
  reassignment?: { from?: ResourceId; to: ResourceId; at: string } | null;
  escalation?: { level: string; at: string } | null;
};

export type GapRecord = {
  id: GapId;
  linkedDemandId?: DemandId;
  risk?: string;
  owner?: ResourceId | null;
  controlAction?: string;
  expectedResult?: string;
  posture?: "SOUS_SURVEILLANCE" | "REAFFECTEE" | "ESCALADEE";
  proofRequired?: ProofSpec;
  proofProvided?: ProofInstance | null;
  status: GapStatus;
  nextControlMinutes?: number;
};

export type InterventionRecord = {
  id: OrderId;
  demandId: DemandId;
  status: OrderStatus;
  reportedResult?: string;
};

export type MatrixRow = {
  demandId: DemandId;
  resource: ResourceId;
  mode: TreatmentMode;
};

export type MissionEvent = {
  at: string;
  interactionId: string;
  mode: SubmitMode;
  payload: unknown;
  correct: boolean;
  combinationOk: boolean;
  tags: M5DocErrorTag[];
  points: number;
  feedbackCode: string;
  structuralOk: boolean;
  officialConsumed?: boolean;
};

export type OfficialInteractionScore = {
  interactionId: string;
  points: number;
  maxPoints: number;
  correct: boolean;
  combinationOk: boolean;
  tags: M5DocErrorTag[];
  submittedAt: string;
  payload: unknown;
};

export type HandoverPayload = {
  closedWithProof: DemandId[];
  stillOpen: DemandId[];
  gaps: GapId[];
  interventions: OrderId[];
  reassignments: DemandId[];
  escalations: DemandId[];
  underWatch: Array<DemandId | GapId>;
  nextOwners: Partial<Record<DemandId, ResourceId>>;
  remainingControls: Partial<Record<DemandId, string>>;
  nextShiftPriority: DemandId;
  residualRisks: string[];
};

export type HandoverState = {
  status: "Brouillon" | "Complet" | "Transmis";
  payload?: HandoverPayload;
  contradictions: M5DocErrorTag[];
};

export type M5DocMissionStateV1 = {
  evidenceVersion: M5DocEvidenceVersion;
  interactionModel: M5DocInteractionModel;
  runId: number;
  scnCode: M5DocScnCode;
  phase: M5DocPhase;
  portfolio: {
    demands: Record<DemandId, DemandRecord>;
    gaps: Partial<Record<GapId, GapRecord>>;
    interventions: Record<string, InterventionRecord>;
  };
  resources: Record<string, { available: boolean; label: string }>;
  journalView: {
    openIds: DemandId[];
    inProgressIds: DemandId[];
    waitingProofIds: DemandId[];
    closedIds: DemandId[];
    watchIds: DemandId[];
    delayedIds: DemandId[];
  };
  arbitration?: {
    ranking?: DemandId[];
    matrix?: MatrixRow[];
    matrixResolved?: boolean;
    compromiseId?: string;
    controls?: Partial<Record<DemandId, string>>;
    residualRiskIds?: string[];
  };
  handover: HandoverState;
  competenceScores: Record<CompetenceKey, number>;
  chainCoherence: { scoreDelta: number; flags: M5DocErrorTag[] };
  officialScores: Record<string, OfficialInteractionScore>;
  formativeLatest: Record<string, unknown>;
  timeline: MissionEvent[];
  currentInteractionIndex: number;
  injectedReturns: {
    oi143Partial: boolean;
    e144TempOk: boolean;
  };
  reviewNotes: Array<{ at: string; interactionId: string; note: string; byRole: string }>;
};

export type M5DocSessionEvidenceV2 = {
  evidenceVersion: typeof M5_DOC_EVIDENCE_VERSION;
  interactionModel: typeof M5_DOC_INTERACTION_MODEL;
  runId: number;
  scnCode: M5DocScnCode;
  phase: M5DocPhase;
  completedInteractionIds: string[];
  openDemandIds: DemandId[];
  closedDemandIds: DemandId[];
  gapIds: GapId[];
  interventionIds: string[];
  watchIds: DemandId[];
  residualRiskIds: string[];
  handoverStatus: HandoverState["status"];
  finalScore: number;
  chainCoherenceDelta: number;
  competenceScores: Record<CompetenceKey, number>;
};

export type InteractionEvalResult = {
  structuralOk: boolean;
  correct: boolean;
  combinationOk: boolean;
  tags: M5DocErrorTag[];
  points: number;
  maxPoints: number;
  feedbackCode: string;
  statePatch?: Partial<M5DocMissionStateV1> | ((s: M5DocMissionStateV1) => void);
  rejectCode?: M5DocErrorTag;
};

export type M5DocInitialStateJson = {
  interactionModel: typeof M5_DOC_INTERACTION_MODEL;
  scnCode: M5DocScnCode;
  module: 5;
  context?: string;
};

export function isM5DocInitialState(value: unknown): value is M5DocInitialStateJson {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return v.interactionModel === M5_DOC_INTERACTION_MODEL;
}

export function isM5DocFeatureEnabled(env: NodeJS.ProcessEnv | Record<string, string | undefined> = process.env): boolean {
  return env.ENABLE_M5_DOC_SUPERVISION === "true";
}

export function isM5DocGoldEnabled(env: NodeJS.ProcessEnv | Record<string, string | undefined> = process.env): boolean {
  // Explicitly disabled until acceptance — never treat legacy Gold as DOC Gold.
  return env.ENABLE_M5_DOC_GOLD_V1 === "true";
}
