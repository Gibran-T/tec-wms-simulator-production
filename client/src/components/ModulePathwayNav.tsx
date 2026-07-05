import { useLocation } from "wouter";
import { BookOpen, Layers, TrendingUp, BarChart2, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { isEnterpriseExperienceEnabled } from "@/lib/enterpriseExperience";
import { CAREER_CHAPTER_LABELS } from "@shared/enterprise/scenarioBinding";

export const MODULE_NAV_ITEMS = [
  {
    id: 1,
    label: "M1",
    titleFr: "Fondements ERP/WMS",
    titleEn: "ERP/WMS Foundations",
    route: "/student/scenarios",
    icon: BookOpen,
    activeClass: "bg-[#0070f2] text-white border-[#0070f2]",
  },
  {
    id: 2,
    label: "M2",
    titleFr: "Exécution d'entrepôt",
    titleEn: "Warehouse Execution",
    route: "/student/module2",
    icon: Layers,
    activeClass: "bg-blue-600 text-white border-blue-600",
  },
  {
    id: 3,
    label: "M3",
    titleFr: "Contrôle des stocks",
    titleEn: "Inventory Control",
    route: "/student/module3",
    icon: TrendingUp,
    activeClass: "bg-emerald-600 text-white border-emerald-600",
  },
  {
    id: 4,
    label: "M4",
    titleFr: "Indicateurs KPI",
    titleEn: "KPI Indicators",
    route: "/student/module4",
    icon: BarChart2,
    activeClass: "bg-orange-600 text-white border-orange-600",
  },
  {
    id: 5,
    label: "M5",
    titleFr: "Simulation intégrée",
    titleEn: "Integrated Simulation",
    route: "/student/module5",
    icon: FileText,
    activeClass: "bg-purple-600 text-white border-purple-600",
  },
] as const;

interface ModulePathwayNavProps {
  activeModuleId: number;
  className?: string;
}

export default function ModulePathwayNav({ activeModuleId, className = "" }: ModulePathwayNavProps) {
  const [, navigate] = useLocation();
  const { t, language } = useLanguage();
  const enterpriseEnabled = isEnterpriseExperienceEnabled();
  const activeChapter = CAREER_CHAPTER_LABELS[activeModuleId];

  return (
    <div className={`space-y-2 ${className}`}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {enterpriseEnabled
          ? t("Parcours professionnel TEC.LOG — Chapitres 1 à 5", "TEC.LOG professional journey — Chapters 1 to 5")
          : t("Parcours TEC.LOG — Modules 1 à 5", "TEC.LOG Pathway — Modules 1 to 5")}
      </p>
      {enterpriseEnabled && activeChapter && (
        <p className="text-xs font-semibold text-primary">
          {language === "FR" ? activeChapter.fr : activeChapter.en}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {MODULE_NAV_ITEMS.map((mod) => {
          const Icon = mod.icon;
          const isActive = mod.id === activeModuleId;
          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => navigate(mod.route)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold border rounded-md transition-colors ${
                isActive
                  ? mod.activeClass
                  : "bg-card text-foreground border-border hover:bg-muted"
              }`}
            >
              <Icon size={14} />
              <span>{mod.label}</span>
              <span className="hidden sm:inline opacity-90">
                — {language === "FR" ? mod.titleFr : mod.titleEn}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
