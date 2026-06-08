import React from 'react';
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, ClipboardCheck, Info, ListOrdered, AlertTriangle, CheckCircle2, UserCog } from "lucide-react";
import { type MissionData } from "../../../server/missionData";

interface MissionSheetProps {
  mission: MissionData | null;
  scenario?: {
    name?: string | null;
    descriptionFr?: string | null;
    descriptionEn?: string | null;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MissionSheet({ mission, scenario, open, onOpenChange }: MissionSheetProps) {
  const { t, language } = useLanguage();

  const scenarioDescription =
    language === "FR"
      ? scenario?.descriptionFr
      : (scenario?.descriptionEn ?? scenario?.descriptionFr);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-0 shadow-2xl rounded-none">
        {!mission ? (
          <>
            <DialogHeader className="bg-slate-100 dark:bg-slate-800 p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="bg-slate-400 p-2">
                  <FileText className="text-white" size={24} />
                </div>
                <DialogTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">
                  {t("Fiche de Mission Opérationnelle", "Operational Mission Sheet")}
                </DialogTitle>
              </div>
            </DialogHeader>
            <div className="p-8 space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                {t(
                  "Fiche de mission en préparation pour ce scénario.",
                  "Mission sheet in preparation for this scenario."
                )}
              </p>
              {scenario?.name && (
                <p className="text-xs font-mono text-slate-500">{scenario.name}</p>
              )}
              {scenarioDescription && (
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed border-l-4 border-slate-200 dark:border-slate-700 pl-4">
                  {scenarioDescription}
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <DialogHeader className="bg-slate-100 dark:bg-slate-800 p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="bg-primary p-2">
                    <FileText className="text-white" size={24} />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">
                      {t("Fiche de Mission Opérationnelle", "Operational Mission Sheet")}
                    </DialogTitle>
                    <p className="text-xs font-semibold text-primary uppercase tracking-widest mt-1">
                      Concorde Logistics — Institutional Standard
                    </p>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] text-slate-500 font-mono">
                    REF: {mission.scnCode ?? `CL-SCN-${mission.scenarioId.toString().padStart(3, "0")}`}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">DATE: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </DialogHeader>

            <div className="p-8 space-y-8 font-sans">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Info size={14} /> {t("Contexte Opérationnel", "Operational Context")}
                    </h3>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed border-l-4 border-slate-200 dark:border-slate-700 pl-4 italic">
                      &ldquo;{mission.context}&rdquo;
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      {t("Objectif de la Mission", "Mission Objective")}
                    </h3>
                    <p className="text-base font-semibold text-slate-900 dark:text-white">
                      {mission.objective}
                    </p>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">{t("Rôle Assigné", "Assigned Role")}</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{mission.role}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">{t("Module ERP/WMS", "ERP/WMS Module")}</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{mission.module}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 text-white p-6 rounded-none">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  {t("Spécifications Techniques", "Technical Specifications")}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase">SKU / Product</p>
                    <p className="text-sm font-mono font-bold">{mission.technicalSpecs.sku}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase">{t("Quantité", "Quantity")}</p>
                    <p className="text-sm font-mono font-bold">
                      {typeof mission.technicalSpecs.quantity === "number"
                        ? `${mission.technicalSpecs.quantity} ${t("unités", "units")}`
                        : mission.technicalSpecs.quantity}
                    </p>
                  </div>
                  {mission.technicalSpecs.sourceBin && (
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase">{t("Bin source", "Source Bin")}</p>
                      <p className="text-sm font-mono font-bold">{mission.technicalSpecs.sourceBin}</p>
                    </div>
                  )}
                  {(mission.technicalSpecs.targetBin ?? mission.technicalSpecs.suggestedBin) && (
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase">{t("Bin cible", "Target Bin")}</p>
                      <p className="text-sm font-mono font-bold text-primary-foreground">
                        {mission.technicalSpecs.targetBin ?? mission.technicalSpecs.suggestedBin}
                      </p>
                    </div>
                  )}
                  {mission.technicalSpecs.expectedTransaction && (
                    <div className="md:col-span-2">
                      <p className="text-[10px] text-slate-400 uppercase">{t("Transaction attendue", "Expected Transaction")}</p>
                      <p className="text-sm font-mono font-bold">{mission.technicalSpecs.expectedTransaction}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase">{t("Statut", "Status")}</p>
                    <p className="text-xs font-bold bg-green-600 px-2 py-0.5 inline-block">
                      {mission.technicalSpecs.status ?? "ACTIVE"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                  <ListOrdered size={16} /> {t("Actions à réaliser (étudiant)", "Actions to perform (student)")}
                </h3>
                <ol className="space-y-2 list-none">
                  {mission.studentActions.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 bg-primary/5 border border-primary/20">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">{action}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <ClipboardCheck size={16} className="text-primary" /> {t("Points de Contrôle & Validation", "Control & Validation Points")}
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {mission.controlPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-xs text-slate-700 dark:text-slate-300">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-950/20 border-l-4 border-green-600 p-4">
                <h3 className="text-xs font-bold text-green-800 dark:text-green-400 uppercase tracking-wider mb-1">
                  {t("Résultat attendu", "Expected outcome")}
                </h3>
                <p className="text-xs text-green-900 dark:text-green-300 leading-relaxed">{mission.expectedOutcome}</p>
              </div>

              {mission.supervisorNotes && (
                <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-4">
                  <h3 className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                    <UserCog size={14} /> {t("Notes du superviseur", "Supervisor notes")}
                  </h3>
                  <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">{mission.supervisorNotes}</p>
                </div>
              )}

              {(mission.successCriteria?.length ?? 0) > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 size={14} /> {t("Critères de réussite", "Success criteria")}
                  </h3>
                  <ul className="space-y-1.5">
                    {mission.successCriteria!.map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(mission.failureConditions?.length ?? 0) > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle size={14} /> {t("Conditions d'échec", "Failure conditions")}
                  </h3>
                  <ul className="space-y-1.5">
                    {mission.failureConditions!.map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                        <span className="text-red-600 font-bold">✗</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase mb-1">Validation Institutionnelle</p>
                  <div className="h-8 w-32 bg-slate-100 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700"></div>
                </div>
                <p className="text-[9px] text-slate-400 font-mono italic">
                  Concorde Logistics — Quality Management System v2.0
                </p>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
