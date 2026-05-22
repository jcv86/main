// Conozcámonos 1 - 7 preguntas PRE-A1 para contextualizar el informe
// Se realizan ANTES del test A1 Despega Cerebral

export const CONOZCAMONOS_1_QUESTIONS = [
  {
    id: 1,
    question: "¿Cuál es tu situación laboral actual?",
    type: "select",
    options: [
      "Empleado de tiempo completo",
      "Empleado de tiempo parcial",
      "Independiente/Freelancer",
      "Desempleado",
      "Estudiante",
      "Otro"
    ],
    required: true,
  },
  {
    id: 2,
    question: "¿Cuántos años de experiencia profesional tienes?",
    type: "select",
    options: [
      "Menos de 1 año",
      "1-3 años",
      "3-5 años",
      "5-10 años",
      "10+ años"
    ],
    required: true,
  },
  {
    id: 3,
    question: "¿Qué es lo más desafiante en tu trabajo o carrera actualmente?",
    type: "text",
    placeholder: "Describe brevemente los principales desafíos...",
    maxLength: 500,
    required: true,
  },
  {
    id: 4,
    question: "¿Cuál es tu objetivo principal para los próximos 90 días?",
    type: "text",
    placeholder: "¿Qué quieres lograr? (ej: avanzar en el trabajo, cambiar de carrera, mejorar habilidades...)",
    maxLength: 500,
    required: true,
  },
  {
    id: 5,
    question: "¿Con quién vives actualmente?",
    type: "select",
    options: [
      "Solo/a",
      "Con pareja",
      "Con familia",
      "Con amigos/compañeros",
      "Otro"
    ],
    required: true,
  },
  {
    id: 6,
    question: "¿Cuánto tiempo disponible tienes por semana para tu transformación personal?",
    type: "select",
    options: [
      "Menos de 3 horas",
      "3-5 horas",
      "5-10 horas",
      "10-15 horas",
      "Más de 15 horas"
    ],
    required: true,
  },
  {
    id: 7,
    question: "¿Qué forma de aprender funciona mejor para ti?",
    type: "select",
    options: [
      "Contenido escrito",
      "Videos",
      "Conversaciones/mentoría",
      "Práctica directa/ejercicios",
      "Combinación de varios"
    ],
    required: true,
  }
]
