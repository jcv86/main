'use client'

import { useRouter } from 'next/navigation'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { A2DayPageTemplate } from '@/components/a2-day-page-template'
import { Day6Experience } from '@/components/a2-day6-experience'
import { completeA2Day } from '@/lib/a2/client-completion'

const DIA_NUM = 6

export default function Dia6Page() {
  const router = useRouter()
  const { user } = useAuthRedirect()

  const handleDay6Complete = async (submission: unknown) => {
    const result = await completeA2Day(DIA_NUM, submission)
    router.push(result.nextPath)
    router.refresh()
  }

  return (
    <A2DayPageTemplate dayNumber={DIA_NUM} userId={user?.id}>
      <Day6Experience onComplete={handleDay6Complete} userId={user?.id} />
    </A2DayPageTemplate>
  )
}
