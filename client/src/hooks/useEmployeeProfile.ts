import { trpc } from "@/lib/trpc";
import { isConcordeConnectEnabled } from "@/lib/concordeConnect";
import { isEnterpriseAssignmentsEnabled } from "@/lib/enterpriseExperience";

export function useEmployeeProfile() {
  const enabled = isConcordeConnectEnabled() || isEnterpriseAssignmentsEnabled();

  return trpc.employeeProfile.assemble.useQuery(undefined, {
    enabled,
    staleTime: 30_000,
  });
}
