import { ChevronDown, ChevronUp } from "lucide-react";
import type { LocalizedText } from "@shared/formativeExercises";

type TranslateFn = (fr: string, en: string) => string;

export interface OrderingItem {
  id: string;
  label: LocalizedText;
}

export interface OrderingExerciseProps {
  items: OrderingItem[];
  /** Canonical card IDs in the current answer-state order (source of truth). */
  value: string[];
  onChange: (next: string[]) => void;
  language: "FR" | "EN";
  t: TranslateFn;
  disabled?: boolean;
}

export default function OrderingExercise({
  items,
  value,
  onChange,
  language,
  t,
  disabled = false,
}: OrderingExerciseProps) {
  // Single source of truth: answer state order. Never invent a second display order.
  const order = value;
  const labelById = Object.fromEntries(items.map((i) => [i.id, i.label]));

  const move = (index: number, dir: -1 | 1) => {
    if (!order.length) return;
    const next = [...order];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <ol className="space-y-2" aria-label={t("Ordonner le raisonnement", "Order the reasoning")}>
      {order.map((id, index) => {
        const label = labelById[id];
        return (
          <li
            key={id}
            className="flex items-center gap-2 rounded-md border bg-card p-3"
            data-testid={`order-item-${id}`}
          >
            <span className="text-xs font-bold text-muted-foreground w-6">{index + 1}.</span>
            <span className="flex-1 text-sm text-foreground">
              {language === "FR" ? label?.fr : label?.en}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                disabled={disabled || index === 0}
                onClick={() => move(index, -1)}
                className="p-1.5 rounded-md border bg-background hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
                aria-label={t(`Monter ${label?.fr ?? id}`, `Move up ${label?.en ?? id}`)}
              >
                <ChevronUp size={16} aria-hidden />
              </button>
              <button
                type="button"
                disabled={disabled || index === order.length - 1}
                onClick={() => move(index, 1)}
                className="p-1.5 rounded-md border bg-background hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
                aria-label={t(`Descendre ${label?.fr ?? id}`, `Move down ${label?.en ?? id}`)}
              >
                <ChevronDown size={16} aria-hidden />
              </button>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
