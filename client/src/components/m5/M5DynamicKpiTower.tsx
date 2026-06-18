import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { M5KpiTowerEntry } from "@/data/m5KpiControlTower";
import {
  bandToBgClass,
  formatLeadTime,
  formatPercent,
  formatRotation,
  formatStockValue,
  getErrorBand,
  getLeadTimeBand,
  getRotationBand,
  getServiceBand,
} from "./m5KpiDisplayUtils";

type M5KpiLedgerPayload = {
  kpiData: { avgLeadTimeDays: number; stockValue: number };
  kpiResult: {
    rotationRate: number;
    serviceLevel: number;
    errorRate: number;
    stockImmobilizedValue: number;
  };
  evidence: {
    receivedQty: number;
    putawayQty: number;
    varianceQty: number;
    varianceResolved: boolean;
  };
};

function MissionFramingBlock({
  entry,
  t,
  language,
}: {
  entry: M5KpiTowerEntry;
  t: (fr: string, en: string) => string;
  language: string;
}) {
  const isFr = language === "FR";
  const rows = [
    { label: t("KPI évalué", "KPI evaluated"), value: isFr ? entry.kpiEvaluated.fr : entry.kpiEvaluated.en },
    { label: t("Focus diagnostic", "Diagnostic focus"), value: isFr ? entry.diagnosticFocus.fr : entry.diagnosticFocus.en },
    { label: t("Alerte / risque", "Alert / risk"), value: isFr ? entry.alertRisk.fr : entry.alertRisk.en, alert: true },
    { label: t("Sortie attendue", "Expected output"), value: isFr ? entry.expectedOutput.fr : entry.expectedOutput.en },
  ];
  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div
          key={row.label}
          className={`p-2 border ${row.alert ? "bg-amber-50 dark:bg-amber-950/20 border-amber-300" : "bg-slate-50 dark:bg-slate-800/50 border-border"}`}
        >
          <p className="text-[9px] font-bold text-slate-500 uppercase">{row.label}</p>
          <p className="text-[10px] text-foreground mt-0.5 leading-relaxed">{row.value}</p>
        </div>
      ))}
    </div>
  );
}

function LiveReadingsBlock({
  ledger,
  targetLine,
  t,
  language,
  snapshotLocked,
}: {
  ledger: M5KpiLedgerPayload | undefined;
  targetLine: string;
  t: (fr: string, en: string) => string;
  language: string;
  snapshotLocked?: boolean;
}) {
  const evidence = ledger?.evidence;
  const kpiResult = ledger?.kpiResult;
  const kpiData = ledger?.kpiData;

  const tiles = [
    {
      label: t("Rotation", "Turnover"),
      live: evidence && evidence.receivedQty > 0 ? formatRotation(kpiResult?.rotationRate) : "—",
      band: kpiResult ? getRotationBand(kpiResult.rotationRate) : "normal",
      derived: true,
    },
    {
      label: t("Service", "Service"),
      live: kpiResult ? formatPercent(kpiResult.serviceLevel) : "—",
      band: kpiResult ? getServiceBand(kpiResult.serviceLevel) : "normal",
      derived: false,
    },
    {
      label: t("Erreurs", "Errors"),
      live: kpiResult ? formatPercent(kpiResult.errorRate) : "—",
      band: kpiResult ? getErrorBand(kpiResult.errorRate) : "normal",
      derived: false,
    },
    {
      label: t("Délai", "Lead time"),
      live: kpiData ? formatLeadTime(kpiData.avgLeadTimeDays) : "—",
      band: kpiData ? getLeadTimeBand(kpiData.avgLeadTimeDays) : "normal",
      derived: false,
    },
    {
      label: t("Stock $", "Stock $"),
      live:
        evidence && evidence.putawayQty > 0
          ? formatStockValue(kpiResult?.stockImmobilizedValue ?? kpiData?.stockValue, language)
          : "—",
      band: "normal" as const,
      derived: true,
    },
  ];

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold text-slate-500 uppercase">
        {snapshotLocked
          ? t("Lectures KPI — snapshot verrouillé", "KPI readings — snapshot locked")
          : t("Lectures KPI — direct", "KPI readings — live")}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className={`p-2 border text-center ${tile.derived ? bandToBgClass(tile.band) : "bg-slate-50 dark:bg-slate-800/50 border-border"}`}
          >
            <p className="text-[8px] font-bold text-slate-500 uppercase">{tile.label}</p>
            <p className="text-xs font-black font-mono">{tile.live}</p>
            {!tile.derived && (
              <p className="text-[7px] text-slate-400 uppercase mt-0.5">{t("contexte", "context")}</p>
            )}
          </div>
        ))}
      </div>
      <p className="text-[9px] text-slate-500 font-mono italic">
        {t("Cible contrat", "Contract target")}: {targetLine}
      </p>
    </div>
  );
}

export default function M5DynamicKpiTower({
  entry,
  ledger,
  scnCode,
  completedSteps,
}: {
  entry: M5KpiTowerEntry;
  ledger: M5KpiLedgerPayload | undefined;
  scnCode: string | null;
  completedSteps: string[];
}) {
  const { t, language } = useLanguage();
  const isFr = language === "FR";
  const targetLine = isFr ? entry.target.fr : entry.target.en;
  const snapshotLocked = completedSteps.includes("M5_KPI");

  return (
    <div className="space-y-3" data-testid="m5-dynamic-kpi-tower">
      <p className="text-[10px] font-bold text-primary uppercase">
        {t("Tour de contrôle KPI — Module 5", "KPI Control Tower — Module 5")}
      </p>

      <MissionFramingBlock entry={entry} t={t} language={language} />

      {entry.varianceSignal && scnCode === "SCN-016" && (
        <div className="p-2 bg-red-50 dark:bg-red-950/30 border border-red-300 text-[10px] text-red-800 dark:text-red-200">
          <p className="font-bold uppercase">{t("Signal variance", "Variance signal")}</p>
          <p>{isFr ? entry.varianceSignal.fr : entry.varianceSignal.en}</p>
          {ledger?.evidence?.varianceResolved && (
            <p className="mt-1 text-green-700 dark:text-green-300 font-semibold">
              {t("Variance résolue — KPI débloqué", "Variance resolved — KPI unblocked")}
            </p>
          )}
        </div>
      )}

      <LiveReadingsBlock
        ledger={ledger}
        targetLine={targetLine}
        t={t}
        language={language}
        snapshotLocked={snapshotLocked}
      />
    </div>
  );
}
