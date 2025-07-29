import { z } from "zod"

// Validation schemas
export const personalInfoSchema = z.object({
  fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(8, "Teléfono debe tener al menos 8 dígitos"),
  location: z.string().min(2, "Ubicación requerida"),
  linkedIn: z.string().url("URL de LinkedIn inválida").optional().or(z.literal("")),
  website: z.string().url("URL del sitio web inválida").optional().or(z.literal("")),
  summary: z
    .string()
    .min(50, "El resumen debe tener al menos 50 caracteres")
    .max(500, "El resumen no puede exceder 500 caracteres"),
})

// Types
export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  linkedIn?: string
  website?: string
  summary: string
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  location: string
  achievements: string[]
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
  honors?: string
  relevantCourses: string[]
}

export interface Skill {
  name: string
  level: "Básico" | "Intermedio" | "Avanzado" | "Experto"
  category: "technical" | "soft"
}

export interface Language {
  name: string
  level: "Básico" | "Intermedio" | "Avanzado" | "Nativo"
  certifications: string[]
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  startDate: string
  endDate: string
  current: boolean
  url?: string
  github?: string
  role: string
  teamSize?: number
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
  skills: string[]
}

export interface CVData {
  personalInfo: PersonalInfo
  experience: Experience[]
  education: Education[]
  skills: {
    technical: Skill[]
    soft: Skill[]
    languages: Language[]
  }
  projects: Project[]
  certifications: Certification[]
}

export type CVTemplate = "modern" | "classic" | "creative" | "minimal"

// Constants
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
  "Universidad del Desarrollo",
  "Universidad Diego Portales",
  "Universidad Adolfo Ibáñez",
  "Universidad de los Andes",
  "Universidad Mayor",
  "Universidad Central de Chile",
  "Universidad de Talca",
  "Universidad de La Frontera",
  "Universidad Católica del Norte",
  "Universidad de Valparaíso",
  "Universidad de Antofagasta",
  "Universidad de Magallanes",
  "Universidad de Tarapacá",
  "Universidad Católica de Temuco",
  "Universidad Católica de la Santísima Concepción",
]

export const commonSkillsChile = [
  // Technical Skills
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
  "SAP",
  "Salesforce",

  // Soft Skills
  "Liderazgo",
  "Trabajo en Equipo",
  "Comunicación Efectiva",
  "Resolución de Problemas",
  "Pensamiento Crítico",
  "Adaptabilidad",
  "Gestión del Tiempo",
  "Negociación",
  "Presentaciones",
  "Servicio al Cliente",
  "Gestión de Proyectos",
  "Análisis de Datos",
  "Planificación Estratégica",
  "Innovación",
  "Mentoring",
]

// Utility functions
export const generateId = () => Math.random().toString(36).substr(2, 9)

export const formatDate = (dateString: string) => {
  if (!dateString) return ""
  const [year, month] = dateString.split("-")
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]
  return `${monthNames[Number.parseInt(month) - 1]} ${year}`
}

export const calculateExperience = (experiences: Experience[]) => {
  let totalMonths = 0

  experiences.forEach((exp) => {
    const startDate = new Date(exp.startDate + "-01")
    const endDate = exp.current ? new Date() : new Date(exp.endDate + "-01")

    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth())

    totalMonths += months
  })

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  if (years === 0) return `${months} meses`
  if (months === 0) return `${years} años`
  return `${years} años, ${months} meses`
}
