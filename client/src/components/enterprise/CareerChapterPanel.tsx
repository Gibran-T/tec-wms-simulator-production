import type { EmployeeProfilePayload } from "@shared/enterprise/employeeProfile";
import { getCareerSignalsForModule } from "@shared/enterprise/careerSignals";

interface CareerChapterPanelProps {
  profile: EmployeeProfilePayload;
  language: "FR" | "EN";
  t: (fr: string, en: string) => string;
  /** RC21-C.1A — compact strip for EOAS Today's Priorities */
  variant?: "full" | "compact";
}

export default function CareerChapterPanel({
  profile,
  language,
  t,
  variant = "full",
}: CareerChapterPanelProps) {
  const signals = getCareerSignalsForModule(profile.careerChapter.moduleId);
  const chapterLabel =
    language === "FR" ? profile.careerChapter.label.fr : profile.careerChapter.label.en;
  const primary = language === "FR" ? signals.primary.fr : signals.primary.en;
  const secondary = language === "FR" ? signals.secondary.fr : signals.secondary.en;

  if (variant === "compact") {
    return (
      <div
        className={`tec-career-strip tec-briefing-panel p-3 border-l-4 tec-mission-board-card--m${profile.careerChapter.moduleId}`}
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {t("Progression de carrière", "Career progression")}
        </p>
        <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug mt-1">{chapterLabel}</p>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
          <span className="font-semibold text-primary">{t("Signal :", "Signal:")}</span> {primary}
        </p>
      </div>
    );
  }

  return (
    <div className={`tec-briefing-panel p-5 border-l-4 tec-mission-board-card--m${profile.careerChapter.moduleId}`}>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
        {t("Chapitre de carrière actif", "Active career chapter")}
      </p>
      <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{chapterLabel}</p>
      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 p-3">
          <p className="text-[10px] font-semibold uppercase text-primary tracking-wide">
            {t("Signal principal", "Primary signal")}
          </p>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-1">{primary}</p>
        </div>
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 p-3">
          <p className="text-[10px] font-semibold uppercase text-slate-500 tracking-wide">
            {t("Signal secondaire", "Secondary signal")}
          </p>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-1">{secondary}</p>
        </div>
      </div>
    </div>
  );
}
