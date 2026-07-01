# RC15 — Semantic Scoring Implementation Plan

**Mission:** RC15 Semantic Scoring Preparation  
**Date:** 2026-06-18  
**Mode:** Planning only — **no code changes in RC15 prep**  
**Reference design:** `M4_M5_SEMANTIC_SCORING_DESIGN.md` (target architecture; not yet present in repo — this plan is derived from runtime code, RC13/RC14 audits, and canonical response corpora)  
**Authority chain:** `server/rulesEngine.ts` → `server/routers.ts` → `server/goldCertification.ts` → `shared/moduleThresholds.ts` → `module345.rules.test.ts`

---

## Executive Summary

Module 4 and Module 5 free-text validation is **keyword- and regex-based** today. Correct managerial reasoning expressed with non-canonical vocabulary can fail compliance (especially SCN-014) or score lower than intended, while keyword-stuffed answers can pass without demonstrating understanding.

RC15 introduces a **concept-based semantic layer** that evaluates student intent against pedagogical concept clusters, while **preserving every frozen invariant**: point budgets, pass thresholds, certification gates, compliance outcomes for canonical answers, and Gold/Silver eligibility logic.

**Recommended approach:** two-phase delivery with **keyword fallback as the safety net**, **shadow-mode parity testing** before cutover, and **env-flag rollback** mirroring existing `ENABLE_M4_COMPLIANCE_VALIDATOR` / `ENABLE_M5_COMPLIANCE_VALIDATOR` patterns.

| Phase | Goal | Production impact |
|-------|------|-------------------|
| **Phase 1** | Lexicon extraction, semantic adapter, shadow logging, expanded synonyms | None (keyword path remains authoritative) |
| **Phase 2** | Semantic-primary evaluation with keyword fallback | Evaluators accept paraphrase; canonical corpora still pass |

---

## 1. Existing Validator Inventory

### 1.1 In scope for semantic upgrade

| Function | File | Role | Text evaluated |
|----------|------|------|----------------|
| `scoreKpiInterpretation` | `server/rulesEngine.ts` | M4 **scoring** (+15/−5/0/20) | KPI_ROTATION, KPI_SERVICE, KPI_DIAGNOSTIC answers |
| `validateM4Compliance` | `server/rulesEngine.ts` | M4 **compliance gate** (blocks COMPLIANCE_M4) | All stored interpretations + diagnostic |
| `scoreM5StrategicDecision` | `server/rulesEngine.ts` | M5 **scoring + rejection** (SCN-017) | M5_DECISION free text |
| `scoreM5Decision` | `server/rulesEngine.ts` | M5 **scoring** (SCN-015/016 TACTICAL) | M5_DECISION free text |

**Router entry points:**

| Procedure | Validator invoked |
|-----------|-------------------|
| `m4.submitKpiRotation` | `scoreKpiInterpretation("rotationRate", …)` |
| `m4.submitKpiService` | `scoreKpiInterpretation("serviceLevel", …)` |
| `m4.submitKpiDiagnostic` | `scoreKpiInterpretation("diagnostic", …)` |
| `m4.submitComplianceM4` | `validateM4Compliance(…)` |
| `m5.submitDecision` | `scoreM5Decision` → `scoreM5StrategicDecision` when `decisionLevel === "STRATEGIC"` |
| `m5.submitComplianceM5` | `validateM5Compliance` (no free-text keywords — **unchanged**) |

**Certification consumers (must remain bit-identical on canonical runs):**

| Consumer | Uses |
|----------|------|
| `goldCertification.checkModuleComplianceForRun` | `validateM4Compliance`, `validateM5Compliance` |
| `computeModulePassResult` | Score ≥ threshold from `shared/moduleThresholds.ts` |
| Silver/Gold gates | Compliance + score; no direct keyword access |

### 1.2 Explicitly out of scope (deterministic — do not semanticize)

