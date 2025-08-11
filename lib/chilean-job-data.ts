export interface ChileanCompany {
  id: string
  name: string
  industry: string
  size: string
  location: string
  description: string
  website: string
  logo?: string
  jobCount: number
  averageSalary: {
    min: number
    max: number
    currency: string
  }
  benefits: string[]
  techStack?: string[]
  culture: string[]
  growth: "Alta" | "Moderada" | "Estable"
  remote: boolean
  jobPortals: string[]
}

export interface JobSearchFilters {
  location?: string
  industry?: string
  experience?: string
  salary?: {
    min: number
    max: number
  }
  remote?: boolean
  company?: string
  skills?: string[]
}

export interface JobStats {
  totalJobs: number
  averageSalary: number
  topSkills: Array<{ skill: string; count: number }>
  topCompanies: Array<{ company: string; jobCount: number }>
  locationDistribution: Array<{ location: string; count: number }>
  industryDistribution: Array<{ industry: string; count: number }>
}

export class ChileanJobService {
  private companies: ChileanCompany[] = [
    {
      id: "notco",
      name: "NotCo",
      industry: "Foodtech",
      size: "500-1000",
      location: "Santiago",
      description: "Empresa de tecnología alimentaria que utiliza IA para crear alternativas vegetales",
      website: "https://notco.com",
      jobCount: 45,
      averageSalary: { min: 2800000, max: 5000000, currency: "CLP" },
      benefits: ["Seguro complementario", "Stock options", "Trabajo híbrido", "Almuerzo gratis"],
      techStack: ["React", "Node.js", "Python", "AWS", "Docker"],
      culture: ["Innovación", "Sustentabilidad", "Diversidad", "Crecimiento rápido"],
      growth: "Alta",
      remote: true,
      jobPortals: ["trabajando", "getonboard"],
    },
    {
      id: "fintual",
      name: "Fintual",
      industry: "Fintech",
      size: "100-500",
      location: "Santiago",
      description: "Plataforma de inversiones automatizada para el mercado chileno",
      website: "https://fintual.cl",
      jobCount: 32,
      averageSalary: { min: 3000000, max: 5500000, currency: "CLP" },
      benefits: ["Equity", "Seguro de salud", "Vacaciones flexibles", "Presupuesto de aprendizaje"],
      techStack: ["Ruby on Rails", "React", "PostgreSQL", "AWS", "Docker"],
      culture: ["Transparencia", "Educación financiera", "Humor", "Excelencia técnica"],
      growth: "Alta",
      remote: true,
      jobPortals: ["getonboard", "laborum"],
    },
    {
      id: "cornershop",
      name: "Cornershop by Uber",
      industry: "E-commerce",
      size: "1000+",
      location: "Santiago",
      description: "Plataforma de delivery y compras online líder en Latinoamérica",
      website: "https://cornershopapp.com",
      jobCount: 78,
      averageSalary: { min: 2500000, max: 4200000, currency: "CLP" },
      benefits: ["Seguro de salud premium", "Uber credits", "Trabajo híbrido", "Bonos por performance"],
      techStack: ["Python", "Django", "React", "PostgreSQL", "AWS", "Kubernetes"],
      culture: ["Escala global", "Diversidad", "Innovación", "Impacto social"],
      growth: "Estable",
      remote: true,
      jobPortals: ["trabajando", "getonboard", "laborum"],
    },
    {
      id: "banco-chile",
      name: "Banco de Chile",
      industry: "Servicios Financieros",
      size: "10000+",
      location: "Nacional",
      description: "Uno de los bancos más grandes de Chile con fuerte enfoque en transformación digital",
      website: "https://www.bancochile.cl",
      jobCount: 156,
      averageSalary: { min: 2200000, max: 4000000, currency: "CLP" },
      benefits: ["Seguro complementario", "Bono de alimentación", "Capacitación", "Estabilidad laboral"],
      techStack: ["Java", "Spring", "Angular", "Oracle", "IBM", "Microservicios"],
      culture: ["Estabilidad", "Tradición", "Innovación digital", "Responsabilidad social"],
      growth: "Estable",
      remote: false,
      jobPortals: ["laborum", "trabajando"],
    },
    {
      id: "falabella",
      name: "Falabella",
      industry: "Retail",
      size: "50000+",
      location: "Nacional",
      description: "Líder en retail con fuerte transformación digital y e-commerce",
      website: "https://www.falabella.com",
      jobCount: 203,
      averageSalary: { min: 2000000, max: 3800000, currency: "CLP" },
      benefits: ["Seguro de salud", "Descuentos en tiendas", "Capacitación continua", "Bono anual"],
      techStack: ["Java", "React", "Node.js", "AWS", "Microservicios", "Kafka"],
      culture: ["Orientación al cliente", "Innovación", "Diversidad", "Crecimiento profesional"],
      growth: "Moderada",
      remote: false,
      jobPortals: ["laborum", "trabajando"],
    },
    {
      id: "buk",
      name: "Buk",
      industry: "HR Tech",
      size: "200-400",
      location: "Santiago",
      description: "Plataforma de gestión de recursos humanos para empresas latinoamericanas",
      website: "https://www.buk.cl",
      jobCount: 28,
      averageSalary: { min: 2800000, max: 4500000, currency: "CLP" },
      benefits: ["Stock options", "Seguro complementario", "Días de salud mental", "Oficina pet-friendly"],
      techStack: ["Ruby on Rails", "React", "PostgreSQL", "AWS", "Docker", "Kubernetes"],
      culture: ["Bienestar laboral", "Innovación", "Crecimiento", "Transparencia"],
      growth: "Alta",
      remote: true,
      jobPortals: ["getonboard", "trabajando"],
    },
    {
      id: "betterfly",
      name: "Betterfly",
      industry: "Insurtech",
      size: "100-300",
      location: "Santiago",
      description: "Plataforma de bienestar y seguros que conecta hábitos saludables con beneficios",
      website: "https://betterfly.com",
      jobCount: 22,
      averageSalary: { min: 2600000, max: 4200000, currency: "CLP" },
      benefits: ["Seguro de vida", "Beneficios de bienestar", "Trabajo remoto", "Stock options"],
      techStack: ["Node.js", "React", "MongoDB", "AWS", "Docker", "GraphQL"],
      culture: ["Propósito", "Bienestar", "Innovación social", "Crecimiento personal"],
      growth: "Alta",
      remote: true,
      jobPortals: ["getonboard"],
    },
    {
      id: "chiper",
      name: "Chiper",
      industry: "E-commerce",
      size: "200-500",
      location: "Santiago",
      description: "Plataforma B2B que conecta tiendas de barrio con proveedores",
      website: "https://chiper.co",
      jobCount: 35,
      averageSalary: { min: 2400000, max: 4000000, currency: "CLP" },
      benefits: ["Seguro de salud", "Trabajo híbrido", "Capacitación", "Bonos por objetivos"],
      techStack: ["React Native", "Node.js", "PostgreSQL", "AWS", "Docker"],
      culture: ["Impacto social", "Innovación", "Diversidad", "Crecimiento acelerado"],
      growth: "Alta",
      remote: true,
      jobPortals: ["getonboard"],
    },
    {
      id: "entel",
      name: "Entel",
      industry: "Telecomunicaciones",
      size: "5000+",
      location: "Nacional",
      description: "Líder en telecomunicaciones con fuerte inversión en 5G y transformación digital",
      website: "https://www.entel.cl",
      jobCount: 89,
      averageSalary: { min: 2300000, max: 4200000, currency: "CLP" },
      benefits: ["Seguro complementario", "Plan móvil", "Capacitación técnica", "Estabilidad laboral"],
      techStack: ["Java", "Python", "React", "Oracle", "AWS", "Kubernetes"],
      culture: ["Innovación tecnológica", "Conectividad", "Sostenibilidad", "Excelencia operacional"],
      growth: "Moderada",
      remote: false,
      jobPortals: ["laborum", "trabajando"],
    },
    {
      id: "khipu",
      name: "Khipu",
      industry: "Fintech",
      size: "50-100",
      location: "Santiago",
      description: "Plataforma de pagos digitales para e-commerce en Latinoamérica",
      website: "https://khipu.com",
      jobCount: 15,
      averageSalary: { min: 2500000, max: 4000000, currency: "CLP" },
      benefits: ["Equity", "Seguro de salud", "Trabajo remoto", "Presupuesto de capacitación"],
      techStack: ["Java", "Spring Boot", "React", "PostgreSQL", "AWS"],
      culture: ["Innovación fintech", "Agilidad", "Calidad técnica", "Crecimiento sostenible"],
      growth: "Moderada",
      remote: true,
      jobPortals: ["getonboard"],
    },
  ]

