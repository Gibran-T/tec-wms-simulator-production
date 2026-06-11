/** Shared SAP/Fiori-inspired primitives for premium slide visuals */
import type { ReactNode } from "react";

export function VisualFrame({
  title,
  subtitle,
  accent,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  accent: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex flex-col h-full min-h-[240px] rounded-lg overflow-hidden shadow-sm border border-border/60 bg-card">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0f2a44] shrink-0">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-white truncate">{title}</p>
          {subtitle && <p className="text-[9px] text-white/60 truncate">{subtitle}</p>}
        </div>
        <div className="w-2 h-2 rounded-full shrink-0 ml-2" style={{ backgroundColor: accent }} />
      </div>
      <div className="flex-1 p-4 bg-gradient-to-br from-background via-background to-muted/20">{children}</div>
      {footer && (
        <div className="px-4 py-2 border-t border-border/50 bg-muted/30 text-[9px] text-muted-foreground shrink-0">
          {footer}
        </div>
      )}
    </div>
  );
}

export function FlowPipeline({ steps, accent }: { steps: string[]; accent: string }) {
  return (
    <div className="flex items-center justify-between gap-1 w-full overflow-x-auto py-2">
      {steps.map((step, i) => (
        <div key={`${step}-${i}`} className="flex items-center shrink-0">
          <div
            className="flex flex-col items-center"
            style={{ minWidth: steps.length > 6 ? 52 : 64 }}
          >
            <div
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-white shadow-md"
              style={{ backgroundColor: accent, opacity: 0.85 + (i % 3) * 0.05 }}
            >
              {step.length > 6 ? step.slice(0, 5) : step}
            </div>
            <span className="text-[8px] sm:text-[9px] text-muted-foreground mt-1.5 text-center font-medium max-w-[56px] leading-tight">
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className="flex items-center mx-0.5 sm:mx-1 mb-4">
              <div className="w-3 sm:w-5 h-0.5 rounded" style={{ backgroundColor: accent, opacity: 0.4 }} />
              <div
                className="w-0 h-0 border-t-[4px] border-b-[4px] border-l-[6px] border-transparent"
                style={{ borderLeftColor: accent, opacity: 0.5 }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function FlowVertical({ steps, accent }: { steps: string[]; accent: string }) {
  return (
    <div className="space-y-2">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold text-white shrink-0"
            style={{ backgroundColor: accent, opacity: 0.7 + i * 0.04 }}
          >
            {i + 1}
          </div>
          <div
            className="flex-1 px-3 py-2 rounded-md border text-[11px] font-medium text-foreground shadow-sm"
            style={{ borderColor: `${accent}40`, backgroundColor: `${accent}08` }}
          >
            {step}
          </div>
        </div>
      ))}
    </div>
  );
}

export function KpiTile({
  label,
  value,
  pct,
  accent,
  status,
}: {
  label: string;
  value: string;
  pct: number;
  accent: string;
  status?: "good" | "warn" | "neutral";
}) {
  const barColor = status === "warn" ? "#f59e0b" : status === "good" ? "#059669" : accent;
  return (
    <div className="rounded-lg border border-border/70 bg-card p-3 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
      <p className="text-xl font-bold mt-1 tabular-nums" style={{ color: accent }}>
        {value}
      </p>
      <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: barColor }} />
      </div>
    </div>
  );
}

export function KpiGrid({ tiles, accent }: { tiles: { label: string; value: string; pct: number; status?: "good" | "warn" | "neutral" }[]; accent: string }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {tiles.map((t) => (
        <KpiTile key={t.label} {...t} accent={accent} />
      ))}
    </div>
  );
}

export function WhZone({
  label,
  sub,
  accent,
  x,
  y,
  w,
  h,
}: {
  label: string;
  sub?: string;
  accent: string;
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={6}
        fill="white"
        fillOpacity={0.95}
        stroke={accent}
        strokeWidth={1.5}
        className="dark:fill-slate-800/90"
      />
      <text x={x + w / 2} y={y + h / 2 - (sub ? 4 : 0)} textAnchor="middle" fontSize={11} fontWeight="600" fill={accent}>
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle" fontSize={8} className="fill-muted-foreground">
          {sub}
        </text>
      )}
    </g>
  );
}

