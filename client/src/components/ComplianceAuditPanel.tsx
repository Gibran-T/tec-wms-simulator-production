import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AlertTriangle, ArrowLeft, RefreshCw, CheckCircle, ExternalLink, ChevronDown, ChevronUp, ShieldAlert, ClipboardList, Database } from "lucide-react";

// ─── Non-conformity type definitions ─────────────────────────────────────────
export type NonConformityType =
  | "UNPOSTED_TRANSACTION"
  | "NEGATIVE_STOCK"
  | "UNRESOLVED_VARIANCE"
  | "UNKNOWN";

export interface ComplianceIssueDetail {
  type: NonConformityType;
  messageFr: string;
  messageEn: string;
  // Root cause
  rootCauseFr: string;
  rootCauseEn: string;
  rootCauseStepFr: string;
  rootCauseStepEn: string;
  // Impact
  impactFr: string;
  impactEn: string;
  // Recovery
  canRecover: boolean;
  recoveryStepCode: string | null;   // e.g. "gr", "cc", "adj"
  recoveryStepLabelFr: string;
  recoveryStepLabelEn: string;
  correctionFr: string;
  correctionEn: string;
  // Odoo audit hook (future integration)
  odooAuditUrl: string | null;
  odooAuditLabelFr: string | null;
  odooAuditLabelEn: string | null;
  // ERP governance principle
  erpPrincipleFr: string;
  erpPrincipleEn: string;
}

// ─── Root-cause map ───────────────────────────────────────────────────────────
export function parseComplianceIssues(
  issuesFr: string[],
  issuesEn: string[]
): ComplianceIssueDetail[] {
  const details: ComplianceIssueDetail[] = [];
  for (let i = 0; i < issuesFr.length; i++) {
    const fr = issuesFr[i] ?? "";
    const en = issuesEn[i] ?? "";
    details.push(classifyIssue(fr, en));
  }
  return details;
}

