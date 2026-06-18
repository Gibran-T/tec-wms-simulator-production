import { useLanguage } from "@/contexts/LanguageContext";

/** Institutional signatory placeholder — no digital signature. */
export default function SignaturePlaceholder() {
  const { t } = useLanguage();

  return (
    <div className="text-left min-w-[180px]">
      <svg viewBox="0 0 180 28" className="w-36 h-7 mb-1 text-slate-400" aria-hidden>
        <path
          d="M4 20 C 30 8, 50 24, 72 14 S 110 6, 140 18 S 160 12, 176 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
      <div className="w-32 h-px bg-slate-400 mb-2" />
      <p className="text-xs font-semibold text-slate-800">Nadia Allami</p>
      <p className="text-[10px] text-slate-600">{t("Directrice Générale", "General Director")}</p>
      <p className="text-[10px] font-medium text-slate-700">{t("Collège de la Concorde", "Collège de la Concorde")}</p>
    </div>
  );
}
