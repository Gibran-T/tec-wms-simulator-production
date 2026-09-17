import type { FormativeExerciseId, LocalizedText } from "./types";

export type McqOptionId = "a" | "b" | "c" | "d" | "e";

export type McqOption = {
  id: McqOptionId;
  label: LocalizedText;
};

export type McqItem = {
  id: string;
  prompt: LocalizedText;
  context: LocalizedText;
  options: McqOption[];
  correctId: McqOptionId;
  competence: LocalizedText;
  whyRight: LocalizedText;
  whyWrong: Partial<Record<McqOptionId, LocalizedText>>;
  errorType: LocalizedText;
};

function L(fr: string, en: string): LocalizedText {
  return { fr, en };
}

export const M1_PREP_MCQ: McqItem[] = [
  {
    id: "m1p1",
    prompt: L(
      "Un camion vient d’arriver au quai. Quand le produit peut-il être considéré disponible en stock ?",
      "A truck has just arrived at the dock. When may the product be considered available in stock?",
    ),
    context: L(
      "Issue : la réception n’est pas encore enregistrée. L’équipe veut libérer le SKU pour une commande urgente.",
      "Issue: receiving is not yet posted. The team wants to release the SKU for an urgent order.",
    ),
    options: [
      {
        id: "a",
        label: L(
          "Dès l’arrivée physique au quai, pour accélérer le service.",
          "As soon as it physically arrives at the dock, to speed up service.",
        ),
      },
      {
        id: "b",
        label: L(
          "Après validation de l’entrée (GR postée) et rangement conforme, puis disponibilité en stock.",
          "After inbound validation (posted GR) and compliant putaway, then stock availability.",
        ),
      },
      {
        id: "c",
        label: L(
          "Dès la création du bon de commande fournisseur (PO), le stock est déjà réservé.",
          "As soon as the purchase order (PO) is created, stock is already reserved.",
        ),
      },
      {
        id: "d",
        label: L(
          "Après le cycle count uniquement — la GR n’a pas d’effet sur la disponibilité.",
          "Only after cycle count — GR has no effect on availability.",
        ),
      },
    ],
    correctId: "b",
    competence: L("Séquence de réception et disponibilité", "Receiving sequence and availability"),
    whyRight: L(
      "Réponse correcte : l’entrée doit être validée avant la disponibilisation du produit en stock, garantissant traçabilité et conformité.",
      "Correct answer: inbound must be validated before the product is made available in stock, ensuring traceability and compliance.",
    ),
    whyWrong: {
      a: L(
        "Réponse incorrecte : cette décision ne respecte pas la séquence opérationnelle du réception. Le produit ne doit pas être disponibilisé en stock avant la validation et le registre correct de l’entrée.",
        "Incorrect answer: this decision does not respect the receiving operational sequence. The product must not be made available in stock before inbound validation and correct posting.",
      ),
      c: L(
        "Réponse incorrecte : la PO crée l’engagement d’achat, pas le stock. Disponibiliser sans GR casse la traçabilité.",
        "Incorrect answer: the PO creates the purchase commitment, not stock. Releasing without GR breaks traceability.",
      ),
      d: L(
        "Réponse incorrecte : le cycle count vérifie le stock déjà enregistré. Il ne remplace pas la GR.",
        "Incorrect answer: cycle count verifies already recorded stock. It does not replace GR.",
      ),
    },
    errorType: L("Séquence inbound inversée", "Inverted inbound sequence"),
  },
  {
    id: "m1p2",
    prompt: L(
      "Un GR existe déjà mais n’est pas posté (GR fantôme). Quelle décision professionnelle ?",
      "A GR already exists but is not posted (ghost GR). What is the professional decision?",
    ),
    context: L(
      "Issue : le document d’entrée est dans le système, statut non posté. Un second opérateur veut créer un nouveau GR.",
      "Issue: the inbound document is in the system, unposted. A second operator wants to create a new GR.",
    ),
    options: [
      {
        id: "a",
        label: L(
          "Créer un nouveau GR pour « rattraper » plus vite.",
          "Create a new GR to catch up faster.",
        ),
      },
      {
        id: "b",
        label: L(
          "Ignorer le document et ranger directement en STOCKAGE.",
          "Ignore the document and put away directly into STORAGE.",
        ),
      },
      {
        id: "c",
        label: L(
          "Poster / régulariser le GR existant, puis enchaîner le putaway.",
          "Post / regularize the existing GR, then continue with putaway.",
        ),
      },
      {
        id: "d",
        label: L(
          "Annuler la PO pour repartir de zéro.",
          "Cancel the PO to start from scratch.",
        ),
      },
    ],
    correctId: "c",
    competence: L("Régularisation d’un GR fantôme", "Ghost GR regularization"),
    whyRight: L(
      "Réponse correcte : on régularise le document existant. Un second GR dupliquerait l’entrée et fausserait le stock.",
      "Correct answer: regularize the existing document. A second GR would duplicate inbound and distort stock.",
    ),
    whyWrong: {
      a: L(
        "Réponse incorrecte : créer un second GR double l’entrée. Conséquence : stock fantôme et non-conformité documentaire.",
        "Incorrect answer: creating a second GR doubles inbound. Consequence: ghost stock and document non-compliance.",
      ),
      b: L(
        "Réponse incorrecte : ranger sans poster le GR casse le lien document → stock. La compétence de traçabilité inbound est violée.",
        "Incorrect answer: putaway without posting GR breaks the document → stock link. Inbound traceability is violated.",
      ),
      d: L(
        "Réponse incorrecte : annuler la PO n’efface pas le GR fantôme et détruit l’engagement fournisseur sans traiter l’issue.",
        "Incorrect answer: cancelling the PO does not clear the ghost GR and destroys the supplier commitment without fixing the issue.",
      ),
    },
    errorType: L("Duplication documentaire", "Document duplication"),
  },
  {
    id: "m1p3",
    prompt: L(
      "Le stock disponible est insuffisant pour honorer la commande client. Que faire avant le GI ?",
      "Available stock is insufficient to fulfill the customer order. What should be done before GI?",
    ),
    context: L(
      "Issue : ATP en déficit. L’équipe hésite entre expédier partiellement, forcer le GI, ou réapprovisionner.",
      "Issue: ATP is in deficit. The team hesitates between partial ship, forcing GI, or replenishing.",
    ),
    options: [
      {
        id: "a",
        label: L(
          "Forcer le GI : le système corrigera le stock négatif plus tard.",
          "Force GI: the system will correct negative stock later.",
        ),
      },
      {
        id: "b",
        label: L(
          "Créer un réapprovisionnement correctif (PO/GR/putaway) pour couvrir le déficit, puis GI.",
          "Create corrective replenishment (PO/GR/putaway) to cover the deficit, then GI.",
        ),
      },
      {
        id: "c",
        label: L(
          "Modifier la quantité physique au cycle count pour « créer » du stock.",
          "Change the physical quantity at cycle count to “create” stock.",
        ),
      },
      {
        id: "d",
        label: L(
          "Supprimer la commande client pour masquer le déficit.",
          "Delete the sales order to hide the deficit.",
        ),
      },
    ],
    correctId: "b",
    competence: L("Gestion du déficit ATP avant expédition", "ATP deficit handling before shipping"),
    whyRight: L(
      "Réponse correcte : on reconstitue le stock par un flux inbound correctif avant d’expédier. Le GI ne doit pas créer de stock négatif.",
      "Correct answer: rebuild stock through a corrective inbound flow before shipping. GI must not create negative stock.",
    ),
    whyWrong: {
      a: L(
        "Réponse incorrecte : un GI en stock insuffisant crée un stock négatif. Règle violée : intégrité du stock avant sortie.",
        "Incorrect answer: GI with insufficient stock creates negative inventory. Rule violated: stock integrity before issue.",
      ),
      c: L(
        "Réponse incorrecte : truquer le cycle count falsifie la preuve physique. Ce n’est pas un réapprovisionnement.",
        "Incorrect answer: faking the cycle count falsifies physical evidence. That is not replenishment.",
      ),
      d: L(
        "Réponse incorrecte : supprimer la SO masque le problème commercial sans rétablir le stock.",
        "Incorrect answer: deleting the SO hides the commercial problem without restoring stock.",
      ),
    },
    errorType: L("Sortie sans couverture stock", "Issue without stock coverage"),
  },
  {
    id: "m1p4",
    prompt: L(
      "Lors d’un cycle count, le système indique 200 et le comptage physique 185. Quelle saisie est correcte ?",
      "During a cycle count, the system shows 200 and the physical count is 185. Which entry is correct?",
    ),
    context: L(
      "Issue : écart d’inventaire. La tentation est de recopier la quantité système pour « rester conforme ».",
      "Issue: inventory variance. The temptation is to copy the system quantity to “stay compliant”.",
    ),
    options: [
      {
        id: "a",
        label: L(
          "Saisir 200 pour aligner le physique sur le système.",
          "Enter 200 to align physical with the system.",
        ),
      },
      {
        id: "b",
        label: L(
          "Saisir 185 (quantité physique constatée), puis réconcilier l’écart.",
          "Enter 185 (observed physical quantity), then reconcile the variance.",
        ),
      },
      {
        id: "c",
        label: L(
          "Saisir +15 pour compenser sans document d’ajustement.",
          "Enter +15 to compensate without an adjustment document.",
        ),
      },
      {
        id: "d",
        label: L(
          "Ne rien saisir : l’écart se réglera à la prochaine réception.",
          "Enter nothing: the variance will clear at the next receipt.",
        ),
      },
    ],
    correctId: "b",
    competence: L("Preuve physique vs quantité système", "Physical evidence vs system quantity"),
    whyRight: L(
      "Réponse correcte : le cycle count enregistre la réalité physique. L’écart se traite ensuite par réconciliation / ajustement documenté.",
      "Correct answer: cycle count records physical reality. The variance is then handled through documented reconciliation / adjustment.",
    ),
    whyWrong: {
      a: L(
        "Réponse incorrecte : recopier le système cache l’écart. Conséquence : le WMS ment et la conformité est fausse.",
        "Incorrect answer: copying the system hides the variance. Consequence: the WMS lies and compliance is false.",
      ),
      c: L(
        "Réponse incorrecte : un écart se documente (ADJ), il ne se « compense » pas dans le comptage.",
        "Incorrect answer: a variance is documented (ADJ); it is not “compensated” inside the count.",
      ),
      d: L(
        "Réponse incorrecte : laisser l’écart ouvert viole la boucle de conformité système = réalité.",
        "Incorrect answer: leaving the variance open violates the system = reality compliance loop.",
      ),
    },
    errorType: L("Masquage d’écart d’inventaire", "Inventory variance concealment"),
  },
];

