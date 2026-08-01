/**
 * Versioned DOC scenario definitions.
 * Inserted by seed only when ENABLE_M5_DOC_SUPERVISION=true.
 * Never rewrites ops-ledger SCN-015/016/017.
 */

import type { M5DocInitialStateJson } from "../../shared/m5Doc/types";
import { M5_DOC_INTERACTION_MODEL } from "../../shared/m5Doc/types";

export const M5_DOC_SCENARIO_DEFS = [
  {
    name: "M5-DOC — SCN-015-DOC : Ouvrir et superviser une demande",
    scnCode: "SCN-015-DOC" as const,
    descriptionFr:
      "Profil documentaire supervision-doc-v1 — ouvrir et superviser une demande opérationnelle (quart de clôture).",
    descriptionEn: "Documentary supervision profile — open and supervise an operational demand.",
    difficulty: "moyen" as const,
    initialStateJson: {
      interactionModel: M5_DOC_INTERACTION_MODEL,
      scnCode: "SCN-015-DOC",
      module: 5,
      context: "Quart de clôture — D-143 chargement porte 143",
    } satisfies M5DocInitialStateJson,
  },
  {
    name: "M5-DOC — SCN-016-DOC : Traiter un écart opérationnel",
    scnCode: "SCN-016-DOC" as const,
    descriptionFr:
      "Profil documentaire supervision-doc-v1 — traiter un écart/incident (continuité de mission).",
    descriptionEn: "Documentary supervision profile — handle an operational gap/incident.",
    difficulty: "difficile" as const,
    initialStateJson: {
      interactionModel: M5_DOC_INTERACTION_MODEL,
      scnCode: "SCN-016-DOC",
      module: 5,
      context: "Même quart — écart température E-144",
    } satisfies M5DocInitialStateJson,
  },
  {
    name: "M5-DOC — SCN-017-DOC : Arbitrer et préparer la clôture",
    scnCode: "SCN-017-DOC" as const,
    descriptionFr:
      "Profil documentaire supervision-doc-v1 — arbitrer trois demandes et préparer le handover.",
    descriptionEn: "Documentary supervision profile — arbitrate three demands and prepare handover.",
    difficulty: "difficile" as const,
    initialStateJson: {
      interactionModel: M5_DOC_INTERACTION_MODEL,
      scnCode: "SCN-017-DOC",
      module: 5,
      context: "Arbitrage D-117 / D-143 / D-144 puis handover",
    } satisfies M5DocInitialStateJson,
  },
];
