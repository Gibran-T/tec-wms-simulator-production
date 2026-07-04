import { useState, type ReactNode } from "react";
import type { SlideContent } from "@/data/modules";
import {
  getVlsConceptsLabel,
  getVlsModuleConfig,
  getVlsSectionLabel,
  isScnBodyLine,
  matchesObservationZoneLine,
  type VlsHotspot,
  type VlsModuleConfig,
  type VlsSectionId,
} from "@/data/vlsSlideStandard";
import SlideVisualPanel from "@/components/slides/SlideVisualPanel";
import type { SlideVisualType, SlideVisualVariant } from "@/data/slideVisualMap";
import { ExternalLink, MapPin, MonitorPlay, Target } from "lucide-react";

type Props = {
  slide: SlideContent;
  section: VlsSectionId;
  lang: "FR" | "EN";
  accent: string;
  title: string;
  subtitle?: string;
  body: string[];
  visualType: SlideVisualType;
  visualVariant: SlideVisualVariant;
  moduleId: number;
  renderLine: (line: string, key: number) => ReactNode;
  t: (fr: string, en: string) => string;
};

function HeroImageBlock({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`w-full rounded-xl border border-border/70 shadow-md object-cover ${className}`}
      loading="eager"
    />
  );
}

function BodyCard({
  body,
  renderLine,
  label,
}: {
  body: string[];
  renderLine: (line: string, key: number) => ReactNode;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-card shadow-sm p-5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {label}
      </p>
      <div className="space-y-2">{body.map((line, i) => renderLine(line, i))}</div>
    </div>
  );
}

