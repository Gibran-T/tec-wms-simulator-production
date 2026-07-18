import { useState } from "react";
import FioriShell from "@/components/FioriShell";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
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
  ClipboardList,
  Users,
  BarChart2,
  Settings,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCcw,
  Eye,
  BookOpen,
  AlertTriangle,
  Send,
  ShieldCheck,
  Layers,
} from "lucide-react";

/* ─── types ───────────────────────────────────────────────────── */

type TabKey = "overview" | "releases" | "roster" | "analysis";

type Release = {
  id: number;
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

/* ─── ReleaseForm ─────────────────────────────────────────────── */

function ReleaseForm({
  assessment,
  onSaved,
}: {
  assessment: Assessment;
  onSaved: () => void;
}) {
  const { t } = useLanguage();
  const existingRelease = assessment.releases[0] ?? null;

  const [releaseId] = useState<number | undefined>(existingRelease?.id);
  const [releaseLevel, setReleaseLevel] = useState<ReleaseLevel>(
    (existingRelease?.releaseLevel as ReleaseLevel) ?? "unpublished"
  );
  const [cohortId, setCohortId] = useState<number>(
    existingRelease?.cohortId ?? 3
  );
  const [opensAt, setOpensAt] = useState<string>(
    existingRelease?.opensAt
      ? new Date(existingRelease.opensAt).toISOString().slice(0, 16)
      : ""
  );
  const [closesAt, setClosesAt] = useState<string>(
    existingRelease?.closesAt
      ? new Date(existingRelease.closesAt).toISOString().slice(0, 16)
      : ""
  );
  const [note, setNote] = useState<string>(existingRelease?.note ?? "");

  const upsertMutation = trpc.assessments.professorUpsertRelease.useMutation({
    onSuccess: onSaved,
  });

  function handleSave() {
    upsertMutation.mutate({
      releaseId,
      assessmentId: assessment.id,
      cohortId: cohortId || null,
      releaseLevel,
      opensAt: opensAt ? new Date(opensAt) : null,
      closesAt: closesAt ? new Date(closesAt) : null,
      note: note || undefined,
    });
  }

  return (
    <div className="space-y-4">
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
            {t("Cohorte (ID)", "Cohort (ID)")}
          </label>
          <input
            type="number"
            value={cohortId}
            onChange={(e) => setCohortId(Number(e.target.value))}
            className="w-full border rounded-md px-3 py-2 text-sm bg-background"
            placeholder="3"
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
      <Button
        size="sm"
        onClick={handleSave}
        disabled={upsertMutation.isPending}
      >
        <Send className="size-4" />
        {upsertMutation.isPending
          ? t("Enregistrement…", "Saving…")
          : t("Enregistrer la configuration", "Save configuration")}
      </Button>
      {upsertMutation.isSuccess && (
        <p className="text-xs text-green-600">{t("Configuration sauvegardée.", "Configuration saved.")}</p>
      )}
      {upsertMutation.isError && (
        <p className="text-xs text-destructive">{upsertMutation.error.message}</p>
      )}
    </div>
  );
}

/* ─── RosterTable ─────────────────────────────────────────────── */

function RosterTable({ assessmentId }: { assessmentId: number }) {
  const { t } = useLanguage();

  const { data: roster, isLoading, refetch } = trpc.assessments.professorRoster.useQuery({
    assessmentId,
    cohortId: 3,
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
                <td className="py-2 pr-3 text-center">
                  {row.attempts.length}
                </td>
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
                      <Link
                        href={`/teacher/evaluations/attempt/${latest.id}`}
                      >
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

function AnalysisPanel({ assessmentId }: { assessmentId: number }) {
  const { t } = useLanguage();
  const { data, isLoading } = trpc.assessments.professorAnalysis.useQuery({
    assessmentId,
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
      {/* KPI grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: t("Soumis", "Submitted"), value: counts.submitted },
          { label: t("Réussi", "Passed"), value: counts.passed },
          { label: t("Échoué", "Failed"), value: counts.failed },
          { label: t("En cours", "In progress"), value: counts.inProgress },
          { label: t("Pratique en attente", "Pending practical"), value: counts.pendingPractical },
          { label: t("Moy.", "Avg."), value: scores.average != null ? `${scores.average}%` : "—" },
          { label: t("Taux réussite", "Pass rate"), value: scores.passRate != null ? `${Math.round(scores.passRate * 100)}%` : "—" },
          { label: t("Médiane", "Median"), value: scores.median != null ? `${scores.median}%` : "—" },
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

      {/* Question stats */}
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
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<
    number | null
  >(null);

  const { data: assessments, isLoading, refetch } = trpc.assessments.professorList.useQuery();

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "overview", label: t("Vue d'ensemble", "Overview"), icon: <Layers className="size-4" /> },
    { key: "releases", label: t("Libérations", "Releases"), icon: <Settings className="size-4" /> },
    { key: "roster", label: t("Registre", "Roster"), icon: <Users className="size-4" /> },
    { key: "analysis", label: t("Analyse", "Analysis"), icon: <BarChart2 className="size-4" /> },
  ];

  const selectedAssessment =
    selectedAssessmentId != null
      ? (assessments as Assessment[] | undefined)?.find(
          (a) => a.id === selectedAssessmentId
        )
      : (assessments as Assessment[] | undefined)?.[0] ?? null;

  // Auto-select first assessment
  if (!selectedAssessmentId && assessments && assessments.length > 0 && !selectedAssessmentId) {
    setSelectedAssessmentId((assessments as Assessment[])[0].id);
  }

  return (
    <FioriShell
      title={t("Gestion des Évaluations", "Assessments Manager")}
      breadcrumbs={[
        { label: t("Tableau de bord", "Dashboard"), href: "/teacher" },
        { label: t("Évaluations", "Assessments") },
      ]}
    >
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Page header */}
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
        </div>

        {/* Assessment selector */}
        {isLoading && (
          <div className="h-12 rounded-lg bg-muted animate-pulse" />
        )}
        {!isLoading && assessments && (assessments as Assessment[]).length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {(assessments as Assessment[]).map((a) => (
              <button
                key={a.id}
                onClick={() => setSelectedAssessmentId(a.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  selectedAssessmentId === a.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background hover:bg-muted/50"
                }`}
              >
                {language === "FR" ? a.titleFr : (a.titleEn ?? a.titleFr)}
              </button>
            ))}
          </div>
        )}

        {/* Tab nav */}
        <div className="flex gap-1 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {!selectedAssessment && !isLoading && (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              {t("Aucune évaluation trouvée.", "No assessment found.")}
            </CardContent>
          </Card>
        )}

        {selectedAssessment && (
          <>
            {/* Overview */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {language === "FR"
                        ? selectedAssessment.titleFr
                        : (selectedAssessment.titleEn ?? selectedAssessment.titleFr)}
                    </CardTitle>
                    <CardDescription>
                      {t("Code :", "Code:")} {selectedAssessment.code}
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
                        {selectedAssessment.durationMinutes} min
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t("Seuil réussite", "Passing score")}
                      </p>
                      <p className="font-medium">{selectedAssessment.passingScore}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t("Questions", "Questions")}
                      </p>
                      <p className="font-medium">{selectedAssessment.questionCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t("Statut", "Status")}
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
                  </CardContent>
                </Card>

                {/* Current releases */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Settings className="size-4" />
                      {t("Libérations actives", "Active releases")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedAssessment.releases.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        {t("Aucune libération configurée.", "No release configured.")}
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {selectedAssessment.releases.map((rel) => (
                          <div
                            key={rel.id}
                            className="flex items-center gap-3 text-sm"
                          >
                            <Badge variant="outline" className="text-xs">
                              {releaseLabelFr[rel.releaseLevel as ReleaseLevel] ?? rel.releaseLevel}
                            </Badge>
                            <span className="text-muted-foreground">
                              {t("Cohorte", "Cohort")} {rel.cohortId ?? "—"}
                            </span>
                            {rel.opensAt && (
                              <span className="text-muted-foreground text-xs">
                                {t("Ouv.:", "Opens:")} {new Date(rel.opensAt).toLocaleDateString("fr-CA")}
                              </span>
                            )}
                            {rel.note && (
                              <span className="text-xs text-muted-foreground italic">
                                {rel.note}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Releases */}
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
                      : (selectedAssessment.titleEn ?? selectedAssessment.titleFr)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ReleaseForm
                    assessment={selectedAssessment}
                    onSaved={() => refetch()}
                  />
                </CardContent>
              </Card>
            )}

            {/* Roster */}
            {activeTab === "roster" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Users className="size-4" />
                    {t("Registre des étudiants", "Student roster")}
                  </CardTitle>
                  <CardDescription>
                    {t("Cohorte B (ID 3)", "Cohort B (ID 3)")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RosterTable assessmentId={selectedAssessment.id} />
                </CardContent>
              </Card>
            )}

            {/* Analysis */}
            {activeTab === "analysis" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <BarChart2 className="size-4" />
                    {t("Analyse de l'évaluation", "Assessment analysis")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AnalysisPanel assessmentId={selectedAssessment.id} />
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </FioriShell>
  );
}
