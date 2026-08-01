import { trpc } from "@/lib/trpc";

export function M5DocProfessorPanel({ runId }: { runId: number }) {
  const q = trpc.m5Doc.getProfessorView.useQuery({ runId });

  if (q.isLoading) return <p className="text-xs text-muted-foreground p-3">Chargement Professor View DOC…</p>;
  if (q.error) {
    return (
      <div className="p-3 text-xs text-destructive border border-destructive/30 rounded">
        {q.error.message}
      </div>
    );
  }
  const v = q.data;
  if (!v) return null;

  return (
    <div className="space-y-4 p-3 text-xs" data-testid="m5-doc-professor-panel">
      <div className="flex flex-wrap gap-3 items-baseline">
        <h2 className="text-sm font-bold">M5 DOC — Professor View</h2>
        <span className="text-muted-foreground">
          Run #{v.runId} · {v.scnCode} · {v.phase} · score {v.finalScore}/100
        </span>
        <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">{v.interactionModel}</span>
        <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">{v.evidenceVersion}</span>
      </div>

      <section>
        <h3 className="font-semibold mb-1">Progression (31)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
          {v.byInteraction.map((i) => (
            <div key={i.id} className="border rounded px-2 py-1">
              <div className="font-mono">{i.id}</div>
              <div className={i.submitted ? (i.correct ? "text-emerald-700" : "text-amber-700") : "text-muted-foreground"}>
                {i.submitted ? (i.correct ? "OK" : "KO") : "—"} · {i.points ?? 0} pts
              </div>
              {i.tags && i.tags.length > 0 && (
                <div className="text-[10px] text-destructive">{i.tags.join(", ")}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-3">
        <div className="border rounded p-2">
          <h3 className="font-semibold mb-1">Statuts</h3>
          <ul className="space-y-0.5">
            {v.statusHistory.map((s) => (
              <li key={s.entityId}>
                <span className="font-mono">{s.entityId}</span> → {s.status}
              </li>
            ))}
          </ul>
        </div>
        <div className="border rounded p-2">
          <h3 className="font-semibold mb-1">Responsables / contrôles / preuves</h3>
          {Object.keys(v.owners).map((id) => (
            <div key={id} className="mb-1">
              <span className="font-mono">{id}</span>: {v.owners[id] ?? "—"} · ctrl {v.controls[id] ?? "—"}
            </div>
          ))}
        </div>
        <div className="border rounded p-2">
          <h3 className="font-semibold mb-1">Surveillance / mouvements</h3>
          <p>Watch: {v.watchlist.join(", ") || "—"}</p>
          <p>Réaffectations: {v.reassignments.join(", ") || "—"}</p>
          <p>Escalades: {v.escalations.join(", ") || "—"}</p>
          <p>Risques: {v.residualRisks.join(", ") || "—"}</p>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-3">
        <div className="border rounded p-2">
          <h3 className="font-semibold mb-1">Compétences</h3>
          <pre className="whitespace-pre-wrap">{JSON.stringify(v.competenceScores, null, 2)}</pre>
        </div>
        <div className="border rounded p-2">
          <h3 className="font-semibold mb-1">Cohérence / handover</h3>
          <p>Delta cohérence: {v.chainCoherence.scoreDelta}</p>
          <p>Flags: {v.chainCoherence.flags.join(", ") || "—"}</p>
          <p>
            Handover: {v.handoverQuality.status} · hint {v.handoverQuality.scoreHint}
          </p>
          <p>Contradictions: {v.handoverQuality.contradictions.join(", ") || "—"}</p>
        </div>
      </section>

      <section>
        <h3 className="font-semibold mb-1">Chronologie (append-only)</h3>
        <div className="max-h-64 overflow-auto border rounded">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b text-left">
                <th className="p-1">Quand</th>
                <th className="p-1">Interaction</th>
                <th className="p-1">Mode</th>
                <th className="p-1">Résultat</th>
                <th className="p-1">Tags</th>
              </tr>
            </thead>
            <tbody>
              {v.timeline.map((e, idx) => (
                <tr key={`${e.interactionId}-${idx}`} className="border-b border-border/50">
                  <td className="p-1 font-mono">{e.at}</td>
                  <td className="p-1">{e.interactionId}</td>
                  <td className="p-1">{e.mode}</td>
                  <td className="p-1">{e.correct ? "OK" : "KO"} ({e.points})</td>
                  <td className="p-1">{e.tags.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
