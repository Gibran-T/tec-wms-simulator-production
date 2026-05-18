/**
 * certificationRouter.ts
 * TEC.LOG Digital Certification System
 * Handles: issuance, verification, PDF generation
 * Does NOT modify: datasets, scoring, scenarios, module logic
 */

import { router, protectedProcedure, publicProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getDb } from "./db";
import { certifications, users, quizAttempts } from "../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import crypto from "crypto";
import QRCode from "qrcode";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateCredentialId(certType: string): string {
  const prefix = certType === "m1_fundamentals" ? "TECLOG-M1" : "TECLOG-M5";
  const year = new Date().getFullYear();
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `${prefix}-${year}-${rand}`;
}

function generateVerificationHash(credentialId: string): string {
  const secret = process.env.JWT_SECRET || "teclog-cert-secret";
  return crypto.createHmac("sha256", secret).update(credentialId).digest("hex").substring(0, 32);
}

function getVerificationUrl(credentialId: string): string {
  const base = process.env.VITE_APP_URL || "https://tecwmssim-nahgw8xk.manus.space";
  return `${base}/verify/${credentialId}`;
}

const M1_COMPETENCIES = [
  "Comprendre le flux logistique complet : PO → GR → PUTAWAY → STOCK → SO → GI → CC → COMPLIANCE",
  "Distinguer les rôles du WMS et de l'ERP dans la gestion des stocks",
  "Pratiquer les scénarios guidés dans TEC.WMS (SCN-001 à SCN-005)",
  "Observer les données réelles dans Odoo EDU LAB",
];

const M2M5_COMPETENCIES = [
  "Exécuter les flux d'entrepôt : emplacements, putaway, transferts internes",
  "Appliquer les règles Min/Max et le réapprovisionnement automatique",
  "Analyser les KPIs opérationnels : OTIF, taux de service, rotation de stock",
  "Exécuter un flux intégré achats-production-livraison end-to-end",
  "Assurer la traçabilité complète et l'audit de conformité final",
];

// ── PDF Certificate Generator ─────────────────────────────────────────────────

