export interface Bachillerato {
  id: string
  nombre: string
  area: string
  modalidad: string
  duracion: number
  descripcion: string
  descripcionDetallada: string
  planEstudios: {
    formacionGeneral: string[]
    especialidad: string[]
    electivos: string[]
  }
  empleabilidad: number
  continuidadEducativa: number
  salarioPromedio: number
  habilidades: string[]
  personalityMatch: {
    openness: number
    conscientiousness: number
    extraversion: number
    agreeableness: number
    neuroticism: number
  }
  carrerasRelacionadas: string[]
  oportunidadesLaborales: string[]
  requisitosIngreso: {
    notaMinima: number
    requisitosEspecificos: string[]
  }
  instituciones: string[]
  consejosEstudio: string
  proximosPasos: string
  ventajas: string[]
  desafios: string[]
}

export const bachilleratos: Bachillerato[] = [
  {
    id: "cientifico-humanista",
    nombre: "Bachillerato Científico-Humanista",
    area: "Ciencias y Humanidades",
    modalidad: "Presencial",
    duracion: 4,
    descripcion:
      "Formación integral que prepara para el ingreso a la educación superior con énfasis en ciencias y humanidades.",
    descripcionDetallada:
      "El Bachillerato Científico-Humanista es la modalidad tradicional de educación media que proporciona una formación integral y equilibrada en todas las áreas del conocimiento. Está diseñado específicamente para preparar a los estudiantes para el ingreso a la educación superior, desarrollando competencias académicas sólidas, pensamiento crítico y habilidades de investigación. Los estudiantes reciben una base amplia en ciencias naturales, matemáticas, lenguaje, historia, filosofía y artes, lo que les permite explorar diferentes áreas de interés antes de especializarse en la educación superior.",
    planEstudios: {
      formacionGeneral: [
        "Lenguaje y Comunicación",
        "Matemática",
        "Historia, Geografía y Ciencias Sociales",
        "Ciencias Naturales (Biología, Física, Química)",
        "Inglés",
        "Educación Física y Salud",
        "Artes Visuales o Musicales",
        "Tecnología",
        "Religión o Filosofía",
      ],
      especialidad: [
        "Matemática Avanzada",
        "Lenguaje y Literatura",
        "Historia y Ciencias Sociales",
        "Biología Avanzada",
        "Física Avanzada",
        "Química Avanzada",
        "Filosofía y Psicología",
        "Economía y Sociedad",
      ],
      electivos: [
        "Literatura e Identidad",
        "Argumentación",
        "Comprensión Histórica del Presente",
        "Geografía, Territorio y Desafíos Socioambientales",
        "Educación Ciudadana",
        "Filosofía Política",
        "Geometría 3D",
        "Probabilidades y Estadística Descriptiva e Inferencial",
        "Ciencias de la Salud",
        "Ciencias del Ejercicio Físico y Deportivo",
      ],
    },
    empleabilidad: 75,
    continuidadEducativa: 85,
    salarioPromedio: 800000,
    habilidades: [
      "Pensamiento Crítico",
      "Análisis y Síntesis",
      "Comunicación Oral y Escrita",
      "Resolución de Problemas",
      "Investigación",
      "Trabajo Colaborativo",
      "Creatividad",
      "Liderazgo",
      "Adaptabilidad",
      "Gestión del Tiempo",
    ],
    personalityMatch: {
      openness: 0.8,
      conscientiousness: 0.7,
      extraversion: 0.6,
      agreeableness: 0.6,
      neuroticism: 0.4,
    },
    carrerasRelacionadas: [
      "Medicina",
      "Ingeniería Civil",
      "Derecho",
      "Psicología",
      "Arquitectura",
      "Periodismo",
      "Pedagogía",
      "Administración de Empresas",
      "Economía",
      "Filosofía",
      "Historia",
      "Biología",
      "Química",
      "Física",
      "Matemática",
    ],
    oportunidadesLaborales: [
      "Asistente Administrativo",
      "Vendedor Especializado",
      "Tutor Académico",
      "Asistente de Investigación",
      "Coordinador de Eventos",
      "Asistente de Marketing",
      "Recepcionista Bilingüe",
      "Asistente Contable",
    ],
    requisitosIngreso: {
      notaMinima: 5.0,
      requisitosEspecificos: [
        "Certificado de Estudios de 8° Básico",
        "Entrevista con el estudiante y apoderado",
        "Evaluación diagnóstica (opcional)",
        "Documentos de identidad al día",
      ],
    },
    instituciones: [
      "Liceos Públicos",
      "Colegios Particulares Subvencionados",
      "Colegios Particulares Pagados",
      "Liceos Bicentenario",
      "Colegios de Excelencia Académica",
    ],
    consejosEstudio:
      "Mantén un equilibrio entre todas las asignaturas, desarrolla hábitos de estudio constantes, participa activamente en clases, forma grupos de estudio, utiliza recursos digitales complementarios y prepárate temprano para la PSU/PAES. Es fundamental desarrollar habilidades de escritura y lectura comprensiva.",
    proximosPasos:
      "Al finalizar, podrás postular a cualquier carrera universitaria. Te recomendamos investigar las carreras de tu interés, participar en ferias vocacionales, realizar tests de orientación vocacional y considerar realizar cursos preuniversitarios para mejorar tus puntajes en las pruebas de admisión.",
    ventajas: [
      "Preparación integral para la universidad",
      "Amplio abanico de opciones futuras",
      "Desarrollo del pensamiento crítico",
      "Base sólida en todas las áreas del conocimiento",
      "Mayor flexibilidad para cambiar de intereses",
    ],
    desafios: [
      "Alta carga académica",
      "Competencia intensa para ingresar a universidades",
      "Necesidad de autodisciplina",
      "Presión por obtener buenos puntajes PSU/PAES",
    ],
  },
  {
    id: "tecnico-administracion",
    nombre: "Técnico en Administración",
    area: "Administración y Comercio",
    modalidad: "Técnico-Profesional",
    duracion: 4,
    descripcion:
      "Formación especializada en gestión empresarial, contabilidad y administración de recursos organizacionales.",
    descripcionDetallada:
      "El Bachillerato Técnico en Administración forma profesionales técnicos capacitados para desempeñarse en diversas áreas de la gestión empresarial. Los estudiantes desarrollan competencias en administración de recursos humanos, contabilidad, marketing, gestión de proyectos y atención al cliente. Esta modalidad combina una sólida formación general con especialización técnica, preparando a los egresados tanto para el mundo laboral inmediato como para continuar estudios superiores en áreas relacionadas con la administración y los negocios.",
    planEstudios: {
      formacionGeneral: [
        "Lenguaje y Comunicación",
        "Matemática",
        "Historia, Geografía y Ciencias Sociales",
        "Ciencias Naturales",
        "Inglés",
        "Educación Física y Salud",
        "Artes",
        "Tecnología",
      ],
      especialidad: [
        "Contabilidad General",
        "Administración de Empresas",
        "Recursos Humanos",
        "Marketing y Ventas",
        "Gestión de Proyectos",
        "Atención al Cliente",
        "Legislación Laboral",
        "Emprendimiento",
        "Sistemas de Información",
        "Finanzas Básicas",
      ],
      electivos: [
        "E-commerce",
        "Gestión de Calidad",
        "Logística y Distribución",
        "Comunicación Organizacional",
        "Liderazgo y Trabajo en Equipo",
        "Negociación Comercial",
        "Análisis Financiero",
        "Gestión de Inventarios",
      ],
    },
    empleabilidad: 88,
    continuidadEducativa: 65,
    salarioPromedio: 650000,
    habilidades: [
      "Gestión Administrativa",
      "Contabilidad Básica",
      "Atención al Cliente",
      "Comunicación Empresarial",
      "Trabajo en Equipo",
      "Organización y Planificación",
      "Uso de Software Administrativo",
      "Análisis de Datos",
      "Negociación",
      "Liderazgo",
    ],
    personalityMatch: {
      openness: 0.6,
      conscientiousness: 0.8,
      extraversion: 0.7,
      agreeableness: 0.7,
      neuroticism: 0.3,
    },
    carrerasRelacionadas: [
      "Ingeniería Comercial",
      "Administración de Empresas",
      "Contabilidad y Auditoría",
      "Recursos Humanos",
      "Marketing",
      "Comercio Internacional",
      "Gestión Pública",
      "Turismo y Hotelería",
    ],
    oportunidadesLaborales: [
      "Asistente Administrativo",
      "Asistente Contable",
      "Ejecutivo de Ventas Junior",
      "Coordinador de Recursos Humanos",
      "Asistente de Marketing",
      "Supervisor de Atención al Cliente",
      "Asistente de Gerencia",
      "Coordinador de Proyectos",
      "Analista de Datos Junior",
      "Emprendedor",
    ],
    requisitosIngreso: {
      notaMinima: 5.5,
      requisitosEspecificos: [
        "Certificado de Estudios de 8° Básico",
        "Entrevista vocacional",
        "Test de habilidades matemáticas básicas",
        "Carta de motivación",
        "Recomendación académica",
      ],
    },
    instituciones: [
      "Liceos Técnico-Profesionales",
      "Centros de Formación Técnica",
      "Colegios Técnicos Particulares",
      "Institutos Profesionales con Educación Media",
      "Corporaciones Educacionales",
    ],
    consejosEstudio:
      "Enfócate en desarrollar habilidades prácticas, mantén al día tus conocimientos en software administrativo, participa en simulaciones empresariales, busca oportunidades de práctica en empresas locales y desarrolla habilidades de comunicación y liderazgo.",
    proximosPasos:
      "Puedes ingresar directamente al mercado laboral o continuar estudios en carreras técnicas superiores o universitarias relacionadas. Te recomendamos realizar prácticas profesionales, obtener certificaciones adicionales en software especializado y considerar estudios de especialización.",
    ventajas: [
      "Rápida inserción laboral",
      "Habilidades prácticas valoradas por empresas",
      "Posibilidad de emprendimiento",
      "Base sólida para estudios superiores en administración",
      "Versatilidad en diferentes sectores económicos",
    ],
    desafios: [
      "Competencia en el mercado laboral",
      "Necesidad de actualización constante",
      "Salarios iniciales moderados",
      "Requerimiento de experiencia práctica",
    ],
  },
  {
    id: "tecnico-informatica",
    nombre: "Técnico en Informática",
    area: "Tecnología",
    modalidad: "Técnico-Profesional",
    duracion: 4,
    descripcion:
      "Especialización en tecnologías de la información, programación, redes y soporte técnico computacional.",
    descripcionDetallada:
      "El Bachillerato Técnico en Informática prepara profesionales técnicos especializados en el área de tecnologías de la información y comunicación. Los estudiantes desarrollan competencias en programación, administración de redes, soporte técnico, desarrollo web, bases de datos y ciberseguridad básica. Esta formación responde a la alta demanda del mercado laboral en el sector tecnológico, proporcionando tanto habilidades técnicas específicas como una base sólida para continuar estudios superiores en ingeniería informática o carreras afines.",
    planEstudios: {
      formacionGeneral: [
        "Lenguaje y Comunicación",
        "Matemática",
        "Historia, Geografía y Ciencias Sociales",
        "Ciencias Naturales",
        "Inglés Técnico",
        "Educación Física y Salud",
        "Artes Digitales",
      ],
      especialidad: [
        "Fundamentos de Programación",
        "Desarrollo Web (HTML, CSS, JavaScript)",
        "Bases de Datos",
        "Redes de Computadores",
        "Sistemas Operativos",
        "Soporte Técnico",
        "Seguridad Informática",
        "Desarrollo de Aplicaciones Móviles",
        "Gestión de Proyectos TI",
        "Hardware y Mantenimiento",
      ],
      electivos: [
        "Inteligencia Artificial Básica",
        "Desarrollo de Videojuegos",
        "Diseño UX/UI",
        "Cloud Computing",
        "Internet of Things (IoT)",
        "Blockchain Básico",
        "Automatización y Robótica",
        "Análisis de Datos",
      ],
    },
    empleabilidad: 92,
    continuidadEducativa: 70,
    salarioPromedio: 750000,
    habilidades: [
      "Programación",
      "Resolución de Problemas Técnicos",
      "Pensamiento Lógico",
      "Trabajo con Tecnología",
      "Análisis de Sistemas",
      "Comunicación Técnica",
      "Aprendizaje Continuo",
      "Trabajo en Equipo",
      "Creatividad Digital",
      "Gestión de Proyectos",
    ],
    personalityMatch: {
      openness: 0.8,
      conscientiousness: 0.7,
      extraversion: 0.5,
      agreeableness: 0.6,
      neuroticism: 0.3,
    },
    carrerasRelacionadas: [
      "Ingeniería Civil en Informática",
      "Ingeniería en Sistemas",
      "Ciencias de la Computación",
      "Desarrollo de Software",
      "Ciberseguridad",
      "Análisis de Sistemas",
      "Ingeniería en Redes",
      "Diseño Digital",
    ],
    oportunidadesLaborales: [
      "Programador Junior",
      "Soporte Técnico",
      "Administrador de Redes",
      "Desarrollador Web",
      "Técnico en Mantención de Equipos",
      "Asistente de Sistemas",
      "Desarrollador de Apps Móviles",
      "Analista de Datos Junior",
      "Técnico en Ciberseguridad",
      "Freelancer en Desarrollo",
    ],
    requisitosIngreso: {
      notaMinima: 5.5,
      requisitosEspecificos: [
        "Certificado de Estudios de 8° Básico",
        "Evaluación de habilidades lógico-matemáticas",
        "Test de aptitudes tecnológicas",
        "Entrevista vocacional",
        "Conocimientos básicos de computación",
      ],
    },
    instituciones: [
      "Liceos Técnico-Profesionales",
      "Centros de Formación Técnica",
      "Institutos Tecnológicos",
      "Colegios con Especialización Tecnológica",
      "Academias de Programación",
    ],
    consejosEstudio:
      "Practica programación diariamente, mantente actualizado con las últimas tecnologías, participa en proyectos colaborativos, desarrolla un portafolio de proyectos personales, únete a comunidades de desarrolladores y considera obtener certificaciones adicionales en tecnologías específicas.",
    proximosPasos:
      "Puedes trabajar inmediatamente como técnico o continuar estudios superiores. Te recomendamos crear un portafolio en GitHub, participar en hackathons, realizar cursos online especializados y considerar certificaciones internacionales como CompTIA o Cisco.",
    ventajas: [
      "Alta demanda laboral",
      "Salarios competitivos desde el inicio",
      "Posibilidad de trabajo remoto",
      "Constante innovación y aprendizaje",
      "Oportunidades de emprendimiento tecnológico",
    ],
    desafios: [
      "Necesidad de actualización constante",
      "Tecnología en rápida evolución",
      "Competencia con profesionales universitarios",
      "Requerimiento de aprendizaje autodidacta",
    ],
  },
  {
    id: "artistico",
    nombre: "Bachillerato Artístico",
    area: "Artes y Cultura",
    modalidad: "Artístico",
    duracion: 4,
    descripcion:
      "Formación especializada en artes visuales, música, teatro y danza, desarrollando la creatividad y expresión artística.",
    descripcionDetallada:
      "El Bachillerato Artístico está diseñado para estudiantes con talento e interés en las artes, proporcionando una formación integral que combina la educación general con una especialización profunda en disciplinas artísticas. Los estudiantes pueden elegir entre diferentes menciones como artes visuales, música, teatro o danza, desarrollando tanto habilidades técnicas como creatividad, expresión personal y apreciación estética. Esta modalidad prepara para estudios superiores en artes o para una inserción directa en el ámbito cultural y creativo.",
    planEstudios: {
      formacionGeneral: [
        "Lenguaje y Comunicación",
        "Matemática",
        "Historia, Geografía y Ciencias Sociales",
        "Ciencias Naturales",
        "Inglés",
        "Educación Física y Salud",
        "Filosofía",
      ],
      especialidad: [
        "Historia del Arte",
        "Teoría del Color",
        "Técnicas de Dibujo y Pintura",
        "Escultura y Modelado",
        "Fotografía Artística",
        "Arte Digital",
        "Música (Teoría y Práctica)",
        "Teatro y Actuación",
        "Danza y Expresión Corporal",
        "Gestión Cultural",
      ],
      electivos: [
        "Cine y Audiovisual",
        "Diseño Gráfico",
        "Ilustración",
        "Cerámica",
        "Grabado",
        "Performance Art",
        "Composición Musical",
        "Dirección Teatral",
        "Coreografía",
        "Arte Terapia",
      ],
    },
    empleabilidad: 70,
    continuidadEducativa: 80,
    salarioPromedio: 600000,
    habilidades: [
      "Creatividad",
      "Expresión Artística",
      "Sensibilidad Estética",
      "Comunicación Visual",
      "Trabajo Colaborativo",
      "Pensamiento Crítico",
      "Innovación",
      "Disciplina y Constancia",
      "Adaptabilidad",
      "Gestión de Proyectos Creativos",
    ],
    personalityMatch: {
      openness: 0.9,
      conscientiousness: 0.6,
      extraversion: 0.7,
      agreeableness: 0.7,
      neuroticism: 0.5,
    },
    carrerasRelacionadas: [
      "Artes Visuales",
      "Diseño Gráfico",
      "Arquitectura",
      "Música",
      "Teatro",
      "Danza",
      "Cine y Televisión",
      "Fotografía",
      "Diseño Industrial",
      "Historia del Arte",
      "Gestión Cultural",
      "Arte Terapia",
    ],
    oportunidadesLaborales: [
      "Artista Independiente",
      "Asistente de Galería",
      "Profesor de Arte",
      "Diseñador Freelance",
      "Fotógrafo",
      "Músico",
      "Actor/Actriz",
      "Bailarín/Bailarina",
      "Asistente de Producción",
      "Gestor Cultural",
      "Ilustrador",
      "Animador Digital",
    ],
    requisitosIngreso: {
      notaMinima: 5.0,
      requisitosEspecificos: [
        "Certificado de Estudios de 8° Básico",
        "Portafolio artístico",
        "Audición o prueba práctica según especialidad",
        "Entrevista vocacional",
        "Carta de motivación artística",
      ],
    },
    instituciones: [
      "Liceos Artísticos",
      "Colegios con Mención Artística",
      "Conservatorios",
      "Escuelas de Arte",
      "Centros Culturales con Educación Media",
    ],
    consejosEstudio:
      "Practica tu disciplina artística diariamente, visita museos y exposiciones, participa en concursos y festivales, desarrolla un portafolio sólido, colabora con otros artistas y mantente abierto a diferentes corrientes artísticas. La constancia y la experimentación son clave.",
    proximosPasos:
      "Puedes continuar estudios superiores en artes o ingresar al mundo laboral creativo. Te recomendamos participar en exposiciones estudiantiles, crear un portafolio profesional, buscar mentores en tu área artística y considerar estudios complementarios en gestión cultural o emprendimiento creativo.",
    ventajas: [
      "Desarrollo de la creatividad personal",
      "Formación en disciplinas únicas",
      "Posibilidad de trabajo independiente",
      "Contribución al patrimonio cultural",
      "Flexibilidad laboral y horaria",
    ],
    desafios: [
      "Mercado laboral competitivo",
      "Ingresos variables e inciertos",
      "Necesidad de constante perfeccionamiento",
      "Requerimiento de promoción personal",
    ],
  },
  {
    id: "tecnico-enfermeria",
    nombre: "Técnico en Enfermería",
    area: "Salud",
    modalidad: "Técnico-Profesional",
    duracion: 4,
    descripcion: "Formación especializada en cuidados de salud, asistencia sanitaria y apoyo al equipo médico.",
    descripcionDetallada:
      "El Bachillerato Técnico en Enfermería forma profesionales técnicos especializados en el cuidado de la salud y la asistencia sanitaria. Los estudiantes desarrollan competencias para brindar cuidados básicos de enfermería, asistir en procedimientos médicos, administrar medicamentos bajo supervisión, y proporcionar apoyo emocional a pacientes y familias. Esta formación combina conocimientos teóricos sólidos en ciencias de la salud con práctica clínica intensiva, preparando técnicos competentes para trabajar en hospitales, clínicas, centros de salud y atención domiciliaria.",
    planEstudios: {
      formacionGeneral: [
        "Lenguaje y Comunicación",
        "Matemática",
        "Historia, Geografía y Ciencias Sociales",
        "Ciencias Naturales",
        "Inglés",
        "Educación Física y Salud",
        "Ética y Filosofía",
      ],
      especialidad: [
        "Anatomía y Fisiología",
        "Fundamentos de Enfermería",
        "Farmacología Básica",
        "Cuidados de Enfermería",
        "Primeros Auxilios",
        "Salud Mental",
        "Enfermería Materno-Infantil",
        "Enfermería Médico-Quirúrgica",
        "Geriatría y Gerontología",
        "Bioética y Legislación Sanitaria",
      ],
      electivos: [
        "Enfermería de Urgencia",
        "Cuidados Paliativos",
        "Enfermería Comunitaria",
        "Rehabilitación",
        "Nutrición y Dietética",
        "Kinesiología Básica",
        "Psicología de la Salud",
        "Administración en Salud",
      ],
    },
    empleabilidad: 95,
    continuidadEducativa: 60,
    salarioPromedio: 700000,
    habilidades: [
      "Cuidado y Atención al Paciente",
      "Comunicación Empática",
      "Trabajo bajo Presión",
      "Trabajo en Equipo Multidisciplinario",
      "Observación Clínica",
      "Destreza Manual",
      "Responsabilidad y Ética",
      "Organización y Planificación",
      "Resistencia Física y Emocional",
      "Toma de Decisiones Rápidas",
    ],
    personalityMatch: {
      openness: 0.6,
      conscientiousness: 0.9,
      extraversion: 0.7,
      agreeableness: 0.9,
      neuroticism: 0.2,
    },
    carrerasRelacionadas: [
      "Enfermería",
      "Medicina",
      "Kinesiología",
      "Terapia Ocupacional",
      "Nutrición y Dietética",
      "Psicología",
      "Trabajo Social",
      "Tecnología Médica",
      "Obstetricia",
    ],
    oportunidadesLaborales: [
      "Técnico en Enfermería Hospitalaria",
      "Técnico en Atención Primaria",
      "Cuidador Domiciliario",
      "Técnico en Urgencias",
      "Asistente en Consultas Médicas",
      "Técnico en Geriatría",
      "Asistente en Cirugía",
      "Técnico en Maternidad",
      "Cuidador en Residencias",
      "Técnico en Salud Mental",
    ],
    requisitosIngreso: {
      notaMinima: 5.5,
      requisitosEspecificos: [
        "Certificado de Estudios de 8° Básico",
        "Examen médico completo",
        "Vacunas al día",
        "Entrevista vocacional",
        "Test psicológico básico",
        "Certificado de antecedentes",
      ],
    },
    instituciones: [
      "Liceos Técnico-Profesionales de Salud",
      "Centros de Formación Técnica en Salud",
      "Institutos Profesionales de Salud",
      "Colegios con Especialización en Salud",
      "Escuelas de Enfermería",
    ],
    consejosEstudio:
      "Desarrolla habilidades de comunicación empática, practica procedimientos básicos, mantén excelente higiene personal, estudia anatomía constantemente, participa en voluntariados de salud y desarrolla resistencia física y emocional. La vocación de servicio es fundamental.",
    proximosPasos:
      "Puedes trabajar inmediatamente como técnico en enfermería o continuar estudios superiores en enfermería. Te recomendamos realizar prácticas clínicas tempranas, obtener certificaciones adicionales en primeros auxilios y considerar especializaciones técnicas.",
    ventajas: [
      "Alta demanda laboral constante",
      "Trabajo con propósito social",
      "Estabilidad laboral",
      "Posibilidad de especialización",
      "Reconocimiento social de la profesión",
    ],
    desafios: [
      "Trabajo físico y emocionalmente demandante",
      "Horarios rotativos y nocturnos",
      "Exposición a riesgos biológicos",
      "Responsabilidad sobre la vida humana",
    ],
  },
  {
    id: "tecnico-gastronomia",
    nombre: "Técnico en Gastronomía",
    area: "Gastronomía y Turismo",
    modalidad: "Técnico-Profesional",
    duracion: 4,
    descripcion: "Especialización en artes culinarias, gestión gastronómica y servicios de alimentación.",
    descripcionDetallada:
      "El Bachillerato Técnico en Gastronomía forma profesionales especializados en el arte culinario y la gestión de servicios de alimentación. Los estudiantes desarrollan competencias en técnicas culinarias, pastelería, gestión de cocinas, seguridad alimentaria, costos y administración gastronómica. Esta formación combina la creatividad culinaria con conocimientos técnicos y de gestión, preparando profesionales capaces de trabajar en restaurantes, hoteles, catering, y emprender sus propios negocios gastronómicos.",
    planEstudios: {
      formacionGeneral: [
        "Lenguaje y Comunicación",
        "Matemática",
        "Historia, Geografía y Ciencias Sociales",
        "Ciencias Naturales",
        "Inglés",
        "Educación Física y Salud",
        "Artes",
      ],
      especialidad: [
        "Técnicas Culinarias Básicas",
        "Pastelería y Repostería",
        "Gestión de Cocina",
        "Seguridad e Higiene Alimentaria",
        "Costos y Control Gastronómico",
        "Servicio y Atención al Cliente",
        "Nutrición y Dietética",
        "Enología Básica",
        "Cocina Internacional",
        "Emprendimiento Gastronómico",
      ],
      electivos: [
        "Cocina Molecular",
        "Panadería Artesanal",
        "Cocina Vegana y Vegetariana",
        "Barismo y Cafetería",
        "Coctelería",
        "Catering y Eventos",
        "Fotografía Gastronómica",
        "Gestión de Restaurantes",
      ],
    },
    empleabilidad: 85,
    continuidadEducativa: 55,
    salarioPromedio: 650000,
    habilidades: [
      "Creatividad Culinaria",
      "Destreza Manual",
      "Organización y Planificación",
      "Trabajo bajo Presión",
      "Trabajo en Equipo",
      "Atención al Detalle",
      "Innovación Gastronómica",
      "Gestión de Tiempo",
      "Liderazgo de Cocina",
      "Adaptabilidad",
    ],
    personalityMatch: {
      openness: 0.8,
      conscientiousness: 0.7,
      extraversion: 0.6,
      agreeableness: 0.6,
      neuroticism: 0.4,
    },
    carrerasRelacionadas: [
      "Gastronomía Internacional",
      "Administración Gastronómica",
      "Turismo y Hotelería",
      "Nutrición y Dietética",
      "Ingeniería en Alimentos",
      "Diseño Gastronómico",
      "Enología",
      "Gestión de Restaurantes",
    ],
    oportunidadesLaborales: [
      "Chef de Cocina",
      "Pastelero",
      "Cocinero Especializado",
      "Supervisor de Cocina",
      "Encargado de Catering",
      "Consultor Gastronómico",
      "Emprendedor Gastronómico",
      "Chef de Eventos",
      "Instructor Culinario",
      "Food Stylist",
    ],
    requisitosIngreso: {
      notaMinima: 5.0,
      requisitosEspecificos: [
        "Certificado de Estudios de 8° Básico",
        "Examen médico (especialmente alergias alimentarias)",
        "Entrevista vocacional",
        "Prueba práctica básica de cocina",
        "Interés demostrable en gastronomía",
      ],
    },
    instituciones: [
      "Liceos Técnico-Profesionales Gastronómicos",
      "Institutos Gastronómicos",
      "Centros de Formación Culinaria",
      "Escuelas de Chef",
      "Colegios con Especialización Gastronómica",
    ],
    consejosEstudio:
      "Practica técnicas culinarias en casa, experimenta con diferentes ingredientes, mantén excelente higiene personal, desarrolla tu paladar, visita restaurantes diversos, lee sobre gastronomía internacional y mantente actualizado con tendencias culinarias. La pasión por la cocina es esencial.",
    proximosPasos:
      "Puedes trabajar inmediatamente en cocinas o continuar estudios superiores en gastronomía. Te recomendamos realizar prácticas en restaurantes reconocidos, participar en concursos culinarios, crear un portafolio gastronómico y considerar especializaciones internacionales.",
    ventajas: [
      "Campo laboral diverso y creativo",
      "Posibilidad de emprendimiento",
      "Trabajo en industria en crecimiento",
      "Expresión artística a través de la comida",
      "Flexibilidad horaria en algunos casos",
    ],
    desafios: [
      "Horarios extensos e irregulares",
      "Trabajo físicamente demandante",
      "Ambiente de alta presión",
      "Competencia intensa en el sector",
      "Necesidad de constante innovación",
    ],
  },
]

