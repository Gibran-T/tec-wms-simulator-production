import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import FioriShell from "@/components/FioriShell";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GoldBadgeSvg } from "@/components/certification/SilverBadgeSvg";
import { GoldStatusChip, type GoldCertState } from "@/components/certification/CertificationStatus";
import CertificateCredentialActions from "@/components/certification/CertificateCredentialActions";
import { lookupGoldRegistryByStudentNumber } from "@shared/goldCertificationRegistry";
import { lookupVerifiedCredentialByCertificateId } from "@shared/certification/railwayVerificationRegistry";

const ACHIEVEMENTS = [
  { fr: "Silver TEC.LOG — prérequis validé", en: "TEC.LOG Silver — prerequisite validated" },
  { fr: "SCN-006 à SCN-017 — parcours intégré M2–M5", en: "SCN-006 to SCN-017 — integrated M2–M5 pathway" },
  { fr: "Quiz M5 (≥ 60 %)", en: "M5 quiz (≥ 60%)" },
  { fr: "SCN-016 — action corrective avant KPI", en: "SCN-016 — corrective action before KPI" },
  { fr: "SCN-017 — décision exécutive liée aux KPI", en: "SCN-017 — KPI-linked executive decision" },
];

function formatIssueDate(isoDate: string, locale: "fr" | "en"): string {
  const date = new Date(`${isoDate}T12:00:00`);
  return date.toLocaleDateString(locale === "fr" ? "fr-CA" : "en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

type MetadataFieldProps = {
  label: string;
  value: string;
  mono?: boolean;
};

function MetadataField({ label, value, mono }: MetadataFieldProps) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground mb-1">{label}</p>
      <p className={`text-sm font-semibold text-foreground break-words ${mono ? "font-mono tracking-wide text-xs" : ""}`}>
        {value}
      </p>
    </div>
  );
}

