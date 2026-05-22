// Conozcámonos 2 - 14 preguntas POST-Informe en 2 pasos
// Paso 1: 9 preguntas para generar Ruta 30 días (OBLIGATORIO)
// Paso 2: 5 preguntas para generar Ruta 60/90 días (OPCIONAL)

export const CONOZCAMONOS_2_PASO_1_QUESTIONS = [
  {
    id: 1,
    question: "¿Cuál es tu principal área de enfoque para esta transformación?",
    type: "select",
    options: [
      "Productividad y efectividad",
      "Liderazgo y influencia",
      "Relaciones interpersonales",
      "Equilibrio vida-trabajo",
      "Crecimiento profesional",
      "Confianza en mí mismo"
    ],
    required: true,
  },
  {
    id: 2,
    question: "¿Cuáles son tus 3 mayores obstáculos para el cambio?",
    type: "text",
    placeholder: "Ej: tiempo limitado, falta de motivación, miedo al fracaso...",
    maxLength: 300,
    required: true,
  },
  {
    id: 3,
    question: "¿Cuántos días a la semana puedes dedicar acciones concretas?",
    type: "select",
    options: [
      "1 día",
      "2-3 días",
      "4-5 días",
      "Todos los días"
    ],
    required: true,
  },
  {
    id: 4,
    question: "¿Cuánto tiempo por sesión puedes dedicar?",
    type: "select",
    options: [
      "15-30 minutos",
      "30-60 minutos",
      "1-2 horas",
      "Más de 2 horas"
    ],
    required: true,
  },
  {
    id: 5,
    question: "¿Cuál es tu estilo preferido para recibir apoyo?",
    type: "select",
    options: [
      "Solo, con un plan claro",
      "Con un mentor o coach",
      "En un grupo de apoyo",
      "Combinación de varios"
    ],
    required: true,
  },
  {
    id: 6,
    question: "¿Qué métrica usarías para medir tu éxito en 30 días?",
    type: "text",
    placeholder: "Ej: completar 10 acciones, mejorar relación con mi jefe, dormir mejor...",
    maxLength: 300,
    required: true,
  },
  {
    id: 7,
    question: "¿Cuál es tu mayor miedo al empezar esta transformación?",
    type: "text",
    placeholder: "Sé honesto sobre lo que te preocupa...",
    maxLength: 300,
    required: true,
  },
  {
    id: 8,
    question: "¿Hay alguien en tu vida que pueda apoyarte en este proceso?",
    type: "select",
    options: [
      "Sí, una persona",
      "Sí, varias personas",
      "No tengo apoyo actualmente",
      "Prefiero hacerlo solo"
    ],
    required: true,
  },
  {
    id: 9,
    question: "¿Qué acción pequeña tomarías HOY si tuvieras energía ilimitada?",
    type: "text",
    placeholder: "¿Qué harías ahora mismo?",
    maxLength: 300,
    required: true,
  }
]

export const CONOZCAMONOS_2_PASO_2_QUESTIONS = [
  {
    id: 10,
    question: "¿Cuál es tu visión a los 60 días?",
    type: "text",
    placeholder: "¿Dónde te ves en 2 meses?",
    maxLength: 300,
    required: false,
  },
  {
    id: 11,
    question: "¿Cuál es tu visión a los 90 días?",
    type: "text",
    placeholder: "¿Dónde te ves en 3 meses?",
    maxLength: 300,
    required: false,
  },
  {
    id: 12,
    question: "¿Qué habilidad nueva quieres desarrollar?",
    type: "text",
    placeholder: "Ej: liderazgo, comunicación, delegación...",
    maxLength: 200,
    required: false,
  },
  {
    id: 13,
    question: "¿Cuál será tu 'victoria temprana' en la primera semana?",
    type: "text",
    placeholder: "Una win pequeña pero significativa",
    maxLength: 200,
    required: false,
  },
  {
    id: 14,
    question: "¿Algo más que debería saber sobre ti para tu ruta?",
    type: "text",
    placeholder: "Contexto adicional...",
    maxLength: 300,
    required: false,
  }
]
