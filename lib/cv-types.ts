import { z } from "zod"

// Personal Information Schema
export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "Nombre es requerido"),
  lastName: z.string().min(1, "Apellido es requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(8, "Teléfono debe tener al menos 8 dígitos"),
  address: z.string().min(1, "Dirección es requerida"),
  city: z.string().min(1, "Ciudad es requerida"),
  country: z.string().default("Chile"),
  linkedIn: z.string().url("URL de LinkedIn inválida").optional().or(z.literal("")),
  website: z.string().url("URL del sitio web inválida").optional().or(z.literal("")),
  summary: z
    .string()
    .min(50, "Resumen debe tener al menos 50 caracteres")
    .max(500, "Resumen no puede exceder 500 caracteres"),
})

// Education Schema
export const educationSchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substr(2, 9)),
  institution: z.string().min(1, "Institución es requerida"),
  degree: z.string().min(1, "Título es requerido"),
  field: z.string().min(1, "Campo de estudio es requerido"),
  startDate: z.string().min(1, "Fecha de inicio es requerida"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  gpa: z.string().optional(),
  description: z.string().optional(),
})

// Experience Schema
export const experienceSchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substr(2, 9)),
  company: z.string().min(1, "Empresa es requerida"),
  position: z.string().min(1, "Cargo es requerido"),
  location: z.string().min(1, "Ubicación es requerida"),
  startDate: z.string().min(1, "Fecha de inicio es requerida"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().min(50, "Descripción debe tener al menos 50 caracteres"),
  achievements: z.array(z.string()).default([]),
})

// Skills Schema
export const skillsSchema = z.object({
  technical: z
    .array(
      z.object({
        name: z.string().min(1, "Nombre de habilidad es requerido"),
        level: z.enum(["Básico", "Intermedio", "Avanzado", "Experto"]),
      }),
    )
    .default([]),
  soft: z.array(z.string()).default([]),
  languages: z
    .array(
      z.object({
        name: z.string().min(1, "Idioma es requerido"),
        level: z.enum(["Básico", "Intermedio", "Avanzado", "Nativo"]),
      }),
    )
    .default([]),
})

// Projects Schema
export const projectsSchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substr(2, 9)),
  name: z.string().min(1, "Nombre del proyecto es requerido"),
  description: z.string().min(20, "Descripción debe tener al menos 20 caracteres"),
  technologies: z.array(z.string()).default([]),
  url: z.string().url("URL inválida").optional().or(z.literal("")),
  github: z.string().url("URL de GitHub inválida").optional().or(z.literal("")),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

// Certifications Schema
export const certificationsSchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substr(2, 9)),
  name: z.string().min(1, "Nombre de certificación es requerido"),
  issuer: z.string().min(1, "Emisor es requerido"),
  date: z.string().min(1, "Fecha es requerida"),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
  url: z.string().url("URL inválida").optional().or(z.literal("")),
})

// Complete CV Schema
export const cvSchema = z.object({
  personalInfo: personalInfoSchema,
  education: z.array(educationSchema).default([]),
  experience: z.array(experienceSchema).default([]),
  skills: skillsSchema,
  projects: z.array(projectsSchema).default([]),
  certifications: z.array(certificationsSchema).default([]),
})

// Types derived from schemas
export type PersonalInfo = z.infer<typeof personalInfoSchema>
export type Education = z.infer<typeof educationSchema>
export type Experience = z.infer<typeof experienceSchema>
export type Skills = z.infer<typeof skillsSchema>
export type Project = z.infer<typeof projectsSchema>
export type Certification = z.infer<typeof certificationsSchema>
export type CVData = z.infer<typeof cvSchema>

// Chilean cities for dropdown
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

// Chilean universities for dropdown
export const chileanUniversities = [
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
]

// Common technical skills
export const commonTechnicalSkills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Python",
  "Java",
  "C++",
  "HTML/CSS",
  "SQL",
  "MongoDB",
  "PostgreSQL",
  "Git",
  "Docker",
  "AWS",
  "Azure",
  "Google Cloud",
  "Kubernetes",
  "Jenkins",
  "Angular",
  "Vue.js",
  "Next.js",
  "Express.js",
  "Django",
  "Flask",
  "Spring Boot",
  "Laravel",
  "PHP",
  "Ruby on Rails",
  "Go",
  "Rust",
]

// Common soft skills
export const commonSoftSkills = [
  "Liderazgo",
  "Trabajo en equipo",
  "Comunicación efectiva",
  "Resolución de problemas",
  "Pensamiento crítico",
  "Adaptabilidad",
  "Gestión del tiempo",
  "Creatividad",
  "Negociación",
  "Empatía",
  "Toma de decisiones",
  "Orientación a resultados",
  "Innovación",
  "Colaboración",
  "Mentoring",
  "Planificación estratégica",
]

// Utility functions
export const calculateCompletionPercentage = (cvData: Partial<CVData>): number => {
  let completed = 0
  const total = 6 // Total sections

  if (cvData.personalInfo) completed++
  if (cvData.education && cvData.education.length > 0) completed++
  if (cvData.experience && cvData.experience.length > 0) completed++
  if (cvData.skills && (cvData.skills.technical.length > 0 || cvData.skills.soft.length > 0)) completed++
  if (cvData.projects && cvData.projects.length > 0) completed++
  if (cvData.certifications && cvData.certifications.length > 0) completed++

  return Math.round((completed / total) * 100)
}

export const formatDate = (dateString: string): string => {
  if (!dateString) return ""
  const date = new Date(dateString)
  return date.toLocaleDateString("es-CL", { year: "numeric", month: "long" })
}

export const generateCVId = (): string => {
  return `cv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
