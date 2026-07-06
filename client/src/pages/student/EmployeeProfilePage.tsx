import { useLocation } from "wouter";
import { useEffect } from "react";
import FioriShell from "@/components/FioriShell";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { isConcordeConnectEnabled } from "@/lib/concordeConnect";
import { useEmployeeProfile } from "@/hooks/useEmployeeProfile";
import EmployeeProfileHeader from "@/components/enterprise/EmployeeProfileHeader";
import EmployeeIdentityCard from "@/components/enterprise/EmployeeIdentityCard";
import EmployeeOrgStrip from "@/components/enterprise/EmployeeOrgStrip";
import CareerChapterPanel from "@/components/enterprise/CareerChapterPanel";
import CompetencyGrid from "@/components/enterprise/CompetencyGrid";
import CompletedMissionsList from "@/components/enterprise/CompletedMissionsList";
import CurrentAssignmentCard from "@/components/enterprise/CurrentAssignmentCard";
import { FileText } from "lucide-react";

export default function EmployeeProfilePage() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const connectEnabled = isConcordeConnectEnabled();
  const { data: profile, isLoading, error } = useEmployeeProfile();

  useEffect(() => {
    if (!connectEnabled) {
      navigate("/student/scenarios", { replace: true });
    }
  }, [connectEnabled, navigate]);

  if (!connectEnabled) return null;

  const lang = language === "FR" ? "FR" : "EN";

  return (
    <FioriShell
      title={t("Profil professionnel", "Professional profile")}
      breadcrumbs={[
        { label: t("Concorde Connect", "Concorde Connect"), href: "/student/scenarios" },
        { label: t("Profil professionnel", "Professional profile") },
      ]}
    >
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="p-6 text-center text-sm text-red-600">
          {t("Impossible de charger le profil employé.", "Unable to load employee profile.")}
        </div>
      )}

      {profile && (
        <div className="max-w-5xl mx-auto space-y-6 pb-8">
          <EmployeeProfileHeader profile={profile} language={lang} t={t} />

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <EmployeeIdentityCard profile={profile} language={lang} t={t} />
              <EmployeeOrgStrip profile={profile} language={lang} t={t} />
              <CareerChapterPanel profile={profile} language={lang} t={t} />

              <div className="tec-briefing-panel p-5">
                <div className="flex items-center gap-2 mb-3">
                  <FileText size={14} className="text-slate-400" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {t("Résumé professionnel", "Professional summary")}
                  </p>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {lang === "FR" ? profile.professionalSummary.fr : profile.professionalSummary.en}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <CurrentAssignmentCard
                assignment={profile.currentAssignment}
                language={lang}
                t={t}
              />
              <CompletedMissionsList
                missions={profile.completedMissions}
                language={lang}
                t={t}
              />
              <CompetencyGrid
                competencies={profile.competencies}
                language={lang}
                t={t}
              />
            </div>
          </div>

          {user?.role === "student" && (
            <p className="text-[10px] text-center text-slate-400 italic px-4">
              {t(
                "Profil dérivé de la progression TEC.LOG — aucune donnée persistée supplémentaire.",
                "Profile derived from TEC.LOG progression — no additional persisted data."
              )}
            </p>
          )}
        </div>
      )}
    </FioriShell>
  );
}
