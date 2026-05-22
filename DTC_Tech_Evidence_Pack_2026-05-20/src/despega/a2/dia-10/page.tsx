'use client'

import { useRouter } from 'next/navigation'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { A2DayPageTemplate } from '@/components/a2-day-page-template'
import { Day10Experience } from '@/components/a2-day10-experience'
import { markTaskComplete } from '@/lib/supabase/task-completions'

const DIA_NUM = 10

export default function Dia10Page() {
  const router = useRouter()
  const { user } = useAuthRedirect()

  const handleDay10Complete = async (submission: any) => {
    try {
      console.log('[v0] Day 10 submission saved:', submission)
      if (user?.id) {
        await markTaskComplete(30, 10, 'Día 10')
      }
      router.push('/despega/a2-routes')
    } catch (err) {
      console.error('[v0] Error saving Day 10:', err)
      throw err
    }
  }

  return (
    <A2DayPageTemplate dayNumber={DIA_NUM} userId={user?.id}>
      <Day10Experience onComplete={handleDay10Complete} userId={user?.id} />
    </A2DayPageTemplate>
  )
}
