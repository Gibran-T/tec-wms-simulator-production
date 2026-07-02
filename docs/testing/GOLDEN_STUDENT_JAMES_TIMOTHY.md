# Golden Student — James Timothy

**Status:** Institutional reference account (RC16)  
**Environment:** Production — `https://tec-wms-simulator-production-production.up.railway.app`

---

## Purpose

James Timothy is the official institutional **demonstration account** for TEC.WMS. This account supports instructor demonstrations, QA, smoke testing, and operational validation across the full M1–M5 learning path and dashboard visibility.

James is the canonical account for repeatable smoke, regression, and classroom demonstrations — **not** for certification, checkpoint, or production grading validation.

---

## Identity

| Field | Value |
|-------|-------|
| **Name** | James Timothy |
| **Email** | `jamesnns3@gmail.com` |
| **Password** | `16183026` |
| **Student Number** | `16183026` |
| **User ID** | `222` |
| **Cohort** | Cohorte Fondatrice · Session 2025–2026 (`cohortId: 1`) |
| **Silver / Gold** | Not certified (by design) |

---

## Institutional policy (RC16)

### Approved uses

| Use case | Notes |
|----------|-------|
| **Institutional demonstration account** | Official teaching/demo student |
| **Instructor demonstrations** | Live classroom walkthroughs |
| **QA** | Exploratory testing, UX validation, route checks |
| **Smoke testing** | Login → profile → dashboard → scenario path |
| **Operational validation** | Post-deploy health checks |

### Prohibited uses

| Use case | Reason |
|----------|--------|
| **Certification validation** | Use founder credentials or governed test accounts |
| **Checkpoint validation** | Use cohort-specific accounts for gate testing |
| **Production grading** | Not a student for institutional scoring |
| **Automatic certification** | James must never receive Silver/Gold without explicit governance |

### Additional rules

- **Never use James to validate empty cohort isolation** — use Groupe A / Groupe B accounts.
- **Never move James between cohorts** without institutional sign-off.
- **Never delete James** — permanent institutional asset.
- **Never modify founder records** via James QA sessions.
- **Password policy:** equals student number (`16183026`) — rotate if used with external observers.

---

## Cohorte Fondatrice membership

James Timothy is a **permanent member** of the Cohorte Fondatrice alongside the four certified founders. Founding cohort rules apply: permanent access, preserved historical records, never reset, never migrate, never reuse for future cohorts.

---

## Post-run checklist

After any James session:

1. Confirm login and `studentNumber === 16183026`
2. Confirm `silverCertified === false` and `goldCertified === false`
3. Confirm founder cohort: 4/4 Silver, 4/4 Gold unchanged
4. Record run IDs and scores in the RC stabilization or release report

---

## Related artifacts

- Full-path QA runner: `.manus-logs/james-timothy-full-path-qa.mjs`
- RC15.1 stabilization report: `docs/testing/RC15_1_STABILIZATION_REPORT.md`
- Operational Playbook: `docs/operations/TEC_WMS_OPERATIONAL_PLAYBOOK_RC16.md`
- Institutional M4/M5 canonicals: `SCN012_SCN014_RUNTIME_SAFE_CANONICALS.md`
