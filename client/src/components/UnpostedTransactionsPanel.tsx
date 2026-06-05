import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

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
  const { t } = useLanguage();
  const utils = trpc.useUtils();

  const pending = transactions.filter((tx) => tx.posted === false || !tx.posted);
  if (pending.length === 0) return null;

  const postExistingTx = trpc.transactions.postExistingTransaction.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      utils.runs.state.invalidate({ runId });
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <div className={`bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 rounded-md ${compact ? "p-3" : "p-4"} space-y-2`}>
      <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
        {t("GR fantôme / transactions non postées", "Ghost GR / unposted transactions")}
      </p>
      <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
        {t(
          "Une réception existe dans le moniteur mais n'est pas active dans le stock. Cliquez Poster (MIGO) — ne créez pas une nouvelle GR.",
          "A receipt exists in the monitor but is not active in stock. Click Post (MIGO) — do not create a new GR."
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
              <span className="ml-2 text-amber-700 dark:text-amber-300">
                {tx.docType} · {tx.sku} · {tx.bin} · {tx.qty} u.
              </span>
            </div>
            {tx.docType === "GR" && tx.docRef && (
              <button
                type="button"
                disabled={postExistingTx.isPending}
                onClick={() => postExistingTx.mutate({ runId, txDocRef: tx.docRef! })}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded disabled:opacity-50 shrink-0"
              >
                {postExistingTx.isPending ? t("Posting...", "Posting...") : t("Poster (MIGO)", "Post (MIGO)")}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
