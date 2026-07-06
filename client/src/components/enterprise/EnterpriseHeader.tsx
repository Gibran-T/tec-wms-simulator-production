import { Building2 } from "lucide-react";
import type { DepartmentCode, PriorityLevel } from "@shared/enterpriseBriefing";
import { DEPARTMENT_LABELS } from "@shared/enterprise/scenarioBinding";
import { getDepartmentCssClass } from "@shared/enterprise/departmentNavigation";
import PriorityBadge from "./PriorityBadge";
import DepartmentBadge from "./DepartmentBadge";

interface EnterpriseHeaderProps {
  scnCode: string;
  department: DepartmentCode;
  priority: PriorityLevel;
  moduleId?: number;
  language: "FR" | "EN";
  t: (fr: string, en: string) => string;
  compact?: boolean;
  /** RC21-B.3 — department accent border (TEDS CSS vars) instead of module accent */
  accentMode?: "module" | "department";
  /** Optional footer override; defaults to TEC.LOG assignment copy */
  footerNote?: string;
}

export default function EnterpriseHeader({
  scnCode,
  department,
  priority,
  moduleId = 1,
  language,
  t,
  compact = false,
  accentMode = "module",
  footerNote,
}: EnterpriseHeaderProps) {
  const deptLabel = DEPARTMENT_LABELS[department];
  const moduleClass = `tec-enterprise-header--m${Math.min(5, Math.max(1, moduleId))}`;
  const deptClass = getDepartmentCssClass(department);
  const accentClass =
    accentMode === "department"
      ? `tec-enterprise-header--dept ${deptClass}`
      : moduleClass;

  return (
    <div className={`tec-enterprise-header ${accentClass} ${compact ? "px-4 py-2" : "px-6 py-4"}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="bg-white/10 p-2 shrink-0">
            <Building2 size={compact ? 18 : 22} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className={`font-bold tracking-tight uppercase ${compact ? "text-sm" : "text-base"}`}>
              Concorde Logistics
            </p>
            <p className="text-[10px] text-slate-300 font-mono truncate">
              CDC · {language === "FR" ? deptLabel.fr : deptLabel.en} · {scnCode}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <DepartmentBadge
            department={department}
            label={language === "FR" ? deptLabel.fr : deptLabel.en}
            className={`${deptClass} !bg-white/10 !text-white !border-white/20`}
          />
          <PriorityBadge priority={priority} language={language} />
        </div>
      </div>
      {!compact && (
        <p className="text-[10px] text-slate-400 mt-2 italic">
          {footerNote ??
            t(
              "Collège de la Concorde · Programme TEC.LOG · Affectation professionnelle",
              "Collège de la Concorde · TEC.LOG Programme · Professional assignment"
            )}
        </p>
      )}
    </div>
  );
}
