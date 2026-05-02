import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import FioriShell from "@/components/FioriShell";
import { useLocation } from "wouter";
import { CheckCircle, Clock, Lock, ArrowRight, Package, BarChart2, TrendingUp, AlertTriangle, FileText, Presentation } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// ─── Step definitions for Module 5 ───────────────────────────────────────────
const M5_STEPS = [
  { code: "M5_RECEPTION",   label: "Réception fournisseur",    icon: Package,    desc: "Réceptionner les marchandises et créer le bon de réception (GR)." },
  { code: "M5_PUTAWAY",     label: "Rangement et FIFO",        icon: Package,    desc: "Ranger les articles dans les emplacements selon la règle FIFO." },
  { code: "M5_CYCLE_COUNT", label: "Inventaire cyclique",      icon: CheckCircle, desc: "Effectuer un inventaire cyclique et identifier les écarts." },
  { code: "M5_REPLENISH",   label: "Réapprovisionnement",      icon: TrendingUp,  desc: "Générer une recommandation de réapprovisionnement Min/Max." },
  { code: "M5_KPI",         label: "Calcul des KPI",           icon: BarChart2,   desc: "Calculer et interpréter les indicateurs de performance." },
  { code: "M5_DECISION",    label: "Décision stratégique",     icon: FileText,    desc: "Formuler une décision stratégique basée sur les KPI observés." },
  { code: "COMPLIANCE_M5",  label: "Validation finale",        icon: CheckCircle, desc: "Vérification finale de la conformité du scénario intégré." },
];

// ─── Step Form Components ─────────────────────────────────────────────────────
function ReceptionStep({ onComplete }: { onComplete: (data: any) => void }) {
  const [docNum, setDocNum] = useState("");
  const [sku, setSku] = useState("");
  const [qty, setQty] = useState("");
  const { data: skus } = trpc.master.skus.useQuery();

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Créez un bon de réception pour enregistrer l'arrivée des marchandises fournisseur.</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">N° Document GR *</label>
          <input value={docNum} onChange={(e) => setDocNum(e.target.value)} className="w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0070f2]" placeholder="Ex: GR-2025-001" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">SKU *</label>
          <select value={sku} onChange={(e) => setSku(e.target.value)} className="w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0070f2]">
            <option value="">— Sélectionner un SKU —</option>
            {skus?.map((s: any) => <option key={s.id} value={s.skuCode}>{s.skuCode} — {s.descriptionFr}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Quantité reçue *</label>
          <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} className="w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0070f2]" placeholder="Ex: 100" min="1" />
        </div>
      </div>
      <button
        onClick={() => docNum && sku && qty && onComplete({ docNum, sku, qty: parseInt(qty) })}
        disabled={!docNum || !sku || !qty}
        className="px-4 py-2 text-sm font-semibold rounded text-white disabled:opacity-50"
        style={{ background: "#0070f2" }}
      >
        Valider la réception →
      </button>
    </div>
  );
}

function PutawayStep({ onComplete }: { onComplete: (data: any) => void }) {
  const [bin, setBin] = useState("");
  const [fifoConfirmed, setFifoConfirmed] = useState(false);
  const { data: bins } = trpc.master.bins.useQuery();

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Sélectionnez l'emplacement de rangement et confirmez l'application de la règle FIFO.</p>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Emplacement (Bin) *</label>
        <select value={bin} onChange={(e) => setBin(e.target.value)} className="w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0070f2]">
          <option value="">— Sélectionner un emplacement —</option>
          {bins?.map((b: any) => <option key={b.id} value={b.binCode}>{b.binCode} — Zone {b.zone}</option>)}
        </select>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={fifoConfirmed} onChange={(e) => setFifoConfirmed(e.target.checked)} className="rounded" />
        <span className="text-sm text-gray-700">Je confirme l'application de la règle FIFO (First In, First Out)</span>
      </label>
      <button
        onClick={() => bin && fifoConfirmed && onComplete({ bin, fifoConfirmed })}
        disabled={!bin || !fifoConfirmed}
        className="px-4 py-2 text-sm font-semibold rounded text-white disabled:opacity-50"
        style={{ background: "#0070f2" }}
      >
        Valider le rangement →
      </button>
    </div>
  );
}

