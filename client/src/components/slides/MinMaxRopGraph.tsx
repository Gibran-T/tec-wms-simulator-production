/**
 * Slides 2.0 pilot — M3 Min/Max/ROP inventory level graph (inline SVG).
 * Values align with modules.ts M3 slide 3 example: SS=20, ROP=70, Max=270.
 */

type Lang = "FR" | "EN";

interface MinMaxRopGraphProps {
  lang: Lang;
  accentColor?: string;
}

const MAX_STOCK = 270;
const ROP = 70;
const MIN_LEVEL = 70; // Min = ROP per TEC.LOG M3 pedagogy
const SAFETY_STOCK = 20;
const Y_SCALE = 300;

// Chart layout
const PAD = { l: 56, t: 24, r: 120, b: 44 };
const W = 640;
const H = 300;
const plotW = W - PAD.l - PAD.r;
const plotH = H - PAD.t - PAD.b;

function yPos(stock: number): number {
  return PAD.t + plotH - (stock / Y_SCALE) * plotH;
}

function xPos(t: number, periods: number): number {
  return PAD.l + (t / periods) * plotW;
}

/** Sawtooth stock curve: consume to ROP, then replenishment jump to Max. */
function buildStockPath(periods: number): string {
  const segments: string[] = [];
  let x = 0;
  let stock = MAX_STOCK;
  segments.push(`M ${xPos(x, periods)} ${yPos(stock)}`);

  const consumeSteps = 3;
  const dropPerStep = (MAX_STOCK - ROP) / consumeSteps;

  for (let cycle = 0; cycle < 2; cycle++) {
    stock = MAX_STOCK;
    for (let s = 0; s < consumeSteps; s++) {
      x += 1;
      stock -= dropPerStep;
      segments.push(`L ${xPos(x, periods)} ${yPos(stock)}`);
    }
    x += 1;
    segments.push(`L ${xPos(x, periods)} ${yPos(ROP)}`);
    segments.push(`L ${xPos(x, periods)} ${yPos(MAX_STOCK)}`);
    stock = MAX_STOCK;
  }

  x += 1;
  stock = MAX_STOCK - dropPerStep;
  segments.push(`L ${xPos(x, periods)} ${yPos(stock)}`);

  return segments.join(" ");
}

const labels = {
  time: { FR: "Temps", EN: "Time" },
  stock: { FR: "Stock (unités)", EN: "Stock (units)" },
  max: { FR: "Max", EN: "Max" },
  rop: { FR: "ROP", EN: "ROP" },
  min: { FR: "Min", EN: "Min" },
  ssZone: { FR: "Zone Safety Stock", EN: "Safety Stock zone" },
  stockCurve: { FR: "Courbe de stock", EN: "Stock curve" },
  reorder: { FR: "Commande déclenchée", EN: "Order triggered" },
  example: {
    FR: "Ex. SKU · SS=20 · ROP=70 · Max=270 (commande 200 u.)",
    EN: "Ex. SKU · SS=20 · ROP=70 · Max=270 (order 200 u.)",
  },
};

