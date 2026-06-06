# SCN-016 — Conditions d'échec

| # | Condition |
|---|-----------|
| 1 | Passer à M5_KPI sans corriger l'écart détecté |
| 2 | COMPLIANCE_M5 avec écart ouvert |
| 3 | ADJ manquant ou non posté |
| 4 | ADJ sans justification métier |
| 5 | Ignorer la variance injectée et continuer le flux |
| 6 | Décision KPI fondée sur stock incorrect |
| 7 | Score < 70/100 |

**Anti-patterns :**

- M5_CYCLE_COUNT → M5_REPLENISH sans ADJ intermédiaire
- Clôturer conformité avant ajustement MI07
- Continuer le flux « comme SCN-015 » en ignorant l'écart
