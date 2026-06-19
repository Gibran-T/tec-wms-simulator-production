import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  RAILWAY_VERIFICATION_REGISTRY,
  VERIFICATION_ISSUED_BY,
  VERIFICATION_ISSUE_DATE,
  VERIFICATION_LEVEL,
  VERIFICATION_PROGRAM,
  lookupVerifiedCredentialByCertificateId,
} from "../shared/certification/railwayVerificationRegistry";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

describe("Certification verification portal — V1", () => {
  it("loads four ACTIVE credentials from railwayVerificationRegistry.json", () => {
    expect(RAILWAY_VERIFICATION_REGISTRY).toHaveLength(4);
    expect(RAILWAY_VERIFICATION_REGISTRY.every((entry) => entry.status === "ACTIVE")).toBe(true);
  });

  it("resolves acceptance certificate IDs to student names", () => {
    expect(lookupVerifiedCredentialByCertificateId("TECWMS-SIL-2026-001")?.studentName).toBe(
      "Darlin Campaz Paredes",
    );
    expect(lookupVerifiedCredentialByCertificateId("TECWMS-SIL-2026-002")?.studentName).toBe(
      "Fredy Tamile Lola",
    );
    expect(lookupVerifiedCredentialByCertificateId("TECWMS-SIL-2026-003")?.studentName).toBe(
      "Prince Agbodjan Sewa Francis Ghislain",
    );
    expect(lookupVerifiedCredentialByCertificateId("TECWMS-SIL-2026-004")?.studentName).toBe(
      "Aissata Soukeina Camara",
    );
  });

  it("returns null for unknown certificate IDs", () => {
    expect(lookupVerifiedCredentialByCertificateId("INVALID")).toBeNull();
    expect(lookupVerifiedCredentialByCertificateId("TECWMS-SIL-9999-999")).toBeNull();
  });

  it("normalizes certificate ID casing and whitespace", () => {
    expect(lookupVerifiedCredentialByCertificateId("tecwms-sil-2026-002")?.studentName).toBe(
      "Fredy Tamile Lola",
    );
    expect(lookupVerifiedCredentialByCertificateId("  TECWMS-SIL-2026-003  ")?.studentName).toBe(
      "Prince Agbodjan Sewa Francis Ghislain",
    );
  });

  it("includes fixed institutional verification metadata", () => {
    const entry = lookupVerifiedCredentialByCertificateId("TECWMS-SIL-2026-001");
    expect(entry).toMatchObject({
      program: VERIFICATION_PROGRAM,
      certificationLevel: VERIFICATION_LEVEL,
      issueDate: VERIFICATION_ISSUE_DATE,
      issuedBy: VERIFICATION_ISSUED_BY,
      status: "ACTIVE",
    });
  });

  it("exposes public /verify/:certificateId route without auth guard", () => {
    const appSource = readFileSync(path.join(rootDir, "../client/src/App.tsx"), "utf8");
    expect(appSource).toContain('<Route path="/verify/:certificateId" component={CertificateVerifyPage} />');
    expect(appSource).not.toMatch(/\/verify\/:certificateId[\s\S]*isAuthenticated/);
  });

  it("verification page reads from railwayVerificationRegistry", () => {
    const pageSource = readFileSync(
      path.join(rootDir, "../client/src/pages/verify/CertificateVerifyPage.tsx"),
      "utf8",
    );
    expect(pageSource).toContain("lookupVerifiedCredentialByCertificateId");
    expect(pageSource).toContain("@shared/certification/railwayVerificationRegistry");
    expect(pageSource).toContain("Certificate Not Found");
    expect(pageSource).toContain("Verified Credential");
  });
});
