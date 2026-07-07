/** RC23-B — AI Mentor OpenAI environment (native provider; no Forge/Gemini). */

const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";

export function getOpenAiApiKey(): string | undefined {
  const key = process.env.OPENAI_API_KEY?.trim();
  return key && key.length > 0 ? key : undefined;
}

export function getOpenAiModel(): string {
  const model = process.env.OPENAI_MODEL?.trim();
  return model && model.length > 0 ? model : DEFAULT_OPENAI_MODEL;
}

export function isAiMentorLiveEnabled(): boolean {
  return process.env.ENABLE_AI_MENTOR_LIVE === "true";
}

export function isOpenAiConfigured(): boolean {
  return !!getOpenAiApiKey();
}

/** True only when live flag is ON and OPENAI_API_KEY is set — never uses Forge. */
export function isAiMentorIntegrationReady(): boolean {
  return isAiMentorLiveEnabled() && isOpenAiConfigured();
}
