export interface UDDCareer {
  id: string
  name: string
  faculty: string
  duration: number
  campus: string[]
  description: string
  admissionRequirements: {
    psu: number
    ranking: number
    nem: number
  }
  curriculum: {
    basicSciences: string[]
    specialty: string[]
    electives: string[]
  }
  employabilityRate: number
  averageSalary: {
    entry: number
    mid: number
    senior: number
  }
  skills: string[]
  personalityMatch: {
    openness: number
    conscientiousness: number
    extraversion: number
    agreeableness: number
    neuroticism: number
  }
  jobOpportunities: string[]
  relatedFields: string[]
}

export const uddCareers: UDDCareer[] = [
  {
    id: "ing-civil-informatica",
    name: "Ingeniería Civil en Informática",
    faculty: "Facultad de Ingeniería",
    duration: 6,
    campus: ["Santiago", "Concepción"],
    description:
      "Forma profesionales capaces de diseñar, desarrollar e implementar soluciones tecnológicas innovadoras para resolver problemas complejos en diversos sectores de la industria.",
    admissionRequirements: {
      psu: 650,
      ranking: 70,
      nem: 6.0,
    },
    curriculum: {
      basicSciences: ["Matemáticas", "Física", "Química", "Estadística"],
      specialty: [
        "Programación",
        "Algoritmos",
        "Bases de Datos",
        "Redes",
        "Inteligencia Artificial",
        "Ingeniería de Software",
      ],
      electives: ["Ciberseguridad", "Machine Learning", "Desarrollo Mobile", "Cloud Computing"],
    },
    employabilityRate: 95,
    averageSalary: {
      entry: 1800000,
      mid: 2800000,
      senior: 4500000,
    },
    skills: [
      "Programación",
      "Análisis de Sistemas",
      "Resolución de Problemas",
      "Pensamiento Lógico",
      "Trabajo en Equipo",
    ],
    personalityMatch: {
      openness: 0.8,
      conscientiousness: 0.7,
      extraversion: 0.5,
      agreeableness: 0.6,
      neuroticism: 0.3,
    },
    jobOpportunities: [
      "Desarrollador de Software",
      "Arquitecto de Sistemas",
      "Consultor TI",
      "Product Manager",
      "Data Scientist",
      "DevOps Engineer",
    ],
    relatedFields: ["Tecnología", "Innovación", "Startups", "Consultoría"],
  },
  {
    id: "psicologia",
    name: "Psicología",
    faculty: "Facultad de Psicología",
    duration: 5,
    campus: ["Santiago", "Concepción"],
    description:
      "Forma psicólogos integrales con sólida formación científica y práctica, capaces de comprender y abordar los procesos psicológicos en diversos contextos.",
    admissionRequirements: {
      psu: 600,
      ranking: 65,
      nem: 5.8,
    },
    curriculum: {
      basicSciences: ["Neurociencias", "Estadística", "Metodología de Investigación", "Biología"],
      specialty: ["Psicología Clínica", "Psicología Organizacional", "Psicología Educacional", "Psicología Social"],
      electives: ["Terapias Alternativas", "Psicología Forense", "Neuropsicología", "Psicología Deportiva"],
    },
    employabilityRate: 88,
    averageSalary: {
      entry: 1200000,
      mid: 2000000,
      senior: 3500000,
    },
    skills: ["Empatía", "Comunicación", "Análisis", "Escucha Activa", "Resolución de Conflictos"],
    personalityMatch: {
      openness: 0.7,
      conscientiousness: 0.6,
      extraversion: 0.7,
      agreeableness: 0.8,
      neuroticism: 0.2,
    },
    jobOpportunities: [
      "Psicólogo Clínico",
      "Psicólogo Organizacional",
      "Consultor en RRHH",
      "Terapeuta",
      "Investigador",
      "Coach Profesional",
    ],
    relatedFields: ["Salud", "Recursos Humanos", "Educación", "Investigación"],
  },
  {
    id: "medicina",
    name: "Medicina",
    faculty: "Facultad de Medicina",
    duration: 7,
    campus: ["Santiago"],
    description:
      "Forma médicos con excelencia académica, compromiso social y valores éticos, preparados para enfrentar los desafíos de la medicina moderna.",
    admissionRequirements: {
      psu: 750,
      ranking: 90,
      nem: 6.5,
    },
    curriculum: {
      basicSciences: ["Anatomía", "Fisiología", "Bioquímica", "Farmacología", "Patología"],
      specialty: ["Medicina Interna", "Cirugía", "Pediatría", "Ginecología", "Psiquiatría"],
      electives: ["Medicina de Urgencia", "Medicina Familiar", "Medicina Deportiva", "Telemedicina"],
    },
    employabilityRate: 98,
    averageSalary: {
      entry: 2500000,
      mid: 4500000,
      senior: 8000000,
    },
    skills: ["Diagnóstico", "Toma de Decisiones", "Comunicación", "Trabajo bajo Presión", "Liderazgo"],
    personalityMatch: {
      openness: 0.6,
      conscientiousness: 0.9,
      extraversion: 0.6,
      agreeableness: 0.7,
      neuroticism: 0.2,
    },
    jobOpportunities: [
      "Médico General",
      "Especialista Médico",
      "Médico de Urgencia",
      "Investigador Médico",
      "Consultor en Salud",
      "Director Médico",
    ],
    relatedFields: ["Salud", "Investigación", "Administración Sanitaria", "Salud Pública"],
  },
  {
    id: "arquitectura",
    name: "Arquitectura",
    faculty: "Facultad de Arquitectura y Arte",
    duration: 6,
    campus: ["Santiago", "Concepción"],
    description:
      "Forma arquitectos creativos y técnicamente competentes, capaces de diseñar espacios habitables que respondan a las necesidades sociales y ambientales.",
    admissionRequirements: {
      psu: 620,
      ranking: 70,
      nem: 6.0,
    },
    curriculum: {
      basicSciences: ["Matemáticas", "Física", "Geometría", "Estructuras"],
      specialty: [
        "Diseño Arquitectónico",
        "Urbanismo",
        "Historia de la Arquitectura",
        "Construcción",
        "Sustentabilidad",
      ],
      electives: ["Arquitectura Bioclimática", "Restauración", "Paisajismo", "Arquitectura Digital"],
    },
    employabilityRate: 85,
    averageSalary: {
      entry: 1500000,
      mid: 2500000,
      senior: 4000000,
    },
    skills: ["Creatividad", "Diseño", "Visualización Espacial", "Comunicación Visual", "Gestión de Proyectos"],
    personalityMatch: {
      openness: 0.9,
      conscientiousness: 0.7,
      extraversion: 0.6,
      agreeableness: 0.6,
      neuroticism: 0.3,
    },
    jobOpportunities: [
      "Arquitecto Proyectista",
      "Arquitecto Urbanista",
      "Consultor en Construcción",
      "Diseñador de Interiores",
      "Gestor Inmobiliario",
      "Arquitecto Patrimonial",
    ],
    relatedFields: ["Construcción", "Inmobiliario", "Urbanismo", "Diseño"],
  },
  {
    id: "ingenieria-comercial",
    name: "Ingeniería Comercial",
    faculty: "Facultad de Economía y Negocios",
    duration: 5,
    campus: ["Santiago", "Concepción"],
    description:
      "Forma profesionales con sólida formación en gestión empresarial, finanzas y estrategia, preparados para liderar organizaciones en un entorno globalizado.",
    admissionRequirements: {
      psu: 680,
      ranking: 75,
      nem: 6.2,
    },
    curriculum: {
      basicSciences: ["Matemáticas", "Estadística", "Economía", "Contabilidad"],
      specialty: ["Finanzas", "Marketing", "Estrategia", "Operaciones", "Recursos Humanos", "Emprendimiento"],
      electives: ["Comercio Internacional", "Innovación", "Sostenibilidad", "Transformación Digital"],
    },
    employabilityRate: 92,
    averageSalary: {
      entry: 1600000,
      mid: 2800000,
      senior: 5000000,
    },
    skills: ["Liderazgo", "Análisis Financiero", "Negociación", "Estrategia", "Comunicación"],
    personalityMatch: {
      openness: 0.7,
      conscientiousness: 0.8,
      extraversion: 0.8,
      agreeableness: 0.6,
      neuroticism: 0.3,
    },
    jobOpportunities: [
      "Gerente General",
      "Consultor Estratégico",
      "Analista Financiero",
      "Product Manager",
      "Emprendedor",
      "Director Comercial",
    ],
    relatedFields: ["Negocios", "Consultoría", "Finanzas", "Emprendimiento"],
  },
]

