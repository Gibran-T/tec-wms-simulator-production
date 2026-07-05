import type { MentorPromptPreview } from "../../../shared/aiMentor/types";
import { invokeLLM, type Message } from "../../_core/llm";

/**
 * Live OpenAI provider — only invoked when ENABLE_AI_MENTOR_LIVE=true and OPENAI_API_KEY is set.
 * Do not enable in production without explicit approval.
 */
export async function generateLiveResponse(input: {
  preview: MentorPromptPreview;
  studentMessage: string;
}): Promise<string> {
  const messages: Message[] = [
    { role: "system", content: input.preview.systemPrompt },
    {
      role: "user",
      content: [
        "Context:",
        input.preview.contextSummary,
        "",
        "Student message:",
        input.studentMessage,
      ].join("\n"),
    },
  ];

  const result = await invokeLLM({ messages, maxTokens: 512 });
  const text = result.choices[0]?.message?.content;
  if (typeof text === "string" && text.trim()) {
    return text.trim();
  }
  if (Array.isArray(text)) {
    const joined = text
      .filter((p): p is { type: "text"; text: string } => typeof p === "object" && p.type === "text")
      .map((p) => p.text)
      .join("");
    if (joined.trim()) return joined.trim();
  }
  throw new Error("Live mentor provider returned empty response");
}
