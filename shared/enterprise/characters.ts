import type { CharacterRef } from "../enterpriseBriefing";

/** Canonical character roster — Enterprise Universe Part VIII */
export const ENTERPRISE_CHARACTERS: Record<string, CharacterRef> = {
  "marc-andre-tremblay": {
    id: "marc-andre-tremblay",
    name: "Marc-André Tremblay",
    titleFr: "Superviseur d'entrepôt — Réception et stockage",
    titleEn: "Warehouse Supervisor — Receiving & Storage",
    department: "WH",
    signaturePhraseFr: "Le quai ne ment pas. Le système doit suivre.",
    signaturePhraseEn: "The dock doesn't lie. The system must follow.",
  },
  "aisha-rahman": {
    id: "aisha-rahman",
    name: "Aisha Rahman",
    titleFr: "Opératrice senior d'entrepôt",
    titleEn: "Senior Warehouse Operator",
    department: "WH",
    signaturePhraseFr: "Si le lot le plus vieux est derrière, le client reçoit le mauvais produit.",
    signaturePhraseEn: "If the oldest lot is at the back, the customer gets the wrong product.",
  },
  "jean-philippe-morin": {
    id: "jean-philippe-morin",
    name: "Jean-Philippe Morin",
    titleFr: "Acheteur senior",
    titleEn: "Senior Buyer",
    department: "PROC",
    signaturePhraseFr: "Un air freight se justifie par une ligne arrêtée, pas par un stress.",
    signaturePhraseEn: "Air freight is justified by a stopped line, not by stress.",
  },
  "sophie-lachance": {
    id: "sophie-lachance",
    name: "Sophie Lachance",
    titleFr: "Planificatrice de la demande",
    titleEn: "Demand Planner",
    department: "PLAN",
    signaturePhraseFr: "Chaque unité en rack a un coût. Chaque rupture a un prix.",
    signaturePhraseEn: "Every unit on the rack has a cost. Every stockout has a price.",
  },
  "sophie-bouchard": {
    id: "sophie-bouchard",
    name: "Sophie Bouchard",
    titleFr: "Responsable inventaire",
    titleEn: "Inventory Manager",
    department: "INV",
    signaturePhraseFr: "Notre inventaire doit être fiable avant d'être rapide.",
    signaturePhraseEn: "Our inventory must be reliable before it is fast.",
  },
  "david-okonkwo": {
    id: "david-okonkwo",
    name: "David Okonkwo",
    titleFr: "Spécialiste qualité",
    titleEn: "Quality Specialist",
    department: "QA",
    signaturePhraseFr: "Pas de preuve, pas de libération.",
    signaturePhraseEn: "No proof, no release.",
  },
  "melanie-gagnon": {
    id: "melanie-gagnon",
    name: "Mélanie Gagnon",
    titleFr: "Responsable service client",
    titleEn: "Customer Service Lead",
    department: "CS",
    signaturePhraseFr: "Le client ne voit pas notre WMS. Il voit notre promesse.",
    signaturePhraseEn: "The customer doesn't see our WMS. They see our promise.",
  },
  "elise-beaumont": {
    id: "elise-beaumont",
    name: "Élise Beaumont",
    titleFr: "Directrice des opérations",
    titleEn: "Operations Director",
    department: "MGT",
    signaturePhraseFr: "Donnez-moi le fait, l'impact, et votre recommandation.",
    signaturePhraseEn: "Give me the fact, the impact, and your recommendation.",
  },
};

export function getCharacterById(id: string): CharacterRef | undefined {
  return ENTERPRISE_CHARACTERS[id];
}