export function getCareerRecommendations(
  personalityResults: Record<string, number> = {},
  userSkills: string[] = [],
  jobInterests: string[] = [],
): UDDCareer[] {
  // Ensure we have valid inputs
  const validPersonalityResults = personalityResults || {}
  const validUserSkills = userSkills || []
  const validJobInterests = jobInterests || []

  return uddCareers
    .map((career) => {
      let score = 0

      // Personality matching (40% weight)
      const personalityEntries = Object.entries(validPersonalityResults)
      if (personalityEntries.length > 0) {
        const personalityScore =
          personalityEntries.reduce((acc, [trait, value]) => {
            const traitKey = trait.toLowerCase() as keyof typeof career.personalityMatch
            if (career.personalityMatch[traitKey] !== undefined) {
              return acc + (1 - Math.abs(value - career.personalityMatch[traitKey]))
            }
            return acc
          }, 0) / personalityEntries.length

        score += personalityScore * 0.4
      }

      // Skills matching (30% weight)
      if (validUserSkills.length > 0) {
        const skillsMatch =
          validUserSkills.filter((skill) =>
            career.skills.some(
              (careerSkill) =>
                careerSkill.toLowerCase().includes(skill.toLowerCase()) ||
                skill.toLowerCase().includes(careerSkill.toLowerCase()),
            ),
          ).length / validUserSkills.length

        score += skillsMatch * 0.3
      }

      // Job interests matching (30% weight)
      if (validJobInterests.length > 0) {
        const interestsMatch =
          validJobInterests.filter(
            (interest) =>
              career.relatedFields.some(
                (field) =>
                  field.toLowerCase().includes(interest.toLowerCase()) ||
                  interest.toLowerCase().includes(field.toLowerCase()),
              ) ||
              career.jobOpportunities.some(
                (job) =>
                  job.toLowerCase().includes(interest.toLowerCase()) ||
                  interest.toLowerCase().includes(job.toLowerCase()),
              ),
          ).length / validJobInterests.length

        score += interestsMatch * 0.3
      }

      return { ...career, matchScore: Math.round(score * 100) }
    })
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    .slice(0, 5)
}

export function getCareerById(id: string): UDDCareer | undefined {
  return uddCareers.find((career) => career.id === id)
}

export function getCareersByFaculty(faculty: string): UDDCareer[] {
  return uddCareers.filter((career) => career.faculty === faculty)
}

export function searchCareers(query: string): UDDCareer[] {
  const lowercaseQuery = query.toLowerCase()
  return uddCareers.filter(
    (career) =>
      career.name.toLowerCase().includes(lowercaseQuery) ||
      career.faculty.toLowerCase().includes(lowercaseQuery) ||
      career.description.toLowerCase().includes(lowercaseQuery) ||
      career.skills.some((skill) => skill.toLowerCase().includes(lowercaseQuery)) ||
      career.jobOpportunities.some((job) => job.toLowerCase().includes(lowercaseQuery)),
  )
}
