# TEC.WMS — Gabarit maître Matrice des preuves

**Document:** B.3.3 — Evidence Matrix Master Template  
**Version:** Draft 1.0  
**Statut:** Documentation institutionnelle — non publié  
**Référence:** Phase B.3 Section C

---

## 1. Objet

La **Matrice des preuves** relie quatre niveaux pédagogiques :

```
Critères de réussite (mission)
        ↓
Preuves requises (observables)
        ↓
Indices Panel E (session live)
        ↓
Résultat certification (parcours TEC.LOG)
```

**Usage :**

- **Instructeur :** grille de débrief et validation formative
- **Rédacteur Fiche :** alimente la section « Preuves attendues »
- **Étudiant :** version simplifiée (3–5 puces max sur Fiche)

---

## 2. Gabarit maître (vide)

### SCN-___ — [Titre scénario]

| Métadonnée | Valeur |
|------------|--------|
| Module | M_ |
| Seuil évaluation | __/100 |
| Compétence primaire | |
| Bloom | |
| Seuil certification module | Voir Guide Maître |

#### Matrice détaillée

| # | Critère de réussite | Preuve requise (observable) | Étape / artefact | Indice Panel E (session) | Résultat certification |
|---|---------------------|----------------------------|------------------|--------------------------|------------------------|
| 1 | | | | `completedSteps` / tx / score | |
| 2 | | | | | |
| 3 | | | | | |
| n | Conformité finale | Aucun bloqueur compliance | `COMPLIANCE*` | `compliance.compliant = true` | Scénario comptabilisé module |

#### Synthèse certification

| Élément | Valeur |
|---------|--------|
| Seuil scénario atteint | score ≥ __ en mode évaluation |
| Quiz requis | [Oui M1 / Non] |
| Certification path | [Silver / Module M_ / Gold path] |
| Note compétence | |

#### Version étudiant (Fiche — max 5 puces)

1.
2.
3.

---

## 3. Patterns de preuve par type de scénario

### Pattern A — Flux transactionnel (M1, M2, M5 ops)

| Preuve type | Observable | Panel E / Cockpit |
|-------------|------------|-------------------|
| Étape validée | Step code dans completedSteps | Panel E, Panel F tags |
| Transaction postée | docRef POST | Panel B, moniteur |
| Stock cohérent | inventory[key] ≥ 0 | Panel B inventaire |
| Conformité | compliant true | Panel B bandeau |

### Pattern B — Inventaire / écart (M3, M5-016)

| Preuve type | Observable | Panel E / Cockpit |
|-------------|------------|-------------------|
| Écart détecté | CC_COUNT variance | cycle count data |
| Réconciliation | Texte CC_RECON | eval mode |
| Ajustement posté | Tx MI07 via CC_RECON | completedSteps + tx |
| Justification écrite | Texte CC_RECON documenté | Eval mode — **SCN-010+** si \|écart\| ≥ seuil |

**Politique M3 (G-C05 adoptée) :**

| Scénario | \|écart\| | CC_RECON | Ajustement | Justification écrite |
|----------|----------|----------|------------|----------------------|
| SCN-009 | −3 | Obligatoire | Obligatoire | Optionnelle (< 5 u.) |
| SCN-010 | −28 | Obligatoire | Obligatoire | **Obligatoire** (> 20 u.) |

### Pattern C — Analytique KPI (M4)

| Preuve type | Observable | Panel E / Cockpit |
|-------------|------------|-------------------|
| Données collectées | KPI_DATA done | Step + Panel B tour KPI |
| Calcul / interprétation | KPI_ROTATION, KPI_SERVICE | Steps + score |
| Diagnostic | KPI_DIAGNOSTIC | Step + eval score ≥ 70 |
| Clôture | COMPLIANCE_M4 | compliance |

---

## 4. Matrices de référence — exemples complets

### SCN-002 — Ghost GR (Pattern A)

