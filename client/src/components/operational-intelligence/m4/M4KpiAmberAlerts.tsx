import { AlertTriangle } from "lucide-react";
import type { M4KpiInterpretationRow } from "@/data/m4KpiBandUtils";

function latestInterpretation(
  rows: M4KpiInterpretationRow[] | undefined,
  kpiKey: string,
): M4KpiInterpretationRow | undefined {
  if (!rows?.length) return undefined;
  const matches = rows.filter((r) => r.kpiKey === kpiKey);
  return matches[matches.length - 1];
}

function hasIncorrectInterpretation(rows: M4KpiInterpretationRow[] | undefined): boolean {
  return !!rows?.some((r) => !r.isCorrect);
}

export default function M4KpiAmberAlerts({
  scnCode,
  completedSteps,
  kpiInterpretations,
  t,
}: {
  scnCode: string;
  completedSteps: string[];
  kpiInterpretations?: M4KpiInterpretationRow[];
  t: (fr: string, en: string) => string;
}) {
  const messages: string[] = [];

  const wrongRotation = latestInterpretation(kpiInterpretations, "rotationRate");
  if (wrongRotation && !wrongRotation.isCorrect) {
    messages.push(
      t(
        "Interprétation rotation à revoir — consultez la bande Annexe A (4–12×/an). Un taux de 6× se situe en zone normale.",
        "Rotation interpretation needs review — see Annex A band (4–12×/yr). A rate of 6× is in the normal zone.",
      ),
    );
  }

  const wrongService = latestInterpretation(kpiInterpretations, "serviceLevel");
  if (wrongService && !wrongService.isCorrect) {
    messages.push(
      t(
        "Interprétation service à revoir — 95 % correspond au seuil excellent (≥ 95 %).",
        "Service interpretation needs review — 95% meets the excellent threshold (≥ 95%).",
      ),
    );
  }

  const wrongDiagnostic = latestInterpretation(kpiInterpretations, "diagnostic");
  if (wrongDiagnostic && !wrongDiagnostic.isCorrect) {
    messages.push(
      t(
        "Analyse incomplète — intégrez recommandation stratégique et arbitrage KPI.",
        "Incomplete analysis — integrate strategic recommendation and KPI trade-off.",
      ),
    );
  }

  if (messages.length === 0 && !hasIncorrectInterpretation(kpiInterpretations)) {
    if (
      scnCode === "SCN-012"
      && completedSteps.includes("KPI_DATA")
      && !completedSteps.includes("KPI_ROTATION")
    ) {
      messages.push(
        t(
          "6× = bande normale — évitez un diagnostic « surstock » par réflexe.",
          "6× = normal band — avoid reflex « overstock » classification.",
        ),
      );
    }

    if (
      scnCode === "SCN-013"
      && completedSteps.includes("KPI_DATA")
      && !completedSteps.includes("KPI_SERVICE")
    ) {
      messages.push(
        t(
          "Rappel : le tableau affiche 95 % OTIF, mais le taux d'erreur de 4 % peut fragiliser le service — corrélation à documenter à l'étape Service.",
          "Reminder: dashboard shows 95% OTIF, but 4% error rate can erode service — document the correlation at the Service step.",
        ),
      );
    }

    if (
      scnCode === "SCN-014"
      && completedSteps.includes("KPI_SERVICE")
      && !completedSteps.includes("KPI_DIAGNOSTIC")
    ) {
      messages.push(
        t(
          "Capstone multi-KPI : intégrez rotation, service, erreurs et délai 3,5 j dans un même arbitrage — évitez une décision mono-indicateur.",
          "Multi-KPI capstone: integrate turnover, service, errors, and 3.5-day lead time in one trade-off — avoid single-KPI decisions.",
        ),
      );
    }
  }

  if (messages.length === 0) return null;

  return (
    <div
      data-testid="m4-kpi-amber-alert"
      className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-300 border-l-4 border-l-amber-500 flex gap-2"
    >
      <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
      <div className="space-y-1">
        <span className="inline-block text-[9px] font-bold uppercase text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 px-1.5 py-0.5 rounded-sm">
          {t("Alerte pédagogique", "Pedagogical alert")}
        </span>
        <p className="text-[10px] text-amber-900 dark:text-amber-200 leading-relaxed">
          {messages.join(" · ")}
        </p>
      </div>
    </div>
  );
}
