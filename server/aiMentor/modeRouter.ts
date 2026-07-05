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
    return "certification";
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
    ? "Mentor verrouillé pendant l'évaluation certifiante."
    : "Mentor locked during certification evaluation.";
}
