import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, HelpCircle } from "lucide-react";

interface DetectionBadgeProps {
  prediction: "positive" | "negative" | "uncertain";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function DetectionBadge({
  prediction,
  size = "md",
  className,
}: DetectionBadgeProps) {
  const config = {
    positive: {
      variant: "danger" as const,
      icon: AlertTriangle,
      text: "MALARIA DETECTED",
      bgClass: "bg-danger",
    },
    negative: {
      variant: "success" as const,
      icon: CheckCircle2,
      text: "NO MALARIA DETECTED",
      bgClass: "bg-success",
    },
    uncertain: {
      variant: "warning" as const,
      icon: HelpCircle,
      text: "MANUAL REVIEW NEEDED",
      bgClass: "bg-warning",
    },
  };

  const { icon: Icon, text, bgClass } = config[prediction];

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full font-bold text-primary-foreground shadow-lg",
        bgClass,
        sizeStyles[size],
        className
      )}
    >
      <Icon className={iconSizes[size]} />
      <span>{text}</span>
    </div>
  );
}
