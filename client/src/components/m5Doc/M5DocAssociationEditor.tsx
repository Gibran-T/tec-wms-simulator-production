/**
 * Granular association UI — one source → one target, no prefab full answer.
 */
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

export type AssociationSpec = {
  sources: Array<{ id: string; labelFr: string }>;
  targets: Array<{ id: string; labelFr: string }>;
  /** Optional: after submit, show per-source feedback */
  correctMap?: Record<string, string>;
};

type Props = {
  spec: AssociationSpec;
  disabled?: boolean;
  onSubmit: (payload: Record<string, string>) => void;
  lastFeedback?: { payload: Record<string, string>; correctMap: Record<string, string> } | null;
};

export function M5DocAssociationEditor({ spec, disabled, onSubmit, lastFeedback }: Props) {
  const [map, setMap] = useState<Record<string, string>>({});

  const complete = useMemo(
    () => spec.sources.every((s) => !!map[s.id]),
    [map, spec.sources],
  );

  return (
    <div className="space-y-3" role="group" aria-label="Association granulaire">
      {spec.sources.map((source) => {
        const selected = map[source.id] ?? "";
        const expected = lastFeedback?.correctMap?.[source.id];
        const chosen = lastFeedback?.payload?.[source.id];
        const rowFeedback =
          expected && chosen ? (expected === chosen ? "correct" : "incorrect") : null;
        return (
          <div key={source.id} className="rounded border border-border p-3 space-y-2">
            <label className="text-xs font-semibold block" htmlFor={`assoc-${source.id}`}>
              {source.labelFr}
            </label>
            <select
              id={`assoc-${source.id}`}
              className="w-full border rounded px-2 py-1.5 text-xs bg-background"
              disabled={disabled}
              value={selected}
              aria-label={`Associer ${source.labelFr}`}
              onChange={(e) => setMap((prev) => ({ ...prev, [source.id]: e.target.value }))}
            >
              <option value="">— Choisir —</option>
              {spec.targets.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.labelFr}
                </option>
              ))}
            </select>
            {rowFeedback && (
              <p
                className={
                  rowFeedback === "correct" ? "text-[11px] text-emerald-700" : "text-[11px] text-amber-700"
                }
              >
                {rowFeedback === "correct"
                  ? "Association correcte"
                  : `Attendu : ${spec.targets.find((t) => t.id === expected)?.labelFr ?? expected}`}
              </p>
            )}
          </div>
        );
      })}
      {!complete && (
        <p className="text-[11px] text-muted-foreground">
          Associez chaque élément avant de valider.
        </p>
      )}
      <Button
        disabled={disabled || !complete}
        onClick={() => onSubmit({ ...map })}
        aria-disabled={disabled || !complete}
      >
        Valider les associations
      </Button>
    </div>
  );
}

export const PRE_ASSOCIATION_SPECS: Record<string, AssociationSpec> = {
  "INT-PRE-01": {
    sources: [
      { id: "s1", labelFr: "Compléter chargement 143 avant 05:45" },
      { id: "s2", labelFr: "Température 144 hors consigne" },
      { id: "s3", labelFr: "Envoyer l'équipe sécuriser et corriger 144" },
      { id: "s4", labelFr: "Reporter le départ 117 si scellé non confirmé" },
    ],
    targets: [
      { id: "DEMANDE", labelFr: "Demande" },
      { id: "ECART", labelFr: "Écart" },
      { id: "INTERVENTION", labelFr: "Intervention" },
      { id: "DECISION", labelFr: "Décision" },
    ],
    correctMap: { s1: "DEMANDE", s2: "ECART", s3: "INTERVENTION", s4: "DECISION" },
  },
  "INT-PRE-02": {
    sources: [
      { id: "DEMANDE", labelFr: "Nature : Demande" },
      { id: "ECART", labelFr: "Nature : Écart" },
      { id: "INTERVENTION", labelFr: "Nature : Intervention" },
      { id: "TRANSMISSION", labelFr: "Nature : Transmission de fin de quart" },
    ],
    targets: [
      { id: "FICHE_DEMANDE", labelFr: "Fiche de demande opérationnelle" },
      { id: "FICHE_ECART", labelFr: "Fiche d'écart / incident" },
      { id: "ORDRE_INTERVENTION", labelFr: "Ordre d'intervention" },
      { id: "HANDOVER", labelFr: "Fiche de clôture / handover" },
    ],
    correctMap: {
      DEMANDE: "FICHE_DEMANDE",
      ECART: "FICHE_ECART",
      INTERVENTION: "ORDRE_INTERVENTION",
      TRANSMISSION: "HANDOVER",
    },
  },
  "INT-PRE-03": {
    sources: [
      { id: "froid", labelFr: "Risque : intégrité produit froid" },
      { id: "departClient", labelFr: "Risque : engagement départ client" },
      { id: "cour", labelFr: "Risque : fluidité cour" },
    ],
    targets: [
      { id: "P1", labelFr: "P1" },
      { id: "P2", labelFr: "P2" },
      { id: "P3", labelFr: "P3" },
    ],
    correctMap: { froid: "P1", departClient: "P2", cour: "P3" },
  },
};
