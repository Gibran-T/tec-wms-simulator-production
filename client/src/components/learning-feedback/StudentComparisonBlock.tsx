import { CheckCircle, AlertTriangle } from "lucide-react";

type Props = {
  stepCode: string;
  studentSubmission: string;
  submissionCorrect: boolean;
  submissionFeedback?: string | null;
  rejected?: boolean;
  t: (fr: string, en: string) => string;
};

export default function StudentComparisonBlock({
  stepCode,
  studentSubmission,
  submissionCorrect,
  submissionFeedback,
  rejected,
  t,
}: Props) {
  const isRejected = rejected === true;
  const isCorrect = !isRejected && submissionCorrect;

  return (
    <div
      className={`rounded-md border p-3 space-y-2 ${
        isRejected
          ? "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800"
          : isCorrect
            ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800"
            : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
      }`}
      data-testid={`learning-student-comparison-${stepCode}`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground">
          {t("Votre réponse", "Your answer")}
        </p>
        <span className={`text-[10px] font-semibold flex items-center gap-1 ${
          isRejected ? "text-rose-600" : isCorrect ? "text-emerald-600" : "text-amber-600"
        }`}>
          {isRejected ? (
            <><AlertTriangle size={11} /> {t("Non enregistrée", "Not recorded")}</>
          ) : isCorrect ? (
            <><CheckCircle size={11} /> {t("Correct", "Correct")}</>
          ) : (
            <><AlertTriangle size={11} /> {t("À revoir", "Needs review")}</>
          )}
        </span>
      </div>
      {isRejected ? (
        <p className="text-xs text-rose-700 dark:text-rose-400 italic">
          {t(
            "Décision non enregistrée — rejetée à la soumission.",
            "Decision not recorded — rejected at submission.",
          )}
        </p>
      ) : (
        <p className="text-xs text-foreground whitespace-pre-wrap">{studentSubmission}</p>
      )}
      {submissionFeedback && !isRejected && (
        <p className="text-[10px] text-muted-foreground italic">{submissionFeedback}</p>
      )}
    </div>
  );
}
