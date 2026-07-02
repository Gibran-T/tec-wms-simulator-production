# TEC.WMS — Guide Professeur 10 Classes (Résumé RC16)

**Programme :** TEC.LOG — Collège de la Concorde  
**Version :** RC16 — Amélioration pédagogique (QA finale)  
**Durée totale :** 30 h · 10 séances × 3 h  
**Pause obligatoire par séance :** 30 min (2 × 15 min)  
**Temps effectif d'enseignement par séance :** 150 min  
**Document complet :** [`GUIDE_PROFESSEUR_TECWMS_10_CLASSES_RC16.md`](./GUIDE_PROFESSEUR_TECWMS_10_CLASSES_RC16.md)

---

## Calendrier des 10 classes

| Classe | Module | Slides enseignées | Scénario(s) assigné(s) | Quiz | Certification / gate |
|--------|--------|-------------------|------------------------|------|----------------------|
| **1** | M1 (partie 1) | M1-S1 → S5 | **SCN-001** · **SCN-002** | **Quiz M1** (gate Silver G1) | — |
| **2** | M1 (partie 2) | M1-S6 → S10 | **SCN-003** · **SCN-004** · **SCN-005** | — | Préparation Silver |
| **3** | M2 (partie 1) | M2-S1 → S5 | **SCN-006** · **SCN-007** | Quiz M2 (renforcement) | Contribution Gold |
| **4** | M2 (partie 2) | M2-S7 uniquement | **SCN-008** | — | M2 `passed` |
| **5** | M3 (partie 1) | M3-S1 → S5 | **SCN-009** · **SCN-010** | Quiz M3 (renforcement) | Seuil 70/100 |
| **6** | M3 (partie 2) | M3-S7 uniquement | **SCN-011** | — | **Validation enseignant M3** |
| **7** | Consolidation | Révision ciblée (optionnelle) | *Aucun nouveau SCN* | — | **Silver** (4 gates) |
| **8** | Consolidation | Preview M4 · Annexe A | *Aucun nouveau SCN* | Quiz M4 (renforcement) | Prérequis M4 confirmés |
| **9** | M4 | M4-S1 → S5 · S7 | **SCN-012** · **SCN-013** · **SCN-014** | — | Contribution Gold |
| **10** | M5 | M5-S1 → S5 | **SCN-015** · **SCN-016** · **SCN-017** | **Quiz M5** (gate Gold #2) | **Gold** (18 gates) |

**Slides exclues du parcours :** M2-S6 · M3-S6 · M4-S6 (non enseignées — hors périmètre simulateur TEC.WMS).

**Rattrapage :** Classes 7–8 uniquement pour SCN **non complétés** — ne compte pas comme assignation primaire.

---

## Répartition des modules

| Module | Classes | Heures | Slides enseignées | SCN (1× chacun) | Seuil |
|--------|---------|--------|-------------------|-----------------|-------|
| M1 | 1–2 | 6 h | 10 | SCN-001 → 005 | 60/100 |
| M2 | 3–4 | 6 h | 6 (S1–S5, S7) | SCN-006 → 008 | 60/100 |
| M3 | 5–6 | 6 h | 6 (S1–S5, S7) | SCN-009 → 011 | 70/100 |
| Consolidation Silver | 7–8 | 6 h | — | Rattrapage si retard | Silver |
| M4 | 9 | 3 h* | 6 (S1–S5, S7) | SCN-012 → 014 | 70/100 (max 100) |
| M5 | 10 | 3 h* | 5 | SCN-015 → 017 | 70/100 |

\* M4/M5 : travail dirigé recommandé hors séance (Guide institutionnel).

---

## Répartition des scénarios — assignation primaire unique

| SCN | Classe | Focus |
|-----|--------|-------|
| SCN-001 | 1 | Cycle nominal |
| SCN-002 | 1 | GR fantôme |
| SCN-003 | 2 | Rupture + réappro |
| SCN-004 | 2 | Variance CC |
| SCN-005 | 2 | Capstone M1 |
| SCN-006 | 3 | Putaway 150 u. |
| SCN-007 | 3 | Capacité 600/500 |
| SCN-008 | 4 | FIFO picking |
| SCN-009 | 5 | Cycle count |
| SCN-010 | 5 | Variance + ADJ |
| SCN-011 | 6 | Réappro Min/Max |
| SCN-012 | 9 | Rotation 6× |
| SCN-013 | 9 | OTIF 95 % + erreurs 4 % |
| SCN-014 | 9 | Capstone S&OP |
| SCN-015 | 10 | Peak Week J1 |
| SCN-016 | 10 | Peak Week J2 |
| SCN-017 | 10 | Peak Week J3 |

**Total :** 17 SCN · chacun assigné **exactement une fois** dans le flux primaire.

---

## Validation certification vs simulateur

| Événement | Classe | Alignement simulateur |
|-----------|--------|------------------------|
| Quiz M1 (Silver G1) | **1** | `quizAttempts` M1 ≥ 60 % |
| SCN M1 complets (Silver G2–G4) | **1–2** | SCN-001→005 ≥ 60 · COMPLIANCE · no blockers |
| Silver ELIGIBLE/AWARDED | **7** | `/student/certifications/silver` auto |
| Quiz M2–M4 | **3 · 5 · 8** | Renforcement — **pas gate cert** |
| Validation enseignant M3 | **6** | `teacherValidated` — **gate M4 eval** |
| M4 démarrage | **9** | Requiert M3 passed + teacherValidated |
| SCN M4 | **9** | SCN-012→014 ≥ 70 |
| Quiz M5 (Gold #2) | **10** | `quizAttempts` M5 ≥ 60 % |
| SCN M5 + Gold 18 gates | **10** | SCN-015→017 · SCN-016 seq · SCN-017 capstone |
| Gold ELIGIBLE | **10** | `/student/certifications/gold` |
| M5 démarrage (gate serveur) | **10** | M1 passed · M4 fortement recommandé (UI) |

---

## Structure des pauses (30 min / classe)

| Pause | Durée | Total séance |
|-------|-------|--------------|
| Pause 1 | 15 min | — |
| Pause 2 | 15 min | — |
| **Enseignement effectif** | **150 min** | **180 min (3 h)** |

---

## Moments de validation enseignant

| Moment | Classe | Action |
|--------|--------|--------|
| **Validation M3** | **6** (fin) | `/teacher/dashboard` → Valider module 3 |
| Contrôle Silver | **7** | 4/4 gates vertes |
| Déblocage M4 | **8 → 9** | File validation M3 vide |
| Gold ELIGIBLE | **10** | 18/18 gates |

---

## Encadré M4 — Terminologie (Classes 8–9)

| Indicateur | Valeur | Bande |
|------------|--------|-------|
| **Rotation** | 6×/an | Normale (4–12×) |
| **OTIF (taux de service)** | 95 % | Excellent |
| **Taux d'erreur** | 4 % | Acceptable |
| **Fill Rate** | Transversal | Distinct de l'OTIF — non central au sim M4 |

Enseigner depuis **corps de slide** + **Annexe A** (rotation · OTIF · erreurs).

---

## Checklist pré-classe

| ☐ | Action |
|---|--------|
| ☐ | Cohorte créée · Monitor filtré par cohorte |
| ☐ | Slides + notes professeur testées |
| ☐ | Annexe A (M4) · Annexe B (M5) distribuées avant Classe 9–10 |
| ☐ | Quiz M1 (C1) et M5 (C10) accessibles |
| ☐ | Fiche classe du jour relue |

---

## Checklist post-classe

| ☐ | Action |
|---|--------|
| ☐ | SCN du jour complétés ou plan rattrapage (C7–8) |
| ☐ | Quiz gate M1 (C1) / M5 (C10) si applicable |
| ☐ | Validation M3 (C6) |
| ☐ | Silver 4/4 (C7) |
| ☐ | Débrief Run Report ≥ 10 min |
| ☐ | Prérequis séance suivante confirmés |

---

## Sources RC16

`GUIDE_PROFESSEUR_TECWMS_10_CLASSES_RC16.md` · `PROFESSOR_EXPERIENCE_AUDIT.md` · `TECWMS_GUIDE_ENSEIGNANT_PDF_READY.md` · `TECWMS_GUIDE_M1_M3` · `TECWMS_GUIDE_M4_M5` · `GUIDE_OFFICIEL_REPONSES_M4_M5.md` · `docs/releases/RC15_CLASSROOM_READINESS_REPORT.md` · `docs/audits/CHECKPOINT_CERTIFICATION_GATING_AUDIT.md`

---

*Résumé RC16 QA finale — Documentation uniquement*
