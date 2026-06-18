import { useLanguage } from "@/contexts/LanguageContext";

/** Non-scannable QR placeholder — verify.teclog.ca integration deferred. */
export default function QrPlaceholder() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center gap-1.5 shrink-0">
      <div
        className="w-24 h-24 min-w-[96px] min-h-[96px] border-2 border-dashed border-slate-300 rounded-sm bg-slate-50/80 flex items-center justify-center print:w-[32mm] print:h-[32mm] print:min-w-[32mm] print:min-h-[32mm]"
        aria-hidden
      >
        <svg viewBox="0 0 64 64" className="w-16 h-16 text-slate-400" fill="currentColor">
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
      </div>
      <p className="text-[9px] text-slate-500 text-center leading-tight">
        {t("Vérifier · verify.teclog.ca", "Verify · verify.teclog.ca")}
      </p>
    </div>
  );
}
