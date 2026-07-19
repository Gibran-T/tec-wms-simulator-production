import type { ReactNode } from "react";
import {
  M4_PORTFOLIO_ANALYTICS,
  formatAnalyticsValue,
  type PedagogicalKpiCard,
} from "@shared/m4m5PedagogicalAnalytics";
import {
  getM4VisualContract,
  M4_REASONING_CHAIN,
  type M4ScnCode,
} from "@shared/m4ScenarioVisualContract";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

type TranslateFn = (fr: string, en: string) => string;

/**
 * M4 KPI Control Tower — reusable BI-style analytics cockpit for SCN-012/013/014.
 * Configuration-driven; does not duplicate per-scenario dashboard architectures.
 */
export default function M4KpiControlTower({
  scnCode,
  language,
  t,
  showAdvanced = true,
}: {
  scnCode: string;
  language: string;
  t: TranslateFn;
  /** When false, lineage / source details are omitted (e.g. compact embed). */
  showAdvanced?: boolean;
}) {
  const isFr = language === "FR" || language === "fr";
  const data = M4_PORTFOLIO_ANALYTICS;
  const contract = getM4VisualContract(scnCode);
  const code = (contract ? scnCode : "SCN-012") as M4ScnCode;

  const primaryIds = contract?.primaryCardIds ?? ["rotation", "capital"];
  const secondaryIds = contract?.secondaryCardIds ?? [];
  const primaryCards = data.cards.filter((c) => primaryIds.includes(c.id));
  const secondaryCards = data.cards.filter((c) => secondaryIds.includes(c.id));

  const maxTrend = Math.max(...data.rotationTrend.map((p) => p.value), 12);
  const maxSkuRot = Math.max(...data.slowMovers.map((s) => s.rotation), 12);
  const showRotationCharts = code === "SCN-012" || code === "SCN-014";
  const showOtifTrend = code === "SCN-013" || code === "SCN-014";
  const showPareto = code === "SCN-013";
  const showTradeOff = code === "SCN-014";

  return (
    <div
      className="space-y-3 rounded-md border border-slate-200 dark:border-slate-700 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 p-3 overflow-x-hidden"
      data-testid="m4-kpi-control-tower"
      data-legacy-testid="pedagogical-analytics-panel"
      data-bi-control-tower="m4"
      data-scn={code}
    >
      {/* G — Title + business question */}
      <header className="space-y-1.5" data-testid="m4-tower-header">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-primary uppercase tracking-wide">
              {t("Tour de contrôle KPI — M4", "KPI Control Tower — M4")}
            </p>
            <h3 className="text-sm font-bold text-foreground leading-snug" data-testid="m4-tower-title">
              {contract
                ? isFr
                  ? contract.titleFr
                  : contract.titleEn
                : t("Analytics portefeuille", "Portfolio analytics")}
            </h3>
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

        <div
          className="rounded-sm border border-primary/30 bg-primary/5 px-3 py-2"
          data-testid="m4-tower-business-question"
        >
          <p className="text-[9px] font-bold uppercase text-primary tracking-wider">
            {t("Question métier", "Business question")}
          </p>
          <p className="text-sm font-semibold text-foreground leading-snug mt-0.5">
            {contract
              ? isFr
                ? contract.businessQuestionFr
                : contract.businessQuestionEn
              : t("Que disent les KPI ?", "What do the KPIs say?")}
          </p>
          {contract && (
            <p className="text-[9px] text-muted-foreground mt-1" data-testid="m4-tower-dominant-focus">
              {t("Focus", "Focus")} : {isFr ? contract.dominantFocusFr : contract.dominantFocusEn}
            </p>
          )}
        </div>

        {/* Classroom reasoning chain */}
        <div
          className="flex flex-wrap items-center gap-1 text-[8px]"
          data-testid="m4-reasoning-chain"
          aria-label={t("Chaîne de raisonnement", "Reasoning chain")}
        >
          {M4_REASONING_CHAIN.map((step, i) => (
            <span key={step.en} className="inline-flex items-center gap-1">
              {i > 0 && <span className="text-muted-foreground" aria-hidden>→</span>}
              <span className="px-1.5 py-0.5 border border-border rounded-sm bg-card font-semibold tracking-wide">
                {isFr ? step.fr : step.en}
              </span>
            </span>
          ))}
        </div>
      </header>

      {/* F — Filters */}
      <div className="flex flex-wrap gap-2 text-[9px]" data-testid="analytics-filters">
        <FilterChip active>{t("Période : T2 2026", "Period: Q2 2026")}</FilterChip>
        <FilterChip>{t("SKU : portefeuille", "SKU: portfolio")}</FilterChip>
        <FilterChip>{t("Classe ABC : A+B+C", "ABC class: A+B+C")}</FilterChip>
      </div>

      {/* A–C — Primary KPI cards */}
      <section aria-label={t("KPI prioritaires", "Primary KPIs")} data-testid="m4-tower-primary-cards">
        <p className="text-[9px] font-bold uppercase text-slate-500 mb-1.5">
          {t("Vue décision — KPI prioritaires", "Decision view — primary KPIs")}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
          {primaryCards.map((card) => (
            <KpiAnalyticsCard key={card.id} card={card} language={language} priority="primary" />
          ))}
        </div>
      </section>

      {/* Secondary context cards — lower visual priority */}
      {secondaryCards.length > 0 && (
        <section aria-label={t("Contexte secondaire", "Secondary context")} data-testid="m4-tower-secondary-cards">
          <p className="text-[9px] font-bold uppercase text-slate-400 mb-1.5">
            {t("Contexte secondaire", "Secondary context")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 opacity-80">
            {secondaryCards.map((card) => (
              <KpiAnalyticsCard key={card.id} card={card} language={language} priority="secondary" />
            ))}
          </div>
        </section>
      )}

      {/* D–E — Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {showRotationCharts && (
          <ChartPanel
            testId="analytics-trend-rotation"
            title={t("Évolution rotation (T3 2025 → T2 2026)", "Turnover trend (Q3 2025 → Q2 2026)")}
          >
            <div className="relative h-28 flex items-end gap-2 px-1">
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
                      {isFr ? String(p.value).replace(".", ",") : p.value}×
                    </span>
                    <div
                      className={`w-full rounded-t-sm ${isCurrent ? "bg-primary shadow-sm ring-2 ring-primary/30" : "bg-slate-300 dark:bg-slate-600"}`}
                      style={{ height: `${h}%` }}
                      title={`${isFr ? p.periodFr : p.periodEn}: ${p.value}× — bande 4–12`}
                      aria-label={`${isFr ? p.periodFr : p.periodEn}: ${p.value}×`}
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
            {/* Accessible table twin */}
            <AccessibleDataTable
              caption={t("Données tendance rotation", "Turnover trend data")}
              headers={[t("Période", "Period"), t("Rotation", "Turnover")]}
              rows={data.rotationTrend.map((p) => [
                isFr ? p.periodFr : p.periodEn,
                `${isFr ? String(p.value).replace(".", ",") : p.value}×`,
              ])}
            />
          </ChartPanel>
        )}

        {showRotationCharts && (
          <ChartPanel
            testId="analytics-sku-bars"
            title={t("Rotation par SKU", "Turnover by SKU")}
          >
            <div className="space-y-2">
              {data.slowMovers.map((s) => {
                const pct = Math.min(100, (s.rotation / maxSkuRot) * 100);
                const belowBand = s.rotation < 4;
                return (
                  <div key={s.sku} className="grid grid-cols-[4.5rem_1fr_4rem] gap-2 items-center">
                    <span className="text-[9px] font-mono font-semibold">{s.sku}</span>
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-sm overflow-hidden">
                      <div
                        className={`h-full ${belowBand ? "bg-amber-500" : "bg-emerald-500"}`}
                        style={{ width: `${pct}%` }}
                        title={`${s.rotation}× · ${isFr ? s.noteFr : s.noteEn}`}
                      />
                    </div>
                    <span
                      className={`text-[8px] font-mono text-right ${belowBand ? "text-amber-700 dark:text-amber-400 font-bold" : ""}`}
                    >
                      {isFr ? String(s.rotation).replace(".", ",") : s.rotation}×
                      {belowBand ? (
                        <span className="sr-only">
                          {" "}
                          — {t("sous la bande", "below band")}
                        </span>
                      ) : null}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-[9px] mt-2 text-foreground/80 font-medium">
              {t(
                "SKU sous bande (ambre) : capital immobilisé sans rotation suffisante.",
                "Below-band SKUs (amber): capital tied without enough turnover.",
              )}
            </p>
            <AccessibleDataTable
              caption={t("Données rotation par SKU", "Turnover by SKU data")}
              headers={[t("SKU", "SKU"), "ABC", t("Rotation", "Turnover"), t("Note", "Note")]}
              rows={data.slowMovers.map((s) => [
                s.sku,
                s.abc,
                `${isFr ? String(s.rotation).replace(".", ",") : s.rotation}×`,
                isFr ? s.noteFr : s.noteEn,
              ])}
            />
          </ChartPanel>
        )}

        {showOtifTrend && code === "SCN-013" && (
          <ChartPanel
            testId="analytics-trend-otif"
            title={t("Évolution OTIF par période", "OTIF trend by period")}
          >
            <div className="relative h-28 flex items-end gap-2 px-1">
              {[
                { periodFr: "T3 2025", periodEn: "Q3 2025", value: 92 },
                { periodFr: "T4 2025", periodEn: "Q4 2025", value: 93 },
                { periodFr: "T1 2026", periodEn: "Q1 2026", value: 93 },
                { periodFr: "T2 2026", periodEn: "Q2 2026", value: 95 },
              ].map((p) => {
                const h = Math.max(10, ((p.value - 85) / 15) * 100);
                const isCurrent = p.value === 95;
                return (
                  <div key={p.periodEn} className="flex-1 flex flex-col items-center gap-1">
                    <span className={`text-[8px] font-mono ${isCurrent ? "font-bold text-primary" : "text-slate-600"}`}>
                      {p.value} %
                    </span>
                    <div
                      className={`w-full rounded-t-sm ${isCurrent ? "bg-emerald-500 shadow-sm" : "bg-slate-300 dark:bg-slate-600"}`}
                      style={{ height: `${h}%` }}
                      aria-label={`${isFr ? p.periodFr : p.periodEn}: ${p.value}%`}
                    />
                    <span className="text-[7px] text-muted-foreground text-center leading-tight">
                      {isFr ? p.periodFr : p.periodEn}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-[8px] text-muted-foreground mt-2 italic">
              {t("Seuil excellent ≥ 95 % — période actuelle mise en évidence.", "Excellent threshold ≥ 95% — current period highlighted.")}
            </p>
          </ChartPanel>
        )}

        {showPareto && (
          <ChartPanel
            testId="analytics-error-pareto"
            title={t("Pareto erreurs opérationnelles", "Operational error Pareto")}
          >
            <div className="space-y-2">
              {[
                { fr: "Picking", en: "Picking", pct: 45 },
                { fr: "Réception", en: "Receiving", pct: 25 },
                { fr: "Transport", en: "Transport", pct: 18 },
                { fr: "Documentation", en: "Documentation", pct: 12 },
              ].map((row) => (
                <div key={row.en} className="grid grid-cols-[6rem_1fr_2.5rem] gap-2 items-center">
                  <span className="text-[9px] font-semibold">{isFr ? row.fr : row.en}</span>
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-sm overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${row.pct}%` }} />
                  </div>
                  <span className="text-[8px] font-mono text-right">{row.pct} %</span>
                </div>
              ))}
            </div>
            <p className="text-[9px] mt-2 font-medium">
              {t(
                "Le risque vient-il du picking, de la réception, du transport ou de la documentation ?",
                "Does the risk come from picking, receiving, transport, or documentation?",
              )}
            </p>
          </ChartPanel>
        )}
      </div>

      {/* SCN-014 executive panels */}
      {showTradeOff && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3" data-testid="m4-tower-sop-panels">
          <div className="border border-amber-300/60 rounded-sm p-3 bg-amber-50/50 dark:bg-amber-950/20" data-testid="analytics-alert-panel">
            <p className="text-[10px] font-bold uppercase text-amber-800 dark:text-amber-300 mb-1">
              {t("Panneau d'alerte", "Alert panel")}
            </p>
            <ul className="text-[9px] space-y-1 list-disc pl-4 text-foreground/90">
              <li>{t("Budget limité à une seule initiative financée", "Budget limited to one funded initiative")}</li>
              <li>{t("Erreurs 4 % — risque OTIF malgré headline excellent", "Errors 4% — OTIF risk despite excellent headline")}</li>
              <li>{t("Capital 48 000 $ — ne pas destocker sans revue SKU", "Capital $48,000 — do not destock without SKU review")}</li>
            </ul>
          </div>
          <div className="border border-primary/30 rounded-sm p-3 bg-primary/5" data-testid="analytics-tradeoff-panel">
            <p className="text-[10px] font-bold uppercase text-primary mb-2">
              {t("Panneau d'arbitrage S&OP", "S&OP trade-off panel")}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[9px]">
              {[
                { fr: "PRIORITÉ", en: "PRIORITY", vFr: "Qualité d'exécution", vEn: "Execution quality" },
                { fr: "ACTION", en: "ACTION", vFr: "Former l'équipe picking/réception", vEn: "Train picking/receiving team" },
                { fr: "COMPROMIS", en: "TRADE-OFF", vFr: "Maintenir stock (pas de destock)", vEn: "Maintain stock (no destock)" },
                { fr: "RESPONSABLE", en: "OWNER", vFr: "Coordinateur entrepôt", vEn: "Warehouse coordinator" },
                { fr: "HORIZON", en: "HORIZON", vFr: "90 jours", vEn: "90 days" },
                { fr: "KPI DE SUIVI", en: "FOLLOW-UP KPI", vFr: "OTIF + taux d'erreur", vEn: "OTIF + error rate" },
              ].map((cell) => (
                <div key={cell.en} className="border border-border rounded-sm p-1.5 bg-card">
                  <p className="font-bold uppercase text-[8px] text-slate-500">{isFr ? cell.fr : cell.en}</p>
                  <p className="mt-0.5 leading-snug">{isFr ? cell.vFr : cell.vEn}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* H — Insight + decision area */}
      {contract && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-2"
          data-testid="m4-tower-decision-area"
        >
          <div className="border border-border rounded-sm p-3 bg-card">
            <p className="text-[9px] font-bold uppercase text-slate-500">
              {t("Insight clé", "Key insight")}
            </p>
            <p className="text-[11px] font-medium mt-1 leading-snug" data-testid="m4-tower-insight">
              {isFr ? contract.mainInsightFr : contract.mainInsightEn}
            </p>
          </div>
          <div className="border border-primary/40 rounded-sm p-3 bg-primary/5">
            <p className="text-[9px] font-bold uppercase text-primary">
              {t("Décision à formuler", "Decision to formulate")}
            </p>
            <p className="text-[11px] font-semibold mt-1 leading-snug" data-testid="m4-tower-decision-prompt">
              {isFr ? contract.decisionPromptFr : contract.decisionPromptEn}
            </p>
            <p className="text-[9px] text-muted-foreground mt-1.5">
              {t("Structure : LECTURE → DÉCISION → SUIVI", "Structure: READING → DECISION → FOLLOW-UP")}
            </p>
          </div>
        </div>
      )}

      {/* Classroom companion (Whiteboard-aligned) */}
      {contract && (
        <div
          className="border border-dashed border-slate-300 dark:border-slate-600 rounded-sm p-2.5 bg-slate-50/80 dark:bg-slate-900/40"
          data-testid="m4-classroom-companion"
        >
          <p className="text-[9px] font-bold uppercase text-slate-500 mb-1.5">
            {t("Synthèse salle de classe", "Classroom companion")}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[9px]">
            <CompanionCell label={t("KPI", "KPI")} value={isFr ? contract.classroom.kpiFr : contract.classroom.kpiEn} />
            <CompanionCell label={t("Décision", "Decision")} value={isFr ? contract.classroom.decisionFr : contract.classroom.decisionEn} />
            <CompanionCell label={t("Action", "Action")} value={isFr ? contract.classroom.actionFr : contract.classroom.actionEn} />
            <CompanionCell label={t("Suivi", "Follow-up")} value={isFr ? contract.classroom.followUpFr : contract.classroom.followUpEn} />
          </div>
        </div>
      )}

      {/* Level 2 — supporting evidence (source table always visible for a11y) */}
      <div className="border border-border rounded-sm overflow-hidden" data-testid="analytics-source-table">
        <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 border-b border-border">
          <p className="text-[10px] font-bold uppercase text-slate-500">
            {t("Table source — données du calcul", "Source table — calculation inputs")}
          </p>
        </div>
        <div className="overflow-x-auto">
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
      </div>

      {/* Level 3 — advanced references (collapsed) */}
      {showAdvanced && (
        <Collapsible defaultOpen={false} data-testid="m4-tower-advanced">
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-sm border border-border bg-card px-3 py-2 text-left text-[10px] font-bold uppercase text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <span>{t("Références avancées (lignée, SAP/WMS)", "Advanced references (lineage, SAP/WMS)")}</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 transition-transform [[data-state=open]_&]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5" data-testid="analytics-lineage">
              {data.lineage.map((stage) => (
                <div key={stage.stageEn} className="border border-border rounded-sm px-2 py-1.5 bg-card">
                  <p className="text-[8px] font-bold uppercase text-primary">{isFr ? stage.stageFr : stage.stageEn}</p>
                  <p className="text-[8px] text-muted-foreground leading-snug">{isFr ? stage.itemsFr : stage.itemsEn}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[9px]" data-testid="m4-tower-sap-refs">
              <RefCard
                title={t("Références SAP / WMS", "SAP / WMS references")}
                body={
                  code === "SCN-012"
                    ? t("MC$4 · rapports rotation · CO-PA", "MC$4 · turnover reports · CO-PA")
                    : code === "SCN-013"
                      ? t("VL06O · OTIF · performance livraison", "VL06O · OTIF · delivery performance")
                      : t("SAC · analytics embarquée · S&OP", "SAC · embedded analytics · S&OP")
                }
              />
              <RefCard
                title={t("Codes transaction", "Transaction codes")}
                body={t("Lecture seule — aucune transaction physique M4", "Read-only — no physical M4 transactions")}
              />
              <RefCard
                title={t("Gouvernance", "Governance")}
                body={t(
                  "Rotation ≠ DSI. Bande Annexe A. Pas de score modifié ici.",
                  "Turnover ≠ DSI. Annex A band. Scores unchanged here.",
                )}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 border border-border rounded-sm bg-card">
      <span className={`w-1.5 h-1.5 rounded-full ${color}`} aria-hidden />
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

function ChartPanel({
  title,
  testId,
  children,
}: {
  title: string;
  testId: string;
  children: ReactNode;
}) {
  return (
    <div className="border border-border rounded-sm p-3 bg-card/80 min-w-0" data-testid={testId}>
      <p className="text-[10px] font-bold uppercase text-slate-500 mb-2">{title}</p>
      {children}
    </div>
  );
}

function CompanionCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border rounded-sm px-2 py-1.5 bg-card">
      <p className="text-[8px] font-bold uppercase text-slate-500">{label}</p>
      <p className="font-medium leading-snug mt-0.5">{value}</p>
    </div>
  );
}

function RefCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-border rounded-sm px-2 py-1.5 bg-card">
      <p className="text-[8px] font-bold uppercase text-primary">{title}</p>
      <p className="text-[8px] text-muted-foreground leading-snug mt-0.5">{body}</p>
    </div>
  );
}

function AccessibleDataTable({
  caption,
  headers,
  rows,
}: {
  caption: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead>
        <tr>
          {headers.map((h) => (
            <th key={h}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function KpiAnalyticsCard({
  card,
  language,
  priority,
}: {
  card: PedagogicalKpiCard;
  language: string;
  priority: "primary" | "secondary";
}) {
  const isFr = language === "FR" || language === "fr";
  const statusText = isFr ? card.statusFr : card.statusEn;
  const statusLower = statusText.toLowerCase();
  const traffic =
    statusLower.includes("excellent") || statusLower.includes("normal")
      ? "bg-emerald-500"
      : statusLower.includes("acceptable") || statusLower.includes("surveiller") || statusLower.includes("monitor")
        ? "bg-amber-500"
        : "bg-rose-500";
  const delta = isFr ? card.deltaFr : card.deltaEn;
  const trendUp = delta.trim().startsWith("+") || delta.trim().startsWith("↑");
  const trendDown = delta.trim().startsWith("−") || delta.trim().startsWith("-") || delta.trim().startsWith("↓");
  const unit = isFr ? card.unitFr : card.unitEn;
  const displayValue = formatAnalyticsValue(card, language);

  return (
    <div
      className={`border rounded-sm p-2.5 bg-card shadow-sm ${
        priority === "primary" ? "border-border ring-1 ring-primary/15" : "border-border/70"
      }`}
      data-testid={`analytics-kpi-card-${card.id}`}
      data-priority={priority}
      title={isFr ? card.interpretationFr : card.interpretationEn}
    >
      <div className="flex items-center justify-between gap-1">
        <p className="text-[9px] font-bold uppercase text-slate-500 truncate">
          {isFr ? card.nameFr : card.nameEn}
        </p>
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${traffic}`}
          aria-hidden
        />
      </div>
      <p className={`${priority === "primary" ? "text-lg" : "text-base"} font-bold font-mono mt-0.5 leading-none`}>
        <span data-testid={`analytics-kpi-value-${card.id}`}>{displayValue}</span>
        <span className="text-[10px] font-normal text-muted-foreground ml-1" data-testid={`analytics-kpi-unit-${card.id}`}>
          {unit}
        </span>
      </p>
      <div className="mt-1.5 flex flex-wrap gap-1">
        <span className="text-[8px] px-1.5 py-0.5 border border-border rounded-sm">
          {isFr ? card.targetFr : card.targetEn}
        </span>
        <span
          className="text-[8px] px-1.5 py-0.5 border border-primary/40 text-primary rounded-sm font-semibold"
          data-testid={`analytics-kpi-status-${card.id}`}
        >
          {statusText}
        </span>
        <span className="text-[8px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-sm font-mono">
          {trendUp ? "↑ " : trendDown ? "↓ " : ""}
          {delta}
        </span>
      </div>
      <p className="text-[8px] text-muted-foreground mt-1.5 leading-snug line-clamp-2">
        {isFr ? card.interpretationFr : card.interpretationEn}
      </p>
    </div>
  );
}
