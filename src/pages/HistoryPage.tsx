import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ConfidenceMeter } from "@/components/ConfidenceMeter";
import { DetectionBadge } from "@/components/DetectionBadge";
import { toast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Search,
  Trash2,
  Eye,
  Calendar,
  FolderOpen,
  Microscope,
  Upload,
} from "lucide-react";
import {
  getHistory,
  deleteFromHistory,
  clearHistory,
  AnalysisHistoryItem,
} from "@/lib/analysis";

const HistoryPage = () => {
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<AnalysisHistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPrediction, setFilterPrediction] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [selectedItem, setSelectedItem] = useState<AnalysisHistoryItem | null>(null);

  useEffect(() => {
    const data = getHistory();
    setHistory(data);
    setFilteredHistory(data);
  }, []);

  useEffect(() => {
    let filtered = [...history];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.patientInfo?.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by prediction
    if (filterPrediction !== "all") {
      filtered = filtered.filter((item) => item.results.prediction === filterPrediction);
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      
      if (sortOrder === "newest") return dateB - dateA;
      if (sortOrder === "oldest") return dateA - dateB;
      if (sortOrder === "confidence") return b.results.confidence - a.results.confidence;
      return 0;
    });

    setFilteredHistory(filtered);
  }, [history, searchTerm, filterPrediction, sortOrder]);

  const handleDelete = (id: string) => {
    deleteFromHistory(id);
    setHistory(getHistory());
    toast({
      title: "Analysis Deleted",
      description: "The analysis has been removed from history.",
    });
  };

  const handleClearAll = () => {
    clearHistory();
    setHistory([]);
    toast({
      title: "History Cleared",
      description: "All analyses have been removed.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="font-display text-2xl font-bold">Analysis History</h1>
                <p className="text-sm text-muted-foreground">
                  All data stored locally on your device
                </p>
              </div>
            </div>

            {history.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear all history?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. All analysis history will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearAll}>Delete All</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          {/* Filters */}
          {history.length > 0 && (
            <Card variant="elevated" className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by Patient ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterPrediction} onValueChange={setFilterPrediction}>
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue placeholder="Filter by result" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Results</SelectItem>
                      <SelectItem value="positive">Positive</SelectItem>
                      <SelectItem value="negative">Negative</SelectItem>
                      <SelectItem value="uncertain">Uncertain</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Most Recent</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="confidence">Confidence</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {filteredHistory.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredHistory.map((item) => (
                <Card
                  key={item.id}
                  variant="interactive"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="relative">
                    <img
                      src={item.imageData}
                      alt="Blood smear"
                      className="w-full aspect-square object-cover rounded-t-xl"
                    />
                    <Badge
                      className="absolute top-2 right-2"
                      variant={
                        item.results.prediction === "positive"
                          ? "danger"
                          : item.results.prediction === "negative"
                          ? "success"
                          : "warning"
                      }
                    >
                      {item.results.prediction}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold">
                        {item.results.confidence.toFixed(1)}%
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    {item.patientInfo?.patientId && (
                      <p className="text-sm text-muted-foreground truncate">
                        ID: {item.patientInfo.patientId}
                      </p>
                    )}
                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(item);
                        }}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card variant="elevated" className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
                <FolderOpen className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">
                {history.length === 0 ? "No Analysis History Yet" : "No Results Found"}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                {history.length === 0
                  ? "Upload your first blood smear image to begin analyzing and building your history."
                  : "Try adjusting your search or filter criteria."}
              </p>
              {history.length === 0 && (
                <Link to="/detect">
                  <Button variant="medical">
                    <Upload className="h-4 w-4 mr-2" />
                    Start Detection
                  </Button>
                </Link>
              )}
            </Card>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-2xl">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle>Analysis Details</DialogTitle>
                <DialogDescription>
                  {new Date(selectedItem.timestamp).toLocaleString()}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <img
                    src={selectedItem.imageData}
                    alt="Blood smear"
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <DetectionBadge prediction={selectedItem.results.prediction} size="md" />
                    <ConfidenceMeter value={selectedItem.results.confidence} size="sm" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Parasites Detected</span>
                      <span className="font-medium">{selectedItem.results.parasitesDetected}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Infection Rate</span>
                      <span className="font-medium">{selectedItem.results.infectionRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cells Analyzed</span>
                      <span className="font-medium">{selectedItem.results.cellsAnalyzed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Severity</span>
                      <Badge variant={
                        selectedItem.results.severity === "high" ? "danger" :
                        selectedItem.results.severity === "moderate" ? "warning" : "success"
                      }>
                        {selectedItem.results.severity}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Processing Time</span>
                      <span className="font-medium">{selectedItem.results.processingTime}s</span>
                    </div>
                  </div>

                  {selectedItem.patientInfo?.patientId && (
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">Patient Info</h4>
                      <div className="space-y-1 text-sm">
                        <p>ID: {selectedItem.patientInfo.patientId}</p>
                        {selectedItem.patientInfo.age && <p>Age: {selectedItem.patientInfo.age}</p>}
                        {selectedItem.patientInfo.gender && <p>Gender: {selectedItem.patientInfo.gender}</p>}
                        {selectedItem.patientInfo.notes && <p>Notes: {selectedItem.patientInfo.notes}</p>}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default HistoryPage;