| # | Critère | Preuve requise | Étape | Panel E | Certification |
|---|---------|----------------|-------|---------|---------------|
| 1 | GR-2025-001 postée | Tx GR POST, docRef visible | GR | completedSteps: GR | Identification problème |
| 2 | Stock REC-01 | qty > 0 SKU-001::REC-01 | PUTAWAY amont | inventory | M1 ≥ 60 |
| 3 | Conformité rétablie | 0 unposted | COMPLIANCE | compliant true | Silver path |

**Version étudiant :** GR postée · Stock au quai · Conformité verte

---

### SCN-009 — Cycle count −3 (Pattern B — G-C05 Closed)

| # | Critère | Preuve requise | Étape | Panel E | Certification |
|---|---------|----------------|-------|---------|---------------|
| 1 | Écart −3 identifié | Physique 97 vs système 100 | CC_COUNT | variance | Précision inventaire |
| 2 | CC_RECON documentée | Texte réconciliation | CC_RECON | eval mode | Obligatoire |
| 3 | Ajustement −3 posté | Tx MI07, stock = 97 | CC_RECON | tx | Alignement stock |
| 4 | Conformité verte | compliant | COMPLIANCE_M3 | compliant | M3 ≥ 70 |

**Version étudiant :** Écart −3 identifié · CC_RECON · Ajustement −3 posté · Conformité M3 · Score ≥ 70

---

### SCN-010 — Variance −28 (Pattern B)

| # | Critère | Preuve requise | Étape | Panel E | Certification |
|---|---------|----------------|-------|---------|---------------|
| 1 | Justification fournie | Texte CC_RECON documenté | CC_RECON | step + eval | Gestion écarts M3 |
| 2 | ADJ posté | Adjustment tx / step | CC_RECON/ADJ | completedSteps | M3 ≥ 70 |
| 3 | Conformité verte | compliant | COMPLIANCE_M3 | compliant | Module M3 |

---

### SCN-012 — Rotation stocks (Pattern C)

| # | Critère | Preuve requise | Étape | Panel E | Certification |
|---|---------|----------------|-------|---------|---------------|
| 1 | Formule rotation | Calcul documenté | KPI_ROTATION | step done | Analyse performance |
| 2 | Interprétation métier | Diagnostic surstock/sous-perf | KPI_DIAGNOSTIC | score qualitatif | M4 ≥ 70 |
| 3 | Clôture M4 | COMPLIANCE_M4 | COMPLIANCE_M4 | compliant | Expert M4 |

---

## 5. Index des matrices à produire (B.3.4 workbook)

| SCN | Pattern | Statut rédaction |
|-----|---------|------------------|
| 001 | A | À rédiger |
| 002 | A | Exemple § 4 |
| 003 | A | À rédiger |
| 004 | A+B | À rédiger |
| 005 | A+B | À rédiger |
| 006 | A | À rédiger |
| 007 | A | À rédiger |
| 008 | A | À rédiger |
| 009 | B | **Rédigé** — `scenarios/SCN-009/` · G-C05 Closed |
| 010 | B | Exemple § 4 |
| 011 | B | À rédiger |
| 012 | C | Exemple § 4 |
| 013 | C | À rédiger |
| 014 | C | À rédiger |
| 015 | A+B+C | À rédiger |
| 016 | A+B | À rédiger |
| 017 | C | À rédiger |

---

## 6. Instructions rédacteur

1. Partir des `successCriteria` dans missionData (source de vérité contenu).
2. Pour chaque critère, définir **une preuve observable** indépendante du score.
3. Mapper vers **un step code** ou artefact cockpit.
4. Indiquer l'**indice Panel E** correspondant (même si UI évolue en B.4).
5. Résumer en **≤ 5 puces** pour la Fiche étudiant.
6. Ne pas dupliquer les `failureConditions` — elles restent section séparée Fiche.

---

*TEC.WMS — Documentation B.3 · Matrice maître — dupliquer § 2 pour chaque SCN*