  private topSkills = [
    { skill: "JavaScript", count: 245, demand: "Alta", avgSalary: 3200000 },
    { skill: "React", count: 198, demand: "Alta", avgSalary: 3400000 },
    { skill: "Python", count: 187, demand: "Alta", avgSalary: 3300000 },
    { skill: "Node.js", count: 156, demand: "Alta", avgSalary: 3250000 },
    { skill: "Java", count: 143, demand: "Media", avgSalary: 3100000 },
    { skill: "AWS", count: 134, demand: "Alta", avgSalary: 3600000 },
    { skill: "Docker", count: 112, demand: "Media", avgSalary: 3300000 },
    { skill: "PostgreSQL", count: 98, demand: "Media", avgSalary: 3000000 },
    { skill: "TypeScript", count: 89, demand: "Alta", avgSalary: 3500000 },
    { skill: "Angular", count: 76, demand: "Media", avgSalary: 3200000 },
    { skill: "Spring Boot", count: 67, demand: "Media", avgSalary: 3100000 },
    { skill: "Kubernetes", count: 54, demand: "Alta", avgSalary: 3800000 },
    { skill: "MongoDB", count: 45, demand: "Media", avgSalary: 3150000 },
    { skill: "GraphQL", count: 34, demand: "Media", avgSalary: 3400000 },
    { skill: "React Native", count: 28, demand: "Media", avgSalary: 3300000 },
  ]

