import {
  type M4KpiSnapshot,
  getBandClasses,
  getM4EmphasisKeys,
  mapErrorStatusToBand,
  mapLeadTimeBandToColor,
  mapRotationStatusToBand,
  mapServiceStatusToBand,
  rotationBandLabel,
  serviceBandLabel,
  errorBandLabel,
  leadTimeBand,
  leadTimeBandLabel,
  formatM4ServicePct,
  formatM4ErrorPct,
  formatM4LeadTime,
  formatM4Capital,
} from "@/data/m4KpiBandUtils";

type TileDef = {
  key: string;
  labelFr: string;
  labelEn: string;
  value: string;
  bandLabel: string;
  bandColor: ReturnType<typeof mapRotationStatusToBand>;
};

export default function M4KpiTiles({
  snapshot,
  scnCode,
  language,
  t,
}: {
  snapshot: M4KpiSnapshot;
  scnCode: string;
  language: string;
  t: (fr: string, en: string) => string;
}) {
  const isFr = language === "FR";
  const ltBand = leadTimeBand(snapshot.averageLeadTime);
  const emphasis = getM4EmphasisKeys(scnCode);

  const tiles: TileDef[] = [
    {
      key: "rotation",
      labelFr: "Rotation des stocks",
      labelEn: "Inventory Turnover",
      value: `${snapshot.rotationRate}×`,
      bandLabel: rotationBandLabel(snapshot.rotationStatus, language),
      bandColor: mapRotationStatusToBand(snapshot.rotationStatus),
    },
    {
      key: "service",
      labelFr: "Taux de service (OTIF)",
      labelEn: "Service Level (OTIF)",
      value: formatM4ServicePct(snapshot.serviceLevel, language),
      bandLabel: serviceBandLabel(snapshot.serviceLevelStatus, language),
      bandColor: mapServiceStatusToBand(snapshot.serviceLevelStatus),
    },
    {
      key: "errorRate",
      labelFr: "Taux d'erreur",
      labelEn: "Error Rate",
      value: formatM4ErrorPct(snapshot.errorRate, language),
      bandLabel: errorBandLabel(snapshot.errorRateStatus, language),
      bandColor: mapErrorStatusToBand(snapshot.errorRateStatus),
    },
    {
      key: "leadTime",
      labelFr: "Délai fournisseur",
      labelEn: "Supplier Lead Time",
      value: formatM4LeadTime(snapshot.averageLeadTime, language),
      bandLabel: leadTimeBandLabel(ltBand, language),
      bandColor: mapLeadTimeBandToColor(ltBand),
    },
  ];

  return (
    <div className="space-y-2" data-testid="m4-kpi-tiles">
      <div>
        <p className="text-[10px] font-bold text-primary uppercase">
          {t("Indicateurs KPI — Annexe A", "KPI Indicators — Annex A")}
        </p>
        <p className="text-[9px] text-muted-foreground italic">
          {t("Valeurs contrat scénario (lecture seule)", "Scenario contract values (read-only)")}
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {tiles.map((tile) => {
          const cls = getBandClasses(tile.bandColor);
          const emphasized = emphasis.includes(tile.key);
          return (
            <div
              key={tile.key}
              data-testid={`m4-kpi-tile-${tile.key}`}
              className={`p-2 border rounded-sm ${cls.border} ${cls.bg} ${emphasized ? "ring-2 ring-primary/40" : ""}`}
            >
              <p className="text-[9px] font-bold uppercase text-slate-500">
                {isFr ? tile.labelFr : tile.labelEn}
              </p>
              <p className={`text-sm font-bold font-mono mt-0.5 ${cls.text}`}>{tile.value}</p>
              <span className={`inline-block mt-1 text-[8px] font-bold px-1.5 py-0.5 border rounded-sm ${cls.border} ${cls.text}`}>
                {tile.bandLabel}
              </span>
            </div>
          );
        })}
      </div>
      <div
        data-testid="m4-kpi-tile-capital"
        className="p-2 border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 rounded-sm"
      >
        <p className="text-[9px] font-bold uppercase text-slate-500">
          {t("Capital immobilisé", "Tied-up capital")}
        </p>
        <p className="text-sm font-bold font-mono text-slate-600 dark:text-slate-400 mt-0.5">
          {formatM4Capital(snapshot.stockImmobilizedValue, language)}
        </p>
      </div>
    </div>
  );
}
