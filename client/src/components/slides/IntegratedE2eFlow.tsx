type Lang = "FR" | "EN";

export default function IntegratedE2eFlow({ lang }: { lang: Lang }) {
  const steps =
    lang === "FR"
      ? ["Fournisseur", "Réception", "Rangement", "Inventaire", "Réappro", "KPI", "Décision"]
      : ["Supplier", "Receiving", "Putaway", "Inventory", "Replenish", "KPI", "Decision"];
  return (
    <svg viewBox="0 0 640 110" className="w-full max-h-28" aria-hidden>
      <rect width="640" height="110" fill="#1e1b4b" rx="6" />
      <text x="320" y="18" textAnchor="middle" fill="#a5b4fc" fontSize="10" fontWeight="600">
        {lang === "FR" ? "SCN-015 → SCN-017 — cycle intégré M5" : "SCN-015 → SCN-017 — M5 integrated cycle"}
      </text>
      {steps.map((s, i) => {
        const x = 15 + i * 88;
        return (
          <g key={s}>
            <rect x={x} y="35" width="78" height="50" fill="#7c3aed" opacity="0.35" stroke="#a78bfa" rx="4" />
            <text x={x + 39} y="65" textAnchor="middle" fill="white" fontSize="9" fontWeight="600">
              {s}
            </text>
            {i < steps.length - 1 && <text x={x + 82} y="62" fill="#c4b5fd" fontSize="12">→</text>}
          </g>
        );
      })}
    </svg>
  );
}
