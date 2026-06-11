# TEC.WMS Pedagogical Constitution

**Programme:** TEC.LOG — Gestion intégrée des stocks et performance logistique  
**Institution:** Collège de la Concorde — Montréal  
**Application:** Mini-WMS Concorde (ERP/WMS pedagogical simulator)  
**Document type:** In-repository Markdown mirror  
**Institutional PDF:** [`TEC.WMS PEDAGOGICAL CONSTITUTION.pdf`](./TEC.WMS%20PEDAGOGICAL%20CONSTITUTION.pdf)

---

> **Authority.** This Markdown file restates the governing principles of the institutional PDF for version control and engineering workflows. **If this file and the PDF disagree, the PDF prevails** until the pedagogy owner reconciles both artifacts.

---

## Preamble

The Mini-WMS Concorde simulator exists to develop **operational reasoning** in warehouse and ERP workflows — not merely to train button clicks or to satisfy automated checks. Every scenario, rule, UI hint, and compliance gate must serve a documented learning objective drawn from the official Mission Sheets.

This Constitution binds curriculum owners, developers, reviewers, and agents working on the codebase.

---

## Article I — Purpose and scope

1. **Purpose.** Ensure that students reach the **intended operational reasoning and solution** described in the Mission Sheet for each scenario (SCN-001 through SCN-017).
2. **Scope.** All modules (M1–M5), Mission Control, cockpit pedagogy, rules engine, compliance steps, scoring display, teacher materials, and production behavior that affects student learning paths.
3. **Out of scope.** Infrastructure hosting, unrelated product features, and certification policy changes unless explicitly mandated by Collège de la Concorde programme leadership.

---

## Article II — Supremacy of sources (Gold Standard hierarchy)

When sources conflict, resolve in this **strict order**:

| Rank | Source | Role |
|------|--------|------|
| **1** | **This Constitution** (PDF) | Governing principles and non‑negotiables |
| **2** | **Student Mission Sheets PDF** (SCN-001 → SCN-017) | Scenario-specific operational truth |
| **3** | **Mission Control pedagogy** | Step objectives, Mission Sheet dialog, next-action guidance |
| **4** | **Cockpit pedagogy** | OIL hints: situation, evidence, action, compliance |
| **5** | **Compliance logic** | Step definitions and closing validators |
| **6** | **Runtime implementation** | API, forms, seed execution |
| **7** | **Automated tests** | Regression guard — **never** a substitute for Articles I and III |

Lower ranks **must not** override higher ranks without a **written disposition** from the pedagogy owner recorded in an audit or design document.

---

## Article III — Mission Sheet pedagogical chain

Every scenario must be designable and reviewable through this chain:

```text
Mission Sheet
  → Operational Context
  → Expected Reasoning
  → Expected Decision
  → Expected Solution
  → Compliance Outcome
```

**Rules:**

1. **Operational Context** — Quantities, bins, SKUs, and preloaded transactions must match the Mission Sheet unless the Sheet explicitly describes a deliberate simplification.
2. **Expected Reasoning** — The student must **observe → analyze → decide** as written; the UI must not auto-fill outcomes that replace reasoning (e.g. hidden answers from seed metadata the student should discover).
3. **Expected Decision** — Decisions documented on the Mission Sheet (which SKUs to count, whether to justify, replenishment quantities, etc.) are **mandatory learning outcomes**, not optional flavor text.
4. **Expected Solution** — The transaction sequence and numeric outcomes must match the Sheet’s solution path.
5. **Compliance Outcome** — The closing compliance step must **validate** the pedagogical outcome, not merely mark the run complete.

---

## Article IV — Scenario GREEN criteria

A scenario is **GREEN** (pedagogically aligned) only when **all** are true:

| ID | Criterion |
|----|-----------|
| **G1** | **Runtime behavior** matches the Mission Sheet (quantities, thresholds, steps, outcomes) |
| **G2** | **Student reasoning path** matches the Mission Sheet (observe → analyze → decide) |
| **G3** | **Mission Control guidance** matches the Mission Sheet (cockpit + sheet + step copy) |
| **G4** | **Compliance validates the expected solution** (closing step confirms pedagogical outcome) |
| **G5** | **No bypass** of the core learning objective (student cannot pass while skipping the skill) |

**YELLOW** — Runnable with partial fidelity; bypass or friction documented.  
**RED** — Core objective broken or unsafe to run in evaluation mode.

Implementation may not ship for evaluation scenarios that remain **RED** on G1 or G5 without pedagogy owner waiver.

