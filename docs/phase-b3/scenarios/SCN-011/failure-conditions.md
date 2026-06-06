# SCN-011 — Conditions d'échec

| # | Condition |
|---|-----------|
| 1 | Pipeline incomplet (étape CC_LIST, CC_COUNT, CC_RECON ou REPLENISH omise) |
| 2 | REPLENISH exécuté avant CC_RECON (hors séquence) |
| 3 | Sous-réapprovisionnement — quantité inférieure au besoin calculé (écart > 25 u.) |
| 4 | Ignorer un des deux SKU (SKU-004 ou SKU-005) |
| 5 | Ignorer le stock de sécurité dans l'analyse ROP |
| 6 | Quantités arbitraires sans lien Max − stock |
| 7 | COMPLIANCE_M3 avec réappro non validé |
| 8 | Score < 70/100 |

**Anti-patterns (Panel D doc) :**

- Réapprovisionner en quantité inférieure au besoin calculé (sous Min) — risque rupture
- Ignorer le stock de sécurité dans le calcul ROP — sous-estimation du besoin
- Valider REPLENISH sans consulter les paramètres Min/Max des SKU concernés
- Utiliser le libellé vague « CC pipeline » au lieu des codes d'étape explicites

**Pénalité séquence :** OUT_OF_SEQUENCE (−5 pts) si REPLENISH ou COMPLIANCE_M3 exécutés hors ordre.