export function getBachilleratoRecommendations(
  personalityResults: Record<string, number> = {},
  userSkills: string[] = [],
  interests: string[] = [],
): Bachillerato[] {
  // Ensure we have valid inputs
  const validPersonalityResults = personalityResults || {}
  const validUserSkills = userSkills || []
  const validInterests = interests || []

  return bachilleratos
    .map((bachillerato) => {
      let score = 0

      // Personality matching (40% weight)
      const personalityEntries = Object.entries(validPersonalityResults)
      if (personalityEntries.length > 0) {
        const personalityScore =
          personalityEntries.reduce((acc, [trait, value]) => {
            const traitKey = trait.toLowerCase() as keyof typeof bachillerato.personalityMatch
            if (bachillerato.personalityMatch[traitKey] !== undefined) {
              return acc + (1 - Math.abs(value - bachillerato.personalityMatch[traitKey]))
            }
            return acc
          }, 0) / personalityEntries.length

        score += personalityScore * 0.4
      }

      // Skills matching (30% weight)
      if (validUserSkills.length > 0) {
        const skillsMatch =
          validUserSkills.filter((skill) =>
            bachillerato.habilidades.some(
              (bachSkill) =>
                bachSkill.toLowerCase().includes(skill.toLowerCase()) ||
                skill.toLowerCase().includes(bachSkill.toLowerCase()),
            ),
          ).length / validUserSkills.length

        score += skillsMatch * 0.3
      }

      // Interests matching (30% weight)
      if (validInterests.length > 0) {
        const interestsMatch =
          validInterests.filter(
            (interest) =>
              bachillerato.area.toLowerCase().includes(interest.toLowerCase()) ||
              interest.toLowerCase().includes(bachillerato.area.toLowerCase()) ||
              bachillerato.carrerasRelacionadas.some(
                (carrera) =>
                  carrera.toLowerCase().includes(interest.toLowerCase()) ||
                  interest.toLowerCase().includes(carrera.toLowerCase()),
              ),
          ).length / validInterests.length

        score += interestsMatch * 0.3
      }

      return { ...bachillerato, matchScore: Math.round(score * 100) }
    })
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    .slice(0, 5)
}

export function getBachilleratoById(id: string): Bachillerato | undefined {
  return bachilleratos.find((bach) => bach.id === id)
}

export function getBachilleratosByArea(area: string): Bachillerato[] {
  return bachilleratos.filter((bach) => bach.area === area)
}

export function searchBachilleratos(query: string): Bachillerato[] {
  const lowercaseQuery = query.toLowerCase()
  return bachilleratos.filter(
    (bach) =>
      bach.nombre.toLowerCase().includes(lowercaseQuery) ||
      bach.area.toLowerCase().includes(lowercaseQuery) ||
      bach.descripcion.toLowerCase().includes(lowercaseQuery) ||
      bach.habilidades.some((habilidad) => habilidad.toLowerCase().includes(lowercaseQuery)) ||
      bach.carrerasRelacionadas.some((carrera) => carrera.toLowerCase().includes(lowercaseQuery)),
  )
}
