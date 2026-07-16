import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import EnterpriseModuleHub from "@/components/enterprise/EnterpriseModuleHub";

export default function Module4Dashboard() {
  const { isLoading, isError, isFetching, refetch } = trpc.scenarios.list.useQuery();

  const [loadTimedOut, setLoadTimedOut] = useState(false);
  useEffect(() => {
    if (!isLoading) {
      setLoadTimedOut(false);
      return;
    }
    const timer = window.setTimeout(() => setLoadTimedOut(true), 15000);
    return () => window.clearTimeout(timer);
  }, [isLoading]);

  return (
    <EnterpriseModuleHub
      moduleId={4}
      showPromotionBanner
      loadError={isError}
      loadTimedOut={loadTimedOut && !isError}
      onRetryLoad={() => {
        setLoadTimedOut(false);
        void refetch();
      }}
      isRetrying={isFetching}
    />
  );
}
