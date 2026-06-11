import { BookOpen, Layers, TrendingUp, BarChart2, FileText, type LucideIcon } from "lucide-react";

/** Shared module tokens — aligned with ScenarioList MODULE_CONFIG */
export const MODULE_SLIDE_THEME: Record<
  number,
  {
    accent: string;
    label: string;
    icon: LucideIcon;
    duration: string;
  }
> = {
  1: { accent: "#0070f2", label: "M1", icon: BookOpen, duration: "4h" },
  2: { accent: "#2563eb", label: "M2", icon: Layers, duration: "5h" },
  3: { accent: "#059669", label: "M3", icon: TrendingUp, duration: "5h" },
  4: { accent: "#d97706", label: "M4", icon: BarChart2, duration: "5h" },
  5: { accent: "#7b1fa2", label: "M5", icon: FileText, duration: "6h" },
};
