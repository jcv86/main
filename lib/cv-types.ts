export interface PersonalInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  city: string
  summary: string
  linkedin?: string
  website?: string
  github?: string
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
  location: string
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
  category: "Técnica" | "Blanda" | "Idioma" | "Herramienta"
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  url?: string
  github?: string
  startDate: string
  endDate: string
  current: boolean
  achievements: string[]
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
  certification?: string
}

export interface CVData {
  personalInfo: PersonalInfo
  experiences: Experience[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
  certifications: Certification[]
  languages: Language[]
}

// Datos específicos de Chile
export const CHILEAN_CITIES = [
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
  "Valdivia",
  "Osorno",
  "Quillota",
  "Curicó",
  "Copiapó",
  "Calama",
]

export const CHILEAN_UNIVERSITIES = [
  "Universidad de Chile",
  "Pontificia Universidad Católica de Chile",
  "Universidad de Santiago de Chile",
  "Universidad de Concepción",
  "Universidad Técnica Federico Santa María",
  "Universidad del Desarrollo",
  "Universidad Adolfo Ibáñez",
  "Universidad Diego Portales",
  "Universidad Mayor",
  "Universidad Central de Chile",
  "Universidad de Los Andes",
  "Universidad Católica del Norte",
  "Universidad de La Frontera",
  "Universidad Austral de Chile",
  "Universidad de Valparaíso",
  "Universidad de Antofagasta",
  "Universidad de Atacama",
  "Universidad de Magallanes",
  "Universidad de Tarapacá",
  "Universidad Católica de Temuco",
  "Universidad Católica de la Santísima Concepción",
  "Universidad Católica del Maule",
  "INACAP",
  "DUOC UC",
]

export const COMMON_SKILLS = [
  // Técnicas
  "JavaScript",
  "Python",
  "Java",
  "React",
  "Node.js",
  "SQL",
  "HTML/CSS",
  "Git",
  "Docker",
  "AWS",
  "Excel Avanzado",
  "Power BI",
  "Tableau",
  "Photoshop",
  "AutoCAD",

  // Blandas
  "Liderazgo",
  "Trabajo en Equipo",
  "Comunicación Efectiva",
  "Resolución de Problemas",
  "Pensamiento Crítico",
  "Adaptabilidad",
  "Gestión del Tiempo",
  "Creatividad",
  "Negociación",
  "Atención al Cliente",
  "Planificación Estratégica",
  "Análisis de Datos",
]

export const LANGUAGES = [
  "Español",
  "Inglés",
  "Francés",
  "Alemán",
  "Italiano",
  "Portugués",
  "Chino Mandarín",
  "Japonés",
  "Mapudungun",
]
