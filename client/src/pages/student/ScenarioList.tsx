import FioriShell from "@/components/FioriShell";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useState, useMemo } from "react";
import OperationalFlowDisplay from "@/components/OperationalFlowDisplay";
import {
  BookOpen, Play, ChevronRight, AlertCircle, UserCircle, CheckCircle,
  Pencil, MonitorPlay, Presentation, Lock, Clock, Target, Info,
  ChevronDown, ChevronUp, BarChart2, Layers, TrendingUp, FileText,
} from "lucide-react";
import ModeSelectionScreen from "./ModeSelectionScreen";
import { useLanguage } from "@/contexts/LanguageContext";

// ── Module metadata ──────────────────────────────────────────────────────────
const MODULE_CONFIG = [
  // Operational flow steps for each module
  // PO -> GR -> STOCK -> SO -> GI -> CC -> COMPLIANCE
  // M1: PO, GR, STOCK, SO, GI, CC, COMPLIANCE
  // M2: GR, PUTAWAY, BIN CAPACITY, FIFO, INVENTAIRE
  // M3: CYCLE COUNT, VARIANCE, AJUSTEMENT, RÉAPPRO, VALIDATION
  // M4: KPI CALCUL, ROTATION, TAUX SERVICE, LEAD TIME, DIAGNOSTIC
  // M5: RÉCEPTION, RANGEMENT, INVENTAIRE, RÉAPPRO, KPI, DÉCISION

  {
    id: 1,
    icon: BookOpen,
    color: "#0070f2",
    bg: "bg-[#e8f0fe]",
    text: "text-[#0070f2]",
    border: "border-[#0070f2]/30",
    accentBg: "bg-[#0070f2]",
    titleFr: "Fondements de la chaîne logistique et intégration ERP/WMS",
    titleEn: "Supply Chain Foundations & ERP/WMS Integration",
    descFr: "Maîtrisez le cycle complet PO→GR→Stock→SO→GI→Cycle Count→Conformité",
    descEn: "Master the complete cycle PO→GR→Stock→SO→GI→Cycle Count→Compliance",
    durationH: 4,
    passThreshold: 60,
    route: "/student/scenarios",
    slidesRoute: "/student/slides/1",
    steps: ["PO", "GR", "STOCK", "SO", "GI", "CC", "COMPLIANCE"],
    objectives: [
      { fr: "Comprendre les flux logistiques PO→GR→SO→GI", en: "Understand logistics flows PO→GR→SO→GI" },
      { fr: "Maîtriser la création de commandes dans le WMS", en: "Master order creation in the WMS" },
      { fr: "Valider les réceptions et gérer les stocks", en: "Validate receipts and manage inventory" },
      { fr: "Effectuer un Cycle Count et finaliser la conformité", en: "Perform a Cycle Count and finalize compliance" },
    ],
  },
  {
    id: 2,
    icon: Layers,
    color: "#2563eb",
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-300",
    accentBg: "bg-blue-600",
    titleFr: "Exécution d'entrepôt et gestion des emplacements",
    titleEn: "Warehouse Execution & Location Management",
    descFr: "Rangement structuré · Capacité bin · FIFO · Précision inventaire",
    descEn: "Structured putaway · Bin capacity · FIFO · Inventory accuracy",
    durationH: 5,
    passThreshold: 60,
    route: "/student/module2",
    slidesRoute: "/student/slides/2",
    steps: ["RÉCEPTION", "PUTAWAY", "BIN CAPACITY", "FIFO", "INVENTAIRE"],
    objectives: [
      { fr: "Exécuter un rangement structuré depuis le quai", en: "Execute structured putaway from the dock" },
      { fr: "Valider les limites de capacité par emplacement", en: "Validate bin capacity limits" },
      { fr: "Respecter la règle FIFO (premier entré, premier sorti)", en: "Apply FIFO rule (first in, first out)" },
      { fr: "Contrôler la précision de l'inventaire système vs physique", en: "Control system vs physical inventory accuracy" },
    ],
  },
  {
    id: 3,
    icon: TrendingUp,
    color: "#059669",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-300",
    accentBg: "bg-emerald-600",
    titleFr: "Contrôle des stocks et réapprovisionnement",
    titleEn: "Inventory Control & Replenishment",
    descFr: "Inventaire cyclique · Écarts · Ajustements · Min/Max · Stock de sécurité",
    descEn: "Cycle counting · Variances · Adjustments · Min/Max · Safety stock",
    durationH: 5,
    passThreshold: 70,
    route: "/student/module3",
    slidesRoute: "/student/slides/3",
    steps: ["CYCLE COUNT", "VARIANCE", "AJUSTEMENT", "RÉAPPRO", "VALIDATION"],
    objectives: [
      { fr: "Réaliser un inventaire cyclique complet", en: "Perform a complete cycle count" },
      { fr: "Analyser et justifier les écarts de stock", en: "Analyze and justify stock variances" },
      { fr: "Générer des suggestions de réapprovisionnement", en: "Generate replenishment suggestions" },
      { fr: "Valider les ajustements avec l'enseignant", en: "Validate adjustments with the teacher" },
    ],
  },
  {
    id: 4,
    icon: BarChart2,
    color: "#d97706",
    bg: "bg-orange-50",
    text: "text-orange-600",
    border: "border-orange-300",
    accentBg: "bg-orange-600",
    titleFr: "Indicateurs de performance logistique",
    titleEn: "Logistics Performance Indicators",
    descFr: "Rotation · Taux de service · Taux d'erreur · Lead time · Diagnostic KPI",
    descEn: "Turnover · Service rate · Error rate · Lead time · KPI diagnostics",
    durationH: 5,
    passThreshold: 70,
    route: "/student/module4",
    slidesRoute: "/student/slides/4",
    steps: ["KPI CALCUL", "ROTATION", "TAUX SERVICE", "LEAD TIME", "DIAGNOSTIC"],
    objectives: [
      { fr: "Calculer les KPI logistiques clés (OTIF, Fill Rate, DSI)", en: "Calculate key logistics KPIs (OTIF, Fill Rate, DSI)" },
      { fr: "Analyser la rotation des stocks et le lead time", en: "Analyze stock turnover and lead time" },
      { fr: "Identifier les causes racines des écarts de performance", en: "Identify root causes of performance gaps" },
      { fr: "Proposer des actions correctives basées sur les données", en: "Propose data-driven corrective actions" },
    ],
  },
  {
    id: 5,
    icon: FileText,
    color: "#7b1fa2",
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-300",
    accentBg: "bg-purple-600",
    titleFr: "Simulation opérationnelle intégrée",
    titleEn: "Integrated Operational Simulation",
    descFr: "Réception · Rangement FIFO · Inventaire · Réapprovisionnement · KPI · Décision",
    descEn: "Reception · FIFO putaway · Inventory · Replenishment · KPI · Decision",
    durationH: 6,
    passThreshold: 70,
    route: "/student/module5",
    slidesRoute: "/student/slides/5",
    steps: ["RÉCEPTION", "RANGEMENT", "INVENTAIRE", "RÉAPPRO", "KPI", "DÉCISION"],
    objectives: [
      { fr: "Exécuter un cycle complet de bout en bout", en: "Execute a complete end-to-end cycle" },
      { fr: "Gérer des situations de crise (rupture, erreur, retard)", en: "Manage crisis situations (stockout, error, delay)" },
      { fr: "Analyser les KPI en temps réel et prendre des décisions", en: "Analyze real-time KPIs and make decisions" },
      { fr: "Démontrer la maîtrise globale du système WMS", en: "Demonstrate overall WMS system mastery" },
    ],
  },
];

