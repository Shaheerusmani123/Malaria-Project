import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subValue?: string;
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  subValue,
  variant = "default",
  className,
}: MetricCardProps) {
  const variantStyles = {
    default: "bg-card border-border",
    success: "bg-success-light border-success/20",
    warning: "bg-warning-light border-warning/20",
    danger: "bg-danger-light border-danger/20",
  };

  const iconStyles = {
    default: "text-primary",
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border p-4 transition-all duration-200 hover:shadow-md",
        variantStyles[variant],
        className
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-lg bg-background/50",
          iconStyles[variant]
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-xl font-bold font-display">{value}</p>
        {subValue && (
          <p className="text-xs text-muted-foreground">{subValue}</p>
        )}
      </div>
    </div>
  );
}
