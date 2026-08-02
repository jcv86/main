'use client'

import { useRouter } from 'next/navigation'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { A2DayPageTemplate } from '@/components/a2-day-page-template'
import { Day10Experience } from '@/components/a2-day10-experience'
import { completeA2Day } from '@/lib/a2/client-completion'

const DIA_NUM = 10

export default function Dia10Page() {
  const router = useRouter()
  const { user } = useAuthRedirect()

  const handleDay10Complete = async (submission: unknown) => {
    const result = await completeA2Day(DIA_NUM, submission)
    router.push(result.nextPath)
    router.refresh()
  }

  return (
    <A2DayPageTemplate dayNumber={DIA_NUM} userId={user?.id}>
      <Day10Experience onComplete={handleDay10Complete} userId={user?.id} />
    </A2DayPageTemplate>
  )
}
