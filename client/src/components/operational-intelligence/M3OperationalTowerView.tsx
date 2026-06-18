import React from "react";
import type { M3OperationalBadge, M3OperationalTowerEntry } from "@/data/m3OperationalControlTower";
import type { M3ResolutionChainChip } from "@/lib/m3OperationalEvidence";

const TONE_CLASSES: Record<M3OperationalBadge["tone"], string> = {
  green: "bg-green-50 dark:bg-green-950/30 border-green-300 text-green-800 dark:text-green-200",
  amber: "bg-amber-50 dark:bg-amber-950/30 border-amber-300 text-amber-800 dark:text-amber-200",
  red: "bg-red-50 dark:bg-red-950/30 border-red-300 text-red-800 dark:text-red-200",
  slate: "bg-slate-50 dark:bg-slate-800/50 border-slate-300 text-slate-700 dark:text-slate-300",
};

export function M3OperationalTowerView({
  entry,
  badges,
  resolutionChain,
  t,
  language,
}: {
  entry: M3OperationalTowerEntry;
  badges: M3OperationalBadge[];
  resolutionChain?: M3ResolutionChainChip[];
  t: (fr: string, en: string) => string;
  language: string;
}) {
  const isFr = language === "FR";

  return (
    <div className="space-y-3">
      <div>
        <p className="text-[10px] font-bold text-primary uppercase">
          {t("Tour de contrôle M3 — Module 3", "M3 Control Tower — Module 3")}
        </p>
        <p className="text-[10px] font-semibold text-foreground mt-0.5">
          {isFr ? entry.titleFr : entry.titleEn}
        </p>
        <p className="text-[10px] text-slate-600 dark:text-slate-400 italic mt-1">
          {isFr ? entry.focusFr : entry.focusEn}
        </p>
      </div>

      {badges.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-2 border ${TONE_CLASSES[badge.tone]}`}
            >
              <p className="text-[9px] font-bold uppercase opacity-80">
                {isFr ? badge.labelFr : badge.labelEn}
              </p>
              <p className="text-[10px] font-semibold mt-0.5 leading-snug">
                {isFr ? badge.valueFr : badge.valueEn}
              </p>
            </div>
          ))}
        </div>
      )}

      {resolutionChain && resolutionChain.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-border">
          {resolutionChain.map((chip) => (
            <span
              key={chip.id}
              className={`text-[9px] font-mono font-bold px-2 py-0.5 border ${
                chip.highlight
                  ? "bg-amber-100 text-amber-900 border-amber-400 ring-1 ring-amber-400"
                  : TONE_CLASSES[chip.tone]
              }`}
            >
              {isFr ? chip.labelFr : chip.labelEn}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function M3ResolutionChainRow({
  chips,
  language,
}: {
  chips: M3ResolutionChainChip[];
  language: string;
}) {
  const isFr = language === "FR";
  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900/40 border border-border">
      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
        {isFr ? "Chaîne de résolution" : "Resolution chain"}
      </span>
      {chips.map((chip, idx) => (
        <React.Fragment key={chip.id}>
          {idx > 0 && <span className="text-slate-400 text-[10px]">→</span>}
          <span
            className={`text-[9px] font-mono font-bold px-2 py-0.5 border ${
              chip.highlight
                ? "bg-amber-100 text-amber-900 border-amber-400"
                : TONE_CLASSES[chip.tone]
            }`}
          >
            {isFr ? chip.labelFr : chip.labelEn}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

export function M3ReplenishmentParamsTable({
  rows,
  t,
  language,
  showFooter = true,
  compact = false,
}: {
  rows: Array<{
    sku: string;
    bin: string;
    stock: number;
    minQty: number;
    maxQty: number;
    safetyStock: number;
    deltaMin: number;
    targetQ: number;
    belowMin: boolean;
  }>;
  t: (fr: string, en: string) => string;
  language: string;
  showFooter?: boolean;
  compact?: boolean;
}) {
  const isFr = language === "FR";
  const cellClass = compact ? "px-2 py-1" : "px-3 py-1.5";

  return (
    <div className="overflow-x-auto">
      <table className={`w-full font-mono border-collapse ${compact ? "text-[9px]" : "text-[10px]"}`}>
        <thead>
          <tr className="text-slate-500 border-b border-border">
            <th className={`text-left ${cellClass}`}>SKU</th>
            <th className={`text-left ${cellClass}`}>{t("Bin", "Bin")}</th>
            <th className={`text-right ${cellClass}`}>{t("Stock actuel", "Current stock")}</th>
            <th className={`text-right ${cellClass}`}>Min</th>
            <th className={`text-right ${cellClass}`}>Max</th>
            <th className={`text-right ${cellClass}`}>SS</th>
            <th className={`text-right ${cellClass}`}>Δ Min</th>
            <th className={`text-right ${cellClass}`}>{t("Q cible", "Target Q")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.sku} className="border-b border-border/50">
              <td className={`font-semibold ${cellClass}`}>{row.sku}</td>
              <td className={`text-primary ${cellClass}`}>{row.bin}</td>
              <td className={`text-right font-bold ${cellClass}`}>{row.stock}</td>
              <td className={`text-right ${cellClass}`}>{row.minQty}</td>
              <td className={`text-right ${cellClass}`}>{row.maxQty}</td>
              <td className={`text-right ${cellClass}`}>{row.safetyStock}</td>
              <td className={`text-right font-bold ${cellClass} ${row.belowMin ? "text-red-600" : "text-green-600"}`}>
                {row.deltaMin}
              </td>
              <td className={`text-right ${cellClass}`}>{row.targetQ}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {showFooter && (
        <p className="text-[9px] text-slate-600 dark:text-slate-400 italic mt-2">
          {isFr
            ? "Évaluation : Q = Max − stock actuel. Les étapes CC_LIST/COUNT/RECON confirment les niveaux — concentrez-vous sur REPLENISH."
            : "Evaluation: Q = Max − current stock. CC_LIST/COUNT/RECON steps confirm levels — focus on REPLENISH."}
          {" "}
          <span className="not-italic font-semibold">
            ({t("Référence pédagogique", "Pedagogical reference")})
          </span>
        </p>
      )}
    </div>
  );
}

export function M3ConfirmationTargetsTable({
  rows,
  t,
  language,
}: {
  rows: Array<{ sku: string; systemLevel: number; roleFr: string; roleEn: string }>;
  t: (fr: string, en: string) => string;
  language: string;
}) {
  const isFr = language === "FR";
  return (
    <div className="overflow-x-auto mt-2">
      <p className="text-[9px] font-bold text-amber-800 dark:text-amber-200 uppercase mb-1">
        {t("Cibles de confirmation", "Confirmation targets")}
      </p>
      <table className="w-full font-mono text-[9px] border-collapse">
        <thead>
          <tr className="text-amber-700 dark:text-amber-300 border-b border-amber-200">
            <th className="text-left px-2 py-1">SKU</th>
            <th className="text-right px-2 py-1">{t("Niveau système à confirmer", "System level to confirm")}</th>
            <th className="text-left px-2 py-1">{t("Rôle", "Role")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.sku} className="border-b border-amber-100 dark:border-amber-900">
              <td className="px-2 py-1 font-semibold">{row.sku}</td>
              <td className="px-2 py-1 text-right">{row.systemLevel} u.</td>
              <td className="px-2 py-1">{isFr ? row.roleFr : row.roleEn}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
