import { useLanguage } from "@/contexts/LanguageContext";

function SignatureLine() {
  return (
    <svg viewBox="0 0 180 28" className="w-32 h-6 mb-1 text-slate-400" aria-hidden>
      <path
        d="M4 20 C 30 8, 50 24, 72 14 S 110 6, 140 18 S 160 12, 176 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

type SignatoryProps = {
  name: string;
  titleFr: string;
  titleEn: string;
  affiliationFr: string;
  affiliationEn: string;
};

function SignatoryBlock({ name, titleFr, titleEn, affiliationFr, affiliationEn }: SignatoryProps) {
  const { t } = useLanguage();

  return (
    <div className="text-left min-w-[160px] max-w-[200px]">
      <SignatureLine />
      <div className="w-28 h-px bg-slate-400 mb-2 print:w-[60mm]" />
      <p className="text-xs font-semibold text-slate-800">{name}</p>
      <p className="text-[10px] text-slate-600">{t(titleFr, titleEn)}</p>
      <p className="text-[10px] font-medium text-slate-700">{t(affiliationFr, affiliationEn)}</p>
    </div>
  );
}

/** Dual institutional signatory row — placeholder signatures only. */
export default function DualSignatureBlock() {
  return (
    <div className="flex flex-wrap gap-6 md:gap-10 items-end">
      <SignatoryBlock
        name="Nadia Allami"
        titleFr="Directrice Générale"
        titleEn="General Director"
        affiliationFr="Collège de la Concorde"
        affiliationEn="Collège de la Concorde"
      />
      <SignatoryBlock
        name="Thiago Gibran"
        titleFr="Programme Lead TEC.LOG / TEC.WMS"
        titleEn="Programme Lead TEC.LOG / TEC.WMS"
        affiliationFr="Collège de la Concorde"
        affiliationEn="Collège de la Concorde"
      />
    </div>
  );
}
