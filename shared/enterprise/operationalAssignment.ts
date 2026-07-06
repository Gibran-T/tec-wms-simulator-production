/** RC21-B.1 — EOAS presentation taxonomy (read-path only, no engine) */

import type { DepartmentCode, PriorityLevel } from "../enterpriseBriefing";
import { DEPARTMENT_LABELS, getScenarioBinding } from "./scenarioBinding";

export type OperationalAssignmentType = "mission";

export interface OperationalAssignmentMeta {
  assignmentType: OperationalAssignmentType;
  scnCode: string;
  missionTitle: string;
  department: DepartmentCode;
  priority: PriorityLevel;
  supervisorId: string;
}

/** Priority sort — highest urgency first (EOAS Today's Priorities) */
export const PRIORITY_SORT_ORDER: Record<PriorityLevel, number> = {
  critique: 0,
  pointe: 1,
  elevee: 2,
  normal: 3,
};

/** Department display order for Assignment Queue grouping */
export const DEPARTMENT_GROUP_ORDER: DepartmentCode[] = [
  "MGT",
  "OPS",
  "CS",
  "QA",
  "INV",
  "WH",
  "REC",
  "SHP",
  "PROC",
  "PLAN",
  "FIN",
];

export function comparePriority(a: PriorityLevel, b: PriorityLevel): number {
  return PRIORITY_SORT_ORDER[a] - PRIORITY_SORT_ORDER[b];
}

export function compareDepartment(a: DepartmentCode, b: DepartmentCode): number {
  const ia = DEPARTMENT_GROUP_ORDER.indexOf(a);
  const ib = DEPARTMENT_GROUP_ORDER.indexOf(b);
  return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
}

export function isUrgentPriority(priority: PriorityLevel): boolean {
  return priority === "critique" || priority === "elevee" || priority === "pointe";
}

export function resolveMissionTitle(
  scnCode: string,
  fallbackName: string,
  missionObjective?: string | null,
): string {
  if (missionObjective?.trim()) return missionObjective.trim();
  return fallbackName;
}

export function buildAssignmentMeta(
  scnCode: string,
  missionTitle: string,
): OperationalAssignmentMeta | undefined {
  const binding = getScenarioBinding(scnCode);
  if (!binding) return undefined;
  return {
    assignmentType: "mission",
    scnCode,
    missionTitle,
    department: binding.department,
    priority: binding.priority,
    supervisorId: binding.supervisorId,
  };
}

export function groupByDepartment<T extends { department: DepartmentCode; priority?: PriorityLevel }>(
  items: T[],
): Array<{ department: DepartmentCode; label: { fr: string; en: string }; items: T[] }> {
  const map = new Map<DepartmentCode, T[]>();
  for (const item of items) {
    const list = map.get(item.department) ?? [];
    list.push(item);
    map.set(item.department, list);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => compareDepartment(a, b))
    .map(([department, groupItems]) => ({
      department,
      label: DEPARTMENT_LABELS[department],
      items: [...groupItems].sort((x, y) =>
        x.priority && y.priority ? comparePriority(x.priority, y.priority) : 0,
      ),
    }));
}

export function groupByPriority<T extends { priority: PriorityLevel }>(
  items: T[],
): Array<{ priority: PriorityLevel; items: T[] }> {
  const map = new Map<PriorityLevel, T[]>();
  for (const item of items) {
    const list = map.get(item.priority) ?? [];
    list.push(item);
    map.set(item.priority, list);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => comparePriority(a, b))
    .map(([priority, groupItems]) => ({ priority, items: groupItems }));
}
