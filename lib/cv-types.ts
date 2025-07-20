export interface CVData {
  fullName: string
  email: string
  phone: string
  location: string
  website?: string
  linkedin?: string
  github?: string
  portfolio?: string
  summary: string
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
  certifications: Certification[]
  languages: Language[]
  interests: string[]
}

export interface Experience {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  achievements: string[]
}

export interface Education {
  id: string
  institution: string
  institutionType: string
  comuna: string
  degree: string
  field: string
  startDate: string
  endDate: string
  current: boolean
  achievements?: string[]
}

export interface Skill {
  id: string
  name: string
  category: "technical" | "soft" | "tools"
  level: number
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string
  liveUrl?: string
  githubUrl?: string
}

export interface Certification {
  id: string
  name: string
  organization: string
  issueDate: string
  expiryDate?: string
  credentialId?: string
}

export interface Language {
  id: string
  name: string
  proficiency: "native" | "fluent" | "advanced" | "intermediate" | "beginner"
}

export type TemplateType = "modern" | "classic" | "creative" | "minimal"
