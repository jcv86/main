'use client'

import {
  VerifiedCoachSession,
  type VerifiedCoachQuestion,
} from '@/components/a3/verified-coach-session'

const QUESTIONS: VerifiedCoachQuestion[] = [
  {
    id: 'project-value',
    question: '¿Qué valor entregaste en una experiencia laboral concreta?',
    guidance:
      'Describe un proyecto específico, tu intervención y el resultado observable que produjo.',
    prompts: ['Contexto del proyecto', 'Acción propia', 'Resultado o cambio producido'],
  },
  {
    id: 'critical-value',
    question: '¿Cuál fue el valor más importante dentro de esa experiencia?',
    guidance:
      'Distingue el valor central de la tarea ejecutada y explica por qué fue relevante para el equipo o negocio.',
    prompts: ['Valor central', 'Quién se benefició', 'Por qué importó'],
  },
  {
    id: 'future-application',
    question: '¿Cómo podrías aplicar ese valor en un rol futuro?',
    guidance:
      'Conecta la experiencia con un problema, responsabilidad o resultado que podría repetirse en otro contexto.',
    prompts: ['Rol o contexto futuro', 'Problema equivalente', 'Evidencia transferible'],
  },
  {
    id: 'next-action',
    question: '¿Cuál será tu siguiente acción para comunicar este valor?',
    guidance:
      'Define una acción concreta y verificable para convertir la experiencia en material de entrevista o CV.',
    prompts: ['Acción específica', 'Formato del activo', 'Momento de uso'],
  },
]

export default function ValueMiningLabCoachPage() {
  return (
    <VerifiedCoachSession
      moduleId="value-mining-lab"
      moduleNumber={2}
      title="Laboratorio de Minería de Valor"
      questions={QUESTIONS}
      buildDeliverable={(responses) => ({
        projectValue: responses[0] || '',
        criticalValue: responses[1] || '',
        futureApplication: responses[2] || '',
        nextAction: responses[3] || '',
      })}
    />
  )
}
