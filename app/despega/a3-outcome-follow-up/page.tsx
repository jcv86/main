'use client'

import { A3InterviewOutcomeForm } from '@/components/outcomes/a3-interview-outcome-form'

export default function A3OutcomeFollowUpPage() {
  const router = useRouter()
  const [completed, setCompleted] = useState(false)
  return (
    <PageContainer className="max-w-3xl">
      <PageStack>
        <A3InterviewOutcomeForm role="follow_up" onSaved={() => setCompleted(true)} />
        <Button type="button" onClick={() => router.push('/despega/a3')} disabled={!completed} className="w-full">
          {completed ? 'Volver a Entrenamiento' : 'Guarda la medición para continuar'}
        </Button>
      </PageStack>
    </PageContainer>
  )
}
