// Despega Cerebral - Complete Nomenclature System based on DISC
// Maps DISC dimensions to Despega Cerebral archetypes with full descriptions

export const DESPEGA_PROFILES = {
  // Primary DISC mappings
  D: {
    nombre: "El Impulsor",
    nombreProfesional: "Ejecutivo Ágil",
    nombrePersonal: "Pionero",
    color: "#EF4444", // Rojo DISC
    colorHex: "ef4444",
    colorTw: "red",
    emoji: "⚡",
    arquetipo: "Líder Decisivo",
    fraseClave: "Mueve montañas con determinación",
    caracteristicas: [
      "Decide rápido y ejecuta con determinación",
      "Desafía el status quo y busca cambios",
      "Orientado a resultados y metas",
      "Toma riesgos calculados",
      "Lidera con visión clara",
    ],
    fortalezas: [
      "Capacidad de decisión rápida",
      "Impulsa cambios transformacionales",
      "Resuelve problemas complejos",
      "Inspira acción en otros",
    ],
    oportunidades: [
      "Escucha más antes de decidir",
      "Desarrolla paciencia en procesos",
      "Considera perspectivas diferentes",
      "Equilibra velocidad con reflexión",
    ],
    libroRecomendado1: {
      titulo: "Start with Why",
      autor: "Simon Sinek",
      descripcion: "Descubre el propósito profundo detrás de tus impulsos y decisiones",
    },
    libroRecomendado2: {
      titulo: "The 4-Hour Work Week",
      autor: "Tim Ferriss",
      descripcion: "Optimiza y automatiza para maximizar tu impacto",
    },
  },

  I: {
    nombre: "El Catalizador",
    nombreProfesional: "Líder Inspirador",
    nombrePersonal: "Motivador",
    color: "#F59E0B", // Ámbar DISC (Influencia)
    colorHex: "f59e0b",
    colorTw: "amber",
    emoji: "✨",
    arquetipo: "Conector Inspirador",
    fraseClave: "Conecta personas, genera movimiento",
    caracteristicas: [
      "Conecta naturalmente con otros",
      "Inspira y motiva mediante entusiasmo",
      "Comunicador persuasivo y carismático",
      "Busca reconocimiento y visibilidad",
      "Energía contagiosa",
    ],
    fortalezas: [
      "Capacidad de influencia natural",
      "Comunicación persuasiva",
      "Construye redes valiosas",
      "Inspira pasión en proyectos",
    ],
    oportunidades: [
      "Desarrolla disciplina y seguimiento",
      "Equilibra entusiasmo con realismo",
      "Construye credibilidad a largo plazo",
      "Profundiza en detalles técnicos",
    ],
    libroRecomendado1: {
      titulo: "How to Win Friends and Influence People",
      autor: "Dale Carnegie",
      descripcion: "Domina el arte de la conexión genuina e influencia positiva",
    },
    libroRecomendado2: {
      titulo: "Contagious",
      autor: "Jonah Berger",
      descripcion: "Aprende por qué ideas se propagan y cómo hacerlas virales",
    },
  },

  S: {
    nombre: "El Estabilizador",
    nombreProfesional: "Gestor de Equipos",
    nombrePersonal: "Apoyo Confiable",
    color: "#10B981", // Verde DISC (Estabilidad)
    colorHex: "10b981",
    colorTw: "emerald",
    emoji: "🌱",
    arquetipo: "Base Confiable",
    fraseClave: "Construye bases sólidas",
    caracteristicas: [
      "Paciente y considerado",
      "Confiable y leal",
      "Trabajo en equipo natural",
      "Busca armonía y estabilidad",
      "Servicial y empático",
    ],
    fortalezas: [
      "Crea ambientes de confianza",
      "Escucha activamente",
      "Mantiene estabilidad en crisis",
      "Construye relaciones duraderas",
    ],
    oportunidades: [
      "Toma iniciativa y riesgos",
      "Acelera en momentos necesarios",
      "Comunica límites claros",
      "Asume liderazgo cuando corresponde",
    ],
    libroRecomendado1: {
      titulo: "The Power of Now",
      autor: "Eckhart Tolle",
      descripcion: "Profundiza en la presencia y la paz interior",
    },
    libroRecomendado2: {
      titulo: "Radical Candor",
      autor: "Kim Scott",
      descripcion: "Lidera con cuidado genuino y claridad directa",
    },
  },

  C: {
    nombre: "El Arquitecto",
    nombreProfesional: "Estratega Analítico",
    nombrePersonal: "Pensador Estratégico",
    color: "#3B82F6", // Azul DISC (Cumplimiento)
    colorHex: "3b82f6",
    colorTw: "blue",
    emoji: "🏗️",
    arquetipo: "Diseñador de Sistemas",
    fraseClave: "Diseña sistemas que funcionan",
    caracteristicas: [
      "Analítico y estratégico",
      "Busca precisión y calidad",
      "Piensa en sistemas y procesos",
      "Cauteloso y metodológico",
      "Orientado a evidencia",
    ],
    fortalezas: [
      "Pensamiento estratégico profundo",
      "Identifica riesgos y oportunidades",
      "Crea procesos eficientes",
      "Garantiza calidad y excelencia",
    ],
    oportunidades: [
      "Acelera toma de decisiones",
      "Comunica con más empatía",
      "Delega más frecuentemente",
      "Acepta lo 'suficientemente bueno'",
    ],
    libroRecomendado1: {
      titulo: "Thinking, Fast and Slow",
      autor: "Daniel Kahneman",
      descripcion: "Comprende cómo decides realmente y mejora tu análisis",
    },
    libroRecomendado2: {
      titulo: "The Systems Bible",
      autor: "John Gall",
      descripcion: "Domina el arte de diseñar sistemas complejos",
    },
  },
} as const;

