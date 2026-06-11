import type { SlideVisualType, SlideVisualVariant } from "@/data/slideVisualMap";
import PremiumSlideVisual, { ModulePreviewPremium } from "./visuals/PremiumSlideVisual";

type Props = {
  visualType: SlideVisualType;
  variant?: SlideVisualVariant;
  accent: string;
  moduleId: number;
  slideId: number;
  title: string;
  scenarioMap?: string[];
  compact?: boolean;
};

export function ModulePreviewVisual({ moduleId, accent }: { moduleId: number; accent: string }) {
  return (
    <div className="absolute inset-0 opacity-95">
      <ModulePreviewPremium moduleId={moduleId} accent={accent} />
    </div>
  );
}

export default function SlideVisualPanel({
  visualType,
  variant = "default",
  accent,
  moduleId,
  slideId,
  title,
  scenarioMap,
  compact = false,
}: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-border/70 bg-card shadow-md ${
        compact ? "h-[130px]" : "min-h-[260px] lg:min-h-[320px]"
      }`}
      style={{ borderLeftWidth: 4, borderLeftColor: accent }}
    >
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <span
          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md text-white shadow-sm"
          style={{ backgroundColor: accent }}
        >
          M{moduleId}-{String(slideId).padStart(2, "0")}
        </span>
        <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground bg-background/90 backdrop-blur-sm px-2 py-0.5 rounded-md border border-border/50">
          {visualType}
        </span>
      </div>

      <div className={`w-full ${compact ? "h-[130px] pt-8 px-2 pb-2" : "h-full min-h-[260px] lg:min-h-[320px] pt-10 px-3 pb-3"}`}>
        <PremiumSlideVisual
          moduleId={moduleId}
          slideId={slideId}
          visualType={visualType}
          variant={variant}
          accent={accent}
          title={title}
          scenarioMap={scenarioMap}
        />
      </div>
    </div>
  );
}
