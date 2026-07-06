import { useLocation } from "wouter";
import {
  Play, MonitorPlay, CheckCircle, BarChart2, Clock, Target, FileText,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  findActiveRunForScenario,
  findCompletedRunForScenario,
  resolveScenarioScnCode,
} from "@/lib/scenarioCatalog";
import type { ScenarioRef } from "../../../../server/canonicalScenarios";
import { DEPARTMENT_LABELS, getScenarioBinding } from "@shared/enterprise/scenarioBinding";
import PriorityBadge from "@/components/enterprise/PriorityBadge";

const DIFF_CONFIG: Record<string, { labelFr: string; labelEn: string; bg: string; text: string }> = {
  facile: { labelFr: "Facile", labelEn: "Easy", bg: "bg-emerald-100 dark:bg-emerald-900/40", text: "text-emerald-800 dark:text-emerald-300" },
  moyen: { labelFr: "Moyen", labelEn: "Medium", bg: "bg-amber-100 dark:bg-amber-900/40", text: "text-amber-800 dark:text-amber-300" },
  difficile: { labelFr: "Difficile", labelEn: "Hard", bg: "bg-red-100 dark:bg-red-900/40", text: "text-red-800 dark:text-red-300" },
};

const SCENARIO_DURATION: Record<number, number> = {
  1: 15, 2: 20, 3: 20, 4: 25, 5: 30,
  6: 20, 7: 25, 8: 25, 9: 30, 10: 35,
  11: 20, 12: 25, 13: 30, 14: 35, 15: 40,
  16: 25, 17: 30,
};

type MissionBoardScenario = ScenarioRef & {
  name: string;
  difficulty?: string | null;
  descriptionFr?: string | null;
  descriptionEn?: string | null;
  targetScore?: number | null;
};

type EnrichedRunRow = {
  run: { id: number; scenarioId: number; status: string; isDemo: boolean; score?: number | null };
  score?: number | null;
};

interface MissionBoardProps {
  moduleId: number;
  moduleScenarios: MissionBoardScenario[];
  rawModuleScenarios: MissionBoardScenario[];
  myRuns: EnrichedRunRow[] | undefined;
  isLoading?: boolean;
  enterpriseStyled?: boolean;
  title?: string;
  onStartScenario: (scenario: { id: number; name: string; difficulty?: string }) => void;
}

export default function MissionBoard({
  moduleId,
  moduleScenarios,
  rawModuleScenarios,
  myRuns,
  isLoading,
  enterpriseStyled = false,
  title,
  onStartScenario,
}: MissionBoardProps) {
  const [, navigate] = useLocation();
  const { t, language } = useLanguage();

  const getActiveRun = (scenario: MissionBoardScenario) =>
    findActiveRunForScenario(scenario, rawModuleScenarios, myRuns) as EnrichedRunRow | undefined;

  const getCompletedRun = (scenario: MissionBoardScenario) =>
    findCompletedRunForScenario(scenario, rawModuleScenarios, myRuns) as EnrichedRunRow | undefined;

  const heading =
    title ??
    (enterpriseStyled
      ? t("Missions ouvertes — Module", "Open assignments — Module")
      : t("Scénarios du Module", "Module Scenarios"));

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground">
        {heading} {moduleId}
      </h3>
      {moduleScenarios.length === 0 && !isLoading ? (
        <p className="text-muted-foreground italic">
          {t("Aucun scénario disponible pour ce module.", "No scenarios available for this module.")}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {moduleScenarios.map((scenario) => {
            const scnCode = resolveScenarioScnCode(scenario);
            const completedRun = getCompletedRun(scenario);
            const activeRun = completedRun ? undefined : getActiveRun(scenario);
            const binding = scnCode && enterpriseStyled ? getScenarioBinding(scnCode) : undefined;
            const boardCardClass = enterpriseStyled
              ? `tec-mission-board-card tec-mission-board-card--m${moduleId}`
              : "";

            return (
              <div
                key={scnCode ?? scenario.id}
                className={`bg-card border rounded-lg p-4 flex flex-col justify-between hover:shadow-lg transition-shadow ${boardCardClass}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <div className="min-w-0">
                      {scnCode && (
                        <span className="inline-flex items-center gap-2 flex-wrap">
                          <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded mb-1">
                            {scnCode}
                          </span>
                          {binding && (
                            <>
                              <PriorityBadge priority={binding.priority} language={language} className="mb-1" />
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 mb-1">
                                {language === "FR"
                                  ? DEPARTMENT_LABELS[binding.department].fr
                                  : DEPARTMENT_LABELS[binding.department].en}
                              </span>
                            </>
                          )}
                        </span>
                      )}
                      <h4 className="font-semibold text-foreground truncate">{scenario.name}</h4>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${DIFF_CONFIG[scenario.difficulty ?? "moyen"]?.bg} ${DIFF_CONFIG[scenario.difficulty ?? "moyen"]?.text}`}>
                      {language === "FR" ? DIFF_CONFIG[scenario.difficulty ?? "moyen"]?.labelFr : DIFF_CONFIG[scenario.difficulty ?? "moyen"]?.labelEn}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {language === "FR" ? (scenario.descriptionFr ?? "") : (scenario.descriptionEn ?? "")}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <Clock size={14} />
                    <span>
                      {SCENARIO_DURATION[scnCode ? parseInt(scnCode.replace("SCN-", ""), 10) : scenario.id]}{" "}
                      {t("min", "min")}
                    </span>
                    <Target size={14} className="ml-4" />
                    <span>{scenario.targetScore ?? 60}% {t("cible", "target")}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {activeRun && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                        <MonitorPlay size={12} className="mr-1" /> {t("En cours", "In Progress")}
                      </span>
                    )}
                    {completedRun && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        <CheckCircle size={12} className="mr-1" /> {t("Terminé", "Completed")}
                      </span>
                    )}
                    {completedRun && completedRun.score != null && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        <BarChart2 size={12} className="mr-1" />{" "}
                        {enterpriseStyled ? t("Résultat:", "Outcome:") : t("Score:", "Score:")}{" "}
                        {completedRun.score}/100
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  {activeRun ? (
                    <button
                      onClick={() => navigate(`/student/run/${activeRun.run.id}`)}
                      className="flex-1 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
                    >
                      <Play size={16} className="inline mr-2" /> {t("Continuer", "Continue")}
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        onStartScenario({
                          id: scenario.id,
                          name: scenario.name,
                          difficulty: scenario.difficulty ?? undefined,
                        })
                      }
                      className="flex-1 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
                    >
                      <Play size={16} className="inline mr-2" /> {t("Démarrer", "Start")}
                    </button>
                  )}
                  {completedRun && (
                    <button
                      onClick={() => navigate(`/student/run/${completedRun.run.id}/report`)}
                      className="px-4 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-md hover:bg-secondary/90 transition-colors"
                    >
                      <FileText size={16} className="inline mr-2" /> {t("Rapport", "Report")}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
