# DOCUMENTATION-TO-SYSTEM TRACEABILITY — M4 / M5

**Date :** 2026-07-19  
**Canonical student doc :** `TECWMS_GUIDE_M4_M5.pdf` (juillet 2026, commit `f2dd2c4`)  
**Source éditoriale :** `TECWMS_GUIDE_ETUDIANT_M4_M5_PREPARATION_CERTIFICATION_PDF_READY.md`  
**Runtime :** `server/rulesEngine.ts` + `shared/pedagogicalConceptEval.ts`  
**Manifest :** `DOCUMENTATION_MANIFEST_M4_M5.md`

Légende cohérence : ✅ aligné · ⚠️ partiel · ❌ divergence matérielle · ◻ non vérifié smoke prod

---

## Questions de gouvernance (par concept)

Pour chaque ligne : (1) enseigné (2) plateforme (3) réponse possible (4) accepté (5) rejeté (6) rapport (7) cohérent ?

---

## A. Bandes & formules (Annexe A)

| Concept | Doc étudiant | Slide/glossaire/UI | Persisté | Validator | Scoring | Report | Cohérent |
|---------|--------------|--------------------|----------|-----------|---------|--------|----------|
| Rotation = conso ÷ stock moyen | Guide § Bandes | `calculateKpis` / KPI tower | n/a (calculé) | bande normal 4–12 | via status | snapshot | ✅ |
| Bande 4–12× | Guide | `m4KpiBandUtils` / Annexe A UI | status `normal` | CG_ROTATION_NORMAL | +/− KPI_ROTATION | feedback | ✅ |
| 6× = normal (pas surstock) | SCN-012 | alerts amber | answer text | anti OVERSTOCK | fail si surstock | issuesFr | ✅ |
| OTIF ≥ 95 % excellent | Guide | snapshot 95 % | answer | CG_SERVICE_EXCELLENT | KPI_SERVICE | ✅ |
| Erreurs 1–5 % acceptable | Guide | 4 % | answer | erreurs concepts SCN-013 | ✅ |
| Délai 3–7 j / 3,5 j | Guide | snapshot | texte libre | soft | ✅ |
| Capital 48 000 $ | Guide + mission | snapshot | optionnel | non obligatoire | ✅ |

---

## B. SCN-012 — Rotation & politique

| Chaîne | Enseigné | Plateforme | Élève peut | Accepté | Rejeté | Rapport | Cohérent |
|--------|----------|------------|------------|---------|--------|---------|----------|
| Classification rotation | « normale / équilibré » | free text KPI_ROTATION | texte | needs CG_ROTATION_NORMAL | nombre seul (« Rotation 6× ») ; surstock | isCorrect + feedback | ⚠️ nombre seul rejeté (conforme doc : doit classer) |
| Maintien politique | « maintiens / conserver » | free text diagnostic | texte | CG_MAINTAIN_POLICY | destock global | compliance | ❌ **« maintiens » échoue** (D1) |
| Suivi / surveillance | « surveille / contrôle / articles » | diagnostic | texte | CG_MONITOR_FOLLOWUP | « rien à faire » | compliance | ✅ |
| Recommandation | « avec vos propres mots » — pas mot magique | CG_ACTION_VOCAB + blocks | texte | exige souvent recommand/action/décision pour **points** | exemple B guide = 0 pts diag | pointsDelta | ❌ **D2** |
| Exemple guide A | littéral dans PDF | — | — | **FAIL compliance** aujourd’hui | — | — | ❌ |
| Exemple guide B | littéral dans PDF | — | — | compliance PASS / score diag FAIL | — | — | ❌ |
| Session 000658 | — | réponses QA | — | FAIL (correct) | surstock+liquidation | — | ✅ vs contrat |

**Décision :** corriger plateforme (D1/D2/D5), pas le guide juillet.

---

## C. SCN-013 — OTIF / erreurs

