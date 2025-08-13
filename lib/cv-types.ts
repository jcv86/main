// CV Builder Types
export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  linkedIn?: string
  website?: string
  summary: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  current: boolean
  gpa?: string
  description?: string
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  achievements: string[]
}

export interface Skill {
  id: string
  name: string
  level: "Básico" | "Intermedio" | "Avanzado" | "Experto"
  category: "Técnica" | "Blanda" | "Idioma"
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  url?: string
  startDate: string
  endDate: string
  current: boolean
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  expiryDate?: string
  credentialId?: string
  url?: string
}

export interface Language {
  id: string
  name: string
  level: "Básico" | "Intermedio" | "Avanzado" | "Nativo"
}

export interface Reference {
  id: string
  name: string
  position: string
  company: string
  email: string
  phone: string
  relationship: string
}

export interface CVData {
  personalInfo: PersonalInfo
  education: Education[]
  experience: Experience[]
  skills: Skill[]
  projects: Project[]
  certifications: Certification[]
  languages: Language[]
  references: Reference[]
}

export interface CVTemplate {
  id: string
  name: string
  description: string
  preview: string
  category: "Moderno" | "Clásico" | "Creativo" | "Minimalista"
  colors: string[]
  fonts: string[]
}

// Utility function to generate unique IDs
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// Chilean specific data
export const chileanCities = [
  "Santiago",
  "Valparaíso",
  "Viña del Mar",
  "Concepción",
  "La Serena",
  "Antofagasta",
  "Temuco",
  "Rancagua",
  "Talca",
  "Arica",
  "Chillán",
  "Iquique",
  "Los Ángeles",
  "Puerto Montt",
  "Calama",
  "Copiapó",
  "Osorno",
  "Quillota",
  "Valdivia",
  "Punta Arenas",
  "San Antonio",
  "Melipilla",
  "Curicó",
  "Linares",
  "Ovalle",
  "San Fernando",
  "Talagante",
  "Cauquenes",
  "Parral",
  "Illapel",
]

export const chileanUniversities = [
  "Universidad de Chile",
  "Pontificia Universidad Católica de Chile",
  "Universidad de Santiago de Chile (USACH)",
  "Universidad de Concepción",
  "Universidad Técnica Federico Santa María",
  "Universidad Austral de Chile",
  "Universidad Católica de Valparaíso",
  "Universidad de La Frontera",
  "Universidad de Talca",
  "Universidad de Antofagasta",
  "Universidad de La Serena",
  "Universidad del Bío-Bío",
  "Universidad de Magallanes",
  "Universidad de Atacama",
  "Universidad de Tarapacá",
  "Universidad Católica del Norte",
  "Universidad Católica de Temuco",
  "Universidad Católica del Maule",
  "Universidad de Los Lagos",
  "Universidad Arturo Prat",
  "Universidad Metropolitana de Ciencias de la Educación",
  "Universidad Tecnológica Metropolitana",
  "Universidad de Playa Ancha",
  "Universidad de Valparaíso",
  "Universidad Alberto Hurtado",
  "Universidad Diego Portales",
  "Universidad Adolfo Ibáñez",
  "Universidad del Desarrollo",
  "Universidad de los Andes",
  "Universidad Finis Terrae",
  "Universidad Mayor",
  "Universidad Central de Chile",
  "Universidad de Las Américas",
  "Universidad San Sebastián",
  "Universidad Andrés Bello",
  "Universidad Santo Tomás",
  "Universidad Bernardo O'Higgins",
  "Universidad Academia de Humanismo Cristiano",
  "Universidad ARCIS",
  "Universidad Bolivariana",
  "Universidad de Arte y Ciencias Sociales (UARCIS)",
  "Universidad de Ciencias de la Informática",
  "Universidad Gabriela Mistral",
  "Universidad Internacional SEK",
  "Universidad La República",
  "Universidad Miguel de Cervantes",
  "Universidad Pedro de Valdivia",
  "Universidad Tecnológica de Chile INACAP",
  "Universidad UNIACC",
  "Universidad Viña del Mar",
  "Duoc UC",
  "Instituto Profesional AIEP",
  "Instituto Profesional INACAP",
  "Instituto Profesional La Araucana",
  "Instituto Profesional Santo Tomás",
  "Centro de Formación Técnica INACAP",
  "Centro de Formación Técnica Santo Tomás",
]