// Hybrid profiles (combinations)
export const DESPEGA_HYBRID_PROFILES = {
  "D-I": {
    nombre: "El Emprendedor",
    descripcion: "Impulsor + Catalizador: Lidera con visión y carisma",
    colores: ["#EF4444", "#F59E0B"],
    caracteristicas: ["Ambicioso", "Inspirador", "Orientado a resultados", "Carismático"],
  },
  "D-C": {
    nombre: "El Estratega",
    descripcion: "Impulsor + Arquitecto: Ejecuta estrategias complejas",
    colores: ["#EF4444", "#3B82F6"],
    caracteristicas: ["Decidido", "Analítico", "Sistemático", "Competitivo"],
  },
  "D-S": {
    nombre: "El Gestor",
    descripcion: "Impulsor + Estabilizador: Lidera con firmeza y consideración",
    colores: ["#EF4444", "#10B981"],
    caracteristicas: ["Decidido", "Leal", "Responsable", "Confiable"],
  },
  "I-C": {
    nombre: "El Consultor",
    descripcion: "Catalizador + Arquitecto: Persuade con datos y evidencia",
    colores: ["#F59E0B", "#3B82F6"],
    caracteristicas: ["Comunicativo", "Analítico", "Persuasivo", "Estratégico"],
  },
  "I-S": {
    nombre: "El Facilitador",
    descripcion: "Catalizador + Estabilizador: Conecta y armoniza equipos",
    colores: ["#F59E0B", "#10B981"],
    caracteristicas: ["Inspirador", "Empático", "Colaborativo", "Leal"],
  },
  "S-C": {
    nombre: "El Analista",
    descripcion: "Estabilizador + Arquitecto: Profundiza con cuidado y precisión",
    colores: ["#10B981", "#3B82F6"],
    caracteristicas: ["Meticuloso", "Reflexivo", "Confiable", "Sistemático"],
  },
} as const;

// Contexto: Personal vs Profesional
export const CONTEXT_ADAPTATIONS = {
  personal: {
    nombreSufijo: "",
    enfoque: "desarrollo personal y relaciones",
    actionPlan: "Enfoque en crecimiento personal y bienestar",
  },
  profesional: {
    nombreSufijo: "(Profesional)",
    enfoque: "rendimiento profesional y liderazgo",
    actionPlan: "Enfoque en desarrollo de competencias y carrera",
  },
} as const;

// Helper function to get profile with context
export function getDespegarProfile(
  discDimension: "D" | "I" | "S" | "C",
  context: "personal" | "profesional" = "profesional"
) {
  const profile = DESPEGA_PROFILES[discDimension];
  const nombreBase =
    context === "profesional" ? profile.nombreProfesional : profile.nombrePersonal;

  return {
    ...profile,
    nombre: nombreBase,
  };
}

// Helper function to get hybrid profile
export function getHybridProfile(
  dimension1: "D" | "I" | "S" | "C",
  dimension2: "D" | "I" | "S" | "C"
) {
  const key = [dimension1, dimension2].sort().join("-") as keyof typeof DESPEGA_HYBRID_PROFILES;
  return DESPEGA_HYBRID_PROFILES[key] || null;
}

// Get book recommendations
export function getBookRecommendations(discDimension: "D" | "I" | "S" | "C") {
  const profile = DESPEGA_PROFILES[discDimension];
  return [profile.libroRecomendado1, profile.libroRecomendado2];
}

// Get color for dimension
export function getProfileColor(discDimension: "D" | "I" | "S" | "C") {
  return DESPEGA_PROFILES[discDimension].color;
}

// All dimensions in order
export const DIMENSIONS = ["D", "I", "S", "C"] as const;
export const DIMENSION_NAMES = {
  D: "Impulsor",
  I: "Catalizador",
  S: "Estabilizador",
  C: "Arquitecto",
} as const;
