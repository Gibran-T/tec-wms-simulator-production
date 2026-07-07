import { useMemo } from "react";
import { useLocation } from "wouter";
import {
  Play, MonitorPlay, CheckCircle, BarChart2, Clock, Target, FileText, ClipboardList, RotateCcw,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  findCompletedRunForScenario,
  resolveDisplayActiveRunForScenario,
  resolveMissionPrimaryAction,
  resolveScenarioScnCode,
} from "@/lib/scenarioCatalog";
import type { ScenarioRef } from "../../../../server/canonicalScenarios";
import { DEPARTMENT_LABELS, getScenarioBinding } from "@shared/enterprise/scenarioBinding";
import {
  buildAssignmentMeta,
  groupByDepartment,
  groupByPriority,
  resolveMissionTitle,
  type OperationalAssignmentMeta,
} from "@shared/enterprise/operationalAssignment";
import { getDepartmentCssClass } from "@shared/enterprise/departmentNavigation";
import { getCharacterById } from "@shared/enterprise/characters";
import { getMissionForScenario } from "../../../../server/missionData";
import PriorityBadge from "@/components/enterprise/PriorityBadge";
import DepartmentBadge from "@/components/enterprise/DepartmentBadge";

const DIFF_CONFIG: Record<string, { labelFr: string; labelEn: string; bg: string; text: string }> = {
  facile: { labelFr: "Facile", labelEn: "Easy", bg: "bg-emerald-100 dark:bg-emerald-900/40", text: "text-emerald-800 dark:text-emerald-300" },
  moyen: { labelFr: "Moyen", labelEn: "Medium", bg: "bg-amber-100 dark:bg-amber-900/40", text: "text-amber-800 dark:text-amber-300" },
  difficile: { labelFr: "Difficile", labelEn: "Hard", bg: "bg-red-100 dark:bg-red-900/40", text: "text-red-800 dark:text-red-300" },
};

const SCENARIO_DURATION: Record<number, number> = {
  1: 15, 2: 20, 3: 20, 4: 25, 5: 30,
  6: 20, 7: 25, 8: 25, 9: 30, 10: 35,
  11: 20, 12: 25, 13: 30, 14: 35, 15: 40,
  16: 25, 17: 30,
};

type MissionBoardScenario = ScenarioRef & {
  name: string;
  difficulty?: string | null;
  descriptionFr?: string | null;
  descriptionEn?: string | null;
  targetScore?: number | null;
};

type EnrichedRunRow = {
  run: { id: number; scenarioId: number; status: string; isDemo: boolean; score?: number | null };
  score?: number | null;
};

type AssignmentGroupBy = "none" | "department" | "priority";

interface MissionBoardProps {
  moduleId: number;
  moduleScenarios: MissionBoardScenario[];
  rawModuleScenarios: MissionBoardScenario[];
  myRuns: EnrichedRunRow[] | undefined;
  isLoading?: boolean;
  enterpriseStyled?: boolean;
  /** RC21-B.1 — EOAS assignment card layout (mission title primary, SCN metadata) */
  assignmentPresentation?: boolean;
  /** RC21-B.1 — group assignment cards by department or priority */
  groupBy?: AssignmentGroupBy;
  title?: string;
  /** RC21-C.1A — parent renders heading (Assignment Queue toolbar) */
  hideHeading?: boolean;
  onStartScenario: (scenario: { id: number; name: string; difficulty?: string }) => void;
}

function resolveScenarioMissionTitle(scenario: MissionBoardScenario, moduleId: number): string {
  const mission = getMissionForScenario({
    id: scenario.id,
    moduleId,
    name: scenario.name,
    descriptionFr: scenario.descriptionFr,
  });
  const objective = mission?.enterprise?.mission ?? mission?.objective ?? null;
  const scnCode = resolveScenarioScnCode(scenario) ?? "";
  return resolveMissionTitle(scnCode, scenario.name, objective);
}

