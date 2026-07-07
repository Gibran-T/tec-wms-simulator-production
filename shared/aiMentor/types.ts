/** AI Mentor types — Manifesto Part VI / RC22 (no OpenAI integration) */

export type MentorMode =
  | "learning"
  | "professional"
  | "operational_colleague"
  | "certification"
  | "reflection";

export type MentorPersonaId =
  | "FLOOR_MENTOR"
  | "INVENTORY_ADVISOR"
  | "PERFORMANCE_COACH"
  | "CRISIS_ADVISOR"
  | "ERP_COACH"
  | "QUALITY_GUIDE"
  | "PROCUREMENT_GUIDE";

export type MentorEntryPoint = "mission_control" | "oil_panel_f" | "debrief";

export type MentorSurface = "monitor" | "cockpit" | "fiche" | "oil";

export interface MentorAvailability {
  available: boolean;
  mode: MentorMode;
  reason?: string;
  personaId: MentorPersonaId;
  hintsRemaining?: number;
  integrationReady: boolean;
}

export interface MentorPromptPreview {
  mode: MentorMode;
  personaId: MentorPersonaId;
  systemPrompt: string;
  contextSummary: string;
  blocked: boolean;
  blockReason?: string;
}

export interface MentorInteraction {
  id: string;
  userId: number;
  runId: number | null;
  scnCode: string;
  mode: MentorMode;
  personaId: MentorPersonaId;
  entryPoint: MentorEntryPoint;
  requestMessage: string;
  responseMessage: string;
  hintNumber?: number;
  guardrailFlags: string[];
  createdAt: string;
}

export interface MentorChatRequest {
  sessionId?: string;
  message: string;
  entryPoint: MentorEntryPoint;
}

export interface MentorChatResponse {
  message: string;
  hintsRemaining?: number;
  suggestedSurfaces?: MentorSurface[];
  blocked?: boolean;
  blockReason?: string;
}

export const PROFESSIONAL_HINT_CAP = 3;
