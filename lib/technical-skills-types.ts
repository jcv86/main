export interface TechnicalSkill {
  id: string
  name: string
  category: string
  description: string
  difficulty: "beginner" | "intermediate" | "advanced" | "expert"
  estimatedTime: number // in minutes
  prerequisites?: string[]
  careerRelevance: string[]
  tools: string[]
}

export interface TestCase {
  id: string
  input: any
  expectedOutput: any
  description: string
  weight: number
}

export interface TechnicalTest {
  id: string
  skillId: string
  title: string
  description: string
  instructions: string
  type: "code" | "excel" | "presentation" | "data_analysis" | "sql"
  difficulty: "beginner" | "intermediate" | "advanced" | "expert"
  timeLimit: number // in minutes
  maxScore: number
  testCases?: TestCase[]
  files?: {
    id: string
    name: string
    url: string
    type: "download" | "template"
    description: string
  }[]
  evaluationCriteria: {
    criterion: string
    weight: number
    description: string
  }[]
  sampleSolution?: string
  hints?: string[]
}

export interface TestSubmission {
  id: string
  userId: string
  testId: string
  submittedAt: string
  completedAt?: string
  status: "in_progress" | "submitted" | "evaluated" | "failed"
  timeSpent: number
  submission: {
    type: "code" | "file" | "text" | "url"
    content: any
    files?: {
      name: string
      url: string
      size: number
    }[]
  }
  score?: number
  feedback?: TestFeedback
  attempts: number
}

export interface TestFeedback {
  overallScore: number
  maxScore: number
  level: "beginner" | "intermediate" | "advanced" | "expert"
  passed: boolean
  strengths: string[]
  improvements: string[]
  detailedFeedback: {
    criterion: string
    score: number
    maxScore: number
    feedback: string
    suggestions: string[]
  }[]
  nextSteps: string[]
  recommendedResources: {
    type: "course" | "book" | "practice" | "tutorial"
    title: string
    description: string
    url?: string
    estimatedTime: string
  }[]
  aiCoachingMessage: string
}

export interface SkillValidation {
  id: string
  userId: string
  skillId: string
  level: "beginner" | "intermediate" | "advanced" | "expert"
  score: number
  validatedAt: string
  expiresAt?: string
  certificateUrl?: string
  testResults: {
    testId: string
    score: number
    completedAt: string
  }[]
}

export interface CareerSkillMap {
  career: string
  requiredSkills: {
    skillId: string
    importance: "critical" | "important" | "nice_to_have"
    minimumLevel: "beginner" | "intermediate" | "advanced" | "expert"
  }[]
  recommendedTestOrder: string[]
}

