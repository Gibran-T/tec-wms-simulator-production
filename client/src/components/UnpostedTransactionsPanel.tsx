import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { AlertTriangle } from "lucide-react";

type UnpostedTx = {
  docType: string;
  sku: string;
  bin: string;
  qty: number;
  posted?: boolean;
  docRef?: string | null;
};

interface UnpostedTransactionsPanelProps {
  runId: number;
  transactions: UnpostedTx[];
  compact?: boolean;
}

export default function UnpostedTransactionsPanel({ runId, transactions, compact }: UnpostedTransactionsPanelProps) {
  const [, navigate] = useLocation();
  const { t } = useLanguage();

  const pending = transactions.filter((tx) => tx.posted === false || !tx.posted);
  if (pending.length === 0) return null;

  const openRegularization = (tx: UnpostedTx) => {
    if (tx.docType !== "GR" || !tx.docRef) return;
    const params = new URLSearchParams({ regularize: tx.docRef });
    navigate(`/student/run/${runId}/step/GR?${params.toString()}`);
  };

  return (
    <div className={`bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 rounded-md ${compact ? "p-3" : "p-4"} space-y-2`}>
      <p className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
        <AlertTriangle size={12} />
        {t("GR fantôme / transaction non postée", "Ghost GR / unposted transaction")}
      </p>
      <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
        {t(
          "Une réception existe dans le moniteur mais n'est pas active dans le stock. Identifiez le document, puis régularisez — ne créez pas une nouvelle GR.",
          "A receipt exists in the monitor but is not active in stock. Identify the document, then regularize — do not create a new GR."
        )}
      </p>
      <div className="space-y-2">
        {pending.map((tx) => (
          <div
            key={tx.docRef ?? `${tx.docType}-${tx.sku}`}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-white dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-2"
          >
            <div className="text-[11px] font-mono text-amber-900 dark:text-amber-100">
              <span className="font-bold">{tx.docRef ?? "—"}</span>
              <span className="ml-2 px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 font-bold uppercase text-[9px]">PENDING</span>
              <span className="ml-2 text-amber-700 dark:text-amber-300">
                {tx.docType} · {tx.sku} · {tx.bin} · {tx.qty} u.
              </span>
            </div>
            {tx.docType === "GR" && tx.docRef && (
              <button
                type="button"
                onClick={() => openRegularization(tx)}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded shrink-0"
              >
                {t("Régulariser le document (MIGO)", "Regularize document (MIGO)")}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
