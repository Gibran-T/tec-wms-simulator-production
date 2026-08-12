import FioriShell from "@/components/FioriShell";
import { trpc } from "@/lib/trpc";
import { useParams, useLocation } from "wouter";
import { CheckCircle, AlertTriangle, Trophy, ArrowLeft, FlaskConical, TrendingUp, BookOpen, Lightbulb, RotateCcw } from "lucide-react";
import { useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import M4KpiSnapshotHeader from "@/components/operational-intelligence/m4/M4KpiSnapshotHeader";
import LearningFeedbackLayer from "@/components/learning-feedback/LearningFeedbackLayer";
import PostRunDebriefChecklist from "@/components/pedagogy/PostRunDebriefChecklist";
import { isM4EvidenceScn, type M4KpiSnapshot } from "@/data/m4KpiBandUtils";
import { resolveScnCode, getMissionForScenario } from "../../../../server/missionData";
import type { LearningFeedbackPayload } from "@shared/learningFeedbackTypes";
import { getModuleScenarioPassThreshold } from "@shared/moduleThresholds";
import { buildEnterpriseDebrief } from "@shared/enterprise/debrief";
import EnterpriseDebriefPanel from "@/components/enterprise/EnterpriseDebriefPanel";
import MentorHelpDrawer from "@/components/mentor/MentorHelpDrawer";
import { isAiMentorUiEnabled } from "@/lib/aiMentor";
import { M5TransactionTimelineReport } from "@/components/m5/M5TransactionTimeline";
import { M5ZoneFlowBarReport } from "@/components/m5/M5ZoneFlowBar";
import ErpExplorerCard from "@/components/enterprise/ErpExplorerCard";
import { buildProcessContext } from "@shared/enterprise/buildProcessContext";
import { isEnterpriseDebriefEnabled, isEnterpriseExperienceEnabled } from "@/lib/enterpriseExperience";
import { isMissionLifecycleEnabled } from "@/lib/missionLifecycle";
import MissionLifecyclePhaseStrip from "@/components/enterprise/MissionLifecyclePhaseStrip";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from "recharts";

/** Defensive defaults when detailedReport is loading, failed, or partially populated. */
function normalizeReportDetail(
  detail: {
    totalErrors?: number;
    totalWarnings?: number;
    stepsCompleted?: number;
    totalSteps?: number;
    stepBreakdown?: Array<{
      step: string;
      label: string;
      completed: boolean;
      pointsEarned: number;
      maxPoints: number;
      pct: number;
    }>;
    errors?: Array<{
      pointsDelta: number;
      explanation: { title: string; detail: string; recommendation: string };
    }>;
    bonuses?: Array<{ pointsDelta: number }>;
    recommendations?: string[];
    scoreLabel?: string;
    certificationUnlocked?: boolean;
    silverEligible?: boolean;
    kpiInterpretations?: Array<{
      kpiKey: string;
      studentAnswer: string;
      isCorrect: boolean | null;
      feedback: string;
      pointsDelta?: number;
    }>;
    interactionModel?: "supervision-doc-v1" | "ops-ledger-v1" | string;
    evidenceVersion?: string;
    m5DocReport?: unknown;
    learningFeedback?: LearningFeedbackPayload | null;
    m4KpiSnapshot?: {
      rotationRate: number;
      serviceLevel: number;
      errorRate: number;
      averageLeadTime: number;
      stockImmobilizedValue: number;
      rotationStatus: string;
      serviceLevelStatus: string;
      errorRateStatus: string;
    };
    m5Report?: {
      kpiSnapshot: {
        rotationRate: number;
        serviceLevel: number;
        errorRate: number;
        averageLeadTime: number;
        stockImmobilizedValue: number;
      } | null;
      varianceTrail: Array<{ sku: string; systemQty: number; countedQty: number; varianceQty: number }>;
      adjustments: Array<{ sku: string; varianceQty: number; adjustmentQty: number; reason: string }>;
      contract?: { sku?: string; qty?: number; poRef?: string; profile?: string };
    };
    zoneFlow?: Array<{ zone: string; color: string; txCount: number }>;
    transactionTimeline?: Array<{
      docType: string;
      sku: string;
      bin: string;
      qty: number;
      zone: string;
      docRef?: string | null;
    }>;
  } | null | undefined,
) {
  if (!detail) return null;
  const errors = Array.isArray(detail.errors) ? detail.errors : [];
  return {
    ...detail,
    totalErrors: typeof detail.totalErrors === "number" ? detail.totalErrors : errors.length,
    totalWarnings: typeof detail.totalWarnings === "number" ? detail.totalWarnings : 0,
    stepsCompleted: typeof detail.stepsCompleted === "number" ? detail.stepsCompleted : 0,
    totalSteps: typeof detail.totalSteps === "number" ? detail.totalSteps : 0,
    stepBreakdown: Array.isArray(detail.stepBreakdown) ? detail.stepBreakdown : [],
    errors,
    bonuses: Array.isArray(detail.bonuses) ? detail.bonuses : [],
    recommendations: Array.isArray(detail.recommendations) ? detail.recommendations : [],
    scoreLabel: detail.scoreLabel ?? "",
    certificationUnlocked: detail.certificationUnlocked ?? false,
    silverEligible: detail.silverEligible ?? false,
  };
}

// ─── Score Evolution Chart component ─────────────────────────────────────────
function ScoreEvolutionChart({
  scenarioId,
  currentRunId,
  passThreshold = 60,
}: {
  scenarioId: number;
  currentRunId: number;
  passThreshold?: number;
}) {
  const { t } = useLanguage();
  const { data, isLoading } = trpc.runs.myScoreEvolution.useQuery({ scenarioId });

  if (isLoading) return (
    <div className="bg-card border border-border rounded-md p-5">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp size={14} className="text-primary" />
        <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
          {t("Mon évolution", "My Progress")}
        </p>
      </div>
      <div className="flex justify-center py-8">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  if (!data || data.totalAttempts < 1) return null;

  const chartData = data.attempts.map(a => ({
    name: `${t("#", "#")}${a.attempt}`,
    score: a.score,
    penalties: a.penalties,
    status: a.status,
    startedAt: a.startedAt,
    isCurrent: a.runId === currentRunId,
  }));

  const trend = data.trend;

  return (
    <div className="bg-card border border-border rounded-md p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-primary" />
          <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
            {t("Mon évolution sur ce scénario", "My progress on this scenario")}
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-muted-foreground">
            {t("Tentatives", "Attempts")}: <strong className="text-foreground">{data.totalAttempts}</strong>
          </span>
          <span className="text-muted-foreground">
            {t("Meilleur", "Best")}: <strong className={data.bestScore >= passThreshold ? "text-emerald-500" : "text-rose-500"}>{data.bestScore}/100</strong>
          </span>
          {data.totalAttempts >= 2 && (
            <span className={`font-bold ${
              trend > 0 ? "text-emerald-500" : trend < 0 ? "text-rose-500" : "text-muted-foreground"
            }`}>
              {trend > 0 ? `▲ +${trend}` : trend < 0 ? `▼ ${trend}` : "—"}
            </span>
          )}
        </div>
      </div>

      {/* Chart */}
      {data.totalAttempts === 1 ? (
        <p className="text-xs text-muted-foreground text-center py-4">
          {t(
            "Complétez une 2ème tentative pour voir votre courbe d'évolution.",
            "Complete a 2nd attempt to see your progress curve."
          )}
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData} margin={{ top: 8, right: 20, bottom: 8, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickFormatter={v => `${v}`}
            />
            {/* Pass threshold line */}
            <ReferenceLine
              y={passThreshold}
              stroke="#10b981"
              strokeDasharray="6 3"
              label={{ value: t(`Seuil ${passThreshold}`, `Pass ${passThreshold}`), position: "insideTopRight", fontSize: 10, fill: "#10b981" }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0]?.payload;
                return (
                  <div className="bg-card border border-border rounded-lg p-3 shadow-lg text-xs">
                    <p className="font-semibold text-foreground mb-1">{t("Tentative", "Attempt")} {label}</p>
                    <p className="text-primary font-bold">{t("Score", "Score")}: {d?.score}/100</p>
                    {d?.penalties > 0 && <p className="text-rose-500">{t("Erreurs", "Errors")}: {d.penalties}</p>}
                    {d?.startedAt && <p className="text-muted-foreground">{new Date(d.startedAt).toLocaleDateString()}</p>}
                    {d?.isCurrent && <p className="text-amber-500 font-semibold">{t("← Tentative actuelle", "← Current attempt")}</p>}
                  </div>
                );
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              name={t("Score", "Score")}
              stroke="#0078d4"
              strokeWidth={2.5}
              dot={(props: any) => {
                const isCurrent = props.payload?.isCurrent;
                const score = props.payload?.score;
                const color = score >= passThreshold ? "#10b981" : "#d13438";
                return (
                  <circle
                    key={props.key}
                    cx={props.cx}
                    cy={props.cy}
                    r={isCurrent ? 7 : 5}
                    fill={isCurrent ? "#f59e0b" : color}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                );
              }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>{t(`Score ≥ ${passThreshold} (Réussi)`, `Score ≥ ${passThreshold} (Passed)`)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-rose-500" />
          <span>{t(`Score < ${passThreshold} (À améliorer)`, `Score < ${passThreshold} (Needs improvement)`)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span>{t("Tentative actuelle", "Current attempt")}</span>
        </div>
      </div>
    </div>
  );
}

export default function RunReport() {
  const { runId } = useParams<{ runId: string }>();
  const [, navigate] = useLocation();
  const { t, language } = useLanguage();
  const parsedRunId = parseInt(runId ?? "", 10);
  const queryEnabled = Number.isFinite(parsedRunId) && parsedRunId > 0;
  const { data, isLoading, isError: stateError } = trpc.runs.state.useQuery(
    { runId: parsedRunId },
    { enabled: queryEnabled },
  );
  const { data: detail, isLoading: detailLoading, isError: detailError } = trpc.runs.detailedReport.useQuery(
    { runId: parsedRunId },
    { enabled: queryEnabled },
  );
  const recordModulePass = trpc.warehouse.recordModulePass.useMutation();
  const recordedModulePassKeyRef = useRef<string | null>(null);

  useEffect(() => {
    recordedModulePassKeyRef.current = null;
  }, [parsedRunId]);

  useEffect(() => {
    if (!data) return;
    const { run, scenario, totalScore } = data;
    if (!run.isDemo && run.status === "completed" && totalScore !== undefined && scenario) {
      const passKey = `${run.id}:${scenario.moduleId}`;
      if (recordedModulePassKeyRef.current === passKey) return;
      recordedModulePassKeyRef.current = passKey;
      recordModulePass.mutate({ moduleId: scenario.moduleId, score: totalScore });
    }
  }, [data]);

  if (!queryEnabled) {
    return (
      <FioriShell title={t("Rapport Final", "Final Report")} breadcrumbs={[
        { label: t("Scénarios", "Scenarios"), href: "/student/scenarios" },
        { label: t("Rapport", "Report") },
      ]}>
        <div className="max-w-3xl mx-auto py-12 text-center space-y-4">
          <AlertTriangle size={32} className="mx-auto text-amber-500" />
          <p className="text-sm text-muted-foreground">
            {t("Identifiant de simulation invalide.", "Invalid simulation id.")}
          </p>
          <button onClick={() => navigate("/student/scenarios")} className="text-xs text-primary hover:underline">
            {t("Retour aux scénarios", "Back to scenarios")}
          </button>
        </div>
      </FioriShell>
    );
  }

  if (isLoading) return (
    <FioriShell title={t("Rapport Final", "Final Report")} breadcrumbs={[
      { label: t("Scénarios", "Scenarios"), href: "/student/scenarios" },
      { label: t("Rapport", "Report") }
    ]}>
      <div className="flex justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    </FioriShell>
  );

  if (stateError || !data) {
    return (
      <FioriShell title={t("Rapport Final", "Final Report")} breadcrumbs={[
        { label: t("Scénarios", "Scenarios"), href: "/student/scenarios" },
        { label: t("Rapport", "Report") },
      ]}>
        <div className="max-w-3xl mx-auto py-12 text-center space-y-4">
          <AlertTriangle size={32} className="mx-auto text-amber-500" />
          <p className="text-sm text-muted-foreground">
            {t(
              "Impossible de charger le rapport. La simulation est introuvable ou inaccessible.",
              "Unable to load the report. The simulation was not found or is not accessible.",
            )}
          </p>
          <button onClick={() => navigate("/student/scenarios")} className="text-xs text-primary hover:underline">
            {t("Retour aux scénarios", "Back to scenarios")}
          </button>
        </div>
      </FioriShell>
    );
  }

  const { run, scenario, completedSteps, compliance, totalScore, progressPct, moduleId } = data as typeof data & { moduleId?: number };
  const safeCompliance = {
    compliant: compliance?.compliant ?? false,
    issuesFr: compliance?.issuesFr ?? [],
  };
  const safeScore = totalScore ?? (run as { score?: number }).score ?? 0;
  const safeDetail = normalizeReportDetail(detail);
  const scnCode = resolveScnCode(scenario ?? null);
  const m4KpiSnapshot: M4KpiSnapshot | undefined =
    (data as { m4KpiSnapshot?: M4KpiSnapshot }).m4KpiSnapshot
    ?? (safeDetail as { m4KpiSnapshot?: M4KpiSnapshot } | null)?.m4KpiSnapshot;
  const showM4ReportSnapshot = isM4EvidenceScn(moduleId ?? scenario?.moduleId ?? 0, scnCode) && !!m4KpiSnapshot;
  const showLearningFeedback = run.status === "completed" && !!safeDetail?.learningFeedback;
  const detailUnavailable = detailError || detailLoading || !safeDetail;
  const isDemo = run.isDemo;
  const resolvedModuleId = moduleId ?? scenario?.moduleId ?? 1;
  const passThreshold = getModuleScenarioPassThreshold(resolvedModuleId);
  const isPerfect = safeScore >= 100;
  const enterpriseEnabled = isEnterpriseExperienceEnabled();
  const mission = getMissionForScenario(scenario ?? null);
  const processContext =
    enterpriseEnabled && scnCode ? buildProcessContext(scnCode, null) : null;
  const processCards = processContext?.cards ?? [];
  const totalSteps = safeDetail?.totalSteps ?? safeDetail?.stepBreakdown?.length ?? (completedSteps as string[]).length;
  const stepsCompleted = safeDetail?.stepsCompleted ?? (completedSteps as string[]).length;
  const enterpriseDebrief =
    isEnterpriseDebriefEnabled() && enterpriseEnabled && mission?.enterprise && run.status === "completed"
      ? buildEnterpriseDebrief({
          moduleId: resolvedModuleId,
          scnCode: scnCode ?? mission.scnCode,
          missionTitle: mission.enterprise.mission ?? mission.objective,
          businessProblem: mission.context,
          expectedOutcome: mission.enterprise.expectedBusinessOutcome ?? mission.expectedOutcome,
          supervisor: mission.enterprise.supervisor,
          score: safeScore,
          passThreshold,
          compliant: safeCompliance.compliant,
          isDemo,
          stepsCompleted,
          totalSteps,
        })
      : null;
  const lifecycleClosureEnabled =
    isMissionLifecycleEnabled() &&
    enterpriseEnabled &&
    !!mission?.enterprise &&
    run.status === "completed";

  return (
    <FioriShell
      title={t("Rapport Final de Simulation", "Final Simulation Report")}
      breadcrumbs={[
        { label: t("Scénarios", "Scenarios"), href: "/student/scenarios" },
        { label: scenario?.name ?? t("Rapport", "Report") },
        { label: t("Rapport Final", "Final Report") }
      ]}
    >
      <div className="max-w-3xl mx-auto space-y-5">

        {detailError && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md px-5 py-3 flex items-start gap-3">
            <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-300">
              {t(
                "Le détail par étape n'a pas pu être chargé. Le résumé principal reste disponible ci-dessous.",
                "Step-by-step detail could not be loaded. The main summary is still available below.",
              )}
            </p>
          </div>
        )}

        {detailUnavailable && !detailError && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md px-5 py-3 flex items-start gap-3">
            <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-300">
              {t(
                "Rapport partiel — données de performance non encore disponibles.",
                "Partial report — performance data not yet available.",
              )}
            </p>
          </div>
        )}

        {/* Demo Notice */}
        {isDemo && (
          <div className="bg-indigo-950 border border-indigo-700 rounded-md px-5 py-3 flex items-center gap-3">
            <FlaskConical size={16} className="text-indigo-300 flex-shrink-0" />
            <div>
              <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider">
                {t("Mode Démonstration — Score pédagogique", "Demo Mode — Pedagogical Score")}
              </p>
              <p className="text-indigo-300 text-xs mt-0.5">
                {t(
                  "Ce score est calculé pour illustrer le système d'évaluation. Il n'est pas comptabilisé dans vos statistiques officielles.",
                  "This score is calculated to illustrate the evaluation system. It is not counted in your official statistics."
                )}
              </p>
            </div>
          </div>
        )}

        {/* Header Score */}
        <div className={`rounded-md p-6 text-center ${
          isDemo ? "bg-indigo-900" : isPerfect ? "bg-green-700" : safeCompliance.compliant ? "bg-primary" : "bg-slate-800"
        }`}>
          <div className="flex justify-center mb-3">
            {isPerfect && !isDemo
              ? <Trophy size={36} className="text-yellow-300" />
              : <CheckCircle size={36} className="text-white" />}
          </div>
          {isDemo && (
            <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
              <FlaskConical size={10} /> {t("Score pédagogique (non officiel)", "Pedagogical score (unofficial)")}
            </p>
          )}
          {!isDemo && (
            <p className="text-white/70 text-xs uppercase tracking-wider mb-1">
              {enterpriseEnabled
                ? t("Résultat de mission", "Mission outcome")
                : t("Score final", "Final Score")}
            </p>
          )}
          <p className="text-white font-bold text-5xl mb-1">{safeScore}<span className="text-2xl">/100</span></p>
          <p className="text-white/80 text-sm">
            {isDemo
              ? `${t("Score pédagogique", "Pedagogical score")} — ${safeDetail?.scoreLabel ?? ""} — ${safeCompliance.compliant ? t("Conforme", "Compliant") : t("Non conforme", "Non-compliant")}`
              : enterpriseEnabled
              ? `${t("Résultat opérationnel", "Operational result")} ${safeScore}/100 — ${safeCompliance.compliant ? t("Conformité validée", "Compliance validated") : t("Conformité à revoir", "Compliance review needed")}`
              : isPerfect ? `🏆 ${t("Simulation parfaite — Félicitations !", "Perfect simulation — Congratulations!")}`
              : safeCompliance.compliant ? `✅ ${t("Module complété avec succès", "Module completed successfully")}`
              : `⚠ ${t("Module complété — Non conforme", "Module completed — Non-compliant")}`}
          </p>


          {/* Certification CTAs removed — RC17-E: credentials live only in /student/certifications */}

        </div>

        {lifecycleClosureEnabled && (
          <MissionLifecyclePhaseStrip activePhase="closure" language={language} compact />
        )}

        {enterpriseDebrief && (
          <EnterpriseDebriefPanel debrief={enterpriseDebrief} language={language} t={t} />
        )}

        {run.status === "completed" && (
          <PostRunDebriefChecklist t={t} language={language} />
        )}

        {enterpriseEnabled && isAiMentorUiEnabled() && run.status === "completed" && (
          <div className="flex justify-end">
            <MentorHelpDrawer
              runId={parsedRunId}
              isDemo={isDemo}
              runStatus={run.status}
              moduleId={resolvedModuleId}
              scnCode={scnCode}
              entryPoint="debrief"
            />
          </div>
        )}

        {/* Scores détaillés par étape */}
        {safeDetail && (
          <div className="bg-card border border-border rounded-md p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={14} className="text-primary" />
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
                {t("Scores détaillés par étape", "Detailed scores by step")}
              </p>
            </div>
            <div className="space-y-3">
              {safeDetail.stepBreakdown.filter(s => s.maxPoints > 0).map(step => (
                <div key={step.step}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {step.completed
                        ? <CheckCircle size={12} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                        : <AlertTriangle size={12} className="text-amber-500 flex-shrink-0" />}
                      <span className="text-xs font-medium text-foreground">{step.label}</span>
                    </div>
                    <span className={`text-xs font-bold ${step.completed ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                      {step.pointsEarned} / {step.maxPoints} pts
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${step.pct}%`,
                        backgroundColor: step.completed ? "hsl(var(--primary))" : "hsl(var(--muted))"
                      }}
                    />
                  </div>
                </div>
              ))}
              {safeDetail.bonuses.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy size={12} className="text-yellow-500 flex-shrink-0" />
                    <span className="text-xs font-medium text-foreground">{t("Bonus simulation parfaite", "Perfect simulation bonus")}</span>
                  </div>
                  <span className="text-xs font-bold text-yellow-600">+{safeDetail.bonuses.reduce((s, e) => s + e.pointsDelta, 0)} pts</span>
                </div>
              )}
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-foreground">{t("Total", "Total")}</span>
                  <span className={`text-sm font-bold ${isDemo ? "text-purple-500" : "text-primary"}`}>{safeScore} / 100</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${safeScore}%`,
                      backgroundColor: isDemo ? "#7c3aed" : safeScore >= passThreshold ? "#16a34a" : "#dc2626"
                    }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 text-right">
                  {t(`Seuil de réussite : ${passThreshold} pts`, `Pass threshold: ${passThreshold} pts`)} — {safeScore >= passThreshold ? `✅ ${t("Atteint", "Reached")}` : `❌ ${t("Non atteint", "Not reached")}`}
                  {isDemo && ` (${t("non officiel", "unofficial")})`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Résumé pédagogique — dynamic for all modules */}
        <div className="bg-card border border-border rounded-md p-5">
          <p className="text-xs font-semibold text-foreground mb-4 uppercase tracking-wider">
            {t("Résumé Pédagogique", "Pedagogical Summary")}
          </p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">{t("Étapes validées", "Steps validated")}</p>
              <p className="text-lg font-bold text-foreground">
                {safeDetail ? `${safeDetail.stepsCompleted}/${safeDetail.totalSteps}` : `${completedSteps.length}`}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">{t("Progression", "Progression")}</p>
              <p className="text-lg font-bold text-primary">{progressPct}%</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">{t("Conformité système", "System compliance")}</p>
              <p className={`text-sm font-bold ${safeCompliance.compliant ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
                {safeCompliance.compliant ? `✅ ${t("Conforme", "Compliant")}` : `🔴 ${t("Non conforme", "Non-compliant")}`}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">{t("Erreurs commises", "Errors made")}</p>
              {detailUnavailable ? (
                <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  {t("Détails indisponibles / erreurs non chargées", "Details unavailable / errors not loaded")}
                </p>
              ) : (
                <p className={`text-sm font-bold ${safeDetail!.totalErrors === 0 ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
                  {safeDetail!.totalErrors}
                </p>
              )}
            </div>
          </div>
          {/* Dynamic step list from detailedReport — works for M1-M5 */}
          {safeDetail && (
            <div className="space-y-1.5">
              {safeDetail.stepBreakdown.map(stepDetail => {
                const done = stepDetail.completed;
                return (
                  <div key={stepDetail.step} className={`flex items-center gap-3 p-2.5 rounded ${done ? "bg-green-50 dark:bg-green-950/30" : "bg-secondary/50"}`}>
                    {done
                      ? <CheckCircle size={13} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                      : <AlertTriangle size={13} className="text-amber-500 flex-shrink-0" />}
                    <span className={`text-xs flex-1 ${done ? "text-green-700 dark:text-green-300 font-medium" : "text-muted-foreground"}`}>
                      {stepDetail.label}
                    </span>
                    {stepDetail.maxPoints > 0 && (
                      <span className={`text-[10px] font-semibold ${done ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                        {stepDetail.pointsEarned}/{stepDetail.maxPoints} pts
                      </span>
                    )}
                    <span className={`text-[10px] font-semibold ${done ? "text-green-600 dark:text-green-400" : "text-amber-500"}`}>
                      {done ? t("VALIDÉ", "DONE") : t("NON COMPLÉTÉ", "INCOMPLETE")}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* M4 KPI snapshot + interpretations */}
          {showM4ReportSnapshot && m4KpiSnapshot && scnCode && (
            <div className="mt-4 pt-4 border-t border-border">
              <M4KpiSnapshotHeader
                snapshot={m4KpiSnapshot}
                scnCode={scnCode}
                language={language}
                t={t}
                variant="report"
              />
            </div>
          )}

          {safeDetail?.kpiInterpretations && safeDetail.kpiInterpretations.length > 0 && !showLearningFeedback && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-[10px] font-semibold text-foreground uppercase tracking-wider mb-2">
                {t("Interprétations KPI (Module 4)", "KPI Interpretations (Module 4)")}
              </p>
              <div className="space-y-2">
                {safeDetail.kpiInterpretations.map((ki) => (
                  <div key={ki.kpiKey} className={`p-2.5 rounded border text-xs ${ki.isCorrect ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800" : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"}`}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono font-bold text-[10px] uppercase">{ki.kpiKey}</span>
                      <span className={`text-[10px] font-semibold ${ki.isCorrect ? "text-green-600" : "text-amber-600"}`}>
                        {ki.isCorrect ? t("Correct", "Correct") : t("À revoir", "Needs review")}
                      </span>
                    </div>
                    <p className="text-muted-foreground whitespace-pre-wrap">{ki.studentAnswer}</p>
                    {ki.feedback && (
                      <p className="text-[10px] text-muted-foreground mt-1 italic">{ki.feedback}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* M5 report section (variance trail, ADJ, KPI snapshot) */}
          {safeDetail?.m5Report && (
            <div className="mt-4 pt-4 border-t border-border space-y-3">
              <p className="text-[10px] font-semibold text-foreground uppercase tracking-wider">
                {t("Rapport M5 — Cycle intégré", "M5 Report — Integrated cycle")}
              </p>
              {safeDetail.m5Report.kpiSnapshot && (
                <div className="p-2.5 rounded border bg-blue-50 dark:bg-blue-950/20 border-blue-200 text-xs font-mono">
                  {t("Snapshot KPI", "KPI snapshot")}: rotation {safeDetail.m5Report.kpiSnapshot.rotationRate}× · service {(safeDetail.m5Report.kpiSnapshot.serviceLevel <= 1 ? safeDetail.m5Report.kpiSnapshot.serviceLevel * 100 : safeDetail.m5Report.kpiSnapshot.serviceLevel).toFixed(1)}% · erreurs {(safeDetail.m5Report.kpiSnapshot.errorRate <= 1 ? safeDetail.m5Report.kpiSnapshot.errorRate * 100 : safeDetail.m5Report.kpiSnapshot.errorRate).toFixed(1)}% · délai {safeDetail.m5Report.kpiSnapshot.averageLeadTime} j
                </div>
              )}
              {safeDetail.m5Report.varianceTrail.length > 0 && (
                <div className="text-xs space-y-1">
                  <p className="font-semibold text-[10px] uppercase">{t("Piste variance", "Variance trail")}</p>
                  {safeDetail.m5Report.varianceTrail.map((v, i) => (
                    <p key={i} className="font-mono text-muted-foreground">{v.sku}: système {v.systemQty} · compté {v.countedQty} · Δ {v.varianceQty}</p>
                  ))}
                </div>
              )}
              {safeDetail.m5Report.adjustments.length > 0 && (
                <div className="text-xs space-y-1">
                  <p className="font-semibold text-[10px] uppercase">{t("Ajustements MI07", "MI07 adjustments")}</p>
                  {safeDetail.m5Report.adjustments.map((a, i) => (
                    <p key={i} className="text-muted-foreground">{a.sku}: {a.adjustmentQty} u. — {a.reason}</p>
                  ))}
                </div>
              )}
              {safeDetail.zoneFlow && safeDetail.zoneFlow.length > 0 && (
                <M5ZoneFlowBarReport rows={safeDetail.zoneFlow} />
              )}
              {safeDetail.transactionTimeline && safeDetail.transactionTimeline.length > 0 && (
                <M5TransactionTimelineReport rows={safeDetail.transactionTimeline} />
              )}
            </div>
          )}

          {showLearningFeedback && safeDetail.learningFeedback && (
            <LearningFeedbackLayer
              payload={safeDetail.learningFeedback}
              language={language}
              t={t}
            />
          )}

          {processCards.length > 0 && (
            <ErpExplorerCard
              cards={processCards}
              activeProcessId={processContext?.activeProcessId}
              language={language}
              t={t}
            />
          )}
        </div>

        {/* Erreurs commises */}
        {safeDetail && safeDetail.errors.length > 0 && (
          <div className="bg-card border border-destructive/30 rounded-md p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={14} className="text-destructive" />
              <p className="text-xs font-semibold text-destructive uppercase tracking-wider">
                {t(`Erreurs commises (${safeDetail.errors.length}) — Analyse pédagogique`, `Errors made (${safeDetail.errors.length}) — Pedagogical analysis`)}
              </p>
            </div>
            <div className="space-y-4">
              {safeDetail.errors.map((err, i) => (
                <div key={i} className="border border-destructive/20 rounded-md p-4 bg-destructive/5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-xs font-bold text-destructive">{err.explanation.title}</p>
                    <span className="text-xs font-bold text-destructive flex-shrink-0">{err.pointsDelta} pts</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{err.explanation.detail}</p>
                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded px-3 py-2">
                    <p className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 uppercase mb-0.5">
                      {t("À retenir", "Key takeaway")}
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-300">{err.explanation.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conformité */}
        {safeCompliance.issuesFr.length > 0 && (
          <div className="bg-card border border-destructive/30 rounded-md p-5">
            <p className="text-xs font-semibold text-destructive mb-3 flex items-center gap-2">
              <AlertTriangle size={13} /> {t("Anomalies de conformité", "Compliance anomalies")}
            </p>
            <div className="space-y-1.5">
              {safeCompliance.issuesFr.map((issue, i) => (
                <p key={i} className="text-xs text-destructive flex items-start gap-2">
                  <span className="flex-shrink-0">•</span>{issue}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Recommandations */}
        {safeDetail && safeDetail.recommendations.length > 0 && (
          <div className="bg-card border border-border rounded-md p-5">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb size={14} className="text-amber-500" />
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
                {t("Recommandations personnalisées", "Personalized recommendations")}
              </p>
            </div>
            <div className="space-y-2">
              {safeDetail.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-amber-500 flex-shrink-0 mt-0.5">→</span>
                  <p className="text-xs text-foreground leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Compétences — dynamic per module */}
        <div className="bg-card border border-border rounded-md p-5">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={14} className="text-primary" />
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
              {t("Compétences développées", "Skills developed")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {((): string[] => {
              const mod = scenario?.moduleId ?? 1;
              if (mod === 1) return [
                t("PO/GR (Approvisionnement)", "PO/GR (Procurement)"),
                t("SO/GI (Expédition)", "SO/GI (Shipping)"),
                t("WMS — Gestion des bins", "WMS — Bin management"),
                t("ERP — Flux intégré", "ERP — Integrated flow"),
                t("Cycle Count & ADJ", "Cycle Count & ADJ"),
                t("Conformité système", "System compliance"),
              ];
              if (mod === 2) return [
                t("Gestion FIFO/LIFO", "FIFO/LIFO management"),
                t("Précision d’inventaire", "Inventory accuracy"),
                t("Gestion de lots (batch)", "Batch/lot management"),
                t("Traçabilité (ASN)", "Traceability (ASN)"),
                t("Conformité avancée", "Advanced compliance"),
              ];
              if (mod === 3) {
                const m3State = scenario?.initialStateJson as {
                  replenishmentParams?: unknown[];
                  cycleCountTargets?: unknown[];
                } | null | undefined;
                const replenishOnly =
                  Array.isArray(m3State?.replenishmentParams) &&
                  m3State!.replenishmentParams!.length > 0 &&
                  (!Array.isArray(m3State?.cycleCountTargets) || m3State!.cycleCountTargets!.length === 0);
                if (replenishOnly) {
                  return [
                    t("Identification des SKU sous Min", "Identification of SKUs below Min"),
                    t("Analyse Min/Max", "Min/Max analysis"),
                    t("Interprétation du stock de sécurité", "Safety-stock interpretation"),
                    t("Calcul de quantité de réapprovisionnement", "Replenishment quantity calculation"),
                    t("Recommandations multi-SKU", "Multi-SKU recommendation generation"),
                    t("Validation du plan de réapprovisionnement", "Replenishment-plan validation"),
                  ];
                }
                return [
                  t("Comptage cyclique (CC)", "Cycle Count (CC)"),
                  t("Réconciliation des écarts", "Variance reconciliation"),
                  t("ROP — Point de réapprovisionnement", "ROP — Reorder point"),
                  t("Gestion du stock de sécurité", "Safety stock management"),
                  t("MRP — Planification des besoins", "MRP — Material requirements"),
                ];
              }
              if (mod === 4) return [
                t("Taux de rotation des stocks", "Inventory turnover rate"),
                t("Taux de service (Fill Rate)", "Service level (Fill Rate)"),
                t("DSI — Jours de stock", "DSI — Days of stock"),
                t("LPH — Lignes par heure", "LPH — Lines per hour"),
                t("Diagnostic de performance", "Performance diagnosis"),
                t("Analyse Lean & RCA", "Lean & RCA analysis"),
              ];
              if (mod === 5) return [
                t("Simulation intégrée M1–M4", "Integrated simulation M1–M4"),
                t("Décision stratégique", "Strategic decision-making"),
                t("Gestion de crise logistique", "Logistics crisis management"),
                t("Analyse multicritère", "Multi-criteria analysis"),
                t("Présentation de résultats", "Results presentation"),
              ];
              return [];
            })().map(c => (
              <span key={c} className="text-[10px] bg-primary/10 text-primary font-medium px-2.5 py-1 rounded-full">{c}</span>
            ))}
          </div>
        </div>

        {/* Score Evolution Chart — only shown when student has > 1 attempt */}
        {!isDemo && scenario && (
          <ScoreEvolutionChart
            scenarioId={scenario.id}
            currentRunId={parsedRunId}
            passThreshold={passThreshold}
          />
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pb-4">
          <button onClick={() => navigate("/student/scenarios")}
            className="flex items-center gap-2 text-xs text-primary hover:underline">
            <ArrowLeft size={13} /> {t("Retour aux scénarios", "Back to scenarios")}
          </button>
          {scenario && (
            <button
              onClick={() => navigate("/student/scenarios")}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-md hover:bg-primary/90 transition-colors"
            >
              <RotateCcw size={13} /> {t("Recommencer ce scénario", "Restart this scenario")}
            </button>
          )}
        </div>
      </div>
    </FioriShell>
  );
}
