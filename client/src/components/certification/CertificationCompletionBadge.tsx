import { useLanguage } from "@/contexts/LanguageContext";

type Props = {
  /** Institutional pathway completion — not an academic grade. */
  visible: boolean;
};

export default function CertificationCompletionBadge({ visible }: Props) {
  const { t } = useLanguage();

  if (!visible) return null;

  return (
    <div className="rounded-lg border border-[#0070f2]/25 bg-white/80 px-4 py-3 text-center min-w-[200px] print:bg-white">
      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500 mb-1">
        {t("Achèvement de la certification", "Certification Completion")}
      </p>
      <p className="text-3xl font-bold tabular-nums text-[#0070f2] leading-none">100%</p>
      <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full w-full rounded-full bg-[#0070f2]" aria-hidden />
      </div>
      <p className="mt-2 text-[9px] leading-snug text-slate-500 max-w-[220px] mx-auto">
        {t(
          "Parcours M1 intégral validé selon les critères TEC.LOG",
          "Full M1 pathway validated per TEC.LOG criteria",
        )}
      </p>
    </div>
  );
}
