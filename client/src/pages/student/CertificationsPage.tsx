import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { Award, CheckCircle, Circle, ChevronRight, Info } from "lucide-react";
import { trpc } from "@/lib/trpc";
import FioriShell from "@/components/FioriShell";
import { Button } from "@/components/ui/button";
import SilverBadgeSvg, { GoldBadgeLockedSvg, GoldBadgeSvg } from "@/components/certification/SilverBadgeSvg";
import {
  CertificationProgressRing,
  SilverStatusChip,
  GoldStatusChip,
  resolveSilverState,
  resolveSilverContinuePath,
  shouldShowSilverContinueButton,
  type SilverCertState,
  type GoldCertState,
} from "@/components/certification/CertificationStatus";
import CertificateCredentialActions from "@/components/certification/CertificateCredentialActions";
import { lookupSilverRegistryByStudentNumber } from "@shared/silverCertificationRegistry";
import { lookupVerifiedCredentialByCertificateId } from "@shared/certification/railwayVerificationRegistry";

type M1ScnKey = "SCN001" | "SCN002" | "SCN003" | "SCN004" | "SCN005";

const SCN_LABELS: Record<M1ScnKey, { fr: string; en: string }> = {
  SCN001: { fr: "SCN-001 — Cycle opérationnel", en: "SCN-001 — Operational cycle" },
  SCN002: { fr: "SCN-002 — GR fantôme", en: "SCN-002 — Ghost GR" },
  SCN003: { fr: "SCN-003 — Stock insuffisant", en: "SCN-003 — Stock shortage" },
  SCN004: { fr: "SCN-004 — Écart inventaire", en: "SCN-004 — Inventory variance" },
  SCN005: { fr: "SCN-005 — Multi-conformités", en: "SCN-005 — Multi-compliance" },
};

const SCN_KEYS: M1ScnKey[] = ["SCN001", "SCN002", "SCN003", "SCN004", "SCN005"];

type GoldScnKey =
  | "SCN006" | "SCN007" | "SCN008"
  | "SCN009" | "SCN010" | "SCN011"
  | "SCN012" | "SCN013" | "SCN014"
  | "SCN015" | "SCN016" | "SCN017";

const GOLD_SCN_KEYS: GoldScnKey[] = [
  "SCN006", "SCN007", "SCN008",
  "SCN009", "SCN010", "SCN011",
  "SCN012", "SCN013", "SCN014",
  "SCN015", "SCN016", "SCN017",
];

const GOLD_SCN_LABELS: Record<GoldScnKey, { fr: string; en: string; threshold: string }> = {
  SCN006: { fr: "SCN-006 — M2 scénario 1", en: "SCN-006 — M2 scenario 1", threshold: "≥ 60/100" },
  SCN007: { fr: "SCN-007 — M2 scénario 2", en: "SCN-007 — M2 scenario 2", threshold: "≥ 60/100" },
  SCN008: { fr: "SCN-008 — M2 scénario 3", en: "SCN-008 — M2 scenario 3", threshold: "≥ 60/100" },
  SCN009: { fr: "SCN-009 — M3 scénario 1", en: "SCN-009 — M3 scenario 1", threshold: "≥ 70/100" },
  SCN010: { fr: "SCN-010 — M3 scénario 2", en: "SCN-010 — M3 scenario 2", threshold: "≥ 70/100" },
  SCN011: { fr: "SCN-011 — M3 scénario 3", en: "SCN-011 — M3 scenario 3", threshold: "≥ 70/100" },
  SCN012: { fr: "SCN-012 — M4 scénario 1", en: "SCN-012 — M4 scenario 1", threshold: "≥ 70/100" },
  SCN013: { fr: "SCN-013 — M4 scénario 2", en: "SCN-013 — M4 scenario 2", threshold: "≥ 70/100" },
  SCN014: { fr: "SCN-014 — M4 capstone BI", en: "SCN-014 — M4 BI capstone", threshold: "≥ 70/100" },
  SCN015: { fr: "SCN-015 — M5 cycle intégré", en: "SCN-015 — M5 integrated cycle", threshold: "≥ 70/100" },
  SCN016: { fr: "SCN-016 — M5 écart + ADJ", en: "SCN-016 — M5 variance + ADJ", threshold: "≥ 70/100" },
  SCN017: { fr: "SCN-017 — M5 capstone exécutif", en: "SCN-017 — M5 executive capstone", threshold: "≥ 70/100" },
};

