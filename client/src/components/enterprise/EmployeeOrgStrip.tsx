import type { EmployeeProfilePayload } from "@shared/enterprise/employeeProfile";
import CharacterCard from "./CharacterCard";

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

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="tec-briefing-panel p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          {t("Département d'affectation", "Home department")}
        </p>
        <p className="text-base font-bold text-slate-900 dark:text-white">{deptLabel}</p>
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
