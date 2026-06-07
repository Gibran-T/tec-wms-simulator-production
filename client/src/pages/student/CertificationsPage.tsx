import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { Award, ArrowLeft, CheckCircle, Lock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import FioriShell from "@/components/FioriShell";
import TecLogJourneyStrip from "@/components/TecLogJourneyStrip";
import { SilverMedal, GoldMedal } from "@/components/CertificationMedal";

export function CertificationsPage() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const { isLoading } = trpc.auth.me.useQuery();

  if (isLoading) {
    return (
      <FioriShell>
        <div className="flex justify-center items-center h-64">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </FioriShell>
    );
  }

  const { data: profile } = trpc.profiles.mine.useQuery();

  const certifications = [
    {
      id: "silver",
      tier: "Silver",
      titleFr: "TEC.LOG Silver Certification — Fundamentals",
      titleEn: "TEC.LOG Silver Certification — Fundamentals",
      scopeFr: "M1 · SCN-001 → SCN-005",
      scopeEn: "M1 · SCN-001 → SCN-005",
      descriptionFr: "Maîtrise des processus fondamentaux ERP/WMS (Module 1)",
      descriptionEn: "Mastery of fundamental ERP/WMS processes (Module 1)",
      unlocked: profile?.silverCertified ?? false,
      Medal: SilverMedal,
    },
    {
      id: "gold",
      tier: "Gold",
      titleFr: "TEC.LOG Gold Certification — Integrated Operations",
      titleEn: "TEC.LOG Gold Certification — Integrated Operations",
      scopeFr: "M1 → M5 · SCN-001 → SCN-017",
      scopeEn: "M1 → M5 · SCN-001 → SCN-017",
      descriptionFr: "Expertise complète en opérations intégrées (Modules 1 à 5)",
      descriptionEn: "Complete integrated operations expertise (Modules 1–5)",
      unlocked: profile?.goldCertified ?? false,
      Medal: GoldMedal,
    },
  ];

  return (
    <FioriShell>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => navigate("/student/scenarios")}
            className="p-2 hover:bg-muted rounded-md transition-colors"
          >
            <ArrowLeft size={20} className="text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t("Mes Certifications", "My Certifications")}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t("Collège de la Concorde — TEC.WMS", "Collège de la Concorde — TEC.WMS")}
            </p>
          </div>
        </div>

        <TecLogJourneyStrip activeStep="certification" className="mb-6" />

        <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-[#0f2a44] to-[#1a3f6f] text-white">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50 mb-1">
            {t("Autorité de certification", "Certification authority")}
          </p>
          <p className="text-sm font-bold">
            {t(
              "CREDENTIAL OFFICIEL — COLLÈGE DE LA CONCORDE",
              "OFFICIAL CREDENTIAL — COLLÈGE DE LA CONCORDE"
            )}
          </p>
          <p className="text-xs text-white/70 mt-1">
            {t("Programme TEC.LOG — Gestion intégrée des stocks", "TEC.LOG Program — Integrated stock management")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certifications.map((cert) => {
            const Medal = cert.Medal;
            return (
              <div
                key={cert.id}
                className={`relative border rounded-xl overflow-hidden transition-all ${
                  cert.unlocked
                    ? "border-[#0070f2]/40 bg-gradient-to-br from-[#0f2a44]/5 to-[#1a3f6f]/10"
                    : "border-border bg-card"
                }`}
              >
                {cert.unlocked && (
                  <div className="absolute top-0 right-0 bg-[#0070f2] text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
                    {t("OBTENU", "EARNED")}
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={cert.unlocked ? "" : "opacity-40 grayscale"}>
                      <Medal size={72} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-foreground">
                        {cert.tier} {t("Certification", "Certification")}
                      </h3>
                      <p className="text-xs font-semibold text-[#0070f2] mt-0.5">
                        {t(cert.titleFr, cert.titleEn)}
                      </p>
                      <p className="text-[10px] font-mono text-muted-foreground mt-2">
                        {t(cert.scopeFr, cert.scopeEn)}
                      </p>
                    </div>
                    {cert.unlocked ? (
                      <CheckCircle size={22} className="text-emerald-500 shrink-0" />
                    ) : (
                      <Lock size={22} className="text-muted-foreground shrink-0" />
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {t(cert.descriptionFr, cert.descriptionEn)}
                  </p>

                  <div className="pt-4 border-t border-border">
                    {cert.unlocked ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-emerald-500" />
                        <span className="text-sm font-medium text-emerald-600">
                          {t("Certification obtenue", "Certification earned")}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Lock size={16} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {cert.id === "silver"
                            ? t("Complétez M1 (SCN-001→005) pour débloquer", "Complete M1 (SCN-001→005) to unlock")
                            : t("Complétez M1→M5 (SCN-001→017) pour débloquer", "Complete M1→M5 (SCN-001→017) to unlock")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-[#0f2a44]/5 border border-[#1a3f6f]/20 rounded-lg p-4">
          <div className="flex gap-3">
            <Award size={20} className="text-[#0070f2] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#0f2a44] mb-1">
                {t("Parcours certification", "Certification pathway")}
              </p>
              <p className="text-sm text-gray-600">
                {t(
                  "Silver : fondations M1 · Gold : opérations intégrées M1–M5. Les certifications sont délivrées par le Collège de la Concorde après validation complète en mode évaluation.",
                  "Silver: M1 foundations · Gold: M1–M5 integrated operations. Certifications are issued by Collège de la Concorde after full evaluation-mode validation."
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </FioriShell>
  );
}
