import { useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import {
  matchScenarioForModuleRoute,
  resolveRouteScenarioId,
  type ScenarioRef,
} from "../../../server/canonicalScenarios";

type ModuleRouteConfig = {
  moduleId: number;
  routeParam: number;
  scenarios: ScenarioRef[] | undefined;
  modulePath: string;
};

/**
 * Resolves /student/moduleN/scenario/:scenarioId/mode where param may be DB id, SCN number, or local index.
 */
export function useModuleScenarioRoute({
  moduleId,
  routeParam,
  scenarios,
  modulePath,
}: ModuleRouteConfig) {
  const [, navigate] = useLocation();

  const moduleRows = useMemo(
    () => (scenarios ?? []).filter((s) => s.moduleId === moduleId),
    [scenarios, moduleId]
  );

  const scenario = useMemo(
    () => matchScenarioForModuleRoute(moduleId, routeParam, moduleRows),
    [moduleId, routeParam, moduleRows]
  );

  const effectiveScenarioId =
    scenario?.id ?? resolveRouteScenarioId(moduleId, routeParam) ?? null;

  useEffect(() => {
    if (!scenario || routeParam === scenario.id) return;
    navigate(`${modulePath}/scenario/${scenario.id}/mode`, { replace: true });
  }, [scenario, routeParam, navigate, modulePath]);

  return { scenario, effectiveScenarioId, moduleRows };
}
