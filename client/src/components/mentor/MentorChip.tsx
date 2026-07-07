import { Bot } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type MentorChipProps = {
  onOpen?: () => void;
  available?: boolean;
};

/** OIL Panel F mentor entry point shell — RC22-T06 */
export default function MentorChip({ onOpen, available = true }: MentorChipProps) {
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={onOpen}
      disabled={!available}
      className="inline-flex items-center gap-1.5 border border-primary/30 bg-primary/5 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-primary disabled:cursor-not-allowed disabled:opacity-40"
      data-testid="mentor-chip"
    >
      <Bot size={10} />
      {t("Collègue", "Colleague")}
    </button>
  );
}
