import React from "react";
import { Activity } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  formatLeadTime,
  formatPercent,
  formatRotation,
  formatStockValue,
  getErrorBand,
  getLeadTimeBand,
  getRotationBand,
  getServiceBand,
  bandToBgClass,
} from "./m5KpiDisplayUtils";

type M5Evidence = {
  receivedQty: number;
  putawayQty: number;
  cycleCountQty: number | null;
  varianceQty: number;
  varianceResolved: boolean;
  stockQtyAtBin: number;
};

type M5KpiLedgerPayload = {
  kpiData: { avgLeadTimeDays: number; stockValue: number };
  kpiResult: {
    rotationRate: number;
    serviceLevel: number;
    errorRate: number;
    stockImmobilizedValue: number;
  };
  evidence: M5Evidence;
};

export default function M5KpiLedgerWidget({
  ledger,
  scnCode,
  isLoading,
}: {
  ledger: M5KpiLedgerPayload | undefined;
  scnCode: string | null;
  isLoading?: boolean;
}) {
  const { t, language } = useLanguage();
  const evidence = ledger?.evidence;
  const kpiResult = ledger?.kpiResult;
  const kpiData = ledger?.kpiData;

  const showVarianceBadge = scnCode === "SCN-016" && evidence?.varianceResolved;
  const varianceAmber = scnCode === "SCN-016" && evidence && evidence.varianceQty !== 0 && !evidence.varianceResolved;

  const tiles = [
    {
      label: t("Rotation", "Turnover"),
      value: evidence && evidence.receivedQty > 0 ? formatRotation(kpiResult?.rotationRate) : "—",
      badge: t("dérivé", "derived"),
      derived: true,
      band: kpiResult ? getRotationBand(kpiResult.rotationRate) : "normal",
    },
    {
      label: t("Service", "Service"),
      value: kpiResult ? formatPercent(kpiResult.serviceLevel) : "—",
      badge: t("contexte", "context"),
      derived: false,
      band: kpiResult ? getServiceBand(kpiResult.serviceLevel) : "normal",
    },
    {
      label: t("Erreurs", "Errors"),
      value: kpiResult ? formatPercent(kpiResult.errorRate) : "—",
      badge: t("contexte", "context"),
      derived: false,
      band: kpiResult ? getErrorBand(kpiResult.errorRate) : "normal",
    },
    {
      label: t("Délai", "Lead time"),
      value: kpiData ? formatLeadTime(kpiData.avgLeadTimeDays) : "—",
      badge: t("contexte", "context"),
      derived: false,
      band: kpiData ? getLeadTimeBand(kpiData.avgLeadTimeDays) : "normal",
    },
    {
      label: t("Stock $", "Stock $"),
      value:
        evidence && evidence.putawayQty > 0
          ? formatStockValue(kpiResult?.stockImmobilizedValue ?? kpiData?.stockValue, language)
          : "—",
      badge: t("dérivé", "derived"),
      derived: true,
      band: "normal" as const,
    },
  ];

  return (
    <div className="bg-card border border-border rounded-none shadow-sm overflow-hidden" data-testid="m5-kpi-ledger">
      <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 border-b border-border flex items-center gap-2">
        <Activity size={16} className="text-primary" />
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {t("Registre KPI — Peak Week (direct)", "KPI Ledger — Peak Week (live)")}
        </span>
        {isLoading && (
          <span className="text-[9px] font-mono text-slate-400 ml-auto animate-pulse">
            {t("sync…", "sync…")}
          </span>
        )}
      </div>

      <div className="p-3 space-y-3">
        <div
          className={`font-mono text-[10px] text-slate-600 dark:text-slate-400 flex flex-wrap gap-x-3 gap-y-1 ${
            varianceAmber ? "text-amber-800 dark:text-amber-200" : ""
          }`}
        >
          <span>
            {t("Réception", "Receipt")}: {evidence?.receivedQty ?? 0}
          </span>
          <span>·</span>
          <span>
            {t("Putaway", "Putaway")}: {evidence?.putawayQty ?? 0}
          </span>
          <span>·</span>
          <span>
            CC: {evidence?.cycleCountQty ?? "—"}
          </span>
          <span>·</span>
          <span>
            {t("Variance", "Variance")}: {evidence?.varianceQty != null ? (evidence.varianceQty > 0 ? `+${evidence.varianceQty}` : evidence.varianceQty) : "—"}
          </span>
          <span>·</span>
          <span>
            {t("Stock", "Stock")}: {evidence?.stockQtyAtBin ?? 0}
          </span>
          {showVarianceBadge && (
            <span className="px-1.5 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 text-[9px] font-bold uppercase rounded-sm">
              {t("Variance résolue ✓", "Variance resolved ✓")}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {tiles.map((tile) => (
            <div
              key={tile.label}
              className={`p-2 border text-center ${tile.derived ? bandToBgClass(tile.band) : "bg-slate-50 dark:bg-slate-800/50 border-border"}`}
            >
              <p className="text-[9px] font-bold text-slate-500 uppercase">{tile.label}</p>
              <p className="text-sm font-black font-mono text-foreground mt-0.5">{tile.value}</p>
              <p
                className={`text-[8px] font-bold uppercase mt-1 ${
                  tile.derived ? "text-primary" : "text-slate-400"
                }`}
              >
                [{tile.badge}]
              </p>
            </div>
          ))}
        </div>

        <p className="text-[9px] text-slate-500 italic border-t border-border pt-2">
          {t(
            "dérivé = moniteur · contexte = contrat Peak Week",
            "derived = monitor · context = Peak Week contract",
          )}
        </p>
      </div>
    </div>
  );
}
