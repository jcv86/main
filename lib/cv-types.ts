export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  jobTitle?: string
  linkedin?: string
  github?: string
  website?: string
  summary?: string
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
  achievements?: string[]
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
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  url?: string
  githubUrl?: string
  role?: string
  duration?: number
}

export interface Skill {
  id: string
  name: string
  level: number // 0-100
  category: string
  yearsOfExperience?: number
  certified?: boolean
}

export interface Language {
  id: string
  name: string
  proficiency: string // 'Básico', 'Intermedio', 'Avanzado', 'Profesional', 'Nativo'
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
  experience: Experience[]
  education: Education[]
  projects: Project[]
  skills: Skill[]
  languages: Language[]
  certifications: Certification[]
}

export interface CVTemplate {
  id: string
  name: string
  description: string
  preview: string
  category: "modern" | "classic" | "creative" | "minimal"
}

// Utility functions
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}

export const calculateCompletionPercentage = (cvData: CVData): number => {
  let totalFields = 0
  let completedFields = 0

  // Personal Info (required fields)
  const requiredPersonalFields = ["fullName", "email", "phone", "location"]
  requiredPersonalFields.forEach((field) => {
    totalFields++
    if (cvData.personalInfo[field as keyof PersonalInfo]) {
      completedFields++
    }
  })

  // Optional personal fields
  const optionalPersonalFields = ["jobTitle", "summary", "linkedin", "github", "website"]
  optionalPersonalFields.forEach((field) => {
    totalFields++
    if (cvData.personalInfo[field as keyof PersonalInfo]) {
      completedFields++
    }
  })

  // Experience (at least 1)
  totalFields += 2
  if (cvData.experience.length > 0) {
    completedFields++
    if (cvData.experience.some((exp) => exp.jobTitle && exp.company && exp.description)) {
      completedFields++
    }
  }

  // Education (at least 1)
  totalFields += 2
  if (cvData.education.length > 0) {
    completedFields++
    if (cvData.education.some((edu) => edu.degree && edu.institution)) {
      completedFields++
    }
  }

  // Skills (at least 3)
  totalFields++
  if (cvData.skills.length >= 3) {
    completedFields++
  }

  // Languages (at least 1)
  totalFields++
  if (cvData.languages.length > 0) {
    completedFields++
  }

  return Math.round((completedFields / totalFields) * 100)
}

export const validateCVData = (cvData: CVData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  // Validate required personal info
  if (!cvData.personalInfo.fullName) errors.push("Nombre completo es requerido")
  if (!cvData.personalInfo.email) errors.push("Email es requerido")
  if (!cvData.personalInfo.phone) errors.push("Teléfono es requerido")
  if (!cvData.personalInfo.location) errors.push("Ubicación es requerida")

  // Validate email format
  if (cvData.personalInfo.email && !/\S+@\S+\.\S+/.test(cvData.personalInfo.email)) {
    errors.push("Email debe tener un formato válido")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const getDefaultCVData = (): CVData => ({
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    jobTitle: "",
    linkedin: "",
    github: "",
    website: "",
    summary: "",
  },
  experience: [],
  education: [],
  projects: [],
  skills: [],
  languages: [],
  certifications: [],
})

// CV Templates
export const CV_TEMPLATES: CVTemplate[] = [
  {
    id: "modern",
    name: "Moderno",
    description: "Diseño limpio y profesional con acentos de color",
    preview: "/cv-templates/modern-preview.png",
    category: "modern",
  },
  {
    id: "classic",
    name: "Clásico",
    description: "Formato tradicional y conservador",
    preview: "/cv-templates/classic-preview.png",
    category: "classic",
  },
  {
    id: "creative",
    name: "Creativo",
    description: "Diseño innovador para profesionales creativos",
    preview: "/cv-templates/creative-preview.png",
    category: "creative",
  },
  {
    id: "minimal",
    name: "Minimalista",
    description: "Diseño simple y elegante",
    preview: "/cv-templates/minimal-preview.png",
    category: "minimal",
  },
]

// Personality Test Types
export interface PersonalityTestResult {
  id: string
  userId: string
  testType: "big_five" | "disc" | "mbti" | "values"
  results: any
  rawAnswers: any
  aiAnalysis?: string
  completedAt: string
  createdAt: string
}

export interface CoachMemory {
  id: string
  userId: string
  memoryType: "personality" | "preferences" | "goals" | "history"
  key: string
  value: any
  context?: string
  createdAt: string
  updatedAt: string
}

export interface TestRecommendation {
  id: string
  userId: string
  testResultId: string
  recommendationType: "book" | "course" | "skill" | "career"
  itemId?: string
  title: string
  description?: string
  reason?: string
  priority: 1 | 2 | 3
  status: "pending" | "viewed" | "completed" | "dismissed"
  createdAt: string
}
