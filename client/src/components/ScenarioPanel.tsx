/**
 * ScenarioPanel — implements the TEC.WMS scenario JSON schema
 *
 * Each scenario follows:
 *   - odoo_intervention: { trigger, route, action, expected_observation, resolution }
 *   - wms_return_logic:  { mode: "manual_confirmation", message, validation }
 *   - instructor_script: { what_to_say, common_mistake, teaching_moment }
 *
 * Rules:
 *   1. Odoo is a REFERENCE system — never integrated, never auto-resolved
 *   2. Manual confirmation required after Odoo observation
 *   3. No loops — one concept per scenario
 *   4. UI: clear action → clear explanation → clear validation step
 *
 * Persistence: confirmation is stored via trpc.scenarios.confirmPanel which
 * writes a synthetic progress record ("SCN-004-CONFIRMED") to the DB.
 */

import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { ExternalLink, Eye, CheckSquare, AlertTriangle, BookOpen, ChevronDown, ChevronUp, GraduationCap } from "lucide-react";

// ─── Scenario Data Types ──────────────────────────────────────────────────────
export interface ScenarioConfig {
  scenario_id: string;
  module: string;
  title: string;
  titleEn: string;
  type: "positive" | "negative";
  learning_objective: string;
  learning_objectiveEn: string;
  error_type: string;
  wms_step: string;
  odoo_intervention: {
    trigger: string;
    triggerEn: string;
    route: string;
    action: string;
    actionEn: string;
    expected_observation: string;
    expected_observationEn: string;
    resolution: string;
    resolutionEn: string;
  };
  wms_return_logic: {
    mode: "manual_confirmation" | "auto_unlock";
    message: string;
    messageEn: string;
    validation: string;
    validationEn: string;
  };
  instructor_script: {
    what_to_say: string;
    what_to_sayEn: string;
    common_mistake: string;
    common_mistakeEn: string;
    teaching_moment: string;
    teaching_momentEn: string;
  };
}

