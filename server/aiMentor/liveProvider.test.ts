import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { resolveMentorMode, isMentorAvailable } from "./modeRouter";
import { scanResponseForLeaks, classifyUserIntent } from "./guardrails";
import { generateDryRunResponse } from "./providers/dryRunProvider";
import { generateLiveResponse } from "./providers/liveProvider";
import { createOpenAiChatCompletion } from "./providers/openaiClient";
import {
  getOpenAiApiKey,
  getOpenAiModel,
  isAiMentorIntegrationReady,
  isOpenAiConfigured,
} from "./mentorEnv";
import { buildLiveSafeContextSummary, redactOperationalValues } from "./livePromptContext";
import { buildScenarioContext } from "../enterpriseContext/scenarioContext";
import { buildMissionContext } from "../enterpriseContext/missionContext";
import { buildUniverseContext } from "../enterpriseContext/universeContext";
import { buildProcessContext } from "../enterpriseContext/processContext";
import { getMissionForScenario } from "../missionData";
import type { EnterpriseContextPayload } from "../../shared/enterpriseContext/types";
import type { MentorPromptPreview } from "../../shared/aiMentor/types";

function samplePayload(): EnterpriseContextPayload {
  const mission = getMissionForScenario({ id: 6, moduleId: 2, name: "SCN-006" });
  return {
    assembledAt: new Date().toISOString(),
    scnCode: "SCN-006",
    runId: 1,
    blocks: {
      scenario: buildScenarioContext("SCN-006", 2, mission),
      mission: buildMissionContext(mission),
      universe: buildUniverseContext("SCN-006"),
      process: buildProcessContext("SCN-006", "PUTAWAY"),
      studentProgress: {
        blockId: "studentProgress",
        sensitivity: "medium",
        data: {
          modulesCompleted: [1],
          certificationStatus: { silverCertified: false, goldEligible: false, goldCertified: false },
          attemptCount: 1,
        },
      },
      currentStep: {
        blockId: "currentStep",
        sensitivity: "medium",
        data: {
          activeStepCode: "PUTAWAY",
          activeStepLabel: { fr: "Rangement", en: "Putaway" },
          completedSteps: ["GR"],
          progressPct: 40,
          runStatus: "in_progress",
          isDemo: true,
          oilFocus: "execution",
        },
      },
    },
  };
}

const samplePreview: MentorPromptPreview = {
  mode: "learning",
  personaId: "FLOOR_MENTOR",
  systemPrompt: "You are a Socratic mentor. Never reveal answers.",
  contextSummary: "{}",
  blocked: false,
};

describe("RC23-B — mentorEnv", () => {
  const env = { ...process.env };

  afterEach(() => {
    process.env = { ...env };
  });

  it("defaults OPENAI_MODEL to gpt-4o-mini", () => {
    delete process.env.OPENAI_MODEL;
    expect(getOpenAiModel()).toBe("gpt-4o-mini");
  });

  it("reports integration not ready without live flag", () => {
    process.env.ENABLE_AI_MENTOR_LIVE = "false";
    process.env.OPENAI_API_KEY = "sk-test";
    expect(isAiMentorIntegrationReady()).toBe(false);
  });

  it("reports integration not ready without API key", () => {
    process.env.ENABLE_AI_MENTOR_LIVE = "true";
    delete process.env.OPENAI_API_KEY;
    expect(isOpenAiConfigured()).toBe(false);
    expect(isAiMentorIntegrationReady()).toBe(false);
  });

  it("reports integration ready when live flag and key are set", () => {
    process.env.ENABLE_AI_MENTOR_LIVE = "true";
    process.env.OPENAI_API_KEY = "sk-test";
    expect(isAiMentorIntegrationReady()).toBe(true);
    expect(getOpenAiApiKey()).toBe("sk-test");
  });
});

describe("RC23-B — live prompt context sanitization", () => {
  it("redacts lots, bins, quantities, and PO refs", () => {
    const raw =
      "Contrat PO-M5-001 · LOT-2025-001 · 80 u. · B-01-R1-L2 · réappro Min 10 / Max 100 / SS 5";
    const redacted = redactOperationalValues(raw);
    expect(redacted).not.toMatch(/LOT-2025-001|PO-M5-001|80 u\.|B-01-R1-L2/);
    expect(redacted).toContain("[LOT]");
    expect(redacted).toContain("[QTY]");
  });

  it("buildLiveSafeContextSummary excludes eval-sensitive operational datums", () => {
    const summary = buildLiveSafeContextSummary(samplePayload());
    expect(summary).not.toMatch(/LOT-\d{4}|B-\d{2}-R\d-L\d|\b80\s*u\.?\b/);
    expect(summary).toContain("SCN-006");
    expect(summary).not.toContain("successCriteria");
    expect(summary).not.toContain("kpis");
  });
});

