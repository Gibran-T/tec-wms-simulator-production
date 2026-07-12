/**
 * SCN-009 CC_RECON atomic idempotency.
 *
 * Persistence guarantee: unique claim key `CC_RECON:{runId}:{sku}:{bin}`.
 * Claim + adjustment (+ ADJ tx when variance ≠ 0) commit in one DB transaction.
 * Duplicate concurrent inserts fail on unique constraint → safe idempotent response.
 *
 * In-memory store used for concurrent unit tests without requiring MySQL.
 */
import { and, eq } from "drizzle-orm";
import { buildCcReconAdjDocRef, buildCcReconIdempotencyKey } from "./rulesEngine";

export type CcReconAtomicWriteInput = {
  runId: number;
  sku: string;
  bin: string;
  varianceQty: number;
  justification?: string;
};

export type CcReconAtomicWriteResult = {
  created: boolean;
  alreadyReconciled: boolean;
  claimKey: string;
};

export type CcReconClaimRow = {
  runId: number;
  sku: string;
  bin: string;
  varianceQty: number;
  idempotencyKey: string;
};

function isDuplicateKeyError(err: unknown): boolean {
  const e = err as { code?: string | number; errno?: number; message?: string };
  if (e?.code === "ER_DUP_ENTRY" || e?.errno === 1062) return true;
  if (typeof e?.code === "string" && e.code.includes("DUP")) return true;
  const msg = String(e?.message ?? err ?? "");
  return /duplicate|unique|ER_DUP_ENTRY/i.test(msg);
}

/** In-memory atomic claim store for concurrency tests (Promise.all). */
export class InMemoryCcReconStore {
  claims = new Map<string, CcReconClaimRow>();
  adjustments: Array<{ runId: number; sku: string; varianceQty: number; adjustmentQty: number; reason?: string }> = [];
  transactions: Array<{
    runId: number;
    docType: string;
    sku: string;
    bin: string;
    qty: number;
    posted: boolean;
    docRef: string;
  }> = [];
  awards: Array<{ runId: number; eventType: string; pointsDelta: number }> = [];
  /** Simulate failure after claim for retry-safety tests. */
  failAfterClaimKeys = new Set<string>();

  reset() {
    this.claims.clear();
    this.adjustments = [];
    this.transactions = [];
    this.awards = [];
    this.failAfterClaimKeys.clear();
  }

  /**
   * Atomic claim+write. Critical section is synchronous so concurrent
   * Promise.all callers cannot double-claim the same key.
   */
  claimAndPersist(input: CcReconAtomicWriteInput): CcReconAtomicWriteResult {
    const claimKey = buildCcReconIdempotencyKey(input.runId, input.sku, input.bin);
    if (this.claims.has(claimKey)) {
      return { created: false, alreadyReconciled: true, claimKey };
    }

    // Reserve claim first (atomic vs other sync entrants on same tick after await boundaries).
    this.claims.set(claimKey, {
      runId: input.runId,
      sku: input.sku,
      bin: input.bin,
      varianceQty: input.varianceQty,
      idempotencyKey: claimKey,
    });

    if (this.failAfterClaimKeys.has(claimKey)) {
      // Rollback claim — must not permanently lock.
      this.claims.delete(claimKey);
      throw new Error("SIMULATED_CC_RECON_FAILURE_AFTER_CLAIM");
    }

    const alreadyAdj = this.adjustments.some(
      (a) => a.runId === input.runId && a.sku === input.sku && a.adjustmentQty === input.varianceQty,
    );
    if (!alreadyAdj) {
      this.adjustments.push({
        runId: input.runId,
        sku: input.sku,
        varianceQty: input.varianceQty,
        adjustmentQty: input.varianceQty,
        reason: input.justification,
      });
    }

    if (input.varianceQty !== 0) {
      const docRef = buildCcReconAdjDocRef(input.sku, input.bin);
      const alreadyTx = this.transactions.some(
        (t) =>
          t.runId === input.runId &&
          t.docType === "ADJ" &&
          ((t.sku === input.sku && t.bin === input.bin && t.qty === input.varianceQty) || t.docRef === docRef),
      );
      if (!alreadyTx) {
        this.transactions.push({
          runId: input.runId,
          docType: "ADJ",
          sku: input.sku,
          bin: input.bin,
          qty: input.varianceQty,
          posted: true,
          docRef,
        });
      }
    }

    return { created: true, alreadyReconciled: false, claimKey };
  }

