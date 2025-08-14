export interface JobListing {
  id: string
  title: string
  company: string
  location: string
  salary_min?: number
  salary_max?: number
  currency: string
  employment_type: "full-time" | "part-time" | "contract" | "internship"
  experience_level: "entry" | "mid" | "senior" | "executive"
  remote_work: boolean
  description: string
  requirements: string[]
  benefits: string[]
  skills: string[]
  industry: string
  posted_date: string
  application_deadline?: string
  source: "trabajando.cl" | "laborum.com" | "indeed.cl" | "linkedin" | "computrabajo.cl"
  company_size?: string
  company_logo?: string
}

export interface JobStats {
  total_jobs: number
  by_source: Record<string, number>
  by_region: Record<string, number>
  by_industry: Record<string, number>
  by_experience: Record<string, number>
  by_employment_type: Record<string, number>
  average_salary: number
  salary_ranges: {
    min: number
    max: number
    currency: string
  }
  remote_percentage: number
  top_skills: Array<{ skill: string; count: number }>
  top_companies: Array<{ company: string; count: number }>
}

// Mock job data for Chilean market
const mockJobs: JobListing[] = [
  {
    id: "job-001",
    title: "Desarrollador Full Stack",
    company: "Banco de Chile",
    location: "Santiago, Región Metropolitana",
    salary_min: 1800000,
    salary_max: 2500000,
    currency: "CLP",
    employment_type: "full-time",
    experience_level: "mid",
    remote_work: true,
    description:
      "Buscamos un desarrollador full stack para unirse a nuestro equipo de transformación digital. Trabajarás en proyectos innovadores utilizando tecnologías modernas.",
    requirements: [
      "3+ años de experiencia en desarrollo web",
      "Conocimiento en React y Node.js",
      "Experiencia con bases de datos SQL",
      "Inglés intermedio",
    ],
    benefits: [
      "Seguro de salud complementario",
      "Bonos por desempeño",
      "Capacitación continua",
      "Trabajo remoto híbrido",
    ],
    skills: ["React", "Node.js", "JavaScript", "SQL", "Git"],
    industry: "Servicios Financieros",
    posted_date: "2024-01-15",
    application_deadline: "2024-02-15",
    source: "trabajando.cl",
    company_size: "Grande (1000+ empleados)",
  },
  {
    id: "job-002",
    title: "Analista de Datos",
    company: "Falabella",
    location: "Santiago, Región Metropolitana",
    salary_min: 1500000,
    salary_max: 2000000,
    currency: "CLP",
    employment_type: "full-time",
    experience_level: "entry",
    remote_work: false,
    description:
      "Únete a nuestro equipo de analytics para ayudar a tomar decisiones basadas en datos. Trabajarás con grandes volúmenes de información del retail.",
    requirements: [
      "Título en Ingeniería, Estadística o afines",
      "Conocimiento en Python o R",
      "Experiencia con SQL",
      "Conocimientos de estadística",
    ],
    benefits: [
      "Descuentos en tiendas Falabella",
      "Seguro de vida",
      "Capacitación en herramientas de análisis",
      "Oportunidades de crecimiento",
    ],
    skills: ["Python", "SQL", "Excel", "Tableau", "Estadística"],
    industry: "Retail",
    posted_date: "2024-01-12",
    source: "laborum.com",
    company_size: "Grande (1000+ empleados)",
  },
  {
    id: "job-003",
    title: "Ingeniero DevOps",
    company: "Cornershop by Uber",
    location: "Santiago, Región Metropolitana",
    salary_min: 2200000,
    salary_max: 3000000,
    currency: "CLP",
    employment_type: "full-time",
    experience_level: "senior",
    remote_work: true,
    description:
      "Buscamos un ingeniero DevOps experimentado para optimizar nuestra infraestructura cloud y procesos de deployment.",
    requirements: [
      "5+ años de experiencia en DevOps",
      "Experiencia con AWS o GCP",
      "Conocimiento en Docker y Kubernetes",
      "Experiencia con CI/CD",
    ],
    benefits: ["Stock options", "Seguro de salud premium", "Trabajo 100% remoto", "Presupuesto para equipos"],
    skills: ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins"],
    industry: "Tecnología",
    posted_date: "2024-01-10",
    source: "linkedin",
    company_size: "Mediana (100-1000 empleados)",
  },
  {
    id: "job-004",
    title: "Diseñador UX/UI",
    company: "Ripley",
    location: "Santiago, Región Metropolitana",
    salary_min: 1400000,
    salary_max: 1900000,
    currency: "CLP",
    employment_type: "full-time",
    experience_level: "mid",
    remote_work: true,
    description:
      "Únete a nuestro equipo de experiencia digital para crear interfaces intuitivas y atractivas para nuestros clientes.",
    requirements: [
      "3+ años de experiencia en UX/UI",
      "Dominio de Figma y Adobe Creative Suite",
      "Experiencia en design systems",
      "Portfolio sólido",
    ],
    benefits: ["Horario flexible", "Descuentos corporativos", "Capacitación en diseño", "Ambiente creativo"],
    skills: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research"],
    industry: "Retail",
    posted_date: "2024-01-08",
    source: "indeed.cl",
    company_size: "Grande (1000+ empleados)",
  },
  {
    id: "job-005",
    title: "Contador Senior",
    company: "EY Chile",
    location: "Santiago, Región Metropolitana",
    salary_min: 1600000,
    salary_max: 2200000,
    currency: "CLP",
    employment_type: "full-time",
    experience_level: "senior",
    remote_work: false,
    description:
      "Buscamos un contador senior para liderar procesos contables y financieros de nuestros clientes corporativos.",
    requirements: [
      "Título de Contador Auditor",
      "5+ años de experiencia en auditoría",
      "Conocimiento de IFRS",
      "Inglés avanzado",
    ],
    benefits: [
      "Certificaciones internacionales",
      "Seguro de salud",
      "Bonos por objetivos",
      "Oportunidades internacionales",
    ],
    skills: ["IFRS", "Auditoría", "SAP", "Excel Avanzado", "Análisis Financiero"],
    industry: "Servicios Profesionales",
    posted_date: "2024-01-05",
    source: "trabajando.cl",
    company_size: "Grande (1000+ empleados)",
  },
  {
    id: "job-006",
    title: "Especialista en Marketing Digital",
    company: "Mercado Libre",
    location: "Santiago, Región Metropolitana",
    salary_min: 1700000,
    salary_max: 2300000,
    currency: "CLP",
    employment_type: "full-time",
    experience_level: "mid",
    remote_work: true,
    description:
      "Únete a nuestro equipo de marketing para desarrollar estrategias digitales innovadoras y hacer crecer nuestra presencia en el mercado chileno.",
    requirements: [
      "3+ años en marketing digital",
      "Experiencia con Google Ads y Facebook Ads",
      "Conocimiento de analytics",
      "Experiencia en e-commerce",
    ],
    benefits: ["Trabajo remoto", "Descuentos en Mercado Libre", "Capacitación continua", "Ambiente multicultural"],
    skills: ["Google Ads", "Facebook Ads", "Google Analytics", "SEO", "Email Marketing"],
    industry: "E-commerce",
    posted_date: "2024-01-03",
    source: "computrabajo.cl",
    company_size: "Grande (1000+ empleados)",
  },
  {
    id: "job-007",
    title: "Ingeniero de Software Junior",
    company: "NotCo",
    location: "Santiago, Región Metropolitana",
    salary_min: 1200000,
    salary_max: 1600000,
    currency: "CLP",
    employment_type: "full-time",
    experience_level: "entry",
    remote_work: true,
    description:
      "Buscamos desarrolladores junior apasionados por la tecnología y la sustentabilidad para unirse a nuestro equipo de ingeniería.",
    requirements: [
      "Título en Ingeniería o carrera afín",
      "Conocimiento en Python o JavaScript",
      "Experiencia con Git",
      "Inglés intermedio",
    ],
    benefits: ["Productos NotCo gratis", "Ambiente startup", "Flexibilidad horaria", "Crecimiento acelerado"],
    skills: ["Python", "JavaScript", "Git", "API REST", "Bases de datos"],
    industry: "FoodTech",
    posted_date: "2024-01-01",
    source: "linkedin",
    company_size: "Mediana (100-1000 empleados)",
  },
  {
    id: "job-008",
    title: "Gerente de Proyectos TI",
    company: "Entel",
    location: "Santiago, Región Metropolitana",
    salary_min: 2500000,
    salary_max: 3500000,
    currency: "CLP",
    employment_type: "full-time",
    experience_level: "senior",
    remote_work: false,
    description:
      "Liderar proyectos de transformación digital en una de las principales empresas de telecomunicaciones de Chile.",
    requirements: [
      "7+ años en gestión de proyectos TI",
      "Certificación PMP deseable",
      "Experiencia en telecomunicaciones",
      "Liderazgo de equipos grandes",
    ],
    benefits: [
      "Plan de telefonía corporativo",
      "Seguro de salud familiar",
      "Bonos por resultados",
      "Capacitación en liderazgo",
    ],
    skills: ["Gestión de Proyectos", "Scrum", "Agile", "Liderazgo", "Telecomunicaciones"],
    industry: "Telecomunicaciones",
    posted_date: "2023-12-28",
    source: "trabajando.cl",
    company_size: "Grande (1000+ empleados)",
  },
  {
    id: "job-009",
    title: "Analista de Ciberseguridad",
    company: "BCI",
    location: "Santiago, Región Metropolitana",
    salary_min: 1900000,
    salary_max: 2600000,
    currency: "CLP",
    employment_type: "full-time",
    experience_level: "mid",
    remote_work: false,
    description:
      "Proteger la infraestructura tecnológica del banco mediante el monitoreo y análisis de amenazas de seguridad.",
    requirements: [
      "Título en Ingeniería o Informática",
      "3+ años en ciberseguridad",
      "Certificaciones de seguridad (CISSP, CEH)",
      "Conocimiento de SIEM",
    ],
    benefits: ["Certificaciones pagadas", "Seguro de salud premium", "Bonos por desempeño", "Estabilidad laboral"],
    skills: ["SIEM", "Ethical Hacking", "Incident Response", "Risk Assessment", "Compliance"],
    industry: "Servicios Financieros",
    posted_date: "2023-12-25",
    source: "laborum.com",
    company_size: "Grande (1000+ empleados)",
  },
  {
    id: "job-010",
    title: "Desarrollador Mobile React Native",
    company: "Fintual",
    location: "Santiago, Región Metropolitana",
    salary_min: 1800000,
    salary_max: 2400000,
    currency: "CLP",
    employment_type: "full-time",
    experience_level: "mid",
    remote_work: true,
    description:
      "Desarrollar y mantener aplicaciones móviles para nuestra plataforma de inversiones, enfocándose en la experiencia del usuario.",
    requirements: [
      "3+ años en desarrollo mobile",
      "Experiencia sólida con React Native",
      "Conocimiento de APIs REST",
      "Experiencia con App Store y Play Store",
    ],
    benefits: [
      "Inversiones en Fintual",
      "Trabajo 100% remoto",
      "Equipos de última generación",
      "Cultura de innovación",
    ],
    skills: ["React Native", "JavaScript", "TypeScript", "Redux", "Mobile Development"],
    industry: "FinTech",
    posted_date: "2023-12-22",
    source: "indeed.cl",
    company_size: "Pequeña (10-100 empleados)",
  },
]