// Technical Skills Database
export const TECHNICAL_SKILLS: TechnicalSkill[] = [
  {
    id: "excel_advanced",
    name: "Excel Avanzado",
    category: "Análisis de Datos",
    description: "Dominio de funciones avanzadas, tablas dinámicas, macros y análisis de datos en Excel",
    difficulty: "advanced",
    estimatedTime: 45,
    prerequisites: ["excel_intermediate"],
    careerRelevance: ["Analista de Datos", "Finanzas", "Marketing", "Operaciones"],
    tools: ["Microsoft Excel", "Google Sheets"],
  },
  {
    id: "python_programming",
    name: "Programación en Python",
    category: "Desarrollo de Software",
    description: "Capacidad para escribir código Python eficiente y resolver problemas algorítmicos",
    difficulty: "intermediate",
    estimatedTime: 60,
    prerequisites: ["programming_basics"],
    careerRelevance: ["Desarrollador de Software", "Data Scientist", "Analista de Datos"],
    tools: ["Python", "IDE"],
  },
  {
    id: "sql_queries",
    name: "Consultas SQL",
    category: "Base de Datos",
    description: "Escritura de consultas SQL complejas para análisis y manipulación de datos",
    difficulty: "intermediate",
    estimatedTime: 40,
    prerequisites: ["database_basics"],
    careerRelevance: ["Analista de Datos", "Desarrollador Backend", "Data Scientist"],
    tools: ["SQL", "PostgreSQL", "MySQL"],
  },
  {
    id: "powerpoint_design",
    name: "Diseño de Presentaciones",
    category: "Comunicación",
    description: "Creación de presentaciones profesionales y efectivas",
    difficulty: "intermediate",
    estimatedTime: 30,
    prerequisites: [],
    careerRelevance: ["Marketing", "Consultoría", "Ventas", "Gestión"],
    tools: ["PowerPoint", "Google Slides", "Canva"],
  },
  {
    id: "data_visualization",
    name: "Visualización de Datos",
    category: "Análisis de Datos",
    description: "Creación de gráficos y dashboards efectivos para comunicar insights",
    difficulty: "intermediate",
    estimatedTime: 50,
    prerequisites: ["excel_intermediate"],
    careerRelevance: ["Analista de Datos", "Marketing", "Finanzas"],
    tools: ["Excel", "Tableau", "Power BI"],
  },
  {
    id: "aws",
    name: "Amazon Web Services",
    category: "Cloud",
    difficulty: "advanced",
    description: "Plataforma de servicios en la nube más utilizada en la industria",
    estimatedTime: 60,
    prerequisites: [],
    careerRelevance: ["Cloud Engineer", "DevOps Engineer", "Solutions Architect"],
    tools: ["AWS Management Console", "AWS CLI", "Terraform"],
  },
  {
    id: "project_management",
    name: "Gestión de Proyectos",
    category: "Gestión",
    description: "Planificación, ejecución y control de proyectos",
    difficulty: "intermediate",
    estimatedTime: 45,
    prerequisites: [],
    careerRelevance: ["Project Manager", "Scrum Master", "Product Owner"],
    tools: ["Jira", "Asana", "Trello"],
  },
  {
    id: "digital_marketing",
    name: "Marketing Digital",
    category: "Marketing",
    description: "Estrategias de marketing online",
    difficulty: "intermediate",
    estimatedTime: 40,
    prerequisites: [],
    careerRelevance: ["Marketing Manager", "Social Media Manager", "SEO Specialist"],
    tools: ["Google Analytics", "Google Ads", "Facebook Ads"],
  },
  {
    id: "financial_analysis",
    name: "Análisis Financiero",
    category: "Finanzas",
    description: "Análisis de estados financieros y toma de decisiones de inversión",
    difficulty: "advanced",
    estimatedTime: 60,
    prerequisites: [],
    careerRelevance: ["Financial Analyst", "Investment Banker", "Portfolio Manager"],
    tools: ["Bloomberg Terminal", "FactSet", "Excel"],
  },
  {
    id: "clinical_research",
    name: "Investigación Clínica",
    category: "Salud",
    description: "Diseño y ejecución de estudios clínicos",
    difficulty: "advanced",
    estimatedTime: 90,
    prerequisites: [],
    careerRelevance: ["Clinical Research Associate", "Clinical Trial Manager", "Medical Science Liaison"],
    tools: ["SPSS", "SAS", "R"],
  },
  {
    id: "graphic_design",
    name: "Diseño Gráfico",
    category: "Diseño",
    description: "Creación de diseños visuales para medios impresos y digitales",
    difficulty: "intermediate",
    estimatedTime: 45,
    prerequisites: [],
    careerRelevance: ["Graphic Designer", "Web Designer", "UI/UX Designer"],
    tools: ["Adobe Photoshop", "Adobe Illustrator", "Figma"],
  },
]

