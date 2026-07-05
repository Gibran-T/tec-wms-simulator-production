import { trpc } from "@/lib/trpc";
import { isEnterpriseExperienceEnabled } from "@/lib/enterpriseExperience";

interface UseEnterpriseContextOptions {
  runId?: number;
  scnCode?: string;
  scenarioId?: number;
  enabled?: boolean;
}

/** RC21 — consumes enterpriseContext.assemble (read-only). */
export function useEnterpriseContext(options: UseEnterpriseContextOptions) {
  const enterpriseEnabled = isEnterpriseExperienceEnabled();
  const hasKey = !!(options.runId ?? options.scnCode ?? options.scenarioId);
  const enabled = (options.enabled ?? true) && enterpriseEnabled && hasKey;

  return trpc.enterpriseContext.assemble.useQuery(
    {
      runId: options.runId,
      scnCode: options.scnCode,
      scenarioId: options.scenarioId,
    },
    { enabled, staleTime: 30_000 }
  );
}
