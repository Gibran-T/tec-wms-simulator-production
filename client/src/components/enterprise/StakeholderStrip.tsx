import { Truck, Users } from "lucide-react";
import type { StakeholderRef } from "@shared/enterpriseBriefing";

interface StakeholderStripProps {
  customer?: StakeholderRef | null;
  supplier?: StakeholderRef | null;
  language: "FR" | "EN";
  t: (fr: string, en: string) => string;
}

function StakeholderPanel({
  icon: Icon,
  label,
  stakeholder,
  language,
}: {
  icon: typeof Users;
  label: string;
  stakeholder: StakeholderRef;
  language: "FR" | "EN";
}) {
  return (
    <div className="tec-briefing-panel p-3 flex-1 min-w-[140px]">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={14} className="text-slate-500" />
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
      </div>
      <p className="text-sm font-semibold text-slate-900 dark:text-white">{stakeholder.name}</p>
      <p className="text-[10px] font-mono text-slate-500">{stakeholder.code}</p>
      {stakeholder.slaProfile && (
        <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
          {language === "FR" ? stakeholder.slaProfile.fr : stakeholder.slaProfile.en}
        </p>
      )}
    </div>
  );
}

export default function StakeholderStrip({ customer, supplier, language, t }: StakeholderStripProps) {
  if (!customer && !supplier) return null;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {customer && (
        <StakeholderPanel
          icon={Users}
          label={t("Client", "Customer")}
          stakeholder={customer}
          language={language}
        />
      )}
      {supplier && (
        <StakeholderPanel
          icon={Truck}
          label={t("Fournisseur", "Supplier")}
          stakeholder={supplier}
          language={language}
        />
      )}
    </div>
  );
}
