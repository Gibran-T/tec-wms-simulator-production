/**
 * Pure scoring helpers for M5 DOC (no I/O).
 */

import type { M5DocMissionStateV1 } from "./types";
import { M5_DOC_INTERACTION_ORDER } from "./interactionsCatalog";
import { M5_DOC_INTERACTIONS } from "./interactionsCatalog";

export const ZONE_WEIGHTS = {
  PRE: 10,
  SCN015: 25,
  SCN016: 25,
  SCN017: 25,
  POST: 15,
} as const;

export function computeZoneRaw(state: M5DocMissionStateV1): Record<keyof typeof ZONE_WEIGHTS, { earned: number; max: number }> {
  const zones: Record<keyof typeof ZONE_WEIGHTS, { earned: number; max: number }> = {
    PRE: { earned: 0, max: 0 },
    SCN015: { earned: 0, max: 0 },
    SCN016: { earned: 0, max: 0 },
    SCN017: { earned: 0, max: 0 },
    POST: { earned: 0, max: 0 },
  };

  for (const id of M5_DOC_INTERACTION_ORDER) {
    const def = M5_DOC_INTERACTIONS[id];
    zones[def.scoringZone].max += def.maxPoints;
    const sc = state.officialScores[id];
    if (sc) zones[def.scoringZone].earned += sc.points;
  }
  return zones;
}

export function computeFinalScore(state: M5DocMissionStateV1): { finalScore: number; zoneScores: Record<string, number> } {
  const raw = computeZoneRaw(state);
  const zoneScores: Record<string, number> = {};
  let weighted = 0;

  (Object.keys(ZONE_WEIGHTS) as Array<keyof typeof ZONE_WEIGHTS>).forEach((zone) => {
    const { earned, max } = raw[zone];
    const ratio = max > 0 ? earned / max : 0;
    const points = ratio * ZONE_WEIGHTS[zone];
    zoneScores[zone] = Math.round(points * 100) / 100;
    weighted += points;
  });

  const withCoherence = weighted + state.chainCoherence.scoreDelta;
  const finalScore = Math.max(0, Math.min(100, Math.round(withCoherence * 100) / 100));
  return { finalScore, zoneScores };
}
