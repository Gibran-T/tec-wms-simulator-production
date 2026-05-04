/**
 * ScenarioPanel — Guided Discovery Mode
 *
 * UX Flow (4 states):
 *   COLLAPSED  → small amber banner "⚠️ Situation détectée (optionnel)" + hint + button
 *   STEP_1     → Odoo task instructions + 1 discovery question (NO explanation shown)
 *   STEP_2     → Reveal explanation, root cause, correction (unlocked after Step 1 input ≥ 10 chars)
 *   STEP_3     → Final written answer + confirm button (enabled only when non-empty + Odoo opened)
 *
 * Rules:
 *   1. Odoo is a REFERENCE system — never integrated, never auto-resolved
 *   2. Full explanation is NEVER shown immediately — student must observe first
 *   3. No loops — one concept per scenario
 *   4. Scenario never blocks the normal WMS transaction
 *   5. Teacher script is always hidden by default (collapsible accordion)
 *
 * Persistence: confirmation stored via trpc.scenarios.confirmPanel
 * which writes "SCN-XXX-CONFIRMED" to completedSteps in the DB.
 */

import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import {
  ExternalLink,
  Eye,
  CheckSquare,
  AlertTriangle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Search,
  Lightbulb,
  ChevronRight,
} from "lucide-react";

