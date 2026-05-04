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
  CheckCircle2,
} from "lucide-react";

// ─── Scenario Data Types ──────────────────────────────────────────────────────
export interface ScenarioConfig {
  scenario_id: string;
  module: string;
  title: string;
  titleEn: string;
  /** Teacher Trigger: real-world tension statement shown FIRST in the banner */
  teacher_trigger: string;
  teacher_triggerEn: string;
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

  // ════════════════════════════════════════════════════════════════════════════
  // MODULE 1 — FONDEMENTS ERP/WMS (SCN-001 to SCN-005)
  // ════════════════════════════════════════════════════════════════════════════

  // ── SCN-001: Réception conforme — Positive Baseline (M1 / GR step) ──────────
  "SCN-001": {
    scenario_id: "SCN-001",
    module: "M1",
    title: "Réception conforme",
    titleEn: "Correct Receipt",
    teacher_trigger: "Le responsable d'entrepôt affirme que 50 unités de SKU-001 ont été reçues hier. Mais un préparateur dit que le stock est introuvable. Qui a raison — et comment le prouver ?",
    teacher_triggerEn: "The warehouse manager claims 50 units of SKU-001 were received yesterday. But a picker says the stock cannot be found. Who is right — and how do you prove it?",
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
      route: "https://concorde-logistics-lab.odoo.com/odoo/inventory/receipts",
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
    instructor_script: {
      what_to_say: "Ce que vous voyez dans Odoo est la preuve que la transaction a existé. DONE = document matière créé = stock réel.",
      what_to_sayEn: "What you see in Odoo is proof that the transaction existed. DONE = material document created = real stock.",
      common_mistake: "L'étudiant regarde la commande d'achat (PO) au lieu du bon de réception. Rediriger vers Inventaire → Réceptions, pas Achats → Commandes.",
      common_mistakeEn: "Student looks at the purchase order (PO) instead of the receipt. Redirect to Inventory → Receipts, not Purchase → Orders.",
      teaching_moment: "Dans tout ERP (SAP, Odoo, Dynamics), une transaction a deux états : brouillon et posté. Seul le posting génère un document comptable et un mouvement de stock. WH/IN/00003 DONE = Matbeleg SAP = preuve légale de réception.",
      teaching_momentEn: "In any ERP (SAP, Odoo, Dynamics), a transaction has two states: draft and posted. Only posting generates an accounting document and a stock movement. WH/IN/00003 DONE = SAP Matbeleg = legal proof of receipt.",
    },
  },

  // ── SCN-002: Réception fantôme — GR Not Posted (M1 / GR step) ───────────────
  "SCN-002": {
    scenario_id: "SCN-002",
    module: "M1",
    title: "Réception fantôme",
    titleEn: "Ghost Receipt",
    teacher_trigger: "Un opérateur a saisi la réception de 50 unités il y a 2 heures. Le stock dans Odoo est toujours à zéro. Le fournisseur attend la confirmation. Qu'est-ce qui s'est passé ?",
    teacher_triggerEn: "An operator entered a receipt for 50 units 2 hours ago. Stock in Odoo is still zero. The supplier is waiting for confirmation. What happened?",
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
    instructor_script: {
      what_to_say: "Une transaction non postée n'existe pas pour le système. C'est une intention, pas un fait. Demandez : 'Où est la preuve que les marchandises ont été reçues ?'",
      what_to_sayEn: "An unposted transaction does not exist for the system. It is an intention, not a fact. Ask: 'Where is the proof that goods were received?'",
      common_mistake: "Confondre la saisie des données avec la validation — croire que remplir le formulaire suffit à mettre à jour le stock.",
      common_mistakeEn: "Confusing data entry with validation — believing that filling the form is enough to update stock.",
      teaching_moment: "Dans SAP et Odoo, chaque transaction a deux états : brouillon (READY/Prêt) et posté (DONE/Fait). Seul le posting génère un document comptable (Matbeleg/Journal Entry) et un mouvement de stock. Comparez READY vs DONE sur deux documents côte à côte.",
      teaching_momentEn: "In SAP and Odoo, every transaction has two states: draft (READY) and posted (DONE). Only posting generates an accounting document (Matbeleg/Journal Entry) and a stock movement. Compare READY vs DONE on two documents side by side.",
    },
  },

