import { z } from "zod"

// Validation schemas
export const personalInfoSchema = z.object({
  fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().regex(/^(\+56)?[0-9]{8,9}$/, "Formato de teléfono chileno inválido"),
  location: z.string().min(2, "La ubicación es requerida"),
  linkedIn: z.string().url("URL de LinkedIn inválida").optional().or(z.literal("")),
  website: z.string().url("URL del sitio web inválida").optional().or(z.literal("")),
  summary: z
    .string()
    .min(50, "El resumen debe tener al menos 50 caracteres")
    .max(500, "El resumen no puede exceder 500 caracteres"),
})

export const experienceSchema = z.object({
  id: z.string(),
  company: z.string().min(2, "El nombre de la empresa es requerido"),
  position: z.string().min(2, "El cargo es requerido"),
  startDate: z.string().min(1, "La fecha de inicio es requerida"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().min(20, "La descripción debe tener al menos 20 caracteres"),
  location: z.string().optional(),
  achievements: z.array(z.string()).default([]),
})

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(2, "El nombre de la institución es requerido"),
  degree: z.string().min(2, "El título es requerido"),
  field: z.string().min(2, "El área de estudio es requerida"),
  startDate: z.string().min(1, "La fecha de inicio es requerida"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  gpa: z.string().optional(),
  honors: z.string().optional(),
  relevantCourses: z.array(z.string()).default([]),
})

export const skillSchema = z.object({
  name: z.string().min(1, "El nombre de la habilidad es requerido"),
  level: z.enum(["Básico", "Intermedio", "Avanzado", "Experto"]),
  category: z.string().optional(),
})

export const languageSchema = z.object({
  name: z.string().min(1, "El nombre del idioma es requerido"),
  level: z.enum(["Básico", "Intermedio", "Avanzado", "Nativo"]),
  certifications: z.array(z.string()).default([]),
})

export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "El nombre del proyecto es requerido"),
  description: z.string().min(20, "La descripción debe tener al menos 20 caracteres"),
  technologies: z.array(z.string()).default([]),
  startDate: z.string().min(1, "La fecha de inicio es requerida"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  url: z.string().url("URL inválida").optional().or(z.literal("")),
  github: z.string().url("URL de GitHub inválida").optional().or(z.literal("")),
  role: z.string().optional(),
  teamSize: z.number().optional(),
  achievements: z.array(z.string()).default([]),
})

export const certificationSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "El nombre de la certificación es requerido"),
  issuer: z.string().min(2, "El emisor es requerido"),
  date: z.string().min(1, "La fecha es requerida"),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
  url: z.string().url("URL inválida").optional().or(z.literal("")),
  skills: z.array(z.string()).default([]),
})

export const cvDataSchema = z.object({
  personalInfo: personalInfoSchema,
  experience: z.array(experienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  skills: z
    .object({
      technical: z.array(skillSchema).default([]),
      soft: z.array(skillSchema).default([]),
      languages: z.array(languageSchema).default([]),
    })
    .default({ technical: [], soft: [], languages: [] }),
  projects: z.array(projectSchema).default([]),
  certifications: z.array(certificationSchema).default([]),
})

// Types
export type PersonalInfo = z.infer<typeof personalInfoSchema>
export type Experience = z.infer<typeof experienceSchema>
export type Education = z.infer<typeof educationSchema>
export type Skill = z.infer<typeof skillSchema>
export type Language = z.infer<typeof languageSchema>
export type Project = z.infer<typeof projectSchema>
export type Certification = z.infer<typeof certificationSchema>
export type CVData = z.infer<typeof cvDataSchema>

export type CVTemplate = "modern" | "classic" | "creative" | "minimal"

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
  "Universidad del Desarrollo",
  "Universidad Diego Portales",
  "Universidad Adolfo Ibáñez",
  "Universidad de los Andes",
  "Universidad Mayor",
  "Universidad Central de Chile",
  "Universidad de Talca",
  "Universidad de La Frontera",
  "Universidad Católica del Norte",
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
  "AutoCAD",
  "SolidWorks",
  "MATLAB",
  "R",

  // Soft Skills
  "Liderazgo",
  "Trabajo en equipo",
  "Comunicación efectiva",
  "Resolución de problemas",
  "Pensamiento crítico",
  "Adaptabilidad",
  "Gestión del tiempo",
  "Negociación",
  "Atención al cliente",
  "Planificación estratégica",
  "Gestión de proyectos",
  "Análisis de datos",
  "Toma de decisiones",
  "Creatividad",
  "Innovación",
]

// Utility functions
export const validateCVData = (data: unknown): CVData => {
  return cvDataSchema.parse(data)
}

export const getCompletionPercentage = (data: CVData): number => {
  let completed = 0
  const total = 7

  // Personal info (required fields)
  if (data.personalInfo.fullName && data.personalInfo.email && data.personalInfo.phone) {
    completed++
  }

  // Summary
  if (data.personalInfo.summary && data.personalInfo.summary.length >= 50) {
    completed++
  }

  // Experience
  if (data.experience.length > 0) {
    completed++
  }

  // Education
  if (data.education.length > 0) {
    completed++
  }

  // Skills
  if (data.skills.technical.length > 0 || data.skills.soft.length > 0) {
    completed++
  }

  // Projects
  if (data.projects.length > 0) {
    completed++
  }

  // Certifications or Languages
  if (data.certifications.length > 0 || data.skills.languages.length > 0) {
    completed++
  }

  return (completed / total) * 100
}

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}
