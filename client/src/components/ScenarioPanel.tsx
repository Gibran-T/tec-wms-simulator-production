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
  // ── SCN-001: Réception fantôme (M1 / GR step) ────────────────────────────────
  // A GR created but never posted — stock appears received but the system
  // shows zero. Students discover the difference between creating and posting.
  "SCN-001": {
    scenario_id: "SCN-001",
    module: "M1",
    title: "Réception fantôme",
    titleEn: "Ghost Receipt",
    type: "negative",
    learning_objective: "Comprendre que créer une transaction ≠ la poster : seul le posting crée un mouvement de stock réel.",
    learning_objectiveEn: "Understand that creating a transaction ≠ posting it: only posting creates a real stock movement.",
    error_type: "unposted_gr",
    wms_step: "GR",
    odoo_intervention: {
      trigger: "Réception enregistrée dans TEC.WMS mais stock toujours à zéro dans Odoo",
      triggerEn: "Receipt recorded in TEC.WMS but stock still zero in Odoo",
      route: "https://concorde-logistics-lab.odoo.com/odoo/inventory/receipts",
      action: "Ouvrir Odoo → Inventaire → Réceptions. Rechercher le bon de réception correspondant. Vérifier son statut : READY ou DONE ?",
      actionEn: "Open Odoo → Inventory → Receipts. Find the corresponding receipt. Check its status: READY or DONE?",
      expected_observation: "Le bon de réception est en statut READY (créé mais non validé). Le stock n'a pas bougé car la transaction n'a pas été postée.",
      expected_observationEn: "The receipt is in READY status (created but not validated). Stock has not moved because the transaction was not posted.",
      resolution: "Valider (poster) le bon de réception dans Odoo pour que le stock soit mis à jour. Dans SAP, c'est l'équivalent de cliquer 'Post' dans MIGO.",
      resolutionEn: "Validate (post) the receipt in Odoo to update stock. In SAP, this is equivalent to clicking 'Post' in MIGO.",
    },
    wms_return_logic: {
      mode: "manual_confirmation",
      message: "Quelle est la différence entre créer et poster une transaction ?",
      messageEn: "What is the difference between creating and posting a transaction?",
      validation: "L'étudiant explique que seul le posting crée un document matière et impacte le stock",
      validationEn: "Student explains that only posting creates a material document and impacts stock",
    },
    instructor_script: {
      what_to_say: "Une transaction non postée n'existe pas pour le système. C'est une intention, pas un fait.",
      what_to_sayEn: "An unposted transaction does not exist for the system. It is an intention, not a fact.",
      common_mistake: "Confondre la saisie des données avec la validation — croire que remplir le formulaire suffit.",
      common_mistakeEn: "Confusing data entry with validation — believing that filling the form is enough.",
      teaching_moment: "Dans SAP et Odoo, chaque transaction a deux états : brouillon (draft/READY) et posté (DONE). Seul le posting génère un document comptable et un mouvement de stock.",
      teaching_momentEn: "In SAP and Odoo, every transaction has two states: draft (READY) and posted (DONE). Only posting generates an accounting document and a stock movement.",
    },
  },

  // ── SCN-002: Violation FIFO (M2 / FIFO_PICK step) ────────────────────────────
  // Student picks the wrong lot — newest instead of oldest. Odoo's lot list
  // shows the correct FIFO order; student must identify the error.
  "SCN-002": {
    scenario_id: "SCN-002",
    module: "M2",
    title: "Violation FIFO",
    titleEn: "FIFO Violation",
    type: "negative",
    learning_objective: "Comprendre la règle FIFO : le lot le plus ancien doit toujours être prélevé en premier pour éviter les péremptions.",
    learning_objectiveEn: "Understand the FIFO rule: the oldest lot must always be picked first to prevent expiry.",
    error_type: "fifo_violation",
    wms_step: "FIFO_PICK",
    odoo_intervention: {
      trigger: "Prélèvement effectué sur un lot récent alors qu'un lot plus ancien est disponible",
      triggerEn: "Pick performed on a recent lot while an older lot is available",
      route: "https://concorde-logistics-lab.odoo.com/odoo/inventory/products",
      action: "Ouvrir Odoo → Inventaire → Produits. Sélectionner le produit concerné → onglet 'Lots/Numéros de série'. Observer les dates de réception de chaque lot.",
      actionEn: "Open Odoo → Inventory → Products. Select the relevant product → 'Lots/Serial Numbers' tab. Observe the reception date of each lot.",
      expected_observation: "Deux lots ou plus sont visibles. Le lot prélevé a une date de réception plus récente que le lot disponible. La règle FIFO a été violée.",
      expected_observationEn: "Two or more lots are visible. The picked lot has a more recent reception date than the available lot. The FIFO rule was violated.",
      resolution: "Annuler le prélèvement et recommencer en sélectionnant le lot avec la date de réception la plus ancienne. Dans Odoo, activer 'Stratégie de retrait : FIFO' dans la configuration du produit.",
      resolutionEn: "Cancel the pick and restart by selecting the lot with the oldest reception date. In Odoo, enable 'Removal Strategy: FIFO' in the product configuration.",
    },
    wms_return_logic: {
      mode: "manual_confirmation",
      message: "Quel lot aurait dû être prélevé en premier, et pourquoi ?",
      messageEn: "Which lot should have been picked first, and why?",
      validation: "L'étudiant identifie le lot le plus ancien et explique le risque de péremption si FIFO n'est pas respecté",
      validationEn: "Student identifies the oldest lot and explains the expiry risk if FIFO is not followed",
    },
    instructor_script: {
      what_to_say: "FIFO n'est pas une option — c'est une obligation légale pour les produits périssables.",
      what_to_sayEn: "FIFO is not an option — it is a legal obligation for perishable products.",
      common_mistake: "Prélever le lot le plus accessible physiquement plutôt que le plus ancien chronologiquement.",
      common_mistakeEn: "Picking the most physically accessible lot rather than the chronologically oldest one.",
      teaching_moment: "La méthode FIFO (First In, First Out) garantit que les marchandises les plus anciennes quittent l'entrepôt en premier. Dans Odoo et SAP, elle est configurable par produit et appliquée automatiquement lors du picking.",
      teaching_momentEn: "The FIFO (First In, First Out) method ensures that the oldest goods leave the warehouse first. In Odoo and SAP, it is configurable per product and applied automatically during picking.",
    },
  },

  // ── SCN-003: Diagnostic KPI (M4 / KPI_DIAGNOSTIC step) ───────────────────────
  // Positive scenario — student reads the KPI dashboard in Odoo and interprets
  // the four key indicators: rotation, service level, error rate, lead time.
  "SCN-003": {
    scenario_id: "SCN-003",
    module: "M4",
    title: "Diagnostic KPI",
    titleEn: "KPI Diagnostic",
    type: "positive",
    learning_objective: "Lire et interpréter un tableau de bord logistique : rotation des stocks, taux de service, taux d'erreur, délai moyen.",
    learning_objectiveEn: "Read and interpret a logistics KPI dashboard: stock turnover, service level, error rate, average lead time.",
    error_type: "kpi_misreading",
    wms_step: "KPI_DIAGNOSTIC",
    odoo_intervention: {
      trigger: "Étape de diagnostic global — validation des indicateurs de performance",
      triggerEn: "Global diagnostic step — performance indicator validation",
      route: "https://concorde-logistics-lab.odoo.com/odoo/inventory/reporting",
      action: "Ouvrir Odoo → Inventaire → Reporting. Explorer les rapports disponibles : mouvements de stock, valorisation, analyse par emplacement.",
      actionEn: "Open Odoo → Inventory → Reporting. Explore the available reports: stock moves, valuation, location analysis.",
      expected_observation: "Le reporting Odoo affiche les mouvements de stock, les valorisations et les analyses par emplacement. Ces données correspondent aux KPI calculés dans TEC.WMS.",
      expected_observationEn: "Odoo reporting shows stock movements, valuations, and location analyses. This data corresponds to the KPIs calculated in TEC.WMS.",
      resolution: "Comparer les données Odoo avec les KPI calculés dans TEC.WMS. Identifier les écarts et formuler un diagnostic : quel indicateur est le plus préoccupant ?",
      resolutionEn: "Compare Odoo data with the KPIs calculated in TEC.WMS. Identify gaps and formulate a diagnosis: which indicator is most concerning?",
    },
    wms_return_logic: {
      mode: "manual_confirmation",
      message: "Quel KPI est le plus préoccupant dans ce scénario, et quelle action recommandez-vous ?",
      messageEn: "Which KPI is most concerning in this scenario, and what action do you recommend?",
      validation: "L'étudiant identifie l'indicateur critique et propose une action corrective concrète",
      validationEn: "Student identifies the critical indicator and proposes a concrete corrective action",
    },
    instructor_script: {
      what_to_say: "Un KPI sans action corrective n'est qu'un chiffre. La valeur est dans la décision qu'il déclenche.",
      what_to_sayEn: "A KPI without corrective action is just a number. The value is in the decision it triggers.",
      common_mistake: "Lire les KPI sans les contextualiser — comparer à un benchmark ou à la période précédente.",
      common_mistakeEn: "Reading KPIs without contextualizing them — comparing to a benchmark or previous period.",
      teaching_moment: "Les 4 KPI fondamentaux de la logistique : (1) Rotation = consommation annuelle / stock moyen, (2) Taux de service = commandes livrées à temps / total, (3) Taux d'erreur = erreurs / opérations, (4) Délai moyen = temps entre commande et livraison. Chaque KPI déclenche une action spécifique.",
      teaching_momentEn: "The 4 fundamental logistics KPIs: (1) Turnover = annual consumption / average stock, (2) Service level = orders delivered on time / total, (3) Error rate = errors / operations, (4) Average lead time = time between order and delivery. Each KPI triggers a specific action.",
    },
  },

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
