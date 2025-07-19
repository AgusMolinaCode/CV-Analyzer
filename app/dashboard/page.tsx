"use client"

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CandidateCard from "@/components/ui/CandidateCard";
import { CandidateFilters } from "@/components/ui/CandidateFilters";
import { CandidateDetailModal } from "@/components/ui/CandidateDetailModal";
import { InterviewModal } from "@/components/ui/InterviewModal";
import { mockCandidates } from "@/data/mockCandidates";
import type { Candidate, CandidateFilters as CandidateFiltersType } from "@/types/candidate";
import { Search, Users, Filter, Grid, List } from "lucide-react";
import { toast } from "sonner"

export default function Dashboard() {
  const [candidates] = useState<Candidate[]>(mockCandidates);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("matchScore");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);

  const [filters, setFilters] = useState<CandidateFiltersType>({
    seniority: [],
    mainStack: [],
    processStatus: [],
    remoteAvailable: undefined,
    minMatchScore: 0,
    maxMatchScore: 100
  });

  const filteredAndSortedCandidates = useMemo(() => {
    let filtered = candidates.filter(candidate => {
      // Search filter
      const matchesSearch = searchTerm === "" || 
        candidate.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.professionalTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.mainStack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));

      // Seniority filter
      const matchesSeniority = filters.seniority.length === 0 || 
        filters.seniority.includes(candidate.seniority);

      // Status filter
      const matchesStatus = filters.processStatus.length === 0 || 
        filters.processStatus.includes(candidate.processStatus);

      // Stack filter
      const matchesStack = filters.mainStack.length === 0 || 
        filters.mainStack.some(tech => candidate.mainStack.includes(tech));

      // Remote filter
      const matchesRemote = filters.remoteAvailable === undefined || 
        candidate.remoteAvailable === filters.remoteAvailable;

      // Match score filter
      const matchesScore = candidate.matchScore >= filters.minMatchScore && 
        candidate.matchScore <= filters.maxMatchScore;

      return matchesSearch && matchesSeniority && matchesStatus && 
             matchesStack && matchesRemote && matchesScore;
    });

    // Sort candidates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "matchScore":
          return b.matchScore - a.matchScore;
        case "name":
          return a.fullName.localeCompare(b.fullName);
        case "createdAt":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "seniority":
          const seniorityOrder = { "Junior": 1, "Semi-Senior": 2, "Senior": 3, "Lead": 4 };
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

  const handleChangeStatus = (candidateId: string, newStatus: Candidate['processStatus']) => {
    // In real app, this would update the database
    toast("Estado actualizado")
  };

  const handleScheduleInterviewSubmit = (interviewData: any) => {
    // In real app, this would save to database
    toast("Entrevista agendada")
  };

  const clearFilters = () => {
    setFilters({
      seniority: [],
      mainStack: [],
      processStatus: [],
      remoteAvailable: undefined,
      minMatchScore: 0,
      maxMatchScore: 100
    });
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Reclutamiento Técnico</h1>
              <p className="text-muted-foreground">Dashboard de análisis de CVs con IA</p>
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

      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Sidebar - Filters */}
          <aside className="w-80 flex-shrink-0">
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
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="matchScore">Mayor Match Score</SelectItem>
                    <SelectItem value="name">Nombre A-Z</SelectItem>
                    <SelectItem value="createdAt">Más Recientes</SelectItem>
                    <SelectItem value="seniority">Seniority</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-lg">
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
            {filteredAndSortedCandidates.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No se encontraron candidatos
                </h3>
                <p className="text-muted-foreground mb-4">
                  Intenta ajustar los filtros o términos de búsqueda
                </p>
                <Button onClick={clearFilters} variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Limpiar filtros
                </Button>
              </div>
            ) : (
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "space-y-4"
              }>
                {filteredAndSortedCandidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    onViewDetails={handleViewDetails}
                    onScheduleInterview={handleScheduleInterview}
                    onChangeStatus={handleChangeStatus}
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
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onScheduleInterview={handleScheduleInterview}
      />

      <InterviewModal
        candidate={selectedCandidate}
        isOpen={isInterviewModalOpen}
        onClose={() => setIsInterviewModalOpen(false)}
        onSchedule={handleScheduleInterviewSubmit}
      />
    </div>
  );
}