| Function | Reason |
|----------|--------|
| `calculateKpis`, KPI band thresholds | Numeric engine — frozen |
| `validateM5KpiSubmission`, `isCanonicalM5KpiPaste` | Ledger anchor ±5 % — numeric |
| `validateM5Reception`, `validateM5Putaway` | Contract-bound SKU/qty/bin |
| `validateM5Compliance`, `assertM5VarianceGate` | Step completion, inventory state |
| `validateM3Compliance`, M1/M2 zone validators | Operational compliance |
| `calculateTotalScore`, router `STEP_MAX_ALL` | Scoring economics display — frozen in RC15 |

---

## 2. Frozen Invariants (Non-Negotiable)

These **must not change** during RC15 semantic work:

### 2.1 Thresholds

| Constant | Value | Source |
|----------|-------|--------|
| Module scenario pass (M3–M5) | **70/100** | `shared/moduleThresholds.ts` → `getModuleScenarioPassThreshold` |
| Module scenario pass (M1–M2) | **60/100** | Same |
| Quiz pass | **60 %** | `QUIZ_PASS_THRESHOLD` |
| Gold capstone floor (SCN-017) | **70** | `GOLD_CAPSTONE_THRESHOLD` |
| M5 KPI ledger tolerance | **±5 %** | `validateM5KpiSubmission` |

### 2.2 Scoring economics (runtime authoritative)

**Module 4 — perfect-run ceiling 75/100** (see `RC14_M4_SCORING_FORENSIC_AUDIT.md`):

| Step | Points (correct path) | Penalty path |
|------|----------------------|--------------|
| KPI_DATA | +10 | — |
| KPI_ROTATION | +15 | −5 |
| KPI_SERVICE | +15 | −5 |
| KPI_DIAGNOSTIC | +20 | 0 |
| COMPLIANCE_M4 | +15 | −10 (fail) |

**Module 5 — SCN-017 strategic formula (unchanged):**

```
score = min(80, 30 + (kpiCitations × 10) + 15_tradeOff + 15_horizon + 10_if_length≥150)
rejected = true until ≥2 KPI citations + trade-off + recommendation + horizon
```

**Module 5 — SCN-015/016 tactical buckets:** rotation +10, service +10, errors +10, replenishment +15, corrective +15, completeness +20; cap **80**.

**Global clamp:** `calculateTotalScore` → `[0, 100]`.

### 2.3 Certification logic

- Gold module compliance re-runs `validateM4Compliance` / `validateM5Compliance` on latest completed run — semantic layer must not weaken gates for canonical happy paths or strengthen them unexpectedly for grandfathered passes.
- SCN-017: `decisionRejected === true` blocks compliance — semantic must preserve rejection codes (`OPERATIONAL_LEVEL`, `INSUFFICIENT_KPI_CITATIONS`, etc.).
- Env bypass flags remain: `ENABLE_M4_COMPLIANCE_VALIDATOR`, `ENABLE_M5_COMPLIANCE_VALIDATOR`.

---

## 3. Complete Keyword Map (Current Runtime)

Normalization today: `normM4Text` (lowercase + NFD strip diacritics) for compliance; `answer.toLowerCase().trim()` for scoring (no diacritic strip in `scoreKpiInterpretation` — **known inconsistency to fix in Phase 1 infra, not scoring outcomes**).

### 3.1 M4 — `scoreKpiInterpretation`

#### rotationRate (status → accept keywords)

| `rotationStatus` | Accept (substring) | Points |
|------------------|-------------------|--------|
| `surstock` | `surstock`, `sur-stock`, `excès` | +15 / −5 |
| `normal` | `normal`, `optimal`, `équilibr` | +15 / −5 |
| `sous-performance` | `sous`, `rupture`, `insuffisant` | +15 / −5 |

#### serviceLevel

| `serviceLevelStatus` | Accept | Points |
|----------------------|--------|--------|
| `excellent` | `excellent`, `très bon`, `optimal` | +15 / −5 |
| `acceptable` | `acceptable`, `moyen`, `correct` | +15 / −5 |
| `insuffisant` | `insuffisant`, `faible`, `problème`, `améliorer` | +15 / −5 |

