# TABLEAU NOIR — CLASSE 1

**Statut :** READY (consolidé RC16)  
**Sources :** `GUIDE_PROFESSEUR_TECWMS_10_CLASSES_RC16.md` · Quick Reference · Slide audit M1

---

## A. Identité

| Champ | Valeur |
|-------|--------|
| Classe | **1** |
| Module | M1 — Fondements ERP/WMS (partie 1) |
| Durée | 180 min (150 effectives + 2×15) |
| Slides | **M1-S1 → S5** (pas SO/GI/CC aujourd’hui) |
| Glossaire | M1 : PO · GR · Stock · physique vs système |
| Quiz | **Quiz M1** — gate Silver G1 · ≥ 60 % · ≈18 min |
| Scénarios | **SCN-001** · **SCN-002** · seuil ≥ 60/100 · mode Évaluation |
| Prérequis | Aucun |
| Résultat | PO→GR→Stock compris · Quiz M1 ≥60 % · SCN-001/002 ≥60 · COMPLIANCE OK |

---

## B. Timing

| Bloc | Durée |
|------|-------|
| Slides S1–S5 + démos | ~66 min |
| Quiz M1 | 18 min |
| SCN-001 | 24 min |
| SCN-002 | ~22 min |
| Pauses | 2×15 |
| **Effectif** | **150 min** |

---

## C. Objectifs

1. Comprendre le flux logistique intégré.  
2. Maîtriser PO (ME21N) → GR (MIGO) → Stock (MMBE).  
3. Distinguer stock physique / système ; GR postée vs PENDING.  
4. Réussir Quiz M1 (Silver G1) et premiers scénarios.

---

## D. Board

```
PO → GR → STOCK
Physique  ≠  Système  →  variance = risque
GR postée  vs  GR PENDING
```

**Phrase forte :** « Sans GR postée, le stock ment. »

---

## E. Script (essentiel)

« Dans une opération de grande distribution, rien n’entre proprement sans engagement d’achat. La PO est le contrat. La GR est la preuve. Le stock est la promesse au client. »

Détail slide-by-slide : voir Quick Reference Classe 1 + notes `modules.ts` M1-S1…S5.  
**TODO / À VALIDER :** script oral minute-par-minute exhaustif type Classe 6 (non présent tel quel dans RC16 — enrichir si besoin cohorte).

---

## F. Slides (carte)

| Slide | Titre | Observer | Dire | Lien SCN |
|-------|-------|----------|------|----------|
| S1 | Couverture M1 | Périmètre cours | Emplois logistiques QC · simulateur | — |
| S2 | Flux intégré | Diagramme 7 étapes | Chaque étape dépend de la précédente | SCN-001 aperçu |
| S3 | PO — ME21N | Formulaire PO | Sans PO valide, rien n’entre | SCN-001 |
| S4 | GR — MIGO | Posté vs PENDING | GR = précision | SCN-002 |
| S5 | Stock — MMBE | Soldes / bins | Variance = ennemi WMS | SCN-001 |

**Modèle quantitatif type (GR) :**

| INPUT | FORMULE / RÈGLE | RÉSULTAT | CLASSIFICATION | DÉCISION | SUIVI |
|-------|-----------------|----------|----------------|----------|-------|
| PO 120 · reçu 100 | Écart réception | −20 | Écart à traiter | Ne pas “forcer” le stock | Investiguer avant putaway |

---

## G. Glossaire appliqué

| Terme | Définition classe |
|-------|-------------------|
| PO | Commande d’achat — engagement entrée |
| GR | Réception marchandises — preuve physique→système |
| Stock système | Quantité enregistrée WMS/ERP |
| Stock physique | Quantité réelle en entrepôt |
| PENDING | Transaction non postée — invisible en stock fiable |

---

## H. Quiz M1

Gate Silver G1 · ≥60 % · retake si échec · revoir S3–S5.

---

## I. Scénarios (7 couches — synthèse)

### SCN-001 — Cycle nominal
1. Contexte : flux nominal entrepôt.  
2. Données : quantités mission.  
3. Lecture : étapes PO→… complètes.  
4. Diagnostic : parcours sans anomalie majeure.  
5. Décision : exécuter dans l’ordre.  
6. Action : poster chaque TX.  
7. Suivi : COMPLIANCE + Run Report.

**Réponse courte type :** « Cycle nominal exécuté. TX postées. Cohérence OK — suivre moniteur. »

### SCN-002 — GR fantôme
Focus : GR non postée / incohérence.  
**Réponse courte type :** « GR non fiable détectée. Ne pas continuer sur stock fantôme. Poster / corriger puis suivre. »

**TODO :** fiches étape-par-étape exhaustives si Mission Sheets PDF non jointes au dépôt — s’appuyer sur Mission Control runtime (lecture seule).

---

## J–N. Débrief · Rôles · Checklist

**Débrief :** Différence posté/non posté ? Physique vs système ?  
**Rôles :** Réceptionnaire · Clerk stock · Analyste junior.  
**Checklist :** Quiz ≥60 · SCN-001/002 ≥60 · mode Évaluation · preview Classe 2 (SO/GI/CC).

---

*Classe 1 — consolidé RC16 — documentation uniquement*
