import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { M5DocMatrixEditor } from "./M5DocMatrixEditor";
import { M5DocHandoverBuilder } from "./M5DocHandoverBuilder";
import { M5DocAssociationEditor, PRE_ASSOCIATION_SPECS } from "./M5DocAssociationEditor";

type Def = {
  id: string;
  format: string;
  titleFr: string;
  promptFr: string;
  options: Array<{ id: string; labelFr: string }>;
};

type Props = {
  def: Def;
  inheritance: {
    demands: Record<string, unknown>;
    gaps: Record<string, unknown>;
    interventions: Record<string, unknown>;
    journalView: unknown;
    arbitration?: unknown;
  };
  alreadyScored: boolean;
  disabled?: boolean;
  onSubmit: (payload: unknown) => void;
};

const CONTROL_ASSOC = {
  sources: [
    { id: "D-117", labelFr: "D-117" },
    { id: "D-143", labelFr: "D-143" },
    { id: "D-144", labelFr: "D-144" },
  ],
  targets: [
    { id: "preuve_scelle", labelFr: "Preuve scellé avant départ" },
    { id: "palettes_zero", labelFr: "0 palette avant 05:45" },
    { id: "relecture_temp", labelFr: "Re-lecture température avant 06:00" },
  ],
  correctMap: {
    "D-117": "preuve_scelle",
    "D-143": "palettes_zero",
    "D-144": "relecture_temp",
  },
};

