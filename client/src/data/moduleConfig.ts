import {
  BookOpen, BarChart2, Layers, TrendingUp, FileText, type LucideIcon,
} from "lucide-react";

export interface ModuleObjective {
  fr: string;
  en: string;
}

export interface ModuleConfigEntry {
  id: number;
  icon: LucideIcon;
  color: string;
  bg: string;
  text: string;
  border: string;
  accentBg: string;
  titleFr: string;
  titleEn: string;
  descFr: string;
  descEn: string;
  durationH: number;
  passThreshold: number;
  route: string;
  slidesRoute: string;
  steps: string[];
  objectives: ModuleObjective[];
}

export const MODULE_CONFIG: ModuleConfigEntry[] = [
  {
    id: 1,
    icon: BookOpen,
    color: "#0070f2",
    bg: "bg-[#e8f0fe]",
    text: "text-[#0070f2]",
    border: "border-[#0070f2]/30",
    accentBg: "bg-[#0070f2]",
    titleFr: "Fondements de la chaîne logistique et intégration ERP/WMS",
    titleEn: "Supply Chain Foundations & ERP/WMS Integration",
    descFr: "Maîtrisez le cycle complet PO→GR→Stock→SO→GI→Cycle Count→Conformité",
    descEn: "Master the complete cycle PO→GR→Stock→SO→GI→Cycle Count→Compliance",
    durationH: 4,
    passThreshold: 60,
    route: "/student/scenarios",
    slidesRoute: "/student/slides/1",
    steps: ["PO", "GR", "STOCK", "SO", "GI", "CC", "COMPLIANCE"],
    objectives: [
      { fr: "Comprendre les flux logistiques PO→GR→SO→GI", en: "Understand logistics flows PO→GR→SO→GI" },
      { fr: "Maîtriser la création de commandes dans le WMS", en: "Master order creation in the WMS" },
      { fr: "Valider les réceptions et gérer les stocks", en: "Validate receipts and manage inventory" },
      { fr: "Effectuer un Cycle Count et finaliser la conformité", en: "Perform a Cycle Count and finalize compliance" },
    ],
  },
  {
    id: 2,
    icon: Layers,
    color: "#2563eb",
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-300",
    accentBg: "bg-blue-600",
    titleFr: "Exécution d'entrepôt et gestion des emplacements",
    titleEn: "Warehouse Execution & Location Management",
    descFr: "Rangement structuré · Capacité bin · FIFO · Précision inventaire",
    descEn: "Structured putaway · Bin capacity · FIFO · Inventory accuracy",
    durationH: 5,
    passThreshold: 60,
    route: "/student/module2",
    slidesRoute: "/student/slides/2",
    steps: ["RÉCEPTION", "PUTAWAY", "BIN CAPACITY", "FIFO", "INVENTAIRE"],
    objectives: [
      { fr: "Exécuter un rangement structuré depuis le quai", en: "Execute structured putaway from the dock" },
      { fr: "Valider les limites de capacité par emplacement", en: "Validate bin capacity limits" },
      { fr: "Respecter la règle FIFO (premier entré, premier sorti)", en: "Apply FIFO rule (first in, first out)" },
      { fr: "Contrôler la précision de l'inventaire système vs physique", en: "Control system vs physical inventory accuracy" },
    ],
  },
  {
    id: 3,
    icon: TrendingUp,
    color: "#059669",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-300",
    accentBg: "bg-emerald-600",
    titleFr: "Contrôle des stocks et réapprovisionnement",
    titleEn: "Inventory Control & Replenishment",
    descFr: "Inventaire cyclique · Écarts · Ajustements · Min/Max · Stock de sécurité",
    descEn: "Cycle counting · Variances · Adjustments · Min/Max · Safety stock",
    durationH: 5,
    passThreshold: 70,
    route: "/student/module3",
    slidesRoute: "/student/slides/3",
    steps: ["CYCLE COUNT", "VARIANCE", "AJUSTEMENT", "RÉAPPRO", "VALIDATION"],
    objectives: [
      { fr: "Réaliser un inventaire cyclique complet", en: "Perform a complete cycle count" },
      { fr: "Analyser et justifier les écarts de stock", en: "Analyze and justify stock variances" },
      { fr: "Générer des suggestions de réapprovisionnement", en: "Generate replenishment suggestions" },
      { fr: "Valider les ajustements avec votre superviseur", en: "Validate adjustments with your supervisor" },
    ],
  },
  {
    id: 4,
    icon: BarChart2,
    color: "#d97706",
    bg: "bg-orange-50",
    text: "text-orange-600",
    border: "border-orange-300",
    accentBg: "bg-orange-600",
    titleFr: "Indicateurs de performance logistique",
    titleEn: "Logistics Performance Indicators",
    descFr: "Rotation · Taux de service · Taux d'erreur · Lead time · Diagnostic KPI",
    descEn: "Turnover · Service rate · Error rate · Lead time · KPI diagnostics",
    durationH: 5,
    passThreshold: 70,
    route: "/student/module4",
    slidesRoute: "/student/slides/4",
    steps: ["KPI CALCUL", "ROTATION", "TAUX SERVICE", "LEAD TIME", "DIAGNOSTIC"],
    objectives: [
      { fr: "Calculer les KPI logistiques clés (OTIF, Fill Rate, DSI)", en: "Calculate key logistics KPIs (OTIF, Fill Rate, DSI)" },
      { fr: "Analyser la rotation des stocks et le lead time", en: "Analyze stock turnover and lead time" },
      { fr: "Identifier les causes racines des écarts de performance", en: "Identify root causes of performance gaps" },
      { fr: "Proposer des actions correctives basées sur les données", en: "Propose data-driven corrective actions" },
    ],
  },
  {
    id: 5,
    icon: FileText,
    color: "#7b1fa2",
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-300",
    accentBg: "bg-purple-600",
    titleFr: "Simulation opérationnelle intégrée",
    titleEn: "Integrated Operational Simulation",
    descFr: "Réception · Rangement FIFO · Inventaire · Réapprovisionnement · KPI · Décision",
    descEn: "Reception · FIFO putaway · Inventory · Replenishment · KPI · Decision",
    durationH: 6,
    passThreshold: 70,
    route: "/student/module5",
    slidesRoute: "/student/slides/5",
    steps: ["RÉCEPTION", "RANGEMENT", "INVENTAIRE", "RÉAPPRO", "KPI", "DÉCISION"],
    objectives: [
      { fr: "Exécuter un cycle complet de bout en bout", en: "Execute a complete end-to-end cycle" },
      { fr: "Gérer des situations de crise (rupture, erreur, retard)", en: "Manage crisis situations (stockout, error, delay)" },
      { fr: "Analyser les KPI en temps réel et prendre des décisions", en: "Analyze real-time KPIs and make decisions" },
      { fr: "Démontrer la maîtrise globale du système WMS", en: "Demonstrate overall WMS system mastery" },
    ],
  },
];

