import type { MentorPersonaId } from "./types";

/** SCN/module → persona mapping — Manifesto §6.3 */
const SCN_PERSONA_MAP: Record<string, MentorPersonaId> = {
  "SCN-001": "FLOOR_MENTOR",
  "SCN-002": "QUALITY_GUIDE",
  "SCN-003": "PROCUREMENT_GUIDE",
  "SCN-004": "FLOOR_MENTOR",
  "SCN-005": "FLOOR_MENTOR",
  "SCN-006": "FLOOR_MENTOR",
  "SCN-007": "FLOOR_MENTOR",
  "SCN-008": "FLOOR_MENTOR",
  "SCN-009": "INVENTORY_ADVISOR",
  "SCN-010": "INVENTORY_ADVISOR",
  "SCN-011": "QUALITY_GUIDE",
  "SCN-012": "PERFORMANCE_COACH",
  "SCN-013": "CRISIS_ADVISOR",
  "SCN-014": "PERFORMANCE_COACH",
  "SCN-015": "FLOOR_MENTOR",
  "SCN-016": "CRISIS_ADVISOR",
  "SCN-017": "CRISIS_ADVISOR",
};

const MODULE_PERSONA_FALLBACK: Record<number, MentorPersonaId> = {
  1: "FLOOR_MENTOR",
  2: "FLOOR_MENTOR",
  3: "INVENTORY_ADVISOR",
  4: "PERFORMANCE_COACH",
  5: "CRISIS_ADVISOR",
};

export function resolvePersonaForScenario(
  scnCode: string | null | undefined,
  moduleId: number,
): MentorPersonaId {
  if (scnCode && SCN_PERSONA_MAP[scnCode]) {
    return SCN_PERSONA_MAP[scnCode];
  }
  return MODULE_PERSONA_FALLBACK[moduleId] ?? "ERP_COACH";
}

export const PERSONA_DISPLAY_NAMES: Record<MentorPersonaId, { fr: string; en: string }> = {
  FLOOR_MENTOR: { fr: "Marc-André Tremblay", en: "Marc-André Tremblay" },
  INVENTORY_ADVISOR: { fr: "Sophie Lachance", en: "Sophie Lachance" },
  PERFORMANCE_COACH: { fr: "Élise Beaumont", en: "Élise Beaumont" },
  CRISIS_ADVISOR: { fr: "Élise Beaumont", en: "Élise Beaumont" },
  ERP_COACH: { fr: "Coach ERP", en: "Coach ERP" },
  QUALITY_GUIDE: { fr: "David Okonkwo", en: "David Okonkwo" },
  PROCUREMENT_GUIDE: { fr: "Jean-Philippe Morin", en: "Jean-Philippe Morin" },
};

export function getPersonaDisplayName(
  personaId: MentorPersonaId,
  language: "fr" | "en",
): string {
  return PERSONA_DISPLAY_NAMES[personaId][language];
}

export const PERSONA_CHARACTER_MAP: Record<MentorPersonaId, string> = {
  FLOOR_MENTOR: "marc-andre-tremblay",
  INVENTORY_ADVISOR: "sophie-lachance",
  PERFORMANCE_COACH: "elise-beaumont",
  CRISIS_ADVISOR: "elise-beaumont",
  ERP_COACH: "coach-erp",
  QUALITY_GUIDE: "david-okonkwo",
  PROCUREMENT_GUIDE: "jean-philippe-morin",
};
