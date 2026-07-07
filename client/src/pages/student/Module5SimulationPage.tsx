import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import EnterpriseModuleHub from "@/components/enterprise/EnterpriseModuleHub";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { MODULE_PROGRESSION_COPY } from "@/data/moduleProgressionCopy";

export default function Module5SimulationPage() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isAdminOrTeacher = user?.role === "admin" || user?.role === "teacher";

  const { data: moduleProgress } = trpc.modules.progress.useQuery();
  const m4Progress = moduleProgress?.find((p) => p.moduleCode === "M4");
  const showPrerequisiteNote = !isAdminOrTeacher && !m4Progress?.passed;
  const progression = MODULE_PROGRESSION_COPY[5];

  return (
    <EnterpriseModuleHub
      moduleId={5}
      showPromotionBanner={!showPrerequisiteNote}
      prerequisiteAlert={
        showPrerequisiteNote ? (
          <Alert className="border-amber-200 bg-amber-50 text-left">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 text-sm">
              {language === "FR" ? progression.prerequisiteNote.fr : progression.prerequisiteNote.en}
            </AlertDescription>
          </Alert>
        ) : undefined
      }
    />
  );
}
