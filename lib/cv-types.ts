export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  linkedIn?: string
  website?: string
  summary: string
}

export interface WorkExperience {
  id: string
  company: string
  position: string
  startDate: string
  endDate?: string
  current: boolean
  description: string
  achievements: string[]
  technologies?: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate?: string
  current: boolean
  gpa?: string
  honors?: string[]
}

export interface Skill {
  id: string
  name: string
  level: "Básico" | "Intermedio" | "Avanzado" | "Experto"
  category: "technical" | "soft" | "language"
  yearsOfExperience?: number
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  url?: string
  github?: string
  startDate: string
  endDate?: string
  current: boolean
  highlights: string[]
}

export interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: string
  expiryDate?: string
  credentialId?: string
  url?: string
}

export interface Language {
  id: string
  name: string
  level: "Básico" | "Intermedio" | "Avanzado" | "Nativo"
  certifications?: string[]
}

export interface CVData {
  personalInfo: PersonalInfo
  workExperience: WorkExperience[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
  certifications: Certification[]
  languages: Language[]
  template: string
  createdAt: string
  updatedAt: string
}

export interface CVTemplate {
  id: string
  name: string
  description: string
  preview: string
  category: "modern" | "classic" | "creative" | "minimal"
  isPremium: boolean
}

// Utility function to generate unique IDs
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

// Chilean cities for location selection
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
  "Calama",
  "Copiapó",
  "Osorno",
  "Quillota",
  "Valdivia",
  "Punta Arenas",
  "Coquimbo",
  "Ovalle",
  "Linares",
  "Curicó",
  "Melipilla",
  "San Antonio",
  "Tarapacá",
  "Cauquenes",
  "Angol",
  "Castro",
]

// Chilean universities for education section
export const chileanUniversities = [
  // Traditional Universities (CRUCH)
  "Universidad de Chile",
  "Pontificia Universidad Católica de Chile",
  "Universidad de Santiago de Chile (USACH)",
  "Universidad Técnica Federico Santa María",
  "Universidad de Concepción",
  "Pontificia Universidad Católica de Valparaíso",
  "Universidad Austral de Chile",
  "Universidad Católica del Norte",
  "Universidad de La Serena",
  "Universidad del Bío-Bío",
  "Universidad de La Frontera",
  "Universidad de Magallanes",
  "Universidad de Tarapacá",
  "Universidad de Atacama",
  "Universidad Arturo Prat",
  "Universidad Católica del Maule",
  "Universidad Católica de Temuco",
  "Universidad Católica de la Santísima Concepción",
  "Universidad de Los Lagos",
  "Universidad Metropolitana de Ciencias de la Educación",
  "Universidad de Playa Ancha",
  "Universidad Tecnológica Metropolitana",
  "Universidad de Valparaíso",
  "Universidad Academia de Humanismo Cristiano",
  "Universidad Alberto Hurtado",

  // Private Universities
  "Universidad Adolfo Ibáñez",
  "Universidad del Desarrollo",
  "Universidad Diego Portales",
  "Universidad Finis Terrae",
  "Universidad Mayor",
  "Universidad San Sebastián",
  "Universidad Central de Chile",
  "Universidad de Las Américas",
  "Universidad Andrés Bello",
  "Universidad Santo Tomás",
  "Universidad de Viña del Mar",
  "Universidad Bernardo O'Higgins",
  "Universidad Pedro de Valdivia",
  "Universidad ARCIS",
  "Universidad Bolivariana",
  "Universidad de Artes, Ciencias y Comunicación (UNIACC)",
  "Universidad Internacional SEK",
  "Universidad La República",
  "Universidad Miguel de Cervantes",
  "Universidad Nacional Andrés Bello",

  // Professional Institutes and Technical Centers
  "Instituto Profesional AIEP",
  "Instituto Profesional DUOC UC",
  "Instituto Profesional INACAP",
  "Instituto Profesional La Araucana",
  "Instituto Profesional Santo Tomás",
  "Centro de Formación Técnica INACAP",
  "Centro de Formación Técnica Santo Tomás",
  "Centro de Formación Técnica DUOC UC",

  // International Universities with presence in Chile
  "Universidad de Barcelona (Programa Chile)",
  "Universidad Complutense de Madrid (Programa Chile)",
  "Universidad de Salamanca (Programa Chile)",
]

