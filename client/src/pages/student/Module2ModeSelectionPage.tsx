import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import FioriShell from "@/components/FioriShell";
import { useState } from "react";
import { toast } from "sonner";
import { BookOpen, FlaskConical, ShieldCheck, Zap, Play, Layers } from "lucide-react";
import { isDemoMode, modeLabels, runEntryPath, type SimulationMode } from "@/lib/simulationMode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Module2ModeSelectionPage() {
  const params = useParams<{ scenarioId: string }>();
  const scenarioId = parseInt(params.scenarioId ?? "0", 10);
  const [, navigate] = useLocation();
  const { language } = useLanguage();
  const t = (fr: string, en: string) => language === "FR" ? fr : en;
  const labels = modeLabels(language);
  const [selectedMode, setSelectedMode] = useState<SimulationMode>("evaluation");

  const { data: scenarios } = trpc.scenarios.list.useQuery();
  const scenario = scenarios?.find((s) => s.id === scenarioId);

  const startRun = trpc.runs.start.useMutation({
    onSuccess: (data) => {
      navigate(runEntryPath(data.runId, 2));
    },
    onError: (err) => {
      toast.error(err.message ?? t("Erreur lors du démarrage", "Error starting simulation"));
    },
  });

  if (!scenarioId || !scenario) {
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
        {/* Breadcrumb */}
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <span className="cursor-pointer hover:underline" onClick={() => navigate("/student/module2")}>
            {t("Module 2", "Module 2")}
          </span>
          <span>›</span>
          <span>{t("Mode de simulation", "Simulation Mode")}</span>
        </div>

        {/* Scenario card */}
        <Card className="border-blue-200 bg-blue-50/40">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                  {t("Scénario sélectionné", "Selected Scenario")}
                </p>
                <CardTitle className="text-base">{scenario.name}</CardTitle>
                <CardDescription className="text-xs">{scenario.difficulty ?? t("facile", "easy")}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Mode selection */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">{t("MODE DE SIMULATION :", "SIMULATION MODE:")}</p>

          {/* Evaluation mode */}
          <div
            className={`rounded-lg border-2 p-4 cursor-pointer transition-colors ${
              selectedMode === "evaluation" ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300"
            }`}
            onClick={() => setSelectedMode("evaluation")}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedMode === "evaluation" ? "border-blue-500" : "border-slate-400"}`}>
                {selectedMode === "evaluation" && <div className="w-2 h-2 rounded-full bg-blue-500" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{labels.eval}</span>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs" variant="outline">
                    {t("PAR DÉFAUT", "DEFAULT")}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {t(
                    "Mode officiel avec score et blocage séquentiel. Les points sont calculés, les pénalités s'appliquent.",
                    "Official mode with score and sequential blocking. Points are calculated, penalties apply."
                  )}
                  <strong> {t("Score maximum : 100 points.", "Maximum score: 100 points.")}</strong>
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-500" /> {t("Score activé", "Score enabled")}</span>
                  <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-500" /> {t("Règles FIFO/Capacité", "FIFO/Capacity rules")}</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3 text-blue-500" /> {t("Rapport final", "Final report")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Demo mode */}
          <div
            className={`rounded-lg border-2 p-4 cursor-pointer transition-colors ${
              selectedMode === "demonstration"
                ? "border-purple-500 bg-purple-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
            onClick={() => setSelectedMode("demonstration")}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedMode === "demonstration" ? "border-purple-500" : "border-slate-400"}`}>
                {selectedMode === "demonstration" && <div className="w-2 h-2 rounded-full bg-purple-500" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{labels.demo}</span>
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs" variant="outline">
                    {t("PRATIQUE", "PRACTICE")}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {t(
                    "Pratique guidée : erreurs autorisées, avertissements, progression libre. Non comptabilisé pour la certification ni l'examen.",
                    "Guided practice: mistakes allowed, warnings, free progression. Not counted toward certification or the exam."
                  )}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><FlaskConical className="w-3 h-3 text-blue-500" /> {t("Progression libre", "Free progression")}</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3 text-purple-500" /> {t("Explications pédagogiques", "Pedagogical explanations")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Button variant="outline" onClick={() => navigate("/student/module2")}>
            ← {t("Retour aux scénarios", "Back to scenarios")}
          </Button>
          <Button
            className="gap-2 bg-blue-600 hover:bg-blue-700"
            disabled={startRun.isPending}
            onClick={() => {
              startRun.mutate({
                scenarioId,
                isDemo: isDemoMode(selectedMode),
              });
            }}
          >
            <Play className="w-4 h-4" />
            {startRun.isPending
              ? t("Démarrage...", "Starting...")
              : `${t("Démarrer en", "Start in")} ${selectedMode === "evaluation" ? labels.evalShort : labels.demoShort}`}
          </Button>
        </div>
      </div>
    </FioriShell>
  );
}