// ─── Scenario Registry ────────────────────────────────────────────────────────
export const SCENARIO_REGISTRY: Record<string, ScenarioConfig> = {
  // ── SCN-004: Stock négatif (M3 / REPLENISH step) ──────────────────────────
  // Triggered at the Replenishment step because that is when M3 students
  // discover that a previous GI created a negative stock condition.
  "SCN-004": {
    scenario_id: "SCN-004",
    module: "M3",
    title: "Stock négatif",
    titleEn: "Negative Stock",
    type: "negative",
    learning_objective: "Comprendre le contrôle de sortie : on ne peut pas livrer ce qu'on n'a pas reçu.",
    learning_objectiveEn: "Understand output control: you cannot deliver what you have not received.",
    error_type: "negative_stock",
    wms_step: "REPLENISH",
    odoo_intervention: {
      trigger: "Incohérence de livraison détectée — stock insuffisant avant GI",
      triggerEn: "Delivery inconsistency detected — insufficient stock before GI",
      route: "https://concorde-logistics-lab.odoo.com/odoo/inventory/reporting",
      action: "Ouvrir Odoo → Inventaire → Reporting. Vérifier la quantité disponible pour le SKU concerné.",
      actionEn: "Open Odoo → Inventory → Reporting. Check the available quantity for the relevant SKU.",
      expected_observation: "La quantité disponible est 0 ou inférieure à la quantité demandée. Le système indique un stock négatif ou insuffisant.",
      expected_observationEn: "The available quantity is 0 or below the requested quantity. The system shows negative or insufficient stock.",
      resolution: "Identifier la cause : GR non validée, GI exécutée avant GR, ou quantité mal saisie. Corriger la séquence avant de relancer.",
      resolutionEn: "Identify the cause: unvalidated GR, GI executed before GR, or incorrect quantity entered. Fix the sequence before retrying.",
    },
    wms_return_logic: {
      mode: "manual_confirmation",
      message: "Qu'est-ce qui a causé le stock négatif ?",
      messageEn: "What caused the negative stock?",
      validation: "L'étudiant explique la rupture de séquence (GI avant GR ou GR non postée)",
      validationEn: "Student explains the sequence break (GI before GR or unposted GR)",
    },
    instructor_script: {
      what_to_say: "Vous ne pouvez pas livrer ce que vous n'avez pas reçu.",
      what_to_sayEn: "You cannot deliver what you have not received.",
      common_mistake: "Ignorer la séquence et exécuter le GI sans vérifier le stock disponible.",
      common_mistakeEn: "Ignoring the sequence and executing GI without checking available stock.",
      teaching_moment: "Le flux logistique est causal : chaque étape dépend de la précédente. GI sans GR = anomalie critique en audit.",
      teaching_momentEn: "The logistics flow is causal: each step depends on the previous one. GI without GR = critical audit anomaly.",
    },
  },

  // ── SCN-005: Erreur cachée (M5 / COMPLIANCE_M5 step only) ─────────────────
  "SCN-005": {
    scenario_id: "SCN-005",
    module: "M5",
    title: "Erreur cachée",
    titleEn: "Hidden Error",
    type: "negative",
    learning_objective: "Comprendre l'audit et les erreurs accumulées : une erreur ancienne impacte le présent.",
    learning_objectiveEn: "Understand audit and accumulated errors: an old error impacts the present.",
    error_type: "hidden_error",
    wms_step: "COMPLIANCE_M5",
    odoo_intervention: {
      trigger: "Audit final du module — vérification de la cohérence documentaire",
      triggerEn: "Module final audit — documentary consistency check",
      route: "https://concorde-logistics-lab.odoo.com/odoo/inventory/receipts",
      action: "Ouvrir Odoo → Inventaire → Réceptions. Rechercher des documents en statut READY (non validés). Identifier le document le plus ancien.",
      actionEn: "Open Odoo → Inventory → Receipts. Search for documents in READY status (not validated). Identify the oldest document.",
      expected_observation: "Un ou plusieurs documents de réception en statut READY — créés mais jamais validés. Ces documents bloquent la clôture de période.",
      expected_observationEn: "One or more receipt documents in READY status — created but never validated. These documents block period closing.",
      resolution: "Valider ou annuler chaque document READY. Un document READY non traité = transaction fantôme qui fausse les rapports de stock.",
      resolutionEn: "Validate or cancel each READY document. An untreated READY document = ghost transaction that distorts stock reports.",
    },
    wms_return_logic: {
      mode: "manual_confirmation",
      message: "Le système n'est pas propre — identifiez le problème.",
      messageEn: "System not clean — identify the issue.",
      validation: "L'étudiant complète l'audit : identifie le document READY et explique son impact sur la clôture",
      validationEn: "Student completes the audit: identifies the READY document and explains its impact on period closing",
    },
    instructor_script: {
      what_to_say: "Une erreur ancienne impacte le présent. Le système n'oublie jamais.",
      what_to_sayEn: "An old error impacts the present. The system never forgets.",
      common_mistake: "Ignorer l'historique des transactions et se concentrer uniquement sur les opérations actuelles.",
      common_mistakeEn: "Ignoring transaction history and focusing only on current operations.",
      teaching_moment: "La mentalité auditeur : chaque transaction laisse une trace. Une clôture de période propre exige que TOUTES les transactions soient résolues.",
      teaching_momentEn: "The auditor mindset: every transaction leaves a trace. A clean period close requires ALL transactions to be resolved.",
    },
  },
};

// ─── ScenarioPanel Component ──────────────────────────────────────────────────
interface ScenarioPanelProps {
  scenarioId: string;
  /** Run ID — required for persistence via tRPC */
  runId?: number;
  /** Pre-confirmed state (from completedSteps containing "SCN-XXX-CONFIRMED") */
  alreadyConfirmed?: boolean;
  /** Called when student confirms they have completed the Odoo observation */
  onConfirm?: () => void;
}

