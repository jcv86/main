'use client'

import { useRouter } from 'next/navigation'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { A2DayPageTemplate } from '@/components/a2-day-page-template'
import { Day3Experience } from '@/components/a2-day3-experience'
import { completeA2Day } from '@/lib/a2/client-completion'

const DIA_NUM = 3

export default function Dia3Page() {
  const router = useRouter()
  const { user } = useAuthRedirect()

  const handleDay3Complete = async (submission: unknown) => {
    const result = await completeA2Day(DIA_NUM, submission)
    router.push(result.nextPath)
    router.refresh()
  }

  return (
    <A2DayPageTemplate dayNumber={DIA_NUM} userId={user?.id}>
      <Day3Experience onComplete={handleDay3Complete} userId={user?.id} />
    </A2DayPageTemplate>
  )
}
