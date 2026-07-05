/** Architecture Foundation v1.0 — enterprise briefing field schema (Manifesto Part III §3.2) */

export type PriorityLevel = "normal" | "elevee" | "critique" | "pointe";

export type DepartmentCode =
  | "WH"
  | "REC"
  | "SHP"
  | "INV"
  | "PROC"
  | "PLAN"
  | "CS"
  | "FIN"
  | "QA"
  | "OPS"
  | "MGT";

export interface StakeholderRef {
  code: string;
  name: string;
  nameFr?: string;
  nameEn?: string;
  industry?: string;
  slaProfile?: { fr: string; en: string };
}

export interface CharacterRef {
  id: string;
  name: string;
  titleFr: string;
  titleEn: string;
  department: DepartmentCode;
  signaturePhraseFr: string;
  signaturePhraseEn: string;
}

export interface EnterpriseBriefingFields {
  situation?: string;
  mission?: string;
  businessContext?: { fr: string; en: string };
  peopleInvolved?: { fr: string; en: string };
  customer?: StakeholderRef | null;
  supplier?: StakeholderRef | null;
  priority: PriorityLevel;
  expectedBusinessOutcome?: string;
  kpis?: string[];
  documentsAvailable?: { fr: string; en: string }[];
  supervisor?: CharacterRef;
  supervisorNotesAttributed?: { fr: string; en: string };
  successCriteria?: string[];
  department: DepartmentCode;
  businessUnit: string;
  incidentId?: string | null;
  warehouseZone?: string;
}

export interface ScenarioUniverseBinding {
  scnCode: string;
  businessUnit: string;
  customerCode: string | null;
  supplierCode: string | null;
  warehouseZone: string;
  incidentId: string | null;
  supervisorId: string;
  priority: PriorityLevel;
  department: DepartmentCode;
}