  async getTopCompanies(limit = 10): Promise<ChileanCompany[]> {
    return this.companies.sort((a, b) => b.jobCount - a.jobCount).slice(0, limit)
  }

  async getTopSkills(limit = 15) {
    return this.topSkills.sort((a, b) => b.count - a.count).slice(0, limit)
  }

  async searchJobs(query: string, filters: JobSearchFilters = {}) {
    // Mock job search implementation
    let filteredCompanies = this.companies

    if (filters.location) {
      filteredCompanies = filteredCompanies.filter((company) =>
        company.location.toLowerCase().includes(filters.location!.toLowerCase()),
      )
    }

    if (filters.industry) {
      filteredCompanies = filteredCompanies.filter((company) =>
        company.industry.toLowerCase().includes(filters.industry!.toLowerCase()),
      )
    }

    if (filters.remote !== undefined) {
      filteredCompanies = filteredCompanies.filter((company) => company.remote === filters.remote)
    }

    // Generate mock jobs based on filtered companies
    const jobs = filteredCompanies.flatMap((company) =>
      Array.from({ length: Math.min(company.jobCount, 5) }, (_, index) => ({
        id: `${company.id}-${index}`,
        title: this.generateJobTitle(company.industry),
        company: company.name,
        location: company.location,
        salary: `$${company.averageSalary.min.toLocaleString()} - $${company.averageSalary.max.toLocaleString()} CLP`,
        type: "Tiempo completo",
        posted: this.getRandomDate(),
        match: Math.floor(Math.random() * 30) + 70,
        description: `Únete a ${company.name} y forma parte de ${company.description}`,
        requirements: company.techStack?.slice(0, 5) || [],
        benefits: company.benefits,
        remote: company.remote,
        industry: company.industry,
        verified: true,
        skills: company.techStack || [],
      })),
    )

    return jobs.slice(0, 20)
  }

