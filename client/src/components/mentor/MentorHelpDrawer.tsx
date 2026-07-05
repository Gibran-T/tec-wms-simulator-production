import { useState } from "react";
import { Bot, Lock, MessageCircle, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import type { MentorEntryPoint, MentorMode, MentorPersonaId } from "@shared/aiMentor/types";
import { getPersonaDisplayName } from "@shared/aiMentor/personaMap";

type MentorHelpDrawerProps = {
  runId: number;
  isDemo: boolean;
  runStatus: string;
  entryPoint?: MentorEntryPoint;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
  onTriggerClick?: () => void;
};

const MODE_LABELS: Record<MentorMode, { fr: string; en: string }> = {
  learning: { fr: "Apprentissage", en: "Learning" },
  professional: { fr: "Professionnel", en: "Professional" },
  certification: { fr: "Verrouillé", en: "Locked" },
  reflection: { fr: "Réflexion", en: "Reflection" },
};

export default function MentorHelpDrawer({
  runId,
  isDemo,
  runStatus,
  entryPoint = "mission_control",
  open: controlledOpen,
  onOpenChange,
  showTrigger = true,
  onTriggerClick,
}: MentorHelpDrawerProps) {
  const { t, language } = useLanguage();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const [message, setMessage] = useState("");
  const lang = language === "FR" ? "fr" : "en";
  const reflectionRequested = runStatus === "completed" || entryPoint === "debrief";

  const { data: availability } = trpc.mentor.getAvailability.useQuery(
    {
      runId,
      language: lang,
      reflectionRequested,
    },
    { enabled: open },
  );

  const askMutation = trpc.mentor.ask.useMutation();

  const mode: MentorMode | undefined = availability?.mode;
  const modeLabel = mode ? t(MODE_LABELS[mode].fr, MODE_LABELS[mode].en) : "";
  const personaId = availability?.personaId as MentorPersonaId | undefined;
  const personaName = personaId ? getPersonaDisplayName(personaId, lang) : t("Coach ERP", "Coach ERP");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !availability?.available) return;
    askMutation.mutate({
      runId,
      message: message.trim(),
      language: lang,
      entryPoint,
      reflectionRequested,
    });
    setMessage("");
  };

  return (
    <>
      {showTrigger && (
        <button
          type="button"
          onClick={() => {
            onTriggerClick?.();
            setOpen(true);
          }}
          className="flex items-center gap-2 border border-primary/30 bg-primary/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-primary hover:bg-primary/10"
          data-testid="mentor-drawer-trigger"
        >
          <Bot size={14} />
          {t("Mentor IA", "AI Mentor")}
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" data-testid="mentor-drawer">
          <div className="flex h-full w-full max-w-md flex-col bg-background shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <Bot size={18} className="text-primary" />
                <div>
                  <p className="text-sm font-bold">{personaName}</p>
                  {modeLabel && (
                    <p className="text-[10px] text-muted-foreground uppercase">{modeLabel}</p>
                  )}
                </div>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {!availability?.available && (
                <div className="flex items-start gap-2 rounded border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
                  <Lock size={14} className="mt-0.5 shrink-0" />
                  <p>{availability?.reason ?? t("Mentor indisponible.", "Mentor unavailable.")}</p>
                </div>
              )}

              {availability?.available && !availability.integrationReady && (
                <p className="text-xs text-muted-foreground">
                  {t(
                    "Mode mentor actif — réponses guidées Socratiques. Intégration OpenAI live désactivée.",
                    "Mentor mode active — Socratic guided responses. Live OpenAI integration disabled.",
                  )}
                </p>
              )}

              {askMutation.data && (
                <div className="rounded border border-border bg-muted/30 p-3 text-xs">
                  <p className="font-bold mb-1">{t("Mentor", "Mentor")}</p>
                  <p>{askMutation.data.message}</p>
                </div>
              )}

              {availability?.hintsRemaining !== undefined && availability.mode === "professional" && (
                <p className="text-[10px] text-muted-foreground">
                  {t(`Indices restants: ${availability.hintsRemaining}/3`, `Hints remaining: ${availability.hintsRemaining}/3`)}
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="border-t border-border p-4 space-y-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={!availability?.available || askMutation.isPending}
                placeholder={t("Posez votre question...", "Ask your question...")}
                className="w-full min-h-[72px] resize-none border border-border bg-background p-2 text-xs"
                data-testid="mentor-message-input"
              />
              <button
                type="submit"
                disabled={!availability?.available || !message.trim() || askMutation.isPending}
                className="flex w-full items-center justify-center gap-2 bg-primary px-4 py-2 text-xs font-bold text-primary-foreground disabled:opacity-50"
              >
                <MessageCircle size={14} />
                {t("Demander au mentor", "Ask mentor")}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
