import { z } from "zod"

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
  "Quilpué",
  "Villa Alemana",
  "Curicó",
  "Melipilla",
  "Calama",
  "Copiapó",
  "Quillota",
  "San Antonio",
  "Linares",
]

export const CHILEAN_UNIVERSITIES = [
  "Universidad de Chile",
  "Pontificia Universidad Católica de Chile",
  "Universidad de Santiago de Chile",
  "Universidad de Concepción",
  "Universidad Técnica Federico Santa María",
  "Universidad Austral de Chile",
  "Universidad Católica del Norte",
  "Universidad de La Frontera",
  "Universidad de Talca",
  "Universidad de Valparaíso",
  "Universidad del Bío-Bío",
  "Universidad de Antofagasta",
  "Universidad de Atacama",
  "Universidad de Magallanes",
  "Universidad Católica de Valparaíso",
  "Universidad Católica de Temuco",
  "Universidad Católica del Maule",
  "Universidad de Tarapacá",
  "Universidad Arturo Prat",
  "Universidad de Los Lagos",
]

export const SKILL_CATEGORIES = [
  "Programación",
  "Diseño",
  "Marketing",
  "Ventas",
  "Gestión",
  "Comunicación",
  "Análisis",
  "Liderazgo",
  "Idiomas",
  "Herramientas",
  "Certificaciones",
]

// Esquemas de validación
export const PersonalInfoSchema = z.object({
  firstName: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "Apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(8, "Teléfono debe tener al menos 8 dígitos"),
  city: z.string().min(2, "Ciudad requerida"),
  address: z.string().optional(),
  linkedIn: z.string().url("URL de LinkedIn inválida").optional().or(z.literal("")),
  github: z.string().url("URL de GitHub inválida").optional().or(z.literal("")),
  portfolio: z.string().url("URL de portafolio inválida").optional().or(z.literal("")),
  summary: z.string().min(50, "Resumen debe tener al menos 50 caracteres").max(500, "Resumen muy largo"),
})

export const ExperienceSchema = z.object({
  id: z.string(),
  company: z.string().min(2, "Nombre de empresa requerido"),
  position: z.string().min(2, "Cargo requerido"),
  startDate: z.string().min(1, "Fecha de inicio requerida"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().min(20, "Descripción debe tener al menos 20 caracteres"),
  achievements: z.array(z.string()).default([]),
  location: z.string().optional(),
})

export const EducationSchema = z.object({
  id: z.string(),
  institution: z.string().min(2, "Institución requerida"),
  degree: z.string().min(2, "Título requerido"),
  field: z.string().min(2, "Campo de estudio requerido"),
  startDate: z.string().min(1, "Fecha de inicio requerida"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  gpa: z.string().optional(),
  honors: z.string().optional(),
  description: z.string().optional(),
})

export const SkillSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nombre de habilidad requerido"),
  level: z.enum(["Básico", "Intermedio", "Avanzado", "Experto"]),
  category: z.string().min(1, "Categoría requerida"),
  yearsOfExperience: z.number().min(0).max(50).optional(),
})

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Nombre del proyecto requerido"),
  description: z.string().min(20, "Descripción debe tener al menos 20 caracteres"),
  technologies: z.array(z.string()).min(1, "Al menos una tecnología requerida"),
  startDate: z.string().min(1, "Fecha de inicio requerida"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  url: z.string().url("URL inválida").optional().or(z.literal("")),
  github: z.string().url("URL de GitHub inválida").optional().or(z.literal("")),
  role: z.string().optional(),
  teamSize: z.number().min(1).optional(),
})

export const CertificationSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Nombre de certificación requerido"),
  issuer: z.string().min(2, "Emisor requerido"),
  date: z.string().min(1, "Fecha requerida"),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
  url: z.string().url("URL inválida").optional().or(z.literal("")),
})

export const LanguageSchema = z.object({
  id: z.string(),
  language: z.string().min(2, "Idioma requerido"),
  level: z.enum(["Básico", "Intermedio", "Avanzado", "Nativo", "Bilingüe"]),
  certification: z.string().optional(),
})

export const CVDataSchema = z.object({
  personalInfo: PersonalInfoSchema,
  experience: z.array(ExperienceSchema).default([]),
  education: z.array(EducationSchema).default([]),
  skills: z.array(SkillSchema).default([]),
  projects: z.array(ProjectSchema).default([]),
  certifications: z.array(CertificationSchema).default([]),
  languages: z.array(LanguageSchema).default([]),
})

// Tipos derivados
export type PersonalInfo = z.infer<typeof PersonalInfoSchema>
export type Experience = z.infer<typeof ExperienceSchema>
export type Education = z.infer<typeof EducationSchema>
export type Skill = z.infer<typeof SkillSchema>
export type Project = z.infer<typeof ProjectSchema>
export type Certification = z.infer<typeof CertificationSchema>
export type Language = z.infer<typeof LanguageSchema>
export type CVData = z.infer<typeof CVDataSchema>

// Funciones utilitarias
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function formatDate(date: string): string {
  if (!date) return ""
  const d = new Date(date)
  return d.toLocaleDateString("es-CL", { year: "numeric", month: "long" })
}

export function calculateExperience(experiences: Experience[]): number {
  let totalMonths = 0

  experiences.forEach((exp) => {
    const start = new Date(exp.startDate)
    const end = exp.current ? new Date() : new Date(exp.endDate || new Date())
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
    totalMonths += Math.max(0, months)
  })

  return Math.round((totalMonths / 12) * 10) / 10 // Años con 1 decimal
}

export function getCompletionPercentage(data: CVData): number {
  let completed = 0
  const total = 7 // Total sections

  // Personal info (required)
  if (
    data.personalInfo.firstName &&
    data.personalInfo.lastName &&
    data.personalInfo.email &&
    data.personalInfo.phone &&
    data.personalInfo.summary
  ) {
    completed++
  }

  // Experience
  if (data.experience.length > 0) completed++

  // Education
  if (data.education.length > 0) completed++

  // Skills
  if (data.skills.length > 0) completed++

  // Projects (optional but recommended)
  if (data.projects.length > 0) completed++

  // Certifications (optional)
  if (data.certifications.length > 0) completed++

  // Languages (optional)
  if (data.languages.length > 0) completed++

  return Math.round((completed / total) * 100)
}

export const DEFAULT_CV_DATA: CVData = {
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    linkedIn: "",
    github: "",
    portfolio: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
}
