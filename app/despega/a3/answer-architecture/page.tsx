import { AnswerArchitectureStudio } from '@/components/a3/answer-architecture-studio'
import { A3ModuleAccessGate } from '@/components/a3-module-access-gate'

export default function AnswerArchitecturePage() {
  return (
    <A3ModuleAccessGate
      moduleId="answer-architecture"
      moduleNumber={5}
      moduleTitle="Arquitectura de Respuestas"
    >
      <AnswerArchitectureStudio />
    </A3ModuleAccessGate>
  )
}
