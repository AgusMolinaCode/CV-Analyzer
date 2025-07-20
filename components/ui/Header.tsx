"use client";

import { Brain } from "lucide-react";
import { ModeToggle } from "./theme-toggle";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const path = usePathname();

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-2 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Left */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Brain className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            <span className="text-lg md:text-xl font-bold text-foreground">
              CVAnalyzer.ai
            </span>
          </Link>

          {/* Navigation - Center */}
          {path !== "/dashboard" && (
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => scrollToSection("hero")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Inicio
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Cómo funciona
              </button>
              <button
                onClick={() => scrollToSection("benefits")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Beneficios
              </button>
            </nav>
          )}
          {/* Auth & Toggle - Right */}
          <div className="flex items-center gap-2 md:gap-4">
            <SignedIn>
              {path !== "/dashboard" && (
                <Link
                  href="/dashboard"
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  Dashboard
                </Link>
              )}
            </SignedIn>
            <ModeToggle />
            <SignedOut>
              <SignInButton>
                <button className="bg-zinc-800 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-2 sm:px-5 cursor-pointer">
                  Iniciar Sesión
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}
