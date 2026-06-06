# SCN-001 — Conditions d'échec

| # | Condition d'échec | Conséquence pédagogique |
|---|-------------------|-------------------------|
| 1 | Transactions non postées | Bloqueur compliance |
| 2 | Stock négatif | Incohérence inventaire |
| 3 | Séquence hors ordre | OUT_OF_SEQUENCE |
| 4 | GI sans stock disponible | Pénalité MB52 |
| 5 | Score < 60/100 en évaluation | Scénario non validé pour certification |

**Anti-patterns étudiant (ne pas faire) :**

- Valider GI sans vérifier stock disponible (MB52)
- Sauter une étape du flux nominal (PO→GR→…→COMPLIANCE)
- Ignorer les alertes conformité avant clôture
