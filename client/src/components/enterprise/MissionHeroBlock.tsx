import CharacterCard from "@/components/enterprise/CharacterCard";
import { missionEntityLabel } from "@/lib/enterpriseTerminology";
import type { CharacterRef } from "@shared/enterpriseBriefing";

export interface MissionHeroBlockProps {
  missionTitle: string;
  role: string;
  moduleLabel?: string;
  supervisor?: CharacterRef | null;
  language: "FR" | "EN";
  t: (fr: string, en: string) => string;
  /** Page cockpit uses H1; sheet dialog uses styled paragraph */
  variant?: "page" | "sheet";
  showSupervisor?: boolean;
}

export default function MissionHeroBlock({
  missionTitle,
  role,
  moduleLabel,
  supervisor,
  language,
  t,
  variant = "page",
  showSupervisor = true,
}: MissionHeroBlockProps) {
  const eyebrow = missionEntityLabel(t);
  const TitleTag = variant === "page" ? "h1" : "p";

  return (
    <section
      className="tec-mission-hero space-y-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-5 md:px-6"
      data-testid="mission-hero-block"
    >
      <div>
        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">{eyebrow}</p>
        <TitleTag
          className={
            variant === "page"
              ? "text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-snug"
              : "text-xl font-bold text-slate-900 dark:text-white leading-snug"
          }
        >
          {missionTitle}
        </TitleTag>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="tec-briefing-panel p-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase">
            {t("Rôle professionnel", "Professional role")}
          </p>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{role}</p>
          {moduleLabel && (
            <p className="text-[10px] text-slate-500 mt-2 font-mono">{moduleLabel}</p>
          )}
        </div>
        {showSupervisor && supervisor && (
          <CharacterCard character={supervisor} language={language} />
        )}
      </div>
    </section>
  );
}
