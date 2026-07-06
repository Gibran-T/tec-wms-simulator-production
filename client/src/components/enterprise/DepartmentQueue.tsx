import AssignmentQueue from "@/components/enterprise/AssignmentQueue";
import type { ScenarioRef } from "../../../../server/canonicalScenarios";
import type { DepartmentCode } from "@shared/enterpriseBriefing";
import { useLanguage } from "@/contexts/LanguageContext";
import { getDepartmentLabel } from "@shared/enterprise/departmentNavigation";
import { resolveScenarioScnCode } from "@/lib/scenarioCatalog";
import { getScenarioBinding } from "@shared/enterprise/scenarioBinding";
import DepartmentBadge from "@/components/enterprise/DepartmentBadge";

type QueueScenario = ScenarioRef & {
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

interface DepartmentQueueProps {
  moduleId: number;
  homeDepartment: DepartmentCode;
  moduleScenarios: QueueScenario[];
  rawModuleScenarios: QueueScenario[];
  myRuns: EnrichedRunRow[] | undefined;
  isLoading?: boolean;
  /** Show all chapter assignments or only home-department missions */
  scope?: "chapter" | "home";
  onStartScenario: (scenario: { id: number; name: string; difficulty?: string }) => void;
}

/** RC21-B.3 — Department-scoped assignment queue (reuses AssignmentQueue + priority grouping) */
export default function DepartmentQueue({
  moduleId,
  homeDepartment,
  moduleScenarios,
  rawModuleScenarios,
  myRuns,
  isLoading,
  scope = "chapter",
  onStartScenario,
}: DepartmentQueueProps) {
  const { t, language } = useLanguage();
  const lang = language === "FR" ? "FR" : "EN";

  const filteredScenarios =
    scope === "home"
      ? moduleScenarios.filter((scenario) => {
          const scn = resolveScenarioScnCode(scenario);
          return scn ? getScenarioBinding(scn)?.department === homeDepartment : false;
        })
      : moduleScenarios;

  const filteredRaw =
    scope === "home"
      ? rawModuleScenarios.filter((scenario) => {
          const scn = resolveScenarioScnCode(scenario);
          return scn ? getScenarioBinding(scn)?.department === homeDepartment : false;
        })
      : rawModuleScenarios;

  const deptLabel = getDepartmentLabel(homeDepartment, lang);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <DepartmentBadge department={homeDepartment} label={deptLabel} size="md" />
        <h3 className="text-lg font-bold text-foreground">
          {scope === "home"
            ? t("File d'affectations — département", "Assignment queue — department")
            : t("File d'affectations — chapitre actif", "Assignment queue — active chapter")}
        </h3>
      </div>
      <p className="text-xs text-muted-foreground">
        {t(
          "Affectations regroupées par priorité opérationnelle — département d'identité :",
          "Assignments grouped by operational priority — identity department:"
        )}{" "}
        <span className="font-semibold">{deptLabel}</span>
      </p>
      <AssignmentQueue
        moduleId={moduleId}
        moduleScenarios={filteredScenarios}
        rawModuleScenarios={filteredRaw}
        myRuns={myRuns}
        isLoading={isLoading}
        groupBy="priority"
        onStartScenario={onStartScenario}
      />
    </div>
  );
}