function HotspotPanel({
  slide,
  lang,
  accent,
  renderLine,
  body,
  t,
  config,
}: {
  slide: SlideContent;
  lang: "FR" | "EN";
  accent: string;
  renderLine: (line: string, key: number) => ReactNode;
  body: string[];
  t: (fr: string, en: string) => string;
  config: VlsModuleConfig;
}) {
  const { hotspots, heroImage } = config;
  const [activeHotspot, setActiveHotspot] = useState(hotspots[0]?.id ?? "");
  const hotspot = hotspots.find((h) => h.id === activeHotspot);

  return (
    <div className="space-y-4">
      <div className="relative rounded-xl border border-border/70 overflow-hidden shadow-md">
        <HeroImageBlock
          src={heroImage}
          alt={lang === "FR" ? slide.titleFr : slide.titleEn}
          className="max-h-[400px]"
        />
        {hotspots.map((spot) => (
          <button
            key={spot.id}
            type="button"
            onClick={() => setActiveHotspot(spot.id)}
            className={`absolute border-2 rounded-md transition-all ${
              activeHotspot === spot.id
                ? "border-white bg-white/20 shadow-lg ring-2 ring-offset-1 ring-offset-transparent"
                : "border-white/70 bg-black/20 hover:bg-white/15"
            }`}
            style={{
              left: `${spot.x}%`,
              top: `${spot.y}%`,
              width: `${spot.w}%`,
              height: `${spot.h}%`,
              ...(activeHotspot === spot.id ? { borderColor: accent, ringColor: accent } : {}),
            }}
            title={lang === "FR" ? spot.labelFr : spot.labelEn}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-wrap gap-2">
          {hotspots.map((spot) => (
            <button
              key={spot.id}
              type="button"
              onClick={() => setActiveHotspot(spot.id)}
              className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                activeHotspot === spot.id ? "text-white border-transparent" : "border-border bg-card"
              }`}
              style={activeHotspot === spot.id ? { backgroundColor: accent } : undefined}
            >
              {lang === "FR" ? spot.labelFr : spot.labelEn}
            </button>
          ))}
        </div>
        {hotspot && (
          <div className="rounded-lg border border-border/70 bg-card p-4 text-sm">
            <p className="font-semibold mb-1">{lang === "FR" ? hotspot.labelFr : hotspot.labelEn}</p>
            <p className="text-muted-foreground">{lang === "FR" ? hotspot.detailFr : hotspot.detailEn}</p>
          </div>
        )}
      </div>
      {slide.scenarioMap && slide.scenarioMap.length > 0 && (
        <div className="rounded-xl border border-border/70 bg-card p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            {t("Scénarios liés", "Linked scenarios")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {slide.scenarioMap.map((scn) => (
              <span
                key={scn}
                className="text-[10px] font-bold px-2 py-0.5 rounded-md text-white"
                style={{ backgroundColor: accent }}
              >
                {scn}
              </span>
            ))}
          </div>
        </div>
      )}
      {body.length > 0 && (
        <BodyCard body={body} renderLine={renderLine} label={t("Zones opérationnelles", "Operational zones")} />
      )}
    </div>
  );
}

function splitHeroBody(body: string[]) {
  const keyPoints = body.filter((line) => !line.startsWith("🎯"));
  const objectives = body.filter((line) => line.startsWith("🎯"));
  return { keyPoints, objectives };
}

function splitSimulationScnBody(body: string[]) {
  const scenarios = body.filter((line) => isScnBodyLine(line));
  const simulator = body.filter((line) => !isScnBodyLine(line));
  return { simulator, scenarios };
}

function simulationLinks(config: VlsModuleConfig, moduleId: number, lang: "FR" | "EN") {
  return [
    {
      href: config.scenarioHref,
      label: lang === "FR" ? config.scenarioLinkFr : config.scenarioLinkEn,
    },
    {
      href: `/student/quiz/${moduleId}`,
      label:
        lang === "FR"
          ? `Quiz M${moduleId} (seuil ${config.quizThresholdPct} %)`
          : `M${moduleId} quiz (${config.quizThresholdPct}% threshold)`,
    },
  ];
}

export default function VlsSlideCanvas({
  slide,
  section,
  lang,
  accent,
  title,
  subtitle,
  body,
  visualType,
  visualVariant,
  moduleId,
  renderLine,
  t,
}: Props) {
  const config = getVlsModuleConfig(moduleId);
  if (!config) return null;

  const sectionLabel = getVlsSectionLabel(section, lang);
  const conceptsLabel = getVlsConceptsLabel(moduleId, lang);
  const moduleCode = `M${moduleId}`;

  if (section === "hero") {
    const { keyPoints, objectives } = splitHeroBody(body);
    return (
      <div className="space-y-5">
        <div className="relative overflow-hidden rounded-xl border border-border/70 shadow-lg">
          <HeroImageBlock src={config.heroImage} alt={title} className="max-h-[420px] lg:max-h-[480px]" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent p-5 sm:p-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">
              VLS · {sectionLabel}
            </span>
            <h2
              className="text-lg sm:text-xl font-bold text-white mt-1"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
            >
              {title}
            </h2>
            {subtitle && <p className="text-sm text-white/85 mt-1">{subtitle}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <BodyCard body={keyPoints} renderLine={renderLine} label={t("Points clés", "Key points")} />
          {objectives.length > 0 && (
            <div
              className="rounded-xl border p-5"
              style={{ borderColor: `${accent}40`, backgroundColor: `${accent}08` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4" style={{ color: accent }} />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t(`Objectifs du module ${moduleCode}`, `Module ${moduleCode} objectives`)}
                </span>
              </div>
              <div className="space-y-2">{objectives.map((line, i) => renderLine(line, i))}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (section === "observation-hotspots") {
    const zoneKeywords = config.observationZoneKeywords;
    const flowLines = body.filter((line) => !matchesObservationZoneLine(line, zoneKeywords));
    const zoneLines = body.filter((line) => matchesObservationZoneLine(line, zoneKeywords));
    return (
      <div className="space-y-5">
        <HotspotPanel
          slide={slide}
          lang={lang}
          accent={accent}
          renderLine={renderLine}
          body={zoneLines}
          t={t}
          config={config}
        />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" style={{ color: accent }} />
              {t("Guide d'observation", "Observation guide")}
            </div>
            <BodyCard
              body={flowLines}
              renderLine={renderLine}
              label={t("Flux logistique intégré", "Integrated logistics flow")}
            />
          </div>
        </div>
      </div>
    );
  }

  if (section === "observation") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <HeroImageBlock src={config.heroImage} alt={title} className="max-h-[360px]" />
        </div>
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" style={{ color: accent }} />
            {sectionLabel}
          </div>
          <BodyCard body={body} renderLine={renderLine} label={t("Guide d'observation", "Observation guide")} />
        </div>
      </div>
    );
  }

  if (section === "objectives") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2">
          <div
            className="rounded-xl border p-5 h-full"
            style={{ borderColor: `${accent}40`, backgroundColor: `${accent}08` }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5" style={{ color: accent }} />
              <span className="text-sm font-bold uppercase tracking-wide">{sectionLabel}</span>
            </div>
            <BodyCard
              body={body}
              renderLine={renderLine}
              label={t(`Critères de réussite ${moduleCode}`, `${moduleCode} success criteria`)}
            />
          </div>
        </div>
        <div className="lg:col-span-3">
          <HeroImageBlock src={config.heroImage} alt={title} className="max-h-[340px] opacity-95" />
        </div>
      </div>
    );
  }

  if (section === "hotspots") {
    return (
      <HotspotPanel
        slide={slide}
        lang={lang}
        accent={accent}
        renderLine={renderLine}
        body={body}
        t={t}
        config={config}
      />
    );
  }

  if (section === "concepts") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <BodyCard body={body} renderLine={renderLine} label={conceptsLabel} />
        </div>
        <div className="lg:col-span-2">
          <HeroImageBlock
            src={config.heroImage}
            alt={title}
            className="max-h-[280px] lg:sticky lg:top-4"
          />
        </div>
      </div>
    );
  }

  if (section === "simulation-scn") {
    const { simulator, scenarios } = splitSimulationScnBody(body);
    const links = simulationLinks(config, moduleId, lang);
    return (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <MonitorPlay className="w-4 h-4" style={{ color: accent }} />
            {sectionLabel}
          </div>
          {simulator.length > 0 && (
            <BodyCard body={simulator} renderLine={renderLine} label={t("Parcours simulateur", "Simulator path")} />
          )}
          {scenarios.length > 0 && (
            <BodyCard body={scenarios} renderLine={renderLine} label={t("Cartographie SCN", "SCN mapping")} />
          )}
          <div className="grid sm:grid-cols-2 gap-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center justify-between gap-2 rounded-lg border border-border/70 bg-card px-4 py-3 text-sm font-medium hover:bg-secondary transition-colors"
              >
                <span>{link.label}</span>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2">
          <SlideVisualPanel
            visualType={visualType}
            variant={visualVariant}
            accent={accent}
            moduleId={moduleId}
            slideId={slide.id}
            title={title}
            scenarioMap={slide.scenarioMap}
          />
        </div>
      </div>
    );
  }

  if (section === "simulation") {
    const links = simulationLinks(config, moduleId, lang);
    return (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <MonitorPlay className="w-4 h-4" style={{ color: accent }} />
            {sectionLabel}
          </div>
          <BodyCard body={body} renderLine={renderLine} label={t("Parcours simulateur", "Simulator path")} />
          <div className="grid sm:grid-cols-2 gap-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center justify-between gap-2 rounded-lg border border-border/70 bg-card px-4 py-3 text-sm font-medium hover:bg-secondary transition-colors"
              >
                <span>{link.label}</span>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2">
          <SlideVisualPanel
            visualType={visualType}
            variant={visualVariant}
            accent={accent}
            moduleId={moduleId}
            slideId={slide.id}
            title={title}
          />
        </div>
      </div>
    );
  }

  if (section === "scn-mapping" || section === "module-completed" || section === "certification") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <SlideVisualPanel
            visualType={visualType}
            variant={visualVariant}
            accent={accent}
            moduleId={moduleId}
            slideId={slide.id}
            title={title}
            scenarioMap={slide.scenarioMap}
          />
        </div>
        <div className="lg:col-span-2">
          <BodyCard body={body} renderLine={renderLine} label={sectionLabel} />
        </div>
      </div>
    );
  }

  return null;
}
