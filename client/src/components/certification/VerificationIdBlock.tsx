import { useLanguage } from "@/contexts/LanguageContext";

type Props = {
  certificateId: string | null;
  silverEarned: boolean;
  isPreviewOnly: boolean;
};

export default function VerificationIdBlock({ certificateId, silverEarned, isPreviewOnly }: Props) {
  const { t } = useLanguage();

  const showBlock = silverEarned || isPreviewOnly;
  if (!showBlock) return null;

  const displayId = certificateId ?? "—";
  const missingRegistry = silverEarned && !certificateId;

  return (
    <div className="text-left px-2 w-full">
      <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-slate-500 mb-1.5">
        {t("Identifiant de vérification", "Verification ID")}
      </p>
      <div className="inline-block border-2 border-[#0070f2]/40 bg-white px-3 py-1.5 rounded-sm">
        <p className="font-mono text-xs md:text-sm tracking-[0.05em] text-[#0070f2] font-semibold">
          {displayId}
        </p>
      </div>
      {isPreviewOnly && certificateId && (
        <p className="mt-1 text-[7px] uppercase tracking-wide text-blue-600 font-semibold">
          {t("Pré-attribution", "Pre-assignment")}
        </p>
      )}
      {missingRegistry && (
        <p className="mt-1 text-[8px] text-amber-700 leading-snug">
          {t(
            "Identifiant en attente de concordance registre — contactez le Collège.",
            "ID pending registry match — contact the Collège.",
          )}
        </p>
      )}
    </div>
  );
}
