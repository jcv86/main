'use client'

import { useRouter } from 'next/navigation'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { A2DayPageTemplate } from '@/components/a2-day-page-template'
import { Day4Experience } from '@/components/a2-day4-experience'
import { markTaskComplete } from '@/lib/supabase/task-completions'

const DIA_NUM = 4

export default function Dia4Page() {
  const router = useRouter()
  const { user } = useAuthRedirect()

  const handleDay4Complete = async (submission: any) => {
    try {
      console.log('[v0] Day 4 submission saved:', submission)
      if (user?.id) {
        await markTaskComplete(30, 4, 'Día 4')
      }
      router.push('/despega/a2-routes#dia-5')
    } catch (err) {
      console.error('[v0] Error saving Day 4:', err)
      throw err
    }
  }

  return (
    <A2DayPageTemplate dayNumber={DIA_NUM} userId={user?.id}>
      <Day4Experience onComplete={handleDay4Complete} userId={user?.id} />
    </A2DayPageTemplate>
  )
}
