import { AlertTriangle } from "lucide-react";
import type { Bilingual } from "@shared/learningFeedbackTypes";
import { pickBilingual } from "@shared/learningFeedbackTypes";

type Props = {
  title: string;
  mistakes: Bilingual[];
  stepMistakes?: Bilingual[];
  language: "fr" | "en";
};

export default function CommonMistakesBlock({ title, mistakes, stepMistakes, language }: Props) {
  const all = [...mistakes, ...(stepMistakes ?? [])];
  if (all.length === 0) return null;

  return (
    <div
      className="rounded-md border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 p-3 space-y-2"
      data-testid="learning-common-mistakes"
      role="region"
      aria-label={title}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
        <AlertTriangle size={12} />
        {title}
      </p>
      <ul className="list-disc list-inside space-y-1">
        {all.map((m, i) => (
          <li key={i} className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
            {pickBilingual(m, language)}
          </li>
        ))}
      </ul>
    </div>
  );
}
