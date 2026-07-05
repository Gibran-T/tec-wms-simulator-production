import type { MissionWithEnterprise } from "../missionData";
import { getScenarioBinding } from "../../shared/enterprise/scenarioBinding";
import { getCharacterById } from "../../shared/enterprise/characters";
import type { ContextBlock, ScenarioContextBlock } from "../../shared/enterpriseContext/types";

export function buildScenarioContext(
  scnCode: string,
  moduleId: number,
  mission: MissionWithEnterprise | null,
): ContextBlock<ScenarioContextBlock> {
  const binding = getScenarioBinding(scnCode);
  const summary = mission?.objective ?? mission?.context ?? "";
  return {
    blockId: "scenario",
    sensitivity: "low",
    data: {
      scnCode,
      moduleId,
      department: binding?.department ?? "WH",
      businessProblem: { fr: summary, en: summary },
      primarySupervisorId: binding?.supervisorId ?? "marc-andre-tremblay",
      priority: binding?.priority ?? "normal",
    },
  };
}

export function buildProfessionalRoleContext(
  mission: MissionWithEnterprise | null,
  scnCode: string,
) {
  const binding = getScenarioBinding(scnCode);
  const supervisor = mission?.enterprise?.supervisor ?? getCharacterById(binding?.supervisorId ?? "");
  return {
    roleTitle: mission?.role ?? "Gestionnaire de Stocks",
    department: binding?.department ?? "WH",
    supervisorName: supervisor?.name ?? "Superviseur",
    authorityBoundaries: [
      "Observe monitor and cockpit evidence",
      "Post transactions through Mission Control only",
      "Validate compliance independently",
    ],
  };
}
