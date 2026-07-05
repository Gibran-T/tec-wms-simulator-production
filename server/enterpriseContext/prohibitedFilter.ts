import type { EnterpriseContextPayload } from "../../shared/enterpriseContext/types";

/** Patterns that must never appear in assembled enterprise context (AI Mentor §6.5). */
const PROHIBITED_PATTERNS: RegExp[] = [
  /correctIndex/i,
  /canonical answer/i,
  /click\s+«?\s*Poster\s*\(MIGO\)/i,
  /Ne pas créer une nouvelle GR/i,
  /R1–R3|R1-R3/i,
  /keyword:\s*[\w-]+/i,
  /expectedKpiValue/i,
  /complianceAnswer/i,
];

const PROHIBITED_SUBSTRINGS = [
  "correctIndex",
  "expectedDiagnostic",
  "canonicalCompliance",
];

function scanValue(value: unknown, path: string, violations: string[]): void {
  if (value == null) return;

  if (typeof value === "string") {
    for (const pattern of PROHIBITED_PATTERNS) {
      if (pattern.test(value)) {
        violations.push(`${path}: pattern ${pattern.source}`);
      }
    }
    for (const sub of PROHIBITED_SUBSTRINGS) {
      if (value.includes(sub)) {
        violations.push(`${path}: substring ${sub}`);
      }
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, i) => scanValue(item, `${path}[${i}]`, violations));
    return;
  }

  if (typeof value === "object") {
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      scanValue(nested, `${path}.${key}`, violations);
    }
  }
}

/** Strip studentActions, controlPoints, and other canonical execution hints from mission-derived strings. */
export function sanitizeMissionText(text: string): string {
  return text
    .replace(/ME21N|MIGO|LT0A|VL01N|VL02N|MI01|MB52/gi, "[WMS transaction]")
    .replace(/Poster\s*\([^)]+\)/gi, "[post transaction]");
}

/**
 * Validates assembled payload and returns a filtered copy safe for client/AI consumption.
 * Mission studentActions and evalGuidance are never included in context blocks by design.
 */
export function applyProhibitedContextFilter(
  payload: EnterpriseContextPayload
): EnterpriseContextPayload {
  const violations: string[] = [];
  scanValue(payload, "root", violations);

  if (violations.length > 0) {
    throw new Error(`Prohibited context detected: ${violations.join("; ")}`);
  }

  return payload;
}

export function assertNoProhibitedStrings(text: string): boolean {
  const violations: string[] = [];
  scanValue(text, "text", violations);
  return violations.length === 0;
}
