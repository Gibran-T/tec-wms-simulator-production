import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

const STORAGE_KEY = "wms_selected_cohort";

type CohortRow = { id: number; name: string };

type CohortContextType = {
  cohorts: CohortRow[];
  selectedCohortId: number | null;
  selectedCohort: CohortRow | null;
  setSelectedCohortId: (id: number) => void;
  isReady: boolean;
  isTeacher: boolean;
};

const CohortContext = createContext<CohortContextType | undefined>(undefined);

function pickDefaultCohort(cohorts: CohortRow[]): number | null {
  if (cohorts.length === 0) return null;
  const fondatrice = cohorts.find((c) => /fondatrice/i.test(c.name));
  return fondatrice?.id ?? cohorts[0].id;
}

export function CohortProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const isTeacher = user?.role === "teacher" || user?.role === "admin";
  const utils = trpc.useUtils();

  const { data: cohorts = [], isLoading } = trpc.cohorts.list.useQuery(undefined, {
    enabled: isAuthenticated && isTeacher,
  });

  const [selectedCohortId, setSelectedCohortIdState] = useState<number | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? Number(stored) : null;
  });

  useEffect(() => {
    if (!isTeacher || isLoading) return;
    if (cohorts.length === 0) {
      setSelectedCohortIdState(null);
      return;
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    const storedId = stored ? Number(stored) : null;
    if (storedId && cohorts.some((c) => c.id === storedId)) {
      setSelectedCohortIdState(storedId);
      return;
    }
    setSelectedCohortIdState(pickDefaultCohort(cohorts));
  }, [cohorts, isLoading, isTeacher]);

  const setSelectedCohortId = useCallback(
    (id: number) => {
      setSelectedCohortIdState(id);
      localStorage.setItem(STORAGE_KEY, String(id));
      void utils.invalidate();
    },
    [utils],
  );

  const selectedCohort = useMemo(
    () => cohorts.find((c) => c.id === selectedCohortId) ?? null,
    [cohorts, selectedCohortId],
  );

  const isReady = !isTeacher || (!isLoading && (cohorts.length === 0 || selectedCohortId != null));

  return (
    <CohortContext.Provider
      value={{
        cohorts,
        selectedCohortId,
        selectedCohort,
        setSelectedCohortId,
        isReady,
        isTeacher,
      }}
    >
      {children}
    </CohortContext.Provider>
  );
}

export function useCohort() {
  const ctx = useContext(CohortContext);
  if (!ctx) throw new Error("useCohort must be used within CohortProvider");
  return ctx;
}
