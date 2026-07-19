/** Display-only Annexe A band helpers for M4 evidence layer (mirrors rulesEngine semantics). */

export type BandColor = "red" | "amber" | "green" | "neutral";

export type M4KpiSnapshot = {
  rotationRate: number;
  serviceLevel: number;
  errorRate: number;
  averageLeadTime: number;
  stockImmobilizedValue: number;
  rotationStatus: string;
  serviceLevelStatus: string;
  errorRateStatus: string;
};

export type M4KpiInterpretationRow = {
  kpiKey: string;
  studentAnswer: string;
  isCorrect: boolean;
  feedback: string;
  pointsDelta: number;
};

export function leadTimeBand(days: number): "critical" | "normal" | "excellent" {
  if (days > 7) return "critical";
  if (days < 3) return "excellent";
  return "normal";
}

export function mapRotationStatusToBand(status: string): BandColor {
  if (status === "normal") return "amber";
  if (status === "surstock" || status === "sous-performance") return "red";
  return "neutral";
}

export function mapServiceStatusToBand(status: string): BandColor {
  if (status === "excellent") return "green";
  if (status === "acceptable") return "amber";
  return "red"; // insuffisant
}

export function mapErrorStatusToBand(status: string): BandColor {
  if (status === "excellent") return "green";
  if (status === "acceptable") return "amber";
  return "red"; // critique
}

export function mapLeadTimeBandToColor(band: ReturnType<typeof leadTimeBand>): BandColor {
  if (band === "excellent") return "green";
  if (band === "normal") return "amber";
  return "red";
}

export function getBandClasses(color: BandColor): { border: string; bg: string; text: string } {
  switch (color) {
    case "red":
      return {
        border: "border-red-400",
        bg: "bg-red-50 dark:bg-red-950/20",
        text: "text-red-700 dark:text-red-400",
      };
    case "green":
      return {
        border: "border-green-500",
        bg: "bg-green-50 dark:bg-green-950/20",
        text: "text-green-700 dark:text-green-400",
      };
    case "amber":
      return {
        border: "border-amber-400",
        bg: "bg-amber-50 dark:bg-amber-950/20",
        text: "text-amber-800 dark:text-amber-400",
      };
    default:
      return {
        border: "border-slate-300 dark:border-slate-600",
        bg: "bg-slate-50 dark:bg-slate-800/50",
        text: "text-slate-600 dark:text-slate-400",
      };
  }
}

export function rotationBandLabel(status: string, language: string): string {
  const isFr = language === "FR";
  if (status === "normal") return isFr ? "Normal (4–12×/an)" : "Normal (4–12×/yr)";
  if (status === "surstock") {
    return isFr ? "Risque de surstock (<4×)" : "Overstock risk (<4×)";
  }
  // Internal engine status remains "sous-performance"; visible copy uses risk framing.
  if (status === "sous-performance") {
    return isFr
      ? "Risque stock trop serré (>12×)"
      : "Tight stock risk (>12×)";
  }
  return status;
}

export function serviceBandLabel(status: string, language: string): string {
  const isFr = language === "FR";
  if (status === "excellent") return isFr ? "Excellent (≥ 95 %)" : "Excellent (≥ 95%)";
  if (status === "acceptable") return isFr ? "Acceptable (85–94 %)" : "Acceptable (85–94%)";
  if (status === "insuffisant") return isFr ? "Critique (< 85 %)" : "Critical (< 85%)";
  return status;
}

export function errorBandLabel(status: string, language: string): string {
  const isFr = language === "FR";
  if (status === "excellent") return isFr ? "Excellent (< 1 %)" : "Excellent (< 1%)";
  if (status === "acceptable") return isFr ? "Normal (1–5 %)" : "Normal (1–5%)";
  if (status === "critique") return isFr ? "Critique (> 5 %)" : "Critical (> 5%)";
  return status;
}

export function leadTimeBandLabel(band: ReturnType<typeof leadTimeBand>, language: string): string {
  const isFr = language === "FR";
  if (band === "excellent") return isFr ? "Excellent (< 3 j)" : "Excellent (< 3 days)";
  if (band === "normal") return isFr ? "Normal (3–7 j)" : "Normal (3–7 days)";
  return isFr ? "Critique (> 7 j)" : "Critical (> 7 days)";
}

export function formatM4ServicePct(serviceLevel: number, language: string): string {
  const pct = serviceLevel <= 1 ? serviceLevel * 100 : serviceLevel;
  return language === "FR" ? `${pct.toFixed(1).replace(".", ",")} %` : `${pct.toFixed(1)}%`;
}

export function formatM4ErrorPct(errorRate: number, language: string): string {
  const pct = errorRate <= 1 ? errorRate * 100 : errorRate;
  return language === "FR" ? `${pct.toFixed(1).replace(".", ",")} %` : `${pct.toFixed(1)}%`;
}

export function formatM4LeadTime(days: number, language: string): string {
  const val = days.toFixed(1).replace(".", ",");
  return language === "FR" ? `${val} j` : `${days.toFixed(1)} d`;
}

export function formatM4Capital(value: number, language: string): string {
  const formatted = value.toLocaleString(language === "FR" ? "fr-CA" : "en-CA");
  return `${formatted} $`;
}

export function getM4EmphasisKeys(scnCode: string): string[] {
  if (scnCode === "SCN-012") return ["rotation"];
  if (scnCode === "SCN-013") return ["service", "errorRate"];
  if (scnCode === "SCN-014") return ["rotation", "service", "errorRate", "leadTime"];
  return [];
}

export const M4_EVIDENCE_SCNS = ["SCN-012", "SCN-013", "SCN-014"] as const;

export function isM4EvidenceScn(moduleId: number, scnCode: string | null | undefined): boolean {
  return moduleId === 4 && !!scnCode && (M4_EVIDENCE_SCNS as readonly string[]).includes(scnCode);
}
