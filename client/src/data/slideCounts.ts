/** Official slide counts per Mission Sheet / Pedagogical Constitution */
export const SLIDE_COUNT_BY_MODULE: Record<number, number> = {
  /** RC17 VLS — M1–M5 delivery slides (36 total programme) */
  1: 10,
  2: 7,
  3: 7,
  4: 7,
  5: 5,
};

export const TOTAL_SLIDE_COUNT = Object.values(SLIDE_COUNT_BY_MODULE).reduce((sum, n) => sum + n, 0);
