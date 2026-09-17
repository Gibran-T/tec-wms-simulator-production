/**
 * M1–M3 in-mission operational decisions (A–D, one correct).
 * UI-gated; transaction APIs stay backward compatible for tests/certification.
 */
export type LocalizedPair = { fr: string; en: string };

export type M1M3DecisionOption = {
  id: string;
  label: LocalizedPair;
  isCorrect: boolean;
  whyWrong?: LocalizedPair;
  whyRight?: LocalizedPair;
};

export type M1M3DecisionQuestion = {
  scnCode: string;
  step: string;
  competence: LocalizedPair;
  errorType: LocalizedPair;
  prompt: LocalizedPair;
  context: LocalizedPair;
  options: M1M3DecisionOption[];
};

export const M1M3_DECISION_WRONG_PENALTY_EVAL = -5;
export const M1M3_DECISION_WRONG_PENALTY_DEMO = -2;

function q(partial: M1M3DecisionQuestion): M1M3DecisionQuestion {
  const correct = partial.options.filter((o) => o.isCorrect);
  if (correct.length !== 1) {
    throw new Error(`Decision ${partial.scnCode}/${partial.step} must have exactly one correct option`);
  }
  return partial;
}

const QUESTIONS: M1M3DecisionQuestion[] = [
  q({
    scnCode: "SCN-001",
    step: "GR",
    competence: { fr: "Séquence de réception", en: "Receiving sequence" },
    errorType: { fr: "Disponibilisation prématurée", en: "Premature availability" },
    prompt: {
      fr: "Le camion est au quai. Quelle décision rend le produit disponible en stock de façon conforme ?",
      en: "The truck is at the dock. Which decision makes the product available in stock in a compliant way?",
    },
    context: {
      fr: "Issue : l’équipe veut libérer le SKU pour une commande urgente avant la validation d’entrée.",
      en: "Issue: the team wants to release the SKU for an urgent order before inbound validation.",
    },
    options: [
      {
        id: "a",
        label: { fr: "Déclarer le stock disponible dès l’arrivée physique au quai.", en: "Declare stock available as soon as it physically arrives at the dock." },
        isCorrect: false,
        whyWrong: {
          fr: "Réponse incorrecte : cette décision ne respecte pas la séquence opérationnelle du réception. Le produit ne doit pas être disponibilisé en stock avant la validation et le registre correct de l’entrée.",
          en: "Incorrect answer: this decision does not respect the receiving sequence. The product must not be made available before inbound validation and correct posting.",
        },
      },
      {
        id: "b",
        label: { fr: "Valider l’entrée (GR postée), ranger, puis seulement alors disponibiliser.", en: "Validate inbound (posted GR), put away, then make available." },
        isCorrect: true,
        whyRight: {
          fr: "Réponse correcte : l’entrée doit être validée avant la disponibilisation du produit en stock, garantissant traçabilité et conformité.",
          en: "Correct answer: inbound must be validated before the product is made available in stock, ensuring traceability and compliance.",
        },
      },
      {
        id: "c",
        label: { fr: "Créer seulement la PO : cela suffit pour vendre.", en: "Create only the PO: that is enough to sell." },
        isCorrect: false,
        whyWrong: {
          fr: "Réponse incorrecte : la PO n’est pas un stock. Conséquence : vente sur du stock inexistant. Règle violée : disponibilité réelle.",
          en: "Incorrect answer: a PO is not stock. Consequence: selling non-existent stock. Rule violated: true availability.",
        },
      },
      {
        id: "d",
        label: { fr: "Attendre le cycle count pour toute entrée.", en: "Wait for cycle count for every inbound." },
        isCorrect: false,
        whyWrong: {
          fr: "Réponse incorrecte : le cycle count vérifie un stock déjà enregistré, il ne remplace pas la GR.",
          en: "Incorrect answer: cycle count verifies already recorded stock; it does not replace GR.",
        },
      },
    ],
  }),
  q({
    scnCode: "SCN-002",
    step: "GR",
    competence: { fr: "Régularisation GR fantôme", en: "Ghost GR regularization" },
    errorType: { fr: "Duplication documentaire", en: "Document duplication" },
    prompt: {
      fr: "Un GR existe déjà, non posté. Quelle est la décision professionnelle ?",
      en: "A GR already exists, unposted. What is the professional decision?",
    },
    context: {
      fr: "Issue : document fantôme dans le moniteur. Un second GR « pour rattraper » aggraverait l’écart.",
      en: "Issue: ghost document in the monitor. A second GR “to catch up” would worsen the variance.",
    },
    options: [
      {
        id: "a",
        label: { fr: "Créer un nouveau GR pour aller plus vite.", en: "Create a new GR to go faster." },
        isCorrect: false,
        whyWrong: {
          fr: "Réponse incorrecte : un second GR double l’entrée. Conséquence : stock fantôme. Règle violée : un document d’entrée par flux réel.",
          en: "Incorrect answer: a second GR doubles inbound. Consequence: ghost stock. Rule violated: one inbound document per real flow.",
        },
      },
      {
        id: "b",
        label: { fr: "Ignorer le document et ranger directement en STOCKAGE.", en: "Ignore the document and put away directly into STORAGE." },
        isCorrect: false,
        whyWrong: {
          fr: "Réponse incorrecte : ranger sans poster casse le lien document → stock.",
          en: "Incorrect answer: putaway without posting breaks the document → stock link.",
        },
      },
      {
        id: "c",
        label: { fr: "Poster / régulariser le GR existant, puis enchaîner le putaway.", en: "Post / regularize the existing GR, then continue putaway." },
        isCorrect: true,
        whyRight: {
          fr: "Réponse correcte : on assainit le document existant. Pas de duplication, traçabilité conservée.",
          en: "Correct answer: clean the existing document. No duplication, traceability kept.",
        },
      },
      {
        id: "d",
        label: { fr: "Annuler la PO pour repartir de zéro.", en: "Cancel the PO to start from scratch." },
        isCorrect: false,
        whyWrong: {
          fr: "Réponse incorrecte : annuler la PO n’efface pas le GR fantôme et détruit l’engagement fournisseur.",
          en: "Incorrect answer: cancelling the PO does not clear the ghost GR and destroys the supplier commitment.",
        },
      },
    ],
  }),
  q({
    scnCode: "SCN-003",
    step: "SO",
    competence: { fr: "Couverture ATP avant sortie", en: "ATP coverage before issue" },
    errorType: { fr: "GI sans stock", en: "GI without stock" },
    prompt: {
      fr: "Le stock disponible ne couvre pas la commande. Que faire avant le GI ?",
      en: "Available stock does not cover the order. What should be done before GI?",
    },
    context: {
      fr: "Issue : déficit ATP. Forcer le GI créerait un stock négatif.",
      en: "Issue: ATP deficit. Forcing GI would create negative stock.",
    },
    options: [
      {
        id: "a",
        label: { fr: "Forcer le GI : le système corrigera plus tard.", en: "Force GI: the system will correct later." },
        isCorrect: false,
        whyWrong: {
          fr: "Réponse incorrecte : un GI sans couverture crée un stock négatif. Règle violée : intégrité du stock avant sortie.",
          en: "Incorrect answer: GI without coverage creates negative stock. Rule violated: stock integrity before issue.",
        },
      },
      {
        id: "b",
        label: { fr: "Créer un réapprovisionnement correctif (PO/GR/putaway) puis GI.", en: "Create corrective replenishment (PO/GR/putaway) then GI." },
        isCorrect: true,
        whyRight: {
          fr: "Réponse correcte : on reconstitue le stock par un flux inbound avant d’expédier.",
          en: "Correct answer: rebuild stock through an inbound flow before shipping.",
        },
      },
      {
        id: "c",
        label: { fr: "Modifier le cycle count pour « créer » du stock.", en: "Change the cycle count to “create” stock." },
        isCorrect: false,
        whyWrong: {
          fr: "Réponse incorrecte : falsifier le comptage n’est pas un réapprovisionnement.",
          en: "Incorrect answer: faking the count is not replenishment.",
        },
      },
      {
        id: "d",
        label: { fr: "Supprimer la commande client.", en: "Delete the sales order." },
        isCorrect: false,
        whyWrong: {
          fr: "Réponse incorrecte : masquer la demande ne rétablit pas le stock.",
          en: "Incorrect answer: hiding demand does not restore stock.",
        },
      },
    ],
  }),
  q({
    scnCode: "SCN-004",
    step: "CC",
    competence: { fr: "Preuve physique d’inventaire", en: "Physical inventory evidence" },
    errorType: { fr: "Masquage d’écart", en: "Variance concealment" },
    prompt: {
      fr: "Système 200, physique 185. Quelle saisie de cycle count est correcte ?",
      en: "System 200, physical 185. Which cycle-count entry is correct?",
    },
    context: {
      fr: "Issue : écart d’inventaire. Recopier le système cacherait la preuve.",
      en: "Issue: inventory variance. Copying the system would hide the evidence.",
    },
    options: [
      {
        id: "a",
        label: { fr: "Saisir 200 pour rester « conforme » au système.", en: "Enter 200 to stay “compliant” with the system." },
        isCorrect: false,
        whyWrong: {
          fr: "Réponse incorrecte : recopier le système cache l’écart. Conséquence : WMS faux. Règle : système = réalité physique.",
          en: "Incorrect answer: copying the system hides the variance. Consequence: false WMS. Rule: system = physical reality.",
        },
      },
      {
        id: "b",
        label: { fr: "Saisir 185 (physique constaté), puis réconcilier l’écart.", en: "Enter 185 (observed physical), then reconcile the variance." },
        isCorrect: true,
        whyRight: {
          fr: "Réponse correcte : le comptage enregistre la réalité ; l’écart se documente ensuite.",
          en: "Correct answer: the count records reality; the variance is then documented.",
        },
      },
      {
        id: "c",
        label: { fr: "Saisir +15 sans document d’ajustement.", en: "Enter +15 without an adjustment document." },
        isCorrect: false,
        whyWrong: {
          fr: "Réponse incorrecte : un écart se documente (ADJ), il ne se compense pas dans le comptage.",
          en: "Incorrect answer: a variance is documented (ADJ); it is not compensated inside the count.",
        },
      },
      {
        id: "d",
        label: { fr: "Ne rien saisir, la prochaine GR réglera.", en: "Enter nothing; the next GR will fix it." },
        isCorrect: false,
        whyWrong: {
          fr: "Réponse incorrecte : laisser l’écart ouvert viole la boucle de conformité.",
          en: "Incorrect answer: leaving the variance open violates the compliance loop.",
        },
      },
    ],
  }),
  q({
    scnCode: "SCN-005",
    step: "ADJ",
    competence: { fr: "Ajustement documenté d’anomalie", en: "Documented anomaly adjustment" },
    errorType: { fr: "Correction non tracée", en: "Untraced correction" },
    prompt: {
      fr: "Plusieurs anomalies (GR fantôme + écart). Comment traiter l’ajustement ?",
      en: "Several anomalies (ghost GR + variance). How should the adjustment be treated?",
    },
    context: {
      fr: "Issue multi-conformité : chaque écart doit rester traçable, pas « nettoyé » en silence.",
      en: "Multi-compliance issue: each variance must stay traceable, not silently “cleaned”.",
    },
    options: [
      {
        id: "a",
        label: { fr: "Ajuster en silence pour clôturer plus vite.", en: "Adjust silently to close faster." },
        isCorrect: false,
        whyWrong: {
          fr: "Réponse incorrecte : un ADJ sans lien à l’écart constaté casse l’audit. Règle violée : justification.",
          en: "Incorrect answer: an ADJ unrelated to the observed variance breaks the audit. Rule violated: justification.",
        },
      },
      {
        id: "b",
        label: { fr: "Poster l’ajustement de la variance réelle après régularisation des documents.", en: "Post the adjustment of the real variance after regularizing documents." },
        isCorrect: true,
        whyRight: {
          fr: "Réponse correcte : d’abord les documents, puis l’ADJ de l’écart confirmé.",
          en: "Correct answer: documents first, then ADJ of the confirmed variance.",
        },
      },
      {
        id: "c",
        label: { fr: "Reporter l’écart sur un autre SKU.", en: "Shift the variance onto another SKU." },
        isCorrect: false,
        whyWrong: {
          fr: "Réponse incorrecte : transférer l’écart est une falsification.",
          en: "Incorrect answer: moving the variance is falsification.",
        },
      },
      {
        id: "d",
        label: { fr: "Ignorer l’ADJ : le score de mission suffit.", en: "Skip ADJ: the mission score is enough." },
        isCorrect: false,
        whyWrong: {
          fr: "Réponse incorrecte : le score ne remplace pas la conformité documentaire.",
          en: "Incorrect answer: score does not replace document compliance.",
        },
      },
    ],
  }),
  q({
    scnCode: "SCN-006",
    step: "PUTAWAY",
    competence: { fr: "Putaway structuré", en: "Structured putaway" },
    errorType: { fr: "Zone de rangement erronée", en: "Wrong putaway zone" },
    prompt: {
      fr: "La marchandise est au quai REC-01. Où la ranger ?",
      en: "Goods are at dock REC-01. Where should they be put away?",
    },
    context: {
      fr: "Issue : ne pas picker depuis le quai ni envoyer en EXPÉDITION comme stockage.",
      en: "Issue: do not pick from the dock or use SHIPPING as storage.",
    },
    options: [
      {
        id: "a",
        label: { fr: "Laisser au quai et picker depuis REC-01.", en: "Leave at dock and pick from REC-01." },
        isCorrect: false,
        whyWrong: {
          fr: "Réponse incorrecte : le quai n’est pas une zone de picking durable. Conséquence : files et erreurs de lot.",
          en: "Incorrect answer: the dock is not a durable picking zone. Consequence: queues and lot errors.",
        },
      },
      {
        id: "b",
        label: { fr: "Ranger vers un bin STOCKAGE compatible (zone et capacité).", en: "Put away to a compatible STORAGE bin (zone and capacity)." },
        isCorrect: true,
        whyRight: {
          fr: "Réponse correcte : le rangement structure la localisation depuis le quai vers STOCKAGE.",
          en: "Correct answer: putaway structures location from dock to STORAGE.",
        },
      },
      {
        id: "c",
        label: { fr: "Envoyer directement en EXPÉDITION.", en: "Send directly to SHIPPING." },
        isCorrect: false,
        whyWrong: {
          fr: "Réponse incorrecte : EXPÉDITION n’est pas une zone de stockage. FIFO et localisation perdus.",
          en: "Incorrect answer: SHIPPING is not a storage zone. FIFO and location are lost.",
        },
      },
      {
        id: "d",
        label: { fr: "Répartir au hasard dans le premier bin libre hors zone.", en: "Split at random into the first free off-zone bin." },
        isCorrect: false,
        whyWrong: {
          fr: "Réponse incorrecte : hors zone viole la règle de localisation.",
          en: "Incorrect answer: off-zone violates the location rule.",
        },
      },
    ],
  }),
  q({
    scnCode: "SCN-007",
    step: "PUTAWAY",
    competence: { fr: "Capacité bin", en: "Bin capacity" },
    errorType: { fr: "Surcharge de bin", en: "Bin overload" },
    prompt: {
      fr: "Capacité max 500, à ranger 600. Décision ?",
      en: "Max capacity 500, 600 to put away. Decision?",
    },
    context: {
      fr: "Issue : dépassement. Un scan unique de 600 viole la capacité.",
      en: "Issue: overflow. A single 600 scan violates capacity.",
    },
    options: [
      {
        id: "a",
        label: { fr: "Forcer 600 dans le même bin.", en: "Force 600 into the same bin." },
        isCorrect: false,
        whyWrong: {
          fr: "Réponse incorrecte : 600 > 500. Conséquence : surcharge, picking dangereux. Règle de capacité violée.",
          en: "Incorrect answer: 600 > 500. Consequence: overload, unsafe picking. Capacity rule violated.",
        },
      },
      {
        id: "b",
        label: { fr: "Découper (500 + 100) vers des bins qui respectent la capacité.", en: "Split (500 + 100) into bins that respect capacity." },
        isCorrect: true,
        whyRight: {
          fr: "Réponse correcte : on scinde le putaway. La capacité protège sécurité et vérité de localisation.",
          en: "Correct answer: split the putaway. Capacity protects safety and location truth.",
        },
      },
      {
        id: "c",
        label: { fr: "Laisser 600 au quai.", en: "Leave 600 at the dock." },
        isCorrect: false,
        whyWrong: {
          fr: "Réponse incorrecte : saturer le quai n’exécute pas le rangement.",
          en: "Incorrect answer: saturating the dock does not execute putaway.",
        },
      },
      {
        id: "d",
        label: { fr: "Modifier le max à 600 pour clôturer.", en: "Change max to 600 to close." },
        isCorrect: false,
        whyWrong: {
          fr: "Réponse incorrecte : changer la règle pour « faire passer » falsifie l’entrepôt.",
          en: "Incorrect answer: changing the rule to “make it fit” falsifies the warehouse.",
        },
      },
    ],
  }),
  q({
    scnCode: "SCN-008",
    step: "FIFO_PICK",
    competence: { fr: "FIFO", en: "FIFO" },
    errorType: { fr: "Violation FIFO", en: "FIFO violation" },
    prompt: {
      fr: "LOT-A est le plus ancien, LOT-C le plus accessible. Quel lot prélever ?",
      en: "LOT-A is oldest, LOT-C most accessible. Which lot to pick?",
    },
    context: {
      fr: "Issue : tentation de prendre le lot devant. FIFO suit l’âge, pas l’accès.",
      en: "Issue: temptation to take the front lot. FIFO follows age, not access.",
    },
    options: [
      {
        id: "a",
        label: { fr: "LOT-C, le plus proche.", en: "LOT-C, the closest." },
        isCorrect: false,
        whyWrong: {
          fr: "Réponse incorrecte : picker le lot récent viole FIFO. Conséquence : obsolescence du lot ancien.",
          en: "Incorrect answer: picking the newest lot violates FIFO. Consequence: obsolescence of the old lot.",
        },
      },
      {
        id: "b",
        label: { fr: "Mélanger les lots pour équilibrer.", en: "Mix lots to balance." },
        isCorrect: false,
        whyWrong: {
          fr: "Réponse incorrecte : mélanger les lots casse la traçabilité de lot.",
          en: "Incorrect answer: mixing lots breaks lot traceability.",
        },
      },
      {
        id: "c",
        label: { fr: "LOT-A, le plus ancien, conformément à FIFO.", en: "LOT-A, the oldest, according to FIFO." },
        isCorrect: true,
        whyRight: {
          fr: "Réponse correcte : FIFO sort le lot le plus ancien, quitte à réorganiser l’accès.",
          en: "Correct answer: FIFO issues the oldest lot, even if access must be reorganized.",
        },
      },
      {
        id: "d",
        label: { fr: "N’importe lequel : FIFO est seulement alimentaire.", en: "Any lot: FIFO is food-only." },
        isCorrect: false,
        whyWrong: {
          fr: "Réponse incorrecte : FIFO est une règle d’exécution d’entrepôt, pas seulement alimentaire.",
          en: "Incorrect answer: FIFO is a warehouse execution rule, not food-only.",
        },
      },
    ],
  }),
  q({
    scnCode: "SCN-009",
    step: "CC_RECON",
    competence: { fr: "Réconciliation d’écart", en: "Variance reconciliation" },
    errorType: { fr: "Écart ignoré", en: "Ignored variance" },
    prompt: {
      fr: "Un écart de cycle count est confirmé. Décision ?",
      en: "A cycle-count variance is confirmed. Decision?",
    },
    context: {
      fr: "Issue : système ≠ physique. Ignorer l’écart laisse le WMS mentir.",
      en: "Issue: system ≠ physical. Ignoring the variance leaves the WMS lying.",
    },
    options: [
      {
        id: "a",
        label: { fr: "Ignorer si l’écart « n’est pas trop grand ».", en: "Ignore it if the variance is “not too large”." },
        isCorrect: false,
        whyWrong: {
          fr: "Réponse incorrecte : un petit écart non traité dérive. Règle : système = réalité.",
          en: "Incorrect answer: an untreated small variance drifts. Rule: system = reality.",
        },
      },
      {
        id: "b",
        label: { fr: "Réconcilier l’écart puis ajuster de façon documentée si confirmé.", en: "Reconcile the variance then adjust in a documented way if confirmed." },
        isCorrect: true,
        whyRight: {
          fr: "Réponse correcte : on réconcilie d’abord, puis on documente l’écart confirmé.",
          en: "Correct answer: reconcile first, then document the confirmed variance.",
        },
      },
      {
        id: "c",
        label: { fr: "Modifier le comptage pour coller au système.", en: "Change the count to match the system." },
        isCorrect: false,
        whyWrong: {
          fr: "Réponse incorrecte : coller le physique au système détruit la preuve.",
          en: "Incorrect answer: forcing physical to match the system destroys evidence.",
        },
      },
      {
        id: "d",
        label: { fr: "Commander l’écart sans réconciliation.", en: "Order the variance quantity without reconciliation." },
        isCorrect: false,
        whyWrong: {
          fr: "Réponse incorrecte : commander sans preuve peut acheter un problème de localisation, pas un vrai déficit.",
          en: "Incorrect answer: ordering without evidence may buy a location problem, not a true deficit.",
        },
      },
    ],
  }),
  q({
    scnCode: "SCN-010",
    step: "CC_RECON",
    competence: { fr: "Grand écart justifié", en: "Justified large variance" },
    errorType: { fr: "ADJ aveugle", en: "Blind ADJ" },
    prompt: {
      fr: "L’écart dépasse le seuil. Quelle décision ?",
      en: "The variance exceeds the threshold. What decision?",
    },
    context: {
      fr: "Issue : grand écart. Un ADJ est probable, mais pas cosmétique.",
      en: "Issue: large variance. An ADJ is likely, but not cosmetic.",
    },
    options: [
      {
        id: "a",
        label: { fr: "Ajuster à l’aveugle pour clôturer.", en: "Adjust blindly to close." },
        isCorrect: false,
        whyWrong: {
          fr: "Réponse incorrecte : un ADJ aveugle peut amplifier une erreur de comptage.",
          en: "Incorrect answer: a blind ADJ can amplify a count error.",
        },
      },
      {
        id: "b",
        label: { fr: "Confirmer le physique, justifier, poster l’ADJ de la variance réelle.", en: "Confirm physical, justify, post the ADJ of the real variance." },
        isCorrect: true,
        whyRight: {
          fr: "Réponse correcte : grand écart = investigation + ADJ de la variance constatée.",
          en: "Correct answer: large variance = investigation + ADJ of the observed variance.",
        },
      },
      {
        id: "c",
        label: { fr: "Augmenter le seuil jusqu’à ce que ça passe.", en: "Raise the threshold until it passes." },
        isCorrect: false,
        whyWrong: {
          fr: "Réponse incorrecte : changer le seuil casse le contrôle interne.",
          en: "Incorrect answer: changing the threshold breaks internal control.",
        },
      },
      {
        id: "d",
        label: { fr: "Reporter l’écart sur un autre SKU.", en: "Shift the variance onto another SKU." },
        isCorrect: false,
        whyWrong: {
          fr: "Réponse incorrecte : transférer l’écart est une falsification.",
          en: "Incorrect answer: moving the variance is falsification.",
        },
      },
    ],
  }),
  q({
    scnCode: "SCN-011",
    step: "REPLENISH",
    competence: { fr: "Réappro Min/Max", en: "Min/Max replenishment" },
    errorType: { fr: "Réappro hors bande", en: "Replenishment outside band" },
    prompt: {
      fr: "Le stock passe sous le minimum. Quelle action ?",
      en: "Stock falls below minimum. What action?",
    },
    context: {
      fr: "Issue : paramètre Min/Max. On vise la bande, pas un chiffre inventé ni un changement de règle.",
      en: "Issue: Min/Max parameter. Aim for the band, not an invented number or a rule change.",
    },
    options: [
      {
        id: "a",
        label: { fr: "Ne rien faire : le min n’est qu’un indicateur visuel.", en: "Do nothing: min is only a visual indicator." },
        isCorrect: false,
        whyWrong: {
          fr: "Réponse incorrecte : ignorer le min expose à la rupture.",
          en: "Incorrect answer: ignoring min exposes a stockout.",
        },
      },
      {
        id: "b",
        label: { fr: "Proposer une quantité qui ramène le stock dans la bande Min/Max.", en: "Propose a quantity that brings stock back into the Min/Max band." },
        isCorrect: true,
        whyRight: {
          fr: "Réponse correcte : sous le min, on réapprovisionne pour revenir dans la bande.",
          en: "Correct answer: below min, replenish to return into the band.",
        },
      },
      {
        id: "c",
        label: { fr: "Commander dix fois le max.", en: "Order ten times the max." },
        isCorrect: false,
        whyWrong: {
          fr: "Réponse incorrecte : sur-commander crée du surstock et immobilise du capital.",
          en: "Incorrect answer: over-ordering creates overstock and ties up capital.",
        },
      },
      {
        id: "d",
        label: { fr: "Baisser le minimum à la quantité actuelle.", en: "Lower the minimum to the current quantity." },
        isCorrect: false,
        whyWrong: {
          fr: "Réponse incorrecte : changer le min pour éviter l’action falsifie le contrôle.",
          en: "Incorrect answer: changing min to avoid action falsifies control.",
        },
      },
    ],
  }),
];

