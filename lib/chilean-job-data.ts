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
  currency: string
  type: "full-time" | "part-time" | "contract" | "internship" | "freelance"
  experience: "sin-experiencia" | "junior" | "semi-senior" | "senior" | "gerencial"
  modality: "presencial" | "remoto" | "híbrido"
  industry: string
  description: string
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  skills: string[]
  postedDate: string
  applicationUrl: string
  source: "trabajando" | "getonboard" | "laborum" | "computrabajo" | "indeed-chile"
  verified: boolean
  isUrgent: boolean
  companySize: string
  companyDescription: string
}

export interface JobSearchFilters {
  query?: string
  location?: string
  region?: string
  commune?: string
  industry?: string
  experience?: string
  modality?: string
  type?: string
  company?: string
  skills?: string[]
  salaryMin?: number
  salaryMax?: number
  postedDays?: number
}

export interface JobAlert {
  id: string
  name: string
  filters: JobSearchFilters
  isActive: boolean
  createdAt: string
  lastChecked: string
  matchCount: number
}

export interface JobNotification {
  id: string
  alertId: string
  alertName: string
  job: ChileanJob
  createdAt: string
  isRead: boolean
}

// Mock Chilean job data
const mockChileanJobs: ChileanJob[] = [
  {
    id: "job-1",
    title: "Desarrollador Frontend Senior",
    company: "Banco de Chile",
    location: "Santiago, Las Condes",
    region: "Metropolitana",
    commune: "Las Condes",
    salaryMin: 2800000,
    salaryMax: 4200000,
    currency: "CLP",
    type: "full-time",
    experience: "senior",
    modality: "híbrido",
    industry: "Servicios Financieros",
    description:
      "Buscamos un desarrollador frontend senior para liderar el desarrollo de aplicaciones web modernas para nuestros clientes bancarios. Trabajarás con React, TypeScript y las últimas tecnologías web.",
    requirements: [
      "5+ años de experiencia en desarrollo frontend",
      "Dominio de React y TypeScript",
      "Experiencia con testing automatizado",
      "Conocimiento de metodologías ágiles",
      "Inglés intermedio",
    ],
    responsibilities: [
      "Desarrollar interfaces de usuario modernas y responsivas",
      "Colaborar con equipos de diseño y backend",
      "Implementar mejores prácticas de desarrollo",
      "Mentorear desarrolladores junior",
      "Participar en revisiones de código",
    ],
    benefits: [
      "Seguro de salud complementario",
      "Bono de desempeño anual",
      "Capacitación y certificaciones",
      "Trabajo híbrido flexible",
      "Convenios con universidades",
    ],
    skills: ["React", "TypeScript", "JavaScript", "CSS", "Git", "Jest"],
    postedDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    applicationUrl: "https://trabajando.com/empleos/banco-chile-frontend-senior",
    source: "trabajando",
    verified: true,
    isUrgent: false,
    companySize: "10000+ empleados",
    companyDescription:
      "Banco de Chile es una de las instituciones financieras más importantes del país, líder en innovación digital y servicios bancarios.",
  },
  {
    id: "job-2",
    title: "Product Manager",
    company: "NotCo",
    location: "Santiago, Providencia",
    region: "Metropolitana",
    commune: "Providencia",
    salaryMin: 3500000,
    salaryMax: 5200000,
    currency: "CLP",
    type: "full-time",
    experience: "semi-senior",
    modality: "híbrido",
    industry: "FoodTech",
    description:
      "Únete a nuestro equipo de producto para impulsar la innovación en alimentos plant-based. Trabajarás en productos que están revolucionando la industria alimentaria en Chile y Latinoamérica.",
    requirements: [
      "3+ años de experiencia como Product Manager",
      "Experiencia en startups o empresas de tecnología",
      "Conocimiento de metodologías ágiles",
      "Inglés avanzado",
      "Pasión por la sustentabilidad",
    ],
    responsibilities: [
      "Definir la estrategia de producto",
      "Colaborar con equipos de ingeniería y diseño",
      "Analizar métricas y comportamiento de usuarios",
      "Gestionar roadmap de producto",
      "Comunicar visión de producto a stakeholders",
    ],
    benefits: [
      "Stock options",
      "Seguro de salud premium",
      "Presupuesto de aprendizaje",
      "Vacaciones flexibles",
      "Productos NotCo gratis",
    ],
    skills: ["Product Management", "Analytics", "SQL", "Figma", "Jira", "A/B Testing"],
    postedDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    applicationUrl: "https://getonboard.com/empleos/notco-product-manager",
    source: "getonboard",
    verified: true,
    isUrgent: true,
    companySize: "500-1000 empleados",
    companyDescription:
      "NotCo es una foodtech chilena que utiliza inteligencia artificial para crear alimentos plant-based que replican el sabor y textura de productos animales.",
  },
  {
    id: "job-3",
    title: "Ingeniero de Software Full Stack",
    company: "Fintual",
    location: "Remoto desde Chile",
    region: "Metropolitana",
    commune: "Remoto",
    salaryMin: 3000000,
    salaryMax: 4500000,
    currency: "CLP",
    type: "full-time",
    experience: "semi-senior",
    modality: "remoto",
    industry: "FinTech",
    description:
      "Desarrolla soluciones tecnológicas para democratizar las inversiones en Chile. Trabajarás en productos que ayudan a miles de chilenos a invertir de manera simple y transparente.",
    requirements: [
      "3+ años de experiencia en desarrollo full stack",
      "Experiencia con Ruby on Rails o Python",
      "Conocimiento de React o Vue.js",
      "Experiencia con APIs REST",
      "Inglés intermedio",
    ],
    responsibilities: [
      "Desarrollar nuevas funcionalidades",
      "Mantener y optimizar código existente",
      "Colaborar en el diseño de arquitectura",
      "Implementar tests automatizados",
      "Participar en code reviews",
    ],
    benefits: [
      "Trabajo 100% remoto",
      "Equity en la empresa",
      "Seguro de salud",
      "Presupuesto para setup de oficina",
      "Inversiones gratuitas en Fintual",
    ],
    skills: ["Ruby on Rails", "React", "PostgreSQL", "Redis", "Docker", "AWS"],
    postedDate: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    applicationUrl: "https://getonboard.com/empleos/fintual-fullstack-engineer",
    source: "getonboard",
    verified: true,
    isUrgent: false,
    companySize: "100-500 empleados",
    companyDescription:
      "Fintual es una fintech chilena que ofrece servicios de inversión automatizada, haciendo las inversiones accesibles para todos los chilenos.",
  },
  {
    id: "job-4",
    title: "Data Scientist",
    company: "Falabella",
    location: "Santiago, Las Condes",
    region: "Metropolitana",
    commune: "Las Condes",
    salaryMin: 2600000,
    salaryMax: 3900000,
    currency: "CLP",
    type: "full-time",
    experience: "junior",
    modality: "presencial",
    industry: "Retail",
    description:
      "Analiza datos de comportamiento de consumidores chilenos para impulsar decisiones estratégicas en el retail más grande de Chile. Trabajarás con datasets masivos de clientes chilenos.",
    requirements: [
      "Título en Ingeniería, Matemáticas o afines",
      "Experiencia en Python y R",
      "Conocimiento de machine learning",
      "SQL avanzado",
      "Inglés técnico para lectura",
    ],
    responsibilities: [
      "Analizar patrones de comportamiento de clientes",
      "Desarrollar modelos predictivos",
      "Crear dashboards y visualizaciones",
      "Colaborar con equipos de negocio",
      "Presentar insights a gerencia",
    ],
    benefits: [
      "Descuentos en tiendas Falabella",
      "Seguro complementario",
      "Capacitación en data science",
      "Horario flexible",
      "Oficinas modernas en Las Condes",
    ],
    skills: ["Python", "R", "SQL", "Machine Learning", "Pandas", "Tableau"],
    postedDate: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    applicationUrl: "https://laborum.cl/empleos/falabella-data-scientist",
    source: "laborum",
    verified: true,
    isUrgent: false,
    companySize: "50000+ empleados",
    companyDescription:
      "Falabella es la empresa de retail más grande de Chile, líder en transformación digital y experiencia del cliente.",
  },
  {
    id: "job-5",
    title: "UX Designer",
    company: "Cornershop by Uber",
    location: "Santiago, Vitacura",
    region: "Metropolitana",
    commune: "Vitacura",
    salaryMin: 2400000,
    salaryMax: 3600000,
    currency: "CLP",
    type: "full-time",
    experience: "semi-senior",
    modality: "híbrido",
    industry: "E-commerce",
    description:
      "Diseña experiencias de usuario excepcionales para el marketplace de delivery más grande de Chile. Impacta la vida de millones de chilenos mejorando su acceso a productos esenciales.",
    requirements: [
      "3+ años de experiencia en UX Design",
      "Portfolio con casos de estudio",
      "Experiencia con Figma y herramientas de prototipado",
      "Conocimiento de research de usuarios",
      "Inglés conversacional",
    ],
    responsibilities: [
      "Diseñar flujos de usuario intuitivos",
      "Realizar investigación de usuarios",
      "Crear prototipos y wireframes",
      "Colaborar con equipos de producto",
      "Validar diseños con usuarios reales",
    ],
    benefits: [
      "Créditos Uber y Cornershop",
      "Seguro de salud premium",
      "Trabajo híbrido",
      "Capacitación en UX",
      "Ambiente multicultural",
    ],
    skills: ["Figma", "Sketch", "User Research", "Prototyping", "Design Systems"],
    postedDate: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    applicationUrl: "https://trabajando.com/empleos/cornershop-ux-designer",
    source: "trabajando",
    verified: true,
    isUrgent: false,
    companySize: "1000+ empleados",
    companyDescription:
      "Cornershop by Uber es la plataforma de delivery on-demand líder en Chile, conectando usuarios con sus tiendas favoritas.",
  },
  {
    id: "job-6",
    title: "DevOps Engineer",
    company: "Buda.com",
    location: "Santiago, Ñuñoa",
    region: "Metropolitana",
    commune: "Ñuñoa",
    salaryMin: 3200000,
    salaryMax: 4800000,
    currency: "CLP",
    type: "full-time",
    experience: "senior",
    modality: "híbrido",
    industry: "FinTech",
    description:
      "Gestiona la infraestructura de la exchange de criptomonedas más importante de Chile. Trabajarás con tecnologías de vanguardia en un ambiente de alta disponibilidad.",
    requirements: [
      "4+ años de experiencia en DevOps",
      "Experiencia con AWS y Kubernetes",
      "Conocimiento de CI/CD",
      "Scripting en Python o Bash",
      "Experiencia con monitoreo y logging",
    ],
    responsibilities: [
      "Gestionar infraestructura cloud",
      "Automatizar procesos de deployment",
      "Implementar pipelines CI/CD",
      "Monitorear sistemas críticos",
      "Optimizar performance y costos",
    ],
    benefits: [
      "Trabajo híbrido",
      "Bonos en criptomonedas",
      "Seguro de vida",
      "Capacitación técnica",
      "Ambiente startup dinámico",
    ],
    skills: ["AWS", "Kubernetes", "Docker", "Terraform", "Python", "Monitoring"],
    postedDate: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
    applicationUrl: "https://getonboard.com/empleos/buda-devops-engineer",
    source: "getonboard",
    verified: true,
    isUrgent: true,
    companySize: "100-200 empleados",
    companyDescription:
      "Buda.com es la exchange de criptomonedas líder en Chile, facilitando el acceso a activos digitales de manera segura y regulada.",
  },
]