export const M1_CONS_MCQ: McqItem[] = [
  {
    id: "m1c1",
    prompt: L(
      "Après vos missions : un opérateur veut scanner en stock un SKU encore sur le quai, « pour gagner du temps ». Décision ?",
      "After your missions: an operator wants to scan a SKU still on the dock into stock “to save time”. Decision?",
    ),
    context: L(
      "Nouvelle situation : pic d’activité, pression service. La GR n’est pas postée.",
      "New situation: activity peak, service pressure. GR is not posted.",
    ),
    options: [
      {
        id: "a",
        label: L(
          "Accepter : le service client prime sur la séquence.",
          "Accept: customer service outweighs the sequence.",
        ),
      },
      {
        id: "b",
        label: L(
          "Refuser : valider l’entrée puis ranger. Le service se protège par un stock vrai.",
          "Refuse: validate inbound then put away. Service is protected by true stock.",
        ),
      },
      {
        id: "c",
        label: L(
          "Poster une GR fictive à quantité zéro pour débloquer.",
          "Post a dummy GR at quantity zero to unblock.",
        ),
      },
      {
        id: "d",
        label: L(
          "Déplacer le SKU en expédition sans passer par STOCKAGE.",
          "Move the SKU to shipping without going through STORAGE.",
        ),
      },
    ],
    correctId: "b",
    competence: L("Transfert : séquence inbound sous pression", "Transfer: inbound sequence under pressure"),
    whyRight: L(
      "Réponse correcte : la pression de service ne justifie pas un stock fantôme. La séquence protège précisément le service.",
      "Correct answer: service pressure does not justify ghost stock. The sequence is what protects service.",
    ),
    whyWrong: {
      a: L(
        "Réponse incorrecte : accélérer en sautant la GR crée des ruptures invisibles. Compétence violée : disponibilité réelle.",
        "Incorrect answer: skipping GR to go faster creates invisible stockouts. Competency violated: true availability.",
      ),
      c: L(
        "Réponse incorrecte : une GR fictive falsifie le registre. Conséquence : audit et traçabilité cassés.",
        "Incorrect answer: a dummy GR falsifies the ledger. Consequence: audit and traceability broken.",
      ),
      d: L(
        "Réponse incorrecte : court-circuiter STOCKAGE casse putaway, localisation et picking.",
        "Incorrect answer: bypassing STORAGE breaks putaway, location and picking.",
      ),
    },
    errorType: L("Court-circuit inbound", "Inbound shortcut"),
  },
  {
    id: "m1c2",
    prompt: L(
      "Deux GR apparaissent pour la même PO : un posté, un non posté. Quelle action ?",
      "Two GRs appear for the same PO: one posted, one unposted. What action?",
    ),
    context: L(
      "Issue post-mission : risque de double entrée après une tentative de « rattrapage ».",
      "Post-mission issue: double-entry risk after a catch-up attempt.",
    ),
    options: [
      {
        id: "a",
        label: L(
          "Poster le second GR pour « terminer le dossier ».",
          "Post the second GR to “close the file”.",
        ),
      },
      {
        id: "b",
        label: L(
          "Laisser les deux : le système fera la moyenne.",
          "Leave both: the system will average them.",
        ),
      },
      {
        id: "c",
        label: L(
          "Ne pas poster le GR fantôme ; traiter le document existant et vérifier le stock réel.",
          "Do not post the ghost GR; work the existing document and verify actual stock.",
        ),
      },
      {
        id: "d",
        label: L(
          "Créer un troisième GR de correction globale.",
          "Create a third GR as a global correction.",
        ),
      },
    ],
    correctId: "c",
    competence: L("Prévention de la double entrée", "Double-entry prevention"),
    whyRight: L(
      "Réponse correcte : on ne poste pas un second GR. On assainit le document fantôme et on vérifie le stock.",
      "Correct answer: do not post a second GR. Clean the ghost document and verify stock.",
    ),
    whyWrong: {
      a: L(
        "Réponse incorrecte : poster le second GR double le stock. Conséquence : surplus fictif et erreurs d’expédition.",
        "Incorrect answer: posting the second GR doubles stock. Consequence: fictitious surplus and shipping errors.",
      ),
      b: L(
        "Réponse incorrecte : le WMS n’« moyenne » pas des documents. Les GR s’additionnent.",
        "Incorrect answer: the WMS does not “average” documents. GRs add up.",
      ),
      d: L(
        "Réponse incorrecte : un troisième GR aggrave la duplication au lieu de la résoudre.",
        "Incorrect answer: a third GR worsens duplication instead of resolving it.",
      ),
    },
    errorType: L("Double posting inbound", "Inbound double posting"),
  },
  {
    id: "m1c3",
    prompt: L(
      "Un GI est demandé alors que le picking n’est pas confirmé. Décision ?",
      "A GI is requested while picking is not confirmed. Decision?",
    ),
    context: L(
      "Issue : l’expédition est pressée. Le stock système n’a pas encore été prélevé.",
      "Issue: shipping is rushed. System stock has not yet been picked.",
    ),
    options: [
      {
        id: "a",
        label: L(
          "Poster le GI d’abord, le picking suivra.",
          "Post GI first; picking will follow.",
        ),
      },
      {
        id: "b",
        label: L(
          "Confirmer le prélèvement (picking) puis le GI, dans cet ordre.",
          "Confirm picking then GI, in that order.",
        ),
      },
      {
        id: "c",
        label: L(
          "Réduire la SO pour éviter le picking.",
          "Reduce the SO to avoid picking.",
        ),
      },
      {
        id: "d",
        label: L(
          "Ajuster le stock à zéro puis GI.",
          "Adjust stock to zero then GI.",
        ),
      },
    ],
    correctId: "b",
    competence: L("Séquence outbound picking → GI", "Outbound sequence picking → GI"),
    whyRight: L(
      "Réponse correcte : le GI confirme la sortie après prélèvement. Inverser la séquence casse le lien commande → colis → sortie.",
      "Correct answer: GI confirms the issue after picking. Reversing the sequence breaks the order → parcel → issue link.",
    ),
    whyWrong: {
      a: L(
        "Réponse incorrecte : GI avant picking fait sortir un stock non préparé. Règle outbound violée.",
        "Incorrect answer: GI before picking issues unprepared stock. Outbound rule violated.",
      ),
      c: L(
        "Réponse incorrecte : modifier la SO pour éviter une étape opérationnelle masque l’erreur d’exécution.",
        "Incorrect answer: changing the SO to skip an operational step hides the execution error.",
      ),
      d: L(
        "Réponse incorrecte : un ADJ n’est pas un substitut du picking.",
        "Incorrect answer: an ADJ is not a substitute for picking.",
      ),
    },
    errorType: L("Séquence outbound inversée", "Inverted outbound sequence"),
  },
  {
    id: "m1c4",
    prompt: L(
      "La conformité de fin de mission exige système = réalité. Que signifie-t-elle concrètement ?",
      "End-of-mission compliance requires system = reality. What does that mean in practice?",
    ),
    context: L(
      "Clôture M1 : documents postés, stock localisé, écarts traités.",
      "M1 close-out: posted documents, located stock, treated variances.",
    ),
    options: [
      {
        id: "a",
        label: L(
          "Tous les écrans sont verts, même si un GR reste non posté.",
          "All screens are green, even if a GR remains unposted.",
        ),
      },
      {
        id: "b",
        label: L(
          "Le stock système reflète les mouvements postés et le physique constaté ; aucun document ouvert bloquant.",
          "System stock reflects posted movements and observed physical stock; no blocking open document.",
        ),
      },
      {
        id: "c",
        label: L(
          "Le score est ≥ 60, la conformité documentaire est optionnelle.",
          "The score is ≥ 60, so document compliance is optional.",
        ),
      },
      {
        id: "d",
        label: L(
          "Il suffit que la PO existe, même sans GR ni GI.",
          "It is enough that the PO exists, even without GR or GI.",
        ),
      },
    ],
    correctId: "b",
    competence: L("Conformité de clôture M1", "M1 close-out compliance"),
    whyRight: L(
      "Réponse correcte : conformité = stock vrai + documents soldés. Le score ne remplace pas l’intégrité opérationnelle.",
      "Correct answer: compliance = true stock + settled documents. Score does not replace operational integrity.",
    ),
    whyWrong: {
      a: L(
        "Réponse incorrecte : un GR non posté casse déjà système = réalité, même si l’UI paraît « verte ».",
        "Incorrect answer: an unposted GR already breaks system = reality, even if the UI looks “green”.",
      ),
      c: L(
        "Réponse incorrecte : le seuil de score n’autorise pas à laisser des bloqueurs ouverts.",
        "Incorrect answer: the score threshold does not allow leaving open blockers.",
      ),
      d: L(
        "Réponse incorrecte : une PO seule n’est pas un cycle logistique complet.",
        "Incorrect answer: a PO alone is not a complete logistics cycle.",
      ),
    },
    errorType: L("Conformité cosmétique", "Cosmetic compliance"),
  },
];

