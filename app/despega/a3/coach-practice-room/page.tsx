import { CoachPracticeRoomStudio } from '@/components/a3/coach-practice-room-studio'
import { A3ModuleAccessGate } from '@/components/a3-module-access-gate'

export default function CoachPracticeRoomPage() {
  return (
    <A3ModuleAccessGate
      moduleId="coach-practice-room"
      moduleNumber={6}
      moduleTitle="Sala de Práctica del Coach"
    >
      <CoachPracticeRoomStudio />
    </A3ModuleAccessGate>
  )
}