// Add more recent jobs for notifications
const recentJobs: ChileanJob[] = [
  {
    id: "job-new-1",
    title: "React Developer",
    company: "Chiper",
    location: "Santiago, Las Condes",
    region: "Metropolitana",
    commune: "Las Condes",
    salaryMin: 2200000,
    salaryMax: 3200000,
    currency: "CLP",
    type: "full-time",
    experience: "junior",
    modality: "híbrido",
    industry: "E-commerce",
    description:
      "Únete al equipo de frontend de Chiper para desarrollar la plataforma de e-commerce B2B más innovadora de Latinoamérica.",
    requirements: [
      "2+ años de experiencia con React",
      "Conocimiento de TypeScript",
      "Experiencia con APIs REST",
      "Git y metodologías ágiles",
    ],
    responsibilities: [
      "Desarrollar componentes React reutilizables",
      "Implementar nuevas funcionalidades",
      "Optimizar performance de aplicaciones",
      "Colaborar con el equipo de diseño",
    ],
    benefits: ["Stock options", "Seguro de salud", "Horarios flexibles", "Capacitación continua"],
    skills: ["React", "TypeScript", "JavaScript", "CSS", "Git"],
    postedDate: new Date().toISOString(), // Just posted
    applicationUrl: "https://getonboard.com/empleos/chiper-react-developer",
    source: "getonboard",
    verified: true,
    isUrgent: false,
    companySize: "200-500 empleados",
    companyDescription: "Chiper es una startup chilena que digitaliza el comercio tradicional en Latinoamérica.",
  },
  {
    id: "job-new-2",
    title: "Python Backend Developer",
    company: "Betterfly",
    location: "Santiago, Providencia",
    region: "Metropolitana",
    commune: "Providencia",
    salaryMin: 2800000,
    salaryMax: 4000000,
    currency: "CLP",
    type: "full-time",
    experience: "semi-senior",
    modality: "remoto",
    industry: "InsurTech",
    description:
      "Desarrolla APIs robustas para la plataforma de bienestar corporativo que está transformando la industria de seguros en Chile.",
    requirements: [
      "3+ años de experiencia con Python",
      "Experiencia con Django o FastAPI",
      "Conocimiento de bases de datos",
      "Experiencia con testing",
    ],
    responsibilities: [
      "Desarrollar APIs REST",
      "Implementar lógica de negocio",
      "Optimizar consultas de base de datos",
      "Escribir tests automatizados",
    ],
    benefits: ["Trabajo 100% remoto", "Seguro de vida gratuito", "Presupuesto wellness", "Días libres adicionales"],
    skills: ["Python", "Django", "PostgreSQL", "Redis", "Docker"],
    postedDate: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    applicationUrl: "https://getonboard.com/empleos/betterfly-python-backend",
    source: "getonboard",
    verified: true,
    isUrgent: true,
    companySize: "100-300 empleados",
    companyDescription: "Betterfly es una insurtech chilena que combina seguros de vida con bienestar corporativo.",
  },
]

