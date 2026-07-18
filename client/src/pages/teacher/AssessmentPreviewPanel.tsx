/**
 * RC13.1 — Professor Assessment Preview / Correction / Question Bank
 * Read-only. No attempts, timers, autosave, scores, or mutations.
 */
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
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
  ChevronLeft,
  ChevronRight,
  Eye,
  BookOpen,
  Printer,
  FileDown,
  CheckCircle2,
  Layers,
  Clock,
  BarChart2,
  StickyNote,
  List,
  X,
} from "lucide-react";

/* ─── helpers ─────────────────────────────────────────────────── */

function difficultyStars(d: string) {
  const n = d === "hard" ? 3 : d === "medium" ? 2 : 1;
  return "★".repeat(n) + "☆".repeat(3 - n);
}

function fmtMs(ms: number | null | undefined) {
  if (ms == null) return "—";
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

function fmtDate(d: string | Date | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

type PreviewMode = "preview" | "correction";

type PreviewQuestion = {
  id: number;
  number: number;
  code: string;
  moduleCode: string;
  scenarioOrProcess: string;
  competency: string;
  difficulty: string;
  questionType: string;
  promptFr: string;
  promptEn: string;
  options: Array<{ id: string; fr: string; en: string }>;
  points: number;
  correctOptionId: string;
  explanationFr: string;
  explanationEn: string;
  learningObjectiveFr: string | null;
  learningObjectiveEn: string | null;
  estimatedTimeSeconds: number;
  lastRevisedAt: string | Date | null;
  revision: string | Date;
  status: string;
  professorNotesFr: string | null;
  professorNotesEn: string | null;
  stats: {
    attempts: number | null;
    correctPct: number | null;
    averageScore: number | null;
    averageTimeMs: number | null;
    mostSelectedDistractor: string | null;
  };
};

/* ─── Meta chip ───────────────────────────────────────────────── */

function MetaChip({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-medium truncate">{value}</p>
    </div>
  );
}

/* ─── Preview / Correction panel ──────────────────────────────── */

export function ProfessorPreviewPanel({
  assessmentId,
  mode,
}: {
  assessmentId: number;
  mode: PreviewMode;
}) {
  const { t, language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showOverview, setShowOverview] = useState(false);
  const [printIncludeCorrection, setPrintIncludeCorrection] = useState(
    mode === "correction"
  );

  const { data, isLoading, error } = trpc.assessments.professorPreview.useQuery(
    { assessmentId },
    { refetchOnWindowFocus: false }
  );

  useEffect(() => {
    setCurrentIndex(0);
    setShowOverview(false);
    setPrintIncludeCorrection(mode === "correction");
  }, [assessmentId, mode]);

  const questions = (data?.questions ?? []) as PreviewQuestion[];
  const assessment = data?.assessment;
  const q = questions[currentIndex] ?? null;

  const title = assessment
    ? language === "FR"
      ? assessment.titleFr
      : assessment.titleEn ?? assessment.titleFr
    : "";

  function handlePrint(withCorrection: boolean) {
    // Flush so print-all cards render with the chosen key visibility
    // before the browser print dialog (Imprimer = assessment only).
    flushSync(() => {
      setPrintIncludeCorrection(withCorrection);
    });
    document.body.classList.add("assessment-prof-print");
    if (withCorrection) {
      document.body.classList.add("assessment-prof-print-correction");
    } else {
      document.body.classList.remove("assessment-prof-print-correction");
    }
    window.print();
    document.body.classList.remove(
      "assessment-prof-print",
      "assessment-prof-print-correction"
    );
  }

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground animate-pulse p-4">
        {t("Chargement de la prévisualisation…", "Loading preview…")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-destructive p-4">
        {error.message}
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="text-sm text-muted-foreground p-4 text-center">
        {t("Évaluation introuvable.", "Assessment not found.")}
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground text-sm">
          {t(
            "Aucune question dans cette évaluation (brouillon ou banque vide).",
            "No questions in this assessment (draft or empty bank)."
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      className="space-y-4 assessment-prof-preview"
      data-preview-mode={mode}
      data-print-correction={printIncludeCorrection ? "1" : "0"}
    >
      {/* Header — assessment meta + print */}
      <Card className="assessment-prof-print-header">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {mode === "correction"
                    ? t("Corrigé officiel", "Official correction")
                    : t("Prévisualisation", "Preview")}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {t("Lecture seule", "Read-only")}
                </Badge>
              </div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription>
                {assessment.code} · {assessment.version}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2 assessment-prof-no-print">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePrint(false)}
                title={t("Imprimer l'évaluation seule", "Print assessment only")}
              >
                <Printer className="size-3.5" />
                {t("Imprimer", "Print")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePrint(true)}
                title={t(
                  "Exporter PDF (évaluation + corrigé)",
                  "Export PDF (assessment + correction)"
                )}
              >
                <FileDown className="size-3.5" />
                {t("Exporter PDF", "Export PDF")}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-sm">
          <MetaChip
            label={t("Modules", "Modules")}
            value={assessment.modulesCovered?.join(", ") ?? "—"}
          />
          <MetaChip
            label={t("Durée", "Duration")}
            value={`${assessment.durationMinutes} min`}
          />
          <MetaChip
            label={t("Seuil", "Passing")}
            value={`${assessment.passingScore}%`}
          />
          <MetaChip
            label={t("Questions", "Questions")}
            value={assessment.questionCount}
          />
          <MetaChip label={t("Version", "Version")} value={assessment.version} />
          <MetaChip
            label={t("Dernière révision", "Last revision")}
            value={fmtDate(assessment.lastRevision)}
          />
        </CardContent>
      </Card>

      {/* Question navigation */}
      <div className="flex flex-wrap items-center gap-2 assessment-prof-no-print">
        <Button
          variant="outline"
          size="sm"
          disabled={currentIndex <= 0}
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
        >
          <ChevronLeft className="size-3.5" />
          {t("Précédent", "Previous")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={currentIndex >= questions.length - 1}
          onClick={() =>
            setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))
          }
        >
          {t("Suivant", "Next")}
          <ChevronRight className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowOverview((v) => !v)}
        >
          <List className="size-3.5" />
          {t("Vue d'ensemble", "Overview")}
        </Button>
        <span className="text-xs text-muted-foreground ml-auto">
          {t("Question", "Question")} {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Numbered jump grid */}
      <div className="flex flex-wrap gap-1.5 assessment-prof-no-print">
        {questions.map((qq, idx) => (
          <button
            key={qq.id}
            type="button"
            onClick={() => {
              setCurrentIndex(idx);
              setShowOverview(false);
            }}
            className={`size-8 rounded-md text-xs font-medium border transition-colors ${
              idx === currentIndex
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:bg-muted/50"
            }`}
            aria-label={`${t("Question", "Question")} ${idx + 1}`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {showOverview && (
        <Card className="assessment-prof-no-print">
          <CardHeader className="pb-2 flex-row items-center justify-between">
            <CardTitle className="text-sm">
              {t("Liste des questions", "Question list")}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setShowOverview(false)}
            >
              <X className="size-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-1 max-h-64 overflow-y-auto">
            {questions.map((qq, idx) => (
              <button
                key={qq.id}
                type="button"
                onClick={() => {
                  setCurrentIndex(idx);
                  setShowOverview(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm border transition-colors ${
                  idx === currentIndex
                    ? "border-primary bg-primary/5"
                    : "border-transparent hover:bg-muted/40"
                }`}
              >
                <span className="font-mono text-xs text-muted-foreground mr-2">
                  {idx + 1}.
                </span>
                <Badge variant="outline" className="text-[10px] mr-2">
                  {qq.moduleCode}
                </Badge>
                <span className="line-clamp-1">
                  {language === "FR" ? qq.promptFr : qq.promptEn}
                </span>
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Single question (interactive) + all questions (print) */}
      {q && (
        <QuestionCard
          q={q}
          mode={mode}
          language={language}
          t={t}
          className="assessment-prof-screen-only"
        />
      )}

      {/* Print: all questions — key visibility driven only by printIncludeCorrection */}
      <div className="hidden assessment-prof-print-all space-y-6">
        {questions.map((qq) => (
          <QuestionCard
            key={qq.id}
            q={qq}
            mode={printIncludeCorrection ? "correction" : "preview"}
            language={language}
            t={t}
            revealAnswerKey={printIncludeCorrection}
            printSafe
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Question card ───────────────────────────────────────────── */

function QuestionCard({
  q,
  mode,
  language,
  t,
  className,
  revealAnswerKey,
  printSafe,
}: {
  q: PreviewQuestion;
  mode: PreviewMode;
  language: string;
  t: (fr: string, en: string) => string;
  className?: string;
  /** When false (e.g. Imprimer assessment-only), hide keys/explanations. */
  revealAnswerKey?: boolean;
  /** Print layout: hide interactive-only chrome already handled by CSS. */
  printSafe?: boolean;
}) {
  const showCorrection =
    revealAnswerKey !== undefined
      ? revealAnswerKey
      : mode === "correction";
  // On-screen professor views may show key metadata; print assessment-only must not.
  const showAnswerKeyMeta =
    revealAnswerKey !== undefined ? revealAnswerKey : true;
  const showProfessorNotes =
    revealAnswerKey !== undefined ? revealAnswerKey : true;
  const prompt = language === "FR" ? q.promptFr : q.promptEn;
  const explanation =
    language === "FR" ? q.explanationFr : q.explanationEn;
  const learningObj =
    language === "FR"
      ? q.learningObjectiveFr
      : q.learningObjectiveEn ?? q.learningObjectiveFr;
  const notes =
    language === "FR"
      ? q.professorNotesFr
      : q.professorNotesEn ?? q.professorNotesFr;
  void printSafe;

  const distractorLabel = useMemo(() => {
    if (!q.stats.mostSelectedDistractor) return null;
    const opt = q.options.find((o) => o.id === q.stats.mostSelectedDistractor);
    if (!opt) return q.stats.mostSelectedDistractor;
    return `${opt.id} — ${language === "FR" ? opt.fr : opt.en}`;
  }, [q, language]);

  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-4 ${className ?? ""}`}
    >
      <Card className="assessment-prof-question-card">
        <CardHeader className="pb-3 space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <CardTitle className="text-base">
              {t("Question", "Question")} {q.number}
              <span className="text-muted-foreground font-normal text-sm ml-2">
                {q.code}
              </span>
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {q.points} {t("pts", "pts")}
            </Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetaChip label={t("Module", "Module")} value={q.moduleCode} />
            <MetaChip
              label={t("Scénario", "Scenario")}
              value={q.scenarioOrProcess}
            />
            <MetaChip
              label={t("Compétence", "Competency")}
              value={q.competency}
            />
            <MetaChip
              label={t("Difficulté", "Difficulty")}
              value={
                <span className="text-amber-600 tracking-tight">
                  {difficultyStars(q.difficulty)}
                </span>
              }
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed">{prompt}</p>

          {/* Options — read-only, none selected */}
          <div className="space-y-2">
            {q.options.map((opt) => {
              const isCorrect = opt.id === q.correctOptionId;
              return (
                <div
                  key={opt.id}
                  className={`text-sm px-3 py-2.5 rounded-md border flex items-start gap-2 ${
                    showCorrection && isCorrect
                      ? "border-green-400 bg-green-50 text-green-900"
                      : "border-border bg-background"
                  }`}
                >
                  <span
                    className={`mt-0.5 size-4 rounded-full border shrink-0 ${
                      showCorrection && isCorrect
                        ? "border-green-600 bg-green-600"
                        : "border-muted-foreground/40"
                    }`}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <span className="font-mono text-[10px] text-muted-foreground mr-1.5">
                      {opt.id}
                    </span>
                    {language === "FR" ? opt.fr : opt.en}
                    {showCorrection && isCorrect && (
                      <span className="ml-2 inline-flex items-center gap-1 text-xs text-green-700 font-medium">
                        <CheckCircle2 className="size-3.5" />
                        {t("Bonne réponse", "Correct answer")}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Correction block */}
          {showCorrection && (
            <div className="assessment-prof-correction-block space-y-3 border-t pt-4">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <BookOpen className="size-4 text-primary" />
                {t("Corrigé pédagogique", "Pedagogical correction")}
              </h4>
              <div className="rounded-lg border bg-muted/30 p-3 space-y-2 text-sm">
                <p>
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    {t("Option correcte", "Correct option")}
                  </span>
                  <br />
                  <span className="font-mono font-medium">
                    {q.correctOptionId}
                  </span>
                </p>
                <p>
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    {t("Explication pédagogique", "Pedagogical explanation")}
                  </span>
                  <br />
                  {explanation}
                </p>
                <p>
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    {t("Raisonnement attendu", "Expected reasoning")}
                  </span>
                  <br />
                  {explanation}
                </p>
                <p>
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    {t("Scénario canonique", "Canonical scenario")}
                  </span>
                  <br />
                  {q.scenarioOrProcess}
                </p>
                {learningObj && (
                  <p>
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">
                      {t("Objectif d'apprentissage", "Learning objective")}
                    </span>
                    <br />
                    {learningObj}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Full metadata */}
          <div className="border-t pt-4">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
              <Layers className="size-3.5" />
              {t("Métadonnées", "Metadata")}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <MetaChip label={t("Module", "Module")} value={q.moduleCode} />
              <MetaChip
                label={t("Scénario", "Scenario")}
                value={q.scenarioOrProcess}
              />
              <MetaChip
                label={t("Compétence", "Competency")}
                value={q.competency}
              />
              <MetaChip
                label={t("Difficulté", "Difficulty")}
                value={q.difficulty}
              />
              <MetaChip
                label={t("Type", "Type")}
                value={q.questionType}
              />
              <MetaChip
                label={t("Objectif", "Objective")}
                value={learningObj || "—"}
              />
              <MetaChip label={t("Points", "Points")} value={q.points} />
              {showAnswerKeyMeta && (
                <MetaChip
                  label={t("Option correcte (ID)", "Correct option ID")}
                  value={
                    <span className="font-mono assessment-prof-answer-key">
                      {q.correctOptionId}
                    </span>
                  }
                />
              )}
              <MetaChip
                label={t("Révision", "Revision")}
                value={fmtDate(q.revision)}
              />
              <MetaChip label={t("Statut", "Status")} value={q.status} />
            </div>
          </div>

          {/* Professor notes — never for students; omitted from assessment-only print */}
          {showProfessorNotes && (
            <div className="border-t pt-4 assessment-prof-notes">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
                <StickyNote className="size-3.5" />
                {t("Notes pédagogiques", "Pedagogical notes")}
              </h4>
              <p className="text-sm text-muted-foreground bg-amber-50/80 border border-amber-100 rounded-md p-3">
                {notes ||
                  t(
                    "Aucune note pédagogique dédiée — objectif / explication utilisés.",
                    "No dedicated pedagogical note — objective / explanation used."
                  )}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats sidebar */}
      <Card className="h-fit assessment-prof-stats">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart2 className="size-4" />
            {t("Statistiques", "Statistics")}
          </CardTitle>
          <CardDescription className="text-xs">
            {t(
              "Vide s'il n'y a pas encore de tentatives.",
              "Empty when there are no attempts yet."
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <MetaChip
            label={t("Score moyen", "Average score")}
            value={
              q.stats.averageScore != null
                ? `${q.stats.averageScore}/${q.points}`
                : "—"
            }
          />
          <MetaChip
            label={t("% correct", "Correct %")}
            value={
              q.stats.correctPct != null ? `${q.stats.correctPct}%` : "—"
            }
          />
          <MetaChip
            label={t("Temps moyen", "Average time")}
            value={fmtMs(q.stats.averageTimeMs)}
          />
          <MetaChip
            label={t("Distracteur le + choisi", "Most selected distractor")}
            value={distractorLabel || "—"}
          />
          <MetaChip
            label={t("Tentatives", "Attempts")}
            value={q.stats.attempts ?? "—"}
          />
          <div className="pt-2 border-t flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3" />
            ~{q.estimatedTimeSeconds}s{" "}
            {t("estimé", "estimated")}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── Question Bank browser ───────────────────────────────────── */

export function QuestionBankPanel({
  assessmentId,
}: {
  assessmentId: number;
}) {
  const { t, language } = useLanguage();
  const [openId, setOpenId] = useState<number | null>(null);

  const { data, isLoading } = trpc.assessments.professorQuestionBank.useQuery(
    { assessmentId },
    { refetchOnWindowFocus: false }
  );

  const questions = data?.questions ?? [];
  const openQ = questions.find((q) => q.id === openId) ?? null;

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground animate-pulse p-4">
        {t("Chargement de la banque…", "Loading question bank…")}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Eye className="size-4" />
        {t(
          "Inspection seule — aucune édition (P0).",
          "Browse only — no editing (P0)."
        )}
      </div>

      {questions.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground text-sm">
            {t(
              "Aucune question dans la banque pour cette évaluation.",
              "No questions in the bank for this assessment."
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground uppercase tracking-wide">
                <th className="pb-2 pr-3">{t("Question", "Question")}</th>
                <th className="pb-2 pr-3">{t("Module", "Module")}</th>
                <th className="pb-2 pr-3">{t("Scénario", "Scenario")}</th>
                <th className="pb-2 pr-3">{t("Compétence", "Competency")}</th>
                <th className="pb-2 pr-3">{t("Difficulté", "Difficulty")}</th>
                <th className="pb-2 pr-3">{t("Statut", "Status")}</th>
                <th className="pb-2">{t("Ouvrir", "Open")}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {questions.map((q) => (
                <tr key={q.id} className="hover:bg-muted/30">
                  <td className="py-2 pr-3">
                    <div className="font-mono text-xs text-muted-foreground">
                      {q.code}
                    </div>
                    <div className="line-clamp-2 max-w-[280px]">
                      {language === "FR" ? q.promptFr : q.promptEn}
                    </div>
                  </td>
                  <td className="py-2 pr-3">
                    <Badge variant="outline" className="text-xs">
                      {q.moduleCode}
                    </Badge>
                  </td>
                  <td className="py-2 pr-3 text-xs text-muted-foreground max-w-[120px] truncate">
                    {q.scenarioOrProcess}
                  </td>
                  <td className="py-2 pr-3 text-xs max-w-[140px] truncate">
                    {q.competency}
                  </td>
                  <td className="py-2 pr-3 text-amber-600 text-xs tracking-tight">
                    {difficultyStars(q.difficulty)}
                  </td>
                  <td className="py-2 pr-3">
                    <Badge
                      variant={q.status === "active" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {q.status}
                    </Badge>
                  </td>
                  <td className="py-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setOpenId(openId === q.id ? null : q.id)
                      }
                    >
                      <Eye className="size-3.5" />
                      {t("Ouvrir", "Open")}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {openQ && (
        <Card>
          <CardHeader className="pb-2 flex-row items-start justify-between gap-2">
            <div>
              <CardTitle className="text-sm">
                {openQ.code}{" "}
                <Badge variant="outline" className="ml-1 text-xs">
                  {openQ.moduleCode}
                </Badge>
              </CardTitle>
              <CardDescription className="mt-1">
                {openQ.competency} · {openQ.scenarioOrProcess}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setOpenId(null)}
            >
              <X className="size-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>{language === "FR" ? openQ.promptFr : openQ.promptEn}</p>
            <div className="space-y-1.5">
              {openQ.options.map((opt) => (
                <div
                  key={opt.id}
                  className={`px-3 py-2 rounded-md border text-sm ${
                    opt.id === openQ.correctOptionId
                      ? "border-green-400 bg-green-50"
                      : "border-border"
                  }`}
                >
                  <span className="font-mono text-[10px] text-muted-foreground mr-1.5">
                    {opt.id}
                  </span>
                  {language === "FR" ? opt.fr : opt.en}
                  {opt.id === openQ.correctOptionId && (
                    <CheckCircle2 className="inline size-3.5 ml-2 text-green-700" />
                  )}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs border-t pt-3">
              <MetaChip
                label={t("Type", "Type")}
                value={openQ.questionType}
              />
              <MetaChip
                label={t("Points", "Points")}
                value={openQ.points}
              />
              <MetaChip
                label={t("Difficulté", "Difficulty")}
                value={openQ.difficulty}
              />
              <MetaChip
                label={t("Statut", "Status")}
                value={openQ.status}
              />
            </div>
            <div className="border-t pt-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                {t("Explication", "Explanation")}
              </p>
              <p className="text-sm text-muted-foreground">
                {language === "FR"
                  ? openQ.explanationFr
                  : openQ.explanationEn}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
