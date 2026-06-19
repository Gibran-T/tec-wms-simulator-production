/** Module-aware personalized recommendations for Run Report (display-only — no scoring impact). */

const M4_NEXT_SCN: Record<string, string | null> = {
  "SCN-012": "SCN-013",
  "SCN-013": "SCN-014",
  "SCN-014": null,
};

const M5_NEXT_SCN: Record<string, string | null> = {
  "SCN-015": "SCN-016",
  "SCN-016": "SCN-017",
  "SCN-017": null,
};

export function buildRunReportRecommendations(input: {
  moduleId: number;
  scnCode: string | null;
  errorEventTypes: string[];
  complianceCompliant: boolean;
  errorCount: number;
}): string[] {
  const errorTypes = new Set(input.errorEventTypes);
  const recommendations: string[] = [];

  if (errorTypes.has("OUT_OF_SEQUENCE"))
    recommendations.push("Mémorisez le flux complet : ME21N → MIGO(→REC) → LT0A(REC→STOCK) → VA01 → VL01N(STOCK→EXP) → VL02N(→EXP) → MI01");
  if (errorTypes.has("NEGATIVE_STOCK_ATTEMPT"))
    recommendations.push("Avant chaque GI, vérifiez le stock disponible en zone STOCKAGE (MB52). Si insuffisant, créez d'abord une PO et postez la GR.");
  if (errorTypes.has("UNPOSTED_TX_LEFT"))
    recommendations.push("Adoptez le réflexe \"créer + poster\" : ne quittez jamais une étape sans poster la transaction");
  if (errorTypes.has("UNRESOLVED_VARIANCE"))
    recommendations.push("Après MI01/MI04, toujours finaliser avec MI07 (validation des écarts) avant la conformité");
  if (errorTypes.has("WRONG_ZONE_GR") || errorTypes.has("WRONG_ZONE_PUTAWAY"))
    recommendations.push("Flux de réception : MIGO → emplacement REC-01/REC-02, puis LT0A pour ranger en zone STOCKAGE (B-01, A-01, etc.)");
  if (errorTypes.has("WRONG_ZONE_PICKING") || errorTypes.has("WRONG_ZONE_GI"))
    recommendations.push("Flux d'expédition : VL01N pour prélever du STOCKAGE vers EXP-01/EXP-02, puis VL02N pour poster la GI depuis le quai d'expédition");
  if (errorTypes.has("CAPACITY_OVERFLOW"))
    recommendations.push("En cas de dépassement de capacité, répartissez la quantité sur plusieurs bins STOCKAGE plutôt que de forcer un seul emplacement");
  if (!input.complianceCompliant)
    recommendations.push("Relancez la simulation en Mode Démonstration pour explorer librement les étapes sans pénalité");

  if (recommendations.length === 0 && input.errorCount === 0) {
    recommendations.push(resolveSuccessRecommendation(input.moduleId, input.scnCode));
  }

  return recommendations;
}

function resolveSuccessRecommendation(moduleId: number, scnCode: string | null): string {
  if (moduleId === 4) {
    const next = scnCode ? M4_NEXT_SCN[scnCode] : null;
    if (next) {
      return `Excellente maîtrise M4 ! Poursuivez avec ${next} pour approfondir l'analyse KPI multi-contextes.`;
    }
    return "Excellente maîtrise M4 ! Passez au Module 5 (SCN-015) pour le cycle intégré Peak Week et la décision stratégique.";
  }
  if (moduleId === 5) {
    const next = scnCode ? M5_NEXT_SCN[scnCode] : null;
    if (next) {
      return `Excellente maîtrise M5 ! Enchaînez avec ${next} pour compléter le parcours Peak Week.`;
    }
    return "Excellente maîtrise M5 ! Consultez votre parcours Gold TEC.LOG et finalisez votre certification intégrée.";
  }
  if (moduleId === 2) {
    return "Excellente maîtrise M2 ! Passez au Module 3 pour l'inventaire cyclique et le réapprovisionnement.";
  }
  if (moduleId === 3) {
    return "Excellente maîtrise M3 ! Passez au Module 4 pour l'analyse KPI et le diagnostic stratégique.";
  }
  return "Excellente maîtrise du flux complet ! Passez au Module 2 pour approfondir FIFO, gestion de lots et traçabilité.";
}
