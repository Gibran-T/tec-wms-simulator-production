import { eq, and } from "drizzle-orm";
import { getDb } from "../db";
import { m5DocMissionStates } from "../../drizzle/schema";
import type { M5DocMissionStateV1, M5DocScnCode } from "../../shared/m5Doc/types";
import { M5_DOC_EVIDENCE_VERSION } from "../../shared/m5Doc/types";
import { createInitialM5DocState } from "./createInitialState";

/** Test probe: increments only when satellite table is queried/written. */
export const m5DocPersistenceProbe = {
  loadCalls: 0,
  saveCalls: 0,
  reset() {
    this.loadCalls = 0;
    this.saveCalls = 0;
  },
};

/** In-memory fallback when DATABASE_URL is absent (unit/QA without MySQL). */
const memoryStore = new Map<string, M5DocMissionStateV1>();

function memKey(runId: number, version: string) {
  return `${runId}::${version}`;
}

export async function loadM5DocState(
  runId: number,
  scnCode: M5DocScnCode = "SCN-015-DOC",
): Promise<M5DocMissionStateV1> {
  m5DocPersistenceProbe.loadCalls += 1;
  const db = await getDb();
  if (!db) {
    const key = memKey(runId, M5_DOC_EVIDENCE_VERSION);
    const existing = memoryStore.get(key);
    if (existing) return JSON.parse(JSON.stringify(existing)) as M5DocMissionStateV1;
    const initial = createInitialM5DocState(runId, scnCode);
    memoryStore.set(key, initial);
    return JSON.parse(JSON.stringify(initial)) as M5DocMissionStateV1;
  }

  const rows = await db
    .select()
    .from(m5DocMissionStates)
    .where(
      and(eq(m5DocMissionStates.runId, runId), eq(m5DocMissionStates.version, M5_DOC_EVIDENCE_VERSION)),
    )
    .limit(1);

  if (rows[0]?.stateJson) {
    return rows[0].stateJson as M5DocMissionStateV1;
  }

  const initial = createInitialM5DocState(runId, scnCode);
  await db.insert(m5DocMissionStates).values({
    runId,
    version: M5_DOC_EVIDENCE_VERSION,
    stateJson: initial,
  });
  return initial;
}

export async function saveM5DocState(state: M5DocMissionStateV1): Promise<void> {
  m5DocPersistenceProbe.saveCalls += 1;
  const db = await getDb();
  if (!db) {
    memoryStore.set(memKey(state.runId, M5_DOC_EVIDENCE_VERSION), JSON.parse(JSON.stringify(state)));
    return;
  }

  const existing = await db
    .select({ id: m5DocMissionStates.id })
    .from(m5DocMissionStates)
    .where(
      and(eq(m5DocMissionStates.runId, state.runId), eq(m5DocMissionStates.version, M5_DOC_EVIDENCE_VERSION)),
    )
    .limit(1);

  if (existing[0]) {
    await db
      .update(m5DocMissionStates)
      .set({ stateJson: state })
      .where(eq(m5DocMissionStates.id, existing[0].id));
  } else {
    await db.insert(m5DocMissionStates).values({
      runId: state.runId,
      version: M5_DOC_EVIDENCE_VERSION,
      stateJson: state,
    });
  }
}

export function clearM5DocMemoryStore(): void {
  memoryStore.clear();
}