class ChileanJobService {
  private jobs: ChileanJob[] = [...mockChileanJobs, ...recentJobs]
  private alerts: JobAlert[] = []
  private notifications: JobNotification[] = []

  async searchJobs(filters: JobSearchFilters): Promise<{
    jobs: ChileanJob[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    let filteredJobs = [...this.jobs]

    // Apply filters
    if (filters.query) {
      const query = filters.query.toLowerCase()
      filteredJobs = filteredJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.skills.some((skill) => skill.toLowerCase().includes(query)) ||
          job.description.toLowerCase().includes(query),
      )
    }

    if (filters.location && filters.location !== "all") {
      filteredJobs = filteredJobs.filter((job) => job.location.toLowerCase().includes(filters.location!.toLowerCase()))
    }

    if (filters.region && filters.region !== "all") {
      filteredJobs = filteredJobs.filter((job) => job.region === filters.region)
    }

    if (filters.industry && filters.industry !== "all") {
      filteredJobs = filteredJobs.filter((job) => job.industry === filters.industry)
    }

    if (filters.experience && filters.experience !== "all") {
      filteredJobs = filteredJobs.filter((job) => job.experience === filters.experience)
    }

    if (filters.modality && filters.modality !== "all") {
      filteredJobs = filteredJobs.filter((job) => job.modality === filters.modality)
    }

    if (filters.type && filters.type !== "all") {
      filteredJobs = filteredJobs.filter((job) => job.type === filters.type)
    }

    if (filters.salaryMin) {
      filteredJobs = filteredJobs.filter((job) => job.salaryMin && job.salaryMin >= filters.salaryMin!)
    }

    if (filters.salaryMax) {
      filteredJobs = filteredJobs.filter((job) => job.salaryMax && job.salaryMax <= filters.salaryMax!)
    }

    if (filters.postedDays) {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - filters.postedDays)
      filteredJobs = filteredJobs.filter((job) => new Date(job.postedDate) >= cutoffDate)
    }

