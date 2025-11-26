"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, Loader2, FileUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onUploadSuccess: (data: any) => void;
}

export function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const t = useTranslations("Upload");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
      } else {
        alert("Please upload a PDF file.");
      }
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleUpload = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the file input click
    if (!file) return;

    setUploading(true);
    try {
      const { uploadDocument } = await import("@/lib/api");
      const data = await uploadDocument(file);
      onUploadSuccess(data);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card 
        className={cn(
            "w-full max-w-md mx-auto border-2 border-dashed transition-colors duration-200 cursor-pointer group",
            isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50",
            "bg-card/50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
    >
      <CardContent className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
        <Input 
            ref={inputRef}
            id="course-file" 
            type="file" 
            accept=".pdf" 
            onChange={handleFileChange} 
            className="hidden"
        />
        
        <div className={cn(
            "p-4 rounded-full transition-all duration-200",
            isDragging ? "bg-primary/20 scale-110" : "bg-muted group-hover:bg-primary/10"
        )}>
            {file ? (
                <FileText className="w-8 h-8 text-primary" />
            ) : (
                <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
            )}
        </div>

        <div className="space-y-1">
            <h3 className="font-semibold text-lg">
                {file ? file.name : t('title')}
            </h3>
            <p className="text-sm text-muted-foreground">
                {file ? (
                    <span className="text-primary font-medium">Ready to analyze</span>
                ) : (
                    t('drag_drop')
                )}
            </p>
        </div>

        {file && (
            <Button 
                className="w-full max-w-xs mt-4" 
                onClick={handleUpload} 
                disabled={uploading}
            >
            {uploading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
            ) : (
                <>
                    <FileUp className="mr-2 h-4 w-4" /> {t('analyze')}
                </>
            )}
            </Button>
        )}
      </CardContent>
    </Card>
  );
}
