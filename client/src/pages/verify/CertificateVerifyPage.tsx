import { useLanguage } from "@/contexts/LanguageContext";
import SilverBadgeSvg, { GoldBadgeSvg } from "@/components/certification/SilverBadgeSvg";
import CertificateCredentialActions from "@/components/certification/CertificateCredentialActions";
import { Badge } from "@/components/ui/badge";
import { buildProductionVerificationUrl } from "@shared/certification/certificateUrls";
import { lookupVerifiedCredentialByCertificateId } from "@shared/certification/railwayVerificationRegistry";
import { ShieldCheck, ShieldX } from "lucide-react";
import { useParams } from "wouter";

const LOGO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663029779635/KgVchfh3nwnwCSCPgkNzAq/concorde-logo_73f38483.png";

function formatIssueDate(isoDate: string, locale: "fr" | "en"): string {
  const date = new Date(`${isoDate}T12:00:00`);
  return date.toLocaleDateString(locale === "fr" ? "fr-CA" : "en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

type DetailFieldProps = {
  label: string;
  value: string;
  mono?: boolean;
};

function DetailField({ label, value, mono }: DetailFieldProps) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 mb-1">{label}</p>
      <p
        className={`text-sm md:text-base font-semibold text-[#0f2a44] break-words ${mono ? "font-mono tracking-wide" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

export default function CertificateVerifyPage() {
  const { certificateId } = useParams<{ certificateId: string }>();
  const { t, language } = useLanguage();
  const entry = certificateId ? lookupVerifiedCredentialByCertificateId(certificateId) : null;
  const locale = language === "FR" ? "fr" : "en";

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f7]">
      <header className="bg-[#0f2a44] px-4 sm:px-6 py-3 flex items-center gap-3 sm:gap-4">
        <img
          src={LOGO_URL}
          alt={t("Collège de la Concorde", "Collège de la Concorde")}
          className="h-7 object-contain brightness-0 invert shrink-0"
        />
        <div className="border-l border-white/20 pl-3 min-w-0">
          <p className="text-xs font-semibold text-white truncate">
            {t("Collège de la Concorde — Montréal", "Collège de la Concorde — Montréal")}
          </p>
          <p className="text-[10px] text-white/60">
            {t("Vérification de certification TEC.WMS", "TEC.WMS Certification Verification")}
          </p>
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {entry ? (
          <div className="bg-white border border-[#d9d9d9] rounded-lg shadow-sm overflow-hidden">
            <div className="bg-[#e8f4fd] border-b border-[#0070f2]/20 px-5 sm:px-8 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#107e3e]/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#107e3e]" aria-hidden />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-bold text-[#0f2a44]">
                  {t("Certification vérifiée", "Verified Credential")}
                </h1>
                <p className="text-xs text-slate-600">
                  {t(
                    "Cette certification est authentique et active dans le registre institutionnel.",
                    "This credential is authentic and active in the institutional registry.",
                  )}
                </p>
              </div>
            </div>

            <div className="px-5 sm:px-8 py-6 sm:py-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8 pb-8 border-b border-slate-200">
                {entry.certificationLevel === "GOLD" ? (
                  <GoldBadgeSvg size={96} variant="compact" className="mx-auto sm:mx-0 shrink-0" />
                ) : (
                  <SilverBadgeSvg size={96} variant="compact" className="mx-auto sm:mx-0 shrink-0" />
                )}
                <div className="text-center sm:text-left min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 mb-1">
                    {t("Nom de l'étudiant", "Student Name")}
                  </p>
                  <p className="text-xl sm:text-2xl font-serif font-bold text-[#0070f2] leading-tight">
                    {entry.studentName}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-x-8 sm:gap-y-6">
                <DetailField
                  label={t("Numéro d'étudiant", "Student Number")}
                  value={entry.studentNumber}
                  mono
                />
                <DetailField
                  label={t("Identifiant de certification", "Credential ID")}
                  value={entry.certificateId}
                  mono
                />
                <DetailField
                  label={t("URL de certification", "Credential URL")}
                  value={buildProductionVerificationUrl(entry.certificateId)}
                  mono
                />
                <DetailField label={t("Programme", "Program")} value={entry.program} />
                <DetailField
                  label={t("Niveau de certification", "Certification Level")}
                  value={entry.certificationLevel}
                />
                <DetailField
                  label={t("Date d'émission", "Issue Date")}
                  value={formatIssueDate(entry.issueDate, locale)}
                />
                <DetailField label={t("Émis par", "Issued By")} value={entry.issuedBy} />
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  {t("Statut", "Status")}
                </p>
                <Badge className="bg-[#107e3e] hover:bg-[#107e3e] text-white border-transparent text-xs px-3 py-1 uppercase tracking-wider">
                  {entry.status}
                </Badge>
              </div>

              <CertificateCredentialActions
                pdfUrl={entry.pdfUrl}
                verificationUrl={entry.verificationUrl}
                linkedinCredentialUrl={entry.linkedinCredentialUrl}
                layout="verify"
              />
            </div>
          </div>
        ) : (
          <div className="bg-white border border-[#d9d9d9] rounded-lg shadow-sm overflow-hidden">
            <div className="px-5 sm:px-8 py-10 sm:py-14 text-center">
              <div className="w-14 h-14 rounded-full bg-[#bb0000]/10 flex items-center justify-center mx-auto mb-5">
                <ShieldX className="w-7 h-7 text-[#bb0000]" aria-hidden />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0f2a44] mb-2">
                {t("Certification introuvable", "Certificate Not Found")}
              </h1>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                {t(
                  "Aucune certification ne correspond à cet identifiant dans le registre du Collège de la Concorde. Vérifiez l'identifiant et réessayez.",
                  "No credential matches this identifier in the Collège de la Concorde registry. Please verify the ID and try again.",
                )}
              </p>
              {certificateId && (
                <p className="mt-4 font-mono text-xs text-slate-400 break-all">{certificateId}</p>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-[#e0e0e0] bg-white mt-auto">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p className="text-[10px] text-gray-400">
            © 2026 {t("Collège de la Concorde — Montréal", "Collège de la Concorde — Montréal")}.{" "}
            {t("Tous droits réservés.", "All rights reserved.")}
          </p>
          <span className="text-[10px] text-gray-400 font-mono">TEC.WMS · v1.0</span>
        </div>
      </footer>
    </div>
  );
}
