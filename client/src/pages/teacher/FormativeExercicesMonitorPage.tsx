import { useMemo, useState } from "react";
import FioriShell from "@/components/FioriShell";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCohort } from "@/contexts/CohortContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FORMATIVE_EXERCISE_CATALOG,
  FORMATIVE_EXERCISE_IDS,
  TEACHER_STATUS_LABELS,
  type FormativeExerciseId,
  type TeacherFormativeStatus,
} from "@shared/formativeExercises";
import { RefreshCw, ListChecks } from "lucide-react";

function fmtRate(v: number | null | undefined): string {
  if (v == null || Number.isNaN(v) || !Number.isFinite(v)) return "—";
  return `${v}%`;
}

function statusBadgeClass(status: TeacherFormativeStatus): string {
  switch (status) {
    case "en_cours":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200";
    case "termine":
      return "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200";
  }
}

export default function FormativeExercicesMonitorPage() {
  const { t, language } = useLanguage();
  const { selectedCohortId, cohorts, isReady } = useCohort();
  const [moduleId, setModuleId] = useState<"" | "4" | "5">("");
  const [exerciseId, setExerciseId] = useState<"" | FormativeExerciseId>("");
  const [status, setStatus] = useState<"" | TeacherFormativeStatus>("");
  const [studentQuery, setStudentQuery] = useState("");
  const [detailKey, setDetailKey] = useState<string | null>(null);

  const queryInput =
    selectedCohortId != null
      ? {
          cohortId: selectedCohortId,
          moduleId: moduleId ? (Number(moduleId) as 4 | 5) : undefined,
          exerciseId: exerciseId || undefined,
        }
      : null;

  const { data, isLoading, isError, refetch, isFetching } =
    trpc.formativeExercises.professorRoster.useQuery(queryInput!, {
      enabled: !!queryInput && isReady,
    });

  const exerciseOptions = useMemo(() => {
    return FORMATIVE_EXERCISE_IDS.filter((id) => {
      if (!moduleId) return true;
      return FORMATIVE_EXERCISE_CATALOG[id].moduleId === Number(moduleId);
    });
  }, [moduleId]);

  const filteredRows = useMemo(() => {
    const rows = data?.rows ?? [];
    const q = studentQuery.trim().toLowerCase();
    return rows.filter((row) => {
      if (status && row.status !== status) return false;
      if (!q) return true;
      const hay = `${row.studentName ?? ""} ${row.studentEmail ?? ""} ${row.studentNumber ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [data?.rows, status, studentQuery]);

  const detail = filteredRows.find(
    (r) => `${r.studentUserId}-${r.exerciseId}` === detailKey,
  );
  const cohortName = cohorts.find((c) => c.id === selectedCohortId)?.name;

  return (
    <FioriShell
      title={t("Suivi des exercices formatifs", "Formative exercise monitoring")}
      breadcrumbs={[
        { label: t("Enseignant", "Teacher"), href: "/teacher" },
        { label: t("Exercices", "Exercises") },
      ]}
    >
      <div className="max-w-7xl mx-auto space-y-5" data-testid="formative-teacher-dashboard">
        <header className="space-y-1">
          <div className="flex items-center gap-2">
            <ListChecks className="text-primary" size={22} aria-hidden />
            <h2 className="text-xl font-bold text-foreground">
              {t("Suivi des exercices formatifs", "Formative exercise monitoring")}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {t(
              "Consultez la participation, la complétion et les bonnes réponses des exercices M4 et M5.",
              "Review participation, completion and correct answers for M4 and M5 exercises.",
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            {t(
              "Exercices formatifs — hors moyenne officielle et hors évaluations intégrées.",
              "Formative exercises — outside official average and integrated assessments.",
            )}
          </p>
        </header>

        {!selectedCohortId && (
          <div className="rounded-md border border-amber-200 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm">
            {t("Sélectionnez une cohorte pour afficher les données.", "Select a cohort to display data.")}
          </div>
        )}

        {selectedCohortId && (
          <>
            <div className="flex flex-wrap gap-2 items-end bg-card border rounded-md p-3">
              <label className="text-xs space-y-1">
                <span className="text-muted-foreground">{t("Cohorte", "Cohort")}</span>
                <div className="text-sm font-medium px-2 py-1.5 border rounded-md bg-muted/40 min-w-[140px]">
                  {cohortName ?? selectedCohortId}
                </div>
              </label>
              <label className="text-xs space-y-1">
                <span className="text-muted-foreground">{t("Module", "Module")}</span>
                <select
                  className="block text-sm border rounded-md px-2 py-1.5 bg-background"
                  value={moduleId}
                  onChange={(e) => {
                    setModuleId(e.target.value as "" | "4" | "5");
                    setExerciseId("");
                  }}
                >
                  <option value="">{t("Tous", "All")}</option>
                  <option value="4">M4</option>
                  <option value="5">M5</option>
                </select>
              </label>
              <label className="text-xs space-y-1">
                <span className="text-muted-foreground">{t("Exercice", "Exercise")}</span>
                <select
                  className="block text-sm border rounded-md px-2 py-1.5 bg-background max-w-[260px]"
                  value={exerciseId}
                  onChange={(e) => setExerciseId(e.target.value as "" | FormativeExerciseId)}
                >
                  <option value="">{t("Tous", "All")}</option>
                  {exerciseOptions.map((id) => (
                    <option key={id} value={id}>
                      {language === "FR"
                        ? FORMATIVE_EXERCISE_CATALOG[id].title.fr
                        : FORMATIVE_EXERCISE_CATALOG[id].title.en}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs space-y-1">
                <span className="text-muted-foreground">{t("Statut", "Status")}</span>
                <select
                  className="block text-sm border rounded-md px-2 py-1.5 bg-background"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "" | TeacherFormativeStatus)}
                >
                  <option value="">{t("Tous", "All")}</option>
                  {(Object.keys(TEACHER_STATUS_LABELS) as TeacherFormativeStatus[]).map((key) => (
                    <option key={key} value={key}>
                      {language === "FR"
                        ? TEACHER_STATUS_LABELS[key].fr
                        : TEACHER_STATUS_LABELS[key].en}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs space-y-1 flex-1 min-w-[160px]">
                <span className="text-muted-foreground">{t("Étudiant", "Student")}</span>
                <Input
                  value={studentQuery}
                  onChange={(e) => setStudentQuery(e.target.value)}
                  placeholder={t("Nom, courriel, n°…", "Name, email, #…")}
                  className="h-9"
                />
              </label>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
                {t("Actualiser", "Refresh")}
              </Button>
            </div>

            {data && !data.tableAvailable && (
              <div className="rounded-md border border-amber-200 bg-amber-50 dark:bg-amber-900/20 p-3 text-xs text-amber-900 dark:text-amber-100">
                {t(
                  "Table formative_exercise_attempts indisponible (migration 0019 non appliquée). Les étudiants apparaissent en Non commencé.",
                  "formative_exercise_attempts table unavailable (migration 0019 not applied). Students appear as Not started.",
                )}
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
              {[
                {
                  label: t("Élèves inscrits (paires)", "Enrolled (pairs)"),
                  value: data?.summary.enrolled ?? "—",
                },
                {
                  label: t("Ont commencé", "Started"),
                  value: data?.summary.started ?? "—",
                },
                {
                  label: t("Ont terminé", "Completed"),
                  value: data?.summary.completed ?? "—",
                },
                {
                  label: t("Taux de participation", "Participation rate"),
                  value: fmtRate(data?.summary.participationRate),
                  hint: t(
                    "Élèves avec enregistrement ÷ inscrits éligibles",
                    "Students with a record ÷ eligible enrolled",
                  ),
                },
                {
                  label: t("Taux de complétion", "Completion rate"),
                  value: fmtRate(data?.summary.completionRate),
                  hint: t(
                    "Élèves ayant terminé ÷ inscrits éligibles",
                    "Students who completed ÷ eligible enrolled",
                  ),
                },
                {
                  label: t("Taux de bonnes réponses", "Correct-answer rate"),
                  value: fmtRate(data?.summary.correctAnswerRate),
                  hint: t(
                    "Bonnes réponses ÷ réponses soumises",
                    "Correct answers ÷ submitted answers",
                  ),
                },
              ].map((card) => (
                <div key={card.label} className="bg-card border rounded-md p-3">
                  <p className="text-[11px] text-muted-foreground">{card.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{card.value}</p>
                  {"hint" in card && card.hint ? (
                    <p className="text-[10px] text-muted-foreground mt-1">{card.hint}</p>
                  ) : null}
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {t(
                "Statuts neutres : Non commencé · En cours · Terminé. Une ligne active par élève et exercice (nouvelle exécution écrase l’état précédent). Pas de seuil d’approbation.",
                "Neutral statuses: Not started · In progress · Completed. One active row per student and exercise (new run overwrites previous state). No pass threshold.",
              )}
            </p>

            {isLoading && (
              <div className="py-12 text-center text-sm text-muted-foreground">
                {t("Chargement…", "Loading…")}
              </div>
            )}
            {isError && (
              <div className="rounded-md border border-red-200 bg-red-50 dark:bg-red-900/20 p-4 text-sm">
                {t("Erreur au chargement des données.", "Error loading data.")}
              </div>
            )}

            {!isLoading && !isError && filteredRows.length === 0 && (
              <div
                className="rounded-md border bg-card p-8 text-center text-sm text-muted-foreground"
                data-testid="formative-teacher-empty"
              >
                {t(
                  "Aucun enregistrement pour ces filtres. Les élèves sans activité apparaissent en Non commencé lorsque la cohorte est sélectionnée sans filtre restrictif.",
                  "No records for these filters. Students without activity appear as Not started when the cohort is selected without a restrictive filter.",
                )}
              </div>
            )}

            {filteredRows.length > 0 && (
              <div className="overflow-x-auto rounded-md border bg-card">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2">{t("Étudiant", "Student")}</th>
                      <th className="px-3 py-2">{t("Cohorte", "Cohort")}</th>
                      <th className="px-3 py-2">{t("Module", "Module")}</th>
                      <th className="px-3 py-2">{t("Exercice", "Exercise")}</th>
                      <th className="px-3 py-2">{t("Statut", "Status")}</th>
                      <th className="px-3 py-2">{t("Bonnes", "Correct")}</th>
                      <th className="px-3 py-2">{t("Soumises", "Submitted")}</th>
                      <th className="px-3 py-2">{t("% bonnes", "% correct")}</th>
                      <th className="px-3 py-2">{t("Résultat %", "Score %")}</th>
                      <th className="px-3 py-2">{t("Dernière activité", "Last activity")}</th>
                      <th className="px-3 py-2">{t("Action", "Action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((row) => {
                      const key = `${row.studentUserId}-${row.exerciseId}`;
                      const statusLabel =
                        language === "FR"
                          ? TEACHER_STATUS_LABELS[row.status].fr
                          : TEACHER_STATUS_LABELS[row.status].en;
                      return (
                        <tr key={key} className="border-t">
                          <td className="px-3 py-2">
                            <div className="font-medium">{row.studentName || row.studentEmail}</div>
                            <div className="text-[11px] text-muted-foreground">{row.studentEmail}</div>
                          </td>
                          <td className="px-3 py-2">{cohortName ?? row.cohortId}</td>
                          <td className="px-3 py-2">M{row.moduleId}</td>
                          <td className="px-3 py-2 max-w-[220px]">
                            <span className="line-clamp-2">
                              {language === "FR" ? row.exerciseTitleFr : row.exerciseTitleEn}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            <span className={`text-[11px] font-semibold px-2 py-1 rounded-md ${statusBadgeClass(row.status)}`}>
                              {statusLabel}
                            </span>
                          </td>
                          <td className="px-3 py-2">{row.correctAnswers}</td>
                          <td className="px-3 py-2">{row.submittedAnswers}</td>
                          <td className="px-3 py-2">{fmtRate(row.correctAnswerRate)}</td>
                          <td className="px-3 py-2">
                            {row.formativeScore != null ? `${row.formativeScore}%` : "—"}
                          </td>
                          <td className="px-3 py-2 text-xs text-muted-foreground">
                            {row.lastUpdatedAt
                              ? new Date(row.lastUpdatedAt).toLocaleString(language === "FR" ? "fr-CA" : "en-CA")
                              : "—"}
                          </td>
                          <td className="px-3 py-2">
                            <Button size="sm" variant="outline" onClick={() => setDetailKey(key)}>
                              {t("Détail", "Detail")}
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {detail && (
          <div
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={t("Détail étudiant", "Student detail")}
            onClick={() => setDetailKey(null)}
          >
            <div
              className="bg-card border rounded-lg shadow-xl max-w-lg w-full p-5 space-y-3"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-base font-semibold">
                {detail.studentName || detail.studentEmail}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === "FR" ? detail.exerciseTitleFr : detail.exerciseTitleEn}
              </p>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">{t("Statut", "Status")}</dt>
                  <dd>
                    {language === "FR"
                      ? TEACHER_STATUS_LABELS[detail.status].fr
                      : TEACHER_STATUS_LABELS[detail.status].en}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">{t("Résultat formatif %", "Formative result %")}</dt>
                  <dd>{detail.formativeScore != null ? `${detail.formativeScore}%` : "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">{t("Bonnes réponses", "Correct answers")}</dt>
                  <dd>{detail.correctAnswers}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">{t("Réponses soumises", "Submitted answers")}</dt>
                  <dd>{detail.submittedAnswers}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">{t("Début", "Started")}</dt>
                  <dd className="text-xs">
                    {detail.startedAt
                      ? new Date(detail.startedAt).toLocaleString(language === "FR" ? "fr-CA" : "en-CA")
                      : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">{t("Dernière activité", "Last activity")}</dt>
                  <dd className="text-xs">
                    {detail.lastUpdatedAt
                      ? new Date(detail.lastUpdatedAt).toLocaleString(language === "FR" ? "fr-CA" : "en-CA")
                      : "—"}
                  </dd>
                </div>
              </dl>
              <p className="text-[11px] text-muted-foreground">
                {t(
                  "État actuellement persisté uniquement : une nouvelle exécution remplace le résultat précédent (pas d’historique multi-tentatives).",
                  "Currently persisted state only: a new run replaces the previous result (no multi-attempt history).",
                )}
              </p>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setDetailKey(null)}>
                  {t("Fermer", "Close")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </FioriShell>
  );
}
