import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLocation, useParams } from "wouter";
import FioriShell from "@/components/FioriShell";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  AssociationExercise,
  FactsBanner,
  FormativeExerciseShell,
  FormativeFeedbackPanel,
  FormativeResultSummary,
  LayerClassificationExercise,
  MissingLayerExercise,
  OrderingExercise,
  SingleSelectExercise,
  TrueFalseExercise,
} from "@/components/formative";
import {
  M4_CONS_ACTION_BUCKETS,
  M4_CONS_ACTIONS,
  M4_CONS_COLOR_OPTIONS,
  M4_CONS_DECISION_PAIRS,
  M4_CONS_FACTS,
  M4_CONS_JUSTIFICATIONS,
  M4_CONS_KPI_COLORS,
  M4_CONS_PRIORITY_RISK,
  M4_CONS_TRUE_FALSE,
  M4_LAYER_LABELS,
  M4_LAYERS,
  M4_PREP_FRAGMENTS,
  M4_PREP_KPI_QUESTION_OPTIONS,
  M4_PREP_KPI_QUESTIONS,
  M4_PREP_MISSING,
  M4_PREP_MISSING_OPTIONS,
  M5_CONS_ACTION_BUCKETS,
  M5_CONS_ACTIONS,
  M5_CONS_ASSOC,
  M5_CONS_DECISIONS,
  M5_CONS_EVIDENCE_COLORS,
  M5_CONS_FACTS,
  M5_CONS_PATH,
  M5_CONS_PATH_LABELS,
  M5_CONS_TRUE_FALSE,
  M5_PREP_ASSOC,
  M5_PREP_CONSEQUENCES,
  M5_PREP_STOCK_BASE,
  M5_PREP_TRAFFIC,
  M5_PREP_TRUE_FALSE,
  M5_TRAFFIC_OPTIONS,
  getFormativeExerciseMeta,
  isFormativeExerciseId,
  withSeededOrdering,
  type FormativeExerciseId,
  type FormativeFeedbackItem,
} from "@shared/formativeExercises";
import { getModuleConfig } from "@/data/moduleConfig";

type AnswersState = Record<string, unknown>;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}

