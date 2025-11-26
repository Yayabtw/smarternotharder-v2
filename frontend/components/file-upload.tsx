"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Loader2 } from "lucide-react";

interface FileUploadProps {
  onUploadSuccess: (data: any) => void;
}

export function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      // Dynamically import to avoid SSR issues with FormData if any, though mostly fine here.
      // Actually using the api lib function.
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
    <Card className="w-full max-w-md mx-auto bg-card/50 border-dashed border-2">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <Upload className="w-5 h-5" /> Upload Course Material
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5 mx-auto">
          <Label htmlFor="course-file">PDF Document</Label>
          <Input id="course-file" type="file" accept=".pdf" onChange={handleFileChange} />
        </div>
        
        {file && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <FileText className="w-4 h-4" /> {file.name}
            </div>
        )}

        <Button 
            className="w-full" 
            onClick={handleUpload} 
            disabled={!file || uploading}
        >
          {uploading ? (
            <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
            </>
          ) : (
            "Analyze Document"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

