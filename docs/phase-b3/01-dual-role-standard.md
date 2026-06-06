# TEC.WMS — Standard du double rôle pédagogique

**Document:** B.3.1 — Dual Role Standard  
**Version:** Draft 1.0  
**Statut:** Documentation institutionnelle — non publié  
**Périmètre:** SCN-001 → SCN-017 · Modules M1–M5  
**Référence:** Phase B.3 Documentation Harmonization Plan (audit B.2, commit `a97fafd`)

---

## 1. Objet du document

Ce standard définit **deux lectures complémentaires du rôle** dans le simulateur TEC.WMS. Il doit être reproduit **verbatim** (ou traduit fidèlement) dans :

- Guide Maître (Matrice de Compétences)
- Fiche Mission opérationnelle
- Mission Control / Couche d'intelligence opérationnelle
- Panneau E — Évaluation des compétences

**Aucune modification du moteur de certification, du scoring ou de la logique scénario n'est requise pour appliquer ce standard.**

---

## 2. Définitions institutionnelles

### 2.1 Rôle de mission (Mission Role)

> Le **poste opérationnel** que l'étudiant endosse **pendant la simulation**.  
> Il répond à la question : *« En tant que qui exécutez-vous les actions dans l'entrepôt numérique ? »*

**Caractéristiques :**

- Assigné par scénario (ex. Contrôleur Qualité Logistique, Planificateur Capacité).
- Oriente le briefing, la Fiche Mission et le panneau Apprentissage ERP/WMS (Panel C).
- Peut être **plus spécialisé** que la compétence évaluée (ex. superviseur opérationnel pour une compétence « opérateur »).

**Champ source (application) :** `mission.role` dans `missionData` / `missionDataExtended`.

---

### 2.2 Rôle entrepôt — compétence (Warehouse Role)

> Le **profil de compétence certifiable** mesuré selon la **Matrice TEC.LOG** (Guide Maître).  
> Il répond à la question : *« Quelle capacité professionnelle démontrez-vous ? »*

**Caractéristiques :**

- Aligné sur la progression M1 → M5 (Fondation → Maître).
- Associé au niveau Bloom, à la maturité ERP/WMS et au seuil d'évaluation (60 ou 70).
- Affiché principalement dans le panneau Évaluation compétences (Panel E).

**Champ source (application) :** `competencyMap.warehouseRole` + `primaryCompetency`.

---

### 2.3 Principe de non-contradiction

Les deux rôles sont **complémentaires, non contradictoires**.

| Lecture | Focus | Exemple SCN-002 |
|---------|-------|-----------------|
| Mission Role | Fonction opérationnelle simulée | Contrôleur Qualité Logistique |
| Warehouse Role | Compétence certifiée | Opérateur entrepôt (Identification de problème) |

Un contrôleur qualité **exécute** des actions d'opérateur tout en démontrant une **compétence** d'identification de problème. L'instructeur présente les deux explicitement en ouverture de séance.

---

## 3. Formulation standard (étudiant)

### Français (obligatoire en séance)

> « Pour ce scénario, vous agissez en tant que **[Rôle de mission]**.  
> Nous évaluons votre maîtrise de la compétence **[Rôle entrepôt — compétence]** (niveau Bloom : **[niveau]**). »

### English (référence)

> « For this scenario, you operate as **[Mission Role]**.  
> We assess your **[Warehouse Role]** competency (Bloom level: **[level]**). »

---

## 4. Placement par surface

