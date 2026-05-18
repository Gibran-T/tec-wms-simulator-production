/**
 * CredentialVerify.tsx
 * TEC.LOG Next-Generation Public Credential Verification
 * Dark premium enterprise UI — Silver/Gold tier rendering
 * Real QR code served from backend — no placeholder
 * Mobile responsive — no login required
 */

import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { toast } from "sonner";

type CertType = "m1_fundamentals" | "m2m5_integrated";

const TIER_CONFIG = {
  m1_fundamentals: {
    tier: "SILVER",
    tierLabel: "TEC.LOG SILVER CERTIFICATION",
    name: "TEC.LOG Fundamentals Certification",
    subtitle: "Module 1 — Fondements ERP/WMS",
    accentColor: "#94a3b8",
    accentGlow: "rgba(148,163,184,0.25)",
    tierBg: "bg-slate-500/20 border-slate-400/40",
    tierText: "text-slate-200",
    badgeGrad: "radial-gradient(circle at 35% 35%, #f1f5f9, #94a3b8 60%, #475569)",
  },
  m2m5_integrated: {
    tier: "GOLD",
    tierLabel: "TEC.LOG GOLD CERTIFICATION",
    name: "TEC.LOG Integrated Operations Certification",
    subtitle: "Modules 2–5 — Simulation opérationnelle intégrée",
    accentColor: "#eab308",
    accentGlow: "rgba(234,179,8,0.25)",
    tierBg: "bg-yellow-500/20 border-yellow-400/40",
    tierText: "text-yellow-200",
    badgeGrad: "radial-gradient(circle at 35% 35%, #fef9c3, #eab308 60%, #92400e)",
  },
};

function MiniMetallicBadge({ certType }: { certType: CertType }) {
  const cfg = TIER_CONFIG[certType] ?? TIER_CONFIG.m1_fundamentals;
  const badgeUrl = certType === "m1_fundamentals"
    ? "https://d2xsxph8kpxj0f.cloudfront.net/310419663029779635/nAhGw8XK59ZrVZBqWsfEzN/teclog-silver-badge-HMdxVYVmvxQKEB77KZ8vEC.webp"
    : "https://d2xsxph8kpxj0f.cloudfront.net/310419663029779635/nAhGw8XK59ZrVZBqWsfEzN/teclog-gold-badge-aaCuqFpweDoGUZoAS6gRrf.webp";
  return (
    <img
      src={badgeUrl}
      alt={`TEC.LOG ${cfg.tier} Badge`}
      className="w-20 h-20 rounded-full object-contain shrink-0"
      style={{
        filter: "drop-shadow(0 0 15px rgba(148,163,184,0.3))",
      }}
    />
  );
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("fr-CA", { year: "numeric", month: "long", day: "numeric" });
}