function classifyIssue(fr: string, en: string): ComplianceIssueDetail {
  // UNPOSTED TRANSACTION
  if (fr.includes("non postée") || en.includes("unposted")) {
    return {
      type: "UNPOSTED_TRANSACTION",
      messageFr: fr,
      messageEn: en,
      rootCauseFr: "Une ou plusieurs transactions ont été créées mais jamais postées (validées) dans le système.",
      rootCauseEn: "One or more transactions were created but never posted (validated) in the system.",
      rootCauseStepFr: "Étape GR (Goods Receipt) — transaction créée sans posting",
      rootCauseStepEn: "GR step (Goods Receipt) — transaction created without posting",
      impactFr: "Le stock système ne reflète pas la réalité physique. Toute commande client basée sur ce stock est potentiellement erronée. En SAP, une transaction non postée génère un document en suspens qui bloque la clôture de période.",
      impactEn: "System stock does not reflect physical reality. Any sales order based on this stock is potentially incorrect. In SAP, an unposted transaction creates a pending document that blocks period closing.",
      canRecover: true,
      recoveryStepCode: "gr",
      recoveryStepLabelFr: "Retourner à la Réception (GR)",
      recoveryStepLabelEn: "Return to Goods Receipt (GR)",
      correctionFr: "Localisez la transaction non postée, vérifiez les données (SKU, quantité, bin), et postez-la immédiatement. Dans SAP : MIGO → Poster le document matière.",
      correctionEn: "Locate the unposted transaction, verify the data (SKU, quantity, bin), and post it immediately. In SAP: MIGO → Post material document.",
      odooAuditUrl: "https://edu-concorde-logistics-lab.odoo.com/odoo/inventory/receipts",
      odooAuditLabelFr: "Vérifier les réceptions en attente dans Odoo",
      odooAuditLabelEn: "Check pending receipts in Odoo",
      erpPrincipleFr: "Intégrité séquentielle : chaque transaction doit être postée avant de passer à l'étape suivante. Un document en brouillon n'a aucun effet sur l'inventaire.",
      erpPrincipleEn: "Sequential integrity: every transaction must be posted before proceeding to the next step. A draft document has no effect on inventory.",
    };
  }
  // NEGATIVE STOCK
  if (fr.includes("Stock négatif") || en.includes("Negative stock")) {
    const skuMatch = fr.match(/Stock négatif : (\S+) dans (\S+)/);
    const sku = skuMatch?.[1] ?? "SKU";
    const bin = skuMatch?.[2] ?? "BIN";
    return {
      type: "NEGATIVE_STOCK",
      messageFr: fr,
      messageEn: en,
      rootCauseFr: `Le stock de ${sku} dans l'emplacement ${bin} est négatif. Une sortie de stock (GI/Picking) a été enregistrée sans stock disponible suffisant.`,
      rootCauseEn: `Stock for ${sku} in location ${bin} is negative. A stock issue (GI/Picking) was recorded without sufficient available stock.`,
      rootCauseStepFr: "Étape GI (Goods Issue) ou PICKING — sortie supérieure au stock disponible",
      rootCauseStepEn: "GI (Goods Issue) or PICKING step — issue exceeds available stock",
      impactFr: "Un stock négatif est une incohérence système critique. Il indique soit une GR manquante, soit une GI excessive. Cela bloque la clôture de période et génère une exception d'audit.",
      impactEn: "Negative stock is a critical system inconsistency. It indicates either a missing GR or an excessive GI. This blocks period closing and generates an audit exception.",
      canRecover: true,
      recoveryStepCode: "gi",
      recoveryStepLabelFr: "Retourner à la Sortie de stock (GI)",
      recoveryStepLabelEn: "Return to Goods Issue (GI)",
      correctionFr: "Vérifiez le stock disponible avant toute sortie. Si le stock est insuffisant, effectuez d'abord une GR pour réapprovisionner. Ensuite, annulez la GI incorrecte et recréez-la avec la quantité correcte.",
      correctionEn: "Check available stock before any issue. If stock is insufficient, perform a GR first to replenish. Then cancel the incorrect GI and recreate it with the correct quantity.",
      odooAuditUrl: "https://edu-concorde-logistics-lab.odoo.com/odoo/inventory/products",
      odooAuditLabelFr: "Vérifier le stock disponible dans Odoo",
      odooAuditLabelEn: "Check available stock in Odoo",
      erpPrincipleFr: "Cohérence du stock : le stock ne peut jamais être négatif dans un WMS correctement configuré. Toute sortie doit être précédée d'une vérification de disponibilité (ATP check).",
      erpPrincipleEn: "Stock consistency: stock can never be negative in a properly configured WMS. Every issue must be preceded by an availability check (ATP check).",
    };
  }
  // UNRESOLVED VARIANCE
  if (fr.includes("écart") || en.includes("variance")) {
    return {
      type: "UNRESOLVED_VARIANCE",
      messageFr: fr,
      messageEn: en,
      rootCauseFr: "Des écarts ont été détectés lors du Cycle Count mais n'ont pas été résolus par un ajustement d'inventaire (ADJ).",
      rootCauseEn: "Variances were detected during the Cycle Count but were not resolved by an inventory adjustment (ADJ).",
      rootCauseStepFr: "Étape CC (Cycle Count) → ADJ (Ajustement) — écart non résolu",
      rootCauseStepEn: "CC (Cycle Count) → ADJ (Adjustment) step — unresolved variance",
      impactFr: "Les écarts non résolus signifient que le stock système ne correspond pas au stock physique. Cela invalide tous les rapports de stock et compromet la fiabilité des commandes futures.",
      impactEn: "Unresolved variances mean system stock does not match physical stock. This invalidates all stock reports and compromises the reliability of future orders.",
      canRecover: true,
      recoveryStepCode: "cc",
      recoveryStepLabelFr: "Retourner au Cycle Count (CC)",
      recoveryStepLabelEn: "Return to Cycle Count (CC)",
      correctionFr: "Effectuez un nouveau Cycle Count pour les emplacements concernés. Entrez la quantité physique réelle. Le système génèrera automatiquement un ajustement (ADJ). Validez l'ajustement pour réconcilier le stock.",
      correctionEn: "Perform a new Cycle Count for the affected locations. Enter the actual physical quantity. The system will automatically generate an adjustment (ADJ). Validate the adjustment to reconcile stock.",
      odooAuditUrl: "https://edu-concorde-logistics-lab.odoo.com/odoo/inventory/inventory-adjustments",
      odooAuditLabelFr: "Voir les ajustements d'inventaire dans Odoo",
      odooAuditLabelEn: "View inventory adjustments in Odoo",
      erpPrincipleFr: "Réconciliation d'inventaire : tout écart détecté doit être documenté, approuvé et ajusté. Un écart non résolu est une non-conformité ISO 9001 / audit interne.",
      erpPrincipleEn: "Inventory reconciliation: every detected variance must be documented, approved, and adjusted. An unresolved variance is an ISO 9001 / internal audit non-compliance.",
    };
  }
  // UNKNOWN / FALLBACK
  return {
    type: "UNKNOWN",
    messageFr: fr,
    messageEn: en,
    rootCauseFr: "Non-conformité détectée — analyse manuelle requise.",
    rootCauseEn: "Non-conformity detected — manual analysis required.",
    rootCauseStepFr: "Étape indéterminée",
    rootCauseStepEn: "Undetermined step",
    impactFr: "L'intégrité du système ne peut pas être garantie. Une révision complète du scénario est recommandée.",
    impactEn: "System integrity cannot be guaranteed. A complete scenario review is recommended.",
    canRecover: false,
    recoveryStepCode: null,
    recoveryStepLabelFr: "Redémarrer le scénario",
    recoveryStepLabelEn: "Restart the scenario",
    correctionFr: "Ce type de non-conformité nécessite un redémarrage complet du scénario pour garantir la cohérence du système.",
    correctionEn: "This type of non-conformity requires a complete scenario restart to ensure system consistency.",
    odooAuditUrl: null,
    odooAuditLabelFr: null,
    odooAuditLabelEn: null,
    erpPrincipleFr: "Auditabilité : chaque transaction doit être traçable et vérifiable. Un état système incohérent compromet l'intégrité de l'audit.",
    erpPrincipleEn: "Auditability: every transaction must be traceable and verifiable. An inconsistent system state compromises audit integrity.",
  };
}

