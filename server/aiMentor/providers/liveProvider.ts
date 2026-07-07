import type { MentorPromptPreview } from "../../../shared/aiMentor/types";
import { getOpenAiApiKey, getOpenAiModel } from "../mentorEnv";
import { createOpenAiChatCompletion } from "./openaiClient";

/**
 * Live OpenAI provider — native api.openai.com only (RC23-B).
 * Invoked when ENABLE_AI_MENTOR_LIVE=true and OPENAI_API_KEY is set.
 * Do not enable in production without explicit approval.
 */
export async function generateLiveResponse(input: {
  preview: MentorPromptPreview;
  studentMessage: string;
  liveContextSummary: string;
}): Promise<string> {
  const apiKey = getOpenAiApiKey();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const result = await createOpenAiChatCompletion({
    apiKey,
    model: getOpenAiModel(),
    maxTokens: 512,
    messages: [
      { role: "system", content: input.preview.systemPrompt },
      {
        role: "user",
        content: [
          "Context (redacted — no operational answers):",
          input.liveContextSummary,
          "",
          "Student message:",
          input.studentMessage.trim(),
        ].join("\n"),
      },
    ],
  });

  return result.text;
}
