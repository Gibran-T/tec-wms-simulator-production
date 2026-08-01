/**
 * M5 DOC supervision UI shell — supervision-doc-v1 only.
 * Does not render ops-ledger widgets.
 */
import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { M5DocJournalBoard } from "./M5DocJournalBoard";
import { M5DocInteractionPanel } from "./M5DocInteractionPanel";

type Props = {
  runId: number;
};

export function M5DocMissionShell({ runId }: Props) {
  const utils = trpc.useUtils();
  const stateQuery = trpc.m5Doc.getState.useQuery({ runId });
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);

  const expectedId = stateQuery.data?.expectedInteractionId;
  const interactionQuery = trpc.m5Doc.getInteraction.useQuery(
    { runId, interactionId: expectedId ?? "INT-PRE-01" },
    { enabled: !!expectedId },
  );

  const submit = trpc.m5Doc.submitInteraction.useMutation({
    onSuccess: async (res) => {
      const r = res as {
        feedbackCode: string;
        points: number;
        maxPoints: number;
        finalScore: number;
      };
      setLastFeedback(`${r.feedbackCode} · +${r.points}/${r.maxPoints} · score ${r.finalScore}`);
      await utils.m5Doc.getState.invalidate({ runId });
      await utils.m5Doc.getInteraction.invalidate();
    },
    onError: (err) => setLastFeedback(err.message),
  });

  const phase = stateQuery.data?.state.phase ?? "PRE";
  const journal = stateQuery.data?.state.journalView;

  const mode = useMemo(() => {
    const zone = interactionQuery.data?.def.phase;
    return zone === "PRE" ? "FORMATIVE" : "OFFICIAL";
  }, [interactionQuery.data?.def.phase]);

  if (stateQuery.isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Chargement mission documentaire…</div>;
  }

  if (stateQuery.error) {
    return (
      <div className="p-6 text-sm text-destructive">
        Profil DOC indisponible : {stateQuery.error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Superviseur d&apos;exploitation — quart de clôture
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Phase {phase} · modèle supervision-doc-v1 · score {stateQuery.data?.finalScore ?? 0}/100
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {journal && <M5DocJournalBoard journal={journal} />}
          {interactionQuery.data && (
            <M5DocInteractionPanel
              def={interactionQuery.data.def}
              inheritance={interactionQuery.data.inheritance}
              alreadyScored={interactionQuery.data.alreadyScored}
              disabled={submit.isPending}
              onSubmit={(payload) => {
                submit.mutate({
                  runId,
                  interactionId: interactionQuery.data!.def.id,
                  payload,
                  mode: mode as "FORMATIVE" | "OFFICIAL",
                  idempotencyKey: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
                });
              }}
            />
          )}
          {lastFeedback && (
            <div className="rounded border border-border bg-muted/40 px-3 py-2 text-xs">{lastFeedback}</div>
          )}
          {stateQuery.data?.state.phase === "CLOSED" && (
            <Button variant="secondary" disabled>
              Mission documentaire terminée
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
