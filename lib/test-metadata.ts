import { cerebroTestNames } from "./test-branding"

export const testMetadata = {
  disc: {
    id: "disc",
    name: cerebroTestNames.disc.cerebro,
    shortName: cerebroTestNames.disc.cerebroShort,
    description: cerebroTestNames.disc.description,
    duration: "10-15 minutos",
    questions: 15,
    categories: ["Dominancia", "Influencia", "Estabilidad", "Cumplimiento"],
    icon: "target",
    color: "blue",
    legallyCleared: true,
  },
  mbti: {
    id: "mbti",
    name: cerebroTestNames.mbti.cerebro,
    shortName: cerebroTestNames.mbti.cerebroShort,
    description: cerebroTestNames.mbti.description,
    duration: "15-20 minutos",
    questions: 20,
    categories: ["Energía", "Percepción", "Decisión", "Estilo de Vida"],
    icon: "brain",
    color: "purple",
    legallyCleared: true,
  },
  "big-five": {
    id: "big-five",
    name: cerebroTestNames.bigFive.cerebro,
    shortName: cerebroTestNames.bigFive.cerebroShort,
    description: cerebroTestNames.bigFive.description,
    duration: "15-20 minutos",
    questions: 30,
    categories: ["Apertura", "Responsabilidad", "Extraversión", "Amabilidad", "Neuroticismo"],
    icon: "sparkles",
    color: "green",
    legallyCleared: true,
  },
  riasec: {
    id: "riasec",
    name: cerebroTestNames.riasec.cerebro,
    shortName: cerebroTestNames.riasec.cerebroShort,
    description: cerebroTestNames.riasec.description,
    duration: "12-18 minutos",
    questions: 36,
    categories: ["Realista", "Investigador", "Artístico", "Social", "Emprendedor", "Convencional"],
    icon: "compass",
    color: "orange",
    legallyCleared: true,
  },
  "emotional-intelligence": {
    id: "emotional-intelligence",
    name: cerebroTestNames.emotionalIntelligence.cerebro,
    shortName: cerebroTestNames.emotionalIntelligence.cerebroShort,
    description: cerebroTestNames.emotionalIntelligence.description,
    duration: "10-15 minutos",
    questions: 20,
    categories: ["Autoconciencia", "Autorregulación", "Motivación", "Empatía", "Habilidades Sociales"],
    icon: "heart",
    color: "red",
    legallyCleared: true,
  },
  "soft-skills": {
    id: "soft-skills",
    name: cerebroTestNames.softSkills.cerebro,
    shortName: cerebroTestNames.softSkills.cerebroShort,
    description: cerebroTestNames.softSkills.description,
    duration: "15-20 minutos",
    questions: 30,
    categories: [
      "Comunicación",
      "Liderazgo",
      "Trabajo en Equipo",
      "Resolución de Problemas",
      "Adaptabilidad",
      "Gestión del Tiempo",
    ],
    icon: "users",
    color: "teal",
    legallyCleared: true,
  },
}

export function getTestMetadata(testId: string) {
  return testMetadata[testId as keyof typeof testMetadata]
}

export function getAllTests() {
  return Object.values(testMetadata)
}

export function getLegallyApprovedTests() {
  return Object.values(testMetadata).filter((test) => test.legallyCleared)
}
