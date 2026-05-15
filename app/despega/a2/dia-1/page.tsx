'use client'

import { useRouter } from 'next/navigation'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { A2DayPageTemplate } from '@/components/a2-day-page-template'
import { Day1Experience } from '@/components/a2-day1-experience'
import { markTaskComplete } from '@/lib/supabase/task-completions'

const DIA_NUM = 1

export default function Dia1Page() {
  const router = useRouter()
  const { user } = useAuthRedirect()

  const handleDay1Complete = async (submission: any) => {
    try {
      console.log('[v0] Day 1 submission saved:', submission)

      // Mark this task as complete in Supabase
      if (user?.id) {
        await markTaskComplete(30, 1, 'Día 1')
        console.log('[v0] Task marked complete: Día 1')
      }

      // Navigate to A2 progress dashboard with anchor to día-2
      router.push('/despega/a2-routes#dia-2')
    } catch (err) {
      console.error('[v0] Error saving Day 1:', err)
      throw err
    }
  }

  return (
    <A2DayPageTemplate dayNumber={DIA_NUM} userId={user?.id}>
      <Day1Experience onComplete={handleDay1Complete} userId={user?.id} />
    </A2DayPageTemplate>
  )
}