// Common skills for the Chilean market
export const commonSkillsChile = {
  technical: [
    // Programming Languages
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C#",
    "PHP",
    "Go",
    "Rust",
    "Swift",
    "Kotlin",

    // Frontend Technologies
    "React",
    "Vue.js",
    "Angular",
    "Next.js",
    "Nuxt.js",
    "HTML5",
    "CSS3",
    "Sass/SCSS",
    "Tailwind CSS",
    "Bootstrap",

    // Backend Technologies
    "Node.js",
    "Express.js",
    "Django",
    "Flask",
    "Spring Boot",
    "ASP.NET",
    "Laravel",
    "Ruby on Rails",
    "FastAPI",

    // Databases
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Redis",
    "SQLite",
    "Oracle",
    "SQL Server",
    "Elasticsearch",

    // Cloud & DevOps
    "AWS",
    "Google Cloud",
    "Microsoft Azure",
    "Docker",
    "Kubernetes",
    "Jenkins",
    "GitLab CI/CD",
    "GitHub Actions",
    "Terraform",
    "Ansible",

    // Tools & Platforms
    "Git",
    "Linux",
    "Jira",
    "Confluence",
    "Slack",
    "Figma",
    "Adobe Creative Suite",
    "Postman",
    "VS Code",
    "IntelliJ IDEA",

    // Data & Analytics
    "Power BI",
    "Tableau",
    "Excel Avanzado",
    "Google Analytics",
    "SQL",
    "R",
    "Pandas",
    "NumPy",
    "Jupyter",

    // Mobile Development
    "React Native",
    "Flutter",
    "iOS Development",
    "Android Development",
    "Xamarin",

    // Testing
    "Jest",
    "Cypress",
    "Selenium",
    "JUnit",
    "PyTest",
    "Postman",

    // Project Management
    "Scrum",
    "Kanban",
    "Agile",
    "Waterfall",
    "PMP",
    "PRINCE2",

    // Security
    "OWASP",
    "Penetration Testing",
    "Cybersecurity",
    "ISO 27001",
    "GDPR Compliance",

    // Industry Specific (Chile)
    "SAP",
    "Salesforce",
    "Microsoft Dynamics",
    "Oracle ERP",
    "Banco de Chile APIs",
    "Transbank Integration",
    "SII Integration",
    "Previred",
  ],

  soft: [
    // Communication
    "Comunicación Efectiva",
    "Presentaciones Públicas",
    "Escritura Técnica",
    "Comunicación Intercultural",
    "Negociación",
    "Persuasión",

    // Leadership
    "Liderazgo de Equipos",
    "Mentoring",
    "Coaching",
    "Gestión de Conflictos",
    "Toma de Decisiones",
    "Delegación",
    "Motivación de Equipos",

    // Problem Solving
    "Resolución de Problemas",
    "Pensamiento Crítico",
    "Análisis de Datos",
    "Creatividad",
    "Innovación",
    "Pensamiento Estratégico",

    // Collaboration
    "Trabajo en Equipo",
    "Colaboración Remota",
    "Facilitación de Reuniones",
    "Construcción de Consenso",
    "Networking",
    "Relaciones Interpersonales",

    // Adaptability
    "Adaptabilidad",
    "Flexibilidad",
    "Gestión del Cambio",
    "Aprendizaje Continuo",
    "Resiliencia",
    "Tolerancia al Estrés",

    // Organization
    "Gestión del Tiempo",
    "Organización",
    "Planificación Estratégica",
    "Multitasking",
    "Priorización",
    "Gestión de Proyectos",

    // Customer Focus
    "Orientación al Cliente",
    "Servicio al Cliente",
    "Empatía",
    "Escucha Activa",
    "Gestión de Expectativas",

    // Business Skills
    "Análisis de Negocios",
    "Comprensión del Mercado Chileno",
    "Conocimiento Regulatorio",
    "Gestión Financiera",
    "ROI Analysis",
    "Gestión de Stakeholders",

    // Cultural (Chile specific)
    "Conocimiento del Mercado Local",
    "Comprensión Cultural Chilena",
    "Networking Profesional Chile",
    "Protocolo Empresarial",
    "Ética Profesional",
  ],
}

// Chilean industry sectors
export const chileanIndustries = [
  "Minería",
  "Banca y Servicios Financieros",
  "Retail y Comercio",
  "Tecnología e Innovación",
  "Telecomunicaciones",
  "Energía y Utilities",
  "Construcción e Inmobiliaria",
  "Agricultura y Agroindustria",
  "Manufactura",
  "Logística y Transporte",
  "Turismo y Hospitalidad",
  "Salud y Farmacéutica",
  "Educación",
  "Consultoría",
  "Gobierno y Sector Público",
  "Startups y Emprendimiento",
  "E-commerce",
  "Medios y Comunicaciones",
  "Seguros",
  "Forestal y Celulosa",
]

// Common job titles in Chile
export const commonJobTitlesChile = [
  // Technology
  "Desarrollador Full Stack",
  "Ingeniero de Software",
  "Arquitecto de Software",
  "DevOps Engineer",
  "Data Scientist",
  "Product Manager",
  "UX/UI Designer",
  "Scrum Master",
  "Tech Lead",
  "CTO",

  // Business
  "Gerente General",
  "Gerente de Ventas",
  "Gerente de Marketing",
  "Gerente de Operaciones",
  "Analista de Negocios",
  "Consultor Senior",
  "Director Comercial",
  "Jefe de Producto",

  // Finance
  "Contador",
  "Auditor",
  "Analista Financiero",
  "Controller",
  "Gerente de Finanzas",
  "Risk Manager",

  // Human Resources
  "Gerente de RRHH",
  "Especialista en Compensaciones",
  "Recruiter",
  "HRBP",
  "Especialista en Desarrollo Organizacional",

  // Operations
  "Jefe de Operaciones",
  "Supervisor de Producción",
  "Analista de Procesos",
  "Especialista en Calidad",
  "Coordinador Logístico",

  // Sales & Marketing
  "Ejecutivo de Ventas",
  "Key Account Manager",
  "Digital Marketing Manager",
  "Community Manager",
  "Brand Manager",
  "Trade Marketing",

  // Legal & Compliance
  "Abogado Corporativo",
  "Compliance Officer",
  "Legal Counsel",
  "Especialista Regulatorio",
]

export default {
  generateId,
  commonSkillsChile,
  chileanIndustries,
  commonJobTitlesChile,
  chileanCities,
  chileanUniversities,
}
