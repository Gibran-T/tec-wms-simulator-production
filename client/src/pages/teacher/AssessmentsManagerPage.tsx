import { useEffect, useMemo, useState } from "react";
import FioriShell from "@/components/FioriShell";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCohort } from "@/contexts/CohortContext";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ClipboardList,
  Users,
  BarChart2,
  Settings,
  RefreshCcw,
  Eye,
  BookOpen,
  AlertTriangle,
  Send,
  Layers,
  FileCheck2,
  Library,
  Lock,
  Unlock,
} from "lucide-react";
import {
  ProfessorPreviewPanel,
  QuestionBankPanel,
} from "./AssessmentPreviewPanel";
import { findReleaseForCohort } from "@shared/assessmentReleaseScope";

/* ─── types ───────────────────────────────────────────────────── */

type TabKey =
  | "overview"
  | "releases"
  | "roster"
  | "analysis"
  | "preview"
  | "correction"
  | "bank";

type Release = {
  id: number;
  assessmentId?: number;
  cohortId: number | null;
  releaseLevel: string;
  opensAt: string | null;
  closesAt: string | null;
  note: string | null;
};

type Assessment = {
  id: number;
  code: string;
  titleFr: string;
  titleEn: string | null;
  status: string;
  modulesCovered: string[] | null;
  durationMinutes: number;
  passingScore: number;
  questionCount: number;
  releases: Release[];
};

const RELEASE_LEVELS = [
  "unpublished",
  "visible_pending",
  "released_cohort",
  "released_students",
  "scheduled",
  "closed",
  "cancelled",
] as const;
type ReleaseLevel = (typeof RELEASE_LEVELS)[number];

const releaseLabelFr: Record<ReleaseLevel, string> = {
  unpublished: "Non publié",
  visible_pending: "Visible — En attente",
  released_cohort: "Libéré (cohorte)",
  released_students: "Libéré (étudiants ciblés)",
  scheduled: "Planifié",
  closed: "Fermé",
  cancelled: "Annulé",
};

function isUntimed(durationMinutes: number | null | undefined) {
  return durationMinutes == null || durationMinutes <= 0;
}

/* ─── ReleaseForm ─────────────────────────────────────────────── */

