// Demo data for the Chilean market
export const demoPersonalityResults = {
  traits: [
    {
      name: "Apertura",
      score: 85,
      description: "Alta creatividad y apertura a nuevas experiencias en el contexto chileno",
    },
    {
      name: "Responsabilidad",
      score: 78,
      description: "Bien organizado y confiable según estándares laborales chilenos",
    },
    { name: "Extraversión", score: 65, description: "Moderadamente sociable, adaptado a la cultura chilena" },
    { name: "Amabilidad", score: 72, description: "Cooperativo y cordial, típico del trato chileno" },
    { name: "Neuroticismo", score: 35, description: "Emocionalmente estable en el ambiente laboral chileno" },
  ],
  strengths: [
    "Resolución creativa de problemas adaptada al mercado chileno",
    "Atención al detalle valorada en empresas chilenas",
    "Colaboración en equipo según cultura laboral chilena",
    "Adaptabilidad a cambios del mercado chileno",
    "Potencial de liderazgo en contexto empresarial chileno",
  ],
  careerSuggestions: [
    {
      title: "Product Manager",
      match: 92,
      description:
        "Lidera el desarrollo de productos en el ecosistema tech chileno con tus habilidades creativas y organizacionales",
      salaryRange: "$2.800.000 - $5.000.000 CLP",
      companies: ["NotCo", "Fintual", "Cornershop", "Chiper", "Betterfly"],
    },
    {
      title: "UX Designer",
      match: 88,
      description:
        "Diseña experiencias de usuario para empresas chilenas aprovechando tu creatividad y empatía cultural",
      salaryRange: "$2.200.000 - $3.800.000 CLP",
      companies: ["Falabella", "Banco de Chile", "Entel", "Ripley", "Paris"],
    },
    {
      title: "Ingeniero de Software",
      match: 85,
      description:
        "Construye soluciones tecnológicas innovadoras para el mercado chileno con tus habilidades de resolución de problemas",
      salaryRange: "$2.500.000 - $4.000.000 CLP",
      companies: ["Mercado Libre", "Chiper", "Betterfly", "Buk", "Khipu"],
    },
    {
      title: "Gerente de Marketing",
      match: 82,
      description:
        "Impulsa estrategias de marketing adaptadas al consumidor chileno con tus habilidades creativas y analíticas",
      salaryRange: "$2.400.000 - $4.200.000 CLP",
      companies: ["Cencosud", "Ripley", "Paris", "Lider", "Jumbo"],
    },
  ],
}

export const demoSkillsData = [
  { name: "JavaScript", level: 85 },
  { name: "React", level: 80 },
  { name: "Node.js", level: 75 },
  { name: "Python", level: 70 },
  { name: "SQL", level: 65 },
  { name: "Gestión de Proyectos", level: 78 },
  { name: "Comunicación en Español Chileno", level: 82 },
  { name: "Resolución de Problemas", level: 88 },
  { name: "Adaptabilidad al Mercado Chileno", level: 75 },
]