  // ── SCN-003: Marchandise mal rangée — Wrong Location (M1 / PUTAWAY step) ─────
  "SCN-003": {
    scenario_id: "SCN-003",
    module: "M1",
    title: "Marchandise mal rangée",
    titleEn: "Misplaced Goods",
    teacher_trigger: "La réception est validée. Les cartons sont physiquement dans l'entrepôt. Mais Odoo refuse de préparer la commande client — stock disponible : 0 à WH/Stock. Comment est-ce possible ?",
    teacher_triggerEn: "The receipt is validated. The boxes are physically in the warehouse. But Odoo refuses to prepare the customer order — available stock: 0 at WH/Stock. How is this possible?",
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
      route: "https://concorde-logistics-lab.odoo.com/odoo/inventory/receipts",
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
    instructor_script: {
      what_to_say: "Demandez : 'Si un client commande SKU-001 maintenant, Odoo peut-il le prélever depuis WH/Stock ?' — La réponse est non. Pourquoi ?",
      what_to_sayEn: "Ask: 'If a customer orders SKU-001 now, can Odoo pick it from WH/Stock?' — The answer is no. Why?",
      common_mistake: "L'étudiant pense que la réception suffit. Insistez : recevoir et ranger sont deux transactions distinctes dans tout WMS.",
      common_mistakeEn: "Student thinks the receipt is enough. Emphasize: receiving and putting away are two distinct transactions in any WMS.",
      teaching_moment: "Le flux en 2 étapes (2-step receive): GR → WH/Input → Putaway → WH/Stock. Chaque étape est une transaction distincte. Dans SAP, c'est TA (Transfer Order) après GR. Dans Odoo, c'est le transfert interne automatique. Sans putaway validé, le stock est 'fantôme' pour les commandes clients.",
      teaching_momentEn: "The 2-step receive flow: GR → WH/Input → Putaway → WH/Stock. Each step is a distinct transaction. In SAP, this is a Transfer Order (TA) after GR. In Odoo, it's the automatic internal transfer. Without validated putaway, stock is 'ghost' for customer orders.",
    },
  },

