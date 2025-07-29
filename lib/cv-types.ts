export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  city: string
  address: string
  country: string
  linkedIn: string
  website: string
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
  gpa: string
  description: string
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  startDate: string
  endDate: string
  url: string
  github: string
}

export interface Skill {
  id: string
  name: string
  level: string
  category: string
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
  expiryDate: string
  credentialId: string
  url: string
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
    name: "Modern",
    description: "Clean and contemporary design with gradient accents",
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
    name: "Classic",
    description: "Traditional professional layout with elegant typography",
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
    name: "Creative",
    description: "Vibrant design with sidebar layout and visual elements",
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
    name: "Minimal",
    description: "Clean typography-focused design with subtle accents",
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
  "Calama",
  "Copiapó",
  "Osorno",
  "Quillota",
  "Valdivia",
  "Punta Arenas",
]

export const COMMON_SKILLS = [
  "JavaScript",
  "Python",
  "React",
  "Node.js",
  "HTML/CSS",
  "SQL",
  "Git",
  "AWS",
  "Docker",
  "TypeScript",
  "Java",
  "C#",
  "PHP",
  "MongoDB",
  "PostgreSQL",
  "Leadership",
  "Communication",
  "Problem Solving",
  "Team Work",
  "Project Management",
  "Agile",
  "Scrum",
  "Data Analysis",
  "Machine Learning",
  "UI/UX Design",
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
      address: "",
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
