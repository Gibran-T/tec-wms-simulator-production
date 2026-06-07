type Lang = "FR" | "EN";

export default function KpiDashboardVisual({ lang }: { lang: Lang }) {
  const tiles = [
    { label: "OTIF", val: "96%", color: "#0070f2" },
    { label: "Fill Rate", val: "94%", color: "#107e3e" },
    { label: "DSI", val: "42j", color: "#e9730c" },
    { label: "LPH", val: "128", color: "#7b1fa2" },
  ];
  return (
    <svg viewBox="0 0 480 120" className="w-full max-h-28" aria-hidden>
      <rect width="480" height="120" fill="#0f2a44" rx="6" />
      <text x="240" y="20" textAnchor="middle" fill="#94a3b8" fontSize="10">
        {lang === "FR" ? "Tableau de bord KPI — Module 4" : "KPI Dashboard — Module 4"}
      </text>
      {tiles.map((t, i) => {
        const x = 30 + i * 110;
        return (
          <g key={t.label}>
            <rect x={x} y="35" width="95" height="65" fill={t.color} opacity="0.2" stroke={t.color} rx="4" />
            <text x={x + 47} y="58" textAnchor="middle" fill="white" fontSize="10" opacity="0.7">
              {t.label}
            </text>
            <text x={x + 47} y="82" textAnchor="middle" fill="white" fontSize="16" fontWeight="700">
              {t.val}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