export default function GoldCertificatePreview() {
  const { t, language } = useLanguage();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { data: goldStatus, isLoading } = trpc.profiles.goldStatus.useQuery();
  const { data: profile } = trpc.profiles.mine.useQuery();

  const studentName = profile?.displayName?.trim() || user?.name || t("Étudiant", "Student");
  const goldEarned = goldStatus?.goldCertified ?? false;
  const goldState: GoldCertState = goldStatus?.state ?? "LOCKED";
  const isPreviewOnly = !goldEarned && goldState === "ELIGIBLE";
  const locale = language === "FR" ? "fr" : "en";

  const goldRegistryEntry = lookupGoldRegistryByStudentNumber(profile?.studentNumber ?? null);
  const activeGoldCredential =
    goldEarned && goldRegistryEntry?.status === "ACTIVE"
      ? lookupVerifiedCredentialByCertificateId(goldRegistryEntry.certificateId)
      : null;
  const missingRegistry = goldEarned && !activeGoldCredential;

  if (isLoading) {
    return (
      <FioriShell>
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-2 border-[#0070f2] border-t-transparent rounded-full animate-spin" />
        </div>
      </FioriShell>
    );
  }

  if (!goldEarned && goldState !== "ELIGIBLE") {
    return (
      <FioriShell title={t("Certificat Gold", "Gold Certificate")}>
        <div className="max-w-lg mx-auto px-4 py-12 text-center space-y-4">
          <GoldBadgeSvg size={80} className="mx-auto opacity-40" />
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t(
              "Certification Gold non encore éligible. Complétez le parcours M2–M5 pour accéder à l'aperçu pédagogique.",
              "Gold certification not yet eligible. Complete the M2–M5 pathway to access the pedagogical preview.",
            )}
          </p>
          <Button variant="outline" onClick={() => navigate("/student/certifications")}>
            {t("Retour aux certifications", "Back to certifications")}
          </Button>
        </div>
      </FioriShell>
    );
  }

  return (
    <FioriShell
      title={t("Certificat Gold TEC.LOG", "TEC.LOG Gold Certificate")}
      breadcrumbs={[
        { label: t("Accueil", "Home"), href: "/" },
        { label: t("Certifications", "Certifications"), href: "/student/certifications" },
        { label: t("Gold", "Gold") },
      ]}
    >
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/student/certifications")} className="gap-2 -ml-2">
          <ArrowLeft size={16} />
          {t("Retour", "Back")}
        </Button>

        <div className={`relative rounded-xl border-2 overflow-hidden shadow-lg ${isPreviewOnly ? "border-dashed border-amber-400" : "border-amber-500/60"}`}>
          {isPreviewOnly && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <span className="text-4xl font-black text-amber-600/20 rotate-[-18deg] uppercase tracking-widest">
                {t("APERÇU", "PREVIEW")}
              </span>
            </div>
          )}

          <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 dark:from-amber-950 dark:via-yellow-950 dark:to-amber-900 p-8 md:p-12 text-center space-y-6">
            <GoldBadgeSvg size={120} className="mx-auto" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-amber-800/70 font-semibold">
                Collège de la Concorde · TEC.LOG
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-amber-950 mt-2">
                {t("Certification Gold", "Gold Certification")}
              </h1>
              <p className="text-sm text-amber-900/80 mt-1">
                {t("Parcours intégré M1–M5 · Opérations logistiques", "Integrated M1–M5 pathway · Logistics operations")}
              </p>
            </div>

            <div className="py-4 border-y border-amber-300/40">
              <p className="text-lg font-semibold text-amber-950">{studentName}</p>
              <GoldStatusChip state={goldEarned ? "AWARDED" : "ELIGIBLE"} />
            </div>

            <ul className="text-left max-w-md mx-auto space-y-2">
              {ACHIEVEMENTS.map((a) => (
                <li key={a.fr} className="text-sm text-amber-900/90 flex items-start gap-2">
                  <span className="text-amber-600 shrink-0">✓</span>
                  {t(a.fr, a.en)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {activeGoldCredential && (
          <div className="rounded-xl border border-amber-200/80 bg-card shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-amber-50/50 dark:bg-amber-950/20">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                {t("Informations du certificat", "Certificate Information")}
              </p>
            </div>
            <div className="px-5 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <MetadataField
                label={t("Identifiant du certificat", "Certificate ID")}
                value={activeGoldCredential.certificateId}
                mono
              />
              <MetadataField
                label={t("Date d'émission", "Issue Date")}
                value={formatIssueDate(activeGoldCredential.issueDate, locale)}
              />
              <MetadataField label={t("Nom de l'étudiant", "Student Name")} value={activeGoldCredential.studentName} />
              <MetadataField label={t("Programme", "Program")} value={activeGoldCredential.program} />
              <div className="sm:col-span-2 flex items-center justify-between gap-3 pt-1 border-t border-border">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  {t("Statut", "Status")}
                </p>
                <Badge className="bg-[#107e3e] hover:bg-[#107e3e] text-white border-transparent text-xs px-3 py-1">
                  {t("Obtenue", "Obtained")}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {activeGoldCredential && (
          <CertificateCredentialActions
            pdfUrl={activeGoldCredential.pdfUrl}
            verificationUrl={activeGoldCredential.verificationUrl}
            linkedinCredentialUrl={activeGoldCredential.linkedinCredentialUrl}
            layout="credential"
          />
        )}

        {missingRegistry && (
          <p className="text-sm text-amber-800 dark:text-amber-200 text-center rounded-lg border border-amber-200 bg-amber-50/80 dark:bg-amber-950/30 px-4 py-3">
            {t(
              "Certification Gold obtenue. Votre certificat institutionnel est en cours de liaison — contactez l'administration si ce message persiste.",
              "Gold certification obtained. Your institutional certificate is being linked — contact administration if this message persists.",
            )}
          </p>
        )}

        <p className="text-xs text-muted-foreground text-center leading-relaxed max-w-lg mx-auto">
          {goldEarned
            ? t(
                "Certification officielle obtenue. Le certificat peut être téléchargé et vérifié en ligne.",
                "Official certification obtained. The certificate can be downloaded and verified online.",
              )
            : t(
                "Aperçu pédagogique uniquement. Le certificat officiel signé et vérifiable sera émis par le Collège de la Concorde (QR / PDF — à venir).",
                "Pedagogical preview only. The official signed verifiable certificate will be issued by Collège de la Concorde (QR / PDF — coming later).",
              )}
        </p>
      </div>
    </FioriShell>
  );
}
