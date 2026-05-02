/**
 * GlossaryPage — Bilingual Logistics Glossary
 * 80 key WMS/ERP logistics terms with FR/EN definitions
 * Accessible from /student/glossary and as a modal from StepForm
 */
import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import FioriShell from "@/components/FioriShell";
import { useLocation } from "wouter";
import {
  Search, BookOpen, ChevronLeft, X, Filter,
  BookMarked, Cpu, Package, BarChart2, FileText, Wrench,
} from "lucide-react";
import {
  GLOSSARY_TERMS,
  CATEGORY_LABELS,
  type GlossaryTerm,
} from "@/data/glossary";

// ── Category icon map ─────────────────────────────────────────────────────────
const CATEGORY_ICONS: Record<GlossaryTerm["category"], React.ElementType> = {
  system:    Cpu,
  process:   Package,
  inventory: BookMarked,
  kpi:       BarChart2,
  document:  FileText,
  method:    Wrench,
};

// ── Category colors ───────────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<GlossaryTerm["category"], string> = {
  system:    "#0070f2",
  process:   "#2563eb",
  inventory: "#059669",
  kpi:       "#d97706",
  document:  "#7b1fa2",
  method:    "#dc2626",
};

// ── Props for modal usage ─────────────────────────────────────────────────────
interface GlossaryPageProps {
  /** When true, renders as a modal overlay instead of a full page */
  modal?: boolean;
  /** Called when the modal should be closed */
  onClose?: () => void;
  /** Pre-filter to a specific module (1-5) */
  moduleFilter?: number;
}