function goldStatusBannerCopy(state: GoldCertState, t: (fr: string, en: string) => string) {
  switch (state) {
    case "AWARDED":
      return t(
        "Félicitations — Certification Gold TEC.LOG obtenue. Parcours intégré M1–M5 validé.",
        "Congratulations — TEC.LOG Gold certification awarded. Integrated M1–M5 pathway validated.",
      );
    case "ELIGIBLE":
      return t(
        "Toutes les exigences Gold sont remplies — vous êtes éligible à la certification TEC.LOG Gold.",
        "All Gold requirements are met — you are eligible for TEC.LOG Gold certification.",
      );
    case "IN_PROGRESS":
      return t(
        "Parcours Gold en cours — complétez les exigences ci-dessous (Silver + M2–M5 + Quiz M5).",
        "Gold pathway in progress — complete the requirements below (Silver + M2–M5 + Quiz M5).",
      );
    default:
      return t(
        "Obtenez d'abord la certification Silver pour débloquer le parcours Gold.",
        "Earn Silver certification first to unlock the Gold pathway.",
      );
  }
}

function statusBannerCopy(state: SilverCertState, t: (fr: string, en: string) => string) {
  switch (state) {
    case "obtenue":
      return t(
        "Félicitations — Certification Silver TEC.LOG obtenue. Votre parcours M1 est validé institutionnellement.",
        "Congratulations — TEC.LOG Silver certification obtained. Your M1 pathway is institutionally validated.",
      );
    case "eligible":
      return t(
        "Toutes les exigences Silver sont remplies — vous êtes éligible à la certification TEC.LOG.",
        "All Silver requirements are met — you are eligible for TEC.LOG certification.",
      );
    case "en_cours":
      return t(
        "Parcours Silver en cours — complétez les exigences ci-dessous pour devenir éligible.",
        "Silver pathway in progress — complete the requirements below to become eligible.",
      );
    default:
      return t(
        "Commencez le parcours Silver : quiz M1 puis scénarios SCN-001 à SCN-005 en mode Évaluation (≥ 60/100).",
        "Start the Silver pathway: M1 quiz then SCN-001 to SCN-005 scenarios in Evaluation mode (≥ 60/100).",
      );
  }
}

