"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { CheckCircle, Clock, FileText, Brain, BarChart3 } from "lucide-react";

interface LoadingStepsProps {
  isLoading: boolean;
  onComplete?: () => void;
}

export function LoadingSteps({ isLoading, onComplete }: LoadingStepsProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 1,
      title: "Subiendo archivo",
      description: "Enviando CV al servidor...",
      icon: FileText,
      duration: 3000,
    },
    {
      id: 2,
      title: "Analizando contenido",
      description: "Extrayendo texto y estructura...",
      icon: Brain,
      duration: 5000,
    },
    {
      id: 3,
      title: "Procesando habilidades",
      description: "Analizando CV con IA...",
      icon: BarChart3,
      duration: 5000,
    },
    {
      id: 4,
      title: "Generando reporte",
      description: "Compilando análisis final...",
      icon: CheckCircle,
      duration: 999999999, // Stay here until actual completion
    },
  ];

  useEffect(() => {
    if (!isLoading) {
      setCurrentStep(0);
      return;
    }

    let timeoutId: NodeJS.Timeout;

    const progressSteps = () => {
      if (currentStep < steps.length - 1) {
        const currentStepDuration = steps[currentStep].duration;
        timeoutId = setTimeout(() => {
          setCurrentStep((prev) => prev + 1);
          progressSteps();
        }, currentStepDuration);
      } else {
        // Last step - wait for actual completion
        onComplete?.();
      }
    };

    progressSteps();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading, currentStep, onComplete, steps]);

  if (!isLoading) return null;

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-card rounded-lg border border-border">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Procesando CV</h3>
        <p className="text-sm text-muted-foreground">
          Este proceso puede tomar 40-60 segundos
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          const Icon = step.icon;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary/10 border border-primary/20"
                  : isCompleted
                  ? "bg-green-50 border border-green-200"
                  : "bg-muted/50 border border-border"
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : isCompleted
                    ? "bg-green-500 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isActive ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Clock className="w-4 h-4" />
                  </motion.div>
                ) : isCompleted ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1">
                <h4
                  className={`font-medium ${
                    isActive
                      ? "text-primary"
                      : isCompleted
                      ? "text-green-700"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </h4>
                <p
                  className={`text-sm ${
                    isActive
                      ? "text-primary/80"
                      : isCompleted
                      ? "text-green-600"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.description}
                </p>
              </div>

              {isActive && (
                <div className="flex-shrink-0">
                  <motion.div
                    className="w-2 h-2 bg-primary rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6">
        <div className="w-full bg-muted rounded-full h-2">
          <motion.div
            className="bg-primary h-2 rounded-full"
            initial={{ width: "0%" }}
            animate={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Paso {currentStep + 1} de {steps.length}
        </p>
      </div>
    </div>
  );
}