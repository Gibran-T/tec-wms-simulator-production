import { useLanguage } from "@/contexts/LanguageContext";
import {
  Presentation, ClipboardList, MonitorPlay, BarChart2, CheckSquare, Award,
} from "lucide-react";

export type JourneyStep = "slides" | "mission" | "scenario" | "dashboard" | "quiz" | "certification";

const STEPS: { id: JourneyStep; icon: React.ElementType; labelFr: string; labelEn: string }[] = [
  { id: "slides", icon: Presentation, labelFr: "Slides", labelEn: "Slides" },
  { id: "mission", icon: ClipboardList, labelFr: "Fiche Mission", labelEn: "Mission Sheet" },
  { id: "scenario", icon: MonitorPlay, labelFr: "Scénario", labelEn: "Scenario" },
  { id: "dashboard", icon: BarChart2, labelFr: "Analyse", labelEn: "Analysis" },
  { id: "quiz", icon: CheckSquare, labelFr: "Quiz", labelEn: "Quiz" },
  { id: "certification", icon: Award, labelFr: "Certification", labelEn: "Certification" },
];

interface TecLogJourneyStripProps {
  activeStep: JourneyStep;
  /** Scenario hub highlights mission + scenario together */
  highlightScenarioHub?: boolean;
  className?: string;
}

export default function TecLogJourneyStrip({
  activeStep,
  highlightScenarioHub = false,
  className = "",
}: TecLogJourneyStripProps) {
  const { t } = useLanguage();

  const isActive = (step: JourneyStep) => {
    if (highlightScenarioHub && (step === "mission" || step === "scenario")) return true;
    return step === activeStep;
  };

  return (
    <div
      className={`rounded-lg border border-[#1a3f6f]/40 bg-gradient-to-r from-[#0f2a44] to-[#152d52] px-3 py-3 sm:px-4 ${className}`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50 mb-2.5">
        {t("Parcours officiel TEC.LOG", "Official TEC.LOG Journey")}
      </p>
      <div className="flex flex-wrap items-center gap-1 sm:gap-0">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const active = isActive(step.id);
          return (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md transition-colors ${
                  active
                    ? "bg-[#0070f2]/25 border border-[#0070f2]/50"
                    : "border border-transparent opacity-60"
                }`}
              >
                <Icon
                  size={13}
                  className={active ? "text-[#4da3ff]" : "text-white/50"}
                />
                <span
                  className={`text-[10px] sm:text-xs font-semibold whitespace-nowrap ${
                    active ? "text-white" : "text-white/60"
                  }`}
                >
                  {t(step.labelFr, step.labelEn)}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <span className="hidden sm:inline text-white/25 mx-0.5 text-xs">→</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