#### errorRate (dead branch in current 5-step pipeline — preserve for future)

| `errorRateStatus` | Accept |
|-------------------|--------|
| `excellent` | `excellent`, `faible`, `bien` |
| `acceptable` | `acceptable`, `modéré`, `correct` |
| `critique` | `critique`, `élevé`, `problème`, `action` |

#### diagnostic (scoring rubric)

| Gate | Rule |
|------|------|
| Length | ≥ 50 chars |
| Vocabulary | `recommand`, `action`, `améliorer`, `stratégie`, `décision` |
| Points | +20 if pass; 0 if fail |

### 3.2 M4 — `validateM4Compliance`

#### Global gates (all SCN-012/013/014)

| Gate | Mechanism |
|------|-----------|
| Prerequisite steps | `KPI_DATA`, `KPI_ROTATION`, `KPI_SERVICE`, `KPI_DIAGNOSTIC` completed |
| Rotation row | Exists + `isCorrect` |
| Normal-band surstock block | If `rotationStatus === "normal"`: reject if answer contains `surstock`, `sur-stock`, `exces` |
| Service row | Exists + `isCorrect` |
| Diagnostic length | ≥ 50 chars |
| Diagnostic vocabulary | `recommand`, `action`, `strategie`, `decision` (via `m4HasTerm`) |

#### KPI domain counter (`countM4KpiDomains`)

| Domain | Term(s) |
|--------|---------|
| Rotation | `rotation` |
| Service | `service` |
| Errors | `erreur`, `error` |
| Lead time | `lead time`, `delai`, `3,5`, `3.5` |

#### SCN-012-specific (diagnostic)

| Concept | Accept terms | Reject pattern |
|---------|--------------|----------------|
| Maintain/monitor policy | `mainten`, `surveill`, `monitor`, `sku`, `politique` | — |
| Blanket destock trap | — | `destock`/`surstock`/`reduction massive` without `sku`/`reference`/`article` |
| Complacency | — | `rien a faire`/`aucune action`; or `excellent` without `surveill`/`monitor`/`mainten`/`action`/`recommand` |

#### SCN-013-specific

| Gate | Terms / rule |
|------|--------------|
| Service excellence ack | Service answer: `excellent`, `tres bon`, `optimal` |
| Error ↔ ops link | `erreur`/`error` AND (`picking`, `prélèvement`, `prelevement`, `reception`, `receiving`, `otif`) |
| Measurable plan | (`\d+ %`) OR (≥3 domains) AND (`90`, `hebdo`, `semaine`) |
| Destock primary trap | `destock`/`surstock` without execution terms (`picking`, `prelevement`, `reception`, `execution`, `qualite`, `formation`) |

#### SCN-014-specific

| Gate | Rule |
|------|------|
| Multi-KPI | ≥ 3 domains (`countM4KpiDomains`) |
| Trade-off | `report`, `differ`, `maintien`, `sacrifi`, `priori`, `trade-off`, `tradeoff`, `arbitrage` |
| Length | ≥ 150 chars |
| Lead time | If ≥3 domains: must mention `lead time`, `delai`, `3,5`, `3.5` |

### 3.3 M5 — `scoreM5StrategicDecision` (SCN-017)

#### Hard rejection — operational level (regex)

| Pattern | Code |
|---------|------|
| `poster la réception`, `continuer le rangement`, `m5_reception`, `migo.*réception`, `valider la réception`, `faire le putaway` | `OPERATIONAL_LEVEL` |

#### KPI citations (numeric — keep deterministic)

`countM5KpiNumericCitations` against snapshot: rotation, service %, error %, lead time, stock value (±8 % tolerance). **Not semanticized** — preserves evidence anchor.

#### Semantic-eligible gates

| Gate | Current regex / rule | Rejection code |
|------|---------------------|----------------|
| ≥2 KPI citations | Numeric | `INSUFFICIENT_KPI_CITATIONS` |
| Trade-off | `arbitr`, `trade.?off`, `compromis`, `au detriment`, `entre.*et`, `sacrif`, `vs` | `MISSING_TRADE_OFF` |
| Recommendation | `recommand`, `decid`, `orient`, `invest`, `politique`, `plan`, `initiative`, `objectif` | `MISSING_RECOMMENDATION` |
| Horizon | `90/180 j/jours/days`, `3/6 mois`, `trimestre`, `semestre` | `MISSING_HORIZON` |

