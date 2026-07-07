import type { MentorMode, MentorPersonaId } from "../../shared/aiMentor/types";
import { getEnterpriseEmployeeForLanguage } from "../../shared/aiMentor/enterpriseEmployee";

export type ModeResolutionInput = {
  isDemo: boolean;
  runStatus: "in_progress" | "completed" | "abandoned";
  reflectionRequested?: boolean;
  aiMentorEnabled?: boolean;
};

export function resolveMentorMode(input: ModeResolutionInput): MentorMode {
  if (input.aiMentorEnabled === false) {
    return "certification";
  }
  if (input.reflectionRequested && input.runStatus === "completed") {
    return "reflection";
  }
  if (input.isDemo) {
    return "learning";
  }
  if (input.runStatus === "in_progress") {
    return "operational_colleague";
  }
  if (input.runStatus === "completed") {
    return "reflection";
  }
  return "certification";
}

export function isMentorAvailable(mode: MentorMode): boolean {
  return mode !== "certification";
}

export function getModeBlockReason(mode: MentorMode, language: "fr" | "en"): string | undefined {
  if (mode !== "certification") return undefined;
  return language === "fr"
    ? "Aucun responsable Concorde Logistics n'est disponible pour cette session."
    : "No Concorde Logistics supervisor is available for this session.";
}

export function getOperationalColleagueAvailabilityNote(
  personaId: MentorPersonaId,
  language: "fr" | "en",
): string {
  return getEnterpriseEmployeeForLanguage(personaId, language).availabilityNote;
}
