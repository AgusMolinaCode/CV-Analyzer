import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Candidate } from "@/types/candidate";
import {
  Download,
  ExternalLink,
  Briefcase,
  Code,
  Heart,
  MapPin,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomMatchScore } from "@/components/ui/CustomMatchScore";
import type { Candidates } from "@/lib/interfaces";
import { normalizeUrl } from "@/lib/utils/urlNormalizer";

interface CandidateDetailModalProps {
  candidate: Candidate | null;
  supabaseCandidate?: Candidates | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CandidateDetailModal({
  candidate,
  supabaseCandidate,
  isOpen,
  onClose,
}: CandidateDetailModalProps) {
  if (!candidate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-full md:max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            <div className="flex gap-2 md:flex-row flex-col max-w-5/6 md:w-full">
              <Button variant="outline" asChild>
                <a
                  href={candidate.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar CV
                </a>
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[80vh] pr-4">
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-start gap-4">
              {/* Custom Match Score */}
              {supabaseCandidate && (
                <div className="flex justify-center">
                  <div className="w-24 h-24">
                    <CustomMatchScore
                      candidate={supabaseCandidate}
                      compact={true}
                    />
                  </div>
                </div>
              )}

              <div className="flex-1">
                <h2 className="md:text-2xl text-xl font-bold">
                  {candidate.fullName}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {candidate.professionalTitle}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge className="bg-success/10 text-success">
                    Match Score: {candidate.matchScore}%
                  </Badge>
                  <Badge variant="outline">{candidate.seniority}</Badge>
                  <Badge className="capitalize">
                    {candidate.processStatus}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Información de Contacto
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    {candidate.email}
                  </p>
                  {candidate.phone && (
                    <p className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      {candidate.phone}
                    </p>
                  )}
                  <p className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    {candidate.location}
                  </p>
                  <p className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                    {candidate.remoteAvailable
                      ? "Disponible para remoto"
                      : "Solo presencial"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Enlaces</h3>
                <div className="space-y-2">
                  {candidate.linkedinUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full justify-start"
                    >
                      <a
                        href={normalizeUrl(candidate.linkedinUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                        <ExternalLink className="h-3 w-3 ml-auto" />
                      </a>
                    </Button>
                  )}
                  {candidate.githubUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full justify-start"
                    >
                      <a
                        href={normalizeUrl(candidate.githubUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                        <ExternalLink className="h-3 w-3 ml-auto" />
                      </a>
                    </Button>
                  )}
                  {candidate.portfolioUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full justify-start"
                    >
                      <a
                        href={normalizeUrl(candidate.portfolioUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        Portfolio
                        <ExternalLink className="h-3 w-3 ml-auto" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Work Experience */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center">
                <Briefcase className="h-4 w-4 mr-2" />
                Experiencia Laboral
              </h3>
              <div className="space-y-4">
                {candidate.workExperience.map((job) => (
                  <div
                    key={job.id}
                    className="border-l-2 border-primary/20 pl-4"
                  >
                    <h4 className="font-medium">{job.position}</h4>
                    <p className="text-primary font-medium">{job.company}</p>
                    <p className="text-sm text-muted-foreground">
                      {job.startDate} - {job.endDate || "Presente"}
                    </p>
                    <p className="mt-2 text-sm">{job.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {job.technologies.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Technical Stack */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center">
                <Code className="h-4 w-4 mr-2" />
                Stack Técnico
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Lenguajes</h4>
                  <div className="flex flex-wrap gap-1">
                    {candidate.technicalStack.languages.map((lang) => (
                      <Badge key={lang} variant="secondary" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Frameworks</h4>
                  <div className="flex flex-wrap gap-1">
                    {candidate.technicalStack.frameworks.map((fw) => (
                      <Badge key={fw} variant="secondary" className="text-xs">
                        {fw}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Bases de Datos</h4>
                  <div className="flex flex-wrap gap-1">
                    {candidate.technicalStack.databases.map((db) => (
                      <Badge key={db} variant="secondary" className="text-xs">
                        {db}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Herramientas</h4>
                  <div className="flex flex-wrap gap-1">
                    {candidate.technicalStack.tools.map((tool) => (
                      <Badge key={tool} variant="secondary" className="text-xs">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>

                {candidate.technicalStack.cloud.length > 0 && (
                  <div className="md:col-span-2">
                    <h4 className="font-medium mb-2">Cloud</h4>
                    <div className="flex flex-wrap gap-1">
                      {candidate.technicalStack.cloud.map((cloud) => (
                        <Badge
                          key={cloud}
                          variant="secondary"
                          className="text-xs"
                        >
                          {cloud}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Soft Skills */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center">
                <Heart className="h-4 w-4 mr-2" />
                Soft Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {candidate.softSkills.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Notes */}
            {candidate.notes && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Notas de asistente AI</h3>
                  <p className="text-sm bg-muted p-3 rounded-lg">
                    {candidate.notes}
                  </p>
                </div>
              </>
            )}

            {/* Interviews */}
            {candidate.interviews && candidate.interviews.length > 0 && (
              <>
                <Separator />
                <div>
                  <div className="space-y-3">
                    {candidate.interviews.map((interview) => (
                      <div key={interview.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium capitalize">
                              {interview.type}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(
                                interview.scheduledDate
                              ).toLocaleString()}
                            </p>
                            <p className="text-sm">
                              Entrevistador: {interview.interviewerName}
                            </p>
                          </div>
                          <Badge className="capitalize">
                            {interview.status}
                          </Badge>
                        </div>
                        {interview.meetingUrl && (
                          <Button
                            variant="link"
                            size="sm"
                            asChild
                            className="p-0 h-auto mt-2"
                          >
                            <a
                              href={interview.meetingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Unirse a la reunión
                            </a>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
