export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: "user" | "admin"
  created_at: string
  updated_at: string
}

export interface Assessment {
  id: string
  title: string
  description: string
  type: "personality" | "skills" | "technical" | "soft-skills"
  duration: number
  questions_count: number
  completed: boolean
  score?: number
  completed_at?: string
  created_at: string
}

export interface CVData {
  id: string
  user_id: string
  personal_info: {
    name: string
    email: string
    phone: string
    location: string
    summary: string
  }
  experience: Array<{
    id: string
    company: string
    position: string
    start_date: string
    end_date?: string
    description: string
  }>
  education: Array<{
    id: string
    institution: string
    degree: string
    field: string
    start_date: string
    end_date?: string
  }>
  skills: string[]
  languages: Array<{
    name: string
    level: string
  }>
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  title: string
  company: string
  location: string
  type: "full-time" | "part-time" | "contract" | "remote"
  salary_range?: string
  description: string
  requirements: string[]
  posted_at: string
  expires_at?: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  created_at: string
}
