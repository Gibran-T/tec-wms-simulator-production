/**
 * RC24 — Single source of truth for M4 canonical student answers (SCN-012–014).
 * Must pass validateM4Compliance and scoreKpiInterpretation.
 */

/** Fixture-aligned diagnostic — passes all SCN-014 compliance gates (diag014). */
export const SCN014_DIAGNOSTIC_FIXTURE =
  "Rotation normale a 6x, service excellent 95%, erreurs acceptables 4%, delai lead time 3,5 jours. Je recommande un programme qualite execution. Trade-off: on reporte le destock pour maintenir le service et le capital. Priorite arbitrage: fund error reduction. Cible 90 jours avec KPI rotation service erreur delai.";

/** Official French student-facing canonical (matches fixture gates). */
export const SCN014_DIAGNOSTIC_CANONICAL_FR =
  "Rotation normale à 6×, service excellent 95 %, erreurs acceptables 4 %, délai lead time 3,5 jours. Je recommande un programme qualité exécution. Trade-off : on reporte le destock pour maintenir le service et le capital. Priorité arbitrage : financer réduction erreurs. Cible 90 jours avec KPI rotation, service, erreur, délai.";

export const SCN014_DIAGNOSTIC_CANONICAL_EN =
  "Normal turnover at 6×, excellent 95% service, 4% acceptable errors, 3.5 d lead time. I recommend an execution quality program. Trade-off: defer destock to maintain service and capital. Arbitration priority: fund error reduction. 90-day target with turnover, service, error, lead time KPIs.";

/** Vocabulary required by validateM4Compliance generic diagnostic gate. */
export const M4_DIAGNOSTIC_ACTION_TERMS = ["recommand", "action", "strategie", "decision"] as const;