| Concept | Doc | UI | Accepté | Rejeté | Cohérent |
|---------|-----|-----|---------|--------|----------|
| OTIF excellent | Oui | free text | CG_SERVICE_EXCELLENT | faible/insuffisant | ✅ |
| Erreurs acceptables à améliorer | Oui | diagnostic | quality + improve | « 4 % excellent » | ✅ |
| Action qualité | formation/checklist/audit… | CG_QUALITY_ACTION | destock principal | ✅ |
| Horizon SLA / court terme | Oui | CG_SHORT_HORIZON | absent | ✅ |
| Cohérence analytique | raisonnement | `assessAnalyticalCoherence` | keyword list | ✅ vs « propres mots » |

---

## D. SCN-014 — S&OP

| Concept | Doc | Accepté | Rejeté | Cohérent |
|---------|-----|---------|--------|----------|
| Situation stable / preuves KPI | Oui | stable OU ≥2 domaines | mono-KPI | ✅ |
| Une priorité | Oui | CG_ONE_PRIORITY (+ prioriser) | liste souhaits | ✅ |
| Trade-off / compromis | Oui | CG_TRADEOFF | absent | ✅ |
| Horizon 90–180 | Oui | CG_HORIZON_90_180 | absent | ✅ |
| Longueur ≥150 (legacy) | Non (guide : 3–5 phrases) | concept path sans 150 | legacy shadow only | ✅ |

---

## E. SCN-015 / 016 / 017 — M5

| SCN | Enseigné | Accepté runtime | Rejeté | Cohérent |
|-----|----------|-----------------|--------|----------|
| 015 | Q=0 si stock ≥ min ; décision tactique | scoreM5Decision Q=0 | inventer réappro | ✅ tests |
| 016 | 50/45/−5 → corrigé 45 ; Min10 → Q=0 ; réconcilier d’abord | ADJ gate + decision | décider avant ADJ ; Q=Max−stock | ✅ tests |
| 017 | ≥2 KPI session + priorité + compromis + horizon | scoreM5StrategicDecision | paste M4 ; ops only | ✅ tests |
| Source données | session run | snapshot run | portefeuille M4 | ✅ contrat |

Smoke prod E2E : ◻ pending (HOLD jusqu’à GO).

---

## F. Persistence & recovery

| Élément | Doc/attente | Implémentation | Cohérent |
|---------|-------------|----------------|----------|
| Corriger une réponse | raisonnement itératif | INSERT append ; compliance `.find()` = **first** | ❌ D5 |
| Option IDs structurés | hotfix préfère codes | free text only | ⚠️ amélioration future |
| Score recalculé | oui | scoring_events additifs | ⚠️ pénalités compliance empilables |

---

## G. Rôles & BRIDGE

| Élément | Cadre programme | Guide juillet | UI | Cohérent |
|---------|-----------------|---------------|-----|----------|
| Analyste M4 | Competency_Framework | analyste stock / S&OP | Mission sheet | ✅ |
| Gestionnaire M5 | idem | décision tactique/stratégique | M5 panels | ✅ |
| BRIDGE acronyme | cadre | chaînes courtes | — | ✅ (équivalent fonctionnel) |
| Analyse et Décision | programme | Classifier→Décider | steps M4 | ✅ |

---

## H. Analytics layer (hotfix)

| Attendu hotfix | État actuel | Cohérent |
|----------------|-------------|----------|
| KPI cards (valeur, bande, status, delta) | tiles M4 partiels | ⚠️ |
| Trend / source table / lineage / guided reading | partiel / absent | ❌ à livrer |
| Même source que validator | CANONICAL_M4_KPI_DATA + scenario kpiData | ✅ base |

---

## I. GO gate traceability

Aucun scénario M4/M5 ne reçoit **GO** tant que :

1. D1 — conjugaisons « maintiens/maintient » acceptées  
2. D2 — exemples officiels guide scoring+compliance PASS  
3. D5 — latest interpretation wins  
4. Tests unitaires exemples guide + recovery  
5. Smoke prod SCN-012…017  
6. James READY FOR CLASS  

**État actuel chain :** **HOLD**
