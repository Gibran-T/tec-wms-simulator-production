/**
 * Student entry routing for M5 DOC vs legacy mission board.
 */
import { isM5DocInitialState } from "@shared/m5Doc/types";
import { filterCanonicalScenariosForModule, type ScenarioRef } from "../../../server/canonicalScenarios";
import { getModuleScenarioPassThreshold } from "@shared/moduleThresholds";

export type M5EntryScenario = ScenarioRef & {
  name: string;
  difficulty?: string | null;
  descriptionFr?: string | null;
  descriptionEn?: string | null;
  initialStateJson?: unknown;
  targetScore?: number | null;
  isActive?: boolean;
};

export function isM5DocScenarioRow(scenario: { name?: string | null; initialStateJson?: unknown }): boolean {
  if (isM5DocInitialState(scenario.initialStateJson)) return true;
  return /SCN-015-DOC|supervision-doc-v1|M5-DOC/i.test(String(scenario.name ?? ""));
}

/** Prefer SCN-015-DOC as the single cumulative DOC entry point. */
export function pickM5DocEntryScenario<T extends M5EntryScenario>(rows: T[]): T | undefined {
  const docs = rows.filter((r) => r.moduleId === 5 && r.isActive !== false && isM5DocScenarioRow(r));
  if (docs.length === 0) return undefined;
  const entry =
    docs.find((r) => /SCN-015-DOC/i.test(String(r.name ?? ""))) ||
    docs.find((r) => (r.initialStateJson as { scnCode?: string } | null)?.scnCode === "SCN-015-DOC") ||
    docs[0];
  return {
    ...entry,
    name: "M5 DOC — Superviseur d'exploitation — quart de clôture",
    descriptionFr:
      "Parcours cumulatif : Pré-M5 → SCN-015-DOC → SCN-016-DOC → SCN-017-DOC → handover (31 interactions). Evidence m5-session-v2.",
    descriptionEn:
      "Cumulative path: Pré-M5 → SCN-015-DOC → SCN-016-DOC → SCN-017-DOC → handover (31 interactions). Evidence m5-session-v2.",
    targetScore: getModuleScenarioPassThreshold(5),
  };
}

/**
 * Allowlisted DOC students see one cumulative DOC mission.
 * Everyone else keeps the legacy SCN-015/016/017 board.
 */
export function resolveM5ModuleScenariosForActor<T extends M5EntryScenario>(
  rows: T[],
  opts: { docFeatureEnabled: boolean; studentAllowlisted: boolean },
): T[] {
  if (opts.docFeatureEnabled && opts.studentAllowlisted) {
    const entry = pickM5DocEntryScenario(rows);
    if (entry) return [entry];
  }
  return filterCanonicalScenariosForModule(5, rows).map((s) => ({
    ...s,
    targetScore: s.targetScore ?? getModuleScenarioPassThreshold(5),
  })) as T[];
}
