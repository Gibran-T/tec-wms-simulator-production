/**
 * Quiz option integrity — stable option IDs + redistributed correct positions.
 * Historical quiz_attempts keep stored scores; new attempts score by option ID.
 */

export type QuizOptionPayload = { id: string; fr: string; en: string };

export type QuizQuestionSeed = {
  moduleId: number;
  orderIndex: number;
  difficulty: "easy" | "medium" | "hard";
  questionFr: string;
  questionEn: string;
  options: QuizOptionPayload[];
  correctOptionId: string;
  explanationFr: string;
  explanationEn: string;
};

function opt(
  id: string,
  fr: string,
  en: string
): QuizOptionPayload {
  return { id, fr, en };
}

/** Build payload + legacy arrays + correctIndex from option IDs. */
export function materializeQuizOptions(
  options: QuizOptionPayload[],
  correctOptionId: string
): {
  optionsPayload: QuizOptionPayload[];
  optionsFr: string[];
  optionsEn: string[];
  correctIndex: number;
  correctOptionId: string;
} {
  const correctIndex = options.findIndex((o) => o.id === correctOptionId);
  if (correctIndex < 0) {
    throw new Error(`correctOptionId ${correctOptionId} not in options`);
  }
  return {
    optionsPayload: options,
    optionsFr: options.map((o) => o.fr),
    optionsEn: options.map((o) => o.en),
    correctIndex,
    correctOptionId,
  };
}

/**
 * Canonical redistributed quiz bank (M1–M5).
 * Correct answers distributed across A/B/C/D — no systematic B pattern.
 * Semantic answers preserved from original pedagogy.
 */