export default function FormativeExercisePage() {
  const params = useParams<{ exerciseId?: string }>();
  const [location, navigate] = useLocation();
  const { t, language } = useLanguage();
  const exerciseIdRaw = params.exerciseId ?? "";
  const moduleId = location.includes("/module5/") ? 5 : 4;

  const valid = isFormativeExerciseId(exerciseIdRaw);
  const exerciseId = valid ? (exerciseIdRaw as FormativeExerciseId) : null;
  const meta = exerciseId ? getFormativeExerciseMeta(exerciseId) : null;
  const mod = getModuleConfig(meta?.moduleId ?? moduleId);

  const { data, isLoading, refetch } = trpc.formativeExercises.getMine.useQuery(
    { exerciseId: exerciseId! },
    { enabled: !!exerciseId },
  );

  const startMut = trpc.formativeExercises.start.useMutation();
  const saveMut = trpc.formativeExercises.save.useMutation();
  const submitMut = trpc.formativeExercises.submit.useMutation();
  const restartMut = trpc.formativeExercises.restart.useMutation();

  const [answers, setAnswers] = useState<AnswersState>({});
  const [feedback, setFeedback] = useState<FormativeFeedbackItem[]>([]);
  const [partScores, setPartScores] = useState<Record<string, number>>({});
  const [score, setScore] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const justSubmittedRef = useRef(false);
  const autoRedoStartedRef = useRef(false);

  const viewResult =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("view") === "result";

  useEffect(() => {
    autoRedoStartedRef.current = false;
    justSubmittedRef.current = false;
  }, [exerciseId]);

  useEffect(() => {
    if (!data?.attempt) return;
    const isCompleted = data.attempt.status === "completed";

    // Leave → re-enter after completion: clear for a new executable run
    // (unless explicitly viewing results, or we just submitted in this session).
    if (
      isCompleted &&
      !viewResult &&
      !justSubmittedRef.current &&
      !autoRedoStartedRef.current &&
      !restartMut.isPending
    ) {
      autoRedoStartedRef.current = true;
      const redoExerciseId = data.attempt.exerciseId as FormativeExerciseId;
      restartMut.mutate(
        { exerciseId: redoExerciseId },
        {
          onSuccess: () => {
            setAnswers(withSeededOrdering(redoExerciseId, {}));
            setFeedback([]);
            setPartScores({});
            setScore(null);
            setCompleted(false);
            refetch();
          },
        },
      );
      return;
    }

    // For in-progress attempts, seed ordering so UI state === answer state.
    // Completed attempts keep the submitted payload as-is (redo contract).
    const raw = (data.attempt.answers as AnswersState) ?? {};
    setAnswers(
      isCompleted
        ? raw
        : withSeededOrdering(data.attempt.exerciseId as FormativeExerciseId, raw),
    );
    setCompleted(isCompleted);
    setScore(data.attempt.formativeScore);
    const fb = data.attempt.feedbackJson as
      | { items?: FormativeFeedbackItem[]; partScores?: Record<string, number> }
      | null;
    setFeedback(fb?.items ?? []);
    setPartScores(fb?.partScores ?? {});
  }, [data?.attempt, viewResult]);

  useEffect(() => {
    if (!exerciseId || !data || data.attempt) return;
    startMut.mutate({ exerciseId }, { onSuccess: () => refetch() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseId, data?.attempt]);

  const layerOptions = useMemo(
    () => M4_LAYERS.map((id) => ({ id, label: M4_LAYER_LABELS[id] })),
    [],
  );
  const pathOptions = useMemo(
    () => M5_CONS_PATH.map((id) => ({ id, label: M5_CONS_PATH_LABELS[id] })),
    [],
  );

  if (!valid || !meta || meta.moduleId !== moduleId) {
    return (
      <FioriShell title={t("Exercice formatif", "Formative exercise")}>
        <div className="max-w-lg mx-auto py-12 text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            {t("Exercice introuvable.", "Exercise not found.")}
          </p>
          <Button onClick={() => navigate(mod.route)}>{t("Retour", "Back")}</Button>
        </div>
      </FioriShell>
    );
  }

  const disabled = completed;
  const patch = (key: string, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => saveMut.mutate({ exerciseId: meta.id, answers });
  const handleSubmit = () => {
    justSubmittedRef.current = true;
    submitMut.mutate(
      { exerciseId: meta.id, answers },
      {
        onSuccess: (res) => {
          setCompleted(true);
          setScore(res.result.formativeScore);
          setFeedback(res.result.feedback);
          setPartScores(res.result.partScores);
          refetch();
        },
        onError: () => {
          justSubmittedRef.current = false;
        },
      },
    );
  };
  const handleRestart = () => {
    justSubmittedRef.current = false;
    restartMut.mutate(
      { exerciseId: meta.id },
      {
        onSuccess: () => {
          setAnswers(withSeededOrdering(meta.id, {}));
          setFeedback([]);
          setPartScores({});
          setScore(null);
          setCompleted(false);
          refetch();
        },
      },
    );
  };

  const renderBody = () => {
    if (meta.id === "M4-PREP-KPI-RESPONSE") {
      return (
        <>
          <Section title={t("1. Associer chaque fragment à une couche", "1. Associate each fragment to a layer")}>
            <LayerClassificationExercise
              fragments={M4_PREP_FRAGMENTS}
              layers={layerOptions}
              value={(answers.classification as Record<string, string>) ?? {}}
              onChange={(v) => patch("classification", v)}
              language={language}
              t={t}
              disabled={disabled}
            />
          </Section>
          <Section title={t("2. Ordonner le raisonnement", "2. Order the reasoning")}>
            <OrderingExercise
              items={layerOptions}
              value={(answers.ordering as string[]) ?? []}
              onChange={(v) => patch("ordering", v)}
              language={language}
              t={t}
              disabled={disabled}
            />
          </Section>
          <Section title={t("3. Identifier la couche manquante", "3. Identify the missing layer")}>
            <MissingLayerExercise
              prompts={M4_PREP_MISSING}
              options={M4_PREP_MISSING_OPTIONS}
              value={(answers.missing as Record<string, string[]>) ?? {}}
              onChange={(v) => patch("missing", v)}
              language={language}
              t={t}
              disabled={disabled}
            />
          </Section>
          <Section title={t("4. Associer chaque KPI à la bonne question", "4. Associate each KPI to the right question")}>
            <AssociationExercise
              items={M4_PREP_KPI_QUESTIONS.map((k) => ({ id: k.id, evidence: k.kpi }))}
              options={M4_PREP_KPI_QUESTION_OPTIONS}
              value={(answers.kpiQuestions as Record<string, string>) ?? {}}
              onChange={(v) => patch("kpiQuestions", v)}
              language={language}
              t={t}
              disabled={disabled}
            />
          </Section>
        </>
      );
    }

    if (meta.id === "M4-CONS-SAME-KPI-DIFF-DECISION") {
      return (
        <>
          <FactsBanner facts={M4_CONS_FACTS} language={language} t={t} />
          <Section title={t("1. Classer les KPI (Vert / Ambre / Rouge)", "1. Classify KPIs (Green / Amber / Red)")}>
            <LayerClassificationExercise
              fragments={M4_CONS_KPI_COLORS.map((k) => ({ id: k.id, text: k.label }))}
              layers={M4_CONS_COLOR_OPTIONS}
              value={(answers.kpiColors as Record<string, string>) ?? {}}
              onChange={(v) => patch("kpiColors", v)}
              language={language}
              t={t}
              disabled={disabled}
            />
          </Section>
          <Section title={t("2. Choisir le risque prioritaire", "2. Choose the priority risk")}>
            <SingleSelectExercise
              options={[...M4_CONS_PRIORITY_RISK.options]}
              value={answers.priorityRisk as string | undefined}
              onChange={(v) => patch("priorityRisk", v)}
              language={language}
              t={t}
              disabled={disabled}
              testId="m4-cons-priority-risk"
            />
          </Section>
          <Section title={t("3. Vrai / Faux", "3. True / False")}>
            <TrueFalseExercise
              items={M4_CONS_TRUE_FALSE}
              value={(answers.trueFalse as Record<string, boolean | undefined>) ?? {}}
              onChange={(v) => patch("trueFalse", v)}
              language={language}
              t={t}
              disabled={disabled}
            />
          </Section>
          <Section title={t("4. Classer les actions", "4. Classify the actions")}>
            <LayerClassificationExercise
              fragments={M4_CONS_ACTIONS.map((a) => ({ id: a.id, text: a.label }))}
              layers={M4_CONS_ACTION_BUCKETS}
              value={(answers.actionBuckets as Record<string, string>) ?? {}}
              onChange={(v) => patch("actionBuckets", v)}
              language={language}
              t={t}
              disabled={disabled}
            />
          </Section>
          <Section title={t("5. Associer décision et justification", "5. Associate decision and justification")}>
            <AssociationExercise
              items={M4_CONS_DECISION_PAIRS.map((d) => ({ id: d.id, evidence: d.decision }))}
              options={M4_CONS_JUSTIFICATIONS}
              value={(answers.decisionPairs as Record<string, string>) ?? {}}
              onChange={(v) => patch("decisionPairs", v)}
              language={language}
              t={t}
              disabled={disabled}
            />
          </Section>
        </>
      );
    }

    if (meta.id === "M5-PREP-EVIDENCE-TO-DECISION") {
      return (
        <>
          <Section title={t("1. Feu de décision", "1. Decision traffic light")}>
            <LayerClassificationExercise
              fragments={M5_PREP_TRAFFIC.map((x) => ({ id: x.id, text: x.prompt }))}
              layers={M5_TRAFFIC_OPTIONS}
              value={(answers.traffic as Record<string, string>) ?? {}}
              onChange={(v) => patch("traffic", v)}
              language={language}
              t={t}
              disabled={disabled}
            />
          </Section>
          <Section title={t("2. Choisir la preuve / base fiable", "2. Choose the reliable evidence / base")}>
            <SingleSelectExercise
              prompt={M5_PREP_STOCK_BASE.prompt}
              options={[...M5_PREP_STOCK_BASE.options]}
              value={answers.stockBase as string | undefined}
              onChange={(v) => patch("stockBase", v)}
              language={language}
              t={t}
              disabled={disabled}
              testId="m5-prep-stock-base"
            />
          </Section>
          <Section title={t("3. Associer preuve et conséquence", "3. Associate evidence and consequence")}>
            <AssociationExercise
              items={M5_PREP_ASSOC}
              options={M5_PREP_CONSEQUENCES}
              value={(answers.associations as Record<string, string>) ?? {}}
              onChange={(v) => patch("associations", v)}
              language={language}
              t={t}
              disabled={disabled}
            />
          </Section>
          <Section title={t("4. Vrai / Faux", "4. True / False")}>
            <TrueFalseExercise
              items={M5_PREP_TRUE_FALSE}
              value={(answers.trueFalse as Record<string, boolean | undefined>) ?? {}}
              onChange={(v) => patch("trueFalse", v)}
              language={language}
              t={t}
              disabled={disabled}
            />
          </Section>
        </>
      );
    }

    return (
      <>
        <FactsBanner facts={M5_CONS_FACTS} language={language} t={t} />
        <Section title={t("1. Classer les preuves (Vert / Ambre / Rouge)", "1. Classify evidence (Green / Amber / Red)")}>
          <LayerClassificationExercise
            fragments={M5_CONS_EVIDENCE_COLORS.map((e) => ({ id: e.id, text: e.label }))}
            layers={M4_CONS_COLOR_OPTIONS}
            value={(answers.evidenceColors as Record<string, string>) ?? {}}
            onChange={(v) => patch("evidenceColors", v)}
            language={language}
            t={t}
            disabled={disabled}
          />
        </Section>
        <Section title={t("2. Ordonner le parcours", "2. Order the path")}>
          <OrderingExercise
            items={pathOptions}
            value={(answers.ordering as string[]) ?? []}
            onChange={(v) => patch("ordering", v)}
            language={language}
            t={t}
            disabled={disabled}
          />
        </Section>
        <Section title={t("3. Associer preuve et décision", "3. Associate evidence and decision")}>
          <AssociationExercise
            items={M5_CONS_ASSOC}
            options={M5_CONS_DECISIONS}
            value={(answers.associations as Record<string, string>) ?? {}}
            onChange={(v) => patch("associations", v)}
            language={language}
            t={t}
            disabled={disabled}
          />
        </Section>
        <Section title={t("4. Vrai / Faux", "4. True / False")}>
          <TrueFalseExercise
            items={M5_CONS_TRUE_FALSE}
            value={(answers.trueFalse as Record<string, boolean | undefined>) ?? {}}
            onChange={(v) => patch("trueFalse", v)}
            language={language}
            t={t}
            disabled={disabled}
          />
        </Section>
        <Section title={t("5. Classer les actions", "5. Classify the actions")}>
          <LayerClassificationExercise
            fragments={M5_CONS_ACTIONS.map((a) => ({ id: a.id, text: a.label }))}
            layers={M5_CONS_ACTION_BUCKETS}
            value={(answers.actionBuckets as Record<string, string>) ?? {}}
            onChange={(v) => patch("actionBuckets", v)}
            language={language}
            t={t}
            disabled={disabled}
          />
        </Section>
      </>
    );
  };

  return (
    <FioriShell
      title={t("Exercice formatif", "Formative exercise")}
      breadcrumbs={[
        { label: t("Concorde Logistics", "Concorde Logistics"), href: "/student/department" },
        { label: `M${meta.moduleId}`, href: mod.route },
        { label: t("Exercice formatif", "Formative exercise") },
      ]}
    >
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <FormativeExerciseShell
          meta={meta}
          language={language}
          t={t}
          onBack={() => navigate(mod.route)}
          footer={
            <div className="flex flex-wrap gap-2 sticky bottom-0 bg-background/95 backdrop-blur border-t py-3">
              {!completed && (
                <>
                  <Button variant="outline" onClick={handleSave} disabled={saveMut.isPending}>
                    {t("Enregistrer", "Save")}
                  </Button>
                  <Button onClick={handleSubmit} disabled={submitMut.isPending}>
                    {t("Soumettre l’exercice", "Submit exercise")}
                  </Button>
                </>
              )}
              {completed && (
                <>
                  <Button variant="outline" onClick={handleRestart} disabled={restartMut.isPending}>
                    {t("Refaire l’exercice", "Redo exercise")}
                  </Button>
                  <Button onClick={() => navigate(mod.route)}>
                    {t("Retour au module", "Back to module")}
                  </Button>
                </>
              )}
            </div>
          }
        >
          <p className="text-xs text-muted-foreground" data-testid="no-free-text-notice">
            {t(
              "Interactions fermées uniquement — aucune rédaction. La rédaction professionnelle reste dans les scénarios SCN.",
              "Closed interactions only — no free writing. Professional writing stays in SCN scenarios.",
            )}
          </p>
          {renderBody()}
          {completed && score != null && (
            <>
              <FormativeResultSummary formativeScore={score} partScores={partScores} t={t} />
              <FormativeFeedbackPanel items={feedback} language={language} t={t} />
            </>
          )}
        </FormativeExerciseShell>
      )}
    </FioriShell>
  );
}
