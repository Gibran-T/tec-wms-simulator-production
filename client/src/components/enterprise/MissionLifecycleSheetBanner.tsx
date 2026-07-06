import {
  getMissionLifecyclePhaseMeta,
  pickMissionLifecycleLanguage,
  type MissionLifecyclePhase,
} from "@shared/enterprise/missionLifecycle";

interface MissionLifecycleSheetBannerProps {
  phase: MissionLifecyclePhase;
  language: "FR" | "EN";
}

/** Phase chrome above Mission Sheet content — component body unchanged. */
export default function MissionLifecycleSheetBanner({ phase, language }: MissionLifecycleSheetBannerProps) {
  const meta = getMissionLifecyclePhaseMeta(phase);

  return (
    <div className={`tec-mission-lifecycle-sheet-banner tec-mission-lifecycle-sheet-banner--${phase}`}>
      <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">
        {pickMissionLifecycleLanguage(language, meta, "label")}
      </p>
      <p className="text-xs mt-0.5 leading-snug">
        {pickMissionLifecycleLanguage(language, meta, "sheetBanner")}
      </p>
    </div>
  );
}
