import { z } from "zod"

// Chilean cities for location dropdown
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
  "San Antonio",
  "Melipilla",
  "Curicó",
  "Linares",
  "Ovalle",
  "Calama",
  "Copiapó",
] as const

// Chilean universities
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
  "Universidad Católica de Valparaíso",
  "Universidad de Antofagasta",
  "Universidad de La Serena",
  "Universidad de Magallanes",
  "Universidad de Tarapacá",
  "Universidad Católica de Temuco",
  "Universidad Católica del Maule",
  "Universidad de Atacama",
  "Universidad Arturo Prat",
] as const

// Skill categories
export const SKILL_CATEGORIES = [
  "Programación",
  "Diseño",
  "Marketing",
  "Gestión",
  "Idiomas",
  "Herramientas",
  "Otros",
] as const

// Skill levels
export const SKILL_LEVELS = ["Básico", "Intermedio", "Avanzado", "Experto"] as const

// Language levels
export const LANGUAGE_LEVELS = ["Básico", "Intermedio", "Avanzado", "Nativo"] as const

// Zod schemas
export const PersonalInfoSchema = z.object({
  fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(8, "Teléfono debe tener al menos 8 dígitos"),
  city: z.enum(CHILEAN_CITIES, { required_error: "Selecciona una ciudad" }),
  address: z.string().optional(),
  linkedin: z.string().url("URL de LinkedIn inválida").optional().or(z.literal("")),
  github: z.string().url("URL de GitHub inválida").optional().or(z.literal("")),
  website: z.string().url("URL de sitio web inválida").optional().or(z.literal("")),
  summary: z.string().max(500, "El resumen no puede exceder 500 caracteres").optional(),
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
  description: z.string().optional(),
})

export const ExperienceSchema = z.object({
  id: z.string(),
  company: z.string().min(2, "Empresa requerida"),
  position: z.string().min(2, "Cargo requerido"),
  startDate: z.string().min(1, "Fecha de inicio requerida"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
  achievements: z.array(z.string()).default([]),
})

export const SkillSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nombre de habilidad requerido"),
  category: z.enum(SKILL_CATEGORIES),
  level: z.enum(SKILL_LEVELS),
})

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Nombre del proyecto requerido"),
  description: z.string().min(10, "Descripción debe tener al menos 10 caracteres"),
  technologies: z.array(z.string()).default([]),
  url: z.string().url("URL inválida").optional().or(z.literal("")),
  github: z.string().url("URL de GitHub inválida").optional().or(z.literal("")),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export const CertificationSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Nombre de certificación requerido"),
  issuer: z.string().min(2, "Emisor requerido"),
  date: z.string().min(1, "Fecha requerida"),
  url: z.string().url("URL inválida").optional().or(z.literal("")),
  description: z.string().optional(),
})

export const LanguageSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Nombre del idioma requerido"),
  level: z.enum(LANGUAGE_LEVELS),
})

export const CVDataSchema = z.object({
  personalInfo: PersonalInfoSchema,
  education: z.array(EducationSchema).default([]),
  experience: z.array(ExperienceSchema).default([]),
  skills: z.array(SkillSchema).default([]),
  projects: z.array(ProjectSchema).default([]),
  certifications: z.array(CertificationSchema).default([]),
  languages: z.array(LanguageSchema).default([]),
})

// TypeScript types
export type PersonalInfo = z.infer<typeof PersonalInfoSchema>
export type Education = z.infer<typeof EducationSchema>
export type Experience = z.infer<typeof ExperienceSchema>
export type Skill = z.infer<typeof SkillSchema>
export type Project = z.infer<typeof ProjectSchema>
export type Certification = z.infer<typeof CertificationSchema>
export type Language = z.infer<typeof LanguageSchema>
export type CVData = z.infer<typeof CVDataSchema>

// Utility functions
export const getCompletionPercentage = (data: Partial<CVData>): number => {
  let completed = 0
  const total = 7

  if (data.personalInfo?.fullName && data.personalInfo?.email && data.personalInfo?.phone) {
    completed += 1
  }
  if (data.education && data.education.length > 0) completed += 1
  if (data.experience && data.experience.length > 0) completed += 1
  if (data.skills && data.skills.length > 0) completed += 1
  if (data.projects && data.projects.length > 0) completed += 1
  if (data.certifications && data.certifications.length > 0) completed += 1
  if (data.languages && data.languages.length > 0) completed += 1

  return Math.round((completed / total) * 100)
}

export const formatDate = (dateString: string): string => {
  if (!dateString) return ""
  const date = new Date(dateString)
  return date.toLocaleDateString("es-CL", { year: "numeric", month: "long" })
}

export const calculateExperience = (experiences: Experience[]): string => {
  if (!experiences.length) return "0 años"

  let totalMonths = 0
  experiences.forEach((exp) => {
    const start = new Date(exp.startDate)
    const end = exp.current ? new Date() : new Date(exp.endDate || new Date())
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
    totalMonths += months
  })

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  if (years === 0) return `${months} meses`
  if (months === 0) return `${years} años`
  return `${years} años, ${months} meses`
}

// Default empty CV data
export const getEmptyCV = (): CVData => ({
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    city: "Santiago" as const,
    address: "",
    linkedin: "",
    github: "",
    website: "",
    summary: "",
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
})
