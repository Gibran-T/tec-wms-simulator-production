# Odoo EDU LAB — Recovery & Rollback Procedure
## TEC.LOG / TEC.WMS Production Baseline

**Document version:** 1.0  
**Stabilization date:** 2026-05-18  
**Author:** TEC.LOG Operations  
**Status:** GOLDEN STABLE STATE — Institutional Baseline

---

## 1. System Overview

| Component | Value |
|---|---|
| Platform | Odoo 19 EDU/Community (SaaS Trial) |
| Instance URL | https://edu-concorde-logistics-lab.odoo.com |
| Database | `edu-concorde-logistics-lab` |
| Channel ID | 1 |
| Channel name | TEC.LOG — Gestion intégrée des stocks et performance logistique |
| Admin login | gibranlog@gmail.com |
| Total slides | 42 |
| Modules | M1 (23 slides) · M2 (7 slides) · M3 (6 slides) · M4 (6 slides) · Certifications (2 slides) |
| PDF field | `document_binary_content` |
| Slide type (all) | `pdf` |

---

## 2. Validated Production URLs

### 2.1 Main Portal

| Link | URL |
|---|---|
| **Main portal (student entry)** | https://edu-concorde-logistics-lab.odoo.com/slides/teclog-gestion-integree-des-stocks-et-performance-logistique-1 |
| **Admin backend** | https://edu-concorde-logistics-lab.odoo.com/odoo/slides |
| **Channel admin** | https://edu-concorde-logistics-lab.odoo.com/odoo/slides/1 |
| **Login page** | https://edu-concorde-logistics-lab.odoo.com/web/login |

### 2.2 Module Overview Slides (Fullscreen / Projector Mode)

These are the recommended entry-point slides for classroom projection. Each URL includes `?fullscreen=1` for projector mode.

| Module | Slide ID | Sequence | Fullscreen URL |
|---|---|---|---|
| **M1** — Fondements de la chaîne logistique | 1 | 10 | https://edu-concorde-logistics-lab.odoo.com/slides/slide/m1-fondements-de-la-chaine-logistique-et-integration-erpwms-1?fullscreen=1 |
| **M2** — Exécution d'entrepôt et gestion des emplacements | 2 | 30 | https://edu-concorde-logistics-lab.odoo.com/slides/slide/m2-execution-dentrepot-et-gestion-des-emplacements-2?fullscreen=1 |
| **M2 Overview** (détaillé) | 11 | 31 | https://edu-concorde-logistics-lab.odoo.com/slides/slide/m2-vue-densemble-execution-dentrepot-et-gestion-des-emplacements-11?fullscreen=1 |
| **M3** — Contrôle des stocks et réapprovisionnement | 3 | 40 | https://edu-concorde-logistics-lab.odoo.com/slides/slide/m3-controle-des-stocks-et-reapprovisionnement-3?fullscreen=1 |
| **M3 Overview** (détaillé) | 12 | 41 | https://edu-concorde-logistics-lab.odoo.com/slides/slide/m3-vue-densemble-controle-des-stocks-et-reapprovisionnement-12?fullscreen=1 |
| **M4** — Indicateurs de performance logistique | 4 | 50 | https://edu-concorde-logistics-lab.odoo.com/slides/slide/m4-indicateurs-de-performance-logistique-4?fullscreen=1 |
| **M4 Overview** (détaillé) | 13 | 51 | https://edu-concorde-logistics-lab.odoo.com/slides/slide/m4-vue-densemble-indicateurs-de-performance-logistique-13?fullscreen=1 |
| **M5** — Simulation opérationnelle intégrée | 5 | 60 | https://edu-concorde-logistics-lab.odoo.com/slides/slide/m5-simulation-operationnelle-integree-5?fullscreen=1 |
| **M5 Overview** (détaillé) | 14 | 61 | https://edu-concorde-logistics-lab.odoo.com/slides/slide/m5-vue-densemble-simulation-operationnelle-integree-14?fullscreen=1 |

### 2.3 Certification Slides

| Certification | Slide ID | Sequence | URL |
|---|---|---|---|
| **M1 Fundamentals Certification** | 7 | 39 | https://edu-concorde-logistics-lab.odoo.com/slides/slide/teclog-fundamentals-certification-m1-7?fullscreen=1 |
| **M2–M5 Integrated ERP/WMS Certification** | 44 | 69 | https://edu-concorde-logistics-lab.odoo.com/slides/slide/teclog-integrated-erpwms-logistics-certification-m2m5-44?fullscreen=1 |

### 2.4 TEC.WMS Simulator

| Environment | URL |
|---|---|
| **Production (published)** | https://tecwmssim-nahgw8xk.manus.space |
| **Dev server** | https://3000-i97o0jcdy6yme5zngk9sa-f59f2c69.us1.manus.computer |
| **Last checkpoint** | `1d0691bd` (2026-05-18) |

---

## 3. Snapshot State (2026-05-18)

