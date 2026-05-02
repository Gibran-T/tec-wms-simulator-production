import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Lock, CheckCircle2, AlertTriangle, ArrowRight,
  BarChart3, RefreshCw, TrendingUp, ClipboardList, Presentation
} from "lucide-react";
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

export default function Module3ScenarioList() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const isAdminOrTeacher = user?.role === "admin" || user?.role === "teacher";
  const { data: scenarios, isLoading: scenariosLoading } = trpc.scenarios.list.useQuery();
  const { data: myRuns } = trpc.runs.myRuns.useQuery();
  const { data: moduleProgress } = trpc.warehouse.myProgress.useQuery();

  // Check if Module 2 is passed (unlock condition for Module 3)
  const module2Passed = isAdminOrTeacher || (moduleProgress ?? []).some(
    (mp: any) => mp.moduleId === 2 && mp.passed
  );

  const module3Scenarios = (scenarios ?? []).filter((s: any) => s.moduleId === 3);

  type RunRow = NonNullable<typeof myRuns>[number];
  const getRunForScenario = (scenarioId: number): RunRow | undefined =>
    (myRuns ?? [])
      .filter((r) => r.run.scenarioId === scenarioId && !r.run.isDemo)
      .sort((a, b) => b.run.id - a.run.id)[0];

  if (scenariosLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Chargement du Module 3...</p>
        </div>
      </div>
    );
  }

  if (!module2Passed && !isAdminOrTeacher) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
            <Lock className="w-10 h-10 text-slate-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Module 3 verrouillé</h1>
            <p className="text-muted-foreground">
              Ce module est accessible uniquement après avoir réussi le Module 2 avec un score d'au moins 60 points.
            </p>
          </div>
          <Alert className="border-amber-200 bg-amber-50 text-left">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Prérequis :</strong> Complétez et réussissez au moins un scénario du Module 2 pour débloquer le Contrôle des stocks et réapprovisionnement.
            </AlertDescription>
          </Alert>
          <Link href="/student/module2">
            <Button variant="outline" className="gap-2">
              <ArrowRight className="w-4 h-4 rotate-180" />
              Retour au Module 2
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
          <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Module 3 — {t("Contrôle des stocks et réapprovisionnement", "Inventory Control & Replenishment")}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {t("Inventaire cyclique · Analyse d'écart · Ajustement · Min/Max · Stock de sécurité", "Cycle count · Variance analysis · Adjustment · Min/Max · Safety stock")}
                </p>
              </div>
              <button
                onClick={() => navigate("/student/slides/3")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold text-white shrink-0 hover:opacity-90 transition-opacity"
                style={{ background: "#0f2a44" }}
              >
                <Presentation size={14} />
                {t("Slides M3", "Slides M3")}
              </button>
            </div>
          </div>
        </div>
        <Alert className="border-teal-200 bg-teal-50">
          <CheckCircle2 className="h-4 w-4 text-teal-600" />
          <AlertDescription className="text-teal-800">
            <strong>Module 2 réussi</strong> — Accès au Module 3 débloqué. Vous pouvez maintenant pratiquer le contrôle des stocks et le réapprovisionnement.
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
              {
                icon: ClipboardList,
                label: "Inventaire cyclique (MI01)",
                desc: "Compter physiquement les articles et comparer au stock système"
              },
              {
                icon: AlertTriangle,
                label: "Analyse d'écart",
                desc: "Identifier et justifier les variances entre stock physique et système"
              },
              {
                icon: CheckCircle2,
                label: "Ajustement d'inventaire (MI07)",
                desc: "Procéder à l'ajustement conforme aux règles internes"
              },
              {
                icon: RefreshCw,
                label: "Réapprovisionnement Min/Max",
                desc: "Générer une recommandation selon les paramètres Min/Max et stock de sécurité"
              },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                <Icon className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SAP Context */}
      <Card className="border-teal-100 bg-teal-50/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-teal-800 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Contexte SAP S/4HANA
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-teal-700 space-y-1">
          <p><strong>MI01</strong> — Créer un document d'inventaire pour un emplacement spécifique</p>
          <p><strong>MI04</strong> — Saisir les comptages physiques dans le document d'inventaire</p>
          <p><strong>MI07</strong> — Valider les différences et procéder à l'ajustement comptable</p>
          <p><strong>MRP / Min-Max</strong> — Déclenchement automatique du réapprovisionnement selon les paramètres définis dans la fiche article</p>
        </CardContent>
      </Card>

      {/* Scenarios */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Scénarios disponibles</h2>
        {module3Scenarios.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center text-muted-foreground">
              Aucun scénario Module 3 disponible. Contactez votre enseignant.
            </CardContent>
          </Card>
        ) : (
          module3Scenarios.map((scenario: any) => {
            const lastRun = getRunForScenario(scenario.id);
            const hasCompleted = lastRun?.run.status === "completed";
            return (
              <Card
                key={scenario.id}
                className="border-slate-200 hover:border-teal-300 transition-colors"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
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
                        <Badge
                          className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs"
                          variant="outline"
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Complété
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Module 3 · Contrôle des stocks</span>
                      {lastRun && (
                        <span>Dernière tentative : score disponible dans le rapport</span>
                      )}
                    </div>
                    <Link href={`/student/module3/scenario/${scenario.id}/mode`}>
                      <Button size="sm" className="gap-2 bg-teal-600 hover:bg-teal-700">
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

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-slate-200">
        <Link href="/student/module2">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowRight className="w-3 h-3 rotate-180" />
            Module 2
          </Button>
        </Link>
        <Link href="/student/module4">
          <Button variant="outline" size="sm" className="gap-2">
            Module 4 — KPI
            <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
