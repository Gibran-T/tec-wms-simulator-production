# TEC.WMS — Index instructeur (17 scénarios)

**Version:** 1.0 — B.3 Full Approval candidate  
**Usage:** Point d'entrée unique pour les packages documentation SCN-001→017  
**G-C05 :** **Closed** — politique SCN-009 dans [06-superviseur-runbook-addendum/SCN-009-adj-policy.md](./06-superviseur-runbook-addendum/SCN-009-adj-policy.md)

---

## Recommandations d'usage instructeur

1. **Ouvrir la séance** — lire le script dans `instructor-debrief.md` + note double rôle (`01-dual-role-standard.md` § 3 pour M1).
2. **Distribuer la fiche** — `fiche-mission.md` (étudiant) ; preuves dans `student-expected-evidence.md`.
3. **Valider en débrief** — `evidence-matrix.md` (grille à cocher) + `success-criteria.md`.
4. **Références Gate 2** — pour M1/M3/M4, s'appuyer sur les pilotes listés ci-dessous comme modèles institutionnels.
5. **SCN-009** — appliquer politique G-C05 adoptée (CC_RECON + ajustement −3 obligatoires ; justification optionnelle < 5 u.).
6. **SCN-010** — premier scénario avec justification formelle obligatoire (écart > 20 u.).

---

## Module M1 — Fondations logistiques (seuil **60/100**)

| SCN | Titre | Difficulté | Package | Référence pilote | Statut |
|-----|-------|------------|---------|------------------|--------|
| [SCN-001](scenarios/SCN-001/) | Cycle nominal E2E | facile | `scenarios/` | SCN-002 | Complet |
| [SCN-002](pilots/SCN-002/) | Réception fantôme (Ghost GR) | moyen | `pilots/` | **Gate 2** | Référence |
| [SCN-003](scenarios/SCN-003/) | Rupture stock / réappro | moyen | `scenarios/` | SCN-005 | Complet |
| [SCN-004](scenarios/SCN-004/) | Écart inventaire −15 | difficile | `scenarios/` | SCN-005 | Complet |
| [SCN-005](pilots/SCN-005/) | Non-conformités multiples | difficile | `pilots/` | **Gate 2** | Référence |

## Module M2 — Exécution d'entrepôt (seuil **60/100**)

| SCN | Titre | Difficulté | Package | Référence | Statut |
|-----|-------|------------|---------|-----------|--------|
| [SCN-006](scenarios/SCN-006/) | Rangement structuré | facile | `scenarios/` | — | Complet ⚠️ G-C06 |
| [SCN-007](scenarios/SCN-007/) | Capacité emplacement | moyen | `scenarios/` | — | Complet |
| [SCN-008](scenarios/SCN-008/) | FIFO multi-lots | difficile | `scenarios/` | — | Complet |

## Module M3 — Gestion inventaire avancée (seuil **70/100**)

| SCN | Titre | Difficulté | Package | Référence pilote | Statut |
|-----|-------|------------|---------|------------------|--------|
| [SCN-009](scenarios/SCN-009/) | Inventaire cyclique −3 | facile | `scenarios/` | SCN-010 | Complet · G-C05 Closed |
| [SCN-010](pilots/SCN-010/) | Analyse d'écart −28 | difficile | `pilots/` | **Gate 2** | Référence |
| [SCN-011](scenarios/SCN-011/) | Réappro Min/Max | difficile | `scenarios/` | SCN-010 | Complet |

## Module M4 — Indicateurs de performance (seuil **70/100**)

| SCN | Titre | Difficulté | Package | Référence pilote | Statut |
|-----|-------|------------|---------|------------------|--------|
| [SCN-012](pilots/SCN-012/) | Rotation des stocks | facile | `pilots/` | **Gate 2** | Référence |
| [SCN-013](pilots/SCN-013/) | Taux de service et erreurs | moyen | `pilots/` | **Gate 2** | Référence |
| [SCN-014](scenarios/SCN-014/) | Diagnostic stratégique multi-KPI | difficile | `scenarios/` | SCN-012, 013 | Complet |

## Module M5 — Simulation intégrée (seuil **70/100**)

| SCN | Titre | Difficulté | Package | Référence | Statut |
|-----|-------|------------|---------|-----------|--------|
| [SCN-015](scenarios/SCN-015/) | Cycle opérationnel intégré | moyen | `scenarios/` | — | Complet |
| [SCN-016](scenarios/SCN-016/) | Écarts et réajustement | difficile | `scenarios/` | — | Complet |
| [SCN-017](scenarios/SCN-017/) | Décision stratégique | difficile | `scenarios/` | — | Complet |

---

## Fichiers par package (×17)

| Fichier | Rôle instructeur |
|---------|------------------|
| `fiche-mission.md` | Briefing étudiant |
| `instructor-debrief.md` | Script + questions + signaux |
| `evidence-matrix.md` | Grille validation séance |
| `success-criteria.md` | Critères observables |
| `failure-conditions.md` | Anti-patterns |
| `student-expected-evidence.md` | Preuves attendues (étudiant) |
| `erp-wms-mapping.md` | Équivalents SAP/Odoo |
| `certification-mapping.md` | Parcours TEC.LOG |

---

## Documents transversaux

| Document | Usage |
|----------|-------|
| [01-dual-role-standard.md](./01-dual-role-standard.md) | Script ouverture double rôle |
| [03-evidence-matrix-master-template.md](./03-evidence-matrix-master-template.md) | Gabarit matrices |
| [04-gap-resolution-workbook.md](./04-gap-resolution-workbook.md) | Suivi écarts |
| [06-superviseur-runbook-addendum/SCN-009-adj-policy.md](./06-superviseur-runbook-addendum/SCN-009-adj-policy.md) | Politique ADJ M3 |

---

*TEC.WMS — Index instructeur B.3 · 17/17 SCNs · 136 fichiers*
