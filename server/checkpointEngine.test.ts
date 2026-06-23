import { describe, expect, it } from "vitest";
import { getModuleScenarioPassThreshold } from "@shared/moduleThresholds";
import { OFFICIAL_SCN_BY_MODULE } from "./canonicalScenarios";
import {
  buildModuleCheckpointSnapshot,
  CHECKPOINT_MODULE_IDS,
  computeCheckpointPassed,
  computeProgressPct,
  isCheckpointModule,
  scnKeysForModule,
  type ScnCheckpointStatus,
} from "./checkpointEngine";
import { goldScnKeyFromCode } from "./goldCertification";

function scnStatus(passed: boolean, score: number | null = passed ? 80 : 50): ScnCheckpointStatus {
  return { passed, score, runId: passed ? 1 : score !== null ? 2 : null };
}

function m2Keys() {
  return scnKeysForModule(2);
}

function m3Keys() {
  return scnKeysForModule(3);
}

function m4Keys() {
  return scnKeysForModule(4);
}

function m5Keys() {
  return scnKeysForModule(5);
}

function buildStatus(
  keys: string[],
  entries: Partial<Record<string, ScnCheckpointStatus>>,
): Record<string, ScnCheckpointStatus> {
  const result: Record<string, ScnCheckpointStatus> = {};
  for (const key of keys) {
    result[key] = entries[key] ?? { passed: false, score: null, runId: null };
  }
  return result;
}

describe("Checkpoint engine — module scope", () => {
  it("CHECKPOINT_MODULE_IDS covers M2–M5 only", () => {
    expect(CHECKPOINT_MODULE_IDS).toEqual([2, 3, 4, 5]);
    expect(isCheckpointModule(1)).toBe(false);
    expect(isCheckpointModule(2)).toBe(true);
  });

  it("scnKeysForModule maps official SCN codes", () => {
    expect(m2Keys()).toEqual(["SCN006", "SCN007", "SCN008"]);
    expect(m5Keys()).toEqual(["SCN015", "SCN016", "SCN017"]);
  });
});

describe("Checkpoint engine — CK-M2", () => {
  it("CK-M2-01: M2 100% when SCN-006, 007, 008 pass", () => {
    const keys = m2Keys();
    const status = buildStatus(keys, {
      SCN006: scnStatus(true, 65),
      SCN007: scnStatus(true, 72),
      SCN008: scnStatus(true, 60),
    });
    const snap = buildModuleCheckpointSnapshot(2, status, keys, false);
    expect(snap.progressPct).toBe(100);
    expect(snap.passed).toBe(true);
    expect(snap.completedScenarios).toBe(3);
    expect(snap.requiredScenarios).toBe(3);
  });

  it("CK-M2-02: M2 partial — 2/3 SCNs", () => {
    const keys = m2Keys();
    const status = buildStatus(keys, {
      SCN006: scnStatus(true, 65),
      SCN007: scnStatus(true, 72),
      SCN008: scnStatus(false, 55),
    });
    const snap = buildModuleCheckpointSnapshot(2, status, keys, false);
    expect(snap.progressPct).toBe(67);
    expect(snap.passed).toBe(false);
  });

  it("CK-M2-03: one passing scenario must not pass module", () => {
    const keys = m2Keys();
    const status = buildStatus(keys, {
      SCN006: scnStatus(true, 80),
    });
    const snap = buildModuleCheckpointSnapshot(2, status, keys, false);
    expect(snap.passed).toBe(false);
    expect(snap.completedScenarios).toBe(1);
  });

  it("CK-M2-04: failed latest run blocks SCN credit", () => {
    const keys = m2Keys();
    const status = buildStatus(keys, {
      SCN006: scnStatus(false, 45),
      SCN007: scnStatus(true, 70),
      SCN008: scnStatus(true, 65),
    });
    const snap = buildModuleCheckpointSnapshot(2, status, keys, false);
    expect(snap.passed).toBe(false);
    expect(snap.progressPct).toBe(67);
  });
});

describe("Checkpoint engine — CK-M3", () => {
  it("CK-M3-01: M3 SCNs pass without teacher — 75% not passed", () => {
    const keys = m3Keys();
    const status = buildStatus(keys, {
      SCN009: scnStatus(true, 75),
      SCN010: scnStatus(true, 80),
      SCN011: scnStatus(true, 72),
    });
    const snap = buildModuleCheckpointSnapshot(3, status, keys, false);
    expect(snap.progressPct).toBe(75);
    expect(snap.passed).toBe(false);
  });

  it("CK-M3-02: M3 100% and passed with teacher validation", () => {
    const keys = m3Keys();
    const status = buildStatus(keys, {
      SCN009: scnStatus(true, 75),
      SCN010: scnStatus(true, 80),
      SCN011: scnStatus(true, 72),
    });
    const snap = buildModuleCheckpointSnapshot(3, status, keys, true);
    expect(snap.progressPct).toBe(100);
    expect(snap.passed).toBe(true);
  });

  it("CK-M3-03: teacher validation alone is insufficient", () => {
    const keys = m3Keys();
    const status = buildStatus(keys, {});
    const snap = buildModuleCheckpointSnapshot(3, status, keys, true);
    expect(snap.passed).toBe(false);
    expect(snap.progressPct).toBe(25);
  });
});

