import { describe, expect, it } from "vitest";
import { buildProcessContext } from "./buildProcessContext";
import { getProcessForStep } from "./processes";

describe("buildProcessContext — Process Mapping preview (RC19)", () => {
  it("returns process cards for every official SCN", () => {
    for (let n = 1; n <= 17; n += 1) {
      const scnCode = `SCN-${String(n).padStart(3, "0")}`;
      const ctx = buildProcessContext(scnCode, null);
      expect(ctx.cards.length).toBeGreaterThan(0);
      expect(ctx.processFamily.length).toBeGreaterThan(0);
    }
  });

  it("marks active process when step code is provided", () => {
    expect(getProcessForStep("GR")).toBe("PROC-GR");
    const ctx = buildProcessContext("SCN-002", "GR");
    expect(ctx.activeProcessId).toBe("PROC-GR");
    expect(ctx.cards.find((c) => c.processId === "PROC-GR")?.isActiveForStep).toBe(true);
  });

  it("includes bilingual learning transfer on each card", () => {
    const ctx = buildProcessContext("SCN-001", null);
    for (const card of ctx.cards) {
      expect(card.titleFr.length).toBeGreaterThan(0);
      expect(card.titleEn.length).toBeGreaterThan(0);
      expect(card.learningTransferFr.length).toBeGreaterThan(0);
      expect(card.learningTransferEn.length).toBeGreaterThan(0);
    }
  });
});
