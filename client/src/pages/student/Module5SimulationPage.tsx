import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle2, AlertTriangle, ArrowRight, FileText, Presentation,
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

export default function Module5SimulationPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const isAdminOrTeacher = user?.role === "admin" || user?.role === "teacher";

  const { data: moduleProgress } = trpc.modules.progress.useQuery();
  const { data: rawScenarios, isLoading } = trpc.scenarios.listByModule.useQuery({ moduleCode: "M5" });
  const scenarios = filterCanonicalScenariosForModule(5, rawScenarios ?? []);
  const { data: myRuns } = trpc.runs.myRuns.useQuery();

  const m4Progress = moduleProgress?.find((p) => p.moduleCode === "M4");
  const showPrerequisiteNote = !isAdminOrTeacher && !m4Progress?.passed;

  type RunRow = NonNullable<typeof myRuns>[number];
  const getRunForScenario = (scenarioId: number): RunRow | undefined =>
    (myRuns ?? [])
      .filter((r) => r.run.scenarioId === scenarioId && !r.run.isDemo)
      .sort((a, b) => b.run.id - a.run.id)[0];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#7b1fa2] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">{t("Chargement du Module 5...", "Loading Module 5...")}</p>
        </div>
      </div>
    );
  }

  return (
    <FioriShell
      title={t("Mes Scénarios — Module 5", "My Scenarios — Module 5")}
      breadcrumbs={[
        { label: t("Accueil", "Home"), href: "/" },
        { label: t("Scénarios", "Scenarios"), href: "/student/scenarios" },
        { label: "M5" },
      ]}
    >
      <div className="max-w-4xl mx-auto py-4 px-4 space-y-8">
        <ModulePathwayNav activeModuleId={5} />

        {showPrerequisiteNote && (
          <Alert className="border-amber-200 bg-amber-50 text-left">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 text-sm">
              {t(
                "Prérequis recommandé : validation du Module 4. Accès ouvert pour la session de classe — SCN-015 à SCN-017.",
                "Recommended prerequisite: Module 4 validation. Access open for class session — SCN-015 to SCN-017."
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#7b1fa2] flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Module 5 — {t("Simulation opérationnelle intégrée", "Integrated Operational Simulation")}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {t("Réception · Rangement · Inventaire · Réappro · KPI · Décision stratégique", "Reception · Putaway · Inventory · Replenish · KPI · Strategic decision")}
                  </p>
                </div>
                <button
                  onClick={() => navigate("/student/slides/5")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold text-white shrink-0 hover:opacity-90 transition-opacity"
                  style={{ background: "#0f2a44" }}
                >
                  <Presentation size={14} />
                  {t("Slides M5", "Slides M5")}
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
                {t("Aucun scénario Module 5 disponible.", "No Module 5 scenarios available.")}
              </CardContent>
            </Card>
          ) : (
            scenarios.map((scenario) => {
              const scnCode = resolveScenarioScnCode(scenario);
              const lastRun = getRunForScenario(scenario.id);
              const hasCompleted = lastRun?.run.status === "completed";
              return (
                <Card key={scnCode ?? scenario.id} className="border-slate-200 hover:border-purple-300 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        {scnCode && (
                          <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-[10px] font-bold" variant="outline">
                            {scnCode}
                          </Badge>
                        )}
                        <CardTitle className="text-base font-semibold">{scenario.name}</CardTitle>
                        <CardDescription className="text-sm">{scenario.descriptionFr}</CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <Badge
                          className={`text-xs border ${DIFFICULTY_COLOR[scenario.difficulty ?? "moyen"] ?? ""}`}
                          variant="outline"
                        >
                          {DIFFICULTY_LABEL[scenario.difficulty ?? "moyen"] ?? scenario.difficulty}
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
                        {t("Module 5 · Mission Control + cycle intégré", "Module 5 · Mission Control + integrated cycle")}
                      </span>
                      <Link href={`/student/module5/scenario/${scenario.id}/mode`}>
                        <Button size="sm" className="gap-2 bg-[#7b1fa2] hover:bg-[#6a1b9a]">
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
          <Link href="/student/module4">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowRight className="w-3 h-3 rotate-180" />
              Module 4
            </Button>
          </Link>
          <Link href="/student/certifications">
            <Button variant="outline" size="sm" className="gap-2">
              {t("Certifications", "Certifications")}
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
      </div>
    </FioriShell>
  );
}
