# TEC.WMS — Plan du paquet de référence instructeur

**Document:** B.3.5 — Instructor Reference Package Outline  
**Version:** Draft 1.0  
**Statut:** Documentation institutionnelle — non publié  
**Audience:** Enseignants · Superviseurs simulation · Coordinateurs TEC.LOG

---

## 1. Objet du paquet

Le **Instructor Reference Package (IRP)** regroupe tous les artefacts B.3 nécessaires pour **animer, évaluer et débriefer** les 17 scénarios sans accéder au code application.

**Format cible :** dossier `TEC.WMS-IRP-B3/` (Markdown + export PDF optionnel post-approbation).

**Hors périmètre B.3 :** modification des PDF legacy existants dans `docs/*.pdf`.

---

## 2. Structure du paquet (arborescence)

```
TEC.WMS-IRP-B3/
├── 00-README-INSTRUCTEUR.md
├── 01-standards/
│   ├── dual-role-standard.md          ← copie 01-dual-role-standard.md
│   ├── fiche-mission-gabarit.md       ← copie 02-fiche-mission-canonical-template.md
│   └── evidence-matrix-gabarit.md     ← copie 03-evidence-matrix-master-template.md
├── 02-fiches-mission/
│   ├── M1-SCN-001.md … SCN-005.md
│   ├── M2-SCN-006.md … SCN-008.md
│   ├── M3-SCN-009.md … SCN-011.md
│   ├── M4-SCN-012.md … SCN-014.md
│   └── M5-SCN-015.md … SCN-017.md
├── 03-matrices-preuves/
│   └── SCN-001.md … SCN-017.md
├── 04-guide-seance/
│   ├── ouverture-seance-script.md
│   ├── dual-role-script-FR-EN.md
│   ├── m2-mission-control-quickstart.md
│   └── debrief-questions-by-module.md
├── 05-guide-etudiant-supplements/
│   ├── anti-patterns-SCN-001-017.md
│   └── panel-d-decision-support-notes.md
├── 06-superviseur-runbook-addendum/
│   ├── SCN-009-adj-policy.md
│   ├── SCN-014-vs-017-capstone.md
│   └── m4-kpi-tower-instructor-annex.md
├── 07-gap-workbook/
│   └── gap-resolution-workbook.md     ← copie 04-gap-resolution-workbook.md
└── 08-bibliographie/
    ├── liens-pdf-legacies.md
    └── correspondance-app-panels.md
```

---

## 3. Contenu par section

### 3.1 `00-README-INSTRUCTEUR.md`

| Section | Contenu |
|---------|---------|
| Vue d'ensemble | Objectif IRP, version B.3, 17 SCN |
| Prérequis | Accès simulateur, rôles teacher/admin |
| Comment utiliser le paquet | Avant / pendant / après séance |
| Carte des panneaux Mission Control | A–F intelligence layer |
| Contacts | Support pédagogique TEC |

---

### 3.2 `01-standards/`

Documents normatifs **non modifiables en séance** :

1. Standard double rôle (obligatoire lecture J0 formation instructeur)
2. Gabarit Fiche Mission (référence rédaction)
3. Gabarit matrice preuves (référence évaluation)

---

### 3.3 `02-fiches-mission/`

