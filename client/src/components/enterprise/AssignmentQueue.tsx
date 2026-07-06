import { useState } from "react";
import { LayoutGrid, Layers } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import MissionBoard from "@/components/enterprise/MissionBoard";
import type { ScenarioRef } from "../../../../server/canonicalScenarios";

type AssignmentScenario = ScenarioRef & {
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

export type AssignmentQueueGroupBy = "department" | "priority";

interface AssignmentQueueProps {
  moduleId: number;
  moduleScenarios: AssignmentScenario[];
  rawModuleScenarios: AssignmentScenario[];
  myRuns: EnrichedRunRow[] | undefined;
  isLoading?: boolean;
  groupBy?: AssignmentQueueGroupBy;
  onStartScenario: (scenario: { id: number; name: string; difficulty?: string }) => void;
}

/** RC21-B.1 — EOAS Assignment Queue (reuses MissionBoard presentation). */
export default function AssignmentQueue({
  moduleId,
  moduleScenarios,
  rawModuleScenarios,
  myRuns,
  isLoading,
  groupBy: initialGroupBy = "department",
  onStartScenario,
}: AssignmentQueueProps) {
  const { t } = useLanguage();
  const [groupBy, setGroupBy] = useState<AssignmentQueueGroupBy>(initialGroupBy);

  const heading = t("File d'affectations opérationnelles", "Operational assignment queue");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-foreground">{heading}</h3>
        <div
          className="inline-flex rounded-md border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-slate-800/60"
          role="group"
          aria-label={t("Grouper par", "Group by")}
        >
          <button
            type="button"
            onClick={() => setGroupBy("department")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
              groupBy === "department"
                ? "bg-primary text-primary-foreground"
                : "text-slate-600 dark:text-slate-400 hover:text-foreground"
            }`}
          >
            <LayoutGrid size={14} />
            {t("Département", "Department")}
          </button>
          <button
            type="button"
            onClick={() => setGroupBy("priority")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
              groupBy === "priority"
                ? "bg-primary text-primary-foreground"
                : "text-slate-600 dark:text-slate-400 hover:text-foreground"
            }`}
          >
            <Layers size={14} />
            {t("Priorité", "Priority")}
          </button>
        </div>
      </div>

      <MissionBoard
        moduleId={moduleId}
        moduleScenarios={moduleScenarios}
        rawModuleScenarios={rawModuleScenarios}
        myRuns={myRuns}
        isLoading={isLoading}
        enterpriseStyled
        assignmentPresentation
        groupBy={groupBy}
        hideHeading
        onStartScenario={onStartScenario}
      />
    </div>
  );
}
