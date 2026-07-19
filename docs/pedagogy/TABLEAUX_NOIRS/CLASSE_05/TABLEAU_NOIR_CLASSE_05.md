# TABLEAU NOIR — CLASSE 5

**Statut :** READY (consolidé RC16)

---

## A. Identité

| Champ | Valeur |
|-------|--------|
| Classe | **5** |
| Module | M3 Contrôle des stocks (partie 1) |
| Slides | **M3-S1 → S5** · **M3-S6 exclue** |
| Glossaire | Min/Max · ROP · Safety Stock · CC · variance · ADJ |
| Quiz | Quiz M3 renforcement |
| Scénarios | **SCN-009 · SCN-010** · seuil **70**/100 |
| Résultat | Formules ROP comprises · CC/variance maîtrisés |

> **Note wave TN :** RC16 place SCN-011 + validation enseignant en **Classe 6**. Dans la wave Tableaux Noirs, la Classe 6 = M4 ; la validation M3 / SCN-011 doivent être **assurées avant M4** (fin C5, séance bridge, ou C7) — **À VALIDER** calendairement.

---

## B. Timing

Slides+tableau 62 · Quiz 12 · SCN-009 28 · SCN-010 28 → **150 min**

---

## D. Board

```
ROP = (Demande × Délai) + Safety Stock
Trop de stock ↔ Rupture → équilibre Min/Max
Variance > 2 % ≈ système peu fiable (repère pédagogique)
CC_LIST → CC_COUNT → CC_RECON → (ADJ) → REPLENISH → COMPLIANCE_M3
```

**Phrase forte :** « On planifie pour servir, pas pour remplir. »

---

## F. Slides

| Slide | Focus | Quantitatif |
|-------|-------|-------------|
| S1 | Vue M3 | Pipeline |
| S2 | Min/Max/ROP + tableau blanc | ROP ex. demande 10/j · délai 5 · SS 20 → ROP 70 |
| S3 | Safety Stock | Couverture incertitude |
| S4 | CC / variance | Physique vs système |
| S5 | Réappro | Prépare SCN-011 |

**Exemple ROP :**

| INPUT | FORMULE | RÉSULTAT | CLASSIF. | DÉCISION | SUIVI |
|-------|---------|----------|----------|----------|-------|
| D=10/j · L=5 · SS=20 | (D×L)+SS | **70** | Seuil réappro | Déclencher si stock < ROP | Suivre lead time réel |

---

## I. Scénarios

| SCN | Focus | Réponse courte |
|-----|-------|----------------|
| 009 | CC simple | « Comptage exécuté. Écart nul/acceptable. Réconcilier et suivre. » |
| 010 | Variance + ADJ | « Écart investigué. ADJ via CC_RECON. Justifier et suivre fiabilité. » |

---

## M. Checklist

- [ ] SCN-009/010 ≥70 ou plan rattrapage  
- [ ] Formules ROP au tableau  
- [ ] M3-S6 non couverte  
- [ ] **À VALIDER :** créneau SCN-011 + `teacherValidated` avant ouverture M4 (C6 wave TN)

---

*Classe 5 — consolidé RC16 + note de remapping*