export const MODULE_ACRONYMS = [
  { code: "PO", fr: "Purchase Order — Bon de commande fournisseur", en: "Purchase Order — Supplier order document" },
  { code: "GR", fr: "Goods Receipt — Réception de marchandises", en: "Goods Receipt — Receiving goods into the system" },
  { code: "SO", fr: "Sales Order — Commande client", en: "Sales Order — Customer order document" },
  { code: "GI", fr: "Goods Issue — Sortie de stock", en: "Goods Issue — Issuing goods from stock" },
  { code: "CC", fr: "Cycle Count — Inventaire cyclique", en: "Cycle Count — Periodic physical inventory check" },
  { code: "FIFO", fr: "First In, First Out — Premier entré, premier sorti", en: "First In, First Out — oldest stock leaves first" },
  { code: "KPI", fr: "Key Performance Indicator — Indicateur clé de performance", en: "Key Performance Indicator — performance metric" },
  { code: "WMS", fr: "Warehouse Management System — Système de gestion d'entrepôt", en: "Warehouse Management System — warehouse software" },
  { code: "ERP", fr: "Enterprise Resource Planning — Progiciel de gestion intégré", en: "Enterprise Resource Planning — integrated business software" },
];

export function getModuleConfig(moduleId: number): ModuleConfigEntry {
  const mod = MODULE_CONFIG.find((m) => m.id === moduleId);
  if (!mod) throw new Error(`Unknown module id: ${moduleId}`);
  return mod;
}
