/**
 * Error School — M1–M3 operational near-miss literacy (SAP-style).
 * Cards emphasize ambiguous situations, not obvious tips.
 */

export type ErrorSchoolModule = 1 | 2 | 3;

export type ErrorSchoolCard = {
  id: string;
  moduleId: ErrorSchoolModule;
  title: { fr: string; en: string };
  trap: { fr: string; en: string };
  evidence: { fr: string; en: string };
  action: { fr: string; en: string };
  scnHints?: string[];
};

export const ERROR_SCHOOL_CARDS: ErrorSchoolCard[] = [
  {
    id: "m1-ghost-gr",
    moduleId: 1,
    title: { fr: "Document présent ≠ stock disponible", en: "Document present ≠ available stock" },
    trap: {
      fr: "Voir une GR dans le journal et conclure que MB52 devrait déjà montrer le stock.",
      en: "Seeing a GR in the journal and concluding MB52 should already show the stock.",
    },
    evidence: {
      fr: "Statut PENDING/unposted : le document existe, le mouvement inventaire n’a pas eu lieu.",
      en: "PENDING/unposted status: the document exists; the inventory movement has not occurred.",
    },
    action: {
      fr: "Interroger POSTED vs PENDING avant de recréer PO/GR ou d’attaquer l’aval (SO/GI).",
      en: "Check POSTED vs PENDING before recreating PO/GR or attacking downstream (SO/GI).",
    },
    scnHints: ["SCN-002", "SCN-005"],
  },
  {
    id: "m1-physical-vs-delta",
    moduleId: 1,
    title: { fr: "Observation vs écriture comptable", en: "Observation vs accounting posting" },
    trap: {
      fr: "Saisir l’écart (−15) parce que « c’est ce qu’il faut corriger ».",
      en: "Entering the variance (−15) because “that is what must be corrected.”",
    },
    evidence: {
      fr: "L’écran CC demande la qty terrain ; l’écart est dérivé. L’ADJ est une décision séparée.",
      en: "The CC screen asks for floor qty; variance is derived. ADJ is a separate decision.",
    },
    action: {
      fr: "Compter le physique → laisser le système calculer → justifier/ajuster ensuite si requis.",
      en: "Count physical → let the system compute → justify/adjust afterward if required.",
    },
    scnHints: ["SCN-004", "SCN-005"],
  },
  {
    id: "m1-putaway-before-ship",
    moduleId: 1,
    title: { fr: "Quai ≠ zone de picking", en: "Dock ≠ picking zone" },
    trap: {
      fr: "GI depuis REC « pour aller plus vite » après une GR postée.",
      en: "GI from REC “to go faster” after a posted GR.",
    },
    evidence: {
      fr: "Le flux nominal sépare réception, rangement, puis prélèvement/expédition.",
      en: "Nominal flow separates receiving, putaway, then pick/ship.",
    },
    action: {
      fr: "Exiger putaway confirmé avant allocation SO/picking — même sous pression délai.",
      en: "Require confirmed putaway before SO/picking allocation — even under time pressure.",
    },
    scnHints: ["SCN-001"],
  },
  {
    id: "m2-gr-preposted",
    moduleId: 2,
    title: { fr: "TO déjà créé (mental model SAP)", en: "TO already created (SAP mental model)" },
    trap: {
      fr: "Recréer PO/GR en M2 parce que « sinon le flux n’est pas complet ».",
      en: "Recreating PO/GR in M2 because “otherwise the flow is incomplete.”",
    },
    evidence: {
      fr: "Seed/Mission Sheet : réception pré-chargée. Le skill évalué commence au rangement.",
      en: "Seed/Mission Sheet: receipt preloaded. The scored skill starts at putaway.",
    },
    action: {
      fr: "Lire l’état initial comme un ordre de transfert déjà disponible — exécuter, ne pas reconstruire.",
      en: "Read initial state as an already-available transfer order — execute, do not rebuild.",
    },
    scnHints: ["SCN-006", "SCN-007", "SCN-008"],
  },
  {
    id: "m2-capacity-split",
    moduleId: 2,
    title: { fr: "Total correct ≠ split correct", en: "Correct total ≠ correct split" },
    trap: {
      fr: "Accepter n’importe quel split 600 (400+200) parce que le total matche.",
      en: "Accepting any 600 split (400+200) because the total matches.",
    },
    evidence: {
      fr: "Contrat capacité : max L1 = 500 → séquence exacte 500+100.",
      en: "Capacity contract: L1 max = 500 → exact 500+100 sequence.",
    },
    action: {
      fr: "Vérifier contrainte bin avant optimisation « visuelle » ou lean de parcours.",
      en: "Check bin constraint before visual or travel-lean optimization.",
    },
    scnHints: ["SCN-007"],
  },
  {
    id: "m2-fifo-lot",
    moduleId: 2,
    title: { fr: "Qty exacte ≠ lot exact", en: "Exact qty ≠ exact lot" },
    trap: {
      fr: "Prélever un lot « pratique » (proche, récent) si la quantité bin est bonne.",
      en: "Picking a “convenient” lot (nearby, newer) if bin qty is right.",
    },
    evidence: {
      fr: "FIFO exige le plus ancien. Distance et « fraîcheur perçue » sont des near-miss.",
      en: "FIFO requires the oldest. Distance and “perceived freshness” are near-misses.",
    },
    action: {
      fr: "Lire dates/lots avant de confirmer le picking — la discipline prime sur le confort.",
      en: "Read dates/lots before confirming the pick — discipline outranks comfort.",
    },
    scnHints: ["SCN-008"],
  },
  {
    id: "m3-count-not-delta",
    moduleId: 3,
    title: { fr: "Ne pas planifier sur une fiction", en: "Do not plan on fiction" },
    trap: {
      fr: "Calculer Min/Max ou réappro avant d’avoir un stock réconcilié.",
      en: "Computing Min/Max or replenishment before stock is reconciled.",
    },
    evidence: {
      fr: "Q = Max − stock hérite de la vérité inventaire. Stock faux → plan faux.",
      en: "Q = Max − stock inherits inventory truth. Wrong stock → wrong plan.",
    },
    action: {
      fr: "CC/réconcilier d’abord ; Min/Max ensuite. Saisir le physique, jamais le delta, au comptage.",
      en: "CC/reconcile first; Min/Max next. Enter physical at count, never the delta.",
    },
    scnHints: ["SCN-009", "SCN-010", "SCN-011"],
  },
  {
    id: "m3-minmax-not-eoq",
    moduleId: 3,
    title: { fr: "Bonne théorie ≠ critère d’évaluation", en: "Good theory ≠ evaluation criterion" },
    trap: {
      fr: "Appliquer EOQ « parce que c’est plus savant » alors que le contrat est Min/Max.",
      en: "Applying EOQ “because it sounds smarter” while the contract is Min/Max.",
    },
    evidence: {
      fr: "SCN-011 : Q = Max − stock. EOQ peut être vrai en cours sans être le scorer.",
      en: "SCN-011: Q = Max − stock. EOQ may be true in class without being the scorer.",
    },
    action: {
      fr: "Séparer enrichissement théorique et critère de conformité du scénario.",
      en: "Separate theoretical enrichment from the scenario compliance criterion.",
    },
    scnHints: ["SCN-011"],
  },
];

export function getErrorSchoolForModule(moduleId: number): ErrorSchoolCard[] {
  return ERROR_SCHOOL_CARDS.filter((c) => c.moduleId === moduleId);
}
