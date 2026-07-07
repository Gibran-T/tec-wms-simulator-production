import { useMemo } from "react";
import { useLocation } from "wouter";
import EnterpriseModuleHub from "@/components/enterprise/EnterpriseModuleHub";

/** M1 hub — Concorde Logistics assignment queue (supports ?module=1..5 for pathway preview) */
export default function ScenarioList() {
  const [location] = useLocation();
  const moduleId = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const m = parseInt(params.get("module") ?? "1", 10);
    return [1, 2, 3, 4, 5].includes(m) ? m : 1;
  }, [location]);

  return <EnterpriseModuleHub moduleId={moduleId} showPromotionBanner={moduleId === 1} />;
}
