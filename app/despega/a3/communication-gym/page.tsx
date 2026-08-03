import { CommunicationGymStudio } from '@/components/a3/communication-gym-studio'
import { A3ModuleAccessGate } from '@/components/a3-module-access-gate'

export default function CommunicationGymPage() {
  return (
    <A3ModuleAccessGate
      moduleId="communication-gym"
      moduleNumber={7}
      moduleTitle="Gimnasio de Comunicación"
    >
      <CommunicationGymStudio />
    </A3ModuleAccessGate>
  )
}
