import { UserCircle } from "lucide-react";
import type { CharacterRef } from "@shared/enterpriseBriefing";

interface CharacterCardProps {
  character: CharacterRef;
  language: "FR" | "EN";
}

export default function CharacterCard({ character, language }: CharacterCardProps) {
  return (
    <div className="tec-briefing-panel p-4 flex gap-3">
      <div className="w-14 h-14 bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
        <UserCircle size={32} className="text-slate-500" />
      </div>
      <div className="min-w-0 space-y-1">
        <p className="text-sm font-bold text-slate-900 dark:text-white">{character.name}</p>
        <p className="text-[10px] font-semibold text-primary uppercase tracking-wide">
          {language === "FR" ? character.titleFr : character.titleEn}
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-400 italic leading-relaxed">
          &ldquo;{language === "FR" ? character.signaturePhraseFr : character.signaturePhraseEn}&rdquo;
        </p>
      </div>
    </div>
  );
}
