# SCN-009 — ERP/WMS Mapping

| Domaine | Équivalent |
|---------|------------|
| **Fonction WMS** | Cycle counting |
| **Module** | IM — Inventaire cyclique |
| **SAP** | MI01, MI04, MI07 |
| **Odoo** | Inventory adjustments, cycle counts |
| **Pertinence** | Inventaire perpétuel vs arrêt annuel |

## Pipeline M3

| Étape | tCode | ERP module | Exigence SCN-009 |
|-------|-------|------------|------------------|
| CC_LIST | MI01 | IM — Liste comptage | Obligatoire |
| CC_COUNT | MI04 | Saisie quantités physiques | Obligatoire |
| CC_RECON | MI07 | Réconciliation **+ ajustement** | Obligatoire (doc + post −3) |
| REPLENISH | MD04 | MRP (si applicable) | Optionnel |
| COMPLIANCE_M3 | — | Clôture M3 | Obligatoire |

## Données scénario

| SKU | Bin | Système | Physique | Variance | Action |
|-----|-----|---------|----------|----------|--------|
| SKU-001 | B-01-R1-L1 | 100 | 97 | −3 | CC_RECON + ajustement −3 |
| SKU-003 | B-01-R1-L2 | 80 | 80 | 0 | Conforme — pas d'ajustement |

## Politique M3 — G-C05 (adoptée)

| Élément | Politique |
|---------|-----------|
| CC_RECON | **Obligatoire** — documenter l'écart |
| Ajustement MI07 | **Obligatoire** — aligner stock système sur physique |
| Justification écrite | **Optionnelle** si \|variance\| < **5 unités** |
| SCN-010 | Premier scénario avec justification formelle (> seuil 20 u.) |

> En M3, l'ajustement MI07 est exécuté **dans l'étape CC_RECON** (pas d'étape ADJ séparée).

Référence : `06-superviseur-runbook-addendum/SCN-009-adj-policy.md`
