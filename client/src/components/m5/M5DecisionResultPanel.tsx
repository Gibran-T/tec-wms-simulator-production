import React from "react";
import { ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

type TranslateFn = (fr: string, en: string) => string;

export type M5DecisionEvidence = {
  receivedQty: number;
  putawayQty: number;
  cycleCountQty: number | null;
  varianceQty: number;
  varianceResolved: boolean;
  replenishmentQty: number | null;
  stockQtyAtBin: number;
};

export type M5DecisionKpiResult = {
  rotationRate: number;
  serviceLevel: number;
  errorRate: number;
  averageLeadTime?: number;
  stockImmobilizedValue?: number;
};

export type M5DecisionContractHint = {
  minQty?: number;
  maxQty?: number;
  /** Seed fallback only — run evidence wins when present. */
  systemQtyBefore?: number | null;
  /** Seed fallback only — run evidence wins when present. */
  physicalQty?: number | null;
};

export type M5ReconDisplayState =
  | "no_evidence"
  | "awaiting_count"
  | "zero_variance"
  | "unresolved"
  | "resolved";

export type M5SessionEvidenceHint = {
  sessionJourneyCompletionRate?: number;
  /** @deprecated transitional alias of sessionJourneyCompletionRate */
  executionCompletionRate?: number;
  inventoryAccuracyBefore?: number;
  inventoryAccuracyAfter?: number;
  varianceInitialQty?: number;
  varianceResolved?: boolean;
  correctedStockQty?: number;
  finalStockQty?: number;
  replenishmentQty?: number;
  finalComplianceStatus?: "OK" | "NOT_OK";
  unresolvedIssueCount?: number;
  cycleTimeMinutes?: number;
};

export type M5DecisionResultPanelProps = {
  scnCode: string | null;
  t: TranslateFn;
  evidence?: M5DecisionEvidence | null;
  /** @deprecated Phase 3A — not shown as session truth */
  kpiResult?: M5DecisionKpiResult | null;
  avgLeadTimeDays?: number | null;
  sessionEvidence?: M5SessionEvidenceHint | null;
  contract?: M5DecisionContractHint | null;
  adjCompleted?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  className?: string;
};

/** Format quantities: null/undefined/NaN → "—"; legitimate 0 → "0". */
export function formatM5Qty(v: number | undefined | null, suffix = ""): string {
  if (v == null || Number.isNaN(v)) return "—";
  return `${v}${suffix}`;
}

export function formatM5Pct(v: number | undefined | null): string {
  if (v == null || Number.isNaN(v)) return "—";
  return `${(Number(v) * 100).toFixed(1)} %`;
}

/**
 * Source priority for SCN-016 system stock (developer comment, not student UI):
 * 1) Run count context: cycleCountQty − varianceQty when a count exists
 * 2) Contract/seed systemQtyBefore only as fallback
 */
export function resolveM5SystemStock(
  evidence: M5DecisionEvidence | null | undefined,
  contract?: M5DecisionContractHint | null,
): number | null {
  if (evidence?.cycleCountQty != null && !Number.isNaN(evidence.cycleCountQty)) {
    const variance = evidence.varianceQty ?? 0;
    return evidence.cycleCountQty - variance;
  }
  if (contract?.systemQtyBefore != null && !Number.isNaN(contract.systemQtyBefore)) {
    return contract.systemQtyBefore;
  }
  return null;
}

/**
 * Source priority for SCN-016 physical stock:
 * 1) Run evidence cycleCountQty
 * 2) Contract/seed physicalQty fallback
 */
export function resolveM5PhysicalStock(
  evidence: M5DecisionEvidence | null | undefined,
  contract?: M5DecisionContractHint | null,
): number | null {
  if (evidence?.cycleCountQty != null && !Number.isNaN(evidence.cycleCountQty)) {
    return evidence.cycleCountQty;
  }
  if (contract?.physicalQty != null && !Number.isNaN(contract.physicalQty)) {
    return contract.physicalQty;
  }
  return null;
}

/**
 * Authoritative reconciliation display state from run evidence + ADJ completion.
 * Does not treat stockQtyAtBin alone as reconciliation complete.
 */
export function resolveM5ReconDisplayState(
  evidence: M5DecisionEvidence | null | undefined,
  adjCompleted = false,
): M5ReconDisplayState {
  if (evidence == null) return "no_evidence";

  const hasCount = evidence.cycleCountQty != null;
  const openVariance = evidence.varianceQty !== 0;
  const resolved = evidence.varianceResolved || adjCompleted;

  if (!hasCount && !resolved) return "awaiting_count";

  if (openVariance && !resolved) return "unresolved";

  if (openVariance && resolved) return "resolved";

  // Zero variance — reconciliation complete without implying ADJ was posted
  if (hasCount || evidence.varianceResolved) return "zero_variance";

  return "awaiting_count";
}

/**
 * Session-derived operational evidence for M5 decision — evidence only, not the answer.
 */
export default function M5DecisionResultPanel({
  scnCode,
  t,
  evidence,
  kpiResult: _kpiResult,
  avgLeadTimeDays: _avgLeadTimeDays,
  sessionEvidence,
  contract,
  adjCompleted = false,
  isLoading = false,
  isError = false,
  className,
}: M5DecisionResultPanelProps) {
  void _kpiResult;
  void _avgLeadTimeDays;
  const is016 = scnCode === "SCN-016";
  const is017 = scnCode === "SCN-017";
  const q = sessionEvidence?.replenishmentQty ?? evidence?.replenishmentQty;
  const stock = sessionEvidence?.finalStockQty ?? evidence?.stockQtyAtBin;
  const minQty = contract?.minQty;
  const reconState = resolveM5ReconDisplayState(evidence, adjCompleted);
  const systemStock = resolveM5SystemStock(evidence, contract);
  const physicalStock = resolveM5PhysicalStock(evidence, contract);
  const varianceDisplay =
    sessionEvidence?.varianceInitialQty ?? (evidence == null ? null : evidence.varianceQty);

  const receptionDone = (evidence?.receivedQty ?? 0) > 0;
  const putawayDone = (evidence?.putawayQty ?? 0) > 0;
  const openVariance = evidence != null && evidence.varianceQty !== 0 && !evidence.varianceResolved;

  const showLoadedBody = !isLoading && !isError && evidence != null;
  const showEmptyBody = !isLoading && !isError && evidence == null;

  return (
    <aside
      className={cn(
        "rounded-md border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 overflow-hidden",
        className,
      )}
      data-testid="m5-decision-result-panel"
      aria-labelledby="m5-decision-result-title"
      data-recon-state={is016 ? reconState : undefined}
    >
      <div className="px-3 py-2 border-b border-emerald-200 dark:border-emerald-900/40 flex items-center gap-2 bg-emerald-100/50 dark:bg-emerald-900/30">
        <ClipboardList size={14} className="text-emerald-800 dark:text-emerald-300 shrink-0" />
        <h3
          id="m5-decision-result-title"
          className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-200"
        >
          {t("Résultat opérationnel de votre session", "Operational result of your session")}
        </h3>
      </div>

      <div className="p-3 space-y-3">
        <p className="text-[10px] text-muted-foreground italic">
          {t(
            "Ces données proviennent de votre session. Elles ne constituent pas la réponse attendue.",
            "These data come from your session. They are not the expected answer.",
          )}
        </p>

        {isLoading && (
          <p
            role="status"
            className="text-xs text-muted-foreground leading-snug"
            data-testid="m5-ledger-loading"
          >
            {t(
              "Synchronisation des résultats de la session…",
              "Synchronizing session results…",
            )}
          </p>
        )}

        {isError && (
          <div role="alert" className="space-y-1" data-testid="m5-ledger-error">
            <p className="text-xs font-medium text-destructive leading-snug">
              {t(
                "Les résultats de la session ne peuvent pas être chargés pour le moment.",
                "Session results cannot be loaded right now.",
              )}
            </p>
            <p className="text-xs text-muted-foreground leading-snug">
              {t("Réessayez ou actualisez la page.", "Try again or refresh the page.")}
            </p>
          </div>
        )}

        {showEmptyBody && (
          <p
            role="status"
            className="text-xs text-muted-foreground leading-snug"
            data-testid="m5-ledger-empty"
          >
            {t(
              "Les résultats seront disponibles après la validation des étapes opérationnelles.",
              "Results will be available after operational steps are validated.",
            )}
          </p>
        )}

        {showLoadedBody && (
          <>
            {/* Reasoning chain */}
            <div className="rounded border border-border/60 bg-background/70 px-2.5 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                {t("Chaîne de raisonnement", "Reasoning chain")}
              </p>
              <p
                className="text-[11px] font-medium text-foreground leading-snug"
                data-testid="m5-decision-reasoning-chain"
              >
                {t(
                  "EXÉCUTER → MESURER → RÉCONCILIER → ARBITRER → DÉFENDRE",
                  "EXECUTE → MEASURE → RECONCILE → ARBITRATE → DEFEND",
                )}
              </p>
            </div>

            {is016 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" data-testid="m5-recon-before-after">
                <div className="rounded border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 p-2 space-y-1">
                  <p className="text-[10px] font-bold uppercase text-amber-800 dark:text-amber-200">
                    {t("Avant réconciliation", "Before reconciliation")}
                  </p>
                  <p className="text-xs font-mono text-foreground">
                    {t("Stock système", "System stock")}: {formatM5Qty(systemStock)}
                  </p>
                  <p className="text-xs font-mono text-foreground">
                    {t("Stock physique", "Physical stock")}: {formatM5Qty(physicalStock)}
                  </p>
                  <p className="text-xs font-mono text-foreground">
                    {t("Écart", "Variance")}: {formatM5Qty(varianceDisplay)}
                  </p>
                  <p className="text-xs font-mono text-foreground">
                    {t("Exactitude", "Accuracy")}: {formatM5Pct(sessionEvidence?.inventoryAccuracyBefore)}
                  </p>
                </div>

                {reconState === "unresolved" && (
                  <div
                    className="rounded border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 p-2 space-y-1"
                    data-testid="m5-recon-pending"
                  >
                    <p className="text-[10px] font-bold uppercase text-amber-800 dark:text-amber-200">
                      {t("Réconciliation en attente", "Reconciliation pending")}
                    </p>
                    <p className="text-xs font-medium text-amber-900 dark:text-amber-100">
                      {t(
                        "Ajustement requis avant décision",
                        "Adjustment required before decision",
                      )}
                    </p>
                    <p className="text-xs font-mono text-foreground">
                      {t("Stock corrigé", "Corrected stock")}:{" "}
                      {t("En attente de l'ajustement", "Awaiting adjustment")}
                    </p>
                    <p className="text-xs font-mono text-muted-foreground">
                      {t("Base réappro", "Replenish base")}:{" "}
                      {t("non finalisée", "not finalized")}
                    </p>
                    <p className="text-xs font-semibold text-amber-800 dark:text-amber-200 pt-1">
                      {t(
                        "Réconcilier d'abord, décider ensuite — décision bloquée tant que l'écart n'est pas ajusté.",
                        "Reconcile first, decide afterward — decision blocked until variance is adjusted.",
                      )}
                    </p>
                  </div>
                )}

                {(reconState === "resolved" || reconState === "zero_variance") && (
                  <div
                    className="rounded border border-green-200 dark:border-green-900/40 bg-green-50/50 dark:bg-green-950/20 p-2 space-y-1"
                    data-testid="m5-recon-complete"
                  >
                    <p className="text-[10px] font-bold uppercase text-green-800 dark:text-green-200">
                      {t("Après réconciliation", "After reconciliation")}
                    </p>
                    <p className="text-xs font-mono text-foreground">
                      {t("Stock corrigé", "Corrected stock")}: {formatM5Qty(stock)}
                    </p>
                    <p className="text-xs font-mono text-foreground">
                      {t("Statut ADJ", "ADJ status")}:{" "}
                      {reconState === "zero_variance"
                        ? t("non requis", "not required")
                        : t("ajusté", "adjusted")}
                    </p>
                    <p className="text-xs font-mono text-foreground">
                      {t("Base de réapprovisionnement", "Replenishment basis")}:{" "}
                      {formatM5Qty(stock)}
                    </p>
                  </div>
                )}

                {(reconState === "awaiting_count" || reconState === "no_evidence") && (
                  <div
                    className="rounded border border-border bg-background/70 p-2 space-y-1"
                    data-testid="m5-recon-awaiting"
                  >
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">
                      {t("Réconciliation", "Reconciliation")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t(
                        "En attente du comptage et de la réconciliation.",
                        "Awaiting count and reconciliation.",
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Scenario-specific evidence grid */}
            <div
              className="grid grid-cols-2 sm:grid-cols-3 gap-2"
              data-testid="m5-decision-evidence-grid"
            >
              {!is017 && (
                <div
                  className="rounded border border-border bg-background/80 px-2 py-1.5 col-span-2 sm:col-span-3 text-left space-y-1"
                  data-testid="m5-ops-status"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    {t("État des opérations", "Operations status")}
                  </p>
                  <p className="text-xs font-mono text-foreground">
                    {t("Réception", "Reception")}:{" "}
                    {receptionDone
                      ? t("complétée", "completed")
                      : t("en attente", "pending")}
                  </p>
                  <p className="text-xs font-mono text-foreground">
                    {t("Rangement", "Putaway")}:{" "}
                    {putawayDone
                      ? t("complété", "completed")
                      : t("en attente", "pending")}
                  </p>
                  <p className="text-xs font-mono text-foreground">
                    {t("Variance ouverte", "Open variance")}:{" "}
                    {openVariance ? t("oui", "yes") : t("non", "no")}
                  </p>
                </div>
              )}
              {!is017 && (
                <EvidenceTile label={t("Stock final", "Final stock")} value={formatM5Qty(stock)} />
              )}
              {!is017 && minQty != null && (
                <EvidenceTile label={t("Minimum", "Minimum")} value={formatM5Qty(minQty)} />
              )}
              {!is017 && contract?.maxQty != null && (
                <EvidenceTile
                  label={t("Maximum", "Maximum")}
                  value={formatM5Qty(contract.maxQty)}
                />
              )}
              {!is017 && (
                <EvidenceTile
                  label={t("Q réappro", "Replenish Q")}
                  value={q == null ? "—" : String(q)}
                />
              )}
              <EvidenceTile
                label={t("Taux de complétion du parcours", "Pathway completion rate")}
                value={formatM5Pct(
                  sessionEvidence?.sessionJourneyCompletionRate ??
                    sessionEvidence?.executionCompletionRate,
                )}
              />
              <EvidenceTile
                label={t("Exact. avant", "Acc. before")}
                value={formatM5Pct(sessionEvidence?.inventoryAccuracyBefore)}
              />
              <EvidenceTile
                label={t("Exact. après", "Acc. after")}
                value={formatM5Pct(sessionEvidence?.inventoryAccuracyAfter)}
              />
              {is017 && (
                <EvidenceTile
                  label={t("Issues ouvertes", "Open issues")}
                  value={
                    sessionEvidence?.unresolvedIssueCount != null
                      ? String(sessionEvidence.unresolvedIssueCount)
                      : "—"
                  }
                />
              )}
              {is017 && sessionEvidence?.cycleTimeMinutes != null && (
                <EvidenceTile
                  label={t("Temps session", "Session time")}
                  value={`${sessionEvidence.cycleTimeMinutes} min`}
                />
              )}
            </div>
            {is017 && (
              <p className="text-[10px] text-muted-foreground leading-snug" data-testid="m5-017-evidence-rubric">
                {t(
                  "Structure : Preuves (≥3) → Diagnostic → Priorité → Compromis → Horizon → Recommandation. Ne citez pas le portfolio M4.",
                  "Structure: Evidence (≥3) → Diagnostic → Priority → Trade-off → Horizon → Recommendation. Do not cite the M4 portfolio.",
                )}
              </p>
            )}
          </>
        )}
      </div>
    </aside>
  );
}

function EvidenceTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-border bg-background/80 px-2 py-1.5 text-center min-w-0">
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground leading-tight">
        {label}
      </p>
      <p className="text-xs font-mono font-semibold text-foreground mt-0.5 break-all">{value}</p>
    </div>
  );
}
