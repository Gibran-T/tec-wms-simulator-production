import FioriShell from "@/components/FioriShell";
import { M5DocProfessorPanel } from "@/components/m5Doc/M5DocProfessorPanel";
import { useLanguage } from "@/contexts/LanguageContext";
import { useParams } from "wouter";

export default function M5DocProfessorPage() {
  const { t } = useLanguage();
  const { runId } = useParams<{ runId: string }>();
  const id = Number(runId);

  return (
    <FioriShell
      title={t("M5 DOC — Vue professeur", "M5 DOC — Professor view")}
      breadcrumbs={[
        { label: t("Tableau de bord", "Dashboard"), href: "/teacher" },
        { label: t("Surveillance", "Monitoring"), href: "/teacher/monitor" },
        { label: `Run #${id}` },
      ]}
    >
      {!Number.isFinite(id) ? (
        <p className="text-sm text-destructive">Run ID invalide</p>
      ) : (
        <M5DocProfessorPanel runId={id} />
      )}
    </FioriShell>
  );
}
