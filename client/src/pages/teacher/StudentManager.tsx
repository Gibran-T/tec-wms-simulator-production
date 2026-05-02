/**
 * StudentManager — Professional educator-grade student account management
 * Teacher can: create accounts, include/exclude students, reset passwords,
 * assign cohorts, add notes, and search/filter the student roster.
 */
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import FioriShell from "@/components/FioriShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  UserPlus,
  Search,
  Users,
  CheckCircle2,
  XCircle,
  KeyRound,
  StickyNote,
  UserCheck,
  UserX,
  Filter,
  RefreshCw,
  GraduationCap,
  Mail,
  Clock,
  Loader2,
} from "lucide-react";

type Student = {
  id: number;
  name: string | null;
  email: string | null;
  role: string;
  isActive: boolean;
  notes: string | null;
  loginMethod: string | null;
  lastSignedIn: Date;
  createdAt: Date;
  cohortId: number | null;
  studentNumber: string | null;
};

export default function StudentManager() {
  const { t } = useLanguage();
  const utils = trpc.useUtils();

  // Filters
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [filterCohort, setFilterCohort] = useState<string>("all");

  // Dialogs
  const [createOpen, setCreateOpen] = useState(false);
  const [resetPwdOpen, setResetPwdOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newCohortId, setNewCohortId] = useState<string>("");
  const [newPwd, setNewPwd] = useState("");
  const [noteText, setNoteText] = useState("");

  // Data
  const { data: students = [], isLoading, refetch } = trpc.students.list.useQuery({ includeAll: false });
  const { data: cohorts = [] } = trpc.cohorts.list.useQuery();

  // Mutations
  const createMutation = trpc.students.create.useMutation({
    onSuccess: () => {
      toast.success(t("Compte étudiant créé avec succès", "Student account created successfully"));
      utils.students.list.invalidate();
      setCreateOpen(false);
      setNewName(""); setNewEmail(""); setNewPassword(""); setNewCohortId("");
    },
    onError: (e) => toast.error(e.message),
  });

  const setActiveMutation = trpc.students.setActive.useMutation({
    onSuccess: (_, vars) => {
      toast.success(vars.isActive
        ? t("Étudiant inclus dans le cours", "Student included in the course")
        : t("Étudiant exclu du cours", "Student excluded from the course")
      );
      utils.students.list.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const resetPwdMutation = trpc.students.resetPassword.useMutation({
    onSuccess: () => {
      toast.success(t("Mot de passe réinitialisé", "Password reset successfully"));
      setResetPwdOpen(false);
      setNewPwd("");
    },
    onError: (e) => toast.error(e.message),
  });

  const notesMutation = trpc.students.updateNotes.useMutation({
    onSuccess: () => {
      toast.success(t("Notes sauvegardées", "Notes saved"));
      utils.students.list.invalidate();
      setNotesOpen(false);
    },
    onError: (e) => toast.error(e.message),
  });

  const assignCohortMutation = trpc.students.assignCohort.useMutation({
    onSuccess: () => {
      toast.success(t("Cohorte assignée", "Cohort assigned"));
      utils.students.list.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  // Filtered list
  const filtered = useMemo(() => {
    return (students as Student[]).filter((s) => {
      const matchSearch =
        !search ||
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && s.isActive) ||
        (filterStatus === "inactive" && !s.isActive);
      const matchCohort =
        filterCohort === "all" ||
        String(s.cohortId ?? "none") === filterCohort;
      return matchSearch && matchStatus && matchCohort;
    });
  }, [students, search, filterStatus, filterCohort]);

  const activeCount = (students as Student[]).filter((s) => s.isActive).length;
  const inactiveCount = (students as Student[]).filter((s) => !s.isActive).length;

  const formatDate = (d: Date | null | undefined) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString(t("fr-CA", "en-CA"), { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <FioriShell title={t("Gestion des étudiants", "Student Management")} breadcrumbs={[
      { label: t("Tableau de bord", "Dashboard"), href: "/teacher" },
      { label: t("Étudiants", "Students") },
    ]}>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">

        {/* ── KPI Banner ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              icon: Users,
              label: t("Total inscrits", "Total enrolled"),
              value: (students as Student[]).length,
              color: "text-blue-600 dark:text-blue-400",
              bg: "bg-blue-50 dark:bg-blue-950/40",
            },
            {
              icon: UserCheck,
              label: t("Actifs", "Active"),
              value: activeCount,
              color: "text-emerald-600 dark:text-emerald-400",
              bg: "bg-emerald-50 dark:bg-emerald-950/40",
            },
            {
              icon: UserX,
              label: t("Exclus", "Excluded"),
              value: inactiveCount,
              color: "text-rose-600 dark:text-rose-400",
              bg: "bg-rose-50 dark:bg-rose-950/40",
            },
            {
              icon: GraduationCap,
              label: t("Cohortes", "Cohorts"),
              value: cohorts.length,
              color: "text-violet-600 dark:text-violet-400",
              bg: "bg-violet-50 dark:bg-violet-950/40",
            },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className={`rounded-xl border border-border p-4 flex items-center gap-3 ${bg}`}>
              <div className={`w-10 h-10 rounded-lg bg-white/60 dark:bg-black/20 flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Toolbar ────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t("Rechercher un étudiant...", "Search student...")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-56"
              />
            </div>

            {/* Status filter */}
            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
              <SelectTrigger className="w-36">
                <Filter className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("Tous", "All")}</SelectItem>
                <SelectItem value="active">{t("Actifs", "Active")}</SelectItem>
                <SelectItem value="inactive">{t("Exclus", "Excluded")}</SelectItem>
              </SelectContent>
            </Select>

            {/* Cohort filter */}
            <Select value={filterCohort} onValueChange={setFilterCohort}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={t("Cohorte", "Cohort")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("Toutes les cohortes", "All cohorts")}</SelectItem>
                <SelectItem value="none">{t("Sans cohorte", "No cohort")}</SelectItem>
                {cohorts.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="ghost" size="icon" onClick={() => refetch()} title={t("Actualiser", "Refresh")}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          <Button onClick={() => setCreateOpen(true)} className="gap-2">
            <UserPlus className="w-4 h-4" />
            {t("Ajouter un étudiant", "Add Student")}
          </Button>
        </div>

        {/* ── Student Table ──────────────────────────────────────────── */}
        <div className="rounded-xl border border-border overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold text-xs uppercase tracking-wide">{t("Étudiant", "Student")}</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide hidden md:table-cell">{t("Email", "Email")}</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide hidden lg:table-cell">{t("Cohorte", "Cohort")}</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide hidden xl:table-cell">{t("Dernière connexion", "Last login")}</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-center">{t("Statut", "Status")}</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-right">{t("Actions", "Actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                    {t("Chargement...", "Loading...")}
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <GraduationCap className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground font-medium">
                      {search || filterStatus !== "all" || filterCohort !== "all"
                        ? t("Aucun étudiant ne correspond aux filtres", "No students match the filters")
                        : t("Aucun étudiant inscrit. Cliquez sur « Ajouter un étudiant » pour commencer.", "No students enrolled. Click \"Add Student\" to get started.")}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((student) => {
                  const cohort = cohorts.find((c) => c.id === student.cohortId);
                  const initials = (student.name || student.email || "?")
                    .split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
                  return (
                    <TableRow key={student.id} className={!student.isActive ? "opacity-60 bg-muted/20" : ""}>
                      {/* Name + avatar */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${student.isActive ? "bg-primary" : "bg-muted-foreground"}`}>
                            {initials}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-foreground">{student.name || "—"}</p>
                            {student.notes && (
                              <p className="text-xs text-muted-foreground truncate max-w-[160px]" title={student.notes}>
                                📝 {student.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Email */}
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate max-w-[200px]">{student.email || "—"}</span>
                        </div>
                      </TableCell>

                      {/* Cohort */}
                      <TableCell className="hidden lg:table-cell">
                        <Select
                          value={String(student.cohortId ?? "none")}
                          onValueChange={(v) => assignCohortMutation.mutate({
                            userId: student.id,
                            cohortId: v === "none" ? null : Number(v),
                          })}
                        >
                          <SelectTrigger className="h-7 text-xs w-36 border-dashed">
                            <SelectValue placeholder={t("Aucune", "None")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">{t("Sans cohorte", "No cohort")}</SelectItem>
                            {cohorts.map((c) => (
                              <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>

                      {/* Last login */}
                      <TableCell className="hidden xl:table-cell">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDate(student.lastSignedIn)}
                        </div>
                      </TableCell>

                      {/* Status badge */}
                      <TableCell className="text-center">
                        {student.isActive ? (
                          <Badge variant="outline" className="border-emerald-500 text-emerald-600 dark:text-emerald-400 gap-1 text-xs">
                            <CheckCircle2 className="w-3 h-3" />
                            {t("Actif", "Active")}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-rose-500 text-rose-600 dark:text-rose-400 gap-1 text-xs">
                            <XCircle className="w-3 h-3" />
                            {t("Exclu", "Excluded")}
                          </Badge>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Include / Exclude toggle */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 ${student.isActive ? "text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30" : "text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"}`}
                            title={student.isActive ? t("Exclure du cours", "Exclude from course") : t("Inclure dans le cours", "Include in course")}
                            onClick={() => setActiveMutation.mutate({ userId: student.id, isActive: !student.isActive })}
                            disabled={setActiveMutation.isPending}
                          >
                            {student.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </Button>

                          {/* Reset password */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            title={t("Réinitialiser le mot de passe", "Reset password")}
                            onClick={() => { setSelectedStudent(student); setNewPwd(""); setResetPwdOpen(true); }}
                          >
                            <KeyRound className="w-4 h-4" />
                          </Button>

                          {/* Notes */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            title={t("Ajouter une note", "Add note")}
                            onClick={() => { setSelectedStudent(student); setNoteText(student.notes || ""); setNotesOpen(true); }}
                          >
                            <StickyNote className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* ── Create Student Dialog ──────────────────────────────────── */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                {t("Créer un compte étudiant", "Create Student Account")}
              </DialogTitle>
              <DialogDescription>
                {t(
                  "L'étudiant pourra se connecter avec cet email et ce mot de passe.",
                  "The student will be able to log in with this email and password."
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label>{t("Nom complet", "Full name")} *</Label>
                <Input
                  placeholder={t("Prénom Nom", "First Last")}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>{t("Adresse email", "Email address")} *</Label>
                <Input
                  type="email"
                  placeholder="etudiant@concordia.ca"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>{t("Mot de passe initial", "Initial password")} *</Label>
                <Input
                  type="text"
                  placeholder={t("6 caractères minimum", "6 characters minimum")}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {t("Communiquez ce mot de passe à l'étudiant. Il pourra le changer.", "Share this password with the student. They can change it.")}
                </p>
              </div>
              <div className="space-y-1.5">
                <Label>{t("Cohorte", "Cohort")} ({t("optionnel", "optional")})</Label>
                <Select value={newCohortId} onValueChange={setNewCohortId}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("Sélectionner une cohorte", "Select a cohort")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t("Aucune cohorte", "No cohort")}</SelectItem>
                    {cohorts.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>{t("Annuler", "Cancel")}</Button>
              <Button
                onClick={() => createMutation.mutate({
                  name: newName,
                  email: newEmail,
                  password: newPassword,
                  cohortId: newCohortId && newCohortId !== "none" ? Number(newCohortId) : undefined,
                })}
                disabled={!newName || !newEmail || !newPassword || createMutation.isPending}
              >
                {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {t("Créer le compte", "Create Account")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ── Reset Password Dialog ──────────────────────────────────── */}
        <Dialog open={resetPwdOpen} onOpenChange={setResetPwdOpen}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-500" />
                {t("Réinitialiser le mot de passe", "Reset Password")}
              </DialogTitle>
              <DialogDescription>
                {selectedStudent?.name} — {selectedStudent?.email}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <Label>{t("Nouveau mot de passe", "New password")}</Label>
              <Input
                type="text"
                placeholder={t("6 caractères minimum", "6 characters minimum")}
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setResetPwdOpen(false)}>{t("Annuler", "Cancel")}</Button>
              <Button
                onClick={() => selectedStudent && resetPwdMutation.mutate({ userId: selectedStudent.id, newPassword: newPwd })}
                disabled={newPwd.length < 6 || resetPwdMutation.isPending}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                {resetPwdMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {t("Réinitialiser", "Reset")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ── Notes Dialog ───────────────────────────────────────────── */}
        <Dialog open={notesOpen} onOpenChange={setNotesOpen}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <StickyNote className="w-5 h-5 text-violet-500" />
                {t("Notes sur l'étudiant", "Student Notes")}
              </DialogTitle>
              <DialogDescription>
                {selectedStudent?.name} — {selectedStudent?.email}
              </DialogDescription>
            </DialogHeader>
            <div className="py-2">
              <Textarea
                placeholder={t("Observations, difficultés, points forts...", "Observations, difficulties, strengths...")}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNotesOpen(false)}>{t("Annuler", "Cancel")}</Button>
              <Button
                onClick={() => selectedStudent && notesMutation.mutate({ userId: selectedStudent.id, notes: noteText })}
                disabled={notesMutation.isPending}
              >
                {notesMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {t("Sauvegarder", "Save")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </FioriShell>
  );
}
