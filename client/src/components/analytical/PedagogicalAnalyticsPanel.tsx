import type { ReactNode } from "react";
import {
  M4_PORTFOLIO_ANALYTICS,
  formatAnalyticsValue,
  type PedagogicalKpiCard,
} from "@shared/m4m5PedagogicalAnalytics";

/**
 * KPI Control Tower — M4 visual BI-style dashboard (internal TEC.WMS).
 * Display-only; values from shared canonical dataset.
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
  const showAll = scnCode === "SCN-014";
  const emphasis = showAll
    ? ["rotation", "otif", "errors", "leadTime", "capital"]
    : scnCode === "SCN-013"
      ? ["otif", "errors", "leadTime"]
      : ["rotation", "capital", "otif"];

  const cards = data.cards.filter((c) => emphasis.includes(c.id));
  const maxTrend = Math.max(...data.rotationTrend.map((p) => p.value), 12);
  const maxSkuRot = Math.max(...data.slowMovers.map((s) => s.rotation), 12);

  return (
    <div
      className="space-y-3 rounded-md border border-slate-200 dark:border-slate-700 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 p-3"
      data-testid="pedagogical-analytics-panel"
      data-bi-control-tower="m4"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-bold text-primary uppercase tracking-wide">
            {t("KPI Control Tower — M4", "KPI Control Tower — M4")}
          </p>
          <p className="text-[9px] text-muted-foreground">
            {isFr ? data.periodFr : data.periodEn} · {isFr ? data.datasetLabelFr : data.datasetLabelEn}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5 text-[8px]" data-testid="analytics-traffic-legend">
          <LegendDot color="bg-emerald-500" label={t("Vert — conforme", "Green — on target")} />
          <LegendDot color="bg-amber-500" label={t("Ambre — surveiller", "Amber — watch")} />
          <LegendDot color="bg-rose-500" label={t("Rouge — critique", "Red — critical")} />
        </div>
      </div>

      {/* Filters (display / pedagogical) */}
      <div className="flex flex-wrap gap-2 text-[9px]" data-testid="analytics-filters">
        <FilterChip active>{t("Période : T2 2026", "Period: Q2 2026")}</FilterChip>
        <FilterChip>{t("SKU : portefeuille", "SKU: portfolio")}</FilterChip>
        <FilterChip>{t("Classe ABC : A+B+C", "ABC class: A+B+C")}</FilterChip>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
        {cards.map((card) => (
          <KpiAnalyticsCard key={card.id} card={card} language={language} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {(scnCode === "SCN-012" || scnCode === "SCN-014") && (
          <div className="border border-border rounded-sm p-3 bg-card/80" data-testid="analytics-trend-rotation">
            <p className="text-[10px] font-bold uppercase text-slate-500 mb-2">
              {t("Évolution rotation (T3 2025 → T2 2026)", "Turnover trend (Q3 2025 → Q2 2026)")}
            </p>
            <div className="relative h-24 flex items-end gap-2 px-1">
              {/* Band 4–12 visual guide */}
              <div
                className="absolute left-0 right-0 border-t border-dashed border-emerald-400/60"
                style={{ bottom: `${(4 / maxTrend) * 100}%` }}
                title="4×"
              />
              <div
                className="absolute left-0 right-0 border-t border-dashed border-emerald-400/60"
                style={{ bottom: `${(12 / maxTrend) * 100}%` }}
                title="12×"
              />
              {data.rotationTrend.map((p) => {
                const h = Math.max(10, (p.value / maxTrend) * 100);
                const isCurrent = p.value === 6;
                return (
                  <div key={p.periodEn} className="flex-1 flex flex-col items-center gap-1 z-[1]">
                    <span className={`text-[8px] font-mono ${isCurrent ? "font-bold text-primary" : "text-slate-600"}`}>
                      {p.value}×
                    </span>
                    <div
                      className={`w-full rounded-t-sm ${isCurrent ? "bg-primary shadow-sm" : "bg-slate-300 dark:bg-slate-600"}`}
                      style={{ height: `${h}%` }}
                      title={`${isFr ? p.periodFr : p.periodEn}: ${p.value}× — bande 4–12`}
                    />
                    <span className="text-[7px] text-muted-foreground text-center leading-tight">
                      {isFr ? p.periodFr : p.periodEn}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-[8px] text-muted-foreground mt-2 italic">
              {t(
                "Bande visuelle 4–12× — point actuel 6× (normal). Capital 48 000 $.",
                "Visual band 4–12× — current point 6× (normal). Capital $48,000.",
              )}
            </p>
          </div>
        )}

        {(scnCode === "SCN-012" || scnCode === "SCN-014") && (
          <div className="border border-border rounded-sm p-3 bg-card/80" data-testid="analytics-sku-bars">
            <p className="text-[10px] font-bold uppercase text-slate-500 mb-2">
              {t("Rotation par SKU (slow movers)", "Turnover by SKU (slow movers)")}
            </p>
            <div className="space-y-2">
              {data.slowMovers.map((s) => {
                const pct = Math.min(100, (s.rotation / maxSkuRot) * 100);
                const slow = s.rotation < 4;
                return (
                  <div key={s.sku} className="grid grid-cols-[4.5rem_1fr_3.5rem] gap-2 items-center">
                    <span className="text-[9px] font-mono font-semibold">{s.sku}</span>
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-sm overflow-hidden">
                      <div
                        className={`h-full ${slow ? "bg-amber-500" : "bg-emerald-500"}`}
                        style={{ width: `${pct}%` }}
                        title={`${s.rotation}× · ${isFr ? s.noteFr : s.noteEn}`}
                      />
                    </div>
                    <span className={`text-[8px] font-mono text-right ${slow ? "text-amber-700 font-bold" : ""}`}>
                      {s.rotation}× · {s.abc}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-[9px] mt-2 text-foreground/80 font-medium">
              {t(
                "Quel SKU immobilise du capital sans rotation suffisante ?",
                "Which SKU ties capital without enough turnover?",
              )}
            </p>
          </div>
        )}

        {scnCode === "SCN-013" && (
          <div className="border border-border rounded-sm p-3 bg-card/80 lg:col-span-2" data-testid="analytics-error-pareto">
            <p className="text-[10px] font-bold uppercase text-slate-500 mb-2">
              {t("Pareto erreurs opérationnelles", "Operational error Pareto")}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { fr: "Picking", en: "Picking", pct: 45 },
                { fr: "Réception", en: "Receiving", pct: 25 },
                { fr: "Transport", en: "Transport", pct: 18 },
                { fr: "Documentation", en: "Documentation", pct: 12 },
              ].map((row) => (
                <div key={row.en} className="border border-border rounded-sm p-2">
                  <p className="text-[9px] font-semibold">{isFr ? row.fr : row.en}</p>
                  <div className="mt-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-sm overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${row.pct}%` }} />
                  </div>
                  <p className="text-[8px] font-mono mt-1">{row.pct}%</p>
                </div>
              ))}
            </div>
            <p className="text-[9px] mt-2 font-medium">
              {t(
                "Le risque vient-il du stock, du picking, de la réception ou du transport ?",
                "Does the risk come from stock, picking, receiving, or transport?",
              )}
            </p>
          </div>
        )}
      </div>

      {scnCode === "SCN-014" && (
        <div className="border border-primary/30 rounded-sm p-3 bg-primary/5" data-testid="analytics-tradeoff-panel">
          <p className="text-[10px] font-bold uppercase text-primary mb-1">
            {t("Réunion de gestion — trade-off", "Management meeting — trade-off")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[9px]">
            <div>
              <p className="font-semibold">{t("Priorité", "Priority")}</p>
              <p>{t("Qualité d'exécution (erreurs)", "Execution quality (errors)")}</p>
            </div>
            <div>
              <p className="font-semibold">{t("Décision", "Decision")}</p>
              <p>{t("Maintenir stock · former l'équipe", "Maintain stock · train team")}</p>
            </div>
            <div>
              <p className="font-semibold">{t("Horizon / owner", "Horizon / owner")}</p>
              <p>{t("90 jours · Coordinateur entrepôt", "90 days · Warehouse coordinator")}</p>
            </div>
          </div>
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

      {/* Lineage */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5" data-testid="analytics-lineage">
        {data.lineage.map((stage) => (
          <div key={stage.stageEn} className="border border-border rounded-sm px-2 py-1.5 bg-card">
            <p className="text-[8px] font-bold uppercase text-primary">{isFr ? stage.stageFr : stage.stageEn}</p>
            <p className="text-[8px] text-muted-foreground leading-snug">{isFr ? stage.itemsFr : stage.itemsEn}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 border border-border rounded-sm bg-card">
      <span className={`w-1.5 h-1.5 rounded-full ${color}`} />
      {label}
    </span>
  );
}

function FilterChip({ children, active }: { children: ReactNode; active?: boolean }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-sm border text-[9px] ${
        active ? "border-primary/50 bg-primary/10 text-primary font-semibold" : "border-border text-muted-foreground"
      }`}
    >
      {children}
    </span>
  );
}

function KpiAnalyticsCard({ card, language }: { card: PedagogicalKpiCard; language: string }) {
  const isFr = language === "FR" || language === "fr";
  const status = (isFr ? card.statusFr : card.statusEn).toLowerCase();
  const traffic =
    status.includes("excellent") || status.includes("normal")
      ? "bg-emerald-500"
      : status.includes("acceptable") || status.includes("surveiller") || status.includes("monitor")
        ? "bg-amber-500"
        : "bg-rose-500";
  const trendUp = (isFr ? card.deltaFr : card.deltaEn).trim().startsWith("+");

  return (
    <div
      className="border border-border rounded-sm p-2.5 bg-card shadow-sm"
      data-testid={`analytics-kpi-card-${card.id}`}
      title={isFr ? card.interpretationFr : card.interpretationEn}
    >
      <div className="flex items-center justify-between gap-1">
        <p className="text-[9px] font-bold uppercase text-slate-500">{isFr ? card.nameFr : card.nameEn}</p>
        <span className={`w-2 h-2 rounded-full ${traffic}`} title={isFr ? card.statusFr : card.statusEn} />
      </div>
      <p className="text-lg font-bold font-mono mt-0.5 leading-none">
        {formatAnalyticsValue(card, language)}
        <span className="text-[10px] font-normal text-muted-foreground ml-1">
          {isFr ? card.unitFr : card.unitEn}
        </span>
      </p>
      <div className="mt-1.5 flex flex-wrap gap-1">
        <span className="text-[8px] px-1.5 py-0.5 border border-border rounded-sm">
          {isFr ? card.targetFr : card.targetEn}
        </span>
        <span className="text-[8px] px-1.5 py-0.5 border border-primary/40 text-primary rounded-sm font-semibold">
          {isFr ? card.statusFr : card.statusEn}
        </span>
        <span className="text-[8px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-sm font-mono">
          {trendUp ? "↑ " : "↓ "}
          {isFr ? card.deltaFr : card.deltaEn}
        </span>
      </div>
    </div>
  );
}
