import type { LearningFeedbackScenario } from "@shared/learningFeedbackTypes";
import { pickBilingual } from "@shared/learningFeedbackTypes";

type Props = {
  scenario: LearningFeedbackScenario;
  language: "fr" | "en";
  t: (fr: string, en: string) => string;
};

export default function LearningFeedbackHeader({ scenario, language, t }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-3">
      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
        {t(`Module ${scenario.moduleId}`, `Module ${scenario.moduleId}`)}
      </span>
      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-secondary text-foreground">
        {scenario.scnCode}
      </span>
      <span className="text-xs text-muted-foreground">
        {pickBilingual(scenario.lens, language)}
      </span>
    </div>
  );
}
