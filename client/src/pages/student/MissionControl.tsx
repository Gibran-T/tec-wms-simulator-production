import React, { useState, useMemo, useEffect, useRef } from 'react';
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { useParams, useLocation } from "wouter";
import { 
  CheckCircle, 
  AlertTriangle, 
  Trophy, 
  FlaskConical, 
  LayoutDashboard, 
  ClipboardList, 
  Package, 
  Activity,
  ShieldCheck,
  ChevronRight,
  FileText,
} from "lucide-react";
import FioriShell from "@/components/FioriShell";
import TecLogJourneyStrip from "@/components/TecLogJourneyStrip";
import MissionSheet from "@/components/MissionSheet";
import EnterpriseHeader from "@/components/enterprise/EnterpriseHeader";
import MissionHeroBlock from "@/components/enterprise/MissionHeroBlock";
import { resolvePageMissionTitle } from "@/lib/missionDisplay";
import { isEnterpriseExperienceEnabled } from "@/lib/enterpriseExperience";
import { isMissionLifecycleEnabled } from "@/lib/missionLifecycle";
import { shouldShowMorningBriefing, isMorningBriefingEnabled } from "@/lib/morningBriefing";
import { resolveMissionLifecyclePhase } from "@shared/enterprise/missionLifecycle";
import MissionLifecycleHub from "@/components/enterprise/MissionLifecycleHub";
import { isAiMentorUiEnabled } from "@/lib/aiMentor";
import MentorHelpDrawer from "@/components/mentor/MentorHelpDrawer";
import UnpostedTransactionsPanel from "@/components/UnpostedTransactionsPanel";
import OperationalIntelligenceLayer from "@/components/operational-intelligence/OperationalIntelligenceLayer";
import { getMissionForScenario, resolveScnCode } from "../../../../server/missionData";
import { getCockpitPedagogy, pickLang } from "@/data/scenarioCockpitPedagogy";
import M4KpiSnapshotHeader from "@/components/operational-intelligence/m4/M4KpiSnapshotHeader";
import M4KpiEvidenceFeed from "@/components/operational-intelligence/m4/M4KpiEvidenceFeed";
import { isM4EvidenceScn, type M4KpiInterpretationRow, type M4KpiSnapshot } from "@/data/m4KpiBandUtils";
import {
  buildM3ResolutionChain,
  buildReplenishmentParamRows,
  computeM3PerformanceMetrics,
  getM3GridStatus,
  getM3StepAwareHint,
  getReplenishmentParams,
  isScn011ConfirmatoryStep,
  isStudentAdjTransaction,
  type M3RunEvidence,
} from "@/lib/m3OperationalEvidence";
import {
  M3ConfirmationTargetsTable,
  M3ReplenishmentParamsTable,
  M3ResolutionChainRow,
} from "@/components/operational-intelligence/M3OperationalTowerView";
import M5KpiLedgerWidget from "@/components/m5/M5KpiLedgerWidget";
import M5TransactionTimeline from "@/components/m5/M5TransactionTimeline";
import M5ZoneFlowBar from "@/components/m5/M5ZoneFlowBar";
import M5ExecutiveChainStrip from "@/components/m5/M5ExecutiveChainStrip";

import { useAuth } from "@/_core/hooks/useAuth";

