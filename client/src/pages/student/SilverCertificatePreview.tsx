import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import FioriShell from "@/components/FioriShell";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import SilverBadgeSvg from "@/components/certification/SilverBadgeSvg";
import { SilverStatusChip, resolveSilverState } from "@/components/certification/CertificationStatus";

const ACHIEVEMENTS = [
  { fr: "SCN-001 — Cycle opérationnel complet", en: "SCN-001 — Complete Operational Cycle" },
  { fr: "SCN-002 — Résolution GR fantôme", en: "SCN-002 — Ghost GR Resolution" },
  { fr: "SCN-003 — Résolution pénurie stock", en: "SCN-003 — Stock Shortage Resolution" },
  { fr: "SCN-004 — Ajustement écart inventaire", en: "SCN-004 — Inventory Variance Adjustment" },
  { fr: "SCN-005 — Résolution conformité multi-erreurs", en: "SCN-005 — Multi-Error Compliance Resolution" },
  { fr: "Validation Quiz M1 (≥ 60 %)", en: "Quiz M1 Validation (≥ 60%)" },
];

const COMPETENCIES = [
  { fr: "Bons de commande (PO)", en: "Purchase Orders" },
  { fr: "Réception marchandises (GR)", en: "Goods Receipt" },
  { fr: "Rangement (Putaway)", en: "Putaway" },
  { fr: "Commandes client (SO)", en: "Sales Orders" },
  { fr: "Sortie marchandises (GI)", en: "Goods Issue" },
  { fr: "Contrôle inventaire", en: "Inventory Control" },
  { fr: "Conformité opérationnelle", en: "Operational Compliance" },
  { fr: "Résolution de problèmes WMS", en: "WMS Problem Solving" },
];

