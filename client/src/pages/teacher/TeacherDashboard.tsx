import FioriShell from "@/components/FioriShell";
import { trpc } from "@/lib/trpc";
import { useLocation, Link } from "wouter";
import {
  BookOpen, Users, BarChart2, ClipboardList, Monitor,
  ShieldCheck, Layers, TrendingUp, FileText,
  MonitorPlay, Presentation, Plus, ArrowRight,
  ListChecks,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTeacherCohortInput } from "@/hooks/useTeacherCohort";
import { useCohort } from "@/contexts/CohortContext";
import { skipToken } from "@tanstack/react-query";
import { SLIDE_COUNT_BY_MODULE } from "@/data/slideCounts";

export default function TeacherDashboard() {
  const [, navigate] = useLocation();
  const { t, language } = useLanguage();

  const cohortInput = useTeacherCohortInput();
  const { selectedCohortId, selectedCohort } = useCohort();
  const utils = trpc.useUtils();

  const { data: mentorCohortSetting } = trpc.mentor.getCohortSetting.useQuery(
    selectedCohortId != null ? { cohortId: selectedCohortId } : skipToken,
  );
  const setMentorCohortDisabled = trpc.mentor.setCohortAiDisabled.useMutation({
    onSuccess: () => void utils.mentor.getCohortSetting.invalidate(),
  });

  const { data: scenarios } = trpc.scenarios.list.useQuery();
  const { data: assignments } = trpc.assignments.all.useQuery(cohortInput);
  const { data: activity, isError: activityError, isFetching: activityLoading } = trpc.monitor.activitySummary.useQuery(cohortInput);
  const { data: enrolledStudents = [], isLoading: studentsLoading, isError: studentsError } = trpc.students.list.useQuery(
    cohortInput === skipToken ? skipToken : { ...cohortInput, includeAll: false },
  );
  const { data: moduleProgressRows } = trpc.warehouse.allModuleProgress.useQuery(cohortInput);
  const { data: goldRoster } = trpc.profiles.goldRoster.useQuery(cohortInput);
  const validateM3 = trpc.warehouse.validateTeacherModule.useMutation({
    onSuccess: () => void utils.warehouse.allModuleProgress.invalidate(),
  });

  const moduleStats = [1, 2, 3, 4, 5].map((moduleId) => {
    const rows = (moduleProgressRows ?? []).filter(
      (row: { progress: { moduleId: number; averageScore: number | null; passed: boolean; completedScenarios: number | null } }) =>
        row.progress.moduleId === moduleId,
    );
    const scores = rows
      .map((r: { progress: { averageScore: number | null } }) => r.progress.averageScore)
      .filter((s: number | null): s is number => s != null);
    const avg = scores.length ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : null;
    const passed = rows.filter((r: { progress: { passed: boolean } }) => r.progress.passed).length;
    const runCount = rows.reduce(
      (sum: number, r: { progress: { completedScenarios: number | null } }) => sum + (r.progress.completedScenarios ?? 0),
      0,
    );
    return { runCount, avg, passed };
  });

  const mAvg = moduleStats.map((s) => s.avg);
  const mPassed = moduleStats.map((s) => s.passed);
  const mRunCounts = moduleStats.map((s) => s.runCount);

  const m3AwaitingValidation = (moduleProgressRows ?? []).filter(
    (row: { progress: { moduleId: number; passed: boolean; teacherValidated: boolean }; user: { role: string; name: string | null; id: number } }) =>
      row.progress.moduleId === 3 &&
      row.user.role === "student" &&
      row.progress.passed &&
      !row.progress.teacherValidated,
  );

  const assignmentsCount = assignments?.length ?? 0;
  const activeEvalCount = activity?.inProgressCount ?? 0;
  const evalStudentIds = new Set(activity?.studentIdsWithEvalRuns ?? []);
  const activeEvalStudentCount = enrolledStudents.filter((s: { id: number }) => evalStudentIds.has(s.id)).length;
  const notStartedStudentCount = Math.max(0, enrolledStudents.length - activeEvalStudentCount);
  const rosterBreakdown = studentsLoading
    ? t("Chargement du roster…", "Loading roster…")
    : studentsError
      ? t("Impossible de charger le roster — réessayez", "Unable to load roster — retry")
      : t(
          `${enrolledStudents.length} inscrits · ${activeEvalCount} run(s) en cours · ${activity?.evalRunCount ?? 0} runs éval.`,
          `${enrolledStudents.length} enrolled · ${activeEvalCount} in-progress run(s) · ${activity?.evalRunCount ?? 0} eval runs`,
        );

  const cards = [
    {
      icon: BookOpen,
      label: t("Scénarios", "Scenarios"),
      value: scenarios?.length ?? 0,
      href: "/teacher/scenarios", color: "text-[#0070f2]", bg: "bg-[#e8f0fe]",
      cta: null,
    },
    {
      icon: Users,
      label: t("Étudiants inscrits", "Enrolled students"),
      value: studentsLoading ? "…" : enrolledStudents.length,
      sub: rosterBreakdown,
      href: "/teacher/students", color: "text-[#107e3e]", bg: "bg-[#d4edda]",
      cta: !studentsLoading && enrolledStudents.length === 0 ? t("Ajouter un étudiant →", "Add a student →") : null,
    },
    {
      icon: ClipboardList,
      label: t("Devoirs assignés", "Assigned tasks"),
      value: assignmentsCount,
      href: "/teacher/scenarios", color: "text-[#e9730c]", bg: "bg-[#fff3cd]",
      cta: assignmentsCount === 0 ? t("Assigner un scénario →", "Assign a scenario →") : null,
    },
    {
      icon: Monitor,
      label: t("Simulations actives (éval.)", "Active simulations (eval.)"),
      value: activityLoading ? "…" : activeEvalCount,
      href: "/teacher/monitor", color: "text-[#5b4b8a]", bg: "bg-[#ede7f6]",
      cta: null,
    },
    {
      icon: ListChecks,
      label: t("Parcours formatif Pré/Pós", "Formative Pre/Post path"),
      value: t("Suivi", "Monitor"),
      href: "/teacher/exercices", color: "text-[#0f766e]", bg: "bg-teal-50",
      cta: t("Évolution et points chauds →", "Evolution and hotspots →"),
    },
  ];

  const recentStudents = enrolledStudents.slice(0, 8);

  const moduleConfig = [
    { id: 1, label: t("Module 1 — Fondements ERP/WMS", "Module 1 — ERP/WMS Foundations"), color: "#0070f2", bg: "bg-[#e8f0fe]", text: "text-[#0070f2]", border: "border-[#0070f2]/20", slidesBg: "bg-[#e8f0fe]", slidesText: "text-[#0070f2]", slidesHover: "hover:bg-[#d0e4fc]", icon: BookOpen, threshold: 60 },
    { id: 2, label: t("Module 2 — Exécution d'entrepôt", "Module 2 — Warehouse Execution"), color: "#2563eb", bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", slidesBg: "bg-blue-50", slidesText: "text-blue-600", slidesHover: "hover:bg-blue-100", icon: Layers, threshold: 60 },
    { id: 3, label: t("Module 3 — Contrôle des stocks", "Module 3 — Inventory Control"), color: "#059669", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", slidesBg: "bg-emerald-50", slidesText: "text-emerald-600", slidesHover: "hover:bg-emerald-100", icon: TrendingUp, threshold: 70 },
    { id: 4, label: t("Module 4 — Indicateurs de performance", "Module 4 — Performance Indicators"), color: "#d97706", bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200", slidesBg: "bg-orange-50", slidesText: "text-orange-600", slidesHover: "hover:bg-orange-100", icon: BarChart2, threshold: 70 },
    { id: 5, label: t("Module 5 — Simulation intégrée", "Module 5 — Integrated Simulation"), color: "#7b1fa2", bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200", slidesBg: "bg-purple-50", slidesText: "text-purple-600", slidesHover: "hover:bg-purple-100", icon: FileText, threshold: 70 },
  ];

  const moduleQuickAccess = [
    { id: 1, label: t("Module 1 — Fondements ERP/WMS", "Module 1 — ERP/WMS Foundations"), sub: t("Flux logistiques · WMS · ERP · SAP · Intégration", "Logistics flows · WMS · ERP · SAP · Integration"), border: "border-slate-200 dark:border-slate-700", bg: "bg-slate-50 dark:bg-slate-900/30", title: "text-slate-900 dark:text-slate-200", sub_c: "text-slate-600 dark:text-slate-400", btn: "text-slate-600 dark:text-slate-400", icon: BookOpen, iconC: "text-slate-600", route: "/student/scenarios?module=1" },
    { id: 2, label: t("Module 2 — Exécution d'entrepôt", "Module 2 — Warehouse Execution"), sub: t("Rangement · Capacité d'emplacement · FIFO · Précision inventaire", "Put-away · Bin capacity · FIFO · Inventory accuracy"), border: "border-blue-200 dark:border-blue-800", bg: "bg-blue-50 dark:bg-blue-950/30", title: "text-blue-900 dark:text-blue-200", sub_c: "text-blue-700 dark:text-blue-400", btn: "text-blue-600", icon: Layers, iconC: "text-blue-600", route: "/student/scenarios?module=2" },
    { id: 3, label: t("Module 3 — Contrôle des stocks et réapprovisionnement", "Module 3 — Inventory Control & Replenishment"), sub: t("Inventaire cyclique · Écarts · Ajustements · Min/Max · Stock de sécurité", "Cycle count · Variances · Adjustments · Min/Max · Safety stock"), border: "border-emerald-200 dark:border-emerald-800", bg: "bg-emerald-50 dark:bg-emerald-950/30", title: "text-emerald-900 dark:text-emerald-200", sub_c: "text-emerald-700 dark:text-emerald-400", btn: "text-emerald-600", icon: TrendingUp, iconC: "text-emerald-600", route: "/student/scenarios?module=3" },
    { id: 4, label: t("Module 4 — Indicateurs de performance logistique", "Module 4 — Logistics Performance Indicators"), sub: t("Rotation · Taux de service · Taux d'erreur · Lead time · Diagnostic KPI", "Turnover · Service rate · Error rate · Lead time · KPI diagnosis"), border: "border-orange-200 dark:border-orange-800", bg: "bg-orange-50 dark:bg-orange-950/30", title: "text-orange-900 dark:text-orange-200", sub_c: "text-orange-700 dark:text-orange-400", btn: "text-[#d97706]", icon: BarChart2, iconC: "text-[#d97706]", route: "/student/scenarios?module=4" },
    { id: 5, label: t("Module 5 — Simulation opérationnelle intégrée", "Module 5 — Integrated Operational Simulation"), sub: t("Réception · Rangement FIFO · Inventaire · Réapprovisionnement · KPI · Décision", "Receiving · FIFO put-away · Inventory · Replenishment · KPI · Decision"), border: "border-purple-200 dark:border-purple-800", bg: "bg-purple-50 dark:bg-purple-950/30", title: "text-purple-900 dark:text-purple-200", sub_c: "text-purple-700 dark:text-purple-400", btn: "text-[#7b1fa2]", icon: FileText, iconC: "text-[#7b1fa2]", route: "/student/scenarios?module=5" },
  ];

  return (
    <FioriShell title={t("Tableau de Bord — Enseignant", "Teacher Dashboard")} breadcrumbs={[]}>
      {/* ── KPI Cards ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((card) => (
          <button
            key={card.label}
            onClick={() => navigate(card.href)}
            className="bg-card border border-border rounded-md p-4 text-left hover:border-[#0070f2] hover:shadow-sm transition-all group"
          >
            <div className={`w-9 h-9 ${card.bg} rounded-md flex items-center justify-center mb-3`}>
              <card.icon size={16} className={card.color} />
            </div>
            <p className="text-2xl font-bold text-foreground">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
            {"sub" in card && card.sub && (
              <p className="text-[10px] text-muted-foreground mt-1">{card.sub}</p>
            )}
            {card.cta && (
              <p className="text-[10px] text-[#0070f2] font-semibold mt-1.5 flex items-center gap-1 group-hover:underline">
                <Plus size={9} />{card.cta}
              </p>
            )}
          </button>
        ))}
      </div>

      {selectedCohortId != null && (
        <div className="mb-6 flex items-center justify-between rounded-md border border-border bg-card px-4 py-3">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-primary" />
            <div>
              <p className="text-xs font-bold">{t("Consultation Concorde — cohorte", "Concorde consultation — cohort")}</p>
              <p className="text-[10px] text-muted-foreground">
                {selectedCohort?.name ?? t("Cohorte sélectionnée", "Selected cohort")}
              </p>
            </div>
          </div>
          <label className="flex items-center gap-2 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={mentorCohortSetting?.disabled ?? false}
              disabled={setMentorCohortDisabled.isPending}
              onChange={(e) =>
                setMentorCohortDisabled.mutate({
                  cohortId: selectedCohortId,
                  disabled: e.target.checked,
                })
              }
              data-testid="cohort-ai-mentor-disable"
            />
            {t("Désactiver la consultation interne", "Disable internal consultation")}
          </label>
        </div>
      )}

      {/* ── Module Progress Cards ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {moduleConfig.map((mod, idx) => {
          const runCount = mRunCounts[idx];
          const avg = mAvg[idx];
          const passed = mPassed[idx];
          const Icon = mod.icon;
          return (
            <Card key={mod.id} className="border-border">
              <CardHeader className="pb-2 px-4 pt-4">
                <CardTitle className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                  <Icon size={12} className={mod.text} />
                  <span className="truncate">{mod.label}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <Link
                  href={`/student/slides/${mod.id}`}
                  className={`mb-3 flex items-center justify-center gap-1.5 py-1.5 rounded-md ${mod.slidesBg} ${mod.slidesText} text-[10px] font-semibold ${mod.slidesHover} transition-colors`}
                >
                  <Presentation size={11} />
                  Slides M{mod.id}
                  <span className="opacity-60 font-normal">({SLIDE_COUNT_BY_MODULE[mod.id]})</span>
                </Link>

                {runCount === 0 ? (
                  <div className="py-3 text-center">
                    <p className="text-[10px] text-muted-foreground mb-2">{t("Aucune simulation enregistrée", "No simulation recorded")}</p>
                    <button
                      onClick={() => navigate("/teacher/scenarios")}
                      className={`text-[9px] font-semibold ${mod.slidesText} flex items-center gap-1 mx-auto hover:underline`}
                    >
                      <ArrowRight size={9} /> {t("Assigner un scénario", "Assign a scenario")}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <p className={`text-lg font-bold ${mod.text}`}>{runCount}</p>
                        <p className="text-[9px] text-muted-foreground">{t("Simul.", "Simul.")}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-[#107e3e]">
                          {avg !== null ? avg : "0"}
                        </p>
                        <p className="text-[9px] text-muted-foreground">{t("Moy.", "Avg.")}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-[#e9730c]">
                          {passed}/{enrolledStudents.length || runCount}
                        </p>
                        <p className="text-[9px] text-muted-foreground">{t("Réussis", "Passed")}</p>
                      </div>
                    </div>
                    {avg !== null && (
                      <div className="mt-2.5">
                        <div className="flex items-center justify-between text-[9px] text-muted-foreground mb-1">
                          <span>{t("Score moyen", "Avg. score")}</span>
                          <span className={avg >= mod.threshold ? "text-[#107e3e] font-semibold" : "text-[#bb0000] font-semibold"}>
                            {avg}/100
                          </span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${avg >= mod.threshold ? "bg-[#107e3e]" : "bg-[#e9730c]"}`}
                            style={{ width: `${avg}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── Gold certification roster (read-only) ─────────────────────────────── */}
      {(goldRoster ?? []).length > 0 && (
        <div className="bg-card border border-amber-200 rounded-md mb-6 p-4">
          <p className="text-xs font-semibold text-amber-900 flex items-center gap-2 mb-3">
            <Layers size={14} />
            {t("Parcours Silver / Gold — état des étudiants", "Silver / Gold pathway — student status")}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="text-muted-foreground border-b border-border">
                  <th className="py-2 pr-3 font-semibold">{t("Étudiant", "Student")}</th>
                  <th className="py-2 pr-3 font-semibold">Silver</th>
                  <th className="py-2 pr-3 font-semibold">Gold</th>
                  <th className="py-2 font-semibold">{t("Blocage", "Blocker")}</th>
                </tr>
              </thead>
              <tbody>
                {(goldRoster ?? []).map((row) => (
                    <tr key={row.userId} className="border-b border-border/60 last:border-0">
                      <td className="py-2 pr-3 font-medium">{row.name ?? row.email}</td>
                      <td className="py-2 pr-3">{row.silverCertified ? "✓" : t("Non obtenue", "Not awarded")}</td>
                      <td className="py-2 pr-3 font-semibold text-amber-800">{row.goldState}</td>
                      <td className="py-2 text-muted-foreground max-w-[280px]">
                        {row.silverCertified
                          ? (row.blockerSummary ?? "—")
                          : (language === "FR" ? row.silverBlockerBannerFr : row.silverBlockerBannerEn) ?? row.blockerSummary ?? "—"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── M3 instructor validation (P0-07) ─────────────────────────────────── */}
      {m3AwaitingValidation.length > 0 && (
        <div className="bg-card border border-emerald-200 rounded-md mb-6 p-4">
          <p className="text-xs font-semibold text-emerald-800 flex items-center gap-2 mb-3">
            <ShieldCheck size={14} />
            {t("Validation Module 3 en attente", "Module 3 validation pending")}
            <span className="text-[10px] font-normal text-muted-foreground">({m3AwaitingValidation.length})</span>
          </p>
          <div className="space-y-2">
            {m3AwaitingValidation.map((row: { progress: { bestScore: number }; user: { id: number; name: string | null } }) => (
              <div key={row.user.id} className="flex items-center justify-between gap-3 py-2 border-t border-border first:border-t-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{row.user.name ?? `User#${row.user.id}`}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {t("M3 réussi", "M3 passed")} · {t("Meilleur score", "Best score")}: {row.progress.bestScore}/100
                  </p>
                </div>
                <button
                  type="button"
                  disabled={validateM3.isPending}
                  onClick={() => validateM3.mutate({ userId: row.user.id, moduleId: 3, validated: true })}
                  className="text-[10px] font-semibold px-3 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {t("Valider M3 → débloquer M4", "Validate M3 → unlock M4")}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Cohort roster (lightweight — avoids 546-run monitor timeout) ── */}
      <div className="bg-card border border-border rounded-md mb-4">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <p className="text-xs font-semibold text-foreground flex items-center gap-2">
            <BarChart2 size={13} />
            {t("Roster de la cohorte", "Cohort roster")}
            <span className="text-[10px] font-normal text-muted-foreground ml-1">
              ({activityError ? t("activité indisponible", "activity unavailable") : `${activity?.evalRunCount ?? 0} ${t("runs éval.", "eval runs")}`})
            </span>
          </p>
          <Link href="/teacher/students" className="text-xs text-[#0070f2] hover:underline flex items-center gap-1">
            {t("Voir tout →", "View all →")}
          </Link>
        </div>

        <div className="divide-y divide-border">
          {studentsLoading && (
            <p className="py-8 text-center text-xs text-muted-foreground">{t("Chargement des étudiants…", "Loading students…")}</p>
          )}
          {studentsError && (
            <p className="py-8 text-center text-xs text-[#bb0000]">{t("Erreur de chargement du roster. Le filtre de cohorte ou le serveur a échoué.", "Roster load error. Cohort filter or server failed.")}</p>
          )}
          {!studentsLoading && !studentsError && recentStudents.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-muted-foreground text-xs mb-2">{t("Aucun étudiant dans cette cohorte", "No students in this cohort")}</p>
            </div>
          )}
          {recentStudents.map((s: { id: number; name: string | null; email: string | null }) => (
            <div key={s.id} className="px-5 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{s.name ?? s.email}</p>
                <p className="text-[10px] text-muted-foreground truncate">{s.email}</p>
              </div>
              <span className="text-[10px] text-muted-foreground">#{s.id}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Demo Mode Banner ─────────────────────────────────────────────────── */}
      <div className="p-4 rounded-md border-2 border-[#5b4b8a] dark:border-purple-500 bg-gradient-to-r from-[#ede7f6] to-[#f3e5f5] dark:from-purple-950/40 dark:to-purple-900/30 flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#5b4b8a] rounded-md flex items-center justify-center shrink-0">
            <MonitorPlay size={20} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#3d1f6e] dark:text-purple-200">
              {t("Mode Démonstration — Simulateur ERP/WMS", "Demonstration Mode — ERP/WMS Simulator")}
            </p>
            <p className="text-xs text-[#5b4b8a] dark:text-purple-300 mt-0.5">
              {t(
                "Lancez le simulateur directement pour vos démonstrations en classe. Score pédagogique affiché en temps réel (non officiel).",
                "Launch the simulator directly for your classroom demonstrations. Pedagogical score displayed in real time (unofficial)."
              )}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/student/scenarios")}
          className="ml-4 px-4 py-2 bg-[#5b4b8a] text-white text-xs font-semibold rounded-md hover:bg-[#4a3a7a] transition-colors shrink-0"
        >
          {t("Démarrer →", "Start →")}
        </button>
      </div>

      {/* ── Module Quick Access ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {moduleQuickAccess.map((mod) => {
          const Icon = mod.icon;
          return (
            <div
              key={mod.id}
              className={`p-4 rounded-md border ${mod.border} ${mod.bg} flex items-center justify-between`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon size={16} className={mod.iconC} />
                <div className="min-w-0">
                  <p className={`text-xs font-semibold ${mod.title} truncate`}>{mod.label}</p>
                  <p className={`text-[10px] ${mod.sub_c} truncate`}>{mod.sub}</p>
                </div>
              </div>
              <button
                onClick={() => navigate(mod.route)}
                className={`text-xs ${mod.btn} hover:underline font-medium ml-3 shrink-0`}
              >
                {t("Accéder →", "Access →")}
              </button>
            </div>
          );
        })}
      </div>
    </FioriShell>
  );
}
