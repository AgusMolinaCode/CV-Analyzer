"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { uploadPDF } from "@/lib/actions";
import { Upload, FileText, CheckCircle, XCircle } from "lucide-react";
export function FileSection() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
  } | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadPDF(formData);
      setUploadResult(result);

      if (result.success) {
        setFile(null);
        const input = document.getElementById("pdf-upload") as HTMLInputElement;
        if (input) input.value = "";
      }
    } catch {
      setUploadResult({
        success: false,
        error: "Error uploading file",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 border border-border rounded-lg bg-card">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Subir CV en PDF</h3>
        <p className="text-sm text-muted-foreground">
          Selecciona un archivo PDF para analizar
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="pdf-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Click para subir</span> o
                arrastra y suelta
              </p>
              <p className="text-xs text-muted-foreground">Solo archivos PDF</p>
            </div>
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {file && (
          <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
            <FileText className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium truncate">{file.name}</span>
            <span className="text-xs text-muted-foreground">
              ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          </div>
        )}

        {uploadResult && (
          <div
            className={`flex items-center space-x-2 p-3 rounded-lg ${
              uploadResult.success
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {uploadResult.success ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            <span className="text-sm">
              {uploadResult.message || uploadResult.error}
            </span>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full cursor-pointer"
        >
          {uploading ? "Subiendo..." : "Subir CV"}
        </Button>
      </div>
    </div>
  );
}
