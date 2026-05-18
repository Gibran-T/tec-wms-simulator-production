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

  // ── Dark Premium Color Palette (Silver/Gold tier) ──────────────────────────
  const isSilver = cert.certType === "m1_fundamentals";
  const darkBg   = rgb(0.039, 0.063, 0.118);   // #0a1030 deep navy
  const darkCard  = rgb(0.059, 0.094, 0.176);   // #0f1830
  const accentMain = isSilver
    ? rgb(0.58, 0.64, 0.72)   // silver #94a3b8
    : rgb(0.918, 0.702, 0.031); // gold #eab308
  const accentLight = isSilver
    ? rgb(0.88, 0.91, 0.95)   // light silver
    : rgb(0.996, 0.941, 0.196); // light gold #fde047
  const white     = rgb(1, 1, 1);
  const offWhite  = rgb(0.87, 0.89, 0.92);   // #dee2eb
  const slate400  = rgb(0.58, 0.64, 0.72);   // #94a3b8
  const slate600  = rgb(0.28, 0.33, 0.40);   // #475569
  const emerald   = rgb(0.13, 0.77, 0.37);   // #22c55e

  // ── Background ───────────────────────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: 0, width, height, color: darkBg });

  // Subtle grid lines
  for (let gx = 0; gx < width; gx += 40) {
    page.drawLine({ start: { x: gx, y: 0 }, end: { x: gx, y: height }, thickness: 0.3, color: rgb(1,1,1), opacity: 0.03 });
  }
  for (let gy = 0; gy < height; gy += 40) {
    page.drawLine({ start: { x: 0, y: gy }, end: { x: width, y: gy }, thickness: 0.3, color: rgb(1,1,1), opacity: 0.03 });
  }

  // Top accent bar
  page.drawRectangle({ x: 0, y: height - 3, width, height: 3, color: accentMain });

  // Header area
  page.drawRectangle({ x: 0, y: height - 80, width, height: 77, color: darkCard });

  // Header text
  page.drawText("COLLEGE DE LA CONCORDE", { x: 36, y: height - 32, size: 11, font: helveticaBold, color: accentMain });
  page.drawText("Departement Techniques de la logistique  ·  TEC.LOG", { x: 36, y: height - 50, size: 8, font: helvetica, color: slate400 });

  // Tier badge
  const tierLabel = isSilver ? "SILVER" : "GOLD";
  const tierName  = isSilver ? "TEC.LOG SILVER CERTIFICATION" : "TEC.LOG GOLD CERTIFICATION";
  page.drawRectangle({ x: width - 180, y: height - 72, width: 160, height: 52, color: darkBg, borderColor: accentMain, borderWidth: 1 });
  page.drawText(tierName, { x: width - 175, y: height - 36, size: 7, font: helveticaBold, color: accentMain });
  page.drawText(tierLabel, { x: width - 175, y: height - 56, size: 18, font: helveticaBold, color: accentLight });

  // ── Body ─────────────────────────────────────────────────────────────────────
  const bodyTop = height - 110;

  const certTitle = cert.certType === "m1_fundamentals"
    ? "TEC.LOG Fundamentals Certification"
    : "TEC.LOG Integrated Operations Certification";
  const certSubtitle = cert.certType === "m1_fundamentals"
    ? "Module 1 - Fondements ERP/WMS"
    : "Modules 2-5 - Simulation operationnelle integree";

  page.drawText(certTitle, { x: 36, y: bodyTop, size: 22, font: helveticaBold, color: white });
  page.drawText(certSubtitle, { x: 36, y: bodyTop - 22, size: 10, font: helvetica, color: slate400 });

  // Accent divider
  page.drawRectangle({ x: 36, y: bodyTop - 34, width: 60, height: 2, color: accentMain });

  page.drawText("Ce certificat est decerne a", { x: 36, y: bodyTop - 56, size: 8, font: helvetica, color: slate600 });
  page.drawText(cert.studentName, { x: 36, y: bodyTop - 82, size: 28, font: helveticaBold, color: white });

  // Status + modules pills
  page.drawRectangle({ x: 36, y: bodyTop - 115, width: 130, height: 20, color: rgb(0.08, 0.47, 0.22), borderColor: emerald, borderWidth: 1 });
  page.drawText("COMPETENCE VALIDEE", { x: 44, y: bodyTop - 108, size: 7, font: helveticaBold, color: emerald });

  const modLabel = cert.certType === "m1_fundamentals" ? "Module 1" : "Modules 2-5";
  page.drawRectangle({ x: 178, y: bodyTop - 115, width: 90, height: 20, color: darkCard, borderColor: slate600, borderWidth: 1 });
  page.drawText(modLabel, { x: 186, y: bodyTop - 108, size: 7, font: helveticaBold, color: offWhite });

  // Competencies
  const compTop = bodyTop - 140;
  page.drawText("COMPETENCES VALIDEES", { x: 36, y: compTop, size: 7, font: helveticaBold, color: accentMain });
  cert.competencies.slice(0, 4).forEach((comp, i) => {
    const truncated = comp.length > 80 ? comp.substring(0, 77) + "..." : comp;
    page.drawRectangle({ x: 36, y: compTop - 20 - i * 18, width: 4, height: 10, color: accentMain });
    page.drawText(truncated, { x: 46, y: compTop - 18 - i * 18, size: 7, font: helvetica, color: offWhite });
  });

  // ── Right column ─────────────────────────────────────────────────────────────
  const rightX = width - 220;

  // Credential ID block
  page.drawRectangle({ x: rightX, y: bodyTop - 50, width: 195, height: 50, color: darkCard, borderColor: accentMain, borderWidth: 1 });
  page.drawText("IDENTIFIANT DE CERTIFICATION", { x: rightX + 10, y: bodyTop - 22, size: 6.5, font: helveticaBold, color: accentMain });
  page.drawText(cert.credentialId, { x: rightX + 10, y: bodyTop - 38, size: 11, font: helveticaBold, color: white });

  // Date
  const dateStr = cert.issuedAt.toLocaleDateString("fr-CA", { year: "numeric", month: "long", day: "numeric" });
  page.drawText(`Emis le : ${dateStr}`, { x: rightX, y: bodyTop - 68, size: 8, font: helvetica, color: slate400 });
  page.drawText("Statut : VALIDE", { x: rightX, y: bodyTop - 82, size: 8, font: helveticaBold, color: emerald });

  // Signature block
  page.drawRectangle({ x: rightX, y: bodyTop - 160, width: 195, height: 65, color: darkCard, borderColor: slate600, borderWidth: 1 });
  page.drawRectangle({ x: rightX, y: bodyTop - 125, width: 195, height: 30, color: rgb(1,1,1), opacity: 0.04 });
  page.drawText("[Signature officielle - a venir]", { x: rightX + 10, y: bodyTop - 115, size: 7, font: helveticaOblique, color: slate600 });
  page.drawLine({ start: { x: rightX + 10, y: bodyTop - 130 }, end: { x: rightX + 185, y: bodyTop - 130 }, thickness: 0.5, color: slate600 });
  page.drawText("Nadia Allami, Directrice", { x: rightX + 10, y: bodyTop - 143, size: 8, font: helveticaBold, color: offWhite });
  page.drawText("College de la Concorde - Dept. Techniques de la logistique", { x: rightX + 10, y: bodyTop - 155, size: 6, font: helvetica, color: slate600 });

  // QR code
  const qrSize = 65;
  const qrX = rightX + 125;
  const qrY = bodyTop - 260;
  try {
    const qrDataUrl = await QRCode.toDataURL(cert.verificationUrl, { width: 130, margin: 2, color: { dark: "#0a1030", light: "#ffffff" } });
    const qrBase64 = qrDataUrl.split(",")[1];
    const qrImage = await pdfDoc.embedPng(Buffer.from(qrBase64, "base64"));
    page.drawImage(qrImage, { x: qrX, y: qrY, width: qrSize, height: qrSize });
  } catch {
    page.drawRectangle({ x: qrX, y: qrY, width: qrSize, height: qrSize, color: darkCard });
    page.drawText("QR", { x: qrX + 22, y: qrY + 28, size: 12, font: helveticaBold, color: slate400 });
  }
  page.drawText("Scanner pour verifier", { x: qrX - 10, y: qrY - 12, size: 6, font: helvetica, color: slate600 });

  // Verification URL
  page.drawText("Verification : " + cert.verificationUrl, { x: rightX, y: bodyTop - 280, size: 6, font: helvetica, color: accentMain });

  // ── Footer ───────────────────────────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: 0, width, height: 28, color: darkCard });
  page.drawRectangle({ x: 0, y: 28, width, height: 1, color: accentMain, opacity: 0.3 });
  page.drawText("College de la Concorde · 570 rue Saint-Vallier Ouest, Quebec, G1K 1K1 · www.collegelaconcorde.com", { x: 36, y: 10, size: 6.5, font: helvetica, color: slate600 });
  page.drawText(`Hash : ${cert.verificationHash}`, { x: width - 220, y: 10, size: 6, font: helvetica, color: slate600 });

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

  getQRCode: publicProcedure
    .input(z.object({ credentialId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const rows = await db.select({ credentialId: certifications.credentialId })
        .from(certifications)
        .where(eq(certifications.credentialId, input.credentialId))
        .limit(1);
      if (!rows.length) return null;
      const verificationUrl = getVerificationUrl(input.credentialId);
      const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
        width: 200, margin: 2,
        color: { dark: "#0f172a", light: "#ffffff" },
      });
      return { qrCodeDataUrl: qrDataUrl };
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
