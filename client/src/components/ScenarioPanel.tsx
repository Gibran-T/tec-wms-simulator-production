/**
 * ScenarioPanel — Guided Discovery Mode
 *
 * UX Flow (4 states):
 *   COLLAPSED  → small amber banner "⚠️ Situation détectée (optionnel)" + hint + button
 *   STEP_1     → Odoo task instructions + 1 discovery question (NO explanation shown)
 *   STEP_2     → Reveal explanation, root cause, correction (unlocked after Step 1 input ≥ 10 chars)
 *   STEP_3     → Final written answer + confirm button (enabled only when ≥ 20 chars + Odoo opened)
 *
 * Rules:
 *   1. Odoo is a REFERENCE system — never integrated, never auto-resolved
 *   2. Full explanation is NEVER shown immediately — student must observe first
 *   3. No loops — one concept per scenario
 *   4. Scenario never blocks the normal WMS transaction
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
  Search,
  Lightbulb,
  ChevronRight,
  CheckCircle2,
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
}

// ─── Scenario Registry ────────────────────────────────────────────────────────
export const SCENARIO_REGISTRY: Record<string, ScenarioConfig> = {

  // ════════════════════════════════════════════════════════════════════════════
  // MODULE 1 — FONDEMENTS ERP/WMS (SCN-001 to SCN-005)
  // ════════════════════════════════════════════════════════════════════════════

  // ── SCN-001: Réception conforme — Positive Baseline (M1 / GR step) ──────────
  "SCN-001": {
    scenario_id: "SCN-001",
    module: "M1",
    title: "Réception conforme",
    titleEn: "Correct Receipt",
    hint: "Vérifiez que la réception a bien créé un mouvement de stock dans Odoo.",
    hintEn: "Verify that the receipt actually created a stock movement in Odoo.",
    type: "positive",
    learning_objective: "Une GR validée (postée) crée un quant de stock. C'est l'état de référence — tous les autres scénarios en dévient.",
    learning_objectiveEn: "A validated (posted) GR creates a stock quant. This is the reference state — all other scenarios deviate from it.",
    error_type: "baseline_verification",
    wms_step: "GR",
    odoo_intervention: {
      trigger: "Réception enregistrée dans TEC.WMS — vérification dans Odoo",
      triggerEn: "Receipt recorded in TEC.WMS — verification in Odoo",
      route: "https://edu-concorde-logistics-lab.odoo.com/odoo/inventory/receipts",
      action: "Ouvrez Odoo → Inventaire → Réceptions. Trouvez WH/IN/00003. Cliquez dessus. Observez le statut et les lignes de mouvement. Naviguez ensuite vers Produits → SKU-001 → Stock disponible.",
      actionEn: "Open Odoo → Inventory → Receipts. Find WH/IN/00003. Click it. Observe the status and movement lines. Then navigate to Products → SKU-001 → Available stock.",
      discovery_question: "Quel est le statut de WH/IN/00003 ? Combien d'unités de SKU-001 sont disponibles, et à quel emplacement ?",
      discovery_questionEn: "What is the status of WH/IN/00003? How many units of SKU-001 are available, and at which location?",
      expected_observation: "WH/IN/00003 est en statut DONE (Fait). SKU-001 affiche 50 unités disponibles à WH/Input/REC-01, lot LOT-SKU001-001. Le mouvement de stock a bien été créé lors de la validation.",
      expected_observationEn: "WH/IN/00003 is in DONE status. SKU-001 shows 50 units available at WH/Input/REC-01, lot LOT-SKU001-001. The stock movement was created upon validation.",
      resolution: "DONE = transaction postée = mouvement de stock réel créé = quant visible dans l'inventaire. C'est le flux normal : créer le bon de réception → valider → stock mis à jour. Dans SAP, DONE équivaut au document matière (Matbeleg) généré après posting MIGO.",
      resolutionEn: "DONE = posted transaction = real stock movement created = quant visible in inventory. This is the normal flow: create receipt → validate → stock updated. In SAP, DONE is equivalent to the material document (Matbeleg) generated after MIGO posting.",
    },
    wms_return_logic: {
      mode: "manual_confirmation",
      message: "Décrivez le lien entre le statut DONE d'un bon de réception Odoo et la mise à jour du stock. Pourquoi ce statut est-il important ?",
      messageEn: "Describe the link between the DONE status of an Odoo receipt and the stock update. Why is this status important?",
      validation: "L'étudiant explique que DONE = transaction postée = mouvement de stock créé = stock visible et traçable",
      validationEn: "Student explains that DONE = posted transaction = stock movement created = stock visible and traceable",
    },
  },

  // ── SCN-002: Réception fantôme — GR Not Posted (M1 / GR step) ───────────────
  "SCN-002": {
    scenario_id: "SCN-002",
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
      route: "https://edu-concorde-logistics-lab.odoo.com/odoo/inventory/receipts",
      action: "Ouvrez Odoo → Inventaire → Réceptions. Filtrez par statut 'PRÊT' (Ready). Observez les documents listés. Cliquez sur l'un d'eux — y a-t-il des lignes de mouvement de stock générées ?",
      actionEn: "Open Odoo → Inventory → Receipts. Filter by status 'READY'. Observe the listed documents. Click on one — are there any stock movement lines generated?",
      discovery_question: "Quel est le statut des documents que vous trouvez ? Qu'est-ce que ce statut signifie pour le stock disponible ?",
      discovery_questionEn: "What is the status of the documents you find? What does this status mean for available stock?",
      expected_observation: "Les documents en statut PRÊT/READY ont été créés mais jamais validés. Aucun mouvement de stock n'a été généré — la quantité disponible reste à zéro. Comparez avec WH/IN/00003 (DONE) : la différence est visible immédiatement.",
      expected_observationEn: "Documents in READY status have been created but never validated. No stock movement has been generated — available quantity remains zero. Compare with WH/IN/00003 (DONE): the difference is immediately visible.",
      resolution: "Pour que le stock soit mis à jour, il faut VALIDER (poster) le bon de réception. Dans SAP, c'est l'équivalent de cliquer 'Comptabiliser' dans MIGO. Créer ≠ poster. Un document READY est une intention — pas un fait comptable.",
      resolutionEn: "To update stock, you must VALIDATE (post) the receipt. In SAP, this is equivalent to clicking 'Post' in MIGO. Creating ≠ posting. A READY document is an intention — not an accounting fact.",
    },
    wms_return_logic: {
      mode: "manual_confirmation",
      message: "Expliquez la différence entre créer et poster une transaction dans un ERP. Quel est l'impact sur le stock si la validation est oubliée ?",
      messageEn: "Explain the difference between creating and posting a transaction in an ERP. What is the impact on stock if validation is forgotten?",
      validation: "L'étudiant explique que seul le posting crée un document matière et impacte le stock — READY = aucun impact stock",
      validationEn: "Student explains that only posting creates a material document and impacts stock — READY = no stock impact",
    },
  },

  // ── SCN-003: Marchandise mal rangée — Wrong Location (M1 / PUTAWAY step) ─────
  "SCN-003": {
    scenario_id: "SCN-003",
    module: "M1",
    title: "Marchandise mal rangée",
    titleEn: "Misplaced Goods",
    hint: "Les marchandises sont reçues mais pas encore rangées — le stock est bloqué à l'entrée.",
    hintEn: "Goods received but not yet put away — stock is stuck at the input location.",
    type: "negative",
    learning_objective: "Recevoir ≠ ranger. Le putaway est une étape distincte qui déplace le stock vers son emplacement final.",
    learning_objectiveEn: "Receiving ≠ putting away. Putaway is a distinct step that moves stock to its final location.",
    error_type: "putaway_incomplete",
    wms_step: "PUTAWAY",
    odoo_intervention: {
      trigger: "Réception validée mais transfert de rangement non exécuté",
      triggerEn: "Receipt validated but putaway transfer not executed",
      route: "https://edu-concorde-logistics-lab.odoo.com/odoo/inventory/receipts",
      action: "Ouvrez Odoo → Inventaire → Transferts internes. Recherchez WH/STOR/00001. Observez son statut et les emplacements source/destination. Comparez avec l'emplacement actuel de SKU-001 dans Produits → Stock disponible.",
      actionEn: "Open Odoo → Inventory → Internal Transfers. Find WH/STOR/00001. Observe its status and source/destination locations. Compare with the current location of SKU-001 in Products → Available stock.",
      discovery_question: "Quel est le statut de WH/STOR/00001 ? À quel emplacement SKU-001 se trouve-t-il actuellement ? Est-ce l'emplacement final prévu ?",
      discovery_questionEn: "What is the status of WH/STOR/00001? At which location is SKU-001 currently? Is this the intended final location?",
      expected_observation: "WH/STOR/00001 est en statut PRÊT/READY — le transfert de rangement a été créé automatiquement mais n'a pas encore été validé. SKU-001 est à WH/Input/REC-01, pas à WH/Stock/A-01-R1-L1. Les marchandises sont physiquement dans l'entrepôt mais le système ne les 'voit' pas à leur emplacement final.",
      expected_observationEn: "WH/STOR/00001 is in READY status — the putaway transfer was automatically created but not yet validated. SKU-001 is at WH/Input/REC-01, not at WH/Stock/A-01-R1-L1. Goods are physically in the warehouse but the system doesn't 'see' them at their final location.",
      resolution: "Valider WH/STOR/00001 déplace le stock de WH/Input/REC-01 vers WH/Stock dans le système. Sans cette validation, toute commande de prélèvement cherchant SKU-001 à WH/Stock trouvera une quantité disponible de zéro — même si les marchandises sont physiquement présentes.",
      resolutionEn: "Validating WH/STOR/00001 moves stock from WH/Input/REC-01 to WH/Stock in the system. Without this validation, any pick order looking for SKU-001 at WH/Stock will find zero available quantity — even if goods are physically present.",
    },
    wms_return_logic: {
      mode: "manual_confirmation",
      message: "Expliquez pourquoi un transfert de rangement non validé peut bloquer une commande client, même si les marchandises sont physiquement dans l'entrepôt.",
      messageEn: "Explain why an unvalidated putaway transfer can block a customer order, even if goods are physically in the warehouse.",
      validation: "L'étudiant explique que le système ne connaît que les emplacements validés — stock physique ≠ stock système si le putaway n'est pas posté",
      validationEn: "Student explains that the system only knows validated locations — physical stock ≠ system stock if putaway is not posted",
    },
  },

  // ── SCN-004: Écart de quantité — Inventory Mismatch (M1 / GI step) ───────────
  "SCN-004": {
    scenario_id: "SCN-004",
    module: "M1",
    title: "Écart de quantité",
    titleEn: "Quantity Mismatch",
    hint: "BOX-001 est dans l'entrepôt mais absent du système — écart PO/GR détecté.",
    hintEn: "BOX-001 is in the warehouse but missing from the system — PO/GR mismatch detected.",
    type: "negative",
    learning_objective: "Un écart PO/GR bloque la facturation fournisseur et fausse le stock système. La réconciliation est obligatoire.",
    learning_objectiveEn: "A PO/GR mismatch blocks supplier invoicing and distorts system stock. Reconciliation is mandatory.",
    error_type: "po_gr_mismatch",
    wms_step: "GI",
    odoo_intervention: {
      trigger: "Écart détecté entre stock physique et stock système pour BOX-001",
      triggerEn: "Mismatch detected between physical and system stock for BOX-001",
      route: "https://edu-concorde-logistics-lab.odoo.com/odoo/inventory/products",
      action: "Ouvrez Odoo → Inventaire → Produits. Recherchez BOX-001. Vérifiez la quantité disponible. Comparez avec SKU-001 (50 unités) et SKU-004 (20 unités). Cherchez ensuite un bon de réception pour BOX-001 dans Réceptions.",
      actionEn: "Open Odoo → Inventory → Products. Search for BOX-001. Check the available quantity. Compare with SKU-001 (50 units) and SKU-004 (20 units). Then search for a receipt for BOX-001 in Receipts.",
      discovery_question: "Quelle est la quantité disponible de BOX-001 dans Odoo ? Y a-t-il un bon de réception validé (DONE) pour ce produit ? Qu'est-ce que cela signifie pour la facturation fournisseur ?",
      discovery_questionEn: "What is the available quantity of BOX-001 in Odoo? Is there a validated (DONE) receipt for this product? What does this mean for supplier invoicing?",
      expected_observation: "BOX-001 affiche 0 unités disponibles dans Odoo. Aucun bon de réception DONE n'existe pour ce produit — contrairement à SKU-001 et SKU-004 qui ont tous deux WH/IN/00003 DONE. BOX-001 est physiquement présent mais inexistant pour le système.",
      expected_observationEn: "BOX-001 shows 0 available units in Odoo. No DONE receipt exists for this product — unlike SKU-001 and SKU-004 which both have WH/IN/00003 DONE. BOX-001 is physically present but non-existent for the system.",
      resolution: "L'écart PO/GR pour BOX-001 bloque la correspondance à 3 voies (PO + GR + Facture). Sans GR validée, la facture fournisseur ne peut pas être approuvée. Il faut créer et valider un bon de réception pour BOX-001. Dans SAP, c'est une MIGO manquante — détectable via ME2M ou MB51.",
      resolutionEn: "The PO/GR mismatch for BOX-001 blocks the 3-way match (PO + GR + Invoice). Without a validated GR, the supplier invoice cannot be approved. A receipt must be created and validated for BOX-001. In SAP, this is a missing MIGO — detectable via ME2M or MB51.",
    },
    wms_return_logic: {
      mode: "manual_confirmation",
      message: "Expliquez les conséquences d'un écart PO/GR sur le processus de paiement fournisseur. Quelle est la procédure de correction ?",
      messageEn: "Explain the consequences of a PO/GR mismatch on the supplier payment process. What is the correction procedure?",
      validation: "L'étudiant explique la correspondance à 3 voies et identifie la GR manquante comme cause du blocage de facturation",
      validationEn: "Student explains the 3-way match and identifies the missing GR as the cause of the invoicing block",
    },
  },

  // ── SCN-005: Erreur en cascade — Multi-Error Capstone (M1 / COMPLIANCE step) ─
  "SCN-005": {
    scenario_id: "SCN-005",
    module: "M1",
    title: "Erreur en cascade",
    titleEn: "Cascading Error",
    hint: "Audit final — plusieurs anomalies coexistent. Le système n'est pas propre.",
    hintEn: "Final audit — multiple anomalies coexist. The system is not clean.",
    type: "negative",
    learning_objective: "Les erreurs s'accumulent et se masquent mutuellement. La mentalité auditeur : chercher toutes les anomalies, pas seulement la première.",
    learning_objectiveEn: "Errors accumulate and mask each other. The auditor mindset: find all anomalies, not just the first one.",
    error_type: "multi_error_cascade",
    wms_step: "COMPLIANCE",
    odoo_intervention: {
      trigger: "Audit final du module M1 — vérification systématique de la cohérence documentaire",
      triggerEn: "M1 final audit — systematic check of documentary consistency",
      route: "https://edu-concorde-logistics-lab.odoo.com/odoo/inventory/receipts",
      action: "Ouvrez Odoo → Inventaire → Réceptions. Listez TOUS les documents et notez leur statut. Ouvrez ensuite Transferts internes et faites de même. Enfin, vérifiez Produits → BOX-001. Dressez une liste de toutes les anomalies que vous trouvez.",
      actionEn: "Open Odoo → Inventory → Receipts. List ALL documents and note their status. Then open Internal Transfers and do the same. Finally, check Products → BOX-001. Make a list of all anomalies you find.",
      discovery_question: "Combien d'anomalies différentes pouvez-vous identifier ? Listez-les par ordre de priorité : quelle est la plus critique pour la clôture de période ?",
      discovery_questionEn: "How many different anomalies can you identify? List them in order of priority: which is most critical for period closing?",
      expected_observation: "Trois anomalies coexistent : (1) WH/STOR/00001 en READY — putaway non validé, SKU-001 bloqué à WH/Input. (2) BOX-001 à 0 unités — GR manquante, facturation bloquée. (3) Aucun lot de remplacement pour SKU-004 — FIFO non testable si une 2e livraison arrive. Ces anomalies se masquent mutuellement dans les rapports agrégés.",
      expected_observationEn: "Three anomalies coexist: (1) WH/STOR/00001 in READY — putaway not validated, SKU-001 stuck at WH/Input. (2) BOX-001 at 0 units — missing GR, invoicing blocked. (3) No replacement lot for SKU-004 — FIFO untestable if a 2nd delivery arrives. These anomalies mask each other in aggregate reports.",
      resolution: "Ordre de correction : (1) Valider WH/STOR/00001 pour libérer SKU-001 vers WH/Stock. (2) Créer et valider un bon de réception pour BOX-001. (3) Vérifier la traçabilité des lots pour tous les produits reçus. La clôture de période exige que TOUTES les transactions soient résolues. Dans SAP, MB51 et ME2M révèlent ces anomalies.",
      resolutionEn: "Correction order: (1) Validate WH/STOR/00001 to release SKU-001 to WH/Stock. (2) Create and validate a receipt for BOX-001. (3) Verify lot traceability for all received products. Period closing requires ALL transactions to be resolved. In SAP, MB51 and ME2M reveal these anomalies.",
    },
    wms_return_logic: {
      mode: "manual_confirmation",
      message: "Si vous étiez auditeur, quelles sont vos 3 actions prioritaires pour assainir ce système avant la clôture de période ? Justifiez l'ordre de priorité.",
      messageEn: "If you were an auditor, what are your 3 priority actions to clean up this system before period closing? Justify the order of priority.",
      validation: "L'étudiant identifie les 3 anomalies et propose un plan de correction ordonné avec justification de priorité",
      validationEn: "Student identifies all 3 anomalies and proposes an ordered correction plan with priority justification",
    },
  },

  // ════════════════════════════════════════════════════════════════════════════
  // MODULE 2 — EXÉCUTION D'ENTREPÔT
  // ════════════════════════════════════════════════════════════════════════════

  // ── SCN-M2-001: Violation FIFO (M2 / FIFO_PICK step) ─────────────────────────
  "SCN-M2-001": {
    scenario_id: "SCN-M2-001",
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
      route: "https://edu-concorde-logistics-lab.odoo.com/odoo/inventory/products",
      action: "Ouvrez Odoo → Inventaire → Produits. Sélectionnez le produit concerné → onglet 'Lots/Numéros de série'. Observez les dates de réception de chaque lot.",
      actionEn: "Open Odoo → Inventory → Products. Select the relevant product → 'Lots/Serial Numbers' tab. Observe the reception date of each lot.",
      discovery_question: "Ouvrez SKU-003 (Film étirable transparent) → onglet Lots. Vous verrez 3 lots : LOT-SKU003-A (50 u., janvier), LOT-SKU003-B (30 u., février), LOT-SKU003-C (20 u., mars). Lequel doit être prélevé en premier selon la règle FIFO ?",
      discovery_questionEn: "Open SKU-003 (Stretch wrap film) → Lots tab. You will see 3 lots: LOT-SKU003-A (50 u., January), LOT-SKU003-B (30 u., February), LOT-SKU003-C (20 u., March). Which one must be picked first according to the FIFO rule?",
      expected_observation: "LOT-SKU003-A est le lot le plus ancien (janvier). FIFO exige que LOT-SKU003-A soit prélevé en premier, puis LOT-SKU003-B, puis LOT-SKU003-C. Prélever LOT-SKU003-C en premier serait une violation FIFO.",
      expected_observationEn: "LOT-SKU003-A is the oldest lot (January). FIFO requires LOT-SKU003-A to be picked first, then LOT-SKU003-B, then LOT-SKU003-C. Picking LOT-SKU003-C first would be a FIFO violation.",
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
  },

  // ════════════════════════════════════════════════════════════════════════════
  // MODULE 3 — CONTRÔLE DES STOCKS
  // ════════════════════════════════════════════════════════════════════════════

  // ── SCN-M3-001: Stock négatif (M3 / REPLENISH step) ──────────────────────────
  "SCN-M3-001": {
    scenario_id: "SCN-M3-001",
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
      route: "https://edu-concorde-logistics-lab.odoo.com/odoo/replenishment",
      action: "Ouvrez Odoo → Inventaire → Opérations → Réassort. Observez les règles Min/Max pour SKU-004 (Min=10, Max=50) et SKU-005 (Min=20, Max=100). Le stock actuel est à 0 pour les deux — le système détecte automatiquement la rupture.",
      actionEn: "Open Odoo → Inventory → Operations → Replenishment. Observe the Min/Max rules for SKU-004 (Min=10, Max=50) and SKU-005 (Min=20, Max=100). Current stock is 0 for both — the system automatically detects the shortage.",
      discovery_question: "Dans Odoo → Réassort : quelle est la quantité 'À commander' pour SKU-004 ? Pour SKU-005 ? Comment le système calcule-t-il cette quantité (formule : Max − Stock actuel) ?",
      discovery_questionEn: "In Odoo → Replenishment: what is the 'To Order' quantity for SKU-004? For SKU-005? How does the system calculate this quantity (formula: Max − Current stock)?",
      expected_observation: "SKU-004 : À commander = 50 (Max=50, Stock=0). SKU-005 : À commander = 100 (Max=100, Stock=0). Les deux lignes sont en rouge car le stock est inférieur au Min. Le bouton 'Commander' est disponible mais NE PAS cliquer en classe.",
      expected_observationEn: "SKU-004: To order = 50 (Max=50, Stock=0). SKU-005: To order = 100 (Max=100, Stock=0). Both rows are red because stock is below Min. The 'Order' button is available but DO NOT click it in class.",
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
  },

  // ════════════════════════════════════════════════════════════════════════════
  // MODULE 4 — INDICATEURS DE PERFORMANCE
  // ════════════════════════════════════════════════════════════════════════════

  // ── SCN-M4-001: Diagnostic KPI (M4 / KPI_DIAGNOSTIC step) ───────────────────
  "SCN-M4-001": {
    scenario_id: "SCN-M4-001",
    module: "M4",
    title: "Lecture KPI",
    titleEn: "KPI Reading",
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
      route: "https://edu-concorde-logistics-lab.odoo.com/odoo/inventory/reporting",
      action: "Ouvrez Odoo → Inventaire → Reporting. Explorez les rapports : mouvements de stock, valorisation des stocks, analyse par emplacement.",
      actionEn: "Open Odoo → Inventory → Reporting. Explore the reports: stock moves, stock valuation, location analysis.",
      discovery_question: "Dans Odoo → Reporting → Mouvements de stock : combien de mouvements de type 'Réception' trouvez-vous ? Combien de mouvements de type 'Livraison' ? Calculez le taux de service : Livraisons / (Réceptions + Livraisons) × 100. Est-ce acceptable ?",
      discovery_questionEn: "In Odoo → Reporting → Stock Moves: how many 'Receipt' type moves do you find? How many 'Delivery' type moves? Calculate the service level: Deliveries / (Receipts + Deliveries) × 100. Is this acceptable?",
      expected_observation: "Odoo affiche les mouvements de stock par type et par date. Le rapport de valorisation montre la valeur totale du stock. En comparant réceptions et livraisons, l'étudiant peut calculer un taux de service approximatif et identifier si les KPI TEC.WMS sont cohérents avec les données réelles Odoo.",
      expected_observationEn: "Odoo displays stock movements by type and date. The valuation report shows total stock value. By comparing receipts and deliveries, the student can calculate an approximate service level and identify whether TEC.WMS KPIs are consistent with real Odoo data.",
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
  },

  // ════════════════════════════════════════════════════════════════════════════
  // MODULE 5 — SIMULATION INTÉGRÉE
  // ════════════════════════════════════════════════════════════════════════════

  // ── SCN-M5-001: Erreur cachée (M5 / COMPLIANCE_M5 step) ──────────────────────
  "SCN-M5-001": {
    scenario_id: "SCN-M5-001",
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
      route: "https://edu-concorde-logistics-lab.odoo.com/odoo/inventory/receipts",
      action: "Ouvrez Odoo → Inventaire → Réceptions. Filtrez par statut 'READY'. Identifiez les documents non validés les plus anciens.",
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
    if (finalAnswer.trim().length < 20) return;
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
          <div>
            <p className="text-[11px] font-bold text-foreground leading-tight">
              {scenario.scenario_id} — {t(scenario.title, scenario.titleEn)}
            </p>
            <p className="text-[9px] text-muted-foreground">
              {t(scenario.learning_objective, scenario.learning_objectiveEn)}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setPanelState("COLLAPSED")}
          className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
          title={t("Réduire", "Collapse")}
        >
          <ChevronUp size={14} />
        </button>
      </div>

      {/* ── Step progress indicator ───────────────────────────────────────── */}
      <div className="px-3 pt-2 pb-1 flex items-center gap-2">
        {[
          { id: "STEP_1", label: t("Observer", "Observe") },
          { id: "STEP_2", label: t("Comprendre", "Understand") },
          { id: "STEP_3", label: t("Confirmer", "Confirm") },
        ].map((step, i) => {
          const isActive = panelState === step.id;
          const isDone =
            (step.id === "STEP_1" && (panelState === "STEP_2" || panelState === "STEP_3")) ||
            (step.id === "STEP_2" && panelState === "STEP_3");
          return (
            <React.Fragment key={step.id}>
              <div className={`flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                isActive ? "bg-primary/10 text-primary" :
                isDone ? "text-emerald-600 dark:text-emerald-400" :
                "text-muted-foreground"
              }`}>
                {isDone ? <CheckCircle2 size={9} /> : <span className="w-3 h-3 rounded-full border border-current flex items-center justify-center text-[7px]">{i + 1}</span>}
                {step.label}
              </div>
              {i < 2 && <div className="flex-1 h-px bg-border" />}
            </React.Fragment>
          );
        })}
      </div>

      <div className="px-3 pb-3 pt-1 space-y-3">

        {/* ── STEP 1: Odoo task + discovery question ─────────────────────── */}
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Eye size={12} className="text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-[10px] font-semibold text-foreground mb-1">
                {t("Étape 1 — Observer dans Odoo", "Step 1 — Observe in Odoo")}
              </p>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {t(scenario.odoo_intervention.action, scenario.odoo_intervention.actionEn)}
              </p>
            </div>
          </div>

          <a
            href={scenario.odoo_intervention.route}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOdooOpened(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-[10px] font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <ExternalLink size={10} />
            {t("Ouvrir Odoo", "Open Odoo")}
            {odooOpened && <span className="text-emerald-600 dark:text-emerald-400 ml-1">✓</span>}
          </a>

          <div className="bg-secondary/50 rounded p-2">
            <p className="text-[10px] font-semibold text-foreground mb-1.5 flex items-center gap-1">
              <Search size={10} className="text-primary" />
              {t("Question d'observation", "Observation question")}
            </p>
            <p className="text-[10px] text-foreground leading-relaxed italic">
              {t(scenario.odoo_intervention.discovery_question, scenario.odoo_intervention.discovery_questionEn)}
            </p>
          </div>

          <textarea
            value={step1Answer}
            onChange={(e) => {
              setStep1Answer(e.target.value);
              if (e.target.value.trim().length >= 10 && panelState === "STEP_1") {
                setPanelState("STEP_2");
              }
            }}
            placeholder={t("Décrivez ce que vous observez dans Odoo...", "Describe what you observe in Odoo...")}
            rows={2}
            className="w-full text-[10px] rounded border border-border bg-background px-2 py-1.5 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {step1Answer.trim().length < 10 && step1Answer.length > 0 && (
            <p className="text-[9px] text-amber-500 italic">
              {t("Continuez à décrire votre observation...", "Keep describing your observation...")}
            </p>
          )}
        </div>

        {/* ── STEP 2: Explanation — revealed after Step 1 ───────────────── */}
        {(panelState === "STEP_2" || panelState === "STEP_3") && (
          <div className={`rounded p-2.5 ${step2Bg} border border-current/10`}>
            <p className={`text-[10px] font-semibold mb-1.5 flex items-center gap-1 ${step2Text}`}>
              <Lightbulb size={10} />
              {t("Étape 2 — Explication", "Step 2 — Explanation")}
            </p>
            <p className={`text-[10px] leading-relaxed mb-2 ${step2Text}`}>
              <strong>{t("Ce que vous auriez dû voir :", "What you should have seen:")}</strong>{" "}
              {t(scenario.odoo_intervention.expected_observation, scenario.odoo_intervention.expected_observationEn)}
            </p>
            <p className={`text-[10px] leading-relaxed ${step2Text}`}>
              <strong>{t("Cause racine & correction :", "Root cause & correction:")}</strong>{" "}
              {t(scenario.odoo_intervention.resolution, scenario.odoo_intervention.resolutionEn)}
            </p>

            {panelState === "STEP_2" && (
              <button
                type="button"
                onClick={() => setPanelState("STEP_3")}
                className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded bg-primary text-primary-foreground text-[10px] font-semibold hover:bg-primary/90 transition-colors"
              >
                {t("Passer à l'étape 3", "Go to step 3")} <ChevronRight size={10} />
              </button>
            )}
          </div>
        )}

        {/* ── STEP 3: Final answer + confirm ────────────────────────────── */}
        {panelState === "STEP_3" && (
          <div className="space-y-2">
            <p className="text-[10px] font-semibold text-foreground flex items-center gap-1">
              <BookOpen size={10} className="text-primary" />
              {t("Étape 3 — Réponse professionnelle", "Step 3 — Professional answer")}
            </p>
            <p className="text-[10px] text-muted-foreground italic leading-relaxed">
              {t(scenario.wms_return_logic.message, scenario.wms_return_logic.messageEn)}
            </p>
            <textarea
              value={finalAnswer}
              onChange={(e) => setFinalAnswer(e.target.value)}
              placeholder={t("Rédigez votre réponse professionnelle ici...", "Write your professional answer here...")}
              rows={3}
              className="w-full text-[10px] rounded border border-border bg-background px-2 py-1.5 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
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
        )}

      </div>
    </div>
  );
}
