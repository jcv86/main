export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  linkedIn?: string
  website?: string
  summary: string
}

export interface WorkExperience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string
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
  description?: string
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  startDate: string
  endDate: string
  url?: string
  github?: string
}

export interface Skill {
  id: string
  name: string
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  category: "Technical" | "Soft" | "Language" | "Tool"
}

export interface Language {
  id: string
  name: string
  level: "Basic" | "Conversational" | "Fluent" | "Native"
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
    name: "Modern Professional",
    description: "Clean and contemporary design perfect for tech and business roles",
    preview: "/templates/modern-preview.png",
    category: "modern",
    colors: {
      primary: "#2563eb",
      secondary: "#64748b",
      accent: "#0ea5e9",
      text: "#1e293b",
      background: "#ffffff",
    },
  },
  {
    id: "classic",
    name: "Classic Traditional",
    description: "Timeless design suitable for conservative industries",
    preview: "/templates/classic-preview.png",
    category: "classic",
    colors: {
      primary: "#1f2937",
      secondary: "#6b7280",
      accent: "#374151",
      text: "#111827",
      background: "#ffffff",
    },
  },
  {
    id: "creative",
    name: "Creative Bold",
    description: "Eye-catching design for creative professionals",
    preview: "/templates/creative-preview.png",
    category: "creative",
    colors: {
      primary: "#7c3aed",
      secondary: "#a855f7",
      accent: "#c084fc",
      text: "#1f2937",
      background: "#ffffff",
    },
  },
  {
    id: "minimal",
    name: "Minimal Clean",
    description: "Simple and elegant design focusing on content",
    preview: "/templates/minimal-preview.png",
    category: "minimal",
    colors: {
      primary: "#059669",
      secondary: "#6b7280",
      accent: "#10b981",
      text: "#374151",
      background: "#ffffff",
    },
  },
]

export const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"] as const
export const LANGUAGE_LEVELS = ["Basic", "Conversational", "Fluent", "Native"] as const
export const SKILL_CATEGORIES = ["Technical", "Soft", "Language", "Tool"] as const

export const CHILEAN_CITIES = [
  "Santiago",
  "Valparaíso",
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
  "San Antonio",
]

export const COMMON_SKILLS = [
  // Technical Skills
  "JavaScript",
  "Python",
  "Java",
  "React",
  "Node.js",
  "SQL",
  "HTML/CSS",
  "TypeScript",
  "Angular",
  "Vue.js",
  "PHP",
  "C#",
  "Ruby",
  "Go",
  "Swift",
  "Kotlin",
  "Flutter",
  "React Native",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "Google Cloud",
  "Git",
  "Jenkins",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "Elasticsearch",
  "GraphQL",
  "REST APIs",
  "Microservices",

  // Soft Skills
  "Leadership",
  "Communication",
  "Problem Solving",
  "Team Collaboration",
  "Project Management",
  "Time Management",
  "Critical Thinking",
  "Adaptability",
  "Creativity",
  "Analytical Thinking",
  "Negotiation",
  "Presentation Skills",
  "Customer Service",
  "Conflict Resolution",
  "Strategic Planning",

  // Tools
  "Microsoft Office",
  "Google Workspace",
  "Slack",
  "Trello",
  "Jira",
  "Confluence",
  "Figma",
  "Adobe Creative Suite",
  "Sketch",
  "InVision",
  "Tableau",
  "Power BI",
  "Salesforce",
  "HubSpot",
  "Zoom",
  "Teams",
]

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function formatDate(date: string): string {
  if (!date) return ""
  const d = new Date(date)
  return d.toLocaleDateString("es-CL", { year: "numeric", month: "long" })
}

export function calculateExperience(experiences: WorkExperience[]): number {
  let totalMonths = 0

  experiences.forEach((exp) => {
    const start = new Date(exp.startDate)
    const end = exp.current ? new Date() : new Date(exp.endDate)
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
    totalMonths += Math.max(0, months)
  })

  return Math.round((totalMonths / 12) * 10) / 10 // Round to 1 decimal place
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  // Chilean phone number validation (basic)
  const phoneRegex = /^(\+56|56)?[2-9]\d{8}$/
  return phoneRegex.test(phone.replace(/\s/g, ""))
}

export function getTemplateById(id: string): CVTemplate | undefined {
  return CV_TEMPLATES.find((template) => template.id === id)
}

export function getDefaultCVData(): CVData {
  return {
    personal: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "Chile",
      linkedIn: "",
      website: "",
      summary: "",
    },
    experience: [],
    education: [],
    projects: [],
    skills: [],
    languages: [],
    certifications: [],
  }
}