  async getJobStats(): Promise<JobStats> {
    const totalJobs = this.companies.reduce((sum, company) => sum + company.jobCount, 0)
    const averageSalary =
      this.companies.reduce((sum, company) => sum + (company.averageSalary.min + company.averageSalary.max) / 2, 0) /
      this.companies.length

    const locationDistribution = this.companies.reduce(
      (acc, company) => {
        const existing = acc.find((item) => item.location === company.location)
        if (existing) {
          existing.count += company.jobCount
        } else {
          acc.push({ location: company.location, count: company.jobCount })
        }
        return acc
      },
      [] as Array<{ location: string; count: number }>,
    )

    const industryDistribution = this.companies.reduce(
      (acc, company) => {
        const existing = acc.find((item) => item.industry === company.industry)
        if (existing) {
          existing.count += company.jobCount
        } else {
          acc.push({ industry: company.industry, count: company.jobCount })
        }
        return acc
      },
      [] as Array<{ industry: string; count: number }>,
    )

    return {
      totalJobs,
      averageSalary: Math.round(averageSalary),
      topSkills: this.topSkills.slice(0, 10),
      topCompanies: this.companies
        .sort((a, b) => b.jobCount - a.jobCount)
        .slice(0, 10)
        .map((company) => ({ company: company.name, jobCount: company.jobCount })),
      locationDistribution: locationDistribution.sort((a, b) => b.count - a.count),
      industryDistribution: industryDistribution.sort((a, b) => b.count - a.count),
    }
  }

  async getCompanyDetails(companyId: string): Promise<ChileanCompany | null> {
    return this.companies.find((company) => company.id === companyId) || null
  }

  async getSalaryInsights(role: string, experience: string) {
    // Mock salary insights based on role and experience
    const baseRanges: Record<string, { min: number; max: number }> = {
      desarrollador: { min: 1800000, max: 4500000 },
      senior: { min: 3000000, max: 6000000 },
      lead: { min: 4000000, max: 7000000 },
      manager: { min: 4500000, max: 8000000 },
    }

    const experienceMultiplier: Record<string, number> = {
      junior: 0.7,
      "semi-senior": 1.0,
      senior: 1.4,
      lead: 1.8,
    }

    const roleKey = Object.keys(baseRanges).find((key) => role.toLowerCase().includes(key)) || "desarrollador"

    const expMultiplier = experienceMultiplier[experience.toLowerCase()] || 1.0
    const baseRange = baseRanges[roleKey]

    return {
      min: Math.round(baseRange.min * expMultiplier),
      max: Math.round(baseRange.max * expMultiplier),
      currency: "CLP",
      marketAverage: Math.round(((baseRange.min + baseRange.max) / 2) * expMultiplier),
      percentile25: Math.round(baseRange.min * expMultiplier * 1.1),
      percentile75: Math.round(baseRange.max * expMultiplier * 0.9),
    }
  }

  private generateJobTitle(industry: string): string {
    const titles: Record<string, string[]> = {
      Foodtech: ["Desarrollador Full Stack", "Data Scientist", "Product Manager", "DevOps Engineer"],
      Fintech: ["Desarrollador Backend", "Frontend Developer", "Security Engineer", "Product Manager"],
      "E-commerce": ["Desarrollador Full Stack", "Mobile Developer", "UX Designer", "Data Analyst"],
      "Servicios Financieros": ["Analista de Sistemas", "Arquitecto de Software", "Business Analyst", "QA Engineer"],
      Retail: ["Desarrollador Frontend", "Data Scientist", "UX/UI Designer", "Scrum Master"],
      "HR Tech": ["Full Stack Developer", "Product Designer", "Backend Engineer", "Customer Success"],
      Insurtech: ["Software Engineer", "Data Engineer", "Product Manager", "Frontend Developer"],
      Telecomunicaciones: ["Network Engineer", "Software Developer", "Systems Analyst", "Cloud Architect"],
    }

    const industryTitles = titles[industry] || titles["Foodtech"]
    return industryTitles[Math.floor(Math.random() * industryTitles.length)]
  }

  private getRandomDate(): string {
    const days = Math.floor(Math.random() * 14) + 1
    const dates = [
      `hace ${days} día${days > 1 ? "s" : ""}`,
      `hace ${Math.floor(days / 7)} semana${Math.floor(days / 7) > 1 ? "s" : ""}`,
      "hace 1 mes",
    ]
    return dates[Math.floor(Math.random() * dates.length)]
  }
}

export const chileanJobService = new ChileanJobService()
