import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle2, AlertTriangle, ArrowRight, BarChart2, Presentation, RefreshCw,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import ModulePathwayNav from "@/components/ModulePathwayNav";
import FioriShell from "@/components/FioriShell";
import { filterCanonicalScenariosForModule, resolveScenarioScnCode } from "@/lib/scenarioCatalog";

const DIFFICULTY_LABEL: Record<string, string> = {
  facile: "Facile",
  moyen: "Moyen",
  difficile: "Difficile",
};

const DIFFICULTY_COLOR: Record<string, string> = {
  facile: "bg-emerald-100 text-emerald-800 border-emerald-200",
  moyen: "bg-amber-100 text-amber-800 border-amber-200",
  difficile: "bg-red-100 text-red-800 border-red-200",
};

export default function Module4Dashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const isAdminOrTeacher = user?.role === "admin" || user?.role === "teacher";

  const { data: moduleProgress } = trpc.modules.progress.useQuery();
  const {
    data: rawScenarios,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = trpc.scenarios.listByModule.useQuery({ moduleCode: "M4" });
  const scenarios = filterCanonicalScenariosForModule(4, rawScenarios ?? []);
  const { data: myRuns } = trpc.runs.myRuns.useQuery();

  const [loadTimedOut, setLoadTimedOut] = useState(false);
  useEffect(() => {
    if (!isLoading) {
      setLoadTimedOut(false);
      return;
    }
    const timer = window.setTimeout(() => setLoadTimedOut(true), 15000);
    return () => window.clearTimeout(timer);
  }, [isLoading]);

  const loadFailed = isError || loadTimedOut;

  const m3Progress = moduleProgress?.find((p) => p.moduleCode === "M3");
  const showPrerequisiteNote = !isAdminOrTeacher && (!m3Progress?.passed || !m3Progress?.teacherValidated);

  type RunRow = NonNullable<typeof myRuns>[number];
  const getRunForScenario = (scenarioId: number): RunRow | undefined =>
    (myRuns ?? [])
      .filter((r) => r.run.scenarioId === scenarioId && !r.run.isDemo)
      .sort((a, b) => b.run.id - a.run.id)[0];

  if (isLoading && !loadFailed) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#0070f2] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">{t("Chargement du Module 4...", "Loading Module 4...")}</p>
        </div>
      </div>
    );
  }

  if (loadFailed) {
    return (
      <FioriShell
        title={t("Mes Scénarios — Module 4", "My Scenarios — Module 4")}
        breadcrumbs={[
          { label: t("Accueil", "Home"), href: "/" },
          { label: t("Scénarios", "Scenarios"), href: "/student/scenarios" },
          { label: "M4" },
        ]}
      >
        <div className="max-w-lg mx-auto py-16 px-4 text-center space-y-4">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h2 className="text-lg font-semibold text-foreground">
            {loadTimedOut && !isError
              ? t("Chargement interrompu", "Loading timed out")
              : t("Impossible de charger le Module 4", "Unable to load Module 4")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t(
              "La liste des scénarios n'a pas pu être récupérée. Vérifiez votre connexion, puis réessayez. Si le problème persiste, rechargez la page ou contactez l'enseignant.",
              "The scenario list could not be retrieved. Check your connection and try again. If the problem persists, reload the page or contact your instructor.",
            )}
          </p>
          <Button
            onClick={() => {
              setLoadTimedOut(false);
              void refetch();
            }}
            disabled={isFetching}
            className="gap-2 bg-[#0070f2] hover:bg-[#005bb5]"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            {t("Réessayer", "Retry")}
          </Button>
          <div>
            <Link href="/student/scenarios">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowRight className="w-3 h-3 rotate-180" />
                {t("Retour aux scénarios", "Back to scenarios")}
              </Button>
            </Link>
          </div>
        </div>
      </FioriShell>
    );
  }

  return (
    <FioriShell
      title={t("Mes Scénarios — Module 4", "My Scenarios — Module 4")}
      breadcrumbs={[
        { label: t("Accueil", "Home"), href: "/" },
        { label: t("Scénarios", "Scenarios"), href: "/student/scenarios" },
        { label: "M4" },
      ]}
    >
      <div className="max-w-4xl mx-auto py-4 px-4 space-y-8">
        <ModulePathwayNav activeModuleId={4} />

        {showPrerequisiteNote && (
          <Alert className="border-amber-200 bg-amber-50 text-left">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 text-sm">
              {t(
                "Prérequis recommandé : validation du Module 3. Accès ouvert pour la session de classe — SCN-012 à SCN-014.",
                "Recommended prerequisite: Module 3 validation. Access open for class session — SCN-012 to SCN-014."
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0070f2] flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Module 4 — {t("Indicateurs de performance logistique", "Logistics Performance Indicators")}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {t("Rotation · Taux de service · Erreurs opérationnelles · Diagnostic KPI", "Turnover · Service level · Operational errors · KPI diagnosis")}
                  </p>
                </div>
                <button
                  onClick={() => navigate("/student/slides/4")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold text-white shrink-0 hover:opacity-90 transition-opacity"
                  style={{ background: "#0f2a44" }}
                >
                  <Presentation size={14} />
                  {t("Slides M4", "Slides M4")}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">{t("Scénarios disponibles", "Available scenarios")}</h2>
          {scenarios.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center text-muted-foreground">
                {t("Aucun scénario Module 4 disponible.", "No Module 4 scenarios available.")}
              </CardContent>
            </Card>
          ) : (
            scenarios.map((scenario) => {
              const scnCode = resolveScenarioScnCode(scenario);
              const lastRun = getRunForScenario(scenario.id);
              const hasCompleted = lastRun?.run.status === "completed";
              return (
                <Card key={scnCode ?? scenario.id} className="border-slate-200 hover:border-blue-300 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        {scnCode && (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-[10px] font-bold" variant="outline">
                            {scnCode}
                          </Badge>
                        )}
                        <CardTitle className="text-base font-semibold">{scenario.name}</CardTitle>
                        <CardDescription className="text-sm">{scenario.descriptionFr}</CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <Badge
                          className={`text-xs border ${DIFFICULTY_COLOR[scenario.difficulty ?? "facile"] ?? ""}`}
                          variant="outline"
                        >
                          {DIFFICULTY_LABEL[scenario.difficulty ?? "facile"] ?? scenario.difficulty}
                        </Badge>
                        {hasCompleted && (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs" variant="outline">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            {t("Complété", "Completed")}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {t("Module 4 · Mission Control + tour KPI", "Module 4 · Mission Control + KPI tower")}
                      </span>
                      <Link href={`/student/module4/scenario/${scenario.id}/mode`}>
                        <Button size="sm" className="gap-2 bg-[#0070f2] hover:bg-[#005bb5]">
                          {lastRun ? t("Recommencer", "Restart") : t("Démarrer", "Start")}
                          <ArrowRight className="w-3 h-3" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        <div className="flex justify-between pt-4 border-t border-slate-200">
          <Link href="/student/module3">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowRight className="w-3 h-3 rotate-180" />
              Module 3
            </Button>
          </Link>
          <Link href="/student/module5">
            <Button variant="outline" size="sm" className="gap-2">
              Module 5
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
      </div>
    </FioriShell>
  );
}
