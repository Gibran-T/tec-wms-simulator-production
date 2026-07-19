import type { ReactNode } from "react";
import { getM4VisualContract, isM4VisualScn } from "@shared/m4ScenarioVisualContract";
import { FileText } from "lucide-react";

type TranslateFn = (fr: string, en: string) => string;

/**
 * Concise professional M4 mission debrief — does not repeat the full mission page.
 */
export default function M4MissionDebrief({
  scnCode,
  score,
  passThreshold,
  compliant,
  language,
  t,
  onViewReport,
}: {
  scnCode: string;
  score: number;
  passThreshold: number;
  compliant: boolean;
  language: string;
  t: TranslateFn;
  onViewReport: () => void;
}) {
  const isFr = language === "FR" || language === "fr";
  const contract = getM4VisualContract(scnCode);
  const passed = score >= passThreshold && compliant;
  const title = contract
    ? isFr
      ? contract.titleFr
      : contract.titleEn
    : isM4VisualScn(scnCode)
      ? scnCode
      : t("Module 4", "Module 4");

  return (
    <div
      className="border-l-8 border-green-600 bg-green-50 dark:bg-green-950/20 p-5 space-y-4"
      data-testid="m4-mission-debrief"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {t("Débrief professionnel", "Professional debrief")}
          </p>
          <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            {t("MISSION TERMINÉE", "MISSION COMPLETE")}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">{title}</p>
        </div>
        <button
          type="button"
          onClick={onViewReport}
          className="bg-green-700 hover:bg-green-600 text-white font-black px-6 py-3 rounded-none transition-transform active:scale-95 flex items-center gap-2 shadow-lg shrink-0"
          data-testid="m4-debrief-report-cta"
        >
          <FileText size={18} />
          {t("VOIR LE RAPPORT", "VIEW REPORT")}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-[11px]">
        <DebriefBlock
          label={t("RÉSULTAT", "RESULT")}
          testId="m4-debrief-result"
          body={
            <>
              <p className="font-bold text-base">
                {score}/100 — {passed ? t("Mission réussie", "Mission successful") : t("À renforcer", "Needs strengthening")}
              </p>
              <p className="text-muted-foreground mt-0.5">
                {t("Seuil", "Threshold")} {passThreshold} ·{" "}
                {compliant
                  ? t("Conformité OK", "Compliance OK")
                  : t("Conformité à revoir", "Compliance to review")}
              </p>
            </>
          }
        />
        {contract && (
          <>
            <DebriefBlock
              label={t("LECTURE", "READING")}
              testId="m4-debrief-lecture"
              body={<p>{isFr ? contract.debrief.lectureFr : contract.debrief.lectureEn}</p>}
            />
            <DebriefBlock
              label={t("DÉCISION", "DECISION")}
              testId="m4-debrief-decision"
              body={<p>{isFr ? contract.debrief.decisionFr : contract.debrief.decisionEn}</p>}
            />
            <DebriefBlock
              label={t("IMPACT", "IMPACT")}
              testId="m4-debrief-impact"
              body={<p>{isFr ? contract.debrief.impactFr : contract.debrief.impactEn}</p>}
            />
            <DebriefBlock
              label={t("LEÇON", "LESSON")}
              testId="m4-debrief-lesson"
              body={<p className="font-medium">{isFr ? contract.debrief.lessonFr : contract.debrief.lessonEn}</p>}
            />
          </>
        )}
      </div>

      <details className="text-[10px] border border-border rounded-sm bg-card/80 open:bg-card" data-testid="m4-debrief-technical">
        <summary className="cursor-pointer px-3 py-2 font-bold uppercase text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          {t("Preuves techniques (détail)", "Technical evidence (detail)")}
        </summary>
        <div className="px-3 pb-3 text-muted-foreground space-y-1">
          <p>
            {t(
              "Les interprétations KPI, la piste d'évidence et le rapport complet restent disponibles via le CTA rapport.",
              "KPI interpretations, the evidence trail, and the full report remain available via the report CTA.",
            )}
          </p>
          {contract && (
            <p>
              {t("Focus scénario", "Scenario focus")} :{" "}
              {isFr ? contract.dominantFocusFr : contract.dominantFocusEn}
            </p>
          )}
        </div>
      </details>
    </div>
  );
}

function DebriefBlock({
  label,
  body,
  testId,
}: {
  label: string;
  body: ReactNode;
  testId: string;
}) {
  return (
    <div className="border border-border rounded-sm p-3 bg-card" data-testid={testId}>
      <p className="text-[9px] font-bold uppercase text-slate-500 tracking-wider mb-1">{label}</p>
      <div className="text-foreground leading-snug">{body}</div>
    </div>
  );
}