export function M5DocInteractionPanel({ def, inheritance, alreadyScored, disabled, onSubmit }: Props) {
  const [selected, setSelected] = useState<string>("");
  const [multi, setMulti] = useState<string[]>([]);
  const [assocFeedback, setAssocFeedback] = useState<{
    payload: Record<string, string>;
    correctMap: Record<string, string>;
  } | null>(null);

  const optionButtons = useMemo(() => def.options ?? [], [def.options]);
  const preSpec = PRE_ASSOCIATION_SPECS[def.id];

  if (preSpec || def.id === "INT-017-04") {
    const spec = preSpec ?? CONTROL_ASSOC;
    return (
      <div className="space-y-3">
        <Header def={def} alreadyScored={alreadyScored} />
        <M5DocAssociationEditor
          spec={spec}
          disabled={disabled || alreadyScored}
          lastFeedback={assocFeedback}
          onSubmit={(payload) => {
            setAssocFeedback({ payload, correctMap: spec.correctMap ?? {} });
            onSubmit(payload);
          }}
        />
      </div>
    );
  }

  if (def.format === "matrix_3x2") {
    return (
      <div className="space-y-3">
        <Header def={def} alreadyScored={alreadyScored} />
        <M5DocMatrixEditor disabled={disabled || alreadyScored} onSubmit={onSubmit} />
      </div>
    );
  }

  if (def.format === "structured_handover") {
    return (
      <div className="space-y-3">
        <Header def={def} alreadyScored={alreadyScored} />
        <M5DocHandoverBuilder
          inheritance={inheritance as never}
          disabled={disabled || alreadyScored}
          onSubmit={onSubmit}
        />
      </div>
    );
  }

  if (def.format === "posture_combo") {
    return (
      <div className="space-y-3">
        <Header def={def} alreadyScored={alreadyScored} />
        <div className="grid gap-2">
          <label className="text-xs font-semibold" htmlFor="posture">
            Posture
          </label>
          <PostureComboForm disabled={disabled || alreadyScored} onSubmit={onSubmit} />
        </div>
      </div>
    );
  }

  if (def.format === "ranking") {
    return (
      <div className="space-y-3">
        <Header def={def} alreadyScored={alreadyScored} />
        <RankingEditor disabled={disabled || alreadyScored} onSubmit={onSubmit} />
      </div>
    );
  }

  if (def.format === "multi_select_bounded") {
    return (
      <div className="space-y-3">
        <Header def={def} alreadyScored={alreadyScored} />
        <div className="flex flex-wrap gap-2">
          {optionButtons.map((o) => {
            const active = multi.includes(o.id);
            return (
              <Button
                key={o.id}
                size="sm"
                variant={active ? "default" : "outline"}
                disabled={disabled || alreadyScored}
                onClick={() =>
                  setMulti((prev) => (prev.includes(o.id) ? prev.filter((x) => x !== o.id) : [...prev, o.id]))
                }
              >
                {o.labelFr}
              </Button>
            );
          })}
        </div>
        <Button disabled={disabled || alreadyScored || multi.length === 0} onClick={() => onSubmit(multi)}>
          Valider
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Header def={def} alreadyScored={alreadyScored} />
      <div className="flex flex-col gap-2" role="radiogroup" aria-label={def.titleFr}>
        {optionButtons.map((o) => (
          <Button
            key={o.id}
            variant={selected === o.id ? "default" : "outline"}
            disabled={disabled || alreadyScored}
            onClick={() => setSelected(o.id)}
            className="justify-start"
            role="radio"
            aria-checked={selected === o.id}
          >
            {o.labelFr}
          </Button>
        ))}
      </div>
      <Button disabled={disabled || alreadyScored || !selected} onClick={() => onSubmit(selected)}>
        Valider
      </Button>
    </div>
  );
}

function Header({ def, alreadyScored }: { def: Def; alreadyScored: boolean }) {
  return (
    <div>
      <div className="text-sm font-semibold">{def.titleFr}</div>
      <p className="text-xs text-muted-foreground mt-1">{def.promptFr}</p>
      {alreadyScored && (
        <p className="text-xs text-amber-700 mt-1">Tentative officielle déjà enregistrée (score-once).</p>
      )}
    </div>
  );
}

function PostureComboForm({
  disabled,
  onSubmit,
}: {
  disabled?: boolean;
  onSubmit: (payload: unknown) => void;
}) {
  const [posture, setPosture] = useState("SOUS_SURVEILLANCE");
  const [keepOwner, setKeepOwner] = useState("technicienFrigo");
  const [minutes, setMinutes] = useState("15");
  const [requireProof, setRequireProof] = useState(true);

  return (
    <div className="space-y-2 text-xs">
      <select
        id="posture"
        className="w-full border rounded px-2 py-1.5 bg-background"
        disabled={disabled}
        value={posture}
        onChange={(e) => setPosture(e.target.value)}
        aria-label="Posture"
      >
        <option value="SOUS_SURVEILLANCE">Maintenir sous surveillance</option>
        <option value="REAFFECTER">Réaffecter</option>
        <option value="ESCALADER">Escalader</option>
      </select>
      <select
        className="w-full border rounded px-2 py-1.5 bg-background"
        disabled={disabled}
        value={keepOwner}
        onChange={(e) => setKeepOwner(e.target.value)}
        aria-label="Responsable"
      >
        <option value="technicienFrigo">Conserver technicien frigo</option>
        <option value="equipeQuai">Équipe quai</option>
        <option value="chefQuai">Chef de quai</option>
      </select>
      <label className="flex items-center gap-2">
        Re-lecture (minutes)
        <input
          type="number"
          className="border rounded px-2 py-1 w-20 bg-background"
          disabled={disabled}
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          aria-label="Délai de re-lecture en minutes"
        />
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          disabled={disabled}
          checked={requireProof}
          onChange={(e) => setRequireProof(e.target.checked)}
        />
        Exiger preuve 2–4 °C avant clôture
      </label>
      <Button
        disabled={disabled}
        onClick={() =>
          onSubmit({
            posture,
            keepOwner,
            nextControlMinutes: Number(minutes),
            requireProofBeforeClose: requireProof,
            proofBand: [2, 4],
          })
        }
      >
        Valider la posture
      </Button>
    </div>
  );
}

function RankingEditor({
  disabled,
  onSubmit,
}: {
  disabled?: boolean;
  onSubmit: (payload: unknown) => void;
}) {
  const [order, setOrder] = useState(["D-117", "D-143", "D-144"]);
  const move = (idx: number, dir: -1 | 1) => {
    const next = [...order];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    const tmp = next[idx]!;
    next[idx] = next[j]!;
    next[j] = tmp;
    setOrder(next);
  };
  return (
    <div className="space-y-2">
      {order.map((id, idx) => (
        <div key={id} className="flex items-center gap-2 text-xs">
          <span className="font-mono w-6">{idx + 1}.</span>
          <span className="flex-1">{id}</span>
          <Button size="sm" variant="outline" disabled={disabled || idx === 0} onClick={() => move(idx, -1)}>
            ↑
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={disabled || idx === order.length - 1}
            onClick={() => move(idx, 1)}
          >
            ↓
          </Button>
        </div>
      ))}
      <Button disabled={disabled} onClick={() => onSubmit(order)}>
        Valider le classement
      </Button>
    </div>
  );
}
