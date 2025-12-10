export const TEST_CONFIG = {
  DISC: {
    id: "DISC",
    name: "Despega Cerebral",
    description: "Descubre tu estilo de comportamiento profesional",
    duration: 5,
    questions: 24,
    route: "/test/disc",
  },
  "Emotional Intelligence": {
    id: "Emotional Intelligence",
    name: "Inteligencia Emocional Despega",
    description: "Reconocer, comprender y gestionar emociones",
    duration: 10,
    questions: 20,
    route: "/test/emotional-intelligence",
  },
  MBTI: {
    id: "MBTI",
    name: "Mapa de Personalidad Despega",
    description: "Descubre tu tipo de personalidad Myers-Briggs",
    duration: 15,
    questions: 60,
    route: "/test/mbti",
  },
  "Big Five": {
    id: "Big Five",
    name: "5 Dimensiones Despega",
    description: "Evalúa tus 5 dimensiones de personalidad",
    duration: 10,
    questions: 50,
    route: "/test/big-five",
  },
  RIASEC: {
    id: "RIASEC",
    name: "Brújula Vocacional Despega",
    description: "Explora tus intereses vocacionales",
    duration: 10,
    questions: 48,
    route: "/test/riasec",
  },
  "Soft Skills": {
    id: "Soft Skills",
    name: "Competencias Despega",
    description: "Evalúa tus habilidades blandas clave",
    duration: 12,
    questions: 40,
    route: "/test/soft-skills",
  },
} as const

export type TestType = keyof typeof TEST_CONFIG

export function getTestConfig(testType: TestType) {
  return TEST_CONFIG[testType]
}

export function getTestIdByName(name: string): TestType | null {
  const entry = Object.entries(TEST_CONFIG).find(([_, config]) => config.name === name)
  return entry ? (entry[0] as TestType) : null
}
