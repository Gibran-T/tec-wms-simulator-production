# Pedagogical Document Drift Audit

**Date:** 2026-06-10  
**Mode:** Read-only — no copy, move, commit, or deploy  
**Trees compared:**

| Label | Root path |
|-------|-----------|
| **REPO** | `C:\Projetos\tec-wms-simulator-production` |
| **BACKUP** | `C:\Projetos\tec-wms-audit-artifacts-backup` |

**Current Git branch (REPO):** `production-hotfix-rc13-pedagogy-class6` @ `b63b515`  
**Related Git branch (historical):** `phase2-m2-m5-audit` @ `4cbf119` (`docs: add pedagogical framework and scenario inventory`)

---

## 1. Executive Verdict

**Documentation drift is confirmed.** The user’s memory of pedagogical files under  
`tec-wms-simulator-production\Documentation\Pedagogical_Framework` is **plausible** but **not reflected in the current working tree** on the active branch.

| Finding | Conclusion |
|---------|------------|
| Authoritative set | **Split across two locations** — neither tree alone is complete |
| Documents “moved” | **Partial relocation / branch isolation**, not a single clean move. Work was migrated toward repo paths but **consolidated in BACKUP**; production branch never received the full set |
| Repo incomplete | **Yes** — current REPO has **3** Documentation files (stubs only); **0** institutional PDFs under `Pedagogical_Framework/` |
| Backup newer | **Yes** for Guide Enseignant Maître (MD tree) and Constitution PDF; **No** for Certification PDFs and Méthode PDF (those exist only on `phase2-m2-m5-audit`) |

---

## 2. Why the User May Have Seen Files in the Repo Path

Three evidence-backed explanations (not mutually exclusive):

1. **Branch checkout (`phase2-m2-m5-audit`)** — Commit `4cbf119` tracks **7 pedagogical assets** under `Documentation/Pedagogical_Framework/` including Fiches and four Certification PDFs. Checking out that branch would populate the repo path on disk. The current branch **`production-hotfix-rc13-pedagogy-class6` does not contain commit `4cbf119`** (`merge-base --is-ancestor` → false).

2. **Same relative path in BACKUP** — BACKUP mirrors the intended repo layout (`Documentation/Pedagogical_Framework/...`). Opening either root in the IDE can look identical in the file tree.

3. **Today’s stub overlay (2026-06-10 ~22:07)** — Untracked `Documentation/` on the production branch was created with README + Constitution MD only. It **does not** prove prior full content existed on this branch; it **does** explain why the path exists but is nearly empty now.

---

## 3. Tree-Wide Inventory Summary

| Metric | REPO | BACKUP |
|--------|------|--------|
| `Documentation/` file count | **3** | **226** |
| PDFs under `Documentation/Pedagogical_Framework/` | **0** | **2** |
| PNG/JPG under `Pedagogical_Framework/` | **0** | **2** |
| Guide Enseignant Maître (MD tree) | **0** | **200** MD files + migration tooling |
| Git tracked `Documentation/` on current branch | **No** (`?? Documentation/`) | N/A (not a git repo) |
| Git tracked `Documentation/` on `phase2-m2-m5-audit` | **8** files (see §6) | — |

**REPO PDFs elsewhere (not Pedagogical_Framework):** 4 marketing/syllabus PDFs under `docs/` (brochures, course plans) — unrelated to institutional pedagogical set.

**BACKUP PDFs elsewhere:** 2 supervisor/instructor quick-reference PDFs under `backup/docs/`.

---

## 4. Side-by-Side Comparison — Institutional Documents

### 4.1 Pedagogical Constitution

| Field | REPO | BACKUP | Git `4cbf119` (phase2) |
|-------|------|--------|------------------------|
| **File name** | — | `TEC.WMS PEDAGOGICAL CONSTITUTION.pdf` | — (not in commit) |
| **Path** | *Absent* | `Documentation/Pedagogical_Framework/TEC.WMS PEDAGOGICAL CONSTITUTION.pdf` | — |
| **Size** | — | **110,921 bytes** | — |
| **Last modified** | — | **2026-06-10 22:03:49** | — |
| **Related MD mirror** | `TEC_WMS_PEDAGOGICAL_CONSTITUTION.md` — 9,830 B — 2026-06-10 22:08:21 | Absent | Absent |