  awardOnce(runId: number, eventType: string, pointsDelta: number) {
    if (this.awards.some((a) => a.runId === runId && a.eventType === eventType && a.pointsDelta > 0)) {
      return false;
    }
    this.awards.push({ runId, eventType, pointsDelta });
    return true;
  }
}

export const ccReconTestStore = new InMemoryCcReconStore();

/**
 * Production path: unique claim insert + adjustment (+ ADJ) inside one DB transaction.
 * On unique violation: returns alreadyReconciled without writing another ADJ.
 */
export async function claimAndPersistCcReconTarget(
  input: CcReconAtomicWriteInput,
): Promise<CcReconAtomicWriteResult> {
  const { getDb } = await import("./db");
  const db = await getDb();
  if (!db) throw new Error("DB not available");

  const claimKey = buildCcReconIdempotencyKey(input.runId, input.sku, input.bin);
  const { ccReconTargetClaims, inventoryAdjustments, transactions } = await import("../drizzle/schema");

  // Fast path: already claimed
  const existing = await db
    .select()
    .from(ccReconTargetClaims)
    .where(eq(ccReconTargetClaims.idempotencyKey, claimKey))
    .limit(1);
  if (existing.length > 0) {
    return { created: false, alreadyReconciled: true, claimKey };
  }

  try {
    await db.transaction(async (tx) => {
      await tx.insert(ccReconTargetClaims).values({
        runId: input.runId,
        stepCode: "CC_RECON",
        sku: input.sku,
        bin: input.bin,
        idempotencyKey: claimKey,
        varianceQty: String(input.varianceQty),
      });

      const adjRows = await tx
        .select()
        .from(inventoryAdjustments)
        .where(and(eq(inventoryAdjustments.runId, input.runId), eq(inventoryAdjustments.sku, input.sku)));
      if (!adjRows.some((r) => Number(r.adjustmentQty) === input.varianceQty)) {
        await tx.insert(inventoryAdjustments).values({
          runId: input.runId,
          sku: input.sku,
          varianceQty: String(input.varianceQty),
          adjustmentQty: String(input.varianceQty),
          reason: input.justification?.trim() || (input.varianceQty === 0 ? "ZERO_VARIANCE_CONFIRMED" : null),
          approved: false,
        });
      }

      if (input.varianceQty !== 0) {
        const docRef = buildCcReconAdjDocRef(input.sku, input.bin);
        const adjTxs = await tx
          .select()
          .from(transactions)
          .where(and(eq(transactions.runId, input.runId), eq(transactions.docType, "ADJ")));
        const already = adjTxs.some(
          (t) =>
            (t.sku === input.sku && t.bin === input.bin && t.posted && Number(t.qty) === input.varianceQty) ||
            t.docRef === docRef,
        );
        if (!already) {
          await tx.insert(transactions).values({
            runId: input.runId,
            docType: "ADJ",
            moveType: "MI07",
            sku: input.sku,
            bin: input.bin,
            qty: String(input.varianceQty),
            posted: true,
            docRef,
            comment: input.justification?.trim() || null,
          });
        }
      }
    });
    return { created: true, alreadyReconciled: false, claimKey };
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      return { created: false, alreadyReconciled: true, claimKey };
    }
    throw err;
  }
}

export async function getCcReconClaimsByRun(runId: number): Promise<CcReconClaimRow[]> {
  const { getDb } = await import("./db");
  const db = await getDb();
  if (!db) return [];
  const { ccReconTargetClaims } = await import("../drizzle/schema");
  const rows = await db.select().from(ccReconTargetClaims).where(eq(ccReconTargetClaims.runId, runId));
  return rows.map((r) => ({
    runId: r.runId,
    sku: r.sku,
    bin: r.bin,
    varianceQty: Number(r.varianceQty),
    idempotencyKey: r.idempotencyKey,
  }));
}