  // ── SCN-004: Écart de quantité — Inventory Mismatch (M1 / GI step) ───────────
  "SCN-004": {
    scenario_id: "SCN-004",
    module: "M1",
    title: "Écart de quantité",
    titleEn: "Quantity Mismatch",
    teacher_trigger: "Le fournisseur a envoyé sa facture pour 100 BOX-001. Le service comptable ne peut pas l'approuver. Dans l'entrepôt, les cartons sont là. Dans Odoo, le stock est à zéro. Qui bloque qui — et pourquoi ?",
    teacher_triggerEn: "The supplier sent their invoice for 100 BOX-001. Accounting cannot approve it. In the warehouse, the boxes are there. In Odoo, stock is zero. Who is blocking whom — and why?",
    hint: "BOX-001 est dans l'entrepôt mais absent du système — écart PO/GR détecté.",
    hintEn: "BOX-001 is in the warehouse but missing from the system — PO/GR mismatch detected.",
    type: "negative",
    learning_objective: "Un écart PO/GR bloque la facturation fournisseur et fausse le stock système. La réconciliation est obligatoire.",
    learning_objectiveEn: "A PO/GR mismatch blocks supplier invoicing and distorts system stock. Reconciliation is mandatory.",
    error_type: "po_gr_mismatch",
    wms_step: "GI",
    odoo_intervention: {
      trigger: "Écart détecté entre quantité commandée et quantité reçue pour BOX-001",
      triggerEn: "Mismatch detected between ordered and received quantity for BOX-001",
      route: "https://concorde-logistics-lab.odoo.com/odoo/inventory/products",
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
    instructor_script: {
      what_to_say: "Imaginez que le fournisseur envoie sa facture pour 100 BOX-001. Odoo peut-il approuver le paiement ? Pourquoi pas ?",
      what_to_sayEn: "Imagine the supplier sends their invoice for 100 BOX-001. Can Odoo approve the payment? Why not?",
      common_mistake: "L'étudiant pense que c'est un bug système. Clarifiez : c'est une transaction manquante — quelqu'un a oublié de créer le bon de réception pour BOX-001.",
      common_mistakeEn: "Student thinks it's a system bug. Clarify: it's a missing transaction — someone forgot to create the receipt for BOX-001.",
      teaching_moment: "La correspondance à 3 voies (3-way match) : PO (commande) + GR (réception) + Facture doivent correspondre pour approuver le paiement. Si GR = 0 et Facture = 100, le système bloque. Dans SAP, c'est la transaction MIRO qui détecte cet écart. Dans Odoo, c'est la validation de facture fournisseur.",
      teaching_momentEn: "The 3-way match: PO (order) + GR (receipt) + Invoice must match to approve payment. If GR = 0 and Invoice = 100, the system blocks. In SAP, this is the MIRO transaction that detects this discrepancy. In Odoo, it's the supplier invoice validation.",
    },
  },

  // ── SCN-005: Erreur en cascade — Multi-Error Capstone (M1 / COMPLIANCE step) ─
  "SCN-005": {
    scenario_id: "SCN-005",
    module: "M1",
    title: "Erreur en cascade",
    titleEn: "Cascading Error",
    teacher_trigger: "La clôture de période est demain matin. Le contrôleur de gestion dit que les chiffres ne correspondent pas. Trois départements se renvoient la responsabilité. Vous avez 15 minutes pour identifier toutes les anomalies dans Odoo.",
    teacher_triggerEn: "Period closing is tomorrow morning. The controller says the numbers don't match. Three departments are blaming each other. You have 15 minutes to identify all anomalies in Odoo.",
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
      route: "https://concorde-logistics-lab.odoo.com/odoo/inventory/receipts",
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
    instructor_script: {
      what_to_say: "Après la première anomalie trouvée, demandez : 'Avez-vous tout vérifié ? Regardez aussi les transferts internes et les produits sans réception.'",
      what_to_sayEn: "After the first anomaly found, ask: 'Have you checked everything? Also look at internal transfers and products with no receipt.'",
      common_mistake: "L'étudiant corrige la première erreur et déclare le système propre. Challengez : 'Avez-vous vérifié les transferts internes ? Et BOX-001 ?'",
      common_mistakeEn: "Student fixes the first error and declares the system clean. Challenge: 'Have you checked internal transfers? And BOX-001?'",
      teaching_moment: "La mentalité auditeur : chaque transaction laisse une trace. Une clôture de période propre exige que TOUTES les transactions soient résolues. Les erreurs en cascade sont les plus dangereuses car elles se masquent mutuellement. Dans SAP : MB51 (mouvements) + ME2M (écarts PO/GR) + MB52 (stock par emplacement) = audit complet.",
      teaching_momentEn: "The auditor mindset: every transaction leaves a trace. A clean period close requires ALL transactions to be resolved. Cascading errors are the most dangerous because they mask each other. In SAP: MB51 (movements) + ME2M (PO/GR gaps) + MB52 (stock by location) = complete audit.",
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
    teacher_trigger: "Un client a retourné une commande : les produits étaient périmés. L'entrepôt avait du stock plus récent disponible. Mais le préparateur a pris le mauvais lot. Qui est responsable — et comment l'éviter ?",
    teacher_triggerEn: "A customer returned an order: the products were expired. The warehouse had fresher stock available. But the picker took the wrong lot. Who is responsible — and how do you prevent this?",
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
      action: "Ouvrez Odoo → Inventaire → Produits. Sélectionnez le produit concerné → onglet 'Lots/Numéros de série'. Observez les dates de réception de chaque lot.",
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

  // ════════════════════════════════════════════════════════════════════════════
  // MODULE 3 — CONTRÔLE DES STOCKS
  // ════════════════════════════════════════════════════════════════════════════

  // ── SCN-M3-001: Stock négatif (M3 / REPLENISH step) ──────────────────────────
  "SCN-M3-001": {
    scenario_id: "SCN-M3-001",
    module: "M3",
    title: "Stock négatif",
    titleEn: "Negative Stock",
    teacher_trigger: "Odoo affiche un stock négatif pour SKU-001 : -10 unités. C'est mathématiquement impossible dans un entrepôt réel. Quelqu'un a livré ce qu'il n'avait pas. Comment cela arrive-t-il dans un système ERP ?",
    teacher_triggerEn: "Odoo shows negative stock for SKU-001: -10 units. This is mathematically impossible in a real warehouse. Someone delivered what they didn't have. How does this happen in an ERP system?",
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
      action: "Ouvrez Odoo → Inventaire → Reporting. Vérifiez la quantité disponible pour le SKU concerné dans le rapport de valorisation des stocks.",
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

  // ════════════════════════════════════════════════════════════════════════════
  // MODULE 4 — INDICATEURS DE PERFORMANCE
  // ════════════════════════════════════════════════════════════════════════════

  // ── SCN-M4-001: Diagnostic KPI (M4 / KPI_DIAGNOSTIC step) ───────────────────
  "SCN-M4-001": {
    scenario_id: "SCN-M4-001",
    module: "M4",
    title: "Lecture KPI",
    titleEn: "KPI Reading",
    teacher_trigger: "Le directeur logistique reçoit le tableau de bord mensuel. Trois indicateurs sont au rouge. Il demande une explication en 5 minutes. Vous avez Odoo ouvert devant vous. Par où commencez-vous ?",
    teacher_triggerEn: "The logistics director receives the monthly dashboard. Three indicators are in the red. They want an explanation in 5 minutes. You have Odoo open in front of you. Where do you start?",
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
      action: "Ouvrez Odoo → Inventaire → Reporting. Explorez les rapports : mouvements de stock, valorisation des stocks, analyse par emplacement.",
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

  // ════════════════════════════════════════════════════════════════════════════
  // MODULE 5 — SIMULATION INTÉGRÉE
  // ════════════════════════════════════════════════════════════════════════════

  // ── SCN-M5-001: Erreur cachée (M5 / COMPLIANCE_M5 step) ──────────────────────
  "SCN-M5-001": {
    scenario_id: "SCN-M5-001",
    module: "M5",
    title: "Erreur cachée",
    titleEn: "Hidden Error",
    teacher_trigger: "L'auditeur externe arrive demain. Il demande que tous les bons de réception soient validés ou annulés. Vous ouvrez Odoo et vous trouvez un document READY vieux de 3 semaines. Personne ne sait pourquoi il est encore ouvert.",
    teacher_triggerEn: "The external auditor arrives tomorrow. They require all receipts to be validated or cancelled. You open Odoo and find a READY document that is 3 weeks old. Nobody knows why it is still open.",
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
        {/* Teacher Trigger — real-world tension statement */}
        <div className="mb-2 pb-2 border-b border-amber-200 dark:border-amber-700">
          <p className="text-[10px] font-bold text-amber-900 dark:text-amber-100 leading-relaxed">
            🎯 {t(scenario.teacher_trigger, scenario.teacher_triggerEn)}
          </p>
        </div>
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

        {/* ── Teacher Trigger card — repeated at top of expanded panel ─────── */}
        <div className="rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700 px-2.5 py-2">
          <p className="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-0.5">
            🎯 {t("Situation réelle", "Real-world situation")}
          </p>
          <p className="text-[10px] font-semibold text-amber-900 dark:text-amber-100 leading-relaxed">
            {t(scenario.teacher_trigger, scenario.teacher_triggerEn)}
          </p>
        </div>

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

        {/* ── Instructor script — hidden accordion ──────────────────────── */}
        <div className="border-t border-border/50 pt-2">
          <button
            type="button"
            onClick={() => setShowInstructor(!showInstructor)}
            className="flex items-center gap-1.5 text-[9px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <GraduationCap size={10} />
            {t("Script enseignant", "Instructor script")}
            {showInstructor ? <ChevronUp size={9} /> : <ChevronDown size={9} />}
          </button>
          {showInstructor && (
            <div className="mt-2 space-y-1.5 bg-muted/20 rounded p-2">
              <p className="text-[9px]">
                <span className="font-semibold text-foreground">{t("À dire :", "Say:")}</span>{" "}
                <span className="text-muted-foreground italic">« {t(scenario.instructor_script.what_to_say, scenario.instructor_script.what_to_sayEn)} »</span>
              </p>
              <p className="text-[9px]">
                <span className="font-semibold text-foreground">{t("Erreur fréquente :", "Common mistake:")}</span>{" "}
                <span className="text-muted-foreground">{t(scenario.instructor_script.common_mistake, scenario.instructor_script.common_mistakeEn)}</span>
              </p>
              <p className="text-[9px]">
                <span className="font-semibold text-foreground">{t("Moment pédagogique :", "Teaching moment:")}</span>{" "}
                <span className="text-muted-foreground">{t(scenario.instructor_script.teaching_moment, scenario.instructor_script.teaching_momentEn)}</span>
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
