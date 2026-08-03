import { JobDecoderStudio } from '@/components/a3/job-decoder-studio'
import { A3ModuleAccessGate } from '@/components/a3-module-access-gate'

export default function JobDecoderPage() {
  return (
    <A3ModuleAccessGate
      moduleId="job-decoder"
      moduleNumber={4}
      moduleTitle="Decodificador de Ofertas"
    >
      <JobDecoderStudio />
    </A3ModuleAccessGate>
  )
}