// ─── Issue type config ────────────────────────────────────────────────────────
const ISSUE_TYPE_CONFIG: Record<NonConformityType, { icon: string; colorClass: string; bgClass: string; borderClass: string }> = {
  UNPOSTED_TRANSACTION: {
    icon: "📋",
    colorClass: "text-amber-700 dark:text-amber-300",
    bgClass: "bg-amber-50 dark:bg-amber-950/30",
    borderClass: "border-amber-300 dark:border-amber-700",
  },
  NEGATIVE_STOCK: {
    icon: "📉",
    colorClass: "text-red-700 dark:text-red-300",
    bgClass: "bg-red-50 dark:bg-red-950/30",
    borderClass: "border-red-300 dark:border-red-700",
  },
  UNRESOLVED_VARIANCE: {
    icon: "⚖️",
    colorClass: "text-blue-700 dark:text-blue-300",
    bgClass: "bg-blue-50 dark:bg-blue-950/30",
    borderClass: "border-blue-300 dark:border-blue-700",
  },
  UNKNOWN: {
    icon: "❓",
    colorClass: "text-gray-700 dark:text-gray-300",
    bgClass: "bg-gray-50 dark:bg-gray-950/30",
    borderClass: "border-gray-300 dark:border-gray-700",
  },
};

// ─── Props ────────────────────────────────────────────────────────────────────
interface ComplianceAuditPanelProps {
  issuesFr: string[];
  issuesEn: string[];
  isDemo: boolean;
  runId: number;
  onNavigateToStep: (stepCode: string) => void;
  onRetryCompliance: () => void;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function ComplianceAuditPanel({
  issuesFr,
  issuesEn,
  isDemo,
  runId,
  onNavigateToStep,
  onRetryCompliance,
}: ComplianceAuditPanelProps) {
  const { t } = useLanguage();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [showErpPrinciples, setShowErpPrinciples] = useState(false);

  const issues = parseComplianceIssues(issuesFr, issuesEn ?? issuesFr.map(() => ""));

  return (
    <div className="space-y-3 mb-4">
      {/* ── Audit Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-destructive/10 border border-destructive/30">
        <ShieldAlert size={16} className="text-destructive flex-shrink-0" />
        <div className="flex-1">
          <p className="text-xs font-bold text-destructive">
            {t("AUDIT SYSTÈME — Non-conformité(s) détectée(s)", "SYSTEM AUDIT — Non-conformity detected")}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {t(
              `${issues.length} problème(s) identifié(s) — résolution requise avant clôture`,
              `${issues.length} issue(s) identified — resolution required before closing`
            )}
          </p>
        </div>
        <span className="text-[10px] font-mono bg-destructive/20 text-destructive px-1.5 py-0.5 rounded">
          {issues.length} {t("anomalie(s)", "anomaly(ies)")}
        </span>
      </div>

      {/* ── Issue Cards ──────────────────────────────────────────────────── */}
      {issues.map((issue, idx) => {
        const cfg = ISSUE_TYPE_CONFIG[issue.type];
        const isExpanded = expandedIndex === idx;
        return (
          <div key={idx} className={`rounded-md border ${cfg.borderClass} ${cfg.bgClass} overflow-hidden`}>
            {/* Card header — always visible */}
            <button
              type="button"
              className="w-full flex items-center gap-2 px-3 py-2.5 text-left"
              onClick={() => setExpandedIndex(isExpanded ? null : idx)}
            >
              <span className="text-base flex-shrink-0">{cfg.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold ${cfg.colorClass}`}>
                  {t(issue.messageFr, issue.messageEn)}
                </p>
                <p className={`text-[10px] opacity-70 ${cfg.colorClass}`}>
                  {t(issue.rootCauseStepFr, issue.rootCauseStepEn)}
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {issue.canRecover && (
                  <span className="text-[9px] bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded font-semibold">
                    {t("Récupérable", "Recoverable")}
                  </span>
                )}
                {!issue.canRecover && (
                  <span className="text-[9px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded font-semibold">
                    {t("Redémarrage requis", "Restart required")}
                  </span>
                )}
                {isExpanded ? <ChevronUp size={12} className={cfg.colorClass} /> : <ChevronDown size={12} className={cfg.colorClass} />}
              </div>
            </button>

            {/* Expanded detail */}
            {isExpanded && (
              <div className={`border-t ${cfg.borderClass} px-3 py-3 space-y-3`}>
                {/* Root cause */}
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-wide opacity-60 mb-1 ${cfg.colorClass}`}>
                    {t("Cause racine", "Root cause")}
                  </p>
                  <p className={`text-xs ${cfg.colorClass}`}>{t(issue.rootCauseFr, issue.rootCauseEn)}</p>
                </div>

                {/* Impact */}
                <div className="rounded border border-current/20 px-2.5 py-2">
                  <p className={`text-[10px] font-bold uppercase tracking-wide opacity-60 mb-1 ${cfg.colorClass}`}>
                    {t("Impact système / ERP", "System / ERP impact")}
                  </p>
                  <p className={`text-xs ${cfg.colorClass}`}>{t(issue.impactFr, issue.impactEn)}</p>
                </div>

                {/* Correction */}
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-wide opacity-60 mb-1 ${cfg.colorClass}`}>
                    {t("Action corrective", "Corrective action")}
                  </p>
                  <p className={`text-xs ${cfg.colorClass}`}>{t(issue.correctionFr, issue.correctionEn)}</p>
                </div>

                {/* Recovery buttons */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {issue.canRecover && issue.recoveryStepCode && (
                    <button
                      type="button"
                      onClick={() => onNavigateToStep(issue.recoveryStepCode!)}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded border ${cfg.borderClass} ${cfg.colorClass} hover:opacity-80 transition-opacity`}
                    >
                      <ArrowLeft size={12} />
                      {t(issue.recoveryStepLabelFr, issue.recoveryStepLabelEn)}
                    </button>
                  )}
                  {!issue.canRecover && (
                    <div className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border ${cfg.borderClass} ${cfg.colorClass} opacity-60`}>
                      <AlertTriangle size={12} />
                      <span>{t("Ce scénario doit être redémarré pour résoudre la non-conformité détectée.", "This scenario must be restarted to resolve the detected non-conformity.")}</span>
                    </div>
                  )}
                  {issue.odooAuditUrl && (
                    <a
                      href={issue.odooAuditUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded border ${cfg.borderClass} ${cfg.colorClass} opacity-70 hover:opacity-100 transition-opacity`}
                    >
                      <ExternalLink size={11} />
                      {t(issue.odooAuditLabelFr ?? "Odoo Audit", issue.odooAuditLabelEn ?? "Odoo Audit")}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* ── Retry Compliance Button ───────────────────────────────────────── */}
      {issues.some((i) => i.canRecover) && (
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={onRetryCompliance}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
          >
            <RefreshCw size={12} />
            {t("Relancer la vérification de conformité", "Retry compliance check")}
          </button>
          <p className="text-[10px] text-muted-foreground">
            {t("Après correction, relancez pour vérifier l'état du système.", "After correction, retry to verify system state.")}
          </p>
        </div>
      )}

      {/* ── ERP Governance Principles (collapsible) ──────────────────────── */}
      <div className="rounded-md border border-muted overflow-hidden">
        <button
          type="button"
          className="w-full flex items-center gap-2 px-3 py-2 text-left"
          onClick={() => setShowErpPrinciples(!showErpPrinciples)}
        >
          <Database size={13} className="text-muted-foreground flex-shrink-0" />
          <p className="text-xs font-semibold text-muted-foreground flex-1">
            {t("Principes ERP / Gouvernance WMS", "ERP Principles / WMS Governance")}
          </p>
          {showErpPrinciples ? <ChevronUp size={12} className="text-muted-foreground" /> : <ChevronDown size={12} className="text-muted-foreground" />}
        </button>
        {showErpPrinciples && (
          <div className="border-t border-muted px-3 py-3 space-y-2">
            {issues.map((issue, idx) => (
              <div key={idx} className="text-[10px] text-muted-foreground">
                <span className="font-semibold">{ISSUE_TYPE_CONFIG[issue.type].icon} {issue.type.replace(/_/g, " ")} — </span>
                {t(issue.erpPrincipleFr, issue.erpPrincipleEn)}
              </div>
            ))}
            <div className="text-[10px] text-muted-foreground pt-1 border-t border-muted">
              <p className="font-semibold mb-0.5">{t("Règles universelles ERP/WMS :", "Universal ERP/WMS rules:")}</p>
              <p>• {t("Intégrité séquentielle : PO → GR → PUTAWAY → SO → GI → CC → COMPLIANCE", "Sequential integrity: PO → GR → PUTAWAY → SO → GI → CC → COMPLIANCE")}</p>
              <p>• {t("Cohérence du stock : stock système = stock physique à tout moment", "Stock consistency: system stock = physical stock at all times")}</p>
              <p>• {t("Validation des transactions : chaque document doit être posté avant de passer à l'étape suivante", "Transaction validation: every document must be posted before proceeding")}</p>
              <p>• {t("Auditabilité : chaque mouvement doit être traçable et justifiable", "Auditability: every movement must be traceable and justifiable")}</p>
              <p>• {t("Réconciliation : tout écart détecté doit être documenté et ajusté", "Reconciliation: every detected variance must be documented and adjusted")}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Demo mode note ────────────────────────────────────────────────── */}
      {isDemo && (
        <div className="flex items-start gap-2 px-3 py-2 rounded-md bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800">
          <ClipboardList size={13} className="text-indigo-500 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-indigo-700 dark:text-indigo-300">
            {t(
              "Mode démonstration : la clôture est autorisée même avec des non-conformités. En mode évaluation, toutes les non-conformités doivent être résolues.",
              "Demo mode: closing is allowed even with non-conformities. In evaluation mode, all non-conformities must be resolved."
            )}
          </p>
        </div>
      )}
    </div>
  );
}
