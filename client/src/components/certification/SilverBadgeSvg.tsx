/** Institutional Silver badge — SVG, no external assets */

type Props = {
  size?: number;
  className?: string;
  variant?: "full" | "compact";
};

export default function SilverBadgeSvg({ size = 120, className = "", variant = "full" }: Props) {
  const id = `silver-badge-${variant}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      className={className}
      aria-hidden
      role="img"
    >
      <defs>
        <linearGradient id={`${id}-ring`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="35%" stopColor="#e2e8f0" />
          <stop offset="55%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id={`${id}-inner`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Outer ring */}
      <circle cx="80" cy="80" r="76" fill={`url(#${id}-ring)`} filter={`url(#${id}-shadow)`} />
      <circle cx="80" cy="80" r="68" fill="none" stroke="#475569" strokeWidth="1" opacity="0.4" />

      {/* Inner medallion */}
      <circle cx="80" cy="80" r="58" fill={`url(#${id}-inner)`} stroke="#94a3b8" strokeWidth="1.5" />

      {/* Shield */}
      <path
        d="M80 38 L98 48 L98 72 C98 88 80 102 80 102 C80 102 62 88 62 72 L62 48 Z"
        fill="#64748b"
        fillOpacity="0.15"
        stroke="#64748b"
        strokeWidth="1.5"
      />

      {/* Tier label */}
      <text x="80" y="68" textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155" letterSpacing="1">
        SILVER
      </text>
      <text x="80" y="82" textAnchor="middle" fontSize="9" fontWeight="600" fill="#0070f2">
        TEC.LOG
      </text>

      {variant === "full" && (
        <>
          <text x="80" y="96" textAnchor="middle" fontSize="6" fill="#64748b" letterSpacing="0.5">
            COLLÈGE DE LA CONCORDE
          </text>
          {/* Ribbon */}
          <path d="M58 118 L80 128 L102 118 L102 124 L80 134 L58 124 Z" fill="#64748b" opacity="0.85" />
          <text x="80" y="126" textAnchor="middle" fontSize="6" fill="white" fontWeight="600">
            M1 · FONDEMENTS
          </text>
        </>
      )}
    </svg>
  );
}

export function GoldBadgeLockedSvg({ size = 120, className = "" }: { size?: number; className?: string }) {
  const id = "gold-locked";
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" className={`opacity-60 ${className}`} aria-hidden>
      <defs>
        <linearGradient id={`${id}-ring`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ca8a04" />
          <stop offset="50%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#a16207" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="80" r="76" fill={`url(#${id}-ring)`} opacity="0.35" />
      <circle cx="80" cy="80" r="58" fill="#fefce8" fillOpacity="0.5" stroke="#ca8a04" strokeWidth="1" strokeDasharray="4 3" />
      <text x="80" y="72" textAnchor="middle" fontSize="10" fontWeight="700" fill="#92400e" opacity="0.7">
        GOLD
      </text>
      <text x="80" y="86" textAnchor="middle" fontSize="8" fill="#92400e" opacity="0.6">
        TEC.LOG
      </text>
      {/* Lock icon simplified */}
      <rect x="72" y="92" width="16" height="12" rx="2" fill="#92400e" opacity="0.5" />
      <path d="M76 92 L76 88 C76 84 84 84 84 88 L84 92" fill="none" stroke="#92400e" strokeWidth="2" opacity="0.5" />
      <text x="80" y="118" textAnchor="middle" fontSize="7" fontWeight="600" fill="#92400e">
        BIENTÔT
      </text>
    </svg>
  );
}
