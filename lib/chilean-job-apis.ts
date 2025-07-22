// Chilean Job Portal API Integrations
export interface ChileanJob {
  id: string
  title: string
  company: string
  location: string
  region: string
  commune: string
  salary?: string
  salaryMin?: number
  salaryMax?: number
  currency: "CLP" | "UF" | "USD"
  type: "full-time" | "part-time" | "contract" | "internship" | "freelance"
  modality: "presencial" | "remoto" | "híbrido"
  experience: "sin-experiencia" | "junior" | "semi-senior" | "senior" | "gerencial"
  description: string
  requirements: string[]
  benefits: string[]
  skills: string[]
  industry: string
  companySize: string
  postedDate: string
  applicationDeadline?: string
  applicationUrl: string
  source: "trabajando" | "laborum" | "getonboard" | "computrabajo" | "indeed-chile"
  isRemote: boolean
  isUrgent?: boolean
  companyLogo?: string
  verified: boolean
}

export interface JobSearchFilters {
  query?: string
  location?: string
  region?: string
  commune?: string
  industry?: string
  experience?: string
  modality?: string
  salaryMin?: number
  salaryMax?: number
  type?: string
  skills?: string[]
  company?: string
  postedDays?: number
}

// Trabajando.com API Integration
export class TrabajandoAPI {
  private baseUrl = "https://api.trabajando.com/v1"
  private apiKey = process.env.TRABAJANDO_API_KEY

