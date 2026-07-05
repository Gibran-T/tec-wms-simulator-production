import type { ProcessCardSummary } from "../enterpriseContext/types";
import {
  getProcessById,
  getProcessFamilyForScn,
  getProcessForStep,
  PROCESS_REGISTRY,
} from "./processes";

export interface ProcessContextData {
  activeProcessId: string | null;
  processFamily: string[];
  cards: ProcessCardSummary[];
}

function toCardSummary(processId: string, activeProcessId: string | null): ProcessCardSummary | null {
  const def = getProcessById(processId);
  if (!def) return null;
  return {
    processId: def.processId,
    titleFr: def.titleFr,
    titleEn: def.titleEn,
    wmsAnchor: def.wmsAnchor,
    learningTransferFr: def.learningTransferFr,
    learningTransferEn: def.learningTransferEn,
    isActiveForStep: processId === activeProcessId,
  };
}

/** Process Mapping preview cards — Manifesto Part IX (display only, no engine impact). */
export function buildProcessContext(
  scnCode: string,
  activeStepCode: string | null,
): ProcessContextData {
  const activeProcessId = getProcessForStep(activeStepCode);
  const family = getProcessFamilyForScn(scnCode);

  const cards = family
    .map((id) => toCardSummary(id, activeProcessId))
    .filter((c): c is ProcessCardSummary => c !== null);

  if (activeProcessId && !family.includes(activeProcessId)) {
    const extra = toCardSummary(activeProcessId, activeProcessId);
    if (extra) cards.unshift(extra);
  }

  return {
    activeProcessId,
    processFamily: family.length > 0 ? family : Object.keys(PROCESS_REGISTRY).slice(0, 3),
    cards,
  };
}
