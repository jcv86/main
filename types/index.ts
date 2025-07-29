export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: "user" | "admin"
}

export interface Assessment {
  id: string
  title: string
  description: string
  type: "personality" | "technical" | "soft-skills" | "career"
  duration: number
  questions: number
  completed: boolean
  score?: number
  completedAt?: string
}

export interface CVData {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
    website?: string
    linkedin?: string
    github?: string
  }
  summary: string
  experience: Array<{
    title: string
    company: string
    location: string
    startDate: string
    endDate: string
    description: string
    current?: boolean
  }>
  education: Array<{
    degree: string
    school: string
    location: string
    startDate: string
    endDate: string
    gpa?: string
    current?: boolean
  }>
  skills: string[]
  languages?: string[]
  certifications?: string[]
  projects?: Array<{
    name: string
    description: string
    technologies: string[]
    url?: string
  }>
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
  fonts: {
    heading: string
    body: string
  }
  layout: "single-column" | "two-column" | "sidebar"
}
