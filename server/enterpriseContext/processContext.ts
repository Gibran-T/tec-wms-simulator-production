import type { ContextBlock, ProcessContextBlock } from "../../shared/enterpriseContext/types";
import { buildProcessContext as buildProcessContextData } from "../../shared/enterprise/buildProcessContext";

export function buildProcessContext(
  scnCode: string,
  activeStepCode: string | null,
): ContextBlock<ProcessContextBlock> {
  return {
    blockId: "process",
    sensitivity: "low",
    data: buildProcessContextData(scnCode, activeStepCode),
  };
}
