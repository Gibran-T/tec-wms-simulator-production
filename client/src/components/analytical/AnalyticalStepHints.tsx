import React from "react";

type TranslateFn = (fr: string, en: string) => string;

interface Props {
  step: string;
  t: TranslateFn;
  isM5Strategic?: boolean;
  scnCode?: string | null;
}

/** Hints guide reasoning blocks — they must not reveal the final answer. */
export function AnalyticalStepHints({ step, t, isM5Strategic = false, scnCode = null }: Props) {
  const key = step.toLowerCase();

  if (key === "kpi_rotation") {
    return (
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md p-3">
        <p className="text-[10px] font-bold text-blue-700 dark:text-blue-300 mb-1">
          💡 {t("Chaîne de raisonnement", "Reasoning chain")}
        </p>
        <p className="text-[10px] text-muted-foreground">
          {t(
            "Observer → Classifier → Décider → Suivre. Données : consommation et stock moyen. Consultez la bande de référence dans le glossaire si besoin — calculez et classifiez vous-même.",
            "Observe → Classify → Decide → Follow up. Data: consumption and average stock. Check the reference band in the glossary if needed — calculate and classify yourself.",
          )}
        </p>
      </div>
    );
  }

  if (key === "kpi_service") {
    return (
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md p-3">
        <p className="text-[10px] font-bold text-blue-700 dark:text-blue-300 mb-1">
          💡 {t("Chaîne de raisonnement", "Reasoning chain")}
        </p>
        <p className="text-[10px] text-muted-foreground">
          {t(
            "Observer les commandes livrées / total et les erreurs. Classifier chaque indicateur, puis décider. Les seuils industriels sont dans l'aide — pas dans la réponse pré-écrite.",
            "Observe delivered/total orders and errors. Classify each indicator, then decide. Industry thresholds are in help — not as a pre-written answer.",
          )}
        </p>
      </div>
    );
  }

  if (key === "kpi_diagnostic") {
    return (
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md p-3">
        <p className="text-[10px] font-bold text-blue-700 dark:text-blue-300 mb-1">
          💡 {t("Blocs attendus", "Expected blocks")}
        </p>
        <p className="text-[10px] text-muted-foreground">
          {t(
            "Votre réponse doit démontrer : classification · décision · suivi (et compromis si S&OP). Une réponse courte et cohérente suffit. Utilisez vos propres mots.",
            "Your answer should show: classification · decision · follow-up (and trade-off for S&OP). A short coherent answer is enough. Use your own words.",
          )}
        </p>
      </div>
    );
  }

  if (key === "m5_decision") {
    const isRecon = scnCode === "SCN-016";
    return (
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md p-3">
        <p className="text-[10px] font-bold text-blue-700 dark:text-blue-300 mb-1">
          💡{" "}
          {isM5Strategic
            ? t("Décision stratégique", "Strategic decision")
            : isRecon
              ? t("Décision tactique après réconciliation", "Tactical decision after reconciliation")
              : t("Décision tactique", "Tactical decision")}
        </p>
        {isM5Strategic ? (
          <p className="text-[10px] text-muted-foreground">
            {t(
              "Preuves (KPI du snapshot de session) → Priorité → Compromis → Horizon. Ne recopiez pas les valeurs du Module 4.",
              "Evidence (session snapshot KPIs) → Priority → Trade-off → Horizon. Do not copy Module 4 values.",
            )}
          </p>
        ) : (
          <p className="text-[10px] text-muted-foreground">
            {t(
              isRecon
                ? "Exécuter → Vérifier → Corriger si nécessaire → Décider. Basez-vous sur le stock corrigé. Q = 0 peut être correct."
                : "Exécuter → Vérifier → Décider. Un cycle nominal avec Q = 0 peut être une décision complète — n'inventez pas un problème.",
              isRecon
                ? "Execute → Verify → Correct if needed → Decide. Use corrected stock. Q = 0 can be correct."
                : "Execute → Verify → Decide. A nominal cycle with Q = 0 can be a complete decision — do not invent a problem.",
            )}
          </p>
        )}
      </div>
    );
  }

  return null;
}
