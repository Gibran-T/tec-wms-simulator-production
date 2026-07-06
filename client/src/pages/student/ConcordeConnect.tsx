import { useMemo, useState, useEffect } from "react";
import { useLocation } from "wouter";
import FioriShell from "@/components/FioriShell";
import EnterpriseHeader from "@/components/enterprise/EnterpriseHeader";
import MissionBoard from "@/components/enterprise/MissionBoard";
import AssignmentQueue from "@/components/enterprise/AssignmentQueue";
import TodayPriorities from "@/components/enterprise/TodayPriorities";
import EmployeeIdentityCard from "@/components/enterprise/EmployeeIdentityCard";
import ModulePathwayNav from "@/components/ModulePathwayNav";
import ModeSelectionScreen from "./ModeSelectionScreen";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEmployeeProfile } from "@/hooks/useEmployeeProfile";
import { trpc } from "@/lib/trpc";
import { filterCanonicalScenariosForModule, resolveScenarioScnCode } from "@/lib/scenarioCatalog";
import { isConcordeConnectEnabled } from "@/lib/concordeConnect";
import { isDepartmentHomeEnabled } from "@/lib/departmentHome";
import { isEnterpriseAssignmentsEnabled } from "@/lib/enterpriseExperience";
import { getScenarioBinding } from "@shared/enterprise/scenarioBinding";
import { Loader2 } from "lucide-react";

export default function ConcordeConnect() {
  const [, navigate] = useLocation();
  const { t, language } = useLanguage();

  useEffect(() => {
    if (!isConcordeConnectEnabled()) {
      navigate("/student/scenarios", { replace: true });
      return;
    }
    if (isDepartmentHomeEnabled()) {
      navigate("/student/department", { replace: true });
    }
  }, [navigate]);
  const { data: profile, isLoading: profileLoading } = useEmployeeProfile();
  const { data: scenarios, isLoading: scenariosLoading } = trpc.scenarios.list.useQuery();
  const { data: myRuns } = trpc.runs.myRunsEnriched.useQuery();
  const [pendingScenario, setPendingScenario] = useState<{ id: number; name: string; difficulty?: string } | null>(null);

  const activeModuleId = profile?.careerChapter.moduleId ?? 1;

  const rawModuleScenarios = useMemo(
    () => (scenarios ?? []).filter((s) => s.moduleId === activeModuleId),
    [scenarios, activeModuleId]
  );

  const moduleScenarios = useMemo(
    () => filterCanonicalScenariosForModule(activeModuleId, scenarios ?? []),
    [scenarios, activeModuleId]
  );

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

  const scnCode =
    profile?.currentAssignment.scnCode ??
    headerBinding?.scnCode ??
    "SCN-001";

  const assignmentsEnabled = isEnterpriseAssignmentsEnabled();

  return (
    <FioriShell
      title={
        assignmentsEnabled
          ? t("Concorde Connect — Tableau de bord", "Concorde Connect — Company dashboard")
          : t("Concorde Connect", "Concorde Connect")
      }
      breadcrumbs={[
        { label: t("Concorde Logistics", "Concorde Logistics"), href: "/student/connect" },
        { label: t("Portail employé", "Employee portal") },
      ]}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {profileLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
            <Loader2 size={20} className="animate-spin" />
            {t("Chargement de votre affectation...", "Loading your assignment...")}
          </div>
        ) : profile ? (
          <>
            {headerBinding && (
              <EnterpriseHeader
                scnCode={scnCode}
                department={headerBinding.department}
                priority={headerBinding.priority}
                moduleId={activeModuleId}
                language={language}
                t={t}
                compact
              />
            )}

            <EmployeeIdentityCard
              profile={profile}
              language={language}
              t={t}
              layout="connect"
              hideInlineAssignment={assignmentsEnabled}
            />

            <ModulePathwayNav activeModuleId={activeModuleId} />

            {assignmentsEnabled ? (
              <>
                <TodayPriorities
                  profile={profile}
                  moduleId={activeModuleId}
                  moduleScenarios={moduleScenarios}
                  rawModuleScenarios={rawModuleScenarios}
                  myRuns={myRuns}
                  language={language}
                  t={t}
                  onStartScenario={setPendingScenario}
                />
                <AssignmentQueue
                  moduleId={activeModuleId}
                  moduleScenarios={moduleScenarios}
                  rawModuleScenarios={rawModuleScenarios}
                  myRuns={myRuns}
                  isLoading={scenariosLoading}
                  groupBy="department"
                  onStartScenario={setPendingScenario}
                />
              </>
            ) : (
              <MissionBoard
                moduleId={activeModuleId}
                moduleScenarios={moduleScenarios}
                rawModuleScenarios={rawModuleScenarios}
                myRuns={myRuns}
                isLoading={scenariosLoading}
                enterpriseStyled
                title={t("Tableau de missions — affectations ouvertes", "Mission board — open assignments")}
                onStartScenario={setPendingScenario}
              />
            )}
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
