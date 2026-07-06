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
  const ts = mission.technicalSpecs;
  if (ts.poRef) {
    docs.push({ fr: `PO : ${ts.poRef}`, en: `PO: ${ts.poRef}` });
  }
  if (ts.grRef) {
    docs.push({ fr: `GR : ${ts.grRef}`, en: `GR: ${ts.grRef}` });
  }
  if (ts.soRef) {
    docs.push({ fr: `SO : ${ts.soRef}`, en: `SO: ${ts.soRef}` });
  }
  if (ts.lotNumber) {
    docs.push({ fr: `Lot : ${ts.lotNumber}`, en: `Lot: ${ts.lotNumber}` });
  }
  if (ts.shipQuantity != null) {
    docs.push({ fr: `Quantité expédition : ${ts.shipQuantity} u.`, en: `Ship quantity: ${ts.shipQuantity} u.` });
  }
  if (ts.correctivePoQuantity != null) {
    docs.push({
      fr: `PO corrective : ${ts.correctivePoRef ?? "—"} · +${ts.correctivePoQuantity} u.`,
      en: `Corrective PO: ${ts.correctivePoRef ?? "—"} · +${ts.correctivePoQuantity} u.`,
    });
  }
  if (ts.replenishMin != null && ts.replenishMax != null) {
    docs.push({
      fr: `Réappro Min ${ts.replenishMin} / Max ${ts.replenishMax} / SS ${ts.replenishSafetyStock ?? "—"}`,
      en: `Replenish Min ${ts.replenishMin} / Max ${ts.replenishMax} / SS ${ts.replenishSafetyStock ?? "—"}`,
    });
  }
  if (ts.expectedTransaction) {
    docs.push({
      fr: `Transaction attendue : ${ts.expectedTransaction}`,
      en: `Expected transaction: ${ts.expectedTransaction}`,
    });
  }
  docs.push({
    fr: `Moniteur WMS · SKU ${ts.sku}`,
    en: `WMS monitor · SKU ${ts.sku}`,
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

