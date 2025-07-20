import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Candidate } from "@/types/candidate";
import { Eye, MapPin, Globe } from "lucide-react";
import { MatchScoreChart } from "@/components/ui/MatchScoreChart";
import { CustomMatchScore } from "@/components/ui/CustomMatchScore";
import type { Candidates } from "@/lib/interfaces";
import DisplayStackComponent from "./DisplayStackComponent";
import CandidateDropdownMenuComponent from "./CandidateDropdownMenuComponent";
import { statusColors, seniorityColors } from "@/constants";

interface CandidateCardProps {
  candidate: Candidate;
  supabaseCandidate?: Candidates;
  onViewDetails: (candidate: Candidate) => void;
  onScheduleInterview: (candidate: Candidate) => void;
  onChangeStatus: (
    candidateId: string,
    newStatus: Candidate["processStatus"]
  ) => void;
  onDeleteCandidate: (candidateId: string) => void;
}

function CandidateCard({
  candidate,
  supabaseCandidate,
  onViewDetails,
  onChangeStatus,
  onDeleteCandidate,
}: CandidateCardProps) {
  // Function to truncate text with ellipsis
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 h-[400px] w-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg text-foreground">
              {truncateText(candidate.fullName, 25)}
            </h3>
            <p className="text-muted-foreground text-sm">
              {truncateText(candidate.professionalTitle, 100)}
            </p>
          </div>
          <CandidateDropdownMenuComponent
            candidate={candidate}
            onChangeStatus={onChangeStatus}
            onDeleteCandidate={onDeleteCandidate}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-1 flex flex-col">
        <div className="flex flex-wrap gap-2">
          <Badge className={seniorityColors[candidate.seniority]}>
            {candidate.seniority}
          </Badge>
          <Badge className={statusColors[candidate.processStatus]}>
            {candidate.processStatus}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            {candidate.location}
            {candidate.remoteAvailable && (
              <>
                <Globe className="h-4 w-4 ml-2 mr-1" />
                Remoto disponible
              </>
            )}
          </div>

          <div className="flex-1">
            <p className="text-sm font-medium mb-1">Stack principal:</p>
            <DisplayStackComponent stack={candidate.mainStack} maxItems={5} />
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="w-24 h-24">
            {supabaseCandidate ? (
              <CustomMatchScore candidate={supabaseCandidate} compact={true} />
            ) : (
              <MatchScoreChart
                matchScore={candidate.matchScore}
                candidateName={candidate.fullName}
                compact={true}
              />
            )}
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails(candidate)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Ver
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CandidateCard;
