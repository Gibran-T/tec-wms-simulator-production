import { useParams } from "wouter";
import PutawayForm from "./PutawayForm";
import FioriShell from "@/components/FioriShell";

export default function PutawayFormPage() {
  const params = useParams<{ runId: string }>();
  const runId = parseInt(params.runId ?? "0", 10);

  if (!runId) {
    return (
      <FioriShell>
        <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">
          Identifiant de session invalide.
        </div>
      </FioriShell>
    );
  }

  return (
    <FioriShell>
      <PutawayForm runId={runId} />
    </FioriShell>
  );
}
