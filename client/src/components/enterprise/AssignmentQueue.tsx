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
  groupBy = "department",
  onStartScenario,
}: AssignmentQueueProps) {
  return (
    <MissionBoard
      moduleId={moduleId}
      moduleScenarios={moduleScenarios}
      rawModuleScenarios={rawModuleScenarios}
      myRuns={myRuns}
      isLoading={isLoading}
      enterpriseStyled
      assignmentPresentation
      groupBy={groupBy}
      onStartScenario={onStartScenario}
    />
  );
}
