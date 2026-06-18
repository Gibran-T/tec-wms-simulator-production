import { useLanguage } from "@/contexts/LanguageContext";
import SilverBadgeSvg from "@/components/certification/SilverBadgeSvg";
import { SilverStatusChip, type SilverCertState } from "@/components/certification/CertificationStatus";
import CertificationCompletionBadge from "@/components/certification/CertificationCompletionBadge";
import VerificationIdBlock from "@/components/certification/VerificationIdBlock";
import SignaturePlaceholder from "@/components/certification/SignaturePlaceholder";
import QrPlaceholder from "@/components/certification/QrPlaceholder";

const ACHIEVEMENTS = [
  { fr: "SCN-001 — Cycle opérationnel complet", en: "SCN-001 — Complete Operational Cycle" },
  { fr: "SCN-002 — Résolution GR fantôme", en: "SCN-002 — Ghost GR Resolution" },
  { fr: "SCN-003 — Résolution pénurie stock", en: "SCN-003 — Stock Shortage Resolution" },
  { fr: "SCN-004 — Ajustement écart inventaire", en: "SCN-004 — Inventory Variance Adjustment" },
  { fr: "SCN-005 — Résolution conformité multi-erreurs", en: "SCN-005 — Multi-Error Compliance Resolution" },
  { fr: "Validation Quiz M1 (≥ 60 %)", en: "Quiz M1 Validation (≥ 60%)" },
];

const COMPETENCIES = [
  { fr: "Bons de commande (PO)", en: "Purchase Orders" },
  { fr: "Réception marchandises (GR)", en: "Goods Receipt" },
  { fr: "Rangement (Putaway)", en: "Putaway" },
  { fr: "Commandes client (SO)", en: "Sales Orders" },
  { fr: "Sortie marchandises (GI)", en: "Goods Issue" },
  { fr: "Contrôle inventaire", en: "Inventory Control" },
  { fr: "Conformité opérationnelle", en: "Operational Compliance" },
  { fr: "Résolution de problèmes WMS", en: "WMS Problem Solving" },
];

export type SilverCertificateDocumentProps = {
  studentName: string;
  issueDate: string;
  certificateId: string | null;
  silverEarned: boolean;
  isPreviewOnly: boolean;
  showCompletion: boolean;
  state: SilverCertState;
};

export default function SilverCertificateDocument({
  studentName,
  issueDate,
  certificateId,
  silverEarned,
  isPreviewOnly,
  showCompletion,
  state,
}: SilverCertificateDocumentProps) {
  const { t } = useLanguage();

  return (
    <div
      className={`silver-certificate-document relative border-2 rounded-lg bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 p-6 md:p-8 lg:p-10 shadow-xl print:shadow-none print:rounded-none print:border-slate-300 ${
        isPreviewOnly ? "border-blue-300/60" : "border-slate-300 dark:border-slate-600"
      }`}
    >
      {isPreviewOnly && (
        <div className="absolute top-4 right-4 md:top-6 md:right-8 rotate-12 opacity-20 pointer-events-none select-none z-10">
          <span className="text-3xl md:text-4xl font-black uppercase tracking-widest text-blue-600 border-4 border-blue-600 px-4 py-2 rounded">
            {t("APERÇU", "PREVIEW")}
          </span>
        </div>
      )}

      {/* Ornamental double frame */}
      <div className="absolute inset-3 md:inset-4 border-2 border-slate-200 dark:border-slate-700 rounded pointer-events-none" />
      <div className="absolute inset-5 md:inset-6 border border-slate-200/80 dark:border-slate-700/80 rounded pointer-events-none" />

      <div className="relative z-[1] flex flex-col gap-5 md:gap-6">
        {/* Header row — institution + seal */}
        <div className="flex items-start justify-between gap-4">
          <div className="text-left space-y-0.5 pt-1">
            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-medium">
              {t("Collège de la Concorde", "Collège de la Concorde")}
            </p>
            <p className="text-xs font-semibold text-[#0070f2]">{t("Programme TEC.LOG", "TEC.LOG Program")}</p>
            <p className="text-[10px] text-muted-foreground tracking-wide max-w-xs">
              {t("Operational Competency Credential · TEC.WMS", "Operational Competency Credential · TEC.WMS")}
            </p>
          </div>
          <div className="shrink-0 print:[&_svg]:!w-[100mm] print:[&_svg]:!h-[100mm]">
            <SilverBadgeSvg size={140} variant="full" className="drop-shadow-sm" />
          </div>
        </div>

        {/* Tier headline */}
        <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-4">
          <SilverStatusChip state={state} />
          <h1 className="text-xl md:text-2xl lg:text-[26px] font-bold tracking-[0.08em] text-slate-800 dark:text-slate-100 mt-3">
            {t("CERTIFICATION SILVER", "SILVER CERTIFICATION")}
          </h1>
          <p className="text-xs md:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
            {t("ERP/WMS Foundation Operations · Module 1", "ERP/WMS Foundation Operations · Module 1")}
          </p>
        </div>

        {/* Completion + Verification row */}
        <div className="flex flex-col sm:flex-row items-stretch justify-center gap-4 md:gap-8 px-2 md:px-6">
          <CertificationCompletionBadge visible={showCompletion} />
          <VerificationIdBlock
            certificateId={certificateId}
            silverEarned={silverEarned}
            isPreviewOnly={isPreviewOnly}
          />
        </div>

        {/* Recipient */}
        <div className="text-center border-y border-slate-200 dark:border-slate-700 py-5 px-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
            {t("Décerné à", "Awarded to")}
          </p>
          <p className="text-2xl md:text-[28px] font-semibold text-foreground font-serif leading-tight">{studentName}</p>
          <p className="text-xs text-muted-foreground mt-2">{issueDate}</p>
        </div>

        {/* Achievements + competencies */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-10 px-2 md:px-4">
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 mb-3 border-b border-slate-200 dark:border-slate-700 pb-1">
              {t("Réalisations opérationnelles", "Operational Achievements")}
            </h2>
            <ul className="space-y-1.5 text-[11px] md:text-xs">
              {ACHIEVEMENTS.map((item) => (
                <li key={item.en} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span className="text-foreground/90">{t(item.fr, item.en)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 mb-3 border-b border-slate-200 dark:border-slate-700 pb-1">
              {t("Compétences certifiées", "Certified Competencies")}
            </h2>
            <ul className="space-y-1.5 text-[11px] md:text-xs">
              {COMPETENCIES.map((item) => (
                <li key={item.en} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span className="text-foreground/90">{t(item.fr, item.en)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Signature + QR footer */}
        <div className="flex flex-col sm:flex-row items-end justify-between gap-6 pt-4 border-t border-slate-200 dark:border-slate-700 px-2 md:px-4">
          <SignaturePlaceholder />
          <QrPlaceholder />
        </div>
      </div>
    </div>
  );
}
