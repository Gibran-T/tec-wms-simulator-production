import type { MissionData } from "../../server/missionData";
import type { EnterpriseBriefingFields } from "../enterpriseBriefing";
import { getCharacterById } from "./characters";
import { CUSTOMER_REGISTRY, SUPPLIER_REGISTRY } from "./stakeholders";
import { getScenarioBinding } from "./scenarioBinding";

export type MissionWithEnterprise = MissionData & {
  enterprise?: EnterpriseBriefingFields;
};

function buildDocuments(mission: MissionData): { fr: string; en: string }[] {
  const docs: { fr: string; en: string }[] = [];
  if (mission.technicalSpecs.expectedTransaction) {
    docs.push({
      fr: `Transaction attendue : ${mission.technicalSpecs.expectedTransaction}`,
      en: `Expected transaction: ${mission.technicalSpecs.expectedTransaction}`,
    });
  }
  docs.push({
    fr: `Moniteur WMS · SKU ${mission.technicalSpecs.sku}`,
    en: `WMS monitor · SKU ${mission.technicalSpecs.sku}`,
  });
  if (mission.wmsFunction) {
    docs.push({ fr: `Fonction WMS : ${mission.wmsFunction}`, en: `WMS function: ${mission.wmsFunction}` });
  }
  return docs;
}

function buildBusinessContext(mission: MissionData): { fr: string; en: string } {
  if (mission.industryRelevance) {
    return {
      fr: mission.industryRelevance,
      en: mission.industryRelevance,
    };
  }
  return {
    fr: "Cette mission impacte la promesse client et la fiabilité des données de stock au CDC.",
    en: "This mission impacts customer promise and stock data reliability at the CDC.",
  };
}

function buildPeopleInvolved(supervisorName: string, customerName?: string): { fr: string; en: string } {
  const partsFr = [supervisorName];
  const partsEn = [supervisorName];
  if (customerName) {
    partsFr.push(`Équipe ${customerName}`);
    partsEn.push(`${customerName} team`);
  }
  return {
    fr: partsFr.join(" · "),
    en: partsEn.join(" · "),
  };
}

/** Attach enterprise briefing fields from Universe Part XII binding + existing mission content. */
export function enrichMissionWithEnterprise(mission: MissionData): MissionWithEnterprise {
  const scnCode = mission.scnCode;
  const binding = getScenarioBinding(scnCode);
  if (!binding) {
    return mission;
  }

  const supervisor = getCharacterById(binding.supervisorId);
  const customer = binding.customerCode ? CUSTOMER_REGISTRY[binding.customerCode] ?? null : null;
  const supplier = binding.supplierCode ? SUPPLIER_REGISTRY[binding.supplierCode] ?? null : null;

  const enterprise: EnterpriseBriefingFields = {
    situation: mission.context,
    mission: mission.objective,
    businessContext: buildBusinessContext(mission),
    peopleInvolved: buildPeopleInvolved(supervisor?.name ?? "Superviseur", customer?.name),
    customer,
    supplier,
    priority: binding.priority,
    expectedBusinessOutcome: mission.expectedOutcome,
    kpis: mission.successCriteria ?? [],
    documentsAvailable: buildDocuments(mission),
    supervisor,
    supervisorNotesAttributed: mission.supervisorNotes
      ? {
          fr: mission.supervisorNotes,
          en: mission.supervisorNotes,
        }
      : undefined,
    successCriteria: mission.successCriteria,
    department: binding.department,
    businessUnit: binding.businessUnit,
    incidentId: binding.incidentId,
    warehouseZone: binding.warehouseZone,
  };

  return { ...mission, enterprise };
}

