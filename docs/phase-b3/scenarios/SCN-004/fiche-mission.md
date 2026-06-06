# FICHE DE MISSION OPÉRATIONNELLE — SCN-004

**Référence:** CL-SCN-004  
**Code scénario:** SCN-004  
**Module:** M1 — Fondations logistiques  
**Seuil évaluation:** 60/100  
**Difficulté:** difficile  
**Statut:** ACTIF

*Concorde Logistics — Institutional Standard · QMS v2.0*

---

## Contexte opérationnel

Deux cents unités de **SKU-006** ont été reçues (PO/GR postées). Après rangement et **expédition partielle**, le comptage physique révélera un **écart de −15 unités** entre le stock système et la quantité réellement présente. **Ordre obligatoire : Physique → Expédition → Inventaire → Ajustement.**

## Objectif de la mission

Réconciliation d'inventaire suite à un écart physique/système.

## Rôles

| Type | Libellé |
|------|---------|
| **Rôle de mission** (poste simulé) | Auditeur d'Inventaire |
| **Compétence évaluée** (rôle entrepôt) | Spécialiste qualité |
| **Compétence primaire** | Analyse des écarts |
| **Niveau Bloom** | Analyser |
| **Progression** | Fondation M1 |

## Spécifications techniques

| SKU | Quantité reçue | Emplacement |
|-----|----------------|-------------|
| SKU-006 | 200 | REC-01 → B-02-R1-L1 |

| Paramètre | Valeur indicative |
|-----------|-------------------|
| Quantité physique au CC | 185 u. (exemple) |
| Écart intentionnel | −15 u. |
| Stock système avant CC | 200 u. |

## Actions à réaliser (étudiant)

1. **PUTAWAY_M1** — ranger 200 u. SKU-006 de REC-01 vers B-02-R1-L1 (zone STOCKAGE).
2. Créer une **SO** → **PICKING_M1** → **GI** selon le flux standard (expédition partielle).
3. **CC** (MI01) — saisir la **quantité physique réelle** (ex. **185** si le système affiche 200) ; ne pas recopier la quantité système.
4. **ADJ** (MI07) — corriger l'écart de **−15**, puis **COMPLIANCE**.

## Preuves attendues

Voir `student-expected-evidence.md`.

## Critères de réussite

Voir `success-criteria.md`.

## Conditions d'échec

Voir `failure-conditions.md`.

## Équivalents ERP/WMS

Voir `erp-wms-mapping.md`.

## Lien certification

Voir `certification-mapping.md`.

## Points de contrôle

1. Ranger les 200 unités vers la zone STOCKAGE avant expédition.
2. Exécuter SO → PICKING_M1 → GI (expédition partielle) selon le flux standard.
3. Au cycle count, entrer la quantité **physique** comptée — pas la quantité système.
4. Appliquer **ADJ** pour l'écart −15 avant de clôturer en conformité.

## Résultat attendu

Écart −15 résolu via ADJ ; entrepôt 100 % conforme, scénario clôturable.

---

**NOTE INSTITUTIONNELLE — DOUBLE RÔLE**  
Le « Rôle de mission » décrit votre poste dans la simulation.  
La « Compétence évaluée » décrit ce que TEC.LOG mesure pour votre certification.  
Ces deux libellés peuvent différer sans contradiction.

*Référence : `docs/phase-b3/01-dual-role-standard.md` § 5*