export default function CredentialVerify() {
  const params = useParams<{ credentialId: string }>();
  const credentialId = params.credentialId || "";
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!credentialId) return;
    const title = "TEC.LOG Digital Credential";
    const desc = "Verified digital credential issued by Collège de la Concorde";
    const img = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029779635/nAhGw8XK59ZrVZBqWsfEzN/linkedin-preview-teclog-certification-bUttroqSpBP2Qteoac28iG.png";
    document.title = title;
    const addMeta = (prop: string, content: string) => {
      const m = document.createElement("meta");
      if (prop.startsWith("twitter:")) m.setAttribute("name", prop);
      else m.setAttribute("property", prop);
      m.setAttribute("content", content);
      document.head.appendChild(m);
    };
    addMeta("og:title", title);
    addMeta("og:description", desc);
    addMeta("og:image", img);
    addMeta("og:url", window.location.href);
    addMeta("og:type", "website");
    addMeta("twitter:card", "summary_large_image");
    addMeta("twitter:title", title);
    addMeta("twitter:description", desc);
    addMeta("twitter:image", img);
  }, [credentialId]);

  const { data: cert, isLoading } = trpc.certification.getByCredentialId.useQuery(
    { credentialId },
    { enabled: !!credentialId }
  );

  // Get QR code from server (real QR, not placeholder)
  const { data: qrData } = trpc.certification.getQRCode.useQuery(
    { credentialId },
    { enabled: !!credentialId && !!cert }
  );

  const cfg = cert ? (TIER_CONFIG[cert.certType as CertType] ?? TIER_CONFIG.m1_fundamentals) : null;

  const verificationUrl = cert ? `${window.location.origin}/verify/${credentialId}` : "";

  const copyLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    toast.success("Lien copié !");
    setTimeout(() => setCopied(false), 2000);
  };

  const linkedInUrl = cert && cfg
    ? `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(cfg.name)}&organizationName=${encodeURIComponent("Collège de la Concorde")}&issueYear=${new Date(cert.issuedAt).getFullYear()}&issueMonth=${new Date(cert.issuedAt).getMonth() + 1}&certId=${encodeURIComponent(credentialId)}&certUrl=${encodeURIComponent(verificationUrl)}`
    : "#";

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #020817 0%, #0a0f1e 100%)" }}>
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-t-transparent border-slate-400 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Vérification en cours...</p>
        </div>
      </div>
    );
  }

  // Not found
  if (!cert || !cfg) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #020817 0%, #0a0f1e 100%)" }}>
        <div className="w-full max-w-md text-center">
          <div
            className="rounded-2xl p-8 mb-4"
            style={{ background: "linear-gradient(145deg, #0f172a, #1e293b)", border: "1px solid rgba(239,68,68,0.3)", boxShadow: "0 0 40px rgba(239,68,68,0.1)" }}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}>
              <span className="text-red-400 text-2xl font-black">✗</span>
            </div>
            <h1 className="text-white text-xl font-black mb-2">Certification introuvable</h1>
            <p className="text-slate-400 text-sm mb-4">
              L'identifiant <code className="bg-slate-800 px-1.5 py-0.5 rounded text-xs text-slate-300">{credentialId}</code> ne correspond à aucune certification valide.
            </p>
            <div className="text-[10px] text-slate-600">
              Collège de la Concorde · Département Techniques de la logistique · TEC.LOG
            </div>
          </div>
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

      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 pointer-events-none"
        style={{ transform: "translateX(-50%)", width: 600, height: 300, background: `radial-gradient(ellipse, ${cfg.accentGlow} 0%, transparent 70%)`, opacity: 0.6, filter: "blur(40px)" }}
      />

      <div className="relative z-10 w-full max-w-2xl">

        {/* Verification status banner */}
        <div
          className={`flex items-center gap-3 px-5 py-3 rounded-xl mb-5 ${cert.isValid ? "border border-emerald-500/30 bg-emerald-500/10" : "border border-red-500/30 bg-red-500/10"}`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${cert.isValid ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>
            {cert.isValid ? "✓" : "✗"}
          </div>
          <div>
            <div className={`font-bold text-sm ${cert.isValid ? "text-emerald-300" : "text-red-300"}`}>
              {cert.isValid ? "Certification vérifiée et valide" : "Certification révoquée ou invalide"}
            </div>
            <div className="text-xs text-slate-500">
              Vérification cryptographique automatique · Collège de la Concorde · TEC.LOG
            </div>
          </div>
        </div>

        {/* Main credential card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #0f172a, #1e293b)",
            border: `1px solid ${cfg.accentColor}30`,
            boxShadow: `0 0 60px ${cfg.accentGlow}, 0 25px 50px rgba(0,0,0,0.5)`,
          }}
        >
          {/* Top accent */}
          <div className="h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${cfg.accentColor}, transparent)` }} />

          {/* Institutional header with CC logo */}
          <div className="px-6 py-3 flex items-center gap-2" style={{ background: "rgba(0,0,0,0.5)", borderBottom: `1px solid ${cfg.accentColor}20` }}>
            <img
              src="/manus-storage/cc-logo-institutional_c26c3579.png"
              alt="Collège de la Concorde"
              className="h-5 object-contain"
              style={{ filter: "brightness(0) invert(1)", opacity: 0.8 }}
            />
            <div className="text-[9px] font-medium text-slate-500 uppercase tracking-wider">Official credential issued by Collège de la Concorde</div>
          </div>

          {/* Header */}
          <div className="px-6 py-5" style={{ background: "rgba(0,0,0,0.3)", borderBottom: `1px solid ${cfg.accentColor}15` }}>
            <div className="flex items-start gap-4">
              <MiniMetallicBadge certType={cert.certType as CertType} />
              <div className="flex-1 min-w-0">
                <p className={`text-[10px] font-bold tracking-[0.25em] uppercase mb-1 ${cfg.tierText}`}>
                  {cfg.tierLabel}
                </p>
                <h1 className="text-white text-xl font-black leading-tight">{cfg.name}</h1>
                <p className="text-slate-400 text-sm mt-0.5">{cfg.subtitle}</p>
              </div>
              <div
                className="shrink-0 px-3 py-2 rounded-lg text-center"
                style={{ background: "rgba(0,120,215,0.2)", border: "1px solid rgba(0,120,215,0.4)" }}
              >
                <div className="text-white text-sm font-black">TEC.LOG</div>
                <div className="text-blue-300 text-[8px] tracking-widest font-semibold">CERTIFICATION</div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            {/* Student name */}
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Ce certificat a été décerné à</p>
            <h2 className="text-white text-2xl font-black mb-5">{cert.studentName}</h2>

            {/* Status pills — NO score */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-300 text-xs font-bold uppercase tracking-wider">COMPÉTENCE VALIDÉE</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-600/50 bg-slate-800/50">
                <span className="text-slate-400 text-xs">Émis le :</span>
                <span className="text-white text-xs font-bold">{formatDate(cert.issuedAt)}</span>
              </div>
            </div>

            {/* Competencies */}
            <div className="mb-6">
              <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: cfg.accentColor }}>Compétences validées</p>
              <div className="space-y-2">
                {(cert.competencies as string[]).map((comp, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="mt-1 w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0" style={{ background: `${cfg.accentColor}20`, border: `1px solid ${cfg.accentColor}50` }}>
                      <div className="w-1 h-1 rounded-full" style={{ background: cfg.accentColor }} />
                    </div>
                    <span className="text-slate-300 text-sm leading-relaxed">{comp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full mb-5" style={{ background: `linear-gradient(90deg, transparent, ${cfg.accentColor}30, transparent)` }} />

            {/* Credential ID + QR row */}
            <div className="flex flex-wrap gap-4 items-start justify-between mb-5">
              <div>
                <div className="rounded-xl px-4 py-3 mb-2 inline-block" style={{ background: "rgba(0,0,0,0.5)", border: `1px solid ${cfg.accentColor}30` }}>
                  <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1">Identifiant de certification</p>
                  <p className="text-white font-mono font-bold text-sm">{cert.credentialId}</p>
                </div>
                <div className="text-[10px] text-slate-600">
                  Hash : <span className="font-mono text-slate-500">{cert.verificationHash.substring(0, 20)}...</span>
                </div>
                <div className="mt-1 text-[10px] text-slate-600">
                  URL : <a href={verificationUrl} className="hover:underline" style={{ color: cfg.accentColor }}>{verificationUrl}</a>
                </div>
              </div>
              {/* Real QR code */}
              <div className="text-center">
                {qrData?.qrCodeDataUrl ? (
                  <img
                    src={qrData.qrCodeDataUrl}
                    alt="QR Code de vérification"
                    className="rounded-lg"
                    style={{ width: 90, height: 90, imageRendering: "pixelated" }}
                  />
                ) : (
                  <div className="w-[90px] h-[90px] rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <div className="w-5 h-5 border-2 border-t-transparent border-slate-400 rounded-full animate-spin" />
                  </div>
                )}
                <div className="text-[9px] text-slate-600 mt-1">Scanner pour vérifier</div>
              </div>
            </div>

            {/* Signature block */}
            <div className="rounded-xl p-4 mb-5" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <div className="h-8 flex items-center mb-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)" }}>
                    <span className="text-slate-700 text-xs italic px-2">[Signature officielle — à venir]</span>
                  </div>
                  <div className="h-px w-full mb-1.5" style={{ background: "rgba(255,255,255,0.08)" }} />
                  <p className="text-white text-xs font-bold">Nadia Allami</p>
                  <p className="text-slate-500 text-[10px]">Directrice · Collège de la Concorde</p>
                  <p className="text-slate-600 text-[10px]">Département Techniques de la logistique</p>
                </div>
                <div className="text-right text-[9px] text-slate-600">
                  <p>Émis le {formatDate(cert.issuedAt)}</p>
                  <p className="mt-0.5">Autorité de vérification : TEC.LOG</p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs text-white transition-all hover:scale-105"
                style={{ background: "#0A66C2", border: "1px solid #1a76d2" }}
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                Ajouter à LinkedIn
              </a>
              <button
                onClick={copyLink}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs transition-all hover:scale-105"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: copied ? "#4ade80" : "#94a3b8" }}
              >
                {copied ? "✓ Copié !" : "🔗 Copier le lien"}
              </button>
            </div>
          </div>

          {/* Bottom accent */}
          <div className="h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${cfg.accentColor}50, transparent)` }} />
        </div>

        {/* Institutional footer */}
        <div className="mt-5 text-center text-[10px] text-slate-700">
          <p>Collège de la Concorde · 570 rue Saint-Vallier Ouest, Québec, G1K 1K1</p>
          <p>Département Techniques de la logistique · TEC.LOG · <a href="https://www.collegelaconcorde.com" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "#475569" }}>www.collegelaconcorde.com</a></p>
        </div>
      </div>
    </div>
  );
}