export default function GlossaryPage({
  modal = false,
  onClose,
  moduleFilter,
}: GlossaryPageProps) {
  const { t, language } = useLanguage();
  const [, navigate] = useLocation();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<GlossaryTerm["category"] | "all">("all");
  const [selectedModule, setSelectedModule] = useState<number | "all">(moduleFilter ?? "all");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const categories: Array<GlossaryTerm["category"] | "all"> = [
    "all", "system", "process", "inventory", "kpi", "document", "method",
  ];

  const filteredTerms = useMemo(() => {
    const q = search.toLowerCase().trim();
    return GLOSSARY_TERMS.filter((term) => {
      // Category filter
      if (selectedCategory !== "all" && term.category !== selectedCategory) return false;
      // Module filter
      if (selectedModule !== "all" && !term.module.includes(selectedModule as number)) return false;
      // Search filter
      if (q) {
        const haystack = [
          term.code,
          term.fr,
          term.en,
          term.definitionFr,
          term.definitionEn,
        ].join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [search, selectedCategory, selectedModule]);

  const content = (
    <div className={modal ? "flex flex-col h-full" : "min-h-screen bg-background text-foreground"}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className={`sticky top-0 z-10 bg-background border-b border-border ${modal ? "" : "px-4 sm:px-6"}`}>
        <div className={`${modal ? "px-4 sm:px-6" : ""} py-4`}>
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              {!modal && (
                <button
                  onClick={() => navigate("/student/scenarios")}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft size={16} />
                  {t("Retour", "Back")}
                </button>
              )}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                  <BookOpen size={16} className="text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-base font-bold text-foreground leading-tight">
                    {t("Glossaire logistique", "Logistics Glossary")}
                  </h1>
                  <p className="text-[10px] text-muted-foreground">
                    {filteredTerms.length} / {GLOSSARY_TERMS.length} {t("termes", "terms")} · FR / EN
                  </p>
                </div>
              </div>
            </div>
            {modal && onClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("Rechercher un terme (WMS, FIFO, ROP...)", "Search a term (WMS, FIFO, ROP...)")}
              className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Filters row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter size={12} className="text-muted-foreground shrink-0" />
            {/* Category filter */}
            <div className="flex gap-1 shrink-0">
              {categories.map((cat) => {
                const Icon = cat === "all" ? BookOpen : CATEGORY_ICONS[cat];
                const label = cat === "all"
                  ? t("Tous", "All")
                  : (language === "FR" ? CATEGORY_LABELS[cat].fr : CATEGORY_LABELS[cat].en);
                const color = cat === "all" ? "#6b7280" : CATEGORY_COLORS[cat];
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold transition-all shrink-0 ${
                      active ? "text-white" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    style={active ? { backgroundColor: color } : {}}
                  >
                    <Icon size={10} />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                );
              })}
            </div>
            {/* Module filter */}
            <div className="flex gap-1 ml-2 shrink-0">
              <span className="text-[10px] text-muted-foreground self-center">M:</span>
              {(["all", 1, 2, 3, 4, 5] as Array<"all" | number>).map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedModule(m)}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                    selectedModule === m
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {m === "all" ? t("Tous", "All") : `M${m}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Terms list ─────────────────────────────────────────────────────── */}
      <div className={`flex-1 overflow-y-auto ${modal ? "px-4 sm:px-6 py-4" : "px-4 sm:px-6 py-6"}`}>
        {filteredTerms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen size={40} className="text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              {t("Aucun terme trouvé pour cette recherche.", "No terms found for this search.")}
            </p>
            <button
              onClick={() => { setSearch(""); setSelectedCategory("all"); setSelectedModule("all"); }}
              className="mt-3 text-xs text-primary hover:underline"
            >
              {t("Réinitialiser les filtres", "Reset filters")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredTerms.map((term) => {
              const Icon = CATEGORY_ICONS[term.category];
              const color = CATEGORY_COLORS[term.category];
              const isExpanded = expandedId === term.id;
              const catLabel = language === "FR"
                ? CATEGORY_LABELS[term.category].fr
                : CATEGORY_LABELS[term.category].en;

              return (
                <div
                  key={term.id}
                  className={`rounded-lg border border-border bg-card overflow-hidden transition-all cursor-pointer hover:shadow-md ${
                    isExpanded ? "ring-2" : ""
                  }`}
                  style={isExpanded ? { borderColor: color, outline: `2px solid ${color}`, outlineOffset: '-1px' } : {}}
                  onClick={() => setExpandedId(isExpanded ? null : term.id)}
                >
                  {/* Color accent bar */}
                  <div className="h-1 w-full" style={{ backgroundColor: color }} />

                  <div className="p-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-6 h-6 rounded flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${color}18` }}
                        >
                          <Icon size={12} style={{ color }} />
                        </div>
                        <span
                          className="font-mono font-bold text-sm"
                          style={{ color }}
                        >
                          {term.code}
                        </span>
                      </div>
                      <span
                        className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full shrink-0"
                        style={{ backgroundColor: `${color}18`, color }}
                      >
                        {catLabel}
                      </span>
                    </div>

                    {/* Full name */}
                    <p className="text-xs text-foreground font-medium leading-snug mb-1">
                      {language === "FR" ? term.fr : term.en}
                    </p>
                    {language === "FR" ? (
                      <p className="text-[10px] text-muted-foreground italic">{term.en}</p>
                    ) : (
                      <p className="text-[10px] text-muted-foreground italic">{term.fr}</p>
                    )}

                    {/* Module badges */}
                    <div className="flex gap-1 mt-2">
                      {term.module.map((m) => (
                        <span
                          key={m}
                          className="text-[9px] font-bold px-1 py-0.5 rounded bg-muted text-muted-foreground"
                        >
                          M{m}
                        </span>
                      ))}
                    </div>

                    {/* Expanded definition */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-xs text-foreground leading-relaxed">
                          {language === "FR" ? term.definitionFr : term.definitionEn}
                        </p>
                        {/* Show opposite language definition */}
                        <div className="mt-2 p-2 rounded bg-muted/50">
                          <p className="text-[10px] text-muted-foreground font-semibold mb-1">
                            {language === "FR" ? "English" : "Français"}
                          </p>
                          <p className="text-[10px] text-muted-foreground leading-relaxed">
                            {language === "FR" ? term.definitionEn : term.definitionFr}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Click hint */}
                    {!isExpanded && (
                      <p className="text-[9px] text-muted-foreground/50 mt-2">
                        {t("Cliquer pour la définition complète", "Click for full definition")}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  // ── Full page mode ──────────────────────────────────────────────────────────
  if (!modal) {
    return (
      <FioriShell>
        {content}
      </FioriShell>
    );
  }

  // ── Modal mode ──────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 pt-16">
      <div className="w-full max-w-4xl bg-background rounded-xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {content}
      </div>
    </div>
  );
}
