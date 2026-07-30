import React from "react";
import { Activity } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { M5SessionEvidenceV1 } from "../../../../shared/m5SessionEvidence";

type M5Evidence = {
  receivedQty: number;
  putawayQty: number;
  cycleCountQty: number | null;
  varianceQty: number;
  varianceResolved: boolean;
  stockQtyAtBin: number;
  replenishmentQty?: number | null;
};

type M5KpiLedgerPayload = {
  evidence: M5Evidence;
  sessionEvidence?: M5SessionEvidenceV1 | null;
  legacyPortfolioHidden?: boolean;
};

function fmtPct(v: number | undefined): string {
  if (v == null) return "—";
  return `${(v * 100).toFixed(0)}%`;
}

function fmtNum(v: number | undefined | null): string {
  if (v == null) return "—";
  return String(v);
}

export default function M5KpiLedgerWidget({
  ledger,
  scnCode,
  isLoading,
}: {
  ledger: M5KpiLedgerPayload | undefined;
  scnCode: string | null;
  isLoading?: boolean;
}) {
  const { t } = useLanguage();
  const evidence = ledger?.evidence;
  const session = ledger?.sessionEvidence;

  const showVarianceBadge = scnCode === "SCN-016" && evidence?.varianceResolved;
  const varianceAmber = scnCode === "SCN-016" && evidence && evidence.varianceQty !== 0 && !evidence.varianceResolved;

  const tiles = [
    {
      label: t("Taux de complétion du parcours", "Pathway completion rate"),
      value: fmtPct(session?.sessionJourneyCompletionRate ?? session?.executionCompletionRate),
    },
    {
      label: t("Exact. avant", "Acc. before"),
      value: fmtPct(session?.inventoryAccuracyBefore),
    },
    {
      label: t("Exact. après", "Acc. after"),
      value: fmtPct(session?.inventoryAccuracyAfter),
    },
    {
      label: t("Variance", "Variance"),
      value: session?.varianceInitialQty != null
        ? (session.varianceInitialQty > 0 ? `+${session.varianceInitialQty}` : String(session.varianceInitialQty))
        : "—",
    },
    {
      label: t("Stock final", "Final stock"),
      value: fmtNum(session?.finalStockQty ?? evidence?.stockQtyAtBin),
    },
    {
      label: t("Q réappro", "Replenish Q"),
      value: fmtNum(session?.replenishmentQty),
    },
    {
      label: t("Issues non résolues", "Unresolved issues"),
      value: fmtNum(session?.unresolvedIssueCount),
    },
    {
      label: t("Conformité", "Compliance"),
      value: session?.finalComplianceStatus ?? "—",
    },
    ...(session?.cycleTimeMinutes != null
      ? [{
          label: t("Temps simulateur (min)", "Simulator elapsed (min)"),
          value: fmtNum(session.cycleTimeMinutes),
        }]
      : []),
  ];

  return (
    <div className="bg-card border border-border rounded-none shadow-sm overflow-hidden" data-testid="m5-kpi-ledger">
      <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 border-b border-border flex items-center gap-2">
        <Activity size={16} className="text-primary" />
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {t("Preuves de session M5", "M5 session evidence")}
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
            {t("Variance", "Variance")}:{" "}
            {evidence?.varianceQty != null
              ? evidence.varianceQty > 0
                ? `+${evidence.varianceQty}`
                : evidence.varianceQty
              : "—"}
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

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {tiles.map((tile) => (
            <div key={tile.label} className="p-2 border text-center bg-slate-50 dark:bg-slate-800/50 border-border">
              <p className="text-[9px] font-bold text-slate-500 uppercase">{tile.label}</p>
              <p className="text-sm font-black font-mono text-foreground mt-0.5">{tile.value}</p>
              <p className="text-[8px] font-bold uppercase mt-1 text-primary">
                [{t("session", "session")}]
              </p>
            </div>
          ))}
        </div>

        {scnCode === "SCN-016" && session?.correctedStockQty != null && (
          <p className="text-[10px] font-medium text-slate-700 dark:text-slate-300 border-t border-border pt-2">
            {t(
              `Réconcilier d'abord : stock corrigé ${session.correctedStockQty} · exactitude avant ${fmtPct(session.inventoryAccuracyBefore)} → après ${fmtPct(session.inventoryAccuracyAfter)}`,
              `Reconcile first: corrected stock ${session.correctedStockQty} · accuracy before ${fmtPct(session.inventoryAccuracyBefore)} → after ${fmtPct(session.inventoryAccuracyAfter)}`,
            )}
          </p>
        )}

        {(scnCode === "SCN-015" || scnCode === "SCN-017") &&
          (session?.varianceInitialQty === 0 || evidence?.varianceQty === 0) &&
          session?.correctedStockQty == null && (
          <p className="text-[10px] font-medium text-slate-700 dark:text-slate-300 border-t border-border pt-2">
            {t("Aucun ajustement — cycle nominal.", "No adjustment — nominal cycle.")}
          </p>
        )}

        <p className="text-[9px] text-slate-500 italic border-t border-border pt-2">
          {t(
            "Seules les preuves dérivées du run sont affichées. Le portfolio M4 (consommation annuelle, commandes, délais, valeur stock) n'est pas saisi ici.",
            "Only run-derived evidence is shown. The M4 portfolio (annual consumption, orders, lead times, stock value) is not entered here.",
          )}
        </p>
      </div>
    </div>
  );
}
