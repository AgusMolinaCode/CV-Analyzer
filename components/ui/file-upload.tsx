import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import { SignInButton } from "@clerk/nextjs";
import { uploadPDF } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { LoadingSteps } from "@/components/ui/LoadingSteps";
import { useRouter } from "next/navigation";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export const FileUpload = ({
  onChange,
  isSignedIn = true,
}: {
  onChange?: (files: File[]) => void;
  isSignedIn?: boolean;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showLoadingSteps, setShowLoadingSteps] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
    onChange && onChange(newFiles);
    setUploadResult(null);
  };

  const handleUpload = async () => {
    if (!files.length || !isSignedIn) return;

    setUploading(true);
    setShowLoadingSteps(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("file", files[0]);

      const result = await uploadPDF(formData);
      setUploadResult(result);

      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (error) {
      setUploadResult({
        success: false,
        error: "Error uploading file",
      });
    } finally {
      setUploading(false);
      setShowLoadingSteps(false);
    }
  };

  const handleLoadingComplete = () => {
    // This will be called when LoadingSteps completes all steps
    // but we'll wait for the actual API response
  };

  const handleClick = () => {
    if (isSignedIn) {
      fileInputRef.current?.click();
    }
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    accept: {
      "application/pdf": [".pdf"],
    },
    onDrop: isSignedIn ? handleFileChange : () => {},
    onDropRejected: (error) => {
      console.log(error);
    },
  });

  if (!isSignedIn) {
    return (
      <div className="w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Subir CV para Análisis
          </h2>
          <p className="text-lg text-muted-foreground">
            Selecciona un archivo PDF para comenzar el análisis
          </p>
        </div>
        <motion.div className="p-10 group/file block rounded-lg w-full relative overflow-hidden opacity-60">
          <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
            <GridPattern />
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
              Subir CV
            </p>
            <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2 mb-4">
              Inicia sesión para agregar tu CV
            </p>
            <SignInButton>
              <button className="relative z-20 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Iniciar Sesión
              </button>
            </SignInButton>
            <div className="relative w-full mt-10 max-w-xl mx-auto">
              <motion.div
                className={cn(
                  "relative z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md opacity-50",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                )}
              >
                <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="w-full max-w-md mx-auto p-8 bg-card rounded-lg border border-border text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        </motion.div>
        <h3 className="text-xl font-semibold text-green-700 mb-2">
          CV cargado correctamente
        </h3>
        <p className="text-muted-foreground mb-4">
          Redirigiendo al dashboard...
        </p>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"
        />
      </div>
    );
  }

  if (showLoadingSteps) {
    return (
      <div className="w-full">
        <LoadingSteps
          isLoading={showLoadingSteps}
          onComplete={handleLoadingComplete}
        />
      </div>
    );
  }

  return (
    <div className="w-full" {...getRootProps()}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Subir CV para Análisis
        </h2>
        <p className="text-lg text-muted-foreground">
          Selecciona un archivo PDF para comenzar el análisis
        </p>
      </div>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          accept=".pdf"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
            Subir CV en PDF
          </p>
          <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2">
            Arrastra y suelta tu archivo PDF aquí o haz clic para subir
          </p>
          <div className="relative w-full mt-10 max-w-xl mx-auto">
            {files.length > 0 &&
              files.map((file, idx) => (
                <motion.div
                  key={"file" + idx}
                  layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                  className={cn(
                    "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md",
                    "shadow-sm"
                  )}
                >
                  <div className="flex justify-between w-full items-center gap-4">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs"
                    >
                      {file.name}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="rounded-lg px-2 py-1 w-fit shrink-0 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input"
                    >
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </motion.p>
                  </div>

                  <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600 dark:text-neutral-400">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 "
                    >
                      {file.type}
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                    >
                      modified{" "}
                      {new Date(file.lastModified).toLocaleDateString()}
                    </motion.p>
                  </div>
                </motion.div>
              ))}
            {!files.length && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className={cn(
                  "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-neutral-600 flex flex-col items-center"
                  >
                    Drop it
                    <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  </motion.p>
                ) : (
                  <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                )}
              </motion.div>
            )}

            {!files.length && (
              <motion.div
                variants={secondaryVariant}
                className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
              ></motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Upload Button and Result - Outside the dropzone */}
      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full"
          >
            {uploading ? "Subiendo..." : "Subir CV"}
          </Button>

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
        </div>
      )}
    </div>
  );
};

export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex bg-gray-100 dark:bg-neutral-900 shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px  scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-neutral-950"
                  : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
              }`}
            />
          );
        })
      )}
    </div>
  );
}
