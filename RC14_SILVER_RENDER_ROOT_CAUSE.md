# RC14 Silver Render Root Cause Audit

**Date:** 2026-06-18  
**Mode:** READ ONLY — no code changes, no commit, no push, no deploy  
**Route under audit:** `/student/certifications/silver`  
**Production URL:** `https://tec-wms-simulator-production-production.up.railway.app`  
**Active Railway deploy:** `1352f181` @ commit `496272e` (client Silver UI from ancestor `748a907`)

---

## Executive Root Cause

There is **no legacy certificate component still bound to the route**. Production renders **`SilverCertificatePreview` → `SilverCertificateDocument`** (RC14 Wave 1, commit `748a907`), **not** the pre-RC14 inline portrait JSX.

The reported discrepancy is a **three-layer mismatch**:

| Layer | What it shows | Status |
|-------|---------------|--------|
| **Approved mockup** | Collège crest, dual signatures (Nadia + Thiago), dark institutional footer, ceremonial copy | Represented in `Documentation/silver-premium-certificate/after-rc14-landscape-premium.svg` and **uncommitted local files only** |
| **Implementation reports** | Claim full RC14 premium complete | Overstate vs deployed code — reports describe Wave 1 minimum, not full mockup |
| **Production bundle** | Landscape `SilverCertificateDocument`, 140px seal, completion + verification + single `SignaturePlaceholder` + QR | **Deployed** — but **missing** crest / dual signature / footer bar |
| **Working tree (local, uncommitted)** | Imports `CollegeCrest`, `DualSignatureBlock`, `InstitutionalCertificateFooter` | **Not committed, not deployed, not in production bundle** |

**Primary root cause:** Mockup-grade components (`CollegeCrest.tsx`, `DualSignatureBlock.tsx`, `InstitutionalCertificateFooter.tsx`) and their wiring in `SilverCertificateDocument.tsx` exist **only as untracked/uncommitted workspace changes**. They were never pushed or deployed. Stakeholders comparing live UI to the approved mockup perceive “old layout”; production is actually running the **partial** `748a907` implementation, not RC13 legacy.

**Secondary root cause:** The page is wrapped in **`FioriShell`** (shell bar, sidebar, breadcrumbs, action buttons), so the certificate reads as an in-app preview rather than a standalone institutional credential — reinforcing the “application screen” impression vs the mockup.

**Tertiary note:** If any observer still sees RC13 markers (`max-w-3xl`, centered 100px badge, « Directeur de programme »), that contradicts the live bundle fingerprint (see §8) and would indicate **stale browser cache** or **wrong environment** — not the current route wiring.

---

## 1. Full Render Chain

```
App.tsx (Router)
  └─ Route path="/student/certifications/silver"
       └─ SilverCertificatePreview          client/src/pages/student/SilverCertificatePreview.tsx
            └─ FioriShell                   client/src/components/FioriShell.tsx
                 └─ div.silver-certificate-page (max-w-[1100px])
                      ├─ [preview banner if eligible]
                      ├─ SilverCertificateDocument   client/src/components/certification/SilverCertificateDocument.tsx
                      │    ├─ SilverBadgeSvg (140px)
                      │    ├─ SilverStatusChip
                      │    ├─ CertificationCompletionBadge
                      │    ├─ VerificationIdBlock
                      │    ├─ SignaturePlaceholder   [DEPLOYED]
                      │    └─ QrPlaceholder
                      └─ Print / Back buttons
```

**Route registration:**

```84:84:client/src/App.tsx
      <Route path="/student/certifications/silver" component={SilverCertificatePreview} />
```

**Page → document handoff:**

```98:106:client/src/pages/student/SilverCertificatePreview.tsx
        <SilverCertificateDocument
          studentName={studentName}
          issueDate={issueDate}
          certificateId={certificateId}
          silverEarned={silverEarned}
          isPreviewOnly={isPreviewOnly}
          showCompletion={showCompletion}
          state={state}
        />
```

There is **no alternate Silver certificate page** and **no conditional branch** that renders the RC13 inline certificate block on this route when the student is eligible/earned.

---

## 2. Which Component Is Rendered in Production?

| Question | Answer |
|----------|--------|
| Route target | `SilverCertificatePreview` |
| Certificate body | `SilverCertificateDocument` |
| Legacy inline JSX in `SilverCertificatePreview`? | **Removed** in `748a907` — no longer in committed code |
| Separate legacy component file? | **None** connected to this route |

**Deployed child components (committed @ `748a907`):**

| Component | File | In production bundle? |
|-----------|------|----------------------|
| `SilverCertificateDocument` | `client/src/components/certification/SilverCertificateDocument.tsx` | ✅ YES |
| `CertificationCompletionBadge` | `client/src/components/certification/CertificationCompletionBadge.tsx` | ✅ YES |
| `VerificationIdBlock` | `client/src/components/certification/VerificationIdBlock.tsx` | ✅ YES |
| `SignaturePlaceholder` | `client/src/components/certification/SignaturePlaceholder.tsx` | ✅ YES |
| `QrPlaceholder` | `client/src/components/certification/QrPlaceholder.tsx` | ✅ YES |
| `SilverBadgeSvg` | `client/src/components/certification/SilverBadgeSvg.tsx` | ✅ YES |

