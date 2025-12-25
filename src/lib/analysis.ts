export interface AnalysisResult {
  id: string;
  prediction: "positive" | "negative" | "uncertain";
  confidence: number;
  parasitesDetected: number;
  parasiteStages: {
    ring: number;
    trophozoite: number;
    schizont: number;
  };
  infectionRate: number;
  cellsAnalyzed: number;
  infectedCells: number;
  severity: "low" | "moderate" | "high";
  processingTime: number;
  boundingBoxes: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
  }>;
}

export interface AnalysisHistoryItem {
  id: string;
  timestamp: string;
  imageData: string;
  results: AnalysisResult;
  patientInfo?: PatientInfo;
}

export interface PatientInfo {
  patientId?: string;
  age?: number;
  gender?: "male" | "female" | "other";
  collectionDate?: string;
  notes?: string;
}

// Mock analysis function - replace with actual model integration
export const analyzeWithAI = async (imageFile: File): Promise<AnalysisResult> => {
  // Simulate processing time
  return new Promise((resolve) => {
    const delay = 2000 + Math.random() * 2000;
    
    setTimeout(() => {
      const isPositive = Math.random() > 0.4;
      const isUncertain = !isPositive && Math.random() > 0.7;
      
      const prediction: AnalysisResult["prediction"] = isPositive 
        ? "positive" 
        : isUncertain 
          ? "uncertain" 
          : "negative";
      
      const parasitesDetected = isPositive 
        ? Math.floor(Math.random() * 20) + 1 
        : isUncertain 
          ? Math.floor(Math.random() * 3) 
          : 0;
      
      const severity: AnalysisResult["severity"] = 
        parasitesDetected > 15 ? "high" : 
        parasitesDetected > 5 ? "moderate" : "low";
      
      const confidence = isPositive 
        ? 85 + Math.random() * 14 
        : isUncertain 
          ? 60 + Math.random() * 15 
          : 90 + Math.random() * 9;

      const cellsAnalyzed = 2000 + Math.floor(Math.random() * 1000);
      
      resolve({
        id: `analysis-${Date.now()}`,
        prediction,
        confidence: Math.round(confidence * 10) / 10,
        parasitesDetected,
        parasiteStages: {
          ring: Math.floor(parasitesDetected * 0.5),
          trophozoite: Math.floor(parasitesDetected * 0.3),
          schizont: parasitesDetected - Math.floor(parasitesDetected * 0.5) - Math.floor(parasitesDetected * 0.3),
        },
        infectionRate: Math.round((parasitesDetected / cellsAnalyzed) * 10000) / 100,
        cellsAnalyzed,
        infectedCells: parasitesDetected,
        severity,
        processingTime: Math.round(delay / 100) / 10,
        boundingBoxes: Array.from({ length: parasitesDetected }, () => ({
          x: Math.floor(Math.random() * 400) + 50,
          y: Math.floor(Math.random() * 400) + 50,
          width: 25 + Math.floor(Math.random() * 15),
          height: 25 + Math.floor(Math.random() * 15),
          confidence: 0.8 + Math.random() * 0.19,
        })),
      });
    }, delay);
  });
};

// LocalStorage helpers
const STORAGE_KEY = "malaria_analysis_history";

export const saveToHistory = (
  imageData: string,
  results: AnalysisResult,
  patientInfo?: PatientInfo
): AnalysisHistoryItem => {
  const newEntry: AnalysisHistoryItem = {
    id: results.id,
    timestamp: new Date().toISOString(),
    imageData,
    results,
    patientInfo,
  };

  const existing = getHistory();
  const updated = [newEntry, ...existing].slice(0, 50); // Keep last 50 entries
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  
  return newEntry;
};

export const getHistory = (): AnalysisHistoryItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const deleteFromHistory = (id: string): void => {
  const existing = getHistory();
  const updated = existing.filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const clearHistory = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
