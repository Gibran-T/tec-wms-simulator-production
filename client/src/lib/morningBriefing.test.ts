import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  acknowledgeMorningBriefing,
  isMorningBriefingAcknowledged,
  isMorningBriefingEnabled,
  morningBriefingStorageKey,
  resolvePostRunStartPath,
  shouldShowMorningBriefing,
} from "./morningBriefing";

const sessionStore = new Map<string, string>();

beforeEach(() => {
  sessionStore.clear();
  vi.stubGlobal("sessionStorage", {
    getItem: (key: string) => sessionStore.get(key) ?? null,
    setItem: (key: string, value: string) => {
      sessionStore.set(key, value);
    },
    removeItem: (key: string) => {
      sessionStore.delete(key);
    },
    clear: () => {
      sessionStore.clear();
    },
  });
});

describe("RC21-B.2 — Morning Briefing feature gate", () => {
  const originalBriefing = import.meta.env.VITE_ENABLE_MORNING_BRIEFING;
  const originalEnterprise = import.meta.env.VITE_ENABLE_ENTERPRISE_EXPERIENCE;

  afterEach(() => {
    import.meta.env.VITE_ENABLE_MORNING_BRIEFING = originalBriefing;
    import.meta.env.VITE_ENABLE_ENTERPRISE_EXPERIENCE = originalEnterprise;
    sessionStore.clear();
  });

  it("defaults OFF when env var is unset", () => {
    import.meta.env.VITE_ENABLE_MORNING_BRIEFING = undefined;
    expect(isMorningBriefingEnabled()).toBe(false);
  });

  it("defaults OFF when env var is not true", () => {
    import.meta.env.VITE_ENABLE_MORNING_BRIEFING = "false";
    expect(isMorningBriefingEnabled()).toBe(false);
  });

  it("enables only when explicitly true and enterprise experience is on", () => {
    import.meta.env.VITE_ENABLE_MORNING_BRIEFING = "true";
    import.meta.env.VITE_ENABLE_ENTERPRISE_EXPERIENCE = "true";
    expect(isMorningBriefingEnabled()).toBe(true);
  });

  it("stays OFF when enterprise experience is disabled", () => {
    import.meta.env.VITE_ENABLE_MORNING_BRIEFING = "true";
    import.meta.env.VITE_ENABLE_ENTERPRISE_EXPERIENCE = "false";
    expect(isMorningBriefingEnabled()).toBe(false);
  });
});

describe("RC21-B.2 — Morning Briefing routing helpers", () => {
  const originalBriefing = import.meta.env.VITE_ENABLE_MORNING_BRIEFING;
  const originalEnterprise = import.meta.env.VITE_ENABLE_ENTERPRISE_EXPERIENCE;

  afterEach(() => {
    import.meta.env.VITE_ENABLE_MORNING_BRIEFING = originalBriefing;
    import.meta.env.VITE_ENABLE_ENTERPRISE_EXPERIENCE = originalEnterprise;
    sessionStore.clear();
  });

  it("routes to mission control when briefing is disabled", () => {
    import.meta.env.VITE_ENABLE_MORNING_BRIEFING = undefined;
    expect(resolvePostRunStartPath(42, { id: 1, moduleId: 1, name: "SCN-001" })).toBe(
      "/student/run/42",
    );
  });

  it("routes to briefing for M1 SCN-001 when moduleId is provided", () => {
    import.meta.env.VITE_ENABLE_MORNING_BRIEFING = "true";
    import.meta.env.VITE_ENABLE_ENTERPRISE_EXPERIENCE = "true";
    expect(resolvePostRunStartPath(7, { id: 1, moduleId: 1, name: "SCN-001" })).toBe(
      "/student/run/7/briefing",
    );
  });

  it("routes to briefing for enterprise SCN-001 when enabled", () => {
    import.meta.env.VITE_ENABLE_MORNING_BRIEFING = "true";
    import.meta.env.VITE_ENABLE_ENTERPRISE_EXPERIENCE = "true";
    expect(resolvePostRunStartPath(7, { id: 1, moduleId: 1, name: "SCN-001" })).toBe(
      "/student/run/7/briefing",
    );
  });

  it("skips briefing after acknowledgement", () => {
    import.meta.env.VITE_ENABLE_MORNING_BRIEFING = "true";
    import.meta.env.VITE_ENABLE_ENTERPRISE_EXPERIENCE = "true";
    acknowledgeMorningBriefing(7);
    expect(
      shouldShowMorningBriefing(7, { id: 1, moduleId: 1, name: "SCN-001" }, "in_progress", 0),
    ).toBe(false);
    expect(resolvePostRunStartPath(7, { id: 1, moduleId: 1, name: "SCN-001" })).toBe(
      "/student/run/7",
    );
  });

  it("skips briefing once steps are completed", () => {
    import.meta.env.VITE_ENABLE_MORNING_BRIEFING = "true";
    import.meta.env.VITE_ENABLE_ENTERPRISE_EXPERIENCE = "true";
    expect(
      shouldShowMorningBriefing(7, { id: 1, moduleId: 1, name: "SCN-001" }, "in_progress", 1),
    ).toBe(false);
  });

  it("uses stable session storage keys", () => {
    expect(morningBriefingStorageKey(99)).toBe("tec-morning-briefing-ack:99");
    acknowledgeMorningBriefing(99);
    expect(isMorningBriefingAcknowledged(99)).toBe(true);
  });
});
