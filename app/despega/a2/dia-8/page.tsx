'use client'

import { useRouter } from 'next/navigation'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { A2DayPageTemplate } from '@/components/a2-day-page-template'
import { Day8Experience } from '@/components/a2-day8-experience'
import { markTaskComplete } from '@/lib/supabase/task-completions'

const DIA_NUM = 8

export default function Dia8Page() {
  const router = useRouter()
  const { user } = useAuthRedirect()

  const handleDay8Complete = async (submission: any) => {
    try {
      console.log('[v0] Day 8 submission saved:', submission)
      if (user?.id) {
        await markTaskComplete(30, 8, 'Día 8')
      }
      router.push('/despega/a2-routes#dia-9')
    } catch (err) {
      console.error('[v0] Error saving Day 8:', err)
      throw err
    }
  }

  return (
    <A2DayPageTemplate dayNumber={DIA_NUM} userId={user?.id}>
      <Day8Experience onComplete={handleDay8Complete} userId={user?.id} />
    </A2DayPageTemplate>
  )
}
