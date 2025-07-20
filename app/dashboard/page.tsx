"use client";

import { useState, useMemo, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CandidateCard from "@/components/ui/CandidateCard";
import { CandidateFilters } from "@/components/ui/CandidateFilters";
import { CandidateDetailModal } from "@/components/ui/CandidateDetailModal";
import {
  fetchUserCVs,
  updateCVStatus,
  deleteCVById,
} from "@/lib/supabase-queries";
import { mapSupabaseCandidateToFrontend } from "@/lib/adapters";
import type {
  Candidate,
  CandidateFilters as CandidateFiltersType,
} from "@/types/candidate";
import type { Candidates } from "@/lib/interfaces";
import { Search, Users, Filter, Grid, List } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Dashboard() {
  const { user } = useUser();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [supabaseCandidates, setSupabaseCandidates] = useState<Candidates[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("matchScore");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);

  const [filters, setFilters] = useState<CandidateFiltersType>({
    seniority: [],
    mainStack: [],
    processStatus: [],
    remoteAvailable: undefined,
    minMatchScore: 0,
    maxMatchScore: 100,
  });

  // Fetch candidates from Supabase when user is available
  useEffect(() => {
    const loadCandidates = async () => {
      if (user?.id) {
        setLoading(true);
        try {
          const fetchedSupabaseCandidates = await fetchUserCVs(user.id);
          setSupabaseCandidates(fetchedSupabaseCandidates);
          const mappedCandidates = fetchedSupabaseCandidates.map(
            mapSupabaseCandidateToFrontend
          );
          setCandidates(mappedCandidates);
        } catch {
          toast.error("Error al cargar los candidatos");
        } finally {
          setLoading(false);
        }
      }
    };

    loadCandidates();
  }, [user?.id]);

  const filteredAndSortedCandidates = useMemo(() => {
    const filtered = candidates.filter((candidate) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        candidate.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.professionalTitle
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        candidate.mainStack.some((tech) =>
          tech.toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Seniority filter
      const matchesSeniority =
        filters.seniority.length === 0 ||
        filters.seniority.includes(candidate.seniority);

      // Status filter
      const matchesStatus =
        filters.processStatus.length === 0 ||
        filters.processStatus.includes(candidate.processStatus);

      // Stack filter
      const matchesStack =
        filters.mainStack.length === 0 ||
        filters.mainStack.some((tech) => candidate.mainStack.includes(tech));

      // Remote filter
      const matchesRemote =
        filters.remoteAvailable === undefined ||
        candidate.remoteAvailable === filters.remoteAvailable;

      // Match score filter
      const matchesScore =
        candidate.matchScore >= filters.minMatchScore &&
        candidate.matchScore <= filters.maxMatchScore;

      return (
        matchesSearch &&
        matchesSeniority &&
        matchesStatus &&
        matchesStack &&
        matchesRemote &&
        matchesScore
      );
    });

    // Sort candidates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "matchScore":
          return b.matchScore - a.matchScore;
        case "name":
          return a.fullName.localeCompare(b.fullName);
        case "createdAt":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "seniority":
          const seniorityOrder = {
            Junior: 1,
            "Semi-Senior": 2,
            Senior: 3,
            Lead: 4,
          };
          return seniorityOrder[b.seniority] - seniorityOrder[a.seniority];
        default:
          return 0;
      }
    });

    return filtered;
  }, [candidates, searchTerm, filters, sortBy]);

  const handleViewDetails = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsDetailModalOpen(true);
  };

  const handleScheduleInterview = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsInterviewModalOpen(true);
  };

  const handleChangeStatus = async (
    candidateId: string,
    newStatus: Candidate["processStatus"]
  ) => {
    try {
      const success = await updateCVStatus(candidateId, newStatus);
      if (success) {
        // Update local state
        setCandidates((prev) =>
          prev.map((candidate) =>
            candidate.id === candidateId
              ? { ...candidate, processStatus: newStatus }
              : candidate
          )
        );
        toast.success("Estado actualizado");
      } else {
        toast.error("Error al actualizar el estado");
      }
    } catch {
      toast.error("Error al actualizar el estado");
    }
  };

  const handleScheduleInterviewSubmit = () => {
    // In real app, this would save to database
    toast("Entrevista agendada");
  };

  const handleDeleteCandidate = async (candidateId: string) => {
    try {
      const success = await deleteCVById(candidateId);
      if (success) {
        // Remove from local state
        setCandidates((prev) =>
          prev.filter((candidate) => candidate.id !== candidateId)
        );
        toast.success("Candidato eliminado");
      } else {
        toast.error("Error al eliminar el candidato");
      }
    } catch {
      toast.error("Error al eliminar el candidato");
    }
  };

  const clearFilters = () => {
    setFilters({
      seniority: [],
      mainStack: [],
      processStatus: [],
      remoteAvailable: undefined,
      minMatchScore: 0,
      maxMatchScore: 100,
    });
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-1 md:px-6 py-4">
          <div className="flex items-center justify-between flex-wrap">
            <div>
              <h1 className="md:text-2xl text-xl font-bold text-foreground">
                Reclutamiento Técnico
              </h1>
              <p className="text-muted-foreground">
                Dashboard de análisis de CVs con IA
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                {filteredAndSortedCandidates.length} candidatos
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-1 md:px-6 py-6">
        <div className="flex md:gap-6 gap-1">
          {/* Sidebar - Filters - Desktop only */}
          <aside className="w-80 flex-shrink-0 hidden lg:block">
            <CandidateFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            {/* Search and Controls */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar candidatos por nombre, título o tecnología..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                {/* Mobile Filters Sheet */}
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtros
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filtros de Candidatos</SheetTitle>
                      <SheetDescription>
                        Filtra candidatos por criterios específicos
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                      <CandidateFilters
                        filters={filters}
                        onFiltersChange={setFilters}
                        onClearFilters={clearFilters}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="matchScore">
                      Mayor Match Score
                    </SelectItem>
                    <SelectItem value="name">Nombre A-Z</SelectItem>
                    <SelectItem value="createdAt">Más Recientes</SelectItem>
                    <SelectItem value="seniority">Seniority</SelectItem>
                  </SelectContent>
                </Select>

                <div className="hidden lg:flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Cargando candidatos...</p>
              </div>
            ) : filteredAndSortedCandidates.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No se encontraron candidatos
                </h3>
                <p className="text-muted-foreground mb-4">
                  {candidates.length === 0
                    ? "No tienes candidatos registrados aún"
                    : "Intenta ajustar los filtros o términos de búsqueda"}
                </p>
                {candidates.length > 0 && (
                  <Button onClick={clearFilters} variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Limpiar filtros
                  </Button>
                )}
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {filteredAndSortedCandidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    supabaseCandidate={supabaseCandidates.find(
                      (sc) => sc.id === candidate.id
                    )}
                    onViewDetails={handleViewDetails}
                    onScheduleInterview={handleScheduleInterview}
                    onChangeStatus={handleChangeStatus}
                    onDeleteCandidate={handleDeleteCandidate}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modals */}
      <CandidateDetailModal
        candidate={selectedCandidate}
        supabaseCandidate={
          selectedCandidate
            ? supabaseCandidates.find((sc) => sc.id === selectedCandidate.id)
            : null
        }
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
}
