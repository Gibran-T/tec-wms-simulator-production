# TABLEAU NOIR — CLASSE 3

**Statut :** READY (consolidé RC16)

---

## A. Identité

| Champ | Valeur |
|-------|--------|
| Classe | **3** |
| Module | M2 Exécution d’entrepôt (partie 1) |
| Slides | **M2-S1 → S5** · **M2-S6 exclue** |
| Glossaire | Zones · bins · putaway · capacité · FIFO |
| Quiz | Quiz M2 renforcement (~15 min) — **pas gate cert** |
| Scénarios | **SCN-006 · SCN-007** ≥60 |
| Prérequis | M1 passed |

---

## B. Timing

Objectifs 5 · Slides+démos 58 · Quiz 12 · SCN-006 28 · SCN-007 27 · pauses → **150 min**

---

## C. Objectifs

Disposition entrepôt ; réception→rangement ; adressage bin ; capacité ; intro FIFO.

---

## D. Board

```
9 ZONES · REC-01 → STOCKAGE
BIN = zone-allée-niveau-position
CAPACITÉ : 600 dans max 500 → REFUS / redistribuer
FIFO : plus ancien lot sort premier
```

**Phrase forte :** « La capacité n’est pas une suggestion. »

---

## F. Slides

| Slide | Titre | Lien SCN |
|-------|-------|----------|
| S1 | 9 zones | REC-01 |
| S2 | Réception/rangement | SCN-006 |
| S3 | Bins | Adressage |
| S4 | Capacité | SCN-007 |
| S5 | FIFO | Prépare C4 |

**Quantitatif SCN-007 :**

| INPUT | RÈGLE | RÉSULTAT | CLASSIF. | DÉCISION | SUIVI |
|-------|-------|----------|----------|----------|-------|
| 600 u. · max 500 | Capacité bin | Dépassement | Non conforme | Refuser / split | Monitor capacité |

---

## I. Scénarios

| SCN | Focus | Réponse courte |
|-----|-------|----------------|
| 006 | Putaway 150 u. | « 150 u. rangées en STOCKAGE. Adresse validée. Suivre solde bin. » |
| 007 | Capacité 600/500 | « Dépassement détecté. Ne pas forcer. Redistribuer et suivre. » |

---

## M. Checklist

- [ ] SCN-006/007 ≥60 · [ ] M2-S6 non couverte · [ ] Annoncer SCN-008 C4

---

*Classe 3 — consolidé RC16*