  async searchJobs(filters: JobSearchFilters): Promise<ChileanJob[]> {
    try {
      const params = new URLSearchParams()

      if (filters.query) params.append("q", filters.query)
      if (filters.location) params.append("location", filters.location)
      if (filters.region) params.append("region", filters.region)
      if (filters.experience) params.append("experience", filters.experience)
      if (filters.modality) params.append("modality", filters.modality)
      if (filters.salaryMin) params.append("salary_min", filters.salaryMin.toString())
      if (filters.type) params.append("type", filters.type)

      params.append("country", "chile")
      params.append("limit", "50")
      params.append("sort", "date_desc")

      const response = await fetch(`${this.baseUrl}/jobs/search?${params}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "User-Agent": "DTC-Platform/1.0",
        },
      })

      if (!response.ok) {
        throw new Error(`Trabajando API error: ${response.status}`)
      }

      const data = await response.json()
      return this.transformTrabajandoJobs(data.jobs || [])
    } catch (error) {
      console.error("Error fetching from Trabajando.com:", error)
      return []
    }
  }

  private transformTrabajandoJobs(jobs: any[]): ChileanJob[] {
    return jobs.map((job) => ({
      id: `trabajando-${job.id}`,
      title: job.title,
      company: job.company?.name || "Empresa Confidencial",
      location: job.location?.full_name || "Santiago, Chile",
      region: job.location?.region || "Metropolitana",
      commune: job.location?.commune || "Santiago",
      salary: job.salary?.display,
      salaryMin: job.salary?.min,
      salaryMax: job.salary?.max,
      currency: job.salary?.currency || "CLP",
      type: this.mapJobType(job.type),
      modality: this.mapModality(job.modality),
      experience: this.mapExperience(job.experience_level),
      description: job.description || "",
      requirements: job.requirements || [],
      benefits: job.benefits || [],
      skills: job.skills || [],
      industry: job.industry?.name || "Otros",
      companySize: job.company?.size || "No especificado",
      postedDate: job.created_at,
      applicationDeadline: job.deadline,
      applicationUrl: job.application_url || job.url,
      source: "trabajando",
      isRemote: job.modality === "remote" || job.modality === "hybrid",
      isUrgent: job.is_urgent || false,
      companyLogo: job.company?.logo_url,
      verified: job.company?.verified || false,
    }))
  }

  private mapJobType(type: string): ChileanJob["type"] {
    const typeMap: Record<string, ChileanJob["type"]> = {
      full_time: "full-time",
      part_time: "part-time",
      contract: "contract",
      internship: "internship",
      freelance: "freelance",
    }
    return typeMap[type] || "full-time"
  }

  private mapModality(modality: string): ChileanJob["modality"] {
    const modalityMap: Record<string, ChileanJob["modality"]> = {
      onsite: "presencial",
      remote: "remoto",
      hybrid: "híbrido",
    }
    return modalityMap[modality] || "presencial"
  }

  private mapExperience(experience: string): ChileanJob["experience"] {
    const expMap: Record<string, ChileanJob["experience"]> = {
      no_experience: "sin-experiencia",
      junior: "junior",
      mid: "semi-senior",
      senior: "senior",
      executive: "gerencial",
    }
    return expMap[experience] || "junior"
  }
}

// GetOnBoard API Integration
export class GetOnBoardAPI {
  private baseUrl = "https://api.getonboard.com/v1"
  private apiKey = process.env.GETONBOARD_API_KEY

  async searchJobs(filters: JobSearchFilters): Promise<ChileanJob[]> {
    try {
      const params = new URLSearchParams()

      if (filters.query) params.append("query", filters.query)
      if (filters.location) params.append("location", filters.location)
      if (filters.experience) params.append("seniority", filters.experience)
      if (filters.modality) params.append("modality", filters.modality)
      if (filters.type) params.append("job_type", filters.type)

      params.append("country", "CL")
      params.append("per_page", "50")
      params.append("expand", "company,location")

      const response = await fetch(`${this.baseUrl}/jobs?${params}`, {
        headers: {
          Authorization: `Token ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`GetOnBoard API error: ${response.status}`)
      }

      const data = await response.json()
      return this.transformGetOnBoardJobs(data.data || [])
    } catch (error) {
      console.error("Error fetching from GetOnBoard:", error)
      return []
    }
  }

  private transformGetOnBoardJobs(jobs: any[]): ChileanJob[] {
    return jobs.map((job) => ({
      id: `getonboard-${job.id}`,
      title: job.attributes.title,
      company: job.attributes.company?.data?.attributes?.name || "Empresa Confidencial",
      location: `${job.attributes.location?.data?.attributes?.name}, Chile`,
      region: this.getRegionFromLocation(job.attributes.location?.data?.attributes?.name),
      commune: job.attributes.location?.data?.attributes?.name || "Santiago",
      salary: job.attributes.salary_range,
      salaryMin: job.attributes.min_salary,
      salaryMax: job.attributes.max_salary,
      currency: "CLP",
      type: this.mapJobType(job.attributes.job_type),
      modality: this.mapModality(job.attributes.modality),
      experience: this.mapSeniority(job.attributes.seniority),
      description: job.attributes.description || "",
      requirements: job.attributes.desirable || [],
      benefits: job.attributes.benefits || [],
      skills: job.attributes.tags || [],
      industry: job.attributes.category?.name || "Tecnología",
      companySize: job.attributes.company?.data?.attributes?.size || "No especificado",
      postedDate: job.attributes.published_at,
      applicationDeadline: job.attributes.deadline,
      applicationUrl: `https://www.getonboard.com/jobs/${job.id}`,
      source: "getonboard",
      isRemote: job.attributes.modality === "remote",
      isUrgent: job.attributes.featured || false,
      companyLogo: job.attributes.company?.data?.attributes?.logo?.thumb?.url,
      verified: true, // GetOnBoard verifies companies
    }))
  }

  private getRegionFromLocation(location: string): string {
    const regionMap: Record<string, string> = {
      Santiago: "Metropolitana",
      Valparaíso: "Valparaíso",
      "Viña del Mar": "Valparaíso",
      Concepción: "Biobío",
      "La Serena": "Coquimbo",
      Antofagasta: "Antofagasta",
      Temuco: "La Araucanía",
      Rancagua: "O'Higgins",
      Talca: "Maule",
      Arica: "Arica y Parinacota",
      Iquique: "Tarapacá",
      Copiapó: "Atacama",
      Chillán: "Ñuble",
      Valdivia: "Los Ríos",
      "Puerto Montt": "Los Lagos",
      Coyhaique: "Aysén",
      "Punta Arenas": "Magallanes",
    }
    return regionMap[location] || "Metropolitana"
  }

  private mapJobType(type: string): ChileanJob["type"] {
    const typeMap: Record<string, ChileanJob["type"]> = {
      "full-time": "full-time",
      "part-time": "part-time",
      contract: "contract",
      internship: "internship",
      freelance: "freelance",
    }
    return typeMap[type] || "full-time"
  }

  private mapModality(modality: string): ChileanJob["modality"] {
    const modalityMap: Record<string, ChileanJob["modality"]> = {
      office: "presencial",
      remote: "remoto",
      hybrid: "híbrido",
    }
    return modalityMap[modality] || "presencial"
  }

  private mapSeniority(seniority: string): ChileanJob["experience"] {
    const seniorityMap: Record<string, ChileanJob["experience"]> = {
      "no-experience": "sin-experiencia",
      junior: "junior",
      "semi-senior": "semi-senior",
      senior: "senior",
      lead: "gerencial",
    }
    return seniorityMap[seniority] || "junior"
  }
}

