import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardList,
  BarChart2,
  Settings,
  MonitorPlay,
  Presentation,
  UserCircle,
  ShieldCheck,
  TrendingUp,
  UserCog,
  BookMarked,
  ClipboardCheck,
  ListChecks,
} from "lucide-react";

export type ShellNavItem = {
  href: string;
  labelFr: string;
  labelEn: string;
  icon: LucideIcon;
  /** Higher = keep visible longer when space is tight */
  priority: number;
  roles: Array<"student" | "teacher" | "admin">;
};

/**
 * Declarative shell destinations shared by student/teacher.
 * Priority drives overflow ("More") packing — not zoom-dependent layout.
 */
export const SHELL_NAV_ITEMS: ShellNavItem[] = [
  // Teacher
  { href: "/teacher", labelFr: "Tableau de bord", labelEn: "Dashboard", icon: LayoutDashboard, priority: 100, roles: ["teacher", "admin"] },
  { href: "/teacher/cohorts", labelFr: "Cohortes", labelEn: "Cohorts", icon: Users, priority: 95, roles: ["teacher", "admin"] },
  { href: "/teacher/exercices", labelFr: "Exercices", labelEn: "Exercises", icon: ListChecks, priority: 92, roles: ["teacher", "admin"] },
  { href: "/teacher/students", labelFr: "Étudiants", labelEn: "Students", icon: UserCog, priority: 90, roles: ["teacher", "admin"] },
  { href: "/teacher/evaluations", labelFr: "Évaluations", labelEn: "Assessments", icon: ClipboardCheck, priority: 85, roles: ["teacher", "admin"] },
  { href: "/teacher/monitor", labelFr: "Monitoring", labelEn: "Monitoring", icon: BarChart2, priority: 80, roles: ["teacher", "admin"] },
  { href: "/teacher/scenarios", labelFr: "Scénarios", labelEn: "Scenarios", icon: BookOpen, priority: 70, roles: ["teacher", "admin"] },
  { href: "/teacher/assignments", labelFr: "Assignments", labelEn: "Assignments", icon: ClipboardList, priority: 65, roles: ["teacher", "admin"] },
  { href: "/teacher/analytics", labelFr: "Analytics", labelEn: "Analytics", icon: TrendingUp, priority: 60, roles: ["teacher", "admin"] },
  // Student (hrefs resolved at render for studentHome)
  { href: "__student_home__", labelFr: "Accueil", labelEn: "Home", icon: MonitorPlay, priority: 100, roles: ["student"] },
  { href: "/student/profile", labelFr: "Profil professionnel", labelEn: "Professional profile", icon: UserCircle, priority: 90, roles: ["student"] },
  { href: "/student/slides", labelFr: "Slides", labelEn: "Slides", icon: Presentation, priority: 85, roles: ["student"] },
  { href: "/student/glossary", labelFr: "Glossaire", labelEn: "Glossary", icon: BookMarked, priority: 80, roles: ["student"] },
  { href: "/student/evaluations", labelFr: "Évaluations", labelEn: "Assessments", icon: ClipboardCheck, priority: 75, roles: ["student"] },
  { href: "/student/certifications", labelFr: "Certification", labelEn: "Certification", icon: ShieldCheck, priority: 70, roles: ["student"] },
  { href: "/admin", labelFr: "Administration", labelEn: "Administration", icon: Settings, priority: 40, roles: ["admin"] },
];

/** Approx icon slot width including gap (px) — used by overflow packing. */
export const NAV_ICON_SLOT_PX = 34;

/**
 * How many highest-priority icons fit in the bar.
 * Reserves one slot for the Plus control when not everything fits.
 */
export function computeVisibleNavCount(
  availableWidthPx: number,
  itemCount: number,
  slotPx: number = NAV_ICON_SLOT_PX,
): number {
  if (itemCount <= 0) return 0;
  const maxWithoutMore = Math.max(1, Math.floor(availableWidthPx / slotPx));
  if (itemCount <= maxWithoutMore) return itemCount;
  return Math.min(itemCount, Math.max(1, maxWithoutMore - 1));
}
