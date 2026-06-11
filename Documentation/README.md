# TEC.WMS — Project Documentation Hierarchy

**Programme:** TEC.LOG — Collège de la Concorde  
**Application:** Mini-WMS Concorde (ERP/WMS pedagogical simulator)

This folder is the **institutional documentation root** for pedagogy, audits, and release governance. Application code lives outside `Documentation/`.

---

## 1. Supreme pedagogical authority

| Priority | Document | Path |
|----------|----------|------|
| **P0 — Constitution** | TEC.WMS Pedagogical Constitution (institutional PDF) | [`Pedagogical_Framework/TEC.WMS PEDAGOGICAL CONSTITUTION.pdf`](Pedagogical_Framework/TEC.WMS%20PEDAGOGICAL%20CONSTITUTION.pdf) |
| **P0 — In-repo mirror** | Markdown working copy (same governing principles) | [`Pedagogical_Framework/TEC_WMS_PEDAGOGICAL_CONSTITUTION.md`](Pedagogical_Framework/TEC_WMS_PEDAGOGICAL_CONSTITUTION.md) |

> **Note:** The PDF is the signed institutional source. The Markdown file exists for version control, diff, and agent/CI reference. If PDF and MD diverge, **the PDF wins** until pedagogy owners reconcile and update both.

---

## 2. Pedagogical source hierarchy (operational)

Used for scenario design, stabilization, and implementation reviews (see Constitution §3):

1. Student Mission Sheets PDF (SCN-001 → SCN-017)  
2. Mission Control pedagogy (`MissionControl.tsx`, step objectives)  
3. Cockpit pedagogy (`scenarioCockpitPedagogy.ts`)  
4. Compliance logic (`rulesEngine.ts`, module step definitions)  
5. Runtime implementation (tRPC routers, forms)  
6. Automated tests  

---

## 3. Module / scenario documentation

| Layer | In-repo location |
|-------|------------------|
| Mission Sheet body (extended) | `server/missionDataExtended.ts` |
| Mission Sheet UI | `client/src/components/MissionSheet.tsx` |
| Cockpit hints | `client/src/data/scenarioCockpitPedagogy.ts` |
| Teacher slides (class delivery) | `client/src/data/modules.ts` |
| Scenario seed contracts | `server/seed.ts` → `initialStateJson` |

Mission Sheet PDFs (per SCN) are **institutional** and may not be committed; extended mission data is the in-repo proxy until PDF diff is recorded.

---

## 4. Engineering & audit reports (repository root)

These reports implement Constitution review workflows but **do not override** the Constitution or Mission Sheets:

| Report | Purpose |
|--------|---------|
| `M2_STABILIZATION_REPORT.md` | M2 routing and scenario validation |
| `M3_STABILIZATION_AUDIT_REPORT.md` | M3 technical/pedagogical audit |
| `M3_PEDAGOGICAL_ALIGNMENT_REPORT.md` | M3 Mission Sheet alignment |
| `D-M3-01_IMPLEMENTATION_REPORT.md` | M3 variance threshold implementation |
| `D-M3-02_PEDAGOGICAL_DESIGN.md` | M3 Gold Standard reconciliation (design) |
| `D-M3-02_IMPLEMENTATION_REPORT.md` | M3 mission completion gates |
| `D-M3-02_PRE_COMMIT_RISK_REVIEW.md` | Pre-commit risk review |
| `FULL_DAY_COMMIT_PUSH_DEPLOY_AUDIT.md` | Publication audit |
| `P0_*_REPORT.md` | Production/static/API investigations |

---

## 5. Application entry points (non-pedagogical)

| Document | Role |
|----------|------|
| [`README.md`](../README.md) | Setup, architecture, deployment |
| [`LEGAL.md`](../LEGAL.md) | Legal notices |
| [`todo.md`](../todo.md) | Internal task tracking |

---

## 6. Maintenance rules

1. New pedagogical mandates → update **Constitution PDF** (institutional) and **`TEC_WMS_PEDAGOGICAL_CONSTITUTION.md`**.  
2. Scenario changes → diff against Mission Sheet PDF before merge.  
3. Audit reports → reference Constitution section numbers where applicable.  
4. Do not treat “tests pass” as pedagogical sign-off (Constitution §5).
