import { useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { ChevronRight, ClipboardList, Loader2, Sunrise, UserCog } from "lucide-react";
import FioriShell from "@/components/FioriShell";
import EnterpriseHeader from "@/components/enterprise/EnterpriseHeader";
import CharacterCard from "@/components/enterprise/CharacterCard";
import BusinessContextPanel from "@/components/enterprise/BusinessContextPanel";
import StakeholderStrip from "@/components/enterprise/StakeholderStrip";
import FacilityContextStrip from "@/components/enterprise/FacilityContextStrip";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { getMissionForScenario } from "../../../../server/missionData";
import {
  acknowledgeMorningBriefing,
  isMorningBriefingEnabled,
  shouldShowMorningBriefing,
} from "@/lib/morningBriefing";

export default function MorningBriefing() {
  const { runId } = useParams<{ runId: string }>();
  const [, navigate] = useLocation();
  const { t, language } = useLanguage();
  const runIdNum = parseInt(runId ?? "0", 10);

  useEffect(() => {
    if (!isMorningBriefingEnabled()) {
      navigate(`/student/run/${runIdNum}`, { replace: true });
    }
  }, [navigate, runIdNum]);

  const { data, isLoading } = trpc.runs.state.useQuery(
    { runId: runIdNum },
    { enabled: runIdNum > 0 && isMorningBriefingEnabled() },
  );

  const scenario = data?.scenario;
  const moduleId = data?.moduleId;
  const mission = getMissionForScenario(
    scenario ? { ...scenario, moduleId: scenario.moduleId ?? moduleId } : null,
  );
  const ent = mission?.enterprise;
  const completedStepsCount = (data?.completedSteps as string[] | undefined)?.length ?? 0;

  useEffect(() => {
    if (!data || isLoading) return;
    if (
      !shouldShowMorningBriefing(
        runIdNum,
        scenario ? { ...scenario, moduleId: scenario.moduleId ?? moduleId } : null,
        data.run?.status,
        completedStepsCount,
      )
    ) {
      navigate(`/student/run/${runIdNum}`, { replace: true });
    }
  }, [data, isLoading, runIdNum, scenario, moduleId, completedStepsCount, navigate]);

  function handleProceed() {
    acknowledgeMorningBriefing(runIdNum);
    navigate(`/student/run/${runIdNum}`);
  }

  if (isLoading || !data || !mission?.enterprise || !ent) {
    return (
      <FioriShell
        title={t("Briefing du matin", "Morning briefing")}
        breadcrumbs={[
          { label: t("Scénarios", "Scenarios"), href: "/student/connect" },
          { label: t("Briefing du matin", "Morning briefing") },
        ]}
      >
        <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
          <Loader2 size={20} className="animate-spin" />
          {t("Préparation du briefing opérationnel...", "Preparing operational briefing...")}
        </div>
      </FioriShell>
    );
  }

  const businessContextText =
    language === "FR" ? ent.businessContext?.fr : ent.businessContext?.en;
  const resolvedModuleId =
    moduleId ??
    (mission.scenarioId <= 5
      ? 1
      : mission.scenarioId <= 8
        ? 2
        : mission.scenarioId <= 11
          ? 3
          : mission.scenarioId <= 14
            ? 4
            : 5);

  return (
    <FioriShell
      title={t("Briefing du matin", "Morning briefing")}
      breadcrumbs={[
        { label: t("Concorde Connect", "Concorde Connect"), href: "/student/connect" },
        { label: t("Briefing du matin", "Morning briefing") },
      ]}
    >
      <div className="max-w-3xl mx-auto space-y-0">
        <EnterpriseHeader
          scnCode={mission.scnCode}
          department={ent.department}
          priority={ent.priority}
          moduleId={resolvedModuleId}
          language={language}
          t={t}
        />

        <div className="p-6 md:p-8 space-y-6 font-sans bg-white dark:bg-slate-900 border-x border-b border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="tec-briefing-panel p-5 flex gap-4">
            <div className="p-2 bg-amber-100 dark:bg-amber-950/40 rounded-md shrink-0 h-fit">
              <Sunrise size={24} className="text-amber-700 dark:text-amber-300" />
            </div>
            <div className="min-w-0 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                {t("Briefing du matin — CDC", "Morning briefing — CDC")}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t(
                  "Avant d'ouvrir la fiche de mission, intégrez le contexte opérationnel, les parties prenantes et l'affectation superviseur.",
                  "Before opening the mission sheet, absorb operational context, stakeholders, and supervisor assignment.",
                )}
              </p>
            </div>
          </div>

          <div className="space-y-4 border-b border-slate-200 dark:border-slate-700 pb-6">
            <div>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">
                {t("Mission", "Mission")}
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                {ent.mission ?? mission.objective}
              </p>
            </div>
            <div className="tec-briefing-panel p-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase">
                {t("Situation", "Situation")}
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic mt-2">
                &ldquo;{ent.situation ?? mission.context}&rdquo;
              </p>
            </div>
          </div>

          {ent.supervisor && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <UserCog size={14} />
                {t("Affectation superviseur", "Supervisor assignment")}
              </p>
              <CharacterCard character={ent.supervisor} language={language} />
            </div>
          )}

          {businessContextText && (
            <BusinessContextPanel
              title={t("Contexte d'affaires", "Business context")}
              content={businessContextText}
            />
          )}

          <StakeholderStrip
            customer={ent.customer}
            supplier={ent.supplier}
            language={language}
            t={t}
          />

          <FacilityContextStrip
            warehouseZone={ent.warehouseZone}
            businessUnit={ent.businessUnit}
            incidentId={ent.incidentId}
            language={language}
            t={t}
          />

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              {t(
                "La fiche de mission complète reste disponible dans le cockpit. Le cycle de mission institutionnel n'est pas modifié.",
                "The full mission sheet remains available in the cockpit. The institutional mission lifecycle is unchanged.",
              )}
            </p>
            <button
              type="button"
              onClick={handleProceed}
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 text-xs font-bold transition-all shrink-0"
            >
              <ClipboardList size={16} />
              {t("Accuser réception — ouvrir le cockpit", "Acknowledge — open cockpit")}
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </FioriShell>
  );
}
