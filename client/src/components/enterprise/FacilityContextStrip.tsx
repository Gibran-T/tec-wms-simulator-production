import { MapPin, AlertCircle } from "lucide-react";
import { getIncidentById } from "@shared/enterprise/incidents";

interface FacilityContextStripProps {
  warehouseZone?: string;
  businessUnit?: string;
  incidentId?: string | null;
  language: "FR" | "EN";
  t: (fr: string, en: string) => string;
}

export default function FacilityContextStrip({
  warehouseZone,
  businessUnit,
  incidentId,
  language,
  t,
}: FacilityContextStripProps) {
  const incident = incidentId ? getIncidentById(incidentId) : null;
  if (!warehouseZone && !businessUnit && !incident) return null;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {(warehouseZone || businessUnit) && (
        <div className="tec-briefing-panel p-3 flex-1 min-w-[140px]">
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={14} className="text-slate-500" />
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {t("Lieu d'opération", "Operating location")}
            </p>
          </div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white font-mono">
            {warehouseZone ?? "CDC"}
          </p>
          {businessUnit && (
            <p className="text-[10px] text-slate-500 mt-1">
              {t("Unité", "Unit")}: {businessUnit}
            </p>
          )}
        </div>
      )}
      {incident && (
        <div className="tec-briefing-panel p-3 flex-1 min-w-[140px] border-l-4 border-amber-500">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle size={14} className="text-amber-600" />
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              {t("Événement", "Event")} · {incident.id}
            </p>
          </div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {language === "FR" ? incident.nameFr : incident.nameEn}
          </p>
        </div>
      )}
    </div>
  );
}
