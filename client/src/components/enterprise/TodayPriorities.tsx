import { useMemo } from "react";
import { AlertTriangle, CalendarClock } from "lucide-react";
import type { EmployeeProfilePayload } from "@shared/enterprise/employeeProfile";
import {
  findCompletedRunForScenario,
  resolveScenarioScnCode,
} from "@/lib/scenarioCatalog";
import type { ScenarioRef } from "../../../../server/canonicalScenarios";
import type { PriorityLevel } from "@shared/enterpriseBriefing";
import {
  buildAssignmentMeta,
  comparePriority,
  isUrgentPriority,
  resolveMissionTitle,
} from "@shared/enterprise/operationalAssignment";
import { DEPARTMENT_LABELS } from "@shared/enterprise/scenarioBinding";
import { getMissionForScenario } from "../../../../server/missionData";
import PriorityBadge from "@/components/enterprise/PriorityBadge";
import CurrentAssignmentCard from "@/components/enterprise/CurrentAssignmentCard";

type TodayScenario = ScenarioRef & {
  name: string;
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
}: TodayPrioritiesProps) {
  const urgentOpen = useMemo(() => {
    const items: Array<{
      scnCode: string;
      missionTitle: string;
      department: string;
      priority: PriorityLevel;
    }> = [];

    for (const scenario of moduleScenarios) {
      const scnCode = resolveScenarioScnCode(scenario);
      if (!scnCode) continue;
      const completed = findCompletedRunForScenario(scenario, rawModuleScenarios, myRuns);
      if (completed) continue;
      const meta = buildAssignmentMeta(scnCode, resolveTitle(scenario, moduleId));
      if (!meta || !isUrgentPriority(meta.priority)) continue;
      items.push({
        scnCode,
        missionTitle: meta.missionTitle,
        department: language === "FR" ? DEPARTMENT_LABELS[meta.department].fr : DEPARTMENT_LABELS[meta.department].en,
        priority: meta.priority,
      });
    }

    return items.sort((a, b) => comparePriority(a.priority, b.priority));
  }, [moduleScenarios, rawModuleScenarios, myRuns, moduleId, language]);

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

        <CurrentAssignmentCard
          assignment={profile.currentAssignment}
          language={language}
          t={t}
          assignmentPresentation
        />

        {urgentOpen.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-amber-600" />
              {t("Affectations urgentes en attente", "Urgent assignments pending")}
            </p>
            <ul className="space-y-2">
              {urgentOpen.slice(0, 5).map((item) => (
                <li
                  key={item.scnCode}
                  className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-md"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-snug">{item.missionTitle}</p>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">{item.scnCode}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-bold uppercase text-slate-500">{item.department}</span>
                    <PriorityBadge priority={item.priority} language={language} />
                  </div>
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
