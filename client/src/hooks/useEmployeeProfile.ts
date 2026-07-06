import { trpc } from "@/lib/trpc";
import { isConcordeConnectEnabled } from "@/lib/concordeConnect";

export function useEmployeeProfile() {
  const enabled = isConcordeConnectEnabled();

  return trpc.employeeProfile.assemble.useQuery(undefined, {
    enabled,
    staleTime: 30_000,
  });
}