| Surface | Rôle de mission | Rôle entrepôt — compétence | Élément UI cible (réf.) |
|---------|-----------------|----------------------------|-------------------------|
| **Guide Maître** | § Simulation — « Poste simulé » | § Matrice — « Compétence évaluée » | Document PDF / annexe |
| **Fiche Mission** | En-tête « Rôle assigné » | Nouveau champ « Compétence évaluée » | `MissionSheet` (futur B.4) |
| **Mission Control — Panel A** | Briefing — rôle implicite dans contexte | Non affiché (renvoi Panel E) | `OperationalIntelligenceLayer` |
| **Mission Control — Panel C** | « Rôle professionnel » = Mission Role | Lien « Voir compétence → Panel E » | `mission.role` |
| **Mission Control — Panel E** | Sous-texte « Poste simulé : [role] » | « Rôle entrepôt » principal | `competencyMap` |
| **Fiche Mission (pied)** | Note dual-role (§ 5) | Idem | Texte institutionnel |

---

## 5. Note de bas de page — Fiche Mission (texte réutilisable)

```
NOTE INSTITUTIONNELLE — DOUBLE RÔLE
Le « Rôle assigné » décrit votre poste dans la simulation.
La « Compétence évaluée » décrit ce que TEC.LOG mesure pour votre certification.
Ces deux libellés peuvent différer sans contradiction : vous pouvez occuper
un poste spécialisé tout en démontrant une compétence transversale du référentiel.
```

---

## 6. Table de correspondance SCN-001 → SCN-017

| SCN | Module | Rôle de mission | Rôle entrepôt — compétence | Écart notable |
|-----|--------|-----------------|----------------------------|---------------|
| SCN-001 | M1 | Gestionnaire de Stocks | Opérateur entrepôt | Mission plus senior que compétence |
| SCN-002 | M1 | Contrôleur Qualité Logistique | Opérateur entrepôt | Spécialisation qualité vs compétence base |
| SCN-003 | M1 | Responsable d'Opération | Opérateur entrepôt | Décision vs exécution |
| SCN-004 | M1 | Auditeur d'Inventaire | Spécialiste qualité | Audit vs qualité |
| SCN-005 | M1 | Superviseur Logistique | Spécialiste qualité | Supervision vs qualité |
| SCN-006 | M2 | Spécialiste Rangement | Spécialiste rangement | Alignés |
| SCN-007 | M2 | Planificateur Capacité | Planificateur capacité | Alignés |
| SCN-008 | M2 | Spécialiste FIFO | Spécialiste FIFO | Alignés |
| SCN-009 | M3 | Auditeur Inventaire | Auditeur inventaire | Alignés |
| SCN-010 | M3 | Gestionnaire Inventaire | Gestionnaire inventaire | Alignés |
| SCN-011 | M3 | Planificateur Approvisionnement | Planificateur supply | Libellé FR/EN proche |
| SCN-012 | M4 | Analyste Logistique | Analyste logistique | Alignés |
| SCN-013 | M4 | Responsable Performance | Responsable performance | Alignés |
| SCN-014 | M4 | Directeur des Opérations | Directeur opérations | Alignés |
| SCN-015 | M5 | Gestionnaire d'Entrepôt | Gestionnaire entrepôt | Alignés |
| SCN-016 | M5 | Gestionnaire d'Entrepôt | Gestionnaire entrepôt | Alignés (même titre, objectifs différents) |
| SCN-017 | M5 | Directeur Logistique | Directeur logistique | Alignés |

**Règle instructeur :** Si écart notable (M1 surtout), lire la formulation standard (§ 3) **avant** le démarrage du run.

---

## 7. Responsabilités

| Rôle | Action |
|------|--------|
| **Coordinateur pédagogique** | Valider ce standard dans le Guide Maître |
| **Instructeur** | Lire § 3 en ouverture de chaque scénario M1 |
| **Rédacteur Fiche Mission** | Intégrer § 5 en pied de chaque fiche harmonisée |
| **Support technique** | Aucune action code en B.3 — texte uniquement |

---

## 8. Historique des révisions

| Version | Date | Auteur | Changement |
|---------|------|--------|------------|
| Draft 1.0 | 2026-06-04 | Phase B.3 | Création initiale depuis audit B.2 |

---

*TEC.WMS — Collège de la Concorde · Quality Management System v2.0 · Documentation only*
