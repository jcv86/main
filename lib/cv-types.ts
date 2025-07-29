import { z } from "zod"

// Chilean cities for the select dropdown
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
  "Calama",
  "Copiapó",
  "Osorno",
  "Quillota",
  "Valdivia",
  "Punta Arenas",
] as const

// Chilean universities
export const CHILEAN_UNIVERSITIES = [
  "Universidad de Chile",
  "Pontificia Universidad Católica de Chile",
  "Universidad de Santiago de Chile",
  "Universidad de Concepción",
  "Universidad Técnica Federico Santa María",
  "Universidad Austral de Chile",
  "Universidad Católica de Valparaíso",
  "Universidad del Desarrollo",
  "Universidad Diego Portales",
  "Universidad Adolfo Ibáñez",
  "Universidad Mayor",
  "Universidad Central de Chile",
  "Universidad de Los Andes",
  "Universidad Andrés Bello",
  "Universidad de La Frontera",
] as const

// Skill categories
export const SKILL_CATEGORIES = [
  "Programación",
  "Diseño",
  "Marketing",
  "Ventas",
  "Gestión",
  "Comunicación",
  "Idiomas",
  "Análisis",
  "Liderazgo",
  "Otros",
] as const

// Language proficiency levels
export const LANGUAGE_LEVELS = ["Básico", "Intermedio", "Avanzado", "Nativo"] as const

// Personal Information Schema
export const personalInfoSchema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(8, "Teléfono debe tener al menos 8 dígitos"),
  city: z.enum(CHILEAN_CITIES, { required_error: "Selecciona una ciudad" }),
  address: z.string().optional(),
  linkedIn: z.string().url("URL de LinkedIn inválida").optional().or(z.literal("")),
  website: z.string().url("URL del sitio web inválida").optional().or(z.literal("")),
  summary: z
    .string()
    .min(50, "El resumen debe tener al menos 50 caracteres")
    .max(500, "El resumen no puede exceder 500 caracteres"),
})

// Work Experience Schema
export const workExperienceSchema = z.object({
  id: z.string().optional(),
  company: z.string().min(2, "El nombre de la empresa debe tener al menos 2 caracteres"),
  position: z.string().min(2, "El cargo debe tener al menos 2 caracteres"),
  startDate: z.string().min(1, "Fecha de inicio requerida"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().min(20, "La descripción debe tener al menos 20 caracteres"),
  achievements: z.array(z.string()).optional(),
})

// Education Schema
export const educationSchema = z.object({
  id: z.string().optional(),
  institution: z.enum(CHILEAN_UNIVERSITIES, { required_error: "Selecciona una institución" }),
  degree: z.string().min(2, "El título debe tener al menos 2 caracteres"),
  field: z.string().min(2, "El área de estudio debe tener al menos 2 caracteres"),
  startDate: z.string().min(1, "Fecha de inicio requerida"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  gpa: z.string().optional(),
  honors: z.string().optional(),
})

// Skills Schema
export const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "El nombre de la habilidad debe tener al menos 2 caracteres"),
  category: z.enum(SKILL_CATEGORIES, { required_error: "Selecciona una categoría" }),
  level: z.number().min(1).max(5, "El nivel debe estar entre 1 y 5"),
  years: z.number().min(0).max(50, "Los años de experiencia deben estar entre 0 y 50").optional(),
})

// Projects Schema
export const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "El nombre del proyecto debe tener al menos 2 caracteres"),
  description: z.string().min(20, "La descripción debe tener al menos 20 caracteres"),
  technologies: z.array(z.string()).min(1, "Agrega al menos una tecnología"),
  url: z.string().url("URL del proyecto inválida").optional().or(z.literal("")),
  github: z.string().url("URL de GitHub inválida").optional().or(z.literal("")),
  startDate: z.string().min(1, "Fecha de inicio requerida"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
})

// Certifications Schema
export const certificationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "El nombre de la certificación debe tener al menos 2 caracteres"),
  issuer: z.string().min(2, "El emisor debe tener al menos 2 caracteres"),
  date: z.string().min(1, "Fecha de emisión requerida"),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
  url: z.string().url("URL de la certificación inválida").optional().or(z.literal("")),
})

// Languages Schema
export const languageSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "El nombre del idioma debe tener al menos 2 caracteres"),
  level: z.enum(LANGUAGE_LEVELS, { required_error: "Selecciona un nivel" }),
  certified: z.boolean().default(false),
  certification: z.string().optional(),
})

// Complete CV Schema
export const cvSchema = z.object({
  personalInfo: personalInfoSchema,
  workExperience: z.array(workExperienceSchema),
  education: z.array(educationSchema),
  skills: z.array(skillSchema),
  projects: z.array(projectSchema),
  certifications: z.array(certificationSchema),
  languages: z.array(languageSchema),
})

// TypeScript types derived from schemas
export type PersonalInfo = z.infer<typeof personalInfoSchema>
export type WorkExperience = z.infer<typeof workExperienceSchema>
export type Education = z.infer<typeof educationSchema>
export type Skill = z.infer<typeof skillSchema>
export type Project = z.infer<typeof projectSchema>
export type Certification = z.infer<typeof certificationSchema>
export type Language = z.infer<typeof languageSchema>
export type CVData = z.infer<typeof cvSchema>

// Utility functions
export const generateId = () => Math.random().toString(36).substr(2, 9)

export const calculateCompletionPercentage = (data: Partial<CVData>): number => {
  let completed = 0
  const total = 7 // Total sections

  if (data.personalInfo) completed++
  if (data.workExperience && data.workExperience.length > 0) completed++
  if (data.education && data.education.length > 0) completed++
  if (data.skills && data.skills.length > 0) completed++
  if (data.projects && data.projects.length > 0) completed++
  if (data.certifications && data.certifications.length > 0) completed++
  if (data.languages && data.languages.length > 0) completed++

  return Math.round((completed / total) * 100)
}

export const formatDate = (dateString: string): string => {
  if (!dateString) return ""
  const date = new Date(dateString)
  return date.toLocaleDateString("es-CL", {
    year: "numeric",
    month: "long",
  })
}

export const getSkillLevelText = (level: number): string => {
  const levels = ["", "Básico", "Intermedio", "Avanzado", "Experto", "Maestro"]
  return levels[level] || "Desconocido"
}

// Default empty CV data
export const getEmptyCVData = (): CVData => ({
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "Santiago" as const,
    address: "",
    linkedIn: "",
    website: "",
    summary: "",
  },
  workExperience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
})