    // Sort by posted date (newest first)
    filteredJobs.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())

    const limit = 20
    const page = 1
    const startIndex = (page - 1) * limit
    const paginatedJobs = filteredJobs.slice(startIndex, startIndex + limit)

    return {
      jobs: paginatedJobs,
      total: filteredJobs.length,
      page,
      limit,
      totalPages: Math.ceil(filteredJobs.length / limit),
    }
  }

  async getJobStats() {
    const bySource: Record<string, number> = {}
    const byRegion: Record<string, number> = {}
    const byIndustry: Record<string, number> = {}

    this.jobs.forEach((job) => {
      bySource[job.source] = (bySource[job.source] || 0) + 1
      byRegion[job.region] = (byRegion[job.region] || 0) + 1
      byIndustry[job.industry] = (byIndustry[job.industry] || 0) + 1
    })

    const salaries = this.jobs
      .filter((job) => job.salaryMin && job.salaryMax)
      .map((job) => (job.salaryMin! + job.salaryMax!) / 2)

    const avgSalary = salaries.length > 0 ? Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length) : 0

    return {
      totalJobs: this.jobs.length,
      bySource,
      byRegion,
      byIndustry,
      avgSalary,
      lastUpdated: new Date().toISOString(),
    }
  }

  // Job Alerts functionality
  async createAlert(alert: Omit<JobAlert, "id" | "createdAt" | "lastChecked" | "matchCount">): Promise<JobAlert> {
    const newAlert: JobAlert = {
      ...alert,
      id: `alert-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastChecked: new Date().toISOString(),
      matchCount: 0,
    }

    this.alerts.push(newAlert)
    return newAlert
  }

  async getAlerts(): Promise<JobAlert[]> {
    return [...this.alerts]
  }

  async updateAlert(id: string, updates: Partial<JobAlert>): Promise<JobAlert | null> {
    const alertIndex = this.alerts.findIndex((alert) => alert.id === id)
    if (alertIndex === -1) return null

    this.alerts[alertIndex] = { ...this.alerts[alertIndex], ...updates }
    return this.alerts[alertIndex]
  }

  async deleteAlert(id: string): Promise<boolean> {
    const alertIndex = this.alerts.findIndex((alert) => alert.id === id)
    if (alertIndex === -1) return false

    this.alerts.splice(alertIndex, 1)
    // Also remove related notifications
    this.notifications = this.notifications.filter((notif) => notif.alertId !== id)
    return true
  }

  async checkAlertsForNewJobs(): Promise<JobNotification[]> {
    const newNotifications: JobNotification[] = []

    for (const alert of this.alerts.filter((a) => a.isActive)) {
      const matchingJobs = await this.searchJobs(alert.filters)

      // Check for new jobs since last check
      const lastChecked = new Date(alert.lastChecked)
      const newJobs = matchingJobs.jobs.filter((job) => new Date(job.postedDate) > lastChecked)

      // Create notifications for new matching jobs
      for (const job of newJobs) {
        const notification: JobNotification = {
          id: `notif-${Date.now()}-${Math.random()}`,
          alertId: alert.id,
          alertName: alert.name,
          job,
          createdAt: new Date().toISOString(),
          isRead: false,
        }

        this.notifications.push(notification)
        newNotifications.push(notification)
      }

      // Update alert
      alert.lastChecked = new Date().toISOString()
      alert.matchCount = matchingJobs.total
    }

    return newNotifications
  }

  async getNotifications(): Promise<JobNotification[]> {
    return [...this.notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async markNotificationAsRead(id: string): Promise<boolean> {
    const notification = this.notifications.find((notif) => notif.id === id)
    if (!notification) return false

    notification.isRead = true
    return true
  }

  async markAllNotificationsAsRead(): Promise<boolean> {
    this.notifications.forEach((notif) => (notif.isRead = true))
    return true
  }

  async deleteNotification(id: string): Promise<boolean> {
    const notificationIndex = this.notifications.findIndex((notif) => notif.id === id)
    if (notificationIndex === -1) return false

    this.notifications.splice(notificationIndex, 1)
    return true
  }

  // Simulate new jobs being added (for demo purposes)
  async simulateNewJobs(): Promise<void> {
    // Add some new jobs to trigger notifications
    const newJob: ChileanJob = {
      id: `job-sim-${Date.now()}`,
      title: "Frontend Developer React",
      company: "Startup Chilena",
      location: "Santiago, Providencia",
      region: "Metropolitana",
      commune: "Providencia",
      salaryMin: 2000000,
      salaryMax: 3000000,
      currency: "CLP",
      type: "full-time",
      experience: "junior",
      modality: "híbrido",
      industry: "Tecnología",
      description: "Buscamos desarrollador React para startup en crecimiento.",
      requirements: ["React", "JavaScript", "CSS"],
      responsibilities: ["Desarrollar componentes", "Colaborar con el equipo"],
      benefits: ["Seguro de salud", "Horarios flexibles"],
      skills: ["React", "JavaScript", "CSS"],
      postedDate: new Date().toISOString(),
      applicationUrl: "https://ejemplo.com/aplicar",
      source: "trabajando",
      verified: false,
      isUrgent: false,
      companySize: "10-50 empleados",
      companyDescription: "Startup chilena innovadora.",
    }

    this.jobs.unshift(newJob)
  }
}

export const chileanJobService = new ChileanJobService()
export type { ChileanJob, JobSearchFilters, JobAlert, JobNotification }
