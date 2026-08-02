'use client'

import { useRouter } from 'next/navigation'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { A2DayPageTemplate } from '@/components/a2-day-page-template'
import { Day2Experience } from '@/components/a2-day2-experience'
import { completeA2Day } from '@/lib/a2/client-completion'

const DIA_NUM = 2

export default function Dia2Page() {
  const router = useRouter()
  const { user } = useAuthRedirect()

  const handleDay2Complete = async (submission: unknown) => {
    const result = await completeA2Day(DIA_NUM, submission)
    router.push(result.nextPath)
    router.refresh()
  }

  return (
    <A2DayPageTemplate dayNumber={DIA_NUM} userId={user?.id}>
      <Day2Experience onComplete={handleDay2Complete} userId={user?.id} />
    </A2DayPageTemplate>
  )
}
