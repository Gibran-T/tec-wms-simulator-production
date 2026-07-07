import type { MentorMode } from "../../shared/aiMentor/types";

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
    ? "Le collègue opérationnel est indisponible pour votre cohorte ou cette session."
    : "The operational colleague is unavailable for your cohort or this session.";
}

export function getOperationalColleagueAvailabilityNote(language: "fr" | "en"): string {
  return language === "fr"
    ? "Collègue opérationnel disponible — il peut vous aider à raisonner, mais ne peut pas exécuter la mission à votre place."
    : "Operational colleague available — they can help you reason, but cannot execute the mission for you.";
}
