import { Link } from "wouter";
import { ArrowRight, PlayCircle } from "lucide-react";
import type { EmployeeProfileCurrentAssignment } from "@shared/enterprise/employeeProfile";
import { isDepartmentHomeEnabled } from "@/lib/departmentHome";

interface CurrentAssignmentCardProps {
  assignment: EmployeeProfileCurrentAssignment;
  language: "FR" | "EN";
  t: (fr: string, en: string) => string;
  /** RC21-B.1 — mission title primary, SCN metadata secondary */
  assignmentPresentation?: boolean;
}

export default function CurrentAssignmentCard({
  assignment,
  language,
  t,
  assignmentPresentation = false,
}: CurrentAssignmentCardProps) {
  const chapterLabel = language === "FR" ? assignment.label.fr : assignment.label.en;

  const statusCopy = assignmentPresentation
    ? {
        active: {
          fr: "Affectation en cours",
          en: "Assignment in progress",
          className: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200",
        },
        available: {
          fr: "Prochaine affectation disponible",
          en: "Next assignment available",
          className: "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-200",
        },
        none: {
          fr: "Chapitre complété",
          en: "Chapter complete",
          className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200",
        },
      }[assignment.status]
    : {
        active: {
          fr: "Mission en cours",
          en: "Mission in progress",
          className: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200",
        },
        available: {
          fr: "Prochaine mission disponible",
          en: "Next mission available",
          className: "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-200",
        },
        none: {
          fr: "Module complété",
          en: "Module complete",
          className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200",
        },
      }[assignment.status];

  return (
    <div className="tec-briefing-panel p-5 space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {assignmentPresentation
            ? t("Affectation opérationnelle", "Operational assignment")
            : t("Affectation actuelle", "Current assignment")}
        </p>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${statusCopy.className}`}>
          {language === "FR" ? statusCopy.fr : statusCopy.en}
        </span>
      </div>

      <p className="text-xs text-slate-500">{chapterLabel}</p>

      {assignment.scnCode ? (
        <>
          {assignmentPresentation ? (
            <>
              {assignment.missionTitle && (
                <p className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {assignment.missionTitle}
                </p>
              )}
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mt-1">
                {assignment.scnCode}
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <PlayCircle size={16} className="text-primary shrink-0" />
                <span className="text-sm font-mono font-bold text-primary">{assignment.scnCode}</span>
              </div>
              {assignment.missionTitle && (
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {assignment.missionTitle}
                </p>
              )}
            </>
          )}
        </>
      ) : (
        <p className="text-sm text-slate-500 italic">
          {t(
            "Toutes les missions du chapitre actif sont complétées.",
            "All missions in the active chapter are complete."
          )}
        </p>
      )}

      {assignment.status === "active" && assignment.runId != null && (
        <Link
          href={`/student/run/${assignment.runId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mt-1"
        >
          {assignmentPresentation
            ? t("Reprendre l'affectation", "Resume assignment")
            : t("Reprendre la mission", "Resume mission")}
          <ArrowRight size={12} />
        </Link>
      )}

      {assignment.status === "available" && (
        <Link
          href={
            isDepartmentHomeEnabled()
              ? "/student/department"
              : assignmentPresentation
                ? "/student/connect"
                : "/student/scenarios"
          }
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mt-1"
        >
          {isDepartmentHomeEnabled()
            ? t("Voir la file d'affectations", "View assignment queue")
            : assignmentPresentation
              ? t("Voir la file d'affectations", "View assignment queue")
              : t("Accéder au tableau de missions", "Go to mission board")}
          <ArrowRight size={12} />
        </Link>
      )}
    </div>
  );
}
