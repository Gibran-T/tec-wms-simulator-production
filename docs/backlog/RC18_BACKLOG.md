# TEC.WMS — RC18 Multi-Instructor Architecture Backlog

**Document type:** Planning backlog (documentation only — no implementation)  
**Programme:** TEC.LOG — Collège de la Concorde  
**Baseline release:** RC17-C.1 — Institutional Admin Visibility Layer  
**Purpose:** Capture deferred architectural work for multiple operational professors and shared cohort visibility beyond the RC17-C.1 compatibility layer.  
**Mode:** Documentation only — **no code changes implied by this file**

---

## Context

RC17-B identified that Teacher Domain cohort visibility was tied to `cohorts.createdBy`. RC17-C.1 restores classroom operations for the institutional Administrator (`Administrator = Operational Professor`) via a minimal read-path rule: admins receive all cohorts from `cohorts.list`. Teachers continue to see cohorts where `createdBy = ctx.user.id`.

`createdBy` remains historical metadata. RC17-C.1 is intentionally **not** a multi-instructor design.

---

## RC18 — Multi-Instructor Architecture

**Priority:** HIGH (post–Summer 2026 classroom scale-up)  
**Status:** DEFERRED — no implementation in RC17-C.1  
**Source:** RC17-B forensic report, RC17-C.1 institutional decision

### Problem statement

When TEC.WMS adds a second operational professor (distinct from the institutional Administrator), the `createdBy` ownership model will again hide cohorts from instructors who did not create them. A durable institutional model is required before multi-instructor classroom deployment.

### Future scope (not in RC17-C.1)

| Capability | Description |
|------------|-------------|
| Multiple operational professors | More than one teacher account with full cohort operational access |
| Shared cohorts | Cohorts visible to assigned instructors, not only the creating user |
| Explicit instructor assignments | Junction or equivalent mapping (e.g. `cohort_instructors`) |
| Institutional visibility | Role- and assignment-aware cohort list without relying on `createdBy` |
| Admin operator model | Preserve RC17-C.1 rule: Administrator retains global Teacher Domain access |

### Explicitly out of scope for RC17-C.1 (do not implement early)

- `cohort_instructors` table  
- `teacher_assignments` table  
- `cohorts.isInstitutional` flag  
- Shared ownership via `createdBy` backfill  
- New foreign keys or schema migrations for instructor mapping  

### Acceptance criteria (when RC18 is scheduled)

1. Two or more teacher accounts can view and operate the same institutional cohort without sharing login credentials.  
2. `createdBy` remains audit metadata; visibility is driven by explicit assignment or institutional policy.  
3. Administrator account retains unrestricted Teacher Domain access (RC17-C.1 rule preserved).  
4. Student cohort isolation unchanged (`profiles.cohortId` enrollment model).  
5. Cohort switcher, Student Management, Analytics, Monitor, and Certifications work per assigned cohort for each instructor.  
6. Migration path documented for existing cohorts (Fondatrice, Été 2026 Groupe A/B) without data loss.

### Dependencies

- RC17-C.1 deployed and validated in production  
- Summer 2026 classroom execution feedback (Groupe A / Groupe B)  
- Institutional decision on instructor roster for 2026–2027  

### References

- RC17-B Teacher Domain forensic investigation  
- RC17-C / RC17-C.1 Institutional Admin Visibility Layer  
- [`docs/audits/COHORT_ISOLATION_PROFESSOR_DASHBOARD_AUDIT.md`](../audits/COHORT_ISOLATION_PROFESSOR_DASHBOARD_AUDIT.md)

---

*Planning artifact only. RC18 implementation requires separate institutional approval and release gate.*
