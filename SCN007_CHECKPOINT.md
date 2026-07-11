# SCN-007 — CHECKPOINT FINAL

**Status:** `SCN-007 — COMPLETE / DEPLOYED / SEEDED / SMOKED / CHECKPOINTED`  
**Date:** 2026-07-11  
**Scope exclusive:** M2 — Scénario 2 : Validation de la capacité d'emplacement (scenarioId **7**)

---

## 1. Status final

| Gate | Resultado |
|------|-----------|
| Implement | DONE (pré-GO) |
| Guardian/QA | GO |
| Commit | DONE |
| Push | DONE |
| Deploy Railway | SUCCESS |
| Seed manual produção | EXIT 0 |
| Smoke produção | PASS (capacidade + FIFO + negativos + progressão + não-regressão) |
| Checkpoint | THIS DOCUMENT |

## 2. Hash do commit

- **Full:** `094d055068d3f4b63baa1f363f44ba01b87f00ff`
- **Short:** `094d055`
- **Message:** `fix(SCN-007): correct FIFO_PICK STOCKAGE→EXPÉDITION with dual-lot seed`

## 3. Branch

`production-hotfix-rc13-pedagogy-class6`

## 4. Remote

`origin/production-hotfix-rc13-pedagogy-class6`  
Push range: `35597eb..094d055`

## 5. Deploy

| Campo | Valor |
|-------|--------|
| Railway deployment | `d54f0e83-380d-478b-a432-75955d86712e` |
| Status | SUCCESS |
| Commit implantado | `094d055068d3f4b63baa1f363f44ba01b87f00ff` |
| App | Online — `Server running on http://localhost:8080/` |
| URL | https://tec-wms-simulator-production-production.up.railway.app |
| Migration errors | Nenhum observado |
| Boot errors | Nenhum observado |
| Auto-seed | **Não** — seed é manual |

## 6. Seed manual

| Campo | Valor |
|-------|--------|
| Método | `npx tsx server/seed.ts` com `DATABASE_URL` = MySQL **public proxy** (`thomas.proxy.rlwy.net`) |
| Motivo | `railway run` usa `mysql.railway.internal` (ENOTFOUND fora da rede Railway) |
| Ambiente | Produção (`RAILWAY_ENVIRONMENT=production`) |
| Resultado | `✅ Seed complete: 5 modules, 10 SKUs, 13 bins, 5 M1 / 3 M2 / 3 M3 / 3 M4 / 3 M5 scenarios` |
| EXIT | 0 |
| Idempotente | Sim — upsert por `scenarios.name + moduleId`; atualiza `initialStateJson` |
| Não apaga | alunos, coortes, runs, scores (somente master data + scenario defs) |

### Verificação scenarioId 7

- `hasDualLot` (LOT-2025-001 + LOT-2025-002): **true**
- `hasB02` (B-02-R1-L1): **true**
- SCN-006: sem dual-lot SCN-007 / sem B-02 FIFO seed
- SCN-008: **LOT-A-2025 / LOT-B-2025 / LOT-C-2025** intactos; sem LOT-2025-001/002
- Duplicatas M2 por nome: **nenhuma** (count = 3)

Evidência: `.manus-logs/_scn007-seed-verify-results.json`, `.manus-logs/_scn007-nonreg-probe.json`

## 7. Resultado do smoke

Nova run **após seed:** `runId=453` (James Timothy / `jamesnns3@gmail.com`)

| ID | Teste | Resultado |
|----|-------|-----------|
| A0 | PUTAWAY 600 → B-01-R1-L1 | BLOQUEADO (capacité 500) |
| A1 | PUTAWAY 500 → B-01-R1-L1 LOT-2025-002 | ACEITO |
| A2 | PUTAWAY 100 → B-01-R1-L2 LOT-2025-002 | ACEITO |
| C1 | Source REC-01 | BLOQUEADO — origem STOCKAGE |
| C2 | Dest B-01-R1-L2 | BLOQUEADO — dest EXPÉDITION |
| C3 | Lot LOT-2025-002 com saldo em 001 | BLOQUEADO — mensagem FIFO FR canônica |
| C4 | Qty 999 > saldo | BLOQUEADO — sem estoque negativo |
| B | FIFO LOT-2025-001 B-02→EXP-01 qty 100 | ACEITO + messageFr succès |
| D | Após consumir 001: LOT-2025-002 elegível | ACEITO |
| E | SCN-006 / SCN-008 start + auth + progress + scenarios | PASS |