export function ScenarioPanel({ scenarioId, runId, alreadyConfirmed = false, onConfirm }: ScenarioPanelProps) {
  const { t } = useLanguage();
  const [odooOpened, setOdooOpened] = useState(false);
  const [showInstructor, setShowInstructor] = useState(false);
  const [studentAnswer, setStudentAnswer] = useState("");
  const [submitted, setSubmitted] = useState(alreadyConfirmed);

  const confirmMutation = trpc.scenarios.confirmPanel.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      onConfirm?.();
    },
  });

  const scenario = SCENARIO_REGISTRY[scenarioId];
  if (!scenario) return null;

  const isNegative = scenario.type === "negative";
  const borderColor = isNegative
    ? "border-red-300 dark:border-red-700"
    : "border-emerald-300 dark:border-emerald-700";
  const headerBg = isNegative
    ? "bg-red-50 dark:bg-red-950/40"
    : "bg-emerald-50 dark:bg-emerald-950/40";
  const headerText = isNegative
    ? "text-red-800 dark:text-red-200"
    : "text-emerald-800 dark:text-emerald-200";
  const accentColor = isNegative
    ? "text-red-700 dark:text-red-300"
    : "text-emerald-700 dark:text-emerald-300";
  const badgeBg = isNegative
    ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
    : "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";

  const handleConfirm = () => {
    if (!studentAnswer.trim()) return;
    if (runId) {
      confirmMutation.mutate({ runId, scenarioId, studentAnswer });
    } else {
      // No runId (e.g., demo mode without a run) — just mark locally
      setSubmitted(true);
      onConfirm?.();
    }
  };

  return (
    <div className={`mt-4 border ${borderColor} rounded-md overflow-hidden`}>
      {/* ── HEADER: Scenario ID + Title + Type badge ─────────────────────── */}
      <div className={`${headerBg} px-4 py-3 border-b ${borderColor}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-base flex-shrink-0">{isNegative ? "🔴" : "🟢"}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-mono font-bold ${accentColor} opacity-70`}>
                  {scenario.scenario_id}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${badgeBg}`}>
                  {scenario.module} · {isNegative
                    ? t("Scénario négatif", "Negative scenario")
                    : t("Scénario positif", "Positive scenario")}
                </span>
              </div>
              <p className={`text-xs font-bold ${headerText} mt-0.5`}>
                {t(scenario.title, scenario.titleEn)}
              </p>
            </div>
          </div>
          {submitted && (
            <span className="flex-shrink-0 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckSquare size={12} /> {t("Confirmé", "Confirmed")}
            </span>
          )}
        </div>
        {/* Learning objective */}
        <div className="mt-2 flex items-start gap-1.5">
          <BookOpen size={10} className={`${accentColor} flex-shrink-0 mt-0.5`} />
          <p className={`text-[10px] ${accentColor} leading-relaxed`}>
            <span className="font-semibold">{t("Objectif :", "Objective:")} </span>
            {t(scenario.learning_objective, scenario.learning_objectiveEn)}
          </p>
        </div>
      </div>

      {/* ── SECTION 1: TRIGGER ───────────────────────────────────────────── */}
      <div className="px-4 py-3 border-b border-border/50">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
          ⚡ {t("Déclencheur", "Trigger")}
        </p>
        <p className="text-[11px] text-foreground leading-relaxed">
          {t(scenario.odoo_intervention.trigger, scenario.odoo_intervention.triggerEn)}
        </p>
      </div>

      {/* ── SECTION 2: ODOO ACTION ───────────────────────────────────────── */}
      <div className="px-4 py-3 border-b border-border/50 bg-muted/20">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
          🔵 {t("Action dans Odoo", "Action in Odoo")}
        </p>
        <p className="text-[11px] text-foreground leading-relaxed mb-3">
          {t(scenario.odoo_intervention.action, scenario.odoo_intervention.actionEn)}
        </p>
        <a
          href={scenario.odoo_intervention.route}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOdooOpened(true)}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded border text-[10px] font-semibold transition-colors ${
            odooOpened
              ? "bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300"
              : "bg-blue-600 hover:bg-blue-700 border-blue-600 text-white"
          }`}
        >
          <ExternalLink size={11} />
          {odooOpened
            ? t("Odoo ouvert ✓ — Ouvrir à nouveau ↗", "Odoo opened ✓ — Open again ↗")
            : t("Ouvrir Odoo — Concorde Logistics Lab ↗", "Open Odoo — Concorde Logistics Lab ↗")}
        </a>
        {!odooOpened && (
          <p className="text-[9px] text-muted-foreground italic mt-1.5">
            {t(
              "Session requise — connectez-vous à concorde-logistics-lab.odoo.com avant d'ouvrir.",
              "Session required — log in to concorde-logistics-lab.odoo.com before opening."
            )}
          </p>
        )}
      </div>

      {/* ── SECTION 3: EXPECTED OBSERVATION ─────────────────────────────── */}
      <div className="px-4 py-3 border-b border-border/50">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
          <Eye size={10} className="inline mr-1" />
          {t("Ce que vous devez observer", "What you should observe")}
        </p>
        <p className={`text-[11px] leading-relaxed font-medium ${accentColor}`}>
          {t(scenario.odoo_intervention.expected_observation, scenario.odoo_intervention.expected_observationEn)}
        </p>
      </div>

      {/* ── SECTION 4: RESOLUTION PATH ───────────────────────────────────── */}
      <div className="px-4 py-3 border-b border-border/50 bg-muted/10">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
          🔧 {t("Comment corriger", "How to resolve")}
        </p>
        <p className="text-[11px] text-foreground leading-relaxed">
          {t(scenario.odoo_intervention.resolution, scenario.odoo_intervention.resolutionEn)}
        </p>
      </div>

      {/* ── SECTION 5: MANUAL CONFIRMATION ───────────────────────────────── */}
      {!submitted ? (
        <div className={`px-4 py-3 border-b ${borderColor} ${isNegative ? "bg-red-50/50 dark:bg-red-950/20" : "bg-emerald-50/50 dark:bg-emerald-950/20"}`}>
          <div className="flex items-start gap-2 mb-3">
            <AlertTriangle size={12} className={`${accentColor} flex-shrink-0 mt-0.5`} />
            <div>
              <p className={`text-[11px] font-bold ${headerText}`}>
                {t(scenario.wms_return_logic.message, scenario.wms_return_logic.messageEn)}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {t(scenario.wms_return_logic.validation, scenario.wms_return_logic.validationEn)}
              </p>
            </div>
          </div>
          <textarea
            value={studentAnswer}
            onChange={(e) => setStudentAnswer(e.target.value)}
            placeholder={t(
              "Décrivez ce que vous avez observé dans Odoo et expliquez la cause du problème...",
              "Describe what you observed in Odoo and explain the root cause of the issue..."
            )}
            className="w-full text-[11px] border border-border rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            rows={3}
          />
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!studentAnswer.trim() || !odooOpened || confirmMutation.isPending}
            className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              isNegative
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            {confirmMutation.isPending ? (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <CheckSquare size={12} />
            )}
            {t("Confirmer l'observation et continuer", "Confirm observation and continue")}
          </button>
          {!odooOpened && (
            <p className="text-[9px] text-muted-foreground italic mt-1">
              {t("Ouvrez Odoo d'abord pour activer la confirmation.", "Open Odoo first to enable confirmation.")}
            </p>
          )}
          {confirmMutation.isError && (
            <p className="text-[10px] text-destructive mt-1">
              {t("Erreur lors de la sauvegarde. Réessayez.", "Error saving. Please try again.")}
            </p>
          )}
        </div>
      ) : (
        <div className="px-4 py-3 border-b border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30">
          <div className="flex items-center gap-2">
            <CheckSquare size={14} className="text-emerald-600 dark:text-emerald-400" />
            <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
              {t("Observation confirmée — concept validé", "Observation confirmed — concept validated")}
            </p>
          </div>
          {studentAnswer && (
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 italic leading-relaxed">
              « {studentAnswer} »
            </p>
          )}
        </div>
      )}

      {/* ── SECTION 6: INSTRUCTOR SCRIPT (collapsible) ───────────────────── */}
      <div className="px-4 py-2">
        <button
          type="button"
          onClick={() => setShowInstructor(!showInstructor)}
          className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors w-full text-left"
        >
          <GraduationCap size={11} />
          {t("Script enseignant", "Instructor script")}
          {showInstructor ? <ChevronUp size={10} className="ml-auto" /> : <ChevronDown size={10} className="ml-auto" />}
        </button>
        {showInstructor && (
          <div className="mt-2 space-y-2 pb-1">
            <div className="bg-muted/30 rounded p-2">
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                {t("Phrase-clé", "Key phrase")}
              </p>
              <p className="text-[10px] text-foreground italic">
                « {t(scenario.instructor_script.what_to_say, scenario.instructor_script.what_to_sayEn)} »
              </p>
            </div>
            <div className="bg-muted/30 rounded p-2">
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                {t("Erreur fréquente", "Common mistake")}
              </p>
              <p className="text-[10px] text-foreground">
                {t(scenario.instructor_script.common_mistake, scenario.instructor_script.common_mistakeEn)}
              </p>
            </div>
            <div className="bg-muted/30 rounded p-2">
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                {t("Moment pédagogique", "Teaching moment")}
              </p>
              <p className="text-[10px] text-foreground leading-relaxed">
                {t(scenario.instructor_script.teaching_moment, scenario.instructor_script.teaching_momentEn)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