// Common skills in Chile by category
export const commonSkillsChile = {
  technical: [
    // Programming Languages
    "JavaScript",
    "Python",
    "Java",
    "C#",
    "PHP",
    "TypeScript",
    "C++",
    "Ruby",
    "Go",
    "Swift",
    "Kotlin",
    "Scala",

    // Web Development
    "HTML/CSS",
    "React",
    "Angular",
    "Vue.js",
    "Node.js",
    "Express.js",
    "Next.js",
    "Laravel",
    "Django",
    "Flask",
    "Spring Boot",
    "ASP.NET",

    // Mobile Development
    "React Native",
    "Flutter",
    "iOS Development",
    "Android Development",
    "Xamarin",
    "Ionic",

    // Databases
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "Oracle",
    "SQL Server",
    "Redis",
    "Elasticsearch",
    "Firebase",

    // Cloud & DevOps
    "AWS",
    "Azure",
    "Google Cloud",
    "Docker",
    "Kubernetes",
    "Jenkins",
    "GitLab CI/CD",
    "Terraform",
    "Ansible",

    // Data & Analytics
    "Power BI",
    "Tableau",
    "Excel Avanzado",
    "R",
    "SPSS",
    "SAS",
    "Apache Spark",
    "Hadoop",
    "Machine Learning",
    "Data Science",

    // Design & UX
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Figma",
    "Sketch",
    "Adobe XD",
    "InDesign",
    "After Effects",
    "Canva",
    "UI/UX Design",

    // Business & Finance
    "SAP",
    "Salesforce",
    "QuickBooks",
    "Contabilidad",
    "Análisis Financiero",
    "Auditoría",
    "Gestión de Proyectos",
    "Scrum",
    "Agile",

    // Marketing Digital
    "Google Analytics",
    "Google Ads",
    "Facebook Ads",
    "SEO",
    "SEM",
    "Marketing de Contenidos",
    "Email Marketing",
    "Social Media Management",

    // Other Technical
    "AutoCAD",
    "SolidWorks",
    "MATLAB",
    "Photoshop",
    "Premiere Pro",
    "Final Cut Pro",
    "Logic Pro",
    "Pro Tools",
  ],

  soft: [
    // Communication
    "Comunicación Efectiva",
    "Presentaciones Públicas",
    "Negociación",
    "Escritura Técnica",
    "Comunicación Intercultural",

    // Leadership
    "Liderazgo",
    "Gestión de Equipos",
    "Mentoring",
    "Delegación",
    "Toma de Decisiones",
    "Resolución de Conflictos",

    // Problem Solving
    "Pensamiento Crítico",
    "Resolución de Problemas",
    "Análisis",
    "Creatividad",
    "Innovación",
    "Pensamiento Estratégico",

    // Collaboration
    "Trabajo en Equipo",
    "Colaboración",
    "Networking",
    "Construcción de Relaciones",
    "Empatía",
    "Inteligencia Emocional",

    // Adaptability
    "Adaptabilidad",
    "Flexibilidad",
    "Gestión del Cambio",
    "Aprendizaje Continuo",
    "Resiliencia",
    "Tolerancia al Estrés",

    // Organization
    "Gestión del Tiempo",
    "Organización",
    "Planificación",
    "Multitasking",
    "Atención al Detalle",
    "Orientación a Resultados",

    // Customer Service
    "Atención al Cliente",
    "Orientación al Servicio",
    "Manejo de Quejas",
    "Ventas",
    "Persuasión",

    // Personal Qualities
    "Proactividad",
    "Iniciativa",
    "Responsabilidad",
    "Confiabilidad",
    "Ética Profesional",
    "Confidencialidad",
  ],

  languages: [
    "Español (Nativo)",
    "Inglés",
    "Portugués",
    "Francés",
    "Alemán",
    "Italiano",
    "Chino Mandarín",
    "Japonés",
    "Coreano",
    "Árabe",
    "Ruso",
    "Mapudungun",
  ],
}