All 42 slides validated at stabilization date:

| Metric | Value |
|---|---|
| Total slides | 42/42 |
| `slide_type = 'pdf'` | 42/42 |
| `document_binary_content` attached | 42/42 |
| `image_1920` cover set | 42/42 |
| `is_published = True` | 42/42 |
| Fullscreen rendering validated | 42/42 |

**PDF source files:** `/home/ubuntu/slide_pdfs/slide_001.pdf` → `slide_044.pdf`  
**Cover images:** `/home/ubuntu/slide_covers/master_m1.png` → `master_cert.png`  
**Snapshot JSON:** `odoo_recovery_snapshot.json` (in project root)

---

## 4. Issue Detection

### 4.1 Symptom: Black page in fullscreen viewer

A black page in the Odoo fullscreen viewer (`?fullscreen=1`) indicates one or more of the following:

1. `document_binary_content` is NULL or empty for the affected slide.
2. `slide_type` is not `'pdf'` (e.g., was incorrectly set to `'document'` or `'article'`).
3. Browser cache is serving a stale empty response.

### 4.2 Diagnostic query (XML-RPC)

```python
import xmlrpc.client

URL = "https://edu-concorde-logistics-lab.odoo.com"
DB = "edu-concorde-logistics-lab"
uid = 2  # admin UID
PASSWORD = "16183026WM$"

models = xmlrpc.client.ServerProxy(f"{URL}/xmlrpc/2/object")

# Check a specific slide (replace SLIDE_ID)
result = models.execute_kw(DB, uid, PASSWORD, 'slide.slide', 'read',
    [[SLIDE_ID]],
    {'fields': ['id', 'name', 'slide_type', 'slide_category',
                'document_binary_content', 'image_1920', 'is_published']})
print(result)
```

**Healthy state:** `slide_type='pdf'`, `document_binary_content` is a non-empty base64 string, `is_published=True`.

---

## 5. Recovery Procedure

### Step 1 — Identify affected slides

Run the diagnostic query above for each affected slide ID, or run the full snapshot script:

```bash
python3 /home/ubuntu/odoo_recovery_snapshot.py
```

Slides with `has_pdf: false` in the output require PDF re-attachment.

### Step 2 — Restore PDF binary content

The source PDFs are stored at `/home/ubuntu/slide_pdfs/`. The naming convention is `slide_NNN.pdf` where NNN is the slide ID (zero-padded to 3 digits).

```python
import xmlrpc.client, base64

URL = "https://edu-concorde-logistics-lab.odoo.com"
DB = "edu-concorde-logistics-lab"
uid = 2
PASSWORD = "16183026WM$"

models = xmlrpc.client.ServerProxy(f"{URL}/xmlrpc/2/object")

SLIDE_ID = 28  # Replace with affected slide ID
PDF_PATH = f"/home/ubuntu/slide_pdfs/slide_{SLIDE_ID:03d}.pdf"

with open(PDF_PATH, 'rb') as f:
    pdf_b64 = base64.b64encode(f.read()).decode('utf-8')

models.execute_kw(DB, uid, PASSWORD, 'slide.slide', 'write',
    [[SLIDE_ID], {
        'document_binary_content': pdf_b64,
        'slide_type': 'pdf',
    }])
print(f"Slide {SLIDE_ID} restored.")
```

### Step 3 — Verify slide_type

Ensure `slide_type = 'pdf'` for all restored slides. If a slide shows `slide_type` other than `'pdf'`, correct it:

```python
models.execute_kw(DB, uid, PASSWORD, 'slide.slide', 'write',
    [[SLIDE_ID], {'slide_type': 'pdf'}])
```

### Step 4 — Refresh browser cache

After restoring PDFs, the browser may still serve a cached black page. Perform a **hard refresh**:

- **Windows/Linux:** `Ctrl + Shift + R`
- **macOS:** `Cmd + Shift + R`
- **Incognito mode:** Open the fullscreen URL in a new incognito/private window.

For classroom projector mode, always open the fullscreen URL directly in a fresh browser tab.

### Step 5 — Validate fullscreen rendering

Navigate to each module's fullscreen URL and confirm:

1. The slide renders a PDF page (not a black screen).
2. Navigation arrows (← →) are functional.
3. The PDF content matches the expected slide title.

Use the validation checklist in Section 6.

---

## 6. Fullscreen Validation Checklist

Perform this checklist after any recovery operation or before each classroom session.