describe("Checkpoint engine — CK-M4", () => {
  it("CK-M4-01: M4 100% when all SCNs pass", () => {
    const keys = m4Keys();
    const status = buildStatus(keys, {
      SCN012: scnStatus(true, 75),
      SCN013: scnStatus(true, 80),
      SCN014: scnStatus(true, 72),
    });
    const snap = buildModuleCheckpointSnapshot(4, status, keys, false);
    expect(snap.progressPct).toBe(100);
    expect(snap.passed).toBe(true);
  });

  it("CK-M4-02: one failing SCN blocks module pass", () => {
    const keys = m4Keys();
    const status = buildStatus(keys, {
      SCN012: scnStatus(true, 75),
      SCN013: scnStatus(true, 80),
      SCN014: scnStatus(false, 65),
    });
    const snap = buildModuleCheckpointSnapshot(4, status, keys, false);
    expect(snap.progressPct).toBe(67);
    expect(snap.passed).toBe(false);
  });
});

describe("Checkpoint engine — CK-M5", () => {
  it("CK-M5-01: M5 100% when SCN-015–017 pass", () => {
    const keys = m5Keys();
    const status = buildStatus(keys, {
      SCN015: scnStatus(true, 75),
      SCN016: scnStatus(true, 80),
      SCN017: scnStatus(true, 72),
    });
    const snap = buildModuleCheckpointSnapshot(5, status, keys, false);
    expect(snap.progressPct).toBe(100);
    expect(snap.passed).toBe(true);
  });

  it("CK-M5-02: SCN-017 below threshold blocks pass", () => {
    const keys = m5Keys();
    const status = buildStatus(keys, {
      SCN015: scnStatus(true, 75),
      SCN016: scnStatus(true, 80),
      SCN017: scnStatus(false, 65),
    });
    const snap = buildModuleCheckpointSnapshot(5, status, keys, false);
    expect(snap.passed).toBe(false);
  });
});

describe("Checkpoint engine — CK-ISO / thresholds", () => {
  it("CK-ISO-01: snapshots are independent per module keys", () => {
    const m2 = buildModuleCheckpointSnapshot(
      2,
      buildStatus(m2Keys(), { SCN006: scnStatus(true, 70) }),
      m2Keys(),
      false,
    );
    const m3 = buildModuleCheckpointSnapshot(3, buildStatus(m3Keys(), {}), m3Keys(), false);
    expect(m2.completedScenarios).toBe(1);
    expect(m3.completedScenarios).toBe(0);
  });

  it("CK-ISO-02: demo runs are excluded at query layer (threshold alignment)", () => {
    for (const moduleId of [2, 3, 4, 5]) {
      expect(OFFICIAL_SCN_BY_MODULE[moduleId]).toHaveLength(3);
      expect(getModuleScenarioPassThreshold(moduleId)).toBe(moduleId === 2 ? 60 : 70);
    }
  });

  it("uses goldScnKeyFromCode consistently", () => {
    expect(goldScnKeyFromCode("SCN-009")).toBe("SCN009");
  });
});

describe("Checkpoint engine — CK-TRG helpers", () => {
  it("CK-TRG-01: teacher validation bumps M3 progressPct 75→100", () => {
    const keys = m3Keys();
    const status = buildStatus(keys, {
      SCN009: scnStatus(true, 75),
      SCN010: scnStatus(true, 80),
      SCN011: scnStatus(true, 72),
    });
    const before = buildModuleCheckpointSnapshot(3, status, keys, false);
    const after = buildModuleCheckpointSnapshot(3, status, keys, true);
    expect(before.progressPct).toBe(75);
    expect(after.progressPct).toBe(100);
    expect(before.passed).toBe(false);
    expect(after.passed).toBe(true);
  });

  it("CK-TRG-02: completedAt preserved when already passed", () => {
    const keys = m2Keys();
    const status = buildStatus(keys, {
      SCN006: scnStatus(true, 65),
      SCN007: scnStatus(true, 72),
      SCN008: scnStatus(true, 60),
    });
    const prior = new Date("2026-01-15T12:00:00Z");
    const snap = buildModuleCheckpointSnapshot(2, status, keys, false, prior);
    expect(snap.completedAt).toEqual(prior);
  });

  it("computeCheckpointPassed requires all SCNs at threshold", () => {
    expect(computeCheckpointPassed(2, 3, 3, true, false)).toBe(true);
    expect(computeCheckpointPassed(2, 2, 3, false, false)).toBe(false);
    expect(computeCheckpointPassed(3, 3, 3, true, false)).toBe(false);
    expect(computeCheckpointPassed(3, 3, 3, true, true)).toBe(true);
  });

  it("computeProgressPct matches module formulas", () => {
    expect(computeProgressPct(2, 2, 3, false)).toBe(67);
    expect(computeProgressPct(3, 3, 3, false)).toBe(75);
    expect(computeProgressPct(3, 3, 3, true)).toBe(100);
  });
});
