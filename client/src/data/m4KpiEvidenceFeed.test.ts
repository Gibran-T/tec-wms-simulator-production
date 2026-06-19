import { describe, expect, it } from "vitest";
import {
  leadTimeBand,
  mapErrorStatusToBand,
  mapRotationStatusToBand,
  mapServiceStatusToBand,
  mapLeadTimeBandToColor,
} from "./m4KpiBandUtils";
import { getRowIdsUnlockedByStep, getVisibleM4EvidenceRows } from "./m4KpiEvidenceFeed";

describe("m4KpiBandUtils — canonical bands", () => {
  it("maps canonical rotation status to amber (normal)", () => {
    expect(mapRotationStatusToBand("normal")).toBe("amber");
  });

  it("maps canonical service status to green (excellent)", () => {
    expect(mapServiceStatusToBand("excellent")).toBe("green");
  });

  it("maps canonical error status to amber (acceptable)", () => {
    expect(mapErrorStatusToBand("acceptable")).toBe("amber");
  });

  it("maps lead time 3.5d to normal/amber", () => {
    expect(leadTimeBand(3.5)).toBe("normal");
    expect(mapLeadTimeBandToColor(leadTimeBand(3.5))).toBe("amber");
  });
});

describe("m4KpiEvidenceFeed — row gating", () => {
  it("unlocks MB52 + ME2M after KPI_DATA for all SCN", () => {
    const rows = getVisibleM4EvidenceRows(["KPI_DATA"], "SCN-012");
    expect(rows.map((r) => r.id)).toEqual(
      expect.arrayContaining(["mb52-consumption", "me2m-leadtime", "scn012-copa-capital"]),
    );
    expect(rows.length).toBeGreaterThanOrEqual(3);
  });

  it("includes SCN-013 correlation row after KPI_DATA", () => {
    const ids = getRowIdsUnlockedByStep("KPI_DATA", "SCN-013");
    expect(ids).toContain("scn013-vl06o-headline");
  });

  it("includes SCN-014 S&OP row after KPI_DATA", () => {
    const ids = getRowIdsUnlockedByStep("KPI_DATA", "SCN-014");
    expect(ids).toContain("scn014-sac-pipeline");
  });

  it("adds VL06O + QM rows after KPI_SERVICE", () => {
    const rows = getVisibleM4EvidenceRows(
      ["KPI_DATA", "KPI_ROTATION", "KPI_SERVICE"],
      "SCN-013",
    );
    expect(rows.map((r) => r.source)).toEqual(
      expect.arrayContaining(["VL06O", "QM"]),
    );
  });

  it("ISO row shows PASS when all interpretations correct", () => {
    const rows = getVisibleM4EvidenceRows(
      ["KPI_DATA", "KPI_ROTATION", "KPI_SERVICE", "KPI_DIAGNOSTIC", "COMPLIANCE_M4"],
      "SCN-012",
      [
        { kpiKey: "rotationRate", studentAnswer: "normal", isCorrect: true, feedback: "", pointsDelta: 20 },
        { kpiKey: "serviceLevel", studentAnswer: "excellent", isCorrect: true, feedback: "", pointsDelta: 20 },
        { kpiKey: "diagnostic", studentAnswer: "x".repeat(60), isCorrect: true, feedback: "", pointsDelta: 25 },
      ],
    );
    const iso = rows.find((r) => r.id === "iso-compliance");
    expect(iso?.bandColor).toBe("green");
    expect(iso?.bandFr).toBe("PASS");
  });

  it("ISO row shows FAIL when an interpretation is incorrect", () => {
    const rows = getVisibleM4EvidenceRows(
      ["KPI_DATA", "KPI_ROTATION", "KPI_SERVICE", "KPI_DIAGNOSTIC", "COMPLIANCE_M4"],
      "SCN-012",
      [
        { kpiKey: "rotationRate", studentAnswer: "surstock", isCorrect: false, feedback: "", pointsDelta: -5 },
      ],
    );
    const iso = rows.find((r) => r.id === "iso-compliance");
    expect(iso?.bandColor).toBe("red");
    expect(iso?.bandFr).toBe("FAIL");
  });
});
