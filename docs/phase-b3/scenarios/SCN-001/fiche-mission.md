# FICHE DE MISSION OPÉRATIONNELLE — SCN-001

**Référence:** CL-SCN-001  
**Code scénario:** SCN-001  
**Module:** M1 — Fondations logistiques  
**Seuil évaluation:** 60/100  
**Difficulté:** facile  
**Statut:** ACTIF

*Concorde Logistics — Institutional Standard · QMS v2.0*

---

## Contexte opérationnel

Concorde Logistics a reçu une commande standard. Vous devez assurer la réception, le rangement et l'expédition **sans aucune anomalie système** — flux nominal de bout en bout.

## Objectif de la mission

Exécution d'un flux logistique nominal complet (End-to-End).

## Rôles

| Type | Libellé |
|------|---------|
| **Rôle de mission** (poste simulé) | Gestionnaire de Stocks |
| **Compétence évaluée** (rôle entrepôt) | Opérateur entrepôt |
| **Compétence primaire** | Exécution opérationnelle |
| **Niveau Bloom** | Comprendre |
| **Progression** | Fondation M1 |

## Spécifications techniques

| SKU | Quantité | Emplacement |
|-----|----------|-------------|
| SKU-001 | 100 | REC-01 |

## Actions à réaliser (étudiant)

1. Créer et poster une **PO** (ME21N) vers REC-01 pour SKU-001 (100 u.).
2. Créer et poster la **GR** (MIGO) — le stock apparaît au quai.
3. **PUTAWAY_M1** : ranger REC-01 → emplacement STOCKAGE (LT0A).
4. Vérifier le stock (**MB52**), créer la **SO**, **PICKING_M1** → **GI**.
5. **CC** (MI01), puis **COMPLIANCE** (MB52).

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

1. Vérifier la disponibilité du bin de réception (REC-01).
2. Valider la correspondance PO ↔ GR.
3. Confirmer le rangement (PUTAWAY_M1) en zone STOCKAGE.

## Résultat attendu

Flux complété avec conformité système au vert.

---

**NOTE INSTITUTIONNELLE — DOUBLE RÔLE**  
Le « Rôle de mission » décrit votre poste dans la simulation.  
La « Compétence évaluée » décrit ce que TEC.LOG mesure pour votre certification.  
Ces deux libellés peuvent différer sans contradiction.

*Référence : `docs/phase-b3/01-dual-role-standard.md` § 5*