export default function MissionControl() {
  const { runId } = useParams<{ runId: string }>();
  const [, navigate] = useLocation();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [showMission, setShowMission] = useState(false);
  const [mentorOpen, setMentorOpen] = useState(false);
  const [mentorEntryPoint, setMentorEntryPoint] = useState<"mission_control" | "oil_panel_f">("mission_control");
  const briefingAutoOpened = useRef(false);
  
  const isTeacher = user?.role === "teacher" || user?.role === "admin";
  const runIdNum = parseInt(runId);
  
  const { data, isLoading } = trpc.runs.state.useQuery({ runId: runIdNum });
  const { data: txList } = trpc.transactions.list.useQuery({ runId: runIdNum }, { enabled: !!data && !isLoading });
  const isM5Early = data?.moduleId === 5;
  const { data: m5KpiLedger, isFetching: m5LedgerLoading } = trpc.m5.kpiLedger.useQuery(
    { runId: runIdNum },
    {
      enabled: !!isM5Early && !!data && data.run?.status !== "completed",
      refetchInterval: isM5Early ? 3000 : false,
    },
  );

  type TxRow = { docType: string; sku: string; bin: string; qty: number; posted?: boolean; docRef?: string | null };

  const transactionsFromState = (data as { transactions?: TxRow[] } | undefined)?.transactions;
  const unpostedFromState = (data as { unpostedTransactions?: TxRow[] } | undefined)?.unpostedTransactions;
  const demoBackendState = (data as { demoBackendState?: { transactions?: TxRow[]; cycleCounts?: { variance: number; resolved?: boolean }[] } | null } | undefined)?.demoBackendState;

  const normalizeTx = (tx: TxRow): TxRow => ({
    docType: tx.docType,
    sku: tx.sku,
    bin: tx.bin ?? "—",
    qty: Number(tx.qty),
    posted: !!tx.posted,
    docRef: tx.docRef ?? null,
  });

  const allTransactions = useMemo(() => {
    const merged = new Map<string, TxRow>();
    const add = (tx: TxRow) => {
      const row = normalizeTx(tx);
      const key = `${row.docType}|${row.docRef ?? ""}|${row.sku}|${row.bin}|${row.qty}|${row.posted}`;
      if (!merged.has(key)) merged.set(key, row);
    };
    for (const tx of transactionsFromState ?? txList ?? []) {
      add({
        docType: tx.docType,
        sku: tx.sku,
        bin: tx.bin,
        qty: Number(tx.qty),
        posted: tx.posted,
        docRef: tx.docRef ?? null,
      });
    }
    for (const tx of demoBackendState?.transactions ?? []) add(tx);
    for (const tx of unpostedFromState ?? []) add({ ...tx, posted: false });
    return Array.from(merged.values());
  }, [transactionsFromState, txList, demoBackendState, unpostedFromState]);

  const unpostedTxs = useMemo(() => {
    const fromState = unpostedFromState ?? [];
    if (fromState.length > 0) return fromState;
    return allTransactions.filter((tx) => !tx.posted);
  }, [unpostedFromState, allTransactions]);

  const enterpriseEnabled = isEnterpriseExperienceEnabled();
  const lifecycleFlagOn = isMissionLifecycleEnabled() && enterpriseEnabled;
  const lifecycleRunStatus = data?.run?.status;
  const lifecycleCompletedCount = (data?.completedSteps as string[] | undefined)?.length ?? 0;
  const lifecycleScenario = data?.scenario;
  const lifecycleModuleId = data?.moduleId;
  const lifecycleMission = getMissionForScenario(
    lifecycleScenario
      ? { ...lifecycleScenario, moduleId: lifecycleScenario.moduleId ?? lifecycleModuleId }
      : null,
  );
  const lifecycleEnabled = lifecycleFlagOn && !!lifecycleMission?.enterprise;
  const missionLifecyclePhase =
    lifecycleEnabled && lifecycleRunStatus != null
      ? resolveMissionLifecyclePhase({
          runStatus: lifecycleRunStatus,
          completedStepsCount: lifecycleCompletedCount,
        })
      : null;

  useEffect(() => {
    if (!data || isLoading) return;
    const scenarioRef = data.scenario
      ? { ...data.scenario, moduleId: data.scenario.moduleId ?? data.moduleId }
      : null;
    if (
      shouldShowMorningBriefing(
        runIdNum,
        scenarioRef,
        data.run?.status,
        (data.completedSteps as string[] | undefined)?.length ?? 0,
      )
    ) {
      navigate(`/student/run/${runIdNum}/briefing`, { replace: true });
    }
  }, [data, isLoading, runIdNum, navigate]);

  useEffect(() => {
    if (
      lifecycleEnabled &&
      missionLifecyclePhase === "briefing" &&
      !briefingAutoOpened.current &&
      !isMorningBriefingEnabled() &&
      !shouldShowMorningBriefing(
        runIdNum,
        lifecycleScenario
          ? { ...lifecycleScenario, moduleId: lifecycleScenario.moduleId ?? lifecycleModuleId }
          : null,
        lifecycleRunStatus,
        lifecycleCompletedCount,
      )
    ) {
      briefingAutoOpened.current = true;
      setShowMission(true);
    }
  }, [
    lifecycleEnabled,
    missionLifecyclePhase,
    runIdNum,
    lifecycleScenario,
    lifecycleModuleId,
    lifecycleRunStatus,
    lifecycleCompletedCount,
  ]);

  if (isLoading) {
    return (
      <FioriShell title="MISSION CONTROL" breadcrumbs={[{ label: t("Scénarios", "Scenarios"), href: "/student/scenarios" }, { label: "Mission Control" }]}>
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </FioriShell>
    );
  }

  if (!data) return null;

  const {
    run, scenario, completedSteps, compliance, totalScore: score, nextStep,
    progressPct, isDemo, moduleId, steps: backendSteps, inventory,
  } = data;

  const atpShortage = (data as { atpShortage?: { active: boolean; sku: string; stockAvailable: number; soDemand: number; deficit: number } | null }).atpShortage;
  const nextActionHint = (data as {
    nextActionHint?: { fr: string; en: string; titleFr: string; titleEn: string } | null;
  }).nextActionHint;

  const kpiInterpretations = (data as { kpiInterpretations?: M4KpiInterpretationRow[] }).kpiInterpretations;
  const m4KpiSnapshot = (data as { m4KpiSnapshot?: M4KpiSnapshot }).m4KpiSnapshot;

  const m3Evidence = (data as { m3Evidence?: M3RunEvidence }).m3Evidence;
  const isM3 = moduleId === 3;
  const isM5 = moduleId === 5;

  const mission = getMissionForScenario(
    scenario ? { ...scenario, moduleId: scenario.moduleId ?? moduleId } : null
  );
  const scnCode = mission?.scnCode ?? resolveScnCode(
    scenario ? { ...scenario, moduleId: scenario.moduleId ?? moduleId } : null
  );
  const m3Scn = isM3 ? scnCode as "SCN-009" | "SCN-010" | "SCN-011" | undefined : undefined;
  const pedagogy = getCockpitPedagogy(scnCode);
  const showM4Evidence = isM4EvidenceScn(moduleId, scnCode) && !!m4KpiSnapshot;
  const m5VarianceBlocked =
    isM5 &&
    scnCode === "SCN-016" &&
    m5KpiLedger?.evidence != null &&
    m5KpiLedger.evidence.varianceQty !== 0 &&
    !m5KpiLedger.evidence.varianceResolved;

  const STEPS = (backendSteps ?? []).map((s: { code: string; labelEn?: string; labelFr?: string; sapCode?: string }) => ({
    key: s.code,
    label: s.labelEn ?? s.code,
    labelFr: s.labelFr ?? s.code,
    code: s.sapCode ?? s.code,
  }));

  const hasVariance = demoBackendState?.cycleCounts?.some((c: { variance: number; resolved?: boolean }) => c.variance !== 0 && !c.resolved) ?? false;
  const effectiveSteps = (moduleId === 1 && !hasVariance && scnCode !== "SCN-004")
    ? STEPS.filter(s => s.key !== "ADJ")
    : STEPS;
  const validatedStepCount = (completedSteps as string[]).filter((s) => effectiveSteps.some((e) => e.key === s)).length;

  const nextStepCode = (nextStep as { code?: string } | null)?.code;
  const nextStepDef = STEPS.find(s => s.key === nextStepCode);

  const m3InitialState = m3Evidence?.initialStateJson;
  const m3ReplenishParams = isM3 ? getReplenishmentParams(m3InitialState) : [];
  const m3ReplenishRows = isM3 && m3Scn === "SCN-011"
    ? buildReplenishmentParamRows(m3ReplenishParams, (inventory ?? {}) as Record<string, number>)
    : [];
  const m3ResolutionChain = isM3 && m3Scn === "SCN-009" && m3Evidence
    ? buildM3ResolutionChain({
        completedSteps: completedSteps as string[],
        nextStepCode,
        inventoryCounts: m3Evidence.inventoryCounts,
        inventoryAdjustments: m3Evidence.inventoryAdjustments,
        initialStateJson: m3Evidence.initialStateJson,
        transactions: allTransactions.map((tx) => ({
          docType: tx.docType,
          sku: tx.sku,
          qty: Number(tx.qty),
          posted: tx.posted,
        })),
      })
    : [];
  const m3PerformanceMetrics = isM3 && m3Evidence
    ? computeM3PerformanceMetrics({
        scnCode: m3Scn,
        initialStateJson: m3Evidence.initialStateJson,
        inventory: (inventory ?? {}) as Record<string, number>,
        inventoryCounts: m3Evidence.inventoryCounts,
        inventoryAdjustments: m3Evidence.inventoryAdjustments,
        replenishmentSuggestions: m3Evidence.replenishmentSuggestions,
        transactions: allTransactions.map((tx) => ({
          docType: tx.docType,
          sku: tx.sku,
          qty: Number(tx.qty),
          posted: tx.posted,
        })),
      })
    : [];
  const m3ActionHint = isM3 && pedagogy
    ? getM3StepAwareHint(m3Scn, nextStepCode, pedagogy, language)
    : null;
  const scn007ActionHint = scnCode === "SCN-007" && nextActionHint
    ? (language === "EN" ? nextActionHint.en : nextActionHint.fr)
    : null;
  const cockpitActionHint = isM3
    ? m3ActionHint
    : scn007ActionHint ?? (pedagogy ? pickLang(pedagogy.expectedActionHint, language) : null);
  const showScn011ConfirmatoryBanner = m3Scn === "SCN-011" && isScn011ConfirmatoryStep(nextStepCode);
  const m3ConfirmationTargets = m3Scn === "SCN-011"
    ? m3ReplenishRows.map((r) => ({
        sku: r.sku,
        systemLevel: r.stock,
        roleFr: "Confirmer sous Min",
        roleEn: "Confirm below Min",
      }))
    : [];

  const gridStatusLabel = (status: ReturnType<typeof getM3GridStatus>) => {
    const labels: Record<typeof status, { fr: string; en: string; cls: string }> = {
      BELOW_MIN: { fr: "BELOW_MIN", en: "BELOW_MIN", cls: "bg-red-100 text-red-700" },
      VARIANCE_OPEN: { fr: "VARIANCE_OPEN", en: "VARIANCE_OPEN", cls: "bg-amber-100 text-amber-800" },
      RECONCILED: { fr: "RECONCILED", en: "RECONCILED", cls: "bg-green-100 text-green-700" },
      AVAILABLE: { fr: "AVAILABLE", en: "AVAILABLE", cls: "bg-green-100 text-green-700" },
      EMPTY: { fr: "EMPTY", en: "EMPTY", cls: "bg-slate-100 text-slate-600" },
    };
    const l = labels[status];
    return { text: language === "FR" ? l.fr : l.en, cls: l.cls };
  };

  const missionLifecyclePhaseResolved =
    lifecycleEnabled && run.status != null
      ? resolveMissionLifecyclePhase({
          runStatus: run.status,
          completedStepsCount: (completedSteps as string[]).length,
        })
      : null;

  const missionTitle = mission
    ? resolvePageMissionTitle({
        scnCode: mission.scnCode,
        scenarioName: scenario?.name,
        enterpriseMission: mission.enterprise?.mission,
        objective: mission.objective,
      })
    : (scenario?.name ?? t("Cockpit opérationnel", "Operational cockpit"));

  const enterpriseIdentityActive = enterpriseEnabled && !!mission?.enterprise;
  const showMissionSheetCta = !lifecycleEnabled || !missionLifecyclePhaseResolved;

  return (
    <FioriShell
      title={t("COCKPIT OPÉRATIONNEL", "OPERATIONAL COCKPIT")}
      breadcrumbs={[{ label: t("Scénarios", "Scenarios"), href: "/student/scenarios" }, { label: "Mission Control" }]}
    >
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <TecLogJourneyStrip activeStep="scenario" className="mb-1" />

        {lifecycleEnabled && missionLifecyclePhaseResolved && (
          <MissionLifecycleHub
            phase={missionLifecyclePhaseResolved}
            language={language}
            t={t}
            progressPct={progressPct}
            onOpenMissionSheet={() => setShowMission(true)}
            onOpenRunReport={() => navigate(`/student/run/${runId}/report`)}
          />
        )}

        {enterpriseIdentityActive && mission?.enterprise && (
          <>
            <EnterpriseHeader
              scnCode={mission.scnCode}
              department={mission.enterprise.department}
              priority={mission.enterprise.priority}
              moduleId={moduleId}
              language={language}
              t={t}
            />

            <MissionHeroBlock
              missionTitle={missionTitle}
              role={mission.role}
              moduleLabel={mission.module}
              supervisor={mission.enterprise.supervisor}
              language={language}
              t={t}
              variant="page"
              showSupervisor={false}
            />

            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-4 py-2">
              <p className="text-[10px] font-mono text-slate-500 min-w-0 truncate">
                SESSION: {runId.padStart(6, "0")} · {mission.scnCode}
              </p>
              <div className="flex items-center gap-3">
                {showMissionSheetCta && (
                  <button
                    onClick={() => setShowMission(true)}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-xs font-bold transition-all hover:bg-primary/90"
                  >
                    <ClipboardList size={16} />
                    {t("FICHE DE MISSION", "MISSION SHEET")}
                  </button>
                )}
                {isDemo && (
                  <div className="flex items-center gap-2 bg-indigo-100 dark:bg-indigo-950 border border-indigo-300 dark:border-indigo-700 px-3 py-1.5 text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
                    <FlaskConical size={14} />
                    {t("DÉMO", "DEMO")}
                  </div>
                )}
                {isAiMentorUiEnabled() && (
                  <MentorHelpDrawer
                    runId={runIdNum}
                    isDemo={!!isDemo}
                    runStatus={run.status}
                    moduleId={moduleId}
                    scnCode={scnCode}
                    entryPoint={mentorEntryPoint}
                    open={mentorOpen}
                    onOpenChange={setMentorOpen}
                    onTriggerClick={() => setMentorEntryPoint("mission_control")}
                  />
                )}
              </div>
            </div>
          </>
        )}

        {!enterpriseIdentityActive && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-4 rounded-none border-b-4 border-primary">
          <div className="flex items-center gap-4">
            <div className="bg-primary/20 p-2 border border-primary/40">
              <LayoutDashboard className="text-primary" size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight uppercase">Concorde Logistics WMS</h1>
              <p className="text-[10px] font-mono text-slate-400">SESSION: {runId.padStart(6, '0')} | USER_ROLE: STUDENT_OPERATOR</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowMission(true)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 text-xs font-bold transition-all"
            >
              <ClipboardList size={16} className="text-primary" />
              {t("FICHE DE MISSION", "MISSION SHEET")}
            </button>
            
            {isDemo && (
              <div className="flex items-center gap-2 bg-indigo-950 border border-indigo-700 px-4 py-2 text-xs font-bold text-indigo-300">
                <FlaskConical size={16} />
                {t("MODE DÉMONSTRATION / PRATIQUE GUIDÉE", "DEMONSTRATION / GUIDED PRACTICE")}
              </div>
            )}
          </div>
        </div>
        )}

        {/* ── Operational Intelligence Layer (Phase B) ── */}
        <OperationalIntelligenceLayer
          runId={runIdNum}
          run={run}
          scenario={scenario ?? { id: 0, moduleId: moduleId }}
          mission={mission}
          completedSteps={completedSteps as string[]}
          nextStep={nextStep as { code?: string; labelFr?: string; labelEn?: string } | null}
          progressPct={progressPct}
          score={score}
          inventory={(inventory ?? {}) as Record<string, number>}
          compliance={compliance}
          unpostedTransactions={unpostedTxs}
          allTransactions={allTransactions}
          isDemo={!!isDemo}
          moduleId={moduleId}
          stepLabels={STEPS.map((s) => ({ key: s.key, labelFr: s.labelFr, labelEn: s.label }))}
          effectiveStepCount={effectiveSteps.length}
          onExecuteStep={(code) => navigate(`/student/run/${runId}/step/${code.toLowerCase()}`)}
          m3Evidence={m3Evidence}
          m5KpiLedger={m5KpiLedger}
          kpiInterpretations={kpiInterpretations}
          m4KpiSnapshot={m4KpiSnapshot}
          identitySuppressed={enterpriseIdentityActive}
          onMentorOpen={() => {
            setMentorEntryPoint("oil_panel_f");
            setMentorOpen(true);
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ── LEFT COLUMN: Operational Focus & Inventory (8 cols) ── */}
          <div className="lg:col-span-8 space-y-6">

            {showM4Evidence && m4KpiSnapshot && scnCode && (
              <M4KpiSnapshotHeader
                snapshot={m4KpiSnapshot}
                scnCode={scnCode}
                language={language}
                t={t}
                variant="cockpit"
              />
            )}
            
            {/* Next Action Cockpit */}
            <div className={`p-6 border-l-8 ${
              run.status === "completed" ? "bg-green-50 border-green-600 dark:bg-green-950/20" : 
              nextStep ? "bg-slate-50 border-primary dark:bg-slate-800/50" : "bg-red-50 border-red-600"
            }`}>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {t("PROCHAINE ACTION REQUISE", "NEXT REQUIRED ACTION")}
                  </p>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    {run.status === "completed" 
                      ? t("MISSION TERMINÉE", "MISSION COMPLETE")
                      : scnCode === "SCN-007" && nextActionHint && nextStepCode === "PUTAWAY"
                        ? (language === "EN" ? nextActionHint.titleEn : nextActionHint.titleFr)
                      : nextStepCode ? `${nextStepDef?.label || nextStepCode} (${nextStepDef?.code || ''})` : t("BLOQUAGE SYSTÈME", "SYSTEM BLOCK")}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl">
                    {run.status === "completed"
                      ? t("Consultez votre rapport de mission pour valider la progression du module.", "Review your mission report to confirm module progress.")
                      : nextStepCode && cockpitActionHint
                        ? cockpitActionHint
                        : nextStepCode
                          ? t("Consultez la fiche de mission et validez les transactions dans le WMS.", "Check the mission sheet and validate transactions in WMS.")
                          : pedagogy
                            ? pickLang(pedagogy.complianceHint, language)
                            : t("Résolvez les non-conformités pour débloquer le flux.", "Resolve non-conformities to unblock the flow.")}
                  </p>
                </div>
                {run.status === "completed" ? (
                  <button
                    onClick={() => navigate(`/student/run/${runId}/report`)}
                    className="bg-green-700 hover:bg-green-600 text-white font-black px-8 py-4 rounded-none transition-transform active:scale-95 flex items-center gap-2 shadow-lg"
                  >
                    <FileText size={18} />
                    {t("VOIR LE RAPPORT", "VIEW REPORT")}
                  </button>
                ) : nextStepCode ? (
                  <button
                    onClick={() => navigate(`/student/run/${runId}/step/${nextStepCode.toLowerCase()}`)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-8 py-4 rounded-none transition-transform active:scale-95 flex items-center gap-2 shadow-lg"
                  >
                    {t("EXÉCUTER", "EXECUTE")} <ChevronRight size={20} />
                  </button>
                ) : null}
              </div>
            </div>

            {isM3 && m3Scn === "SCN-009" && m3ResolutionChain.length > 0 && (
              <M3ResolutionChainRow chips={m3ResolutionChain} language={language} />
            )}

            {isM5 && run.status !== "completed" && (
              <M5ExecutiveChainStrip
                completedSteps={completedSteps as string[]}
                nextStepCode={nextStepCode}
                scnCode={scnCode}
              />
            )}

            {showScn011ConfirmatoryBanner && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700">
                <p className="text-[10px] font-bold text-amber-800 dark:text-amber-200 uppercase mb-1">
                  ℹ️ {t("Étape confirmatoire", "Confirmatory step")}
                </p>
                <p className="text-[10px] text-amber-700 dark:text-amber-300">
                  {t(
                    "Ce scénario ne contient pas d'articles à compter. Complétez cette étape rapidement et concentrez-vous sur le réapprovisionnement Min/Max à l'étape REPLENISH.",
                    "This scenario has no items to count. Complete this step quickly and focus on Min/Max replenishment at the REPLENISH step.",
                  )}
                </p>
                {m3ConfirmationTargets.length > 0 && (
                  <M3ConfirmationTargetsTable rows={m3ConfirmationTargets} t={t} language={language} />
                )}
              </div>
            )}

            {scnCode === "SCN-003" && atpShortage?.active && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-400 dark:border-amber-600">
                <p className="text-[10px] font-bold text-amber-900 dark:text-amber-100 uppercase mb-2">
                  ⚠️ {t("Pénurie ATP — Réapprovisionnement obligatoire", "ATP Shortage — Mandatory Replenishment")}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] font-mono mb-2">
                  <div className="bg-white/60 dark:bg-slate-900/40 p-2 border border-amber-200">
                    <span className="text-slate-500 block uppercase text-[9px]">{t("Stock STOCKAGE", "STOCKAGE stock")}</span>
                    <span className="font-bold text-amber-800 dark:text-amber-200">{atpShortage.stockAvailable}</span>
                  </div>
                  <div className="bg-white/60 dark:bg-slate-900/40 p-2 border border-amber-200">
                    <span className="text-slate-500 block uppercase text-[9px]">{t("Demande SO", "SO demand")}</span>
                    <span className="font-bold text-amber-800 dark:text-amber-200">{atpShortage.soDemand}</span>
                  </div>
                  <div className="bg-white/60 dark:bg-slate-900/40 p-2 border border-red-300">
                    <span className="text-slate-500 block uppercase text-[9px]">{t("Déficit", "Deficit")}</span>
                    <span className="font-bold text-red-700">−{atpShortage.deficit}</span>
                  </div>
                  <div className="bg-white/60 dark:bg-slate-900/40 p-2 border border-amber-200 col-span-2 md:col-span-1">
                    <span className="text-slate-500 block uppercase text-[9px]">SKU</span>
                    <span className="font-bold">{atpShortage.sku}</span>
                  </div>
                </div>
                <p className="text-[10px] text-amber-800 dark:text-amber-200 italic">
                  {t(
                    "Réapprovisionnement obligatoire avant Picking/GI — PO corrective → GR corrective → Rangement corrective.",
                    "Replenishment required before Picking/GI — corrective PO → corrective GR → corrective putaway.",
                  )}
                </p>
                {nextStepCode && ["PO_CORRECTIVE", "GR_CORRECTIVE", "PUTAWAY_CORRECTIVE"].includes(nextStepCode) && (
                  <p className="text-[10px] font-bold text-amber-900 dark:text-amber-100 mt-2 uppercase">
                    {t("Prochaine action", "Next action")}: {nextStepDef?.labelFr || nextStepCode} ({nextStepCode})
                  </p>
                )}
              </div>
            )}

            {isM3 && m3Scn === "SCN-011" && m3ReplenishRows.length > 0 && (
              <div className="bg-card border border-border rounded-none shadow-sm overflow-hidden p-4">
                <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                  {t("Paramètres de réapprovisionnement Min/Max", "Min/Max replenishment parameters")}
                </p>
                <M3ReplenishmentParamsTable rows={m3ReplenishRows} t={t} language={language} />
              </div>
            )}

            {/* Inventory Grid (SAP-like) */}
            <div className="bg-card border border-border rounded-none shadow-sm overflow-hidden">
              <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package size={16} className="text-slate-500" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{t("État des Stocks par Bin", "Stock State by Bin")}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">REF: MMBE_SIMULATOR</span>
              </div>
              <div className="p-0">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900 border-b border-border">
                      <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">Bin / Emplacement</th>
                      <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">SKU / Produit</th>
                      <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase text-right">Quantité</th>
                      <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-mono">
                    {Object.entries(inventory || {}).length > 0 ? (
                      Object.entries(inventory as Record<string, number>).map(([key, qty]) => {
                        const [sku, bin] = key.split("::");
                        const m3Status = isM3 && m3Evidence
                          ? getM3GridStatus(
                              m3Scn,
                              sku,
                              qty,
                              m3Evidence.inventoryCounts,
                              m3Evidence.inventoryAdjustments,
                              allTransactions.map((tx) => ({
                                docType: tx.docType,
                                sku: tx.sku,
                                qty: Number(tx.qty),
                                posted: tx.posted,
                              })),
                              m3ReplenishParams,
                            )
                          : qty > 0 ? "AVAILABLE" : "EMPTY";
                        const statusDisplay = isM3
                          ? gridStatusLabel(m3Status as ReturnType<typeof getM3GridStatus>)
                          : { text: qty > 0 ? "AVAILABLE" : "EMPTY", cls: qty > 0 ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600" };
                        const minMaxParam = m3Scn === "SCN-011" ? m3ReplenishParams.find((p) => p.sku === sku) : undefined;
                        return (
                          <tr key={key} className="border-b border-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="px-4 py-3 font-bold text-primary">{bin}</td>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                              {sku}
                              {minMaxParam && (
                                <span className="block text-[9px] text-slate-400 font-mono mt-0.5">
                                  {minMaxParam.minQty}/{minMaxParam.maxQty}
                                </span>
                              )}
                            </td>
                            <td className={`px-4 py-3 text-right font-bold ${qty < 0 ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>{qty}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 text-[9px] font-bold ${statusDisplay.cls}`}>
                                {statusDisplay.text}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-slate-400 italic">
                          {pedagogy?.emptyStockNote
                            ? pickLang(pedagogy.emptyStockNote, language)
                            : t("Aucun stock détecté dans l'entrepôt.", "No stock detected in the warehouse.")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {isM5 && (
              <M5KpiLedgerWidget
                ledger={m5KpiLedger}
                scnCode={scnCode}
                isLoading={m5LedgerLoading}
              />
            )}

            {isM5 && (
              <>
                <M5ZoneFlowBar transactions={allTransactions} />
                <M5TransactionTimeline
                  transactions={allTransactions}
                  completedSteps={completedSteps as string[]}
                  scnCode={scnCode}
                  varianceBlocked={m5VarianceBlocked}
                />
              </>
            )}

            {unpostedTxs.length > 0 && (
              <UnpostedTransactionsPanel
                runId={runIdNum}
                transactions={unpostedTxs}
              />
            )}

            {/* Transaction Monitor / M4 KPI Evidence Monitor */}
            <div className="bg-card border border-border rounded-none shadow-sm overflow-hidden">
              <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 border-b border-border flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-slate-500" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {showM4Evidence
                      ? t("Moniteur d'évidence KPI", "KPI Evidence Monitor")
                      : t("Moniteur de Transactions", "Transaction Monitor")}
                  </span>
                </div>
                {!showM4Evidence && (
                  <span className="text-[10px] font-mono text-slate-500">
                    {t("Postées", "Posted")}: {allTransactions.filter((tx) => tx.posted).length} · {t("En attente", "Pending")}: {unpostedTxs.length}
                  </span>
                )}
              </div>
              {pedagogy && (
                <p className="px-4 py-2 text-[10px] text-slate-600 dark:text-slate-400 border-b border-border bg-slate-50/80 dark:bg-slate-900/40 italic">
                  {pickLang(pedagogy.transactionMonitorHint, language)}
                </p>
              )}
              <div className="max-h-60 overflow-y-auto">
                {showM4Evidence && scnCode ? (
                  <M4KpiEvidenceFeed
                    scnCode={scnCode}
                    completedSteps={completedSteps as string[]}
                    kpiInterpretations={kpiInterpretations}
                    language={language}
                    t={t}
                  />
                ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900 border-b border-border">
                      <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">Type</th>
                      <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">Ref</th>
                      <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">SKU</th>
                      {scnCode === "SCN-007" && (
                        <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">Lot</th>
                      )}
                      <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">Bin</th>
                      <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase text-right">Qty</th>
                      <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-[10px] font-mono">
                    {allTransactions.length > 0 ? (
                      [...allTransactions].reverse().map((tx, idx) => {
                        const isStudentAdj = isM3 && m3Evidence && isStudentAdjTransaction(tx, m3Evidence.initialStateJson);
                        const scn007Lot =
                          scnCode === "SCN-007"
                            ? tx.docRef === "GR-M2-002-FIFO"
                              ? "LOT-2025-001"
                              : tx.docRef === "GR-M2-002" || tx.docRef === "PO-M2-002"
                                ? "LOT-2025-002"
                                : tx.docType === "PUTAWAY"
                                  ? "LOT-2025-002"
                                  : "—"
                            : null;
                        const scn007Label =
                          scnCode === "SCN-007" && tx.docRef === "GR-M2-002-FIFO"
                            ? t("Stock antérieur", "Prior stock")
                            : null;
                        return (
                        <tr key={idx} className={`border-b border-border hover:bg-slate-50 dark:hover:bg-slate-800/50 ${isStudentAdj ? "bg-primary/5" : ""}`}>
                          <td className="px-4 py-2 font-bold">
                            {tx.docType}
                            {scn007Label ? (
                              <span className="block text-[9px] font-sans font-normal text-slate-500 normal-case">
                                {scn007Label}
                              </span>
                            ) : null}
                          </td>
                          <td className="px-4 py-2 text-slate-500">{tx.docRef || "—"}</td>
                          <td className="px-4 py-2">{tx.sku}</td>
                          {scnCode === "SCN-007" && (
                            <td className="px-4 py-2 text-amber-800 dark:text-amber-300 font-semibold">{scn007Lot}</td>
                          )}
                          <td className="px-4 py-2 text-primary font-semibold">{tx.bin}</td>
                          <td className="px-4 py-2 text-right font-bold">{tx.qty}</td>
                          <td className="px-4 py-2">
                            {isStudentAdj ? (
                              <span className="px-1.5 py-0.5 rounded-sm font-bold bg-primary/10 text-primary text-[9px]">
                                {t("Action étudiant", "Student action")}
                              </span>
                            ) : (
                            <span className={`px-1.5 py-0.5 rounded-sm font-bold ${tx.posted ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700 animate-pulse"}`}>
                              {tx.posted ? "POSTED" : "PENDING"}
                            </span>
                            )}
                          </td>
                        </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={scnCode === "SCN-007" ? 7 : 6} className="px-4 py-6 text-center text-slate-400 italic">
                          {t("Aucune transaction enregistrée.", "No transactions recorded.")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Metrics & Compliance (4 cols) ── */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Compliance Blockers */}
            <div className="bg-card border border-border rounded-none shadow-sm overflow-hidden">
              <div className="bg-slate-900 px-4 py-2 border-b border-primary flex items-center gap-2">
                <ShieldCheck size={16} className="text-primary" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">{t("Contrôle de Conformité", "Compliance Control")}</span>
              </div>
              <div className="p-4 space-y-4">
                <div className={`p-3 border-l-4 flex items-center gap-3 ${compliance.compliant ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                  {compliance.compliant ? <CheckCircle className="text-green-600" size={20} /> : <AlertTriangle className="text-red-600" size={20} />}
                  <div>
                    <p className={`text-xs font-black uppercase ${compliance.compliant ? 'text-green-700' : 'text-red-700'}`}>
                      {compliance.compliant ? t("SYSTÈME CONFORME", "SYSTEM COMPLIANT") : t("NON-CONFORMITÉ DÉTECTÉE", "NON-COMPLIANCE DETECTED")}
                    </p>
                  </div>
                </div>

                {unpostedTxs.length > 0 && moduleId === 1 && (
                  <UnpostedTransactionsPanel
                    runId={runIdNum}
                    transactions={unpostedTxs}
                    compact
                  />
                )}

                <div className="space-y-2">
                  {(compliance.issuesFr?.length ? compliance.issuesFr : compliance.issues).length > 0 ? (
                    (compliance.issuesFr?.length ? compliance.issuesFr : compliance.issues).map((issue: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <AlertTriangle size={12} className="text-red-500 mt-0.5 flex-shrink-0" />
                        <p className="text-[10px] text-slate-700 dark:text-slate-300 font-semibold">{issue}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-slate-500 italic text-center py-2">
                      {pedagogy
                        ? pickLang(pedagogy.complianceHint, language)
                        : t("Aucun bloqueur détecté.", "No blockers detected.")}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Scoring & Performance */}
            <div className="bg-card border border-border rounded-none shadow-sm overflow-hidden">
              <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 border-b border-border flex items-center gap-2">
                <Trophy size={16} className="text-slate-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{t("Indicateurs de Performance", "Performance Indicators")}</span>
              </div>
              <div className="p-4 space-y-6">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{t("Score Pédagogique", "Pedagogical Score")}</p>
                  <div className="text-4xl font-black text-primary">{score}<span className="text-sm text-slate-400">/100</span></div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase">
                    <span className="text-slate-500">{t("Progression", "Progress")}</span>
                    <span className="text-primary">{progressPct}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progressPct}%` }} />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500 font-bold uppercase">{t("Étapes Validées", "Steps Validated")}</span>
                    <span className="font-mono font-bold">{validatedStepCount} / {effectiveSteps.length}</span>
                  </div>
                </div>

                {isM3 && m3PerformanceMetrics.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <p className="text-[9px] font-bold text-slate-500 uppercase text-center">
                      {t("Indicateurs contextuels — non notés", "Contextual indicators — not scored")}
                    </p>
                    {m3PerformanceMetrics.map((metric) => (
                      <div key={metric.labelFr} className="flex justify-between text-[10px]">
                        <span className="text-slate-600 dark:text-slate-400">
                          {language === "FR" ? metric.labelFr : metric.labelEn}
                        </span>
                        <span className="font-mono font-bold text-primary">
                          {language === "FR" ? metric.valueFr : metric.valueEn}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      <MissionSheet
        mission={mission}
        scenario={scenario ?? null}
        open={showMission}
        onOpenChange={setShowMission}
        isDemo={!!isDemo}
        runId={runIdNum}
        activeStepCode={(nextStep as { code?: string } | null)?.code ?? null}
        lifecyclePhase={missionLifecyclePhaseResolved ?? undefined}
        suppressHeader={enterpriseIdentityActive}
        suppressHero={enterpriseIdentityActive}
      />
    </FioriShell>
  );
}
