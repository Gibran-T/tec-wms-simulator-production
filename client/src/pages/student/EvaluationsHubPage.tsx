import FioriShell from "@/components/FioriShell";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
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
  ClipboardList,
  Clock,
  BookOpen,
  CheckCircle2,
  Lock,
  PlayCircle,
  RotateCcw,
  Target,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

function statusVariant(
  releaseLevel: string,
  passed: boolean,
  canStart: boolean,
  inProgressAttemptId: number | null
): "default" | "secondary" | "destructive" | "outline" {
  if (inProgressAttemptId) return "default";
  if (passed) return "default";
  if (canStart) return "default";
  if (releaseLevel === "visible_pending") return "secondary";
  if (releaseLevel === "closed" || releaseLevel === "cancelled") return "destructive";
  return "outline";
}

export default function EvaluationsHubPage() {
  const { t, language } = useLanguage();
  const [, navigate] = useLocation();

  const { data: hub, isLoading, refetch } = trpc.assessments.hub.useQuery();

  const startMutation = trpc.assessments.start.useMutation({
    onSuccess: (res) => {
      navigate(`/student/evaluations/attempt/${res.attemptId}`);
    },
  });

  function handleStart(assessmentId: number) {
    startMutation.mutate({ assessmentId });
  }

  function handleResume(attemptId: number) {
    navigate(`/student/evaluations/attempt/${attemptId}`);
  }

  return (
    <FioriShell
      title={t("Évaluations", "Assessments")}
      breadcrumbs={[
        { label: t("Accueil", "Home"), href: "/student" },
        { label: t("Évaluations", "Assessments") },
      ]}
    >
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ClipboardList className="size-6 text-primary" />
            {t("Évaluations intégrées", "Integrated Assessments")}
          </h1>
          <p className="text-muted-foreground text-sm">
            {t(
              "Vos évaluations théoriques pour valider les compétences WMS.",
              "Your theoretical assessments to validate WMS competencies."
            )}
          </p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-48 rounded-xl border bg-muted animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Assessment cards */}
        {!isLoading && hub && hub.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              <AlertCircle className="size-8 mx-auto mb-2 opacity-40" />
              <p>{t("Aucune évaluation disponible.", "No assessment available.")}</p>
            </CardContent>
          </Card>
        )}

        {!isLoading &&
          hub?.map((item) => {
            const title =
              language === "FR" ? item.titleFr : (item.titleEn ?? item.titleFr);
            const purpose =
              language === "FR"
                ? item.purposeFr
                : (item.purposeEn ?? item.purposeFr);
            const isComingSoon =
              item.status !== "ready" ||
              item.releaseLevel === "visible_pending" ||
              item.releaseLevel === "unpublished";
            const isPending =
              !item.canStart &&
              !item.inProgressAttemptId &&
              (item.releaseLevel === "released_cohort" ||
                item.releaseLevel === "released_students" ||
                item.releaseLevel === "scheduled") &&
              item.status === "ready";

            return (
              <Card
                key={item.id}
                className={`relative overflow-hidden transition-shadow hover:shadow-md ${
                  isComingSoon ? "opacity-80" : ""
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge
                          variant={statusVariant(
                            item.releaseLevel,
                            item.passed,
                            item.canStart,
                            item.inProgressAttemptId
                          )}
                          className="text-xs"
                        >
                          {item.statusLabel}
                        </Badge>
                        {item.passed && (
                          <Badge
                            variant="default"
                            className="bg-green-600 text-white text-xs"
                          >
                            <CheckCircle2 className="size-3 mr-1" />
                            {t("Réussi", "Passed")}
                          </Badge>
                        )}
                        {isComingSoon && (
                          <Badge variant="secondary" className="text-xs">
                            {t("À venir", "Coming soon")}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-base leading-snug">
                        {title}
                      </CardTitle>
                    </div>
                    {item.inProgressAttemptId && (
                      <div className="shrink-0 size-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <PlayCircle className="size-5 text-primary" />
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Meta info row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">
                        {t("Modules", "Modules")}
                      </span>
                      <span className="font-medium flex items-center gap-1">
                        <BookOpen className="size-3.5 text-muted-foreground" />
                        {Array.isArray(item.modulesCovered) ? item.modulesCovered.join(", ") : "—"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">
                        {t("Durée", "Duration")}
                      </span>
                      <span className="font-medium flex items-center gap-1">
                        <Clock className="size-3.5 text-muted-foreground" />
                        {item.durationMinutes} min
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">
                        {t("Seuil", "Passing")}
                      </span>
                      <span className="font-medium flex items-center gap-1">
                        <Target className="size-3.5 text-muted-foreground" />
                        {item.passingScore}%
                      </span>
                    </div>
                    {item.bestScore != null && (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">
                          {t("Meilleur score", "Best score")}
                        </span>
                        <span className="font-medium">
                          {item.bestScore}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Purpose */}
                  {purpose && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {purpose}
                    </p>
                  )}

                  {/* Attempt count badge */}
                  {item.attemptCount > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {item.attemptCount === 1
                        ? t("1 tentative enregistrée", "1 attempt recorded")
                        : t(
                            `${item.attemptCount} tentatives enregistrées`,
                            `${item.attemptCount} attempts recorded`
                          )}
                    </p>
                  )}

                  {/* Action area */}
                  <div className="flex items-center gap-3 pt-1">
                    {item.inProgressAttemptId ? (
                      <Button
                        size="sm"
                        onClick={() => handleResume(item.inProgressAttemptId!)}
                      >
                        <RotateCcw className="size-4" />
                        {t("Reprendre", "Resume")}
                      </Button>
                    ) : item.canStart ? (
                      <Button
                        size="sm"
                        onClick={() => handleStart(item.id)}
                        disabled={startMutation.isPending}
                      >
                        <PlayCircle className="size-4" />
                        {startMutation.isPending
                          ? t("Démarrage…", "Starting…")
                          : t("Commencer", "Start")}
                      </Button>
                    ) : isPending ? (
                      <div className="flex items-center gap-2 text-sm text-amber-600">
                        <Lock className="size-4 shrink-0" />
                        <span>
                          {t(
                            "En attente de libération du professeur",
                            "Awaiting professor release"
                          )}
                        </span>
                      </div>
                    ) : isComingSoon ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Lock className="size-4 shrink-0" />
                        <span>
                          {t(
                            "Banque de questions en préparation",
                            "Question bank in preparation"
                          )}
                        </span>
                      </div>
                    ) : item.passed ? (
                      <div className="flex items-center gap-2 text-sm text-green-700">
                        <CheckCircle2 className="size-4 shrink-0" />
                        <span>
                          {t("Évaluation réussie", "Assessment passed")}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Lock className="size-4 shrink-0" />
                        <span>
                          {t(
                            "Non disponible pour le moment",
                            "Not available at this time"
                          )}
                        </span>
                      </div>
                    )}

                    {/* If submitted+failed: retake note */}
                    {!item.canStart &&
                      !item.inProgressAttemptId &&
                      item.attemptCount > 0 &&
                      !item.passed &&
                      !isComingSoon && (
                        <span className="text-xs text-muted-foreground ml-auto">
                          {item.retakeAuthorized
                            ? t(
                                "Reprise autorisée",
                                "Retake authorized"
                              )
                            : t(
                                "Contactez votre professeur pour une reprise",
                                "Contact your professor for a retake"
                              )}
                        </span>
                      )}
                  </div>

                  {/* M4 unlock status */}
                  {item.passed && item.m4UnlockStatus === "unlocked" && (
                    <div className="flex items-center gap-2 text-sm text-green-700 border border-green-200 bg-green-50 rounded-lg px-3 py-2">
                      <ChevronRight className="size-4" />
                      {t(
                        "Module 4 déverrouillé — Accédez aux simulations avancées",
                        "Module 4 unlocked — Access advanced simulations"
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
      </div>
    </FioriShell>
  );
}
