import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  FileText,
  ClipboardCheck,
  Info,
  ListOrdered,
  AlertTriangle,
  CheckCircle2,
  UserCog,
  ChevronDown,
  ChevronUp,
  Target,
  FileStack,
} from "lucide-react";
import { type MissionWithEnterprise } from "../../../server/missionData";
import { getCockpitPedagogy, pickLang } from "@/data/scenarioCockpitPedagogy";
import { isEnterpriseExperienceEnabled } from "@/lib/enterpriseExperience";
import EnterpriseHeader from "@/components/enterprise/EnterpriseHeader";
import MissionHeroBlock from "@/components/enterprise/MissionHeroBlock";
import { resolvePageMissionTitle } from "@/lib/missionDisplay";
import StakeholderStrip from "@/components/enterprise/StakeholderStrip";
import BusinessContextPanel from "@/components/enterprise/BusinessContextPanel";
import ErpExplorerCard from "@/components/enterprise/ErpExplorerCard";
import FacilityContextStrip from "@/components/enterprise/FacilityContextStrip";
import { buildProcessContext } from "@shared/enterprise/buildProcessContext";
import type { MissionLifecyclePhase } from "@shared/enterprise/missionLifecycle";
import MissionLifecycleSheetBanner from "@/components/enterprise/MissionLifecycleSheetBanner";

