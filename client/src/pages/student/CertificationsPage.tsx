import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { Award, ArrowLeft, CheckCircle, Lock, Circle, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import FioriShell from "@/components/FioriShell";

export function CertificationsPage() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();

  const { data: profile, isLoading: profileLoading } = trpc.profiles.mine.useQuery();
  const { data: quizM1 } = trpc.quiz.getBestAttempt.useQuery({ moduleId: 1 });
  const { data: scenarios } = trpc.scenarios.list.useQuery();
  const { data: myRuns } = trpc.runs.myRunsEnriched.useQuery();

  const m1Scenarios = (scenarios ?? []).filter((s) => s.moduleId === 1);
  const m1CompletedCount = m1Scenarios.filter((s) =>
    (myRuns ?? []).some(
      (r) => r.run.scenarioId === s.id && r.run.status === "completed" && !r.run.isDemo
    )
  ).length;
  const quizPassed = quizM1?.passed === true;
  const allM1ScenariosDone =
    m1Scenarios.length > 0 && m1CompletedCount >= m1Scenarios.length;

  const silverEarned = profile?.silverCertified ?? false;
  const goldEarned = profile?.goldCertified ?? false;

  const silverRequirements = [
    {
      id: "quiz",
      labelFr: "Quiz M1 réussi (≥ 60 %)",
      labelEn: "M1 quiz passed (≥ 60%)",
      met: quizPassed,
      action: () => navigate("/student/quiz/1"),
      actionLabelFr: "Passer le quiz M1",
      actionLabelEn: "Take M1 quiz",
    },
    {
      id: "scenarios",
      labelFr: `Scénarios M1 complétés (${m1CompletedCount}/${m1Scenarios.length})`,
      labelEn: `M1 scenarios completed (${m1CompletedCount}/${m1Scenarios.length})`,
      met: allM1ScenariosDone,
      action: () => navigate("/student/scenarios"),
      actionLabelFr: "Voir les scénarios M1",
      actionLabelEn: "View M1 scenarios",
    },
    {
      id: "compliance",
      labelFr: "Conformité M1 validée sur tous les scénarios",
      labelEn: "M1 compliance validated on all scenarios",
      met: silverEarned || (allM1ScenariosDone && quizPassed),
      action: () => navigate("/student/scenarios"),
      actionLabelFr: "Finaliser la conformité",
      actionLabelEn: "Complete compliance",
    },
  ];

  const silverReady = silverRequirements.every((r) => r.met);
  const silverBlockers = silverRequirements.filter((r) => !r.met);

  const certifications = [
    {
      id: "silver",
      tier: "Silver",
      titleFr: "TEC.LOG Fundamentals",
      titleEn: "TEC.LOG Fundamentals",
      subtitleFr: "Module 1 — Fondements ERP/WMS",
      subtitleEn: "Module 1 — ERP/WMS Foundations",
      descriptionFr:
        "Certification Silver : maîtrise du cycle opérationnel nominal et résolution des anomalies M1 (SCN-001 à SCN-005).",
      descriptionEn:
        "Silver certification: mastery of the nominal operational cycle and M1 anomaly resolution (SCN-001 to SCN-005).",
      unlocked: silverEarned,
      icon: "🥈",
      color: "from-slate-400 to-slate-600",
      lockMessageFr: "Complétez le quiz M1 et tous les scénarios M1 avec conformité.",
      lockMessageEn: "Complete the M1 quiz and all M1 scenarios with compliance.",
    },
    {
      id: "gold",
      tier: "Gold",
      titleFr: "TEC.LOG Integrated Operations",
      titleEn: "TEC.LOG Integrated Operations",
      subtitleFr: "Modules 1 à 5 — Parcours intégré",
      subtitleEn: "Modules 1 to 5 — Integrated pathway",
      descriptionFr:
        "Certification Gold : expertise complète M1–M5 incluant exécution entrepôt, contrôle stocks, KPI et capstone M5.",
      descriptionEn:
        "Gold certification: full M1–M5 expertise including warehouse execution, inventory control, KPIs and M5 capstone.",
      unlocked: goldEarned,
      icon: "🥇",
      color: "from-yellow-400 to-yellow-600",
      lockMessageFr: "Disponible après certification Silver et complétion du parcours M2–M5.",
      lockMessageEn: "Available after Silver certification and completion of the M2–M5 pathway.",
    },
  ];

  if (profileLoading) {
    return (
      <FioriShell>
        <div className="flex justify-center items-center h-64">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </FioriShell>
    );
  }

  return (
    <FioriShell
      title={t("Mes Certifications", "My Certifications")}
      breadcrumbs={[
        { label: t("Accueil", "Home"), href: "/" },
        { label: t("Certifications", "Certifications") },
      ]}
    >
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/student/scenarios")}
            className="p-2 hover:bg-muted rounded-md transition-colors"
            type="button"
          >
            <ArrowLeft size={20} className="text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t("Mes Certifications TEC.LOG", "My TEC.LOG Certifications")}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t("Collège de la Concorde — TEC.WMS", "Collège de la Concorde — TEC.WMS")}
            </p>
          </div>
        </div>

        {/* M1 Silver progress checklist */}
        <div className="bg-card border border-border rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
              {t("Parcours Silver — Module 1", "Silver Pathway — Module 1")}
            </h2>
            {silverEarned ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <CheckCircle size={14} /> {t("Certifié", "Certified")}
              </span>
            ) : silverReady ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                <AlertCircle size={14} /> {t("En attente de validation", "Pending validation")}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">
                {t("En cours", "In progress")}
              </span>
            )}
          </div>
          <ul className="space-y-2">
            {silverRequirements.map((req) => (
              <li key={req.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2">
                  {req.met ? (
                    <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                  ) : (
                    <Circle size={16} className="text-muted-foreground shrink-0" />
                  )}
                  <span className={req.met ? "text-foreground" : "text-muted-foreground"}>
                    {t(req.labelFr, req.labelEn)}
                  </span>
                </span>
                {!req.met && (
                  <button
                    type="button"
                    onClick={req.action}
                    className="text-xs text-primary hover:underline shrink-0"
                  >
                    {t(req.actionLabelFr, req.actionLabelEn)}
                  </button>
                )}
              </li>
            ))}
          </ul>
          {!silverEarned && silverBlockers.length > 0 && (
            <p className="text-xs text-muted-foreground border-t border-border pt-3">
              {t(
                "Blocage Silver : complétez les éléments ci-dessus. Le statut est enregistré automatiquement après validation conformité.",
                "Silver blocker: complete the items above. Status is saved automatically after compliance validation."
              )}
            </p>
          )}
        </div>

        {/* Certification cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className={`relative border rounded-lg overflow-hidden transition-all ${
                cert.unlocked
                  ? `border-primary/50 bg-gradient-to-br ${cert.color} bg-opacity-5`
                  : "border-border bg-card"
              }`}
            >
              {cert.unlocked && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold rounded-bl-lg">
                  {t("OBTENU", "EARNED")}
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{cert.icon}</div>
                  {cert.unlocked ? (
                    <CheckCircle size={24} className="text-emerald-500" />
                  ) : (
                    <Lock size={24} className="text-muted-foreground" />
                  )}
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-0.5">{cert.tier}</h3>
                <p className="text-sm font-medium text-primary mb-1">
                  {t(cert.titleFr, cert.titleEn)}
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  {t(cert.subtitleFr, cert.subtitleEn)}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {t(cert.descriptionFr, cert.descriptionEn)}
                </p>

                <div className="pt-4 border-t border-border">
                  {cert.unlocked ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-emerald-500" />
                      <span className="text-sm font-medium text-emerald-600">
                        {t("Certification obtenue", "Certification earned")}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Lock size={16} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {t(cert.lockMessageFr, cert.lockMessageEn)}
                        </span>
                      </div>
                      {cert.id === "silver" && silverBlockers.length > 0 && (
                        <p className="text-xs text-amber-700 dark:text-amber-400 pl-6">
                          {silverBlockers.length}{" "}
                          {t("exigence(s) restante(s) — voir checklist ci-dessus", "requirement(s) remaining — see checklist above")}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex gap-3">
            <Award size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                {t("À propos des certifications", "About certifications")}
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {t(
                  "Silver = validation du Module 1 (quiz + scénarios SCN-001 à SCN-005). Gold = parcours intégré M1–M5, verrouillé jusqu'à complétion du programme.",
                  "Silver = Module 1 validation (quiz + SCN-001 to SCN-005 scenarios). Gold = integrated M1–M5 pathway, locked until program completion."
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </FioriShell>
  );
}
