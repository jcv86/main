import { FirstRecruiterSimulationStudio } from '@/components/a3/first-recruiter-simulation-studio'
import { A3ModuleAccessGate } from '@/components/a3-module-access-gate'

export default function FirstRecruiterSimulationPage() {
  return (
    <A3ModuleAccessGate
      moduleId="first-recruiter-simulation"
      moduleNumber={8}
      moduleTitle="Primera Simulación con Reclutador"
    >
      <FirstRecruiterSimulationStudio />
    </A3ModuleAccessGate>
  )
}
