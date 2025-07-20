"use client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import HowItWorks from "@/components/ui/HowItWorks";
import { Benefits } from "@/components/ui/Benefits";
import { Testimonials } from "@/components/ui/Testimonials";
import { Sparkles } from "lucide-react";
import { Footer } from "@/components/ui/Footer";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import CurvedLoop from "@/components/ui/CurvedLoop";

const Page = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section id="hero" className="relative py-24 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Powered by AI 
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Analizá currículums con{" "}
              <span className="text-primary">inteligencia artificial</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Cargá un CV en PDF y obtené un análisis técnico automatizado en
              segundos. Revolucioná tu proceso de reclutamiento técnico.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6"
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Ver cómo funciona
              </Button>
            </div>
          </div>
          {/* File Upload Section */}
          <div id="upload-section" className="max-w-2xl mx-auto">
            <SignedIn>
              <FileUpload isSignedIn={true} />
            </SignedIn>
            <SignedOut>
              <FileUpload isSignedIn={false} />
            </SignedOut>
          </div>
        </div>
      </section>
          <CurvedLoop
            marqueeText="CVAnalyzer.ai *"
            speed={0.4}
            curveAmount={0}
            direction="right"
            interactive={true}
          />

      <HowItWorks />
      <Benefits />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Page;
