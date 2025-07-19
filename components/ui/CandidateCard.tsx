import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Candidate } from "@/types/candidate";
import { Eye, Calendar, MoreHorizontal, MapPin, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CandidateCardProps {
  candidate: Candidate;
  onViewDetails: (candidate: Candidate) => void;
  onScheduleInterview: (candidate: Candidate) => void;
  onChangeStatus: (candidateId: string, newStatus: Candidate['processStatus']) => void;
}

const statusColors = {
  pendiente: 'bg-warning/10 text-warning',
  revisado: 'bg-info/10 text-info',
  entrevista: 'bg-primary/10 text-primary',
  rechazado: 'bg-destructive/10 text-destructive',
  contratado: 'bg-success/10 text-success'
};

const seniorityColors = {
  Junior: 'bg-muted text-muted-foreground',
  'Semi-Senior': 'bg-info/10 text-info',
  Senior: 'bg-success/10 text-success',
  Lead: 'bg-primary/10 text-primary'
};

function CandidateCard({ candidate, onViewDetails, onScheduleInterview, onChangeStatus }: CandidateCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg text-foreground">{candidate.fullName}</h3>
            <p className="text-muted-foreground text-sm">{candidate.professionalTitle}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover">
              <DropdownMenuItem onClick={() => onChangeStatus(candidate.id, 'pendiente')}>
                Marcar como Pendiente
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChangeStatus(candidate.id, 'revisado')}>
                Marcar como Revisado
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChangeStatus(candidate.id, 'entrevista')}>
                Programar Entrevista
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChangeStatus(candidate.id, 'rechazado')}>
                Rechazar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChangeStatus(candidate.id, 'contratado')}>
                Contratar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
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
          
          <div>
            <p className="text-sm font-medium mb-1">Stack principal:</p>
            <div className="flex flex-wrap gap-1">
              {candidate.mainStack.map((tech) => (
                <Badge key={tech} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{candidate.matchScore}</div>
            <div className="text-xs text-muted-foreground">Match Score</div>
          </div>
          
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onViewDetails(candidate)}>
              <Eye className="h-4 w-4 mr-1" />
              Ver
            </Button>
            <Button size="sm" onClick={() => onScheduleInterview(candidate)}>
              <Calendar className="h-4 w-4 mr-1" />
              Agendar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CandidateCard;