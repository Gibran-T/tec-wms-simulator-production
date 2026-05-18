/**
 * CertificationCenter.tsx
 * TEC.LOG Student Certification Center
 * Dark premium hub — shows Silver (M1) and Gold (M2–M5) status
 * Links to CertificationEarned and public CredentialVerify pages
 */

import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import FioriShell from "@/components/FioriShell";
import { useLanguage } from "@/contexts/LanguageContext";

type CertType = "m1_fundamentals" | "m2m5_integrated";

const CERT_DEFS = [
  {
    certType: "m1_fundamentals" as CertType,
    tier: "SILVER",
    name: "TEC.LOG Fundamentals Certification",
    subtitle: "Module 1 — Fondements ERP/WMS",
    tagline: "Foundational logistics systems competency",
    accentColor: "#94a3b8",
    accentGlow: "rgba(148,163,184,0.2)",
    tierBg: "rgba(148,163,184,0.12)",
    tierBorder: "rgba(148,163,184,0.3)",
    badgeGrad: "radial-gradient(circle at 35% 35%, #f1f5f9, #94a3b8 60%, #475569)",
    modules: "Module 1",
    requirement: "Compléter M1 et réussir le quiz",
  },
  {
    certType: "m2m5_integrated" as CertType,
    tier: "GOLD",
    name: "TEC.LOG Integrated Operations Certification",
    subtitle: "Modules 2–5 — Simulation opérationnelle intégrée",
    tagline: "Integrated ERP/WMS operational execution",
    accentColor: "#eab308",
    accentGlow: "rgba(234,179,8,0.2)",
    tierBg: "rgba(234,179,8,0.1)",
    tierBorder: "rgba(234,179,8,0.3)",
    badgeGrad: "radial-gradient(circle at 35% 35%, #fef9c3, #eab308 60%, #92400e)",
    modules: "Modules 2–5",
    requirement: "Compléter M2, M3, M4, M5 et réussir tous les quiz",
  },
];

function MiniTierBadge({ tier, badgeGrad, accentColor }: { tier: string; badgeGrad: string; accentColor: string }) {
  const badgeUrl = tier === "SILVER"
    ? "https://d2xsxph8kpxj0f.cloudfront.net/310419663029779635/nAhGw8XK59ZrVZBqWsfEzN/teclog-silver-badge-HMdxVYVmvxQKEB77KZ8vEC.webp"
    : "https://d2xsxph8kpxj0f.cloudfront.net/310419663029779635/nAhGw8XK59ZrVZBqWsfEzN/teclog-gold-badge-aaCuqFpweDoGUZoAS6gRrf.webp";
  return (
    <img
      src={badgeUrl}
      alt={`TEC.LOG ${tier} Badge`}
      className="w-14 h-14 rounded-full object-contain shrink-0"
      style={{
        filter: "drop-shadow(0 0 12px rgba(148,163,184,0.25))",
      }}
    />
  );
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("fr-CA", { year: "numeric", month: "long", day: "numeric" });
}

