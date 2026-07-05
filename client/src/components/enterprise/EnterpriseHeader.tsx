import { Building2 } from "lucide-react";
import type { DepartmentCode, PriorityLevel } from "@shared/enterpriseBriefing";
import { DEPARTMENT_LABELS } from "@shared/enterprise/scenarioBinding";
import PriorityBadge from "./PriorityBadge";

interface EnterpriseHeaderProps {
  scnCode: string;
  department: DepartmentCode;
  priority: PriorityLevel;
  moduleId?: number;
  language: "FR" | "EN";
  t: (fr: string, en: string) => string;
  compact?: boolean;
}

export default function EnterpriseHeader({
  scnCode,
  department,
  priority,
  moduleId = 1,
  language,
  t,
  compact = false,
}: EnterpriseHeaderProps) {
  const deptLabel = DEPARTMENT_LABELS[department];
  const moduleClass = `tec-enterprise-header--m${Math.min(5, Math.max(1, moduleId))}`;

  return (
    <div className={`tec-enterprise-header ${moduleClass} ${compact ? "px-4 py-2" : "px-6 py-4"}`}>
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
          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 px-2 py-1">
            {language === "FR" ? deptLabel.fr : deptLabel.en}
          </span>
          <PriorityBadge priority={priority} language={language} />
        </div>
      </div>
      {!compact && (
        <p className="text-[10px] text-slate-400 mt-2 italic">
          {t(
            "Collège de la Concorde · Programme TEC.LOG · Affectation professionnelle",
            "Collège de la Concorde · TEC.LOG Programme · Professional assignment"
          )}
        </p>
      )}
    </div>
  );
}
