import { cn } from "@/lib/utils";

interface ConfidenceMeterProps {
  value: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export function ConfidenceMeter({
  value,
  size = "md",
  showLabel = true,
  animated = true,
  className,
}: ConfidenceMeterProps) {
  const getColor = () => {
    if (value >= 90) return "text-success";
    if (value >= 70) return "text-warning";
    return "text-danger";
  };

  const getStrokeColor = () => {
    if (value >= 90) return "stroke-success";
    if (value >= 70) return "stroke-warning";
    return "stroke-danger";
  };

  const sizeConfig = {
    sm: { size: 60, strokeWidth: 4, fontSize: "text-sm" },
    md: { size: 100, strokeWidth: 6, fontSize: "text-xl" },
    lg: { size: 140, strokeWidth: 8, fontSize: "text-3xl" },
  };

  const config = sizeConfig[size];
  const radius = (config.size - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={config.size}
        height={config.size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={config.size / 2}
          cy={config.size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          className="text-muted/30"
        />
        {/* Progress circle */}
        <circle
          cx={config.size / 2}
          cy={config.size / 2}
          r={radius}
          fill="none"
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          className={cn(getStrokeColor(), animated && "transition-all duration-1000 ease-out")}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: animated ? offset : 0,
          }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-bold font-display", config.fontSize, getColor())}>
            {value.toFixed(1)}%
          </span>
          <span className="text-xs text-muted-foreground">Confidence</span>
        </div>
      )}
    </div>
  );
}
