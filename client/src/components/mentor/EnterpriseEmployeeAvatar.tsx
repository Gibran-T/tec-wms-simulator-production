import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type EnterpriseEmployeeAvatarProps = {
  name: string;
  initials: string;
  title: string;
  department: string;
  size?: "sm" | "md";
};

export default function EnterpriseEmployeeAvatar({
  name,
  initials,
  title,
  department,
  size = "md",
}: EnterpriseEmployeeAvatarProps) {
  const dimension = size === "sm" ? "h-8 w-8 text-[10px]" : "h-12 w-12 text-xs";

  return (
    <div className="flex items-center gap-3 min-w-0">
      <Avatar className={`${dimension} shrink-0 border border-primary/20 bg-primary/5`}>
        <AvatarFallback className="bg-primary/10 font-bold text-primary">{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className={`font-bold truncate ${size === "sm" ? "text-[11px]" : "text-sm"}`}>{name}</p>
        <p className={`text-muted-foreground truncate ${size === "sm" ? "text-[9px]" : "text-[10px]"}`}>
          {title}
        </p>
        <p className={`text-muted-foreground uppercase tracking-wide truncate ${size === "sm" ? "text-[8px]" : "text-[9px]"}`}>
          {department}
        </p>
      </div>
    </div>
  );
}
