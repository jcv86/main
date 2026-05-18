'use client'

import { useRouter } from 'next/navigation'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { A2DayPageTemplate } from '@/components/a2-day-page-template'
import { Day3Experience } from '@/components/a2-day3-experience'
import { markTaskComplete } from '@/lib/supabase/task-completions'

const DIA_NUM = 3

export default function Dia3Page() {
  const router = useRouter()
  const { user } = useAuthRedirect()

  const handleDay3Complete = async (submission: any) => {
    try {
      console.log('[v0] Day 3 submission saved:', submission)

      if (user?.id) {
        await markTaskComplete(30, 3, 'Día 3')
        console.log('[v0] Task marked complete: Día 3')
      }

      router.push('/despega/a2-routes#dia-4')
    } catch (err) {
      console.error('[v0] Error saving Day 3:', err)
      throw err
    }
  }

  return (
    <A2DayPageTemplate dayNumber={DIA_NUM} userId={user?.id}>
      <Day3Experience onComplete={handleDay3Complete} userId={user?.id} />
    </A2DayPageTemplate>
  )
}
