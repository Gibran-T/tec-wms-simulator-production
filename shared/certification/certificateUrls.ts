export const RAILWAY_PRODUCTION_BASE =
  "https://tec-wms-simulator-production-production.up.railway.app" as const;

export type CertificationTier = "SILVER" | "GOLD";

export const SILVER_CERTIFICATE_LINKEDIN_NAME = "TEC.WMS Silver Certification" as const;
export const GOLD_CERTIFICATE_LINKEDIN_NAME = "TEC.WMS Gold Certification" as const;
export const CERTIFICATE_LINKEDIN_ORG = "Collège de la Concorde" as const;
export const CERTIFICATE_ISSUE_YEAR = "2026" as const;
export const CERTIFICATE_ISSUE_MONTH = "6" as const;

const LINKEDIN_NAME_BY_TIER: Record<CertificationTier, string> = {
  SILVER: SILVER_CERTIFICATE_LINKEDIN_NAME,
  GOLD: GOLD_CERTIFICATE_LINKEDIN_NAME,
};

function inferCertificationTier(certificateId: string): CertificationTier {
  return certificateId.includes("-GOLD-") ? "GOLD" : "SILVER";
}

export function buildCertificatePdfUrl(
  certificateId: string,
  tier: CertificationTier = inferCertificationTier(certificateId),
): string {
  const tierPath = tier.toLowerCase();
  return `/certificates/${tierPath}/2026/${certificateId}.pdf`;
}

export function buildVerificationPath(certificateId: string): string {
  return `/verify/${certificateId}`;
}

export function buildProductionVerificationUrl(certificateId: string): string {
  return `${RAILWAY_PRODUCTION_BASE}${buildVerificationPath(certificateId)}`;
}

export function buildLinkedInCredentialUrl(
  certificateId: string,
  tier: CertificationTier = inferCertificationTier(certificateId),
): string {
  const params = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: LINKEDIN_NAME_BY_TIER[tier],
    organizationName: CERTIFICATE_LINKEDIN_ORG,
    issueYear: CERTIFICATE_ISSUE_YEAR,
    issueMonth: CERTIFICATE_ISSUE_MONTH,
    certId: certificateId,
    certUrl: buildProductionVerificationUrl(certificateId),
  });
  return `https://www.linkedin.com/profile/add?${params.toString()}`;
}
