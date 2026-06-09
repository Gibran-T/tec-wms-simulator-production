import { useEffect } from "react";
import { useParams, useLocation } from "wouter";

/** Legacy M2 putaway URL → unified StepForm PUTAWAY path */
export default function M2PutawayRedirect() {
  const params = useParams<{ runId: string }>();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (params.runId) {
      navigate(`/student/run/${params.runId}/step/putaway`);
    } else {
      navigate("/student/module2");
    }
  }, [params.runId, navigate]);

  return (
    <div className="flex items-center justify-center min-h-[40vh] text-muted-foreground text-sm">
      Redirection vers le rangement structuré…
    </div>
  );
}
