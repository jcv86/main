'use client'

import { useRouter } from 'next/navigation'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { A2DayPageTemplate } from '@/components/a2-day-page-template'
import { Day1Experience } from '@/components/a2-day1-experience'
import { completeA2Day } from '@/lib/a2/client-completion'

const DIA_NUM = 1

export default function Dia1Page() {
  const router = useRouter()
  const { user } = useAuthRedirect()

  const handleDay1Complete = async (submission: unknown) => {
    const result = await completeA2Day(DIA_NUM, submission)
    router.push(result.nextPath)
    router.refresh()
  }

  return (
    <A2DayPageTemplate dayNumber={DIA_NUM} userId={user?.id}>
      <Day1Experience onComplete={handleDay1Complete} userId={user?.id} />
    </A2DayPageTemplate>
  )
}
