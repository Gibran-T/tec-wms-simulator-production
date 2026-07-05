/** RC22 — AI Mentor feature gate (no OpenAI until RC23) */
export function isAiMentorUiEnabled(): boolean {
  const flag = import.meta.env.VITE_ENABLE_AI_MENTOR;
  return flag !== "false";
}