export const demoJobSearchResults = [
  {
    id: "1",
    title: "Desarrollador Frontend Senior",
    company: "NotCo",
    location: "Santiago, Chile",
    salary: "$3.200.000 - $4.500.000 CLP",
    type: "Tiempo completo",
    posted: "hace 2 días",
    match: 95,
    description:
      "Buscamos un desarrollador frontend senior para unirse a nuestro equipo en crecimiento en la foodtech más innovadora de Latinoamérica. Trabajarás en productos que impactan millones de usuarios en Chile y la región...",
    requirements: [
      "5+ años experiencia React",
      "Dominio de TypeScript",
      "Experiencia en startups chilenas",
      "Inglés intermedio",
    ],
    benefits: ["Seguro complementario", "Trabajo híbrido", "Stock options", "Capacitación continua", "Almuerzo gratis"],
    remote: true,
    industry: "Foodtech",
  },
  {
    id: "2",
    title: "Product Manager",
    company: "Fintual",
    location: "Remoto desde Chile",
    salary: "$3.500.000 - $5.200.000 CLP",
    type: "Tiempo completo",
    posted: "hace 1 semana",
    match: 88,
    description:
      "Únete a nuestro equipo de producto para impulsar la innovación en servicios financieros digitales para el mercado chileno. Trabajarás directamente con usuarios chilenos para mejorar su experiencia financiera...",
    requirements: [
      "3+ años experiencia PM",
      "Conocimiento del mercado financiero chileno",
      "Metodologías ágiles",
      "Inglés conversacional",
    ],
    benefits: [
      "Equity",
      "Seguro de salud",
      "Presupuesto de aprendizaje",
      "Vacaciones flexibles",
      "Oficina en Las Condes",
    ],
    remote: true,
    industry: "Fintech",
  },
  {
    id: "3",
    title: "UX Designer",
    company: "Banco de Chile",
    location: "Santiago, Chile",
    salary: "$2.800.000 - $3.800.000 CLP",
    type: "Tiempo completo",
    posted: "hace 3 días",
    match: 82,
    description:
      "Crea experiencias de usuario hermosas e intuitivas para nuestros clientes bancarios en Chile. Trabajarás en productos digitales que impactan a millones de chilenos diariamente...",
    requirements: [
      "Portfolio con casos chilenos",
      "Experiencia en Figma",
      "Investigación de usuarios chilenos",
      "Diseño de sistemas",
    ],
    benefits: [
      "Seguro complementario",
      "Bono de alimentación",
      "Horario flexible",
      "Capacitación",
      "Convenios con universidades chilenas",
    ],
    remote: false,
    industry: "Servicios Financieros",
  },
  {
    id: "4",
    title: "Ingeniero de Software Full Stack",
    company: "Cornershop by Uber",
    location: "Santiago, Chile",
    salary: "$3.000.000 - $4.200.000 CLP",
    type: "Tiempo completo",
    posted: "hace 5 días",
    match: 90,
    description:
      "Desarrolla soluciones tecnológicas para el marketplace de delivery más grande de Chile. Impacta la vida de millones de chilenos mejorando su acceso a productos esenciales...",
    requirements: [
      "4+ años experiencia full stack",
      "Conocimiento del mercado chileno",
      "Python/Django",
      "React",
      "Experiencia con APIs",
    ],
    benefits: [
      "Seguro de salud premium",
      "Créditos Uber",
      "Trabajo híbrido",
      "Capacitación técnica",
      "Ambiente multicultural",
    ],
    remote: true,
    industry: "E-commerce",
  },
  {
    id: "5",
    title: "Data Scientist",
    company: "Falabella",
    location: "Santiago, Chile",
    salary: "$2.600.000 - $3.900.000 CLP",
    type: "Tiempo completo",
    posted: "hace 1 semana",
    match: 85,
    description:
      "Analiza datos de comportamiento de consumidores chilenos para impulsar decisiones estratégicas en el retail más grande de Chile. Trabajarás con datasets masivos de clientes chilenos...",
    requirements: [
      "Experiencia en Python/R",
      "Conocimiento del retail chileno",
      "Machine Learning",
      "SQL avanzado",
      "Inglés técnico",
    ],
    benefits: [
      "Descuentos en tiendas",
      "Seguro complementario",
      "Capacitación en IA",
      "Horario flexible",
      "Oficinas modernas",
    ],
    remote: false,
    industry: "Retail",
  },
]

export const demoCVData = {
  personalInfo: {
    fullName: "Juan Pérez González",
    email: "juan.perez@email.com",
    phone: "+56 9 1234 5678",
    location: "Santiago, Chile",
    website: "juanperez.dev",
    linkedin: "linkedin.com/in/juanperez",
  },
  summary:
    "Desarrollador de software experimentado con 5+ años de experiencia en desarrollo full-stack en el mercado chileno, especializado en React, Node.js y tecnologías cloud. Apasionado por crear soluciones escalables y liderar equipos de desarrollo en empresas chilenas, con profundo conocimiento del ecosistema tech local.",
  experience: [
    {
      title: "Ingeniero de Software Senior",
      company: "NotCo",
      location: "Santiago, Chile",
      startDate: "2022-01",
      endDate: "Presente",
      description:
        "Lidero el desarrollo de aplicaciones customer-facing que sirven a 100K+ usuarios chilenos. Implementé arquitectura de microservicios reduciendo la latencia del sistema en 40%. Colaboro con equipos multiculturales adaptando productos al mercado chileno.",
    },
    {
      title: "Desarrollador de Software",
      company: "Fintual",
      location: "Remoto, Chile",
      startDate: "2020-03",
      endDate: "2021-12",
      description:
        "Desarrollé y mantuve aplicaciones React para servicios financieros dirigidos al mercado chileno. Colaboré con el equipo de diseño para implementar componentes UI responsivos adaptados a las preferencias de usuarios chilenos.",
    },
    {
      title: "Desarrollador Junior",
      company: "Banco de Chile",
      location: "Santiago, Chile",
      startDate: "2018-06",
      endDate: "2020-02",
      description:
        "Participé en el desarrollo de sistemas bancarios digitales para clientes chilenos. Trabajé en la migración de sistemas legacy y implementación de nuevas funcionalidades cumpliendo con regulaciones financieras chilenas.",
    },
  ],
  education: [
    {
      degree: "Ingeniería Civil en Computación",
      school: "Universidad de Chile",
      location: "Santiago, Chile",
      startDate: "2016-03",
      endDate: "2020-12",
      gpa: "6.2",
      institutionType: "Universidad Estatal",
      commune: "Ñuñoa",
    },
    {
      degree: "Técnico en Programación",
      school: "Instituto Profesional DUOC UC",
      location: "Santiago, Chile",
      startDate: "2014-03",
      endDate: "2015-12",
      gpa: "6.5",
      institutionType: "Instituto Profesional",
      commune: "Providencia",
    },
  ],
  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "AWS",
    "Docker",
    "PostgreSQL",
    "Español Nativo",
    "Inglés Intermedio",
  ],
}

