/**
 * CertificationEarned.tsx
 * TEC.LOG Next-Generation Digital Certification System
 * Dark premium enterprise UI — Silver (M1) / Gold (M2–M5) tiers
 * NO score exposure — competency validation only
 * Inspired by: Cisco Skills, Credly, IBM SkillsBuild, Vercel, Linear
 */

import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type CertType = "m1_fundamentals" | "m2m5_integrated";

const CERT_CONFIG = {
  m1_fundamentals: {
    tier: "SILVER" as const,
    tierLabel: "TEC.LOG SILVER CERTIFICATION",
    name: "TEC.LOG Fundamentals Certification",
    subtitle: "Module 1 — Fondements ERP/WMS",
    tagline: "Foundational logistics systems competency",
    modules: "Module 1",
    accentColor: "#94a3b8",
    accentGlow: "rgba(148,163,184,0.3)",
    tierBg: "bg-slate-500/20 border-slate-400/40",
    tierText: "text-slate-200",
    btnGradient: "linear-gradient(135deg, #94a3b8, #e2e8f0)",
    competencies: [
      "Comprendre le flux logistique complet : PO → GR → PUTAWAY → STOCK → SO → GI → CC → COMPLIANCE",
      "Distinguer les rôles du WMS et de l'ERP dans la gestion des stocks",
      "Pratiquer les scénarios guidés dans TEC.WMS (SCN-001 à SCN-005)",
      "Observer les données réelles dans Odoo EDU LAB",
    ],
  },
  m2m5_integrated: {
    tier: "GOLD" as const,
    tierLabel: "TEC.LOG GOLD CERTIFICATION",
    name: "TEC.LOG Integrated Operations Certification",
    subtitle: "Modules 2–5 — Simulation opérationnelle intégrée",
    tagline: "Integrated ERP/WMS operational execution",
    modules: "Modules 2–5",
    accentColor: "#eab308",
    accentGlow: "rgba(234,179,8,0.35)",
    tierBg: "bg-yellow-500/20 border-yellow-400/40",
    tierText: "text-yellow-200",
    btnGradient: "linear-gradient(135deg, #eab308, #fde047)",
    competencies: [
      "Exécuter les flux d'entrepôt : emplacements, putaway, transferts internes",
      "Appliquer les règles Min/Max et le réapprovisionnement automatique",
      "Analyser les KPIs opérationnels : OTIF, taux de service, rotation de stock",
      "Exécuter un flux intégré achats-production-livraison end-to-end",
      "Assurer la traçabilité complète et l'audit de conformité final",
    ],
  },
};