function ReleaseForm({
  assessment,
  cohortId,
  cohortName,
  studentCount,
  onSaved,
}: {
  assessment: Assessment;
  cohortId: number;
  cohortName: string;
  studentCount: number | null;
  onSaved: () => void;
}) {
  const { t } = useLanguage();

  const scopedRelease = useMemo(() => {
    const rows = (assessment.releases ?? []).map((r) => ({
      ...r,
      assessmentId: r.assessmentId ?? assessment.id,
    }));
    return findReleaseForCohort(rows, assessment.id, cohortId);
  }, [assessment, cohortId]);

  const [releaseLevel, setReleaseLevel] = useState<ReleaseLevel>(
    (scopedRelease?.releaseLevel as ReleaseLevel) ?? "visible_pending"
  );
  const [opensAt, setOpensAt] = useState<string>(
    scopedRelease?.opensAt
      ? new Date(scopedRelease.opensAt).toISOString().slice(0, 16)
      : ""
  );
  const [closesAt, setClosesAt] = useState<string>(
    scopedRelease?.closesAt
      ? new Date(scopedRelease.closesAt).toISOString().slice(0, 16)
      : ""
  );
  const [note, setNote] = useState<string>(scopedRelease?.note ?? "");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);

  useEffect(() => {
    setReleaseLevel(
      (scopedRelease?.releaseLevel as ReleaseLevel) ?? "visible_pending"
    );
    setOpensAt(
      scopedRelease?.opensAt
        ? new Date(scopedRelease.opensAt).toISOString().slice(0, 16)
        : ""
    );
    setClosesAt(
      scopedRelease?.closesAt
        ? new Date(scopedRelease.closesAt).toISOString().slice(0, 16)
        : ""
    );
    setNote(scopedRelease?.note ?? "");
  }, [scopedRelease?.id, scopedRelease?.releaseLevel, cohortId]);

  const upsertMutation = trpc.assessments.professorUpsertRelease.useMutation({
    onSuccess: onSaved,
  });

  function persist(level: ReleaseLevel) {
    upsertMutation.mutate({
      // Never send another cohort's releaseId — server scopes by assessmentId+cohortId.
      releaseId: scopedRelease?.id,
      assessmentId: assessment.id,
      cohortId,
      releaseLevel: level,
      opensAt: opensAt ? new Date(opensAt) : null,
      closesAt: closesAt ? new Date(closesAt) : null,
      note: note || undefined,
    });
  }

  const untimed = isUntimed(assessment.durationMinutes);
  const levelLabel =
    releaseLabelFr[(scopedRelease?.releaseLevel as ReleaseLevel) ?? "unpublished"] ??
    scopedRelease?.releaseLevel ??
    t("Aucune libération", "No release");

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/30 p-4 space-y-2 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{cohortName}</Badge>
          <Badge
            variant={
              scopedRelease?.releaseLevel === "released_cohort"
                ? "default"
                : "secondary"
            }
          >
            {levelLabel}
          </Badge>
          {scopedRelease ? (
            <span className="text-xs text-muted-foreground">
              {t("Libération", "Release")} #{scopedRelease.id}
            </span>
          ) : (
            <span className="text-xs text-amber-700">
              {t(
                "Aucune libération pour cette cohorte — création requise",
                "No release for this cohort — creation required"
              )}
            </span>
          )}
        </div>
        <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
          <li>
            {t("Évaluation", "Assessment")}: {assessment.titleFr}
          </li>
          <li>
            {t("Questions", "Questions")}: {assessment.questionCount} ·{" "}
            {t("Points", "Points")}: 100 · {t("Seuil", "Threshold")}:{" "}
            {assessment.passingScore}%
          </li>
          <li>
            {t("Durée système", "System duration")}:{" "}
            {untimed
              ? t("Sans limite de temps", "No time limit")
              : `${assessment.durationMinutes} min`}
          </li>
          {untimed && (
            <li className="text-foreground">
              {t(
                "Consigne pédagogique (professeur) : 40 minutes — chronométrage en classe, non imposé par le système.",
                "Pedagogical instruction (professor): 40 minutes — classroom timing, not enforced by the system."
              )}
            </li>
          )}
          <li>
            {t("Étudiants de la cohorte", "Cohort students")}:{" "}
            {studentCount ?? "—"}
          </li>
        </ul>
      </div>

      {!scopedRelease && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {t(
              "Préparez une libération spécifique à cette cohorte. Les étudiants verront l’évaluation mais ne pourront pas démarrer tant que vous ne l’aurez pas libérée.",
              "Prepare a release for this cohort. Students will see the assessment but cannot start until you release it."
            )}
          </p>
          <Button
            size="sm"
            onClick={() => persist("visible_pending")}
            disabled={upsertMutation.isPending}
          >
            <Send className="size-4" />
            {upsertMutation.isPending
              ? t("Préparation…", "Preparing…")
              : t("Préparer la libération", "Prepare release")}
          </Button>
        </div>
      )}

      {scopedRelease && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t("Niveau de libération", "Release level")}
              </label>
              <select
                value={releaseLevel}
                onChange={(e) => setReleaseLevel(e.target.value as ReleaseLevel)}
                className="w-full border rounded-md px-3 py-2 text-sm bg-background"
              >
                {RELEASE_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {releaseLabelFr[lvl]}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t("Cohorte", "Cohort")}
              </label>
              <input
                type="text"
                value={`${cohortName} (ID ${cohortId})`}
                readOnly
                className="w-full border rounded-md px-3 py-2 text-sm bg-muted text-muted-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t("Ouverture", "Opens at")}
              </label>
              <input
                type="datetime-local"
                value={opensAt}
                onChange={(e) => setOpensAt(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm bg-background"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t("Fermeture", "Closes at")}
              </label>
              <input
                type="datetime-local"
                value={closesAt}
                onChange={(e) => setClosesAt(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm bg-background"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("Note interne", "Internal note")}
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-none"
              placeholder={t("Note optionnelle…", "Optional note…")}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(scopedRelease.releaseLevel === "visible_pending" ||
              scopedRelease.releaseLevel === "closed" ||
              scopedRelease.releaseLevel === "unpublished") && (
              <Button
                size="sm"
                onClick={() => setConfirmOpen(true)}
                disabled={upsertMutation.isPending}
              >
                <Unlock className="size-4" />
                {t("Libérer pour la cohorte", "Release for cohort")}
              </Button>
            )}
            {scopedRelease.releaseLevel === "released_cohort" && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setConfirmClose(true)}
                disabled={upsertMutation.isPending}
              >
                <Lock className="size-4" />
                {t("Fermer la libération", "Close release")}
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => persist(releaseLevel)}
              disabled={upsertMutation.isPending}
            >
              <Settings className="size-4" />
              {upsertMutation.isPending
                ? t("Enregistrement…", "Saving…")
                : t("Enregistrer la configuration", "Save configuration")}
            </Button>
          </div>
        </>
      )}

      {upsertMutation.isSuccess && (
        <p className="text-xs text-green-600">
          {t("Configuration sauvegardée.", "Configuration saved.")}
        </p>
      )}
      {upsertMutation.isError && (
        <p className="text-xs text-destructive">{upsertMutation.error.message}</p>
      )}

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("Confirmer la libération", "Confirm release")}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  {t(
                    "Vous allez ouvrir l’évaluation pour la cohorte sélectionnée. Les étudiants pourront démarrer immédiatement.",
                    "You are about to open the assessment for the selected cohort. Students will be able to start immediately."
                  )}
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>{assessment.titleFr}</li>
                  <li>{cohortName}</li>
                  <li>
                    {studentCount ?? "—"}{" "}
                    {t("étudiants", "students")}
                  </li>
                  <li>
                    {assessment.questionCount} {t("questions", "questions")} ·
                    100 {t("points", "points")} · {assessment.passingScore}%
                  </li>
                  <li>
                    {t("Durée système", "System duration")}:{" "}
                    {untimed
                      ? t("Sans limite de temps", "No time limit")
                      : `${assessment.durationMinutes} min`}
                  </li>
                  {untimed && (
                    <li>
                      {t(
                        "Consigne pédagogique : 40 minutes (contrôle professeur en classe)",
                        "Pedagogical instruction: 40 minutes (professor classroom control)"
                      )}
                    </li>
                  )}
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("Annuler", "Cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmOpen(false);
                persist("released_cohort");
              }}
            >
              {t("Libérer pour la cohorte", "Release for cohort")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmClose} onOpenChange={setConfirmClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("Fermer la libération ?", "Close the release?")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                "Les étudiants de cette cohorte ne pourront plus démarrer de nouvelle tentative. Les tentatives en cours ne sont pas annulées automatiquement.",
                "Students in this cohort will no longer be able to start a new attempt. In-progress attempts are not automatically cancelled."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("Annuler", "Cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmClose(false);
                persist("closed");
              }}
            >
              {t("Fermer la libération", "Close release")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ─── RosterTable ─────────────────────────────────────────────── */

function RosterTable({
  assessmentId,
  cohortId,
}: {
  assessmentId: number;
  cohortId: number;
}) {
  const { t } = useLanguage();

  const { data: roster, isLoading, refetch } = trpc.assessments.professorRoster.useQuery({
    assessmentId,
    cohortId,
  });

  const authRetakeMutation = trpc.assessments.professorAuthorizeRetake.useMutation({
    onSuccess: () => refetch(),
  });

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground animate-pulse p-4">
        {t("Chargement du registre…", "Loading roster…")}
      </div>
    );
  }

  if (!roster || roster.length === 0) {
    return (
      <div className="text-sm text-muted-foreground p-4 text-center">
        {t("Aucun étudiant dans ce registre.", "No students in this roster.")}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs text-muted-foreground uppercase tracking-wide">
            <th className="pb-2 pr-3">{t("Étudiant", "Student")}</th>
            <th className="pb-2 pr-3">{t("Tentatives", "Attempts")}</th>
            <th className="pb-2 pr-3">{t("Score", "Score")}</th>
            <th className="pb-2 pr-3">{t("Statut", "Status")}</th>
            <th className="pb-2 pr-3">{t("Pratique", "Practical")}</th>
            <th className="pb-2 pr-3">{t("M4", "M4")}</th>
            <th className="pb-2">{t("Actions", "Actions")}</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {roster.map((row) => {
            const latest = row.latestAttempt;
            const score = latest?.finalScore ?? latest?.autoScore ?? null;
            const passed = latest?.passed;
            const status = latest?.status ?? null;
            return (
              <tr key={row.userId} className="hover:bg-muted/30">
                <td className="py-2 pr-3">
                  <div className="font-medium">{row.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {row.studentNumber ?? row.email}
                  </div>
                </td>
                <td className="py-2 pr-3 text-center">{row.attempts.length}</td>
                <td className="py-2 pr-3 font-mono">
                  {score != null ? `${score}%` : "—"}
                </td>
                <td className="py-2 pr-3">
                  {status === null ? (
                    <Badge variant="secondary" className="text-xs">
                      {t("Pas commencé", "Not started")}
                    </Badge>
                  ) : status === "in_progress" ? (
                    <Badge variant="outline" className="text-xs">
                      {t("En cours", "In progress")}
                    </Badge>
                  ) : passed === true ? (
                    <Badge className="bg-green-600 text-white text-xs">
                      {t("Réussi", "Passed")}
                    </Badge>
                  ) : passed === false ? (
                    <Badge variant="destructive" className="text-xs">
                      {t("Échoué", "Failed")}
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      {status}
                    </Badge>
                  )}
                </td>
                <td className="py-2 pr-3 text-xs text-muted-foreground">
                  {row.progress?.practicalValidationStatus ?? "—"}
                </td>
                <td className="py-2 pr-3 text-xs text-muted-foreground">
                  {row.progress?.m4UnlockStatus ?? "—"}
                </td>
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    {latest && (
                      <Link href={`/teacher/evaluations/attempt/${latest.id}`}>
                        <Button variant="ghost" size="icon-sm">
                          <Eye className="size-3.5" />
                        </Button>
                      </Link>
                    )}
                    {passed === false && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title={t("Autoriser reprise", "Authorize retake")}
                        onClick={() =>
                          authRetakeMutation.mutate({
                            assessmentId,
                            userId: row.userId,
                          })
                        }
                        disabled={authRetakeMutation.isPending}
                      >
                        <RefreshCcw className="size-3.5" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ─── AnalysisPanel ───────────────────────────────────────────── */

function AnalysisPanel({
  assessmentId,
  cohortId,
}: {
  assessmentId: number;
  cohortId: number;
}) {
  const { t } = useLanguage();
  const { data, isLoading } = trpc.assessments.professorAnalysis.useQuery({
    assessmentId,
    cohortId,
  });

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground animate-pulse p-4">
        {t("Chargement de l'analyse…", "Loading analysis…")}
      </div>
    );
  }
  if (!data) {
    return (
      <div className="text-sm text-muted-foreground p-4 text-center">
        {t("Données insuffisantes.", "Insufficient data.")}
      </div>
    );
  }

  const { counts, scores, questionStats } = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: t("Soumis", "Submitted"), value: counts.submitted },
          { label: t("Réussi", "Passed"), value: counts.passed },
          { label: t("Échoué", "Failed"), value: counts.failed },
          { label: t("En cours", "In progress"), value: counts.inProgress },
          {
            label: t("Pratique en attente", "Pending practical"),
            value: counts.pendingPractical,
          },
          {
            label: t("Moy.", "Avg."),
            value: scores.average != null ? `${scores.average}%` : "—",
          },
          {
            label: t("Taux réussite", "Pass rate"),
            value:
              scores.passRate != null
                ? `${Math.round(scores.passRate * 100)}%`
                : "—",
          },
          {
            label: t("Médiane", "Median"),
            value: scores.median != null ? `${scores.median}%` : "—",
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-lg border bg-card p-3 space-y-1"
          >
            <p className="text-xs text-muted-foreground">{kpi.label}</p>
            <p className="text-lg font-bold">{kpi.value ?? "—"}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <BookOpen className="size-4" />
          {t("Statistiques par question", "Question statistics")}
        </h3>
        <div className="space-y-2">
          {questionStats.map((q) => (
            <div
              key={q.questionId}
              className={`border rounded-lg px-3 py-2 space-y-1 ${
                q.ambiguityWarning ? "border-amber-300 bg-amber-50" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="outline" className="text-xs">
                    {q.moduleCode}
                  </Badge>
                  <span className="text-muted-foreground truncate max-w-[180px]">
                    {q.code}
                  </span>
                  {q.ambiguityWarning && (
                    <span className="text-amber-600 flex items-center gap-0.5">
                      <AlertTriangle className="size-3" />
                      {t("Ambigu", "Ambiguous")}
                    </span>
                  )}
                </div>
                <span className="text-xs font-mono shrink-0">
                  {q.correct}/{q.answered}{" "}
                  <span className="text-muted-foreground">
                    ({Math.round(q.correctRate * 100)}%)
                  </span>
                </span>
              </div>
              <Progress value={q.correctRate * 100} className="h-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ───────────────────────────────────────────────── */

export default function AssessmentsManagerPage() {
  const { t, language } = useLanguage();
  const { selectedCohortId, selectedCohort, cohorts, isReady } = useCohort();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<
    number | null
  >(null);

  const { data: assessments, isLoading, refetch } =
    trpc.assessments.professorList.useQuery();

  const cohortId = selectedCohortId;
  const cohortName =
    selectedCohort?.name ??
    (cohortId != null
      ? cohorts.find((c) => c.id === cohortId)?.name
      : null) ??
    t("Aucune cohorte sélectionnée", "No cohort selected");

  const selectedAssessment =
    selectedAssessmentId != null
      ? (assessments as Assessment[] | undefined)?.find(
          (a) => a.id === selectedAssessmentId
        )
      : (assessments as Assessment[] | undefined)?.[0] ?? null;

  useEffect(() => {
    if (
      selectedAssessmentId == null &&
      assessments &&
      (assessments as Assessment[]).length > 0
    ) {
      setSelectedAssessmentId((assessments as Assessment[])[0].id);
    }
  }, [assessments, selectedAssessmentId]);

  const { data: rosterForCount } = trpc.assessments.professorRoster.useQuery(
    {
      assessmentId: selectedAssessment?.id ?? 0,
      cohortId: cohortId ?? undefined,
    },
    { enabled: !!selectedAssessment && cohortId != null }
  );
  const studentCount = rosterForCount?.length ?? null;

  const scopedRelease =
    selectedAssessment && cohortId != null
      ? findReleaseForCohort(
          (selectedAssessment.releases ?? []).map((r) => ({
            ...r,
            assessmentId: r.assessmentId ?? selectedAssessment.id,
          })),
          selectedAssessment.id,
          cohortId
        )
      : null;

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    {
      key: "overview",
      label: t("Vue d'ensemble", "Overview"),
      icon: <Layers className="size-4" />,
    },
    {
      key: "preview",
      label: t("Prévisualisation", "Preview"),
      icon: <Eye className="size-4" />,
    },
    {
      key: "correction",
      label: t("Corrigé", "Correction"),
      icon: <FileCheck2 className="size-4" />,
    },
    {
      key: "bank",
      label: t("Banque", "Question Bank"),
      icon: <Library className="size-4" />,
    },
    {
      key: "releases",
      label: t("Libérations", "Releases"),
      icon: <Settings className="size-4" />,
    },
    {
      key: "roster",
      label: t("Registre", "Roster"),
      icon: <Users className="size-4" />,
    },
    {
      key: "analysis",
      label: t("Analyse", "Analysis"),
      icon: <BarChart2 className="size-4" />,
    },
  ];

  return (
    <FioriShell
      title={t("Gestion des Évaluations", "Assessments Manager")}
      breadcrumbs={[
        { label: t("Tableau de bord", "Dashboard"), href: "/teacher" },
        { label: t("Évaluations", "Assessments") },
      ]}
    >
      <div
        className={`mx-auto px-4 py-6 space-y-6 ${
          activeTab === "preview" ||
          activeTab === "correction" ||
          activeTab === "bank"
            ? "max-w-6xl"
            : "max-w-5xl"
        }`}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ClipboardList className="size-6 text-primary" />
              {t("Évaluations intégrées", "Integrated Assessments")}
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {t(
                "Gérez les libérations, suivez les résultats et analysez les performances.",
                "Manage releases, track results and analyze performance."
              )}
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            {isReady
              ? cohortName
              : t("Chargement de la cohorte…", "Loading cohort…")}
          </Badge>
        </div>

        {/* Assessment selector */}
        <div className="flex flex-wrap gap-2">
          {(assessments as Assessment[] | undefined)?.map((a) => (
            <Button
              key={a.id}
              size="sm"
              variant={selectedAssessment?.id === a.id ? "default" : "outline"}
              onClick={() => setSelectedAssessmentId(a.id)}
            >
              {a.code}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1 border-b pb-1">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              size="sm"
              variant={activeTab === tab.key ? "secondary" : "ghost"}
              onClick={() => setActiveTab(tab.key)}
              className="gap-1.5"
            >
              {tab.icon}
              {tab.label}
            </Button>
          ))}
        </div>

        {!selectedAssessment && !isLoading && (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              {t("Aucune évaluation trouvée.", "No assessment found.")}
            </CardContent>
          </Card>
        )}

        {selectedAssessment && cohortId == null && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground text-sm">
              {t(
                "Sélectionnez une cohorte dans le sélecteur en haut de l’écran.",
                "Select a cohort in the top selector."
              )}
            </CardContent>
          </Card>
        )}

        {selectedAssessment && cohortId != null && (
          <>
            {activeTab === "overview" && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {language === "FR"
                        ? selectedAssessment.titleFr
                        : (selectedAssessment.titleEn ??
                          selectedAssessment.titleFr)}
                    </CardTitle>
                    <CardDescription>
                      {t("Code :", "Code:")} {selectedAssessment.code} ·{" "}
                      {cohortName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t("Modules", "Modules")}
                      </p>
                      <p className="font-medium">
                        {selectedAssessment.modulesCovered?.join(", ") ?? "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t("Durée", "Duration")}
                      </p>
                      <p className="font-medium">
                        {isUntimed(selectedAssessment.durationMinutes)
                          ? t("Sans limite de temps", "No time limit")
                          : `${selectedAssessment.durationMinutes} min`}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t("Seuil réussite", "Passing score")}
                      </p>
                      <p className="font-medium">
                        {selectedAssessment.passingScore}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t("Questions", "Questions")}
                      </p>
                      <p className="font-medium">
                        {selectedAssessment.questionCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t("Statut évaluation", "Assessment status")}
                      </p>
                      <Badge
                        variant={
                          selectedAssessment.status === "ready"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {selectedAssessment.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t("Libération (cohorte)", "Release (cohort)")}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {scopedRelease
                          ? releaseLabelFr[
                              scopedRelease.releaseLevel as ReleaseLevel
                            ] ?? scopedRelease.releaseLevel
                          : t("Non configurée", "Not configured")}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t("Étudiants", "Students")}
                      </p>
                      <p className="font-medium">{studentCount ?? "—"}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Settings className="size-4" />
                      {t("Libérations", "Releases")}
                    </CardTitle>
                    <CardDescription>
                      {t(
                        "Toutes les libérations de cette évaluation (toutes cohortes)",
                        "All releases for this assessment (all cohorts)"
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedAssessment.releases.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        {t(
                          "Aucune libération configurée.",
                          "No release configured."
                        )}
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {selectedAssessment.releases.map((rel) => {
                          const cName =
                            cohorts.find((c) => c.id === rel.cohortId)?.name ??
                            `${t("Cohorte", "Cohort")} ${rel.cohortId ?? "—"}`;
                          const highlight = rel.cohortId === cohortId;
                          return (
                            <div
                              key={rel.id}
                              className={`flex flex-wrap items-center gap-3 text-sm rounded-md px-2 py-1.5 ${
                                highlight ? "bg-primary/5 border border-primary/20" : ""
                              }`}
                            >
                              <Badge variant="outline" className="text-xs">
                                {releaseLabelFr[
                                  rel.releaseLevel as ReleaseLevel
                                ] ?? rel.releaseLevel}
                              </Badge>
                              <span
                                className={
                                  highlight
                                    ? "font-medium"
                                    : "text-muted-foreground"
                                }
                              >
                                {cName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                #{rel.id}
                              </span>
                              {rel.note && (
                                <span className="text-xs text-muted-foreground italic">
                                  {rel.note}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "releases" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Settings className="size-4" />
                    {t(
                      "Configuration de la libération",
                      "Release configuration"
                    )}
                  </CardTitle>
                  <CardDescription>
                    {language === "FR"
                      ? selectedAssessment.titleFr
                      : (selectedAssessment.titleEn ??
                        selectedAssessment.titleFr)}{" "}
                    · {cohortName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ReleaseForm
                    assessment={selectedAssessment}
                    cohortId={cohortId}
                    cohortName={cohortName}
                    studentCount={studentCount}
                    onSaved={() => refetch()}
                  />
                </CardContent>
              </Card>
            )}

            {activeTab === "roster" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Users className="size-4" />
                    {t("Registre des étudiants", "Student roster")}
                  </CardTitle>
                  <CardDescription>{cohortName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <RosterTable
                    assessmentId={selectedAssessment.id}
                    cohortId={cohortId}
                  />
                </CardContent>
              </Card>
            )}

            {activeTab === "analysis" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <BarChart2 className="size-4" />
                    {t("Analyse de l'évaluation", "Assessment analysis")}
                  </CardTitle>
                  <CardDescription>{cohortName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <AnalysisPanel
                    assessmentId={selectedAssessment.id}
                    cohortId={cohortId}
                  />
                </CardContent>
              </Card>
            )}

            {activeTab === "preview" && (
              <ProfessorPreviewPanel
                assessmentId={selectedAssessment.id}
                mode="preview"
              />
            )}

            {activeTab === "correction" && (
              <ProfessorPreviewPanel
                assessmentId={selectedAssessment.id}
                mode="correction"
              />
            )}

            {activeTab === "bank" && (
              <QuestionBankPanel assessmentId={selectedAssessment.id} />
            )}
          </>
        )}
      </div>
    </FioriShell>
  );
}