// Chilean market specific data
export const chileanMarketData = {
  topCompanies: [
    { name: "NotCo", industry: "Foodtech", employees: "500-1000", growth: "Alta", location: "Santiago" },
    { name: "Fintual", industry: "Fintech", employees: "100-500", growth: "Alta", location: "Santiago" },
    { name: "Cornershop", industry: "E-commerce", employees: "1000+", growth: "Estable", location: "Santiago" },
    {
      name: "Banco de Chile",
      industry: "Servicios Financieros",
      employees: "10000+",
      growth: "Estable",
      location: "Nacional",
    },
    { name: "Falabella", industry: "Retail", employees: "50000+", growth: "Moderada", location: "Nacional" },
    { name: "Entel", industry: "Telecomunicaciones", employees: "5000+", growth: "Moderada", location: "Nacional" },
    { name: "Chiper", industry: "E-commerce", employees: "200-500", growth: "Alta", location: "Santiago" },
    { name: "Betterfly", industry: "Insurtech", employees: "100-300", growth: "Alta", location: "Santiago" },
    { name: "Buk", industry: "HR Tech", employees: "200-400", growth: "Alta", location: "Santiago" },
    { name: "Khipu", industry: "Fintech", employees: "50-100", growth: "Moderada", location: "Santiago" },
  ],
  salaryRanges: {
    "Desarrollador Junior": { min: 800000, max: 1500000, currency: "CLP" },
    "Desarrollador Semi-Senior": { min: 1500000, max: 2500000, currency: "CLP" },
    "Desarrollador Senior": { min: 2500000, max: 4000000, currency: "CLP" },
    "Tech Lead": { min: 3500000, max: 5500000, currency: "CLP" },
    "Engineering Manager": { min: 4500000, max: 7000000, currency: "CLP" },
    "Product Manager": { min: 2800000, max: 5000000, currency: "CLP" },
    "UX Designer": { min: 2200000, max: 3800000, currency: "CLP" },
    "Data Scientist": { min: 2200000, max: 4500000, currency: "CLP" },
    "DevOps Engineer": { min: 2800000, max: 4800000, currency: "CLP" },
    "QA Engineer": { min: 1800000, max: 3200000, currency: "CLP" },
  },
  jobBoards: [
    "GetOnBoard (Chile)",
    "LinkedIn Chile",
    "Trabajando.com",
    "Laborum Chile",
    "Indeed Chile",
    "CompuTrabajo Chile",
    "ZonaJobs Chile",
    "Bumeran Chile",
  ],
  techHubs: [
    "Santiago Centro",
    "Las Condes",
    "Providencia",
    "Ñuñoa",
    "Valparaíso (remoto)",
    "Viña del Mar",
    "Concepción (emergente)",
  ],
  universities: [
    "Universidad de Chile",
    "Pontificia Universidad Católica de Chile",
    "Universidad de Santiago de Chile",
    "Universidad Técnica Federico Santa María",
    "Universidad Adolfo Ibáñez",
    "DUOC UC",
    "INACAP",
    "Universidad Diego Portales",
  ],
  skillsInDemand: [
    "JavaScript/TypeScript",
    "React/Angular/Vue",
    "Python",
    "Java",
    "Node.js",
    "AWS/Azure",
    "Docker/Kubernetes",
    "Inglés técnico",
    "Metodologías ágiles",
    "Conocimiento del mercado chileno",
  ],
}

