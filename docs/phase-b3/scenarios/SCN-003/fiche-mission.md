# FICHE DE MISSION OPÉRATIONNELLE — SCN-003

**Référence:** CL-SCN-003  
**Code scénario:** SCN-003  
**Module:** M1 — Fondations logistiques  
**Seuil évaluation:** 60/100  
**Difficulté:** moyen  
**Statut:** ACTIF

*Concorde Logistics — Institutional Standard · QMS v2.0*

---

## Contexte opérationnel

Cinquante unités de **SKU-003** sont disponibles au quai **REC-01** (PO et GR déjà postées). Après rangement, une commande client exigera **plus de stock que disponible** en zone STOCKAGE (ex. SO pour 80 u. alors que seules 50 u. sont rangées). **Ordre obligatoire : Physique → Décision réappro → Expédition.**

## Objectif de la mission

Gestion d'une rupture de stock et réapprovisionnement d'urgence avant expédition.

## Rôles

| Type | Libellé |
|------|---------|
| **Rôle de mission** (poste simulé) | Responsable d'Opération |
| **Compétence évaluée** (rôle entrepôt) | Opérateur entrepôt |
| **Compétence primaire** | Prise de décision |
| **Niveau Bloom** | Appliquer |
| **Progression** | Fondation M1 |

## Spécifications techniques

| SKU | Quantité initiale | Emplacement |
|-----|-------------------|-------------|
| SKU-003 | 50 | REC-01 |

| Paramètre | Valeur indicative |
|-----------|-------------------|
| SO client (exemple) | 80 u. |
| Déficit à combler | 30 u. (PO corrective + GR) |
| Bin STOCKAGE cible | ex. B-01-R1-L2 |

## Actions à réaliser (étudiant)

1. **PUTAWAY_M1** — ranger 50 u. SKU-003 de REC-01 vers emplacement STOCKAGE (ex. B-01-R1-L2).
2. Créer une **SO** pour une quantité supérieure au stock disponible (ex. **80 u.**) — constater le blocage si stock insuffisant.
3. Créer une **PO corrective** + **GR** pour combler le déficit (ex. **+30 u.**), puis ranger le stock réapprovisionné (**PUTAWAY_M1**).
4. Compléter **PICKING_M1** → **GI** → **CC** → **COMPLIANCE**.

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

1. Ranger le stock en attente (REC-01 → STOCKAGE) avant toute expédition.
2. Identifier le déficit de stock **avant** de valider la GI.
3. Réapprovisionner (PO corrective + GR + putaway) jusqu'à couvrir la quantité SO.
4. Ne pas valider la GI tant que le stock en STOCKAGE est insuffisant.

## Résultat attendu

Commande client satisfaite après réapprovisionnement ; entrepôt conforme, scénario clôturable.

---

**NOTE INSTITUTIONNELLE — DOUBLE RÔLE**  
Le « Rôle de mission » décrit votre poste dans la simulation.  
La « Compétence évaluée » décrit ce que TEC.LOG mesure pour votre certification.  
Ces deux libellés peuvent différer sans contradiction.

*Référence : `docs/phase-b3/01-dual-role-standard.md` § 5*
