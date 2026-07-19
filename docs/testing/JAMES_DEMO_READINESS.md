# James Timothy — Demo Readiness Procedure

**Account:** James Timothy · `jamesnns3@gmail.com` · userId **222**  
**Policy:** James may be used for QA/smoke; **never leave mid-scenario** before class.

## Mandatory sequence after any QA / smoke / replay

1. **QA Cleanup** — abandon all `in_progress` runs  
2. **Demo Readiness** — verify no partial state  
3. **Verification** — M4 accessible, SCN-012 ready to start (do **not** start)

## Supported API (after this hotfix deploy)

```http
POST /api/trpc/admin.prepareDemoReadiness
```

Input:

```json
{ "email": "jamesnns3@gmail.com", "dryRun": false }
```

- Roles: **admin** or **teacher** (teachers: demo accounts only)  
- Effect: sets all James `in_progress` runs → `abandoned`  
- Preserves: completed runs, scores, reports, technical evidence  
- Idempotent

Dry-run:

```json
{ "email": "jamesnns3@gmail.com", "dryRun": true }
```

## Script

```bash
# Dry-run (lists active runs; needs TEC_ADMIN_* or TEC_TEACHER_* for API call)
node .manus-logs/_james-demo-readiness.mjs

# Apply after deploy
node .manus-logs/_james-demo-readiness.mjs --apply
```

## Gate — JAMES DEMO READINESS

| Check | Required |
|-------|----------|
| Account | James Timothy |
| Active run | none |
| Partial scenario | none |
| Residual validation error | none |
| Target module | M4 accessible |
| Scenario start CTA | visible |
| New run ready | yes |
| **Final verdict** | **READY FOR CLASS** |

Hotfix cannot be COMPLETE if this gate fails.
