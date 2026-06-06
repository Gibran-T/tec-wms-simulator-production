# TEC.WMS — Cahier de résolution des écarts (Gap Resolution Workbook)

**Document:** B.3.4 — Gap Resolution Workbook  
**Version:** 1.1 — B.3 close-out  
**Statut:** Documentation institutionnelle — **Full Approval candidate**  
**Source:** Audit Phase B.2 · Plan Phase B.3 Section D

---

## 1. Mode d'emploi

| Colonne | Description |
|---------|-------------|
| **ID** | Identifiant gap (G-C / G-I / G-O) |
| **Priorité** | Critical · Important · Optional |
| **Statut** | Open · In Progress · Draft Ready · Closed |
| **Livrable B.3** | Document ou section à produire |
| **Owner** | Rôle responsable |
| **SCN** | Scénarios affectés |

**Règle :** Fermer un gap = livrable documentation rédigé et relu. **Pas de fermeture par changement code** en phase B.3.

---

## 2. Registre des écarts — Critical

| ID | Priorité | Écart | SCN | Livrable B.3 | Owner | Statut | Action de résolution |
|----|----------|-------|-----|--------------|-------|--------|-------------------|
| G-C01 | Critical | Double rôle non expliqué aux étudiants | 001–017 | `01-dual-role-standard.md` | Coord. pédagogique | **Closed** (doc) | Standard rédigé ; footer 17/17 fiches · intégration Guide Maître = non bloquant |
| G-C02 | Critical | Fiche sans critères réussite/échec | 001–017 | `02-fiche-mission-canonical-template.md` § 10–11 | Rédacteur fiches | **Closed** (doc) | 17/17 fiches avec success/failure cross-refs |
| G-C03 | Critical | Fiche sans code SCN (REF scenarioId seul) | 001–017 | Gabarit § 2 en-tête | Rédacteur fiches | **Closed** (doc) | SCN-00N sur 17/17 en-têtes |
| G-C04 | Critical | Preuves attendues non documentées | 001–017 | `03-evidence-matrix-master-template.md` + matrices SCN | Rédacteur preuves | **Substantially Complete** | 17/17 matrices rédigées · index `00-INSTRUCTOR-INDEX.md` |
| G-C05 | Critical | Politique ADJ ambiguë écart −3 | 009 | `06-superviseur-runbook-addendum/SCN-009-adj-policy.md` + package SCN-009 | Superviseur M3 | **Closed** | Option B (refined) adoptée — CC_RECON + ajustement obligatoires ; justification optionnelle < 5 u. |
| G-C06 | Critical | alternativeAction SCN-006 contredit SCN-007 | 006 | Annexe instructeur Panel D | Rédacteur pédagogique | **Open** | Remplacer « split bins » par anti-patterns putaway 006 (zone, GR, capacité simple) |

### Détail G-C05 — SCN-009 (**Closed** — 2026-06-04)

**Décision institutionnelle :** Option B (refined) — approuvée par coordinateur pédagogique.

**Politique adoptée :**

| Élément | Exigence |
|---------|----------|
| **CC_RECON** | **Obligatoire** — documenter l'écart −3 sur SKU-001 |
| **Ajustement stock (MI07)** | **Obligatoire** — poster −3 via CC_RECON pour aligner système/physique |
| **Justification écrite** | **Optionnelle** lorsque \|écart\| < **5 unités** (seuil moteur M3) |
| **SCN-010** | Premier scénario exigeant justification formelle (seuil pédagogique 20 u.) |

**Livrables :** `scenarios/SCN-009/*` (8 fichiers) · `06-superviseur-runbook-addendum/SCN-009-adj-policy.md`

**Preuve Fiche harmonisée :** « Écart −3 identifié, réconcilié et corrigé (stock système = 97 u.) ; conformité M3 verte. »

**Note :** fermeture documentation uniquement — pas de modification moteur.

---

### Détail G-C06 — SCN-006 (texte de remplacement draft)

