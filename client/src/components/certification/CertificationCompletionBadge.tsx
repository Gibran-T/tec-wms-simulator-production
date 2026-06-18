import { useLanguage } from "@/contexts/LanguageContext";

type Props = {
  /** Institutional pathway completion — not an academic grade. */
  visible: boolean;
  issueDate?: string;
};

export default function CertificationCompletionBadge({ visible, issueDate }: Props) {
  const { t } = useLanguage();

  if (!visible) return null;

  return (
    <div className="text-left px-2">
      <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-slate-500 mb-1">
        {t("Achèvement de la certification", "Certification Completion")}
      </p>
      <p className="text-3xl md:text-4xl font-serif font-bold tabular-nums text-[#0070f2] leading-none">
        100%
      </p>
      {issueDate && (
        <div className="mt-3">
          <p className="text-[10px] md:text-xs text-slate-700 font-medium">{issueDate}</p>
          <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-slate-500 mt-0.5">
            {t("Date d'achèvement", "Date Completed")}
          </p>
        </div>
      )}
    </div>
  );
}
