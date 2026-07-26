import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { MoreHorizontal } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  NAV_ICON_SLOT_PX,
  computeVisibleNavCount,
  type ShellNavItem,
} from "./roleNavConfig";

type TranslateFn = (fr: string, en: string) => string;

export type ResolvedNavItem = {
  href: string;
  label: string;
  icon: ShellNavItem["icon"];
  priority: number;
};

function isActive(location: string, href: string): boolean {
  return (
    location === href ||
    (href !== "/" && location.startsWith(href + "/")) ||
    (href === "/teacher" && location === "/teacher")
  );
}

/**
 * Icon-only shell nav with structural overflow ("Plus") — independent of browser zoom.
 * Measures available width and keeps highest-priority icons visible.
 */
export default function RoleIconNav({
  items,
  t,
}: {
  items: ResolvedNavItem[];
  t: TranslateFn;
}) {
  const [location] = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const [visibleCount, setVisibleCount] = useState(items.length);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  const sorted = useMemo(
    () => [...items].sort((a, b) => b.priority - a.priority),
    [items],
  );

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const measure = () => {
      setVisibleCount(computeVisibleNavCount(el.clientWidth, sorted.length, NAV_ICON_SLOT_PX));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [sorted.length]);

  useEffect(() => {
    if (!moreOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  const visible = sorted.slice(0, visibleCount);
  const overflow = sorted.slice(visibleCount);
  // Preserve original order in the bar for predictability (priority only for packing)
  const visibleOrdered = items.filter((i) => visible.some((v) => v.href === i.href));
  const overflowOrdered = items.filter((i) => overflow.some((v) => v.href === i.href));

  const renderIconLink = (item: ResolvedNavItem) => {
    const Icon = item.icon;
    const active = isActive(location, item.href);
    return (
      <Tooltip key={item.href} delayDuration={200}>
        <TooltipTrigger asChild>
          <Link
            href={item.href}
            aria-label={item.label}
            title={item.label}
            aria-current={active ? "page" : undefined}
            data-testid={`shell-nav-${item.href.replace(/\//g, "-")}`}
            data-nav-label={item.label}
            className={`flex items-center justify-center w-8 h-8 rounded transition-colors shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              active
                ? "bg-white/20 text-white ring-1 ring-white/40"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <Icon size={15} className="shrink-0" strokeWidth={2.25} aria-hidden="true" />
            <span className="sr-only">{item.label}</span>
            {active && (
              <span className="sr-only">{t("(page active)", "(active page)")}</span>
            )}
          </Link>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          sideOffset={6}
          className="text-xs z-[60]"
          data-testid={`shell-nav-tooltip-${item.href.replace(/\//g, "-")}`}
        >
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <nav
      ref={navRef}
      className="hidden md:flex items-center gap-0.5 flex-1 min-w-0"
      aria-label={t("Navigation principale", "Main navigation")}
      data-testid="role-icon-nav"
    >
      {visibleOrdered.map(renderIconLink)}

      {overflowOrdered.length > 0 && (
        <div className="relative shrink-0" ref={moreRef}>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => setMoreOpen((v) => !v)}
                aria-label={t("Plus d’accès", "More destinations")}
                aria-expanded={moreOpen}
                data-testid="shell-nav-more"
                className={`flex items-center justify-center w-8 h-8 rounded transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  moreOpen || overflowOrdered.some((i) => isActive(location, i.href))
                    ? "bg-white/20 text-white ring-1 ring-white/40"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <MoreHorizontal size={15} aria-hidden="true" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={6} className="text-xs z-[60]">
              {t("Plus", "More")}
            </TooltipContent>
          </Tooltip>

          {moreOpen && (
            <div
              className="absolute left-0 top-full mt-1 min-w-[200px] rounded-lg border border-white/15 bg-[#0f2a44] shadow-xl z-[80] py-1"
              role="menu"
              data-testid="shell-nav-more-menu"
            >
              {overflowOrdered.map((item) => {
                const Icon = item.icon;
                const active = isActive(location, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    aria-label={item.label}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMoreOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 text-xs transition-colors ${
                      active
                        ? "bg-white/15 text-white"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon size={14} aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
