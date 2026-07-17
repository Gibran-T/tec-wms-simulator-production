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
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md p-3 space-y-1.5">
        <p className="text-[10px] font-bold text-blue-700 dark:text-blue-300 mb-1">
          💡 {t("Chaîne de raisonnement", "Reasoning chain")}
        </p>
        {isM5Strategic ? (
          <>
            <p className="text-[11px] font-medium text-foreground">
              {t(
                "Preuves → Priorité → Compromis → Horizon",
                "Evidence → Priority → Trade-off → Horizon",
              )}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {t(
                "Citez des KPI du snapshot de cette session. Ne recopiez pas les valeurs du Module 4.",
                "Cite KPIs from this session snapshot. Do not copy Module 4 values.",
              )}
            </p>
          </>
        ) : isRecon ? (
          <>
            <p className="text-[11px] font-medium text-foreground">
              {t(
                "Exécuter → Réconcilier → Vérifier → Décider",
                "Execute → Reconcile → Verify → Decide",
              )}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {t(
                "Basez votre décision sur le stock corrigé, et non sur la quantité avant ajustement.",
                "Base your decision on corrected stock, not the quantity before adjustment.",
              )}
            </p>
          </>
        ) : (
          <>
            <p className="text-[11px] font-medium text-foreground">
              {t(
                "Exécuter → Vérifier → Interpréter → Décider",
                "Execute → Verify → Interpret → Decide",
              )}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {t(
                "Un cycle nominal avec Q = 0 peut être une décision complète — n'inventez pas un problème.",
                "A nominal cycle with Q = 0 can be a complete decision — do not invent a problem.",
              )}
            </p>
          </>
        )}
      </div>
    );
  }

  return null;
}