function MetallicBadge({ tier, accentColor, accentGlow, animate }: {
  tier: "SILVER" | "GOLD";
  accentColor: string;
  accentGlow: string;
  animate: boolean;
}) {
  const isSilver = tier === "SILVER";
  const outerGrad = isSilver
    ? "conic-gradient(from 0deg, #94a3b8, #e2e8f0, #94a3b8, #cbd5e1, #94a3b8)"
    : "conic-gradient(from 0deg, #ca8a04, #fef08a, #eab308, #fde047, #ca8a04)";
  const innerGrad = isSilver
    ? "radial-gradient(circle at 35% 35%, #f1f5f9, #94a3b8 60%, #475569)"
    : "radial-gradient(circle at 35% 35%, #fef9c3, #eab308 60%, #92400e)";

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: 160, height: 160,
        transition: "all 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
        transform: animate ? "scale(1)" : "scale(0.4)",
        opacity: animate ? 1 : 0,
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${accentGlow} 0%, transparent 70%)`,
          transform: "scale(1.4)",
          animation: animate ? "pulse 2s infinite" : "none",
        }}
      />
      {/* Rotating outer ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: outerGrad,
          padding: 3,
          animation: animate ? "spin 8s linear infinite" : "none",
        }}
      >
        <div className="w-full h-full rounded-full" style={{ background: "#0a0f1e" }} />
      </div>
      {/* Badge body */}
      <div
        className="relative z-10 flex flex-col items-center justify-center rounded-full"
        style={{
          width: 130, height: 130,
          background: innerGrad,
          boxShadow: `0 0 30px ${accentGlow}`,
        }}
      >
        <div className="text-[10px] font-black tracking-[0.3em] text-slate-900/70 mb-0.5">TEC.LOG</div>
        <div className="text-[22px] font-black text-slate-900/80 leading-none">{tier}</div>
        <div className="text-[8px] font-bold tracking-[0.2em] text-slate-900/60 mt-0.5">CERTIFICATION</div>
      </div>
    </div>
  );
}

export default function CertificationEarned() {
  const params = useParams<{ certType: string }>();
  const [, navigate] = useLocation();
  const certType = (params.certType || "m1_fundamentals") as CertType;
  const config = CERT_CONFIG[certType] ?? CERT_CONFIG.m1_fundamentals;

  const [badgeVisible, setBadgeVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [showLinkedIn, setShowLinkedIn] = useState(false);
  const [copied, setCopied] = useState(false);

  const utils = trpc.useUtils();
  const issueMutation = trpc.certification.issue.useMutation({
    onSuccess: () => utils.certification.getMine.invalidate(),
    onError: (err) => toast.error(err.message),
  });
  const { data: myCerts } = trpc.certification.getMine.useQuery();
  const pdfMutation = trpc.certification.generatePDF.useMutation({
    onSuccess: (data: { pdfBase64: string }) => {
      const bytes = Uint8Array.from(atob(data.pdfBase64), (c) => c.charCodeAt(0));
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `TEC.LOG-${config.tier}-${cert?.credentialId || "certificate"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Certificat téléchargé !");
    },
    onError: () => toast.error("Erreur lors de la génération du PDF."),
  });

  const cert = myCerts?.find((c) => c.certType === certType);

  useEffect(() => {
    const t1 = setTimeout(() => setBadgeVisible(true), 300);
    const t2 = setTimeout(() => setContentVisible(true), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (myCerts !== undefined && !cert) {
      issueMutation.mutate({ certType });
    }
  }, [myCerts]);

  const verificationUrl = cert ? `${window.location.origin}/verify/${cert.credentialId}` : "";
  const issuedAt = cert?.issuedAt ? new Date(cert.issuedAt) : new Date();
  const formatDate = (d: Date) => d.toLocaleDateString("fr-CA", { year: "numeric", month: "long", day: "numeric" });

  const copyLink = () => {
    if (!verificationUrl) return;
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    toast.success("Lien de vérification copié !");
    setTimeout(() => setCopied(false), 2000);
  };

  const linkedInUrl = cert
    ? `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(config.name)}&organizationName=${encodeURIComponent("Collège de la Concorde")}&issueYear=${issuedAt.getFullYear()}&issueMonth=${issuedAt.getMonth() + 1}&certId=${encodeURIComponent(cert.credentialId)}&certUrl=${encodeURIComponent(verificationUrl)}`
    : "#";

  // Loading state
  if (!cert && issueMutation.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #020817 0%, #0a0f1e 100%)" }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: `${config.accentColor} transparent transparent transparent` }} />
          <p className="font-medium text-sm" style={{ color: config.accentColor }}>Émission de votre certification...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start py-8 px-4 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #020817 0%, #0a0f1e 40%, #0d1a2e 100%)" }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Ambient top glow */}
      <div
        className="absolute top-0 left-1/2 pointer-events-none"
        style={{
          transform: "translateX(-50%)",
          width: 600, height: 300,
          background: `radial-gradient(ellipse, ${config.accentGlow} 0%, transparent 70%)`,
          opacity: 0.5,
          filter: "blur(40px)",
        }}
      />

      {/* Status pill */}
      <div
        className={`relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-full border mb-8 ${config.tierBg}`}
        style={{
          transition: "all 0.7s ease",
          opacity: contentVisible ? 1 : 0,
          transform: contentVisible ? "translateY(0)" : "translateY(-16px)",
        }}
      >
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: config.accentColor }} />
        <span className={`text-[11px] font-bold tracking-[0.25em] uppercase ${config.tierText}`}>
          CERTIFICATION OFFICIELLE ÉMISE
        </span>
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: config.accentColor }} />
      </div>

      {/* Main card */}
      <div
        className="relative z-10 w-full max-w-2xl"
        style={{
          background: "linear-gradient(145deg, #0f172a, #1e293b)",
          border: `1px solid ${config.accentColor}30`,
          borderRadius: 20,
          boxShadow: `0 0 60px ${config.accentGlow}, 0 25px 50px rgba(0,0,0,0.5)`,
          transition: "all 0.7s ease",
          opacity: contentVisible ? 1 : 0,
          transform: contentVisible ? "translateY(0)" : "translateY(32px)",
        }}
      >
        {/* Top accent line */}
        <div className="h-0.5 w-full rounded-t-[20px]" style={{ background: `linear-gradient(90deg, transparent, ${config.accentColor}, transparent)` }} />

        <div className="p-8">
          {/* Badge + title */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
            <MetallicBadge tier={config.tier} accentColor={config.accentColor} accentGlow={config.accentGlow} animate={badgeVisible} />
            <div className="text-center sm:text-left">
              <div className={`text-xs font-bold tracking-[0.3em] uppercase mb-2 ${config.tierText}`}>{config.tierLabel}</div>
              <h1 className="text-white text-2xl font-black leading-tight mb-1">{config.name}</h1>
              <p className="text-slate-400 text-sm">{config.subtitle}</p>
              <p className="text-slate-500 text-xs mt-1 italic">{config.tagline}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full mb-6" style={{ background: `linear-gradient(90deg, transparent, ${config.accentColor}40, transparent)` }} />

          {/* Student name */}
          <div className="mb-6">
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Ce certificat est décerné à</p>
            <h2 className="text-white text-3xl font-black">{cert?.studentName || "—"}</h2>
          </div>

          {/* Status pills — NO score */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 text-xs font-bold uppercase tracking-wider">COMPÉTENCE VALIDÉE</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-600/50 bg-slate-800/50">
              <span className="text-slate-400 text-xs">Modules :</span>
              <span className="text-white text-xs font-bold">{config.modules}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-600/50 bg-slate-800/50">
              <span className="text-slate-400 text-xs">Émis le :</span>
              <span className="text-white text-xs font-bold">{formatDate(issuedAt)}</span>
            </div>
          </div>

          {/* Competencies */}
          <div className="mb-6">
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: config.accentColor }}>Compétences validées</p>
            <div className="space-y-2">
              {config.competencies.map((comp, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="mt-1 w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: `${config.accentColor}20`, border: `1px solid ${config.accentColor}50` }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: config.accentColor }} />
                  </div>
                  <span className="text-slate-300 text-sm leading-relaxed">{comp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full mb-6" style={{ background: `linear-gradient(90deg, transparent, ${config.accentColor}30, transparent)` }} />

          {/* Credential + Signature row */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 rounded-xl p-4" style={{ background: "rgba(0,0,0,0.4)", border: `1px solid ${config.accentColor}25` }}>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">Identifiant de certification</p>
              <p className="text-white font-mono font-bold text-sm mb-2">{cert?.credentialId || "—"}</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-emerald-300 text-xs font-bold">VALIDE</span>
              </div>
            </div>
            <div className="flex-1 rounded-xl p-4" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="h-10 flex items-center justify-center mb-2 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.12)" }}>
                <span className="text-slate-600 text-xs italic">[Signature officielle — à venir]</span>
              </div>
              <div className="h-px w-full mb-2" style={{ background: "rgba(255,255,255,0.08)" }} />
              <p className="text-white text-xs font-bold">Nadia Allami</p>
              <p className="text-slate-500 text-[10px]">Directrice · Collège de la Concorde</p>
              <p className="text-slate-600 text-[10px]">Département Techniques de la logistique</p>
            </div>
          </div>

          {/* Verification URL */}
          {verificationUrl && (
            <div className="mb-6 px-3 py-2 rounded-lg" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Lien de vérification publique</p>
              <a href={verificationUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-mono break-all hover:underline" style={{ color: config.accentColor }}>
                {verificationUrl}
              </a>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mb-5">
            <button
              onClick={() => cert && pdfMutation.mutate({ credentialId: cert.credentialId })}
              disabled={pdfMutation.isPending || !cert}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm text-black transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              style={{ background: config.btnGradient }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              {pdfMutation.isPending ? "Génération..." : "Télécharger le certificat PDF"}
            </button>
            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all hover:scale-105 active:scale-95"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: copied ? "#4ade80" : "#94a3b8" }}
            >
              {copied ? "✓ Copié !" : "🔗 Copier le lien"}
            </button>
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm text-white transition-all hover:scale-105 active:scale-95"
              style={{ background: "#0A66C2", border: "1px solid #1a76d2" }}
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Ajouter à LinkedIn
            </a>
          </div>

          {/* LinkedIn helper accordion */}
          <button
            onClick={() => setShowLinkedIn(!showLinkedIn)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-400 transition-colors hover:bg-white/5"
            style={{ border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              Informations LinkedIn — copier dans votre profil
            </span>
            <span className="text-slate-600">{showLinkedIn ? "▲" : "▼"}</span>
          </button>

          {showLinkedIn && (
            <div className="mt-2 rounded-lg overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              {[
                { label: "Organisation", value: "Collège de la Concorde" },
                { label: "Nom de la certification", value: config.name },
                { label: "Identifiant", value: cert?.credentialId || "" },
                { label: "URL de vérification", value: verificationUrl },
                { label: "Date d'émission", value: formatDate(issuedAt) },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider">{label}</p>
                    <p className="text-slate-200 text-xs font-medium break-all">{value}</p>
                  </div>
                  <button
                    onClick={() => { navigator.clipboard.writeText(value); toast.success("Copié !"); }}
                    className="ml-3 shrink-0 text-[10px] font-bold px-2 py-1 rounded text-slate-400 hover:text-white transition-colors"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    Copier
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom accent line */}
        <div className="h-0.5 w-full rounded-b-[20px]" style={{ background: `linear-gradient(90deg, transparent, ${config.accentColor}50, transparent)` }} />
      </div>

      {/* Back + footer */}
      <button
        onClick={() => navigate("/student/dashboard")}
        className="relative z-10 mt-6 text-slate-500 hover:text-slate-300 text-sm transition-colors"
        style={{ opacity: contentVisible ? 1 : 0, transition: "opacity 0.7s ease" }}
      >
        ← Retour au tableau de bord
      </button>
      <div className="relative z-10 mt-3 text-center text-[10px] text-slate-700" style={{ opacity: contentVisible ? 1 : 0, transition: "opacity 0.7s ease" }}>
        Collège de la Concorde · Département Techniques de la logistique · TEC.LOG
      </div>
    </div>
  );
}
