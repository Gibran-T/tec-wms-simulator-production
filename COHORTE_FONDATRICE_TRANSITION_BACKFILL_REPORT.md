# TEC.WMS — Cohorte Fondatrice Transition Backfill Report

**Document type:** Post-execution operational report  
**Programme:** TEC.LOG — Collège de la Concorde  
**Cohort:** Cohorte Fondatrice (institutional Manus → Railway transition)  
**Platform:** `https://tec-wms-simulator-production-production.up.railway.app`  
**Executed at:** 2026-06-18T14:21:33Z (UTC)  
**Git HEAD at execution:** `03ec5529a92a4a6396a3300cc05e01d7001ff7c5` (`docs(rc13): add Cohorte Fondatrice finalization plan`)  
**Operator script:** `.manus-logs/cohorte-fondatrice-transition-backfill.mjs`  
**Raw results:** `.manus-logs/cohorte-fondatrice-transition-backfill-results.json`

---

## Executive Summary

| Item | Result |
|------|--------|
| Railway online | ✅ HTTP 200 |
| Code changes | ✅ None |
| Migrations | ✅ None |
| Scoring engine | ✅ Untouched |
| Silver global rules | ✅ Untouched |
| Gold global rules | ✅ Untouched |
| Mission Control / M4 / M5 code | ✅ Untouched |
| Fabricated `scenario_runs` (backfill) | ✅ None |
| Fabricated `quiz_attempts` | ✅ None |
| Fabricated `scoring_events` | ✅ None |
| Silver students backfilled | ✅ 4/4 |
| James M4/M5 unlock (no Silver) | ✅ |
| Post-validation | ✅ All checks passed |

**Verdict:** 🟢 **TRANSITION BACKFILL COMPLETE** — pedagogical progression for Cohorte Fondatrice is now reflected on Railway with minimal data intervention only.

---

## 1. Pré-voo

| Check | Result |
|-------|--------|
| Railway ativo | ✅ `tec-wms-simulator-production` Online (region: sfo) |
| HEAD atual | ✅ `03ec552` |
| Cohort ID | ✅ `1` (Cohorte Fondatrice) |
| Snapshot antes | ✅ Captured (see §2) |

### User IDs confirmados (Railway production)

| # | Nome | Email | User ID | Student Number | Certificate |
|---|------|-------|---------|----------------|-------------|
| 1 | Aissata Soukeina Camara | aissatasoukeinacamara@gmail.com | **184** | `2026-1806` | TEC-SIL-2026-001 |
| 2 | Darlin Campaz Paredes | dcparedes2010@gmail.com | **213** | `00-2004` | TEC-SIL-2026-002 |
| 3 | Fredy Tamile Lola | fredlolabio@gmail.com | **216** | `1011-KF` | TEC-SIL-2026-003 |
| 4 | Prince Agbodjan Sewa Francis Ghislain | sewafrancispa@gmail.com | **219** | `613-462` | TEC-SIL-2026-004 |
| 5 | James Timothy (demo/professor) | jamesnns3@gmail.com | **222** | — | — |

All expected user IDs matched live database records.

---

## 2. Estado Antes

| Métrica | Valor |
|---------|-------|
| `module_progress` (5 estudantes) | **0 linhas** |
| `profiles.silverCertified` | **false** em todos |
| `scenario_runs` (eval) | **0** por estudante |
| `quiz_attempts` | **0** por estudante |
| `scoring_events` | **0** por estudante |
| Aissata `cohortId` | `null` (demais: `1`) |
| Outros estudantes na cohorte afectados | **0** (`otherStudentsModuleProgressInCohort = 0`) |

---

## 3. Alterações Realizadas

**Mecanismo:** SQL directo via `MYSQL_PUBLIC_URL` (data-only). Nenhum endpoint de scoring, quiz ou certification engine foi modificado.

### 3.1 `module_progress` — 5 utilizadores (M1, M2, M3)

Para cada `userId` ∈ {184, 213, 216, 219, 222}:

