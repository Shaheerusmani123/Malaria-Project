import { cn } from "@/lib/utils";
import { Microscope, Loader2 } from "lucide-react";

interface AnalysisLoaderProps {
  progress?: number;
  status?: string;
  className?: string;
}

export function AnalysisLoader({
  progress = 0,
  status = "Analyzing...",
  className,
}: AnalysisLoaderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-6 py-12", className)}>
      {/* Animated Microscope */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full medical-gradient opacity-20 animate-ping" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full medical-gradient shadow-glow">
          <Microscope className="h-12 w-12 text-primary-foreground" />
        </div>
        {/* Scanning animation */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div className="absolute inset-x-0 h-1 bg-primary-foreground/50 scanning-line" />
        </div>
      </div>

      {/* Status Text */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="font-medium text-foreground">{status}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full medical-gradient transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
      </div>

      {/* Processing Steps */}
      <div className="flex gap-8 text-xs text-muted-foreground">
        <span className={cn(progress >= 20 && "text-primary font-medium")}>Loading</span>
        <span className={cn(progress >= 40 && "text-primary font-medium")}>Preprocessing</span>
        <span className={cn(progress >= 60 && "text-primary font-medium")}>Detecting</span>
        <span className={cn(progress >= 80 && "text-primary font-medium")}>Analyzing</span>
        <span className={cn(progress >= 100 && "text-success font-medium")}>Complete</span>
      </div>
    </div>
  );
}
