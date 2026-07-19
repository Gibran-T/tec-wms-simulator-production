import {
  M4_PORTFOLIO_ANALYTICS,
  formatAnalyticsValue,
  type PedagogicalKpiCard,
} from "@shared/m4m5PedagogicalAnalytics";

/**
 * Pedagogical analytics layer for M4 (and reusable shell for M5).
 * Display-only — does not change validators; values come from shared canonical dataset.
 */
export default function PedagogicalAnalyticsPanel({
  scnCode,
  language,
  t,
}: {
  scnCode: string;
  language: string;
  t: (fr: string, en: string) => string;
}) {
  const isFr = language === "FR" || language === "fr";
  const data = M4_PORTFOLIO_ANALYTICS;
  const emphasis =
    scnCode === "SCN-012"
      ? ["rotation", "capital"]
      : scnCode === "SCN-013"
        ? ["otif", "errors"]
        : ["rotation", "otif", "errors", "leadTime", "capital"];

  const cards = data.cards.filter((c) => emphasis.includes(c.id));
  const maxTrend = Math.max(...data.rotationTrend.map((p) => p.value), 12);

  return (
    <div className="space-y-3" data-testid="pedagogical-analytics-panel">
      <div>
        <p className="text-[10px] font-bold text-primary uppercase tracking-wide">
          {t("Tableau de bord analytique pédagogique", "Pedagogical analytics dashboard")}
        </p>
        <p className="text-[9px] text-muted-foreground">
          {isFr ? data.periodFr : data.periodEn} · {isFr ? data.datasetLabelFr : data.datasetLabelEn}
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {cards.map((card) => (
          <KpiAnalyticsCard key={card.id} card={card} language={language} />
        ))}
      </div>

      {/* Rotation trend (SCN-012 / 014) */}
      {(scnCode === "SCN-012" || scnCode === "SCN-014") && (
        <div className="border border-border rounded-sm p-3 bg-card" data-testid="analytics-trend-rotation">
          <p className="text-[10px] font-bold uppercase text-slate-500 mb-2">
            {t("Tendance rotation (portefeuille)", "Turnover trend (portfolio)")}
          </p>
          <div className="flex items-end gap-2 h-16">
            {data.rotationTrend.map((p) => {
              const h = Math.max(8, (p.value / maxTrend) * 100);
              const isCurrent = p.value === 6;
              return (
                <div key={p.periodEn} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[8px] font-mono text-slate-600">{p.value}×</span>
                  <div
                    className={`w-full rounded-t-sm ${isCurrent ? "bg-primary" : "bg-slate-300 dark:bg-slate-600"}`}
                    style={{ height: `${h}%` }}
                    title={`${isFr ? p.periodFr : p.periodEn}: ${p.value}×`}
                  />
                  <span className="text-[7px] text-muted-foreground text-center leading-tight">
                    {isFr ? p.periodFr : p.periodEn}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-[8px] text-muted-foreground mt-2 italic">
            {t("Ligne de bande 4–12× : zone normale — point actuel 6×", "Band line 4–12×: normal zone — current point 6×")}
          </p>
        </div>
      )}

      {/* Source table */}
      <div className="border border-border rounded-sm overflow-hidden" data-testid="analytics-source-table">
        <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 border-b border-border">
          <p className="text-[10px] font-bold uppercase text-slate-500">
            {t("Table source — données du calcul", "Source table — calculation inputs")}
          </p>
        </div>
        <table className="w-full text-[10px]">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="px-3 py-1.5 font-semibold">{t("Métrique", "Metric")}</th>
              <th className="px-3 py-1.5 font-semibold">{t("Valeur", "Value")}</th>
              <th className="px-3 py-1.5 font-semibold">{t("Origine", "Origin")}</th>
            </tr>
          </thead>
          <tbody>
            {data.sourceRows.map((row) => (
              <tr key={row.metricEn} className="border-b border-border/60">
                <td className="px-3 py-1.5">{isFr ? row.metricFr : row.metricEn}</td>
                <td className="px-3 py-1.5 font-mono font-semibold">{row.value}</td>
                <td className="px-3 py-1.5 text-muted-foreground">{isFr ? row.originFr : row.originEn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slow movers / segmentation (SCN-012) */}
      {(scnCode === "SCN-012" || scnCode === "SCN-014") && (
        <div className="border border-border rounded-sm overflow-hidden" data-testid="analytics-slow-movers">
          <div className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-800">
            <p className="text-[10px] font-bold uppercase text-amber-800 dark:text-amber-300">
              {t("Segmentation — rotation par SKU / ABC", "Segmentation — turnover by SKU / ABC")}
            </p>
            <p className="text-[8px] text-amber-700 dark:text-amber-400">
              {t(
                "Une moyenne 6× normale peut masquer des articles lents — réduire de façon ciblée, pas globale.",
                "A normal 6× average can hide slow movers — reduce selectively, not globally.",
              )}
            </p>
          </div>
          <table className="w-full text-[10px]">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-3 py-1.5">SKU</th>
                <th className="px-3 py-1.5">ABC</th>
                <th className="px-3 py-1.5">{t("Rotation", "Turnover")}</th>
                <th className="px-3 py-1.5">{t("Valeur", "Value")}</th>
                <th className="px-3 py-1.5">{t("Lecture", "Reading")}</th>
              </tr>
            </thead>
            <tbody>
              {data.slowMovers.map((row) => (
                <tr key={row.sku} className="border-b border-border/60">
                  <td className="px-3 py-1.5 font-mono">{row.sku}</td>
                  <td className="px-3 py-1.5">{row.abc}</td>
                  <td className="px-3 py-1.5 font-mono">{row.rotation}×</td>
                  <td className="px-3 py-1.5">{row.valueFr}</td>
                  <td className="px-3 py-1.5">{isFr ? row.noteFr : row.noteEn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Data lineage */}
      <div className="border border-border rounded-sm p-3" data-testid="analytics-lineage">
        <p className="text-[10px] font-bold uppercase text-slate-500 mb-2">
          {t("Lignée des données (data lineage)", "Data lineage")}
        </p>
        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {data.lineage.map((step, i) => (
            <li key={step.stageEn} className="flex gap-2 text-[10px]">
              <span className="font-mono text-primary font-bold">{i + 1}.</span>
              <div>
                <p className="font-bold uppercase tracking-wide">{isFr ? step.stageFr : step.stageEn}</p>
                <p className="text-muted-foreground">{isFr ? step.itemsFr : step.itemsEn}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Guided reading */}
      <div className="border border-primary/30 rounded-sm p-3 bg-primary/5" data-testid="analytics-guided-reading">
        <p className="text-[10px] font-bold uppercase text-primary mb-2">
          {t("Lecture guidée — Analyse et Décision", "Guided reading — Analyze and Decide")}
        </p>
        <ol className="space-y-1">
          {data.guidedReading.map((step) => (
            <li key={step.n} className="flex gap-2 text-[10px]">
              <span className="font-mono font-bold text-primary w-4">{step.n}.</span>
              <span>{isFr ? step.fr : step.en}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function KpiAnalyticsCard({ card, language }: { card: PedagogicalKpiCard; language: string }) {
  const isFr = language === "FR" || language === "fr";
  return (
    <div
      className="border border-border rounded-sm p-2.5 bg-card"
      data-testid={`analytics-kpi-card-${card.id}`}
    >
      <p className="text-[9px] font-bold uppercase text-slate-500">
        {isFr ? card.nameFr : card.nameEn}
      </p>
      <p className="text-lg font-bold font-mono mt-0.5">
        {formatAnalyticsValue(card, language)}
        <span className="text-[10px] font-normal text-muted-foreground ml-1">
          {isFr ? card.unitFr : card.unitEn}
        </span>
      </p>
      <div className="mt-1 flex flex-wrap gap-1">
        <span className="text-[8px] px-1.5 py-0.5 border border-border rounded-sm">
          {tTarget(card, isFr)}
        </span>
        <span className="text-[8px] px-1.5 py-0.5 border border-primary/40 text-primary rounded-sm font-semibold">
          {isFr ? card.statusFr : card.statusEn}
        </span>
        <span className="text-[8px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-sm font-mono">
          {isFr ? card.deltaFr : card.deltaEn}
        </span>
      </div>
      <p className="text-[9px] text-muted-foreground mt-1.5 leading-snug">
        {isFr ? card.interpretationFr : card.interpretationEn}
      </p>
    </div>
  );
}

function tTarget(card: PedagogicalKpiCard, isFr: boolean): string {
  return isFr ? card.targetFr : card.targetEn;
}
