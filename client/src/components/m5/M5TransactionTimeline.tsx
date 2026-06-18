import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

type TxRow = {
  docType: string;
  sku: string;
  bin: string;
  qty: number;
  posted?: boolean;
  docRef?: string | null;
};

type TimelineNodeState = "empty" | "pending" | "posted" | "blocked";

type TimelineNode = {
  id: string;
  labelFr: string;
  labelEn: string;
  state: TimelineNodeState;
  tx?: TxRow;
  statusLabelFr: string;
  statusLabelEn: string;
};

function resolveNodeState(
  stepDone: boolean,
  hasPostedTx: boolean,
  hasPendingTx: boolean,
  blocked: boolean,
): TimelineNodeState {
  if (blocked) return "blocked";
  if (hasPostedTx || stepDone) return "posted";
  if (hasPendingTx) return "pending";
  return "empty";
}

function buildLiveNodes(
  transactions: TxRow[],
  completedSteps: string[],
  scnCode: string | null,
  varianceBlocked: boolean,
): TimelineNode[] {
  const findTx = (docType: string) => transactions.filter((t) => t.docType === docType);
  const latest = (docType: string) => {
    const txs = findTx(docType);
    return txs.length > 0 ? txs[txs.length - 1] : undefined;
  };
  const hasPosted = (docType: string) => findTx(docType).some((t) => t.posted);
  const hasPending = (docType: string) => findTx(docType).some((t) => !t.posted);

  const nodes: TimelineNode[] = [
    {
      id: "PO",
      labelFr: "PO",
      labelEn: "PO",
      state: resolveNodeState(completedSteps.includes("M5_RECEPTION"), false, false, false),
      statusLabelFr: completedSteps.includes("M5_RECEPTION") ? "référencé" : "—",
      statusLabelEn: completedSteps.includes("M5_RECEPTION") ? "referenced" : "—",
    },
    {
      id: "GR",
      labelFr: "GR",
      labelEn: "GR",
      state: resolveNodeState(
        completedSteps.includes("M5_RECEPTION"),
        hasPosted("GR"),
        hasPending("GR"),
        false,
      ),
      tx: latest("GR"),
      statusLabelFr: hasPosted("GR") ? "posté" : hasPending("GR") ? "en attente" : "—",
      statusLabelEn: hasPosted("GR") ? "posted" : hasPending("GR") ? "pending" : "—",
    },
    {
      id: "PUTAWAY",
      labelFr: "PUTAWAY",
      labelEn: "PUTAWAY",
      state: resolveNodeState(
        completedSteps.includes("M5_PUTAWAY"),
        hasPosted("PUTAWAY"),
        hasPending("PUTAWAY"),
        false,
      ),
      tx: latest("PUTAWAY"),
      statusLabelFr: hasPosted("PUTAWAY") ? "posté" : "—",
      statusLabelEn: hasPosted("PUTAWAY") ? "posted" : "—",
    },
    {
      id: "CC",
      labelFr: "CC",
      labelEn: "CC",
      state: resolveNodeState(completedSteps.includes("M5_CYCLE_COUNT"), false, false, false),
      statusLabelFr: completedSteps.includes("M5_CYCLE_COUNT") ? "compté" : "—",
      statusLabelEn: completedSteps.includes("M5_CYCLE_COUNT") ? "counted" : "—",
    },
  ];

  if (scnCode === "SCN-016") {
    const adjBlocked = varianceBlocked && !completedSteps.includes("M5_ADJ");
    nodes.push({
      id: "ADJ",
      labelFr: "ADJ",
      labelEn: "ADJ",
      state: resolveNodeState(
        completedSteps.includes("M5_ADJ"),
        hasPosted("ADJ"),
        hasPending("ADJ"),
        adjBlocked && completedSteps.includes("M5_CYCLE_COUNT"),
      ),
      tx: latest("ADJ"),
      statusLabelFr: completedSteps.includes("M5_ADJ")
        ? "posté"
        : adjBlocked
          ? "bloqué"
          : "—",
      statusLabelEn: completedSteps.includes("M5_ADJ")
        ? "posted"
        : adjBlocked
          ? "blocked"
          : "—",
    });
  }

  const replBlocked = varianceBlocked && !completedSteps.includes("M5_ADJ");
  nodes.push({
    id: "REPLENISH",
    labelFr: "REPLENISH",
    labelEn: "REPLENISH",
    state: resolveNodeState(
      completedSteps.includes("M5_REPLENISH"),
      false,
      false,
      replBlocked && completedSteps.includes("M5_CYCLE_COUNT"),
    ),
    statusLabelFr: completedSteps.includes("M5_REPLENISH")
      ? "validé"
      : replBlocked
        ? "bloqué"
        : "—",
    statusLabelEn: completedSteps.includes("M5_REPLENISH")
      ? "done"
      : replBlocked
        ? "blocked"
        : "—",
  });

  if (scnCode === "SCN-017") {
    nodes.push({
      id: "DECISION",
      labelFr: "DÉCISION",
      labelEn: "DECISION",
      state: resolveNodeState(
        completedSteps.includes("M5_DECISION"),
        false,
        completedSteps.includes("M5_KPI") && !completedSteps.includes("M5_DECISION"),
        false,
      ),
      statusLabelFr: completedSteps.includes("M5_DECISION")
        ? "soumis"
        : completedSteps.includes("M5_KPI")
          ? "en cours"
          : "—",
      statusLabelEn: completedSteps.includes("M5_DECISION")
        ? "submitted"
        : completedSteps.includes("M5_KPI")
          ? "active"
          : "—",
    });
  }

  return nodes;
}

