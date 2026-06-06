# SCN-011 — Notes débrief instructeur



## Objectif pédagogique



Former à la **planification de réapprovisionnement** selon paramètres Min/Max et stock de sécurité — niveau Bloom **Évaluer** : l'étudiant doit interpréter les paramètres, calculer ROP/EOQ et produire des quantités cohérentes.



## Script d'ouverture



> « Vous agissez en tant que **Planificateur Approvisionnement**.  

> Compétence : **Planification réappro** (Évaluer). Seuil **70/100**.  

> SKU-004 (30 u., Min 50) et SKU-005 (40 u., Min 80) sont sous seuil.  

> Exécutez le pipeline complet : CC_LIST, CC_COUNT, CC_RECON, REPLENISH avec quantités calculées, puis COMPLIANCE_M3.  

> Les calculs ROP et EOQ seront évalués. »



## Questions débrief



1. Pourquoi SKU-004 et SKU-005 nécessitent-ils un réapprovisionnement ?

2. Comment avez-vous calculé la quantité pour SKU-004 ? (attendu : 170 u.)

3. Comment avez-vous calculé la quantité pour SKU-005 ? (attendu : 260 u.)

4. Quel rôle joue le stock de sécurité (25 / 30) dans votre analyse ROP ?

5. Quelle est la différence entre Min (point de commande) et Max (niveau cible) ?

6. Pourquoi le pipeline CC précède-t-il REPLENISH dans M3 ?

7. Que se passe-t-il si vous sous-réapprovisionnez (quantité < besoin calculé) ?



## Signaux d'alerte



- Libellé « pipeline CC » sans étapes nommées → rappel G-I04

- Quantités arbitraires sans référence Max − stock → perte points REPLENISH

- Ignorer stock de sécurité dans justification ROP

- Passer REPLENISH avant CC_RECON → séquence invalide

- Score < 70 malgré conformité → revoir précision calculs



## Réponses attendues (référence instructeur)



| SKU | Stock | Min | Max | SS | Qté suggérée | Critique ? |

|-----|-------|-----|-----|----|--------------|------------|

| SKU-004 | 30 | 50 | 200 | 25 | 170 | Non (30 ≥ 25) |

| SKU-005 | 40 | 80 | 300 | 30 | 260 | Non (40 ≥ 30) |



## Lien scénarios M3



| SCN | Focus |

|-----|-------|

| SCN-009 | Cyclique simple (−3) — CC_RECON + ajustement obligatoires ; G-C05 Closed |

| SCN-010 | Variance −28, justification |

| SCN-011 | **Réappro planifié — capstone M3 planification** |



## Références runbook



- `docs/phase-b3/04-gap-resolution-workbook.md` — G-I04 (pipeline explicite), G-I07 (seuil 70)

- Panneau learning M3 — formules ROP/EOQ visibles


