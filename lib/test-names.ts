// Despega Tu Carrera - Test Branding System
// All test names are legally safe and branded with "Despega"

export const TEST_NAMES = {
  disc: {
    id: "disc",
    originalName: "DISC",
    brandedName: "Despega Cerebral™",
    shortName: "Cerebral",
    description: "Descubre tu estilo de comportamiento y preferencias de comunicación profesional",
    category: "Comportamiento",
    icon: "Target",
  },
  mbti: {
    id: "mbti",
    originalName: "MBTI",
    brandedName: "Mapa de Personalidad Despega™",
    shortName: "Mapa Personal",
    description: "Identifica tu tipo de personalidad y preferencias psicológicas",
    category: "Personalidad",
    icon: "Brain",
  },
  bigFive: {
    id: "big-five",
    originalName: "Big Five",
    brandedName: "5 Dimensiones Despega™",
    shortName: "5 Dimensiones",
    description: "Evaluación integral de personalidad en cinco dimensiones principales",
    category: "Personalidad",
    icon: "Users",
  },
  riasec: {
    id: "riasec",
    originalName: "RIASEC",
    brandedName: "Brújula Vocacional Despega™",
    shortName: "Brújula Vocacional",
    description: "Descubre tus intereses profesionales y carreras compatibles",
    category: "Vocación",
    icon: "Palette",
  },
  emotionalIntelligence: {
    id: "emotional-intelligence",
    originalName: "Emotional Intelligence",
    brandedName: "Inteligencia Emocional Despega™",
    shortName: "IE Despega",
    description: "Evalúa tu capacidad para reconocer, entender y gestionar emociones",
    category: "Inteligencia",
    icon: "Heart",
  },
  softSkills: {
    id: "soft-skills",
    originalName: "Soft Skills",
    brandedName: "Competencias Despega™",
    shortName: "Competencias",
    description: "Evalúa tus habilidades interpersonales y competencias profesionales",
    category: "Competencias",
    icon: "Star",
  },
} as const

export type TestId = keyof typeof TEST_NAMES

export function getTestName(testId: TestId, format: "branded" | "short" | "original" = "branded"): string {
  const test = TEST_NAMES[testId]
  if (!test) return testId

  switch (format) {
    case "branded":
      return test.brandedName
    case "short":
      return test.shortName
    case "original":
      return test.originalName
    default:
      return test.brandedName
  }
}

export function getAllTests() {
  return Object.values(TEST_NAMES)
}
