/**
 * M5 DOC supervision UI shell — supervision-doc-v1 only.
 * Does not render ops-ledger widgets.
 */
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { M5DocJournalBoard } from "./M5DocJournalBoard";
import { M5DocInteractionPanel } from "./M5DocInteractionPanel";
import { M5_DOC_PHASE_LABELS } from "@/lib/m5DocEntry";

type Props = {
  runId: number;
};

function phaseIndex(phase: string | undefined): number {
  switch (phase) {
    case "PRE":
      return 0;
    case "SCN015":
      return 1;
    case "SCN016":
      return 2;
    case "SCN017":
      return 3;
    case "POST":
    case "CLOSED":
      return 4;
    default:
      return 0;
  }
}

export function M5DocMissionShell({ runId }: Props) {
  const utils = trpc.useUtils();
  const [, navigate] = useLocation();
  const stateQuery = trpc.m5Doc.getState.useQuery({ runId });
  const { data: quizBest } = trpc.quiz.getBestAttempt.useQuery({ moduleId: 5 });
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
      await utils.runs.myRunsEnriched.invalidate();
    },
    onError: (err) => setLastFeedback(err.message),
  });

  const phase = stateQuery.data?.state.phase ?? "PRE";
  const journal = stateQuery.data?.state.journalView;
  const activePhase = phaseIndex(phase);
  const completedCount = Object.keys(stateQuery.data?.state.officialScores ?? {}).length;
  const closed =
    stateQuery.data?.state.phase === "CLOSED" &&
    stateQuery.data?.state.handover?.status === "Transmis";
  const quizPassed = quizBest?.passed === true;

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
            Phase {phase} · modèle supervision-doc-v1 · evidence m5-session-v2 · score{" "}
            {stateQuery.data?.finalScore ?? 0}/100 · {completedCount}/31
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {M5_DOC_PHASE_LABELS.map((label, idx) => {
              const done = idx < activePhase || (closed && idx <= 4);
              const current = idx === activePhase && !closed;
              return (
                <span
                  key={label}
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border ${
                    done
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : current
                        ? "bg-purple-50 text-purple-800 border-purple-300"
                        : "bg-slate-50 text-slate-500 border-slate-200"
                  }`}
                >
                  {label}
                </span>
              );
            })}
          </div>

          {journal && <M5DocJournalBoard journal={journal} />}
          {interactionQuery.data && !closed && (
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
          {closed && (
            <div className="space-y-3 rounded border border-emerald-200 bg-emerald-50/60 p-3">
              <p className="text-sm font-semibold text-emerald-900">
                Post-M5 transmis · mission documentaire terminée ({completedCount}/31 ·{" "}
                {stateQuery.data?.finalScore ?? 0}/100)
              </p>
              {!quizPassed ? (
                <Button onClick={() => navigate("/student/quiz/5")}>Passer au Quiz M5</Button>
              ) : (
                <Button onClick={() => navigate("/student/certifications")}>
                  Voir la conclusion du cours
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