### 3.4 M5 — `scoreM5Decision` (TACTICAL — SCN-015/016)

| Bucket | Keywords | Points |
|--------|----------|--------|
| Rotation | `rotation`, `turnover` | +10 |
| Service | `service`, `taux de service` | +10 |
| Errors | `erreur`, `error` | +10 |
| Replenishment | `réapprovisionnement`, `commander`, `stock` | +15 |
| Corrective | `formation`, `procédure`, `améliorer` | +15 |
| Completeness | length > 150 AND ≥4 buckets hit | +20 |
| Cap | — | min(score, 80) |

---

## 4. Concept-Based Equivalents

Replace substring checks with **concept clusters**. Each cluster maps to a pedagogical intent; evaluation returns `{ matched: boolean, confidence: number, matchedConcepts: string[] }`.

Recommended module layout (Phase 1):

```
shared/semanticScoring/
  concepts.m4.ts      # Concept definitions + exemplar phrases FR/EN
  concepts.m5.ts
  keywordFallback.ts  # Current logic extracted verbatim
  semanticAdapter.ts  # Interface + provider selection
  types.ts
```

### 4.1 M4 concept catalog

| Concept ID | Pedagogical intent | Example paraphrases (non-exhaustive) | Maps to current keyword gate |
|------------|-------------------|--------------------------------------|------------------------------|
| `M4.ROTATION.SURSTOCK` | Excess inventory / overstock situation | « stock excessif », « rotation trop faible », « capital immobilisé excessif » | rotationRate @ surstock |
| `M4.ROTATION.NORMAL` | Balanced turnover in normal band | « dans la plage cible », « équilibre consommation/stock », « 6× conforme à la politique » | rotationRate @ normal |
| `M4.ROTATION.UNDERPERFORM` | Stock-out / turnover too high | « rotation insuffisante », « risque de rupture », « sous-rotation » | rotationRate @ sous-performance |
| `M4.SERVICE.EXCELLENT` | OTIF at or above excellence threshold | « au sommet du SLA », « conforme au seuil 95 % », « performance OTIF forte » | serviceLevel @ excellent |
| `M4.SERVICE.ACCEPTABLE` | Meets minimum but not excellent | « niveau passable », « marge d'amélioration », « dans la bande acceptable » | serviceLevel @ acceptable |
| `M4.SERVICE.INSUFFICIENT` | Below target service | « OTIF insatisfaisant », « clients non servis », « sous le seuil contractuel » | serviceLevel @ insuffisant |
| `M4.DIAG.RECOMMENDATION` | Actionable managerial recommendation | « je propose », « plan d'action », « orienter la politique », « décision de prioriser » | diagnostic scoring + compliance vocab |
| `M4.COMPL.SURSTOCK_MISCLASS` | Wrongly labels normal rotation as overstock | (negative concept) | SCN-012 surstock block |
| `M4.COMPL.MAINTAIN_MONITOR` | SKU-level watch, no blanket destock | « revue par référence », « surveillance ciblée », « pilotage fin par SKU » | SCN-012 maintain policy |
| `M4.COMPL.ERROR_OTIF_LINK` | Links execution errors to OTIF risk | « erreurs de préparation menacent la livraison », « qualité picking impacte OTIF » | SCN-013 correlation |
| `M4.COMPL.MEASURABLE_PLAN` | Quantified target + time horizon | « réduire à 2 % d'ici T3 », « revue hebdomadaire », « objectif 90 jours » | SCN-013 plan |
| `M4.COMPL.EXECUTION_QUALITY` | Quality/training lever vs blind destock | « programme formation », « double contrôle picking », « amélioration processus réception » | SCN-013 destock trap guard |
| `M4.COMPL.TRADE_OFF` | Explicit multi-objective arbitration | « en contrepartie », « prioriser le service au détriment du stock », « arbitrage capital vs OTIF » | SCN-014 trade-off |
| `M4.COMPL.MULTI_KPI` | Integrates ≥3 KPI domains | (composite — domain detector) | SCN-014 ≥3 domains |
| `M4.COMPL.LEAD_TIME` | Acknowledges 3.5-day lead time lens | « délai moyen », « time-to-deliver », « 3,5 jours de cycle » | SCN-014 lead time |
| `M4.COMPL.COMPLACENCY` | (negative) No action despite green dashboard | « RAS », « rien à signaler » without follow-up | SCN-012 complacency |