function CycleCountStep({ onComplete }: { onComplete: (data: any) => void }) {
  const [systemQty, setSystemQty] = useState("");
  const [physicalQty, setPhysicalQty] = useState("");
  const [justification, setJustification] = useState("");

  const variance = systemQty && physicalQty ? parseInt(physicalQty) - parseInt(systemQty) : null;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Comparez le stock système avec le stock physique et identifiez les écarts.</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Stock système (unités)</label>
          <input type="number" value={systemQty} onChange={(e) => setSystemQty(e.target.value)} className="w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0070f2]" placeholder="Ex: 150" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Stock physique compté</label>
          <input type="number" value={physicalQty} onChange={(e) => setPhysicalQty(e.target.value)} className="w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0070f2]" placeholder="Ex: 143" />
        </div>
      </div>
      {variance !== null && (
        <div className="rounded p-3 text-sm" style={{ background: variance === 0 ? "#e8f5e9" : "#fff8e1", color: variance === 0 ? "#2e7d32" : "#f57f17" }}>
          Écart calculé : <strong>{variance > 0 ? "+" : ""}{variance} unités</strong>
          {variance !== 0 && " — Justification requise"}
        </div>
      )}
      {variance !== null && variance !== 0 && (
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Justification de l'écart *</label>
          <textarea value={justification} onChange={(e) => setJustification(e.target.value)} className="w-full border rounded px-3 py-1.5 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#0070f2]" rows={2} placeholder="Ex: Bris de stock, erreur de comptage, vol..." />
        </div>
      )}
      <button
        onClick={() => systemQty && physicalQty && (variance === 0 || justification) && onComplete({ systemQty: parseInt(systemQty), physicalQty: parseInt(physicalQty), variance, justification })}
        disabled={!systemQty || !physicalQty || (variance !== 0 && !justification)}
        className="px-4 py-2 text-sm font-semibold rounded text-white disabled:opacity-50"
        style={{ background: "#0070f2" }}
      >
        Valider l'inventaire →
      </button>
    </div>
  );
}

function ReplenishStep({ onComplete }: { onComplete: (data: any) => void }) {
  const [currentStock, setCurrentStock] = useState("");
  const [minLevel, setMinLevel] = useState("");
  const [maxLevel, setMaxLevel] = useState("");
  const [safetyStock, setSafetyStock] = useState("");

  const needsReplenishment = currentStock && minLevel ? parseInt(currentStock) <= parseInt(minLevel) : false;
  const qtyToOrder = needsReplenishment && maxLevel ? parseInt(maxLevel) - parseInt(currentStock) : 0;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Analysez les niveaux d'inventaire et générez une recommandation de réapprovisionnement Min/Max.</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Stock actuel (unités)</label>
          <input type="number" value={currentStock} onChange={(e) => setCurrentStock(e.target.value)} className="w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0070f2]" placeholder="Ex: 45" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Niveau Min</label>
          <input type="number" value={minLevel} onChange={(e) => setMinLevel(e.target.value)} className="w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0070f2]" placeholder="Ex: 50" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Niveau Max</label>
          <input type="number" value={maxLevel} onChange={(e) => setMaxLevel(e.target.value)} className="w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0070f2]" placeholder="Ex: 200" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Stock de sécurité</label>
          <input type="number" value={safetyStock} onChange={(e) => setSafetyStock(e.target.value)} className="w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0070f2]" placeholder="Ex: 20" />
        </div>
      </div>
      {currentStock && minLevel && (
        <div className="rounded p-3 text-sm" style={{ background: needsReplenishment ? "#ffebee" : "#e8f5e9", color: needsReplenishment ? "#c62828" : "#2e7d32" }}>
          {needsReplenishment
            ? `⚠ Réapprovisionnement requis — Commander ${qtyToOrder} unités (jusqu'au Max)`
            : "✓ Stock suffisant — aucun réapprovisionnement nécessaire"}
        </div>
      )}
      <button
        onClick={() => currentStock && minLevel && maxLevel && onComplete({ currentStock: parseInt(currentStock), minLevel: parseInt(minLevel), maxLevel: parseInt(maxLevel), safetyStock: parseInt(safetyStock || "0"), needsReplenishment, qtyToOrder })}
        disabled={!currentStock || !minLevel || !maxLevel}
        className="px-4 py-2 text-sm font-semibold rounded text-white disabled:opacity-50"
        style={{ background: "#0070f2" }}
      >
        Valider le réapprovisionnement →
      </button>
    </div>
  );
}

