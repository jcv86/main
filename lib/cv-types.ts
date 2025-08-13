// CV Types and Utilities for Chilean Market

export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  city: string
  address?: string
  linkedIn?: string
  website?: string
  summary?: string
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  achievements?: string[]
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
  technologies?: string[]
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
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
  certifications: Certification[]
  languages: Language[]
  references: Reference[]
}

// Chilean-specific data
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
]

export const chileanUniversities = [
  "Universidad de Chile",
  "Pontificia Universidad Católica de Chile",
  "Universidad de Santiago de Chile",
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
  "Universidad de Tarapacá",
  "Universidad de Atacama",
  "Universidad Metropolitana de Ciencias de la Educación",
  "Universidad de Playa Ancha",
  "Universidad Tecnológica Metropolitana",
  "Universidad de Los Lagos",
  "Universidad Arturo Prat",
]

export const commonSkillsChile = {
  technical: [
    "JavaScript",
    "Python",
    "Java",
    "React",
    "Node.js",
    "SQL",
    "HTML/CSS",
    "TypeScript",
    "PHP",
    "C#",
    "Angular",
    "Vue.js",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Git",
    "Docker",
    "AWS",
    "Azure",
    "Google Cloud",
    "Linux",
    "Windows Server",
    "Kubernetes",
    "Jenkins",
    "Terraform",
    "Ansible",
    "Redis",
    "Elasticsearch",
    "GraphQL",
    "REST APIs",
    "Microservices",
    "DevOps",
    "CI/CD",
    "Agile",
    "Scrum",
    "Kanban",
    "JIRA",
    "Confluence",
    "Slack",
    "Microsoft Office",
    "Excel Avanzado",
    "Power BI",
    "Tableau",
    "SAP",
    "Salesforce",
    "HubSpot",
    "Google Analytics",
    "Adobe Creative Suite",
    "Figma",
    "Sketch",
    "AutoCAD",
    "SolidWorks",
    "MATLAB",
    "R",
    "Stata",
    "SPSS",
  ],
  soft: [
    "Liderazgo",
    "Trabajo en Equipo",
    "Comunicación Efectiva",
    "Resolución de Problemas",
    "Pensamiento Crítico",
    "Adaptabilidad",
    "Gestión del Tiempo",
    "Orientación a Resultados",
    "Creatividad",
    "Innovación",
    "Negociación",
    "Presentaciones",
    "Servicio al Cliente",
    "Ventas",
    "Marketing",
    "Gestión de Proyectos",
    "Planificación Estratégica",
    "Análisis de Datos",
    "Toma de Decisiones",
    "Mentoring",
    "Coaching",
    "Delegación",
    "Motivación de Equipos",
    "Gestión del Cambio",
    "Inteligencia Emocional",
    "Empatía",
    "Escucha Activa",
    "Feedback Constructivo",
    "Networking",
    "Relaciones Interpersonales",
  ],
  languages: [
    "Español",
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

// Utility functions
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function getDefaultCVData(): CVData {
  return {
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      city: "",
      address: "",
      linkedIn: "",
      website: "",
      summary: "",
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    references: [],
  }
}

export function calculateCVCompletion(cvData: CVData): number {
  let completedSections = 0
  const totalSections = 7

  // Personal Info (required fields)
  if (
    cvData.personalInfo.fullName &&
    cvData.personalInfo.email &&
    cvData.personalInfo.phone &&
    cvData.personalInfo.city
  ) {
    completedSections++
  }

  // Experience
  if (cvData.experience && cvData.experience.length > 0) {
    completedSections++
  }

  // Education
  if (cvData.education && cvData.education.length > 0) {
    completedSections++
  }

  // Skills
  if (cvData.skills && cvData.skills.length > 0) {
    completedSections++
  }

  // Projects (optional but adds value)
  if (cvData.projects && cvData.projects.length > 0) {
    completedSections++
  }

  // Certifications (optional but adds value)
  if (cvData.certifications && cvData.certifications.length > 0) {
    completedSections++
  }

  // Languages
  if (cvData.languages && cvData.languages.length > 0) {
    completedSections++
  }

  return Math.round((completedSections / totalSections) * 100)
}

// Validation functions
export function validatePersonalInfo(personalInfo: PersonalInfo): string[] {
  const errors: string[] = []

  if (!personalInfo.fullName?.trim()) {
    errors.push("El nombre completo es requerido")
  }

  if (!personalInfo.email?.trim()) {
    errors.push("El email es requerido")
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
    errors.push("El formato del email no es válido")
  }

  if (!personalInfo.phone?.trim()) {
    errors.push("El teléfono es requerido")
  }

  if (!personalInfo.city?.trim()) {
    errors.push("La ciudad es requerida")
  }

  return errors
}

export function validateExperience(experience: Experience): string[] {
  const errors: string[] = []

  if (!experience.company?.trim()) {
    errors.push("El nombre de la empresa es requerido")
  }

  if (!experience.position?.trim()) {
    errors.push("El cargo es requerido")
  }

  if (!experience.startDate) {
    errors.push("La fecha de inicio es requerida")
  }

  if (!experience.current && !experience.endDate) {
    errors.push("La fecha de fin es requerida si no es el trabajo actual")
  }

  if (!experience.description?.trim()) {
    errors.push("La descripción es requerida")
  }

  return errors
}

export function validateEducation(education: Education): string[] {
  const errors: string[] = []

  if (!education.institution?.trim()) {
    errors.push("La institución es requerida")
  }

  if (!education.degree?.trim()) {
    errors.push("El título es requerido")
  }

  if (!education.field?.trim()) {
    errors.push("El área de estudio es requerida")
  }

  if (!education.startDate) {
    errors.push("La fecha de inicio es requerida")
  }

  if (!education.current && !education.endDate) {
    errors.push("La fecha de fin es requerida si no está estudiando actualmente")
  }

  return errors
}

export function formatSalary(amount: number, currency = "CLP"): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("es-CL", {
    year: "numeric",
    month: "long",
  })
}

// Export all types and utilities
export type { PersonalInfo, Experience, Education, Skill, Project, Certification, Language, Reference, CVData }