Evidência: `.manus-logs/_scn007-prod-smoke-results.json`, `.manus-logs/_scn007-nonreg-probe.json`

Nota: o check inicial `modules.list` falhou (endpoint inexistente); substituído por `modules.progress` + `scenarios.listByModule` — ambos PASS.

## 8. Evidências

- Commit/stat: 10 arquivos, +518/−69
- Seed log: `.manus-logs/_scn007-prod-seed.txt`
- Seed verify: `.manus-logs/_scn007-seed-verify-results.json`
- Smoke: `.manus-logs/_scn007-prod-smoke.txt` / `_scn007-prod-smoke-results.json`
- Non-reg API: `.manus-logs/_scn007-nonreg-probe.json`
- Deploy meta: `.manus-logs/_railway-deploy-scn007.json`

## 9. Testes (pré-commit)

```
npx vitest run \
  server/m2.scn007-fifo-pick.test.ts \
  server/m2.gold-standard.test.ts \
  server/m2.monitor.test.ts \
  server/m2.stabilization.test.ts \
  server/m2.scoring.test.ts \
  server/module2.rules.test.ts \
  shared/enterprise/operationalContract.test.ts
```

- **7 files / 64 tests passed / EXIT 0**

## 10. Build (pré-commit)

- `npm run build` — **EXIT 0**

## 11. Riscos residuais

1. **Runs SCN-007 abertas antes do seed** podem ter `initialStateJson` antigo (sem LOT-2025-001 @ B-02). Usar **somente runs novas** pós-seed.
2. Seed local via `railway run` **não** alcança MySQL interno; ops devem usar `MYSQL_PUBLIC_URL` / proxy público.
3. Segundo putaway após `markStepComplete(PUTAWAY)` funciona hoje (sem gate “já completado”), mas a progressão pedagógica depende de split 500+100 na mesma run.
4. SCN-008 nomenclature hotfix permanece **fora do repo** até release separada.

## 12. Situação das runs anteriores

- Runs SCN-007 pré-seed: **não reutilizar** para validação FIFO.
- Smoke usou run **453** (nova, pós-seed).
- Runs 454 (SCN-006) e 455 (SCN-008) criadas só para abertura / não-regressão.
- Nenhum reset global de coortes / progresso.

## 13. Confirmação: SCN-008 não incluído

| Check | Status |
|-------|--------|
| Seed SCN-008 LOT-A/B/C-2025 | Intactos em código e DB prod |
| `missionDataExtended` SCN-008 | LOT-A-2025 baseline (sem diff SCN-008) |
| `m2.gold-standard.test.ts` | Sem diff no commit |
| `server/m2.scn008-fifo-pick.test.ts` | **Ausente** no repo |
| Patch SCN-008 aplicado | **Não** |

Arquivos do commit (exclusivos):

1. `server/seed.ts`
2. `server/rulesEngine.ts`
3. `server/routers.ts`
4. `client/src/pages/student/StepForm.tsx`
5. `server/missionDataExtended.ts`
6. `client/src/data/scenarioCockpitPedagogy.ts`
7. `server/m2.scn007-fifo-pick.test.ts`
8. `server/m2.monitor.test.ts`
9. `shared/enterprise/operationalContract.test.ts`
10. `SCN007_FIFO_SEED_RUNBOOK.md`

## 14. Localização do patch externo SCN-008

```
C:\Users\gibra\.cursor\patches\scn008-fifo-lot-nomenclature-hotfix.patch
SHA-256: 416323801b19274575b83c45b85042c958388d1b430ea529dced3f7a189c601e
```

## 15. Próximo passo permitido

Somente após este checkpoint:

- Reaplicar o patch externo do **SCN-008** em **release separada**
- Tratar SCN-008 com Implement → Guardian/QA → Commit → Push → Deploy → Seed → Smoke → Checkpoint próprios

**Não** misturar SCN-008 neste commit/deploy.

---

**Declared:** `SCN-007 — COMPLETE / DEPLOYED / SEEDED / SMOKED / CHECKPOINTED`
