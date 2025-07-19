import { Candidate } from "@/types/candidate";

export const mockCandidates: Candidate[] = [
  {
    id: '1',
    fullName: 'Lucía Fernández',
    professionalTitle: 'Full Stack Developer',
    seniority: 'Semi-Senior',
    mainStack: ['React', 'Node.js'],
    matchScore: 87,
    processStatus: 'pendiente',
    email: 'lucia.fernandez@email.com',
    phone: '+34 666 123 456',
    location: 'Madrid, España',
    remoteAvailable: true,
    pdfUrl: 'https://miservidor.com/cv/lucia.pdf',
    linkedinUrl: 'https://linkedin.com/in/lucia-fernandez',
    githubUrl: 'https://github.com/lucia-fernandez',
    portfolioUrl: 'https://lucia-dev.com',
    workExperience: [
      {
        id: '1',
        company: 'TechCorp',
        position: 'Frontend Developer',
        startDate: '2022-01',
        endDate: '2024-03',
        description: 'Desarrollo de aplicaciones web con React y TypeScript',
        technologies: ['React', 'TypeScript', 'Tailwind CSS']
      },
      {
        id: '2',
        company: 'StartupXYZ',
        position: 'Junior Full Stack Developer',
        startDate: '2021-06',
        endDate: '2021-12',
        description: 'Desarrollo de APIs REST y frontend con Vue.js',
        technologies: ['Vue.js', 'Node.js', 'MongoDB']
      }
    ],
    technicalStack: {
      languages: ['JavaScript', 'TypeScript', 'Python'],
      frameworks: ['React', 'Vue.js', 'Node.js', 'Express'],
      databases: ['MongoDB', 'PostgreSQL'],
      tools: ['Git', 'Docker', 'Webpack'],
      cloud: ['AWS', 'Vercel']
    },
    softSkills: ['Trabajo en equipo', 'Comunicación', 'Adaptabilidad', 'Resolución de problemas'],
    notes: 'Candidata muy prometedora con buen conocimiento técnico',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    fullName: 'Carlos Ruiz',
    professionalTitle: 'Backend Developer',
    seniority: 'Senior',
    mainStack: ['Java', 'Spring Boot'],
    matchScore: 94,
    processStatus: 'revisado',
    email: 'carlos.ruiz@email.com',
    phone: '+34 677 234 567',
    location: 'Barcelona, España',
    remoteAvailable: true,
    pdfUrl: 'https://miservidor.com/cv/carlos.pdf',
    linkedinUrl: 'https://linkedin.com/in/carlos-ruiz',
    githubUrl: 'https://github.com/carlos-ruiz',
    workExperience: [
      {
        id: '3',
        company: 'Enterprise Corp',
        position: 'Senior Backend Developer',
        startDate: '2020-03',
        description: 'Desarrollo de microservicios y arquitecturas escalables',
        technologies: ['Java', 'Spring Boot', 'Kubernetes', 'PostgreSQL']
      }
    ],
    technicalStack: {
      languages: ['Java', 'Kotlin', 'Scala'],
      frameworks: ['Spring Boot', 'Micronaut'],
      databases: ['PostgreSQL', 'Redis', 'Elasticsearch'],
      tools: ['Jenkins', 'Docker', 'Kubernetes'],
      cloud: ['AWS', 'GCP']
    },
    softSkills: ['Liderazgo', 'Mentoring', 'Arquitectura de software'],
    createdAt: '2024-01-14T14:30:00Z',
    updatedAt: '2024-01-16T09:15:00Z'
  },
  {
    id: '3',
    fullName: 'Ana Martín',
    professionalTitle: 'Frontend Developer',
    seniority: 'Junior',
    mainStack: ['React', 'CSS'],
    matchScore: 72,
    processStatus: 'entrevista',
    email: 'ana.martin@email.com',
    location: 'Valencia, España',
    remoteAvailable: false,
    pdfUrl: 'https://miservidor.com/cv/ana.pdf',
    linkedinUrl: 'https://linkedin.com/in/ana-martin',
    workExperience: [
      {
        id: '4',
        company: 'WebAgency',
        position: 'Junior Frontend Developer',
        startDate: '2023-09',
        description: 'Desarrollo de interfaces de usuario responsivas',
        technologies: ['React', 'CSS3', 'JavaScript']
      }
    ],
    technicalStack: {
      languages: ['JavaScript', 'HTML', 'CSS'],
      frameworks: ['React', 'Sass'],
      databases: [],
      tools: ['Git', 'Figma', 'VS Code'],
      cloud: ['Netlify']
    },
    softSkills: ['Creatividad', 'Atención al detalle', 'Aprendizaje rápido'],
    interviews: [
      {
        id: '1',
        candidateId: '3',
        type: 'hr',
        scheduledDate: '2024-01-20T10:00:00Z',
        duration: 60,
        mode: 'online',
        meetingUrl: 'https://meet.google.com/xyz-abc-123',
        interviewerName: 'María González',
        status: 'programada'
      }
    ],
    createdAt: '2024-01-13T16:45:00Z',
    updatedAt: '2024-01-18T11:20:00Z'
  }
];