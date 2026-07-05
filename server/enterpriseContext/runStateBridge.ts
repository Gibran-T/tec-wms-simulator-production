/**
 * Bridge to run state assembly — mirrors buildRunState in routers.ts without circular imports.
 */
import {
  getCycleCountsByRun,
  getInventoryAdjustmentsByRun,
  getInventoryCountsByRun,
  getProgressByRun,
  getRunById,
  getScenarioById,
  getTransactionsByRun,
} from "../db";
import { resolveScenarioScnCode } from "../canonicalScenarios";
import { calculateInventory, type M5InitialStateJson } from "../rulesEngine";

export async function buildRunState(runId: number) {
  const run = await getRunById(runId);
  const scenario = run ? await getScenarioById(run.scenarioId) : null;
  const [txs, ccs, prog, inventoryCounts, inventoryAdjustments] = await Promise.all([
    getTransactionsByRun(runId),
    getCycleCountsByRun(runId),
    getProgressByRun(runId),
    getInventoryCountsByRun(runId),
    getInventoryAdjustmentsByRun(runId),
  ]);

  const completedSteps = prog.filter((p) => p.completed).map((p) => p.stepCode);
  const scnCode = scenario ? resolveScenarioScnCode(scenario) : null;
  const scenarioInitialStateJson = (scenario?.initialStateJson as Record<string, unknown> | null) ?? null;

  const baseState = {
    completedSteps,
    scenarioId: run?.scenarioId ?? null,
    scnCode,
    scenarioName: scenario?.name ?? null,
    scenarioInitialStateJson,
    transactions: txs.map((t) => ({
      docType: t.docType,
      sku: t.sku,
      bin: t.bin,
      qty: Number(t.qty),
      posted: t.posted,
      docRef: (t as { docRef?: string | null }).docRef ?? null,
    })),
    cycleCounts: ccs.map((c) => ({
      sku: c.sku,
      bin: c.bin,
      variance: Number(c.variance),
      resolved: c.resolved,
      systemQty: Number(c.systemQty),
      physicalQty: Number(c.physicalQty),
    })),
    inventoryCounts: inventoryCounts.map((c) => ({
      sku: c.sku,
      systemQty: Number(c.systemQty),
      countedQty: Number(c.countedQty),
      varianceQty: Number(c.varianceQty),
    })),
    inventoryAdjustments: inventoryAdjustments.map((a) => ({
      sku: a.sku,
      varianceQty: Number(a.varianceQty),
      adjustmentQty: Number(a.adjustmentQty),
      reason: a.reason,
    })),
    m5InitialStateJson: scenario?.moduleId === 5
      ? (scenario.initialStateJson as M5InitialStateJson | undefined)
      : undefined,
    inventory: calculateInventory(
      txs.map((t) => ({
        docType: t.docType,
        sku: t.sku,
        bin: t.bin,
        qty: Number(t.qty),
        posted: t.posted,
      })),
    ),
  };

  const { recoverScn004RunState } = await import("../scn004");
  const { recoverScn005RunState } = await import("../scn005");
  return recoverScn005RunState(recoverScn004RunState(baseState));
}
