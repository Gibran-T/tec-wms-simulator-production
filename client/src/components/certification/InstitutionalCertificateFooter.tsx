import { useLanguage } from "@/contexts/LanguageContext";

function TeclogMark() {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" aria-hidden>
        <path
          fill="currentColor"
          d="M12 2 L22 12 L12 22 L2 12 Z"
          opacity="0.9"
        />
        <path
          fill="currentColor"
          d="M12 6 L18 12 L12 18 L6 12 Z"
          opacity="0.5"
        />
      </svg>
      <span className="text-[10px] md:text-xs font-bold tracking-[0.18em] text-white uppercase">
        TECLOG
      </span>
    </div>
  );
}

/** Dark institutional footer bar — certificate face only. */
export default function InstitutionalCertificateFooter() {
  const { t } = useLanguage();

  return (
    <div className="mt-auto -mx-5 md:-mx-7 lg:-mx-9 -mb-5 md:-mb-7 lg:-mb-9 overflow-hidden print:-mx-9 print:-mb-9">
      <div className="bg-[#0f2a44] px-4 md:px-8 py-2.5 md:py-3 flex flex-col sm:flex-row items-center justify-between gap-2 print:py-2">
        <p className="text-[8px] md:text-[9px] text-white/90 font-medium tracking-wide text-center sm:text-left print:text-[7pt]">
          {t(
            "Collège de la Concorde est une division de TECLOG Inc.",
            "Collège de la Concorde is a division of TECLOG Inc.",
          )}
        </p>
        <div className="hidden sm:block w-px h-4 bg-white/30 shrink-0" aria-hidden />
        <TeclogMark />
      </div>
    </div>
  );
}
