import { useLanguage } from "@/contexts/LanguageContext";

const LOGO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663029779635/KgVchfh3nwnwCSCPgkNzAq/concorde-logo_73f38483.png";

/** Institutional Collège de la Concorde crest — display only. */
export default function CollegeCrest() {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-3 shrink-0">
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#0f2a44] flex items-center justify-center p-2 print:w-[14mm] print:h-[14mm]">
        <img
          src={LOGO_URL}
          alt={t("Collège de la Concorde", "Collège de la Concorde")}
          className="w-full h-full object-contain brightness-0 invert"
        />
      </div>
      <p className="hidden sm:block text-[8px] uppercase tracking-[0.18em] text-slate-400 font-medium leading-relaxed max-w-[100px] print:text-[6pt] print:max-w-none">
        {t("Performance · Excellence · Avenir", "Performance · Excellence · Future")}
      </p>
    </div>
  );
}