**Retirer :** « Ranger en plusieurs bins si capacité insuffisante » (valide pour SCN-007).

**Remplacer par (Guide étudiant / Panel D doc) :**

1. Ranger sans vérifier que la GR est postée — séquence invalide.
2. Choisir un bin hors zone STOCKAGE — pénalité zone.
3. Ignorer l'alerte capacité sur un bin unique alors que 150 u. dépassent la capacité affichée.

---

## 3. Registre des écarts — Important

| ID | Priorité | Écart | SCN | Livrable | Owner | Statut | Action |
|----|----------|-------|-----|----------|-------|--------|--------|
| G-I01 | Important | alternativeActions manquantes | 001, 003, 004, 009 | Supplément Guide étudiant | Rédacteur | Open | 3 anti-patterns par SCN (voir § 4) |
| G-I02 | Important | alternativeActions partielles (1 item) | 002, 005, 006 | Supplément Guide étudiant | Rédacteur | Open | Étendre à 3 items minimum |
| G-I03 | Important | certificationNote absente competency ref | 002, 003, 004, 005, 017 | `certification-mapping.md` par SCN | Coord. pédagogique | **Closed** (doc) | Notes rédigées dans packages · export Guide Maître = non bloquant |
| G-I04 | Important | studentActions vagues « CC pipeline » | 011 | Fiche SCN-011 harmonisée | Rédacteur | **Closed** (doc) | Pipeline explicite CC_LIST → … → REPLENISH |
| G-I05 | Important | Pipeline KPI abrégé | 014 | Fiche SCN-014 | Rédacteur | **Closed** (doc) | Pipeline KPI complet aligné SCN-012/013 |
| G-I06 | Important | studentActions en prose | 016 | Fiche SCN-016 | Rédacteur | **Closed** (doc) | Codes M5_* dans fiche B.3.2 |
| G-I07 | Important | successCriteria sans score ≥70 | 011 | Fiche SCN-011 § 10 | Rédacteur | **Closed** (doc) | Seuil 70 dans success-criteria + student evidence |
| G-I08 | Important | ERP/WMS hors Fiche | 001–017 | Gabarit § 12 toutes fiches | Rédacteur | **Closed** (doc) | 17/17 `erp-wms-mapping.md` + cross-ref fiche |
| G-I09 | Important | Chevauchement capstone 014 / 017 | 014, 017 | Guide Maître § différenciation | Coord. pédagogique | Open | M4 = tactique multi-KPI ; M5 = exécutif post-cycle |
| G-I10 | Important | Intelligence M2 via lien Mission Control | 006–008 | Quick-start étudiant M2 | Support pédagogique | Open | Encart « Ouvrir Mission Control » |

---

## 4. Brouillons anti-patterns (G-I01) — à intégrer Guide étudiant

### SCN-001
1. Valider GI sans vérifier stock disponible (MB52).
2. Sauter une étape du flux nominal (PO→GR→…→Compliance).
3. Ignorer les alertes conformité avant clôture.

### SCN-003
1. Valider GI avec stock insuffisant en STOCKAGE.
2. Ne pas créer de PO/GR corrective malgré le déficit.
3. Expédier sans réapprovisionner.

### SCN-004
1. Saisir la quantité système au cycle count au lieu du physique.
2. Passer à Compliance sans ADJ malgré variance −15.
3. Ignorer l'écart « intentionnel » du scénario.

### SCN-009
1. Ignorer l'écart −3 sur SKU-001 au comptage.
2. Ajuster sans justification ni réconciliation.
3. Clôturer COMPLIANCE_M3 avec écart non documenté.

### SCN-002 / 005 / 006 — extensions (G-I02)
- **002 :** Ajouter « Poursuivre putaway avec GR non postée » ; « Créer PO corrective inutile ».
- **005 :** Ajouter « Putaway SKU-004 avant post GR-004 » ; « Oublier ADJ SKU-005 ».
- **006 :** Voir G-C06 (remplacement complet).

---

## 5. Registre des écarts — Optional

