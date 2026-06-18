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
    <div className="rounded-lg border border-slate-200 bg-white/80 px-4 py-3 text-center min-w-[220px] print:bg-white print:border-slate-300">
      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500 mb-1">
        {t("Identifiant de vérification", "Verification ID")}
      </p>
      <p className="font-mono text-sm tracking-[0.05em] text-slate-800 font-medium">{displayId}</p>
      {isPreviewOnly && certificateId && (
        <p className="mt-1 text-[8px] uppercase tracking-wide text-blue-600 font-semibold">
          {t("Pré-attribution", "Pre-assignment")}
        </p>
      )}
      {missingRegistry && (
        <p className="mt-1 text-[9px] text-amber-700 leading-snug">
          {t(
            "Identifiant en attente de concordance registre — contactez le Collège.",
            "ID pending registry match — contact the Collège.",
          )}
        </p>
      )}
    </div>
  );
}