export const M2_PREP_MCQ: McqItem[] = [
  {
    id: "m2p1",
    prompt: L(
      "Une réception est au quai REC-01. Où ranger en priorité ?",
      "A receipt sits at dock REC-01. Where should it be put away first?",
    ),
    context: L(
      "Issue : l’opérateur hésite entre laisser au quai, ranger en STOCKAGE, ou envoyer en EXPÉDITION.",
      "Issue: the operator hesitates between leaving at dock, putting away to STORAGE, or sending to SHIPPING.",
    ),
    options: [
      {
        id: "a",
        label: L(
          "Laisser au quai : le picking se fera depuis REC-01.",
          "Leave at dock: picking will happen from REC-01.",
        ),
      },
      {
        id: "b",
        label: L(
          "Ranger vers un bin de STOCKAGE compatible (zone et capacité), depuis le quai.",
          "Put away to a compatible STORAGE bin (zone and capacity) from the dock.",
        ),
      },
      {
        id: "c",
        label: L(
          "Envoyer directement en EXPÉDITION pour gagner un déplacement.",
          "Send directly to SHIPPING to save a move.",
        ),
      },
      {
        id: "d",
        label: L(
          "Répartir au hasard dans le premier bin libre, même hors zone.",
          "Split at random into the first free bin, even off-zone.",
        ),
      },
    ],
    correctId: "b",
    competence: L("Putaway structuré quai → stockage", "Structured putaway dock → storage"),
    whyRight: L(
      "Réponse correcte : le rangement structure la localisation. Le quai n’est pas une zone de picking durable.",
      "Correct answer: putaway structures location. The dock is not a durable picking zone.",
    ),
    whyWrong: {
      a: L(
        "Réponse incorrecte : picker depuis le quai mélange inbound et outbound. Conséquence : files, erreurs de lot, quai saturé.",
        "Incorrect answer: picking from the dock mixes inbound and outbound. Consequence: queues, lot errors, saturated dock.",
      ),
      c: L(
        "Réponse incorrecte : EXPÉDITION n’est pas une zone de stockage. La localisation et le FIFO sont perdus.",
        "Incorrect answer: SHIPPING is not a storage zone. Location and FIFO are lost.",
      ),
      d: L(
        "Réponse incorrecte : un bin hors zone viole la règle de localisation. Compétence : capacité + zone.",
        "Incorrect answer: an off-zone bin violates the location rule. Competency: capacity + zone.",
      ),
    },
    errorType: L("Localisation hors zone", "Off-zone location"),
  },
  {
    id: "m2p2",
    prompt: L(
      "Un bin a une capacité max de 500. Vous devez ranger 600 unités. Décision ?",
      "A bin has max capacity 500. You must put away 600 units. Decision?",
    ),
    context: L(
      "Issue : dépassement de capacité. Un seul scan de 600 est tentant.",
      "Issue: capacity overflow. A single 600 scan is tempting.",
    ),
    options: [
      {
        id: "a",
        label: L(
          "Forcer 600 dans le même bin : la capacité est indicative.",
          "Force 600 into the same bin: capacity is indicative.",
        ),
      },
      {
        id: "b",
        label: L(
          "Découper le rangement (ex. 500 + 100) vers des bins qui respectent la capacité.",
          "Split putaway (e.g. 500 + 100) into bins that respect capacity.",
        ),
      },
      {
        id: "c",
        label: L(
          "Laisser 600 au quai jusqu’à agrandir le bin.",
          "Leave 600 at the dock until the bin is enlarged.",
        ),
      },
      {
        id: "d",
        label: L(
          "Modifier le max à 600 pour clôturer plus vite.",
          "Change max to 600 to close faster.",
        ),
      },
    ],
    correctId: "b",
    competence: L("Respect de la capacité bin", "Bin capacity compliance"),
    whyRight: L(
      "Réponse correcte : on scinde le putaway. La capacité protège la sécurité, l’accessibilité et la vérité de localisation.",
      "Correct answer: split the putaway. Capacity protects safety, accessibility and location truth.",
    ),
    whyWrong: {
      a: L(
        "Réponse incorrecte : forcer 600 viole la capacité. Conséquence : surcharge, picking dangereux, stock mal localisé.",
        "Incorrect answer: forcing 600 violates capacity. Consequence: overload, unsafe picking, poorly located stock.",
      ),
      c: L(
        "Réponse incorrecte : saturer le quai n’exécute pas le rangement. L’issue capacité n’est pas traitée.",
        "Incorrect answer: saturating the dock does not execute putaway. The capacity issue is not handled.",
      ),
      d: L(
        "Réponse incorrecte : changer le max pour « faire passer » falsifie la règle d’entrepôt.",
        "Incorrect answer: changing max to “make it fit” falsifies the warehouse rule.",
      ),
    },
    errorType: L("Surcharge de bin", "Bin overload"),
  },
  {
    id: "m2p3",
    prompt: L(
      "Trois lots du même SKU : LOT-A (plus ancien), LOT-B, LOT-C (plus récent). Quel lot prélever en FIFO ?",
      "Three lots of the same SKU: LOT-A (oldest), LOT-B, LOT-C (newest). Which lot to pick under FIFO?",
    ),
    context: L(
      "Issue : l’opérateur voit LOT-C plus accessible en allée.",
      "Issue: the operator sees LOT-C as more accessible in the aisle.",
    ),
    options: [
      {
        id: "a",
        label: L("LOT-C, le plus proche, pour la productivité.", "LOT-C, the closest, for productivity."),
      },
      {
        id: "b",
        label: L("LOT-B, un compromis « ni trop vieux ni trop neuf ».", "LOT-B, a compromise “neither too old nor too new”."),
      },
      {
        id: "c",
        label: L(
          "LOT-A, le plus ancien, conformément à FIFO.",
          "LOT-A, the oldest, according to FIFO.",
        ),
      },
      {
        id: "d",
        label: L(
          "N’importe lequel : FIFO ne s’applique qu’aux produits alimentaires.",
          "Any lot: FIFO only applies to food products.",
        ),
      },
    ],
    correctId: "c",
    competence: L("FIFO — premier entré, premier sorti", "FIFO — first in, first out"),
    whyRight: L(
      "Réponse correcte : FIFO sort le lot le plus ancien. La proximité n’autorise pas à brûler le stock récent.",
      "Correct answer: FIFO issues the oldest lot. Proximity does not allow burning newest stock.",
    ),
    whyWrong: {
      a: L(
        "Réponse incorrecte : picker le lot récent viole FIFO. Conséquence : péremption / obsolescence du lot ancien.",
        "Incorrect answer: picking the newest lot violates FIFO. Consequence: expiry / obsolescence of the old lot.",
      ),
      b: L(
        "Réponse incorrecte : un « compromis » n’est pas FIFO. La règle est binaire : plus ancien d’abord.",
        "Incorrect answer: a “compromise” is not FIFO. The rule is binary: oldest first.",
      ),
      d: L(
        "Réponse incorrecte : FIFO est une règle d’exécution d’entrepôt, pas seulement alimentaire.",
        "Incorrect answer: FIFO is a warehouse execution rule, not food-only.",
      ),
    },
    errorType: L("Violation FIFO", "FIFO violation"),
  },
  {
    id: "m2p4",
    prompt: L(
      "Le stock système d’un bin ne correspond plus au physique après putaway. Première action ?",
      "System stock of a bin no longer matches physical after putaway. First action?",
    ),
    context: L(
      "Issue : précision d’inventaire. L’erreur peut venir d’un mauvais bin ou d’une quantité.",
      "Issue: inventory accuracy. The error may come from a wrong bin or quantity.",
    ),
    options: [
      {
        id: "a",
        label: L(
          "Ajuster silencieusement le système pour coller au physique, sans retracer le mouvement.",
          "Silently adjust the system to match physical, without tracing the movement.",
        ),
      },
      {
        id: "b",
        label: L(
          "Vérifier le mouvement de rangement (SKU, bin, qty), puis mesurer l’écart.",
          "Verify the putaway movement (SKU, bin, qty), then measure the variance.",
        ),
      },
      {
        id: "c",
        label: L(
          "Vider tous les bins du SKU pour « repartir propre ».",
          "Empty all bins of the SKU to “start clean”.",
        ),
      },
      {
        id: "d",
        label: L(
          "Ignorer : M2 ne traite pas la précision.",
          "Ignore it: M2 does not cover accuracy.",
        ),
      },
    ],
    correctId: "b",
    competence: L("Précision d’inventaire après exécution", "Inventory accuracy after execution"),
    whyRight: L(
      "Réponse correcte : on retrace d’abord le mouvement. Un ADJ aveugle masque l’erreur d’exécution.",
      "Correct answer: retrace the movement first. A blind ADJ hides the execution error.",
    ),
    whyWrong: {
      a: L(
        "Réponse incorrecte : un ajustement sans investigation viole la traçabilité du putaway.",
        "Incorrect answer: an adjustment without investigation violates putaway traceability.",
      ),
      c: L(
        "Réponse incorrecte : vider tous les bins détruit la localisation au lieu de la corriger.",
        "Incorrect answer: emptying all bins destroys location instead of correcting it.",
      ),
      d: L(
        "Réponse incorrecte : la précision fait partie de l’exécution M2 (stock accuracy).",
        "Incorrect answer: accuracy is part of M2 execution (stock accuracy).",
      ),
    },
    errorType: L("Ajustement aveugle", "Blind adjustment"),
  },
];

