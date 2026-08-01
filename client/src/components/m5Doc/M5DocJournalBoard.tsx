type Journal = {
  openIds: string[];
  inProgressIds: string[];
  waitingProofIds: string[];
  closedIds: string[];
  watchIds: string[];
  delayedIds: string[];
};

export function M5DocJournalBoard({ journal }: { journal: Journal }) {
  const rows: Array<[string, string[]]> = [
    ["Ouvertes", journal.openIds],
    ["En cours", journal.inProgressIds],
    ["En attente de preuve", journal.waitingProofIds],
    ["Sous surveillance", journal.watchIds],
    ["Clôturées", journal.closedIds],
    ["En retard", journal.delayedIds],
  ];

  return (
    <div className="grid gap-2 md:grid-cols-3">
      {rows.map(([label, ids]) => (
        <div key={label} className="rounded border border-border px-3 py-2 text-xs">
          <div className="font-semibold mb-1">{label}</div>
          <div className="text-muted-foreground">{ids.length ? ids.join(", ") : "—"}</div>
        </div>
      ))}
    </div>
  );
}
