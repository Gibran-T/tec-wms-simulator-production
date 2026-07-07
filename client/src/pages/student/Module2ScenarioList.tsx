import { AlertTriangle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import EnterpriseModuleHub from "@/components/enterprise/EnterpriseModuleHub";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MODULE_PROGRESSION_COPY } from "@/data/moduleProgressionCopy";

export default function Module2ScenarioList() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isAdminOrTeacher = user?.role === "admin" || user?.role === "teacher";
  const { data: access, isLoading: accessLoading } = trpc.warehouse.checkAccess.useQuery();

  const showPrerequisiteNote = !access?.unlocked && !isAdminOrTeacher;
  const progression = MODULE_PROGRESSION_COPY[2];

  if (accessLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Vérification de l'accès...</p>
        </div>
      </div>
    );
  }

  return (
    <EnterpriseModuleHub
      moduleId={2}
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