export class ChileanJobService {
  private jobs: JobListing[] = mockJobs

  // Helper method to get region from location
  private getRegionFromLocation(location: string): string {
    if (location.includes("Santiago") || location.includes("Metropolitana")) {
      return "Región Metropolitana"
    } else if (location.includes("Valparaíso")) {
      return "Región de Valparaíso"
    } else if (location.includes("Concepción") || location.includes("Biobío")) {
      return "Región del Biobío"
    } else if (location.includes("Antofagasta")) {
      return "Región de Antofagasta"
    } else if (location.includes("La Serena") || location.includes("Coquimbo")) {
      return "Región de Coquimbo"
    }
    return "Otras Regiones"
  }

  async searchJobs(
    filters: {
      query?: string
      location?: string
      industry?: string
      experience_level?: string
      employment_type?: string
      salary_min?: number
      salary_max?: number
      remote_work?: boolean
      source?: string
    } = {},
  ): Promise<JobListing[]> {
    let filteredJobs = [...this.jobs]

    // Apply filters
    if (filters.query) {
      const query = filters.query.toLowerCase()
      filteredJobs = filteredJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.skills.some((skill) => skill.toLowerCase().includes(query)),
      )
    }

    if (filters.location) {
      filteredJobs = filteredJobs.filter((job) => job.location.toLowerCase().includes(filters.location!.toLowerCase()))
    }

