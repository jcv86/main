'use client'

import { useRouter } from 'next/navigation'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { A2DayPageTemplate } from '@/components/a2-day-page-template'
import { Day4Experience } from '@/components/a2-day4-experience'
import { completeA2Day } from '@/lib/a2/client-completion'

const DIA_NUM = 4

export default function Dia4Page() {
  const router = useRouter()
  const { user } = useAuthRedirect()

  const handleDay4Complete = async (submission: unknown) => {
    const result = await completeA2Day(DIA_NUM, submission)
    router.push(result.nextPath)
    router.refresh()
  }

  return (
    <A2DayPageTemplate dayNumber={DIA_NUM} userId={user?.id}>
      <Day4Experience onComplete={handleDay4Complete} userId={user?.id} />
    </A2DayPageTemplate>
  )
}
