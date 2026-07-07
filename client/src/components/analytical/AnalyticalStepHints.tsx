import React from "react";

type TranslateFn = (fr: string, en: string) => string;

interface Props {
  step: string;
  t: TranslateFn;
  isM5Strategic?: boolean;
}

export function AnalyticalStepHints({ step, t, isM5Strategic = false }: Props) {
  const key = step.toLowerCase();

  if (key === "kpi_rotation") {
    return (
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md p-3">
        <p className="text-[10px] font-bold text-blue-700 dark:text-blue-300 mb-1">
          💡 {t("Données de référence", "Reference data")}
        </p>
        <p className="text-[10px] font-mono text-blue-600 dark:text-blue-400">
          {t("Taux de rotation", "Rotation rate")} = 2400 / 400 = <strong>6 fois/an</strong> | DSI = 365/6 ={" "}
          <strong>60 jours</strong>
        </p>
        <p className="text-[10px] text-muted-foreground mt-1">
          {t(
            "Bande normale 4–12×/an — que recommandez-vous au comité finance ?",
            "Normal band 4–12×/yr — what do you recommend to the finance committee?",
          )}
        </p>
      </div>
    );
  }

  if (key === "kpi_service") {
    return (
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md p-3">
        <p className="text-[10px] font-bold text-blue-700 dark:text-blue-300 mb-1">
          💡 {t("Données de référence", "Reference data")}
        </p>
        <p className="text-[10px] font-mono text-blue-600 dark:text-blue-400">
          {t("Taux de service", "Service level")} = 285 / 300 = <strong>95 %</strong> |{" "}
          {t("Erreurs", "Errors")} = 12 / 300 = <strong>4 %</strong>
        </p>
        <p className="text-[10px] text-muted-foreground mt-1">
          {t(
            "Objectif industrie : ≥ 95 % (excellent), < 95 % (à améliorer) — erreurs 1–5 % acceptable",
            "Industry target: ≥ 95% (excellent), < 95% (to improve) — errors 1–5% acceptable",
          )}
        </p>
      </div>
    );
  }

  if (key === "kpi_diagnostic") {
    return (
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md p-3">
        <p className="text-[10px] font-bold text-blue-700 dark:text-blue-300 mb-1">
          💡 {t("Synthèse KPIs", "KPI Summary")}
        </p>
        <p className="text-[10px] font-mono text-blue-600 dark:text-blue-400">
          {t("Rotation", "Rotation")}: 6 ({t("normal", "normal")}) | {t("Service", "Service")}: 95% (
          {t("excellent", "excellent")}) | {t("Erreurs", "Errors")}: 4% ({t("acceptable", "acceptable")}) |{" "}
          {t("Délai", "Lead time")}: 3,5 j
        </p>
        <p className="text-[10px] text-muted-foreground mt-1">
          {t(
            "Structure board : contexte → « Je recommande… » → trade-off → KPIs de suivi 90 j → décision (≥ 150 car. pour SCN-014)",
            "Board structure: context → « I recommend… » → trade-off → 90-day follow-up KPIs → decision (≥ 150 chars for SCN-014)",
          )}
        </p>
      </div>
    );
  }

  if (key === "m5_decision") {
    return (
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md p-3">
        <p className="text-[10px] font-bold text-blue-700 dark:text-blue-300 mb-1">
          💡{" "}
          {isM5Strategic
            ? t("Guide décision stratégique (SCN-017)", "Strategic decision guide (SCN-017)")
            : t("Guide décision tactique", "Tactical decision guide")}
        </p>
        {isM5Strategic ? (
          <p className="text-[10px] text-muted-foreground">
            {t(
              "Citez ≥2 KPI chiffrés du snapshot M5_KPI · trade-off explicite · recommandation · horizon 90–180 j. Réponses génériques rejetées.",
              "Cite ≥2 numeric KPIs from M5_KPI snapshot · explicit trade-off · recommendation · 90–180 day horizon. Generic answers rejected.",
            )}
          </p>
        ) : (
          <p className="text-[10px] text-muted-foreground">
            {t(
              "Analysez les KPI observés (rotation, service, erreurs) et proposez une action opérationnelle : réapprovisionnement, formation, ou amélioration des procédures.",
              "Analyze the observed KPIs (rotation, service, errors) and propose an operational action: replenishment, training, or procedure improvement.",
            )}
          </p>
        )}
      </div>
    );
  }

  return null;
}
