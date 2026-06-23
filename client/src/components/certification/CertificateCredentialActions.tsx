import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileDown, Linkedin } from "lucide-react";

type CertificateCredentialActionsProps = {
  pdfUrl: string;
  verificationUrl: string;
  linkedinCredentialUrl: string;
  layout?: "verify" | "certifications" | "credential";
};

export default function CertificateCredentialActions({
  pdfUrl,
  verificationUrl,
  linkedinCredentialUrl,
  layout = "verify",
}: CertificateCredentialActionsProps) {
  const { t } = useLanguage();

  const showVerifyLink = layout === "certifications" || layout === "credential";
  const verifyOpensNewTab = layout === "certifications";

  const verifyButton = showVerifyLink ? (
    <Button
      asChild
      className={layout === "credential" ? "bg-amber-700 hover:bg-amber-800" : "bg-[#0f2a44] hover:bg-[#0f2a44]/90"}
    >
      <a
        href={verificationUrl}
        {...(verifyOpensNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        <ExternalLink size={16} />
        {layout === "credential"
          ? t("Vérifier ma certification", "Verify my certification")
          : t("Voir la certification", "View credential")}
      </a>
    </Button>
  ) : null;

  const downloadButton = (
    <Button
      asChild
      variant={layout === "verify" || layout === "credential" ? "default" : "outline"}
      className={
        layout === "verify"
          ? "bg-[#0f2a44] hover:bg-[#0f2a44]/90"
          : layout === "credential"
            ? "bg-amber-700 hover:bg-amber-800"
            : undefined
      }
    >
      <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
        <FileDown size={16} />
        {layout === "credential"
          ? t("Télécharger mon certificat Gold", "Download my Gold certificate")
          : t("Télécharger PDF", "Download PDF")}
      </a>
    </Button>
  );

  const linkedInButton = (
    <Button asChild variant="outline">
      <a href={linkedinCredentialUrl} target="_blank" rel="noopener noreferrer">
        <Linkedin size={16} />
        {t("Ajouter à LinkedIn", "Add to LinkedIn")}
      </a>
    </Button>
  );

  return (
    <div
      className={`flex flex-wrap gap-3 ${layout === "verify" || layout === "credential" ? "pt-2" : ""} ${layout === "credential" ? "justify-center" : ""}`}
    >
      {layout === "credential" ? (
        <>
          {downloadButton}
          {verifyButton}
          {linkedInButton}
        </>
      ) : (
        <>
          {verifyButton}
          {downloadButton}
          {linkedInButton}
        </>
      )}
    </div>
  );
}
