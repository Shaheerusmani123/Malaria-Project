import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FileUploader } from "@/components/FileUploader";
import { AnalysisLoader } from "@/components/AnalysisLoader";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  ChevronDown,
  Microscope,
  User,
  Play,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import {
  analyzeWithAI,
  saveToHistory,
  getHistory,
  AnalysisResult,
  PatientInfo,
  AnalysisHistoryItem,
} from "@/lib/analysis";

import sampleNegative from "@/assets/sample-negative.jpg";
import samplePositive from "@/assets/sample-positive.jpg";
import sampleComplex from "@/assets/sample-complex.jpg";

const DetectionPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing...");
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [patientInfoOpen, setPatientInfoOpen] = useState(false);
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({});
  const [recentHistory, setRecentHistory] = useState<AnalysisHistoryItem[]>([]);

  useEffect(() => {
    setRecentHistory(getHistory().slice(0, 3));
  }, [results]);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setResults(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileRemove = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResults(null);
  }, []);

  const handleSampleLoad = useCallback((sampleUrl: string, name: string) => {
    fetch(sampleUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], name, { type: "image/jpeg" });
        handleFileSelect(file);
      });
  }, [handleFileSelect]);

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile || !previewUrl) return;

    setIsAnalyzing(true);
    setProgress(0);
    setStatus("Loading image...");

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        
        const newProgress = prev + Math.random() * 15;
        
        if (newProgress < 25) setStatus("Loading image...");
        else if (newProgress < 50) setStatus("Preprocessing...");
        else if (newProgress < 75) setStatus("Detecting parasites...");
        else setStatus("Analyzing results...");
        
        return Math.min(newProgress, 95);
      });
    }, 200);

    try {
      const analysisResults = await analyzeWithAI(selectedFile);
      
      clearInterval(progressInterval);
      setProgress(100);
      setStatus("Complete!");
      
      setTimeout(() => {
        setResults(analysisResults);
        setIsAnalyzing(false);
      }, 500);

    } catch (error) {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing the image. Please try again.",
        variant: "destructive",
      });
    }
  }, [selectedFile, previewUrl]);

  const handleSave = useCallback(() => {
    if (!results || !previewUrl) return;
    
    saveToHistory(previewUrl, results, patientInfo);
    setRecentHistory(getHistory().slice(0, 3));
    
    toast({
      title: "Result Saved",
      description: "Analysis has been saved to your history.",
    });
  }, [results, previewUrl, patientInfo]);

  const handleNewAnalysis = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResults(null);
    setPatientInfo({});
    setProgress(0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl medical-gradient">
                <Microscope className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold">Malaria Detection System</h1>
                <p className="text-sm text-muted-foreground">Upload a blood smear image to analyze</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left Column - Upload & Controls */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upload Zone */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="text-lg">Upload Image</CardTitle>
                  <CardDescription>
                    Upload a blood smear image for analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUploader
                    onFileSelect={handleFileSelect}
                    onFileRemove={handleFileRemove}
                    selectedFile={selectedFile}
                    previewUrl={previewUrl}
                  />

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4">
                    <Button
                      variant="medical"
                      size="lg"
                      className="flex-1"
                      disabled={!selectedFile || isAnalyzing}
                      onClick={handleAnalyze}
                    >
                      <Play className="h-4 w-4" />
                      {isAnalyzing ? "Analyzing..." : "Analyze Image"}
                    </Button>
                    {selectedFile && (
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={handleFileRemove}
                        disabled={isAnalyzing}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Patient Info */}
              <Card variant="default">
                <Collapsible open={patientInfoOpen} onOpenChange={setPatientInfoOpen}>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-base">Patient Details (Optional)</CardTitle>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${patientInfoOpen ? "rotate-180" : ""}`} />
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="patientId">Patient ID</Label>
                          <Input
                            id="patientId"
                            placeholder="Enter ID"
                            value={patientInfo.patientId || ""}
                            onChange={(e) => setPatientInfo({ ...patientInfo, patientId: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="age">Age</Label>
                          <Input
                            id="age"
                            type="number"
                            placeholder="Age"
                            value={patientInfo.age || ""}
                            onChange={(e) => setPatientInfo({ ...patientInfo, age: parseInt(e.target.value) || undefined })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select
                          value={patientInfo.gender || ""}
                          onValueChange={(value) => setPatientInfo({ ...patientInfo, gender: value as PatientInfo["gender"] })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          placeholder="Additional notes..."
                          value={patientInfo.notes || ""}
                          onChange={(e) => setPatientInfo({ ...patientInfo, notes: e.target.value })}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        This data stays local and is not uploaded.
                      </p>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Sample Images */}
              <Card variant="default">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    Try Sample Images
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { src: samplePositive, name: "sample-positive.jpg", label: "Positive" },
                      { src: sampleNegative, name: "sample-negative.jpg", label: "Negative" },
                      { src: sampleComplex, name: "sample-complex.jpg", label: "Complex" },
                    ].map((sample) => (
                      <button
                        key={sample.name}
                        onClick={() => handleSampleLoad(sample.src, sample.name)}
                        className="relative group rounded-lg overflow-hidden border hover:border-primary transition-colors"
                        disabled={isAnalyzing}
                      >
                        <img
                          src={sample.src}
                          alt={sample.label}
                          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Badge
                          className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          variant="secondary"
                        >
                          {sample.label}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent History */}
              {recentHistory.length > 0 && (
                <Card variant="default">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">Recent Analyses</CardTitle>
                    <Link to="/history">
                      <Button variant="ghost" size="sm">View All</Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {recentHistory.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <img
                            src={item.imageData}
                            alt="Analysis"
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <Badge
                              variant={
                                item.results.prediction === "positive"
                                  ? "danger"
                                  : item.results.prediction === "negative"
                                  ? "success"
                                  : "warning"
                              }
                              className="text-xs"
                            >
                              {item.results.prediction}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(item.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="text-sm font-medium">
                            {item.results.confidence.toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Results */}
            <div className="lg:col-span-3">
              {isAnalyzing ? (
                <Card variant="elevated" className="h-full flex items-center justify-center min-h-[500px]">
                  <AnalysisLoader progress={progress} status={status} />
                </Card>
              ) : results && previewUrl ? (
                <ResultsDisplay
                  results={results}
                  imageUrl={previewUrl}
                  onSave={handleSave}
                  onNewAnalysis={handleNewAnalysis}
                />
              ) : (
                <Card variant="elevated" className="h-full flex flex-col items-center justify-center min-h-[500px] text-center p-8">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted mb-6">
                    <Microscope className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">
                    Upload a Blood Smear Image
                  </h3>
                  <p className="text-muted-foreground max-w-md mb-6">
                    Upload a blood smear microscopy image to begin AI-powered malaria detection analysis.
                    The system will identify parasites and provide detailed results.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline">Supported: JPG, PNG, TIFF</Badge>
                    <Badge variant="outline">Max size: 10MB</Badge>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DetectionPage;
