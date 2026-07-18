import { useState } from "react";
import FioriShell from "@/components/FioriShell";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  CheckCircle2,
  XCircle,
  ChevronLeft,
  RefreshCcw,
  ShieldCheck,
  AlertTriangle,
  ClipboardList,
  User,
  Clock,
  RotateCcw,
  Ban,
  History,
  Send,
} from "lucide-react";

/* ─── helpers ────────────────────────────────────────────────── */

function fmtDate(d: string | Date | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleString("fr-CA", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

type AuditRow = {
  id: number;
  previousScore: number | null;
  updatedScore: number | null;
  reason: string | null;
  createdAt: string | Date;
  detailsJson: unknown;
};

type QuestionRow = {
  id: number;
  code: string;
  moduleCode: string;
  competency: string;
  promptFr: string;
  promptEn?: string | null;
  points: number;
  correctOptionId: string;
  explanationFr?: string | null;
  explanationEn?: string | null;
  optionsDisplayed: Array<{ id: string; fr: string; en?: string }>;
  selectedOptionId: string | null;
  isCorrect: boolean;
  annulled: boolean;
};

/* ─── RecalcForm ──────────────────────────────────────────────── */

function RecalcForm({
  attemptId,
  questions,
  onDone,
}: {
  attemptId: number;
  questions: QuestionRow[];
  onDone: () => void;
}) {
  const { t } = useLanguage();
  const [reason, setReason] = useState("");
  const [annulIds, setAnnulIds] = useState<Set<number>>(new Set());

  const mutation = trpc.assessments.professorRecalculate.useMutation({
    onSuccess: onDone,
  });

  function toggleAnnul(id: number) {
    setAnnulIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {t(
          "Sélectionnez les questions à annuler (elles seront exclues du calcul), puis saisissez un motif.",
          "Select questions to annul (they will be excluded from the score), then enter a reason."
        )}
      </p>
      <div className="space-y-1 max-h-48 overflow-y-auto border rounded-md p-2">
        {questions.map((q) => (
          <label
            key={q.id}
            className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/30 px-2 py-1 rounded"
          >
            <input
              type="checkbox"
              checked={annulIds.has(q.id)}
              onChange={() => toggleAnnul(q.id)}
              className="shrink-0"
            />
            <span className="truncate">
              <span className="font-mono text-xs text-muted-foreground mr-1">
                {q.code}
              </span>
              {q.promptFr.slice(0, 80)}…
            </span>
          </label>
        ))}
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {t("Motif (requis)", "Reason (required)")}
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={2}
          className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-none"
          placeholder={t("Ex: Question erronée Q-M1-01…", "E.g. Erroneous question Q-M1-01…")}
        />
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() =>
            mutation.mutate({
              attemptId,
              reason,
              annulQuestionIds: Array.from(annulIds),
            })
          }
          disabled={reason.trim().length < 3 || mutation.isPending}
        >
          <Send className="size-4" />
          {mutation.isPending
            ? t("Recalcul…", "Recalculating…")
            : t("Recalculer", "Recalculate")}
        </Button>
        {mutation.isSuccess && (
          <span className="text-xs text-green-600 self-center">
            {t("Recalcul effectué.", "Recalculation done.")}
          </span>
        )}
      </div>
      {mutation.isError && (
        <p className="text-xs text-destructive">{mutation.error.message}</p>
      )}
    </div>
  );
}

/* ─── PracticalForm ───────────────────────────────────────────── */

function PracticalForm({
  assessmentId,
  userId,
  cohortId,
  onDone,
}: {
  assessmentId: number;
  userId: number;
  cohortId: number | null;
  onDone: () => void;
}) {
  const { t } = useLanguage();
  const [task, setTask] = useState("");
  const [result, setResult] = useState("");
  const [note, setNote] = useState("");

  const mutation = trpc.assessments.professorRecordPractical.useMutation({
    onSuccess: onDone,
  });

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {t("Tâche pratique réalisée", "Practical task performed")}
        </label>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm bg-background"
          placeholder={t("Ex: Réception d'une commande fournisseur…", "E.g. Receiving a supplier order…")}
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {t("Résultat observé", "Observed result")}
        </label>
        <input
          type="text"
          value={result}
          onChange={(e) => setResult(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm bg-background"
          placeholder={t("Ex: Conforme, sans erreur de localisation.", "E.g. Compliant, no location error.")}
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {t("Note interne", "Internal note")}
        </label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm bg-background"
          placeholder={t("Optionnel", "Optional")}
        />
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() =>
            mutation.mutate({
              assessmentId,
              userId,
              cohortId,
              taskFr: task,
              resultFr: result,
              note: note || undefined,
            })
          }
          disabled={!task || !result || mutation.isPending}
        >
          <ShieldCheck className="size-4" />
          {mutation.isPending
            ? t("Enregistrement…", "Saving…")
            : t("Enregistrer l'évidence", "Record evidence")}
        </Button>
        {mutation.isSuccess && (
          <span className="text-xs text-green-600 self-center">
            {t("Évidence enregistrée.", "Evidence recorded.")}
          </span>
        )}
      </div>
      {mutation.isError && (
        <p className="text-xs text-destructive">{mutation.error.message}</p>
      )}
    </div>
  );
}

/* ─── RetakeForm ──────────────────────────────────────────────── */

function RetakeForm({
  assessmentId,
  userId,
  onDone,
}: {
  assessmentId: number;
  userId: number;
  onDone: () => void;
}) {
  const { t } = useLanguage();
  const [opensAt, setOpensAt] = useState("");
  const [closesAt, setClosesAt] = useState("");
  const [note, setNote] = useState("");

  const mutation = trpc.assessments.professorAuthorizeRetake.useMutation({
    onSuccess: onDone,
  });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
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
          {t("Note", "Note")}
        </label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm bg-background"
          placeholder={t("Optionnel", "Optional")}
        />
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() =>
            mutation.mutate({
              assessmentId,
              userId,
              opensAt: opensAt ? new Date(opensAt) : null,
              closesAt: closesAt ? new Date(closesAt) : null,
              note: note || undefined,
            })
          }
          disabled={mutation.isPending}
        >
          <RotateCcw className="size-4" />
          {mutation.isPending
            ? t("Autorisation…", "Authorizing…")
            : t("Autoriser la reprise", "Authorize retake")}
        </Button>
        {mutation.isSuccess && (
          <span className="text-xs text-green-600 self-center">
            {t("Reprise autorisée.", "Retake authorized.")}
          </span>
        )}
      </div>
      {mutation.isError && (
        <p className="text-xs text-destructive">{mutation.error.message}</p>
      )}
    </div>
  );
}

