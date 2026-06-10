/** Canonical student scenario report path (runId is the simulation run id). */
export function studentRunReportPath(runId: number | string): string {
  return `/student/run/${runId}/report`;
}

/** Legacy path kept for redirects after Mission Control migration. */
export function legacyStudentRunReportPath(runId: number | string): string {
  return `/student/report/${runId}`;
}