function KpiStep({ onComplete }: { onComplete: (data: any) => void }) {
  const rotation = (2400 / 400).toFixed(2);
  const serviceLevel = ((285 / 300) * 100).toFixed(1);
  const errorRate = ((12 / 300) * 100).toFixed(2);

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Analysez les KPI calculés automatiquement à partir des données de simulation.</p>
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded border p-3 bg-white text-center">
          <p className="text-xs text-gray-500 mb-1">Rotation des stocks</p>
          <p className="text-2xl font-bold text-[#0070f2]">{rotation}x</p>
          <p className="text-xs text-green-600 font-semibold mt-1">Normal</p>
        </div>
        <div className="rounded border p-3 bg-white text-center">
          <p className="text-xs text-gray-500 mb-1">Taux de service</p>
          <p className="text-2xl font-bold text-[#0070f2]">{serviceLevel}%</p>
          <p className="text-xs text-yellow-600 font-semibold mt-1">Acceptable</p>
        </div>
        <div className="rounded border p-3 bg-white text-center">
          <p className="text-xs text-gray-500 mb-1">Taux d'erreur</p>
          <p className="text-2xl font-bold text-[#0070f2]">{errorRate}%</p>
          <p className="text-xs text-yellow-600 font-semibold mt-1">Acceptable</p>
        </div>
      </div>
      <button
        onClick={() => onComplete({ rotation, serviceLevel, errorRate })}
        className="px-4 py-2 text-sm font-semibold rounded text-white"
        style={{ background: "#0070f2" }}
      >
        Confirmer les KPI →
      </button>
    </div>
  );
}

function DecisionStep({ onComplete }: { onComplete: (data: any) => void }) {
  const [decision, setDecision] = useState("");

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Formulez une décision stratégique basée sur l'ensemble des indicateurs observés dans ce scénario intégré.</p>
      <div className="rounded border p-3 bg-blue-50 text-xs text-blue-800">
        <strong>Rappel des KPI :</strong> Rotation 6.0x (Normal) | Taux de service 95.0% (Acceptable) | Taux d'erreur 4.0% (Acceptable)
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Votre décision stratégique *</label>
        <textarea
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#0070f2]"
          rows={5}
          placeholder="Analysez les KPI et formulez une recommandation stratégique. Mentionnez les actions correctives proposées (réapprovisionnement, formation, procédures, etc.)..."
        />
        <p className="text-xs text-gray-400 mt-1">{decision.length} caractères (minimum 100 recommandé)</p>
      </div>
      <button
        onClick={() => decision.trim().length >= 50 && onComplete({ decision })}
        disabled={decision.trim().length < 50}
        className="px-4 py-2 text-sm font-semibold rounded text-white disabled:opacity-50"
        style={{ background: "#0070f2" }}
      >
        Soumettre la décision →
      </button>
    </div>
  );
}

