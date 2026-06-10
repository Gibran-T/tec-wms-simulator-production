import { describe, expect, it } from "vitest";
import { legacyStudentRunReportPath, studentRunReportPath } from "../shared/reportRoutes";

describe("student run report routes", () => {
  it("uses canonical /student/run/:runId/report path", () => {
    expect(studentRunReportPath(42)).toBe("/student/run/42/report");
  });

  it("legacy path redirects to canonical path", () => {
    expect(legacyStudentRunReportPath(7)).toBe("/student/report/7");
    expect(studentRunReportPath(7)).toBe("/student/run/7/report");
  });
});
