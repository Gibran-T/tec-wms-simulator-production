import registryData from "./railwayVerificationRegistry.json";

export type VerificationStatus = "ACTIVE" | "REVOKED" | "EXPIRED";

export type RailwayVerificationEntry = {
  certificateId: string;
  studentName: string;
  studentNumber: string;
  status: VerificationStatus;
};

export type VerifiedCredential = RailwayVerificationEntry & {
  program: "TEC.WMS";
  certificationLevel: "SILVER";
  issueDate: "2026-06-18";
  issuedBy: "Collège de la Concorde";
};

export const RAILWAY_VERIFICATION_REGISTRY: readonly RailwayVerificationEntry[] =
  registryData as RailwayVerificationEntry[];

export const VERIFICATION_PROGRAM = "TEC.WMS" as const;
export const VERIFICATION_LEVEL = "SILVER" as const;
export const VERIFICATION_ISSUE_DATE = "2026-06-18" as const;
export const VERIFICATION_ISSUED_BY = "Collège de la Concorde" as const;

function normalizeCertificateId(value: string): string {
  return value.trim().toUpperCase();
}

export function lookupVerifiedCredentialByCertificateId(
  certificateId: string,
): VerifiedCredential | null {
  const normalized = normalizeCertificateId(certificateId);
  const entry = RAILWAY_VERIFICATION_REGISTRY.find(
    (row) => row.certificateId === normalized,
  );
  if (!entry || entry.status !== "ACTIVE") return null;

  return {
    ...entry,
    program: VERIFICATION_PROGRAM,
    certificationLevel: VERIFICATION_LEVEL,
    issueDate: VERIFICATION_ISSUE_DATE,
    issuedBy: VERIFICATION_ISSUED_BY,
  };
}
