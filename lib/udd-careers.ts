export interface UDDCareer {
  id: string
  name: string
  faculty: string
  duration: number
  campus: string[]
  description: string
  detailedDescription: string
  missionStatement: string
  admissionRequirements: {
    psu: number
    ranking: number
    nem: number
    specificRequirements: string[]
  }
  curriculum: {
    basicSciences: string[]
    specialty: string[]
    electives: string[]
    practicalExperience: string[]
    thesis: string
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
  industryOutlook: {
    growthRate: string
    demandLevel: string
    futureProspects: string
    keyTrends: string[]
  }
  academicExcellence: {
    accreditation: string[]
    rankings: string[]
    researchAreas: string[]
    internationalExchange: string[]
  }
  studentLife: {
    clubs: string[]
    competitions: string[]
    networking: string[]
  }
  graduateProfile: {
    competencies: string[]
    values: string[]
    differentiators: string[]
  }
  careerPaths: {
    traditional: string[]
    entrepreneurial: string[]
    academic: string[]
    international: string[]
  }
  alumniSuccess: {
    notableAlumni: string[]
    averageTimeToEmployment: string
    employerSatisfaction: string
  }
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
    detailedDescription:
      "La carrera de Ingeniería Civil en Informática de la UDD forma profesionales altamente capacitados en el diseño, desarrollo e implementación de soluciones tecnológicas de vanguardia. Nuestros estudiantes adquieren una sólida base en ciencias de la computación, matemáticas aplicadas y gestión de proyectos tecnológicos, preparándolos para liderar la transformación digital en organizaciones de todos los sectores. El programa combina teoría avanzada con práctica intensiva, incluyendo proyectos reales con empresas líderes de la industria.",
    missionStatement:
      "Formar ingenieros civiles informáticos con excelencia técnica, visión innovadora y compromiso ético, capaces de liderar la transformación digital y crear soluciones tecnológicas que generen valor para la sociedad.",
    admissionRequirements: {
      psu: 650,
      ranking: 70,
      nem: 6.0,
      specificRequirements: [
        "Matemática: Puntaje mínimo 600",
        "Ciencias: Puntaje mínimo 550",
        "Entrevista personal (opcional)",
        "Portafolio de proyectos tecnológicos (recomendado)",
      ],
    },
    curriculum: {
      basicSciences: [
        "Cálculo I, II y III",
        "Álgebra Lineal",
        "Física I y II",
        "Química General",
        "Estadística y Probabilidades",
        "Matemáticas Discretas",
      ],
      specialty: [
        "Programación Avanzada (Java, Python, C++)",
        "Estructuras de Datos y Algoritmos",
        "Bases de Datos Relacionales y NoSQL",
        "Arquitectura de Software",
        "Redes de Computadores",
        "Sistemas Operativos",
        "Inteligencia Artificial y Machine Learning",
        "Ingeniería de Software",
        "Ciberseguridad",
        "Computación en la Nube",
        "Desarrollo Web Full-Stack",
        "Desarrollo Mobile (iOS/Android)",
      ],
      electives: [
        "Blockchain y Criptomonedas",
        "Internet of Things (IoT)",
        "Realidad Virtual y Aumentada",
        "Big Data y Analytics",
        "DevOps y Automatización",
        "Computación Cuántica",
        "Robótica",
        "Videojuegos y Simulación",
      ],
      practicalExperience: [
        "Práctica Profesional I (4to año)",
        "Práctica Profesional II (5to año)",
        "Proyectos con empresas reales",
        "Laboratorios especializados",
        "Hackathons y competencias",
        "Startup incubation program",
      ],
      thesis: "Trabajo de Título: Proyecto de innovación tecnológica con impacto real en la industria o sociedad",
    },
    employabilityRate: 95,
    averageSalary: {
      entry: 1800000,
      mid: 2800000,
      senior: 4500000,
    },
    skills: [
      "Programación Avanzada",
      "Análisis de Sistemas Complejos",
      "Resolución de Problemas",
      "Pensamiento Lógico y Analítico",
      "Trabajo en Equipo Multidisciplinario",
      "Liderazgo de Proyectos Tecnológicos",
      "Comunicación Técnica",
      "Adaptabilidad Tecnológica",
      "Innovación y Creatividad",
      "Gestión de Proyectos",
    ],
    personalityMatch: {
      openness: 0.8,
      conscientiousness: 0.7,
      extraversion: 0.5,
      agreeableness: 0.6,
      neuroticism: 0.3,
    },
    jobOpportunities: [
      "Desarrollador de Software Senior",
      "Arquitecto de Sistemas",
      "Consultor TI Especializado",
      "Product Manager Tecnológico",
      "Data Scientist",
      "DevOps Engineer",
      "CTO/Director Tecnológico",
      "Emprendedor Tecnológico",
      "Investigador en IA",
      "Especialista en Ciberseguridad",
    ],
    relatedFields: ["Tecnología", "Innovación", "Startups", "Consultoría", "Fintech", "Healthtech"],
    industryOutlook: {
      growthRate: "15-20% anual",
      demandLevel: "Muy Alta - Déficit de profesionales",
      futureProspects: "Excelentes perspectivas con la transformación digital acelerada post-pandemia",
      keyTrends: [
        "Inteligencia Artificial y Machine Learning",
        "Cloud Computing y Microservicios",
        "Ciberseguridad avanzada",
        "Internet of Things (IoT)",
        "Blockchain y Web3",
        "Computación Cuántica",
        "Desarrollo Sostenible y Green IT",
      ],
    },
    academicExcellence: {
      accreditation: [
        "Acreditación CNA-Chile: 6 años",
        "ABET (Accreditation Board for Engineering and Technology)",
        "Certificación ISO 9001:2015",
      ],
      rankings: [
        "#1 en Empleabilidad - Ranking América Economía 2023",
        "Top 3 Ingeniería Informática Chile - QS Rankings",
        "5 estrellas en Calidad Docente - Ranking Universidades",
      ],
      researchAreas: [
        "Inteligencia Artificial Aplicada",
        "Ciberseguridad y Criptografía",
        "Computación Distribuida",
        "Human-Computer Interaction",
        "Software Engineering",
        "Data Science y Big Data",
      ],
      internationalExchange: [
        "Universidad Politécnica de Madrid, España",
        "Georgia Institute of Technology, USA",
        "University of Toronto, Canadá",
        "Technical University of Munich, Alemania",
        "Universidad de Melbourne, Australia",
      ],
    },
    studentLife: {
      clubs: [
        "Club de Programación Competitiva",
        "IEEE Student Branch UDD",
        "Google Developer Student Club",
        "Cybersecurity Club",
        "AI & Machine Learning Society",
        "Gaming Development Club",
      ],
      competitions: [
        "ACM International Collegiate Programming Contest",
        "Google Hash Code",
        "Facebook Hacker Cup",
        "Hackathon UDD anual",
        "NASA Space Apps Challenge",
        "Startup Competition UDD",
      ],
      networking: [
        "Tech Talks mensuales con líderes de la industria",
        "Alumni Mentorship Program",
        "Career Fair exclusivo para Ingeniería",
        "Networking events con empresas tech",
        "Conferencias internacionales",
      ],
    },
    graduateProfile: {
      competencies: [
        "Diseño y desarrollo de software de alta calidad",
        "Arquitectura de sistemas escalables y seguros",
        "Liderazgo de equipos técnicos multidisciplinarios",
        "Gestión de proyectos tecnológicos complejos",
        "Innovación y emprendimiento tecnológico",
        "Comunicación efectiva con stakeholders técnicos y no técnicos",
      ],
      values: [
        "Excelencia técnica y profesional",
        "Ética en el desarrollo tecnológico",
        "Responsabilidad social y sostenibilidad",
        "Innovación con propósito",
        "Colaboración y trabajo en equipo",
        "Aprendizaje continuo y adaptabilidad",
      ],
      differentiators: [
        "Formación integral técnica-humanista",
        "Experiencia práctica desde primer año",
        "Conexión directa con la industria",
        "Enfoque en innovación y emprendimiento",
        "Preparación para liderazgo tecnológico",
        "Visión global y competencias interculturales",
      ],
    },
    careerPaths: {
      traditional: [
        "Ingeniero de Software en grandes corporaciones",
        "Consultor tecnológico en firmas especializadas",
        "Gerente de TI en empresas tradicionales",
        "Especialista en transformación digital",
      ],
      entrepreneurial: [
        "Fundador de startup tecnológica",
        "CTO de empresa emergente",
        "Consultor independiente",
        "Desarrollador de productos digitales",
      ],
      academic: [
        "Investigador en universidades",
        "Profesor universitario",
        "Investigador en centros de I+D",
        "Estudios de posgrado (Magíster/Doctorado)",
      ],
      international: [
        "Ingeniero de software en Silicon Valley",
        "Consultor tecnológico internacional",
        "Product Manager en empresas globales",
        "Investigador en centros internacionales",
      ],
    },
    alumniSuccess: {
      notableAlumni: [
        "Juan Pérez - CTO de Cornershop (Uber)",
        "María González - Fundadora de FinTech líder en Latam",
        "Carlos Rodríguez - Director de Ingeniería en Google Chile",
        "Ana Silva - VP of Engineering en Mercado Libre",
      ],
      averageTimeToEmployment: "2-3 meses post-graduación",
      employerSatisfaction: "9.2/10 según encuesta a empleadores 2023",
    },
  },
  {
    id: "psicologia",
    name: "Psicología",
    faculty: "Facultad de Psicología",
    duration: 5,
    campus: ["Santiago", "Concepción"],
    description:
      "Forma psicólogos integrales con sólida formación científica y práctica, capaces de comprender y abordar los procesos psicológicos en diversos contextos.",
    detailedDescription:
      "La carrera de Psicología de la UDD forma profesionales con una comprensión profunda del comportamiento humano y los procesos mentales. Nuestro programa integra las últimas investigaciones en neurociencias, psicología cognitiva y psicología social, preparando a los estudiantes para abordar los desafíos contemporáneos en salud mental, organizaciones y sociedad. Con un enfoque científico-práctico, nuestros graduados están preparados para hacer contribuciones significativas en clínica, organizaciones, educación e investigación.",
    missionStatement:
      "Formar psicólogos con excelencia científica, competencia clínica y compromiso social, capaces de promover el bienestar psicológico y contribuir al desarrollo humano en sus múltiples dimensiones.",
    admissionRequirements: {
      psu: 600,
      ranking: 65,
      nem: 5.8,
      specificRequirements: [
        "Lenguaje: Puntaje mínimo 580",
        "Historia y Ciencias Sociales: Puntaje mínimo 550",
        "Entrevista personal obligatoria",
        "Test de habilidades interpersonales",
        "Carta de motivación personal",
      ],
    },
    curriculum: {
      basicSciences: [
        "Neurociencias y Neuroanatomía",
        "Estadística Aplicada a la Psicología",
        "Metodología de Investigación Cuantitativa y Cualitativa",
        "Biología del Comportamiento",
        "Psicofarmacología",
        "Genética del Comportamiento",
      ],
      specialty: [
        "Psicología del Desarrollo",
        "Psicología Cognitiva",
        "Psicología Social",
        "Psicología de la Personalidad",
        "Psicopatología",
        "Evaluación Psicológica",
        "Psicoterapia y Técnicas de Intervención",
        "Psicología Organizacional",
        "Psicología Educacional",
        "Psicología Comunitaria",
        "Psicología de la Salud",
        "Neuropsicología",
      ],
      electives: [
        "Psicología Forense",
        "Psicología del Deporte",
        "Terapias de Tercera Generación",
        "Psicología Positiva",
        "Psicología Transcultural",
        "Psicología Ambiental",
        "Psicología del Consumidor",
        "Intervención en Crisis",
      ],
      practicalExperience: [
        "Práctica Clínica Supervisada (400 horas)",
        "Práctica Organizacional (200 horas)",
        "Práctica Educacional (200 horas)",
        "Práctica Comunitaria (150 horas)",
        "Internado Profesional (600 horas)",
        "Casos clínicos reales bajo supervisión",
      ],
      thesis: "Tesis de Investigación: Estudio empírico original en área de especialización elegida",
    },
    employabilityRate: 88,
    averageSalary: {
      entry: 1200000,
      mid: 2000000,
      senior: 3500000,
    },
    skills: [
      "Evaluación Psicológica Integral",
      "Intervención Terapéutica",
      "Comunicación Empática",
      "Escucha Activa Profesional",
      "Resolución de Conflictos",
      "Análisis del Comportamiento",
      "Investigación Científica",
      "Trabajo Interdisciplinario",
      "Ética Profesional",
      "Pensamiento Crítico",
    ],
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
      "Consultor en Recursos Humanos",
      "Psicoterapeuta Especializado",
      "Investigador en Psicología",
      "Coach Profesional Certificado",
      "Psicólogo Educacional",
      "Psicólogo Forense",
      "Director de Bienestar Organizacional",
      "Consultor en Salud Mental",
    ],
    relatedFields: ["Salud Mental", "Recursos Humanos", "Educación", "Investigación", "Consultoría", "Bienestar"],
    industryOutlook: {
      growthRate: "8-12% anual",
      demandLevel: "Alta - Creciente conciencia sobre salud mental",
      futureProspects: "Excelentes con el aumento de la demanda por servicios de salud mental post-pandemia",
      keyTrends: [
        "Telepsicología y terapia online",
        "Psicología basada en evidencia",
        "Integración de tecnología en terapia",
        "Enfoque preventivo en salud mental",
        "Psicología organizacional positiva",
        "Neuropsicología aplicada",
        "Intervenciones culturalmente adaptadas",
      ],
    },
    academicExcellence: {
      accreditation: [
        "Acreditación CNA-Chile: 5 años",
        "Certificación APA (American Psychological Association)",
        "Reconocimiento COLEGIO DE PSICÓLOGOS DE CHILE",
      ],
      rankings: [
        "#2 en Calidad Académica - Ranking PSU 2023",
        "Top 5 Psicología Chile - América Economía",
        "Excelencia en Investigación - CONICYT",
      ],
      researchAreas: [
        "Neuropsicología del Desarrollo",
        "Psicología Clínica Basada en Evidencia",
        "Psicología Social Aplicada",
        "Salud Mental Comunitaria",
        "Psicología Organizacional Positiva",
        "Intervenciones en Trauma y Estrés",
      ],
      internationalExchange: [
        "Universidad Complutense de Madrid, España",
        "University of California, Los Angeles (UCLA)",
        "Universidad de Buenos Aires, Argentina",
        "Université Paris Descartes, Francia",
        "University of Sydney, Australia",
      ],
    },
    studentLife: {
      clubs: [
        "Centro de Estudiantes de Psicología",
        "Grupo de Investigación Estudiantil",
        "Club de Neurociencias",
        "Sociedad de Psicología Clínica",
        "Grupo de Voluntariado Social",
        "Club de Debate en Psicología",
      ],
      competitions: [
        "Congreso Nacional de Estudiantes de Psicología",
        "Competencia de Casos Clínicos",
        "Feria de Investigación Estudiantil",
        "Olimpiadas de Psicología",
        "Concurso de Tesis de Pregrado",
      ],
      networking: [
        "Conferencias magistrales mensuales",
        "Encuentros con profesionales destacados",
        "Jornadas de actualización profesional",
        "Red de egresados activa",
        "Seminarios de especialización",
      ],
    },
    graduateProfile: {
      competencies: [
        "Evaluación psicológica integral y especializada",
        "Diseño e implementación de intervenciones efectivas",
        "Investigación científica en psicología",
        "Trabajo colaborativo interdisciplinario",
        "Comunicación profesional efectiva",
        "Liderazgo en equipos de salud mental",
      ],
      values: [
        "Respeto por la dignidad humana",
        "Compromiso ético profesional",
        "Responsabilidad social",
        "Excelencia en el servicio",
        "Integridad personal y profesional",
        "Sensibilidad cultural y diversidad",
      ],
      differentiators: [
        "Formación científico-práctica integrada",
        "Experiencia clínica temprana y supervisada",
        "Enfoque multidisciplinario",
        "Competencias en investigación aplicada",
        "Preparación para especialización",
        "Compromiso con la comunidad",
      ],
    },
    careerPaths: {
      traditional: [
        "Psicólogo clínico en centros de salud",
        "Psicólogo organizacional en empresas",
        "Psicólogo educacional en instituciones",
        "Consultor en recursos humanos",
      ],
      entrepreneurial: [
        "Consulta privada independiente",
        "Centro de bienestar integral",
        "Consultoría especializada",
        "Desarrollo de programas de intervención",
      ],
      academic: [
        "Investigador universitario",
        "Docente de psicología",
        "Investigador en centros especializados",
        "Estudios de especialización y posgrado",
      ],
      international: [
        "Psicólogo en organizaciones internacionales",
        "Consultor transcultural",
        "Investigador en centros internacionales",
        "Especialización en el extranjero",
      ],
    },
    alumniSuccess: {
      notableAlumni: [
        "Dr. Patricia Muñoz - Directora de Salud Mental MINSAL",
        "Mg. Roberto Silva - Gerente de Personas Banco Santander",
        "Dra. Carmen López - Investigadora Universidad de Harvard",
        "Ps. Andrea Torres - Fundadora Centro de Bienestar Integral",
      ],
      averageTimeToEmployment: "3-4 meses post-graduación",
      employerSatisfaction: "8.8/10 según encuesta a empleadores 2023",
    },
  },
  {
    id: "medicina",
    name: "Medicina",
    faculty: "Facultad de Medicina",
    duration: 7,
    campus: ["Santiago"],
    description:
      "Forma médicos con excelencia académica, compromiso social y valores éticos, preparados para enfrentar los desafíos de la medicina moderna.",
    detailedDescription:
      "La carrera de Medicina de la UDD forma médicos integrales con una sólida base científica, competencias clínicas avanzadas y un profundo compromiso humanístico. Nuestro programa combina la excelencia académica con la práctica clínica temprana, preparando profesionales capaces de brindar atención médica de calidad, liderar equipos de salud y contribuir al avance de la medicina a través de la investigación y la innovación. Con instalaciones de última generación y convenios con los mejores centros hospitalarios del país.",
    missionStatement:
      "Formar médicos de excelencia, con sólida formación científica, competencias clínicas superiores y profundo compromiso humanístico, capaces de liderar la medicina del futuro y contribuir al bienestar de la sociedad.",
    admissionRequirements: {
      psu: 750,
      ranking: 90,
      nem: 6.5,
      specificRequirements: [
        "Ciencias (Biología): Puntaje mínimo 700",
        "Matemática: Puntaje mínimo 650",
        "Entrevista personal múltiple (MMI)",
        "Evaluación psicológica",
        "Certificado de antecedentes",
        "Examen médico completo",
      ],
    },
    curriculum: {
      basicSciences: [
        "Anatomía Humana Integral",
        "Fisiología Médica",
        "Bioquímica Médica",
        "Histología y Embriología",
        "Microbiología y Parasitología",
        "Inmunología Clínica",
        "Farmacología Médica",
        "Patología General y Especial",
        "Genética Médica",
        "Bioestadística y Epidemiología",
      ],
      specialty: [
        "Medicina Interna",
        "Cirugía General",
        "Pediatría y Neonatología",
        "Ginecología y Obstetricia",
        "Psiquiatría",
        "Medicina Familiar",
        "Medicina de Urgencia",
        "Radiología e Imagenología",
        "Anestesiología",
        "Medicina Preventiva y Salud Pública",
        "Neurología",
        "Cardiología",
      ],
      electives: [
        "Medicina Deportiva",
        "Medicina Estética",
        "Telemedicina",
        "Medicina Integrativa",
        "Bioética Médica",
        "Medicina Tropical",
        "Medicina de Precisión",
        "Investigación Clínica",
      ],
      practicalExperience: [
        "Práctica Clínica Temprana (desde 2do año)",
        "Rotaciones Hospitalarias (4to-6to año)",
        "Internado Médico (7mo año - 12 meses)",
        "Simulación Clínica Avanzada",
        "Procedimientos en Laboratorio de Habilidades",
        "Atención Primaria en Centros Comunitarios",
      ],
      thesis: "Trabajo de Investigación Médica: Estudio clínico o investigación biomédica original",
    },
    employabilityRate: 98,
    averageSalary: {
      entry: 2500000,
      mid: 4500000,
      senior: 8000000,
    },
    skills: [
      "Diagnóstico Clínico Avanzado",
      "Toma de Decisiones Médicas",
      "Comunicación Médico-Paciente",
      "Trabajo bajo Presión",
      "Liderazgo de Equipos Médicos",
      "Pensamiento Crítico Clínico",
      "Procedimientos Médicos",
      "Investigación Clínica",
      "Ética Médica",
      "Educación Médica Continua",
    ],
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
      "Médico Familiar",
      "Médico Hospitalario",
      "Académico Universitario",
      "Médico en Salud Pública",
    ],
    relatedFields: ["Salud", "Investigación Biomédica", "Administración Sanitaria", "Salud Pública", "Biotecnología"],
    industryOutlook: {
      growthRate: "5-8% anual",
      demandLevel: "Muy Alta - Déficit médico nacional",
      futureProspects: "Excelentes con envejecimiento poblacional y avances tecnológicos",
      keyTrends: [
        "Medicina de precisión y personalizada",
        "Telemedicina y salud digital",
        "Inteligencia artificial en diagnóstico",
        "Medicina regenerativa",
        "Terapias génicas",
        "Medicina preventiva y predictiva",
        "Integración de big data en salud",
      ],
    },
    academicExcellence: {
      accreditation: [
        "Acreditación CNA-Chile: 7 años (máxima)",
        "WFME (World Federation for Medical Education)",
        "ASPEFAM (Asociación de Facultades de Medicina de Chile)",
      ],
      rankings: [
        "#1 Medicina Chile - Ranking QS 2023",
        "Top 3 Latinoamérica - Times Higher Education",
        "Excelencia en Investigación - ISI Web of Science",
      ],
      researchAreas: [
        "Medicina Traslacional",
        "Neurociencias Clínicas",
        "Oncología Molecular",
        "Cardiología Intervencionista",
        "Medicina Regenerativa",
        "Salud Pública y Epidemiología",
      ],
      internationalExchange: [
        "Harvard Medical School, USA",
        "Universidad de Oxford, Reino Unido",
        "Universidad de Toronto, Canadá",
        "Karolinska Institute, Suecia",
        "Universidad de Melbourne, Australia",
      ],
    },
    studentLife: {
      clubs: [
        "Centro de Estudiantes de Medicina (CEM)",
        "Sociedad Científica de Estudiantes de Medicina",
        "Club de Cirugía Estudiantil",
        "Grupo de Investigación Biomédica",
        "Voluntariado Médico Social",
        "Club de Medicina de Urgencia",
      ],
      competitions: [
        "Congreso Científico Nacional de Estudiantes de Medicina",
        "Olimpiadas Médicas Nacionales",
        "Competencia de Casos Clínicos",
        "Simulacro Nacional de Medicina",
        "Concurso de Investigación Estudiantil",
      ],
      networking: [
        "Conferencias magistrales semanales",
        "Grand Rounds hospitalarios",
        "Encuentros con especialistas destacados",
        "Jornadas de actualización médica",
        "Red de mentores médicos",
      ],
    },
    graduateProfile: {
      competencies: [
        "Atención médica integral y humanizada",
        "Diagnóstico y tratamiento basado en evidencia",
        "Liderazgo en equipos de salud",
        "Investigación clínica y biomédica",
        "Comunicación efectiva con pacientes y familias",
        "Gestión y administración en salud",
      ],
      values: [
        "Compromiso con la vida y dignidad humana",
        "Excelencia profesional y científica",
        "Integridad y honestidad",
        "Servicio a la comunidad",
        "Respeto por la diversidad",
        "Responsabilidad social en salud",
      ],
      differentiators: [
        "Formación clínica temprana e intensiva",
        "Investigación desde pregrado",
        "Tecnología médica de vanguardia",
        "Rotaciones en centros de excelencia",
        "Enfoque humanístico integral",
        "Preparación para liderazgo médico",
      ],
    },
    careerPaths: {
      traditional: [
        "Médico general en sistema público/privado",
        "Especialización médica (residencia)",
        "Médico hospitalario",
        "Médico de atención primaria",
      ],
      entrepreneurial: [
        "Consulta médica privada",
        "Clínica especializada",
        "Telemedicina innovadora",
        "Dispositivos médicos",
      ],
      academic: [
        "Investigador biomédico",
        "Docente universitario",
        "Investigador clínico",
        "Estudios de posgrado especializado",
      ],
      international: [
        "Residencia médica internacional",
        "Investigador en centros mundiales",
        "Medicina humanitaria internacional",
        "Especialización en el extranjero",
      ],
    },
    alumniSuccess: {
      notableAlumni: [
        "Dr. Alejandro Bruhn - Jefe de Medicina Intensiva UC",
        "Dra. María Elena Santolaya - Ex Ministra de Salud",
        "Dr. Ricardo Ronco - Cardiólogo Intervencionista reconocido",
        "Dra. Claudia Bambs - Investigadora Universidad de Pittsburgh",
      ],
      averageTimeToEmployment: "Inmediato (100% empleabilidad)",
      employerSatisfaction: "9.5/10 según encuesta a directores médicos 2023",
    },
  },
  {
    id: "arquitectura",
    name: "Arquitectura",
    faculty: "Facultad de Arquitectura y Arte",
    duration: 6,
    campus: ["Santiago", "Concepción"],
    description:
      "Forma arquitectos creativos y técnicamente competentes, capaces de diseñar espacios habitables que respondan a las necesidades sociales y ambientales.",
    detailedDescription:
      "La carrera de Arquitectura de la UDD forma profesionales con una visión integral del diseño arquitectónico, combinando creatividad, técnica y responsabilidad social. Nuestros estudiantes desarrollan competencias para crear espacios habitables innovadores, sostenibles y culturalmente relevantes. El programa integra teoría, práctica y tecnología de vanguardia, preparando arquitectos capaces de responder a los desafíos contemporáneos del diseño urbano y la construcción sustentable.",
    missionStatement:
      "Formar arquitectos creativos, técnicamente competentes y socialmente responsables, capaces de diseñar espacios que mejoren la calidad de vida y contribuyan al desarrollo sostenible de nuestras ciudades y comunidades.",
    admissionRequirements: {
      psu: 620,
      ranking: 70,
      nem: 6.0,
      specificRequirements: [
        "Prueba de Habilidades Espaciales",
        "Portafolio creativo (dibujos, fotografías, proyectos)",
        "Entrevista personal",
        "Test de percepción visual",
        "Carta de motivación",
      ],
    },
    curriculum: {
      basicSciences: [
        "Matemáticas Aplicadas a la Arquitectura",
        "Física de la Construcción",
        "Geometría Descriptiva",
        "Cálculo Estructural",
        "Materiales de Construcción",
        "Topografía",
      ],
      specialty: [
        "Taller de Diseño Arquitectónico I-VIII",
        "Historia de la Arquitectura",
        "Teoría de la Arquitectura",
        "Urbanismo y Planificación",
        "Construcción y Tecnología",
        "Estructuras",
        "Instalaciones",
        "Arquitectura Sustentable",
        "Diseño Bioclimático",
        "Patrimonio Arquitectónico",
        "Paisajismo",
        "Diseño Interior",
      ],
      electives: [
        "Arquitectura Digital y Paramétrica",
        "Restauración Patrimonial",
        "Arquitectura de Emergencia",
        "Diseño Universal",
        "Arquitectura Vernácula",
        "Fotografía Arquitectónica",
        "Maquetería Avanzada",
        "Gestión Inmobiliaria",
      ],
      practicalExperience: [
        "Práctica Profesional I (Oficina de Arquitectura)",
        "Práctica Profesional II (Obra en Construcción)",
        "Talleres de Construcción Real",
        "Proyectos Comunitarios",
        "Concursos de Arquitectura",
        "Workshops Internacionales",
      ],
      thesis: "Proyecto de Título: Diseño arquitectónico integral con investigación teórica y propuesta innovadora",
    },
    employabilityRate: 85,
    averageSalary: {
      entry: 1500000,
      mid: 2500000,
      senior: 4000000,
    },
    skills: [
      "Diseño Arquitectónico Creativo",
      "Visualización Espacial",
      "Comunicación Visual",
      "Gestión de Proyectos",
      "Pensamiento Sistémico",
      "Resolución Creativa de Problemas",
      "Trabajo Colaborativo",
      "Sensibilidad Estética",
      "Conocimiento Técnico-Constructivo",
      "Sostenibilidad Ambiental",
    ],
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
      "Arquitecto Paisajista",
      "Arquitecto Sustentable",
      "Director de Obra",
      "Académico en Arquitectura",
    ],
    relatedFields: ["Construcción", "Inmobiliario", "Urbanismo", "Diseño", "Patrimonio", "Sustentabilidad"],
    industryOutlook: {
      growthRate: "6-10% anual",
      demandLevel: "Media-Alta - Crecimiento urbano sostenido",
      futureProspects: "Buenas perspectivas con énfasis en sustentabilidad y renovación urbana",
      keyTrends: [
        "Arquitectura sustentable y certificaciones verdes",
        "Diseño bioclimático y eficiencia energética",
        "Tecnología BIM y diseño paramétrico",
        "Arquitectura modular y prefabricada",
        "Espacios flexibles y adaptables",
        "Integración de smart technologies",
        "Renovación urbana y densificación",
      ],
    },
    academicExcellence: {
      accreditation: [
        "Acreditación CNA-Chile: 5 años",
        "ASINEA (Asociación de Instituciones de Enseñanza de la Arquitectura)",
        "UIA (Unión Internacional de Arquitectos)",
      ],
      rankings: [
        "#3 Arquitectura Chile - Ranking América Economía",
        "Top 5 Diseño Latinoamérica - QS Rankings",
        "Reconocimiento Colegio de Arquitectos de Chile",
      ],
      researchAreas: [
        "Arquitectura Sustentable",
        "Patrimonio y Conservación",
        "Diseño Urbano",
        "Tecnología de la Construcción",
        "Habitabilidad y Confort",
        "Arquitectura Social",
      ],
      internationalExchange: [
        "Politecnico di Milano, Italia",
        "ETH Zurich, Suiza",
        "Universidad Politécnica de Cataluña, España",
        "TU Delft, Países Bajos",
        "Universidad de São Paulo, Brasil",
      ],
    },
    studentLife: {
      clubs: [
        "Centro de Estudiantes de Arquitectura",
        "Taller de Maquetas",
        "Club de Fotografía Arquitectónica",
        "Grupo de Patrimonio",
        "Sociedad de Arquitectura Sustentable",
        "Club de Urbanismo",
      ],
      competitions: [
        "Bienal de Arquitectura Joven",
        "Concurso Nacional de Estudiantes de Arquitectura",
        "Solar Decathlon",
        "Concursos CAD",
        "Festival de Arquitectura Emergente",
      ],
      networking: [
        "Conferencias magistrales con arquitectos destacados",
        "Visitas a obras emblemáticas",
        "Encuentros con oficinas de arquitectura",
        "Exposiciones y muestras estudiantiles",
        "Networking con egresados",
      ],
    },
    graduateProfile: {
      competencies: [
        "Diseño arquitectónico integral y creativo",
        "Planificación y gestión de proyectos",
        "Conocimiento técnico-constructivo avanzado",
        "Sensibilidad patrimonial y cultural",
        "Competencias en sustentabilidad",
        "Liderazgo de equipos multidisciplinarios",
      ],
      values: [
        "Creatividad e innovación",
        "Responsabilidad social y ambiental",
        "Excelencia en el diseño",
        "Respeto por el patrimonio cultural",
        "Compromiso con la calidad de vida urbana",
        "Ética profesional",
      ],
      differentiators: [
        "Formación integral teórico-práctica",
        "Enfoque en sustentabilidad desde primer año",
        "Conexión directa con la industria",
        "Talleres de construcción real",
        "Proyectos con impacto social",
        "Tecnología de vanguardia en diseño",
      ],
    },
    careerPaths: {
      traditional: [
        "Arquitecto en oficinas establecidas",
        "Arquitecto en empresas constructoras",
        "Consultor en proyectos inmobiliarios",
        "Arquitecto en sector público",
      ],
      entrepreneurial: [
        "Oficina de arquitectura propia",
        "Consultoría especializada",
        "Desarrollo inmobiliario",
        "Innovación en construcción",
      ],
      academic: [
        "Investigador en arquitectura",
        "Docente universitario",
        "Investigador en centros especializados",
        "Estudios de posgrado",
      ],
      international: [
        "Arquitecto en oficinas internacionales",
        "Consultor en proyectos globales",
        "Especialización internacional",
        "Cooperación en desarrollo urbano",
      ],
    },
    alumniSuccess: {
      notableAlumni: [
        "Arq. Sebastián Irarrázaval - Premio Nacional de Arquitectura",
        "Arq. Alejandro Aravena - Premio Pritzker 2016",
        "Arq. Smiljan Radic - Reconocimiento internacional",
        "Arq. Mathias Klotz - Arquitecto destacado",
      ],
      averageTimeToEmployment: "4-6 meses post-graduación",
      employerSatisfaction: "8.5/10 según encuesta a empleadores 2023",
    },
  },
  {
    id: "ingenieria-comercial",
    name: "Ingeniería Comercial",
    faculty: "Facultad de Economía y Negocios",
    duration: 5,
    campus: ["Santiago", "Concepción"],
    description:
      "Forma profesionales con sólida formación en gestión empresarial, finanzas y estrategia, preparados para liderar organizaciones en un entorno globalizado.",
    detailedDescription:
      "La carrera de Ingeniería Comercial de la UDD forma líderes empresariales con una visión integral de los negocios, combinando rigor analítico, creatividad estratégica y responsabilidad social. Nuestros estudiantes desarrollan competencias avanzadas en finanzas, marketing, operaciones y gestión de personas, preparándolos para liderar la transformación de organizaciones en un entorno global y digitalizado. El programa integra teoría de vanguardia con práctica empresarial real.",
    missionStatement:
      "Formar ingenieros comerciales líderes, con excelencia técnica, visión estratégica y compromiso ético, capaces de crear valor sostenible y liderar la transformación empresarial en un mundo globalizado.",
    admissionRequirements: {
      psu: 680,
      ranking: 75,
      nem: 6.2,
      specificRequirements: [
        "Matemática: Puntaje mínimo 650",
        "Lenguaje: Puntaje mínimo 600",
        "Entrevista de liderazgo",
        "Test de habilidades analíticas",
        "Experiencia en liderazgo (recomendada)",
      ],
    },
    curriculum: {
      basicSciences: [
        "Matemáticas para Ingenieros I y II",
        "Cálculo Aplicado",
        "Estadística y Probabilidades",
        "Investigación de Operaciones",
        "Econometría",
        "Métodos Cuantitativos",
      ],
      specialty: [
        "Microeconomía y Macroeconomía",
        "Contabilidad Financiera y Gerencial",
        "Finanzas Corporativas",
        "Marketing Estratégico",
        "Gestión de Operaciones",
        "Recursos Humanos y Liderazgo",
        "Estrategia Empresarial",
        "Emprendimiento e Innovación",
        "Gestión de Proyectos",
        "Análisis de Inversiones",
        "Marketing Digital",
        "Gestión de la Cadena de Suministro",
      ],
      electives: [
        "Comercio Internacional",
        "Fintech y Banca Digital",
        "Sostenibilidad Empresarial",
        "Transformación Digital",
        "Consultoría Estratégica",
        "Private Equity y Venture Capital",
        "E-commerce y Retail",
        "Gestión de Riesgos",
      ],
      practicalExperience: [
        "Práctica Profesional I (Empresa)",
        "Práctica Profesional II (Consultoría)",
        "Proyectos con empresas reales",
        "Simuladores de negocios",
        "Competencias empresariales",
        "Incubadora de startups",
      ],
      thesis: "Proyecto de Título: Plan de negocios o consultoría estratégica para empresa real",
    },
    employabilityRate: 92,
    averageSalary: {
      entry: 1600000,
      mid: 2800000,
      senior: 5000000,
    },
    skills: [
      "Liderazgo Estratégico",
      "Análisis Financiero Avanzado",
      "Negociación Empresarial",
      "Pensamiento Estratégico",
      "Comunicación Ejecutiva",
      "Gestión de Equipos",
      "Análisis de Datos",
      "Innovación y Creatividad",
      "Visión Global de Negocios",
      "Toma de Decisiones",
    ],
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
      "Analista Financiero Senior",
      "Product Manager",
      "Emprendedor",
      "Director Comercial",
      "Gerente de Marketing",
      "Analista de Inversiones",
      "Gerente de Operaciones",
      "Director de Innovación",
    ],
    relatedFields: ["Negocios", "Consultoría", "Finanzas", "Emprendimiento", "Marketing", "Estrategia"],
    industryOutlook: {
      growthRate: "10-15% anual",
      demandLevel: "Muy Alta - Transformación digital empresarial",
      futureProspects: "Excelentes con la necesidad de líderes en transformación empresarial",
      keyTrends: [
        "Transformación digital empresarial",
        "Sostenibilidad y ESG",
        "Fintech y nuevas tecnologías financieras",
        "E-commerce y omnicanalidad",
        "Análisis de big data y business intelligence",
        "Agilidad organizacional",
        "Liderazgo remoto y híbrido",
      ],
    },
    academicExcellence: {
      accreditation: [
        "Acreditación CNA-Chile: 6 años",
        "AACSB (Association to Advance Collegiate Schools of Business)",
        "EQUIS (European Quality Improvement System)",
      ],
      rankings: [
        "#1 Ingeniería Comercial Chile - Ranking QS 2023",
        "Top 3 Business Schools Latinoamérica - Financial Times",
        "Excelencia en Empleabilidad - América Economía",
      ],
      researchAreas: [
        "Estrategia y Competitividad",
        "Finanzas Corporativas",
        "Marketing Digital",
        "Emprendimiento e Innovación",
        "Sostenibilidad Empresarial",
        "Transformación Digital",
      ],
      internationalExchange: [
        "ESADE Business School, España",
        "HEC Paris, Francia",
        "University of Pennsylvania (Wharton), USA",
        "London Business School, Reino Unido",
        "INSEAD, Francia/Singapur",
      ],
    },
    studentLife: {
      clubs: [
        "Centro de Estudiantes de Ingeniería Comercial",
        "Club de Inversiones",
        "Sociedad de Emprendimiento",
        "Club de Marketing",
        "Grupo de Consultoría Estudiantil",
        "Club de Finanzas",
      ],
      competitions: [
        "Competencia Nacional de Casos de Negocios",
        "Global Management Challenge",
        "CFA Institute Research Challenge",
        "Startup Competition UDD",
        "Marketing Challenge",
        "Hult Prize",
      ],
      networking: [
        "CEO Talks mensuales",
        "Networking con ejecutivos",
        "Alumni Mentorship Program",
        "Business Breakfast",
        "Conferencias de liderazgo",
      ],
    },
    graduateProfile: {
      competencies: [
        "Liderazgo estratégico y transformacional",
        "Análisis financiero y evaluación de inversiones",
        "Gestión integral de organizaciones",
        "Innovación y emprendimiento",
        "Negociación y comunicación ejecutiva",
        "Visión global y competencias interculturales",
      ],
      values: [
        "Liderazgo ético y responsable",
        "Excelencia y orientación a resultados",
        "Innovación y creatividad",
        "Responsabilidad social empresarial",
        "Integridad y transparencia",
        "Colaboración y trabajo en equipo",
      ],
      differentiators: [
        "Formación integral en todas las áreas de negocio",
        "Experiencia práctica desde primer año",
        "Red de contactos empresariales",
        "Enfoque en liderazgo y emprendimiento",
        "Preparación para mercados globales",
        "Competencias digitales avanzadas",
      ],
    },
    careerPaths: {
      traditional: [
        "Ejecutivo en grandes corporaciones",
        "Consultor en firmas especializadas",
        "Analista financiero en bancos",
        "Gerente en empresas multinacionales",
      ],
      entrepreneurial: [
        "Fundador de startup",
        "Consultor independiente",
        "Inversionista ángel",
        "Director de innovación",
      ],
      academic: [
        "Investigador en negocios",
        "Profesor universitario",
        "Consultor académico",
        "Estudios de MBA/Doctorado",
      ],
      international: [
        "Ejecutivo en empresas globales",
        "Consultor internacional",
        "Gerente de mercados internacionales",
        "MBA en universidades top mundial",
      ],
    },
    alumniSuccess: {
      notableAlumni: [
        "Andrés Navarro - CEO Tottus",
        "María José Zaldívar - Ministra del Trabajo",
        "Felipe Larraín - Ex Ministro de Hacienda",
        "Cristián Rodríguez - CEO Banco de Chile",
      ],
      averageTimeToEmployment: "1-2 meses post-graduación",
      employerSatisfaction: "9.1/10 según encuesta a empleadores 2023",
    },
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
