export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  website?: string
  linkedin?: string
  github?: string
}

export interface Experience {
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  description: string
  current?: boolean
}

export interface Education {
  degree: string
  school: string
  location: string
  startDate: string
  endDate: string
  gpa?: string
  current?: boolean
}

export interface CVData {
  personalInfo: PersonalInfo
  summary: string
  experience: Experience[]
  education: Education[]
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

export const CV_TEMPLATES: CVTemplate[] = [
  {
    id: "modern",
    name: "Modern Professional",
    description: "Clean and contemporary design perfect for tech roles",
    colors: {
      primary: "#2563eb",
      secondary: "#1e40af",
      accent: "#3b82f6",
      text: "#1f2937",
      background: "#ffffff",
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
    layout: "two-column",
  },
  {
    id: "classic",
    name: "Classic Traditional",
    description: "Timeless design suitable for traditional industries",
    colors: {
      primary: "#1f2937",
      secondary: "#374151",
      accent: "#6b7280",
      text: "#111827",
      background: "#ffffff",
    },
    fonts: {
      heading: "Times New Roman",
      body: "Times New Roman",
    },
    layout: "single-column",
  },
  {
    id: "creative",
    name: "Creative Bold",
    description: "Eye-catching design for creative professionals",
    colors: {
      primary: "#7c3aed",
      secondary: "#5b21b6",
      accent: "#8b5cf6",
      text: "#1f2937",
      background: "#ffffff",
    },
    fonts: {
      heading: "Poppins",
      body: "Open Sans",
    },
    layout: "sidebar",
  },
  {
    id: "minimal",
    name: "Minimal Clean",
    description: "Simple and elegant design focusing on content",
    colors: {
      primary: "#059669",
      secondary: "#047857",
      accent: "#10b981",
      text: "#1f2937",
      background: "#ffffff",
    },
    fonts: {
      heading: "Helvetica",
      body: "Helvetica",
    },
    layout: "single-column",
  },
]

export function getDefaultCVData(): CVData {
  return {
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    languages: [],
    certifications: [],
    projects: [],
  }
}

export function calculateCompletionPercentage(data: CVData): number {
  let completed = 0
  let total = 0

  // Personal info (30 points)
  total += 30
  if (data.personalInfo.fullName) completed += 5
  if (data.personalInfo.email) completed += 5
  if (data.personalInfo.phone) completed += 5
  if (data.personalInfo.location) completed += 5
  if (data.personalInfo.linkedin) completed += 5
  if (data.personalInfo.website || data.personalInfo.github) completed += 5

  // Summary (20 points)
  total += 20
  if (data.summary && data.summary.length > 50) completed += 20

  // Experience (25 points)
  total += 25
  if (data.experience.length > 0) completed += 15
  if (data.experience.length > 1) completed += 10

  // Education (15 points)
  total += 15
  if (data.education.length > 0) completed += 15

  // Skills (10 points)
  total += 10
  if (data.skills.length > 0) completed += 5
  if (data.skills.length > 3) completed += 5

  return Math.round((completed / total) * 100)
}

export function validateCVData(data: CVData): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.personalInfo.fullName) errors.push("Full name is required")
  if (!data.personalInfo.email) errors.push("Email is required")
  if (!data.personalInfo.phone) errors.push("Phone number is required")
  if (!data.personalInfo.location) errors.push("Location is required")

  if (!data.summary || data.summary.length < 50) {
    errors.push("Professional summary should be at least 50 characters")
  }

  if (data.experience.length === 0) {
    errors.push("At least one work experience is required")
  }

  if (data.education.length === 0) {
    errors.push("At least one education entry is required")
  }

  if (data.skills.length === 0) {
    errors.push("At least one skill is required")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