**Status resolution rule (unchanged logic, new detection):**

```
expectedConcept = f(kpiResult.rotationStatus | serviceLevelStatus | errorRateStatus)
isCorrect = semanticMatch(studentAnswer, expectedConcept) OR keywordMatch(...)  // Phase 2
```

Points deltas remain **exactly** +15/−5/0/20 based on `isCorrect` boolean — semantic only changes how `isCorrect` is derived.

### 4.2 M5 concept catalog

| Concept ID | Intent | Maps to |
|------------|--------|---------|
| `M5.STRAT.OPERATIONAL` | (negative) WMS transaction-level answer | R1 rejection |
| `M5.STRAT.TRADE_OFF` | Balances competing KPI/cost objectives | trade-off gate |
| `M5.STRAT.RECOMMENDATION` | Executive decision with named initiative | recommendation gate |
| `M5.STRAT.HORIZON` | 90–180 day (or quarter/half) follow-up | horizon gate |
| `M5.TACT.ROTATION` | Mentions turnover interpretation | tactical +10 |
| `M5.TACT.SERVICE` | Mentions service level | tactical +10 |
| `M5.TACT.ERRORS` | Mentions error rate / quality | tactical +10 |
| `M5.TACT.REPLENISHMENT` | Stock/reorder policy action | tactical +15 |
| `M5.TACT.CORRECTIVE` | Training/procedure improvement | tactical +15 |
| `M5.TACT.COMPLETE` | Multi-domain justified analysis | tactical +20 bonus |

**SCN-017 KPI citations stay numeric** — semantic layer must not replace `countM5KpiNumericCitations`.

### 4.3 Semantic provider options (pick one in Phase 1 spike)

| Option | Pros | Cons | RC15 recommendation |
|--------|------|------|---------------------|
| **A — Embedding similarity** | Deterministic at threshold; offline exemplars; no runtime LLM cost | Needs curated exemplar matrix per concept | **Primary candidate** |
| **B — Lightweight classifier** (fine-tuned small model) | Fast inference | Training pipeline + bilingual data | Phase 2 optional |
| **C — LLM rubric call** | Best paraphrase tolerance | Latency, cost, non-determinism | Fallback only / teacher review mode |

**Adapter contract:**

```typescript
type SemanticEvalRequest = {
  text: string;
  locale: "fr" | "en";
  concepts: ConceptId[];
  context?: { kpiResult?: KpiResult; scnCode?: string };
};

type SemanticEvalResult = {
  matched: boolean;
  confidence: number;       // 0..1
  matchedConcepts: ConceptId[];
  provider: "embedding" | "keyword";
};
```

**Confidence policy (Phase 2):**

| Confidence | Action |
|------------|--------|
| ≥ 0.82 | Accept semantic match |
| 0.65 – 0.81 | Accept only if keyword also matches (AND) — conservative band |
| < 0.65 | Defer to keyword fallback |

Thresholds tuned in Phase 1 shadow logs to achieve **100 % pass on canonical corpora** with **0 false passes on rejected corpora** (SCN013 R1–R3, SCN017 R1–R3).

---

## 5. Fallback Strategy

### 5.1 Layered evaluation pipeline

