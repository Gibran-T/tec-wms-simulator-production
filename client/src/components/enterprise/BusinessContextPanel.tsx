import { Briefcase } from "lucide-react";

interface BusinessContextPanelProps {
  title: string;
  content: string;
}

export default function BusinessContextPanel({ title, content }: BusinessContextPanelProps) {
  return (
    <div className="tec-briefing-panel p-4">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
        <Briefcase size={14} /> {title}
      </h3>
      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{content}</p>
    </div>
  );
}
