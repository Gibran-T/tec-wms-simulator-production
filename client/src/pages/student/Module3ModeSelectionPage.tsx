import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import FioriShell from "@/components/FioriShell";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { toast } from "sonner";
import { BookOpen, FlaskConical, ShieldCheck, Zap, Play, Lock, BarChart3, Users, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Module3ModeSelectionPage() {
  const params = useParams<{ scenarioId: string }>();
  const scenarioId = parseInt(params.scenarioId ?? "0", 10);
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { language } = useLanguage();
  const t = (fr: string, en: string) => language === "FR" ? fr : en;

  // Demo / Pratique guidée is the default classroom mode for ALL users
  const [selectedMode, setSelectedMode] = useState<"evaluation" | "demonstration">("demonstration");

  const { data: scenarios } = trpc.scenarios.list.useQuery();
  const scenario = scenarios?.find((s) => s.id === scenarioId);

  const startRun = trpc.runs.start.useMutation({
    onSuccess: (data) => {
      navigate(`/student/run/${data.runId}`);
    },
    onError: (err) => {
      toast.error(err.message ?? t("Erreur lors du démarrage", "Error starting simulation"));
    },
  });

  const isTeacherOrAdmin = user?.role === "teacher" || user?.role === "admin";

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
          <span className="cursor-pointer hover:underline" onClick={() => navigate("/student/module3")}>
            {t("Module 3", "Module 3")}
          </span>
          <span>›</span>
          <span>{t("Mode de simulation", "Simulation Mode")}</span>
        </div>

        {/* Scenario card */}
        <Card className="border-teal-200 bg-teal-50/40">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center shrink-0">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-teal-600 uppercase tracking-wide">
                  {t("Scénario sélectionné", "Selected Scenario")}
                </p>
                <CardTitle className="text-base">{scenario.name}</CardTitle>
                <CardDescription className="text-xs">{scenario.difficulty ?? t("facile", "easy")}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Pedagogical flow reminder */}
        <div className="bg-teal-50 border border-teal-200 rounded-lg px-4 py-3">
          <p className="text-xs text-teal-900 leading-relaxed">
            <strong>TEC.WMS</strong> {t("fait pratiquer le flux guidé.", "guides you through the operational flow.")}
            {" "}<strong>Odoo EDU</strong> {t("permet d'observer, analyser et pratiquer dans un ERP réel.", "lets you observe, analyse and practise in a real ERP.")}
          </p>
        </div>

        {/* Mode selection */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">{t("CHOISISSEZ VOTRE MODE :", "CHOOSE YOUR MODE:")}</p>

          {/* Demo / Pratique guidée — DEFAULT for all users */}
          <div
            className={`rounded-lg border-2 p-4 cursor-pointer transition-colors ${
              selectedMode === "demonstration" ? "border-green-600 bg-green-50" : "border-slate-200 hover:border-slate-300"
            }`}
            onClick={() => setSelectedMode("demonstration")}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedMode === "demonstration" ? "border-green-600" : "border-slate-400"}`}>
                {selectedMode === "demonstration" && <div className="w-2 h-2 rounded-full bg-green-600" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <FlaskConical className="w-4 h-4 text-green-700" />
                  <span className="font-semibold text-sm">{t("Mode Démonstration / Pratique guidée", "Demo Mode / Guided Practice")}</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200 text-xs" variant="outline">
                    {t("MODE CLASSE", "CLASS MODE")}
                  </Badge>
                  <Badge className="bg-green-50 text-green-700 border-green-300 text-xs" variant="outline">
                    {t("NON ÉVALUÉ", "NOT GRADED")}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {t(
                    "Mode pédagogique sécurisé pour la pratique en classe. Aucun score enregistré, aucune pénalité, progression libre. Exécutez les mêmes étapes que le professeur en temps réel.",
                    "Safe pedagogical mode for classroom practice. No score recorded, no penalties, free progression. Execute the same steps as the teacher in real time."
                  )}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3 text-green-600" /> {t("Tous les étudiants", "All students")}</span>
                  <span className="flex items-center gap-1"><FlaskConical className="w-3 h-3 text-green-600" /> {t("Progression libre", "Free progression")}</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3 text-green-600" /> {t("Explications pédagogiques", "Pedagogical explanations")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Exam / Évaluation officielle */}
          <div
            className={`rounded-lg border-2 p-4 cursor-pointer transition-colors ${
              selectedMode === "evaluation" ? "border-teal-500 bg-teal-50" : "border-slate-200 hover:border-slate-300"
            }`}
            onClick={() => setSelectedMode("evaluation")}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedMode === "evaluation" ? "border-teal-500" : "border-slate-400"}`}>
                {selectedMode === "evaluation" && <div className="w-2 h-2 rounded-full bg-teal-500" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span className="font-semibold text-sm">{t("Mode Examen / Évaluation officielle", "Exam Mode / Official Evaluation")}</span>
                  <Badge className="bg-teal-100 text-teal-800 border-teal-200 text-xs" variant="outline">
                    {t("CERTIFICATION", "CERTIFICATION")}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {t(
                    "Mode officiel avec score et blocage séquentiel. Les points sont calculés, les pénalités s'appliquent. Résultats enregistrés pour la certification.",
                    "Official mode with score and sequential blocking. Points are calculated, penalties apply. Results recorded for certification."
                  )}
                  <strong> {t("Score maximum : 100 points.", "Maximum score: 100 points.")}</strong>
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-teal-500" /> {t("Score officiel", "Official score")}</span>
                  <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-500" /> {t("Règles Min/Max", "Min/Max rules")}</span>
                  <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3 text-teal-500" /> {t("Rapport de certification", "Certification report")}</span>
                  <span className="flex items-center gap-1 text-amber-600"><Lock className="w-3 h-3" /> {t("Sur autorisation du professeur", "With teacher authorization")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info box */}
        {selectedMode === "demonstration" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-xs font-semibold text-green-800 mb-1 flex items-center gap-1.5">
              <FlaskConical className="w-3 h-3" /> {t("Pratique guidée — Mode classe", "Guided Practice — Class Mode")}
            </p>
            <ul className="text-xs text-green-700/80 space-y-1">
              <li>• {t("Score non comptabilisé dans votre certification.", "Score not counted in your certification.")}</li>
              <li>• {t("Vous pouvez faire des erreurs et recommencer librement.", "You can make mistakes and restart freely.")}</li>
              <li>• {t("Exécutez les mêmes étapes que le professeur pendant le cours.", "Execute the same steps as the teacher during class.")}</li>
            </ul>
          </div>
        )}
        {selectedMode === "evaluation" && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-xs font-semibold text-amber-800 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3" /> {t("Évaluation officielle — Certification", "Official Evaluation — Certification")}
            </p>
            <ul className="text-xs text-amber-700/80 space-y-1">
              <li>• {t("Ce mode compte pour votre certification TEC.LOG.", "This mode counts towards your TEC.LOG certification.")}</li>
              <li>• {t("N'entrez dans ce mode que sur autorisation explicite de votre professeur.", "Only enter this mode with explicit authorization from your teacher.")}</li>
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Button variant="outline" onClick={() => navigate("/student/module3")}>
            ← {t("Retour aux scénarios", "Back to scenarios")}
          </Button>
          <Button
            className={`gap-2 ${selectedMode === "demonstration" ? "bg-green-700 hover:bg-green-800" : "bg-teal-600 hover:bg-teal-700"}`}
            disabled={startRun.isPending}
            onClick={() => {
              startRun.mutate({
                scenarioId,
                isDemo: selectedMode === "demonstration",
              });
            }}
          >
            <Play className="w-4 h-4" />
            {startRun.isPending
              ? t("Démarrage...", "Starting...")
              : selectedMode === "demonstration"
                ? t("Démarrer la pratique guidée", "Start guided practice")
                : t("Démarrer l'évaluation officielle", "Start official evaluation")}
          </Button>
        </div>
      </div>
    </FioriShell>
  );
}
