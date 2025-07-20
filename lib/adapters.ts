import type { Candidates } from './interfaces'
import type { Candidate } from '@/types/candidate'

// Function to get full Supabase candidate data for detailed scoring
export const getSupabaseCandidateById = (candidates: Candidates[], id: string): Candidates | null => {
  return candidates.find(candidate => candidate.id === id) || null;
}

// Function to calculate custom match score for filtering (extracted from CustomMatchScore component)
export const calculateCustomMatchScore = (candidate: Candidates): number => {
  let totalScore = 0;

  // 1. Technical Skills Assessment (35% weight)
  const technicalWeight = 0.35;
  let technicalScore = 0;
  
  const stackCount = candidate.stack_principal?.length || 0;
  const stackScore = Math.min(stackCount * 8, 80);
  
  const languagesCount = candidate.lenguajes_programacion?.length || 0;
  const languagesScore = Math.min(languagesCount * 6, 60);
  
  const frameworksCount = candidate.frameworks_principales?.length || 0;
  const frameworksScore = Math.min(frameworksCount * 5, 50);
  
  const devopsCount = candidate.herramientas_devops?.length || 0;
  const devopsScore = Math.min(devopsCount * 4, 40);
  
  technicalScore = (stackScore + languagesScore + frameworksScore + devopsScore) / 2.3;
  totalScore += Math.min(technicalScore * technicalWeight, 35);

  // 2. Experience Assessment (25% weight)
  const experienceWeight = 0.25;
  const yearsExperience = candidate.anos_experiencia || 0;
  
  let experienceScore = 0;
  if (yearsExperience <= 2) {
    experienceScore = yearsExperience * 30;
  } else if (yearsExperience <= 5) {
    experienceScore = 60 + (yearsExperience - 2) * 20;
  } else if (yearsExperience <= 8) {
    experienceScore = 120 + (yearsExperience - 5) * 15;
  } else {
    experienceScore = 165 + (yearsExperience - 8) * 5;
  }
  
  experienceScore = Math.min(experienceScore, 200);
  totalScore += Math.min((experienceScore / 200) * 25, 25);

  // 3. Seniority Level Assessment (20% weight)
  const seniorityMap: { [key: string]: number } = {
    'junior': 60,
    'semi-senior': 75,
    'semi senior': 75,
    'mid': 75,
    'senior': 90,
    'lead': 100,
    'tech lead': 100,
    'principal': 100,
  };
  
  const seniorityLevel = candidate.nivel_seniority?.toLowerCase() || 'junior';
  const seniorityScore = seniorityMap[seniorityLevel] || 50;
  totalScore += (seniorityScore / 100) * 20;

  // 4. Qualifications Assessment (10% weight)
  let qualificationsScore = 0;
  
  const englishLevel = candidate.english_level?.toLowerCase() || 'basic';
  const englishMap: { [key: string]: number } = {
    'basic': 30,
    'intermediate': 60,
    'advanced': 85,
    'native': 100,
    'fluent': 100,
  };
  qualificationsScore += englishMap[englishLevel] || 30;
  
  const certificationsCount = candidate.certificaciones?.length || 0;
  qualificationsScore += Math.min(certificationsCount * 15, 60);
  
  if (candidate.educacion && candidate.educacion.length > 0) {
    qualificationsScore += 40;
  }
  
  qualificationsScore = Math.min(qualificationsScore, 200);
  totalScore += (qualificationsScore / 200) * 10;

  // 5. Match Details Assessment (5% weight)
  let matchDetailsScore = 0;
  
  if (candidate.match_details) {
    const details = candidate.match_details;
    if (details.stack_requerido) matchDetailsScore += 25;
    if (details.experiencia_minima) matchDetailsScore += 25;
    if (details.nivel_ingles) matchDetailsScore += 20;
    if (details.liderazgo) matchDetailsScore += 15;
    if (details.certificaciones_relevantes) matchDetailsScore += 15;
  }
  
  totalScore += (matchDetailsScore / 100) * 5;

  // 6. Skills Distribution Assessment (5% weight)
  let skillsDistScore = 0;
  
  if (candidate.distribucion_skills) {
    const dist = candidate.distribucion_skills;
    const skillsVariance = Math.abs(20 - (dist.backend || 0)) + 
                          Math.abs(20 - (dist.frontend || 0)) + 
                          Math.abs(20 - (dist.data || 0)) + 
                          Math.abs(20 - (dist.devops || 0)) + 
                          Math.abs(20 - (dist.gestión || 0));
    
    skillsDistScore = Math.max(0, 100 - (skillsVariance * 2));
  }
  
  totalScore += (skillsDistScore / 100) * 5;

  // Apply qualification bonus/penalty
  if (candidate.is_qualified) {
    totalScore *= 1.1;
  } else {
    totalScore *= 0.8;
  }

  // Ensure score is within 0-100 range
  return Math.max(0, Math.min(100, totalScore));
}

