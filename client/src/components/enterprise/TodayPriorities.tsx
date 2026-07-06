import { useMemo } from "react";
import { useLocation } from "wouter";
import { AlertTriangle, CalendarClock, ChevronRight, Play } from "lucide-react";
import type { EmployeeProfilePayload } from "@shared/enterprise/employeeProfile";
import {
  findActiveRunForScenario,
  findCompletedRunForScenario,
  resolveScenarioScnCode,
} from "@/lib/scenarioCatalog";
import type { ScenarioRef } from "../../../../server/canonicalScenarios";
import type { PriorityLevel, DepartmentCode } from "@shared/enterpriseBriefing";
import {
  buildAssignmentMeta,
  comparePriority,
  isUrgentPriority,
  resolveMissionTitle,
} from "@shared/enterprise/operationalAssignment";
import { DEPARTMENT_LABELS } from "@shared/enterprise/scenarioBinding";
import { getMissionForScenario } from "../../../../server/missionData";
import PriorityBadge from "@/components/enterprise/PriorityBadge";
import DepartmentBadge from "@/components/enterprise/DepartmentBadge";
import CurrentAssignmentCard from "@/components/enterprise/CurrentAssignmentCard";
import CareerChapterPanel from "@/components/enterprise/CareerChapterPanel";

type TodayScenario = ScenarioRef & {
  name: string;
  difficulty?: string | null;
  descriptionFr?: string | null;
  descriptionEn?: string | null;
};

type EnrichedRunRow = {
  run: { id: number; scenarioId: number; status: string; isDemo: boolean; score?: number | null };
  score?: number | null;
};

interface TodayPrioritiesProps {
  profile: EmployeeProfilePayload;
  moduleId: number;
  moduleScenarios: TodayScenario[];
  rawModuleScenarios: TodayScenario[];
  myRuns: EnrichedRunRow[] | undefined;
  language: "FR" | "EN";
  t: (fr: string, en: string) => string;
  onStartScenario?: (scenario: { id: number; name: string; difficulty?: string }) => void;
}

function resolveTitle(scenario: TodayScenario, moduleId: number): string {
  const mission = getMissionForScenario({ id: scenario.id, moduleId, name: scenario.name });
  const objective = mission?.enterprise?.mission ?? mission?.objective ?? null;
  const scnCode = resolveScenarioScnCode(scenario) ?? "";
  return resolveMissionTitle(scnCode, scenario.name, objective);
}

export default function TodayPriorities({
  profile,
  moduleId,
  moduleScenarios,
  rawModuleScenarios,
  myRuns,
  language,
  t,
  onStartScenario,
}: TodayPrioritiesProps) {
  const [, navigate] = useLocation();

  const urgentOpen = useMemo(() => {
    const items: Array<{
      scenario: TodayScenario;
      scnCode: string;
      missionTitle: string;
      department: string;
      departmentCode: DepartmentCode;
      priority: PriorityLevel;
      activeRunId: number | null;
    }> = [];

    for (const scenario of moduleScenarios) {
      const scnCode = resolveScenarioScnCode(scenario);
      if (!scnCode) continue;
      const completed = findCompletedRunForScenario(scenario, rawModuleScenarios, myRuns);
      if (completed) continue;
      const meta = buildAssignmentMeta(scnCode, resolveTitle(scenario, moduleId));
      if (!meta || !isUrgentPriority(meta.priority)) continue;
      const activeRun = findActiveRunForScenario(scenario, rawModuleScenarios, myRuns);
      items.push({
        scenario,
        scnCode,
        missionTitle: meta.missionTitle,
        department: language === "FR" ? DEPARTMENT_LABELS[meta.department].fr : DEPARTMENT_LABELS[meta.department].en,
        departmentCode: meta.department,
        priority: meta.priority,
        activeRunId: activeRun?.run.id ?? null,
      });
    }

    return items.sort((a, b) => comparePriority(a.priority, b.priority));
  }, [moduleScenarios, rawModuleScenarios, myRuns, moduleId, language]);

  const handleUrgentAction = (item: (typeof urgentOpen)[number]) => {
    if (item.activeRunId) {
      navigate(`/student/run/${item.activeRunId}`);
      return;
    }
    onStartScenario?.({
      id: item.scenario.id,
      name: item.scenario.name,
      difficulty: item.scenario.difficulty ?? undefined,
    });
  };

  return (
    <section className="tec-today-priorities space-y-4">
      <div className="tec-briefing-panel p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-950/40 rounded-md shrink-0">
            <CalendarClock size={22} className="text-amber-700 dark:text-amber-300" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
              {t("Priorités du jour — CDC", "Today's priorities — CDC")}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              {t(
                "Concorde Logistics attend vos affectations selon l'urgence opérationnelle et votre département.",
                "Concorde Logistics expects your assignments by operational urgency and department."
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CareerChapterPanel profile={profile} language={language} t={t} variant="compact" />
          <CurrentAssignmentCard
            assignment={profile.currentAssignment}
            language={language}
            t={t}
            assignmentPresentation
            embedded
          />
        </div>

        {urgentOpen.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-amber-600" />
              {t("Affectations urgentes en attente", "Urgent assignments pending")}
              <span className="text-[10px] font-mono font-normal normal-case text-slate-400">
                ({urgentOpen.length})
              </span>
            </p>
            <ul className="space-y-2">
              {urgentOpen.slice(0, 5).map((item) => (
                <li key={item.scnCode}>
                  <button
                    type="button"
                    onClick={() => handleUrgentAction(item)}
                    className="tec-eoas-urgent-row w-full flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-md text-left hover:border-primary/40 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors group"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground leading-snug">{item.missionTitle}</p>
                      <p className="text-[10px] font-mono text-slate-400 mt-0.5">{item.scnCode}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <DepartmentBadge department={item.departmentCode} label={item.department} />
                      <PriorityBadge priority={item.priority} language={language} />
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary sm:opacity-80 group-hover:opacity-100">
                        {item.activeRunId ? (
                          <>
                            <Play size={12} />
                            {t("Reprendre", "Resume")}
                          </>
                        ) : (
                          <>
                            {t("Accepter", "Accept")}
                            <ChevronRight size={14} />
                          </>
                        )}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            {t(
              "Aucune affectation urgente — consultez la file d'affectations ci-dessous.",
              "No urgent assignments — see the assignment queue below."
            )}
          </p>
        )}
      </div>
    </section>
  );
}