// ── Acronym glossary ─────────────────────────────────────────────────────────
const ACRONYMS = [
  { code: "PO", fr: "Purchase Order — Bon de commande fournisseur", en: "Purchase Order — Supplier order document" },
  { code: "GR", fr: "Goods Receipt — Réception de marchandises", en: "Goods Receipt — Receiving goods into the system" },
  { code: "SO", fr: "Sales Order — Commande client", en: "Sales Order — Customer order document" },
  { code: "GI", fr: "Goods Issue — Sortie de stock", en: "Goods Issue — Issuing goods from stock" },
  { code: "CC", fr: "Cycle Count — Inventaire cyclique", en: "Cycle Count — Periodic physical inventory check" },
  { code: "FIFO", fr: "First In, First Out — Premier entré, premier sorti", en: "First In, First Out — oldest stock leaves first" },
  { code: "KPI", fr: "Key Performance Indicator — Indicateur clé de performance", en: "Key Performance Indicator — performance metric" },
  { code: "WMS", fr: "Warehouse Management System — Système de gestion d'entrepôt", en: "Warehouse Management System — warehouse software" },
  { code: "ERP", fr: "Enterprise Resource Planning — Progiciel de gestion intégré", en: "Enterprise Resource Planning — integrated business software" },
];

// ── Difficulty config ────────────────────────────────────────────────────────
const DIFF_CONFIG: Record<string, { labelFr: string; labelEn: string; bg: string; text: string; border: string }> = {
  facile:    { labelFr: "Facile",    labelEn: "Easy",   bg: "bg-emerald-100 dark:bg-emerald-900/40", text: "text-emerald-800 dark:text-emerald-300", border: "border-emerald-300 dark:border-emerald-700" },
  moyen:     { labelFr: "Moyen",     labelEn: "Medium", bg: "bg-amber-100 dark:bg-amber-900/40",     text: "text-amber-800 dark:text-amber-300",     border: "border-amber-300 dark:border-amber-700" },
  difficile: { labelFr: "Difficile", labelEn: "Hard",   bg: "bg-red-100 dark:bg-red-900/40",         text: "text-red-800 dark:text-red-300",         border: "border-red-300 dark:border-red-700" },
};