| ID | Priorité | Écart | SCN | Livrable | Statut |
|----|----------|-------|-----|----------|--------|
| G-O01 | Optional | Lien PDF Guide Maître in-app | All | Bibliographie plateforme | Open |
| G-O02 | Optional | Parité EN fiches | All | Lot traduction | Open |
| G-O03 | Optional | Bloom sur Fiche | All | Gabarit § 6 enrichi | Open |
| G-O04 | Optional | Tour KPI M4 dans guide superviseur | 012–014 | Annexe statique m4KpiControlTower | Open |
| G-O05 | Optional | Banque questions débrief | All | Supplément instructeur | Open |

---

## 6. Suivi par scénario (matrice de clôture)

| SCN | Gaps ouverts (non bloquants) | Fiche harmonisée | Matrice preuves | Guide anti-patterns | Prêt revue |
|-----|------------------------------|------------------|-----------------|---------------------|------------|
| 001 | G-I01 | ☑ | ☑ | ☑ | ☑ |
| 002 | G-I02 | ☑ | ☑ | ☑ | ☑ |
| 003 | G-I01 | ☑ | ☑ | ☑ | ☑ |
| 004 | G-I01 | ☑ | ☑ | ☑ | ☑ |
| 005 | G-I02 | ☑ | ☑ | ☑ | ☑ |
| 006 | **G-C06**, G-I02, G-I10 | ☑ | ☑ | ☑ | ☐ |
| 007 | — | ☑ | ☑ | ☑ | ☑ |
| 008 | G-I10 | ☑ | ☑ | ☑ | ☑ |
| 009 | G-I01 | ☑ | ☑ | ☑ | ☑ |
| 010 | — | ☑ | ☑ | ☑ | ☑ |
| 011 | — | ☑ | ☑ | ☑ | ☑ |
| 012 | — | ☑ | ☑ | ☑ | ☑ |
| 013 | — | ☑ | ☑ | ☑ | ☑ |
| 014 | G-I09 | ☑ | ☑ | ☑ | ☑ |
| 015 | G-I09 | ☑ | ☑ | ☑ | ☑ |
| 016 | — | ☑ | ☑ | ☑ | ☑ |
| 017 | G-I09 | ☑ | ☑ | ☑ | ☑ |

**Légende :** seul **G-C06** (SCN-006 Panel D code) reste bloquant côté application. G-I01/G-I02 = enrichissement Guide étudiant optionnel.

---

## 7. Jalons B.3.4

| Jalon | Statut | Critère |
|-------|--------|---------|
| J1 — Standards approuvés | ☑ Draft ready | Docs 01–05 + `00-INSTRUCTOR-INDEX.md` |
| J2 — 5 fiches référence (Gate 2) | ☑ Approved | 002, 005, 010, 012, 013 |
| J3 — 17 matrices preuves | ☑ Complete | 17/17 rédigées |
| J4 — Gaps Critical documentation | ☑ Closed (doc) | G-C01–05 Closed · G-C04 Substantially Complete · **G-C06 Open** (code) |
| J5 — B.3.2 expansion | ☑ Complete | 12 scénarios `scenarios/` |
| J6 — G-C05 closure | ☑ Closed | Option B (refined) |
| J7 — Full Approval candidate | ☑ | `README.md` + index instructeur · en attente commit |

---

## 8. Matrices preuves — statut rédaction

| SCN | Emplacement | Statut |
|-----|-------------|--------|
| 001–005 | `pilots/` + `scenarios/` | ☑ Rédigé |
| 006–008 | `scenarios/` | ☑ Rédigé |
| 009–011 | `scenarios/` + `pilots/SCN-010` | ☑ Rédigé |
| 012–014 | `pilots/` + `scenarios/` | ☑ Rédigé |
| 015–017 | `scenarios/` | ☑ Rédigé |

Index consolidé : `00-INSTRUCTOR-INDEX.md`

---

*TEC.WMS — Gap Workbook · Mettre à jour statuts lors de la rédaction · Pas de commit code*
