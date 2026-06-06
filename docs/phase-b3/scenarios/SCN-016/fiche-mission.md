# FICHE DE MISSION OPÉRATIONNELLE — SCN-016

**Référence:** CL-SCN-016  
**Code scénario:** SCN-016  
**Module:** M5 — Simulation intégrée et décision stratégique  
**Seuil évaluation:** 70/100  
**Difficulté:** difficile  
**Statut:** ACTIF

*Concorde Logistics — Institutional Standard · QMS v2.0*

---

## Contexte opérationnel

Cycle M5 avec **variance injectée** à l'inventaire cyclique — actions correctives obligatoires avant KPI et décision. Gestion d'exception en temps réel.

## Objectif de la mission

Gérer des écarts d'inventaire en cours de simulation intégrée et appliquer les corrections avant clôture.

## Rôles

| Type | Libellé |
|------|---------|
| **Rôle de mission** | Gestionnaire d'Entrepôt |
| **Compétence évaluée** | Gestionnaire entrepôt |
| **Compétence primaire** | Action corrective |
| **Niveau Bloom** | Évaluer |
| **Progression** | Maître M5 |

## Spécifications techniques

| SKU | Quantité | Emplacement |
|-----|----------|-------------|
| Variable | Variable | STOCKAGE |

## Actions à réaliser (étudiant)

1. **M5_RECEPTION** — réceptionner les marchandises fournisseur.
2. **M5_PUTAWAY** — ranger en zone STOCKAGE (FIFO).
3. **M5_CYCLE_COUNT** — exécuter l'inventaire cyclique (**variance détectée**).
4. **ADJ** — poster l'ajustement inventaire (MI07) pour résoudre l'écart.
5. **M5_REPLENISH** — poursuivre le réapprovisionnement après correction.
6. **M5_KPI** — calculer les KPI sur stock corrigé.
7. **M5_DECISION** — décision post-correction fondée sur KPI fiables.
8. **COMPLIANCE_M5** — valider la clôture M5.

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

1. Variance détectée au M5_CYCLE_COUNT.
2. **ADJ obligatoire** avant M5_KPI et M5_DECISION.
3. Traçabilité ADJ (audit trail complet).

## Résultat attendu

Écarts corrigés, simulation clôturée conforme — KPI et décision fondés sur stock réconcilié.

**Note :** Se distingue de SCN-015 (flux nominal sans variance).

---

**NOTE INSTITUTIONNELLE — DOUBLE RÔLE**  
Le « Rôle de mission » décrit votre poste dans la simulation.  
La « Compétence évaluée » décrit ce que TEC.LOG mesure pour votre certification.  
Ces deux libellés peuvent différer sans contradiction.

*Référence : `docs/phase-b3/01-dual-role-standard.md` § 5*