/* ─── Main page ───────────────────────────────────────────────── */

type ActionPanel = "none" | "recalc" | "practical" | "retake";

export default function AssessmentAttemptReviewPage() {
  const { attemptId: attemptIdStr } = useParams<{ attemptId: string }>();
  const attemptId = Number(attemptIdStr);
  const { t, language } = useLanguage();

  const [actionPanel, setActionPanel] = useState<ActionPanel>("none");

  const { data, isLoading, refetch } = trpc.assessments.professorAttemptDetail.useQuery(
    { attemptId },
    { enabled: !isNaN(attemptId) }
  );

  const confirmMutation = trpc.assessments.professorConfirmResult.useMutation({
    onSuccess: () => refetch(),
  });

  if (isNaN(attemptId)) {
    return (
      <FioriShell title={t("Revue de tentative", "Attempt Review")} breadcrumbs={[]}>
        <div className="p-8 text-center text-destructive">
          {t("Identifiant invalide.", "Invalid ID.")}
        </div>
      </FioriShell>
    );
  }

  if (isLoading) {
    return (
      <FioriShell title={t("Revue de tentative", "Attempt Review")} breadcrumbs={[]}>
        <div className="p-8 text-center text-muted-foreground animate-pulse">
          {t("Chargement…", "Loading…")}
        </div>
      </FioriShell>
    );
  }

  if (!data) {
    return (
      <FioriShell title={t("Revue de tentative", "Attempt Review")} breadcrumbs={[]}>
        <div className="p-8 text-center text-destructive">
          {t("Tentative introuvable.", "Attempt not found.")}
        </div>
      </FioriShell>
    );
  }

  const { attempt, assessment, student, questions, audits } = data as {
    attempt: {
      id: number;
      assessmentId: number;
      attemptNumber: number;
      status: string;
      startedAt: string | Date;
      submittedAt: string | Date | null;
      durationSeconds: number | null;
      autoScore: number | null;
      finalScore: number | null;
      passed: boolean | null;
      m4UnlockStatus: string | null;
      practicalValidationStatus: string | null;
      professorReviewStatus: string | null;
    };
    assessment: {
      id: number;
      titleFr: string;
      titleEn: string | null;
      passingScore: number;
    };
    student: {
      userId: number;
      name: string | null;
      email: string | null;
      studentNumber: string | null;
      cohortId: number | null;
      isDemo: boolean;
    };
    questions: QuestionRow[];
    audits: AuditRow[];
  };

  const assessmentTitle =
    language === "FR"
      ? assessment.titleFr
      : (assessment.titleEn ?? assessment.titleFr);

  const score = attempt.finalScore ?? attempt.autoScore ?? 0;
  const isSubmitted =
    attempt.status === "submitted" || attempt.status === "expired_submitted";

  return (
    <FioriShell
      title={t("Revue — Tentative", "Attempt Review")}
      breadcrumbs={[
        { label: t("Évaluations", "Assessments"), href: "/teacher/evaluations" },
        { label: t("Revue", "Review") },
      ]}
    >
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Link href="/teacher/evaluations">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="size-4" />
                  {t("Retour", "Back")}
                </Button>
              </Link>
              <Badge
                variant={attempt.passed ? "default" : attempt.passed === false ? "destructive" : "secondary"}
                className="text-xs"
              >
                {attempt.passed === true
                  ? t("Réussi", "Passed")
                  : attempt.passed === false
                  ? t("Échoué", "Failed")
                  : t("En cours", "In progress")}
              </Badge>
              {attempt.professorReviewStatus && attempt.professorReviewStatus !== "pending" && (
                <Badge variant="outline" className="text-xs">
                  {attempt.professorReviewStatus}
                </Badge>
              )}
            </div>
            <h1 className="text-xl font-bold">{assessmentTitle}</h1>
            <p className="text-sm text-muted-foreground">
              {t("Tentative n°", "Attempt #")}{attempt.attemptNumber}
            </p>
          </div>
          <div className={`text-3xl font-bold ${attempt.passed ? "text-green-600" : attempt.passed === false ? "text-red-600" : "text-muted-foreground"}`}>
            {isSubmitted ? `${score}%` : "—"}
          </div>
        </div>

        {/* Student + attempt meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-5 pb-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <User className="size-4 text-muted-foreground" />
                {student.name ?? "—"}
                {student.isDemo && (
                  <Badge variant="secondary" className="text-xs">
                    Demo
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{student.email}</p>
              {student.studentNumber && (
                <p className="text-xs text-muted-foreground">
                  #{student.studentNumber}
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="size-4" />
                {t("Commencé :", "Started:")} {fmtDate(attempt.startedAt)}
              </div>
              {attempt.submittedAt && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="size-4" />
                  {t("Soumis :", "Submitted:")} {fmtDate(attempt.submittedAt)}
                </div>
              )}
              {attempt.durationSeconds != null && (
                <div className="text-muted-foreground">
                  {t("Durée :", "Duration:")} {Math.floor(attempt.durationSeconds / 60)}m{" "}
                  {attempt.durationSeconds % 60}s
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action buttons */}
        {isSubmitted && (
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                confirmMutation.mutate({ attemptId, note: undefined })
              }
              disabled={
                confirmMutation.isPending ||
                attempt.professorReviewStatus === "confirmed"
              }
            >
              <CheckCircle2 className="size-4" />
              {attempt.professorReviewStatus === "confirmed"
                ? t("Résultat confirmé", "Result confirmed")
                : t("Confirmer le résultat", "Confirm result")}
            </Button>
            <Button
              size="sm"
              variant={actionPanel === "recalc" ? "default" : "outline"}
              onClick={() =>
                setActionPanel((p) => (p === "recalc" ? "none" : "recalc"))
              }
            >
              <Ban className="size-4" />
              {t("Annuler questions / Recalculer", "Annul questions / Recalculate")}
            </Button>
            <Button
              size="sm"
              variant={actionPanel === "practical" ? "default" : "outline"}
              onClick={() =>
                setActionPanel((p) =>
                  p === "practical" ? "none" : "practical"
                )
              }
            >
              <ShieldCheck className="size-4" />
              {t("Évidence pratique", "Practical evidence")}
            </Button>
            <Button
              size="sm"
              variant={actionPanel === "retake" ? "default" : "outline"}
              onClick={() =>
                setActionPanel((p) => (p === "retake" ? "none" : "retake"))
              }
            >
              <RotateCcw className="size-4" />
              {t("Autoriser reprise", "Authorize retake")}
            </Button>
          </div>
        )}

        {/* Action panels */}
        {actionPanel === "recalc" && (
          <Card className="border-amber-300">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Ban className="size-4 text-amber-600" />
                {t("Annulation de questions & recalcul", "Annul questions & recalculate")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RecalcForm
                attemptId={attemptId}
                questions={questions as QuestionRow[]}
                onDone={() => {
                  setActionPanel("none");
                  refetch();
                }}
              />
            </CardContent>
          </Card>
        )}
        {actionPanel === "practical" && (
          <Card className="border-blue-300">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <ShieldCheck className="size-4 text-blue-600" />
                {t("Enregistrer une évidence pratique", "Record practical evidence")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PracticalForm
                assessmentId={assessment.id}
                userId={student.userId}
                cohortId={student.cohortId}
                onDone={() => {
                  setActionPanel("none");
                  refetch();
                }}
              />
            </CardContent>
          </Card>
        )}
        {actionPanel === "retake" && (
          <Card className="border-purple-300">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <RotateCcw className="size-4 text-purple-600" />
                {t("Autoriser une reprise", "Authorize retake")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RetakeForm
                assessmentId={assessment.id}
                userId={student.userId}
                onDone={() => {
                  setActionPanel("none");
                  refetch();
                }}
              />
            </CardContent>
          </Card>
        )}

        {/* Full question review */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ClipboardList className="size-4" />
              {t("Revue complète des questions", "Full question review")}
              <span className="ml-auto font-normal text-muted-foreground">
                {questions.filter((q) => q.isCorrect).length} / {questions.length}{" "}
                {t("correct", "correct")}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(questions as QuestionRow[]).map((q, idx) => {
              const isCorrect = q.isCorrect;
              return (
                <div
                  key={q.id}
                  className={`border rounded-lg p-4 space-y-3 ${
                    q.annulled
                      ? "opacity-50 border-dashed"
                      : isCorrect
                      ? "border-green-200 bg-green-50/50"
                      : "border-red-200 bg-red-50/50"
                  }`}
                >
                  {/* Question header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono text-muted-foreground">
                          Q{idx + 1} — {q.code}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {q.moduleCode}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {q.competency}
                        </Badge>
                        {q.annulled && (
                          <Badge variant="destructive" className="text-xs">
                            {t("Annulée", "Annulled")}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium leading-snug">
                        {language === "FR" ? q.promptFr : (q.promptEn ?? q.promptFr)}
                      </p>
                    </div>
                    <div className="shrink-0">
                      {isCorrect ? (
                        <CheckCircle2 className="size-5 text-green-600" />
                      ) : (
                        <XCircle className="size-5 text-red-600" />
                      )}
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-1.5">
                    {(q.optionsDisplayed ?? []).map(
                      (opt: { id: string; fr: string; en?: string }) => {
                        const isSelected = opt.id === q.selectedOptionId;
                        const isCorrectOpt = opt.id === q.correctOptionId;
                        return (
                          <div
                            key={opt.id}
                            className={`text-sm px-3 py-1.5 rounded-md flex items-center gap-2 ${
                              isCorrectOpt
                                ? "bg-green-100 text-green-800 font-medium"
                                : isSelected && !isCorrectOpt
                                ? "bg-red-100 text-red-800"
                                : "text-muted-foreground"
                            }`}
                          >
                            {isCorrectOpt ? (
                              <CheckCircle2 className="size-3.5 shrink-0 text-green-600" />
                            ) : isSelected ? (
                              <XCircle className="size-3.5 shrink-0 text-red-600" />
                            ) : (
                              <span className="size-3.5 shrink-0" />
                            )}
                            {language === "FR" ? opt.fr : (opt.en ?? opt.fr)}
                            {isSelected && (
                              <Badge variant="outline" className="text-xs ml-auto">
                                {t("Répondu", "Answered")}
                              </Badge>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>

                  {/* Explanation */}
                  {q.explanationFr && (
                    <p className="text-xs text-muted-foreground italic border-t pt-2">
                      {language === "FR"
                        ? q.explanationFr
                        : (q.explanationEn ?? q.explanationFr)}
                    </p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Grade audit trail */}
        {(audits as AuditRow[]).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <History className="size-4" />
                {t("Historique des ajustements", "Grade audit trail")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(audits as AuditRow[]).map((audit) => (
                  <div
                    key={audit.id}
                    className="flex items-start gap-3 text-sm border rounded-md px-3 py-2"
                  >
                    <div className="flex-1 space-y-0.5">
                      <p className="font-medium text-xs text-muted-foreground">
                        {fmtDate(audit.createdAt)}
                      </p>
                      <p>{audit.reason}</p>
                    </div>
                    <div className="text-right shrink-0 font-mono text-xs">
                      {audit.previousScore != null && (
                        <span className="text-muted-foreground line-through mr-1">
                          {audit.previousScore}%
                        </span>
                      )}
                      {audit.updatedScore != null && (
                        <span className="font-semibold">{audit.updatedScore}%</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </FioriShell>
  );
}