### 4.2 Fiches de Mission (student mission sheets)

| Field | REPO (working tree) | BACKUP | Git `4cbf119` (phase2) |
|-------|---------------------|--------|------------------------|
| **File name** | — | `FICHES_DE_MISSION_ETUDIANT_TECLOG_SCN001_SCN017_V1.pdf` | Same filename |
| **Path** | *Absent* | `…/FICHES_DE_MISSION_ETUDIANT_TECLOG_SCN001_SCN017_V1/FICHES_DE_MISSION_ETUDIANT_TECLOG_SCN001_SCN017_V1.pdf` | `…/03_Fiches_De_Mission_Etudiant/FICHES_DE_MISSION_ETUDIANT_TECLOG_SCN001_SCN017_V1.pdf` |
| **Size** | — | **103,071 bytes** | **103,071 bytes** |
| **Last modified** | — | **2026-06-04 12:33:56** | (committed 2026-06-04 era) |
| **Content identity** | — | Git blob `a0d6e81f…` | **Identical** (`git hash-object` on BACKUP file = blob in `4cbf119`) |

**Folder-name drift:** `03_Fiches_De_Mission_Etudiant/` (git) → `FICHES_DE_MISSION_ETUDIANT_TECLOG_SCN001_SCN017_V1/` (backup).

### 4.3 Guide Enseignant Maître

| Field | REPO | BACKUP | Git `4cbf119` (phase2) |
|-------|------|--------|------------------------|
| **Form** | — | **Markdown master tree** `01_Guide_Enseignant_Maitre/GUIDE_MAITRE_TECLOG_RC15_MASTER/` | Single annex `.pdf.txt` only |
| **Path** | *Absent* | 200 `.md` files under GUIDE_MAITRE tree | `…/01_Guide_Enseignant_Maitre/Annexes/ANNEXE_COMPETENCY_MATRIX_AND_M3_VALIDATION_TECLOG_BRIDGE.pdf.txt` |
| **Size (representative)** | — | Tree total **222** files under `01_Guide_Enseignant_Maitre/` | Annex: **6,713 bytes** |
| **Last modified (range)** | — | **2026-06-08 22:32:22** → **2026-06-10 18:22:35** (newest: `A-m4-kpi-instructor-annex.md`) | 2026-06-04 assembly era |
| **PDF master guide** | — | **None** (MD-only RC15 master) | **None** |

Migration metadata in BACKUP (`_migration/migration-summary.json`) lists **destination paths under `c:/Projetos/tec-wms-simulator-production/Documentation/Pedagogical_Framework/...`** — but those files exist in BACKUP, not in the REPO working tree.

### 4.4 Certification Guide / Assessment

| Field | REPO | BACKUP | Git `4cbf119` (phase2) |
|-------|------|--------|------------------------|
| **Certification PDFs** | *Absent* | *Absent* | **4 PDFs present** (see §4.5) |
| **WMS_CERTIFICATION.png** | *Absent* | `04_Certification_And_Assessment_Guide/WMS_CERTIFICATION.png` — **2,464,700 B** — **2026-06-06 21:34:31** | Absent |

**Drift:** Phase-2 git retained **PDF certification pack**; BACKUP replaced/supplemented with a **PNG** asset only. Neither is in the current REPO working tree.

### 4.5 All PDFs under `Pedagogical_Framework/` (complete list)

