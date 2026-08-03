'use client'

import { useRouter } from 'next/navigation'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { A2DayPageTemplate } from '@/components/a2-day-page-template'
import { Day7Experience } from '@/components/a2-day7-experience'
import { completeA2Day } from '@/lib/a2/client-completion'

const DIA_NUM = 7

export default function Dia7Page() {
  const router = useRouter()
  const { user } = useAuthRedirect()

  const handleDay7Complete = async (submission: unknown) => {
    const result = await completeA2Day(DIA_NUM, submission)
    router.push(result.nextPath)
    router.refresh()
  }

  return (
    <A2DayPageTemplate dayNumber={DIA_NUM} userId={user?.id}>
      <Day7Experience onComplete={handleDay7Complete} userId={user?.id} />
    </A2DayPageTemplate>
  )
}