```
Student text
    │
    ▼
┌─────────────────────┐
│ 1. Normalize text   │  normM4Text unified for scoring + compliance
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│ 2. Semantic eval    │  if ENABLE_SEMANTIC_SCORING !== "false"
│    (primary Phase 2)│
└─────────┬───────────┘
          │ confidence ≥ threshold?
          ├── YES → use semantic result
          │
          NO ▼
┌─────────────────────┐
│ 3. Keyword fallback │  current rulesEngine logic (verbatim)
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│ 4. Points / gates   │  unchanged economics
└─────────────────────┘
```

### 5.2 Failure modes

| Failure | Behavior |
|---------|----------|
| Semantic provider timeout / error | Log + keyword fallback (never block submit) |
| Ambiguous confidence band | Keyword fallback (student-friendly: no stricter than today) |
| Semantic accepts, keyword rejects | Phase 1 shadow: log divergence; Phase 2: semantic wins if confidence ≥ 0.82 AND regression tests pass |
| Semantic rejects, keyword accepts | **Keyword wins** unless instructor review flag — avoids regressions |

### 5.3 Environment flags (new)

| Variable | Default | Effect |
|----------|---------|--------|
| `ENABLE_SEMANTIC_SCORING` | `false` (Phase 1) → `true` (Phase 2 prod) | Master switch |
| `SEMANTIC_SCORING_MODE` | `shadow` → `primary` | Shadow logs only vs authoritative |
| `SEMANTIC_CONFIDENCE_THRESHOLD` | `0.82` | Tunable without deploy |
| `ENABLE_M4_COMPLIANCE_VALIDATOR` | `true` | Existing rollback |
| `ENABLE_M5_COMPLIANCE_VALIDATOR` | `true` | Existing rollback |

### 5.4 Rollback (instant)

1. Set `ENABLE_SEMANTIC_SCORING=false` → immediate revert to pure keyword (no redeploy if env-driven).
2. Set `SEMANTIC_SCORING_MODE=shadow` → semantic runs but keyword remains authoritative (Phase 1 default).
3. Existing compliance bypass flags unchanged for emergency instructor runs.

**No database migration required** — scoring events and interpretation rows store final `isCorrect` / `pointsDelta`; optional `evaluationMeta` JSON column is Phase 2 nice-to-have only.

---

## 6. Phase 1 — Infrastructure & Shadow Parity

**Duration estimate:** 1 sprint  
**Production risk:** None (keyword authoritative)

### 6.1 Deliverables

| # | Task | Output |
|---|------|--------|
| 1.1 | Extract all keyword lists → `shared/semanticScoring/lexicons.ts` | Single source; `rulesEngine` imports lexicons (behavior identical) |
| 1.2 | Unify text normalization (`normM4Text` everywhere scoring touches free text) | Eliminate é/è false negatives in `scoreKpiInterpretation` |
| 1.3 | Implement `SemanticAdapter` interface + embedding provider spike | `semanticAdapter.ts` |
| 1.4 | Build concept exemplar matrix from canonical corpora | `concepts.m4.ts`, `concepts.m5.ts` sourced from `SCN013–017_CANONICAL_RESPONSES.md` |
| 1.5 | Shadow hook in `scoreKpiInterpretation`, `validateM4Compliance`, `scoreM5StrategicDecision`, `scoreM5Decision` | Log `{ keywordResult, semanticResult, divergence }` when `SEMANTIC_SCORING_MODE=shadow` |
| 1.6 | Expand synonym lists (quick win, no ML) | FR/EN stems already partially done in RC13 — formalize as lexicon entries |
| 1.7 | Author `M4_M5_SEMANTIC_SCORING_DESIGN.md` in repo | Closes reference gap cited by RC15 |

### 6.2 Phase 1 exit criteria

- [ ] All existing `module345.rules.test.ts` tests pass unchanged
- [ ] Shadow logs on CI fixture runs show semantic ≥ keyword pass rate on canonical answers
- [ ] Zero change to live scoring events in production (`SEMANTIC_SCORING_MODE=shadow`)
- [ ] Lexicon inventory matches Section 3 of this document (automated snapshot test)

---

## 7. Phase 2 — Semantic Primary with Keyword Safety Net