interface ScenarioCardContext {
  scenario: MissionBoardScenario;
  scnCode: string | null;
  completedRun: EnrichedRunRow | undefined;
  activeRun: EnrichedRunRow | undefined;
  assignmentMeta: OperationalAssignmentMeta | undefined;
  missionTitle: string;
}

export default function MissionBoard({
  moduleId,
  moduleScenarios,
  rawModuleScenarios,
  myRuns,
  isLoading,
  enterpriseStyled = false,
  assignmentPresentation = false,
  groupBy = "none",
  title,
  hideHeading = false,
  onStartScenario,
}: MissionBoardProps) {
  const [, navigate] = useLocation();
  const { t, language } = useLanguage();

  const getActiveRun = (scenario: MissionBoardScenario) =>
    resolveDisplayActiveRunForScenario(scenario, rawModuleScenarios, myRuns) as EnrichedRunRow | undefined;

  const getCompletedRun = (scenario: MissionBoardScenario) =>
    findCompletedRunForScenario(scenario, rawModuleScenarios, myRuns) as EnrichedRunRow | undefined;

  const heading =
    title ??
    (assignmentPresentation
      ? t("File d'affectations opérationnelles", "Operational assignment queue")
      : enterpriseStyled
        ? t("Missions ouvertes", "Open assignments")
        : t("Affectations du chapitre", "Chapter assignments"));

  const scenarioCards: ScenarioCardContext[] = useMemo(
    () =>
      moduleScenarios.map((scenario) => {
        const scnCode = resolveScenarioScnCode(scenario);
        const completedRun = getCompletedRun(scenario);
        const activeRun = getActiveRun(scenario);
        const missionTitle = resolveScenarioMissionTitle(scenario, moduleId);
        const assignmentMeta =
          scnCode && assignmentPresentation ? buildAssignmentMeta(scnCode, missionTitle) : undefined;
        return { scenario, scnCode, completedRun, activeRun, assignmentMeta, missionTitle };
      }),
    [moduleScenarios, rawModuleScenarios, myRuns, moduleId, assignmentPresentation],
  );

  const renderCard = ({
    scenario,
    scnCode,
    completedRun,
    activeRun,
    assignmentMeta,
    missionTitle,
  }: ScenarioCardContext) => {
    const primaryAction = resolveMissionPrimaryAction(activeRun, completedRun);
    const binding = scnCode && enterpriseStyled ? getScenarioBinding(scnCode) : undefined;
    const boardCardClass = enterpriseStyled || assignmentPresentation
      ? `tec-mission-board-card tec-assignment-card tec-mission-board-card--m${moduleId}`
      : "";
    const supervisor = assignmentMeta ? getCharacterById(assignmentMeta.supervisorId) : undefined;

    if (assignmentPresentation && assignmentMeta) {
      const deptClass = getDepartmentCssClass(assignmentMeta.department);
      const priorityClass = `tec-assignment-card--${assignmentMeta.priority}`;
      const supervisorName = supervisor
        ? language === "FR"
          ? supervisor.titleFr
          : supervisor.titleEn
        : null;

      return (
        <div
          key={scnCode ?? scenario.id}
          className={`bg-card border rounded-lg p-4 flex flex-col justify-between hover:shadow-lg transition-shadow ${boardCardClass} ${deptClass} ${priorityClass}`}
        >
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <PriorityBadge priority={assignmentMeta.priority} language={language} />
              <DepartmentBadge
                department={assignmentMeta.department}
                label={
                  language === "FR"
                    ? DEPARTMENT_LABELS[assignmentMeta.department].fr
                    : DEPARTMENT_LABELS[assignmentMeta.department].en
                }
              />
              {activeRun && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                  <MonitorPlay size={11} className="mr-1" /> {t("En cours", "In Progress")}
                </span>
              )}
              {completedRun && !activeRun && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  <CheckCircle size={11} className="mr-1" /> {t("Terminé", "Completed")}
                </span>
              )}
            </div>

            <h4 className="text-base font-bold text-foreground leading-snug mb-1">{missionTitle}</h4>
            {scnCode && (
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">{scnCode}</p>
            )}

            {supervisor && (
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                <span className="font-semibold text-foreground">{supervisor.name}</span>
                {supervisorName ? ` — ${supervisorName}` : ""}
              </p>
            )}

            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {language === "FR" ? (scenario.descriptionFr ?? "") : (scenario.descriptionEn ?? "")}
            </p>

            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
              <span className="inline-flex items-center gap-1">
                <Clock size={13} />
                {SCENARIO_DURATION[scnCode ? parseInt(scnCode.replace("SCN-", ""), 10) : scenario.id]}{" "}
                {t("min", "min")}
              </span>
              <span className="inline-flex items-center gap-1">
                <Target size={13} />
                {scenario.targetScore ?? 60}% {t("cible", "target")}
              </span>
              {completedRun && completedRun.score != null && (
                <span className="inline-flex items-center gap-1 text-blue-700 dark:text-blue-300 font-medium">
                  <BarChart2 size={13} />
                  {completedRun.score}/100
                </span>
              )}
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            {primaryAction === "continue" && activeRun ? (
              <button
                onClick={() => navigate(`/student/run/${activeRun.run.id}`)}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
              >
                <Play size={16} className="inline mr-2" /> {t("Continuer la mission", "Continue mission")}
              </button>
            ) : primaryAction === "replay" ? (
              <button
                onClick={() =>
                  onStartScenario({
                    id: scenario.id,
                    name: scenario.name,
                    difficulty: scenario.difficulty ?? undefined,
                  })
                }
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
              >
                <RotateCcw size={16} className="inline mr-2" /> {t("Refaire la mission", "Replay mission")}
              </button>
            ) : (
              <button
                onClick={() =>
                  onStartScenario({
                    id: scenario.id,
                    name: scenario.name,
                    difficulty: scenario.difficulty ?? undefined,
                  })
                }
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
              >
                <ClipboardList size={16} className="inline mr-2" /> {t("Commencer la mission", "Start mission")}
              </button>
            )}
            {completedRun && (
              <button
                onClick={() => navigate(`/student/run/${completedRun.run.id}/report`)}
                className="px-4 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-md hover:bg-secondary/90 transition-colors"
              >
                <FileText size={16} className="inline mr-2" /> {t("Résultat", "Result")}
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        key={scnCode ?? scenario.id}
        className={`bg-card border rounded-lg p-4 flex flex-col justify-between hover:shadow-lg transition-shadow ${boardCardClass}`}
      >
        <div>
          <div className="flex items-center justify-between mb-2 gap-2">
            <div className="min-w-0">
              {scnCode && (
                <span className="inline-flex items-center gap-2 flex-wrap">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded mb-1">
                    {scnCode}
                  </span>
                  {binding && (
                    <>
                      <PriorityBadge priority={binding.priority} language={language} className="mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 mb-1">
                        {language === "FR"
                          ? DEPARTMENT_LABELS[binding.department].fr
                          : DEPARTMENT_LABELS[binding.department].en}
                      </span>
                    </>
                  )}
                </span>
              )}
              <h4 className="font-semibold text-foreground truncate">{scenario.name}</h4>
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${DIFF_CONFIG[scenario.difficulty ?? "moyen"]?.bg} ${DIFF_CONFIG[scenario.difficulty ?? "moyen"]?.text}`}>
              {language === "FR" ? DIFF_CONFIG[scenario.difficulty ?? "moyen"]?.labelFr : DIFF_CONFIG[scenario.difficulty ?? "moyen"]?.labelEn}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {language === "FR" ? (scenario.descriptionFr ?? "") : (scenario.descriptionEn ?? "")}
          </p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <Clock size={14} />
            <span>
              {SCENARIO_DURATION[scnCode ? parseInt(scnCode.replace("SCN-", ""), 10) : scenario.id]}{" "}
              {t("min", "min")}
            </span>
            <Target size={14} className="ml-4" />
            <span>{scenario.targetScore ?? 60}% {t("cible", "target")}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {activeRun && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                <MonitorPlay size={12} className="mr-1" /> {t("En cours", "In Progress")}
              </span>
            )}
            {completedRun && !activeRun && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                <CheckCircle size={12} className="mr-1" /> {t("Terminé", "Completed")}
              </span>
            )}
            {completedRun && completedRun.score != null && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                <BarChart2 size={12} className="mr-1" />{" "}
                {enterpriseStyled ? t("Résultat:", "Outcome:") : t("Score:", "Score:")}{" "}
                {completedRun.score}/100
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          {primaryAction === "continue" && activeRun ? (
            <button
              onClick={() => navigate(`/student/run/${activeRun.run.id}`)}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
            >
              <Play size={16} className="inline mr-2" /> {t("Continuer la mission", "Continue mission")}
            </button>
          ) : primaryAction === "replay" ? (
            <button
              onClick={() =>
                onStartScenario({
                  id: scenario.id,
                  name: scenario.name,
                  difficulty: scenario.difficulty ?? undefined,
                })
              }
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
            >
              <RotateCcw size={16} className="inline mr-2" /> {t("Refaire la mission", "Replay mission")}
            </button>
          ) : (
            <button
              onClick={() =>
                onStartScenario({
                  id: scenario.id,
                  name: scenario.name,
                  difficulty: scenario.difficulty ?? undefined,
                })
              }
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
            >
              <Play size={16} className="inline mr-2" /> {t("Commencer la mission", "Start mission")}
            </button>
          )}
          {completedRun && (
            <button
              onClick={() => navigate(`/student/run/${completedRun.run.id}/report`)}
              className="px-4 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-md hover:bg-secondary/90 transition-colors"
            >
              <FileText size={16} className="inline mr-2" /> {t("Résultat", "Result")}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderGrid = (cards: ScenarioCardContext[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map(renderCard)}
    </div>
  );

  const groupedContent = useMemo(() => {
    if (!assignmentPresentation || groupBy === "none") return null;

    const withMeta = scenarioCards.filter((c) => c.assignmentMeta);
    if (withMeta.length === 0) return null;

    if (groupBy === "department") {
      const groups = groupByDepartment(
        withMeta.map((c) => ({ ...c, department: c.assignmentMeta!.department, priority: c.assignmentMeta!.priority })),
      );
      return groups.map((group) => (
        <div key={group.department} className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
            <DepartmentBadge
              department={group.department}
              label={language === "FR" ? group.label.fr : group.label.en}
              size="md"
            />
            <span className="text-xs font-mono text-slate-400">
              {group.items.length} {t("affectation(s)", "assignment(s)")}
            </span>
          </div>
          {renderGrid(group.items)}
        </div>
      ));
    }

    const groups = groupByPriority(
      withMeta.map((c) => ({ ...c, priority: c.assignmentMeta!.priority })),
    );
    return groups.map((group) => (
      <div key={group.priority} className="space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
          <PriorityBadge priority={group.priority} language={language} size="md" />
          <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
            {t("Priorité du jour", "Today's priority level")}
          </span>
          <span className="text-xs font-mono text-slate-400 ml-auto">
            {group.items.length} {t("affectation(s)", "assignment(s)")}
          </span>
        </div>
        {renderGrid(group.items)}
      </div>
    ));
  }, [scenarioCards, assignmentPresentation, groupBy, language, t]);

  return (
    <div className="space-y-4">
      {!hideHeading && (
        <h3 className="text-lg font-bold text-foreground">
          {heading}
          {!assignmentPresentation && ` ${moduleId}`}
        </h3>
      )}
      {moduleScenarios.length === 0 && !isLoading ? (
        <p className="text-muted-foreground italic">
          {t("Aucune affectation disponible pour ce chapitre.", "No assignments available for this chapter.")}
        </p>
      ) : groupedContent ? (
        <div className="space-y-8">{groupedContent}</div>
      ) : (
        renderGrid(scenarioCards)
      )}
    </div>
  );
}
