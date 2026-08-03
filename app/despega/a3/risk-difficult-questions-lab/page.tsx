import { DifficultQuestionsStudio } from '@/components/a3/difficult-questions-studio'
import { A3ModuleAccessGate } from '@/components/a3-module-access-gate'

export default function DifficultQuestionsPage() {
  return (
    <A3ModuleAccessGate
      moduleId="risk-difficult-questions-lab"
      moduleNumber={9}
      moduleTitle="Laboratorio de Preguntas Difíciles"
    >
      <DifficultQuestionsStudio />
    </A3ModuleAccessGate>
  )
}
