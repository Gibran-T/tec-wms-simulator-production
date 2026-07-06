import type { EmployeeProfilePayload } from "@shared/enterprise/employeeProfile";
import { getDepartmentCssClass } from "@shared/enterprise/departmentNavigation";
import CharacterCard from "./CharacterCard";
import DepartmentBadge from "./DepartmentBadge";

interface EmployeeOrgStripProps {
  profile: EmployeeProfilePayload;
  language: "FR" | "EN";
  t: (fr: string, en: string) => string;
}

export default function EmployeeOrgStrip({
  profile,
  language,
  t,
}: EmployeeOrgStripProps) {
  const deptLabel =
    language === "FR" ? profile.department.label.fr : profile.department.label.en;
  const deptClass = getDepartmentCssClass(profile.department.code);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className={`tec-briefing-panel tec-org-strip--dept ${deptClass} p-4`}>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          {t("Département d'affectation", "Home department")}
        </p>
        <DepartmentBadge
          department={profile.department.code}
          label={deptLabel}
          size="md"
          className="mb-2"
        />
        <p className="text-xs text-slate-500 mt-1 font-mono">{profile.department.code}</p>
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
          {t("Superviseur", "Supervisor")}
        </p>
        <CharacterCard character={profile.supervisor} language={language} />
      </div>
    </div>
  );
}
