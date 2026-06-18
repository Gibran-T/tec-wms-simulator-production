import { useLanguage } from "@/contexts/LanguageContext";

const LOGO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663029779635/KgVchfh3nwnwCSCPgkNzAq/concorde-logo_73f38483.png";

/** Institutional Collège de la Concorde crest + name + motto — top-left header. */
export default function CollegeCrest() {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-3 md:gap-4 shrink-0 min-w-0">
      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#0070f2] flex items-center justify-center p-2 shrink-0 print:w-[18mm] print:h-[18mm]">
        <img
          src={LOGO_URL}
          alt={t("Collège de la Concorde", "Collège de la Concorde")}
          className="w-full h-full object-contain brightness-0 invert"
        />
      </div>
      <div className="text-left min-w-0">
        <p className="text-sm md:text-base lg:text-lg font-serif font-bold text-[#0070f2] tracking-wide leading-tight">
          {t("COLLÈGE DE LA CONCORDE", "COLLÈGE DE LA CONCORDE")}
        </p>
        <p className="text-[8px] md:text-[9px] uppercase tracking-[0.22em] text-[#0070f2]/70 font-medium mt-1">
          {t("PERFORMANCE • EXCELLENCE • AVENIR", "PERFORMANCE • EXCELLENCE • FUTURE")}
        </p>
      </div>
    </div>
  );
}
