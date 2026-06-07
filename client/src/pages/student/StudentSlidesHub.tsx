import FioriShell from "@/components/FioriShell";
import TecLogJourneyStrip from "@/components/TecLogJourneyStrip";
import { useLocation } from "wouter";
import {
  BookOpen, Layers, TrendingUp, BarChart2, FileText, Presentation, Clock,
  ChevronRight, MonitorPlay, Award, Target,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { allModules } from "@/data/modules";
import { getPathwayForModule } from "@/data/modulePathway";
import { trpc } from "@/lib/trpc";
import { useMemo } from "react";

const SLIDE_MODULES_ACCESSIBLE = true;

const MODULE_ICONS: Record<number, React.ElementType> = {
  1: BookOpen,
  2: Layers,
  3: TrendingUp,
  4: BarChart2,
  5: FileText,
};

const MODULE_STYLES: Record<number, { bg: string; border: string }> = {
  1: { bg: "bg-blue-50", border: "border-blue-200" },
  2: { bg: "bg-blue-50", border: "border-blue-300" },
  3: { bg: "bg-emerald-50", border: "border-emerald-200" },
  4: { bg: "bg-orange-50", border: "border-orange-200" },
  5: { bg: "bg-purple-50", border: "border-purple-200" },
};

const TOTAL_SLIDES = allModules.reduce((sum, m) => sum + m.slides.length, 0);

export default function StudentSlidesHub() {
  const [, navigate] = useLocation();
  const { language: lang, t } = useLanguage();

  const { data: scenarios } = trpc.scenarios.list.useQuery();
  const { data: myRuns } = trpc.runs.myRunsEnriched.useQuery();

  const moduleProgress = useMemo(() => {
    const map: Record<number, { completed: number; total: number }> = {};
    for (const mod of allModules) {
      const modScenarios = (scenarios ?? []).filter((s) => s.moduleId === mod.id);
      const completed = (myRuns ?? []).filter(
        (r) =>
          modScenarios.some((s) => s.id === r.run.scenarioId) &&
          r.run.status === "completed" &&
          !r.run.isDemo
      ).length;
      map[mod.id] = { completed, total: modScenarios.length };
    }
    return map;
  }, [scenarios, myRuns]);

  return (
    <FioriShell
      title={t("Mes Slides — TEC.LOG", "My Slides — TEC.LOG")}
      breadcrumbs={[
        { label: t("Accueil", "Home"), href: "/" },
        { label: t("Slides", "Slides") },
      ]}
    >
      <TecLogJourneyStrip activeStep="slides" className="mb-5" />

      <div className="mb-5 p-5 rounded-lg bg-gradient-to-r from-[#0f2a44] to-[#1a3f6f] text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
            <Presentation size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold">
              {t("Parcours de formation TEC.LOG", "TEC.LOG Training Pathway")}
            </h1>
            <p className="text-sm text-white/70 mt-0.5">
              {t(
                `5 modules · ${TOTAL_SLIDES} slides · Étude avant simulation`,
                `5 modules · ${TOTAL_SLIDES} slides · Study before simulation`
              )}
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-5 text-center">
          <div>
            <p className="text-2xl font-bold">5</p>
            <p className="text-xs text-white/60">{t("Modules", "Modules")}</p>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div>
            <p className="text-2xl font-bold">{TOTAL_SLIDES}</p>
            <p className="text-xs text-white/60">{t("Slides", "Slides")}</p>
          </div>
        </div>
      </div>

      <div className="mb-5 p-3 rounded-md bg-[#0f2a44]/5 border border-[#1a3f6f]/20 flex items-start gap-3">
        <Target size={16} className="text-[#0070f2] shrink-0 mt-0.5" />
        <p className="text-xs text-[#0f2a44]">
          {t(
            "Consultez les slides, puis passez aux scénarios TEC.WMS. Les slides sont en lecture libre — le quiz débloque la simulation.",
            "Review slides, then proceed to TEC.WMS scenarios. Slides are open reading — the quiz unlocks simulation."
          )}
        </p>
      </div>

      <div className="space-y-4">
        {allModules.map((mod, index) => {
          const Icon = MODULE_ICONS[mod.id] ?? BookOpen;
          const style = MODULE_STYLES[mod.id] ?? MODULE_STYLES[1];
          const pathway = getPathwayForModule(mod.id);
          const slideCount = mod.slides.length;
          const progress = moduleProgress[mod.id];
          const title = lang === "FR" ? mod.titleFr : mod.titleEn;
          const competency = pathway
            ? lang === "FR"
              ? pathway.competencyFr
              : pathway.competencyEn
            : "";
          const certImpact = pathway
            ? lang === "FR"
              ? pathway.certImpactFr
              : pathway.certImpactEn
            : "";

          return (
            <div key={mod.id} className="relative">
              {index < allModules.length - 1 && (
                <div className="hidden md:block absolute left-6 top-full w-0.5 h-4 bg-[#0070f2]/20 z-0" />
              )}
              <div
                className={`relative z-10 rounded-lg border-2 transition-all duration-200 overflow-hidden ${style.border} ${style.bg} hover:shadow-md`}
              >
                <div className="h-1 w-full" style={{ backgroundColor: mod.color }} />

                <div className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${mod.color}20` }}
                      >
                        <Icon size={20} style={{ color: mod.color }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white"
                            style={{ backgroundColor: mod.color }}
                          >
                            M{mod.id}
                          </span>
                          <span className="text-[10px] text-gray-500 flex items-center gap-1">
                            <Clock size={9} />
                            {mod.durationH}h · {slideCount} {t("slides", "slides")}
                          </span>
                          {pathway && (
                            <span className="text-[10px] font-mono text-gray-500">
                              {pathway.scnRange}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-[#0f2a44] leading-snug mb-1">
                          {title}
                        </h3>
                        {competency && (
                          <p className="text-xs text-gray-600 mb-2">
                            <span className="font-semibold text-[#0f2a44]">
                              {t("Compétence", "Competency")}:
                            </span>{" "}
                            {competency}
                          </p>
                        )}
                        {certImpact && (
                          <p className="text-[10px] flex items-center gap-1 text-gray-500 mb-2">
                            <Award size={10} style={{ color: mod.color }} />
                            {certImpact}
                          </p>
                        )}
                        {progress && progress.total > 0 && (
                          <p className="text-[10px] text-emerald-700 font-medium">
                            {t("Scénarios terminés", "Scenarios completed")}: {progress.completed}/
                            {progress.total}
                          </p>
                        )}
                      </div>
                    </div>

                    {SLIDE_MODULES_ACCESSIBLE && (
                      <div className="flex flex-col gap-2 w-full lg:w-48 shrink-0">
                        <button
                          onClick={() => navigate(`/student/slides/${mod.id}`)}
                          className="flex items-center justify-center gap-2 py-2 rounded-md text-white text-xs font-semibold hover:opacity-90 w-full"
                          style={{ backgroundColor: mod.color }}
                        >
                          <Presentation size={13} />
                          {t("Ouvrir les slides", "Open slides")}
                        </button>
                        <button
                          onClick={() => navigate(`/student/scenarios?module=${mod.id}`)}
                          className="flex items-center justify-center gap-2 py-2 rounded-md text-xs font-semibold border-2 hover:opacity-80 w-full bg-white"
                          style={{ borderColor: mod.color, color: mod.color }}
                        >
                          <MonitorPlay size={13} />
                          {t("Accéder aux scénarios", "Go to scenarios")}
                        </button>
                        <button
                          onClick={() => navigate(`/student/quiz/${mod.id}`)}
                          className="flex items-center justify-center gap-2 py-2 rounded-md text-xs font-semibold border hover:opacity-80 w-full text-gray-600 border-gray-300 bg-white"
                        >
                          ✓ {t("Quiz du module", "Module quiz")}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 rounded-md border border-[#d9d9d9] bg-white flex items-center gap-4">
        <div className="w-8 h-8 rounded-md bg-[#e8f0fe] flex items-center justify-center shrink-0">
          <Presentation size={16} className="text-[#0070f2]" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-[#0f2a44]">
            {t("Raccourcis clavier dans le SlideViewer", "Keyboard shortcuts in SlideViewer")}
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">
            {t(
              "← → : naviguer · Échap : scénarios · FR/EN : langue",
              "← → : navigate · Esc : scenarios · FR/EN : language"
            )}
          </p>
        </div>
        <ChevronRight size={16} className="text-gray-300 hidden sm:block" />
      </div>
    </FioriShell>
  );
}