async function generateCertificatePDF(cert: {
  credentialId: string;
  studentName: string;
  certType: "m1_fundamentals" | "m2m5_integrated";
  finalScore: number;
  modulesCompleted: number[];
  competencies: string[];
  issuedAt: Date;
  verificationUrl: string;
  verificationHash: string;
}): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 landscape
  const { width, height } = page.getSize();

  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Color palette
  const concorBlue = rgb(0.047, 0.196, 0.42);
  const accentBlue = rgb(0.0, 0.47, 0.84);
  const silver = rgb(0.75, 0.77, 0.80);
  const lightGray = rgb(0.96, 0.97, 0.98);
  const darkText = rgb(0.1, 0.1, 0.15);
  const midGray = rgb(0.45, 0.47, 0.52);
  const gold = rgb(0.80, 0.65, 0.15);
  const white = rgb(1, 1, 1);

  // Background
  page.drawRectangle({ x: 0, y: 0, width, height, color: white });
  page.drawRectangle({ x: 0, y: 0, width: 12, height, color: concorBlue });
  page.drawRectangle({ x: 12, y: height - 90, width: width - 12, height: 90, color: concorBlue });
  page.drawRectangle({ x: 12, y: height - 93, width: width - 12, height: 3, color: gold });

  // Header
  page.drawText("COLLÈGE DE LA CONCORDE", { x: 36, y: height - 38, size: 13, font: helveticaBold, color: white });
  page.drawText("Département Techniques de la logistique  ·  TEC.LOG", { x: 36, y: height - 56, size: 9, font: helvetica, color: silver });

  // TEC.LOG badge
  page.drawRectangle({ x: width - 140, y: height - 75, width: 120, height: 50, color: accentBlue });
  page.drawText("TEC.LOG", { x: width - 130, y: height - 42, size: 16, font: helveticaBold, color: white });
  page.drawText("CERTIFICATION", { x: width - 130, y: height - 57, size: 7.5, font: helveticaBold, color: silver });

  const bodyTop = height - 130;

  page.drawText("CERTIFICAT DE RÉUSSITE", { x: 36, y: bodyTop, size: 9, font: helveticaBold, color: accentBlue });

  const certTitle = cert.certType === "m1_fundamentals"
    ? "TEC.LOG Fundamentals Certification"
    : "TEC.LOG Integrated ERP/WMS Logistics Certification";
  const certSubtitle = cert.certType === "m1_fundamentals"
    ? "Module 1 — Fondements ERP/WMS"
    : "Modules 2–5 — Simulation opérationnelle intégrée";

  page.drawText(certTitle, { x: 36, y: bodyTop - 28, size: 20, font: helveticaBold, color: concorBlue });
  page.drawText(certSubtitle, { x: 36, y: bodyTop - 48, size: 11, font: helveticaOblique, color: midGray });

  page.drawLine({ start: { x: 36, y: bodyTop - 62 }, end: { x: width - 36, y: bodyTop - 62 }, thickness: 0.5, color: silver });

  page.drawText("Ce certificat est décerné à", { x: 36, y: bodyTop - 82, size: 9, font: helvetica, color: midGray });
  page.drawText(cert.studentName, { x: 36, y: bodyTop - 108, size: 26, font: helveticaBold, color: concorBlue });

  // Score badge
  page.drawRectangle({ x: 36, y: bodyTop - 148, width: 90, height: 32, color: lightGray });
  page.drawRectangle({ x: 36, y: bodyTop - 148, width: 3, height: 32, color: accentBlue });
  page.drawText("SCORE FINAL", { x: 44, y: bodyTop - 134, size: 7, font: helveticaBold, color: midGray });
  page.drawText(`${cert.finalScore}/100`, { x: 44, y: bodyTop - 148, size: 13, font: helveticaBold, color: concorBlue });

  // Modules badge
  const modLabel = cert.certType === "m1_fundamentals" ? "MODULE 1" : "MODULES 2-5";
  page.drawRectangle({ x: 140, y: bodyTop - 148, width: 110, height: 32, color: lightGray });
  page.drawRectangle({ x: 140, y: bodyTop - 148, width: 3, height: 32, color: gold });
  page.drawText("MODULES COMPLETES", { x: 148, y: bodyTop - 134, size: 7, font: helveticaBold, color: midGray });
  page.drawText(modLabel, { x: 148, y: bodyTop - 148, size: 13, font: helveticaBold, color: concorBlue });

  // Competencies
  const compTop = bodyTop - 175;
  page.drawText("COMPETENCES VALIDEES", { x: 36, y: compTop, size: 8, font: helveticaBold, color: accentBlue });
  cert.competencies.slice(0, 4).forEach((comp, i) => {
    const truncated = comp.length > 85 ? comp.substring(0, 82) + "..." : comp;
    page.drawText(`- ${truncated}`, { x: 36, y: compTop - 16 - i * 14, size: 7.5, font: helvetica, color: darkText });
  });

  // Right column
  const rightX = width - 230;
  const sigTop = bodyTop - 80;

  page.drawRectangle({ x: rightX, y: sigTop - 70, width: 195, height: 70, color: lightGray });
  page.drawText("[NADIA_ALLAMI_SIGNATURE_IMAGE_PLACEHOLDER]", { x: rightX + 10, y: sigTop - 38, size: 7, font: helveticaOblique, color: midGray });
  page.drawLine({ start: { x: rightX + 10, y: sigTop - 50 }, end: { x: rightX + 185, y: sigTop - 50 }, thickness: 0.5, color: silver });
  page.drawText("Nadia Allami, Directrice", { x: rightX + 10, y: sigTop - 62, size: 8, font: helveticaBold, color: concorBlue });
  page.drawText("College de la Concorde - Dept. Techniques de la logistique", { x: rightX + 10, y: sigTop - 73, size: 6.5, font: helvetica, color: midGray });

  const credTop = sigTop - 105;
  page.drawRectangle({ x: rightX, y: credTop - 40, width: 195, height: 40, color: concorBlue });
  page.drawText("IDENTIFIANT DE CERTIFICATION", { x: rightX + 8, y: credTop - 14, size: 6.5, font: helveticaBold, color: silver });
  page.drawText(cert.credentialId, { x: rightX + 8, y: credTop - 28, size: 10, font: helveticaBold, color: white });

  const dateStr = cert.issuedAt.toLocaleDateString("fr-CA", { year: "numeric", month: "long", day: "numeric" });
  page.drawText(`Emis le : ${dateStr}`, { x: rightX, y: credTop - 56, size: 8, font: helvetica, color: midGray });
  page.drawText("Verification : " + cert.verificationUrl, { x: rightX, y: credTop - 70, size: 6.5, font: helvetica, color: accentBlue });

  // QR code
  const qrSize = 60;
  const qrX = rightX + 135;
  const qrY = credTop - 145;
  try {
    const qrDataUrl = await QRCode.toDataURL(cert.verificationUrl, { width: 120, margin: 1, color: { dark: "#0C3269", light: "#FFFFFF" } });
    const qrBase64 = qrDataUrl.split(",")[1];
    const qrImage = await pdfDoc.embedPng(Buffer.from(qrBase64, "base64"));
    page.drawImage(qrImage, { x: qrX, y: qrY, width: qrSize, height: qrSize });
  } catch {
    page.drawRectangle({ x: qrX, y: qrY, width: qrSize, height: qrSize, color: lightGray });
    page.drawText("QR", { x: qrX + 22, y: qrY + 25, size: 12, font: helveticaBold, color: midGray });
  }
  page.drawText("Scanner pour verifier", { x: qrX - 5, y: qrY - 10, size: 6, font: helvetica, color: midGray });

  // Footer
  page.drawRectangle({ x: 12, y: 0, width: width - 12, height: 28, color: lightGray });
  page.drawLine({ start: { x: 12, y: 28 }, end: { x: width, y: 28 }, thickness: 0.5, color: silver });
  page.drawText("College de la Concorde · 570 rue Saint-Vallier Ouest, Quebec, G1K 1K1 · www.collegelaconcorde.com", { x: 36, y: 10, size: 6.5, font: helvetica, color: midGray });
  page.drawText(`Hash : ${cert.verificationHash}`, { x: width - 220, y: 10, size: 6, font: helvetica, color: silver });

  return pdfDoc.save();
}

