import type { StakeholderRef } from "../enterpriseBriefing";

/** Customer registry — Enterprise Universe Part V */
export const CUSTOMER_REGISTRY: Record<string, StakeholderRef> = {
  "C-NORD": {
    code: "C-NORD",
    name: "NordPack Inc.",
    industry: "Industrial packaging",
    slaProfile: { fr: "OTIF ≥ 96 % · confirmation avant 14 h", en: "OTIF ≥ 96% · confirmation by 14:00" },
  },
  "C-LAUR": {
    code: "C-LAUR",
    name: "Laurentian Foods",
    industry: "Food ingredients distribution",
    slaProfile: { fr: "FIFO max 90 jours · traçabilité lot", en: "FIFO max 90 days · lot traceability" },
  },
  "C-ARTQ": {
    code: "C-ARTQ",
    name: "Artisan Québécois Co-op",
    industry: "Specialty retail supply",
    slaProfile: { fr: "OTIF ≥ 94 % · variabilité saisonnière", en: "OTIF ≥ 94% · seasonal variability" },
  },
  "C-TECH": {
    code: "C-TECH",
    name: "TechnoFab Montréal",
    industry: "Light manufacturing",
    slaProfile: { fr: "Risque arrêt de ligne · SKU critique 24 h", en: "Line-stop risk · 24h critical SKU" },
  },
  "C-MTQ": {
    code: "C-MTQ",
    name: "Ministère des Transports (contrat)",
    industry: "Public infrastructure",
    slaProfile: { fr: "OTIF ≥ 92 % en semaine de pointe", en: "OTIF ≥ 92% during Peak Week" },
  },
  "C-PAPI": {
    code: "C-PAPI",
    name: "Papeterie des Cantons",
    industry: "Office supplies wholesale",
    slaProfile: { fr: "B2B standard · scorecard mensuel", en: "Standard B2B · monthly scorecard" },
  },
};

/** Supplier registry — Enterprise Universe Part VI */
export const SUPPLIER_REGISTRY: Record<string, StakeholderRef> = {
  "S-STLA": {
    code: "S-STLA",
    name: "St-Laurent Components",
    industry: "Industrial components",
    slaProfile: { fr: "Délai 3–5 jours · fiable", en: "3–5 day lead time · reliable" },
  },
  "S-GLAC": {
    code: "S-GLAC",
    name: "Grands Lacs Industrial",
    industry: "Bulk industrial supply",
    slaProfile: { fr: "Délai 7–10 jours · contraintes MOQ", en: "7–10 day lead time · MOQ constraints" },
  },
  "S-AGRO": {
    code: "S-AGRO",
    name: "AgroSource Québec",
    industry: "Food-grade ingredients",
    slaProfile: { fr: "Délai 4–6 jours · certification lot", en: "4–6 day lead time · lot certified" },
  },
  "S-PACK": {
    code: "S-PACK",
    name: "Emballages Richelieu",
    industry: "Corrugated and film",
    slaProfile: { fr: "Délai 5–7 jours · saisonnalité", en: "5–7 day lead time · seasonal stretch" },
  },
  "S-GLOB": {
    code: "S-GLOB",
    name: "Global Parts Ltd.",
    industry: "Long-lead components",
    slaProfile: { fr: "Délai 14–21 jours · option air freight", en: "14–21 day lead time · air freight option" },
  },
};
