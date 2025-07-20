export interface Candidates {
    id:                        string;
    created_at:                Date;
    updated_at:                Date;
    is_qualified:              boolean;
    reason:                    string;
    match_score:               number;
    match_details:             MatchDetails;
    disponibilidad_remota:     null;
    disponibilidad_traslado:   null;
    ultimo_trabajo_finalizado: string;
    tipo_posicion_preferida:   string;
    recomendaciones:           string;
    distribucion_skills:       DistribucionSkills;
    cumple_requisitos_basicos: boolean;
    name:                      string;
    nombre_completo:           string;
    email:                     string;
    telefono:                  string;
    ubicacion:                 string;
    titulo_profesional:        string;
    anos_experiencia:          number;
    nivel_seniority:           string;
    perfil_profesional:        string;
    resumen_profesional:       string;
    stack_principal:           string[];
    lenguajes_programacion:    string[];
    frameworks_principales:    string[];
    bases_datos:               string[];
    cloud_platforms:           string[];
    herramientas_devops:       string[];
    metodologias_agile:        string[];
    soft_skills:               string[];
    experiencia_laboral:       ExperienciaLaboral[];
    educacion:                 string;
    proyectos_destacados:      string[];
    certificaciones:           string[];
    english_level:             string;
    linkedin_url:              string;
    github_url:                string;
    portfolio_url:             string;
    keywords_tech:             string[];
    pdf_url:                   string;
    estado_del_proceso:        string;
    clerk_id:                  string;
}

export interface DistribucionSkills {
    data:     number;
    devops:   number;
    backend:  number;
    frontend: number;
    gestión:  number;
}

export interface ExperienciaLaboral {
    fechas:      string;
    puesto:      string;
    empresa:     string;
    ubicacion:   string;
    descripcion: string;
}

export interface MatchDetails {
    liderazgo:                  boolean;
    nivel_ingles:               boolean;
    stack_requerido:            boolean;
    experiencia_minima:         boolean;
    certificaciones_relevantes: boolean;
}
