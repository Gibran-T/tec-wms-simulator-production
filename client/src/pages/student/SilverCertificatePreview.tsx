import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { ArrowLeft, Award } from "lucide-react";
import { trpc } from "@/lib/trpc";
import FioriShell from "@/components/FioriShell";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";

const ACHIEVEMENTS = [
  { fr: "SCN-001 — Cycle opérationnel complet", en: "SCN-001 — Complete Operational Cycle" },
  { fr: "SCN-002 — Résolution GR fantôme", en: "SCN-002 — Ghost GR Resolution" },
  { fr: "SCN-003 — Résolution pénurie stock", en: "SCN-003 — Stock Shortage Resolution" },
  { fr: "SCN-004 — Ajustement écart inventaire", en: "SCN-004 — Inventory Variance Adjustment" },
  { fr: "SCN-005 — Résolution conformité multi-erreurs", en: "SCN-005 — Multi-Error Compliance Resolution" },
  { fr: "Validation Quiz M1", en: "Quiz M1 Validation" },
];

const COMPETENCIES = [
  { fr: "Bons de commande (PO)", en: "Purchase Orders" },
  { fr: "Réception marchandises (GR)", en: "Goods Receipt" },
  { fr: "Rangement (Putaway)", en: "Putaway" },
  { fr: "Commandes client (SO)", en: "Sales Orders" },
  { fr: "Sortie marchandises (GI)", en: "Goods Issue" },
  { fr: "Contrôle inventaire", en: "Inventory Control" },
  { fr: "Conformité", en: "Compliance" },
  { fr: "Résolution de problèmes opérationnels", en: "Operational Problem Solving" },
];

export default function SilverCertificatePreview() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { data: silverStatus, isLoading } = trpc.profiles.silverStatus.useQuery();
  const { data: profile } = trpc.profiles.mine.useQuery();

  const studentName = profile?.displayName?.trim() || user?.name || t("Étudiant", "Student");

  if (isLoading) {
    return (
      <FioriShell>
        <div className="flex justify-center items-center h-64">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </FioriShell>
    );
  }

  if (!silverStatus?.silverCertified) {
    return (
      <FioriShell title={t("Certificat Silver", "Silver Certificate")}>
        <div className="max-w-lg mx-auto px-4 py-12 text-center space-y-4">
          <p className="text-muted-foreground">
            {t(
              "Certification Silver non encore débloquée. Complétez le parcours M1 pour accéder à l'aperçu.",
              "Silver certification not yet unlocked. Complete the M1 pathway to access the preview."
            )}
          </p>
          <Button variant="outline" onClick={() => navigate("/student/certifications")}>
            {t("Retour aux certifications", "Back to certifications")}
          </Button>
        </div>
      </FioriShell>
    );
  }

  return (
    <FioriShell
      title={t("Certificat Silver TEC.LOG", "TEC.LOG Silver Certificate")}
      breadcrumbs={[
        { label: t("Accueil", "Home"), href: "/" },
        { label: t("Certifications", "Certifications"), href: "/student/certifications" },
        { label: t("Certificat Silver", "Silver Certificate") },
      ]}
    >
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <button
          type="button"
          onClick={() => navigate("/student/certifications")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} />
          {t("Retour", "Back")}
        </button>

        <div className="border-2 border-slate-300 dark:border-slate-600 rounded-xl bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-8 md:p-12 shadow-lg print:shadow-none">
          <div className="text-center space-y-2 mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              {t("Collège de la Concorde", "Collège de la Concorde")}
            </p>
            <p className="text-sm font-semibold text-primary">{t("Programme TEC.LOG", "TEC.LOG Program")}</p>
            <p className="text-xs text-muted-foreground">
              {t("Operational Competency Credential", "Operational Competency Credential")}
            </p>
            <div className="flex justify-center pt-4">
              <Award className="w-12 h-12 text-slate-400" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-wide text-slate-700 dark:text-slate-200">
              {t("CERTIFICATION SILVER", "SILVER CERTIFICATION")}
            </h1>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {t("ERP/WMS Foundation Operations", "ERP/WMS Foundation Operations")}
            </p>
          </div>

          <div className="text-center border-y border-slate-200 dark:border-slate-700 py-6 mb-8">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
              {t("Décerné à", "Awarded to")}
            </p>
            <p className="text-xl md:text-2xl font-semibold text-foreground">{studentName}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                {t("Réalisations opérationnelles", "Operational Achievements")}
              </h2>
              <ul className="space-y-1.5 text-sm">
                {ACHIEVEMENTS.map((item) => (
                  <li key={item.en} className="flex items-start gap-2 text-foreground">
                    <span className="text-emerald-600 shrink-0">✓</span>
                    <span>{t(item.fr, item.en)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                {t("Compétences", "Competencies")}
              </h2>
              <ul className="space-y-1.5 text-sm">
                {COMPETENCIES.map((item) => (
                  <li key={item.en} className="flex items-start gap-2 text-foreground">
                    <span className="text-emerald-600 shrink-0">✓</span>
                    <span>{t(item.fr, item.en)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-xs text-center text-muted-foreground italic border-t border-slate-200 dark:border-slate-700 pt-6">
            {t(
              "Le certificat officiel signé par le Collège de la Concorde sera transmis ultérieurement par courriel.",
              "The official certificate signed by Collège de la Concorde will be sent later by email."
            )}
          </p>
        </div>

        <div className="flex justify-center print:hidden">
          <Button variant="outline" onClick={() => window.print()}>
            {t("Imprimer l'aperçu", "Print preview")}
          </Button>
        </div>
      </div>
    </FioriShell>
  );
}
