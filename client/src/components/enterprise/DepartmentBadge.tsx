import type { DepartmentCode } from "@shared/enterpriseBriefing";
import { getDepartmentCssClass } from "@shared/enterprise/departmentNavigation";

interface DepartmentBadgeProps {
  department: DepartmentCode;
  label: string;
  size?: "sm" | "md";
  className?: string;
}

/** RC21-B.3 — Reusable department badge (extracted from EnterpriseHeader inline span) */
export default function DepartmentBadge({
  department,
  label,
  size = "sm",
  className = "",
}: DepartmentBadgeProps) {
  const deptClass = getDepartmentCssClass(department);
  const sizeClass =
    size === "md"
      ? "text-xs px-2.5 py-1"
      : "text-[10px] px-2 py-0.5";

  return (
    <span
      className={`tec-department-badge inline-flex items-center rounded ${deptClass} font-bold uppercase tracking-wider ${sizeClass} ${className}`}
    >
      {label}
    </span>
  );
}
