'use client'

import { useRouter } from 'next/navigation'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { A2DayPageTemplate } from '@/components/a2-day-page-template'
import { Day9Experience } from '@/components/a2-day9-experience'
import { markTaskComplete } from '@/lib/supabase/task-completions'

const DIA_NUM = 9

export default function Dia9Page() {
  const router = useRouter()
  const { user } = useAuthRedirect()

  const handleDay9Complete = async (submission: any) => {
    try {
      console.log('[v0] Day 9 submission saved:', submission)
      if (user?.id) {
        await markTaskComplete(30, 9, 'Día 9')
      }
      router.push('/despega/a2-routes#dia-10')
    } catch (err) {
      console.error('[v0] Error saving Day 9:', err)
      throw err
    }
  }

  return (
    <A2DayPageTemplate dayNumber={DIA_NUM} userId={user?.id}>
      <Day9Experience onComplete={handleDay9Complete} userId={user?.id} />
    </A2DayPageTemplate>
  )
}
