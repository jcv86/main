export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  city: string
  country: string
  address?: string
  linkedIn?: string
  website?: string
  summary?: string
}

export interface WorkExperience {
  id: string
  company: string
  position: string
  startDate: string
  endDate?: string
  current: boolean
  description?: string
  achievements: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  field?: string
  startDate: string
  endDate?: string
  current: boolean
  gpa?: string
  description?: string
}

export interface Skill {
  id: string
  name: string
  level: string
  category: string
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  startDate?: string
  endDate?: string
  url?: string
  github?: string
}

export interface Language {
  id: string
  name: string
  level: string
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

export interface CVData {
  personal: PersonalInfo
  experience: WorkExperience[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
  languages: Language[]
  certifications: Certification[]
}

export interface CVTemplate {
  id: string
  name: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
    text: string
    background: string
  }
}

export const CV_TEMPLATES: CVTemplate[] = [
  {
    id: "modern",
    name: "Moderno",
    description: "Diseño limpio y contemporáneo perfecto para profesionales tech",
    colors: {
      primary: "#3B82F6",
      secondary: "#1E40AF",
      accent: "#60A5FA",
      text: "#1F2937",
      background: "#FFFFFF",
    },
  },
  {
    id: "classic",
    name: "Clásico",
    description: "Formato tradicional ideal para industrias conservadoras",
    colors: {
      primary: "#1F2937",
      secondary: "#374151",
      accent: "#6B7280",
      text: "#111827",
      background: "#FFFFFF",
    },
  },
  {
    id: "creative",
    name: "Creativo",
    description: "Diseño innovador para profesionales creativos y diseñadores",
    colors: {
      primary: "#7C3AED",
      secondary: "#5B21B6",
      accent: "#A78BFA",
      text: "#1F2937",
      background: "#FFFFFF",
    },
  },
  {
    id: "minimal",
    name: "Minimalista",
    description: "Enfoque en el contenido con diseño ultra limpio",
    colors: {
      primary: "#059669",
      secondary: "#047857",
      accent: "#34D399",
      text: "#1F2937",
      background: "#FFFFFF",
    },
  },
]

export const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"]

export const LANGUAGE_LEVELS = ["Basic", "Conversational", "Fluent", "Native"]

export const SKILL_CATEGORIES = ["Technical", "Soft Skills", "Languages", "Tools", "Frameworks"]

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
  "Copiapó",
  "Quillota",
  "Curicó",
  "Ovalle",
]

export const COMMON_SKILLS = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "React",
  "Node.js",
  "HTML",
  "CSS",
  "SQL",
  "Git",
  "AWS",
  "Docker",
  "Leadership",
  "Communication",
  "Problem Solving",
  "Team Work",
  "Project Management",
  "Agile",
  "Scrum",
  "English",
]

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function getDefaultCVData(): CVData {
  return {
    personal: {
      fullName: "",
      email: "",
      phone: "",
      city: "",
      country: "Chile",
      address: "",
      linkedIn: "",
      website: "",
      summary: "",
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    languages: [],
    certifications: [],
  }
}

export function calculateCompletionPercentage(cvData: CVData): number {
  let completedSections = 0
  const totalSections = 7

  // Check personal info completion
  if (
    cvData.personal.fullName &&
    cvData.personal.email &&
    cvData.personal.phone &&
    cvData.personal.city &&
    cvData.personal.summary
  ) {
    completedSections++
  }

  // Check other sections
  if (cvData.experience.length > 0) completedSections++
  if (cvData.education.length > 0) completedSections++
  if (cvData.skills.length > 0) completedSections++
  if (cvData.projects.length > 0) completedSections++
  if (cvData.languages.length > 0) completedSections++
  if (cvData.certifications.length > 0) completedSections++

  return Math.round((completedSections / totalSections) * 100)
}

export function validateCVData(cvData: CVData): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!cvData.personal.fullName) errors.push("Full name is required")
  if (!cvData.personal.email) errors.push("Email is required")
  if (!cvData.personal.phone) errors.push("Phone is required")

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (cvData.personal.email && !emailRegex.test(cvData.personal.email)) {
    errors.push("Invalid email format")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
