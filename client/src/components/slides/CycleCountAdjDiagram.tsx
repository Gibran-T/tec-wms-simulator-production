type Lang = "FR" | "EN";

export default function CycleCountAdjDiagram({ lang }: { lang: Lang }) {
  return (
    <svg viewBox="0 0 520 130" className="w-full max-h-32" aria-hidden>
      <rect width="520" height="130" fill="#f0fdf4" rx="6" stroke="#bbf7d0" />
      {[
        { x: 30, label: lang === "FR" ? "CC MI01" : "CC MI01", sub: lang === "FR" ? "Comptage" : "Count" },
        { x: 150, label: lang === "FR" ? "Écart" : "Variance", sub: "−15 u." },
        { x: 270, label: "ADJ MI07", sub: lang === "FR" ? "Ajustement" : "Adjust" },
        { x: 390, label: lang === "FR" ? "Conformité" : "Compliance", sub: "✓" },
      ].map((s, i) => (
        <g key={s.label}>
          <rect x={s.x} y="35" width="100" height="55" fill="#107e3e" opacity={0.12 + i * 0.05} stroke="#107e3e" rx="4" />
          <text x={s.x + 50} y="58" textAnchor="middle" fill="#065f46" fontSize="11" fontWeight="700">
            {s.label}
          </text>
          <text x={s.x + 50} y="76" textAnchor="middle" fill="#047857" fontSize="10">
            {s.sub}
          </text>
          {i < 3 && <text x={s.x + 108} y="65" fill="#64748b" fontSize="14">→</text>}
        </g>
      ))}
      <text x="260" y="18" textAnchor="middle" fill="#065f46" fontSize="10" fontWeight="600">
        {lang === "FR" ? "SCN-004 / SCN-009 — réconciliation inventaire" : "SCN-004 / SCN-009 — inventory reconciliation"}
      </text>
    </svg>
  );
}