export interface UserStats {
  total_assessments: number
  completed_goals: number
  achievements_count: number
  avg_skill_level: number
  avg_interview_score: number
  job_recommendations: number
  active_goals: number
}

export interface UserProgress {
  personality_progress: number
  skills_progress: number
  goals_progress: number
  interview_progress: number
  coaching_progress: number
  overall_progress: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earned_at: string
}

export interface CareerGoal {
  id: string
  title: string
  description: string
  priority: string
  status: string
  target_date: string
}

// Demo data functions
export const getUserStats = async (userId: string): Promise<UserStats> => {
  return {
    total_assessments: 3,
    completed_goals: 2,
    achievements_count: 5,
    avg_skill_level: 7.5,
    avg_interview_score: 85,
    job_recommendations: 12,
    active_goals: 3,
  }
}

export const getUserProgress = async (userId: string): Promise<UserProgress> => {
  return {
    personality_progress: 100,
    skills_progress: 75,
    goals_progress: 60,
    interview_progress: 40,
    coaching_progress: 30,
    overall_progress: 65,
  }
}

export const getUserAchievements = async (userId: string): Promise<Achievement[]> => {
  return [
    {
      id: "1",
      title: "Primeros Pasos en Chile",
      description: "Completaste tu primera evaluación de personalidad adaptada al mercado chileno",
      icon: "star",
      earned_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "2",
      title: "Explorador de Habilidades Chilenas",
      description: "Evaluaste 5 habilidades diferentes relevantes para el mercado laboral chileno",
      icon: "target",
      earned_at: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: "3",
      title: "Planificador de Carrera en Chile",
      description: "Estableciste tu primera meta profesional enfocada en el mercado chileno",
      icon: "flag",
      earned_at: new Date(Date.now() - 259200000).toISOString(),
    },
    {
      id: "4",
      title: "Conocedor del Mercado Tech Chileno",
      description: "Completaste la evaluación de habilidades técnicas con enfoque en empresas chilenas",
      icon: "code",
      earned_at: new Date(Date.now() - 345600000).toISOString(),
    },
    {
      id: "5",
      title: "Comunicador Efectivo en Chile",
      description: "Destacaste en habilidades de comunicación adaptadas a la cultura laboral chilena",
      icon: "message",
      earned_at: new Date(Date.now() - 432000000).toISOString(),
    },
  ]
}

export const getUserCareerGoals = async (userId: string): Promise<CareerGoal[]> => {
  return [
    {
      id: "1",
      title: "Dominar React para Startups Chilenas",
      description: "Aprender patrones avanzados de React utilizados en startups tech chilenas como NotCo y Fintual",
      priority: "alta",
      status: "activa",
      target_date: new Date(Date.now() + 2592000000).toISOString(),
    },
    {
      id: "2",
      title: "Obtener Certificación AWS",
      description: "Obtener certificación AWS Solutions Architect para trabajar en empresas chilenas que usan cloud",
      priority: "media",
      status: "activa",
      target_date: new Date(Date.now() + 5184000000).toISOString(),
    },
    {
      id: "3",
      title: "Mejorar Inglés para Empresas Multinacionales",
      description:
        "Alcanzar nivel avanzado de inglés para oportunidades en empresas multinacionales con oficinas en Chile",
      priority: "alta",
      status: "activa",
      target_date: new Date(Date.now() + 7776000000).toISOString(),
    },
    {
      id: "4",
      title: "Networking en el Ecosistema Tech Chileno",
      description:
        "Construir red de contactos en eventos tech de Santiago y conectar con líderes de la industria chilena",
      priority: "media",
      status: "activa",
      target_date: new Date(Date.now() + 4320000000).toISOString(),
    },
  ]
}

// Mock database functions
export async function getUserPersonalityResults(userId: string) {
  return { data: demoPersonalityResults, error: null }
}

export async function savePersonalityResults(userId: string, results: any) {
  return { data: results, error: null }
}

export async function getUserSkills(userId: string) {
  return { data: demoSkillsData, error: null }
}

export async function saveUserSkills(userId: string, skills: any[]) {
  return { data: skills, error: null }
}

export async function searchJobs(query: string, filters: any) {
  // Filter jobs based on Chilean market criteria
  const filteredJobs = demoJobSearchResults.filter(
    (job) => job.location.includes("Chile") || job.location.includes("Santiago") || job.remote === true,
  )
  return { data: filteredJobs, error: null }
}

export async function getUserCV(userId: string) {
  return { data: demoCVData, error: null }
}

export async function saveUserCV(userId: string, cvData: any) {
  return { data: cvData, error: null }
}
