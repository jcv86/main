import type { Icons } from "@/components/icons"

export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
  label?: string
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[]
}

export interface MainNavItem extends NavItem {}

export interface SidebarNavItem extends NavItemWithChildren {}

export interface DocsConfig {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export interface MarketingConfig {
  mainNav: MainNavItem[]
}

export interface DashboardConfig {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

// Assessment Types
export interface Assessment {
  id: string
  title: string
  description: string
  type: "personality" | "skills" | "technical" | "cognitive"
  duration: number
  questions: number
  difficulty: "beginner" | "intermediate" | "advanced"
  category: string
  tags: string[]
  isCompleted: boolean
  completedAt?: Date
  score?: number
  href: string
  icon: keyof typeof Icons
}

export interface AssessmentResult {
  id: string
  assessmentId: string
  userId: string
  score: number
  completedAt: Date
  results: Record<string, any>
  recommendations: string[]
}

// User Types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: "user" | "admin"
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile {
  id: string
  userId: string
  firstName: string
  lastName: string
  bio?: string
  location?: string
  website?: string
  linkedin?: string
  github?: string
  skills: string[]
  interests: string[]
  goals: string[]
  createdAt: Date
  updatedAt: Date
}

// CV Types
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
  experience: Experience[]
  education: Education[]
  skills: string[]
  languages?: string[]
  certifications?: string[]
  projects?: Project[]
}

export interface Experience {
  id?: string
  title: string
  company: string
  location: string
  startDate: Date
  endDate?: Date
  current: boolean
  description: string
}

export interface Education {
  id?: string
  degree: string
  school: string
  location: string
  startDate: Date
  endDate: Date
  gpa?: string
  description?: string
}

export interface Project {
  id?: string
  name: string
  description: string
  technologies: string[]
  url?: string
  github?: string
  startDate?: Date
  endDate?: Date
}

// Job Types
export interface Job {
  id: string
  title: string
  company: string
  location: string
  type: "full-time" | "part-time" | "contract" | "internship"
  remote: boolean
  salary?: {
    min: number
    max: number
    currency: string
  }
  description: string
  requirements: string[]
  benefits: string[]
  postedAt: Date
  expiresAt?: Date
  source: string
  url: string
  tags: string[]
}

// Library Types
export interface Book {
  id: string
  title: string
  author: string
  description: string
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  rating: number
  pages: number
  readingTime: number
  coverImage: string
  tags: string[]
  isAvailable: boolean
  chapters?: Chapter[]
}

export interface Chapter {
  id: string
  bookId: string
  title: string
  content: string
  order: number
  readingTime: number
}

export interface ReadingProgress {
  id: string
  userId: string
  bookId: string
  chapterId?: string
  progress: number
  lastReadAt: Date
  completed: boolean
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: Date
  actionUrl?: string
}

// Goal Types
export interface Goal {
  id: string
  userId: string
  title: string
  description: string
  category: "career" | "skill" | "education" | "personal"
  priority: "low" | "medium" | "high"
  status: "not-started" | "in-progress" | "completed" | "paused"
  targetDate: Date
  progress: number
  milestones: Milestone[]
  createdAt: Date
  updatedAt: Date
}

export interface Milestone {
  id: string
  goalId: string
  title: string
  description?: string
  completed: boolean
  completedAt?: Date
  dueDate?: Date
  order: number
}

// Calendar Types
export interface CalendarEvent {
  id: string
  userId: string
  title: string
  description?: string
  startDate: Date
  endDate: Date
  type: "assessment" | "interview" | "meeting" | "deadline" | "reminder"
  location?: string
  attendees?: string[]
  reminders: number[]
  createdAt: Date
  updatedAt: Date
}
