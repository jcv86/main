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
    brandedName: "Despega Resonancia™",
    shortName: "Resonancia",
    description: "Descubre tu tipo de personalidad y preferencias en el trabajo",
    category: "Personalidad",
    icon: "Brain",
  },
  bigFive: {
    id: "big-five",
    originalName: "Big Five",
    brandedName: "Despega Brújula™",
    shortName: "Brújula",
    description: "Evalúa tus cinco dimensiones principales de comportamiento",
    category: "Personalidad",
    icon: "Users",
  },
  riasec: {
    id: "riasec",
    originalName: "RIASEC",
    brandedName: "Despega Rumbo™",
    shortName: "Rumbo",
    description: "Descubre tu rumbo profesional ideal y las carreras compatibles",
    category: "Vocación",
    icon: "Palette",
  },
  emotionalIntelligence: {
    id: "emotional-intelligence",
    originalName: "Emotional Intelligence",
    brandedName: "Despega Empatía™",
    shortName: "Empatía",
    description: "Evalúa tu inteligencia emocional y capacidad de empatía",
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
