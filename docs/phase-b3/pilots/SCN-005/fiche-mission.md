# FICHE DE MISSION OPÉRATIONNELLE — SCN-005

**Référence:** CL-SCN-005  
**Code scénario:** SCN-005  
**Module:** M1 — Fondations logistiques  
**Seuil évaluation:** 60/100  
**Difficulté:** difficile  
**Statut:** ACTIF

*Concorde Logistics — Institutional Standard · QMS v2.0*

---

## Contexte opérationnel

Deux anomalies : (1) GR-2025-004 non postée pour SKU-004 (30 u.). (2) Écart inventaire SKU-005 (−8 u.) après le cycle. **Ordre obligatoire : Documents → Physique → Expédition.**

## Objectif de la mission

Résolution de non-conformités multiples en environnement complexe.

## Rôles

| Type | Libellé |
|------|---------|
| **Rôle de mission** | Superviseur Logistique |
| **Compétence évaluée** | Spécialiste qualité |
| **Compétence primaire** | Résolution de problèmes complexes |
| **Niveau Bloom** | Analyser |
| **Progression** | Fondation M1 |

## Spécifications techniques

| SKU | Quantité | Emplacement |
|-----|----------|-------------|
| SKU-004 / SKU-005 | 90 total | REC-01 / REC-02 |

## Actions à réaliser (étudiant)

1. Poster GR-2025-004 (MIGO) — SKU-004, 30 u., REC-01.
2. **PUTAWAY_M1** — ranger SKU-004 (REC-01 → STOCKAGE) et SKU-005 (REC-02 → STOCKAGE).
3. SO → **PICKING_M1** → **GI** pour les deux SKU.
4. **CC** — Cycle Count SKU-005 : saisir la quantité physique réelle (système − 8).
5. **ADJ** (MI07) pour l'écart, puis **COMPLIANCE**.

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

1. Poster la GR fantôme GR-2025-004 **avant** tout rangement SKU-004.
2. PUTAWAY_M1 des deux SKU, puis flux expédition (PICKING_M1 → GI).
3. CC + ADJ pour SKU-005, puis COMPLIANCE.

## Résultat attendu

Entrepôt 100 % conforme, scénario clôturable.

---

**NOTE INSTITUTIONNELLE — DOUBLE RÔLE**  
Le « Rôle de mission » décrit votre poste dans la simulation.  
La « Compétence évaluée » décrit ce que TEC.LOG mesure pour votre certification.  
Ces deux libellés peuvent différer sans contradiction.

*Référence : `docs/phase-b3/01-dual-role-standard.md` § 5*
