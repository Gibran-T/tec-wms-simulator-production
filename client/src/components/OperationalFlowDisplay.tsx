import React from 'react';
import { ChevronRight } from 'lucide-react';

interface OperationalFlowDisplayProps {
  steps: string[];
  currentStep?: string; // Optional: to highlight the current step
}

const OperationalFlowDisplay: React.FC<OperationalFlowDisplayProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-center flex-wrap gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <span className={`px-2 py-1 rounded-full ${currentStep === step ? 'bg-primary text-primary-foreground' : 'bg-slate-100 dark:bg-slate-700'}`}>
            {step}
          </span>
          {index < steps.length - 1 && (
            <ChevronRight size={12} className="text-slate-400" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default OperationalFlowDisplay;
