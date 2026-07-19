/**
 * Canonical M4 inventory-turnover band wording (pedagogical display only).
 * Does not change calculateKpis thresholds, scoring, or SCN-012 validator logic.
 */

export const M4_ROTATION_BAND_WORDING_FR =
  "Bande normale : 4–12×/an · <4× rotation faible — risque de surstock · >12× rotation élevée — risque de stock trop serré ou de rupture à vérifier";

export const M4_ROTATION_BAND_WORDING_EN =
  "Normal band: 4–12×/yr · <4× low turnover — overstock risk · >12× high turnover — tight stock or stockout risk to verify";

/** Short form when visual space is limited (Annexe A cells, compact UI). */
export const M4_ROTATION_BAND_WORDING_SHORT_FR =
  "4–12× : normal · <4× : risque de surstock · >12× : risque de stock trop serré";

export const M4_ROTATION_BAND_WORDING_SHORT_EN =
  "4–12×: normal · <4×: overstock risk · >12×: tight stock risk";

export const M4_ROTATION_HIGH_PEDAGOGY_FR =
  "Une rotation élevée n’est pas mauvaise en soi. Elle devient risquée si le stock ne protège plus le niveau de service.";

export const M4_ROTATION_HIGH_PEDAGOGY_EN =
  "High turnover is not bad in itself. It becomes risky if stock no longer protects the service level.";

/** Forbidden categorical phrases (visible FR copy). */
export const M4_ROTATION_FORBIDDEN_FR = [
  ">12 sous-performance",
  ">12 = sous-performance",
  ">12 = mauvais",
  ">12 = rupture certaine",
  "<4 = surstock certain",
] as const;
