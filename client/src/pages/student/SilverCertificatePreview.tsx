import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import FioriShell from "@/components/FioriShell";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import SilverBadgeSvg from "@/components/certification/SilverBadgeSvg";
import { resolveSilverState } from "@/components/certification/CertificationStatus";
import SilverCertificateDocument from "@/components/certification/SilverCertificateDocument";
import { lookupSilverRegistryByStudentNumber } from "@shared/silverCertificationRegistry";

export default function SilverCertificatePreview() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { data: silverStatus, isLoading } = trpc.profiles.silverStatus.useQuery();
  const { data: profile } = trpc.profiles.mine.useQuery();

  const studentName = profile?.displayName?.trim() || user?.name || t("Étudiant", "Student");
  const registryEntry = lookupSilverRegistryByStudentNumber(profile?.studentNumber ?? null);
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
  const showCompletion = Boolean(allRequirementsMet || silverEarned);
  const certificateId = registryEntry?.certificateId ?? null;

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
      <div className="silver-certificate-page max-w-[1100px] mx-auto space-y-6 print:max-w-none print:mx-0">
        <button
          type="button"
          onClick={() => navigate("/student/certifications")}
          className="silver-certificate-no-print flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} />
          {t("Retour aux certifications", "Back to certifications")}
        </button>

        {isPreviewOnly && (
          <div className="silver-certificate-no-print rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800 px-4 py-3 text-sm text-blue-900 dark:text-blue-100">
            {t(
              "Aperçu pédagogique — vous êtes éligible. Le certificat officiel signé sera émis par le Collège de la Concorde.",
              "Pedagogical preview — you are eligible. The official signed certificate will be issued by Collège de la Concorde.",
            )}
          </div>
        )}

        <SilverCertificateDocument
          studentName={studentName}
          issueDate={issueDate}
          certificateId={certificateId}
          silverEarned={silverEarned}
          isPreviewOnly={isPreviewOnly}
          showCompletion={showCompletion}
          state={state}
        />

        <div className="silver-certificate-no-print flex justify-center gap-3">
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