| Document | REPO path | REPO size / date | BACKUP path | BACKUP size / date | Git `4cbf119` size |
|----------|-----------|------------------|-------------|--------------------|--------------------|
| Pedagogical Constitution | — | — | `Pedagogical_Framework/TEC.WMS PEDAGOGICAL CONSTITUTION.pdf` | 110,921 B · 2026-06-10 22:03 | — |
| Fiches de Mission | — | — | `…/FICHES_DE_MISSION_…/FICHES_DE_MISSION_….pdf` | 103,071 B · 2026-06-04 12:33 | 103,071 B ✓ |
| Méthode TEC.LOG BRIDGE | — | — | — | — | 292,653 B |
| Guide Officiel de Certification et d'Évaluation | — | — | — | — | 44,011 B |
| Guide de Certification TEC.LOG BRIDGE | — | — | — | — | 36,919 B |
| Matrice Officielle de Pondération | — | — | — | — | 41,975 B |
| Matrice de Compétences | — | — | — | — | 36,825 B |

### 4.6 Other binary assets under `Pedagogical_Framework/`

| File | REPO | BACKUP |
|------|------|--------|
| `Archives/college-logo.jpg` | Absent | 2,964 B · 2026-06-03 09:59:03 |
| `04_Certification_…/WMS_CERTIFICATION.png` | Absent | 2,464,700 B · 2026-06-06 21:34:31 |

### 4.7 REPO-only files (not in BACKUP)

| File | Path | Size | Last modified |
|------|------|------|---------------|
| Documentation root index | `Documentation/README.md` | 3,680 B | 2026-06-10 22:07:50 |
| Framework README | `Documentation/Pedagogical_Framework/README.md` | 550 B | 2026-06-10 22:07:52 |
| Constitution MD mirror | `Documentation/Pedagogical_Framework/TEC_WMS_PEDAGOGICAL_CONSTITUTION.md` | 9,830 B | 2026-06-10 22:08:21 |

These three files are **untracked** on the current branch and were **not** part of `4cbf119`.

---

## 5. Git State Analysis (REPO)

```
git status --short Documentation/
?? Documentation/
```

| Check | Result |
|-------|--------|
| `git ls-files Documentation/` on current branch | **Empty** |
| `git log production-hotfix-rc13-pedagogy-class6 -- Documentation/` | **No commits** |
| Pedagogical PDFs ever on current branch | **No** |
| Pedagogical PDFs on `phase2-m2-m5-audit` @ `4cbf119` | **Yes** — 6 PDFs + 1 annex txt + scenario inventory MD |

**Implication:** The institutional PDF pack was **committed on a side branch**, not merged into the production hotfix line. The current `Documentation/` folder is a **new, untracked stub** that references PDFs that are not on disk.

---

## 6. Authoritative Set Determination

| Document class | Authoritative location | Rationale |
|----------------|------------------------|-----------|
| **Pedagogical Constitution (PDF)** | **BACKUP** | Only physical copy found; newest (2026-06-10); REPO has MD mirror only |
| **Fiches de Mission (PDF)** | **BACKUP or git `4cbf119`** | Byte-identical (`a0d6e81f…`); BACKUP uses renamed folder |
| **Guide Enseignant Maître** | **BACKUP** (MD master) | 200-file RC15 tree; actively updated through 2026-06-10; far beyond phase2 annex |
| **Certification PDFs (4 files)** | **Git `4cbf119` only** | Missing from BACKUP and REPO working tree |
| **Méthode TEC.LOG BRIDGE PDF** | **Git `4cbf119` only** | Missing from BACKUP and REPO working tree |
| **WMS_CERTIFICATION.png** | **BACKUP only** | Not in git phase2 commit |
| **Documentation hierarchy (README index)** | **REPO** (stub) | Declares paths; **links are broken** until assets are restored |

**No single folder holds the full authoritative set today.**

---

## 7. Were Documents Moved?

| Evidence | Interpretation |
|----------|----------------|
| `migration-summary.json` dest = `tec-wms-simulator-production/Documentation/…` | Migration **intended** repo as canonical destination |
| Files present in BACKUP at mirrored paths, absent in REPO | Work product **landed in audit backup**, not committed to production branch |
| Fiches PDF hash match git → backup | **Copy** from phase2 git content into backup (folder renamed), not a content rewrite |
| Constitution PDF only in backup (2026-06-10) | **Added after** phase2 commit; never entered git |
| Certification PDFs in git, absent from backup | **Reverse drift** — backup is **older/incomplete** vs phase2 for cert PDFs |
| REPO `Documentation/` created 2026-06-10 ~22:07 | New hierarchy stub; **does not** contain migrated assets |

