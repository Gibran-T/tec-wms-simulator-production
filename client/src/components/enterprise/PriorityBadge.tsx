import type { PriorityLevel } from "@shared/enterpriseBriefing";
import { PRIORITY_LABELS } from "@shared/enterprise/scenarioBinding";

interface PriorityBadgeProps {
  priority: PriorityLevel;
  language: "FR" | "EN";
  size?: "sm" | "md";
  className?: string;
}

const PRIORITY_CLASS: Record<PriorityLevel, string> = {
  normal: "tec-priority-normal",
  elevee: "tec-priority-elevee",
  critique: "tec-priority-critique",
  pointe: "tec-priority-pointe",
};

export default function PriorityBadge({
  priority,
  language,
  size = "sm",
  className = "",
}: PriorityBadgeProps) {
  const label = PRIORITY_LABELS[priority];
  const sizeClass = size === "md" ? "text-xs px-2.5 py-1" : "text-[10px] px-2 py-0.5";
  return (
    <span
      className={`tec-priority-badge inline-flex items-center rounded font-bold uppercase tracking-wider ${sizeClass} ${PRIORITY_CLASS[priority]} ${className}`}
    >
      {language === "FR" ? label.fr : label.en}
    </span>
  );
}
