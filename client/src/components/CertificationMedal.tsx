/** Institutional SVG medal — display only (no certification logic). */
export function SilverMedal({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <circle cx="50" cy="50" r="46" fill="url(#silverGrad)" stroke="#94a3b8" strokeWidth="2" />
      <circle cx="50" cy="50" r="38" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
      <text x="50" y="44" textAnchor="middle" fill="#1e293b" fontSize="8" fontWeight="700">
        TEC.LOG
      </text>
      <text x="50" y="56" textAnchor="middle" fill="#334155" fontSize="6" fontWeight="600">
        SILVER
      </text>
      <defs>
        <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="50%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function GoldMedal({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <circle cx="50" cy="50" r="46" fill="url(#goldGrad)" stroke="#b45309" strokeWidth="2" />
      <circle cx="50" cy="50" r="38" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
      <text x="50" y="44" textAnchor="middle" fill="#78350f" fontSize="8" fontWeight="700">
        TEC.LOG
      </text>
      <text x="50" y="56" textAnchor="middle" fill="#92400e" fontSize="6" fontWeight="600">
        GOLD
      </text>
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
    </svg>
  );
}
