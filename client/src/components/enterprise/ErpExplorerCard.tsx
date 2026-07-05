import { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp, Layers } from "lucide-react";
import type { ProcessCardSummary } from "@shared/enterpriseContext/types";

interface ErpExplorerCardProps {
  cards: ProcessCardSummary[];
  activeProcessId?: string | null;
  language: "FR" | "EN";
  t: (fr: string, en: string) => string;
  compact?: boolean;
}

export default function ErpExplorerCard({
  cards,
  activeProcessId,
  language,
  t,
  compact = false,
}: ErpExplorerCardProps) {
  const [expanded, setExpanded] = useState(!compact);
  const activeId = activeProcessId ?? cards.find((c) => c.isActiveForStep)?.processId ?? cards[0]?.processId;
  const activeCard = cards.find((c) => c.processId === activeId) ?? cards[0];

  if (!activeCard) return null;

  return (
    <div className="tec-briefing-panel border border-slate-200 dark:border-slate-700">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
      >
        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <BookOpen size={14} className="text-primary" />
          {t("Transfert de concepts ERP", "ERP concept transfer")}
          <span className="font-mono text-[10px] text-primary normal-case">{activeCard.processId}</span>
        </span>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {expanded && (
        <div className="p-4 space-y-4">
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {language === "FR" ? activeCard.titleFr : activeCard.titleEn}
            </p>
            <p className="text-[10px] font-mono text-slate-500 mt-1">
              {t("Ancre TEC.WMS", "TEC.WMS anchor")}: {activeCard.wmsAnchor}
            </p>
          </div>
          <blockquote className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed border-l-4 border-primary pl-3 italic">
            {language === "FR" ? activeCard.learningTransferFr : activeCard.learningTransferEn}
          </blockquote>
          <p className="text-[10px] text-slate-500">
            {t(
              "Référence conceptuelle — SAP · Oracle · Dynamics · Odoo (Process Mapping v1.0)",
              "Concept reference — SAP · Oracle · Dynamics · Odoo (Process Mapping v1.0)"
            )}
          </p>

          {cards.length > 1 && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                <Layers size={12} />
                {t("Famille de processus", "Process family")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {cards.map((card) => (
                  <span
                    key={card.processId}
                    className={`text-[10px] font-mono px-2 py-0.5 ${
                      card.processId === activeId
                        ? "bg-primary text-primary-foreground font-bold"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {card.processId}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
