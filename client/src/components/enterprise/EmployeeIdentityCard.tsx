import { Briefcase, Building2, Hash, UserCircle, Play, Award, IdCard } from "lucide-react";
import { Link } from "wouter";
import type { EmployeeProfilePayload } from "@shared/enterprise/employeeProfile";
import CharacterCard from "@/components/enterprise/CharacterCard";

interface EmployeeIdentityCardProps {
  profile: EmployeeProfilePayload;
  language: "FR" | "EN";
  t: (fr: string, en: string) => string;
  /** RC20-A.1 — full portal layout with supervisor and current assignment */
  layout?: "compact" | "connect";
  /** RC21-B.1 — hide inline assignment when TodayPriorities shows CurrentAssignmentCard */
  hideInlineAssignment?: boolean;
}

export default function EmployeeIdentityCard({
  profile,
  language,
  t,
  layout = "compact",
  hideInlineAssignment = false,
}: EmployeeIdentityCardProps) {
  const lang = language === "FR" ? "fr" : "en";
  const chapterLabel = profile.careerChapter.label[lang];
  const assignment = profile.currentAssignment;

  if (layout === "connect") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card border rounded-lg p-5 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
              <UserCircle size={32} className="text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                {t("Profil employé — Concorde Logistics", "Employee profile — Concorde Logistics")}
              </p>
              <h2 className="text-xl font-bold text-foreground truncate">{profile.displayName}</h2>
              <p className="text-sm text-muted-foreground mt-1">{profile.professionalSummary[lang]}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <Hash size={14} />
                <span className="text-[10px] font-semibold uppercase">{t("ID employé", "Employee ID")}</span>
              </div>
              <p className="text-sm font-mono font-bold text-foreground">{profile.employeeId}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <Building2 size={14} />
                <span className="text-[10px] font-semibold uppercase">{t("Département", "Department")}</span>
              </div>
              <p className="text-sm font-bold text-foreground">{profile.department.label[lang]}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <Briefcase size={14} />
                <span className="text-[10px] font-semibold uppercase">{t("Chapitre carrière", "Career chapter")}</span>
              </div>
              <p className="text-xs font-semibold text-foreground leading-snug">{chapterLabel}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <Award size={14} />
                <span className="text-[10px] font-semibold uppercase">{t("Missions", "Missions")}</span>
              </div>
              <p className="text-sm font-bold text-foreground">{profile.completedMissions.length}</p>
            </div>
          </div>

          {!hideInlineAssignment && (
          <div className="p-4 border rounded-md bg-primary/5 border-primary/20">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">
              {t("Affectation en cours", "Current assignment")}
            </p>
            {assignment.status === "active" && assignment.runId ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground">
                    {assignment.scnCode}
                    {assignment.missionTitle ? ` — ${assignment.missionTitle}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">{assignment.label[lang]}</p>
                </div>
                <Link
                  href={`/student/run/${assignment.runId}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
                >
                  <Play size={16} />
                  {t("Reprendre la mission", "Resume mission")}
                </Link>
              </div>
            ) : assignment.status === "available" && assignment.scnCode ? (
              <div>
                <p className="font-semibold text-foreground">
                  {assignment.scnCode}
                  {assignment.missionTitle ? ` — ${assignment.missionTitle}` : ""}
                </p>
                <p className="text-xs text-muted-foreground">{assignment.label[lang]}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t("Aucune mission active — consultez le tableau de missions.", "No active mission — see the mission board below.")}
              </p>
            )}
          </div>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground px-1">
            {t("Superviseur", "Supervisor")}
          </p>
          <CharacterCard character={profile.supervisor} language={language} />
        </div>
      </div>
    );
  }

  return (
    <div className="tec-briefing-panel p-5 space-y-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
        <IdCard size={14} />
        {t("Identité employé", "Employee identity")}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            {t("ID employé", "Employee ID")}
          </p>
          <p className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-0.5">
            {profile.employeeId}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            {t("Chapitre de carrière", "Career chapter")}
          </p>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-0.5 leading-snug">
            {chapterLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