interface MissionSheetProps {
  mission: MissionWithEnterprise | null;
  scenario?: {
    id?: number;
    name?: string | null;
    descriptionFr?: string | null;
    descriptionEn?: string | null;
    moduleId?: number;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Demo mode expands Execution Reference; Evaluation collapses it (Manifesto §3.3). */
  isDemo?: boolean;
  runId?: number;
  activeStepCode?: string | null;
  /** RC20-A.3 — phase chrome only; mission content unchanged */
  lifecyclePhase?: MissionLifecyclePhase;
  /** RC21-C.1A — hide duplicate EnterpriseHeader when parent route already shows it */
  suppressHeader?: boolean;
  /** RC21-C.1A — hide duplicate hero when parent viewport already shows MissionHeroBlock */
  suppressHero?: boolean;
}

function SectionTitle({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
      <Icon size={14} /> {children}
    </h3>
  );
}

function EnterpriseMissionContent({
  mission,
  isDemo,
  language,
  t,
  activeStepCode,
  suppressHeader = false,
  suppressHero = false,
}: {
  mission: MissionWithEnterprise;
  isDemo: boolean;
  language: "FR" | "EN";
  t: (fr: string, en: string) => string;
  activeStepCode?: string | null;
  suppressHeader?: boolean;
  suppressHero?: boolean;
}) {
  const ent = mission.enterprise;
  const [executionExpanded, setExecutionExpanded] = useState(isDemo);
  const pedagogy = mission.scnCode ? getCockpitPedagogy(mission.scnCode) : null;
  const moduleId = mission.scenarioId <= 5 ? 1 : mission.scenarioId <= 8 ? 2 : mission.scenarioId <= 11 ? 3 : mission.scenarioId <= 14 ? 4 : 5;
  const processContext = buildProcessContext(mission.scnCode, activeStepCode ?? null);
  const processCards = processContext.cards;

  if (!ent) {
    return null;
  }

  const businessContextText = language === "FR" ? ent.businessContext?.fr : ent.businessContext?.en;
  const peopleText = language === "FR" ? ent.peopleInvolved?.fr : ent.peopleInvolved?.en;
  const supervisorNotes =
    language === "FR" ? ent.supervisorNotesAttributed?.fr : ent.supervisorNotesAttributed?.en;

  const missionTitle = resolvePageMissionTitle({
    scnCode: mission.scnCode,
    enterpriseMission: ent.mission,
    objective: mission.objective,
  });

  return (
    <>
      {!suppressHeader && (
        <EnterpriseHeader
          scnCode={mission.scnCode}
          department={ent.department}
          priority={ent.priority}
          moduleId={moduleId}
          language={language}
          t={t}
        />
      )}

      <div className="p-8 space-y-6 font-sans">
        {!suppressHero && (
          <div className="border-b border-slate-200 dark:border-slate-700 pb-6">
            <MissionHeroBlock
              missionTitle={missionTitle}
              role={mission.role}
              moduleLabel={mission.module}
              supervisor={ent.supervisor}
              language={language}
              t={t}
              variant="sheet"
            />
          </div>
        )}

        {/* Context panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="tec-briefing-panel p-4">
            <SectionTitle icon={Info}>{t("Situation", "Situation")}</SectionTitle>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
              &ldquo;{ent.situation ?? mission.context}&rdquo;
            </p>
          </div>
          {businessContextText && (
            <BusinessContextPanel
              title={t("Contexte d'affaires", "Business context")}
              content={businessContextText}
            />
          )}
        </div>

        {peopleText && (
          <div className="tec-briefing-panel p-4">
            <SectionTitle icon={UserCog}>{t("Intervenants", "People involved")}</SectionTitle>
            <p className="text-sm text-slate-700 dark:text-slate-300">{peopleText}</p>
          </div>
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

        {/* Outcome block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 dark:bg-green-950/20 border-l-4 border-green-600 p-4">
            <SectionTitle icon={Target}>
              {t("Résultat d'affaires attendu", "Expected business outcome")}
            </SectionTitle>
            <p className="text-sm text-green-900 dark:text-green-300 leading-relaxed">
              {ent.expectedBusinessOutcome ?? mission.expectedOutcome}
            </p>
          </div>
          {(ent.kpis?.length ?? 0) > 0 && (
            <div className="tec-briefing-panel p-4">
              <SectionTitle icon={ClipboardCheck}>
                {t("Indicateurs de performance", "Performance indicators")}
              </SectionTitle>
              <ul className="space-y-1">
                {ent.kpis!.map((kpi, idx) => (
                  <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    {kpi}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {(ent.documentsAvailable?.length ?? 0) > 0 && (
          <div className="tec-briefing-panel p-4">
            <SectionTitle icon={FileStack}>{t("Documents disponibles", "Documents available")}</SectionTitle>
            <ul className="space-y-1">
              {ent.documentsAvailable!.map((doc, idx) => (
                <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 font-mono">
                  {language === "FR" ? doc.fr : doc.en}
                </li>
              ))}
            </ul>
          </div>
        )}

        {(ent.successCriteria?.length ?? 0) > 0 && (
          <div className="space-y-2">
            <SectionTitle icon={CheckCircle2}>{t("Critères de réussite", "Success criteria")}</SectionTitle>
            <ul className="space-y-1.5">
              {ent.successCriteria!.map((item, idx) => (
                <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {supervisorNotes && ent.supervisor && (
          <div className="tec-supervisor-callout p-4">
            <p className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-2">
              {t("Notes du superviseur", "Supervisor notes")} — {ent.supervisor.name}
            </p>
            <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed italic">
              &ldquo;{supervisorNotes}&rdquo;
            </p>
          </div>
        )}

        {processCards.length > 0 && (
          <ErpExplorerCard
            cards={processCards}
            activeProcessId={processContext.activeProcessId}
            language={language}
            t={t}
            compact
          />
        )}

        {(mission.failureConditions?.length ?? 0) > 0 && (
          <div className="space-y-2">
            <SectionTitle icon={AlertTriangle}>{t("Conditions d'échec", "Failure conditions")}</SectionTitle>
            <ul className="space-y-1.5">
              {mission.failureConditions!.map((item, idx) => (
                <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {pedagogy && (
          <div className="bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-600 p-4 space-y-3">
            <h3 className="text-xs font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wider">
              {t("Observation attendue dans le cockpit", "Expected observation in cockpit")}
            </h3>
            <p className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
              {pickLang(pedagogy.evidenceToObserve, language)}
            </p>
          </div>
        )}

        {/* Execution Reference — collapsed in Evaluation */}
        <div className="border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setExecutionExpanded((v) => !v)}
            className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
              <ListOrdered size={16} />
              {t("Référence d'exécution", "Execution reference")}
            </span>
            {executionExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {executionExpanded && (
            <div className="p-4 space-y-4 border-t border-slate-200 dark:border-slate-700">
              <div className="bg-slate-900 text-white p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase">SKU</p>
                    <p className="font-mono font-bold">{mission.technicalSpecs.sku}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase">{t("Quantité", "Quantity")}</p>
                    <p className="font-mono font-bold">{mission.technicalSpecs.quantity}</p>
                  </div>
                </div>
              </div>
              <ol className="space-y-2 list-none">
                {mission.studentActions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 bg-primary/5 border border-primary/20">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">{action}</span>
                  </li>
                ))}
              </ol>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {mission.controlPoints.map((point, idx) => (
                  <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 p-2 bg-slate-50 dark:bg-slate-800/30 border">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-end">
          <p className="text-[9px] text-slate-400 font-mono italic">
            Concorde Logistics — Quality Management System v2.0
          </p>
          {ent.incidentId && (
            <p className="text-[10px] font-mono text-slate-500">{ent.incidentId}</p>
          )}
        </div>
      </div>
    </>
  );
}

function LegacyMissionContent({
  mission,
  language,
  t,
}: {
  mission: MissionWithEnterprise;
  language: "FR" | "EN";
  t: (fr: string, en: string) => string;
}) {
  const pedagogy = mission.scnCode ? getCockpitPedagogy(mission.scnCode) : null;

  return (
    <div className="p-8 space-y-8 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Info size={14} /> {t("Contexte Opérationnel", "Operational Context")}
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed border-l-4 border-slate-200 dark:border-slate-700 pl-4 italic">
              &ldquo;{mission.context}&rdquo;
            </p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              {t("Objectif de la Mission", "Mission Objective")}
            </h3>
            <p className="text-base font-semibold text-slate-900 dark:text-white">{mission.objective}</p>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-200 dark:border-slate-700 space-y-4">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase">{t("Rôle Assigné", "Assigned Role")}</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{mission.role}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase">{t("Module ERP/WMS", "ERP/WMS Module")}</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{mission.module}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-6 rounded-none">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
          {t("Spécifications Techniques", "Technical Specifications")}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <p className="text-[10px] text-slate-400 uppercase">SKU / Product</p>
            <p className="text-sm font-mono font-bold">{mission.technicalSpecs.sku}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase">{t("Quantité", "Quantity")}</p>
            <p className="text-sm font-mono font-bold">{mission.technicalSpecs.quantity}</p>
          </div>
        </div>
      </div>

      {pedagogy && (
        <div className="bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-600 p-4 space-y-3">
          <h3 className="text-xs font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wider">
            {t("Observation attendue dans le cockpit", "Expected observation in cockpit")}
          </h3>
          <p className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
            {pickLang(pedagogy.evidenceToObserve, language)}
          </p>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
          <ListOrdered size={16} /> {t("Actions à réaliser (étudiant)", "Actions to perform (student)")}
        </h3>
        <ol className="space-y-2 list-none">
          {mission.studentActions.map((action, idx) => (
            <li key={idx} className="flex items-start gap-3 p-3 bg-primary/5 border border-primary/20">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">
                {idx + 1}
              </span>
              <span className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">{action}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <ClipboardCheck size={16} className="text-primary" />{" "}
          {t("Points de Contrôle & Validation", "Control & Validation Points")}
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {mission.controlPoints.map((point, idx) => (
            <li key={idx} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                {idx + 1}
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-300">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-green-50 dark:bg-green-950/20 border-l-4 border-green-600 p-4">
        <h3 className="text-xs font-bold text-green-800 dark:text-green-400 uppercase tracking-wider mb-1">
          {t("Résultat attendu", "Expected outcome")}
        </h3>
        <p className="text-xs text-green-900 dark:text-green-300 leading-relaxed">{mission.expectedOutcome}</p>
      </div>

      {mission.supervisorNotes && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-4">
          <h3 className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-2">
            <UserCog size={14} /> {t("Notes du superviseur", "Supervisor notes")}
          </h3>
          <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">{mission.supervisorNotes}</p>
        </div>
      )}

      {(mission.successCriteria?.length ?? 0) > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 size={14} /> {t("Critères de réussite", "Success criteria")}
          </h3>
          <ul className="space-y-1.5">
            {mission.successCriteria!.map((item, idx) => (
              <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function MissionSheet({
  mission,
  scenario,
  open,
  onOpenChange,
  isDemo = false,
  runId,
  activeStepCode,
  lifecyclePhase,
  suppressHeader = false,
  suppressHero = false,
}: MissionSheetProps) {
  const { t, language } = useLanguage();
  const enterpriseEnabled = isEnterpriseExperienceEnabled();
  const useEnterpriseLayout = enterpriseEnabled && mission?.enterprise;

  const scenarioDescription =
    language === "FR" ? scenario?.descriptionFr : (scenario?.descriptionEn ?? scenario?.descriptionFr);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-0 shadow-2xl rounded-none">
        {!mission ? (
          <>
            <DialogHeader className="bg-slate-100 dark:bg-slate-800 p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="bg-slate-400 p-2">
                  <FileText className="text-white" size={24} />
                </div>
                <DialogTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">
                  {t("Fiche de Mission Opérationnelle", "Operational Mission Sheet")}
                </DialogTitle>
              </div>
            </DialogHeader>
            <div className="p-8 space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                {t(
                  "Fiche de mission en préparation pour ce scénario.",
                  "Mission sheet in preparation for this scenario."
                )}
              </p>
              {scenario?.name && <p className="text-xs font-mono text-slate-500">{scenario.name}</p>}
              {scenarioDescription && (
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed border-l-4 border-slate-200 dark:border-slate-700 pl-4">
                  {scenarioDescription}
                </p>
              )}
            </div>
          </>
        ) : useEnterpriseLayout ? (
          <>
            <DialogHeader className="sr-only">
              <DialogTitle>{t("Fiche de Mission Opérationnelle", "Operational Mission Sheet")}</DialogTitle>
            </DialogHeader>
            {lifecyclePhase && (
              <MissionLifecycleSheetBanner phase={lifecyclePhase} language={language} />
            )}
            <EnterpriseMissionContent
              mission={mission}
              isDemo={isDemo}
              language={language}
              t={t}
              activeStepCode={activeStepCode}
              suppressHeader={suppressHeader}
              suppressHero={suppressHero}
            />
          </>
        ) : (
          <>
            <DialogHeader className="bg-slate-100 dark:bg-slate-800 p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="bg-primary p-2">
                    <FileText className="text-white" size={24} />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">
                      {t("Fiche de Mission Opérationnelle", "Operational Mission Sheet")}
                    </DialogTitle>
                    <p className="text-xs font-semibold text-primary uppercase tracking-widest mt-1">
                      Concorde Logistics — Institutional Standard
                    </p>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] text-slate-500 font-mono">REF: {mission.scnCode}</p>
                </div>
              </div>
            </DialogHeader>
            <LegacyMissionContent mission={mission} language={language} t={t} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
