import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import FioriShell from "@/components/FioriShell";
import { useLocation } from "wouter";
import { TrendingDown, AlertTriangle, CheckCircle, BarChart2, ArrowRight, Lock, Presentation } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// ─── KPI Thresholds & Helpers ─────────────────────────────────────────────────
function kpiColor(status: string) {
  if (status === "excellent" || status === "normal") return { bg: "#e8f5e9", text: "#2e7d32", border: "#a5d6a7" };
  if (status === "acceptable") return { bg: "#fff8e1", text: "#f57f17", border: "#ffe082" };
  return { bg: "#ffebee", text: "#c62828", border: "#ef9a9a" };
}

function StatusBadge({ status, label }: { status: string; label: string }) {
  const c = kpiColor(status);
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold" style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
      {status === "excellent" || status === "normal" ? <CheckCircle size={11} /> : status === "acceptable" ? <AlertTriangle size={11} /> : <TrendingDown size={11} />}
      {label}
    </span>
  );
}

function KpiCard({ title, value, unit, status, statusLabel, description }: {
  title: string; value: string; unit: string; status: string; statusLabel: string; description: string;
}) {
  const c = kpiColor(status);
  return (
    <div className="rounded border p-4" style={{ background: c.bg, borderColor: c.border }}>
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{title}</p>
        <StatusBadge status={status} label={statusLabel} />
      </div>
      <p className="text-3xl font-bold mb-0.5" style={{ color: c.text }}>{value}<span className="text-sm font-normal ml-1">{unit}</span></p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
}

// ─── Interpretation Question ──────────────────────────────────────────────────
function InterpretationQuestion({ kpiKey, question, onSubmit, submitted, feedback, isCorrect }: {
  kpiKey: string;
  question: string;
  onSubmit: (kpiKey: string, answer: string) => void;
  submitted: boolean;
  feedback?: string;
  isCorrect?: boolean;
}) {
  const [answer, setAnswer] = useState("");
  return (
    <div className="border rounded p-4 bg-white">
      <p className="text-sm font-semibold text-[#0f2a44] mb-2">❓ {question}</p>
      {!submitted ? (
        <>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full border rounded p-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#0070f2]"
            rows={3}
            placeholder="Votre analyse et interprétation..."
          />
          <button
            onClick={() => answer.trim() && onSubmit(kpiKey, answer)}
            disabled={!answer.trim()}
            className="mt-2 px-4 py-1.5 text-xs font-semibold rounded text-white disabled:opacity-50"
            style={{ background: "#0070f2" }}
          >
            Soumettre l'interprétation
          </button>
        </>
      ) : (
        <div className="rounded p-3 text-sm" style={{ background: isCorrect ? "#e8f5e9" : "#ffebee", color: isCorrect ? "#2e7d32" : "#c62828" }}>
          {isCorrect ? "✓ " : "✗ "}{feedback}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────────────────────────────
export default function Module4Dashboard() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();

  // Check Module 4 unlock status
  const { data: moduleProgress } = trpc.modules.progress.useQuery();
  const { data: m4Scenarios } = trpc.scenarios.listByModule.useQuery({ moduleCode: "M4" });

  const m3Progress = moduleProgress?.find((p: any) => p.moduleCode === "M3");
  const isAdminOrTeacher = user?.role === "admin" || user?.role === "teacher";
  const isLocked = !isAdminOrTeacher && (!m3Progress?.passed || !m3Progress?.teacherValidated);

  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);
  const [kpiData] = useState({
    annualConsumption: 2400,
    averageStock: 400,
    ordersFulfilled: 285,
    totalOrders: 300,
    operationalErrors: 12,
    totalOperations: 300,
    avgLeadTimeDays: 3.5,
    stockValue: 48000,
  });

  // Compute KPIs client-side for display
  const rotationRate = kpiData.averageStock > 0 ? kpiData.annualConsumption / kpiData.averageStock : 0;
  const serviceLevel = kpiData.totalOrders > 0 ? kpiData.ordersFulfilled / kpiData.totalOrders : 0;
  const errorRate = kpiData.totalOperations > 0 ? kpiData.operationalErrors / kpiData.totalOperations : 0;

  const rotationStatus = rotationRate > 12 ? "sous-performance" : rotationRate < 4 ? "surstock" : "normal";
  const serviceLevelStatus = serviceLevel >= 0.95 ? "excellent" : serviceLevel >= 0.85 ? "acceptable" : "insuffisant";
  const errorRateStatus = errorRate <= 0.01 ? "excellent" : errorRate <= 0.05 ? "acceptable" : "critique";

  const [interpretations, setInterpretations] = useState<Record<string, { submitted: boolean; feedback?: string; isCorrect?: boolean }>>({});

  const submitInterpretation = trpc.kpi.submitInterpretation.useMutation({
    onSuccess: (data: any, variables: any) => {
      setInterpretations((prev) => ({
        ...prev,
        [variables.kpiKey]: { submitted: true, feedback: data.feedback, isCorrect: data.isCorrect },
      }));
    },
  });

  const handleSubmit = (kpiKey: string, answer: string) => {
    if (!selectedScenario) return;
    submitInterpretation.mutate({ runId: selectedScenario, kpiKey: kpiKey as "rotationRate" | "serviceLevel" | "errorRate" | "diagnostic", studentAnswer: answer });
    setInterpretations((prev) => ({ ...prev, [kpiKey]: { submitted: true } }));
  };

  if (isLocked) {
    return (
      <FioriShell title="Module 4 — Indicateurs de performance logistique" breadcrumbs={[{ label: "Scénarios", href: "/student/scenarios" }, { label: "Module 4" }]}>
        <div className="max-w-lg mx-auto mt-16 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#f5f5f5" }}>
            <Lock size={28} className="text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-[#0f2a44] mb-2">Module verrouillé</h2>
          <p className="text-sm text-gray-500 mb-6">Le Module 4 est verrouillé. La validation du Module 3 est requise.</p>
          <button onClick={() => navigate("/student/scenarios")} className="px-4 py-2 text-sm font-semibold rounded text-white" style={{ background: "#0070f2" }}>
            Retour aux scénarios
          </button>
        </div>
      </FioriShell>
    );
  }

  return (
    <FioriShell
      title="Module 4 — Indicateurs de performance logistique"
      breadcrumbs={[{ label: "Scénarios", href: "/student/scenarios" }, { label: "Module 4 — KPI" }]}
    >
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Module header */}
        <div className="rounded border p-5 bg-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded flex items-center justify-center" style={{ background: "#e3f2fd" }}>
              <BarChart2 size={20} style={{ color: "#0070f2" }} />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-[#0f2a44]">Module 4 — {t("Indicateurs de performance logistique", "Logistics Performance Indicators")}</h2>
                  <p className="text-xs text-gray-500">Programme 1 — TEC.LOG | Collège de la Concorde — Montréal</p>
                </div>
                <button
                  onClick={() => navigate("/student/slides/4")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold text-white shrink-0 hover:opacity-90 transition-opacity"
                  style={{ background: "#0f2a44" }}
                >
                  <Presentation size={14} />
                  {t("Slides M4", "Slides M4")}
                </button>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Ce module vous permet de calculer, interpréter et analyser les principaux indicateurs de performance logistique (KPI) :
            rotation des stocks, taux de service, taux d'erreur opérationnelle et temps de traitement.
          </p>
        </div>

        {/* Scenario selector */}
        {!selectedScenario && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#0f2a44]">Choisissez un scénario</h3>
            {m4Scenarios?.map((s: any, i: number) => (
              <button
                key={s.id}
                onClick={() => setSelectedScenario(s.id)}
                className="w-full text-left rounded border p-4 bg-white hover:border-[#0070f2] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#0f2a44]">{s.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.descriptionFr}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <span className="text-xs px-2 py-0.5 rounded" style={{
                      background: s.difficulty === "facile" ? "#e8f5e9" : s.difficulty === "moyen" ? "#fff8e1" : "#ffebee",
                      color: s.difficulty === "facile" ? "#2e7d32" : s.difficulty === "moyen" ? "#f57f17" : "#c62828",
                    }}>{s.difficulty}</span>
                    <ArrowRight size={14} className="text-gray-400" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* KPI Dashboard (shown after scenario selection) */}
        {selectedScenario && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#0f2a44]">Tableau de bord KPI</h3>
              <button onClick={() => setSelectedScenario(null)} className="text-xs text-[#0070f2] hover:underline">← Changer de scénario</button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <KpiCard
                title="Rotation des stocks"
                value={rotationRate.toFixed(2)}
                unit="x / an"
                status={rotationStatus === "normal" ? "normal" : rotationStatus === "surstock" ? "acceptable" : "critique"}
                statusLabel={rotationStatus}
                description={`Consommation: ${kpiData.annualConsumption} u. | Stock moy.: ${kpiData.averageStock} u.`}
              />
              <KpiCard
                title="Taux de service"
                value={(serviceLevel * 100).toFixed(1)}
                unit="%"
                status={serviceLevelStatus}
                statusLabel={serviceLevelStatus}
                description={`${kpiData.ordersFulfilled} / ${kpiData.totalOrders} commandes livrées`}
              />
              <KpiCard
                title="Taux d'erreur"
                value={(errorRate * 100).toFixed(2)}
                unit="%"
                status={errorRateStatus}
                statusLabel={errorRateStatus}
                description={`${kpiData.operationalErrors} erreurs / ${kpiData.totalOperations} opérations`}
              />
              <KpiCard
                title="Temps de traitement"
                value={kpiData.avgLeadTimeDays.toFixed(1)}
                unit="jours"
                status={kpiData.avgLeadTimeDays <= 2 ? "excellent" : kpiData.avgLeadTimeDays <= 5 ? "acceptable" : "critique"}
                statusLabel={kpiData.avgLeadTimeDays <= 2 ? "excellent" : kpiData.avgLeadTimeDays <= 5 ? "acceptable" : "critique"}
                description={`Stock immobilisé: ${kpiData.stockValue.toLocaleString("fr-CA", { style: "currency", currency: "CAD" })}`}
              />
            </div>

            {/* Interpretation Questions */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#0f2a44]">Questions d'interprétation</h3>
              <InterpretationQuestion
                kpiKey="rotationRate"
                question={`Le taux de rotation est de ${rotationRate.toFixed(2)}x/an. Quelle situation cela indique-t-il ? (surstock, normal, sous-performance)`}
                onSubmit={handleSubmit}
                submitted={!!interpretations["rotationRate"]?.submitted}
                feedback={interpretations["rotationRate"]?.feedback}
                isCorrect={interpretations["rotationRate"]?.isCorrect}
              />
              <InterpretationQuestion
                kpiKey="serviceLevel"
                question={`Le taux de service est de ${(serviceLevel * 100).toFixed(1)}%. Comment évaluez-vous ce niveau ? (excellent, acceptable, insuffisant)`}
                onSubmit={handleSubmit}
                submitted={!!interpretations["serviceLevel"]?.submitted}
                feedback={interpretations["serviceLevel"]?.feedback}
                isCorrect={interpretations["serviceLevel"]?.isCorrect}
              />
              <InterpretationQuestion
                kpiKey="errorRate"
                question={`Le taux d'erreur opérationnelle est de ${(errorRate * 100).toFixed(2)}%. Quel est votre diagnostic ? (excellent, acceptable, critique)`}
                onSubmit={handleSubmit}
                submitted={!!interpretations["errorRate"]?.submitted}
                feedback={interpretations["errorRate"]?.feedback}
                isCorrect={interpretations["errorRate"]?.isCorrect}
              />
              <InterpretationQuestion
                kpiKey="diagnostic"
                question="Scénario 3 — Formulez une recommandation stratégique basée sur l'ensemble des indicateurs observés. Justifiez votre décision."
                onSubmit={handleSubmit}
                submitted={!!interpretations["diagnostic"]?.submitted}
                feedback={interpretations["diagnostic"]?.feedback}
                isCorrect={interpretations["diagnostic"]?.isCorrect}
              />
            </div>

            {/* Score summary */}
            {Object.keys(interpretations).length > 0 && (
              <div className="rounded border p-4 bg-white">
                <h4 className="text-sm font-semibold text-[#0f2a44] mb-3">Résumé de performance</h4>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#0070f2]">
                      {Object.values(interpretations).filter((i) => i.isCorrect).length} / {Object.keys(interpretations).length}
                    </p>
                    <p className="text-xs text-gray-500">Réponses correctes</p>
                  </div>
                  <div className="flex-1 text-sm text-gray-600">
                    {Object.values(interpretations).every((i) => i.isCorrect)
                      ? "✅ Excellent travail — toutes les interprétations sont correctes !"
                      : "Continuez à analyser les indicateurs et révisez vos interprétations."}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </FioriShell>
  );
}
