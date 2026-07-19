import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { useParams, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import React, { useState, useEffect, useMemo } from "react";
import { ArrowLeft, CheckCircle, Lock, AlertTriangle, Info, FlaskConical, ChevronDown, ChevronUp, Database, BookOpen } from "lucide-react";
import GlossaryPage from "./GlossaryPage";
import FioriShell from "@/components/FioriShell";
import { buildReplenishmentParamRows, computeCcReconProgress } from "@/lib/m3OperationalEvidence";
import { M3ReplenishmentParamsTable } from "@/components/operational-intelligence/M3OperationalTowerView";
import AnalyticalResponseField from "@/components/analytical/AnalyticalResponseField";
import { AnalyticalStepHints } from "@/components/analytical/AnalyticalStepHints";
import M5DecisionResultPanel from "@/components/m5/M5DecisionResultPanel";
import {
  getAnalyticalQuestionText,
  getM5DecisionStepTitle,
  getM5ResponseGuidance,
  getStepChromeCodeLabel,
  getStepSubmitLabel,
  isAnalyticalAnswerStep,
  isM4AnalyticalStep,
  isM5AnalyticalStep,
  M4_KPI_DATA_TITLE,
} from "@/data/analyticalStepQuestions";
import { resolveScenarioScnCode } from "@/lib/scenarioCatalog";

// ─── STEP_CONFIG: All M1–M5 steps ────────────────────────────────────────────
const STEP_CONFIG: Record<string, {
  titleFr: string; titleEn: string; code: string; txCode: string;
  etapeFr: string; etapeEn: string;
  objectiveFr: string; objectiveEn: string;
  fields: string[]; tCode: string;
  binZoneHint?: { bin?: { fr: string; en: string }; fromBin?: { fr: string; en: string }; toBin?: { fr: string; en: string } };
  pedagogicalDeep: { whyFr: string; whyEn: string; realSAPFr: string; realSAPEn: string; dependencyFr: string; dependencyEn: string; realErrorFr: string; realErrorEn: string };
}> = {
  // ── Module 1 ──────────────────────────────────────────────────────────────
  po: {
    titleFr: "Bon de commande", titleEn: "Purchase Order", code: "PO", txCode: "ME21N", tCode: "ME21N",
    etapeFr: "Étape 1 sur 9", etapeEn: "Step 1 of 9",
    objectiveFr: "Créer une commande d'achat auprès d'un fournisseur. Le PO déclenche le processus d'approvisionnement et doit être validé avant toute réception.",
    objectiveEn: "Create a purchase order with a supplier. The PO triggers the procurement process and must be validated before any receipt.",
    fields: ["docRef", "sku", "bin", "qty", "comment"],
    pedagogicalDeep: {
      whyFr: "Le Purchase Order (PO) est le document contractuel entre l'entreprise et le fournisseur. Sans PO, aucune réception ne peut être légalement enregistrée dans SAP.",
      whyEn: "The Purchase Order (PO) is the contractual document between the company and the supplier. Without a PO, no receipt can be legally recorded in SAP.",
      realSAPFr: "Dans SAP S/4HANA, la transaction ME21N crée un document PO avec numéro unique. Le système vérifie automatiquement les limites de crédit fournisseur, les contrats-cadres et les approbations.",
      realSAPEn: "In SAP S/4HANA, transaction ME21N creates a PO document with a unique number. The system automatically checks supplier credit limits, outline agreements, and approvals.",
      dependencyFr: "Le PO doit précéder le Goods Receipt (GR). Sans PO valide, la transaction MIGO (GR) ne peut pas référencer de document d'achat.",
      dependencyEn: "The PO must precede the Goods Receipt (GR). Without a valid PO, the MIGO (GR) transaction cannot reference a purchasing document.",
      realErrorFr: "Si un GR est créé sans PO, SAP génère une erreur 'No purchase order item found'. En production, cela bloquerait le paiement fournisseur.",
      realErrorEn: "If a GR is created without a PO, SAP generates a 'No purchase order item found' error. In production, this would block supplier payment.",
    }
  },
  gr: {
    titleFr: "Réception marchandises", titleEn: "Goods Receipt", code: "GR", txCode: "MIGO", tCode: "MIGO",
    etapeFr: "Étape 2 sur 9", etapeEn: "Step 2 of 9",
    objectiveFr: "Enregistrer la réception physique des marchandises dans la zone RÉCEPTION (REC-01 ou REC-02). Le stock est impacté uniquement si la transaction est postée.",
    objectiveEn: "Record the physical receipt of goods in the RECEPTION zone (REC-01 or REC-02). Stock is only impacted if the transaction is posted.",
    fields: ["docRef", "sku", "bin", "qty", "comment"],
    binZoneHint: {
      bin: { fr: "Zone attendue : RÉCEPTION — utilisez REC-01 ou REC-02", en: "Expected zone: RECEPTION — use REC-01 or REC-02" },
    },
    pedagogicalDeep: {
      whyFr: "Le Goods Receipt (GR) est la confirmation physique que les marchandises commandées sont arrivées en entrepôt. C'est à ce moment que le stock augmente dans le système.",
      whyEn: "The Goods Receipt (GR) is the physical confirmation that ordered goods have arrived at the warehouse. This is when stock increases in the system.",
      realSAPFr: "Dans SAP, MIGO avec mouvement 101 crée un document matière et un document comptable. Le stock passe de 'en transit' à 'disponible'.",
      realSAPEn: "In SAP, MIGO with movement 101 creates a material document and an accounting document. Stock moves from 'in transit' to 'available'.",
      dependencyFr: "Le GR dépend d'un PO ouvert et non clôturé. La quantité reçue ne peut pas dépasser la quantité commandée. Le bin doit être en zone RÉCEPTION.",
      dependencyEn: "The GR depends on an open, unclosed PO. The received quantity cannot exceed the ordered quantity. The bin must be in the RECEPTION zone.",
      realErrorFr: "Un GR sans PO correspondant crée une 'réception non planifiée'. En audit, cela génère une exception de contrôle interne.",
      realErrorEn: "A GR without a corresponding PO creates an 'unplanned delivery'. In audit, this generates an internal control exception.",
    }
  },
  putaway_m1: {
    titleFr: "Rangement stock (LT0A)", titleEn: "Putaway to Stock (LT0A)", code: "PUTAWAY_M1", txCode: "LT0A", tCode: "LT0A",
    etapeFr: "Étape 3 sur 9", etapeEn: "Step 3 of 9",
    objectiveFr: "Transférer la marchandise reçue depuis la zone RÉCEPTION (REC-01/REC-02) vers son emplacement de stockage définitif (zone STOCKAGE). Sans cette étape, le stock reste en transit.",
    objectiveEn: "Transfer received goods from the RECEPTION zone (REC-01/REC-02) to their final storage location (STOCKAGE zone). Without this step, stock remains in transit.",
    fields: ["docRef", "sku", "fromBin", "toBin", "qty", "comment"],
    binZoneHint: {
      fromBin: { fr: "Zone source : RÉCEPTION (REC-01 ou REC-02) — marchandises venant d'être reçues", en: "Source zone: RECEPTION (REC-01 or REC-02) — recently received goods" },
      toBin: { fr: "Zone destination : STOCKAGE (B-01-R1-L1, B-01-R1-L2, B-02-R1-L1…) — emplacement définitif", en: "Destination zone: STOCKAGE (B-01-R1-L1, B-01-R1-L2, B-02-R1-L1…) — final storage" },
    },
    pedagogicalDeep: {
      whyFr: "Le putaway (LT0A dans SAP WM) est le transfert physique d'une marchandise depuis la zone de réception vers son emplacement de stockage définitif. Sans cette étape, le stock reste en zone de transit et ne peut pas être prélevé.",
      whyEn: "Putaway (LT0A in SAP WM) is the physical transfer of goods from the receiving zone to their final storage location. Without this step, stock remains in transit and cannot be picked.",
      realSAPFr: "Dans SAP WM, LT0A crée un ordre de transfert (Transfer Order) qui déplace le quant d'un emplacement source vers un emplacement destination. Le mouvement est visible dans LT23.",
      realSAPEn: "In SAP WM, LT0A creates a Transfer Order that moves a quant from a source location to a destination location. The movement is visible in LT23.",
      dependencyFr: "Le putaway ne peut s'effectuer qu'après une GR postée (mouvement 101). Le bin source doit être en zone RÉCEPTION, le bin destination en zone STOCKAGE.",
      dependencyEn: "Putaway can only be performed after a posted GR (movement 101). The source bin must be in the RECEPTION zone, the destination bin in the STOCKAGE zone.",
      realErrorFr: "Un putaway dans un bin plein crée un dépassement de capacité (capacity overflow) qui bloque les mouvements suivants et génère une alerte dans le WM cockpit.",
      realErrorEn: "A putaway into a full bin creates a capacity overflow that blocks subsequent movements and generates an alert in the WM cockpit.",
    }
  },
  stock: {
    titleFr: "Stock disponible (MB52)", titleEn: "Stock Available (MB52)", code: "STOCK", txCode: "MB52", tCode: "MB52",
    etapeFr: "Étape 4 sur 9", etapeEn: "Step 4 of 9",
    objectiveFr: "Vérifier que le stock est disponible dans la zone STOCKAGE après le rangement. Cette étape est automatiquement validée après un putaway réussi.",
    objectiveEn: "Verify that stock is available in the STOCKAGE zone after putaway. This step is automatically validated after a successful putaway.",
    fields: [],
    pedagogicalDeep: {
      whyFr: "La vérification du stock disponible (MB52) confirme que la marchandise est bien enregistrée dans le bon emplacement et disponible pour les prélèvements.",
      whyEn: "Available stock verification (MB52) confirms that goods are properly recorded in the correct location and available for picking.",
      realSAPFr: "Dans SAP, MB52 affiche le stock par entrepôt et emplacement. C'est la transaction de référence pour confirmer la disponibilité avant de créer un SO.",
      realSAPEn: "In SAP, MB52 displays stock by warehouse and location. It is the reference transaction to confirm availability before creating a SO.",
      dependencyFr: "Le stock disponible résulte directement du putaway réussi. Il est automatiquement mis à jour après LT0A.",
      dependencyEn: "Available stock results directly from a successful putaway. It is automatically updated after LT0A.",
      realErrorFr: "Un stock disponible à zéro après putaway indique une erreur de posting dans la GR ou un putaway dans le mauvais bin.",
      realErrorEn: "Zero available stock after putaway indicates a posting error in the GR or a putaway to the wrong bin.",
    }
  },
  so: {
    titleFr: "Commande client", titleEn: "Sales Order", code: "SO", txCode: "VA01", tCode: "VA01",
    etapeFr: "Étape 5 sur 9", etapeEn: "Step 5 of 9",
    objectiveFr: "Créer une commande client. Le SO ne peut être créé que si le stock disponible est supérieur à zéro dans la zone STOCKAGE.",
    objectiveEn: "Create a sales order. The SO can only be created if available stock is greater than zero in the STOCKAGE zone.",
    fields: ["docRef", "sku", "bin", "qty", "comment"],
    binZoneHint: {
      bin: { fr: "Zone attendue : STOCKAGE — le stock doit être disponible dans cette zone", en: "Expected zone: STOCKAGE — stock must be available in this zone" },
    },
    pedagogicalDeep: {
      whyFr: "Le Sales Order (SO) est l'engagement de l'entreprise envers un client. Il déclenche la réservation de stock et le processus de livraison.",
      whyEn: "The Sales Order (SO) is the company's commitment to a customer. It triggers stock reservation and the delivery process.",
      realSAPFr: "Dans SAP, VA01 crée un ordre de vente avec vérification automatique de disponibilité (ATP). SAP vérifie le stock disponible, les réservations et les délais.",
      realSAPEn: "In SAP, VA01 creates a sales order with automatic availability check (ATP). SAP checks available stock, reservations, and lead times.",
      dependencyFr: "Le SO dépend d'un stock disponible positif (résultat du GR + putaway). Sans stock en zone STOCKAGE, SAP affiche un message de disponibilité insuffisante.",
      dependencyEn: "The SO depends on positive available stock (result of GR + putaway). Without stock in STOCKAGE zone, SAP displays an insufficient availability message.",
      realErrorFr: "Créer un SO sans stock disponible force une livraison partielle ou un backorder, générant des pénalités de retard client.",
      realErrorEn: "Creating a SO without available stock forces a partial delivery or backorder, generating customer delay penalties.",
    }
  },
  po_corrective: {
    titleFr: "PO corrective (ME21N)", titleEn: "Corrective PO (ME21N)", code: "PO_CORRECTIVE", txCode: "ME21N", tCode: "ME21N",
    etapeFr: "Réapprovisionnement — PO corrective", etapeEn: "Replenishment — Corrective PO",
    objectiveFr: "Créer une PO corrective pour combler le déficit de stock STOCKAGE détecté après la SO. Exemple : +30 unités pour une commande de 80 avec 50 en stock.",
    objectiveEn: "Create a corrective PO to cover the STOCKAGE deficit detected after the SO. Example: +30 units for an order of 80 with 50 in stock.",
    fields: ["docRef", "sku", "bin", "qty", "comment"],
    pedagogicalDeep: {
      whyFr: "La PO corrective déclenche l'approvisionnement d'urgence lorsque la demande SO dépasse le stock disponible en STOCKAGE.",
      whyEn: "The corrective PO triggers emergency replenishment when SO demand exceeds available STOCKAGE stock.",
      realSAPFr: "Dans SAP, ME21N permet de créer une commande d'achat complémentaire référencée au besoin client non couvert.",
      realSAPEn: "In SAP, ME21N allows creating a supplementary purchase order referenced to uncovered customer demand.",
      dependencyFr: "La PO corrective suit la détection ATP sur la SO. Elle doit couvrir au minimum le déficit (demande − stock STOCKAGE).",
      dependencyEn: "The corrective PO follows ATP detection on the SO. It must cover at least the deficit (demand − STOCKAGE stock).",
      realErrorFr: "Ignorer la PO corrective et tenter le Picking/GI provoque un stock négatif et bloque la conformité.",
      realErrorEn: "Skipping the corrective PO and attempting Picking/GI causes negative stock and blocks compliance.",
    }
  },
  gr_corrective: {
    titleFr: "GR corrective (MIGO)", titleEn: "Corrective GR (MIGO)", code: "GR_CORRECTIVE", txCode: "MIGO", tCode: "MIGO",
    etapeFr: "Réapprovisionnement — GR corrective", etapeEn: "Replenishment — Corrective GR",
    objectiveFr: "Réceptionner la marchandise de la PO corrective au quai RÉCEPTION (REC-01/REC-02).",
    objectiveEn: "Receive corrective PO goods at the RECEPTION dock (REC-01/REC-02).",
    fields: ["docRef", "sku", "bin", "qty", "comment"],
    binZoneHint: {
      bin: { fr: "Zone attendue : RÉCEPTION — REC-01 ou REC-02", en: "Expected zone: RECEPTION — REC-01 or REC-02" },
    },
    pedagogicalDeep: {
      whyFr: "La GR corrective enregistre physiquement l'arrivée du stock complémentaire au quai.",
      whyEn: "The corrective GR physically records arrival of supplementary stock at the dock.",
      realSAPFr: "MIGO mouvement 101 poste la réception vers la zone RÉCEPTION.",
      realSAPEn: "MIGO movement 101 posts receipt to the RECEPTION zone.",
      dependencyFr: "La GR corrective dépend de la PO corrective postée.",
      dependencyEn: "The corrective GR depends on the posted corrective PO.",
      realErrorFr: "Une GR sans PO corrective crée une réception non planifiée.",
      realErrorEn: "A GR without corrective PO creates an unplanned receipt.",
    }
  },
  putaway_corrective: {
    titleFr: "Rangement corrective (LT0A)", titleEn: "Corrective Putaway (LT0A)", code: "PUTAWAY_CORRECTIVE", txCode: "LT0A", tCode: "LT0A",
    etapeFr: "Réapprovisionnement — Rangement corrective", etapeEn: "Replenishment — Corrective Putaway",
    objectiveFr: "Ranger le stock reçu (GR corrective) de RÉCEPTION vers STOCKAGE pour couvrir la demande SO avant le Picking.",
    objectiveEn: "Put away received stock (corrective GR) from RECEPTION to STOCKAGE to cover SO demand before Picking.",
    fields: ["docRef", "sku", "fromBin", "toBin", "qty", "comment"],
    binZoneHint: {
      fromBin: { fr: "Zone source : RÉCEPTION (REC-01 ou REC-02)", en: "Source zone: RECEPTION (REC-01 or REC-02)" },
      toBin: { fr: "Zone destination : STOCKAGE (B-01-R1-L1, B-01-R1-L2…)", en: "Destination zone: STOCKAGE (B-01-R1-L1, B-01-R1-L2…)" },
    },
    pedagogicalDeep: {
      whyFr: "Le rangement corrective rend le stock disponible en STOCKAGE pour le prélèvement.",
      whyEn: "Corrective putaway makes stock available in STOCKAGE for picking.",
      realSAPFr: "LT0A transfère le quant de RÉCEPTION vers STOCKAGE.",
      realSAPEn: "LT0A transfers the quant from RECEPTION to STOCKAGE.",
      dependencyFr: "Le rangement corrective suit la GR corrective. Sans cette étape, le stock reste au quai.",
      dependencyEn: "Corrective putaway follows the corrective GR. Without this step, stock remains at the dock.",
      realErrorFr: "Tenter le Picking sans rangement laisse le stock au quai — ATP insuffisant.",
      realErrorEn: "Attempting Picking without putaway leaves stock at the dock — insufficient ATP.",
    }
  },
  picking_m1: {
    titleFr: "Prélèvement expédition (VL01N)", titleEn: "Picking to Dispatch (VL01N)", code: "PICKING_M1", txCode: "VL01N", tCode: "VL01N",
    etapeFr: "Étape 6 sur 9", etapeEn: "Step 6 of 9",
    objectiveFr: "Prélever la marchandise depuis la zone STOCKAGE et la déplacer vers la zone EXPÉDITION (EXP-01/EXP-02). Cette étape prépare la sortie physique des marchandises.",
    objectiveEn: "Pick goods from the STOCKAGE zone and move them to the EXPÉDITION zone (EXP-01/EXP-02). This step prepares the physical outbound of goods.",
    fields: ["docRef", "sku", "fromBin", "toBin", "qty", "comment"],
    binZoneHint: {
      fromBin: { fr: "Zone source : STOCKAGE (B-01-R1-L1, B-01-R1-L2…) — marchandises en stock", en: "Source zone: STOCKAGE (B-01-R1-L1, B-01-R1-L2…) — goods in storage" },
      toBin: { fr: "Zone destination : EXPÉDITION (EXP-01 ou EXP-02) — zone de départ client", en: "Destination zone: EXPÉDITION (EXP-01 or EXP-02) — outbound dispatch zone" },
    },
    pedagogicalDeep: {
      whyFr: "Le picking (VL01N dans SAP WM) est le prélèvement physique des marchandises depuis leur emplacement de stockage vers la zone d'expédition. Il précède obligatoirement la sortie de marchandises (GI).",
      whyEn: "Picking (VL01N in SAP WM) is the physical retrieval of goods from their storage location to the dispatch zone. It must precede the Goods Issue (GI).",
      realSAPFr: "Dans SAP, VL01N crée un ordre de livraison sortant (Outbound Delivery). Le picking est confirmé via LT0A ou VL02N avant la validation GI.",
      realSAPEn: "In SAP, VL01N creates an Outbound Delivery. Picking is confirmed via LT0A or VL02N before GI validation.",
      dependencyFr: "Le picking dépend d'un SO confirmé et d'un stock disponible dans la zone STOCKAGE. Le bin source doit être STOCKAGE, le bin destination EXPÉDITION.",
      dependencyEn: "Picking depends on a confirmed SO and available stock in the STOCKAGE zone. The source bin must be STOCKAGE, the destination bin EXPÉDITION.",
      realErrorFr: "Prélever depuis la mauvaise zone (ex: RÉCEPTION au lieu de STOCKAGE) crée un écart de localisation qui bloque la GI.",
      realErrorEn: "Picking from the wrong zone (e.g., RECEPTION instead of STOCKAGE) creates a location discrepancy that blocks the GI.",
    }
  },
  gi: {
    titleFr: "Sortie de stock", titleEn: "Goods Issue", code: "GI", txCode: "VL02N", tCode: "VL02N",
    etapeFr: "Étape 7 sur 9", etapeEn: "Step 7 of 9",
    objectiveFr: "Émettre les marchandises pour le client depuis la zone EXPÉDITION. Le GI déduit le stock et génère le mouvement 601.",
    objectiveEn: "Issue goods to the customer from the EXPÉDITION zone. The GI deducts stock and generates movement 601.",
    fields: ["docRef", "sku", "bin", "qty", "comment"],
    binZoneHint: {
      bin: { fr: "Zone attendue : EXPÉDITION (EXP-01 ou EXP-02) — marchandises prêtes à partir", en: "Expected zone: EXPÉDITION (EXP-01 or EXP-02) — goods ready to ship" },
    },
    pedagogicalDeep: {
      whyFr: "Le Goods Issue (GI) est la sortie physique des marchandises de l'entrepôt vers le client. Il réduit le stock et transfère la propriété légale au client.",
      whyEn: "The Goods Issue (GI) is the physical departure of goods from the warehouse to the customer. It reduces stock and transfers legal ownership to the customer.",
      realSAPFr: "Dans SAP, VL02N avec mouvement 601 crée un document matière de sortie et un document comptable débitant le compte COGS.",
      realSAPEn: "In SAP, VL02N with movement 601 creates an outgoing material document and an accounting document debiting the COGS account.",
      dependencyFr: "Le GI dépend d'un SO confirmé, d'un picking complété, et d'un stock suffisant dans la zone EXPÉDITION.",
      dependencyEn: "The GI depends on a confirmed SO, a completed picking, and sufficient stock in the EXPÉDITION zone.",
      realErrorFr: "Un GI avec stock insuffisant crée un stock négatif dans SAP. En audit, un stock négatif est une anomalie critique.",
      realErrorEn: "A GI with insufficient stock creates negative stock in SAP. In audit, negative stock is a critical anomaly.",
    }
  },
  cc: {
    titleFr: "Comptage inventaire", titleEn: "Cycle Count", code: "CC", txCode: "MI01", tCode: "MI01",
    etapeFr: "Étape 8 sur 9", etapeEn: "Step 8 of 9",
    objectiveFr: "Compter physiquement les marchandises et comparer au stock système. Tout écart doit être résolu par un ajustement (ADJ).",
    objectiveEn: "Physically count goods and compare to system stock. Any variance must be resolved by an adjustment (ADJ).",
    fields: ["sku", "bin", "physicalQty", "comment"],
    pedagogicalDeep: {
      whyFr: "Le Cycle Count est une méthode d'inventaire tournant qui permet de vérifier régulièrement l'exactitude du stock sans arrêter les opérations.",
      whyEn: "Cycle Count is a rotating inventory method that allows regular verification of stock accuracy without stopping operations.",
      realSAPFr: "Dans SAP, MI01 crée un document d'inventaire. MI04 enregistre le comptage physique. MI07 valide les différences et génère les ajustements.",
      realSAPEn: "In SAP, MI01 creates an inventory document. MI04 records the physical count. MI07 validates differences and generates adjustments.",
      dependencyFr: "Le Cycle Count doit être effectué après les transactions GR et GI pour avoir un état de stock stable.",
      dependencyEn: "The Cycle Count must be performed after GR and GI transactions to have a stable stock state.",
      realErrorFr: "Une variance non résolue lors de la clôture mensuelle crée un écart entre le stock WMS et la comptabilité.",
      realErrorEn: "An unresolved variance during monthly closing creates a discrepancy between WMS stock and accounting.",
    }
  },
  adj: {
    titleFr: "Ajustement inventaire", titleEn: "Inventory Adjustment", code: "ADJ", txCode: "MI07", tCode: "MI07",
    etapeFr: "Étape 8b sur 9", etapeEn: "Step 8b of 9",
    objectiveFr: "Corriger les écarts d'inventaire détectés lors du Cycle Count. L'ajustement est obligatoire avant la clôture.",
    objectiveEn: "Correct inventory variances detected during Cycle Count. Adjustment is mandatory before closing.",
    fields: ["sku", "bin", "qty", "comment"],
    pedagogicalDeep: {
      whyFr: "L'ajustement d'inventaire (ADJ) est la correction officielle d'un écart constaté lors du comptage. Il synchronise le stock système avec la réalité physique.",
      whyEn: "The inventory adjustment (ADJ) is the official correction of a variance found during counting. It synchronizes system stock with physical reality.",
      realSAPFr: "Dans SAP, MI07 valide le document d'inventaire et génère automatiquement les mouvements de correction (mouvement 701/702).",
      realSAPEn: "In SAP, MI07 validates the inventory document and automatically generates correction movements (movement 701/702).",
      dependencyFr: "L'ADJ dépend d'un document de Cycle Count (MI01) avec une variance détectée. Il doit être approuvé par un responsable entrepôt.",
      dependencyEn: "The ADJ depends on a Cycle Count document (MI01) with a detected variance. It must be approved by a warehouse manager.",
      realErrorFr: "Un ADJ non effectué après un Cycle Count laisse une variance ouverte dans SAP. Les états financiers seraient incorrects.",
      realErrorEn: "An ADJ not performed after a Cycle Count leaves an open variance in SAP. Financial statements would be incorrect.",
    }
  },
  compliance: {
    titleFr: "Conformité Système", titleEn: "System Compliance", code: "COMPLIANCE", txCode: "MB52", tCode: "MB52",
    etapeFr: "Étape 9 sur 9", etapeEn: "Step 9 of 9",
    objectiveFr: "Valider la conformité complète du système. Tous les indicateurs doivent être au vert : aucune transaction non postée, aucun stock négatif, aucun écart non résolu.",
    objectiveEn: "Validate complete system compliance. All indicators must be green: no unposted transactions, no negative stock, no unresolved variances.",
    fields: ["comment"],
    pedagogicalDeep: {
      whyFr: "La validation de conformité est la clôture officielle du cycle logistique. Elle confirme que toutes les transactions sont cohérentes et que le système est prêt pour la période suivante.",
      whyEn: "Compliance validation is the official closing of the logistics cycle. It confirms all transactions are consistent and the system is ready for the next period.",
      realSAPFr: "Dans SAP, MB52 permet de consulter l'état du stock par entrepôt. La clôture de période (MMPV) vérifie que tous les documents sont comptabilisés.",
      realSAPEn: "In SAP, MB52 allows viewing stock status by warehouse. Period closing (MMPV) verifies all documents are posted.",
      dependencyFr: "La conformité dépend de la résolution de toutes les variances (ADJ), de la comptabilisation de toutes les transactions, et de l'absence de stock négatif.",
      dependencyEn: "Compliance depends on resolving all variances (ADJ), posting all transactions, and the absence of negative stock.",
      realErrorFr: "Une clôture de période avec des transactions non conformes crée des erreurs de réconciliation entre WMS, MM et FI.",
      realErrorEn: "A period closing with non-compliant transactions creates reconciliation errors between WMS, MM, and FI.",
    }
  },

  // ── Module 2 ──────────────────────────────────────────────────────────────
  putaway: {
    titleFr: "Rangement structuré (LT01)", titleEn: "Structured Putaway (LT01)", code: "PUTAWAY", txCode: "LT01", tCode: "LT01",
    etapeFr: "Étape 2 sur 5", etapeEn: "Step 2 of 5",
    objectiveFr: "Affecter la marchandise reçue depuis le quai REC-01/REC-02 vers un emplacement STOCKAGE conforme aux règles de capacité et de zone.",
    objectiveEn: "Assign received goods from dock REC-01/REC-02 to a STOCKAGE location meeting capacity and zone rules.",
    fields: ["docRef", "sku", "fromBin", "toBin", "qty", "lotNumber", "comment"],
    binZoneHint: {
      fromBin: { fr: "Zone source : RÉCEPTION (REC-01 ou REC-02)", en: "Source zone: RECEPTION (REC-01 or REC-02)" },
      toBin: { fr: "Zone destination : STOCKAGE — respecter la capacité max du bin", en: "Destination zone: STOCKAGE — respect bin max capacity" },
    },
    pedagogicalDeep: {
      whyFr: "Le rangement structuré (LT01) positionne le stock dans l'entrepôt selon les règles de slotting, capacité et traçabilité lot.",
      whyEn: "Structured putaway (LT01) positions stock in the warehouse per slotting, capacity and lot traceability rules.",
      realSAPFr: "Dans SAP WM, LT01 crée un ordre de transfert avec contrôle de capacité d'emplacement.",
      realSAPEn: "In SAP WM, LT01 creates a transfer order with bin capacity control.",
      dependencyFr: "Le PUTAWAY M2 requiert une GR postée. Le bin source doit être en RÉCEPTION, le bin destination en STOCKAGE.",
      dependencyEn: "M2 PUTAWAY requires a posted GR. Source bin must be RECEPTION, destination STOCKAGE.",
      realErrorFr: "Un dépassement de capacité ou un bin hors zone bloque les mouvements FIFO suivants.",
      realErrorEn: "Capacity overflow or wrong-zone bin blocks subsequent FIFO movements.",
    }
  },
  fifo_pick: {
    titleFr: "Prélèvement FIFO (LT0A)", titleEn: "FIFO Picking (LT0A)", code: "FIFO_PICK", txCode: "LT0A", tCode: "LT0A",
    etapeFr: "Étape 3 sur 5", etapeEn: "Step 3 of 5",
    objectiveFr: "Prélever le lot le plus ancien en premier (First In, First Out). Saisissez le numéro de lot, le bin source (STOCKAGE) et le bin destination (EXPÉDITION).",
    objectiveEn: "Pick the oldest lot first (First In, First Out). Enter the lot number, source bin (STOCKAGE) and destination bin (EXPÉDITION).",
    fields: ["sku", "fromBin", "toBin", "qty", "lotNumber"],
    binZoneHint: {
      fromBin: { fr: "Zone source : STOCKAGE (B-01-R1-L1, B-01-R1-L2…) — prélevez le lot le plus ancien", en: "Source zone: STOCKAGE (B-01-R1-L1, B-01-R1-L2…) — pick the oldest lot" },
      toBin: { fr: "Zone destination : EXPÉDITION (EXP-01 ou EXP-02) — zone de départ client", en: "Destination zone: EXPÉDITION (EXP-01 or EXP-02) — outbound dispatch zone" },
    },
    pedagogicalDeep: {
      whyFr: "FIFO (First In, First Out) est la méthode de gestion des lots qui garantit que les marchandises les plus anciennes sont expédiées en premier. Cela prévient les péremptions et les pertes.",
      whyEn: "FIFO (First In, First Out) is the lot management method that ensures the oldest goods are shipped first. This prevents expiry and losses.",
      realSAPFr: "Dans SAP WM, la stratégie de prélèvement FIFO est configurée dans le type de stockage. Le système propose automatiquement le lot le plus ancien lors de la création d'un ordre de transfert.",
      realSAPEn: "In SAP WM, the FIFO picking strategy is configured in the storage type. The system automatically proposes the oldest lot when creating a transfer order.",
      dependencyFr: "Le prélèvement FIFO dépend de l'enregistrement correct des lots lors de la réception (GR avec numéro de lot). Sans traçabilité lot, FIFO ne peut pas être appliqué.",
      dependencyEn: "FIFO picking depends on correct lot recording during receipt (GR with lot number). Without lot traceability, FIFO cannot be applied.",
      realErrorFr: "Prélever un lot plus récent avant un lot plus ancien (violation FIFO) peut entraîner des produits périmés en stock et des non-conformités réglementaires.",
      realErrorEn: "Picking a newer lot before an older one (FIFO violation) can lead to expired products in stock and regulatory non-compliance.",
    }
  },
  stock_accuracy: {
    titleFr: "Précision inventaire (MI04)", titleEn: "Stock Accuracy (MI04)", code: "STOCK_ACCURACY", txCode: "MI04", tCode: "MI04",
    etapeFr: "Étape 4 sur 5", etapeEn: "Step 4 of 5",
    objectiveFr: "Comparer le stock système avec le comptage physique pour calculer le taux de précision inventaire (SA%). Saisissez la quantité système et la quantité comptée.",
    objectiveEn: "Compare system stock with physical count to calculate inventory accuracy rate (SA%). Enter the system quantity and counted quantity.",
    fields: ["sku", "systemQty", "countedQty"],
    pedagogicalDeep: {
      whyFr: "La précision inventaire (Stock Accuracy) mesure l'écart entre le stock théorique (système) et le stock réel (physique). Un SA% > 98% est l'objectif standard en entrepôt.",
      whyEn: "Stock Accuracy measures the gap between theoretical (system) stock and actual (physical) stock. An SA% > 98% is the standard warehouse target.",
      realSAPFr: "Dans SAP, MI04 enregistre le comptage physique. Le système calcule automatiquement la variance et génère un rapport d'écart. MI07 valide les ajustements.",
      realSAPEn: "In SAP, MI04 records the physical count. The system automatically calculates the variance and generates a discrepancy report. MI07 validates adjustments.",
      dependencyFr: "La précision inventaire est calculée après chaque cycle de comptage. Elle dépend de la qualité des transactions GR, GI et des putaways précédents.",
      dependencyEn: "Stock accuracy is calculated after each counting cycle. It depends on the quality of previous GR, GI and putaway transactions.",
      realErrorFr: "Un SA% < 95% déclenche une alerte de contrôle interne et peut bloquer les expéditions si le stock disponible est inférieur aux commandes.",
      realErrorEn: "An SA% < 95% triggers an internal control alert and may block shipments if available stock is below orders.",
    }
  },
  compliance_adv: {
    titleFr: "Conformité Avancée M2", titleEn: "Advanced Compliance M2", code: "COMPLIANCE_ADV", txCode: "MB52", tCode: "MB52",
    etapeFr: "Étape 5 sur 5", etapeEn: "Step 5 of 5",
    objectiveFr: "Valider la conformité du module 2 : FIFO respecté, précision inventaire calculée, traçabilité des lots complète.",
    objectiveEn: "Validate Module 2 compliance: FIFO respected, inventory accuracy calculated, lot traceability complete.",
    fields: [],
    pedagogicalDeep: {
      whyFr: "La conformité avancée M2 vérifie que les principes FIFO/FEFO ont été respectés, que la précision inventaire est documentée et que la traçabilité des lots est complète.",
      whyEn: "Advanced M2 compliance verifies that FIFO/FEFO principles were respected, inventory accuracy is documented, and lot traceability is complete.",
      realSAPFr: "Dans SAP, les rapports de conformité FIFO sont générés via MB51 (liste des mouvements de matières) et LT23 (liste des ordres de transfert).",
      realSAPEn: "In SAP, FIFO compliance reports are generated via MB51 (material movement list) and LT23 (transfer order list).",
      dependencyFr: "La conformité M2 dépend de la réussite des étapes FIFO_PICK et STOCK_ACCURACY. Toutes les variances doivent être documentées.",
      dependencyEn: "M2 compliance depends on successful FIFO_PICK and STOCK_ACCURACY steps. All variances must be documented.",
      realErrorFr: "Une non-conformité FIFO lors d'un audit ISO peut entraîner des sanctions réglementaires et des pénalités contractuelles.",
      realErrorEn: "A FIFO non-compliance during an ISO audit can lead to regulatory sanctions and contractual penalties.",
    }
  },

  // ── Module 3 ──────────────────────────────────────────────────────────────
  cc_list: {
    titleFr: "Liste de comptage (MI01)", titleEn: "Count List (MI01)", code: "CC_LIST", txCode: "MI01", tCode: "MI01",
    etapeFr: "Étape 1 sur 5", etapeEn: "Step 1 of 5",
    objectiveFr: "Générer la liste des SKUs à compter pour l'inventaire tournant. Sélectionnez au moins un SKU à inclure dans le cycle de comptage.",
    objectiveEn: "Generate the list of SKUs to count for cycle counting. Select at least one SKU to include in the counting cycle.",
    fields: ["skuList"],
    pedagogicalDeep: {
      whyFr: "La liste de comptage (MI01) est le document de départ du cycle count. Elle définit quels articles seront comptés, dans quel ordre et par qui.",
      whyEn: "The count list (MI01) is the starting document for cycle counting. It defines which items will be counted, in what order, and by whom.",
      realSAPFr: "Dans SAP, MI01 crée un document d'inventaire avec un numéro unique. Les articles sont bloqués pour les mouvements pendant le comptage.",
      realSAPEn: "In SAP, MI01 creates an inventory document with a unique number. Items are blocked for movements during counting.",
      dependencyFr: "La liste de comptage doit être créée avant tout comptage physique. Elle est le référentiel pour valider les résultats.",
      dependencyEn: "The count list must be created before any physical counting. It is the reference for validating results.",
      realErrorFr: "Compter des articles sans document MI01 crée des ajustements non traçables qui seront rejetés lors de l'audit.",
      realErrorEn: "Counting items without an MI01 document creates untraceable adjustments that will be rejected during audit.",
    }
  },
  cc_count: {
    titleFr: "Comptage physique (MI04)", titleEn: "Physical Count (MI04)", code: "CC_COUNT", txCode: "MI04", tCode: "MI04",
    etapeFr: "Étape 2 sur 5", etapeEn: "Step 2 of 5",
    objectiveFr: "Enregistrer les quantités physiques comptées pour chaque SKU/Bin. Comparez avec le stock système pour identifier les variances.",
    objectiveEn: "Record the physical quantities counted for each SKU/Bin. Compare with system stock to identify variances.",
    fields: ["sku", "bin", "systemQty", "countedQty"],
    pedagogicalDeep: {
      whyFr: "Le comptage physique (MI04) est l'enregistrement des quantités réelles trouvées en entrepôt. C'est la base de la réconciliation stock.",
      whyEn: "Physical counting (MI04) is the recording of actual quantities found in the warehouse. It is the basis for stock reconciliation.",
      realSAPFr: "Dans SAP, MI04 enregistre le résultat du comptage. Le système calcule automatiquement la variance (quantité comptée - quantité système).",
      realSAPEn: "In SAP, MI04 records the counting result. The system automatically calculates the variance (counted quantity - system quantity).",
      dependencyFr: "Le comptage physique dépend d'un document MI01 ouvert. Les articles doivent être bloqués pour les mouvements pendant le comptage.",
      dependencyEn: "Physical counting depends on an open MI01 document. Items must be blocked for movements during counting.",
      realErrorFr: "Un comptage effectué pendant des mouvements actifs (réceptions, expéditions) crée des variances artificielles non représentatives.",
      realErrorEn: "Counting performed during active movements (receipts, shipments) creates artificial variances that are not representative.",
    }
  },
  cc_recon: {
    titleFr: "Réconciliation (MI07)", titleEn: "Reconciliation (MI07)", code: "CC_RECON", txCode: "MI07", tCode: "MI07",
    etapeFr: "Étape 3 sur 5", etapeEn: "Step 3 of 5",
    objectiveFr: "Valider et justifier les ajustements d'inventaire. Pour chaque variance détectée, saisissez la quantité d'ajustement et la justification.",
    objectiveEn: "Validate and justify inventory adjustments. For each detected variance, enter the adjustment quantity and justification.",
    fields: ["sku", "bin", "varianceQty", "justification"],
    pedagogicalDeep: {
      whyFr: "La réconciliation (MI07) est la validation officielle des écarts d'inventaire. Elle génère les mouvements de correction et met à jour le stock système.",
      whyEn: "Reconciliation (MI07) is the official validation of inventory variances. It generates correction movements and updates system stock.",
      realSAPFr: "Dans SAP, MI07 valide le document d'inventaire et génère automatiquement les mouvements 701 (surplus) ou 702 (manquant). Un responsable doit approuver les ajustements importants.",
      realSAPEn: "In SAP, MI07 validates the inventory document and automatically generates movements 701 (surplus) or 702 (shortage). A manager must approve significant adjustments.",
      dependencyFr: "La réconciliation dépend d'un comptage physique (MI04) complété. Les ajustements doivent être justifiés et approuvés.",
      dependencyEn: "Reconciliation depends on a completed physical count (MI04). Adjustments must be justified and approved.",
      realErrorFr: "Des ajustements non justifiés lors d'un audit SOX peuvent entraîner des retraitements financiers et des sanctions réglementaires.",
      realErrorEn: "Unjustified adjustments during a SOX audit can lead to financial restatements and regulatory sanctions.",
    }
  },
  replenish: {
    titleFr: "Réapprovisionnement (ME21N)", titleEn: "Replenishment (ME21N)", code: "REPLENISH", txCode: "ME21N", tCode: "ME21N",
    etapeFr: "Étape 4 sur 5", etapeEn: "Step 4 of 5",
    objectiveFr: "Calculer la quantité de réapprovisionnement optimale. Saisissez le stock actuel, le min/max et le stock de sécurité pour obtenir la suggestion système.",
    objectiveEn: "Calculate the optimal replenishment quantity. Enter current stock, min/max and safety stock to get the system suggestion.",
    fields: ["sku", "systemQty", "minQty", "maxQty", "safetyStock", "studentQty"],
    pedagogicalDeep: {
      whyFr: "Le réapprovisionnement automatique (MRP dans SAP) calcule les besoins en stock basés sur le point de commande (ROP), le stock de sécurité et la quantité économique de commande (EOQ).",
      whyEn: "Automatic replenishment (MRP in SAP) calculates stock needs based on the reorder point (ROP), safety stock, and economic order quantity (EOQ).",
      realSAPFr: "Dans SAP, MD01 (MRP) ou ME21N (PO manuel) génèrent les ordres de réapprovisionnement. Le système calcule automatiquement la quantité basée sur les paramètres MRP.",
      realSAPEn: "In SAP, MD01 (MRP) or ME21N (manual PO) generate replenishment orders. The system automatically calculates the quantity based on MRP parameters.",
      dependencyFr: "Le réapprovisionnement dépend des paramètres MRP configurés (stock min, stock max, stock de sécurité, délai fournisseur). Ces paramètres sont définis dans MM02.",
      dependencyEn: "Replenishment depends on configured MRP parameters (min stock, max stock, safety stock, supplier lead time). These parameters are defined in MM02.",
      realErrorFr: "Un réapprovisionnement trop tardif (stock < stock de sécurité) crée une rupture de stock et des arrêts de production ou des pertes de ventes.",
      realErrorEn: "Late replenishment (stock < safety stock) creates a stockout and production stoppages or lost sales.",
    }
  },
  compliance_m3: {
    titleFr: "Conformité Module 3", titleEn: "Module 3 Compliance", code: "COMPLIANCE_M3", txCode: "MB52", tCode: "MB52",
    etapeFr: "Étape 5 sur 5", etapeEn: "Step 5 of 5",
    objectiveFr: "Valider la conformité du module 3 : cycle count complété, variances réconciliées, réapprovisionnement planifié.",
    objectiveEn: "Validate Module 3 compliance: cycle count completed, variances reconciled, replenishment planned.",
    fields: [],
    pedagogicalDeep: {
      whyFr: "La conformité M3 valide que le cycle de contrôle des stocks est complet : comptage, réconciliation et réapprovisionnement sont tous documentés et approuvés.",
      whyEn: "M3 compliance validates that the stock control cycle is complete: counting, reconciliation and replenishment are all documented and approved.",
      realSAPFr: "Dans SAP, le rapport de clôture d'inventaire (MI20) liste tous les documents d'inventaire et leur statut. La clôture de période (MMPV) finalise les ajustements.",
      realSAPEn: "In SAP, the inventory closing report (MI20) lists all inventory documents and their status. Period closing (MMPV) finalizes adjustments.",
      dependencyFr: "La conformité M3 dépend de la réussite de CC_LIST, CC_COUNT, CC_RECON et REPLENISH. Toutes les variances doivent être réconciliées.",
      dependencyEn: "M3 compliance depends on successful CC_LIST, CC_COUNT, CC_RECON and REPLENISH steps. All variances must be reconciled.",
      realErrorFr: "Une clôture M3 avec des variances ouvertes bloque la clôture comptable mensuelle et génère des écarts dans les états financiers.",
      realErrorEn: "An M3 closing with open variances blocks the monthly accounting close and generates discrepancies in financial statements.",
    }
  },

  // ── Module 4 ──────────────────────────────────────────────────────────────
  kpi_data: {
    titleFr: "Lecture des données KPI", titleEn: "KPI data review", code: "KPI_DATA", txCode: "MB52", tCode: "MB52",
    etapeFr: "Étape 1 sur 5", etapeEn: "Step 1 of 5",
    objectiveFr: "Repérer les données KPI du portefeuille : consommation annuelle, stock moyen, commandes livrées, erreurs opérationnelles. Aucune transaction physique n'est attendue.",
    objectiveEn: "Identify portfolio KPI data: annual consumption, average stock, orders delivered, operational errors. No physical transaction is expected.",
    fields: [],
    pedagogicalDeep: {
      whyFr: "Les KPI logistiques mesurent la performance. Observer les données avant de classer et décider.",
      whyEn: "Logistics KPIs measure performance. Observe the data before classifying and deciding.",
      realSAPFr: "Dans SAP, les KPI sont extraits via des rapports standard (MB52, VL06O, ME2M) ou des tableaux de bord dans SAP Analytics Cloud.",
      realSAPEn: "In SAP, KPIs are extracted via standard reports (MB52, VL06O, ME2M) or dashboards in SAP Analytics Cloud.",
      dependencyFr: "Chaîne M4 : Observer → Classifier → Décider → Suivre.",
      dependencyEn: "M4 chain: Observe → Classify → Decide → Follow up.",
      realErrorFr: "Décider sans avoir lu les données brutes conduit à des recommandations non fondées.",
      realErrorEn: "Deciding without reading raw data leads to unsupported recommendations.",
    }
  },
  kpi_rotation: {
    titleFr: "Taux de rotation des stocks", titleEn: "Inventory turnover rate", code: "KPI_ROTATION", txCode: "MB52", tCode: "MB52",
    etapeFr: "Étape 2 sur 5", etapeEn: "Step 2 of 5",
    objectiveFr: "Consommation annuelle : 2 400 unités. Stock moyen : 400 unités. Calculez le taux de rotation, classifiez le résultat et recommandez une action avec suivi.",
    objectiveEn: "Annual consumption: 2,400 units. Average stock: 400 units. Calculate turnover, classify the result, and recommend an action with follow-up.",
    fields: ["studentAnswer"],
    pedagogicalDeep: {
      whyFr: "Le taux de rotation mesure combien de fois le stock est renouvelé par an. La classification guide la politique stock.",
      whyEn: "Turnover measures how many times stock is renewed per year. Classification guides stock policy.",
      realSAPFr: "Dans SAP, le taux de rotation s'appuie sur MB52 (stock moyen) et MB51 (consommation). DSI = 365 / taux.",
      realSAPEn: "In SAP, turnover uses MB52 (average stock) and MB51 (consumption). DSI = 365 / rate.",
      dependencyFr: "Consultez la bande de référence dans l'aide si besoin — calculez et classifiez vous-même.",
      dependencyEn: "Check the reference band in help if needed — calculate and classify yourself.",
      realErrorFr: "Confondre une rotation dans la bande normale avec un surstock conduit à des décisions de destock injustifiées.",
      realErrorEn: "Confusing normal-band turnover with overstock leads to unjustified destock decisions.",
    }
  },
  kpi_service: {
    titleFr: "Taux de service (OTIF)", titleEn: "Service Level (OTIF)", code: "KPI_SERVICE", txCode: "VL06O", tCode: "VL06O",
    etapeFr: "Étape 3 sur 5", etapeEn: "Step 3 of 5",
    objectiveFr: "Données : 285 commandes livrées sur 300 ; erreurs opérationnelles disponibles dans le tour de contrôle. Calculez et classifiez l'OTIF, puis reliez-le au contexte d'erreurs si pertinent.",
    objectiveEn: "Data: 285 orders delivered out of 300; operational errors available in the control tower. Calculate and classify OTIF, then relate it to the error context if relevant.",
    fields: ["studentAnswer"],
    pedagogicalDeep: {
      whyFr: "L'OTIF mesure les commandes livrées complètement et à temps. Il doit être lu avec le taux d'erreur, pas isolément.",
      whyEn: "OTIF measures orders delivered complete and on time. Read it with the error rate, not in isolation.",
      realSAPFr: "Dans SAP, l'OTIF s'appuie sur VL06O et les indicateurs SD.",
      realSAPEn: "In SAP, OTIF relies on VL06O and SD indicators.",
      dependencyFr: "Chaîne : Observer les données → Classifier → Décider → Suivre.",
      dependencyEn: "Chain: Observe data → Classify → Decide → Follow up.",
      realErrorFr: "Classer un OTIF élevé comme faible, ou ignorer le taux d'erreur, fausse le diagnostic.",
      realErrorEn: "Calling a high OTIF weak, or ignoring the error rate, distorts the diagnosis.",
    }
  },
  kpi_diagnostic: {
    titleFr: "Synthèse décisionnelle multi-KPI", titleEn: "Multi-KPI decision synthesis", code: "KPI_DIAGNOSTIC", txCode: "LT23", tCode: "LT23",
    etapeFr: "Étape 4 sur 5", etapeEn: "Step 4 of 5",
    objectiveFr: "Formulez une synthèse courte à partir des KPI : classification, décision et suivi. Utilisez vos propres mots — une phrase unique n'est pas exigée.",
    objectiveEn: "Write a short synthesis from the KPIs: classification, decision, and follow-up. Use your own words — no single phrase is required.",
    fields: ["studentAnswer"],
    pedagogicalDeep: {
      whyFr: "La synthèse relie les indicateurs pour une décision actionnable : Observer → Classifier → Décider → Suivre.",
      whyEn: "Synthesis links indicators into an actionable decision: Observe → Classify → Decide → Follow up.",
      realSAPFr: "Les revues de direction s'appuient sur des tableaux de bord, pas sur une transaction magasin.",
      realSAPEn: "Management reviews rely on dashboards, not a warehouse transaction.",
      dependencyFr: "Appuyez-vous sur vos interprétations précédentes ; ne recopiez pas une réponse modèle.",
      dependencyEn: "Build on your prior interpretations; do not copy a model answer.",
      realErrorFr: "Une synthèse sans décision ou sans suivi reste incomplète pour le comité.",
      realErrorEn: "A synthesis without a decision or follow-up remains incomplete for the committee.",
    }
  },
  compliance_m4: {
    titleFr: "Conformité Module 4", titleEn: "Module 4 Compliance", code: "COMPLIANCE_M4", txCode: "MB52", tCode: "MB52",
    etapeFr: "Étape 5 sur 5", etapeEn: "Step 5 of 5",
    objectiveFr: "Valider la conformité du module 4 : KPIs calculés, interprétations documentées, diagnostic et plan d'action formulés.",
    objectiveEn: "Validate Module 4 compliance: KPIs calculated, interpretations documented, diagnostic and action plan formulated.",
    fields: [],
    pedagogicalDeep: {
      whyFr: "La conformité M4 valide que l'analyse KPI est complète : données saisies, taux calculés, interprétations justifiées et diagnostic actionnable.",
      whyEn: "M4 compliance validates that the KPI analysis is complete: data entered, rates calculated, interpretations justified, and actionable diagnostic.",
      realSAPFr: "Dans SAP, le rapport de performance logistique est généré via SAP Analytics Cloud ou des rapports BW personnalisés. Il est présenté lors des revues de direction mensuelles.",
      realSAPEn: "In SAP, the logistics performance report is generated via SAP Analytics Cloud or custom BW reports. It is presented during monthly management reviews.",
      dependencyFr: "La conformité M4 dépend de la réussite de KPI_DATA, KPI_ROTATION, KPI_SERVICE et KPI_DIAGNOSTIC. Toutes les interprétations doivent être documentées.",
      dependencyEn: "M4 compliance depends on successful KPI_DATA, KPI_ROTATION, KPI_SERVICE and KPI_DIAGNOSTIC steps. All interpretations must be documented.",
      realErrorFr: "Des KPIs non interprétés dans un rapport de direction sont une non-conformité de gouvernance qui peut être signalée lors d'un audit ISO 9001.",
      realErrorEn: "Uninterpreted KPIs in a management report are a governance non-compliance that may be flagged during an ISO 9001 audit.",
    }
  },

  // ── Module 5 ──────────────────────────────────────────────────────────────
  m5_reception: {
    titleFr: "Réception M5 (MIGO)", titleEn: "M5 Reception (MIGO)", code: "M5_RECEPTION", txCode: "MIGO", tCode: "MIGO",
    etapeFr: "Étape 1 sur 7", etapeEn: "Step 1 of 7",
    objectiveFr: "Simulation intégrée M5 — Étape 1 : Réceptionner les marchandises fournisseur. Saisissez le SKU, la quantité et le numéro de document.",
    objectiveEn: "M5 Integrated Simulation — Step 1: Receive supplier goods. Enter the SKU, quantity and document number.",
    fields: ["docRef", "sku", "qty"],
    pedagogicalDeep: {
      whyFr: "La simulation intégrée M5 reproduit un cycle complet d'opérations entrepôt en conditions réelles. Chaque étape dépend des précédentes, comme dans un vrai WMS.",
      whyEn: "The M5 integrated simulation reproduces a complete warehouse operations cycle under real conditions. Each step depends on the previous ones, as in a real WMS.",
      realSAPFr: "Dans SAP S/4HANA, la réception (MIGO/101) est la première transaction du cycle logistique. Elle crée un document matière et met à jour le stock en temps réel.",
      realSAPEn: "In SAP S/4HANA, receipt (MIGO/101) is the first transaction in the logistics cycle. It creates a material document and updates stock in real time.",
      dependencyFr: "La réception M5 est le point de départ de la simulation. Elle doit être postée correctement pour que les étapes suivantes (putaway, cycle count) puissent s'exécuter.",
      dependencyEn: "M5 reception is the starting point of the simulation. It must be posted correctly for subsequent steps (putaway, cycle count) to execute.",
      realErrorFr: "Une réception avec un SKU incorrect ou une quantité erronée crée une chaîne d'erreurs dans toutes les étapes suivantes de la simulation.",
      realErrorEn: "A receipt with an incorrect SKU or wrong quantity creates a chain of errors in all subsequent simulation steps.",
    }
  },
  m5_putaway: {
    titleFr: "Rangement M5 (LT01)", titleEn: "M5 Putaway (LT01)", code: "M5_PUTAWAY", txCode: "LT01", tCode: "LT01",
    etapeFr: "Étape 2 sur 7", etapeEn: "Step 2 of 7",
    objectiveFr: "Simulation intégrée M5 — Étape 2 : Ranger les marchandises reçues avec traçabilité de lot. Saisissez le bin source (RÉCEPTION), le bin destination (STOCKAGE) et le numéro de lot.",
    objectiveEn: "M5 Integrated Simulation — Step 2: Store received goods with lot traceability. Enter source bin (RECEPTION), destination bin (STOCKAGE) and lot number.",
    fields: ["sku", "fromBin", "toBin", "qty", "lotNumber"],
    binZoneHint: {
      fromBin: { fr: "Zone source : RÉCEPTION (REC-01 ou REC-02) — marchandises venant d'être reçues", en: "Source zone: RECEPTION (REC-01 or REC-02) — recently received goods" },
      toBin: { fr: "Zone destination : STOCKAGE (B-01-R1-L1, B-01-R1-L2…) — emplacement définitif", en: "Destination zone: STOCKAGE (B-01-R1-L1, B-01-R1-L2…) — final storage" },
    },
    pedagogicalDeep: {
      whyFr: "Le rangement M5 combine les compétences de M1 (putaway) et M2 (traçabilité lot). Le numéro de lot est essentiel pour le FIFO dans les étapes suivantes.",
      whyEn: "M5 putaway combines skills from M1 (putaway) and M2 (lot traceability). The lot number is essential for FIFO in subsequent steps.",
      realSAPFr: "Dans SAP WM, LT01 crée un ordre de transfert avec numéro de lot. Le système enregistre la date de réception pour le calcul FIFO/FEFO automatique.",
      realSAPEn: "In SAP WM, LT01 creates a transfer order with lot number. The system records the receipt date for automatic FIFO/FEFO calculation.",
      dependencyFr: "Le rangement M5 dépend d'une réception M5 validée. Le bin source doit contenir le stock reçu, le bin destination doit avoir de la capacité disponible.",
      dependencyEn: "M5 putaway depends on a validated M5 reception. The source bin must contain the received stock, the destination bin must have available capacity.",
      realErrorFr: "Un rangement sans numéro de lot dans un entrepôt pharmaceutique ou alimentaire est une violation réglementaire (FDA, HACCP) pouvant entraîner un rappel produit.",
      realErrorEn: "Putaway without a lot number in a pharmaceutical or food warehouse is a regulatory violation (FDA, HACCP) that can lead to a product recall.",
    }
  },
  m5_cycle_count: {
    titleFr: "Inventaire M5 (MI04)", titleEn: "M5 Cycle Count (MI04)", code: "M5_CYCLE_COUNT", txCode: "MI04", tCode: "MI04",
    etapeFr: "Étape 3 sur 7–8", etapeEn: "Step 3 of 7–8",
    objectiveFr: "Simulation intégrée M5 — Étape 3 : Compter physiquement le stock et comparer avec le système. Saisissez le SKU, le bin, la quantité système et la quantité comptée.",
    objectiveEn: "M5 Integrated Simulation — Step 3: Physically count stock and compare with system. Enter SKU, bin, system quantity and counted quantity.",
    fields: ["sku", "bin", "systemQty", "countedQty"],
    pedagogicalDeep: {
      whyFr: "L'inventaire M5 applique les compétences de M3 (cycle count) dans le contexte de la simulation intégrée. Il vérifie que les transactions précédentes (réception, rangement) sont cohérentes.",
      whyEn: "M5 cycle count applies M3 skills (cycle count) in the integrated simulation context. It verifies that previous transactions (reception, putaway) are consistent.",
      realSAPFr: "Dans SAP, le cycle count M5 utilise MI01 (création document), MI04 (saisie comptage) et MI07 (validation). Le tout est traçable dans MI20 (liste des documents d'inventaire).",
      realSAPEn: "In SAP, M5 cycle count uses MI01 (document creation), MI04 (count entry) and MI07 (validation). Everything is traceable in MI20 (inventory document list).",
      dependencyFr: "L'inventaire M5 dépend des transactions précédentes (réception + rangement). Une variance importante indique une erreur dans les étapes précédentes.",
      dependencyEn: "M5 cycle count depends on previous transactions (reception + putaway). A significant variance indicates an error in previous steps.",
      realErrorFr: "Une variance de 0 après réception et rangement confirme la cohérence du système. Une variance non nulle nécessite une investigation immédiate.",
      realErrorEn: "A variance of 0 after reception and putaway confirms system consistency. A non-zero variance requires immediate investigation.",
    }
  },
  m5_adj: {
    titleFr: "Ajustement M5 (MI07)", titleEn: "M5 Adjustment (MI07)", code: "M5_ADJ", txCode: "MI07", tCode: "MI07",
    etapeFr: "Étape 4 sur 8 — correction variance", etapeEn: "Step 4 of 8 — variance correction",
    objectiveFr: "Simulation intégrée M5 — Corriger l'écart inventaire détecté au comptage. Postez un ajustement MI07 avec justification avant de poursuivre vers réappro et KPI.",
    objectiveEn: "M5 Integrated Simulation — Correct the inventory variance detected at cycle count. Post an MI07 adjustment with justification before continuing to replenish and KPI.",
    fields: ["sku", "bin", "varianceQty", "justification"],
    pedagogicalDeep: {
      whyFr: "L'ajustement M5 garantit que le stock système reflète la réalité physique avant toute analyse KPI. C'est la règle « corriger avant de piloter ».",
      whyEn: "M5 adjustment ensures system stock reflects physical reality before any KPI analysis. This is the « correct before steering » rule.",
      realSAPFr: "Dans SAP, MI07 valide l'écart inventaire et met à jour le stock comptable de façon traçable.",
      realSAPEn: "In SAP, MI07 validates inventory variance and updates accounting stock traceably.",
      dependencyFr: "M5_ADJ dépend d'un M5_CYCLE_COUNT avec variance non nulle. Réappro, KPI et décision sont bloqués tant que l'ajustement n'est pas posté.",
      dependencyEn: "M5_ADJ depends on M5_CYCLE_COUNT with non-zero variance. Replenish, KPI and decision are blocked until adjustment is posted.",
      realErrorFr: "Piloter avec un écart ouvert fausse les KPI et compromet la fiabilité opérationnelle.",
      realErrorEn: "Steering with an open variance skews KPIs and undermines operational reliability.",
    }
  },
  m5_replenish: {
    titleFr: "Réapprovisionnement M5", titleEn: "M5 Replenishment", code: "M5_REPLENISH", txCode: "ME21N", tCode: "ME21N",
    etapeFr: "Étape 4 sur 7", etapeEn: "Step 4 of 7",
    objectiveFr: "Simulation intégrée M5 — Étape 4 : Calculer la quantité de réapprovisionnement. Saisissez le stock actuel, les paramètres min/max/sécurité et votre suggestion de commande.",
    objectiveEn: "M5 Integrated Simulation — Step 4: Calculate replenishment quantity. Enter current stock, min/max/safety parameters and your order suggestion.",
    fields: ["sku", "systemQty", "minQty", "maxQty", "safetyStock", "studentQty"],
    pedagogicalDeep: {
      whyFr: "Le réapprovisionnement M5 intègre les compétences de M3 (MRP) dans la simulation complète. Il démontre comment le WMS déclenche automatiquement les commandes fournisseurs.",
      whyEn: "M5 replenishment integrates M3 skills (MRP) into the complete simulation. It demonstrates how the WMS automatically triggers supplier orders.",
      realSAPFr: "Dans SAP, MD01 (MRP run) analyse tous les besoins et génère des propositions d'approvisionnement. ME21N crée le PO final après validation du gestionnaire.",
      realSAPEn: "In SAP, MD01 (MRP run) analyzes all requirements and generates procurement proposals. ME21N creates the final PO after manager validation.",
      dependencyFr: "Le réapprovisionnement M5 dépend du stock actuel (après inventaire M5). Les paramètres min/max doivent être cohérents avec la consommation réelle.",
      dependencyEn: "M5 replenishment depends on current stock (after M5 cycle count). Min/max parameters must be consistent with actual consumption.",
      realErrorFr: "Un réapprovisionnement calculé sur un stock erroné (avant inventaire) peut créer un surstock ou une rupture. L'ordre des étapes est critique.",
      realErrorEn: "Replenishment calculated on incorrect stock (before cycle count) can create overstock or stockout. Step order is critical.",
    }
  },
  m5_kpi: {
    titleFr: "KPI intégrés M5", titleEn: "M5 Integrated KPIs", code: "M5_KPI", txCode: "MB52", tCode: "MB52",
    etapeFr: "Étape 5 sur 7", etapeEn: "Step 5 of 7",
    objectiveFr: "Simulation intégrée M5 — Étape 5 : Calculer les KPIs de la simulation. Saisissez les données de consommation, commandes et opérations pour obtenir les indicateurs de performance.",
    objectiveEn: "M5 Integrated Simulation — Step 5: Calculate simulation KPIs. Enter consumption, orders and operations data to get performance indicators.",
    fields: ["annualConsumption", "averageStock", "ordersFulfilled", "totalOrders", "operationalErrors", "totalOperations", "avgLeadTimeDays", "stockValue"],
    pedagogicalDeep: {
      whyFr: "Les KPI M5 synthétisent toute la simulation en indicateurs de performance. Ils permettent d'évaluer si les opérations de la simulation ont été efficaces.",
      whyEn: "M5 KPIs synthesize the entire simulation into performance indicators. They allow evaluating whether the simulation operations were effective.",
      realSAPFr: "Dans SAP, les KPIs de fin de simulation sont extraits via des rapports analytiques (SAP Analytics Cloud, BW/BI). Ils alimentent le tableau de bord de direction.",
      realSAPEn: "In SAP, end-of-simulation KPIs are extracted via analytical reports (SAP Analytics Cloud, BW/BI). They feed the management dashboard.",
      dependencyFr: "Les KPI M5 dépendent de toutes les transactions précédentes de la simulation. Des transactions incorrectes faussent les indicateurs finaux.",
      dependencyEn: "M5 KPIs depend on all previous simulation transactions. Incorrect transactions distort final indicators.",
      realErrorFr: "Des KPIs calculés en fin de simulation avec des données incohérentes invalident toute l'analyse. La qualité des données est fondamentale.",
      realErrorEn: "KPIs calculated at the end of simulation with inconsistent data invalidate the entire analysis. Data quality is fundamental.",
    }
  },
  m5_decision: {
    titleFr: "Décision tactique", titleEn: "Tactical decision", code: "M5_DECISION", txCode: "LT23", tCode: "LT23",
    etapeFr: "Étape 6 sur 7", etapeEn: "Step 6 of 7",
    objectiveFr: "Formuler une décision à partir des KPI et du stock du run. Distinguez niveau tactique et stratégique selon le scénario.",
    objectiveEn: "Formulate a decision from run KPIs and stock. Distinguish tactical vs strategic level per scenario.",
    fields: ["studentAnswer"],
    pedagogicalDeep: {
      whyFr: "Après Exécuter → Vérifier → Corriger si nécessaire, la décision s'appuie sur les preuves du run — pas sur les valeurs du Module 4.",
      whyEn: "After Execute → Verify → Correct if needed, the decision relies on run evidence — not Module 4 values.",
      realSAPFr: "Les décisions s'appuient sur des indicateurs runtime (Embedded Analytics / SAC), pas sur une annexe statique.",
      realSAPEn: "Decisions rely on runtime indicators (Embedded Analytics / SAC), not a static annex.",
      dependencyFr: "Utilisez le snapshot M5_KPI de votre session. Q = 0 peut être une décision professionnelle complète.",
      dependencyEn: "Use your session M5_KPI snapshot. Q = 0 can be a complete professional decision.",
      realErrorFr: "Recopier les KPI du Module 4 ou inventer un problème sur un cycle nominal fausse la décision.",
      realErrorEn: "Copying Module 4 KPIs or inventing a problem on a nominal cycle distorts the decision.",
    }
  },
  compliance_m5: {
    titleFr: "Validation finale M5", titleEn: "M5 Final Validation", code: "COMPLIANCE_M5", txCode: "MB52", tCode: "MB52",
    etapeFr: "Étape 7 sur 7", etapeEn: "Step 7 of 7",
    objectiveFr: "Simulation intégrée M5 — Étape finale : Valider la conformité complète de la simulation intégrée. Toutes les étapes doivent être complétées avec succès.",
    objectiveEn: "M5 Integrated Simulation — Final step: Validate complete compliance of the integrated simulation. All steps must be completed successfully.",
    fields: [],
    pedagogicalDeep: {
      whyFr: "La validation finale M5 confirme que l'étudiant maîtrise l'ensemble du cycle logistique WMS/ERP en conditions intégrées.",
      whyEn: "M5 final validation confirms that the student masters the complete WMS/ERP logistics cycle under integrated conditions.",
      realSAPFr: "Dans SAP, la validation finale correspond à la clôture de période (MMPV) et au rapport de conformité annuel. Elle déclenche les processus de reporting réglementaire.",
      realSAPEn: "In SAP, final validation corresponds to period closing (MMPV) and the annual compliance report. It triggers regulatory reporting processes.",
      dependencyFr: "La validation M5 dépend de la réussite de toutes les étapes précédentes. C'est la démonstration que l'étudiant peut gérer un cycle logistique complet de façon autonome.",
      dependencyEn: "M5 validation depends on successful completion of all previous steps. It demonstrates that the student can manage a complete logistics cycle autonomously.",
      realErrorFr: "Une validation finale avec des étapes incomplètes est impossible en production réelle. SAP bloque la clôture si des documents sont en suspens.",
      realErrorEn: "A final validation with incomplete steps is impossible in real production. SAP blocks closing if documents are pending.",
    }
  },
};

type FormValues = {
  docRef?: string;
  sku?: string;
  bin?: string;
  fromBin?: string;
  toBin?: string;
  qty?: string;
  physicalQty?: string;
  comment?: string;
  lotNumber?: string;
  systemQty?: string;
  countedQty?: string;
  minQty?: string;
  maxQty?: string;
  safetyStock?: string;
  studentQty?: string;
  studentAnswer?: string;
  varianceQty?: string;
  justification?: string;
  annualConsumption?: string;
  averageStock?: string;
  ordersFulfilled?: string;
  totalOrders?: string;
  operationalErrors?: string;
  totalOperations?: string;
  avgLeadTimeDays?: string;
  stockValue?: string;
  kpiLedgerConfirmed?: boolean;
};

function PedagogicalPanel({ cfg, isDemo }: { cfg: typeof STEP_CONFIG[string]; isDemo: boolean }) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  if (!isDemo) return null;
  return (
    <div className="border border-purple-200 dark:border-purple-800 rounded-md overflow-hidden mt-4">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-semibold hover:bg-purple-100 dark:hover:bg-purple-950/60 transition-colors"
      >
        <span className="flex items-center gap-2">
          <FlaskConical size={13} />
          {t("Explication pédagogique approfondie", "In-depth pedagogical explanation")}
        </span>
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>
      {open && (
        <div className="bg-card p-4 space-y-3 text-xs">
          <div>
            <p className="font-bold text-purple-600 dark:text-purple-400 mb-1">
              📚 {t("Pourquoi cette transaction existe dans l'ERP ?", "Why does this transaction exist in the ERP?")}
            </p>
            <p className="text-muted-foreground leading-relaxed">{t(cfg.pedagogicalDeep.whyFr, cfg.pedagogicalDeep.whyEn)}</p>
          </div>
          <div>
            <p className="font-bold text-primary mb-1">🔧 {t("Dans SAP S/4HANA réel :", "In real SAP S/4HANA:")}</p>
            <p className="text-muted-foreground leading-relaxed">{t(cfg.pedagogicalDeep.realSAPFr, cfg.pedagogicalDeep.realSAPEn)}</p>
          </div>
          <div>
            <p className="font-bold text-green-600 dark:text-green-400 mb-1">🔗 {t("Dépendance système :", "System dependency:")}</p>
            <p className="text-muted-foreground leading-relaxed">{t(cfg.pedagogicalDeep.dependencyFr, cfg.pedagogicalDeep.dependencyEn)}</p>
          </div>
          <div>
            <p className="font-bold text-destructive mb-1">⚠ {t("Erreur en production réelle :", "Error in real production:")}</p>
            <p className="text-muted-foreground leading-relaxed">{t(cfg.pedagogicalDeep.realErrorFr, cfg.pedagogicalDeep.realErrorEn)}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function BackendTransparencyPanel({ runData }: { runData: any }) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  if (!runData?.isDemo || !runData?.demoBackendState) return null;
  const { inventory, transactions, cycleCounts } = runData.demoBackendState;
  const inventoryEntries = Object.entries(inventory as Record<string, number>).filter(([, qty]) => qty !== 0);
  return (
    <div className="border border-blue-200 dark:border-blue-800 rounded-md overflow-hidden mt-4">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-950/60 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Database size={13} />
          {t("Voir logique système (WMS backend)", "View system logic (WMS backend)")}
        </span>
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>
      {open && (
        <div className="bg-card p-4 space-y-4 text-xs">
          <div>
            <p className="font-bold text-blue-700 dark:text-blue-300 mb-2">
              📦 {t("Stock actuel (INVENTORY_BALANCE)", "Current stock (INVENTORY_BALANCE)")}
            </p>
            {inventoryEntries.length === 0 ? (
              <p className="text-muted-foreground italic">{t("Aucun stock enregistré", "No stock recorded")}</p>
            ) : (
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-blue-50 dark:bg-blue-950/30">
                    <th className="text-left px-2 py-1 font-semibold text-blue-700 dark:text-blue-300">SKU :: BIN</th>
                    <th className="text-right px-2 py-1 font-semibold text-blue-700 dark:text-blue-300">{t("Quantité", "Quantity")}</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryEntries.map(([key, qty]) => (
                    <tr key={key} className="border-t border-border">
                      <td className="px-2 py-1 font-mono text-muted-foreground">{key}</td>
                      <td className={`px-2 py-1 text-right font-bold ${(qty as number) < 0 ? "text-destructive" : "text-green-600 dark:text-green-400"}`}>{qty as number}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div>
            <p className="font-bold text-blue-700 dark:text-blue-300 mb-2">
              📋 {t("Transactions enregistrées", "Recorded transactions")} ({transactions?.length ?? 0})
            </p>
            {(transactions?.length ?? 0) === 0 ? (
              <p className="text-muted-foreground italic">{t("Aucune transaction", "No transactions")}</p>
            ) : (
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-blue-50 dark:bg-blue-950/30">
                    <th className="text-left px-2 py-1 font-semibold text-blue-700 dark:text-blue-300">{t("Type", "Type")}</th>
                    <th className="text-left px-2 py-1 font-semibold text-blue-700 dark:text-blue-300">SKU</th>
                    <th className="text-left px-2 py-1 font-semibold text-blue-700 dark:text-blue-300">BIN</th>
                    <th className="text-right px-2 py-1 font-semibold text-blue-700 dark:text-blue-300">{t("Qté", "Qty")}</th>
                    <th className="text-center px-2 py-1 font-semibold text-blue-700 dark:text-blue-300">{t("Posté", "Posted")}</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx: any, i: number) => (
                    <tr key={i} className="border-t border-border">
                      <td className="px-2 py-1"><span className="font-bold text-primary">{tx.docType}</span></td>
                      <td className="px-2 py-1 font-mono text-muted-foreground">{tx.sku}</td>
                      <td className="px-2 py-1 font-mono text-muted-foreground">{tx.bin}</td>
                      <td className="px-2 py-1 text-right text-foreground">{tx.qty}</td>
                      <td className="px-2 py-1 text-center">{tx.posted ? "✅" : "❌"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {cycleCounts?.length > 0 && (
            <div>
              <p className="font-bold text-blue-700 dark:text-blue-300 mb-2">
                🔍 {t("Comptages inventaire", "Cycle counts")} ({cycleCounts.length})
              </p>
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-blue-50 dark:bg-blue-950/30">
                    <th className="text-left px-2 py-1 font-semibold text-blue-700 dark:text-blue-300">SKU</th>
                    <th className="text-left px-2 py-1 font-semibold text-blue-700 dark:text-blue-300">BIN</th>
                    <th className="text-right px-2 py-1 font-semibold text-blue-700 dark:text-blue-300">{t("Variance", "Variance")}</th>
                    <th className="text-center px-2 py-1 font-semibold text-blue-700 dark:text-blue-300">{t("Résolu", "Resolved")}</th>
                  </tr>
                </thead>
                <tbody>
                  {cycleCounts.map((cc: any, i: number) => (
                    <tr key={i} className="border-t border-border">
                      <td className="px-2 py-1 font-mono text-muted-foreground">{cc.sku}</td>
                      <td className="px-2 py-1 font-mono text-muted-foreground">{cc.bin}</td>
                      <td className={`px-2 py-1 text-right font-bold ${cc.variance !== 0 ? "text-destructive" : "text-green-600 dark:text-green-400"}`}>
                        {cc.variance > 0 ? "+" : ""}{cc.variance}
                      </td>
                      <td className="px-2 py-1 text-center">{cc.resolved ? "✅" : "❌"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function StepForm() {
  const { runId, step } = useParams<{ runId: string; step: string }>();
  const [, navigate] = useLocation();
  const { t, language } = useLanguage();
  const baseCfg = STEP_CONFIG[step?.toLowerCase() ?? ""] ?? STEP_CONFIG.po;

  const { data: runData, isLoading, refetch } = trpc.runs.state.useQuery({ runId: parseInt(runId) });
  const isM5KpiStep = step?.toLowerCase() === "m5_kpi";
  const isM5DecisionStep = step?.toLowerCase() === "m5_decision";
  /** ADJ / MI07 — signed inventory variance; must not inherit positive-qty min from other steps. */
  const isAdjStep = baseCfg.code === "ADJ" || step?.toLowerCase() === "adj";
  const {
    data: m5KpiLedger,
    isLoading: m5KpiLedgerLoading,
    isError: m5KpiLedgerError,
  } = trpc.m5.kpiLedger.useQuery(
    { runId: parseInt(runId) },
    { enabled: (isM5KpiStep || isM5DecisionStep) && !!runId },
  );
  const { data: masterData } = trpc.master.skus.useQuery();
  const { data: bins } = trpc.master.bins.useQuery();

  const m3VarianceThreshold = useMemo(() => {
    const json = runData?.scenario?.initialStateJson as { adjustmentThreshold?: number } | null | undefined;
    const t = json?.adjustmentThreshold;
    return typeof t === "number" && t > 0 ? t : 5;
  }, [runData?.scenario?.initialStateJson]);

  const m3InitialState = runData?.scenario?.initialStateJson as {
    cycleCountTargets?: Array<{ sku: string; bin?: string; systemQty: number; physicalQty: number }>;
    replenishmentParams?: Array<{ sku: string; minQty: number; maxQty: number; safetyStock: number }>;
  } | null | undefined;

  const m3CycleCountTargets = m3InitialState?.cycleCountTargets ?? [];
  const m3ReplenishmentParams = m3InitialState?.replenishmentParams ?? [];
  const isM3ReplenishOnly =
    m3ReplenishmentParams.length > 0 && m3CycleCountTargets.length === 0;
  const ccReconProgress = useMemo(() => {
    if (m3CycleCountTargets.length === 0) return null;
    const evidence = (runData as {
      m3Evidence?: {
        inventoryCounts?: Array<{
          sku: string;
          systemQty: number | string;
          countedQty: number | string;
          varianceQty?: number | string;
        }>;
        inventoryAdjustments?: Array<{
          sku: string;
          varianceQty: number | string;
          adjustmentQty: number | string;
        }>;
      };
    } | undefined)?.m3Evidence;
    const txs =
      ((runData as {
        transactions?: Array<{
          docType: string;
          sku: string;
          bin?: string;
          qty: number;
          posted?: boolean;
        }>;
      } | undefined)?.transactions) ?? [];
    return computeCcReconProgress(
      m3CycleCountTargets,
      evidence?.inventoryCounts ?? [],
      evidence?.inventoryAdjustments ?? [],
      txs,
    );
  }, [m3CycleCountTargets, runData]);
  const ccReconPendingTargets = useMemo(() => {
    if (!ccReconProgress) return m3CycleCountTargets;
    return m3CycleCountTargets.filter((t) => ccReconProgress.pendingSkus.includes(t.sku));
  }, [ccReconProgress, m3CycleCountTargets]);
  const cfg = useMemo(() => {
    if (!isM3ReplenishOnly) return baseCfg;
    if (step?.toLowerCase() === "replenish") {
      return {
        ...baseCfg,
        titleFr: "Réapprovisionnement Min/Max",
        titleEn: "Min/Max Replenishment",
        txCode: "MD04",
        tCode: "MD04",
        etapeFr: "Étape 1 sur 2",
        etapeEn: "Step 1 of 2",
        objectiveFr:
          "Analyser les niveaux actuels, identifier les SKU sous le seuil minimum, calculer Q = Max − stock actuel, puis générer une recommandation pour chaque SKU.",
        objectiveEn:
          "Analyze the current stock levels, identify the SKUs below the minimum threshold, calculate Q = Maximum stock − Current stock, and generate one recommendation for each SKU.",
        pedagogicalDeep: {
          whyFr:
            "La planification Min/Max (MRP / reorder point) maintient le stock entre un seuil minimum et un maximum. Le stock de sécurité est un indicateur de risque, pas un additif à Q.",
          whyEn:
            "Min/Max planning (MRP / reorder point) keeps stock between a minimum and maximum. Safety stock is a risk indicator, not an add-on to Q.",
          realSAPFr:
            "Référence conceptuelle : MD04 (besoins en stock), politique Min/Max / reorder point. Q = Max − stock actuel.",
          realSAPEn:
            "Conceptual reference: MD04 (stock requirements), Min/Max / reorder-point policy. Q = Max − current stock.",
          dependencyFr:
            "Soumettez une recommandation pour chacun des deux SKU. L'étape est validée uniquement lorsque les deux quantités cibles sont correctes.",
          dependencyEn:
            "Submit one replenishment recommendation for each required SKU. The step is completed only when both target quantities are correct.",
          realErrorFr:
            "Remplir seulement jusqu'au Min, saisir Max comme quantité, ou ignorer un SKU laisse le plan de réapprovisionnement incomplet.",
          realErrorEn:
            "Filling only to Min, entering Max as the order quantity, or skipping a SKU leaves the replenishment plan incomplete.",
        },
      };
    }
    if (step?.toLowerCase() === "compliance_m3") {
      return {
        ...baseCfg,
        etapeFr: "Étape 2 sur 2",
        etapeEn: "Step 2 of 2",
        objectiveFr:
          "Valider que les deux recommandations respectent les paramètres Min/Max et le stock de sécurité comme indicateur de risque.",
        objectiveEn:
          "Validate that both replenishment recommendations comply with the Min/Max parameters and use safety stock as a risk indicator.",
        pedagogicalDeep: {
          whyFr:
            "La conformité M3 pour ce scénario valide le plan de réapprovisionnement Min/Max multi-SKU, pas un cycle de comptage.",
          whyEn:
            "M3 compliance for this scenario validates the multi-SKU Min/Max replenishment plan, not a cycle-count flow.",
          realSAPFr:
            "Références : MRP / planification de réapprovisionnement, MD04, politique Min/Max.",
          realSAPEn:
            "References: MRP / replenishment planning, MD04, Min/Max policy.",
          dependencyFr:
            "La conformité dépend de REPLENISH avec les deux SKU validés.",
          dependencyEn:
            "Compliance depends on REPLENISH with both SKUs validated.",
          realErrorFr:
            "Une conformité sans les deux recommandations correctes laisse le plan d'approvisionnement incomplet.",
          realErrorEn:
            "Compliance without both correct recommendations leaves the supply plan incomplete.",
        },
      };
    }
    return baseCfg;
  }, [baseCfg, isM3ReplenishOnly, step]);
  const m3ReplenishParamRows = useMemo(
    () => buildReplenishmentParamRows(m3ReplenishmentParams, (runData?.inventory ?? {}) as Record<string, number>),
    [m3ReplenishmentParams, runData?.inventory],
  );

  /** True only for SCN-017 (STRATEGIC_CAPSTONE) — stricter M5_DECISION requirements. */
  const isM5Strategic = useMemo(() => {
    const json = runData?.scenario?.initialStateJson as { m5Contract?: { decisionLevel?: string } } | null | undefined;
    return json?.m5Contract?.decisionLevel === "STRATEGIC";
  }, [runData?.scenario?.initialStateJson]);

  const scnCode = useMemo(
    () => resolveScenarioScnCode(runData?.scenario ?? null),
    [runData?.scenario],
  );

  const scn007Etape = useMemo(() => {
    if (scnCode !== "SCN-007") return null;
    const map: Record<string, { fr: string; en: string }> = {
      PUTAWAY: { fr: "Étape 2 sur 4", en: "Step 2 of 4" },
      STOCK_ACCURACY: { fr: "Étape 3 sur 4", en: "Step 3 of 4" },
      COMPLIANCE_ADV: { fr: "Étape 4 sur 4", en: "Step 4 of 4" },
      GR: { fr: "Étape 1 sur 4", en: "Step 1 of 4" },
    };
    return map[cfg.code] ?? null;
  }, [scnCode, cfg.code]);

  /** SCN-007 localized copy — capacity split only; never FIFO / "4 sur 5" / partial recovery. */
  const scn007DisplayCfg = useMemo(() => {
    if (scnCode !== "SCN-007") return cfg;
    const etape = scn007Etape;
    if (cfg.code === "PUTAWAY") {
      return {
        ...cfg,
        etapeFr: etape?.fr ?? "Étape 2 sur 4",
        etapeEn: etape?.en ?? "Step 2 of 4",
        objectiveFr:
          "Ranger exactement 500 unités du lot LOT-2025-002 vers B-01-R1-L1, puis exactement 100 unités vers B-01-R1-L2. Aucun rangement partiel n'est accepté.",
        objectiveEn:
          "Put away exactly 500 units of lot LOT-2025-002 to B-01-R1-L1, then exactly 100 units to B-01-R1-L2. No partial putaway is accepted.",
        pedagogicalDeep: {
          ...cfg.pedagogicalDeep,
          whyFr:
            "Ce scénario enseigne le contrôle de capacité d'emplacement : un bin max 500 force le split contractuel 500 + 100.",
          whyEn:
            "This scenario teaches bin capacity control: a max-500 bin forces the contractual 500 + 100 split.",
          dependencyFr:
            "Le PUTAWAY SCN-007 exige une GR postée (600 u. à REC-01). Seule la séquence exacte 500→L1 puis 100→L2 est autorisée.",
          dependencyEn:
            "SCN-007 PUTAWAY requires a posted GR (600 u. at REC-01). Only the exact sequence 500→L1 then 100→L2 is allowed.",
          realErrorFr:
            "Accepter un PUTAWAY de 400 (sous capacité) crée un état non contractuel — le système doit le rejeter avant toute mutation.",
          realErrorEn:
            "Accepting a 400-unit PUTAWAY (under capacity) creates a non-contractual state — the system must reject it before any mutation.",
        },
      };
    }
    if (cfg.code === "STOCK_ACCURACY") {
      return {
        ...cfg,
        etapeFr: etape?.fr ?? "Étape 3 sur 4",
        etapeEn: etape?.en ?? "Step 3 of 4",
        objectiveFr:
          "Vérifier que REC-01 est vide, que B-01-R1-L1 contient 500 unités et que B-01-R1-L2 contient 100 unités (total 600).",
        objectiveEn:
          "Verify that REC-01 is empty, B-01-R1-L1 holds 500 units and B-01-R1-L2 holds 100 units (total 600).",
        pedagogicalDeep: {
          ...cfg.pedagogicalDeep,
          dependencyFr:
            "La précision inventaire SCN-007 dépend du split PUTAWAY exact 500 + 100. FIFO n'appartient pas à ce scénario.",
          dependencyEn:
            "SCN-007 stock accuracy depends on the exact 500 + 100 PUTAWAY split. FIFO is not part of this scenario.",
        },
      };
    }
    if (cfg.code === "COMPLIANCE_ADV") {
      return {
        ...cfg,
        etapeFr: etape?.fr ?? "Étape 4 sur 4",
        etapeEn: etape?.en ?? "Step 4 of 4",
        objectiveFr:
          "Valider la conformité SCN-007 : capacité respectée, split 500+100 terminé, précision inventaire et traçabilité du lot LOT-2025-002.",
        objectiveEn:
          "Validate SCN-007 compliance: capacity respected, 500+100 split complete, inventory accuracy and lot LOT-2025-002 traceability.",
        pedagogicalDeep: {
          whyFr:
            "La conformité avancée SCN-007 vérifie le contrôle de capacité (split 500+100), la précision inventaire et la traçabilité du lot LOT-2025-002. Le FIFO est enseigné dans le SCN-008.",
          whyEn:
            "SCN-007 advanced compliance verifies capacity control (500+100 split), inventory accuracy and lot LOT-2025-002 traceability. FIFO is taught in SCN-008.",
          realSAPFr:
            "Dans SAP, le contrôle de capacité d'emplacement est géré via les types de stockage et les contrôles LT01/LT0A.",
          realSAPEn:
            "In SAP, bin capacity control is managed via storage types and LT01/LT0A checks.",
          dependencyFr:
            "La conformité SCN-007 dépend de PUTAWAY (500+100) et STOCK_ACCURACY. FIFO_PICK n'est pas requis.",
          dependencyEn:
            "SCN-007 compliance depends on PUTAWAY (500+100) and STOCK_ACCURACY. FIFO_PICK is not required.",
          realErrorFr:
            "Une répartition non contractuelle (ex. 400+100+100) ou un overflow 600 bloque la conformité même si le total reste 600.",
          realErrorEn:
            "A non-contractual split (e.g. 400+100+100) or a 600 overflow blocks compliance even if the total remains 600.",
        },
      };
    }
    if (etape) {
      return { ...cfg, etapeFr: etape.fr, etapeEn: etape.en };
    }
    return cfg;
  }, [scnCode, cfg, scn007Etape]);

  /** M4 analytical titles + M5 tactical/strategic decision labels (SCN-aware). */
  const displayCfg = useMemo(() => {
    let next = scn007DisplayCfg;
    if (cfg.code === "KPI_DATA") {
      next = {
        ...next,
        titleFr: M4_KPI_DATA_TITLE.fr,
        titleEn: M4_KPI_DATA_TITLE.en,
      };
    }
    if (cfg.code === "M5_DECISION") {
      const titles = getM5DecisionStepTitle(scnCode, isM5Strategic);
      const objective =
        scnCode === "SCN-016"
          ? {
              fr: "Réconcilier d'abord, décider ensuite. Basez votre décision sur le stock corrigé et les KPI du run.",
              en: "Reconcile first, decide afterward. Base your decision on corrected stock and run KPIs.",
            }
          : isM5Strategic || scnCode === "SCN-017"
            ? {
                fr: "Décision stratégique : citez ≥2 KPI du snapshot de session, une priorité, un compromis et un horizon de revue.",
                en: "Strategic decision: cite ≥2 KPIs from the session snapshot, one priority, one trade-off, and a review horizon.",
              }
            : {
                fr: "Décision tactique : le cycle est-il conforme ? Un réapprovisionnement est-il nécessaire ? Que maintenir ou surveiller ?",
                en: "Tactical decision: is the cycle compliant? Is replenishment required? What to maintain or monitor?",
              };
      next = {
        ...next,
        titleFr: titles.fr,
        titleEn: titles.en,
        objectiveFr: objective.fr,
        objectiveEn: objective.en,
      };
    }
    return next;
  }, [scn007DisplayCfg, cfg.code, scnCode, isM5Strategic]);

  const isScn007FifoNotInScenario = scnCode === "SCN-007" && cfg.code === "FIFO_PICK";

  const isAnalyticalStep = isAnalyticalAnswerStep(step);
  const useM4AnalyticalChrome = isM4AnalyticalStep(step, runData?.moduleId);
  const useM5AnalyticalChrome = isM5AnalyticalStep(step, runData?.moduleId);
  const useAnalyticalChrome = useM4AnalyticalChrome || useM5AnalyticalChrome;
  const analyticalQuestionText = useMemo(
    () => getAnalyticalQuestionText(step ?? "", scnCode, language, isM5Strategic),
    [step, scnCode, language, isM5Strategic],
  );
  const m5ResponseGuidance = useMemo(() => {
    if (!isM5DecisionStep) return undefined;
    return getM5ResponseGuidance(scnCode, isM5Strategic, language);
  }, [isM5DecisionStep, scnCode, isM5Strategic, language]);
  const m5Contract = useMemo(() => {
    const json = runData?.scenario?.initialStateJson as {
      m5Contract?: {
        replenishmentParams?: { minQty: number; maxQty: number; safetyStock: number };
        cycleCountTargets?: Array<{ systemQty: number; physicalQty: number }>;
      };
    } | null | undefined;
    return json?.m5Contract ?? null;
  }, [runData?.scenario?.initialStateJson]);
  const m5AdjCompleted = Boolean(
    (runData?.completedSteps as string[] | undefined)?.includes("M5_ADJ"),
  );

  // ── M1 mutations ──────────────────────────────────────────────────────────
  const submitPO = trpc.transactions.submitPO.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const submitGR = trpc.transactions.submitGR.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const postExistingGR = trpc.transactions.postExistingTransaction.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const submitPUTAWAY_M1 = trpc.transactions.submitPUTAWAY_M1.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const submitSO = trpc.transactions.submitSO.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const submitPICKING_M1 = trpc.transactions.submitPICKING_M1.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const submitGI = trpc.transactions.submitGI.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const submitCC = trpc.cycleCounts.submit.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const submitADJ = trpc.transactions.submitADJ.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const submitCompliance = trpc.compliance.finalize.useMutation({ onSuccess: handleSuccess, onError: handleError });

  // ── M2 mutations ──────────────────────────────────────────────────────────
  const submitGR_M2 = trpc.m2.submitGR.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const submitPUTAWAY_M2 = trpc.m2.submitPUTAWAY.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const submitFifoPick = trpc.m2.submitFifoPick.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const submitStockAccuracy = trpc.m2.submitStockAccuracy.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const submitComplianceAdv = trpc.m2.submitComplianceAdv.useMutation({ onSuccess: handleSuccess, onError: handleError });

  // ── M3 mutations ──────────────────────────────────────────────────────────
  const submitCcList = trpc.m3.submitCcList.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const submitCcCount = trpc.m3.submitCcCount.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const submitCcRecon = trpc.m3.submitCcRecon.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const submitReplenishM3 = trpc.m3.submitReplenish.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const submitComplianceM3 = trpc.m3.submitComplianceM3.useMutation({ onSuccess: handleSuccess, onError: handleError });

  // ── M4 mutations ──────────────────────────────────────────────────────────
  const submitKpiData = trpc.m4.submitKpiData.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const submitKpiRotation = trpc.m4.submitKpiRotation.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const submitKpiService = trpc.m4.submitKpiService.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const submitKpiDiagnostic = trpc.m4.submitKpiDiagnostic.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const submitComplianceM4 = trpc.m4.submitComplianceM4.useMutation({ onSuccess: handleSuccess, onError: handleError });

  // ── M5 mutations ──────────────────────────────────────────────────────────
  const submitM5Reception = trpc.m5.submitReception.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const submitM5Putaway = trpc.m5.submitPutaway.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const submitM5CycleCount = trpc.m5.submitCycleCount.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const submitM5Adj = trpc.m5.submitAdj.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const submitM5Replenish = trpc.m5.submitReplenish.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const submitM5Kpi = trpc.m5.submitKpi.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const submitM5Decision = trpc.m5.submitDecision.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const submitComplianceM5 = trpc.m5.submitComplianceM5.useMutation({ onSuccess: handleSuccess, onError: handleError });

  const { register, handleSubmit, watch, setValue, reset, formState: { errors: formErrors } } = useForm<FormValues>();

  const regularizeDocRef = useMemo(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("regularize");
  }, [step, runId]);

  const pendingRegularizationTx = useMemo(() => {
    const unposted = (runData as { unpostedTransactions?: Array<{ docRef?: string | null; sku: string; bin: string; qty: number; docType: string }> } | undefined)?.unpostedTransactions ?? [];
    if (!regularizeDocRef) return null;
    return unposted.find((t) => t.docRef === regularizeDocRef && t.docType === "GR") ?? null;
  }, [runData, regularizeDocRef]);

  const isGrRegularization = step?.toLowerCase() === "gr" && !!pendingRegularizationTx;

  useEffect(() => {
    if (!isGrRegularization || !pendingRegularizationTx) return;
    setValue("docRef", pendingRegularizationTx.docRef ?? "");
    setValue("sku", pendingRegularizationTx.sku);
    setValue("bin", pendingRegularizationTx.bin);
    setValue("qty", String(pendingRegularizationTx.qty));
    setValue("comment", t("Régularisation GR fantôme — validation document existant", "Ghost GR regularization — validate existing document"));
  }, [isGrRegularization, pendingRegularizationTx, setValue, t]);
  // Expose setValue for testing/automation
  if (typeof window !== 'undefined') (window as any).__rhfSetValue = setValue;
  const [feedbackPanel, setFeedbackPanel] = useState<{ data: any } | null>(null);
  const [showGlossary, setShowGlossary] = useState(false);
  const [kpiLedgerConfirmed, setKpiLedgerConfirmed] = useState(false);

  const isDemo = runData?.isDemo ?? false;

  useEffect(() => {
    if (!isM5KpiStep || !m5KpiLedger?.kpiData) return;
    const d = m5KpiLedger.kpiData;
    setValue("annualConsumption", String(d.annualConsumption));
    setValue("averageStock", String(d.averageStock));
    setValue("ordersFulfilled", String(d.ordersFulfilled));
    setValue("totalOrders", String(d.totalOrders));
    setValue("operationalErrors", String(d.operationalErrors));
    setValue("totalOperations", String(d.totalOperations));
    setValue("avgLeadTimeDays", String(d.avgLeadTimeDays));
    setValue("stockValue", String(d.stockValue));
    if (isDemo) setKpiLedgerConfirmed(true);
  }, [isM5KpiStep, m5KpiLedger, setValue, isDemo]);

  useEffect(() => {
    if (scnCode !== "SCN-004") return;
    const stepLower = step?.toLowerCase() ?? "";
    if (stepLower === "putaway" || stepLower === "putaway_m1") {
      setValue("sku", "SKU-006");
      setValue("fromBin", "REC-01");
      setValue("toBin", "B-02-R1-L1");
      setValue("qty", "200");
    }
    if (stepLower === "cc") {
      setValue("sku", "SKU-006");
      setValue("bin", "B-02-R1-L1");
      setValue("physicalQty", "185");
    }
    if (stepLower === "adj") {
      setValue("sku", "SKU-006");
      setValue("bin", "B-02-R1-L1");
      setValue("qty", "-15");
      setValue("docRef", "ADJ-AUTO");
    }
  }, [scnCode, step, setValue]);

  useEffect(() => {
    if (scnCode !== "SCN-005" || !runData) return;
    const stepLower = step?.toLowerCase() ?? "";
    const seed = runData.scenario?.initialStateJson as {
      putawayTargets?: Array<{ sku: string; fromBin: string; toBin: string; qty: number }>;
      cycleCountTarget?: { sku: string; bin: string; variance: number };
    } | null | undefined;
    const targets = seed?.putawayTargets ?? [
      { sku: "SKU-004", fromBin: "REC-01", toBin: "B-01-R1-L1", qty: 30 },
      { sku: "SKU-005", fromBin: "REC-02", toBin: "B-01-R1-L2", qty: 60 },
    ];
    const inventory = (runData.inventory ?? {}) as Record<string, number>;
    const pendingPutaway = targets.find((t) => (inventory[`${t.sku}::${t.fromBin}`] ?? 0) > 0);

    if ((stepLower === "putaway" || stepLower === "putaway_m1") && pendingPutaway) {
      setValue("sku", pendingPutaway.sku);
      setValue("fromBin", pendingPutaway.fromBin);
      setValue("toBin", pendingPutaway.toBin);
      setValue("qty", String(pendingPutaway.qty));
    }
    if (stepLower === "cc") {
      const ccTarget = seed?.cycleCountTarget ?? { sku: "SKU-005", bin: "B-01-R1-L2", variance: -8 };
      const systemQty = inventory[`${ccTarget.sku}::${ccTarget.bin}`] ?? 0;
      setValue("sku", ccTarget.sku);
      setValue("bin", ccTarget.bin);
      if (systemQty > 0) {
        setValue("physicalQty", String(Math.max(0, systemQty + ccTarget.variance)));
      }
    }
    if (stepLower === "adj") {
      const ccTarget = seed?.cycleCountTarget ?? { sku: "SKU-005", bin: "B-01-R1-L2", variance: -8 };
      setValue("sku", ccTarget.sku);
      setValue("bin", ccTarget.bin);
      setValue("qty", String(ccTarget.variance));
      setValue("docRef", "ADJ-AUTO");
    }
  }, [scnCode, step, setValue, runData]);

  // FIFO_PICK: clear inherited PUTAWAY values — never preselect REC-01 or STOCKAGE destination
  useEffect(() => {
    if (step?.toLowerCase() !== "fifo_pick") return;
    reset({
      sku: "",
      bin: "",
      fromBin: "",
      toBin: "",
      qty: "",
      docRef: "",
      comment: "",
      lotNumber: "",
      physicalQty: "",
      systemQty: "",
      countedQty: "",
      minQty: "",
      maxQty: "",
      safetyStock: "",
      studentQty: "",
      varianceQty: "",
      justification: "",
      studentAnswer: "",
    });
  }, [step, runId, reset]);

  function handleSuccess(data: any) {
    // Reset all form fields (dropdowns, inputs) after successful submission
    reset({ sku: "", bin: "", fromBin: "", toBin: "", qty: "", docRef: "", comment: "", lotNumber: "", physicalQty: "", systemQty: "", countedQty: "", minQty: "", maxQty: "", safetyStock: "", studentQty: "", varianceQty: "", justification: "", studentAnswer: "" });
    refetch();
    if (data?.atpShortageDetected && data?.pedagogicalMessage) {
      toast.warning(`⚠ ${data.pedagogicalMessage}`, { duration: 8000 });
    }
    if (data?.demoWarning) {
      toast.warning(`⚠ ${t("Avertissement (mode démo)", "Warning (demo mode)")} : ${data.demoWarning}`, { duration: 4000 });
      setFeedbackPanel({ data });
    } else if (data?.complete === false) {
      // Partial submission (e.g. multi-SKU CC_COUNT or REPLENISH) — keep form visible so
      // the student can immediately enter the next SKU. Do NOT show the green success panel.
      const remaining = (data?.remainingSkus as string[] | undefined)?.join(", ");
      const reconProgress =
        data?.reconciledCount != null && data?.requiredCount != null
          ? ` (${data.reconciledCount}/${data.requiredCount})`
          : "";
      toast.info(
        remaining
          ? t(`Enregistré — SKU restants : ${remaining}${reconProgress}`, `Saved — remaining SKU(s): ${remaining}${reconProgress}`)
          : t("Enregistré — complétez les cibles restantes pour valider l'étape.", "Saved — complete remaining targets to finish this step."),
        { duration: 6000 },
      );
    } else {
      setFeedbackPanel({ data });
      toast.success(t("Étape validée — consultez le feedback ci-dessous", "Step validated — see feedback below"), { duration: 3000 });
    }
    return; // Don't auto-redirect — wait for user to click Continue
  }

  function handleSuccessLegacy(data: any) {
    if (data?.demoWarning) {
      toast.warning(`⚠ ${t("Avertissement (mode démo)", "Warning (demo mode)")} : ${data.demoWarning}`, { duration: 5000 });
    } else if (data?.feedback) {
      // KPI interpretation feedback (M4/M5)
      const icon = data.isCorrect ? "✅" : "⚠";
      toast[data.isCorrect ? "success" : "warning"](`${icon} ${t(cfg.titleFr, cfg.titleEn)} — ${data.feedback}`, { duration: 6000 });
    } else if (data?.suggestion) {
      // Replenishment suggestion (M3/M5) with accuracy feedback
      const s = data.suggestion;
      const studentQty = data.studentQty;
      if (studentQty !== undefined && s.suggestedQty > 0) {
        const diff = Math.abs(studentQty - s.suggestedQty);
        const accuracy = Math.round((1 - diff / s.suggestedQty) * 100);
        const icon = accuracy >= 80 ? "✅" : accuracy >= 50 ? "⚠" : "❌";
        toast[accuracy >= 80 ? "success" : "warning"](
          `${icon} ${t("Suggestion optimale", "Optimal suggestion")}: ${s.suggestedQty} ${t("unités", "units")} | ${t("Votre réponse", "Your answer")}: ${studentQty} | ${t("Précision", "Accuracy")}: ${Math.max(0, accuracy)}% — ${s.reason}`,
          { duration: 7000 }
        );
      } else {
        toast.success(`✅ ${t("Suggestion système", "System suggestion")}: ${s.suggestedQty} ${t("unités", "units")} — ${s.reason}`, { duration: 5000 });
      }
    } else if (data?.totalVariance !== undefined) {
      // CC_COUNT feedback with variance detail
      const v = data.totalVariance;
      if (v === 0) {
        toast.success(`✅ ${t("Comptage parfait — aucune variance détectée. Excellent travail !", "Perfect count — no variance detected. Excellent work!")}`, { duration: 4000 });
      } else {
        toast.warning(`⚠ ${t("Variance totale détectée", "Total variance detected")}: ${v > 0 ? "+" : ""}${v} ${t("unités. Passez à la réconciliation (CC_RECON) pour ajuster le stock.", "units. Proceed to reconciliation (CC_RECON) to adjust stock.")}`, { duration: 6000 });
      }
    } else if (data?.adjustmentsApplied !== undefined) {
      // CC_RECON feedback
      const n = data.adjustmentsApplied;
      toast.success(`✅ ${t("Réconciliation validée", "Reconciliation validated")} — ${n} ${t("ajustement(s) appliqué(s) au stock", "adjustment(s) applied to stock")}`, { duration: 4000 });
    } else {
      toast.success(`${t(cfg.titleFr, cfg.titleEn)} — ${t("Étape validée avec succès !", "Step validated successfully!")}`);
    }
    refetch();
    setTimeout(() => navigate(`/student/run/${runId}`), 1800);
  }

  function handleError(err: any) {
    toast.error(err.message ?? t("Erreur de validation", "Validation error"));
  }

  function onSubmit(values: FormValues) {
    const base = { runId: parseInt(runId) };
    const qty = values.qty ? Number(values.qty) : 0;
    const physicalQty = values.physicalQty ? Number(values.physicalQty) : 0;
    const stepLower = step?.toLowerCase() ?? "";

    // Standard field validations
    if (isGrRegularization && regularizeDocRef) {
      return postExistingGR.mutate({ runId: parseInt(runId), txDocRef: regularizeDocRef });
    }

    if (cfg.fields.includes("bin") && (!values.bin || values.bin === "")) {
      toast.error(t("Veuillez sélectionner un emplacement (Bin) avant de valider.", "Please select a bin location before validating."));
      return;
    }
    if (cfg.fields.includes("fromBin") && (!values.fromBin || values.fromBin === "")) {
      toast.error(t("Veuillez sélectionner le bin source (De).", "Please select the source bin (From)."));
      return;
    }
    if (cfg.fields.includes("toBin") && (!values.toBin || values.toBin === "")) {
      toast.error(t("Veuillez sélectionner le bin destination (Vers).", "Please select the destination bin (To)."));
      return;
    }
    if (cfg.fields.includes("sku") && (!values.sku || values.sku === "")) {
      toast.error(t("Veuillez sélectionner un SKU avant de valider.", "Please select a SKU before validating."));
      return;
    }
    if (cfg.fields.includes("docRef") && (!values.docRef || values.docRef.trim() === "")) {
      toast.error(t("Veuillez saisir un numéro de document avant de valider.", "Please enter a document number before validating."));
      return;
    }
    if (cfg.fields.includes("qty")) {
      const parsedQty = values.qty !== undefined && values.qty !== "" ? Number(values.qty) : NaN;
      if (isAdjStep) {
        if (Number.isNaN(parsedQty) || parsedQty === 0) {
          toast.error(
            t(
              "Saisissez un écart d'inventaire positif ou négatif. La valeur 0 n'est pas acceptée.",
              "Enter a positive or negative inventory variance. Zero is not accepted.",
            ),
          );
          return;
        }
      } else if (!values.qty || parsedQty <= 0) {
        toast.error(t("Veuillez saisir une quantité valide (> 0) avant de valider.", "Please enter a valid quantity (> 0) before validating."));
        return;
      }
    }
    if (cfg.fields.includes("studentAnswer") && (!values.studentAnswer || values.studentAnswer.trim().length < 5)) {
      toast.error(t("Veuillez saisir une réponse d'au moins 5 caractères.", "Please enter an answer of at least 5 characters."));
      return;
    }

    switch (stepLower) {
      // ── M1 ──────────────────────────────────────────────────────────────
      case "po": return submitPO.mutate({ ...base, sku: values.sku!, bin: values.bin!, qty, docRef: values.docRef!, comment: values.comment });
      case "po_corrective": return submitPO.mutate({ ...base, sku: values.sku!, bin: values.bin!, qty, docRef: values.docRef!, comment: values.comment });
      case "gr":
        // M2 GR does not require a prior PO; M1 GR does
        if (runData?.moduleId === 2) return submitGR_M2.mutate({ ...base, sku: values.sku!, bin: values.bin!, qty, docRef: values.docRef!, comment: values.comment });
        return submitGR.mutate({ ...base, sku: values.sku!, bin: values.bin!, qty, docRef: values.docRef!, comment: values.comment });
      case "gr_corrective":
        return submitGR.mutate({ ...base, sku: values.sku!, bin: values.bin!, qty, docRef: values.docRef!, comment: values.comment });
      case "putaway":
      case "putaway_m1":
        // M2 PUTAWAY uses m2.submitPUTAWAY; M1 uses transactions.submitPUTAWAY_M1
        if (runData?.moduleId === 2) {
          if (!values.lotNumber?.trim()) { toast.error(t("Veuillez saisir un numéro de lot.", "Please enter a lot number.")); return; }
          return submitPUTAWAY_M2.mutate({ ...base, sku: values.sku!, fromBin: values.fromBin!, toBin: values.toBin!, qty, docRef: values.docRef!, lotNumber: values.lotNumber!, comment: values.comment });
        }
        return submitPUTAWAY_M1.mutate({ ...base, sku: values.sku!, fromBin: values.fromBin!, toBin: values.toBin!, qty, docRef: values.docRef!, comment: values.comment });
      case "putaway_corrective":
        return submitPUTAWAY_M1.mutate({ ...base, sku: values.sku!, fromBin: values.fromBin!, toBin: values.toBin!, qty, docRef: values.docRef!, comment: values.comment });
      case "so": return submitSO.mutate({ ...base, sku: values.sku!, bin: values.bin!, qty, docRef: values.docRef!, comment: values.comment });
      case "picking_m1": return submitPICKING_M1.mutate({ ...base, sku: values.sku!, fromBin: values.fromBin!, toBin: values.toBin!, qty, docRef: values.docRef!, comment: values.comment });
      case "gi": return submitGI.mutate({ ...base, sku: values.sku!, bin: values.bin!, qty, docRef: values.docRef!, comment: values.comment });
      case "cc": return submitCC.mutate({ ...base, sku: values.sku!, bin: values.bin!, physicalQty });
      case "adj": return submitADJ.mutate({ ...base, sku: values.sku!, bin: values.bin!, qty, docRef: values.docRef ?? "ADJ-AUTO", comment: values.comment });
      case "compliance": return submitCompliance.mutate({ ...base });
      case "stock":
        toast.success(t("Stock disponible confirmé — étape auto-validée.", "Available stock confirmed — step auto-validated."));
        setTimeout(() => navigate(`/student/run/${runId}`), 800);
        return;

      // ── M2 ──────────────────────────────────────────────────────────────
      case "fifo_pick":
        if (!values.lotNumber?.trim()) { toast.error(t("Veuillez saisir un numéro de lot.", "Please enter a lot number.")); return; }
        return submitFifoPick.mutate({ ...base, sku: values.sku!, fromBin: values.fromBin!, toBin: values.toBin!, qty, lotNumber: values.lotNumber! });
      case "stock_accuracy":
        return submitStockAccuracy.mutate({ ...base, sku: values.sku!, systemQty: Number(values.systemQty ?? 0), countedQty: Number(values.countedQty ?? 0) });
      case "compliance_adv":
        return submitComplianceAdv.mutate({ ...base });

      // ── M3 ──────────────────────────────────────────────────────────────
      case "cc_list": {
        const requiredSkus =
          m3CycleCountTargets.length > 0
            ? m3CycleCountTargets.map((target) => target.sku)
            : values.sku
              ? [values.sku]
              : [];
        if (requiredSkus.length === 0) {
          toast.error(t("Veuillez sélectionner au moins un SKU.", "Please select at least one SKU."));
          return;
        }
        return submitCcList.mutate({ ...base, skus: requiredSkus });
      }
      case "cc_count":
        return submitCcCount.mutate({ ...base, counts: [{ sku: values.sku!, bin: values.bin!, systemQty: Number(values.systemQty ?? 0), countedQty: Number(values.countedQty ?? 0) }] });
      case "cc_recon": {
        const pendingTarget =
          m3CycleCountTargets.find((t) => t.sku === values.sku) ??
          ccReconPendingTargets[0];
        const sku = values.sku || pendingTarget?.sku;
        const bin = values.bin || pendingTarget?.bin || "";
        if (!sku) {
          toast.error(t("Veuillez sélectionner un SKU à réconcilier.", "Please select a SKU to reconcile."));
          return;
        }
        const statusRow = ccReconProgress?.statuses.find((s) => s.sku === sku);
        const varianceQty =
          values.varianceQty !== undefined && values.varianceQty !== ""
            ? Number(values.varianceQty)
            : (statusRow?.varianceQty ?? Number(values.varianceQty ?? 0));
        const justification = (values.justification ?? "").trim();
        if (varianceQty !== 0 && Math.abs(varianceQty) >= m3VarianceThreshold && justification.length < 5) {
          toast.error(
            t(
              `Variance ≥ ${m3VarianceThreshold} unités — saisissez une justification d'au moins 5 caractères.`,
              `Variance ≥ ${m3VarianceThreshold} units — enter a justification of at least 5 characters.`,
            ),
          );
          return;
        }
        return submitCcRecon.mutate({
          ...base,
          adjustments: [{
            sku,
            bin,
            varianceQty,
            justification,
          }],
        });
      }
      case "replenish":
        return submitReplenishM3.mutate({ ...base, sku: values.sku!, systemQty: Number(values.systemQty ?? 0), minQty: Number(values.minQty ?? 0), maxQty: Number(values.maxQty ?? 0), safetyStock: Number(values.safetyStock ?? 0), studentQty: Number(values.studentQty ?? 0) });
      case "compliance_m3":
        return submitComplianceM3.mutate({ ...base });

      // ── M4 ──────────────────────────────────────────────────────────────
      case "kpi_data":
        return submitKpiData.mutate({ ...base });
      case "kpi_rotation":
        return submitKpiRotation.mutate({ ...base, studentAnswer: values.studentAnswer! });
      case "kpi_service":
        return submitKpiService.mutate({ ...base, studentAnswer: values.studentAnswer! });
      case "kpi_diagnostic":
        return submitKpiDiagnostic.mutate({ ...base, studentAnswer: values.studentAnswer! });
      case "compliance_m4":
        return submitComplianceM4.mutate({ ...base });

      // ── M5 ──────────────────────────────────────────────────────────────
      case "m5_reception":
        return submitM5Reception.mutate({ ...base, sku: values.sku!, qty, docRef: values.docRef! });
      case "m5_putaway":
        if (!values.lotNumber?.trim()) { toast.error(t("Veuillez saisir un numéro de lot.", "Please enter a lot number.")); return; }
        return submitM5Putaway.mutate({ ...base, sku: values.sku!, fromBin: values.fromBin!, toBin: values.toBin!, qty, lotNumber: values.lotNumber! });
      case "m5_cycle_count":
        return submitM5CycleCount.mutate({ ...base, sku: values.sku!, bin: values.bin!, systemQty: Number(values.systemQty ?? 0), countedQty: Number(values.countedQty ?? 0) });
      case "m5_adj": {
        const varianceQty = Number(values.varianceQty ?? 0);
        const justification = (values.justification ?? "").trim();
        if (varianceQty === 0) {
          toast.error(t("La variance doit être non nulle.", "Variance must be non-zero."));
          return;
        }
        if (justification.length < 10) {
          toast.error(t("Justification requise (min. 10 caractères).", "Justification required (min. 10 characters)."));
          return;
        }
        return submitM5Adj.mutate({ ...base, sku: values.sku!, bin: values.bin!, varianceQty, justification });
      }
      case "m5_replenish":
        return submitM5Replenish.mutate({ ...base, sku: values.sku!, systemQty: Number(values.systemQty ?? 0), minQty: Number(values.minQty ?? 0), maxQty: Number(values.maxQty ?? 0), safetyStock: Number(values.safetyStock ?? 0), studentQty: Number(values.studentQty ?? 0) });
      case "m5_kpi":
        if (!isDemo && !kpiLedgerConfirmed) {
          toast.error(t("Confirmez que les KPI sont ancrés au moniteur d'exécution.", "Confirm KPI values are anchored to the run monitor."));
          return;
        }
        return submitM5Kpi.mutate({
          ...base,
          confirmedFromLedger: kpiLedgerConfirmed,
          kpiData: {
            annualConsumption: Number(values.annualConsumption ?? 0),
            averageStock: Number(values.averageStock ?? 0),
            ordersFulfilled: Number(values.ordersFulfilled ?? 0),
            totalOrders: Number(values.totalOrders ?? 0),
            operationalErrors: Number(values.operationalErrors ?? 0),
            totalOperations: Number(values.totalOperations ?? 0),
            avgLeadTimeDays: Number(values.avgLeadTimeDays ?? 0),
            stockValue: Number(values.stockValue ?? 0),
          },
        });
      case "m5_decision":
        return submitM5Decision.mutate({ ...base, studentDecision: values.studentAnswer! });
      case "compliance_m5":
        return submitComplianceM5.mutate({ ...base });
    }
  }

  const isAnyPending = [
    submitPO, submitGR, postExistingGR, submitPUTAWAY_M1, submitSO, submitPICKING_M1, submitGI, submitCC, submitADJ, submitCompliance,
    submitFifoPick, submitStockAccuracy, submitComplianceAdv,
    submitCcList, submitCcCount, submitCcRecon, submitReplenishM3, submitComplianceM3,
    submitKpiData, submitKpiRotation, submitKpiService, submitKpiDiagnostic, submitComplianceM4,
    submitM5Reception, submitM5Putaway, submitM5CycleCount, submitM5Adj, submitM5Replenish, submitM5Kpi, submitM5Decision, submitComplianceM5,
  ].some(m => m.isPending);

  // Hooks must run unconditionally — never after an early return (React #310).
  const nextStep = (runData?.nextStep as any)?.code;
  const atpShortage = (runData as { atpShortage?: { active: boolean } | null })?.atpShortage;
  const isBlockedByScn003Shortage =
    !!atpShortage?.active && (cfg.code === "PICKING_M1" || cfg.code === "GI");
  const isCurrentStep = nextStep === cfg.code;
  const isCompleted = runData?.completedSteps.includes(cfg.code as any);
  // M4 analytical recovery: allow re-submit of KPI answers before COMPLIANCE_M4
  // so incorrect interpretations (session 000658 class) can be corrected on the same run.
  const m4RecoverableCodes = ["KPI_DATA", "KPI_ROTATION", "KPI_SERVICE", "KPI_DIAGNOSTIC"];
  const canRecoverM4Answer =
    (runData?.moduleId === 4 || runData?.scenario?.moduleId === 4) &&
    !!isCompleted &&
    m4RecoverableCodes.includes(String(cfg.code)) &&
    !(runData?.completedSteps as string[] | undefined)?.includes("COMPLIANCE_M4");
  const isLocked =
    isScn007FifoNotInScenario ||
    isBlockedByScn003Shortage ||
    (!isDemo && !isCurrentStep && !isCompleted);
  const inventory: Record<string, number> = runData?.inventory ?? {};
  const selectedSku = watch("sku") ?? "";
  const selectedBin = watch("bin") ?? "";
  const selectedFromBin = watch("fromBin") ?? "";
  const selectedToBin = watch("toBin") ?? "";
  const selectedCcReconTarget = useMemo(() => {
    if (step?.toLowerCase() !== "cc_recon") return null;
    const sku = selectedSku || ccReconPendingTargets[0]?.sku || "";
    return m3CycleCountTargets.find((t) => t.sku === sku) ?? null;
  }, [step, selectedSku, ccReconPendingTargets, m3CycleCountTargets]);
  const selectedCcReconVariance = useMemo(() => {
    if (!selectedCcReconTarget) return null;
    const row = ccReconProgress?.statuses.find((s) => s.sku === selectedCcReconTarget.sku);
    return row?.varianceQty ?? (selectedCcReconTarget.physicalQty - selectedCcReconTarget.systemQty);
  }, [selectedCcReconTarget, ccReconProgress]);

  useEffect(() => {
    if (step?.toLowerCase() !== "cc_recon") return;
    if (ccReconPendingTargets.length === 0) return;
    const stillPending = selectedSku && ccReconPendingTargets.some((t) => t.sku === selectedSku);
    if (!stillPending) {
      const next = ccReconPendingTargets[0];
      setValue("sku", next.sku);
      if (next.bin) setValue("bin", next.bin);
      const variance = ccReconProgress?.statuses.find((s) => s.sku === next.sku)?.varianceQty
        ?? (next.physicalQty - next.systemQty);
      setValue("varianceQty", String(variance));
    }
  }, [step, ccReconPendingTargets, selectedSku, ccReconProgress, setValue]);

  useEffect(() => {
    if (step?.toLowerCase() !== "cc_recon" || !selectedCcReconTarget) return;
    if (selectedCcReconTarget.bin) setValue("bin", selectedCcReconTarget.bin);
    if (selectedCcReconVariance != null) setValue("varianceQty", String(selectedCcReconVariance));
  }, [step, selectedCcReconTarget, selectedCcReconVariance, setValue]);

  const availableStock = selectedSku && selectedBin ? (inventory[`${selectedSku}::${selectedBin}`] ?? 0) : null;
  const availableStockFromBin = selectedSku && selectedFromBin ? (inventory[`${selectedSku}::${selectedFromBin}`] ?? 0) : null;
  const isOutOfSequence = isDemo && !isCurrentStep && !isCompleted;
  const ccReconFormComplete =
    step?.toLowerCase() === "cc_recon" &&
    !!ccReconProgress &&
    ccReconProgress.pendingSkus.length === 0 &&
    ccReconProgress.requiredCount > 0;

  const isFifoPickStep = step?.toLowerCase() === "fifo_pick";
  const fromBinOptions = useMemo(() => {
    if (!bins) return [];
    if (!isFifoPickStep) return bins;
    return bins.filter((b: any) => {
      const z = String(b.zone ?? "").toUpperCase().normalize("NFD").replace(/\p{M}/gu, "");
      return z === "STOCKAGE";
    });
  }, [bins, isFifoPickStep]);
  const toBinOptions = useMemo(() => {
    if (!bins) return [];
    if (!isFifoPickStep) return bins;
    return bins.filter((b: any) => {
      const z = String(b.zone ?? "").toUpperCase().normalize("NFD").replace(/\p{M}/gu, "");
      return z === "EXPEDITION";
    });
  }, [bins, isFifoPickStep]);

  const fifoLotRows = useMemo(() => {
    if (!isFifoPickStep || !runData) return [];
    const seed = runData.scenario?.initialStateJson as {
      lots?: Array<{ lotNumber: string; receivedAt: string; qty?: number }>;
      preloadedTransactions?: Array<{ docType: string; sku?: string; bin?: string; qty?: number; posted?: boolean; docRef?: string }>;
    } | null;
    const lots = [...(seed?.lots ?? [])].sort(
      (a, b) => new Date(a.receivedAt).getTime() - new Date(b.receivedAt).getTime()
    );
    const stockageBins = new Set(["B-01-R1-L1", "B-01-R1-L2", "B-02-R1-L1", "TRANSIT-01"]);
    const storageGrs = (seed?.preloadedTransactions ?? [])
      .filter((t) => t.docType === "GR" && t.posted && t.bin && stockageBins.has(t.bin))
      .sort((a, b) => String(a.docRef ?? a.bin).localeCompare(String(b.docRef ?? b.bin)));
    const inv = (runData.inventory ?? {}) as Record<string, number>;
    const rows: Array<{ lotNumber: string; bin: string; qty: number }> = [];
    storageGrs.forEach((gr, i) => {
      const lot = lots[i];
      if (!lot || !gr.bin || !gr.sku) return;
      const qty = inv[`${gr.sku}::${gr.bin}`] ?? 0;
      if (qty <= 0) return;
      rows.push({ lotNumber: lot.lotNumber, bin: gr.bin, qty });
    });
    for (const lot of lots) {
      if (rows.some((r) => r.lotNumber === lot.lotNumber)) continue;
      for (const [key, qty] of Object.entries(inv)) {
        if (qty <= 0) continue;
        const [, bin] = key.split("::");
        if (!bin || !stockageBins.has(bin)) continue;
        if (rows.some((r) => r.bin === bin)) continue;
        rows.push({ lotNumber: lot.lotNumber, bin, qty });
        break;
      }
    }
    const lotOrder = new Map(lots.map((l, i) => [l.lotNumber, i]));
    return rows
      .filter((r, idx, arr) => arr.findIndex((x) => x.lotNumber === r.lotNumber && x.bin === r.bin) === idx)
      .sort((a, b) => (lotOrder.get(a.lotNumber) ?? 99) - (lotOrder.get(b.lotNumber) ?? 99));
  }, [isFifoPickStep, runData]);

  if (isLoading) {
    return (
      <FioriShell title={t(cfg.titleFr, cfg.titleEn)} breadcrumbs={[
        { label: t("Scénarios", "Scenarios"), href: "/student/scenarios" },
        { label: "Mission Control", href: `/student/run/${runId}` },
        { label: t(cfg.titleFr, cfg.titleEn) }
      ]}>
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </FioriShell>
    );
  }

  // Determine if this is a compliance/auto step (no real form)
  const isAutoStep = ["stock", "compliance", "compliance_adv", "compliance_m3", "compliance_m4", "compliance_m5", "kpi_data"].includes(step?.toLowerCase() ?? "");

  return (
    <FioriShell
      title={`${useAnalyticalChrome ? t("Analyse", "Analysis") : t("Transaction", "Transaction")}: ${t(displayCfg.titleFr, displayCfg.titleEn)} (${cfg.code}) | ${t(displayCfg.etapeFr, displayCfg.etapeEn)}`}
      breadcrumbs={[
        { label: t("Scénarios", "Scenarios"), href: "/student/scenarios" },
        { label: "Mission Control", href: `/student/run/${runId}` },
        { label: t(cfg.titleFr, cfg.titleEn) },
      ]}
    >
      <div className="max-w-2xl mx-auto">
        {/* Demo Mode Banner */}
        {isDemo && (
          <div className="bg-indigo-950 border border-indigo-700 rounded-md px-4 py-2.5 mb-4 flex items-center gap-2">
            <FlaskConical size={14} className="text-indigo-300 flex-shrink-0" />
            <p className="text-indigo-200 text-xs font-semibold">
              🔵 {t("MODE DÉMONSTRATION — Aucun score enregistré · Progression libre activée", "DEMO MODE — No score recorded · Free progression enabled")}
            </p>
          </div>
        )}

        {/* ── FEEDBACK PANEL (shown after step submission) ──────────────────── */}
        {feedbackPanel && (
          <div className="mb-6 rounded-xl border-2 border-green-500 bg-green-50 dark:bg-green-950/30 overflow-hidden">
            {/* Header */}
            <div className="bg-green-500 px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-white" />
                <span className="text-white font-bold text-sm">
                  {t("Étape validée avec succès !", "Step validated successfully!")}
                </span>
              </div>
              <span className="text-green-100 text-xs font-mono">{cfg.code} ✓</span>
            </div>

            {/* Result summary */}
            {feedbackPanel.data?.suggestion && (
              <div className="px-5 py-3 border-b border-green-200 dark:border-green-800">
                <p className="text-xs font-semibold text-green-800 dark:text-green-300 mb-1">
                  {t("Résultat réapprovisionnement", "Replenishment result")}
                </p>
                {(() => {
                  const s = feedbackPanel.data.suggestion;
                  const studentQty = feedbackPanel.data.studentQty;
                  const diff = studentQty !== undefined ? Math.abs(studentQty - s.suggestedQty) : null;
                  const accuracy = diff !== null && s.suggestedQty > 0 ? Math.max(0, Math.round((1 - diff / s.suggestedQty) * 100)) : null;
                  return (
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      <div className="bg-white dark:bg-green-900/50 rounded-md p-2 text-center">
                        <p className="text-xs text-muted-foreground">{t("Votre réponse", "Your answer")}</p>
                        <p className="font-bold text-lg text-foreground">{studentQty ?? "—"}</p>
                      </div>
                      <div className="bg-white dark:bg-green-900/50 rounded-md p-2 text-center">
                        <p className="text-xs text-muted-foreground">{t("Suggestion système", "System suggestion")}</p>
                        <p className="font-bold text-lg text-green-700 dark:text-green-300">{s.suggestedQty}</p>
                      </div>
                      <div className="bg-white dark:bg-green-900/50 rounded-md p-2 text-center">
                        <p className="text-xs text-muted-foreground">{t("Précision", "Accuracy")}</p>
                        <p className={`font-bold text-lg ${accuracy !== null && accuracy >= 80 ? "text-green-600" : "text-amber-600"}`}>
                          {accuracy !== null ? `${accuracy}%` : "—"}
                        </p>
                      </div>
                    </div>
                  );
                })()}
                <p className="text-xs text-muted-foreground mt-2 italic">{feedbackPanel.data.suggestion.reason}</p>
              </div>
            )}
            {feedbackPanel.data?.totalVariance !== undefined && (
              <div className="px-5 py-3 border-b border-green-200 dark:border-green-800">
                <p className="text-xs font-semibold text-green-800 dark:text-green-300 mb-1">{t("Résultat inventaire", "Inventory result")}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className={`rounded-md px-4 py-2 text-center ${feedbackPanel.data.totalVariance === 0 ? "bg-green-100 dark:bg-green-900/50" : "bg-amber-100 dark:bg-amber-900/30"}`}>
                    <p className="text-xs text-muted-foreground">{t("Variance totale", "Total variance")}</p>
                    <p className={`font-bold text-xl ${feedbackPanel.data.totalVariance === 0 ? "text-green-700" : "text-amber-700"}`}>
                      {feedbackPanel.data.totalVariance === 0 ? "0 ✔" : `${feedbackPanel.data.totalVariance > 0 ? "+" : ""}${feedbackPanel.data.totalVariance}`}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {feedbackPanel.data.totalVariance === 0
                      ? t("Comptage parfait ! Aucun ajustement nécessaire.", "Perfect count! No adjustment needed.")
                      : t("Des variances ont été détectées. Passez à CC_RECON pour ajuster le stock.", "Variances detected. Proceed to CC_RECON to adjust stock.")}
                  </p>
                </div>
              </div>
            )}
            {feedbackPanel.data?.feedback && (
              <div className="px-5 py-3 border-b border-green-200 dark:border-green-800">
                <p className="text-xs font-semibold text-green-800 dark:text-green-300 mb-1">{t("Interprétation KPI", "KPI Interpretation")}</p>
                <p className={`text-sm font-medium mt-1 ${feedbackPanel.data.isCorrect ? "text-green-700" : "text-amber-700"}`}>
                  {feedbackPanel.data.isCorrect ? "✅" : "⚠"} {feedbackPanel.data.feedback}
                </p>
              </div>
            )}

            {/* Pedagogical deep dive */}
            <div className="px-5 py-4">
              <p className="text-xs font-bold text-green-800 dark:text-green-300 uppercase tracking-wide mb-3">
                📚 {t("Explication pédagogique", "Pedagogical explanation")}
              </p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1">{t("Pourquoi cette étape ?", "Why this step?")}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{t(displayCfg.pedagogicalDeep.whyFr, displayCfg.pedagogicalDeep.whyEn)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1">{t("Dans SAP réel", "In real SAP")}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{t(displayCfg.pedagogicalDeep.realSAPFr, displayCfg.pedagogicalDeep.realSAPEn)}</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/30 rounded-md p-3 border border-amber-200 dark:border-amber-800">
                  <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-1">
                    ⚠ {t("Erreur fréquente en production", "Common production error")}
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">{t(displayCfg.pedagogicalDeep.realErrorFr, displayCfg.pedagogicalDeep.realErrorEn)}</p>
                </div>
              </div>
            </div>

            {/* Continue button */}
            <div className="px-5 pb-4 flex gap-3">
              <button
                onClick={() => navigate(`/student/run/${runId}`)}
                className="flex-1 py-2.5 rounded-md bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-colors"
              >
                {t("→ Continuer la simulation", "→ Continue simulation")}
              </button>
              <button
                onClick={() => setFeedbackPanel(null)}
                className="px-4 py-2.5 rounded-md border border-green-300 text-green-700 dark:text-green-300 font-medium text-sm hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                {t("Rester ici", "Stay here")}
              </button>
            </div>
          </div>
        )}

        {/* Transaction Header */}
        <div className={`rounded-t-md px-5 py-3 flex items-center justify-between ${isDemo ? "bg-indigo-900" : "bg-primary"}`}>
          <div>
            <p className="text-white/60 text-xs">
              {getStepChromeCodeLabel(runData?.moduleId, step, language)}
            </p>
            <p className="text-white font-bold text-sm">{cfg.tCode} — {t(displayCfg.titleFr, displayCfg.titleEn)}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowGlossary(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
              title={t("Ouvrir le glossaire logistique", "Open logistics glossary")}
            >
              <BookOpen size={12} />
              {t("Aide", "Help")}
            </button>
            <div className="text-right">
              <p className="text-white/60 text-xs">{t("Statut", "Status")}</p>
              {isCompleted ? (
                <span className="badge-valid">✓ {t("VALIDÉ", "DONE")}</span>
              ) : isLocked ? (
                <span className="badge-blocked">🔒 {t("VERROUILLÉ", "LOCKED")}</span>
              ) : isDemo && isOutOfSequence ? (
                <span className="text-[10px] bg-purple-700 text-white px-2 py-0.5 rounded-full font-semibold">⚠ {t("HORS SÉQUENCE", "OUT OF SEQUENCE")}</span>
              ) : (
                <span className="badge-pending">⏳ {t("EN COURS", "IN PROGRESS")}</span>
              )}
            </div>
          </div>
        </div>
        {/* Glossary Modal */}
        {showGlossary && (
          <GlossaryPage modal onClose={() => setShowGlossary(false)} />
        )}

        {/* Locked State */}
        {isLocked && (
          <div className="bg-card border border-border border-t-0 rounded-b-md p-6">
            <div className="alert-blocked flex items-start gap-3 mb-4">
              <Lock size={16} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold mb-0.5">{t("Étape actuellement verrouillée", "Step currently locked")}</p>
                <p className="text-xs">
                  {isScn007FifoNotInScenario
                    ? t(
                        "L'étape FIFO_PICK ne fait pas partie du SCN-007. Ce scénario porte uniquement sur la capacité d'emplacement (PUTAWAY 500 + 100). Le FIFO est enseigné dans le SCN-008.",
                        "FIFO_PICK is not part of SCN-007. This scenario covers bin capacity only (PUTAWAY 500 + 100). FIFO is taught in SCN-008.",
                      )
                    : isBlockedByScn003Shortage
                    ? (runData as { atpShortage?: { stockAvailable: number; soDemand: number; deficit: number } })?.atpShortage
                      ? t(
                          `Stock insuffisant détecté: ${(runData as any).atpShortage.stockAvailable} unités disponibles en STOCKAGE pour une commande de ${(runData as any).atpShortage.soDemand} unités. Créez une PO corrective de ${(runData as any).atpShortage.deficit} unités, postez la GR, puis rangez le stock avant le Picking/GI.`,
                          `Insufficient stock detected: ${(runData as any).atpShortage.stockAvailable} units available in STOCKAGE for an order of ${(runData as any).atpShortage.soDemand} units. Create a corrective PO for ${(runData as any).atpShortage.deficit} units, post the GR, then put away stock before Picking/GI.`,
                        )
                      : t("Réapprovisionnement obligatoire avant Picking/GI.", "Replenishment required before Picking/GI.")
                    : t("Complétez l'étape précédente avant d'accéder à cette transaction.", "Complete the previous step before accessing this transaction.")}
                </p>
              </div>
            </div>
            <button onClick={() => navigate(`/student/run/${runId}`)}
              className="flex items-center gap-2 text-xs text-primary hover:underline">
              <ArrowLeft size={13} /> {t("Retour au Mission Control", "Back to Mission Control")}
            </button>
          </div>
        )}

        {/* Completed State — skip when M4 recovery re-opens the form */}
        {isCompleted && !canRecoverM4Answer && (
          <div className="bg-card border border-border border-t-0 rounded-b-md p-6">
            <div className="alert-compliant flex items-start gap-3 mb-4">
              <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold mb-0.5">{t("Étape validée", "Step validated")}</p>
                <p className="text-xs">{t("Cette transaction a été complétée avec succès. Retournez au tableau de contrôle.", "This transaction was completed successfully. Return to the control panel.")}</p>
              </div>
            </div>
            <BackendTransparencyPanel runData={runData} />
            <PedagogicalPanel cfg={displayCfg} isDemo={isDemo} />
            <button onClick={() => navigate(`/student/run/${runId}`)}
              className="flex items-center gap-2 text-xs text-primary hover:underline mt-4">
              <ArrowLeft size={13} /> {t("Retour au Mission Control", "Back to Mission Control")}
            </button>
          </div>
        )}

        {/* Active Form */}
        {(isCurrentStep || (isDemo && !isCompleted) || canRecoverM4Answer) && !isLocked && (
          <div className="bg-card border border-border border-t-0 rounded-b-md">
            {canRecoverM4Answer && (
              <div className="bg-sky-50 dark:bg-sky-950/30 border-b border-sky-200 dark:border-sky-800 px-4 py-3 flex items-start gap-2">
                <AlertTriangle size={14} className="text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-sky-800 dark:text-sky-200">
                  <strong>{t("Correction autorisée :", "Correction allowed:")}</strong>{" "}
                  {t(
                    "Vous pouvez réviser votre interprétation avant de valider la conformité M4. La nouvelle réponse remplace la précédente.",
                    "You may revise your interpretation before M4 compliance validation. The new answer replaces the previous one.",
                  )}
                </p>
              </div>
            )}
            {/* Out-of-sequence warning */}
            {isDemo && isOutOfSequence && (
              <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800 px-4 py-3 flex items-start gap-2">
                <AlertTriangle size={14} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  <strong>{t("Avertissement pédagogique :", "Pedagogical warning:")}</strong>{" "}
                  {t(
                    "Cette étape est hors séquence recommandée. En mode évaluation, elle serait bloquée et pénalisée.",
                    "This step is out of the recommended sequence. In evaluation mode, it would be blocked and penalized."
                  )}
                </p>
              </div>
            )}

            {isGrRegularization && pendingRegularizationTx && (
              <div className="mx-4 mt-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 rounded-md p-3">
                <p className="text-[10px] font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider mb-1">
                  {t("Régularisation document existant", "Existing document regularization")}
                </p>
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  {t(
                    `Document ${pendingRegularizationTx.docRef} détecté en PENDING dans le moniteur. Validez la posting MIGO de ce document — ne créez pas une nouvelle GR.`,
                    `Document ${pendingRegularizationTx.docRef} detected as PENDING in the monitor. Validate MIGO posting for this document — do not create a new GR.`
                  )}
                </p>
              </div>
            )}

            {/* Objective Panel — hidden for analytical answer steps (integrated in AnalyticalResponseField) */}
            {!isAnalyticalStep && (
            <div className="mx-4 mt-4 bg-primary/5 border border-primary/20 rounded-md p-3">
              <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">
                <Info size={10} className="inline mr-1" />{t("Objectif pédagogique", "Pedagogical objective")}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isGrRegularization
                  ? t(
                      "Poster la réception fantôme existante pour activer le stock en zone RÉCEPTION.",
                      "Post the existing ghost receipt to activate stock in the RECEPTION zone."
                    )
                  : t(displayCfg.objectiveFr, displayCfg.objectiveEn)}
              </p>
            </div>
            )}

            {/* Context Panel: Stock for evaluation mode */}
            {(["gi","cc","so","putaway","putaway_m1","picking_m1","fifo_pick","m5_putaway","m5_cycle_count"].includes(step?.toLowerCase() ?? "")) && !isDemo && (() => {
              const inv = runData?.inventory ?? {};
              const RECEPTION_BINS_UI  = ["REC-01", "REC-02"];
              const STOCKAGE_BINS_UI   = Object.keys(inv).map(k => k.split("::")[1]).filter(b => b && !RECEPTION_BINS_UI.includes(b) && !b.startsWith("EXP") && !b.startsWith("PICK") && !b.startsWith("RES"));
              const EXPEDITION_BINS_UI = ["EXP-01", "EXP-02"];
              const sumZone = (bins: string[]) =>
                Object.entries(inv)
                  .filter(([k, q]) => bins.some(b => k.endsWith(`::${b}`)) && (q as number) > 0)
                  .reduce((s, [, q]) => s + (q as number), 0);
              const sumAll = (filterFn: (bin: string) => boolean) =>
                Object.entries(inv)
                  .filter(([k, q]) => filterFn(k.split("::")[1] ?? "") && (q as number) > 0)
                  .reduce((s, [, q]) => s + (q as number), 0);
              const stockageTotal = sumAll(b => !RECEPTION_BINS_UI.includes(b) && !b.startsWith("EXP") && !b.startsWith("PICK") && !b.startsWith("RES"));
              const expeditionTotal = sumZone(EXPEDITION_BINS_UI);
              const receptionTotal = sumZone(RECEPTION_BINS_UI);
              const grandTotal = Object.entries(inv).filter(([, q]) => (q as number) > 0).reduce((s, [, q]) => s + (q as number), 0);
              const hasStock = grandTotal > 0;
              return (
                <div className="mx-4 mt-4 bg-primary/5 border border-primary/20 rounded-md p-3">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2">
                    📊 {t("Stock actuel par zone", "Current stock by zone")}
                  </p>
                  {!hasStock ? (
                    <p className="text-[10px] text-destructive">
                      ⚠ {t("Aucun stock disponible — vérifiez que la GR a été validée.", "No stock available — verify that GR was validated.")}
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {/* Zone summary table */}
                      <div className="grid grid-cols-2 gap-x-3 text-[10px] font-mono border border-border rounded overflow-hidden">
                        {receptionTotal > 0 && (
                          <>
                            <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-semibold">{t("RÉCEPTION", "RECEPTION")}</span>
                            <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/30 text-right text-blue-700 dark:text-blue-300">{receptionTotal} {t("u.", "u.")}</span>
                          </>
                        )}
                        {stockageTotal > 0 && (
                          <>
                            <span className="px-2 py-0.5 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 font-semibold">{t("STOCKAGE", "STORAGE")}</span>
                            <span className="px-2 py-0.5 bg-green-50 dark:bg-green-950/30 text-right text-green-700 dark:text-green-300">{stockageTotal} {t("u.", "u.")}</span>
                          </>
                        )}
                        {expeditionTotal > 0 && (
                          <>
                            <span className="px-2 py-0.5 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 font-semibold">{t("EXPÉDITION", "DISPATCH")}</span>
                            <span className="px-2 py-0.5 bg-purple-50 dark:bg-purple-950/30 text-right text-purple-700 dark:text-purple-300">{expeditionTotal} {t("u.", "u.")}</span>
                          </>
                        )}
                        <span className="px-2 py-0.5 bg-muted font-bold border-t border-border">{t("TOTAL", "TOTAL")}</span>
                        <span className="px-2 py-0.5 bg-muted font-bold border-t border-border text-right">{grandTotal} {t("u.", "u.")}</span>
                      </div>
                      {/* Per-bin detail */}
                      <details className="text-[10px]">
                        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">{t("Détail par emplacement", "Detail by location")}</summary>
                        <div className="mt-1 space-y-0.5 pl-2">
                          {Object.entries(inv).filter(([, qty]) => (qty as number) > 0).map(([key, qty]) => {
                            const [sku, bin] = key.split("::");
                            return (
                              <p key={key} className="font-mono">
                                <span className="text-primary font-semibold">{sku}</span> @ <span className="text-green-600 dark:text-green-400">{bin}</span> — <strong className="text-foreground">{qty as number} {t("u.", "u.")}</strong>
                              </p>
                            );
                          })}
                        </div>
                      </details>
                    </div>
                  )}
                </div>
              );
            })()}

            <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
              {/* ── Compliance / Auto steps ─────────────────────────────── */}
              {step?.toLowerCase() === "compliance" && (
                <div>
                  <div className={`rounded-md p-4 mb-4 ${
                    runData?.compliance.compliant
                      ? "bg-green-50 dark:bg-green-950/30"
                      : isDemo ? "bg-amber-50 dark:bg-amber-950/30" : "bg-red-50 dark:bg-red-950/30"
                  }`}>
                    <p className={`font-bold text-sm mb-2 ${
                      runData?.compliance.compliant
                        ? "text-green-700 dark:text-green-400"
                        : isDemo ? "text-amber-700 dark:text-amber-400" : "text-destructive"
                    }`}>
                      {runData?.compliance.compliant
                        ? t("✅ Système conforme — Prêt pour clôture", "✅ System compliant — Ready for closing")
                        : isDemo
                        ? t("⚠ Non conforme (démo) — Clôture autorisée en mode démonstration", "⚠ Non-compliant (demo) — Closing allowed in demo mode")
                        : t("🔴 Système non conforme — Résoudre les problèmes", "🔴 System non-compliant — Resolve issues")}
                    </p>
                    {runData?.compliance.issuesFr?.map((issue: string, i: number) => (
                      <p key={i} className={`text-xs ${isDemo ? "text-amber-700 dark:text-amber-400" : "text-destructive"}`}>• {issue}</p>
                    ))}
                  </div>
                  {!runData?.compliance.compliant && !isDemo && (
                    <div className="space-y-2 mb-4">
                      <div className="alert-blocked flex items-start gap-2">
                        <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                        <p className="text-xs">{t("Résolvez tous les problèmes de conformité avant de clôturer le module.", "Resolve all compliance issues before closing the module.")}</p>
                      </div>
                      {/* Show actionable resolution hints per issue */}
                      {runData?.compliance.issuesFr?.some((i: string) => i.includes('non postée')) && (
                        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-3 text-xs">
                          <p className="font-semibold text-amber-800 dark:text-amber-300 mb-1">💡 {t("Comment résoudre : transactions non postées", "How to resolve: unposted transactions")}</p>
                          <p className="text-amber-700 dark:text-amber-400">{t("Retournez au Mission Control, identifiez la GR PENDING dans le moniteur, puis cliquez « Régulariser le document (MIGO) » pour poster la réception existante.", "Return to Mission Control, identify the PENDING GR in the monitor, then click « Regularize document (MIGO) » to post the existing receipt.")}</p>
                          <button
                            type="button"
                            onClick={() => navigate(`/student/run/${runId}`)}
                            className="mt-2 text-amber-800 dark:text-amber-300 underline text-xs font-semibold"
                          >
                            ← {t("Retour au Mission Control", "Back to Mission Control")}
                          </button>
                        </div>
                      )}
                      {runData?.compliance.issuesFr?.some((i: string) => i.includes('écart')) && (
                        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md p-3 text-xs">
                          <p className="font-semibold text-blue-800 dark:text-blue-300 mb-1">💡 {t("Comment résoudre : écarts d'inventaire", "How to resolve: inventory variances")}</p>
                          <p className="text-blue-700 dark:text-blue-400">{t("Des écarts ont été détectés lors du Cycle Count. Retournez exécuter un nouveau CC pour les emplacements concernés et entrez la quantité physique réelle pour générer un ajustement (ADJ).", "Variances were detected during the Cycle Count. Go back and run a new CC for the affected locations, entering the actual physical quantity to generate an adjustment (ADJ).")}</p>
                        </div>
                      )}
                    </div>
                  )}
                  <input {...register("comment")} placeholder={t("Ex: Module complété avec succès", "Ex: Module completed successfully")} className="fiori-field-input" />
                </div>
              )}

              {/* Auto-complete steps */}
              {["stock", "compliance_adv", "compliance_m3", "compliance_m4", "compliance_m5", "kpi_data"].includes(step?.toLowerCase() ?? "") && (
                <div className="alert-compliant">
                  <p className="text-xs font-semibold mb-1">
                    {step?.toLowerCase() === "stock"
                      ? t("✅ Stock disponible confirmé", "✅ Available stock confirmed")
                      : step?.toLowerCase() === "kpi_data"
                      ? t("📊 Données KPI de référence", "📊 Reference KPI data")
                      : t("✅ Prêt pour validation de conformité", "✅ Ready for compliance validation")}
                  </p>
                  {step?.toLowerCase() === "stock" && (
                    <p className="text-xs">{t("Cette étape est automatiquement validée après le rangement (PUTAWAY). Le stock est maintenant disponible en zone STOCKAGE.", "This step is automatically validated after putaway. Stock is now available in the STOCKAGE zone.")}</p>
                  )}
                  {step?.toLowerCase() === "kpi_data" && (
                    <div className="mt-2 space-y-1 text-xs font-mono">
                      <p>📦 {t("Consommation annuelle", "Annual consumption")}: <strong>2 400 unités</strong></p>
                      <p>📦 {t("Stock moyen", "Average stock")}: <strong>400 unités</strong></p>
                      <p>✅ {t("Commandes livrées", "Orders delivered")}: <strong>285 / 300</strong></p>
                      <p>⚠ {t("Erreurs opérationnelles", "Operational errors")}: <strong>12 / 300</strong></p>
                      <p>⏱ {t("Délai moyen", "Average lead time")}: <strong>3.5 jours</strong></p>
                      <p>💰 {t("Valeur stock immobilisé", "Immobilized stock value")}: <strong>48 000 $</strong></p>
                    </div>
                  )}
                  {["compliance_adv", "compliance_m3", "compliance_m4", "compliance_m5"].includes(step?.toLowerCase() ?? "") && (
                    <p className="text-xs mt-1">{t("Toutes les étapes précédentes ont été complétées. Cliquez sur Valider pour finaliser ce module.", "All previous steps have been completed. Click Validate to finalize this module.")}</p>
                  )}
                  {step?.toLowerCase() === "stock" && (
                    <div className="mt-3 space-y-0.5">
                      {Object.entries(runData?.inventory ?? {}).filter(([, qty]) => (qty as number) > 0).map(([key, qty]) => {
                        const [sku, bin] = key.split("::");
                        return (
                          <p key={key} className="text-[10px] font-mono">
                            <span className="text-primary font-semibold">{sku}</span> @ <span className="text-green-600 dark:text-green-400">{bin}</span> — <strong>{qty as number} {t("unités", "units")}</strong>
                          </p>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ── SCN-011: replenishment-only scenario — no cycle count targets ─── */}
              {["cc_list", "cc_count", "cc_recon"].includes(step?.toLowerCase() ?? "") && m3CycleCountTargets.length === 0 && !isM3ReplenishOnly && (
                <div className="mb-3 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 rounded-lg">
                  <p className="text-[10px] font-bold text-amber-800 dark:text-amber-200 uppercase mb-1">
                    ℹ️ {t("Comptage non requis", "No cycle count required")}
                  </p>
                  <p className="text-[10px] text-amber-700 dark:text-amber-300">
                    {t(
                      "Ce scénario ne contient pas d'articles à compter. Complétez cette étape rapidement et concentrez-vous sur le réapprovisionnement Min/Max à l'étape REPLENISH.",
                      "This scenario has no items to count. Complete this step quickly and focus on Min/Max replenishment at the REPLENISH step.",
                    )}
                  </p>
                  {m3ReplenishParamRows.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-800">
                      <M3ReplenishmentParamsTable
                        rows={m3ReplenishParamRows}
                        t={t}
                        language={language}
                        compact
                      />
                    </div>
                  )}
                </div>
              )}

              {/* ── CC_COUNT: target guidance panel (hotfix rc13) ─────── */}
              {step?.toLowerCase() === "cc_count" && m3CycleCountTargets.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-[10px]">
                  <p className="font-bold text-blue-800 dark:text-blue-200 mb-1">
                    📋 {t("Articles à compter (MI04)", "Items to count (MI04)")}
                  </p>
                  <p className="text-blue-700 dark:text-blue-300 mb-2">
                    {t(
                      "Soumettez un comptage par SKU. Entrez la quantité physique réelle que vous observez dans l'entrepôt.",
                      "Submit one count per SKU. Enter the actual physical quantity you observe in the warehouse.",
                    )}
                  </p>
                  <table className="w-full font-mono text-[9px] border-collapse">
                    <thead>
                      <tr className="text-blue-600 dark:text-blue-400">
                        <th className="text-left pr-3 pb-1">{t("SKU", "SKU")}</th>
                        <th className="text-left pr-3 pb-1">{t("Bin", "Bin")}</th>
                        <th className="text-right pr-3 pb-1">{t("Qté système", "System qty")}</th>
                        <th className="text-right pb-1">{t("Qté physique attendue", "Expected physical qty")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {m3CycleCountTargets.map((target) => (
                        <tr key={target.sku} className="border-t border-blue-200 dark:border-blue-800">
                          <td className="pr-3 py-0.5 font-semibold text-blue-900 dark:text-blue-100">{target.sku}</td>
                          <td className="pr-3 py-0.5 text-blue-700 dark:text-blue-300">{target.bin ?? "—"}</td>
                          <td className="pr-3 py-0.5 text-right text-blue-800 dark:text-blue-200">{target.systemQty}</td>
                          <td className="py-0.5 text-right font-bold text-blue-900 dark:text-blue-100">{target.physicalQty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-[9px] text-blue-500 dark:text-blue-400 mt-2 italic">
                    {t(
                      "Sélectionnez un SKU dans la liste ci-dessous, renseignez les quantités système et comptée, puis soumettez. Répétez pour chaque SKU.",
                      "Select a SKU from the list below, fill in the system and counted quantities, then submit. Repeat for each SKU.",
                    )}
                  </p>
                </div>
              )}

              {/* ── Standard fields ─────────────────────────────────────── */}
              {cfg.fields.includes("docRef") && (
                <div>
                  <label className="fiori-field-label">
                    {t("N° Document", "Document No.")} <span className="text-destructive">*</span>{" "}
                    <span className="text-[10px] text-muted-foreground ml-1">{t("Requis", "Required")}</span>
                  </label>
                  <input {...register("docRef")} readOnly={isGrRegularization} placeholder={`Ex: ${cfg.code}-2025-001`} className={`fiori-field-input fiori-field-active ${isGrRegularization ? "bg-muted" : ""}`} />
                </div>
              )}

              {cfg.fields.includes("sku") && !ccReconFormComplete && (
                <div>
                  <label className="fiori-field-label">
                    SKU <span className="text-destructive">*</span>{" "}
                    <span className="text-[10px] text-muted-foreground ml-1">{t("Requis", "Required")}</span>
                  </label>
                  <select {...register("sku")} value={selectedSku} onChange={e => setValue("sku", e.target.value)} disabled={isGrRegularization} className={`fiori-field-input fiori-field-active ${isGrRegularization ? "bg-muted" : ""}`}>
                    <option value="">— {t("Sélectionner un SKU", "Select a SKU")} —</option>
                    {step?.toLowerCase() === "cc_recon" && m3CycleCountTargets.length > 0
                      ? (ccReconPendingTargets.length > 0 ? ccReconPendingTargets : m3CycleCountTargets).map((target) => (
                          <option key={target.sku} value={target.sku}>
                            {target.sku}{target.bin ? ` @ ${target.bin}` : ""} — {t("écart", "variance")}{" "}
                            {ccReconProgress?.statuses.find((s) => s.sku === target.sku)?.varianceQty
                              ?? (target.physicalQty - target.systemQty)}
                          </option>
                        ))
                      : masterData?.map((s: any) => (
                          <option key={s.sku} value={s.sku}>{s.sku} — {s.descriptionFr}</option>
                        ))}
                  </select>
                </div>
              )}

              {/* FIFO lot availability table */}
              {isFifoPickStep && fifoLotRows.length > 0 && (
                <div className="rounded-md border border-primary/20 bg-primary/5 p-3">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2">
                    {t("Lots disponibles (ordre FIFO)", "Available lots (FIFO order)")}
                  </p>
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-blue-50 dark:bg-blue-950/30">
                        <th className="text-left px-2 py-1 font-semibold">{t("Lot", "Lot")}</th>
                        <th className="text-left px-2 py-1 font-semibold">{t("Ordre d'entrée", "Entry order")}</th>
                        <th className="text-left px-2 py-1 font-semibold">{t("Emplacement", "Location")}</th>
                        <th className="text-right px-2 py-1 font-semibold">{t("Quantité", "Quantity")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fifoLotRows.map((row, i) => (
                        <tr key={`${row.lotNumber}-${row.bin}`} className="border-t border-border">
                          <td className="px-2 py-1 font-mono font-bold text-primary">{row.lotNumber}</td>
                          <td className="px-2 py-1">
                            {i === 0
                              ? t("Plus ancien", "Oldest")
                              : t("Plus récent", "Newest")}
                          </td>
                          <td className="px-2 py-1 font-mono">{row.bin}</td>
                          <td className="px-2 py-1 text-right font-medium">{row.qty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Standard single bin field */}
              {cfg.fields.includes("bin") && !ccReconFormComplete && (
                <div>
                  <label className="fiori-field-label">
                    {t("Bin / Emplacement", "Bin / Location")} <span className="text-destructive">*</span>
                  </label>
                  <select {...register("bin")} value={selectedBin} onChange={e => setValue("bin", e.target.value)} disabled={isGrRegularization} className={`fiori-field-input fiori-field-active ${isGrRegularization ? "bg-muted" : ""}`}>
                    <option value="">— {t("Sélectionner un emplacement", "Select a location")} —</option>
                    {bins?.map((b: any) => (
                      <option key={b.binCode} value={b.binCode}>{b.binCode} — {b.zone}</option>
                    ))}
                  </select>
                  {cfg.binZoneHint?.bin && !isGrRegularization && (
                    <p className="text-xs mt-1.5 text-blue-600 dark:text-blue-400 flex items-start gap-1 bg-blue-50 dark:bg-blue-950/30 rounded px-2 py-1">
                      <span className="shrink-0 font-bold">&#x1F4CD;</span>
                      <span>{t(cfg.binZoneHint.bin.fr, cfg.binZoneHint.bin.en)}</span>
                    </p>
                  )}
                  {availableStock !== null && (
                    <p className={`text-xs mt-1 font-medium ${availableStock > 0 ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
                      {t("Stock disponible", "Available stock")} : {availableStock} {t("unité(s)", "unit(s)")}
                    </p>
                  )}
                </div>
              )}

              {/* fromBin field */}
              {cfg.fields.includes("fromBin") && (
                <div>
                  <label className="fiori-field-label">
                    {t("Bin Source (De)", "Source Bin (From)")} <span className="text-destructive">*</span>
                  </label>
                  <select {...register("fromBin")} value={selectedFromBin} onChange={e => setValue("fromBin", e.target.value)} className="fiori-field-input fiori-field-active">
                    <option value="">— {t("Sélectionner le bin source", "Select source bin")} —</option>
                    {fromBinOptions.map((b: any) => (
                      <option key={b.binCode} value={b.binCode}>{b.binCode} — {b.zone}</option>
                    ))}
                  </select>
                  {cfg.binZoneHint?.fromBin && (
                    <p className="text-xs mt-1.5 text-blue-600 dark:text-blue-400 flex items-start gap-1 bg-blue-50 dark:bg-blue-950/30 rounded px-2 py-1">
                      <span className="shrink-0 font-bold">&#x1F4CD;</span>
                      <span>{t(cfg.binZoneHint.fromBin.fr, cfg.binZoneHint.fromBin.en)}</span>
                    </p>
                  )}
                  {availableStockFromBin !== null && selectedSku && (
                    <p className={`text-xs mt-1 font-medium ${availableStockFromBin > 0 ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
                      {t("Stock dans ce bin", "Stock in this bin")} : {availableStockFromBin} {t("unité(s)", "unit(s)")}
                    </p>
                  )}
                </div>
              )}

              {/* toBin field */}
              {cfg.fields.includes("toBin") && (
                <div>
                  <label className="fiori-field-label">
                    {t("Bin Destination (Vers)", "Destination Bin (To)")} <span className="text-destructive">*</span>
                  </label>
                  <select {...register("toBin")} value={selectedToBin} onChange={e => setValue("toBin", e.target.value)} className="fiori-field-input fiori-field-active">
                    <option value="">— {t("Sélectionner le bin destination", "Select destination bin")} —</option>
                    {toBinOptions.map((b: any) => (
                      <option key={b.binCode} value={b.binCode}>{b.binCode} — {b.zone}</option>
                    ))}
                  </select>
                  {cfg.binZoneHint?.toBin && (
                    <p className="text-xs mt-1.5 text-blue-600 dark:text-blue-400 flex items-start gap-1 bg-blue-50 dark:bg-blue-950/30 rounded px-2 py-1">
                      <span className="shrink-0 font-bold">&#x1F4CD;</span>
                      <span>{t(cfg.binZoneHint.toBin.fr, cfg.binZoneHint.toBin.en)}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Lot Number field */}
              {cfg.fields.includes("lotNumber") && (
                <div>
                  <label className="fiori-field-label">
                    {t("Numéro de lot", "Lot Number")} <span className="text-destructive">*</span>{" "}
                    <span className="text-[10px] text-muted-foreground ml-1">
                      {scnCode === "SCN-008"
                        ? t("Ex: LOT-A", "Ex: LOT-A")
                        : scnCode === "SCN-007"
                          ? t("Ex: LOT-2025-002", "Ex: LOT-2025-002")
                          : t("Ex: LOT-2025-001", "Ex: LOT-2025-001")}
                    </span>
                  </label>
                  <input
                    {...register("lotNumber")}
                    placeholder={
                      scnCode === "SCN-008"
                        ? "LOT-A"
                        : scnCode === "SCN-007"
                          ? "LOT-2025-002"
                          : "LOT-2025-001"
                    }
                    className="fiori-field-input fiori-field-active"
                  />
                </div>
              )}

              {/* Qty field */}
              {cfg.fields.includes("qty") && (
                <div>
                  <label className="fiori-field-label">
                    {t("Quantité", "Quantity")} <span className="text-destructive">*</span>
                  </label>
                  <input
                    key={`qty-${step ?? "unknown"}`}
                    {...register("qty")}
                    type="number"
                    step={isAdjStep ? "any" : undefined}
                    min={isAdjStep ? undefined : 1}
                    readOnly={isGrRegularization}
                    placeholder={isAdjStep ? "Ex: -15 ou +15" : "Ex: 50"}
                    className={`fiori-field-input fiori-field-active ${isGrRegularization ? "bg-muted" : ""}`}
                  />
                  {(["gi","so"].includes(step?.toLowerCase() ?? "")) && availableStock !== null && (
                    <p className="text-xs mt-1 text-amber-600 dark:text-amber-400">
                      {t(`Ne peut pas dépasser le stock disponible (${availableStock})`, `Cannot exceed available stock (${availableStock})`)}
                    </p>
                  )}
                </div>
              )}

              {/* Physical Qty field */}
              {cfg.fields.includes("physicalQty") && (
                <div>
                  <label className="fiori-field-label">
                    {t("Quantité physique comptée", "Physical quantity counted")} <span className="text-destructive">*</span>
                  </label>
                  <input {...register("physicalQty")} type="number" min={0} placeholder="Ex: 48" className="fiori-field-input fiori-field-active" />
                </div>
              )}

              {/* CC_COUNT multi-target hint — shown when scenario has specific SKUs to count */}
              {cfg.fields.includes("countedQty") && step?.toLowerCase() === "cc_count" && m3CycleCountTargets.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-[10px]">
                  <p className="font-bold text-blue-800 dark:text-blue-200 mb-1">
                    {t("Comptage multi-SKU requis", "Multi-SKU count required")}
                  </p>
                  <p className="text-blue-700 dark:text-blue-300">
                    {t(
                      "Soumettez CC_COUNT une fois par SKU ci-dessous. L'étape se valide lorsque tous les comptages sont saisis.",
                      "Submit CC_COUNT once per SKU below. The step completes when all counts are entered.",
                    )}
                  </p>
                  <ul className="mt-2 font-mono space-y-0.5 text-blue-800 dark:text-blue-200">
                    {m3CycleCountTargets.map((tgt) => (
                      <li key={tgt.sku}>
                        {tgt.sku} — {t("Système", "System")}: {tgt.systemQty} / Bin: {tgt.bin ?? "—"}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* System Qty field */}
              {cfg.fields.includes("systemQty") && (
                <div>
                  <label className="fiori-field-label">
                    {t("Quantité système (MB52)", "System quantity (MB52)")} <span className="text-destructive">*</span>
                  </label>
                  <input {...register("systemQty")} type="number" min={0} placeholder="Ex: 100" className="fiori-field-input fiori-field-active" />
                </div>
              )}

              {/* Counted Qty field */}
              {cfg.fields.includes("countedQty") && (
                <div>
                  <label className="fiori-field-label">
                    {t("Quantité comptée physiquement", "Physically counted quantity")} <span className="text-destructive">*</span>
                  </label>
                  <input {...register("countedQty")} type="number" min={0} placeholder="Ex: 98" className="fiori-field-input fiori-field-active" />
                </div>
              )}

              {/* Min Qty field */}
              {cfg.fields.includes("minQty") && (
                <div>
                  <label className="fiori-field-label">
                    {t("Stock minimum (ROP)", "Minimum stock (ROP)")} <span className="text-destructive">*</span>
                  </label>
                  <input {...register("minQty")} type="number" min={0} placeholder="Ex: 50" className="fiori-field-input fiori-field-active" />
                </div>
              )}

              {/* Max Qty field */}
              {cfg.fields.includes("maxQty") && (
                <div>
                  <label className="fiori-field-label">
                    {t("Stock maximum", "Maximum stock")} <span className="text-destructive">*</span>
                  </label>
                  <input {...register("maxQty")} type="number" min={0} placeholder="Ex: 200" className="fiori-field-input fiori-field-active" />
                </div>
              )}

              {/* Safety Stock field */}
              {cfg.fields.includes("safetyStock") && (
                <div>
                  <label className="fiori-field-label">
                    {t("Stock de sécurité", "Safety stock")} <span className="text-destructive">*</span>
                  </label>
                  <input {...register("safetyStock")} type="number" min={0} placeholder="Ex: 25" className="fiori-field-input fiori-field-active" />
                </div>
              )}

              {/* Student Qty (replenishment suggestion) */}
              {cfg.fields.includes("studentQty") && step?.toLowerCase() === "replenish" && m3ReplenishmentParams.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-[10px]">
                  <p className="font-bold text-amber-800 dark:text-amber-200 mb-1">
                    {t("Réapprovisionnement multi-SKU requis", "Multi-SKU replenishment required")}
                  </p>
                  <p className="text-amber-700 dark:text-amber-300">
                    {t(
                      "Soumettez REPLENISH pour chaque SKU listé ci-dessous. L'étape se valide lorsque toutes les cibles sont satisfaites.",
                      "Submit REPLENISH for each SKU below. The step completes when all targets are satisfied.",
                    )}
                  </p>
                  <ul className="mt-2 font-mono space-y-0.5">
                    {m3ReplenishmentParams.map((p) => (
                      <li key={p.sku}>{p.sku} — Min {p.minQty} / Max {p.maxQty} / SS {p.safetyStock}</li>
                    ))}
                  </ul>
                </div>
              )}

              {cfg.fields.includes("studentQty") && (
                <div className="space-y-3">
                  {/* Min/Max Replenishment Pedagogical Reference Panel */}
                  <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-2">
                      📐 {t(
                        isM3ReplenishOnly ? "Formules de référence — Min/Max" : "Formules de référence — Min/Max & ROP",
                        isM3ReplenishOnly ? "Reference formulas — Min/Max" : "Reference formulas — Min/Max & ROP",
                      )}
                    </p>
                    <div className="space-y-2 text-[10px] font-mono">
                      {!isM3ReplenishOnly && (
                      <div className="bg-white dark:bg-blue-900/30 rounded p-2 border border-blue-100 dark:border-blue-800">
                        <p className="text-blue-600 dark:text-blue-300 font-bold mb-0.5">{t("Point de commande (ROP)", "Reorder Point (ROP)")}</p>
                        <p className="text-blue-800 dark:text-blue-200">ROP = {t("Stock de sécurité", "Safety Stock")} + (D × LT)</p>
                        <p className="text-blue-500 dark:text-blue-400 text-[9px] mt-0.5">{t("D = demande journalière, LT = délai fournisseur", "D = daily demand, LT = supplier lead time")}</p>
                      </div>
                      )}
                      <div className="bg-white dark:bg-blue-900/30 rounded p-2 border border-blue-100 dark:border-blue-800">
                        <p className="text-blue-600 dark:text-blue-300 font-bold mb-0.5">{t("Quantité à commander", "Order Quantity")}</p>
                        <p className="text-blue-800 dark:text-blue-200">Q = {t("Stock max", "Max stock")} − {t("Stock actuel", "Current stock")}</p>
                        <p className="text-blue-500 dark:text-blue-400 text-[9px] mt-0.5">
                          {isM3ReplenishOnly
                            ? t("Stock de sécurité = indicateur de risque (ne pas ajouter à Q)", "Safety stock = risk indicator (do not add to Q)")
                            : t("Si stock actuel ≤ ROP → déclencher commande", "If current stock ≤ ROP → trigger order")}
                        </p>
                      </div>
                      <div className="bg-amber-50 dark:bg-amber-950/30 rounded p-2 border border-amber-200 dark:border-amber-800">
                        <p className="text-amber-700 dark:text-amber-300 font-bold mb-0.5">💡 {t("Exemple concret", "Concrete example")}</p>
                        <p className="text-amber-800 dark:text-amber-200">{t("Stock actuel", "Current stock")}: 30 | {t("Stock min (ROP)", "Min stock (ROP)")}: 50 | {t("Stock max", "Max stock")}: 200</p>
                        <p className="text-amber-700 dark:text-amber-400 font-semibold">→ Q = 200 − 30 = <strong>170 unités</strong></p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="fiori-field-label">
                      {t("Votre suggestion de commande (unités)", "Your order suggestion (units)")} <span className="text-destructive">*</span>
                    </label>
                    <input {...register("studentQty")} type="number" min={0} placeholder="Ex: 150" className="fiori-field-input fiori-field-active" />
                    <p className="text-[10px] text-muted-foreground mt-1">{t("Appliquez la formule ci-dessus avec vos valeurs saisies. Le système comparera votre réponse avec la suggestion optimale.", "Apply the formula above with your entered values. The system will compare your answer with the optimal suggestion.")}</p>
                  </div>
                </div>
              )}

              {/* M3 CC_RECON — variance threshold guidance + target progress */}
              {step?.toLowerCase() === "cc_recon" && (
                <div className="mb-4 space-y-3">
                  {ccReconProgress && ccReconProgress.requiredCount > 0 && (
                    <div className="rounded-md border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 px-4 py-3">
                      <p className="text-xs font-semibold text-blue-900 dark:text-blue-200">
                        {t(
                          `Cibles de réconciliation : ${ccReconProgress.reconciledCount} / ${ccReconProgress.requiredCount} complétées`,
                          `Reconciliation targets: ${ccReconProgress.reconciledCount} / ${ccReconProgress.requiredCount} completed`,
                        )}
                      </p>
                      <ul className="mt-2 space-y-1.5 text-[11px]">
                        {ccReconProgress.statuses.map((row) => (
                          <li key={row.sku} className="font-mono text-blue-900 dark:text-blue-100">
                            <span className="font-semibold">{row.sku}</span>
                            {row.bin ? ` — ${row.bin}` : ""}
                            {row.systemQty != null && row.physicalQty != null
                              ? ` · ${t("système", "system")} ${row.systemQty} / ${t("physique", "physical")} ${row.physicalQty}`
                              : ""}
                            {row.varianceQty != null ? ` · ${t("écart", "variance")} ${row.varianceQty}` : ""}
                            {" — "}
                            {row.status === "RECONCILED_WITH_ADJUSTMENT"
                              ? t(`Réconcilié — ADJ ${row.varianceQty} posté`, `Reconciled — ADJ ${row.varianceQty} posted`)
                              : row.status === "RECONCILED_NO_ADJUSTMENT"
                                ? t("Réconcilié — aucun ajustement requis", "Reconciled — no adjustment required")
                                : row.varianceQty === 0
                                  ? t("En attente de confirmation (écart 0)", "Pending confirmation (variance 0)")
                                  : t("En attente de réconciliation", "Pending reconciliation")}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="rounded-md border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 px-4 py-3">
                    <p className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                      {t(
                        `Seuil d'ajustement interne : ${m3VarianceThreshold} unités`,
                        `Internal adjustment threshold: ${m3VarianceThreshold} units`,
                      )}
                    </p>
                    <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
                      {t(
                        `Toute variance dont la valeur absolue est ≥ ${m3VarianceThreshold} exige une justification écrite (minimum 5 caractères) avant validation MI07.`,
                        `Any variance with absolute value ≥ ${m3VarianceThreshold} requires a written justification (minimum 5 characters) before MI07 validation.`,
                      )}
                    </p>
                    {selectedCcReconVariance === 0 && (
                      <p className="text-xs text-amber-800 dark:text-amber-300 mt-2 font-medium">
                        {t(
                          "Écart nul : confirmez sans créer d'ajustement ADJ. Aucune ADJ 0 n'est requise.",
                          "Zero variance: confirm without posting an ADJ. No ADJ 0 is required.",
                        )}
                      </p>
                    )}
                  </div>
                  {ccReconFormComplete && (
                    <div className="rounded-md border border-green-200 bg-green-50 dark:bg-green-950/30 px-4 py-3 text-xs text-green-800 dark:text-green-200">
                      {t(
                        "Toutes les cibles de réconciliation sont complétées. CC_RECON est validé.",
                        "All reconciliation targets are complete. CC_RECON is validated.",
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Variance Qty field */}
              {cfg.fields.includes("varianceQty") && !ccReconFormComplete && (
                <div>
                  <label className="fiori-field-label">
                    {selectedCcReconVariance === 0
                      ? t("Variance (confirmation écart nul)", "Variance (zero-variance confirmation)")
                      : t("Quantité d'ajustement (variance)", "Adjustment quantity (variance)")}{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <input
                    {...register("varianceQty")}
                    type="number"
                    placeholder={selectedCcReconVariance === 0 ? "0" : "Ex: -2 (manquant) ou +3 (surplus)"}
                    className="fiori-field-input fiori-field-active"
                  />
                </div>
              )}

              {/* Justification field */}
              {cfg.fields.includes("justification") && !ccReconFormComplete && (
                <div>
                  <label className="fiori-field-label">
                    {selectedCcReconVariance === 0
                      ? t("Note de confirmation (optionnelle)", "Confirmation note (optional)")
                      : <>{t("Justification de l'ajustement", "Adjustment justification")} <span className="text-destructive">*</span></>}
                  </label>
                  <input {...register("justification")} placeholder={t("Ex: Erreur de comptage lors de la réception", "Ex: Counting error during reception")} className="fiori-field-input fiori-field-active" />
                </div>
              )}

              {/* SKU List field (for CC_LIST) */}
              {cfg.fields.includes("skuList") && (
                <div>
                  {m3CycleCountTargets.length > 1 ? (
                    <>
                      <label className="fiori-field-label">
                        {t("SKUs requis pour le comptage", "SKUs required for counting")} <span className="text-destructive">*</span>
                      </label>
                      <ul className="text-sm border rounded-md p-3 space-y-1 bg-muted/30">
                        {m3CycleCountTargets.map((target) => (
                          <li key={target.sku} className="font-mono text-xs">
                            {target.sku}
                            {target.bin ? ` @ ${target.bin}` : ""} — {t("système", "system")} {target.systemQty}
                          </li>
                        ))}
                      </ul>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {t(
                          "La liste MI01 inclura automatiquement tous les SKU requis du scénario.",
                          "The MI01 count list will automatically include all required scenario SKUs.",
                        )}
                      </p>
                    </>
                  ) : (
                    <>
                      <label className="fiori-field-label">
                        {t("SKU à inclure dans le comptage", "SKU to include in count")} <span className="text-destructive">*</span>
                      </label>
                      <select {...register("sku")} value={selectedSku} onChange={e => setValue("sku", e.target.value)} className="fiori-field-input fiori-field-active">
                        <option value="">— {t("Sélectionner un SKU", "Select a SKU")} —</option>
                        {masterData?.map((s: any) => (
                          <option key={s.sku} value={s.sku}>{s.sku} — {s.descriptionFr}</option>
                        ))}
                      </select>
                    </>
                  )}
                </div>
              )}

              {/* Student Answer (KPI interpretation, M5 decision) */}
              {cfg.fields.includes("studentAnswer") && (
                <div
                  className={
                    isM5DecisionStep
                      ? "grid grid-cols-1 lg:grid-cols-5 gap-4 items-start"
                      : undefined
                  }
                >
                  {isM5DecisionStep && (
                    <M5DecisionResultPanel
                      className="lg:col-span-2 order-1 lg:order-2"
                      scnCode={scnCode}
                      t={t}
                      evidence={m5KpiLedger?.evidence ?? null}
                      kpiResult={m5KpiLedger?.kpiResult ?? null}
                      avgLeadTimeDays={m5KpiLedger?.kpiData?.avgLeadTimeDays ?? null}
                      contract={{
                        minQty: m5Contract?.replenishmentParams?.minQty,
                        maxQty: m5Contract?.replenishmentParams?.maxQty,
                        // Seed fallback only — panel prefers run cycle-count evidence when present.
                        systemQtyBefore: m5Contract?.cycleCountTargets?.[0]?.systemQty ?? null,
                        physicalQty: m5Contract?.cycleCountTargets?.[0]?.physicalQty ?? null,
                      }}
                      adjCompleted={m5AdjCompleted}
                      isLoading={m5KpiLedgerLoading}
                      isError={m5KpiLedgerError}
                    />
                  )}
                  <div className={isM5DecisionStep ? "lg:col-span-3 order-2 lg:order-1" : undefined}>
                    <AnalyticalResponseField
                      questionText={analyticalQuestionText}
                      registerProps={register("studentAnswer")}
                      t={t}
                      minChars={5}
                      guidanceText={m5ResponseGuidance}
                      exampleStructure={
                        step === "KPI_ROTATION" || step === "KPI_SERVICE" || step === "KPI_DIAGNOSTIC" || isM5DecisionStep
                          ? scnCode === "SCN-013"
                            ? t(
                                "Valeur + classification. Décision. Suivi.",
                                "Value + classification. Decision. Follow-up.",
                              )
                            : scnCode === "SCN-014"
                              ? t(
                                  "Valeur + classification. Décision. Suivi.",
                                  "Value + classification. Decision. Follow-up.",
                                )
                              : isM5DecisionStep
                                ? t(
                                    "Lecture KPI. Décision. Suivi du prochain cycle.",
                                    "KPI reading. Decision. Next-cycle follow-up.",
                                  )
                                : t(
                                    "Valeur + classification. Décision. Suivi.",
                                    "Value + classification. Decision. Follow-up.",
                                  )
                          : undefined
                      }
                      testId={`analytical-response-${step?.toLowerCase() ?? "unknown"}`}
                      hints={
                        <AnalyticalStepHints
                          step={step ?? ""}
                          t={t}
                          isM5Strategic={isM5Strategic}
                          scnCode={scnCode}
                        />
                      }
                    />
                  </div>
                </div>
              )}

              {/* KPI Data fields (M5 only) */}
              {cfg.fields.includes("annualConsumption") && (
                <div className="space-y-3">
                  {isM5KpiStep && m5KpiLedger?.evidence && (
                    <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded p-3 text-[10px] space-y-1">
                      <p className="font-bold text-slate-700 dark:text-slate-300">
                        {t("Ancrage moniteur M5", "M5 monitor anchor")}
                      </p>
                      <p className="font-mono text-muted-foreground">
                        {t("Réception", "Received")}: {m5KpiLedger.evidence.receivedQty} · {t("Putaway", "Putaway")}: {m5KpiLedger.evidence.putawayQty} · CC: {m5KpiLedger.evidence.cycleCountQty ?? "—"} · {t("Variance", "Variance")}: {m5KpiLedger.evidence.varianceQty} · {t("Stock bin", "Bin stock")}: {m5KpiLedger.evidence.stockQtyAtBin}
                      </p>
                      {m5KpiLedger.kpiResult && (
                        <p className="text-muted-foreground">
                          → rotation {m5KpiLedger.kpiResult.rotationRate}× · service {(m5KpiLedger.kpiResult.serviceLevel * 100).toFixed(1)}% · {t("erreurs", "errors")} {(m5KpiLedger.kpiResult.errorRate * 100).toFixed(1)}%
                        </p>
                      )}
                      {isDemo && m5KpiLedger.canonicalExample && (
                        <p className="text-indigo-600 dark:text-indigo-400 mt-1">
                          {t("Exemple Annexe A (démo)", "Annex A example (demo)")}: 2400/400 · 285/300 · 12/300 · 3,5 j · 48 000 $
                        </p>
                      )}
                    </div>
                  )}
                  {!isDemo && isM5KpiStep && (
                    <label className="flex items-start gap-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={kpiLedgerConfirmed}
                        onChange={(e) => setKpiLedgerConfirmed(e.target.checked)}
                        className="mt-0.5"
                      />
                      <span>
                        {t(
                          "Je confirme que les KPI ci-dessous sont dérivés du moniteur d'exécution (réception, putaway, CC, ADJ, réappro).",
                          "I confirm the KPIs below are derived from the run monitor (reception, putaway, CC, ADJ, replenishment).",
                        )}
                      </span>
                    </label>
                  )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="fiori-field-label">{t("Consommation annuelle", "Annual consumption")}</label>
                    <input {...register("annualConsumption")} type="number" className="fiori-field-input fiori-field-active" />
                  </div>
                  <div>
                    <label className="fiori-field-label">{t("Stock moyen", "Average stock")}</label>
                    <input {...register("averageStock")} type="number" className="fiori-field-input fiori-field-active" />
                  </div>
                  <div>
                    <label className="fiori-field-label">{t("Commandes livrées", "Orders fulfilled")}</label>
                    <input {...register("ordersFulfilled")} type="number" className="fiori-field-input fiori-field-active" />
                  </div>
                  <div>
                    <label className="fiori-field-label">{t("Total commandes", "Total orders")}</label>
                    <input {...register("totalOrders")} type="number" className="fiori-field-input fiori-field-active" />
                  </div>
                  <div>
                    <label className="fiori-field-label">{t("Erreurs opérationnelles", "Operational errors")}</label>
                    <input {...register("operationalErrors")} type="number" className="fiori-field-input fiori-field-active" />
                  </div>
                  <div>
                    <label className="fiori-field-label">{t("Total opérations", "Total operations")}</label>
                    <input {...register("totalOperations")} type="number" className="fiori-field-input fiori-field-active" />
                  </div>
                  <div>
                    <label className="fiori-field-label">{t("Délai moyen (jours)", "Avg lead time (days)")}</label>
                    <input {...register("avgLeadTimeDays")} type="number" step="0.1" className="fiori-field-input fiori-field-active" />
                  </div>
                  <div>
                    <label className="fiori-field-label">{t("Valeur stock ($)", "Stock value ($)")}</label>
                    <input {...register("stockValue")} type="number" className="fiori-field-input fiori-field-active" />
                  </div>
                </div>
                </div>
              )}

              {/* Comment field */}
              {cfg.fields.includes("comment") && (
                <div>
                  <label className="fiori-field-label">{t("Commentaire (optionnel)", "Comment (optional)")}</label>
                  <input {...register("comment")} placeholder={t("Ex: Réception conforme au bon de commande", "Ex: Receipt conforming to purchase order")} className="fiori-field-input" />
                </div>
              )}

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => navigate(`/student/run/${runId}`)}
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft size={13} />
                  {t("Annuler", "Cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isAnyPending || ccReconFormComplete}
                  className={`flex items-center gap-2 px-5 py-2 rounded-md text-sm font-semibold text-white transition-all ${
                    isAnyPending || ccReconFormComplete
                      ? "opacity-60 cursor-not-allowed bg-primary/60"
                      : isDemo
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-primary hover:bg-primary/90"
                  }`}
                >
                  {ccReconFormComplete ? (
                    <>
                      <CheckCircle size={14} />
                      {t("CC_RECON complété", "CC_RECON completed")}
                    </>
                  ) : isAnyPending ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t("Validation...", "Validating...")}
                    </>
                  ) : (
                    <>
                      <CheckCircle size={14} />
                      {getStepSubmitLabel(runData?.moduleId, step, language, {
                        isGrRegularization,
                        isZeroVarianceConfirm: selectedCcReconVariance === 0,
                      })}
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Backend Transparency Panel (demo only) */}
            <div className="px-5 pb-5">
              <BackendTransparencyPanel runData={runData} />
              <PedagogicalPanel cfg={displayCfg} isDemo={isDemo} />
            </div>
          </div>
        )}
      </div>
    </FioriShell>
  );
}
