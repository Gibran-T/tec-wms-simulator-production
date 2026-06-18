import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { aggregateZoneFlow, ZONE_PALETTE, type TxLike, type WarehouseZone } from "@shared/zoneMapping";

export type ZoneFlowReportRow = {
  zone: string;
  color: string;
  txCount: number;
};

function ZoneFlowBars({
  rows,
  maxCount,
  language,
}: {
  rows: Array<{ zone: WarehouseZone | string; color: string; txCount: number; docTypes?: string[] }>;
  maxCount: number;
  language: string;
}) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-wrap gap-3">
      {rows.map((row) => {
        const zoneKey = row.zone as WarehouseZone;
        const meta = ZONE_PALETTE[zoneKey] ?? { labelFr: row.zone, labelEn: row.zone };
        const pct = maxCount > 0 ? Math.round((row.txCount / maxCount) * 100) : 0;
        const label = language === "FR" ? meta.labelFr : meta.labelEn;
        return (
          <div key={row.zone} className="flex-1 min-w-[100px] max-w-[160px]" title={row.docTypes?.join(", ") ?? ""}>
            <div className="flex justify-between text-[9px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">
              <span>{label}</span>
              <span>{row.txCount} tx</span>
            </div>
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-sm overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{ width: `${pct}%`, backgroundColor: row.color, opacity: row.txCount > 0 ? 1 : 0.25 }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function M5ZoneFlowBarReport({ rows, language }: { rows: ZoneFlowReportRow[]; language?: string }) {
  const { t, language: ctxLang } = useLanguage();
  const lang = language ?? ctxLang;
  if (rows.length === 0) return null;
  const maxCount = Math.max(...rows.map((r) => r.txCount), 1);
  return (
    <div data-testid="m5-zone-flow-report">
      <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">
        {t("Preuve flux entrepôt", "Warehouse flow evidence")}
      </p>
      <ZoneFlowBars rows={rows} maxCount={maxCount} language={lang} />
    </div>
  );
}

export default function M5ZoneFlowBar({ transactions }: { transactions: TxLike[] }) {
  const { t, language } = useLanguage();
  const rows = aggregateZoneFlow(transactions);
  const maxCount = Math.max(...rows.map((r) => r.txCount), 1);

  return (
    <div className="bg-card border border-border rounded-none shadow-sm overflow-hidden" data-testid="m5-zone-flow-bar">
      <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 border-b border-border">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {t("Preuve flux entrepôt — Zone Flow", "Warehouse flow evidence — Zone Flow")}
        </span>
      </div>
      <div className="p-4">
        <ZoneFlowBars rows={rows} maxCount={maxCount} language={language} />
      </div>
    </div>
  );
}
