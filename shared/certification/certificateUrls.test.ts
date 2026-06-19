import { describe, expect, it } from "vitest";
import {
  buildCertificatePdfUrl,
  buildLinkedInCredentialUrl,
  buildProductionVerificationUrl,
  buildVerificationPath,
} from "./certificateUrls";

describe("certificateUrls", () => {
  it("builds PDF and verification paths for Silver cohort IDs", () => {
    expect(buildCertificatePdfUrl("TECWMS-SIL-2026-001")).toBe(
      "/certificates/silver/2026/TECWMS-SIL-2026-001.pdf",
    );
    expect(buildVerificationPath("TECWMS-SIL-2026-001")).toBe("/verify/TECWMS-SIL-2026-001");
    expect(buildProductionVerificationUrl("TECWMS-SIL-2026-001")).toBe(
      "https://tec-wms-simulator-production-production.up.railway.app/verify/TECWMS-SIL-2026-001",
    );
  });

  it("builds LinkedIn add-certification URL with institutional metadata", () => {
    const url = new URL(buildLinkedInCredentialUrl("TECWMS-SIL-2026-001"));
    expect(url.origin + url.pathname).toBe("https://www.linkedin.com/profile/add");
    expect(url.searchParams.get("startTask")).toBe("CERTIFICATION_NAME");
    expect(url.searchParams.get("name")).toBe("TEC.WMS Silver Certification");
    expect(url.searchParams.get("organizationName")).toBe("Collège de la Concorde");
    expect(url.searchParams.get("issueYear")).toBe("2026");
    expect(url.searchParams.get("issueMonth")).toBe("6");
    expect(url.searchParams.get("certId")).toBe("TECWMS-SIL-2026-001");
    expect(url.searchParams.get("certUrl")).toBe(
      "https://tec-wms-simulator-production-production.up.railway.app/verify/TECWMS-SIL-2026-001",
    );
  });
});