export default function CertificationCenter() {
  const [, navigate] = useLocation();
  const { t } = useLanguage();

  const { data: myCerts, isLoading } = trpc.certification.getMine.useQuery();

  const getCert = (certType: CertType) => myCerts?.find((c) => c.certType === certType);

  return (
    <FioriShell title={t("Centre de certifications", "Certification Center")}>
      <div
        className="min-h-screen px-4 py-8"
        style={{ background: "linear-gradient(135deg, #020817 0%, #0a0f1e 40%, #0d1a2e 100%)" }}
      >
         {/* Background grid */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            zIndex: 0,
          }}
        />
        {/* CC Institutional logo — top-right surgical insertion */}
        <div className="fixed top-16 right-5 z-20" style={{ opacity: 0.65 }}>
          <img
            src="/manus-storage/cc-logo-institutional_c26c3579.png"
            alt="Collège de la Concorde"
            className="h-7 object-contain"
            style={{ filter: "brightness(0) invert(1)", maxWidth: 120 }}
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <h1 className="text-white text-xl font-black">{t("Centre de certifications TEC.LOG", "TEC.LOG Certification Center")}</h1>
                <p className="text-slate-500 text-xs">{t("Collège de la Concorde · Département Techniques de la logistique", "Collège de la Concorde · Logistics Department")}</p>
              </div>
            </div>
            <div className="h-px w-full mt-4" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }} />
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-t-transparent border-slate-400 rounded-full animate-spin" />
            </div>
          )}

          {/* Certification cards */}
          {!isLoading && (
            <div className="space-y-4">
              {CERT_DEFS.map((def) => {
                const cert = getCert(def.certType);
                const earned = !!cert;
                const verificationUrl = cert ? `${window.location.origin}/verify/${cert.credentialId}` : null;

                return (
                  <div
                    key={def.certType}
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: "linear-gradient(145deg, #0f172a, #1e293b)",
                      border: `1px solid ${earned ? def.accentColor + "40" : "rgba(255,255,255,0.06)"}`,
                      boxShadow: earned ? `0 0 40px ${def.accentGlow}` : "none",
                    }}
                  >
                    {/* Top accent */}
                    <div
                      className="h-0.5"
                      style={{ background: earned ? `linear-gradient(90deg, transparent, ${def.accentColor}, transparent)` : "transparent" }}
                    />

                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Badge */}
                        <div className="relative">
                          <MiniTierBadge tier={def.tier} badgeGrad={def.badgeGrad} accentColor={def.accentColor} />
                          {!earned && (
                            <div className="absolute inset-0 rounded-full flex items-center justify-center" style={{ background: "rgba(2,8,23,0.7)" }}>
                              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span
                              className="text-[9px] font-bold tracking-[0.25em] uppercase"
                              style={{ color: def.accentColor }}
                            >
                              {def.tier} TIER
                            </span>
                            {earned ? (
                              <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10">
                                <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                                {t("OBTENU", "EARNED")}
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold text-slate-600 px-2 py-0.5 rounded-full border border-slate-700/50 bg-slate-800/50">
                                {t("NON OBTENU", "NOT EARNED")}
                              </span>
                            )}
                          </div>
                          <h2 className="text-white font-black text-base leading-tight mb-0.5">{def.name}</h2>
                          <p className="text-slate-400 text-xs mb-1">{def.subtitle}</p>
                          <p className="text-slate-600 text-[11px] italic">{def.tagline}</p>

                          {earned && cert ? (
                            <div className="mt-3 space-y-1">
                              <div className="flex items-center gap-2 text-xs text-slate-400">
                                <span className="text-slate-600">{t("Émis le :", "Issued:")}</span>
                                <span className="text-slate-200 font-medium">{formatDate(cert.issuedAt)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-slate-600">{t("ID :", "ID:")}</span>
                                <span className="font-mono text-slate-300 text-[11px]">{cert.credentialId}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-3 flex items-start gap-1.5 text-xs text-slate-600">
                              <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{def.requirement}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      {earned && (
                        <div className="flex flex-wrap gap-2 mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                          <button
                            onClick={() => navigate(`/student/certification/${def.certType}`)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs text-black transition-all hover:scale-105"
                            style={{ background: def.certType === "m1_fundamentals" ? "linear-gradient(135deg, #94a3b8, #e2e8f0)" : "linear-gradient(135deg, #eab308, #fde047)" }}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                            {t("Voir le certificat", "View Certificate")}
                          </button>
                          {verificationUrl && (
                            <button
                              onClick={() => navigate(`/verify/${cert!.credentialId}`)}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold text-xs transition-all hover:scale-105"
                              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                              {t("Vérifier", "Verify")}
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom accent */}
                    {earned && (
                      <div
                        className="h-0.5"
                        style={{ background: `linear-gradient(90deg, transparent, ${def.accentColor}50, transparent)` }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Info block */}
          <div
            className="mt-6 rounded-xl p-4"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <p className="text-slate-600 text-[11px] text-center">
              {t(
                "Les certifications TEC.LOG sont émises automatiquement à la complétion des modules requis. Chaque certification est vérifiable publiquement via un lien unique et un QR code.",
                "TEC.LOG certifications are issued automatically upon completion of required modules. Each certification is publicly verifiable via a unique link and QR code."
              )}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-4 text-center text-[10px] text-slate-700">
            Collège de la Concorde · Département Techniques de la logistique · TEC.LOG
          </div>
        </div>
      </div>
    </FioriShell>
  );
}
