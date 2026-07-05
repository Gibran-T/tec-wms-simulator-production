import type { MissionWithEnterprise } from "../missionData";
import type { ContextBlock, MissionContextBlock } from "../../shared/enterpriseContext/types";

export function buildMissionContext(
  mission: MissionWithEnterprise | null,
): ContextBlock<MissionContextBlock> {
  const ent = mission?.enterprise;
  const situation = ent?.situation ?? mission?.context ?? "";
  const missionText = ent?.mission ?? mission?.objective ?? "";
  const businessContext = ent?.businessContext ?? {
    fr: mission?.industryRelevance ?? mission?.context ?? "",
    en: mission?.industryRelevance ?? mission?.context ?? "",
  };
  const expectedOutcome = ent?.expectedBusinessOutcome ?? mission?.expectedOutcome ?? "";

  return {
    blockId: "mission",
    sensitivity: "low",
    data: {
      situation: { fr: situation, en: situation },
      role: mission?.role ?? "",
      mission: { fr: missionText, en: missionText },
      businessContext,
      expectedOutcome: { fr: expectedOutcome, en: expectedOutcome },
      successCriteria: ent?.successCriteria ?? mission?.successCriteria ?? [],
      supervisor: ent?.supervisor
        ? {
            name: ent.supervisor.name,
            titleFr: ent.supervisor.titleFr,
            titleEn: ent.supervisor.titleEn,
          }
        : null,
      kpis: ent?.kpis ?? [],
    },
  };
}
