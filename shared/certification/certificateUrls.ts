export const RAILWAY_PRODUCTION_BASE =
  "https://tec-wms-simulator-production-production.up.railway.app" as const;

export const SILVER_CERTIFICATE_LINKEDIN_NAME = "TEC.WMS Silver Certification" as const;
export const SILVER_CERTIFICATE_LINKEDIN_ORG = "Collège de la Concorde" as const;
export const SILVER_CERTIFICATE_ISSUE_YEAR = "2026" as const;
export const SILVER_CERTIFICATE_ISSUE_MONTH = "6" as const;

export function buildCertificatePdfUrl(certificateId: string): string {
  return `/certificates/silver/2026/${certificateId}.pdf`;
}

export function buildVerificationPath(certificateId: string): string {
  return `/verify/${certificateId}`;
}

export function buildProductionVerificationUrl(certificateId: string): string {
  return `${RAILWAY_PRODUCTION_BASE}${buildVerificationPath(certificateId)}`;
}

export function buildLinkedInCredentialUrl(certificateId: string): string {
  const params = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: SILVER_CERTIFICATE_LINKEDIN_NAME,
    organizationName: SILVER_CERTIFICATE_LINKEDIN_ORG,
    issueYear: SILVER_CERTIFICATE_ISSUE_YEAR,
    issueMonth: SILVER_CERTIFICATE_ISSUE_MONTH,
    certId: certificateId,
    certUrl: buildProductionVerificationUrl(certificateId),
  });
  return `https://www.linkedin.com/profile/add?${params.toString()}`;
}
