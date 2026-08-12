import { useMemo, useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import FioriShell from "@/components/FioriShell";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import OperationalFlowDisplay from "@/components/OperationalFlowDisplay";
import {
  AlertCircle, UserCircle, ChevronDown, ChevronUp, Info, CheckCircle2,
  Presentation, Target, RefreshCw, AlertTriangle,
} from "lucide-react";
import ModeSelectionScreen from "@/pages/student/ModeSelectionScreen";
import { useLanguage } from "@/contexts/LanguageContext";
import ModulePathwayNav from "@/components/ModulePathwayNav";
import MissionBoard from "@/components/enterprise/MissionBoard";
import {
  filterCanonicalScenariosForModule,
  findCompletedRunForScenario,
  resolveDisplayActiveRunForScenario,
} from "@/lib/scenarioCatalog";
import { resolveM5ModuleScenariosForActor } from "@/lib/m5DocEntry";
import { isEnterpriseExperienceEnabled, isEnterpriseAssignmentsEnabled } from "@/lib/enterpriseExperience";
import AssignmentQueue from "@/components/enterprise/AssignmentQueue";
import TodayPriorities from "@/components/enterprise/TodayPriorities";
import { useEmployeeProfile } from "@/hooks/useEmployeeProfile";
import { CAREER_CHAPTER_LABELS } from "@shared/enterprise/scenarioBinding";
import { getModuleConfig, MODULE_ACRONYMS } from "@/data/moduleConfig";
import { MODULE_PROGRESSION_COPY } from "@/data/moduleProgressionCopy";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import FormativeExerciseCard from "@/components/formative/FormativeExerciseCard";
import ErrorSchoolPanel from "@/components/pedagogy/ErrorSchoolPanel";
import MicroDrillPanel from "@/components/pedagogy/MicroDrillPanel";
import {
  getFormativeExercisesForModule,
  type FormativeExerciseStatus,
} from "@shared/formativeExercises";

export interface EnterpriseModuleHubProps {
  moduleId: number;
  /** Warning when prerequisite not met (amber alert) */
  prerequisiteAlert?: ReactNode;
  /** Show enterprise promotion banner when prior chapter completed */
  showPromotionBanner?: boolean;
  /** Reserved: must not be used for inter-module progression locks (M1–M5 are open). */
  missionsBlocked?: boolean;
  /** Override scenario loading error state */
  loadError?: boolean;
  loadTimedOut?: boolean;
  onRetryLoad?: () => void;
  isRetrying?: boolean;
}

export default function EnterpriseModuleHub({
  moduleId,
  prerequisiteAlert,
  showPromotionBanner = false,
  missionsBlocked = false,
  loadError = false,
  loadTimedOut = false,
  onRetryLoad,
  isRetrying = false,
}: EnterpriseModuleHubProps) {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const [showGlossary, setShowGlossary] = useState(false);
  const [editingStudentNum, setEditingStudentNum] = useState(false);
  const [studentNumInput, setStudentNumInput] = useState("");
  const [pendingScenario, setPendingScenario] = useState<{ id: number; name: string; difficulty?: string } | null>(null);

  const mod = getModuleConfig(moduleId);
  const ModIcon = mod.icon;
  const progression = MODULE_PROGRESSION_COPY[moduleId];
  const careerChapter = CAREER_CHAPTER_LABELS[moduleId];

  const { data: scenarios, isLoading, isError, isFetching, refetch } = trpc.scenarios.list.useQuery();
  const { data: m5DocAccess } = trpc.m5Doc.myAccess.useQuery(undefined, {
    enabled: moduleId === 5,
    retry: false,
  });
  const { data: myRuns } = trpc.runs.myRunsEnriched.useQuery();
  const { data: myProfile, refetch: refetchProfile } = trpc.profiles.mine.useQuery();
  const upsertProfile = trpc.profiles.upsert.useMutation({ onSuccess: () => refetchProfile() });
  const { data: quizBestAttempt } = trpc.quiz.getBestAttempt.useQuery(
    { moduleId },
    { enabled: !!moduleId },
  );
  const quizPassed = quizBestAttempt?.passed === true;
  const { data: employeeProfile } = useEmployeeProfile();
  const showFormative = moduleId === 4 || moduleId === 5;
  const { data: formativeAttempts } = trpc.formativeExercises.listMine.useQuery(
    { moduleId },
    { enabled: showFormative },
  );
  const formativeStatusById = useMemo(() => {
    const map = new Map<string, FormativeExerciseStatus>();
    for (const row of formativeAttempts ?? []) {
      map.set(row.exerciseId, row.status);
    }
    return map;
  }, [formativeAttempts]);
  const formativeExercises = useMemo(
    () => (showFormative ? getFormativeExercisesForModule(moduleId) : []),
    [showFormative, moduleId],
  );
  const prepExercise = formativeExercises.find((e) => e.kind === "preparation");
  const consExercise = formativeExercises.find((e) => e.kind === "consolidation");

  const rawModuleScenarios = useMemo(
    () => (scenarios ?? []).filter((s) => s.moduleId === moduleId),
    [scenarios, moduleId],
  );

  const moduleScenarios = useMemo(() => {
    if (moduleId === 5) {
      return resolveM5ModuleScenariosForActor(scenarios ?? [], {
        docFeatureEnabled: m5DocAccess?.featureEnabled === true,
        studentAllowlisted: m5DocAccess?.allowlisted === true,
      });
    }
    return filterCanonicalScenariosForModule(moduleId, scenarios ?? []);
  }, [scenarios, moduleId, m5DocAccess?.featureEnabled, m5DocAccess?.allowlisted]);

  const getActiveRun = (scenario: (typeof moduleScenarios)[number]) =>
    resolveDisplayActiveRunForScenario(scenario, rawModuleScenarios, myRuns);

  const getCompletedRun = (scenario: (typeof moduleScenarios)[number]) =>
    findCompletedRunForScenario(scenario, rawModuleScenarios, myRuns);

  const totalScenarios = moduleScenarios.length;
  const completedScenarios = useMemo(
    () => moduleScenarios.filter((s) => getCompletedRun(s)).length,
    [moduleScenarios, myRuns, rawModuleScenarios],
  );
  const inProgressScenarios = useMemo(
    () => moduleScenarios.filter((s) => getActiveRun(s) && !getCompletedRun(s)).length,
    [moduleScenarios, myRuns, rawModuleScenarios],
  );
  const avgScoreModule = useMemo(() => {
    const scores = moduleScenarios
      .map((s) => getCompletedRun(s)?.score)
      .filter((score): score is number => score != null);
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }, [moduleScenarios, myRuns, rawModuleScenarios]);

  const handleSaveStudentNum = () => {
    upsertProfile.mutate({ studentNumber: studentNumInput.trim() || null });
    setEditingStudentNum(false);
  };

  const handleStartScenario = (scenario: { id: number; name: string; difficulty?: string | null }) => {
    if (missionsBlocked) return;
    setPendingScenario({
      id: scenario.id,
      name: scenario.name,
      difficulty: scenario.difficulty ?? undefined,
    });
  };

  if (pendingScenario) {
    return (
      <ModeSelectionScreen
        scenarioId={pendingScenario.id}
        scenarioName={pendingScenario.name}
        scenarioDifficulty={pendingScenario.difficulty}
        moduleId={moduleId}
        onCancel={() => setPendingScenario(null)}
      />
    );
  }

  const enterpriseEnabled = isEnterpriseExperienceEnabled();
  const assignmentsEnabled = isEnterpriseAssignmentsEnabled() && enterpriseEnabled;
  const missionLabel = enterpriseEnabled ? t("Missions", "Missions") : t("Scénarios", "Scenarios");
  const shellTitle = assignmentsEnabled
    ? t("File d'affectations — Concorde Logistics", "Assignment queue — Concorde Logistics")
    : enterpriseEnabled
      ? t("Tableau de missions", "Mission Board")
      : missionLabel;

  if (loadError || loadTimedOut) {
    return (
      <FioriShell
        title={shellTitle}
        breadcrumbs={[
          { label: t("Concorde Logistics", "Concorde Logistics"), href: mod.route },
          { label: `M${moduleId}` },
        ]}
      >
        <div className="max-w-lg mx-auto py-16 px-4 text-center space-y-4">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h2 className="text-lg font-semibold text-foreground">
            {loadTimedOut && !loadError
              ? t("Chargement interrompu", "Loading timed out")
              : t("Impossible de charger les affectations", "Unable to load assignments")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t(
              "La file d'affectations n'a pas pu être récupérée. Vérifiez votre connexion, puis réessayez.",
              "The assignment queue could not be retrieved. Check your connection and try again.",
            )}
          </p>
          {onRetryLoad && (
            <Button onClick={onRetryLoad} disabled={isRetrying} className="gap-2">
              <RefreshCw className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`} />
              {t("Réessayer", "Retry")}
            </Button>
          )}
        </div>
      </FioriShell>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">
            {t("Chargement de votre affectation...", "Loading your assignment...")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <FioriShell
      title={shellTitle}
      breadcrumbs={[
        { label: t("Concorde Logistics", "Concorde Logistics"), href: "/student/department" },
        { label: enterpriseEnabled ? t("Missions", "Missions") : missionLabel, href: mod.route },
        { label: `M${moduleId}` },
      ]}
    >
      <div className="max-w-4xl mx-auto space-y-5">
        <ModulePathwayNav activeModuleId={moduleId} />

        {prerequisiteAlert}

        {showPromotionBanner && progression && (
          <Alert className={`${mod.border} ${mod.bg}`}>
            <CheckCircle2 className={`h-4 w-4 ${mod.text}`} />
            <AlertDescription className="text-foreground">
              <strong>{language === "FR" ? progression.promotionTitle.fr : progression.promotionTitle.en}</strong>
              {" — "}
              {language === "FR" ? progression.promotionBody.fr : progression.promotionBody.en}
            </AlertDescription>
          </Alert>
        )}

        <div className={`bg-card border ${mod.border} rounded-md p-4`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 ${mod.bg} rounded-full flex items-center justify-center shrink-0`}>
              <ModIcon size={20} className={mod.text} />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    {language === "FR" ? mod.titleFr : mod.titleEn}
                  </h2>
                  {enterpriseEnabled && careerChapter && (
                    <p className="text-xs font-semibold text-primary uppercase tracking-wide mt-0.5">
                      {language === "FR" ? careerChapter.fr : careerChapter.en}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {language === "FR" ? mod.descFr : mod.descEn}
                  </p>
                </div>
                <button
                  onClick={() => navigate(mod.slidesRoute)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold text-white shrink-0 hover:opacity-90 transition-opacity"
                  style={{ background: "#0f2a44" }}
                >
                  <Presentation size={14} />
                  {t(`Référence M${moduleId}`, `M${moduleId} Reference`)}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
              <p className="text-2xl font-bold text-primary">{totalScenarios}</p>
              <p className="text-xs text-muted-foreground">{missionLabel}</p>
            </div>
            <div className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
              <p className="text-2xl font-bold text-green-600">{completedScenarios}</p>
              <p className="text-xs text-muted-foreground">{t("Clôturées", "Closed")}</p>
            </div>
            <div className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
              <p className="text-2xl font-bold text-amber-600">{inProgressScenarios}</p>
              <p className="text-xs text-muted-foreground">{t("En cours", "In Progress")}</p>
            </div>
            <div className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
              <p className="text-2xl font-bold text-primary">
                {avgScoreModule}<span className="text-sm">/100</span>
              </p>
              <p className="text-xs text-muted-foreground">{t("Score moyen", "Avg. Score")}</p>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-semibold text-foreground mb-2">
              {t("Flux opérationnel", "Operational Flow")}
            </h4>
            <OperationalFlowDisplay steps={mod.steps} />
          </div>

          <div className="mt-4" data-testid="module-objectives-slot">
            <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <Target size={16} className={mod.text} />
              {t("Objectifs opérationnels", "Operational objectives")}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {mod.objectives.map((obj) => (
                <div key={obj.fr} className="flex items-start gap-2 p-2 rounded-md bg-slate-50 dark:bg-slate-800 text-sm">
                  <CheckCircle2 size={14} className={`${mod.text} mt-0.5 shrink-0`} />
                  <span>{language === "FR" ? obj.fr : obj.en}</span>
                </div>
              ))}
            </div>
          </div>

          {!quizPassed && user?.role === "student" && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-md flex items-center gap-3">
              <AlertCircle size={20} className="text-blue-600 dark:text-blue-400 shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  {t("Référence recommandée", "Recommended reference")}
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  {t(
                    "Consultez la fiche de poste et validez vos acquis avant de prendre vos affectations.",
                    "Review the role brief and validate your knowledge before taking assignments.",
                  )}
                </p>
              </div>
              <button
                onClick={() => navigate(`/student/quiz/${moduleId}`)}
                className="ml-auto px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
              >
                {t("Valider", "Validate")}
              </button>
            </div>
          )}

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
                      placeholder={t("Numéro d'employé", "Employee number")}
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
                    <span className="text-xs text-muted-foreground">{t("N° employé :", "Employee #:")}</span>
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

        {/* DOM order (M4/M5): objectifs → préparation → missions → consolidation → glossaire */}
        {showFormative && prepExercise && (
          <div data-testid="formative-prep-slot" data-formative-slot="preparation">
            <FormativeExerciseCard
              meta={prepExercise}
              status={formativeStatusById.get(prepExercise.id) ?? "not_started"}
              language={language}
              t={t}
              recommendAfterQuiz={!quizPassed}
            />
          </div>
        )}

        {moduleId >= 1 && moduleId <= 3 && (
          <div className="space-y-3" data-testid={`m${moduleId}-prep-pedagogy`}>
            <ErrorSchoolPanel moduleId={moduleId} t={t} language={language} />
            <MicroDrillPanel moduleId={moduleId} t={t} language={language} />
          </div>
        )}

        {missionsBlocked ? (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 text-sm">
              {progression
                ? (language === "FR" ? progression.prerequisiteNote.fr : progression.prerequisiteNote.en)
                : t("Affectations temporairement indisponibles.", "Assignments temporarily unavailable.")}
            </AlertDescription>
          </Alert>
        ) : assignmentsEnabled && employeeProfile ? (
          <>
            <TodayPriorities
              profile={employeeProfile}
              moduleId={moduleId}
              moduleScenarios={moduleScenarios}
              rawModuleScenarios={rawModuleScenarios}
              myRuns={myRuns}
              language={language}
              t={t}
              onStartScenario={(s) => handleStartScenario(s)}
            />
            <AssignmentQueue
              moduleId={moduleId}
              moduleScenarios={moduleScenarios}
              rawModuleScenarios={rawModuleScenarios}
              myRuns={myRuns}
              isLoading={isLoading}
              groupBy="department"
              onStartScenario={(s) => handleStartScenario(s)}
            />
          </>
        ) : (
          <MissionBoard
            moduleId={moduleId}
            moduleScenarios={moduleScenarios}
            rawModuleScenarios={rawModuleScenarios}
            myRuns={myRuns}
            isLoading={isLoading}
            enterpriseStyled={enterpriseEnabled}
            onStartScenario={(s) => handleStartScenario(s)}
          />
        )}

        {showFormative && consExercise && (
          <div data-testid="formative-cons-slot" data-formative-slot="consolidation">
            <FormativeExerciseCard
              meta={consExercise}
              status={formativeStatusById.get(consExercise.id) ?? "not_started"}
              language={language}
              t={t}
              recommendAfterMissions={completedScenarios < 3}
            />
          </div>
        )}

        <div className="mt-8" data-testid="module-glossary-slot">
          <button
            onClick={() => setShowGlossary(!showGlossary)}
            className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <Info size={16} /> {t("Glossaire opérationnel", "Operational glossary")}
            {showGlossary ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showGlossary && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {MODULE_ACRONYMS.map((item) => (
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
