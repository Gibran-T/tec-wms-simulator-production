import { ChevronRight } from "lucide-react";
import React from "react";

interface OperationalFlowDisplayProps {
  steps: string[];
  currentStep?: string;
  /** Optional completed steps for process-strip progress */
  completedSteps?: string[];
}

/**
 * Persistent process strip (SAP Document-Flow pedagogical analogue).
 */
const OperationalFlowDisplay: React.FC<OperationalFlowDisplayProps> = ({
  steps,
  currentStep,
  completedSteps = [],
}) => {
  const completed = new Set(completedSteps.map((s) => s.toUpperCase()));

  return (
    <div
      className="flex items-center justify-center flex-wrap gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400"
      data-testid="process-flow-strip"
      aria-label="Process flow"
    >
      {steps.map((step, index) => {
        const key = step.toUpperCase();
        const isCurrent = currentStep?.toUpperCase() === key;
        const isDone = completed.has(key);
        return (
          <React.Fragment key={`${step}-${index}`}>
            <span
              className={`px-2 py-1 rounded-full border ${
                isCurrent
                  ? "bg-primary text-primary-foreground border-primary"
                  : isDone
                    ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                    : "bg-slate-100 dark:bg-slate-700 border-transparent"
              }`}
            >
              {step}
            </span>
            {index < steps.length - 1 && (
              <ChevronRight size={12} className="text-slate-400" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default OperationalFlowDisplay;
