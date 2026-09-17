import { describe, expect, it } from "vitest";
import { buildSilverNotAwardedCopy, formatSilverBanner } from "./silverTransparency";

const allScenarios = {
  SCN001: true,
  SCN002: true,
  SCN003: true,
  SCN004: true,
  SCN005: true,
};

describe("Silver transparency copy", () => {
  it("returns null when Silver is already awarded", () => {
    expect(
      buildSilverNotAwardedCopy({
        quizPassed: true,
        scenariosCompleted: allScenarios,
        complianceValidated: true,
        noBlockers: true,
        silverEligible: true,
        silverCertified: true,
      }),
    ).toBeNull();
  });

  it("names unresolved cycle counts with run id — James 88% pattern", () => {
    const copy = buildSilverNotAwardedCopy({
      quizPassed: true,
      scenariosCompleted: allScenarios,
      complianceValidated: true,
      noBlockers: false,
      silverEligible: false,
      silverCertified: false,
      blockers: [
        {
          kind: "unresolved_cycle_counts",
          scnCode: "SCN-001",
          runId: 797,
          count: 1,
          sku: "SKU-001",
          bin: "B-01-R1-L1",
          variance: 0,
        },
        {
          kind: "unresolved_cycle_counts",
          scnCode: "SCN-002",
          runId: 647,
          count: 1,
          variance: 0,
        },
        {
          kind: "unresolved_cycle_counts",
          scnCode: "SCN-003",
          runId: 430,
          count: 1,
          variance: 0,
        },
      ],
    });
    expect(copy).toBeTruthy();
    expect(copy!.bannerFr).toMatch(/^Silver non obtenue — raison :/);
    expect(copy!.bannerFr).toContain("Action requise :");
    expect(copy!.reasonFr).toContain("SCN-001 (run 797)");
    expect(copy!.reasonFr).toContain("comptage");
    expect(copy!.reasonFr).toContain("écart 0");
    expect(copy!.actionFr).toMatch(/Évaluation/);
    expect(copy!.bannerEn).toMatch(/^Silver not awarded — reason:/);
    expect(copy!.reasonEn).toContain("unresolved cycle count");
    expect(copy!.reasonEn).toContain("run 647");
    expect(formatSilverBanner({
      quizPassed: true,
      scenariosCompleted: allScenarios,
      complianceValidated: true,
      noBlockers: false,
      silverEligible: false,
      silverCertified: false,
      blockers: [{ kind: "unresolved_cycle_counts", scnCode: "SCN-001", runId: 797, count: 1, variance: 0 }],
    }, "FR")).toContain("run 797");
  });

  it("does not invent a fake reason when blockers array is empty", () => {
    const copy = buildSilverNotAwardedCopy({
      quizPassed: true,
      scenariosCompleted: allScenarios,
      complianceValidated: true,
      noBlockers: false,
      silverEligible: false,
      silverCertified: false,
      blockers: [],
    });
    expect(copy!.reasonFr).toMatch(/transactions non postées ou comptages cycliques/);
    expect(copy!.reasonEn).toMatch(/unposted transactions or open cycle counts/);
  });
});
