import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Candidate } from "@/types/candidate";

const CandidateDropdownMenuComponent = ({
  candidate,
  onChangeStatus,
  onDeleteCandidate,
}: {
  candidate: Candidate;
  onChangeStatus: (
    candidateId: string,
    newStatus: Candidate["processStatus"]
  ) => void;
  onDeleteCandidate: (candidateId: string) => void;
}) => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-popover">
          <DropdownMenuItem
            onClick={() => onChangeStatus(candidate.id, "pendiente")}
          >
            Marcar como Pendiente
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onChangeStatus(candidate.id, "revisado")}
          >
            Marcar como Revisado
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onChangeStatus(candidate.id, "rechazado")}
          >
            Marcar como Rechazado
          </DropdownMenuItem>

          {candidate.processStatus === "rechazado" && (
            <DropdownMenuItem
              onClick={() => onDeleteCandidate(candidate.id)}
              className="text-destructive"
            >
              Eliminar Candidato
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={() => {
              window.location.href = `mailto:${candidate.email}`;
            }}
          >
            Contratar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CandidateDropdownMenuComponent;
