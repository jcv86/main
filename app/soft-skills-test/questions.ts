import { MessageSquare, Crown, Users, Lightbulb, Zap, Heart, Clock } from "lucide-react"

export interface Question {
  id: number
  category: string
  categoryIcon: any
  trait: string
  type: "scale" | "open" | "multiple" | "scenario" | "ranking" | "checkbox" | "slider" | "binary"
  text: string
  options?: { value: number; label: string }[]
  sliderConfig?: { min: number; max: number; step: number; labels: string[] }
  explanation?: string
  reformulations?: string[]
  reverse?: boolean
}

export const questions: Question[] = [
  // Comunicación (5 preguntas)
  {
    id: 1,
    category: "Comunicación",
    categoryIcon: MessageSquare,
    trait: "communication",
    type: "scale",
    text: "Me siento cómodo/a expresando mis ideas en reuniones de trabajo en empresas chilenas",
    explanation:
      "Esta pregunta evalúa tu confianza para comunicarte en entornos laborales chilenos. Considera qué tan natural te resulta participar en discusiones de trabajo en el contexto empresarial de Chile.",
    reformulations: [
      "¿Qué tan fácil te resulta compartir tus opiniones durante las reuniones en tu trabajo en Chile?",
      "¿Te sientes seguro/a al hablar frente a tu equipo en el ambiente laboral chileno?",
      "¿Participas activamente cuando tu equipo discute ideas en el contexto empresarial de Chile?",
    ],
  },
  {
    id: 2,
    category: "Comunicación",
    categoryIcon: MessageSquare,
    trait: "communication",
    type: "open",
    text: "Describe una situación laboral en Chile donde tuviste que explicar algo complejo a un colega o cliente. ¿Cómo adaptaste tu comunicación al contexto chileno?",
    explanation:
      "Queremos entender tu capacidad para comunicarte efectivamente en el ambiente laboral chileno, considerando las particularidades culturales y profesionales del país.",
    reformulations: [
      "Cuenta sobre una vez que tuviste que enseñar algo difícil a un compañero de trabajo en Chile",
      "¿Cómo explicas conceptos complicados considerando la cultura laboral chilena?",
      "Describe tu método para comunicarte efectivamente en el ambiente profesional de Chile",
    ],
  },
  {
    id: 3,
    category: "Comunicación",
    categoryIcon: MessageSquare,
    trait: "communication",
    type: "ranking",
    text: "Ordena estas estrategias de comunicación según su importancia en el ambiente laboral chileno:",
    options: [
      { value: 1, label: "Mantener un trato cordial y respetuoso (típico chileno)" },
      { value: 2, label: "Usar ejemplos locales y referencias culturales chilenas" },
      { value: 3, label: "Adaptar el lenguaje formal/informal según la jerarquía" },
      { value: 4, label: "Confirmar comprensión con 'cachái' o expresiones locales" },
      { value: 5, label: "Mantener contacto visual respetando las normas sociales chilenas" },
    ],
    explanation:
      "Esta pregunta evalúa qué aspectos de la comunicación priorizas en el contexto laboral específico de Chile.",
  },
  {
    id: 4,
    category: "Comunicación",
    categoryIcon: MessageSquare,
    trait: "communication",
    type: "slider",
    text: "En reuniones de trabajo en Chile, ¿qué porcentaje de tu tiempo dedicas a escuchar vs hablar?",
    sliderConfig: {
      min: 0,
      max: 100,
      step: 5,
      labels: ["Solo escucho", "Equilibrado", "Solo hablo"],
    },
    explanation:
      "Esta pregunta evalúa tu balance comunicacional en el contexto profesional chileno, donde la escucha activa es muy valorada.",
  },
  {
    id: 5,
    category: "Comunicación",
    categoryIcon: MessageSquare,
    trait: "communication",
    type: "checkbox",
    text: "¿Cuáles de estas situaciones de comunicación en el ambiente laboral chileno te resultan más desafiantes?",
    options: [
      { value: 1, label: "Presentaciones formales ante ejecutivos de empresas chilenas" },
      { value: 2, label: "Negociaciones con proveedores o clientes chilenos" },
      { value: 3, label: "Comunicación escrita formal (emails corporativos en Chile)" },
      { value: 4, label: "Comunicación con equipos de diferentes regiones de Chile" },
      { value: 5, label: "Dar feedback a colegas respetando la cultura laboral chilena" },
      { value: 6, label: "Comunicación virtual con equipos distribuidos en Chile" },
    ],
    explanation:
      "Identificar tus desafíos comunicacionales en el contexto laboral chileno nos ayuda a entender áreas de mejora específicas.",
  },

  // Liderazgo (5 preguntas)
  {
    id: 6,
    category: "Liderazgo",
    categoryIcon: Crown,
    trait: "leadership",
    type: "binary",
    text: "En el contexto empresarial chileno, ¿prefieres un estilo de liderazgo más directo o más colaborativo?",
    options: [
      { value: 1, label: "Liderazgo directo - Dar instrucciones claras (estilo más tradicional)" },
      { value: 2, label: "Liderazgo colaborativo - Facilitar consenso grupal (estilo moderno)" },
    ],
    explanation:
      "Ambos estilos son válidos en Chile. El directo es más tradicional en empresas establecidas, mientras que el colaborativo es común en startups y empresas tech.",
  },
  {
    id: 7,
    category: "Liderazgo",
    categoryIcon: Crown,
    trait: "leadership",
    type: "open",
    text: "Cuenta sobre una experiencia liderando un equipo o proyecto en Chile. ¿Cómo adaptaste tu liderazgo a la cultura laboral chilena?",
    explanation:
      "Buscamos ejemplos concretos de tu experiencia liderando en Chile, incluyendo cómo manejaste las particularidades culturales y laborales del país.",
    reformulations: [
      "Describe tu experiencia más significativa como líder en el ambiente laboral chileno",
      "¿Cómo has motivado a un equipo chileno considerando nuestra cultura?",
      "Cuenta sobre un proyecto donde tuviste que liderar respetando las normas sociales chilenas",
    ],
  },
  {
    id: 8,
    category: "Liderazgo",
    categoryIcon: Crown,
    trait: "leadership",
    type: "scale",
    text: "Me siento natural asumiendo roles de liderazgo en equipos de trabajo chilenos",
    explanation:
      "Esta pregunta evalúa tu comodidad liderando en el contexto específico de equipos chilenos, considerando nuestra cultura laboral.",
  },
  {
    id: 9,
    category: "Liderazgo",
    categoryIcon: Crown,
    trait: "leadership",
    type: "multiple",
    text: "Al liderar un equipo diverso en Chile (diferentes regiones, backgrounds socioeconómicos), ¿cuál es tu enfoque?",
    options: [
      { value: 1, label: "Establecer normas claras respetando la diversidad regional chilena" },
      { value: 2, label: "Adaptar mi estilo a cada persona según su origen regional/social" },
      { value: 3, label: "Encontrar un enfoque que funcione para la mayoría del equipo" },
      { value: 4, label: "Involucrar al equipo en crear normas que respeten nuestra diversidad" },
    ],
    explanation:
      "Esta pregunta evalúa cómo manejas la diversidad específica de Chile en términos regionales y socioeconómicos.",
  },
  {
    id: 10,
    category: "Liderazgo",
    categoryIcon: Crown,
    trait: "leadership",
    type: "slider",
    text: "En el ambiente laboral chileno, ¿qué tan importante es para ti ser reconocido como líder versus lograr resultados en equipo?",
    sliderConfig: {
      min: 0,
      max: 100,
      step: 5,
      labels: ["Solo resultados importan", "Equilibrado", "Reconocimiento es clave"],
    },
    explanation:
      "Esta pregunta explora tu motivación como líder en el contexto chileno, donde tradicionalmente se valora más el logro colectivo.",
  },

  // Trabajo en Equipo (5 preguntas)
  {
    id: 11,
    category: "Trabajo en Equipo",
    categoryIcon: Users,
    trait: "teamwork",
    type: "ranking",
    text: "Ordena estos roles de equipo según cuál describes mejor tu contribución en equipos de trabajo chilenos:",
    options: [
      { value: 1, label: "El organizador - Coordino respetando las jerarquías chilenas" },
      { value: 2, label: "El creativo - Aporto ideas innovadoras adaptadas al mercado chileno" },
      { value: 3, label: "El ejecutor - Me aseguro de cumplir con los compromisos" },
      { value: 4, label: "El mediador - Resuelvo conflictos manteniendo la armonía grupal" },
      { value: 5, label: "El experto - Aporto conocimiento técnico específico" },
    ],
    explanation:
      "Los equipos chilenos valoran diferentes roles. Esta pregunta identifica tu contribución natural en nuestro contexto laboral.",
  },
  {
    id: 12,
    category: "Trabajo en Equipo",
    categoryIcon: Users,
    trait: "teamwork",
    type: "open",
    text: "Describe cómo colaboras en equipos de trabajo en Chile. ¿Cómo adaptas tu estilo a las diferentes personalidades y backgrounds de tus colegas chilenos?",
    explanation:
      "Queremos entender cómo te integras en equipos chilenos y cómo manejas la diversidad regional y social característica de nuestro país.",
  },
  {
    id: 13,
    category: "Trabajo en Equipo",
    categoryIcon: Users,
    trait: "teamwork",
    type: "scale",
    text: "Prefiero trabajar en equipo que solo/a, especialmente en el ambiente colaborativo chileno",
    explanation:
      "Esta pregunta evalúa tu preferencia por el trabajo colaborativo en el contexto de la cultura laboral chilena.",
  },
  {
    id: 14,
    category: "Trabajo en Equipo",
    categoryIcon: Users,
    trait: "teamwork",
    type: "checkbox",
    text: "¿En cuáles de estos tipos de equipos de trabajo chilenos te desempeñas mejor?",
    options: [
      { value: 1, label: "Equipos pequeños en startups chilenas (2-4 personas)" },
      { value: 2, label: "Equipos grandes en empresas tradicionales chilenas (5+ personas)" },
      { value: 3, label: "Equipos multidisciplinarios en empresas tech de Santiago" },
      { value: 4, label: "Equipos remotos distribuidos por diferentes regiones de Chile" },
      { value: 5, label: "Equipos temporales para proyectos específicos" },
      { value: 6, label: "Equipos auto-organizados en empresas innovadoras chilenas" },
    ],
    explanation:
      "Diferentes tipos de equipos son comunes en el mercado laboral chileno. Esta pregunta identifica dónde colaboras mejor.",
  },
  {
    id: 15,
    category: "Trabajo en Equipo",
    categoryIcon: Users,
    trait: "teamwork",
    type: "scenario",
    text: "Un compañero chileno constantemente llega tarde a las reuniones y no cumple deadlines, afectando el proyecto. Considerando nuestra cultura laboral, ¿qué haces?",
    options: [
      { value: 1, label: "Converso directamente con él de manera respetuosa y cordial" },
      { value: 2, label: "Informo la situación al jefe respetando las jerarquías" },
      { value: 3, label: "Redistribuyo discretamente las tareas para no generar conflicto" },
      { value: 4, label: "Propongo una reunión de equipo para revisar compromisos grupales" },
    ],
    explanation: "Esta situación evalúa cómo manejas conflictos respetando las normas sociales y laborales chilenas.",
  },

  // Resolución de Problemas (5 preguntas)
  {
    id: 16,
    category: "Resolución de Problemas",
    categoryIcon: Lightbulb,
    trait: "problemSolving",
    type: "binary",
    text: "Al enfrentar problemas laborales en Chile, ¿prefieres seguir procedimientos establecidos o buscar soluciones innovadoras?",
    options: [
      { value: 1, label: "Seguir procedimientos establecidos (enfoque tradicional chileno)" },
      { value: 2, label: "Buscar soluciones innovadoras (enfoque startup chileno)" },
    ],
    explanation:
      "En Chile coexisten ambos enfoques: el tradicional en empresas establecidas y el innovador en el ecosistema emprendedor.",
  },
  {
    id: 17,
    category: "Resolución de Problemas",
    categoryIcon: Lightbulb,
    trait: "problemSolving",
    type: "open",
    text: "Describe un problema complejo que resolviste en tu trabajo en Chile. ¿Cómo adaptaste tu solución al contexto local chileno?",
    explanation:
      "Buscamos entender tu metodología para resolver problemas considerando las particularidades del mercado y cultura chilena.",
  },
  {
    id: 18,
    category: "Resolución de Problemas",
    categoryIcon: Lightbulb,
    trait: "problemSolving",
    type: "ranking",
    text: "Ordena estos pasos según tu proceso típico para resolver problemas en el ambiente laboral chileno:",
    options: [
      { value: 1, label: "Definir el problema considerando el contexto chileno" },
      { value: 2, label: "Consultar con colegas y superiores (cultura colaborativa)" },
      { value: 3, label: "Generar soluciones adaptadas al mercado chileno" },
      { value: 4, label: "Evaluar viabilidad considerando recursos locales" },
      { value: 5, label: "Implementar respetando los procesos de la empresa" },
    ],
    explanation: "Queremos conocer tu secuencia natural para resolver problemas en el contexto laboral chileno.",
  },
  {
    id: 19,
    category: "Resolución de Problemas",
    categoryIcon: Lightbulb,
    trait: "problemSolving",
    type: "slider",
    text: "En tu trabajo en Chile, ¿qué porcentaje de tiempo dedicas a analizar problemas versus implementar soluciones?",
    sliderConfig: {
      min: 0,
      max: 100,
      step: 5,
      labels: ["Solo análisis", "Equilibrado", "Solo implementación"],
    },
    explanation: "Esta pregunta evalúa tu balance entre reflexión y acción en el contexto laboral chileno.",
  },
  {
    id: 20,
    category: "Resolución de Problemas",
    categoryIcon: Lightbulb,
    trait: "problemSolving",
    type: "scale",
    text: "Disfruto enfrentando desafíos complejos típicos del mercado laboral chileno",
    explanation: "Esta pregunta evalúa tu motivación hacia los desafíos específicos del ambiente profesional en Chile.",
  },

  // Adaptabilidad (5 preguntas)
  {
    id: 21,
    category: "Adaptabilidad",
    categoryIcon: Zap,
    trait: "adaptability",
    type: "checkbox",
    text: "¿A cuáles de estos cambios típicos del mercado laboral chileno te adaptas más fácilmente?",
    options: [
      { value: 1, label: "Cambios en tecnología (transformación digital en Chile)" },
      { value: 2, label: "Cambios en regulaciones laborales chilenas" },
      { value: 3, label: "Cambios en estructura organizacional de empresas chilenas" },
      { value: 4, label: "Cambios en modalidad de trabajo (presencial/remoto en Chile)" },
      { value: 5, label: "Cambios en equipos multiculturales en Santiago" },
      { value: 6, label: "Cambios estacionales en la demanda (típicos de Chile)" },
    ],
    explanation:
      "El mercado laboral chileno tiene cambios específicos. Esta pregunta identifica tus fortalezas adaptativas locales.",
  },
  {
    id: 22,
    category: "Adaptabilidad",
    categoryIcon: Zap,
    trait: "adaptability",
    type: "open",
    text: "Cuenta sobre una vez que tuviste que adaptarte a un cambio importante en tu trabajo en Chile (nueva ley laboral, crisis económica, pandemia, etc.). ¿Cómo lo manejaste?",
    explanation:
      "Buscamos ejemplos de tu adaptabilidad a cambios específicos que han afectado el mercado laboral chileno.",
  },
  {
    id: 23,
    category: "Adaptabilidad",
    categoryIcon: Zap,
    trait: "adaptability",
    type: "scale",
    text: "Me adapto fácilmente a los cambios constantes del mercado laboral chileno",
    explanation:
      "Esta pregunta evalúa tu flexibilidad general ante la dinámica específica del mercado de trabajo en Chile.",
  },
  {
    id: 24,
    category: "Adaptabilidad",
    categoryIcon: Zap,
    trait: "adaptability",
    type: "slider",
    text: "¿Qué tan rápido te adaptas a nuevas situaciones laborales en Chile?",
    sliderConfig: {
      min: 0,
      max: 100,
      step: 5,
      labels: ["Muy lento", "Velocidad normal", "Inmediatamente"],
    },
    explanation:
      "Esta pregunta evalúa tu velocidad de adaptación en el contexto específico del ambiente laboral chileno.",
  },
  {
    id: 25,
    category: "Adaptabilidad",
    categoryIcon: Zap,
    trait: "adaptability",
    type: "scenario",
    text: "Tu empresa chilena implementa una nueva tecnología que cambia tu forma de trabajar. El entrenamiento es limitado y tienes deadlines próximos. ¿Qué haces?",
    options: [
      { value: 1, label: "Aprendo lo básico rápido y mejoro trabajando (estilo chileno pragmático)" },
      { value: 2, label: "Busco capacitación adicional en institutos chilenos" },
      { value: 3, label: "Negocio plazos considerando la cultura laboral chilena" },
      { value: 4, label: "Colaboro con colegas para aprender juntos (networking chileno)" },
    ],
    explanation: "Esta situación evalúa cómo manejas cambios tecnológicos en el contexto empresarial chileno.",
  },

  // Inteligencia Emocional (5 preguntas)
  {
    id: 26,
    category: "Inteligencia Emocional",
    categoryIcon: Heart,
    trait: "emotionalIntelligence",
    type: "ranking",
    text: "Ordena estas habilidades emocionales según tu fortaleza en el ambiente laboral chileno:",
    options: [
      { value: 1, label: "Reconocer emociones propias en situaciones laborales chilenas" },
      { value: 2, label: "Controlar reacciones respetando las normas sociales chilenas" },
      { value: 3, label: "Entender emociones de colegas chilenos (empatía cultural)" },
      { value: 4, label: "Influir positivamente en el ambiente laboral chileno" },
      { value: 5, label: "Usar emociones para motivarme en el contexto profesional chileno" },
    ],
    explanation:
      "La inteligencia emocional se manifiesta diferente en cada cultura. Esta pregunta evalúa tus fortalezas en el contexto chileno.",
  },
  {
    id: 27,
    category: "Inteligencia Emocional",
    categoryIcon: Heart,
    trait: "emotionalIntelligence",
    type: "open",
    text: "Describe una situación emocionalmente desafiante en tu trabajo en Chile. ¿Cómo manejaste tus emociones y las de otros respetando nuestra cultura?",
    explanation:
      "Buscamos ejemplos de cómo aplicas inteligencia emocional considerando las particularidades culturales chilenas.",
  },
  {
    id: 28,
    category: "Inteligencia Emocional",
    categoryIcon: Heart,
    trait: "emotionalIntelligence",
    type: "scale",
    text: "Soy bueno/a leyendo las emociones y estados de ánimo de mis colegas chilenos",
    explanation:
      "Esta pregunta evalúa tu capacidad de percepción emocional en el contexto específico de las relaciones laborales chilenas.",
  },
  {
    id: 29,
    category: "Inteligencia Emocional",
    categoryIcon: Heart,
    trait: "emotionalIntelligence",
    type: "slider",
    text: "En decisiones laborales en Chile, ¿qué porcentaje está influenciado por emociones versus lógica pura?",
    sliderConfig: {
      min: 0,
      max: 100,
      step: 5,
      labels: ["Solo lógica", "Equilibrado", "Solo emociones"],
    },
    explanation:
      "En la cultura laboral chilena, las emociones y relaciones personales juegan un rol importante en las decisiones.",
  },
  {
    id: 30,
    category: "Inteligencia Emocional",
    categoryIcon: Heart,
    trait: "emotionalIntelligence",
    type: "scenario",
    text: "En una reunión importante con clientes chilenos, un colega critica tu trabajo frente a todos. Te sientes molesto/a pero debes responder profesionalmente. ¿Qué haces?",
    options: [
      { value: 1, label: "Me calmo y respondo con hechos, manteniendo la cordialidad chilena" },
      { value: 2, label: "Agradezco el feedback y propongo conversar después (estilo chileno)" },
      { value: 3, label: "Defiendo mi trabajo con argumentos, pero respetuosamente" },
      { value: 4, label: "Reconozco puntos válidos y explico mi perspectiva diplomáticamente" },
    ],
    explanation: "Esta situación evalúa tu inteligencia emocional en el contexto de las normas profesionales chilenas.",
  },

  // Gestión del Tiempo (5 preguntas)
  {
    id: 31,
    category: "Gestión del Tiempo",
    categoryIcon: Clock,
    trait: "timeManagement",
    type: "checkbox",
    text: "¿Cuáles de estas técnicas de gestión del tiempo usas en tu trabajo en Chile?",
    options: [
      { value: 1, label: "Listas de tareas adaptadas al horario laboral chileno" },
      { value: 2, label: "Calendario respetando horarios de almuerzo chilenos (13:00-14:00)" },
      { value: 3, label: "Técnicas de productividad adaptadas a la cultura laboral chilena" },
      { value: 4, label: "Priorización considerando urgencias típicas del mercado chileno" },
      { value: 5, label: "Apps de productividad populares en Chile" },
      { value: 6, label: "Planificación semanal considerando feriados chilenos" },
    ],
    explanation: "La gestión del tiempo en Chile tiene particularidades culturales y laborales específicas.",
  },
  {
    id: 32,
    category: "Gestión del Tiempo",
    categoryIcon: Clock,
    trait: "timeManagement",
    type: "open",
    text: "Describe tu sistema personal para organizar tu tiempo de trabajo en Chile. ¿Cómo adaptas tu productividad al ritmo laboral chileno?",
    explanation:
      "Queremos entender cómo organizas tu tiempo considerando las particularidades del ambiente laboral chileno.",
  },
  {
    id: 33,
    category: "Gestión del Tiempo",
    categoryIcon: Clock,
    trait: "timeManagement",
    type: "scale",
    text: "Soy excelente organizando mi tiempo y cumpliendo deadlines en el ambiente laboral chileno",
    explanation:
      "Esta pregunta evalúa tu confianza en gestión del tiempo en el contexto específico del trabajo en Chile.",
  },
  {
    id: 34,
    category: "Gestión del Tiempo",
    categoryIcon: Clock,
    trait: "timeManagement",
    type: "slider",
    text: "En tu trabajo en Chile, ¿qué porcentaje de tiempo dedicas a tareas planificadas versus urgencias?",
    sliderConfig: {
      min: 0,
      max: 100,
      step: 5,
      labels: ["Solo urgencias", "Equilibrado", "Solo planificado"],
    },
    explanation: "El ambiente laboral chileno a menudo requiere balance entre planificación y respuesta a urgencias.",
  },
  {
    id: 35,
    category: "Gestión del Tiempo",
    categoryIcon: Clock,
    trait: "timeManagement",
    type: "scenario",
    text: "Tienes 5 tareas importantes con deadlines en los próximos 3 días, pero solo tiempo para 3. En el contexto laboral chileno, ¿qué haces?",
    options: [
      { value: 1, label: "Priorizo por deadline y hago las 3 primeras (enfoque tradicional)" },
      { value: 2, label: "Evalúo impacto en clientes/empresa y elijo las más importantes" },
      { value: 3, label: "Converso con mi jefe para renegociar plazos (comunicación directa)" },
      { value: 4, label: "Busco apoyo del equipo para distribuir la carga (colaboración)" },
    ],
    explanation: "Esta situación evalúa cómo priorizas y buscas soluciones en el contexto laboral chileno.",
  },
]