| Módulo | `passed` | `bestScore` | `completedAt` | `teacherValidated` |
|--------|----------|-------------|---------------|-------------------|
| M1 (`moduleId=1`) | `true` | 60 | 2026-06-01 12:00:00 | — |
| M2 (`moduleId=2`) | `true` | 60 | 2026-06-01 12:00:00 | — |
| M3 (`moduleId=3`) | `true` | 70 | 2026-06-01 12:00:00 | **`true`** |

Total: **15 INSERTs** (3 módulos × 5 utilizadores). Nenhum UPDATE em linhas pré-existentes.

### 3.2 `profiles` — Silver (4 estudantes apenas)

```sql
UPDATE profiles SET silverCertified = 1 WHERE userId IN (184, 213, 216, 219);
```

**James (222):** `silverCertified` permanece `false`. Sem `studentNumber`, sem registry entry.

### 3.3 `profiles` — Correção cohorte Aissata

```sql
UPDATE profiles SET cohortId = 1 WHERE userId = 184 AND cohortId IS NULL;
```

### 3.4 O que NÃO foi alterado

- `scenario_runs` (durante backfill)
- `quiz_attempts`
- `scoring_events`
- `goldCertified`
- Código, migrations, regras globais Silver/Gold
- Estudantes fora dos 5 IDs acima
- Futuras cohortes

---

## 4. Estado Depois

| User ID | `silverCertified` | `cohortId` | M1 | M2 | M3 + TV |
|---------|-------------------|------------|----|----|---------|
| 184 | ✅ true | 1 | ✅ passed | ✅ passed | ✅ passed + validated |
| 213 | ✅ true | 1 | ✅ passed | ✅ passed | ✅ passed + validated |
| 216 | ✅ true | 1 | ✅ passed | ✅ passed | ✅ passed + validated |
| 219 | ✅ true | 1 | ✅ passed | ✅ passed | ✅ passed + validated |
| 222 | ❌ false | 1 | ✅ passed | ✅ passed | ✅ passed + validated |

`module_progress` rows: **15** (exactly 3 per student, no duplicates).

---

## 5. Validação Pós-execução — Estudantes Silver (4/4)

| Estudante | Login | Silver Obtenue | Progress 100% | Certificate ID | M4 | M5 | Gold path |
|-----------|-------|----------------|---------------|----------------|----|----|-----------|
| Aissata (184) | ✅ | ✅ | ✅ | TEC-SIL-2026-001 ✅ | ✅ | ✅ | IN_PROGRESS (not LOCKED) |
| Darlin (213) | ✅ | ✅ | ✅ | TEC-SIL-2026-002 ✅ | ✅ | ✅ | IN_PROGRESS |
| Fredy (216) | ✅ | ✅ | ✅ | TEC-SIL-2026-003 ✅ | ✅ | ✅ | IN_PROGRESS |
| Prince (219) | ✅ | ✅ | ✅ | TEC-SIL-2026-004 ✅ | ✅ | ✅ | IN_PROGRESS |

**Certificate Preview:** Enabled when `silverCertified=true` + `studentNumber` matches `shared/silverCertificationRegistry.ts`. All four registry lookups resolve to the correct `TEC-SIL-2026-00N` IDs.

**Nota pedagógica:** A checklist M1 na página Certifications pode ainda mostrar gates individuais por cumprir (quiz, cenários, compliance) enquanto o chip **Obtenue** está activo — comportamento documentado para override institucional; não é regressão de runtime.

---

## 6. Validação Pós-execução — James Timothy (222)

| Check | Result |
|-------|--------|
| Login | ✅ |
| Sem Silver (`silverCertified=false`) | ✅ |
| Sem Certificate ID / registry | ✅ (`studentNumber=null`) |
| M1–M3 passed + teacherValidated | ✅ |
| M4 acessível (`runs.start` SCN-012) | ✅ |
| M5 acessível (`runs.start` SCN-015) | ✅ |
| Gold state | `LOCKED` (esperado — sem Silver prerequisite) |

