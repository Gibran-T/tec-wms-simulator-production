import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileDown, Linkedin } from "lucide-react";

type CertificateCredentialActionsProps = {
  pdfUrl: string;
  verificationUrl: string;
  linkedinCredentialUrl: string;
  layout?: "verify" | "certifications";
};

export default function CertificateCredentialActions({
  pdfUrl,
  verificationUrl,
  linkedinCredentialUrl,
  layout = "verify",
}: CertificateCredentialActionsProps) {
  const { t } = useLanguage();

  const verifyButton =
    layout === "certifications" ? (
      <Button asChild className="bg-[#0f2a44] hover:bg-[#0f2a44]/90">
        <a href={verificationUrl} target="_blank" rel="noopener noreferrer">
          <ExternalLink size={16} />
          {t("Voir la certification", "View credential")}
        </a>
      </Button>
    ) : null;

  const downloadButton = (
    <Button asChild variant={layout === "verify" ? "default" : "outline"} className={layout === "verify" ? "bg-[#0f2a44] hover:bg-[#0f2a44]/90" : undefined}>
      <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
        <FileDown size={16} />
        {t("Télécharger PDF", "Download PDF")}
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
    <div className={`flex flex-wrap gap-3 ${layout === "verify" ? "pt-2" : ""}`}>
      {verifyButton}
      {downloadButton}
      {linkedInButton}
    </div>
  );
}
