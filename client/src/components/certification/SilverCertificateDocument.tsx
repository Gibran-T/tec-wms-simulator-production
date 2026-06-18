import { useLanguage } from "@/contexts/LanguageContext";
import SilverBadgeSvg from "@/components/certification/SilverBadgeSvg";
import CertificationCompletionBadge from "@/components/certification/CertificationCompletionBadge";
import VerificationIdBlock from "@/components/certification/VerificationIdBlock";
import DualSignatureBlock from "@/components/certification/DualSignatureBlock";
import QrPlaceholder from "@/components/certification/QrPlaceholder";
import CollegeCrest from "@/components/certification/CollegeCrest";
import InstitutionalCertificateFooter from "@/components/certification/InstitutionalCertificateFooter";
import type { SilverCertState } from "@/components/certification/CertificationStatus";

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

function CeremonySeparator() {
  return (
    <div className="flex items-center justify-center gap-3 my-3 md:my-4 max-w-xs mx-auto" aria-hidden>
      <div className="flex-1 h-px bg-slate-300" />
      <div className="w-2 h-2 rotate-45 border border-slate-400 bg-white" />
      <div className="flex-1 h-px bg-slate-300" />
    </div>
  );
}

export default function SilverCertificateDocument({
  studentName,
  issueDate,
  certificateId,
  silverEarned,
  isPreviewOnly,
  showCompletion,
}: SilverCertificateDocumentProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      {/* A4 landscape premium certificate */}
      <div
        className={`silver-certificate-document relative bg-white shadow-xl print:shadow-none overflow-hidden flex flex-col ${
          isPreviewOnly ? "ring-2 ring-blue-200/60" : ""
        }`}
        style={{ aspectRatio: "297 / 210" }}
      >
        {isPreviewOnly && (
          <div className="absolute top-6 right-8 rotate-12 opacity-15 pointer-events-none select-none z-20">
            <span className="text-3xl font-black uppercase tracking-widest text-blue-600 border-4 border-blue-600 px-4 py-2">
              {t("APERÇU", "PREVIEW")}
            </span>
          </div>
        )}

        {/* Blue double border frame */}
        <div className="absolute inset-0 border-[3px] border-[#0070f2] pointer-events-none z-10" />
        <div className="absolute inset-[6px] border-2 border-[#0070f2]/50 pointer-events-none z-10" />
        {/* Top center tab notch */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-2 bg-[#0070f2] z-10 pointer-events-none"
          aria-hidden
        />

        {/* Certificate body */}
        <div className="relative z-[1] flex flex-col flex-1 px-5 md:px-7 lg:px-9 pt-5 md:pt-6 pb-0 min-h-0">
          {/* Header — crest + seal */}
          <div className="flex items-start justify-between gap-4 mb-2 md:mb-3">
            <CollegeCrest />
            <div className="shrink-0 print:[&_svg]:!w-[42mm] print:[&_svg]:!h-[42mm]">
              <SilverBadgeSvg size={160} variant="full" className="drop-shadow-md w-[120px] h-[120px] md:w-[160px] md:h-[160px]" />
            </div>
          </div>

          {/* Center ceremony block */}
          <div className="flex-1 flex flex-col items-center justify-center text-center px-2 md:px-8 py-2 md:py-3 min-h-0">
            <p className="text-[9px] md:text-[10px] uppercase tracking-[0.22em] text-slate-500 font-semibold">
              {t("Le présent document atteste que", "This is to certify that")}
            </p>
            <p className="text-xl md:text-2xl lg:text-[28px] font-serif font-bold text-[#0070f2] leading-tight mt-2 md:mt-3 px-2">
              {studentName}
            </p>
            <CeremonySeparator />
            <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold">
              {t("A complété avec succès", "Has successfully completed")}
            </p>
            <h1 className="text-lg md:text-xl lg:text-2xl font-serif font-bold tracking-[0.06em] text-[#0f2a44] mt-2 leading-tight">
              {t("CERTIFICATION SILVER TEC.WMS", "TEC.WMS SILVER CERTIFICATION")}
            </h1>
            <p className="text-[9px] md:text-[10px] text-slate-500 max-w-lg mx-auto mt-2 md:mt-3 leading-relaxed">
              {t(
                "Démontrant une connaissance avancée et une compétence pratique en gestion d'entrepôt avec TEC.WMS.",
                "Demonstrating advanced knowledge and practical competence in warehouse management with TEC.WMS.",
              )}
            </p>
          </div>

          {/* Bottom three-column area */}
          <div className="grid grid-cols-3 gap-2 md:gap-4 items-end py-3 md:py-4 border-t border-slate-200/80">
            <CertificationCompletionBadge visible={showCompletion} issueDate={issueDate} />
            <DualSignatureBlock />
            <div className="flex flex-col items-start">
              <VerificationIdBlock
                certificateId={certificateId}
                silverEarned={silverEarned}
                isPreviewOnly={isPreviewOnly}
              />
              <QrPlaceholder />
            </div>
          </div>

          <InstitutionalCertificateFooter />
        </div>
      </div>

      {/* Supporting details — below certificate, non-dominant */}
      <div className="silver-certificate-supporting rounded-lg border border-slate-200 bg-slate-50/60 dark:bg-slate-900/30 dark:border-slate-700 px-4 py-4 md:px-6 md:py-5 print:hidden">
        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-3 text-center">
          {t("Détails de certification", "Certification Details")}
        </p>
        <div className="grid md:grid-cols-2 gap-5 md:gap-8">
          <div>
            <h2 className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500 mb-2 border-b border-slate-200 dark:border-slate-700 pb-1">
              {t("Réalisations opérationnelles", "Operational Achievements")}
            </h2>
            <ul className="space-y-1 text-[10px] md:text-[11px]">
              {ACHIEVEMENTS.map((item) => (
                <li key={item.en} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span className="text-foreground/85">{t(item.fr, item.en)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500 mb-2 border-b border-slate-200 dark:border-slate-700 pb-1">
              {t("Compétences certifiées", "Certified Competencies")}
            </h2>
            <ul className="space-y-1 text-[10px] md:text-[11px]">
              {COMPETENCIES.map((item) => (
                <li key={item.en} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span className="text-foreground/85">{t(item.fr, item.en)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
