import React, { useState } from "react";
import {
  BookOpen, Radio, GraduationCap, Compass, Award, Route,
  ChevronDown, ChevronUp, AlertTriangle, CheckCircle, FlaskConical, ShieldCheck,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import type { MissionData } from "../../../../server/missionData";
import { resolveScnCode } from "../../../../server/missionData";
import { COMPETENCY_MAP } from "@/data/competencyMap";
import { getStepErpHint } from "@/data/stepErpMap";
import { M4_KPI_CONTROL_TOWER } from "@/data/m4KpiControlTower";
import { getEvalScoreThreshold, getModuleCertContext } from "@/data/moduleThresholds";
import OperationalFlowDisplay from "@/components/OperationalFlowDisplay";
import UnpostedTransactionsPanel from "@/components/UnpostedTransactionsPanel";

type TxRow = {
  docType: string;
  sku: string;
  bin: string;
  qty: number;
  posted?: boolean;
  docRef?: string | null;
};

export interface IntelligenceRunState {
  runId: number;
  run: { id: number; status: string; isDemo?: boolean };
  scenario: { id: number; name?: string | null; moduleId?: number; descriptionFr?: string | null; descriptionEn?: string | null; difficulty?: string | null };
  mission: MissionData | null;
  completedSteps: string[];
  nextStep: { code?: string; labelFr?: string; labelEn?: string } | null;
  progressPct: number;
  score: number;
  inventory: Record<string, number>;
  compliance: { compliant: boolean; issues?: string[]; issuesFr?: string[] };
  unpostedTransactions: TxRow[];
  allTransactions: TxRow[];
  isDemo: boolean;
  moduleId: number;
  stepLabels: { key: string; labelFr: string; labelEn: string }[];
  effectiveStepCount: number;
  onExecuteStep: (stepCode: string) => void;
  /** Dev preview only — skips authenticated tRPC queries in Panel E */
  previewMode?: boolean;
}

function PanelShell({
  id, title, icon: Icon, children, defaultOpen = true,
}: {
  id: string;
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-card border border-border rounded-none shadow-sm overflow-hidden" data-panel={id}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-b border-border hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon size={14} className="text-primary" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">{title}</span>
        </div>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && <div className="p-4">{children}</div>}
    </div>
  );
}

