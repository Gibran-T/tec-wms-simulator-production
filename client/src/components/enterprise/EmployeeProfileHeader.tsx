import { Building2 } from "lucide-react";
import type { EmployeeProfilePayload } from "@shared/enterprise/employeeProfile";

interface EmployeeProfileHeaderProps {
  profile: EmployeeProfilePayload;
  language: "FR" | "EN";
  t: (fr: string, en: string) => string;
}

export default function EmployeeProfileHeader({
  profile,
  language,
  t,
}: EmployeeProfileHeaderProps) {
  const moduleClass = `tec-enterprise-header--m${Math.min(5, Math.max(1, profile.careerChapter.moduleId))}`;

  return (
    <div className={`tec-enterprise-header ${moduleClass} px-6 py-5`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="bg-white/10 p-2.5 shrink-0">
            <Building2 size={24} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold tracking-tight text-white">
              {t("Profil professionnel", "Professional profile")}
            </p>
            <p className="text-sm text-slate-200 mt-0.5">{profile.displayName}</p>
            <p className="text-[10px] text-slate-400 font-mono mt-1">
              Concorde Logistics · CDC · {profile.employeeId}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          {profile.certificationStatus.goldCertified && (
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-100 px-2 py-1">
              Gold
            </span>
          )}
          {profile.certificationStatus.silverCertified && !profile.certificationStatus.goldCertified && (
            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-400/20 text-slate-100 px-2 py-1">
              Silver
            </span>
          )}
          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white px-2 py-1">
            {language === "FR" ? profile.department.label.fr : profile.department.label.en}
          </span>
        </div>
      </div>
      <p className="text-[10px] text-slate-400 mt-3 italic">
        {t(
          "Collège de la Concorde · Programme TEC.LOG · Practicant Concorde Logistics",
          "Collège de la Concorde · TEC.LOG Programme · Concorde Logistics practicant"
        )}
      </p>
    </div>
  );
}
