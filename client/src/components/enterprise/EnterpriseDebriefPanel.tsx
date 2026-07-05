import type { ElementType } from "react";
import { Briefcase, CheckCircle2, Compass, FileSearch, MessageSquareQuote, UserCog } from "lucide-react";
import type { EnterpriseDebriefContent } from "@shared/enterprise/debrief";
import { pickDebriefLanguage } from "@shared/enterprise/debrief";

interface EnterpriseDebriefPanelProps {
  debrief: EnterpriseDebriefContent;
  language: "FR" | "EN";
  t: (fr: string, en: string) => string;
}

function DebriefSection({
  icon: Icon,
  title,
  children,
}: {
  icon: ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="tec-briefing-panel p-4 space-y-2">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
        <Icon size={14} className="text-primary" />
        {title}
      </h3>
      <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{children}</div>
    </div>
  );
}

/** Run Report enterprise debrief — Manifesto Part XII §12.2–12.3 */
export default function EnterpriseDebriefPanel({ debrief, language, t }: EnterpriseDebriefPanelProps) {
  const lang = language === "FR" ? "fr" : "en";

  return (
    <div className="bg-card border border-border rounded-md overflow-hidden">
      <div className="tec-enterprise-header px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
          Concorde Logistics · {t("Débrief professionnel", "Professional debrief")}
        </p>
        <p className="text-lg font-bold text-white mt-1 leading-snug">{debrief.missionTitle}</p>
        <p className="text-xs text-slate-300 mt-2 italic">{debrief.businessProblem}</p>
      </div>

      <div className="p-5 space-y-4">
        <DebriefSection icon={Briefcase} title={t("Résultat d'affaires", "Business result")}>
          {pickDebriefLanguage(lang, debrief.businessResult)}
        </DebriefSection>

        <DebriefSection icon={FileSearch} title={t("Piste de preuves", "Evidence trail")}>
          {pickDebriefLanguage(lang, debrief.evidenceTrail)}
        </DebriefSection>

        <DebriefSection icon={Compass} title={t("Revue des décisions", "Decision review")}>
          {pickDebriefLanguage(lang, debrief.decisionReview)}
        </DebriefSection>

        <div className="tec-supervisor-callout p-4">
          <h3 className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2 mb-2">
            <MessageSquareQuote size={14} />
            {t("Évaluation du superviseur", "Supervisor evaluation")}
          </h3>
          <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed italic">
            {pickDebriefLanguage(lang, debrief.supervisorEvaluation)}
          </p>
        </div>

        <DebriefSection icon={UserCog} title={t("Réflexion carrière", "Career reflection")}>
          <p>{pickDebriefLanguage(lang, debrief.careerReflection)}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-[10px] font-bold uppercase bg-primary/10 text-primary px-2 py-1">
              {pickDebriefLanguage(lang, debrief.careerSignalPrimary)}
            </span>
            <span className="text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1">
              {pickDebriefLanguage(lang, debrief.careerSignalSecondary)}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
            <CheckCircle2 size={12} />
            {t("Signal carrière — non certifiant", "Career signal — non-certification")}
          </p>
        </DebriefSection>
      </div>
    </div>
  );
}
