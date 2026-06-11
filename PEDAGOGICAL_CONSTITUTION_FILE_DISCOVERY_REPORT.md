# Pedagogical Constitution — File Discovery Report

**Date:** 2026-06-10  
**Mode:** Read-only — no copies, moves, commits, or code changes  
**Search scope:** `C:\Projetos\tec-wms-simulator-production` (Git repo), adjacent folders under `C:\Projetos\`, and workspace-linked paths

---

## 1. Executive Finding

**One institutional PDF** matching the exact filename `TEC.WMS PEDAGOGICAL CONSTITUTION.pdf` was found.

It is **outside** the Git repository, in an audit-artifacts backup tree, already at the **canonical relative path** `Documentation/Pedagogical_Framework/` — but under a **different root directory** than the active repo.

The active repo **`tec-wms-simulator-production` does not contain this PDF** (only a Markdown mirror and hierarchy stubs reference it).

---

## 2. Exact Path Found

| Field | Value |
|-------|-------|
| **Full path** | `C:\Projetos\tec-wms-audit-artifacts-backup\Documentation\Pedagogical_Framework\TEC.WMS PEDAGOGICAL CONSTITUTION.pdf` |
| **Size** | **110 921 bytes** (~108 KB) |
| **Last modified** | 2026-06-10 22:03:49 (local) |
| **Format check** | Valid PDF header: `%PDF-1.7` |

---

## 3. Is It Inside the Git Repository?

**No.**

| Check | Result |
|-------|--------|
| Git root | `C:\Projetos\tec-wms-simulator-production` |
| PDF under git root? | **No** — `Documentation/Pedagogical_Framework/TEC.WMS PEDAGOGICAL CONSTITUTION.pdf` **missing** in repo |
| `git ls-files "*.pdf"` | Only `docs/Brochure_*.pdf` and `docs/*Plan_de_Cours*.pdf` / syllabus PDFs — **not** the Constitution |
| Markdown mirror in repo | `Documentation/Pedagogical_Framework/TEC_WMS_PEDAGOGICAL_CONSTITUTION.md` (different filename; not tracked as PDF) |

---

## 4. Is It Outside the Git Repository?

**Yes.**

| Item | Detail |
|------|--------|
| **Host folder** | `C:\Projetos\tec-wms-audit-artifacts-backup\` |
| **Git repo?** | **No** (`.git` not present) |
| **Nature** | Audit / pedagogical artifact backup adjacent to the main project |
| **Sibling folders also searched** | `C:\Projetos\wms-simulatorV2`, `C:\Projetos\_audit_tec_prod` — **no** file with this exact name |

---

## 5. Should It Be Copied or Moved Into the Repo?

**Recommended: COPY (do not move).**

| Option | Recommendation | Rationale |
|--------|----------------|-----------|
| **Copy** | **Yes — preferred** | Preserves the backup original; satisfies `Documentation/Pedagogical_Framework/` path already declared in repo `Documentation/README.md` and Constitution MD |
| **Move** | **No** | Would empty the backup tree’s canonical copy; backup folder appears to be intentional artifact store |

**Target path in active repo (when authorized):**

```text
C:\Projetos\tec-wms-simulator-production\Documentation\Pedagogical_Framework\TEC.WMS PEDAGOGICAL CONSTITUTION.pdf
```

**After copy:** Diff PDF against `TEC_WMS_PEDAGOGICAL_CONSTITUTION.md`; PDF wins on conflict (per Constitution preamble).

**Note:** This report records the recommendation only — **no copy or move was performed.**

---

## 6. Duplicate Versions

### 6.1 Exact filename `TEC.WMS PEDAGOGICAL CONSTITUTION.pdf`

| Location | Count |
|----------|-------|
| Under `C:\Projetos\` (recursive search) | **1** |
| Inside `tec-wms-simulator-production` | **0** |
| Inside `tec-wms-audit-artifacts-backup` | **1** |

**No duplicate PDFs** with the exact institutional filename were found.

### 6.2 Related (not duplicates)

| File | Location | Relationship |
|------|----------|--------------|
| `TEC_WMS_PEDAGOGICAL_CONSTITUTION.md` | `tec-wms-simulator-production\Documentation\Pedagogical_Framework\` | Markdown mirror — **not** a PDF duplicate |
| `PEDAGOGICAL_CONSTITUTION_INTEGRATION_REPORT.md` | Repo root | Integration audit — references expected PDF path |
| Other PDFs in repo `docs/` | Brochures, course syllabus (EN/FR) | **Unrelated** institutional docs |
| Rich `Pedagogical_Framework/` tree in backup | Mission sheets, guides, certification PDFs under backup | **Separate** artifacts; no second Constitution PDF in `Archives/` |

---

## 7. Search Log

| Area searched | Method | Constitution PDF? |
|---------------|--------|-------------------|
| `tec-wms-simulator-production` (recursive) | PowerShell + glob | **Not found** |
| `tec-wms-audit-artifacts-backup` (recursive) | PowerShell | **Found** (path above) |
| `wms-simulatorV2` | Filter `TEC.WMS PEDAGOGICAL CONSTITUTION.pdf` | **Not found** |
| `_audit_tec_prod` | Filter `*CONSTITUTION*` | **Not found** |
| Repo `Documentation/` | Direct listing | MD + README only; **no PDF** |
| Repo `docs/` | `git ls-files` | Other PDFs only |

---

## 8. Gap vs Documentation Hierarchy

The repo documentation hierarchy **already references** this PDF at:

`Documentation/Pedagogical_Framework/TEC.WMS PEDAGOGICAL CONSTITUTION.pdf`

The file **exists off-repo** at the same relative path under `tec-wms-audit-artifacts-backup`, but **not** under `tec-wms-simulator-production`. Until copied, the hierarchy link is **broken in the active Git working tree**.

---

## 9. Verdict

| Question | Answer |
|----------|--------|
| PDF located? | **Yes** — backup folder only |
| In Git repo? | **No** |
| Outside Git repo? | **Yes** |
| Copy or move? | **Copy** into repo target path when authorized |
| Duplicates? | **None** (exact filename) |

---

*Discovery complete. No files were copied, moved, or modified.*