---

## 3. Is `SilverCertificateDocument.tsx` Actually Used?

**Yes.** Both source and production bundle confirm it.

- `SilverCertificatePreview.tsx` imports and renders it (lines 10, 98–106).
- Production JS (`/assets/index-N-04kLoE.js`) contains: `silver-certificate-document`, `SilverCertificateDocument`, `max-w-[1100px]`, `Achèvement de la certification`, `Identifiant de vérification`, `verify.teclog.ca`, `Nadia Allami`.

Production does **not** contain RC13 string `Directeur de programme`.

---

## 4. Are `CollegeCrest.tsx`, `DualSignatureBlock.tsx`, `InstitutionalCertificateFooter.tsx` Imported and Rendered?

### In production (committed + deployed): **NO**

Committed `SilverCertificateDocument.tsx` @ `HEAD` imports only:

```1:7:client/src/components/certification/SilverCertificateDocument.tsx
import { useLanguage } from "@/contexts/LanguageContext";
import SilverBadgeSvg from "@/components/certification/SilverBadgeSvg";
import { SilverStatusChip, type SilverCertState } from "@/components/certification/CertificationStatus";
import CertificationCompletionBadge from "@/components/certification/CertificationCompletionBadge";
import VerificationIdBlock from "@/components/certification/VerificationIdBlock";
import SignaturePlaceholder from "@/components/certification/SignaturePlaceholder";
import QrPlaceholder from "@/components/certification/QrPlaceholder";
```

Footer row in deployed code:

```145:149:client/src/components/certification/SilverCertificateDocument.tsx
        {/* Signature + QR footer */}
        <div className="flex flex-col sm:flex-row items-end justify-between gap-6 pt-4 border-t border-slate-200 dark:border-slate-700 px-2 md:px-4">
          <SignaturePlaceholder />
          <QrPlaceholder />
        </div>
```

### In local working tree (uncommitted): **YES — but not shipped**

| File | Git status | Imported in committed doc? |
|------|------------|----------------------------|
| `client/src/components/certification/CollegeCrest.tsx` | `??` untracked | ❌ |
| `client/src/components/certification/DualSignatureBlock.tsx` | `??` untracked | ❌ |
| `client/src/components/certification/InstitutionalCertificateFooter.tsx` | `??` untracked | ❌ |
| `client/src/components/certification/SilverCertificateDocument.tsx` | `M` modified (uncommitted) | Local only — swaps `SignaturePlaceholder` → `DualSignatureBlock`, adds crest + footer |

**Production bundle probe (2026-06-18):**

| String | Present in `/assets/index-N-04kLoE.js`? |
|--------|------------------------------------------|
| `CollegeCrest` | ❌ False |
| `DualSignatureBlock` | ❌ False |
| `InstitutionalCertificateFooter` | ❌ False |
| `Thiago Gibran` | ❌ False |
| `Le présent document atteste` | ❌ False |
| `SignaturePlaceholder` | ✅ True |
| `Directeur de programme` | ❌ False (RC13 removed) |

---

## 5. Why Are Crest / Dual Signature / Footer Not Visible?

1. **Files never committed** — `git ls-files` tracks only `SignaturePlaceholder.tsx`; the three mockup components are untracked.
2. **`SilverCertificateDocument.tsx` modifications never committed** — `git diff 748a907 -- client/src/components/certification/SilverCertificateDocument.tsx` shows local-only imports/renders for crest, dual signature, footer, and ceremonial copy.
3. **Production build uses committed tree** — Railway deploy `496272e` rebuilt client from git; docs commit did not include certification TSX changes.
4. **Mockup SVG is documentation only** — `Documentation/silver-premium-certificate/after-rc14-landscape-premium.svg` illustrates target UI; it is not a runtime component.

---

## 6. Is a Legacy Certificate Component Still Connected?

**No.**

| Legacy artifact | Last seen | Removed by |
|-----------------|-----------|------------|
| Inline portrait certificate in `SilverCertificatePreview.tsx` (`max-w-3xl`, badge 100px centered, « Directeur de programme ») | Commit `eec9a9f` and earlier | `748a907` — extracted to `SilverCertificateDocument`, landscape container |
| `Directeur de programme` copy | RC13 inline footer | Replaced by `SignaturePlaceholder` (Nadia Allami) in `748a907` |

**Gold route is separate** — `GoldCertificatePreview.tsx` still uses `max-w-3xl` but is **not** mounted at `/student/certifications/silver`.

Navigation to Silver route from certifications hub:

