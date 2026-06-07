type Lang = "FR" | "EN";

export default function WarehouseZonesDiagram({ lang }: { lang: Lang }) {
  const zones =
    lang === "FR"
      ? [
          { x: 30, label: "RÉCEPTION", color: "#2563eb" },
          { x: 200, label: "STOCKAGE", color: "#059669" },
          { x: 370, label: "PICKING", color: "#d97706" },
          { x: 540, label: "EXPÉDITION", color: "#7c3aed" },
        ]
      : [
          { x: 30, label: "RECEIVING", color: "#2563eb" },
          { x: 200, label: "STORAGE", color: "#059669" },
          { x: 370, label: "PICKING", color: "#d97706" },
          { x: 540, label: "SHIPPING", color: "#7c3aed" },
        ];
  return (
    <svg viewBox="0 0 680 140" className="w-full max-h-36" aria-hidden>
      <rect width="680" height="140" fill="#f8fafc" rx="6" stroke="#e2e8f0" />
      {zones.map((z, i) => (
        <g key={z.label}>
          <rect x={z.x} y="40" width="130" height="70" fill={z.color} opacity="0.15" stroke={z.color} strokeWidth="2" rx="4" />
          <text x={z.x + 65} y="78" textAnchor="middle" fill={z.color} fontSize="12" fontWeight="700">
            {z.label}
          </text>
          {i < zones.length - 1 && (
            <line x1={z.x + 135} y1="75" x2={zones[i + 1].x - 5} y2="75" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />
          )}
        </g>
      ))}
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
        </marker>
      </defs>
      <text x="340" y="22" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="600">
        {lang === "FR" ? "Architecture entrepôt — zones et flux" : "Warehouse architecture — zones and flow"}
      </text>
    </svg>
  );
}