James recebe paridade M4/M5 para demonstrações em aula, sem certificação institucional.

---

## 7. Verificações Especiais

| Verificação | Resultado |
|-------------|-----------|
| Scoring engine alterado | ✅ Não |
| Certification engine global alterado | ✅ Não |
| Outras cohortes alteradas | ✅ Não |
| Estudantes fora da Cohorte Fondatrice alterados | ✅ Não |
| `quiz_attempts` criados no backfill | ✅ Não |
| `scoring_events` criados no backfill | ✅ Não |

### Runs de sonda (pós-validação apenas)

Para confirmar gates `runs.start` M4/M5, o script de validação iniciou **10 runs vazios** (não completados, sem scoring fabricado):

| Run ID | Estudante | Cenário |
|--------|-----------|---------|
| 12 | Aissata | SCN-012 (M4) |
| 13 | Aissata | SCN-015 (M5) |
| 14 | Darlin | SCN-012 |
| 15 | Darlin | SCN-015 |
| 16 | Fredy | SCN-012 |
| 17 | Fredy | SCN-015 |
| 18 | Prince | SCN-012 |
| 19 | Prince | SCN-015 |
| 20 | James | SCN-012 |
| 21 | James | SCN-015 |

Estes runs **não fazem parte do backfill pedagógico**; são artefactos de smoke de acesso. Podem ser removidos opcionalmente (ver rollback §8).

---

## 8. Rollback Possível

### Reverter backfill pedagógico

```sql
UPDATE profiles SET silverCertified = 0 WHERE userId IN (184, 213, 216, 219);
DELETE FROM module_progress WHERE userId IN (184, 213, 216, 219, 222);
-- Restaurar Aissata cohortId se necessário:
-- UPDATE profiles SET cohortId = NULL WHERE userId = 184;
```

### Remover runs de sonda (opcional)

```sql
DELETE FROM scenario_runs WHERE id IN (12, 13, 14, 15, 16, 17, 18, 19, 20, 21);
```

> `admin.resetRun` ou DELETE em cascata depende de FKs (`scoring_events`, `progress`, etc.). Os runs de sonda estão em estado inicial (sem conclusão).

---

## 9. Riscos Residuais

| ID | Risco | Severidade | Mitigação |
|----|-------|------------|-----------|
| R-01 | Checklist M1 aberta com Silver “Obtenue” | Baixo | Comunicar a professores; override institucional documentado |
| R-02 | Runs de sonda (IDs 12–21) no Mission Control | Baixo | DELETE opcional; runs não completados |
| R-03 | Estudante re-joga M1 com score baixo | Baixo | `silverCertified` não revoga automaticamente |
| R-04 | Precedente para futuras cohortes | Médio | Excepção única Manus→Railway; sem alteração de código |
| R-05 | `module_progress` sem UNIQUE `(userId, moduleId)` | Baixo | 15 linhas verificadas; re-execução usaria UPDATE-first |

---

## 10. Conformidade com Regras Absolutas

| Regra | Cumprida |
|-------|----------|
| Não alterar código | ✅ |
| Não criar migrations | ✅ |
| Não alterar scoring engine | ✅ |
| Não alterar Silver/Gold global rules | ✅ |
| Não alterar Mission Control / M4 / M5 | ✅ |
| Não alterar futuras cohortes | ✅ |
| Não fabricar runs/quizzes/scoring no backfill | ✅ |
| Escopo exclusivo Cohorte Fondatrice | ✅ |
| James sem Silver/registry | ✅ |

---

## 11. Commit

- **Dados Railway:** alterados em produção — **nenhum commit de código ou dados**.
- **Este relatório:** ficheiro novo `COHORTE_FONDATRICE_TRANSITION_BACKFILL_REPORT.md` — **aguarda aprovação explícita** antes de commit ou push.

---

*Report generated from live execution output `.manus-logs/cohorte-fondatrice-transition-backfill-results.json`.*
