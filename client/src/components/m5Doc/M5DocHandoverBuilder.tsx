import { Button } from "@/components/ui/button";

type Inheritance = {
  demands: Record<string, { status?: string; owner?: string | null; reassignment?: unknown; escalation?: unknown }>;
  gaps: Record<string, { status?: string }>;
  interventions: Record<string, unknown>;
  arbitration?: { residualRiskIds?: string[]; controls?: Record<string, string> } | unknown;
};

export function M5DocHandoverBuilder({
  inheritance,
  disabled,
  onSubmit,
}: {
  inheritance: Inheritance;
  disabled?: boolean;
  onSubmit: (payload: unknown) => void;
}) {
  const stillOpen = Object.entries(inheritance.demands)
    .filter(([, d]) => d.status !== "Cloturee")
    .map(([id]) => id);
  const closedWithProof = Object.entries(inheritance.demands)
    .filter(([, d]) => d.status === "Cloturee")
    .map(([id]) => id);
  const gaps = Object.keys(inheritance.gaps);
  const interventions = Object.keys(inheritance.interventions);
  const reassignments = Object.entries(inheritance.demands)
    .filter(([, d]) => !!d.reassignment)
    .map(([id]) => id);
  const escalations = Object.entries(inheritance.demands)
    .filter(([, d]) => !!d.escalation)
    .map(([id]) => id);
  const underWatch = [
    ...Object.entries(inheritance.demands)
      .filter(([, d]) => d.status === "Sous surveillance")
      .map(([id]) => id),
    ...Object.entries(inheritance.gaps)
      .filter(([, g]) => g.status === "Sous surveillance")
      .map(([id]) => id),
  ];
  const arb = (inheritance.arbitration ?? {}) as {
    residualRiskIds?: string[];
    controls?: Record<string, string>;
  };
  const nextOwners: Record<string, string> = {};
  const remainingControls: Record<string, string> = {};
  for (const id of stillOpen) {
    nextOwners[id] = inheritance.demands[id]?.owner ?? "chefQuai";
    remainingControls[id] = arb.controls?.[id] ?? "controle_suivi";
  }

  const payload = {
    closedWithProof,
    stillOpen,
    gaps,
    interventions,
    reassignments,
    escalations,
    underWatch,
    nextOwners,
    remainingControls,
    nextShiftPriority: stillOpen.includes("D-117") ? "D-117" : stillOpen[0] ?? "D-143",
    residualRisks: (arb.residualRiskIds ?? ["retard_143", "conformite_117", "derive_144"]).filter(
      (r) => r !== "aucun",
    ),
  };

  return (
    <div className="space-y-3 text-xs">
      <pre className="rounded border bg-muted/30 p-3 overflow-auto max-h-64">
        {JSON.stringify(payload, null, 2)}
      </pre>
      <Button disabled={disabled} onClick={() => onSubmit(payload)}>
        Transmettre le handover
      </Button>
    </div>
  );
}
