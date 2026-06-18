/** Display-only bin → zone mapping (mirrors server detailedReport logic). */

export const RECEPTION_BINS = ["REC-01", "REC-02"] as const;
export const STOCKAGE_BINS = ["B-01-R1-L1", "B-01-R1-L2", "B-02-R1-L1", "TRANSIT-01"] as const;
export const PICKING_BINS = ["A-01-R1-L1", "A-01-R1-L2", "A-02-R1-L1"] as const;
export const EXPEDITION_BINS = ["EXP-01", "EXP-02"] as const;
export const RESERVE_BINS = ["C-01-R1-L1", "C-01-R1-L2"] as const;

export type WarehouseZone = "RÉCEPTION" | "STOCKAGE" | "PICKING" | "EXPÉDITION" | "RÉSERVE" | "INCONNU";

export const ZONE_PALETTE: Record<WarehouseZone, { color: string; labelFr: string; labelEn: string }> = {
  RÉCEPTION: { color: "#3b82f6", labelFr: "RÉCEPTION", labelEn: "RECEIVING" },
  STOCKAGE: { color: "#10b981", labelFr: "STOCKAGE", labelEn: "STORAGE" },
  PICKING: { color: "#f59e0b", labelFr: "PICKING", labelEn: "PICKING" },
  EXPÉDITION: { color: "#8b5cf6", labelFr: "EXPÉDITION", labelEn: "SHIPPING" },
  RÉSERVE: { color: "#6b7280", labelFr: "RÉSERVE", labelEn: "RESERVE" },
  INCONNU: { color: "#94a3b8", labelFr: "INCONNU", labelEn: "UNKNOWN" },
};

export function binToZone(bin: string): WarehouseZone {
  if (RECEPTION_BINS.includes(bin as (typeof RECEPTION_BINS)[number])) return "RÉCEPTION";
  if (STOCKAGE_BINS.includes(bin as (typeof STOCKAGE_BINS)[number])) return "STOCKAGE";
  if (PICKING_BINS.includes(bin as (typeof PICKING_BINS)[number])) return "PICKING";
  if (EXPEDITION_BINS.includes(bin as (typeof EXPEDITION_BINS)[number])) return "EXPÉDITION";
  if (RESERVE_BINS.includes(bin as (typeof RESERVE_BINS)[number])) return "RÉSERVE";
  return "INCONNU";
}

export type ZoneFlowRow = {
  zone: WarehouseZone;
  color: string;
  txCount: number;
  docTypes: string[];
};

export type TxLike = { bin: string; docType: string; posted?: boolean };

/** Aggregate posted transactions by warehouse zone (live cockpit + report). */
export function aggregateZoneFlow(transactions: TxLike[]): ZoneFlowRow[] {
  const zones: WarehouseZone[] = ["RÉCEPTION", "STOCKAGE", "PICKING", "EXPÉDITION", "RÉSERVE"];
  return zones.map((zone) => {
    const posted = transactions.filter((t) => t.posted !== false && binToZone(t.bin) === zone);
    const docTypes = Array.from(new Set(posted.map((t) => t.docType)));
    return {
      zone,
      color: ZONE_PALETTE[zone].color,
      txCount: posted.length,
      docTypes,
    };
  });
}