// Career-Skill Mapping
export const CAREER_SKILL_MAPS: CareerSkillMap[] = [
  {
    career: "Analista de Datos",
    requiredSkills: [
      { skillId: "excel_advanced", importance: "critical", minimumLevel: "advanced" },
      { skillId: "sql_queries", importance: "critical", minimumLevel: "intermediate" },
      { skillId: "python_programming", importance: "important", minimumLevel: "intermediate" },
      { skillId: "data_visualization", importance: "critical", minimumLevel: "intermediate" },
    ],
    recommendedTestOrder: ["excel_advanced", "sql_queries", "data_visualization", "python_programming"],
  },
  {
    career: "Desarrollador de Software",
    requiredSkills: [
      { skillId: "python_programming", importance: "critical", minimumLevel: "advanced" },
      { skillId: "sql_queries", importance: "important", minimumLevel: "intermediate" },
    ],
    recommendedTestOrder: ["python_programming", "sql_queries"],
  },
  {
    career: "Marketing Digital",
    requiredSkills: [
      { skillId: "excel_advanced", importance: "important", minimumLevel: "intermediate" },
      { skillId: "data_visualization", importance: "important", minimumLevel: "intermediate" },
      { skillId: "powerpoint_design", importance: "critical", minimumLevel: "advanced" },
    ],
    recommendedTestOrder: ["powerpoint_design", "excel_advanced", "data_visualization"],
  },
  {
    career: "Project Manager",
    requiredSkills: [
      { skillId: "project_management", importance: "critical", minimumLevel: "advanced" },
      { skillId: "communication", importance: "important", minimumLevel: "intermediate" },
    ],
    recommendedTestOrder: ["project_management", "communication"],
  },
  {
    career: "Financial Analyst",
    requiredSkills: [
      { skillId: "financial_analysis", importance: "critical", minimumLevel: "advanced" },
      { skillId: "excel_advanced", importance: "important", minimumLevel: "intermediate" },
    ],
    recommendedTestOrder: ["financial_analysis", "excel_advanced"],
  },
  {
    career: "Clinical Research Associate",
    requiredSkills: [
      { skillId: "clinical_research", importance: "critical", minimumLevel: "advanced" },
      { skillId: "data_analysis", importance: "important", minimumLevel: "intermediate" },
    ],
    recommendedTestOrder: ["clinical_research", "data_analysis"],
  },
  {
    career: "Graphic Designer",
    requiredSkills: [
      { skillId: "graphic_design", importance: "critical", minimumLevel: "advanced" },
      { skillId: "communication", importance: "important", minimumLevel: "intermediate" },
    ],
    recommendedTestOrder: ["graphic_design", "communication"],
  },
]