// Common degree fields in Chile
export const commonDegreeFields = [
  // Engineering
  "Ingeniería Civil",
  "Ingeniería Comercial",
  "Ingeniería Industrial",
  "Ingeniería Informática",
  "Ingeniería en Sistemas",
  "Ingeniería Civil Industrial",
  "Ingeniería Civil Informática",
  "Ingeniería Civil Electrónica",
  "Ingeniería Civil Mecánica",
  "Ingeniería Civil Química",
  "Ingeniería en Construcción",
  "Ingeniería en Minas",
  "Ingeniería Forestal",
  "Ingeniería Agronómica",

  // Business & Economics
  "Administración de Empresas",
  "Contador Auditor",
  "Economía",
  "Marketing",
  "Recursos Humanos",
  "Finanzas",
  "Comercio Internacional",
  "Gestión de Negocios",

  // Health Sciences
  "Medicina",
  "Enfermería",
  "Kinesiología",
  "Psicología",
  "Odontología",
  "Farmacia",
  "Nutrición y Dietética",
  "Fonoaudiología",
  "Terapia Ocupacional",
  "Medicina Veterinaria",

  // Education
  "Pedagogía en Educación Básica",
  "Pedagogía en Educación Media",
  "Pedagogía en Inglés",
  "Pedagogía en Matemáticas",
  "Pedagogía en Historia",
  "Educación Parvularia",
  "Educación Diferencial",

  // Social Sciences
  "Derecho",
  "Trabajo Social",
  "Sociología",
  "Antropología",
  "Ciencia Política",
  "Relaciones Internacionales",
  "Periodismo",
  "Comunicación Audiovisual",

  // Arts & Design
  "Diseño Gráfico",
  "Arquitectura",
  "Arte",
  "Música",
  "Teatro",
  "Cine",
  "Diseño Industrial",
  "Diseño de Interiores",

  // Sciences
  "Biología",
  "Química",
  "Física",
  "Matemáticas",
  "Geología",
  "Geografía",
  "Estadística",

  // Technology
  "Ingeniería en Informática",
  "Analista Programador",
  "Técnico en Computación",
  "Diseño Web",
  "Redes y Telecomunicaciones",

  // Other Professional
  "Turismo",
  "Gastronomía",
  "Hotelería",
  "Deportes",
  "Bibliotecología",
]

// Job-related types
export interface JobPosting {
  id: string
  title: string
  company: string
  location: string
  salary?: string
  type: "Tiempo Completo" | "Medio Tiempo" | "Contrato" | "Freelance"
  description: string
  requirements: string[]
  benefits: string[]
  postedDate: string
  applicationDeadline?: string
  remote: boolean
  experience: "Sin experiencia" | "1-2 años" | "3-5 años" | "5+ años"
  education: "Sin requisitos" | "Técnico" | "Universitario" | "Postgrado"
}

export interface JobApplication {
  id: string
  jobId: string
  userId: string
  cvId: string
  coverLetter: string
  status: "Enviada" | "En revisión" | "Entrevista" | "Rechazada" | "Aceptada"
  appliedDate: string
  lastUpdated: string
}

// Assessment types
export interface AssessmentResult {
  id: string
  userId: string
  type: "technical" | "soft-skills" | "personality" | "disc"
  score: number
  maxScore: number
  completedAt: string
  results: Record<string, any>
}

export interface TechnicalSkillAssessment {
  skill: string
  level: number
  questions: number
  correctAnswers: number
  timeSpent: number
}

export interface PersonalityTraits {
  openness: number
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
}

export interface DISCProfile {
  dominance: number
  influence: number
  steadiness: number
  conscientiousness: number
  primaryType: "D" | "I" | "S" | "C"
  description: string
}

// CV Template types
export type CVTemplateType = "modern" | "classic" | "creative" | "minimal"

export interface CVTemplateConfig {
  id: CVTemplateType
  name: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
    text: string
    background: string
  }
  fonts: {
    heading: string
    body: string
  }
  layout: "single-column" | "two-column" | "sidebar"
}

// Default CV templates
export const cvTemplates: CVTemplateConfig[] = [
  {
    id: "modern",
    name: "Moderno",
    description: "Diseño limpio y contemporáneo con acentos de color",
    colors: {
      primary: "#2563eb",
      secondary: "#64748b",
      accent: "#0ea5e9",
      text: "#1e293b",
      background: "#ffffff",
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
    layout: "two-column",
  },
  {
    id: "classic",
    name: "Clásico",
    description: "Formato tradicional y profesional",
    colors: {
      primary: "#1f2937",
      secondary: "#6b7280",
      accent: "#374151",
      text: "#111827",
      background: "#ffffff",
    },
    fonts: {
      heading: "Times New Roman",
      body: "Times New Roman",
    },
    layout: "single-column",
  },
  {
    id: "creative",
    name: "Creativo",
    description: "Diseño innovador para profesionales creativos",
    colors: {
      primary: "#7c3aed",
      secondary: "#a78bfa",
      accent: "#8b5cf6",
      text: "#1f2937",
      background: "#ffffff",
    },
    fonts: {
      heading: "Poppins",
      body: "Open Sans",
    },
    layout: "sidebar",
  },
  {
    id: "minimal",
    name: "Minimalista",
    description: "Enfoque simple y elegante",
    colors: {
      primary: "#000000",
      secondary: "#6b7280",
      accent: "#374151",
      text: "#111827",
      background: "#ffffff",
    },
    fonts: {
      heading: "Helvetica",
      body: "Helvetica",
    },
    layout: "single-column",
  },
]
