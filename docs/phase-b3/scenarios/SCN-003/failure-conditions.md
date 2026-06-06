# SCN-003 — Conditions d'échec

| # | Condition d'échec | Conséquence pédagogique |
|---|-------------------|-------------------------|
| 1 | GI validée avec stock insuffisant en STOCKAGE | NEGATIVE_STOCK_ATTEMPT / commande non honorée |
| 2 | Pas de PO/GR corrective malgré le déficit | Stock insuffisant persistant |
| 3 | Expédition sans réapprovisionnement | Anti-pattern rupture non résolue |
| 4 | Putaway initial sauté (REC-01 non vidé) | Incohérence inventaire |
| 5 | Conformité clôturée avec bloqueur actif | Compliance bloquée |
| 6 | Score < 60/100 en évaluation | Scénario non validé pour certification |

**Anti-patterns étudiant (ne pas faire) :**

- Valider **GI** avec stock insuffisant (MB52)
- Ne pas créer de **PO/GR corrective** malgré le déficit constaté
- Expédier sans réapprovisionner et ranger le stock additionnel