export default function MinMaxRopGraph({ lang, accentColor = "#F59E0B" }: MinMaxRopGraphProps) {
  const l = (key: keyof typeof labels) =>
    typeof labels[key] === "object" && "FR" in (labels[key] as object)
      ? (labels[key] as { FR: string; EN: string })[lang]
      : "";

  const periods = 8;
  const stockPath = buildStockPath(periods);
  const ssTop = yPos(SAFETY_STOCK);
  const ssBottom = yPos(0);
  const ropY = yPos(ROP);
  const maxY = yPos(MAX_STOCK);
  const triggerX = xPos(3, periods);

  return (
    <div className="w-full" role="img" aria-label={l("example")}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto max-h-[340px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Safety Stock zone */}
        <rect
          x={PAD.l}
          y={ssTop}
          width={plotW}
          height={ssBottom - ssTop}
          fill={accentColor}
          fillOpacity={0.12}
          stroke={accentColor}
          strokeOpacity={0.35}
          strokeWidth={1}
        />
        <text
          x={PAD.l + 8}
          y={ssTop + (ssBottom - ssTop) / 2 + 4}
          className="fill-foreground"
          fontSize={10}
          fontFamily="'IBM Plex Mono', monospace"
          opacity={0.75}
        >
          {l("ssZone")}
        </text>

        {/* Horizontal reference lines */}
        <line x1={PAD.l} y1={maxY} x2={PAD.l + plotW} y2={maxY} stroke="#EF4444" strokeWidth={2} strokeDasharray="none" />
        <line x1={PAD.l} y1={ropY} x2={PAD.l + plotW} y2={ropY} stroke={accentColor} strokeWidth={2} strokeDasharray="6 4" />

        {/* Right-side line labels */}
        <text x={PAD.l + plotW + 8} y={maxY + 4} fill="#EF4444" fontSize={11} fontWeight="600" fontFamily="'Space Grotesk', sans-serif">
          {l("max")} = {MAX_STOCK}
        </text>
        <text x={PAD.l + plotW + 8} y={ropY + 4} fill={accentColor} fontSize={11} fontWeight="600" fontFamily="'Space Grotesk', sans-serif">
          {l("min")} / {l("rop")} = {MIN_LEVEL}
        </text>

        {/* Stock curve */}
        <path
          d={stockPath}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinejoin="round"
          className="text-foreground"
        />

        {/* Reorder marker at ROP */}
        <circle cx={triggerX} cy={ropY} r={5} fill={accentColor} stroke="white" strokeWidth={1.5} />
        <text
          x={triggerX}
          y={ropY - 10}
          textAnchor="middle"
          fontSize={9}
          fill={accentColor}
          fontFamily="'IBM Plex Mono', monospace"
          fontWeight="600"
        >
          {l("reorder")}
        </text>

        {/* Axes */}
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + plotH} stroke="currentColor" strokeOpacity={0.35} strokeWidth={1} />
        <line x1={PAD.l} y1={PAD.t + plotH} x2={PAD.l + plotW} y2={PAD.t + plotH} stroke="currentColor" strokeOpacity={0.35} strokeWidth={1} />

        <text
          x={PAD.l + plotW / 2}
          y={H - 8}
          textAnchor="middle"
          className="fill-muted-foreground"
          fontSize={11}
          fontFamily="'Space Grotesk', sans-serif"
        >
          {l("time")}
        </text>
        <text
          x={14}
          y={PAD.t + plotH / 2}
          textAnchor="middle"
          transform={`rotate(-90, 14, ${PAD.t + plotH / 2})`}
          className="fill-muted-foreground"
          fontSize={11}
          fontFamily="'Space Grotesk', sans-serif"
        >
          {l("stock")}
        </text>

        {/* Y-axis ticks */}
        {[0, SAFETY_STOCK, ROP, MAX_STOCK].map((v) => (
          <g key={v}>
            <line
              x1={PAD.l - 4}
              y1={yPos(v)}
              x2={PAD.l}
              y2={yPos(v)}
              stroke="currentColor"
              strokeOpacity={0.25}
            />
            <text
              x={PAD.l - 8}
              y={yPos(v) + 4}
              textAnchor="end"
              className="fill-muted-foreground"
              fontSize={9}
              fontFamily="'IBM Plex Mono', monospace"
            >
              {v}
            </text>
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 px-1 text-[11px] font-mono text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-0.5 bg-red-500 rounded" />
          {l("max")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-0.5 rounded" style={{ backgroundColor: accentColor }} />
          {l("rop")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-0.5 bg-blue-500 opacity-60 rounded" />
          {l("min")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm opacity-40" style={{ backgroundColor: accentColor }} />
          {l("ssZone")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-0.5 bg-foreground rounded" />
          {l("stockCurve")}
        </span>
      </div>
      <p className="text-[10px] text-muted-foreground mt-1.5 px-1 font-mono">{l("example")}</p>
    </div>
  );
}
