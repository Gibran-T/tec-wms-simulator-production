import type { MentorPersonaId } from "./types";
import type { DepartmentCode } from "../enterpriseBriefing";

/** RC23-E — Human enterprise immersion (student-facing presentation only). */
export type EnterpriseEmployeeProfile = {
  personaId: MentorPersonaId;
  characterId: string;
  name: string;
  firstName: string;
  title: { fr: string; en: string };
  department: { fr: string; en: string };
  departmentCode: DepartmentCode;
  avatarInitials: string;
  consultButton: { fr: string; en: string };
  availabilityNote: { fr: string; en: string };
};

const DEPARTMENT_LABELS: Record<DepartmentCode, { fr: string; en: string }> = {
  WH: { fr: "Entrepôt", en: "Warehouse" },
  REC: { fr: "Réception", en: "Receiving" },
  SHP: { fr: "Expédition", en: "Shipping" },
  INV: { fr: "Inventaire", en: "Inventory" },
  PROC: { fr: "Approvisionnement", en: "Procurement" },
  PLAN: { fr: "Planification", en: "Planning" },
  CS: { fr: "Service client", en: "Customer Service" },
  FIN: { fr: "Finance", en: "Finance" },
  QA: { fr: "Qualité", en: "Quality" },
  OPS: { fr: "Opérations", en: "Operations" },
  MGT: { fr: "Direction", en: "Management" },
};

const ENTERPRISE_EMPLOYEES: Record<MentorPersonaId, EnterpriseEmployeeProfile> = {
  FLOOR_MENTOR: {
    personaId: "FLOOR_MENTOR",
    characterId: "marc-andre-tremblay",
    name: "Marc-André Tremblay",
    firstName: "Marc-André",
    title: {
      fr: "Superviseur d'entrepôt",
      en: "Warehouse Supervisor",
    },
    department: DEPARTMENT_LABELS.WH,
    departmentCode: "WH",
    avatarInitials: "MT",
    consultButton: { fr: "Consulter Marc-André", en: "Consult Marc-André" },
    availabilityNote: {
      fr: "Marc-André est disponible pour vous orienter sur nos opérations d'entrepôt — la décision reste la vôtre.",
      en: "Marc-André is available to guide you on our warehouse operations — the decision remains yours.",
    },
  },
  INVENTORY_ADVISOR: {
    personaId: "INVENTORY_ADVISOR",
    characterId: "sophie-bouchard",
    name: "Sophie Bouchard",
    firstName: "Sophie",
    title: {
      fr: "Responsable inventaire",
      en: "Inventory Manager",
    },
    department: DEPARTMENT_LABELS.INV,
    departmentCode: "INV",
    avatarInitials: "SB",
    consultButton: { fr: "Consulter Sophie", en: "Consult Sophie" },
    availabilityNote: {
      fr: "Sophie est disponible pour vous aider à raisonner sur notre inventaire — elle ne peut pas exécuter la mission à votre place.",
      en: "Sophie is available to help you reason about our inventory — she cannot execute the mission for you.",
    },
  },
  PERFORMANCE_COACH: {
    personaId: "PERFORMANCE_COACH",
    characterId: "elise-beaumont",
    name: "Élise Beaumont",
    firstName: "Élise",
    title: {
      fr: "Directrice des opérations",
      en: "Operations Director",
    },
    department: DEPARTMENT_LABELS.OPS,
    departmentCode: "OPS",
    avatarInitials: "EB",
    consultButton: { fr: "Consulter Élise", en: "Consult Élise" },
    availabilityNote: {
      fr: "Élise est disponible pour discuter de nos opérations — la décision finale vous appartient.",
      en: "Élise is available to discuss our operations — the final decision is yours.",
    },
  },
  CRISIS_ADVISOR: {
    personaId: "CRISIS_ADVISOR",
    characterId: "elise-beaumont",
    name: "Élise Beaumont",
    firstName: "Élise",
    title: {
      fr: "Directrice des opérations",
      en: "Operations Director",
    },
    department: DEPARTMENT_LABELS.OPS,
    departmentCode: "OPS",
    avatarInitials: "EB",
    consultButton: { fr: "Consulter Élise", en: "Consult Élise" },
    availabilityNote: {
      fr: "Élise est disponible pour vous orienter dans ce contexte opérationnel — vous restez responsable de la décision.",
      en: "Élise is available to guide you in this operational context — you remain responsible for the decision.",
    },
  },
  ERP_COACH: {
    personaId: "ERP_COACH",
    characterId: "marc-andre-tremblay",
    name: "Marc-André Tremblay",
    firstName: "Marc-André",
    title: {
      fr: "Superviseur d'entrepôt",
      en: "Warehouse Supervisor",
    },
    department: DEPARTMENT_LABELS.WH,
    departmentCode: "WH",
    avatarInitials: "MT",
    consultButton: { fr: "Consulter Marc-André", en: "Consult Marc-André" },
    availabilityNote: {
      fr: "Marc-André est disponible pour vous orienter — la décision opérationnelle reste la vôtre.",
      en: "Marc-André is available to guide you — the operational decision remains yours.",
    },
  },
  QUALITY_GUIDE: {
    personaId: "QUALITY_GUIDE",
    characterId: "david-okonkwo",
    name: "David Okonkwo",
    firstName: "David",
    title: {
      fr: "Spécialiste qualité",
      en: "Quality Specialist",
    },
    department: DEPARTMENT_LABELS.QA,
    departmentCode: "QA",
    avatarInitials: "DO",
    consultButton: { fr: "Consulter David", en: "Consult David" },
    availabilityNote: {
      fr: "David est disponible pour vous orienter sur nos procédures qualité — la décision reste la vôtre.",
      en: "David is available to guide you on our quality procedures — the decision remains yours.",
    },
  },
  PROCUREMENT_GUIDE: {
    personaId: "PROCUREMENT_GUIDE",
    characterId: "jean-philippe-morin",
    name: "Jean-Philippe Morin",
    firstName: "Jean-Philippe",
    title: {
      fr: "Acheteur senior",
      en: "Senior Buyer",
    },
    department: DEPARTMENT_LABELS.PROC,
    departmentCode: "PROC",
    avatarInitials: "JM",
    consultButton: { fr: "Consulter Jean-Philippe", en: "Consult Jean-Philippe" },
    availabilityNote: {
      fr: "Jean-Philippe est disponible pour discuter de nos approvisionnements — vous restez responsable de la décision.",
      en: "Jean-Philippe is available to discuss our procurement — you remain responsible for the decision.",
    },
  },
};

export function getEnterpriseEmployeeProfile(personaId: MentorPersonaId): EnterpriseEmployeeProfile {
  return ENTERPRISE_EMPLOYEES[personaId];
}

export function getEnterpriseEmployeeForLanguage(
  personaId: MentorPersonaId,
  language: "fr" | "en",
): {
  name: string;
  firstName: string;
  title: string;
  department: string;
  avatarInitials: string;
  consultButtonLabel: string;
  availabilityNote: string;
} {
  const profile = getEnterpriseEmployeeProfile(personaId);
  return {
    name: profile.name,
    firstName: profile.firstName,
    title: profile.title[language],
    department: profile.department[language],
    avatarInitials: profile.avatarInitials,
    consultButtonLabel: profile.consultButton[language],
    availabilityNote: profile.availabilityNote[language],
  };
}

/** Student-visible strings must never expose AI vocabulary. */
export const FORBIDDEN_STUDENT_AI_TERMS =
  /\b(AI|OpenAI|ChatGPT|Assistant|Chatbot|Language Model|Operational Colleague|Mentor IA|AI Mentor)\b/i;
