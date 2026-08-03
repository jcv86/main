import { BasicInterviewMissionStudio } from '@/components/a3/basic-interview-mission-studio'
import { A3ModuleAccessGate } from '@/components/a3-module-access-gate'

export default function BasicInterviewMissionPage() {
  return (
    <A3ModuleAccessGate
      moduleId="basic-interview-mission"
      moduleNumber={10}
      moduleTitle="Misión de Entrevista Básica"
    >
      <BasicInterviewMissionStudio />
    </A3ModuleAccessGate>
  )
}