**Duration estimate:** 1–2 sprints after Phase 1 sign-off  
**Production risk:** Medium — mitigated by fallback + flags

### 7.1 Deliverables

| # | Task | Notes |
|---|------|-------|
| 2.1 | Wire semantic-primary pipeline (Section 5.1) | `ENABLE_SEMANTIC_SCORING=true`, `MODE=primary` |
| 2.2 | Paraphrase acceptance tests | New corpus: 3–5 paraphrases per concept × 17 SCN gates |
| 2.3 | Negative corpus enforcement | Rejected answers in SCN013/017 canonical docs must still fail |
| 2.4 | Divergence alerting | Railway log metric: `semantic_keyword_divergence_rate` |
| 2.5 | Student feedback copy | When semantic accepts via paraphrase, feedback cites concept matched (no keyword leakage in eval) |
| 2.6 | Gold certification re-validation | Re-run `gold.certification.test.ts` + full module345 suite |
| 2.7 | Live smoke S-10 / S-11 extension | Manual paraphrase runs on Railway staging |

### 7.2 Phase 2 scope boundaries

**Do in Phase 2:**

- M4 interpretation scoring + compliance text gates
- M5 strategic/tactical decision text scoring

**Defer post-RC15:**

- UI `STEP_MAX_ALL` display mismatch (75 vs 85 display max — separate RC)
- M3 variance justification semantic (out of M4/M5 scope)
- Teacher override / manual regrade UI

### 7.3 Phase 2 exit criteria

- [ ] Canonical happy paths: 100 % pass (same as keyword)
- [ ] Rejected corpora: 100 % fail
- [ ] Paraphrase corpus: ≥ 90 % pass (target — tune confidence threshold)
- [ ] No regression: module pass rate on staging ≥ baseline ± 2 %
- [ ] Gold eligibility unchanged for fixture users in `gold.certification.test.ts`
- [ ] Rollback drill: `ENABLE_SEMANTIC_SCORING=false` restores keyword-only in < 5 min

---

## 8. Testing Strategy

### 8.1 Regression suite (must always pass)

| Suite | Guards |
|-------|--------|
| `module345.rules.test.ts` | M4/M5 unit behavior — extend, do not weaken |
| `server/gold.certification.test.ts` | Certification gates |
| `server/module345.rules.test.ts` | Server-side duplicate coverage |

**Golden rule:** Existing tests are the **keyword baseline**. Phase 2 adds new files; baseline tests remain green with semantic disabled.

### 8.2 New test layers

| Layer | File (proposed) | Content |
|-------|-----------------|---------|
| Lexicon snapshot | `semantic.lexicon.test.ts` | Hash of lexicons vs Section 3 |
| Canonical parity | `semantic.canonical.test.ts` | All `diag012/013/014`, SCN-017 strategic answer → same `allowed` / `pointsDelta` |
| Paraphrase acceptance | `semantic.paraphrase.test.ts` | Concept-aligned rewrites must pass in Phase 2 |
| Negative traps | `semantic.rejection.test.ts` | R1–R3 patterns must fail |
| Shadow divergence | `semantic.shadow.test.ts` | Mock adapter; assert logging shape |
| Bilingual | `semantic.bilingual.test.ts` | EN answers for FR-first concepts |

### 8.3 Scoring economics assertions

Explicit tests that **must not drift**:

```typescript
// M4 perfect SCN-012
expect(totalScore).toBe(75); // NOT 85, NOT 100

// M4 rotation wrong
expect(pointsDelta).toBe(-5);

// M5 SCN-017 full rubric
expect(score).toBeLessThanOrEqual(80);
expect(score).toBeGreaterThanOrEqual(50); // canonical strategic answer

// Pass threshold
expect(getModuleScenarioPassThreshold(4)).toBe(70);
```

### 8.4 Manual / staging validation

| Smoke | Action |
|-------|--------|
| S-10 extension | SCN-012/013/014: submit paraphrased answers on Railway staging |
| S-11 extension | SCN-015 tactical paraphrase; SCN-017 strategic paraphrase + rejection checks |
| Instructor demo | Demo mode: show semantic feedback labels without exposing exemplars |

