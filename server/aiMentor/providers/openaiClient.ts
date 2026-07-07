/** RC23-B — Native OpenAI Chat Completions client (AI Mentor live path only). */

export type OpenAiChatRole = "system" | "user" | "assistant";

export type OpenAiChatMessage = {
  role: OpenAiChatRole;
  content: string;
};

export type OpenAiChatCompletionInput = {
  apiKey: string;
  model: string;
  messages: OpenAiChatMessage[];
  maxTokens?: number;
};

export type OpenAiChatCompletionResult = {
  text: string;
  model: string;
};

function extractTextContent(content: unknown): string {
  if (typeof content === "string") return content.trim();
  if (Array.isArray(content)) {
    return content
      .filter((part): part is { type: "text"; text: string } =>
        typeof part === "object" && part !== null && part.type === "text" && typeof part.text === "string",
      )
      .map((part) => part.text)
      .join("")
      .trim();
  }
  return "";
}

/**
 * Calls OpenAI Chat Completions API directly — not Forge/Gemini.
 * @throws when API key missing, HTTP error, or empty model response
 */
export async function createOpenAiChatCompletion(
  input: OpenAiChatCompletionInput,
): Promise<OpenAiChatCompletionResult> {
  if (!input.apiKey.trim()) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${input.apiKey}`,
    },
    body: JSON.stringify({
      model: input.model,
      messages: input.messages,
      max_tokens: input.maxTokens ?? 512,
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `OpenAI chat completion failed: ${response.status} ${response.statusText} – ${errorText.slice(0, 300)}`,
    );
  }

  const body = (await response.json()) as {
    model?: string;
    choices?: Array<{ message?: { content?: unknown } }>;
  };

  const text = extractTextContent(body.choices?.[0]?.message?.content);
  if (!text) {
    throw new Error("OpenAI chat completion returned empty response");
  }

  return {
    text,
    model: body.model ?? input.model,
  };
}
