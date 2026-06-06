# SCN-001 — Critères de réussite

| # | Critère | Observable en session |
|---|---------|---------------------|
| 1 | Conformité système au vert | `compliance.compliant = true` |
| 2 | Toutes étapes complétées | PO → GR → PUTAWAY_M1 → SO → PICKING_M1 → GI → CC → COMPLIANCE |
| 3 | Aucun stock négatif | Inventaire cohérent |
| 4 | Score évaluation ≥ 60/100 | Mode évaluation officiel |
| 5 | Séquence respectée | Pas de saut d'étape critique |

**Synthèse :** Flux nominal M1 exécuté sans anomalie ni transaction non postée.
