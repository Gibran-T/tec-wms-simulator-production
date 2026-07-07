import { AlertTriangle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import EnterpriseModuleHub from "@/components/enterprise/EnterpriseModuleHub";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MODULE_PROGRESSION_COPY } from "@/data/moduleProgressionCopy";

export default function Module3ScenarioList() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isAdminOrTeacher = user?.role === "admin" || user?.role === "teacher";
  const { data: moduleProgress } = trpc.warehouse.myProgress.useQuery();

  const module2Passed = isAdminOrTeacher || (moduleProgress ?? []).some(
    (mp) => mp.moduleId === 2 && mp.passed,
  );
  const showPrerequisiteNote = !module2Passed && !isAdminOrTeacher;
  const progression = MODULE_PROGRESSION_COPY[3];

  return (
    <EnterpriseModuleHub
      moduleId={3}
      showPromotionBanner={!showPrerequisiteNote}
      prerequisiteAlert={
        showPrerequisiteNote ? (
          <Alert className="border-amber-200 bg-amber-50 text-left">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>{language === "FR" ? "Prérequis recommandé" : "Recommended prerequisite"} :</strong>{" "}
              {language === "FR" ? progression.prerequisiteNote.fr : progression.prerequisiteNote.en}
            </AlertDescription>
          </Alert>
        ) : undefined
      }
    />
  );
}
