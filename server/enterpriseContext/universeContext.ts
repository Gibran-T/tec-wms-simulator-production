import type { ContextBlock, UniverseContextBlock } from "../../shared/enterpriseContext/types";
import { getScenarioBinding } from "../../shared/enterprise/scenarioBinding";
import { CUSTOMER_REGISTRY, SUPPLIER_REGISTRY } from "../../shared/enterprise/stakeholders";
import { getIncidentById } from "../../shared/enterprise/incidents";

const CDC_FACILITY = {
  fr: "Centre de distribution Concorde (CDC) — Saint-Laurent, QC",
  en: "Concorde Distribution Centre (CDC) — Saint-Laurent, QC",
};

export function buildUniverseContext(scnCode: string): ContextBlock<UniverseContextBlock> {
  const binding = getScenarioBinding(scnCode);
  const customer = binding?.customerCode ? CUSTOMER_REGISTRY[binding.customerCode] : null;
  const supplier = binding?.supplierCode ? SUPPLIER_REGISTRY[binding.supplierCode] : null;
  const incident = binding?.incidentId ? getIncidentById(binding.incidentId) : null;

  return {
    blockId: "universe",
    sensitivity: "low",
    data: {
      facility: CDC_FACILITY,
      warehouseZone: binding?.warehouseZone ?? "CDC",
      customer: customer ? { code: customer.code, name: customer.name } : null,
      supplier: supplier ? { code: supplier.code, name: supplier.name } : null,
      incident: incident
        ? {
            id: incident.id,
            nameFr: incident.nameFr,
            nameEn: incident.nameEn,
            severity: incident.severity,
          }
        : null,
    },
  };
}