// ── Router ────────────────────────────────────────────────────────────────────

export const certificationRouter = router({

  issue: protectedProcedure
    .input(z.object({ certType: z.enum(["m1_fundamentals", "m2m5_integrated"]) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      const userId = ctx.user.id;

      const existing = await db.select().from(certifications)
        .where(and(eq(certifications.userId, userId), eq(certifications.certType, input.certType)))
        .limit(1);

      if (existing.length > 0) {
        return { credentialId: existing[0].credentialId, alreadyIssued: true };
      }

      const userRows = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!userRows.length) throw new TRPCError({ code: "NOT_FOUND" });
      const user = userRows[0];

      const moduleIds = input.certType === "m1_fundamentals" ? [1] : [2, 3, 4, 5];
      const quizRows = await db.select().from(quizAttempts)
        .where(eq(quizAttempts.userId, userId))
        .orderBy(desc(quizAttempts.score));

      const relevantScores = quizRows.filter(q => moduleIds.includes(q.moduleId));
      const finalScore = relevantScores.length > 0
        ? Math.round(relevantScores.reduce((s, q) => s + q.score, 0) / relevantScores.length)
        : 75;

      const credentialId = generateCredentialId(input.certType);
      const verificationHash = generateVerificationHash(credentialId);
      const competencies = input.certType === "m1_fundamentals" ? M1_COMPETENCIES : M2M5_COMPETENCIES;

      await db.insert(certifications).values({
        credentialId, userId, certType: input.certType,
        studentName: user.name || user.email || "Étudiant",
        studentEmail: user.email || "",
        finalScore, modulesCompleted: moduleIds, competencies, verificationHash,
      });

      return { credentialId, alreadyIssued: false };
    }),

  getByCredentialId: publicProcedure
    .input(z.object({ credentialId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const rows = await db.select().from(certifications)
        .where(eq(certifications.credentialId, input.credentialId))
        .limit(1);

      if (!rows.length) return null;
      const cert = rows[0];
      return {
        credentialId: cert.credentialId,
        certType: cert.certType,
        studentName: cert.studentName,
        finalScore: cert.finalScore,
        modulesCompleted: cert.modulesCompleted as number[],
        competencies: cert.competencies as string[],
        issuedAt: cert.issuedAt,
        isValid: !cert.revokedAt,
        verificationHash: cert.verificationHash,
        verificationUrl: getVerificationUrl(cert.credentialId),
      };
    }),

  getMine: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    const rows = await db.select().from(certifications)
      .where(eq(certifications.userId, ctx.user.id))
      .orderBy(desc(certifications.issuedAt));

    return rows.map(cert => ({
      credentialId: cert.credentialId,
      certType: cert.certType,
      studentName: cert.studentName,
      finalScore: cert.finalScore,
      modulesCompleted: cert.modulesCompleted as number[],
      competencies: cert.competencies as string[],
      issuedAt: cert.issuedAt,
      isValid: !cert.revokedAt,
      verificationUrl: getVerificationUrl(cert.credentialId),
    }));
  }),

  generatePDF: protectedProcedure
    .input(z.object({ credentialId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      const rows = await db.select().from(certifications)
        .where(and(eq(certifications.credentialId, input.credentialId), eq(certifications.userId, ctx.user.id)))
        .limit(1);

      if (!rows.length) throw new TRPCError({ code: "NOT_FOUND", message: "Certification non trouvée" });
      const cert = rows[0];

      const pdfBytes = await generateCertificatePDF({
        credentialId: cert.credentialId,
        studentName: cert.studentName,
        certType: cert.certType,
        finalScore: cert.finalScore,
        modulesCompleted: cert.modulesCompleted as number[],
        competencies: cert.competencies as string[],
        issuedAt: cert.issuedAt,
        verificationUrl: getVerificationUrl(cert.credentialId),
        verificationHash: cert.verificationHash,
      });

      return { pdfBase64: Buffer.from(pdfBytes).toString("base64") };
    }),

  seedDemo: protectedProcedure
    .input(z.object({ certType: z.enum(["m1_fundamentals", "m2m5_integrated"]) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      const userId = ctx.user.id;

      const userRows = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!userRows.length) throw new TRPCError({ code: "NOT_FOUND" });
      const user = userRows[0];

      await db.delete(certifications).where(
        and(eq(certifications.userId, userId), eq(certifications.certType, input.certType))
      );

      const credentialId = generateCredentialId(input.certType);
      const verificationHash = generateVerificationHash(credentialId);
      const competencies = input.certType === "m1_fundamentals" ? M1_COMPETENCIES : M2M5_COMPETENCIES;
      const moduleIds = input.certType === "m1_fundamentals" ? [1] : [2, 3, 4, 5];

      await db.insert(certifications).values({
        credentialId, userId, certType: input.certType,
        studentName: user.name || user.email || "Étudiant Démo",
        studentEmail: user.email || "",
        finalScore: 85, modulesCompleted: moduleIds, competencies, verificationHash,
      });

      return { credentialId };
    }),
});