// ── Estimated duration per scenario (minutes) ────────────────────────────────
const SCENARIO_DURATION: Record<number, number> = {
  1: 15, 2: 20, 3: 20, 4: 25, 5: 30,
  6: 20, 7: 25, 8: 25, 9: 30, 10: 35,
  11: 20, 12: 25, 13: 30, 14: 35, 15: 40,
  16: 25, 17: 30,
};

export default function ScenarioList() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const isTeacherOrAdmin = user?.role === "teacher" || user?.role === "admin";

  const [selectedModule, setSelectedModule] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const m = parseInt(params.get("module") ?? "1", 10);
    return [1, 2, 3, 4, 5].includes(m) ? m : 1;
  });
  const [showGlossary, setShowGlossary] = useState(false);
  const [editingStudentNum, setEditingStudentNum] = useState(false);
  const [studentNumInput, setStudentNumInput] = useState("");
  const [pendingScenario, setPendingScenario] = useState<{ id: number; name: string; difficulty?: string } | null>(null);

  const { data: scenarios, isLoading } = trpc.scenarios.list.useQuery();
  const { data: myRuns } = trpc.runs.myRunsEnriched.useQuery();
  const { data: myProfile, refetch: refetchProfile } = trpc.profiles.mine.useQuery();
  const upsertProfile = trpc.profiles.upsert.useMutation({ onSuccess: () => refetchProfile() });
  // Quiz gate: fetch best attempt for the currently selected module
  const { data: quizBestAttempt } = trpc.quiz.getBestAttempt.useQuery(
    { moduleId: selectedModule },
    { enabled: !!selectedModule }
  );
  const quizPassed = quizBestAttempt?.passed === true;

  const mod = MODULE_CONFIG.find((m) => m.id === selectedModule)!;
  const ModIcon = mod.icon;

    const moduleScenarios = useMemo(() => (scenarios ?? []).filter((s) => s.moduleId === selectedModule), [scenarios, selectedModule]);

  const currentModuleConfig = useMemo(() => MODULE_CONFIG.find((m) => m.id === selectedModule)!, [selectedModule]);

  const moduleRuns = useMemo(() => myRuns?.filter(r => r.run.moduleId === selectedModule) || [], [myRuns, selectedModule]);

  const totalScenarios = moduleScenarios.length;
  const completedScenarios = moduleRuns.filter(r => r.run.status === "completed").length;
  const inProgressScenarios = moduleRuns.filter(r => r.run.status === "in_progress").length;
  const avgScoreModule = useMemo(() => {
    const scoredRuns = moduleRuns.filter(r => r.run.score !== null && r.run.score !== undefined);
    if (scoredRuns.length === 0) return 0;
    return Math.round(scoredRuns.reduce((sum, r) => sum + (r.run.score ?? 0), 0) / scoredRuns.length);
  }, [moduleRuns]);

  const isModuleCompleted = completedScenarios === totalScenarios && totalScenarios > 0;



  const getActiveRun = (scenarioId: number) =>
    myRuns?.find((r) => r.run.scenarioId === scenarioId && r.run.status === "in_progress" && !r.run.isDemo);

  const getCompletedRun = (scenarioId: number) =>
    myRuns?.find((r) => r.run.scenarioId === scenarioId && r.run.status === "completed" && !r.run.isDemo);

  const handleSaveStudentNum = () => {
    upsertProfile.mutate({ studentNumber: studentNumInput.trim() || null });
    setEditingStudentNum(false);
  };

  if (pendingScenario) {
    return (
      <ModeSelectionScreen
        scenarioId={pendingScenario.id}
        scenarioName={pendingScenario.name}
        scenarioDifficulty={pendingScenario.difficulty}
        onCancel={() => setPendingScenario(null)}
      />
    );
  }

  return (
    <FioriShell
      title={t("Mes Scénarios", "My Scenarios")}
      breadcrumbs={[{ label: t("Accueil", "Home"), href: "/" }, { label: t("Scénarios", "Scenarios") }]}
    >
      <div className="max-w-4xl mx-auto space-y-5">

        {/* ── Module Overview Card ────────────────────────────────────────── */}
        <div className={`bg-card border ${mod.border} rounded-md p-4 mb-5`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 ${mod.bg} rounded-full flex items-center justify-center shrink-0`}>
              <ModIcon size={20} className={mod.text} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">{language === "FR" ? mod.titleFr : mod.titleEn}</h2>
              <p className="text-sm text-muted-foreground">{language === "FR" ? mod.descFr : mod.descEn}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
              <p className="text-2xl font-bold text-primary">{totalScenarios}</p>
              <p className="text-xs text-muted-foreground">{t("Scénarios", "Scenarios")}</p>
            </div>
            <div className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
              <p className="text-2xl font-bold text-green-600">{completedScenarios}</p>
              <p className="text-xs text-muted-foreground">{t("Terminés", "Completed")}</p>
            </div>
            <div className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
              <p className="text-2xl font-bold text-amber-600">{inProgressScenarios}</p>
              <p className="text-xs text-muted-foreground">{t("En cours", "In Progress")}</p>
            </div>
            <div className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
              <p className="text-2xl font-bold text-primary">{avgScoreModule}<span className="text-sm">/100</span></p>
              <p className="text-xs text-muted-foreground">{t("Score Moyen", "Avg. Score")}</p>
            </div>
          </div>

          {/* Operational Flow Display */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-foreground mb-2">{t("Flux Opérationnel", "Operational Flow")}</h4>
            <OperationalFlowDisplay steps={currentModuleConfig.steps} />
          </div>

          {/* Quiz Gate */}
          {!quizPassed && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-md flex items-center gap-3">
              <AlertCircle size={20} className="text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">{t("Quiz Pré-requis", "Prerequisite Quiz")}</p>
                <p className="text-xs text-amber-700 dark:text-amber-300">{t("Vous devez réussir le quiz de ce module avant de pouvoir démarrer les scénarios.", "You must pass this module's quiz before starting scenarios.")}</p>
              </div>
              <button
                onClick={() => navigate(`/student/quiz/${selectedModule}`)}
                className="ml-auto px-3 py-1 bg-amber-600 text-white text-xs rounded-md hover:bg-amber-700 transition-colors"
              >
                {t("Commencer le Quiz", "Start Quiz")}
              </button>
            </div>
          )}

          {/* Student Number Input */}
          {user?.role === "student" && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-md flex items-center gap-3">
              <UserCircle size={20} className="text-blue-600 dark:text-blue-400 shrink-0" />
              <div className="flex-1">
                {editingStudentNum ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={studentNumInput}
                      onChange={(e) => setStudentNumInput(e.target.value)}
                      placeholder={t("Entrez votre numéro étudiant", "Enter your student number")}
                      className="flex-1 px-2 py-1 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      onClick={handleSaveStudentNum}
                      className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded-md hover:bg-primary/90 transition-colors"
                    >
                      {t("Sauvegarder", "Save")}
                    </button>
                    <button onClick={() => setEditingStudentNum(false)} className="text-xs text-muted-foreground hover:text-foreground px-2 py-1">
                      {t("Annuler", "Cancel")}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-xs text-muted-foreground">{t("N° étudiant :", "Student #:")}</span>
                    {myProfile?.studentNumber ? (
                      <span className="text-xs font-bold text-green-600 dark:text-green-400 font-mono">{myProfile.studentNumber}</span>
                    ) : (
                      <span className="text-xs text-amber-600 dark:text-amber-400 italic">{t("Non défini", "Not set")}</span>
                    )}
                    <button onClick={() => setEditingStudentNum(true)} className="text-xs text-primary hover:underline ml-auto">
                      {t("Modifier", "Edit")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Scenario List ────────────────────────────────────────────────── */} 
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground">{t("Scénarios du Module", "Module Scenarios")}</h3>
          {moduleScenarios.length === 0 && !isLoading ? (
            <p className="text-muted-foreground italic">{t("Aucun scénario disponible pour ce module.", "No scenarios available for this module.")}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {moduleScenarios.map((scenario) => {
                const activeRun = getActiveRun(scenario.id);
                const completedRun = getCompletedRun(scenario.id);
                const isLocked = !quizPassed && user?.role === "student";

                return (
                  <div
                    key={scenario.id}
                    className={`bg-card border rounded-lg p-4 flex flex-col justify-between ${isLocked ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg transition-shadow"}`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-foreground">{scenario.name}</h4>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${DIFF_CONFIG[scenario.difficulty]?.bg} ${DIFF_CONFIG[scenario.difficulty]?.text}`}>
                          {language === "FR" ? DIFF_CONFIG[scenario.difficulty]?.labelFr : DIFF_CONFIG[scenario.difficulty]?.labelEn}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{language === "FR" ? scenario.descriptionFr : scenario.descriptionEn}</p>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <Clock size={14} />
                        <span>{SCENARIO_DURATION[scenario.id]} {t("min", "min")}</span>
                        <Target size={14} className="ml-4" />
                        <span>{scenario.targetScore}% {t("cible", "target")}</span>
                      </div>

                      {/* Status Badges */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {activeRun && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                            <MonitorPlay size={12} className="mr-1" /> {t("En cours", "In Progress")}
                          </span>
                        )}
                        {completedRun && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            <CheckCircle size={12} className="mr-1" /> {t("Terminé", "Completed")}
                          </span>
                        )}
                        {completedRun && completedRun.run.score !== null && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            <BarChart2 size={12} className="mr-1" /> {t("Score:", "Score:")} {completedRun.run.score}/100
                          </span>
                        )}
                        {isLocked && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                            <Lock size={12} className="mr-1" /> {t("Verrouillé", "Locked")}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex gap-2">
                      {isLocked ? (
                        <button
                          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md cursor-not-allowed"
                          disabled
                        >
                          <Lock size={16} className="inline mr-2" /> {t("Verrouillé", "Locked")}
                        </button>
                      ) : (
                        <>
                          {activeRun ? (
                            <button
                              onClick={() => navigate(`/student/run/${activeRun.run.id}`)}
                              className="flex-1 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
                            >
                              <Play size={16} className="inline mr-2" /> {t("Continuer", "Continue")}
                            </button>
                          ) : (
                            <button
                              onClick={() => setPendingScenario({ id: scenario.id, name: scenario.name, difficulty: scenario.difficulty })}
                              className="flex-1 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
                            >
                              <Play size={16} className="inline mr-2" /> {t("Démarrer", "Start")}
                            </button>
                          )}
                          {completedRun && (
                            <button
                              onClick={() => navigate(`/student/report/${completedRun.run.id}`)}
                              className="px-4 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-md hover:bg-secondary/90 transition-colors"
                            >
                              <FileText size={16} className="inline mr-2" /> {t("Rapport", "Report")}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Glossary ───────────────────────────────────────────────────────── */}
        <div className="mt-8">
          <button
            onClick={() => setShowGlossary(!showGlossary)}
            className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <Info size={16} /> {t("Afficher le glossaire des acronymes", "Show acronym glossary")}
            {showGlossary ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showGlossary && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {ACRONYMS.map((item) => (
                <div key={item.code} className="bg-card p-3 rounded-md border">
                  <p className="font-semibold text-foreground">{item.code}</p>
                  <p className="text-muted-foreground">{language === "FR" ? item.fr : item.en}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </FioriShell>
  );
}
