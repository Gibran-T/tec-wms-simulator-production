# Pedagogical Slide Audit — Module 3 (M3)

**Audit date:** 2026-07-01  
**RC16 preparation**  
**Source slides:** `client/src/data/modules.ts` (`module3.slides`, 7 slides)  
**Authority cross-reference:** `TECWMS_GUIDE_ENSEIGNANT_PDF_READY.md` §5.3, `TECWMS_GUIDE_ETUDIANT_M1_M3` §6, `GUIDE_MONITORING_COHORTE_TECWMS.md` (M3 validation queue), `server/missionDataExtended.ts`, `checkpointEngine.ts`, `docs/testing/RC15_1_STABILIZATION_REPORT.md`

---

## Module charter alignment

| Dimension | Target | Slide assessment |
|-----------|--------|------------------|
| Cycle count | CC_LIST → CC_COUNT → CC_RECON | **Covered** slide 4 |
| Min/Max / Replenishment | REPLENISH logic | **Covered** slides 2, 5 |
| Threshold | **≥ 70/100** | **Not stated on slides** |
| Teacher validation gate | **Mandatory before M4** | **MISSING — critical gap** |
| Scenario order | SCN-009 (CC) → 010 (variance) → 011 (replenish) | Slide concept order ≠ scenario order |

---

## Per-slide evaluation

### Slide 1 — Vue d'ensemble du contrôle d'inventaire
**Type:** process

**Score:** ★★★★ **Good**  
**Why:** Stocking dilemma (too much vs too little) frames module well. Introduces Min/Max, ROP, Safety Stock — appropriate executive summary.

---

### Slide 2 — Stratégie Min/Max/ROP — Graphique et calcul
**Type:** concept · **Formula:** ROP = (Demand × Lead Time) + SS

**Score:** ★★★★ **Good**  
**Why:** Core replenishment math correct. **Sequence issue:** taught before cycle count (slide 4) but SCN-009 is cycle count first — students may expect Min/Max before CC in simulator.

---

### Slide 3 — Safety Stock — Protection contre la variabilité
**Type:** concept · **Formula:** SS = Z × σ × √(LT)

**Score:** ★★★ **Acceptable**  
**Why:** Statistically rigorous — may exceed college-level comfort for some cohorts. Student guide SCN-011 uses min/max/safety operationally without requiring Z-score calculation. Risk of cognitive overload without calculator context.

---

### Slide 4 — Cycle Count et gestion de la variance
**Type:** process

**Score:** ★★★★★ **Excellent**  
**Why:** Count → Compare → Correct pipeline matches runtime M3 steps and institutional MI01 narrative. Variance < 2 % benchmark is realistic.

---

### Slide 5 — Décision de réapprovisionnement — Logique et critères
**Type:** concept

**Score:** ★★★★ **Good**  
**Why:** Cost/service trade-off framing prepares SCN-011 replenishment decision. Notes correctly state decision is not purely automatic.

---

### Slide 6 — Consolidation TEC.WMS — Réapprovisionnement
**Type:** exercise

**Score:** ★★★★ **Good**  
**Why:** RC16 alignment — Min/Max, ROP and REPLENISH demonstrated in Mission Control (SCN-011). Mirrors slide 2 concepts in the official simulator environment.

---

### Slide 7 — Application aux scénarios SCN-009 à SCN-011
**Type:** exercise · **SCN map:** 009–011

**Score:** ★★★★ **Good**  
**Why:** SCN labels **correct** (prior audit permutation fixed):
- SCN-009 = cycle count pipeline ✓
- SCN-010 = variance / ADJ ✓
- SCN-011 = Min/Max REPLENISH ✓

**Critical omissions:**
- No mention of **≥ 70/100** threshold
- No mention of **validation enseignant** gate (enseignant guide §5.3, student guide §6)
- No MI07 / adjustment justification emphasis for SCN-010

---

## Module summary

### Strengths
- Inventory control concepts comprehensively covered
- SCN-009–011 mapping aligned with mission sheets and student guide
- Variance and replenishment decision logic industry-realistic
- Professor notes usable for classroom narration

### Weaknesses
- **No teacher validation slide** — institutional gate invisible in deck
- **70/100 threshold** absent from all slides
- Concept order (Min/Max before CC) inverts recommended scenario order
- Safety Stock formula may be too academic for target cohort
- Module metadata says prerequisite "M2 ≥ 60" but M3 requires 70

### Missing concepts
- **Teacher validation workflow** (`validateTeacherModule`, M3 → M4 unlock)
- **Pipeline naming:** CC_LIST, CC_COUNT, CC_RECON, REPLENISH, COMPLIANCE_M3
- **Justification obligatoire** for SCN-010 variance (student guide)
- **Checkpoint engine** / `scenarioStatusJson` freshness (instructor awareness)
- **M3 capstone** framing for SCN-011

### Duplicated concepts
- Min/Max appears slides 1, 2, 5, 6 — some redundancy

### Concept order
**Recommended reorder for cohort alignment:**
1. Overview → 2. Cycle Count → 3. Variance → 4. Replenishment/Min-Max → 5. Safety Stock (simplified) → 6. Teacher validation gate → 7. Scenarios

### Estimated teaching effectiveness
**74 / 100 — Acceptable to Good**  
Content is strong; **missing teacher-validation pedagogy** reduces readiness for future cohorts. Enseignant guide Séance 6 depends on explicit validation instruction.

### Priority improvements (M3)
| Priority | Item |
|----------|------|
| **P0** | Add slide or expand slide 7: **validation enseignant obligatoire** + M4 gate |
| **P1** | State **seuil 70/100** on cover or scenario slide |
| **P1** | Reorder concepts to match SCN-009 → 010 → 011 |
| **P2** | Simplify Safety Stock slide (operational SS, defer Z×σ formula to appendix) |
| **P2** | Add SCN-010 justification / MI07 vocabulary |

---

## Module score

**Overall M3 slide quality: ★★★★ (3.9 / 5) — Good with critical gate gap**

*Pedagogical alignment audit historically rated M3 YELLOW — slide deck does not yet fully close that gap.*