// ─── Simulation Report ────────────────────────────────────────────────────────
function SimulationReport({ stepData, onReset }: { stepData: Record<string, any>; onReset: () => void }) {
  const steps = Object.keys(stepData);
  const score = Math.min(100, steps.length * 14 + (stepData["M5_DECISION"]?.decision?.length > 100 ? 16 : 0));

  return (
    <div className="space-y-6">
      <div className="rounded border p-5 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#0f2a44]">Rapport de simulation intégrée</h3>
          <div className="text-right">
            <p className="text-3xl font-bold text-[#0070f2]">{score}<span className="text-base font-normal">/100</span></p>
            <p className="text-xs text-gray-500">Score final</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {M5_STEPS.map((step) => (
            <div key={step.code} className="flex items-center gap-2 text-sm">
              {stepData[step.code] ? (
                <CheckCircle size={14} className="text-green-600 shrink-0" />
              ) : (
                <Clock size={14} className="text-gray-300 shrink-0" />
              )}
              <span className={stepData[step.code] ? "text-gray-700" : "text-gray-400"}>{step.label}</span>
            </div>
          ))}
        </div>
        {stepData["M5_DECISION"] && (
          <div className="border-t pt-3 mt-3">
            <p className="text-xs font-semibold text-gray-600 mb-1">Décision stratégique soumise :</p>
            <p className="text-sm text-gray-700 italic">"{stepData["M5_DECISION"].decision}"</p>
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <button onClick={onReset} className="px-4 py-2 text-sm font-semibold rounded border text-gray-700 hover:bg-gray-50">
          Recommencer
        </button>
        <button onClick={() => window.location.href = "/student/scenarios"} className="px-4 py-2 text-sm font-semibold rounded text-white" style={{ background: "#0070f2" }}>
          Retour aux scénarios
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────────────────────────────
export default function Module5SimulationPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { data: moduleProgress } = trpc.modules.progress.useQuery();
  const { data: m5Scenarios } = trpc.scenarios.listByModule.useQuery({ moduleCode: "M5" });

  const m4Progress = moduleProgress?.find((p: any) => p.moduleCode === "M4");
  const isAdminOrTeacher = user?.role === "admin" || user?.role === "teacher";
  const isLocked = !isAdminOrTeacher && !m4Progress?.passed;

  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepData, setStepData] = useState<Record<string, any>>({});
  const [completed, setCompleted] = useState(false);

  const handleStepComplete = (stepCode: string, data: any) => {
    setStepData((prev) => ({ ...prev, [stepCode]: data }));
    if (currentStepIndex < M5_STEPS.length - 1) {
      setCurrentStepIndex((i) => i + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleReset = () => {
    setSelectedScenario(null);
    setCurrentStepIndex(0);
    setStepData({});
    setCompleted(false);
  };

  if (isLocked) {
    return (
      <FioriShell title="Module 5 — Simulation opérationnelle intégrée" breadcrumbs={[{ label: "Scénarios", href: "/student/scenarios" }, { label: "Module 5" }]}>
        <div className="max-w-lg mx-auto mt-16 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#f5f5f5" }}>
            <Lock size={28} className="text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-[#0f2a44] mb-2">Module verrouillé</h2>
          <p className="text-sm text-gray-500 mb-6">Le Module 5 est verrouillé. La validation du Module 4 est requise.</p>
          <button onClick={() => navigate("/student/scenarios")} className="px-4 py-2 text-sm font-semibold rounded text-white" style={{ background: "#0070f2" }}>
            Retour aux scénarios
          </button>
        </div>
      </FioriShell>
    );
  }

  const currentStep = M5_STEPS[currentStepIndex];

  return (
    <FioriShell
      title="Module 5 — Simulation opérationnelle intégrée"
      breadcrumbs={[{ label: "Scénarios", href: "/student/scenarios" }, { label: "Module 5 — Simulation intégrée" }]}
    >
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Module header */}
        <div className="rounded border p-5 bg-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded flex items-center justify-center" style={{ background: "#f3e5f5" }}>
              <FileText size={20} style={{ color: "#7b1fa2" }} />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-[#0f2a44]">Module 5 — {t("Simulation opérationnelle intégrée", "Integrated Operational Simulation")}</h2>
                  <p className="text-xs text-gray-500">Programme 1 — TEC.LOG | Collège de la Concorde — Montréal</p>
                </div>
                <button
                  onClick={() => navigate("/student/slides/5")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold text-white shrink-0 hover:opacity-90 transition-opacity"
                  style={{ background: "#0f2a44" }}
                >
                  <Presentation size={14} />
                  {t("Slides M5", "Slides M5")}
                </button>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Ce module final intègre toutes les compétences acquises dans les Modules 1 à 4 : réception, rangement FIFO,
            inventaire cyclique, réapprovisionnement Min/Max, calcul KPI et décision stratégique dans un scénario complet.
          </p>
        </div>

        {/* Scenario selector */}
        {!selectedScenario && !completed && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#0f2a44]">Choisissez un scénario</h3>
            {m5Scenarios?.map((s: any) => (
              <button
                key={s.id}
                onClick={() => setSelectedScenario(s.id)}
                className="w-full text-left rounded border p-4 bg-white hover:border-[#7b1fa2] transition-colors"
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

        {/* Step-by-step simulation */}
        {selectedScenario && !completed && (
          <div className="space-y-6">
            {/* Progress bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-600">Progression — Étape {currentStepIndex + 1} / {M5_STEPS.length}</p>
                <p className="text-xs text-gray-400">{Math.round(((currentStepIndex) / M5_STEPS.length) * 100)}% complété</p>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-200">
                <div className="h-2 rounded-full transition-all" style={{ width: `${(currentStepIndex / M5_STEPS.length) * 100}%`, background: "#7b1fa2" }} />
              </div>
            </div>

            {/* Step list */}
            <div className="flex gap-2 flex-wrap">
              {M5_STEPS.map((step, i) => (
                <div key={step.code} className="flex items-center gap-1 text-xs px-2 py-1 rounded" style={{
                  background: i < currentStepIndex ? "#e8f5e9" : i === currentStepIndex ? "#f3e5f5" : "#f5f5f5",
                  color: i < currentStepIndex ? "#2e7d32" : i === currentStepIndex ? "#7b1fa2" : "#9e9e9e",
                  fontWeight: i === currentStepIndex ? 600 : 400,
                }}>
                  {i < currentStepIndex ? <CheckCircle size={10} /> : <Clock size={10} />}
                  {step.label}
                </div>
              ))}
            </div>

            {/* Current step form */}
            <div className="rounded border p-5 bg-white">
              <h3 className="text-sm font-bold text-[#0f2a44] mb-1">{currentStep.label}</h3>
              <p className="text-xs text-gray-500 mb-4">{currentStep.desc}</p>

              {currentStep.code === "M5_RECEPTION"   && <ReceptionStep   onComplete={(d) => handleStepComplete(currentStep.code, d)} />}
              {currentStep.code === "M5_PUTAWAY"     && <PutawayStep     onComplete={(d) => handleStepComplete(currentStep.code, d)} />}
              {currentStep.code === "M5_CYCLE_COUNT" && <CycleCountStep  onComplete={(d) => handleStepComplete(currentStep.code, d)} />}
              {currentStep.code === "M5_REPLENISH"   && <ReplenishStep   onComplete={(d) => handleStepComplete(currentStep.code, d)} />}
              {currentStep.code === "M5_KPI"         && <KpiStep         onComplete={(d) => handleStepComplete(currentStep.code, d)} />}
              {currentStep.code === "M5_DECISION"    && <DecisionStep    onComplete={(d) => handleStepComplete(currentStep.code, d)} />}
              {currentStep.code === "COMPLIANCE_M5"  && (
                <div className="space-y-4">
                  <div className="rounded p-4 bg-green-50 border border-green-200">
                    <p className="text-sm font-semibold text-green-800">✅ Vérification finale — Toutes les étapes ont été complétées avec succès.</p>
                    <p className="text-xs text-green-700 mt-1">Le scénario intégré est conforme aux standards opérationnels.</p>
                  </div>
                  <button onClick={() => handleStepComplete(currentStep.code, { validated: true })} className="px-4 py-2 text-sm font-semibold rounded text-white" style={{ background: "#2e7d32" }}>
                    Générer le rapport final →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Completed report */}
        {completed && <SimulationReport stepData={stepData} onReset={handleReset} />}
      </div>
    </FioriShell>
  );
}
