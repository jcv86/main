// CV Builder Types and Utilities
export type CVTemplate = "modern" | "classic" | "creative" | "minimal"

export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  jobTitle?: string
  summary?: string
  linkedin?: string
  github?: string
  website?: string
}

export interface Education {
  id: string
  degree: string
  institution: string
  location: string
  startDate: string
  endDate: string
  gpa?: string
  description?: string
  honors?: string[]
  relevantCourses?: string[]
}

export interface Experience {
  id: string
  jobTitle: string
  company: string
  location: string
  startDate: string
  endDate?: string
  description: string
  achievements?: string[]
  technologies?: string[]
  responsibilities?: string[]
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  url?: string
  githubUrl?: string
  startDate?: string
  endDate?: string
  role?: string
  teamSize?: number
}

export interface Skill {
  id: string
  name: string
  level: number
  category: string
  yearsOfExperience?: number
  certified?: boolean
}

export interface Language {
  id: string
  name: string
  proficiency: "Básico" | "Intermedio" | "Avanzado" | "Profesional" | "Nativo"
  certified?: boolean
}

export interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: string
  expiryDate?: string
  credentialId?: string
  url?: string
}

export interface CVData {
  personalInfo: PersonalInfo
  education: Education[]
  experience: Experience[]
  projects: Project[]
  skills: Skill[]
  languages: Language[]
  certifications: Certification[]
}

export interface SavedCV {
  id: string
  user_id: string
  template_id: number
  title: string
  personal_info: PersonalInfo
  education: Education[]
  experience: Experience[]
  projects: Project[]
  skills: Skill[]
  languages: Language[]
  certifications: Certification[]
  is_active: boolean
  created_at: string
  updated_at: string
}

// Utility functions
export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

export const calculateCompletionPercentage = (cvData: CVData): number => {
  let completed = 0
  const total = 8

  // Personal info (required fields)
  if (
    cvData.personalInfo.fullName &&
    cvData.personalInfo.email &&
    cvData.personalInfo.phone &&
    cvData.personalInfo.location
  ) {
    completed++
  }

  // Summary
  if (cvData.personalInfo.summary && cvData.personalInfo.summary.length > 50) {
    completed++
  }

  // Experience
  if (cvData.experience.length > 0) {
    completed++
  }

  // Education
  if (cvData.education.length > 0) {
    completed++
  }

  // Skills
  if (cvData.skills.length > 0) {
    completed++
  }

  // Projects
  if (cvData.projects.length > 0) {
    completed++
  }

  // Languages
  if (cvData.languages.length > 0) {
    completed++
  }

  // Certifications
  if (cvData.certifications.length > 0) {
    completed++
  }

  return Math.round((completed / total) * 100)
}

export const validateCVData = (cvData: CVData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  // Validate personal info
  if (!cvData.personalInfo.fullName) errors.push("Nombre completo es requerido")
  if (!cvData.personalInfo.email) errors.push("Email es requerido")
  if (!cvData.personalInfo.phone) errors.push("Teléfono es requerido")
  if (!cvData.personalInfo.location) errors.push("Ubicación es requerida")

  // Validate email format
  if (cvData.personalInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cvData.personalInfo.email)) {
    errors.push("Email debe tener un formato válido")
  }

  // Validate experience
  cvData.experience.forEach((exp, index) => {
    if (!exp.jobTitle) errors.push(`Experiencia ${index + 1}: Cargo es requerido`)
    if (!exp.company) errors.push(`Experiencia ${index + 1}: Empresa es requerida`)
    if (!exp.startDate) errors.push(`Experiencia ${index + 1}: Fecha de inicio es requerida`)
    if (!exp.description) errors.push(`Experiencia ${index + 1}: Descripción es requerida`)
  })

  // Validate education
  cvData.education.forEach((edu, index) => {
    if (!edu.degree) errors.push(`Educación ${index + 1}: Título/Grado es requerido`)
    if (!edu.institution) errors.push(`Educación ${index + 1}: Institución es requerida`)
    if (!edu.startDate) errors.push(`Educación ${index + 1}: Fecha de inicio es requerida`)
  })

  // Validate projects
  cvData.projects.forEach((project, index) => {
    if (!project.name) errors.push(`Proyecto ${index + 1}: Nombre es requerido`)
    if (!project.description) errors.push(`Proyecto ${index + 1}: Descripción es requerida`)
  })

  // Validate skills
  cvData.skills.forEach((skill, index) => {
    if (!skill.name) errors.push(`Habilidad ${index + 1}: Nombre es requerido`)
    if (!skill.category) errors.push(`Habilidad ${index + 1}: Categoría es requerida`)
  })

  // Validate languages
  cvData.languages.forEach((lang, index) => {
    if (!lang.name) errors.push(`Idioma ${index + 1}: Nombre es requerido`)
    if (!lang.proficiency) errors.push(`Idioma ${index + 1}: Nivel de competencia es requerido`)
  })

  // Validate certifications
  cvData.certifications.forEach((cert, index) => {
    if (!cert.name) errors.push(`Certificación ${index + 1}: Nombre es requerido`)
    if (!cert.issuer) errors.push(`Certificación ${index + 1}: Emisor es requerido`)
    if (!cert.issueDate) errors.push(`Certificación ${index + 1}: Fecha de emisión es requerida`)
  })

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const formatDate = (dateString: string): string => {
  if (!dateString) return ""

  const [year, month] = dateString.split("-")
  const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1)

  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
  })
}

export const formatDateRange = (startDate: string, endDate?: string): string => {
  const start = formatDate(startDate)
  const end = endDate ? formatDate(endDate) : "Presente"
  return `${start} - ${end}`
}

export const getSkillLevelText = (level: number): string => {
  if (level >= 90) return "Experto"
  if (level >= 75) return "Avanzado"
  if (level >= 50) return "Intermedio"
  if (level >= 25) return "Básico"
  return "Principiante"
}

export const groupSkillsByCategory = (skills: Skill[]): Record<string, Skill[]> => {
  return skills.reduce(
    (acc, skill) => {
      const category = skill.category || "Otras"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(skill)
      return acc
    },
    {} as Record<string, Skill[]>,
  )
}

export const sortExperienceByDate = (experiences: Experience[]): Experience[] => {
  return [...experiences].sort((a, b) => {
    // Current jobs (no end date) come first
    if (!a.endDate && b.endDate) return -1
    if (a.endDate && !b.endDate) return 1

    // Then sort by start date (most recent first)
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  })
}

export const sortEducationByDate = (education: Education[]): Education[] => {
  return [...education].sort((a, b) => {
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  })
}

export const getTemplateDisplayName = (template: CVTemplate): string => {
  const names = {
    modern: "Moderno",
    classic: "Clásico",
    creative: "Creativo",
    minimal: "Minimalista",
  }
  return names[template] || "Moderno"
}

export const getTemplateId = (template: CVTemplate): number => {
  const ids = {
    modern: 1,
    classic: 2,
    creative: 3,
    minimal: 4,
  }
  return ids[template] || 1
}

export const getTemplateFromId = (id: number): CVTemplate => {
  const templates = {
    1: "modern" as CVTemplate,
    2: "classic" as CVTemplate,
    3: "creative" as CVTemplate,
    4: "minimal" as CVTemplate,
  }
  return templates[id] || "modern"
}
