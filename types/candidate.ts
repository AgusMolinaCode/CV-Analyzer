export interface Candidate {
    id: string;
    fullName: string;
    professionalTitle: string;
    seniority: 'Junior' | 'Semi-Senior' | 'Senior' | 'Lead';
    mainStack: string[];
    matchScore: number;
    processStatus: 'pendiente' | 'revisado' | 'entrevista' | 'rechazado' | 'contratado';
    email: string;
    phone?: string;
    location: string;
    remoteAvailable: boolean;
    pdfUrl: string;
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    workExperience: WorkExperience[];
    technicalStack: TechnicalStack;
    softSkills: string[];
    notes?: string;
    interviews?: Interview[];
    createdAt: string;
    updatedAt: string;
  }
  
  export  interface WorkExperience {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description: string;
    technologies: string[];
  }
  
  export interface TechnicalStack {
    languages: string[];
    frameworks: string[];
    databases: string[];
    tools: string[];
    cloud: string[];
  }
  
  export interface Interview {
    id: string;
    candidateId: string;
    type: 'tecnica' | 'hr' | 'cultural';
    scheduledDate: string;
    duration: number;
    mode: 'presencial' | 'online';
    meetingUrl?: string;
    interviewerName: string;
    status: 'programada' | 'completada' | 'cancelada';
    notes?: string;
    feedback?: string;
  }
  
  export interface CandidateFilters {
    seniority: string[];
    mainStack: string[];
    processStatus: string[];
    remoteAvailable?: boolean;
    minMatchScore: number;
    maxMatchScore: number;
  }