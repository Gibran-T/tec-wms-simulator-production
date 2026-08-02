import { useEffect, useRef, useState, useCallback } from "react";
import FioriShell from "@/components/FioriShell";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  BookOpen,
  Award,
  ShieldCheck,
  Layers,
  FileText,
  ChevronDown,
} from "lucide-react";
import { interpretClotureReport } from "@shared/evalClotureQuestionBank";

/* ─── helpers ────────────────────────────────────────────────── */

function fmtTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

type Option = { id: string; fr: string; en: string };
type Question = {
  id: number;
  code: string;
  moduleCode: string;
  competency: string;
  promptFr: string;
  promptEn: string;
  points: number;
  options: Option[];
  selectedOptionId: string | null;
  correctOptionId?: string;
  explanationFr?: string;
  explanationEn?: string;
};

/* ─── Result view ─────────────────────────────────────────────── */

interface ResultViewProps {
  attempt: {
    id: number;
    status: string;
    autoScore: number | null;
    finalScore: number | null;
    passed: boolean | null;
    m4UnlockStatus: string | null;
    practicalValidationStatus: string | null;
    competencyBreakdown: unknown;
  };
  questions: Question[];
  assessmentTitle: string;
  isProgrammeClosing?: boolean;
}

function ResultView({
  attempt,
  questions,
  assessmentTitle,
  isProgrammeClosing,
}: ResultViewProps) {
  const { t, language } = useLanguage();
  const score = attempt.finalScore ?? attempt.autoScore ?? 0;
  const passed = attempt.passed === true;
  const rawBreakdown = attempt.competencyBreakdown;
  const breakdownList: Array<{
    competency: string;
    earned: number;
    possible: number;
    correct: number;
    total: number;
  }> = Array.isArray(rawBreakdown)
    ? (rawBreakdown as Array<{
        competency: string;
        earned: number;
        possible: number;
        correct: number;
        total: number;
      }>)
    : [];
  const clotureInterp = isProgrammeClosing
    ? interpretClotureReport(score)
    : null;
  const levelLabel =
    score >= 90
      ? t("Compétence excellente", "Excellent Competency")
      : score >= 80
        ? t("Bonne compétence", "Good Competency")
        : score >= 70
          ? t("Compétence suffisante", "Sufficient Competency")
          : t("Compétence non encore démontrée", "Competency not yet demonstrated");
  const levelMeaning = clotureInterp
    ? language === "FR"
      ? clotureInterp.meaningFr
      : clotureInterp.meaningEn
    : passed
      ? t(
          "Compétence suffisante démontrée pour poursuivre vers l'étape suivante.",
          "Sufficient competency demonstrated to continue to the next learning stage."
        )
      : t(
          "Compétence non encore démontrée — reprise uniquement si le professeur l'autorise.",
          "Competency not yet demonstrated — retake only if the professor authorizes it."
        );

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Score banner */}
      <Card className={passed ? "border-green-400 bg-green-50" : "border-amber-400 bg-amber-50"}>
        <CardContent className="pt-6 pb-6 flex flex-col items-center gap-3">
          {passed ? (
            <CheckCircle2 className="size-12 text-green-600" />
          ) : (
            <XCircle className="size-12 text-amber-600" />
          )}
          <div className="text-4xl font-bold">{score}/100</div>
          <Badge variant={passed ? "default" : "secondary"}>{levelLabel}</Badge>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            {levelMeaning}
          </p>
          {passed && attempt.practicalValidationStatus === "pending" && (
            <p className="text-sm font-medium text-amber-800 text-center">
              {t(
                "Évaluation réussie — validation pratique en attente",
                "Assessment passed — practical validation pending"
              )}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Competency breakdown */}
      {breakdownList.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Layers className="size-4" />
              {t("Résultats par compétence", "Results by competency")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {breakdownList.map((row) => {
              const pct =
                row.possible > 0
                  ? Math.round((row.earned / row.possible) * 100)
                  : row.total > 0
                    ? Math.round((row.correct / row.total) * 100)
                    : 0;
              return (
                <div key={row.competency} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground truncate">{row.competency}</span>
                    <span className="font-medium ml-2 shrink-0">{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-1.5" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Practical + M4 status — Eval 1 pathway only */}
      {!isProgrammeClosing && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-5 pb-4 flex items-center gap-3">
              <ShieldCheck className="size-6 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {t("Pratique", "Practical")}
                </p>
                <p className="text-sm font-medium">
                  {attempt.practicalValidationStatus === "satisfied" ||
                  attempt.practicalValidationStatus === "waived"
                    ? t("Satisfaite", "Satisfied")
                    : t("En attente", "Pending")}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4 flex items-center gap-3">
              <Award className="size-6 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {t("Module 4", "Module 4")}
                </p>
                <p className="text-sm font-medium">
                  {attempt.m4UnlockStatus === "unlocked"
                    ? t("Déverrouillé", "Unlocked")
                    : attempt.m4UnlockStatus === "pending_practical"
                      ? t("En attente pratique", "Pending practical")
                      : t("Verrouillé", "Locked")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {isProgrammeClosing && (
        <Card>
          <CardContent className="pt-5 pb-4 flex items-center gap-3">
            <Award className="size-6 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {t("Clôture du programme", "Programme closing")}
              </p>
              <p className="text-sm font-medium">
                {t(
                  "Résultat conclusif de compétence WMS / stocks",
                  "Conclusive WMS / inventory competency result"
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {assessmentTitle}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Answer review — only shown when passed */}
      {passed && questions.some((q) => q.correctOptionId) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BookOpen className="size-4" />
              {t("Révision des réponses", "Answer review")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((q, idx) => {
              const isCorrect = q.selectedOptionId === q.correctOptionId;
              return (
                <div key={q.id} className="border rounded-lg p-3 space-y-2">
                  <p className="text-sm font-medium">
                    {idx + 1}. {q.promptFr}
                  </p>
                  {q.options.map((opt) => {
                    const selected = opt.id === q.selectedOptionId;
                    const correct = opt.id === q.correctOptionId;
                    return (
                      <div
                        key={opt.id}
                        className={`text-sm px-3 py-1.5 rounded-md flex items-center gap-2 ${
                          correct
                            ? "bg-green-100 text-green-800"
                            : selected && !correct
                            ? "bg-red-100 text-red-800"
                            : "text-muted-foreground"
                        }`}
                      >
                        {correct ? (
                          <CheckCircle2 className="size-3.5 shrink-0" />
                        ) : selected ? (
                          <XCircle className="size-3.5 shrink-0" />
                        ) : (
                          <span className="size-3.5 shrink-0" />
                        )}
                        {opt.fr}
                      </div>
                    );
                  })}
                  {q.explanationFr && (
                    <p className="text-xs text-muted-foreground italic border-t pt-2">
                      {q.explanationFr}
                    </p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* CTA */}
      <div className="flex justify-center">
        <a href="/student/evaluations">
          <Button variant="outline" size="sm">
            <ChevronLeft className="size-4" />
            {t("Retour aux évaluations", "Back to assessments")}
          </Button>
        </a>
      </div>
    </div>
  );
}

/* ─── Main page ───────────────────────────────────────────────── */

export default function AssessmentAttemptPage() {
  const { attemptId: attemptIdStr } = useParams<{ attemptId: string }>();
  const attemptId = Number(attemptIdStr);
  const { t, language } = useLanguage();
  const [, navigate] = useLocation();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [localAnswers, setLocalAnswers] = useState<Record<number, string | null>>({});
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [dossierOpen, setDossierOpen] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data, isLoading, refetch } = trpc.assessments.getAttempt.useQuery(
    { attemptId },
    { enabled: !isNaN(attemptId), refetchOnWindowFocus: false }
  );

  const autosaveMutation = trpc.assessments.autosave.useMutation();
  const submitMutation = trpc.assessments.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      refetch();
    },
  });

  // Seed local answers from server on first load
  useEffect(() => {
    if (!data) return;
    const d = data as unknown as {
      attempt: {
        remainingSeconds: number | null;
        status: string;
        isTimed?: boolean;
      };
      questions: Question[];
      assessment?: { durationMinutes?: number };
    };
    const initial: Record<number, string | null> = {};
    for (const q of d.questions) {
      if (q.selectedOptionId !== undefined) {
        initial[q.id] = q.selectedOptionId;
      }
    }
    setLocalAnswers(initial);
    const timed =
      d.attempt.isTimed !== false &&
      d.attempt.remainingSeconds != null &&
      (d.assessment?.durationMinutes == null || d.assessment.durationMinutes > 0);
    if (d.attempt.status === "in_progress" && timed) {
      setCountdown(d.attempt.remainingSeconds);
    } else {
      setCountdown(null);
    }
  }, [data?.attempt.id]);

  // Countdown timer (timed assessments only)
  useEffect(() => {
    if (countdown === null || submitted) return;
    if (countdown <= 0) {
      if (data?.attempt.status === "in_progress" && !submitMutation.isPending) {
        submitMutation.mutate({ attemptId });
      }
      return;
    }
    timerRef.current = setInterval(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown === null, submitted, countdown === 0]);

  const handleSelectOption = useCallback(
    (questionId: number, optionId: string) => {
      setLocalAnswers((prev) => ({ ...prev, [questionId]: optionId }));
      autosaveMutation.mutate({ attemptId, questionId, selectedOptionId: optionId });
    },
    [attemptId]
  );

  if (isNaN(attemptId)) {
    return (
      <FioriShell title={t("Évaluation", "Assessment")} breadcrumbs={[]}>
        <div className="p-8 text-center text-destructive">
          {t("Identifiant de tentative invalide.", "Invalid attempt ID.")}
        </div>
      </FioriShell>
    );
  }

  if (isLoading) {
    return (
      <FioriShell title={t("Évaluation", "Assessment")} breadcrumbs={[]}>
        <div className="p-8 text-center text-muted-foreground animate-pulse">
          {t("Chargement de l'évaluation…", "Loading assessment…")}
        </div>
      </FioriShell>
    );
  }

  if (!data) {
    return (
      <FioriShell title={t("Évaluation", "Assessment")} breadcrumbs={[]}>
        <div className="p-8 text-center text-destructive">
          {t("Tentative introuvable.", "Attempt not found.")}
        </div>
      </FioriShell>
    );
  }

  const { attempt, assessment, questions, dossier, isProgrammeClosing } =
    data as unknown as {
      attempt: {
        id: number;
        assessmentId: number;
        attemptNumber: number;
        status: string;
        startedAt: string;
        expiresAt: string;
        remainingSeconds: number;
        autoScore: number | null;
        finalScore: number | null;
        passed: boolean | null;
        m4UnlockStatus: string | null;
        practicalValidationStatus: string | null;
        competencyBreakdown: unknown;
      };
      assessment: {
        titleFr: string;
        titleEn: string | null;
        durationMinutes: number;
        passingScore: number;
        code?: string;
      };
      questions: Question[];
      dossier: {
        code: string;
        titleFr: string;
        titleEn: string;
        contextFr: string;
        contextEn: string;
        factsFr: readonly string[];
        factsEn: readonly string[];
        tableFr: { headers: readonly string[]; rows: readonly string[][] };
        tableEn: { headers: readonly string[]; rows: readonly string[][] };
      } | null;
      isProgrammeClosing?: boolean;
    };

  const assessmentTitle =
    language === "FR"
      ? assessment.titleFr
      : (assessment.titleEn ?? assessment.titleFr);

  const isFinished =
    submitted ||
    attempt.status === "submitted" ||
    attempt.status === "expired_submitted";

  if (isFinished) {
    return (
      <FioriShell
        title={t("Résultats — Évaluation", "Assessment Results")}
        breadcrumbs={[
          { label: t("Évaluations", "Assessments"), href: "/student/evaluations" },
          { label: t("Résultats", "Results") },
        ]}
      >
        <ResultView
          attempt={attempt}
          questions={questions}
          assessmentTitle={assessmentTitle}
          isProgrammeClosing={!!isProgrammeClosing}
        />
      </FioriShell>
    );
  }

  const currentQ = questions[currentIndex];
  const totalQ = questions.length;
  const answeredCount = questions.filter(
    (q) => (localAnswers[q.id] ?? q.selectedOptionId) !== null
  ).length;
  const progress = totalQ > 0 ? (answeredCount / totalQ) * 100 : 0;

  const urgent = countdown !== null && countdown < 120;

  return (
    <FioriShell
      title={assessmentTitle}
      breadcrumbs={[
        { label: t("Évaluations", "Assessments"), href: "/student/evaluations" },
        { label: t("En cours", "In progress") },
      ]}
    >
      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Case dossier — Eval 2 clôture */}
        {dossier && (
          <Card className="border-primary/30 bg-muted/30">
            <button
              type="button"
              className="w-full text-left px-4 py-3 flex items-center justify-between gap-2"
              onClick={() => setDossierOpen((o) => !o)}
            >
              <span className="flex items-center gap-2 text-sm font-semibold">
                <FileText className="size-4 text-primary" />
                {language === "FR" ? dossier.titleFr : dossier.titleEn}
              </span>
              <ChevronDown
                className={`size-4 text-muted-foreground transition-transform ${
                  dossierOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {dossierOpen && (
              <CardContent className="pt-0 pb-4 space-y-3 text-sm">
                <p className="text-muted-foreground whitespace-pre-line">
                  {language === "FR" ? dossier.contextFr : dossier.contextEn}
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  {(language === "FR" ? dossier.factsFr : dossier.factsEn).map(
                    (fact, i) => (
                      <li key={i}>{fact}</li>
                    )
                  )}
                </ul>
                <div className="overflow-x-auto rounded-md border">
                  <table className="w-full text-xs">
                    <thead className="bg-muted">
                      <tr>
                        {(language === "FR"
                          ? dossier.tableFr.headers
                          : dossier.tableEn.headers
                        ).map((h) => (
                          <th
                            key={h}
                            className="px-2 py-1.5 text-left font-semibold"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(language === "FR"
                        ? dossier.tableFr.rows
                        : dossier.tableEn.rows
                      ).map((row, ri) => (
                        <tr key={ri} className="border-t">
                          {row.map((cell, ci) => (
                            <td key={ci} className="px-2 py-1.5">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  {t(
                    "Consultez ce dossier à tout moment pendant la preuve (50 min).",
                    "Consult this dossier at any time during the exam (50 min)."
                  )}
                </p>
              </CardContent>
            )}
          </Card>
        )}

        {/* Top bar: progress + timer */}
        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {t(
                  `${answeredCount} / ${totalQ} répondu${answeredCount !== 1 ? "s" : ""}`,
                  `${answeredCount} / ${totalQ} answered`
                )}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          {countdown !== null ? (
            <div
              className={`flex items-center gap-1.5 text-sm font-mono font-semibold shrink-0 ${
                urgent ? "text-red-600 animate-pulse" : "text-foreground"
              }`}
            >
              <Clock className={`size-4 ${urgent ? "text-red-600" : "text-muted-foreground"}`} />
              {fmtTime(countdown)}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-sm font-medium shrink-0 text-muted-foreground">
              <Clock className="size-4" />
              {t("Sans limite de temps", "No time limit")}
            </div>
          )}
        </div>

        {/* Review nav pills */}
        <div className="flex flex-wrap gap-1.5">
          {questions.map((q, idx) => {
            const answered =
              (localAnswers[q.id] ?? q.selectedOptionId) !== null;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`size-7 rounded-md text-xs font-medium transition-colors ${
                  idx === currentIndex
                    ? "bg-primary text-primary-foreground"
                    : answered
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Question card */}
        {currentQ && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {currentQ.moduleCode}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {currentQ.competency}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {t(`Question ${currentIndex + 1} / ${totalQ}`, `Question ${currentIndex + 1} / ${totalQ}`)}
                </span>
              </div>
              <CardTitle className="text-base leading-snug mt-2">
                {language === "FR" ? currentQ.promptFr : (currentQ.promptEn ?? currentQ.promptFr)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {currentQ.options.map((opt) => {
                const selected =
                  (localAnswers[currentQ.id] ?? currentQ.selectedOptionId) === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(currentQ.id, opt.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                      selected
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border bg-background hover:bg-muted/50"
                    }`}
                  >
                    {language === "FR" ? opt.fr : (opt.en ?? opt.fr)}
                  </button>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Prev / Next / Submit */}
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="size-4" />
            {t("Précédente", "Previous")}
          </Button>

          {currentIndex < totalQ - 1 ? (
            <Button
              size="sm"
              onClick={() => setCurrentIndex((i) => Math.min(totalQ - 1, i + 1))}
            >
              {t("Suivante", "Next")}
              <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              variant={confirmSubmit ? "destructive" : "default"}
              onClick={() => {
                if (!confirmSubmit) {
                  setConfirmSubmit(true);
                } else {
                  submitMutation.mutate({ attemptId });
                }
              }}
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending ? (
                t("Envoi…", "Submitting…")
              ) : confirmSubmit ? (
                <>
                  <AlertTriangle className="size-4" />
                  {t("Confirmer la remise", "Confirm submit")}
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  {t("Remettre l'évaluation", "Submit assessment")}
                </>
              )}
            </Button>
          )}
        </div>

        {/* Confirm cancel */}
        {confirmSubmit && (
          <p className="text-xs text-muted-foreground text-center">
            {answeredCount < totalQ
              ? t(
                  `${totalQ - answeredCount} question(s) sans réponse. Vous pouvez y répondre avant de confirmer.`,
                  `${totalQ - answeredCount} question(s) unanswered. You can still answer them before confirming.`
                )
              : t(
                  "Toutes les questions sont répondues. Cliquez à nouveau pour confirmer.",
                  "All questions answered. Click again to confirm."
                )}
            {" "}
            <button
              className="underline text-muted-foreground ml-1"
              onClick={() => setConfirmSubmit(false)}
            >
              {t("Annuler", "Cancel")}
            </button>
          </p>
        )}
      </div>
    </FioriShell>
  );
}
