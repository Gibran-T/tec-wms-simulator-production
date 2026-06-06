# FICHE DE MISSION OPÉRATIONNELLE — SCN-015

**Référence:** CL-SCN-015  
**Code scénario:** SCN-015  
**Module:** M5 — Simulation intégrée et décision stratégique  
**Seuil évaluation:** 70/100  
**Difficulté:** moyen  
**Statut:** ACTIF

*Concorde Logistics — Institutional Standard · QMS v2.0*

---

## Contexte opérationnel

Simulation M5 complète : réception fournisseur, rangement FIFO, inventaire cyclique, réapprovisionnement, calcul KPI et décision opérationnelle — **flux nominal sans variance injectée**.

## Objectif de la mission

Exécuter un cycle opérationnel intégré fournisseur → entrepôt → client (gold path M5).

## Rôles

| Type | Libellé |
|------|---------|
| **Rôle de mission** | Gestionnaire d'Entrepôt |
| **Compétence évaluée** | Gestionnaire entrepôt |
| **Compétence primaire** | Opérations intégrées |
| **Niveau Bloom** | Évaluer |
| **Progression** | Maître M5 (Gold path) |

## Spécifications techniques

| SKU | Quantité | Emplacement |
|-----|----------|-------------|
| Multi-SKU | Variable | REC → STOCKAGE → EXP |

## Actions à réaliser (étudiant)

1. **M5_RECEPTION** — réceptionner les marchandises fournisseur au quai.
2. **M5_PUTAWAY** — ranger en zone STOCKAGE (respect FIFO).
3. **M5_CYCLE_COUNT** — exécuter l'inventaire cyclique (sans écart à corriger).
4. **M5_REPLENISH** — déclencher le réapprovisionnement selon règles Min/Max.
5. **M5_KPI** — calculer et interpréter les KPI post-cycle.
6. **M5_DECISION** — formuler la décision opérationnelle fondée sur les KPI.
7. **COMPLIANCE_M5** — valider la clôture M5.

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

1. Chaque étape M5 validée dans l'ordre (gold path).
2. Cohérence stock bout-en-bout (REC → STOCKAGE → EXP).
3. KPI final conforme avant M5_DECISION.

## Résultat attendu

Cycle intégré complété, conformité M5 — progression certification Gold.

**Note :** Scénario **opérationnel intégré** — pas de variance injectée (cf. SCN-016).

---

**NOTE INSTITUTIONNELLE — DOUBLE RÔLE**  
Le « Rôle de mission » décrit votre poste dans la simulation.  
La « Compétence évaluée » décrit ce que TEC.LOG mesure pour votre certification.  
Ces deux libellés peuvent différer sans contradiction.

*Référence : `docs/phase-b3/01-dual-role-standard.md` § 5*