describe("RC23-B — OpenAI client", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns assistant text on mocked success", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        model: "gpt-4o-mini",
        choices: [{ message: { content: "What evidence do you see in the monitor?" } }],
      }),
    });

    const result = await createOpenAiChatCompletion({
      apiKey: "sk-test",
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "help" }],
    });

    expect(result.text).toContain("evidence");
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.openai.com/v1/chat/completions");
    expect((init.headers as Record<string, string>).authorization).toBe("Bearer sk-test");
    const body = JSON.parse(String(init.body));
    expect(body.model).toBe("gpt-4o-mini");
    expect(body.messages[0].content).toBe("help");
  });

  it("throws when API key is missing", async () => {
    await expect(
      createOpenAiChatCompletion({
        apiKey: "",
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: "hi" }],
      }),
    ).rejects.toThrow(/OPENAI_API_KEY/);
  });

  it("throws on OpenAI HTTP failure", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 503,
      statusText: "Service Unavailable",
      text: async () => "upstream error",
    });

    await expect(
      createOpenAiChatCompletion({
        apiKey: "sk-test",
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: "hi" }],
      }),
    ).rejects.toThrow(/OpenAI chat completion failed/);
  });
});

describe("RC23-B — live provider", () => {
  const env = { ...process.env };
  const fetchMock = vi.fn();

  beforeEach(() => {
    process.env = { ...env, OPENAI_API_KEY: "sk-test", OPENAI_MODEL: "gpt-4o-mini" };
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    process.env = { ...env };
    vi.unstubAllGlobals();
  });

  it("generateLiveResponse uses native OpenAI endpoint", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: "Consult the Mission Sheet for documentary evidence." } }],
      }),
    });

    const text = await generateLiveResponse({
      preview: samplePreview,
      studentMessage: "What should I check?",
      liveContextSummary: buildLiveSafeContextSummary(samplePayload()),
    });

    expect(text).toContain("Mission Sheet");
    const [url] = fetchMock.mock.calls[0] as [string];
    expect(url).toBe("https://api.openai.com/v1/chat/completions");
  });

  it("generateLiveResponse throws without API key", async () => {
    delete process.env.OPENAI_API_KEY;
    await expect(
      generateLiveResponse({
        preview: samplePreview,
        studentMessage: "help",
        liveContextSummary: "{}",
      }),
    ).rejects.toThrow(/OPENAI_API_KEY/);
  });

  it("falls back pattern: dry-run when live throws", async () => {
    fetchMock.mockRejectedValue(new Error("network down"));

    let message = "";
    let flags: string[] = [];
    try {
      await generateLiveResponse({
        preview: samplePreview,
        studentMessage: "I need guidance on putaway evidence",
        liveContextSummary: buildLiveSafeContextSummary(samplePayload()),
      });
    } catch {
      message = generateDryRunResponse({
        context: samplePayload(),
        mode: "learning",
        personaId: "FLOOR_MENTOR",
        language: "en",
        studentMessage: "I need guidance on putaway evidence",
      });
      flags = ["live_fallback_dry_run"];
    }

    expect(flags).toContain("live_fallback_dry_run");
    expect(message).toMatch(/observe|Mission Sheet|understand|together|cockpit/i);
  });
});

describe("RC23-B — guardrail leak scan", () => {
  it("flags operational values in responses", () => {
    expect(scanResponseForLeaks("Use LOT-2025-001 in bin B-01-R1-L2 with 80 u.")).toContain(
      "leak:operational_value",
    );
    expect(scanResponseForLeaks("Post your observation in the monitor before proceeding")).toHaveLength(0);
  });

  it("flags KPI targets and compliance solutions", () => {
    expect(scanResponseForLeaks("Target KPI service level must be 98%")).toContain("leak:kpi_target");
    expect(scanResponseForLeaks("To pass compliance, enter 80 units")).toContain(
      "leak:compliance_solution",
    );
  });

  it("flags transaction execution instructions", () => {
    expect(scanResponseForLeaks("Next you must click MIGO")).toEqual(
      expect.arrayContaining(["leak:step_sequencer", "leak:transaction_execution"]),
    );
  });

  it("detects quantity and bin fishing intents", () => {
    expect(classifyUserIntent("What bin should I use?")).toContain("intent:answer_request");
  });
});

describe("RC23-B — operational colleague and dry-run", () => {
  it("enables operational colleague during active evaluation", () => {
    expect(resolveMentorMode({ isDemo: false, runStatus: "in_progress" })).toBe("operational_colleague");
    expect(isMentorAvailable("operational_colleague")).toBe(true);
  });

  it("dry-run remains Socratic in learning mode", () => {
    const response = generateDryRunResponse({
      context: samplePayload(),
      mode: "learning",
      personaId: "FLOOR_MENTOR",
      language: "en",
      studentMessage: "I am reviewing putaway evidence in the monitor",
    });
    expect(response).toMatch(/observe|Mission Sheet|evidence|understand|together/i);
    expect(scanResponseForLeaks(response)).toHaveLength(0);
  });
});