### 8.5 Certification preservation checklist

Before production cutover:

- [ ] `validateM4Compliance` outcomes identical on `diag012`, `diag013`, `diag014`
- [ ] SCN-017 `scoreM5StrategicDecision` canonical answer: `rejected: false`, score ≥ 50
- [ ] SCN-017 generic answer: `rejected: true`
- [ ] `checkModuleComplianceForRun` returns same boolean for all Gold-path fixture runs
- [ ] `computeModulePassResult(4, 75) → passed: true` unchanged

---

## 9. Implementation Touch List (Future RC — Not RC15 Prep)

| File | Change |
|------|--------|
| `server/rulesEngine.ts` | Delegate to semantic adapter; shrink inline keyword arrays |
| `shared/semanticScoring/*` | **New** — concepts, lexicons, adapter |
| `server/routers.ts` | Pass `scnCode`, locale into eval context; optional shadow log field |
| `module345.rules.test.ts` | Paraphrase + parity tests |
| `.env.example` | Document new flags |
| `Documentation/M4_PEDAGOGICAL_INTELLIGENCE_AUDIT.md` | Post-RC15 addendum (optional) |

**Not touched:** `shared/moduleThresholds.ts`, `server/goldCertification.ts` gate structure, Silver registry, `scoringEngine.ts` clamp logic.

---

## 10. Risk Register

| ID | Risk | Mitigation |
|----|------|------------|
| R-01 | Semantic accepts keyword-stuffed nonsense | Require numeric KPI citations (M5) + minimum length gates unchanged; confidence threshold |
| R-02 | Semantic rejects valid bilingual EN answers | Bilingual exemplar matrix; EN stem lexicon fallback |
| R-03 | Gold certification drift | Canonical parity tests block merge |
| R-04 | Non-deterministic LLM scoring | Prefer embeddings; if LLM used, keyword fallback on low confidence |
| R-05 | Display max 20 vs award 15 confusion worsens | Out of scope RC15; note for UI RC |
| R-06 | `scoreKpiInterpretation` diacritic inconsistency | Phase 1 normalization fix before semantic |
| R-07 | Instructor emergency runs blocked | Retain `ENABLE_*_COMPLIANCE_VALIDATOR=false` bypass |

---

## 11. Success Metrics

| Metric | Baseline (keyword) | Phase 2 target |
|--------|-------------------|----------------|
| Canonical pass rate | 100 % | 100 % |
| Rejected-corpus fail rate | 100 % | 100 % |
| Paraphrase pass rate (curated) | ~40–60 % (estimated) | ≥ 90 % |
| False pass rate on rejection corpus | 0 % | 0 % |
| Student support tickets (M4/M5 vocab) | Baseline TBD | −30 % post-cutover |
| Semantic/keyword divergence (shadow) | N/A | < 5 % on staging before prod |

---

## 12. Document Index

| Artifact | Role |
|----------|------|
| `server/rulesEngine.ts` | Current keyword validators |
| `RC14_M4_SCORING_FORENSIC_AUDIT.md` | Scoring economics proof |
| `SCN013–017_CANONICAL_RESPONSES.md` | Acceptance/rejection corpora |
| `Documentation/PEDAGOGICAL_ALIGNMENT_AUDIT.md` | P4-01 semantic rationale |
| `Documentation/M4_PEDAGOGICAL_INTELLIGENCE_AUDIT.md` | M4 friction analysis |
| `Documentation/M5_PEDAGOGICAL_INTELLIGENCE_AUDIT.md` | M5 decision rubric context |
| `shared/moduleThresholds.ts` | Frozen thresholds |
| `module345.rules.test.ts` | Regression baseline |

---

*RC15 prep complete. No code changes. Next action: pedagogy + engineering sign-off on Phase 1 sprint, then author in-repo `M4_M5_SEMANTIC_SCORING_DESIGN.md` aligned with Section 4.*