function nodeColor(state: TimelineNodeState): string {
  if (state === "posted") return "bg-green-500 border-green-600";
  if (state === "pending") return "bg-amber-400 border-amber-500 animate-pulse";
  if (state === "blocked") return "bg-red-500 border-red-600";
  return "bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600";
}

export type ReportTimelineRow = {
  docType: string;
  sku: string;
  bin: string;
  qty: number;
  zone: string;
  docRef?: string | null;
};

export function M5TransactionTimelineReport({ rows }: { rows: ReportTimelineRow[] }) {
  const { t } = useLanguage();
  if (rows.length === 0) return null;
  return (
    <div className="space-y-1" data-testid="m5-timeline-report">
      <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">
        {t("Chronologie opérationnelle", "Operational timeline")}
      </p>
      <table className="w-full text-[10px] font-mono border border-border">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-900 border-b">
            <th className="px-2 py-1 text-left">{t("Étape", "Step")}</th>
            <th className="px-2 py-1 text-left">{t("Réf.", "Ref")}</th>
            <th className="px-2 py-1 text-left">SKU</th>
            <th className="px-2 py-1 text-left">Bin</th>
            <th className="px-2 py-1 text-right">Qty</th>
            <th className="px-2 py-1 text-left">{t("Zone", "Zone")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border/50">
              <td className="px-2 py-1 font-bold">{row.docType}</td>
              <td className="px-2 py-1">{row.docRef ?? "—"}</td>
              <td className="px-2 py-1">{row.sku}</td>
              <td className="px-2 py-1 text-primary">{row.bin}</td>
              <td className="px-2 py-1 text-right">{row.qty}</td>
              <td className="px-2 py-1">{row.zone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function M5TransactionTimeline({
  transactions,
  completedSteps,
  scnCode,
  varianceBlocked,
}: {
  transactions: TxRow[];
  completedSteps: string[];
  scnCode: string | null;
  varianceBlocked?: boolean;
}) {
  const { t, language } = useLanguage();
  const [hoverId, setHoverId] = useState<string | null>(null);
  const nodes = buildLiveNodes(transactions, completedSteps, scnCode, !!varianceBlocked);
  const hovered = nodes.find((n) => n.id === hoverId);

  return (
    <div className="bg-card border border-border rounded-none shadow-sm overflow-hidden" data-testid="m5-transaction-timeline">
      <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 border-b border-border">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {t("Chronologie des opérations", "Operations timeline")}
        </span>
      </div>
      <div className="p-4 overflow-x-auto">
        <div className="flex items-center min-w-max gap-0">
          {nodes.map((node, idx) => (
            <React.Fragment key={node.id}>
              <button
                type="button"
                className="flex flex-col items-center gap-1 min-w-[56px] group"
                onMouseEnter={() => setHoverId(node.id)}
                onMouseLeave={() => setHoverId(null)}
                onFocus={() => setHoverId(node.id)}
                onBlur={() => setHoverId(null)}
              >
                <div
                  className={`w-3 h-3 rounded-full border-2 ${nodeColor(node.state)}`}
                  title={language === "FR" ? node.statusLabelFr : node.statusLabelEn}
                />
                <span className="text-[9px] font-bold font-mono text-slate-600 dark:text-slate-400">
                  {language === "FR" ? node.labelFr : node.labelEn}
                </span>
                <span className="text-[8px] text-slate-400">
                  {language === "FR" ? node.statusLabelFr : node.statusLabelEn}
                </span>
              </button>
              {idx < nodes.length - 1 && (
                <div className="h-0.5 w-6 sm:w-10 bg-slate-300 dark:bg-slate-600 flex-shrink-0 mb-4" />
              )}
            </React.Fragment>
          ))}
        </div>
        {hovered?.tx && (
          <p className="mt-3 text-[10px] font-mono text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-2 border border-border">
            {hovered.tx.docType} · {hovered.tx.docRef ?? "—"} · {hovered.tx.sku} · {hovered.tx.bin} · {hovered.tx.qty}
          </p>
        )}
      </div>
    </div>
  );
}