// Laborum API Integration (simplified - they don't have public API)
export class LaborumScraper {
  async searchJobs(filters: JobSearchFilters): Promise<ChileanJob[]> {
    // Note: Laborum doesn't have a public API, so this would require web scraping
    // For demo purposes, returning mock data that represents Laborum structure
    return this.getMockLaborumJobs(filters)
  }

  private getMockLaborumJobs(filters: JobSearchFilters): ChileanJob[] {
    const mockJobs: ChileanJob[] = [
      {
        id: "laborum-1",
        title: "Desarrollador Full Stack",
        company: "Banco Santander Chile",
        location: "Santiago, Providencia",
        region: "Metropolitana",
        commune: "Providencia",
        salary: "$2.500.000 - $3.500.000",
        salaryMin: 2500000,
        salaryMax: 3500000,
        currency: "CLP",
        type: "full-time",
        modality: "híbrido",
        experience: "semi-senior",
        description: "Buscamos desarrollador full stack para unirse a nuestro equipo de transformación digital.",
        requirements: ["3+ años experiencia", "React", "Node.js", "Bases de datos"],
        benefits: ["Seguro complementario", "Bonos", "Capacitación"],
        skills: ["React", "Node.js", "JavaScript", "SQL"],
        industry: "Servicios Financieros",
        companySize: "10000+",
        postedDate: new Date().toISOString(),
        applicationUrl: "https://laborum.cl/empleos/desarrollador-full-stack",
        source: "laborum",
        isRemote: false,
        verified: true,
      },
      {
        id: "laborum-2",
        title: "Analista de Datos",
        company: "Falabella",
        location: "Santiago, Las Condes",
        region: "Metropolitana",
        commune: "Las Condes",
        salary: "$1.800.000 - $2.800.000",
        salaryMin: 1800000,
        salaryMax: 2800000,
        currency: "CLP",
        type: "full-time",
        modality: "presencial",
        experience: "junior",
        description: "Únete a nuestro equipo de analytics para impulsar decisiones basadas en datos.",
        requirements: ["Python", "SQL", "Tableau", "Estadística"],
        benefits: ["Descuentos empleado", "Seguro de salud", "Capacitación"],
        skills: ["Python", "SQL", "Tableau", "Excel"],
        industry: "Retail",
        companySize: "50000+",
        postedDate: new Date(Date.now() - 86400000).toISOString(),
        applicationUrl: "https://laborum.cl/empleos/analista-datos",
        source: "laborum",
        isRemote: false,
        verified: true,
      },
    ]

    // Apply basic filtering
    let filtered = mockJobs
    if (filters.query) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(filters.query!.toLowerCase()) ||
          job.company.toLowerCase().includes(filters.query!.toLowerCase()),
      )
    }
    if (filters.location) {
      filtered = filtered.filter((job) => job.location.toLowerCase().includes(filters.location!.toLowerCase()))
    }
    if (filters.experience) {
      filtered = filtered.filter((job) => job.experience === filters.experience)
    }

    return filtered
  }
}