function PanelA({ mission, scenario, t, language }: { mission: MissionData | null; scenario: IntelligenceRunState["scenario"]; t: (fr: string, en: string) => string; language: string }) {
  if (!mission) {
    return (
      <p className="text-xs text-muted-foreground italic">
        {t("Briefing indisponible — consultez la description du scénario.", "Briefing unavailable — see scenario description.")}
        {scenario.descriptionFr && (
          <span className="block mt-2 not-italic text-slate-600 dark:text-slate-400">
            {language === "FR" ? scenario.descriptionFr : (scenario.descriptionEn ?? scenario.descriptionFr)}
          </span>
        )}
      </p>
    );
  }
  const scn = mission.scnCode ?? resolveScnCode(scenario);
  return (
    <div className="space-y-3 text-xs">
      {scn && (
        <p className="font-mono text-[10px] text-primary font-bold">{scn}</p>
      )}
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{t("Objectif", "Objective")}</p>
        <p className="text-sm font-semibold text-foreground">{mission.objective}</p>
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{t("Contexte métier", "Business context")}</p>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic border-l-2 border-slate-300 pl-3">{mission.context}</p>
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{t("Mission étudiant", "Student mission")}</p>
        <ol className="list-decimal list-inside space-y-1 text-slate-700 dark:text-slate-300">
          {mission.studentActions.map((a, i) => <li key={i}>{a}</li>)}
        </ol>
      </div>
      {mission.successCriteria && mission.successCriteria.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-green-700 uppercase mb-1">{t("Critères de réussite", "Success criteria")}</p>
          <ul className="space-y-1">
            {mission.successCriteria.map((c, i) => (
              <li key={i} className="flex items-start gap-1.5 text-green-800 dark:text-green-300">
                <CheckCircle size={11} className="mt-0.5 shrink-0" />{c}
              </li>
            ))}
          </ul>
        </div>
      )}
      {mission.failureConditions && mission.failureConditions.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-red-700 uppercase mb-1">{t("Conditions d'échec", "Failure conditions")}</p>
          <ul className="space-y-1">
            {mission.failureConditions.map((c, i) => (
              <li key={i} className="flex items-start gap-1.5 text-red-800 dark:text-red-300">
                <AlertTriangle size={11} className="mt-0.5 shrink-0" />{c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function M4KpiTowerView({
  entry, t, language,
}: {
  entry: (typeof M4_KPI_CONTROL_TOWER)[string];
  t: (fr: string, en: string) => string;
  language: string;
}) {
  const isFr = language === "FR";
  const rows = [
    { label: t("KPI évalué", "KPI evaluated"), value: isFr ? entry.kpiEvaluated.fr : entry.kpiEvaluated.en },
    { label: t("Cible / seuil", "Target / threshold"), value: isFr ? entry.target.fr : entry.target.en },
    { label: t("Focus diagnostic", "Diagnostic focus"), value: isFr ? entry.diagnosticFocus.fr : entry.diagnosticFocus.en },
    { label: t("Alerte / risque", "Alert / risk"), value: isFr ? entry.alertRisk.fr : entry.alertRisk.en, alert: true },
    { label: t("Sortie attendue", "Expected output"), value: isFr ? entry.expectedOutput.fr : entry.expectedOutput.en },
  ];
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold text-primary uppercase">{t("Tour de contrôle KPI — Module 4", "KPI Control Tower — Module 4")}</p>
      {rows.map((row) => (
        <div
          key={row.label}
          className={`p-2 border ${row.alert ? "bg-amber-50 dark:bg-amber-950/20 border-amber-300" : "bg-slate-50 dark:bg-slate-800/50 border-border"}`}
        >
          <p className="text-[9px] font-bold text-slate-500 uppercase">{row.label}</p>
          <p className="text-[10px] text-foreground mt-0.5 leading-relaxed">{row.value}</p>
        </div>
      ))}
    </div>
  );
}

function PanelB({
  state, t, language,
}: {
  state: IntelligenceRunState;
  t: (fr: string, en: string) => string;
  language: string;
}) {
  const issues = state.compliance.issuesFr?.length ? state.compliance.issuesFr : (state.compliance.issues ?? []);
  const posted = state.allTransactions.filter((tx) => tx.posted);
  const pending = state.unpostedTransactions;
  const scnCode = resolveScnCode(state.scenario);
  const m4Kpi = scnCode && state.moduleId === 4 ? M4_KPI_CONTROL_TOWER[scnCode] : null;
  const showTxTable = !m4Kpi || pending.length > 0 || posted.length > 0;

  return (
    <div className="space-y-4 text-xs">
      <div className={`p-3 border-l-4 flex items-center gap-2 ${state.compliance.compliant ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"}`}>
        {state.compliance.compliant
          ? <CheckCircle size={16} className="text-green-600" />
          : <AlertTriangle size={16} className="text-red-600" />}
        <span className="font-bold uppercase text-[10px]">
          {state.compliance.compliant ? t("Conformité OK", "Compliance OK") : t("Alertes conformité", "Compliance alerts")}
        </span>
      </div>

      {m4Kpi && <M4KpiTowerView entry={m4Kpi} t={t} language={language} />}

      {pending.length > 0 && (
        <UnpostedTransactionsPanel runId={state.runId} transactions={pending} compact />
      )}

      {issues.length > 0 && (
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-red-600 uppercase">{t("Avertissements opérationnels", "Operational warnings")}</p>
          {issues.map((issue, i) => (
            <p key={i} className="text-[10px] bg-red-50 dark:bg-red-950/30 border border-red-200 p-2">{issue}</p>
          ))}
        </div>
      )}

      {showTxTable && (
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">{t("Transactions", "Transactions")} — {t("Postées", "Posted")}: {posted.length} | {t("En attente", "Pending")}: {pending.length}</p>
          {(pending.length + posted.length) > 0 ? (
            <div className="max-h-32 overflow-y-auto border border-border">
              <table className="w-full text-[10px] font-mono">
                <thead>
                  <tr className="bg-slate-50 border-b">
                    <th className="px-2 py-1 text-left">Type</th>
                    <th className="px-2 py-1 text-left">Ref</th>
                    <th className="px-2 py-1 text-right">Qty</th>
                    <th className="px-2 py-1">St</th>
                  </tr>
                </thead>
                <tbody>
                  {[...pending, ...posted].slice(0, 12).map((tx, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="px-2 py-1">{tx.docType}</td>
                      <td className="px-2 py-1">{tx.docRef ?? "—"}</td>
                      <td className="px-2 py-1 text-right">{tx.qty}</td>
                      <td className="px-2 py-1">
                        <span className={tx.posted ? "text-green-600" : "text-amber-600"}>{tx.posted ? "POST" : "PEND"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-[10px] text-muted-foreground italic">
              {m4Kpi
                ? t("Scénario analytique — pas de transactions physiques. Consultez le tour de contrôle KPI ci-dessus.", "Analytical scenario — no physical transactions. See KPI control tower above.")
                : t("Aucune transaction enregistrée.", "No transactions recorded.")}
            </p>
          )}
        </div>
      )}

      {!m4Kpi && (
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{t("Visibilité inventaire", "Inventory visibility")}</p>
          <p className="text-[10px] text-muted-foreground">
            {Object.keys(state.inventory).length} {t("emplacements actifs", "active locations")}
            {Object.values(state.inventory).some((q) => q < 0) && (
              <span className="text-red-600 font-bold ml-2">{t("— Stock négatif détecté", "— Negative stock detected")}</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

function PanelC({ mission, nextStepCode, t, language }: { mission: MissionData | null; nextStepCode?: string; t: (fr: string, en: string) => string; language: string }) {
  const hint = getStepErpHint(nextStepCode);
  const isFr = language === "FR";
  return (
    <div className="space-y-3 text-xs">
      {mission && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-2 border border-border">
              <p className="text-[9px] font-bold text-slate-500 uppercase">{t("Rôle professionnel", "Professional role")}</p>
              <p className="font-semibold text-foreground">{mission.role}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-2 border border-border">
              <p className="text-[9px] font-bold text-slate-500 uppercase">{t("Module ERP/WMS", "ERP/WMS module")}</p>
              <p className="font-semibold text-foreground">{mission.module}</p>
            </div>
          </div>
          {mission.wmsFunction && (
            <p><span className="font-bold text-slate-500">{t("Fonction WMS", "WMS function")}:</span> {mission.wmsFunction}</p>
          )}
          {mission.sapEquivalent && (
            <p><span className="font-bold text-slate-500">SAP:</span> {mission.sapEquivalent}</p>
          )}
          {mission.odooEquivalent && (
            <p><span className="font-bold text-slate-500">Odoo:</span> {mission.odooEquivalent}</p>
          )}
          {mission.industryRelevance && (
            <p className="text-slate-600 dark:text-slate-400 italic border-l-2 border-primary/30 pl-2">{mission.industryRelevance}</p>
          )}
        </>
      )}
      {nextStepCode && (
        <div className="bg-primary/5 border border-primary/20 p-3 mt-2">
          <p className="text-[10px] font-bold text-primary uppercase mb-1">{t("Étape courante", "Current step")}: {nextStepCode}</p>
          <p className="text-slate-600 dark:text-slate-400">{isFr ? hint.whyShort.fr : hint.whyShort.en}</p>
          <p className="mt-1 text-[10px]"><span className="font-bold">tCode:</span> {hint.sapTCode} · {isFr ? hint.erpModule.fr : hint.erpModule.en}</p>
        </div>
      )}
    </div>
  );
}

function PanelD({ mission, nextStepCode, compliance, isDemo, onExecute, t, language }: {
  mission: MissionData | null;
  nextStepCode?: string;
  compliance: IntelligenceRunState["compliance"];
  isDemo: boolean;
  onExecute: (code: string) => void;
  t: (fr: string, en: string) => string;
  language: string;
}) {
  const hint = getStepErpHint(nextStepCode);
  const isFr = language === "FR";
  return (
    <div className="space-y-3 text-xs">
      {nextStepCode ? (
        <div className="bg-primary/10 border border-primary p-3">
          <p className="text-[10px] font-bold text-primary uppercase mb-1">{t("Action recommandée", "Recommended action")}</p>
          <p className="font-semibold text-foreground mb-2">
            {t("Exécuter l'étape", "Execute step")} <span className="font-mono text-primary">{nextStepCode}</span>
          </p>
          <button
            type="button"
            onClick={() => onExecute(nextStepCode)}
            className="text-[10px] font-bold bg-primary text-primary-foreground px-3 py-1.5 hover:bg-primary/90"
          >
            {t("Aller à l'étape →", "Go to step →")}
          </button>
        </div>
      ) : (
        <p className="text-amber-800 bg-amber-50 border border-amber-200 p-2 font-semibold">
          {!compliance.compliant
            ? t("Résolvez les non-conformités avant de continuer.", "Resolve non-compliance before continuing.")
            : t("Aucune étape suivante — mission terminée ou bloquée.", "No next step — mission complete or blocked.")}
        </p>
      )}

      {mission?.alternativeActions && mission.alternativeActions.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{t("Actions alternatives (à éviter si incorrectes)", "Alternative actions (avoid if incorrect)")}</p>
          <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-0.5">
            {mission.alternativeActions.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </div>
      )}

      {mission?.wrongActionConsequences && mission.wrongActionConsequences.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-red-600 uppercase mb-1">{t("Conséquences d'actions incorrectes", "Consequences of wrong actions")}</p>
          <ul className="space-y-1">
            {mission.wrongActionConsequences.map((c, i) => (
              <li key={i} className="text-[10px] text-red-800 dark:text-red-300 flex gap-1"><AlertTriangle size={10} className="shrink-0 mt-0.5" />{c}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-[10px] text-slate-500 border-t pt-2">
        <ShieldCheck size={10} className="inline mr-1" />
        {t("Impact conformité", "Compliance impact")}: {compliance.compliant ? t("Aucun bloqueur", "No blockers") : t("Bloqueurs actifs — voir Tour de contrôle", "Active blockers — see Control Tower")}
      </p>

      <p className="text-[10px] italic text-slate-500">{isFr ? hint.whyShort.fr : hint.whyShort.en}</p>

      {isDemo && mission?.demoGuidance && (
        <p className="text-[10px] bg-indigo-50 border border-indigo-200 p-2 text-indigo-800">
          <FlaskConical size={10} className="inline mr-1" />{mission.demoGuidance}
        </p>
      )}
      {!isDemo && mission?.evalGuidance && (
        <p className="text-[10px] bg-amber-50 border border-amber-200 p-2 text-amber-900">{mission.evalGuidance}</p>
      )}
    </div>
  );
}

function PanelE({
  scnCode, moduleId, completedSteps, progressPct, score, isDemo, previewMode, t, language,
}: {
  scnCode: string | null;
  moduleId: number;
  completedSteps: string[];
  progressPct: number;
  score: number;
  isDemo: boolean;
  previewMode?: boolean;
  t: (fr: string, en: string) => string;
  language: string;
}) {
  const isFr = language === "FR";
  const competency = scnCode ? COMPETENCY_MAP[scnCode] : null;
  const { data: profile } = trpc.profiles.mine.useQuery(undefined, { enabled: !previewMode });
  const { data: quizBest } = trpc.quiz.getBestAttempt.useQuery({ moduleId: 1 }, { enabled: !previewMode && moduleId === 1 });
  const { data: moduleProgress } = trpc.modules.progress.useQuery(undefined, { enabled: !previewMode });

  const modProgress = moduleProgress?.find((m) => m.moduleId === moduleId);
  const scoreThreshold = getEvalScoreThreshold(moduleId);
  const moduleCert = getModuleCertContext(moduleId);

  return (
    <div className="space-y-3 text-xs">
      {competency && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-2 border">
              <p className="text-[9px] font-bold text-slate-500 uppercase">{t("Compétence évaluée", "Competency assessed")}</p>
              <p className="font-semibold">{isFr ? competency.primaryCompetency.fr : competency.primaryCompetency.en}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-2 border">
              <p className="text-[9px] font-bold text-slate-500 uppercase">{t("Niveau Bloom", "Bloom level")}</p>
              <p className="font-semibold">{isFr ? competency.bloomLevel.fr : competency.bloomLevel.en}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-2 border">
              <p className="text-[9px] font-bold text-slate-500 uppercase">{t("Rôle entrepôt", "Warehouse role")}</p>
              <p className="font-semibold">{isFr ? competency.warehouseRole.fr : competency.warehouseRole.en}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-2 border">
              <p className="text-[9px] font-bold text-slate-500 uppercase">{t("Progression", "Progression")}</p>
              <p className="font-semibold">{isFr ? competency.progression.fr : competency.progression.en}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-2 border">
              <p className="text-[9px] font-bold text-slate-500 uppercase">{t("Maturité ERP", "ERP maturity")}</p>
              <p className="font-semibold">{competency.erpMaturity}/5</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-2 border">
              <p className="text-[9px] font-bold text-slate-500 uppercase">{t("Maturité WMS", "WMS maturity")}</p>
              <p className="font-semibold">{competency.wmsMaturity}/5</p>
            </div>
          </div>
        </>
      )}

      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{t("Preuves collectées (session)", "Evidence collected (session)")}</p>
        <p className="text-[10px] text-slate-600 dark:text-slate-400">
          {t("Étapes validées", "Steps validated")}: <span className="font-mono font-bold">{completedSteps.join(", ") || "—"}</span>
        </p>
        <p className="text-[10px] mt-1">
          {t("Progression", "Progress")}: <span className="font-bold text-primary">{progressPct}%</span>
          {!isDemo && <> · {t("Score", "Score")}: <span className="font-bold">{score}/100</span></>}
          {isDemo && <> · <span className="italic text-indigo-600">{t("Démo — non officiel", "Demo — non-official")}</span></>}
        </p>
      </div>

      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{t("Certification / module", "Certification / module")}</p>
        {moduleId === 1 && (
          <ul className="text-[10px] space-y-1 text-slate-600 dark:text-slate-400">
            <li>{t("Quiz M1", "M1 Quiz")}: {quizBest?.passed ? t("Réussi ✓", "Passed ✓") : t("En attente", "Pending")}</li>
            <li>{t("Silver TEC.LOG", "TEC.LOG Silver")}: {profile?.silverCertified ? t("Débloqué ✓", "Unlocked ✓") : t("En cours", "In progress")}</li>
          </ul>
        )}
        {modProgress?.passed && (
          <p className="text-[10px] text-green-700 font-semibold mt-1">{t("Module validé — meilleur score", "Module passed — best score")}: {modProgress.bestScore ?? "—"}</p>
        )}
        {moduleCert && (
          <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1">{isFr ? moduleCert.fr : moduleCert.en}</p>
        )}
        {competency?.certificationNote && (
          <p className="text-[10px] italic text-primary mt-1">{isFr ? competency.certificationNote.fr : competency.certificationNote.en}</p>
        )}
        <p className="text-[10px] font-mono text-slate-500 mt-1">
          {t("Seuil évaluation scénario", "Scenario evaluation threshold")}: <span className="font-bold text-primary">{scoreThreshold}/100</span>
        </p>
      </div>

      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{t("Exigences restantes", "Remaining requirements")}</p>
        <ul className="text-[10px] list-disc list-inside text-slate-600 dark:text-slate-400">
          {progressPct < 100 && <li>{t("Compléter toutes les étapes du scénario", "Complete all scenario steps")}</li>}
          {!isDemo && score < scoreThreshold && (
            <li>{t(`Atteindre le seuil de ${scoreThreshold}/100 (évaluation)`, `Reach ${scoreThreshold}/100 threshold (evaluation)`)}</li>
          )}
          {moduleId === 1 && !quizBest?.passed && <li>{t("Réussir le quiz M1", "Pass M1 quiz")}</li>}
          {progressPct >= 100 && (isDemo || score >= scoreThreshold) && (
            <li className="text-green-700">{t("Scénario prêt pour clôture / rapport", "Scenario ready for close / report")}</li>
          )}
        </ul>
      </div>
    </div>
  );
}

function PanelF({
  mission, stepLabels, completedSteps, nextStepCode, isDemo, getStepStatus, t, language,
}: {
  mission: MissionData | null;
  stepLabels: { key: string; labelFr: string; labelEn: string }[];
  completedSteps: string[];
  nextStepCode?: string;
  isDemo: boolean;
  getStepStatus: (key: string) => string;
  t: (fr: string, en: string) => string;
  language: string;
}) {
  const flowSteps = stepLabels.map((s) => language === "FR" ? s.labelFr : s.labelEn);
  const currentLabel = stepLabels.find((s) => s.key === nextStepCode);
  const currentDisplay = currentLabel ? (language === "FR" ? currentLabel.labelFr : currentLabel.labelEn) : undefined;

  return (
    <div className="space-y-3 text-xs">
      <OperationalFlowDisplay steps={flowSteps} currentStep={currentDisplay} />

      <div className="flex flex-wrap gap-1.5 mt-2">
        {stepLabels.map((s) => {
          const status = getStepStatus(s.key);
          const cls =
            status === "completed" ? "bg-green-100 text-green-800 border-green-300" :
            status === "active" ? "bg-primary text-primary-foreground border-primary" :
            status === "demo-available" ? "bg-indigo-100 text-indigo-800 border-indigo-300" :
            "bg-slate-100 text-slate-500 border-slate-200";
          return (
            <span key={s.key} className={`text-[9px] font-mono font-bold px-2 py-0.5 border ${cls}`}>
              {s.key}{completedSteps.includes(s.key) ? " ✓" : ""}
            </span>
          );
        })}
      </div>

      {mission?.recoveryPaths && mission.recoveryPaths.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{t("Chemins de résolution / récupération", "Resolution / recovery paths")}</p>
          <ul className="list-disc list-inside text-slate-600 dark:text-slate-400">
            {mission.recoveryPaths.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
      )}

      {mission?.controlPoints && (
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{t("Points de contrôle", "Checkpoints")}</p>
          <ul className="list-decimal list-inside text-slate-600 dark:text-slate-400">
            {mission.controlPoints.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-border">
        {isDemo && mission?.demoGuidance && (
          <p className="text-[10px] bg-indigo-50 border border-indigo-200 p-2">
            <FlaskConical size={10} className="inline mr-1" />
            <span className="font-bold">{t("Mode Démo", "Demo Mode")}:</span> {mission.demoGuidance}
          </p>
        )}
        {!isDemo && mission?.evalGuidance && (
          <p className="text-[10px] bg-amber-50 border border-amber-200 p-2">
            <span className="font-bold">{t("Mode Évaluation", "Evaluation Mode")}:</span> {mission.evalGuidance}
          </p>
        )}
      </div>
    </div>
  );
}

export default function OperationalIntelligenceLayer(props: IntelligenceRunState) {
  const { t, language } = useLanguage();
  const scnCode = resolveScnCode(props.scenario);
  const nextStepCode = props.nextStep?.code;

  return (
    <div className="space-y-4" data-testid="operational-intelligence-layer">
      <div className="flex items-center gap-2 px-1">
        <Radio size={16} className="text-primary" />
        <h2 className="text-sm font-black uppercase tracking-wider text-foreground">
          {t("Couche d'Intelligence Opérationnelle", "Operational Intelligence Layer")}
        </h2>
        {scnCode && <span className="text-[10px] font-mono text-primary font-bold">{scnCode}</span>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PanelShell id="A" title={t("A — Briefing opérationnel", "A — Operational Briefing")} icon={BookOpen} defaultOpen>
          <PanelA mission={props.mission} scenario={props.scenario} t={t} language={language} />
        </PanelShell>

        <PanelShell id="B" title={t("B — Tour de contrôle entrepôt", "B — Warehouse Control Tower")} icon={Radio} defaultOpen>
          <PanelB state={props} t={t} language={language} />
        </PanelShell>

        <PanelShell id="C" title={t("C — Apprentissage ERP/WMS", "C — ERP/WMS Learning")} icon={GraduationCap} defaultOpen={!!nextStepCode}>
          <PanelC mission={props.mission} nextStepCode={nextStepCode} t={t} language={language} />
        </PanelShell>

        <PanelShell id="D" title={t("D — Aide à la décision", "D — Decision Support")} icon={Compass} defaultOpen>
          <PanelD
            mission={props.mission}
            nextStepCode={nextStepCode}
            compliance={props.compliance}
            isDemo={props.isDemo}
            onExecute={props.onExecuteStep}
            t={t}
            language={language}
          />
        </PanelShell>

        <PanelShell id="E" title={t("E — Évaluation compétences", "E — Competency Evaluation")} icon={Award} defaultOpen={!!(scnCode && COMPETENCY_MAP[scnCode])}>
          <PanelE
            scnCode={scnCode}
            moduleId={props.moduleId}
            completedSteps={props.completedSteps}
            progressPct={props.progressPct}
            score={props.score}
            isDemo={props.isDemo}
            previewMode={props.previewMode}
            t={t}
            language={language}
          />
        </PanelShell>

        <PanelShell id="F" title={t("F — Parcours de résolution", "F — Scenario Resolution Path")} icon={Route} defaultOpen>
          <PanelF
            mission={props.mission}
            stepLabels={props.stepLabels}
            completedSteps={props.completedSteps}
            nextStepCode={nextStepCode}
            isDemo={props.isDemo}
            getStepStatus={(key) => {
              if (props.completedSteps.includes(key)) return "completed";
              if (key === nextStepCode) return "active";
              if (props.isDemo) return "demo-available";
              return "locked";
            }}
            t={t}
            language={language}
          />
        </PanelShell>
      </div>
    </div>
  );
}
