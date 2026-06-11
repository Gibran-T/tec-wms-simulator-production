import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import FioriShell from "@/components/FioriShell";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { useModuleScenarioRoute } from "@/hooks/useModuleScenarioRoute";
import { toast } from "sonner";
import { BookOpen, ShieldCheck, Zap, Play, Lock, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Module4ModeSelectionPage() {
  const params = useParams<{ scenarioId: string }>();
  const routeParam = parseInt(params.scenarioId ?? "0", 10);
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { language } = useLanguage();
  const t = (fr: string, en: string) => (language === "FR" ? fr : en);
  const [selectedMode, setSelectedMode] = useState<"evaluation" | "demonstration">("evaluation");

  const { data: scenarios, isLoading } = trpc.scenarios.listByModule.useQuery({ moduleCode: "M4" });
  const { scenario, effectiveScenarioId } = useModuleScenarioRoute({
    moduleId: 4,
    routeParam,
    scenarios,
    modulePath: "/student/module4",
  });

  const startRun = trpc.runs.start.useMutation({
    onSuccess: (data) => {
      navigate(`/student/run/${data.runId}`);
    },
    onError: (err) => {
      toast.error(err.message ?? t("Erreur lors du démarrage", "Error starting simulation"));
    },
  });

  const isTeacherOrAdmin = user?.role === "teacher" || user?.role === "admin";

  if (isLoading) {
    return (
      <FioriShell>
        <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">
          {t("Chargement...", "Loading...")}
        </div>
      </FioriShell>
    );
  }

  if (!routeParam || !scenario || !effectiveScenarioId) {
    return (
      <FioriShell>
        <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">
          {t("Scénario introuvable.", "Scenario not found.")}
        </div>
      </FioriShell>
    );
  }

  return (
    <FioriShell>
      <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <span className="cursor-pointer hover:underline" onClick={() => navigate("/student/module4")}>
            {t("Module 4", "Module 4")}
          </span>
          <span>›</span>
          <span>{t("Mode de simulation", "Simulation Mode")}</span>
        </div>

        <Card className="border-blue-200 bg-blue-50/40">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#0070f2] flex items-center justify-center shrink-0">
                <BarChart2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#0070f2] uppercase tracking-wide">
                  {t("Scénario sélectionné", "Selected Scenario")}
                </p>
                <CardTitle className="text-base">{scenario.name}</CardTitle>
                <CardDescription className="text-xs">{scenario.difficulty ?? t("facile", "easy")}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">{t("MODE DE SIMULATION :", "SIMULATION MODE:")}</p>

          <div
            className={`rounded-lg border-2 p-4 cursor-pointer transition-colors ${
              selectedMode === "evaluation" ? "border-[#0070f2] bg-blue-50" : "border-slate-200 hover:border-slate-300"
            }`}
            onClick={() => setSelectedMode("evaluation")}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedMode === "evaluation" ? "border-[#0070f2]" : "border-slate-400"}`}>
                {selectedMode === "evaluation" && <div className="w-2 h-2 rounded-full bg-[#0070f2]" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{t("Mode Évaluation", "Evaluation Mode")}</span>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs" variant="outline">
                    {t("PAR DÉFAUT", "DEFAULT")}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {t(
                    "Mode officiel — Mission Control, tour KPI et analyse des indicateurs avec score.",
                    "Official mode — Mission Control, KPI tower and indicator analysis with scoring."
                  )}
                  <strong> {t("Score maximum : 100 points.", "Maximum score: 100 points.")}</strong>
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-500" /> {t("Score activé", "Score enabled")}</span>
                  <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-500" /> {t("KPI + OIL", "KPI + OIL")}</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3 text-blue-500" /> {t("Rapport final", "Final report")}</span>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`rounded-lg border-2 p-4 transition-colors ${
              !isTeacherOrAdmin
                ? "border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed"
                : selectedMode === "demonstration"
                ? "border-[#0070f2] bg-blue-50 cursor-pointer"
                : "border-slate-200 hover:border-slate-300 cursor-pointer"
            }`}
            onClick={() => isTeacherOrAdmin && setSelectedMode("demonstration")}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedMode === "demonstration" && isTeacherOrAdmin ? "border-[#0070f2]" : "border-slate-400"}`}>
                {selectedMode === "demonstration" && isTeacherOrAdmin && <div className="w-2 h-2 rounded-full bg-[#0070f2]" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{t("Mode Démonstration", "Demonstration Mode")}</span>
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs" variant="outline">
                    {t("ENSEIGNANTS", "TEACHERS")}
                  </Badge>
                  {!isTeacherOrAdmin && (
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Lock className="w-3 h-3" /> {t("Réservé", "Restricted")}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {t(
                    "Mode pédagogique libre. Aucun score enregistré, exploration libre des KPI et du diagnostic.",
                    "Free pedagogical mode. No score recorded, free exploration of KPIs and diagnostics."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button variant="outline" onClick={() => navigate("/student/module4")}>
            ← {t("Retour aux scénarios", "Back to scenarios")}
          </Button>
          <Button
            className="gap-2 bg-[#0070f2] hover:bg-[#005bb5]"
            disabled={startRun.isPending}
            onClick={() => {
              startRun.mutate({
                scenarioId: effectiveScenarioId,
                isDemo: selectedMode === "demonstration",
              });
            }}
          >
            <Play className="w-4 h-4" />
            {startRun.isPending
              ? t("Démarrage...", "Starting...")
              : `${t("Démarrer en mode", "Start in")} ${selectedMode === "evaluation" ? t("Évaluation", "Evaluation") : t("Démonstration", "Demonstration")}`}
          </Button>
        </div>
      </div>
    </FioriShell>
  );
}