export function CertificationsPage() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();

  const { data: silverStatus, isLoading } = trpc.profiles.silverStatus.useQuery();
  const { data: goldStatus, isLoading: goldLoading } = trpc.profiles.goldStatus.useQuery();
  const { data: profile } = trpc.profiles.mine.useQuery();

  const quizPassed = silverStatus?.quizPassed ?? false;
  const scenariosCompleted = silverStatus?.scenariosCompleted;
  const complianceValidated = silverStatus?.complianceValidated ?? false;
  const noBlockers = silverStatus?.noBlockers ?? false;
  const silverEarned = silverStatus?.silverCertified ?? false;
  const silverEligible = silverStatus?.silverEligible ?? false;

  const scnCompletedCount = SCN_KEYS.filter((k) => scenariosCompleted?.[k]).length;
  const hasAnyProgress = quizPassed || scnCompletedCount > 0 || complianceValidated;

  const silverRequirements = [
    { id: "quiz", labelFr: "Quiz M1 réussi (≥ 60 %)", labelEn: "M1 quiz passed (≥ 60%)", met: quizPassed, action: () => navigate("/student/quiz/1"), actionFr: "Quiz M1", actionEn: "M1 quiz" },
    ...SCN_KEYS.map((key) => ({
      id: key,
      labelFr: SCN_LABELS[key].fr,
      labelEn: SCN_LABELS[key].en,
      subFr: "Évaluation ≥ 60/100",
      subEn: "Evaluation ≥ 60/100",
      met: scenariosCompleted?.[key] ?? false,
      action: () => navigate("/student/scenarios"),
      actionFr: "Scénarios",
      actionEn: "Scenarios",
    })),
    { id: "compliance", labelFr: "Conformité M1 validée", labelEn: "M1 compliance validated", met: complianceValidated, action: () => navigate("/student/scenarios"), actionFr: "Conformité", actionEn: "Compliance" },
    { id: "blockers", labelFr: "Aucun blocage non résolu", labelEn: "No unresolved blockers", met: noBlockers, action: () => navigate("/student/scenarios"), actionFr: "Résoudre", actionEn: "Resolve" },
  ];

  const metCount = silverRequirements.filter((r) => r.met).length;
  const progressPct = (metCount / silverRequirements.length) * 100;
  const allRequirementsMet = metCount === silverRequirements.length;
  const silverState = resolveSilverState({ silverEarned, silverEligible, hasAnyProgress, allRequirementsMet });
  const canPreviewCert = silverEarned || silverState === "eligible";
  const showSilverContinue = shouldShowSilverContinueButton(silverEarned, silverState);
  const silverContinuePath = resolveSilverContinuePath(quizPassed);
  const silverRegistryEntry = lookupSilverRegistryByStudentNumber(profile?.studentNumber ?? null);
  const activeSilverCredential =
    silverEarned && silverRegistryEntry?.status === "ACTIVE"
      ? lookupVerifiedCredentialByCertificateId(silverRegistryEntry.certificateId)
      : null;

  const goldState: GoldCertState = goldStatus?.state ?? "LOCKED";
  const goldEarned = goldStatus?.goldCertified ?? false;
  const goldLocked = goldState === "LOCKED";
  const complianceGoldMet =
    (goldStatus?.complianceValidated ?? false) && (goldStatus?.moduleCompliancePassed ?? false);
  const scn017Met = (goldStatus?.scn017CapstoneScore ?? false) && (goldStatus?.scn017DecisionLinked ?? false);

  const goldRequirements = [
    {
      id: "silver-pre",
      labelFr: "Silver obtenue (prérequis)",
      labelEn: "Silver obtained (prerequisite)",
      met: goldStatus?.silverPrerequisite ?? false,
      action: () => navigate("/student/certifications"),
      actionFr: "Silver",
      actionEn: "Silver",
    },
    {
      id: "quiz-m5",
      labelFr: "Quiz M5 réussi (≥ 60 %)",
      labelEn: "M5 quiz passed (≥ 60%)",
      met: goldStatus?.quizM5Passed ?? false,
      action: () => navigate("/student/quiz/5"),
      actionFr: "Quiz M5",
      actionEn: "M5 quiz",
    },
    ...GOLD_SCN_KEYS.map((key) => ({
      id: key,
      labelFr: GOLD_SCN_LABELS[key].fr,
      labelEn: GOLD_SCN_LABELS[key].en,
      subFr: `Évaluation ${GOLD_SCN_LABELS[key].threshold}`,
      subEn: `Evaluation ${GOLD_SCN_LABELS[key].threshold}`,
      met: goldStatus?.scenariosCompleted?.[key] ?? false,
      action: () => navigate(key <= "SCN008" ? "/student/module2" : key <= "SCN011" ? "/student/module3" : key <= "SCN014" ? "/student/module4" : "/student/module5"),
      actionFr: "Module",
      actionEn: "Module",
    })),
    {
      id: "compliance",
      labelFr: "Conformité M2–M5 validée",
      labelEn: "M2–M5 compliance validated",
      met: complianceGoldMet,
      action: () => navigate("/student/module5"),
      actionFr: "Conformité",
      actionEn: "Compliance",
    },
    {
      id: "blockers",
      labelFr: "Aucun blocage non résolu",
      labelEn: "No unresolved blockers",
      met: goldStatus?.noBlockers ?? false,
      action: () => navigate("/student/scenarios"),
      actionFr: "Résoudre",
      actionEn: "Resolve",
    },
    {
      id: "scn-016-seq",
      labelFr: "SCN-016 — écart corrigé avant KPI",
      labelEn: "SCN-016 — variance resolved before KPI",
      met: goldStatus?.scn016VarianceBeforeKpi ?? false,
      action: () => navigate("/student/module5"),
      actionFr: "M5",
      actionEn: "M5",
    },
    {
      id: "scn-017-cap",
      labelFr: "SCN-017 — capstone + décision KPI",
      labelEn: "SCN-017 — capstone + KPI-linked decision",
      met: scn017Met,
      action: () => navigate("/student/module5"),
      actionFr: "Capstone",
      actionEn: "Capstone",
    },
  ];

  const goldMetCount = goldStatus?.requirementsMetCount ?? goldRequirements.filter((r) => r.met).length;
  const goldProgressPct = goldStatus
    ? (goldMetCount / goldStatus.requirementsTotalCount) * 100
    : 0;
  const canPreviewGold = goldEarned || goldState === "ELIGIBLE";

  if (isLoading || goldLoading) {
    return (
      <FioriShell>
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-2 border-[#0070f2] border-t-transparent rounded-full animate-spin" />
        </div>
      </FioriShell>
    );
  }

  return (
    <FioriShell
      title={t("Mes Certifications", "My Certifications")}
      breadcrumbs={[
        { label: t("Accueil", "Home"), href: "/" },
        { label: t("Certifications", "Certifications") },
      ]}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Institutional header */}
        <div className="rounded-lg overflow-hidden border border-border shadow-sm">
          <div className="bg-[#0f2a44] text-white px-6 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Award size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold">{t("Certifications TEC.LOG", "TEC.LOG Certifications")}</h1>
                  <p className="text-sm text-white/70 mt-0.5">
                    {t("Collège de la Concorde · Montréal · Session 2025–2026", "Collège de la Concorde · Montreal · Session 2025–2026")}
                  </p>
                  <p className="text-xs text-white/55 mt-1">TEC.WMS · Operational Competency Credential</p>
                </div>
              </div>
              <SilverStatusChip state={silverState} />
            </div>
          </div>
        </div>

        {/* Silver pathway — primary */}
        <section className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-[auto_1fr] gap-0">
            {/* Badge column */}
            <div className="flex flex-col items-center justify-center p-6 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-950 border-b md:border-b-0 md:border-r border-border">
              <SilverBadgeSvg size={140} variant="full" />
              <p className="text-xs font-semibold text-muted-foreground mt-3 uppercase tracking-wider">Silver · M1</p>
              <p className="text-sm font-medium text-foreground text-center mt-1">TEC.LOG Fundamentals</p>
            </div>

            {/* Progress + checklist */}
            <div className="p-6 md:p-8 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-bold text-foreground">
                    {t("Parcours Silver — Module 1", "Silver Pathway — Module 1")}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {statusBannerCopy(silverState, t)}
                  </p>
                </div>
                <CertificationProgressRing pct={progressPct} accent="#64748b" />
              </div>

              <ul className="space-y-2">
                {silverRequirements.map((req) => (
                  <li
                    key={req.id}
                    className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                      req.met ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20" : "border-border bg-background"
                    }`}
                  >
                    {req.met ? (
                      <CheckCircle size={18} className="text-emerald-600 shrink-0" />
                    ) : (
                      <Circle size={18} className="text-muted-foreground shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${req.met ? "text-foreground" : "text-muted-foreground"}`}>
                        {t(req.labelFr, req.labelEn)}
                      </p>
                      {"subFr" in req && req.subFr && (
                        <p className="text-[10px] text-muted-foreground">{t(req.subFr, req.subEn!)}</p>
                      )}
                    </div>
                    {!req.met && (
                      <button type="button" onClick={req.action} className="text-xs font-semibold text-[#0070f2] hover:underline shrink-0 flex items-center gap-0.5">
                        {t(req.actionFr, req.actionEn)}
                        <ChevronRight size={12} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
                {activeSilverCredential && (
                  <CertificateCredentialActions
                    pdfUrl={activeSilverCredential.pdfUrl}
                    verificationUrl={activeSilverCredential.verificationUrl}
                    linkedinCredentialUrl={activeSilverCredential.linkedinCredentialUrl}
                    layout="certifications"
                  />
                )}
                {canPreviewCert && (
                  <Button onClick={() => navigate("/student/certifications/silver")} className="bg-[#0f2a44] hover:bg-[#0f2a44]/90">
                    {silverEarned
                      ? t("Voir mon certificat Silver", "View my Silver certificate")
                      : t("Aperçu du certificat (éligible)", "Certificate preview (eligible)")}
                  </Button>
                )}
                {showSilverContinue && (
                  <Button variant="outline" onClick={() => navigate(silverContinuePath)}>
                    {t("Continuer le parcours", "Continue pathway")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Gold pathway */}
        <section className={`rounded-xl border bg-card shadow-sm overflow-hidden relative ${goldLocked ? "border-dashed border-amber-300/60 bg-card/50" : "border-border"}`}>
          <div className="absolute top-4 right-4 z-10">
            <GoldStatusChip state={goldState} />
          </div>
          <div className={`grid md:grid-cols-[auto_1fr] gap-0 ${goldLocked ? "opacity-90" : ""}`}>
            <div className="flex flex-col items-center justify-center p-6 md:p-8 bg-gradient-to-br from-amber-50/80 to-yellow-50/50 dark:from-amber-950/30 dark:to-yellow-950/20 border-b md:border-b-0 md:border-r border-border">
              {goldEarned ? (
                <GoldBadgeSvg size={140} variant="full" />
              ) : goldLocked ? (
                <GoldBadgeLockedSvg size={130} />
              ) : (
                <GoldBadgeSvg size={140} variant="full" className="opacity-80" />
              )}
              <p className="text-xs font-semibold text-muted-foreground mt-3 uppercase tracking-wider">Gold · M1–M5</p>
              <p className="text-sm font-medium text-foreground text-center mt-1">TEC.LOG Integrated Operations</p>
            </div>
            <div className="p-6 md:p-8 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0 pr-16">
                  <h2 className="text-base font-bold text-foreground">
                    {t("Parcours Gold — M2 à M5", "Gold Pathway — M2 to M5")}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {goldStatusBannerCopy(goldState, t)}
                  </p>
                </div>
                {!goldLocked && (
                  <CertificationProgressRing pct={goldProgressPct} accent="#ca8a04" />
                )}
              </div>

              {!goldLocked ? (
                <>
                  <ul className="space-y-2">
                    {goldRequirements.map((req) => (
                      <li
                        key={req.id}
                        className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                          req.met ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20" : "border-border bg-background"
                        }`}
                      >
                        {req.met ? (
                          <CheckCircle size={18} className="text-emerald-600 shrink-0" />
                        ) : (
                          <Circle size={18} className="text-muted-foreground shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${req.met ? "text-foreground" : "text-muted-foreground"}`}>
                            {t(req.labelFr, req.labelEn)}
                          </p>
                          {"subFr" in req && req.subFr && (
                            <p className="text-[10px] text-muted-foreground">{t(req.subFr, req.subEn!)}</p>
                          )}
                        </div>
                        {!req.met && (
                          <button type="button" onClick={req.action} className="text-xs font-semibold text-[#0070f2] hover:underline shrink-0 flex items-center gap-0.5">
                            {t(req.actionFr, req.actionEn)}
                            <ChevronRight size={12} />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
                    {canPreviewGold && (
                      <Button onClick={() => navigate("/student/certifications/gold")} className="bg-amber-700 hover:bg-amber-800">
                        {goldEarned
                          ? t("Voir mon certificat Gold", "View my Gold certificate")
                          : t("Aperçu du certificat (éligible)", "Certificate preview (eligible)")}
                      </Button>
                    )}
                    {!goldEarned && goldState === "IN_PROGRESS" && (
                      <Button variant="outline" onClick={() => navigate("/student/module2")}>
                        {t("Continuer le parcours", "Continue pathway")}
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <ul className="text-xs text-muted-foreground space-y-1.5">
                  <li>· {t("Prérequis : Silver obtenue", "Prerequisite: Silver obtained")}</li>
                  <li>· {t("Modules M2–M5 + scénarios SCN-006–017 + Quiz M5", "Modules M2–M5 + SCN-006–017 scenarios + M5 quiz")}</li>
                  <li>· {t("Aperçu pédagogique — émission institutionnelle à venir (pas de QR)", "Pedagogical preview — institutional issuance coming later (no QR)")}</li>
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* Info strip */}
        <div className="rounded-lg border border-[#0070f2]/20 bg-[#0070f2]/5 px-4 py-3 flex items-start gap-3">
          <Info size={18} className="text-[#0070f2] shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/85 leading-relaxed">
            {t(
              "Silver = validation institutionnelle du Module 1 (quiz ≥ 60 % + SCN-001 à SCN-005 en Évaluation ≥ 60/100 + conformité). Le certificat officiel signé sera transmis par le Collège de la Concorde.",
              "Silver = institutional Module 1 validation (quiz ≥ 60% + SCN-001 to SCN-005 in Evaluation ≥ 60/100 + compliance). The official signed certificate will be issued by Collège de la Concorde.",
            )}
          </p>
        </div>
      </div>
    </FioriShell>
  );
}
