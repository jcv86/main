'use client'

import {
  VerifiedCoachSession,
  type VerifiedCoachQuestion,
} from '@/components/a3/verified-coach-session'

const QUESTIONS: VerifiedCoachQuestion[] = [
  {
    id: 'career-direction',
    question: '¿Cuál es tu principal dirección de carrera?',
    guidance:
      'Describe el rol, industria o especialidad hacia la que quieres avanzar y el contexto donde tendría sentido.',
    prompts: ['Rol objetivo', 'Industria o entorno', 'Tipo de impacto que buscas'],
  },
  {
    id: 'professional-identity',
    question: '¿Cómo describirías tu identidad profesional actual?',
    guidance:
      'Conecta tu especialidad, tu diferenciador y la forma en que trabajas en una descripción concreta.',
    prompts: ['Especialidad', 'Diferenciador', 'Forma de trabajo'],
  },
  {
    id: 'core-values',
    question: '¿Cuáles son los valores que definen tu carrera?',
    guidance:
      'Explica qué condiciones orientan tus decisiones profesionales y cómo se observan en tu experiencia.',
    prompts: ['Valores prioritarios', 'Ejemplo observable', 'Tensión o decisión asociada'],
  },
  {
    id: 'personal-brand',
    question: '¿Cómo quieres que un reclutador comprenda tu marca profesional?',
    guidance:
      'Resume el posicionamiento que quieres comunicar, el valor que entregas y la evidencia que lo respalda.',
    prompts: ['Posicionamiento', 'Valor entregado', 'Evidencia principal'],
  },
]

export default function CareerMirrorCoachPage() {
  return (
    <VerifiedCoachSession
      moduleId="career-mirror"
      moduleNumber={1}
      title="Espejo de Carrera"
      questions={QUESTIONS}
      buildDeliverable={(responses) => ({
        careerDirection: responses[0] || '',
        professionalIdentity: responses[1] || '',
        coreValues: responses[2] || '',
        personalBrand: responses[3] || '',
      })}
    />
  )
}