export const M2_CONS_MCQ: McqItem[] = [
  {
    id: "m2c1",
    prompt: L(
      "600 unités arrivent ; le bin cible affiche déjà 50 / 500. Comment ranger ?",
      "600 units arrive; the target bin already shows 50 / 500. How to put away?",
    ),
    context: L(
      "Nouvelle situation : capacité résiduelle 450, pas 500. L’opérateur veut tout mettre « comme d’habitude ».",
      "New situation: residual capacity 450, not 500. The operator wants to put everything “as usual”.",
    ),
    options: [
      {
        id: "a",
        label: L("Ranger 600 dans ce bin : 50+600, on verra.", "Put 600 in this bin: 50+600, we’ll see."),
      },
      {
        id: "b",
        label: L(
          "Ranger au plus 450 ici et le reliquat dans un second bin compatible.",
          "Put away at most 450 here and the remainder in a second compatible bin.",
        ),
      },
      {
        id: "c",
        label: L("Renvoyer les 600 au fournisseur.", "Return all 600 to the supplier."),
      },
      {
        id: "d",
        label: L("Écraser les 50 existantes pour faire de la place.", "Overwrite the existing 50 to make room."),
      },
    ],
    correctId: "b",
    competence: L("Capacité résiduelle, pas capacité nominale", "Residual capacity, not nominal capacity"),
    whyRight: L(
      "Réponse correcte : on calcule la place restante. 500 est le max, pas un droit à ranger 500 de plus.",
      "Correct answer: compute remaining space. 500 is the max, not a right to put away 500 more.",
    ),
    whyWrong: {
      a: L(
        "Réponse incorrecte : 50+600 = 650 > 500. Surcharge. Règle de capacité violée.",
        "Incorrect answer: 50+600 = 650 > 500. Overload. Capacity rule violated.",
      ),
      c: L(
        "Réponse incorrecte : le refus total n’est pas requis si un split de bins est possible.",
        "Incorrect answer: a total refusal is not required if a bin split is possible.",
      ),
      d: L(
        "Réponse incorrecte : écraser le stock existant détruit la traçabilité et crée un écart.",
        "Incorrect answer: overwriting existing stock destroys traceability and creates a variance.",
      ),
    },
    errorType: L("Capacité nominale mal lue", "Misread nominal capacity"),
  },
  {
    id: "m2c2",
    prompt: L(
      "Le lot le plus ancien est au fond du bin, le récent devant. FIFO sous pression picking ?",
      "The oldest lot is at the back of the bin, the newest in front. FIFO under picking pressure?",
    ),
    context: L(
      "Issue : temps de picking. La tentation est de prendre ce qui est accessible.",
      "Issue: picking time. Temptation is to take what is accessible.",
    ),
    options: [
      {
        id: "a",
        label: L(
          "Prendre le lot avant : FIFO « pratique ».",
          "Take the front lot: “practical” FIFO.",
        ),
      },
      {
        id: "b",
        label: L(
          "Prélever le lot le plus ancien, quitte à réorganiser l’accès.",
          "Pick the oldest lot, even if access must be reorganized.",
        ),
      },
      {
        id: "c",
        label: L(
          "Mélanger les lots dans un seul prélèvement pour équilibrer.",
          "Mix lots in a single pick to balance.",
        ),
      },
      {
        id: "d",
        label: L(
          "Changer la date du lot récent pour le faire passer ancien.",
          "Change the newest lot date so it counts as oldest.",
        ),
      },
    ],
    correctId: "b",
    competence: L("FIFO malgré la contrainte d’accès", "FIFO despite access constraint"),
    whyRight: L(
      "Réponse correcte : FIFO suit l’âge du lot, pas la facilité d’accès. On réorganise si besoin.",
      "Correct answer: FIFO follows lot age, not access convenience. Reorganize if needed.",
    ),
    whyWrong: {
      a: L(
        "Réponse incorrecte : « FIFO pratique » est une violation FIFO. Conséquence : vieillissement du stock arrière.",
        "Incorrect answer: “practical FIFO” is a FIFO violation. Consequence: aging of back stock.",
      ),
      c: L(
        "Réponse incorrecte : mélanger les lots casse la traçabilité de lot.",
        "Incorrect answer: mixing lots breaks lot traceability.",
      ),
      d: L(
        "Réponse incorrecte : falsifier une date de lot est une fraude d’exécution.",
        "Incorrect answer: falsifying a lot date is an execution fraud.",
      ),
    },
    errorType: L("FIFO de commodité", "Convenience FIFO"),
  },
  {
    id: "m2c3",
    prompt: L(
      "Un putaway a été saisi vers un bin d’EXPÉDITION par erreur. Décision ?",
      "A putaway was entered to a SHIPPING bin by mistake. Decision?",
    ),
    context: L(
      "Issue : mauvaise zone. Le stock n’est plus pickable proprement.",
      "Issue: wrong zone. Stock is no longer cleanly pickable.",
    ),
    options: [
      {
        id: "a",
        label: L(
          "Laisser : si le GI part de là, c’est plus rapide.",
          "Leave it: if GI leaves from there, it is faster.",
        ),
      },
      {
        id: "b",
        label: L(
          "Corriger par un mouvement vers STOCKAGE conforme, puis vérifier la quantité.",
          "Correct with a movement to compliant STORAGE, then verify quantity.",
        ),
      },
      {
        id: "c",
        label: L(
          "Créer un nouveau SKU pour isoler l’erreur.",
          "Create a new SKU to isolate the error.",
        ),
      },
      {
        id: "d",
        label: L(
          "Mettre la quantité à zéro en EXPÉDITION sans mouvement inverse.",
          "Set quantity to zero in SHIPPING without a reverse movement.",
        ),
      },
    ],
    correctId: "b",
    competence: L("Correction de zone après putaway", "Zone correction after putaway"),
    whyRight: L(
      "Réponse correcte : on replace le stock dans la bonne zone par un mouvement tracé.",
      "Correct answer: move stock back to the correct zone with a traced movement.",
    ),
    whyWrong: {
      a: L(
        "Réponse incorrecte : stocker en EXPÉDITION mélange les flux et fausse le picking.",
        "Incorrect answer: storing in SHIPPING mixes flows and distorts picking.",
      ),
      c: L(
        "Réponse incorrecte : un nouveau SKU masque l’erreur de localisation au lieu de la corriger.",
        "Incorrect answer: a new SKU hides the location error instead of correcting it.",
      ),
      d: L(
        "Réponse incorrecte : zéro sans mouvement inverse crée un écart et une perte de traçabilité.",
        "Incorrect answer: zeroing without a reverse movement creates a variance and lost traceability.",
      ),
    },
    errorType: L("Zone de rangement erronée", "Wrong putaway zone"),
  },
  {
    id: "m2c4",
    prompt: L(
      "Pourquoi FIFO et capacité se lisent ensemble, pas séparément ?",
      "Why are FIFO and capacity read together, not separately?",
    ),
    context: L(
      "Consolidation M2 : une bonne localisation sans FIFO (ou l’inverse) reste une exécution incomplète.",
      "M2 consolidation: good location without FIFO (or the reverse) remains incomplete execution.",
    ),
    options: [
      {
        id: "a",
        label: L(
          "Parce que le score M2 exige les deux compétences sur des issues différentes.",
          "Because the M2 score requires both competencies on different issues.",
        ),
      },
      {
        id: "b",
        label: L(
          "Un bin bien dimensionné avec le mauvais lot, ou le bon lot dans un bin saturé, crée quand même une erreur opérationnelle.",
          "A well-sized bin with the wrong lot, or the right lot in a saturated bin, still creates an operational error.",
        ),
      },
      {
        id: "c",
        label: L(
          "FIFO remplace la capacité si le lot est ancien.",
          "FIFO replaces capacity if the lot is old.",
        ),
      },
      {
        id: "d",
        label: L(
          "La capacité remplace FIFO si le bin est vide.",
          "Capacity replaces FIFO if the bin is empty.",
        ),
      },
    ],
    correctId: "b",
    competence: L("Lecture conjointe FIFO + capacité", "Joint FIFO + capacity reading"),
    whyRight: L(
      "Réponse correcte : chaque règle évite un type d’erreur différent. Les deux sont nécessaires à une exécution propre.",
      "Correct answer: each rule prevents a different error type. Both are required for clean execution.",
    ),
    whyWrong: {
      a: L(
        "Réponse incorrecte : ce n’est pas « pour le score ». C’est pour ne pas créer une nouvelle issue en corrigeant l’autre.",
        "Incorrect answer: it is not “for the score”. It is to avoid creating a new issue while fixing the other.",
      ),
      c: L(
        "Réponse incorrecte : l’âge du lot n’autorise pas la surcharge.",
        "Incorrect answer: lot age does not authorize overload.",
      ),
      d: L(
        "Réponse incorrecte : un bin vide n’annule pas FIFO sur les autres emplacements du SKU.",
        "Incorrect answer: an empty bin does not cancel FIFO on the SKU’s other locations.",
      ),
    },
    errorType: L("Règle unique substituée", "Single-rule substitution"),
  },
];