    if (filters.industry) {
      filteredJobs = filteredJobs.filter((job) => job.industry === filters.industry)
    }

    if (filters.experience_level) {
      filteredJobs = filteredJobs.filter((job) => job.experience_level === filters.experience_level)
    }

    if (filters.employment_type) {
      filteredJobs = filteredJobs.filter((job) => job.employment_type === filters.employment_type)
    }

    if (filters.salary_min) {
      filteredJobs = filteredJobs.filter((job) => (job.salary_max || 0) >= filters.salary_min!)
    }

    if (filters.salary_max) {
      filteredJobs = filteredJobs.filter((job) => (job.salary_min || 0) <= filters.salary_max!)
    }

    if (filters.remote_work !== undefined) {
      filteredJobs = filteredJobs.filter((job) => job.remote_work === filters.remote_work)
    }

    if (filters.source) {
      filteredJobs = filteredJobs.filter((job) => job.source === filters.source)
    }

    return filteredJobs
  }

  async getJobById(id: string): Promise<JobListing | null> {
    return this.jobs.find((job) => job.id === id) || null
  }

  async getJobStats(): Promise<JobStats> {
    const jobs = this.jobs

    // Calculate stats
    const bySource: Record<string, number> = {}
    const byRegion: Record<string, number> = {}
    const byIndustry: Record<string, number> = {}
    const byExperience: Record<string, number> = {}
    const byEmploymentType: Record<string, number> = {}
    const skillCounts: Record<string, number> = {}
    const companyCounts: Record<string, number> = {}

    let totalSalary = 0
    let salaryCount = 0
    let remoteCount = 0
    let minSalary = Number.POSITIVE_INFINITY
    let maxSalary = 0

    jobs.forEach((job) => {
      // Source stats
      bySource[job.source] = (bySource[job.source] || 0) + 1

      // Region stats
      const region = this.getRegionFromLocation(job.location)
      byRegion[region] = (byRegion[region] || 0) + 1

      // Industry stats
      byIndustry[job.industry] = (byIndustry[job.industry] || 0) + 1

      // Experience stats
      byExperience[job.experience_level] = (byExperience[job.experience_level] || 0) + 1

      // Employment type stats
      byEmploymentType[job.employment_type] = (byEmploymentType[job.employment_type] || 0) + 1

      // Skills stats
      job.skills.forEach((skill) => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1
      })

      // Company stats
      companyCounts[job.company] = (companyCounts[job.company] || 0) + 1

      // Salary stats
      if (job.salary_min && job.salary_max) {
        const avgSalary = (job.salary_min + job.salary_max) / 2
        totalSalary += avgSalary
        salaryCount++
        minSalary = Math.min(minSalary, job.salary_min)
        maxSalary = Math.max(maxSalary, job.salary_max)
      }

      // Remote work stats
      if (job.remote_work) {
        remoteCount++
      }
    })

    // Top skills (sorted by count)
    const topSkills = Object.entries(skillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count }))

    // Top companies (sorted by count)
    const topCompanies = Object.entries(companyCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([company, count]) => ({ company, count }))

    return {
      total_jobs: jobs.length,
      by_source: bySource,
      by_region: byRegion,
      by_industry: byIndustry,
      by_experience: byExperience,
      by_employment_type: byEmploymentType,
      average_salary: salaryCount > 0 ? Math.round(totalSalary / salaryCount) : 0,
      salary_ranges: {
        min: minSalary === Number.POSITIVE_INFINITY ? 0 : minSalary,
        max: maxSalary,
        currency: "CLP",
      },
      remote_percentage: Math.round((remoteCount / jobs.length) * 100),
      top_skills: topSkills,
      top_companies: topCompanies,
    }
  }

  async getCompanies(): Promise<Array<{ name: string; count: number }>> {
    const companyCounts: Record<string, number> = {}

    this.jobs.forEach((job) => {
      companyCounts[job.company] = (companyCounts[job.company] || 0) + 1
    })

    return Object.entries(companyCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([name, count]) => ({ name, count }))
  }

  async getIndustries(): Promise<string[]> {
    const industries = new Set(this.jobs.map((job) => job.industry))
    return Array.from(industries).sort()
  }

  async getLocations(): Promise<string[]> {
    const locations = new Set(this.jobs.map((job) => job.location))
    return Array.from(locations).sort()
  }

  async getSources(): Promise<string[]> {
    const sources = new Set(this.jobs.map((job) => job.source))
    return Array.from(sources).sort()
  }
}

// Export singleton instance
export const chileanJobService = new ChileanJobService()
