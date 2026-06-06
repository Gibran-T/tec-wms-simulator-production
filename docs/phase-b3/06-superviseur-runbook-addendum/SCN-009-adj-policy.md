# Annexe superviseur — Politique ADJ SCN-009 (G-C05)

**Gap ID:** G-C05  
**Statut:** **Closed** — décision institutionnelle adoptée  
**Date:** 2026-06-04  
**Scénario:** SCN-009 — M3 Inventaire cyclique simple  
**Décision:** Option B (refined)

---

## 1. Contexte

SCN-009 injecte un écart **−3 unités** sur SKU-001 (système 100, physique 97). SKU-003 est conforme (80 = 80). Le scénario introduit le pipeline M3 inventaire avant SCN-010 (écart significatif) et SCN-011 (réappro).

## 2. Politique institutionnelle adoptée

| Règle | Exigence |
|-------|----------|
| **CC_RECON** | **Obligatoire** — l'écart −3 doit être identifié et documenté |
| **Ajustement stock (MI07)** | **Obligatoire** — poster l'ajustement **−3** pour aligner le stock système sur le comptage physique |
| **Justification écrite** | **Optionnelle** lorsque \|écart\| < **5 unités** (seuil moteur `M3_VARIANCE_THRESHOLD`) |
| **SCN-010** | **Premier scénario** exigeant une **justification formelle** pour écart significatif (seuil pédagogique **20 unités**) |

## 3. Terminologie M3

En Module 3, il n'existe pas d'étape ADJ séparée. L'ajustement MI07 est exécuté **dans l'étape CC_RECON** (libellé : « Réconciliation & ajustement »). La politique « ADJ obligatoire » signifie : **poster l'ajustement −3 dans CC_RECON**.

## 4. Différenciation pédagogique M3

| SCN | Écart | Bloom | CC_RECON | Ajustement | Justification écrite |
|-----|-------|-------|----------|------------|----------------------|
| **009** | −3 | Appliquer | Obligatoire | Obligatoire | Optionnelle (< 5 u.) |
| **010** | −28 | Analyser | Obligatoire | Obligatoire | **Obligatoire** (> 20 u.) |
| **011** | Sous Min | Évaluer | Pipeline CC | Réappro calculé | ROP/EOQ évalués |

## 5. Grille instructeur (évaluation)

- [ ] CC_LIST et CC_COUNT complétés pour SKU-001 et SKU-003
- [ ] Écart −3 explicitement identifié
- [ ] CC_RECON documentée
- [ ] Ajustement −3 posté — stock système = 97 u.
- [ ] SKU-003 validé conforme
- [ ] COMPLIANCE_M3 verte
- [ ] Score ≥ 70/100

**Non requis pour SCN-009 :** justification écrite longue (écart < 5 u.).

## 6. Conditions d'échec (rappel)

- CC_RECON omise
- Ajustement −3 non posté (stock système reste à 100)
- COMPLIANCE_M3 avec variance non résolue

## 7. Références documentation

| Fichier | Rôle |
|---------|------|
| `scenarios/SCN-009/fiche-mission.md` | Fiche étudiant/instructeur |
| `scenarios/SCN-009/evidence-matrix.md` | Matrice preuves |
| `pilots/SCN-010/instructor-debrief.md` | Contraste justification formelle |
| `04-gap-resolution-workbook.md` § G-C05 | Registre gap — Closed |

## 8. Périmètre

**Documentation uniquement.** Cette politique ne modifie pas le moteur de simulation (`rulesEngine`, `scoringEngine`, seed). Option B (refined) est alignée avec le comportement moteur existant (seuil justification 5 u. ; résolution variance requise pour conformité).

---

*TEC.WMS — Annexe superviseur M3 · G-C05 Closed*
