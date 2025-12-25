import { AnalysisResult } from "@/lib/analysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetectionBadge } from "@/components/DetectionBadge";
import { ConfidenceMeter } from "@/components/ConfidenceMeter";
import { MetricCard } from "@/components/MetricCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  AlertCircle, 
  Clock, 
  Download, 
  FileText, 
  Microscope, 
  RefreshCw, 
  Save, 
  Share2,
  Target,
  Stethoscope
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultsDisplayProps {
  results: AnalysisResult;
  imageUrl: string;
  onSave: () => void;
  onNewAnalysis: () => void;
  className?: string;
}

export function ResultsDisplay({
  results,
  imageUrl,
  onSave,
  onNewAnalysis,
  className,
}: ResultsDisplayProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "text-danger";
      case "moderate": return "text-warning";
      default: return "text-success";
    }
  };

  const getSeverityWidth = (severity: string) => {
    switch (severity) {
      case "high": return "100%";
      case "moderate": return "66%";
      default: return "33%";
    }
  };

  const recommendations = results.prediction === "positive"
    ? [
        "Immediate medical attention recommended",
        "Confirm with microscopy examination",
        "Start treatment protocol",
      ]
    : results.prediction === "uncertain"
    ? [
        "Manual microscopy review recommended",
        "Consider re-sampling if image quality is low",
        "Monitor patient symptoms closely",
      ]
    : [
        "No parasites detected in this sample",
        "Consider clinical symptoms",
        "Repeat test if symptoms persist",
      ];

  return (
    <div className={cn("space-y-6 fade-in", className)}>
      {/* Primary Result Card */}
      <Card variant="elevated" className="overflow-hidden">
        <div className={cn(
          "p-6",
          results.prediction === "positive" && "bg-gradient-to-r from-danger/10 to-transparent",
          results.prediction === "negative" && "bg-gradient-to-r from-success/10 to-transparent",
          results.prediction === "uncertain" && "bg-gradient-to-r from-warning/10 to-transparent"
        )}>
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <DetectionBadge prediction={results.prediction} size="lg" />
            
            <div className="flex-1 text-center lg:text-left">
              <p className="text-sm text-muted-foreground">Analysis completed in {results.processingTime}s</p>
            </div>
            
            <ConfidenceMeter value={results.confidence} size="lg" />
          </div>
        </div>
      </Card>

      {/* Image Analysis */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Microscope className="h-5 w-5 text-primary" />
            Visual Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative rounded-lg overflow-hidden border">
              <img src={imageUrl} alt="Original" className="w-full aspect-square object-cover" />
              <Badge className="absolute top-2 left-2" variant="secondary">Original</Badge>
            </div>
            <div className="relative rounded-lg overflow-hidden border">
              <img src={imageUrl} alt="Analyzed" className="w-full aspect-square object-cover" />
              {/* Overlay bounding boxes */}
              <svg className="absolute inset-0 w-full h-full">
                {results.boundingBoxes.map((box, i) => (
                  <g key={i}>
                    <rect
                      x={`${(box.x / 500) * 100}%`}
                      y={`${(box.y / 500) * 100}%`}
                      width={`${(box.width / 500) * 100}%`}
                      height={`${(box.height / 500) * 100}%`}
                      fill="none"
                      stroke="hsl(var(--danger))"
                      strokeWidth="2"
                      rx="4"
                    />
                    <circle
                      cx={`${((box.x + box.width / 2) / 500) * 100}%`}
                      cy={`${((box.y - 8) / 500) * 100}%`}
                      r="3"
                      fill="hsl(var(--danger))"
                    />
                  </g>
                ))}
              </svg>
              <Badge className="absolute top-2 left-2" variant="medical">Analyzed</Badge>
              {results.parasitesDetected > 0 && (
                <Badge className="absolute top-2 right-2" variant="danger">
                  {results.parasitesDetected} detected
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Findings */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Target}
          label="Parasites Detected"
          value={results.parasitesDetected}
          variant={results.parasitesDetected > 0 ? "danger" : "success"}
        />
        <MetricCard
          icon={Activity}
          label="Infection Rate"
          value={`${results.infectionRate}%`}
          subValue={`${results.infectedCells} of ${results.cellsAnalyzed} cells`}
        />
        <MetricCard
          icon={Microscope}
          label="Cells Analyzed"
          value={results.cellsAnalyzed.toLocaleString()}
        />
        <MetricCard
          icon={Clock}
          label="Processing Time"
          value={`${results.processingTime}s`}
        />
      </div>

      {/* Parasite Stages */}
      {results.parasitesDetected > 0 && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="text-lg">Parasite Stage Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Ring Stage", count: results.parasiteStages.ring, color: "bg-primary" },
                { name: "Trophozoite", count: results.parasiteStages.trophozoite, color: "bg-accent" },
                { name: "Schizont", count: results.parasiteStages.schizont, color: "bg-danger" },
              ].map((stage) => (
                <div key={stage.name} className="flex items-center gap-4">
                  <span className="w-28 text-sm text-muted-foreground">{stage.name}</span>
                  <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", stage.color)}
                      style={{ width: `${(stage.count / results.parasitesDetected) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 text-sm font-medium">{stage.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Severity Gauge */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="text-lg">Infection Severity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Severity Level</span>
              <span className={cn("font-bold capitalize", getSeverityColor(results.severity))}>
                {results.severity}
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  results.severity === "high" && "bg-danger",
                  results.severity === "moderate" && "bg-warning",
                  results.severity === "low" && "bg-success"
                )}
                style={{ width: getSeverityWidth(results.severity) }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low (&lt;5)</span>
              <span>Moderate (5-15)</span>
              <span>High (&gt;15)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card variant={results.prediction === "positive" ? "danger" : results.prediction === "uncertain" ? "warning" : "success"}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Stethoscope className="h-5 w-5" />
            Clinical Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span className="text-sm">{rec}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground border-t pt-4">
            ⚠️ Disclaimer: This is an AI-assisted tool. Always confirm with clinical diagnosis.
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button variant="medical" size="lg" onClick={onSave}>
          <Save className="h-4 w-4" />
          Save Result
        </Button>
        <Button variant="outline" size="lg">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
        <Button variant="outline" size="lg">
          <FileText className="h-4 w-4" />
          Export Image
        </Button>
        <Button variant="outline" size="lg">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
        <Button variant="secondary" size="lg" onClick={onNewAnalysis}>
          <RefreshCw className="h-4 w-4" />
          Analyze Another
        </Button>
      </div>
    </div>
  );
}