- 17 fiches harmonisées selon gabarit canonique
- **5 fiches pilotes en priorité :** SCN-002, 005, 010, 012, 013
- Chaque fiche = source pour projection en classe (pas d'impression PDF legacy requise)

---

### 3.4 `03-matrices-preuves/`

- 17 matrices (gabarit § 2)
- Utilisation débrief : cocher colonne « Preuve observée » en live run
- Lien explicite vers indices Panel E (même libellés que cockpit)

---

### 3.5 `04-guide-seance/`

#### `ouverture-seance-script.md` (5 min)

1. Annoncer SCN-00N et module
2. Lire script double rôle (§ 01-standard)
3. Rappeler seuil 60 ou 70
4. Indiquer où ouvrir Fiche + Mission Control
5. Mode démo vs évaluation

#### `m2-mission-control-quickstart.md`

- Route putaway `/student/module2/run/:id/putaway`
- Bannière « Mission Control » → intelligence layer
- Panneaux C et E ouverts par défaut quand données présentes

#### `debrief-questions-by-module.md`

| Module | Questions type |
|--------|----------------|
| M1 | Quelle anomalie avez-vous détectée en premier ? Quelle preuve de conformité ? |
| M2 | Capacité / FIFO : quelle règle a guidé votre bin / lot ? |
| M3 | Écart : réconciliation vs ajustement — pourquoi ? |
| M4 | Quel KPI a été le levier principal ? Trade-offs ? |
| M5 | Cycle intégré : où l'écart a-t-il faussé la décision ? |

---

### 3.6 `05-guide-etudiant-supplements/`

**Séparé des Fiches Mission** (anti-patterns = ce qu'il ne faut pas faire) :

- Consolidation `04-gap-workbook.md` § 4
- Notes Panel D : distinction « action recommandée » vs « alternatives à éviter »
- Ton : guidage étudiant, **pas** solution pas-à-pas enseignant

---

### 3.7 `06-superviseur-runbook-addendum/`

| Fichier | Résout gap |
|---------|------------|
| `SCN-009-adj-policy.md` | G-C05 — **Draft Ready / Closed** |
| `SCN-014-vs-017-capstone.md` | G-I09 |
| `m4-kpi-tower-instructor-annex.md` | G-O04 (tour KPI 012–014) |

---

### 3.8 `07-gap-workbook/`

- Suivi ouverture/fermeture écarts
- Tableau de bord réunion pédagogique hebdomadaire

---

### 3.9 `08-bibliographie/`

#### `liens-pdf-legacies.md`

| PDF existant | Usage | Relation B.3 |
|--------------|-------|--------------|
| `AIDE-MÉMOIRE_ENSEIGNANT_*.pdf` | Aide-mémoire rapide | Complété par IRP, non remplacé |
| `FICHES_DE_MISSION_ÉTUDIANT_*.pdf` | Fiches historiques | Remplacées à terme par `02-fiches-mission/` |
| `GUIDE_DU_SUPERVISEUR_ET_RUNBOOK_*.pdf` | Runbook ops | Addendum `06-superviseur-runbook-addendum/` |

#### `correspondance-app-panels.md`

| Panneau | Document IRP principal |
|---------|------------------------|
| A — Briefing | Fiche § Contexte, Objectif, Critères |
| B — Tour de contrôle | Matrice preuves (observables live) |
| C — ERP/WMS | Fiche § ERP + stepErpMap référence |
| D — Décision | Guide étudiant anti-patterns |
| E — Compétences | Standard double rôle + Guide Maître |
| F — Résolution | Fiche § Actions + runbook recovery |

---

## 4. Parcours instructeur recommandé

### Formation initiale (2 h)

| Durée | Activité | Document |
|-------|----------|----------|
| 30 min | Standard double rôle | `01-standards/dual-role-standard.md` |
| 30 min | Gabarit Fiche + preuves | `01-standards/*` |
| 30 min | Walkthrough cockpit SCN-002 live | `02-fiches/SCN-002` + `03-matrices/SCN-002` |
| 30 min | Q&R + gap workbook | `07-gap-workbook/` |

### Par séance (30 min prep)

1. Lire Fiche harmonisée du SCN
2. Imprimer / projeter matrice preuves
3. Préparer script ouverture (§ 3.5)
4. Vérifier mode démo vs eval

### Post-séance (15 min)

1. Cocher preuves observées sur matrice
2. Noter écarts documentation (remonter gap workbook)
3. Questions débrief module

---

## 5. Checklist publication IRP

- [ ] 5 standards et gabarits inclus
- [ ] ≥ 5 fiches pilotes rédigées
- [ ] ≥ 5 matrices preuves complètes
- [ ] Script ouverture FR validé
- [ ] Anti-patterns SCN à gaps G-I01 rédigés
- [x] Addendum SCN-009 ADJ policy rédigé (G-C05 Closed)
- [ ] Différenciation 014 vs 017 rédigée
- [ ] README instructeur complet
- [ ] Revue coordinateur pédagogique
- [ ] **Aucun commit code** — dossier documentation seulement

---

## 6. Calendrier de assembly (suggestion)

| Semaine | Livrable IRP |
|---------|--------------|
| 1 | `00-README` + `01-standards` + `04-guide-seance` scripts |
| 2 | `02-fiches` M1 + M2 pilotes |
| 3 | `02-fiches` M3–M5 + `03-matrices` complètes |
| 4 | `05–08` + revue globale + export PDF optionnel |

---

## 7. Relation phases suivantes

| Phase | Relation IRP |
|-------|--------------|
| **B.3** (actuelle) | Rédaction Markdown drafts |
| **B.4** (future) | Implémentation UI Fiche selon gabarit — IRP reste source |
| **Publication** | Export PDF IRP après approbation institutionnelle (hors B.3) |

---

*TEC.WMS — Instructor Reference Package Outline · Documentation B.3 only*