**Conclusion:** Documents were **not** cleanly moved from repo to backup depleting the repo. Instead:

1. Phase2 branch **committed** a PDF subset to git.  
2. Audit/migration work **expanded** the Guide in BACKUP and **added** Constitution + cert PNG.  
3. Production hotfix branch **never merged** phase2 documentation.  
4. A **new stub** `Documentation/` was added locally today without the PDFs.

This matches **branch isolation + audit-side consolidation**, not a single-file move operation.

---

## 8. Is Repo Documentation Incomplete?

**Yes — critically incomplete.**

| Expected per `Documentation/README.md` | Present in REPO working tree |
|----------------------------------------|------------------------------|
| Constitution PDF | **Missing** |
| Fiches PDF (Mission Sheets SCN-001→017) | **Missing** |
| Guide Enseignant Maître | **Missing** |
| Certification materials | **Missing** |
| Constitution MD mirror | **Present** (untracked) |
| Hierarchy README | **Present** (untracked) |

Broken links: `Documentation/README.md` and `Pedagogical_Framework/README.md` reference `TEC.WMS PEDAGOGICAL CONSTITUTION.pdf` at a path where **no PDF exists**.

---

## 9. Is Backup Documentation Newer?

| Asset | BACKUP vs git `4cbf119` | BACKUP vs REPO working tree |
|-------|---------------------------|-----------------------------|
| Constitution PDF | **Newer** (asset did not exist in git) | **Newer** (repo absent) |
| Fiches PDF | **Same content** (identical hash); folder renamed | **Newer presence** (repo absent) |
| Guide Enseignant | **Much newer** (200 MD files vs 1 annex txt) | **Much newer** |
| Certification PDFs (4) | **Older / missing in backup** | N/A (repo also absent) |
| Méthode PDF | **Missing in backup** | N/A |
| WMS_CERTIFICATION.png | **Newer** (not in git commit) | **Newer** |

**Net:** BACKUP is **newer overall** for Guide + Constitution, but **stale/missing** for Certification PDFs and Méthode PDF held on `phase2-m2-m5-audit`.

---

## 10. Duplicate Versions

| Filename | Copies found | Notes |
|----------|--------------|-------|
| `TEC.WMS PEDAGOGICAL CONSTITUTION.pdf` | **1** (BACKUP only) | — |
| `FICHES_DE_MISSION_ETUDIANT_TECLOG_SCN001_SCN017_V1.pdf` | **1 physical** + **1 git blob** | Same content; different folder names |
| Certification PDFs (phase2) | **Git only** | No second physical copy under `C:\Projetos` search scope |
| `TEC_WMS_PEDAGOGICAL_CONSTITUTION.md` | **1** (REPO only) | MD mirror; not a PDF duplicate |

No conflicting duplicate PDFs of the same institutional document were found on disk.

---

## 11. Adjacent Paths Searched

| Path | `Documentation/Pedagogical_Framework` |
|------|----------------------------------------|
| `C:\Projetos\wms-simulatorV2` | **Not found** |
| `C:\Projetos\_audit_tec_prod` | **Not found** |

---

## 12. Recommended Next Step (informational only — not executed)

Before any copy operation, **reconcile three sources** into one canonical tree under REPO:

1. **FROM BACKUP:** Constitution PDF, Fiches PDF, Guide Enseignant MD tree, `WMS_CERTIFICATION.png`  
2. **FROM git `phase2-m2-m5-audit` (`4cbf119`):** four Certification PDFs, Méthode PDF, annex txt  
3. **FROM REPO (keep):** `Documentation/README.md`, Constitution MD mirror — then diff MD vs PDF  

Use **copy**, not move, until pedagogy owners sign off on folder layout (notably Fiches folder rename and cert PNG vs PDF).

---

## 13. Audit Constraints

- No files copied, moved, committed, or deployed  
- No new pedagogical content authored — inventory and comparison only  
- Deliverable: this report

---

*End of drift audit.*
