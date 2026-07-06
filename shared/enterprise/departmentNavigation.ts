/** RC21-B.3 — Department-first navigation helpers (read-path only, no new models).
 *  Department colors: single source in tec-enterprise.css (--tec-dept-* CSS vars). */

import type { DepartmentCode } from "../enterpriseBriefing";
import {
  DEPARTMENT_LABELS,
  getScenarioBinding,
} from "./scenarioBinding";
import { MODULE_HOME_DEPARTMENT } from "./employeeProfile";
import {
  comparePriority,
  groupByPriority,
  type OperationalAssignmentMeta,
  buildAssignmentMeta,
} from "./operationalAssignment";

/** Maps department code to TEDS CSS class (colors live in tec-enterprise.css). */
export function getDepartmentCssClass(code: DepartmentCode): string {
  return `tec-dept--${code.toLowerCase()}`;
}

/** Departments present in a module's official SCN list */
export function resolveDepartmentsForModule(
  officialScnCodes: string[],
): DepartmentCode[] {
  const seen = new Set<DepartmentCode>();
  const result: DepartmentCode[] = [];
  for (const scn of officialScnCodes) {
    const dept = getScenarioBinding(scn)?.department;
    if (dept && !seen.has(dept)) {
      seen.add(dept);
      result.push(dept);
    }
  }
  return result;
}

/** Student home department — from profile.department (scenarioBinding when SCN active; MODULE_HOME_DEPARTMENT fallback otherwise) */
export function resolveHomeDepartmentCode(
  departmentCode: DepartmentCode,
): DepartmentCode {
  return departmentCode;
}

/** FALLBACK ONLY — module home department when no assignment SCN is active. */
export function resolveModuleHomeDepartment(moduleId: number): DepartmentCode {
  return MODULE_HOME_DEPARTMENT[moduleId] ?? "WH";
}

export interface DepartmentQueueItem {
  scnCode: string;
  meta: OperationalAssignmentMeta;
}

export function buildDepartmentQueueItems(
  scnCodes: string[],
  missionTitles: Record<string, string>,
): DepartmentQueueItem[] {
  const items: DepartmentQueueItem[] = [];
  for (const scnCode of scnCodes) {
    const title = missionTitles[scnCode] ?? scnCode;
    const meta = buildAssignmentMeta(scnCode, title);
    if (meta) items.push({ scnCode, meta });
  }
  return items.sort((a, b) => comparePriority(a.meta.priority, b.meta.priority));
}

export function groupQueueByPriority(items: DepartmentQueueItem[]) {
  return groupByPriority(
    items.map((item) => ({ ...item, priority: item.meta.priority })),
  );
}

export function filterQueueByDepartment(
  items: DepartmentQueueItem[],
  department: DepartmentCode,
): DepartmentQueueItem[] {
  return items.filter((item) => item.meta.department === department);
}

export function getDepartmentLabel(
  code: DepartmentCode,
  language: "FR" | "EN",
): string {
  const label = DEPARTMENT_LABELS[code];
  return language === "FR" ? label.fr : label.en;
}
