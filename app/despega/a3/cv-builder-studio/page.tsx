import { CvBuilderStudio } from '@/components/a3/cv-builder-studio'
import { A3ModuleAccessGate } from '@/components/a3-module-access-gate'

export default function CvBuilderStudioPage() {
  return (
    <A3ModuleAccessGate
      moduleId="cv-builder-studio"
      moduleNumber={3}
      moduleTitle="Estudio Constructor de CV"
    >
      <CvBuilderStudio />
    </A3ModuleAccessGate>
  )
}
