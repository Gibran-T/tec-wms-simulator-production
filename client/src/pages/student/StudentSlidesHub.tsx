import FioriShell from "@/components/FioriShell";
import { useLocation } from "wouter";
import {
  Presentation, Clock, ClipboardCheck, ChevronRight, Info,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SLIDE_COUNT_BY_MODULE, TOTAL_SLIDE_COUNT } from "@/data/slideCounts";
import { MODULE_SLIDE_THEME } from "@/data/moduleTheme";
import { ModulePreviewVisual } from "@/components/slides/SlideVisualPanel";

const MODULE_META = [
  {
    id: 1,
    titleFr: "Module 1 — Fondements ERP/WMS",
    titleEn: "Module 1 — ERP/WMS Foundations",
    descFr: "Flux logistiques, transactions SAP et cycle opérationnel PO→GR→SO→GI.",
    descEn: "Logistics flows, SAP transactions and PO→GR→SO→GI operational cycle.",
    topics: ["WMS · ERP · SAP", "PO · GR · SO · GI", "Cycle Count"],
    topicsEn: ["WMS · ERP · SAP", "PO · GR · SO · GI", "Cycle Count"],
  },
  {
    id: 2,
    titleFr: "Module 2 — Exécution d'entrepôt",
    titleEn: "Module 2 — Warehouse Execution",
    descFr: "Emplacements, FIFO/LIFO, capacité des bins et traçabilité des lots.",
    descEn: "Locations, FIFO/LIFO, bin capacity and lot traceability.",
    topics: ["ASN · FIFO/LIFO", "Capacité bins", "Traçabilité"],
    topicsEn: ["ASN · FIFO/LIFO", "Bin capacity", "Traceability"],
  },
  {
    id: 3,
    titleFr: "Module 3 — Contrôle des stocks",
    titleEn: "Module 3 — Inventory Control",
    descFr: "Inventaire cyclique, écarts, ROP, stock de sécurité et réapprovisionnement.",
    descEn: "Cycle counting, variances, ROP, safety stock and replenishment.",
    topics: ["ROP · Safety Stock", "EOQ · MRP", "Cycle Count"],
    topicsEn: ["ROP · Safety Stock", "EOQ · MRP", "Cycle Count"],
  },
  {
    id: 4,
    titleFr: "Module 4 — Indicateurs de performance",
    titleEn: "Module 4 — Performance Indicators",
    descFr: "KPIs logistiques : OTIF, Fill Rate, DSI, LPH et diagnostic RCA.",
    descEn: "Logistics KPIs: OTIF, Fill Rate, DSI, LPH and RCA diagnosis.",
    topics: ["OTIF · Fill Rate", "DSI · LPH", "Lean · RCA"],
    topicsEn: ["OTIF · Fill Rate", "DSI · LPH", "Lean · RCA"],
  },
  {
    id: 5,
    titleFr: "Module 5 — Simulation intégrée",
    titleEn: "Module 5 — Integrated Simulation",
    descFr: "Capstone M1–M5 : crise logistique, audit final et certification TEC.LOG.",
    descEn: "M1–M5 capstone: logistics crisis, final audit and TEC.LOG certification.",
    topics: ["Simulation · Crise", "Audit final", "Certification"],
    topicsEn: ["Simulation · Crisis", "Final audit", "Certification"],
  },
];

