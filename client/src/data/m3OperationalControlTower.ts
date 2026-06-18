/** Display-only M3 operational control tower metadata (SCN-009–011). No scenario logic. */

export interface M3OperationalBadge {
  id: string;
  labelFr: string;
  labelEn: string;
  /** Tailwind semantic: 'green' | 'amber' | 'red' | 'slate' */
  tone: "green" | "amber" | "red" | "slate";
  valueFr: string;
  valueEn: string;
}

export interface M3OperationalTowerEntry {
  scnCode: "SCN-009" | "SCN-010" | "SCN-011";
  titleFr: string;
  titleEn: string;
  /** Static scenario framing — no scoring content */
  focusFr: string;
  focusEn: string;
}

export const M3_OPERATIONAL_CONTROL_TOWER: Record<string, M3OperationalTowerEntry> = {
  "SCN-009": {
    scnCode: "SCN-009",
    titleFr: "Tour de contrôle M3 — Inventaire cyclique",
    titleEn: "M3 Control Tower — Cycle count",
    focusFr: "Détecter l'écart −3 sur SKU-001, poster ADJ (MI07) dans CC_RECON, puis clôturer.",
    focusEn: "Detect −3 variance on SKU-001, post ADJ (MI07) in CC_RECON, then close.",
  },
  "SCN-010": {
    scnCode: "SCN-010",
    titleFr: "Tour de contrôle M3 — Écart significatif",
    titleEn: "M3 Control Tower — Significant variance",
    focusFr: "Écart −28 > seuil 20 — justification obligatoire avant ADJ (MI07).",
    focusEn: "−28 variance > threshold 20 — justification required before ADJ (MI07).",
  },
  "SCN-011": {
    scnCode: "SCN-011",
    titleFr: "Tour de contrôle M3 — Réapprovisionnement Min/Max",
    titleEn: "M3 Control Tower — Min/Max replenishment",
    focusFr: "SKUs sous Min — CC confirmatoire, focus REPLENISH : Q = Max − stock.",
    focusEn: "SKUs below Min — confirmatory CC, REPLENISH focus: Q = Max − stock.",
  },
};
