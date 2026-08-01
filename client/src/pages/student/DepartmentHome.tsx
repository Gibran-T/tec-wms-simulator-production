import { useMemo, useState, useEffect } from "react";
import { useLocation } from "wouter";
import FioriShell from "@/components/FioriShell";
import EnterpriseHeader from "@/components/enterprise/EnterpriseHeader";
import EmployeeIdentityCard from "@/components/enterprise/EmployeeIdentityCard";
import EmployeeOrgStrip from "@/components/enterprise/EmployeeOrgStrip";
import CareerChapterPanel from "@/components/enterprise/CareerChapterPanel";
import CurrentAssignmentCard from "@/components/enterprise/CurrentAssignmentCard";
import DepartmentQueue from "@/components/enterprise/DepartmentQueue";
import ModeSelectionScreen from "./ModeSelectionScreen";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEmployeeProfile } from "@/hooks/useEmployeeProfile";
import { trpc } from "@/lib/trpc";
import { filterCanonicalScenariosForModule, resolveScenarioScnCode } from "@/lib/scenarioCatalog";
import { resolveM5ModuleScenariosForActor } from "@/lib/m5DocEntry";
import { isDepartmentHomeEnabled } from "@/lib/departmentHome";
import { isConcordeConnectEnabled } from "@/lib/concordeConnect";
import { getDepartmentLabel } from "@shared/enterprise/departmentNavigation";
import { getScenarioBinding } from "@shared/enterprise/scenarioBinding";
import { Loader2 } from "lucide-react";

/** RC21-B.3 — Department-first student home (Department → Assignment Queue → Mission) */
export default function DepartmentHome() {
  const [, navigate] = useLocation();
  const { t, language } = useLanguage();
  const lang = language === "FR" ? "FR" : "EN";

  useEffect(() => {
    if (!isConcordeConnectEnabled()) {
      navigate("/student/scenarios", { replace: true });
      return;
    }
    if (!isDepartmentHomeEnabled()) {
      navigate("/student/connect", { replace: true });
    }
  }, [navigate]);

  const { data: profile, isLoading: profileLoading } = useEmployeeProfile();
  const { data: scenarios, isLoading: scenariosLoading } = trpc.scenarios.list.useQuery();
  const { data: m5DocAccess } = trpc.m5Doc.myAccess.useQuery(undefined, { retry: false });
  const { data: myRuns } = trpc.runs.myRunsEnriched.useQuery();
  const [pendingScenario, setPendingScenario] = useState<{
    id: number;
    name: string;
    difficulty?: string;
  } | null>(null);

  const activeModuleId = profile?.careerChapter.moduleId ?? 1;
  const homeDepartment = profile?.department.code ?? "WH";

  const rawModuleScenarios = useMemo(
    () => (scenarios ?? []).filter((s) => s.moduleId === activeModuleId),
    [scenarios, activeModuleId],
  );

  const moduleScenarios = useMemo(() => {
    if (activeModuleId === 5) {
      return resolveM5ModuleScenariosForActor(scenarios ?? [], {
        docFeatureEnabled: m5DocAccess?.featureEnabled === true,
        studentAllowlisted: m5DocAccess?.allowlisted === true,
      });
    }
    return filterCanonicalScenariosForModule(activeModuleId, scenarios ?? []);
  }, [scenarios, activeModuleId, m5DocAccess?.featureEnabled, m5DocAccess?.allowlisted]);

  const headerBinding = useMemo(() => {
    const scn = profile?.currentAssignment.scnCode;
    if (scn) return getScenarioBinding(scn);
    const first = moduleScenarios[0];
    const firstScn = first ? resolveScenarioScnCode(first) : null;
    return firstScn ? getScenarioBinding(firstScn) : undefined;
  }, [profile, moduleScenarios]);

  if (pendingScenario) {
    return (
      <ModeSelectionScreen
        scenarioId={pendingScenario.id}
        scenarioName={pendingScenario.name}
        scenarioDifficulty={pendingScenario.difficulty}
        moduleId={activeModuleId}
        onCancel={() => setPendingScenario(null)}
      />
    );
  }

  const deptLabel = getDepartmentLabel(homeDepartment, lang);
  const headerScnCode =
    profile?.currentAssignment.scnCode ?? headerBinding?.scnCode ?? "SCN-001";
  const headerDepartment = profile?.department.code ?? headerBinding?.department ?? "WH";
  const headerPriority = headerBinding?.priority ?? "normal";

  return (
    <FioriShell
      title={t("Accueil département", "Department home")}
      breadcrumbs={[
        { label: t("Concorde Logistics", "Concorde Logistics"), href: "/student/department" },
        { label: deptLabel },
      ]}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {profileLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
            <Loader2 size={20} className="animate-spin" />
            {t("Chargement de votre département...", "Loading your department...")}
          </div>
        ) : profile ? (
          <>
            <EnterpriseHeader
              scnCode={headerScnCode}
              department={headerDepartment}
              priority={headerPriority}
              moduleId={activeModuleId}
              language={lang}
              t={t}
              accentMode="department"
              footerNote={t(
                "Votre identité professionnelle est définie par votre département d'affectation — les missions suivent la file opérationnelle.",
                "Your professional identity is defined by your home department — missions follow the operational queue.",
              )}
            />

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <EmployeeIdentityCard
                  profile={profile}
                  language={lang}
                  t={t}
                  layout="connect"
                  hideInlineAssignment
                />
                <EmployeeOrgStrip profile={profile} language={lang} t={t} />
                <CareerChapterPanel profile={profile} language={lang} t={t} />
              </div>
              <div>
                <CurrentAssignmentCard
                  assignment={profile.currentAssignment}
                  language={lang}
                  t={t}
                />
              </div>
            </div>

            <DepartmentQueue
              moduleId={activeModuleId}
              homeDepartment={homeDepartment}
              moduleScenarios={moduleScenarios}
              rawModuleScenarios={rawModuleScenarios}
              myRuns={myRuns}
              isLoading={scenariosLoading}
              scope="chapter"
              onStartScenario={setPendingScenario}
            />
          </>
        ) : (
          <p className="text-center text-muted-foreground py-12">
            {t("Impossible de charger le profil employé.", "Unable to load employee profile.")}
          </p>
        )}
      </div>
    </FioriShell>
  );
}