// ─── Scenario Data Types ──────────────────────────────────────────────────────
export interface ScenarioConfig {
  scenario_id: string;
  module: string;
  title: string;
  titleEn: string;
  /** Short hint shown in the collapsed banner */
  hint: string;
  hintEn: string;
  type: "positive" | "negative";
  learning_objective: string;
  learning_objectiveEn: string;
  error_type: string;
  wms_step: string;
  odoo_intervention: {
    trigger: string;
    triggerEn: string;
    route: string;
    /** Step 1: task instructions — what to open and where to look */
    action: string;
    actionEn: string;
    /** Step 1: single discovery question — shown WITHOUT explanation */
    discovery_question: string;
    discovery_questionEn: string;
    /** Step 2: what student should have seen — revealed AFTER Step 1 input */
    expected_observation: string;
    expected_observationEn: string;
    /** Step 2: root cause explanation — revealed AFTER Step 1 input */
    resolution: string;
    resolutionEn: string;
  };
  wms_return_logic: {
    mode: "manual_confirmation" | "auto_unlock";
    /** Step 3: final question requiring a written answer */
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
  // ── SCN-001: Réception fantôme (M1 / GR step — moduleId === 1 guard) ─────────
  "SCN-001": {
    scenario_id: "SCN-001",
    module: "M1",
    title: "Réception fantôme",
    titleEn: "Ghost Receipt",
    hint: "Stock à zéro après réception — quelque chose ne va pas.",
    hintEn: "Stock still zero after receipt — something is wrong.",
    type: "negative",
    learning_objective: "Créer une transaction ≠ la poster. Seul le posting crée un mouvement de stock réel.",
    learning_objectiveEn: "Creating a transaction ≠ posting it. Only posting creates a real stock movement.",
    error_type: "unposted_gr",
    wms_step: "GR",
    odoo_intervention: {
      trigger: "Réception enregistrée dans TEC.WMS mais stock toujours à zéro dans Odoo",
      triggerEn: "Receipt recorded in TEC.WMS but stock still zero in Odoo",
      route: "https://concorde-logistics-lab.odoo.com/odoo/inventory/receipts",
      action: "Ouvrir Odoo → Inventaire → Réceptions. Rechercher le bon de réception correspondant à votre commande.",
      actionEn: "Open Odoo → Inventory → Receipts. Find the receipt corresponding to your purchase order.",
      discovery_question: "Quel est le statut du bon de réception que vous voyez ? Qu'est-ce que ce statut signifie pour le stock ?",
      discovery_questionEn: "What is the status of the receipt you see? What does this status mean for stock?",
      expected_observation: "Le bon de réception est en statut READY (créé mais non validé). Le stock n'a pas bougé car la transaction n'a jamais été postée.",
      expected_observationEn: "The receipt is in READY status (created but not validated). Stock has not moved because the transaction was never posted.",
      resolution: "Pour que le stock soit mis à jour, il faut VALIDER (poster) le bon de réception. Dans SAP, c'est l'équivalent de cliquer 'Post' dans MIGO. Créer ≠ poster.",
      resolutionEn: "To update stock, you must VALIDATE (post) the receipt. In SAP, this is equivalent to clicking 'Post' in MIGO. Creating ≠ posting.",
    },
    wms_return_logic: {
      mode: "manual_confirmation",
      message: "Expliquez la différence entre créer et poster une transaction dans un ERP.",
      messageEn: "Explain the difference between creating and posting a transaction in an ERP.",
      validation: "L'étudiant explique que seul le posting crée un document matière et impacte le stock",
      validationEn: "Student explains that only posting creates a material document and impacts stock",
    },
    instructor_script: {
      what_to_say: "Une transaction non postée n'existe pas pour le système. C'est une intention, pas un fait.",
      what_to_sayEn: "An unposted transaction does not exist for the system. It is an intention, not a fact.",
      common_mistake: "Confondre la saisie des données avec la validation — croire que remplir le formulaire suffit.",
      common_mistakeEn: "Confusing data entry with validation — believing that filling the form is enough.",
      teaching_moment: "Dans SAP et Odoo, chaque transaction a deux états : brouillon (READY) et posté (DONE). Seul le posting génère un document comptable (Matbeleg/Journal Entry) et un mouvement de stock.",
      teaching_momentEn: "In SAP and Odoo, every transaction has two states: draft (READY) and posted (DONE). Only posting generates an accounting document (Matbeleg/Journal Entry) and a stock movement.",
    },
  },

  // ── SCN-002: Violation FIFO (M2 / FIFO_PICK step) ────────────────────────────
  "SCN-002": {
    scenario_id: "SCN-002",
    module: "M2",
    title: "Violation FIFO",
    titleEn: "FIFO Violation",
    hint: "Deux lots disponibles — lequel prélever en premier ?",
    hintEn: "Two lots available — which one to pick first?",
    type: "negative",
    learning_objective: "Le lot le plus ancien doit toujours être prélevé en premier (FIFO) pour éviter les péremptions.",
    learning_objectiveEn: "The oldest lot must always be picked first (FIFO) to prevent expiry.",
    error_type: "fifo_violation",
    wms_step: "FIFO_PICK",
    odoo_intervention: {
      trigger: "Prélèvement effectué sur un lot récent alors qu'un lot plus ancien est disponible",
      triggerEn: "Pick performed on a recent lot while an older lot is available",
      route: "https://concorde-logistics-lab.odoo.com/odoo/inventory/products",
      action: "Ouvrir Odoo → Inventaire → Produits. Sélectionner le produit concerné → onglet 'Lots/Numéros de série'. Observer les dates de réception de chaque lot.",
      actionEn: "Open Odoo → Inventory → Products. Select the relevant product → 'Lots/Serial Numbers' tab. Observe the reception date of each lot.",
      discovery_question: "Comparez les dates de réception des lots disponibles. Lequel a été reçu en premier ? Est-ce celui qui a été prélevé ?",
      discovery_questionEn: "Compare the reception dates of the available lots. Which one was received first? Is that the one that was picked?",
      expected_observation: "Deux lots ou plus sont visibles avec des dates différentes. Le lot prélevé a une date plus récente — la règle FIFO a été violée.",
      expected_observationEn: "Two or more lots are visible with different dates. The picked lot has a more recent date — the FIFO rule was violated.",
      resolution: "Annuler le prélèvement et recommencer en sélectionnant le lot avec la date de réception la plus ancienne. Dans Odoo, la stratégie FIFO peut être configurée automatiquement par produit.",
      resolutionEn: "Cancel the pick and restart by selecting the lot with the oldest reception date. In Odoo, the FIFO strategy can be configured automatically per product.",
    },
    wms_return_logic: {
      mode: "manual_confirmation",
      message: "Quel lot aurait dû être prélevé en premier, et pourquoi est-ce une obligation légale pour les produits périssables ?",
      messageEn: "Which lot should have been picked first, and why is this a legal obligation for perishable products?",
      validation: "L'étudiant identifie le lot le plus ancien et explique le risque de péremption si FIFO n'est pas respecté",
      validationEn: "Student identifies the oldest lot and explains the expiry risk if FIFO is not followed",
    },
    instructor_script: {
      what_to_say: "FIFO n'est pas une option — c'est une obligation légale pour les produits périssables.",
      what_to_sayEn: "FIFO is not an option — it is a legal obligation for perishable products.",
      common_mistake: "Prélever le lot le plus accessible physiquement plutôt que le plus ancien chronologiquement.",
      common_mistakeEn: "Picking the most physically accessible lot rather than the chronologically oldest one.",
      teaching_moment: "FIFO (First In, First Out) garantit que les marchandises les plus anciennes quittent l'entrepôt en premier. Dans Odoo et SAP, elle est configurable par produit (Removal Strategy). En cas d'audit, une violation FIFO = non-conformité réglementaire.",
      teaching_momentEn: "FIFO (First In, First Out) ensures the oldest goods leave the warehouse first. In Odoo and SAP, it is configurable per product (Removal Strategy). In an audit, a FIFO violation = regulatory non-compliance.",
    },
  },

  // ── SCN-003: Diagnostic KPI (M4 / KPI_DIAGNOSTIC step) ───────────────────────
  "SCN-003": {
    scenario_id: "SCN-003",
    module: "M4",
    title: "Diagnostic KPI",
    titleEn: "KPI Diagnostic",
    hint: "Comparez vos KPI TEC.WMS avec les données réelles Odoo.",
    hintEn: "Compare your TEC.WMS KPIs with real Odoo data.",
    type: "positive",
    learning_objective: "Lire et interpréter un tableau de bord logistique : rotation, taux de service, taux d'erreur, délai moyen.",
    learning_objectiveEn: "Read and interpret a logistics KPI dashboard: turnover, service level, error rate, average lead time.",
    error_type: "kpi_misreading",
    wms_step: "KPI_DIAGNOSTIC",
    odoo_intervention: {
      trigger: "Étape de diagnostic global — validation des indicateurs de performance",
      triggerEn: "Global diagnostic step — performance indicator validation",
      route: "https://concorde-logistics-lab.odoo.com/odoo/inventory/reporting",
      action: "Ouvrir Odoo → Inventaire → Reporting. Explorer les rapports : mouvements de stock, valorisation des stocks, analyse par emplacement.",
      actionEn: "Open Odoo → Inventory → Reporting. Explore the reports: stock moves, stock valuation, location analysis.",
      discovery_question: "Quel rapport Odoo correspond le mieux à votre KPI le plus préoccupant dans TEC.WMS ? Quelle différence observez-vous entre les deux systèmes ?",
      discovery_questionEn: "Which Odoo report best corresponds to your most concerning KPI in TEC.WMS? What difference do you observe between the two systems?",
      expected_observation: "Odoo affiche les mouvements de stock, les valorisations et les analyses par emplacement. Ces données permettent de valider ou d'infirmer les KPI calculés dans TEC.WMS.",
      expected_observationEn: "Odoo displays stock movements, valuations, and location analyses. This data allows you to validate or invalidate the KPIs calculated in TEC.WMS.",
      resolution: "Comparer les données Odoo avec les KPI TEC.WMS. Identifier l'écart le plus significatif. Un KPI sans action corrective n'est qu'un chiffre — la valeur est dans la décision qu'il déclenche.",
      resolutionEn: "Compare Odoo data with TEC.WMS KPIs. Identify the most significant gap. A KPI without corrective action is just a number — the value is in the decision it triggers.",
    },
    wms_return_logic: {
      mode: "manual_confirmation",
      message: "Quel KPI est le plus préoccupant dans ce scénario, et quelle action corrective concrète recommandez-vous ?",
      messageEn: "Which KPI is most concerning in this scenario, and what concrete corrective action do you recommend?",
      validation: "L'étudiant identifie l'indicateur critique et propose une action corrective concrète",
      validationEn: "Student identifies the critical indicator and proposes a concrete corrective action",
    },
    instructor_script: {
      what_to_say: "Un KPI sans action corrective n'est qu'un chiffre. La valeur est dans la décision qu'il déclenche.",
      what_to_sayEn: "A KPI without corrective action is just a number. The value is in the decision it triggers.",
      common_mistake: "Lire les KPI sans les contextualiser — ne pas comparer à un benchmark ou à la période précédente.",
      common_mistakeEn: "Reading KPIs without contextualizing them — not comparing to a benchmark or previous period.",
      teaching_moment: "Les 4 KPI fondamentaux : (1) Rotation = consommation annuelle / stock moyen, (2) Taux de service = commandes livrées à temps / total, (3) Taux d'erreur = erreurs / opérations, (4) Délai moyen = temps entre commande et livraison. Chaque KPI déclenche une action spécifique.",
      teaching_momentEn: "The 4 fundamental KPIs: (1) Turnover = annual consumption / average stock, (2) Service level = orders on time / total, (3) Error rate = errors / operations, (4) Lead time = time between order and delivery. Each KPI triggers a specific action.",
    },
  },

  // ── SCN-004: Stock négatif (M3 / REPLENISH step) ──────────────────────────────
  "SCN-004": {
    scenario_id: "SCN-004",
    module: "M3",
    title: "Stock négatif",
    titleEn: "Negative Stock",
    hint: "Stock insuffisant détecté — la séquence a été rompue.",
    hintEn: "Insufficient stock detected — the sequence was broken.",
    type: "negative",
    learning_objective: "On ne peut pas livrer ce qu'on n'a pas reçu. Le flux logistique est causal.",
    learning_objectiveEn: "You cannot deliver what you have not received. The logistics flow is causal.",
    error_type: "negative_stock",
    wms_step: "REPLENISH",
    odoo_intervention: {
      trigger: "Incohérence de livraison détectée — stock insuffisant avant GI",
      triggerEn: "Delivery inconsistency detected — insufficient stock before GI",
      route: "https://concorde-logistics-lab.odoo.com/odoo/inventory/reporting",
      action: "Ouvrir Odoo → Inventaire → Reporting. Vérifier la quantité disponible pour le SKU concerné dans le rapport de valorisation des stocks.",
      actionEn: "Open Odoo → Inventory → Reporting. Check the available quantity for the relevant SKU in the stock valuation report.",
      discovery_question: "Quelle est la quantité disponible pour ce SKU dans Odoo ? Comment expliquez-vous cet écart avec la quantité demandée ?",
      discovery_questionEn: "What is the available quantity for this SKU in Odoo? How do you explain this gap with the requested quantity?",
      expected_observation: "La quantité disponible est 0 ou inférieure à la quantité demandée. Une GI a été exécutée avant que la GR correspondante ne soit postée.",
      expected_observationEn: "The available quantity is 0 or below the requested quantity. A GI was executed before the corresponding GR was posted.",
      resolution: "Identifier la cause : GR non validée, GI exécutée avant GR, ou quantité mal saisie. Corriger la séquence : GR d'abord, puis GI. Le flux logistique est causal — chaque étape dépend de la précédente.",
      resolutionEn: "Identify the cause: unvalidated GR, GI executed before GR, or incorrect quantity. Fix the sequence: GR first, then GI. The logistics flow is causal — each step depends on the previous one.",
    },
    wms_return_logic: {
      mode: "manual_confirmation",
      message: "Qu'est-ce qui a causé le stock négatif ? Décrivez la rupture de séquence que vous avez identifiée.",
      messageEn: "What caused the negative stock? Describe the sequence break you identified.",
      validation: "L'étudiant explique la rupture de séquence (GI avant GR ou GR non postée)",
      validationEn: "Student explains the sequence break (GI before GR or unposted GR)",
    },
    instructor_script: {
      what_to_say: "Vous ne pouvez pas livrer ce que vous n'avez pas reçu.",
      what_to_sayEn: "You cannot deliver what you have not received.",
      common_mistake: "Ignorer la séquence et exécuter le GI sans vérifier le stock disponible.",
      common_mistakeEn: "Ignoring the sequence and executing GI without checking available stock.",
      teaching_moment: "Le flux logistique est causal : GR → Putaway → GI → Livraison. Chaque étape dépend de la précédente. GI sans GR = anomalie critique en audit. Dans SAP, le système bloque physiquement cette séquence.",
      teaching_momentEn: "The logistics flow is causal: GR → Putaway → GI → Delivery. Each step depends on the previous one. GI without GR = critical audit anomaly. In SAP, the system physically blocks this sequence.",
    },
  },

  // ── SCN-005: Erreur cachée (M5 / COMPLIANCE_M5 step only) ────────────────────
  "SCN-005": {
    scenario_id: "SCN-005",
    module: "M5",
    title: "Erreur cachée",
    titleEn: "Hidden Error",
    hint: "Audit final — le système n'est pas propre.",
    hintEn: "Final audit — the system is not clean.",
    type: "negative",
    learning_objective: "Une erreur ancienne impacte le présent. La mentalité auditeur : chaque transaction laisse une trace.",
    learning_objectiveEn: "An old error impacts the present. The auditor mindset: every transaction leaves a trace.",
    error_type: "hidden_error",
    wms_step: "COMPLIANCE_M5",
    odoo_intervention: {
      trigger: "Audit final du module — vérification de la cohérence documentaire",
      triggerEn: "Module final audit — documentary consistency check",
      route: "https://concorde-logistics-lab.odoo.com/odoo/inventory/receipts",
      action: "Ouvrir Odoo → Inventaire → Réceptions. Filtrer par statut 'READY'. Identifier les documents non validés les plus anciens.",
      actionEn: "Open Odoo → Inventory → Receipts. Filter by status 'READY'. Identify the oldest unvalidated documents.",
      discovery_question: "Combien de documents READY trouvez-vous ? Quel est le plus ancien ? Quel impact a-t-il sur la clôture de période ?",
      discovery_questionEn: "How many READY documents do you find? Which is the oldest? What impact does it have on period closing?",
      expected_observation: "Un ou plusieurs documents READY — créés mais jamais validés. Ces transactions fantômes faussent les rapports de stock et bloquent la clôture de période.",
      expected_observationEn: "One or more READY documents — created but never validated. These ghost transactions distort stock reports and block period closing.",
      resolution: "Valider ou annuler chaque document READY. Un document READY non traité = transaction fantôme. La clôture de période exige que TOUTES les transactions soient résolues.",
      resolutionEn: "Validate or cancel each READY document. An untreated READY document = ghost transaction. Period closing requires ALL transactions to be resolved.",
    },
    wms_return_logic: {
      mode: "manual_confirmation",
      message: "Décrivez l'impact d'un document READY non traité sur la clôture de période et les rapports de stock.",
      messageEn: "Describe the impact of an untreated READY document on period closing and stock reports.",
      validation: "L'étudiant identifie le document READY et explique son impact sur la clôture",
      validationEn: "Student identifies the READY document and explains its impact on period closing",
    },
    instructor_script: {
      what_to_say: "Une erreur ancienne impacte le présent. Le système n'oublie jamais.",
      what_to_sayEn: "An old error impacts the present. The system never forgets.",
      common_mistake: "Ignorer l'historique des transactions et se concentrer uniquement sur les opérations actuelles.",
      common_mistakeEn: "Ignoring transaction history and focusing only on current operations.",
      teaching_moment: "La mentalité auditeur : chaque transaction laisse une trace. Une clôture de période propre exige que TOUTES les transactions soient résolues. Dans SAP, les documents ouverts apparaissent dans MB51 et bloquent la clôture MM.",
      teaching_momentEn: "The auditor mindset: every transaction leaves a trace. A clean period close requires ALL transactions to be resolved. In SAP, open documents appear in MB51 and block MM period closing.",
    },
  },
};

// ─── UX State Machine ─────────────────────────────────────────────────────────
type PanelState = "COLLAPSED" | "STEP_1" | "STEP_2" | "STEP_3" | "CONFIRMED";

// ─── ScenarioPanel Component ──────────────────────────────────────────────────
interface ScenarioPanelProps {
  scenarioId: string;
  runId?: number;
  alreadyConfirmed?: boolean;
  onConfirm?: () => void;
}

export function ScenarioPanel({ scenarioId, runId, alreadyConfirmed = false, onConfirm }: ScenarioPanelProps) {
  const { t } = useLanguage();

  const [panelState, setPanelState] = useState<PanelState>(
    alreadyConfirmed ? "CONFIRMED" : "COLLAPSED"
  );
  const [odooOpened, setOdooOpened] = useState(false);
  const [step1Answer, setStep1Answer] = useState("");
  const [finalAnswer, setFinalAnswer] = useState("");
  const [showInstructor, setShowInstructor] = useState(false);

  const confirmMutation = trpc.scenarios.confirmPanel.useMutation({
    onSuccess: () => {
      setPanelState("CONFIRMED");
      onConfirm?.();
    },
  });

  const scenario = SCENARIO_REGISTRY[scenarioId];
  if (!scenario) return null;

  const isNegative = scenario.type === "negative";

  // ── Colour tokens ──────────────────────────────────────────────────────────
  const accentBorder = isNegative
    ? "border-amber-300 dark:border-amber-700"
    : "border-emerald-300 dark:border-emerald-700";
  const step2Bg = isNegative
    ? "bg-amber-50 dark:bg-amber-950/30"
    : "bg-emerald-50 dark:bg-emerald-950/30";
  const step2Text = isNegative
    ? "text-amber-800 dark:text-amber-200"
    : "text-emerald-800 dark:text-emerald-200";
  const confirmBtnCls = isNegative
    ? "bg-amber-600 hover:bg-amber-700 text-white"
    : "bg-emerald-600 hover:bg-emerald-700 text-white";

  const handleConfirm = () => {
    if (!finalAnswer.trim()) return;
    if (runId) {
      confirmMutation.mutate({ runId, scenarioId, studentAnswer: finalAnswer });
    } else {
      setPanelState("CONFIRMED");
      onConfirm?.();
    }
  };

  // ── CONFIRMED state ────────────────────────────────────────────────────────
  if (panelState === "CONFIRMED") {
    return (
      <div className="mt-3 rounded-md border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-2 flex items-center gap-2">
        <CheckSquare size={13} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
            {t(`${scenario.scenario_id} — Observation confirmée`, `${scenario.scenario_id} — Observation confirmed`)}
          </p>
          {finalAnswer && (
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 italic truncate">
              « {finalAnswer} »
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── COLLAPSED state — amber banner ────────────────────────────────────────
  if (panelState === "COLLAPSED") {
    return (
      <div className="mt-3 rounded-md border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 px-3 py-2">
        <div className="flex items-center gap-2">
          <AlertTriangle size={13} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-200">
              ⚠️ {t("Situation détectée", "Situation detected")}
              <span className="font-normal text-amber-600 dark:text-amber-400 ml-1">
                ({t("optionnel", "optional")})
              </span>
            </span>
            <p className="text-[10px] text-amber-700 dark:text-amber-300 mt-0.5 leading-relaxed">
              {t(scenario.hint, scenario.hintEn)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPanelState("STEP_1")}
            className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded border border-amber-400 dark:border-amber-600 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 text-[10px] font-semibold hover:bg-amber-200 dark:hover:bg-amber-800/40 transition-colors"
          >
            <Search size={10} />
            {t("Vérifier dans Odoo", "Check in Odoo")}
            <ChevronRight size={10} />
          </button>
        </div>
      </div>
    );
  }

  // ── STEP_1, STEP_2, STEP_3 — expanded panel ───────────────────────────────
  return (
    <div className={`mt-3 rounded-md border ${accentBorder} overflow-hidden`}>

      {/* ── Panel header ──────────────────────────────────────────────────── */}
      <div className="bg-muted/30 px-3 py-2 border-b border-border/50 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle size={12} className="text-amber-500 flex-shrink-0" />
          <span className="text-[10px] font-mono text-muted-foreground">{scenario.scenario_id}</span>
          <span className="text-[11px] font-bold text-foreground">
            {t(scenario.title, scenario.titleEn)}
          </span>
          <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
            isNegative
              ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
              : "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
          }`}>
            {scenario.module} · {isNegative ? t("Erreur", "Error") : t("Positif", "Positive")}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setPanelState("COLLAPSED")}
          className="text-[9px] text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
        >
          {t("Réduire", "Collapse")} ↑
        </button>
      </div>

      {/* ── STEP 1: Odoo task + discovery question (NO explanation) ───────── */}
      <div className="px-3 py-3 border-b border-border/50">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-2">
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">1</span>
          <p className="text-[10px] font-bold text-foreground uppercase tracking-wider">
            {t("Observer dans Odoo", "Observe in Odoo")}
          </p>
        </div>

        {/* Task instructions */}
        <p className="text-[11px] text-foreground leading-relaxed mb-3 pl-7">
          {t(scenario.odoo_intervention.action, scenario.odoo_intervention.actionEn)}
        </p>

        {/* Odoo button */}
        <div className="pl-7 mb-3">
          <a
            href={scenario.odoo_intervention.route}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOdooOpened(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded border text-[10px] font-semibold transition-colors ${
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
            <p className="text-[9px] text-muted-foreground italic mt-1">
              {t(
                "Session requise — connectez-vous à concorde-logistics-lab.odoo.com",
                "Session required — log in to concorde-logistics-lab.odoo.com"
              )}
            </p>
          )}
        </div>

        {/* Discovery question — shown only when Odoo has been opened */}
        {odooOpened && (
          <div className="pl-7">
            <div className="flex items-start gap-1.5 mb-1.5">
              <Eye size={11} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] font-semibold text-foreground">
                {t(
                  scenario.odoo_intervention.discovery_question,
                  scenario.odoo_intervention.discovery_questionEn
                )}
              </p>
            </div>
            <textarea
              value={step1Answer}
              onChange={(e) => setStep1Answer(e.target.value)}
              placeholder={t(
                "Décrivez ce que vous observez dans Odoo...",
                "Describe what you observe in Odoo..."
              )}
              className="w-full text-[11px] border border-border rounded px-2.5 py-1.5 bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
              rows={2}
            />
            {step1Answer.trim().length > 0 && step1Answer.trim().length < 10 && (
              <p className="text-[9px] text-muted-foreground italic mt-0.5">
                {t("Continuez à décrire votre observation...", "Keep describing your observation...")}
              </p>
            )}
            {step1Answer.trim().length >= 10 && panelState === "STEP_1" && (
              <button
                type="button"
                onClick={() => setPanelState("STEP_2")}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-semibold transition-colors"
              >
                <Lightbulb size={11} />
                {t("Voir l'explication →", "See explanation →")}
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── STEP 2: Explanation + root cause + correction (revealed after Step 1) */}
      {(panelState === "STEP_2" || panelState === "STEP_3") && (
        <div className={`px-3 py-3 border-b border-border/50 ${step2Bg}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">2</span>
            <p className="text-[10px] font-bold uppercase tracking-wider text-foreground">
              {t("Explication & Correction", "Explanation & Correction")}
            </p>
          </div>

          {/* What student should have observed */}
          <div className="pl-7 mb-2">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
              {t("Ce que vous deviez observer", "What you should have observed")}
            </p>
            <p className={`text-[11px] leading-relaxed font-medium ${step2Text}`}>
              {t(
                scenario.odoo_intervention.expected_observation,
                scenario.odoo_intervention.expected_observationEn
              )}
            </p>
          </div>

          {/* Root cause + correction */}
          <div className="pl-7">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
              🔧 {t("Cause & Correction", "Root Cause & Correction")}
            </p>
            <p className="text-[11px] text-foreground leading-relaxed">
              {t(scenario.odoo_intervention.resolution, scenario.odoo_intervention.resolutionEn)}
            </p>
          </div>

          {/* Learning objective */}
          <div className="pl-7 mt-2 flex items-start gap-1.5">
            <BookOpen size={10} className="text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-muted-foreground italic leading-relaxed">
              {t(scenario.learning_objective, scenario.learning_objectiveEn)}
            </p>
          </div>

          {panelState === "STEP_2" && (
            <div className="pl-7 mt-2">
              <button
                type="button"
                onClick={() => setPanelState("STEP_3")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-semibold transition-colors"
              >
                <CheckSquare size={11} />
                {t("Valider ma compréhension →", "Validate my understanding →")}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── STEP 3: Final written answer + confirmation ───────────────────── */}
      {panelState === "STEP_3" && (
        <div className="px-3 py-3 border-b border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">3</span>
            <p className="text-[10px] font-bold uppercase tracking-wider text-foreground">
              {t("Votre réponse finale", "Your final answer")}
            </p>
          </div>

          <div className="pl-7">
            <p className="text-[11px] font-semibold text-foreground mb-1.5">
              {t(scenario.wms_return_logic.message, scenario.wms_return_logic.messageEn)}
            </p>
            <p className="text-[9px] text-muted-foreground mb-2 italic">
              {t(scenario.wms_return_logic.validation, scenario.wms_return_logic.validationEn)}
            </p>
            <textarea
              value={finalAnswer}
              onChange={(e) => setFinalAnswer(e.target.value)}
              placeholder={t(
                "Rédigez votre réponse en 2-3 phrases...",
                "Write your answer in 2-3 sentences..."
              )}
              className="w-full text-[11px] border border-border rounded px-2.5 py-1.5 bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-emerald-400"
              rows={3}
            />
            <button
              type="button"
              onClick={handleConfirm}
              disabled={finalAnswer.trim().length < 20 || confirmMutation.isPending}
              className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${confirmBtnCls}`}
            >
              {confirmMutation.isPending ? (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckSquare size={12} />
              )}
              {t("Confirmer et continuer (+5 pts)", "Confirm and continue (+5 pts)")}
            </button>
            <div className="flex items-center justify-between mt-1">
              <span className={`text-[9px] italic ${
                finalAnswer.trim().length === 0
                  ? "text-muted-foreground"
                  : finalAnswer.trim().length < 20
                  ? "text-amber-500"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}>
                {finalAnswer.trim().length === 0
                  ? t("Rédigez votre réponse pour activer la confirmation.", "Write your answer to enable confirmation.")
                  : finalAnswer.trim().length < 20
                  ? t("Continuez... minimum 20 caractères requis.", "Keep writing... minimum 20 characters required.")
                  : t("✓ Longueur suffisante", "✓ Sufficient length")}
              </span>
              <span className={`text-[9px] font-mono tabular-nums ${
                finalAnswer.trim().length < 20 ? "text-amber-500" : "text-emerald-600 dark:text-emerald-400"
              }`}>
                {finalAnswer.trim().length}/20
              </span>
            </div>
            {confirmMutation.isError && (
              <p className="text-[10px] text-destructive mt-1">
                {t("Erreur lors de la sauvegarde. Réessayez.", "Error saving. Please try again.")}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Instructor script (always hidden, collapsible) ────────────────── */}
      <div className="px-3 py-2">
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
          <div className="mt-2 space-y-1.5 pb-1">
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
