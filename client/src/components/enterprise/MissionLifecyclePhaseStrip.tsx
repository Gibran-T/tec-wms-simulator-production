import { CheckCircle2, Radio, ClipboardList } from "lucide-react";
import {
  getMissionLifecyclePhaseMeta,
  getMissionLifecyclePhaseOrder,
  pickMissionLifecycleLanguage,
  type MissionLifecyclePhase,
} from "@shared/enterprise/missionLifecycle";

const PHASE_ICONS: Record<MissionLifecyclePhase, React.ElementType> = {
  briefing: ClipboardList,
  live: Radio,
  closure: CheckCircle2,
};

interface MissionLifecyclePhaseStripProps {
  activePhase: MissionLifecyclePhase;
  language: "FR" | "EN";
  compact?: boolean;
}

export default function MissionLifecyclePhaseStrip({
  activePhase,
  language,
  compact = false,
}: MissionLifecyclePhaseStripProps) {
  const phases = getMissionLifecyclePhaseOrder();
  const activeIndex = phases.indexOf(activePhase);

  return (
    <nav
      className={`tec-mission-lifecycle-strip ${compact ? "tec-mission-lifecycle-strip--compact" : ""}`}
      aria-label={language === "FR" ? "Cycle de mission" : "Mission lifecycle"}
    >
      {phases.map((phase, index) => {
        const meta = getMissionLifecyclePhaseMeta(phase);
        const Icon = PHASE_ICONS[phase];
        const isActive = phase === activePhase;
        const isComplete = index < activeIndex;

        return (
          <div
            key={phase}
            className={`tec-mission-lifecycle-step ${
              isActive ? "tec-mission-lifecycle-step--active" : ""
            } ${isComplete ? "tec-mission-lifecycle-step--complete" : ""}`}
          >
            <div className="tec-mission-lifecycle-step__icon">
              <Icon size={compact ? 12 : 14} />
            </div>
            <span className="tec-mission-lifecycle-step__label">
              {pickMissionLifecycleLanguage(language, meta, "label").toUpperCase()}
            </span>
          </div>
        );
      })}
    </nav>
  );
}
