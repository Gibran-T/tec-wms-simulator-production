import type { M4KpiSnapshot } from "@/data/m4KpiBandUtils";
import {
  formatM4Capital,
  formatM4ErrorPct,
  formatM4LeadTime,
  formatM4ServicePct,
} from "@/data/m4KpiBandUtils";

const SCN_LENS: Record<string, { fr: string; en: string }> = {
  "SCN-012": {
    fr: "Lens : rotation & capital — bande normale 6×",
    en: "Lens: turnover & capital — normal 6× band",
  },
  "SCN-013": {
    fr: "Lens : service & erreurs — corrélation OTIF / 4 %",
    en: "Lens: service & errors — OTIF / 4% correlation",
  },
  "SCN-014": {
    fr: "Lens : arbitrage multi-KPI — S&OP board",
    en: "Lens: multi-KPI trade-off — S&OP board",
  },
};

function buildSnapshotLine(snapshot: M4KpiSnapshot, language: string, t: (fr: string, en: string) => string): string {
  const rotation = `${snapshot.rotationRate}×`;
  const service = formatM4ServicePct(snapshot.serviceLevel, language);
  const errors = formatM4ErrorPct(snapshot.errorRate, language);
  const lead = formatM4LeadTime(snapshot.averageLeadTime, language);
  const capital = formatM4Capital(snapshot.stockImmobilizedValue, language);

  if (language === "FR") {
    return `Snapshot KPI · ${rotation} · ${service} OTIF · ${errors} erreurs · ${lead} · ${capital}`;
  }
  return `KPI Snapshot · ${rotation} · ${service} OTIF · ${errors} errors · ${lead} · ${capital}`;
}

export default function M4KpiSnapshotHeader({
  snapshot,
  scnCode,
  language,
  t,
  variant = "cockpit",
}: {
  snapshot: M4KpiSnapshot;
  scnCode: string;
  language: string;
  t: (fr: string, en: string) => string;
  variant?: "cockpit" | "report";
}) {
  const isFr = language === "FR";
  const line1 = buildSnapshotLine(snapshot, language, t);
  const lens = SCN_LENS[scnCode];
  const line2 = lens ? (isFr ? lens.fr : lens.en) : null;

  if (variant === "report") {
    return (
      <div
        data-testid="m4-kpi-snapshot-header"
        className="p-2.5 rounded border bg-blue-50 dark:bg-blue-950/20 border-blue-200 text-xs space-y-1"
      >
        <p className="text-[10px] font-semibold uppercase text-blue-800 dark:text-blue-300">
          {t("Extrait analytique canonique", "Canonical analytical extract")}
        </p>
        <p className="font-mono text-foreground">{line1}</p>
        {line2 && <p className="text-[10px] text-muted-foreground italic">{line2}</p>}
      </div>
    );
  }

  return (
    <div
      data-testid="m4-kpi-snapshot-header"
      className="bg-slate-900 text-white text-[10px] font-mono px-4 py-2 space-y-0.5"
    >
      <p className="text-[9px] uppercase text-slate-400 font-sans font-bold tracking-wider">
        {t("Extrait analytique canonique", "Canonical analytical extract")}
      </p>
      <p>{line1}</p>
      {line2 && <p className="text-slate-400 italic font-sans">{line2}</p>}
    </div>
  );
}