// Maps Supabase Candidates interface to the frontend Candidate interface
export const mapSupabaseCandidateToFrontend = (supabaseCandidate: Candidates): Candidate => {
  // Calculate custom match score instead of using the original one
  const customMatchScore = calculateCustomMatchScore(supabaseCandidate);
  
  return {
    id: supabaseCandidate.id,
    fullName: supabaseCandidate.nombre_completo,
    professionalTitle: supabaseCandidate.titulo_profesional,
    seniority: mapSeniority(supabaseCandidate.nivel_seniority),
    mainStack: supabaseCandidate.stack_principal,
    matchScore: Math.round(customMatchScore * 100) / 100, // Round to 2 decimal places
    processStatus: mapProcessStatus(supabaseCandidate.estado_del_proceso),
    email: supabaseCandidate.email,
    phone: supabaseCandidate.telefono,
    location: supabaseCandidate.ubicacion,
    remoteAvailable: supabaseCandidate.disponibilidad_remota ?? false,
    pdfUrl: supabaseCandidate.pdf_url,
    linkedinUrl: supabaseCandidate.linkedin_url,
    githubUrl: supabaseCandidate.github_url,
    portfolioUrl: supabaseCandidate.portfolio_url,
    workExperience: mapWorkExperience(supabaseCandidate.experiencia_laboral),
    technicalStack: {
      languages: supabaseCandidate.lenguajes_programacion,
      frameworks: supabaseCandidate.frameworks_principales,
      databases: supabaseCandidate.bases_datos || [],
      tools: supabaseCandidate.herramientas_devops,
      cloud: supabaseCandidate.cloud_platforms || []
    },
    softSkills: supabaseCandidate.soft_skills,
    notes: supabaseCandidate.recomendaciones,
    interviews: [], // Would need to be fetched separately if needed
    createdAt: supabaseCandidate.created_at.toString(),
    updatedAt: supabaseCandidate.updated_at.toString()
  }
}

// Helper function to map seniority levels
const mapSeniority = (seniority: string): 'Junior' | 'Semi-Senior' | 'Senior' | 'Lead' => {
  switch (seniority.toLowerCase()) {
    case 'junior':
      return 'Junior'
    case 'semi-senior':
    case 'semi senior':
    case 'mid':
    case 'middle':
      return 'Semi-Senior'
    case 'senior':
      return 'Senior'
    case 'lead':
    case 'tech lead':
    case 'technical lead':
      return 'Lead'
    default:
      return 'Junior' // default fallback
  }
}

// Helper function to map process status
const mapProcessStatus = (status: string): 'pendiente' | 'revisado' | 'entrevista' | 'rechazado' | 'contratado' => {
  switch (status.toLowerCase()) {
    case 'pendiente':
    case 'pending':
      return 'pendiente'
    case 'revisado':
    case 'reviewed':
      return 'revisado'
    case 'entrevista':
    case 'interview':
    case 'interviewing':
      return 'entrevista'
    case 'rechazado':
    case 'rejected':
      return 'rechazado'
    case 'contratado':
    case 'hired':
      return 'contratado'
    default:
      return 'pendiente' // default fallback
  }
}

// Helper function to map work experience
const mapWorkExperience = (experienciaLaboral: any[]): any[] => {
  if (!experienciaLaboral || !Array.isArray(experienciaLaboral)) {
    return []
  }

  return experienciaLaboral.map((exp, index) => ({
    id: `exp-${index}`,
    company: exp.empresa || '',
    position: exp.puesto || '',
    startDate: exp.fechas?.split(' - ')[0] || '',
    endDate: exp.fechas?.split(' - ')[1] || undefined,
    description: exp.descripcion || '',
    technologies: [] // This would need to be extracted from description if available
  }))
}