// Technical Tests Database
export const TECHNICAL_TESTS: TechnicalTest[] = [
  {
    id: "excel_advanced_test_1",
    skillId: "excel_advanced",
    title: "Análisis de Ventas con Excel Avanzado",
    description: "Analiza datos de ventas reales usando funciones avanzadas, tablas dinámicas y gráficos",
    instructions: `
      Descarga el archivo de datos de ventas y completa las siguientes tareas:
      1. Crear una tabla dinámica que muestre ventas por región y mes
      2. Usar BUSCARV para agregar información de productos
      3. Crear un gráfico de tendencias de ventas
      4. Calcular métricas clave usando funciones avanzadas
      5. Formatear profesionalmente el reporte final
    `,
    type: "excel",
    difficulty: "advanced",
    timeLimit: 45,
    maxScore: 100,
    files: [
      {
        id: "sales_data",
        name: "datos_ventas_2024.xlsx",
        url: "/test-files/sales_data_2024.xlsx",
        type: "download",
        description: "Archivo con datos de ventas para analizar",
      },
      {
        id: "template",
        name: "plantilla_reporte.xlsx",
        url: "/test-files/report_template.xlsx",
        type: "template",
        description: "Plantilla opcional para el reporte final",
      },
    ],
    evaluationCriteria: [
      {
        criterion: "Tabla Dinámica Correcta",
        weight: 25,
        description: "Tabla dinámica con campos correctos y formato apropiado",
      },
      {
        criterion: "Uso de BUSCARV",
        weight: 20,
        description: "Implementación correcta de BUSCARV para enriquecer datos",
      },
      {
        criterion: "Gráfico de Tendencias",
        weight: 20,
        description: "Gráfico claro y profesional que muestre tendencias",
      },
      {
        criterion: "Funciones Avanzadas",
        weight: 20,
        description: "Uso correcto de funciones como SUMAR.SI, PROMEDIO.SI, etc.",
      },
      {
        criterion: "Presentación y Formato",
        weight: 15,
        description: "Formato profesional y fácil de entender",
      },
    ],
    hints: [
      "Revisa que los rangos de tu tabla dinámica incluyan todos los datos",
      "Usa referencias absolutas en BUSCARV para evitar errores",
      "Considera usar gráficos combinados para mostrar múltiples métricas",
    ],
  },
  {
    id: "python_algorithms_test_1",
    skillId: "python_programming",
    title: "Algoritmos y Estructuras de Datos en Python",
    description: "Resuelve problemas algorítmicos usando Python de manera eficiente",
    instructions: `
      Implementa las siguientes funciones en Python:
      1. Una función que encuentre el segundo número más grande en una lista
      2. Un algoritmo de ordenamiento eficiente
      3. Una función que detecte palíndromos
      4. Un analizador de frecuencia de palabras en texto
    `,
    type: "code",
    difficulty: "intermediate",
    timeLimit: 60,
    maxScore: 100,
    testCases: [
      {
        id: "test_1",
        input: [1, 3, 4, 5, 2],
        expectedOutput: 4,
        description: "Segundo número más grande",
        weight: 25,
      },
      {
        id: "test_2",
        input: "racecar",
        expectedOutput: true,
        description: "Detección de palíndromo",
        weight: 25,
      },
    ],
    evaluationCriteria: [
      {
        criterion: "Correctitud",
        weight: 40,
        description: "Las funciones producen los resultados correctos",
      },
      {
        criterion: "Eficiencia",
        weight: 25,
        description: "Uso eficiente de algoritmos y estructuras de datos",
      },
      {
        criterion: "Código Limpio",
        weight: 20,
        description: "Código legible, bien comentado y siguiendo buenas prácticas",
      },
      {
        criterion: "Manejo de Casos Edge",
        weight: 15,
        description: "Manejo apropiado de casos especiales y errores",
      },
    ],
    sampleSolution: `
def second_largest(numbers):
    if len(numbers) < 2:
        return None
    unique_numbers = list(set(numbers))
    unique_numbers.sort(reverse=True)
    return unique_numbers[1] if len(unique_numbers) > 1 else None
    `,
    hints: [
      "Considera casos donde la lista tenga elementos duplicados",
      "Piensa en la complejidad temporal de tu solución",
      "No olvides validar las entradas",
    ],
  },
  {
    id: "sql_analysis_test_1",
    skillId: "sql_queries",
    title: "Análisis de Datos con SQL",
    description: "Escribe consultas SQL complejas para extraer insights de una base de datos de e-commerce",
    instructions: `
      Usando la base de datos de e-commerce proporcionada, escribe consultas SQL para:
      1. Encontrar los 10 productos más vendidos por categoría
      2. Calcular el valor promedio de pedidos por mes
      3. Identificar clientes con mayor valor de vida (LTV)
      4. Analizar tendencias de ventas por región
      5. Crear un reporte de productos con bajo stock
    `,
    type: "sql",
    difficulty: "intermediate",
    timeLimit: 40,
    maxScore: 100,
    files: [
      {
        id: "database_schema",
        name: "esquema_ecommerce.sql",
        url: "/test-files/ecommerce_schema.sql",
        type: "download",
        description: "Esquema de la base de datos con datos de prueba",
      },
    ],
    evaluationCriteria: [
      {
        criterion: "Consultas Correctas",
        weight: 35,
        description: "Las consultas SQL producen los resultados esperados",
      },
      {
        criterion: "Optimización",
        weight: 25,
        description: "Uso eficiente de índices y optimización de consultas",
      },
      {
        criterion: "Complejidad",
        weight: 20,
        description: "Uso apropiado de JOINs, subconsultas y funciones agregadas",
      },
      {
        criterion: "Formato y Legibilidad",
        weight: 20,
        description: "Consultas bien formateadas y comentadas",
      },
    ],
    hints: [
      "Usa EXPLAIN para verificar el plan de ejecución de tus consultas",
      "Considera usar CTEs para consultas complejas",
      "No olvides manejar valores NULL apropiadamente",
    ],
  },
]

// Utility Functions
export function getSkillsByCareer(career: string): TechnicalSkill[] {
  const careerMap = CAREER_SKILL_MAPS.find((map) => map.career === career)
  if (!careerMap) return []

  return careerMap.requiredSkills
    .map((req) => TECHNICAL_SKILLS.find((skill) => skill.id === req.skillId))
    .filter(Boolean) as TechnicalSkill[]
}

export function getTestsForSkill(skillId: string): TechnicalTest[] {
  return TECHNICAL_TESTS.filter((test) => test.skillId === skillId)
}

export function calculateSkillLevel(score: number): "beginner" | "intermediate" | "advanced" | "expert" {
  if (score >= 90) return "expert"
  if (score >= 75) return "advanced"
  if (score >= 60) return "intermediate"
  return "beginner"
}

export function generateSkillCertificate(validation: SkillValidation): string {
  const skill = TECHNICAL_SKILLS.find((s) => s.id === validation.skillId)
  return `Certificado DTC - ${skill?.name} (Nivel ${validation.level.toUpperCase()}) - Puntuación: ${validation.score}/100`
}
