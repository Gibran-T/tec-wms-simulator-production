import { useState } from "react";
import { Button } from "@/components/ui/button";

const DEMANDS = ["D-117", "D-143", "D-144"] as const;
const RESOURCES = [
  { id: "chefQuai", label: "Chef de quai" },
  { id: "equipeQuai", label: "Équipe quai" },
  { id: "chefQuai+equipeQuai", label: "Chef de quai + équipe quai" },
  { id: "technicienFrigo", label: "Technicien frigo" },
] as const;
const MODES = [
  { id: "TRAITER", label: "Traiter maintenant" },
  { id: "SURVEILLER", label: "Maintenir sous surveillance" },
  { id: "REAFFECTER", label: "Réaffecter la coordination" },
  { id: "ESCALADER", label: "Escalader" },
] as const;

type Row = { demandId: string; resource: string; mode: string };

export function M5DocMatrixEditor({
  disabled,
  onSubmit,
}: {
  disabled?: boolean;
  onSubmit: (payload: Row[]) => void;
}) {
  const [rows, setRows] = useState<Row[]>([
    { demandId: "D-117", resource: "", mode: "" },
    { demandId: "D-143", resource: "", mode: "" },
    { demandId: "D-144", resource: "", mode: "" },
  ]);

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Demande</th>
              <th className="text-left py-2">Ressource</th>
              <th className="text-left py-2">Mode</th>
            </tr>
          </thead>
          <tbody>
            {DEMANDS.map((d, i) => (
              <tr key={d} className="border-b border-border/60">
                <td className="py-2 font-medium">{d}</td>
                <td className="py-2">
                  <select
                    className="border rounded px-2 py-1 bg-background"
                    disabled={disabled}
                    value={rows[i]?.resource}
                    aria-label={`Ressource ${d}`}
                    onChange={(e) => {
                      const next = [...rows];
                      next[i] = { ...next[i]!, demandId: d, resource: e.target.value, mode: next[i]!.mode };
                      setRows(next);
                    }}
                  >
                    <option value="">— Choisir —</option>
                    {RESOURCES.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2">
                  <select
                    className="border rounded px-2 py-1 bg-background"
                    disabled={disabled}
                    value={rows[i]?.mode}
                    aria-label={`Mode ${d}`}
                    onChange={(e) => {
                      const next = [...rows];
                      next[i] = { ...next[i]!, demandId: d, resource: next[i]!.resource, mode: e.target.value };
                      setRows(next);
                    }}
                  >
                    <option value="">— Choisir —</option>
                    {MODES.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button
        disabled={disabled || rows.some((r) => !r.resource || !r.mode)}
        onClick={() => onSubmit(rows)}
      >
        Valider la matrice (combinaison)
      </Button>
    </div>
  );
}