export function ScnRow({
  code,
  label,
  status,
  accent,
}: {
  code: string;
  label: string;
  status: "green" | "yellow" | "red";
  accent: string;
}) {
  const statusColor = status === "green" ? "#059669" : status === "yellow" ? "#d97706" : "#dc2626";
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border/60 bg-card shadow-sm">
      <span
        className="text-[10px] font-bold px-2 py-0.5 rounded text-white shrink-0"
        style={{ backgroundColor: accent }}
      >
        {code}
      </span>
      <span className="text-[11px] text-foreground flex-1 leading-snug">{label}</span>
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: statusColor }}
        title={status}
      />
    </div>
  );
}

export function ScnList({ items, accent }: { items: { code: string; label: string; status: "green" | "yellow" | "red" }[]; accent: string }) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <ScnRow key={item.code} {...item} accent={accent} />
      ))}
    </div>
  );
}

export function DocCard({
  title,
  fields,
  accent,
}: {
  title: string;
  fields: { k: string; v: string }[];
  accent: string;
}) {
  return (
    <div className="rounded-lg border border-border/70 bg-card shadow-sm overflow-hidden max-w-xs mx-auto">
      <div className="px-3 py-2 text-[11px] font-semibold text-white" style={{ backgroundColor: accent }}>
        {title}
      </div>
      <div className="p-3 space-y-1.5">
        {fields.map((f) => (
          <div key={f.k} className="flex justify-between text-[10px] gap-2">
            <span className="text-muted-foreground">{f.k}</span>
            <span className="font-mono font-medium text-foreground">{f.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CertBadge({
  tier,
  lines,
}: {
  tier: "silver" | "gold";
  lines: string[];
}) {
  const isGold = tier === "gold";
  const color = isGold ? "#eab308" : "#64748b";
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div
        className="w-28 h-28 rounded-full flex flex-col items-center justify-center border-4 shadow-lg"
        style={{ borderColor: color, backgroundColor: `${color}15` }}
      >
        <span className="text-3xl">{isGold ? "🥇" : "🥈"}</span>
        <span className="text-xs font-bold mt-1" style={{ color }}>
          TEC.LOG {isGold ? "Gold" : "Silver"}
        </span>
      </div>
      <div className="mt-4 space-y-1 text-center max-w-[240px]">
        {lines.map((line) => (
          <p key={line} className="text-[10px] text-muted-foreground leading-snug">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

export function MiniGauge({ label, value, pct, accent }: { label: string; value: string; pct: number; accent: string }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center">
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={r} fill="none" stroke="currentColor" strokeOpacity={0.1} strokeWidth="8" />
        <circle
          cx="44"
          cy="44"
          r={r}
          fill="none"
          stroke={accent}
          strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 44 44)"
        />
        <text x="44" y="48" textAnchor="middle" fontSize="13" fontWeight="bold" fill={accent}>
          {value}
        </text>
      </svg>
      <span className="text-[10px] text-muted-foreground font-medium mt-1">{label}</span>
    </div>
  );
}

export function IntegrationStack({
  layers,
  accent,
}: {
  layers: { mod: string; label: string }[];
  accent: string;
}) {
  return (
    <div className="space-y-1.5">
      {layers.map((l, i) => (
        <div
          key={l.mod}
          className="flex items-center gap-3 px-3 py-2 rounded-md border shadow-sm"
          style={{
            borderColor: `${accent}${40 + i * 10}`,
            backgroundColor: `${accent}${String(8 + i * 2).padStart(2, "0")}`,
            marginLeft: i * 4,
          }}
        >
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: accent }}>
            {l.mod}
          </span>
          <span className="text-[11px] text-foreground">{l.label}</span>
        </div>
      ))}
    </div>
  );
}

export function FioriTileGrid({ labels, accent }: { labels: string[]; accent: string }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {labels.map((label) => (
        <div
          key={label}
          className="aspect-[4/3] rounded-md border flex items-center justify-center text-[9px] font-semibold text-center p-1 shadow-sm"
          style={{ borderColor: `${accent}30`, backgroundColor: `${accent}10`, color: accent }}
        >
          {label}
        </div>
      ))}
    </div>
  );
}
