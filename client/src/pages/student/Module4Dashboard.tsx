import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import EnterpriseModuleHub from "@/components/enterprise/EnterpriseModuleHub";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function Module4Dashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const isAdminOrTeacher = user?.role === "admin" || user?.role === "teacher";

  const { data: moduleProgress } = trpc.modules.progress.useQuery();
  const { isLoading, isError, isFetching, refetch } = trpc.scenarios.list.useQuery();

  const [loadTimedOut, setLoadTimedOut] = useState(false);
  useEffect(() => {
    if (!isLoading) {
      setLoadTimedOut(false);
      return;
    }
    const timer = window.setTimeout(() => setLoadTimedOut(true), 15000);
    return () => window.clearTimeout(timer);
  }, [isLoading]);

  const m3Progress = moduleProgress?.find((p) => p.moduleCode === "M3");
  const m4Blocked = !isAdminOrTeacher && (!m3Progress?.passed || !m3Progress?.teacherValidated);
  const awaitingTeacherValidation = !isAdminOrTeacher && m3Progress?.passed && !m3Progress?.teacherValidated;

  const prerequisiteAlert = m4Blocked ? (
    <Alert className="border-amber-200 bg-amber-50 text-left">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800 text-sm">
        {awaitingTeacherValidation
          ? t(
              "Affectation verrouillée — votre superviseur doit valider votre réussite au chapitre M3 (≥ 70/100) avant d'accéder à SCN-012 à SCN-014.",
              "Assignment locked — your supervisor must validate your chapter M3 completion (≥ 70/100) before accessing SCN-012 to SCN-014.",
            )
          : t(
              "Affectation verrouillée — complétez et réussissez le chapitre M3 (≥ 70/100) avant d'accéder à SCN-012 à SCN-014.",
              "Assignment locked — complete and pass chapter M3 (≥ 70/100) before accessing SCN-012 to SCN-014.",
            )}
      </AlertDescription>
    </Alert>
  ) : undefined;

  return (
    <EnterpriseModuleHub
      moduleId={4}
      showPromotionBanner={!m4Blocked}
      missionsBlocked={m4Blocked}
      prerequisiteAlert={prerequisiteAlert}
      loadError={isError}
      loadTimedOut={loadTimedOut && !isError}
      onRetryLoad={() => {
        setLoadTimedOut(false);
        void refetch();
      }}
      isRetrying={isFetching}
    />
  );
}
