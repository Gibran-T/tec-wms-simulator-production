import FioriShell from "@/components/FioriShell";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useState } from "react";
import { BookOpen, GraduationCap, FlaskConical, ShieldCheck, Zap, AlertTriangle, Play } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { isDemoMode, modeLabels, runEntryPath, type SimulationMode } from "@/lib/simulationMode";

interface ModeSelectionScreenProps {
  scenarioId: number;
  scenarioName: string;
  scenarioDifficulty?: string;
  moduleId?: number;
  onCancel: () => void;
}

export default function ModeSelectionScreen({ scenarioId, scenarioName, scenarioDifficulty, moduleId = 1, onCancel }: ModeSelectionScreenProps) {
  const { language } = useLanguage();
  const t = (fr: string, en: string) => language === "FR" ? fr : en;
  const labels = modeLabels(language);
  const [, navigate] = useLocation();
  const [selectedMode, setSelectedMode] = useState<SimulationMode>("evaluation");

  const startRun = trpc.runs.start.useMutation({
    onSuccess: (data) => {
      navigate(runEntryPath(data.runId, moduleId));
    },
    onError: (err) => {
      toast.error(err.message ?? t("Erreur lors du démarrage", "Error starting simulation"));
    },
  });

  function handleStart() {
    startRun.mutate({ scenarioId, isDemo: isDemoMode(selectedMode) });
  }

  return (
    <FioriShell
      title={t("Sélection du mode de simulation", "Simulation Mode Selection")}
      breadcrumbs={[
        { label: t("Scénarios", "Scenarios"), href: "/student/scenarios" },
        { label: t("Mode de simulation", "Simulation Mode") },
      ]}
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-[#d9d9d9] rounded-md p-5 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0f2a44] rounded-md flex items-center justify-center flex-shrink-0">
              <BookOpen size={18} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                {t("Scénario sélectionné", "Selected Scenario")}
              </p>
              <h2 className="text-[#0f2a44] font-bold text-base">{scenarioName}</h2>
              {scenarioDifficulty && (
                <span className="text-[10px] text-gray-500 capitalize">{scenarioDifficulty}</span>
              )}
            </div>
          </div>
        </div>

        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            {t("Mode de simulation :", "Simulation Mode:")}
          </p>

          <div className="space-y-3">
            <button
              onClick={() => setSelectedMode("evaluation")}
              className={`w-full text-left border-2 rounded-md p-4 transition-all ${
                selectedMode === "evaluation"
                  ? "border-[#0070f2] bg-[#f0f7ff]"
                  : "border-[#d9d9d9] bg-white hover:border-[#0070f2]/40"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                  selectedMode === "evaluation" ? "border-[#0070f2]" : "border-[#d9d9d9]"
                }`}>
                  {selectedMode === "evaluation" && (
                    <div className="w-2 h-2 rounded-full bg-[#0070f2]" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck size={14} className="text-[#0070f2]" />
                    <span className="text-sm font-bold text-[#0f2a44]">{labels.eval}</span>
                    <span className="text-[10px] bg-[#0070f2] text-white px-2 py-0.5 rounded-full font-semibold">
                      {t("PAR DÉFAUT", "DEFAULT")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {t(
                      "Mode officiel : score comptabilisé, conformité bloquante, séquence obligatoire. Compte pour la certification et l'examen.",
                      "Official mode: scored attempts, compliance blocking, mandatory sequence. Counts toward certification and the exam."
                    )}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-[10px] text-[#107e3e]">
                      <Zap size={10} /> {t("Score officiel", "Official score")}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-[#107e3e]">
                      <ShieldCheck size={10} /> {t("Blocage séquentiel", "Sequential blocking")}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-[#107e3e]">
                      <GraduationCap size={10} /> {t("Rapport final", "Final report")}
                    </span>
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedMode("demonstration")}
              className={`w-full text-left border-2 rounded-md p-4 transition-all ${
                selectedMode === "demonstration"
                  ? "border-[#5b4b8a] bg-[#f5f0ff]"
                  : "border-[#d9d9d9] bg-white hover:border-[#5b4b8a]/40"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                  selectedMode === "demonstration" ? "border-[#5b4b8a]" : "border-[#d9d9d9]"
                }`}>
                  {selectedMode === "demonstration" && (
                    <div className="w-2 h-2 rounded-full bg-[#5b4b8a]" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <FlaskConical size={14} className="text-[#5b4b8a]" />
                    <span className="text-sm font-bold text-[#0f2a44]">{labels.demo}</span>
                    <span className="text-[10px] bg-[#5b4b8a] text-white px-2 py-0.5 rounded-full font-semibold">
                      {t("PRATIQUE", "PRACTICE")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {t(
                      "Pratique guidée : erreurs autorisées avec avertissements, progression libre, transparence backend. Non comptabilisé pour la certification ni l'examen.",
                      "Guided practice: mistakes allowed with warnings, free progression, backend transparency. Not counted toward certification or the exam."
                    )}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-[10px] text-[#5b4b8a]">
                      <FlaskConical size={10} /> {t("Progression libre", "Free progression")}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-[#5b4b8a]">
                      <BookOpen size={10} /> {t("Explications pédagogiques", "Pedagogical explanations")}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-gray-500">
                      {t("Hors certification", "Non-certifying")}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {selectedMode === "demonstration" && (
          <div className="bg-[#ede7f6] border border-[#5b4b8a]/20 rounded-md p-4 mb-5">
            <p className="text-xs font-semibold text-[#5b4b8a] mb-1 flex items-center gap-1.5">
              <FlaskConical size={12} /> {labels.demo}
            </p>
            <ul className="text-xs text-[#5b4b8a]/80 space-y-1">
              <li>• {t("Cette session ", "This session ")}<strong>{t("ne compte pas", "does not count")}</strong>{t(" pour la certification ni les statistiques d'examen.", " toward certification or exam statistics.")}</li>
              <li>• {t("Les étapes peuvent être tentées hors séquence (avertissements affichés).", "Steps may be attempted out of sequence (warnings shown).")}</li>
              <li>• {t("Idéal pour s'entraîner en classe avant l'évaluation officielle.", "Ideal for in-class practice before the official evaluation.")}</li>
            </ul>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            onClick={onCancel}
            className="text-xs text-gray-500 hover:text-[#0070f2] transition-colors"
          >
            ← {t("Retour aux scénarios", "Back to scenarios")}
          </button>
          <button
            onClick={handleStart}
            disabled={startRun.isPending}
            className={`flex items-center gap-2 text-white text-xs font-bold px-6 py-2.5 rounded-md transition-colors disabled:opacity-50 ${
              selectedMode === "demonstration"
                ? "bg-[#5b4b8a] hover:bg-[#4a3a72]"
                : "bg-[#0070f2] hover:bg-[#0058c7]"
            }`}
          >
            {startRun.isPending ? (
              <><div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> {t("Démarrage...", "Starting...")}</>
            ) : (
              <><Play size={13} /> {t("Démarrer en", "Start in")} {selectedMode === "demonstration" ? labels.demoShort : labels.evalShort}</>
            )}
          </button>
        </div>
      </div>
    </FioriShell>
  );
}
