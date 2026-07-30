import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { M5KpiTowerEntry } from "@/data/m5KpiControlTower";
import type { M5SessionEvidenceV1 } from "../../../../shared/m5SessionEvidence";

type M5KpiLedgerPayload = {
  evidence: {
    receivedQty: number;
    putawayQty: number;
    varianceQty: number;
    varianceResolved: boolean;
  };
  sessionEvidence?: M5SessionEvidenceV1 | null;
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
    { label: t("Preuves évaluées", "Evidence evaluated"), value: isFr ? entry.kpiEvaluated.fr : entry.kpiEvaluated.en },
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

function fmtPct(v: number | undefined): string {
  if (v == null) return "—";
  return `${(v * 100).toFixed(0)}%`;
}

function LiveReadingsBlock({
  ledger,
  targetLine,
  t,
  snapshotLocked,
}: {
  ledger: M5KpiLedgerPayload | undefined;
  targetLine: string;
  t: (fr: string, en: string) => string;
  snapshotLocked?: boolean;
}) {
  const session = ledger?.sessionEvidence;

  const tiles = [
    { label: t("Parcours", "Pathway"), live: fmtPct(session?.sessionJourneyCompletionRate ?? session?.executionCompletionRate) },
    { label: t("Exact. avant", "Acc. before"), live: fmtPct(session?.inventoryAccuracyBefore) },
    { label: t("Exact. après", "Acc. after"), live: fmtPct(session?.inventoryAccuracyAfter) },
    {
      label: t("Variance", "Variance"),
      live:
        session?.varianceInitialQty != null
          ? session.varianceInitialQty > 0
            ? `+${session.varianceInitialQty}`
            : String(session.varianceInitialQty)
          : "—",
    },
    {
      label: t("Stock / Q", "Stock / Q"),
      live:
        session?.finalStockQty != null || session?.replenishmentQty != null
          ? `${session?.finalStockQty ?? "—"} / Q=${session?.replenishmentQty ?? "—"}`
          : "—",
    },
  ];

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold text-slate-500 uppercase">
        {snapshotLocked
          ? t("Preuves de session — enregistrées", "Session evidence — recorded")
          : t("Preuves de session — direct", "Session evidence — live")}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
        {tiles.map((tile) => (
          <div key={tile.label} className="p-2 border text-center bg-slate-50 dark:bg-slate-800/50 border-border">
            <p className="text-[8px] font-bold text-slate-500 uppercase">{tile.label}</p>
            <p className="text-xs font-black font-mono">{tile.live}</p>
            <p className="text-[7px] text-primary uppercase mt-0.5">{t("session", "session")}</p>
          </div>
        ))}
      </div>
      <p className="text-[9px] text-slate-500 font-mono italic">
        {t("Cible contrat", "Contract target")}: {targetLine}
      </p>
      <p className="text-[8px] text-slate-400 italic">
        {t(
          "Portfolio M4 non affiché comme preuve de session.",
          "M4 portfolio is not shown as session evidence.",
        )}
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
        {t("Tour de contrôle — Preuves de session M5", "Control tower — M5 session evidence")}
      </p>

      <MissionFramingBlock entry={entry} t={t} language={language} />

      {entry.varianceSignal && scnCode === "SCN-016" && (
        <div className="p-2 bg-red-50 dark:bg-red-950/30 border border-red-300 text-[10px] text-red-800 dark:text-red-200">
          <p className="font-bold uppercase">{t("Signal variance", "Variance signal")}</p>
          <p>{isFr ? entry.varianceSignal.fr : entry.varianceSignal.en}</p>
          {ledger?.evidence?.varianceResolved && (
            <p className="mt-1 text-green-700 dark:text-green-300 font-semibold">
              {t("Variance résolue — décision débloquée", "Variance resolved — decision unblocked")}
            </p>
          )}
        </div>
      )}

      <LiveReadingsBlock
        ledger={ledger}
        targetLine={targetLine}
        t={t}
        snapshotLocked={snapshotLocked}
      />
    </div>
  );
}
