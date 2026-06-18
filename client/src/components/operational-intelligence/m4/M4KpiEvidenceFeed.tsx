import { useEffect, useMemo, useRef, useState } from "react";
import { getVisibleM4EvidenceRows } from "@/data/m4KpiEvidenceFeed";
import type { M4KpiInterpretationRow } from "@/data/m4KpiBandUtils";

function bandChipClasses(color: "red" | "amber" | "green" | "neutral" | undefined): string {
  switch (color) {
    case "red":
      return "bg-red-100 text-red-700 border-red-300";
    case "green":
      return "bg-green-100 text-green-700 border-green-300";
    case "amber":
      return "bg-amber-100 text-amber-800 border-amber-300";
    default:
      return "bg-slate-100 text-slate-600 border-slate-300";
  }
}

export default function M4KpiEvidenceFeed({
  scnCode,
  completedSteps,
  kpiInterpretations,
  language,
  t,
}: {
  scnCode: string;
  completedSteps: string[];
  kpiInterpretations?: M4KpiInterpretationRow[];
  language: string;
  t: (fr: string, en: string) => string;
}) {
  const isFr = language === "FR";
  const rows = useMemo(
    () => getVisibleM4EvidenceRows(completedSteps, scnCode, kpiInterpretations),
    [completedSteps, scnCode, kpiInterpretations],
  );

  const prevCountRef = useRef(rows.length);
  const [pulsingIds, setPulsingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (rows.length > prevCountRef.current) {
      const newRows = rows.slice(prevCountRef.current);
      const ids = new Set(newRows.filter((r) => r.animate).map((r) => r.id));
      if (ids.size > 0) {
        setPulsingIds(ids);
        const timer = setTimeout(() => setPulsingIds(new Set()), 3000);
        prevCountRef.current = rows.length;
        return () => clearTimeout(timer);
      }
    }
    prevCountRef.current = rows.length;
  }, [rows]);

  const displayRows = [...rows].reverse();

  return (
    <div data-testid="m4-kpi-evidence-feed">
      <p className="px-4 py-2 text-[10px] text-slate-600 dark:text-slate-400 border-b border-border bg-amber-50/50 dark:bg-amber-950/10 italic">
        {t(
          "Extracts analytiques (lecture seule) — pas de transactions WMS",
          "Analytical extracts (read-only) — no WMS transactions",
        )}
      </p>
      {displayRows.length === 0 ? (
        <p className="px-4 py-6 text-center text-slate-400 italic text-[10px]">
          {t("Complétez KPI_DATA pour charger les extracts.", "Complete KPI_DATA to load extracts.")}
        </p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900 border-b border-border">
              <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">{t("Heure", "Time")}</th>
              <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">{t("Source", "Source")}</th>
              <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">{t("Événement", "Event")}</th>
              <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">{t("Valeur", "Value")}</th>
              <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">{t("Bande", "Band")}</th>
            </tr>
          </thead>
          <tbody className="text-[10px] font-mono">
            {displayRows.map((row) => (
              <tr
                key={row.id}
                data-testid={`m4-evidence-row-${row.id}`}
                className={`border-b border-border hover:bg-slate-50 dark:hover:bg-slate-800/50 ${pulsingIds.has(row.id) ? "animate-pulse" : ""}`}
              >
                <td className="px-4 py-2 text-slate-500">{row.timestamp}</td>
                <td className="px-4 py-2 font-bold text-primary">{row.source}</td>
                <td className="px-4 py-2">{isFr ? row.labelFr : row.labelEn}</td>
                <td className="px-4 py-2 text-slate-700 dark:text-slate-300">{isFr ? row.valueFr : row.valueEn}</td>
                <td className="px-4 py-2">
                  {(row.bandFr || row.bandEn) && (
                    <span className={`px-1.5 py-0.5 text-[9px] font-bold border rounded-sm ${bandChipClasses(row.bandColor)}`}>
                      {isFr ? row.bandFr : row.bandEn}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