// Job Aggregation Service
export class ChileanJobAggregator {
  private trabajandoAPI: TrabajandoAPI
  private getOnBoardAPI: GetOnBoardAPI
  private laborumScraper: LaborumScraper

  constructor() {
    this.trabajandoAPI = new TrabajandoAPI()
    this.getOnBoardAPI = new GetOnBoardAPI()
    this.laborumScraper = new LaborumScraper()
  }

  async searchAllPortals(filters: JobSearchFilters): Promise<ChileanJob[]> {
    try {
      const [trabajandoJobs, getOnBoardJobs, laborumJobs] = await Promise.allSettled([
        this.trabajandoAPI.searchJobs(filters),
        this.getOnBoardAPI.searchJobs(filters),
        this.laborumScraper.searchJobs(filters),
      ])

      const allJobs: ChileanJob[] = []

      if (trabajandoJobs.status === "fulfilled") {
        allJobs.push(...trabajandoJobs.value)
      }
      if (getOnBoardJobs.status === "fulfilled") {
        allJobs.push(...getOnBoardJobs.value)
      }
      if (laborumJobs.status === "fulfilled") {
        allJobs.push(...laborumJobs.value)
      }

      // Remove duplicates and sort by date
      const uniqueJobs = this.removeDuplicates(allJobs)
      return this.sortJobs(uniqueJobs, "date_desc")
    } catch (error) {
      console.error("Error aggregating jobs:", error)
      return []
    }
  }

  private removeDuplicates(jobs: ChileanJob[]): ChileanJob[] {
    const seen = new Set<string>()
    return jobs.filter((job) => {
      const key = `${job.title}-${job.company}-${job.location}`.toLowerCase()
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }

  private sortJobs(jobs: ChileanJob[], sortBy: string): ChileanJob[] {
    switch (sortBy) {
      case "date_desc":
        return jobs.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
      case "salary_desc":
        return jobs.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0))
      case "relevance":
        return jobs.sort((a, b) => {
          // Prioritize verified companies and urgent jobs
          const aScore = (a.verified ? 2 : 0) + (a.isUrgent ? 1 : 0)
          const bScore = (b.verified ? 2 : 0) + (b.isUrgent ? 1 : 0)
          return bScore - aScore
        })
      default:
        return jobs
    }
  }

  async getJobStats(): Promise<{
    totalJobs: number
    bySource: Record<string, number>
    byRegion: Record<string, number>
    byIndustry: Record<string, number>
    avgSalary: number
  }> {
    const allJobs = await this.searchAllPortals({})

    const stats = {
      totalJobs: allJobs.length,
      bySource: {} as Record<string, number>,
      byRegion: {} as Record<string, number>,
      byIndustry: {} as Record<string, number>,
      avgSalary: 0,
    }

    allJobs.forEach((job) => {
      // Count by source
      stats.bySource[job.source] = (stats.bySource[job.source] || 0) + 1

      // Count by region
      stats.byRegion[job.region] = (stats.byRegion[job.region] || 0) + 1

      // Count by industry
      stats.byIndustry[job.industry] = (stats.byIndustry[job.industry] || 0) + 1
    })

    // Calculate average salary
    const jobsWithSalary = allJobs.filter((job) => job.salaryMax && job.salaryMin)
    if (jobsWithSalary.length > 0) {
      const totalSalary = jobsWithSalary.reduce((sum, job) => {
        return sum + (job.salaryMax! + job.salaryMin!) / 2
      }, 0)
      stats.avgSalary = Math.round(totalSalary / jobsWithSalary.length)
    }

    return stats
  }
}

// Export singleton instance
export const chileanJobAggregator = new ChileanJobAggregator()
