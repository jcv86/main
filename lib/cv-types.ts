export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  linkedIn?: string
  website?: string
  summary: string
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  location: string
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
  current: boolean
  url?: string
  github?: string
}

export interface Skill {
  id: string
  name: string
  level: "Básico" | "Intermedio" | "Avanzado" | "Experto"
  category: "Técnica" | "Blanda" | "Idioma" | "Herramienta"
}

export interface Language {
  id: string
  name: string
  level: "Básico" | "Intermedio" | "Avanzado" | "Nativo"
  certification?: string
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
  experience: Experience[]
  education: Education[]
  projects: Project[]
  skills: Skill[]
  languages: Language[]
  certifications: Certification[]
}

export const formatDate = (dateString: string): string => {
  if (!dateString) return ""

  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-CL", {
      year: "numeric",
      month: "long",
    })
  } catch (error) {
    return dateString
  }
}

export const chileanCities = [
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

export const chileanUniversities = [
  "Universidad de Chile",
  "Pontificia Universidad Católica de Chile",
  "Universidad de Santiago de Chile",
  "Universidad de Concepción",
  "Universidad Técnica Federico Santa María",
  "Universidad Austral de Chile",
  "Universidad Católica de Valparaíso",
  "Universidad de La Frontera",
  "Universidad del Bío-Bío",
  "Universidad de Talca",
  "Universidad de Antofagasta",
  "Universidad de La Serena",
  "Universidad de Magallanes",
  "Universidad de Atacama",
  "Universidad de Tarapacá",
  "Universidad Católica del Norte",
  "Universidad Católica de Temuco",
  "Universidad Católica del Maule",
  "Universidad de Los Lagos",
  "Universidad Arturo Prat",
]
