import { CheckCircle2, CircleAlert, CircleHelp, Info } from "lucide-react";
import type { FormativeFeedbackItem } from "@shared/formativeExercises";

type TranslateFn = (fr: string, en: string) => string;

export interface FormativeFeedbackPanelProps {
  items: FormativeFeedbackItem[];
  language: "FR" | "EN";
  t: TranslateFn;
}

/** Visible kind badge — never color-only. */
export function feedbackKindBadge(
  kind: FormativeFeedbackItem["kind"],
  t: TranslateFn,
): { label: string; Icon: typeof CheckCircle2; shell: string; labelClass: string; bodyClass: string } {
  if (kind === "correct") {
    return {
      label: t("Correct", "Correct"),
      Icon: CheckCircle2,
      shell: "border-emerald-700/40 bg-emerald-50 dark:border-emerald-400/50 dark:bg-emerald-950/50",
      labelClass: "text-emerald-950 dark:text-emerald-50",
      bodyClass: "text-emerald-950/95 dark:text-emerald-50/95",
    };
  }
  if (kind === "incorrect") {
    return {
      label: t("Incorrect", "Incorrect"),
      Icon: CircleAlert,
      shell: "border-rose-700/40 bg-rose-50 dark:border-rose-400/50 dark:bg-rose-950/50",
      labelClass: "text-rose-950 dark:text-rose-50",
      bodyClass: "text-rose-950/95 dark:text-rose-50/95",
    };
  }
  if (kind === "incomplete") {
    return {
      label: t("Incomplet", "Incomplete"),
      Icon: CircleHelp,
      shell: "border-amber-700/40 bg-amber-50 dark:border-amber-400/50 dark:bg-amber-950/50",
      labelClass: "text-amber-950 dark:text-amber-50",
      bodyClass: "text-amber-950/95 dark:text-amber-50/95",
    };
  }
  return {
    label: t("Info", "Info"),
    Icon: Info,
    shell: "border-sky-700/40 bg-sky-50 dark:border-sky-400/50 dark:bg-sky-950/50",
    labelClass: "text-sky-950 dark:text-sky-50",
    bodyClass: "text-sky-950/95 dark:text-sky-50/95",
  };
}

export function resolveFeedbackTexts(
  item: FormativeFeedbackItem,
  language: "FR" | "EN",
): { title: string; body: string } {
  const title = (language === "FR" ? item.title.fr : item.title.en).trim();
  const body = (language === "FR" ? item.body.fr : item.body.en).trim();
  return { title, body };
}

export default function FormativeFeedbackPanel({ items, language, t }: FormativeFeedbackPanelProps) {
  if (!items.length) return null;

  return (
    <section
      className="space-y-3 overflow-visible"
      aria-label={t("Feedback formatif", "Formative feedback")}
      data-testid="formative-feedback-panel"
    >
      <h3 className="text-sm font-semibold text-foreground">
        {t("Feedback pédagogique", "Pedagogical feedback")}
      </h3>
      <p className="text-xs text-muted-foreground">
        {t(
          "Chaque carte indique Correct ou Incorrect avec une explication courte. Une réponse incomplète n’est pas forcément incorrecte.",
          "Each card shows Correct or Incorrect with a short explanation. An incomplete answer is not necessarily incorrect.",
        )}
      </p>
      <ul className="space-y-3">
        {items.map((item) => {
          const badge = feedbackKindBadge(item.kind, t);
          const { title, body } = resolveFeedbackTexts(item, language);
          const Icon = badge.Icon;
          return (
            <li
              key={item.id}
              className={`rounded-md border p-3.5 min-h-[4.5rem] h-auto overflow-visible ${badge.shell}`}
              data-testid={`formative-feedback-item-${item.kind}`}
              data-feedback-kind={item.kind}
            >
              <div className="flex items-start gap-2.5">
                <Icon
                  size={18}
                  className={`mt-0.5 shrink-0 ${badge.labelClass}`}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide border border-current/30 ${badge.labelClass}`}
                      data-testid={`formative-feedback-badge-${item.kind}`}
                    >
                      {badge.label}
                    </span>
                    {title ? (
                      <p
                        className={`text-sm font-semibold leading-snug ${badge.labelClass}`}
                        data-testid="formative-feedback-title"
                      >
                        {title}
                      </p>
                    ) : null}
                  </div>
                  {body ? (
                    <p
                      className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${badge.bodyClass}`}
                      data-testid="formative-feedback-body"
                    >
                      {body}
                    </p>
                  ) : (
                    <p
                      className={`text-sm font-medium ${badge.bodyClass}`}
                      data-testid="formative-feedback-body-empty-guard"
                    >
                      {t(
                        "Explication pédagogique indisponible pour cet item.",
                        "Pedagogical explanation unavailable for this item.",
                      )}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
