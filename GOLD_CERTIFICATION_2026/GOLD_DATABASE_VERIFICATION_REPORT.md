# GOLD Database Verification Report — 2026 Cohort

**Date:** 18 juin 2026  
**Scope:** Public verification registry only (no PDF generation)  
**Baseline:** Silver verification system (`railwayVerificationRegistry.json` + `/verify/:certificateId`)

---

## Summary

Four **ACTIVE** Gold credentials were added to the institutional Railway verification registry, mirroring the existing Silver verification model. Each record resolves on the public verification portal with student name, student number, certificate ID, level **GOLD**, issue date **18 juin 2026**, and program **TEC.WMS**.

Silver verification records were preserved unchanged in behavior and remain fully functional.

---

## Registry Sources

| Layer | File | Purpose |
|-------|------|---------|
| Public verification | `shared/certification/railwayVerificationRegistry.json` | Source of truth for `/verify/:certificateId` |
| Lookup + enrichment | `shared/certification/railwayVerificationRegistry.ts` | Resolves IDs → full credential metadata + URLs |
| In-app Gold registry | `shared/goldCertificationRegistry.ts` | Static cohort mirror (same structure as Silver) |
| URL builders | `shared/certification/certificateUrls.ts` | Verification, PDF path, LinkedIn credential URLs |

---

## Gold Cohort Records

| Certificate ID | Student Name | Student Number | Level | Issue Date | Status |
|----------------|--------------|----------------|-------|------------|--------|
| `TECWMS-GOLD-2026-001` | Darlin Campaz Paredes | 002004 | GOLD | 2026-06-18 | ACTIVE |
| `TECWMS-GOLD-2026-002` | Fredy Tamile Lola | 1011-KF | GOLD | 2026-06-18 | ACTIVE |
| `TECWMS-GOLD-2026-003` | Prince Agbodjan Sewa Francis Ghislain | 613-462 | GOLD | 2026-06-18 | ACTIVE |
| `TECWMS-GOLD-2026-004` | Aissata Soukeina Camara | 2026-1806 | GOLD | 2026-06-18 | ACTIVE |

**Issued by:** Collège de la Concorde  
**Program:** TEC.WMS

---

## Public Verification URLs

Official Railway pattern:

| Certificate ID | Verification URL |
|----------------|------------------|
| TECWMS-GOLD-2026-001 | https://tec-wms-simulator-production-production.up.railway.app/verify/TECWMS-GOLD-2026-001 |
| TECWMS-GOLD-2026-002 | https://tec-wms-simulator-production-production.up.railway.app/verify/TECWMS-GOLD-2026-002 |
| TECWMS-GOLD-2026-003 | https://tec-wms-simulator-production-production.up.railway.app/verify/TECWMS-GOLD-2026-003 |
| TECWMS-GOLD-2026-004 | https://tec-wms-simulator-production-production.up.railway.app/verify/TECWMS-GOLD-2026-004 |

---

## LinkedIn Credential URLs

Each Gold record exposes a LinkedIn-compatible add-certification URL with:

- **name:** `TEC.WMS Gold Certification`
- **organizationName:** `Collège de la Concorde`
- **issueYear:** `2026`
- **issueMonth:** `6`
- **certId:** matching certificate ID
- **certUrl:** matching Railway verification URL above

Example (001):

```
https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=TEC.WMS+Gold+Certification&organizationName=Coll%C3%A8ge+de+la+Concorde&issueYear=2026&issueMonth=6&certId=TECWMS-GOLD-2026-001&certUrl=https%3A%2F%2Ftec-wms-simulator-production-production.up.railway.app%2Fverify%2FTECWMS-GOLD-2026-001
```

---

## Silver Regression Check

| Check | Result |
|-------|--------|
| Silver registry entries (4) | Unchanged IDs and student pairings |
| `/verify/TECWMS-SIL-2026-001` … `004` | Still resolve via `lookupVerifiedCredentialByCertificateId` |
| Silver PDF assets in `client/public/certificates/silver/2026/` | Still required by existing tests |
| Silver LinkedIn URL name | Still `TEC.WMS Silver Certification` |

---

## Out of Scope (Deferred)

- PDF generation for Gold certificates (`/certificates/gold/2026/*.pdf` paths are reserved only)
- Railway deployment (records are code-ready; live URLs activate after deploy)

---

## Validation Commands

```bash
npm test
npm run build
```

Automated coverage: `server/certification.verification.test.ts`, `shared/certification/certificateUrls.test.ts`.
