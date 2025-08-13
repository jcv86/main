// Chilean Job Market Data and Services

export interface Job {
  id: string
  title: string
  company: string
  location: string
  type: "Tiempo Completo" | "Medio Tiempo" | "Contrato" | "Freelance"
  experience: string
  salary: {
    min: number
    max: number
    currency: "CLP"
  }
  description: string
  skills: string[]
  category: string
  isRemote: boolean
  postedDate: string
  applicationDeadline: string
  benefits: string[]
}

export interface Company {
  id: string
  name: string
  industry: string
  size: "Startup" | "Pequeña" | "Mediana" | "Grande"
  location: string
  description: string
  website: string
  logo: string
}

export interface JobFilters {
  location?: string
  type?: string
  experience?: string
  category?: string
  salaryMin?: number
  salaryMax?: number
  isRemote?: boolean
  skills?: string[]
  industry?: string
  companySize?: string
}

export interface JobSearchResult {
  jobs: Job[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Mock Chilean companies data
const chileanCompanies: Company[] = [
  {
    id: "1",
    name: "Banco de Chile",
    industry: "Servicios Financieros",
    size: "Grande",
    location: "Santiago",
    description: "Uno de los principales bancos de Chile",
    website: "https://www.bancochile.cl",
    logo: "/placeholder.svg?height=50&width=50&text=BC",
  },
  {
    id: "2",
    name: "Falabella",
    industry: "Retail",
    size: "Grande",
    location: "Santiago",
    description: "Empresa líder en retail y servicios financieros",
    website: "https://www.falabella.com",
    logo: "/placeholder.svg?height=50&width=50&text=F",
  },
  {
    id: "3",
    name: "CODELCO",
    industry: "Minería",
    size: "Grande",
    location: "Santiago",
    description: "Corporación Nacional del Cobre de Chile",
    website: "https://www.codelco.com",
    logo: "/placeholder.svg?height=50&width=50&text=C",
  },
  {
    id: "4",
    name: "Entel",
    industry: "Telecomunicaciones",
    size: "Grande",
    location: "Santiago",
    description: "Empresa líder en telecomunicaciones",
    website: "https://www.entel.cl",
    logo: "/placeholder.svg?height=50&width=50&text=E",
  },
  {
    id: "5",
    name: "Ripley",
    industry: "Retail",
    size: "Grande",
    location: "Santiago",
    description: "Cadena de tiendas por departamento",
    website: "https://www.ripley.cl",
    logo: "/placeholder.svg?height=50&width=50&text=R",
  },
]

// Mock Chilean jobs data
const chileanJobs: Job[] = [
  {
    id: "1",
    title: "Desarrollador Full Stack",
    company: "Banco de Chile",
    location: "Santiago, Chile",
    type: "Tiempo Completo",
    experience: "2-4 años",
    salary: {
      min: 1500000,
      max: 2500000,
      currency: "CLP",
    },
    description: "Buscamos un desarrollador full stack para unirse a nuestro equipo de tecnología.",
    skills: ["React", "Node.js", "PostgreSQL", "TypeScript"],
    category: "Tecnología",
    isRemote: false,
    postedDate: "2024-01-15",
    applicationDeadline: "2024-02-15",
    benefits: ["Seguro de salud", "Bonos por desempeño", "Capacitación"],
  },
  {
    id: "2",
    title: "Analista de Marketing Digital",
    company: "Falabella",
    location: "Santiago, Chile",
    type: "Tiempo Completo",
    experience: "1-3 años",
    salary: {
      min: 1200000,
      max: 1800000,
      currency: "CLP",
    },
    description: "Únete a nuestro equipo de marketing digital y ayuda a impulsar nuestras campañas.",
    skills: ["Google Analytics", "Facebook Ads", "SEO", "Content Marketing"],
    category: "Marketing",
    isRemote: true,
    postedDate: "2024-01-14",
    applicationDeadline: "2024-02-14",
    benefits: ["Trabajo remoto", "Horario flexible", "Capacitación"],
  },
  {
    id: "3",
    title: "Ingeniero de Minas",
    company: "CODELCO",
    location: "Antofagasta, Chile",
    type: "Tiempo Completo",
    experience: "3-5 años",
    salary: {
      min: 2000000,
      max: 3000000,
      currency: "CLP",
    },
    description: "Oportunidad para trabajar en uno de los proyectos mineros más importantes de Chile.",
    skills: ["Minería", "Geología", "AutoCAD", "Gestión de Proyectos"],
    category: "Minería",
    isRemote: false,
    postedDate: "2024-01-13",
    applicationDeadline: "2024-02-13",
    benefits: ["Seguro de salud", "Bonos", "Alojamiento"],
  },
  {
    id: "4",
    title: "Especialista en Telecomunicaciones",
    company: "Entel",
    location: "Valparaíso, Chile",
    type: "Tiempo Completo",
    experience: "2-4 años",
    salary: {
      min: 1600000,
      max: 2200000,
      currency: "CLP",
    },
    description: "Buscamos un especialista para nuestro equipo de infraestructura de telecomunicaciones.",
    skills: ["Redes", "Telecomunicaciones", "5G", "Fibra Óptica"],
    category: "Telecomunicaciones",
    isRemote: false,
    postedDate: "2024-01-12",
    applicationDeadline: "2024-02-12",
    benefits: ["Seguro de salud", "Capacitación técnica", "Bonos"],
  },
  {
    id: "5",
    title: "Gerente de Ventas",
    company: "Ripley",
    location: "Concepción, Chile",
    type: "Tiempo Completo",
    experience: "5+ años",
    salary: {
      min: 2500000,
      max: 3500000,
      currency: "CLP",
    },
    description: "Oportunidad de liderar el equipo de ventas en una de nuestras tiendas principales.",
    skills: ["Liderazgo", "Ventas", "Gestión de Equipos", "Retail"],
    category: "Ventas",
    isRemote: false,
    postedDate: "2024-01-11",
    applicationDeadline: "2024-02-11",
    benefits: ["Comisiones", "Seguro de salud", "Descuentos empleado"],
  },
]

// Chilean Job Service
export class ChileanJobService {
  private jobs: Job[] = chileanJobs
  private companies: Company[] = chileanCompanies

  // Get all jobs with optional filters
  searchJobs(filters: JobFilters = {}, page = 1, limit = 10): JobSearchResult {
    let filteredJobs = [...this.jobs]

    // Apply filters
    if (filters.location) {
      filteredJobs = filteredJobs.filter((job) => job.location.toLowerCase().includes(filters.location!.toLowerCase()))
    }

    if (filters.type) {
      filteredJobs = filteredJobs.filter((job) => job.type === filters.type)
    }

    if (filters.experience) {
      filteredJobs = filteredJobs.filter((job) => job.experience.includes(filters.experience!))
    }

    if (filters.category) {
      filteredJobs = filteredJobs.filter((job) => job.category === filters.category)
    }

    if (filters.salaryMin) {
      filteredJobs = filteredJobs.filter((job) => job.salary.min >= filters.salaryMin!)
    }

    if (filters.salaryMax) {
      filteredJobs = filteredJobs.filter((job) => job.salary.max <= filters.salaryMax!)
    }

    if (filters.isRemote !== undefined) {
      filteredJobs = filteredJobs.filter((job) => job.isRemote === filters.isRemote)
    }

    if (filters.skills && filters.skills.length > 0) {
      filteredJobs = filteredJobs.filter((job) =>
        filters.skills!.some((skill) =>
          job.skills.some((jobSkill) => jobSkill.toLowerCase().includes(skill.toLowerCase())),
        ),
      )
    }

    // Pagination
    const total = filteredJobs.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex)

    return {
      jobs: paginatedJobs,
      total,
      page,
      limit,
      totalPages,
    }
  }

  // Get companies with optional filters
  getCompanies(filters: { industry?: string; size?: string; location?: string } = {}): Company[] {
    let filteredCompanies = [...this.companies]

    if (filters.industry) {
      filteredCompanies = filteredCompanies.filter((company) => company.industry === filters.industry)
    }

    if (filters.size) {
      filteredCompanies = filteredCompanies.filter((company) => company.size === filters.size)
    }

    if (filters.location) {
      filteredCompanies = filteredCompanies.filter((company) =>
        company.location.toLowerCase().includes(filters.location!.toLowerCase()),
      )
    }

    return filteredCompanies
  }

  // Get top companies
  async getTopCompanies(limit = 10): Promise<Company[]> {
    return this.companies.slice(0, limit)
  }

  // Get job by ID
  getJobById(id: string): Job | undefined {
    return this.jobs.find((job) => job.id === id)
  }

  // Get company by ID
  getCompanyById(id: string): Company | undefined {
    return this.companies.find((company) => company.id === id)
  }

  // Get job categories
  getJobCategories(): string[] {
    const categories = [...new Set(this.jobs.map((job) => job.category))]
    return categories.sort()
  }

  // Get job locations
  getJobLocations(): string[] {
    const locations = [...new Set(this.jobs.map((job) => job.location))]
    return locations.sort()
  }

  // Get popular skills
  getPopularSkills(): string[] {
    const allSkills = this.jobs.flatMap((job) => job.skills)
    const skillCounts = allSkills.reduce(
      (acc, skill) => {
        acc[skill] = (acc[skill] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(skillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([skill]) => skill)
  }

  // Get salary statistics
  getSalaryStats(): {
    average: number
    median: number
    min: number
    max: number
  } {
    const salaries = this.jobs.flatMap((job) => [job.salary.min, job.salary.max])
    salaries.sort((a, b) => a - b)

    const average = salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length
    const median = salaries[Math.floor(salaries.length / 2)]
    const min = Math.min(...salaries)
    const max = Math.max(...salaries)

    return { average, median, min, max }
  }
}

// Export singleton instance
export const chileanJobService = new ChileanJobService()

// Export default
export default chileanJobService
