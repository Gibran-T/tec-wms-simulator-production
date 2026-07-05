import type { PriorityLevel } from "@shared/enterpriseBriefing";
import { PRIORITY_LABELS } from "@shared/enterprise/scenarioBinding";

interface PriorityBadgeProps {
  priority: PriorityLevel;
  language: "FR" | "EN";
  className?: string;
}

const PRIORITY_CLASS: Record<PriorityLevel, string> = {
  normal: "tec-priority-normal",
  elevee: "tec-priority-elevee",
  critique: "tec-priority-critique",
  pointe: "tec-priority-pointe",
};

export default function PriorityBadge({ priority, language, className = "" }: PriorityBadgeProps) {
  const label = PRIORITY_LABELS[priority];
  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 ${PRIORITY_CLASS[priority]} ${className}`}
    >
      {language === "FR" ? label.fr : label.en}
    </span>
  );
}