export const M3_PREP_MCQ: McqItem[] = [
  {
    id: "m3p1",
    prompt: L(
      "Un écart de cycle count est détecté. Que faire ?",
      "A cycle-count variance is detected. What should you do?",
    ),
    context: L(
      "Issue : système ≠ physique. L’équipe discute d’ignorer, de reconter, ou d’ajuster.",
      "Issue: system ≠ physical. The team discusses ignoring, recounting, or adjusting.",
    ),
    options: [
      {
        id: "a",
        label: L(
          "Ignorer si l’écart « n’est pas trop grand ».",
          "Ignore it if the variance is “not too large”.",
        ),
      },
      {
        id: "b",
        label: L(
          "Réconcilier l’écart (preuve physique vs système) puis ajuster de façon documentée si confirmé.",
          "Reconcile the variance (physical vs system evidence) then adjust in a documented way if confirmed.",
        ),
      },
      {
        id: "c",
        label: L(
          "Modifier le comptage pour coller au système.",
          "Change the count to match the system.",
        ),
      },
      {
        id: "d",
        label: L(
          "Commander tout de suite la quantité d’écart en urgence, sans réconciliation.",
          "Immediately order the variance quantity as an emergency, without reconciliation.",
        ),
      },
    ],
    correctId: "b",
    competence: L("Réconciliation d’écart d’inventaire", "Inventory variance reconciliation"),
    whyRight: L(
      "Réponse correcte : on réconcilie d’abord. L’ajustement documente l’écart confirmé, il ne le masque pas.",
      "Correct answer: reconcile first. Adjustment documents a confirmed variance; it does not hide it.",
    ),
    whyWrong: {
      a: L(
        "Réponse incorrecte : un petit écart non traité devient une dérive. Règle : système = réalité.",
        "Incorrect answer: an untreated small variance becomes drift. Rule: system = reality.",
      ),
      c: L(
        "Réponse incorrecte : coller le physique au système détruit la preuve du comptage.",
        "Incorrect answer: forcing physical to match the system destroys count evidence.",
      ),
      d: L(
        "Réponse incorrecte : commander l’écart sans réconciliation peut acheter un problème de qualité/localisation, pas un vrai déficit.",
        "Incorrect answer: ordering the variance without reconciliation may buy a quality/location problem, not a true deficit.",
      ),
    },
    errorType: L("Écart non réconcilié", "Unreconciled variance"),
  },
  {
    id: "m3p2",
    prompt: L(
      "L’écart dépasse le seuil de tolérance. Quelle décision ?",
      "The variance exceeds the tolerance threshold. What decision?",
    ),
    context: L(
      "Issue : grand écart. Un ADJ est probable, mais pas un geste « cosmétique ».",
      "Issue: large variance. An ADJ is likely, but not a cosmetic gesture.",
    ),
    options: [
      {
        id: "a",
        label: L(
          "Ajuster immédiatement à l’aveugle pour clôturer le scénario.",
          "Adjust immediately blindly to close the scenario.",
        ),
      },
      {
        id: "b",
        label: L(
          "Confirmer le physique, justifier l’écart, puis poster l’ajustement (ADJ) de la variance réelle.",
          "Confirm physical, justify the variance, then post the adjustment (ADJ) of the real variance.",
        ),
      },
      {
        id: "c",
        label: L(
          "Reporter l’écart sur un autre SKU plus « discret ».",
          "Shift the variance onto another more “discreet” SKU.",
        ),
      },
      {
        id: "d",
        label: L(
          "Augmenter le seuil de tolérance jusqu’à ce que l’écart passe.",
          "Raise the tolerance threshold until the variance passes.",
        ),
      },
    ],
    correctId: "b",
    competence: L("Ajustement justifié au-delà du seuil", "Justified adjustment beyond threshold"),
    whyRight: L(
      "Réponse correcte : grand écart = investigation + ADJ de la variance constatée. Pas de maquillage de seuil.",
      "Correct answer: large variance = investigation + ADJ of the observed variance. No threshold cosmetics.",
    ),
    whyWrong: {
      a: L(
        "Réponse incorrecte : un ADJ aveugle peut amplifier l’erreur de comptage. Compétence violée : justification.",
        "Incorrect answer: a blind ADJ can amplify a count error. Competency violated: justification.",
      ),
      c: L(
        "Réponse incorrecte : transférer l’écart sur un autre SKU est une falsification.",
        "Incorrect answer: moving the variance onto another SKU is falsification.",
      ),
      d: L(
        "Réponse incorrecte : changer le seuil pour « faire passer » casse le contrôle interne.",
        "Incorrect answer: changing the threshold to “make it pass” breaks internal control.",
      ),
    },
    errorType: L("Ajustement non justifié", "Unjustified adjustment"),
  },
  {
    id: "m3p3",
    prompt: L(
      "Le stock d’un SKU passe sous le minimum. Quelle action de réappro ?",
      "A SKU’s stock falls below minimum. What replenishment action?",
    ),
    context: L(
      "Issue : paramètre Min/Max. L’opérateur hésite entre commander le max, le déficit, ou rien.",
      "Issue: Min/Max parameter. The operator hesitates between ordering max, the deficit, or nothing.",
    ),
    options: [
      {
        id: "a",
        label: L(
          "Ne rien faire : le minimum n’est qu’un indicateur visuel.",
          "Do nothing: minimum is only a visual indicator.",
        ),
      },
      {
        id: "b",
        label: L(
          "Proposer une quantité qui ramène le stock dans la bande Min/Max (souvent vers le max), selon la règle du scénario.",
          "Propose a quantity that brings stock back into the Min/Max band (often toward max), according to the scenario rule.",
        ),
      },
      {
        id: "c",
        label: L(
          "Commander dix fois le max « pour ne plus en parler ».",
          "Order ten times the max “so we never talk about it again”.",
        ),
      },
      {
        id: "d",
        label: L(
          "Baisser le minimum à la quantité actuelle.",
          "Lower the minimum to the current quantity.",
        ),
      },
    ],
    correctId: "b",
    competence: L("Déclenchement Min/Max", "Min/Max trigger"),
    whyRight: L(
      "Réponse correcte : sous le min, on réapprovisionne pour revenir dans la bande, pas pour spéculer ni pour changer la règle.",
      "Correct answer: below min, replenish to return into the band — not to speculate or to change the rule.",
    ),
    whyWrong: {
      a: L(
        "Réponse incorrecte : ignorer le min expose à la rupture. Règle de réappro violée.",
        "Incorrect answer: ignoring min exposes a stockout. Replenishment rule violated.",
      ),
      c: L(
        "Réponse incorrecte : sur-commander crée du surstock et immobilise du capital.",
        "Incorrect answer: over-ordering creates overstock and ties up capital.",
      ),
      d: L(
        "Réponse incorrecte : baisser le min pour éviter l’action falsifie le paramètre de contrôle.",
        "Incorrect answer: lowering min to avoid action falsifies the control parameter.",
      ),
    },
    errorType: L("Réappro hors bande Min/Max", "Replenishment outside Min/Max band"),
  },
  {
    id: "m3p4",
    prompt: L(
      "Quelle preuve est prioritaire pour décider un écart : physique ou système ?",
      "Which evidence is priority for a variance decision: physical or system?",
    ),
    context: L(
      "Issue : conflit d’affichage. Le système est « officiel », le comptage est « gênant ».",
      "Issue: display conflict. The system is “official”, the count is “inconvenient”.",
    ),
    options: [
      {
        id: "a",
        label: L(
          "Le système : il est déjà dans l’ERP.",
          "The system: it is already in the ERP.",
        ),
      },
      {
        id: "b",
        label: L(
          "Le physique constaté, puis le système est aligné par un mouvement / ADJ tracé.",
          "Observed physical, then the system is aligned by a traced movement / ADJ.",
        ),
      },
      {
        id: "c",
        label: L(
          "La plus haute des deux quantités, pour protéger le service.",
          "The higher of the two quantities, to protect service.",
        ),
      },
      {
        id: "d",
        label: L(
          "Aucune : on attend la prochaine réception.",
          "Neither: wait for the next receipt.",
        ),
      },
    ],
    correctId: "b",
    competence: L("Hiérarchie de preuve d’inventaire", "Inventory evidence hierarchy"),
    whyRight: L(
      "Réponse correcte : le physique est la preuve de terrain. Le système s’aligne par un document, il ne dicte pas le comptage.",
      "Correct answer: physical is the floor evidence. The system is aligned by a document; it does not dictate the count.",
    ),
    whyWrong: {
      a: L(
        "Réponse incorrecte : traiter le système comme vérité ignore l’écart. Conséquence : stock fantôme ou rupture cachée.",
        "Incorrect answer: treating the system as truth ignores the variance. Consequence: ghost stock or hidden stockout.",
      ),
      c: L(
        "Réponse incorrecte : prendre le max des deux n’est pas une preuve, c’est un espoir de service.",
        "Incorrect answer: taking the max of the two is not evidence, it is a service hope.",
      ),
      d: L(
        "Réponse incorrecte : reporter laisse l’écart ouvert. Le contrôle d’inventaire n’a pas lieu.",
        "Incorrect answer: postponing leaves the variance open. Inventory control does not happen.",
      ),
    },
    errorType: L("Preuve système priorisée à tort", "System evidence wrongly prioritized"),
  },
];

