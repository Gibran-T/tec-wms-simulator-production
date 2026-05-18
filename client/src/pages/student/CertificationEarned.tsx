/**
 * CertificationEarned.tsx
 * Premium "Certification Earned" screen — TEC.LOG institutional design
 * Comparable to Cisco / Google / SAP credential experience
 */

import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────────

type CertType = "m1_fundamentals" | "m2m5_integrated";

interface CertData {
  credentialId: string;
  certType: CertType;
  studentName: string;
  finalScore: number;
  modulesCompleted: number[];
  competencies: string[];
  issuedAt: Date;
  isValid: boolean;
  verificationUrl: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getCertTitle(certType: CertType) {
  return certType === "m1_fundamentals"
    ? "TEC.LOG Fundamentals Certification"
    : "TEC.LOG Integrated ERP/WMS Logistics Certification";
}

function getCertSubtitle(certType: CertType) {
  return certType === "m1_fundamentals"
    ? "Module 1 — Fondements ERP/WMS"
    : "Modules 2–5 — Simulation opérationnelle intégrée";
}

function getModulesLabel(certType: CertType) {
  return certType === "m1_fundamentals" ? "Module 1" : "Modules 2 · 3 · 4 · 5";
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("fr-CA", {
    year: "numeric", month: "long", day: "numeric",
  });
}

function buildLinkedInUrl(cert: CertData) {
  const params = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: getCertTitle(cert.certType),
    organizationName: "Collège de la Concorde",
    issueYear: String(new Date(cert.issuedAt).getFullYear()),
    issueMonth: String(new Date(cert.issuedAt).getMonth() + 1),
    certId: cert.credentialId,
    certUrl: cert.verificationUrl,
  });
  return `https://www.linkedin.com/profile/add?${params.toString()}`;
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function CertificationEarned() {
  const params = useParams<{ certType: string }>();
  const [, navigate] = useLocation();
  const [cert, setCert] = useState<CertData | null>(null);
  const [copied, setCopied] = useState(false);

  const certType = (params.certType || "m1_fundamentals") as CertType;

  // Issue or retrieve certification
  const utils = trpc.useUtils();

  const issueMutation = trpc.certification.issue.useMutation({
    onSuccess: () => { utils.certification.getMine.invalidate(); },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const { data: myCerts, refetch } = trpc.certification.getMine.useQuery();

  const pdfMutation = trpc.certification.generatePDF.useMutation({
    onSuccess: (data: { pdfBase64: string }) => {
      const blob = new Blob([Uint8Array.from(atob(data.pdfBase64), c => c.charCodeAt(0))], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `TEC.LOG-Certification-${cert?.credentialId || "certificate"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Certificat téléchargé.");
    },
    onError: () => toast.error("Impossible de générer le PDF."),
  });

  useEffect(() => {
    if (myCerts) {
      const found = myCerts.find(c => c.certType === certType);
      if (found) {
        setCert(found as CertData);
      } else {
        // Auto-issue
        issueMutation.mutate({ certType });
      }
    }
  }, [myCerts, certType]);

  const handleCopyLink = () => {
    if (!cert) return;
    navigator.clipboard.writeText(cert.verificationUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Lien copié.");
    });
  };

  const handleDownloadPDF = () => {
    if (!cert) return;
    pdfMutation.mutate({ credentialId: cert.credentialId });
  };

  if (!cert) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0C3269] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#0C3269] font-medium">Émission de votre certification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4f9] flex flex-col items-center justify-center px-4 py-12">

      {/* ── Confetti-style header ── */}
      <div className="w-full max-w-3xl">

        {/* Top badge */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 bg-[#0C3269] text-white px-5 py-2 rounded-full text-sm font-semibold tracking-wide shadow-lg">
            <span className="text-[#C9A227]">★</span>
            CERTIFICATION OFFICIELLE ÉMISE
            <span className="text-[#C9A227]">★</span>
          </div>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">

          {/* Header band */}
          <div className="bg-[#0C3269] px-8 py-6 relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#C9A227]" />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[#C9A227] text-xs font-bold tracking-widest uppercase mb-1">
                  Collège de la Concorde · Département Techniques de la logistique
                </p>
                <h1 className="text-white text-2xl font-bold leading-tight">
                  {getCertTitle(cert.certType)}
                </h1>
                <p className="text-slate-300 text-sm mt-1">{getCertSubtitle(cert.certType)}</p>
              </div>
              <div className="text-right shrink-0 ml-6">
                <div className="bg-[#0078D7] text-white px-4 py-2 rounded-lg text-center">
                  <div className="text-xl font-black">TEC.LOG</div>
                  <div className="text-[10px] tracking-widest font-semibold text-blue-200">CERTIFICATION</div>
                </div>
              </div>
            </div>
          </div>

          {/* Gold accent line */}
          <div className="h-1 bg-gradient-to-r from-[#C9A227] via-[#E8C84A] to-[#C9A227]" />

          {/* Body */}
          <div className="px-8 py-7">

            {/* "Awarded to" */}
            <p className="text-slate-500 text-sm mb-1">Ce certificat est décerné à</p>
            <h2 className="text-[#0C3269] text-3xl font-black mb-5">{cert.studentName}</h2>

            {/* Score + Modules row */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-2 bg-[#f0f4f9] border border-slate-200 rounded-lg px-4 py-2">
                <div className="w-2 h-8 bg-[#0078D7] rounded-full" />
                <div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Score final</div>
                  <div className="text-[#0C3269] text-lg font-black">{cert.finalScore}<span className="text-sm font-normal text-slate-400">/100</span></div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-[#f0f4f9] border border-slate-200 rounded-lg px-4 py-2">
                <div className="w-2 h-8 bg-[#C9A227] rounded-full" />
                <div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Modules complétés</div>
                  <div className="text-[#0C3269] text-lg font-black">{getModulesLabel(cert.certType)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-[#f0f4f9] border border-slate-200 rounded-lg px-4 py-2">
                <div className="w-2 h-8 bg-emerald-500 rounded-full" />
                <div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Date d'émission</div>
                  <div className="text-[#0C3269] text-sm font-bold">{formatDate(cert.issuedAt)}</div>
                </div>
              </div>
            </div>

            {/* Competencies */}
            <div className="mb-6">
              <p className="text-[10px] text-[#0078D7] font-bold uppercase tracking-widest mb-2">Compétences validées</p>
              <div className="space-y-1.5">
                {cert.competencies.map((comp, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-[#C9A227] font-bold mt-0.5 shrink-0">✓</span>
                    <span>{comp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 my-5" />

            {/* Credential ID + Signature row */}
            <div className="flex flex-wrap gap-4 items-start justify-between">

              {/* Credential ID */}
              <div>
                <div className="bg-[#0C3269] text-white px-4 py-2 rounded-lg inline-block">
                  <div className="text-[9px] text-slate-300 font-semibold uppercase tracking-widest mb-0.5">Identifiant de certification</div>
                  <div className="text-sm font-mono font-bold">{cert.credentialId}</div>
                </div>
                <div className="mt-2 text-[11px] text-slate-400">
                  Statut : <span className="text-emerald-600 font-semibold">✓ Valide</span>
                </div>
              </div>

              {/* Signature block */}
              <div className="text-right">
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-5 py-3 inline-block text-left min-w-[200px]">
                  <div className="h-10 flex items-center justify-center border-b border-dashed border-slate-300 mb-2">
                    <span className="text-[10px] text-slate-400 italic">[NADIA_ALLAMI_SIGNATURE_IMAGE_PLACEHOLDER]</span>
                  </div>
                  <div className="text-[11px] font-bold text-[#0C3269]">Nadia Allami</div>
                  <div className="text-[10px] text-slate-500">Directrice</div>
                  <div className="text-[10px] text-slate-500">Collège de la Concorde</div>
                  <div className="text-[10px] text-slate-500">Département Techniques de la logistique</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="bg-[#f8f9fc] border-t border-slate-100 px-8 py-5">
            <div className="flex flex-wrap gap-3 justify-between items-center">

              {/* Primary actions */}
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleDownloadPDF}
                  disabled={pdfMutation.isPending}
                  className="bg-[#0C3269] hover:bg-[#0a2a55] text-white font-semibold px-5"
                >
                  {pdfMutation.isPending ? "Génération..." : "⬇ Télécharger le certificat PDF"}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleCopyLink}
                  className="border-[#0C3269] text-[#0C3269] hover:bg-[#0C3269] hover:text-white font-semibold"
                >
                  {copied ? "✓ Copié !" : "🔗 Copier le lien de vérification"}
                </Button>
              </div>

              {/* LinkedIn */}
              <a
                href={buildLinkedInUrl(cert)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Ajouter à LinkedIn
              </a>
            </div>

            {/* Verification URL */}
            <div className="mt-3 text-[11px] text-slate-400">
              Vérification publique : <a href={cert.verificationUrl} target="_blank" rel="noopener noreferrer" className="text-[#0078D7] hover:underline">{cert.verificationUrl}</a>
            </div>
          </div>
        </div>

        {/* LinkedIn helper section */}
        <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm px-6 py-5">
          <h3 className="text-[#0C3269] font-bold text-sm mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            Informations LinkedIn — Copier dans votre profil
          </h3>
          <div className="grid grid-cols-1 gap-2 text-xs">
            {[
              { label: "Organisation", value: "Collège de la Concorde" },
              { label: "Nom de la certification", value: getCertTitle(cert.certType) },
              { label: "Identifiant de certification", value: cert.credentialId },
              { label: "URL de certification", value: cert.verificationUrl },
              { label: "Date d'émission", value: formatDate(cert.issuedAt) },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-3 bg-slate-50 rounded-lg px-3 py-2">
                <span className="text-slate-500 w-44 shrink-0 font-medium">{label}</span>
                <span className="text-[#0C3269] font-mono text-[11px] flex-1 truncate">{value}</span>
                <button
                  onClick={() => { navigator.clipboard.writeText(value); toast.success(`${label} copié.`); }}
                  className="text-[#0078D7] hover:text-[#0C3269] text-[10px] font-semibold shrink-0"
                >
                  Copier
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Back button */}
        <div className="mt-5 text-center">
          <button
            onClick={() => navigate("/student/scenarios")}
            className="text-slate-500 hover:text-[#0C3269] text-sm underline"
          >
            ← Retour au tableau de bord
          </button>
        </div>
      </div>
    </div>
  );
}
