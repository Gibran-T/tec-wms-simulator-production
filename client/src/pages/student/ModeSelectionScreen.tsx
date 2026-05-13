import FioriShell from "@/components/FioriShell";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useState } from "react";
import { BookOpen, GraduationCap, FlaskConical, ShieldCheck, Zap, Play, Users, Lock } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface ModeSelectionScreenProps {
  scenarioId: number;
  scenarioName: string;
  scenarioDifficulty?: string;
  onCancel: () => void;
}

export default function ModeSelectionScreen({ scenarioId, scenarioName, scenarioDifficulty, onCancel }: ModeSelectionScreenProps) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const t = (fr: string, en: string) => language === "FR" ? fr : en;
  const [, navigate] = useLocation();
  const isTeacherOrAdmin = user?.role === "teacher" || user?.role === "admin";

  // Demo / Pratique guidée is the default classroom mode for ALL users
  const [selectedMode, setSelectedMode] = useState<"evaluation" | "demonstration">("demonstration");

  const startRun = trpc.runs.start.useMutation({
    onSuccess: (data) => {
      navigate(`/student/run/${data.runId}`);
    },
    onError: (err) => {
      toast.error(err.message ?? t("Erreur lors du démarrage", "Error starting simulation"));
    },
  });

  function handleStart() {
    // All users can start in demo mode; evaluation requires teacher/admin OR explicit student choice
    const isDemo = selectedMode === "demonstration";
    startRun.mutate({ scenarioId, isDemo });
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
        {/* Scenario Header */}
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

        {/* Pedagogical flow reminder */}
        <div className="bg-[#e8f4fd] border border-[#0070f2]/20 rounded-md px-4 py-3 mb-5">
          <p className="text-xs text-[#0f2a44] leading-relaxed">
            <strong>TEC.WMS</strong> {t("fait pratiquer le flux guidé.", "guides you through the operational flow.")}
            {" "}<strong>Odoo EDU</strong> {t("permet d'observer, analyser et pratiquer dans un ERP réel.", "lets you observe, analyse and practise in a real ERP.")}
          </p>
        </div>

        {/* Mode Selection */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            {t("Choisissez votre mode de simulation :", "Choose your simulation mode:")}
          </p>

          <div className="space-y-3">
            {/* Demo / Pratique guidée — DEFAULT for all users */}
            <button
              onClick={() => setSelectedMode("demonstration")}
              className={`w-full text-left border-2 rounded-md p-4 transition-all ${
                selectedMode === "demonstration"
                  ? "border-[#2e7d32] bg-[#f1f8f1]"
                  : "border-[#d9d9d9] bg-white hover:border-[#2e7d32]/40"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                  selectedMode === "demonstration" ? "border-[#2e7d32]" : "border-[#d9d9d9]"
                }`}>
                  {selectedMode === "demonstration" && (
                    <div className="w-2 h-2 rounded-full bg-[#2e7d32]" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <FlaskConical size={14} className="text-[#2e7d32]" />
                    <span className="text-sm font-bold text-[#0f2a44]">
                      {t("Mode Démonstration / Pratique guidée", "Demo Mode / Guided Practice")}
                    </span>
                    <span className="text-[10px] bg-[#2e7d32] text-white px-2 py-0.5 rounded-full font-semibold">
                      {t("MODE CLASSE", "CLASS MODE")}
                    </span>
                    <span className="text-[10px] bg-[#e8f5e9] text-[#2e7d32] border border-[#2e7d32]/30 px-2 py-0.5 rounded-full font-semibold">
                      {t("NON ÉVALUÉ", "NOT GRADED")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {t(
                      "Mode pédagogique sécurisé pour la pratique en classe. Aucun score enregistré, aucune pénalité, progression libre entre les étapes. Exécutez les mêmes étapes que le professeur en temps réel. Inclut des explications approfondies et la transparence du backend WMS.",
                      "Safe pedagogical mode for classroom practice. No score recorded, no penalties, free progression between steps. Execute the same steps as the teacher in real time. Includes in-depth explanations and WMS backend transparency."
                    )}
                  </p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="flex items-center gap-1 text-[10px] text-[#2e7d32]">
                      <Users size={10} /> {t("Tous les étudiants", "All students")}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-[#2e7d32]">
                      <FlaskConical size={10} /> {t("Progression libre", "Free progression")}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-[#2e7d32]">
                      <BookOpen size={10} /> {t("Explications pédagogiques", "Pedagogical explanations")}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-gray-400">
                      {t("Score non comptabilisé", "Score not counted")}
                    </span>
                  </div>
                </div>
              </div>
            </button>

            {/* Evaluation / Examen officiel */}
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
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <ShieldCheck size={14} className="text-[#0070f2]" />
                    <span className="text-sm font-bold text-[#0f2a44]">
                      {t("Mode Examen / Évaluation officielle", "Exam Mode / Official Evaluation")}
                    </span>
                    <span className="text-[10px] bg-[#0070f2] text-white px-2 py-0.5 rounded-full font-semibold">
                      {t("CERTIFICATION", "CERTIFICATION")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {t(
                      "Mode officiel avec score et blocage séquentiel. Les points sont calculés, les pénalités s'appliquent, et le flux est obligatoire (PO → GR → SO → GI → CC → Conformité). Résultats enregistrés pour la certification.",
                      "Official mode with score and sequential blocking. Points are calculated, penalties apply, and the flow is mandatory (PO → GR → SO → GI → CC → Compliance). Results recorded for certification."
                    )}
                    <strong className="text-[#0f2a44]"> {t("Score maximum : 100 points.", "Maximum score: 100 points.")}</strong>
                  </p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="flex items-center gap-1 text-[10px] text-[#0070f2]">
                      <Zap size={10} /> {t("Score officiel", "Official score")}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-[#0070f2]">
                      <ShieldCheck size={10} /> {t("Blocage séquentiel", "Sequential blocking")}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-[#0070f2]">
                      <GraduationCap size={10} /> {t("Rapport de certification", "Certification report")}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-amber-600">
                      <Lock size={10} /> {t("Sur autorisation du professeur", "With teacher authorization")}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Info Box for Demo mode */}
        {selectedMode === "demonstration" && (
          <div className="bg-[#e8f5e9] border border-[#2e7d32]/20 rounded-md p-4 mb-5">
            <p className="text-xs font-semibold text-[#2e7d32] mb-1 flex items-center gap-1.5">
              <FlaskConical size={12} /> {t("Mode Démonstration / Pratique guidée — Informations", "Demo / Guided Practice Mode — Information")}
            </p>
            <ul className="text-xs text-[#2e7d32]/80 space-y-1">
              <li>• {t("Cette session ", "This session ")}<strong>{t("ne sera pas comptabilisée", "will not be counted")}</strong>{t(" dans votre score de certification.", " in your certification score.")}</li>
              <li>• {t("Vous pouvez faire des erreurs et recommencer librement — c'est le but de la pratique guidée.", "You can make mistakes and restart freely — that is the purpose of guided practice.")}</li>
              <li>• {t("Exécutez les mêmes étapes que le professeur pendant le cours.", "Execute the same steps as the teacher during class.")}</li>
              <li>• {t("Chaque formulaire inclut des explications pédagogiques détaillées et la logique WMS.", "Each form includes detailed pedagogical explanations and WMS logic.")}</li>
            </ul>
          </div>
        )}

        {/* Info Box for Evaluation mode */}
        {selectedMode === "evaluation" && (
          <div className="bg-[#fff3e0] border border-amber-400/30 rounded-md p-4 mb-5">
            <p className="text-xs font-semibold text-amber-700 mb-1 flex items-center gap-1.5">
              <ShieldCheck size={12} /> {t("Mode Examen — Évaluation officielle", "Exam Mode — Official Evaluation")}
            </p>
            <ul className="text-xs text-amber-700/80 space-y-1">
              <li>• {t("Ce mode compte pour votre certification TEC.LOG.", "This mode counts towards your TEC.LOG certification.")}</li>
              <li>• {t("Le flux est obligatoire et séquentiel. Toute erreur entraîne une pénalité.", "The flow is mandatory and sequential. Any error incurs a penalty.")}</li>
              <li>• {t("N'entrez dans ce mode que sur autorisation explicite de votre professeur.", "Only enter this mode with explicit authorization from your teacher.")}</li>
            </ul>
          </div>
        )}

        {/* Action Buttons */}
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
                ? "bg-[#2e7d32] hover:bg-[#1b5e20]"
                : "bg-[#0070f2] hover:bg-[#0058c7]"
            }`}
          >
            {startRun.isPending ? (
              <><div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> {t("Démarrage...", "Starting...")}</>
            ) : (
              <><Play size={13} /> {selectedMode === "demonstration" ? t("Démarrer la pratique guidée", "Start guided practice") : t("Démarrer l'évaluation officielle", "Start official evaluation")}</>
            )}
          </button>
        </div>
      </div>
    </FioriShell>
  );
}
