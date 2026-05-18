'use client'

import { useRouter } from 'next/navigation'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { A2DayPageTemplate } from '@/components/a2-day-page-template'
import { Day2Experience } from '@/components/a2-day2-experience'
import { markTaskComplete } from '@/lib/supabase/task-completions'

const DIA_NUM = 2

export default function Dia2Page() {
  const router = useRouter()
  const { user } = useAuthRedirect()

  const handleDay2Complete = async (submission: any) => {
    try {
      console.log('[v0] Day 2 submission saved:', submission)

      // Mark this task as complete in Supabase
      if (user?.id) {
        await markTaskComplete(30, 2, 'Día 2')
        console.log('[v0] Task marked complete: Día 2')
      }

      // Navigate to A2 progress dashboard with anchor to día-3
      router.push('/despega/a2-routes#dia-3')
    } catch (err) {
      console.error('[v0] Error saving Day 2:', err)
      throw err
    }
  }

  return (
    <A2DayPageTemplate dayNumber={DIA_NUM} userId={user?.id}>
      <Day2Experience onComplete={handleDay2Complete} userId={user?.id} />
    </A2DayPageTemplate>
  )
}

