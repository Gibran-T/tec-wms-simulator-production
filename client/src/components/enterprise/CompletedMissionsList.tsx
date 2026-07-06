import { Link } from "wouter";
import { CheckCircle2, ClipboardList } from "lucide-react";
import type { EmployeeProfileMission } from "@shared/enterprise/employeeProfile";

interface CompletedMissionsListProps {
  missions: EmployeeProfileMission[];
  language: "FR" | "EN";
  t: (fr: string, en: string) => string;
}

export default function CompletedMissionsList({
  missions,
  language,
  t,
}: CompletedMissionsListProps) {
  if (missions.length === 0) {
    return (
      <div className="tec-briefing-panel p-5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          {t("Missions complétées", "Completed missions")}
        </p>
        <p className="text-sm text-slate-500 italic">
          {t(
            "Aucune mission évaluative complétée. Votre portfolio Concorde se construit ici.",
            "No eval missions completed yet. Your Concorde portfolio builds here."
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="tec-briefing-panel p-5 space-y-3">
      <div className="flex items-center gap-2">
        <ClipboardList size={14} className="text-slate-400" />
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {t("Missions complétées", "Completed missions")} ({missions.length})
        </p>
      </div>
      <ul className="space-y-2 max-h-72 overflow-y-auto">
        {missions.map((mission) => (
          <li
            key={mission.scnCode}
            className={`flex items-start justify-between gap-3 p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 tec-mission-board-card--m${mission.moduleId}`}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold text-primary">{mission.scnCode}</span>
                <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-snug line-clamp-2">
                {mission.missionTitle}
              </p>
              {mission.completedAt && (
                <p className="text-[10px] text-slate-400 mt-1">
                  {new Date(mission.completedAt).toLocaleDateString(
                    language === "FR" ? "fr-CA" : "en-CA",
                    { day: "2-digit", month: "short", year: "numeric" }
                  )}
                </p>
              )}
            </div>
            <div className="text-right shrink-0">
              {mission.score != null && (
                <p className="text-sm font-bold text-slate-900 dark:text-white">{mission.score}%</p>
              )}
              {mission.runId != null && (
                <Link
                  href={`/student/run/${mission.runId}/report`}
                  className="text-[10px] text-primary hover:underline mt-1 block"
                >
                  {t("Rapport", "Report")}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