export default function SilverCertificatePreview() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { data: silverStatus, isLoading } = trpc.profiles.silverStatus.useQuery();
  const { data: profile } = trpc.profiles.mine.useQuery();

  const studentName = profile?.displayName?.trim() || user?.name || t("Étudiant", "Student");
  const silverEarned = silverStatus?.silverCertified ?? false;
  const silverEligible = silverStatus?.silverEligible ?? false;
  const allRequirementsMet =
    (silverStatus?.quizPassed ?? false) &&
    (silverStatus?.complianceValidated ?? false) &&
    (silverStatus?.noBlockers ?? true) &&
    ["SCN001", "SCN002", "SCN003", "SCN004", "SCN005"].every((k) => silverStatus?.scenariosCompleted?.[k as keyof typeof silverStatus.scenariosCompleted]);
  const state = resolveSilverState({
    silverEarned,
    silverEligible,
    hasAnyProgress: true,
    allRequirementsMet: allRequirementsMet ?? false,
  });
  const isPreviewOnly = !silverEarned && (silverEligible || allRequirementsMet);

  if (isLoading) {
    return (
      <FioriShell>
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-2 border-[#0070f2] border-t-transparent rounded-full animate-spin" />
        </div>
      </FioriShell>
    );
  }

  if (!silverEarned && !silverEligible && !allRequirementsMet) {
    return (
      <FioriShell title={t("Certificat Silver", "Silver Certificate")}>
        <div className="max-w-lg mx-auto px-4 py-12 text-center space-y-4">
          <SilverBadgeSvg size={80} className="mx-auto opacity-40" />
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t(
              "Certification Silver non encore éligible. Complétez le parcours M1 pour accéder à l'aperçu pédagogique.",
              "Silver certification not yet eligible. Complete the M1 pathway to access the pedagogical preview.",
            )}
          </p>
          <Button variant="outline" onClick={() => navigate("/student/certifications")}>
            {t("Retour aux certifications", "Back to certifications")}
          </Button>
        </div>
      </FioriShell>
    );
  }

  const issueDate = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  return (
    <FioriShell
      title={t("Certificat Silver TEC.LOG", "TEC.LOG Silver Certificate")}
      breadcrumbs={[
        { label: t("Accueil", "Home"), href: "/" },
        { label: t("Certifications", "Certifications"), href: "/student/certifications" },
        { label: t("Certificat Silver", "Silver Certificate") },
      ]}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          type="button"
          onClick={() => navigate("/student/certifications")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} />
          {t("Retour aux certifications", "Back to certifications")}
        </button>

        {isPreviewOnly && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800 px-4 py-3 text-sm text-blue-900 dark:text-blue-100">
            {t(
              "Aperçu pédagogique — vous êtes éligible. Le certificat officiel signé sera émis par le Collège de la Concorde.",
              "Pedagogical preview — you are eligible. The official signed certificate will be issued by Collège de la Concorde.",
            )}
          </div>
        )}

        {/* Certificate document */}
        <div
          className={`relative border-2 rounded-xl bg-gradient-to-b from-white via-slate-50/80 to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 p-8 md:p-12 shadow-xl print:shadow-none ${
            isPreviewOnly ? "border-blue-300/60" : "border-slate-300 dark:border-slate-600"
          }`}
        >
          {isPreviewOnly && (
            <div className="absolute top-6 right-6 rotate-12 opacity-20 pointer-events-none select-none">
              <span className="text-4xl font-black uppercase tracking-widest text-blue-600 border-4 border-blue-600 px-4 py-2 rounded">
                {t("APERÇU", "PREVIEW")}
              </span>
            </div>
          )}

          {/* Ornamental border inner */}
          <div className="absolute inset-4 border border-slate-200 dark:border-slate-700 rounded-lg pointer-events-none" />

          <div className="relative text-center space-y-1 mb-8">
            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-medium">
              {t("Collège de la Concorde", "Collège de la Concorde")}
            </p>
            <p className="text-xs font-semibold text-[#0070f2]">{t("Programme TEC.LOG", "TEC.LOG Program")}</p>
            <p className="text-[10px] text-muted-foreground tracking-wide">
              {t("Operational Competency Credential · TEC.WMS", "Operational Competency Credential · TEC.WMS")}
            </p>
          </div>

          <div className="relative flex justify-center mb-6">
            <SilverBadgeSvg size={100} variant="full" />
          </div>

          <div className="relative text-center mb-8">
            <SilverStatusChip state={state} />
            <h1 className="text-2xl md:text-3xl font-bold tracking-wide text-slate-800 dark:text-slate-100 mt-4">
              {t("CERTIFICATION SILVER", "SILVER CERTIFICATION")}
            </h1>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
              {t("ERP/WMS Foundation Operations · Module 1", "ERP/WMS Foundation Operations · Module 1")}
            </p>
          </div>

          <div className="relative text-center border-y border-slate-200 dark:border-slate-700 py-6 mb-8 mx-4 md:mx-8">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
              {t("Décerné à", "Awarded to")}
            </p>
            <p className="text-2xl md:text-3xl font-semibold text-foreground font-serif">{studentName}</p>
            <p className="text-xs text-muted-foreground mt-2">{issueDate}</p>
          </div>

          <div className="relative grid md:grid-cols-2 gap-8 mb-8 px-2">
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3 border-b border-slate-200 dark:border-slate-700 pb-1">
                {t("Réalisations opérationnelles", "Operational Achievements")}
              </h2>
              <ul className="space-y-2 text-sm">
                {ACHIEVEMENTS.map((item) => (
                  <li key={item.en} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span className="text-foreground/90">{t(item.fr, item.en)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3 border-b border-slate-200 dark:border-slate-700 pb-1">
                {t("Compétences certifiées", "Certified Competencies")}
              </h2>
              <ul className="space-y-2 text-sm">
                {COMPETENCIES.map((item) => (
                  <li key={item.en} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span className="text-foreground/90">{t(item.fr, item.en)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative flex justify-between items-end px-4 md:px-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="text-left">
              <div className="w-32 h-px bg-slate-400 mb-1" />
              <p className="text-[10px] text-muted-foreground">{t("Directeur de programme", "Program Director")}</p>
              <p className="text-xs font-medium text-foreground">TEC.LOG · Collège de la Concorde</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground italic max-w-[200px]">
                {t("Credential numérique · QR · à venir", "Digital credential · QR · coming later")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-3 print:hidden">
          <Button variant="outline" onClick={() => window.print()}>
            {t("Imprimer l'aperçu", "Print preview")}
          </Button>
          <Button onClick={() => navigate("/student/certifications")} variant="secondary">
            {t("Mes certifications", "My certifications")}
          </Button>
        </div>
      </div>
    </FioriShell>
  );
}