```329:329:client/src/pages/student/CertificationsPage.tsx
                  <Button onClick={() => navigate("/student/certifications/silver")} className="bg-[#0f2a44] hover:bg-[#0f2a44]/90">
```

---

## 7. Exact File Paths

| Role | Path |
|------|------|
| Route | `client/src/App.tsx` |
| Page | `client/src/pages/student/SilverCertificatePreview.tsx` |
| Shell wrapper | `client/src/components/FioriShell.tsx` |
| Certificate document (deployed) | `client/src/components/certification/SilverCertificateDocument.tsx` |
| Completion badge | `client/src/components/certification/CertificationCompletionBadge.tsx` |
| Verification ID | `client/src/components/certification/VerificationIdBlock.tsx` |
| Single signature (deployed) | `client/src/components/certification/SignaturePlaceholder.tsx` |
| QR placeholder | `client/src/components/certification/QrPlaceholder.tsx` |
| Silver seal SVG | `client/src/components/certification/SilverBadgeSvg.tsx` |
| **Mockup-only (untracked)** | `client/src/components/certification/CollegeCrest.tsx` |
| **Mockup-only (untracked)** | `client/src/components/certification/DualSignatureBlock.tsx` |
| **Mockup-only (untracked)** | `client/src/components/certification/InstitutionalCertificateFooter.tsx` |
| Approved mockup asset | `Documentation/silver-premium-certificate/after-rc14-landscape-premium.svg` |
| Before reference | `Documentation/silver-premium-certificate/before-rc13-portrait.svg` |
| Implementation report (overclaims vs mockup) | `SILVER_PREMIUM_CERTIFICATE_REPORT.md` |
| Print CSS | `client/src/index.css` (`@page { size: A4 landscape }`) |
| Registry lookup (frozen) | `shared/silverCertificationRegistry.ts` |

---

## 8. Code Inspection Evidence (“Screenshots”)

### 8.1 RC13 legacy layout (removed — not in production)

From `eec9a9f` `SilverCertificatePreview.tsx` (historical):

```
max-w-3xl mx-auto
SilverBadgeSvg size={100}   ← centered, not header-right
Directeur de programme     ← generic signatory
Credential numérique · QR · à venir
```

### 8.2 Deployed RC14 layout (production @ `748a907`)

```
silver-certificate-page max-w-[1100px]
SilverCertificateDocument
  SilverBadgeSvg size={140}  ← top-right header
  CertificationCompletionBadge + VerificationIdBlock
  SignaturePlaceholder (Nadia Allami)
  QrPlaceholder (verify.teclog.ca)
```

### 8.3 Mockup target (local uncommitted only)

Working tree `SilverCertificateDocument.tsx` additionally renders:

```
CollegeCrest
DualSignatureBlock (Nadia Allami + Thiago Gibran)
InstitutionalCertificateFooter (navy bar)
Le présent document atteste que … ceremonial paragraph
```

### 8.4 Visual comparison assets

| Asset | Path |
|-------|------|
| Before (RC13 portrait wireframe) | `Documentation/silver-premium-certificate/before-rc13-portrait.svg` |
| After (approved mockup wireframe) | `Documentation/silver-premium-certificate/after-rc14-landscape-premium.svg` |
| Composite | `Documentation/silver-premium-certificate/silver-premium-before-after.png` |

The **mockup** includes crest, dual signature row, and footer bar. The **deployed** certificate stops at Wave 1 minimum (single signature, text-only institution header).

---

## 9. Report vs Reality Gap

`SILVER_PREMIUM_CERTIFICATE_REPORT.md` marks all deliverables ✅ Complete, listing only `SignaturePlaceholder.tsx` — consistent with **`748a907`**, not with the richer mockup or uncommitted crest/dual/footer work.

The report’s “After” column correctly describes removal of « Directeur de programme » but does **not** account for crest, dual signatory row, or institutional footer bar present in the approved mockup SVG.

---

## 10. Root Cause Summary (Single Statement)

**Production is not rendering RC13 legacy code; it renders the partial RC14 `SilverCertificateDocument` from `748a907`. The approved institutional mockup was never fully committed — mockup-grade components (`CollegeCrest`, `DualSignatureBlock`, `InstitutionalCertificateFooter`) and their wiring exist only as uncommitted local changes, so production cannot display them. The perceived “old layout” is the gap between mockup-complete design and Wave-1-minimum deployment, compounded by `FioriShell` application chrome.**

---

## 11. Verification Commands (reproducible)

```powershell
# Route + imports
git show HEAD:client/src/pages/student/SilverCertificatePreview.tsx | Select-String SilverCertificateDocument

# Deployed document imports (no crest/dual/footer)
git show HEAD:client/src/components/certification/SilverCertificateDocument.tsx | Select-String import

# Untracked mockup components
git status --short client/src/components/certification/

# Production bundle fingerprint
# (strings present/absent in /assets/index-N-04kLoE.js — see §4 table)
```

---

*Audit complete. No remediation applied per mission constraints.*
