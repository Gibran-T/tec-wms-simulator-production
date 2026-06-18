import { useLanguage } from "@/contexts/LanguageContext";

/** Non-scannable QR placeholder — verify.teclog.ca integration deferred. */
export default function QrPlaceholder() {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-3 mt-2">
      <div
        className="w-16 h-16 md:w-[72px] md:h-[72px] shrink-0 border-2 border-dashed border-slate-300 rounded-sm bg-slate-50/80 flex flex-col items-center justify-center print:w-[28mm] print:h-[28mm]"
        aria-hidden
      >
        <svg viewBox="0 0 64 64" className="w-10 h-10 text-slate-400" fill="currentColor">
          <rect x="4" y="4" width="18" height="18" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="8" y="8" width="10" height="10" />
          <rect x="42" y="4" width="18" height="18" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="46" y="8" width="10" height="10" />
          <rect x="4" y="42" width="18" height="18" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="8" y="46" width="10" height="10" />
          <rect x="28" y="28" width="4" height="4" />
          <rect x="36" y="28" width="4" height="4" />
          <rect x="28" y="36" width="4" height="4" />
          <rect x="44" y="44" width="4" height="4" />
          <rect x="52" y="36" width="4" height="4" />
          <rect x="36" y="52" width="4" height="4" />
          <rect x="52" y="52" width="8" height="8" />
        </svg>
        <span className="text-[5px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">
          QR
        </span>
      </div>
      <div className="text-left leading-snug">
        <p className="text-[8px] text-slate-500">
          {t("Vérifier ce certificat sur", "Verify this certificate at")}
        </p>
        <p className="text-[10px] md:text-xs font-semibold text-[#0070f2]">verify.teclog.ca</p>
      </div>
    </div>
  );
}
