import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { Upload, X, Image as ImageIcon, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile: File | null;
  previewUrl: string | null;
  accept?: string;
  maxSize?: number;
  className?: string;
}

export function FileUploader({
  onFileSelect,
  onFileRemove,
  selectedFile,
  previewUrl,
  accept = "image/jpeg,image/png,image/tiff",
  maxSize = 10 * 1024 * 1024, // 10MB
  className,
}: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback(
    (file: File): boolean => {
      setError(null);

      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return false;
      }

      if (file.size > maxSize) {
        setError(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
        return false;
      }

      return true;
    },
    [maxSize]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);

      const file = e.dataTransfer.files[0];
      if (file && validateFile(file)) {
        onFileSelect(file);
      }
    },
    [onFileSelect, validateFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && validateFile(file)) {
        onFileSelect(file);
      }
    },
    [onFileSelect, validateFile]
  );

  if (selectedFile && previewUrl) {
    return (
      <div className={cn("relative rounded-xl border-2 border-primary/20 bg-card overflow-hidden", className)}>
        <div className="aspect-square relative">
          <img
            src={previewUrl}
            alt="Uploaded blood smear"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FileImage className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground truncate max-w-[200px]">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            <Button
              variant="destructive"
              size="icon"
              onClick={onFileRemove}
              className="rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all duration-200 cursor-pointer",
          isDragOver
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border hover:border-primary/50 hover:bg-muted/50",
          error && "border-danger bg-danger-light"
        )}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className={cn(
          "flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-200",
          isDragOver ? "bg-primary text-primary-foreground scale-110" : "bg-muted"
        )}>
          <Upload className={cn("h-8 w-8", isDragOver ? "text-primary-foreground" : "text-muted-foreground")} />
        </div>
        
        <div className="mt-4 text-center">
          <p className="font-medium text-foreground">
            {isDragOver ? "Drop your image here" : "Drop blood smear image here"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            or click to browse
          </p>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {["JPG", "PNG", "TIFF"].map((format) => (
            <span
              key={format}
              className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
            >
              {format}
            </span>
          ))}
        </div>
        
        <p className="mt-2 text-xs text-muted-foreground">
          Maximum file size: 10MB
        </p>

        {error && (
          <p className="mt-3 text-sm text-danger font-medium">{error}</p>
        )}
      </div>
    </div>
  );
}
