// Cerebro Intel Test Branding System
// All test names are original and legally safe

export const cerebroTestNames = {
  mbti: {
    original: "MBTI",
    cerebro: "Perfil de Personalidad Cerebro",
    cerebroShort: "PPC",
    english: "Cerebro Personality Profile",
    englishShort: "CPP",
    description: "Descubre tu tipo de personalidad único basado en 4 dimensiones cognitivas",
  },

  disc: {
    original: "DISC",
    cerebro: "Estilo de Comportamiento Cerebro",
    cerebroShort: "ECC",
    english: "Cerebro Behavioral Style",
    englishShort: "CBS",
    description: "Identifica tu estilo natural de comunicación y trabajo",
  },

  // Big Five is safe but we'll rebrand for consistency
  bigFive: {
    original: "Big Five",
    cerebro: "Análisis de Rasgos Cerebro",
    cerebroShort: "ARC",
    english: "Cerebro Traits Analysis",
    englishShort: "CTA",
    description: "Evaluación científica de 5 dimensiones fundamentales de personalidad",
  },

  // RIASEC is safe but we'll rebrand
  riasec: {
    original: "RIASEC",
    cerebro: "Perfil de Intereses Profesionales Cerebro",
    cerebroShort: "PIPC",
    english: "Cerebro Career Interests Profile",
    englishShort: "CCIP",
    description: "Descubre tus intereses vocacionales y carreras ideales",
  },

  // Emotional Intelligence - rebrand for consistency
  emotionalIntelligence: {
    original: "Emotional Intelligence",
    cerebro: "Inteligencia Emocional Cerebro",
    cerebroShort: "IEC",
    english: "Cerebro Emotional Intelligence",
    englishShort: "CEI",
    description: "Mide tu capacidad para reconocer y gestionar emociones",
  },

  // Soft Skills - rebrand for consistency
  softSkills: {
    original: "Soft Skills",
    cerebro: "Competencias Profesionales Cerebro",
    cerebroShort: "CPC",
    english: "Cerebro Professional Competencies",
    englishShort: "CPC",
    description: "Evalúa tus habilidades blandas esenciales para el éxito profesional",
  },
}

export function getCerebroTestName(testType: string, language: "es" | "en" = "es"): string {
  const test = cerebroTestNames[testType as keyof typeof cerebroTestNames]
  if (!test) return testType
  return language === "es" ? test.cerebro : test.english
}

export function getCerebroTestShort(testType: string): string {
  const test = cerebroTestNames[testType as keyof typeof cerebroTestNames]
  if (!test) return testType.toUpperCase()
  return test.cerebroShort
}
