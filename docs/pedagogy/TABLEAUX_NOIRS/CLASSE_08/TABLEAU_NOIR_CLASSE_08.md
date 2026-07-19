# TABLEAU NOIR — CLASSE 8

**Statut :** DRAFT  
**Intention wave :** Introduire **M5** · slides · glossaire · premier(s) scénario(s) M5.

> **RC16 :** Classe 8 = consolidation + preview M4 + Quiz M4 (sans SCN M4).  
> **Wave TN :** C8 = entrée Peak Week. **À VALIDER** calendaire.

Sources M5 (lecture) : `GUIDE_OFFICIEL_REPONSES_M4_M5.md` · Slide audit M5 · Quick Reference C10 (contenu Peak Week).

---

## A. Identité

| Champ | Valeur |
|-------|--------|
| Classe | **8** |
| Module | **M5** — Simulation intégrée (intro) |
| Slides | **M5-S1** Opération intégrée · **M5-S2** SCN-015 J1 *(étendue S3+ **À VALIDER** selon rythme)* |
| Glossaire | M5 : Peak Week · snapshot KPI run-scoped · M5_ADJ · chaîne ops→KPI |
| Quiz | Quiz M5 — timing **À VALIDER** (RC16 : gate Gold en C10) |
| Scénarios | **SCN-015** (J1 nominal) · SCN-016 si avance — sinon C9 |
| Prérequis | M1 passed (gate serveur M5) · M4 fortement recommandé UI · **ne pas inventer d’autres gates** |
| Résultat | Comprendre Peak Week J1 · exécuter SCN-015 ≥70 · ne **pas** coller Annexe A 48 000 $ |

---

## B. Timing proposé

| Bloc | Durée |
|------|-------|
| Bridge M4→M5 | 15 min |
| Slides S1–S2 | 40 min |
| Glossaire M5 + anti-paste Annexe A | 15 min |
| SCN-015 | 45–50 min |
| Débrief snapshot | 15 min |
| Pauses | 2×15 |

---

## C. Objectifs

1. Passer d’analyste M4 à **opérateur intégré** M5.  
2. Chaîne : réception → putaway → CC → réappro → KPI dérivé du ledger → décision → compliance.  
3. Distinguer KPI **run** (~6 000 $ typ.) vs Annexe A (48 000 $).

---

## D. Board

```
PEAK WEEK J1 (nominal)
M5_RECEPTION → PUTAWAY → CYCLE_COUNT → REPLENISH → M5_KPI → M5_DECISION → COMPLIANCE_M5

⚠️ Snapshot run ≠ Annexe A (48 000 $)
Q réappro peut = 0 si stock > min
```

**Phrase forte :** « En M5, le KPI se mérite par les transactions. »

---

## G. Glossaire M5 (intro)

| Terme | Définition |
|-------|------------|
| Peak Week | Narratif J1→J2→J3 |
| Snapshot KPI | Valeurs du run courant |
| Anti-paste | Interdiction de coller Annexe A M4 |
| Décision tactique | SCN-015 — pas stratégique 017 |

---

## I. SCN-015 — synthèse 7 couches

1. Contexte : J1 nominal Peak Week.  
2. Données : seed run (pas Annexe A).  
3. Lecture : moniteur ops + snapshot.  
4. Diagnostic : cycle nominal.  
5. Décision : tactique (pas S&OP 014).  
6. Action : exécuter pipeline 7 étapes.  
7. Suivi : COMPLIANCE_M5 · Run Report.

**Réponse courte type :** « Cycle J1 exécuté. KPI lus depuis le snapshot. Décision tactique — suivre conformité M5. »

**Quantitatif (principe) :**

| INPUT | RÈGLE | RÉSULTAT | CLASSIF. | DÉCISION | SUIVI |
|-------|-------|----------|----------|----------|-------|
| Stock vs Min | Si stock > min | Q réappro = 0 | Nominal | Ne pas commander par réflexe | Snapshot |

Détail canonique : `GUIDE_OFFICIEL_REPONSES_M4_M5.md` §SCN-015.

---

## Items À VALIDER

- Quiz M5 en C8 vs C10 (gate Gold #2 RC16)  
- Inclusion SCN-016 le même soir  
- Paramètres 2ᵉ assessment (réservés C10)

---

*Classe 8 — DRAFT planifié*