const BY_KEY = new Map(QUESTIONS.map((item) => [`${item.scnCode}::${item.step.toUpperCase()}`, item]));

export function normalizeDecisionStep(step: string | null | undefined): string {
  const st = (step ?? "").replace(/-/g, "_").toUpperCase();
  if (st === "PUTAWAY_M1") return "PUTAWAY";
  return st;
}

export function getM1M3DecisionQuestion(
  scnCode: string | null | undefined,
  step: string | null | undefined,
): M1M3DecisionQuestion | null {
  const scn = (scnCode ?? "").toUpperCase();
  const st = normalizeDecisionStep(step);
  return BY_KEY.get(`${scn}::${st}`) ?? null;
}

export function getM1M3DecisionOption(
  scnCode: string | null | undefined,
  step: string | null | undefined,
  optionId: string,
): M1M3DecisionOption | null {
  const question = getM1M3DecisionQuestion(scnCode, step);
  return question?.options.find((o) => o.id === optionId) ?? null;
}

export function listM1M3DecisionQuestions(): M1M3DecisionQuestion[] {
  return QUESTIONS;
}

export function m1m3DecisionPenalty(isDemo: boolean): number {
  return isDemo ? M1M3_DECISION_WRONG_PENALTY_DEMO : M1M3_DECISION_WRONG_PENALTY_EVAL;
}

export function m1m3DecisionPenaltyEventType(step: string): string {
  return `${normalizeDecisionStep(step)}_DECISION_INCORRECT`;
}
