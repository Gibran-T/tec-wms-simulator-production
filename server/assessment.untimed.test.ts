/**
 * Untimed duration contract + Eval1 constant.
 */
import { describe, expect, it } from "vitest";
import {
  formatAssessmentDurationLabel,
  isUntimedDuration,
  toStoredDurationMinutes,
  UNTIMED_DURATION_MINUTES,
  UNTIMED_EXPIRES_AT_SENTINEL,
  warnThresholds,
} from "../shared/assessmentCore";
import { EVAL1_DURATION_MINUTES } from "../shared/eval1QuestionBank";

describe("untimed assessment duration contract", () => {
  it("Eval1 is canonically untimed (null)", () => {
    expect(EVAL1_DURATION_MINUTES).toBeNull();
    expect(isUntimedDuration(EVAL1_DURATION_MINUTES)).toBe(true);
  });

  it("treats null / undefined / 0 / negative as untimed", () => {
    expect(isUntimedDuration(null)).toBe(true);
    expect(isUntimedDuration(undefined)).toBe(true);
    expect(isUntimedDuration(0)).toBe(true);
    expect(isUntimedDuration(-1)).toBe(true);
    expect(isUntimedDuration(40)).toBe(false);
  });

  it("stores untimed as durationMinutes = 0 (NOT NULL column)", () => {
    expect(toStoredDurationMinutes(null)).toBe(UNTIMED_DURATION_MINUTES);
    expect(toStoredDurationMinutes(0)).toBe(0);
    expect(toStoredDurationMinutes(40)).toBe(40);
  });

  it("labels untimed in FR/EN", () => {
    expect(formatAssessmentDurationLabel(null, "FR")).toBe("Sans limite de temps");
    expect(formatAssessmentDurationLabel(0, "EN")).toBe("No time limit");
    expect(formatAssessmentDurationLabel(40, "FR")).toBe("40 min");
  });

  it("sentinel expiresAt is within MySQL TIMESTAMP range (< 2038)", () => {
    expect(UNTIMED_EXPIRES_AT_SENTINEL.getUTCFullYear()).toBeLessThan(2038);
  });

  it("warn thresholds are zero for untimed", () => {
    expect(warnThresholds(0)).toEqual({
      warn30AtSeconds: 0,
      warn35AtSeconds: 0,
    });
  });
});
