import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Package, CheckCircle2, AlertTriangle, ArrowRight, Layers, Eye, Presentation } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";

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

export default function Module2ScenarioList() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const isAdminOrTeacher = user?.role === "admin" || user?.role === "teacher";
  const { data: access, isLoading: accessLoading } = trpc.warehouse.checkAccess.useQuery();
  const { data: scenarios, isLoading: scenariosLoading } = trpc.scenarios.list.useQuery();
  const { data: myRuns } = trpc.runs.myRuns.useQuery();

  const module2Scenarios = (scenarios ?? []).filter((s) => s.moduleId === 2);
  type RunRow = NonNullable<typeof myRuns>[number];

  const getRunForScenario = (scenarioId: number): RunRow | undefined =>
    (myRuns ?? []).filter((r) => r.run.scenarioId === scenarioId && !r.run.isDemo).sort((a, b) => b.run.id - a.run.id)[0];

  if (accessLoading || scenariosLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Vérification de l'accès...</p>
        </div>
      </div>
    );
  }

  if (!access?.unlocked && !isAdminOrTeacher) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
            <Lock className="w-10 h-10 text-slate-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Module 2 verrouillé</h1>
            <p className="text-muted-foreground">
              Ce module est accessible uniquement après avoir réussi le Module 1 avec un score d'au moins 60 points.
            </p>
          </div>
          <Alert className="border-amber-200 bg-amber-50 text-left">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Prérequis :</strong> Complétez et réussissez au moins un scénario du Module 1 pour débloquer l'Exécution d'entrepôt et gestion des emplacements.
            </AlertDescription>
          </Alert>
          <Link href="/student/scenarios">
            <Button variant="outline" className="gap-2">
              <ArrowRight className="w-4 h-4 rotate-180" />
              Retour au Module 1
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Module 2 — {t("Exécution d'entrepôt et gestion des emplacements", "Warehouse Execution & Location Management")}</h1>
                <p className="text-sm text-muted-foreground">{t("Rangement structuré · Capacité bin · FIFO · Précision inventaire", "Structured putaway · Bin capacity · FIFO · Inventory accuracy")}</p>
              </div>
              <button
                onClick={() => navigate("/student/slides/2")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold text-white shrink-0 hover:opacity-90 transition-opacity"
                style={{ background: "#0f2a44" }}
              >
                <Presentation size={14} />
                {t("Slides M2", "Slides M2")}
              </button>
            </div>
          </div>
        </div>
        <Alert className="border-blue-200 bg-blue-50">
          <CheckCircle2 className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Module 1 réussi</strong> — Accès au Module 2 débloqué. Vous pouvez maintenant pratiquer l'exécution opérationnelle avancée.
          </AlertDescription>
        </Alert>
      </div>

      {/* Learning Objectives */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Objectifs pédagogiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Package, label: "Putaway LT01", desc: "Rangement structuré depuis le quai de réception" },
              { icon: CheckCircle2, label: "Capacité bin", desc: "Validation des limites de capacité par emplacement" },
              { icon: AlertTriangle, label: "Règle FIFO", desc: "Respect de l'ordre premier entré, premier sorti" },
              { icon: Layers, label: "Précision inventaire", desc: "Contrôle de cohérence stock système vs physique" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                <Icon className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scenarios */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Scénarios disponibles</h2>
        {module2Scenarios.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center text-muted-foreground">
              Aucun scénario Module 2 disponible. Contactez votre enseignant.
            </CardContent>
          </Card>
        ) : (
          module2Scenarios.map((scenario) => {
            const lastRun = getRunForScenario(scenario.id);
            const hasCompleted = lastRun?.run.status === "completed";
            return (
              <Card key={scenario.id} className="border-slate-200 hover:border-blue-300 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <CardTitle className="text-base font-semibold">{scenario.name}</CardTitle>
                      <CardDescription className="text-sm">{scenario.descriptionFr}</CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <Badge className={`text-xs border ${DIFFICULTY_COLOR[scenario.difficulty ?? "facile"] ?? ""}`} variant="outline">
                        {DIFFICULTY_LABEL[scenario.difficulty ?? "facile"] ?? scenario.difficulty}
                      </Badge>
                      {hasCompleted ? (
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs" variant="outline">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Complété
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Module 2 · Exécution d'entrepôt</span>
                      {lastRun && (
                        <span>
                          Dernière tentative : score disponible dans le rapport
                        </span>
                      )}
                    </div>
                    <Link href={`/student/module2/scenario/${scenario.id}/mode`}>
                      <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
                        {lastRun ? "Recommencer" : "Démarrer"}
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
    </div>
  );
}