export default function StudentSlidesHub() {
  const [, navigate] = useLocation();
  const { language: lang, t } = useLanguage();

  return (
    <FioriShell
      title={t("Mes Slides — TEC.LOG", "My Slides — TEC.LOG")}
      breadcrumbs={[
        { label: t("Accueil", "Home"), href: "/" },
        { label: t("Slides", "Slides") },
      ]}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Dynamic page header */}
        <div className="rounded-lg overflow-hidden border border-border shadow-sm">
          <div className="bg-[#0f2a44] text-white px-5 py-5 sm:px-6 sm:py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Presentation size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold">
                    {t("Slides pédagogiques — Programme TEC.LOG", "Pedagogical Slides — TEC.LOG Program")}
                  </h1>
                  <p className="text-sm text-white/70 mt-1">
                    {t(
                      "Collège de la Concorde · Montréal · Session 2025–2026",
                      "Collège de la Concorde · Montreal · Session 2025–2026",
                    )}
                  </p>
                  <p className="text-xs text-white/60 mt-0.5">
                    {t(
                      `5 modules · ${TOTAL_SLIDE_COUNT} slides · FR / EN`,
                      `5 modules · ${TOTAL_SLIDE_COUNT} slides · FR / EN`,
                    )}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { value: "5", label: t("Modules", "Modules") },
                  { value: String(TOTAL_SLIDE_COUNT), label: t("Slides", "Slides") },
                  { value: "25h", label: t("Formation", "Training") },
                  { value: "FR/EN", label: t("Langues", "Languages") },
                ].map((kpi) => (
                  <div key={kpi.label} className="rounded-md bg-white/10 px-3 py-2 text-center">
                    <p className="text-xl font-bold">{kpi.value}</p>
                    <p className="text-[10px] text-white/60 uppercase tracking-wide">{kpi.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Message strip */}
        <div className="alert-info flex items-start gap-3 px-4 py-3 rounded-md border">
          <Info size={16} className="shrink-0 mt-0.5 text-[#0070f2]" />
          <p className="text-sm text-foreground/90">
            {t(
              "Parcours recommandé : consulter les slides → quiz module → scénarios. Utilisez ← → dans le lecteur et P pour les notes professeur.",
              "Recommended path: review slides → module quiz → scenarios. Use ← → in the viewer and P for professor notes.",
            )}
          </p>
        </div>

        {/* Module object cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {MODULE_META.map((mod) => {
            const theme = MODULE_SLIDE_THEME[mod.id];
            const Icon = theme.icon;
            const title = lang === "FR" ? mod.titleFr : mod.titleEn;
            const desc = lang === "FR" ? mod.descFr : mod.descEn;
            const topics = lang === "FR" ? mod.topics : mod.topicsEn;
            const slideCount = SLIDE_COUNT_BY_MODULE[mod.id];

            return (
              <article
                key={mod.id}
                className="group flex flex-col rounded-lg border border-border bg-card shadow-sm hover:shadow-md transition-all overflow-hidden"
                style={{ borderLeftWidth: 4, borderLeftColor: theme.accent }}
              >
                {/* Preview strip */}
                <div className="relative h-[130px] bg-muted/30 overflow-hidden">
                  <ModulePreviewVisual moduleId={mod.id} accent={theme.accent} />
                  <div className="absolute top-3 right-3">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded text-white shadow-sm"
                      style={{ backgroundColor: theme.accent }}
                    >
                      {theme.label}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col flex-1 p-4 sm:p-5">
                  {/* Status chips */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground inline-flex items-center gap-1">
                      <Presentation size={10} />
                      {slideCount} {t("slides", "slides")}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground inline-flex items-center gap-1">
                      <Clock size={10} />
                      {theme.duration}
                    </span>
                  </div>

                  <div className="flex items-start gap-3 mb-2">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${theme.accent}18` }}
                    >
                      <Icon size={18} style={{ color: theme.accent }} />
                    </div>
                    <h2 className="text-base font-semibold text-foreground leading-snug flex-1">{title}</h2>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">{desc}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {topics.map((topic) => (
                      <span
                        key={topic}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-border bg-secondary/50"
                        style={{ color: theme.accent }}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* Footer toolbar */}
                  <div className="mt-auto flex items-center gap-2 pt-3 border-t border-border">
                    <button
                      type="button"
                      onClick={() => navigate(`/student/slides/${mod.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 h-10 rounded-md text-sm font-semibold text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: theme.accent }}
                    >
                      <Presentation size={14} />
                      {t("Ouvrir les slides", "Open slides")}
                      <ChevronRight size={14} className="opacity-80" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/student/quiz/${mod.id}`);
                      }}
                      className="flex items-center gap-1.5 h-10 px-3 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      title={t("Faire le quiz", "Take the quiz")}
                    >
                      <ClipboardCheck size={14} />
                      <span className="hidden sm:inline">{t("Quiz", "Quiz")}</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Keyboard shortcuts */}
        <div className="rounded-md border border-border bg-card px-4 py-3 flex items-start gap-3">
          <Presentation size={16} className="text-[#0070f2] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              {t("Raccourcis SlideViewer", "SlideViewer shortcuts")}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t(
                "← → naviguer · Échap retour hub slides · P notes professeur · FR/EN langue",
                "← → navigate · Esc back to slides hub · P professor notes · FR/EN language",
              )}
            </p>
          </div>
        </div>
      </div>
    </FioriShell>
  );
}
