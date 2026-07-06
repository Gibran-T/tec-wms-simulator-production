import { ClipboardList, FileText, ChevronRight } from "lucide-react";
import MissionLifecyclePhaseStrip from "./MissionLifecyclePhaseStrip";
import {
  getMissionLifecyclePhaseMeta,
  pickMissionLifecycleLanguage,
  type MissionLifecyclePhase,
} from "@shared/enterprise/missionLifecycle";

interface MissionLifecycleHubProps {
  phase: MissionLifecyclePhase;
  language: "FR" | "EN";
  t: (fr: string, en: string) => string;
  progressPct: number;
  onOpenMissionSheet: () => void;
  onOpenRunReport?: () => void;
}

/** Surrounding enterprise experience — Mission Sheet remains the center artifact. */
export default function MissionLifecycleHub({
  phase,
  language,
  t,
  progressPct,
  onOpenMissionSheet,
  onOpenRunReport,
}: MissionLifecycleHubProps) {
  const meta = getMissionLifecyclePhaseMeta(phase);
  const guidance = pickMissionLifecycleLanguage(language, meta, "guidance");

  return (
    <section className="tec-mission-lifecycle-hub space-y-3">
      <MissionLifecyclePhaseStrip activePhase={phase} language={language} />

      <div className="tec-briefing-panel p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
            {t("Cycle de mission", "Mission lifecycle")}
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{guidance}</p>
          {phase === "live" && (
            <p className="text-[10px] font-mono text-slate-500">
              {t("Progression", "Progress")}: {Math.round(progressPct)}%
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {phase !== "closure" && (
            <button
              type="button"
              onClick={onOpenMissionSheet}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all ${
                phase === "briefing"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {phase === "briefing" ? <ClipboardList size={16} /> : <FileText size={16} />}
              {t("FICHE DE MISSION", "MISSION SHEET")}
            </button>
          )}
          {phase === "closure" && onOpenRunReport && (
            <button
              type="button"
              onClick={onOpenRunReport}
              className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white px-4 py-2 text-xs font-bold transition-all"
            >
              {t("DÉBRIEF PROFESSIONNEL", "PROFESSIONAL DEBRIEF")}
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
