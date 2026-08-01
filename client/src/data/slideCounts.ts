/** Official slide counts per Mission Sheet / Pedagogical Constitution */
export const SLIDE_COUNT_BY_MODULE: Record<number, number> = {
  /** M1–M4 RC17 VLS delivery · M5 supervisor closing-shift deck (11) · programme total 42 */
  1: 10,
  2: 7,
  3: 7,
  4: 7,
  5: 11,
};

export const TOTAL_SLIDE_COUNT = Object.values(SLIDE_COUNT_BY_MODULE).reduce((sum, n) => sum + n, 0);
