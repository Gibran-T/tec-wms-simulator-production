# FICHE DE MISSION OPÉRATIONNELLE — SCN-008

**Référence:** CL-SCN-008  
**Code scénario:** SCN-008  
**Module:** M2 — Traçabilité lots  
**Seuil évaluation:** 60/100  
**Difficulté:** difficile  
**Statut:** ACTIF

*Concorde Logistics — Institutional Standard · QMS v2.0*

---

## Contexte opérationnel

Trois lots de **SKU-003** sont en stock multi-bins, répartis par période de réception :

| Lot | Période | Priorité FIFO |
|-----|---------|---------------|
| **LOT-A** | Janvier | **Plus ancien — à prélever en premier** |
| LOT-B | Février | Intermédiaire |
| LOT-C | Mars | Plus récent |

Le client exige le respect strict du **FIFO**. Toute sortie doit privilégier **LOT-A** avant LOT-B et LOT-C.

*Accès Mission Control recommandé pour comparer dates de réception et stratégie de prélèvement.*

## Objectif de la mission

Appliquer FIFO sur trois lots du même SKU lors du rangement et du prélèvement — le lot le plus ancien (LOT-A) sort en premier.

## Rôles

| Type | Libellé |
|------|---------|
| **Rôle de mission** (poste simulé) | Spécialiste FIFO |
| **Compétence évaluée** (rôle entrepôt) | Spécialiste FIFO |
| **Compétence primaire** | Conformité FIFO |
| **Niveau Bloom** | Analyser |
| **Progression** | Intermédiaire M2 |

## Spécifications techniques

| SKU | Quantité totale | Lots | Emplacements |
|-----|-----------------|------|--------------|
| SKU-003 | 300 | LOT-A (jan), LOT-B (fév), LOT-C (mar) | Multi-bins STOCKAGE |

## Actions à réaliser (étudiant)

1. **GR multi-lots** — Valider les réceptions par lot (jan, fév, mars).
2. **PUTAWAY par lot** — Ranger chaque lot dans un bin STOCKAGE distinct (traçabilité séparée).
3. **FIFO_PICK lot A** — Prélever **LOT-A** (janvier) en premier, avant tout autre lot.
4. **STOCK_ACCURACY** — Valider la précision stock et la cohérence lot.
5. **COMPLIANCE_ADV** — Clôturer avec conformité avancée M2.

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

1. Identifier LOT-A comme lot le plus ancien (date janvier).
2. Ranger chaque lot séparément — pas de mélange non autorisé.
3. Vérifier que le prélèvement cible LOT-A avant LOT-B ou LOT-C.
4. Compléter STOCK_ACCURACY et COMPLIANCE_ADV.

## Résultat attendu

Prélèvement conforme FIFO (LOT-A en premier), traçabilité intacte, conformité M2 validée.

---

**NOTE INSTITUTIONNELLE — DOUBLE RÔLE**  
Le « Rôle de mission » décrit votre poste dans la simulation.  
La « Compétence évaluée » décrit ce que TEC.LOG mesure pour votre certification.  
Ces deux libellés peuvent différer sans contradiction.

*Référence : `docs/phase-b3/01-dual-role-standard.md` § 5*