---

## Article V — Implementation doctrine

1. **Tests are not the objective.** Passing automated tests is necessary but **insufficient**. Success is defined by Article I.
2. **Design before code** for pedagogical gaps. Record reconciliation in a design document; obtain disposition on P0/P1 mismatches before implementation.
3. **Seed and metadata are contracts.** Fields such as `cycleCountTargets`, `replenishmentParams`, and `adjustmentThreshold` in `initialStateJson` must be **enforced at runtime** when they express Mission Sheet requirements — not left as documentation-only decoration.
4. **Compliance is the finish line.** Module closing steps (e.g. `COMPLIANCE`, `COMPLIANCE_ADV`, `COMPLIANCE_M3`) must enforce outcome validation aligned with the Mission Sheet, not unconditional step markers.
5. **Grandfather policy.** When tightening gates, **do not retroactively invalidate** runs already marked `completed` unless programme leadership explicitly requires a reset.
6. **No silent pedagogical drift.** Copy changes in Mission Control, cockpit, or Mission Sheet proxies require the same hierarchy check as code changes.

---

## Article VI — Simulation modes

1. **Evaluation mode** — Scored, sequenced, compliance-gated. Must fully uphold Articles III–V.
2. **Demo mode** — Pedagogical exploration permitted; may relax scoring but **must not** teach incorrect operational logic relative to the Mission Sheet.
3. **Mode parity** — Rules that define “correct operation” should be consistent across modes unless Demo explicitly documents a deliberate simplification.

---

## Article VII — Certification boundaries

1. **Silver certification** is governed by **Module 1** programme rules (quiz + SCN-001→SCN-005 + compliance validation). Changes to M2–M5 must **not** alter Silver logic unless explicitly mandated.
2. **Gold / integrated certification** follows programme capstone rules (M5 and institutional pathway). Module scenario scores are **display and progression** signals unless programme leadership elevates them to cert gates.
3. Pedagogical fixes in M2–M5 **do not** automatically change certification eligibility without a separate programme decision.

---

## Article VIII — Bilingual and professional fidelity

1. All student-facing pedagogy must remain **bilingual (FR/EN)** at the same semantic level.
2. SAP / WMS transaction codes (ME21N, MIGO, MI01, etc.) are **pedagogical anchors** — labels may simplify but must not mis-teach the underlying operation.
3. Error and compliance messages must explain **why** an action fails in operational terms, not only that validation failed.

---

## Article IX — Change governance

| Change type | Required action |
|-------------|-----------------|
| Mission Sheet PDF update | Diff in-repo proxies; re-run alignment report; update runtime if needed |
| New compliance rule | Design note + tests + check G4/G5 |
| Production deploy | Confirm static/API layer; confirm no open P0 pedagogical RED items without waiver |
| Agent / AI implementation | Cite Constitution article; no commit without human review for pedagogy-impacting work |

**Prohibited without disposition:**

- Making tests pass by weakening Mission Sheet requirements  
- Deploying seed-only “fixes” that are not enforced at runtime  
- Treating teacher slide copy as authoritative over Mission Sheets when they conflict  

---

## Article X — Documentation and audit artifacts

1. Stabilization, alignment, implementation, and publication reports live at the repository root or under `Documentation/` and **reference this Constitution**.
2. Reports document evidence; they **do not** replace Articles II–V.
3. The documentation hierarchy is defined in [`../README.md`](../README.md).

---

## Article XI — Definitions

| Term | Definition |
|------|------------|
| **Mission Sheet** | Official scenario brief (PDF) plus in-repo extended mission data |
| **Mission Control** | Student cockpit: run state, next step, mission sheet access |
| **Cockpit pedagogy** | Scenario-specific OIL hints in `scenarioCockpitPedagogy.ts` |
| **Compliance step** | Final module validator before run completion |
| **Bypass** | Student completes run or step without performing the core skill the Sheet requires |
| **Disposition** | Written pedagogy-owner decision on a documented mismatch |

---

## Article XII — Amendment

1. Amendments to governing principles require update of the **institutional PDF** and this Markdown mirror in the same change window.
2. Engineering teams must be notified when Articles II, IV, or V change.
3. Version history is tracked via Git; PDF version numbers should be cited in commit messages when constitution changes drive code work.

---

**End of TEC.WMS Pedagogical Constitution (Markdown mirror).**

*Place the signed institutional PDF at:*  
`Documentation/Pedagogical_Framework/TEC.WMS PEDAGOGICAL CONSTITUTION.pdf`
