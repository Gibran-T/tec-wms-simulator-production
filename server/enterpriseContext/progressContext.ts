import type { ContextBlock, StudentProgressContextBlock } from "../../shared/enterpriseContext/types";

export interface ProgressSnapshot {
  modulesCompleted: number[];
  silverCertified: boolean;
  goldEligible: boolean;
  goldCertified: boolean;
  attemptCount: number;
}

export function buildStudentProgressContext(
  snapshot: ProgressSnapshot
): ContextBlock<StudentProgressContextBlock> {
  return {
    blockId: "studentProgress",
    sensitivity: "medium",
    data: {
      modulesCompleted: snapshot.modulesCompleted,
      certificationStatus: {
        silverCertified: snapshot.silverCertified,
        goldEligible: snapshot.goldEligible,
        goldCertified: snapshot.goldCertified,
      },
      attemptCount: snapshot.attemptCount,
    },
  };
}