export const QUIZ_INTEGRITY_BANK: QuizQuestionSeed[] = [
  // ── M1 (target indices: C, A, D, A, B → 2,0,3,0,1) ──
  {
    moduleId: 1,
    orderIndex: 1,
    difficulty: "easy",
    questionFr: "Qu'est-ce qu'un WMS (Warehouse Management System) ?",
    questionEn: "What is a WMS (Warehouse Management System)?",
    options: [
      opt("m1q1a", "Un logiciel de gestion des transports", "A transportation management software"),
      opt("m1q1b", "Un outil de planification de la production", "A production planning tool"),
      opt("m1q1c", "Un système de gestion des opérations d'entrepôt (réception, stockage, expédition)", "A system for managing warehouse operations (receiving, storage, shipping)"),
      opt("m1q1d", "Un système de gestion des ressources humaines", "A human resources management system"),
    ],
    correctOptionId: "m1q1c",
    explanationFr:
      "Le WMS gère toutes les opérations d'entrepôt : réception (GR), mise en stock (Putaway), préparation (Picking), expédition (GI) et inventaire (CC).",
    explanationEn:
      "The WMS manages all warehouse operations: goods receipt (GR), putaway, picking, goods issue (GI) and cycle counting (CC).",
  },
  {
    moduleId: 1,
    orderIndex: 2,
    difficulty: "medium",
    questionFr: "Dans le flux logistique standard, quelle est la séquence correcte des opérations ?",
    questionEn: "In the standard logistics flow, what is the correct sequence of operations?",
    options: [
      opt("m1q2a", "PO → GR → Putaway → SO → Picking → GI", "PO → GR → Putaway → SO → Picking → GI"),
      opt("m1q2b", "GR → PO → SO → Picking → GI → Putaway", "GR → PO → SO → Picking → GI → Putaway"),
      opt("m1q2c", "SO → PO → GR → GI → Picking → Putaway", "SO → PO → GR → GI → Picking → Putaway"),
      opt("m1q2d", "Picking → PO → GR → SO → Putaway → GI", "Picking → PO → GR → SO → Putaway → GI"),
    ],
    correctOptionId: "m1q2a",
    explanationFr:
      "Le flux standard : PO → GR → Putaway → SO → Picking → GI. Chaque étape dépend de la précédente.",
    explanationEn:
      "Standard flow: PO → GR → Putaway → SO → Picking → GI. Each step depends on the previous one.",
  },
  {
    moduleId: 1,
    orderIndex: 3,
    difficulty: "medium",
    questionFr: "Qu'est-ce qu'un Goods Receipt (GR) dans un WMS ?",
    questionEn: "What is a Goods Receipt (GR) in a WMS?",
    options: [
      opt("m1q3a", "L'expédition d'une commande client", "Shipping a customer order"),
      opt("m1q3b", "La création d'une commande d'achat", "Creating a purchase order"),
      opt("m1q3c", "L'inventaire cyclique des stocks", "Cyclical stock counting"),
      opt("m1q3d", "La confirmation de réception physique des marchandises et mise à jour du stock", "Physical confirmation of goods receipt and stock update"),
    ],
    correctOptionId: "m1q3d",
    explanationFr:
      "Le GR confirme que les marchandises commandées ont été physiquement reçues et met à jour le stock.",
    explanationEn:
      "The GR confirms that ordered goods have been physically received and updates stock.",
  },
  {
    moduleId: 1,
    orderIndex: 4,
    difficulty: "hard",
    questionFr: "Quelle est la conséquence d'un Goods Issue (GI) sans Goods Receipt préalable ?",
    questionEn: "What is the consequence of a Goods Issue (GI) without a prior Goods Receipt?",
    options: [
      opt("m1q4a", "Le stock devient négatif, créant une anomalie comptable et logistique", "Stock becomes negative, creating an accounting and logistics anomaly"),
      opt("m1q4b", "Le GI est automatiquement annulé par le WMS", "The GI is automatically cancelled by the WMS"),
      opt("m1q4c", "Le stock reste inchangé", "Stock remains unchanged"),
      opt("m1q4d", "Une commande d'achat est automatiquement créée", "A purchase order is automatically created"),
    ],
    correctOptionId: "m1q4a",
    explanationFr:
      "Un GI sans GR crée un stock négatif — anomalie comptable et de traçabilité. Le WMS doit bloquer cette opération.",
    explanationEn:
      "A GI without GR creates negative stock — an accounting and traceability anomaly. The WMS should block this operation.",
  },
  {
    moduleId: 1,
    orderIndex: 5,
    difficulty: "hard",
    questionFr: "Qu'est-ce qu'un inventaire cyclique (Cycle Count) et pourquoi est-il préféré à l'inventaire annuel ?",
    questionEn: "What is a Cycle Count and why is it preferred over annual inventory?",
    options: [
      opt("m1q5a", "Un comptage mensuel de tous les articles", "A monthly count of all items"),
      opt("m1q5b", "Un comptage rotatif d'un sous-ensemble d'articles, permettant une correction continue sans arrêt d'activité", "A rotating count of a subset of items, enabling continuous correction without stopping operations"),
      opt("m1q5c", "Un inventaire automatique par le WMS", "An automatic inventory by the WMS"),
      opt("m1q5d", "Un comptage trimestriel obligatoire", "A mandatory quarterly count"),
    ],
    correctOptionId: "m1q5b",
    explanationFr:
      "L'inventaire cyclique compte un sous-ensemble d'articles en rotation continue, sans arrêter les opérations.",
    explanationEn:
      "Cycle counting counts a rotating subset of items continuously, without stopping operations.",
  },

  // ── M2 (D, A, C, D) ──
  {
    moduleId: 2,
    orderIndex: 1,
    difficulty: "medium",
    questionFr: "Qu'est-ce que la méthode FIFO en gestion d'entrepôt ?",
    questionEn: "What is the FIFO method in warehouse management?",
    options: [
      opt("m2q1a", "Les articles les plus récents sont expédiés en premier", "The most recent items are shipped first"),
      opt("m2q1b", "Les articles les plus chers sont expédiés en premier", "The most expensive items are shipped first"),
      opt("m2q1c", "Les articles les plus légers sont expédiés en premier", "The lightest items are shipped first"),
      opt("m2q1d", "Les articles les plus anciens (reçus en premier) sont expédiés en premier", "The oldest items (received first) are shipped first"),
    ],
    correctOptionId: "m2q1d",
    explanationFr:
      "FIFO (Premier Entré, Premier Sorti) garantit que les articles les plus anciens sont utilisés en premier.",
    explanationEn:
      "FIFO (First In, First Out) ensures the oldest items are used first.",
  },
  {
    moduleId: 2,
    orderIndex: 2,
    difficulty: "medium",
    questionFr: "Qu'est-ce qu'un ASN (Advanced Shipping Notice) ?",
    questionEn: "What is an ASN (Advanced Shipping Notice)?",
    options: [
      opt("m2q2a", "Un avis d'expédition préalable envoyé par le fournisseur avant la livraison", "An advance shipping notice sent by the supplier before delivery"),
      opt("m2q2b", "Une notification d'expédition envoyée au client après livraison", "A shipping notification sent to the customer after delivery"),
      opt("m2q2c", "Un bon de commande électronique", "An electronic purchase order"),
      opt("m2q2d", "Un rapport d'inventaire automatique", "An automatic inventory report"),
    ],
    correctOptionId: "m2q2a",
    explanationFr:
      "L'ASN est envoyé par le fournisseur avant la livraison pour préparer la réception et accélérer le GR.",
    explanationEn:
      "The ASN is sent by the supplier before delivery to prepare receipt and speed up the GR.",
  },
  {
    moduleId: 2,
    orderIndex: 3,
    difficulty: "hard",
    questionFr: "Qu'est-ce que la traçabilité par lot et pourquoi est-elle obligatoire dans certains secteurs ?",
    questionEn: "What is lot traceability and why is it mandatory in certain sectors?",
    options: [
      opt("m2q3a", "Un système de suivi GPS des camions", "A GPS tracking system for trucks"),
      opt("m2q3b", "Un système de gestion des retours clients", "A customer returns management system"),
      opt("m2q3c", "La capacité de suivre un produit de sa fabrication à sa livraison finale via chaque étape logistique", "The ability to track a product from manufacturing to final delivery through each logistics step"),
      opt("m2q3d", "Un outil de planification des tournées", "A route planning tool"),
    ],
    correctOptionId: "m2q3c",
    explanationFr:
      "La traçabilité par lot suit chaque article de sa fabrication à sa livraison — obligatoire alimentaire, pharma, aéronautique.",
    explanationEn:
      "Lot traceability tracks each item from manufacturing to delivery — mandatory in food, pharma, aerospace.",
  },
  {
    moduleId: 2,
    orderIndex: 4,
    difficulty: "hard",
    questionFr: "Quelle est la différence entre la précision des stocks et le taux de service ?",
    questionEn: "What is the difference between stock accuracy and service rate?",
    options: [
      opt("m2q4a", "Ce sont deux termes pour le même indicateur", "They are two terms for the same indicator"),
      opt("m2q4b", "La précision mesure le taux de service; le taux de service mesure la précision", "Accuracy measures service rate; service rate measures accuracy"),
      opt("m2q4c", "La précision concerne les fournisseurs; le taux de service concerne les clients", "Accuracy concerns suppliers; service rate concerns customers"),
      opt("m2q4d", "La précision mesure l'écart entre stock physique et système; le taux de service mesure la capacité à satisfaire les commandes à temps", "Accuracy measures the gap between physical and system stock; service rate measures the ability to fulfill orders on time"),
    ],
    correctOptionId: "m2q4d",
    explanationFr:
      "Précision = écart physique/système. Taux de service = capacité à livrer à temps (OTIF).",
    explanationEn:
      "Accuracy = physical/system gap. Service rate = ability to deliver on time (OTIF).",
  },

  // ── M3 (A, C, D, A) ──
  {
    moduleId: 3,
    orderIndex: 1,
    difficulty: "medium",
    questionFr: "Qu'est-ce que le Point de Réapprovisionnement (ROP) ?",
    questionEn: "What is the Reorder Point (ROP)?",
    options: [
      opt("m3q1a", "Le niveau de stock qui déclenche automatiquement une commande de réapprovisionnement", "The stock level that automatically triggers a replenishment order"),
      opt("m3q1b", "Le stock maximum autorisé", "The maximum stock level allowed"),
      opt("m3q1c", "La quantité commandée lors de chaque réapprovisionnement", "The quantity ordered at each replenishment"),
      opt("m3q1d", "Le délai entre deux commandes fournisseur", "The time between two supplier orders"),
    ],
    correctOptionId: "m3q1a",
    explanationFr:
      "ROP = (Demande quotidienne × Délai fournisseur) + Stock de sécurité.",
    explanationEn:
      "ROP = (Daily demand × Lead time) + Safety stock.",
  },
  {
    moduleId: 3,
    orderIndex: 2,
    difficulty: "hard",
    questionFr: "La formule EOQ est : EOQ = √(2DS/H). Que représentent D, S et H ?",
    questionEn: "The EOQ formula is: EOQ = √(2DS/H). What do D, S and H represent?",
    options: [
      opt("m3q2a", "D=Délai, S=Stock de sécurité, H=Hauteur", "D=Lead time, S=Safety stock, H=Height"),
      opt("m3q2b", "D=Demande quotidienne, S=Surface d'entrepôt, H=Hauteur des rayonnages", "D=Daily demand, S=Warehouse area, H=Shelf height"),
      opt("m3q2c", "D=Demande annuelle, S=Coût de passation de commande, H=Coût de possession unitaire annuel", "D=Annual demand, S=Order placement cost, H=Annual unit holding cost"),
      opt("m3q2d", "D=Durée de vie, S=Stock minimum, H=Hauteur maximale", "D=Shelf life, S=Minimum stock, H=Maximum height"),
    ],
    correctOptionId: "m3q2c",
    explanationFr:
      "EOQ : D = demande annuelle, S = coût de passation, H = coût de possession unitaire annuel.",
    explanationEn:
      "EOQ: D = annual demand, S = order cost, H = annual unit holding cost.",
  },
  {
    moduleId: 3,
    orderIndex: 3,
    difficulty: "medium",
    questionFr: "Qu'est-ce que le stock de sécurité (Safety Stock) ?",
    questionEn: "What is Safety Stock?",
    options: [
      opt("m3q3a", "Le stock réservé pour les urgences", "Stock reserved for emergencies"),
      opt("m3q3b", "Le stock minimum légalement requis", "The minimum stock legally required"),
      opt("m3q3c", "Le stock endommagé non vendable", "Damaged unsellable stock"),
      opt("m3q3d", "Un stock tampon pour absorber les variations de demande et les retards fournisseurs, évitant les ruptures", "A buffer stock to absorb demand variations and supplier delays, preventing stockouts"),
    ],
    correctOptionId: "m3q3d",
    explanationFr:
      "Le stock de sécurité absorbe l'incertitude de demande et les retards fournisseurs.",
    explanationEn:
      "Safety stock absorbs demand uncertainty and supplier delays.",
  },
  {
    moduleId: 3,
    orderIndex: 4,
    difficulty: "hard",
    questionFr: "Lors d'un inventaire cyclique, vous comptez 45 unités alors que le système en indique 50. Quelle est la variance et quelle action prendre ?",
    questionEn: "During a cycle count, you count 45 units while the system shows 50. What is the variance and what action to take?",
    options: [
      opt("m3q4a", "Variance = -5, investiguer la cause puis ajuster le stock système à 45", "Variance = -5, investigate the cause then adjust system stock to 45"),
      opt("m3q4b", "Variance = +5, commander 5 unités supplémentaires", "Variance = +5, order 5 additional units"),
      opt("m3q4c", "Variance = -5, ignorer car moins de 10% d'écart", "Variance = -5, ignore as less than 10% discrepancy"),
      opt("m3q4d", "Variance = +5, retourner 5 unités au fournisseur", "Variance = +5, return 5 units to supplier"),
    ],
    correctOptionId: "m3q4a",
    explanationFr:
      "Variance = physique − système = 45 − 50 = −5. Investiguer, documenter, puis ajuster le système à 45.",
    explanationEn:
      "Variance = physical − system = 45 − 50 = −5. Investigate, document, then adjust system to 45.",
  },

  // ── M4 (B, C, A, D) ──
  {
    moduleId: 4,
    orderIndex: 1,
    difficulty: "medium",
    questionFr: "Qu'est-ce que l'indicateur OTIF (On Time In Full) ?",
    questionEn: "What is the OTIF (On Time In Full) indicator?",
    options: [
      opt("m4q1a", "Le taux de commandes livrées à temps uniquement", "The rate of orders delivered on time only"),
      opt("m4q1b", "Le taux de commandes livrées à temps ET complètes", "The rate of orders delivered on time AND complete"),
      opt("m4q1c", "Le taux de commandes livrées complètes uniquement", "The rate of orders delivered complete only"),
      opt("m4q1d", "Le délai moyen de livraison en jours", "The average delivery time in days"),
    ],
    correctOptionId: "m4q1b",
    explanationFr:
      "OTIF = % de commandes livrées à la fois à temps ET complètes.",
    explanationEn:
      "OTIF = % of orders delivered both on time AND complete.",
  },
  {
    moduleId: 4,
    orderIndex: 2,
    difficulty: "hard",
    questionFr: "Le taux de rotation des stocks est de 12. Qu'est-ce que cela signifie ?",
    questionEn: "The stock turnover rate is 12. What does this mean?",
    options: [
      opt("m4q2a", "Il y a 12 articles différents en stock", "There are 12 different items in stock"),
      opt("m4q2b", "Le stock a une valeur de 12 000 $", "Stock has a value of $12,000"),
      opt("m4q2c", "Le stock est renouvelé 12 fois par an, soit environ tous les 30 jours", "Stock is renewed 12 times per year, approximately every 30 days"),
      opt("m4q2d", "Le stock a été compté 12 fois cette année", "Stock has been counted 12 times this year"),
    ],
    correctOptionId: "m4q2c",
    explanationFr:
      "Rotation = 12 → stock renouvelé 12 fois/an (~tous les 30 jours).",
    explanationEn:
      "Turnover = 12 → stock renewed 12 times/year (~every 30 days).",
  },
  {
    moduleId: 4,
    orderIndex: 3,
    difficulty: "medium",
    questionFr: "Qu'est-ce que le DSI (Durée de Stock en Jours) ?",
    questionEn: "What is DSI (Days of Supply on Hand)?",
    options: [
      opt("m4q3a", "Le nombre de jours pendant lesquels le stock actuel peut couvrir la demande sans réapprovisionnement", "The number of days the current stock can cover demand without replenishment"),
      opt("m4q3b", "Le nombre de jours depuis la dernière livraison", "The number of days since the last delivery"),
      opt("m4q3c", "Le délai de livraison fournisseur", "The supplier delivery lead time"),
      opt("m4q3d", "Le nombre de jours travaillés dans l'entrepôt", "The number of working days in the warehouse"),
    ],
    correctOptionId: "m4q3a",
    explanationFr: "DSI = Stock actuel / Demande quotidienne moyenne.",
    explanationEn: "DSI = Current stock / Average daily demand.",
  },
  {
    moduleId: 4,
    orderIndex: 4,
    difficulty: "hard",
    questionFr: "Lors d'une RCA d'un OTIF de 78% (objectif 95%), quelles sont les deux premières questions à poser ?",
    questionEn: "During an RCA of an OTIF of 78% (target 95%), what are the first two questions to ask?",
    options: [
      opt("m4q4a", "Qui est responsable? et Quand?", "Who is responsible? and When?"),
      opt("m4q4b", "Combien de commandes? et Quel est le coût?", "How many orders? and What is the cost?"),
      opt("m4q4c", "Le WMS fonctionne-t-il? et Les employés sont-ils formés?", "Is the WMS working? and Are employees trained?"),
      opt("m4q4d", "Les retards sont-ils dus aux livraisons tardives ou aux commandes incomplètes? et Quels articles/clients sont les plus affectés?", "Are delays due to late deliveries or incomplete orders? and Which items/customers are most affected?"),
    ],
    correctOptionId: "m4q4d",
    explanationFr:
      "Segmenter d'abord On Time vs In Full, puis identifier articles/clients les plus touchés.",
    explanationEn:
      "First segment On Time vs In Full, then identify most affected items/customers.",
  },

  // ── M5 (C, A, D, B) ──
  {
    moduleId: 5,
    orderIndex: 1,
    difficulty: "medium",
    questionFr: "Dans une crise logistique (rupture de stock critique), quelle est la première action prioritaire ?",
    questionEn: "In a logistics crisis (critical stockout), what is the first priority action?",
    options: [
      opt("m5q1a", "Informer immédiatement la direction", "Immediately inform management"),
      opt("m5q1b", "Commander en urgence auprès du fournisseur habituel", "Place an urgent order with the usual supplier"),
      opt("m5q1c", "Évaluer l'impact sur les commandes clients et identifier les alternatives d'approvisionnement d'urgence", "Assess impact on current orders and identify emergency supply alternatives"),
      opt("m5q1d", "Réduire les expéditions de 50%", "Reduce shipments by 50%"),
    ],
    correctOptionId: "m5q1c",
    explanationFr:
      "Priorité : évaluer l'impact (commandes, clients, alternatives) avant d'agir.",
    explanationEn:
      "Priority: assess impact (orders, customers, alternatives) before acting.",
  },
  {
    moduleId: 5,
    orderIndex: 2,
    difficulty: "hard",
    questionFr: "Vous devez choisir entre : (A) Commander fréquemment de petites quantités, (B) Commander rarement de grandes quantités. Dans quel contexte choisissez-vous A ?",
    questionEn: "You must choose between: (A) Order frequently in small quantities, (B) Order rarely in large quantities. In what context do you choose A?",
    options: [
      opt("m5q2a", "Produits périssables, à forte rotation, ou quand l'espace de stockage est limité", "Perishable products, high-turnover, or when storage space is limited"),
      opt("m5q2b", "Produits à faible rotation et coût de stockage élevé", "Low-turnover products with high storage costs"),
      opt("m5q2c", "Produits avec un délai fournisseur très long", "Products with very long supplier lead time"),
      opt("m5q2d", "Produits avec une demande très stable", "Products with very stable demand"),
    ],
    correctOptionId: "m5q2a",
    explanationFr:
      "Petites commandes fréquentes : périssables, forte rotation, espace limité.",
    explanationEn:
      "Small frequent orders: perishables, high turnover, limited space.",
  },
  {
    moduleId: 5,
    orderIndex: 3,
    difficulty: "hard",
    questionFr: "Votre entrepôt a un LPH de 45 (objectif 60). Quels sont les deux leviers d'amélioration les plus efficaces ?",
    questionEn: "Your warehouse has an LPH of 45 (target 60). What are the two most effective improvement levers?",
    options: [
      opt("m5q3a", "Augmenter les heures supplémentaires et recruter", "Increase overtime and hire staff"),
      opt("m5q3b", "Investir dans un nouveau WMS", "Invest in a new WMS"),
      opt("m5q3c", "Réduire le nombre de références", "Reduce the number of references"),
      opt("m5q3d", "Optimiser les tournées de picking et améliorer le slotting (articles à forte rotation près des zones d'expédition)", "Optimize picking routes and improve slotting (high-turnover items near shipping areas)"),
    ],
    correctOptionId: "m5q3d",
    explanationFr:
      "Leviers efficaces : optimiser les tournées de picking et le slotting classe A.",
    explanationEn:
      "Effective levers: optimize picking routes and class-A slotting.",
  },
  {
    moduleId: 5,
    orderIndex: 4,
    difficulty: "hard",
    questionFr: "Après les 5 modules TEC.LOG, quelle compétence différencie un gestionnaire logistique expert d'un débutant ?",
    questionEn: "After all 5 TEC.LOG modules, what skill differentiates an expert logistics manager from a beginner?",
    options: [
      opt("m5q4a", "La capacité à utiliser tous les menus du WMS", "The ability to use all WMS menus"),
      opt("m5q4b", "La capacité à interpréter les KPI, identifier les causes racines et proposer des actions correctives mesurables", "The ability to interpret KPIs, identify root causes and propose measurable corrective actions"),
      opt("m5q4c", "La vitesse d'exécution des transactions", "The speed of executing transactions"),
      opt("m5q4d", "La connaissance de tous les codes d'articles", "Knowledge of all item codes"),
    ],
    correctOptionId: "m5q4b",
    explanationFr:
      "L'expertise = interpréter les KPI, RCA et actions correctives mesurables.",
    explanationEn:
      "Expertise = interpret KPIs, RCA, and measurable corrective actions.",
  },
];

export function quizCorrectIndexDistribution(
  bank: QuizQuestionSeed[] = QUIZ_INTEGRITY_BANK
): Record<number, Record<string, number>> {
  const out: Record<number, Record<string, number>> = {};
  for (const q of bank) {
    const m = materializeQuizOptions(q.options, q.correctOptionId);
    const letter = ["A", "B", "C", "D"][m.correctIndex];
    if (!out[q.moduleId]) out[q.moduleId] = { A: 0, B: 0, C: 0, D: 0, total: 0 };
    out[q.moduleId][letter] += 1;
    out[q.moduleId].total += 1;
  }
  return out;
}

export function scoreQuizByOptionIds(
  questions: Array<{ correctOptionId: string; id: number }>,
  answers: Array<{ questionId: number; selectedOptionId: string }>
): { correct: number; total: number; score: number } {
  const map = new Map(answers.map((a) => [a.questionId, a.selectedOptionId]));
  let correct = 0;
  for (const q of questions) {
    if (map.get(q.id) === q.correctOptionId) correct++;
  }
  const total = questions.length;
  return {
    correct,
    total,
    score: total ? Math.round((correct / total) * 100) : 0,
  };
}
