import { redirect } from 'next/navigation'

const LEGACY_MODULE_DESTINATIONS: Record<string, string> = {
  'auditoria-inicial': '/despega/a3/career-mirror',
  'metodo-star': '/despega/a3/value-mining-lab',
  'cv-inteligente': '/despega/a3/cv-builder-studio',
  'analisis-vacante': '/despega/a3/job-decoder',
  'analisis-multimodal': '/despega/a3/answer-architecture',
  'entrenamiento-guiado': '/despega/a3/coach-practice-room',
  'entrenamiento-estructurado': '/despega/a3/first-recruiter-simulation',
  'entrenamiento-desafiante': '/despega/a3/risk-difficult-questions-lab',
  'entrenamiento-conversacional': '/despega/a3/communication-gym',
  'simulacion-real': '/despega/a3/basic-interview-mission',
}

export default async function LegacyGuidedLessonPage({
  params,
}: {
  params: Promise<{ moduleId: string; lessonId: string }>
}) {
  const { moduleId } = await params
  redirect(LEGACY_MODULE_DESTINATIONS[moduleId] || '/despega/a3')
}
