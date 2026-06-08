type Lang = "FR" | "EN";

export default function PutawayFlowDiagram({ lang }: { lang: Lang }) {
  return (
    <svg viewBox="0 0 480 100" className="w-full max-h-24" aria-hidden>
      <rect width="480" height="100" fill="#eff6ff" rx="6" stroke="#bfdbfe" />
      <text x="240" y="18" textAnchor="middle" fill="#1e40af" fontSize="10" fontWeight="600">
        {lang === "FR" ? "Putaway LT01 — SCN-006" : "Putaway LT01 — SCN-006"}
      </text>
      {[
        { x: 20, label: "REC-01", sub: lang === "FR" ? "Quai" : "Dock" },
        { x: 140, label: "LT01", sub: lang === "FR" ? "Transfert" : "Transfer" },
        { x: 260, label: "STOCKAGE", sub: lang === "FR" ? "Bin valide" : "Valid bin" },
        { x: 380, label: "✓", sub: "FIFO" },
      ].map((s, i) => (
        <g key={s.label}>
          <rect x={s.x} y="35" width="90" height="45" fill="#2563eb" opacity="0.15" stroke="#2563eb" rx="4" />
          <text x={s.x + 45} y="55" textAnchor="middle" fill="#1e40af" fontSize="11" fontWeight="700">{s.label}</text>
          <text x={s.x + 45} y="70" textAnchor="middle" fill="#3b82f6" fontSize="9">{s.sub}</text>
          {i < 3 && <text x={s.x + 95} y="60" fill="#64748b">→</text>}
        </g>
      ))}
    </svg>
  );
}
