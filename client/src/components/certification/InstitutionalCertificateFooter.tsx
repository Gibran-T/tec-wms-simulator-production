import { useLanguage } from "@/contexts/LanguageContext";

/** Dark institutional footer bar — certificate face only. */
export default function InstitutionalCertificateFooter() {
  const { t } = useLanguage();

  return (
    <div className="mt-2 -mx-6 md:-mx-8 lg:-mx-10 -mb-6 md:-mb-8 lg:-mb-10 rounded-b-lg overflow-hidden print:-mx-10 print:-mb-10">
      <div className="bg-[#0f2a44] px-4 md:px-8 py-2.5 md:py-3 flex flex-col sm:flex-row items-center justify-between gap-1.5 print:py-2">
        <p className="text-[9px] md:text-[10px] text-white/90 font-medium tracking-wide text-center sm:text-left print:text-[7pt]">
          {t(
            "Collège de la Concorde · Programme TEC.LOG · TEC.WMS",
            "Collège de la Concorde · TEC.LOG Program · TEC.WMS",
          )}
        </p>
        <p className="text-[8px] uppercase tracking-[0.2em] text-[#0070f2] font-semibold print:text-[6pt]">
          {t("Performance · Excellence · Avenir", "Performance · Excellence · Future")}
        </p>
      </div>
    </div>
  );
}