| # | URL to test | Expected content | Status |
|---|---|---|---|
| 1 | `.../m1-fondements-de-la-chaine-logistique-et-integration-erpwms-1?fullscreen=1` | M1 title slide — chaîne logistique | ☐ |
| 2 | `.../m2-execution-dentrepot-et-gestion-des-emplacements-2?fullscreen=1` | M2 title slide — exécution d'entrepôt | ☐ |
| 3 | `.../m3-controle-des-stocks-et-reapprovisionnement-3?fullscreen=1` | M3 title slide — contrôle des stocks | ☐ |
| 4 | `.../m4-indicateurs-de-performance-logistique-4?fullscreen=1` | M4 title slide — KPI logistique | ☐ |
| 5 | `.../m5-simulation-operationnelle-integree-5?fullscreen=1` | M5 title slide — simulation intégrée | ☐ |
| 6 | `.../teclog-fundamentals-certification-m1-7?fullscreen=1` | M1 Fundamentals Certification | ☐ |
| 7 | `.../teclog-integrated-erpwms-logistics-certification-m2m5-44?fullscreen=1` | M2–M5 Integrated Certification | ☐ |

**Base URL prefix:** `https://edu-concorde-logistics-lab.odoo.com/slides/slide/`

---

## 7. Attachment Reference Map

The following table maps each slide ID to its source PDF file and cover image.

| Slide ID | Sequence | Module | PDF File | Cover Image |
|---|---|---|---|---|
| 1 | 10 | M1 | `slide_001.pdf` | `master_m1.png` |
| 2 | 30 | M2 | `slide_002.pdf` | `master_m2.png` |
| 3 | 40 | M3 | `slide_003.pdf` | `master_m3.png` |
| 4 | 50 | M4 | `slide_004.pdf` | `master_m4.png` |
| 5 | 60 | M5 | `slide_005.pdf` | `master_m5.png` |
| 6 | 11 | M1 | `slide_006.pdf` | `master_m1.png` |
| 7 | 39 | M1 | `slide_007.pdf` | `master_cert.png` |
| 8–27 | 12–29 | M1 | `slide_008.pdf` – `slide_027.pdf` | `master_m1.png` |
| 28–31 | 32–35 | M2 | `slide_028.pdf` – `slide_031.pdf` | `master_m2.png` |
| 32–36 | 42–46 | M3 | `slide_032.pdf` – `slide_036.pdf` | `master_m3.png` |
| 37–40 | 52–55 | M4 | `slide_037.pdf` – `slide_040.pdf` | `master_m4.png` |
| 41–43 | 62–64 | M5 | `slide_041.pdf` – `slide_043.pdf` | `master_m5.png` |
| 44 | 69 | Cert | `slide_044.pdf` | `master_cert.png` |

**Storage locations:**
- PDFs: `/home/ubuntu/slide_pdfs/`
- Covers: `/home/ubuntu/slide_covers/`

---

## 8. Critical XML-RPC Operations Applied (Stabilization Log)

The following operations were applied during the 2026-05-18 stabilization session:

| Operation | Scope | Script |
|---|---|---|
| Set `slide_type = 'pdf'` | All 42 slides | `odoo_fix_slide_types.py` |
| Attach `document_binary_content` | M2–M5 slides (IDs 28–44) | `odoo_attach_pdfs_v2.py` |
| Set `image_1920` cover images | All 42 slides | `odoo_attach_pdfs_v2.py` |
| Stock adjustments (Allées A/B/C) | Inventory locations | `odoo_stock_adjust.py` |
| KPI M4 data (5 receipts + 6 deliveries) | Inventory moves | Manual via Odoo UI |

---

## 9. Governance Rules

This document establishes the **golden stable state** for TEC.LOG / Odoo EDU LAB as of 2026-05-18. The following governance rules apply to all future changes:

1. **No architectural modifications** without explicit written authorization.
2. **All changes must be minimal, controlled, documented, and reversible.**
3. **Before any experiment or content modification**, create a new snapshot using `odoo_recovery_snapshot.py`.
4. **PDF source files** at `/home/ubuntu/slide_pdfs/` must be preserved as the authoritative restore source.
5. **TEC.WMS is the official scoring engine**; Odoo EDU LAB is the academic portal and ERP evidence layer.
6. **Two certifications only**: M1 Fundamentals + M2–M5 Final. No per-module M2/M3/M4 certifications.
7. **Fullscreen validation** must be performed before every classroom session.

---

## 10. Emergency Contacts & Resources

| Resource | Location |
|---|---|
| Recovery snapshot JSON | `/home/ubuntu/tec-wms-simulator-production/odoo_recovery_snapshot.json` |
| Snapshot generator script | `/home/ubuntu/odoo_recovery_snapshot.py` |
| PDF restore script | `/home/ubuntu/odoo_attach_pdfs_v2.py` |
| Slide type fix script | `/home/ubuntu/odoo_fix_slide_types.py` |
| Stock adjustment script | `/home/ubuntu/odoo_stock_adjust.py` |
| Teacher facilitation guide | `guide_facilitation_teclog.pdf` |
| Teacher guide addendum | `guide_facilitation_addendum.pdf` |
| Dataset matrix | `classroom_dataset_standard.pdf` |
| Exam snapshot procedure | `exam_snapshot_procedure.pdf` |
| TEC.WMS last checkpoint | `1d0691bd` |

---

*Document generated automatically from validated production state — 2026-05-18*
