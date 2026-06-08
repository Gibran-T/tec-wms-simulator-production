type Lang = "FR" | "EN";

export default function FifoLotsDiagram({ lang }: { lang: Lang }) {
  const lots = ["LOT-A", "LOT-B", "LOT-C"];
  return (
    <svg viewBox="0 0 400 100" className="w-full max-h-24" aria-hidden>
      <rect width="400" height="100" fill="#fffbeb" rx="6" stroke="#fde68a" />
      <text x="200" y="18" textAnchor="middle" fill="#92400e" fontSize="10" fontWeight="600">
        {lang === "FR" ? "FIFO — SCN-008 (lot le plus ancien en premier)" : "FIFO — SCN-008 (oldest lot first)"}
      </text>
      {lots.map((lot, i) => (
        <g key={lot}>
          <rect x={30 + i * 120} y="35" width="100" height="45" fill={i === 0 ? "#d97706" : "#fbbf24"} opacity={i === 0 ? 0.9 : 0.4} rx="4" />
          <text x={80 + i * 120} y="58" textAnchor="middle" fill={i === 0 ? "white" : "#78350f"} fontSize="11" fontWeight="700">{lot}</text>
          <text x={80 + i * 120} y="72" textAnchor="middle" fill={i === 0 ? "white" : "#92400e"} fontSize="8">
            {i === 0 ? (lang === "FR" ? "PICK 1er" : "PICK 1st") : ""}
          </text>
        </g>
      ))}
    </svg>
  );
}
