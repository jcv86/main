'use client'

import { useRouter } from 'next/navigation'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { A2DayPageTemplate } from '@/components/a2-day-page-template'
import { Day5Experience } from '@/components/a2-day5-experience'
import { completeA2Day } from '@/lib/a2/client-completion'

const DIA_NUM = 5

export default function Dia5Page() {
  const router = useRouter()
  const { user } = useAuthRedirect()

  const handleDay5Complete = async (submission: unknown) => {
    const result = await completeA2Day(DIA_NUM, submission)
    router.push(result.nextPath)
    router.refresh()
  }

  return (
    <A2DayPageTemplate dayNumber={DIA_NUM} userId={user?.id}>
      <Day5Experience onComplete={handleDay5Complete} userId={user?.id} />
    </A2DayPageTemplate>
  )
}
