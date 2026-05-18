/*
 * CertificationEarned.tsx
 * TEC.LOG Official Digital Certification System
 * Premium metallic badges (Silver/Gold) — Official TEC.LOG visual identity
 * NO score exposure — competency validation only
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
  const badgeUrl = tier === "SILVER"
    ? "https://d2xsxph8kpxj0f.cloudfront.net/310419663029779635/nAhGw8XK59ZrVZBqWsfEzN/teclog-silver-badge-HMdxVYVmvxQKEB77KZ8vEC.webp"
    : "https://d2xsxph8kpxj0f.cloudfront.net/310419663029779635/nAhGw8XK59ZrVZBqWsfEzN/teclog-gold-badge-aaCuqFpweDoGUZoAS6gRrf.webp";

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
      {/* Premium metallic badge image */}
      <img
        src={badgeUrl}
        alt={`TEC.LOG ${tier} Certification Badge`}
        className="relative z-10 w-full h-full rounded-full object-contain"
        style={{
          filter: "drop-shadow(0 0 20px rgba(148,163,184,0.4))",
        }}
      />
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

  const cert = myCerts?.[0];

  useEffect(() => {
    const timer1 = setTimeout(() => setBadgeVisible(true), 300);
    const timer2 = setTimeout(() => setContentVisible(true), 800);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleCopyLink = async () => {
    if (!cert) return;
    const verifyUrl = `${window.location.origin}/verify/${cert.credentialId}`;
    await navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Lien copié !");
  };

  const handleLinkedIn = () => {
    if (!cert) return;
    const verifyUrl = `${window.location.origin}/verify/${cert.credentialId}`;
    const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(config.name)}&organizationName=Coll%C3%A8ge%20de%20la%20Concorde&certUrl=${encodeURIComponent(verifyUrl)}`;
    window.open(linkedInUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="max-w-2xl w-full">
        {/* Badge section */}
        <div className="flex justify-center mb-12">
          <MetallicBadge
            tier={config.tier as "SILVER" | "GOLD"}
            accentColor={config.accentColor}
            accentGlow={config.accentGlow}
            animate={badgeVisible}
          />
        </div>

        {/* Content section */}
        <div
          className="transition-all duration-700"
          style={{
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          {/* Credential card */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm">
            {/* Tier label */}
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider mb-4 ${config.tierBg} ${config.tierText}`}>
              {config.tierLabel}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-black text-white mb-2">{config.name}</h1>
            <p className="text-slate-400 text-sm mb-6">{config.subtitle}</p>

            {/* Competencies */}
            <div className="space-y-3 mb-8">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Compétences validées</h3>
              {config.competencies.map((comp, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0`} style={{ background: config.accentColor }} />
                  <p className="text-sm text-slate-300">{comp}</p>
                </div>
              ))}
            </div>

            {/* Metadata */}
            {cert && (
              <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-slate-900/50 rounded-lg border border-slate-700/30">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Émis le</p>
                  <p className="text-sm font-semibold text-white">{new Date(cert.issuedAt).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Identifiant</p>
                  <p className="text-sm font-mono text-slate-300">{cert.credentialId}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => cert && pdfMutation.mutate({ credentialId: cert.credentialId })}
                disabled={pdfMutation.isPending || !cert}
                className="w-full py-3 px-4 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
              >
                {pdfMutation.isPending ? "Génération..." : "Télécharger le certificat"}
              </button>
              <button
                onClick={handleCopyLink}
                className="w-full py-3 px-4 bg-slate-700/50 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition-all border border-slate-600/50"
              >
                {copied ? "✓ Lien copié" : "🔗 Copier le lien de vérification"}
              </button>
              <button
                onClick={handleLinkedIn}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
              >
                Ajouter à LinkedIn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
