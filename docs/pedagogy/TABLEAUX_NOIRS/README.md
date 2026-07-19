# TEC.WMS — Système pédagogique TABLEAUX NOIRS

**Programme :** TEC.LOG — Collège de la Concorde  
**Plateforme :** Mini-WMS Concorde (TEC.WMS Simulator)  
**Nature :** Documentation / pédagogie uniquement — aucun impact runtime  
**Racine canonique :** `docs/pedagogy/TABLEAUX_NOIRS/`  
**Modèle :** [`MODELE_CANONIQUE_TABLEAU_NOIR.md`](./MODELE_CANONIQUE_TABLEAU_NOIR.md)

---

## 1. Qu’est-ce qu’un Tableau Noir ?

Un **Tableau Noir** n’est pas un simple support visuel.  
C’est le **manuel d’exécution complet** d’une classe : préparation, contenu au tableau, script professeur, lecture slide par slide, glossaire appliqué, quiz, séquence scénarios, raisonnement attendu, réponses professionnelles courtes, débrief et timing.

**Une classe = un package Tableau Noir canonique.**

---

## 2. Emplacement choisi (audit dépôt)

| Candidat | Rôle | Décision |
|----------|------|----------|
| **`docs/pedagogy/`** | Guides professeur RC16, handbook, audits slides | **Racine retenue** |
| `Documentation/` | Constitution pédagogique institutionnelle | Conservée (autorité P0) — pas de doublon ici |
| `Projects/TEC.WMS/03_PEDAGOGY/` | Philosophie / compétences | Hors exécution de classe |
| Dossier institutionnel PDF/DOCX | Guides M1–M5 publiés | Sources de référence, non réécrits |

**Choix :** `docs/pedagogy/TABLEAUX_NOIRS/`  
Aligné sur la convention opérationnelle déjà utilisée pour le Guide Professeur 10 classes.

---

## 3. Sources auditées (non modifiées)

| Document | Usage |
|----------|--------|
| `docs/pedagogy/GUIDE_PROFESSEUR_TECWMS_10_CLASSES_RC16.md` | Calendrier RC16, timing, checkpoints |
| `docs/pedagogy/GUIDE_PROFESSEUR_QUICK_REFERENCE.md` | Fiches classe 1–10 |
| `docs/pedagogy/MASTER_INSTRUCTOR_HANDBOOK.md` | Voix professeur, pièges, certification |
| `GUIDE_OFFICIEL_REPONSES_M4_M5.md` | Réponses / bandes Annexe A M4–M5 |
| `docs/pedagogy/PEDAGOGICAL_SLIDE_AUDIT_M*.md` | Titres slides, alignement |
| `Documentation/Pedagogical_Framework/` | Constitution (autorité P0) |
| `client/src/data/modules.ts` | Titres slides runtime (lecture seule) |

---

## 4. Gouvernance calendrier — divergence documentée

| Cadre | Classe 6 | Classe avec SCN-012→014 |
|-------|----------|-------------------------|
| **RC16 approuvé** | M3 partie 2 · SCN-011 · validation enseignant | **Classe 9** |
| **Wave Tableaux Noirs (ce système)** | **M4** · consolidation M1–M3 · SCN-012→014 | **Classe 6** (livraison complète) |

> **À VALIDER institutionnellement :** le remapping Classes 6–10 de ce système vs calendrier RC16.  
> Contenu pédagogique M4 (KPI, bandes, scénarios) = **aligné** sur sources canoniques.  
> Ordre des séances 6–10 = **proposition d’exécution** à valider avant adoption calendaire.

Les Classes 1–5 suivent le contenu RC16 (modules / SCN / slides).  
Les Classes 7–10 de ce dossier sont des **packages de planification** selon la séquence demandée (compléter M4 → M5 → intégration), avec items non approuvés marquées **À VALIDER**.

---

## 5. Index maître — Classes 1 à 10

