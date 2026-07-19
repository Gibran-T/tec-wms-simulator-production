/** Display-only KPI formatting and Annexe A band colours for M5 Wave 1. */

export type KpiBand = "critical" | "normal" | "excellent";

export type M5KpiResultLike = {
  rotationRate: number;
  serviceLevel: number;
  errorRate: number;
  averageLeadTime: number;
  stockImmobilizedValue: number;
};

export function formatRotation(rate: number | null | undefined): string {
  if (rate == null || rate <= 0) return "—";
  return `${rate.toFixed(1)}×`;
}

export function formatPercent(rate: number | null | undefined): string {
  if (rate == null) return "—";
  const pct = rate <= 1 ? rate * 100 : rate;
  return `${pct.toFixed(1)}%`;
}

export function formatLeadTime(days: number | null | undefined): string {
  if (days == null) return "—";
  return `${days} j`;
}

export function formatStockValue(value: number | null | undefined, language: string): string {
  if (value == null || value <= 0) return "—";
  return language === "FR"
    ? `${value.toLocaleString("fr-CA")} $`
    : `$${value.toLocaleString("en-CA")}`;
}

export function getRotationBand(rate: number): KpiBand {
  // Band thresholds unchanged: <4 and >12 are out-of-band (critical colour).
  // Visible copy uses risk framing — not automatic « sous-performance ».
  if (rate < 4) return "critical";
  if (rate > 12) return "critical";
  return "normal";
}

export function getServiceBand(serviceLevel: number): KpiBand {
  const pct = serviceLevel <= 1 ? serviceLevel * 100 : serviceLevel;
  // Align with calculateKpis: <85 insuffisant · 85–94 acceptable · ≥95 excellent
  if (pct < 85) return "critical";
  if (pct >= 95) return "excellent";
  return "normal";
}

export function getErrorBand(errorRate: number): KpiBand {
  const pct = errorRate <= 1 ? errorRate * 100 : errorRate;
  if (pct > 5) return "critical";
  if (pct < 1) return "excellent";
  return "normal";
}

export function getLeadTimeBand(days: number): KpiBand {
  if (days > 7) return "critical";
  if (days < 3) return "excellent";
  return "normal";
}

export function bandToColor(band: KpiBand): string {
  if (band === "critical") return "#ef4444";
  if (band === "excellent") return "#22c55e";
  return "#f59e0b";
}

export function bandToBgClass(band: KpiBand): string {
  if (band === "critical") return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800";
  if (band === "excellent") return "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800";
  return "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800";
}