export const M3_CONS_MCQ: McqItem[] = [
  {
    id: "m3c1",
    prompt: L(
      "Après SCN : un SKU est sous le min ET présente un écart de comptage non réconcilié. Priorité ?",
      "After SCN: a SKU is below min AND has an unreconciled count variance. Priority?",
    ),
    context: L(
      "Nouvelle situation : deux issues en même temps. Réappro sur une quantité fausse serait dangereux.",
      "New situation: two issues at once. Replenishing on a false quantity would be dangerous.",
    ),
    options: [
      {
        id: "a",
        label: L(
          "Réapprovisionner d’abord, l’écart se verra plus tard.",
          "Replenish first; the variance can wait.",
        ),
      },
      {
        id: "b",
        label: L(
          "Réconcilier / ajuster le stock vrai, puis calculer le réappro sur la quantité corrigée.",
          "Reconcile / adjust to true stock, then compute replenishment on the corrected quantity.",
        ),
      },
      {
        id: "c",
        label: L(
          "Annuler le min pour ne plus être en alerte.",
          "Cancel the min so the alert disappears.",
        ),
      },
      {
        id: "d",
        label: L(
          "Faire les deux en parallèle sans ordre : ADJ et commande max.",
          "Do both in parallel with no order: ADJ and max order.",
        ),
      },
    ],
    correctId: "b",
    competence: L("Ordre : vérité stock puis réappro", "Order: stock truth then replenishment"),
    whyRight: L(
      "Réponse correcte : on ne calcule pas un réappro sur un stock non réconcilié. D’abord la preuve, ensuite le paramètre Min/Max.",
      "Correct answer: do not compute replenishment on unreconciled stock. Evidence first, then the Min/Max parameter.",
    ),
    whyWrong: {
      a: L(
        "Réponse incorrecte : réapprovisionner sur un stock faux peut sur- ou sous-commander. Compétence violée : base fiable.",
        "Incorrect answer: replenishing on false stock can over- or under-order. Competency violated: reliable base.",
      ),
      c: L(
        "Réponse incorrecte : supprimer le min masque l’alerte sans traiter ni l’écart ni le risque de rupture.",
        "Incorrect answer: removing min hides the alert without treating the variance or the stockout risk.",
      ),
      d: L(
        "Réponse incorrecte : sans ordre, l’ADJ et la commande se marchent dessus. Conséquence : double correction.",
        "Incorrect answer: without order, ADJ and the order collide. Consequence: double correction.",
      ),
    },
    errorType: L("Réappro sur stock non réconcilié", "Replenishment on unreconciled stock"),
  },
  {
    id: "m3c2",
    prompt: L(
      "Un ADJ de −40 vient d’être posté. Le min est 50, le max 120, le stock corrigé 30. Quantité de réappro cohérente ?",
      "An ADJ of −40 has just been posted. Min is 50, max 120, corrected stock 30. Coherent replenishment qty?",
    ),
    context: L(
      "Issue : après ajustement, le stock vrai est sous le min. On vise la bande, pas un chiffre inventé.",
      "Issue: after adjustment, true stock is below min. Aim for the band, not an invented number.",
    ),
    options: [
      {
        id: "a",
        label: L("0 — l’ADJ a déjà « corrigé » le besoin.", "0 — the ADJ already “fixed” the need."),
      },
      {
        id: "b",
        label: L(
          "Une quantité qui ramène vers le max (ex. 90), calculée sur 30 et non sur l’ancien système.",
          "A quantity that returns toward max (e.g. 90), calculated on 30 not on the old system qty.",
        ),
      },
      {
        id: "c",
        label: L("40 — exactement l’inverse de l’ADJ.", "40 — exactly the inverse of the ADJ."),
      },
      {
        id: "d",
        label: L("120 — commander le max sans regarder le stock actuel.", "120 — order the max without looking at current stock."),
      },
    ],
    correctId: "b",
    competence: L("Réappro calculé après ADJ", "Replenishment calculated after ADJ"),
    whyRight: L(
      "Réponse correcte : Q se calcule sur le stock corrigé. L’ADJ n’est pas un substitut de réappro ; commander le max aveugle survitamine.",
      "Correct answer: Q is calculated on corrected stock. ADJ is not a replenishment substitute; blindly ordering max overshoots.",
    ),
    whyWrong: {
      a: L(
        "Réponse incorrecte : l’ADJ aligne le système, il ne reconstitue pas le stock manquant sous le min.",
        "Incorrect answer: ADJ aligns the system; it does not rebuild missing stock below min.",
      ),
      c: L(
        "Réponse incorrecte : inverser l’ADJ n’a aucun lien avec Min/Max. C’est une fausse symétrie.",
        "Incorrect answer: inverting the ADJ has no link to Min/Max. It is a false symmetry.",
      ),
      d: L(
        "Réponse incorrecte : commander 120 en ayant déjà 30 vise 150, au-delà du max.",
        "Incorrect answer: ordering 120 while already holding 30 targets 150, above max.",
      ),
    },
    errorType: L("Quantité de réappro mal ancrée", "Poorly anchored replenishment qty"),
  },
  {
    id: "m3c3",
    prompt: L(
      "Pourquoi un écart « dans le seuil » doit quand même être saisi au comptage ?",
      "Why must a variance “inside the threshold” still be entered at count?",
    ),
    context: L(
      "Issue : l’équipe croit que sous le seuil = pas de saisie.",
      "Issue: the team believes below threshold = no entry.",
    ),
    options: [
      {
        id: "a",
        label: L(
          "Parce que le seuil décide si on ajuste, pas si on ment sur le physique.",
          "Because the threshold decides whether we adjust, not whether we lie about physical.",
        ),
      },
      {
        id: "b",
        label: L(
          "Ce n’est pas obligatoire : sous le seuil on recopie le système.",
          "It is not mandatory: below threshold we copy the system.",
        ),
      },
      {
        id: "c",
        label: L(
          "Uniquement pour les audits externes, pas pour le WMS.",
          "Only for external audits, not for the WMS.",
        ),
      },
      {
        id: "d",
        label: L(
          "Pour faire monter le score de mission.",
          "To raise the mission score.",
        ),
      },
    ],
    correctId: "a",
    competence: L("Seuil d’ajustement ≠ vérité de comptage", "Adjustment threshold ≠ count truth"),
    whyRight: L(
      "Réponse correcte : on saisit toujours le physique. Le seuil oriente l’ADJ, il n’autorise pas à falsifier le comptage.",
      "Correct answer: always enter physical. The threshold guides ADJ; it does not authorize falsifying the count.",
    ),
    whyWrong: {
      b: L(
        "Réponse incorrecte : recopier le système sous le seuil recrée exactement l’erreur de masquage.",
        "Incorrect answer: copying the system below threshold recreates the concealment error.",
      ),
      c: L(
        "Réponse incorrecte : le WMS a besoin de la preuve pour rester système = réalité, pas seulement l’audit.",
        "Incorrect answer: the WMS needs the evidence to stay system = reality, not only the audit.",
      ),
      d: L(
        "Réponse incorrecte : on ne saisit pas une quantité « pour le score ». On saisit la preuve.",
        "Incorrect answer: we do not enter a quantity “for the score”. We enter the evidence.",
      ),
    },
    errorType: L("Seuil utilisé comme permission de masquer", "Threshold used as permission to hide"),
  },
  {
    id: "m3c4",
    prompt: L(
      "Quelle lecture relie cycle count, ADJ et Min/Max en une seule chaîne professionnelle ?",
      "Which reading links cycle count, ADJ and Min/Max into one professional chain?",
    ),
    context: L(
      "Consolidation M3 : chaque étape prépare la suivante ; aucune ne la remplace.",
      "M3 consolidation: each step prepares the next; none replaces it.",
    ),
    options: [
      {
        id: "a",
        label: L(
          "Compter n’importe comment, ajuster pour le score, commander le max.",
          "Count any way, adjust for score, order the max.",
        ),
      },
      {
        id: "b",
        label: L(
          "Preuve physique → écart expliqué → ADJ si confirmé → réappro calculé sur stock vrai.",
          "Physical evidence → explained variance → ADJ if confirmed → replenishment calculated on true stock.",
        ),
      },
      {
        id: "c",
        label: L(
          "Min/Max d’abord, le comptage ensuite si le réappro échoue.",
          "Min/Max first, counting later if replenishment fails.",
        ),
      },
      {
        id: "d",
        label: L(
          "ADJ systématique à chaque mission, même sans écart.",
          "Systematic ADJ on every mission, even without variance.",
        ),
      },
    ],
    correctId: "b",
    competence: L("Chaîne de contrôle d’inventaire", "Inventory control chain"),
    whyRight: L(
      "Réponse correcte : c’est la même logique que le module — preuve, décision, document, puis paramètre de réappro.",
      "Correct answer: it is the same logic as the module — evidence, decision, document, then replenishment parameter.",
    ),
    whyWrong: {
      a: L(
        "Réponse incorrecte : optimiser le score casse la chaîne. Conséquence : stock faux et commande aveugle.",
        "Incorrect answer: optimizing for score breaks the chain. Consequence: false stock and blind orders.",
      ),
      c: L(
        "Réponse incorrecte : réapprovisionner avant de connaître le stock vrai inverse la séquence M3.",
        "Incorrect answer: replenishing before knowing true stock reverses the M3 sequence.",
      ),
      d: L(
        "Réponse incorrecte : un ADJ sans écart crée un mouvement fictif. Ce n’est pas du contrôle.",
        "Incorrect answer: an ADJ without variance creates a fictitious movement. That is not control.",
      ),
    },
    errorType: L("Chaîne M3 brisée", "Broken M3 chain"),
  },
];

const BANKS: Partial<Record<FormativeExerciseId, McqItem[]>> = {
  "M1-PREP-RECEIVING-SEQUENCE": M1_PREP_MCQ,
  "M1-CONS-OPERATIONAL-DECISION": M1_CONS_MCQ,
  "M2-PREP-PUTAWAY-FIFO": M2_PREP_MCQ,
  "M2-CONS-EXECUTION-DECISION": M2_CONS_MCQ,
  "M3-PREP-INVENTORY-CONTROL": M3_PREP_MCQ,
  "M3-CONS-VARIANCE-REPLENISH": M3_CONS_MCQ,
};

export function getM1M3McqBank(exerciseId: FormativeExerciseId): McqItem[] | null {
  return BANKS[exerciseId] ?? null;
}

export function listM1M3McqExerciseIds(): FormativeExerciseId[] {
  return Object.keys(BANKS) as FormativeExerciseId[];
}
