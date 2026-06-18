import { useLanguage } from "@/contexts/LanguageContext";

function SignatureLine() {
  return (
    <svg viewBox="0 0 200 36" className="w-36 h-8 mb-1 text-slate-800" aria-hidden>
      <path
        d="M6 26 C 28 10, 52 30, 78 18 S 118 8, 148 22 S 172 14, 194 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Nadia Allami institutional signature — certificate bottom center column. */
export default function DualSignatureBlock() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center text-center px-2">
      <SignatureLine />
      <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.12em] text-[#0070f2] mt-1">
        NADIA ALLAMI
      </p>
      <p className="text-[8px] md:text-[9px] text-[#0070f2]/80 leading-snug mt-0.5 max-w-[200px]">
        {t(
          "Directrice, Certification professionnelle | Collège de la Concorde",
          "Director, Professional Certification | Collège de la Concorde",
        )}
      </p>
    </div>
  );
}
