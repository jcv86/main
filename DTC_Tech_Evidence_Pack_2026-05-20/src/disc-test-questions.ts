// DISC Test Questions - TestDISCOnline Format
// Each question has 4 options mapping to D-I-S-C
// User selects: MÁS como yo y MENOS como yo

export interface DiscQuestion {
  id: number;
  pregunta: string;
  opciones: {
    texto: string;
    dimension: "D" | "I" | "S" | "C";
  }[];
  contexto?: "personal" | "profesional" | "ambos";
}

export const DISC_TEST_QUESTIONS: DiscQuestion[] = [
  // PREGUNTA 1
  {
    id: 1,
    pregunta: "Cuando enfrento un desafío importante, tiendo a ser más:",
    opciones: [
      { texto: "Decidido y directo", dimension: "D" },
      { texto: "Optimista e inspirador", dimension: "I" },
      { texto: "Paciente y considerado", dimension: "S" },
      { texto: "Analítico y preciso", dimension: "C" },
    ],
  },

  // PREGUNTA 2
  {
    id: 2,
    pregunta: "En situaciones inesperadas, mi reacción natural es:",
    opciones: [
      { texto: "Tomar control rápidamente", dimension: "D" },
      { texto: "Ver lo positivo y motivar", dimension: "I" },
      { texto: "Mantener la calma y estabilidad", dimension: "S" },
      { texto: "Analizar antes de actuar", dimension: "C" },
    ],
  },

  // PREGUNTA 3
  {
    id: 3,
    pregunta: "Mi mayor fortaleza en el trabajo es:",
    opciones: [
      { texto: "Ejecutar y lograr resultados", dimension: "D" },
      { texto: "Conectar personas e ideas", dimension: "I" },
      { texto: "Mantener armonía y apoyo", dimension: "S" },
      { texto: "Garantizar calidad y precisión", dimension: "C" },
    ],
  },

  // PREGUNTA 4
  {
    id: 4,
    pregunta: "En un grupo, naturalmente:",
    opciones: [
      { texto: "Tomo la iniciativa y lidero", dimension: "D" },
      { texto: "Energizo y animo la participación", dimension: "I" },
      { texto: "Escucho y apoyo a otros", dimension: "S" },
      { texto: "Aseguro que todo esté bien hecho", dimension: "C" },
    ],
  },

  // PREGUNTA 5
  {
    id: 5,
    pregunta: "Cuando tomo decisiones importantes, considero más:",
    opciones: [
      { texto: "Velocidad y resultados", dimension: "D" },
      { texto: "Opiniones y entusiasmo del equipo", dimension: "I" },
      { texto: "Impacto en las personas", dimension: "S" },
      { texto: "Datos y análisis detallado", dimension: "C" },
    ],
  },

  // PREGUNTA 6
  {
    id: 6,
    pregunta: "Mi estilo de comunicación es más:",
    opciones: [
      { texto: "Directo y asertivo", dimension: "D" },
      { texto: "Abierto y conversacional", dimension: "I" },
      { texto: "Calmado y reflexivo", dimension: "S" },
      { texto: "Preciso y estructurado", dimension: "C" },
    ],
  },

  // PREGUNTA 7
  {
    id: 7,
    pregunta: "Ante conflictos, generalmente:",
    opciones: [
      { texto: "Confronto directamente", dimension: "D" },
      { texto: "Busco soluciones ganadoras para todos", dimension: "I" },
      { texto: "Intento mantener la paz", dimension: "S" },
      { texto: "Examino todos los hechos", dimension: "C" },
    ],
  },

  // PREGUNTA 8
  {
    id: 8,
    pregunta: "Lo que más me motiva es:",
    opciones: [
      { texto: "Ganar y lograr metas", dimension: "D" },
      { texto: "Reconocimiento y visibilidad", dimension: "I" },
      { texto: "Estabilidad y relaciones sólidas", dimension: "S" },
      { texto: "Excelencia y perfeccionamiento", dimension: "C" },
    ],
  },

  // PREGUNTA 9
  {
    id: 9,
    pregunta: "Prefiero trabajar en entornos que sean:",
    opciones: [
      { texto: "Competitivos y desafiantes", dimension: "D" },
      { texto: "Dinámicos y colaborativos", dimension: "I" },
      { texto: "Estables y previsibles", dimension: "S" },
      { texto: "Ordenados y bien documentados", dimension: "C" },
    ],
  },

  // PREGUNTA 10
  {
    id: 10,
    pregunta: "Cuando surgen problemas, mi primera reacción es:",
    opciones: [
      { texto: "Atacar la solución inmediatamente", dimension: "D" },
      { texto: "Reunir al equipo para ideas", dimension: "I" },
      { texto: "Evaluar el impacto en todos", dimension: "S" },
      { texto: "Investigar la raíz del problema", dimension: "C" },
    ],
  },

  // PREGUNTA 11
  {
    id: 11,
    pregunta: "Mi relación con las reglas es:",
    opciones: [
      { texto: "Las cambio si obstaculizan resultados", dimension: "D" },
      { texto: "Las adapto según la situación", dimension: "I" },
      { texto: "Las respeto por estabilidad", dimension: "S" },
      { texto: "Las sigo porque existen por razones", dimension: "C" },
    ],
  },

  // PREGUNTA 12
  {
    id: 12,
    pregunta: "Sobre cambios y innovación, tiendo a:",
    opciones: [
      { texto: "Impulsar cambios transformacionales", dimension: "D" },
      { texto: "Entusiasmarme con nuevas ideas", dimension: "I" },
      { texto: "Ser cauteloso hasta estar seguro", dimension: "S" },
      { texto: "Evaluar sistemáticamente los beneficios", dimension: "C" },
    ],
  },

  // PREGUNTA 13
  {
    id: 13,
    pregunta: "Mi relación con los detalles es:",
    opciones: [
      { texto: "Delego, no me distraen", dimension: "D" },
      { texto: "Los omito si no son importantes", dimension: "I" },
      { texto: "Los considero en lo importante", dimension: "S" },
      { texto: "Son críticos, nada se me escapa", dimension: "C" },
    ],
  },

  // PREGUNTA 14
  {
    id: 14,
    pregunta: "Cuando trabajo en equipo, mi rol es más:",
    opciones: [
      { texto: "Definir dirección y metas", dimension: "D" },
      { texto: "Inspirar y conectar personas", dimension: "I" },
      { texto: "Apoyar y facilitar el trabajo", dimension: "S" },
      { texto: "Verificar calidad y procesos", dimension: "C" },
    ],
  },

  // PREGUNTA 15
  {
    id: 15,
    pregunta: "Ante críticas, típicamente:",
    opciones: [
      { texto: "Las veo como información para mejorar", dimension: "D" },
      { texto: "Las recibo pero las analizo después", dimension: "I" },
      { texto: "Me afecta emocionalmente al principio", dimension: "S" },
      { texto: "Las examino objetivamente", dimension: "C" },
    ],
  },

  // PREGUNTA 16
  {
    id: 16,
    pregunta: "Mi idea de éxito es:",
    opciones: [
      { texto: "Alcanzar metas ambiciosas", dimension: "D" },
      { texto: "Tener impacto e influencia", dimension: "I" },
      { texto: "Contribuir a algo mayor que yo", dimension: "S" },
      { texto: "Crear algo duradero y excelente", dimension: "C" },
    ],
  },

  // PREGUNTA 17
  {
    id: 17,
    pregunta: "Cuando trabajo solo, tiendo a:",
    opciones: [
      { texto: "Avanzar rápido hacia la meta", dimension: "D" },
      { texto: "Buscar formas de conectar mi trabajo", dimension: "I" },
      { texto: "Trabajar a ritmo constante", dimension: "S" },
      { texto: "Refinar hasta la excelencia", dimension: "C" },
    ],
  },

  // PREGUNTA 18
  {
    id: 18,
    pregunta: "Lo que menos tolero es:",
    opciones: [
      { texto: "Falta de acción y decisiones", dimension: "D" },
      { texto: "Aislamiento y monotonía", dimension: "I" },
      { texto: "Conflicto y cambio constante", dimension: "S" },
      { texto: "Imprecisión y caos", dimension: "C" },
    ],
  },

  // PREGUNTA 19
  {
    id: 19,
    pregunta: "En negociaciones, mis puntos fuertes son:",
    opciones: [
      { texto: "Negociar hasta ganar", dimension: "D" },
      { texto: "Persuadir carismáticamente", dimension: "I" },
      { texto: "Encontrar soluciones colaborativas", dimension: "S" },
      { texto: "Presentar casos bien argumentados", dimension: "C" },
    ],
  },

  // PREGUNTA 20
  {
    id: 20,
    pregunta: "Sobre feedback y evaluación, prefiero:",
    opciones: [
      { texto: "Resultados medibles claros", dimension: "D" },
      { texto: "Reconocimiento del equipo", dimension: "I" },
      { texto: "Conversaciones reflexivas", dimension: "S" },
      { texto: "Análisis detallado y específico", dimension: "C" },
    ],
  },

  // PREGUNTA 21
  {
    id: 21,
    pregunta: "Mi paciencia se agota con:",
    opciones: [
      { texto: "Gente indecisa o lenta", dimension: "D" },
      { texto: "Gente negativa o distante", dimension: "I" },
      { texto: "Conflicto y tensión", dimension: "S" },
      { texto: "Desorden e imprecisión", dimension: "C" },
    ],
  },

  // PREGUNTA 22
  {
    id: 22,
    pregunta: "Cuando debo liderar, mi enfoque es:",
    opciones: [
      { texto: "Establecer dirección clara y exigencia", dimension: "D" },
      { texto: "Inspirar y motivar al equipo", dimension: "I" },
      { texto: "Apoyar y desarrollar a otros", dimension: "S" },
      { texto: "Crear sistemas que funcionen", dimension: "C" },
    ],
  },

  // PREGUNTA 23
  {
    id: 23,
    pregunta: "Mis amigos me describirían como:",
    opciones: [
      { texto: "Ambicioso y decidido", dimension: "D" },
      { texto: "Divertido y conectado", dimension: "I" },
      { texto: "Leal y confiable", dimension: "S" },
      { texto: "Pensador y analítico", dimension: "C" },
    ],
  },

  // PREGUNTA 24
  {
    id: 24,
    pregunta: "En proyectos, mi contribución típica es:",
    opciones: [
      { texto: "Impulsar avance y alcanzar metas", dimension: "D" },
      { texto: "Generar entusiasmo y creatividad", dimension: "I" },
      { texto: "Mantener cohesión del equipo", dimension: "S" },
      { texto: "Asegurar implementación correcta", dimension: "C" },
    ],
  },

  // PREGUNTA 25
  {
    id: 25,
    pregunta: "Cuando veo oportunidades, típicamente:",
    opciones: [
      { texto: "Las capturo rápidamente", dimension: "D" },
      { texto: "Las comparto e inspiro a otros", dimension: "I" },
      { texto: "Las evaluó cuidadosamente", dimension: "S" },
      { texto: "Las analizo profundamente", dimension: "C" },
    ],
  },

  // PREGUNTA 26
  {
    id: 26,
    pregunta: "Mi zona de confort es más:",
    opciones: [
      { texto: "Desafíos y competencia", dimension: "D" },
      { texto: "Interacción y visibilidad", dimension: "I" },
      { texto: "Estabilidad y relaciones", dimension: "S" },
      { texto: "Profundidad y competencia técnica", dimension: "C" },
    ],
  },

  // PREGUNTA 27
  {
    id: 27,
    pregunta: "Ante errores, mi reacción es:",
    opciones: [
      { texto: "Corregir inmediatamente y avanzar", dimension: "D" },
      { texto: "Buscar soluciones creativas", dimension: "I" },
      { texto: "Apologizarme y hacer enmienda", dimension: "S" },
      { texto: "Analizar qué salió mal", dimension: "C" },
    ],
  },

  // PREGUNTA 28
  {
    id: 28,
    pregunta: "Mi visión del futuro es más:",
    opciones: [
      { texto: "Conquistar nuevas alturas", dimension: "D" },
      { texto: "Impactar e inspirar a muchos", dimension: "I" },
      { texto: "Construir algo sostenible", dimension: "S" },
      { texto: "Perfeccionar y dominar", dimension: "C" },
    ],
  },
];

// Helper function to shuffle options for a question
export function shuffleOptionsForQuestion(question: DiscQuestion): DiscQuestion {
  const shuffled = [...question.opciones].sort(() => Math.random() - 0.5);
  return {
    ...question,
    opciones: shuffled,
  };
}

// Get all questions shuffled
export function getAllQuestionsShuffled(): DiscQuestion[] {
  return DISC_TEST_QUESTIONS.map(shuffleOptionsForQuestion);
}