| Classe | Module | Slides | Glossaire | Quiz | Scénarios | Compétences attendues | Statut | Package |
|--------|--------|--------|-----------|------|-----------|------------------------|--------|---------|
| **1** | M1 p1 | M1-S1→S5 | M1 | Quiz M1 (gate Silver G1) | SCN-001 · SCN-002 | PO · GR · stock · cohérence physique/système | **READY** | [`CLASSE_01`](./CLASSE_01/TABLEAU_NOIR_CLASSE_01.md) |
| **2** | M1 p2 | M1-S6→S10 | M1 | — (confirmer Quiz M1) | SCN-003 · 004 · 005 | SO · GI · CC · capstone M1 | **READY** | [`CLASSE_02`](./CLASSE_02/TABLEAU_NOIR_CLASSE_02.md) |
| **3** | M2 p1 | M2-S1→S5 | M2 | Quiz M2 (renfort) | SCN-006 · SCN-007 | Putaway · bins · capacité · FIFO intro | **READY** | [`CLASSE_03`](./CLASSE_03/TABLEAU_NOIR_CLASSE_03.md) |
| **4** | M2 p2 | M2-S7 | M2 | — | SCN-008 | FIFO picking · clôture M2 | **READY** | [`CLASSE_04`](./CLASSE_04/TABLEAU_NOIR_CLASSE_04.md) |
| **5** | M3 p1 | M3-S1→S5 | M3 | Quiz M3 (renfort) | SCN-009 · SCN-010 | Min/Max · CC · variance · ADJ | **READY** | [`CLASSE_05`](./CLASSE_05/TABLEAU_NOIR_CLASSE_05.md) |
| **6** | **M4** + consolidation M1–M3 | M4-S1→S5 · S7 *(S6 exclue RC16)* | M4 / Annexe A | Quiz M4 (renfort) | **SCN-012 · 013 · 014** | Mesurer · interpréter · décider · suivre | **READY** | [`CLASSE_06`](./CLASSE_06/) |
| **7** | M4 consolidation | Révision M4 ciblée | M4 | — | Renfort SCN-012→014 si besoin | Maîtrise multi-KPI · conformité M4 | **DRAFT** | [`CLASSE_07`](./CLASSE_07/TABLEAU_NOIR_CLASSE_07.md) |
| **8** | M5 intro | M5-S1→S2 (prévu) | M5 | Quiz M5 **À VALIDER** timing | SCN-015 (+016 si rythme) | Peak Week J1 · ops→KPI | **DRAFT** | [`CLASSE_08`](./CLASSE_08/TABLEAU_NOIR_CLASSE_08.md) |
| **9** | M5 suite | M5-S3→S4 | M5 | — | SCN-016 · SCN-017 | Crise J2 · audit stratégique J3 | **DRAFT** | [`CLASSE_09`](./CLASSE_09/TABLEAU_NOIR_CLASSE_09.md) |
| **10** | Intégration finale | M5-S5 + synthèse | — | 2ᵉ assessment **À VALIDER** params | Rattrapage SCN · Gold | Clôture professionnelle · Gold | **À VALIDER** | [`CLASSE_10`](./CLASSE_10/TABLEAU_NOIR_CLASSE_10.md) |

**Slides exclues du parcours RC16 (conservé) :** M2-S6 · M3-S6 · M4-S6.

---

## 6. Classe 6 — livrables complets

| Fichier | Rôle |
|---------|------|
| [`TABLEAU_NOIR_CLASSE_06.md`](./CLASSE_06/TABLEAU_NOIR_CLASSE_06.md) | Manuel d’exécution complet |
| [`SCRIPT_PROFESSEUR_CLASSE_06.md`](./CLASSE_06/SCRIPT_PROFESSEUR_CLASSE_06.md) | Script oral minute par minute + slides |
| [`GUIDE_SCENARIOS_CLASSE_06.md`](./CLASSE_06/GUIDE_SCENARIOS_CLASSE_06.md) | SCN-012 / 013 / 014 — 7 couches + étapes |

---

## 7. Modèle de réponse professionnelle courte (toutes classes analytiques)

```
LECTURE → DÉCISION → SUIVI
```

1 à 3 phrases. Exemple :  
« Rotation 6×, zone normale. Maintenir globalement. Surveiller les SKU lents. »

Une note système professionnelle **enregistre la lecture, la décision et le suivi** — pas un essai.

---

## 8. Transition pédagogique M1–M3 → M4 (ouverture Classe 6)

| Bloc | Verbes |
|------|--------|
| **M1–M3** | EXÉCUTER · CONTRÔLER · PLANIFIER |
| **M4** | MESURER · INTERPRÉTER · DÉCIDER · SUIVRE |

---

## 9. Statuts

| Code | Signification |
|------|----------------|
| **READY** | Prêt salle de classe (contenu sourcé + exécutable) |
| **DRAFT** | Package de planification complet, détails d’exécution à enrichir en séance |
| **À VALIDER** | Paramètre ou calendrier non encore approuvé institutionnellement |

---

*Système Tableaux Noirs TEC.WMS — documentation pédagogique uniquement*
