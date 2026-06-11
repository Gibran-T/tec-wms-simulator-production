import { useLanguage } from "@/contexts/LanguageContext";

export type SilverCertState = "obtenue" | "eligible" | "en_cours" | "a_commencer";

const STATE_STYLE: Record<SilverCertState, { bg: string; text: string; border: string }> = {
  obtenue: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-800 dark:text-emerald-200",
    border: "border-emerald-300 dark:border-emerald-700",
  },
  eligible: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-800 dark:text-blue-200",
    border: "border-blue-300 dark:border-blue-700",
  },
  en_cours: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-900 dark:text-amber-200",
    border: "border-amber-200 dark:border-amber-800",
  },
  a_commencer: {
    bg: "bg-muted/40",
    text: "text-muted-foreground",
    border: "border-border",
  },
};

export function resolveSilverState(input: {
  silverEarned: boolean;
  silverEligible: boolean;
  hasAnyProgress: boolean;
  allRequirementsMet: boolean;
}): SilverCertState {
  if (input.silverEarned) return "obtenue";
  if (input.allRequirementsMet || input.silverEligible) return "eligible";
  if (input.hasAnyProgress) return "en_cours";
  return "a_commencer";
}

export function SilverStatusChip({ state }: { state: SilverCertState }) {
  const { t } = useLanguage();
  const labels: Record<SilverCertState, { fr: string; en: string }> = {
    obtenue: { fr: "Obtenue", en: "Obtained" },
    eligible: { fr: "Éligible", en: "Eligible" },
    en_cours: { fr: "En cours", en: "In progress" },
    a_commencer: { fr: "À commencer", en: "Not started" },
  };
  const style = STATE_STYLE[state];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide border ${style.bg} ${style.text} ${style.border}`}>
      {t(labels[state].fr, labels[state].en)}
    </span>
  );
}

export function CertificationProgressRing({ pct, accent = "#64748b" }: { pct: number; accent?: string }) {
  const r = 42;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(100, Math.max(0, pct)) / 100) * circ;
  return (
    <div className="relative w-24 h-24 shrink-0">
      <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
        <circle cx="48" cy="48" r={r} fill="none" stroke="currentColor" strokeOpacity={0.1} strokeWidth="8" />
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke={accent}
          strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold tabular-nums text-foreground">{Math.round(pct)}%</span>
      </div>
    </div>
  );
}
