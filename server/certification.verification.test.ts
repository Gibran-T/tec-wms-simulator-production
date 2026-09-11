import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  RAILWAY_VERIFICATION_REGISTRY,
  VERIFICATION_ISSUED_BY,
  VERIFICATION_ISSUE_DATE,
  VERIFICATION_PROGRAM,
  lookupVerifiedCredentialByCertificateId,
} from "../shared/certification/railwayVerificationRegistry";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

describe("Certification verification portal — V1", () => {
  it("loads twenty-two ACTIVE credentials from railwayVerificationRegistry.json", () => {
    expect(RAILWAY_VERIFICATION_REGISTRY).toHaveLength(22);
    expect(RAILWAY_VERIFICATION_REGISTRY.every((entry) => entry.status === "ACTIVE")).toBe(true);
    expect(RAILWAY_VERIFICATION_REGISTRY.filter((entry) => entry.certificationLevel === "SILVER")).toHaveLength(11);
    expect(RAILWAY_VERIFICATION_REGISTRY.filter((entry) => entry.certificationLevel === "GOLD")).toHaveLength(11);
    const ids = RAILWAY_VERIFICATION_REGISTRY.map((entry) => entry.certificateId);
    expect(new Set(ids).size).toBe(22);
  });

  it("resolves Silver acceptance certificate IDs to student names", () => {
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
    expect(lookupVerifiedCredentialByCertificateId("TECWMS-SIL-2026-005")?.studentName).toBe(
      "Marc Arthur Dessin",
    );
    expect(lookupVerifiedCredentialByCertificateId("TECWMS-SIL-2026-011")?.studentName).toBe(
      "Ghislain Djitouo Pepouo",
    );
  });

  it("resolves Gold acceptance certificate IDs to student names", () => {
    expect(lookupVerifiedCredentialByCertificateId("TECWMS-GOLD-2026-001")?.studentName).toBe(
      "Darlin Campaz Paredes",
    );
    expect(lookupVerifiedCredentialByCertificateId("TECWMS-GOLD-2026-002")?.studentName).toBe(
      "Fredy Tamile Lola",
    );
    expect(lookupVerifiedCredentialByCertificateId("TECWMS-GOLD-2026-003")?.studentName).toBe(
      "Prince Agbodjan Sewa Francis Ghislain",
    );
    expect(lookupVerifiedCredentialByCertificateId("TECWMS-GOLD-2026-004")?.studentName).toBe(
      "Aissata Soukeina Camara",
    );
    expect(lookupVerifiedCredentialByCertificateId("TECWMS-GOLD-2026-008")?.studentName).toBe(
      "Gnouma Camara",
    );
    expect(lookupVerifiedCredentialByCertificateId("TECWMS-GOLD-2026-010")?.studentName).toBe(
      "Yawo Valentin Sodokin",
    );
  });

  it("returns null for unknown certificate IDs", () => {
    expect(lookupVerifiedCredentialByCertificateId("INVALID")).toBeNull();
    expect(lookupVerifiedCredentialByCertificateId("TECWMS-SIL-9999-999")).toBeNull();
    expect(lookupVerifiedCredentialByCertificateId("TECWMS-GOLD-9999-999")).toBeNull();
  });

  it("normalizes certificate ID casing and whitespace", () => {
    expect(lookupVerifiedCredentialByCertificateId("tecwms-sil-2026-002")?.studentName).toBe(
      "Fredy Tamile Lola",
    );
    expect(lookupVerifiedCredentialByCertificateId("  TECWMS-SIL-2026-003  ")?.studentName).toBe(
      "Prince Agbodjan Sewa Francis Ghislain",
    );
    expect(lookupVerifiedCredentialByCertificateId("tecwms-gold-2026-001")?.studentName).toBe(
      "Darlin Campaz Paredes",
    );
  });

  it("includes fixed institutional verification metadata for Silver", () => {
    const entry = lookupVerifiedCredentialByCertificateId("TECWMS-SIL-2026-001");
    expect(entry).toMatchObject({
      program: VERIFICATION_PROGRAM,
      certificationLevel: "SILVER",
      issueDate: VERIFICATION_ISSUE_DATE,
      issuedBy: VERIFICATION_ISSUED_BY,
      status: "ACTIVE",
      studentNumber: "002004",
      pdfUrl: "/certificates/silver/2026/TECWMS-SIL-2026-001.pdf",
      verificationUrl: "/verify/TECWMS-SIL-2026-001",
      linkedinCredentialUrl:
        "https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=TEC.WMS+Silver+Certification&organizationName=Coll%C3%A8ge+de+la+Concorde&issueYear=2026&issueMonth=6&certId=TECWMS-SIL-2026-001&certUrl=https%3A%2F%2Ftec-wms-simulator-production-production.up.railway.app%2Fverify%2FTECWMS-SIL-2026-001",
    });
  });

  it("includes fixed institutional verification metadata for Gold", () => {
    const entry = lookupVerifiedCredentialByCertificateId("TECWMS-GOLD-2026-001");
    expect(entry).toMatchObject({
      program: VERIFICATION_PROGRAM,
      certificationLevel: "GOLD",
      issueDate: VERIFICATION_ISSUE_DATE,
      issuedBy: VERIFICATION_ISSUED_BY,
      status: "ACTIVE",
      studentNumber: "002004",
      pdfUrl: "/certificates/gold/2026/TECWMS-GOLD-2026-001.pdf",
      verificationUrl: "/verify/TECWMS-GOLD-2026-001",
      linkedinCredentialUrl:
        "https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=TEC.WMS+Gold+Certification&organizationName=Coll%C3%A8ge+de+la+Concorde&issueYear=2026&issueMonth=6&certId=TECWMS-GOLD-2026-001&certUrl=https%3A%2F%2Ftec-wms-simulator-production-production.up.railway.app%2Fverify%2FTECWMS-GOLD-2026-001",
    });
  });

  it("stores Silver certificate PDFs under Vite publicDir so they ship in dist/public", () => {
    const vitePublicCertificatesDir = path.join(
      rootDir,
      "../client/public/certificates/silver/2026",
    );
    for (const certificateId of [
      "TECWMS-SIL-2026-001",
      "TECWMS-SIL-2026-002",
      "TECWMS-SIL-2026-003",
      "TECWMS-SIL-2026-004",
      "TECWMS-SIL-2026-005",
      "TECWMS-SIL-2026-006",
      "TECWMS-SIL-2026-007",
      "TECWMS-SIL-2026-008",
      "TECWMS-SIL-2026-009",
      "TECWMS-SIL-2026-010",
      "TECWMS-SIL-2026-011",
    ]) {
      expect(existsSync(path.join(vitePublicCertificatesDir, `${certificateId}.pdf`))).toBe(true);
      expect(existsSync(path.join(vitePublicCertificatesDir, `${certificateId}.HOLD`))).toBe(false);
    }
  });

  it("stores Gold certificate PDFs under Vite publicDir so they ship in dist/public", () => {
    const vitePublicCertificatesDir = path.join(
      rootDir,
      "../client/public/certificates/gold/2026",
    );
    for (const certificateId of [
      "TECWMS-GOLD-2026-001",
      "TECWMS-GOLD-2026-002",
      "TECWMS-GOLD-2026-003",
      "TECWMS-GOLD-2026-004",
      "TECWMS-GOLD-2026-005",
      "TECWMS-GOLD-2026-006",
      "TECWMS-GOLD-2026-007",
      "TECWMS-GOLD-2026-008",
      "TECWMS-GOLD-2026-009",
      "TECWMS-GOLD-2026-010",
      "TECWMS-GOLD-2026-011",
    ]) {
      expect(existsSync(path.join(vitePublicCertificatesDir, `${certificateId}.pdf`))).toBe(true);
      expect(existsSync(path.join(vitePublicCertificatesDir, `${certificateId}.HOLD`))).toBe(false);
    }
  });

  it("maps Été 2026 IDs 005-011 to the correct student number and cohort prefix", () => {
    const expected = [
      ["TECWMS-SIL-2026-005", "Marc Arthur Dessin", "TECWMS-2026-A-002"],
      ["TECWMS-GOLD-2026-005", "Marc Arthur Dessin", "TECWMS-2026-A-002"],
      ["TECWMS-SIL-2026-006", "Toumany Diakité", "TECWMS-2026-A-003"],
      ["TECWMS-GOLD-2026-006", "Toumany Diakité", "TECWMS-2026-A-003"],
      ["TECWMS-SIL-2026-007", "Saïd Mohamed Traoré", "TECWMS-2026-A-004"],
      ["TECWMS-GOLD-2026-007", "Saïd Mohamed Traoré", "TECWMS-2026-A-004"],
      ["TECWMS-SIL-2026-008", "Gnouma Camara", "TECWMS-2026-B-001"],
      ["TECWMS-GOLD-2026-008", "Gnouma Camara", "TECWMS-2026-B-001"],
      ["TECWMS-SIL-2026-009", "Willy Martial Kouganou Siani", "TECWMS-2026-B-002"],
      ["TECWMS-GOLD-2026-009", "Willy Martial Kouganou Siani", "TECWMS-2026-B-002"],
      ["TECWMS-SIL-2026-010", "Yawo Valentin Sodokin", "TECWMS-2026-B-003"],
      ["TECWMS-GOLD-2026-010", "Yawo Valentin Sodokin", "TECWMS-2026-B-003"],
      ["TECWMS-SIL-2026-011", "Ghislain Djitouo Pepouo", "TECWMS-2026-B-004"],
      ["TECWMS-GOLD-2026-011", "Ghislain Djitouo Pepouo", "TECWMS-2026-B-004"],
    ] as const;

    for (const [certificateId, studentName, studentNumber] of expected) {
      const entry = lookupVerifiedCredentialByCertificateId(certificateId);
      expect(entry).toMatchObject({
        studentName,
        studentNumber,
        status: "ACTIVE",
        verificationUrl: `/verify/${certificateId}`,
      });
      expect(entry?.pdfUrl).toBe(
        `/certificates/${certificateId.includes("-GOLD-") ? "gold" : "silver"}/2026/${certificateId}.pdf`,
      );
    }
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
    const actionsSource = readFileSync(
      path.join(rootDir, "../client/src/components/certification/CertificateCredentialActions.tsx"),
      "utf8",
    );
    expect(pageSource).toContain("lookupVerifiedCredentialByCertificateId");
    expect(pageSource).toContain("@shared/certification/railwayVerificationRegistry");
    expect(pageSource).toContain("GoldBadgeSvg");
    expect(pageSource).toContain("Certificate Not Found");
    expect(pageSource).toContain("Verified Credential");
    expect(pageSource).toContain("Credential URL");
    expect(pageSource).toContain("Credential ID");
    expect(pageSource).toContain("CertificateCredentialActions");
    expect(actionsSource).toContain("Télécharger PDF");
    expect(actionsSource).toContain("Ajouter à LinkedIn");
  });
});
