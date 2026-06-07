type Lang = "FR" | "EN";

export default function WarehouseMacroFlow({ lang, accentColor = "#0070f2" }: { lang: Lang; accentColor?: string }) {
  const steps =
    lang === "FR"
      ? ["PO", "GR", "Putaway", "SO", "Picking", "GI", "CC", "Compliance"]
      : ["PO", "GR", "Putaway", "SO", "Picking", "GI", "CC", "Compliance"];
  return (
    <svg viewBox="0 0 720 120" className="w-full max-h-32" aria-hidden>
      <rect x="0" y="0" width="720" height="120" fill="#0f2a44" rx="6" />
      {steps.map((s, i) => {
        const x = 20 + i * 86;
        return (
          <g key={s}>
            <rect x={x} y="40" width="72" height="40" fill={accentColor} opacity="0.9" rx="4" />
            <text x={x + 36} y="65" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">
              {s}
            </text>
            {i < steps.length - 1 && (
              <polygon points={`${x + 76},60 ${x + 84},55 ${x + 84},65`} fill="#94a3b8" />
            )}
          </g>
        );
      })}
      <text x="360" y="22" textAnchor="middle" fill="#94a3b8" fontSize="10">
        {lang === "FR" ? "Cycle transactionnel M1 — flux ERP/WMS" : "M1 transactional cycle — ERP/WMS flow"}
      </text>
    </svg>
  );
}
