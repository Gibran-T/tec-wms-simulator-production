import { useLanguage } from "@/contexts/LanguageContext";
import type { MentorPersonaId } from "@shared/aiMentor/types";
import { getEnterpriseEmployeeForLanguage } from "@shared/aiMentor/enterpriseEmployee";

type MentorChipProps = {
  onOpen?: () => void;
  available?: boolean;
  personaId?: MentorPersonaId;
};

/** OIL Panel F — enterprise colleague entry point (RC23-E) */
export default function MentorChip({ onOpen, available = true, personaId = "FLOOR_MENTOR" }: MentorChipProps) {
  const { language } = useLanguage();
  const lang = language === "FR" ? "fr" : "en";
  const employee = getEnterpriseEmployeeForLanguage(personaId, lang);

  return (
    <button
      type="button"
      onClick={onOpen}
      disabled={!available}
      className="inline-flex items-center gap-1.5 border border-primary/30 bg-primary/5 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-primary disabled:cursor-not-allowed disabled:opacity-40"
      data-testid="mentor-chip"
    >
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-[8px] font-bold">
        {employee.avatarInitials}
      </span>
      {employee.consultButtonLabel}
    </button>
  );
}
